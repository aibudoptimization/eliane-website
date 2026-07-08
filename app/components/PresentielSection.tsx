import type {ReactNode} from 'react'
import {
  headingPortableTextComponents,
  quotePortableTextComponents,
  RichText,
  type PortableTextValue,
} from '@/lib/portableTextComponents'
import {normalizeIconName, PresentielCards} from '@/app/components/PresentielCards'

export type PresentielCard = {
  _key?: string
  title?: string
  description?: string | PortableTextValue
  iconName?: string
}

const DEFAULT_EYEBROW = 'Pourquoi le présentiel'
const DEFAULT_TITLE = 'Pourquoi le présentiel change tout.'
const DEFAULT_INTRO =
  "Parce que la façon dont on s'entraîne change tout. Voici ce que le présentiel t'offre que rien d'autre ne peut remplacer."
const DEFAULT_QUOTE =
  "Un programme peut te dire quoi faire. Un accompagnement en présentiel te montre comment le faire et t'aide à progresser plus rapidement qu'en étant seule."

const DEFAULT_LOC_EYEBROW = 'Où ça se passe'
const DEFAULT_LOC_VENUE = 'Biner Training'
const DEFAULT_LOC_STREET = '220 Boulevard Crémazie Ouest'
const DEFAULT_LOC_CITY = 'Montréal, QC · H2P 1C6'

const MAP_EMBED_URL =
  'https://www.google.com/maps?q=Biner+Training+220+Boulevard+Cr%C3%A9mazie+Ouest+Montr%C3%A9al&t=&z=15&ie=UTF8&iwloc=&output=embed'

const DEFAULT_CARDS: PresentielCard[] = [
  {
    iconName: 'check',
    title: 'Correction en temps réel',
    description:
      "J'ajuste ta technique pour maximiser ta progression et diminuer les risques de blessure.",
  },
  {
    iconName: 'shield',
    title: 'Progression sécuritaire',
    description: "Je t'aide à progresser tout en respectant ton rythme.",
  },
  {
    iconName: 'clock',
    title: 'Imputabilité',
    description: "Le présentiel ajoute une structure qui soutient l'engagement.",
  },
  {
    iconName: 'eye',
    title: 'Adaptation à ton état',
    description:
      'Un entraînement sur mesure, selon ton énergie, tes besoins et tes envies.',
  },
]

function textOrDefault(value: string | null | undefined, fallback: string): string {
  const trimmed = value?.trim()
  return trimmed ? trimmed : fallback
}

function resolveCards(
  cards: PresentielCard[] | undefined,
  legacyBenefits?: Array<{title?: string; text?: string; icon?: string; _key?: string}>,
): PresentielCard[] {
  const fromSanity = cards?.filter((card) => card.title?.trim() || card.description) ?? []
  if (fromSanity.length > 0) return fromSanity

  const fromLegacy =
    legacyBenefits?.filter((benefit) => benefit.title?.trim() || benefit.text?.trim()) ?? []
  if (fromLegacy.length > 0) {
    return fromLegacy.map((benefit) => ({
      _key: benefit._key,
      title: benefit.title,
      description: benefit.text,
      iconName: normalizeIconName(benefit.icon),
    }))
  }

  return DEFAULT_CARDS
}

function renderSectionTitle(value: unknown, fallback: string): ReactNode {
  return (
    <RichText
      value={value}
      fallback={fallback}
      components={headingPortableTextComponents}
      as="inline"
    />
  )
}

export type PresentielSectionProps = {
  eyebrow?: string | null
  title?: unknown
  intro?: unknown
  cards?: PresentielCard[]
  legacyBenefits?: Array<{title?: string; text?: string; icon?: string; _key?: string}>
  quote?: unknown
  legacyQuote?: unknown
  locEyebrow?: string | null
  locVenue?: string | null
  locStreet?: string | null
  locCityLine?: string | null
}

export function PresentielSection({
  eyebrow,
  title,
  intro,
  cards,
  legacyBenefits,
  quote,
  legacyQuote,
  locEyebrow,
  locVenue,
  locStreet,
  locCityLine,
}: PresentielSectionProps) {
  const resolvedEyebrow = textOrDefault(eyebrow, DEFAULT_EYEBROW)
  const resolvedLocEyebrow = textOrDefault(locEyebrow, DEFAULT_LOC_EYEBROW)
  const resolvedLocVenue = textOrDefault(locVenue, DEFAULT_LOC_VENUE)
  const resolvedLocStreet = textOrDefault(locStreet, DEFAULT_LOC_STREET)
  const resolvedLocCity = textOrDefault(locCityLine, DEFAULT_LOC_CITY)
  const items = resolveCards(cards, legacyBenefits)
  const quoteValue = quote ?? legacyQuote

  return (
    <section className="section section-beige" id="presentiel">
      <div className="section-inner section-inner--presentiel">
        <header className="presentiel-header reveal" data-reveal>
          <p className="eyebrow presentiel-eyebrow">{resolvedEyebrow}</p>
          <h2>{renderSectionTitle(title, DEFAULT_TITLE)}</h2>
          <div className="presentiel-subtitle">
            <RichText value={intro} fallback={DEFAULT_INTRO} />
          </div>
        </header>

        <div className="presentiel-body">
          <PresentielCards items={items} />

          <aside className="presentiel-loc reveal" data-reveal>
            <p className="presentiel-loc-eyebrow">{resolvedLocEyebrow}</p>
            <div className="presentiel-loc-inner">
              <div className="presentiel-loc-details">
                <div className="presentiel-loc-row">
                  <span className="presentiel-loc-tag">Lieu</span>
                  <span className="presentiel-loc-val">{resolvedLocVenue}</span>
                </div>
                <div className="presentiel-loc-row">
                  <span className="presentiel-loc-tag">Adresse</span>
                  <span className="presentiel-loc-val">
                    {resolvedLocStreet}
                    <br />
                    {resolvedLocCity}
                  </span>
                </div>
              </div>
              <div className="presentiel-loc-map">
                <iframe
                  src={MAP_EMBED_URL}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Carte vers ${resolvedLocVenue}, Montréal`}
                  allowFullScreen
                />
              </div>
            </div>
          </aside>
        </div>

        <blockquote className="presentiel-quote reveal" data-reveal>
          <RichText
            value={quoteValue}
            fallback={DEFAULT_QUOTE}
            components={quotePortableTextComponents}
            className="presentiel-quote-text"
          />
        </blockquote>
      </div>
    </section>
  )
}
