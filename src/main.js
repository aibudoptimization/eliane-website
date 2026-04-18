import './style.css';
import { createIcons } from 'lucide';
import Eye from 'lucide/dist/esm/icons/eye.js';
import ShieldCheck from 'lucide/dist/esm/icons/shield-check.js';
import CalendarCheck from 'lucide/dist/esm/icons/calendar-check.js';
import Activity from 'lucide/dist/esm/icons/activity.js';

const BOOKING_HREF = 'https://cal.com/elianelarre/appel-decouverte';

/** Biner Training — 220 Bd Crémazie O; center matches Google Maps place resolution for maps.app.goo.gl/c1V1Re3Guj8ZF6mEA */
const BINER_STATIC_MAP_CENTER = '45.5385897,-73.6430173';

function initPresentielLucideIcons() {
  const root = document.getElementById('presentiel');
  if (!root) return;
  createIcons({
    icons: { Eye, ShieldCheck, CalendarCheck, Activity },
    attrs: {
      width: 34,
      height: 34,
      'stroke-width': 1.5,
    },
    root,
  });
}

function initPresentielStaticMap() {
  const img = document.querySelector('[data-presentiel-static-map]');
  if (!img) return;

  const wrap = document.querySelector('[data-presentiel-map-wrap]');
  const fallback = document.querySelector('[data-presentiel-map-fallback]');
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const showFallback = () => {
    if (img.parentNode) img.remove();
    wrap?.classList.add('presentiel-location-card__map--fallback');
    fallback?.removeAttribute('hidden');
  };

  if (!key) {
    showFallback();
    return;
  }

  const url = new URL('https://maps.googleapis.com/maps/api/staticmap');
  url.searchParams.set('center', BINER_STATIC_MAP_CENTER);
  url.searchParams.set('zoom', '16');
  url.searchParams.set('size', '480x280');
  url.searchParams.set('markers', `size:mid|color:0x552772|${BINER_STATIC_MAP_CENTER}`);
  url.searchParams.set('key', key);

  const markLoaded = () => img.classList.add('is-loaded');
  img.addEventListener('load', markLoaded);
  img.addEventListener('error', showFallback);
  img.src = url.toString();
  if (img.complete && img.naturalWidth > 0) markLoaded();
}

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

initReveal();

initPresentielLucideIcons();
initPresentielStaticMap();

const faq = document.querySelector('[data-faq]');
if (faq) initFaq(faq);
