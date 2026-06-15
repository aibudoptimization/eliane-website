import Image from 'next/image'
import {BioCardStack, type BioCardItem} from '@/app/components/BioCardStack'

export const DEFAULT_MEET_TRAINER_CARDS: BioCardItem[] = [
  {
    label: 'Mon parcours',
    body: "Depuis plus de 10 ans, l'entraînement fait partie de ma vie. **Au fil des années, j'ai appris que les résultats durables ne viennent pas d'une routine parfaite, d'un plan extrême ou d'une motivation constante.** Ils viennent d'une structure réaliste, d'une meilleure compréhension de son corps et d'habitudes qu'on arrive réellement à maintenir dans le quotidien.",
  },
  {
    label: 'Ma philosophie',
    body: "J'accompagne mes clientes comme j'aborde mon propre parcours : avec équilibre, sans extrêmes ni restrictions, et en m'adaptant aux différentes saisons de la vie. **Je ne suis pas là pour te donner un plan impossible à maintenir.** Je suis là pour t'aider à t'entraîner avec intention, à mieux comprendre ce que tu fais, à progresser de façon sécuritaire et à bâtir une routine qui s'intègre vraiment à ta vie.",
  },
  {
    label: 'Ma spécialité',
    body: 'Aider les femmes à se sentir plus fortes, plus confiantes et plus en maîtrise de leur corps. Des femmes qui veulent des résultats, oui, mais surtout une méthode qui respecte leur rythme, leur réalité et leur corps.',
  },
  {
    label: 'Mon engagement',
    body: "**Mon but est de t'amener vers plus de clarté, de constance et d'autonomie.** Je veux que tu saches quoi faire, pourquoi tu le fais, et comment continuer à prendre soin de toi bien après notre travail ensemble.",
  },
]

const DEFAULT_MEET_TRAINER_QUOTE =
  "Tu n'as pas besoin d'un autre programme. Tu as besoin d'un cadre, d'un regard expert et d'un accompagnement qui s'adapte réellement à toi."

export type MeetTrainerSectionProps = {
  kicker?: string
  imageSrc: string
  imageAlt: string
  cards?: BioCardItem[]
  quote?: string
  ctaLabel?: string
  ctaUrl?: string
}

export function MeetTrainerSection({
  kicker = 'Rencontre ton entraîneure',
  imageSrc,
  imageAlt,
  cards,
  quote,
  ctaLabel = 'Voir mon quotidien sur Instagram',
  ctaUrl = 'https://www.instagram.com/eliane.au.naturel',
}: MeetTrainerSectionProps) {
  const bioCards =
    cards?.filter((c) => c.label?.trim() || c.body?.trim()).length
      ? cards.filter((c) => c.label?.trim() || c.body?.trim())
      : DEFAULT_MEET_TRAINER_CARDS

  const quoteText = quote?.trim() || DEFAULT_MEET_TRAINER_QUOTE

  return (
    <section className="section section-rencontre" id="rencontre">
      <div className="section-inner section-inner--rencontre">
        <h2 className="sr-only">Rencontre ton entraîneure</h2>
        <div className="bio-grid">
          <div className="bio-sticky-photo">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={900}
              height={1125}
              sizes="(max-width: 900px) 100vw, 45vw"
              priority={false}
            />
          </div>

          <div className="bio-right">
            <p className="eyebrow bio-eyebrow">{kicker}</p>

            <BioCardStack cards={bioCards} />

            <div className="bio-section-quote">
              <p>{quoteText}</p>
            </div>

            <a className="bio-instagram" href={ctaUrl} target="_blank" rel="noopener noreferrer">
              {ctaLabel}
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
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
