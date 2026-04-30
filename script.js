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

  /* === 1. Active section detection (scroll-anchor based) === */
  const initActiveNav = () => {
    const sections = Array.from(document.querySelectorAll('main .section[id]'));
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

    let pending = false;
    const update = () => {
      pending = false;
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const viewport = window.innerHeight;
      const docHeight = Math.max(
        document.documentElement.scrollHeight,
        document.body.scrollHeight
      );

      // Near bottom: force last section active so Foto highlights when scrolled all the way down
      if (scrollY + viewport >= docHeight - 40) {
        setActive(sections[sections.length - 1].id);
        return;
      }

      // Otherwise: pick the most-recent section whose top has crossed the 30%-from-top anchor line
      const anchor = scrollY + viewport * 0.30;
      let activeId = sections[0].id;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop <= anchor) {
          activeId = sections[i].id;
        } else {
          break;
        }
      }
      setActive(activeId);
    };

    const onScroll = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
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

  /* === 5. CRT toggle (default ON; click disables all CRT visuals; persisted) === */
  const initCrt = () => {
    let crtOff = false;
    try { crtOff = localStorage.getItem('digitalsoul-crt') === 'off'; } catch (e) {}
    if (crtOff) document.body.classList.add('crt-off');

    const button = document.querySelector('.crt-toggle');
    if (!button) return;
    if (crtOff) button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      const off = document.body.classList.toggle('crt-off');
      button.setAttribute('aria-pressed', off ? 'false' : 'true');
      try { localStorage.setItem('digitalsoul-crt', off ? 'off' : 'on'); } catch (e) {}
    });
  };

  /* === 6. Boot-up sequence + power-on + first-visit language picker === */
  const HDD_AUDIO_SRC = '/assets/audio/hdd-loop.mp3';

  const fadeAudio = (audio, fromVol, toVol, durationMs, onDone) => {
    if (!audio) { if (onDone) onDone(); return; }
    const steps = Math.max(1, Math.round(durationMs / 30));
    const delta = (toVol - fromVol) / steps;
    let i = 0;
    audio.volume = Math.max(0, Math.min(1, fromVol));
    const tick = setInterval(() => {
      i += 1;
      let v = fromVol + delta * i;
      v = Math.max(0, Math.min(1, v));
      try { audio.volume = v; } catch (e) {}
      if (i >= steps) {
        clearInterval(tick);
        if (onDone) onDone();
      }
    }, 30);
  };

  const initBootUp = () => {
    if (reduceMotion.matches) return;

    let langStored = null;
    let sessionBooted = false;
    try {
      langStored = localStorage.getItem('digitalsoul-lang');
      sessionBooted = sessionStorage.getItem('digitalsoul-booted') === '1';
    } catch (e) {}

    const showPicker = !langStored;
    if (sessionBooted && !showPicker) return;

    document.body.classList.add('bootup-active');
    document.body.style.overflow = 'hidden';

    /* === Phase 1: POWER ON pre-screen (required for audio autoplay unlock) === */
    const powerup = document.createElement('div');
    powerup.className = 'powerup';
    powerup.setAttribute('aria-hidden', 'true');
    powerup.innerHTML =
      '<button type="button" class="powerup__button" autofocus>[ POWER ON ]</button>' +
      '<p class="powerup__hint">click to boot &nbsp;·&nbsp; clicca per avviare</p>';
    document.body.appendChild(powerup);

    const startBoot = () => {
      // Remove power-on screen with fade
      powerup.classList.add('is-fading');
      setTimeout(() => { if (powerup.parentNode) powerup.parentNode.removeChild(powerup); }, 280);

      // Try to play HDD audio (silently fail if file missing or autoplay blocked)
      let audio = null;
      try {
        audio = new Audio(HDD_AUDIO_SRC);
        audio.loop = true;
        audio.volume = 0;
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(() => {
            fadeAudio(audio, 0, 0.4, 250);
          }).catch(() => { audio = null; });
        }
      } catch (e) { audio = null; }

      // Schedule audio fade-out shortly before boot ends / picker stabilizes
      const audioFadeAt = showPicker ? 2700 : 3500;
      setTimeout(() => {
        if (!audio) return;
        fadeAudio(audio, audio.volume, 0, 600, () => {
          try { audio.pause(); audio.src = ''; } catch (e) {}
        });
      }, audioFadeAt);

      showBootupOverlay();
    };

    const onPowerKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        startBoot();
        document.removeEventListener('keydown', onPowerKey);
      }
    };
    powerup.querySelector('.powerup__button').addEventListener('click', () => {
      startBoot();
      document.removeEventListener('keydown', onPowerKey);
    });
    document.addEventListener('keydown', onPowerKey);

    /* === Phase 2: Boot-up overlay (existing logic, extracted) === */
    const showBootupOverlay = () => {
    const overlay = document.createElement('div');
    overlay.className = 'bootup' + (showPicker ? ' bootup--picker' : '');
    overlay.setAttribute('aria-hidden', 'true');

    let html =
      '<pre class="bootup__lines">' +
        '<span class="bootup__line">&gt; INITIALIZING DIGITAL_SOUL.OS v2.6 ...</span>' +
        '<span class="bootup__line">&gt; LOADING USER PROFILE: LUCA_PORFIDO &nbsp;[OK]</span>' +
        '<span class="bootup__line">&gt; MOUNTING MODULES: SAP / FRONTEND / MUSIC / PHOTO &nbsp;[OK]</span>' +
        '<span class="bootup__line">&gt; ESTABLISHING UPLINK ............ [OK]</span>' +
        '<span class="bootup__line">&gt; CALIBRATING PHOSPHOR DISPLAY .... [OK]</span>' +
        '<span class="bootup__line">&gt; SYSTEM ONLINE<span class="cursor-blink">_</span></span>' +
      '</pre>';

    if (showPicker) {
      html +=
        '<div class="bootup__picker">' +
          '<p class="bootup__picker-prompt">[ ! ] SELECT LANGUAGE</p>' +
          '<div class="bootup__picker-options">' +
            '<button type="button" class="bootup__lang" data-lang="en">' +
              '<span class="bootup__lang-key">[ 1 ]</span>' +
              '<span class="bootup__lang-name">ENGLISH</span>' +
            '</button>' +
            '<button type="button" class="bootup__lang" data-lang="it">' +
              '<span class="bootup__lang-key">[ 2 ]</span>' +
              '<span class="bootup__lang-name">ITALIANO</span>' +
            '</button>' +
          '</div>' +
          '<p class="bootup__picker-hint">press 1 / 2 or click  ·  premi 1 / 2 o clicca</p>' +
        '</div>';
    } else {
      html += '<span class="bootup__hint">click anywhere to continue</span>';
    }

    overlay.innerHTML = html;
    document.body.appendChild(overlay);

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      overlay.classList.add('is-fading');
      setTimeout(() => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        document.body.style.overflow = '';
        document.body.classList.remove('bootup-active');
      }, 450);
      try { sessionStorage.setItem('digitalsoul-booted', '1'); } catch (e) {}
    };

    const choose = (lang) => {
      try { localStorage.setItem('digitalsoul-lang', lang); } catch (e) {}
      try { sessionStorage.setItem('digitalsoul-booted', '1'); } catch (e) {}

      const currentLang = (document.documentElement.lang || 'en').toLowerCase();
      if (lang === currentLang) {
        dismiss();
        return;
      }
      const altLink = document.querySelector('link[hreflang="' + lang + '"]');
      if (altLink && altLink.href) {
        window.location.href = altLink.href;
      } else {
        dismiss();
      }
    };

    if (showPicker) {
      overlay.querySelectorAll('.bootup__lang').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          choose(btn.dataset.lang);
        });
      });
      const onKey = (e) => {
        if (e.key === '1') { e.preventDefault(); choose('en'); }
        else if (e.key === '2') { e.preventDefault(); choose('it'); }
      };
      document.addEventListener('keydown', onKey);
    } else {
      overlay.addEventListener('click', dismiss);
      const onKey = (e) => {
        if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
          dismiss();
          document.removeEventListener('keydown', onKey);
        }
      };
      document.addEventListener('keydown', onKey);
      setTimeout(dismiss, 4000);
    }
    };
  };

  /* === Boot === */
  onReady(() => {
    document.body.classList.add('js-ready');
    initCrt();
    initBootUp();
    initActiveNav();
    initSpotlight();
    initLightbox();
    initFadeIn();
  });
})();
