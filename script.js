document.addEventListener('DOMContentLoaded', function () {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  const toggleSidebarButton = document.getElementById('toggleSidebar');
  const sidebar = document.querySelector('.sidebar');

  // Fungsi untuk membuka tab
  function openTab(tabId) {
    tabContents.forEach(content => {
      content.classList.remove('active');
    });

    tabButtons.forEach(button => {
      button.classList.remove('active');
    });

    const selectedContent = document.getElementById(tabId);
    if (selectedContent) {
      selectedContent.classList.add('active');
    }

    const activeButton = document.querySelector(`.tab-button[data-tab="${tabId}"]`);
    if (activeButton) {
      activeButton.classList.add('active');
    }
  }

  // Event listener untuk tombol tab
  tabButtons.forEach(button => {
    button.addEventListener('click', function () {
      const tabId = this.getAttribute('data-tab');
      openTab(tabId);
    });
  });

  // Buka tab default saat halaman dimuat
  const defaultTab = document.querySelector('.tab-button.active') || tabButtons[0];
  if (defaultTab) {
    const tabId = defaultTab.getAttribute('data-tab');
    openTab(tabId);
  }

  // Toggle sidebar untuk mode mobile
  toggleSidebarButton.addEventListener('click', function () {
    sidebar.classList.toggle('show');
  });
});
