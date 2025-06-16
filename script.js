document.addEventListener('DOMContentLoaded', () => {
  // Fungsi untuk mengaktifkan tab
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

  // --- HELPER FUNCTION: Parsing data Liturgi dari JSON ---
  // Fungsi ini digunakan untuk kalender liturgi (kalender_liturgi_2025.json)
  // karena format judulnya mengandung simbol dan indikator yang perlu di-parse.
  function parseLiturgicalData(item) {
      const colorMap = {
          '⚪': 'white', // Putih
          '🔴': 'red',   // Merah
          '🟢': 'green',  // Hijau
          '💜': 'purple', // Ungu
          '⚫': 'black',  // Hitam
          '🟪': 'rose',   // Mawar
          '🔵': 'blue'    // Biru
      };

      let titleText = item.judul || '';
      let colorSymbol = '';
      let indicator = '';

      // Extract color symbol and remove from titleText
      const colorRegex = /^(⚪|🔴|🟢|💜|⚫|🟪|🔵)\s*/;
      const colorMatch = titleText.match(colorRegex);
      if (colorMatch) {
          colorSymbol = colorMatch[1];
          titleText = titleText.substring(colorSymbol.length).trim();
      }

      // Extract indicator (e.g., [H], [Pw]) and remove from titleText
      const indicatorRegex = /^\[(.*?)\]\s*(.*)/;
      const indicatorMatch = titleText.match(indicatorRegex);
      if (indicatorMatch) {
          indicator = indicatorMatch[1];
          titleText = indicatorMatch[2].trim();
      }

      let rawDescription = typeof item.deskripsi === 'string' ? item.deskripsi : "";
      // Replace double backslashes first, then single newlines
      rawDescription = rawDescription.replace(/\\\\n/g, "\n").replace(/\\\\/g, "\\");

      let psalterWeek = '';
      let mainDescription = rawDescription;

      // Extract Psalter Week (and clean it up)
      const psalterWeekRegex = /(Pekan Psalter|Psalter Week)\s+([IVXLCDM]+|[0-9]+)\s*/i; // Capture "Pekan Psalter" or "Psalter Week" + Roman/Arabic numeral
      const psalterMatch = rawDescription.match(psalterWeekRegex);
      if (psalterMatch) {
          psalterWeek = psalterMatch[0].trim(); // Get the matched part
          // Remove psalter week from main description
          mainDescription = mainDescription.replace(psalterWeekRegex, '').trim();
      }

      // Remove source information (Provided by GCatholic.org and URL)
      mainDescription = mainDescription.replace(/𝘗𝘳𝘰𝘷𝘪𝘥𝘦𝘥 𝘣𝘺 𝐆𝐂𝐚𝐭𝐡𝐨𝘭𝐢𝘤\.𝐨𝐫𝐠.*|https:\/\/gcatholic\.org.*|Add calendar of 2025:.*|Add calendar of 2026:.*|https:\/\/g catholic\.org.*/g, '').trim();


      // Replace remaining single newlines with <br> for HTML display
      mainDescription = mainDescription.replace(/\n/g, '<br>');

      // Clean up empty parentheses if they remain
      mainDescription = mainDescription.replace(/^\s*\(\s*\)\s*$/, '').trim();

      return {
          tanggal: item.tanggal,
          perayaan: titleText,
          color: colorMap[colorSymbol] || 'default', // Fallback color
          indicator: indicator,
          mainDescription: mainDescription,
          psalterWeek: psalterWeek
      };
  }

  // --- LITURGI MINGGUAN ---
  // Memuat data liturgi minggu ini dan minggu depan
  fetch('liturgi_mingguan.json')
    .then(res => res.json())
    .then(data => {
      const { minggu_ini, minggu_depan } = data;
      const container = document.getElementById('liturgi-container');
      if (container) { // Pastikan kontainer ada

        // Map warna dari bahasa Indonesia ke kelas CSS yang sesuai
        const colorNameToClassMap = {
            "Hijau": "green",
            "Merah": "red",
            "Putih": "white",
            "Ungu": "purple",
            "Hitam": "black",
            "Mawar": "rose",
            "Biru": "blue"
        };
        const liturgiColorClass = colorNameToClassMap[minggu_ini.warna] || 'default';


        // Tampilan baru untuk Liturgi Minggu Ini
        container.innerHTML = `
          <div class="liturgi-card">
              <div class="liturgi-header">
                  <span class="liturgi-date">${minggu_ini.tanggal}</span>
                  <span class="liturgi-color-dot ${liturgiColorClass}"></span>
              </div>
              <div class="liturgi-body">
                  <h5 class="liturgi-perayaan">${minggu_ini.peringatan}</h5>
                  <div class="liturgi-detail">
                      <p><i class="bi bi-book-fill me-2"></i><strong>Bacaan 1:</strong> ${minggu_ini.bacaan1}</p>
                      <p><i class="bi bi-book-fill me-2"></i><strong>Bacaan 2:</strong> ${minggu_ini.bacaan2}</p>
                      <p><i class="bi bi-music-note-beamed me-2"></i><strong>Mazmur Tanggapan:</strong> ${minggu_ini.mazmur}</p>
                      <p><i class="bi bi-journal-medical me-2"></i><strong>Bacaan Injil:</strong> ${minggu_ini.injil}</p>
                      <p><i class="bi bi-palette-fill me-2"></i><strong>Warna Liturgi:</strong> ${minggu_ini.warna}</p>
                  </div>
                  <div class="liturgi-renungan">
                      <h6><i class="bi bi-lightbulb-fill me-2"></i>Renungan</h6>
                      <p style="text-align: justify;">${minggu_ini.renungan}</p>
                  </div>
              </div>
          </div>
        `;
      }

      // Preview Minggu Depan tetap menggunakan GLightbox
      const preview = document.getElementById('previewMingguDepan');
      if (preview) { // Pastikan tombol preview ada
        preview.setAttribute('data-glightbox', `title: Bacaan & Renungan Minggu Depan; description:
            <b>Tanggal:</b> ${minggu_depan.tanggal}<br/>
            <b>Peringatan:</b> ${minggu_depan.peringatan}<br/>
            <b>Bacaan 1:</b> ${minggu_depan.bacaan1}<br/>
            <b>Bacaan 2:</b> ${minggu_depan.bacaan2}<br/>
            <b>Mazmur Tanggapan:</b> ${minggu_depan.mazmur}<br/>
            <b>Bacaan Injil:</b> ${minggu_depan.injil}<br/>
            <b>Warna Liturgi:</b> ${minggu_depan.warna}<br/><br/>
            <b>Renungan:</b><br/>${minggu_depan.renungan}`);

        GLightbox({ selector: '.glightbox', touchNavigation: true, loop: false });
      }
    })
    .catch(err => {
      const container = document.getElementById('liturgi-container');
      if (container) {
        container.innerHTML = '<p class="text-danger">Gagal memuat data liturgi mingguan.</p>';
      }
      console.error('Gagal memuat data liturgi mingguan:', err);
    });


  // --- AGENDA / PENGUMUMAN ---
  // Memuat data agenda dan menampilkannya dengan desain baru dan GLightbox
  fetch('agenda_pengumuman.json')
    .then(res => res.json())
    .then(data => {
      const container = document.querySelector('#agenda-container'); // Menggunakan ID yang lebih spesifik
      if (container) {
        container.innerHTML = ''; // Kosongkan dulu

        data.agenda.forEach((item, i) => {
          const card = document.createElement('div');
          card.className = 'col-lg-6 col-md-12 mb-4'; // Menyesuaikan lebar kolom untuk responsive

          // Konten GLightbox
          const glightboxContent = `
            <h6><i class="bi bi-calendar-event me-2"></i><strong>Judul:</strong> ${item.judul}</h6>
            <p><i class="bi bi-calendar me-2"></i><strong>Tanggal:</strong> ${item.tanggal}</p>
            <p><i class="bi bi-clock me-2"></i><strong>Jam:</strong> ${item.jam}</p>
            <p><i class="bi bi-geo-alt me-2"></i><strong>Lokasi:</strong> ${item.lokasi}</p>
            <p><i class="bi bi-info-circle me-2"></i><strong>Catatan:</strong> ${item.catatan}</p>
          `;

          card.innerHTML = `
            <div class="card shadow-sm h-100 agenda-card animate-fadein">
              <div class="card-body d-flex flex-column">
                <h5 class="card-title text-primary"><i class="bi bi-bookmark-fill me-2"></i>${item.judul}</h5>
                <p class="card-text">
                  <small class="text-muted"><i class="bi bi-calendar me-1"></i> ${item.tanggal} | <i class="bi bi-clock me-1"></i> ${item.jam}</small><br>
                  <small class="text-muted"><i class="bi bi-geo-alt me-1"></i> ${item.lokasi}</small>
                </p>
                <!-- Tombol Lihat Detail sekarang di dalam aliran dokumen, bukan absolut -->
                <a href="#" class="btn btn-sm btn-outline-primary agenda-detail-btn mt-auto"
                   data-glightbox="title: ${item.judul}; description: ${glightboxContent}">
                  Lihat Detail <i class="bi bi-arrow-right-circle-fill ms-1"></i>
                </a>
              </div>
            </div>
          `;
          container.appendChild(card);
        });

        // Inisialisasi GLightbox setelah semua elemen agenda dimuat
        GLightbox({
          selector: '.agenda-detail-btn',
          touchNavigation: true,
          loop: false,
          zoomable: false,
          autoplayVideos: false,
        });
      }
    })
    .catch(err => {
      const container = document.querySelector('#agenda-container');
      if (container) {
        container.innerHTML = '<p class="text-danger">Gagal memuat agenda.</p>';
      }
      console.error('Error loading agenda:', err);
    });

  // --- STATISTIK UMAT ---
  // Memuat data statistik umat dan menampilkannya
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

      // Pastikan ada elemen main untuk menambahkan section ini
      const mainElement = document.querySelector('main');
      if (mainElement) {
        mainElement.insertAdjacentHTML('beforeend', statistikHTML);
      }
    })
    .catch(err => {
      console.error('Gagal memuat statistik umat:', err);
    });

  // --- KEHADIRAN PASTOR ---
  // Memuat data kehadiran pastor dan menampilkannya
  fetch('pastor_kehadiran.json')
    .then(res => res.json())
    .then(data => {
      const container = document.querySelector('#pastor');
      if (container) { // Pastikan kontainer ada
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
      }
    })
    .catch(err => {
      console.error('Gagal memuat data kehadiran pastor:', err);
      const container = document.querySelector('#pastor');
      if (container) {
        container.innerHTML = '<p class="text-danger">Gagal memuat informasi pastor.</p>';
      }
    });


  // --- TENTANG PAROKI ---
  // Menambahkan konten Tentang Paroki secara dinamis
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
              { id: 7, name: 'Pra-Paroki | P. Herman Saroinsong, Pr. (Alm)', img: 'pastor-Herman.jpg', masa: '2008 - 2011' }
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
  const mainElement = document.querySelector('main');
  if (mainElement) {
    mainElement.appendChild(tentangSection);
  }

  // Event listener untuk tombol tab (navigasi sidebar)
  const nav = document.querySelector('.nav');
  if (nav) {
    nav.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', () => {
        activateTab(button.dataset.tab);
      });
    });

    // Aktifkan tab pertama saat DOMContentLoaded
    const firstTab = nav.querySelector('.tab-button');
    if (firstTab) activateTab(firstTab.dataset.tab);
  }

  // --- KALENDER LITURGI ---
  fetch('kalender_liturgi_2025.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('kalender-paroki-container');
      if (!container) {
        console.warn('Elemen #kalender-paroki-container tidak ditemukan.');
        return;
      }

      let tableHtml = `
          <div class="table-responsive">
            <table class="table table-bordered table-striped align-middle liturgical-calendar-table">
              <thead>
                <tr>
                  <th style="width: 150px;">Tanggal</th>
                  <th>Perayaan</th>
                  <th>Deskripsi</th>
                </tr>
              </thead>
              <tbody>
          `;

      data.forEach(item => {
        const parsedData = parseLiturgicalData(item);
        const formattedTanggal = new Date(parsedData.tanggal).toLocaleDateString("id-ID", {
          weekday: "long", year: "numeric", month: "long", day: "numeric"
        });

        // Calculate rowspan for the date column
        let rowspanValue = 1; // Minimum 1 row for celebration
        if (parsedData.mainDescription) {
          rowspanValue++;
        }
        if (parsedData.psalterWeek) {
          rowspanValue++;
        }

        tableHtml += `
            <tr>
              <td rowspan="${rowspanValue}" class="date-cell">
                <div class="date-display">${formattedTanggal}</div>
              </td>
              <td class="liturgical-color-dot-cell">
                <span class="liturgical-color-dot ${parsedData.color}"></span>
              </td>
              <td class="liturgical-celebration">
                ${parsedData.indicator ? `<span class="liturgical-indicator">[${parsedData.indicator}]</span>&nbsp;` : ''}
                ${parsedData.perayaan}
              </td>
            </tr>`;

        if (parsedData.mainDescription) {
          tableHtml += `
            <tr>
              <td></td> <!-- Kolom kosong untuk tanggal -->
              <td class="liturgical-description-cell" colspan="2">
                ${parsedData.mainDescription}
              </td>
            </tr>`;
        }

        if (parsedData.psalterWeek) {
          tableHtml += `
            <tr>
              <td></td> <!-- Kolom kosong untuk tanggal -->
              <td class="liturgical-psalter-week-cell" colspan="2">
                ${parsedData.psalterWeek}
              </td>
            </tr>`;
        }
      });

      tableHtml += '</tbody></table></div>';
      container.innerHTML = tableHtml;
    })
    .catch(err => {
      console.error('Gagal memuat kalender liturgi:', err);
      const container = document.getElementById('kalender-paroki-container');
      if (container) {
        container.innerHTML = '<p class="text-danger">Gagal memuat kalender liturgi.</p>';
      }
    });

  // --- MEMUAT SEJARAH PAUS ---
  fetch('popes.json')
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById('popes-container');
      if (!container) {
        console.warn('Elemen #popes-container tidak ditemukan.');
        return;
      }

      let popesHtml = `
          <div class="table-responsive">
              <table class="table table-bordered table-striped popes-table">
                  <thead>
                      <tr>
                          <th>No.</th>
                          <th>Nama Paus</th>
                          <th>Masa Jabatan</th>
                      </tr>
                  </thead>
                  <tbody>
      `;

      data.forEach(pope => {
        popesHtml += `
            <tr>
                <td>${pope.nomor}</td>
                <td>${pope.nama}</td>
                <td>${pope.masa_jabatan}</td>
            </tr>
        `;
      });

      popesHtml += `
                  </tbody>
              </table>
          </div>
      `;
      container.innerHTML = popesHtml;
    })
    .catch(err => {
      console.error('Gagal memuat sejarah Paus:', err);
      const container = document.getElementById('popes-container');
      if (container) {
        container.innerHTML = '<p class="text-danger">Gagal memuat data sejarah Paus.</p>';
      }
    });

  // --- PENGINGAT DOA ANGELUS ---
  // Pastikan Anda tidak menggunakan alert() karena tidak akan terlihat di iframe
  // Ganti dengan modal kustom jika ingin menampilkan pengingat visual
  // setInterval(() => {
  //   const now = new Date();
  //   if ([6, 12, 18].includes(now.getHours()) && now.getMinutes() === 0 && now.getSeconds() === 0) {
  //     alert('Waktu Doa Angelus telah tiba. Mari berdoa bersama.');
  //   }
  // }, 1000);

  // --- TOGGLE SIDEBAR ---
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

  // --- INISIALISASI GALERI (dari script yang ada di index.html, dipindahkan ke sini) ---
  // Pastikan elemen #galeriDokumentasi dan tombolnya ada di HTML
  let lightbox = null;
  const galeri = document.getElementById('galeriDokumentasi');
  const btnGroup = document.getElementById('btnKegiatan'); // Pastikan ID ini ada di HTML Anda

  function loadGaleri(jsonFile, folder) {
    if (!galeri) { // Tambahkan cek null untuk galeri
      console.error('Elemen #galeriDokumentasi tidak ditemukan.');
      return;
    }
    fetch(jsonFile)
      .then(res => res.json())
      .then(fotoList => {
        galeri.innerHTML = ''; // Clear galeri dulu
        fotoList.forEach(filename => {
          const a = document.createElement('a');
          a.href = `dokumentasi/${folder}/${filename}`;
          a.className = 'glightbox';
          a.setAttribute('data-gallery', folder);
          a.setAttribute('data-type', 'image');

          const img = document.createElement('img');
          img.src = `dokumentasi/${folder}/${filename}`;
          img.alt = filename;

          a.appendChild(img);
          galeri.appendChild(a);
        });

        // Inisialisasi ulang lightbox jika sudah ada
        if (lightbox) lightbox.destroy();

        lightbox = GLightbox({
          selector: `a.glightbox[data-gallery="${folder}"]`,
          touchNavigation: true,
          loop: true,
          zoomable: true,
          autoplayVideos: false,
        });
      })
      .catch(err => {
        galeri.innerHTML = '<p>Gagal memuat galeri foto.</p>';
        console.error('Error load galeri:', err);
      });
  }

  // Event listener tombol kegiatan (hanya jalankan jika btnGroup ada)
  if (btnGroup) {
    btnGroup.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        // Hilangkan active di tombol lain
        btnGroup.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const jsonFile = btn.getAttribute('data-json');
        const folder = btn.getAttribute('data-folder');

        loadGaleri(jsonFile, folder);
      });
    });

    // Load galeri default (yang aktif)
    const defaultBtn = btnGroup.querySelector('button.active');
    if (defaultBtn) {
      loadGaleri(defaultBtn.getAttribute('data-json'), defaultBtn.getAttribute('data-folder'));
    }
  }

  // Inisialisasi Particles.js (dipindahkan dari index.html)
  particlesJS("particles-js", {
    particles: {
      number: { value: 100, density: { enable: true, value_area: 1000 } },
      color: { value: "#FEFCFF" },
      shape: { type: "circle" },
      opacity: { value: 1 },
      size: { value: 2 },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#FEFCFF",
        opacity: 0.8,
        width: 1
      },
      move: { enable: true, speed: 4 }
    },
    interactivity: { events: { onhover: { enable: true, mode: "grab" } } },
    retina_detect: true
  });

}); // Penutup DOMContentLoaded
