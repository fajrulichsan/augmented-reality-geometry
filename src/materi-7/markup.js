// Materi 7 guided flow (PRD-materi-7.md 4.1-4.12). Full-screen steps are static; the bottom
// "eksplorasi bar" is filled in by ./index.js.
export const MATERI7_MARKUP = `
  <div id="screen-awal-m7" class="screen">
    <div class="screen-inner">
      <h1>Ayo Mengeksplorasi dengan AR!</h1>
      <p>Amati satu prisma dan satu limas dengan bentuk serta luas alas dan tinggi yang sama. Jelajahi kedua model dari berbagai arah, lalu kumpulkan informasi untuk dugaan kelompokmu.</p>
      <p class="hint">Kumpulkan data yang diperlukan. Kamu akan mengolah dan membuktikannya pada tahap berikutnya.</p>
      <button id="btn-mulai-m7" class="btn-primary">Mulai Eksplorasi AR</button>
    </div>
  </div>

  <div id="screen-pilih-pasangan-m7" class="screen hidden">
    <div class="screen-inner">
      <h2>Pilih Pasangan Bangun</h2>
      <p>Pilih bentuk alas. Prisma dan limas yang muncul memakai bentuk alas dan tinggi yang sama.</p>
      <div id="pasangan-grid-m7" class="grid-buttons">
        <button type="button" class="btn-bangun" data-n="3">Segitiga</button>
        <button type="button" class="btn-bangun" data-n="4">Segiempat</button>
        <button type="button" class="btn-bangun" data-n="5">Segilima</button>
        <button type="button" class="btn-bangun" data-n="6">Segi-n</button>
      </div>
      <p class="hint" id="pasangan-info-m7">Segi-n: alas berbentuk segi banyak beraturan (di sini segienam).</p>
      <button type="button" id="btn-pasangan-kembali-m7" class="btn-secondary hidden" style="margin-top:10px">Kembali</button>
    </div>
  </div>

  <div id="screen-tempatkan-m7" class="screen hidden">
    <div class="screen-inner">
      <p id="tempatkan-prompt-m7">Arahkan kamera ke permukaan datar di sekitarmu.</p>
      <button id="btn-tempatkan-m7" class="btn-primary">Ketuk untuk Menempatkan Model</button>
      <p class="hint" style="margin-top:12px">Permukaan tidak terdeteksi? Pastikan izin kamera aktif dan ruangan cukup terang, gerakkan ponsel perlahan, lalu coba lagi.</p>
    </div>
  </div>

  <div id="screen-menu-aspek-m7" class="screen hidden">
    <div class="screen-inner">
      <h2>Apa yang Ingin Kamu Selidiki?</h2>
      <p>Pilih informasi untuk menyelidiki hubungan volume prisma dan limas yang bentuk serta luas alas dan tingginya sama. Kamu tidak harus memilih semuanya.</p>
      <div id="aspek-list-m7" class="aspek-list"></div>
      <button type="button" id="btn-aspek-lanjut-m7" class="btn-primary" disabled>Lanjutkan</button>
      <button type="button" id="btn-menu-kecukupan-m7" class="btn-secondary" style="margin-top:10px">Periksa Kecukupan Data</button>
    </div>
  </div>

  <div id="eksplorasi-bar-m7" class="hidden">
    <div id="m7-controls">
      <button type="button" id="btn-m7-putar" aria-label="Putar" title="Putar">&#8635;</button>
      <button type="button" id="btn-m7-geser" aria-label="Geser" title="Geser (seret dengan satu jari)">&#8596;</button>
      <button type="button" id="btn-m7-besar" aria-label="Zoom Tampilan Perbesar" title="Zoom Tampilan +">&#128269;+</button>
      <button type="button" id="btn-m7-kecil" aria-label="Zoom Tampilan Perkecil" title="Zoom Tampilan -">&#128269;&minus;</button>
      <button type="button" id="btn-m7-reset" aria-label="Reset Tampilan" title="Reset Tampilan">&#8962;</button>
    </div>
    <div id="m7-label" class="hidden"></div>
    <div id="m7-prompt"></div>
    <div id="m7-zoomnote" class="m7-note">Zoom Tampilan hanya mengubah tampilan di layar, bukan ukuran matematis bangun.</div>
    <div id="m7-fill-status" class="hidden"></div>
    <div id="m7-picker" class="hidden"></div>
    <div id="m7-hint" class="hidden"></div>
    <div id="m7-info" class="hidden"></div>
    <div id="m7-actions"></div>
  </div>

  <div id="screen-kecukupan-m7" class="screen hidden">
    <div class="screen-inner">
      <p>Apakah informasi yang kamu peroleh melalui AR sudah cukup untuk melengkapi penyelidikan tentang hubungan volume prisma dan limas yang memiliki bentuk serta luas alas dan tinggi yang sama?</p>
      <div id="kecukupan-step1-m7">
        <button type="button" id="btn-sudah-cukup-m7" class="btn-primary" style="margin-bottom:10px">Sudah Cukup</button>
        <button type="button" id="btn-perlu-tambahan-m7" class="btn-secondary">Perlu Data Tambahan</button>
      </div>
      <div id="kecukupan-step2-m7" class="hidden">
        <p>Data apa yang masih kamu perlukan?</p>
        <div id="kecukupan-options-m7"></div>
      </div>
    </div>
  </div>

  <div id="screen-selesai-m7" class="screen hidden">
    <div class="screen-inner">
      <h2>Data Eksplorasimu Sudah Siap!</h2>
      <p>Pastikan hasil pengamatan tentang alas, tinggi, dan visualisasi pengisian sudah kamu catat di e-module.</p>
      <p>Data ini akan kamu gunakan pada tahap berikutnya untuk mengolah informasi tentang hubungan volume prisma dan limas.</p>
      <button type="button" id="btn-selesai-m7" class="btn-primary">Selesai Eksplorasi AR</button>
    </div>
  </div>
`
