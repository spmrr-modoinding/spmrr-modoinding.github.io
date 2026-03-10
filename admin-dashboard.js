document.addEventListener('DOMContentLoaded', () => {
    console.log("Sistem Admin Paroki berjalan dengan mode aman (Safety Mode)...");

    const db = firebase.firestore();
    const auth = firebase.auth();
    let umatChart = null;
    let currentEditAnnouncementId = null;
    let currentEditTpeId = null;

    // --- FUNGSI KIRIM NOTIFIKASI ONESIGNAL (BYPASS CORS) ---
    async function kirimNotifikasi(judul, isiPesan) {
        const ONESIGNAL_APP_ID = "b93c1efb-e3cb-462f-9a43-44fad15e638f"; 
        const ONESIGNAL_REST_API_KEY = "os_v2_app_xe6b567dzndc7gsdit5ncxtdr7zix274ayhe3rm736dh3r3bh2h5qe3c7ky3rbv31y24jqfxpqkorh33i4hu77ti4acqae4y2fw5nqq";

        const headers = {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": "Basic " + ONESIGNAL_REST_API_KEY
        };

        const data = {
            app_id: ONESIGNAL_APP_ID,
            included_segments: ["All"], 
            headings: { "en": judul },
            contents: { "en": isiPesan },
            url: "https://spmrr-modoinding.github.io" 
        };

        try {
            // Menggunakan Jembatan CORS Proxy untuk menembus blokir browser ke OneSignal
            const targetUrl = encodeURIComponent("https://onesignal.com/api/v1/notifications");
            const proxyUrl = "https://corsproxy.io/?" + targetUrl;

            const response = await fetch(proxyUrl, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(data)
            });
            const result = await response.json();
            console.log("Status Notifikasi Push (Sukses Ditembus):", result);
        } catch (error) {
            console.error("Notifikasi Push gagal dikirim:", error);
        }
    }

    // --- FUNGSI SIMPAN RIWAYAT NOTIFIKASI KE DATABASE ---
    async function simpanRiwayatNotif(judul, isiPesan, kategori) {
        try {
            await db.collection('app_notifications').add({
                judul: judul,
                pesan: isiPesan,
                kategori: kategori, // 'tpe' atau 'pengumuman'
                tanggal: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("Riwayat notifikasi berhasil disimpan.");
        } catch (error) {
            console.error("Gagal menyimpan riwayat notif:", error);
        }
    }

    // --- HELPER: TINYMCE EDITOR (DILINDUNGI) ---
    function initTinyMCE() {
        if (typeof tinymce === 'undefined') {
            console.warn("Editor Teks lambat memuat, namun sistem tetap berjalan.");
            return;
        }
        tinymce.remove('.tinymce-editor'); 
        tinymce.init({
            selector: '.tinymce-editor',
            plugins: 'autolink lists link wordcount',
            toolbar: 'bold italic underline | bullist numlist | link removeformat',
            menubar: false,
            height: 200, 
            setup: function(editor) {
                editor.on('change', function () {
                    editor.save();
                });
            }
        });
    }

    // --- HELPER: SIDEBAR TOGGLE (MOBILE) ---
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
        document.querySelector('.sidebar')?.classList.toggle('active');
    });

    // --- HELPER: TAB NAVIGATION ---
    const navTabs = document.querySelectorAll('.nav-tab-btn');
    const sections = document.querySelectorAll('.management-section');
    const pageTitle = document.getElementById('page-title');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            tab.classList.add('active');
            const targetId = tab.dataset.target;
            document.getElementById(targetId)?.classList.add('active');
            
            if(pageTitle) pageTitle.innerText = tab.querySelector('span')?.innerText || 'Dashboard';
            
            if(window.innerWidth <= 768) {
                document.querySelector('.sidebar')?.classList.remove('active');
            }
        });
    });

    // --- AUTHENTICATION CHECK ---
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            updateSummaryDashboard();
            listenToAnnouncements();
            listenToTPEs();
            listenToParishStats();
        } else {
            window.location.href = 'login.html';
        }
    });

    const updateSummaryDashboard = async () => {
        try {
            const annSnap = await db.collection('announcements').get();
            const elmAnn = document.getElementById('summary-announcements-count');
            if(elmAnn) elmAnn.textContent = annSnap.size;
            
            const statSnap = await db.collection('parish_stats').get();
            let total = 0;
            statSnap.forEach(doc => total += (doc.data().laki_laki + doc.data().perempuan) || 0);
            const elmUmat = document.getElementById('summary-umat-total');
            if(elmUmat) elmUmat.textContent = total.toLocaleString();
        } catch(e) {
            console.error("Gagal memuat ringkasan dashboard", e);
        }
    };

    // ===========================================
    // 1. TPE (TATA PERAYAAN EKARISTI) LOGIC
    // ===========================================
    document.getElementById('q-add-tpe-btn')?.addEventListener('click', () => {
        document.querySelector('[data-target="tpe-section"]')?.click();
        setTimeout(() => document.getElementById('add-tpe-btn')?.click(), 200);
    });

    document.getElementById('add-tpe-btn')?.addEventListener('click', () => {
        currentEditTpeId = null;
        document.getElementById('tpe-form')?.reset();
        const msg = document.getElementById('tpe-form-message');
        if(msg) msg.textContent = '';
        document.getElementById('tpe-modal')?.classList.remove('hidden');
        initTinyMCE();
    });

    function listenToTPEs() {
        const tbody = document.getElementById('tpe-table-body');
        if(!tbody) return;
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">Memuat...</td></tr>';
        
        db.collection('tata_perayaan_mingguan').onSnapshot(snap => {
            if(snap.empty) { tbody.innerHTML = '<tr><td colspan="3" class="text-center">Belum ada data TPE.</td></tr>'; return; }
            
            const sorted = snap.docs.sort((a,b) => b.id.localeCompare(a.id));
            let html = '';
            sorted.forEach(doc => {
                const d = doc.data();
                html += `
                    <tr>
                        <td><strong>${d.tanggal_display || '-'}</strong><br><small style="color:#888">${doc.id}</small></td>
                        <td>${d.nama_perayaan || '-'}</td>
                        <td class="text-end">
                            <button class="btn-action edit edit-tpe" data-id="${doc.id}"><i class="bi bi-pencil-fill"></i></button>
                            <button class="btn-action delete delete-tpe" data-id="${doc.id}"><i class="bi bi-trash-fill"></i></button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        });
    }

    document.getElementById('tpe-table-body')?.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if(!btn) return;
        const id = btn.dataset.id;
        if(!id) return;

        if(btn.classList.contains('delete-tpe')) {
            if(confirm('Hapus TPE tanggal ' + id + '?')) {
                await db.collection('tata_perayaan_mingguan').doc(id).delete();
            }
        }

        if(btn.classList.contains('edit-tpe')) {
            const doc = await db.collection('tata_perayaan_mingguan').doc(id).get();
            if(!doc.exists) return;
            const data = doc.data();
            currentEditTpeId = id;
            
            const setVal = (elmId, val) => { const el = document.getElementById(elmId); if(el) el.value = val; };
            
            setVal('tpe-tanggal', id);
            setVal('tpe-nama-perayaan', data.nama_perayaan || '');
            setVal('tpe-tahun-liturgi', data.tahun_liturgi || '');
            setVal('tpe-tema', data.tema || '');

            const tpe = data.tata_perayaan || {};
            const fields = ['antifon-pembuka', 'doa-kolekta', 'bacaan-1', 'mazmur', 'bacaan-2', 'bait-injil', 'bacaan-injil', 'doa-umat', 'doa-persembahan', 'antifon-komuni', 'doa-sesudah-komuni'];
            
            fields.forEach(f => {
                let key = f.replace(/-/g, '_'); 
                if(f === 'mazmur') key = 'mazmur_tanggapan';
                if(f === 'bait-injil') key = 'bait_pengantar_injil';
                setVal('tpe-'+f, tpe[key] || '');
            });

            document.getElementById('tpe-modal')?.classList.remove('hidden');
            initTinyMCE();
        }
    });

    document.getElementById('tpe-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = document.getElementById('tpe-form-message');
        const dateVal = document.getElementById('tpe-tanggal')?.value;
        if(!dateVal) { if(msg) msg.textContent = 'Tanggal wajib diisi'; return; }
        
        if(msg) msg.textContent = 'Menyimpan...';

        const tpeData = {};
        const fields = ['antifon-pembuka', 'doa-kolekta', 'bacaan-1', 'mazmur', 'bacaan-2', 'bait-injil', 'bacaan-injil', 'doa-umat', 'doa-persembahan', 'antifon-komuni', 'doa-sesudah-komuni'];
        
        fields.forEach(f => {
            let val = '';
            if (typeof tinymce !== 'undefined') {
                const editor = tinymce.get('tpe-'+f);
                val = editor ? editor.getContent() : document.getElementById('tpe-'+f)?.value || '';
            } else {
                val = document.getElementById('tpe-'+f)?.value || '';
            }
            
            let key = f.replace(/-/g, '_');
            if(f === 'mazmur') key = 'mazmur_tanggapan';
            if(f === 'bait-injil') key = 'bait_pengantar_injil';
            tpeData[key] = val;
        });

        const displayDate = new Date(dateVal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const payload = {
            tanggal_display: displayDate,
            nama_perayaan: document.getElementById('tpe-nama-perayaan')?.value || '',
            tahun_liturgi: document.getElementById('tpe-tahun-liturgi')?.value || '',
            tema: document.getElementById('tpe-tema')?.value || '',
            tata_perayaan: tpeData
        };

        try {
            await db.collection('tata_perayaan_mingguan').doc(dateVal).set(payload);
            if(msg) { msg.textContent = 'Berhasil tersimpan!'; msg.style.color = 'green'; }
            
            // --- TRIGGER NOTIFIKASI TPE BARU ---
            const judulNotif = "TPE Minggu Ini Sudah Tersedia!";
            const isiNotif = `Tata Perayaan Ekaristi untuk ${payload.nama_perayaan} sudah bisa dilihat di website. Buka untuk persiapan misa.`;
            
            kirimNotifikasi(judulNotif, isiNotif);
            simpanRiwayatNotif(judulNotif, isiNotif, 'tpe');

            setTimeout(() => {
                document.getElementById('tpe-modal')?.classList.add('hidden');
                if(typeof tinymce !== 'undefined') tinymce.remove();
            }, 1000);
        } catch(err) {
            if(msg) { msg.textContent = 'Error: ' + err.message; msg.style.color = 'red'; }
        }
    });

    // ===========================================
    // 2. ANNOUNCEMENT (PENGUMUMAN) LOGIC
    // ===========================================
    document.getElementById('q-add-announcement-btn')?.addEventListener('click', () => {
        document.querySelector('[data-target="announcements-section"]')?.click();
        setTimeout(() => document.getElementById('add-announcement-btn')?.click(), 200);
    });

    document.getElementById('add-announcement-btn')?.addEventListener('click', () => {
        currentEditAnnouncementId = null;
        document.getElementById('announcement-form')?.reset();
        document.getElementById('announcement-modal')?.classList.remove('hidden');
        initTinyMCE();
    });

    function listenToAnnouncements() {
        const tbody = document.getElementById('announcements-table-body');
        if(!tbody) return;
        
        db.collection('announcements').orderBy('createdAt', 'desc').onSnapshot(snap => {
            if(snap.empty) { tbody.innerHTML = '<tr><td colspan="5" class="text-center">Kosong</td></tr>'; return; }
            let html = '';
            snap.forEach(doc => {
                const d = doc.data();
                const tmp = document.createElement("DIV");
                tmp.innerHTML = d.catatan || '';
                const preview = tmp.textContent || tmp.innerText || "";
                
                html += `
                    <tr>
                        <td><strong>${d.judul || '-'}</strong></td>
                        <td>${d.tanggal || '-'} ${d.jam ? '<br>'+d.jam : ''}</td>
                        <td>${d.lokasi || '-'}</td>
                        <td><small>${preview.substring(0, 50)}...</small></td>
                        <td class="text-end">
                            <button class="btn-action edit edit-ann" data-id="${doc.id}"><i class="bi bi-pencil-fill"></i></button>
                            <button class="btn-action delete delete-ann" data-id="${doc.id}"><i class="bi bi-trash-fill"></i></button>
                        </td>
                    </tr>
                `;
            });
            tbody.innerHTML = html;
        });
    }

    document.getElementById('announcements-table-body')?.addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if(!btn) return;
        const id = btn.dataset.id;
        if(!id) return;

        if(btn.classList.contains('delete-ann')) {
            if(confirm('Hapus pengumuman ini?')) await db.collection('announcements').doc(id).delete();
        }
        if(btn.classList.contains('edit-ann')) {
            const doc = await db.collection('announcements').doc(id).get();
            if(!doc.exists) return;
            const d = doc.data();
            currentEditAnnouncementId = id;
            
            const setVal = (elmId, val) => { const el = document.getElementById(elmId); if(el) el.value = val; };
            setVal('ann-judul', d.judul || '');
            setVal('ann-tanggal', d.tanggal || '');
            setVal('ann-jam', d.jam || '');
            setVal('ann-lokasi', d.lokasi || '');
            setVal('ann-catatan', d.catatan || '');
            
            document.getElementById('announcement-modal')?.classList.remove('hidden');
            initTinyMCE(); 
        }
    });

    document.getElementById('announcement-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        let content = '';
        if (typeof tinymce !== 'undefined') {
            const editor = tinymce.get('ann-catatan');
            content = editor ? editor.getContent() : document.getElementById('ann-catatan')?.value || '';
        } else {
            content = document.getElementById('ann-catatan')?.value || '';
        }
        
        const data = {
            judul: document.getElementById('ann-judul')?.value || '',
            tanggal: document.getElementById('ann-tanggal')?.value || '',
            jam: document.getElementById('ann-jam')?.value || '',
            lokasi: document.getElementById('ann-lokasi')?.value || '',
            catatan: content
        };

        if(currentEditAnnouncementId) {
            await db.collection('announcements').doc(currentEditAnnouncementId).update(data);
        } else {
            data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('announcements').add(data);
            
            // --- TRIGGER NOTIFIKASI PENGUMUMAN BARU ---
            const judulNotif = "Warta Paroki Terbaru";
            const isiNotif = `Ada pengumuman baru mengenai: ${data.judul}. Klik untuk membaca detailnya.`; 
            
            kirimNotifikasi(judulNotif, isiNotif);
            simpanRiwayatNotif(judulNotif, isiNotif, 'pengumuman');
        }
        document.getElementById('announcement-modal')?.classList.add('hidden');
        if(typeof tinymce !== 'undefined') tinymce.remove();
    });

    // ===========================================
    // 3. STATISTICS LOGIC
    // ===========================================
    function listenToParishStats() {
        const tbody = document.getElementById('stats-table-body');
        const tfoot = document.getElementById('stats-table-footer');
        if(!tbody || !tfoot) return;
        
        db.collection('parish_stats').orderBy('order').onSnapshot(snap => {
            if(snap.empty) { tbody.innerHTML = '<tr><td colspan="7">Kosong</td></tr>'; return; }
            let h = '';
            let tKK=0, tL=0, tP=0;
            let labels = [], chartData = [];

            snap.forEach(doc => {
                const d = doc.data();
                const total = (d.laki_laki||0) + (d.perempuan||0);
                tKK += d.kk||0; tL += d.laki_laki||0; tP += d.perempuan||0;
                labels.push((d.name || '').replace('Stasi','').trim());
                chartData.push(total);

                h += `
                    <tr>
                        <td>${d.order || '-'}</td>
                        <td>${d.name || '-'}</td>
                        <td>${d.kk || '0'}</td>
                        <td>${d.laki_laki || '0'}</td>
                        <td>${d.perempuan || '0'}</td>
                        <td><strong>${total}</strong></td>
                        <td><button class="btn-action edit edit-stat" data-id="${doc.id}"><i class="bi bi-pencil-fill"></i></button></td>
                    </tr>
                `;
            });
            tbody.innerHTML = h;
            tfoot.innerHTML = `<tr><td colspan="2"><strong>TOTAL</strong></td><td><strong>${tKK}</strong></td><td><strong>${tL}</strong></td><td><strong>${tP}</strong></td><td><strong>${tL+tP}</strong></td><td></td></tr>`;

            renderChart(labels, chartData);
        });
    }

    document.getElementById('stats-table-body')?.addEventListener('click', async (e) => {
        const btn = e.target.closest('.edit-stat');
        if(!btn) return;
        const id = btn.dataset.id;
        if(!id) return;

        const doc = await db.collection('parish_stats').doc(id).get();
        if(!doc.exists) return;
        const d = doc.data();
        
        const setVal = (elmId, val) => { const el = document.getElementById(elmId); if(el) el.value = val; };
        setVal('stat-doc-id', id);
        setVal('stat-kk', d.kk || 0);
        setVal('stat-laki', d.laki_laki || 0);
        setVal('stat-perempuan', d.perempuan || 0);
        
        document.getElementById('stat-modal')?.classList.remove('hidden');
    });

    document.getElementById('stat-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('stat-doc-id')?.value;
        if(!id) return;

        await db.collection('parish_stats').doc(id).update({
            kk: parseInt(document.getElementById('stat-kk')?.value || 0),
            laki_laki: parseInt(document.getElementById('stat-laki')?.value || 0),
            perempuan: parseInt(document.getElementById('stat-perempuan')?.value || 0)
        });
        document.getElementById('stat-modal')?.classList.add('hidden');
    });

    function renderChart(labels, data) {
        const ctx = document.getElementById('umat-chart');
        if(!ctx) return;
        if (typeof Chart === 'undefined') return;

        if(umatChart) umatChart.destroy();
        umatChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Jumlah Jiwa',
                    data: data,
                    backgroundColor: '#004a99',
                    borderRadius: 4
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    // --- MODAL UTILS & LOGOUT ---
    document.querySelectorAll('.close-modal-btn, .modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            if(e.target === el || el.classList.contains('close-modal-btn')) {
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
                if(typeof tinymce !== 'undefined') tinymce.remove();
            }
        });
    });
    
    document.getElementById('logout-button')?.addEventListener('click', () => auth.signOut());
});