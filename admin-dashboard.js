// Konfigurasi Firebase Anda
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
const auth = firebase.auth();
const db = firebase.firestore();

// DATA STRUKTUR PROGRAM KERJA
const programStruktur = {
    "BIDANG I : MENJAGA PERSEKUTUAN DAN KEPEMIMPINAN YANG MELAYANI": ["1. Menata Struktur dan Manajemen Pastoral Paroki", "2. Menanamkan Dalam Diri Calon Pastor / Imam Pola Kepemimpinan Pastor yang Melayani, Kolegial, Transparan, Suka Mengunjungi Keluarga, Menjadi Mediator Dalam Konflik, dan Memahami manajemen Pastoral.", "3. Mengembangkan Sistem Pembinaan Berkelanjutan Bagi Para Imam / Pastor Untuk Menerapkan Pola Kepemimpinan Pastor yang Melayani, Kolegial, Transparan, Suka Mengunjungi Keluarga, Menjadi Mediator Dalam Konflik, dan Memahami Manajemen Pastoral.", "4. Menghidupkan Spritualitas KBG Sebagai Cara Hidup Mengumat yang Bercorak Ministerial / Kolegial dan Sinergis Dalam Persekutuan Wilayah Rohani dan Kelompok Kategorial", "5. Mengembangkan Situasi dan Semangat Hidup Kekeluargaan dan Persaudaraan", "6. Mempersiapkan Pemekaran Keuskupan Baru"],
    "BIDANG II : Menjaga Perbendaharaan Iman": ["7. Memperkuat Sistem dan Peran Seksi Pewartaan / Katekese Paroki", "8. Menyusun Modul Seksi Pewartaan/Katekese Paroki", "9. Kebutuhan: Meningkatkan Katekese Untuk Menunjang Kegiatan Pewartaan dan Pendalaman Iman di Tingkat Paroki", "10. Menata Kursus Perkawinan, Teologi Dasar, Kitab Suci Dasar, Liturgi Dasar, Untuk Umat (Teritorial & Kategorial)", "11. Menyiapkan dan Mengadakan Pembinaan Tenaga Katekese: Katekis, Para Calon Imam, Para Imam & Biarawan Biarawati", "12. Menyiapkan Sarana & Prasarana Katekese"],
    "BIDANG III : Pelayanan Sabda Dan Sakramen-Sakramen": ["13. Mempekuat Seksi Liturgi Paroki", "14. Menyusun Pedoman Liturgi Sakramen & Peribadatan Pada Umumnya", "15. Meningkatkan Kesadaran & Pentingnya Faktor Keteladanan & Kompetensi Para Pemimpin Liturgi Dalam Melaksanakan Liturgi Yang Benar & Sesuai Aturan", "16. Melengkapi Sarana & Prasarana Liturgi", "17. Mengembangkan Pendidikan & Pemahaman Tentang Musik Liturgi", "18. Mengembangkan Pendidikan & Pemahaman Tentang Inkulturasi"],
    "BIDANG IV : Memajukan Martabat & Peran Kaum Awam Yang Khas Dalam Perutusan Gereja": ["19. Mengembangkan Pembinaan Keluarga Secara Integral", "20. Membina & Memberdayakan Kerasulan Awam Untuk Membantu Karya Pelayanan Paroki", "21. Menanamkan Nilai Unitas & Solidaritas Antara Kaum Awam & Para Pelayan Tertahbis Dalam Semangat Cinta Kasih", "22. Memberdayakan Kualitas Kehidupan Sosial Ekonomi Umat", "23. Mengaktualisasikan Keberpihakan Kepada Kaum Miskin , Marjinal, & Yang Terbuang Berbasis Pemberdayaan Semua Potensi Paroki & Kebijakan Untuk Mengangkat Harkat & Martabat Mereka", "24. Mengembangkan Kualitas & Relasi Antar Umat Beragama di Tingkat Paroki", "25. Meningkatkan Keberpihakan Terhadap Pelestarian Lingkungan"],
    "BIDANG V : Pendidikan Katolik": ["26. Memberdayakan Kelembagaan & Meningkatkan Mutu Manajemen Institusi Pendidkan YPK (Sekolah)", "27. Memberdayakan Kelembagaan & Meningkatkan Mutu Manajemen YPTKKM & Institusi Pendidikan Yang Diselenggarakan", "28. Memberdayakan Kelembagaan & Meningkatkan Mutu Manajemen YPTU De La Salle & Institusi Pendidikan Yang Diselenggarakan", "29. Pengembangan Kerjasama & Sinergitas Antaryayasan Pendidkan di Keuskupan Manado", "30. Pengembangan Pendidikan Katolik Bagi Siswa & Mahasiswa Yang Bersekolah Diluar Lembaga Pendidikan Katolik", "31. Memberi Perhatian Terhadap Pendidikan Usia Dini", "32. Mengembangkan Model Pendidkan Nonformal & Pendidkan Keterampilan"],
    "BIDANG VI : Pengelolaan Harta Benda Gereja": ["33. Menyusun Pedoman Pengelolaan Harta Benda Gereja Yang Mencakup Pedoman Keuangan Serta Tugas Pokok, Tanggung Jawab, & Fungsi Dewan Keuangan Keuskupan, Badan Amal & Milik Keuskupan, Prokur & Komisi Pembangunan", "34. Membangun Sinergitas Antar Badan Pengelola Harta Benda Gereja Di Tingkat Paroki", "35. Mengembangkan Kompetensi, Sistem Kerja, & Sinergitas BadanBadan Pengelola Harta Benda Gereja Mulai Dari Tingkat Paroki Sampai Tingkat Basis", "36. Membangun Sistem Informasi Keuangan Yang Transparan & Terintegrasi Antara Paroki & Kelompok Basis Umat Secata Timbal Balik", "37. Membangun Sistem Manajemen Aset", "38. Pemberdayaan Harta Benda Gereja Melalui Manajemen Investasi Demi Pembangunan Kualitas Kehidupan Umat."]
};

// ELEMEN DOM
const welcomeTitle = document.getElementById('welcome-title');
const logoutButton = document.getElementById('logout-button');
const printBtn = document.getElementById('print-btn');
const programModal = document.getElementById('program-modal');
const announcementModal = document.getElementById('announcement-modal');
const liturgyModal = document.getElementById('liturgy-modal');
const statModal = document.getElementById('stat-modal');
const pastorListContainer = document.getElementById('pastor-list-container');
let currentEditProgramId = null;
let currentEditAnnouncementId = null;
let currentEditLiturgyId = null;

// LOGIKA NAVIGASI TAB
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

// AUTH GUARD & INISIALISASI
auth.onAuthStateChanged(async (user) => {
    if (user) {
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists && userDoc.data().peran === 'admin') {
            welcomeTitle.textContent = `PROGRAM KERJA: ${userDoc.data().nama_unit}`;
            loadAllPrograms();
            loadAllAnnouncements();
            loadAllLiturgies();
            loadAllPastors();
            loadParishStats();
            setupDropdowns();
        } else {
            alert('Anda tidak memiliki hak akses untuk halaman ini.');
            auth.signOut();
            window.location.href = 'login.html';
        }
    } else {
        window.location.href = 'login.html';
    }
});

// --- FUNGSI-FUNGSI CRUD PROGRAM KERJA (Tidak berubah) ---
const setupDropdowns = () => {
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
};

const loadAllPrograms = async () => {
    const programsTableBody = document.getElementById('programs-table-body');
    const tableFooter = document.getElementById('table-footer');
    programsTableBody.innerHTML = `<tr><td colspan="17" style="text-align:center;">Memuat data program kerja...</td></tr>`;
    tableFooter.innerHTML = '';
    try {
        const snapshot = await db.collection('programs').get();
        if (snapshot.empty) {
            programsTableBody.innerHTML = '<tr><td colspan="17" style="text-align:center;">Belum ada data program kerja.</td></tr>';
            return;
        }
        const programs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        programs.sort((a, b) => {
            const timeA = a.createdAt ? a.createdAt.toMillis() : 0;
            const timeB = b.createdAt ? b.createdAt.toMillis() : 0;
            return (a.bidang || '').localeCompare(b.bidang || '') || (a.sub_bidang_title || '').localeCompare(b.sub_bidang_title || '') || (timeA - timeB);
        });
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
    } catch (error) {
        console.error("Error memuat program kerja:", error);
        programsTableBody.innerHTML = `<tr><td colspan="17" style="text-align:center;">Gagal memuat data. Silakan cek konsol (F12).</td></tr>`;
    }
};

const addModalAnggaranRow = (item = {}) => {
    const modalAnggaranContainer = document.getElementById('modal-anggaran-items-container');
    const div = document.createElement('div');
    div.classList.add('anggaran-item');
    div.innerHTML = `<input type="text" placeholder="Perincian" class="anggaran-perincian" value="${item.perincian || ''}" required> <input type="number" placeholder="Vol" class="anggaran-vol" value="${item.volume || 1}"> <input type="text" placeholder="Satuan" class="anggaran-satuan" value="${item.satuan || 'Paket'}"> <input type="number" placeholder="Harga Satuan" class="anggaran-harga" value="${item.harga_satuan || ''}"> <input type="text" placeholder="Jumlah" class="anggaran-jumlah" value="Rp ${(item.jumlah || 0).toLocaleString('id-ID')}" readonly> <button type="button" class="remove-btn">&times;</button>`;
    modalAnggaranContainer.appendChild(div);
};

const calculateModalTotal = () => {
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
    if (target.classList.contains('delete-program')) {
        if (confirm(`Apakah Anda yakin ingin menghapus program ini?`)) {
            await db.collection('programs').doc(docId).delete();
            loadAllPrograms();
        }
    }
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
            if (program.anggaran && program.anggaran.length > 0) {
                program.anggaran.forEach(item => addModalAnggaranRow(item));
            } else {
                addModalAnggaranRow();
            }
            calculateModalTotal();
            document.getElementById('program-form-message').textContent = '';
            programModal.classList.remove('hidden');
        }
    }
});

document.getElementById('program-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const programFormMessage = document.getElementById('program-form-message');
    programFormMessage.textContent = 'Menyimpan...';
    const rincianAnggaran = [];
    document.getElementById('modal-anggaran-items-container').querySelectorAll('.anggaran-item').forEach(item => {
        const perincian = item.querySelector('.anggaran-perincian').value;
        if (perincian) {
            rincianAnggaran.push({
                perincian: perincian,
                volume: Number(item.querySelector('.anggaran-vol').value) || 0,
                satuan: item.querySelector('.anggaran-satuan').value,
                harga_satuan: Number(item.querySelector('.anggaran-harga').value) || 0,
                jumlah: (Number(item.querySelector('.anggaran-vol').value) || 0) * (Number(item.querySelector('.anggaran-harga').value) || 0)
            });
        }
    });
    const programData = {
        bidang: document.getElementById('modal-bidang').value,
        sub_bidang_title: document.getElementById('modal-sub-bidang').value,
        pusat_paroki_stasi: document.getElementById('modal-lokasi').value,
        nama_unit: document.getElementById('modal-nama-unit').value,
        nama_kegiatan: document.getElementById('modal-nama_kegiatan').value,
        sasaran: document.getElementById('modal-sasaran').value,
        indikator: document.getElementById('modal-indikator').value,
        model_materi: document.getElementById('modal-model').value,
        materi: document.getElementById('modal-materi').value,
        tempat_waktu: document.getElementById('modal-waktu').value,
        pic: document.getElementById('modal-pic').value,
        sumber_dana_kas: document.getElementById('modal-sumber-dana-kas').value,
        sumber_dana_swadaya: document.getElementById('modal-sumber-dana-swadaya').value,
        anggaran: rincianAnggaran,
        total_anggaran: parseFloat(document.getElementById('modal-total-anggaran-display').textContent.replace(/[^0-9]/g, '')),
    };
    
    try {
        if (currentEditProgramId) {
            await db.collection('programs').doc(currentEditProgramId).update(programData);
            programFormMessage.textContent = 'Berhasil diperbarui!';
        } else {
            programData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('programs').add(programData);
            programFormMessage.textContent = 'Berhasil disimpan!';
        }
        programFormMessage.classList.add('success');
        loadAllPrograms();
        setTimeout(() => programModal.classList.add('hidden'), 1500);
    } catch (error) {
        console.error("Error menyimpan data program:", error);
        programFormMessage.textContent = 'Gagal menyimpan data.';
        programFormMessage.classList.add('error');
    }
});

document.getElementById('modal-anggaran-items-container').addEventListener('click', (e) => { if (e.target.classList.contains('remove-btn')) { e.target.parentElement.remove(); calculateModalTotal(); }});
document.getElementById('modal-anggaran-items-container').addEventListener('input', calculateModalTotal);
document.getElementById('modal-add-anggaran-btn').addEventListener('click', () => addModalAnggaranRow());


// --- FUNGSI-FUNGSI CRUD PENGUMUMAN (Tidak berubah) ---
const loadAllAnnouncements = async () => {
    const announcementsTableBody = document.getElementById('announcements-table-body');
    announcementsTableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">Memuat data pengumuman...</td></tr>`;
    try {
        const snapshot = await db.collection('announcements').orderBy('createdAt', 'desc').get();
        announcementsTableBody.innerHTML = snapshot.empty ? '<tr><td colspan="5" style="text-align:center;">Belum ada pengumuman.</td></tr>' : snapshot.docs.map(doc => {
            const ann = doc.data();
            return `<tr data-id="${doc.id}"><td>${ann.judul||'-'}</td><td>${ann.tanggal||''}${ann.jam ? ' | '+ann.jam : ''}</td><td>${ann.lokasi||'-'}</td><td>${ann.catatan||'-'}</td><td class="no-print"><button class="action-btn-sm edit edit-announcement">Edit</button><button class="action-btn-sm delete delete-announcement">Hapus</button></td></tr>`;
        }).join('');
    } catch (error) {
        console.error("Error memuat pengumuman:", error);
        announcementsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Gagal memuat data.</td></tr>';
    }
};

document.getElementById('add-announcement-btn').addEventListener('click', () => {
    currentEditAnnouncementId = null;
    document.getElementById('announcement-modal-title').textContent = 'Tambah Pengumuman Baru';
    document.getElementById('announcement-form').reset();
    document.getElementById('announcement-form-message').textContent = '';
    announcementModal.classList.remove('hidden');
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
            document.getElementById('ann-catatan').value = ann.catatan || '';
            document.getElementById('announcement-form-message').textContent = '';
            announcementModal.classList.remove('hidden');
        }
    }
    if (target.classList.contains('delete-announcement')) {
        if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
            await db.collection('announcements').doc(docId).delete();
            loadAllAnnouncements();
        }
    }
});

document.getElementById('announcement-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const announcementFormMessage = document.getElementById('announcement-form-message');
    announcementFormMessage.textContent = 'Menyimpan...';
    const announcementData = {
        judul: document.getElementById('ann-judul').value,
        tanggal: document.getElementById('ann-tanggal').value,
        jam: document.getElementById('ann-jam').value,
        lokasi: document.getElementById('ann-lokasi').value,
        catatan: document.getElementById('ann-catatan').value,
    };
    try {
        if (currentEditAnnouncementId) {
            await db.collection('announcements').doc(currentEditAnnouncementId).update(announcementData);
        } else {
            announcementData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('announcements').add(announcementData);
        }
        announcementFormMessage.textContent = 'Berhasil disimpan!';
        announcementFormMessage.classList.add('success');
        loadAllAnnouncements();
        setTimeout(() => announcementModal.classList.add('hidden'), 1000);
    } catch (error) {
        console.error("Error menyimpan pengumuman:", error);
        announcementFormMessage.textContent = 'Gagal menyimpan data.';
        announcementFormMessage.classList.add('error');
    }
});


// --- FUNGSI-FUNGSI CRUD LITURGI (DIPERBARUI UNTUK OTOMATISASI) ---
const loadAllLiturgies = async () => {
    const liturgiesTableBody = document.getElementById('liturgies-table-body');
    liturgiesTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;">Memuat data liturgi...</td></tr>`;
    try {
        // Mengurutkan berdasarkan tanggal liturgi, yang terbaru di atas
        const snapshot = await db.collection('liturgies').orderBy('liturgyDate', 'desc').get();
        if (snapshot.empty) {
            liturgiesTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Belum ada data liturgi.</td></tr>';
            return;
        }
        liturgiesTableBody.innerHTML = snapshot.docs.map(doc => {
            const lit = doc.data();
            // Tombol "Jadikan Aktif" dan Status dihilangkan
            return `<tr data-id="${doc.id}"><td>${lit.tanggal||'-'}</td><td>${lit.peringatan||'-'}</td><td>${lit.warna||'-'}</td><td class="no-print"><button class="action-btn-sm edit edit-liturgy">Edit</button><button class="action-btn-sm delete delete-liturgy">Hapus</button></td></tr>`;
        }).join('');
    } catch (error) {
        console.error("Error memuat liturgi:", error);
        liturgiesTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Gagal memuat data.</td></tr>';
    }
};

// Fungsi pembantu untuk mengubah string tanggal Indonesia menjadi objek Date
const parseIndonesianDate = (dateString) => {
    const months = {
        'januari': 0, 'februari': 1, 'maret': 2, 'april': 3, 'mei': 4, 'juni': 5,
        'juli': 6, 'agustus': 7, 'september': 8, 'oktober': 9, 'november': 10, 'desember': 11
    };
    const parts = dateString.toLowerCase().split(' ');
    if (parts.length !== 3) return null; // Format tidak valid
    
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]];
    const year = parseInt(parts[2], 10);

    if (isNaN(day) || month === undefined || isNaN(year)) return null;

    return new Date(year, month, day);
};

document.getElementById('add-liturgy-btn').addEventListener('click', () => {
    currentEditLiturgyId = null;
    document.getElementById('liturgy-modal-title').textContent = 'Tambah Liturgi Baru';
    document.getElementById('liturgy-form').reset();
    document.getElementById('liturgy-form-message').textContent = '';
    liturgyModal.classList.remove('hidden');
});

document.getElementById('liturgy-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const liturgyFormMessage = document.getElementById('liturgy-form-message');
    liturgyFormMessage.textContent = 'Menyimpan...';
    
    const dateString = document.getElementById('lit-tanggal').value;
    const parsedDate = parseIndonesianDate(dateString);

    if (!parsedDate) {
        liturgyFormMessage.textContent = 'Format tanggal salah! Contoh: 13 Juli 2025';
        liturgyFormMessage.className = 'form-message error';
        return;
    }

    const liturgyData = {
        tanggal: dateString, // Tetap simpan string untuk display
        liturgyDate: firebase.firestore.Timestamp.fromDate(parsedDate), // Simpan sebagai timestamp untuk query
        peringatan: document.getElementById('lit-peringatan').value,
        warna: document.getElementById('lit-warna').value,
        bacaan1: document.getElementById('lit-bacaan1').value,
        bacaan2: document.getElementById('lit-bacaan2').value,
        mazmur: document.getElementById('lit-mazmur').value,
        injil: document.getElementById('lit-injil').value,
        renungan: document.getElementById('lit-renungan').value,
    };
    try {
        if (currentEditLiturgyId) {
            await db.collection('liturgies').doc(currentEditLiturgyId).update(liturgyData);
        } else {
            // Hapus isCurrent, tidak lagi digunakan
            await db.collection('liturgies').add(liturgyData);
        }
        liturgyFormMessage.textContent = 'Berhasil disimpan!';
        liturgyFormMessage.classList.add('success');
        loadAllLiturgies();
        setTimeout(() => liturgyModal.classList.add('hidden'), 1000);
    } catch (error) {
        console.error("Error menyimpan liturgi:", error);
        liturgyFormMessage.textContent = 'Gagal menyimpan data.';
        liturgyFormMessage.classList.add('error');
    }
});

document.getElementById('liturgies-table-body').addEventListener('click', async (e) => {
    const target = e.target;
    const row = target.closest('tr');
    if (!row) return;
    const docId = row.dataset.id;
    if (target.classList.contains('edit-liturgy')) {
        const doc = await db.collection('liturgies').doc(docId).get();
        if (doc.exists) {
            const lit = doc.data();
            currentEditLiturgyId = docId;
            document.getElementById('liturgy-modal-title').textContent = 'Edit Liturgi';
            document.getElementById('lit-tanggal').value = lit.tanggal || '';
            document.getElementById('lit-peringatan').value = lit.peringatan || '';
            document.getElementById('lit-warna').value = lit.warna || '';
            document.getElementById('lit-bacaan1').value = lit.bacaan1 || '';
            document.getElementById('lit-bacaan2').value = lit.bacaan2 || '';
            document.getElementById('lit-mazmur').value = lit.mazmur || '';
            document.getElementById('lit-injil').value = lit.injil || '';
            document.getElementById('lit-renungan').value = lit.renungan || '';
            document.getElementById('liturgy-form-message').textContent = '';
            liturgyModal.classList.remove('hidden');
        }
    }
    if (target.classList.contains('delete-liturgy')) {
        if (confirm('Apakah Anda yakin ingin menghapus data liturgi ini?')) {
            await db.collection('liturgies').doc(docId).delete();
            loadAllLiturgies();
        }
    }
    // Logika untuk 'make-current-btn' dihapus karena sudah otomatis
});


// --- FUNGSI MANAJEMEN KEHADIRAN PASTOR (Tidak berubah) ---
const loadAllPastors = async () => {
    if (!pastorListContainer) return;
    pastorListContainer.innerHTML = `<p>Memuat daftar pastor...</p>`;
    try {
        const snapshot = await db.collection('pastors').orderBy('order').get();
        if (snapshot.empty) {
            pastorListContainer.innerHTML = '<p>Belum ada data pastor di database. Silakan tambahkan manual di Firebase Console.</p>';
            return;
        }
        pastorListContainer.innerHTML = snapshot.docs.map(doc => {
            const pastor = doc.data();
            const pastorId = doc.id;
            return `<div class="pastor-management-card" data-id="${pastorId}"><img src="${pastor.photoUrl}" alt="Foto ${pastor.name}"><h5>${pastor.name}</h5><select class="pastor-status-select" data-id="${pastorId}"><option value="Di Tempat" ${pastor.status === 'Di Tempat' ? 'selected' : ''}>Di Tempat</option><option value="Pelayanan Luar" ${pastor.status === 'Pelayanan Luar' ? 'selected' : ''}>Pelayanan Luar</option><option value="Sakit" ${pastor.status === 'Sakit' ? 'selected' : ''}>Sakit</option><option value="Cuti/Libur" ${pastor.status === 'Cuti/Libur' ? 'selected' : ''}>Cuti/Libur</option></select><div class="status-update-feedback" id="feedback-${pastorId}"></div></div>`;
        }).join('');
    } catch (error) {
        console.error("Error memuat data pastor:", error);
        pastorListContainer.innerHTML = '<p class="text-danger">Gagal memuat data pastor.</p>';
    }
};

if (pastorListContainer) {
    pastorListContainer.addEventListener('change', async (e) => {
        if (e.target.classList.contains('pastor-status-select')) {
            const pastorId = e.target.dataset.id;
            const newStatus = e.target.value;
            const feedbackEl = document.getElementById(`feedback-${pastorId}`);
            if (feedbackEl) feedbackEl.textContent = 'Menyimpan...';
            try {
                await db.collection('pastors').doc(pastorId).update({ status: newStatus });
                if (feedbackEl) {
                    feedbackEl.textContent = 'Status diperbarui!';
                    setTimeout(() => { feedbackEl.textContent = ''; }, 2000);
                }
            } catch (error) {
                console.error('Gagal memperbarui status pastor:', error);
                if (feedbackEl) feedbackEl.textContent = 'Gagal!';
            }
        }
    });
}


// --- FUNGSI MANAJEMEN STATISTIK UMAT (Tidak berubah) ---
const loadParishStats = async () => {
    const statsTableBody = document.getElementById('stats-table-body');
    const statsTableFooter = document.getElementById('stats-table-footer');
    if (!statsTableBody || !statsTableFooter) return;

    statsTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Memuat data statistik...</td></tr>`;
    statsTableFooter.innerHTML = '';
    
    try {
        const snapshot = await db.collection('parish_stats').orderBy('order').get();
        
        if (snapshot.empty) {
            statsTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem;"><p>Data statistik umat belum ada di database.</p><button id="upload-initial-stats-btn" class="action-btn" style="background-color: #28a745; border-color: #28a745; color: white;"><i class="bi bi-upload"></i> Unggah Data Statistik Awal (28 Wilayah)</button><div id="upload-feedback" style="margin-top: 1rem; font-style: italic;"></div></td></tr>`;
            document.getElementById('upload-initial-stats-btn').addEventListener('click', uploadInitialStats);
            return;
        }

        let totalKK = 0, totalLaki = 0, totalPerempuan = 0;
        statsTableBody.innerHTML = snapshot.docs.map(doc => {
            const stat = doc.data();
            const jumlahJiwa = stat.laki_laki + stat.perempuan;
            totalKK += stat.kk;
            totalLaki += stat.laki_laki;
            totalPerempuan += stat.perempuan;
            return `<tr data-id="${doc.id}"><td>${stat.order}</td><td>${stat.name}</td><td>${stat.kk}</td><td>${stat.laki_laki}</td><td>${stat.perempuan}</td><td>${jumlahJiwa}</td><td class="no-print"><button class="action-btn-sm edit edit-stat">Edit</button></td></tr>`;
        }).join('');
        
        const totalJiwa = totalLaki + totalPerempuan;
        statsTableFooter.innerHTML = `<tr style="font-weight: bold; background-color: #e6f2ff;"><td colspan="2">JUMLAH</td><td>${totalKK}</td><td>${totalLaki}</td><td>${totalPerempuan}</td><td>${totalJiwa}</td><td class="no-print"></td></tr>`;

    } catch (error) {
        console.error("Error memuat statistik umat:", error);
        statsTableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">Gagal memuat data statistik. Error: ${error.message}</td></tr>`;
    }
};

const uploadInitialStats = async () => {
    const uploadBtn = document.getElementById('upload-initial-stats-btn');
    const feedbackEl = document.getElementById('upload-feedback');
    if (!confirm('Apakah Anda yakin ingin mengunggah 28 data statistik awal? Tindakan ini hanya boleh dilakukan satu kali.')) return;

    uploadBtn.disabled = true;
    feedbackEl.textContent = 'Memulai proses unggah... Ini mungkin perlu beberapa saat.';

    const parishStatsData = [
        { order: 1, name: 'St. Fransiskus Asisi Sinisir', kk: 23, laki_laki: 41, perempuan: 30 }, { order: 2, name: 'St. Dominikus Sinisir', kk: 22, laki_laki: 28, perempuan: 31 }, { order: 3, name: 'St. Ignatius Sinisir', kk: 20, laki_laki: 24, perempuan: 25 }, { order: 4, name: 'Sta. Skolastika Sinisir', kk: 26, laki_laki: 39, perempuan: 32 }, { order: 5, name: 'St. Vincensius Sinisir', kk: 20, laki_laki: 28, perempuan: 28 }, { order: 6, name: 'St. Stefanus Sinisir', kk: 21, laki_laki: 23, perempuan: 28 }, { order: 7, name: 'Sta. Ursula Sinisir', kk: 19, laki_laki: 26, perempuan: 34 }, { order: 8, name: 'Sta. Maria Bunda Karmel Sinisir', kk: 21, laki_laki: 29, perempuan: 34 }, { order: 9, name: 'St. Romualdus Sinisir', kk: 21, laki_laki: 33, perempuan: 35 }, { order: 10, name: 'Sta. Faustina Sinisir', kk: 19, laki_laki: 30, perempuan: 26 }, { order: 11, name: 'Sta. Theresia Sinisir', kk: 22, laki_laki: 38, perempuan: 28 }, { order: 12, name: 'St. Mikael Sinisir', kk: 13, laki_laki: 16, perempuan: 17 }, { order: 13, name: 'Antonius Maria Claret Makaaroyen', kk: 20, laki_laki: 30, perempuan: 28 }, { order: 14, name: 'St. Alfonsus Maria de Liquori Makaaroyen', kk: 19, laki_laki: 23, perempuan: 29 }, { order: 15, name: 'Sta. Angela Merici Tambelang', kk: 21, laki_laki: 35, perempuan: 28 }, { order: 16, name: 'St. Aloysius Gonzaga Tambelang', kk: 22, laki_laki: 46, perempuan: 34 }, { order: 17, name: 'Sta. Katarina siena Tambelang', kk: 20, laki_laki: 26, perempuan: 31 }, { order: 18, name: 'St. Robertus Belarminus Tambelang', kk: 20, laki_laki: 33, perempuan: 26 }, { order: 19, name: 'St. Yohanes Krisostomus Tambelang', kk: 15, laki_laki: 19, perempuan: 27 }, { order: 20, name: 'St. Fransiskus D sales Tambelang', kk: 19, laki_laki: 34, perempuan: 33 }, { order: 21, name: 'St. Pius X Tambelang', kk: 20, laki_laki: 43, perempuan: 32 }, { order: 22, name: 'St. Hironimus Kinamang', kk: 22, laki_laki: 38, perempuan: 32 }, { order: 23, name: 'St. Lukas Kinamang', kk: 24, laki_laki: 32, perempuan: 45 }, { order: 24, name: 'Sta. Agata Kinamang', kk: 23, laki_laki: 36, perempuan: 30 }, { order: 25, name: 'Sta. Rita de cascia Kinamang', kk: 23, laki_laki: 36, perempuan: 30 }, { order: 26, name: 'St. Laurensius Kinamang', kk: 21, laki_laki: 28, perempuan: 27 }, { order: 27, name: 'Stasi Christus Rex Liningaan', kk: 22, laki_laki: 34, perempuan: 32 }, { order: 28, name: 'Stasi Hati Kudus Yesus Mobuya', kk: 11, laki_laki: 19, perempuan: 16 }
    ];

    try {
        const batch = db.batch();
        parishStatsData.forEach(stat => { const docRef = db.collection('parish_stats').doc(); batch.set(docRef, stat); });
        await batch.commit();
        feedbackEl.textContent = 'BERHASIL! Memuat ulang tabel...';
        feedbackEl.style.color = 'green';
        setTimeout(loadParishStats, 1500);
    } catch (error) {
        console.error('Gagal mengunggah data statistik:', error);
        feedbackEl.textContent = `GAGAL! Terjadi kesalahan: ${error.message}`;
        feedbackEl.style.color = 'red';
        uploadBtn.disabled = false;
    }
};

document.getElementById('stats-table-body').addEventListener('click', async (e) => {
    if (e.target.classList.contains('edit-stat')) {
        const docId = e.target.closest('tr').dataset.id;
        const doc = await db.collection('parish_stats').doc(docId).get();
        if(doc.exists) {
            const stat = doc.data();
            document.getElementById('stat-modal-title').textContent = `Edit Statistik: ${stat.name}`;
            document.getElementById('stat-doc-id').value = docId;
            document.getElementById('stat-kk').value = stat.kk;
            document.getElementById('stat-laki').value = stat.laki_laki;
            document.getElementById('stat-perempuan').value = stat.perempuan;
            document.getElementById('stat-form-message').textContent = '';
            statModal.classList.remove('hidden');
        }
    }
});

document.getElementById('stat-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const docId = document.getElementById('stat-doc-id').value;
    const messageEl = document.getElementById('stat-form-message');
    const statData = { kk: parseInt(document.getElementById('stat-kk').value, 10), laki_laki: parseInt(document.getElementById('stat-laki').value, 10), perempuan: parseInt(document.getElementById('stat-perempuan').value, 10) };
    messageEl.textContent = 'Menyimpan...';
    try {
        await db.collection('parish_stats').doc(docId).update(statData);
        messageEl.textContent = 'Berhasil diperbarui!';
        messageEl.classList.add('success');
        loadParishStats();
        setTimeout(() => statModal.classList.add('hidden'), 1000);
    } catch (error) {
        console.error("Gagal memperbarui statistik:", error);
        messageEl.textContent = 'Gagal menyimpan data.';
        messageEl.classList.add('error');
    }
});


// --- EVENT LISTENERS UMUM ---
logoutButton.addEventListener('click', () => auth.signOut().then(() => { window.location.href = 'index.html' }));
printBtn.addEventListener('click', () => window.print());

document.querySelectorAll('.close-modal-btn').forEach(btn => {
    const targetModal = document.getElementById(btn.dataset.target);
    if (targetModal) {
        btn.addEventListener('click', () => targetModal.classList.add('hidden'));
    }
});
document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.add('hidden') });
});

// INISIALISASI PARTICLES.JS
if (typeof particlesJS !== 'undefined') {
  particlesJS("particles-js", {
      particles: { number: { value: 80 }, color: { value: "#004a99" }, shape: { type: "circle" }, opacity: { value: 0.5, anim: { enable: false } }, size: { value: 3, random: true }, line_linked: { enable: true, distance: 150, color: "#004a99", opacity: 0.4, width: 1 }, move: { enable: true, speed: 6 } },
      interactivity: { events: { onhover: { enable: true, mode: "repulse" } } },
      retina_detect: true
  });
}
