import type { Metadata } from "next";
import "./globals.css";
import CalEmbed from "./components/CalEmbed";
import ClientScripts from "./components/ClientScripts";
import CookieConsent from "./components/CookieConsent";
import IntroPhotoDock from "./components/IntroPhotoDock";

export const metadata: Metadata = {
  title: "Éliane — Entraîneure personnelle privée · Montréal",
  description:
    "Éliane — Entraîneure personnelle privée à Montréal. Accompagnement sur mesure, technique et nutrition alignées. Réserve ton appel découverte.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Poppins:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://app.cal.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cal.com" crossOrigin="anonymous" />
        <link rel="preload" as="script" href="https://app.cal.com/embed/embed.js" crossOrigin="anonymous" />
      </head>
      <body>
        <a className="skip-link" href="#contenu-principal">
          Passer au contenu
        </a>

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

        {children}

        <footer className="site-footer">
          <div className="footer-inner">
            <section className="footer-col footer-col--brand" aria-label="Marque Éliane Larre">
              <p className="footer-brand">
                <a href="/">
                  <em>Éliane Larre</em>
                </a>
              </p>
              <p className="footer-tagline">Entraîneure personnelle</p>
              <p className="footer-location">Montréal, Québec</p>
            </section>

            <nav className="footer-col footer-col--nav" aria-label="Navigation pied de page">
              <h3 className="footer-title">Navigation</h3>
              <ul className="footer-links">
                <li>
                  <a href="/#introduction">Introduction</a>
                </li>
                <li>
                  <a href="/#offres">Offres</a>
                  <ul className="footer-sublinks">
                    <li>
                      <a href="/offres/le-tremplin">Le Tremplin</a>
                    </li>
                    <li>
                      <a href="/offres/offre-signature">Offre signature</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="/#faq">FAQ</a>
                </li>
                <li>
                  <a
                    href="https://cal.com/elianelarre/appel-decouverte"
                    data-cal-link="elianelarre/appel-decouverte"
                    data-cal-namespace="appel-decouverte"
                    data-cal-config='{"layout":"month_view"}'
                  >
                    Appel découverte
                  </a>
                </li>
              </ul>
            </nav>

            <section className="footer-col footer-col--contact" aria-labelledby="footer-contact-heading">
              <h3 className="footer-title" id="footer-contact-heading">
                Contact
              </h3>
              <address className="footer-contact-list">
                <a href="mailto:info@elianelarre.com">info@elianelarre.com</a>
                <a
                  className="footer-ig-link"
                  href="https://www.instagram.com/eliane.au.naturel"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram @elianelarre (nouvel onglet)"
                >
                  <svg
                    className="footer-ig-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z" />
                  </svg>
                </a>
              </address>
            </section>

            <nav className="footer-col footer-col--legal" aria-label="Liens légaux">
              <h3 className="footer-title">Légal</h3>
              <ul className="footer-links">
                <li>
                  <a href="/politique-de-confidentialite">Politique de confidentialité</a>
                </li>
                <li>
                  <a href="/conditions-utilisation">{"Conditions d'utilisation"}</a>
                </li>
                <li>
                  <a href="#" data-cookie-preferences-link>
                    Gérer mes préférences de témoins
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="footer-bottom">
            <p className="footer-bottom-copy">© 2026 Éliane Larre. Tous droits réservés.</p>
            <p className="footer-bottom-credit">
              <a href="https://wfwonder.com/" target="_blank" rel="noopener noreferrer">
                WorkflowWonder ✦
              </a>
            </p>
          </div>
        </footer>

        <ClientScripts />
        <CalEmbed />
        <CookieConsent />
        <IntroPhotoDock />
      </body>
    </html>
  );
}
