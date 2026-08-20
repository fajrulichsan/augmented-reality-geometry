// app.js is the main entry point for your three.js 8th Wall app.

import jsQR from 'jsqr'
import {initScenePipelineModule} from './threejs-scene-init'
import * as THREE from 'three';

window.THREE = THREE

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
    initScenePipelineModule(),  // Sets up the threejs camera and scene content.
  ])

  const canvas = document.getElementById('camerafeed')
  canvas.style.display = ''
  // Open the camera and start running the camera run loop.
  XR8.run({canvas})
}

const onxrloaded = () => {
  document.body.classList.contains('qr-scanned') ? startAr() : waitForQrScan(startAr)
}

// Scans the device camera for a QR code and calls onScanned() once one is found.
const waitForQrScan = async (onScanned) => {
  const video = document.getElementById('qr-video')
  const status = document.getElementById('qr-status')
  const scanCanvas = document.createElement('canvas')
  const scanCtx = scanCanvas.getContext('2d', {willReadFrequently: true})

  let stream
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: {facingMode: 'environment'},
    })
  } catch (err) {
    status.textContent = 'Tidak bisa mengakses kamera. Izinkan akses kamera lalu muat ulang halaman.'
    return
  }

  video.srcObject = stream
  await video.play()

  let stopped = false
  const tick = () => {
    if (stopped) {
      return
    }

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      scanCanvas.width = video.videoWidth
      scanCanvas.height = video.videoHeight
      scanCtx.drawImage(video, 0, 0, scanCanvas.width, scanCanvas.height)

      const imageData = scanCtx.getImageData(0, 0, scanCanvas.width, scanCanvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        stopped = true
        stream.getTracks().forEach((track) => track.stop())
        document.body.classList.add('qr-scanned', 'qr-gate-hidden')
        onScanned()
        return
      }
    }

    requestAnimationFrame(tick)
  }

  requestAnimationFrame(tick)
}

window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
