// ========================================================
// === BAGIAN 1: KONFIGURASI DAN INISIALISASI FIREBASE ===
// ========================================================
const firebaseConfig = {
    apiKey: "AIzaSyC-KNi0YqnlxtzkeoemEFWN5xusjxpWV_I",
    authDomain: "paroki-modoinding.firebaseapp.com",
    projectId: "paroki-modoinding",
    storageBucket: "paroki-modoinding.appspot.com",
    messagingSenderId: "615770618729",
    appId: "1:615770618729:web:0f6d67c62512c21f2e5bf8",
    measurementId: "G-ECLMPR9NJ2"
};

// Inisialisasi Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', () => {

  // =================================================================
  // === BAGIAN 2: FUNGSI-FUNGSI UNTUK MEMUAT DATA DARI FIREBASE ===
  // =================================================================

  const loadAnnouncementsPublic = async () => {
      const container = document.querySelector('#agenda-container');
      if (!container) return;
      container.innerHTML = '<p>Memuat agenda terbaru...</p>';
      try {
          const snapshot = await db.collection('announcements').orderBy('createdAt', 'desc').get();
          if (snapshot.empty) {
              container.innerHTML = '<p>Saat ini belum ada agenda / pengumuman terbaru.</p>';
              return;
          }
          container.innerHTML = snapshot.docs.map(doc => {
              const item = doc.data();
              const catatanFormatted = (item.catatan || 'Tidak ada catatan.').replace(/\n/g, '<br>');
              
              return `
              <div class="col-12 mb-4">
                <div class="card shadow-sm agenda-card">
                  <div class="card-body">
                    <h5 class="card-title text-primary">
                      <i class="bi bi-bookmark-fill me-2"></i>${item.judul}
                    </h5>
                    <div class="mt-3 pt-3 border-top">
                      <p class="mb-2"><i class="bi bi-calendar-event me-2"></i><strong>Tanggal:</strong> ${item.tanggal || '-'}</p>
                      <p class="mb-2"><i class="bi bi-clock me-2"></i><strong>Jam:</strong> ${item.jam || '-'}</p>
                      <p class="mb-2"><i class="bi bi-geo-alt-fill me-2"></i><strong>Lokasi:</strong> ${item.lokasi || '-'}</p>
                      <p class="mb-0 mt-3"><i class="bi bi-info-circle-fill me-2"></i><strong>Catatan:</strong><br><span class="d-inline-block mt-1 ps-4">${catatanFormatted}</span></p>
                    </div>
                  </div>
                </div>
              </div>`;
          }).join('');

      } catch (error) {
          console.error("Gagal memuat pengumuman: ", error);
          container.innerHTML = `<p class="text-danger">Terjadi kesalahan saat memuat agenda. Error: ${error.message}</p>`;
      }
  };
  
  // ======================================================================
  // === FUNGSI LITURGI DENGAN LOGIKA TANGGAL YANG DIPERBAIKI ===
  // ======================================================================
  const loadActiveLiturgy = async () => {
    const flippers = {
        title: document.getElementById('title-flipper'),
        bacaan: document.getElementById('bacaan-flipper'),
        renungan: document.getElementById('renungan-flipper')
    };
    const containers = {
        bacaanFront: document.getElementById('bacaan-flipper-front'),
        bacaanBack: document.getElementById('bacaan-flipper-back'),
        renunganCurrent: document.getElementById('renungan-current-text'),
        renunganNext: document.getElementById('renungan-next-text'),
        tombol: document.getElementById('tombol-flip-container')
    };

    const createLiturgiCardHTML = (lit) => {
      const colorMap = { "Hijau": "green", "Merah": "red", "Putih": "white", "Ungu": "purple", "Hitam": "black", "Mawar": "rose", "Biru": "blue" };
      return `
          <div class="liturgi-card">
              <div class="liturgi-header"><span class="liturgi-date">${lit.tanggal}</span><span class="liturgi-color-dot ${colorMap[lit.warna] || 'default'}"></span></div>
              <div class="liturgi-body">
                  <h5 class="liturgi-perayaan">${lit.peringatan}</h5>
                  <div class="liturgi-detail">
                      <div class="liturgi-label"><i class="bi bi-book-fill"></i><span>Bacaan 1</span></div><div class="liturgi-colon">:</div><div class="liturgi-value">${lit.bacaan1 || '-'}</div>
                      <div class="liturgi-label"><i class="bi bi-book-fill"></i><span>Bacaan 2</span></div><div class="liturgi-colon">:</div><div class="liturgi-value">${lit.bacaan2 || '-'}</div>
                      <div class="liturgi-label"><i class="bi bi-music-note-beamed"></i><span>Mazmur</span></div><div class="liturgi-colon">:</div><div class="liturgi-value">${lit.mazmur || '-'}</div>
                      <div class="liturgi-label"><i class="bi bi-journal-medical"></i><span>Injil</span></div><div class="liturgi-colon">:</div><div class="liturgi-value">${lit.injil || '-'}</div>
                      <div class="liturgi-label"><i class="bi bi-palette-fill"></i><span>Warna</span></div><div class="liturgi-colon">:</div><div class="liturgi-value">${lit.warna || '-'}</div>
                  </div>
              </div>
          </div>`;
    };
    
    const setWrapperHeight = (wrapper) => {
        if (!wrapper) return;
        const front = wrapper.querySelector('.front');
        const back = wrapper.querySelector('.back');
        if (!front || !back) return;
        front.style.position = 'relative';
        back.style.position = 'relative';
        const frontHeight = front.offsetHeight;
        const backHeight = back.offsetHeight;
        front.style.position = 'absolute';
        back.style.position = 'absolute';
        wrapper.style.height = `${Math.max(frontHeight, backHeight, 50)}px`;
    };

    try {
        // --- LOGIKA TANGGAL YANG DIPERBAIKI ---
        const today = new Date();
        // Set jam ke 00:00:00 untuk perbandingan yang akurat
        today.setHours(0, 0, 0, 0); 
        
        // 1. Ambil liturgi MINGGU INI (tanggal <= hari ini, urutkan dari yang paling baru)
        const currentSnapshot = await db.collection('liturgies')
            .where('liturgyDate', '<=', today)
            .orderBy('liturgyDate', 'desc')
            .limit(1)
            .get();
        
        // 2. Ambil liturgi MINGGU DEPAN (tanggal > hari ini, urutkan dari yang paling awal)
        const nextSnapshot = await db.collection('liturgies')
            .where('liturgyDate', '>', today)
            .orderBy('liturgyDate', 'asc')
            .limit(1)
            .get();

        if (currentSnapshot.empty) {
            Object.values(flippers).forEach(f => f.style.display = 'none');
            containers.tombol.innerHTML = '<p>Data liturgi minggu ini belum diatur oleh admin.</p>';
            return;
        }

        const currentLit = currentSnapshot.docs[0].data();
        const nextLit = nextSnapshot.empty ? null : nextSnapshot.docs[0].data();

        // Isi konten sisi DEPAN (front)
        containers.bacaanFront.innerHTML = createLiturgiCardHTML(currentLit);
        containers.renunganCurrent.innerHTML = `<p>${(currentLit.renungan || 'Renungan belum tersedia.').replace(/\n/g, '<br>')}</p>`;

        if (nextLit) {
            // Jika ada data minggu depan, isi konten sisi BELAKANG (back)
            containers.bacaanBack.innerHTML = createLiturgiCardHTML(nextLit);
            containers.renunganNext.innerHTML = `<p>${(nextLit.renungan || 'Renungan minggu depan belum tersedia.').replace(/\n/g, '<br>')}</p>`;
            
            setTimeout(() => {
              setWrapperHeight(flippers.title);
              setWrapperHeight(flippers.bacaan);
              setWrapperHeight(flippers.renungan);
            }, 100);

            containers.tombol.innerHTML = `<button id="multi-flip-btn" class="btn btn-outline-primary">Lihat Minggu Depan &gt;&gt;&gt;</button>`;
            
            document.getElementById('multi-flip-btn').addEventListener('click', function() {
                const isFlipped = flippers.title.classList.contains('is-flipped');
                this.innerHTML = isFlipped ? 'Lihat Minggu Depan &gt;&gt;&gt;' : '&lt;&lt;&lt; Kembali ke Minggu Ini';
                Object.values(flippers).forEach(f => f.classList.toggle('is-flipped'));
            });
        } else {
            // Jika tidak ada data minggu depan, sembunyikan elemen yang tidak perlu
            flippers.title.querySelector('.back').style.display = 'none';
            flippers.bacaan.querySelector('.back').style.display = 'none';
            flippers.renungan.querySelector('.back').style.display = 'none';
            containers.tombol.style.display = 'none';
            setTimeout(() => {
                setWrapperHeight(flippers.title);
                setWrapperHeight(flippers.bacaan);
                setWrapperHeight(flippers.renungan);
            }, 100);
        }

    } catch (error) {
        console.error("Gagal memuat liturgi:", error);
        if (error.code === 'failed-precondition') {
            const firestoreLink = `https://console.firebase.google.com/v1/r/project/${firebaseConfig.projectId}/firestore/indexes?create_composite=Ckxwcm9qZWN0cy9wYXJva2ktbW9kb2luZGluZy9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvbGl0dXJnaWVzL2luZGV4ZXMvXxABGhAKDGxpdHVyZ3lEYXRlEAEaDAoIX19uYW1lX18QARoQChBsaXR1cmd5RGF0ZVBhcmEQAhoMCghfX25hbWVfXxAC`;
            containers.bacaanFront.innerHTML = `<p class="text-danger"><b>Aksi Diperlukan:</b> Database memerlukan index baru untuk fitur ini. <a href="${firestoreLink}" target="_blank">Klik di sini untuk membuatnya</a>, lalu muat ulang halaman ini.</p>`;
        } else {
            containers.bacaanFront.innerHTML = `<p class="text-danger">Terjadi kesalahan saat memuat liturgi.</p>`;
        }
        Object.values(flippers).forEach(f => { if(f !== flippers.bacaan) f.style.display = 'none'; });
        containers.tombol.style.display = 'none';
    }
  };

  const loadPastorStatus = async () => {
    const container = document.querySelector('#pastor');
    if (!container) return;
    container.innerHTML = '<h2>Kehadiran Pastor Hari Ini</h2><p>Memuat status...</p>';
    try {
        const snapshot = await db.collection('pastors').orderBy('order').get();
        if (snapshot.empty) {
            container.innerHTML += '<p>Data pastor belum tersedia.</p>';
            return;
        }
        const statusItems = snapshot.docs.map(doc => {
            const p = doc.data();
            const isHadir = p.status === 'Di Tempat';
            const indicatorClass = isHadir ? 'green' : 'red';
            return `<div><img alt="${p.name}" class="pastor-photo" src="${p.photoUrl}" /><p>${p.name}</p><span class="indicator ${indicatorClass}">${p.status}</span></div>`;
        }).join('');
        container.innerHTML = `<h2>Kehadiran Pastor Hari Ini</h2><div class="pastor-status">${statusItems}</div><p class="mt-3" style="font-size: 0.9rem; color: #555;">Keterangan:<br/><span class="indicator green" style="padding: 2px 10px;">Di Tempat</span> = Pastor berada di pastoran.<br/><span class="indicator red" style="padding: 2px 10px;">Lainnya</span> = Pastor sedang pelayanan di luar, cuti, atau sakit.</p>`;
    } catch (error) {
        console.error("Gagal memuat status pastor:", error);
        container.innerHTML = `<h2>Kehadiran Pastor Hari Ini</h2><p class="text-danger">Gagal memuat status pastor. Error: ${error.message}</p>`;
    }
  };

  const loadPublicStats = async () => {
    const container = document.querySelector('#statistik');
    if (!container) return;
    container.innerHTML = '<h2>Statistik Umat</h2><p>Memuat data statistik...</p>';
    try {
        const snapshot = await db.collection('parish_stats').orderBy('order').get();
        if (snapshot.empty) {
            container.innerHTML = '<h2>Statistik Umat</h2><p>Data belum tersedia.</p>';
            return;
        }
        let totalKK = 0, totalLaki = 0, totalPerempuan = 0;
        const tableRows = snapshot.docs.map(doc => {
            const w = doc.data();
            const jumlah = w.laki_laki + w.perempuan;
            totalKK += w.kk;
            totalLaki += w.laki_laki;
            totalPerempuan += w.perempuan;
            return `<tr><td>${w.order}</td><td>${w.name}</td><td>${w.kk}</td><td>${w.laki_laki}</td><td>${w.perempuan}</td><td>${jumlah}</td></tr>`;
        }).join('');
        const totalJiwa = totalLaki + totalPerempuan;
        const totalRow = `<tr style="font-weight:bold; background:#e0f7fa"><td colspan="2">Jumlah</td><td>${totalKK}</td><td>${totalLaki}</td><td>${totalPerempuan}</td><td>${totalJiwa}</td></tr>`;
        container.innerHTML = `<h2>Statistik Umat</h2><div class="overflow-auto"><table class="stats-table"><thead><tr><th>No</th><th>Nama Wilayah</th><th>KK</th><th>Laki-laki</th><th>Perempuan</th><th>Jumlah Jiwa</th></tr></thead><tbody>${tableRows}${totalRow}</tbody></table></div>`;
    } catch (error) {
        console.error("Gagal memuat statistik umat:", error);
        container.innerHTML = `<h2>Statistik Umat</h2><p class="text-danger">Gagal memuat data. Error: ${error.message}</p>`;
    }
  };

  // =================================================================
  // === BAGIAN 3: KODE UNTUK NAVIGASI TAB DAN FUNGSI LAINNYA ===
  // =================================================================
  
  loadAnnouncementsPublic();
  loadActiveLiturgy();
  loadPastorStatus();
  loadPublicStats();
  
  function activateTab(tabId) {
    document.querySelectorAll('.tab-button').forEach(btn => { if (btn.dataset.tab) { btn.classList.toggle('active', btn.dataset.tab === tabId); } });
    document.querySelectorAll('.tab-content').forEach(content => { content.classList.toggle('active', content.id === tabId); });
    const sidebarMenu = document.getElementById('sidebarMenu');
    if (window.innerWidth <= 768 && sidebarMenu.classList.contains('active')) {
      sidebarMenu.classList.remove('active');
      document.body.classList.remove('sidebar-open');
      document.getElementById('sidebarToggleBtn').classList.remove('active');
    }
  }

  const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
  const sidebarMenu = document.getElementById('sidebarMenu');
  if (sidebarToggleBtn && sidebarMenu) {
    sidebarToggleBtn.addEventListener('click', () => {
      sidebarMenu.classList.toggle('active');
      sidebarToggleBtn.classList.toggle('active');
      document.body.classList.toggle('sidebar-open');
    });
    document.body.addEventListener('click', (event) => {
        if (window.innerWidth <= 768 && document.body.classList.contains('sidebar-open') && !sidebarMenu.contains(event.target) && !sidebarToggleBtn.contains(event.target)) {
            sidebarMenu.classList.remove('active');
            sidebarToggleBtn.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    });
  }

  const sidebarNav = document.querySelector('#sidebarMenu .nav');
  if (sidebarNav) {
    sidebarNav.querySelectorAll('.tab-button[data-tab]').forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault(); 
        activateTab(button.dataset.tab);
      });
    });
  }
  
  const tentangContainer = document.querySelector('#tentang');
  if (tentangContainer) {
    const pastorList = [ { id: 2, name: 'P. Joseph Ansow, Pr.', img: 'pastor-joseph.jpg', masa: '2025 - Sekarang' }, { id: 3, name: 'P. Stenly Ambun, Pr. (Pastor Rekan Paroki)', img: 'pastor-stenly.jpg', masa: '2024 - Sekarang' }, { id: 4, name: 'P. Feighty Y. Boseke, Pr. (Alm)', img: 'pastor-feighty.jpg', masa: '2017 - 2024' }, { id: 5, name: 'P. Stevy Motto, Pr.', img: 'pastor-stevy.jpg', masa: '2014 - 2017' }, { id: 6, name: 'P. Yan S. Koraag, Pr.', img: 'pastor-yan.jpg', masa: '2011 - 2014' }, { id: 7, name: 'Pra-Paroki | P. Herman Saroinsong, Pr. (Alm)', img: 'pastor-Herman.jpg', masa: '2008 - 2011' } ];
    tentangContainer.innerHTML = `<h2 class="mt-4">Tentang Paroki</h2><div class="card shadow-sm border rounded p-3 mb-4"><b>Sejarah Singkat</b><p style="text-align: justify;">Paroki Santa Perawan Maria Ratu Rosari Modoinding merupakan Gereja Paroki Katolik yang terletak di Jl. Trans Sulawesi, Desa Sinisir, Jaga VIII, Kecamatan Modoinding, Kabupaten Minahasa Selatan 95358 Provinsi Sulawesi Utara. Paroki ini didedikasikan kepada Santa Perawan Maria dengan gelar Ratu Rosari dan berada di bawah yurisdiksi Keuskupan Manado...</p><p><b>Paroki ini mempunyai 5 Stasi yakni diantaranya:</b></p><p>- STASI SANTA THERESIA MAKAAROYEN -<br>- STASI HATI KUDUS YESUS MOBUYA -<br>- STASI REX MUNDI TAMBELANG -<br>- STASI SANTO ANDREAS KINAMANG -<br>- STASI CHRISTUS REX LININGAAN -</p></div><div class="card shadow-sm border rounded p-3"><h5>Pastor Paroki & Pastor Rekan Paroki</h5><div class="accordion" id="accordionPastor">${pastorList.map(p => `<div class="accordion-item"><h2 class="accordion-header" id="pastor${p.id}"><button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePastor${p.id}"><b>${p.name}</b></button></h2><div id="collapsePastor${p.id}" class="accordion-collapse collapse" data-bs-parent="#accordionPastor"><div class="accordion-body text-center"><img src="${p.img}" class="img-fluid rounded shadow-sm mb-2" style="max-height:200px;" alt="${p.name}" /><b><p>Masa Jabatan: ${p.masa}</p></b></div></div></div>`).join('')}</div></div>`;
  }
  
  function parseLiturgicalData(item) {
      const colorMap = {'⚪': 'white', '🔴': 'red', '🟢': 'green', '💜': 'purple', '⚫': 'black', '🟪': 'rose', '🔵': 'blue'};
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

  fetch('kalender_liturgi_2025.json').then(res => res.json()).then(data => {
      const container = document.getElementById('kalender-paroki-container');
      if (container) {
          const tableRows = data.map(item => {
              const parsed = parseLiturgicalData(item);
              const date = new Date(parsed.tanggal).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
              return `<tr><td class="date-cell"><div class="date-display">${date}</div></td><td class="liturgical-color-dot-cell"><span class="liturgical-color-dot ${parsed.color}"></span></td><td class="liturgical-celebration">${parsed.indicator ? `<span class="liturgical-indicator">[${parsed.indicator}]</span>` : ''} ${parsed.perayaan}${parsed.mainDescription ? `<div class="liturgical-description-cell">${parsed.mainDescription}</div>` : ''}${parsed.psalterWeek ? `<div class="liturgical-psalter-week-cell">${parsed.psalterWeek}</div>` : ''}</td></tr>`;
          }).join('');
          container.innerHTML = `<div class="table-responsive"><table class="table table-bordered table-striped align-middle liturgical-calendar-table"><thead><tr><th style="width: 150px;">Tanggal</th><th colspan="2">Perayaan</th></tr></thead><tbody>${tableRows}</tbody></table></div>`;
      }
  }).catch(console.error);

  fetch('popes.json').then(res => res.json()).then(data => {
      const container = document.getElementById('popes-container');
      if (container) {
          const rows = data.map(pope => `<tr><td>${pope.nomor}</td><td>${pope.nama}</td><td>${pope.masa_jabatan}</td></tr>`).join('');
          container.innerHTML = `<div class="table-responsive"><table class="table table-bordered table-striped popes-table"><thead><tr><th>No.</th><th>Nama Paus</th><th>Masa Jabatan</th></tr></thead><tbody>${rows}</tbody></table></div>`;
      }
  }).catch(console.error);

  GLightbox({ selector: 'a.glightbox[data-gallery="pastor-beranda"]' });
  
  if (typeof particlesJS !== 'undefined') {
    particlesJS("particles-js", { particles: { number: { value: 80 }, color: { value: "#ffffff" }, shape: { type: "circle" }, opacity: { value: 0.5, anim: { enable: false } }, size: { value: 3, random: true }, line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 }, move: { enable: true, speed: 6 } }, interactivity: { events: { onhover: { enable: true, mode: "repulse" } } }, retina_detect: true });
  }

  activateTab('beranda');
});
