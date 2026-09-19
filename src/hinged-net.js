// Builds a fold/unfold net for any convex solid from its 3D vertices and faces. Each face (except
// the root) hinges on one edge shared with its parent face, so unfolding rotates every face about
// that edge - the faces stay attached instead of flying apart.
import * as THREE from 'three';

// Component of `vector` perpendicular to the (unit) `axis`, normalized.
const perpendicularTo = (vector, axis) => (
  vector.clone().addScaledVector(axis, -vector.dot(axis)).normalize()
)

const average = (points) => (
  points.reduce((sum, p) => sum.add(p), new THREE.Vector3()).divideScalar(points.length)
)

// vertices: THREE.Vector3[] of the folded solid. faceDefs: [{verts: [vertexIds in polygon order],
// parent: index of an earlier face (-1 for the root, which must be first), hinge: [idA, idB] shared
// with the parent}]. Returns each face's flat outline in net space plus the hinge data needed to
// fold it, and the root's folded frame / the net's center.
export const buildHingedNetDefs = (vertices, faceDefs) => {
  const solidCenter = average(vertices)
  const faces = faceDefs.map((def) => ({
    ...def,
    center3: average(def.verts.map((id) => vertices[id])),
    points2: new Map(),
  }))

  // Root: laid flat with its outward-to-body normal on +z, so the whole solid folds up toward +z.
  const root = faces[0]
  const origin = vertices[root.verts[0]].clone()
  const edge1 = new THREE.Vector3().subVectors(vertices[root.verts[1]], origin)
  const edge2 = new THREE.Vector3().subVectors(vertices[root.verts[2]], origin)
  const normal = new THREE.Vector3().crossVectors(edge1, edge2).normalize()
  if (normal.dot(new THREE.Vector3().subVectors(solidCenter, root.center3)) < 0) {
    normal.negate()
  }
  const xAxis = edge1.clone().normalize()
  const yAxis = new THREE.Vector3().crossVectors(normal, xAxis)
  root.verts.forEach((id) => {
    const rel = new THREE.Vector3().subVectors(vertices[id], origin)
    root.points2.set(id, new THREE.Vector2(rel.dot(xAxis), rel.dot(yAxis)))
  })
  const rootQuat = new THREE.Quaternion().setFromRotationMatrix(
    new THREE.Matrix4().makeBasis(xAxis, yAxis, normal)
  )

  const center2Of = (face) => {
    const sum = new THREE.Vector2()
    face.verts.forEach((id) => sum.add(face.points2.get(id)))
    return sum.divideScalar(face.verts.length)
  }

  for (let i = 1; i < faces.length; i++) {
    const face = faces[i]
    const parent = faces[face.parent]
    const [idA, idB] = face.hinge
    const a3 = vertices[idA]
    const hinge3 = new THREE.Vector3().subVectors(vertices[idB], a3).normalize()

    // Flat layout: the child lies across the hinge from its parent.
    const a2 = parent.points2.get(idA)
    const hinge2 = new THREE.Vector2().subVectors(parent.points2.get(idB), a2).normalize()
    const away = new THREE.Vector2(-hinge2.y, hinge2.x)
    if (new THREE.Vector2().subVectors(center2Of(parent), a2).dot(away) > 0) {
      away.negate()
    }
    face.verts.forEach((id) => {
      const rel = new THREE.Vector3().subVectors(vertices[id], a3)
      const along = rel.dot(hinge3)
      const height = rel.addScaledVector(hinge3, -along).length()
      face.points2.set(id, a2.clone().addScaledVector(hinge2, along).addScaledVector(away, height))
    })

    // Fold angle: how far the child bends from the parent's plane extension to its real position.
    const towardParent = perpendicularTo(new THREE.Vector3().subVectors(parent.center3, a3), hinge3)
    const towardChild = perpendicularTo(new THREE.Vector3().subVectors(face.center3, a3), hinge3)
    const angle = Math.PI - towardParent.angleTo(towardChild)

    // Rotate toward +z (the body side) about the hinge.
    const axis = new THREE.Vector3(hinge2.x, hinge2.y, 0)
    const child2 = new THREE.Vector2().subVectors(center2Of(face), a2)
    const side = axis.x * child2.y - axis.y * child2.x
    face.hingeOrigin = new THREE.Vector3(a2.x, a2.y, 0)
    face.hingeAxis = axis
    face.foldAngle = side >= 0 ? angle : -angle
  }

  const bounds = new THREE.Box2()
  faces.forEach((face) => face.points2.forEach((p) => bounds.expandByPoint(p)))
  const netCenter = bounds.getCenter(new THREE.Vector2())

  return {faces, rootOrigin: origin, rootQuat, netCenter}
}

// Convex right pyramid with a regular polygon base, centered vertically on the origin.
export const pyramidSolid = (sides, radius, height) => {
  const vertices = Array.from({length: sides}, (_, i) => {
    const theta = (i * 2 * Math.PI) / sides
    return new THREE.Vector3(radius * Math.cos(theta), -height / 2, radius * Math.sin(theta))
  })
  vertices.push(new THREE.Vector3(0, height / 2, 0))
  const apex = sides

  const faceDefs = [{verts: Array.from({length: sides}, (_, i) => i), parent: -1}]
  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides
    faceDefs.push({verts: [i, next, apex], parent: 0, hinge: [i, next]})
  }
  return {vertices, faceDefs}
}

// Right prism with a regular polygon base, centered on the origin. Net: a row of side rectangles
// with the two caps attached above/below the middle rectangle.
export const prismSolid = (sides, radius, height) => {
  const vertices = []
  ;[-height / 2, height / 2].forEach((y) => {
    for (let i = 0; i < sides; i++) {
      const theta = (i * 2 * Math.PI) / sides
      vertices.push(new THREE.Vector3(radius * Math.cos(theta), y, radius * Math.sin(theta)))
    }
  })

  const sideVerts = (i) => {
    const next = (i + 1) % sides
    return [i, next, sides + next, sides + i]
  }

  // Face indices: 0 = bottom cap, 1 + i = side i, sides + 1 = top cap.
  const faceDefs = [{verts: Array.from({length: sides}, (_, i) => i), parent: -1}]
  faceDefs.push({verts: sideVerts(0), parent: 0, hinge: [0, 1]})

  const rightCount = Math.floor((sides - 1) / 2)
  for (let i = 1; i <= rightCount; i++) {
    faceDefs[1 + i] = {verts: sideVerts(i), parent: i, hinge: [i, sides + i]}
  }
  for (let i = sides - 1; i > rightCount; i--) {
    const shared = i === sides - 1 ? 0 : i + 1
    const parent = i === sides - 1 ? 1 : 1 + (i + 1)
    faceDefs[1 + i] = {verts: sideVerts(i), parent, hinge: [shared, sides + shared]}
  }
  faceDefs.push({
    verts: Array.from({length: sides}, (_, i) => sides + i), parent: 1, hinge: [sides, sides + 1],
  })

  // Faces must be listed after their parents. The left chain was filled from the end, so reorder
  // by dependency while remapping parent indices.
  const order = []
  const placed = new Set()
  while (order.length < faceDefs.length) {
    faceDefs.forEach((def, index) => {
      if (!placed.has(index) && (def.parent < 0 || placed.has(def.parent))) {
        placed.add(index)
        order.push(index)
      }
    })
  }
  const newIndex = new Map(order.map((oldIndex, i) => [oldIndex, i]))
  return {
    vertices,
    faceDefs: order.map((oldIndex) => {
      const def = faceDefs[oldIndex]
      return {...def, parent: def.parent < 0 ? -1 : newIndex.get(def.parent)}
    }),
  }
}
