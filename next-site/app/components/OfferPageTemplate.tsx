import { PortableText, type PortableTextComponents } from '@portabletext/react'

export type OfferPageTemplateData = {
  _id: string
  title: string
  slug: string
  heroEyebrow?: string
  heroSubtitle?: unknown[]
  heroPitch?: string
  idealListHeading?: string
  idealListItems?: string[]
  includesHeading?: string
  processCards?: Array<{ kicker: string; title: string; items: string[] }>
  forYouHeading?: string
  forYouItems?: string[]
  comparisonDuration?: string
  comparisonBullets?: string[]
  otherOffer?: {
    _id: string
    title: string
    slug: string
    comparisonDuration?: string
    comparisonBullets?: string[]
  }
}

type SiteSettingsForOffer = {
  calBookingUrl?: string
  calNamespace?: string
} | null

const heroSubtitleComponents: PortableTextComponents = {
  marks: {
    em: ({ children }) => <em>{children}</em>,
    strong: ({ children }) => <strong>{children}</strong>,
  },
  block: {
    normal: ({ children }) => <>{children}</>,
  },
}

export type OfferPageTemplateProps = {
  offerPage: OfferPageTemplateData
  siteSettings?: SiteSettingsForOffer
}

export function OfferPageTemplate({ offerPage, siteSettings }: OfferPageTemplateProps) {
  const calBookingUrl =
    siteSettings?.calBookingUrl ?? 'https://cal.com/elianelarre/appel-decouverte'
  const calNamespace =
    siteSettings?.calNamespace ?? 'elianelarre/appel-decouverte'
  const calNamespaceSlug = calNamespace.split('/').pop() || 'appel-decouverte'

  const isSignaturePage = offerPage.slug === 'offre-signature'
  const processCards = offerPage.processCards ?? []
  const otherOffer = offerPage.otherOffer

  return (
    <>
      <main id="contenu-principal" className="offer-main">
        <section className="offer-hero">
          <div className="offer-hero-inner">
            {offerPage.heroEyebrow ? (
              <p className="offer-hero-eyebrow">{offerPage.heroEyebrow}</p>
            ) : null}
            <h1 className="offer-hero-title">{offerPage.title}</h1>
            {Array.isArray(offerPage.heroSubtitle) && offerPage.heroSubtitle.length > 0 ? (
              <p className="offer-hero-subtitle">
                <PortableText
                  value={offerPage.heroSubtitle as never}
                  components={heroSubtitleComponents}
                />
              </p>
            ) : null}
            {offerPage.heroPitch ? (
              <p className="offer-hero-pitch">{offerPage.heroPitch}</p>
            ) : null}
            <div className="offer-hero-actions">
              <a
                className="btn btn-primary"
                href={calBookingUrl}
                data-cal-link={calNamespace}
                data-cal-namespace={calNamespaceSlug}
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
              {offerPage.idealListHeading ?? ''}
            </h2>
            <ul className="offres-feature-list offer-list-block">
              {(offerPage.idealListItems ?? []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="offer-section" aria-labelledby="offer-includes-heading">
          <div className="offer-section-inner offer-section-inner--wide">
            <p className="eyebrow">Ce que tu reçois</p>
            <h2 className="offer-section-title" id="offer-includes-heading">
              {offerPage.includesHeading ?? ''}
            </h2>
            <div className="offer-process-grid">
              {processCards.map((card, index) => {
                const num = String(index + 1).padStart(2, '0')
                const titleId = `offer-card-${num}-title`
                return (
                  <article
                    key={`${offerPage._id}-process-${index}`}
                    className="offer-process-card"
                    aria-labelledby={titleId}
                  >
                    <div className="offer-process-card__head">
                      <span className="offer-process-card__num" aria-hidden="true">
                        {num}
                      </span>
                      <span className="offer-process-card__rule" aria-hidden="true" />
                      <p className="offer-process-card__kicker">{card.kicker}</p>
                    </div>
                    <h3 className="offer-process-card__title" id={titleId}>
                      {card.title}
                    </h3>
                    <ul
                      className="offer-line-list offer-process-card__list"
                      aria-labelledby={titleId}
                    >
                      {(card.items ?? []).map((line, j) => (
                        <li key={j}>{line}</li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="offer-section offer-section--plum" aria-labelledby="offer-for-you-heading">
          <div className="offer-section-inner">
            <p className="eyebrow">Tu te reconnais ?</p>
            <h2 className="offer-section-title" id="offer-for-you-heading">
              {offerPage.forYouHeading ?? ''}
            </h2>
            <ul className="offer-list-dots offer-list-block">
              {(offerPage.forYouItems ?? []).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="offer-section" id="comparaison" aria-labelledby="offer-compare-heading">
          <div className="offer-section-inner">
            <p className="eyebrow">Comparaison</p>
            <h2 className="offer-section-title" id="offer-compare-heading">
              Comparer les deux offres
            </h2>

            <div
              className={
                isSignaturePage
                  ? 'offer-compare-columns offer-compare-columns--signature-page'
                  : 'offer-compare-columns'
              }
            >
              <div className="offer-compare-col offer-compare-col--current">
                <p className="offer-compare-kicker offer-compare-kicker--current">Offre actuelle</p>
                <h3 className="offer-compare-col-title">{offerPage.title}</h3>
                {offerPage.comparisonDuration ? (
                  <p className="offer-compare-col-sub">{offerPage.comparisonDuration}</p>
                ) : null}
                <ul className="offres-feature-list offer-compare-list">
                  {(offerPage.comparisonBullets ?? []).map((line, i) => (
                    <li key={i}>{line}</li>
                  ))}
                </ul>
              </div>
              {otherOffer ? (
                <div
                  className={
                    isSignaturePage
                      ? 'offer-compare-col offer-compare-col--other'
                      : 'offer-compare-col'
                  }
                >
                  <p className="offer-compare-kicker">Autre offre</p>
                  <h3 className="offer-compare-col-title">{otherOffer.title}</h3>
                  {otherOffer.comparisonDuration ? (
                    <p className="offer-compare-col-sub">{otherOffer.comparisonDuration}</p>
                  ) : null}
                  <ul className="offres-feature-list offer-compare-list">
                    {(otherOffer.comparisonBullets ?? []).map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                  </ul>
                  <a
                    className="arrow-text-link offer-compare-other-link"
                    href={`/offres/${otherOffer.slug}`}
                  >
                    Voir cette offre
                    <span className="hero-ghost-arrow" aria-hidden="true">
                      →
                    </span>
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <a
        className="offer-sticky-cta"
        href={calBookingUrl}
        data-cal-link={calNamespace}
        data-cal-namespace={calNamespaceSlug}
        data-cal-config='{"layout":"month_view"}'
        data-offer-sticky-cta
        aria-label="Réserver un appel découverte"
        aria-hidden="true"
        tabIndex={-1}
      >
        Commencer maintenant
      </a>
    </>
  )
}
