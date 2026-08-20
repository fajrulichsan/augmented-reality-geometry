// Define an 8th Wall XR Camera Pipeline Module that adds a cube to a threejs scene on startup.
// Tapping the cube unfolds it into its flat net (like unfolding a cardboard box); tapping
// again folds it back up. Tapping anywhere else recenters the scene as before.
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

  // Returns true if the tap hit a cube face (and toggles the fold/unfold animation).
  const handleCubeTap = (clientX, clientY, canvas, camera) => {
    const rect = canvas.getBoundingClientRect()
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(pointer, camera)
    const hit = raycaster.intersectObjects(faces, false).length > 0
    if (hit) {
      setOpen(!isOpen)
    }
    return hit
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

      // Tapping a cube face folds/unfolds the net. Tapping anywhere else recenters content
      // (the previous behavior), so the two gestures share the same single-finger tap.
      canvas.addEventListener(
        'touchstart', (e) => {
          if (e.touches.length !== 1) {
            return
          }
          const touch = e.touches[0]
          const hitCube = handleCubeTap(touch.clientX, touch.clientY, canvas, camera)
          if (!hitCube) {
            XR8.XrController.recenter()
          }
        }, true
      )
    },

    // onUpdate is called once per camera frame, before rendering. Used to advance the
    // fold/unfold animation.
    onUpdate: () => {
      updateAnimation()
    },
  }
}
