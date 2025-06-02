document.addEventListener('DOMContentLoaded', () => {
  /*
   * Fungsi activateTab:
   * Mengatur tampilan tab agar hanya tab yang dipilih yang aktif (terlihat),
   * dan tombol tab yang sesuai diberi class 'active' untuk styling.
   * @param {string} tabId - ID tab yang ingin diaktifkan
   */
  function activateTab(tabId) {
    // Loop semua tombol tab dan aktifkan yang sesuai tabId
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    // Loop semua konten tab dan tampilkan yang sesuai tabId
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === tabId);
    });
  }

  /*
   * Menambahkan tombol baru "Statistik Umat" ke navigasi tab.
   * Tombol ini digunakan untuk membuka tab statistik.
   */
  const nav = document.querySelector('.nav');
  const statistikBtn = document.createElement('button');
  statistikBtn.className = 'tab-button';
  statistikBtn.setAttribute('data-tab', 'statistik');
  statistikBtn.textContent = 'Statistik Umat';
  nav.appendChild(statistikBtn);

  /*
   * Membuat section baru berisi data statistik umat dalam bentuk tabel.
   * Section ini akan muncul saat tab Statistik dipilih.
   */
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

  /*
   * Menambahkan event listener pada semua tombol tab.
   * Saat tombol diklik, akan memanggil activateTab untuk menampilkan konten tab yang sesuai.
   */
  nav.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      activateTab(button.dataset.tab);
    });
  });

  /*
   * Mengaktifkan tab pertama secara otomatis saat halaman selesai dimuat.
   * Agar tidak tampil kosong pada awal.
   */
  const firstTab = nav.querySelector('.tab-button');
  if (firstTab) activateTab(firstTab.dataset.tab);

  /*
   * Mengatur indikator kehadiran pastor dengan memberi warna hijau jika "Ada"
   * dan merah jika "Tidak Ada".
   * Juga mengganti teks agar konsisten "Ada" atau "Tidak Ada".
   */
  document.querySelectorAll('.indicator').forEach(indicator => {
    const text = indicator.textContent.toLowerCase();
    const isHadir = text.includes('ada');
    indicator.classList.remove('green', 'red');
    indicator.classList.add(isHadir ? 'green' : 'red');
    indicator.textContent = isHadir ? 'Ada' : 'Tidak Ada';
  });

  /*
   * Pengingat Doa Angelus setiap pukul 6:00, 12:00, dan 18:00 tepat.
   * Mengecek setiap menit dengan setInterval.
   * Jika waktu sesuai, tampilkan alert pengingat.
   */
  setInterval(() => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    if ((h === 6 || h === 12 || h === 18) && m === 0) {
      alert("\ud83d\udd14 Waktu untuk Doa Angelus. Mari kita berdoa.");
    }
  }, 60000);
});
