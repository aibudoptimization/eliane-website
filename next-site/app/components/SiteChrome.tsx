"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const DEFAULT_CAL_BOOKING = "https://cal.com/elianelarre/appel-decouverte";

export type SiteChromeProps = {
  calBookingUrl?: string;
  calLinkNamespace?: string;
};

export default function SiteChrome({
  calBookingUrl = DEFAULT_CAL_BOOKING,
  calLinkNamespace,
}: SiteChromeProps) {
  const navItems = [
    {label: "Approche", href: "/#approche"},
    {label: "Accompagnement", href: "/#accompagnement"},
    {label: "Témoignages", href: "/#temoignages"},
    {label: "FAQ", href: "/#faq"},
  ];
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return null;

  return (
    <>
      <header className="site-nav" id="site-nav" data-nav>
        <Link className="nav-logo" href="/" aria-label="Éliane Larre — Accueil">
          <em>Éliane Larre</em>
        </Link>
        <nav aria-label="Navigation principale">
          <ul className="nav-desktop">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          className="nav-cta nav-cta--outline"
          href={calBookingUrl}
          data-cal-link={calLinkNamespace || undefined}
          data-cal-config={calLinkNamespace ? '{"layout":"month_view"}' : undefined}
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
          {navItems.map((item) => (
            <li key={`mobile-${item.href}`}>
              <a href={item.href} data-nav-link>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          className="btn btn-primary nav-mobile-cta"
          href={calBookingUrl}
          data-cal-link={calLinkNamespace || undefined}
          data-cal-config={calLinkNamespace ? '{"layout":"month_view"}' : undefined}
          data-nav-link
        >
          Appel découverte
        </a>
      </div>
    </>
  );
}
