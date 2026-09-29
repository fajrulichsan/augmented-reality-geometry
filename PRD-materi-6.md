# PRD (Compact): Modul AR "Ayo Mengeksplorasi dengan AR!" – Volume Kubus, Balok, Prisma (Materi 6)

## 1. Konteks
- Bagian e-module inquiry; AR dipakai pada tahap **pengumpulan data**. Pengolahan & pembuktian dilakukan di tahap berikutnya (e-module).
- User: siswa berkelompok, punya dugaan kelompok tentang volume bangun ruang.
- Peran AR: alat pengamatan & pengukuran (kubus satuan, lapisan, penampang, panjang), **bukan pemberi rumus/kesimpulan**.
- Mekanisme umum sama dengan modul AR Limas dan Skala: highlight, petunjuk on-demand, catat di e-module, bandingkan, periksa kecukupan data.

## 2. Prinsip Wajib
1. AR **tidak** memberi jumlah seluruh kubus satuan, luas penampang, volume, atau rumus. Semua dihitung siswa dan dicatat di e-module.
2. AR hanya menampilkan **data yang benar-benar diperoleh siswa** dan **hanya ukuran yang dipilih siswa**.
3. Siswa memilih bangun & aspek; tidak wajib semua. Alur non-linear.
4. Petunjuk hanya muncul saat **[Butuh Petunjuk?]** ditekan.
5. Nilai ukuran berasal dari **dimensi matematis model** (satuan), bukan dari besar objek di layar.
6. **Data per kondisi dipisah**: data kondisi 2 lapisan tidak dipakai untuk kondisi 3 lapisan. **Pengecualian prisma**: saat hanya panjang berubah, luas penampang **boleh dipakai ulang** karena penampang tidak berubah.
7. **Zoom Tampilan** hanya mengubah tampilan kamera, tidak mengubah kondisi/ukuran model.
8. Pada aspek eksplorasi bebas, siswa tidak dipaksa menghasilkan temuan.
9. Catatan siswa ditulis di **Catatan Hasil Eksplorasi (e-module)**. **[Sudah Dicatat]** hanya konfirmasi lanjut.

## 3. Definisi
- **Kondisi (kubus/balok)** = bangun + jumlah lapisan aktif (1, 2, 3, …); kubus satuan per lapisan tetap saat lapisan diubah.
- **Kondisi (prisma)** = jenis prisma + panjang prisma aktif; bentuk & ukuran penampang sejajar alas tetap.
- **Data untuk Volume** – kubus/balok: banyak kubus satuan per lapisan + jumlah lapisan. Prisma: luas penampang sejajar alas (satuan²) + panjang prisma (satuan).
- Kontrol umum: **↻ Putar | ↔ Geser | +/− Zoom Tampilan | ⌂ Reset Tampilan**.

## 4. Alur Utama
```
Layar Awal [Mulai Eksplorasi AR] → Pilih Bangun Ruang → Deteksi permukaan (markerless)
→ [Tampilkan Model] → Eksplorasi Awal [Lanjutkan Eksplorasi]
→ Menu Aspek (beda untuk Kubus/Balok vs Prisma) → Modul Aspek → Catat
→ {aspek lain | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]}
→ {[Sudah Cukup] → Layar Penutup → e-module
   | [Perlu Data Tambahan] → {[Coba Kondisi Lain] | [Amati Bangun Lain] | [Kembali ke Aspek Pengamatan]}}
```

## 5. Kebutuhan Fungsional

### 5.1 Layar Awal
"Ayo Mengeksplorasi dengan AR!". Teks: amati kubus, balok, prisma dari berbagai arah; kumpulkan informasi untuk dugaan kelompok tentang volume. 💡 "Kumpulkan data yang diperlukan. Kamu akan mengolah dan membuktikannya pada tahap berikutnya." Tombol **[Mulai Eksplorasi AR]**.

### 5.2 Pilih Bangun Ruang
Pilihan: **Kubus, Balok, Prisma** (Segitiga / Segiempat / Segilima / Segi-n). Instruksi: pilih bangun yang ingin diamati; boleh mengamati bangun lain untuk data tambahan. Lihat Open Question #1 (pasangan bangun).

### 5.3 Deteksi Permukaan (markerless)
"Arahkan kamera ke permukaan datar di sekitarmu." → "Permukaan ditemukan. Ketuk untuk menempatkan …" → **[Tampilkan Model]** → model muncul di lingkungan nyata.

### 5.4 Eksplorasi Awal
Model (mis. kubus tersusun dari kubus satuan) + kontrol umum. Instruksi: amati dari berbagai arah sebelum mengumpulkan data. **[Lanjutkan Eksplorasi]**.

### 5.5 Menu Aspek ("Apa yang Ingin Kamu Selidiki?", checkbox, tidak harus semua)
- **Kubus/Balok**: ☐ Susunan Kubus Satuan (K1) · ☐ Jumlah Lapisan (K2) · ☐ Ukuran Bangun (K3) · ☐ Volume Bangun (K4) · ☐ Informasi Lainnya (X)
- **Prisma**: ☐ Penampang Sejajar Alas (P1) · ☐ Panjang Prisma (P2) · ☐ Ukuran Bangun (P3) · ☐ Volume Bangun (P4) · ☐ Informasi Lainnya (X)

---

### 5.6 Modul Kubus/Balok

**K1 Susunan Kubus Satuan**
- Model tetap di lingkungan AR. Instruksi: amati susunan kubus satuan di dalam bangun. **[Tampilkan Kubus Satuan]** → model transparan sebagian, kubus satuan terlihat. Kontrol ↻ ↔ 🔍.
- Prompt: "Apa yang kamu amati dari susunan kubus satuan di dalam bangun?" Jumlah total **tidak** diberikan.
- **[Sorot Satu Lapisan]** → satu lapisan disorot. Prompt: informasi apa dari lapisan yang disorot?
- **[Butuh Petunjuk?]** → "Perhatikan banyak kubus satuan pada satu baris, satu kolom, atau satu lapisan."
- Catat: "Apa yang kamu temukan tentang susunan kubus satuan di dalam bangun?" → **[Sudah Dicatat]** → **[Amati Susunan Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.

**K2 Jumlah Lapisan**
- Pertahankan bangun aktif. Pilihan **1 | 2 | 3 | … lapisan** (atau stepped slider). Model berubah dinamis; kubus satuan per lapisan tetap.
- Prompt: "Perubahan apa yang kamu lihat?" Siswa bebas mengelilingi/melihat dari atas, samping, depan.
- Jika ada kondisi awal & baru: **[Bandingkan dengan Kondisi Sebelumnya]** → dua model **berdampingan**. Prompt: persamaan & perbedaan. Opsional **[Butuh Petunjuk?]** ("Perhatikan susunan kubus satuan pada setiap lapisan dan banyak lapisan pada kedua kondisi.") → **[Kembali ke Kondisi Aktif]**.
- Catat: "Apa yang kamu temukan setelah jumlah lapisan diubah?" → **[Sudah Dicatat]** → **[Coba Jumlah Lapisan Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.

**K3 Ukuran Bangun**
- Prompt "Pilih bagian bangun yang ingin kamu ukur." → **[Mulai Mengukur]** → ketuk bagian → tampil ukuran (kubus: rusuk = 3 satuan; balok: panjang = 5, lebar = 2, tinggi = 1 satuan) **hanya bagian yang dipilih**.
- Setelah tiap ukuran: "Apakah kamu masih memerlukan ukuran bagian lain?" → **[Ukur Bagian Lain]** (bangun & kondisi tetap, pilih bagian lain) | **[Data Ukuran Sudah Cukup]**.
- Dari **[Data Ukuran Sudah Cukup]**: "Periksa Data Ukuranmu" ("Informasi ukuran apa yang kamu peroleh dari bangun ini?") → catat di e-module → **[Sudah Dicatat]** → **[Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.

**K4 Volume Bangun**
1. Pertahankan bangun + kondisi aktif (mis. "Balok — 3 lapisan"), kontrol ↻ ↔ 🔍 ⌂. Instruksi: gunakan informasi susunan kubus satuan yang sudah diperoleh untuk menentukan volume pada kondisi ini. **[Mulai Menyelidiki]**.
2. Sistem memeriksa data **kondisi aktif saja** (kubus satuan per lapisan, jumlah lapisan).
3. **Data lengkap** → "Data Pengamatan Sudah Tersedia": "Kamu sudah memperoleh data tentang susunan kubus satuan pada kondisi ini." Tampilkan kembali data siswa saja (mis. Balok; kubus satuan/lapisan = 6; jumlah lapisan = 3). **[Gunakan Data Sebelumnya]** (→ langkah 6) | **[Amati Kembali]** (amati ulang model aktif).
4. **Data belum ada/kurang** → "Lengkapi Data Pengamatan": "Masih ada informasi yang kamu perlukan. Lengkapi pengamatan terlebih dahulu." Tombol hanya untuk data yang kurang: **[Amati Kubus Satuan pada Satu Lapisan]** dan/atau **[Amati Jumlah Lapisan]**. Siswa tidak keluar dari menu Volume.
   - *Amati Kubus Satuan pada Satu Lapisan*: satu lapisan disorot, bagian lain lebih transparan; dapat dilihat dari berbagai arah. Prompt: "Berapa banyak kubus satuan yang kamu amati pada satu lapisan?" Lalu "Apakah kamu masih memerlukan informasi lain untuk menentukan volume pada kondisi ini?" → jika jumlah lapisan belum ada: **[Amati Jumlah Lapisan]**; jika sudah: **[Data Pengamatan Sudah Cukup]**.
   - *Amati Jumlah Lapisan*: tampilkan seluruh susunan; lapisan dapat ditampilkan satu per satu (Lapisan 1 → 2 → 3 …). Instruksi: amati banyak lapisan. Prompt: "Berapa banyak lapisan yang kamu amati?" AR tidak menampilkan volume. → **[Data Pengamatan Sudah Cukup]**.
5. **[Data Pengamatan Sudah Cukup]** → langkah 6.
6. "Gunakan Data yang Kamu Peroleh": tampilkan model + **hanya data siswa** (mis. Balok — kondisi aktif; kubus satuan/lapisan = 6; jumlah lapisan = 3). Prompt: "Gunakan data yang kamu peroleh untuk menentukan banyak seluruh kubus satuan yang menyusun bangun." Siswa menghitung/catat di e-module. **[Butuh Petunjuk?]** → "Perhatikan banyak kubus satuan pada satu lapisan dan jumlah lapisan yang menyusun bangun."
7. "Hubungkan dengan Volume" / "Amati Kembali Bangun": "Berdasarkan susunan kubus satuan tersebut, berapa volume bangun pada kondisi ini?"
8. "Catat Hasilmu": catat data susunan kubus satuan dan volume di e-module → **[Sudah Dicatat]** → "Data Volume Bangun Sudah Dicatat".
9. Sistem cek jumlah kondisi sebanding (bangun sama): **satu** kondisi → **[Coba Jumlah Lapisan Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**. **≥2** kondisi → tombol kontekstual **[Bandingkan Hasil]** juga tersedia.
10. **[Bandingkan Hasil]**: "Pilih dua hasil pengamatan yang ingin kamu bandingkan" (mis. 1 lapisan ↔ 3 lapisan) → tampil dua model berdampingan + data siswa per kondisi (kubus satuan/lapisan, jumlah lapisan, volume). Prompt: "Bandingkan jumlah lapisan dan volume … Apa yang kamu temukan?" Opsional **[Lihat Kedua Model]** (dua model berdampingan di permukaan yang sama). → Catat Hasil Perbandingan (e-module) → **[Sudah Dicatat]** → **[Bandingkan Hasil Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.

---

### 5.7 Modul Prisma

**P1 Penampang Sejajar Alas**
- Tampilkan prisma (mis. segitiga). Instruksi: amati penampang sejajar alas di beberapa posisi sepanjang prisma. **[Tampilkan Penampang]** → penampang (semi)transparan.
- Siswa menggeser penampang: **Posisi 1 → 2 → 3** atau slider sepanjang prisma; **bentuk penampang tetap terlihat** saat digeser.
- Prompt: "Amati penampang pada beberapa posisi sepanjang prisma. Apa yang kamu temukan?" **[Butuh Petunjuk?]** → "Perhatikan bentuk dan ukuran penampang ketika posisinya digeser sepanjang prisma."
- Catat: "Apa yang kamu temukan tentang penampang sejajar alas pada beberapa posisi …?" → **[Sudah Dicatat]** → **[Amati Posisi Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.

**P2 Panjang Prisma**
- Bentuk & ukuran penampang **dipertahankan**. 💡 "Pada eksplorasi ini, bentuk dan ukuran penampang sejajar alas tetap. Ubah hanya panjang prisma."
- Pilihan slider/stepped 1 ─ 2 ─ 3 ─ … "Pilih panjang prisma yang ingin kamu amati." (mis. 1 → 3): prisma memanjang dinamis. Prompt: "Perubahan apa yang kamu lihat?"
- Setelah ada dua kondisi: **[Bandingkan dengan Kondisi Sebelumnya]** → dua prisma berdampingan; prompt persamaan & perbedaan; **[Butuh Petunjuk?]** ("Perhatikan bentuk dan ukuran penampang sejajar alas serta panjang prisma pada kedua kondisi.") → **[Kembali ke Kondisi Aktif]**.
- Catat: "Apa yang kamu temukan setelah panjang prisma diubah?" → **[Sudah Dicatat]** → **[Coba Panjang Prisma Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.

**P3 Ukuran Bangun (Prisma)**
- Pertahankan prisma + kondisi aktif (mis. "Prisma Segitiga — Panjang Prisma = 2 satuan"). Prompt "Pilih bagian prisma yang ingin kamu ukur." → **[Mulai Mengukur]** → ketuk bagian (sisi alas penampang, tinggi segitiga, atau panjang prisma) → tampil ukuran bagian itu saja (mis. Alas segitiga = 3 satuan; Tinggi segitiga = 2 satuan; Panjang prisma = 3 satuan).
- Setelah tiap ukuran: "Apakah kamu masih memerlukan ukuran bagian lain?" → **[Ukur Bagian Lain]** (prisma + kondisi tetap; "Pilih bagian lain yang ingin kamu ukur"; dapat diulang) | **[Data Ukuran Sudah Cukup]**.
- **[Data Ukuran Sudah Cukup]** → "Periksa Data Ukuranmu": tampil hanya data yang diukur siswa. Prompt: "Informasi ukuran apa yang kamu peroleh dari prisma ini?" → Catat (e-module) → **[Sudah Dicatat]** → "Data Ukuran Prisma Sudah Dicatat" → **[Ukur pada Kondisi Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.
- Jika panjang telah diubah lewat P2, kembali ke P3 mempertahankan kondisi aktif terbaru (mis. panjang = 3).
- Jika ada dua data ukuran sebanding (mis. panjang 1 vs panjang 3): **[Bandingkan Ukuran]** → "Bandingkan Data Ukuran"; prompt "Bandingkan ukuran … Apa yang kamu temukan?"; opsional **[Lihat Kedua Model]** (dua prisma berdampingan) → catat → **[Sudah Dicatat]** → **[Bandingkan Ukuran Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.

**P4 Volume Bangun (Prisma)**
1. Pertahankan prisma + kondisi aktif (mis. "Prisma Segitiga — Panjang prisma = 3 satuan"), kontrol ↻ ↔ 🔍 ⌂. Instruksi: gunakan informasi penampang sejajar alas dan panjang prisma untuk menentukan volume pada kondisi ini. **[Mulai Menyelidiki]**.
2. Sistem memeriksa: **luas penampang sejajar alas (satuan²)** dan **panjang prisma (satuan)** untuk prisma + kondisi aktif.
3. **Lengkap** → "Data Pengamatan Sudah Tersedia" ("Kamu sudah memperoleh data yang diperlukan pada kondisi ini.") + tampil data siswa (mis. Prisma Segitiga; luas penampang = 6 satuan²; panjang = 4 satuan). **[Gunakan Data Sebelumnya]** (→ langkah 6) | **[Amati/Ukur Kembali]**.
4. **Belum lengkap** → "Lengkapi Data Pengamatan" ("Masih ada informasi yang kamu perlukan…"). Tampilkan **hanya** tombol untuk data yang kurang: **[Amati/Ukur Penampang]** dan/atau **[Amati/Ukur Panjang Prisma]**. Siswa tetap di aktivitas Volume.
   - *Amati/Ukur Penampang*: satu penampang disorot, bagian lain semi-transparan. Instruksi: "Amati penampang yang sejajar dengan alas. Pilih bagian yang perlu kamu ukur." **[Mulai Mengukur]** → pilih bagian (mis. alas segitiga, tinggi segitiga) → "Apakah kamu masih memerlukan ukuran bagian lain pada penampang?" → **[Ukur Bagian Lain] | [Data Ukuran Sudah Cukup]** → prompt "Gunakan ukuran yang kamu peroleh untuk menentukan luas penampang sejajar alas" (siswa menghitung di e-module) → luas = hasil siswa → **[Lanjutkan]**.
   - *Amati/Ukur Panjang Prisma*: arah memanjang disorot. "Pilih bagian yang menunjukkan panjang prisma." **[Mulai Mengukur]** → ketuk → tampil ukuran **matematis** (mis. Panjang prisma = 4 satuan). Prompt "Informasi panjang prisma apa yang kamu peroleh?" → **[Lanjutkan]**.
   - Setelah **[Lanjutkan]**, sistem memeriksa ulang kelengkapan. "Periksa Datamu" menampilkan data; jika ada yang kurang **[Lengkapi Data]**; jika lengkap **[Data Pengamatan Sudah Cukup]**.
5. **[Data Pengamatan Sudah Cukup]** → langkah 6.
6. "Gunakan Data yang Kamu Peroleh": tampilkan model + hanya data siswa. Prompt: "Gunakan data yang kamu peroleh untuk menentukan volume prisma pada kondisi ini." (catat di e-module). **[Butuh Petunjuk?]** → "Perhatikan luas penampang sejajar alas dan panjang prisma yang kamu peroleh."
7. "Catat Hasilmu": catat data penampang, panjang, dan volume → **[Sudah Dicatat]** → "Data Volume Bangun Sudah Dicatat".
8. Baru satu kondisi → **[Coba Panjang Prisma Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.
9. **[Coba Panjang Prisma Lain]**: "Pilih Panjang Prisma" + pengingat "Bentuk dan ukuran penampang sejajar alas tetap. Ubah hanya panjang prisma." Stepped slider 1 ─ 2 ─ 3 ─ 4 (mis. 4 → 2): prisma memendek/memanjang dinamis, penampang tetap. Prompt "Amati prisma setelah panjangnya diubah." → **[Lanjutkan Penyelidikan Volume]** → sistem cek ulang: tampil **"Data yang Dapat Digunakan Kembali"** (luas penampang = 6 satuan²) + data baru (panjang = 2 satuan) → **[Gunakan Data Ini] | [Amati/Ukur Kembali]** → **[Data Pengamatan Sudah Cukup]** → Gunakan Data → tentukan volume → Catat Hasilmu → **[Sudah Dicatat]**. Siklus dapat diulang.
10. **[Bandingkan Hasil]** (muncul saat ≥2 data lengkap sebanding untuk prisma yang sama): "Pilih dua hasil pengamatan yang ingin kamu bandingkan" → dua prisma berdampingan di permukaan yang sama, **data siswa di bawah tiap model** (luas penampang, panjang, volume). Prompt: "Bandingkan panjang prisma dan volume … Apa persamaan atau perbedaan yang kamu temukan?" → Catat Hasil Perbandingan → **[Sudah Dicatat]** → **[Bandingkan Hasil Lain] | [Coba Panjang Prisma Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.
11. Periksa Kecukupan (khusus prisma): prompt tentang hubungan penampang sejajar alas, panjang prisma, dan volume. **[Perlu Data Tambahan]** → pilihan adaptif: **[Coba Panjang Prisma Lain] | [Amati/Ukur Penampang Kembali] | [Amati/Ukur Panjang Prisma] | [Pilih Prisma Lain] | [Kembali ke Aspek Pengamatan]**.

---

### 5.8 Informasi Lainnya (X, semua bangun)
"Temukan Informasi Lainnya": "Amati kembali model dan data yang telah kamu peroleh. Adakah informasi lain yang kamu temukan?" + "Jelajahi bagian yang menurutmu dapat melengkapi informasi yang sudah kamu peroleh." **[Mulai Eksplorasi Bebas]**.
- Alat **Kubus/Balok**: [Tampilkan Kubus Satuan] [Sorot Lapisan] [Ubah Jumlah Lapisan] [Pilih Bagian] [Ukur Bagian].
- Alat **Prisma**: [Tampilkan Penampang] [Geser Penampang] [Ubah Panjang Prisma] [Pilih Bagian] [Ukur Bagian]. Siswa juga boleh bergerak fisik mengelilingi model.
- Opsional **[Butuh Petunjuk?]**: Kubus/Balok → "Coba perhatikan susunan kubus satuan, banyak kubus pada setiap lapisan, dan jumlah lapisannya." Prisma → "Coba perhatikan bentuk dan ukuran penampang sejajar alas serta panjang prismanya."
- **[Saya Menemukan Sesuatu]** → "Informasi lain apa yang kamu temukan dari hasil pengamatanmu?" (catat di e-module) → **[Sudah Dicatat]** → **[Lanjut Eksplorasi Bebas] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**. Jika tidak menemukan apa-apa, siswa boleh langsung kembali.

### 5.9 Periksa Kecukupan Data (umum, dari setiap aspek)
Prompt: apakah informasi dari AR cukup untuk melengkapi penyelidikan tentang volume kubus, balok, atau prisma yang diamati? **[Sudah Cukup] | [Perlu Data Tambahan]**.
- **[Perlu Data Tambahan]** → "Data apa yang masih kamu perlukan?" → adaptif: **[Coba Kondisi Lain] | [Amati Bangun Lain] | [Kembali ke Aspek Pengamatan]**.
  - **[Coba Kondisi Lain]**: tetap di aspek relevan, ubah kondisi (lapisan/panjang).
  - **[Kembali ke Aspek Pengamatan]**: ke "Apa yang Ingin Kamu Selidiki?".
  - **[Amati Bangun Lain]**: Pilih Bangun Ruang → pilih Kubus/Balok/Prisma → **gunakan permukaan yang sudah terdeteksi jika masih valid (tidak scan ulang tanpa alasan)** → tempatkan/ganti model → Menu Aspek. Bangun baru **tidak** dipaksa masuk ke Volume Bangun.
- **[Sudah Cukup]** → Layar Penutup.

### 5.10 Layar Penutup
"Data Eksplorasimu Sudah Siap!" Pesan: pastikan hasil pengamatan, pengukuran, dan volume sudah dicatat di Catatan Hasil Eksplorasi; data akan dipakai tahap berikutnya untuk mengolah informasi tentang volume kubus, balok, dan prisma. **[Selesai Eksplorasi AR]** → kembali ke e-module.

## 6. State Sesi
`shape{type, prismBase?}` · `placedModel{pos,rot,viewZoom}` · `condition` (kubus/balok: `layers`; prisma: `length`) · `conditionsVisited[]` · `observations[shape][condition] = {unitsPerLayer?, layers?}` (kubus/balok) · `prismData[prismType][condition] = {crossSectionArea?, length?}` · `measurements[shape][condition][partId]` · `selectedPart` · `comparisonPairs[]` · `volumeRecorded[shape][condition]` (boolean; isi catatan di e-module) · `findingsRecorded[aspect]` · `sufficiency{belum|cukup|perlu}` · `surfaceAnchor{valid}`.
Aturan: data dipisah per bangun + kondisi; `crossSectionArea` prisma boleh dipakai ulang lintas panjang (jenis prisma & penampang sama); `viewZoom` terpisah dari `condition`; ganti bangun tidak menghapus data bangun sebelumnya; ukuran bersumber dari parameter model matematis.

## 7. Non-Fungsional
Mobile + kamera, markerless. Model stabil saat siswa berkeliling; perubahan lapisan/panjang mulus di tempat yang sama. Dua model pembanding berdampingan, tidak tumpang tindih. Transparansi/penyorotan lapisan & penampang jelas dari berbagai sudut. Teks Bahasa Indonesia ramah siswa. Fallback jika permukaan gagal. Selalu ada jalan kembali.

## 8. Kriteria Penerimaan
1. Menu aspek berbeda untuk Kubus/Balok vs Prisma sesuai §5.5.
2. **[Tampilkan Kubus Satuan]** menampilkan kubus satuan (model transparan sebagian) **tanpa** menampilkan jumlah total.
3. Ubah jumlah lapisan: kubus satuan per lapisan tetap; perbandingan menampilkan dua model berdampingan.
4. Ukuran hanya muncul untuk bagian yang dipilih siswa; nilai dari dimensi matematis.
5. K4/P4: cek data hanya untuk kondisi aktif; data kondisi lain tidak dipakai otomatis (kecuali luas penampang prisma saat hanya panjang berubah).
6. Tombol "Lengkapi Data" hanya menampilkan tombol untuk data yang **belum** ada; siswa tidak keluar dari menu Volume.
7. AR tidak pernah menampilkan jumlah seluruh kubus satuan, luas penampang, volume, atau rumus; hanya data yang diperoleh siswa.
8. Saat menggeser penampang (P1), bentuk penampang tetap terlihat.
9. P2/P4 mempertahankan bentuk & ukuran penampang saat panjang diubah.
10. **[Bandingkan Hasil]** hanya muncul jika ≥2 kondisi lengkap sebanding untuk bangun yang sama; data siswa tampil di bawah tiap model.
11. Petunjuk tidak tampil sebelum **[Butuh Petunjuk?]** ditekan.
12. **[Amati Bangun Lain]** memakai ulang permukaan yang masih valid dan masuk ke Menu Aspek (bukan langsung Volume).
13. Zoom Tampilan tidak mengubah kondisi/ukuran.
14. **[Selesai Eksplorasi AR]** kembali ke e-module.

## 9. Asumsi / Open Questions
1. **Pasangan bangun**: judul "Pilih Pasangan Bangun" dan "ketuk untuk menempatkan **kedua** model", tetapi contoh "pilih Kubus → model **balok** muncul sebagai fokus utama" tampak tidak konsisten. Diasumsikan **satu bangun aktif** (yang dipilih siswa); pasangan/perbandingan dua model hanya untuk fitur **Bandingkan**. Mohon konfirmasi.
2. Daftar pilihan Prisma menampilkan "Prisma" dan sub-jenis; diasumsikan Prisma → sub-pilihan alas (Segitiga/Segiempat/Segilima/Segi-n).
3. "GeoGebra menampilkan kubus…" di Eksplorasi Awal diasumsikan typo untuk **AR**.
4. **Bagaimana sistem tahu data "sudah diperoleh"?** (mis. kubus satuan/lapisan, jumlah lapisan, luas penampang hasil siswa). Opsi: (a) input angka siswa di AR, (b) flag selesai setelah aktivitas observasi/ukur. Diasumsikan **(b)** untuk observasi/ukur; nilai hasil hitung (luas penampang, total kubus, volume) tetap di e-module. Perlu keputusan bila AR harus memvalidasi.
5. Nilai satuan awal tiap bangun (kubus rusuk 3, balok 5×2×1, prisma segitiga alas 3/tinggi 2, dsb.) perlu ditetapkan tim konten; rentang lapisan/panjang (1..n) belum ditentukan.
6. Label tombol adaptif Periksa Kecukupan bervariasi ([Coba Kondisi Lain] umum vs [Coba Jumlah Lapisan Lain]/[Coba Panjang Prisma Lain] spesifik). Diasumsikan label spesifik dipakai di dalam modul K/P, label umum di layar Periksa Kecukupan umum.
7. Menu aspek berupa checkbox → aspek terpilih dijalankan berurutan, bisa kembali ke menu.
8. AR tidak mengirim status ke guru/e-module; semua catatan manual oleh siswa.
9. **⌂ Reset Tampilan** hanya mengembalikan posisi/tampilan, tidak menghapus data/kondisi.