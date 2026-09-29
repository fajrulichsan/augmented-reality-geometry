// Materi 5 guided flow (PRD-materi-5.md 4.1-4.10). Full-screen steps are static; the bottom
// "eksplorasi bar" (label/prompt/k-picker/hint/info/actions) is filled in by ./index.js.
export const MATERI5_MARKUP = `
  <div id="screen-awal-m5" class="screen">
    <div class="screen-inner">
      <h1>Ayo Mengeksplorasi dengan AR!</h1>
      <p>Amati perubahan bangun ruang ketika faktor skala diubah. Jelajahi dari berbagai arah dan kumpulkan informasi untuk menyelidiki dugaan kelompokmu.</p>
      <p class="hint">Kumpulkan data yang diperlukan. Kamu akan mengolahnya pada tahap berikutnya.</p>
      <button id="btn-mulai-m5" class="btn-primary">Mulai Eksplorasi AR</button>
    </div>
  </div>

  <div id="screen-pilih-bangun-m5" class="screen hidden">
    <div class="screen-inner">
      <h2>Pilih Bangun Ruang</h2>
      <p>Pilih bangun yang ingin kamu amati. Kamu tidak harus mengamati semua bangun.</p>
      <div id="bangun-grid-m5" class="grid-buttons">
        <button type="button" class="btn-bangun" data-shape="kubus">Kubus</button>
        <button type="button" class="btn-bangun" data-shape="balok">Balok</button>
        <button type="button" class="btn-bangun" data-family="prisma">Prisma</button>
        <button type="button" class="btn-bangun" data-family="limas">Limas</button>
      </div>
      <div id="alas-row-m5" class="alas-row-m5 hidden">
        <p>Pilih jenis alas <span id="alas-family-m5"></span>:</p>
        <div id="alas-grid-m5" class="grid-buttons">
          <button type="button" class="btn-bangun" data-n="3">Segitiga</button>
          <button type="button" class="btn-bangun" data-n="4">Segiempat</button>
          <button type="button" class="btn-bangun" data-n="5">Segilima</button>
          <button type="button" class="btn-bangun" id="btn-alas-segin-m5">Segi-n</button>
        </div>
        <div id="segin-row-m5" class="segi-n-row hidden">
          <label for="segin-slider-m5">Alas segi-<span id="segin-value-m5">6</span></label>
          <input type="range" id="segin-slider-m5" min="3" max="12" value="6">
          <button type="button" id="btn-pilih-segin-m5" class="btn-secondary">Pilih Alas Ini</button>
        </div>
      </div>
      <button type="button" id="btn-bangun-kembali-m5" class="btn-secondary hidden" style="margin-top:10px">Kembali</button>
    </div>
  </div>

  <div id="screen-tempatkan-m5" class="screen hidden">
    <div class="screen-inner">
      <p id="tempatkan-prompt-m5">Arahkan kamera ke permukaan datar di sekitarmu.</p>
      <button id="btn-tempatkan-m5" class="btn-primary">Ketuk untuk Menempatkan Model</button>
      <p class="hint" style="margin-top:12px">Permukaan tidak terdeteksi? Pastikan izin kamera aktif dan ruangan cukup terang, gerakkan ponsel perlahan, lalu coba lagi.</p>
    </div>
  </div>

  <div id="screen-menu-aspek-m5" class="screen hidden">
    <div class="screen-inner">
      <h2>Apa yang Ingin Kamu Selidiki?</h2>
      <p>Pilih informasi untuk menyelidiki perubahan ukuran saat faktor skala berubah dan melengkapi data luas permukaan. Kamu tidak harus memilih semuanya.</p>
      <div id="aspek-list-m5" class="aspek-list"></div>
      <button type="button" id="btn-aspek-lanjut-m5" class="btn-primary" disabled>Lanjutkan</button>
      <button type="button" id="btn-menu-kecukupan-m5" class="btn-secondary" style="margin-top:10px">Periksa Kecukupan Data</button>
    </div>
  </div>

  <div id="eksplorasi-bar-m5" class="hidden">
    <div id="m5-controls">
      <button type="button" id="btn-m5-putar" aria-label="Putar" title="Putar">&#8635;</button>
      <button type="button" id="btn-m5-geser" aria-label="Geser" title="Geser (seret dengan satu jari)">&#8596;</button>
      <button type="button" id="btn-m5-besar" aria-label="Zoom Tampilan Perbesar" title="Zoom Tampilan +">&#128269;+</button>
      <button type="button" id="btn-m5-kecil" aria-label="Zoom Tampilan Perkecil" title="Zoom Tampilan -">&#128269;&minus;</button>
      <button type="button" id="btn-m5-reset" aria-label="Reset" title="Reset">&#8962;</button>
    </div>
    <div id="m5-label" class="hidden"></div>
    <div id="m5-prompt"></div>
    <div id="m5-k" class="hidden"></div>
    <div id="m5-hint" class="hidden"></div>
    <div id="m5-info" class="hidden"></div>
    <div id="m5-actions"></div>
    <div id="m5-trailer" class="hidden">
      <button type="button" id="btn-m5-kembali-menu" class="btn-secondary">Kembali ke Aspek Pengamatan</button>
      <button type="button" id="btn-m5-kecukupan" class="btn-secondary">Periksa Kecukupan Data</button>
    </div>
  </div>

  <div id="screen-kecukupan-m5" class="screen hidden">
    <div class="screen-inner">
      <p>Apakah informasi dari AR sudah cukup untuk melengkapi penyelidikan tentang perubahan ukuran bangun saat faktor skala berubah?</p>
      <div id="kecukupan-step1-m5">
        <button type="button" id="btn-sudah-cukup-m5" class="btn-primary" style="margin-bottom:10px">Sudah Cukup</button>
        <button type="button" id="btn-perlu-tambahan-m5" class="btn-secondary">Perlu Data Tambahan</button>
      </div>
      <div id="kecukupan-step2-m5" class="hidden">
        <p>Data apa yang masih kamu perlukan?</p>
        <button type="button" id="btn-coba-k-kecukupan-m5" class="btn-secondary" style="margin-bottom:10px">Coba Faktor Skala Lain</button>
        <button type="button" id="btn-amati-bangun-lain-m5" class="btn-secondary" style="margin-bottom:10px">Amati Bangun Lain</button>
        <button type="button" id="btn-kecukupan-menu-m5" class="btn-secondary">Kembali ke Aspek Pengamatan</button>
      </div>
    </div>
  </div>

  <div id="screen-selesai-m5" class="screen hidden">
    <div class="screen-inner">
      <h2>Data Eksplorasimu Sudah Siap!</h2>
      <p>Pastikan hasil pengamatan dan pengukuranmu sudah dicatat di e-module.</p>
      <p>Data ini akan kamu gunakan pada tahap berikutnya untuk mengolah informasi tentang perubahan skala dan luas permukaan bangun ruang.</p>
      <button type="button" id="btn-selesai-m5" class="btn-primary">Selesai Eksplorasi AR</button>
    </div>
  </div>
`
