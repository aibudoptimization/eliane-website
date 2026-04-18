/**
 * Tablet-only (768–1023px) top-anchored dock for the intro training photo.
 * States: above (flow) → docked (fixed below nav) → below (absolute at cell bottom).
 * Disabled for prefers-reduced-motion and outside the tablet width range.
 */

const BREATHING_PX = 24;
const VIEWPORT_BOTTOM_MARGIN_PX = 8;

/**
 * @returns {() => void} teardown
 */
export function initIntroPhotoDock() {
  const section = document.getElementById('introduction');
  if (!section) return () => {};

  const cell = section.querySelector('.intro-photo');
  const sticky = section.querySelector('.intro-photo-sticky');
  const text = section.querySelector('.intro-aside');
  const navEl = document.querySelector('.site-nav');
  if (!cell || !sticky || !text) return () => {};

  const placeholder = document.createElement('div');
  placeholder.className = 'intro-photo-dock-placeholder';
  placeholder.setAttribute('aria-hidden', 'true');
  cell.insertBefore(placeholder, cell.firstChild);

  /** @type {'above' | 'docked' | 'below'} */
  let state = 'above';
  let rafId = 0;
  let attached = false;

  const mqTablet = window.matchMedia('(min-width: 768px) and (max-width: 1023px)');
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  const enabled = () => mqTablet.matches && !mqReduce.matches;

  function readTopOffset() {
    let navH = 0;
    if (navEl) {
      navH = navEl.getBoundingClientRect().height;
    }
    if (!navH || navH < 32) {
      const raw = getComputedStyle(document.documentElement).getPropertyValue('--nav-h').trim();
      if (raw.endsWith('rem')) {
        const rem = parseFloat(raw);
        const fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        navH = rem * fs;
      } else if (raw.endsWith('px')) {
        navH = parseFloat(raw);
      } else {
        navH = 72;
      }
    }
    return Math.round(navH + BREATHING_PX);
  }

  function clearStyles() {
    sticky.style.cssText = '';
    cell.style.position = '';
    placeholder.style.height = '0';
    placeholder.style.minHeight = '0';
  }

  function tick() {
    rafId = 0;

    if (!enabled()) {
      clearStyles();
      state = 'above';
      return;
    }

    const topOffset = readTopOffset();
    const vh = window.innerHeight;
    const h = sticky.offsetHeight;
    const textR = text.getBoundingClientRect();

    const canDock = h <= vh - topOffset - VIEWPORT_BOTTOM_MARGIN_PX;
    const dockedImageBottom = topOffset + h;
    const textStill = textR.bottom > dockedImageBottom + 0.5;

    const slotTop =
      state === 'docked' && placeholder.offsetHeight > 0
        ? placeholder.getBoundingClientRect().top
        : sticky.getBoundingClientRect().top;

    let next = state;

    if (!canDock) {
      next = 'above';
    } else if (!textStill) {
      next = state === 'above' ? 'above' : 'below';
    } else if (state === 'below') {
      next = 'docked';
    } else if (state === 'docked') {
      next = slotTop > topOffset + 1 ? 'above' : 'docked';
    } else {
      next = slotTop < topOffset ? 'docked' : 'above';
    }

    state = next;

    if (state === 'above') {
      clearStyles();
      return;
    }

    if (state === 'docked') {
      cell.style.position = '';
      const cr = cell.getBoundingClientRect();
      sticky.style.setProperty('position', 'fixed');
      sticky.style.setProperty('top', `${topOffset}px`);
      sticky.style.setProperty('bottom', 'auto');
      sticky.style.setProperty('left', `${cr.left}px`);
      sticky.style.setProperty('width', `${cr.width}px`);
      sticky.style.setProperty('z-index', '1');
      sticky.style.setProperty('right', 'auto');
      placeholder.style.height = `${h}px`;
      placeholder.style.minHeight = `${h}px`;
      return;
    }

    cell.style.setProperty('position', 'relative');
    sticky.style.setProperty('position', 'absolute');
    sticky.style.setProperty('bottom', '0');
    sticky.style.setProperty('left', '0');
    sticky.style.setProperty('right', '0');
    sticky.style.setProperty('width', 'auto');
    sticky.style.setProperty('top', 'auto');
    sticky.style.setProperty('z-index', '1');
    placeholder.style.height = '0';
    placeholder.style.minHeight = '0';
  }

  function schedule() {
    if (rafId) return;
    rafId = requestAnimationFrame(tick);
  }

  const onScroll = () => schedule();
  const onResize = () => schedule();

  function attachListeners() {
    if (attached) return;
    attached = true;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });
  }

  function detachListeners() {
    if (!attached) return;
    attached = false;
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  function syncAttachment() {
    if (enabled()) {
      attachListeners();
      schedule();
    } else {
      detachListeners();
      clearStyles();
      state = 'above';
    }
  }

  mqTablet.addEventListener('change', syncAttachment);
  mqReduce.addEventListener('change', syncAttachment);
  syncAttachment();

  return () => {
    mqTablet.removeEventListener('change', syncAttachment);
    mqReduce.removeEventListener('change', syncAttachment);
    detachListeners();
    clearStyles();
    placeholder.remove();
  };
}
