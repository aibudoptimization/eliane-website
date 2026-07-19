"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CAL_EMBED_DATA_CONFIG } from "@/lib/cal-embed-init";

const DEFAULT_CAL_BOOKING = "https://cal.com/elianelarre/appel-decouverte";
const DEFAULT_TALLY_URL = "https://tally.so/r/Pdg1Bd";

const NAV_ITEMS = [
  { label: "Approche", href: "/#approche", section: "approche" },
  { label: "Accompagnement", href: "/#accompagnement", section: "accompagnement" },
  { label: "Témoignages", href: "/#temoignages", section: "temoignages" },
  { label: "FAQ", href: "/#faq", section: "faq" },
] as const;

export type SiteChromeProps = {
  calBookingUrl?: string;
  calLinkNamespace?: string;
  tallyUrl?: string;
};

function NavArrowIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

export default function SiteChrome({
  calBookingUrl = DEFAULT_CAL_BOOKING,
  calLinkNamespace,
  tallyUrl = DEFAULT_TALLY_URL,
}: SiteChromeProps) {
  const pathname = usePathname();
  if (pathname.startsWith("/studio")) return null;

  const calProps = {
    "data-cal-link": calLinkNamespace || undefined,
    "data-cal-config": calLinkNamespace ? CAL_EMBED_DATA_CONFIG : undefined,
  };

  return (
    <>
      <header className="nav-shell site-nav" id="site-nav" data-nav>
        <Link
          href="/"
          className="nav-pill nav-pill--wordmark"
          aria-label="Éliane Larre — Accueil"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault()
              const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
              window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
            }
          }}
        >
          <em>Éliane Larre</em>
        </Link>

        <nav className="nav-pill nav-pill--links" aria-label="Navigation principale">
          {NAV_ITEMS.map((item) => (
            <a key={item.href} href={item.href} data-section={item.section}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="nav-pill nav-pill--cta" data-nav-cta>
          <a href={calBookingUrl} {...calProps}>
            Appel découverte
            <NavArrowIcon />
          </a>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded="false"
          aria-controls="nav-mobile"
          data-nav-toggle
          aria-label="Ouvrir le menu"
        >
          <span aria-hidden="true" />
        </button>
      </header>

      <div className="nav-overlay" id="nav-mobile" data-nav-panel hidden>
        {NAV_ITEMS.map((item) => (
          <a key={`mobile-${item.href}`} href={item.href} data-nav-link>
            {item.label}
          </a>
        ))}
        <div className="nav-overlay-cta-row">
          <a
            className="nav-overlay-cta"
            href={tallyUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-nav-link
          >
            Questionnaire initial
          </a>
          <a
            className="nav-overlay-cta"
            href={calBookingUrl}
            {...calProps}
            data-nav-link
          >
            Appel découverte
          </a>
        </div>
      </div>
    </>
  );
}
