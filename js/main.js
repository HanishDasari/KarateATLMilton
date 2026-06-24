/* =========================================================================
   Karate Atlanta Milton — Interactivity
   Vanilla JS, no dependencies. Everything is progressive enhancement.
   ========================================================================= */
(function () {
  'use strict';

  /* ---------- Header shadow on scroll ---------- */
  const header = document.getElementById('header');
  const floatCta = document.getElementById('floatCta');
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (floatCta) floatCta.classList.toggle('show', y > 700);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const navToggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const backdrop = document.getElementById('menuBackdrop');
  const setMenu = (open) => {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle('open', open);
    backdrop.classList.toggle('open', open);
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  if (navToggle) navToggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('open')));
  if (backdrop) backdrop.addEventListener('click', () => setMenu(false));
  if (mobileMenu) mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Highlight today's hours ---------- */
  const today = new Date().getDay();
  const todayLi = document.querySelector('#hoursList li[data-day="' + today + '"]');
  if (todayLi) {
    todayLi.classList.add('today');
    const span = todayLi.querySelector('span');
    if (span && span.textContent.trim().toLowerCase() !== 'closed') span.textContent += '  • Open today';
  }

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString()) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = (decimals ? target.toFixed(decimals) : Math.round(target).toLocaleString()) + suffix;
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach((c) => cio.observe(c));
  } else {
    counters.forEach((c) => { c.textContent = c.dataset.count + (c.dataset.suffix || ''); });
  }

  /* ---------- Schedule filter ---------- */
  const filterWrap = document.getElementById('schedFilters');
  if (filterWrap) {
    const rows = document.querySelectorAll('#schedBody tr');
    filterWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.chip');
      if (!btn) return;
      filterWrap.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      rows.forEach((r) => {
        const show = f === 'all' || (r.dataset.cat || '').split(' ').includes(f);
        r.style.display = show ? '' : 'none';
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach((q) => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const ans = q.nextElementSibling;
      const open = item.classList.toggle('open');
      ans.style.maxHeight = open ? ans.scrollHeight + 'px' : '0';
    });
  });

  /* ---------- Testimonial slider ---------- */
  const track = document.getElementById('testiTrack');
  const navWrap = document.getElementById('testiNav');
  if (track && navWrap) {
    const slides = track.children.length;
    let idx = 0, timer;
    for (let i = 0; i < slides; i++) {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
      dot.addEventListener('click', () => go(i, true));
      navWrap.appendChild(dot);
    }
    const dots = navWrap.children;
    const go = (i, manual) => {
      idx = (i + slides) % slides;
      track.style.transform = 'translateX(-' + idx * 100 + '%)';
      Array.from(dots).forEach((d, k) => d.classList.toggle('active', k === idx));
      if (manual) restart();
    };
    const next = () => go(idx + 1);
    const restart = () => { clearInterval(timer); timer = setInterval(next, 6000); };
    restart();
  }

  /* ---------- Trial form (demo handling) ---------- */
  const form = document.getElementById('trialForm');
  const success = document.getElementById('trialSuccess');
  if (form && success) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      // NOTE: Wire this to your CRM / MyStudio / email service.
      // For now we store the lead locally and show confirmation.
      try {
        const data = Object.fromEntries(new FormData(form).entries());
        data.submittedAt = new Date().toISOString();
        const leads = JSON.parse(localStorage.getItem('ka_leads') || '[]');
        leads.push(data);
        localStorage.setItem('ka_leads', JSON.stringify(leads));
      } catch (err) { /* non-fatal */ }
      form.style.display = 'none';
      success.classList.add('show');
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /* ---------- Smooth-scroll offset safety for older browsers ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = document.querySelector(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); history.replaceState(null, '', id); }
    });
  });
})();
