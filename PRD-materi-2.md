# PRD: Eksplorasi dengan AR (Jaring-Jaring & Pelipatan Bangun Ruang)

**Status:** Draft v0.1 | **Platform:** AR via QR Code/tombol dari e-module | **Pendamping:** Eksplorasi GeoGebra 3D (`prd-geogebra.md`)
**Catatan:** dokumen ini **menggantikan `prd.md`** (versi awal AR yang berfokus pada pengamatan model 3D utuh).

## 1. Ringkasan & Tujuan

Siswa mengamati **jaring-jaring 2D** bangun ruang di lingkungan nyata, lalu **melipatnya menjadi 3D** untuk **melengkapi informasi yang belum didapat dari GeoGebra** dalam menyelidiki dugaan kelompok. Fokus: perubahan posisi sisi, sisi-sisi yang bertemu, dan proses pelipatan, sambil berjalan mengelilingi model.

**Prinsip utama**
- Eksploratif: prompt berupa pertanyaan, **tanpa jawaban** dan **tanpa umpan balik benar/salah**.
- Pengingat ke siswa: *"💡 Ingat! Kamu sedang mengumpulkan informasi, belum menentukan kesimpulan akhir."*
- Siswa memilih sendiri bangun dan aspek; tidak wajib mengamati semuanya.
- Siswa perlu mengamati **posisi awal sisi** sebelum dilipat agar dapat dibandingkan dengan posisi akhir.
- Hasil dicatat di kolom **"Hasil Eksplorasi Augmented Reality (AR)"** pada tabel e-module, bukan di AR.
- Mekanisme identik untuk semua bangun.

**Di luar cakupan:** kuis/penilaian, validasi otomatis, form catatan di AR, sesi multi-perangkat, bangun sisi lengkung, dasbor guru.

## 2. Alur Utama

```
Tampilan Awal → Pilih Bangun → Deteksi Permukaan & Tempatkan Jaring-Jaring 2D
→ Amati Jaring-Jaring (sebelum dilipat) → [Mulai Lipat] → Pelipatan 2D→3D
→ Apa yang Ingin Kamu Selidiki? → Eksplorasi aspek → Catat Temuan (e-module)
   ├ [Amati Aspek Lain] → menu aspek
   └ [Periksa Kecukupan Data]
        ├ Sudah Cukup → Eksplorasimu Sudah Lengkap → [Selesai Eksplorasi AR] → e-module
        └ Perlu Data Tambahan → [Amati Aspek Lain] / [Bandingkan dengan Bangun Lain] → menu bangun
(Bandingkan Temuan: opsional, setelah ≥ 2 hasil pengamatan pada aspek yang sama)
```

## 3. Kebutuhan Fungsional

P0 = wajib, P1 = disarankan, P2 = jika memungkinkan.

| ID | Tahap | Kebutuhan | Prio |
|---|---|---|---|
| A1 | Tampilan awal | Judul **"Ayo Bereksplorasi dengan AR!"**; *"Ayo lengkapi informasi untuk menyelidiki dugaan kelompokmu!"*; instruksi *"Amati jaring-jaring dan proses terbentuknya bangun ruang secara langsung melalui Augmented Reality. Perhatikan perubahan posisi sisi, sisi-sisi yang bertemu, dan proses pelipatannya untuk memperoleh informasi yang kamu perlukan."* + pengingat 💡. Tombol **[Mulai Eksplorasi AR]** (minta izin kamera). | P0 |
| A2 | Pilih bangun | Judul *"Pilih Bangun Ruang yang Ingin Kamu Amati"*; menu (lihat 4); instruksi *"Pilih bangun yang kamu perlukan untuk melengkapi informasi hasil eksplorasimu. Kamu tidak harus mengamati semua bangun."* Contoh: Kubus → jaring-jaring kubus 2D muncul di permukaan nyata. | P0 |
| A3 | Deteksi & penempatan | Prompt *"Arahkan kamera ke permukaan datar."* → setelah terdeteksi *"Ketuk permukaan untuk menempatkan model."* Jaring-jaring muncul di meja/lantai yang dipilih. Kontrol: **↻ Putar tampilan, 🔍 Perbesar/perkecil, 👆 Geser model, 👁 Lihat dari berbagai arah**. Tombol **[Lanjut]**. | P0 |
| A4 | Amati jaring-jaring | Instruksi *"Amati jaring-jaring sebelum dilipat. Bergeraklah mengelilingi model dan perhatikan posisi setiap sisinya."* Siswa dapat mendekat/menjauh, melihat dari atas/samping, memilih sisi, dan memberi **highlight sementara**. Tombol **[Mulai Lipat]**. | P0 |
| A5 | Pelipatan 2D→3D | Animasi bertahap: jaring-jaring 2D → sisi terangkat → beberapa sisi bertemu → seluruh sisi terlipat → bangun 3D. Kontrol **[▶ Lipat] [⏸ Jeda] [↶ Buka Kembali] [↻ Ulangi]** + **slider 0% ─●─ 100%** (0% = terbuka penuh, 100% = terbentuk penuh) agar siswa dapat berhenti di posisi tertentu. Siswa dapat bergerak mengelilingi model selama proses. | P0 (slider P1) |
| A6 | Pilih aspek | *"Apa yang Ingin Kamu Selidiki?"* + *"Pilih informasi yang kamu perlukan untuk melengkapi penyelidikan dugaan kelompokmu. Kamu tidak harus mengamati semuanya."* Checkbox (lihat 4). | P0 |
| A7 | Eksplorasi aspek | Alur per aspek pada bagian 5. | P0 |
| A8 | Catat temuan | Judul **"Catat Temuanmu"**; *"Apa informasi penting yang kamu peroleh dari pengamatan AR ini? Catat hasil pengamatanmu pada kolom Hasil Eksplorasi Augmented Reality (AR) pada tabel di e-module."* Tombol **[Amati Aspek Lain]** / **[Periksa Kecukupan Data]**. | P0 |
| A9 | Kecukupan data | **"Apakah Informasimu Sudah Cukup?"** *"Apakah informasi dari eksplorasi AR sudah cukup untuk melengkapi data yang diperlukan dalam menyelidiki dugaan kelompokmu?"* **[Sudah Cukup] \| [Perlu Data Tambahan]**. Jika perlu: *"Data apa yang masih kamu perlukan?"* → **[Amati Aspek Lain]** (menu aspek) / **[Bandingkan dengan Bangun Lain]** (menu bangun). | P0 |
| A10 | Bangun lain | Memilih bangun lain (mis. Kubus → Prisma Segitiga): model lama diganti, mekanisme sama (jaring-jaring 2D → amati posisi awal → lipat → aspek → amati → catat → cek kecukupan). | P0 |
| A11 | Bandingkan Temuan | Tombol **[Bandingkan Temuan]** muncul setelah **≥ 2 hasil pengamatan relevan pada aspek yang sama**. Judul **"Bandingkan Hasil Pengamatanmu"**; *"Amati kembali kedua hasil pengamatan yang telah kamu peroleh berdasarkan aspek yang sedang kamu selidiki."* AR menampilkan kembali dua model yang pernah diamati (mis. Kubus ↔ Balok); siswa dapat mengulang pelipatan. Prompt *"Apa persamaan dan perbedaan yang kamu temukan berdasarkan aspek yang sedang kamu selidiki?"* Opsional **[Butuh Petunjuk?]** (disesuaikan aspek). **[Catat Hasil Perbandingan]** → *"Catat persamaan dan perbedaan yang kamu temukan pada kolom Hasil Eksplorasi Augmented Reality (AR) di e-module."* Lalu **[Kembali ke Aspek Pengamatan] \| [Periksa Kecukupan Data]**. | P1 |
| A12 | Selesai | Jika Sudah Cukup: judul **"Eksplorasimu Sudah Lengkap"**; *"Kamu telah memperoleh informasi tambahan melalui Augmented Reality. Pastikan hasil pengamatan GeoGebra 3D dan AR telah dicatat pada Tabel Hasil Pengamatan di e-module. Gunakan data tersebut pada tahap berikutnya untuk mengolah informasi dan menyelidiki pola hubungan antara bangun ruang dan jaring-jaringnya."* Tombol **[Selesai Eksplorasi AR]** → kembali ke e-module. | P0 |

## 4. Konten

**Menu bangun:** Kubus · Balok · Prisma (Segitiga, Segiempat, Segilima, Segi-n) · Limas (Segitiga, Segiempat, Segilima, Segi-n). "Prisma" dan "Limas" adalah grup menu.

**Aspek (5):** Hubungan antar sisi · Posisi sisi · Proses lipatan · Hasil ketika jaring-jaring dilipat · Pola/sifat lainnya.

## 5. Alur Rinci per Aspek

Semua aspek berakhir dengan **[Catat Temuan]** dan **[Apa yang Ingin Kamu Selidiki]** (kembali ke menu aspek) → lalu layar Catat Temuanmu (A8).

| Aspek | Alur & prompt |
|---|---|
| **Hubungan antar sisi** | *"Selidiki Hubungan Antar Sisi. Pilih dua sisi yang ingin kamu amati."* Siswa memilih dua sisi (mis. A dan B), keduanya di-highlight → *"Amati posisi kedua sisi sebelum dilipat."* → **[Mulai Lipat]** → sebelum → selama → setelah dilipat → *"Amati kedua sisi sebelum, selama, dan setelah dilipat. Apa hubungan yang kamu temukan?"* |
| **Posisi sisi** | **"Selidiki Posisi Sisi"** → *"Pilih satu sisi yang ingin kamu ikuti selama proses pelipatan."* → sisi di-highlight → **[Mulai Lipat]** → **highlight tetap melekat pada sisi yang sama dari 2D hingga 3D** → *"Bagaimana posisi sisi tersebut berubah sebelum dan setelah dilipat?"* |
| **Proses lipatan** | **"Selidiki Proses Lipatan"** → *"Amati bagaimana sisi-sisi bergerak ketika jaring-jaring dilipat."* → **[Mulai Lipat]** → slider 0% → 25% → 50% → 75% → 100%, siswa boleh mengelilingi model → *"Perubahan apa yang kamu temukan selama jaring-jaring berubah menjadi bangun ruang?"* |
| **Hasil ketika jaring-jaring dilipat** | **"Hasil Ketika Jaring-Jaring Dilipat"** → amati jaring-jaring di lingkungan nyata → prediksi *"Menurutmu, apa yang akan terjadi ketika seluruh sisinya dilipat?"* → **[Mulai Lipat]** (slider 0-100%, boleh mengelilingi model) → setelah posisi akhir *"Amati posisi akhir setiap sisi. Apa yang kamu temukan setelah seluruh sisi dilipat?"* → opsional **[Butuh Petunjuk?]** → *"Perhatikan posisi setiap sisi. Apakah seluruh sisi menempati posisinya dengan tepat? Adakah sisi yang saling bertumpuk atau bagian yang belum tertutup?"* |
| **Pola/sifat lainnya** | *"Adakah informasi atau pola lain yang kamu temukan selama mengamati dan melipat jaring-jaring ini?"* (eksplorasi bebas) |

## 6. Non-Fungsional

- **Akses:** via QR Code/tombol; WebAR/WebXR tanpa instalasi jika memungkinkan; Android & iOS berkemampuan AR; daftar perangkat minimum perlu ditetapkan.
- **Performa:** model termuat < 3 dtk (4G); animasi lipat ≥ 30 FPS di perangkat menengah; tracking stabil saat siswa berpindah posisi.
- **UI:** Bahasa Indonesia, teks singkat; target sentuh ≥ 44 px; highlight tidak hanya bergantung warna; portrait & landscape.
- **Privasi:** kamera hanya untuk AR; tanpa rekam/unggah; tanpa data pribadi wajib.

**Error state**
- Izin kamera ditolak → penjelasan + cara mengaktifkan.
- Perangkat tidak mendukung AR → pesan jelas + arahkan ke GeoGebra 3D.
- Permukaan tak terdeteksi → ulang *"Arahkan kamera ke permukaan datar"* + tips pencahayaan.
- Tracking hilang → arahkan kamera kembali; pulihkan posisi model dan progres slider.
- Ganti bangun di tengah eksplorasi → model diganti, kembali ke jaring-jaring 2D bangun baru, highlight direset.
- Pilihan sisi belum lengkap (mis. baru 1 dari 2 sisi) → tombol **[Mulai Lipat]** nonaktif.

## 7. Metrik & Kriteria Penerimaan

**Metrik (usulan):** penempatan jaring-jaring pertama berhasil ≥ 90% · sesi menjalankan pelipatan ≥ 85% · sesi dengan gerakan mengelilingi/berpindah sudut pandang ≥ 70% · sesi sampai "Selesai Eksplorasi AR" ≥ 70% · kepuasan ≥ 4/5.

**Kriteria penerimaan**
1. Siswa dapat memilih bangun, menempatkan jaring-jaring 2D di permukaan, dan mengamatinya sebelum dilipat.
2. Animasi 2D→3D berjalan bertahap; dapat dijeda, dibuka kembali, diulang, dan dikontrol slider.
3. Highlight sisi tetap melekat pada sisi yang sama selama pelipatan.
4. Setiap aspek menampilkan prompt sesuai bagian 5; **tidak ada** jawaban atau label benar/salah.
5. Alur *Perlu Data Tambahan → aspek lain / bangun lain* berfungsi; model lama diganti.
6. **[Bandingkan Temuan]** hanya muncul setelah ≥ 2 hasil pengamatan pada aspek yang sama.
7. *Sudah Cukup* menampilkan layar penutup dan mengembalikan siswa ke e-module.
8. Siswa tidak dipaksa mengamati semua bangun atau semua aspek.

## 8. Pertanyaan Terbuka & Asumsi

| # | Isu | Usulan sementara |
|---|---|---|
| 1 | Di GeoGebra ada banyak **susunan jaring-jaring** per bangun; di AR hanya satu jaring-jaring yang disebut. Susunan mana yang ditampilkan? | Satu jaring-jaring standar per bangun (P0); pilihan susunan lain sebagai P2 |
| 2 | Tombol awal di sumber: "[Mulai Eksplorasi AR]" vs "[Mulai Eksplorasi]" | Pakai "[Mulai Eksplorasi AR]" |
| 3 | Petunjuk pada **[Butuh Petunjuk?]** hanya didefinisikan untuk aspek Hasil lipatan; untuk Bandingkan Temuan "disesuaikan aspek" tanpa teks | Tim konten menulis teks petunjuk per aspek |
| 4 | **Bandingkan Temuan:** dua model yang pernah diamati ditampilkan berdampingan atau bergantian? Perlu riwayat bangun yang sudah diamati | Berdampingan bila layak (P1); bergantian sebagai cadangan |
| 5 | Aspek "Pola/sifat lainnya" hanya punya prompt | Eksplorasi bebas: putar, pindah, lipat/buka ulang, highlight |
| 6 | Cara siswa "memilih dua sisi" dan sisi mana yang disebut "Sisi A dan B" (label otomatis?) | Label huruf otomatis pada sisi saat dipilih |
| 7 | Tombol **[Apa yang Ingin Kamu Selidiki]** vs **[Amati Aspek Lain]**: keduanya kembali ke menu aspek | Anggap setara; samakan label |
| 8 | Prisma/Limas Segi-n: cara menentukan *n* | Input/slider n (mis. 3-12), model parametrik |
| 9 | WebAR vs aplikasi native | Prioritaskan WebAR |

**Ketergantungan:** e-module (kolom "Hasil Eksplorasi AR", sumber QR/tombol), GeoGebra 3D (alur sebelumnya), aset 3D untuk 11 bangun (jaring-jaring 2D, animasi lipat dengan sisi dapat dipilih & di-highlight), teknologi AR terpilih.