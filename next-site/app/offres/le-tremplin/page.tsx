import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Le Tremplin — Éliane Larre",
  description: "Une formule d'un mois pour démarrer avec structure, clarté et accompagnement.",
};

export default function LeTremplinPage() {
  return (
    <>
      <main id="contenu-principal" className="offer-main">
        <section className="offer-hero">
          <div className="offer-hero-inner">
            <p className="offer-hero-eyebrow">Formule 1 mois</p>
            <h1 className="offer-hero-title">Le Tremplin</h1>
            <p className="offer-hero-subtitle">
              <em>Pour démarrer avec structure, clarté et accompagnement.</em>
            </p>
            <p className="offer-hero-pitch">
              Une formule d&apos;un mois pensée pour celles qui veulent démarrer avec un plan clair, personnalisé et un
              encadrement de proximité. Tu bénéficies d&apos;une rencontre initiale en présentiel de 2 heures, de ton
              programme d&apos;entraînement personnalisé, d&apos;un accès à moi 7/7 par message durant 4 semaines,
              d&apos;ajustements de ton programme au besoin, ainsi que d&apos;un appel bilan de 45 minutes en fin de
              mois.
            </p>
            <div className="offer-hero-actions">
              <a
                className="btn btn-primary"
                href="https://cal.com/elianelarre/appel-decouverte"
                data-cal-link="elianelarre/appel-decouverte"
                data-cal-namespace="appel-decouverte"
                data-cal-config='{"layout":"month_view"}'
              >
                Appel découverte
              </a>
              <a className="arrow-text-link offer-hero-secondary" href="#comparaison">
                Comparer les offres
                <span className="hero-ghost-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </div>
          </div>
        </section>

        <section className="offer-section offer-section--warm-sand" aria-labelledby="offer-ideal-heading">
          <div className="offer-section-inner">
            <p className="eyebrow">Pour qui</p>
            <h2 className="offer-section-title" id="offer-ideal-heading">
              Cette offre est idéale si tu veux…
            </h2>
            <ul className="offres-feature-list offer-list-block">
              <li>Avoir un programme personnalisé à tes objectifs</li>
              <li>Avoir accès à moi 7/7 via messages pour tes questions et ajustements</li>
              <li>Bâtir une base solide avant de poursuivre de façon plus autonome</li>
            </ul>
          </div>
        </section>

        <section className="offer-section" aria-labelledby="offer-includes-heading">
          <div className="offer-section-inner offer-section-inner--wide">
            <p className="eyebrow">Ce que tu reçois</p>
            <h2 className="offer-section-title" id="offer-includes-heading">
              Ce que comprend l&apos;offre
            </h2>
            <div className="offer-process-grid">
              <article className="offer-process-card" aria-labelledby="offer-card-01-title">
                <div className="offer-process-card__head">
                  <span className="offer-process-card__num" aria-hidden="true">
                    01
                  </span>
                  <span className="offer-process-card__rule" aria-hidden="true" />
                  <p className="offer-process-card__kicker">La rencontre</p>
                </div>
                <h3 className="offer-process-card__title" id="offer-card-01-title">
                  Rencontre initiale
                </h3>
                <ul className="offer-line-list offer-process-card__list" aria-labelledby="offer-card-01-title">
                  <li>1 rencontre initiale en présentiel de 2 heures</li>
                  <li>Présentation et ajustements du programme d&apos;entraînement</li>
                  <li>Tests physiques et mesures de départ</li>
                  <li>Prises de la composition corporelle</li>
                </ul>
              </article>
              <article className="offer-process-card" aria-labelledby="offer-card-02-title">
                <div className="offer-process-card__head">
                  <span className="offer-process-card__num" aria-hidden="true">
                    02
                  </span>
                  <span className="offer-process-card__rule" aria-hidden="true" />
                  <p className="offer-process-card__kicker">Le programme</p>
                </div>
                <h3 className="offer-process-card__title" id="offer-card-02-title">
                  Programme personnalisé
                </h3>
                <ul className="offer-line-list offer-process-card__list" aria-labelledby="offer-card-02-title">
                  <li>Programme d&apos;entraînement personnalisé</li>
                  <li>Ajustable durant les 4 semaines selon tes commentaires et résultats</li>
                </ul>
              </article>
              <article className="offer-process-card" aria-labelledby="offer-card-03-title">
                <div className="offer-process-card__head">
                  <span className="offer-process-card__num" aria-hidden="true">
                    03
                  </span>
                  <span className="offer-process-card__rule" aria-hidden="true" />
                  <p className="offer-process-card__kicker">L&apos;application</p>
                </div>
                <h3 className="offer-process-card__title" id="offer-card-03-title">
                  Accès à l&apos;application
                </h3>
                <ul className="offer-line-list offer-process-card__list" aria-labelledby="offer-card-03-title">
                  <li>Accès à ton programme</li>
                  <li>Suivi de tes charges</li>
                  <li>Messagerie directe 7/7</li>
                  <li>Questionnaire « check-in de la semaine » chaque semaine</li>
                  <li>Ajustements du programme au besoin via tes commentaires</li>
                </ul>
              </article>
              <article className="offer-process-card" aria-labelledby="offer-card-04-title">
                <div className="offer-process-card__head">
                  <span className="offer-process-card__num" aria-hidden="true">
                    04
                  </span>
                  <span className="offer-process-card__rule" aria-hidden="true" />
                  <p className="offer-process-card__kicker">Le bilan</p>
                </div>
                <h3 className="offer-process-card__title" id="offer-card-04-title">
                  Appel bilan
                </h3>
                <ul className="offer-line-list offer-process-card__list" aria-labelledby="offer-card-04-title">
                  <li>1 appel bilan de 45 minutes à la fin des 4 semaines</li>
                  <li>Questionnaire préalablement complété</li>
                  <li>Résumé et recommandations pour la suite</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="offer-section offer-section--plum" aria-labelledby="offer-for-you-heading">
          <div className="offer-section-inner">
            <p className="eyebrow">Tu te reconnais ?</p>
            <h2 className="offer-section-title" id="offer-for-you-heading">
              Cette offre est pour toi si…
            </h2>
            <ul className="offer-list-dots offer-list-block">
              <li>Tu t&apos;entraînes déjà, mais tu manques de structure</li>
              <li>Tu veux avoir accès à ton entraîneure pour répondre à toutes tes questions 7 jours sur 7</li>
              <li>Tu es constante depuis plusieurs mois ou années</li>
              <li>Tu n&apos;as pas besoin d&apos;une séance en présentiel chaque semaine pour progresser</li>
              <li>Tu es capable d&apos;exécuter tes entraînements de façon autonome</li>
            </ul>
          </div>
        </section>

        <section className="offer-section" id="comparaison" aria-labelledby="offer-compare-heading">
          <div className="offer-section-inner">
            <p className="eyebrow">Comparaison</p>
            <h2 className="offer-section-title" id="offer-compare-heading">
              Comparer les deux offres
            </h2>

            <div className="offer-compare-columns">
              <div className="offer-compare-col offer-compare-col--current">
                <p className="offer-compare-kicker offer-compare-kicker--current">Offre actuelle</p>
                <h3 className="offer-compare-col-title">Le Tremplin</h3>
                <p className="offer-compare-col-sub">1 mois</p>
                <ul className="offres-feature-list offer-compare-list">
                  <li>Tu t&apos;entraînes déjà ou t&apos;es déjà entraînée dans le passé</li>
                  <li>Tu es autonome et déjà constante</li>
                  <li>Tu ne peux pas facilement intégrer du présentiel chaque semaine</li>
                  <li>Tu veux briser un plateau</li>
                </ul>
              </div>
              <div className="offer-compare-col">
                <p className="offer-compare-kicker">Autre offre</p>
                <h3 className="offer-compare-col-title">Offre signature</h3>
                <p className="offer-compare-col-sub">3 mois</p>
                <ul className="offres-feature-list offer-compare-list">
                  <li>Tu ne t&apos;es jamais entraînée</li>
                  <li>Tu veux une transformation plus complète</li>
                  <li>Tu as besoin de plus d&apos;encadrement</li>
                  <li>Tu veux bénéficier de séances en présentiel</li>
                  <li>Tu veux être suivie de façon plus rapprochée</li>
                  <li>Tu veux installer des habitudes solides sur le long terme</li>
                </ul>
                <a className="arrow-text-link offer-compare-other-link" href="/offres/offre-signature">
                  Voir cette offre
                  <span className="hero-ghost-arrow" aria-hidden="true">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <a
        className="offer-sticky-cta"
        href="https://cal.com/elianelarre/appel-decouverte"
        data-cal-link="elianelarre/appel-decouverte"
        data-cal-namespace="appel-decouverte"
        data-cal-config='{"layout":"month_view"}'
        data-offer-sticky-cta
        aria-label="Réserver un appel découverte"
        aria-hidden="true"
        tabIndex={-1}
      >
        Commencer maintenant
      </a>
    </>
  );
}
