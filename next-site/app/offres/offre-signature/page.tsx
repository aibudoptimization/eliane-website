import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offre signature — Éliane Larre",
  description:
    "Une formule de 12 semaines pour transformer ta façon de t'entraîner avec structure, soutien et encadrement serré.",
};

export default function OffreSignaturePage() {
  return (
    <>
      <main id="contenu-principal" className="offer-main">
        <section className="offer-hero">
          <div className="offer-hero-inner">
            <p className="offer-hero-eyebrow">Formule 3 mois</p>
            <h1 className="offer-hero-title">Offre signature</h1>
            <p className="offer-hero-subtitle">
              <em>Pour transformer ta façon de t&apos;entraîner avec structure et encadrement serré.</em>
            </p>
            <p className="offer-hero-pitch">
              Une formule de trois mois pensée pour celles qui veulent un accompagnement complet, structuré et
              personnalisé, avec un encadrement rapproché pour progresser de façon durable. Tu bénéficies d&apos;un suivi
              et d&apos;une séance en présentiel chaque semaine, d&apos;un programme d&apos;entraînement personnalisé,
              d&apos;un accès à moi 7/7 par message pendant 12 semaines, d&apos;ajustements au besoin, ainsi que
              d&apos;un accompagnement de proximité pour t&apos;aider à évoluer avec clarté, constance et confiance.
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
              <li>Commencer ou reprendre l&apos;entraînement avec un cadre structuré</li>
              <li>Être accompagnée de façon rapprochée pendant 12 semaines</li>
              <li>Avoir un suivi en présentiel chaque semaine</li>
              <li>Avoir accès à moi 7/7 pour tes questions et ajustements</li>
              <li>Bénéficier d&apos;un programme personnalisé selon tes objectifs et niveau de départ</li>
              <li>Installer des habitudes solides et durables</li>
              <li>Progresser avec plus d&apos;encadrement, de structure et de constance</li>
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
                  <li>Présentation du programme et ajustements</li>
                  <li>Tests physiques</li>
                  <li>Prises de la composition corporelle</li>
                </ul>
              </article>
              <article className="offer-process-card" aria-labelledby="offer-card-02-title">
                <div className="offer-process-card__head">
                  <span className="offer-process-card__num" aria-hidden="true">
                    02
                  </span>
                  <span className="offer-process-card__rule" aria-hidden="true" />
                  <p className="offer-process-card__kicker">Les séances</p>
                </div>
                <h3 className="offer-process-card__title" id="offer-card-02-title">
                  Séances en présentiel
                </h3>
                <ul className="offer-line-list offer-process-card__list" aria-labelledby="offer-card-02-title">
                  <li>12 rencontres en présentiel, à raison de 1 séance par semaine</li>
                  <li>Ajustements du programme au besoin tout au long de l&apos;accompagnement</li>
                </ul>
              </article>
              <article className="offer-process-card" aria-labelledby="offer-card-03-title">
                <div className="offer-process-card__head">
                  <span className="offer-process-card__num" aria-hidden="true">
                    03
                  </span>
                  <span className="offer-process-card__rule" aria-hidden="true" />
                  <p className="offer-process-card__kicker">Le programme &amp; l&apos;application</p>
                </div>
                <h3 className="offer-process-card__title" id="offer-card-03-title">
                  Programme personnalisé
                </h3>
                <ul className="offer-line-list offer-process-card__list" aria-labelledby="offer-card-03-title">
                  <li>Programme d&apos;entraînement personnalisé</li>
                  <li>Accès à ton programme via l&apos;application</li>
                  <li>Suivi de tes charges et ta progression</li>
                  <li>Messagerie directe 7/7</li>
                  <li>Questionnaires « check-in de la semaine »</li>
                  <li>Ajustements du programme via tes commentaires et ta progression</li>
                </ul>
              </article>
              <article className="offer-process-card" aria-labelledby="offer-card-04-title">
                <div className="offer-process-card__head">
                  <span className="offer-process-card__num" aria-hidden="true">
                    04
                  </span>
                  <span className="offer-process-card__rule" aria-hidden="true" />
                  <p className="offer-process-card__kicker">La nutrition &amp; le bilan</p>
                </div>
                <h3 className="offer-process-card__title" id="offer-card-04-title">
                  Nutrition et suivi personnalisé
                </h3>
                <ul className="offer-line-list offer-process-card__list" aria-labelledby="offer-card-04-title">
                  <li>1 semaine de journal alimentaire pour optimiser ton alimentation selon tes objectifs</li>
                  <li>Bilan écrit des observations et conseils adaptés à ta réalité</li>
                </ul>
              </article>
            </div>
          </div>
        </section>

        <section className="offer-section offer-section--plum" aria-labelledby="offer-for-you-heading">
          <div className="offer-section-inner">
            <p className="eyebrow">Tu te reconnais ?</p>
            <h2 className="offer-section-title" id="offer-for-you-heading">
              Cette offre te correspond si…
            </h2>
            <ul className="offer-list-dots offer-list-block">
              <li>Tu ne t&apos;es jamais entraînée</li>
              <li>Tu as une limitation physique</li>
              <li>Tu veux diminuer les risques de blessures</li>
              <li>Tu veux une formule plus complète et plus encadrée</li>
              <li>Tu bénéficies du présentiel régulier pour bien progresser</li>
              <li>Tu veux être suivie de façon plus rapprochée</li>
              <li>Tu veux un accompagnement personnalisé avec beaucoup de structure</li>
              <li>Tu veux développer des bases solides sur plusieurs semaines</li>
              <li>Tu veux être soutenue dans ta progression, autant dans l&apos;exécution que dans la constance</li>
              <li>Tu veux investir dans une démarche plus approfondie</li>
            </ul>
          </div>
        </section>

        <section className="offer-section" id="comparaison" aria-labelledby="offer-compare-heading">
          <div className="offer-section-inner">
            <p className="eyebrow">Comparaison</p>
            <h2 className="offer-section-title" id="offer-compare-heading">
              Comparer les deux offres
            </h2>

            <div className="offer-compare-columns offer-compare-columns--signature-page">
              <div className="offer-compare-col offer-compare-col--current">
                <p className="offer-compare-kicker offer-compare-kicker--current">Offre actuelle</p>
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
              </div>
              <div className="offer-compare-col offer-compare-col--other">
                <p className="offer-compare-kicker">Autre offre</p>
                <h3 className="offer-compare-col-title">Le Tremplin</h3>
                <p className="offer-compare-col-sub">1 mois</p>
                <ul className="offres-feature-list offer-compare-list">
                  <li>Tu t&apos;entraînes déjà ou t&apos;es déjà entraînée dans le passé</li>
                  <li>Tu es autonome et déjà constante</li>
                  <li>Tu ne peux pas facilement intégrer du présentiel chaque semaine</li>
                  <li>Tu veux briser un plateau</li>
                </ul>
                <a className="arrow-text-link offer-compare-other-link" href="/offres/le-tremplin">
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
