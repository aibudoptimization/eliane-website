export {};

declare global {
  interface Window {
    __ELIANE_CAL_EMBED_INIT__?: boolean;
    __ELIANE_CAL_EMBED_READY__?: boolean;
    __ELIANE_CAL_MODAL_HANDLERS_BOUND__?: boolean;
    __ELIANE_COOKIE_CONSENT_INIT__?: boolean;
    showCookiePreferences?: () => void;
    // Cal.com queue + namespaced API (initialized by embed snippet)
    Cal?: CalGlobal;
  }
}

/** Minimal typing for Cal.com embed queue (see cal-embed.js). */
interface CalGlobal {
  loaded?: boolean;
  ns?: Record<string, CalNamespaceApi | undefined>;
  q?: unknown[];
  (command: string, ...args: unknown[]): void;
}

type CalNamespaceApi = ((command: string, options?: Record<string, unknown>) => void) & {
  q?: unknown[];
};
