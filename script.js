// Fungsi aktifkan tab berdasarkan ID
function activateTab(tabId) {
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });
}

// Konten Statistik dan Tentang dimasukkan ke halaman saat siap
function insertTabContent() {
  const main = document.querySelector('main');

  main.insertAdjacentHTML('beforeend', `
    <section id="statistik" class="tab-content">
      <h2>Statistik Umat per Tahun</h2>
      <div class="overflow-auto">
        <table class="stats-table">
          <thead>
            <tr>
              <th>No</th><th>Nama Wilayah</th><th>KK</th>
              <th>Laki-laki</th><th>Perempuan</th><th>Jumlah Jiwa</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>St. Fransiskus Asisi Sinisir</td><td>23</td><td>41</td><td>30</td><td>71</td></tr>
            <tr><td>2</td><td>St. Dominikus Sinisir</td><td>22</td><td>28</td><td>31</td><td>59</td></tr>
            <tr><td>3</td><td>St. Ignasius Sinisir</td><td>20</td><td>24</td><td>25</td><td>49</td></tr>
            <tr><td>4</td><td>Sta. Skolastika Sinisir</td><td>26</td><td>39</td><td>32</td><td>71</td></tr>
            <tr style="font-weight:bold; background:#e0f7fa">
              <td colspan="2">Jumlah</td><td>91</td><td>132</td><td>118</td><td>250</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `);

 // Tambahkan konten Tentang Paroki
  const tentangSection = document.createElement('section');
  tentangSection.className = 'tab-content';
  tentangSection.id = 'tentang';
  tentangSection.innerHTML = `
    <h2 class="mt-4">Tentang Paroki</h2>

    <div class="card shadow-sm border rounded p-3 mb-4 animate-fadein">
      <b>Sejarah Singkat</b>
      <p style="text-align: justify;">
        Paroki Santa Perawan Maria Ratu Rosari Modoinding merupakan Gereja Paroki Katolik yang terletak di Jl. Trans Sulawesi, Desa Sinisir, Jaga VIII, Kecamatan Modoinding, Kabupaten Minahasa Selatan 95358 Provinsi Sulawesi Utara. Paroki ini didedikasikan kepada Santa Perawan Maria dengan gelar Ratu Rosari dan berada di bawah yurisdiksi Keuskupan Manado. Sebelum berstatus paroki sendiri, umat Katolik Sinisir dulunya adalah Stasi dan termasuk dalam wilayah Paroki St. Paulus Tompaso Baru. Menurut catatan keuskupan, buku baptis paroki Sinisir mulai dicatat sejak tahun 2007, sehingga Paroki Maria Ratu Rosari Modoinding mulai aktif pada pertengahan dekade 2000-an (sekitar 2007) sebagai pemekaran dari paroki sebelumnya.
		Paroki Maria Ratu Rosari Modoinding merupakan bagian Kevikepan Stella Maris yang berada di bawah Keuskupan Manado. Dengan demikian, paroki ini secara langsung berkoordinasi dengan Uskup Manado dalam setiap kegiatan rohani dan administratif.
		</P><P><b>Paroki ini mempunyai 5 Stasi yakni diantaranya:</b></p>
		<p>- STASI SANTA THERESIA MAKAAROYEN -</p>
		<p>- STASI HATI KUDUS YESUS MOBUYA -</p>
		<p>- STASI REX MUNDI TAMBELANG -</p>
		<p>- STASI SANTO ANDREAS KINAMANG -</p>
		<p>- STASI CHRISTUS REX LININGAAN -</p>
    </div>

    <div class="card shadow-sm border rounded p-3 animate-fadein">
      <h5>Pastor Paroki & Pastor Rekan Paroki</h5>
      <div class="accordion" id="accordionPastor">

        <div class="accordion-item">
          <h2 class="accordion-header" id="pastor2">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePastor2">
              <b>P. Joseph Ansow, Pr.</b>
            </button>
          </h2>
          <div id="collapsePastor2" class="accordion-collapse collapse" aria-labelledby="pastor2">
            <div class="accordion-body text-center">
              <img src="pastor-joseph.jpg" class="img-fluid rounded shadow-sm mb-2" style="max-height:200px;" />
              <b><p>Masa Jabatan: 2025 - Sekarang</p></b>
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <h2 class="accordion-header" id="pastor3">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePastor3">
              <b>P. Stenly Ambun, Pr. (Pastor Rekan Paroki)</b>
            </button>
          </h2>
          <div id="collapsePastor3" class="accordion-collapse collapse" aria-labelledby="pastor3">
            <div class="accordion-body text-center">
              <img src="pastor-stenly.jpg" class="img-fluid rounded shadow-sm mb-2" style="max-height:200px;" />
              <b><p>Masa Jabatan: 2024 - Sekarang</p></b>
            </div>
          </div>
        </div>
		
		 <div class="accordion-item">
          <h2 class="accordion-header" id="pastor4">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePastor4">
              <b>P. Feighty Y. Boseke, Pr. (Alm)</b>
            </button>
          </h2>
          <div id="collapsePastor4" class="accordion-collapse collapse" aria-labelledby="pastor4">
            <div class="accordion-body text-center">
              <img src="pastor-feighty.jpg" class="img-fluid rounded shadow-sm mb-2" style="max-height:200px;" />
              <b><p>Masa Jabatan: 2017 - 2024</p></b>
            </div>
          </div>
        </div>

        		 <div class="accordion-item">
          <h2 class="accordion-header" id="pastor5">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePastor5">
              <b>P. Stevy Motto, Pr.</b>
            </button>
          </h2>
          <div id="collapsePastor5" class="accordion-collapse collapse" aria-labelledby="pastor5">
            <div class="accordion-body text-center">
              <img src="pastor-stevy.jpg" class="img-fluid rounded shadow-sm mb-2" style="max-height:200px;" />
              <b><p>Masa Jabatan: 2014 - 2017</p></b>
            </div>
          </div>
        </div>

          <div class="accordion-item">
          <h2 class="accordion-header" id="pastor6">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePastor6">
              <b>P. Yan S. Koraag, Pr.</b>
            </button>
          </h2>
          <div id="collapsePastor6" class="accordion-collapse collapse" aria-labelledby="pastor6">
            <div class="accordion-body text-center">
              <img src="pastor-yan.jpg" class="img-fluid rounded shadow-sm mb-2" style="max-height:200px;" />
              <b><p>Masa Jabatan: 2011 - 2014</p></b>
            </div>
          </div>
        </div>

        <div class="accordion-item">
          <h2 class="accordion-header" id="pastor7">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePastor7">
              <b>Pra-Paroki | P. Herman Saroinsong, Pr. (Alm)</b>
            </button>
          </h2>
          <div id="collapsePastor7" class="accordion-collapse collapse" aria-labelledby="pastor7">
            <div class="accordion-body text-center">
              <img src="pastor-Herman.jpg" class="img-fluid rounded shadow-sm mb-2" style="max-height:200px;" />
              <b><p>Masa Jabatan: 2011 - 2014</p></b>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.querySelector('main').appendChild(tentangSection);
}

// Set indikator "Ada" atau "Tidak Ada" dari teks isi span.indicator
function updateIndicators() {
  document.querySelectorAll('.indicator').forEach(ind => {
    const isi = ind.textContent.toLowerCase();
    ind.classList.remove('green', 'red');
    const hadir = isi.includes('ada');
    ind.classList.add(hadir ? 'green' : 'red');
    ind.textContent = hadir ? 'Ada' : 'Tidak Ada';
  });
}

// Penanda waktu Angelus 6-12-18
function angelusReminder() {
  setInterval(() => {
    const now = new Date();
    if ([6, 12, 18].includes(now.getHours()) && now.getMinutes() === 0) {
      alert('\u{1F514} Waktu untuk Doa Angelus. Mari kita berdoa.');
    }
  }, 60000);
}

// Jalankan setelah halaman siap
window.addEventListener('DOMContentLoaded', () => {
  insertTabContent();
  updateIndicators();
  angelusReminder();

  // Aktifkan navigasi tab
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => activateTab(button.dataset.tab));
  });

  const first = document.querySelector('.tab-button');
  if (first) activateTab(first.dataset.tab);
});
