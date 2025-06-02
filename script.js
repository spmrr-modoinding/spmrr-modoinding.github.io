document.addEventListener('DOMContentLoaded', () => {
  // Ubah warna indikator kehadiran
  const indicators = document.querySelectorAll('.indicator');
  indicators.forEach(indicator => {
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

  // Fungsi aktifkan tab
  function activateTab(tabId) {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    tabContents.forEach(content => {
      content.classList.toggle('active', content.id === tabId);
    });
  }

  // Tambahkan tab Statistik Umat
  const nav = document.querySelector('.nav');
  const statistikBtn = document.createElement('button');
  statistikBtn.className = 'tab-button';
  statistikBtn.setAttribute('data-tab', 'statistik');
  statistikBtn.textContent = 'Statistik Umat';
  nav.appendChild(statistikBtn);

  const statistikSection = document.createElement('section');
  statistikSection.className = 'tab-content';
  statistikSection.id = 'statistik';
  statistikSection.innerHTML = `
    <h2>Statistik Umat per Tahun</h2>
    <p>Statistik umat akan dimuat di sini.</p>
  `;
  document.querySelector('main').appendChild(statistikSection);

  // Aktivasi tab saat klik
  const allButtons = document.querySelectorAll('.tab-button');
  allButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.dataset.tab;
      activateTab(tabId);
    });
  });

  // Aktifkan tab pertama saat load
  if (allButtons.length > 0) {
    activateTab(allButtons[0].dataset.tab);
  }

  // Cek waktu Angelus
  setInterval(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    if ((hours === 6 || hours === 12 || hours === 18) && minutes === 0) {
      alert('🔔 Waktu untuk Doa Angelus. Mari kita berdoa.');
    }
  }, 60000);
});
