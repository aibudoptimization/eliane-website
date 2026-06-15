import {
  ProcessArrow1Graphic,
  ProcessArrow2Graphic,
  ProcessLine2Graphic,
} from '@/app/components/ProcessDrawGraphics'

export type AfterCallStep = {
  _key?: string
  title?: string
  description?: string
}

const DEFAULT_EYEBROW = 'Comment ça se passe'
const DEFAULT_TITLE = "Après l'appel découverte."
const DEFAULT_INTRO =
  "L'appel est gratuit, sans engagement, et sert d'abord à voir si l'accompagnement est réellement pertinent pour toi."
const DEFAULT_CTA = "Je suis prête à avoir plus d'informations"

const DEFAULT_STEPS: AfterCallStep[] = [
  {
    title: 'Comprendre où tu en es',
    description:
      "On prend le temps de regarder ton point de départ : ton historique d'entraînement, ton mode de vie et ce qui t'a freinée par le passé.",
  },
  {
    title: 'Clarifier tes objectifs',
    description:
      'On met des mots précis sur ce que tu veux vraiment atteindre, et sur ce qui compte pour toi à long terme.',
  },
  {
    title: "Voir si l'accompagnement est adapté",
    description: "Je te dirai honnêtement si ce que j'offre correspond à ce que tu cherches — ou pas.",
  },
  {
    title: 'Répondre à tes questions',
    description:
      'Tu peux poser tout ce que tu veux : logistique, fréquence, méthode, prix. Aucune question n\'est de trop.',
  },
  {
    title: 'Te recommander la meilleure prochaine étape',
    description: 'Que ce soit avec moi ou ailleurs, tu repars avec une direction claire pour avancer.',
  },
]

function textOrDefault(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function CtaArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <polyline
        points="12 5 19 12 12 19"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export type AfterCallSectionProps = {
  eyebrow?: string | null
  title?: string | null
  intro?: string | null
  steps?: AfterCallStep[]
  ctaLabel?: string | null
  ctaUrl: string
  calLinkNamespace?: string
}

export function AfterCallSection({
  eyebrow,
  title,
  intro,
  steps,
  ctaLabel,
  ctaUrl,
  calLinkNamespace,
}: AfterCallSectionProps) {
  const filteredSteps = steps?.filter((step) => step?.title?.trim() || step?.description?.trim()) ?? []
  const resolvedSteps = filteredSteps.length >= 5 ? filteredSteps.slice(0, 5) : DEFAULT_STEPS

  const leftSteps = [resolvedSteps[0], resolvedSteps[2], resolvedSteps[4]]
  const rightSteps = [resolvedSteps[1], resolvedSteps[3]]

  return (
    <section className="section section-alt" id="apres-appel">
      <div className="section-inner section-inner--process">
        <header className="process-header reveal" data-reveal>
          <p className="process-eyebrow">{textOrDefault(eyebrow, DEFAULT_EYEBROW)}</p>
          <h2>{textOrDefault(title, DEFAULT_TITLE)}</h2>
          <p className="process-sub">{textOrDefault(intro, DEFAULT_INTRO)}</p>
        </header>

        <div className="process-body">
          <div className="process-grid" data-reveal>
          <div className="process-col process-col--left">
            <div className="process-step process-step--first process-step--reveal" data-process-step="1">
              <h3 className="process-step-title">
                <span className="process-step-num" aria-hidden="true">
                  01
                </span>
                {leftSteps[0]?.title}
              </h3>
              <p className="process-step-desc">{leftSteps[0]?.description}</p>
            </div>

            <div className="process-gap" aria-hidden="true" />

            <div className="process-step process-step--reveal" data-process-step="3">
              <h3 className="process-step-title">
                <span className="process-step-num" aria-hidden="true">
                  03
                </span>
                {leftSteps[1]?.title}
              </h3>
              <p className="process-step-desc">{leftSteps[1]?.description}</p>
            </div>

            <div className="process-gap" aria-hidden="true" />

            <div className="process-step process-step--destination process-step--reveal" data-process-step="5">
              <h3 className="process-step-title">
                <span className="process-step-num" aria-hidden="true">
                  05
                </span>
                {leftSteps[2]?.title}
              </h3>
              <p className="process-step-desc">{leftSteps[2]?.description}</p>
              <div className="process-step-line" aria-hidden="true">
                <ProcessLine2Graphic />
              </div>
            </div>
          </div>

          <div className="process-col process-col--center" aria-hidden="true">
            <div className="process-arrow process-arrow--1">
              <ProcessArrow1Graphic />
            </div>
            <div className="process-arrow process-arrow--2">
              <ProcessArrow2Graphic />
            </div>
            <div className="process-arrow process-arrow--3">
              <ProcessArrow1Graphic variant="arrow3" />
            </div>
          </div>

          <div className="process-col process-col--right">
            <div className="process-spacer" aria-hidden="true" />

            <div className="process-step process-step--reveal" data-process-step="2">
              <h3 className="process-step-title">
                <span className="process-step-num" aria-hidden="true">
                  02
                </span>
                {rightSteps[0]?.title}
              </h3>
              <p className="process-step-desc">{rightSteps[0]?.description}</p>
            </div>

            <div className="process-gap" aria-hidden="true" />

            <div className="process-step process-step--reveal" data-process-step="4">
              <h3 className="process-step-title">
                <span className="process-step-num" aria-hidden="true">
                  04
                </span>
                {rightSteps[1]?.title}
              </h3>
              <p className="process-step-desc">{rightSteps[1]?.description}</p>
            </div>
          </div>
          </div>

          <div className="process-cta reveal" data-reveal>
            <a
              className="btn btn-primary process-cta-btn"
              href={ctaUrl}
              data-cal-link={calLinkNamespace || undefined}
              data-cal-config={calLinkNamespace ? '{"layout":"month_view"}' : undefined}
            >
              {textOrDefault(ctaLabel, DEFAULT_CTA)}
              <CtaArrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
