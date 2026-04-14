import './style.css';

const BOOKING_HREF = 'https://cal.com/elianelarre/appel-decouverte';

/** @param {HTMLElement} nav */
function initNav(nav) {
  const toggle = document.querySelector('[data-nav-toggle]');
  const panel = document.querySelector('[data-nav-panel]');
  const links = document.querySelectorAll('[data-nav-link]');

  const setOpen = (open) => {
    if (!toggle || !panel) return;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    panel.classList.toggle('is-open', open);
    if (open) panel.removeAttribute('hidden');
    else panel.setAttribute('hidden', '');
  };

  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-stuck', window.scrollY > 32);
  });

  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    setOpen(!open);
  });

  links.forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) setOpen(false);
  });

  // Ensure booking CTA links are consistent (sanity check in dev)
  document.querySelectorAll(`a[href="${BOOKING_HREF}"]`).forEach((a) => {
    a.setAttribute('rel', 'noopener noreferrer');
    if (!a.getAttribute('target')) a.setAttribute('target', '_blank');
  });
}

/** @param {HTMLElement} root */
function initHeroSlides(root) {
  const slides = root.querySelectorAll('.hero-slide');
  if (slides.length < 2) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  let i = 0;
  window.setInterval(() => {
    slides[i].classList.remove('is-active');
    i = (i + 1) % slides.length;
    slides[i].classList.add('is-active');
  }, 7000);
}

function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
  );

  els.forEach((el) => io.observe(el));
}

/** @param {HTMLElement} root */
function initFaq(root) {
  const items = root.querySelectorAll('.faq-item');

  items.forEach((item) => {
    const btn = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    if (!btn || !panel) return;

    const setOpen = (open) => {
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) panel.removeAttribute('hidden');
      else panel.setAttribute('hidden', '');
    };

    btn.addEventListener('click', () => {
      const wasOpen = item.classList.contains('is-open');
      items.forEach((other) => {
        const b = other.querySelector('.faq-trigger');
        const p = other.querySelector('.faq-panel');
        if (!b || !p) return;
        other.classList.remove('is-open');
        b.setAttribute('aria-expanded', 'false');
        p.setAttribute('hidden', '');
      });
      if (!wasOpen) setOpen(true);
    });
  });
}

const nav = document.getElementById('site-nav');
if (nav) initNav(nav);

const hero = document.querySelector('[data-hero-slides]');
if (hero) initHeroSlides(hero);

initReveal();

const faq = document.querySelector('[data-faq]');
if (faq) initFaq(faq);
