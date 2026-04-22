"use client";

import { usePathname } from "next/navigation";

export default function SiteChrome() {
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
            <li className="nav-dropdown nav-offres-dropdown--lg" data-nav-dropdown>
              <a
                href="/#offres"
                className="nav-dropdown-trigger"
                id="nav-offres-trigger"
                data-nav-dropdown-trigger
                aria-expanded="false"
                aria-haspopup="menu"
                aria-controls="nav-offres-menu"
              >
                Offres
                <svg
                  className="nav-dropdown-chevron"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <div
                className="nav-dropdown-panel"
                id="nav-offres-menu"
                data-nav-dropdown-panel
                role="menu"
                aria-labelledby="nav-offres-trigger"
                hidden
              >
                <div className="nav-dropdown-panel__surface">
                  <a href="/offres/le-tremplin" className="nav-dropdown-link" role="menuitem" data-nav-dropdown-item>
                    Le Tremplin
                  </a>
                  <a href="/offres/offre-signature" className="nav-dropdown-link" role="menuitem" data-nav-dropdown-item>
                    Offre signature
                  </a>
                </div>
              </div>
            </li>
            <li className="nav-offres-flat-md">
              <a href="/offres/le-tremplin">Le Tremplin</a>
            </li>
            <li className="nav-offres-flat-md">
              <a href="/offres/offre-signature">Offre signature</a>
            </li>
            <li>
              <a href="/#faq">FAQ</a>
            </li>
          </ul>
        </nav>
        <a
          className="nav-cta nav-cta--outline"
          href="https://cal.com/elianelarre/appel-decouverte"
          data-cal-link="elianelarre/appel-decouverte"
          data-cal-namespace="appel-decouverte"
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
            <a href="/offres/le-tremplin" data-nav-link>
              Le Tremplin
            </a>
          </li>
          <li>
            <a href="/offres/offre-signature" data-nav-link>
              Offre signature
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
          href="https://cal.com/elianelarre/appel-decouverte"
          data-cal-link="elianelarre/appel-decouverte"
          data-cal-namespace="appel-decouverte"
          data-cal-config='{"layout":"month_view"}'
          data-nav-link
        >
          Appel découverte
        </a>
      </div>
    </>
  );
}
