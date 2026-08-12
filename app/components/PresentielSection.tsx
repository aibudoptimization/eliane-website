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
const DEFAULT_LOC_SECTOR = 'Montréal — Ahuntsic / Parc-Extension'
const DEFAULT_LOC_NOTE =
  "Studio privé. L'adresse exacte t'est communiquée après notre premier contact."

// Embed Google en mode « vue » (pas « lieu ») : aucune adresse n'est interrogée, donc
// aucune épingle n'est déposée. Dans le paramètre pb, 1d = largeur affichée en mètres,
// 2d = longitude, 3d = latitude. On centre un secteur large, jamais une adresse.
const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3000!2d-73.6485!3d45.5405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sfr!2sca!4v1700000000000!5m2!1sfr!2sca'

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
  locSector?: string | null
  locNote?: string | null
  locExtraLine?: string | null
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
  locSector,
  locNote,
  locExtraLine,
}: PresentielSectionProps) {
  const resolvedEyebrow = textOrDefault(eyebrow, DEFAULT_EYEBROW)
  const resolvedLocEyebrow = textOrDefault(locEyebrow, DEFAULT_LOC_EYEBROW)
  const resolvedLocSector = textOrDefault(locSector, DEFAULT_LOC_SECTOR)
  const resolvedLocNote = textOrDefault(locNote, DEFAULT_LOC_NOTE)
  // Ligne facultative : pas de repli sur une valeur par défaut, sinon vider le
  // champ dans le Studio ferait réapparaître du texte.
  const resolvedLocExtra = locExtraLine?.trim() ?? ''
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
                  <span className="presentiel-loc-tag">Secteur</span>
                  <span className="presentiel-loc-val">{resolvedLocSector}</span>
                </div>
                <div className="presentiel-loc-row">
                  <span className="presentiel-loc-tag">Adresse</span>
                  <span className="presentiel-loc-val">
                    {resolvedLocNote}
                    {resolvedLocExtra ? (
                      <>
                        <br />
                        {resolvedLocExtra}
                      </>
                    ) : null}
                  </span>
                </div>
              </div>
              <figure className="presentiel-loc-figure">
                <div className="presentiel-loc-map">
                  <iframe
                    src={MAP_EMBED_URL}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Carte du secteur de Montréal où se déroulent les séances en présentiel"
                    allowFullScreen
                  />
                </div>
                <figcaption className="presentiel-loc-note">Secteur approximatif</figcaption>
              </figure>
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
