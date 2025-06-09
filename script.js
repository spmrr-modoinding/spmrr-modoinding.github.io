document.addEventListener('DOMContentLoaded', () => {
function activateTab(tabId) {
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });

  // Di mobile, tutup sidebar dengan hapus class 'active' saja
  const sidebarMenu = document.getElementById('sidebarMenu');
  if (window.innerWidth <= 768 && sidebarMenu) {
    sidebarMenu.classList.remove('active');
  }
}


  const nav = document.querySelector('.nav');

  // Tambahkan konten Statistik Umat
  const statistikSection = document.createElement('section');
  statistikSection.className = 'tab-content';
  statistikSection.id = 'statistik';
  statistikSection.innerHTML = `
    <h2>Statistik Umat per Tahun</h2>
    <div class="overflow-auto">
      <table class="stats-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Wilayah</th>
            <th>KK</th>
            <th>Laki-laki</th>
            <th>Perempuan</th>
            <th>Jumlah Jiwa</th>
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
  `;
  document.querySelector('main').appendChild(statistikSection);

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
      </p>
      <p><b>Paroki ini mempunyai 5 Stasi yakni diantaranya:</b></p>
      <p>- STASI SANTA THERESIA MAKAAROYEN -</p>
      <p>- STASI HATI KUDUS YESUS MOBUYA -</p>
      <p>- STASI REX MUNDI TAMBELANG -</p>
      <p>- STASI SANTO ANDREAS KINAMANG -</p>
      <p>- STASI CHRISTUS REX LININGAAN -</p>
    </div>
    <div class="card shadow-sm border rounded p-3 animate-fadein">
      <h5>Pastor Paroki & Pastor Rekan Paroki</h5>
      <div class="accordion" id="accordionPastor">
        ${[
          { id: 2, name: 'P. Joseph Ansow, Pr.', img: 'pastor-joseph.jpg', masa: '2025 - Sekarang' },
          { id: 3, name: 'P. Stenly Ambun, Pr. (Pastor Rekan Paroki)', img: 'pastor-stenly.jpg', masa: '2024 - Sekarang' },
          { id: 4, name: 'P. Feighty Y. Boseke, Pr. (Alm)', img: 'pastor-feighty.jpg', masa: '2017 - 2024' },
          { id: 5, name: 'P. Stevy Motto, Pr.', img: 'pastor-stevy.jpg', masa: '2014 - 2017' },
          { id: 6, name: 'P. Yan S. Koraag, Pr.', img: 'pastor-yan.jpg', masa: '2011 - 2014' },
          { id: 7, name: 'Pra-Paroki | P. Herman Saroinsong, Pr. (Alm)', img: 'pastor-Herman.jpg', masa: '2011 - 2014' }
        ].map(p => `
          <div class="accordion-item">
            <h2 class="accordion-header" id="pastor${p.id}">
              <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePastor${p.id}">
                <b>${p.name}</b>
              </button>
            </h2>
            <div id="collapsePastor${p.id}" class="accordion-collapse collapse" aria-labelledby="pastor${p.id}">
              <div class="accordion-body text-center">
                <img src="${p.img}" class="img-fluid rounded shadow-sm mb-2" style="max-height:200px;" />
                <b><p>Masa Jabatan: ${p.masa}</p></b>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  `;
  document.querySelector('main').appendChild(tentangSection);

  // Event listener tab
  nav.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      activateTab(button.dataset.tab);
    });
  });

  // Aktifkan tab pertama
  const firstTab = nav.querySelector('.tab-button');
  if (firstTab) activateTab(firstTab.dataset.tab);

  // Indikator kehadiran pastor
  document.querySelectorAll('.indicator').forEach(indicator => {
    const text = indicator.textContent.toLowerCase();
    const isHadir = text.includes('ada');
    indicator.classList.remove('green', 'red');
    indicator.classList.add(isHadir ? 'green' : 'red');
    indicator.textContent = isHadir ? 'Ada' : 'Tidak Ada';
  });

  // Pengingat Doa Angelus
  setInterval(() => {
    const now = new Date();
    if ([6, 12, 18].includes(now.getHours()) && now.getMinutes() === 0 && now.getSeconds() === 0) {
      alert('Waktu Doa Angelus telah tiba. Mari berdoa bersama.');
    }
  }, 1000);

  // Toggle sidebar - versi final
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarMenu = document.getElementById('sidebarMenu');
  if (sidebarToggleBtn && sidebarMenu) {
sidebarToggleBtn.addEventListener('click', () => {
  if (window.innerWidth <= 768) {
    sidebarMenu.classList.toggle('active');
  } else {
    sidebarMenu.classList.toggle('collapsed');
  }
});

}
});