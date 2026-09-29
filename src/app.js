// app.js is the main entry point for your three.js 8th Wall app.

import {initScenePipelineModule} from './threejs-scene-init'
import {initMateri1} from './materi-1'
import {initMateri2} from './materi-2'
import {initMateri3} from './materi-3'
import {initMateri4} from './materi-4'
import * as THREE from 'three';

window.THREE = THREE

const sceneModule = initScenePipelineModule()

// Both guided flows can call this (each has its own "Mulai AR" button), but the camera/XR
// session must only be started once.
let arRunning = false
const startAr = () => {
  if (arRunning) {
    return
  }
  arRunning = true
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

// Materi 3 (Luas Permukaan) only covers kubus/balok/prisma (PRD-materi-3.md section 1 scope; no
// limas), same as materi 1's solid (non-net) rendering mode.
const MATERI_3 = '3'
const MATERI_4 = '4'

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

  const materi1Root = document.getElementById('materi-1-root')
  const materi2Root = document.getElementById('materi-2-root')
  const materi3Root = document.getElementById('materi-3-root')
  const materi4Root = document.getElementById('materi-4-root')

  const applyMateriState = () => {
    const isNetMateri = materiSelect.value === NET_MATERI
    const isMateri3 = materiSelect.value === MATERI_3
    const isMateri4 = materiSelect.value === MATERI_4

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

    // The dev shape-popup only drives the raw scene; the guided-flow overlay shown underneath
    // it switches too, so the popup's materi choice always matches what's on screen.
    materi1Root.classList.toggle('hidden', isNetMateri || isMateri3 || isMateri4)
    materi2Root.classList.toggle('hidden', !isNetMateri)
    materi3Root.classList.toggle('hidden', !isMateri3)
    materi4Root.classList.toggle('hidden', !isMateri4)
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
  initMateri1(sceneModule, {startAr})
  initMateri2(sceneModule, {startAr})
  initMateri3(sceneModule, {startAr})
  initMateri4(sceneModule, {startAr})
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
