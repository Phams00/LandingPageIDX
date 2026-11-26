
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('siteSearch');
  const searchResults = document.getElementById('searchResults');
  const videoModal = document.getElementById('videoModal');
  const galleryLightbox = document.getElementById('galleryLightbox');
  const galleryTriggers = [...document.querySelectorAll('[data-gallery-image]')];
  const galleryLightboxImage = galleryLightbox.querySelector('.gallery-lightbox-image');
  const galleryLightboxCaption = galleryLightbox.querySelector('.gallery-lightbox-caption');
  const backTop = document.getElementById('backTop');
  let activeGalleryIndex = 0;

  // Mobile navigation: buka/tutup dan tutup setelah tautan dipilih.
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('open', !expanded);
  });

  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  // Search hanya menampilkan bagian halaman yang cocok dengan kata kunci.
  const searchableSections = [...document.querySelectorAll('main section[id]')].map(section => ({
    id: section.id,
    title: section.querySelector('h1,h2')?.textContent.trim() || section.id,
    text: section.innerText.toLowerCase()
  }));

  function openSearch() {
    searchOverlay.classList.add('open');
    searchOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    setTimeout(() => searchInput.focus(), 50);
  }

  function closeSearch() {
    searchOverlay.classList.remove('open');
    searchOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  document.getElementById('searchTrigger').addEventListener('click', openSearch);
  document.getElementById('closeSearch').addEventListener('click', closeSearch);

  searchOverlay.addEventListener('click', e => {
    if (e.target === searchOverlay) closeSearch();
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      searchResults.textContent = 'Ketik kata kunci untuk mencari bagian halaman.';
      return;
    }

    const matches = searchableSections.filter(item =>
      item.text.includes(query) ||
      item.title.toLowerCase().includes(query)
    );

    searchResults.innerHTML = matches.length
      ? matches.map(item =>
          `<a href="#${item.id}" data-result="${item.id}">
            ${escapeHTML(item.title)}
            <span aria-hidden="true">→</span>
          </a>`
        ).join('')
      : 'Tidak ada bagian yang cocok. Coba kata kunci lain.';

    searchResults.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => closeSearch())
    );
  });

  function escapeHTML(value) {
    return value.replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[char]));
  }

  // Tab visi, misi, dan target.
  const tabContent = document.getElementById('tabContent');

  const tabData = {
    vision: {
      icon: 'flag',
      title: 'Menjadi bursa yang kompetitif dengan kredibilitas tingkat dunia.',
      text: 'Visi ini menjadi arah pengembangan infrastruktur, layanan, dan tata kelola pasar modal Indonesia.'
    },
    mission: {
      icon: 'rocket_launch',
      title: 'Menciptakan infrastruktur pasar modal yang andal dan terpercaya.',
      text: 'Menyediakan layanan perdagangan, pencatatan, dan edukasi yang berkualitas bagi seluruh pemangku kepentingan.'
    },
    target: {
      icon: 'track_changes',
      title: 'Target pengembangan pasar modal 2026.',
      text: 'Arah target ilustratif pada desain: pencatatan 1.000+ perusahaan dan perluasan basis investor hingga 20 juta SID.'
    }
  };

  document.querySelectorAll('.tab-btn').forEach(button =>
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(item =>
        item.classList.toggle('active', item === button)
      );

      const data = tabData[button.dataset.tab];

      tabContent.innerHTML = `
        <span class="material-symbols-outlined">${data.icon}</span>
        <h3>${data.title}</h3>
        <p>${data.text}</p>
      `;
    })
  );

  // Grafik memakai data ilustrasi lokal, bukan API bursa.
  const chart = document.getElementById('marketChart');

  const chartSets = {
    '1D': {
      value: '7,328.45',
      change: '+0.58%',
      label: 'Hari ini',
      points: 'M0 180 C45 165 55 175 90 140 S145 160 180 120 S235 135 270 105 S330 125 365 92 S420 110 455 70 S510 95 545 62 S600 76 635 38 S675 52 700 20'
    },
    '1W': {
      value: '7,301.20',
      change: '+1.12%',
      label: '1 minggu',
      points: 'M0 165 C55 185 70 130 115 145 S165 100 210 125 S270 95 320 115 S370 65 420 92 S475 75 520 55 S600 75 650 30 S680 35 700 18'
    },
    '1M': {
      value: '7,245.80',
      change: '+2.34%',
      label: '1 bulan',
      points: 'M0 190 C55 160 85 180 125 145 S180 155 220 110 S270 130 320 100 S380 120 420 80 S480 100 530 65 S590 80 640 35 S680 50 700 22'
    },
    '1Y': {
      value: '7,328.45',
      change: '+4.12%',
      label: '1 tahun',
      points: 'M0 195 C45 175 70 188 110 155 S165 175 205 125 S255 145 300 115 S360 130 405 90 S460 110 505 78 S565 90 610 50 S670 62 700 20'
    },
    'YTD': {
      value: '7,328.45',
      change: '+4.12%',
      label: 'Year to date',
      points: 'M0 190 C40 170 80 185 120 140 S180 160 220 120 S280 132 320 100 S380 112 420 85 S480 98 520 60 S580 82 620 45 S680 55 700 20'
    }
  };

  document.querySelectorAll('.period-btn').forEach(button =>
    button.addEventListener('click', () => {
      document.querySelectorAll('.period-btn').forEach(item =>
        item.classList.toggle('active', item === button)
      );

      const data = chartSets[button.dataset.period];

      document.getElementById('chartValue').textContent = data.value;
      document.getElementById('chartPeriodLabel').textContent = data.label;

      document.querySelector('.chart-change').innerHTML =
        `▲ ${data.change} <small id="chartPeriodLabel">${data.label}</small>`;

      const line = chart.querySelector('.chart-line');
      const area = chart.querySelector('.chart-area');

      line.setAttribute('d', data.points);
      area.setAttribute('d', `${data.points} L700 230 L0 230Z`);
    })
  );

  // Modal video.
  function showVideo(title) {
    document.getElementById('videoTitle').textContent = title;
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeVideo() {
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
  }

  document.querySelectorAll('[data-video]').forEach(button =>
    button.addEventListener('click', () =>
      showVideo(button.dataset.video)
    )
  );

  document.getElementById('closeVideo').addEventListener('click', closeVideo);

  videoModal.addEventListener('click', e => {
    if (e.target === videoModal) closeVideo();
  });

  function showGalleryImage(index) {
    activeGalleryIndex = (index + galleryTriggers.length) % galleryTriggers.length;
    const trigger = galleryTriggers[activeGalleryIndex];
    const image = trigger.querySelector('img');

    galleryLightboxImage.src = image.src;
    galleryLightboxImage.alt = image.alt;
    galleryLightboxCaption.textContent = trigger.dataset.caption;
    galleryLightbox.classList.add('open');
    galleryLightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
  }

  function closeGalleryLightbox() {
    galleryLightbox.classList.remove('open');
    galleryLightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    galleryTriggers[activeGalleryIndex].focus();
  }

  galleryTriggers.forEach((trigger, index) =>
    trigger.addEventListener('click', () => showGalleryImage(index))
  );

  galleryLightbox.querySelector('.gallery-lightbox-close')
    .addEventListener('click', closeGalleryLightbox);
  galleryLightbox.querySelector('.gallery-lightbox-prev')
    .addEventListener('click', () => showGalleryImage(activeGalleryIndex - 1));
  galleryLightbox.querySelector('.gallery-lightbox-next')
    .addEventListener('click', () => showGalleryImage(activeGalleryIndex + 1));
  galleryLightbox.addEventListener('click', e => {
    if (e.target === galleryLightbox) closeGalleryLightbox();
  });

  // Pilihan bahasa.
  document.querySelectorAll('.lang-btn').forEach(button =>
    button.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(item =>
        item.classList.toggle('active', item === button)
      );

      if (button.dataset.lang === 'en') {
        alert('English content is not available yet. The page is currently displayed in Indonesian.');

        document.querySelectorAll('.lang-btn').forEach(item =>
          item.classList.toggle('active', item.dataset.lang === 'id')
        );
      }
    })
  );

  // Tombol kembali ke atas.
  window.addEventListener('scroll', () =>
    backTop.classList.toggle('show', window.scrollY > 450),
    { passive: true }
  );

  backTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  // Sorot navigasi sesuai bagian yang sedang terlihat.
  const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link =>
          link.classList.toggle(
            'active',
            link.hash === `#${entry.target.id}`
          )
        );
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  document.querySelectorAll('main section[id]').forEach(section =>
    observer.observe(section)
  );

  // Tutup modal dengan tombol Escape.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeSearch();
      closeVideo();
      if (galleryLightbox.classList.contains('open')) closeGalleryLightbox();
    } else if (galleryLightbox.classList.contains('open') && e.key === 'ArrowRight') {
      showGalleryImage(activeGalleryIndex + 1);
    } else if (galleryLightbox.classList.contains('open') && e.key === 'ArrowLeft') {
      showGalleryImage(activeGalleryIndex - 1);
    }
  });
});
