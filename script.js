// Menunggu hingga seluruh konten halaman (DOM) selesai dimuat
document.addEventListener('DOMContentLoaded', () => {

    // ========================================================
    // BAGIAN 1: KONFIGURASI DAN INISIALISASI GLOBAL
    // ========================================================

    // Konfigurasi Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyC-KNi0YqnlxtzkeoemEFWN5xusjxpWV_I",
        authDomain: "paroki-modoinding.firebaseapp.com",
        projectId: "paroki-modoinding",
        storageBucket: "paroki-modoinding.appspot.com",
        messagingSenderId: "615770618729",
        appId: "1:615770618729:web:0f6d67c62512c21f2e5bf8",
        measurementId: "G-ECLMPR9NJ2"
    };

    // Inisialisasi Firebase (mencegah inisialisasi ganda)
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.firestore();

    // Inisialisasi GLightbox untuk galeri foto
    const lightbox = GLightbox({
        selector: '.glightbox'
    });

    // Inisialisasi Particles.js untuk animasi header
    particlesJS.load('particles-js', 'assets/particles.json', () => {
        console.log('Callback - particles.js config loaded');
    });


    // =================================================================
    // BAGIAN 2: FUNGSI-FUNGSI UNTUK MEMUAT DATA
    // =================================================================

    /**
     * Memuat dan menampilkan data Agenda / Pengumuman.
     */
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
                      <h5 class="card-title text-primary"><i class="bi bi-bookmark-fill me-2"></i>${item.judul}</h5>
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

    /**
     * Memuat dan menampilkan data Liturgi dan Renungan.
     */
    const loadActiveLiturgy = async () => {
        const flippers = {
            title: document.getElementById('title-flipper'),
            bacaan: document.getElementById('bacaan-flipper'),
        };
        const containers = {
            bacaanFront: document.getElementById('bacaan-flipper-front'),
            bacaanBack: document.getElementById('bacaan-flipper-back'),
            tombol: document.getElementById('tombol-flip-container'),
            renunganTitle: document.getElementById('renungan-title'),
            renunganText: document.getElementById('renungan-text')
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
            const flipper = wrapper.querySelector('.flipper');
            const front = flipper.querySelector('.front');
            const back = flipper.querySelector('.back');
            if (!flipper || !front || !back) return;
            
            front.style.position = 'relative';
            back.style.position = 'relative';
            const frontHeight = front.offsetHeight;
            const backHeight = back.offsetHeight;
            front.style.position = 'absolute';
            back.style.position = 'absolute';

            flipper.style.height = `${Math.max(frontHeight, backHeight, 50)}px`;
        };

        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0); 
            
            const currentSnapshot = await db.collection('liturgies').where('liturgyDate', '<=', today).orderBy('liturgyDate', 'desc').limit(1).get();
            const nextSnapshot = await db.collection('liturgies').where('liturgyDate', '>', today).orderBy('liturgyDate', 'asc').limit(1).get();

            if (currentSnapshot.empty) {
                document.getElementById('beranda').innerHTML = '<p>Data liturgi minggu ini belum diatur oleh admin.</p>';
                return;
            }

            const currentLit = currentSnapshot.docs[0].data();
            const nextLit = nextSnapshot.empty ? null : nextSnapshot.docs[0].data();

            containers.bacaanFront.innerHTML = createLiturgiCardHTML(currentLit);
            containers.renunganText.innerHTML = `<p>${(currentLit.renungan || 'Renungan belum tersedia.').replace(/\n/g, '<br>')}</p>`;

            if (nextLit) {
                containers.bacaanBack.innerHTML = createLiturgiCardHTML(nextLit);
                
                setTimeout(() => {
                  setWrapperHeight(flippers.title);
                  setWrapperHeight(flippers.bacaan);
                }, 100);

                containers.tombol.innerHTML = `<button id="multi-flip-btn" class="btn btn-outline-primary">Lihat Minggu Depan &gt;&gt;&gt;</button>`;
                
                document.getElementById('multi-flip-btn').addEventListener('click', function() {
                    const isFlipped = flippers.title.classList.contains('is-flipped');
                    this.innerHTML = isFlipped ? 'Lihat Minggu Depan &gt;&gt;&gt;' : '&lt;&lt;&lt; Kembali ke Minggu Ini';
                    
                    flippers.title.classList.toggle('is-flipped');
                    flippers.bacaan.classList.toggle('is-flipped');
                });
            } else {
                if(flippers.title) flippers.title.querySelector('.back').style.display = 'none';
                if(flippers.bacaan) flippers.bacaan.querySelector('.back').style.display = 'none';
                if(containers.tombol) containers.tombol.style.display = 'none';
                setTimeout(() => {
                    setWrapperHeight(flippers.title);
                    setWrapperHeight(flippers.bacaan);
                }, 100);
            }
        } catch (error) {
            console.error("Gagal memuat liturgi:", error);
            document.getElementById('beranda').innerHTML = `<p class="text-danger">Terjadi kesalahan saat memuat liturgi. Silakan cek konsol.</p>`;
        }
    };

    /**
     * Memuat dan menampilkan status kehadiran Pastor.
     */
    const loadPastorStatus = async () => {
        const container = document.querySelector('#pastor');
        if (!container) return;
        try {
            const snapshot = await db.collection('pastors').orderBy('order').get();
            if (snapshot.empty) {
                container.innerHTML = '<h2>Kehadiran Pastor Hari Ini</h2><p>Data pastor belum tersedia.</p>';
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

    /**
     * Memuat dan menampilkan data Statistik Umat.
     */
    const loadPublicStats = async () => {
        const container = document.querySelector('#statistik');
        if (!container) return;
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
            const totalRow = `<tfoot><tr><td colspan="2">Jumlah</td><td>${totalKK}</td><td>${totalLaki}</td><td>${totalPerempuan}</td><td>${totalJiwa}</td></tr></tfoot>`;
            container.innerHTML = `<h2>Statistik Umat</h2><div class="overflow-auto"><table class="stats-table"><thead><tr><th>No</th><th>Nama Wilayah</th><th>KK</th><th>Laki-laki</th><th>Perempuan</th><th>Jumlah Jiwa</th></tr></thead><tbody>${tableRows}</tbody>${totalRow}</table></div>`;
        } catch (error) {
            console.error("Gagal memuat statistik umat:", error);
            container.innerHTML = `<p class="text-danger">Gagal memuat data. Error: ${error.message}</p>`;
        }
    };

    /**
     * [DIHAPUS] Fungsi ini tidak lagi mengambil data dari Firestore.
     * Konten sekarang statis di index.html.
     */
    // const loadTentangParoki = async () => { ... };


    /**
     * Memuat dan menampilkan Sejarah Paus dari file JSON.
     */
    const loadSejarahPausFromJson = async () => {
        const container = document.querySelector('#sejarah-paus-container');
        if (!container) return;

        container.innerHTML = '<p>Memuat data Sejarah Paus...</p>';

        try {
            const response = await fetch('sejarah_paus.json');
            if (!response.ok) {
                throw new Error(`Gagal memuat file: ${response.statusText}`);
            }
            const allPopes = await response.json();

            // Fungsi untuk render tabel
            const renderTable = (popes) => {
                const tableBody = document.getElementById('pope-table-body');
                if (!tableBody) return;
                tableBody.innerHTML = popes.map(pope => `
                    <tr>
                        <td data-label="No.">${pope.urutan}</td>
                        <td data-label="Nama Paus">
                            <strong>${pope.nama}</strong>
                            <small class="pope-latin-name">${pope.nama_latin}</small>
                        </td>
                        <td data-label="Masa Jabatan">${pope.masa_jabatan}</td>
                        <td data-label="Negara Asal">${pope.negara_asal || '-'}</td>
                        <td data-label="Catatan">${pope.catatan || '-'}</td>
                    </tr>
                `).join('');
            };

            // Membuat struktur HTML untuk tabel dan pencarian
            container.innerHTML = `
                <div class="pope-search-wrapper">
                    <input type="text" id="popeSearchInput" class="form-control" placeholder="Cari Paus (nama, tahun, negara)...">
                </div>
                <div class="pope-table-wrapper">
                    <table class="pope-table">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Nama Paus</th>
                                <th>Masa Jabatan</th>
                                <th>Negara Asal</th>
                                <th>Catatan Singkat</th>
                            </tr>
                        </thead>
                        <tbody id="pope-table-body">
                        </tbody>
                    </table>
                </div>
            `;
            
            // Render tabel pertama kali
            renderTable(allPopes);

            // Tambahkan event listener untuk pencarian
            const searchInput = document.getElementById('popeSearchInput');
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const filteredPopes = allPopes.filter(pope => 
                    pope.nama.toLowerCase().includes(query) ||
                    pope.nama_latin.toLowerCase().includes(query) ||
                    pope.masa_jabatan.includes(query) ||
                    (pope.negara_asal && pope.negara_asal.toLowerCase().includes(query))
                );
                renderTable(filteredPopes);
            });

        } catch (error) {
            console.error("Gagal memuat Sejarah Paus dari JSON:", error);
            container.innerHTML = `<p class="text-danger">Gagal memuat data. Pastikan file 'sejarah_paus.json' ada di folder yang sama. Error: ${error.message}</p>`;
        }
    };
    
    /**
     * Memuat dan menampilkan konten untuk halaman "Kalender Liturgi" dari file JSON.
     */
    const loadKalenderFromJson = async () => {
        const container = document.querySelector('#kalender-container');
        if (!container) return;
        
        container.innerHTML = '<p>Memuat kalender liturgi 2025...</p>';

        try {
            const response = await fetch('kalender_liturgi_2025.json');
            if (!response.ok) {
                throw new Error(`Gagal memuat file: ${response.statusText}`);
            }
            const data = await response.json();

            const groupedByMonth = data.reduce((acc, item) => {
                const date = new Date(item.tanggal + 'T00:00:00');
                const monthYear = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
                
                if (!acc[monthYear]) {
                    acc[monthYear] = [];
                }
                acc[monthYear].push(item);
                return acc;
            }, {});

            let html = '';
            const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => {
                const dateA = new Date('01 ' + a.replace(' ', ' '));
                const dateB = new Date('01 ' + b.replace(' ', ' '));
                return dateA - dateB;
            });

            for (const month of sortedMonths) {
                html += `<h3 class="kalender-bulan">${month}</h3>`;
                html += '<ul class="kalender-list">';
                
                groupedByMonth[month].forEach(item => {
                    const date = new Date(item.tanggal + 'T00:00:00');
                    const day = date.getDate();
                    const dayName = date.toLocaleDateString('id-ID', { weekday: 'long' });

                    const judul = item.judul || 'Tidak ada judul';
                    const deskripsi = (item.deskripsi || '').replace(/\n/g, '<br>');

                    const getWarnaClass = (judul) => {
                        if (judul.includes('閥')) return 'dot-red';
                        if (judul.includes('笞ｪ')) return 'dot-white';
                        if (judul.includes('泙')) return 'dot-green';
                        if (judul.includes('泪')) return 'dot-purple';
                        return 'dot-default';
                    };

                    html += `
                        <li class="kalender-item">
                            <div class="kalender-tanggal">
                                <span class="tanggal-angka">${day}</span>
                                <span class="tanggal-hari">${dayName}</span>
                            </div>
                            <div class="kalender-info">
                                <span class="kalender-judul ${getWarnaClass(judul)}">${judul}</span>
                                <span class="kalender-deskripsi">${deskripsi}</span>
                            </div>
                        </li>
                    `;
                });
                html += '</ul>';
            }
            container.innerHTML = html;

        } catch (error) {
            console.error("Gagal memuat Kalender Liturgi dari JSON:", error);
            container.innerHTML = `<p class="text-danger">Gagal memuat kalender. Error: ${error.message}</p>`;
        }
    };


    // =================================================================
    // BAGIAN 3: NAVIGASI TAB DAN EVENT LISTENERS
    // =================================================================
    
    function activateTab(tabId) {
        document.querySelectorAll('.tab-button').forEach(btn => {
            if (btn.dataset.tab) {
                btn.classList.toggle('active', btn.dataset.tab === tabId);
            }
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });

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
    
    // =================================================================
    // BAGIAN 4: PEMANGGILAN FUNGSI-FUNGSI AWAL
    // =================================================================
    
    const loadInitialData = () => {
        loadAnnouncementsPublic();
        loadActiveLiturgy();
        loadPastorStatus();
        loadPublicStats();
        // loadTentangParoki(); // <-- FUNGSI INI DIHAPUS
        loadKalenderFromJson();
        loadSejarahPausFromJson();
    };

    loadInitialData();
    
    activateTab('beranda');
});
