import Image from 'next/image'

const DEFAULT_EYEBROW = 'Pour toi ou pas ?'
const DEFAULT_TITLE = 'Une approche claire, pour les bonnes raisons.'
const DEFAULT_YES_LABEL = "C'est pour toi si"
const DEFAULT_NO_LABEL = "Ce n'est probablement pas pour toi si"
const DEFAULT_FOOTER =
  'Cet accompagnement s\'adresse aux femmes qui veulent investir sérieusement dans leur progression, leur confiance et leur santé à long terme.'
const DEFAULT_CTA = "Je veux savoir si c'est pour moi"

const DEFAULT_YES_ITEMS = [
  'Tu veux être accompagnée sérieusement.',
  'Tu es prête à t\'impliquer.',
  'Tu veux apprendre à bien t\'entraîner.',
  'Tu veux une approche personnalisée plutôt qu\'un plan générique.',
  'Tu veux des résultats durables, pas une solution express.',
]

const DEFAULT_NO_ITEMS = [
  'Tu cherches uniquement le prix le plus bas.',
  'Tu veux une solution miracle sans implication.',
  'Tu n\'es pas disponible pour des séances en présentiel à Montréal.',
  'Tu préfères un programme 100 % autonome, sans accompagnement.',
]

function textOrDefault(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function normalizeLabel(value: string): string {
  return value.replace(/\s*:\s*$/, '')
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <polyline
        points="20 6 9 17 4 12"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
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

export type PourToiSectionProps = {
  eyebrow?: string | null
  title?: string | null
  yesLabel?: string | null
  yesItems?: string[]
  noLabel?: string | null
  noItems?: string[]
  footer?: string | null
  ctaLabel?: string | null
  ctaUrl: string
  calLinkNamespace?: string
  imageSrc: string
  imageAlt?: string
}

export function PourToiSection({
  eyebrow,
  title,
  yesLabel,
  yesItems,
  noLabel,
  noItems,
  footer,
  ctaLabel,
  ctaUrl,
  calLinkNamespace,
  imageSrc,
  imageAlt = "Éliane accotée sur la barre dans le gym",
}: PourToiSectionProps) {
  const resolvedYesItems =
    yesItems?.filter((item) => item?.trim()).length ? yesItems.filter((item) => item?.trim()) : DEFAULT_YES_ITEMS
  const resolvedNoItems =
    noItems?.filter((item) => item?.trim()).length ? noItems.filter((item) => item?.trim()) : DEFAULT_NO_ITEMS

  return (
    <section className="section section-beige" id="pour-toi">
      <div className="section-inner section-inner--fit">
        <header className="fit-header reveal" data-reveal>
          <p className="eyebrow fit-eyebrow">{textOrDefault(eyebrow, DEFAULT_EYEBROW)}</p>
          <h2>{textOrDefault(title, DEFAULT_TITLE)}</h2>
        </header>

        <div className="fit-grid reveal" data-reveal>
          <div className="fit-col fit-col--yes">
            <p className="fit-col-label">{normalizeLabel(textOrDefault(yesLabel, DEFAULT_YES_LABEL))}</p>
            <ul>
              {resolvedYesItems.map((item, index) => (
                <li key={`yes-${index}`}>
                  <span className="fit-icon fit-icon--check">
                    <CheckIcon />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="fit-col fit-col--no">
            <p className="fit-col-label">{normalizeLabel(textOrDefault(noLabel, DEFAULT_NO_LABEL))}</p>
            <ul>
              {resolvedNoItems.map((item, index) => (
                <li key={`no-${index}`}>
                  <span className="fit-icon fit-icon--cross">
                    <CrossIcon />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="fit-image">
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 920px) 100vw, 33vw"
              loading="lazy"
            />
          </div>
        </div>

        <div className="fit-footer reveal" data-reveal>
          <blockquote className="fit-quote">
            <p>{textOrDefault(footer, DEFAULT_FOOTER)}</p>
          </blockquote>
          <a
            className="btn btn-primary fit-cta"
            href={ctaUrl}
            data-cal-link={calLinkNamespace || undefined}
            data-cal-config={calLinkNamespace ? '{"layout":"month_view"}' : undefined}
          >
            {textOrDefault(ctaLabel, DEFAULT_CTA)}
            <CtaArrow />
          </a>
        </div>
      </div>
    </section>
  )
}
