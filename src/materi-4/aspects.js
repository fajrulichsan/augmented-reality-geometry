// Materi 4's 9 aspek (PRD-materi-4.md section 4.5/4.6). Only id/label live here; each aspect's
// sub-flow is a function in ./index.js keyed by `id`.
export const ASPECTS = [
  {id: 'bentuk-alas', label: 'Bentuk alas'},
  {id: 'bentuk-sisi-tegak', label: 'Bentuk setiap sisi tegak', repeatLabel: 'Amati Sisi Tegak Lain'},
  {id: 'banyak-sisi-tegak', label: 'Banyak sisi tegak'},
  {id: 'ukuran-alas', label: 'Ukuran alas'},
  {id: 'ukuran-sisi-tegak', label: 'Ukuran pada sisi tegak', repeatLabel: 'Amati Sisi Tegak Lain'},
  {id: 'luas-alas', label: 'Luas alas'},
  {id: 'luas-sisi-tegak', label: 'Luas setiap sisi tegak', repeatLabel: 'Pilih Sisi Tegak Lain'},
  {id: 'hubungan', label: 'Hubungan alas dan sisi tegak'},
  {id: 'lainnya', label: 'Pola atau sifat lainnya'},
]
