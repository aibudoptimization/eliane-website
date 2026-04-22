"use client";

import { useEffect, useRef } from "react";
import * as VanillaCookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";

const COOKIE_PREFERENCES_LINK_SELECTOR = "[data-cookie-preferences-link]";

function hasAnalyticsConsent(cookie: { categories?: string[] } | undefined) {
  return Array.isArray(cookie?.categories) && cookie.categories.includes("analytics");
}

async function loadVercelAnalyticsIfConsented(cookie: { categories?: string[] } | undefined) {
  if (!hasAnalyticsConsent(cookie)) return;
  const { inject } = await import("@vercel/analytics");
  inject();
}

export default function CookieConsent() {
  const analyticsInjectedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || window.__ELIANE_COOKIE_CONSENT_INIT__) return;
    window.__ELIANE_COOKIE_CONSENT_INIT__ = true;

    window.showCookiePreferences = () => VanillaCookieConsent.showPreferences();

    const onCookiePreferencesClick = (event: Event) => {
      event.preventDefault();
      VanillaCookieConsent.showPreferences();
    };

    function bindCookiePreferencesLinks() {
      const links = document.querySelectorAll<HTMLElement>(COOKIE_PREFERENCES_LINK_SELECTOR);
      links.forEach((link) => {
        link.addEventListener("click", onCookiePreferencesClick);
      });
    }

    void VanillaCookieConsent.run({
      cookie: {
        useLocalStorage: true,
        expiresAfterDays: 182,
      },
      guiOptions: {
        consentModal: {
          layout: "box",
          position: "bottom left",
          equalWeightButtons: true,
        },
        preferencesModal: {
          layout: "box",
          equalWeightButtons: true,
        },
      },
      categories: {
        necessary: {
          enabled: true,
          readOnly: true,
        },
        analytics: {
          enabled: false,
          services: {
            vercel_analytics: {
              label: "Vercel Analytics",
              onAccept: () => {},
              onReject: () => {},
            },
          },
        },
        marketing: {
          enabled: false,
          services: {
            future_marketing_pixels: {
              label: "Pixels marketing (à venir)",
            },
          },
        },
      },
      language: {
        default: "fr",
        translations: {
          fr: {
            consentModal: {
              title: "On utilise des témoins 🍪",
              description:
                "Ce site utilise des témoins pour améliorer ton expérience et mesurer son trafic. Tu peux accepter, refuser ou personnaliser tes préférences. Tu peux changer ton choix à tout moment via le lien au bas du site.",
              acceptAllBtn: "Accepter tout",
              acceptNecessaryBtn: "Refuser tout",
              showPreferencesBtn: "Personnaliser",
            },
            preferencesModal: {
              title: "Préférences de témoins",
              acceptAllBtn: "Accepter tout",
              acceptNecessaryBtn: "Refuser tout",
              savePreferencesBtn: "Enregistrer mes choix",
              sections: [
                {
                  description:
                    "Gère tes préférences par catégorie. Les témoins nécessaires ne peuvent pas être désactivés.",
                },
                {
                  title: "Témoins nécessaires",
                  description:
                    "Ces témoins sont nécessaires au bon fonctionnement du site et ne peuvent pas être désactivés.",
                  linkedCategory: "necessary",
                },
                {
                  title: "Témoins d'analyse",
                  description:
                    "Ces témoins nous permettent de mesurer le trafic du site et d'améliorer ton expérience. Les données sont anonymisées.",
                  linkedCategory: "analytics",
                },
                {
                  title: "Témoins de marketing",
                  description:
                    "Ces témoins sont utilisés pour personnaliser les publicités. Actuellement aucun témoin de marketing n'est actif sur ce site.",
                  linkedCategory: "marketing",
                },
                {
                  description:
                    '<a href="/politique-de-confidentialite" class="cc-link">Politique de confidentialité</a>',
                },
              ],
            },
          },
        },
      },
      onConsent: ({ cookie }) => {
        void (async () => {
          if (analyticsInjectedRef.current || !hasAnalyticsConsent(cookie)) return;
          await loadVercelAnalyticsIfConsented(cookie);
          analyticsInjectedRef.current = true;
        })();
      },
      onChange: ({ cookie }) => {
        void (async () => {
          if (analyticsInjectedRef.current || !hasAnalyticsConsent(cookie)) return;
          await loadVercelAnalyticsIfConsented(cookie);
          analyticsInjectedRef.current = true;
        })();
      },
    });

    bindCookiePreferencesLinks();
  }, []);

  return null;
}
