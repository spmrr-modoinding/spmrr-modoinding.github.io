document.addEventListener('DOMContentLoaded', () => {

  // Fungsi untuk mengaktifkan tab konten sesuai tombol sidebar
  function activateTab(tabId) {
    // Menandai tombol sidebar yang aktif
    document.querySelectorAll('.tab-button').forEach(btn => {
      // Hanya ubah status 'active' jika tombol memiliki data-tab
      if (btn.dataset.tab) {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
      }
    });
    // Menampilkan konten yang sesuai
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === tabId);
    });

    // Di mobile, tutup sidebar setelah memilih menu
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (window.innerWidth <= 768 && sidebarMenu.classList.contains('active')) {
      sidebarMenu.classList.remove('active');
      document.body.classList.remove('sidebar-open');
      document.getElementById('sidebarToggleBtn').classList.remove('active');
    }
  }

  // --- HELPER FUNCTION: Parsing data Liturgi dari JSON (untuk kalender) ---
  function parseLiturgicalData(item) {
      const colorMap = {
          '⚪': 'white', '🔴': 'red', '🟢': 'green', '💜': 'purple', 
          '⚫': 'black', '🟪': 'rose', '🔵': 'blue'
      };
      let titleText = item.judul || '';
      let colorSymbol = '', indicator = '';
      const colorMatch = titleText.match(/^(⚪|🔴|🟢|💜|⚫|🟪|🔵)\s*/);
      if (colorMatch) {
          colorSymbol = colorMatch[1];
          titleText = titleText.substring(colorSymbol.length).trim();
      }
      const indicatorMatch = titleText.match(/^\[(.*?)\]\s*(.*)/);
      if (indicatorMatch) {
          indicator = indicatorMatch[1];
          titleText = indicatorMatch[2].trim();
      }
      let rawDescription = (typeof item.deskripsi === 'string' ? item.deskripsi : "").replace(/\\\\n/g, "\n").replace(/\\\\/g, "\\");
      let psalterWeek = '', mainDescription = rawDescription;
      const psalterMatch = rawDescription.match(/(Pekan Psalter|Psalter Week)\s+([IVXLCDM]+|[0-9]+)\s*/i);
      if (psalterMatch) {
          psalterWeek = psalterMatch[0].trim();
          mainDescription = mainDescription.replace(psalterMatch[0], '').trim();
      }
      mainDescription = mainDescription.replace(/𝘗𝘳𝘰𝘷𝘪𝘥𝘦𝘥 𝘣𝘺 𝐆𝐂𝐚𝐭𝐡𝐨𝐥𝐢𝐜\.𝐨𝐫𝐠.*|https:\/\/gcatholic\.org.*|Add calendar.*|https:\/\/g catholic\.org.*/gi, '').replace(/\n/g, '<br>').trim();
      return { tanggal: item.tanggal, perayaan: titleText, color: colorMap[colorSymbol] || 'default', indicator, mainDescription, psalterWeek };
  }

  // --- PENGENDALI EVENT ---

  // 1. Sidebar & Tombol Toggle
  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarMenu = document.getElementById('sidebarMenu');
  if (sidebarToggleBtn && sidebarMenu) {
    sidebarToggleBtn.addEventListener('click', () => {
      sidebarMenu.classList.toggle('active');
      sidebarToggleBtn.classList.toggle('active');
      document.body.classList.toggle('sidebar-open');
    });
    // Menutup sidebar jika klik di luar area (overlay) pada mode mobile
    document.body.addEventListener('click', (event) => {
        if (window.innerWidth <= 768 && document.body.classList.contains('sidebar-open') &&
            !sidebarMenu.contains(event.target) && !sidebarToggleBtn.contains(event.target)) {
            sidebarMenu.classList.remove('active');
            sidebarToggleBtn.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    });
  }

  // 2. Tombol Navigasi Tab di Sidebar
  const sidebarNav = document.querySelector('#sidebarMenu .nav');
  if (sidebarNav) {
    sidebarNav.querySelectorAll('.tab-button[data-tab]').forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault(); 
        activateTab(button.dataset.tab);
      });
    });
  }

  // --- MEMUAT KONTEN DINAMIS ---

  // 1. Liturgi Mingguan & Renungan (untuk Beranda)
  fetch('liturgi_mingguan.json').then(res => res.json()).then(data => {
      const { minggu_ini, minggu_depan } = data;
      // ================= PERUBAHAN DI SINI: Mengambil dua container baru =================
      const bacaanContainer = document.getElementById('liturgi-bacaan-container');
      const renunganContainer = document.getElementById('liturgi-renungan-container');
      const previewBtn = document.getElementById('previewMingguDepan');
      
      if (bacaanContainer && renunganContainer) {
          const colorMap = {"Hijau": "green", "Merah": "red", "Putih": "white", "Ungu": "purple", "Hitam": "black", "Mawar": "rose", "Biru": "blue"};
          
          // Mengisi container KARTU BACAAN (tanpa renungan)
          bacaanContainer.innerHTML = `
            <div class="liturgi-card">
                <div class="liturgi-header">
                    <span class="liturgi-date">${minggu_ini.tanggal}</span>
                    <span class="liturgi-color-dot ${colorMap[minggu_ini.warna] || 'default'}"></span>
                </div>
                <div class="liturgi-body">
                    <h5 class="liturgi-perayaan">${minggu_ini.peringatan}</h5>
                    <div class="liturgi-detail">
                        <p><i class="bi bi-book-fill me-2"></i><strong>Bacaan 1:</strong> ${minggu_ini.bacaan1}</p>
                        <p><i class="bi bi-book-fill me-2"></i><strong>Bacaan 2:</strong> ${minggu_ini.bacaan2}</p>
                        <p><i class="bi bi-music-note-beamed me-2"></i><strong>Mazmur:</strong> ${minggu_ini.mazmur}</p>
                        <p><i class="bi bi-journal-medical me-2"></i><strong>Injil:</strong> ${minggu_ini.injil}</p>
                        <p><i class="bi bi-palette-fill me-2"></i><strong>Warna:</strong> ${minggu_ini.warna}</p>
                    </div>
                </div>
            </div>`;

          // Mengisi container RENUNGAN secara terpisah
          renunganContainer.innerHTML = `<p>${minggu_ini.renungan}</p>`;
      }
      
      if (previewBtn) {
          previewBtn.setAttribute('data-glightbox', `title: Bacaan & Renungan Minggu Depan; description: <b>Tanggal:</b> ${minggu_depan.tanggal}<br/><b>Peringatan:</b> ${minggu_depan.peringatan}<br/><b>Bacaan 1:</b> ${minggu_depan.bacaan1}<br/><b>Bacaan 2:</b> ${minggu_depan.bacaan2}<br/><b>Mazmur:</b> ${minggu_depan.mazmur}<br/><b>Injil:</b> ${minggu_depan.injil}<br/><b>Warna:</b> ${minggu_depan.warna}<br/><br/><b>Renungan:</b><br/>${minggu_depan.renungan}`);
      }
  }).catch(console.error);

  // 2. Agenda / Pengumuman
  fetch('agenda_pengumuman.json').then(res => res.json()).then(data => {
      const container = document.querySelector('#agenda-container');
      if (container) {
          container.innerHTML = data.agenda.map(item => {
              const glightboxContent = `<h6><i class="bi bi-calendar-event me-2"></i><strong>Judul:</strong> ${item.judul}</h6><p><i class="bi bi-calendar me-2"></i><strong>Tanggal:</strong> ${item.tanggal}</p><p><i class="bi bi-clock me-2"></i><strong>Jam:</strong> ${item.jam}</p><p><i class="bi bi-geo-alt me-2"></i><strong>Lokasi:</strong> ${item.lokasi}</p><p><i class="bi bi-info-circle me-2"></i><strong>Catatan:</strong> ${item.catatan}</p>`;
              return `
                <div class="col-lg-6 col-md-12 mb-4">
                  <div class="card shadow-sm h-100 agenda-card">
                    <div class="card-body d-flex flex-column">
                      <h5 class="card-title text-primary"><i class="bi bi-bookmark-fill me-2"></i>${item.judul}</h5>
                      <p class="card-text">
                        <small class="text-muted"><i class="bi bi-calendar me-1"></i> ${item.tanggal} | <i class="bi bi-clock me-1"></i> ${item.jam}</small><br>
                        <small class="text-muted"><i class="bi bi-geo-alt me-1"></i> ${item.lokasi}</small>
                      </p>
                      <a href="#" class="btn btn-sm btn-outline-primary agenda-detail-btn mt-auto" data-glightbox="title: ${item.judul}; description: ${glightboxContent.replace(/"/g, '&quot;')}">Lihat Detail <i class="bi bi-arrow-right-circle-fill ms-1"></i></a>
                    </div>
                  </div>
                </div>`;
          }).join('');
          GLightbox({ selector: '.agenda-detail-btn' });
      }
  }).catch(console.error);

  // 3. Statistik Umat
  fetch('statistik_umat.json').then(res => res.json()).then(data => {
      const container = document.querySelector('#statistik');
      if (container) {
          let totalKK = 0, totalL = 0, totalP = 0, totalJiwa = 0;
          const rows = data.wilayah.map((w, i) => {
              totalKK += w.kk; totalL += w.laki_laki; totalP += w.perempuan; totalJiwa += w.jumlah;
              return `<tr><td>${i + 1}</td><td>${w.nama}</td><td>${w.kk}</td><td>${w.laki_laki}</td><td>${w.perempuan}</td><td>${w.jumlah}</td></tr>`;
          }).join('');
          const totalRow = `<tr style="font-weight:bold; background:#e0f7fa"><td colspan="2">Jumlah</td><td>${totalKK}</td><td>${totalL}</td><td>${totalP}</td><td>${totalJiwa}</td></tr>`;
          container.innerHTML = `
              <h2>Statistik Umat per Tahun</h2>
              <div class="overflow-auto">
                  <table class="stats-table">
                      <thead><tr><th>No</th><th>Nama Wilayah</th><th>KK</th><th>Laki-laki</th><th>Perempuan</th><th>Jumlah Jiwa</th></tr></thead>
                      <tbody>${rows}${totalRow}</tbody>
                  </table>
              </div>`;
      }
  }).catch(console.error);
  
  // 4. Kehadiran Pastor (untuk Profil Pastor)
  fetch('pastor_kehadiran.json').then(res => res.json()).then(data => {
      const container = document.querySelector('#pastor');
      if (container) {
          const statusItems = data.pastor.map(p => {
              const hadir = p.kehadiran.trim().toLowerCase() === 'ada';
              return `
                <div>
                  <img alt="${p.nama}" class="pastor-photo" src="${p.foto}" />
                  <p>${p.nama}</p>
                  <span class="indicator ${hadir ? 'green' : 'red'}">${hadir ? 'Di Tempat' : 'Tidak di Tempat'}</span>
                </div>`;
          }).join('');
          container.innerHTML = `
              <h2>Kehadiran Pastor Hari Ini</h2>
              <div class="pastor-status">${statusItems}</div>
              <p class="mt-3" style="font-size: 0.9rem; color: #555;">
                  Keterangan:<br/>
                  <span class="indicator green" style="padding: 2px 10px;">Di Tempat</span> = Pastor berada di pastoran.<br/>
                  <span class="indicator red" style="padding: 2px 10px;">Tidak di Tempat</span> = Pastor sedang pelayanan di luar.
              </p>`;
      }
  }).catch(console.error);

  // 5. Tentang Paroki
  const tentangContainer = document.querySelector('#tentang');
  if (tentangContainer) {
    const pastorList = [
        { id: 2, name: 'P. Joseph Ansow, Pr.', img: 'pastor-joseph.jpg', masa: '2025 - Sekarang' },
        { id: 3, name: 'P. Stenly Ambun, Pr. (Pastor Rekan Paroki)', img: 'pastor-stenly.jpg', masa: '2024 - Sekarang' },
        { id: 4, name: 'P. Feighty Y. Boseke, Pr. (Alm)', img: 'pastor-feighty.jpg', masa: '2017 - 2024' },
        { id: 5, name: 'P. Stevy Motto, Pr.', img: 'pastor-stevy.jpg', masa: '2014 - 2017' },
        { id: 6, name: 'P. Yan S. Koraag, Pr.', img: 'pastor-yan.jpg', masa: '2011 - 2014' },
        { id: 7, name: 'Pra-Paroki | P. Herman Saroinsong, Pr. (Alm)', img: 'pastor-Herman.jpg', masa: '2008 - 2011' }
    ];
    tentangContainer.innerHTML = `
        <h2 class="mt-4">Tentang Paroki</h2>
        <div class="card shadow-sm border rounded p-3 mb-4">
            <b>Sejarah Singkat</b>
            <p style="text-align: justify;">Paroki Santa Perawan Maria Ratu Rosari Modoinding merupakan Gereja Paroki Katolik yang terletak di Jl. Trans Sulawesi, Desa Sinisir, Jaga VIII, Kecamatan Modoinding, Kabupaten Minahasa Selatan 95358 Provinsi Sulawesi Utara. Paroki ini didedikasikan kepada Santa Perawan Maria dengan gelar Ratu Rosari dan berada di bawah yurisdiksi Keuskupan Manado...</p>
            <p><b>Paroki ini mempunyai 5 Stasi yakni diantaranya:</b></p>
            <p>- STASI SANTA THERESIA MAKAAROYEN -<br>- STASI HATI KUDUS YESUS MOBUYA -<br>- STASI REX MUNDI TAMBELANG -<br>- STASI SANTO ANDREAS KINAMANG -<br>- STASI CHRISTUS REX LININGAAN -</p>
        </div>
        <div class="card shadow-sm border rounded p-3">
            <h5>Pastor Paroki & Pastor Rekan Paroki</h5>
            <div class="accordion" id="accordionPastor">
                ${pastorList.map(p => `
                  <div class="accordion-item">
                    <h2 class="accordion-header" id="pastor${p.id}">
                      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePastor${p.id}"><b>${p.name}</b></button>
                    </h2>
                    <div id="collapsePastor${p.id}" class="accordion-collapse collapse" data-bs-parent="#accordionPastor">
                      <div class="accordion-body text-center">
                        <img src="${p.img}" class="img-fluid rounded shadow-sm mb-2" style="max-height:200px;" alt="${p.name}" />
                        <b><p>Masa Jabatan: ${p.masa}</p></b>
                      </div>
                    </div>
                  </div>`).join('')}
            </div>
        </div>`;
  }

  // 6. Kalender Paroki
  fetch('kalender_liturgi_2025.json').then(res => res.json()).then(data => {
      const container = document.getElementById('kalender-paroki-container');
      if (container) {
          const tableRows = data.map(item => {
              const parsed = parseLiturgicalData(item);
              const date = new Date(parsed.tanggal).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
              return `
                <tr>
                    <td class="date-cell"><div class="date-display">${date}</div></td>
                    <td class="liturgical-color-dot-cell"><span class="liturgical-color-dot ${parsed.color}"></span></td>
                    <td class="liturgical-celebration">
                        ${parsed.indicator ? `<span class="liturgical-indicator">[${parsed.indicator}]</span>` : ''} ${parsed.perayaan}
                        ${parsed.mainDescription ? `<div class="liturgical-description-cell">${parsed.mainDescription}</div>` : ''}
                        ${parsed.psalterWeek ? `<div class="liturgical-psalter-week-cell">${parsed.psalterWeek}</div>` : ''}
                    </td>
                </tr>`;
          }).join('');
          container.innerHTML = `
              <div class="table-responsive">
                  <table class="table table-bordered table-striped align-middle liturgical-calendar-table">
                      <thead><tr><th style="width: 150px;">Tanggal</th><th colspan="2">Perayaan</th></tr></thead>
                      <tbody>${tableRows}</tbody>
                  </table>
              </div>`;
      }
  }).catch(console.error);

  // 7. Sejarah Paus
  fetch('popes.json').then(res => res.json()).then(data => {
      const container = document.getElementById('popes-container');
      if (container) {
          const rows = data.map(pope => `<tr><td>${pope.nomor}</td><td>${pope.nama}</td><td>${pope.masa_jabatan}</td></tr>`).join('');
          container.innerHTML = `
              <div class="table-responsive">
                  <table class="table table-bordered table-striped popes-table">
                      <thead><tr><th>No.</th><th>Nama Paus</th><th>Masa Jabatan</th></tr></thead>
                      <tbody>${rows}</tbody>
                  </table>
              </div>`;
      }
  }).catch(console.error);

  // Inisialisasi GLightbox untuk berbagai galeri
  GLightbox({ selector: 'a.glightbox[data-gallery="pastor-beranda"]' });

  // Inisialisasi Particles.js
  if (typeof particlesJS !== 'undefined') {
    particlesJS("particles-js", {
        particles: { number: { value: 80 }, color: { value: "#ffffff" }, shape: { type: "circle" }, opacity: { value: 0.5, anim: { enable: false } }, size: { value: 3, random: true }, line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 }, move: { enable: true, speed: 6 } },
        interactivity: { events: { onhover: { enable: true, mode: "repulse" } } },
        retina_detect: true
    });
  }

  // Aktifkan tab pertama (beranda) saat halaman selesai dimuat
  activateTab('beranda');
});