"use client";

import { usePathname } from "next/navigation";

const DEFAULT_CAL_BOOKING = "https://cal.com/elianelarre/appel-decouverte";
const DEFAULT_CONTACT_EMAIL = "info@elianelarre.com";
const DEFAULT_INSTAGRAM = "https://www.instagram.com/eliane.au.naturel";

export type SiteFooterProps = {
  calBookingUrl?: string;
  calLinkNamespace?: string;
  contactEmail?: string;
  instagramUrl?: string;
};

export default function SiteFooter({
  calBookingUrl = DEFAULT_CAL_BOOKING,
  calLinkNamespace,
  contactEmail = DEFAULT_CONTACT_EMAIL,
  instagramUrl = DEFAULT_INSTAGRAM,
}: SiteFooterProps) {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return null;

  return (
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
              <a href="/#faq">FAQ</a>
            </li>
            <li>
              <a
                href={calBookingUrl}
                data-cal-link={calLinkNamespace || undefined}
                data-cal-config={calLinkNamespace ? '{"layout":"month_view"}' : undefined}
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
            <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
            <a
              className="footer-ig-link"
              href={instagramUrl}
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
  );
}
