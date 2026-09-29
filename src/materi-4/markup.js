// Materi 4 guided flow (PRD-materi-4.md 4.1-4.11). Full-screen steps are static; the bottom
// "eksplorasi bar" (prompt/hint/info/action buttons) is filled in by ./index.js per aspect step.
export const MATERI4_MARKUP = `
  <div id="screen-awal-m4" class="screen">
    <div class="screen-inner">
      <h1>Ayo Mengeksplorasi dengan AR!</h1>
      <p>Lengkapi informasi untuk menyelidiki dugaan kelompokmu. Amati alas, sisi tegak, dan ukuran yang diperlukan pada limas.</p>
      <p class="hint">Kamu sedang mengumpulkan informasi. Belum saatnya menentukan kesimpulan akhir.</p>
      <button id="btn-mulai-m4" class="btn-primary">Mulai Eksplorasi</button>
    </div>
  </div>

  <div id="screen-pilih-limas-m4" class="screen hidden">
    <div class="screen-inner">
      <h2>Pilih Limas</h2>
      <p>Pilih limas yang ingin kamu amati. Kamu tidak harus mengamati semua jenis limas.</p>
      <div id="limas-grid-m4" class="grid-buttons">
        <button type="button" class="btn-bangun" data-n="3">Limas Segitiga</button>
        <button type="button" class="btn-bangun" data-n="4">Limas Segiempat</button>
        <button type="button" class="btn-bangun" data-n="5">Limas Segilima</button>
        <button type="button" class="btn-bangun" id="btn-limas-segin-m4">Limas Segi-n</button>
      </div>
      <div id="limas-segin-row-m4" class="segi-n-row hidden">
        <label for="segi-n-slider-m4">Alas segi-<span id="segi-n-value-m4">6</span></label>
        <input type="range" id="segi-n-slider-m4" min="3" max="12" value="6">
        <button type="button" id="btn-pilih-segi-n-m4" class="btn-secondary">Pilih Limas Ini</button>
      </div>
      <button type="button" id="btn-limas-kembali-m4" class="btn-secondary hidden">Kembali</button>
    </div>
  </div>

  <div id="screen-tempatkan-m4" class="screen hidden">
    <div class="screen-inner">
      <p id="tempatkan-prompt-m4">Arahkan kamera ke permukaan datar.</p>
      <button id="btn-tempatkan-m4" class="btn-primary">Ketuk untuk Menempatkan Limas</button>
      <p class="hint" style="margin-top:12px">Limas tidak muncul atau kamera bermasalah? Pastikan izin kamera aktif dan ruangan cukup terang, lalu coba lagi.</p>
    </div>
  </div>

  <div id="screen-menu-aspek-m4" class="screen hidden">
    <div class="screen-inner">
      <h2>Apa yang Ingin Kamu Selidiki?</h2>
      <p>Pilih satu atau lebih. Kamu tidak harus memilih semuanya.</p>
      <div id="aspek-list-m4" class="aspek-list"></div>
      <button type="button" id="btn-aspek-lanjut-m4" class="btn-primary" disabled>Lanjutkan</button>
      <button type="button" id="btn-geogebra-menu-m4" class="btn-secondary hidden" style="margin-top:10px">Bandingkan dengan GeoGebra</button>
      <button type="button" id="btn-menu-kecukupan-m4" class="btn-secondary" style="margin-top:10px">Periksa Kecukupan Data</button>
    </div>
  </div>

  <div id="eksplorasi-bar-m4" class="hidden">
    <div id="m4-controls">
      <button type="button" id="btn-m4-putar" aria-label="Putar" title="Putar">&#8635;</button>
      <button type="button" id="btn-m4-geser" aria-label="Geser" title="Geser (seret dengan satu jari)">&#8596;</button>
      <button type="button" id="btn-m4-besar" aria-label="Perbesar" title="Perbesar">+</button>
      <button type="button" id="btn-m4-kecil" aria-label="Perkecil" title="Perkecil">&minus;</button>
      <button type="button" id="btn-m4-reset" aria-label="Reset" title="Reset">&#8962;</button>
    </div>
    <div id="m4-prompt"></div>
    <div id="m4-hint" class="hidden"></div>
    <div id="m4-info" class="hidden"></div>
    <div id="m4-actions"></div>
    <div id="m4-trailer">
      <button type="button" id="btn-m4-kembali-menu" class="btn-secondary">Kembali ke Aspek Pengamatan</button>
      <button type="button" id="btn-m4-kecukupan" class="btn-secondary">Periksa Kecukupan Data</button>
    </div>
  </div>

  <div id="screen-catat-m4" class="screen hidden">
    <div class="screen-inner">
      <h2>Catat Temuanmu</h2>
      <p>Apa yang kamu temukan dari bangun ini? Catat hasil pengamatanmu pada tabel Catatan Hasil Eksplorasi di e-module.</p>
      <button type="button" id="btn-m4-lanjut-antrean" class="btn-primary hidden" style="margin-bottom:10px">Lanjut ke Aspek Terpilih Berikutnya</button>
      <button type="button" id="btn-m4-ulang" class="btn-secondary hidden"></button>
      <button type="button" id="btn-m4-geogebra-catat" class="btn-secondary hidden">Bandingkan dengan GeoGebra</button>
      <button type="button" id="btn-m4-amati-lain" class="btn-secondary">Amati Aspek Lain</button>
      <button type="button" id="btn-m4-cek-catat" class="btn-primary">Periksa Kecukupan Data</button>
    </div>
  </div>

  <div id="screen-geogebra-m4" class="screen hidden">
    <div class="screen-inner">
      <h2>Bandingkan dengan GeoGebra</h2>
      <p id="geogebra-prompt-m4"></p>
      <button type="button" id="btn-geogebra-lanjut-m4" class="btn-primary" style="margin-bottom:10px">Lanjut</button>
      <button type="button" id="btn-geogebra-tutup-m4" class="btn-secondary">Kembali ke Aspek Pengamatan</button>
    </div>
  </div>

  <div id="screen-kecukupan-m4" class="screen hidden">
    <div class="screen-inner">
      <p>Apakah informasi yang kamu kumpulkan sudah cukup untuk menyelidiki kaitan alas dan sisi tegak dengan luas seluruh permukaan limas?</p>
      <div id="kecukupan-step1-m4">
        <button type="button" id="btn-sudah-cukup-m4" class="btn-primary" style="margin-bottom:10px">Sudah Cukup</button>
        <button type="button" id="btn-perlu-tambahan-m4" class="btn-secondary">Perlu Data Tambahan</button>
        <button type="button" id="btn-kecukupan-kembali-m4" class="btn-secondary">Kembali</button>
      </div>
      <div id="kecukupan-step2-m4" class="hidden">
        <p>Informasi apa yang masih kamu perlukan?</p>
        <button type="button" id="btn-amati-aspek-lain-m4" class="btn-secondary">Amati Aspek Lain dari Limas Ini</button>
        <button type="button" id="btn-bandingkan-limas-m4" class="btn-secondary">Bandingkan dengan Limas Lain</button>
      </div>
    </div>
  </div>

  <div id="screen-bandingkan-limas-m4" class="screen hidden">
    <div class="screen-inner">
      <h2>Bandingkan Dua Limas</h2>
      <p id="bandingkan-limas-judul-m4"></p>
      <p>Apa persamaan dan perbedaan alas dan sisi tegak kedua limas ini?</p>
      <p>Bagian apa saja yang sama-sama perlu kamu perhatikan saat menyelidiki luas permukaan keduanya?</p>
      <button type="button" id="btn-bandingkan-limas-lanjut-m4" class="btn-primary">Lanjut Menyelidiki</button>
    </div>
  </div>

  <div id="screen-selesai-m4" class="screen hidden">
    <div class="screen-inner">
      <h2>Data Eksplorasimu Sudah Siap!</h2>
      <p>Kamu telah mengumpulkan informasi tentang alas, sisi tegak, ukuran, dan luas bagian-bagian limas melalui GeoGebra dan AR.</p>
      <p>Pastikan semua temuanmu sudah tercatat di e-module. Data ini akan kamu gunakan pada tahap berikutnya.</p>
      <button type="button" id="btn-selesai-m4" class="btn-primary">Selesai Eksplorasi AR</button>
    </div>
  </div>
`
