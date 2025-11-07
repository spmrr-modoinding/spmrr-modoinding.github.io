/*
 * admin-dashboard.js (VERSI FIREBASE v9)
 * File skrip utama untuk fungsionalitas halaman admin.
 *
 * * PERUBAHAN (FULL FIX v3 - V2.0):
 * - (B11, B44) Migrasi penuh ke Firebase v9 SDK (modular).
 * - (B1, B7) Menonaktifkan initParticles().
 * - (B3) Menggabungkan setTableFeedback().
 * - (B6, B16) Menghapus uploadInitialStats().
 * - (B18) Menambahkan setupModalTabs() untuk modal TPE.
 * - (B19, A5) Menambahkan logika expand/collapse tabel program.
 * - (B21) Menambahkan fungsi exportStatsToCSV().
 * - (B23) Menambahkan fungsi filterProgramTable() dan listener-nya.
 */

// [PERUBAHAN] Impor Firebase v9 (Poin B11)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    getDoc, 
    getDocs, 
    onSnapshot, 
    query, 
    orderBy, 
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js"; // [PERUBAHAN] Impor config

document.addEventListener('DOMContentLoaded', () => {
    // =================================================================
    // 1. INISIALISASI GLOBAL
    // =================================================================
    
    // [PERUBAHAN] Inisialisasi Firebase v9
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    const auth = getAuth(app);
    
    let umatChart = null;
    let currentParishStats = []; 

    let currentEditProgramId = null;
    let currentEditAnnouncementId = null;
    let currentEditTpeId = null;
    let currentEditPrayerId = null; 

    const modals = {
        program: document.getElementById('program-modal'),
        announcement: document.getElementById('announcement-modal'),
        stat: document.getElementById('stat-modal'),
        tpe: document.getElementById('tpe-modal'),
        prayer: document.getElementById('prayer-modal'), 
    };
    
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
    
    // [PERUBAHAN] Sintaks v9
    onAuthStateChanged(auth, async (user) => {
        if (user) {
            try {
                // [PERUBAHAN] Sintaks v9
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                
                if (userDoc.exists() && userDoc.data().peran === 'admin') {
                    initializeDashboard(userDoc.data());
                } else {
                    alert('Anda tidak memiliki hak akses untuk halaman ini.');
                    signOut(auth);
                }
            } catch (error) {
                console.error("Error saat verifikasi peran:", error);
                alert("Terjadi kesalahan saat verifikasi pengguna.");
                signOut(auth);
            }
        } else {
            window.location.href = 'login.html';
        }
    });

    function initializeDashboard(userData) {
        document.getElementById('welcome-title').textContent = `PROGRAM KERJA: ${userData.nama_unit || 'PAROKI'}`;
        
        listenToPrograms();
        listenToAnnouncements();
        listenToTPEs();
        listenToPastors();
        listenToParishStats();
        listenToPrayers(); 
        
        updateSummaryDashboard();
        setupDropdowns();
        setupEventListeners();
    }

    // =================================================================
    // 3. FUNGSI-FUNGSI LISTENER DATA (REALTIME DARI FIREBASE)
    // =================================================================
    
    const listenToPrograms = () => {
        const programsTableBody = document.getElementById('programs-table-body');
        const tableFooter = document.getElementById('table-footer');
        setTableFeedback(programsTableBody, 18, 'loading', 'Memuat data program kerja...');
        tableFooter.innerHTML = '';

        // [PERUBAHAN] Sintaks v9
        const programsRef = collection(db, 'programs');
        const q = query(programsRef, orderBy('bidang'));
        
        onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                setTableFeedback(programsTableBody, 18, 'empty', 'Belum ada data program kerja.');
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
                html += `<tr class="group-header-bidang" data-bidang="${bidang}"><td colspan="18">${bidang}</td></tr>`;
                for (const subBidang in groupedData[bidang]) {
                    html += `<tr class="group-header-sub" data-bidang="${bidang}"><td colspan="18">${subBidang}</td></tr>`;
                    groupedData[bidang][subBidang].forEach(program => {
                        grandTotal += program.total_anggaran || 0;
                        const hasAnggaran = program.anggaran && program.anggaran.length > 0;
                        const rowCount = hasAnggaran ? program.anggaran.length : 1;
                        
                        html += `<tr data-id="${program.id}" class="program-row" data-bidang="${bidang}">
                            <td rowspan="${rowCount}">${program.pusat_paroki_stasi||'-'}</td>
                            <td rowspan="${rowCount}">${program.nama_unit||'-'}</td>
                            <td rowspan="${rowCount}">${program.nama_kegiatan||'-'}</td>
                            <td rowspan="${rowCount}">${program.sasaran||'-'}</td>
                            <td rowspan="${rowCount}">${program.indikator||'-'}</td>
                            <td rowspan="${rowCount}">${program.model_materi||'-'}</td>
                            <td rowspan="${rowCount}">${program.materi||'-'}</td>
                            <td rowspan="${rowCount}">${program.tempat_waktu||'-'}</td>
                            <td rowspan,"${rowCount}">${program.pic||'-'}</td>
                            <td class="budget-detail-col">${hasAnggaran?(program.anggaran[0].perincian||'-'):'-'}</td>
                            <td class="budget-detail-col">${hasAnggaran?(program.anggaran[0].volume||'-'):'-'}</td>
                            <td class="budget-detail-col">${hasAnggaran?(program.anggaran[0].satuan||'-'):'-'}</td>
                            <td class="budget-detail-col">${hasAnggaran?('Rp ' + (program.anggaran[0].harga_satuan||0).toLocaleString('id-ID')):'-'}</td>
                            <td class="budget-detail-col">${hasAnggaran?('Rp ' + (program.anggaran[0].jumlah||0).toLocaleString('id-ID')):'-'}</td>
                            <td rowspan="${rowCount}">${'Rp ' + (program.total_anggaran||0).toLocaleString('id-ID')}</td>
                            <td rowspan="${rowCount}">${program.sumber_dana_kas||'-'}</td>
                            <td rowspan="${rowCount}">${program.sumber_dana_swadaya||'-'}</td>
                            <td rowspan="${rowCount}" class="no-print">
                                <button class="action-btn-sm detail-toggle-btn">Detail <i class="bi bi-chevron-down"></i></button>
                                <button class="action-btn-sm edit edit-program">Edit</button>
                                <button class="action-btn-sm delete delete-program">Hapus</button>
                            </td>
                        </tr>`;
                        
                        if (hasAnggaran && program.anggaran.length > 1) {
                            for (let i = 1; i < program.anggaran.length; i++) {
                                const item = program.anggaran[i];
                                html += `<tr data-id="${program.id}" class="budget-detail-row" data-bidang="${bidang}">
                                    <td class="budget-detail-col">${item.perincian||'-'}</td>
                                    <td class="budget-detail-col">${item.volume||'-'}</td>
                                    <td class="budget-detail-col">${item.satuan||'-'}</td>
                                    <td class="budget-detail-col">${'Rp ' + (item.harga_satuan||0).toLocaleString('id-ID')}</td>
                                    <td class="budget-detail-col">${'Rp ' + (item.jumlah||0).toLocaleString('id-ID')}</td>
                                </tr>`;
                            }
                        }
                    });
                }
            }
            programsTableBody.innerHTML = html;
            tableFooter.innerHTML = `<tr><td colspan="12" style="text-align:right; font-weight:bold;">JUMLAH BUDGET</td><td style="font-weight:bold;">${'Rp ' + grandTotal.toLocaleString('id-ID')}</td><td colspan="2"></td><td class="no-print"></td></tr>`;
            filterProgramTable(); 
        }, (error) => {
            console.error("Error listening to programs:", error);
            setTableFeedback(programsTableBody, 18, 'error', `Gagal memuat data program kerja. (${error.message})`);
        });
    };
    
    const listenToAnnouncements = () => {
        const announcementsTableBody = document.getElementById('announcements-table-body');
        setTableFeedback(announcementsTableBody, 5, 'loading', 'Memuat data pengumuman...');
        
        // [PERUBAHAN] Sintaks v9
        const annRef = collection(db, 'announcements');
        const q = query(annRef, orderBy('createdAt', 'desc'));

        onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                setTableFeedback(announcementsTableBody, 5, 'empty', 'Belum ada pengumuman.');
                return;
            }
            const tableHTML = snapshot.docs.map(doc => {
                const ann = doc.data();
                const catatanPratinjau = ann.catatan ? ann.catatan.replace(/<[^>]+>/g, '').substring(0, 100) + '...' : '-';
                let tanggalDisplay = ann.tanggal || '';
                if (ann.tanggal) {
                     try {
                        const dateObj = new Date(ann.tanggal + 'T12:00:00'); 
                        tanggalDisplay = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
                    } catch (e) { tanggalDisplay = ann.tanggal; }
                }
                return `<tr data-id="${doc.id}">
                    <td>${ann.judul || '-'}</td>
                    <td>${tanggalDisplay}${ann.jam ? ' | ' + ann.jam : ''}</td>
                    <td>${ann.lokasi || '-'}</td>
                    <td>${catatanPratinjau}</td>
                    <td class="no-print">
                        <button class="action-btn-sm edit edit-announcement">Edit</button>
                        <button class="action-btn-sm delete delete-announcement">Hapus</button>
                    </td>
                </tr>`;
            }).join('');
            announcementsTableBody.innerHTML = tableHTML;
        }, (error) => {
            console.error("Error listening to announcements:", error);
            setTableFeedback(announcementsTableBody, 5, 'error', `Gagal memuat data pengumuman. (${error.message})`);
        });
    };
    
    const listenToTPEs = () => {
        const tpeTableBody = document.getElementById('tpe-table-body');
        setTableFeedback(tpeTableBody, 3, 'loading', 'Memuat data TPE...');
        
        // [PERUBAHAN] Sintaks v9
        const tpeRef = collection(db, 'tata_perayaan_mingguan');
        
        onSnapshot(tpeRef, (snapshot) => {
            if (snapshot.empty) {
                setTableFeedback(tpeTableBody, 3, 'empty', 'Belum ada data Tata Perayaan Ekaristi.');
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
        }, (error) => {
            console.error("Error saat memuat TPE:", error);
            setTableFeedback(tpeTableBody, 3, 'error', `Gagal memuat data TPE. (${error.message})`);
        });
    };

    const listenToPastors = () => {
        const pastorListContainer = document.getElementById('pastor-list-container');
        pastorListContainer.innerHTML = `<div class="feedback-container"><div class="spinner"></div><p>Memuat data pastor...</p></div>`;
        
        // [PERUBAHAN] Sintaks v9
        const pastorsRef = collection(db, 'pastors');
        const q = query(pastorsRef, orderBy('order'));

        onSnapshot(q, (snapshot) => {
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
        }, (error) => {
            pastorListContainer.innerHTML = `<div class="error-alert"><strong>Gagal:</strong> Gagal memuat data pastor. (${error.message})</div>`;
        });
    };
    
    const listenToParishStats = () => {
        const statsTableBody = document.getElementById('stats-table-body');
        const statsTableFooter = document.getElementById('stats-table-footer');
        setTableFeedback(statsTableBody, 7, 'loading', 'Memuat data statistik...');
        statsTableFooter.innerHTML = '';

        // [PERUBAHAN] Sintaks v9
        const statsRef = collection(db, 'parish_stats');
        const q = query(statsRef, orderBy('order'));

        onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                setTableFeedback(statsTableBody, 7, 'empty', 'Data statistik umat belum ada.');
                currentParishStats = [];
                return;
            }
            
            // Simpan data ke cache global untuk Ekspor
            currentParishStats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            let totalKK = 0, totalLaki = 0, totalPerempuan = 0;
            statsTableBody.innerHTML = currentParishStats.map(stat => {
                const jumlahJiwa = (stat.laki_laki || 0) + (stat.perempuan || 0);
                totalKK += stat.kk || 0;
                totalLaki += stat.laki_laki || 0;
                totalPerempuan += stat.perempuan || 0;
                return `<tr data-id="${stat.id}">
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

            const labels = currentParishStats.map(stat => stat.name);
            const data = currentParishStats.map(stat => (stat.laki_laki || 0) + (stat.perempuan || 0));
            const ctx = document.getElementById('umat-chart').getContext('2d');
            if (umatChart) { umatChart.destroy(); }
            umatChart = new Chart(ctx, { type: 'bar', data: { labels: labels, datasets: [{ label: 'Jumlah Jiwa per Wilayah/Stasi', data: data, backgroundColor: 'rgba(0, 74, 153, 0.7)', borderColor: 'rgba(0, 74, 153, 1)', borderWidth: 1 }] }, options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false }, title: { display: true, text: 'Visualisasi Jumlah Umat per Wilayah/Stasi' } } } });
        }, (error) => setTableFeedback(statsTableBody, 7, 'error', `Gagal memuat data statistik. (${error.message})`));
    };

    const listenToPrayers = () => {
        const prayersTableBody = document.getElementById('prayers-table-body');
        setTableFeedback(prayersTableBody, 3, 'loading', 'Memuat data doa...');
        
        // [PERUBAHAN] Sintaks v9
        const prayersRef = collection(db, 'prayers');
        const q = query(prayersRef, orderBy('order'));

        onSnapshot(q, (snapshot) => {
            if (snapshot.empty) {
                setTableFeedback(prayersTableBody, 3, 'empty', 'Belum ada data doa. Silakan tambahkan doa baru.');
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
        }, (error) => {
            console.error("Error saat memuat data doa:", error);
            setTableFeedback(prayersTableBody, 3, 'error', `Gagal memuat data doa. (${error.message})`);
        });
    };

    // =================================================================
    // 4. FUNGSI PEMBARUAN DASHBOARD
    // =================================================================
    const updateSummaryDashboard = async () => {
        try {
            // [PERUBAHAN] Sintaks v9
            const programsSnap = await getDocs(collection(db, 'programs'));
            const announcementsSnap = await getDocs(collection(db, 'announcements'));
            const statsSnap = await getDocs(collection(db, 'parish_stats'));

            let totalBudget = 0;
            programsSnap.forEach(doc => { totalBudget += doc.data().total_anggaran || 0; });
            document.getElementById('summary-programs-count').textContent = programsSnap.size;
            document.getElementById('summary-budget-total').textContent = `Rp ${totalBudget.toLocaleString('id-ID')}`;

            document.getElementById('summary-announcements-count').textContent = announcementsSnap.size;

            let totalUmat = 0;
            statsSnap.forEach(doc => { totalUmat += (doc.data().laki_laki || 0) + (doc.data().perempuan || 0); });
            document.getElementById('summary-umat-total').textContent = totalUmat.toLocaleString('id-ID');
        } catch (error) {
            console.error("Gagal memuat data ringkasan:", error);
            document.getElementById('summary-programs-count').textContent = 'Error';
            document.getElementById('summary-budget-total').textContent = 'Error';
            document.getElementById('summary-announcements-count').textContent = 'Error';
            document.getElementById('summary-umat-total').textContent = 'Error';
        }
    };

    // =================================================================
    // 5. FUNGSI BANTU (HELPERS) UNTUK FORM & UI
    // =================================================================
    const setTableFeedback = (tbody, colSpan, type, message) => {
        let html = '';
        switch (type) {
            case 'loading':
                html = `<tr><td colspan="${colSpan}"><div class="feedback-container"><div class="spinner"></div><p>${message}</p></div></td></tr>`;
                break;
            case 'error':
                html = `<tr><td colspan="${colSpan}"><div class="error-alert"><strong>Gagal:</strong> ${message}</div></td></tr>`;
                break;
            case 'empty':
                html = `<tr><td colspan="${colSpan}" style="text-align:center; padding: 2rem;">${message}</td></tr>`;
                break;
        }
        if (tbody) {
            tbody.innerHTML = html;
        }
    };

    function initTinyMCE() {
        tinymce.remove('.tinymce-editor');
        tinymce.init({
            selector: '.tinymce-editor',
            plugins: 'autolink lists link wordcount image',
            toolbar: 'undo redo | blocks | bold italic underline | bullist numlist | link image | removeformat',
            menubar: false,
            height: 250,
            valid_elements: '*[*]',
            valid_children: '+body[style]',
            invalid_elements: 'script,applet,iframe,object,embed',
            invalid_attributes: 'onerror,onload,onclick,onmouseover,onmouseout,onfocus,onblur'
        });
    }

    function setupDropdowns() {
        const modalBidang = document.getElementById('modal-bidang');
        const modalSubBidang = document.getElementById('modal-sub-bidang');
        const filterBidang = document.getElementById('program-bidang-filter');
        
        modalBidang.innerHTML = '<option value="" disabled selected>Pilih Bidang...</option>';
        filterBidang.innerHTML = '<option value="semua">Tampilkan Semua Bidang</option>'; 
        
        Object.keys(programStruktur).forEach(bidang => {
            const option = document.createElement('option');
            option.value = bidang;
            option.textContent = bidang;
            modalBidang.appendChild(option);
            
            const filterOption = document.createElement('option');
            filterOption.value = bidang;
            filterOption.textContent = bidang;
            filterBidang.appendChild(filterOption);
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
    
    function setupModalTabs() {
        document.querySelectorAll('.modal-tab-nav').forEach(nav => {
            nav.addEventListener('click', (e) => {
                if (e.target.classList.contains('modal-tab-btn')) {
                    const targetId = e.target.dataset.target;
                    const modalBody = e.target.closest('.modal-body');

                    nav.querySelectorAll('.modal-tab-btn').forEach(btn => btn.classList.remove('active'));
                    e.target.classList.add('active');

                    modalBody.querySelectorAll('.modal-tab-panel').forEach(panel => panel.classList.remove('active'));
                    document.getElementById(targetId).classList.add('active');
                }
            });
        });
    }

    function filterProgramTable() {
        const filterValue = document.getElementById('program-bidang-filter').value;
        const rows = document.getElementById('programs-table-body').querySelectorAll('tr');

        rows.forEach(row => {
            if (filterValue === 'semua') {
                row.style.display = '';
            } else {
                if (row.dataset.bidang === filterValue) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            }
        });
    }

    function exportStatsToCSV() {
        if (currentParishStats.length === 0) {
            alert('Data statistik kosong, tidak ada yang bisa diekspor.');
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += '"No","Nama Wilayah / Stasi","KK","Laki-laki","Perempuan","Jumlah Jiwa"\r\n';

        let totalKK = 0, totalLaki = 0, totalPerempuan = 0, totalJiwa = 0;

        currentParishStats.forEach(stat => {
            const jumlahJiwa = (stat.laki_laki || 0) + (stat.perempuan || 0);
            totalKK += stat.kk || 0;
            totalLaki += stat.laki_laki || 0;
            totalPerempuan += stat.perempuan || 0;
            totalJiwa += jumlahJiwa;

            const row = [
                stat.order,
                `"${stat.name}"`,
                stat.kk || 0,
                stat.laki_laki || 0,
                stat.perempuan || 0,
                jumlahJiwa
            ].join(",");
            csvContent += row + "\r\n";
        });

        const totalRow = [
            '"TOTAL"',
            `""`,
            totalKK,
            totalLaki,
            totalPerempuan,
            totalJiwa
        ].join(",");
        csvContent += totalRow + "\r\n";

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "statistik_umat_paroki_modoinding.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }


    // =================================================================
    // 6. INISIALISASI & EVENT LISTENERS
    // =================================================================
    function setupEventListeners() {
        
        setupModalTabs(); 

        document.querySelectorAll('.nav-tab-btn').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.nav-tab-btn').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.management-section').forEach(s => s.classList.remove('active'));
                tab.classList.add('active');
                document.getElementById(tab.dataset.target).classList.add('active');
            });
        });

        // [PERUBAHAN] Sintaks v9
        document.getElementById('logout-button').addEventListener('click', () => signOut(auth));
        
        document.getElementById('print-btn').addEventListener('click', () => window.print());
        document.getElementById('q-add-program-btn').addEventListener('click', () => document.getElementById('add-program-btn').click());
        document.getElementById('q-add-announcement-btn').addEventListener('click', () => document.getElementById('add-announcement-btn').click());

        document.getElementById('export-stats-btn').addEventListener('click', exportStatsToCSV);
        document.getElementById('program-bidang-filter').addEventListener('change', filterProgramTable);


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
            
            const detailButton = target.closest('.detail-toggle-btn');
            if (detailButton) {
                e.preventDefault();
                const programRow = target.closest('.program-row');
                const isExpanded = programRow.classList.toggle('is-expanded');
                detailButton.innerHTML = isExpanded ? 'Tutup <i class="bi bi-chevron-up"></i>' : 'Detail <i class="bi bi-chevron-down"></i>';
                return; 
            }
            
            if (!row) return;
            const docId = row.dataset.id;
            
            if (target.classList.contains('delete-program')) { 
                if (confirm(`Yakin hapus program ini?`)) { 
                    // [PERUBAHAN] Sintaks v9
                    await deleteDoc(doc(db, 'programs', docId)); 
                } 
            }
            
            if (target.classList.contains('edit-program')) {
                // [PERUBAHAN] Sintaks v9
                const docRef = doc(db, 'programs', docId);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const program = docSnap.data();
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
            const submitBtn = e.target.querySelector('button[type="submit"]');
            msg.textContent = 'Menyimpan...';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Menyimpan...';

            const rincianAnggaran = [];
            document.getElementById('modal-anggaran-items-container').querySelectorAll('.anggaran-item').forEach(item => {
                const perincian = item.querySelector('.anggaran-perincian').value;
                if (perincian) { rincianAnggaran.push({ perincian: perincian, volume: Number(item.querySelector('.anggaran-vol').value) || 0, satuan: item.querySelector('.anggaran-satuan').value, harga_satuan: Number(item.querySelector('.anggaran-harga').value) || 0, jumlah: (Number(item.querySelector('.anggaran-vol').value) || 0) * (Number(item.querySelector('.anggaran-harga').value) || 0) }); }
            });
            const programData = { bidang: document.getElementById('modal-bidang').value, sub_bidang_title: document.getElementById('modal-sub-bidang').value, pusat_paroki_stasi: document.getElementById('modal-lokasi').value, nama_unit: document.getElementById('modal-nama-unit').value, nama_kegiatan: document.getElementById('modal-nama_kegiatan').value, sasaran: document.getElementById('modal-sasaran').value, indikator: document.getElementById('modal-indikator').value, model_materi: document.getElementById('modal-model').value, materi: document.getElementById('modal-materi').value, tempat_waktu: document.getElementById('modal-waktu').value, pic: document.getElementById('modal-pic').value, sumber_dana_kas: document.getElementById('modal-sumber-dana-kas').value, sumber_dana_swadaya: document.getElementById('modal-sumber-dana-swadaya').value, anggaran: rincianAnggaran, total_anggaran: parseFloat(document.getElementById('modal-total-anggaran-display').textContent.replace(/[^0-9]/g, '')), };
            
            try {
                // [PERUBAHAN] Sintaks v9
                if (currentEditProgramId) { 
                    const docRef = doc(db, 'programs', currentEditProgramId);
                    await updateDoc(docRef, programData); 
                } else { 
                    programData.createdAt = serverTimestamp(); // [PERUBAHAN] v9 serverTimestamp
                    await addDoc(collection(db, 'programs'), programData); 
                }
                msg.textContent = 'Berhasil!'; msg.className = 'form-message success';
                setTimeout(() => {
                    modals.program.classList.add('hidden');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Simpan Program';
                }, 1500);
            } catch (error) { 
                msg.textContent = 'Gagal menyimpan.'; msg.className = 'form-message error'; 
                submitBtn.disabled = false;
                submitBtn.textContent = 'Simpan Program';
            }
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
                // [PERUBAHAN] Sintaks v9
                const docRef = doc(db, 'announcements', docId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const ann = docSnap.data();
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
            if (target.classList.contains('delete-announcement')) { 
                if (confirm('Yakin hapus pengumuman ini?')) { 
                    // [PERUBAHAN] Sintaks v9
                    await deleteDoc(doc(db, 'announcements', docId)); 
                } 
            }
        });

        document.getElementById('announcement-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const msg = document.getElementById('announcement-form-message');
            const submitBtn = e.target.querySelector('button[type="submit"]');
            msg.textContent = 'Menyimpan...';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Menyimpan...';
            
            const data = {
                judul: document.getElementById('ann-judul').value,
                tanggal: document.getElementById('ann-tanggal').value,
                jam: document.getElementById('ann-jam').value,
                lokasi: document.getElementById('ann-lokasi').value,
                catatan: tinymce.get('ann-catatan') ? tinymce.get('ann-catatan').getContent() : document.getElementById('ann-catatan').value,
            };
            try {
                // [PERUBAHAN] Sintaks v9
                if (currentEditAnnouncementId) {
                    const docRef = doc(db, 'announcements', currentEditAnnouncementId);
                    await updateDoc(docRef, data);
                } else {
                    data.createdAt = serverTimestamp(); // [PERUBAHAN] v9 serverTimestamp
                    await addDoc(collection(db, 'announcements'), data);
                }
                msg.textContent = 'Berhasil!'; msg.className = 'form-message success';
                setTimeout(() => {
                    modals.announcement.classList.add('hidden');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Simpan';
                }, 1000);
            } catch (error) {
                msg.textContent = 'Gagal menyimpan.'; msg.className = 'form-message error';
                submitBtn.disabled = false;
                submitBtn.textContent = 'Simpan';
            }
        });

        document.getElementById('add-tpe-btn').addEventListener('click', () => {
            currentEditTpeId = null;
            document.getElementById('tpe-modal-title').textContent = 'Tambah TPE Baru';
            document.getElementById('tpe-form').reset();
            document.getElementById('tpe-jadwal-container').innerHTML = '';
            addJadwalMisaRow();
            document.getElementById('tpe-form-message').textContent = '';
            
            document.querySelectorAll('#tpe-modal .modal-tab-btn').forEach((btn, index) => {
                btn.classList.toggle('active', index === 0);
            });
            document.querySelectorAll('#tpe-modal .modal-tab-panel').forEach((panel, index) => {
                panel.classList.toggle('active', index === 0);
            });

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
            
            if (target.classList.contains('delete-tpe')) { 
                if (confirm(`Yakin ingin menghapus TPE untuk tanggal ${docId}?`)) { 
                    // [PERUBAHAN] Sintaks v9
                    await deleteDoc(doc(db, 'tata_perayaan_mingguan', docId)); 
                } 
            }
            
            if (target.classList.contains('edit-tpe')) {
                // [PERUBAHAN] Sintaks v9
                const docRef = doc(db, 'tata_perayaan_mingguan', docId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    currentEditTpeId = doc.id;
                    document.getElementById('tpe-modal-title').textContent = 'Edit TPE';
                    document.getElementById('tpe-form').reset();
                    
                    document.querySelectorAll('#tpe-modal .modal-tab-btn').forEach((btn, index) => {
                        btn.classList.toggle('active', index === 0);
                    });
                    document.querySelectorAll('#tpe-modal .modal-tab-panel').forEach((panel, index) => {
                        panel.classList.toggle('active', index === 0);
                    });
                    
                    document.getElementById('tpe-tanggal').value = docId; // ID dokumen adalah tanggal
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
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const tanggalInput = document.getElementById('tpe-tanggal').value;
            
            if (!tanggalInput) { 
                msg.textContent = 'Tanggal Misa wajib diisi!'; 
                msg.className = 'form-message error'; 
                document.querySelector('.modal-tab-btn[data-target="tpe-tab-1"]').click();
                return; 
            }
            
            msg.textContent = 'Menyimpan...';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Menyimpan...';

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
                // [PERUBAHAN] Sintaks v9 (setDoc)
                const docRef = doc(db, 'tata_perayaan_mingguan', docId);
                await setDoc(docRef, tpeData, { merge: true }); // setDoc menggantikan set + merge
                
                msg.textContent = 'Berhasil disimpan!'; msg.className = 'form-message success';
                setTimeout(() => { 
                    modals.tpe.classList.add('hidden'); 
                    tinymce.remove(); 
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Simpan TPE';
                }, 1500);
            } catch (error) {
                msg.textContent = 'Gagal menyimpan.'; msg.className = 'form-message error';
                console.error("Error saving TPE: ", error);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Simpan TPE';
            }
        });

        document.getElementById('pastor-list-container').addEventListener('change', async (e) => {
            if (e.target.classList.contains('pastor-status-select')) {
                const pastorId = e.target.dataset.id;
                const newStatus = e.target.value;
                const feedbackEl = document.getElementById(`feedback-${pastorId}`);
                if (feedbackEl) feedbackEl.textContent = 'Menyimpan...';
                try {
                    // [PERUBAHAN] Sintaks v9
                    const docRef = doc(db, 'pastors', pastorId);
                    await updateDoc(docRef, { status: newStatus });
                    
                    if (feedbackEl) { feedbackEl.textContent = 'Diperbarui!'; setTimeout(() => { feedbackEl.textContent = ''; }, 2000); }
                } catch (error) { if (feedbackEl) feedbackEl.textContent = 'Gagal!'; }
            }
        });

        document.getElementById('stats-table-body').addEventListener('click', async (e) => {
            if (e.target.classList.contains('edit-stat')) {
                const docId = e.target.closest('tr').dataset.id;
                
                // [PERUBAHAN] Sintaks v9
                const docRef = doc(db, 'parish_stats', docId);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const stat = docSnap.data();
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
            const submitBtn = e.target.querySelector('button[type="submit"]');
            
            const data = { kk: parseInt(document.getElementById('stat-kk').value, 10), laki_laki: parseInt(document.getElementById('stat-laki').value, 10), perempuan: parseInt(document.getElementById('stat-perempuan').value, 10) };
            msg.textContent = 'Menyimpan...';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Menyimpan...';

            try {
                // [PERUBAHAN] Sintaks v9
                const docRef = doc(db, 'parish_stats', docId);
                await updateDoc(docRef, data);
                
                msg.textContent = 'Berhasil!'; msg.className = 'form-message success';
                setTimeout(() => {
                    modals.stat.classList.add('hidden');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Simpan Perubahan';
                }, 1000);
            } catch (error) { 
                msg.textContent = 'Gagal menyimpan.'; msg.className = 'form-message error'; 
                submitBtn.disabled = false;
                submitBtn.textContent = 'Simpan Perubahan';
            }
        });

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
                    // [PERUBAHAN] Sintaks v9
                    await deleteDoc(doc(db, 'prayers', docId));
                }
            }

            if (target.classList.contains('edit-prayer')) {
                // [PERUBAHAN] Sintaks v9
                const docRef = doc(db, 'prayers', docId);
                const docSnap = await getDoc(docRef);
                
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    currentEditPrayerId = docId;
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
            const submitBtn = e.target.querySelector('button[type="submit"]');
            msg.textContent = 'Menyimpan...';
            submitBtn.disabled = true;
            submitBtn.textContent = 'Menyimpan...';

            const prayerData = {
                title: document.getElementById('prayer-title').value,
                order: parseInt(document.getElementById('prayer-order').value, 10),
                content_indonesia: tinymce.get('prayer-content-indonesia').getContent(),
                content_latin: tinymce.get('prayer-content-latin').getContent(),
            };

            try {
                // [PERUBAHAN] Sintaks v9
                if (currentEditPrayerId) {
                    const docRef = doc(db, 'prayers', currentEditPrayerId);
                    await updateDoc(docRef, prayerData);
                } else {
                    await addDoc(collection(db, 'prayers'), prayerData);
                }
                msg.textContent = 'Berhasil disimpan!';
                msg.className = 'form-message success';
                setTimeout(() => {
                    modals.prayer.classList.add('hidden');
                    tinymce.remove();
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Simpan Doa';
                }, 1500);
            } catch (error) {
                msg.textContent = 'Gagal menyimpan.';
                msg.className = 'form-message error';
                console.error("Error saving prayer: ", error);
                submitBtn.disabled = false;
                submitBtn.textContent = 'Simpan Doa';
            }
        });

        // Event listener universal untuk menutup modal
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

});