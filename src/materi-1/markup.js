// Materi 1 guided flow (PRD F1-F11): a sequence of full-screen steps layered over the AR canvas,
// plus a slim prompt/action bar during the exploration step itself. Injected into #materi-1-root
// by ./index.js so the whole materi lives in this one folder.
export const MATERI1_MARKUP = `
  <div id="screen-awal" class="screen">
    <div class="screen-inner">
      <h1>Ayo Lanjutkan Eksplorasimu!</h1>
      <p>Gunakan Augmented Reality (AR) untuk mengamati bangun ruang dari berbagai arah. Pilih bangun yang perlu kamu amati untuk melengkapi informasi yang masih diperlukan.</p>
      <button id="btn-mulai-ar" class="btn-primary">Mulai AR</button>
    </div>
  </div>

  <div id="screen-persiapan" class="screen hidden">
    <div class="screen-inner">
      <p>Arahkan kamera ke permukaan datar dan cukup terang.</p>
      <p class="hint">Permukaan terdeteksi. Ketuk untuk menempatkan model.</p>
      <button id="btn-persiapan-lanjut" class="btn-primary">Ketuk untuk Menempatkan Model</button>
    </div>
  </div>

  <div id="screen-pilih-bangun" class="screen hidden">
    <div class="screen-inner">
      <h2>Pilih Bangun Ruang</h2>
      <p>Pilih bangun yang perlu kamu amati sesuai informasi yang masih kamu perlukan.</p>
      <div id="bangun-grid" class="grid-buttons">
        <button type="button" class="btn-bangun" data-shape="kubus">Kubus</button>
        <button type="button" class="btn-bangun" data-shape="balok">Balok</button>
        <button type="button" class="btn-bangun" data-group="prisma">Prisma</button>
        <button type="button" class="btn-bangun" data-group="limas">Limas</button>
      </div>
      <div id="bangun-sub" class="grid-buttons hidden">
        <button type="button" class="btn-bangun" data-shape-n="3">Segitiga</button>
        <button type="button" class="btn-bangun" data-shape-n="4">Segiempat</button>
        <button type="button" class="btn-bangun" data-shape-n="5">Segilima</button>
        <div class="segi-n-row">
          <label for="segi-n-slider">Segi-n (<span id="segi-n-value">6</span>)</label>
          <input type="range" id="segi-n-slider" min="3" max="12" value="6">
          <button type="button" id="btn-pilih-segi-n" class="btn-secondary">Pilih Segi-n</button>
        </div>
      </div>
    </div>
  </div>

  <div id="screen-pilih-aspek" class="screen hidden">
    <div class="screen-inner">
      <h2>Apa yang ingin kamu amati lebih jelas?</h2>
      <p>Pilih informasi yang ingin kamu amati lebih jelas. Kamu tidak harus mengamati semuanya.</p>
      <div id="aspek-list" class="aspek-list"></div>
      <button type="button" id="btn-aspek-lanjut" class="btn-primary" disabled>Lanjutkan</button>
    </div>
  </div>

  <div id="eksplorasi-bar" class="hidden">
    <div id="eksplorasi-prompt"></div>
    <div id="eksplorasi-legend" class="hidden">Perbesar model &middot; Putar model &middot; Lihat dari sisi lain</div>
    <div class="eksplorasi-buttons">
      <button type="button" id="btn-lihat-jelas" class="btn-secondary">Lihat Lebih Jelas</button>
      <button type="button" id="btn-transparansi" class="btn-secondary">Transparansi Model</button>
      <button type="button" id="btn-catat" class="btn-primary">Catat Hasil</button>
    </div>
  </div>

  <div id="screen-catat" class="screen hidden">
    <div class="screen-inner">
      <p>Apa yang kamu temukan? Catat hasil pengamatan AR pada tabel di e-module.</p>
      <button type="button" id="btn-amati-aspek-lain" class="btn-secondary">Amati Aspek Lain</button>
      <button type="button" id="btn-cek-kecukupan" class="btn-primary">Periksa Kecukupan Data</button>
    </div>
  </div>

  <div id="screen-kecukupan" class="screen hidden">
    <div class="screen-inner">
      <p>Apakah hasil pengamatan AR sudah melengkapi informasi yang kamu perlukan?</p>
      <div id="kecukupan-step1">
        <button type="button" id="btn-sudah-cukup" class="btn-primary">Sudah Cukup</button>
        <button type="button" id="btn-perlu-tambahan" class="btn-secondary">Perlu Data Tambahan</button>
      </div>
      <div id="kecukupan-step2" class="hidden">
        <p>Apa yang ingin kamu lakukan?</p>
        <button type="button" id="btn-amati-aspek-lain-2" class="btn-secondary">Amati Aspek Lain</button>
        <button type="button" id="btn-amati-bangun-lain" class="btn-secondary">Amati Bangun Lain</button>
      </div>
    </div>
  </div>

  <div id="screen-selesai" class="screen hidden">
    <div class="screen-inner">
      <h2>Eksplorasi AR Selesai</h2>
      <p>Gunakan hasil pengamatan GeoGebra 3D dan AR untuk melengkapi data yang kamu perlukan. Pastikan hasil pengamatanmu cukup untuk menyelidiki dugaan kelompok.</p>
      <button type="button" id="btn-selesai-eksplorasi" class="btn-primary">Selesai Eksplorasi AR</button>
    </div>
  </div>
`
