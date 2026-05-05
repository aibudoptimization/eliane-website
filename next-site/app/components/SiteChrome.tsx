"use client";

import { usePathname } from "next/navigation";

const DEFAULT_CAL_BOOKING = "https://cal.com/elianelarre/appel-decouverte";
const DEFAULT_CAL_LINK_NAMESPACE = "elianelarre/appel-decouverte";
const DEFAULT_CAL_NAMESPACE_SLUG = "appel-decouverte";

export type SiteChromeProps = {
  calBookingUrl?: string;
  calLinkNamespace?: string;
  calNamespaceSlug?: string;
};

export default function SiteChrome({
  calBookingUrl = DEFAULT_CAL_BOOKING,
  calLinkNamespace = DEFAULT_CAL_LINK_NAMESPACE,
  calNamespaceSlug = DEFAULT_CAL_NAMESPACE_SLUG,
}: SiteChromeProps) {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return null;

  return (
    <>
      <header className="site-nav" id="site-nav" data-nav>
        <a className="nav-logo" href="/" aria-label="Éliane Larre — Accueil">
          <em>Éliane Larre</em>
        </a>
        <nav aria-label="Navigation principale">
          <ul className="nav-desktop">
            <li>
              <a href="/#introduction">Introduction</a>
            </li>
            <li>
              <a href="/#faq">FAQ</a>
            </li>
          </ul>
        </nav>
        <a
          className="nav-cta nav-cta--outline"
          href={calBookingUrl}
          data-cal-link={calLinkNamespace}
          data-cal-namespace={calNamespaceSlug}
          data-cal-config='{"layout":"month_view"}'
        >
          Appel découverte
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded="false"
          aria-controls="nav-mobile"
          data-nav-toggle
          aria-label="Ouvrir le menu"
        >
          <span className="nav-toggle-bar" aria-hidden="true" />
        </button>
      </header>

      <div className="nav-mobile-panel" id="nav-mobile" data-nav-panel hidden>
        <ul>
          <li>
            <a href="/#introduction" data-nav-link>
              Introduction
            </a>
          </li>
          <li>
            <a href="/#faq" data-nav-link>
              FAQ
            </a>
          </li>
        </ul>
        <a
          className="btn btn-primary nav-mobile-cta"
          href={calBookingUrl}
          data-cal-link={calLinkNamespace}
          data-cal-namespace={calNamespaceSlug}
          data-cal-config='{"layout":"month_view"}'
          data-nav-link
        >
          Appel découverte
        </a>
      </div>
    </>
  );
}
