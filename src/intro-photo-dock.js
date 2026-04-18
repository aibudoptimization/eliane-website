/**
 * Bottom-anchored "dock" for the introduction training photo (≥768px, no reduced motion).
 * States: above (flow) → docked (fixed to viewport bottom) → below (absolute at cell bottom).
 */

const OFFSET_PX = 24;

/**
 * @returns {() => void} teardown
 */
export function initIntroPhotoDock() {
  const section = document.getElementById('introduction');
  if (!section) return () => {};

  const container = section.querySelector('.intro-bottom');
  const cell = section.querySelector('.intro-photo');
  const sticky = section.querySelector('.intro-photo-sticky');
  const text = section.querySelector('.intro-aside');
  if (!container || !cell || !sticky || !text) return () => {};

  const placeholder = document.createElement('div');
  placeholder.className = 'intro-photo-dock-placeholder';
  placeholder.setAttribute('aria-hidden', 'true');
  cell.insertBefore(placeholder, cell.firstChild);

  /** @type {'above' | 'docked' | 'below'} */
  let state = 'above';
  let rafId = 0;
  let attached = false;

  const mq768 = window.matchMedia('(min-width: 768px)');
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  const enabled = () => mq768.matches && !mqReduce.matches;

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

    const vh = window.innerHeight;
    const dockLine = vh - OFFSET_PX;
    const cellR = cell.getBoundingClientRect();
    const textR = text.getBoundingClientRect();
    const h = sticky.offsetHeight;
    const canDock = h < dockLine - 1;
    const textStill = textR.bottom > dockLine + 0.5;

    let next = state;

    if (!canDock) {
      next = 'above';
    } else if (!textStill) {
      next = state === 'above' ? 'above' : 'below';
    } else if (state === 'below') {
      next = 'docked';
    } else if (state === 'docked') {
      next = cellR.top + h > dockLine + 1 ? 'above' : 'docked';
    } else {
      const sr = sticky.getBoundingClientRect();
      next = sr.bottom <= dockLine ? 'docked' : 'above';
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
      sticky.style.setProperty('bottom', `${OFFSET_PX}px`);
      sticky.style.setProperty('left', `${cr.left}px`);
      sticky.style.setProperty('width', `${cr.width}px`);
      sticky.style.setProperty('z-index', '1');
      sticky.style.setProperty('top', 'auto');
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

  mq768.addEventListener('change', syncAttachment);
  mqReduce.addEventListener('change', syncAttachment);
  syncAttachment();

  return () => {
    mq768.removeEventListener('change', syncAttachment);
    mqReduce.removeEventListener('change', syncAttachment);
    detachListeners();
    clearStyles();
    placeholder.remove();
  };
}
