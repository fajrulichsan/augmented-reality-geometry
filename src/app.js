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

// Only materi 2 (Jaring-Jaring) has a working net so far, and only for the kubus. Other shapes
// still show the "as is" 3D view (materi 1) until their nets are built.
const NET_MATERI = '2'
const NET_SHAPE = 'kubus'

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

    // Only the kubus net is built so far: lock the shape picker to kubus while in net mode.
    Array.from(shapeSelect.options).forEach((option) => {
      option.disabled = isNetMateri && option.value !== NET_SHAPE
    })
    if (isNetMateri && shapeSelect.value !== NET_SHAPE) {
      shapeSelect.value = NET_SHAPE
      sceneModule.setShape(NET_SHAPE)
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

const onxrloaded = () => {
  initShapePicker()
  startAr()
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
