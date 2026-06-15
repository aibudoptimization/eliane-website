import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions d'utilisation — Éliane Larre",
  description:
    "Conditions d'utilisation — Éliane Larre, entraîneure personnelle privée à Montréal.",
  alternates: { canonical: "/conditions-utilisation" },
  openGraph: {
    type: "website",
    locale: "fr_CA",
    title: "Conditions d'utilisation — Éliane Larre",
    description:
      "Conditions d'utilisation — Éliane Larre, entraîneure personnelle privée à Montréal.",
    siteName: "Éliane Larre",
  },
  robots: { index: false },
};

export default function ConditionsUtilisationPage() {
  return (
    <main id="contenu-principal" className="legal-main">
      <section className="legal-section">
        <div className="legal-inner">
          <h1>{"Conditions d'utilisation"}</h1>
          <p className="legal-updated">
            <em>Dernière mise à jour : avril 2026</em>
          </p>

          <p>
            Bienvenue sur le site d&apos;Éliane Larre. En utilisant ce site et les services offerts, tu acceptes les
            conditions décrites ci-dessous. Prends le temps de les lire attentivement.
          </p>

          <h2>1. Services offerts</h2>
          <p>
            J&apos;offre des services d&apos;entraînement personnel privé en présentiel à Montréal, incluant la conception
            de programmes personnalisés, le suivi, et des conseils en nutrition. Les détails spécifiques de chaque
            accompagnement sont précisés dans un contrat ou une entente distincte remise lors de ton inscription.
          </p>

          <h2>2. Accès au site</h2>
          <p>
            L&apos;accès à ce site est gratuit. Tu t&apos;engages à utiliser le site conformément aux lois applicables et
            à ne pas nuire à son bon fonctionnement.
          </p>

          <h2>3. Réservation et paiement</h2>
          <p>
            La réservation des séances se fait par l&apos;entremise des moyens indiqués sur le site. Les modalités de
            paiement sont précisées au moment de la réservation. Les paiements sont traités par un prestataire tiers
            sécurisé.
          </p>

          <h2>4. Politique d&apos;annulation</h2>
          <p>
            Les conditions d&apos;annulation et de report des séances sont précisées dans l&apos;entente de service remise
            lors de ton inscription. De façon générale, j&apos;apprécie un préavis raisonnable (24 à 48 heures) pour
            toute annulation.
          </p>

          <h2>5. Responsabilité</h2>
          <p>
            L&apos;entraînement physique comporte des risques inhérents. Avant de commencer, je te recommande fortement de
            consulter un professionnel de la santé si tu as des conditions médicales particulières.
          </p>
          <p>
            Je m&apos;engage à offrir mes services avec compétence, soin et professionnalisme. Toutefois, les résultats
            varient d&apos;une personne à l&apos;autre et dépendent de nombreux facteurs (assiduité, alimentation,
            génétique, santé générale). Je ne garantis pas de résultats spécifiques.
          </p>
          <p>
            Tu es responsable de m&apos;informer de toute condition médicale, blessure ou limitation qui pourrait affecter
            ta sécurité pendant les séances.
          </p>

          <h2>6. Propriété intellectuelle</h2>
          <p>
            Tout le contenu de ce site (textes, images, logo, programmes d&apos;entraînement remis aux clientes) est ma
            propriété et est protégé par les lois sur le droit d&apos;auteur. Toute reproduction ou utilisation sans
            autorisation est interdite.
          </p>

          <h2>7. Confidentialité</h2>
          <p>
            Ton utilisation du site est également régie par ma politique de confidentialité, disponible à l&apos;adresse
            : /politique-de-confidentialite
          </p>

          <h2>8. Modifications</h2>
          <p>
            Je me réserve le droit de modifier ces conditions à tout moment. La date de la dernière mise à jour figure en
            haut du document. Les conditions en vigueur au moment de la réservation de services s&apos;appliquent à cette
            réservation.
          </p>

          <h2>9. Droit applicable</h2>
          <p>
            Les présentes conditions sont régies par les lois du Québec et du Canada. Tout litige sera soumis à la
            compétence exclusive des tribunaux du district judiciaire de Montréal.
          </p>

          <h2>10. Nous contacter</h2>
          <p>Pour toute question concernant ces conditions, tu peux me contacter à :</p>
          <p>
            <a href="mailto:info@elianelarre.com">info@elianelarre.com</a>
          </p>

          <p className="legal-note">
            <em>
              Ce document est un modèle générique. Pour des conditions adaptées à ta situation juridique particulière,
              consulte un conseiller juridique.
            </em>
          </p>

          {/* Note to dev: This placeholder content was generated as a starting template. The client should have a legal professional review before this goes live on production. */}
        </div>
      </section>
    </main>
  );
}
