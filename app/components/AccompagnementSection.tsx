import type {ReactNode} from 'react'
import {AccompAppImageLightbox} from '@/app/components/AccompAppImageLightbox'

type Pillar = {_key?: string; title?: string; description?: string}

const DEFAULT_EYEBROW = 'Mon accompagnement'
const DEFAULT_TITLE = 'Un accompagnement personnalisé, du début à la fin.'
const DEFAULT_LEAD =
  'Quatre piliers conçus ensemble pour te donner le cadre, la guidance et les outils dont tu as besoin pour progresser sans te perdre en route.'

const DEFAULT_PILLARS: Pillar[] = [
  {
    title: 'Un plan clair',
    description:
      "Ton programme est intégré à ton application personnalisée pour t'offrir une structure claire et des outils concrets pour soutenir ta progression.",
  },
  {
    title: 'Séances privées en présentiel',
    description:
      'Tu es guidée, corrigée et accompagnée en temps réel pour progresser avec confiance.',
  },
  {
    title: 'Suivi entre les rencontres',
    description:
      "Tu n'es pas laissée seule entre deux séances. L'accompagnement te garde engagée, alignée et constante.",
  },
  {
    title: 'Enseignements concrets et utiles',
    description:
      'Je suis là pour te partager mes connaissances en entraînement et nutrition pour te permettre de comprendre et maintenir tes résultats.',
  },
] as Pillar[]

const DEFAULT_APP_KICKER = 'Application personnalisée'
const DEFAULT_APP_TITLE = 'Un outil pensé pour toi, accessible où que tu sois.'
const DEFAULT_APP_DESCRIPTION =
  'Tes entraînements, ton historique de progression et tes communications avec moi, regroupés au même endroit. Simple, lisible, fait pour t\'accompagner sans t\'alourdir.'

function textOrDefault(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function renderOfferingTitle(text: string): ReactNode {
  const match = text.match(/^(.*?)(personnalisé)(.*)$/i)
  if (!match) return text
  return (
    <>
      {match[1]}
      <em>{match[2]}</em>
      {match[3]}
    </>
  )
}

function CtaArrow() {
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

export type AccompagnementSectionProps = {
  eyebrow?: string | null
  title?: string | null
  lead?: string | null
  pillars?: Pillar[]
  appKicker?: string | null
  appTitle?: string | null
  appDescription?: string | null
  appImageSrc: string
  appImageLightboxSrc?: string
  appImageAlt?: string
  ctaLabel?: string | null
  ctaUrl: string
  calLinkNamespace?: string
}

export function AccompagnementSection({
  eyebrow,
  title,
  lead,
  pillars,
  appKicker,
  appTitle,
  appDescription,
  appImageSrc,
  appImageLightboxSrc,
  appImageAlt,
  ctaLabel,
  ctaUrl,
  calLinkNamespace,
}: AccompagnementSectionProps) {
  const resolvedEyebrow = textOrDefault(eyebrow, DEFAULT_EYEBROW)
  const resolvedTitle = textOrDefault(title, DEFAULT_TITLE)
  const resolvedLead = textOrDefault(lead, DEFAULT_LEAD)
  const resolvedAppKicker = textOrDefault(appKicker, DEFAULT_APP_KICKER)
  const resolvedAppTitle = textOrDefault(appTitle, DEFAULT_APP_TITLE)
  const resolvedAppDescription = textOrDefault(appDescription, DEFAULT_APP_DESCRIPTION)
  const resolvedAppImageAlt =
    textOrDefault(appImageAlt, "Montage de trois écrans de l'application d'entraînement")
  const resolvedCtaLabel = textOrDefault(
    ctaLabel,
    "Je veux voir si l'accompagnement est adapté pour moi",
  )

  const items =
    pillars?.filter((p) => p.title?.trim() || p.description?.trim()).length
      ? pillars.filter((p) => p.title?.trim() || p.description?.trim())
      : DEFAULT_PILLARS

  return (
    <section className="section section-accompagnement" id="accompagnement">
      <div className="section-inner section-inner--accomp">
        <div className="accomp-panel">
          <header className="accomp-header reveal" data-reveal>
            <p className="eyebrow accomp-eyebrow">{resolvedEyebrow}</p>
            <h2>{renderOfferingTitle(resolvedTitle)}</h2>
            <p className="accomp-lead">{resolvedLead}</p>
          </header>

          <div className="accomp-body">
            <div className="accomp-timeline reveal-stagger" data-reveal>
              {items.map((pillar, index) => (
                <div className="accomp-tl-item" key={pillar._key ?? `pillar-${index}`}>
                  <div className="accomp-tl-dot">{index + 1}</div>
                  <div className="accomp-tl-body">
                    {pillar.title ? <h3 className="accomp-tl-title">{pillar.title}</h3> : null}
                    {pillar.description ? (
                      <p className="accomp-tl-desc">{pillar.description}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>

            <aside className="accomp-app-panel reveal" data-reveal>
              <AccompAppImageLightbox
                src={appImageSrc}
                lightboxSrc={appImageLightboxSrc}
                alt={resolvedAppImageAlt}
              />
              <div className="accomp-app-text">
                <p className="accomp-app-kicker">{resolvedAppKicker}</p>
                <h3 className="accomp-app-title">{resolvedAppTitle}</h3>
                <p className="accomp-app-desc">{resolvedAppDescription}</p>
              </div>
            </aside>
          </div>

          <div className="accomp-cta reveal" data-reveal>
            <a
              className="btn btn-primary accomp-cta-btn"
              href={ctaUrl}
              data-cal-link={calLinkNamespace || undefined}
              data-cal-config={calLinkNamespace ? '{"layout":"month_view"}' : undefined}
            >
              {resolvedCtaLabel}
              <CtaArrow />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
