/* ============================================================
   Pathivara Jewellers — Main JavaScript
   Description: Handles navbar, scroll reveals, form, gallery,
                product filter, and smooth interactions.
   ============================================================ */

/* ============================================================
   1. NAVBAR — Scroll-aware + Mobile Drawer
   ============================================================ */
(function initNavbar() {
  const navbar  = document.querySelector('.navbar');
  const toggle  = document.querySelector('.nav-toggle');
  const drawer  = document.querySelector('.nav-drawer');

  if (!navbar) return;

  // Determine if page has a transparent hero
  const hasHero = document.querySelector('.hero');

  // Pages without a hero always show solid navbar
  if (!hasHero) {
    navbar.classList.add('solid');
  }

  // Scroll handler — adds .scrolled when past 60px
  function handleScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      if (!navbar.classList.contains('solid')) {
        navbar.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run once on load

  // Mobile toggle
  if (toggle && drawer) {
    toggle.addEventListener('click', function () {
      const isOpen = drawer.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close drawer when a link is clicked
    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        drawer.classList.remove('open');
        toggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Set active link based on current page
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(function (link) {
    const href = link.getAttribute('href').split('/').pop();
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

/* ============================================================
   2. SCROLL REVEAL — Fade-in elements as they enter viewport
   ============================================================ */
(function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();

/* ============================================================
   3. CONTACT FORM — Basic validation + success state
   ============================================================ */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.querySelector('.form-success');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Simple required-field check
    let valid = true;
    form.querySelectorAll('[required]').forEach(function (field) {
      if (!field.value.trim()) {
        field.style.borderColor = '#8B2635';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    // Email format check
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.style.borderColor = '#8B2635';
      valid = false;
    }

    if (!valid) return;

    // Simulate submission (replace with real backend)
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending…';
    submitBtn.disabled = true;

    setTimeout(function () {
      form.style.display = 'none';
      if (success) {
        success.style.display = 'block';
      }
    }, 1000);
  });

  // Live border reset on input
  form.querySelectorAll('input, textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      field.style.borderColor = '';
    });
  });
})();

/* ============================================================
   4. GALLERY LIGHTBOX — Simple overlay viewer
   ============================================================ */
(function initGalleryLightbox() {
  const pieces = document.querySelectorAll('.gallery-piece, .gallery-item');
  if (!pieces.length) return;

  // Create lightbox DOM
  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.style.cssText = [
    'position:fixed;inset:0;background:rgba(10,8,5,0.95);',
    'display:none;align-items:center;justify-content:center;',
    'z-index:9999;padding:40px;'
  ].join('');

  const img = document.createElement('img');
  img.style.cssText = 'max-width:90vw;max-height:85vh;object-fit:contain;';

  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = [
    'position:absolute;top:24px;right:32px;background:none;border:none;',
    'color:#F8F4ED;font-size:2.5rem;line-height:1;opacity:0.7;transition:opacity 0.2s;'
  ].join('');
  closeBtn.addEventListener('mouseenter', function () { this.style.opacity = '1'; });
  closeBtn.addEventListener('mouseleave', function () { this.style.opacity = '0.7'; });

  overlay.appendChild(closeBtn);
  overlay.appendChild(img);
  document.body.appendChild(overlay);

  function openLightbox(src) {
    img.src = src;
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    overlay.style.display = 'none';
    document.body.style.overflow = '';
    img.src = '';
  }

  pieces.forEach(function (piece) {
    piece.style.cursor = 'zoom-in';
    piece.addEventListener('click', function () {
      const target = piece.querySelector('img');
      if (target) openLightbox(target.src);
    });
  });

  closeBtn.addEventListener('click', closeLightbox);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeLightbox();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });
})();

/* ============================================================
   5. PRODUCT FILTER — Filter cards by category
   ============================================================ */
(function initProductFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.product-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Update active button
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      const category = btn.dataset.filter;

      cards.forEach(function (card) {
        const cardCategory = card.dataset.category || 'all';
        if (category === 'all' || cardCategory === category) {
          card.style.display = '';
          // Re-trigger reveal animation
          card.classList.remove('visible');
          setTimeout(function () { card.classList.add('visible'); }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();

/* ============================================================
   6. PRODUCT IMAGE THUMBNAILS — Swap main image
   ============================================================ */
(function initProductThumbs() {
  const thumbs  = document.querySelectorAll('.product-thumbs img');
  const mainImg = document.querySelector('.product-detail-image .main-img');
  if (!thumbs.length || !mainImg) return;

  thumbs.forEach(function (thumb) {
    thumb.addEventListener('click', function () {
      thumbs.forEach(function (t) { t.classList.remove('active'); });
      thumb.classList.add('active');
      mainImg.src = thumb.src;
    });
  });
})();

/* ============================================================
   7. SMOOTH ANCHOR SCROLL — For same-page links
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ============================================================
   8. STAGGERED CARD REVEALS — Animate grids on load
   ============================================================ */
(function staggerCards() {
  const grids = document.querySelectorAll('.products-grid, .reviews-grid, .testimonials-grid, .gallery-masonry');
  grids.forEach(function (grid) {
    const children = grid.children;
    Array.from(children).forEach(function (child, i) {
      child.style.transitionDelay = (i * 0.08) + 's';
    });
  });
})();
