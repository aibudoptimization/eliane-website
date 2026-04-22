/**
 * Ported from Vite /src/main.js (excluding Cal embed, cookie consent, intro dock).
 * Returns a teardown that removes listeners / observers.
 */

import { createIcons, Eye, ShieldCheck, CalendarCheck, Activity } from "lucide";

/** Biner Training — 220 Bd Crémazie O; center matches Google Maps place resolution for maps.app.goo.gl/c1V1Re3Guj8ZF6mEA */
const BINER_STATIC_MAP_CENTER = "45.5385897,-73.6430173";

function initPresentielLucideIcons(): void {
  const root = document.getElementById("presentiel");
  if (!root) return;
  createIcons({
    icons: { Eye, ShieldCheck, CalendarCheck, Activity },
    attrs: {
      width: 34,
      height: 34,
      "stroke-width": 1.5,
    },
    root,
  });
}

function initPresentielStaticMap(): () => void {
  const img = document.querySelector<HTMLImageElement>("[data-presentiel-static-map]");
  if (!img) return () => {};

  const wrap = document.querySelector("[data-presentiel-map-wrap]");
  const fallback = document.querySelector<HTMLElement>("[data-presentiel-map-fallback]");
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const showFallback = () => {
    if (img.parentNode) img.remove();
    wrap?.classList.add("presentiel-location-card__map--fallback");
    fallback?.removeAttribute("hidden");
  };

  if (!key) {
    if (img.parentNode) img.remove();
    fallback?.setAttribute("hidden", "");
    return () => {};
  }

  const url = new URL("https://maps.googleapis.com/maps/api/staticmap");
  url.searchParams.set("center", BINER_STATIC_MAP_CENTER);
  url.searchParams.set("zoom", "16");
  url.searchParams.set("size", "480x280");
  url.searchParams.set("markers", `size:mid|color:0x552772|${BINER_STATIC_MAP_CENTER}`);
  url.searchParams.set("key", key);

  const markLoaded = () => img.classList.add("is-loaded");
  img.addEventListener("load", markLoaded);
  img.addEventListener("error", showFallback);
  img.src = url.toString();
  if (img.complete && img.naturalWidth > 0) markLoaded();

  return () => {
    img.removeEventListener("load", markLoaded);
    img.removeEventListener("error", showFallback);
  };
}

function initNavDesktopDropdowns(nav: HTMLElement): () => void {
  const roots = nav.querySelectorAll("[data-nav-dropdown]");
  if (!roots.length) return () => {};

  const cleanups: (() => void)[] = [];

  roots.forEach((root) => {
    const rootEl = root as HTMLElement;
    const trigger = rootEl.querySelector<HTMLElement>("[data-nav-dropdown-trigger]");
    const panel = rootEl.querySelector<HTMLElement>("[data-nav-dropdown-panel]");
    const items = [...rootEl.querySelectorAll<HTMLElement>("[data-nav-dropdown-item]")];
    if (!trigger || !panel || !items.length) return;

    let leaveTimer = 0;

    const clearLeaveTimer = () => {
      if (leaveTimer) {
        window.clearTimeout(leaveTimer);
        leaveTimer = 0;
      }
    };

    const isExpanded = () => trigger.getAttribute("aria-expanded") === "true";

    const finishClose = () => {
      panel.setAttribute("hidden", "");
    };

    const open = () => {
      clearLeaveTimer();
      if (isExpanded()) return;
      trigger.setAttribute("aria-expanded", "true");
      panel.removeAttribute("hidden");
      requestAnimationFrame(() => {
        rootEl.classList.add("is-open");
      });
    };

    const close = () => {
      clearLeaveTimer();
      if (!isExpanded()) return;
      trigger.setAttribute("aria-expanded", "false");
      rootEl.classList.remove("is-open");
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finishClose();
        return;
      }
      const onEnd = (e: TransitionEvent) => {
        if (e.target !== panel) return;
        panel.removeEventListener("transitionend", onEnd);
        finishClose();
      };
      panel.addEventListener("transitionend", onEnd);
      window.setTimeout(() => {
        panel.removeEventListener("transitionend", onEnd);
        if (!isExpanded()) finishClose();
      }, 280);
    };

    const scheduleCloseFromPointerLeave = () => {
      clearLeaveTimer();
      leaveTimer = window.setTimeout(() => {
        leaveTimer = 0;
        if (!rootEl.contains(document.activeElement)) close();
      }, 200);
    };

    const onMouseEnter = () => {
      clearLeaveTimer();
      open();
    };
    const onMouseLeave = () => scheduleCloseFromPointerLeave();

    rootEl.addEventListener("mouseenter", onMouseEnter);
    rootEl.addEventListener("mouseleave", onMouseLeave);
    cleanups.push(() => rootEl.removeEventListener("mouseenter", onMouseEnter));
    cleanups.push(() => rootEl.removeEventListener("mouseleave", onMouseLeave));

    const triggerIsLink = trigger.tagName === "A";

    const onTriggerClick = (e: MouseEvent) => {
      if (triggerIsLink) {
        close();
        return;
      }
      e.stopPropagation();
      if (isExpanded()) close();
      else open();
    };
    trigger.addEventListener("click", onTriggerClick);
    cleanups.push(() => trigger.removeEventListener("click", onTriggerClick));

    const onTriggerKeydown = (e: KeyboardEvent) => {
      if (triggerIsLink && (e.key === " " || e.key === "Spacebar")) {
        return;
      }
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        if (isExpanded()) close();
        else open();
        return;
      }
      if (e.key === "Escape") {
        if (!isExpanded()) return;
        e.preventDefault();
        close();
        trigger.focus();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!isExpanded()) open();
        requestAnimationFrame(() => items[0]?.focus());
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!isExpanded()) open();
        requestAnimationFrame(() => items[items.length - 1]?.focus());
      }
    };
    trigger.addEventListener("keydown", onTriggerKeydown);
    cleanups.push(() => trigger.removeEventListener("keydown", onTriggerKeydown));

    const itemKeydownHandlers: Array<(e: KeyboardEvent) => void> = [];
    items.forEach((item, index) => {
      const h = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          close();
          trigger.focus();
          return;
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          if (index >= items.length - 1) items[0]?.focus();
          else items[index + 1]?.focus();
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          if (index === 0) trigger.focus();
          else items[index - 1]?.focus();
        }
      };
      itemKeydownHandlers.push(h);
      item.addEventListener("keydown", h);
    });
    cleanups.push(() => {
      items.forEach((item, index) => {
        item.removeEventListener("keydown", itemKeydownHandlers[index]!);
      });
    });

    const onDocPointerDown = (e: PointerEvent) => {
      if (!isExpanded()) return;
      if (rootEl.contains(e.target as Node)) return;
      close();
    };
    document.addEventListener("pointerdown", onDocPointerDown, true);
    cleanups.push(() => document.removeEventListener("pointerdown", onDocPointerDown, true));

    const onFocusIn = (e: FocusEvent) => {
      if (!isExpanded()) return;
      if (rootEl.contains(e.target as Node)) return;
      close();
    };
    document.addEventListener("focusin", onFocusIn);
    cleanups.push(() => document.removeEventListener("focusin", onFocusIn));

    const onResize = () => {
      if (window.innerWidth < 1280) close();
    };
    window.addEventListener("resize", onResize);
    cleanups.push(() => window.removeEventListener("resize", onResize));
  });

  return () => {
    cleanups.forEach((c) => c());
  };
}

function initNav(nav: HTMLElement): () => void {
  const toggle = document.querySelector<HTMLButtonElement>("[data-nav-toggle]");
  const panel = document.querySelector<HTMLElement>("[data-nav-panel]");
  const links = document.querySelectorAll<HTMLElement>("[data-nav-link]");

  const setOpen = (open: boolean) => {
    if (!toggle || !panel) return;
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    panel.classList.toggle("is-open", open);
    if (open) panel.removeAttribute("hidden");
    else panel.setAttribute("hidden", "");
  };

  const onScroll = () => {
    nav.classList.toggle("is-stuck", window.scrollY > 32);
  };
  window.addEventListener("scroll", onScroll);

  const onToggleClick = () => {
    const open = toggle?.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  };
  toggle?.addEventListener("click", onToggleClick);

  const linkHandlers: (() => void)[] = [];
  links.forEach((a) => {
    const h = () => setOpen(false);
    a.addEventListener("click", h);
    linkHandlers.push(() => a.removeEventListener("click", h));
  });

  const onWinResize = () => {
    if (window.innerWidth > 900) setOpen(false);
  };
  window.addEventListener("resize", onWinResize);

  const teardownDropdowns = initNavDesktopDropdowns(nav);

  return () => {
    window.removeEventListener("scroll", onScroll);
    toggle?.removeEventListener("click", onToggleClick);
    linkHandlers.forEach((r) => r());
    window.removeEventListener("resize", onWinResize);
    teardownDropdowns();
  };
}

function revealElementIntersectsViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight;
  return rect.top < vh && rect.bottom > 0;
}

function initReveal(): () => void {
  let io: IntersectionObserver | null = null;
  let rafSetup = 0;
  let rafRecheck = 0;
  let cancelled = false;

  const setup = () => {
    if (cancelled) return;
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els.length) return;

    const markIfInView = (el: HTMLElement) => {
      if (el.classList.contains("is-visible")) return true;
      if (!revealElementIntersectsViewport(el)) return false;
      el.classList.add("is-visible");
      return true;
    };

    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("is-visible");
          io?.unobserve(e.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );

    els.forEach((el) => {
      if (markIfInView(el)) return;
      io!.observe(el);
    });

    rafRecheck = requestAnimationFrame(() => {
      if (cancelled || !io) return;
      els.forEach((el) => {
        if (markIfInView(el)) io!.unobserve(el);
      });
    });
  };

  rafSetup = requestAnimationFrame(setup);

  return () => {
    cancelled = true;
    cancelAnimationFrame(rafSetup);
    cancelAnimationFrame(rafRecheck);
    io?.disconnect();
  };
}

function initFaq(root: Element): () => void {
  const items = root.querySelectorAll<HTMLElement>(".faq-item");
  const handlers: (() => void)[] = [];

  items.forEach((item) => {
    const btn = item.querySelector<HTMLButtonElement>(".faq-trigger");
    const panel = item.querySelector<HTMLElement>(".faq-panel");
    if (!btn || !panel) return;

    const setOpen = (open: boolean) => {
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) panel.removeAttribute("hidden");
      else panel.setAttribute("hidden", "");
    };

    const onClick = () => {
      const wasOpen = item.classList.contains("is-open");
      items.forEach((other) => {
        const b = other.querySelector<HTMLButtonElement>(".faq-trigger");
        const p = other.querySelector<HTMLElement>(".faq-panel");
        if (!b || !p) return;
        other.classList.remove("is-open");
        b.setAttribute("aria-expanded", "false");
        p.setAttribute("hidden", "");
      });
      if (!wasOpen) setOpen(true);
    };
    btn.addEventListener("click", onClick);
    handlers.push(() => btn.removeEventListener("click", onClick));
  });

  return () => handlers.forEach((h) => h());
}

/** Sticky discovery CTA: show after scroll threshold; hide when footer is visible. */
function initOfferStickyCta(): () => void {
  const el = document.querySelector<HTMLElement>("[data-offer-sticky-cta]");
  const footer = document.querySelector<HTMLElement>(".site-footer");
  if (!el || !footer) return () => {};

  const SCROLL_THRESHOLD = 500;

  let footerVisible = false;

  const apply = () => {
    const scrollPast = window.scrollY > SCROLL_THRESHOLD;
    const visible = scrollPast && !footerVisible;
    el.classList.toggle("is-visible", visible);
    el.setAttribute("aria-hidden", visible ? "false" : "true");
    if (visible) el.removeAttribute("tabindex");
    else el.setAttribute("tabindex", "-1");
  };

  window.addEventListener("scroll", apply, { passive: true });

  const io = new IntersectionObserver(
    (entries) => {
      const e = entries[0];
      footerVisible = !!(e && e.isIntersecting);
      apply();
    },
    { threshold: 0, rootMargin: "0px" },
  );
  io.observe(footer);

  apply();

  return () => {
    window.removeEventListener("scroll", apply);
    io.disconnect();
  };
}

export function mountSiteInteractions(): () => void {
  const cleanups: (() => void)[] = [];

  const nav = document.getElementById("site-nav");
  if (nav) cleanups.push(initNav(nav));

  cleanups.push(initReveal());

  initPresentielLucideIcons();
  cleanups.push(initPresentielStaticMap());

  const faq = document.querySelector("[data-faq]");
  if (faq) cleanups.push(initFaq(faq));

  cleanups.push(initOfferStickyCta());

  return () => {
    cleanups.reverse().forEach((c) => c());
  };
}
