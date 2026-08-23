// Define an 8th Wall XR Camera Pipeline Module that adds a cube to a threejs scene on startup.
// Tapping a face highlights it temporarily (without judging whether it's the "right" one, per
// the AR observation-prompt UX: the student explores, the app doesn't grade). Double-tapping a
// face unfolds the cube into its flat net (like unfolding a cardboard box); double-tapping again
// folds it back up. Tapping anywhere else recenters the scene as before. A one-finger drag
// rotates the cube; a two-finger pinch scales it up or down.
import * as THREE from 'three';

import cubeTexture from './assets/cube-texture.png'

// Folded position/rotation match a unit BoxGeometry's faces. Net position/rotation lay the
// faces out flat in a cross shape, all facing +z (same orientation as the front face).
const FACE_DEFS = [
  {foldedPos: [0, 0, 0.5], foldedRot: [0, 0, 0], netPos: [0, 0, 0]},
  {foldedPos: [0, 0, -0.5], foldedRot: [0, Math.PI, 0], netPos: [2, 0, 0]},
  {foldedPos: [0, 0.5, 0], foldedRot: [-Math.PI / 2, 0, 0], netPos: [0, 1, 0]},
  {foldedPos: [0, -0.5, 0], foldedRot: [Math.PI / 2, 0, 0], netPos: [0, -1, 0]},
  {foldedPos: [-0.5, 0, 0], foldedRot: [0, -Math.PI / 2, 0], netPos: [-1, 0, 0]},
  {foldedPos: [0.5, 0, 0], foldedRot: [0, Math.PI / 2, 0], netPos: [1, 0, 0]},
]

const ANIM_DURATION_MS = 600
const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

const HIGHLIGHT_COLOR = 0xFFEB3B
const HIGHLIGHT_DURATION_MS = 1500

export const initScenePipelineModule = () => {
  const purple = 0xAD50FF

  let cubeGroup
  let faces = []

  // Open animation state: t goes from 0 (folded) to 1 (fully unfolded net).
  let isOpen = false
  let t = 0
  let tFrom = 0
  let tTo = 0
  let animStartTime = 0

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  let lastTapTime = 0
  let lastTapFace = null
  const DOUBLE_TAP_WINDOW_MS = 350

  // One-finger drag-to-rotate / two-finger pinch-to-scale state.
  const ROTATE_SPEED = 0.006
  const MIN_SCALE = 0.4
  const MAX_SCALE = 3
  const DRAG_THRESHOLD_PX = 10
  let dragTouchId = null
  let dragLastX = 0
  let dragLastY = 0
  let dragMoved = false
  let pinchStartDistance = 0
  let pinchStartScale = 1

  // Populates a cube into an XR scene and sets the initial camera position.
  const initXrScene = ({scene, camera, renderer}) => {
    // Enable shadows in the rednerer.
    renderer.shadowMap.enabled = true

    // Add some light to the scene.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    scene.add(directionalLight)

    // Build a purple cube out of 6 separate face planes so they can unfold into a net.
    const texture = new THREE.TextureLoader().load(cubeTexture)

    cubeGroup = new THREE.Group()
    cubeGroup.position.set(0, 0.5, 0)

    faces = FACE_DEFS.map(({foldedPos, foldedRot, netPos}) => {
      const material = new THREE.MeshBasicMaterial({map: texture, color: purple, side: THREE.DoubleSide})
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material)
      mesh.castShadow = true

      mesh.userData.folded = {
        position: new THREE.Vector3(...foldedPos),
        quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(...foldedRot)),
      }
      mesh.userData.net = {
        position: new THREE.Vector3(...netPos),
        quaternion: new THREE.Quaternion(),
      }
      mesh.userData.highlightUntil = 0

      mesh.position.copy(mesh.userData.folded.position)
      mesh.quaternion.copy(mesh.userData.folded.quaternion)

      cubeGroup.add(mesh)
      return mesh
    })

    scene.add(cubeGroup)

    // Add a plane that can receive shadows.
    const planeGeometry = new THREE.PlaneGeometry(2000, 2000)
    planeGeometry.rotateX(-Math.PI / 2)

    const planeMaterial = new THREE.ShadowMaterial()
    planeMaterial.opacity = 0.67

    const plane = new THREE.Mesh(planeGeometry, planeMaterial)
    plane.receiveShadow = true
    scene.add(plane)

    // Set the initial camera position relative to the scene we just laid out. This must be at a
    // height greater than y=0.
    camera.position.set(0, 2, 2)
  }

  // Starts (or reverses) the fold/unfold animation from its current position.
  const setOpen = (open) => {
    if (open === isOpen) {
      return
    }
    isOpen = open
    tFrom = t
    tTo = open ? 1 : 0
    animStartTime = performance.now()
  }

  // Advances the fold/unfold animation and applies it to each face. Called once per frame.
  const updateAnimation = () => {
    if (t === tTo) {
      return
    }

    const progress = Math.min((performance.now() - animStartTime) / ANIM_DURATION_MS, 1)
    t = tFrom + (tTo - tFrom) * easeInOutQuad(progress)

    faces.forEach((mesh) => {
      const {folded, net} = mesh.userData
      mesh.position.lerpVectors(folded.position, net.position, t)
      mesh.quaternion.slerpQuaternions(folded.quaternion, net.quaternion, t)
    })
  }

  // Flashes a face's material to the highlight color, then fades it back to its own color.
  const highlightFace = (mesh) => {
    mesh.material.color.setHex(HIGHLIGHT_COLOR)
    mesh.userData.highlightUntil = performance.now() + HIGHLIGHT_DURATION_MS
  }

  // Fades any faces whose highlight has expired back to the cube's base color.
  const updateHighlights = () => {
    const now = performance.now()
    faces.forEach((mesh) => {
      if (mesh.userData.highlightUntil && now >= mesh.userData.highlightUntil) {
        mesh.userData.highlightUntil = 0
        mesh.material.color.setHex(purple)
      }
    })
  }

  // Returns true if the tap hit a cube face. A single tap highlights the face temporarily,
  // without answering whether it's the correct one for whatever aspect the student is
  // exploring. A second tap on the same face within DOUBLE_TAP_WINDOW_MS toggles the
  // fold/unfold animation instead.
  const handleCubeTap = (clientX, clientY, canvas, camera) => {
    const rect = canvas.getBoundingClientRect()
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(pointer, camera)
    const intersection = raycaster.intersectObjects(faces, false)[0]
    if (!intersection) {
      return false
    }

    const face = intersection.object
    const now = performance.now()
    const isDoubleTap = face === lastTapFace && now - lastTapTime < DOUBLE_TAP_WINDOW_MS

    if (isDoubleTap) {
      setOpen(!isOpen)
      lastTapFace = null
    } else {
      highlightFace(face)
      lastTapFace = face
      lastTapTime = now
    }
    return true
  }

  const touchDistance = (touchA, touchB) => {
    const dx = touchA.clientX - touchB.clientX
    const dy = touchA.clientY - touchB.clientY
    return Math.hypot(dx, dy)
  }

  // Return a camera pipeline module that adds scene elements on start.
  return {
    // Camera pipeline modules need a name. It can be whatever you want but must be unique within
    // your app.
    name: 'threejsinitscene',

    // onStart is called once when the camera feed begins. In this case, we need to wait for the
    // XR8.Threejs scene to be ready before we can access it to add content. It was created in
    // XR8.Threejs.pipelineModule()'s onStart method.
    onStart: ({canvas}) => {
      const {scene, camera, renderer} = XR8.Threejs.xrScene()  // Get the 3js scene from XR8.Threejs

      initXrScene({scene, camera, renderer})  // Add objects set the starting camera position.

      // prevent scroll/pinch gestures on canvas
      canvas.addEventListener('touchmove', (event) => {
        event.preventDefault()
      })

      // Sync the xr controller's 6DoF position and camera paremeters with our scene.
      XR8.XrController.updateCameraProjectionMatrix(
        {origin: camera.position, facing: camera.quaternion}
      )

      // Tapping a cube face highlights it (double-tap folds/unfolds the net); tapping anywhere
      // else recenters content. Dragging with one finger rotates the cube instead of tapping;
      // pinching with two fingers scales it up or down.
      canvas.addEventListener(
        'touchstart', (e) => {
          if (e.touches.length === 1) {
            const touch = e.touches[0]
            dragTouchId = touch.identifier
            dragLastX = touch.clientX
            dragLastY = touch.clientY
            dragMoved = false
          } else if (e.touches.length === 2) {
            dragTouchId = null
            pinchStartDistance = touchDistance(e.touches[0], e.touches[1])
            pinchStartScale = cubeGroup.scale.x
          }
        }, true
      )

      canvas.addEventListener(
        'touchmove', (e) => {
          if (e.touches.length === 2) {
            const distance = touchDistance(e.touches[0], e.touches[1])
            const scale = THREE.MathUtils.clamp(
              pinchStartScale * (distance / pinchStartDistance), MIN_SCALE, MAX_SCALE
            )
            cubeGroup.scale.setScalar(scale)
            return
          }

          if (dragTouchId === null) {
            return
          }
          const touch = Array.from(e.touches).find((t) => t.identifier === dragTouchId)
          if (!touch) {
            return
          }

          const deltaX = touch.clientX - dragLastX
          const deltaY = touch.clientY - dragLastY
          if (!dragMoved && Math.hypot(touch.clientX - dragLastX, touch.clientY - dragLastY) < DRAG_THRESHOLD_PX) {
            return
          }
          dragMoved = true

          cubeGroup.rotation.y += deltaX * ROTATE_SPEED
          cubeGroup.rotation.x += deltaY * ROTATE_SPEED
          dragLastX = touch.clientX
          dragLastY = touch.clientY
        }, true
      )

      canvas.addEventListener(
        'touchend', (e) => {
          if (e.touches.length > 0) {
            return
          }

          const wasDragOrPinch = dragMoved || pinchStartDistance > 0
          dragTouchId = null
          pinchStartDistance = 0

          if (wasDragOrPinch) {
            return
          }

          const touch = e.changedTouches[0]
          const hitCube = handleCubeTap(touch.clientX, touch.clientY, canvas, camera)
          if (!hitCube) {
            XR8.XrController.recenter()
          }
        }, true
      )
    },

    // onUpdate is called once per camera frame, before rendering. Used to advance the
    // fold/unfold animation and clear expired face highlights.
    onUpdate: () => {
      updateAnimation()
      updateHighlights()
    },
  }
}
