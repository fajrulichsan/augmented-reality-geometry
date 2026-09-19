// Define an 8th Wall XR Camera Pipeline Module that adds a 3D shape to a threejs scene on
// startup. The shape shown can be switched at runtime (kubus, balok, prisma segitiga, prisma
// segilima, limas segitiga, limas segilima) via setShape(). Every shape is built from separate
// face meshes, so all of them support tap-to-highlight-face and double-tap-to-unfold-net. Tapping
// anywhere else recenters the scene. A one-finger drag rotates the shape; a two-finger pinch
// scales it up or down.
import * as THREE from 'three';

import cubeTexture from './assets/cube-texture.png'
import {buildHingedNetDefs, prismSolid, pyramidSolid} from './hinged-net'

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

// Builds the FACE_DEFS-equivalent for a box of arbitrary width (x) / height (y) / depth (z),
// laid out as the classic "cross" net: left, front, right, back in a row, with top/bottom
// attached above/below the front face. Unlike the cube (whose faces are all 1x1 squares), a
// balok's faces come in three different rectangle sizes, so each face also carries its own
// planeSize used to build its PlaneGeometry.
const boxFaceDefs = (width, height, depth) => {
  const rowOffset = width / 2 + depth / 2
  return [
    {planeSize: [width, height], foldedPos: [0, 0, depth / 2], foldedRot: [0, 0, 0], netPos: [0, 0, 0]},
    {planeSize: [width, height], foldedPos: [0, 0, -depth / 2], foldedRot: [0, Math.PI, 0], netPos: [width + depth, 0, 0]},
    {planeSize: [depth, height], foldedPos: [width / 2, 0, 0], foldedRot: [0, Math.PI / 2, 0], netPos: [rowOffset, 0, 0]},
    {planeSize: [depth, height], foldedPos: [-width / 2, 0, 0], foldedRot: [0, -Math.PI / 2, 0], netPos: [-rowOffset, 0, 0]},
    {planeSize: [width, depth], foldedPos: [0, height / 2, 0], foldedRot: [-Math.PI / 2, 0, 0], netPos: [0, height / 2 + depth / 2, 0]},
    {planeSize: [width, depth], foldedPos: [0, -height / 2, 0], foldedRot: [Math.PI / 2, 0, 0], netPos: [0, -(height / 2 + depth / 2), 0]},
  ]
}

// Builds a flat, triangulated geometry from a 2D outline, lying in the local xy-plane facing +z
// (same convention as PlaneGeometry) - used for polygon net faces (triangles, pentagons...) that
// aren't plain rectangles.
const polygonGeometry = (points2D) => (
  new THREE.ShapeGeometry(new THREE.Shape(points2D.map(({x, y}) => new THREE.Vector2(x, y))))
)

const ANIM_DURATION_MS = 600
const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t)

const HIGHLIGHT_COLOR = 0xFFEB3B

const PURPLE = 0xAD50FF

export const initScenePipelineModule = () => {
  // Builds a box (cube or balok) out of 6 separate face planes so they can unfold into a net.
  // Returns the faces so tap-to-highlight/double-tap-to-unfold can operate on them. `texture` is
  // optional (only the cube has a labeled texture; the balok's faces are plain color).
  const buildBoxNet = (faceDefs, groundOffset, texture) => {
    const group = new THREE.Group()

    const faces = faceDefs.map(({planeSize, foldedPos, foldedRot, netPos}) => {
      const material = new THREE.MeshBasicMaterial({map: texture, color: PURPLE, side: THREE.DoubleSide})
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(...(planeSize || [1, 1])), material)
      mesh.castShadow = true

      mesh.userData.folded = {
        position: new THREE.Vector3(...foldedPos),
        quaternion: new THREE.Quaternion().setFromEuler(new THREE.Euler(...foldedRot)),
      }
      mesh.userData.net = {
        position: new THREE.Vector3(...netPos),
        quaternion: new THREE.Quaternion(),
      }
      mesh.userData.highlighted = false

      mesh.position.copy(mesh.userData.folded.position)
      mesh.quaternion.copy(mesh.userData.folded.quaternion)

      group.add(mesh)
      return mesh
    })

    return {group, faces, groundOffset}
  }

  const buildCubeNet = () => (
    buildBoxNet(FACE_DEFS, 0.5, new THREE.TextureLoader().load(cubeTexture))
  )

  const buildBalokNet = () => buildBoxNet(boxFaceDefs(1.4, 1, 0.8), 0.5)

  // Builds a prism/pyramid whose faces hinge on shared edges: unfolding rotates each face about
  // its hinge (relative to its parent face), so the net stays connected the whole way. The
  // returned applyPose(value) places every face for a fold amount (0 = solid, 1 = flat net); the
  // whole net also stands up to face the viewer (like the cube's) as it opens.
  const buildHingedShape = ({vertices, faceDefs}) => {
    const {faces: defs, rootOrigin, rootQuat, netCenter} = buildHingedNetDefs(vertices, faceDefs)
    const group = new THREE.Group()
    const content = new THREE.Group()
    group.add(content)

    const faces = defs.map((def) => {
      const geometry = polygonGeometry(def.verts.map((id) => def.points2.get(id)))
      const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: PURPLE, side: THREE.DoubleSide}))
      mesh.castShadow = true
      mesh.userData.highlighted = false
      content.add(mesh)
      return mesh
    })

    const netOffset = new THREE.Vector3(-netCenter.x, -netCenter.y, 0)
    const identity = new THREE.Quaternion()
    const matrices = defs.map(() => new THREE.Matrix4())
    const hingeRotation = new THREE.Matrix4()
    const toHinge = new THREE.Matrix4()
    const fromHinge = new THREE.Matrix4()

    const applyPose = (value) => {
      defs.forEach((def, i) => {
        if (def.parent < 0) {
          matrices[i].identity()
        } else {
          const {hingeOrigin, hingeAxis, foldAngle} = def
          hingeRotation.makeRotationAxis(hingeAxis, foldAngle * (1 - value))
          toHinge.makeTranslation(hingeOrigin.x, hingeOrigin.y, 0)
          fromHinge.makeTranslation(-hingeOrigin.x, -hingeOrigin.y, 0)
          matrices[i].copy(matrices[def.parent]).multiply(toHinge).multiply(hingeRotation).multiply(fromHinge)
        }
        const mesh = faces[i]
        matrices[i].decompose(mesh.position, mesh.quaternion, mesh.scale)
      })
      content.quaternion.slerpQuaternions(rootQuat, identity, value)
      content.position.lerpVectors(rootOrigin, netOffset, value)
    }

    applyPose(0)
    // Solids are centered on the origin, so half their height rests them on the ground.
    const groundOffset = Math.max(...vertices.map((v) => Math.abs(v.y)))
    return {group, faces, groundOffset, applyPose}
  }

  const buildPyramidNet = (sides, baseRadius, height) => (
    buildHingedShape(pyramidSolid(sides, baseRadius, height))
  )

  const buildPrismNet = (sides, baseRadius, height) => (
    buildHingedShape(prismSolid(sides, baseRadius, height))
  )

  const SHAPE_BUILDERS = {
    kubus: buildCubeNet,
    balok: buildBalokNet,
    'prisma-segitiga': () => buildPrismNet(3, 0.75, 1),
    'prisma-segilima': () => buildPrismNet(5, 0.7, 1),
    'limas-segitiga': () => buildPyramidNet(3, 0.8, 1.1),
    'limas-segilima': () => buildPyramidNet(5, 0.8, 1.1),
  }

  let currentShapeId = 'kubus'
  let shapeGroup
  let faces = []
  let applyPose = null

  let sceneRef = null
  let pendingShapeId = null

  // Open animation state: t goes from 0 (folded) to 1 (fully unfolded net). Only meaningful for
  // shapes with a net (faces.length > 0).
  let isOpen = false
  let t = 0
  let tFrom = 0
  let tTo = 0
  let animStartTime = 0

  // Net mode (materi "Jaring-Jaring"): a single tap opens/closes the net gradually instead of
  // toggling face highlights, and the unfold amount can also be driven directly (e.g. by a
  // slider) via setNetProgress. progressListeners are notified with the current 0-100 percentage
  // whenever it changes, whether from the tap animation or setNetProgress.
  let netMode = false
  const progressListeners = []
  const notifyProgress = () => {
    const percent = Math.round(t * 100)
    progressListeners.forEach((listener) => listener(percent))
  }

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

  // Removes the current shape from the scene (if any) and adds the requested one in its place.
  const switchShape = (shapeId) => {
    if (!sceneRef || !SHAPE_BUILDERS[shapeId] || (shapeGroup && shapeId === currentShapeId)) {
      return
    }

    if (shapeGroup) {
      sceneRef.remove(shapeGroup)
    }

    const built = SHAPE_BUILDERS[shapeId]()
    shapeGroup = built.group
    shapeGroup.position.set(0, built.groundOffset, 0)
    faces = built.faces
    applyPose = built.applyPose || null

    currentShapeId = shapeId
    isOpen = false
    t = 0
    tFrom = 0
    tTo = 0
    lastTapFace = null

    sceneRef.add(shapeGroup)
  }

  // Populates the initial shape into an XR scene and sets the initial camera position.
  const initXrScene = ({scene, camera, renderer}) => {
    // Enable shadows in the rednerer.
    renderer.shadowMap.enabled = true

    // Add some light to the scene.
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 10, 7)
    directionalLight.castShadow = true
    scene.add(directionalLight)
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))

    sceneRef = scene
    switchShape(pendingShapeId || currentShapeId)
    pendingShapeId = null

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

  // Applies a given fold/unfold amount (0 = folded, 1 = fully unfolded net) to each face.
  const applyFacesAtT = (value) => {
    if (applyPose) {
      applyPose(value)
      return
    }
    faces.forEach((mesh) => {
      const {folded, net} = mesh.userData
      mesh.position.lerpVectors(folded.position, net.position, value)
      mesh.quaternion.slerpQuaternions(folded.quaternion, net.quaternion, value)
    })
  }

  // Advances the fold/unfold animation and applies it to each face. Called once per frame.
  const updateAnimation = () => {
    if (t === tTo) {
      return
    }

    const progress = Math.min((performance.now() - animStartTime) / ANIM_DURATION_MS, 1)
    t = tFrom + (tTo - tFrom) * easeInOutQuad(progress)

    applyFacesAtT(t)
    notifyProgress()
  }

  // Toggles a face's material between its base color and the highlight color. Stays until
  // toggled again (or the shape is switched) — it does not fade out on its own, so a student can
  // tap through every face to count them without the marks disappearing.
  const toggleFaceHighlight = (mesh) => {
    mesh.userData.highlighted = !mesh.userData.highlighted
    mesh.material.color.setHex(mesh.userData.highlighted ? HIGHLIGHT_COLOR : PURPLE)
  }

  // Returns true if the tap hit a shape face. A single tap toggles that face's highlight (to help
  // count faces). A second tap on the same face within DOUBLE_TAP_WINDOW_MS toggles the
  // fold/unfold animation instead. No-op (returns false) if the current shape has no net.
  const handleCubeTap = (clientX, clientY, canvas, camera) => {
    if (faces.length === 0) {
      return false
    }

    const rect = canvas.getBoundingClientRect()
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(pointer, camera)

    const intersection = raycaster.intersectObjects(faces, false)[0]
    if (!intersection) {
      return false
    }

    if (netMode) {
      setOpen(!isOpen)
      return true
    }

    const face = intersection.object
    const now = performance.now()
    const isDoubleTap = face === lastTapFace && now - lastTapTime < DOUBLE_TAP_WINDOW_MS

    if (isDoubleTap) {
      setOpen(!isOpen)
      lastTapFace = null
    } else {
      toggleFaceHighlight(face)
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
      // else recenters content. Dragging with one finger rotates the shape instead of tapping;
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
            pinchStartScale = shapeGroup.scale.x
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
            shapeGroup.scale.setScalar(scale)
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

          shapeGroup.rotation.y += deltaX * ROTATE_SPEED
          shapeGroup.rotation.x += deltaY * ROTATE_SPEED
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
    // fold/unfold animation.
    onUpdate: () => {
      updateAnimation()
    },

    // Switches the displayed shape. Can be called before the scene has started (e.g. from a UI
    // event fired before onStart runs); the request is applied once the scene is ready.
    setShape: (shapeId) => {
      if (!SHAPE_BUILDERS[shapeId]) {
        return
      }
      if (!sceneRef) {
        pendingShapeId = shapeId
        return
      }
      switchShape(shapeId)
    },

    // Enables/disables net mode (materi "Jaring-Jaring"): while enabled, a single tap opens or
    // closes the net gradually instead of toggling face highlights.
    setNetMode: (enabled) => {
      netMode = enabled
    },

    // Directly sets the fold/unfold amount from a 0-100 percentage (e.g. a slider being dragged),
    // bypassing the tap animation. No-op for shapes with no net (faces.length === 0).
    setNetProgress: (percent) => {
      if (faces.length === 0) {
        return
      }
      const value = THREE.MathUtils.clamp(percent, 0, 100) / 100
      t = value
      tFrom = value
      tTo = value
      isOpen = value > 0
      applyFacesAtT(t)
    },

    // Registers a listener called with the current unfold percentage (0-100) whenever it changes,
    // so external UI (e.g. a slider) can stay in sync with tap-triggered animation.
    onProgress: (listener) => {
      progressListeners.push(listener)
    },
  }
}
