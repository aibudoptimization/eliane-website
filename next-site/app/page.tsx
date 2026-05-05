import type {ReactNode} from 'react'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {TypedObject} from '@portabletext/types'
import Image from 'next/image'
import {portableTextToPlainText} from '@/lib/portableTextPlainText'
import {urlFor} from '@/sanity/imageUrl'
import {sanityFetch} from '@/sanity/live'
import {COLLABORATORS_QUERY, FAQS_QUERY, HOMEPAGE_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'

const heroHeadlineComponents: PortableTextComponents = {
  marks: {
    em: ({ children }) => (
      <span className="hero-headline-pull">
        <em>{children}</em>
      </span>
    ),
    strong: ({ children }) => <strong>{children}</strong>,
  },
  block: {
    normal: ({ children }) => <>{children}</>,
  },
}

type FaqItem = { _id: string; question?: string; answer?: unknown }
type Collaborator = {
  _id: string
  name?: string
  description?: string
  website?: string
  featured?: boolean
  logo?: {
    asset?: unknown
    alt?: string
  }
}
type PortableTextValue = TypedObject[]
type SledListItem = { _key?: string; text?: PortableTextValue }
type ReviewItem = { _key?: string; name?: string; rating?: number; excerpt?: string }

const faqAnswerComponents: PortableTextComponents = {
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({
      children,
      value,
    }: {
      children?: ReactNode
      value?: { href?: string; openInNewTab?: boolean }
    }) => {
      const href = value?.href
      if (!href) return <>{children}</>
      const openInNewTab = value.openInNewTab !== false
      return (
        <a
          href={href}
          target={openInNewTab ? '_blank' : undefined}
          rel={openInNewTab ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
  },
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="faq-answer-list">{children}</ul>,
    number: ({ children }) => (
      <ol className="faq-answer-list faq-answer-list--numbered">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>,
    number: ({ children }) => <li>{children}</li>,
  },
}

const sledItemComponents: PortableTextComponents = {
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
  },
  block: {
    normal: ({ children }) => <>{children}</>,
  },
}

const meetTrainerBodyComponents: PortableTextComponents = {
  marks: {
    strong: ({ children }) => <strong className="meet-trainer-strong">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
  },
  block: {
    normal: ({ children }) => <p>{children}</p>,
  },
}

export default async function Home() {
  const [
    { data: homePage },
    { data: faqs },
    { data: siteSettings },
    { data: collaborators },
  ] = await Promise.all([
    sanityFetch({ query: HOMEPAGE_QUERY }),
    sanityFetch({ query: FAQS_QUERY }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
    sanityFetch({ query: COLLABORATORS_QUERY }),
  ])

  const calBookingUrl =
    siteSettings?.bookingUrl ??
    siteSettings?.calBookingUrl ??
    'https://cal.com/elianelarre/appel-decouverte'
  const calLinkNamespace = (() => {
    try {
      const url = new URL(calBookingUrl)
      return url.hostname === 'cal.com' ? url.pathname.replace(/^\/+/, '') : ''
    } catch {
      return ''
    }
  })()
  const contactEmail = siteSettings?.contactEmail ?? 'info@elianelarre.com'
  const heroImageSrc =
    homePage?.heroImage?.asset != null
      ? urlFor(homePage.heroImage).width(1200).url()
      : '/images/eliane-hero.jpg'

  const forYouImageSrc =
    homePage?.forYouImage?.asset != null
      ? urlFor(homePage.forYouImage).width(1200).url()
      : '/images/eliane-hero.jpg'
  const meetTrainerImageSrc =
    homePage?.meetTrainerImage?.asset != null
      ? urlFor(homePage.meetTrainerImage).width(1200).url()
      : '/images/eliane-hero.jpg'
  const sledImageSrc =
    homePage?.sledImage?.asset != null
      ? urlFor(homePage.sledImage).width(1400).url()
      : '/images/eliane-mission-sled-push.png'
  const offeringImages = Array.isArray(homePage?.offeringImages) ? homePage.offeringImages : []
  const offeringFeatures = Array.isArray(homePage?.offeringFeatures) ? homePage.offeringFeatures : []
  const reviewsList: ReviewItem[] = Array.isArray(homePage?.reviewsList) ? homePage.reviewsList : []
  const featuredCollaborators = Array.isArray(collaborators)
    ? collaborators.filter((collaborator: Collaborator) => collaborator?.featured)
    : []
  const otherCollaborators = Array.isArray(collaborators)
    ? collaborators.filter((collaborator: Collaborator) => !collaborator?.featured)
    : []
  const heroKicker = (homePage?.heroKicker ?? 'ENTRAÎNEURE PERSONNELLE • MONTRÉAL').replace(
    /^\s*[•·]\s*/,
    '',
  )
  const heroCtaLabel = homePage?.heroCtaLabel ?? 'Je veux discuter de mes objectifs'
  const heroCtaSubtext =
    homePage?.heroCtaSubtext ??
    "Appel gratuit, sans engagement pour voir si l'accompagnement est adapté à toi."
  const meetTrainerCtaUrl =
    homePage?.meetTrainerCtaUrl ??
    siteSettings?.instagramUrl ??
    'https://www.instagram.com/eliane.au.naturel'
  const defaultMarqueeOneItems = [
    'Entraînements en présentiel',
    'À Montréal',
    '10+ années de pratique',
    'Approche personnalisée',
  ]
  const defaultMarqueeTwoItems = [
    'Approche durable',
    'Accompagnement personnalisé',
    'Progression mesurable',
  ]
  const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((entry) => typeof entry === 'string')
  const marqueeOneItems: string[] =
    Array.isArray(homePage?.marqueeOneItems) && homePage.marqueeOneItems.length > 0
      ? homePage.marqueeOneItems
      : defaultMarqueeOneItems
  const marqueeTwoItems: string[] =
    isStringArray(homePage?.marqueeTwoItems) && homePage.marqueeTwoItems.length === 3
      ? homePage.marqueeTwoItems
      : defaultMarqueeTwoItems

  if (
    process.env.NODE_ENV !== 'production' &&
    isStringArray(homePage?.marqueeTwoItems) &&
    homePage.marqueeTwoItems.length !== 3
  ) {
    console.warn(
      '[homepage] marqueeTwoItems should contain exactly 3 items; using fallback defaults instead.',
    )
  }

  const renderMarqueeItems = (items: string[]) =>
    items.flatMap((item, index) => [
      <span key={`${item}-${index}`}>{item}</span>,
      <span className="marquee-sep" key={`sep-${item}-${index}`}>
        ·
      </span>,
    ])

  const renderStatsMarqueeItems = (items: string[]) =>
    items.flatMap((item, index) => [
      <span key={`${item}-${index}`}>{item}</span>,
      <span className="stats-marquee-sep" key={`sep-${item}-${index}`}>
        ·
      </span>,
    ])

  return (
    <main
      id="contenu-principal"
      data-collaborators-count={collaborators?.length ?? 0}
    >
      
            <section className="hero" id="accueil">
              <div className="hero-visual">
                <p className="sr-only">Portrait d’Éliane.</p>
                <div className="hero-photo">
                  <Image
                    className="hero-img"
                    src={heroImageSrc}
                    alt={homePage?.heroImage?.alt ?? ''}
                    width={1200}
                    height={1500}
                    priority
                  />
                </div>
                <div className="hero-accent-bar" aria-hidden="true" />
              </div>
              <div className="hero-copy">
                <p className="hero-tag">{heroKicker}</p>
                <h1>
                  {Array.isArray(homePage?.heroHeadline) && homePage.heroHeadline.length > 0 ? (
                    <PortableText value={homePage.heroHeadline} components={heroHeadlineComponents} />
                  ) : (
                    <>
                      Un service personnalisé en présentiel pour t'aider à progresser{' '}
                      <span className="hero-headline-pull">
                        <em>de façon claire et durable</em>
                      </span>
                      .
                    </>
                  )}
                </h1>
                <p className="hero-lead">
                  {homePage?.heroSubheadline ??
                    "Un accompagnement sur mesure, conçu pour toi qui crois avoir tout essayé, mais qui n'arrives toujours pas à atteindre tes objectifs et à les maintenir."}
                </p>
                <div className="hero-actions">
                  <a
                    className="btn btn-primary"
                    href={calBookingUrl}
                    data-cal-link={calLinkNamespace || undefined}
                    data-cal-config={calLinkNamespace ? '{"layout":"month_view"}' : undefined}
                    >{heroCtaLabel}</a>
                  <p className="hero-cta-subtext">{heroCtaSubtext}</p>
                </div>
              </div>
            </section>
      
            <div className="marquee" role="presentation">
              <div className="marquee-track">
                <div className="marquee-inner" aria-hidden="true">
                  {renderMarqueeItems(marqueeOneItems)}
                  {renderMarqueeItems(marqueeOneItems)}
                </div>
                <div className="marquee-inner" aria-hidden="true">
                  {renderMarqueeItems(marqueeOneItems)}
                  {renderMarqueeItems(marqueeOneItems)}
                </div>
              </div>
            </div>
      
            <section
              className="stats"
              role="region"
              aria-label="Approche durable, accompagnement personnalisé, progression mesurable"
            >
              <div className="stats-desktop">
                {marqueeTwoItems.map((item, index) => (
                  <div className="stat reveal" data-reveal key={`desktop-stat-${item}-${index}`}>
                    <p className="stat-phrase">{item}</p>
                  </div>
                ))}
              </div>
              <div className="stats-marquee-wrap" role="presentation">
                <div className="stats-marquee-track">
                  <div className="stats-marquee-inner" aria-hidden="true">
                    {renderStatsMarqueeItems(marqueeTwoItems)}
                    {renderStatsMarqueeItems(marqueeTwoItems)}
                  </div>
                  <div className="stats-marquee-inner" aria-hidden="true">
                    {renderStatsMarqueeItems(marqueeTwoItems)}
                    {renderStatsMarqueeItems(marqueeTwoItems)}
                  </div>
                </div>
              </div>
            </section>
      
            <section className="section section-warm" id="approche">
              <div className="section-inner">
                <h2>
                  {Array.isArray(homePage?.sledHeadline) && homePage.sledHeadline.length > 0 ? (
                    <PortableText value={homePage.sledHeadline} components={heroHeadlineComponents} />
                  ) : (
                    'Tu veux progresser, mais tu ne veux plus avancer seule.'
                  )}
                </h2>
                <p className="sled-subheadline">
                  {homePage?.sledSubheadline ??
                    "Que tu débutes ou que tu t'entraînes déjà depuis un moment, l'objectif est le même : avoir un cadre clair, te sentir guidée et savoir que tu avances dans la bonne direction."}
                </p>

                <div className="sled-media">
                  <Image
                    src={sledImageSrc}
                    alt={homePage?.sledImage?.alt ?? "Éliane en effort sur un traîneau de poussée"}
                    width={1400}
                    height={900}
                  />
                </div>

                <div className="sled-columns">
                  <div className="sled-column">
                    <h3>{homePage?.sledFromTitle ?? "Là où tu es aujourd'hui"}</h3>
                    <ul>
                      {Array.isArray(homePage?.sledFromItems) &&
                        homePage.sledFromItems.map((item: SledListItem) => (
                          <li key={item._key}>
                            {Array.isArray(item?.text) ? (
                              <PortableText value={item.text} components={sledItemComponents} />
                            ) : null}
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div className="sled-columns-arrow" aria-hidden="true">
                    →
                  </div>

                  <div className="sled-column sled-column--to">
                    <h3>{homePage?.sledToTitle ?? "Là où je vais t'amener"}</h3>
                    <ul>
                      {Array.isArray(homePage?.sledToItems) &&
                        homePage.sledToItems.map((item: SledListItem) => (
                          <li key={item._key}>
                            {Array.isArray(item?.text) ? (
                              <PortableText value={item.text} components={sledItemComponents} />
                            ) : null}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>

                <div className="sled-cta">
                  <a
                    className="btn btn-primary"
                    href={calBookingUrl}
                    data-cal-link={calLinkNamespace || undefined}
                    data-cal-config={calLinkNamespace ? '{"layout":"month_view"}' : undefined}
                  >
                    {homePage?.sledCtaLabel ?? "C'est là que je veux aller"}
                  </a>
                </div>
              </div>
            </section>

            <section className="section section-muted" id="rencontre">
              <div className="section-inner">
                <h2 className="sr-only">Rencontre ton entraîneure</h2>
                <div className="meet-trainer">
                  <div className="meet-trainer-media">
                    <Image
                      src={meetTrainerImageSrc}
                      alt={homePage?.meetTrainerImage?.alt ?? "Portrait souriant d'Éliane Larre"}
                      width={1200}
                      height={1500}
                    />
                  </div>
                  <div className="meet-trainer-copy">
                    <p className="meet-trainer-kicker">
                      {homePage?.meetTrainerKicker ?? 'RENCONTRE TON ENTRAÎNEURE'}
                    </p>
                    {Array.isArray(homePage?.meetTrainerBody) && homePage.meetTrainerBody.length > 0 ? (
                      <PortableText
                        value={homePage.meetTrainerBody}
                        components={meetTrainerBodyComponents}
                      />
                    ) : null}
                    <p>
                      <a
                        className="arrow-text-link mission-instagram-link"
                        href={meetTrainerCtaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {homePage?.meetTrainerCtaLabel ?? 'Voir mon quotidien sur Instagram'}{' '}
                        <span className="hero-ghost-arrow" aria-hidden="true">
                          →
                        </span>
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {homePage?.pullQuoteEnabled && (
              <section className="section section-warm pull-quote-section">
                <div className="section-inner">
                  <blockquote className="pull-quote-block">
                    <p>
                      {homePage?.pullQuoteText ??
                        "Tu n'as pas besoin d'un autre programme. Tu as besoin d'un cadre, d'un regard expert et d'un accompagnement qui s'adapte réellement à toi."}
                    </p>
                  </blockquote>
                </div>
              </section>
            )}

            <section className="section section-warm" id="accompagnement">
              <div className="section-inner">
                <h2>{homePage?.offeringHeadline ?? 'Mon accompagnement personnalisé'}</h2>
                <div className="offering-images">
                  {offeringImages.map((image: Record<string, unknown>, index: number) => {
                    const src =
                      image?.asset != null
                        ? urlFor(image).width(900).url()
                        : '/images/eliane-hero.jpg'
                    const alt =
                      typeof image?.alt === 'string' && image.alt.trim().length > 0
                        ? image.alt
                        : `Aperçu de l'application d'entraînement ${index + 1}`

                    return (
                      <div className="offering-image-card" key={`${String(image?._key ?? index)}`}>
                        <Image src={src} alt={alt} width={720} height={1280} loading="lazy" />
                      </div>
                    )
                  })}
                </div>

                <div className="offering-features">
                  {offeringFeatures.map((feature: Record<string, unknown>, index: number) => (
                    <article className="offering-feature" key={`${String(feature?._key ?? index)}`}>
                      <h3>{typeof feature?.title === 'string' ? feature.title : ''}</h3>
                      <p>{typeof feature?.description === 'string' ? feature.description : ''}</p>
                    </article>
                  ))}
                </div>

                <div className="offering-cta">
                  <a
                    className="btn btn-primary"
                    href={calBookingUrl}
                    data-cal-link={calLinkNamespace || undefined}
                    data-cal-config={calLinkNamespace ? '{"layout":"month_view"}' : undefined}
                  >
                    {homePage?.offeringCtaLabel ??
                      "Je veux voir si l'accompagnement est adapté pour moi"}
                  </a>
                </div>
              </div>
            </section>

            <section className="section section-warm" id="presentiel">
              <div className="section-inner">
                <div className="presentiel-block reveal" data-reveal>
                  <h2>Pourquoi le <em>présentiel</em></h2>
                  <p className="presentiel-intro">
                    Parce que la façon dont on s'entraîne change tout. Voici ce que le présentiel t'offre que rien d'autre ne
                    peut remplacer.
                  </p>
                  <div className="presentiel-mid">
                    <div className="presentiel-benefits" role="list">
                      <article className="presentiel-benefit-cell" role="listitem">
                        <i className="presentiel-benefit__icon" data-lucide="eye" aria-hidden="true" />
                        <h3 className="presentiel-benefit__title">Correction en temps réel</h3>
                        <p className="presentiel-benefit__text">
                          J'ajuste ta technique pour maximiser ta progression et diminuer les risques de blessure.
                        </p>
                      </article>
                      <article className="presentiel-benefit-cell" role="listitem">
                        <i className="presentiel-benefit__icon" data-lucide="shield-check" aria-hidden="true" />
                        <h3 className="presentiel-benefit__title">Progression sécuritaire</h3>
                        <p className="presentiel-benefit__text">
                          Je t'aide à progresser tout en respectant ton rythme.
                        </p>
                      </article>
                      <article className="presentiel-benefit-cell" role="listitem">
                        <i className="presentiel-benefit__icon" data-lucide="calendar-check" aria-hidden="true" />
                        <h3 className="presentiel-benefit__title">Imputabilité</h3>
                        <p className="presentiel-benefit__text">
                          Le présentiel ajoute une structure qui soutient l'engagement.
                        </p>
                      </article>
                      <article className="presentiel-benefit-cell" role="listitem">
                        <i className="presentiel-benefit__icon" data-lucide="activity" aria-hidden="true" />
                        <h3 className="presentiel-benefit__title">Adaptation à ton état</h3>
                        <p className="presentiel-benefit__text">
                          Un entraînement sur mesure, pour toi, selon ton énergie, tes besoins et tes envies.
                        </p>
                      </article>
                    </div>
                  </div>
                  <p className="presentiel-closing">
                    <em
                      >{homePage?.inPersonPunchLine ??
                        "Un programme peut te dire quoi faire.\nUn accompagnement en présentiel te montre comment le faire et t'aide à progresser plus rapidement qu'en étant seule."}</em
                    >
                  </p>
                </div>
              </div>
            </section>
      
            <section className="section section-muted" id="temoignages">
              <div className="section-inner">
                <h2>{homePage?.reviewsHeadline ?? 'Leur expérience'}</h2>
                <div className="reviews-grid">
                  {reviewsList.map((review, index) => {
                    const rating = Math.max(0, Math.min(5, review.rating ?? 0))
                    const filledStars = '★'.repeat(rating)
                    const emptyStars = '☆'.repeat(5 - rating)
                    return (
                      <article className="review-card" key={`${String(review._key ?? index)}`}>
                        <h3>{review.name ?? ''}</h3>
                        <p className="review-stars" aria-label={`Note ${rating} sur 5`}>
                          <span aria-hidden="true">
                            {filledStars}
                            {emptyStars}
                          </span>
                        </p>
                        <p>{review.excerpt ?? ''}</p>
                      </article>
                    )
                  })}
                </div>
              </div>
            </section>

            <section className="section section-muted" id="pour-toi">
              <div className="section-inner">
                <h2 id="fit-bridge-heading">{homePage?.forYouHeadline ?? 'Pour toi ou pas?'}</h2>
                <div className="fit-bridge" role="region" aria-labelledby="fit-bridge-heading">
                  <div className="fit-bridge-layout">
                    <div className="fit-bridge-card fit-bridge-card--yes">
                      <p className="fit-bridge-kicker fit-bridge-kicker--yes">{homePage?.forYouYesTitle ?? "C'est pour toi si :"}</p>
                      <ul className="fit-bridge-list">
                        {(Array.isArray(homePage?.forYouYesItems) ? homePage.forYouYesItems : []).map(
                          (item: string, index: number) => (
                            <li className="fit-bridge-row" key={`yes-${index}`}>
                              <div className="fit-item">
                                <span className="fit-icon fit-icon--check" aria-hidden="true">
                                  ✓
                                </span>
                                <span>{item}</span>
                              </div>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                    <div className="fit-bridge-card fit-bridge-card--no">
                      <p className="fit-bridge-kicker fit-bridge-kicker--no">{homePage?.forYouNoTitle ?? "Ce n'est probablement pas pour toi si :"}</p>
                      <ul className="fit-bridge-list">
                        {(Array.isArray(homePage?.forYouNoItems) ? homePage.forYouNoItems : []).map(
                          (item: string, index: number) => (
                            <li className="fit-bridge-row" key={`no-${index}`}>
                              <div className="fit-item">
                                <span className="fit-icon fit-icon--cross fit-icon--cross-muted" aria-hidden="true">
                                  ×
                                </span>
                                <span>{item}</span>
                              </div>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="mission-photo">
                    <div className="mission-photo-frame">
                      <img
                        className="mission-photo-img"
                        src={forYouImageSrc}
                        alt={homePage?.forYouImage?.alt ?? "Éliane accotée sur la barre"}
                        width="682"
                        height="1024"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                  <p className="fit-bridge-footer">{homePage?.forYouFooter}</p>
                  <p className="fit-bridge-cta-row">
                    <a
                      className="btn btn-primary"
                      href={calBookingUrl}
                      data-cal-link={calLinkNamespace || undefined}
                      data-cal-config={calLinkNamespace ? '{"layout":"month_view"}' : undefined}
                    >
                      {homePage?.forYouCtaLabel ?? "Je veux savoir si c'est pour moi"}
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <section className="section section-warm" id="apres-appel">
              <div className="section-inner">
                <h2>{homePage?.afterCallHeadline ?? "Comment ça se passe après l'appel?"}</h2>
                <p className="after-call-intro">
                  {homePage?.afterCallIntro ?? "L'appel découverte sert à :"}
                </p>
                <ul className="after-call-list">
                  {(Array.isArray(homePage?.afterCallItems) ? homePage.afterCallItems : []).map(
                    (item: string, index: number) => (
                      <li key={`after-call-${index}`}>{item}</li>
                    ),
                  )}
                </ul>
                <p className="after-call-footer">
                  {homePage?.afterCallFooter ??
                    "L'appel est gratuit, sans engagement, et sert d'abord à voir si l'accompagnement est réellement pertinent pour toi."}
                </p>
                <p className="after-call-cta-row">
                  <a
                    className="btn btn-primary"
                    href={calBookingUrl}
                    data-cal-link={calLinkNamespace || undefined}
                    data-cal-config={calLinkNamespace ? '{"layout":"month_view"}' : undefined}
                  >
                    {homePage?.afterCallCtaLabel ?? "Je suis prête à avoir plus d'informations"}
                  </a>
                </p>
              </div>
            </section>

            <section className="section section-muted">
              <div className="section-inner purple-cta-band">
                <h2>{homePage?.purpleCtaHeadline ?? 'Es-tu prête à investir en toi ?'}</h2>
                <p className="purple-cta-button-row">
                  <a
                    className="btn btn-primary btn-purple-cta"
                    href={calBookingUrl}
                    data-cal-link={calLinkNamespace || undefined}
                    data-cal-config={calLinkNamespace ? '{"layout":"month_view"}' : undefined}
                  >
                    {homePage?.purpleCtaButtonLabel ?? "Je veux passer à l'action"}
                  </a>
                </p>
                <p className="purple-cta-footer">
                  {homePage?.purpleCtaFooter ?? 'Gratuit et sans engagement'}
                </p>
              </div>
            </section>

            <section className="faq-section" id="faq" aria-labelledby="faq-heading">
              <div className="faq-section-inner">
                <header className="faq-section-header reveal" data-reveal>
                  <h2 id="faq-heading">
                    {homePage?.faqHeadline ?? 'Questions fréquentes'}
                  </h2>
                </header>
                <div className="faq-layout">
                  <div className="faq-main">
                    <div className="faq-list" data-faq>
                      {faqs && faqs.length > 0 ? (
                        faqs.map((faq: FaqItem) => {
                          const panelId = `faq-panel-${faq._id}`
                          const triggerId = `faq-trigger-${faq._id}`
                          return (
                            <div className="faq-item" key={faq._id}>
                              <button
                                type="button"
                                className="faq-trigger"
                                aria-expanded="false"
                                aria-controls={panelId}
                                id={triggerId}
                              >
                                <span className="faq-trigger-label">{faq.question}</span>
                                <span className="faq-icon" aria-hidden="true">+</span>
                              </button>
                              <div
                                className="faq-panel"
                                id={panelId}
                                role="region"
                                aria-labelledby={triggerId}
                                hidden
                              >
                                <div className="faq-panel-inner faq-panel-inner--rich">
                                  {Array.isArray(faq.answer) && faq.answer.length > 0 ? (
                                    <PortableText
                                      value={faq.answer}
                                      components={faqAnswerComponents}
                                    />
                                  ) : typeof faq.answer === 'string' ? (
                                    <p>{faq.answer}</p>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          )
                        })
                      ) : null}
                    </div>
                  </div>
                  <aside className="faq-contact reveal" data-reveal aria-label="Contacter Éliane Larre">
                    <div className="faq-contact-card">
                      <p className="faq-section-eyebrow faq-contact-eyebrow">Contact</p>
                      <h3 className="faq-contact-title">
                        Une question&nbsp;? <em className="faq-contact-accent">Écris,moi.</em>
                      </h3>
                      <p className="faq-contact-body">
                        Pour toute question sur l'accompagnement, les offres ou la logistique, n'hésite pas. Je réponds
                        personnellement.
                      </p>
                      <a className="faq-contact-email" href={`mailto:${contactEmail}`}>{contactEmail}</a>
                      <div className="faq-contact-sep" role="presentation" />
                      <p className="faq-contact-or">ou</p>
                      <a
                        className="faq-contact-cal"
                        href={calBookingUrl}
                        data-cal-link={calLinkNamespace || undefined}
                        data-cal-config={calLinkNamespace ? '{"layout":"month_view"}' : undefined}
                        >Ou réserve directement un appel découverte<span className="faq-contact-cal-arrow" aria-hidden="true"> →</span></a
                      >
                    </div>
                  </aside>
                </div>
              </div>
              {faqs && faqs.length > 0 && (
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      '@context': 'https://schema.org',
                      '@type': 'FAQPage',
                      mainEntity: faqs.map((faq: { question?: string; answer?: unknown }) => ({
                        '@type': 'Question',
                        name: faq.question,
                        acceptedAnswer: {
                          '@type': 'Answer',
                          text: portableTextToPlainText(faq.answer),
                        },
                      })),
                    }),
                  }}
                />
              )}
            </section>

            {featuredCollaborators.length > 0 && (
              <section className="section section-warm" id="collaborateurs">
                <div className="section-inner">
                  <h2>{homePage?.collaboratorsHeadline ?? 'Mes collaborateurs'}</h2>
                  {homePage?.collaboratorsIntro ? (
                    <p className="collaborators-intro">{homePage.collaboratorsIntro}</p>
                  ) : null}

                  <div className="collaborators-featured">
                    {featuredCollaborators.map((collaborator: Collaborator) => {
                      const content = (
                        <>
                          {collaborator?.logo?.asset ? (
                            <Image
                              src={urlFor(collaborator.logo).width(600).url()}
                              alt={collaborator?.logo?.alt ?? collaborator?.name ?? 'Collaborateur'}
                              width={300}
                              height={160}
                            />
                          ) : (
                            <p className="collaborator-name">{collaborator?.name}</p>
                          )}
                          {collaborator?.description ? (
                            <p className="collaborator-description">{collaborator.description}</p>
                          ) : null}
                        </>
                      )

                      return collaborator?.website ? (
                        <a
                          key={collaborator._id}
                          className="collaborator-card collaborator-card--featured"
                          href={collaborator.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {content}
                        </a>
                      ) : (
                        <div
                          key={collaborator._id}
                          className="collaborator-card collaborator-card--featured"
                        >
                          {content}
                        </div>
                      )
                    })}
                  </div>

                  {otherCollaborators.length > 0 ? (
                    <ul className="collaborators-other">
                      {otherCollaborators.map((collaborator: Collaborator) => (
                        <li key={collaborator._id}>
                          {collaborator?.website ? (
                            <a href={collaborator.website} target="_blank" rel="noopener noreferrer">
                              {collaborator?.name}
                            </a>
                          ) : (
                            collaborator?.name
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            )}
          
    </main>
  );
}
