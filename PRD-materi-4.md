# PRD (Compact): Modul AR "Ayo Mengeksplorasi dengan AR!" – Luas Permukaan Limas

## 1. Konteks
- Bagian e-module inquiry. Posisi: setelah GeoGebra (jaring-jaring), sebelum **Tahap 4 – Ayo Mengolah Informasi**.
- User: siswa berkelompok, punya dugaan kelompok tentang luas permukaan limas.
- Peran AR: **alat pengumpul data**, bukan pemberi jawaban.

## 2. Prinsip Wajib
1. AR hanya beri **data ukuran**; **tidak pernah** tampilkan rumus, luas alas, luas sisi tegak, atau luas total.
2. Siswa yang memilih limas & aspek; tidak wajib semua. Alur non-linear.
3. Petunjuk hanya muncul jika siswa menekan **[Butuh Petunjuk?]**.
4. Jangan menyimpulkan; pengingat: "Kamu sedang mengumpulkan informasi. Belum saatnya menentukan kesimpulan akhir."
5. Perbedaan visual tidak hanya lewat warna/label (gaya garis, highlight, redup, tanda siku-siku).
6. Catatan siswa ditulis di **tabel Catatan Hasil Eksplorasi (e-module)**, bukan di AR.

## 3. Alur Utama
```
Scan QR/marker/tombol AR → Layar Awal [Mulai Eksplorasi]
→ Pilih Limas → Deteksi permukaan & tempatkan model
→ Eksplorasi awal [Mulai Menyelidiki] → Menu Aspek → Modul Aspek
→ Catat Temuanmu → {[Amati Aspek Lain] → Menu Aspek | [Periksa Kecukupan Data]}
→ {[Sudah Cukup] → Layar Penutup → e-module Tahap 4
   | [Perlu Data Tambahan] → {[Amati Aspek Lain dari limas ini] → Menu Aspek | [Bandingkan dengan Limas Lain] → Pilih Limas}}
```
Limas berikutnya memakai mekanisme yang sama. Selalu sediakan jalan kembali.

## 4. Kebutuhan Fungsional

### 4.1 Layar Awal
Judul "Ayo Mengeksplorasi dengan AR!"; instruksi: lengkapi informasi untuk menyelidiki dugaan kelompok, amati alas, sisi tegak, dan ukuran yang diperlukan; pengingat (prinsip 4); tombol **[Mulai Eksplorasi]**.

### 4.2 Pilih Limas
Pilihan: Limas Segitiga, Segiempat, Segilima, **Segi-n** (sumber tertulis "Prisma Segi-n", diasumsikan typo). Instruksi: tidak harus semua jenis. Pilihan memuat model AR.

### 4.3 Penempatan & Kontrol
- Prompt "Arahkan kamera ke permukaan datar" → setelah terdeteksi "Ketuk permukaan untuk menempatkan limas".
- Kontrol: ↻ Putar, ↔ Geser, +/− Skala, ⌂ Reset. Instruksi: amati dari berbagai arah.

### 4.4 Eksplorasi Awal
Prompt: putar & amati, bagian apa saja pada permukaannya? Ketuk bidang → highlight sementara. Tombol **[Mulai Menyelidiki]**.

### 4.5 Menu Aspek ("Apa yang Ingin Kamu Selidiki?", checkbox, tidak harus semua)
Bentuk alas · Bentuk setiap sisi tegak · Banyak sisi tegak · Ukuran alas · Ukuran pada sisi tegak · Luas alas · Luas setiap sisi tegak · Hubungan alas & sisi tegak · Pola/sifat lainnya.

### 4.6 Modul Aspek
**A1 Bentuk Alas**: identifikasi alas; ketuk alas → highlight; putar agar alas terlihat; prompt "Berbentuk apakah alas?" → **[Catat Temuanmu]**.

**A2 Bentuk Sisi Tegak**: ketuk sisi 1 → highlight → **[Amati Sisi Tegak Lain]** → sisi 2 highlight. **[Bandingkan Sisi Tegak]** muncul hanya setelah ≥2 sisi dipilih → tampilkan "Sisi Tegak 1 ↔ Sisi Tegak 2", prompt persamaan & perbedaan. Tombol kecil **[Butuh Petunjuk?]** → hanya jika ditekan: "Perhatikan bentuk dan ukuran kedua sisi tegak". Lalu **[Catat Temuan]** atau **[Kembali]**.

**A3 Banyak Sisi Tegak**: prompt telusuri sisi yang bertemu di puncak, berapa banyak? Tiap sisi yang diketuk diberi penanda urutan (1→2→3…) + highlight sementara; ketuk ulang tidak menambah hitungan. Total **tidak** diumumkan otomatis.

**A4 Ukuran Alas**: ketuk alas → highlight → **[Pilih Bagian yang Akan Diukur]** → ketuk rusuk → tampil panjang (… cm). Tidak beri luas alas.

**A5 Ukuran pada Sisi Tegak**: pilih sisi → sisi terpilih highlight, lainnya redup. Petunjuk "Klik bagian yang ingin kamu ukur" dengan:
- **[Ukur Alas Segitiga]** → sorot ruas alas + "Panjang alas segitiga = … cm"
- **[Ukur Tinggi Segitiga]** → garis tinggi di bidang sisi + **tanda siku-siku** + "Tinggi segitiga pada sisi tegak = … cm"

Setelah keduanya: prompt "Bagaimana kedua ukuran dapat membantu menentukan luas sisi tegak?" Tombol: **[Amati Sisi Tegak Lain] | [Bandingkan Tinggi] | [Kembali ke Aspek Pengamatan]**.
**[Bandingkan Tinggi]** (opsional): tampilkan *tinggi limas* (dari puncak, tegak lurus alas) dan *tinggi segitiga sisi tegak* dengan **gaya garis berbeda**. Prompt: apakah keduanya sama? Jelaskan berdasarkan posisi ruas.

**A6 Luas Alas**: prompt amati bentuk & ukuran yang sudah diperoleh; AR tampilkan ukuran rusuk relevan; prompt "Bagaimana menentukan luas alas?" (tanpa nilai luas).

**A7 Luas Sisi Tegak**: pilih sisi (highlight + lainnya redup) → cek `lateralMeasurements[faceId]`:
- **Ada** → "Data Ukuran Sudah Tersedia": **[Gunakan Data Sebelumnya]** (tampilkan ulang alas & tinggi segitiga) | **[Ukur Kembali]** (→ Ukur Alas/Tinggi Segitiga).
- **Belum** → "Data Ukuran Belum Tersedia": **[Ukur Sisi Ini]** → "Klik bagian yang ingin kamu ukur" → **[Ukur Alas Segitiga] | [Ukur Tinggi Segitiga]** (perilaku sama seperti A5).

Setelah data ada: prompt "Berdasarkan bentuk dan ukuran, bagaimana menentukan luasnya?" AR **tidak** beri nilai luas; siswa hitung & catat di e-module → **[Catat Temuan]** → **[Pilih Sisi Tegak Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**. Sisi lain diulang: sisi n → ukuran → luas.

**A8 Hubungan Alas & Sisi Tegak**: prompt bagian apa yang membentuk permukaan; ketuk alas (highlight 1) dan sisi tegak (highlight 2, gaya beda); prompt informasi tentang alas & sisi tegak sebagai bagian permukaan; prompt catat hubungan untuk tahap berikutnya.

**A9 Pola Lain**: prompt pola/informasi lain; masuk **mode eksplorasi bebas** (kontrol model aktif, tanpa alur terpandu).

### 4.7 Jembatan GeoGebra
**[Bandingkan dengan GeoGebra]** muncul setelah minimal: 1 bagian alas diamati **dan** 1 sisi tegak/ukuran sisi tegak diamati. Prompt berurutan: bandingkan model AR dengan jaring-jaring GeoGebra → temukan alas & sisi tegak yang bersesuaian → "Apa hubungan yang kamu temukan?"

### 4.8 Catat Temuanmu
Setelah tiap aspek selesai: "Apa yang kamu temukan dari bangun ini?" + instruksi catat di tabel Catatan Hasil Eksplorasi (e-module). Tombol **[Amati Aspek Lain] | [Periksa Kecukupan Data]**.

### 4.9 Periksa Kecukupan Data
Prompt: apakah informasi sudah cukup untuk menyelidiki kaitan alas & sisi tegak dengan luas seluruh permukaan? **[Sudah Cukup]** → layar penutup. **[Perlu Data Tambahan]** → "Informasi apa yang masih kamu perlukan?" → **[Amati Aspek Lain dari limas ini]** (Menu Aspek) | **[Bandingkan dengan Limas Lain]** (Pilih Limas).

### 4.10 Bandingkan Dua Limas
Contoh Segitiga ↔ Segiempat. Prompt: persamaan & perbedaan alas dan sisi tegak; bagian apa yang sama-sama perlu diperhatikan saat menyelidiki luas permukaan keduanya.

### 4.11 Layar Penutup
"Data Eksplorasimu Sudah Siap!": telah mengumpulkan informasi alas, sisi tegak, ukuran, luas bagian-bagian limas via GeoGebra & AR; pastikan sudah dicatat di e-module; gunakan di tahap berikutnya. **[Selesai Eksplorasi AR]** → kembali ke e-module **Tahap 4 – Ayo Mengolah Informasi**.

## 5. State Sesi (per jenis limas)
`pyramidType` · `placedModel{pos,rot,scale}` · `observedAspects[]` · `selectedFaces[{id,order}]` · `baseEdgeMeasurements{}` · `lateralMeasurements[faceId]{baseLength?,triangleHeight?}` · `findingsRecorded[aspect]` (boolean saja; isi catatan di e-module) · `sufficiency{belum|cukup|perlu}`.
Aturan: data ukuran dipertahankan selama sesi (dipakai cek A7); data antar limas tidak tercampur; nilai ukuran berasal dari parameter model 3D (satu sumber kebenaran).

## 6. Non-Fungsional
Mobile + kamera, akses via QR/marker/tombol. Tracking stabil + Reset. Interaksi mulus di perangkat menengah. Teks Bahasa Indonesia ramah siswa. Fallback jika permukaan/kamera gagal. Jalan kembali selalu tersedia.

## 7. Kriteria Penerimaan
1. Model dapat diputar/geser/skala/reset.
2. **[Bandingkan Sisi Tegak]** tidak muncul sebelum 2 sisi dipilih.
3. Petunjuk A2 tidak tampil sebelum **[Butuh Petunjuk?]** ditekan.
4. A3: ketuk ulang sisi yang sama tidak menambah hitungan.
5. A5: ukur tinggi segitiga menampilkan garis tinggi + tanda siku-siku + nilai.
6. A7: cabang "Sudah Tersedia" vs "Belum Tersedia" sesuai data yang ada.
7. AR tidak pernah menampilkan nilai luas/rumus di mana pun.
8. **[Bandingkan Tinggi]** memakai gaya garis berbeda untuk dua ruas.
9. **[Bandingkan dengan GeoGebra]** hanya muncul setelah syarat 4.7 terpenuhi.
10. Pindah ke limas lain tidak menghapus data limas sebelumnya.
11. **[Selesai Eksplorasi AR]** kembali ke Tahap 4 e-module.

## 8. Asumsi / Open Questions
1. "Prisma Segi-n" → **Limas Segi-n** (konfirmasi).
2. Checkbox multi-pilih → aspek terpilih dijalankan berurutan, tetap bisa kembali ke menu.
3. Ukuran alas segilima/segi-n (rusuk saja, apotema?) → perlu dirumuskan tim konten.
4. Nilai ukuran tetap per model (tidak diacak).
5. AR tidak menyimpan/mengirim status ke guru/e-module.
6. **[Kembali]** di A2 → Menu Aspek; **[Bandingkan Tinggi]** hanya dari A5.