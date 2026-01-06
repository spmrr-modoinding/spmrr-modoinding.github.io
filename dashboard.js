document.addEventListener('DOMContentLoaded', () => {
    // Konfigurasi Firebase sudah ada di firebase-config.js
    const db = firebase.firestore();
    const auth = firebase.auth();
    let umatChart = null;
    let currentEditAnnouncementId = null;
    let currentEditTpeId = null;

    // FUNGSI INISIALISASI EDITOR (VERSI STABIL)
    function initTinyMCE() {
        tinymce.remove('.tinymce-editor'); // Membersihkan editor lama sebelum membuat yang baru

        tinymce.init({
            selector: '.tinymce-editor', // Menggunakan CLASS sebagai target
            plugins: 'autolink lists link wordcount',
            toolbar: 'undo redo | blocks | bold italic underline | bullist numlist | link removeformat',
            menubar: false,
            height: 250
        });
    }

    const logoutButton = document.getElementById('logout-button');
    const announcementModal = document.getElementById('announcement-modal');
    const statModal = document.getElementById('stat-modal');
    const tpeModal = document.getElementById('tpe-modal');

    // Tab Navigation Logic
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

    // Helper Functions untuk Tabel
    const showTableLoading = (tableBody, colCount) => { tableBody.innerHTML = `<tr><td colspan="${colCount}"><div class="feedback-container"><div class="spinner"></div><p>Memuat data...</p></div></td></tr>`; };
    const showTableError = (tableBody, colCount, message) => { tableBody.innerHTML = `<tr><td colspan="${colCount}"><div class="error-alert"><strong>Gagal:</strong> ${message}</div></td></tr>`; };
    const showTableEmpty = (tableBody, colCount, message) => { tableBody.innerHTML = `<tr><td colspan="${colCount}" style="text-align:center; padding: 2rem;">${message}</td></tr>`; };

    // Auth State Observer
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists && userDoc.data().peran === 'admin') {
                    // Hanya memuat fungsi yang relevan setelah penghapusan
                    listenToAnnouncements();
                    listenToTPEs();
                    listenToParishStats();
                    updateSummaryDashboard();
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

    // Update Dashboard Ringkasan (Disesuaikan tanpa Program Kerja)
    const updateSummaryDashboard = async () => {
        try {
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
    // MANAJEMEN PENGUMUMAN
    // =================================================================
    const listenToAnnouncements = () => {
        const announcementsTableBody = document.getElementById('announcements-table-body');
        showTableLoading(announcementsTableBody, 5);
        db.collection('announcements').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
            if (snapshot.empty) { showTableEmpty(announcementsTableBody, 5, 'Belum ada pengumuman.'); return; }
            announcementsTableBody.innerHTML = snapshot.docs.map(doc => { const ann = doc.data(); return `<tr data-id="${doc.id}"><td>${ann.judul||'-'}</td><td>${ann.tanggal||''}${ann.jam ? ' | '+ann.jam : ''}</td><td>${ann.lokasi||'-'}</td><td>${(ann.catatan || '-').replace(/\n/g, '<br>')}</td><td class="no-print"><button class="action-btn-sm edit edit-announcement">Edit</button><button class="action-btn-sm delete delete-announcement">Hapus</button></td></tr>`; }).join('');
        }, error => showTableError(announcementsTableBody, 5, `Gagal memuat data pengumuman. (${error.message})`));
    };

    document.getElementById('q-add-announcement-btn').addEventListener('click', () => document.getElementById('add-announcement-btn').click());
    document.getElementById('add-announcement-btn').addEventListener('click', () => { 
        currentEditAnnouncementId = null; 
        document.getElementById('announcement-modal-title').textContent = 'Tambah Pengumuman Baru'; 
        document.getElementById('announcement-form').reset(); 
        document.getElementById('announcement-form-message').textContent = ''; 
        announcementModal.classList.remove('hidden'); 
        initTinyMCE(); // Inisialisasi editor untuk modal pengumuman
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
                
                // Set konten editor jika ada, atau textarea biasa
                const editor = tinymce.get('ann-catatan');
                if(editor) editor.setContent(ann.catatan || '');
                else document.getElementById('ann-catatan').value = ann.catatan || '';

                document.getElementById('announcement-form-message').textContent = ''; 
                announcementModal.classList.remove('hidden'); 
                initTinyMCE();
            }
        }
        if (target.classList.contains('delete-announcement')) { if (confirm('Yakin hapus pengumuman ini?')) { await db.collection('announcements').doc(docId).delete(); } }
    });

    document.getElementById('announcement-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = document.getElementById('announcement-form-message');
        msg.textContent = 'Menyimpan...';
        
        // Ambil data dari TinyMCE
        const editor = tinymce.get('ann-catatan');
        const catatanContent = editor ? editor.getContent() : document.getElementById('ann-catatan').value;

        const data = { judul: document.getElementById('ann-judul').value, tanggal: document.getElementById('ann-tanggal').value, jam: document.getElementById('ann-jam').value, lokasi: document.getElementById('ann-lokasi').value, catatan: catatanContent, };
        try { 
            if (currentEditAnnouncementId) { await db.collection('announcements').doc(currentEditAnnouncementId).update(data); } else { data.createdAt = firebase.firestore.FieldValue.serverTimestamp(); await db.collection('announcements').add(data); } 
            msg.textContent = 'Berhasil!'; msg.className = 'form-message success'; 
            setTimeout(() => {
                announcementModal.classList.add('hidden');
                tinymce.remove('#ann-catatan');
            }, 1000); 
        } catch (error) { msg.textContent = 'Gagal menyimpan.'; msg.className = 'form-message error'; }
    });

    // =================================================================
    // MANAJEMEN STATISTIK UMAT
    // =================================================================
    const listenToParishStats = () => {
        const statsTableBody = document.getElementById('stats-table-body');
        const statsTableFooter = document.getElementById('stats-table-footer');
        showTableLoading(statsTableBody, 7);
        statsTableFooter.innerHTML = '';
        db.collection('parish_stats').orderBy('order').onSnapshot(snapshot => {
            if (snapshot.empty) {
                // Tombol upload initial stats tetap dipertahankan jika database kosong
                statsTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem;"><p>Data statistik umat belum ada.</p><button id="upload-initial-stats-btn" class="action-btn" style="background-color: #28a745; border-color: #28a745; color: white;"><i class="bi bi-upload"></i> Unggah Data Statistik Awal</button><div id="upload-feedback" style="margin-top: 1rem; font-style: italic;"></div></td></tr>`;
                const btnUpload = document.getElementById('upload-initial-stats-btn');
                if(btnUpload) btnUpload.addEventListener('click', uploadInitialStats);
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

    async function uploadInitialStats() {
        const uploadBtn = document.getElementById('upload-initial-stats-btn');
        const feedbackEl = document.getElementById('upload-feedback');
        if (!confirm('Apakah Anda yakin ingin mengunggah 28 data statistik awal? Tindakan ini hanya boleh dilakukan satu kali.')) return;
        uploadBtn.disabled = true;
        feedbackEl.textContent = 'Memulai proses unggah...';
        const parishStatsData = [ { order: 1, name: 'St. Fransiskus Asisi Sinisir', kk: 23, laki_laki: 41, perempuan: 30 }, { order: 2, name: 'St. Dominikus Sinisir', kk: 22, laki_laki: 28, perempuan: 31 }, { order: 3, name: 'St. Ignatius Sinisir', kk: 20, laki_laki: 24, perempuan: 25 }, { order: 4, name: 'Sta. Skolastika Sinisir', kk: 26, laki_laki: 39, perempuan: 32 }, { order: 5, name: 'St. Vincensius Sinisir', kk: 20, laki_laki: 28, perempuan: 28 }, { order: 6, name: 'St. Stefanus Sinisir', kk: 21, laki_laki: 23, perempuan: 28 }, { order: 7, name: 'Sta. Ursula Sinisir', kk: 19, laki_laki: 26, perempuan: 34 }, { order: 8, name: 'Sta. Maria Bunda Karmel Sinisir', kk: 21, laki_laki: 29, perempuan: 34 }, { order: 9, name: 'St. Romualdus Sinisir', kk: 21, laki_laki: 33, perempuan: 35 }, { order: 10, name: 'Sta. Faustina Sinisir', kk: 19, laki_laki: 30, perempuan: 26 }, { order: 11, name: 'Sta. Theresia Sinisir', kk: 22, laki_laki: 38, perempuan: 28 }, { order: 12, name: 'St. Mikael Sinisir', kk: 13, laki_laki: 16, perempuan: 17 }, { order: 13, name: 'Antonius Maria Claret Makaaroyen', kk: 20, laki_laki: 30, perempuan: 28 }, { order: 14, name: 'St. Alfonsus Maria de Liquori Makaaroyen', kk: 19, laki_laki: 23, perempuan: 29 }, { order: 15, name: 'Sta. Angela Merici Tambelang', kk: 21, laki_laki: 35, perempuan: 28 }, { order: 16, name: 'St. Aloysius Gonzaga Tambelang', kk: 22, laki_laki: 46, perempuan: 34 }, { order: 17, name: 'Sta. Katarina siena Tambelang', kk: 20, laki_laki: 26, perempuan: 31 }, { order: 18, name: 'St. Robertus Belarminus Tambelang', kk: 20, laki_laki: 33, perempuan: 26 }, { order: 19, name: 'St. Yohanes Krisostomus Tambelang', kk: 15, laki_laki: 19, perempuan: 27 }, { order: 20, name: 'St. Fransiskus D sales Tambelang', kk: 19, laki_laki: 34, perempuan: 33 }, { order: 21, name: 'St. Pius X Tambelang', kk: 20, laki_laki: 43, perempuan: 32 }, { order: 22, name: 'St. Hironimus Kinamang', kk: 22, laki_laki: 38, perempuan: 32 }, { order: 23, name: 'St. Lukas Kinamang', kk: 24, laki_laki: 32, perempuan: 45 }, { order: 24, name: 'Sta. Agata Kinamang', kk: 23, laki_laki: 36, perempuan: 30 }, { order: 25, name: 'Sta. Rita de cascia Kinamang', kk: 23, laki_laki: 36, perempuan: 30 }, { order: 26, name: 'St. Laurensius Kinamang', kk: 21, laki_laki: 28, perempuan: 27 }, { order: 27, name: 'Stasi Christus Rex Liningaan', kk: 22, laki_laki: 34, perempuan: 32 }, { order: 28, name: 'Stasi Hati Kudus Yesus Mobuya', kk: 11, laki_laki: 19, perempuan: 16 } ];
        try { const batch = db.batch(); parishStatsData.forEach(stat => { const docRef = db.collection('parish_stats').doc(); batch.set(docRef, stat); }); await batch.commit(); feedbackEl.textContent = 'BERHASIL!'; feedbackEl.style.color = 'green'; } catch (error) { console.error('Gagal:', error); feedbackEl.textContent = `GAGAL! ${error.message}`; feedbackEl.style.color = 'red'; uploadBtn.disabled = false; }
    };

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

    // =================================================================
    // MANAJEMEN TPE (TATA PERAYAAN EKARISTI)
    // =================================================================
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

    function addJadwalMisaRow(item = {}) {
        const container = document.getElementById('tpe-jadwal-container');
        const div = document.createElement('div');
        div.classList.add('anggaran-item'); // Menggunakan class anggaran-item agar style sama
        div.innerHTML = `
            <input type="text" placeholder="Jam (07.00)" class="jadwal-jam" value="${item.jam || ''}" style="grid-column: span 1;">
            <input type="text" placeholder="Tempat (Sinisir)" class="jadwal-tempat" value="${item.tempat || ''}" style="grid-column: span 2;">
            <input type="text" placeholder="Perayaan (Misa/Ibadat)" class="jadwal-perayaan" value="${item.perayaan || 'Misa'}" style="grid-column: span 2;">
            <input type="text" placeholder="Pelayan (A. Pondaag)" class="jadwal-pelayan" value="${item.pelayan || ''}" style="grid-column: span 2;">
            <button type="button" class="remove-btn" style="grid-column: span 1;">&times;</button>
        `;
        container.appendChild(div);
    }

    document.getElementById('tpe-jadwal-container').addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) e.target.parentElement.remove();
    });

    document.getElementById('q-add-tpe-btn').addEventListener('click', () => document.getElementById('add-tpe-btn').click());
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
                const tpeForm = document.getElementById('tpe-form');
                tpeForm.reset();

                document.getElementById('tpe-tanggal').value = doc.id;
                document.getElementById('tpe-nama-perayaan').value = data.nama_perayaan || '';
                document.getElementById('tpe-tahun-liturgi').value = data.tahun_liturgi || '';
                document.getElementById('tpe-tema').value = data.tema || '';

                const tpeDetails = data.tata_perayaan || {};
                document.getElementById('tpe-antifon-pembuka').value = tpeDetails.antifon_pembuka || '';
                document.getElementById('tpe-doa-kolekta').value = tpeDetails.doa_kolekta || '';
                document.getElementById('tpe-bacaan-1').value = tpeDetails.bacaan_1 || '';
                document.getElementById('tpe-mazmur').value = tpeDetails.mazmur_tanggapan || '';
                document.getElementById('tpe-bacaan-2').value = tpeDetails.bacaan_2 || '';
                document.getElementById('tpe-bait-injil').value = tpeDetails.bait_pengantar_injil || '';
                document.getElementById('tpe-bacaan-injil').value = tpeDetails.bacaan_injil || '';
                document.getElementById('tpe-doa-umat').value = tpeDetails.doa_umat || '';
                document.getElementById('tpe-doa-persembahan').value = tpeDetails.doa_persembahan || '';
                document.getElementById('tpe-antifon-komuni').value = tpeDetails.antifon_komuni || '';
                document.getElementById('tpe-doa-sesudah-komuni').value = tpeDetails.doa_sesudah_komuni || '';
                
                const jadwalContainer = document.getElementById('tpe-jadwal-container');
                jadwalContainer.innerHTML = '';
                if (data.jadwal_misa && data.jadwal_misa.length > 0) {
                    data.jadwal_misa.forEach(item => addJadwalMisaRow(item));
                } else {
                    addJadwalMisaRow();
                }

                tpeModal.classList.remove('hidden');
                initTinyMCE();
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
        const editorIds = [
            'tpe-antifon-pembuka', 'tpe-doa-kolekta', 'tpe-bacaan-1', 'tpe-mazmur', 
            'tpe-bacaan-2', 'tpe-bait-injil', 'tpe-bacaan-injil', 'tpe-doa-umat', 
            'tpe-doa-persembahan', 'tpe-antifon-komuni', 'tpe-doa-sesudah-komuni', 'tpe-renungan'
        ];
        
        const keyMapping = {
            'tpe-mazmur': 'mazmur_tanggapan',
            'tpe-bait-injil': 'bait_pengantar_injil'
        };

        editorIds.forEach(id => {
            const editor = tinymce.get(id);
            const content = editor ? editor.getContent() : document.getElementById(id).value;
            const key = keyMapping[id] || id.replace('tpe-', '').replace(/-/g, '_');
            tataPerayaanData[key] = content;
        });

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
            tata_perayaan: tataPerayaanData
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

    // =================================================================
    // GLOBAL HANDLERS
    // =================================================================
    logoutButton.addEventListener('click', () => auth.signOut().then(() => { window.location.href = 'index.html' }));
    
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        const modal = document.getElementById(btn.dataset.target);
        if (modal) {
            btn.addEventListener('click', () => {
                modal.classList.add('hidden');
                tinymce.remove(); // Bersihkan editor saat modal ditutup
            });
        }
    });
    
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.add('hidden');
                tinymce.remove(); // Bersihkan editor saat overlay diklik
            }
        });
    });

    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", { "particles": { "number": { "value": 80 }, "color": { "value": "#004a99" }, "shape": { "type": "circle" }, "opacity": { "value": 0.5, "anim": { "enable": false } }, "size": { "value": 3, "random": true }, "line_linked": { "enable": true, "distance": 150, "color": "#004a99", "opacity": 0.4, "width": 1 }, "move": { "enable": true, "speed": 6 } }, "interactivity": { "events": { "onhover": { "enable": true, "mode": "repulse" } } }, "retina_detect": true });
    }
});