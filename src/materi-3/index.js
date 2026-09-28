// Materi 3: "Eksplorasi AR - Luas Permukaan" - the guided AR flow from PRD-materi-3.md (FR-1..FR-9).
// Everything specific to this materi (markup, styles, aspects, flow logic) lives in this folder; it
// only talks to the outside world through initMateri3's two arguments and the sceneModule API
// (materi-3 additions documented in ../threejs-scene-init.js: getFaces/setFaceSelection/onFaceTap/
// setMeasureFace/onEdgeMeasureTap/showHeightLine).
//
// AR never shows a formula, a computed area, or a "correct" count/verdict - only raw observed data
// (counts the student made themselves, shapes, cm measurements). See PRD section 1/AC-2.
import './materi-3.css'
import {MATERI3_MARKUP} from './markup'
import {ASPECTS} from './aspects'

// How many faces each aspect kind needs the student to pick before its sub-flow can continue (0 =
// no face selection step at all - 'count' toggles highlights directly like materi 1's Banyak Sisi;
// 'free' allows up to 2 but doesn't gate on reaching that number).
const SELECTION_CAPACITY = {shape: 1, size: 1, area: 1, compareShapeSize: 2, compareSize: 2, free: 2}

// Every dynamically-shown action button in the eksplorasi bar (aspect-specific, above the standard
// trailer). Kept in one list so showOnly() can hide everything before showing just what's relevant.
const ACTION_BUTTON_IDS = [
  'btn-m3-hint', 'btn-m3-mulai-ukur', 'btn-m3-ukur-tinggi', 'btn-m3-gunakan-sebelumnya',
  'btn-m3-ukur-kembali', 'btn-m3-data-cukup', 'btn-m3-bandingkan-bentuk-ukuran',
  'btn-m3-bandingkan-ukuran', 'btn-m3-pilih-sisi', 'btn-m3-tampilkan-ukuran',
  'btn-m3-temukan-sesuatu', 'btn-m3-catat',
]

// Buttons whose behavior changes per aspect step; wired once below, dispatching to whatever
// `currentHandlers` the active step set. btn-m3-catat/btn-m3-temukan-sesuatu/btn-m3-pilih-sisi/
// btn-m3-tampilkan-ukuran are wired directly instead (their behavior doesn't change per step).
const DISPATCHED_HANDLERS = {
  'btn-m3-hint': 'hint',
  'btn-m3-mulai-ukur': 'mulaiUkur',
  'btn-m3-ukur-tinggi': 'ukurTinggi',
  'btn-m3-gunakan-sebelumnya': 'gunakanSebelumnya',
  'btn-m3-ukur-kembali': 'ukurKembali',
  'btn-m3-data-cukup': 'dataCukup',
  'btn-m3-bandingkan-bentuk-ukuran': 'bandingkanBentukUkuran',
  'btn-m3-bandingkan-ukuran': 'bandingkanUkuran',
}

export const initMateri3 = (sceneModule, {startAr}) => {
  const root = document.getElementById('materi-3-root')
  root.innerHTML = MATERI3_MARKUP

  const screens = root.querySelectorAll('.screen')
  const showScreen = (id) => {
    screens.forEach((el) => el.classList.add('hidden'))
    document.getElementById(id).classList.remove('hidden')
  }

  let arStarted = false
  let selectedAspectIds = []

  // --- Session state (PRD section 5) ---
  let currentShape = null
  let activeAspect = null
  let selectedFaces = []
  // measurements[shape#faceIndex] = {edges: {edgeIndex: cm}, heightCm: number|null} - reused across
  // aspects ("Gunakan Data Sebelumnya") and preserved across shape switches.
  const measurements = {}
  const findings = [] // {shape, aspect, faceIds, time}
  const comparisons = [] // {findingA, findingB, time}
  let pendingComparison = null

  let measureQueue = []
  let onQueueDone = null
  let measuringFaceIndex = null
  let currentHandlers = {}

  const faceKey = (faceIndex) => `${currentShape}#${faceIndex}`
  const ensureMeasurement = (faceIndex) => {
    const key = faceKey(faceIndex)
    if (!measurements[key]) {
      measurements[key] = {edges: {}, heightCm: null}
    }
    return measurements[key]
  }
  const hasMeasurement = (faceIndex) => {
    const m = measurements[faceKey(faceIndex)]
    return !!m && (Object.keys(m.edges).length > 0 || m.heightCm !== null)
  }
  const formatMeasureList = (faceIndex) => {
    const m = measurements[faceKey(faceIndex)] || {edges: {}, heightCm: null}
    const parts = Object.values(m.edges).map((cm) => `${cm} cm`)
    if (m.heightCm !== null) {
      parts.push(`tinggi ${m.heightCm} cm`)
    }
    return parts.length ? parts.join(' · ') : 'Belum ada data ukuran.'
  }

  // --- F1/F2: Tampilan awal -> Persiapan AR ---
  document.getElementById('btn-mulai-ar-m3').addEventListener('click', () => {
    if (!arStarted) {
      arStarted = true
      startAr()
    }
    showScreen('screen-persiapan-m3')
  })

  document.getElementById('btn-persiapan-lanjut-m3').addEventListener('click', () => {
    showScreen('screen-pilih-bangun-m3')
  })

  // --- FR-1: Pilih Bangun (Kubus, Balok, Prisma only - PRD section 1 scope) ---
  const bangunGrid = document.getElementById('bangun-grid-m3')
  const bangunSub = document.getElementById('bangun-sub-m3')
  const segiNSlider = document.getElementById('segi-n-slider-m3')
  const segiNValue = document.getElementById('segi-n-value-m3')
  let subGroup = null

  const chooseShape = (shapeId) => {
    currentShape = shapeId
    sceneModule.setNetMode(false)
    sceneModule.setShape(shapeId)
    sceneModule.setTransparent(false)
    sceneModule.resetMarks()
    bangunSub.classList.add('hidden')
    showScreen('screen-pilih-aspek-m3')
  }

  bangunGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-bangun')
    if (!btn) {
      return
    }
    if (btn.dataset.shape) {
      chooseShape(btn.dataset.shape)
      return
    }
    if (btn.dataset.group) {
      subGroup = btn.dataset.group
      bangunSub.classList.remove('hidden')
    }
  })

  bangunSub.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-shape-n]')
    if (!btn || !subGroup) {
      return
    }
    chooseShape(`${subGroup}-${btn.dataset.shapeN}`)
  })

  segiNSlider.addEventListener('input', () => {
    segiNValue.textContent = segiNSlider.value
  })

  document.getElementById('btn-pilih-segi-n-m3').addEventListener('click', () => {
    if (!subGroup) {
      return
    }
    chooseShape(`${subGroup}-${segiNSlider.value}`)
  })

  // --- FR-3: Pilih Aspek ---
  const aspekList = document.getElementById('aspek-list-m3')
  const btnAspekLanjut = document.getElementById('btn-aspek-lanjut-m3')

  aspekList.innerHTML = ASPECTS.map((aspect) => `
    <label>
      <input type="checkbox" value="${aspect.id}">
      <span>${aspect.label}</span>
    </label>
  `).join('')

  aspekList.addEventListener('change', () => {
    const checked = aspekList.querySelectorAll('input:checked')
    btnAspekLanjut.disabled = checked.length === 0
  })

  btnAspekLanjut.addEventListener('click', () => {
    selectedAspectIds = Array.from(aspekList.querySelectorAll('input:checked')).map((el) => el.value)
    startAspect(selectedAspectIds[0])
  })

  // --- FR-4/FR-5: Modul Aspek (shared eksplorasi bar) ---
  const eksplorasiBar = document.getElementById('eksplorasi-bar-m3')
  const m3Status = document.getElementById('m3-status')
  const m3Prompt = document.getElementById('m3-prompt')
  const m3Hint = document.getElementById('m3-hint')
  const m3MeasureList = document.getElementById('m3-measure-list')

  const setPrompt = (text) => {
    m3Prompt.textContent = text
  }

  const showOnly = (ids) => {
    ACTION_BUTTON_IDS.forEach((id) => {
      document.getElementById(id).classList.toggle('hidden', !ids.includes(id))
    })
  }

  const updateMeasureListDisplay = (faceIndices) => {
    const labels = sceneModule.getFaces()
    m3MeasureList.innerHTML = faceIndices
      .map((i) => `Sisi ${labels[i].label}: ${formatMeasureList(i)}`)
      .join('<br>')
    m3MeasureList.classList.remove('hidden')
  }

  const updateStatus = () => {
    if (selectedFaces.length === 0) {
      m3Status.classList.add('hidden')
      return
    }
    const labels = sceneModule.getFaces()
    m3Status.textContent = `Sisi terpilih: ${selectedFaces.map((i) => labels[i].label).join(', ')}`
    m3Status.classList.remove('hidden')
  }

  // Shared by every measuring step (size/area/compareSize/compareShapeSize): walks through
  // `queueFaces` one at a time, letting the student tap rusuk (edges) to see cm values (FR-5
  // "Ukur") and, for a triangular face, reveal its height line (AC-5), before calling `onDone`.
  const startMeasuringQueue = (queueFaces, onDone) => {
    measureQueue = [...queueFaces]
    onQueueDone = onDone
    advanceMeasureQueue()
  }

  const advanceMeasureQueue = () => {
    if (measureQueue.length === 0) {
      sceneModule.setMeasureFace(null)
      measuringFaceIndex = null
      const done = onQueueDone
      onQueueDone = null
      if (done) {
        done()
      }
      return
    }
    measuringFaceIndex = measureQueue.shift()
    sceneModule.setMeasureFace(measuringFaceIndex)
    const face = sceneModule.getFaces()[measuringFaceIndex]
    setPrompt(`Ketuk rusuk pada Sisi ${face.label} untuk melihat ukurannya (cm).`)
    updateMeasureListDisplay([measuringFaceIndex])
    showOnly(face.sides === 3 ? ['btn-m3-data-cukup', 'btn-m3-ukur-tinggi'] : ['btn-m3-data-cukup'])
    currentHandlers = {
      dataCukup: () => advanceMeasureQueue(),
      ukurTinggi: () => {
        const cm = sceneModule.showHeightLine(measuringFaceIndex)
        if (cm !== null) {
          ensureMeasurement(measuringFaceIndex).heightCm = cm
          updateMeasureListDisplay([measuringFaceIndex])
        }
      },
    }
  }

  sceneModule.onEdgeMeasureTap(({edgeIndex, lengthCm}) => {
    if (measuringFaceIndex === null) {
      return
    }
    ensureMeasurement(measuringFaceIndex).edges[edgeIndex] = lengthCm
    updateMeasureListDisplay([measuringFaceIndex])
  })

  const afterAreaMeasured = (idx) => {
    updateMeasureListDisplay([idx])
    setPrompt('AR tidak menampilkan rumus maupun hasil luas. Tentukan bersama kelompokmu bagaimana caramu menghitung luas sisi ini, lalu catat di e-module.')
    showOnly(['btn-m3-catat'])
  }

  const onSelectionComplete = () => {
    const kind = activeAspect.kind
    const idx = selectedFaces[0]

    if (kind === 'shape') {
      setPrompt(activeAspect.afterSelectPrompt)
      showOnly(activeAspect.hint ? ['btn-m3-hint', 'btn-m3-catat'] : ['btn-m3-catat'])
      currentHandlers = {hint: () => m3Hint.classList.toggle('hidden')}
      return
    }

    if (kind === 'size') {
      setPrompt(`Sisi ${sceneModule.getFaces()[idx].label} dipilih.`)
      showOnly(['btn-m3-mulai-ukur'])
      currentHandlers = {
        mulaiUkur: () => startMeasuringQueue([idx], () => {
          setPrompt(`Periksa Data Ukuranmu. ${formatMeasureList(idx)}`)
          showOnly(['btn-m3-catat'])
        }),
      }
      return
    }

    if (kind === 'area') {
      if (hasMeasurement(idx)) {
        setPrompt('Data ukuran sudah tersedia untuk sisi ini.')
        showOnly(['btn-m3-gunakan-sebelumnya', 'btn-m3-ukur-kembali'])
        currentHandlers = {
          gunakanSebelumnya: () => afterAreaMeasured(idx),
          ukurKembali: () => {
            measurements[faceKey(idx)] = {edges: {}, heightCm: null}
            startMeasuringQueue([idx], () => afterAreaMeasured(idx))
          },
        }
      } else {
        startMeasuringQueue([idx], () => afterAreaMeasured(idx))
      }
      return
    }

    if (kind === 'compareShapeSize') {
      const [a, b] = selectedFaces
      setPrompt(activeAspect.afterSelectPrompt)
      showOnly(activeAspect.hint
        ? ['btn-m3-hint', 'btn-m3-bandingkan-bentuk-ukuran']
        : ['btn-m3-bandingkan-bentuk-ukuran'])
      currentHandlers = {
        hint: () => m3Hint.classList.toggle('hidden'),
        bandingkanBentukUkuran: () => {
          const missing = [a, b].filter((i) => !hasMeasurement(i))
          const proceed = () => {
            updateMeasureListDisplay([a, b])
            setPrompt('Bandingkan bentuk dan ukuran bagian-bagian yang bersesuaian pada kedua sisi ini. Apa kesimpulanmu?')
            showOnly(['btn-m3-catat'])
          }
          if (missing.length) {
            startMeasuringQueue(missing, proceed)
          } else {
            proceed()
          }
        },
      }
      return
    }

    if (kind === 'compareSize') {
      const [a, b] = selectedFaces
      const afterMeasured = () => {
        updateMeasureListDisplay([a, b])
        setPrompt('AR menampilkan ukuran kedua sisi. Bandingkan ukuran keduanya.')
        showOnly(['btn-m3-bandingkan-ukuran'])
        currentHandlers = {
          bandingkanUkuran: () => {
            setPrompt('Apa hubungan ukuran yang kamu temukan antara kedua sisi ini? Catat kesimpulanmu di e-module.')
            showOnly(['btn-m3-catat'])
          },
        }
      }
      const missing = [a, b].filter((i) => !hasMeasurement(i))
      if (missing.length === 0) {
        setPrompt('Data ukuran kedua sisi sudah tersedia.')
        showOnly(['btn-m3-gunakan-sebelumnya', 'btn-m3-ukur-kembali'])
        currentHandlers = {
          gunakanSebelumnya: afterMeasured,
          ukurKembali: () => {
            [a, b].forEach((i) => {
              measurements[faceKey(i)] = {edges: {}, heightCm: null}
            })
            startMeasuringQueue([a, b], afterMeasured)
          },
        }
      } else {
        setPrompt('Lengkapi pengukuran untuk kedua sisi.')
        startMeasuringQueue(missing, afterMeasured)
      }
    }
  }

  sceneModule.onFaceTap((index) => {
    if (!activeAspect) {
      return
    }
    const capacity = SELECTION_CAPACITY[activeAspect.kind] || 0
    if (capacity === 0 || selectedFaces.includes(index) || selectedFaces.length >= capacity) {
      return
    }
    selectedFaces.push(index)
    sceneModule.setFaceSelection(selectedFaces)
    updateStatus()

    if (activeAspect.kind === 'free') {
      setPrompt(selectedFaces.length === 1
        ? 'Apa yang kamu perhatikan pada sisi ini?'
        : 'Adakah hubungan antara kedua sisi ini?')
      return
    }

    if (selectedFaces.length === capacity) {
      onSelectionComplete()
    }
  })

  const startAspect = (aspectId) => {
    activeAspect = ASPECTS.find((a) => a.id === aspectId)
    selectedFaces = []
    measureQueue = []
    onQueueDone = null
    measuringFaceIndex = null
    currentHandlers = {}

    sceneModule.resetMarks()
    sceneModule.setFaceSelection([])
    sceneModule.setMeasureFace(null)

    m3Hint.textContent = activeAspect.hint || ''
    m3Hint.classList.add('hidden')
    m3MeasureList.classList.add('hidden')
    m3Status.classList.add('hidden')
    document.getElementById('btn-m3-bandingkan-temuan').classList.add('hidden')
    showOnly([])

    if (activeAspect.kind === 'count') {
      // AC-1: reuse materi-1's plain toggle-highlight tap target; AR never displays the count.
      sceneModule.setAspectTarget('sisi')
      setPrompt(activeAspect.prompt)
      showOnly(['btn-m3-catat'])
    } else {
      sceneModule.setAspectTarget('sisi-select')
      setPrompt(activeAspect.prompt)
      if (activeAspect.kind === 'free') {
        showOnly(['btn-m3-pilih-sisi', 'btn-m3-tampilkan-ukuran', 'btn-m3-temukan-sesuatu'])
      }
    }

    screens.forEach((el) => el.classList.add('hidden'))
    eksplorasiBar.classList.remove('hidden')
  }

  Object.entries(DISPATCHED_HANDLERS).forEach(([id, key]) => {
    document.getElementById(id).addEventListener('click', () => {
      if (currentHandlers[key]) {
        currentHandlers[key]()
      }
    })
  })

  // FR-6: logs (bangun, aspek, sisi) for the Bandingkan Temuan trigger (FR-8/AC-3) and analytics -
  // the actual answer text always stays in the e-module (OQ-2).
  const logFindingAndShowCatat = () => {
    const labels = sceneModule.getFaces()
    const faceIds = selectedFaces.map((i) => labels[i].label)
    findings.push({shape: currentShape, aspect: activeAspect.id, faceIds, time: Date.now()})
    sceneModule.setMeasureFace(null)
    eksplorasiBar.classList.add('hidden')
    const related = findings.filter((f) => f.aspect === activeAspect.id)
    document.getElementById('btn-m3-bandingkan-temuan').classList.toggle('hidden', related.length < 2)
    showScreen('screen-catat-m3')
  }

  document.getElementById('btn-m3-catat').addEventListener('click', logFindingAndShowCatat)
  document.getElementById('btn-m3-temukan-sesuatu').addEventListener('click', logFindingAndShowCatat)

  // FR-4 "Sifat/Info Lainnya": free exploration helpers (not per-step, so wired directly).
  document.getElementById('btn-m3-pilih-sisi').addEventListener('click', () => {
    setPrompt('Ketuk satu atau dua sisi yang ingin kamu amati.')
  })
  document.getElementById('btn-m3-tampilkan-ukuran').addEventListener('click', () => {
    if (selectedFaces.length === 0) {
      return
    }
    const idx = selectedFaces[selectedFaces.length - 1]
    measuringFaceIndex = idx
    sceneModule.setMeasureFace(idx)
    updateMeasureListDisplay(selectedFaces)
  })

  // --- FR-8: Bandingkan Temuan (simplified - shows the 2 most recent findings for this aspect,
  // re-highlights their faces when they're on the shape currently on screen, and lets the student
  // log a free-text-style comparison; no automated "sama/beda" verdict). ---
  document.getElementById('btn-m3-bandingkan-temuan').addEventListener('click', () => {
    const related = findings.filter((f) => f.aspect === activeAspect.id)
    const [findingA, findingB] = related.slice(-2)
    pendingComparison = {findingA, findingB}

    document.getElementById('m3-bandingkan-list').innerHTML = [findingA, findingB].map((f) => (
      `<p><strong>Bangun: ${f.shape}</strong><br>Sisi: ${f.faceIds.join(', ') || '-'}</p>`
    )).join('')

    if (findingA.shape === currentShape && findingB.shape === currentShape) {
      const labels = sceneModule.getFaces()
      const idxOf = (label) => labels.findIndex((l) => l.label === label)
      const idxs = [...findingA.faceIds, ...findingB.faceIds].map(idxOf).filter((i) => i >= 0).slice(0, 2)
      sceneModule.setFaceSelection(idxs)
    }

    showScreen('screen-bandingkan-m3')
  })

  document.getElementById('btn-m3-catat-perbandingan').addEventListener('click', () => {
    if (pendingComparison) {
      comparisons.push({...pendingComparison, time: Date.now()})
    }
    showScreen('screen-catat-m3')
  })

  document.getElementById('btn-m3-tutup-bandingkan').addEventListener('click', () => {
    showScreen('screen-catat-m3')
  })

  // --- FR-4 trailer (standard on every aspect module): Pilih/Bandingkan Sisi Lain | Kembali ke
  // Aspek Pengamatan | Periksa Kecukupan Data. ---
  document.getElementById('btn-m3-pilih-sisi-lain').addEventListener('click', () => {
    if (activeAspect) {
      startAspect(activeAspect.id)
    }
  })

  document.getElementById('btn-m3-kembali-aspek').addEventListener('click', () => {
    eksplorasiBar.classList.add('hidden')
    sceneModule.setMeasureFace(null)
    showScreen('screen-pilih-aspek-m3')
  })

  const openKecukupan = () => {
    eksplorasiBar.classList.add('hidden')
    sceneModule.setMeasureFace(null)
    document.getElementById('kecukupan-step1-m3').classList.remove('hidden')
    document.getElementById('kecukupan-step2-m3').classList.add('hidden')
    showScreen('screen-kecukupan-m3')
  }

  document.getElementById('btn-m3-cek-kecukupan-bar').addEventListener('click', openKecukupan)

  // --- FR-6: Catat ---
  document.getElementById('btn-amati-aspek-lain-m3').addEventListener('click', () => {
    showScreen('screen-pilih-aspek-m3')
  })

  document.getElementById('btn-cek-kecukupan-m3').addEventListener('click', openKecukupan)

  // --- FR-7: Periksa Kecukupan Data ---
  document.getElementById('btn-sudah-cukup-m3').addEventListener('click', () => {
    showScreen('screen-selesai-m3')
  })

  document.getElementById('btn-perlu-tambahan-m3').addEventListener('click', () => {
    document.getElementById('kecukupan-step1-m3').classList.add('hidden')
    document.getElementById('kecukupan-step2-m3').classList.remove('hidden')
  })

  document.getElementById('btn-amati-aspek-lain-2-m3').addEventListener('click', () => {
    showScreen('screen-pilih-aspek-m3')
  })

  // AC-4: data (measurements/findings/comparisons) lives in this module's closure, so switching
  // shapes here never clears it - only chooseShape() (which just calls sceneModule.setShape) runs.
  document.getElementById('btn-amati-bangun-lain-m3').addEventListener('click', () => {
    showScreen('screen-pilih-bangun-m3')
  })

  // --- FR-9: Akhir ---
  document.getElementById('btn-selesai-eksplorasi-m3').addEventListener('click', () => {
    showScreen('screen-awal-m3')
  })

  showScreen('screen-awal-m3')
}
