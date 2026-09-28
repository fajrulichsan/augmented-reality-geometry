// Materi 3's 7 aspek (PRD-materi-3.md FR-3/FR-4). Unlike materi-1/materi-2, each aspect here has a
// meaningfully different sub-flow (1 sisi vs 2 sisi, with/without measuring, with/without a
// "Gunakan Data Sebelumnya" step) - so this file only holds per-aspect config/prompts; index.js has
// one handler function per `kind`.
export const ASPECTS = [
  {
    id: 'banyak-sisi',
    label: 'Banyak sisi',
    kind: 'count',
    prompt: 'Amati model dari berbagai arah. Ketuk tiap sisi yang kamu temukan (ketuk ulang tidak menambah hitungan). Berapa banyak sisi yang kamu temukan?',
  },
  {
    id: 'bentuk-sisi',
    label: 'Bentuk setiap sisi',
    kind: 'shape',
    prompt: 'Pilih salah satu sisi untuk diamati.',
    afterSelectPrompt: 'Bentuk bangun datar apa yang kamu lihat pada sisi ini?',
    hint: 'Perhatikan bentuk bidangnya, ada berapa rusuk yang membatasinya, dan bagaimana hubungan antar rusuk tersebut.',
  },
  {
    id: 'ukuran-sisi',
    label: 'Ukuran setiap sisi',
    kind: 'size',
    prompt: 'Pilih salah satu sisi untuk diukur.',
  },
  {
    id: 'luas-sisi',
    label: 'Luas setiap sisi',
    kind: 'area',
    prompt: 'Pilih salah satu sisi. AR tidak menampilkan rumus atau hasil luasnya - itu bagian yang kamu kerjakan di e-module.',
  },
  {
    id: 'sisi-sama',
    label: 'Sisi sama bentuk & ukuran',
    kind: 'compareShapeSize',
    prompt: 'Pilih 2 sisi yang ingin kamu bandingkan bentuk dan ukurannya.',
    afterSelectPrompt: 'Bandingkan bentuk dan ukuran kedua sisi ini. Apa kesimpulanmu?',
    hint: 'Bandingkan bentuk kedua sisi, lalu bandingkan ukuran bagian-bagian yang bersesuaian.',
  },
  {
    id: 'hubungan-ukuran',
    label: 'Hubungan ukuran antar sisi',
    kind: 'compareSize',
    prompt: 'Pilih 2 sisi (Sisi A & Sisi B) yang ingin kamu amati hubungannya.',
    afterSelectPrompt: 'Amati ukuran kedua sisi ini. Adakah hubungan di antara keduanya?',
  },
  {
    id: 'lainnya',
    label: 'Sifat/informasi lainnya',
    kind: 'free',
    prompt: 'Eksplorasi bebas: putar, geser, dan perbesar model. Pilih sisi dan tampilkan ukurannya jika perlu.',
  },
]
