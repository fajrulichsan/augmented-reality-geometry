// Materi 2: "Eksplorasi dengan AR (Jaring-Jaring & Pelipatan Bangun Ruang)" - the guided AR flow
// from PRD-materi-2.md (A1-A12). Everything specific to this materi (markup, styles, aspects,
// flow logic) lives in this folder; it only talks to the outside world through initMateri2's two
// arguments. Note: A11 "Bandingkan Temuan" (P1, needs a history of observed shapes shown side by
// side) is not implemented here.
import './materi-2.css'
import {MATERI2_MARKUP} from './markup'
import {ASPECTS} from './aspects'

// The scene module reports fold state as a 0-100 "unfold" percent (0 = folded/solid, 100 = fully
// open net). The PRD's own slider is the mirror of that (0% = terbuka penuh, 100% = terbentuk
// penuh), so this materi always converts at the boundary: sceneModule wants unfoldPercent,
// the UI/PRD wants 100 - unfoldPercent.
const FOLD_DURATION_MS = 3000

export const initMateri2 = (sceneModule, {startAr}) => {
  const root = document.getElementById('materi-2-root')
  root.innerHTML = MATERI2_MARKUP

  const screens = root.querySelectorAll('.screen')
  const foldBar = document.getElementById('fold-bar-m2')

  const showScreen = (id) => {
    screens.forEach((el) => el.classList.add('hidden'))
    foldBar.classList.add('hidden')
    document.getElementById(id).classList.remove('hidden')
  }

  let arStarted = false
  let selectedAspectIds = []

  // --- A1/A3: Tampilan awal -> Persiapan AR ---
  document.getElementById('btn-mulai-ar-m2').addEventListener('click', () => {
    if (!arStarted) {
      arStarted = true
      startAr()
    }
    showScreen('screen-persiapan-m2')
  })

  document.getElementById('btn-persiapan-lanjut-m2').addEventListener('click', () => {
    showScreen('screen-pilih-bangun-m2')
  })

  // --- A2: Pilih Bangun ---
  const bangunGrid = document.getElementById('bangun-grid-m2')
  const bangunSub = document.getElementById('bangun-sub-m2')
  const segiNSlider = document.getElementById('segi-n-slider-m2')
  const segiNValue = document.getElementById('segi-n-value-m2')
  let subGroup = null

  const chooseShape = (shapeId) => {
    sceneModule.setNetMode(false)
    sceneModule.setAspectTarget('sisi')
    sceneModule.setShape(shapeId)
    sceneModule.setTransparent(false)
    bangunSub.classList.add('hidden')
    showScreen('screen-amati-jaring-m2')
    setUnfoldPercent(100, true)
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

  document.getElementById('btn-pilih-segi-n-m2').addEventListener('click', () => {
    if (!subGroup) {
      return
    }
    chooseShape(`${subGroup}-${segiNSlider.value}`)
  })

  // --- Fold animation engine shared by A5 (intro) and A7 (per-aspect) ---
  const foldSlider = document.getElementById('fold-slider-m2')
  const foldControls = document.getElementById('fold-controls-m2')
  const foldPrompt = document.getElementById('fold-prompt-m2')
  const foldStatus = document.getElementById('fold-status-m2')
  const foldHint = document.getElementById('fold-hint-m2')
  const btnPlayPause = document.getElementById('btn-fold-playpause')
  const btnReopen = document.getElementById('btn-fold-reopen')
  const btnRepeat = document.getElementById('btn-fold-repeat')
  const btnHint = document.getElementById('btn-fold-hint')
  const btnLanjut = document.getElementById('btn-fold-lanjut')
  const btnCatat = document.getElementById('btn-fold-catat')

  let unfoldPercent = 100 // scene-module convention: 100 = open net, 0 = folded solid.
  let animFrame = null
  let animDirection = 0 // -1 = folding (playing), +1 = reopening, 0 = stopped.
  let animFrom = 100
  let animTo = 100
  let animStart = 0
  let onFullyFolded = null // called once when unfoldPercent first reaches 0 in this aspect.
  let hasFoldedOnce = false

  const setUnfoldPercent = (value, silent) => {
    unfoldPercent = Math.max(0, Math.min(100, value))
    sceneModule.setNetProgress(unfoldPercent)
    foldSlider.value = String(Math.round(100 - unfoldPercent))
    if (!silent && unfoldPercent === 0 && !hasFoldedOnce) {
      hasFoldedOnce = true
      if (onFullyFolded) {
        onFullyFolded()
      }
    }
  }

  const stopAnim = () => {
    if (animFrame !== null) {
      cancelAnimationFrame(animFrame)
      animFrame = null
    }
    animDirection = 0
    btnPlayPause.textContent = '▶ Lipat'
  }

  const stepAnim = (now) => {
    const elapsed = now - animStart
    const duration = (FOLD_DURATION_MS * Math.abs(animTo - animFrom)) / 100 || 1
    const progress = Math.min(elapsed / duration, 1)
    setUnfoldPercent(animFrom + (animTo - animFrom) * progress)
    if (progress >= 1) {
      stopAnim()
      return
    }
    animFrame = requestAnimationFrame(stepAnim)
  }

  const playTo = (target) => {
    stopAnim()
    animFrom = unfoldPercent
    animTo = target
    animDirection = target < animFrom ? -1 : 1
    animStart = performance.now()
    btnPlayPause.textContent = '⏸ Jeda'
    animFrame = requestAnimationFrame(stepAnim)
  }

  btnPlayPause.addEventListener('click', () => {
    if (animDirection !== 0) {
      stopAnim()
      return
    }
    playTo(0) // "Mulai Lipat": fold toward the solid.
  })

  btnReopen.addEventListener('click', () => {
    playTo(100)
  })

  btnRepeat.addEventListener('click', () => {
    stopAnim()
    setUnfoldPercent(100, true)
    playTo(0)
  })

  foldSlider.addEventListener('input', () => {
    stopAnim()
    setUnfoldPercent(100 - Number(foldSlider.value))
  })

  btnHint.addEventListener('click', () => {
    foldHint.classList.toggle('hidden')
  })

  // --- A4/A5: Amati Jaring-Jaring -> Mulai Lipat (intro fold, not tied to any aspect) ---
  document.getElementById('btn-mulai-lipat-awal').addEventListener('click', () => {
    stopAnim()
    hasFoldedOnce = false
    onFullyFolded = null
    foldStatus.classList.add('hidden')
    foldPrompt.textContent = 'Amati bagaimana jaring-jaring ini terlipat menjadi bangun ruang. Kamu boleh menjeda atau mengulanginya.'
    foldHint.classList.add('hidden')
    btnHint.classList.add('hidden')
    btnCatat.classList.add('hidden')
    btnLanjut.classList.remove('hidden')
    foldControls.classList.remove('hidden')
    btnPlayPause.disabled = false
    btnReopen.disabled = false
    btnRepeat.disabled = false
    foldSlider.disabled = false
    setUnfoldPercent(100, true)
    screens.forEach((el) => el.classList.add('hidden'))
    foldBar.classList.remove('hidden')
  })

  btnLanjut.addEventListener('click', () => {
    stopAnim()
    showScreen('screen-pilih-aspek-m2')
  })

  // --- A6: Pilih Aspek ---
  const aspekList = document.getElementById('aspek-list-m2')
  const btnAspekLanjut = document.getElementById('btn-aspek-lanjut-m2')

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

  // --- A7: Eksplorasi per aspek ---
  let selectedFaceCount = 0
  let activeAspect = null

  // Unlocks the fold transport once enough sisi are highlighted (and re-locks it if the student
  // un-highlights one again). Registered once; reacts based on whichever aspect is active.
  const updateSelectionGate = () => {
    if (!activeAspect || activeAspect.selection === 0) {
      return
    }
    const required = activeAspect.selection
    const ready = selectedFaceCount === required
    foldStatus.textContent = `Sisi terpilih: ${selectedFaceCount}/${required}`
    btnPlayPause.disabled = !ready
    btnReopen.disabled = !ready
    btnRepeat.disabled = !ready
    foldSlider.disabled = !ready
    if (ready && activeAspect.promptBeforeFold) {
      foldPrompt.textContent = activeAspect.promptBeforeFold
    }
  }

  sceneModule.onFaceHighlightChange((count) => {
    selectedFaceCount = count
    updateSelectionGate()
  })

  const startAspect = (aspectId) => {
    activeAspect = ASPECTS.find((a) => a.id === aspectId)
    stopAnim()
    hasFoldedOnce = false
    sceneModule.resetMarks()
    sceneModule.setAspectTarget('sisi')
    setUnfoldPercent(100, true)

    btnHint.classList.toggle('hidden', !activeAspect.hint)
    foldHint.textContent = activeAspect.hint || ''
    foldHint.classList.add('hidden')
    btnLanjut.classList.add('hidden')
    btnCatat.classList.remove('hidden')
    btnCatat.disabled = true

    onFullyFolded = () => {
      foldPrompt.textContent = activeAspect.promptAfterFold
      btnCatat.disabled = false
    }

    if (activeAspect.selection > 0) {
      // Selection step first: fold controls stay disabled until enough sisi are picked
      // (updateSelectionGate, driven by onFaceHighlightChange, unlocks them).
      selectedFaceCount = 0
      foldStatus.classList.remove('hidden')
      foldPrompt.textContent = activeAspect.promptIntro
      foldControls.classList.remove('hidden')
      updateSelectionGate()
    } else {
      foldStatus.classList.add('hidden')
      foldPrompt.textContent = activeAspect.promptBeforeFold
      foldControls.classList.remove('hidden')
      btnPlayPause.disabled = false
      btnReopen.disabled = false
      btnRepeat.disabled = false
      foldSlider.disabled = false
    }

    screens.forEach((el) => el.classList.add('hidden'))
    foldBar.classList.remove('hidden')
  }

  btnCatat.addEventListener('click', () => {
    stopAnim()
    foldBar.classList.add('hidden')
    showScreen('screen-catat-m2')
  })

  // --- A8: Catat ---
  document.getElementById('btn-amati-aspek-lain-m2').addEventListener('click', () => {
    showScreen('screen-pilih-aspek-m2')
  })

  document.getElementById('btn-cek-kecukupan-m2').addEventListener('click', () => {
    document.getElementById('kecukupan-step1-m2').classList.remove('hidden')
    document.getElementById('kecukupan-step2-m2').classList.add('hidden')
    showScreen('screen-kecukupan-m2')
  })

  // --- A9: Kecukupan Data ---
  document.getElementById('btn-sudah-cukup-m2').addEventListener('click', () => {
    showScreen('screen-selesai-m2')
  })

  document.getElementById('btn-perlu-tambahan-m2').addEventListener('click', () => {
    document.getElementById('kecukupan-step1-m2').classList.add('hidden')
    document.getElementById('kecukupan-step2-m2').classList.remove('hidden')
  })

  document.getElementById('btn-amati-aspek-lain-2-m2').addEventListener('click', () => {
    showScreen('screen-pilih-aspek-m2')
  })

  // --- A10: Bangun lain ---
  document.getElementById('btn-amati-bangun-lain-m2').addEventListener('click', () => {
    showScreen('screen-pilih-bangun-m2')
  })

  // --- A12: Selesai ---
  document.getElementById('btn-selesai-eksplorasi-m2').addEventListener('click', () => {
    showScreen('screen-awal-m2')
  })

  showScreen('screen-awal-m2')
}
