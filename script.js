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
fetch('agenda_pengumuman.json')
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector('#agenda .row');
    container.innerHTML = ''; // Kosongkan dulu

    data.agenda.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'col';

      card.innerHTML = `
        <div class="card shadow-sm animate-fadein">
          <div class="card-body">
            <h5 class="card-title">${item.judul}</h5>
            <p class="card-text">
              <strong>Tanggal:</strong> ${item.tanggal}<br/>
              <strong>Jam:</strong> ${item.jam}<br/>
              <strong>Lokasi:</strong> ${item.lokasi}<br/>
              <strong>Catatan:</strong> ${item.catatan}
            </p>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => {
    document.querySelector('#agenda .row').innerHTML =
      '<p class="text-danger">Gagal memuat agenda.</p>';
    console.error('Error loading agenda:', err);
  });

  const nav = document.querySelector('.nav');

  // Tambahkan konten Statistik Umat
fetch('statistik_umat.json')
  .then(res => res.json())
  .then(data => {
    const wilayahList = data.wilayah;
    let totalKK = 0, totalL = 0, totalP = 0, totalJiwa = 0;

    const rows = wilayahList.map((w, i) => {
      totalKK += w.kk;
      totalL += w.laki_laki;
      totalP += w.perempuan;
      totalJiwa += w.jumlah;
      return `<tr>
        <td>${i + 1}</td>
        <td>${w.nama}</td>
        <td>${w.kk}</td>
        <td>${w.laki_laki}</td>
        <td>${w.perempuan}</td>
        <td>${w.jumlah}</td>
      </tr>`;
    }).join('');

    const totalRow = `<tr style="font-weight:bold; background:#e0f7fa">
      <td colspan="2">Jumlah</td>
      <td>${totalKK}</td>
      <td>${totalL}</td>
      <td>${totalP}</td>
      <td>${totalJiwa}</td>
    </tr>`;

    const statistikHTML = `
      <section class="tab-content" id="statistik">
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
              ${rows}
              ${totalRow}
            </tbody>
          </table>
        </div>
      </section>`;

    document.querySelector('main').insertAdjacentHTML('beforeend', statistikHTML);
  })
  .catch(err => {
    console.error('Gagal memuat statistik umat:', err);
  });

fetch('pastor_kehadiran.json')
  .then(res => res.json())
  .then(data => {
    const container = document.querySelector('#pastor');
    container.innerHTML = `<h2>Kehadiran Pastor Hari Ini</h2>`;

    const statusWrapper = document.createElement('div');
    statusWrapper.className = 'pastor-status';

    data.pastor.forEach(p => {
      const hadir = p.kehadiran.trim().toLowerCase();
      const status = hadir === 'ada' ? 'Di Tempat' : 'Tidak di Tempat';
      const colorClass = hadir === 'ada' ? 'green' : 'red';

      const item = document.createElement('div');
      item.innerHTML = `
        <img alt="${p.nama}" class="pastor-photo" src="${p.foto}" />
        <p>${p.nama}</p>
        <span class="indicator ${colorClass}">${status}</span>
      `;
      statusWrapper.appendChild(item);
    });

    container.appendChild(statusWrapper);

    // Tambahkan keterangan
    const keterangan = document.createElement('p');
    keterangan.className = 'mt-3';
    keterangan.style = 'font-size: 0.9rem; color: #555;';
    keterangan.innerHTML = `
      Keterangan:<br/>
      <span class="indicator green" style="padding: 2px 10px;">Di Tempat</span> = Pastor berada di pastoran.<br/>
      <span class="indicator red" style="padding: 2px 10px;">Tidak di Tempat</span> = Pastor sedang pelayanan di luar.
    `;

    container.appendChild(keterangan);
  })
  .catch(err => {
    console.error('Gagal memuat data kehadiran pastor:', err);
    document.querySelector('#pastor').innerHTML =
      '<p class="text-danger">Gagal memuat informasi pastor.</p>';
  });


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