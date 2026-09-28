// Materi 1: "Klasifikasi Bangun Ruang Sisi Datar" - the guided AR exploration flow from PRD.md
// (F1-F11). Everything specific to this materi (markup, styles, aspects, flow logic) lives in
// this folder; it only talks to the outside world through initMateri1's two arguments.
import './materi-1.css'
import {MATERI1_MARKUP} from './markup'
import {ASPECTS} from './aspects'

// sceneModule: the shared threejs-scene-init pipeline module (renders/highlights the 3D shape).
// startAr: callback that starts the 8th Wall camera/XR session (owned by app.js).
export const initMateri1 = (sceneModule, {startAr}) => {
  const root = document.getElementById('materi-1-root')
  root.innerHTML = MATERI1_MARKUP

  const screens = root.querySelectorAll('.screen')
  const showScreen = (id) => {
    screens.forEach((el) => el.classList.add('hidden'))
    document.getElementById(id).classList.remove('hidden')
  }

  let arStarted = false
  let selectedAspectIds = []

  // --- F1/F2: Tampilan awal -> Persiapan AR ---
  document.getElementById('btn-mulai-ar').addEventListener('click', () => {
    if (!arStarted) {
      arStarted = true
      startAr()
    }
    showScreen('screen-persiapan')
  })

  document.getElementById('btn-persiapan-lanjut').addEventListener('click', () => {
    showScreen('screen-pilih-bangun')
  })

  // --- F3: Pilih Bangun ---
  const bangunGrid = document.getElementById('bangun-grid')
  const bangunSub = document.getElementById('bangun-sub')
  const segiNSlider = document.getElementById('segi-n-slider')
  const segiNValue = document.getElementById('segi-n-value')
  let subGroup = null

  const chooseShape = (shapeId) => {
    sceneModule.setShape(shapeId)
    bangunSub.classList.add('hidden')
    showScreen('screen-pilih-aspek')
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

  document.getElementById('btn-pilih-segi-n').addEventListener('click', () => {
    if (!subGroup) {
      return
    }
    chooseShape(`${subGroup}-${segiNSlider.value}`)
  })

  // --- F5: Pilih Aspek ---
  const aspekList = document.getElementById('aspek-list')
  const btnAspekLanjut = document.getElementById('btn-aspek-lanjut')

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

  // --- F6/F7: Eksplorasi ---
  const eksplorasiBar = document.getElementById('eksplorasi-bar')
  const eksplorasiPrompt = document.getElementById('eksplorasi-prompt')
  const eksplorasiLegend = document.getElementById('eksplorasi-legend')
  let transparent = false

  const startAspect = (aspectId) => {
    const aspect = ASPECTS.find((a) => a.id === aspectId)
    sceneModule.setAspectTarget(aspect.target)
    sceneModule.resetMarks()
    eksplorasiPrompt.textContent = aspect.prompt
    eksplorasiLegend.classList.add('hidden')
    transparent = false
    sceneModule.setTransparent(false)
    screens.forEach((el) => el.classList.add('hidden'))
    eksplorasiBar.classList.remove('hidden')
  }

  document.getElementById('btn-lihat-jelas').addEventListener('click', () => {
    eksplorasiLegend.classList.toggle('hidden')
  })

  document.getElementById('btn-transparansi').addEventListener('click', () => {
    transparent = !transparent
    sceneModule.setTransparent(transparent)
  })

  document.getElementById('btn-catat').addEventListener('click', () => {
    eksplorasiBar.classList.add('hidden')
    showScreen('screen-catat')
  })

  // --- F8: Catat ---
  document.getElementById('btn-amati-aspek-lain').addEventListener('click', () => {
    showScreen('screen-pilih-aspek')
  })

  document.getElementById('btn-cek-kecukupan').addEventListener('click', () => {
    document.getElementById('kecukupan-step1').classList.remove('hidden')
    document.getElementById('kecukupan-step2').classList.add('hidden')
    showScreen('screen-kecukupan')
  })

  // --- F9: Kecukupan Data ---
  document.getElementById('btn-sudah-cukup').addEventListener('click', () => {
    showScreen('screen-selesai')
  })

  document.getElementById('btn-perlu-tambahan').addEventListener('click', () => {
    document.getElementById('kecukupan-step1').classList.add('hidden')
    document.getElementById('kecukupan-step2').classList.remove('hidden')
  })

  document.getElementById('btn-amati-aspek-lain-2').addEventListener('click', () => {
    showScreen('screen-pilih-aspek')
  })

  document.getElementById('btn-amati-bangun-lain').addEventListener('click', () => {
    showScreen('screen-pilih-bangun')
  })

  // --- F11: Selesai ---
  document.getElementById('btn-selesai-eksplorasi').addEventListener('click', () => {
    showScreen('screen-awal')
  })

  showScreen('screen-awal')
}
