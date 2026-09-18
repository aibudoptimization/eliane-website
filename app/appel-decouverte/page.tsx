import type { Metadata } from "next";
import BookingWidget from "../components/BookingWidget";

export const metadata: Metadata = {
  title: "Réserver un appel découverte — Éliane Larre",
  description:
    "Réserve ton appel découverte de 15 minutes avec Éliane Larre, entraîneure personnelle privée à Montréal.",
  alternates: { canonical: "/appel-decouverte" },
  // Not linked from the site yet: keep it out of search results until the booking CTA points here.
  robots: { index: false, follow: false },
};

export default function AppelDecouvertePage() {
  return (
    <main id="contenu-principal" className="booking-main">
      <div className="booking-inner">
        <header className="booking-header">
          <p className="eyebrow">Première étape</p>
          <h1 className="booking-title">
            Réserve ton <em className="text-accent">appel découverte</em>
          </h1>
          <p className="booking-lead">
            Choisis le moment qui te convient. Tu recevras ensuite un lien par courriel pour remplir mon questionnaire
            avant notre appel.
          </p>
        </header>

        <BookingWidget />

        <p className="booking-help">
          Un souci avec le calendrier? Écris-moi à{" "}
          <a href="mailto:info@elianelarre.com">info@elianelarre.com</a>
        </p>
      </div>
    </main>
  );
}
