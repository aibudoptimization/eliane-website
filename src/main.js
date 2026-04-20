import './style.css';
import './cal-embed.js';
import { initIntroPhotoDock } from './intro-photo-dock.js';
import { initCookieConsent } from './cookie-consent.js';
import { createIcons } from 'lucide';
import Eye from 'lucide/dist/esm/icons/eye.js';
import ShieldCheck from 'lucide/dist/esm/icons/shield-check.js';
import CalendarCheck from 'lucide/dist/esm/icons/calendar-check.js';
import Activity from 'lucide/dist/esm/icons/activity.js';

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
function initNavDesktopDropdowns(nav) {
  const roots = nav.querySelectorAll('[data-nav-dropdown]');
  if (!roots.length) return;

  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  roots.forEach((root) => {
    const trigger = root.querySelector('[data-nav-dropdown-trigger]');
    const panel = root.querySelector('[data-nav-dropdown-panel]');
    const items = /** @type {HTMLElement[]} */ ([...root.querySelectorAll('[data-nav-dropdown-item]')]);
    if (!trigger || !panel || !items.length) return;

    let leaveTimer = 0;

    const clearLeaveTimer = () => {
      if (leaveTimer) {
        window.clearTimeout(leaveTimer);
        leaveTimer = 0;
      }
    };

    const isExpanded = () => trigger.getAttribute('aria-expanded') === 'true';

    const finishClose = () => {
      panel.setAttribute('hidden', '');
    };

    const open = () => {
      clearLeaveTimer();
      if (isExpanded()) return;
      trigger.setAttribute('aria-expanded', 'true');
      panel.removeAttribute('hidden');
      requestAnimationFrame(() => {
        root.classList.add('is-open');
      });
    };

    const close = () => {
      clearLeaveTimer();
      if (!isExpanded()) return;
      trigger.setAttribute('aria-expanded', 'false');
      root.classList.remove('is-open');
      if (reduceMotion()) {
        finishClose();
        return;
      }
      const onEnd = (e) => {
        if (e.target !== panel) return;
        panel.removeEventListener('transitionend', onEnd);
        finishClose();
      };
      panel.addEventListener('transitionend', onEnd);
      window.setTimeout(() => {
        panel.removeEventListener('transitionend', onEnd);
        if (!isExpanded()) finishClose();
      }, 280);
    };

    const scheduleCloseFromPointerLeave = () => {
      clearLeaveTimer();
      leaveTimer = window.setTimeout(() => {
        leaveTimer = 0;
        if (!root.contains(document.activeElement)) close();
      }, 200);
    };

    root.addEventListener('mouseenter', () => {
      clearLeaveTimer();
      open();
    });
    root.addEventListener('mouseleave', scheduleCloseFromPointerLeave);

    const triggerIsLink = trigger.tagName === 'A';

    trigger.addEventListener('click', (e) => {
      if (triggerIsLink) {
        close();
        return;
      }
      e.stopPropagation();
      if (isExpanded()) close();
      else open();
    });

    trigger.addEventListener('keydown', (e) => {
      if (triggerIsLink && (e.key === ' ' || e.key === 'Spacebar')) {
        return;
      }
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        if (isExpanded()) close();
        else open();
        return;
      }
      if (e.key === 'Escape') {
        if (!isExpanded()) return;
        e.preventDefault();
        close();
        trigger.focus();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isExpanded()) open();
        requestAnimationFrame(() => items[0]?.focus());
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isExpanded()) open();
        requestAnimationFrame(() => items[items.length - 1]?.focus());
      }
    });

    items.forEach((item, index) => {
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          close();
          trigger.focus();
          return;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (index >= items.length - 1) items[0]?.focus();
          else items[index + 1]?.focus();
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (index === 0) trigger.focus();
          else items[index - 1]?.focus();
        }
      });
    });

    document.addEventListener(
      'pointerdown',
      (e) => {
        if (!isExpanded()) return;
        if (root.contains(/** @type {Node} */ (e.target))) return;
        close();
      },
      true,
    );

    document.addEventListener('focusin', (e) => {
      if (!isExpanded()) return;
      if (root.contains(/** @type {Node} */ (e.target))) return;
      close();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 900) close();
    });
  });
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

  initNavDesktopDropdowns(nav);
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

const teardownIntroPhotoDock = initIntroPhotoDock();
if (import.meta.hot) {
  import.meta.hot.dispose(() => teardownIntroPhotoDock());
}

initPresentielLucideIcons();
initPresentielStaticMap();

const faq = document.querySelector('[data-faq]');
if (faq) initFaq(faq);

/** Sticky discovery CTA: show after scroll threshold; hide when footer is visible. */
function initOfferStickyCta() {
  const el = document.querySelector('[data-offer-sticky-cta]');
  const footer = document.querySelector('.site-footer');
  if (!el || !footer) return;

  const SCROLL_THRESHOLD = 500;

  let footerVisible = false;

  const apply = () => {
    const scrollPast = window.scrollY > SCROLL_THRESHOLD;
    const visible = scrollPast && !footerVisible;
    el.classList.toggle('is-visible', visible);
    el.setAttribute('aria-hidden', visible ? 'false' : 'true');
    if (visible) el.removeAttribute('tabindex');
    else el.setAttribute('tabindex', '-1');
  };

  window.addEventListener('scroll', apply, { passive: true });

  const io = new IntersectionObserver(
    (entries) => {
      const e = entries[0];
      footerVisible = !!(e && e.isIntersecting);
      apply();
    },
    { threshold: 0, rootMargin: '0px' },
  );
  io.observe(footer);

  apply();
}

initOfferStickyCta();

initCookieConsent();
