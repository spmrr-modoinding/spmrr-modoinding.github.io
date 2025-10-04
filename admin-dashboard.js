/*
 * admin-dashboard.js (Versi Final, Lengkap, dan Siap Pakai)
 * File skrip utama untuk fungsionalitas halaman admin.
 *
 * * DAFTAR ISI:
 * 1. INISIALISASI GLOBAL
 * 2. MANAJEMEN OTENTIKASI (LOGIN & AKSES)
 * 3. FUNGSI-FUNGSI LISTENER DATA (REALTIME DARI FIREBASE)
 * 4. FUNGSI PEMBARUAN DASHBOARD
 * 5. FUNGSI BANTU (HELPERS) UNTUK FORM & UI
 * 6. INISIALISASI & EVENT LISTENERS
 */

document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // 1. INISIALISASI GLOBAL
    // =================================================================
    const db = firebase.firestore();
    const auth = firebase.auth();
    let umatChart = null;

    // Variabel untuk menyimpan ID dokumen yang sedang diedit
    let currentEditProgramId = null;
    let currentEditAnnouncementId = null;
    let currentEditTpeId = null;
    let currentEditPrayerId = null; // <-- DITAMBAHKAN

    // Kumpulan elemen DOM yang sering digunakan
    const modals = {
        program: document.getElementById('program-modal'),
        announcement: document.getElementById('announcement-modal'),
        stat: document.getElementById('stat-modal'),
        tpe: document.getElementById('tpe-modal'),
        prayer: document.getElementById('prayer-modal'), // <-- DITAMBAHKAN
    };
    
    // Data statis untuk dropdown program kerja
    const programStruktur = {
        "BIDANG I : MENJAGA PERSEKUTUAN DAN KEPEMIMPINAN YANG MELAYANI": ["1. Menata Struktur dan Manajemen Pastoral Paroki", "2. Menanamkan Dalam Diri Calon Pastor / Imam Pola Kepemimpinan Pastor yang Melayani, Kolegial, Transparan, Suka Mengunjungi Keluarga, Menjadi Mediator Dalam Konflik, dan Memahami manajemen Pastoral.", "3. Mengembangkan Sistem Pembinaan Berkelanjutan Bagi Para Imam / Pastor Untuk Menerapkan Pola Kepemimpinan Pastor yang Melayani, Kolegial, Transparan, Suka Mengunjungi Keluarga, Menjadi Mediator Dalam Konflik, dan Memahami Manajemen Pastoral.", "4. Menghidupkan Spritualitas KBG Sebagai Cara Hidup Mengumat yang Bercorak Ministerial / Kolegial dan Sinergis Dalam Persekutuan Wilayah Rohani dan Kelompok Kategorial", "5. Mengembangkan Situasi dan Semangat Hidup Kekeluargaan dan Persaudaraan", "6. Mempersiapkan Pemekaran Keuskupan Baru"],
        "BIDANG II : Menjaga Perbendaharaan Iman": ["7. Memperkuat Sistem dan Peran Seksi Pewartaan / Katekese Paroki", "8. Menyusun Modul Seksi Pewartaan/Katekese Paroki", "9. Kebutuhan: Meningkatkan Katekese Untuk Menunjang Kegiatan Pewartaan dan Pendalaman Iman di Tingkat Paroki", "10. Menata Kursus Perkawinan, Teologi Dasar, Kitab Suci Dasar, Liturgi Dasar, Untuk Umat (Teritorial & Kategorial)", "11. Menyiapkan dan Mengadakan Pembinaan Tenaga Katekese: Katekis, Para Calon Imam, Para Imam & Biarawan Biarawati", "12. Menyiapkan Sarana & Prasarana Katekese"],
        "BIDANG III : Pelayanan Sabda Dan Sakramen-Sakramen": ["13. Mempekuat Seksi Liturgi Paroki", "14. Menyusun Pedoman Liturgi Sakramen & Peribadatan Pada Umumnya", "15. Meningkatkan Kesadaran & Pentingnya Faktor Keteladanan & Kompetensi Para Pemimpin Liturgi Dalam Melaksanakan Liturgi Yang Benar & Sesuai Aturan", "16. Melengkapi Sarana & Prasarana Liturgi", "17. Mengembangkan Pendidikan & Pemahaman Tentang Musik Liturgi", "18. Mengembangkan Pendidikan & Pemahaman Tentang Inkulturasi"],
        "BIDANG IV : Memajukan Martabat & Peran Kaum Awam Yang Khas Dalam Perutusan Gereja": ["19. Mengembangkan Pembinaan Keluarga Secara Integral", "20. Membina & Memberdayakan Kerasulan Awam Untuk Membantu Karya Pelayanan Paroki", "21. Menanamkan Nilai Unitas & Solidaritas Antara Kaum Awam & Para Pelayan Tertahbis Dalam Semangat Cinta Kasih", "22. Memberdayakan Kualitas Kehidupan Sosial Ekonomi Umat", "23. Mengaktualisasikan Keberpihakan Kepada Kaum Miskin , Marjinal, & Yang Terbuang Berbasis Pemberdayaan Semua Potensi Paroki & Kebijakan Untuk Mengangkat Harkat & Martabat Mereka", "24. Mengembangkan Kualitas & Relasi Antar Umat Beragama di Tingkat Paroki", "25. Meningkatkan Keberpihakan Terhadap Pelestarian Lingkungan"],
        "BIDANG V : Pendidikan Katolik": ["26. Memberdayakan Kelembagaan & Meningkatkan Mutu Manajemen Institusi Pendidkan YPK (Sekolah)", "27. Memberdayakan Kelembagaan & Meningkatkan Mutu Manajemen YPTKKM & Institusi Pendidikan Yang Diselenggarakan", "28. Memberdayakan Kelembagaan & Meningkatkan Mutu Manajemen YPTU De La Salle & Institusi Pendidikan Yang Diselenggarakan", "29. Pengembangan Kerjasama & Sinergitas Antaryayasan Pendidkan di Keuskupan Manado", "30. Pengembangan Pendidikan Katolik Bagi Siswa & Mahasiswa Yang Bersekolah Diluar Lembaga Pendidikan Katolik", "31. Memberi Perhatian Terhadap Pendidikan Usia Dini", "32. Mengembangkan Model Pendidkan Nonformal & Pendidkan Keterampilan"],
        "BIDANG VI : Pengelolaan Harta Benda Gereja": ["33. Menyusun Pedoman Pengelolaan Harta Benda Gereja Yang Mencakup Pedoman Keuangan Serta Tugas Pokok, Tanggung Jawab, & Fungsi Dewan Keuangan Keuskupan, Badan Amal & Milik Keuskupan, Prokur & Komisi Pembangunan", "34. Membangun Sinergitas Antar Badan Pengelola Harta Benda Gereja Di Tingkat Paroki", "35. Mengembangkan Kompetensi, Sistem Kerja, & Sinergitas BadanBadan Pengelola Harta Benda Gereja Mulai Dari Tingkat Paroki Sampai Tingkat Basis", "36. Membangun Sistem Informasi Keuangan Yang Transparan & Terintegrasi Antara Paroki & Kelompok Basis Umat Secata Timbal Balik", "37. Membangun Sistem Manajemen Aset", "38. Pemberdayaan Harta Benda Gereja Melalui Manajemen Investasi Demi Pembangunan Kualitas Kehidupan Umat."]
    };

    // =================================================================
    // 2. MANAJEMEN OTENTIKASI (LOGIN & AKSES)
    // =================================================================
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists && userDoc.data().peran === 'admin') {
                    initializeDashboard(userDoc.data());
                } else {
                    alert('Anda tidak memiliki hak akses untuk halaman ini.');
                    auth.signOut();
                }
            } catch (error) {
                console.error("Error saat verifikasi peran:", error);
                alert("Terjadi kesalahan saat verifikasi pengguna.");
                auth.signOut();
            }
        } else {
            window.location.href = 'login.html';
        }
    });

    /**
     * Inisialisasi semua fungsionalitas dashboard setelah login berhasil.
     */
    function initializeDashboard(userData) {
        document.getElementById('welcome-title').textContent = `PROGRAM KERJA: ${userData.nama_unit || 'PAROKI'}`;
        
        listenToPrograms();
        listenToAnnouncements();
        listenToTPEs();
        listenToPastors();
        listenToParishStats();
        listenToPrayers(); // <-- DITAMBAHKAN
        
        updateSummaryDashboard();
        setupDropdowns();
        setupEventListeners();
        initParticles();
    }

    // =================================================================
    // 3. FUNGSI-FUNGSI LISTENER DATA (REALTIME DARI FIREBASE)
    // =================================================================
    
    const listenToPrograms = () => {
        const programsTableBody = document.getElementById('programs-table-body');
        const tableFooter = document.getElementById('table-footer');
        showTableLoading(programsTableBody, 18);
        tableFooter.innerHTML = '';

        db.collection('programs').orderBy('bidang').onSnapshot(snapshot => {
            if (snapshot.empty) {
                showTableEmpty(programsTableBody, 18, 'Belum ada data program kerja.');
                tableFooter.innerHTML = '';
                return;
            }

            const programs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            programs.sort((a, b) => (a.bidang || '').localeCompare(b.bidang || '') || (a.sub_bidang_title || '').localeCompare(b.sub_bidang_title || '') || (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0));
            
            const groupedData = {};
            programs.forEach(program => {
                const bidang = program.bidang || 'Lain-lain';
                const subBidang = program.sub_bidang_title || 'Tanpa Sub-Judul';
                if (!groupedData[bidang]) groupedData[bidang] = {};
                if (!groupedData[bidang][subBidang]) groupedData[bidang][subBidang] = [];
                groupedData[bidang][subBidang].push(program);
            });

            let html = '';
            let grandTotal = 0;
            for (const bidang in groupedData) {
                html += `<tr class="group-header-bidang"><td colspan="18">${bidang}</td></tr>`;
                for (const subBidang in groupedData[bidang]) {
                    html += `<tr class="group-header-sub"><td colspan="18">${subBidang}</td></tr>`;
                    groupedData[bidang][subBidang].forEach(program => {
                        grandTotal += program.total_anggaran || 0;
                        const hasAnggaran = program.anggaran && program.anggaran.length > 0;
                        const rowCount = hasAnggaran ? program.anggaran.length : 1;
                        html += `<tr data-id="${program.id}">
                            <td rowspan="${rowCount}">${program.pusat_paroki_stasi||'-'}</td>
                            <td rowspan="${rowCount}">${program.nama_unit||'-'}</td>
                            <td rowspan="${rowCount}">${program.nama_kegiatan||'-'}</td>
                            <td rowspan="${rowCount}">${program.sasaran||'-'}</td>
                            <td rowspan="${rowCount}">${program.indikator||'-'}</td>
                            <td rowspan="${rowCount}">${program.model_materi||'-'}</td>
                            <td rowspan="${rowCount}">${program.materi||'-'}</td>
                            <td rowspan="${rowCount}">${program.tempat_waktu||'-'}</td>
                            <td rowspan="${rowCount}">${program.pic||'-'}</td>
                            <td>${hasAnggaran?(program.anggaran[0].perincian||'-'):'-'}</td>
                            <td>${hasAnggaran?(program.anggaran[0].volume||'-'):'-'}</td>
                            <td>${hasAnggaran?(program.anggaran[0].satuan||'-'):'-'}</td>
                            <td>${hasAnggaran?('Rp ' + (program.anggaran[0].harga_satuan||0).toLocaleString('id-ID')):'-'}</td>
                            <td>${hasAnggaran?('Rp ' + (program.anggaran[0].jumlah||0).toLocaleString('id-ID')):'-'}</td>
                            <td rowspan="${rowCount}">${'Rp ' + (program.total_anggaran||0).toLocaleString('id-ID')}</td>
                            <td rowspan="${rowCount}">${program.sumber_dana_kas||'-'}</td>
                            <td rowspan="${rowCount}">${program.sumber_dana_swadaya||'-'}</td>
                            <td rowspan="${rowCount}" class="no-print"><button class="action-btn-sm edit edit-program">Edit</button><button class="action-btn-sm delete delete-program">Hapus</button></td>
                        </tr>`;
                        if (hasAnggaran && program.anggaran.length > 1) {
                            for (let i = 1; i < program.anggaran.length; i++) {
                                const item = program.anggaran[i];
                                html += `<tr data-id="${program.id}">
                                    <td>${item.perincian||'-'}</td>
                                    <td>${item.volume||'-'}</td>
                                    <td>${item.satuan||'-'}</td>
                                    <td>${'Rp ' + (item.harga_satuan||0).toLocaleString('id-ID')}</td>
                                    <td>${'Rp ' + (item.jumlah||0).toLocaleString('id-ID')}</td>
                                </tr>`;
                            }
                        }
                    });
                }
            }
            programsTableBody.innerHTML = html;
            tableFooter.innerHTML = `<tr><td colspan="14" style="text-align:right; font-weight:bold;">JUMLAH BUDGET</td><td style="font-weight:bold;">${'Rp ' + grandTotal.toLocaleString('id-ID')}</td><td colspan="2"></td><td class="no-print"></td></tr>`;
        }, error => {
            console.error("Error listening to programs:", error);
            showTableError(programsTableBody, 18, `Gagal memuat data program kerja. (${error.message})`);
        });
    };
    
    const listenToAnnouncements = () => {
        const announcementsTableBody = document.getElementById('announcements-table-body');
        showTableLoading(announcementsTableBody, 5);
        db.collection('announcements').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
            if (snapshot.empty) {
                showTableEmpty(announcementsTableBody, 5, 'Belum ada pengumuman.');
                return;
            }
            const tableHTML = snapshot.docs.map(doc => {
                const ann = doc.data();
                const catatanPratinjau = ann.catatan ? ann.catatan.replace(/<[^>]+>/g, '').substring(0, 100) + '...' : '-';
                return `<tr data-id="${doc.id}">
                    <td>${ann.judul || '-'}</td>
                    <td>${ann.tanggal || ''}${ann.jam ? ' | ' + ann.jam : ''}</td>
                    <td>${ann.lokasi || '-'}</td>
                    <td>${catatanPratinjau}</td>
                    <td class="no-print">
                        <button class="action-btn-sm edit edit-announcement">Edit</button>
                        <button class="action-btn-sm delete delete-announcement">Hapus</button>
                    </td>
                </tr>`;
            }).join('');
            announcementsTableBody.innerHTML = tableHTML;
        }, error => {
            console.error("Error listening to announcements:", error);
            showTableError(announcementsTableBody, 5, `Gagal memuat data pengumuman. (${error.message})`);
        });
    };
    
    const listenToTPEs = () => {
        const tpeTableBody = document.getElementById('tpe-table-body');
        showTableLoading(tpeTableBody, 3);
        db.collection('tata_perayaan_mingguan').onSnapshot(snapshot => {
            if (snapshot.empty) {
                showTableEmpty(tpeTableBody, 3, 'Belum ada data Tata Perayaan Ekaristi.');
                return;
            }
            const sortedDocs = snapshot.docs.sort((a, b) => b.id.localeCompare(a.id));
            tpeTableBody.innerHTML = sortedDocs.map(doc => {
                const tpe = doc.data();
                return `<tr data-id="${doc.id}">
                    <td>${tpe.tanggal_display || doc.id}</td>
                    <td>${tpe.nama_perayaan || '-'}</td>
                    <td class="no-print">
                        <button class="action-btn-sm edit edit-tpe">Edit</button>
                        <button class="action-btn-sm delete delete-tpe">Hapus</button>
                    </td>
                </tr>`;
            }).join('');
        }, error => {
            console.error("Error saat memuat TPE:", error);
            showTableError(tpeTableBody, 3, `Gagal memuat data TPE. (${error.message})`);
        });
    };

    const listenToPastors = () => {
        const pastorListContainer = document.getElementById('pastor-list-container');
        pastorListContainer.innerHTML = `<div class="feedback-container"><div class="spinner"></div><p>Memuat data pastor...</p></div>`;
        db.collection('pastors').orderBy('order').onSnapshot(snapshot => {
            if (snapshot.empty) {
                pastorListContainer.innerHTML = '<p style="text-align:center; padding: 2rem;">Belum ada data pastor.</p>';
                return;
            }
            pastorListContainer.innerHTML = snapshot.docs.map(doc => {
                const p = doc.data();
                return `<div class="pastor-management-card" data-id="${doc.id}">
                    <img src="${p.photoUrl}" alt="${p.name}">
                    <h5>${p.name}</h5>
                    <select class="pastor-status-select" data-id="${doc.id}">
                        <option value="Di Tempat" ${p.status === 'Di Tempat' ? 'selected' : ''}>Di Tempat</option>
                        <option value="Pelayanan Luar" ${p.status === 'Pelayanan Luar' ? 'selected' : ''}>Pelayanan Luar</option>
                        <option value="Sakit" ${p.status === 'Sakit' ? 'selected' : ''}>Sakit</option>
                        <option value="Cuti/Libur" ${p.status === 'Cuti/Libur' ? 'selected' : ''}>Cuti/Libur</option>
                    </select>
                    <div class="status-update-feedback" id="feedback-${doc.id}"></div>
                </div>`;
            }).join('');
        }, error => {
            pastorListContainer.innerHTML = `<div class="error-alert"><strong>Gagal:</strong> Gagal memuat data pastor. (${error.message})</div>`;
        });
    };
    
    const listenToParishStats = () => {
        const statsTableBody = document.getElementById('stats-table-body');
        const statsTableFooter = document.getElementById('stats-table-footer');
        showTableLoading(statsTableBody, 7);
        statsTableFooter.innerHTML = '';
        db.collection('parish_stats').orderBy('order').onSnapshot(snapshot => {
            if (snapshot.empty) {
                statsTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem;"><p>Data statistik umat belum ada.</p><button id="upload-initial-stats-btn" class="action-btn" style="background-color: #28a745; border-color: #28a745; color: white;"><i class="bi bi-upload"></i> Unggah Data Statistik Awal</button><div id="upload-feedback" style="margin-top: 1rem; font-style: italic;"></div></td></tr>`;
                document.getElementById('upload-initial-stats-btn').addEventListener('click', uploadInitialStats);
                return;
            }
            let totalKK = 0, totalLaki = 0, totalPerempuan = 0;
            statsTableBody.innerHTML = snapshot.docs.map(doc => {
                const stat = doc.data();
                const jumlahJiwa = (stat.laki_laki || 0) + (stat.perempuan || 0);
                totalKK += stat.kk || 0;
                totalLaki += stat.laki_laki || 0;
                totalPerempuan += stat.perempuan || 0;
                return `<tr data-id="${doc.id}">
                    <td>${stat.order}</td>
                    <td>${stat.name}</td>
                    <td>${stat.kk}</td>
                    <td>${stat.laki_laki}</td>
                    <td>${stat.perempuan}</td>
                    <td>${jumlahJiwa}</td>
                    <td class="no-print"><button class="action-btn-sm edit edit-stat">Edit</button></td>
                </tr>`;
            }).join('');
            
            const totalJiwa = totalLaki + totalPerempuan;
            statsTableFooter.innerHTML = `<tr style="font-weight: bold; background-color: #e6f2ff;"><td colspan="2">JUMLAH</td><td>${totalKK}</td><td>${totalLaki}</td><td>${totalPerempuan}</td><td>${totalJiwa}</td><td class="no-print"></td></tr>`;

            const labels = snapshot.docs.map(doc => doc.data().name);
            const data = snapshot.docs.map(doc => (doc.data().laki_laki || 0) + (doc.data().perempuan || 0));
            const ctx = document.getElementById('umat-chart').getContext('2d');
            if (umatChart) { umatChart.destroy(); }
            umatChart = new Chart(ctx, { type: 'bar', data: { labels: labels, datasets: [{ label: 'Jumlah Jiwa per Wilayah/Stasi', data: data, backgroundColor: 'rgba(0, 74, 153, 0.7)', borderColor: 'rgba(0, 74, 153, 1)', borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false }, title: { display: true, text: 'Visualisasi Jumlah Umat per Wilayah/Stasi' } } } });
        }, error => showTableError(statsTableBody, 7, `Gagal memuat data statistik. (${error.message})`));
    };

    // --- FUNGSI BARU DITAMBAHKAN ---
    const listenToPrayers = () => {
        const prayersTableBody = document.getElementById('prayers-table-body');
        showTableLoading(prayersTableBody, 3);
        db.collection('prayers').orderBy('order').onSnapshot(snapshot => {
            if (snapshot.empty) {
                showTableEmpty(prayersTableBody, 3, 'Belum ada data doa. Silakan tambahkan doa baru.');
                return;
            }
            prayersTableBody.innerHTML = snapshot.docs.map(doc => {
                const prayer = doc.data();
                return `<tr data-id="${doc.id}">
                    <td>${prayer.order}</td>
                    <td>${prayer.title || '-'}</td>
                    <td class="no-print">
                        <button class="action-btn-sm edit edit-prayer">Edit</button>
                        <button class="action-btn-sm delete delete-prayer">Hapus</button>
                    </td>
                </tr>`;
            }).join('');
        }, error => {
            console.error("Error saat memuat data doa:", error);
            showTableError(prayersTableBody, 3, `Gagal memuat data doa. (${error.message})`);
        });
    };

    // =================================================================
    // 4. FUNGSI PEMBARUAN DASHBOARD
    // =================================================================
    const updateSummaryDashboard = async () => {
        try {
            const programsSnap = await db.collection('programs').get();
            let totalBudget = 0;
            programsSnap.forEach(doc => { totalBudget += doc.data().total_anggaran || 0; });
            document.getElementById('summary-programs-count').textContent = programsSnap.size;
            document.getElementById('summary-budget-total').textContent = `Rp ${totalBudget.toLocaleString('id-ID')}`;

            const announcementsSnap = await db.collection('announcements').get();
            document.getElementById('summary-announcements-count').textContent = announcementsSnap.size;

            const statsSnap = await db.collection('parish_stats').get();
            let totalUmat = 0;
            statsSnap.forEach(doc => { totalUmat += (doc.data().laki_laki || 0) + (doc.data().perempuan || 0); });
            document.getElementById('summary-umat-total').textContent = totalUmat.toLocaleString('id-ID');
        } catch (error) {
            console.error("Gagal memuat data ringkasan:", error);
        }
    };

    // =================================================================
    // 5. FUNGSI BANTU (HELPERS) UNTUK FORM & UI
    // =================================================================
    const showTableLoading = (tbody, colSpan) => tbody.innerHTML = `<tr><td colspan="${colSpan}"><div class="feedback-container"><div class="spinner"></div><p>Memuat data...</p></div></td></tr>`;
    const showTableError = (tbody, colSpan, message) => tbody.innerHTML = `<tr><td colspan="${colSpan}"><div class="error-alert"><strong>Gagal:</strong> ${message}</div></td></tr>`;
    const showTableEmpty = (tbody, colSpan, message) => tbody.innerHTML = `<tr><td colspan="${colSpan}" style="text-align:center; padding: 2rem;">${message}</td></tr>`;

    function initTinyMCE() {
        tinymce.remove('.tinymce-editor');
        tinymce.init({
            selector: '.tinymce-editor',
            plugins: 'autolink lists link wordcount image',
            toolbar: 'undo redo | blocks | bold italic underline | bullist numlist | link image | removeformat',
            menubar: false,
            height: 250
        });
    }

    function setupDropdowns() {
        const modalBidang = document.getElementById('modal-bidang');
        const modalSubBidang = document.getElementById('modal-sub-bidang');
        modalBidang.innerHTML = '<option value="" disabled selected>Pilih Bidang...</option>';
        Object.keys(programStruktur).forEach(bidang => {
            const option = document.createElement('option');
            option.value = bidang;
            option.textContent = bidang;
            modalBidang.appendChild(option);
        });
        modalBidang.addEventListener('change', () => {
            const selectedBidang = modalBidang.value;
            const subBidangList = programStruktur[selectedBidang] || [];
            modalSubBidang.innerHTML = '<option value="" disabled selected>Pilih Sub-Kelompok...</option>';
            modalSubBidang.disabled = subBidangList.length === 0;
            subBidangList.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub;
                option.textContent = sub;
                modalSubBidang.appendChild(option);
            });
        });
    }

    function addModalAnggaranRow(item = {}) {
        const container = document.getElementById('modal-anggaran-items-container');
        const div = document.createElement('div');
        div.classList.add('anggaran-item');
        div.innerHTML = `<input type="text" placeholder="Perincian" class="anggaran-perincian" value="${item.perincian || ''}" required> <input type="number" placeholder="Vol" class="anggaran-vol" value="${item.volume || 1}"> <input type="text" placeholder="Satuan" class="anggaran-satuan" value="${item.satuan || 'Paket'}"> <input type="number" placeholder="Harga Satuan" class="anggaran-harga" value="${item.harga_satuan || 0}"> <input type="text" placeholder="Jumlah" class="anggaran-jumlah" value="Rp ${(item.jumlah || 0).toLocaleString('id-ID')}" readonly> <button type="button" class="remove-btn">&times;</button>`;
        container.appendChild(div);
    }

    function calculateModalTotal() {
        let total = 0;
        document.getElementById('modal-anggaran-items-container').querySelectorAll('.anggaran-item').forEach(item => {
            const vol = item.querySelector('.anggaran-vol').value || 0;
            const harga = item.querySelector('.anggaran-harga').value || 0;
            const jumlah = vol * harga;
            item.querySelector('.anggaran-jumlah').value = `Rp ${jumlah.toLocaleString('id-ID')}`;
            total += jumlah;
        });
        document.getElementById('modal-total-anggaran-display').textContent = `Rp ${total.toLocaleString('id-ID')}`;
    }

    async function uploadInitialStats() {
        const uploadBtn = document.getElementById('upload-initial-stats-btn');
        const feedbackEl = document.getElementById('upload-feedback');
        if (!confirm('Apakah Anda yakin ingin mengunggah 28 data statistik awal? Tindakan ini hanya boleh dilakukan satu kali.')) return;
        uploadBtn.disabled = true;
        feedbackEl.textContent = 'Memulai proses unggah...';
        const parishStatsData = [ { order: 1, name: 'St. Fransiskus Asisi Sinisir', kk: 23, laki_laki: 41, perempuan: 30 }, { order: 2, name: 'St. Dominikus Sinisir', kk: 22, laki_laki: 28, perempuan: 31 }, { order: 3, name: 'St. Ignatius Sinisir', kk: 20, laki_laki: 24, perempuan: 25 }, { order: 4, name: 'Sta. Skolastika Sinisir', kk: 26, laki_laki: 39, perempuan: 32 }, { order: 5, name: 'St. Vincensius Sinisir', kk: 20, laki_laki: 28, perempuan: 28 }, { order: 6, name: 'St. Stefanus Sinisir', kk: 21, laki_laki: 23, perempuan: 28 }, { order: 7, name: 'Sta. Ursula Sinisir', kk: 19, laki_laki: 26, perempuan: 34 }, { order: 8, name: 'Sta. Maria Bunda Karmel Sinisir', kk: 21, laki_laki: 29, perempuan: 34 }, { order: 9, name: 'St. Romualdus Sinisir', kk: 21, laki_laki: 33, perempuan: 35 }, { order: 10, name: 'Sta. Faustina Sinisir', kk: 19, laki_laki: 30, perempuan: 26 }, { order: 11, name: 'Sta. Theresia Sinisir', kk: 22, laki_laki: 38, perempuan: 28 }, { order: 12, name: 'St. Mikael Sinisir', kk: 13, laki_laki: 16, perempuan: 17 }, { order: 13, name: 'Antonius Maria Claret Makaaroyen', kk: 20, laki_laki: 30, perempuan: 28 }, { order: 14, name: 'St. Alfonsus Maria de Liquori Makaaroyen', kk: 19, laki_laki: 23, perempuan: 29 }, { order: 15, name: 'Sta. Angela Merici Tambelang', kk: 21, laki_laki: 35, perempuan: 28 }, { order: 16, name: 'St. Aloysius Gonzaga Tambelang', kk: 22, laki_laki: 46, perempuan: 34 }, { order: 17, name: 'Sta. Katarina siena Tambelang', kk: 20, laki_laki: 26, perempuan: 31 }, { order: 18, name: 'St. Robertus Belarminus Tambelang', kk: 20, laki_laki: 33, perempuan: 26 }, { order: 19, name: 'St. Yohanes Krisostomus Tambelang', kk: 15, laki_laki: 19, perempuan: 27 }, { order: 20, name: 'St. Fransiskus D sales Tambelang', kk: 19, laki_laki: 34, perempuan: 33 }, { order: 21, name: 'St. Pius X Tambelang', kk: 20, laki_laki: 43, perempuan: 32 }, { order: 22, name: 'St. Hironimus Kinamang', kk: 22, laki_laki: 38, perempuan: 32 }, { order: 23, name: 'St. Lukas Kinamang', kk: 24, laki_laki: 32, perempuan: 45 }, { order: 24, name: 'Sta. Agata Kinamang', kk: 23, laki_laki: 36, perempuan: 30 }, { order: 25, name: 'Sta. Rita de cascia Kinamang', kk: 23, laki_laki: 36, perempuan: 30 }, { order: 26, name: 'St. Laurensius Kinamang', kk: 21, laki_laki: 28, perempuan: 27 }, { order: 27, name: 'Stasi Christus Rex Liningaan', kk: 22, laki_laki: 34, perempuan: 32 }, { order: 28, name: 'Stasi Hati Kudus Yesus Mobuya', kk: 11, laki_laki: 19, perempuan: 16 } ];
        try {
            const batch = db.batch();
            parishStatsData.forEach(stat => {
                const docRef = db.collection('parish_stats').doc();
                batch.set(docRef, stat);
            });
            await batch.commit();
            feedbackEl.textContent = 'BERHASIL!';
            feedbackEl.style.color = 'green';
        } catch (error) {
            console.error('Gagal:', error);
            feedbackEl.textContent = `GAGAL! ${error.message}`;
            feedbackEl.style.color = 'red';
            uploadBtn.disabled = false;
        }
    }
    
    function addJadwalMisaRow(item = {}) {
        const container = document.getElementById('tpe-jadwal-container');
        const div = document.createElement('div');
        div.classList.add('anggaran-item');
        div.innerHTML = `
            <input type="text" placeholder="Jam (07.00)" class="jadwal-jam" value="${item.jam || ''}">
            <input type="text" placeholder="Tempat (Sinisir)" class="jadwal-tempat" value="${item.tempat || ''}">
            <input type="text" placeholder="Perayaan (Misa/Ibadat)" class="jadwal-perayaan" value="${item.perayaan || 'Misa'}">
            <input type="text" placeholder="Pelayan (A. Pondaag)" class="jadwal-pelayan" value="${item.pelayan || ''}">
            <button type="button" class="remove-btn">&times;</button>
        `;
        container.appendChild(div);
    }
    
    // =================================================================
    // 6. INISIALISASI & EVENT LISTENERS
    // =================================================================
    function setupEventListeners() {
        document.querySelectorAll('.nav-tab-btn').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.nav-tab-btn').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.management-section').forEach(s => s.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.target).classList.add('active');
            });
        });

        document.getElementById('logout-button').addEventListener('click', () => auth.signOut());
        document.getElementById('print-btn').addEventListener('click', () => window.print());
        document.getElementById('q-add-program-btn').addEventListener('click', () => document.getElementById('add-program-btn').click());
        document.getElementById('q-add-announcement-btn').addEventListener('click', () => document.getElementById('add-announcement-btn').click());

        document.getElementById('add-program-btn').addEventListener('click', () => {
            currentEditProgramId = null;
            document.getElementById('program-modal-title').textContent = 'Tambah Program Kerja Baru';
            document.getElementById('program-form').reset();
            document.getElementById('modal-sub-bidang').innerHTML = '<option value="" disabled selected>Pilih Bidang terlebih dahulu...</option>';
            document.getElementById('modal-sub-bidang').disabled = true;
            document.getElementById('modal-anggaran-items-container').innerHTML = '';
            addModalAnggaranRow();
            calculateModalTotal();
            document.getElementById('program-form-message').textContent = '';
            modals.program.classList.remove('hidden');
        });

        document.getElementById('programs-table-body').addEventListener('click', async (e) => {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;
            const docId = row.dataset.id;
            if (target.classList.contains('delete-program')) { if (confirm(`Yakin hapus program ini?`)) { await db.collection('programs').doc(docId).delete(); } }
            if (target.classList.contains('edit-program')) {
                const doc = await db.collection('programs').doc(docId).get();
                if (doc.exists) {
                    const program = doc.data();
                    currentEditProgramId = docId;
                    document.getElementById('program-modal-title').textContent = 'Edit Program Kerja';
                    document.getElementById('modal-bidang').value = program.bidang || '';
                    document.getElementById('modal-bidang').dispatchEvent(new Event('change'));
                    setTimeout(() => { document.getElementById('modal-sub-bidang').value = program.sub_bidang_title || ''; }, 100);
                    document.getElementById('modal-lokasi').value = program.pusat_paroki_stasi || '';
                    document.getElementById('modal-nama-unit').value = program.nama_unit || '';
                    document.getElementById('modal-nama_kegiatan').value = program.nama_kegiatan || '';
                    document.getElementById('modal-sasaran').value = program.sasaran || '';
                    document.getElementById('modal-indikator').value = program.indikator || '';
                    document.getElementById('modal-model').value = program.model_materi || '';
                    document.getElementById('modal-materi').value = program.materi || '';
                    document.getElementById('modal-waktu').value = program.tempat_waktu || '';
                    document.getElementById('modal-pic').value = program.pic || '';
                    document.getElementById('modal-sumber-dana-kas').value = program.sumber_dana_kas || '-';
                    document.getElementById('modal-sumber-dana-swadaya').value = program.sumber_dana_swadaya || '-';
                    document.getElementById('modal-anggaran-items-container').innerHTML = '';
                    if (program.anggaran && program.anggaran.length > 0) { program.anggaran.forEach(item => addModalAnggaranRow(item)); } else { addModalAnggaranRow(); }
                    calculateModalTotal();
                    document.getElementById('program-form-message').textContent = '';
                    modals.program.classList.remove('hidden');
                }
            }
        });

        document.getElementById('program-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const msg = document.getElementById('program-form-message');
            msg.textContent = 'Menyimpan...';
            const rincianAnggaran = [];
            document.getElementById('modal-anggaran-items-container').querySelectorAll('.anggaran-item').forEach(item => {
                const perincian = item.querySelector('.anggaran-perincian').value;
                if (perincian) { rincianAnggaran.push({ perincian: perincian, volume: Number(item.querySelector('.anggaran-vol').value) || 0, satuan: item.querySelector('.anggaran-satuan').value, harga_satuan: Number(item.querySelector('.anggaran-harga').value) || 0, jumlah: (Number(item.querySelector('.anggaran-vol').value) || 0) * (Number(item.querySelector('.anggaran-harga').value) || 0) }); }
            });
            const programData = { bidang: document.getElementById('modal-bidang').value, sub_bidang_title: document.getElementById('modal-sub-bidang').value, pusat_paroki_stasi: document.getElementById('modal-lokasi').value, nama_unit: document.getElementById('modal-nama-unit').value, nama_kegiatan: document.getElementById('modal-nama_kegiatan').value, sasaran: document.getElementById('modal-sasaran').value, indikator: document.getElementById('modal-indikator').value, model_materi: document.getElementById('modal-model').value, materi: document.getElementById('modal-materi').value, tempat_waktu: document.getElementById('modal-waktu').value, pic: document.getElementById('modal-pic').value, sumber_dana_kas: document.getElementById('modal-sumber-dana-kas').value, sumber_dana_swadaya: document.getElementById('modal-sumber-dana-swadaya').value, anggaran: rincianAnggaran, total_anggaran: parseFloat(document.getElementById('modal-total-anggaran-display').textContent.replace(/[^0-9]/g, '')), };
            try {
                if (currentEditProgramId) { await db.collection('programs').doc(currentEditProgramId).update(programData); } else { programData.createdAt = firebase.firestore.FieldValue.serverTimestamp(); await db.collection('programs').add(programData); }
                msg.textContent = 'Berhasil!'; msg.className = 'form-message success';
                setTimeout(() => modals.program.classList.add('hidden'), 1500);
            } catch (error) { msg.textContent = 'Gagal menyimpan.'; msg.className = 'form-message error'; }
        });

        document.getElementById('modal-anggaran-items-container').addEventListener('click', (e) => { if (e.target.classList.contains('remove-btn')) { e.target.parentElement.remove(); calculateModalTotal(); }});
        document.getElementById('modal-anggaran-items-container').addEventListener('input', calculateModalTotal);
        document.getElementById('modal-add-anggaran-btn').addEventListener('click', () => addModalAnggaranRow());

        document.getElementById('add-announcement-btn').addEventListener('click', () => {
            currentEditAnnouncementId = null;
            document.getElementById('announcement-modal-title').textContent = 'Tambah Pengumuman Baru';
            document.getElementById('announcement-form').reset();
            document.getElementById('announcement-form-message').textContent = '';
            modals.announcement.classList.remove('hidden');
            initTinyMCE();
        });

        document.getElementById('announcements-table-body').addEventListener('click', async (e) => {
            const target = e.target;
            const row = target.closest('tr');
            if (!row) return;
            const docId = row.dataset.id;
            if (target.classList.contains('edit-announcement')) {
                const doc = await db.collection('announcements').doc(docId).get();
                if (doc.exists) {
                    const ann = doc.data();
                    currentEditAnnouncementId = docId;
                    document.getElementById('announcement-modal-title').textContent = 'Edit Pengumuman';
                    document.getElementById('ann-judul').value = ann.judul || '';
                    document.getElementById('ann-tanggal').value = ann.tanggal || '';
                    document.getElementById('ann-jam').value = ann.jam || '';
                    document.getElementById('ann-lokasi').value = ann.lokasi || '';
                    document.getElementById('announcement-form-message').textContent = '';
                    modals.announcement.classList.remove('hidden');
                    initTinyMCE();
                    setTimeout(() => {
                        tinymce.get('ann-catatan')?.setContent(ann.catatan || '');
                    }, 500);
                }
            }
            if (target.classList.contains('delete-announcement')) { if (confirm('Yakin hapus pengumuman ini?')) { await db.collection('announcements').doc(docId).delete(); } }
        });

        document.getElementById('announcement-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const msg = document.getElementById('announcement-form-message');
            msg.textContent = 'Menyimpan...';
            const data = {
                judul: document.getElementById('ann-judul').value,
                tanggal: document.getElementById('ann-tanggal').value,
                jam: document.getElementById('ann-jam').value,
                lokasi: document.getElementById('ann-lokasi').value,
                catatan: tinymce.get('ann-catatan') ? tinymce.get('ann-catatan').getContent() : document.getElementById('ann-catatan').value,
            };
            try {
                if (currentEditAnnouncementId) {
                    await db.collection('announcements').doc(currentEditAnnouncementId).update(data);
                } else {
                    data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                    await db.collection('announcements').add(data);
                }
                msg.textContent = 'Berhasil!'; msg.className = 'form-message success';
                setTimeout(() => modals.announcement.classList.add('hidden'), 1000);
            } catch (error) {
                msg.textContent = 'Gagal menyimpan.'; msg.className = 'form-message error';
            }
        });

        document.getElementById('add-tpe-btn').addEventListener('click', () => {
            currentEditTpeId = null;
            document.getElementById('tpe-modal-title').textContent = 'Tambah TPE Baru';
            document.getElementById('tpe-form').reset();
            document.getElementById('tpe-jadwal-container').innerHTML = '';
            addJadwalMisaRow();
            document.getElementById('tpe-form-message').textContent = '';
            modals.tpe.classList.remove('hidden');
            initTinyMCE();
        });

        document.getElementById('tpe-add-jadwal-btn').addEventListener('click', () => addJadwalMisaRow());
        document.getElementById('tpe-jadwal-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-btn')) e.target.parentElement.remove();
        });

        document.getElementById('tpe-table-body').addEventListener('click', async (e) => {
            const target = e.target;
            const docId = target.closest('tr')?.dataset.id;
            if (!docId) return;
            if (target.classList.contains('delete-tpe')) { if (confirm(`Yakin ingin menghapus TPE untuk tanggal ${docId}?`)) { await db.collection('tata_perayaan_mingguan').doc(docId).delete(); } }
            if (target.classList.contains('edit-tpe')) {
                const doc = await db.collection('tata_perayaan_mingguan').doc(docId).get();
                if (doc.exists) {
                    const data = doc.data();
                    currentEditTpeId = doc.id;
                    document.getElementById('tpe-modal-title').textContent = 'Edit TPE';
                    document.getElementById('tpe-form').reset();
                    document.getElementById('tpe-tanggal').value = doc.id;
                    document.getElementById('tpe-nama-perayaan').value = data.nama_perayaan || '';
                    document.getElementById('tpe-tahun-liturgi').value = data.tahun_liturgi || '';
                    document.getElementById('tpe-tema').value = data.tema || '';
                    const jadwalContainer = document.getElementById('tpe-jadwal-container');
                    jadwalContainer.innerHTML = '';
                    if (data.jadwal_misa && data.jadwal_misa.length > 0) { data.jadwal_misa.forEach(item => addJadwalMisaRow(item)); } else { addJadwalMisaRow(); }
                    modals.tpe.classList.remove('hidden');
                    initTinyMCE();
                    setTimeout(() => {
                        const tpeDetails = data.tata_perayaan || {};
                        tinymce.get('tpe-antifon-pembuka')?.setContent(tpeDetails.antifon_pembuka || '');
                        tinymce.get('tpe-doa-kolekta')?.setContent(tpeDetails.doa_kolekta || '');
                        tinymce.get('tpe-bacaan-1')?.setContent(tpeDetails.bacaan_1 || '');
                        tinymce.get('tpe-mazmur')?.setContent(tpeDetails.mazmur_tanggapan || '');
                        tinymce.get('tpe-bacaan-2')?.setContent(tpeDetails.bacaan_2 || '');
                        tinymce.get('tpe-bait-injil')?.setContent(tpeDetails.bait_pengantar_injil || '');
                        tinymce.get('tpe-bacaan-injil')?.setContent(tpeDetails.bacaan_injil || '');
                        tinymce.get('tpe-doa-umat')?.setContent(tpeDetails.doa_umat || '');
                        tinymce.get('tpe-doa-persembahan')?.setContent(tpeDetails.doa_persembahan || '');
                        tinymce.get('tpe-antifon-komuni')?.setContent(tpeDetails.antifon_komuni || '');
                        tinymce.get('tpe-doa-sesudah-komuni')?.setContent(tpeDetails.doa_sesudah_komuni || '');
                    }, 500);
                }
            }
        });

        document.getElementById('tpe-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const msg = document.getElementById('tpe-form-message');
            const tanggalInput = document.getElementById('tpe-tanggal').value;
            if (!tanggalInput) { msg.textContent = 'Tanggal Misa wajib diisi!'; msg.className = 'form-message error'; return; }
            msg.textContent = 'Menyimpan...';
            const tataPerayaanData = {};
            const editorIds = [ 'tpe-antifon-pembuka', 'tpe-doa-kolekta', 'tpe-bacaan-1', 'tpe-mazmur', 'tpe-bacaan-2', 'tpe-bait-injil', 'tpe-bacaan-injil', 'tpe-doa-umat', 'tpe-doa-persembahan', 'tpe-antifon-komuni', 'tpe-doa-sesudah-komuni' ];
            const keyMapping = { 'tpe-mazmur': 'mazmur_tanggapan', 'tpe-bait-injil': 'bait_pengantar_injil' };
            editorIds.forEach(id => {
                const editor = tinymce.get(id);
                const content = editor ? editor.getContent() : document.getElementById(id).value;
                const key = keyMapping[id] || id.replace('tpe-', '').replace(/-/g, '_');
                tataPerayaanData[key] = content;
            });
            const docId = tanggalInput;
            const jadwalMisa = Array.from(document.querySelectorAll('#tpe-jadwal-container .anggaran-item')).map(row => ({ jam: row.querySelector('.jadwal-jam').value, tempat: row.querySelector('.jadwal-tempat').value, perayaan: row.querySelector('.jadwal-perayaan').value, pelayan: row.querySelector('.jadwal-pelayan').value, }));
            const displayDate = new Date(tanggalInput + 'T12:00:00Z').toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const tpeData = {
                tanggal_display: displayDate,
                nama_perayaan: document.getElementById('tpe-nama-perayaan').value,
                tahun_liturgi: document.getElementById('tpe-tahun-liturgi').value,
                tema: document.getElementById('tpe-tema').value,
                jadwal_misa: jadwalMisa,
                tata_perayaan: tataPerayaanData
            };
            try {
                await db.collection('tata_perayaan_mingguan').doc(docId).set(tpeData, { merge: true });
                msg.textContent = 'Berhasil disimpan!'; msg.className = 'form-message success';
                setTimeout(() => { modals.tpe.classList.add('hidden'); tinymce.remove(); }, 1500);
            } catch (error) {
                msg.textContent = 'Gagal menyimpan.'; msg.className = 'form-message error';
                console.error("Error saving TPE: ", error);
            }
        });

        document.getElementById('pastor-list-container').addEventListener('change', async (e) => {
            if (e.target.classList.contains('pastor-status-select')) {
                const pastorId = e.target.dataset.id;
                const newStatus = e.target.value;
                const feedbackEl = document.getElementById(`feedback-${pastorId}`);
                if (feedbackEl) feedbackEl.textContent = 'Menyimpan...';
                try {
                    await db.collection('pastors').doc(pastorId).update({ status: newStatus });
                    if (feedbackEl) { feedbackEl.textContent = 'Diperbarui!'; setTimeout(() => { feedbackEl.textContent = ''; }, 2000); }
                } catch (error) { if (feedbackEl) feedbackEl.textContent = 'Gagal!'; }
            }
        });

        document.getElementById('stats-table-body').addEventListener('click', async (e) => {
            if (e.target.classList.contains('edit-stat')) {
                const docId = e.target.closest('tr').dataset.id;
                const doc = await db.collection('parish_stats').doc(docId).get();
                if (doc.exists) {
                    const stat = doc.data();
                    document.getElementById('stat-modal-title').textContent = `Edit: ${stat.name}`;
                    document.getElementById('stat-doc-id').value = docId;
                    document.getElementById('stat-kk').value = stat.kk;
                    document.getElementById('stat-laki').value = stat.laki_laki;
                    document.getElementById('stat-perempuan').value = stat.perempuan;
                    document.getElementById('stat-form-message').textContent = '';
                    modals.stat.classList.remove('hidden');
                }
            }
        });

        document.getElementById('stat-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const docId = document.getElementById('stat-doc-id').value;
            const msg = document.getElementById('stat-form-message');
            const data = { kk: parseInt(document.getElementById('stat-kk').value, 10), laki_laki: parseInt(document.getElementById('stat-laki').value, 10), perempuan: parseInt(document.getElementById('stat-perempuan').value, 10) };
            msg.textContent = 'Menyimpan...';
            try {
                await db.collection('parish_stats').doc(docId).update(data);
                msg.textContent = 'Berhasil!'; msg.className = 'form-message success';
                setTimeout(() => modals.stat.classList.add('hidden'), 1000);
            } catch (error) { msg.textContent = 'Gagal menyimpan.'; msg.className = 'form-message error'; }
        });

        // --- BAGIAN BARU DITAMBAHKAN: EVENT LISTENERS UNTUK DOA ---
        document.getElementById('add-prayer-btn').addEventListener('click', () => {
            currentEditPrayerId = null;
            document.getElementById('prayer-modal-title').textContent = 'Tambah Doa Baru';
            document.getElementById('prayer-form').reset();
            document.getElementById('prayer-form-message').textContent = '';
            modals.prayer.classList.remove('hidden');
            initTinyMCE();
            setTimeout(() => { 
                tinymce.get('prayer-content-indonesia')?.setContent('');
                tinymce.get('prayer-content-latin')?.setContent('');
            }, 500);
        });

        document.getElementById('prayers-table-body').addEventListener('click', async (e) => {
            const target = e.target;
            const docId = target.closest('tr')?.dataset.id;
            if (!docId) return;

            if (target.classList.contains('delete-prayer')) {
                if (confirm('Yakin ingin menghapus doa ini?')) {
                    await db.collection('prayers').doc(docId).delete();
                }
            }

            if (target.classList.contains('edit-prayer')) {
                const doc = await db.collection('prayers').doc(docId).get();
                if (doc.exists) {
                    const data = doc.data();
                    currentEditPrayerId = doc.id;
                    document.getElementById('prayer-modal-title').textContent = 'Edit Doa';
                    document.getElementById('prayer-form').reset();
                    document.getElementById('prayer-title').value = data.title || '';
                    document.getElementById('prayer-order').value = data.order || 99;
                    modals.prayer.classList.remove('hidden');
                    initTinyMCE();
                    setTimeout(() => {
                        tinymce.get('prayer-content-indonesia')?.setContent(data.content_indonesia || '');
                        tinymce.get('prayer-content-latin')?.setContent(data.content_latin || '');
                    }, 500);
                }
            }
        });

        document.getElementById('prayer-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const msg = document.getElementById('prayer-form-message');
            msg.textContent = 'Menyimpan...';

            const prayerData = {
                title: document.getElementById('prayer-title').value,
                order: parseInt(document.getElementById('prayer-order').value, 10),
                content_indonesia: tinymce.get('prayer-content-indonesia').getContent(),
                content_latin: tinymce.get('prayer-content-latin').getContent(),
            };

            try {
                if (currentEditPrayerId) {
                    await db.collection('prayers').doc(currentEditPrayerId).update(prayerData);
                } else {
                    await db.collection('prayers').add(prayerData);
                }
                msg.textContent = 'Berhasil disimpan!';
                msg.className = 'form-message success';
                setTimeout(() => {
                    modals.prayer.classList.add('hidden');
                    tinymce.remove();
                }, 1500);
            } catch (error) {
                msg.textContent = 'Gagal menyimpan.';
                msg.className = 'form-message error';
                console.error("Error saving prayer: ", error);
            }
        });

        document.querySelectorAll('.close-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const modal = document.getElementById(btn.dataset.target);
                if (modal) {
                    modal.classList.add('hidden');
                    if (['tpe-modal', 'announcement-modal', 'prayer-modal'].includes(btn.dataset.target)) {
                        tinymce.remove();
                    }
                }
            });
        });

        document.querySelectorAll('.modal-overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.classList.add('hidden');
                    if (['tpe-modal', 'announcement-modal', 'prayer-modal'].includes(overlay.id)) {
                        tinymce.remove();
                    }
                }
            });
        });
    }

    function initParticles() {
        if (typeof particlesJS !== 'undefined') {
            particlesJS("particles-js", { "particles": { "number": { "value": 80 }, "color": { "value": "#004a99" }, "shape": { "type": "circle" }, "opacity": { "value": 0.5, "anim": { "enable": false } }, "size": { "value": 3, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#004a99", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 6 } }, "interactivity": { "events": { "onhover": { "enable": true, "mode": "repulse" } } }, "retina_detect": true });
        }
    }
});