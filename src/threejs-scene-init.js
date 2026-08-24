// Define an 8th Wall XR Camera Pipeline Module that adds a 3D shape to a threejs scene on
// startup. The shape shown can be switched at runtime (kubus, balok, prisma segitiga, prisma
// segilima, limas segitiga, limas segilima) via setShape(). Only the cube supports
// tap-to-highlight-face, tap-to-mark-vertex, and double-tap-to-unfold-net, since it's built from
// separate face planes and corner markers; other shapes are solid meshes. Tapping anywhere else
// recenters the scene. A one-finger drag rotates the shape; a two-finger pinch scales it up or
// down.
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

const PURPLE = 0xAD50FF
const VERTEX_COLOR = 0xFFFFFF
const VERTEX_RADIUS = 0.09
const VERTEX_SURFACE_OFFSET = 0.005
const EDGE_RADIUS = 0.02
const EDGE_MATERIAL = new THREE.MeshBasicMaterial({color: 0x000000})

// WebGL ignores LineBasicMaterial's linewidth, so a plain THREE.LineSegments edge outline always
// renders hairline-thin regardless of setting. To get a visibly thick outline (matching the
// baked-in border on the cube's texture), build the outline out of thin cylinders running along
// each edge instead.
const addThickEdges = (mesh, geometry) => {
  const positions = new THREE.EdgesGeometry(geometry).attributes.position
  const up = new THREE.Vector3(0, 1, 0)
  const start = new THREE.Vector3()
  const end = new THREE.Vector3()
  const direction = new THREE.Vector3()
  const midpoint = new THREE.Vector3()

  for (let i = 0; i < positions.count; i += 2) {
    start.fromBufferAttribute(positions, i)
    end.fromBufferAttribute(positions, i + 1)
    direction.subVectors(end, start)
    const length = direction.length()

    const edge = new THREE.Mesh(new THREE.CylinderGeometry(EDGE_RADIUS, EDGE_RADIUS, length, 6), EDGE_MATERIAL)
    midpoint.addVectors(start, end).multiplyScalar(0.5)
    edge.position.copy(midpoint)
    edge.quaternion.setFromUnitVectors(up, direction.normalize())
    mesh.add(edge)
  }
}

export const initScenePipelineModule = () => {
  // Builds the cube out of 6 separate face planes so they can unfold into a net, plus a marker
  // sphere at each of the 8 corners so students can tap to count vertices. Returns the faces
  // (tap-to-highlight/double-tap-to-unfold) and vertex markers (tap-to-mark), and the group that
  // holds the vertex markers so their visibility can be tied to the fold state.
  const buildCubeNet = () => {
    const texture = new THREE.TextureLoader().load(cubeTexture)
    const group = new THREE.Group()

    const faces = FACE_DEFS.map(({foldedPos, foldedRot, netPos}) => {
      const material = new THREE.MeshBasicMaterial({map: texture, color: PURPLE, side: THREE.DoubleSide})
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
      mesh.userData.highlighted = false

      mesh.position.copy(mesh.userData.folded.position)
      mesh.quaternion.copy(mesh.userData.folded.quaternion)

      group.add(mesh)
      return mesh
    })

    // Corner markers are flat discs pressed against the surface (angled outward along the
    // corner's diagonal) rather than spheres, so they read as a small dot on the cube instead of
    // a ball sticking out of it.
    const vertexGroup = new THREE.Group()
    const vertexGeometry = new THREE.CircleGeometry(VERTEX_RADIUS, 16)
    const facingZ = new THREE.Vector3(0, 0, 1)
    const vertices = []
    for (const x of [-0.5, 0.5]) {
      for (const y of [-0.5, 0.5]) {
        for (const z of [-0.5, 0.5]) {
          const material = new THREE.MeshBasicMaterial({color: VERTEX_COLOR, side: THREE.DoubleSide})
          const marker = new THREE.Mesh(vertexGeometry, material)
          const outward = new THREE.Vector3(x, y, z).normalize()
          marker.position.set(x, y, z).addScaledVector(outward, VERTEX_SURFACE_OFFSET)
          marker.quaternion.setFromUnitVectors(facingZ, outward)
          marker.userData.highlighted = false
          vertexGroup.add(marker)
          vertices.push(marker)
        }
      }
    }
    group.add(vertexGroup)

    return {group, faces, vertices, vertexGroup, groundOffset: 0.5}
  }

  // Builds a solid single-mesh shape (no net/fold, no per-face highlight), outlined with black
  // edge lines to match the cube's look.
  const buildSolid = (geometry, groundOffset, rotationY = 0) => {
    const material = new THREE.MeshStandardMaterial({color: PURPLE})
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true

    addThickEdges(mesh, geometry)

    const group = new THREE.Group()
    group.rotation.y = rotationY
    group.add(mesh)

    return {group, faces: [], vertices: [], vertexGroup: null, groundOffset}
  }

  const SHAPE_BUILDERS = {
    kubus: buildCubeNet,
    balok: () => buildSolid(new THREE.BoxGeometry(1.4, 1, 0.8), 0.5),
    'prisma-segitiga': () => buildSolid(new THREE.CylinderGeometry(0.75, 0.75, 1, 3), 0.5, Math.PI / 6),
    'prisma-segilima': () => buildSolid(new THREE.CylinderGeometry(0.7, 0.7, 1, 5), 0.5, Math.PI / 2),
    'limas-segitiga': () => buildSolid(new THREE.ConeGeometry(0.8, 1.1, 3), 0.55, Math.PI / 6),
    'limas-segilima': () => buildSolid(new THREE.ConeGeometry(0.8, 1.1, 5), 0.55, Math.PI / 2),
  }

  let currentShapeId = 'kubus'
  let shapeGroup
  let faces = []
  let vertices = []
  let vertexGroup = null

  let sceneRef = null
  let pendingShapeId = null

  // Open animation state: t goes from 0 (folded) to 1 (fully unfolded net). Only meaningful for
  // the cube.
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

  // Removes the current shape from the scene (if any) and adds the requested one in its place.
  const switchShape = (shapeId) => {
    if (!sceneRef || !SHAPE_BUILDERS[shapeId] || shapeId === currentShapeId) {
      return
    }

    if (shapeGroup) {
      sceneRef.remove(shapeGroup)
    }

    const built = SHAPE_BUILDERS[shapeId]()
    shapeGroup = built.group
    shapeGroup.position.set(0, built.groundOffset, 0)
    faces = built.faces
    vertices = built.vertices
    vertexGroup = built.vertexGroup

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

  // Advances the fold/unfold animation and applies it to each face. Called once per frame. The
  // vertex markers only make sense on the fully-folded cube, so they're hidden any other time.
  const updateAnimation = () => {
    if (vertexGroup) {
      vertexGroup.visible = t === 0
    }

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

  // Toggles a face's material between its base color and the highlight color. Stays until
  // toggled again (or the shape is switched) — it does not fade out on its own, so a student can
  // tap through every face to count them without the marks disappearing.
  const toggleFaceHighlight = (mesh) => {
    mesh.userData.highlighted = !mesh.userData.highlighted
    mesh.material.color.setHex(mesh.userData.highlighted ? HIGHLIGHT_COLOR : PURPLE)
  }

  // Toggles a vertex marker between its base color and the highlight color, same as faces.
  const toggleVertexHighlight = (mesh) => {
    mesh.userData.highlighted = !mesh.userData.highlighted
    mesh.material.color.setHex(mesh.userData.highlighted ? HIGHLIGHT_COLOR : VERTEX_COLOR)
  }

  // Returns true if the tap hit a cube vertex marker or face. A single tap on a face toggles its
  // highlight (to help count faces); a tap on a vertex marker toggles it the same way (to help
  // count corners). A second tap on the same face within DOUBLE_TAP_WINDOW_MS toggles the
  // fold/unfold animation instead. No-op (returns false) for shapes other than the cube, since
  // they have no individual face meshes or vertex markers.
  const handleCubeTap = (clientX, clientY, canvas, camera) => {
    if (faces.length === 0 && vertices.length === 0) {
      return false
    }

    const rect = canvas.getBoundingClientRect()
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(pointer, camera)

    if (vertexGroup && vertexGroup.visible) {
      const vertexHit = raycaster.intersectObjects(vertices, false)[0]
      if (vertexHit) {
        toggleVertexHighlight(vertexHit.object)
        return true
      }
    }

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
    // fold/unfold animation and update vertex-marker visibility.
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
  }
}
