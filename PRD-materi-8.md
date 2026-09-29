# PRD (Compact): Modul AR "Ayo Mengeksplorasi dengan AR!" – Faktor Skala & Volume Bangun Ruang (Materi 8)

## 1. Konteks
- Bagian e-module inquiry; AR dipakai pada tahap **pengumpulan data**. Pengolahan dilakukan di tahap berikutnya (e-module).
- User: siswa berkelompok, punya dugaan kelompok tentang pengaruh faktor skala `k` terhadap ukuran dan **volume** bangun ruang.
- Peran AR: alat pengamatan & pengukuran panjang, **bukan pemberi rumus/kesimpulan**.
- Struktur alur hampir sama dengan Materi 5 (skala & luas permukaan). Perbedaan utama: fokus pada **volume/ruang yang ditempati**; nilai dasar berbeda (kubus s = 2 cm pada k=1); aturan ukuran per bangun dan **tinggi tegak limas**; perbandingan model lebih ketat (§4.6).

## 2. Prinsip Wajib
1. AR hanya beri **data ukuran (panjang/tinggi)** dan visual perubahan. **Tidak** menampilkan volume, rumus, rasio perubahan, atau kesimpulan.
2. Siswa memilih bangun, aspek, dan nilai `k`; tidak wajib semua.
3. Petunjuk hanya muncul saat **[Butuh Petunjuk?]** ditekan.
4. Nilai ukuran berasal dari **dimensi matematis model**, bukan hasil mengukur objek virtual di layar atau efek zoom. Contoh: kubus `s = 2 cm` pada k=1 → sistem menetapkan `s = 4 cm` pada k=2.
5. Hanya ukuran yang **dipilih siswa** yang ditampilkan.
6. **Zoom Tampilan ≠ faktor skala matematis.** Zoom hanya mengubah tampilan. Keterangan kecil di UI: "Zoom Tampilan hanya mengubah tampilan model, bukan faktor skalanya."
7. Perubahan `k` harus tampil sebagai **perubahan skala** (model berubah dinamis dan proporsional di posisi yang sama), bukan perpindahan model.
8. Catatan siswa ditulis di **catatan hasil eksplorasi (e-module)**. **[Sudah Dicatat]** hanya konfirmasi lanjut.

## 3. Alur Utama
```
Layar Awal [Mulai Eksplorasi AR] → Pilih Bangun Ruang → Deteksi permukaan (markerless)
→ [Ketuk untuk Menempatkan Model] (k=1) → Model Awal [Lanjutkan Eksplorasi]
→ Menu Aspek (M1 / M2 / M3) → Catat
→ {[Coba Faktor Skala Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]}
→ {[Sudah Cukup] → Layar Penutup → e-module
   | [Perlu Data Tambahan] → {[Coba Faktor Skala Lain] | [Amati Bangun Lain] | [Kembali ke Aspek Pengamatan]}}
```

## 4. Kebutuhan Fungsional

### 4.1 Layar Awal
"Ayo Mengeksplorasi dengan AR!" (sumber tertulis "Mengesplorasi", typo). Teks: amati perubahan bangun ruang ketika faktor skalanya diubah; jelajahi model dari berbagai arah; kumpulkan informasi untuk dugaan kelompok. Pengingat kecil: "Kumpulkan data yang diperlukan. Kamu akan mengolahnya pada tahap berikutnya." Tombol **[Mulai Eksplorasi AR]**.

### 4.2 Pilih Bangun Ruang
**[Kubus] [Balok] [Prisma] [Limas]**. Prisma & Limas punya sub-pilihan jenis alas: Segitiga | Segiempat | Segilima | … Instruksi: "Pilih bangun yang ingin kamu amati. Kamu dapat mengamati bangun lain jika memerlukan data tambahan." Tidak wajib semua.

### 4.3 Deteksi & Penempatan (markerless)
"Arahkan kamera ke permukaan datar di sekitarmu." → "Permukaan ditemukan. Ketuk untuk menempatkan model." → **[Ketuk untuk Menempatkan Model]** → model muncul di lingkungan nyata dengan **k = 1**.

### 4.4 Model Awal
Label "Kubus — k=1" (sesuai bangun). Instruksi: amati model awal dari berbagai arah sebelum mengubah faktor skala. Kontrol **↻ Putar | ↔ Geser | 🔍 Zoom Tampilan | ⌂ Reset Tampilan** + keterangan Zoom (prinsip 6). **[Lanjutkan Eksplorasi]**.

### 4.5 Menu Aspek ("Apa yang Ingin Kamu Selidiki?", checkbox, tidak harus semua)
☐ Perubahan Bangun saat Skala Diubah (**M1**) · ☐ Ukuran Bangun (**M2**) · ☐ Informasi Lainnya (**M3**). Instruksi: pilih informasi untuk menyelidiki perubahan ukuran bangun saat `k` berubah dan melengkapi data tentang **volumenya**.

### 4.6 M1 – Perubahan Bangun saat Skala Diubah
- Model awal k=1. Prompt: "Amati model pada kondisi awal. Kemudian pilih faktor skala lain dan perhatikan perubahan yang terjadi." Pilihan **[½] [1] [2] [3]** atau slider ½ — 1 — 2 — 3.
- Ubah `k` (mis. → k=2): model berubah **dinamis dan proporsional di posisi yang sama** (dari k=1 menuju k=2), sehingga perubahan berasal dari skala, bukan perpindahan. Label "Kubus – k=2". Prompt: "Amati model setelah faktor skalanya diubah. Perubahan apa yang kamu lihat?"
- Siswa bebas: mengelilingi model, melihat dari atas/samping/depan, mendekati/menjauhi model **secara fisik**, memutar model.
- **[Bandingkan dengan Model Awal]** hanya muncul saat **k≠1** (tidak muncul di k=1). Saat dipilih: dua model **berdampingan di permukaan yang sama** ("Model Awal — k=1" ↔ "Model Baru — k=2") dengan syarat: **orientasi sama, bidang alas sama, acuan posisi konsisten, ukuran matematis sesuai nilai k**. Prompt: "Amati kedua model dari berbagai arah. Apa yang kamu temukan?" Opsional **[Butuh Petunjuk?]** → "Perhatikan bentuk, ukuran, dan ruang yang ditempati model sebelum dan setelah faktor skala diubah."
- **[Kembali ke Model Baru]** → model awal **disembunyikan**; model k=2 kembali aktif.
- Catat: "Apa yang kamu temukan setelah faktor skala diubah?" + catat di e-module → **[Sudah Dicatat]** → **[Coba Faktor Skala Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.
- **[Coba Faktor Skala Lain]** di M1: tetap di M1 → pilih k lain → model berubah → amati → opsional **[Bandingkan dengan Model Awal]** → catat.

### 4.7 M2 – Ukuran Bangun
- Faktor skala aktif **dipertahankan** (mis. "Kubus — k=2"). Prompt "Pilih bagian bangun yang ingin kamu ukur." → **[Mulai Mengukur]** → ketuk rusuk/bagian → bagian disorot → tampil nilai (mis. **4 cm**) dari dimensi matematis (prinsip 4). Hanya bagian yang dipilih yang tampil.
- **Ukuran per bangun** (siswa yang memilih):
  | Bangun | Ukuran yang dapat dipilih |
  |---|---|
  | Kubus | rusuk yang diperlukan |
  | Balok | panjang, lebar, tinggi |
  | Prisma | ukuran untuk menentukan **luas alas**; tinggi/panjang prisma |
  | Limas | ukuran untuk menentukan **luas alas**; **tinggi tegak limas** |
- **Limas**: tinggi yang dibutuhkan untuk volume adalah **tinggi tegak dari puncak ke bidang alas**, bukan tinggi sisi/apotema. Jika tinggi tegak bukan rusuk, sediakan **[Ukur Tinggi Bangun]** → muncul garis **tegak lurus** dari puncak ke bidang alas → nilai tinggi ditampilkan.
- Setelah tiap ukuran: "Apakah kamu masih memerlukan ukuran bagian lain?" → **[Ukur Bagian Lain]** (bangun, k, dan aspek M2 tetap; pilih bagian lain; dapat diulang) | **[Data Ukuran Sudah Cukup]**.
- **[Data Ukuran Sudah Cukup]** → "Periksa Data Ukuranmu": tampil hanya ukuran yang diperoleh (mis. Bangun: Kubus; Faktor skala: k=2; Rusuk yang diukur: 4 cm). Prompt: "Informasi ukuran apa yang kamu peroleh pada faktor skala ini?" → Catat (e-module) → **[Sudah Dicatat]**.
- Jika baru **satu** kondisi k (mis. k=2 → rusuk 4 cm): **tidak ada** tombol perbandingan; tampil **[Coba Faktor Skala Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.
- **[Coba Faktor Skala Lain]** di M2: **tidak** kembali ke M1; tetap di M2 → "Pilih Faktor Skala Lain" (½ — 1 — 2 — 3) → model berubah (mis. k=3) → "Pilih bagian bangun yang ingin kamu ukur pada faktor skala ini." → ukur → catat. (Aspek sama, hanya k berubah.)
- **[Bandingkan Ukuran]**: muncul setelah **[Sudah Dicatat]** hanya jika ada ≥2 data ukuran **sebanding** (bagian yang sama pada 2 nilai k, mis. k=1 → 2 cm, k=2 → 4 cm).
  - "Bandingkan Data Ukuran": "Pilih dua hasil pengukuran yang ingin kamu bandingkan" (mis. k=1 ↔ k=2) → tampil data siswa (k=1 → rusuk 2 cm; k=2 → rusuk 4 cm). Prompt: "Bandingkan ukuran yang kamu peroleh pada kedua faktor skala tersebut. Apa yang kamu temukan?"
  - Opsional **[Lihat Kedua Model]** → tampil model k terpilih di lingkungan nyata (data numerik + representasi spasial).
  - **[Catat Hasil Perbandingan]** (e-module) → **[Sudah Dicatat]** → jika masih ada pasangan data lain: **[Bandingkan Ukuran Lain]**; navigasi **[Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**; bila perlu nilai k lain: **[Coba Faktor Skala Lain]**.

### 4.8 M3 – Informasi Lainnya
- Prompt: "Amati kembali model dan perubahan yang terjadi ketika faktor skalanya diubah. Adakah informasi lain yang kamu temukan?" + "Jelajahi bagian yang menurutmu menarik atau dapat melengkapi informasi yang sudah kamu peroleh." **[Mulai Eksplorasi Bebas]**.
- Alat: **[Ubah Faktor Skala] [Pilih Bagian] [Ukur Bagian] [Bandingkan dengan Model Awal] [Reset Tampilan]** + bergerak fisik mengelilingi model.
- Prompt kontekstual: pilih bagian → "Apa yang kamu perhatikan pada bagian yang kamu pilih?"; ubah k → "Setelah faktor skala diubah, adakah informasi lain yang kamu temukan?"; bandingkan dua kondisi → "Amati kedua kondisi tersebut. Adakah informasi lain yang kamu temukan?"
- **[Butuh Petunjuk?]** → "Coba perhatikan kembali bentuk, ukuran, posisi, atau perubahan bagian-bagian bangun ketika faktor skala diubah."
- **[Saya Menemukan Sesuatu]** → "Informasi lain apa yang kamu temukan dari hasil pengamatanmu?" (catat di e-module) → **[Sudah Dicatat]** → **[Lanjut Eksplorasi Bebas] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.

### 4.9 Periksa Kecukupan Data
Prompt: "Apakah informasi yang kamu peroleh melalui AR sudah cukup untuk melengkapi penyelidikan tentang perubahan ukuran bangun ketika faktor skala berubah?" **[Sudah Cukup] | [Perlu Data Tambahan]**.
- **[Perlu Data Tambahan]** → "Data apa yang masih kamu perlukan?" → **[Coba Faktor Skala Lain] | [Amati Bangun Lain] | [Kembali ke Aspek Pengamatan]**.
  - **[Coba Faktor Skala Lain]**: relevan bila siswa butuh kondisi k lain.
  - **[Kembali ke Aspek Pengamatan]** → "Apa yang Ingin Kamu Selidiki?".
  - **[Amati Bangun Lain]** → Pilih Bangun Ruang (Kubus | Balok | Prisma | Limas) → pilih bangun baru (mis. Balok) → **deteksi/pertahankan permukaan** → tempatkan model baru (mis. "Balok — k=1") → pengamatan awal → Menu Aspek.
- **[Sudah Cukup]** → Layar Penutup.

### 4.10 Layar Penutup
"Data Eksplorasimu Sudah Siap!" Teks: pastikan hasil pengamatan dan pengukuran sudah dicatat di e-module; data dipakai tahap berikutnya untuk mengolah informasi tentang perubahan skala dan **volume** bangun ruang. **[Selesai Eksplorasi AR]** → kembali ke e-module.

## 5. Perilaku **[Coba Faktor Skala Lain]** (ringkasan, mudah keliru)
| Dipanggil dari | Efek |
|---|---|
| M1 | Tetap di M1; pilih k lain; model berubah; amati; opsional bandingkan dengan k=1; catat |
| M2 | Tetap di M2; pilih k lain; model berubah; ukur bagian; catat |
| Bandingkan Ukuran (bila perlu k lain) | Ke M2, pilih k lain |
| Periksa Kecukupan → Perlu Data Tambahan | Pilih k lain pada bangun yang sama; aspek terakhir aktif (Open Question #4) |

## 6. State Sesi
`shape{type, baseType?}` · `placedModel{pos,rot,viewZoom}` · `activeK ∈ {½,1,2,3}` · `observedK[]` · `measurements[shape][k][partId] = value` · `selectedPart` · `comparisonPairs[]` · `findingsRecorded[aspect,k]` (boolean; isi catatan di e-module) · `sufficiency{belum|cukup|perlu}` · `surfaceAnchor{valid}`.
Aturan: `viewZoom` terpisah dari `activeK`; data ukuran per bangun per k per bagian (dipakai syarat **[Bandingkan Ukuran]**); ganti bangun tidak menghapus data bangun sebelumnya; nilai ukuran = `nilai_dasar × k` dari parameter model matematis (satu sumber kebenaran untuk label dan skala model 3D); model awal k=1 disembunyikan setelah **[Kembali ke Model Baru]**.

## 7. Non-Fungsional
Mobile + kamera, markerless. Model stabil saat siswa berkeliling; perubahan skala mulus di posisi yang sama. Dua model pembanding sejajar (orientasi & bidang alas sama), tidak tumpang tindih. Garis tinggi tegak limas jelas (tegak lurus bidang alas). Teks Bahasa Indonesia ramah siswa. Fallback jika permukaan gagal. Selalu ada jalan kembali.

## 8. Kriteria Penerimaan
1. Model ditempatkan pada **k=1** dengan label sesuai bangun (mis. "Kubus — k=1").
2. Mengubah k mengubah ukuran secara dinamis dan proporsional **di posisi yang sama** dan label k ikut berubah.
3. **[Bandingkan dengan Model Awal]** tidak muncul di k=1; muncul saat k≠1 dan menampilkan dua model berdampingan (orientasi & bidang alas sama).
4. **[Kembali ke Model Baru]** menyembunyikan model awal.
5. **Zoom Tampilan** tidak mengubah k maupun nilai ukuran; keterangan zoom tampil.
6. Ukuran hanya muncul untuk bagian yang dipilih; nilai mengikuti dimensi matematis (kubus s=2 cm: k=1→2, k=2→4).
7. Limas: tinggi yang tampil adalah **tinggi tegak** (puncak → bidang alas), bukan apotema; **[Ukur Tinggi Bangun]** menampilkan garis tegak lurus + nilai.
8. **[Ukur Bagian Lain]** tetap di bangun, k, dan M2 yang sama.
9. **[Coba Faktor Skala Lain]** dari M2 tidak kembali ke M1.
10. **[Bandingkan Ukuran]** hanya muncul jika ≥2 data ukuran sebanding (bagian sama, k berbeda) dan setelah **[Sudah Dicatat]**; tidak ada tombol perbandingan jika baru satu kondisi k.
11. **[Lihat Kedua Model]** menampilkan dua model (k terpilih) di lingkungan nyata.
12. Petunjuk (M1, M3) tidak tampil sebelum **[Butuh Petunjuk?]** ditekan.
13. AR tidak pernah menampilkan volume, rumus, atau rasio perubahan.
14. **[Amati Bangun Lain]** → pilih bangun → tempatkan model k=1 → Menu Aspek, tanpa menghapus data bangun sebelumnya.
15. **[Selesai Eksplorasi AR]** kembali ke e-module.

## 9. Asumsi / Open Questions
1. Kalimat aspek menyebut "melengkapi data tentang volumenya", tetapi alur hanya menampilkan **panjang/tinggi**. Diasumsikan AR **tidak** menampilkan volume; siswa menghitung sendiri.
2. Nilai dasar: baru **kubus s = 2 cm** (k=1). Balok, prisma, limas (dimensi, alas, tinggi tegak) perlu ditetapkan tim konten; nilai untuk k=½ harus mudah dibaca (kubus: 1 cm).
3. Nilai k terbatas **{½, 1, 2, 3}**; UI tombol atau slider diskrit belum diputuskan.
4. Menu aspek berupa checkbox → aspek dijalankan berurutan, bisa kembali ke menu. **[Coba Faktor Skala Lain]** dari Periksa Kecukupan diasumsikan masuk ke aspek terakhir yang aktif.
5. **⌂ Reset Tampilan** hanya mengembalikan posisi/tampilan, tidak menghapus data ukuran atau mengubah k.
6. Typo sumber diasumsikan diperbaiki: "Mengesplorasi" → "Mengeksplorasi", "Reset Tampila" → "Reset Tampilan", "nilai kk" → "nilai k".
7. Untuk prisma/limas segi-n, ukuran alas yang tersedia (rusuk, apotema alas, dll.) perlu dirumuskan tim konten.
8. AR tidak mengirim status ke guru/e-module; semua catatan manual oleh siswa.