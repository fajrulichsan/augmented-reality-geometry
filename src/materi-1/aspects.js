// Materi 1's aspek pengamatan, prompt di AR, dan target tap-nya (sisi, rusuk, atau titik sudut).
// See PRD.md section 4.
export const ASPECTS = [
  {
    id: 'bentuk-sisi',
    label: 'Bentuk sisi',
    prompt: 'Amati model dari berbagai arah. Bentuk apa saja yang kamu temukan pada sisi-sisinya?',
    target: 'sisi',
  },
  {
    id: 'susunan-sisi',
    label: 'Susunan sisi',
    prompt: 'Amati bagaimana sisi-sisi bangun tersusun dan saling berhubungan. Apa yang kamu temukan?',
    target: 'sisi',
  },
  {
    id: 'sejajar',
    label: 'Pasangan bidang sisi sejajar',
    prompt: 'Amati model dari berbagai arah. Apakah kamu menemukan bidang sisi yang tampak sejajar?',
    target: 'sisi',
  },
  {
    id: 'alas',
    label: 'Bentuk sisi sebagai alas',
    prompt: 'Pilih salah satu sisi yang akan kamu amati sebagai alas. Amati bentuk sisi tersebut dari berbagai arah. Berbentuk apakah sisi yang kamu pilih?',
    target: 'sisi',
  },
  {
    id: 'jumlah-sisi',
    label: 'Jumlah sisi',
    prompt: 'Amati model dari berbagai arah. Telusuri seluruh sisinya. Berapa banyak sisi yang kamu temukan?',
    target: 'sisi',
  },
  {
    id: 'jumlah-rusuk',
    label: 'Jumlah rusuk',
    prompt: 'Amati model dari berbagai arah. Telusuri seluruh rusuknya. Berapa banyak rusuk yang kamu temukan?',
    target: 'rusuk',
  },
  {
    id: 'jumlah-titik-sudut',
    label: 'Jumlah titik sudut',
    prompt: 'Amati model dari berbagai arah. Telusuri seluruh titik sudutnya. Berapa banyak titik sudut yang kamu temukan?',
    target: 'titik',
  },
  {
    id: 'lainnya',
    label: 'Sifat/pola lainnya',
    prompt: 'Amati kembali model secara keseluruhan. Adakah sifat atau pola lain yang menurutmu dapat membantu menyelidiki dugaan kelompokmu?',
    target: 'sisi',
  },
]
