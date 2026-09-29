// Materi 6 guided flow (PRD-materi-6.md 5.1-5.10). Full-screen steps are static; the bottom
// "eksplorasi bar" (label/prompt/picker/hint/info/input/actions) is filled in by ./index.js.
export const MATERI6_MARKUP = `
  <div id="screen-awal-m6" class="screen">
    <div class="screen-inner">
      <h1>Ayo Mengeksplorasi dengan AR!</h1>
      <p>Amati kubus, balok, dan prisma dari berbagai arah. Kumpulkan informasi untuk menyelidiki dugaan kelompokmu tentang volume bangun ruang.</p>
      <p class="hint">Kumpulkan data yang diperlukan. Kamu akan mengolah dan membuktikannya pada tahap berikutnya.</p>
      <button id="btn-mulai-m6" class="btn-primary">Mulai Eksplorasi AR</button>
    </div>
  </div>

  <div id="screen-pilih-bangun-m6" class="screen hidden">
    <div class="screen-inner">
      <h2>Pilih Bangun Ruang</h2>
      <p>Pilih bangun yang ingin kamu amati. Kamu boleh mengamati bangun lain untuk melengkapi data.</p>
      <div id="bangun-grid-m6" class="grid-buttons">
        <button type="button" class="btn-bangun" data-shape="kubus">Kubus</button>
        <button type="button" class="btn-bangun" data-shape="balok">Balok</button>
        <button type="button" class="btn-bangun" data-family="prisma">Prisma</button>
      </div>
      <div id="alas-row-m6" class="alas-row-m6 hidden">
        <p>Pilih jenis alas prisma:</p>
        <div id="alas-grid-m6" class="grid-buttons">
          <button type="button" class="btn-bangun" data-n="3">Segitiga</button>
          <button type="button" class="btn-bangun" data-n="4">Segiempat</button>
          <button type="button" class="btn-bangun" data-n="5">Segilima</button>
          <button type="button" class="btn-bangun" id="btn-alas-segin-m6">Segi-n</button>
        </div>
        <div id="segin-row-m6" class="segi-n-row hidden">
          <label for="segin-slider-m6">Alas segi-<span id="segin-value-m6">6</span></label>
          <input type="range" id="segin-slider-m6" min="5" max="12" value="6">
          <button type="button" id="btn-pilih-segin-m6" class="btn-secondary">Pilih Alas Ini</button>
        </div>
      </div>
      <button type="button" id="btn-bangun-kembali-m6" class="btn-secondary hidden" style="margin-top:10px">Kembali</button>
    </div>
  </div>

  <div id="screen-tempatkan-m6" class="screen hidden">
    <div class="screen-inner">
      <p id="tempatkan-prompt-m6">Arahkan kamera ke permukaan datar di sekitarmu.</p>
      <button id="btn-tempatkan-m6" class="btn-primary">Tampilkan Model</button>
      <p class="hint" style="margin-top:12px">Permukaan tidak terdeteksi? Pastikan izin kamera aktif dan ruangan cukup terang, gerakkan ponsel perlahan, lalu coba lagi.</p>
    </div>
  </div>

  <div id="screen-menu-aspek-m6" class="screen hidden">
    <div class="screen-inner">
      <h2>Apa yang Ingin Kamu Selidiki?</h2>
      <p>Pilih informasi yang ingin kamu kumpulkan tentang volume bangun ini. Kamu tidak harus memilih semuanya.</p>
      <div id="aspek-list-m6" class="aspek-list"></div>
      <button type="button" id="btn-aspek-lanjut-m6" class="btn-primary" disabled>Lanjutkan</button>
      <button type="button" id="btn-menu-kecukupan-m6" class="btn-secondary" style="margin-top:10px">Periksa Kecukupan Data</button>
    </div>
  </div>

  <div id="eksplorasi-bar-m6" class="hidden">
    <div id="m6-controls">
      <button type="button" id="btn-m6-putar" aria-label="Putar" title="Putar">&#8635;</button>
      <button type="button" id="btn-m6-geser" aria-label="Geser" title="Geser (seret dengan satu jari)">&#8596;</button>
      <button type="button" id="btn-m6-besar" aria-label="Zoom Tampilan Perbesar" title="Zoom Tampilan +">&#128269;+</button>
      <button type="button" id="btn-m6-kecil" aria-label="Zoom Tampilan Perkecil" title="Zoom Tampilan -">&#128269;&minus;</button>
      <button type="button" id="btn-m6-reset" aria-label="Reset Tampilan" title="Reset Tampilan">&#8962;</button>
    </div>
    <div id="m6-label" class="hidden"></div>
    <div id="m6-prompt"></div>
    <div id="m6-picker" class="hidden"></div>
    <div id="m6-hint" class="hidden"></div>
    <div id="m6-info" class="hidden"></div>
    <div id="m6-input" class="hidden">
      <label id="m6-input-label" for="m6-input-field"></label>
      <input type="text" id="m6-input-field" inputmode="decimal" autocomplete="off">
      <div id="m6-input-error" class="hidden"></div>
    </div>
    <div id="m6-actions"></div>
  </div>

  <div id="screen-kecukupan-m6" class="screen hidden">
    <div class="screen-inner">
      <p id="kecukupan-prompt-m6"></p>
      <div id="kecukupan-step1-m6">
        <button type="button" id="btn-sudah-cukup-m6" class="btn-primary" style="margin-bottom:10px">Sudah Cukup</button>
        <button type="button" id="btn-perlu-tambahan-m6" class="btn-secondary">Perlu Data Tambahan</button>
      </div>
      <div id="kecukupan-step2-m6" class="hidden">
        <p>Data apa yang masih kamu perlukan?</p>
        <div id="kecukupan-options-m6"></div>
      </div>
    </div>
  </div>

  <div id="screen-selesai-m6" class="screen hidden">
    <div class="screen-inner">
      <h2>Data Eksplorasimu Sudah Siap!</h2>
      <p>Pastikan hasil pengamatan, pengukuran, dan volume sudah kamu catat di Catatan Hasil Eksplorasi.</p>
      <p>Data ini akan kamu gunakan pada tahap berikutnya untuk mengolah informasi tentang volume kubus, balok, dan prisma.</p>
      <button type="button" id="btn-selesai-m6" class="btn-primary">Selesai Eksplorasi AR</button>
    </div>
  </div>
`
