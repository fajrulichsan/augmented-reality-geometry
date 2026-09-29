# PRD (Compact): Modul AR "Ayo Mengeksplorasi dengan AR!" – Faktor Skala & Luas Permukaan Bangun Ruang (Materi 5)

## 1. Konteks
- Bagian e-module inquiry; AR dipakai pada tahap **pengumpulan data**, olah data dilakukan di tahap berikutnya (e-module).
- User: siswa berkelompok dengan dugaan kelompok tentang pengaruh faktor skala `k` terhadap ukuran bangun dan luas permukaannya.
- Peran AR: alat pengamatan & pengukuran, **bukan pemberi kesimpulan**.
- Mekanisme umum sama dengan modul AR Limas (highlight, petunjuk on-demand, catat di e-module, periksa kecukupan data).

## 2. Prinsip Wajib
1. AR hanya beri **data ukuran (panjang)** dan visual perubahan. **Tidak** menampilkan rumus, pola/rasio perubahan, luas permukaan, atau kesimpulan.
2. Siswa memilih bangun, aspek, dan nilai `k`; tidak wajib semua.
3. Petunjuk hanya muncul saat **[Butuh Petunjuk?]** ditekan.
4. Nilai ukuran berasal dari **dimensi matematis model**, bukan hasil mengukur objek virtual di layar. Contoh: kubus `s = 8 cm` pada k=1 → sistem menetapkan `s = 16 cm` pada k=2.
5. Hanya ukuran yang **dipilih siswa** yang ditampilkan.
6. Catatan siswa ditulis di **e-module**, bukan di AR. Tombol **[Sudah Dicatat]** hanya konfirmasi lanjut.
7. **Zoom Tampilan ≠ faktor skala.** Zoom hanya mengubah tampilan kamera dan tidak boleh mengubah `k` maupun nilai ukuran.

## 3. Alur Utama
```
Layar Awal [Mulai Eksplorasi AR]
→ Pilih Bangun Ruang → Deteksi permukaan (markerless) → Tempatkan model (k=1)
→ Model Awal k=1 [Lanjutkan Eksplorasi]
→ Menu "Apa yang Ingin Kamu Selidiki?" → Modul Aspek (M1 / M2 / M3)
→ Catat → {[Coba Faktor Skala Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]}
→ {[Sudah Cukup] → Layar Penutup → e-module
   | [Perlu Data Tambahan] → {[Coba Faktor Skala Lain] | [Amati Bangun Lain] | [Kembali ke Aspek Pengamatan]}}
```

## 4. Kebutuhan Fungsional

### 4.1 Layar Awal
Judul "Ayo Mengeksplorasi dengan AR!". Teks: amati perubahan bangun ruang ketika faktor skala diubah, jelajahi dari berbagai arah, kumpulkan informasi untuk dugaan kelompok. Pengingat kecil: "Kumpulkan data yang diperlukan. Kamu akan mengolahnya pada tahap berikutnya." Tombol **[Mulai Eksplorasi AR]**.

### 4.2 Pilih Bangun Ruang
Pilihan: **Kubus | Balok | Prisma | Limas**. Prisma/Limas memiliki sub-pilihan jenis alas: Segitiga | Segiempat | Segilima | … Instruksi: "Pilih bangun yang ingin kamu amati." Tidak harus semua bangun.

### 4.3 Deteksi Permukaan (markerless)
Prompt "Arahkan kamera ke permukaan datar di sekitarmu" → setelah ditemukan "Permukaan ditemukan. Ketuk untuk menempatkan model" → **[Ketuk untuk Menempatkan Model]** → model muncul di lingkungan nyata dengan **k=1**.

### 4.4 Model Awal
Label "Kubus — k=1" (sesuai bangun). Instruksi amati dari berbagai arah sebelum mengubah skala. Kontrol: **↻ Putar | ↔ Geser | 🔍 Zoom Tampilan | ⌂ Reset**. Tombol **[Lanjutkan Eksplorasi]**.

### 4.5 Menu Aspek ("Apa yang Ingin Kamu Selidiki?", checkbox, tidak harus semua)
☐ Perubahan Bangun saat Skala Diubah (**M1**) · ☐ Ukuran Bangun (**M2**) · ☐ Informasi Lainnya (**M3**). Instruksi: pilih informasi untuk menyelidiki perubahan ukuran saat `k` berubah dan melengkapi data luas permukaan.

### 4.6 M1 – Perubahan Bangun saat Skala Diubah
- Model awal k=1. Prompt: amati kondisi awal, pilih faktor skala lain, perhatikan perubahannya.
- Pilihan `k`: **[½] [1] [2] [3]** (atau slider ½—1—2—3).
- Ubah `k` (mis. 1→2): model berubah ukuran **proporsional pada posisi yang sama** di lingkungan nyata; label "k=2". Prompt "Perubahan apa yang kamu lihat?". Siswa bebas bergerak mengelilingi, melihat dari atas/samping/depan, mendekat, memutar.
- Saat **k≠1** muncul **[Bandingkan dengan Model Awal]**: pertahankan model k baru, tampilkan model k=1 sebagai pembanding **berdampingan di permukaan yang sama, tidak ditumpuk** ("Model Awal k=1" dan "Model Baru k=2"). Prompt: amati kedua model, apa yang kamu temukan? Opsional **[Butuh Petunjuk?]** → "Perhatikan bentuk dan ukuran model sebelum dan setelah faktor skala diubah."
- **[Kembali ke Model Baru]** → "Catat Temuanmu": "Apa yang kamu temukan setelah faktor skala diubah?" + instruksi catat di e-module → **[Sudah Dicatat]** → **[Coba Faktor Skala Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.
- **[Coba Faktor Skala Lain]** di M1: tetap di M1 → pilih k lain → model berubah → amati → opsional bandingkan dengan k=1 → catat.

### 4.7 M2 – Ukuran Bangun
- Faktor skala aktif **dipertahankan** (mis. "Kubus — k=2"). Prompt "Pilih bagian bangun yang ingin kamu ukur." → **[Mulai Mengukur]**.
- Siswa mengetuk rusuk/bagian → bagian **disorot** → tampil nilai (mis. **16 cm**) dari dimensi matematis model (prinsip 4).
- Setelah satu pengukuran: "Apakah kamu masih memerlukan ukuran bagian lain?" → **[Ukur Bagian Lain]** (tetap di bangun, k, dan M2; pilih bagian lain) | **[Data Ukuran Sudah Cukup]**.
- **[Data Ukuran Sudah Cukup]** → "Periksa Data Ukuranmu": "Informasi ukuran apa yang kamu peroleh pada faktor skala ini?" → "Catat Temuanmu" (catat di e-module) → **[Sudah Dicatat]**.
- Jika baru ada **satu** kondisi k: tombol **[Coba Faktor Skala Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.
- **[Coba Faktor Skala Lain]** di M2: **tidak** kembali ke menu aspek; tetap di M2 → "Pilih Faktor Skala Lain" (½—1—2—3) → model berubah (mis. k=2→3) → prompt "Pilih bagian bangun yang ingin kamu ukur pada faktor skala ini" → ukur → catat. (Artinya: aspek sama, hanya k berubah.)
- **Bandingkan Ukuran**: tombol **[Bandingkan Ukuran]** muncul setelah **[Sudah Dicatat]** hanya bila siswa punya ≥2 data ukuran **sebanding** (bagian yang sama pada 2 nilai k, mis. k=1→8 cm, k=2→16 cm).
  - "Bandingkan Data Ukuran": siswa memilih dua hasil (mis. k=1 ↔ k=2) → AR menampilkan kedua data **yang memang diperoleh siswa**. Prompt: bandingkan ukuran pada kedua faktor skala, apa yang kamu temukan?
  - Opsional **[Lihat Kedua Model]** → tampil model k=1 dan k=2 di lingkungan nyata (data numerik + representasi spasial sekaligus).
  - **[Catat Hasil Perbandingan]** → catat di e-module → **[Sudah Dicatat]** → **[Bandingkan Temuan Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.

### 4.8 M3 – Informasi Lainnya
- Prompt: amati kembali model dan perubahan saat `k` diubah, adakah informasi lain? + "Jelajahi bagian yang menurutmu menarik atau dapat melengkapi informasi yang sudah kamu peroleh." → **[Mulai Eksplorasi Bebas]**.
- Mode bebas menyediakan: **[Ubah Faktor Skala] [Pilih Bagian] [Ukur Bagian] [Bandingkan dengan Model Awal] [Reset]** + bergerak fisik mengelilingi model.
- Prompt kontekstual: pilih bagian → "Apa yang kamu perhatikan pada bagian yang kamu pilih?"; ubah k → "Setelah faktor skala diubah, adakah informasi lain yang kamu temukan?"; bandingkan dua kondisi → "Amati kedua kondisi tersebut. Adakah informasi lain yang kamu temukan?"
- **[Butuh Petunjuk?]** (on-demand) → "Coba perhatikan kembali bentuk, ukuran, posisi, atau perubahan bagian-bagian bangun ketika faktor skala diubah."
- **[Saya Menemukan Sesuatu]** → "Catat Temuanmu": "Informasi lain apa yang kamu temukan dari hasil pengamatanmu?" → catat di e-module → **[Sudah Dicatat]** → **[Lanjut Eksplorasi Bebas] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**.

### 4.9 Periksa Kecukupan Data
Prompt: apakah informasi dari AR sudah cukup untuk melengkapi penyelidikan tentang perubahan ukuran bangun saat faktor skala berubah? **[Sudah Cukup] | [Perlu Data Tambahan]**.
- **[Perlu Data Tambahan]** → "Data apa yang masih kamu perlukan?" → **[Coba Faktor Skala Lain] | [Amati Bangun Lain] | [Kembali ke Aspek Pengamatan]**.
- **[Amati Bangun Lain]** → Pilih Bangun Ruang → pilih bangun baru → **pertahankan/deteksi ulang permukaan** → tempatkan model baru → kembali ke Menu Aspek.

### 4.10 Layar Penutup
Dari **[Sudah Cukup]** → "Data Eksplorasimu Sudah Siap!". Teks: pastikan hasil pengamatan & pengukuran sudah dicatat di e-module; data dipakai di tahap berikutnya untuk mengolah informasi tentang perubahan skala dan luas permukaan bangun ruang. Tombol **[Selesai Eksplorasi AR]** → kembali ke e-module.

## 5. Perilaku Tombol **[Coba Faktor Skala Lain]** (ringkasan, mudah keliru)
| Dipanggil dari | Efek |
|---|---|
| M1 | Tetap di M1, pilih k lain, model berubah, amati, opsional bandingkan k=1, catat |
| M2 | Tetap di M2, pilih k lain, model berubah, ukur bagian, catat |
| Periksa Kecukupan → Perlu Data Tambahan | Kembali memilih k lain pada bangun yang sama (aspek terakhir aktif; lihat Open Question #4) |

## 6. State Sesi
`shape{type,baseType}` · `placedModel{pos,rot,viewZoom}` · `activeK ∈ {½,1,2,3}` · `observedK[]` · `measurements[shape][k][partId] = value` · `selectedPart` · `comparisonPairs[]` · `findingsRecorded[aspect,k]` (boolean; isi catatan di e-module) · `sufficiency{belum|cukup|perlu}`.
Aturan: `viewZoom` terpisah dari `activeK`; data ukuran disimpan per bangun per k per bagian (dipakai syarat **[Bandingkan Ukuran]**); ganti bangun tidak menghapus data bangun sebelumnya; nilai ukuran dari parameter model matematis (`nilai_dasar × k`), satu sumber kebenaran untuk label dan skala model 3D.

## 7. Non-Fungsional
Mobile + kamera, markerless surface detection. Model stabil saat siswa berjalan mengelilingi; skala berubah mulus di posisi yang sama. Dua model pembanding tidak tumpang tindih. Teks Bahasa Indonesia ramah siswa. Fallback jika permukaan gagal terdeteksi. Selalu ada jalan kembali.

## 8. Kriteria Penerimaan
1. Setelah menempatkan kubus, model tampil di **k=1** dengan label "Kubus — k=1".
2. Mengubah k mengubah ukuran model secara proporsional di posisi yang sama, dan label k ikut berubah.
3. **[Bandingkan dengan Model Awal]** hanya muncul saat k≠1 dan menampilkan dua model **berdampingan**.
4. **Zoom Tampilan** tidak mengubah k maupun nilai ukuran.
5. Ukuran hanya muncul untuk bagian yang dipilih siswa; nilainya mengikuti dimensi matematis (kubus s=8 cm: k=1→8, k=2→16).
6. **[Ukur Bagian Lain]** tetap di bangun, k, dan M2 yang sama.
7. **[Coba Faktor Skala Lain]** dari M2 tidak kembali ke menu aspek.
8. **[Bandingkan Ukuran]** hanya muncul jika ada ≥2 data untuk bagian yang sama pada k berbeda dan setelah **[Sudah Dicatat]**.
9. **[Lihat Kedua Model]** menampilkan dua model (k terpilih) di lingkungan nyata.
10. Petunjuk (M1 dan M3) tidak tampil sebelum **[Butuh Petunjuk?]** ditekan.
11. AR tidak pernah menampilkan rumus, rasio perubahan, atau nilai luas permukaan.
12. **[Amati Bangun Lain]** → pilih bangun → tempatkan model baru → Menu Aspek, tanpa menghapus data bangun sebelumnya.
13. **[Selesai Eksplorasi AR]** kembali ke e-module.

## 9. Asumsi / Open Questions
1. Teks aspek menyebut "melengkapi data luas permukaan", tetapi alur hanya menampilkan **panjang**. Diasumsikan AR **tidak** menampilkan luas; siswa menghitung sendiri.
2. Nilai k terbatas pada **{½, 1, 2, 3}**; pilihan UI: tombol atau slider diskrit (belum diputuskan).
3. Dimensi dasar per bangun (kubus s=8 cm sudah ada; balok p×l×t, prisma, limas) perlu ditetapkan tim konten; nilai k=½ harus tetap bilangan yang mudah dibaca.
4. Menu aspek berupa checkbox → diasumsikan aspek dijalankan berurutan dan bisa kembali ke menu. **[Coba Faktor Skala Lain]** dari Periksa Kecukupan diasumsikan masuk ke aspek terakhir yang aktif.
5. Fungsi **⌂ Reset** (kembalikan posisi/tampilan saja, atau juga k=1?) → diasumsikan hanya posisi/tampilan, **tidak** menghapus data ukuran.
6. Bangun dengan banyak ukuran (balok, prisma, limas): diasumsikan tiap rusuk/bagian yang relevan dapat dipilih; untuk tinggi segitiga sisi tegak dll. mengikuti kesepakatan konten.
7. AR tidak mengirim status ke guru/e-module; semua catatan dilakukan siswa secara manual.
8. Sub-pilihan jenis alas (Segitiga | Segiempat | Segilima | …) diasumsikan sama dengan modul AR Limas.