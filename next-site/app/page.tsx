const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "À qui s'adresse ce programme ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Ce service s'adresse aux personnes qui ont déjà essayé de s'entraîner sans obtenir de résultats durables. Aux personnes qui veulent commencer à s'entraîner de façon sécuritaire. Peu importe ton niveau de départ, je pars de là où tu en es."
        }
      },
      {
        "@type": "Question",
        "name": "Où ont lieu les séances ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Les séances ont lieu au Biner Training, situé au 220 boulevard Crémazie Ouest, à Montréal."
        }
      },
      {
        "@type": "Question",
        "name": "Quel équipement est utilisé ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "J'ai plus de dix ans d'expérience avec les poids libres : haltères, ballons, bandes élastiques. Ton programme est conçu selon l'équipement disponible et adapté à tes besoins spécifiques."
        }
      },
      {
        "@type": "Question",
        "name": "Est,ce que le programme inclut un volet nutrition ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui. J'offre une analyse de ton alimentation ainsi que des conseils concrets et réalistes, selon l'offre choisie. Les recommandations nutritionnelles sont de nature générale et ne constituent pas un plan alimentaire personnalisé prescrit par un professionnel de la santé."
        }
      },
      {
        "@type": "Question",
        "name": "Comment obtenir les détails sur l'investissement ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Comme chaque situation est différente, je préfère en discuter directement avec toi pour m'assurer que l'accompagnement correspond bien à tes besoins avant de parler des modalités. Réserve un appel découverte, on prend le temps d'en parler ensemble."
        }
      },
      {
        "@type": "Question",
        "name": "Que se passe,t,il après les 12 semaines ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La dernière séance est consacrée à faire le bilan et à planifier la suite selon tes objectifs. Des formules de suivi mensuel sont disponibles pour les clientes qui souhaitent continuer leur progression."
        }
      },
      {
        "@type": "Question",
        "name": "Quelle offre devrais,je choisir, Le Tremplin ou l'Offre signature ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Le Tremplin est idéale si tu t'entraînes déjà, que tu es autonome et constante, et que tu cherches à briser un plateau. L'Offre signature est conçue pour celles qui veulent une transformation plus complète, un encadrement hebdomadaire en présentiel, et installer des habitudes solides sur le long terme. Si tu hésites, réserve un appel découverte : on regarde ensemble ce qui te convient le mieux."
        }
      },
      {
        "@type": "Question",
        "name": "Combien de temps durent les séances ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La rencontre initiale du Tremplin dure 2 heures. Dans l'Offre signature, les séances hebdomadaires en présentiel durent environ 60 minutes."
        }
      },
      {
        "@type": "Question",
        "name": "Comment se déroule la première rencontre ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La première rencontre se fait en présentiel au Biner Training. On prend le temps de faire des tests physiques, des mesures de départ et une prise de la composition corporelle. On revoit ensemble ton programme d'entraînement et on fait les premiers ajustements selon ton profil."
        }
      },
      {
        "@type": "Question",
        "name": "Est,ce que je peux m'entraîner si j'ai une blessure ou une condition médicale ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Chaque situation est unique. Lors de l'appel découverte, on prend le temps d'en discuter pour voir comment adapter l'accompagnement à ta réalité. Dans certains cas, un avis médical peut être recommandé avant de commencer."
        }
      },
      {
        "@type": "Question",
        "name": "Est,ce que les séances sont privées ou en groupe ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Les séances sont entièrement privées. Tu travailles uniquement avec moi, dans un espace dédié au Biner Training."
        }
      },
      {
        "@type": "Question",
        "name": "Puis,je poursuivre l'accompagnement après l'offre initiale ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui. Des formules de suivi mensuel sont disponibles pour les clientes qui souhaitent continuer leur progression après la fin de leur accompagnement initial."
        }
      },
      {
        "@type": "Question",
        "name": "Est,ce que tu accompagnes des femmes enceintes ou en post,partum ?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Oui, avec certaines précautions. Je recommande d'obtenir un avis médical préalable avant de débuter ou de reprendre l'entraînement. On en discute lors de l'appel découverte pour adapter l'accompagnement à ta situation."
        }
      }
    ]
  } as const;

export default function Home() {
  return (
    <main id="contenu-principal">
      
            <section className="hero" id="accueil">
              <div className="hero-copy">
                <p className="hero-tag">Entraîneure personnelle • Montréal</p>
                <h1>
                  Un service personnalisé en présentiel pour t'aider à progresser
                  <span className="hero-headline-pull"><em>de façon claire et durable</em></span>.
                </h1>
                <p className="hero-lead">
                  Un accompagnement sur mesure, conçu pour toi qui crois avoir tout essayé, mais qui n'arrives toujours pas à
                  atteindre tes objectifs et à les maintenir.
                </p>
                <div className="hero-actions">
                  <a
                    className="btn btn-primary"
                    href="https://cal.com/elianelarre/appel-decouverte"
                    data-cal-link="elianelarre/appel-decouverte"
                    data-cal-namespace="appel-decouverte"
                    data-cal-config='{"layout":"month_view"}'
                    >Appel découverte</a>
                  <a className="btn btn-ghost hero-secondary-cta" href="#offres"
                    >Voir les offres<span className="hero-ghost-arrow" aria-hidden="true">→</span></a>
                </div>
              </div>
              <div className="hero-visual">
                <p className="sr-only">Portrait d’Éliane.</p>
                <div className="hero-photo">
                  <picture>
                    <source media="(max-width: 767px)" srcSet="/images/hero-mobile.jpg" />
                    <source media="(max-width: 1279px)" srcSet="/images/hero-tablet.jpg" />
                    <source type="image/webp" media="(min-width: 1280px)" srcSet="/images/eliane-hero.webp" />
                    <img
                      className="hero-img"
                      src="/images/eliane-hero.jpg"
                      alt=""
                      width="2400"
                      height="3000"
                      fetchPriority="high"
                    />
                  </picture>
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
                  <h2>Accompagnement personnalisé <br /><em>en présentiel à Montréal</em></h2>
                  <p className="lead intro-subhead">
                    J'offre un accompagnement personnalisé avec séances en présentiel pour t'aider à progresser de façon
                    structurée, sécuritaire et adaptée à tes objectifs.
                  </p>
                </div>
                <div className="intro-bottom">
                  <div className="intro-photo">
                    <div className="intro-photo-sticky">
                      <div className="intro-photo-reveal reveal" data-reveal>
                        <div className="intro-photo-frame">
                          <img
                            className="intro-photo-img"
                            src="/images/eliane-intro-training.png"
                            alt="Éliane, entraîneure personnelle à Montréal, s'entraînant avec un haltère en salle."
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
                    href="https://cal.com/elianelarre/appel-decouverte"
                    data-cal-link="elianelarre/appel-decouverte"
                    data-cal-namespace="appel-decouverte"
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
                        href="https://cal.com/elianelarre/appel-decouverte"
                        data-cal-link="elianelarre/appel-decouverte"
                        data-cal-namespace="appel-decouverte"
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
                  <h2 className="mission-heading">Mon approche</h2>
                  <div className="mission-body">
                    <div className="mission-copy">
                      <p className="mission-manifesto">
                        Ma mission est de t'aider à instaurer des habitudes de vie durables.
                      </p>
                      <p className="mission-text">
                        Les changements durables demandent du temps et de la constance. Mon rôle est de t'accompagner de façon
                        soutenue pour t'aider à obtenir des résultats concrets et à développer les apprentissages nécessaires
                        pour reprendre le contrôle et maintenir tes résultats à long terme.
                      </p>
                      <a
                        className="arrow-text-link mission-instagram-link"
                        href="https://www.instagram.com/eliane.au.naturel"
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
                          src="/images/eliane-mission-sled-push.png"
                          alt="Éliane, entraîneure personnelle à Montréal, en poussée de traîneau dans un gym sombre à l'éclairage contrasté."
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
                        src="/images/eliane-poids-libres.png"
                        alt="Éliane utilisant des poids libres"
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
                      <h2>Pourquoi j'utilise les <em>poids libres et accessoires</em></h2>
                    </div>
                    <ul className="imagine-list poids-libres-list">
                      <li className="reveal" data-reveal>
                        <strong>accessibles</strong> dans tous les gyms comme à la maison
                      </li>
                      <li className="reveal" data-reveal>
                        <strong>travaillent</strong> l'équilibre et la stabilité
                      </li>
                      <li className="reveal" data-reveal>
                        <strong>améliorent</strong> la coordination
                      </li>
                      <li className="reveal" data-reveal>
                        <strong>développent</strong> une force plus fonctionnelle au quotidien
                      </li>
                      <li className="reveal" data-reveal>
                        <strong>offrent</strong> beaucoup de variété dans la progression
                      </li>
                    </ul>
                    <div className="poids-libres-cta-wrap reveal" data-reveal>
                      <a
                        className="btn btn-primary"
                        href="https://cal.com/elianelarre/appel-decouverte"
                        data-cal-link="elianelarre/appel-decouverte"
                        data-cal-namespace="appel-decouverte"
                        data-cal-config='{"layout":"month_view"}'
                        >TROUVE LA BONNE APPROCHE</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </section>
      
            <section className="section section-warm section-offres" id="offres">
              <div className="section-inner section-inner--offres">
                <header className="offres-head reveal" data-reveal>
                  <span className="eyebrow">Les offres</span>
                  <h2>Choisis l'offre <em>qui correspond à ton parcours</em></h2>
                  <p className="offres-lead">Deux formules conçues selon ton niveau et tes objectifs.</p>
                </header>
                <div className="offres-grid">
                  <article className="offres-card offres-card--tremplin reveal" data-reveal>
                    <span className="offres-badge offres-badge--muted" aria-hidden="true">1 mois</span>
                    <div className="offres-card__body">
                      <h3 className="offres-card__title">Le Tremplin</h3>
                      <p className="offres-card__duration">1 mois</p>
                      <p className="offres-card__pitch">Pour démarrer avec un plan clair et un encadrement de proximité.</p>
                      <ul className="offres-feature-list">
                        <li>1 rencontre en présentiel de 2 heures</li>
                        <li>Programme d'entraînement personnalisé</li>
                        <li>Accès à l'application de suivi</li>
                        <li>Messagerie directe 7/7 pendant 4 semaines</li>
                        <li>Appel bilan de 45 minutes</li>
                      </ul>
                      <div className="offres-ideal">
                        <p className="offres-ideal__label">IDÉALE SI TU…</p>
                        <p className="offres-ideal__text">t'entraînes déjà mais manques de structure.</p>
                      </div>
                    </div>
                    <div className="offres-card__cta">
                      <a className="btn btn-primary btn--offres-cta" href="/offres/le-tremplin">En savoir plus<span aria-hidden="true"> →</span></a>
                    </div>
                  </article>
                  <article
                    className="offres-card offres-card--signature reveal"
                    data-reveal
                    aria-label="Offre signature — offre recommandée"
                  >
                    <span className="offres-badge offres-badge--popular">Populaire</span>
                    <div className="offres-card__body">
                      <h3 className="offres-card__title">Offre signature</h3>
                      <p className="offres-card__duration">3 mois</p>
                      <p className="offres-card__pitch">Pour un accompagnement complet, structuré et personnalisé.</p>
                      <ul className="offres-feature-list">
                        <li>12 séances en présentiel (1 par semaine)</li>
                        <li>Programme d'entraînement personnalisé</li>
                        <li>Accès à l'application de suivi</li>
                        <li>Messagerie directe 7/7 pendant 12 semaines</li>
                        <li>1 semaine de journal alimentaire</li>
                        <li>Bilan écrit final avec recommandations</li>
                      </ul>
                      <div className="offres-ideal">
                        <p className="offres-ideal__label">IDÉALE SI TU…</p>
                        <p className="offres-ideal__text">veux une transformation complète avec encadrement hebdomadaire.</p>
                      </div>
                    </div>
                    <div className="offres-card__cta">
                      <a className="btn btn-primary btn--offres-cta" href="/offres/offre-signature"
                        >En savoir plus<span aria-hidden="true"> →</span></a
                      >
                    </div>
                  </article>
                </div>
                <div className="offres-helper reveal" data-reveal>
                  <p className="offres-helper__line">Tu hésites entre les deux ?</p>
                  <p className="offres-helper__sub">Parlons-en lors d'un appel découverte.</p>
                  <a
                    className="btn btn-primary"
                    href="https://cal.com/elianelarre/appel-decouverte"
                    data-cal-link="elianelarre/appel-decouverte"
                    data-cal-namespace="appel-decouverte"
                    data-cal-config='{"layout":"month_view"}'
                    >Réserver un appel</a
                  >
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
                      <div className="faq-item">
                        <button type="button" className="faq-trigger" aria-expanded="false" aria-controls="faq-panel-1" id="faq-1">
                          <span className="faq-trigger-label">À qui s'adresse ce programme&nbsp;?</span>
                          <span className="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div className="faq-panel" id="faq-panel-1" role="region" aria-labelledby="faq-1" hidden>
                          <div className="faq-panel-inner">
                            <p>
                              Ce service s'adresse aux personnes qui ont déjà essayé de s'entraîner sans obtenir de résultats
                              durables. Aux personnes qui veulent commencer à s'entraîner de façon sécuritaire. Peu importe ton
                              niveau de départ, je pars de là où tu en es.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="faq-item">
                        <button type="button" className="faq-trigger" aria-expanded="false" aria-controls="faq-panel-2" id="faq-2">
                          <span className="faq-trigger-label">Où ont lieu les séances&nbsp;?</span>
                          <span className="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div className="faq-panel" id="faq-panel-2" role="region" aria-labelledby="faq-2" hidden>
                          <div className="faq-panel-inner">
                            <p>
                              Les séances ont lieu au Biner Training, situé au 220 boulevard Crémazie Ouest, à Montréal.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="faq-item">
                        <button type="button" className="faq-trigger" aria-expanded="false" aria-controls="faq-panel-3" id="faq-3">
                          <span className="faq-trigger-label">Quel équipement est utilisé&nbsp;?</span>
                          <span className="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div className="faq-panel" id="faq-panel-3" role="region" aria-labelledby="faq-3" hidden>
                          <div className="faq-panel-inner">
                            <p>
                              J'ai plus de dix ans d'expérience avec les poids libres : haltères, ballons, bandes élastiques. Ton
                              programme est conçu selon l'équipement disponible et adapté à tes besoins spécifiques.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="faq-item">
                        <button type="button" className="faq-trigger" aria-expanded="false" aria-controls="faq-panel-4" id="faq-4">
                          <span className="faq-trigger-label">Est,ce que le programme inclut un volet nutrition&nbsp;?</span>
                          <span className="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div className="faq-panel" id="faq-panel-4" role="region" aria-labelledby="faq-4" hidden>
                          <div className="faq-panel-inner">
                            <p>
                              Oui. J'offre une analyse de ton alimentation ainsi que des conseils concrets et réalistes, selon
                              l'offre choisie. Les recommandations nutritionnelles sont de nature générale et ne constituent pas un
                              plan alimentaire personnalisé prescrit par un professionnel de la santé.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="faq-item">
                        <button type="button" className="faq-trigger" aria-expanded="false" aria-controls="faq-panel-5" id="faq-5">
                          <span className="faq-trigger-label">Comment obtenir les détails sur l'investissement&nbsp;?</span>
                          <span className="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div className="faq-panel" id="faq-panel-5" role="region" aria-labelledby="faq-5" hidden>
                          <div className="faq-panel-inner">
                            <p>
                              Comme chaque situation est différente, je préfère en discuter directement avec toi pour m'assurer que
                              l'accompagnement correspond bien à tes besoins avant de parler des modalités. Réserve un appel
                              découverte, on prend le temps d'en parler ensemble.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="faq-item">
                        <button type="button" className="faq-trigger" aria-expanded="false" aria-controls="faq-panel-6" id="faq-6">
                          <span className="faq-trigger-label">Que se passe,t,il après les 12 semaines&nbsp;?</span>
                          <span className="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div className="faq-panel" id="faq-panel-6" role="region" aria-labelledby="faq-6" hidden>
                          <div className="faq-panel-inner">
                            <p>
                              La dernière séance est consacrée à faire le bilan et à planifier la suite selon tes objectifs. Des
                              formules de suivi mensuel sont disponibles pour les clientes qui souhaitent continuer leur
                              progression.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="faq-item">
                        <button type="button" className="faq-trigger" aria-expanded="false" aria-controls="faq-panel-7" id="faq-7">
                          <span className="faq-trigger-label"
                            >Quelle offre devrais,je choisir, Le Tremplin ou l'Offre signature&nbsp;?</span
                          >
                          <span className="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div className="faq-panel" id="faq-panel-7" role="region" aria-labelledby="faq-7" hidden>
                          <div className="faq-panel-inner">
                            <p>
                              Le Tremplin est idéale si tu t'entraînes déjà, que tu es autonome et constante, et que tu cherches à
                              briser un plateau. L'Offre signature est conçue pour celles qui veulent une transformation plus
                              complète, un encadrement hebdomadaire en présentiel, et installer des habitudes solides sur le long
                              terme. Si tu hésites, réserve un appel découverte : on regarde ensemble ce qui te convient le mieux.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="faq-item">
                        <button type="button" className="faq-trigger" aria-expanded="false" aria-controls="faq-panel-8" id="faq-8">
                          <span className="faq-trigger-label">Combien de temps durent les séances&nbsp;?</span>
                          <span className="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div className="faq-panel" id="faq-panel-8" role="region" aria-labelledby="faq-8" hidden>
                          <div className="faq-panel-inner">
                            <p>
                              La rencontre initiale du Tremplin dure 2 heures. Dans l'Offre signature, les séances hebdomadaires en
                              présentiel durent environ 60 minutes.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="faq-item">
                        <button type="button" className="faq-trigger" aria-expanded="false" aria-controls="faq-panel-9" id="faq-9">
                          <span className="faq-trigger-label">Comment se déroule la première rencontre&nbsp;?</span>
                          <span className="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div className="faq-panel" id="faq-panel-9" role="region" aria-labelledby="faq-9" hidden>
                          <div className="faq-panel-inner">
                            <p>
                              La première rencontre se fait en présentiel au Biner Training. On prend le temps de faire des tests
                              physiques, des mesures de départ et une prise de la composition corporelle. On revoit ensemble ton
                              programme d'entraînement et on fait les premiers ajustements selon ton profil.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="faq-item">
                        <button type="button" className="faq-trigger" aria-expanded="false" aria-controls="faq-panel-10" id="faq-10">
                          <span className="faq-trigger-label"
                            >Est,ce que je peux m'entraîner si j'ai une blessure ou une condition médicale&nbsp;?</span
                          >
                          <span className="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div className="faq-panel" id="faq-panel-10" role="region" aria-labelledby="faq-10" hidden>
                          <div className="faq-panel-inner">
                            <p>
                              Chaque situation est unique. Lors de l'appel découverte, on prend le temps d'en discuter pour voir
                              comment adapter l'accompagnement à ta réalité. Dans certains cas, un avis médical peut être recommandé
                              avant de commencer.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="faq-item">
                        <button type="button" className="faq-trigger" aria-expanded="false" aria-controls="faq-panel-11" id="faq-11">
                          <span className="faq-trigger-label">Est,ce que les séances sont privées ou en groupe&nbsp;?</span>
                          <span className="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div className="faq-panel" id="faq-panel-11" role="region" aria-labelledby="faq-11" hidden>
                          <div className="faq-panel-inner">
                            <p>
                              Les séances sont entièrement privées. Tu travailles uniquement avec moi, dans un espace dédié au Biner
                              Training.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="faq-item">
                        <button type="button" className="faq-trigger" aria-expanded="false" aria-controls="faq-panel-12" id="faq-12">
                          <span className="faq-trigger-label">Puis,je poursuivre l'accompagnement après l'offre initiale&nbsp;?</span>
                          <span className="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div className="faq-panel" id="faq-panel-12" role="region" aria-labelledby="faq-12" hidden>
                          <div className="faq-panel-inner">
                            <p>
                              Oui. Des formules de suivi mensuel sont disponibles pour les clientes qui souhaitent continuer leur
                              progression après la fin de leur accompagnement initial.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="faq-item">
                        <button type="button" className="faq-trigger" aria-expanded="false" aria-controls="faq-panel-13" id="faq-13">
                          <span className="faq-trigger-label"
                            >Est,ce que tu accompagnes des femmes enceintes ou en post,partum&nbsp;?</span
                          >
                          <span className="faq-icon" aria-hidden="true">+</span>
                        </button>
                        <div className="faq-panel" id="faq-panel-13" role="region" aria-labelledby="faq-13" hidden>
                          <div className="faq-panel-inner">
                            <p>
                              Oui, avec certaines précautions. Je recommande d'obtenir un avis médical préalable avant de débuter ou
                              de reprendre l'entraînement. On en discute lors de l'appel découverte pour adapter l'accompagnement à
                              ta situation.
                            </p>
                          </div>
                        </div>
                      </div>
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
                      <a className="faq-contact-email" href="mailto:info@elianelarre.com">info@elianelarre.com</a>
                      <div className="faq-contact-sep" role="presentation" />
                      <p className="faq-contact-or">ou</p>
                      <a
                        className="faq-contact-cal"
                        href="https://cal.com/elianelarre/appel-decouverte"
                        data-cal-link="elianelarre/appel-decouverte"
                        data-cal-namespace="appel-decouverte"
                        data-cal-config='{"layout":"month_view"}'
                        >Ou réserve directement un appel découverte<span className="faq-contact-cal-arrow" aria-hidden="true"> →</span></a
                      >
                    </div>
                  </aside>
                </div>
              </div>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
              />
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
                    href="https://cal.com/elianelarre/appel-decouverte"
                    data-cal-link="elianelarre/appel-decouverte"
                    data-cal-namespace="appel-decouverte"
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
