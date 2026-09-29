// Materi 5: "Ayo Mengeksplorasi dengan AR!" - Faktor Skala & Luas Permukaan Bangun Ruang
// (PRD-materi-5.md). Everything specific to this materi lives in this folder; it only talks to the
// outside world through initMateri5's arguments and the sceneModule API (see
// ../threejs-scene-init.js, "Materi 5 additions": setK/showCompare/onPartTap/setSelectedPart).
//
// AR only ever shows raw length data taken from the model's own dimensions (base value x k, one
// source of truth). It never shows a formula, a ratio, a surface area, or a conclusion (PRD
// section 2 / AC-11). The view zoom (pinch, +/-) is separate from k and never changes a value.
import './materi-5.css'
import {MATERI5_MARKUP} from './markup'
import {ASPECTS} from './aspects'

// Where "Selesai Eksplorasi AR" sends the student (the e-module). Left empty until the URL is
// known; the flow then simply returns to the start screen.
const E_MODULE_URL = ''

const K_VALUES = [0.5, 1, 2, 3]
const kText = (k) => (k === 0.5 ? '½' : String(k))

const SHAPE_NAMES = {kubus: 'Kubus', balok: 'Balok'}
const BASE_NAMES = {3: 'Segitiga', 4: 'Segiempat', 5: 'Segilima'}
const shapeName = (id) => {
  if (SHAPE_NAMES[id]) {
    return SHAPE_NAMES[id]
  }
  const [family, n] = id.split('-')
  const alas = BASE_NAMES[n] || `Segi-${n}`
  return `${family === 'prisma' ? 'Prisma' : 'Limas'} ${alas}`
}

// Base lengths (at k=1). The kubus is 8 cm per side (PRD example); the other shapes use 10 cm per
// scene unit. Values are rounded to whole even numbers so k=½ still gives a readable number.
const cmPerUnit = (shapeId) => (shapeId === 'kubus' ? 8 : 10)
const baseCm = (shapeId, units) => Math.max(2, Math.round((units * cmPerUnit(shapeId)) / 2) * 2)
const fmtCm = (value) => `${Number(value.toFixed(1))} cm`

const HINT_M1 = 'Perhatikan bentuk dan ukuran model sebelum dan setelah faktor skala diubah.'
const HINT_M3 = 'Coba perhatikan kembali bentuk, ukuran, posisi, atau perubahan bagian-bagian bangun ketika faktor skala diubah.'

// Session state (PRD section 6), one record per shape so data never mixes and switching shape
// never erases another shape's data.
const newShapeState = (shapeId) => ({
  shapeId,
  placed: false,
  transform: null,
  introDone: false,
  activeK: 1,
  observedK: [1],
  measurements: {}, // kKey -> {partId: cm}
  comparisonPairs: [], // [{part, a, b}]
  findingsRecorded: {}, // `${aspect}|${k}` -> true (the text itself lives in the e-module)
  observedAspects: [],
  sufficiency: 'belum', // 'belum' | 'cukup' | 'perlu'
})

export const initMateri5 = (sceneModule, {startAr}) => {
  const root = document.getElementById('materi-5-root')
  root.innerHTML = MATERI5_MARKUP

  const $ = (id) => document.getElementById(id)
  const screens = root.querySelectorAll('.screen')
  const bar = $('eksplorasi-bar-m5')
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
  let queue = []
  let lastAspect = 'm1'
  let tapHandler = null
  let compareShown = false
  let hintOn = false
  let hintText = ''
  let partUnits = []

  const partName = (i) => `Rusuk ${i + 1}`
  const kKey = (k) => String(k)
  const partCm = (i) => baseCm(S.shapeId, partUnits[i])
  const measured = (k) => S.measurements[kKey(k)] || {}
  const record = (part, k) => {
    S.measurements[kKey(k)] = {...measured(k), [part]: partCm(part) * k}
    return partCm(part) * k
  }

  // --- Eksplorasi bar helpers ---
  const setActions = (actions) => {
    const holder = $('m5-actions')
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
    const el = $('m5-hint')
    el.textContent = hintOn ? hintText : ''
    el.classList.toggle('hidden', !hintOn)
  }

  // The hint stays hidden until the student presses this button (PRD principle 3 / AC-10).
  const hintAction = (text) => ({
    label: 'Butuh Petunjuk?',
    small: true,
    onClick: () => {
      hintText = text
      hintOn = !hintOn
      setHint()
    },
  })

  const setKPicker = (onPick) => {
    const holder = $('m5-k')
    holder.innerHTML = ''
    holder.classList.toggle('hidden', !onPick)
    if (!onPick) {
      return
    }
    K_VALUES.forEach((k) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.textContent = kText(k)
      btn.className = `btn-secondary${k === S.activeK ? ' active' : ''}`
      btn.addEventListener('click', () => onPick(k))
      holder.appendChild(btn)
    })
  }

  const render = ({prompt, info = [], actions = [], kPicker = null, hint = '', trailer = false}) => {
    hintOn = false
    $('m5-label').textContent = `${shapeName(S.shapeId)} — k=${kText(S.activeK)}`
    $('m5-label').classList.remove('hidden')
    $('m5-prompt').textContent = prompt
    const infoEl = $('m5-info')
    infoEl.innerHTML = info.join('<br>')
    infoEl.classList.toggle('hidden', info.length === 0)
    setKPicker(kPicker)
    setActions(hint ? [...actions, hintAction(hint)] : actions)
    setHint()
    $('m5-trailer').classList.toggle('hidden', !trailer)
    openBar()
  }

  const clearScene = () => {
    tapHandler = null
    compareShown = false
    sceneModule.hideCompare()
    sceneModule.resetMarks()
    sceneModule.setFaceView({})
    sceneModule.setAspectTarget('sisi')
  }

  const setK = (k, immediate = false) => {
    S.activeK = k
    if (!S.observedK.includes(k)) {
      S.observedK.push(k)
    }
    sceneModule.setK(k, immediate)
  }

  // --- Screens: awal -> pilih bangun -> deteksi/tempatkan -> model awal -> menu aspek ---
  $('btn-mulai-m5').addEventListener('click', () => {
    if (!arStarted) {
      arStarted = true
      startAr()
    }
    showPilihBangun()
  })

  let family = null
  const showPilihBangun = () => {
    $('alas-row-m5').classList.add('hidden')
    $('segin-row-m5').classList.add('hidden')
    $('btn-bangun-kembali-m5').classList.toggle('hidden', !S)
    showScreen('screen-pilih-bangun-m5')
  }

  $('bangun-grid-m5').addEventListener('click', (e) => {
    const btn = e.target.closest('button')
    if (!btn) {
      return
    }
    if (btn.dataset.shape) {
      chooseShape(btn.dataset.shape)
      return
    }
    family = btn.dataset.family
    $('alas-family-m5').textContent = family === 'prisma' ? 'prisma' : 'limas'
    $('segin-row-m5').classList.add('hidden')
    $('alas-row-m5').classList.remove('hidden')
  })
  $('alas-grid-m5').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-n]')
    if (btn) {
      chooseShape(`${family}-${btn.dataset.n}`)
    }
  })
  $('btn-alas-segin-m5').addEventListener('click', () => $('segin-row-m5').classList.toggle('hidden'))
  $('segin-slider-m5').addEventListener('input', (e) => {
    $('segin-value-m5').textContent = e.target.value
  })
  $('btn-pilih-segin-m5').addEventListener('click', () => chooseShape(`${family}-${$('segin-slider-m5').value}`))
  $('btn-bangun-kembali-m5').addEventListener('click', showMenu)

  const saveTransform = () => {
    if (S && S.placed) {
      S.transform = sceneModule.getModelTransform()
    }
  }

  const chooseShape = (shapeId) => {
    saveTransform()
    if (!sessions[shapeId]) {
      sessions[shapeId] = newShapeState(shapeId)
    }
    S = sessions[shapeId]
    sceneModule.setNetMode(false)
    sceneModule.setShape(shapeId)
    sceneModule.setTransparent(false)
    clearScene()
    partUnits = sceneModule.getPartUnits()
    if (S.transform) {
      sceneModule.setModelTransform(S.transform)
    }
    sceneModule.setK(S.activeK, true)
    if (S.placed) {
      afterPlacement()
    } else {
      showPlacement()
    }
  }

  let placementTimer = null
  const showPlacement = () => {
    $('tempatkan-prompt-m5').textContent = 'Arahkan kamera ke permukaan datar di sekitarmu.'
    showScreen('screen-tempatkan-m5')
    clearTimeout(placementTimer)
    // The 8th Wall SLAM engine has no explicit "surface found" event, so the second prompt simply
    // follows after a moment of scanning.
    placementTimer = setTimeout(() => {
      $('tempatkan-prompt-m5').textContent = 'Permukaan ditemukan. Ketuk untuk menempatkan model.'
    }, 1500)
  }

  $('btn-tempatkan-m5').addEventListener('click', () => {
    clearTimeout(placementTimer)
    try {
      XR8.XrController.recenter()
    } catch (err) {
      // Camera/tracking not ready: the model is still shown at its default spot and Reset works.
    }
    S.placed = true
    afterPlacement()
  })

  const afterPlacement = () => {
    if (S.introDone) {
      showMenu()
      return
    }
    // 4.4 Model awal (k=1): look around before changing the scale.
    clearScene()
    setK(1, true)
    render({
      prompt: 'Amati model dari berbagai arah sebelum mengubah faktor skala.',
      actions: [{label: 'Lanjutkan Eksplorasi', primary: true, onClick: () => {
        S.introDone = true
        showMenu()
      }}],
    })
  }

  // --- Menu Aspek (4.5) ---
  const aspekList = $('aspek-list-m5')
  const btnLanjut = $('btn-aspek-lanjut-m5')

  function showMenu() {
    clearScene()
    aspekList.innerHTML = ASPECTS.map((aspect) => `
      <label>
        <input type="checkbox" value="${aspect.id}">
        <span>${aspect.label}${S.observedAspects.includes(aspect.id) ? ' ✓' : ''}</span>
      </label>
    `).join('')
    btnLanjut.disabled = true
    showScreen('screen-menu-aspek-m5')
  }

  aspekList.addEventListener('change', () => {
    btnLanjut.disabled = aspekList.querySelectorAll('input:checked').length === 0
  })
  btnLanjut.addEventListener('click', () => {
    // Chosen aspects run one after another; the student can still go back to the menu any time.
    queue = Array.from(aspekList.querySelectorAll('input:checked')).map((el) => el.value)
    startAspect(queue.shift())
  })

  // --- Model controls (4.4): rotate, move, view zoom (not k), reset (position/view only) ---
  $('btn-m5-putar').addEventListener('click', () => sceneModule.rotateModel(Math.PI / 6))
  $('btn-m5-besar').addEventListener('click', () => sceneModule.scaleModel(1.2))
  $('btn-m5-kecil').addEventListener('click', () => sceneModule.scaleModel(1 / 1.2))
  $('btn-m5-reset').addEventListener('click', () => sceneModule.resetModel())
  $('btn-m5-geser').addEventListener('click', (e) => {
    const on = !e.currentTarget.classList.contains('active')
    e.currentTarget.classList.toggle('active', on)
    sceneModule.setDragMode(on ? 'move' : 'rotate')
  })
  $('btn-m5-kembali-menu').addEventListener('click', showMenu)
  $('btn-m5-kecukupan').addEventListener('click', () => openKecukupan())

  sceneModule.onPartTap((index) => {
    if (tapHandler) {
      tapHandler(index)
    }
  })

  // --- Shared steps ---
  // "Catat Temuanmu": the student writes in the e-module; the button only confirms they may go on.
  const catatStep = ({title = 'Catat Temuanmu.', question, aspect, next}) => {
    tapHandler = null
    sceneModule.setSelectedPart(null)
    render({
      prompt: `${title} ${question} Tulis jawabanmu di e-module, lalu tekan tombol di bawah.`,
      actions: [{label: 'Sudah Dicatat', primary: true, onClick: () => {
        S.findingsRecorded[`${aspect}|${S.activeK}`] = true
        next()
      }}],
    })
  }

  const afterCatat = ({extra = [], withK = true} = {}) => {
    clearScene()
    const actions = [...extra]
    if (queue.length > 0) {
      actions.push({label: 'Lanjut ke Aspek Terpilih Berikutnya', onClick: () => startAspect(queue.shift())})
    }
    if (withK) {
      actions.push({label: 'Coba Faktor Skala Lain', onClick: () => startAspect(lastAspect, {pickK: true})})
    }
    actions.push({label: 'Kembali ke Aspek Pengamatan', onClick: showMenu})
    actions.push({label: 'Periksa Kecukupan Data', primary: true, onClick: () => openKecukupan()})
    render({prompt: 'Apa yang ingin kamu lakukan selanjutnya?', actions})
  }

  // --- M1: Perubahan Bangun saat Skala Diubah (4.6) ---
  const m1Pick = (k) => {
    sceneModule.hideCompare()
    setK(k)
    if (k === 1) {
      m1Observe('Model kembali ke k=1. Pilih faktor skala lain, lalu perhatikan perubahannya.')
      return
    }
    render({
      prompt: 'Perubahan apa yang kamu lihat? Kamu bebas bergerak mengelilingi, melihat dari atas, samping, dan depan.',
      kPicker: m1Pick,
      actions: [
        {label: 'Bandingkan dengan Model Awal', onClick: () => m1Compare(k)},
        {label: 'Catat Temuanmu', primary: true, onClick: m1Catat},
      ],
    })
  }

  const m1Observe = (prompt) => {
    render({
      prompt: prompt || 'Amati kondisi awal model (k=1). Pilih faktor skala lain, lalu perhatikan perubahannya.',
      kPicker: m1Pick,
    })
  }

  const m1Compare = (k) => {
    sceneModule.showCompare(1, 'Model Awal k=1', `Model Baru k=${kText(k)}`)
    render({
      prompt: 'Amati kedua model. Apa yang kamu temukan?',
      info: ['Model Awal k=1 dan Model Baru k=' + kText(k)],
      hint: HINT_M1,
      actions: [{label: 'Kembali ke Model Baru', primary: true, onClick: () => {
        sceneModule.hideCompare()
        m1Catat()
      }}],
    })
  }

  const m1Catat = () => catatStep({
    question: 'Apa yang kamu temukan setelah faktor skala diubah?',
    aspect: 'm1',
    next: () => afterCatat(),
  })

  // --- M2: Ukuran Bangun (4.7) ---
  const pickPart = (prompt) => {
    sceneModule.setAspectTarget('rusuk-select')
    sceneModule.setSelectedPart(null)
    tapHandler = (part) => {
      const cm = record(part, S.activeK)
      sceneModule.setSelectedPart(part)
      render({
        prompt: 'Apakah kamu masih memerlukan ukuran bagian lain?',
        info: [`${partName(part)}: ${fmtCm(cm)}`],
        actions: [
          {label: 'Ukur Bagian Lain', onClick: () => {
            sceneModule.setSelectedPart(null)
            render({prompt: 'Ketuk rusuk lain yang ingin kamu ukur.'})
          }},
          {label: 'Data Ukuran Sudah Cukup', primary: true, onClick: m2Periksa},
        ],
      })
    }
    render({prompt})
  }

  const measuredList = (k) => Object.entries(measured(k))
    .sort(([a], [b]) => a - b)
    .map(([part, cm]) => `${partName(Number(part))}: ${fmtCm(cm)}`)

  const m2Periksa = () => {
    tapHandler = null
    sceneModule.setSelectedPart(null)
    render({
      prompt: 'Periksa Data Ukuranmu. Informasi ukuran apa yang kamu peroleh pada faktor skala ini?',
      info: measuredList(S.activeK),
      actions: [{label: 'Catat Temuanmu', primary: true, onClick: () => catatStep({
        question: 'Catat informasi ukuran yang kamu peroleh.',
        aspect: 'm2',
        next: m2After,
      })}],
    })
  }

  // Pairs of measurements of the same part at two different k (only what the student measured).
  const comparablePairs = () => {
    const pairs = []
    for (let part = 0; part < partUnits.length; part++) {
      const ks = K_VALUES.filter((k) => measured(k)[part] !== undefined)
      for (let i = 0; i < ks.length; i++) {
        for (let j = i + 1; j < ks.length; j++) {
          pairs.push({part, a: ks[i], b: ks[j]})
        }
      }
    }
    return pairs
  }

  const m2After = () => {
    const extra = comparablePairs().length > 0
      ? [{label: 'Bandingkan Ukuran', onClick: m2ChoosePair}]
      : []
    afterCatat({extra})
  }

  const m2ChoosePair = () => {
    clearScene()
    render({
      prompt: 'Bandingkan Data Ukuran. Pilih dua hasil pengukuran yang ingin kamu bandingkan.',
      trailer: true,
      actions: comparablePairs().map((pair) => ({
        label: `${partName(pair.part)}: k=${kText(pair.a)} ↔ k=${kText(pair.b)}`,
        onClick: () => m2ComparePair(pair, false),
      })),
    })
  }

  const m2ComparePair = (pair, bothModels) => {
    const info = [
      `${partName(pair.part)}, k=${kText(pair.a)}: ${fmtCm(measured(pair.a)[pair.part])}`,
      `${partName(pair.part)}, k=${kText(pair.b)}: ${fmtCm(measured(pair.b)[pair.part])}`,
    ]
    const actions = []
    if (!bothModels) {
      actions.push({label: 'Lihat Kedua Model', onClick: () => {
        setK(pair.b)
        sceneModule.showCompare(pair.a, `Model k=${kText(pair.a)}`, `Model k=${kText(pair.b)}`)
        m2ComparePair(pair, true)
      }})
    }
    actions.push({label: 'Catat Hasil Perbandingan', primary: true, onClick: () => {
      sceneModule.hideCompare()
      S.comparisonPairs.push(pair)
      catatStep({
        title: 'Catat Hasil Perbandingan.',
        question: 'Apa yang kamu temukan dari perbandingan ukuran pada kedua faktor skala?',
        aspect: 'm2-bandingkan',
        next: () => afterCatat({
          extra: [{label: 'Bandingkan Temuan Lain', onClick: m2ChoosePair}],
          withK: false,
        }),
      })
    }})
    render({
      prompt: 'Bandingkan ukuran pada kedua faktor skala. Apa yang kamu temukan?',
      info,
      actions,
    })
  }

  // --- M3: Informasi Lainnya (4.8) ---
  const m3Free = (prompt, {info = [], pickK = false} = {}) => {
    const kPicker = pickK ? (k) => {
      sceneModule.hideCompare()
      compareShown = false
      setK(k)
      m3Free('Setelah faktor skala diubah, adakah informasi lain yang kamu temukan?')
    } : null
    render({
      prompt,
      info,
      kPicker,
      hint: HINT_M3,
      actions: [
        {label: 'Ubah Faktor Skala', onClick: () => m3Free('Pilih faktor skala yang ingin kamu coba.', {pickK: true})},
        {label: 'Pilih Bagian', onClick: () => {
          sceneModule.setAspectTarget('rusuk-select')
          tapHandler = (part) => {
            sceneModule.setSelectedPart(part)
            m3Free('Apa yang kamu perhatikan pada bagian yang kamu pilih?')
          }
          m3Free('Ketuk bagian yang ingin kamu perhatikan.')
        }},
        {label: 'Ukur Bagian', onClick: () => {
          sceneModule.setAspectTarget('rusuk-select')
          tapHandler = (part) => {
            const cm = record(part, S.activeK)
            sceneModule.setSelectedPart(part)
            m3Free('Apa yang kamu perhatikan pada bagian yang kamu ukur?', {info: [`${partName(part)}: ${fmtCm(cm)}`]})
          }
          m3Free('Ketuk bagian yang ingin kamu ukur.')
        }},
        {label: compareShown ? 'Sembunyikan Model Awal' : 'Bandingkan dengan Model Awal', onClick: () => {
          if (compareShown) {
            sceneModule.hideCompare()
            compareShown = false
            m3Free('Model Awal disembunyikan.')
          } else if (S.activeK === 1) {
            m3Free('Ubah faktor skala terlebih dahulu (pilih k selain 1), lalu bandingkan dengan Model Awal.')
          } else {
            sceneModule.showCompare(1, 'Model Awal k=1', `Model Baru k=${kText(S.activeK)}`)
            compareShown = true
            m3Free('Amati kedua kondisi tersebut. Adakah informasi lain yang kamu temukan?')
          }
        }},
        {label: 'Reset', onClick: () => sceneModule.resetModel()},
        {label: 'Saya Menemukan Sesuatu', primary: true, onClick: () => catatStep({
          question: 'Informasi lain apa yang kamu temukan dari hasil pengamatanmu?',
          aspect: 'm3',
          next: () => afterCatat({
            extra: [{label: 'Lanjut Eksplorasi Bebas', onClick: () => m3Free('Lanjutkan eksplorasimu.')}],
            withK: false,
          }),
        })},
      ],
    })
  }

  const ASPECT_FLOWS = {
    m1: ({pickK}) => {
      if (!pickK) {
        setK(1)
      }
      m1Observe(pickK ? 'Pilih faktor skala lain, lalu perhatikan perubahannya.' : '')
    },
    m2: ({pickK}) => {
      if (pickK) {
        render({
          prompt: 'Pilih Faktor Skala Lain.',
          kPicker: (k) => {
            setK(k)
            pickPart('Pilih bagian bangun yang ingin kamu ukur pada faktor skala ini.')
          },
        })
        return
      }
      render({
        prompt: 'Pilih bagian bangun yang ingin kamu ukur.',
        actions: [{label: 'Mulai Mengukur', primary: true, onClick: () => pickPart('Ketuk rusuk yang ingin kamu ukur.')}],
      })
    },
    m3: ({pickK}) => {
      if (pickK) {
        m3Free('Pilih faktor skala yang ingin kamu coba.', {pickK: true})
        return
      }
      render({
        prompt: 'Amati kembali model dan perubahannya saat faktor skala diubah. Adakah informasi lain yang kamu temukan? Jelajahi bagian yang menurutmu menarik atau dapat melengkapi informasi yang sudah kamu peroleh.',
        actions: [{label: 'Mulai Eksplorasi Bebas', primary: true, onClick: () => m3Free('Jelajahi model dengan bebas.')}],
      })
    },
  }

  function startAspect(aspectId, opts = {}) {
    lastAspect = aspectId
    if (!S.observedAspects.includes(aspectId)) {
      S.observedAspects.push(aspectId)
    }
    clearScene()
    ASPECT_FLOWS[aspectId](opts)
  }

  // --- Periksa Kecukupan Data (4.9) ---
  function openKecukupan() {
    clearScene()
    $('kecukupan-step1-m5').classList.remove('hidden')
    $('kecukupan-step2-m5').classList.add('hidden')
    showScreen('screen-kecukupan-m5')
  }
  $('btn-menu-kecukupan-m5').addEventListener('click', openKecukupan)
  $('btn-sudah-cukup-m5').addEventListener('click', () => {
    S.sufficiency = 'cukup'
    showScreen('screen-selesai-m5')
  })
  $('btn-perlu-tambahan-m5').addEventListener('click', () => {
    S.sufficiency = 'perlu'
    $('kecukupan-step1-m5').classList.add('hidden')
    $('kecukupan-step2-m5').classList.remove('hidden')
  })
  // Back into the last active aspect on the same shape, ready to pick another k (OQ-4).
  $('btn-coba-k-kecukupan-m5').addEventListener('click', () => startAspect(lastAspect, {pickK: true}))
  $('btn-amati-bangun-lain-m5').addEventListener('click', () => {
    saveTransform()
    showPilihBangun()
  })
  $('btn-kecukupan-menu-m5').addEventListener('click', showMenu)

  // --- Layar Penutup (4.10) ---
  $('btn-selesai-m5').addEventListener('click', () => {
    if (E_MODULE_URL) {
      window.location.href = E_MODULE_URL
      return
    }
    showScreen('screen-awal-m5')
  })

  showScreen('screen-awal-m5')
}
