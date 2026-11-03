/* =====================================================================
   SIMAG-JKB — Mockup Interactions (vanilla JS, tanpa framework)
   Semua perilaku dipicu lewat atribut data-* agar mudah dibaca developer.
   ---------------------------------------------------------------------
   data-accordion            : wrapper FAQ (.accordion-item > .accordion-trigger)
   data-tabs                 : wrapper tab (.tab[data-tab="id-panel"])
   data-modal-open="idModal" : tombol pembuka modal
   data-modal-close          : tombol penutup modal
   data-toast="Pesan"        : tampilkan notifikasi singkat saat diklik
   data-toggle-password      : tombol show/hide password (di dalam .input-icon)
   data-sidebar-toggle       : tombol buka sidebar (mobile)
   data-nav-toggle           : tombol buka menu navbar publik (mobile)
   .bookmark-btn             : toggle simpan favorit
   .star-input               : input rating 1–5 (data-target="#idInputHidden")
   .segmented                : grup tombol pilihan tunggal
   .chip button              : hapus chip filter
   .reveal                   : animasi muncul saat di-scroll (opsional: [data-reveal-group])
   [data-count]              : animasi hitung naik angka statistik (opsional: [data-suffix])
   [data-typewriter]         : animasi ketik placeholder (pisahkan kata dengan "|")
   ===================================================================== */

(function () {
  'use strict';

  /* ---------- Toast ---------- */
  let toastEl, toastTimer;
  window.showToast = function (message, icon) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.innerHTML = '<span class="material-symbols-outlined">' + (icon || 'check_circle') + '</span><span>' + message + '</span>';
    requestAnimationFrame(function () { toastEl.classList.add('show'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  };

  document.addEventListener('click', function (e) {
    const t = e.target;

    /* Accordion */
    const trigger = t.closest('.accordion-trigger');
    if (trigger) {
      const item = trigger.closest('.accordion-item');
      const wrap = trigger.closest('[data-accordion]');
      if (wrap && wrap.dataset.accordion === 'single') {
        wrap.querySelectorAll('.accordion-item.open').forEach(function (i) { if (i !== item) i.classList.remove('open'); });
      }
      item.classList.toggle('open');
      return;
    }

    /* Tabs */
    const tab = t.closest('[data-tabs] .tab');
    if (tab) {
      const group = tab.closest('[data-tabs]');
      group.querySelectorAll('.tab').forEach(function (b) { b.classList.remove('active'); });
      tab.classList.add('active');
      const scope = document.querySelector(group.dataset.tabs) || document;
      const target = tab.dataset.tab;
      if (target) {
        scope.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.toggle('active', p.id === target); });
      }
      return;
    }

    /* Modal open / close */
    const opener = t.closest('[data-modal-open]');
    if (opener) {
      e.preventDefault();
      const m = document.getElementById(opener.dataset.modalOpen);
      if (m) m.classList.add('open');
      return;
    }
    if (t.closest('[data-modal-close]') || t.classList.contains('modal-backdrop')) {
      const bd = t.closest('.modal-backdrop');
      if (bd) bd.classList.remove('open');
      if (t.closest('[data-toast]')) window.showToast(t.closest('[data-toast]').dataset.toast);
      return;
    }

    /* Bookmark */
    const bm = t.closest('.bookmark-btn');
    if (bm) {
      e.preventDefault();
      bm.classList.toggle('is-active');
      const on = bm.classList.contains('is-active');
      bm.setAttribute('aria-pressed', on);
      bm.title = on ? 'Hapus dari favorit' : 'Simpan ke favorit';
      window.showToast(on ? 'Lowongan disimpan ke Favorit' : 'Lowongan dihapus dari Favorit', on ? 'bookmark_added' : 'bookmark_remove');
      return;
    }

    /* Toast trigger */
    const toastBtn = t.closest('[data-toast]');
    if (toastBtn) {
      if (toastBtn.tagName === 'A' || toastBtn.type === 'submit') e.preventDefault();
      window.showToast(toastBtn.dataset.toast, toastBtn.dataset.toastIcon);
      return;
    }

    /* Password visibility */
    const pw = t.closest('[data-toggle-password]');
    if (pw) {
      const input = pw.parentElement.querySelector('input');
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      pw.querySelector('.material-symbols-outlined').textContent = show ? 'visibility_off' : 'visibility';
      return;
    }

    /* Sidebar (mobile) */
    if (t.closest('[data-sidebar-toggle]')) {
      document.querySelector('.sidebar').classList.toggle('open');
      return;
    }

    /* Navbar (mobile) */
    if (t.closest('[data-nav-toggle]')) {
      document.querySelector('.navbar').classList.toggle('open');
      return;
    }

    /* Segmented control */
    const seg = t.closest('.segmented button');
    if (seg) {
      seg.parentElement.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      seg.classList.add('active');
      return;
    }

    /* Remove chip */
    const chipBtn = t.closest('.chip button');
    if (chipBtn) {
      chipBtn.closest('.chip').remove();
      return;
    }
  });

  /* ESC menutup modal */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.querySelectorAll('.modal-backdrop.open').forEach(function (m) { m.classList.remove('open'); });
  });

  /* ---------- Star rating input ---------- */
  const labels = ['', 'Sangat Buruk', 'Buruk', 'Cukup', 'Baik', 'Sangat Baik'];
  document.querySelectorAll('.star-input').forEach(function (group) {
    const stars = group.querySelectorAll('button');
    const hidden = group.dataset.target ? document.querySelector(group.dataset.target) : null;
    const labelEl = group.dataset.label ? document.querySelector(group.dataset.label) : null;
    let value = parseInt(group.dataset.value || '0', 10);

    function paint(n, cls) {
      stars.forEach(function (s, i) { s.classList.toggle(cls, i < n); });
    }
    paint(value, 'on');

    stars.forEach(function (star, idx) {
      star.type = 'button';
      star.setAttribute('aria-label', (idx + 1) + ' bintang');
      star.addEventListener('mouseenter', function () { paint(idx + 1, 'hover'); });
      star.addEventListener('mouseleave', function () { paint(0, 'hover'); });
      star.addEventListener('click', function () {
        value = idx + 1;
        paint(value, 'on');
        if (hidden) hidden.value = value;
        if (labelEl) labelEl.textContent = value + '/5 · ' + labels[value];
      });
    });
  });

  /* ---------- Character counter (textarea[data-counter]) ---------- */
  document.querySelectorAll('[data-counter]').forEach(function (ta) {
    const out = document.querySelector(ta.dataset.counter);
    const max = ta.getAttribute('maxlength');
    function update() { if (out) out.textContent = ta.value.length + (max ? ' / ' + max : '') + ' karakter'; }
    ta.addEventListener('input', update);
    update();
  });

  /* ---------- Scroll Reveal (.reveal & [data-reveal-group]) ---------- */
  document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
    group.querySelectorAll(':scope > .reveal').forEach(function (item, idx) {
      item.style.setProperty('--reveal-delay', (idx * 0.09).toFixed(2) + 's');
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if (revealItems.length) {
    if ('IntersectionObserver' in window) {
      const revealObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

      revealItems.forEach(function (el) { revealObs.observe(el); });
    } else {
      revealItems.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---------- Count-up angka statistik ([data-count]) ---------- */
  const countItems = document.querySelectorAll('[data-count]');
  if (countItems.length) {
    const numFormat = new Intl.NumberFormat('id-ID');
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function animateCount(el) {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      if (isNaN(target) || prefersReduced) {
        el.textContent = numFormat.format(target) + suffix;
        return;
      }

      const duration = 1400;
      const startTime = performance.now();

      function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4); /* easeOutQuart */
        const current = Math.round(eased * target);
        el.textContent = numFormat.format(current) + suffix;
        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      }
      requestAnimationFrame(tick);
    }

    if ('IntersectionObserver' in window) {
      const countObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });

      countItems.forEach(function (el) { countObs.observe(el); });
    } else {
      countItems.forEach(animateCount);
    }
  }

  /* ---------- Typewriter placeholder ([data-typewriter]) ---------- */
  const twInputs = document.querySelectorAll('input[data-typewriter]');
  if (twInputs.length) {
    const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced) {
      twInputs.forEach(function (input, inputIdx) {
        const words = (input.dataset.typewriter || '').split('|').map(function (w) { return w.trim(); }).filter(Boolean);
        if (!words.length) return;

        const prefix = input.dataset.typewriterPrefix || '';
        const defaultPlaceholder = input.getAttribute('placeholder') || (prefix + words[0]);
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;
        let timerId = null;

        function step() {
          if (isPaused) return;
          const currentWord = words[wordIndex];

          if (!isDeleting) {
            charIndex++;
            input.setAttribute('placeholder', prefix + currentWord.slice(0, charIndex) + '|');
            if (charIndex >= currentWord.length) {
              isDeleting = true;
              timerId = setTimeout(step, 1800);
              return;
            }
            timerId = setTimeout(step, 75);
          } else {
            charIndex--;
            input.setAttribute('placeholder', prefix + currentWord.slice(0, charIndex) + (charIndex > 0 ? '|' : ''));
            if (charIndex <= 0) {
              isDeleting = false;
              wordIndex = (wordIndex + 1) % words.length;
              timerId = setTimeout(step, 320);
              return;
            }
            timerId = setTimeout(step, 40);
          }
        }

        input.addEventListener('focus', function () {
          isPaused = true;
          clearTimeout(timerId);
          input.setAttribute('placeholder', prefix + words[wordIndex]);
        });

        input.addEventListener('blur', function () {
          if (!input.value.trim()) {
            isPaused = false;
            timerId = setTimeout(step, 500);
          } else {
            input.setAttribute('placeholder', defaultPlaceholder);
          }
        });

        /* Mulai setelah animasi entrance Hero selesai */
        timerId = setTimeout(step, 850 + inputIdx * 220);
      });
    }
  }
})();
