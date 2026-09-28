// Materi 2's aspek pengamatan (jaring-jaring & pelipatan). See PRD-materi-2.md section 4-5.
// `selection` is how many sisi the student must pick before folding can start (0 = none).
export const ASPECTS = [
  {
    id: 'hubungan-antar-sisi',
    label: 'Hubungan antar sisi',
    selection: 2,
    promptIntro: 'Selidiki Hubungan Antar Sisi. Pilih dua sisi yang ingin kamu amati.',
    promptBeforeFold: 'Amati posisi kedua sisi sebelum dilipat.',
    promptAfterFold: 'Amati kedua sisi sebelum, selama, dan setelah dilipat. Apa hubungan yang kamu temukan?',
  },
  {
    id: 'posisi-sisi',
    label: 'Posisi sisi',
    selection: 1,
    promptIntro: 'Selidiki Posisi Sisi. Pilih satu sisi yang ingin kamu ikuti selama proses pelipatan.',
    promptBeforeFold: null,
    promptAfterFold: 'Bagaimana posisi sisi tersebut berubah sebelum dan setelah dilipat?',
  },
  {
    id: 'proses-lipatan',
    label: 'Proses lipatan',
    selection: 0,
    promptIntro: null,
    promptBeforeFold: 'Selidiki Proses Lipatan. Amati bagaimana sisi-sisi bergerak ketika jaring-jaring dilipat.',
    promptAfterFold: 'Perubahan apa yang kamu temukan selama jaring-jaring berubah menjadi bangun ruang?',
  },
  {
    id: 'hasil-lipatan',
    label: 'Hasil ketika jaring-jaring dilipat',
    selection: 0,
    promptIntro: null,
    promptBeforeFold: 'Menurutmu, apa yang akan terjadi ketika seluruh sisinya dilipat?',
    promptAfterFold: 'Amati posisi akhir setiap sisi. Apa yang kamu temukan setelah seluruh sisi dilipat?',
    hint: 'Perhatikan posisi setiap sisi. Apakah seluruh sisi menempati posisinya dengan tepat? Adakah sisi yang saling bertumpuk atau bagian yang belum tertutup?',
  },
  {
    id: 'pola-lainnya',
    label: 'Pola/sifat lainnya',
    selection: 0,
    promptIntro: null,
    promptBeforeFold: 'Adakah informasi atau pola lain yang kamu temukan selama mengamati dan melipat jaring-jaring ini?',
    promptAfterFold: 'Adakah informasi atau pola lain yang kamu temukan selama mengamati dan melipat jaring-jaring ini?',
  },
]
