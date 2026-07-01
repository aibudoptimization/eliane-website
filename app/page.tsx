import type {ReactNode} from 'react'
import {PortableText, type PortableTextComponents} from '@portabletext/react'
import type {TypedObject} from '@portabletext/types'
import Image from 'next/image'
import {headingPortableTextComponents, RichText, SectionTitle} from '@/lib/portableTextComponents'
import {portableTextToPlainText} from '@/lib/portableTextPlainText'
import {MeetTrainerSection} from '@/app/components/MeetTrainerSection'
import {AccompagnementSection} from '@/app/components/AccompagnementSection'
import {PresentielSection, type PresentielCard} from '@/app/components/PresentielSection'
import {AfterCallSection} from '@/app/components/AfterCallSection'
import {PourToiSection} from '@/app/components/PourToiSection'
import {TestimonialsSection, type TestimonialVideoItem} from '@/app/components/TestimonialsSection'
import {urlFor} from '@/sanity/imageUrl'
import {sanityFetch} from '@/sanity/live'
import {COLLABORATORS_QUERY, FAQS_QUERY, HOMEPAGE_QUERY, SITE_SETTINGS_QUERY} from '@/sanity/queries'
import {SITE_URL} from '@/app/layout'
import {CAL_EMBED_DATA_CONFIG} from '@/lib/cal-embed-init'

/** Serializes a JSON-LD object and escapes `</` to prevent script-injection
 *  breakout when embedded in a `<script type="application/ld+json">` tag. */
function safeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

const DEFAULT_HERO_HEADLINE =
  "Un service d'accompagnement personnalisé pour t'entraîner avec confiance, progresser durablement et arrêter de toujours recommencer"

const DEFAULT_HERO_SUBHEADLINE =
  "Un accompagnement sur mesure, conçu pour toi qui veux intégrer l'entraînement à ta vie, ou pour toi qui crois avoir tout essayé sans jamais réussir à maintenir tes objectifs."

const heroHeadlineComponents = headingPortableTextComponents

function renderHeroHeadline(headline: PortableTextValue | undefined): ReactNode {
  if (headline?.length) {
    return <PortableText value={headline} components={heroHeadlineComponents} />
  }
  return DEFAULT_HERO_HEADLINE
}

const DEFAULT_APPROCHE_HEADLINE = 'Tu veux progresser, mais tu ne veux plus avancer seule.'
const DEFAULT_APPROCHE_SUBHEADLINE =
  "Que tu débutes ou que tu t'entraînes déjà depuis un moment, l'objectif est le même : avoir un cadre clair, te sentir guidée et savoir que tu avances dans la bonne direction."

/** Matches default Approche title so we can apply desktop line-break layouts. */
const APPROCHE_HEADLINE_PATTERN =
  /^Tu veux progresser,\s*mais\s+tu\s+ne veux plus avancer seule\.?$/i

function portableTextHasMarks(value: PortableTextValue): boolean {
  for (const block of value) {
    if (block._type !== 'block' || !Array.isArray((block as {children?: unknown[]}).children)) {
      continue
    }
    for (const child of (block as unknown as {children: {_type?: string; marks?: string[]}[]})
      .children) {
      if (child._type === 'span' && Array.isArray(child.marks) && child.marks.length > 0) {
        return true
      }
    }
  }
  return false
}

function renderApprocheHeadline(headline: PortableTextValue | undefined): ReactNode {
  if (headline?.length && portableTextHasMarks(headline)) {
    return <PortableText value={headline} components={heroHeadlineComponents} />
  }

  const text = headline?.length
    ? portableTextToPlainText(headline).trim()
    : DEFAULT_APPROCHE_HEADLINE

  if (headline?.length && !portableTextHasMarks(headline)) {
    return text
  }

  if (!APPROCHE_HEADLINE_PATTERN.test(text)) {
    return text
  }

  return (
    <span className="approche-headline">
      <span className="approche-headline-flow">{text}</span>
      <span className="approche-headline-layout approche-headline-layout--wide">
        Tu veux progresser,
        <br />
        mais tu ne veux plus avancer seule.
      </span>
      <span className="approche-headline-layout approche-headline-layout--medium">
        Tu veux progresser,
        <br />
        mais tu
        <br />
        ne veux plus avancer seule.
      </span>
      <span className="approche-headline-layout approche-headline-layout--narrow">
        Tu veux progresser, mais
        <br />
        tu
        <br />
        ne veux plus avancer seule.
      </span>
    </span>
  )
}

function HeroCtaArrow() {
  return (
    <svg
      width="16"
      height="16"
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
  )
}

type MeetTrainerCard = {_key?: string; label?: string; body?: string}
type OfferingPillar = {_key?: string; title?: string; description?: string}
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
  const offeringImages = Array.isArray(homePage?.offeringImages) ? homePage.offeringImages : []
  const offeringAppImageSrc = (() => {
    if (homePage?.offeringAppImage?.asset != null) {
      return urlFor(homePage.offeringAppImage).width(1200).url()
    }
    const legacy = offeringImages[0]
    if (legacy?.asset != null) {
      return urlFor(legacy).width(1200).url()
    }
    return '/images/eliane-hero.jpg'
  })()
  const offeringAppImageLightboxSrc = (() => {
    if (homePage?.offeringAppImage?.asset != null) {
      return urlFor(homePage.offeringAppImage).width(2400).url()
    }
    const legacy = offeringImages[0]
    if (legacy?.asset != null) {
      return urlFor(legacy).width(2400).url()
    }
    return offeringAppImageSrc
  })()
  const offeringAppImageAlt =
    homePage?.offeringAppImage?.alt ??
    (typeof offeringImages[0]?.alt === 'string' ? offeringImages[0].alt : undefined)
  const reviewsList: ReviewItem[] = Array.isArray(homePage?.reviewsList) ? homePage.reviewsList : []
  const testimonialVideos: TestimonialVideoItem[] | undefined = (() => {
    type SanityTestimonialVideo = {
      _key?: string
      reviewerName?: string
      reviewerRole?: string
      video?: {asset?: {url?: string}}
      poster?: {asset?: unknown}
    }
    const fromSanity = Array.isArray(homePage?.testimonialVideos)
      ? (homePage.testimonialVideos as SanityTestimonialVideo[])
      : []
    const mapped = fromSanity
      .map((entry) => ({
        _key: entry._key,
        name: entry.reviewerName?.trim() ?? '',
        role: entry.reviewerRole?.trim() || 'Cliente',
        videoSrc: typeof entry.video?.asset?.url === 'string' ? entry.video.asset.url : undefined,
        posterSrc:
          entry.poster?.asset != null ? urlFor(entry.poster as Parameters<typeof urlFor>[0]).width(600).url() : undefined,
      }))
      .filter((entry) => entry.name)

    if (mapped.length > 0) return mapped

    if (reviewsList.length > 0) {
      return reviewsList
        .map((review, index) => ({
          _key: review._key ?? `legacy-review-${index}`,
          name: review.name?.trim() ?? '',
          role: 'Cliente',
        }))
        .filter((entry) => entry.name)
    }

    return undefined
  })()
  const featuredCollaborators = Array.isArray(collaborators)
    ? collaborators.filter((collaborator: Collaborator) => collaborator?.featured)
    : []
  const otherCollaborators = Array.isArray(collaborators)
    ? collaborators.filter((collaborator: Collaborator) => !collaborator?.featured)
    : []
  const heroKicker =
    homePage?.heroKicker ?? 'Éliane Larre - Entraîneure personnelle à Montréal'
  const heroCtaLabel = homePage?.heroCtaLabel ?? 'Je veux discuter de mes objectifs'
  const heroCtaSubtext =
    homePage?.heroCtaSubtext ??
    "Appel gratuit, sans engagement pour voir si l'accompagnement est adapté à toi."
  const instagramUrl =
    siteSettings?.instagramUrl ??
    'https://www.instagram.com/eliane.au.naturel'
  const meetTrainerCtaUrl =
    homePage?.meetTrainerCtaUrl ??
    instagramUrl
  const defaultMarqueeItems = [
    'Entraînements en présentiel',
    'À Montréal',
    '10+ années de pratique',
    'Approche personnalisée',
    'Approche durable',
    'Progression mesurable',
  ]
  const isStringArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every((entry) => typeof entry === 'string')

  const mergeLegacyMarqueeItems = (): string[] => {
    const legacy = [
      ...(isStringArray(homePage?.marqueeOneItems) ? homePage.marqueeOneItems : []),
      ...(isStringArray(homePage?.marqueeTwoItems) ? homePage.marqueeTwoItems : []),
    ]
    const seen = new Set<string>()
    return legacy.filter((item) => {
      if (seen.has(item)) return false
      seen.add(item)
      return true
    })
  }

  const marqueeItems: string[] = (() => {
    if (isStringArray(homePage?.marqueeItems) && homePage.marqueeItems.length >= 2) {
      return homePage.marqueeItems
    }
    const legacy = mergeLegacyMarqueeItems()
    return legacy.length >= 2 ? legacy : defaultMarqueeItems
  })()

  const renderMarqueeStrip = (items: string[], stripKey: string) =>
    items.flatMap((item, index) => [
      <span key={`${stripKey}-${item}-${index}`}>{item}</span>,
      <span className="marquee-dot" key={`${stripKey}-dot-${item}-${index}`} aria-hidden="true">
        ·
      </span>,
    ])

  return (
    <main
      id="contenu-principal"
      data-collaborators-count={collaborators?.length ?? 0}
    >
      
            <section className="hero" id="accueil">
              <div className="hero-inner">
                <div className="hero-stage">
                  <div className="hero-content reveal" data-reveal>
                    <div className="eyebrow">{heroKicker}</div>
                    <h1>
                      {renderHeroHeadline(
                        Array.isArray(homePage?.heroHeadline) && homePage.heroHeadline.length > 0
                          ? (homePage.heroHeadline as PortableTextValue)
                          : undefined,
                      )}
                    </h1>
                    <div className="hero-lead">
                      <RichText
                        value={homePage?.heroSubheadline}
                        fallback={DEFAULT_HERO_SUBHEADLINE}
                      />
                    </div>
                    <div className="hero-cta-stack">
                      <a className="btn btn-primary" href="/#accompagnement">
                        {heroCtaLabel}
                        <HeroCtaArrow />
                      </a>
                      <p className="hero-cta-note">{heroCtaSubtext}</p>
                    </div>
                  </div>
                  <div className="hero-image-frame reveal" data-reveal>
                    <div className="hero-image-inner" data-hero-parallax>
                      <Image
                        className="hero-img"
                        src={heroImageSrc}
                        alt={
                          homePage?.heroImage?.alt ??
                          'Éliane Larre, entraîneure personnelle à Montréal, tenant un haltère dans la salle d\'entraînement'
                        }
                        width={1000}
                        height={1200}
                        sizes="(max-width: 900px) 100vw, 50vw"
                        priority
                      />
                    </div>
                  </div>
                </div>
                <div className="hero-stats reveal" data-reveal>
                  <div>
                    <div className="hero-stat-num">
                      <span data-count="10">0</span>+
                    </div>
                    <div className="hero-stat-label">Années de pratique</div>
                  </div>
                  <div>
                    <div className="hero-stat-num">
                      <span data-count="100">0</span>%
                    </div>
                    <div className="hero-stat-label">Personnalisé</div>
                  </div>
                  <div>
                    <div className="hero-stat-num">
                      <span data-count="5">0</span>★
                    </div>
                    <div className="hero-stat-label">Note clientes</div>
                  </div>
                </div>
              </div>
            </section>
      
            <div className="marquee" aria-hidden="true">
              <div className="marquee-track">
                <div className="marquee-strip">{renderMarqueeStrip(marqueeItems, 'a')}</div>
                <div className="marquee-strip" aria-hidden="true">
                  {renderMarqueeStrip(marqueeItems, 'b')}
                </div>
              </div>
            </div>
      
            <section className="section section-approche" id="approche">
              <div className="section-inner section-inner--approche">
                <div className="approche-panel">
                  <header className="approche-intro">
                    <p className="eyebrow approche-eyebrow">
                      {homePage?.sledEyebrow ?? 'Approche'}
                    </p>
                    <h2>{renderApprocheHeadline(homePage?.sledHeadline)}</h2>
                    <RichText
                      className="approche-subhead"
                      value={homePage?.sledSubheadline}
                      fallback={DEFAULT_APPROCHE_SUBHEADLINE}
                    />
                  </header>

                  <div className="approche-transform-row" data-approche-carousel>
                    <div className="approche-card approche-card--from">
                      <p className="approche-card-label">
                        {homePage?.sledFromTitle ?? "Là où tu es aujourd'hui"}
                      </p>
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

                    <div className="approche-transform-arrow" aria-hidden="true">
                      <svg
                        width="38"
                        height="38"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>

                    <div className="approche-card approche-card--to">
                      <p className="approche-card-label">
                        {homePage?.sledToTitle ?? "Là où je vais t'amener"}
                      </p>
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

                  {/* Mobile swipe-hint dots — hidden on desktop/tablet via CSS */}
                  <div className="approche-dots" aria-hidden="true">
                    <span className="approche-dot is-active" />
                    <span className="approche-dot" />
                  </div>

                  <div className="approche-footer">
                    <a
                      className="btn btn-primary approche-cta"
                      href={calBookingUrl}
                      data-cal-link={calLinkNamespace || undefined}
                      data-cal-config={calLinkNamespace ? CAL_EMBED_DATA_CONFIG : undefined}
                    >
                      {homePage?.sledCtaLabel ?? "C'est là que je veux aller"}
                      <HeroCtaArrow />
                    </a>
                  </div>
                </div>
              </div>
            </section>

            <MeetTrainerSection
              kicker={homePage?.meetTrainerKicker}
              imageSrc={meetTrainerImageSrc}
              imageAlt={homePage?.meetTrainerImage?.alt ?? "Portrait souriant d'Éliane Larre"}
              cards={
                Array.isArray(homePage?.meetTrainerCards)
                  ? (homePage.meetTrainerCards as MeetTrainerCard[])
                  : undefined
              }
              quote={homePage?.meetTrainerQuote}
              ctaLabel={homePage?.meetTrainerCtaLabel}
              ctaUrl={meetTrainerCtaUrl}
            />

            <AccompagnementSection
              eyebrow={homePage?.offeringEyebrow}
              title={homePage?.offeringTitle}
              lead={homePage?.offeringLead}
              pillars={
                Array.isArray(homePage?.offeringFeatures)
                  ? (homePage.offeringFeatures as OfferingPillar[])
                  : undefined
              }
              appKicker={homePage?.offeringAppKicker}
              appTitle={homePage?.offeringAppTitle}
              appDescription={homePage?.offeringAppDescription}
              appImageSrc={offeringAppImageSrc}
              appImageLightboxSrc={offeringAppImageLightboxSrc}
              appImageAlt={offeringAppImageAlt}
              ctaLabel={homePage?.offeringCtaLabel}
              ctaUrl={calBookingUrl}
              calLinkNamespace={calLinkNamespace || undefined}
            />

            <PresentielSection
              eyebrow={homePage?.inPersonEyebrow ?? homePage?.inPersonHeadline}
              title={homePage?.inPersonTitle}
              intro={homePage?.inPersonIntro}
              cards={
                Array.isArray(homePage?.presentielCards)
                  ? (homePage.presentielCards as PresentielCard[])
                  : undefined
              }
              legacyBenefits={
                Array.isArray(homePage?.inPersonBenefits) ? homePage.inPersonBenefits : undefined
              }
              quote={homePage?.locationQuote}
              legacyQuote={homePage?.inPersonPunchLine}
              locEyebrow={homePage?.inPersonLocEyebrow}
              locVenue={homePage?.inPersonLocVenue}
              locStreet={homePage?.inPersonLocStreet}
              locCityLine={homePage?.inPersonLocCityLine}
            />
      
            <TestimonialsSection
              eyebrow={homePage?.reviewsEyebrow ?? homePage?.reviewsHeadline}
              title={homePage?.reviewsTitle}
              videos={testimonialVideos}
              instagramUrl={instagramUrl}
            />

            <PourToiSection
              eyebrow={homePage?.forYouEyebrow ?? homePage?.forYouHeadline}
              title={homePage?.forYouTitle}
              yesLabel={homePage?.forYouYesTitle}
              yesItems={
                Array.isArray(homePage?.forYouYesItems) ? (homePage.forYouYesItems as string[]) : undefined
              }
              noLabel={homePage?.forYouNoTitle}
              noItems={
                Array.isArray(homePage?.forYouNoItems) ? (homePage.forYouNoItems as string[]) : undefined
              }
              footer={homePage?.forYouFooter}
              ctaLabel={homePage?.forYouCtaLabel}
              ctaUrl={calBookingUrl}
              calLinkNamespace={calLinkNamespace || undefined}
              imageSrc={forYouImageSrc}
              imageAlt={homePage?.forYouImage?.alt}
            />

            <AfterCallSection
              eyebrow={homePage?.afterCallEyebrow}
              title={homePage?.afterCallHeadline}
              intro={homePage?.afterCallIntro ?? homePage?.afterCallFooter}
              steps={
                Array.isArray(homePage?.afterCallSteps)
                  ? (homePage.afterCallSteps as Array<{title?: string; description?: string}>)
                  : undefined
              }
              ctaLabel={homePage?.afterCallCtaLabel}
              ctaUrl={calBookingUrl}
              calLinkNamespace={calLinkNamespace || undefined}
            />

            <section className="section section-muted">
              <div className="section-inner purple-cta-band">
                <p className="purple-cta-band-eyebrow">
                  {homePage?.purpleCtaEyebrow ?? 'Prochaine étape'}
                </p>
                <div className="purple-cta-band-accent-bar" aria-hidden="true" />
                <h2>
                  <SectionTitle
                    value={homePage?.purpleCtaHeadline}
                    fallback="Es-tu prête à investir en toi ?"
                  />
                </h2>
                <p className="purple-cta-button-row">
                  <a
                    className="btn btn-purple-cta"
                    href={calBookingUrl}
                    data-cal-link={calLinkNamespace || undefined}
                    data-cal-config={calLinkNamespace ? CAL_EMBED_DATA_CONFIG : undefined}
                  >
                    {homePage?.purpleCtaButtonLabel ?? "Je veux passer à l'action"}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </p>
                <p className="purple-cta-footer">
                  {homePage?.purpleCtaFooter ?? 'Gratuit et sans engagement'}
                </p>
              </div>
            </section>

            <section className="faq-section" id="faq" aria-labelledby="faq-heading">
              <div className="faq-section-inner">
                <div className="faq-layout">
                  {/* LEFT — heading + Instagram-first contact */}
                  <div className="faq-intro-col reveal" data-reveal>
                    <p className="faq-section-eyebrow">{homePage?.faqEyebrow ?? 'FAQ'}</p>
                    <h2 id="faq-heading">
                      <SectionTitle
                        value={homePage?.faqHeadline}
                        fallback="Questions fréquentes."
                      />
                    </h2>
                    <div className="faq-contact-body faq-intro-body">
                      <RichText
                        value={homePage?.faqSubheadline}
                        fallback="Pour toute question sur l'accompagnement, les offres ou la logistique, n'hésite pas. Je réponds personnellement."
                      />
                    </div>
                    <a
                      className="faq-contact-instagram"
                      href={instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Contacter Éliane sur Instagram (nouvel onglet)"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z" />
                      </svg>
                      Écrire sur Instagram
                    </a>
                    <a className="faq-contact-email-subtle" href={`mailto:${contactEmail}`}>
                      ou par courriel&nbsp;: {contactEmail}
                    </a>
                  </div>

                  {/* RIGHT — accordion list */}
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
                </div>
              </div>
              {faqs && faqs.length > 0 && (
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: safeJsonLd({
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

            {(featuredCollaborators.length > 0 || otherCollaborators.length > 0) && (
              <section className="section section-warm" id="collaborateurs">
                <div className="section-inner collaborators-inner">
                  <p className="collaborators-eyebrow" aria-hidden="true">
                    {homePage?.collaboratorsHeadline ?? 'Mes collaborateurs'}
                  </p>
                  <ul className="collaborators-list" aria-label={homePage?.collaboratorsHeadline ?? 'Mes collaborateurs'}>
                    {[...featuredCollaborators, ...otherCollaborators].map((collaborator: Collaborator) => (
                      <li key={collaborator._id} className="collaborators-item">
                        {collaborator?.website ? (
                          <a
                            className="collaborators-item-link"
                            href={collaborator.website}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {collaborator?.logo?.asset ? (
                              <Image
                                className="collaborators-logo"
                                src={urlFor(collaborator.logo).width(400).url()}
                                alt={collaborator?.logo?.alt ?? collaborator?.name ?? 'Collaborateur'}
                                width={200}
                                height={80}
                                sizes="(max-width: 600px) 120px, 200px"
                              />
                            ) : (
                              <span className="collaborators-name">{collaborator?.name}</span>
                            )}
                          </a>
                        ) : collaborator?.logo?.asset ? (
                          <Image
                            className="collaborators-logo"
                            src={urlFor(collaborator.logo).width(400).url()}
                            alt={collaborator?.logo?.alt ?? collaborator?.name ?? 'Collaborateur'}
                            width={200}
                            height={80}
                            sizes="(max-width: 600px) 120px, 200px"
                          />
                        ) : (
                          <span className="collaborators-name">{collaborator?.name}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            )}

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: safeJsonLd({
                  '@context': 'https://schema.org',
                  '@type': 'HealthAndBeautyBusiness',
                  name: 'Éliane Larre — Entraîneure personnelle',
                  url: SITE_URL,
                  image: `${SITE_URL}/opengraph-image.png`,
                  email: contactEmail,
                  description:
                    "Entraîneure personnelle privée à Montréal. Accompagnement personnalisé en présentiel — séances privées, suivi et programmes sur mesure pour les femmes. Accessible sur Instagram 7j/7.",
                  areaServed: 'Montréal, QC',
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Montréal',
                    addressRegion: 'QC',
                    addressCountry: 'CA',
                  },
                  availableLanguage: 'fr-CA',
                  sameAs: [instagramUrl],
                  aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '5',
                    bestRating: '5',
                    ratingCount: '3',
                  },
                }),
              }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: safeJsonLd({
                  '@context': 'https://schema.org',
                  '@type': 'Person',
                  name: 'Éliane Larre',
                  jobTitle: 'Entraîneure personnelle',
                  url: SITE_URL,
                  sameAs: ['https://www.instagram.com/eliane.au.naturel'],
                  worksFor: {
                    '@type': 'HealthAndBeautyBusiness',
                    name: 'Éliane Larre — Entraîneure personnelle',
                    address: {
                      '@type': 'PostalAddress',
                      streetAddress: '220 Boulevard Crémazie Ouest',
                      addressLocality: 'Montréal',
                      addressRegion: 'QC',
                      postalCode: 'H2P 1C6',
                      addressCountry: 'CA',
                    },
                  },
                }),
              }}
            />
          
    </main>
  );
}
