document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.firestore();
    const auth = firebase.auth();
    let umatChart = null;
    let currentEditAnnouncementId = null;
    let currentEditTpeId = null;

    // --- HELPER UI ---
    function initTinyMCE() {
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

    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }

    const navTabs = document.querySelectorAll('.nav-tab-btn');
    const sections = document.querySelectorAll('.management-section');
    const pageTitle = document.getElementById('page-title');

    navTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            tab.classList.add('active');
            const targetId = tab.dataset.target;
            document.getElementById(targetId).classList.add('active');
            
            const titleText = tab.querySelector('span').innerText;
            if(pageTitle) pageTitle.innerText = titleText;
            
            if(window.innerWidth <= 768) sidebar.classList.remove('active');
        });
    });

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
        const annSnap = await db.collection('announcements').get();
        document.getElementById('summary-announcements-count').textContent = annSnap.size;
        
        const statSnap = await db.collection('parish_stats').get();
        let total = 0;
        statSnap.forEach(doc => total += (doc.data().laki_laki + doc.data().perempuan) || 0);
        document.getElementById('summary-umat-total').textContent = total.toLocaleString();
    };

    // ===========================================
    // 1. TPE LOGIC
    // ===========================================
    
    document.getElementById('q-add-tpe-btn').addEventListener('click', () => {
        document.querySelector('[data-target="tpe-section"]').click();
        setTimeout(() => document.getElementById('add-tpe-btn').click(), 200);
    });

    document.getElementById('add-tpe-btn').addEventListener('click', () => {
        currentEditTpeId = null;
        document.getElementById('tpe-form').reset();
        document.getElementById('tpe-form-message').textContent = '';
        document.getElementById('tpe-modal').classList.remove('hidden');
        initTinyMCE();
    });

    function listenToTPEs() {
        const tbody = document.getElementById('tpe-table-body');
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">Memuat...</td></tr>';
        
        db.collection('tata_perayaan_mingguan').onSnapshot(snap => {
            if(snap.empty) { tbody.innerHTML = '<tr><td colspan="3" class="text-center">Belum ada data TPE.</td></tr>'; return; }
            
            const sorted = snap.docs.sort((a,b) => b.id.localeCompare(a.id));
            
            let html = '';
            sorted.forEach(doc => {
                const d = doc.data();
                html += `
                    <tr>
                        <td><strong>${d.tanggal_display}</strong><br><small style="color:#888">${doc.id}</small></td>
                        <td>${d.nama_perayaan}</td>
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

    document.getElementById('tpe-table-body').addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if(!btn) return;
        const id = btn.dataset.id;

        if(btn.classList.contains('delete-tpe')) {
            if(confirm('Hapus TPE tanggal ' + id + '?')) await db.collection('tata_perayaan_mingguan').doc(id).delete();
        }

        if(btn.classList.contains('edit-tpe')) {
            const doc = await db.collection('tata_perayaan_mingguan').doc(id).get();
            if(!doc.exists) return;
            const data = doc.data();
            currentEditTpeId = id;
            
            document.getElementById('tpe-tanggal').value = id;
            document.getElementById('tpe-nama-perayaan').value = data.nama_perayaan || '';
            document.getElementById('tpe-tahun-liturgi').value = data.tahun_liturgi || '';
            document.getElementById('tpe-tema').value = data.tema || '';

            const tpe = data.tata_perayaan || {};
            const fields = ['antifon-pembuka', 'doa-kolekta', 'bacaan-1', 'mazmur', 'bacaan-2', 'bait-injil', 'bacaan-injil', 'doa-umat', 'doa-persembahan', 'antifon-komuni', 'doa-sesudah-komuni'];
            
            fields.forEach(f => {
                let key = f.replace(/-/g, '_'); 
                if(f === 'mazmur') key = 'mazmur_tanggapan';
                if(f === 'bait-injil') key = 'bait_pengantar_injil';
                document.getElementById('tpe-'+f).value = tpe[key] || '';
            });

            document.getElementById('tpe-modal').classList.remove('hidden');
            initTinyMCE();
        }
    });

    document.getElementById('tpe-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const msg = document.getElementById('tpe-form-message');
        const dateVal = document.getElementById('tpe-tanggal').value;
        if(!dateVal) { msg.textContent = 'Tanggal wajib diisi'; return; }
        
        msg.textContent = 'Menyimpan...';

        const tpeData = {};
        const fields = ['antifon-pembuka', 'doa-kolekta', 'bacaan-1', 'mazmur', 'bacaan-2', 'bait-injil', 'bacaan-injil', 'doa-umat', 'doa-persembahan', 'antifon-komuni', 'doa-sesudah-komuni'];
        
        fields.forEach(f => {
            const editor = tinymce.get('tpe-'+f);
            const val = editor ? editor.getContent() : document.getElementById('tpe-'+f).value;
            let key = f.replace(/-/g, '_');
            if(f === 'mazmur') key = 'mazmur_tanggapan';
            if(f === 'bait-injil') key = 'bait_pengantar_injil';
            tpeData[key] = val;
        });

        const displayDate = new Date(dateVal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

        const payload = {
            tanggal_display: displayDate,
            nama_perayaan: document.getElementById('tpe-nama-perayaan').value,
            tahun_liturgi: document.getElementById('tpe-tahun-liturgi').value,
            tema: document.getElementById('tpe-tema').value,
            tata_perayaan: tpeData
        };

        try {
            await db.collection('tata_perayaan_mingguan').doc(dateVal).set(payload);
            msg.textContent = 'Berhasil tersimpan!';
            msg.style.color = 'green';
            setTimeout(() => {
                document.getElementById('tpe-modal').classList.add('hidden');
                tinymce.remove();
            }, 1000);
        } catch(err) {
            msg.textContent = 'Error: ' + err.message;
            msg.style.color = 'red';
        }
    });


    // ===========================================
    // 2. ANNOUNCEMENT & STATS LOGIC
    // ===========================================
    document.getElementById('q-add-announcement-btn').addEventListener('click', () => {
        document.querySelector('[data-target="announcements-section"]').click();
        setTimeout(() => document.getElementById('add-announcement-btn').click(), 200);
    });

    document.getElementById('add-announcement-btn').addEventListener('click', () => {
        currentEditAnnouncementId = null;
        document.getElementById('announcement-form').reset();
        document.getElementById('announcement-modal').classList.remove('hidden');
        initTinyMCE();
    });

    function listenToAnnouncements() {
        const tbody = document.getElementById('announcements-table-body');
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
                        <td><strong>${d.judul}</strong></td>
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

    document.getElementById('announcements-table-body').addEventListener('click', async (e) => {
        const btn = e.target.closest('button');
        if(!btn) return;
        const id = btn.dataset.id;

        if(btn.classList.contains('delete-ann')) {
            if(confirm('Hapus pengumuman ini?')) await db.collection('announcements').doc(id).delete();
        }
        if(btn.classList.contains('edit-ann')) {
            const doc = await db.collection('announcements').doc(id).get();
            if(!doc.exists) return;
            const d = doc.data();
            currentEditAnnouncementId = id;
            document.getElementById('ann-judul').value = d.judul;
            document.getElementById('ann-tanggal').value = d.tanggal;
            document.getElementById('ann-jam').value = d.jam;
            document.getElementById('ann-lokasi').value = d.lokasi;
            document.getElementById('ann-catatan').value = d.catatan;
            
            document.getElementById('announcement-modal').classList.remove('hidden');
            initTinyMCE(); 
        }
    });

    document.getElementById('announcement-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const editor = tinymce.get('ann-catatan');
        const content = editor ? editor.getContent() : document.getElementById('ann-catatan').value;
        
        const data = {
            judul: document.getElementById('ann-judul').value,
            tanggal: document.getElementById('ann-tanggal').value,
            jam: document.getElementById('ann-jam').value,
            lokasi: document.getElementById('ann-lokasi').value,
            catatan: content
        };

        if(currentEditAnnouncementId) {
            await db.collection('announcements').doc(currentEditAnnouncementId).update(data);
        } else {
            data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection('announcements').add(data);
        }
        document.getElementById('announcement-modal').classList.add('hidden');
        tinymce.remove();
    });

    function listenToParishStats() {
        const tbody = document.getElementById('stats-table-body');
        const tfoot = document.getElementById('stats-table-footer');
        
        db.collection('parish_stats').orderBy('order').onSnapshot(snap => {
            if(snap.empty) { tbody.innerHTML = '<tr><td colspan="7">Kosong</td></tr>'; return; }
            let h = '';
            let tKK=0, tL=0, tP=0;
            let labels = [], chartData = [];

            snap.forEach(doc => {
                const d = doc.data();
                const total = (d.laki_laki||0) + (d.perempuan||0);
                tKK += d.kk||0; tL += d.laki_laki||0; tP += d.perempuan||0;
                labels.push(d.name.replace('Stasi','').trim());
                chartData.push(total);

                h += `
                    <tr>
                        <td>${d.order}</td>
                        <td>${d.name}</td>
                        <td>${d.kk}</td>
                        <td>${d.laki_laki}</td>
                        <td>${d.perempuan}</td>
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

    document.getElementById('stats-table-body').addEventListener('click', async (e) => {
        const btn = e.target.closest('.edit-stat');
        if(!btn) return;
        const id = btn.dataset.id;
        const doc = await db.collection('parish_stats').doc(id).get();
        if(!doc.exists) return;
        const d = doc.data();
        
        document.getElementById('stat-doc-id').value = id;
        document.getElementById('stat-kk').value = d.kk;
        document.getElementById('stat-laki').value = d.laki_laki;
        document.getElementById('stat-perempuan').value = d.perempuan;
        document.getElementById('stat-modal').classList.remove('hidden');
    });

    document.getElementById('stat-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('stat-doc-id').value;
        await db.collection('parish_stats').doc(id).update({
            kk: parseInt(document.getElementById('stat-kk').value),
            laki_laki: parseInt(document.getElementById('stat-laki').value),
            perempuan: parseInt(document.getElementById('stat-perempuan').value)
        });
        document.getElementById('stat-modal').classList.add('hidden');
    });

    function renderChart(labels, data) {
        const ctx = document.getElementById('umat-chart');
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

    document.querySelectorAll('.close-modal-btn, .modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            if(e.target === el) {
                document.querySelectorAll('.modal-overlay').forEach(m => m.classList.add('hidden'));
                tinymce.remove();
            }
        });
    });
    document.getElementById('logout-button').addEventListener('click', () => auth.signOut());
});