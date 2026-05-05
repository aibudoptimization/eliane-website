import type { ReactNode } from 'react'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { urlFor } from '@/sanity/imageUrl'
import { portableTextToPlainText } from '@/lib/portableTextPlainText'
import { sanityFetch } from '@/sanity/live'
import {
  HOMEPAGE_QUERY,
  FAQS_QUERY,
  COLLABORATORS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/sanity/queries'

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

const introHeadlineComponents: PortableTextComponents = {
  marks: {
    em: ({ children }) => <em>{children}</em>,
    strong: ({ children }) => <strong>{children}</strong>,
  },
  block: {
    normal: ({ children }) => <>{children}</>,
  },
}

const freeWeightsBulletComponents: PortableTextComponents = {
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
  },
  block: {
    normal: ({ children }) => <>{children}</>,
  },
}

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
    siteSettings?.calBookingUrl ?? 'https://cal.com/elianelarre/appel-decouverte'
  const calNamespace =
    siteSettings?.calNamespace ?? 'elianelarre/appel-decouverte'
  const calNamespaceSlug =
    calNamespace.split('/').pop() || 'appel-decouverte'
  const contactEmail = siteSettings?.contactEmail ?? 'info@elianelarre.com'
  const instagramUrl =
    siteSettings?.instagramUrl ?? 'https://www.instagram.com/eliane.au.naturel'

  const heroImageSrc =
    homePage?.heroImage?.asset != null
      ? urlFor(homePage.heroImage).width(1200).url()
      : '/images/eliane-hero.jpg'

  const introImageSrc =
    homePage?.introImage?.asset != null
      ? urlFor(homePage.introImage).width(1200).url()
      : '/images/eliane-intro-training.png'

  const approachImageSrc =
    homePage?.approachImage?.asset != null
      ? urlFor(homePage.approachImage).width(1400).url()
      : '/images/eliane-mission-sled-push.png'

  const freeWeightsImageSrc =
    homePage?.freeWeightsImage?.asset != null
      ? urlFor(homePage.freeWeightsImage).width(1200).url()
      : '/images/eliane-poids-libres.png'

  return (
    <main
      id="contenu-principal"
      data-collaborators-count={collaborators?.length ?? 0}
    >
      
            <section className="hero" id="accueil">
              <div className="hero-copy">
                <p className="hero-tag">Entraîneure personnelle • Montréal</p>
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
                    data-cal-link={calNamespace}
                    data-cal-namespace={calNamespaceSlug}
                    data-cal-config='{"layout":"month_view"}'
                    >Appel découverte</a>
                  <a className="btn btn-ghost hero-secondary-cta" href="#faq"
                    >Voir la FAQ<span className="hero-ghost-arrow" aria-hidden="true">→</span></a>
                </div>
              </div>
              <div className="hero-visual">
                <p className="sr-only">Portrait d’Éliane.</p>
                <div className="hero-photo">
                  <img
                    className="hero-img"
                    src={heroImageSrc}
                    alt={homePage?.heroImage?.alt ?? ''}
                    width="2400"
                    height="3000"
                    fetchPriority="high"
                  />
                </div>
                <div className="hero-accent-bar" aria-hidden="true" />
              </div>
            </section>
      
            <div className="marquee" role="presentation">
              <div className="marquee-track">
                <div className="marquee-inner" aria-hidden="true">
                  <span>Entraînements en présentiel</span><span className="marquee-sep">·</span><span>À Montréal</span
                  ><span className="marquee-sep">·</span><span>10+ années de pratique</span
                  ><span className="marquee-sep">·</span><span>Approche personnalisée</span><span className="marquee-sep">·</span>
                  <span>Entraînements en présentiel</span><span className="marquee-sep">·</span><span>À Montréal</span
                  ><span className="marquee-sep">·</span><span>10+ années de pratique</span
                  ><span className="marquee-sep">·</span><span>Approche personnalisée</span><span className="marquee-sep">·</span>
                </div>
                <div className="marquee-inner" aria-hidden="true">
                  <span>Entraînements en présentiel</span><span className="marquee-sep">·</span><span>À Montréal</span
                  ><span className="marquee-sep">·</span><span>10+ années de pratique</span
                  ><span className="marquee-sep">·</span><span>Approche personnalisée</span><span className="marquee-sep">·</span>
                  <span>Entraînements en présentiel</span><span className="marquee-sep">·</span><span>À Montréal</span
                  ><span className="marquee-sep">·</span><span>10+ années de pratique</span
                  ><span className="marquee-sep">·</span><span>Approche personnalisée</span><span className="marquee-sep">·</span>
                </div>
              </div>
            </div>
      
            <div
              className="stats"
              role="region"
              aria-label="Approche durable, accompagnement sur mesure, progression mesurable"
            >
              <div className="stats-desktop">
                <div className="stat reveal" data-reveal>
                  <p className="stat-phrase">Approche durable</p>
                </div>
                <div className="stat reveal" data-reveal>
                  <p className="stat-phrase">Accompagnement sur mesure</p>
                </div>
                <div className="stat reveal" data-reveal>
                  <p className="stat-phrase">Progression mesurable</p>
                </div>
              </div>
              <div className="stats-marquee-wrap" role="presentation">
                <div className="stats-marquee-track">
                  <div className="stats-marquee-inner" aria-hidden="true">
                    <span>Approche durable</span><span className="stats-marquee-sep">·</span><span>Accompagnement sur mesure</span
                    ><span className="stats-marquee-sep">·</span><span>Progression mesurable</span
                    ><span className="stats-marquee-sep">·</span><span>Approche durable</span
                    ><span className="stats-marquee-sep">·</span><span>Accompagnement sur mesure</span
                    ><span className="stats-marquee-sep">·</span><span>Progression mesurable</span
                    ><span className="stats-marquee-sep">·</span>
                  </div>
                  <div className="stats-marquee-inner" aria-hidden="true">
                    <span>Approche durable</span><span className="stats-marquee-sep">·</span><span>Accompagnement sur mesure</span
                    ><span className="stats-marquee-sep">·</span><span>Progression mesurable</span
                    ><span className="stats-marquee-sep">·</span><span>Approche durable</span
                    ><span className="stats-marquee-sep">·</span><span>Accompagnement sur mesure</span
                    ><span className="stats-marquee-sep">·</span><span>Progression mesurable</span
                    ><span className="stats-marquee-sep">·</span>
                  </div>
                </div>
              </div>
            </div>
      
            <section className="section section-warm" id="introduction">
              <div className="section-inner intro-stack">
                <div className="intro-top reveal" data-reveal>
                  <span className="eyebrow eyebrow--with-anchor">Introduction</span>
                  <h2>
                    {Array.isArray(homePage?.introHeadline) && homePage.introHeadline.length > 0 ? (
                      <PortableText value={homePage.introHeadline} components={introHeadlineComponents} />
                    ) : (
                      <>
                        Accompagnement personnalisé <br />
                        <em>en présentiel à Montréal</em>
                      </>
                    )}
                  </h2>
                  <p className="lead intro-subhead">
                    {homePage?.introDescription ??
                      "J'offre un accompagnement personnalisé avec séances en présentiel pour t'aider à progresser de façon structurée, sécuritaire et adaptée à tes objectifs."}
                  </p>
                </div>
                <div className="intro-bottom">
                  <div className="intro-photo">
                    <div className="intro-photo-sticky">
                      <div className="intro-photo-reveal reveal" data-reveal>
                        <div className="intro-photo-frame">
                          <img
                            className="intro-photo-img"
                            src={introImageSrc}
                            alt={
                              homePage?.introImage?.alt ??
                              "Éliane, entraîneure personnelle à Montréal, s'entraînant avec un haltère en salle."
                            }
                            width="682"
                            height="1024"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="intro-column-rule" aria-hidden="true" />
                  <aside className="intro-aside reveal" data-reveal>
                    <h3 className="intro-benefits-heading">Ce que tu reçois</h3>
                    <div className="intro-benefits">
                      <div className="intro-benefits-group">
                        <p className="intro-group-label" id="intro-g-programme">Programme d'entraînement</p>
                        <ul className="intro-list" aria-labelledby="intro-g-programme">
                          <li><span className="intro-list__body">Programme conçu selon tes objectifs et ton expérience</span></li>
                          <li><span className="intro-list__body">Programme adapté pour le gym ou la maison</span></li>
                          <li><span className="intro-list__body">Ajustements illimités</span></li>
                          <li>
                            <span className="intro-list__body"
                              >1 séance en présentiel par semaine<span className="intro-footnote-ref">*</span></span>
                          </li>
                        </ul>
                      </div>
                      <div className="intro-benefits-group">
                        <p className="intro-group-label" id="intro-g-suivi">Suivi</p>
                        <ul className="intro-list" aria-labelledby="intro-g-suivi">
                          <li>
                            <span className="intro-list__body"
                              >Accès à moi 7 jours sur 7<span className="intro-footnote-ref">*</span> via message direct pour tes
                              questions et ton soutien</span>
                          </li>
                          <li><span className="intro-list__body">Accès à ton application pour suivre ta progression</span></li>
                        </ul>
                      </div>
                      <div className="intro-benefits-group">
                        <p className="intro-group-label" id="intro-g-nutrition">Nutrition</p>
                        <ul className="intro-list" aria-labelledby="intro-g-nutrition">
                          <li>
                            <span className="intro-list__body">Journal alimentaire<span className="intro-footnote-ref">*</span></span>
                          </li>
                          <li><span className="intro-list__body">Conseils adaptés à tes objectifs</span></li>
                        </ul>
                      </div>
                      <p className="intro-benefits-footnote">
                        <span className="intro-footnote-ref intro-footnote-ref--lead">*</span> Selon l'offre sélectionnée
                      </p>
                    </div>
                  </aside>
                </div>
              </div>
            </section>
      
            <div className="cta-inline">
              <div className="cta-inline-inner">
                <h2 className="cta-inline-headline reveal" data-reveal>
                  Es-tu prête à <em>progresser vers tes objectifs</em>&nbsp;?
                </h2>
                <div className="cta-inline-actions reveal" data-reveal>
                  <a
                    className="btn cta-inline-btn"
                    href={calBookingUrl}
                    data-cal-link={calNamespace}
                    data-cal-namespace={calNamespaceSlug}
                    data-cal-config='{"layout":"month_view"}'
                    >OUI, JE VEUX EN SAVOIR PLUS&nbsp;!</a
                  >
                  <p className="cta-inline-reassure">Gratuit et sans engagement</p>
                </div>
              </div>
            </div>
      
            <section className="section section-muted" id="ce-quil-faut-savoir">
              <div className="section-inner">
                <div className="reveal" data-reveal>
                  <h2 id="fit-bridge-heading">Ce que tu dois savoir <em>avant de commencer</em></h2>
                </div>
                <div
                  className="fit-bridge"
                  role="region"
                  aria-labelledby="fit-bridge-heading"
                >
                  <p className="fit-bridge-lead">
                    Cet accompagnement personnalisé n'est pas pour tous. Voici comment savoir si c'est fait pour toi.
                  </p>
                  <div className="fit-bridge-layout">
                    <div className="fit-bridge-card fit-bridge-card--yes reveal" data-reveal>
                      <p className="fit-bridge-kicker fit-bridge-kicker--yes" id="fit-kicker-yes">C'est pour toi si…</p>
                      <ul className="fit-bridge-list fit-bridge-list--yes" aria-labelledby="fit-kicker-yes">
                        <li className="fit-bridge-row">
                          <div className="fit-item">
                            <span className="fit-icon fit-icon--check" aria-hidden="true">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" focusable="false">
                                <path
                                  d="M5.5 12.5 10 17 18.5 6.5"
                                  stroke="currentColor"
                                  strokeWidth="1.35"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            <span>tu veux commencer à t'entraîner sur de bonnes bases</span>
                          </div>
                        </li>
                        <li className="fit-bridge-row">
                          <div className="fit-item">
                            <span className="fit-icon fit-icon--check" aria-hidden="true">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" focusable="false">
                                <path
                                  d="M5.5 12.5 10 17 18.5 6.5"
                                  stroke="currentColor"
                                  strokeWidth="1.35"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            <span>tu stagnes depuis plusieurs mois</span>
                          </div>
                        </li>
                        <li className="fit-bridge-row">
                          <div className="fit-item">
                            <span className="fit-icon fit-icon--check" aria-hidden="true">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" focusable="false">
                                <path
                                  d="M5.5 12.5 10 17 18.5 6.5"
                                  stroke="currentColor"
                                  strokeWidth="1.35"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            <span>tu ne sais pas comment atteindre tes objectifs</span>
                          </div>
                        </li>
                        <li className="fit-bridge-row">
                          <div className="fit-item">
                            <span className="fit-icon fit-icon--check" aria-hidden="true">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" focusable="false">
                                <path
                                  d="M5.5 12.5 10 17 18.5 6.5"
                                  stroke="currentColor"
                                  strokeWidth="1.35"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            <span>tu veux apprendre et comprendre, pas seulement appliquer</span>
                          </div>
                        </li>
                        <li className="fit-bridge-row">
                          <div className="fit-item">
                            <span className="fit-icon fit-icon--check" aria-hidden="true">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" focusable="false">
                                <path
                                  d="M5.5 12.5 10 17 18.5 6.5"
                                  stroke="currentColor"
                                  strokeWidth="1.35"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                            <span>tu veux diminuer les risques de blessures</span>
                          </div>
                        </li>
                      </ul>
                      <a
                        className="fit-bridge-yes-badge"
                        href={calBookingUrl}
                        data-cal-link={calNamespace}
                        data-cal-namespace={calNamespaceSlug}
                        data-cal-config='{"layout":"month_view"}'
                      >
                        <span className="fit-bridge-yes-badge__text"
                          >C'est pour <br aria-hidden="true" />moi&nbsp;!</span
                        >
                      </a>
                    </div>
                    <div className="fit-bridge-card fit-bridge-card--no reveal" data-reveal>
                      <p className="fit-bridge-kicker fit-bridge-kicker--no" id="fit-kicker-no">Ce n'est pas pour toi si…</p>
                      <ul className="fit-bridge-list fit-bridge-list--no" aria-labelledby="fit-kicker-no">
                        <li className="fit-bridge-row">
                          <div className="fit-item">
                            <span className="fit-icon fit-icon--cross fit-icon--cross-muted" aria-hidden="true">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" focusable="false">
                                <path
                                  d="M7 7 17 17M17 7 7 17"
                                  stroke="currentColor"
                                  strokeWidth="1.35"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </span>
                            <span>tu ne peux pas te déplacer à Montréal</span>
                          </div>
                        </li>
                        <li className="fit-bridge-row">
                          <div className="fit-item">
                            <span className="fit-icon fit-icon--cross fit-icon--cross-muted" aria-hidden="true">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" focusable="false">
                                <path
                                  d="M7 7 17 17M17 7 7 17"
                                  stroke="currentColor"
                                  strokeWidth="1.35"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </span>
                            <span>tu n'as pas de temps à investir</span>
                          </div>
                        </li>
                        <li className="fit-bridge-row">
                          <div className="fit-item">
                            <span className="fit-icon fit-icon--cross fit-icon--cross-muted" aria-hidden="true">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" focusable="false">
                                <path
                                  d="M7 7 17 17M17 7 7 17"
                                  stroke="currentColor"
                                  strokeWidth="1.35"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </span>
                            <span>tu cherches une solution miracle</span>
                          </div>
                        </li>
                        <li className="fit-bridge-row">
                          <div className="fit-item">
                            <span className="fit-icon fit-icon--cross fit-icon--cross-muted" aria-hidden="true">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" focusable="false">
                                <path
                                  d="M7 7 17 17M17 7 7 17"
                                  stroke="currentColor"
                                  strokeWidth="1.35"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </span>
                            <span>tu veux un programme basé principalement sur des machines</span>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="mission-block reveal" data-reveal>
                  <h2 className="mission-heading">
                    {Array.isArray(homePage?.approachHeadline) && homePage.approachHeadline.length > 0 ? (
                      <PortableText value={homePage.approachHeadline} components={introHeadlineComponents} />
                    ) : (
                      <>Mon approche</>
                    )}
                  </h2>
                  <div className="mission-body">
                    <div className="mission-copy">
                      <p className="mission-manifesto">
                        Ma mission est de t'aider à instaurer des habitudes de vie durables.
                      </p>
                      <p className="mission-text">
                        {homePage?.approachDescription ??
                          "Les changements durables demandent du temps et de la constance. Mon rôle est de t'accompagner de façon soutenue pour t'aider à obtenir des résultats concrets et à développer les apprentissages nécessaires pour reprendre le contrôle et maintenir tes résultats à long terme."}
                      </p>
                      <a
                        className="arrow-text-link mission-instagram-link"
                        href={instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Découvre mon quotidien sur Instagram (nouvel onglet)"
                        >Découvre mon quotidien sur Instagram<span className="hero-ghost-arrow" aria-hidden="true">→</span></a
                      >
                    </div>
                    <div className="mission-photo">
                      <div className="mission-photo-frame">
                        <img
                          className="mission-photo-img"
                          src={approachImageSrc}
                          alt={
                            homePage?.approachImage?.alt ??
                            "Éliane, entraîneure personnelle à Montréal, en poussée de traîneau dans un gym sombre à l'éclairage contrasté."
                          }
                          width="1024"
                          height="819"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                    </div>
                  </div>
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
                    <aside className="presentiel-location-card" aria-label="Lieu d'entraînement">
                      <span className="eyebrow eyebrow--with-anchor presentiel-location-card__eyebrow">Où ont lieu les séances</span>
                      <h3 className="presentiel-location-card__name">Biner Training</h3>
                      <p className="presentiel-location-card__address">
                        220 Bd Crémazie O<br />
                        Montréal (Québec) &nbsp;H2P 1C6
                      </p>
                      <div className="presentiel-location-card__map" data-presentiel-map-wrap>
                        <a
                          className="presentiel-location-card__map-link"
                          href="https://maps.app.goo.gl/c1V1Re3Guj8ZF6mEA"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Ouvrir Biner Training sur Google Maps (nouvel onglet)"
                        >
                          <span
                            className="presentiel-location-card__map-fallback"
                            hidden
                            data-presentiel-map-fallback
                            aria-hidden="true"
                            >Carte&nbsp;: ajoute <code>VITE_GOOGLE_MAPS_API_KEY</code> dans <code>.env.local</code> pour
                            l’aperçu local.</span
                          >
                          <img
                            className="presentiel-location-card__map-img"
                            data-presentiel-static-map
                            alt="Emplacement de Biner Training sur Google Maps"
                            width="480"
                            height="280"
                            loading="lazy"
                            decoding="async"
                          />
                        </a>
                      </div>
                      <div className="presentiel-location-card__links">
                        <a
                          className="arrow-text-link"
                          href="https://maps.app.goo.gl/c1V1Re3Guj8ZF6mEA"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Voir sur Google Maps (nouvel onglet)"
                          >Voir sur Google Maps<span className="hero-ghost-arrow" aria-hidden="true">→</span></a
                        >
                      </div>
                    </aside>
                  </div>
                  <p className="presentiel-closing">
                    <em
                      >Parce que rien ne remplace un accompagnement en personne quand on veut bien progresser.</em
                    >
                  </p>
                </div>
              </div>
            </section>
      
            <section className="section section-muted" id="poids-libres">
              <div className="section-inner">
                <div className="poids-libres-layout">
                  <div className="poids-libres-media reveal" data-reveal>
                    <div className="poids-libres-media-frame">
                      <img
                        className="poids-libres-media-img"
                        src={freeWeightsImageSrc}
                        alt={homePage?.freeWeightsImage?.alt ?? "Éliane utilisant des poids libres"}
                        width="690"
                        height="1536"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  </div>
                  <div className="poids-libres-content">
                    <div className="reveal" data-reveal>
                      <span className="eyebrow">Les avantages des poids libres et accessoires</span>
                      <h2>
                        {Array.isArray(homePage?.freeWeightsHeadline) && homePage.freeWeightsHeadline.length > 0 ? (
                          <PortableText value={homePage.freeWeightsHeadline} components={introHeadlineComponents} />
                        ) : (
                          <>Pourquoi j'utilise les <em>poids libres et accessoires</em></>
                        )}
                      </h2>
                    </div>
                    <ul className="imagine-list poids-libres-list">
                      {Array.isArray(homePage?.freeWeightsBullets) && homePage.freeWeightsBullets.length > 0 ? (
                        homePage.freeWeightsBullets.map((bullet: any, i: number) => (
                          <li key={i} className="reveal" data-reveal>
                            <PortableText value={[bullet]} components={freeWeightsBulletComponents} />
                          </li>
                        ))
                      ) : (
                        <>
                          <li className="reveal" data-reveal><strong>accessibles</strong> dans tous les gyms comme à la maison</li>
                          <li className="reveal" data-reveal><strong>travaillent</strong> l'équilibre et la stabilité</li>
                          <li className="reveal" data-reveal><strong>améliorent</strong> la coordination</li>
                          <li className="reveal" data-reveal><strong>développent</strong> une force plus fonctionnelle au quotidien</li>
                          <li className="reveal" data-reveal><strong>offrent</strong> beaucoup de variété dans la progression</li>
                        </>
                      )}
                    </ul>
                    <div className="poids-libres-cta-wrap reveal" data-reveal>
                      <a
                        className="btn btn-primary"
                        href={calBookingUrl}
                        data-cal-link={calNamespace}
                        data-cal-namespace={calNamespaceSlug}
                        data-cal-config='{"layout":"month_view"}'
                        >TROUVE LA BONNE APPROCHE</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </section>
      
            <section className="faq-section" id="faq" aria-labelledby="faq-heading">
              <div className="faq-section-inner">
                <header className="faq-section-header reveal" data-reveal>
                  <p className="faq-section-eyebrow">Questions fréquentes</p>
                  <h2 id="faq-heading">
                    Tu as des questions. <em className="faq-heading-accent">Voici les réponses.</em>
                  </h2>
                </header>
                <div className="faq-layout">
                  <div className="faq-main">
                    <div className="faq-list" data-faq>
                      {faqs && faqs.length > 0 ? (
                        faqs.map((faq: any) => {
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
                        data-cal-link={calNamespace}
                        data-cal-namespace={calNamespaceSlug}
                        data-cal-config='{"layout":"month_view"}'
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
      
            <section className="close">
              <div className="close-inner">
                <div className="accent-bar" aria-hidden="true" />
                <h2 className="reveal" data-reveal>
                  Après notre travail ensemble, tu auras des outils concrets <em>pour continuer à avancer.</em>
                </h2>
                <p className="reveal" data-reveal>
                  Réserve un appel découverte gratuit pour qu'on puisse voir où tu en es et comment je peux t'aider. Sans
                  engagement.
                </p>
                <div className="close-actions reveal" data-reveal>
                  <a
                    className="btn btn-primary"
                    href={calBookingUrl}
                    data-cal-link={calNamespace}
                    data-cal-namespace={calNamespaceSlug}
                    data-cal-config='{"layout":"month_view"}'
                    >Appel découverte</a
                  >
                  <span className="close-note">Aucun engagement</span>
                </div>
              </div>
            </section>
          
    </main>
  );
}
