// app.js is the main entry point for your three.js 8th Wall app.

import {initScenePipelineModule} from './threejs-scene-init'
import * as THREE from 'three';

window.THREE = THREE

const sceneModule = initScenePipelineModule()

const startAr = () => {
  XR8.addCameraPipelineModules([  // Add camera pipeline modules.
    // Existing pipeline modules.
    XR8.GlTextureRenderer.pipelineModule(),      // Draws the camera feed.
    XR8.Threejs.pipelineModule(),                // Creates a ThreeJS AR Scene.
    XR8.XrController.pipelineModule(),           // Enables SLAM tracking.
    LandingPage.pipelineModule(),         // Detects unsupported browsers and gives hints.
    XRExtras.FullWindowCanvas.pipelineModule(),  // Modifies the canvas to fill the window.
    XRExtras.Loading.pipelineModule(),           // Manages the loading screen on startup.
    XRExtras.RuntimeError.pipelineModule(),      // Shows an error image on runtime error.
    // Custom pipeline modules.
    sceneModule,  // Sets up the threejs camera and scene content.
  ])

  const canvas = document.getElementById('camerafeed')
  canvas.style.display = ''
  // Open the camera and start running the camera run loop.
  XR8.run({canvas})
}

// Materi 2 (Jaring-Jaring) has a working net for every shape in the picker.
const NET_MATERI = '2'
const NET_SHAPES = ['kubus', 'balok', 'prisma-3', 'prisma-5', 'limas-3', 'limas-5']

const initShapePicker = () => {
  const toggle = document.getElementById('shape-toggle')
  const popup = document.getElementById('shape-popup')
  const materiSelect = document.getElementById('materi-select')
  const shapeSelect = document.getElementById('shape-select')
  const netSliderWrap = document.getElementById('net-slider-wrap')
  const netSlider = document.getElementById('net-slider')
  const netSliderValue = document.getElementById('net-slider-value')

  toggle.addEventListener('click', () => {
    const isHidden = popup.classList.toggle('hidden')
    toggle.setAttribute('aria-expanded', String(!isHidden))
  })

  const applyMateriState = () => {
    const isNetMateri = materiSelect.value === NET_MATERI

    // Lock the shape picker to net-capable shapes while in net mode.
    Array.from(shapeSelect.options).forEach((option) => {
      option.disabled = isNetMateri && !NET_SHAPES.includes(option.value)
    })
    if (isNetMateri && !NET_SHAPES.includes(shapeSelect.value)) {
      shapeSelect.value = NET_SHAPES[0]
      sceneModule.setShape(NET_SHAPES[0])
    }

    netSliderWrap.classList.toggle('hidden', !isNetMateri)
    sceneModule.setNetMode(isNetMateri)
  }

  materiSelect.addEventListener('change', applyMateriState)
  applyMateriState()

  shapeSelect.addEventListener('change', () => {
    sceneModule.setShape(shapeSelect.value)
  })

  netSlider.addEventListener('input', () => {
    netSliderValue.textContent = netSlider.value
    sceneModule.setNetProgress(Number(netSlider.value))
  })

  sceneModule.onProgress((percent) => {
    netSlider.value = percent
    netSliderValue.textContent = percent
  })
}

// Materi 1's guided flow (PRD F1-F11): aspek pengamatan, prompt di AR, dan target tap-nya (sisi,
// rusuk, atau titik sudut) - lihat PRD bagian 4.
const ASPECTS = [
  {
    id: 'bentuk-sisi',
    label: 'Bentuk sisi',
    prompt: 'Amati model dari berbagai arah. Bentuk apa saja yang kamu temukan pada sisi-sisinya?',
    target: 'sisi',
  },
  {
    id: 'susunan-sisi',
    label: 'Susunan sisi',
    prompt: 'Amati bagaimana sisi-sisi bangun tersusun dan saling berhubungan. Apa yang kamu temukan?',
    target: 'sisi',
  },
  {
    id: 'sejajar',
    label: 'Pasangan bidang sisi sejajar',
    prompt: 'Amati model dari berbagai arah. Apakah kamu menemukan bidang sisi yang tampak sejajar?',
    target: 'sisi',
  },
  {
    id: 'alas',
    label: 'Bentuk sisi sebagai alas',
    prompt: 'Pilih salah satu sisi yang akan kamu amati sebagai alas. Amati bentuk sisi tersebut dari berbagai arah. Berbentuk apakah sisi yang kamu pilih?',
    target: 'sisi',
  },
  {
    id: 'jumlah-sisi',
    label: 'Jumlah sisi',
    prompt: 'Amati model dari berbagai arah. Telusuri seluruh sisinya. Berapa banyak sisi yang kamu temukan?',
    target: 'sisi',
  },
  {
    id: 'jumlah-rusuk',
    label: 'Jumlah rusuk',
    prompt: 'Amati model dari berbagai arah. Telusuri seluruh rusuknya. Berapa banyak rusuk yang kamu temukan?',
    target: 'rusuk',
  },
  {
    id: 'jumlah-titik-sudut',
    label: 'Jumlah titik sudut',
    prompt: 'Amati model dari berbagai arah. Telusuri seluruh titik sudutnya. Berapa banyak titik sudut yang kamu temukan?',
    target: 'titik',
  },
  {
    id: 'lainnya',
    label: 'Sifat/pola lainnya',
    prompt: 'Amati kembali model secara keseluruhan. Adakah sifat atau pola lain yang menurutmu dapat membantu menyelidiki dugaan kelompokmu?',
    target: 'sisi',
  },
]

const initGuidedFlow = () => {
  const screens = document.querySelectorAll('.screen')
  const showScreen = (id) => {
    screens.forEach((el) => el.classList.add('hidden'))
    document.getElementById(id).classList.remove('hidden')
  }

  let arStarted = false
  let selectedAspectIds = []
  let aspectCursor = 0

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
    aspectCursor = 0
    startAspect(selectedAspectIds[aspectCursor])
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

const onxrloaded = () => {
  initShapePicker()
  initGuidedFlow()
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
