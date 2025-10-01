/*
 * script.js (Versi Final & Rapi)
 * File skrip utama untuk halaman publik Paroki.
 * * FUNGSI UTAMA:
 * - Menginisialisasi Firebase dan komponen UI (Particles, GLightbox).
 * - Mengelola logika navigasi tab dan sidebar.
 * - Memuat data dinamis dari Firebase Firestore:
 * - Tata Perayaan Ekaristi (TPE) mingguan.
 * - Pengumuman / Agenda.
 * - Status kehadiran Pastor.
 * - Statistik Umat (tabel dan grafik).
 * - Memuat data statis dari file JSON:
 * - Kalender Liturgi.
 * - Sejarah Paus.
 * - Mengelola Pustaka Doa (data hardcoded).
 * - Mengelola fungsionalitas modal untuk pratinjau PDF.
 */

// =================================================================
// DATA DOA-DOA (Disimpan di sini agar tidak perlu request ke server)
// =================================================================
const prayersData = [
    {
        title: 'Tanda Salib',
        content: { indonesia: `<p>Dalam nama Bapa dan Putra dan Roh Kudus. Amin.</p>`, latin: `<p>In nomine Patris, et Filii, et Spiritus Sancti. Amen.</p>` }
    },
    {
        title: 'Bapa Kami',
        content: { indonesia: `<p>Bapa kami yang ada di surga, dimuliakanlah nama-Mu.<br>Datanglah kerajaan-Mu. Jadilah kehendak-Mu di atas bumi seperti di dalam surga.</p><p>Berilah kami rezeki pada hari ini, dan ampunilah kesalahan kami, seperti kami pun mengampuni yang bersalah kepada kami.</p><p>Dan janganlah masukkan kami ke dalam pencobaan, tetapi bebaskanlah kami dari yang jahat. Amin.</p>`, latin: `<p>Pater noster, qui es in caelis: sanctificetur Nomen Tuum;<br>adveniat Regnum Tuum; fiat voluntas Tua, sicut in caelo, et in terra.</p><p>Panem nostrum cotidianum da nobis hodie; et dimitte nobis debita nostra, sicut et nos dimittimus debitoribus nostris;</p><p>et ne nos inducas in tentationem; sed libera nos a Malo. Amen.</p>` }
    },
    {
        title: 'Aku Percaya (Syahadat Para Rasul)',
        content: { indonesia: `<p>Aku percaya akan Allah, Bapa yang Mahakuasa, pencipta langit dan bumi.<br>Dan akan Yesus Kristus, Putra-Nya yang tunggal, Tuhan kita.<br>Yang dikandung dari Roh Kudus, dilahirkan oleh Perawan Maria.</p><p>Yang menderita sengsara dalam pemerintahan Pontius Pilatus, disalibkan, wafat, dan dimakamkan.<br>Yang turun ke tempat penantian, pada hari ketiga bangkit dari antara orang mati.<br>Yang naik ke surga, duduk di sebelah kanan Allah Bapa yang Mahakuasa.<br>Dari situ Ia akan datang mengadili orang hidup dan mati.</p><p>Aku percaya akan Roh Kudus, Gereja Katolik yang kudus, persekutuan para kudus, pengampunan dosa, kebangkitan badan, kehidupan kekal. Amin.</p>`, latin: `<p>Credo in Deum Patrem omnipotentem, Creatorem caeli et terrae, et in Iesum Christum, Filium Eius unicum, Dominum nostrum, qui conceptus est de Spiritu Sancto, natus ex Maria Virgine, passus sub Pontio Pilato, crucifixus, mortuus, et sepultus, descendit ad inferos, tertia die resurrexit a mortuis, ascendit ad caelos, sedet ad dexteram Dei Patris omnipotentis, inde venturus est iudicare vivos et mortuos. Credo in Spiritum Sanctum, sanctam Ecclesiam catholicam, sanctorum communionem, remissionem peccatorum, carnis resurrectionem, vitam aeternam. Amen.</p>` }
    },
    {
        title: 'Salam Maria',
        content: { indonesia: `<p>Salam Maria, penuh rahmat, Tuhan sertamu,<br>terpujilah engkau di antara wanita, dan terpujilah buah tubuhmu, Yesus.</p><p>Santa Maria, bunda Allah, doakanlah kami yang berdosa ini, sekarang dan waktu kami mati. Amin.</p>`, latin: `<p>Ave Maria, gratia plena, Dominus tecum, benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.</p>` }
    },
    {
        title: 'Kemuliaan',
        content: { indonesia: `<p>Kemuliaan kepada Bapa dan Putra dan Roh Kudus,<br>seperti pada permulaan, sekarang, selalu, dan sepanjang segala abad. Amin.</p>`, latin: `<p>Gloria Patri, et Filio, et Spiritui Sancto.<br>Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.</p>` }
    },
    // ... (data doa lainnya tetap sama) ...
];


document.addEventListener('DOMContentLoaded', () => {

    // =================================================================
    // INISIALISASI & VARIABEL GLOBAL
    // =================================================================
    const db = firebase.firestore();
    let publicUmatChart = null; // Variabel untuk menyimpan instance grafik umat

    // Inisialisasi library pihak ketiga
    GLightbox({ selector: '.glightbox' });
    particlesJS.load('particles-js', 'assets/particles.json', () => {});


    // =================================================================
    // FUNGSI BANTU (HELPERS)
    // =================================================================

    /**
     * Menampilkan indikator loading di dalam sebuah elemen kontainer.
     * @param {HTMLElement} container - Elemen DOM tempat loading akan ditampilkan.
     * @param {string} message - Pesan yang ditampilkan bersama spinner.
     */
    const showLoading = (container, message = 'Memuat data...') => {
        if (container) {
            container.innerHTML = `<div class="feedback-container"><div class="spinner"></div><p>${message}</p></div>`;
        }
    };

    /**
     * Menampilkan pesan error di dalam sebuah elemen kontainer.
     * @param {HTMLElement} container - Elemen DOM tempat pesan error akan ditampilkan.
     * @param {string} message - Pesan error yang akan ditampilkan.
     */
    const showError = (container, message) => {
        if (container) {
            container.innerHTML = `<div class="error-alert"><strong>Gagal Memuat:</strong> ${message}</div>`;
        }
    };

    // =================================================================
    // FUNGSI-FUNGSI UTAMA PEMUAT DATA
    // =================================================================

    /**
     * Membuat konten HTML untuk Tata Perayaan Ekaristi (TPE).
     * @param {object} data - Objek data TPE dari Firestore.
     * @returns {string} String HTML yang siap ditampilkan.
     */
    const createTpeHtml = (data) => {
        if (!data) {
            return '<div class="alert alert-warning text-center">Tata Perayaan Ekaristi belum tersedia.</div>';
        }

        // Membuat baris-baris tabel jadwal misa
        const tableRows = (data.jadwal_misa || []).map(misa => `
            <tr>
                <td data-label="Jam">${misa.jam || '-'}</td>
                <td data-label="Tempat">${misa.tempat || '-'}</td>
                <td data-label="Perayaan">${misa.perayaan || '-'}</td>
                <td data-label="Pelayan">${misa.pelayan || '-'}</td>
            </tr>
        `).join('');
        
        const jadwalHtml = `
            <h3 class="tpe-content-title">Jadwal Misa & Tema</h3>
            <div class="table-scroll-wrapper">
                <table class="jadwal-misa-table">
                    <thead><tr><th>Jam</th><th>Tempat</th><th>Perayaan</th><th>Pelayan</th></tr></thead>
                    <tbody>${tableRows}</tbody>
                </table>
            </div>
            ${data.tema ? `<p class="text-center fst-italic mt-3"><strong>Tema:</strong> "${data.tema}"</p>` : ''}
        `;
        
        const tpe = data.tata_perayaan || {};
        
        // Fungsi untuk memformat Doa Umat agar memiliki style berbeda untuk Pemimpin (P/I) dan Umat (U)
        const formatDoaUmat = (htmlContent) => {
            if (!htmlContent) return '';
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            tempDiv.querySelectorAll('p').forEach(p => {
                const text = p.textContent.trim();
                if (text.startsWith('P:') || text.startsWith('I:')) p.classList.add('doa-umat-baris', 'pemimpin');
                else if (text.startsWith('U:')) p.classList.add('doa-umat-baris', 'umat');
                else p.classList.add('doa-umat-baris');
            });
            return `<div class="section-content">${tempDiv.innerHTML}</div>`;
        };

        // Fungsi untuk membuat setiap bagian TPE (misal: Antifon, Bacaan, dll)
        const createSection = (title, content) => {
            if (!content) return '';
            const contentHtml = (title === 'Doa Umat') ? formatDoaUmat(content) : `<div class="section-content">${content}</div>`;
            return `<div class="tpe-section"><h4 class="section-title"><i class="bi bi-cross"></i> ${title}</h4>${contentHtml}</div>`;
        };
        
        const tpeHtml = `
            <hr class="my-4">
            <h3 class="tpe-content-title">Tata Perayaan Ekaristi</h3>
            ${createSection('Antifon Pembuka', tpe.antifon_pembuka)}
            ${createSection('Doa Kolekta', tpe.doa_kolekta)}
            ${createSection('Bacaan I', tpe.bacaan_1)}
            ${createSection('Mazmur Tanggapan', tpe.mazmur_tanggapan)}
            ${createSection('Bacaan II', tpe.bacaan_2)}
            ${createSection('Bait Pengantar Injil', tpe.bait_pengantar_injil)}
            ${createSection('Bacaan Injil', tpe.bacaan_injil)}
            ${createSection('Doa Umat', tpe.doa_umat)}
            ${createSection('Doa Atas Persembahan', tpe.doa_persembahan)}
            ${createSection('Antifon Komuni', tpe.antifon_komuni)}
            ${createSection('Doa Sesudah Komuni', tpe.doa_sesudah_komuni)}
        `;

        // Menggabungkan semua bagian menjadi satu kontainer utuh
        return `<div class="tpe-container-final">
                    <div class="tpe-header">
                        <p class="tanggal">${data.tanggal_display || ''}</p>
                        <h2 class="perayaan">${data.nama_perayaan || 'Tata Perayaan Ekaristi'}</h2>
                        <p class="tahun-liturgi">${data.tahun_liturgi || ''}</p>
                    </div>
                    <div class="tpe-content">${jadwalHtml}${tpeHtml}</div>
                </div>`;
    };
    
    /**
     * Memuat TPE untuk minggu ini dan minggu depan dari Firestore.
     */
    const loadWeeklyLiturgy = async () => {
        const currentContainer = document.getElementById('current-week-tpe');
        const nextContainer = document.getElementById('next-week-tpe');
        const controlsContainer = document.getElementById('tpe-preview-controls');
        if (!currentContainer) return;
        
        // Logika untuk menentukan tanggal dokumen TPE yang relevan (berdasarkan hari Sabtu terakhir)
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diffToLastSaturday = (dayOfWeek + 1) % 7;
        const lastSaturday = new Date(now);
        lastSaturday.setDate(now.getDate() - diffToLastSaturday);
        lastSaturday.setHours(0, 1, 0, 0);
        const targetDateString = lastSaturday.toISOString().split('T')[0];

        try {
            const snapshot = await db.collection('tata_perayaan_mingguan')
                                     .where(firebase.firestore.FieldPath.documentId(), '>=', targetDateString)
                                     .orderBy(firebase.firestore.FieldPath.documentId(), 'asc')
                                     .limit(2)
                                     .get();
    
            if (snapshot.empty) {
                showError(currentContainer, 'Tata Perayaan Ekaristi untuk minggu ini belum tersedia.');
                return;
            }
    
            // Menampilkan TPE minggu ini
            const currentData = snapshot.docs[0]?.data();
            currentContainer.innerHTML = createTpeHtml(currentData);
    
            // Jika ada data untuk minggu depan, siapkan pratinjaunya
            const nextData = snapshot.docs[1]?.data();
            if (nextData) {
                nextContainer.innerHTML = createTpeHtml(nextData);
                controlsContainer.style.display = 'block';
                document.getElementById('tpe-preview-btn').onclick = () => {
                    const isShowingPreview = nextContainer.style.display === 'block';
                    nextContainer.style.display = isShowingPreview ? 'none' : 'block';
                    currentContainer.style.display = isShowingPreview ? 'block' : 'none';
                    document.getElementById('tpe-preview-btn').innerHTML = isShowingPreview ? 'Lihat Pratinjau Minggu Depan &gt;&gt;' : '&lt;&lt; Kembali ke Minggu Ini';
                };
            } else {
                controlsContainer.style.display = 'none';
            }
    
        } catch (error) {
            console.error("Gagal memuat TPE:", error);
            showError(currentContainer, `Gagal memuat data. (${error.message})`);
        }
    };

    /**
     * Memuat data pengumuman/agenda terbaru dari Firestore.
     */
    const loadAnnouncementsPublic = async () => {
        const container = document.querySelector('#agenda-container');
        if (!container) return;
        showLoading(container, 'Memuat agenda terbaru...');
        try {
            const snapshot = await db.collection('announcements').orderBy('createdAt', 'desc').get();
            if (snapshot.empty) {
                container.innerHTML = '<p class="text-center my-4">Saat ini belum ada agenda / pengumuman terbaru.</p>';
                return;
            }
            container.innerHTML = snapshot.docs.map(doc => {
                const item = doc.data();
                const catatanFormatted = (item.catatan || 'Tidak ada catatan.').replace(/\n/g, '<br>');
                return `<div class="col-12 mb-4"><div class="card shadow-sm agenda-card"><div class="card-body"><h5 class="card-title text-primary"><i class="bi bi-bookmark-fill me-2"></i>${item.judul}</h5><div class="mt-3 pt-3 border-top"><p class="mb-2"><i class="bi bi-calendar-event me-2"></i><strong>Tanggal:</strong> ${item.tanggal || '-'}</p><p class="mb-2"><i class="bi bi-clock me-2"></i><strong>Jam:</strong> ${item.jam || '-'}</p><p class="mb-2"><i class="bi bi-geo-alt-fill me-2"></i><strong>Lokasi:</strong> ${item.lokasi || '-'}</p><p class="mb-0 mt-3"><i class="bi bi-info-circle-fill me-2"></i><strong>Catatan:</strong><br><span class="d-inline-block mt-1 ps-4">${catatanFormatted}</span></p></div></div></div></div>`;
            }).join('');
        } catch (error) {
            console.error("Gagal memuat pengumuman: ", error);
            showError(container, `Terjadi kesalahan saat memuat agenda. (${error.message})`);
        }
    };

    /**
     * Memuat status kehadiran pastor dari Firestore.
     */
    const loadPastorStatus = async () => {
        const container = document.querySelector('#pastor');
        if (!container) return;
        showLoading(container, 'Memuat status pastor...');
        try {
            const snapshot = await db.collection('pastors').orderBy('order').get();
            if (snapshot.empty) {
                container.innerHTML = '<h2>Kehadiran Pastor Hari Ini</h2><p>Data pastor belum tersedia.</p>';
                return;
            }
            const statusItems = snapshot.docs.map(doc => {
                const p = doc.data();
                const indicatorClass = p.status === 'Di Tempat' ? 'green' : 'red';
                return `<div><img alt="${p.name}" class="pastor-photo" src="${p.photoUrl}" /><p>${p.name}</p><span class="indicator ${indicatorClass}">${p.status}</span></div>`;
            }).join('');
            container.innerHTML = `<h2>Kehadiran Pastor Hari Ini</h2><div class="pastor-status">${statusItems}</div><p class="mt-3" style="font-size: 0.9rem; color: #555;">Keterangan:<br/><span class="indicator green" style="padding: 2px 10px;">Di Tempat</span> = Pastor berada di pastoran.<br/><span class="indicator red" style="padding: 2px 10px;">Lainnya</span> = Pastor sedang pelayanan di luar, cuti, atau sakit.</p>`;
        } catch (error) {
            console.error("Gagal memuat status pastor:", error);
            showError(container, `Gagal memuat status pastor. (${error.message})`);
        }
    };

    /**
     * Memuat statistik umat (tabel dan grafik) dari Firestore.
     */
    const loadPublicStats = async () => {
        const tableContainer = document.querySelector('#statistik-table-container');
        const mainContainer = document.querySelector('#statistik');
        if (!tableContainer || !mainContainer) return;
        showLoading(tableContainer, 'Memuat statistik umat...');
        try {
            const snapshot = await db.collection('parish_stats').orderBy('order').get();
            if (snapshot.empty) {
                mainContainer.innerHTML = '<h2>Statistik Umat</h2><p>Data belum tersedia.</p>';
                return;
            }
            let totalKK = 0, totalLaki = 0, totalPerempuan = 0;
            const tableRows = snapshot.docs.map(doc => {
                const w = doc.data();
                const jumlah = (w.laki_laki || 0) + (w.perempuan || 0);
                totalKK += w.kk || 0;
                totalLaki += w.laki_laki || 0;
                totalPerempuan += w.perempuan || 0;
                return `<tr><td>${w.order}</td><td>${w.name}</td><td>${w.kk}</td><td>${w.laki_laki}</td><td>${w.perempuan}</td><td>${jumlah}</td></tr>`;
            }).join('');
            
            const totalJiwa = totalLaki + totalPerempuan;
            const totalRow = `<tfoot><tr><td colspan="2">Jumlah</td><td>${totalKK}</td><td>${totalLaki}</td><td>${totalPerempuan}</td><td>${totalJiwa}</td></tr></tfoot>`;
            tableContainer.innerHTML = `<table class="stats-table"><thead><tr><th>No</th><th>Nama Wilayah</th><th>KK</th><th>Laki-laki</th><th>Perempuan</th><th>Jumlah Jiwa</th></tr></thead><tbody>${tableRows}</tbody>${totalRow}</table>`;

            // Membuat atau memperbarui grafik
            const labels = snapshot.docs.map(doc => doc.data().name);
            const data = snapshot.docs.map(doc => (doc.data().laki_laki || 0) + (doc.data().perempuan || 0));
            const ctx = document.getElementById('public-umat-chart').getContext('2d');
            if (publicUmatChart) { publicUmatChart.destroy(); }
            publicUmatChart = new Chart(ctx, {
                type: 'bar',
                data: { labels: labels, datasets: [{ label: 'Jumlah Jiwa', data: data, backgroundColor: 'rgba(0, 74, 153, 0.7)', borderColor: 'rgba(0, 74, 153, 1)', borderWidth: 1 }] },
                options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false }, title: { display: true, text: 'Visualisasi Jumlah Umat per Wilayah/Stasi' } } }
            });
        } catch (error) {
            console.error("Gagal memuat statistik umat:", error);
            showError(mainContainer, `Gagal memuat data. (${error.message})`);
        }
    };

    /**
     * Memuat dan menampilkan daftar sejarah Paus dari file JSON.
     */
    const loadSejarahPausFromJson = async () => {
        const container = document.querySelector('#sejarah-paus-container');
        if (!container) return;
        showLoading(container, 'Memuat sejarah Paus...');
        try {
            const response = await fetch('sejarah_paus.json');
            if (!response.ok) throw new Error(`Gagal memuat file: ${response.statusText}`);
            const allPopes = await response.json();

            const renderTable = (popes) => {
                const tableBody = document.getElementById('pope-table-body');
                if (!tableBody) return;
                tableBody.innerHTML = popes.map(pope => `<tr><td data-label="No.">${pope.urutan}</td><td data-label="Nama Paus"><strong>${pope.nama}</strong><small class="pope-latin-name">${pope.nama_latin}</small></td><td data-label="Masa Jabatan">${pope.masa_jabatan}</td><td data-label="Negara Asal">${pope.negara_asal || '-'}</td><td data-label="Catatan">${pope.catatan || '-'}</td></tr>`).join('');
            };

            container.innerHTML = `<div class="pope-search-wrapper"><input type="text" id="popeSearchInput" class="form-control" placeholder="Cari Paus (nama, tahun, negara)..."></div><div class="pope-table-wrapper"><table class="pope-table"><thead><tr><th>No.</th><th>Nama Paus</th><th>Masa Jabatan</th><th>Negara Asal</th><th>Catatan Singkat</th></tr></thead><tbody id="pope-table-body"></tbody></table></div>`;
            renderTable(allPopes);

            // Tambahkan event listener untuk fungsionalitas pencarian
            document.getElementById('popeSearchInput').addEventListener('input', (e) => {
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
            showError(container, `Pastikan file 'sejarah_paus.json' ada. (${error.message})`);
        }
    };

    /**
     * Memuat dan menampilkan kalender liturgi dari file JSON.
     */
    const loadKalenderFromJson = async () => {
        const container = document.querySelector('#kalender-container');
        if (!container) return;
        showLoading(container, `Memuat kalender liturgi...`);
        try {
            const response = await fetch('kalender_liturgi_2025.json');
            if (!response.ok) throw new Error(`Gagal memuat file: ${response.statusText}`);
            const data = await response.json();

            // Mengelompokkan data berdasarkan bulan
            const groupedByMonth = data.reduce((acc, item) => {
                const date = new Date(item.tanggal + 'T12:00:00Z');
                const monthYear = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
                if (!acc[monthYear]) acc[monthYear] = [];
                acc[monthYear].push(item);
                return acc;
            }, {});
            
            // Membuat HTML untuk setiap bulan
            let html = '';
            const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => new Date('01 ' + a) - new Date('01 ' + b));
            for (const month of sortedMonths) {
                html += `<h3 class="kalender-bulan">${month}</h3><ul class="kalender-list">`;
                groupedByMonth[month].forEach(item => {
                    const date = new Date(item.tanggal + 'T12:00:00Z');
                    const judul = item.judul || 'Tidak ada judul';
                    const getWarnaClass = (j) => {
                        if (j.includes('Hari Raya')) return 'dot-red';
                        if (j.includes('Pesta')) return 'dot-white';
                        if (j.includes('Biasa')) return 'dot-green';
                        if (j.includes('Adven') || j.includes('Prapaskah')) return 'dot-purple';
                        return 'dot-default';
                    };
                    html += `<li class="kalender-item"><div class="kalender-tanggal"><span class="tanggal-angka">${date.getDate()}</span><span class="tanggal-hari">${date.toLocaleDateString('id-ID', { weekday: 'long' })}</span></div><div class="kalender-info"><span class="kalender-judul ${getWarnaClass(judul)}">${judul}</span><span class="kalender-deskripsi">${(item.deskripsi || '').replace(/\n/g, '<br>')}</span></div></li>`;
                });
                html += '</ul>';
            }
            container.innerHTML = html;
        } catch (error) {
            console.error("Gagal memuat Kalender Liturgi dari JSON:", error);
            showError(container, `Pastikan file 'kalender_liturgi_2025.json' ada. (${error.message})`);
        }
    };

    /**
     * Menginisialisasi fungsionalitas halaman Doa-Doa.
     */
    const loadPrayers = () => {
        const listContainer = document.querySelector('#doa-list-container');
        const detailContainer = document.querySelector('#doa-detail-container');
        const doaList = document.querySelector('#doa-list');
        if (!listContainer || !prayersData) return;

        let currentPrayer = null;

        // Tampilkan daftar doa
        doaList.innerHTML = prayersData.map(prayer => `<button type="button" class="list-group-item list-group-item-action">${prayer.title}</button>`).join('');
        
        // Fungsi untuk menampilkan konten doa berdasarkan bahasa yang dipilih
        const renderPrayerContent = (lang) => {
            if (currentPrayer) {
                document.querySelector('#doa-detail-content').innerHTML = currentPrayer.content[lang];
                document.querySelectorAll('#doa-lang-selector button').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
            }
        };

        // Event listener untuk daftar doa (menggunakan event delegation)
        doaList.addEventListener('click', (e) => {
            if (e.target.matches('button.list-group-item-action')) {
                const clickedTitle = e.target.textContent.trim();
                currentPrayer = prayersData.find(p => p.title === clickedTitle);
                if (currentPrayer) {
                    document.querySelector('#doa-detail-title').textContent = currentPrayer.title;
                    renderPrayerContent('indonesia'); // Default ke Bahasa Indonesia
                    listContainer.style.display = 'none';
                    detailContainer.style.display = 'block';
                }
            }
        });

        // Event listener untuk tombol kembali
        document.querySelector('#doa-back-btn').addEventListener('click', () => {
            detailContainer.style.display = 'none';
            listContainer.style.display = 'block';
            currentPrayer = null;
        });

        // Event listener untuk pemilih bahasa
        document.querySelector('#doa-lang-selector').addEventListener('click', (e) => {
            if (e.target.matches('button')) {
                renderPrayerContent(e.target.dataset.lang);
            }
        });
    };

    // =================================================================
    // MANAJEMEN NAVIGASI & UI
    // =================================================================

    /**
     * Mengaktifkan tab konten yang dipilih dan menonaktifkan yang lain.
     * @param {string} tabId - ID dari elemen konten tab yang akan diaktifkan.
     */
    function activateTab(tabId) {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
        // Tutup sidebar secara otomatis di mobile setelah tab dipilih
        const sidebarMenu = document.getElementById('sidebarMenu');
        if (window.innerWidth <= 768 && sidebarMenu.classList.contains('active')) {
            sidebarMenu.classList.remove('active');
            document.body.classList.remove('sidebar-open');
        }
    }

    /**
     * Menginisialisasi event listener untuk sidebar dan tombol navigasi.
     */
    function setupNavigation() {
        const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
        const sidebarMenu = document.getElementById('sidebarMenu');

        if (sidebarToggleBtn && sidebarMenu) {
            sidebarToggleBtn.addEventListener('click', () => {
                sidebarMenu.classList.toggle('active');
                document.body.classList.toggle('sidebar-open');
            });
            // Klik di luar sidebar akan menutupnya (hanya di mobile)
            document.body.addEventListener('click', (event) => {
                if (window.innerWidth <= 768 && document.body.classList.contains('sidebar-open') && !sidebarMenu.contains(event.target) && !sidebarToggleBtn.contains(event.target)) {
                    sidebarMenu.classList.remove('active');
                    document.body.classList.remove('sidebar-open');
                }
            });
        }
        
        // Event listener untuk semua tombol tab di sidebar
        document.querySelectorAll('#sidebarMenu .tab-button[data-tab]').forEach(button => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                activateTab(button.dataset.tab);
            });
        });
    }
    
    /**
     * Menginisialisasi modal pratinjau PDF.
     */
    function setupPreviewModal() {
        const previewModal = document.getElementById('previewModal');
        if (previewModal) {
            previewModal.addEventListener('show.bs.modal', function (event) {
                const button = event.relatedTarget;
                const pdfSrc = button.getAttribute('data-pdf-src');
                const formName = button.textContent.trim();
                
                document.getElementById('previewModalLabel').textContent = 'Pratinjau: ' + formName;
                document.getElementById('pdf-viewer').src = pdfSrc;
                const downloadBtn = document.getElementById('download-pdf-btn');
                downloadBtn.href = pdfSrc;
                downloadBtn.setAttribute('download', formName.replace(/\s+/g, '-') + '.pdf');
            });

            document.getElementById('print-pdf-btn').addEventListener('click', function () {
                const pdfViewer = document.getElementById('pdf-viewer');
                if (pdfViewer.contentWindow) {
                    pdfViewer.contentWindow.print();
                }
            });
            
            previewModal.addEventListener('hidden.bs.modal', () => {
                document.getElementById('pdf-viewer').src = 'about:blank';
            });
        }
    }
    
    // =================================================================
    // TITIK MASUK UTAMA (ENTRY POINT)
    // =================================================================
    
    /**
     * Fungsi utama untuk memuat semua data awal yang diperlukan saat halaman pertama kali dibuka.
     */
    const initializePage = () => {
        setupNavigation();
        setupPreviewModal();
        
        // Muat semua data dinamis dan statis
        loadWeeklyLiturgy();
        loadAnnouncementsPublic();
        loadPastorStatus();
        loadPublicStats();
        loadKalenderFromJson();
        loadSejarahPausFromJson();
        loadPrayers();
        
        // Aktifkan tab default
        activateTab('beranda');
    };
    
    // Jalankan inisialisasi
    initializePage();
});