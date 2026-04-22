// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Cal.com vanilla embed — ported from Vite /src/cal-embed.js (logic unchanged).
 * Run once per app load (guarded by window.__ELIANE_CAL_EMBED_INIT__).
 */

const CAL_EMBED_SRC = "https://app.cal.com/embed/embed.js";
const CAL_NAMESPACE = "appel-decouverte";
const CAL_LAYOUT_BREAKPOINT_PX = 768;
const CAL_EMBED_LOAD_FALLBACK_MS = 8000;

let calEmbedFallbackTimer: any = null;
let pendingCalModals: any[] = [];

function clearCalEmbedFallbackTimer() {
  if (calEmbedFallbackTimer != null) {
    clearTimeout(calEmbedFallbackTimer);
    calEmbedFallbackTimer = null;
  }
}

function drainPendingCalModalQueue() {
  if (pendingCalModals.length === 0) return;
  const items = pendingCalModals;
  pendingCalModals = [];
  items.forEach(({ el }) => el.classList.remove("is-cal-loading"));

  const last = items[items.length - 1];
  const api = window.Cal?.ns?.[last.namespace];
  if (typeof api === "function") {
    api("modal", { calLink: last.calLink, config: last.config });
  }
}

function scheduleCalEmbedFallback() {
  if (calEmbedFallbackTimer != null) return;
  calEmbedFallbackTimer = window.setTimeout(() => {
    calEmbedFallbackTimer = null;
    if (window.__ELIANE_CAL_EMBED_READY__) return;

    const items = pendingCalModals;
    pendingCalModals = [];
    items.forEach(({ el }) => el.classList.remove("is-cal-loading"));

    const last = items[items.length - 1];
    if (last?.el instanceof HTMLAnchorElement && last.el.href) {
      window.location.href = last.el.href;
    }
  }, CAL_EMBED_LOAD_FALLBACK_MS);
}

function enqueuePendingCalModal(intent: any) {
  pendingCalModals.push(intent);
  intent.el.classList.add("is-cal-loading");
  scheduleCalEmbedFallback();
}

function installCalQueueSnippet() {
  const C = window;
  const A = CAL_EMBED_SRC;
  const L = "init";
  const p = (a: any, ar: any) => {
    a.q.push(ar);
  };
  const d = C.document;
  C.Cal =
    C.Cal ||
    function () {
      const cal = C.Cal;
      const ar = arguments;
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        const scriptEl = d.createElement("script");
        scriptEl.src = A;
        scriptEl.crossOrigin = "";
        scriptEl.addEventListener("load", () => {
          window.__ELIANE_CAL_EMBED_READY__ = true;
          clearCalEmbedFallbackTimer();
          drainPendingCalModalQueue();
        });
        d.head.appendChild(scriptEl);
        cal.loaded = true;
      }
      if (ar[0] === L) {
        const api = function () {
          p(api, arguments);
        };
        api.q = api.q || [];
        const namespace = ar[1];
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || api;
          p(cal.ns[namespace], ar);
          p(cal, ["initNamespace", namespace]);
        } else p(cal, ar);
        return;
      }
      p(cal, ar);
    };
}

function cssToken(tokenName: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(tokenName).trim();
}

function resolveCalModalLayout() {
  return window.innerWidth < CAL_LAYOUT_BREAKPOINT_PX ? "column_view" : "month_view";
}

function buildCalUiConfig() {
  const brandColor = cssToken("--plum");
  const cssVars = {
    "cal-brand": cssToken("--plum"),
    "cal-text": cssToken("--ink"),
    "cal-text-secondary": cssToken("--mid"),
    "cal-bg": cssToken("--beige"),
    "cal-border": cssToken("--lavender"),
  };
  const shared = { ...cssVars };
  return {
    theme: "light",
    layout: resolveCalModalLayout(),
    styles: {
      branding: {
        brandColor,
      },
    },
    cssVarsPerTheme: {
      light: { ...shared },
      dark: { ...shared },
    },
  };
}

const DEFAULT_CAL_LINK = "elianelarre/appel-decouverte";
const DEFAULT_CAL_NAMESPACE = "appel-decouverte";
const DEFAULT_CAL_CONFIG = { layout: "month_view" };

function parseCalConfig(raw: string | undefined) {
  if (!raw || typeof raw !== "string") return { ...DEFAULT_CAL_CONFIG };
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return { ...DEFAULT_CAL_CONFIG, ...(parsed as Record<string, unknown>) };
    }
    return { ...DEFAULT_CAL_CONFIG };
  } catch {
    return { ...DEFAULT_CAL_CONFIG };
  }
}

function stripNewTabAttrs(el: HTMLElement) {
  el.removeAttribute("target");
  const rel = el.getAttribute("rel");
  if (rel && rel.includes("noopener")) {
    el.removeAttribute("rel");
  }
}

function queryCalModalTriggers() {
  const list = document.querySelectorAll("a[data-cal-link], button[data-cal-link], [data-cal-link]");
  return [...new Set(list)];
}

function bindCalModalClickHandlers() {
  if (window.__ELIANE_CAL_MODAL_HANDLERS_BOUND__) return;
  window.__ELIANE_CAL_MODAL_HANDLERS_BOUND__ = true;

  queryCalModalTriggers().forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    stripNewTabAttrs(el);

    el.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        stripNewTabAttrs(el);

        const calLink = el.dataset.calLink || DEFAULT_CAL_LINK;
        const namespace = el.dataset.calNamespace || DEFAULT_CAL_NAMESPACE;
        const config = {
          ...parseCalConfig(el.dataset.calConfig),
          layout: resolveCalModalLayout(),
        };

        const intent = { el, calLink, namespace, config };

        if (window.__ELIANE_CAL_EMBED_READY__) {
          const api = window.Cal?.ns?.[namespace];
          if (typeof api === "function") {
            api("modal", { calLink, config });
          }
          return;
        }

        enqueuePendingCalModal(intent);
      },
      false,
    );
  });
}

function scheduleCalModalBinding() {
  const run = () => bindCalModalClickHandlers();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else {
    run();
  }
}

export function initCalEmbed(): void {
  if (window.__ELIANE_CAL_EMBED_INIT__) return;
  window.__ELIANE_CAL_EMBED_INIT__ = true;
  window.__ELIANE_CAL_EMBED_READY__ = false;
  installCalQueueSnippet();
  window.Cal("init", CAL_NAMESPACE, { origin: "https://cal.com" });
  const ns = window.Cal?.ns?.[CAL_NAMESPACE];
  if (typeof ns === "function") {
    ns("ui", buildCalUiConfig());
  }
  scheduleCalModalBinding();
}
