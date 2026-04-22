import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Éliane Larre",
  description:
    "Politique de confidentialité — Éliane Larre, entraîneure personnelle privée à Montréal.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main id="contenu-principal" className="legal-main">
      <section className="legal-section">
        <div className="legal-inner">
          <h1>Politique de confidentialité</h1>
          <p className="legal-updated">
            <em>Dernière mise à jour : avril 2026</em>
          </p>

          <p>
            La présente politique de confidentialité décrit la manière dont Éliane Larre (&quot;je&quot;, &quot;mon&quot;,
            &quot;mes&quot;) recueille, utilise et protège les renseignements personnels que tu me fournis lorsque tu
            visites ce site web ou que tu utilises mes services d&apos;entraînement personnel.
          </p>

          <h2>1. Renseignements recueillis</h2>
          <p>Je peux recueillir les renseignements suivants :</p>
          <ul>
            <li>Nom et prénom</li>
            <li>Adresse courriel</li>
            <li>Numéro de téléphone (si tu choisis de me le fournir)</li>
            <li>
              Informations liées à ta santé, à ton historique d&apos;entraînement et à tes objectifs, lorsque tu me les
              transmets volontairement dans le cadre d&apos;un accompagnement
            </li>
            <li>
              Informations de paiement (traitées via un prestataire sécurisé; je ne conserve pas tes données de carte)
            </li>
            <li>
              Données techniques anonymisées (type de navigateur, pages consultées) via des outils d&apos;analyse
              standard
            </li>
          </ul>

          <h2>2. Utilisation des renseignements</h2>
          <p>Les renseignements recueillis sont utilisés pour :</p>
          <ul>
            <li>Répondre à tes demandes de renseignements</li>
            <li>Planifier et offrir les séances d&apos;entraînement</li>
            <li>Adapter les programmes à tes objectifs</li>
            <li>Gérer la facturation et les paiements</li>
            <li>T&apos;envoyer des communications liées à nos échanges ou aux services offerts</li>
          </ul>
          <p>Tes renseignements ne sont jamais vendus, loués ou partagés à des fins commerciales avec des tiers.</p>

          <h2>3. Partage avec des tiers</h2>
          <p>
            Je peux partager certains renseignements avec des prestataires de services tiers uniquement lorsque nécessaire
            à l&apos;exécution des services (exemples : outil de prise de rendez-vous, processeur de paiement, plateforme
            d&apos;envoi de courriels). Ces prestataires sont tenus de respecter la confidentialité de tes données.
          </p>

          <h2>4. Conservation des données</h2>
          <p>
            Tes renseignements personnels sont conservés uniquement pour la durée nécessaire à la prestation des services
            et au respect de mes obligations légales, fiscales et comptables.
          </p>

          <h2>5. Tes droits</h2>
          <p>
            Conformément à la Loi sur la protection des renseignements personnels dans le secteur privé (Québec) et à la
            Loi 25, tu as le droit :
          </p>
          <ul>
            <li>D&apos;accéder aux renseignements personnels que je détiens à ton sujet</li>
            <li>De demander la rectification de renseignements inexacts</li>
            <li>De demander la suppression de tes renseignements (sous réserve des obligations légales)</li>
            <li>De retirer ton consentement au traitement de tes données</li>
            <li>De porter plainte auprès de la Commission d&apos;accès à l&apos;information du Québec</li>
          </ul>
          <p>Pour exercer ces droits, communique avec moi à l&apos;adresse : info@elianelarre.com</p>

          <h2>6. Témoins (cookies)</h2>
          <p>
            Ce site utilise des témoins (cookies) pour assurer son bon fonctionnement et, avec ton consentement, pour
            mesurer le trafic du site. Les catégories de témoins sont les suivantes :
          </p>
          <ul>
            <li>
              <strong>Témoins nécessaires</strong> : essentiels au fonctionnement du site. Ils ne peuvent pas être
              désactivés.
            </li>
            <li>
              <strong>Témoins d&apos;analyse</strong> : nous aident à comprendre comment les visiteurs utilisent le site.
              Ces données sont anonymisées. Activés uniquement avec ton consentement.
            </li>
            <li>
              <strong>Témoins de marketing</strong> : utilisés pour personnaliser les publicités. Actuellement aucun témoin
              de marketing n&apos;est actif sur ce site. Si cela change, ces témoins seront activés uniquement avec ton
              consentement.
            </li>
          </ul>
          <p>
            Tu peux modifier tes préférences à tout moment en cliquant sur « Gérer mes préférences de témoins » au bas du
            site.
          </p>

          <h2>7. Sécurité</h2>
          <p>
            Je prends des mesures raisonnables pour protéger tes renseignements personnels contre l&apos;accès non
            autorisé, la perte ou la divulgation. Toutefois, aucun système n&apos;est totalement sécurisé, et je ne peux
            garantir une sécurité absolue.
          </p>

          <h2>8. Modifications de la politique</h2>
          <p>
            Cette politique peut être modifiée à tout moment. La date de la dernière mise à jour figure en haut du
            document. Je t&apos;invite à la consulter régulièrement.
          </p>

          <h2>9. Nous contacter</h2>
          <p>Pour toute question concernant cette politique de confidentialité, tu peux me contacter à :</p>
          <p>
            <a href="mailto:info@elianelarre.com">info@elianelarre.com</a>
          </p>

          <p className="legal-note">
            <em>
              Ce document est un modèle générique. Pour une politique adaptée à ta situation juridique particulière,
              consulte un conseiller juridique.
            </em>
          </p>

          {/* Note to dev: This placeholder content was generated as a starting template. The client should have a legal professional review before this goes live on production. */}
        </div>
      </section>
    </main>
  );
}
