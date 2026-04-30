/* DiGiT@L SouL — script.js
   All progressive enhancement. The site must work without this file. */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverCapable = window.matchMedia('(hover: hover)');

  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  /* === 1. Active section detection (IntersectionObserver) === */
  const initActiveNav = () => {
    if (!('IntersectionObserver' in window)) return;
    const sections = document.querySelectorAll('main .section[id]');
    const navLinks = document.querySelectorAll('.sidebar__nav .nav-link');
    if (!sections.length || !navLinks.length) return;

    const linksById = new Map();
    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      if (href.startsWith('#')) linksById.set(href.slice(1), link);
    });

    const setActive = (id) => {
      navLinks.forEach((link) => link.classList.remove('is-active'));
      const active = linksById.get(id);
      if (active) active.classList.add('is-active');
    };

    const visible = new Map();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visible.set(entry.target.id, entry.intersectionRatio);
      });
      let topId = null;
      let topRatio = 0;
      visible.forEach((ratio, id) => {
        if (ratio > topRatio) { topRatio = ratio; topId = id; }
      });
      if (topId && topRatio > 0) setActive(topId);
    }, {
      rootMargin: '-30% 0px -50% 0px',
      threshold: [0, 0.1, 0.25, 0.5, 0.75, 1]
    });

    sections.forEach((section) => observer.observe(section));
  };

  /* === 2. Spotlight cursor === */
  const initSpotlight = () => {
    if (!hoverCapable.matches || reduceMotion.matches) return;
    const spotlight = document.querySelector('.spotlight');
    if (!spotlight) return;
    document.body.classList.add('has-spotlight');
    let frame = 0;
    let lastX = 0;
    let lastY = 0;
    const apply = () => {
      frame = 0;
      spotlight.style.setProperty('--mouse-x', lastX + 'px');
      spotlight.style.setProperty('--mouse-y', lastY + 'px');
    };
    window.addEventListener('mousemove', (event) => {
      lastX = event.clientX;
      lastY = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    }, { passive: true });
  };

  /* === 3. Photo lightbox === */
  const initLightbox = () => {
    const grid = document.querySelector('.photo-grid');
    if (!grid) return;

    let lightbox = null;
    let lastFocused = null;

    const buildLightbox = () => {
      const node = document.createElement('div');
      node.className = 'lightbox';
      node.setAttribute('role', 'dialog');
      node.setAttribute('aria-modal', 'true');
      node.setAttribute('aria-label', 'Photo viewer');
      node.innerHTML =
        '<button type="button" class="lightbox__close" aria-label="Close">×</button>' +
        '<img class="lightbox__image" alt="">';
      document.body.appendChild(node);
      node.addEventListener('click', (event) => {
        if (event.target === node || event.target.classList.contains('lightbox__close')) {
          closeLightbox();
        }
      });
      return node;
    };

    const openLightbox = (href, alt) => {
      if (!lightbox) lightbox = buildLightbox();
      const img = lightbox.querySelector('.lightbox__image');
      img.src = href;
      img.alt = alt || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      lastFocused = document.activeElement;
      const closeBtn = lightbox.querySelector('.lightbox__close');
      if (closeBtn) closeBtn.focus();
    };

    const closeLightbox = () => {
      if (!lightbox) return;
      lightbox.classList.remove('is-open');
      const img = lightbox.querySelector('.lightbox__image');
      if (img) img.src = '';
      document.body.style.overflow = '';
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    };

    grid.addEventListener('click', (event) => {
      const link = event.target.closest('.photo-link');
      if (!link) return;
      event.preventDefault();
      const inner = link.querySelector('img');
      openLightbox(link.getAttribute('href'), inner ? inner.getAttribute('alt') : '');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && lightbox && lightbox.classList.contains('is-open')) {
        closeLightbox();
      }
    });
  };

  /* === 4. Scroll-triggered fade-in === */
  const initFadeIn = () => {
    if (reduceMotion.matches) return;
    if (!('IntersectionObserver' in window)) return;
    const sections = document.querySelectorAll('.section');
    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.05
    });

    sections.forEach((section) => observer.observe(section));
  };

  /* === 5. Easter egg (CRT mode) === */
  const initEasterEgg = () => {
    const button = document.querySelector('.footer__easter-egg');
    if (!button) return;
    button.addEventListener('click', () => {
      const enabled = document.body.classList.toggle('crt-mode');
      button.setAttribute('aria-pressed', enabled ? 'true' : 'false');
    });
  };

  /* === 6. Boot-up sequence (once per session) === */
  const initBootUp = () => {
    if (reduceMotion.matches) return;
    try {
      if (sessionStorage.getItem('digitalsoul-booted') === '1') return;
    } catch (e) { /* sessionStorage may be unavailable */ }

    const overlay = document.createElement('div');
    overlay.className = 'bootup';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML =
      '<pre class="bootup__lines">' +
        '<span class="bootup__line">&gt; INITIALIZING DIGITAL_SOUL.OS v2.6 ...</span>' +
        '<span class="bootup__line">&gt; LOADING USER PROFILE: LUCA_ZERBINATI &nbsp;[OK]</span>' +
        '<span class="bootup__line">&gt; MOUNTING MODULES: SAP / FRONTEND / MUSIC / PHOTO &nbsp;[OK]</span>' +
        '<span class="bootup__line">&gt; ESTABLISHING UPLINK ............ [OK]</span>' +
        '<span class="bootup__line">&gt; CALIBRATING PHOSPHOR DISPLAY .... [OK]</span>' +
        '<span class="bootup__line">&gt; SYSTEM ONLINE_</span>' +
      '</pre>' +
      '<span class="bootup__hint">click anywhere to continue</span>';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      overlay.classList.add('is-fading');
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.body.style.overflow = '';
      }, 450);
      try { sessionStorage.setItem('digitalsoul-booted', '1'); } catch (e) {}
    };

    overlay.addEventListener('click', dismiss);
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        dismiss();
        document.removeEventListener('keydown', onKey);
      }
    };
    document.addEventListener('keydown', onKey);
    setTimeout(dismiss, 3000);
  };

  /* === Boot === */
  onReady(() => {
    document.body.classList.add('js-ready');
    initBootUp();
    initActiveNav();
    initSpotlight();
    initLightbox();
    initFadeIn();
    initEasterEgg();
  });
})();
