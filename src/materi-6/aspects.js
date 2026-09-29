// Materi 6's aspek menus (PRD-materi-6.md 5.5): different for kubus/balok and for prisma. Only
// id/label live here; each sub-flow is a function in ./index.js keyed by `id`.
const BOX_ASPECTS = [
  {id: 'k1', label: 'Susunan Kubus Satuan'},
  {id: 'k2', label: 'Jumlah Lapisan'},
  {id: 'k3', label: 'Ukuran Bangun'},
  {id: 'k4', label: 'Volume Bangun'},
  {id: 'x', label: 'Informasi Lainnya'},
]

const PRISM_ASPECTS = [
  {id: 'p1', label: 'Penampang Sejajar Alas'},
  {id: 'p2', label: 'Panjang Prisma'},
  {id: 'p3', label: 'Ukuran Bangun'},
  {id: 'p4', label: 'Volume Bangun'},
  {id: 'x', label: 'Informasi Lainnya'},
]

export const aspectsFor = (kind) => (kind === 'prism' ? PRISM_ASPECTS : BOX_ASPECTS)
