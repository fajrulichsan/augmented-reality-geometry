# PRD: Eksplorasi dengan AR (Bangun Ruang)

**Status:** Draft v0.2 | **Platform:** AR via QR/tautan dari e-module | **Pendamping:** GeoGebra 3D

## 1. Ringkasan & Tujuan

Siswa mengamati model bangun ruang 3D di lingkungan nyata (mis. di atas meja) dari berbagai arah untuk **melengkapi informasi yang dibutuhkan dalam menyelidiki dugaan kelompok**. Siswa memilih sendiri bangun dan aspek yang diamati; tidak wajib mengamati semuanya (sama seperti GeoGebra).

**Prinsip utama**
- AR hanya memfasilitasi pengamatan: **tidak memberi jawaban**, rumus, atau umpan balik benar/salah.
- Hasil dicatat siswa di **tabel e-module**, bukan di AR.
- Interaksi fisik-spasial (berjalan/berpindah posisi) paling ditekankan.

**Di luar cakupan:** kuis/penilaian, form catatan di AR, sesi multi-perangkat, bangun sisi lengkung, dasbor guru.

## 2. Alur

```
Tampilan Awal → Persiapan AR → Pilih Bangun → Tempatkan Model → Pilih Aspek
→ Eksplorasi → Catat (di e-module) → Periksa Kecukupan Data
   ├ Sudah Cukup → Eksplorasi AR Selesai
   └ Perlu Data Tambahan → [Amati aspek lain → Pilih Aspek] / [Amati bangun lain → Pilih Bangun]
```
Bangun lain memakai mekanisme sama; model lama diganti model baru di permukaan AR.

## 3. Kebutuhan Fungsional

P0 = wajib, P1 = disarankan, P2 = jika memungkinkan.

| ID | Tahap | Kebutuhan | Prio |
|---|---|---|---|
| F1 | Tampilan awal | Judul **"Ayo Lanjutkan Eksplorasimu!"**; teks: *"Gunakan Augmented Reality (AR) untuk mengamati bangun ruang dari berbagai arah. Pilih bangun yang perlu kamu amati untuk melengkapi informasi yang masih diperlukan."* Tombol **[Mulai AR]** (minta izin kamera). | P0 |
| F2 | Persiapan | Instruksi *"Arahkan kamera ke permukaan datar dan cukup terang."* Deteksi permukaan otomatis → *"Permukaan terdeteksi. Ketuk untuk menempatkan model."* Indikator permukaan (reticle/grid). | P0 (indikator P1) |
| F3 | Pilih bangun | Menu **"Pilih Bangun Ruang"** + teks *"Pilih bangun yang perlu kamu amati sesuai informasi yang masih kamu perlukan."* Bangun dapat diganti kapan saja tanpa deteksi ulang. | P0 |
| F4 | Penempatan & manipulasi | Model muncul di titik yang diketuk, stabil saat siswa bergerak. Gestur: **↻ Putar, ↔ Geser, 🔍 Perbesar/Perkecil, 🚶 Lihat dari berbagai arah**. Petunjuk 🚶 harus **paling menonjol** (siswa melihat bagian depan, samping, atas, belakang). | P0 |
| F5 | Pilih aspek | *"Apa yang ingin kamu amati lebih jelas?"* + *"Pilih informasi yang ingin kamu amati lebih jelas. Kamu tidak harus mengamati semuanya."* Checkbox, min. 1 aspek (lihat 4). Bisa berpindah antar-aspek terpilih. | P0 (pindah aspek P1) |
| F6 | Eksplorasi | Prompt pemandu per aspek (lihat 4). Highlight sementara untuk sisi/rusuk/titik yang diketuk; penanda "sudah diamati" agar tidak terhitung ganda. **Tanpa jawaban.** | P0 |
| F7 | Lihat Lebih Jelas | Tombol **[Lihat Lebih Jelas]** → *Perbesar model \| Putar model \| Lihat dari sisi lain*. **[Transparansi Model]** untuk melihat rusuk/sisi belakang jika teknis memungkinkan. | P0 (transparansi P1) |
| F8 | Catat | *"Apa yang kamu temukan? Catat hasil pengamatan AR pada tabel di e-module."* Tombol **[Amati Aspek Lain]** / **[Periksa Kecukupan Data]**. | P0 |
| F9 | Kecukupan data | *"Apakah hasil pengamatan AR sudah melengkapi informasi yang kamu perlukan?"* **[Sudah Cukup] \| [Perlu Data Tambahan]**. Jika perlu: *"Apa yang ingin kamu lakukan?"* → **[Amati aspek lain]** (ke menu aspek, bangun sama) / **[Amati bangun lain]** (ke menu bangun). | P0 |
| F10 | Bandingkan Model | Tombol **[Bandingkan Model]**: dua model (mis. Prisma Segitiga + Limas Segitiga) berdampingan, prompt *"Amati kedua model dari berbagai arah. Apa persamaan dan perbedaannya berdasarkan informasi yang sedang kamu selidiki?"* | P2 |
| F11 | Selesai | Judul **"Eksplorasi AR Selesai"**; teks *"Gunakan hasil pengamatan GeoGebra 3D dan AR untuk melengkapi data yang kamu perlukan. Pastikan hasil pengamatanmu cukup untuk menyelidiki dugaan kelompok."* Tombol **[Selesai Eksplorasi AR]** kembali ke e-module. | P0 |

## 4. Konten

**Menu bangun ruang:** Kubus · Balok · Prisma (Segitiga, Segiempat, Segilima, Segi-n) · Limas (Segitiga, Segiempat, Segilima, Segi-n). "Prisma" dan "Limas" adalah grup menu; siswa memilih subjenisnya.

**Aspek pengamatan, prompt, dan aktivitas siswa**

| Aspek | Prompt di AR | Aktivitas / perilaku sistem |
|---|---|---|
| Bentuk sisi | "Amati model dari berbagai arah. Bentuk apa saja yang kamu temukan pada sisi-sisinya?" | Mengelilingi/memutar, ketuk sisi → highlight sementara |
| Susunan sisi | "Amati bagaimana sisi-sisi bangun tersusun dan saling berhubungan. Apa yang kamu temukan?" | Ubah sudut pandang, putar, amati hubungan antar-sisi |
| Pasangan bidang sisi sejajar | "Amati model dari berbagai arah. Apakah kamu menemukan bidang sisi yang tampak sejajar?" | Keliling/putar/perbesar; ketuk sisi → sorot sementara, **tanpa jawaban** |
| Bentuk sisi sebagai alas | "Pilih salah satu sisi yang akan kamu amati sebagai alas. Amati bentuk sisi tersebut dari berbagai arah. Berbentuk apakah sisi yang kamu pilih?" | Ketuk satu sisi (highlight), ubah posisi/sudut pandang |
| Jumlah sisi | "Amati model dari berbagai arah. Telusuri seluruh sisinya. Berapa banyak sisi yang kamu temukan?" | Ketuk sisi satu per satu; penanda sementara cegah hitung ganda |
| Jumlah rusuk | "Amati model dari berbagai arah. Telusuri seluruh rusuknya. Berapa banyak rusuk yang kamu temukan?" | Putar/keliling; rusuk tersentuh di-highlight; **Lihat Rusuk Tersembunyi** bila perlu |
| Jumlah titik sudut | "Amati model dari berbagai arah. Telusuri seluruh titik sudutnya. Berapa banyak titik sudut yang kamu temukan?" | Ketuk titik satu per satu; penanda sementara |
| Sifat/pola lainnya | "Amati kembali model secara keseluruhan. Adakah sifat atau pola lain yang menurutmu dapat membantu menyelidiki dugaan kelompokmu?" | Bebas putar, perbesar, keliling, sorot bagian penting |

## 5. Non-Fungsional

- **Akses:** tanpa instalasi jika memungkinkan (WebAR/WebXR); Android & iOS berkemampuan AR; daftar perangkat minimum perlu ditetapkan.
- **Performa:** model termuat < 3 dtk (4G), ≥ 30 FPS di perangkat menengah, tracking stabil.
- **UI:** Bahasa Indonesia, teks singkat; target sentuh ≥ 44 px; highlight tidak hanya bergantung warna; portrait & landscape.
- **Privasi:** kamera hanya untuk AR; tanpa rekam/unggah; tanpa data pribadi wajib.

**Error state**
- Izin kamera ditolak → penjelasan + cara mengaktifkan.
- Perangkat tidak mendukung AR → pesan jelas + arahkan ke GeoGebra 3D.
- Permukaan tak terdeteksi → ulang instruksi + tips pencahayaan.
- Tracking hilang → arahkan kamera kembali, pulihkan posisi model.
- Ganti bangun di tengah eksplorasi → model diganti, kembali ke menu aspek, penanda direset.

## 6. Metrik (usulan)

Penempatan model pertama berhasil ≥ 90% · waktu ke model tampil ≤ 60 dtk (median) · sesi dengan gestur putar/keliling ≥ 80% · sesi sampai "Selesai" ≥ 70% · kepuasan ≥ 4/5.

## 7. Kriteria Penerimaan

1. Siswa dapat membuka tautan, menekan Mulai AR, dan menempatkan model.
2. Semua bangun di menu dapat dipilih dan ditampilkan.
3. Tiap aspek menampilkan prompt yang sesuai **tanpa jawaban**.
4. Ketuk sisi/rusuk/titik sudut memberi highlight/penanda sementara.
5. Alur *Perlu Data Tambahan → aspek lain / bangun lain* berfungsi; model lama diganti.
6. *Sudah Cukup* menampilkan layar "Eksplorasi AR Selesai".
7. Petunjuk "Lihat dari berbagai arah" paling menonjol; siswa tidak dipaksa mengamati semua bangun/aspek.

## 8. Pertanyaan Terbuka & Asumsi

| # | Isu | Usulan sementara |
|---|---|---|
| 1 | Cara siswa menentukan *n* pada Prisma/Limas Segi-n | Input/slider n (mis. 3-12), model parametrik |
| 2 | Multi-pilih aspek: berurutan atau bebas? | Satu aspek aktif, ada pengalih aspek |
| 3 | "Pasangan bidang sisi sejajar" tak ada di tabel prompt sumber | Pakai prompt dari contoh alur |
| 4 | "Lihat Rusuk Tersembunyi" belum didefinisikan | Tombol tampilkan rusuk belakang (garis putus-putus); bisa berbagi mekanisme dengan Transparansi |
| 5 | Kelayakan Transparansi & Bandingkan Model | Konfirmasi tim teknis; tunda bila tak layak |
| 6 | WebAR vs aplikasi native | Prioritaskan WebAR |
| 7 | Kubus/Balok memakai aspek yang sama? | Ya, mekanisme sama untuk semua bangun |

**Ketergantungan:** e-module (tabel catatan, sumber QR/tautan), GeoGebra 3D, 11 model 3D dengan sisi/rusuk/titik sudut dapat dipilih terpisah, teknologi AR terpilih.