# PRD: Eksplorasi AR — Luas Permukaan Bangun Ruang (v0.1, ringkas)

## 1. Ringkasan
Modul AR pendamping e-module matematika. Berfungsi sebagai **alat pengumpul data** untuk pembelajaran inquiry: kelompok siswa punya **dugaan** tentang hubungan sisi-sisi bangun ruang dengan luas permukaannya, lalu memakai AR untuk mengamati model 3D, memilih sendiri informasi yang diperlukan, dan mencatat temuan di **Catatan Hasil Eksplorasi** (e-module).
**Prinsip inti:** AR memberi data & alat observasi, **bukan** rumus/jawaban/penilaian. Siswa yang bernalar, menghitung, menyimpulkan.

- **Bangun:** Kubus, Balok, Prisma (segitiga, segiempat, segilima, segi-n)
- **Pengguna:** siswa (kerja kelompok, 1 perangkat/kelompok atau siswa); guru sebagai fasilitator
- **Platform:** mobile AR (ARCore/ARKit), Bahasa Indonesia
- **Masuk:** scan QR/marker atau tombol AR di e-module
- **Non-goal:** rumus/hasil luas otomatis, penilaian benar/salah, bangun lain (limas, tabung, dst.), kolaborasi realtime multi-perangkat
- **Teks UI (prompt/instruksi) mengikuti dokumen sumber "Alur Kegiatan yang ada di AR"**; PRD ini hanya merangkum perilaku.

## 2. Prinsip Desain
1. Siswa mengendalikan: pilih aspek & bangun sendiri, tak wajib semua aspek.
2. Data, bukan jawaban: AR tampilkan highlight & ukuran; siswa menghitung/menyimpulkan.
3. Petunjuk opsional & bertahap ("Butuh Petunjuk?"), tidak membocorkan jawaban.
4. Semua siklus bisa diulang; selalu ada jalan ke "Periksa Kecukupan Data".
5. Mekanisme identik untuk semua bangun.

## 3. Alur Utama
```
Awal [Mulai Eksplorasi] → Pilih Bangun → Tempatkan & manipulasi model AR
→ "Apa yang ingin kamu selidiki?" (multi-pilih 7 aspek) → Modul aspek
→ Catat Temuanmu → [Amati Aspek Lain] | [Periksa Kecukupan Data]
→ Cukup? Sudah → Akhir | Perlu tambahan → (aspek lain → menu aspek | bangun lain → Pilih Bangun)
Kapan pun ≥2 hasil relevan pada aspek sama → muncul [Bandingkan Temuan]
Akhir: "Data Eksplorasimu Sudah Siap!" → [Selesai Eksplorasi AR] → kembali ke e-module
```

## 4. Kebutuhan Fungsional (P0 kecuali disebut)

### FR-1 Entry & Pilih Bangun
- Layar awal "Ayo Mengeksplorasi dengan AR!" + instruksi + [Mulai Eksplorasi].
- Daftar: Kubus, Balok, Prisma (sub: Segitiga, Segiempat, Segilima, Segi-n). Bisa kembali kapan saja untuk bangun lain.

### FR-2 Penempatan & Manipulasi
- Kamera AR, deteksi bidang datar, ketuk untuk menempatkan model.
- Kontrol: ↻ Putar, ↔ Geser, +/− Zoom, ⌂ Reset. Bisa juga mengamati dengan mengelilingi model.
- P1: batas skala min/max; pesan & opsi tempatkan ulang saat tracking hilang.

### FR-3 Menu Aspek (checkbox, pilih ≥1, urutan bebas)
Banyak sisi · Bentuk setiap sisi · Ukuran setiap sisi · Luas setiap sisi · Sisi sama bentuk & ukuran · Hubungan ukuran antar sisi · Sifat/informasi lainnya.
P1: tandai aspek yang sudah dicatat.

### FR-4 Modul Aspek
Semua modul berakhir dengan tombol lanjutan standar: **[Pilih/Bandingkan Sisi Lain] | [Kembali ke Aspek Pengamatan] | [Periksa Kecukupan Data]**, dan catatan dilakukan di e-module.

| Aspek | Alur |
|---|---|
| **Banyak Sisi** | Ketuk tiap sisi → highlight sementara (ketuk ulang tidak menambah hitungan) → "Berapa banyak sisi yang kamu temukan?" → [Catat Temuan] / [Kembali ke Aspek]. AR tidak menampilkan jumlah benar. |
| **Bentuk Setiap Sisi** | [Mulai Mengamati] → pilih Sisi A → highlight → (P1: [Fokus pada Sisi] meredupkan sisi lain) → "Bentuk bangun datar apa?" → [Butuh Petunjuk?] (perhatikan bentuk bidang, banyak rusuk pembatas, hubungan antar rusuk) → catat → [Pilih Sisi Lain] dst. |
| **Ukuran Setiap Sisi** | Pilih sisi → highlight → [Mulai Mengukur] → ketuk rusuk → tampil ukuran (mis. 5 cm) → [Ukur Bagian Lain] \| [Data Ukuran Sudah Cukup]. Sisi segitiga: [Ukur Tinggi Sisi] menampilkan garis tinggi + nilainya. → "Periksa Data Ukuranmu" → [Catat Temuan]. Data disimpan per sisi. |
| **Luas Setiap Sisi** | Pilih sisi → "Data ukuran sudah tersedia?" Ya → [Gunakan Data Sebelumnya] \| [Ukur Kembali]; Tidak → [Mulai Mengukur]. Lalu prompt "bagaimana menentukan luasnya?". **AR tidak menampilkan rumus/langkah/hasil luas** (asumsi, lihat OQ-1). → [Catat Temuan] \| [Pilih Sisi Lain]. |
| **Sisi Sama Bentuk & Ukuran** | Pilih 2 sisi (highlight warna berbeda) → [Bandingkan Bentuk dan Ukuran] → cek data ukuran (Ya: gunakan sebelumnya/ukur kembali; Tidak: ukur, [Ukur Bagian Lain]) → prompt kesimpulan → [Butuh Petunjuk?] (bandingkan bentuk & ukuran bagian bersesuaian) → catat → [Bandingkan Sisi Lain]. AR tidak menyatakan "sama/beda". |
| **Hubungan Ukuran Antar Sisi** | Pilih Sisi A & B (highlight) → amati → cek data: [Gunakan Data Sebelumnya] \| [Ukur Kembali] \| [Lengkapi Pengukuran] → AR tampilkan ukuran kedua sisi → [Bandingkan Ukuran] → catat → [Bandingkan Sisi Lain]. |
| **Sifat/Info Lainnya** | [Mulai Eksplorasi Bebas]: kontrol penuh + [Pilih Sisi] + [Tampilkan Ukuran]. Prompt kontekstual (1 sisi: "apa yang kamu perhatikan?"; 2 sisi: "adakah hubungan?"). [Butuh Petunjuk?] (bentuk, ukuran, posisi, hubungan antar sisi). [Saya Menemukan Sesuatu] → catat → [Lanjut Eksplorasi Bebas]. Jika tak menemukan apa pun, langsung [Kembali ke Aspek Pengamatan]. |

### FR-5 Komponen Bersama
- **Pilih sisi:** ketuk → highlight; 1 atau 2 sisi sesuai aspek; ID sisi (A, B, C…) konsisten selama sesi.
- **Ukur:** ketuk rusuk → label cm; rusuk terukur diberi penanda; nilai konsisten & **tidak berubah oleh zoom**.
- **Data ukuran dipakai ulang lintas aspek** ([Gunakan Data Sebelumnya]).
- P1: highlight/label tidak menghalangi pengamatan bentuk sisi.

### FR-6 Catat Temuan
Setelah satu aspek: "Catat Temuanmu" → arahkan mengisi tabel Catatan Hasil Eksplorasi di e-module → [Amati Aspek Lain] | [Periksa Kecukupan Data]. Sistem me-log (bangun, aspek, sisi) untuk pemicu Bandingkan Temuan & analitik; isi jawaban tetap di e-module (asumsi, OQ-2).

### FR-7 Periksa Kecukupan Data
"Apakah datamu sudah cukup untuk menyelidiki dugaan kelompokmu?" → [Sudah Cukup] → Akhir. [Perlu Data Tambahan] → "Informasi apa yang masih kamu perlukan?" → [Amati Aspek Lain dari Bangun ini] (ke menu aspek) | [Amati Bangun Lain] (ke Pilih Bangun). AR tidak menilai kecukupan; keputusan milik siswa. Data bangun sebelumnya tetap tersimpan selama sesi.

### FR-8 Bandingkan Temuan
Pemicu: ≥2 hasil relevan pada aspek sama. Alur: pilih 2 hasil (Model A ↔ B) → tampilkan ulang data + model AR → "apa persamaan & perbedaan?" → (opsional Butuh Petunjuk) → [Catat Hasil Perbandingan] → [Bandingkan Temuan Lain] | [Kembali ke Aspek] | [Periksa Kecukupan Data].

### FR-9 Akhir
"Data Eksplorasimu Sudah Siap!" + pesan: lengkapi Catatan Hasil Eksplorasi; data dipakai di tahap berikutnya untuk mengolah luas permukaan. [Selesai Eksplorasi AR] menutup sesi & kembali ke e-module.

## 5. State Sesi
```
Session { currentShape, selectedAspects[], selectedFaces[0..2],
  measurements{shape→face→edge→value}, findings[{shape,aspect,faceIds,time}],
  comparisons[{findingA,findingB}], status(exploring|checking|done) }
```
- `measurements` lintas aspek; `findings` memicu Bandingkan Temuan; pindah bangun tidak menghapus data.

## 6. Non-Fungsional
- **Kinerja:** model tampil ≤3 dtk setelah ketuk; ≥30 FPS di perangkat menengah.
- **Kompatibilitas:** Android ARCore, iOS ARKit; pesan jelas bila AR tak didukung.
- **Akurasi:** ukuran sesuai data model, konsisten antar pengukuran.
- **UX:** teks singkat ramah siswa, target sentuh memadai, kontras baik.
- **Ketahanan:** data sesi bertahan saat app di latar belakang sebentar.
- **Privasi:** tak menyimpan citra kamera; tak ada data pribadi selain identitas kelompok/e-module.

## 7. Metrik & Analitik
- Selesai sampai [Selesai Eksplorasi AR] ≥80%; rata-rata ≥3 aspek/kelompok; ≥60% kelompok amati ≥2 bangun; Bandingkan Temuan dipakai ≥50% sesi memenuhi syarat; penempatan model berhasil percobaan pertama ≥90%; pemakaian Butuh Petunjuk dipantau (tanpa target).
- Event: `ar_start, shape_selected, model_placed, aspect_selected, face_selected, measure_taken, hint_opened, finding_recorded, sufficiency_checked{result}, comparison_recorded, ar_completed`.

## 8. Kriteria Penerimaan (inti)
- AC-1: ketuk sisi sama dua kali pada "Banyak Sisi" tidak menambah hitungan.
- AC-2: "Luas Setiap Sisi" + [Gunakan Data Sebelumnya] menampilkan ukuran sebelumnya; tidak ada rumus/hasil luas.
- AC-3: aspek sama tercatat pada 2 bangun → [Bandingkan Temuan] muncul.
- AC-4: [Perlu Data Tambahan]→[Amati Bangun Lain] kembali ke Pilih Bangun, data lama tetap.
- AC-5: [Ukur Tinggi Sisi] pada sisi segitiga menampilkan garis tinggi + nilai.
- AC-6: bisa selesai tanpa memilih semua aspek.
- AC-7: zoom tidak mengubah nilai ukuran.

## 9. Risiko
Tracking AR tak stabil → panduan, ⌂ Reset, tempatkan ulang · Siswa bingung mencatat → petunjuk bertahap · Highlight/label menutupi sisi → [Fokus pada Sisi], label bisa disembunyikan · Perangkat tanpa AR → deteksi + fallback (OQ-6) · Navigasi ruwet → tombol lanjutan konsisten · Istilah sisi/rusuk membingungkan → ikuti glosarium.

## 10. Asumsi & Pertanyaan Terbuka
- **OQ-1** Dokumen sumber terpotong di "AR tidak memberikan:" (Luas Sisi). Asumsi: rumus, langkah hitung, hasil luas.
- **OQ-2** [Catat Temuan] hanya penanda/pengingat, atau AR menyimpan isi catatan/deep link ke e-module? Asumsi: penanda saja.
- **OQ-3** Ukuran model tetap atau bervariasi antar kelompok? Asumsi: tetap per model.
- **OQ-4** Prisma segi-n: bagaimana n ditentukan; alas beraturan?
- **OQ-5** Definisi operasional "hasil relevan" untuk pemicu Bandingkan Temuan.
- **OQ-6** Perlu mode offline & fallback non-AR?
- **OQ-7** Perlu dashboard/ekspor untuk guru?
- **OQ-8** Identitas kelompok/sesi yang bisa dilanjutkan?
- **OQ-9** [Tampilkan Ukuran] di mode bebas: semua sisi atau hanya sisi terpilih?

## 11. Glosarium
**Sisi** = bidang (face), diberi label A, B, C… · **Rusuk** = garis pertemuan dua sisi (edge), dipakai untuk mengukur · **Tinggi sisi** = tinggi segitiga pada sisi segitiga · **Aspek** = 1 dari 7 jenis informasi yang diselidiki · **Temuan** = informasi yang dicatat siswa per aspek · **Dugaan kelompok** = hipotesis awal dari e-module · **Catatan Hasil Eksplorasi** = tabel di e-module tempat siswa mencatat.