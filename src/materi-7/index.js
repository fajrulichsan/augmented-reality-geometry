// Materi 7: "Ayo Mengeksplorasi dengan AR!" - Hubungan Volume Prisma & Limas (PRD-materi-7.md).
// Everything specific to this materi lives in this folder plus ../pair-model.js (the prisma+limas
// pair); it talks to the scene only through the sceneModule API (setVolumeModel / updateVolume /
// showVolumeCompare, kind 'pair').
//
// AR never states a volume relation, ratio, formula or generalisation (PRD principle 1). Filling
// is shown as an observation only. Numbers come from the pair's own mathematical dimensions and
// only appear when the student asks (height) or in the student's own comparison data.
import './materi-7.css'
import {MATERI7_MARKUP} from './markup'
import {ASPECTS} from './aspects'
import {
  AREA_LEVELS, HEIGHT_LEVELS, PAIR_VIEW_DEFAULT, buildPairModel, pairCheck, fillsToFull,
} from '../pair-model'

// Where "Selesai Eksplorasi AR" sends the student (the e-module). Empty until the URL is known;
// the flow then returns to the start screen.
const E_MODULE_URL = ''

const BASE_NAMES = {3: 'Segitiga', 4: 'Segiempat', 5: 'Segilima', 6: 'Segienam'}
const pairName = (n) => `Prisma ${BASE_NAMES[n]} ↔ Limas ${BASE_NAMES[n]}`

const REMINDER_HEIGHT_LOCK = 'Pada eksplorasi ini tinggi kedua bangun tetap. Ubah hanya luas alasnya.'
const REMINDER_AREA_LOCK = 'Pada eksplorasi ini luas alas kedua bangun tetap. Ubah hanya tingginya.'
const REMINDER_FILL = 'Pastikan alas dan tinggi kedua bangun tetap bersesuaian selama pengamatan.'
const HINT_X = 'Coba perhatikan kembali bentuk alas, tinggi, posisi kedua bangun, atau ruang yang terisi selama visualisasi.'

const fmtUnit = (value, unit) => `${Number(Number(value).toFixed(2))} ${unit}`

const newSession = (sides) => ({
  sides,
  placed: false,
  transform: null,
  introDone: false,
  areaIdx: 1,
  heightIdx: 1,
  lockedVariable: 'none', // 'none' | 'height' | 'baseArea'
  conditionsVisited: [[1, 1]],
  fillTrials: [], // {areaIdx, height idx, fillCount, recorded}
  comparisonPairs: [],
  findingsRecorded: {}, // `${aspect}` -> true (the text itself lives in the e-module)
  observedAspects: [],
  sufficiency: 'belum', // 'belum' | 'cukup' | 'perlu'
})

export const initMateri7 = (sceneModule, {startAr}) => {
  const root = document.getElementById('materi-7-root')
  root.innerHTML = MATERI7_MARKUP

  const $ = (id) => document.getElementById(id)
  const screens = root.querySelectorAll('.screen')
  const bar = $('eksplorasi-bar-m7')
  const showScreen = (id) => {
    stopFill()
    screens.forEach((el) => el.classList.add('hidden'))
    bar.classList.add('hidden')
    $(id).classList.remove('hidden')
  }
  const openBar = () => {
    screens.forEach((el) => el.classList.add('hidden'))
    bar.classList.remove('hidden')
  }

  const sessions = {}
  let S = null // pair on screen
  let arStarted = false
  let surfaceValid = false // a detected surface is reused when switching pair (PRD 4.11)
  let anchorStable = false
  let lastPosition = null
  let queue = []
  let lastActivity = null // 'a1'..'a5', or 'a5-area' / 'a5-height' / 'a5-fill' for free exploration
  let hintOn = false
  let hintText = ''
  let tools = {base: false, height: false, size: false}

  // --- Tracking: when it is lost the surface must be found again (PRD 4.11, AC-13) ---
  try {
    XR8.addCameraPipelineModule({
      name: 'materi-7-tracking',
      listeners: [{
        event: 'reality.trackingstatus',
        process: ({detail}) => {
          if (detail && detail.status === 'LIMITED') {
            anchorStable = false
          } else if (detail && detail.status === 'NORMAL') {
            anchorStable = surfaceValid
          }
        },
      }],
    })
  } catch (err) {
    // Without tracking events the anchor is simply assumed stable once placed.
  }

  // --- Per-pair helpers ---
  const spec = (a = S.areaIdx, h = S.heightIdx) => ({kind: 'pair', sides: S.sides, areaIdx: a, heightIdx: h})
  const heightValue = (h = S.heightIdx) => HEIGHT_LEVELS[h]
  const areaValue = (a = S.areaIdx) => AREA_LEVELS[a]
  const view = (patch) => sceneModule.updateVolume(patch)

  const visit = () => {
    if (!S.conditionsVisited.some(([a, h]) => a === S.areaIdx && h === S.heightIdx)) {
      S.conditionsVisited.push([S.areaIdx, S.heightIdx])
    }
  }

  // The one place a condition changes: exactly one variable, both solids at once (principle 3/4).
  const changeVariable = (key, idx) => {
    if (key === 'areaIdx') {
      S.areaIdx = idx
      S.lockedVariable = 'height'
    } else {
      S.heightIdx = idx
      S.lockedVariable = 'baseArea'
    }
    view({[key]: idx})
    visit()
  }

  // --- Eksplorasi bar helpers ---
  const setActions = (actions) => {
    const holder = $('m7-actions')
    holder.innerHTML = ''
    actions.forEach(({label, primary, small, disabled, onClick}) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.textContent = label
      btn.disabled = Boolean(disabled)
      btn.className = `${primary ? 'btn-primary' : 'btn-secondary'}${small ? ' small' : ''}`
      btn.addEventListener('click', onClick)
      holder.appendChild(btn)
    })
  }

  const setHint = () => {
    const el = $('m7-hint')
    el.textContent = hintOn ? hintText : ''
    el.classList.toggle('hidden', !hintOn)
  }

  // The hint stays hidden until the student presses this button (PRD principle 7 / AC-11).
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
    const holder = $('m7-picker')
    holder.innerHTML = ''
    holder.classList.toggle('hidden', !cfg)
    if (!cfg) {
      return
    }
    cfg.items.forEach(({label, value, disabled}) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.textContent = label
      btn.disabled = Boolean(disabled)
      btn.className = 'btn-secondary'
      btn.addEventListener('click', () => cfg.onPick(value))
      holder.appendChild(btn)
    })
  }

  const setFillStatus = (text) => {
    const el = $('m7-fill-status')
    el.textContent = text || ''
    el.classList.toggle('hidden', !text)
  }

  // Height number only after [Tampilkan Ukuran Tinggi] (principle 7 / AC-6).
  const sizeInfo = () => (tools.height && tools.size ? [`Tinggi kedua bangun = ${fmtUnit(heightValue(), 'satuan')}`] : [])

  const render = ({prompt, info = [], actions = [], picker = null, hint = '', fill = ''}) => {
    hintOn = false
    $('m7-label').textContent = pairName(S.sides)
    $('m7-label').classList.remove('hidden')
    $('m7-prompt').textContent = prompt
    const infoEl = $('m7-info')
    const lines = [...info, ...sizeInfo()]
    infoEl.innerHTML = lines.join('<br>')
    infoEl.classList.toggle('hidden', lines.length === 0)
    setPicker(picker)
    setFillStatus(fill)
    setActions(hint ? [...actions, hintAction(hint)] : actions)
    setHint()
    openBar()
  }

  // Sorot Alas / Tampilkan Tinggi / Tampilkan Ukuran Tinggi toggles; `again` redraws the caller.
  const toolActions = (which, again) => {
    const list = []
    if (which.includes('base')) {
      list.push({label: tools.base ? 'Sembunyikan Sorotan Alas' : 'Sorot Alas', small: true, onClick: () => {
        tools.base = !tools.base
        view({baseHighlight: tools.base})
        again()
      }})
    }
    if (which.includes('height')) {
      list.push({label: tools.height ? 'Sembunyikan Tinggi' : 'Tampilkan Tinggi', small: true, onClick: () => {
        tools.height = !tools.height
        if (!tools.height) {
          tools.size = false
        }
        view({heightLines: tools.height})
        again()
      }})
      if (tools.height && !tools.size) {
        list.push({label: 'Tampilkan Ukuran Tinggi', small: true, onClick: () => {
          tools.size = true
          again()
        }})
      }
    }
    return list
  }

  // --- Filling animation state (A4) ---
  let fillRaf = null
  const fill = {phase: 'idle', progress: 0, count: 0, full: 1, paused: false}
  const POUR_MS = 2600

  function stopFill() {
    if (fillRaf) {
      cancelAnimationFrame(fillRaf)
      fillRaf = null
    }
  }

  const clearScene = () => {
    stopFill()
    sceneModule.hideCompare()
    sceneModule.resetMarks()
    sceneModule.setAspectTarget('sisi')
    sceneModule.setPickableParts(null)
    tools = {base: false, height: false, size: false}
    view({...PAIR_VIEW_DEFAULT})
  }

  // --- Screens: awal -> pilih pasangan -> deteksi/tempatkan -> pengamatan awal -> menu aspek ---
  $('btn-mulai-m7').addEventListener('click', () => {
    if (!arStarted) {
      arStarted = true
      startAr()
    }
    showPilihPasangan()
  })

  const showPilihPasangan = () => {
    $('btn-pasangan-kembali-m7').classList.toggle('hidden', !S)
    showScreen('screen-pilih-pasangan-m7')
  }
  $('pasangan-grid-m7').addEventListener('click', (e) => {
    const btn = e.target.closest('[data-n]')
    if (btn) {
      choosePair(Number(btn.dataset.n))
    }
  })
  $('btn-pasangan-kembali-m7').addEventListener('click', () => showMenu())

  const saveTransform = () => {
    if (S && S.placed) {
      S.transform = sceneModule.getModelTransform()
      if (S.transform) {
        lastPosition = S.transform.position
      }
    }
  }

  function choosePair(sides) {
    saveTransform()
    if (!sessions[sides]) {
      sessions[sides] = newSession(sides)
    }
    S = sessions[sides]
    sceneModule.setNetMode(false)
    sceneModule.setVolumeModel(spec())
    if (S.transform) {
      sceneModule.setModelTransform(S.transform)
    } else if (lastPosition) {
      // The new pair appears where the previous one stood on the same surface.
      const transform = sceneModule.getModelTransform()
      if (transform) {
        transform.position[0] = lastPosition[0]
        transform.position[2] = lastPosition[2]
        sceneModule.setModelTransform(transform)
      }
    }
    // Stable anchor: reuse the surface. Lost tracking: detect the surface again (PRD 4.11).
    if (!S.placed && surfaceValid && anchorStable) {
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
    $('tempatkan-prompt-m7').textContent = 'Arahkan kamera ke permukaan datar di sekitarmu.'
    showScreen('screen-tempatkan-m7')
    clearTimeout(placementTimer)
    // The 8th Wall SLAM engine has no explicit "surface found" event, so the second prompt simply
    // follows after a moment of scanning.
    placementTimer = setTimeout(() => {
      $('tempatkan-prompt-m7').textContent = 'Permukaan ditemukan. Ketuk untuk menempatkan kedua model.'
    }, 1500)
  }

  $('btn-tempatkan-m7').addEventListener('click', () => {
    clearTimeout(placementTimer)
    try {
      XR8.XrController.recenter()
    } catch (err) {
      // Camera/tracking not ready: the pair is still shown at its default spot and Reset works.
    }
    S.placed = true
    surfaceValid = true
    anchorStable = true
    afterPlacement()
  })

  function afterPlacement() {
    if (S.introDone) {
      showMenu()
      return
    }
    clearScene()
    render({
      prompt: 'Amati kedua bangun dari berbagai arah. Perhatikan bentuk alas, posisi alas, dan tinggi. Kamu boleh berjalan mengelilingi model.',
      actions: [{label: 'Lanjutkan Eksplorasi', primary: true, onClick: () => {
        S.introDone = true
        showMenu()
      }}],
    })
  }

  // --- Menu Aspek (4.5) ---
  const aspekList = $('aspek-list-m7')
  const btnLanjut = $('btn-aspek-lanjut-m7')

  function showMenu() {
    clearScene()
    aspekList.innerHTML = ASPECTS.map((aspect) => `
      <label>
        <input type="checkbox" value="${aspect.id}">
        <span>${aspect.label}${S.observedAspects.includes(aspect.id) ? ' ✓' : ''}</span>
      </label>
    `).join('')
    btnLanjut.disabled = true
    showScreen('screen-menu-aspek-m7')
  }
  aspekList.addEventListener('change', () => {
    btnLanjut.disabled = aspekList.querySelectorAll('input:checked').length === 0
  })
  btnLanjut.addEventListener('click', () => {
    queue = Array.from(aspekList.querySelectorAll('input:checked')).map((el) => el.value)
    startAspect(queue.shift())
  })

  // --- Model controls: rotate, move, view zoom (not the dimensions), reset (view only) ---
  $('btn-m7-putar').addEventListener('click', () => sceneModule.rotateModel(Math.PI / 6))
  $('btn-m7-besar').addEventListener('click', () => sceneModule.scaleModel(1.2))
  $('btn-m7-kecil').addEventListener('click', () => sceneModule.scaleModel(1 / 1.2))
  $('btn-m7-reset').addEventListener('click', () => sceneModule.resetModel())
  $('btn-m7-geser').addEventListener('click', (e) => {
    const on = !e.currentTarget.classList.contains('active')
    e.currentTarget.classList.toggle('active', on)
    sceneModule.setDragMode(on ? 'move' : 'rotate')
  })

  // Tilts both solids together so the two bases can be compared from above.
  const lookFromTop = () => {
    const transform = sceneModule.getModelTransform()
    if (transform) {
      transform.rotation = [-Math.PI / 2.4, transform.rotation[1], transform.rotation[2]]
      sceneModule.setModelTransform(transform)
    }
  }

  // --- Shared steps ---
  const navActions = () => [
    {label: 'Kembali ke Aspek Pengamatan', onClick: () => showMenu()},
    {label: 'Periksa Kecukupan Data', primary: true, onClick: () => openKecukupan()},
  ]

  // "Catat": the student writes in the e-module; the button only confirms they may go on.
  const catatStep = ({question, aspect, next}) => {
    render({
      prompt: `${question} Tulis jawabanmu di e-module, lalu tekan tombol di bawah.`,
      actions: [{label: 'Sudah Dicatat', primary: true, onClick: () => {
        S.findingsRecorded[aspect] = true
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

  // --- A1: Kondisi Awal Kedua Bangun (4.6) ---
  const a1 = () => {
    const menu = (prompt = 'Bagian apa yang ingin kamu amati pada kedua bangun?') => {
      clearScene()
      render({
        prompt,
        actions: [
          {label: 'Amati Alas', onClick: observeBase},
          {label: 'Amati Tinggi', onClick: observeHeight},
          {label: 'Amati Posisi Kedua Bangun', onClick: observePosition},
          {label: 'Catat Temuanmu', primary: true, onClick: () => catatStep({
            question: 'Catat informasi tentang alas dan tinggi kedua bangun.',
            aspect: 'a1',
            next: () => afterCatat({extra: [{label: 'Amati Bagian Lain', onClick: () => menu()}]}),
          })},
        ],
      })
    }
    const observeBase = () => {
      clearScene()
      view({baseHighlight: true})
      tools.base = true
      const draw = () => render({
        prompt: 'Amati bentuk dan ukuran alas kedua bangun. Apa yang kamu temukan?',
        actions: [
          {label: 'Lihat dari Atas', onClick: lookFromTop},
          {label: 'Amati Bagian Lain', onClick: () => menu()},
        ],
      })
      draw()
    }
    const observeHeight = () => {
      clearScene()
      view({heightLines: true})
      tools.height = true
      const draw = () => render({
        prompt: 'Amati tinggi prisma dan limas. Apa yang kamu temukan?',
        actions: [
          ...toolActions(['height'], draw),
          {label: 'Amati Bagian Lain', onClick: () => menu()},
        ],
      })
      draw()
    }
    const observePosition = () => {
      clearScene()
      render({
        prompt: 'Amati kembali dari berbagai arah. Apa yang kamu perhatikan tentang posisi alas, puncak, dan bagian atas kedua bangun?',
        actions: [{label: 'Amati Bagian Lain', onClick: () => menu()}],
      })
    }
    menu('Tampilan pasangan pada kondisi aktif. Bagian apa yang ingin kamu amati pada kedua bangun?')
  }

  // --- A2 / A3: Perubahan Luas Alas / Tinggi (4.7, 4.8) ---
  const condChange = (cfg) => () => {
    let from = null
    let compared = false
    const key = cfg.key
    const idxNow = () => (key === 'areaIdx' ? S.areaIdx : S.heightIdx)
    const max = (key === 'areaIdx' ? AREA_LEVELS : HEIGHT_LEVELS).length - 1

    const step = (delta) => {
      const next = idxNow() + delta
      if (next < 0 || next > max) {
        return
      }
      from = {areaIdx: S.areaIdx, heightIdx: S.heightIdx}
      compared = false
      sceneModule.hideCompare()
      changeVariable(key, next)
      observe()
    }
    const compare = () => {
      compared = true
      sceneModule.showVolumeCompare(spec(from.areaIdx, from.heightIdx), 'Kondisi Sebelum', 'Kondisi Sesudah')
      render({
        prompt: 'Bandingkan Kondisi Sebelum dan Kondisi Sesudah. Apa persamaan dan perbedaan yang kamu temukan?',
        info: [cfg.reminder],
        actions: [{label: 'Kembali ke Kondisi Aktif', primary: true, onClick: () => {
          sceneModule.hideCompare()
          compared = false
          observe()
        }}],
      })
    }
    const catat = () => catatStep({
      question: cfg.catatQuestion,
      aspect: cfg.aspect,
      next: () => afterCatat({extra: [{label: cfg.retryLabel, onClick: () => startAspect(cfg.aspect)}]}),
    })
    function observe(prompt) {
      const actions = [
        {label: cfg.minusLabel, disabled: idxNow() <= 0, onClick: () => step(-1)},
        {label: cfg.plusLabel, disabled: idxNow() >= max, onClick: () => step(1)},
        ...toolActions(cfg.tools, observe),
      ]
      if (from !== null && !compared) {
        actions.push({label: 'Bandingkan dengan Kondisi Sebelumnya', onClick: compare})
      }
      actions.push({label: 'Catat Temuanmu', primary: true, onClick: catat})
      render({
        prompt: prompt || cfg.prompt,
        info: [cfg.reminder],
        actions,
      })
    }
    S.lockedVariable = key === 'areaIdx' ? 'height' : 'baseArea'
    observe(cfg.startPrompt)
  }

  // --- A4: Visualisasi Pengisian (4.9) ---
  const currentTrial = () => S.fillTrials.find((t) => t.areaIdx === S.areaIdx && t.heightIdx === S.heightIdx)
  const recordTrial = () => {
    let trial = currentTrial()
    if (!trial) {
      trial = {areaIdx: S.areaIdx, heightIdx: S.heightIdx, fillCount: 0, recorded: false}
      S.fillTrials.push(trial)
    }
    trial.fillCount = fill.count
    return trial
  }
  const recordedTrials = () => S.fillTrials.filter((t) => t.recorded)

  const fillStatusText = () => `Pengisian yang telah diamati: ${fill.count}`

  const a4 = () => {
    clearScene()
    // Pre-check (PRD 4.9 step 1): the animation only runs when the pair still corresponds.
    const model = buildPairModel(spec())
    const ok = pairCheck(model)
    const passed = ok.shape && ok.area && ok.height
    model.group.traverse((obj) => {
      if (obj.geometry) {
        obj.geometry.dispose()
      }
    })
    if (!passed) {
      render({
        prompt: 'Alas dan tinggi kedua bangun belum bersesuaian, jadi visualisasi belum bisa dimulai. Kembali ke pilihan aspek lalu coba lagi.',
        actions: [{label: 'Kembali ke Aspek Pengamatan', primary: true, onClick: () => showMenu()}],
      })
      return
    }
    fill.count = currentTrial() ? currentTrial().fillCount : 0
    fill.full = fillsToFull(spec())
    fill.phase = 'idle'
    fill.progress = 0
    fill.paused = false
    render({
      prompt: 'Pemeriksaan selesai: bentuk alas, luas alas, dan tinggi kedua bangun sama.',
      info: [REMINDER_FILL],
      actions: [{label: 'Mulai Visualisasi', primary: true, onClick: () => {
        fill.count = 0
        startPour()
      }}],
    })
  }

  // The prism's filled height follows the actual solids (see fillsToFull); no number is shown.
  const drawFill = () => {
    const prismLevel = Math.min(1, (fill.count + fill.progress) / fill.full)
    view({pyramidLeft: 1 - fill.progress, prismLevel})
  }

  const isPrismFull = () => fill.count >= fill.full

  function renderFillControls(prompt) {
    const playing = fill.phase === 'pouring' && !fill.paused
    const actions = []
    if (fill.phase === 'pouring') {
      actions.push({label: playing ? '⏸ Jeda' : '▶ Mulai', onClick: () => {
        fill.paused = playing
        if (!fill.paused) {
          tick.last = performance.now()
          fillRaf = requestAnimationFrame(tick)
        }
        renderFillControls(prompt)
      }})
      actions.push({label: '↶ Ulangi', onClick: () => startPour(true)})
    } else if (fill.phase === 'poured') {
      if (!isPrismFull()) {
        actions.push({label: 'Isi Lagi', primary: true, onClick: () => startPour()})
      }
      actions.push({label: '↶ Ulangi', onClick: () => startPour(true)})
    }
    if (fill.phase === 'poured') {
      actions.push({label: 'Catat Hasil Pengamatan', primary: true, onClick: fillCatat})
    }
    render({prompt, actions, fill: fillStatusText()})
  }

  const tick = (now) => {
    if (fill.phase !== 'pouring' || fill.paused) {
      return
    }
    fill.progress = Math.min(1, fill.progress + (now - tick.last) / POUR_MS)
    tick.last = now
    drawFill()
    if (fill.progress >= 1) {
      fill.count += 1
      fill.phase = 'poured'
      fill.progress = 0
      // The content now sits in the prism; the limas shows empty until the next filling.
      view({pyramidLeft: 0, prismLevel: Math.min(1, fill.count / fill.full)})
      recordTrial()
      renderFillControls(isPrismFull()
        ? 'Apa yang kamu amati setelah proses pengisian dilakukan beberapa kali?'
        : 'Amati bagian ruang prisma yang telah terisi.')
      return
    }
    fillRaf = requestAnimationFrame(tick)
  }

  // Each pour uses the identical content of one limas. `replay` repeats the pour just watched.
  function startPour(replay = false) {
    stopFill()
    // Repeating a finished pour must not count it twice; a pour in progress leaves the count alone.
    if (replay && fill.phase === 'poured') {
      fill.count = Math.max(0, fill.count - 1)
    }
    fill.phase = 'pouring'
    fill.progress = 0
    fill.paused = false
    drawFill()
    renderFillControls('Amati isi limas dipindahkan ke dalam prisma.')
    tick.last = performance.now()
    fillRaf = requestAnimationFrame(tick)
  }

  const fillCatat = () => {
    stopFill()
    const trial = recordTrial()
    catatStep({
      question: 'Catat hasil pengamatan dari visualisasi pengisian.',
      aspect: 'a4',
      next: () => {
        trial.recorded = true
        fillAfterCatat()
      },
    })
  }

  function fillAfterCatat() {
    const extra = []
    if (recordedTrials().length >= 2) {
      extra.push({label: 'Bandingkan Hasil Pengamatan', onClick: fillChoosePair})
    }
    extra.push({label: 'Coba Kondisi Lain', onClick: fillTryOther})
    afterCatat({extra})
  }

  // [Coba Kondisi Lain]: only one variable changes, the other is locked (AC-9).
  function fillTryOther() {
    clearScene()
    render({
      prompt: 'Apa yang ingin kamu ubah?',
      actions: [
        {label: 'Ubah Luas Alas', onClick: () => fillChange('areaIdx')},
        {label: 'Ubah Tinggi', onClick: () => fillChange('heightIdx')},
      ],
    })
  }

  function fillChange(key) {
    const label = key === 'areaIdx' ? 'Luas alas' : 'Tinggi'
    const pick = (idx) => {
      changeVariable(key, idx)
      render({
        prompt: key === 'areaIdx'
          ? 'Alas prisma dan limas berubah bersama. Tinggi kedua bangun tetap.'
          : 'Tinggi prisma dan limas berubah bersama. Luas alas kedua bangun tetap.',
        info: [key === 'areaIdx' ? REMINDER_HEIGHT_LOCK : REMINDER_AREA_LOCK],
        picker: pickerFor(key, pick),
        actions: [{label: 'Mulai Visualisasi Ulang', primary: true, onClick: a4}],
      })
    }
    render({
      prompt: `Pilih ukuran ${label.toLowerCase()} yang ingin kamu coba.`,
      info: [key === 'areaIdx' ? REMINDER_HEIGHT_LOCK : REMINDER_AREA_LOCK],
      picker: pickerFor(key, pick),
    })
  }

  const pickerFor = (key, onPick) => {
    const levels = key === 'areaIdx' ? AREA_LEVELS : HEIGHT_LEVELS
    const now = key === 'areaIdx' ? S.areaIdx : S.heightIdx
    const word = key === 'areaIdx' ? ['Alas Kecil', 'Alas Sedang', 'Alas Besar'] : ['Rendah', 'Sedang', 'Tinggi']
    return {
      items: levels.map((_, i) => ({label: word[i], value: i, disabled: i === now})),
      onPick,
    }
  }

  // Comparison shows only what the student actually obtained (AC-10, principle 9).
  const trialLines = (t) => [
    `Luas alas = ${fmtUnit(areaValue(t.areaIdx), 'satuan²')}`,
    `Tinggi = ${fmtUnit(heightValue(t.heightIdx), 'satuan')}`,
    `Banyak pengisian yang diamati = ${t.fillCount}`,
  ]

  function fillChoosePair() {
    clearScene()
    const trials = recordedTrials()
    const actions = []
    for (let i = 0; i < trials.length; i++) {
      for (let j = i + 1; j < trials.length; j++) {
        // "Kondisi berbeda": luas alas atau tinggi berbeda (OQ-5).
        if (trials[i].areaIdx === trials[j].areaIdx && trials[i].heightIdx === trials[j].heightIdx) {
          continue
        }
        actions.push({
          label: `Percobaan ${i + 1} ↔ Percobaan ${j + 1}`,
          onClick: () => fillCompare(trials[i], trials[j], i + 1, j + 1),
        })
      }
    }
    render({
      prompt: 'Pilih dua hasil visualisasi yang ingin kamu bandingkan.',
      actions: [...actions, ...navActions().slice(0, 1)],
    })
  }

  function fillCompare(a, b, na, nb) {
    render({
      prompt: 'Bandingkan hasil pengamatan pada kedua kondisi tersebut. Apa persamaan dan perbedaan yang kamu temukan?',
      info: [`Percobaan ${na}:`, ...trialLines(a), `Percobaan ${nb}:`, ...trialLines(b)],
      actions: [{label: 'Catat Hasil Perbandinganmu', primary: true, onClick: () => {
        S.comparisonPairs.push({a, b})
        catatStep({
          question: 'Catat hasil perbandinganmu.',
          aspect: 'a4-bandingkan',
          next: () => afterCatat({extra: [
            {label: 'Bandingkan Hasil Lain', onClick: fillChoosePair},
            {label: 'Coba Kondisi Lain', onClick: fillTryOther},
          ]}),
        })
      }}],
    })
  }

  // --- A5: Informasi Lainnya (4.10) ---
  const a5 = () => {
    tools = {base: false, height: false, size: false}
    render({
      prompt: 'Amati kembali prisma dan limas serta hasil eksplorasi yang sudah kamu peroleh. Adakah informasi lain yang ingin kamu selidiki? Jelajahi bagian yang menurutmu dapat melengkapi informasi yang sudah kamu peroleh.',
      actions: [{label: 'Mulai Eksplorasi Bebas', primary: true, onClick: () => xFree('Jelajahi kedua bangun dengan bebas.')}],
    })
  }

  function xFree(prompt, {pick = null} = {}) {
    const again = () => xFree(tools.base
      ? 'Apa yang kamu perhatikan pada alas kedua bangun?'
      : 'Apa yang kamu perhatikan?')
    const actions = [
      {label: 'Putar Model', onClick: () => sceneModule.rotateModel(Math.PI / 6)},
      ...toolActions(['base', 'height'], again),
      {label: 'Ubah Luas Alas', onClick: () => {
        lastActivity = 'a5-area'
        xFree('Pilih ukuran alas. Tinggi kedua bangun tetap.', {pick: 'areaIdx'})
      }},
      {label: 'Ubah Tinggi', onClick: () => {
        lastActivity = 'a5-height'
        xFree('Pilih tinggi. Luas alas kedua bangun tetap.', {pick: 'heightIdx'})
      }},
      {label: 'Visualisasi Pengisian', onClick: () => {
        lastActivity = 'a5-fill'
        a4()
      }},
      {label: 'Reset Tampilan', onClick: () => sceneModule.resetModel()},
      {label: 'Saya Menemukan Sesuatu', primary: true, onClick: () => catatStep({
        question: 'Informasi lain apa yang kamu temukan dari hasil pengamatanmu?',
        aspect: 'a5',
        next: () => afterCatat({extra: [{label: 'Lanjut Eksplorasi Bebas', onClick: () => xFree('Lanjutkan eksplorasimu.')}]}),
      })},
    ]
    render({
      prompt,
      info: pick ? [pick === 'areaIdx' ? REMINDER_HEIGHT_LOCK : REMINDER_AREA_LOCK] : [],
      hint: HINT_X,
      picker: pick ? pickerFor(pick, (idx) => {
        changeVariable(pick, idx)
        xFree(pick === 'areaIdx'
          ? 'Setelah luas alas diubah, informasi apa yang kamu peroleh?'
          : 'Setelah tinggi diubah, informasi apa yang kamu peroleh?')
      }) : null,
      actions,
    })
  }

  // --- Aspect dispatch ---
  const ASPECT_FLOWS = {
    a1,
    a2: condChange({
      key: 'areaIdx',
      aspect: 'a2',
      reminder: REMINDER_HEIGHT_LOCK,
      minusLabel: 'Perkecil Alas',
      plusLabel: 'Perbesar Alas',
      tools: ['base', 'height'],
      startPrompt: 'Ubah luas alas kedua bangun dengan tombol di bawah.',
      prompt: 'Amati kedua bangun setelah luas alasnya diubah. Perubahan apa yang kamu lihat?',
      catatQuestion: 'Apa yang kamu temukan setelah luas alas kedua bangun diubah sementara tingginya tetap?',
      retryLabel: 'Coba Luas Alas Lain',
    }),
    a3: condChange({
      key: 'heightIdx',
      aspect: 'a3',
      reminder: REMINDER_AREA_LOCK,
      minusLabel: 'Kurangi Tinggi',
      plusLabel: 'Tambah Tinggi',
      tools: ['base', 'height'],
      startPrompt: 'Ubah tinggi kedua bangun dengan tombol di bawah.',
      prompt: 'Amati kedua bangun setelah tingginya diubah. Perubahan apa yang kamu lihat?',
      catatQuestion: 'Apa yang kamu temukan setelah tinggi kedua bangun diubah sementara luas alasnya tetap?',
      retryLabel: 'Coba Tinggi Lain',
    }),
    a4: () => {
      lastActivity = 'a4'
      a4()
    },
    a5,
  }

  function startAspect(aspectId) {
    lastActivity = aspectId
    if (!S.observedAspects.includes(aspectId)) {
      S.observedAspects.push(aspectId)
    }
    clearScene()
    ASPECT_FLOWS[aspectId]()
  }

  // --- Periksa Kecukupan Data (4.11): adaptive buttons follow the last activity ---
  const kecOptions = $('kecukupan-options-m7')
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

  const adaptiveOptions = () => {
    const area = {label: 'Coba Luas Alas Lain', onClick: () => startAspect('a2')}
    const height = {label: 'Coba Tinggi Lain', onClick: () => startAspect('a3')}
    const refill = {label: 'Ulangi Visualisasi Pengisian', onClick: () => startAspect('a4')}
    const other = {label: 'Pilih Pasangan Bangun Lain', onClick: () => {
      saveTransform()
      showPilihPasangan()
    }}
    const back = {label: 'Kembali ke Aspek Pengamatan', onClick: () => showMenu()}
    const byActivity = {
      a2: [area],
      a3: [height],
      a4: [refill],
      'a5-area': [area],
      'a5-height': [height],
      'a5-fill': [refill],
    }
    // A1/A5 (or nothing yet): the two ways to gather more data about the pair.
    return [...(byActivity[lastActivity] || [area, height]), other, back]
  }

  function openKecukupan() {
    clearScene()
    $('kecukupan-step1-m7').classList.remove('hidden')
    $('kecukupan-step2-m7').classList.add('hidden')
    showScreen('screen-kecukupan-m7')
  }
  $('btn-menu-kecukupan-m7').addEventListener('click', openKecukupan)
  $('btn-sudah-cukup-m7').addEventListener('click', () => {
    S.sufficiency = 'cukup'
    showScreen('screen-selesai-m7')
  })
  $('btn-perlu-tambahan-m7').addEventListener('click', () => {
    S.sufficiency = 'perlu'
    setKecOptions(adaptiveOptions())
    $('kecukupan-step1-m7').classList.add('hidden')
    $('kecukupan-step2-m7').classList.remove('hidden')
  })

  // --- Layar Penutup (4.12) ---
  $('btn-selesai-m7').addEventListener('click', () => {
    if (E_MODULE_URL) {
      window.location.href = E_MODULE_URL
      return
    }
    showScreen('screen-awal-m7')
  })

  showScreen('screen-awal-m7')
}
