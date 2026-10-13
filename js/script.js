/**
 * JUAN MARTÍN VALDIVIESO MORA BOWEN - CV WEB
 * Interactive Functionality & Micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Current Year in Footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Theme Toggle (Dark / Light)
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
  const savedTheme = localStorage.getItem('theme');

  if (savedTheme) {
    document.body.setAttribute('data-theme', savedTheme);
  } else if (!prefersDark.matches) {
    // If system explicitly prefers light
    document.body.setAttribute('data-theme', 'light');
  } else {
    document.body.setAttribute('data-theme', 'dark');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.body.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // 3. Mobile Navigation Menu
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileBtn && mobileNav) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      mobileBtn.classList.toggle('is-active', isOpen);
      mobileBtn.setAttribute('aria-expanded', isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        mobileBtn.classList.remove('is-active');
        mobileBtn.setAttribute('aria-expanded', false);
      });
    });
  }

  // 4. Scroll Spy & Active Nav Highlight
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-link');

  const onScroll = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // 5. Timeline Filtering
  const filterBtns = document.querySelectorAll('.filter-btn');
  const timelineItems = document.querySelectorAll('.timeline-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      timelineItems.forEach(item => {
        const categories = item.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // 6. Number Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const animateCounters = () => {
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const prefix = counter.textContent.startsWith('+') ? '+' : '';
      const suffix = counter.textContent.endsWith('%') ? '%' : (counter.textContent.endsWith('+') ? '+' : '');
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(easeOut * target);

        if (suffix === '%') {
          counter.textContent = `${currentVal}%`;
        } else if (prefix === '+') {
          counter.textContent = `+${currentVal}`;
        } else if (suffix === '+') {
          counter.textContent = `${currentVal}+`;
        } else {
          counter.textContent = currentVal;
        }

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          if (suffix === '%') {
            counter.textContent = `${target}%`;
          } else if (prefix === '+') {
            counter.textContent = `+${target}`;
          } else if (suffix === '+') {
            counter.textContent = `${target}+`;
          } else {
            counter.textContent = target;
          }
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsSection = document.querySelector('.stats-strip');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          animateCounters();
          animated = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  // 7. Lightbox Modal for Gallery
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxBackdrop = document.querySelector('.lightbox-backdrop');
  const galleryCards = document.querySelectorAll('.gallery-card');
  let currentImgIndex = 0;

  if (lightboxModal && lightboxImg) {
    const updateLightbox = (idx) => {
      if (idx < 0) idx = galleryCards.length - 1;
      if (idx >= galleryCards.length) idx = 0;
      currentImgIndex = idx;
      const card = galleryCards[currentImgIndex];
      const fullSrc = card.getAttribute('data-full');

      lightboxImg.src = fullSrc;
      if (lightboxCaption) {
        const caption = card.getAttribute('data-caption');
        lightboxCaption.textContent = caption || '';
      }
    };

    galleryCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        currentImgIndex = index;
        updateLightbox(currentImgIndex);
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        updateLightbox(currentImgIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        updateLightbox(currentImgIndex - 1);
      }
    });
  }

  // 8. Copy to Clipboard Toast
  const copyButtons = document.querySelectorAll('.btn-copy');
  const toast = document.getElementById('toast');
  let toastTimeout;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      if (navigator.clipboard && text) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copiado: ${text}`);
        }).catch(() => {
          showToast(`Número: ${text}`);
        });
      } else if (text) {
        showToast(`Número: ${text}`);
      }
    });
  });

  // 9. Print CV Button
  const printBtn = document.getElementById('print-cv-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

});
