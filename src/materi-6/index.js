// Materi 6: "Ayo Mengeksplorasi dengan AR!" - Volume Kubus, Balok, dan Prisma (PRD-materi-6.md).
// Everything specific to this materi lives in this folder plus ../volume-model.js (the parametric
// model); it only talks to the scene through the sceneModule API ("Materi 6 additions" in
// ../threejs-scene-init.js: setVolumeModel / updateVolume / showVolumeCompare / setPickableParts,
// and the part-tap helpers shared with materi 5).
//
// AR only shows raw data the student obtained and sizes taken from the model's own mathematical
// dimensions (satuan). It never shows a total unit-cube count, a cross-section area, a volume or a
// formula (PRD section 2 / AC-7). Numbers the student works out (luas penampang, volume) are typed
// in by the student and only echoed back. View zoom (pinch, +/-) never changes the condition.
import './materi-6.css'
import {MATERI6_MARKUP} from './markup'
import {aspectsFor} from './aspects'
import {
  BOX_BASES, LAYER_RANGE, LENGTH_RANGE, SLICE_FRACS, VOLUME_VIEW_DEFAULT, prismMeasures,
} from '../volume-model'

// Where "Selesai Eksplorasi AR" sends the student (the e-module). Left empty until the URL is
// known; the flow then simply returns to the start screen.
const E_MODULE_URL = ''

const BASE_NAMES = {3: 'Segitiga', 4: 'Segiempat', 5: 'Segilima'}
const shapeName = (id) => {
  if (id === 'kubus') {
    return 'Kubus'
  }
  if (id === 'balok') {
    return 'Balok'
  }
  const n = Number(id.split('-')[1])
  return `Prisma ${BASE_NAMES[n] || `Segi-${n}`}`
}

const fmt = (value) => `${Number(Number(value).toFixed(2))} satuan`

const REMINDER_PRISM = 'Pada eksplorasi ini, bentuk dan ukuran penampang sejajar alas tetap. Ubah hanya panjang prisma.'
const HINT_K1 = 'Perhatikan banyak kubus satuan pada satu baris, satu kolom, atau satu lapisan.'
const HINT_K2_COMPARE = 'Perhatikan susunan kubus satuan pada setiap lapisan dan banyak lapisan pada kedua kondisi.'
const HINT_K4_USE = 'Perhatikan banyak kubus satuan pada satu lapisan dan jumlah lapisan yang menyusun bangun.'
const HINT_P1 = 'Perhatikan bentuk dan ukuran penampang ketika posisinya digeser sepanjang prisma.'
const HINT_P2_COMPARE = 'Perhatikan bentuk dan ukuran penampang sejajar alas serta panjang prisma pada kedua kondisi.'
const HINT_P4_USE = 'Perhatikan luas penampang sejajar alas dan panjang prisma yang kamu peroleh.'
const HINT_X_BOX = 'Coba perhatikan susunan kubus satuan, banyak kubus pada setiap lapisan, dan jumlah lapisannya.'
const HINT_X_PRISM = 'Coba perhatikan bentuk dan ukuran penampang sejajar alas serta panjang prismanya.'

// Session state (PRD section 6), one record per shape so data never mixes and switching shape
// never erases another shape's data. Everything condition-specific is keyed by the condition:
// layers (kubus/balok) or prism length. `areaValue` is the exception (prism cross-section stays the
// same when only the length changes), so it may be reused across lengths.
const newShapeState = (shapeId) => {
  const prism = shapeId.startsWith('prisma')
  const cond = prism ? 2 : 3
  return {
    shapeId,
    kind: prism ? 'prism' : 'box',
    sides: prism ? Number(shapeId.split('-')[1]) : null,
    placed: false,
    transform: null,
    introDone: false,
    cond,
    visited: [cond],
    slicePos: 0,
    unitsObs: {}, // cond -> true: student observed the unit cubes of one layer
    layersObs: {}, // cond -> true: student observed the number of layers
    areaValue: null, // prism: cross-section area as worked out (and typed in) by the student
    lengthObs: {}, // cond -> true: student obtained the prism length
    volumeValue: {}, // cond -> volume as typed in by the student (optional)
    volumeRecorded: {}, // cond -> true
    measurements: {}, // cond -> {partIndex: value}
    comparisonPairs: [],
    findingsRecorded: {}, // `${aspect}|${cond}` -> true (the text itself lives in the e-module)
    observedAspects: [],
    sufficiency: 'belum', // 'belum' | 'cukup' | 'perlu'
  }
}

export const initMateri6 = (sceneModule, {startAr}) => {
  const root = document.getElementById('materi-6-root')
  root.innerHTML = MATERI6_MARKUP

  const $ = (id) => document.getElementById(id)
  const screens = root.querySelectorAll('.screen')
  const bar = $('eksplorasi-bar-m6')
  const showScreen = (id) => {
    screens.forEach((el) => el.classList.add('hidden'))
    bar.classList.add('hidden')
    $(id).classList.remove('hidden')
  }
  const openBar = () => {
    screens.forEach((el) => el.classList.add('hidden'))
    bar.classList.remove('hidden')
  }

  const sessions = {}
  let S = null // state of the shape on screen
  let arStarted = false
  let surfaceValid = false // a detected surface is reused when switching shape (PRD 5.9)
  let lastPosition = null
  let queue = []
  let lastAspect = null
  let tapHandler = null
  let hintOn = false
  let hintText = ''

  // --- Per-shape helpers ---
  const isPrism = () => S.kind === 'prism'
  const condRange = () => (isPrism() ? LENGTH_RANGE : LAYER_RANGE[S.shapeId])
  const condText = (c) => (isPrism() ? `Panjang prisma = ${c} satuan` : `${c} lapisan`)
  const condShort = (c) => (isPrism() ? `Panjang ${c}` : `${c} lapisan`)
  const unitsPerLayer = () => BOX_BASES[S.shapeId].cols * BOX_BASES[S.shapeId].rows
  const specFor = (c) => (isPrism()
    ? {kind: 'prism', sides: S.sides, length: c}
    : {kind: 'box', ...BOX_BASES[S.shapeId], layers: c})

  // Measurable parts: kubus/balok = 3 rusuk; prism = base + height of the cross-section, then the
  // prism length. Values come from the mathematical model, never from what's drawn on screen.
  const parts = (c) => {
    if (isPrism()) {
      const meas = prismMeasures(S.sides)
      const names = {
        3: ['Alas segitiga', 'Tinggi segitiga'],
        4: ['Sisi alas persegi panjang', 'Tinggi persegi panjang'],
      }[S.sides] || ['Sisi alas segi-n', 'Apotema (jarak titik pusat ke sisi)']
      return [
        {name: names[0], value: meas.base},
        {name: names[1], value: meas.height},
        {name: 'Panjang prisma', value: c},
      ]
    }
    const {cols, rows} = BOX_BASES[S.shapeId]
    const names = S.shapeId === 'kubus'
      ? ['Rusuk alas 1', 'Rusuk alas 2', 'Rusuk tegak']
      : ['Panjang', 'Lebar', 'Tinggi']
    return [
      {name: names[0], value: cols},
      {name: names[1], value: rows},
      {name: names[2], value: c},
    ]
  }
  const measured = (c) => S.measurements[c] || {}
  const recordPart = (part, c) => {
    const value = parts(c)[part].value
    S.measurements[c] = {...measured(c), [part]: value}
    return value
  }
  const measuredLines = (c, only = null) => Object.keys(measured(c))
    .map(Number)
    .filter((part) => !only || only.includes(part))
    .sort((a, b) => a - b)
    .map((part) => `${parts(c)[part].name}: ${fmt(measured(c)[part])}`)

  // --- Eksplorasi bar helpers ---
  const setActions = (actions) => {
    const holder = $('m6-actions')
    holder.innerHTML = ''
    actions.forEach(({label, primary, small, onClick}) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.textContent = label
      btn.className = `${primary ? 'btn-primary' : 'btn-secondary'}${small ? ' small' : ''}`
      btn.addEventListener('click', onClick)
      holder.appendChild(btn)
    })
  }

  const setHint = () => {
    const el = $('m6-hint')
    el.textContent = hintOn ? hintText : ''
    el.classList.toggle('hidden', !hintOn)
  }

  // The hint stays hidden until the student presses this button (PRD principle 4 / AC-11).
  const hintAction = (text) => ({
    label: 'Butuh Petunjuk?',
    small: true,
    onClick: () => {
      hintText = text
      hintOn = !hintOn
      setHint()
    },
  })

  const setPicker = (cfg) => {
    const holder = $('m6-picker')
    holder.innerHTML = ''
    holder.classList.toggle('hidden', !cfg)
    if (!cfg) {
      return
    }
    cfg.items.forEach(({label, value}) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.textContent = label
      btn.className = `btn-secondary${value === cfg.active ? ' active' : ''}`
      btn.addEventListener('click', () => cfg.onPick(value))
      holder.appendChild(btn)
    })
  }

  const setInput = (cfg) => {
    $('m6-input').classList.toggle('hidden', !cfg)
    $('m6-input-error').classList.add('hidden')
    if (cfg) {
      $('m6-input-label').textContent = cfg.label
      $('m6-input-field').value = cfg.value === null || cfg.value === undefined ? '' : String(cfg.value)
    }
  }

  // Reads the number the student typed. Returns the number, null (empty and not required) or
  // undefined (invalid - an error is shown and the flow should stay where it is).
  const readInput = (required) => {
    const raw = $('m6-input-field').value.trim().replace(',', '.')
    const error = $('m6-input-error')
    if (raw === '') {
      if (required) {
        error.textContent = 'Tulis hasil hitunganmu dulu ya.'
        error.classList.remove('hidden')
        return undefined
      }
      return null
    }
    const value = Number(raw)
    if (!Number.isFinite(value) || value <= 0) {
      error.textContent = 'Tulis angka yang benar ya, misalnya 12.'
      error.classList.remove('hidden')
      return undefined
    }
    return value
  }

  const render = ({prompt, info = [], actions = [], picker = null, input = null, hint = ''}) => {
    hintOn = false
    $('m6-label').textContent = `${shapeName(S.shapeId)} — ${condText(S.cond)}`
    $('m6-label').classList.remove('hidden')
    $('m6-prompt').textContent = prompt
    const infoEl = $('m6-info')
    infoEl.innerHTML = info.join('<br>')
    infoEl.classList.toggle('hidden', info.length === 0)
    setPicker(picker)
    setInput(input)
    setActions(hint ? [...actions, hintAction(hint)] : actions)
    setHint()
    openBar()
  }

  const view = (patch) => sceneModule.updateVolume(patch)

  const clearScene = () => {
    tapHandler = null
    sceneModule.hideCompare()
    sceneModule.resetMarks()
    sceneModule.setAspectTarget('sisi')
    sceneModule.setPickableParts(null)
    view({...VOLUME_VIEW_DEFAULT})
  }

  const setCond = (c) => {
    S.cond = c
    if (!S.visited.includes(c)) {
      S.visited.push(c)
    }
    view(isPrism() ? {length: c} : {layers: c})
  }

  const condPicker = (onPick) => ({
    items: condRange().map((c) => ({label: isPrism() ? `${c} satuan` : `${c} lapisan`, value: c})),
    active: S.cond,
    onPick,
  })

  // --- Screens: awal -> pilih bangun -> deteksi/tempatkan -> model awal -> menu aspek ---
  $('btn-mulai-m6').addEventListener('click', () => {
    if (!arStarted) {
      arStarted = true
      startAr()
    }
    showPilihBangun()
  })

  let family = null
  const showPilihBangun = () => {
    $('alas-row-m6').classList.add('hidden')
    $('segin-row-m6').classList.add('hidden')
    $('btn-bangun-kembali-m6').classList.toggle('hidden', !S)
    showScreen('screen-pilih-bangun-m6')
  }

  $('bangun-grid-m6').addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) {
      return
    }
    if (btn.dataset.shape) {
      $('alas-row-m6').classList.add('hidden')
      chooseShape(btn.dataset.shape)
      return
    }
    family = btn.dataset.family
    $('segin-row-m6').classList.add('hidden')
    $('alas-row-m6').classList.remove('hidden')
  })
  $('alas-grid-m6').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-n]')
    if (btn) {
      chooseShape(`${family}-${btn.dataset.n}`)
    }
  })
  $('btn-alas-segin-m6').addEventListener('click', () => $('segin-row-m6').classList.toggle('hidden'))
  $('segin-slider-m6').addEventListener('input', (e) => {
    $('segin-value-m6').textContent = e.target.value
  })
  $('btn-pilih-segin-m6').addEventListener('click', () => chooseShape(`${family}-${$('segin-slider-m6').value}`))
  $('btn-bangun-kembali-m6').addEventListener('click', () => showMenu())

  const saveTransform = () => {
    if (S && S.placed) {
      S.transform = sceneModule.getModelTransform()
      if (S.transform) {
        lastPosition = S.transform.position
      }
    }
  }

  const chooseShape = (shapeId) => {
    saveTransform()
    if (!sessions[shapeId]) {
      sessions[shapeId] = newShapeState(shapeId)
    }
    S = sessions[shapeId]
    sceneModule.setNetMode(false)
    sceneModule.setVolumeModel(specFor(S.cond))
    tapHandler = null
    if (S.transform) {
      sceneModule.setModelTransform(S.transform)
    } else if (lastPosition) {
      // A new model appears where the previous one stood on the same surface.
      const transform = sceneModule.getModelTransform()
      if (transform) {
        transform.position[0] = lastPosition[0]
        transform.position[2] = lastPosition[2]
        sceneModule.setModelTransform(transform)
      }
    }
    // Reuse the surface that was already detected instead of scanning again (PRD 5.9, AC-12).
    if (!S.placed && surfaceValid) {
      S.placed = true
    }
    if (S.placed) {
      afterPlacement()
    } else {
      showPlacement()
    }
  }

  let placementTimer = null
  const showPlacement = () => {
    $('tempatkan-prompt-m6').textContent = 'Arahkan kamera ke permukaan datar di sekitarmu.'
    showScreen('screen-tempatkan-m6')
    clearTimeout(placementTimer)
    // The 8th Wall SLAM engine has no explicit "surface found" event, so the second prompt simply
    // follows after a moment of scanning.
    placementTimer = setTimeout(() => {
      $('tempatkan-prompt-m6').textContent = 'Permukaan ditemukan. Ketuk Tampilkan Model untuk menempatkan model.'
    }, 1500)
  }

  $('btn-tempatkan-m6').addEventListener('click', () => {
    clearTimeout(placementTimer)
    try {
      XR8.XrController.recenter()
    } catch (err) {
      // Camera/tracking not ready: the model is still shown at its default spot and Reset works.
    }
    S.placed = true
    surfaceValid = true
    afterPlacement()
  })

  const afterPlacement = () => {
    if (S.introDone) {
      showMenu()
      return
    }
    // 5.4 Eksplorasi awal: look around before collecting data.
    clearScene()
    render({
      prompt: `Amati ${shapeName(S.shapeId).toLowerCase()} dari berbagai arah sebelum mengumpulkan data.`,
      actions: [{label: 'Lanjutkan Eksplorasi', primary: true, onClick: () => {
        S.introDone = true
        showMenu()
      }}],
    })
  }

  // --- Menu Aspek (5.5) ---
  const aspekList = $('aspek-list-m6')
  const btnLanjut = $('btn-aspek-lanjut-m6')

  function showMenu() {
    clearScene()
    aspekList.innerHTML = aspectsFor(S.kind).map((aspect) => `
      <label>
        <input type="checkbox" value="${aspect.id}">
        <span>${aspect.label}${S.observedAspects.includes(aspect.id) ? ' ✓' : ''}</span>
      </label>
    `).join('')
    btnLanjut.disabled = true
    showScreen('screen-menu-aspek-m6')
  }

  aspekList.addEventListener('change', () => {
    btnLanjut.disabled = aspekList.querySelectorAll('input:checked').length === 0
  })
  btnLanjut.addEventListener('click', () => {
    // Chosen aspects run one after another; the student can still go back to the menu any time.
    queue = Array.from(aspekList.querySelectorAll('input:checked')).map((el) => el.value)
    startAspect(queue.shift())
  })

  // --- Model controls: rotate, move, view zoom (not the condition), reset (view only) ---
  $('btn-m6-putar').addEventListener('click', () => sceneModule.rotateModel(Math.PI / 6))
  $('btn-m6-besar').addEventListener('click', () => sceneModule.scaleModel(1.2))
  $('btn-m6-kecil').addEventListener('click', () => sceneModule.scaleModel(1 / 1.2))
  $('btn-m6-reset').addEventListener('click', () => sceneModule.resetModel())
  $('btn-m6-geser').addEventListener('click', (e) => {
    const on = !e.currentTarget.classList.contains('active')
    e.currentTarget.classList.toggle('active', on)
    sceneModule.setDragMode(on ? 'move' : 'rotate')
  })

  sceneModule.onPartTap((index) => {
    if (tapHandler) {
      tapHandler(index)
    }
  })

  // --- Shared steps ---
  const navActions = () => [
    {label: 'Kembali ke Aspek Pengamatan', onClick: () => showMenu()},
    {label: 'Periksa Kecukupan Data', primary: true, onClick: () => openKecukupan()},
  ]

  // "Catat Temuanmu": the student writes in the e-module; the button only confirms they may go on.
  const catatStep = ({title = 'Catat Temuanmu.', question, aspect, next}) => {
    tapHandler = null
    sceneModule.setSelectedPart(null)
    render({
      prompt: `${title} ${question} Tulis jawabanmu di e-module, lalu tekan tombol di bawah.`,
      actions: [{label: 'Sudah Dicatat', primary: true, onClick: () => {
        S.findingsRecorded[`${aspect}|${S.cond}`] = true
        next()
      }}],
    })
  }

  const afterCatat = ({prompt = 'Apa yang ingin kamu lakukan selanjutnya?', extra = []} = {}) => {
    clearScene()
    const actions = [...extra]
    if (queue.length > 0) {
      actions.push({label: 'Lanjut ke Aspek Terpilih Berikutnya', onClick: () => startAspect(queue.shift())})
    }
    actions.push(...navActions())
    render({prompt, actions})
  }

  // Tap a part of the model to measure it; only that part's value is shown (PRD 5.6 K3, 5.7 P3).
  const measureEngine = ({
    prompt, allowed = null, moreQuestion = 'Apakah kamu masih memerlukan ukuran bagian lain?', onEnough,
  }) => {
    sceneModule.setAspectTarget('rusuk-select')
    sceneModule.setPickableParts(allowed)
    sceneModule.setSelectedPart(null)
    tapHandler = (part) => {
      const value = recordPart(part, S.cond)
      sceneModule.setSelectedPart(part)
      render({
        prompt: moreQuestion,
        info: [`${parts(S.cond)[part].name}: ${fmt(value)}`],
        actions: [
          {label: 'Ukur Bagian Lain', onClick: () => {
            sceneModule.setSelectedPart(null)
            render({prompt: 'Pilih bagian lain yang ingin kamu ukur.'})
          }},
          {label: 'Data Ukuran Sudah Cukup', primary: true, onClick: onEnough},
        ],
      })
    }
    render({prompt})
  }

  // --- K1: Susunan Kubus Satuan (5.6) ---
  let highlightedLayer = -1
  const k1Observe = (prompt) => {
    render({
      prompt: prompt || 'Apa yang kamu amati dari susunan kubus satuan di dalam bangun? Kamu bebas mengelilingi bangun dari berbagai arah.',
      hint: HINT_K1,
      actions: [
        {label: highlightedLayer < 0 ? 'Sorot Satu Lapisan' : 'Sorot Lapisan Lain', onClick: () => {
          highlightedLayer = (highlightedLayer + 1) % S.cond
          view({unitsVisible: true, highlightLayer: highlightedLayer})
          S.unitsObs[S.cond] = true
          k1Observe('Informasi apa yang kamu peroleh dari lapisan yang disorot?')
        }},
        {label: 'Catat Temuanmu', primary: true, onClick: () => catatStep({
          question: 'Apa yang kamu temukan tentang susunan kubus satuan di dalam bangun?',
          aspect: 'k1',
          next: () => afterCatat({extra: [{label: 'Amati Susunan Lain', onClick: () => {
            highlightedLayer = -1
            view({unitsVisible: true, highlightLayer: null})
            k1Observe('Amati kembali susunan kubus satuan di dalam bangun.')
          }}]}),
        })},
      ],
    })
  }

  const k1 = () => {
    highlightedLayer = -1
    render({
      prompt: 'Model tetap berada di lingkungan AR. Amati susunan kubus satuan di dalam bangun.',
      actions: [{label: 'Tampilkan Kubus Satuan', primary: true, onClick: () => {
        view({unitsVisible: true})
        k1Observe()
      }}],
    })
  }

  // --- K2 / P2: Jumlah Lapisan / Panjang Prisma ---
  const condChange = (cfg) => () => {
    let from = null
    const compare = (c) => {
      sceneModule.showVolumeCompare(specFor(from), condShort(from), condShort(c))
      render({
        prompt: 'Bandingkan kedua kondisi. Apa persamaan dan perbedaan yang kamu temukan?',
        info: [`Kiri: ${condShort(from)} · Kanan: ${condShort(c)}`],
        hint: cfg.compareHint,
        actions: [{label: 'Kembali ke Kondisi Aktif', primary: true, onClick: () => {
          sceneModule.hideCompare()
          observe(c)
        }}],
      })
    }
    const catat = () => catatStep({
      question: cfg.catatQuestion,
      aspect: cfg.aspect,
      next: () => afterCatat({extra: [{label: cfg.retryLabel, onClick: () => startAspect(cfg.aspect)}]}),
    })
    const observe = (c) => {
      const actions = []
      if (from !== null) {
        actions.push({label: 'Bandingkan dengan Kondisi Sebelumnya', onClick: () => compare(c)})
      }
      actions.push({label: 'Catat Temuanmu', primary: true, onClick: catat})
      render({
        prompt: 'Perubahan apa yang kamu lihat? Kamu bebas bergerak mengelilingi, melihat dari atas, samping, dan depan.',
        picker: condPicker(pick),
        actions,
      })
    }
    const pick = (c) => {
      if (c === S.cond && from === null) {
        return
      }
      if (c !== S.cond) {
        from = S.cond
      }
      sceneModule.hideCompare()
      setCond(c)
      if (!isPrism()) {
        S.layersObs[c] = true
      }
      observe(c)
    }
    render({prompt: cfg.pickPrompt, info: cfg.pickInfo || [], picker: condPicker(pick)})
  }

  // --- K3 / P3: Ukuran Bangun ---
  const measureIntro = (aspect) => {
    render({
      prompt: isPrism() ? 'Pilih bagian prisma yang ingin kamu ukur.' : 'Pilih bagian bangun yang ingin kamu ukur.',
      actions: [{label: 'Mulai Mengukur', primary: true, onClick: () => measureEngine({
        prompt: 'Ketuk bagian yang ingin kamu ukur.',
        onEnough: () => measurePeriksa(aspect),
      })}],
    })
  }

  const measurePeriksa = (aspect) => {
    tapHandler = null
    sceneModule.setSelectedPart(null)
    render({
      prompt: 'Periksa Data Ukuranmu. Informasi ukuran apa yang kamu peroleh dari bangun ini? Catat di e-module, lalu tekan Sudah Dicatat.',
      info: measuredLines(S.cond),
      actions: [{label: 'Sudah Dicatat', primary: true, onClick: () => {
        S.findingsRecorded[`${aspect}|${S.cond}`] = true
        if (!isPrism()) {
          afterCatat({prompt: 'Data Ukuran Bangun Sudah Dicatat.'})
          return
        }
        const extra = [{label: 'Ukur pada Kondisi Lain', onClick: () => askCond(
          'Pilih panjang prisma yang ingin kamu ukur.', () => measureIntro(aspect)
        )}]
        if (comparablePairs().length > 0) {
          extra.push({label: 'Bandingkan Ukuran', onClick: choosePair})
        }
        afterCatat({prompt: 'Data Ukuran Prisma Sudah Dicatat.', extra})
      }}],
    })
  }

  // Pick another condition (layers / length), then continue with `next`.
  const askCond = (prompt, next) => {
    clearScene()
    render({
      prompt,
      info: isPrism() ? [REMINDER_PRISM] : [],
      picker: condPicker((c) => {
        setCond(c)
        next()
      }),
    })
  }

  // Pairs of measurements of the same part at two different lengths (only what the student measured).
  const comparablePairs = () => {
    const pairs = []
    for (let part = 0; part < 3; part++) {
      const conds = condRange().filter((c) => measured(c)[part] !== undefined)
      for (let i = 0; i < conds.length; i++) {
        for (let j = i + 1; j < conds.length; j++) {
          pairs.push({part, a: conds[i], b: conds[j]})
        }
      }
    }
    return pairs
  }

  const choosePair = () => {
    clearScene()
    render({
      prompt: 'Bandingkan Data Ukuran. Pilih dua hasil pengukuran yang ingin kamu bandingkan.',
      actions: [
        ...comparablePairs().map((pair) => ({
          label: `${parts(pair.b)[pair.part].name}: ${condShort(pair.a)} ↔ ${condShort(pair.b)}`,
          onClick: () => comparePair(pair, false),
        })),
        ...navActions().slice(0, 1),
      ],
    })
  }

  const comparePair = (pair, bothModels) => {
    const name = parts(pair.a)[pair.part].name
    const actions = []
    if (!bothModels) {
      actions.push({label: 'Lihat Kedua Model', onClick: () => {
        setCond(pair.b)
        sceneModule.showVolumeCompare(specFor(pair.a), condShort(pair.a), condShort(pair.b))
        comparePair(pair, true)
      }})
    }
    actions.push({label: 'Catat Hasil Perbandingan', primary: true, onClick: () => {
      sceneModule.hideCompare()
      S.comparisonPairs.push(pair)
      catatStep({
        title: 'Catat Hasil Perbandingan.',
        question: 'Apa yang kamu temukan dari perbandingan ukuran pada kedua kondisi?',
        aspect: 'p3-bandingkan',
        next: () => afterCatat({extra: [{label: 'Bandingkan Ukuran Lain', onClick: choosePair}]}),
      })
    }})
    render({
      prompt: 'Bandingkan ukuran pada kedua kondisi. Apa yang kamu temukan?',
      info: [
        `${name}, ${condShort(pair.a)}: ${fmt(measured(pair.a)[pair.part])}`,
        `${name}, ${condShort(pair.b)}: ${fmt(measured(pair.b)[pair.part])}`,
      ],
      actions,
    })
  }

  // --- P1: Penampang Sejajar Alas ---
  const p1Observe = (prompt) => {
    render({
      prompt: prompt || 'Amati penampang pada beberapa posisi sepanjang prisma. Apa yang kamu temukan?',
      picker: {
        items: SLICE_FRACS.map((_, i) => ({label: `Posisi ${i + 1}`, value: i})),
        active: S.slicePos,
        onPick: (i) => {
          S.slicePos = i
          view({sliceFrac: SLICE_FRACS[i]})
          p1Observe()
        },
      },
      hint: HINT_P1,
      actions: [{label: 'Catat Temuanmu', primary: true, onClick: () => catatStep({
        question: 'Apa yang kamu temukan tentang penampang sejajar alas pada beberapa posisi sepanjang prisma?',
        aspect: 'p1',
        next: () => afterCatat({extra: [{label: 'Amati Posisi Lain', onClick: () => {
          view({sliceOn: true, ghost: true, sliceFrac: SLICE_FRACS[S.slicePos]})
          p1Observe('Pilih posisi lain, lalu amati penampangnya.')
        }}]}),
      })}],
    })
  }

  const p1 = () => {
    render({
      prompt: 'Amati penampang sejajar alas di beberapa posisi sepanjang prisma.',
      actions: [{label: 'Tampilkan Penampang', primary: true, onClick: () => {
        view({sliceOn: true, ghost: true, sliceFrac: SLICE_FRACS[S.slicePos]})
        p1Observe()
      }}],
    })
  }

  // --- K4 / P4: Volume Bangun ---
  const has = {
    units: (c) => Boolean(S.unitsObs[c]),
    layers: (c) => Boolean(S.layersObs[c]),
    area: () => S.areaValue !== null,
    length: (c) => Boolean(S.lengthObs[c]) || measured(c)[2] !== undefined,
  }
  const ALL_ITEMS = () => (isPrism() ? ['area', 'length'] : ['units', 'layers'])
  const missingItems = (c) => ALL_ITEMS().filter((item) => (
    item === 'area' ? !has.area() : !has[item](c)
  ))
  const ITEM_LABELS = {
    units: 'Amati Kubus Satuan pada Satu Lapisan',
    layers: 'Amati Jumlah Lapisan',
    area: 'Amati/Ukur Penampang',
    length: 'Amati/Ukur Panjang Prisma',
  }

  // Only what the student has obtained on this condition (never a total, area or volume).
  const dataLines = (c) => {
    const lines = []
    if (isPrism()) {
      if (has.area()) {
        lines.push(`Luas penampang sejajar alas = ${S.areaValue} satuan²`)
      }
      if (has.length(c)) {
        lines.push(`Panjang prisma = ${c} satuan`)
      }
    } else {
      if (has.units(c)) {
        lines.push(`Kubus satuan pada satu lapisan = ${unitsPerLayer()}`)
      }
      if (has.layers(c)) {
        lines.push(`Jumlah lapisan = ${c}`)
      }
    }
    return lines
  }
  const volumeLine = (c) => (S.volumeValue[c] ? [`Volume = ${S.volumeValue[c]} satuan³ (hasil hitunganmu)`] : [])

  const recordedConds = () => condRange().filter((c) => S.volumeRecorded[c])

  const volSteps = {
    units: () => {
      view({unitsVisible: true, highlightLayer: 0})
      render({
        prompt: 'Satu lapisan disorot dan bagian lain dibuat lebih transparan. Amati dari berbagai arah. Berapa banyak kubus satuan yang kamu amati pada satu lapisan? Catat di e-module.',
        actions: [{label: 'Lanjutkan', primary: true, onClick: () => {
          S.unitsObs[S.cond] = true
          volPeriksa()
        }}],
      })
    },
    layers: () => {
      let shown = 1
      const step = () => {
        view({visibleLayers: shown})
        const done = shown >= S.cond
        render({
          prompt: done
            ? 'Amati banyak lapisan. Berapa banyak lapisan yang kamu amati? Catat di e-module.'
            : 'Amati banyak lapisan. Tampilkan lapisan satu per satu.',
          info: [`Lapisan yang ditampilkan: 1 sampai ${shown}`],
          actions: [done
            ? {label: 'Lanjutkan', primary: true, onClick: () => {
              S.layersObs[S.cond] = true
              volPeriksa()
            }}
            : {label: 'Tampilkan Lapisan Berikutnya', primary: true, onClick: () => {
              shown += 1
              step()
            }}],
        })
      }
      step()
    },
    area: () => {
      view({sliceOn: true, ghost: true, sliceFrac: 0.5})
      render({
        prompt: 'Amati penampang yang sejajar dengan alas. Pilih bagian yang perlu kamu ukur.',
        actions: [{label: 'Mulai Mengukur', primary: true, onClick: () => measureEngine({
          prompt: 'Ketuk bagian penampang yang ingin kamu ukur.',
          allowed: [0, 1],
          moreQuestion: 'Apakah kamu masih memerlukan ukuran bagian lain pada penampang?',
          onEnough: areaInput,
        })}],
      })
    },
    length: () => {
      view({lengthHighlight: true, ghost: true})
      const pickLength = () => {
        sceneModule.setAspectTarget('rusuk-select')
        sceneModule.setPickableParts([2])
        sceneModule.setSelectedPart(null)
        tapHandler = () => {
          const value = recordPart(2, S.cond)
          sceneModule.setSelectedPart(2)
          tapHandler = null
          render({
            prompt: 'Informasi panjang prisma apa yang kamu peroleh? Catat di e-module.',
            info: [`Panjang prisma = ${fmt(value)}`],
            actions: [{label: 'Lanjutkan', primary: true, onClick: () => {
              S.lengthObs[S.cond] = true
              volPeriksa()
            }}],
          })
        }
        render({prompt: 'Ketuk bagian yang menunjukkan panjang prisma.'})
      }
      render({
        prompt: 'Arah memanjang prisma disorot. Pilih bagian yang menunjukkan panjang prisma.',
        actions: [{label: 'Mulai Mengukur', primary: true, onClick: pickLength}],
      })
    },
  }

  // The student works out the cross-section area in the e-module; AR only stores what they type.
  const areaInput = () => {
    tapHandler = null
    sceneModule.setSelectedPart(null)
    render({
      prompt: 'Gunakan ukuran yang kamu peroleh untuk menentukan luas penampang sejajar alas. Hitung di e-module, lalu tulis hasilmu di kolom berikut.',
      info: measuredLines(S.cond, [0, 1]),
      input: {label: 'Luas penampang sejajar alas (satuan²)', value: S.areaValue},
      actions: [{label: 'Lanjutkan', primary: true, onClick: () => {
        const value = readInput(true)
        if (value === undefined) {
          return
        }
        S.areaValue = value
        volPeriksa()
      }}],
    })
  }

  function volStart() {
    render({
      prompt: isPrism()
        ? 'Gunakan informasi penampang sejajar alas dan panjang prisma untuk menentukan volume prisma pada kondisi ini.'
        : 'Gunakan informasi susunan kubus satuan yang sudah kamu peroleh untuk menentukan volume bangun pada kondisi ini.',
      actions: [{label: 'Mulai Menyelidiki', primary: true, onClick: volCheck}],
    })
  }

  // Checks only this condition's data (plus the prism's cross-section, which stays the same).
  function volCheck() {
    clearScene()
    if (missingItems(S.cond).length === 0) {
      render({
        prompt: isPrism()
          ? 'Data Pengamatan Sudah Tersedia. Kamu sudah memperoleh data yang diperlukan pada kondisi ini.'
          : 'Data Pengamatan Sudah Tersedia. Kamu sudah memperoleh data tentang susunan kubus satuan pada kondisi ini.',
        info: dataLines(S.cond),
        actions: [
          {label: 'Gunakan Data Sebelumnya', primary: true, onClick: volUse},
          {label: isPrism() ? 'Amati/Ukur Kembali' : 'Amati Kembali', onClick: () => volLengkapi(true)},
        ],
      })
      return
    }
    volLengkapi(false)
  }

  // Shows a button only for the data that is still missing; the student stays in Volume Bangun.
  function volLengkapi(all) {
    clearScene()
    const items = all ? ALL_ITEMS() : missingItems(S.cond)
    render({
      prompt: 'Lengkapi Data Pengamatan. Masih ada informasi yang kamu perlukan. Lengkapi pengamatan terlebih dahulu.',
      info: dataLines(S.cond),
      actions: items.map((item) => ({label: ITEM_LABELS[item], primary: true, onClick: volSteps[item]})),
    })
  }

  function volPeriksa() {
    clearScene()
    const missing = missingItems(S.cond)
    let actions
    if (missing.length > 0) {
      actions = isPrism()
        ? [{label: 'Lengkapi Data', primary: true, onClick: () => volLengkapi(false)}]
        : missing.map((item) => ({label: ITEM_LABELS[item], primary: true, onClick: volSteps[item]}))
    } else {
      actions = [{label: 'Data Pengamatan Sudah Cukup', primary: true, onClick: volUse}]
    }
    render({
      prompt: isPrism()
        ? 'Periksa Datamu. Ini data yang sudah kamu peroleh pada kondisi ini.'
        : 'Apakah kamu masih memerlukan informasi lain untuk menentukan volume pada kondisi ini?',
      info: dataLines(S.cond),
      actions,
    })
  }

  function volUse() {
    clearScene()
    render({
      prompt: isPrism()
        ? 'Gunakan Data yang Kamu Peroleh. Gunakan data yang kamu peroleh untuk menentukan volume prisma pada kondisi ini. Hitung dan catat di e-module.'
        : 'Gunakan Data yang Kamu Peroleh. Gunakan data yang kamu peroleh untuk menentukan banyak seluruh kubus satuan yang menyusun bangun. Hitung dan catat di e-module.',
      info: dataLines(S.cond),
      hint: isPrism() ? HINT_P4_USE : HINT_K4_USE,
      actions: [{label: 'Lanjutkan', primary: true, onClick: isPrism() ? volCatat : volHubungkan}],
    })
  }

  function volHubungkan() {
    render({
      prompt: 'Hubungkan dengan Volume. Berdasarkan susunan kubus satuan tersebut, berapa volume bangun pada kondisi ini?',
      info: dataLines(S.cond),
      actions: [
        {label: 'Amati Kembali Bangun', onClick: () => view({unitsVisible: true})},
        {label: 'Lanjutkan', primary: true, onClick: volCatat},
      ],
    })
  }

  function volCatat() {
    render({
      prompt: isPrism()
        ? 'Catat Hasilmu. Catat data penampang, panjang, dan volume prisma pada kondisi ini di e-module, lalu tekan Sudah Dicatat.'
        : 'Catat Hasilmu. Catat data susunan kubus satuan dan volume bangun pada kondisi ini di e-module, lalu tekan Sudah Dicatat.',
      info: dataLines(S.cond),
      input: {
        label: 'Opsional: tulis volume hasil hitunganmu (satuan³) agar ikut tampil saat membandingkan.',
        value: S.volumeValue[S.cond] || null,
      },
      actions: [{label: 'Sudah Dicatat', primary: true, onClick: () => {
        const value = readInput(false)
        if (value === undefined) {
          return
        }
        if (value !== null) {
          S.volumeValue[S.cond] = value
        }
        S.volumeRecorded[S.cond] = true
        volSaved()
      }}],
    })
  }

  function volSaved() {
    const extra = []
    if (recordedConds().length >= 2) {
      extra.push({label: 'Bandingkan Hasil', onClick: volChoosePair})
    }
    extra.push({label: isPrism() ? 'Coba Panjang Prisma Lain' : 'Coba Jumlah Lapisan Lain', onClick: volTryOther})
    afterCatat({prompt: 'Data Volume Bangun Sudah Dicatat.', extra})
  }

  // A different condition: the student picks it and then continues the investigation on it.
  function volTryOther() {
    clearScene()
    const pick = (c) => {
      setCond(c)
      render({
        prompt: isPrism() ? 'Amati prisma setelah panjangnya diubah.' : 'Amati bangun setelah jumlah lapisannya diubah.',
        info: isPrism() ? [REMINDER_PRISM] : [],
        picker: condPicker(pick),
        actions: [{label: 'Lanjutkan Penyelidikan Volume', primary: true, onClick: volRecheck}],
      })
    }
    render({
      prompt: isPrism() ? 'Pilih Panjang Prisma.' : 'Pilih Jumlah Lapisan.',
      info: isPrism() ? [REMINDER_PRISM] : [],
      picker: condPicker(pick),
    })
  }

  function volRecheck() {
    if (!isPrism()) {
      volCheck()
      return
    }
    // The student chose and looked at this length, so the length counts as obtained.
    S.lengthObs[S.cond] = true
    if (!has.area() || S.volumeRecorded[S.cond]) {
      volCheck()
      return
    }
    clearScene()
    render({
      prompt: 'Data yang Dapat Digunakan Kembali. Bentuk dan ukuran penampang sejajar alas tidak berubah, jadi luas penampang dari pengamatan sebelumnya masih dapat dipakai. Hanya panjang prisma yang baru.',
      info: dataLines(S.cond),
      actions: [
        {label: 'Gunakan Data Ini', primary: true, onClick: volUse},
        {label: 'Amati/Ukur Kembali', onClick: () => volLengkapi(true)},
      ],
    })
  }

  const captionFor = (c) => {
    const lines = [condShort(c)]
    if (isPrism()) {
      lines.push(has.area() ? `Luas penampang = ${S.areaValue}` : 'Luas: di e-module')
    } else {
      lines.push(`${unitsPerLayer()} kubus satuan/lapisan`)
    }
    lines.push(S.volumeValue[c] ? `Volume = ${S.volumeValue[c]}` : 'Volume: di e-module')
    return lines.join('\n')
  }

  function volChoosePair() {
    clearScene()
    const conds = recordedConds()
    const actions = []
    for (let i = 0; i < conds.length; i++) {
      for (let j = i + 1; j < conds.length; j++) {
        actions.push({
          label: `${condShort(conds[i])} ↔ ${condShort(conds[j])}`,
          onClick: () => volCompare(conds[i], conds[j]),
        })
      }
    }
    render({
      prompt: 'Bandingkan Hasil. Pilih dua hasil pengamatan yang ingin kamu bandingkan.',
      actions: [...actions, ...navActions().slice(0, 1)],
    })
  }

  function volCompare(a, b) {
    setCond(b)
    sceneModule.showVolumeCompare(specFor(a), captionFor(a), captionFor(b))
    const block = (c) => [`${condShort(c)}:`, ...dataLines(c), ...volumeLine(c)]
    render({
      prompt: isPrism()
        ? 'Bandingkan panjang prisma dan volume pada kedua kondisi. Apa persamaan atau perbedaan yang kamu temukan?'
        : 'Bandingkan jumlah lapisan dan volume pada kedua kondisi. Apa yang kamu temukan?',
      info: [...block(a), ...block(b)],
      actions: [{label: 'Catat Hasil Perbandingan', primary: true, onClick: () => {
        sceneModule.hideCompare()
        S.comparisonPairs.push({a, b})
        catatStep({
          title: 'Catat Hasil Perbandingan.',
          question: 'Apa yang kamu temukan dari perbandingan kedua hasil pengamatan?',
          aspect: 'volume-bandingkan',
          next: () => afterCatat({extra: [
            {label: 'Bandingkan Hasil Lain', onClick: volChoosePair},
            ...(isPrism() ? [{label: 'Coba Panjang Prisma Lain', onClick: volTryOther}] : []),
          ]}),
        })
      }}],
    })
  }

  // --- X: Informasi Lainnya (5.8) ---
  const freeState = {units: false, layer: -1, slice: false, pos: 0}

  const xFree = (prompt, {info = [], pickCond = false} = {}) => {
    const box = !isPrism()
    const actions = []
    if (box) {
      actions.push({label: freeState.units ? 'Sembunyikan Kubus Satuan' : 'Tampilkan Kubus Satuan', onClick: () => {
        freeState.units = !freeState.units
        if (!freeState.units) {
          freeState.layer = -1
        }
        view({unitsVisible: freeState.units, highlightLayer: null})
        xFree(freeState.units ? 'Kubus satuan ditampilkan. Adakah informasi lain yang kamu temukan?' : 'Kubus satuan disembunyikan.')
      }})
      actions.push({label: 'Sorot Lapisan', onClick: () => {
        freeState.units = true
        freeState.layer = (freeState.layer + 1) % S.cond
        view({unitsVisible: true, highlightLayer: freeState.layer})
        xFree('Satu lapisan disorot. Adakah informasi lain yang kamu temukan?')
      }})
      actions.push({label: 'Ubah Jumlah Lapisan', onClick: () => xFree('Pilih jumlah lapisan yang ingin kamu coba.', {pickCond: true})})
    } else {
      actions.push({label: freeState.slice ? 'Sembunyikan Penampang' : 'Tampilkan Penampang', onClick: () => {
        freeState.slice = !freeState.slice
        view({sliceOn: freeState.slice, ghost: freeState.slice, sliceFrac: SLICE_FRACS[freeState.pos]})
        xFree(freeState.slice ? 'Penampang ditampilkan. Adakah informasi lain yang kamu temukan?' : 'Penampang disembunyikan.')
      }})
      actions.push({label: 'Geser Penampang', onClick: () => {
        if (!freeState.slice) {
          freeState.slice = true
          view({sliceOn: true, ghost: true})
        } else {
          freeState.pos = (freeState.pos + 1) % SLICE_FRACS.length
        }
        view({sliceFrac: SLICE_FRACS[freeState.pos]})
        xFree('Penampang digeser. Adakah informasi lain yang kamu temukan?')
      }})
      actions.push({label: 'Ubah Panjang Prisma', onClick: () => xFree('Pilih panjang prisma yang ingin kamu coba.', {pickCond: true})})
    }
    actions.push({label: 'Pilih Bagian', onClick: () => {
      sceneModule.setAspectTarget('rusuk-select')
      sceneModule.setPickableParts(null)
      tapHandler = (part) => {
        sceneModule.setSelectedPart(part)
        xFree('Apa yang kamu perhatikan pada bagian yang kamu pilih?')
      }
      xFree('Ketuk bagian yang ingin kamu perhatikan.')
    }})
    actions.push({label: 'Ukur Bagian', onClick: () => {
      sceneModule.setAspectTarget('rusuk-select')
      sceneModule.setPickableParts(null)
      tapHandler = (part) => {
        const value = recordPart(part, S.cond)
        sceneModule.setSelectedPart(part)
        xFree('Apa yang kamu perhatikan pada bagian yang kamu ukur?', {info: [`${parts(S.cond)[part].name}: ${fmt(value)}`]})
      }
      xFree('Ketuk bagian yang ingin kamu ukur.')
    }})
    actions.push({label: 'Saya Menemukan Sesuatu', primary: true, onClick: () => catatStep({
      question: 'Informasi lain apa yang kamu temukan dari hasil pengamatanmu?',
      aspect: 'x',
      next: () => afterCatat({extra: [{label: 'Lanjut Eksplorasi Bebas', onClick: () => xFree('Lanjutkan eksplorasimu.')}]}),
    })})
    render({
      prompt,
      info,
      hint: box ? HINT_X_BOX : HINT_X_PRISM,
      picker: pickCond ? condPicker((c) => {
        setCond(c)
        if (freeState.layer >= c) {
          freeState.layer = -1
          view({highlightLayer: null})
        }
        xFree(isPrism() ? 'Setelah panjang prisma diubah, adakah informasi lain yang kamu temukan?' : 'Setelah jumlah lapisan diubah, adakah informasi lain yang kamu temukan?')
      }) : null,
      actions,
    })
  }

  const xIntro = () => {
    freeState.units = false
    freeState.layer = -1
    freeState.slice = false
    freeState.pos = 0
    render({
      prompt: 'Temukan Informasi Lainnya. Amati kembali model dan data yang telah kamu peroleh. Adakah informasi lain yang kamu temukan? Jelajahi bagian yang menurutmu dapat melengkapi informasi yang sudah kamu peroleh.',
      actions: [{label: 'Mulai Eksplorasi Bebas', primary: true, onClick: () => xFree('Jelajahi model dengan bebas.')}],
    })
  }

  // --- Aspect dispatch ---
  // "Coba kondisi lain" (from Periksa Kecukupan) re-enters an aspect with a condition picker first.
  const withPicker = (flow, prompt) => (opts = {}) => {
    if (opts.pickCond) {
      askCond(typeof prompt === 'function' ? prompt() : prompt, () => flow())
      return
    }
    flow()
  }
  const pickBox = 'Pilih jumlah lapisan yang ingin kamu coba.'
  const pickPrism = 'Pilih panjang prisma yang ingin kamu coba.'

  const ASPECT_FLOWS = {
    k1: withPicker(k1, pickBox),
    k2: condChange({
      aspect: 'k2',
      pickPrompt: 'Pilih jumlah lapisan yang ingin kamu amati. Kubus satuan pada setiap lapisan tetap.',
      compareHint: HINT_K2_COMPARE,
      catatQuestion: 'Apa yang kamu temukan setelah jumlah lapisan diubah?',
      retryLabel: 'Coba Jumlah Lapisan Lain',
    }),
    k3: withPicker(() => measureIntro('k3'), pickBox),
    k4: (opts = {}) => (opts.pickCond ? volTryOther() : volStart()),
    p1: withPicker(p1, pickPrism),
    p2: condChange({
      aspect: 'p2',
      pickPrompt: 'Pilih panjang prisma yang ingin kamu amati.',
      pickInfo: [REMINDER_PRISM],
      compareHint: HINT_P2_COMPARE,
      catatQuestion: 'Apa yang kamu temukan setelah panjang prisma diubah?',
      retryLabel: 'Coba Panjang Prisma Lain',
    }),
    p3: withPicker(() => measureIntro('p3'), pickPrism),
    p4: (opts = {}) => (opts.pickCond ? volTryOther() : volStart()),
    x: withPicker(xIntro, () => (isPrism() ? pickPrism : pickBox)),
  }

  function startAspect(aspectId, opts = {}) {
    lastAspect = aspectId
    if (!S.observedAspects.includes(aspectId)) {
      S.observedAspects.push(aspectId)
    }
    clearScene()
    ASPECT_FLOWS[aspectId](opts)
  }

  // --- Periksa Kecukupan Data (5.9, and 5.7 item 11 for prisma) ---
  const kecOptions = $('kecukupan-options-m6')
  const setKecOptions = (options) => {
    kecOptions.innerHTML = ''
    options.forEach(({label, onClick}) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'btn-secondary'
      btn.textContent = label
      btn.addEventListener('click', onClick)
      kecOptions.appendChild(btn)
    })
  }

  // The aspect to re-enter for "Coba Kondisi Lain": the last one used, else the one about conditions.
  const relevantAspect = () => {
    const ids = aspectsFor(S.kind).map((aspect) => aspect.id)
    return lastAspect && ids.includes(lastAspect) ? lastAspect : ids[1]
  }

  function openKecukupan() {
    clearScene()
    $('kecukupan-prompt-m6').textContent = isPrism()
      ? 'Apakah informasi dari AR sudah cukup untuk melengkapi penyelidikanmu tentang hubungan luas penampang sejajar alas, panjang prisma, dan volume prisma?'
      : 'Apakah informasi dari AR sudah cukup untuk melengkapi penyelidikan tentang volume kubus, balok, atau prisma yang kamu amati?'
    $('kecukupan-step1-m6').classList.remove('hidden')
    $('kecukupan-step2-m6').classList.add('hidden')
    showScreen('screen-kecukupan-m6')
  }
  $('btn-menu-kecukupan-m6').addEventListener('click', openKecukupan)
  $('btn-sudah-cukup-m6').addEventListener('click', () => {
    S.sufficiency = 'cukup'
    showScreen('screen-selesai-m6')
  })
  $('btn-perlu-tambahan-m6').addEventListener('click', () => {
    S.sufficiency = 'perlu'
    const amatiLain = () => {
      saveTransform()
      showPilihBangun()
    }
    const options = isPrism()
      ? [
        {label: 'Coba Panjang Prisma Lain', onClick: () => {
          lastAspect = 'p4'
          volTryOther()
        }},
        {label: 'Amati/Ukur Penampang Kembali', onClick: () => {
          lastAspect = 'p4'
          volSteps.area()
        }},
        {label: 'Amati/Ukur Panjang Prisma', onClick: () => {
          lastAspect = 'p4'
          volSteps.length()
        }},
        {label: 'Pilih Prisma Lain', onClick: amatiLain},
        {label: 'Kembali ke Aspek Pengamatan', onClick: () => showMenu()},
      ]
      : [
        {label: 'Coba Kondisi Lain', onClick: () => startAspect(relevantAspect(), {pickCond: true})},
        {label: 'Amati Bangun Lain', onClick: amatiLain},
        {label: 'Kembali ke Aspek Pengamatan', onClick: () => showMenu()},
      ]
    setKecOptions(options)
    $('kecukupan-step1-m6').classList.add('hidden')
    $('kecukupan-step2-m6').classList.remove('hidden')
  })

  // --- Layar Penutup (5.10) ---
  $('btn-selesai-m6').addEventListener('click', () => {
    if (E_MODULE_URL) {
      window.location.href = E_MODULE_URL
      return
    }
    showScreen('screen-awal-m6')
  })

  showScreen('screen-awal-m6')
}
