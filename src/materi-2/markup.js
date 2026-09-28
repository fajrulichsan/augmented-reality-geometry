// Materi 2 guided flow (PRD-materi-2.md A1-A12): jaring-jaring 2D placement, observing it before
// folding, an animated 2D->3D fold with playback controls, then per-aspect exploration. Injected
// into #materi-2-root by ./index.js so the whole materi lives in this one folder.
export const MATERI2_MARKUP = `
  <div id="screen-awal-m2" class="screen">
    <div class="screen-inner">
      <h1>Ayo Bereksplorasi dengan AR!</h1>
      <p>Ayo lengkapi informasi untuk menyelidiki dugaan kelompokmu!</p>
      <p>Amati jaring-jaring dan proses terbentuknya bangun ruang secara langsung melalui Augmented Reality. Perhatikan perubahan posisi sisi, sisi-sisi yang bertemu, dan proses pelipatannya untuk memperoleh informasi yang kamu perlukan.</p>
      <p class="hint">💡 Ingat! Kamu sedang mengumpulkan informasi, belum menentukan kesimpulan akhir.</p>
      <button id="btn-mulai-ar-m2" class="btn-primary">Mulai Eksplorasi AR</button>
    </div>
  </div>

  <div id="screen-persiapan-m2" class="screen hidden">
    <div class="screen-inner">
      <p>Arahkan kamera ke permukaan datar.</p>
      <p class="hint">Permukaan terdeteksi. Ketuk permukaan untuk menempatkan model.</p>
      <button id="btn-persiapan-lanjut-m2" class="btn-primary">Ketuk untuk Menempatkan Model</button>
    </div>
  </div>

  <div id="screen-pilih-bangun-m2" class="screen hidden">
    <div class="screen-inner">
      <h2>Pilih Bangun Ruang yang Ingin Kamu Amati</h2>
      <p>Pilih bangun yang kamu perlukan untuk melengkapi informasi hasil eksplorasimu. Kamu tidak harus mengamati semua bangun.</p>
      <div id="bangun-grid-m2" class="grid-buttons">
        <button type="button" class="btn-bangun" data-shape="kubus">Kubus</button>
        <button type="button" class="btn-bangun" data-shape="balok">Balok</button>
        <button type="button" class="btn-bangun" data-group="prisma">Prisma</button>
        <button type="button" class="btn-bangun" data-group="limas">Limas</button>
      </div>
      <div id="bangun-sub-m2" class="grid-buttons hidden">
        <button type="button" class="btn-bangun" data-shape-n="3">Segitiga</button>
        <button type="button" class="btn-bangun" data-shape-n="4">Segiempat</button>
        <button type="button" class="btn-bangun" data-shape-n="5">Segilima</button>
        <div class="segi-n-row">
          <label for="segi-n-slider-m2">Segi-n (<span id="segi-n-value-m2">6</span>)</label>
          <input type="range" id="segi-n-slider-m2" min="3" max="12" value="6">
          <button type="button" id="btn-pilih-segi-n-m2" class="btn-secondary">Pilih Segi-n</button>
        </div>
      </div>
    </div>
  </div>

  <div id="screen-amati-jaring-m2" class="screen hidden">
    <div class="screen-inner">
      <p>Amati jaring-jaring sebelum dilipat. Bergeraklah mengelilingi model dan perhatikan posisi setiap sisinya.</p>
      <p class="hint">Perbesar model &middot; Putar model &middot; Lihat dari berbagai arah</p>
      <button type="button" id="btn-mulai-lipat-awal" class="btn-primary">Mulai Lipat</button>
    </div>
  </div>

  <div id="fold-bar-m2" class="hidden">
    <div id="fold-status-m2" class="hidden"></div>
    <div id="fold-prompt-m2"></div>
    <div id="fold-hint-m2" class="hidden"></div>
    <div id="fold-controls-m2" class="hidden">
      <div class="fold-slider-row">
        <span>0%</span>
        <input type="range" id="fold-slider-m2" min="0" max="100" value="0">
        <span>100%</span>
      </div>
      <div class="fold-transport">
        <button type="button" id="btn-fold-playpause" class="btn-secondary">▶ Lipat</button>
        <button type="button" id="btn-fold-reopen" class="btn-secondary">↶ Buka Kembali</button>
        <button type="button" id="btn-fold-repeat" class="btn-secondary">↻ Ulangi</button>
      </div>
    </div>
    <div class="fold-actions">
      <button type="button" id="btn-fold-hint" class="btn-secondary hidden">Butuh Petunjuk?</button>
      <button type="button" id="btn-fold-lanjut" class="btn-primary hidden">Lanjut</button>
      <button type="button" id="btn-fold-catat" class="btn-primary hidden" disabled>Catat Hasil</button>
    </div>
  </div>

  <div id="screen-pilih-aspek-m2" class="screen hidden">
    <div class="screen-inner">
      <h2>Apa yang Ingin Kamu Selidiki?</h2>
      <p>Pilih informasi yang kamu perlukan untuk melengkapi penyelidikan dugaan kelompokmu. Kamu tidak harus mengamati semuanya.</p>
      <div id="aspek-list-m2" class="aspek-list"></div>
      <button type="button" id="btn-aspek-lanjut-m2" class="btn-primary" disabled>Lanjutkan</button>
    </div>
  </div>

  <div id="screen-catat-m2" class="screen hidden">
    <div class="screen-inner">
      <h2>Catat Temuanmu</h2>
      <p>Apa informasi penting yang kamu peroleh dari pengamatan AR ini? Catat hasil pengamatanmu pada kolom Hasil Eksplorasi Augmented Reality (AR) pada tabel di e-module.</p>
      <button type="button" id="btn-amati-aspek-lain-m2" class="btn-secondary">Amati Aspek Lain</button>
      <button type="button" id="btn-cek-kecukupan-m2" class="btn-primary">Periksa Kecukupan Data</button>
    </div>
  </div>

  <div id="screen-kecukupan-m2" class="screen hidden">
    <div class="screen-inner">
      <h2>Apakah Informasimu Sudah Cukup?</h2>
      <p>Apakah informasi dari eksplorasi AR sudah cukup untuk melengkapi data yang diperlukan dalam menyelidiki dugaan kelompokmu?</p>
      <div id="kecukupan-step1-m2">
        <button type="button" id="btn-sudah-cukup-m2" class="btn-primary">Sudah Cukup</button>
        <button type="button" id="btn-perlu-tambahan-m2" class="btn-secondary">Perlu Data Tambahan</button>
      </div>
      <div id="kecukupan-step2-m2" class="hidden">
        <p>Data apa yang masih kamu perlukan?</p>
        <button type="button" id="btn-amati-aspek-lain-2-m2" class="btn-secondary">Amati Aspek Lain</button>
        <button type="button" id="btn-amati-bangun-lain-m2" class="btn-secondary">Bandingkan dengan Bangun Lain</button>
      </div>
    </div>
  </div>

  <div id="screen-selesai-m2" class="screen hidden">
    <div class="screen-inner">
      <h2>Eksplorasimu Sudah Lengkap</h2>
      <p>Kamu telah memperoleh informasi tambahan melalui Augmented Reality. Pastikan hasil pengamatan GeoGebra 3D dan AR telah dicatat pada Tabel Hasil Pengamatan di e-module. Gunakan data tersebut pada tahap berikutnya untuk mengolah informasi dan menyelidiki pola hubungan antara bangun ruang dan jaring-jaringnya.</p>
      <button type="button" id="btn-selesai-eksplorasi-m2" class="btn-primary">Selesai Eksplorasi AR</button>
    </div>
  </div>
`
