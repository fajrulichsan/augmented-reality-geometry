// Define an 8th Wall XR Camera Pipeline Module that adds a 3D shape to a threejs scene on
// startup. The shape shown can be switched at runtime (kubus, balok, prisma segitiga, prisma
// segilima, limas segitiga, limas segilima) via setShape(). Every shape is built from separate
// face meshes, so all of them support tap-to-highlight-face and double-tap-to-unfold-net. Tapping
// anywhere else recenters the scene. A one-finger drag rotates the shape; a two-finger pinch
// scales it up or down.
import * as THREE from 'three';

import cubeTexture from './assets/cube-texture.png'
import {buildHingedNetDefs, prismSolid, pyramidSolid, boxSolid} from './hinged-net'

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
const CYAN = 0x00E5FF

// Materi 3's up-to-2-face selection uses two distinct colors (one per slot) instead of the single
// toggle-highlight color the other materis use.
const SELECT_COLOR_A = 0x4FC3F7
const SELECT_COLOR_B = 0xFF7043

const VERTEX_RADIUS = 0.04
const EDGE_RADIUS = 0.02

// Fixed scale for materi 3's cm measurements: 1 scene unit = 25 cm. Lengths are derived once from
// each face's own local (unscaled) geometry, so pinch-zoom (which only scales `shapeGroup`) never
// changes a reported value - see attachFaceMeasureTools() and AC-7 in PRD-materi-3.md.
const CM_PER_UNIT = 25

// Builds tap targets for a face's rusuk (edges) plus, for a triangular face, a height line from one
// vertex to the midpoint of the opposite side (materi 3's "Ukur" / "Ukur Tinggi Sisi", AC-5).
// `corners` are the face's own polygon corners, in order, in the mesh's local (flat) coordinate
// space - the markers are added as children of `mesh` so they inherit its exact pose (and any
// pinch-scale) automatically, without needing to duplicate the shape's global vertex bookkeeping.
// Thin solid bar between two points (a line that stays visible at any zoom, unlike 1px GL lines).
const makeBar = (a, b, radius, color) => {
  const dir = new THREE.Vector3().subVectors(b, a)
  const bar = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, dir.length(), 6),
    new THREE.MeshBasicMaterial({color})
  )
  bar.position.copy(a).addScaledVector(dir, 0.5)
  bar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
  return bar
}

// Same as makeBar but broken into short dashes, so it reads as a different line style (materi 4's
// "tinggi limas" vs "tinggi segitiga sisi tegak") without depending on color alone.
const makeDashedBar = (a, b, radius, color, dashCount = 9) => {
  const group = new THREE.Group()
  const step = new THREE.Vector3().subVectors(b, a).divideScalar(dashCount * 2 - 1)
  for (let i = 0; i < dashCount; i++) {
    const start = a.clone().addScaledVector(step, i * 2)
    group.add(makeBar(start, start.clone().add(step), radius, color))
  }
  return group
}

// Small square corner mark (the "tanda siku-siku") at `corner`, between unit directions u and w.
const makeRightAngleMark = (corner, u, w, size, color) => {
  const group = new THREE.Group()
  const p1 = corner.clone().addScaledVector(u, size)
  const p2 = p1.clone().addScaledVector(w, size)
  const p3 = corner.clone().addScaledVector(w, size)
  group.add(makeBar(p1, p2, 0.008, color))
  group.add(makeBar(p2, p3, 0.008, color))
  return group
}

const attachFaceMeasureTools = (mesh, corners) => {
  const sides = corners.length
  mesh.userData.sides = sides

  mesh.userData.edgeMarkers = corners.map((a, i) => {
    const b = corners[(i + 1) % sides]
    const dir = new THREE.Vector3().subVectors(b, a)
    const length = dir.length()
    const marker = new THREE.Mesh(
      new THREE.CylinderGeometry(EDGE_RADIUS, EDGE_RADIUS, length, 8),
      new THREE.MeshBasicMaterial({color: PURPLE})
    )
    marker.position.copy(a).addScaledVector(dir, 0.5)
    marker.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
    marker.userData.highlighted = false
    marker.userData.edgeIndex = i
    marker.userData.lengthCm = Math.round(length * CM_PER_UNIT * 10) / 10
    marker.visible = false
    mesh.add(marker)
    return {mesh: marker, lengthCm: marker.userData.lengthCm}
  })

  // Only a triangular face (a prism's triangular cap, in this app) gets a height line: apex =
  // corners[2], base = corners[0]-corners[1]. Since prism caps are regular polygons, for sides = 3
  // that's an equilateral triangle, where the median from a vertex to the opposite side's midpoint
  // coincides with the true (perpendicular) altitude.
  if (sides === 3) {
    const apex = corners[2]
    const mid = corners[0].clone().add(corners[1]).multiplyScalar(0.5)
    const lengthCm = Math.round(apex.distanceTo(mid) * CM_PER_UNIT * 10) / 10
    // Height line + right-angle mark at its foot (AC-5 of materi 4), shown together.
    const line = new THREE.Group()
    line.add(makeBar(apex, mid, 0.012, HIGHLIGHT_COLOR))
    const along = new THREE.Vector3().subVectors(corners[1], corners[0]).normalize()
    const up = new THREE.Vector3().subVectors(apex, mid).normalize()
    line.add(makeRightAngleMark(mid, along, up, 0.07, HIGHLIGHT_COLOR))
    line.visible = false
    mesh.add(line)
    mesh.userData.heightLine = {line, lengthCm}
  } else {
    mesh.userData.heightLine = null
  }
}

// Builds a vertex sphere and an edge cylinder, invisible by default - they exist purely as tap
// targets for the "titik sudut"/"rusuk" aspects, and only become visible (as a temporary mark)
// once tapped. `vertices`/`edges` are the solid's raw folded coordinates (correct as long as the
// shape stays folded, which materi 1 never unfolds).
const buildMarkers = (parent, vertices, edges) => {
  const vertexMeshes = vertices.map((v) => {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(VERTEX_RADIUS, 12, 12),
      new THREE.MeshBasicMaterial({color: PURPLE})
    )
    mesh.position.copy(v)
    mesh.visible = false
    mesh.userData.highlighted = false
    parent.add(mesh)
    return mesh
  })

  const edgeMeshes = edges.map(([a, b]) => {
    const pointA = vertices[a]
    const pointB = vertices[b]
    const dir = new THREE.Vector3().subVectors(pointB, pointA)
    const length = dir.length()
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(EDGE_RADIUS, EDGE_RADIUS, length, 8),
      new THREE.MeshBasicMaterial({color: PURPLE})
    )
    mesh.position.copy(pointA).addScaledVector(dir, 0.5)
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
    mesh.visible = false
    mesh.userData.highlighted = false
    parent.add(mesh)
    return mesh
  })

  return {vertexMeshes, edgeMeshes}
}

export const initScenePipelineModule = () => {
  // Builds a box (cube or balok) out of 6 separate face planes so they can unfold into a net, plus
  // vertex/edge tap targets for the titik sudut/rusuk aspects. Returns the faces so
  // tap-to-highlight/double-tap-to-unfold can operate on them. `texture` is optional (only the
  // cube has a labeled texture; the balok's faces are plain color).
  const buildBoxNet = (faceDefs, groundOffset, boxSize, texture) => {
    const group = new THREE.Group()

    const faces = faceDefs.map(({planeSize, foldedPos, foldedRot, netPos}) => {
      const material = new THREE.MeshBasicMaterial({map: texture, color: PURPLE, side: THREE.DoubleSide})
      const [w, h] = planeSize || [1, 1]
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material)
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

      attachFaceMeasureTools(mesh, [
        new THREE.Vector3(-w / 2, -h / 2, 0),
        new THREE.Vector3(w / 2, -h / 2, 0),
        new THREE.Vector3(w / 2, h / 2, 0),
        new THREE.Vector3(-w / 2, h / 2, 0),
      ])

      group.add(mesh)
      return mesh
    })

    const solid = boxSolid(...boxSize)
    const {vertexMeshes, edgeMeshes} = buildMarkers(group, solid.vertices, solid.edges)

    return {group, faces, groundOffset, vertexMeshes, edgeMeshes}
  }

  const buildCubeNet = () => (
    buildBoxNet(FACE_DEFS, 0.5, [1, 1, 1], new THREE.TextureLoader().load(cubeTexture))
  )

  const buildBalokNet = () => buildBoxNet(boxFaceDefs(1.4, 1, 0.8), 0.5, [1.4, 1, 0.8])

  // Builds a prism/pyramid whose faces hinge on shared edges: unfolding rotates each face about
  // its hinge (relative to its parent face), so the net stays connected the whole way. The
  // returned applyPose(value) places every face for a fold amount (0 = solid, 1 = flat net); the
  // whole net also stands up to face the viewer (like the cube's) as it opens.
  const buildHingedShape = ({vertices, faceDefs, edges}) => {
    const {faces: defs, rootOrigin, rootQuat, netCenter} = buildHingedNetDefs(vertices, faceDefs)
    const group = new THREE.Group()
    const content = new THREE.Group()
    group.add(content)

    const faces = defs.map((def) => {
      const corners = def.verts.map((id) => {
        const p2 = def.points2.get(id)
        return new THREE.Vector3(p2.x, p2.y, 0)
      })
      const geometry = polygonGeometry(corners)
      const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: PURPLE, side: THREE.DoubleSide}))
      mesh.castShadow = true
      mesh.userData.highlighted = false
      attachFaceMeasureTools(mesh, corners)
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

    // Added directly to `group` (not `content`) using the solid's raw folded vertices: at fold=0
    // this matches exactly where the faces sit, and materi 1 (the only place these are used) never
    // unfolds the net, so they never need to track the animation.
    const {vertexMeshes, edgeMeshes} = buildMarkers(group, vertices, edges)

    // Solids are centered on the origin, so half their height rests them on the ground.
    const groundOffset = Math.max(...vertices.map((v) => Math.abs(v.y)))
    return {group, faces, groundOffset, applyPose, vertexMeshes, edgeMeshes}
  }

  // Besides the faces, a pyramid carries a hidden "tinggi limas" marker (materi 4): a dashed line
  // from the apex straight down to the base's center, with a right-angle mark against a base radius.
  const buildPyramidNet = (sides, baseRadius, height) => {
    const solid = pyramidSolid(sides, baseRadius, height)
    const built = buildHingedShape(solid)
    const apex = solid.vertices[sides]
    const center = new THREE.Vector3(0, -height / 2, 0)
    const holder = new THREE.Group()
    holder.add(makeDashedBar(apex, center, 0.012, CYAN))
    const toRim = new THREE.Vector3().subVectors(solid.vertices[0], center).normalize()
    holder.add(makeRightAngleMark(center, toRim, new THREE.Vector3(0, 1, 0), 0.08, CYAN))
    holder.visible = false
    built.group.add(holder)
    built.pyramidHeight = {obj: holder, lengthCm: Math.round(height * CM_PER_UNIT * 10) / 10}
    return built
  }

  const buildPrismNet = (sides, baseRadius, height) => (
    buildHingedShape(prismSolid(sides, baseRadius, height))
  )

  // Shape ids: 'kubus', 'balok', 'prisma-<n>', 'limas-<n>' for n = 3..12 (Segitiga=3, Segiempat=4,
  // Segilima=5, and any other n via the Segi-n picker).
  const SHAPE_BUILDERS = {
    kubus: buildCubeNet,
    balok: buildBalokNet,
  }
  for (let n = 3; n <= 12; n++) {
    SHAPE_BUILDERS[`prisma-${n}`] = () => buildPrismNet(n, 0.7, 1)
    SHAPE_BUILDERS[`limas-${n}`] = () => buildPyramidNet(n, 0.8, 1.1)
  }

  let currentShapeId = 'kubus'
  let shapeGroup
  let faces = []
  let vertexMeshes = []
  let edgeMeshes = []
  let applyPose = null
  let pyramidHeight = null
  let homePosition = new THREE.Vector3()
  let dragMode = 'rotate'
  const orderLabels = []

  // Aspect target (materi 1's guided flow): which tap targets are active - 'sisi' (faces), 'rusuk'
  // (edgeMeshes) or 'titik' (vertexMeshes). Ignored while netMode is on (materi 2 always taps
  // faces to fold/unfold).
  let aspectTarget = 'sisi'

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

  // Notified with the current number of highlighted faces whenever a face's highlight is toggled
  // by a tap (aspectTarget === 'sisi', non-netMode path) - used by materi 2's guided flow to
  // gate its "pilih dua sisi" / "pilih satu sisi" steps.
  const faceHighlightListeners = []
  const notifyFaceHighlight = () => {
    const count = faces.filter((mesh) => mesh.userData.highlighted).length
    faceHighlightListeners.forEach((listener) => listener(count))
  }

  // Materi 3: notified with a face's index whenever it's tapped while aspectTarget === 'sisi-select'
  // (used for its per-face aspects, which manage selection/coloring themselves via setFaceSelection
  // instead of the simple toggle-highlight the other materis use).
  const faceTapListeners = []
  const notifyFaceTap = (index) => {
    faceTapListeners.forEach((listener) => listener(index))
  }

  // Materi 3: rusuk-measuring mode, scoped to one face at a time (FR-5 "Ukur"). While active, taps
  // only hit that face's own edgeMarkers (see attachFaceMeasureTools), instead of the normal
  // aspectTarget-driven pickable set.
  let measureMode = false
  let activeMeasureFace = null
  const edgeMeasureListeners = []
  const notifyEdgeMeasure = (edgeIndex, lengthCm) => {
    edgeMeasureListeners.forEach((listener) => listener({edgeIndex, lengthCm}))
  }

  const clearOrderLabels = () => {
    orderLabels.forEach((sprite) => sprite.parent && sprite.parent.remove(sprite))
    orderLabels.length = 0
  }

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()

  let lastTapTime = 0
  let lastTapFace = null
  const DOUBLE_TAP_WINDOW_MS = 350

  // One-finger drag-to-rotate / two-finger pinch-to-scale state.
  const ROTATE_SPEED = 0.006
  const MOVE_SPEED = 0.004
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
    vertexMeshes = built.vertexMeshes || []
    edgeMeshes = built.edgeMeshes || []
    applyPose = built.applyPose || null
    pyramidHeight = built.pyramidHeight || null
    homePosition = shapeGroup.position.clone()
    orderLabels.length = 0

    currentShapeId = shapeId
    isOpen = false
    t = 0
    tFrom = 0
    tTo = 0
    lastTapFace = null
    measureMode = false
    activeMeasureFace = null

    // Materi 3: stable per-session face IDs ("Sisi A", "Sisi B", ...) - assigned once here so they
    // stay consistent for as long as this shape is on screen.
    faces.forEach((mesh, i) => {
      mesh.userData.label = String.fromCharCode(65 + (i % 26))
    })

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

  // Toggles a mesh's material between its base color and the highlight color, marking it as
  // "observed". Faces stay visible always; edge/vertex markers are invisible by default and only
  // appear once tapped, since the solid's own geometry already shows their true edges/corners.
  // Stays until toggled again (or the shape/aspect changes) so a student can tap through every
  // item to count them without the marks disappearing.
  const toggleMarkHighlight = (mesh, alwaysVisible) => {
    mesh.userData.highlighted = !mesh.userData.highlighted
    mesh.material.color.setHex(mesh.userData.highlighted ? HIGHLIGHT_COLOR : PURPLE)
    if (!alwaysVisible) {
      mesh.visible = mesh.userData.highlighted
    }
  }

  const toggleFaceHighlight = (mesh) => toggleMarkHighlight(mesh, true)

  // Which meshes are tappable right now: faces while unfolding a net (materi 2), otherwise
  // whichever aspect target the guided flow (materi 1) has selected.
  const pickableMeshes = () => {
    if (netMode) {
      return faces
    }
    if (measureMode) {
      return activeMeasureFace ? activeMeasureFace.userData.edgeMarkers.map(({mesh}) => mesh) : []
    }
    if (aspectTarget === 'rusuk') {
      return edgeMeshes
    }
    if (aspectTarget === 'titik') {
      return vertexMeshes
    }
    return faces
  }

  // Returns true if the tap hit a pickable mesh. In net mode (materi 2), a single tap toggles a
  // face's highlight and a second tap on the same face within DOUBLE_TAP_WINDOW_MS folds/unfolds
  // the net instead. Outside net mode (materi 1's guided flow), a tap simply toggles the mark for
  // whichever aspect target is active. No-op (returns false) if the current shape has no net/no
  // markers, or nothing was hit.
  const handleCubeTap = (clientX, clientY, canvas, camera) => {
    const pickable = pickableMeshes()
    if (pickable.length === 0) {
      return false
    }

    const rect = canvas.getBoundingClientRect()
    pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
    pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(pointer, camera)

    const intersection = raycaster.intersectObjects(pickable, false)[0]
    if (!intersection) {
      return false
    }

    const mesh = intersection.object

    if (measureMode) {
      // Rusuk tap (FR-5 "Ukur"): mark it as measured and report its fixed cm length.
      toggleMarkHighlight(mesh, true)
      notifyEdgeMeasure(mesh.userData.edgeIndex, mesh.userData.lengthCm)
      return true
    }

    if (!netMode) {
      if (aspectTarget === 'sisi-select') {
        // Materi 3's per-face aspects: report the tap, let the guided flow manage up-to-2-face
        // selection/coloring itself via setFaceSelection.
        notifyFaceTap(faces.indexOf(mesh))
        return true
      }
      toggleMarkHighlight(mesh, aspectTarget === 'sisi')
      if (aspectTarget === 'sisi') {
        notifyFaceHighlight()
      }
      return true
    }

    const now = performance.now()
    const isDoubleTap = mesh === lastTapFace && now - lastTapTime < DOUBLE_TAP_WINDOW_MS

    if (isDoubleTap) {
      setOpen(!isOpen)
      lastTapFace = null
    } else {
      toggleFaceHighlight(mesh)
      lastTapFace = mesh
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

          if (dragMode === 'move') {
            shapeGroup.position.x += deltaX * MOVE_SPEED
            shapeGroup.position.z += deltaY * MOVE_SPEED
          } else {
            shapeGroup.rotation.y += deltaX * ROTATE_SPEED
            shapeGroup.rotation.x += deltaY * ROTATE_SPEED
          }
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

    // Sets which aspect target (materi 1's guided flow) taps operate on: 'sisi' (faces), 'rusuk'
    // (edges) or 'titik' (vertices).
    setAspectTarget: (target) => {
      aspectTarget = target
    },

    // Clears every "observed" mark on the current shape (faces, edges, vertices) and hides the
    // edge/vertex markers again. Called when the aspect or shape changes.
    resetMarks: () => {
      faces.forEach((mesh) => {
        mesh.userData.highlighted = false
        mesh.material.color.setHex(PURPLE)
        ;(mesh.userData.edgeMarkers || []).forEach(({mesh: em}) => {
          em.visible = false
          em.userData.highlighted = false
          em.material.color.setHex(PURPLE)
        })
        if (mesh.userData.heightLine) {
          mesh.userData.heightLine.line.visible = false
        }
      })
      ;[...edgeMeshes, ...vertexMeshes].forEach((mesh) => {
        mesh.userData.highlighted = false
        mesh.material.color.setHex(PURPLE)
        mesh.visible = false
      })
      measureMode = false
      activeMeasureFace = null
      if (pyramidHeight) {
        pyramidHeight.obj.visible = false
      }
      clearOrderLabels()
    },

    // Toggles a see-through material on the faces (F7 "Transparansi Model") so rusuk/titik sudut
    // on the far side of the solid become easier to reach.
    setTransparent: (enabled) => {
      faces.forEach((mesh) => {
        mesh.material.transparent = enabled
        mesh.material.opacity = enabled ? 0.35 : 1
      })
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

    // Registers a listener called with the current number of highlighted faces whenever it
    // changes (materi 2's "pilih dua sisi" / "pilih satu sisi" steps).
    onFaceHighlightChange: (listener) => {
      faceHighlightListeners.push(listener)
    },

    // How many faces the current shape has (0 for shapes with no net support).
    getFaceCount: () => faces.length,

    // --- Materi 3 additions (PRD-materi-3.md) ---

    // Stable per-session face info: [{index, label ('A', 'B', ...), sides}, ...] in tap order.
    getFaces: () => faces.map((mesh, i) => ({index: i, label: mesh.userData.label, sides: mesh.userData.sides})),

    // Colors up to 2 faces with distinct per-slot colors (indices[0] gets slot A's color,
    // indices[1] slot B's); every other face reverts to the default color. Pass [] to clear.
    setFaceSelection: (indices) => {
      faces.forEach((mesh, i) => {
        const slot = indices.indexOf(i)
        mesh.material.color.setHex(slot === 0 ? SELECT_COLOR_A : slot === 1 ? SELECT_COLOR_B : PURPLE)
      })
    },

    // Registers a listener called with a face's index whenever it's tapped while
    // setAspectTarget('sisi-select') is active.
    onFaceTap: (listener) => {
      faceTapListeners.push(listener)
    },

    // Enables (faceIndex) / disables (null) rusuk-measuring mode scoped to one face: taps then only
    // hit that face's own rusuk markers. Independent of aspectTarget/netMode.
    setMeasureFace: (faceIndex) => {
      faces.forEach((mesh) => {
        ;(mesh.userData.edgeMarkers || []).forEach(({mesh: em}) => {
          em.visible = false
        })
      })
      measureMode = faceIndex !== null && faceIndex !== undefined
      activeMeasureFace = measureMode ? faces[faceIndex] : null
      if (activeMeasureFace) {
        activeMeasureFace.userData.edgeMarkers.forEach(({mesh: em}) => {
          em.visible = true
        })
      }
    },

    // Registers a listener called with {edgeIndex, lengthCm} whenever a rusuk marker is tapped in
    // measure mode (FR-5 "Ukur"; value is fixed - see CM_PER_UNIT - and unaffected by pinch-zoom).
    onEdgeMeasureTap: (listener) => {
      edgeMeasureListeners.push(listener)
    },

    // Shows the computed height line (apex -> midpoint of the opposite side) for a triangular face
    // and returns its length in cm (AC-5, "Ukur Tinggi Sisi"); returns null if the face isn't a
    // triangle (e.g. box/quad faces, or a prism's rectangular side faces).
    showHeightLine: (faceIndex) => {
      const mesh = faces[faceIndex]
      if (!mesh || !mesh.userData.heightLine) {
        return null
      }
      mesh.userData.heightLine.line.visible = true
      return mesh.userData.heightLine.lengthCm
    },

    // Hides a face's height line (if any).
    hideHeightLine: (faceIndex) => {
      const mesh = faces[faceIndex]
      if (mesh && mesh.userData.heightLine) {
        mesh.userData.heightLine.line.visible = false
      }
    },

    // --- Materi 4 additions (PRD-materi-4.md) ---

    // Styles faces by role: styles = {faceIndex: 'a' | 'b' | 'dim'}. 'a'/'b' are the two highlight
    // colors ('b' is also slightly see-through so the two aren't told apart by color alone), 'dim'
    // fades a face out (A5/A7's "sisi lain redup"). Faces not listed go back to normal.
    setFaceView: (styles) => {
      faces.forEach((mesh, i) => {
        const role = styles[i]
        mesh.material.color.setHex(role === 'a' ? SELECT_COLOR_A : role === 'b' ? SELECT_COLOR_B : PURPLE)
        const opacity = role === 'dim' ? 0.18 : role === 'b' ? 0.75 : 1
        mesh.material.transparent = opacity < 1
        mesh.material.opacity = opacity
      })
    },

    // Puts a numbered badge (1, 2, 3...) on each face in `order` (array of face indices, in tap
    // order) and clears any earlier badges. Pass [] to clear.
    setFaceOrderLabels: (order) => {
      clearOrderLabels()
      order.forEach((faceIndex, n) => {
        const mesh = faces[faceIndex]
        const c = document.createElement('canvas')
        c.width = 64
        c.height = 64
        const ctx = c.getContext('2d')
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.arc(32, 32, 30, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#000000'
        ctx.font = 'bold 36px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(String(n + 1), 32, 34)
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(c), depthTest: false,
        }))
        sprite.scale.setScalar(0.22)
        sprite.renderOrder = 10
        const corners = mesh.userData.edgeMarkers.map(({mesh: em}) => em.position)
        const centroid = corners.reduce((sum, p) => sum.add(p), new THREE.Vector3()).multiplyScalar(1 / corners.length)
        sprite.position.copy(centroid)
        mesh.add(sprite)
        orderLabels.push(sprite)
      })
    },

    // Fixed cm lengths of a face's rusuk, in edge order (same source as the tappable markers).
    getEdgeLengths: (faceIndex) => (
      faces[faceIndex] ? faces[faceIndex].userData.edgeMarkers.map(({lengthCm}) => lengthCm) : []
    ),

    // Reveals one rusuk marker of a face (e.g. edge 0 = a lateral face's base segment) without
    // needing measure mode, and returns its length in cm.
    showFaceEdge: (faceIndex, edgeIndex) => {
      const marker = faces[faceIndex].userData.edgeMarkers[edgeIndex]
      marker.mesh.visible = true
      marker.mesh.material.color.setHex(HIGHLIGHT_COLOR)
      return marker.lengthCm
    },

    hideFaceEdge: (faceIndex, edgeIndex) => {
      const marker = faces[faceIndex].userData.edgeMarkers[edgeIndex]
      marker.mesh.visible = false
      marker.mesh.material.color.setHex(PURPLE)
    },

    // Shows/hides the dashed "tinggi limas" (apex straight down to the base) and returns its cm
    // value (null when the current shape isn't a pyramid).
    showPyramidHeight: (visible) => {
      if (!pyramidHeight) {
        return null
      }
      pyramidHeight.obj.visible = visible
      return pyramidHeight.lengthCm
    },

    // Model controls (PRD 4.3). 'rotate' = one-finger drag turns the model, 'move' = it slides it.
    setDragMode: (mode) => {
      dragMode = mode
    },
    rotateModel: (radians) => {
      if (shapeGroup) {
        shapeGroup.rotation.y += radians
      }
    },
    scaleModel: (factor) => {
      if (shapeGroup) {
        shapeGroup.scale.setScalar(THREE.MathUtils.clamp(shapeGroup.scale.x * factor, MIN_SCALE, MAX_SCALE))
      }
    },
    resetModel: () => {
      if (shapeGroup) {
        shapeGroup.position.copy(homePosition)
        shapeGroup.rotation.set(0, 0, 0)
        shapeGroup.scale.setScalar(1)
      }
    },
    getModelTransform: () => shapeGroup && ({
      position: shapeGroup.position.toArray(),
      rotation: [shapeGroup.rotation.x, shapeGroup.rotation.y, shapeGroup.rotation.z],
      scale: shapeGroup.scale.x,
    }),
    setModelTransform: (transform) => {
      if (shapeGroup && transform) {
        shapeGroup.position.fromArray(transform.position)
        shapeGroup.rotation.set(...transform.rotation)
        shapeGroup.scale.setScalar(transform.scale)
      }
    },
  }
}
