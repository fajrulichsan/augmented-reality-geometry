# PRD (Compact): Modul AR "Ayo Mengeksplorasi dengan AR!" – Hubungan Volume Prisma & Limas (Materi 7)

## 1. Konteks
- Bagian e-module inquiry; AR dipakai pada tahap **pengumpulan data**. Pengolahan & pembuktian dilakukan di tahap berikutnya (e-module).
- User: siswa berkelompok, punya dugaan kelompok tentang hubungan volume **prisma dan limas yang bentuk alas, luas alas, dan tingginya sama**.
- Peran AR: alat pengamatan fenomena (pasangan model, ubah variabel terkontrol, visualisasi pengisian), **bukan pemberi rumus/kesimpulan**.
- Mekanisme umum sama dengan modul AR materi 4–6: highlight, petunjuk on-demand, catat di e-module, bandingkan, periksa kecukupan data.

## 2. Prinsip Wajib
1. AR **tidak** menyatakan hubungan volume, perbandingan (mis. berapa kali), rumus, atau generalisasi apa pun. Visualisasi pengisian adalah **pengamatan fenomena**.
2. Prisma dan limas selalu **berpasangan**: bentuk alas sama, luas alas sama, tinggi sama, dan **bersesuaian sepanjang eksplorasi**.
3. **Satu variabel berubah per percobaan.** Ubah luas alas → tinggi dikunci. Ubah tinggi → luas alas dikunci. Kunci ditampilkan sebagai pengingat.
4. Perubahan pada pasangan terjadi **bersamaan** pada prisma dan limas.
5. Kedua model ditempatkan **berdampingan**, tidak ditumpuk. Perbandingan kondisi juga berdampingan dengan orientasi sama.
6. Siswa memilih pasangan & aspek; tidak wajib semua. Alur non-linear.
7. Petunjuk hanya muncul saat **[Butuh Petunjuk?]** ditekan. Nilai numerik (mis. tinggi) hanya muncul jika siswa memintanya (**[Tampilkan Ukuran Tinggi]**).
8. Nilai ukuran berasal dari **dimensi matematis** model. **Zoom Tampilan** hanya mengubah tampilan layar, bukan ukuran matematis (keterangan ini tampil di UI).
9. AR hanya menampilkan **data yang benar-benar diperoleh siswa** pada fitur perbandingan.
10. Catatan siswa ditulis di **e-module**. **[Sudah Dicatat]** hanya konfirmasi lanjut.

## 3. Alur Utama
```
Layar Awal [Mulai Eksplorasi AR] → Pilih Pasangan Bangun (Segitiga|Segiempat|Segilima|Segi-n)
→ Deteksi permukaan (markerless) → [Ketuk untuk Menempatkan Model] (prisma & limas berdampingan)
→ Amati Pasangan Model [Lanjutkan Eksplorasi] → Menu Aspek → Modul Aspek → Catat
→ {aspek lain | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]}
→ {[Sudah Cukup] → Layar Penutup → e-module
   | [Perlu Data Tambahan] → tombol adaptif sesuai aktivitas terakhir}
```

## 4. Kebutuhan Fungsional

### 4.1 Layar Awal
"Ayo Mengeksplorasi dengan AR!" Teks: amati satu prisma dan satu limas dengan bentuk serta luas alas dan tinggi yang sama; jelajahi kedua model dari berbagai arah; kumpulkan informasi untuk dugaan kelompok. 💡 "Kumpulkan data yang diperlukan. Kamu akan mengolah dan membuktikannya pada tahap berikutnya." Tombol **[Mulai Eksplorasi AR]**.

### 4.2 Pilih Pasangan Bangun
Pilihan berdasarkan bentuk alas: **[Segitiga] [Segiempat] [Segilima] [Segi-n]**. Memilih (mis. Segiempat) menyiapkan "Prisma Segiempat ↔ Limas Segiempat". Instruksi: pilih pasangan; keduanya memakai bentuk alas dan tinggi yang sama.

### 4.3 Deteksi Permukaan (markerless)
"Arahkan kamera ke permukaan datar di sekitarmu." → "Permukaan ditemukan. Ketuk untuk menempatkan kedua model." → **[Ketuk untuk Menempatkan Model]** → prisma dan limas muncul **berdampingan** di bidang yang sama (tidak ditumpuk).

### 4.4 Amati Pasangan Model
Instruksi: amati dari berbagai arah; perhatikan bentuk alas, posisi alas, dan tinggi. Kontrol **↻ Putar | ↔ Geser | 🔍 Zoom Tampilan | ⌂ Reset Tampilan**. Keterangan: "Zoom Tampilan hanya mengubah tampilan di layar, bukan ukuran matematis bangun." Siswa boleh bergerak fisik mengelilingi model. **[Lanjutkan Eksplorasi]**.

### 4.5 Menu Aspek ("Apa yang Ingin Kamu Selidiki?", checkbox, tidak harus semua)
☐ Kondisi Awal Kedua Bangun (**A1**) · ☐ Perubahan Luas Alas (**A2**) · ☐ Perubahan Tinggi (**A3**) · ☐ Visualisasi Pengisian (**A4**) · ☐ Informasi Lainnya (**A5**). Instruksi: pilih informasi untuk menyelidiki hubungan volume prisma dan limas yang bentuk serta luas alas dan tingginya sama.

---

### 4.6 A1 – Kondisi Awal Kedua Bangun
- Tampilkan pasangan pada kondisi aktif. Prompt "Bagian apa yang ingin kamu amati pada kedua bangun?" → **[Amati Alas] | [Amati Tinggi] | [Amati Posisi Kedua Bangun]**.
- **[Amati Alas]**: kedua alas disorot **dengan warna yang sama**. Prompt: "Amati bentuk dan ukuran alas kedua bangun. Apa yang kamu temukan?" Opsional **[Lihat dari Atas]** (kamera diarahkan agar kedua alas mudah dibandingkan).
- **[Amati Tinggi]**: tampil garis tinggi tegak kedua bangun. Prompt: "Amati tinggi prisma dan limas. Apa yang kamu temukan?" Jika tinggi numerik tersedia: **[Tampilkan Ukuran Tinggi]** → baru nilai tampil.
- **[Amati Posisi Kedua Bangun]**: prompt "Amati kembali dari berbagai arah. Apa yang kamu perhatikan tentang posisi alas, puncak, dan bagian atas kedua bangun?"
- Catat: "Catat informasi tentang alas dan tinggi kedua bangun … pada e-module." → **[Sudah Dicatat]** → **[Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.

### 4.7 A2 – Perubahan Luas Alas
- **Kunci: tinggi tetap.** Pengingat: "Pada eksplorasi ini tinggi kedua bangun tetap. Ubah hanya luas alasnya."
- Kontrol **[Perkecil Alas] | [Perbesar Alas]** atau stepped slider. Perubahan **serentak** pada prisma dan limas (alas tetap bersesuaian); model berubah proporsional pada arah alas, tinggi tetap.
- Prompt: "Amati kedua bangun setelah luas alasnya diubah. Perubahan apa yang kamu lihat?" Siswa dapat melihat dari atas/samping, mengelilingi model, **[Sorot Alas]**, menampilkan tinggi.
- Opsional **[Bandingkan dengan Kondisi Sebelumnya]** → "Kondisi Sebelum ↔ Kondisi Sesudah" dengan **orientasi sama**. Prompt: persamaan & perbedaan.
- Catat: "Apa yang kamu temukan setelah luas alas kedua bangun diubah sementara tingginya tetap?" → **[Sudah Dicatat]** → **[Coba Luas Alas Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.
- **[Coba Luas Alas Lain]**: tetap di A2, tinggi tetap → pilih ukuran alas lain → amati → catat.

### 4.8 A3 – Perubahan Tinggi
- **Kunci: luas alas tetap.** Pengingat: "Pada eksplorasi ini luas alas kedua bangun tetap. Ubah hanya tingginya."
- Kontrol **[Kurangi Tinggi] | [Tambah Tinggi]** atau stepped slider. Prisma dan limas berubah tinggi **bersamaan**.
- Prompt: "Amati kedua bangun setelah tingginya diubah. Perubahan apa yang kamu lihat?" Alat: **↻ Putar | 🔍 Zoom Tampilan | [Sorot Alas] | [Tampilkan Tinggi]**.
- Opsional **[Bandingkan dengan Kondisi Sebelumnya]** → sebelum & sesudah berdampingan; prompt persamaan & perbedaan.
- Catat: "Apa yang kamu temukan setelah tinggi kedua bangun diubah sementara luas alasnya tetap?" → **[Sudah Dicatat]** → **[Coba Tinggi Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.

### 4.9 A4 – Visualisasi Pengisian
1. **Pra-cek sistem** sebelum animasi: bentuk alas prisma = limas, luas alas prisma = limas, tinggi prisma = limas. Pengingat: "Pastikan alas dan tinggi kedua bangun tetap bersesuaian selama pengamatan." Tombol **[Mulai Visualisasi]**.
2. **Animasi**: isi **satu limas** dipindahkan/dituangkan ke dalam prisma (limas terisi → isi bergerak ke prisma → isi menempati sebagian ruang prisma). Kontrol **▶ Mulai | ⏸ Jeda | ↶ Ulangi**.
3. Setelah satu pengisian: "Amati bagian ruang prisma yang telah terisi." **[Isi Lagi]** mengulang dengan isi satu limas yang **identik**. Indikator sederhana: **"Pengisian yang telah diamati: 1, 2, 3, …"** sesuai tindakan siswa.
4. Setelah prisma terlihat penuh: "Apa yang kamu amati setelah proses pengisian dilakukan beberapa kali?" (tetap pengamatan fenomena; AR **tidak** menyatakan jumlah/hubungan).
5. Catat: "Catat hasil pengamatan dari visualisasi pengisian pada e-module." → **[Sudah Dicatat]** → **[Coba Kondisi Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.
6. **[Coba Kondisi Lain]** → "Apa yang ingin kamu ubah?" → **[Ubah Luas Alas] | [Ubah Tinggi]** (**hanya satu** variabel per percobaan). Ubah Luas Alas → tinggi dikunci, alas prisma & limas berubah bersama → visualisasi ulang → catat. Ubah Tinggi → luas alas dikunci, tinggi keduanya berubah bersama → visualisasi ulang → catat. Siswa mengumpulkan beberapa percobaan tanpa generalisasi dari AR.
7. Jika ada **≥2 hasil visualisasi pada kondisi berbeda**: **[Bandingkan Hasil Pengamatan]** → "Bandingkan Hasil Visualisasi" menampilkan data yang **benar-benar diperoleh siswa** per percobaan (Luas alas = …, Tinggi = …, Banyak pengisian yang diamati = …). Prompt: "Bandingkan hasil pengamatan pada kedua kondisi tersebut. Apa persamaan dan perbedaan yang kamu temukan?"
8. "Catat Hasil Perbandinganmu" (e-module) → **[Sudah Dicatat]** → **[Bandingkan Hasil Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.

### 4.10 A5 – Informasi Lainnya
- Prompt: "Amati kembali prisma dan limas serta hasil eksplorasi yang sudah kamu peroleh. Adakah informasi lain yang ingin kamu selidiki?" + "Jelajahi bagian yang menurutmu dapat melengkapi informasi yang sudah kamu peroleh." **[Mulai Eksplorasi Bebas]**.
- Alat: **[Putar Model] [Sorot Alas] [Tampilkan Tinggi] [Ubah Luas Alas] [Ubah Tinggi] [Visualisasi Pengisian] [Reset Tampilan]**. Tetap berlaku **satu variabel per percobaan**.
- Prompt kontekstual: sorot alas → "Apa yang kamu perhatikan pada alas kedua bangun?"; ubah luas alas → "Setelah luas alas diubah, informasi apa yang kamu peroleh?"; ubah tinggi → "Setelah tinggi diubah, informasi apa yang kamu peroleh?"; visualisasi → "Apa yang kamu amati selama proses pengisian?"
- **[Butuh Petunjuk?]** (on-demand) → "Coba perhatikan kembali bentuk alas, tinggi, posisi kedua bangun, atau ruang yang terisi selama visualisasi."
- **[Saya Menemukan Sesuatu]** → "Informasi lain apa yang kamu temukan dari hasil pengamatanmu?" (catat di e-module) → **[Sudah Dicatat]** → **[Lanjut Eksplorasi Bebas] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.

### 4.11 Periksa Kecukupan Data
Prompt: "Apakah informasi yang kamu peroleh melalui AR sudah cukup untuk melengkapi penyelidikan tentang hubungan volume prisma dan limas yang memiliki bentuk serta luas alas dan tinggi yang sama?" **[Sudah Cukup] | [Perlu Data Tambahan]**.
- **[Perlu Data Tambahan]** → "Data apa yang masih kamu perlukan?" → pilihan adaptif (tampilkan yang relevan dengan **aktivitas terakhir**, tidak semua sekaligus): **[Coba Luas Alas Lain] | [Coba Tinggi Lain] | [Ulangi Visualisasi Pengisian] | [Pilih Pasangan Bangun Lain] | [Kembali ke Aspek Pengamatan]**.
- **[Pilih Pasangan Bangun Lain]** (mis. Prisma Segitiga ↔ Limas Segitiga) → Pilih Pasangan Bangun → jika **anchor AR stabil**, pakai permukaan yang sama; jika **tracking hilang**, deteksi permukaan ulang → tempatkan pasangan baru → pengamatan awal → Menu Aspek.
- **[Sudah Cukup]** → Layar Penutup.

### 4.12 Layar Penutup
"Data Eksplorasimu Sudah Siap!" Teks: pastikan hasil pengamatan tentang alas, tinggi, dan visualisasi pengisian sudah dicatat di e-module; data dipakai tahap berikutnya untuk mengolah informasi tentang hubungan volume prisma dan limas. **[Selesai Eksplorasi AR]** → kembali ke e-module.

## 5. State Sesi
`pair{baseShape}` · `placedModels{prism,pyramid,pos,rot,viewZoom}` · `anchorStable` · `activeCondition{baseArea,height}` · `lockedVariable ∈ {none,height,baseArea}` · `conditionsVisited[]` · `fillTrials[] = {baseArea,height,fillCount,recorded}` · `selectedPart` · `comparisonPairs[]` · `findingsRecorded[aspect]` (boolean; isi catatan di e-module) · `sufficiency{belum|cukup|perlu}` · `lastActivity` (untuk tombol adaptif §4.11).
Aturan: perubahan `baseArea`/`height` selalu diterapkan ke prisma **dan** limas sekaligus; hanya satu variabel berbeda dari kondisi sebelumnya per percobaan; `viewZoom` terpisah dari dimensi; pra-cek kesesuaian (bentuk alas, luas alas, tinggi) wajib lolos sebelum animasi; ganti pasangan tidak menghapus data pasangan sebelumnya.

## 6. Non-Fungsional
Mobile + kamera, markerless; deteksi hilangnya tracking → deteksi ulang permukaan. Model stabil saat siswa berkeliling; perubahan alas/tinggi mulus di tempat yang sama. Dua model & dua kondisi pembanding berdampingan, tidak tumpang tindih. Animasi pengisian jelas dan bisa dijeda/diulang. Teks Bahasa Indonesia ramah siswa. Selalu ada jalan kembali.

## 7. Kriteria Penerimaan
1. Prisma dan limas muncul **berdampingan** dengan bentuk alas, luas alas, dan tinggi sama.
2. Keterangan Zoom Tampilan tampil; zoom tidak mengubah dimensi/nilai.
3. A2: tinggi terkunci; ubah luas alas mengubah **kedua** model bersamaan; tinggi tidak berubah.
4. A3: luas alas terkunci; ubah tinggi mengubah **kedua** model bersamaan; luas alas tidak berubah.
5. **[Bandingkan dengan Kondisi Sebelumnya]** menampilkan sebelum ↔ sesudah dengan orientasi sama.
6. Nilai tinggi baru tampil setelah **[Tampilkan Ukuran Tinggi]** ditekan.
7. A4: animasi hanya berjalan jika pra-cek (bentuk alas, luas alas, tinggi) lolos.
8. A4: indikator "Pengisian yang telah diamati" bertambah sesuai tindakan siswa; AR tidak menyatakan hubungan/jumlah/rumus.
9. **[Coba Kondisi Lain]** hanya mengubah **satu** variabel dan mengunci yang lain.
10. **[Bandingkan Hasil Pengamatan]** hanya muncul saat ≥2 hasil visualisasi pada kondisi berbeda dan hanya menampilkan data siswa.
11. Petunjuk tidak tampil sebelum **[Butuh Petunjuk?]** ditekan.
12. Tombol adaptif di "Perlu Data Tambahan" hanya menampilkan yang relevan dengan aktivitas terakhir.
13. **[Pilih Pasangan Bangun Lain]** memakai permukaan yang sama bila anchor stabil, deteksi ulang bila tracking hilang.
14. **[Selesai Eksplorasi AR]** kembali ke e-module.

## 8. Asumsi / Open Questions
1. **Segi-n**: bentuk alas umum (n sisi); diasumsikan n dipilih/ditentukan sistem (mis. segienam) perlu ditetapkan tim konten.
2. **Nilai numerik**: dokumen menyebut "jika tinggi numerik tersedia" saja. Diasumsikan tinggi (dan luas alas bila perlu di perbandingan) punya nilai matematis, tampil hanya atas permintaan siswa atau pada data perbandingan; satuan & rentang stepped perlu ditetapkan.
3. **Ubah luas alas**: diasumsikan bentuk alas tetap sebangun (skala) sehingga hanya luas yang berubah; perlu konfirmasi untuk segi-n tidak beraturan.
4. **Jumlah pengisian** hingga prisma penuh harus konsisten secara fisik dengan volume sebenarnya; AR hanya mendemonstrasikan dan **tidak** menyebut angka/rasionya. Perilaku **[Isi Lagi]** setelah prisma penuh (dinonaktifkan atau reset) belum ditentukan; diasumsikan dinonaktifkan dengan prompt observasi.
5. **"Kondisi berbeda"** (untuk **[Bandingkan Hasil Pengamatan]**): diasumsikan percobaan dengan luas alas atau tinggi berbeda.
6. Kalimat "Saya merekomendasikan lima aspek" pada sumber diasumsikan **catatan penulis**, bukan teks UI.
7. Label adaptif **[Coba Kondisi Lain]** (A4) vs **[Coba Luas Alas Lain]/[Coba Tinggi Lain]** (A2/A3) dipertahankan sesuai sumber.
8. AR tidak mengirim status ke guru/e-module; semua catatan manual oleh siswa.
9. **⌂ Reset Tampilan** hanya mengembalikan posisi/tampilan, tidak menghapus data/kondisi.