document.addEventListener('DOMContentLoaded', () => {
    // Konfigurasi Firebase sudah ada di firebase-config.js
    const db = firebase.firestore();
    const auth = firebase.auth();
    let umatChart = null;
    let currentEditProgramId = null;
    let currentEditAnnouncementId = null;
    let currentEditLiturgyId = null;
    let currentEditTpeId = null;

// FUNGSI UNTUK INISIALISASI EDITOR TEKS TINYMCE (VERSI LENGKAP DENGAN API KEY)
function initTinyMCE() {
    // Hapus instance yang mungkin sudah ada untuk mencegah duplikasi
    tinymce.remove();

    // Selektor ini tetap sama, menargetkan semua textarea yang kita inginkan
    const selector = '#tpe-antifon-pembuka, #tpe-doa-kolekta, #tpe-bacaan-1, #tpe-mazmur, #tpe-bacaan-2, #tpe-bait-injil, #tpe-bacaan-injil, #tpe-doa-umat, #tpe-doa-persembahan, #tpe-antifon-komuni, #tpe-doa-sesudah-komuni, #ann-catatan, #lit-renungan';

    tinymce.init({
        selector: selector,
        plugins: 'anchor autolink charmap codesample emoticons link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange formatpainter pageembed permanentpen powerpaste table advcode mergetags',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link media table mergetags | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
        menubar: false,
        height: 250,
        convert_urls: false,
        setup: function (editor) {
            editor.on('change', function () {
                editor.save();
            });
        }
    });
}

    // DATA STRUKTUR PROGRAM KERJA
    const programStruktur = {
        "BIDANG I : MENJAGA PERSEKUTUAN DAN KEPEMIMPINAN YANG MELAYANI": ["1. Menata Struktur dan Manajemen Pastoral Paroki", "2. Menanamkan Dalam Diri Calon Pastor / Imam Pola Kepemimpinan Pastor yang Melayani, Kolegial, Transparan, Suka Mengunjungi Keluarga, Menjadi Mediator Dalam Konflik, dan Memahami manajemen Pastoral.", "3. Mengembangkan Sistem Pembinaan Berkelanjutan Bagi Para Imam / Pastor Untuk Menerapkan Pola Kepemimpinan Pastor yang Melayani, Kolegial, Transparan, Suka Mengunjungi Keluarga, Menjadi Mediator Dalam Konflik, dan Memahami Manajemen Pastoral.", "4. Menghidupkan Spritualitas KBG Sebagai Cara Hidup Mengumat yang Bercorak Ministerial / Kolegial dan Sinergis Dalam Persekutuan Wilayah Rohani dan Kelompok Kategorial", "5. Mengembangkan Situasi dan Semangat Hidup Kekeluargaan dan Persaudaraan", "6. Mempersiapkan Pemekaran Keuskupan Baru"],
        "BIDANG II : Menjaga Perbendaharaan Iman": ["7. Memperkuat Sistem dan Peran Seksi Pewartaan / Katekese Paroki", "8. Menyusun Modul Seksi Pewartaan/Katekese Paroki", "9. Kebutuhan: Meningkatkan Katekese Untuk Menunjang Kegiatan Pewartaan dan Pendalaman Iman di Tingkat Paroki", "10. Menata Kursus Perkawinan, Teologi Dasar, Kitab Suci Dasar, Liturgi Dasar, Untuk Umat (Teritorial & Kategorial)", "11. Menyiapkan dan Mengadakan Pembinaan Tenaga Katekese: Katekis, Para Calon Imam, Para Imam & Biarawan Biarawati", "12. Menyiapkan Sarana & Prasarana Katekese"],
        "BIDANG III : Pelayanan Sabda Dan Sakramen-Sakramen": ["13. Mempekuat Seksi Liturgi Paroki", "14. Menyusun Pedoman Liturgi Sakramen & Peribadatan Pada Umumnya", "15. Meningkatkan Kesadaran & Pentingnya Faktor Keteladanan & Kompetensi Para Pemimpin Liturgi Dalam Melaksanakan Liturgi Yang Benar & Sesuai Aturan", "16. Melengkapi Sarana & Prasarana Liturgi", "17. Mengembangkan Pendidikan & Pemahaman Tentang Musik Liturgi", "18. Mengembangkan Pendidikan & Pemahaman Tentang Inkulturasi"],
        "BIDANG IV : Memajukan Martabat & Peran Kaum Awam Yang Khas Dalam Perutusan Gereja": ["19. Mengembangkan Pembinaan Keluarga Secara Integral", "20. Membina & Memberdayakan Kerasulan Awam Untuk Membantu Karya Pelayanan Paroki", "21. Menanamkan Nilai Unitas & Solidaritas Antara Kaum Awam & Para Pelayan Tertahbis Dalam Semangat Cinta Kasih", "22. Memberdayakan Kualitas Kehidupan Sosial Ekonomi Umat", "23. Mengaktualisasikan Keberpihakan Kepada Kaum Miskin , Marjinal, & Yang Terbuang Berbasis Pemberdayaan Semua Potensi Paroki & Kebijakan Untuk Mengangkat Harkat & Martabat Mereka", "24. Mengembangkan Kualitas & Relasi Antar Umat Beragama di Tingkat Paroki", "25. Meningkatkan Keberpihakan Terhadap Pelestarian Lingkungan"],
        "BIDANG V : Pendidikan Katolik": ["26. Memberdayakan Kelembagaan & Meningkatkan Mutu Manajemen Institusi Pendidkan YPK (Sekolah)", "27. Memberdayakan Kelembagaan & Meningkatkan Mutu Manajemen YPTKKM & Institusi Pendidikan Yang Diselenggarakan", "28. Memberdayakan Kelembagaan & Meningkatkan Mutu Manajemen YPTU De La Salle & Institusi Pendidikan Yang Diselenggarakan", "29. Pengembangan Kerjasama & Sinergitas Antaryayasan Pendidkan di Keuskupan Manado", "30. Pengembangan Pendidikan Katolik Bagi Siswa & Mahasiswa Yang Bersekolah Diluar Lembaga Pendidikan Katolik", "31. Memberi Perhatian Terhadap Pendidikan Usia Dini", "32. Mengembangkan Model Pendidkan Nonformal & Pendidkan Keterampilan"],
        "BIDANG VI : Pengelolaan Harta Benda Gereja": ["33. Menyusun Pedoman Pengelolaan Harta Benda Gereja Yang Mencakup Pedoman Keuangan Serta Tugas Pokok, Tanggung Jawab, & Fungsi Dewan Keuangan Keuskupan, Badan Amal & Milik Keuskupan, Prokur & Komisi Pembangunan", "34. Membangun Sinergitas Antar Badan Pengelola Harta Benda Gereja Di Tingkat Paroki", "35. Mengembangkan Kompetensi, Sistem Kerja, & Sinergitas BadanBadan Pengelola Harta Benda Gereja Mulai Dari Tingkat Paroki Sampai Tingkat Basis", "36. Membangun Sistem Informasi Keuangan Yang Transparan & Terintegrasi Antara Paroki & Kelompok Basis Umat Secata Timbal Balik", "37. Membangun Sistem Manajemen Aset", "38. Pemberdayaan Harta Benda Gereja Melalui Manajemen Investasi Demi Pembangunan Kualitas Kehidupan Umat."]
    };

    const welcomeTitle = document.getElementById('welcome-title');
    const logoutButton = document.getElementById('logout-button');
    const printBtn = document.getElementById('print-btn');
    const programModal = document.getElementById('program-modal');
    const announcementModal = document.getElementById('announcement-modal');
    const liturgyModal = document.getElementById('liturgy-modal');
    const statModal = document.getElementById('stat-modal');
    const tpeModal = document.getElementById('tpe-modal');

    const navTabs = document.querySelectorAll('.nav-tab-btn');
    const managementSections = document.querySelectorAll('.management-section');
    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            managementSections.forEach(s => s.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.target).classList.add('active');
        });
    });

    const showTableLoading = (tableBody, colCount) => { tableBody.innerHTML = `<tr><td colspan="${colCount}"><div class="feedback-container"><div class="spinner"></div><p>Memuat data...</p></div></td></tr>`; };
    const showTableError = (tableBody, colCount, message) => { tableBody.innerHTML = `<tr><td colspan="${colCount}"><div class="error-alert"><strong>Gagal:</strong> ${message}</div></td></tr>`; };
    const showTableEmpty = (tableBody, colCount, message) => { tableBody.innerHTML = `<tr><td colspan="${colCount}" style="text-align:center; padding: 2rem;">${message}</td></tr>`; };

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists && userDoc.data().peran === 'admin') {
                    welcomeTitle.textContent = `PROGRAM KERJA: ${userDoc.data().nama_unit}`;
                    listenToPrograms();
                    listenToAnnouncements();
                    listenToLiturgies();
                    listenToTPEs();
                    listenToPastors();
                    listenToParishStats();
                    updateSummaryDashboard();
                    setupDropdowns();
                } else {
                    alert('Anda tidak memiliki hak akses untuk halaman ini.');
                    auth.signOut(); window.location.href = 'login.html';
                }
            } catch (error) {
                console.error("Error verifying user role:", error);
                alert("Terjadi kesalahan saat verifikasi pengguna. Silakan coba lagi.");
                auth.signOut(); window.location.href = 'login.html';
            }
        } else {
            window.location.href = 'login.html';
        }
    });

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
    
    const listenToPrograms = () => {
        const programsTableBody = document.getElementById('programs-table-body');
        const tableFooter = document.getElementById('table-footer');
        showTableLoading(programsTableBody, 17);
        tableFooter.innerHTML = '';
        db.collection('programs').orderBy('bidang').onSnapshot(snapshot => {
            if (snapshot.empty) {
                showTableEmpty(programsTableBody, 17, 'Belum ada data program kerja.');
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
                html += `<tr class="group-header-bidang"><td colspan="17">${bidang}</td></tr>`;
                for (const subBidang in groupedData[bidang]) {
                    html += `<tr class="group-header-sub"><td colspan="17">${subBidang}</td></tr>`;
                    groupedData[bidang][subBidang].forEach(program => {
                        grandTotal += program.total_anggaran || 0;
                        const hasAnggaran = program.anggaran && program.anggaran.length > 0;
                        const rowCount = hasAnggaran ? program.anggaran.length : 1;
                        html += `<tr data-id="${program.id}"><td rowspan="${rowCount}">${program.pusat_paroki_stasi||'-'}</td><td rowspan="${rowCount}">${program.nama_unit||'-'}</td><td rowspan="${rowCount}">${program.nama_kegiatan||'-'}</td><td rowspan="${rowCount}">${program.sasaran||'-'}</td><td rowspan="${rowCount}">${program.indikator||'-'}</td><td rowspan="${rowCount}">${program.model_materi||'-'}</td><td rowspan="${rowCount}">${program.materi||'-'}</td><td rowspan="${rowCount}">${program.tempat_waktu||'-'}</td><td rowspan="${rowCount}">${program.pic||'-'}</td><td>${hasAnggaran?(program.anggaran[0].perincian||'-'):'-'}</td><td>${hasAnggaran?(program.anggaran[0].volume||'-'):'-'}</td><td>${hasAnggaran?(program.anggaran[0].satuan||'-'):'-'}</td><td>${hasAnggaran?('Rp ' + (program.anggaran[0].harga_satuan||0).toLocaleString('id-ID')):'-'}</td><td>${hasAnggaran?('Rp ' + (program.anggaran[0].jumlah||0).toLocaleString('id-ID')):'-'}</td><td rowspan="${rowCount}">${'Rp ' + (program.total_anggaran||0).toLocaleString('id-ID')}</td><td rowspan="${rowCount}">${program.sumber_dana_kas||'-'}</td><td rowspan="${rowCount}">${program.sumber_dana_swadaya||'-'}</td><td rowspan="${rowCount}" class="no-print"><button class="action-btn-sm edit edit-program">Edit</button><button class="action-btn-sm delete delete-program">Hapus</button></td></tr>`;
                        if (hasAnggaran && program.anggaran.length > 1) {
                            for (let i = 1; i < program.anggaran.length; i++) {
                                const item = program.anggaran[i];
                                html += `<tr data-id="${program.id}"><td>${item.perincian||'-'}</td><td>${item.volume||'-'}</td><td>${item.satuan||'-'}</td><td>${'Rp ' + (item.harga_satuan||0).toLocaleString('id-ID')}</td><td>${'Rp ' + (item.jumlah||0).toLocaleString('id-ID')}</td></tr>`;
                            }
                        }
                    });
                }
            }
            programsTableBody.innerHTML = html;
            tableFooter.innerHTML = `<tr><td colspan="14" style="text-align:right; font-weight:bold;">JUMLAH BUDGET</td><td style="font-weight:bold;">${'Rp ' + grandTotal.toLocaleString('id-ID')}</td><td colspan="2"></td><td class="no-print"></td></tr>`;
        }, error => {
            console.error("Error listening to programs:", error);
            showTableError(programsTableBody, 17, `Gagal memuat data program kerja. (${error.message})`);
        });
    };
    const listenToAnnouncements = () => {
        const announcementsTableBody = document.getElementById('announcements-table-body');
        showTableLoading(announcementsTableBody, 5);
        db.collection('announcements').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
            if (snapshot.empty) { showTableEmpty(announcementsTableBody, 5, 'Belum ada pengumuman.'); return; }
            announcementsTableBody.innerHTML = snapshot.docs.map(doc => { const ann = doc.data(); return `<tr data-id="${doc.id}"><td>${ann.judul||'-'}</td><td>${ann.tanggal||''}${ann.jam ? ' | '+ann.jam : ''}</td><td>${ann.lokasi||'-'}</td><td>${(ann.catatan || '-').replace(/\n/g, '<br>')}</td><td class="no-print"><button class="action-btn-sm edit edit-announcement">Edit</button><button class="action-btn-sm delete delete-announcement">Hapus</button></td></tr>`; }).join('');
        }, error => showTableError(announcementsTableBody, 5, `Gagal memuat data pengumuman. (${error.message})`));
    };
    const listenToLiturgies = () => {
        const liturgiesTableBody = document.getElementById('liturgies-table-body');
        showTableLoading(liturgiesTableBody, 4);
        db.collection('liturgies').orderBy('liturgyDate', 'desc').onSnapshot(snapshot => {
            if (snapshot.empty) { showTableEmpty(liturgiesTableBody, 4, 'Belum ada data liturgi.'); return; }
            liturgiesTableBody.innerHTML = snapshot.docs.map(doc => { const lit = doc.data(); return `<tr data-id="${doc.id}"><td>${lit.tanggal||'-'}</td><td>${lit.peringatan||'-'}</td><td>${lit.warna||'-'}</td><td class="no-print"><button class="action-btn-sm edit edit-liturgy">Edit</button><button class="action-btn-sm delete delete-liturgy">Hapus</button></td></tr>`; }).join('');
        }, error => showTableError(liturgiesTableBody, 4, `Gagal memuat data liturgi. (${error.message})`));
    };
    const listenToPastors = () => {
        const pastorListContainer = document.getElementById('pastor-list-container');
        pastorListContainer.innerHTML = `<div class="feedback-container"><div class="spinner"></div><p>Memuat data pastor...</p></div>`;
        db.collection('pastors').orderBy('order').onSnapshot(snapshot => {
            if (snapshot.empty) { pastorListContainer.innerHTML = '<p style="text-align:center; padding: 2rem;">Belum ada data pastor.</p>'; return; }
            pastorListContainer.innerHTML = snapshot.docs.map(doc => { const p = doc.data(); return `<div class="pastor-management-card" data-id="${doc.id}"><img src="${p.photoUrl}" alt="${p.name}"><h5>${p.name}</h5><select class="pastor-status-select" data-id="${doc.id}"><option value="Di Tempat" ${p.status === 'Di Tempat' ? 'selected' : ''}>Di Tempat</option><option value="Pelayanan Luar" ${p.status === 'Pelayanan Luar' ? 'selected' : ''}>Pelayanan Luar</option><option value="Sakit" ${p.status === 'Sakit' ? 'selected' : ''}>Sakit</option><option value="Cuti/Libur" ${p.status === 'Cuti/Libur' ? 'selected' : ''}>Cuti/Libur</option></select><div class="status-update-feedback" id="feedback-${doc.id}"></div></div>`; }).join('');
        }, error => pastorListContainer.innerHTML = `<div class="error-alert"><strong>Gagal:</strong> Gagal memuat data pastor. (${error.message})</div>`);
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
            statsTableBody.innerHTML = snapshot.docs.map(doc => { const stat = doc.data(); const jumlahJiwa = (stat.laki_laki || 0) + (stat.perempuan || 0); totalKK += stat.kk || 0; totalLaki += stat.laki_laki || 0; totalPerempuan += stat.perempuan || 0; return `<tr data-id="${doc.id}"><td>${stat.order}</td><td>${stat.name}</td><td>${stat.kk}</td><td>${stat.laki_laki}</td><td>${stat.perempuan}</td><td>${jumlahJiwa}</td><td class="no-print"><button class="action-btn-sm edit edit-stat">Edit</button></td></tr>`; }).join('');
            const totalJiwa = totalLaki + totalPerempuan;
            statsTableFooter.innerHTML = `<tr style="font-weight: bold; background-color: #e6f2ff;"><td colspan="2">JUMLAH</td><td>${totalKK}</td><td>${totalLaki}</td><td>${totalPerempuan}</td><td>${totalJiwa}</td><td class="no-print"></td></tr>`;

            const labels = snapshot.docs.map(doc => doc.data().name);
            const data = snapshot.docs.map(doc => (doc.data().laki_laki || 0) + (doc.data().perempuan || 0));
            const ctx = document.getElementById('umat-chart').getContext('2d');
            if (umatChart) { umatChart.destroy(); }
            umatChart = new Chart(ctx, { type: 'bar', data: { labels: labels, datasets: [{ label: 'Jumlah Jiwa per Wilayah/Stasi', data: data, backgroundColor: 'rgba(0, 74, 153, 0.7)', borderColor: 'rgba(0, 74, 153, 1)', borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false }, title: { display: true, text: 'Visualisasi Jumlah Umat per Wilayah/Stasi' } } } });
        }, error => showTableError(statsTableBody, 7, `Gagal memuat data statistik. (${error.message})`));
    };

    const listenToTPEs = () => {
        const tpeTableBody = document.getElementById('tpe-table-body');
        showTableLoading(tpeTableBody, 3);
        db.collection('tata_perayaan_mingguan').onSnapshot(snapshot => {
            if (snapshot.empty) { showTableEmpty(tpeTableBody, 3, 'Belum ada data Tata Perayaan Ekaristi.'); return; }
            const sortedDocs = snapshot.docs.sort((a, b) => b.id.localeCompare(a.id));
            tpeTableBody.innerHTML = sortedDocs.map(doc => { const tpe = doc.data(); return `<tr data-id="${doc.id}"><td>${tpe.tanggal_display || doc.id}</td><td>${tpe.nama_perayaan || '-'}</td><td class="no-print"><button class="action-btn-sm edit edit-tpe">Edit</button><button class="action-btn-sm delete delete-tpe">Hapus</button></td></tr>`; }).join('');
        }, error => {
            console.error("Error final saat memuat TPE:", error);
            showTableError(tpeTableBody, 3, `Gagal memuat data TPE. (${error.message})`);
        });
    };

    function setupDropdowns() {
        const modalBidang = document.getElementById('modal-bidang');
        const modalSubBidang = document.getElementById('modal-sub-bidang');
        modalBidang.innerHTML = '<option value="" disabled selected>Pilih Bidang...</option>';
        Object.keys(programStruktur).forEach(bidang => { const option = document.createElement('option'); option.value = bidang; option.textContent = bidang; modalBidang.appendChild(option); });
        modalBidang.addEventListener('change', () => {
            const selectedBidang = modalBidang.value;
            const subBidangList = programStruktur[selectedBidang] || [];
            modalSubBidang.innerHTML = '<option value="" disabled selected>Pilih Sub-Kelompok...</option>';
            modalSubBidang.disabled = subBidangList.length === 0;
            subBidangList.forEach(sub => { const option = document.createElement('option'); option.value = sub; option.textContent = sub; modalSubBidang.appendChild(option); });
        });
    };
    function addModalAnggaranRow(item = {}) {
        const container = document.getElementById('modal-anggaran-items-container');
        const div = document.createElement('div');
        div.classList.add('anggaran-item');
        div.innerHTML = `<input type="text" placeholder="Perincian" class="anggaran-perincian" value="${item.perincian || ''}" required> <input type="number" placeholder="Vol" class="anggaran-vol" value="${item.volume || 1}"> <input type="text" placeholder="Satuan" class="anggaran-satuan" value="${item.satuan || 'Paket'}"> <input type="number" placeholder="Harga Satuan" class="anggaran-harga" value="${item.harga_satuan || 0}"> <input type="text" placeholder="Jumlah" class="anggaran-jumlah" value="Rp ${(item.jumlah || 0).toLocaleString('id-ID')}" readonly> <button type="button" class="remove-btn">&times;</button>`;
        container.appendChild(div);
    };
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
    };
    function parseIndonesianDate(dateString) {
        const months = { 'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5, 'juli': 6, 'agustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11 };
        const parts = dateString.toLowerCase().split(' ');
        if (parts.length !== 3) return null;
        const day = parseInt(parts[0], 10), month = months[parts[1]], year = parseInt(parts[2], 10);
        if (isNaN(day) || month === undefined || isNaN(year)) return null;
        return new Date(year, month, day);
    };
    async function uploadInitialStats() {
        const uploadBtn = document.getElementById('upload-initial-stats-btn');
        const feedbackEl = document.getElementById('upload-feedback');
        if (!confirm('Apakah Anda yakin ingin mengunggah 28 data statistik awal? Tindakan ini hanya boleh dilakukan satu kali.')) return;
        uploadBtn.disabled = true;
        feedbackEl.textContent = 'Memulai proses unggah...';
        const parishStatsData = [ { order: 1, name: 'St. Fransiskus Asisi Sinisir', kk: 23, laki_laki: 41, perempuan: 30 }, { order: 2, name: 'St. Dominikus Sinisir', kk: 22, laki_laki: 28, perempuan: 31 }, { order: 3, name: 'St. Ignatius Sinisir', kk: 20, laki_laki: 24, perempuan: 25 }, { order: 4, name: 'Sta. Skolastika Sinisir', kk: 26, laki_laki: 39, perempuan: 32 }, { order: 5, name: 'St. Vincensius Sinisir', kk: 20, laki_laki: 28, perempuan: 28 }, { order: 6, name: 'St. Stefanus Sinisir', kk: 21, laki_laki: 23, perempuan: 28 }, { order: 7, name: 'Sta. Ursula Sinisir', kk: 19, laki_laki: 26, perempuan: 34 }, { order: 8, name: 'Sta. Maria Bunda Karmel Sinisir', kk: 21, laki_laki: 29, perempuan: 34 }, { order: 9, name: 'St. Romualdus Sinisir', kk: 21, laki_laki: 33, perempuan: 35 }, { order: 10, name: 'Sta. Faustina Sinisir', kk: 19, laki_laki: 30, perempuan: 26 }, { order: 11, name: 'Sta. Theresia Sinisir', kk: 22, laki_laki: 38, perempuan: 28 }, { order: 12, name: 'St. Mikael Sinisir', kk: 13, laki_laki: 16, perempuan: 17 }, { order: 13, name: 'Antonius Maria Claret Makaaroyen', kk: 20, laki_laki: 30, perempuan: 28 }, { order: 14, name: 'St. Alfonsus Maria de Liquori Makaaroyen', kk: 19, laki_laki: 23, perempuan: 29 }, { order: 15, name: 'Sta. Angela Merici Tambelang', kk: 21, laki_laki: 35, perempuan: 28 }, { order: 16, name: 'St. Aloysius Gonzaga Tambelang', kk: 22, laki_laki: 46, perempuan: 34 }, { order: 17, name: 'Sta. Katarina siena Tambelang', kk: 20, laki_laki: 26, perempuan: 31 }, { order: 18, name: 'St. Robertus Belarminus Tambelang', kk: 20, laki_laki: 33, perempuan: 26 }, { order: 19, name: 'St. Yohanes Krisostomus Tambelang', kk: 15, laki_laki: 19, perempuan: 27 }, { order: 20, name: 'St. Fransiskus D sales Tambelang', kk: 19, laki_laki: 34, perempuan: 33 }, { order: 21, name: 'St. Pius X Tambelang', kk: 20, laki_laki: 43, perempuan: 32 }, { order: 22, name: 'St. Hironimus Kinamang', kk: 22, laki_laki: 38, perempuan: 32 }, { order: 23, name: 'St. Lukas Kinamang', kk: 24, laki_laki: 32, perempuan: 45 }, { order: 24, name: 'Sta. Agata Kinamang', kk: 23, laki_laki: 36, perempuan: 30 }, { order: 25, name: 'Sta. Rita de cascia Kinamang', kk: 23, laki_laki: 36, perempuan: 30 }, { order: 26, name: 'St. Laurensius Kinamang', kk: 21, laki_laki: 28, perempuan: 27 }, { order: 27, name: 'Stasi Christus Rex Liningaan', kk: 22, laki_laki: 34, perempuan: 32 }, { order: 28, name: 'Stasi Hati Kudus Yesus Mobuya', kk: 11, laki_laki: 19, perempuan: 16 } ];
        try { const batch = db.batch(); parishStatsData.forEach(stat => { const docRef = db.collection('parish_stats').doc(); batch.set(docRef, stat); }); await batch.commit(); feedbackEl.textContent = 'BERHASIL!'; feedbackEl.style.color = 'green'; } catch (error) { console.error('Gagal:', error); feedbackEl.textContent = `GAGAL! ${error.message}`; feedbackEl.style.color = 'red'; uploadBtn.disabled = false; }
    };
    
    function addJadwalMisaRow(item = {}) {
        const container = document.getElementById('tpe-jadwal-container');
        const div = document.createElement('div');
        div.classList.add('anggaran-item');
        div.innerHTML = `
            <input type="text" placeholder="Jam (07.00)" class="jadwal-jam" value="${item.jam || ''}" style="grid-column: span 1;">
            <input type="text" placeholder="Tempat (Sinisir)" class="jadwal-tempat" value="${item.tempat || ''}" style="grid-column: span 2;">
            <input type="text" placeholder="Perayaan (Misa/Ibadat)" class="jadwal-perayaan" value="${item.perayaan || 'Misa'}" style="grid-column: span 2;">
            <input type="text" placeholder="Pelayan (A. Pondaag)" class="jadwal-pelayan" value="${item.pelayan || ''}" style="grid-column: span 2;">
            <button type="button" class="remove-btn" style="grid-column: span 1;">&times;</button>
        `;
        container.appendChild(div);
    }
    
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
        programModal.classList.remove('hidden');
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
                programModal.classList.remove('hidden');
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
            msg.textContent = 'Berhasil!'; msg.className = 'form-message success'; setTimeout(() => programModal.classList.add('hidden'), 1500);
        } catch (error) { msg.textContent = 'Gagal menyimpan.'; msg.className = 'form-message error'; }
    });
    document.getElementById('modal-anggaran-items-container').addEventListener('click', (e) => { if (e.target.classList.contains('remove-btn')) { e.target.parentElement.remove(); calculateModalTotal(); }});
    document.getElementById('modal-anggaran-items-container').addEventListener('input', calculateModalTotal);
    document.getElementById('modal-add-anggaran-btn').addEventListener('click', () => addModalAnggaranRow());
    document.getElementById('add-announcement-btn').addEventListener('click', () => { currentEditAnnouncementId = null; document.getElementById('announcement-modal-title').textContent = 'Tambah Pengumuman Baru'; document.getElementById('announcement-form').reset(); document.getElementById('announcement-form-message').textContent = ''; announcementModal.classList.remove('hidden'); });
    document.getElementById('announcements-table-body').addEventListener('click', async (e) => {
        const target = e.target;
        const row = target.closest('tr');
        if (!row) return;
        const docId = row.dataset.id;
        if (target.classList.contains('edit-announcement')) {
            const doc = await db.collection('announcements').doc(docId).get();
            if (doc.exists) { const ann = doc.data(); currentEditAnnouncementId = docId; document.getElementById('announcement-modal-title').textContent = 'Edit Pengumuman'; document.getElementById('ann-judul').value = ann.judul || ''; document.getElementById('ann-tanggal').value = ann.tanggal || ''; document.getElementById('ann-jam').value = ann.jam || ''; document.getElementById('ann-lokasi').value = ann.lokasi || ''; document.getElementById('ann-catatan').value = ann.catatan || ''; document.getElementById('announcement-form-message').textContent = ''; announcementModal.classList.remove('hidden'); }
        }
        if (target.classList.contains('delete-announcement')) { if (confirm('Yakin hapus pengumuman ini?')) { await db.collection('announcements').doc(docId).delete(); } }
    });
    document.getElementById('announcement-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = document.getElementById('announcement-form-message');
        msg.textContent = 'Menyimpan...';
        const data = { judul: document.getElementById('ann-judul').value, tanggal: document.getElementById('ann-tanggal').value, jam: document.getElementById('ann-jam').value, lokasi: document.getElementById('ann-lokasi').value, catatan: document.getElementById('ann-catatan').value, };
        try { if (currentEditAnnouncementId) { await db.collection('announcements').doc(currentEditAnnouncementId).update(data); } else { data.createdAt = firebase.firestore.FieldValue.serverTimestamp(); await db.collection('announcements').add(data); } msg.textContent = 'Berhasil!'; msg.className = 'form-message success'; setTimeout(() => announcementModal.classList.add('hidden'), 1000); } catch (error) { msg.textContent = 'Gagal menyimpan.'; msg.className = 'form-message error'; }
    });
    document.getElementById('add-liturgy-btn').addEventListener('click', () => { currentEditLiturgyId = null; document.getElementById('liturgy-modal-title').textContent = 'Tambah Liturgi Baru'; document.getElementById('liturgy-form').reset(); document.getElementById('liturgy-form-message').textContent = ''; liturgyModal.classList.remove('hidden'); });
    document.getElementById('liturgy-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = document.getElementById('liturgy-form-message');
        msg.textContent = 'Menyimpan...';
        const dateString = document.getElementById('lit-tanggal').value;
        const parsedDate = parseIndonesianDate(dateString);
        if (!parsedDate) { msg.textContent = 'Format tanggal salah! Contoh: 13 Juli 2025'; msg.className = 'form-message error'; return; }
        const data = { tanggal: dateString, liturgyDate: firebase.firestore.Timestamp.fromDate(parsedDate), peringatan: document.getElementById('lit-peringatan').value, warna: document.getElementById('lit-warna').value, bacaan1: document.getElementById('lit-bacaan1').value, bacaan2: document.getElementById('lit-bacaan2').value, mazmur: document.getElementById('lit-mazmur').value, injil: document.getElementById('lit-injil').value, renungan: document.getElementById('lit-renungan').value, };
        try { if (currentEditLiturgyId) { await db.collection('liturgies').doc(currentEditLiturgyId).update(data); } else { await db.collection('liturgies').add(data); } msg.textContent = 'Berhasil!'; msg.className = 'form-message success'; setTimeout(() => liturgyModal.classList.add('hidden'), 1000); } catch (error) { msg.textContent = 'Gagal menyimpan.'; msg.className = 'form-message error'; }
    });
    document.getElementById('liturgies-table-body').addEventListener('click', async (e) => {
        const target = e.target;
        const row = target.closest('tr');
        if (!row) return;
        const docId = row.dataset.id;
        if (target.classList.contains('edit-liturgy')) {
            const doc = await db.collection('liturgies').doc(docId).get();
            if (doc.exists) { const lit = doc.data(); currentEditLiturgyId = docId; document.getElementById('liturgy-modal-title').textContent = 'Edit Liturgi'; document.getElementById('lit-tanggal').value = lit.tanggal || ''; document.getElementById('lit-peringatan').value = lit.peringatan || ''; document.getElementById('lit-warna').value = lit.warna || ''; document.getElementById('lit-bacaan1').value = lit.bacaan1 || ''; document.getElementById('lit-bacaan2').value = lit.bacaan2 || ''; document.getElementById('lit-mazmur').value = lit.mazmur || ''; document.getElementById('lit-injil').value = lit.injil || ''; document.getElementById('lit-renungan').value = lit.renungan || ''; document.getElementById('liturgy-form-message').textContent = ''; liturgyModal.classList.remove('hidden'); }
        }
        if (target.classList.contains('delete-liturgy')) { if (confirm('Yakin hapus liturgi ini?')) { await db.collection('liturgies').doc(docId).delete(); } }
    });
    document.getElementById('pastor-list-container').addEventListener('change', async (e) => {
        if (e.target.classList.contains('pastor-status-select')) {
            const pastorId = e.target.dataset.id;
            const newStatus = e.target.value;
            const feedbackEl = document.getElementById(`feedback-${pastorId}`);
            if (feedbackEl) feedbackEl.textContent = 'Menyimpan...';
            try { await db.collection('pastors').doc(pastorId).update({ status: newStatus }); if (feedbackEl) { feedbackEl.textContent = 'Diperbarui!'; setTimeout(() => { feedbackEl.textContent = ''; }, 2000); } } catch (error) { if (feedbackEl) feedbackEl.textContent = 'Gagal!'; }
        }
    });
    document.getElementById('stats-table-body').addEventListener('click', async (e) => {
        if (e.target.classList.contains('edit-stat')) {
            const docId = e.target.closest('tr').dataset.id;
            const doc = await db.collection('parish_stats').doc(docId).get();
            if(doc.exists) { const stat = doc.data(); document.getElementById('stat-modal-title').textContent = `Edit: ${stat.name}`; document.getElementById('stat-doc-id').value = docId; document.getElementById('stat-kk').value = stat.kk; document.getElementById('stat-laki').value = stat.laki_laki; document.getElementById('stat-perempuan').value = stat.perempuan; document.getElementById('stat-form-message').textContent = ''; statModal.classList.remove('hidden'); }
        }
    });
    document.getElementById('stat-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const docId = document.getElementById('stat-doc-id').value;
        const msg = document.getElementById('stat-form-message');
        const data = { kk: parseInt(document.getElementById('stat-kk').value, 10), laki_laki: parseInt(document.getElementById('stat-laki').value, 10), perempuan: parseInt(document.getElementById('stat-perempuan').value, 10) };
        msg.textContent = 'Menyimpan...';
        try { await db.collection('parish_stats').doc(docId).update(data); msg.textContent = 'Berhasil!'; msg.className = 'form-message success'; setTimeout(() => statModal.classList.add('hidden'), 1000); } catch (error) { msg.textContent = 'Gagal menyimpan.'; msg.className = 'form-message error'; }
    });

    document.getElementById('tpe-jadwal-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) e.target.parentElement.remove();
    });
    document.getElementById('add-tpe-btn').addEventListener('click', () => {
        currentEditTpeId = null;
        document.getElementById('tpe-modal-title').textContent = 'Tambah TPE Baru';
        document.getElementById('tpe-form').reset();
        document.getElementById('tpe-jadwal-container').innerHTML = '';
        addJadwalMisaRow();
        document.getElementById('tpe-form-message').textContent = '';
        tpeModal.classList.remove('hidden');
        initTinyMCE(); 
    });
    document.getElementById('tpe-add-jadwal-btn').addEventListener('click', () => addJadwalMisaRow());
    document.getElementById('tpe-table-body').addEventListener('click', async (e) => {
        const target = e.target;
        const docId = target.closest('tr')?.dataset.id;
        if (!docId) return;
        if (target.classList.contains('delete-tpe')) {
            if (confirm(`Yakin ingin menghapus TPE untuk tanggal ${docId}?`)) {
                await db.collection('tata_perayaan_mingguan').doc(docId).delete();
            }
        }
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
                if (data.jadwal_misa && data.jadwal_misa.length > 0) {
                    data.jadwal_misa.forEach(item => addJadwalMisaRow(item));
                } else { addJadwalMisaRow(); }

                initTinyMCE();
                const tpeDetails = data.tata_perayaan || {};
                setTimeout(() => {
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
                
                document.getElementById('tpe-form-message').textContent = '';
                tpeModal.classList.remove('hidden');
            }
        }
    });
    document.getElementById('tpe-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = document.getElementById('tpe-form-message');
        const tanggalInput = document.getElementById('tpe-tanggal').value;
        if (!tanggalInput) { msg.textContent = 'Tanggal Misa wajib diisi!'; msg.className = 'form-message error'; return; }
        msg.textContent = 'Menyimpan...';
        const docId = tanggalInput;

        const jadwalMisa = Array.from(document.querySelectorAll('#tpe-jadwal-container .anggaran-item')).map(row => ({
            jam: row.querySelector('.jadwal-jam').value,
            tempat: row.querySelector('.jadwal-tempat').value,
            perayaan: row.querySelector('.jadwal-perayaan').value,
            pelayan: row.querySelector('.jadwal-pelayan').value,
        }));
        
        const displayDate = new Date(tanggalInput + 'T12:00:00Z').toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        const tpeData = {
            tanggal_display: displayDate,
            nama_perayaan: document.getElementById('tpe-nama-perayaan').value,
            tahun_liturgi: document.getElementById('tpe-tahun-liturgi').value,
            tema: document.getElementById('tpe-tema').value,
            jadwal_misa: jadwalMisa,
            tata_perayaan: {
                antifon_pembuka: tinymce.get('tpe-antifon-pembuka').getContent(),
                doa_kolekta: tinymce.get('tpe-doa-kolekta').getContent(),
                bacaan_1: tinymce.get('tpe-bacaan-1').getContent(),
                mazmur_tanggapan: tinymce.get('tpe-mazmur').getContent(),
                bacaan_2: tinymce.get('tpe-bacaan-2').getContent(),
                bait_pengantar_injil: tinymce.get('tpe-bait-injil').getContent(),
                bacaan_injil: tinymce.get('tpe-bacaan-injil').getContent(),
                doa_umat: tinymce.get('tpe-doa-umat').getContent(),
                doa_persembahan: tinymce.get('tpe-doa-persembahan').getContent(),
                antifon_komuni: tinymce.get('tpe-antifon-komuni').getContent(),
                doa_sesudah_komuni: tinymce.get('tpe-doa-sesudah-komuni').getContent(),
            }
        };

        try {
            await db.collection('tata_perayaan_mingguan').doc(docId).set(tpeData);
            msg.textContent = 'Berhasil disimpan!';
            msg.className = 'form-message success';
            setTimeout(() => {
                tpeModal.classList.add('hidden');
                tinymce.remove();
            }, 1500);
        } catch (error) {
            msg.textContent = 'Gagal menyimpan. Cek konsol untuk error.';
            msg.className = 'form-message error';
            console.error("Error saving TPE: ", error);
        }
    });

    logoutButton.addEventListener('click', () => auth.signOut().then(() => { window.location.href = 'index.html' }));
    printBtn.addEventListener('click', () => window.print());
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        const modal = document.getElementById(btn.dataset.target);
        if (modal) {
            btn.addEventListener('click', () => {
                modal.classList.add('hidden');
                if (btn.dataset.target === 'tpe-modal') {
                    tinymce.remove();
                }
            });
        }
    });
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.add('hidden');
                if (overlay.id === 'tpe-modal') {
                    tinymce.remove();
                }
            }
        });
    });

    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", { "particles": { "number": { "value": 80 }, "color": { "value": "#004a99" }, "shape": { "type": "circle" }, "opacity": { "value": 0.5, "anim": { "enable": false } }, "size": { "value": 3, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#004a99", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 6 } }, "interactivity": { "events": { "onhover": { "enable": true, "mode": "repulse" } } }, "retina_detect": true });
    }
});