export {};

declare global {
  interface Window {
    __ELIANE_COOKIE_CONSENT_INIT__?: boolean;
    __ELIANE_GTM_LOADED__?: boolean;
    showCookiePreferences?: () => void;
    /** Google Tag Manager queue: created by whoever pushes first, read by GTM once it loads. */
    dataLayer?: Array<Record<string, unknown>>;
  }
}
