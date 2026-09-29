// Materi 8 guided flow (PRD-materi-8.md 4.1-4.10). Full-screen steps are static; the bottom
// "eksplorasi bar" (label/prompt/k-picker/hint/info/actions) is filled in by ./index.js.
export const MATERI8_MARKUP = `
  <div id="screen-awal-m8" class="screen">
    <div class="screen-inner">
      <h1>Ayo Mengeksplorasi dengan AR!</h1>
      <p>Amati perubahan bangun ruang ketika faktor skala diubah. Jelajahi dari berbagai arah dan kumpulkan informasi untuk menyelidiki dugaan kelompokmu.</p>
      <p class="hint">Kumpulkan data yang diperlukan. Kamu akan mengolahnya pada tahap berikutnya.</p>
      <button id="btn-mulai-m8" class="btn-primary">Mulai Eksplorasi AR</button>
    </div>
  </div>

  <div id="screen-pilih-bangun-m8" class="screen hidden">
    <div class="screen-inner">
      <h2>Pilih Bangun Ruang</h2>
      <p>Pilih bangun yang ingin kamu amati. Kamu dapat mengamati bangun lain jika memerlukan data tambahan.</p>
      <div id="bangun-grid-m8" class="grid-buttons">
        <button type="button" class="btn-bangun" data-shape="kubus">Kubus</button>
        <button type="button" class="btn-bangun" data-shape="balok">Balok</button>
        <button type="button" class="btn-bangun" data-family="prisma">Prisma</button>
        <button type="button" class="btn-bangun" data-family="limas">Limas</button>
      </div>
      <div id="alas-row-m8" class="alas-row-m8 hidden">
        <p>Pilih jenis alas <span id="alas-family-m8"></span>:</p>
        <div id="alas-grid-m8" class="grid-buttons">
          <button type="button" class="btn-bangun" data-n="3">Segitiga</button>
          <button type="button" class="btn-bangun" data-n="4">Segiempat</button>
          <button type="button" class="btn-bangun" data-n="5">Segilima</button>
          <button type="button" class="btn-bangun" id="btn-alas-segin-m8">Segi-n</button>
        </div>
        <div id="segin-row-m8" class="segi-n-row hidden">
          <label for="segin-slider-m8">Alas segi-<span id="segin-value-m8">6</span></label>
          <input type="range" id="segin-slider-m8" min="3" max="12" value="6">
          <button type="button" id="btn-pilih-segin-m8" class="btn-secondary">Pilih Alas Ini</button>
        </div>
      </div>
      <button type="button" id="btn-bangun-kembali-m8" class="btn-secondary hidden" style="margin-top:10px">Kembali</button>
    </div>
  </div>

  <div id="screen-tempatkan-m8" class="screen hidden">
    <div class="screen-inner">
      <p id="tempatkan-prompt-m8">Arahkan kamera ke permukaan datar di sekitarmu.</p>
      <button id="btn-tempatkan-m8" class="btn-primary">Ketuk untuk Menempatkan Model</button>
      <p class="hint" style="margin-top:12px">Permukaan tidak terdeteksi? Pastikan izin kamera aktif dan ruangan cukup terang, gerakkan ponsel perlahan, lalu coba lagi.</p>
    </div>
  </div>

  <div id="screen-menu-aspek-m8" class="screen hidden">
    <div class="screen-inner">
      <h2>Apa yang Ingin Kamu Selidiki?</h2>
      <p>Pilih informasi untuk menyelidiki perubahan ukuran saat faktor skala berubah dan melengkapi data tentang volumenya. Kamu tidak harus memilih semuanya.</p>
      <div id="aspek-list-m8" class="aspek-list"></div>
      <button type="button" id="btn-aspek-lanjut-m8" class="btn-primary" disabled>Lanjutkan</button>
      <button type="button" id="btn-menu-kecukupan-m8" class="btn-secondary" style="margin-top:10px">Periksa Kecukupan Data</button>
    </div>
  </div>

  <div id="eksplorasi-bar-m8" class="hidden">
    <div id="m8-controls">
      <button type="button" id="btn-m8-putar" aria-label="Putar" title="Putar">&#8635;</button>
      <button type="button" id="btn-m8-geser" aria-label="Geser" title="Geser (seret dengan satu jari)">&#8596;</button>
      <button type="button" id="btn-m8-besar" aria-label="Zoom Tampilan Perbesar" title="Zoom Tampilan +">&#128269;+</button>
      <button type="button" id="btn-m8-kecil" aria-label="Zoom Tampilan Perkecil" title="Zoom Tampilan -">&#128269;&minus;</button>
      <button type="button" id="btn-m8-reset" aria-label="Reset" title="Reset">&#8962;</button>
    </div>
    <div id="m8-zoom-note" class="hidden">Zoom Tampilan hanya mengubah tampilan model, bukan faktor skalanya.</div>
    <div id="m8-label" class="hidden"></div>
    <div id="m8-prompt"></div>
    <div id="m8-k" class="hidden"></div>
    <div id="m8-hint" class="hidden"></div>
    <div id="m8-info" class="hidden"></div>
    <div id="m8-actions"></div>
    <div id="m8-trailer" class="hidden">
      <button type="button" id="btn-m8-kembali-menu" class="btn-secondary">Kembali ke Aspek Pengamatan</button>
      <button type="button" id="btn-m8-kecukupan" class="btn-secondary">Periksa Kecukupan Data</button>
    </div>
  </div>

  <div id="screen-kecukupan-m8" class="screen hidden">
    <div class="screen-inner">
      <p>Apakah informasi dari AR sudah cukup untuk melengkapi penyelidikan tentang perubahan ukuran bangun ketika faktor skala berubah?</p>
      <div id="kecukupan-step1-m8">
        <button type="button" id="btn-sudah-cukup-m8" class="btn-primary" style="margin-bottom:10px">Sudah Cukup</button>
        <button type="button" id="btn-perlu-tambahan-m8" class="btn-secondary">Perlu Data Tambahan</button>
      </div>
      <div id="kecukupan-step2-m8" class="hidden">
        <p>Data apa yang masih kamu perlukan?</p>
        <button type="button" id="btn-coba-k-kecukupan-m8" class="btn-secondary" style="margin-bottom:10px">Coba Faktor Skala Lain</button>
        <button type="button" id="btn-amati-bangun-lain-m8" class="btn-secondary" style="margin-bottom:10px">Amati Bangun Lain</button>
        <button type="button" id="btn-kecukupan-menu-m8" class="btn-secondary">Kembali ke Aspek Pengamatan</button>
      </div>
    </div>
  </div>

  <div id="screen-selesai-m8" class="screen hidden">
    <div class="screen-inner">
      <h2>Data Eksplorasimu Sudah Siap!</h2>
      <p>Pastikan hasil pengamatan dan pengukuranmu sudah dicatat di e-module.</p>
      <p>Data ini akan kamu gunakan pada tahap berikutnya untuk mengolah informasi tentang perubahan skala dan volume bangun ruang.</p>
      <button type="button" id="btn-selesai-m8" class="btn-primary">Selesai Eksplorasi AR</button>
    </div>
  </div>
`
