document.addEventListener('DOMContentLoaded', () => {
  // Tambahkan tombol Statistik dulu
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

  // Setelah semua tab sudah lengkap, baru pasang event handler
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  function activateTab(tabId) {
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    tabContents.forEach(content => {
      content.classList.toggle('active', content.id === tabId);
    });
  }

  // Event: klik tab
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      activateTab(button.dataset.tab);
    });
  });

  // Aktifkan tab pertama
  if (tabButtons.length > 0) {
    activateTab(tabButtons[0].dataset.tab);
  }

  // Update warna indikator kehadiran
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

  // Pengingat Angelus otomatis
  setInterval(() => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    if ((h === 6 || h === 12 || h === 18) && m === 0) {
      alert("🔔 Waktu untuk Doa Angelus. Mari kita berdoa.");
    }
  }, 60000);
});
