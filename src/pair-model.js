// Prisma + limas pair for Materi 7 (PRD-materi-7.md). Both solids are built from ONE spec, so
// bentuk alas, luas alas and tinggi always correspond (PRD principle 2/4); a change to the spec
// changes both at once. Sizes are in "satuan" (mathematical units, PU scene units each), so the
// numbers the flow reports come from these dimensions, never from how big the model looks.
//
// The model never states a volume, ratio or formula. The only volume-related thing it can do is
// draw liquid moving from the limas into the prisma (view.pyramidLeft / view.prismLevel).
import * as THREE from 'three'

export const PU = 0.22
export const AREA_LEVELS = [4, 6, 9] // satuan^2
export const HEIGHT_LEVELS = [2, 3, 4] // satuan

const PURPLE = 0xAD50FF
const BLUE = 0x4FC3F7
const YELLOW = 0xFFEB3B
const LIQUID = 0xFFB300
const GAP = 0.12 // scene units between the two solids (never overlapping, PRD principle 5)

export const PAIR_VIEW_DEFAULT = {
  baseHighlight: false, // both bases in the same highlight color
  heightLines: false, // vertical height line in both solids
  pyramidLeft: null, // fraction of the limas content still inside it (null = no liquid shown)
  prismLevel: 0, // filled fraction of the prism's height
}

// Regular n-gon of area A has circumradius sqrt(2A / (n sin(2pi/n))).
export const polygonRadius = (sides, area) => Math.sqrt((2 * area) / (sides * Math.sin((2 * Math.PI) / sides)))

// Dimensions the model is built from, for both solids (in satuan).
export const pairDims = (spec) => {
  const area = AREA_LEVELS[spec.areaIdx]
  const height = HEIGHT_LEVELS[spec.heightIdx]
  return {
    prism: {sides: spec.sides, area, height},
    pyramid: {sides: spec.sides, area, height},
  }
}

// Pre-check before the filling animation (PRD 4.9 step 1): bentuk alas, luas alas, tinggi.
export const pairCheck = (pair) => {
  const near = (a, b) => Math.abs(a - b) < 1e-9
  const {prism, pyramid} = pair.dims
  return {
    shape: prism.sides === pyramid.sides,
    area: near(prism.area, pyramid.area),
    height: near(prism.height, pyramid.height),
  }
}

// How many limas contents fill the prism, from the actual solids (V prism / V limas). Used only to
// drive the animation; it is never shown to the student.
const prismVolume = (d) => d.area * d.height
const pyramidVolume = (d) => (d.area * d.height) / 3
export const fillsToFull = (spec) => {
  const {prism, pyramid} = pairDims(spec)
  return Math.max(1, Math.round(prismVolume(prism) / pyramidVolume(pyramid)))
}

const disposeTree = (root) => {
  root.traverse((obj) => {
    if (obj.geometry) {
      obj.geometry.dispose()
    }
    if (obj.material) {
      ;[].concat(obj.material).forEach((material) => material.dispose())
    }
  })
}

const makeBar = (a, b, radius, color) => {
  const dir = new THREE.Vector3().subVectors(b, a)
  const bar = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius, dir.length(), 6),
    new THREE.MeshBasicMaterial({color, depthTest: false})
  )
  bar.renderOrder = 5
  bar.position.copy(a).addScaledVector(dir, 0.5)
  bar.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
  return bar
}

// spec: {kind: 'pair', sides, areaIdx, heightIdx}
// Same interface as the other volume models: {group, edgeMeshes, height, radius, spec, view, update}.
export const buildPairModel = (initialSpec) => {
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
    view: {...PAIR_VIEW_DEFAULT},
    dims: pairDims(initialSpec),
  }
  let liquid = null // {prism, pyramid, prismY, pyramidY, R, H}

  const clearInner = () => {
    inner.children.slice().forEach((child) => {
      inner.remove(child)
      disposeTree(child)
    })
    liquid = null
  }

  // Polygon meshes share an orientation: flat side toward the viewer for the square.
  const poly = (geo) => {
    geo.rotateY(Math.PI / vm.spec.sides)
    return geo
  }

  const applyFill = () => {
    if (!liquid) {
      return
    }
    const {view} = vm
    const {R, H} = liquid
    const n = vm.spec.sides
    ;['prism', 'pyramid'].forEach((key) => {
      const mesh = liquid[key]
      mesh.geometry.dispose()
      mesh.visible = false
    })
    if (view.pyramidLeft === null) {
      return
    }
    // Limas content at level u (from the base) is a frustum whose share of the whole is
    // 1 - (1-u)^3, so the level for a remaining share v is u = 1 - (1-v)^(1/3).
    const v = Math.min(1, Math.max(0, view.pyramidLeft))
    const u = 1 - Math.cbrt(1 - v)
    const pyr = liquid.pyramid
    if (u > 0.001) {
      pyr.geometry = poly(new THREE.CylinderGeometry(R * (1 - u), R, H * u, n))
      pyr.position.set(liquid.pyramidX, -H / 2 + (H * u) / 2, 0)
      pyr.visible = true
    } else {
      pyr.geometry = new THREE.BufferGeometry()
    }
    const level = Math.min(1, Math.max(0, view.prismLevel))
    const prs = liquid.prism
    if (level > 0.001) {
      prs.geometry = poly(new THREE.CylinderGeometry(R, R, H * level, n))
      prs.position.set(liquid.prismX, -H / 2 + (H * level) / 2, 0)
      prs.visible = true
    } else {
      prs.geometry = new THREE.BufferGeometry()
    }
  }

  const rebuild = () => {
    clearInner()
    const {sides, areaIdx, heightIdx} = vm.spec
    vm.dims = pairDims(vm.spec)
    const {view} = vm
    const R = polygonRadius(sides, vm.dims.prism.area) * PU
    const H = vm.dims.prism.height * PU
    // The offset is fixed by the largest base so changing the area never moves the solids.
    const maxR = polygonRadius(sides, AREA_LEVELS[AREA_LEVELS.length - 1]) * PU
    const offset = maxR + GAP / 2
    const prismX = -offset
    const pyramidX = offset

    const shell = (geo, color, x) => {
      poly(geo)
      const mesh = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({
        color, transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide,
      }))
      mesh.position.set(x, 0, 0)
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geo, 1), new THREE.LineBasicMaterial({color: 0xffffff})
      )
      edges.position.set(x, 0, 0)
      inner.add(mesh, edges)
    }
    shell(new THREE.CylinderGeometry(R, R, H, sides), PURPLE, prismX)
    shell(new THREE.CylinderGeometry(0, R, H, sides), BLUE, pyramidX)

    // Base outlines, same color on both when highlighted.
    if (view.baseHighlight) {
      ;[prismX, pyramidX].forEach((x) => {
        const disc = new THREE.Mesh(
          poly(new THREE.CylinderGeometry(R, R, 0.012, sides)),
          new THREE.MeshBasicMaterial({color: YELLOW, transparent: true, opacity: 0.9})
        )
        disc.position.set(x, -H / 2 + 0.006, 0)
        inner.add(disc)
      })
    }

    if (view.heightLines) {
      ;[prismX, pyramidX].forEach((x) => {
        inner.add(makeBar(new THREE.Vector3(x, -H / 2, 0), new THREE.Vector3(x, H / 2, 0), 0.012, YELLOW))
      })
    }

    const liquidMat = new THREE.MeshLambertMaterial({color: LIQUID, transparent: true, opacity: 0.85})
    const pyramidLiquid = new THREE.Mesh(new THREE.BufferGeometry(), liquidMat)
    const prismLiquid = new THREE.Mesh(new THREE.BufferGeometry(), liquidMat)
    inner.add(pyramidLiquid, prismLiquid)
    liquid = {prism: prismLiquid, pyramid: pyramidLiquid, prismX, pyramidX, R, H}
    applyFill()

    vm.height = H
    vm.radius = maxR + GAP / 2 + maxR
    vm.areaIdx = areaIdx
    vm.heightIdx = heightIdx
  }

  // patch may hold spec values (areaIdx / heightIdx) and/or view values. Filling animation frames
  // only touch the liquid instead of rebuilding.
  vm.update = (patch) => {
    const keys = Object.keys(patch)
    let structural = false
    keys.forEach((key) => {
      if (key === 'areaIdx' || key === 'heightIdx') {
        vm.spec[key] = patch[key]
        structural = true
      } else if (key in vm.view) {
        if (key === 'baseHighlight' || key === 'heightLines') {
          structural = structural || vm.view[key] !== patch[key]
        }
        vm.view[key] = patch[key]
      }
    })
    if (structural || !liquid) {
      rebuild()
    } else {
      applyFill()
    }
  }

  rebuild()
  return vm
}
