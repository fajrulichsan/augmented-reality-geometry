// Materi 3 guided flow (PRD-materi-3.md FR-1..FR-9): screen-based navigation mirroring materi-1's
// shape, plus a shared bottom "eksplorasi bar" (like materi-1/materi-2's) whose sections/buttons
// are shown/hidden per aspect by ./index.js, since each of the 7 aspects has its own sub-flow.
// Injected into #materi-3-root by ./index.js so the whole materi lives in this one folder.
export const MATERI3_MARKUP = `
  <div id="screen-awal-m3" class="screen">
    <div class="screen-inner">
      <h1>Ayo Mengeksplorasi dengan AR!</h1>
      <p>Kamu akan memakai AR untuk mengamati model bangun ruang dan mengumpulkan data (bukan jawaban) untuk menyelidiki dugaan kelompokmu tentang luas permukaan.</p>
      <button id="btn-mulai-ar-m3" class="btn-primary">Mulai Eksplorasi</button>
    </div>
  </div>

  <div id="screen-persiapan-m3" class="screen hidden">
    <div class="screen-inner">
      <p>Arahkan kamera ke permukaan datar dan cukup terang.</p>
      <p class="hint">Permukaan terdeteksi. Ketuk untuk menempatkan model.</p>
      <button id="btn-persiapan-lanjut-m3" class="btn-primary">Ketuk untuk Menempatkan Model</button>
    </div>
  </div>

  <div id="screen-pilih-bangun-m3" class="screen hidden">
    <div class="screen-inner">
      <h2>Pilih Bangun Ruang</h2>
      <p>Pilih bangun yang perlu kamu amati. Kamu bisa kembali ke sini kapan saja untuk mengamati bangun lain.</p>
      <div id="bangun-grid-m3" class="grid-buttons">
        <button type="button" class="btn-bangun" data-shape="kubus">Kubus</button>
        <button type="button" class="btn-bangun" data-shape="balok">Balok</button>
        <button type="button" class="btn-bangun" data-group="prisma">Prisma</button>
      </div>
      <div id="bangun-sub-m3" class="grid-buttons hidden">
        <button type="button" class="btn-bangun" data-shape-n="3">Segitiga</button>
        <button type="button" class="btn-bangun" data-shape-n="4">Segiempat</button>
        <button type="button" class="btn-bangun" data-shape-n="5">Segilima</button>
        <div class="segi-n-row">
          <label for="segi-n-slider-m3">Segi-n (<span id="segi-n-value-m3">6</span>)</label>
          <input type="range" id="segi-n-slider-m3" min="3" max="12" value="6">
          <button type="button" id="btn-pilih-segi-n-m3" class="btn-secondary">Pilih Segi-n</button>
        </div>
      </div>
    </div>
  </div>

  <div id="screen-pilih-aspek-m3" class="screen hidden">
    <div class="screen-inner">
      <h2>Apa yang Ingin Kamu Selidiki?</h2>
      <p>Pilih satu atau lebih informasi yang ingin kamu amati. Kamu tidak harus mengamati semuanya.</p>
      <div id="aspek-list-m3" class="aspek-list"></div>
      <button type="button" id="btn-aspek-lanjut-m3" class="btn-primary" disabled>Lanjutkan</button>
    </div>
  </div>

  <div id="eksplorasi-bar-m3" class="hidden">
    <div id="m3-status" class="hidden"></div>
    <div id="m3-prompt"></div>
    <div id="m3-hint" class="hidden"></div>
    <div id="m3-measure-list" class="hidden"></div>
    <div id="m3-actions">
      <button type="button" id="btn-m3-hint" class="btn-secondary hidden">Butuh Petunjuk?</button>
      <button type="button" id="btn-m3-mulai-ukur" class="btn-secondary hidden">Mulai Mengukur</button>
      <button type="button" id="btn-m3-ukur-tinggi" class="btn-secondary hidden">Ukur Tinggi Sisi</button>
      <button type="button" id="btn-m3-gunakan-sebelumnya" class="btn-secondary hidden">Gunakan Data Sebelumnya</button>
      <button type="button" id="btn-m3-ukur-kembali" class="btn-secondary hidden">Ukur Kembali</button>
      <button type="button" id="btn-m3-data-cukup" class="btn-secondary hidden">Data Ukuran Sudah Cukup</button>
      <button type="button" id="btn-m3-bandingkan-bentuk-ukuran" class="btn-secondary hidden">Bandingkan Bentuk dan Ukuran</button>
      <button type="button" id="btn-m3-bandingkan-ukuran" class="btn-secondary hidden">Bandingkan Ukuran</button>
      <button type="button" id="btn-m3-pilih-sisi" class="btn-secondary hidden">Pilih Sisi</button>
      <button type="button" id="btn-m3-tampilkan-ukuran" class="btn-secondary hidden">Tampilkan Ukuran</button>
      <button type="button" id="btn-m3-temukan-sesuatu" class="btn-primary hidden">Saya Menemukan Sesuatu</button>
      <button type="button" id="btn-m3-catat" class="btn-primary hidden">Catat Hasil</button>
    </div>
    <div id="m3-trailer">
      <button type="button" id="btn-m3-pilih-sisi-lain" class="btn-secondary">Pilih Sisi Lain</button>
      <button type="button" id="btn-m3-kembali-aspek" class="btn-secondary">Kembali ke Aspek Pengamatan</button>
      <button type="button" id="btn-m3-cek-kecukupan-bar" class="btn-secondary">Periksa Kecukupan Data</button>
    </div>
  </div>

  <div id="screen-catat-m3" class="screen hidden">
    <div class="screen-inner">
      <h2>Catat Temuanmu</h2>
      <p>Apa yang kamu temukan? Catat hasil pengamatan AR pada tabel Catatan Hasil Eksplorasi di e-module.</p>
      <button type="button" id="btn-m3-bandingkan-temuan" class="btn-primary hidden">Bandingkan Temuan</button>
      <button type="button" id="btn-amati-aspek-lain-m3" class="btn-secondary">Amati Aspek Lain</button>
      <button type="button" id="btn-cek-kecukupan-m3" class="btn-primary">Periksa Kecukupan Data</button>
    </div>
  </div>

  <div id="screen-bandingkan-m3" class="screen hidden">
    <div class="screen-inner">
      <h2>Bandingkan Temuan</h2>
      <p>Dua temuan berikut ada pada aspek yang sama:</p>
      <div id="m3-bandingkan-list"></div>
      <p>Apa persamaan dan perbedaan yang kamu lihat? Catat kesimpulanmu di e-module.</p>
      <button type="button" id="btn-m3-catat-perbandingan" class="btn-primary">Catat Hasil Perbandingan</button>
      <button type="button" id="btn-m3-tutup-bandingkan" class="btn-secondary">Kembali</button>
    </div>
  </div>

  <div id="screen-kecukupan-m3" class="screen hidden">
    <div class="screen-inner">
      <p>Apakah datamu sudah cukup untuk menyelidiki dugaan kelompokmu?</p>
      <div id="kecukupan-step1-m3">
        <button type="button" id="btn-sudah-cukup-m3" class="btn-primary">Sudah Cukup</button>
        <button type="button" id="btn-perlu-tambahan-m3" class="btn-secondary">Perlu Data Tambahan</button>
      </div>
      <div id="kecukupan-step2-m3" class="hidden">
        <p>Informasi apa yang masih kamu perlukan?</p>
        <button type="button" id="btn-amati-aspek-lain-2-m3" class="btn-secondary">Amati Aspek Lain dari Bangun ini</button>
        <button type="button" id="btn-amati-bangun-lain-m3" class="btn-secondary">Amati Bangun Lain</button>
      </div>
    </div>
  </div>

  <div id="screen-selesai-m3" class="screen hidden">
    <div class="screen-inner">
      <h2>Data Eksplorasimu Sudah Siap!</h2>
      <p>Lengkapi Catatan Hasil Eksplorasi di e-module. Data ini akan kamu pakai pada tahap berikutnya untuk mengolah luas permukaan.</p>
      <button type="button" id="btn-selesai-eksplorasi-m3" class="btn-primary">Selesai Eksplorasi AR</button>
    </div>
  </div>
`
