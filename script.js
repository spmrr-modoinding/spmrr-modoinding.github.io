document.addEventListener('DOMContentLoaded', () => {
  // Fungsi aktifkan tab
  function activateTab(tabId) {
    document.querySelectorAll('.tab-button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === tabId);
    });
  }

  // Tambah tombol Statistik ke nav
  const nav = document.querySelector('.nav');
  const statistikBtn = document.createElement('button');
  statistikBtn.className = 'tab-button';
  statistikBtn.setAttribute('data-tab', 'statistik');
  statistikBtn.textContent = 'Statistik Umat';
  nav.appendChild(statistikBtn);

  // Tambahkan isi tab Statistik
  const statistikSection = document.createElement('section');
  statistikSection.className = 'tab-content';
  statistikSection.id = 'statistik';
  statistikSection.innerHTML = `
    <h2>Statistik Umat per Tahun</h2>
    <p>Statistik umat akan dimuat di sini.</p>
  `;
  document.querySelector('main').appendChild(statistikSection);

  // Pasang event listener SEKARANG untuk semua tombol, termasuk yang baru ditambahkan
  nav.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      activateTab(button.dataset.tab);
    });
  });

  // Aktifkan tab pertama
  const firstTab = nav.querySelector('.tab-button');
  if (firstTab) {
    activateTab(firstTab.dataset.tab);
  }

  // Warna status pastor
  document.querySelectorAll('.indicator').forEach(indicator => {
    const text = indicator.textContent.toLowerCase();
    if (text.includes('tidak')) {
      indicator.classList.remove('green');
      indicator.classList.add('red');
      indicator.textContent = "Tidak Ada";
    } else if (text.includes('ada')) {
      indicator.classList.remove('red');
      indicator.classList.add('green');
      indicator.textContent = "Ada";
    }
  });

  // Angelus
  setInterval(() => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    if ((h === 6 || h === 12 || h === 18) && m === 0) {
      alert("🔔 Waktu untuk Doa Angelus. Mari kita berdoa.");
    }
  }, 60000);
});
