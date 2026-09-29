// Parametric models for Materi 6 (PRD-materi-6.md): a kubus/balok stacked from unit cubes in
// layers, and a prism whose length can change while its cross-section stays fixed.
//
// All sizes are in "satuan" (mathematical units). One satuan is VU scene units, so the numbers the
// flow reports come from the model's own dimensions, never from how big it looks on screen.
import * as THREE from 'three'

export const VU = 0.3

const PURPLE = 0xAD50FF
const YELLOW = 0xFFEB3B
const ORANGE = 0xFF9800
const LAYER_SHADES = [0xAD50FF, 0x8E3FD6]
const EDGE_RADIUS = 0.02

// A layer of a kubus/balok is cols x rows unit cubes. Content team can change these (OQ-5).
export const BOX_BASES = {kubus: {cols: 3, rows: 3}, balok: {cols: 3, rows: 2}}
export const LAYER_RANGE = {kubus: [1, 2, 3], balok: [1, 2, 3, 4]}
export const LENGTH_RANGE = [1, 2, 3, 4]
export const SLICE_FRACS = [0.12, 0.5, 0.88]

export const VOLUME_VIEW_DEFAULT = {
  unitsVisible: false, // show the unit cubes (model partly transparent)
  highlightLayer: null, // index of the one highlighted layer (others fade)
  visibleLayers: null, // show only the first n layers (null = all)
  sliceOn: false, // prism: show a cross-section parallel to the base
  sliceFrac: 0.5, // prism: where along the length the cross-section sits (0..1)
  ghost: false, // prism: body semi-transparent
  lengthHighlight: false, // prism: highlight the lengthwise direction
}

const round2 = (value) => Math.round(value * 100) / 100

// Cross-section outline in satuan: [x across, y up from the bottom], counter-clockwise, flat
// bottom. Triangle 3 wide x 2 high, rectangle 3 x 2, regular polygon otherwise.
const POLY_RADIUS = 1.8
export const prismOutline = (sides) => {
  if (sides === 3) {
    return [[-1.5, 0], [1.5, 0], [0, 2]]
  }
  if (sides === 4) {
    return [[-1.5, 0], [1.5, 0], [1.5, 2], [-1.5, 2]]
  }
  const apothem = POLY_RADIUS * Math.cos(Math.PI / sides)
  return Array.from({length: sides}, (_, i) => {
    const angle = -Math.PI / 2 - Math.PI / sides + (2 * Math.PI * i) / sides
    return [POLY_RADIUS * Math.cos(angle), apothem + POLY_RADIUS * Math.sin(angle)]
  })
}

// The two measurable parts of the cross-section: the base side and the height (triangle height,
// rectangle height, or the apothem of a regular polygon).
export const prismMeasures = (sides) => {
  if (sides === 3 || sides === 4) {
    return {base: 3, height: 2}
  }
  return {
    base: round2(2 * POLY_RADIUS * Math.sin(Math.PI / sides)),
    height: round2(POLY_RADIUS * Math.cos(Math.PI / sides)),
  }
}

const UNIT_GEO = new THREE.BoxGeometry(VU * 0.98, VU * 0.98, VU * 0.98)
UNIT_GEO.userData.shared = true
const UNIT_EDGES = new THREE.EdgesGeometry(UNIT_GEO)
UNIT_EDGES.userData.shared = true

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

// Invisible-until-selected tap target along a part of the model (same idea as the rusuk markers).
const makeEdgeTarget = (a, b, units) => {
  const mesh = makeBar(a, b, EDGE_RADIUS, PURPLE)
  mesh.visible = false
  mesh.userData.units = units
  return mesh
}

const disposeTree = (root) => {
  root.traverse((obj) => {
    if (obj.geometry && !obj.geometry.userData.shared) {
      obj.geometry.dispose()
    }
    if (obj.material) {
      ;[].concat(obj.material).forEach((material) => material.dispose())
    }
  })
}

// spec: {kind: 'box', cols, rows, layers} | {kind: 'prism', sides, length}
// Returns {group, edgeMeshes, height, radius, spec, view, update(patch)}. The group is centered on
// its origin; the caller rests it on the ground with height / 2.
export const buildVolumeModel = (initialSpec) => {
  const group = new THREE.Group()
  const inner = new THREE.Group()
  group.add(inner)
  const vm = {
    group,
    inner,
    edgeMeshes: [],
    height: 1,
    radius: 1,
    spec: {...initialSpec},
    view: {...VOLUME_VIEW_DEFAULT},
  }
  let sliceGroup = null
  let markerGroup = null
  let prismLen = 0

  const clearInner = () => {
    inner.children.slice().forEach((child) => {
      inner.remove(child)
      disposeTree(child)
    })
    sliceGroup = null
    markerGroup = null
  }

  const rebuildBox = () => {
    const {cols, rows, layers} = vm.spec
    const {view} = vm
    const shown = view.visibleLayers == null ? layers : Math.min(view.visibleLayers, layers)
    const W = cols * VU
    const D = rows * VU
    const H = layers * VU
    const unitsMode = view.unitsVisible || view.highlightLayer !== null

    for (let l = 0; l < shown; l++) {
      const y = -H / 2 + (l + 0.5) * VU
      if (!unitsMode) {
        // Solid look: one slab per layer, alternating shades so the layers can be told apart.
        const geo = new THREE.BoxGeometry(W, VU, D)
        const slab = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({color: LAYER_SHADES[l % 2]}))
        slab.position.y = y
        const edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({color: 0xffffff})
        )
        edges.position.y = y
        inner.add(slab, edges)
        continue
      }
      const hi = view.highlightLayer === l
      const dim = view.highlightLayer !== null && !hi
      const cubeMat = new THREE.MeshLambertMaterial({
        color: hi ? YELLOW : PURPLE,
        transparent: true,
        opacity: hi ? 0.85 : dim ? 0.06 : 0.3,
        depthWrite: false,
      })
      const lineMat = new THREE.LineBasicMaterial({
        color: hi ? 0x222222 : 0xffffff, transparent: true, opacity: dim ? 0.12 : 0.9,
      })
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = (c + 0.5) * VU - W / 2
          const z = (r + 0.5) * VU - D / 2
          const cube = new THREE.Mesh(UNIT_GEO, cubeMat)
          cube.position.set(x, y, z)
          const edges = new THREE.LineSegments(UNIT_EDGES, lineMat)
          edges.position.set(x, y, z)
          inner.add(cube, edges)
        }
      }
    }

    const a = new THREE.Vector3(-W / 2, -H / 2, D / 2)
    const b = new THREE.Vector3(W / 2, -H / 2, D / 2)
    const c = new THREE.Vector3(W / 2, -H / 2, -D / 2)
    const d = new THREE.Vector3(W / 2, H / 2, D / 2)
    vm.edgeMeshes = [makeEdgeTarget(a, b, cols), makeEdgeTarget(b, c, rows), makeEdgeTarget(b, d, layers)]
    inner.add(...vm.edgeMeshes)
    vm.height = H
    vm.radius = Math.hypot(W, D) / 2
    inner.rotation.y = 0
  }

  const placeSlice = () => {
    if (!sliceGroup || !markerGroup) {
      return
    }
    const x = -prismLen / 2 + vm.view.sliceFrac * prismLen
    sliceGroup.position.x = x
    sliceGroup.visible = vm.view.sliceOn
    // The size markers ride on the cross-section when it is shown, otherwise on the end face.
    markerGroup.position.x = vm.view.sliceOn ? x : prismLen / 2
  }

  const rebuildPrism = () => {
    const {sides, length} = vm.spec
    const {view} = vm
    const pts = prismOutline(sides)
    const maxY = Math.max(...pts.map((p) => p[1]))
    const halfW = Math.max(...pts.map((p) => Math.abs(p[0])))
    const sp = pts.map(([x, y]) => [x, y - maxY / 2])
    const len = length * VU
    prismLen = len

    const shape = new THREE.Shape(sp.map(([x, y]) => new THREE.Vector2(x * VU, y * VU)))
    // Extrude along z, then turn so the prism lies along x and the cross-section sits in the yz plane.
    const body = new THREE.ExtrudeGeometry(shape, {depth: len, bevelEnabled: false})
    body.translate(0, 0, -len / 2)
    body.rotateY(Math.PI / 2)
    inner.add(new THREE.Mesh(body, new THREE.MeshLambertMaterial({
      color: PURPLE,
      transparent: view.ghost,
      opacity: view.ghost ? 0.28 : 1,
      depthWrite: !view.ghost,
      side: THREE.DoubleSide,
    })))
    inner.add(new THREE.LineSegments(
      new THREE.EdgesGeometry(body, 1),
      new THREE.LineBasicMaterial({color: 0xffffff, transparent: view.ghost, opacity: view.ghost ? 0.7 : 1})
    ))

    // Point of the outline at along-axis position x.
    const at = (x, [sx, sy]) => new THREE.Vector3(x, sy * VU, -sx * VU)

    // Cross-section parallel to the base: filled shape plus a solid outline that stays visible.
    sliceGroup = new THREE.Group()
    const sliceGeo = new THREE.ShapeGeometry(shape)
    sliceGeo.rotateY(Math.PI / 2)
    sliceGroup.add(new THREE.Mesh(sliceGeo, new THREE.MeshBasicMaterial({
      color: YELLOW, transparent: true, opacity: 0.8, side: THREE.DoubleSide, depthWrite: false,
    })))
    sp.forEach((p, i) => {
      sliceGroup.add(makeBar(at(0, p), at(0, sp[(i + 1) % sp.length]), 0.01, ORANGE))
    })
    inner.add(sliceGroup)

    // Base side + height of the cross-section (index 0, 1), then the prism length (index 2).
    const meas = prismMeasures(sides)
    markerGroup = new THREE.Group()
    const baseY = sp[0][1]
    let heightA
    let heightB
    if (sides === 3) {
      heightA = [0, baseY]
      heightB = sp[2]
    } else if (sides === 4) {
      heightA = sp[1]
      heightB = sp[2]
    } else {
      heightA = [0, baseY + meas.height]
      heightB = [0, baseY]
    }
    const baseT = makeEdgeTarget(at(0, sp[0]), at(0, sp[1]), meas.base)
    const heightT = makeEdgeTarget(at(0, heightA), at(0, heightB), meas.height)
    markerGroup.add(baseT, heightT)
    inner.add(markerGroup)
    const lenT = makeEdgeTarget(at(-len / 2, sp[0]), at(len / 2, sp[0]), length)
    inner.add(lenT)
    vm.edgeMeshes = [baseT, heightT, lenT]

    if (view.lengthHighlight) {
      const a = at(-len / 2, sp[0])
      const b = at(len / 2, sp[0])
      inner.add(makeBar(a, b, 0.03, YELLOW))
      ;[a, b].forEach((end) => {
        const cap = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 10), new THREE.MeshBasicMaterial({color: YELLOW}))
        cap.position.copy(end)
        inner.add(cap)
      })
    }

    placeSlice()
    vm.height = maxY * VU
    vm.radius = Math.hypot(len, 2 * halfW * VU) / 2
    inner.rotation.y = -0.55
  }

  const rebuild = () => {
    clearInner()
    if (vm.spec.kind === 'box') {
      rebuildBox()
    } else {
      rebuildPrism()
    }
  }

  // patch may hold spec values (layers / length) and/or view values; sliding the cross-section
  // only moves it instead of rebuilding the prism.
  vm.update = (patch) => {
    const keys = Object.keys(patch)
    keys.forEach((key) => {
      if (key === 'layers' || key === 'length') {
        vm.spec[key] = patch[key]
      } else if (key in vm.view) {
        vm.view[key] = patch[key]
      }
    })
    if (vm.spec.kind === 'prism' && sliceGroup && keys.length === 1 && keys[0] === 'sliceFrac') {
      placeSlice()
      return
    }
    rebuild()
  }

  rebuild()
  return vm
}
