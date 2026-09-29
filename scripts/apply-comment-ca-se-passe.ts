/**
 * Section « Comment ça se passe » (ex-« Pourquoi le présentiel ») : texte approuvé par Éliane le
 * 28 septembre 2026. Écrit les champs de la section dans le document homePage — et dans son
 * brouillon Studio s'il en existe un, sinon publier ce brouillon remettrait l'ancien texte.
 * Le bloc « Où ça se passe » (accroche, secteur, note sur l'adresse) n'est pas touché ; seule la
 * ligne complémentaire sous la note est ajoutée.
 *
 *   npx tsx scripts/apply-comment-ca-se-passe.ts            essai à blanc : affiche ce qui changerait
 *   npx tsx scripts/apply-comment-ca-se-passe.ts --apply    écrit dans le jeu de données
 */
import {createClient} from 'next-sanity'
import {randomBytes} from 'node:crypto'
import {existsSync, readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {HOME_PAGE_ID} from '../sanity/ids'

const APPLY = process.argv.includes('--apply')

const PRESERVE_ENV_KEYS = new Set(['SANITY_AUTH_TOKEN', 'SANITY_API_TOKEN'])

function loadEnvLocal(): void {
  const p = resolve(process.cwd(), '.env.local')
  if (!existsSync(p)) return
  for (const line of readFileSync(p, 'utf8').split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const key = t.slice(0, i).trim()
    if (PRESERVE_ENV_KEYS.has(key) && process.env[key]) continue
    let val = t.slice(i + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    process.env[key] = val
  }
}

/* Texte approuvé par Éliane (2026-09-28). Les mêmes phrases servent de repli dans le code
   (app/components/PresentielSection.tsx) : un champ vidé dans le Studio affiche donc ce texte. */
const EYEBROW = 'Comment ça se passe'
const TITLE = 'Deux rencontres en présentiel, un appel chaque semaine.'
const INTRO =
  "Le meilleur des deux : on se voit en personne au début et à la fin de ton parcours, et on se parle chaque semaine entre les deux. Entre nos appels, ton programme t'attend dans ton application."
const QUOTE =
  "Un programme peut te dire quoi faire. Un accompagnement te montre comment le faire, et t'aide à progresser plus vite qu'en étant seule."
const LOC_EXTRA_LINE = 'Pour les deux rencontres en présentiel. Le reste se passe à distance.'

const CARDS = [
  {
    iconName: 'check',
    title: 'Rencontre de départ',
    description:
      'En personne, à Montréal. On fait connaissance, on regarde ton point de départ et on lance ton parcours sur des bases solides.',
  },
  {
    iconName: 'clock',
    title: 'Appel hebdomadaire',
    description:
      "Chaque semaine, on se parle : tes entraînements, tes questions, les ajustements à faire. C'est ce qui te garde constante.",
  },
  {
    iconName: 'shield',
    title: 'Programme dans ton application',
    description:
      'Tes entraînements, ta progression et nos échanges, au même endroit, accessibles où que tu sois.',
  },
  {
    iconName: 'eye',
    title: 'Rencontre de fin',
    description:
      'En personne, à Montréal, pour mesurer le chemin parcouru et préparer la suite, avec des bases que tu gardes bien après notre travail ensemble.',
  },
]

type Span = {_type: 'span'; _key: string; marks: string[]; text: string}
type Block = {_type: 'block'; _key: string; style: 'normal'; markDefs: unknown[]; children: Span[]}

function key(): string {
  return randomBytes(6).toString('hex')
}

/** Un paragraphe Portable Text sans mise en forme, tel que le Studio le créerait. */
function block(text: string): Block {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: key(), marks: [], text}],
  }
}

function plain(value: unknown): string {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''
  return value
    .map((b) =>
      Array.isArray(b?.children) ? b.children.map((c: {text?: string}) => c.text ?? '').join('') : '',
    )
    .join(' / ')
}

type SectionDoc = {
  _id: string
  inPersonEyebrow?: string
  inPersonTitle?: unknown
  inPersonIntro?: unknown
  presentielCards?: Array<{title?: string; description?: unknown; iconName?: string}>
  locationQuote?: unknown
  inPersonLocCityLine?: string
}

function show(label: string, before: string, after: string): void {
  console.log(`\n• ${label}\n    avant : ${before}\n    après : ${after}`)
}

async function main() {
  loadEnvLocal()
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_API_TOKEN
  if (!projectId || !dataset) {
    throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET manquants dans .env.local')
  }
  if (APPLY && !token) throw new Error("SANITY_AUTH_TOKEN manquant dans .env.local : impossible d'écrire")

  const client = createClient({projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false})
  const draftId = `drafts.${HOME_PAGE_ID}`
  const docs = await client.fetch<SectionDoc[]>(
    `*[_id in [$id, $draftId]]{_id, inPersonEyebrow, inPersonTitle, inPersonIntro, presentielCards, locationQuote, inPersonLocCityLine}`,
    {id: HOME_PAGE_ID, draftId},
  )
  if (!docs.some((d) => d._id === HOME_PAGE_ID)) throw new Error(`Document ${HOME_PAGE_ID} introuvable`)

  console.log(APPLY ? 'MODE ÉCRITURE' : 'ESSAI À BLANC (ajoute --apply pour écrire)')
  if (!token) console.log('Sans SANITY_AUTH_TOKEN, le brouillon du Studio ne peut pas être vérifié.')
  if (!docs.some((d) => d._id === draftId)) console.log('Aucun brouillon Studio : seul le document publié est visé.')

  const cardsAfter = CARDS.map((c) => `${c.title} [${c.iconName}] — ${c.description}`).join('\n            ')
  for (const doc of docs) {
    console.log(`\n=== ${doc._id === draftId ? 'brouillon Studio (drafts.homePage)' : 'document publié (homePage)'} ===`)
    show('Accroche', doc.inPersonEyebrow ?? '', EYEBROW)
    show('Titre principal', plain(doc.inPersonTitle), TITLE)
    show('Introduction', plain(doc.inPersonIntro), INTRO)
    const cardsBefore = (doc.presentielCards ?? [])
      .map((c) => `${c.title ?? ''} [${c.iconName ?? ''}] — ${plain(c.description)}`)
      .join('\n            ')
    show('Cartes', cardsBefore, cardsAfter)
    show('Citation de clôture', plain(doc.locationQuote), QUOTE)
    show('Lieu — ligne complémentaire', doc.inPersonLocCityLine ?? '', LOC_EXTRA_LINE)
  }
  console.log("\nLe bloc « Où ça se passe » (accroche, secteur, note sur l'adresse) n'est pas touché.")

  if (!APPLY) {
    console.log("\nRien n'a été écrit.")
    return
  }

  const values = {
    inPersonEyebrow: EYEBROW,
    inPersonTitle: [block(TITLE)],
    inPersonIntro: [block(INTRO)],
    presentielCards: CARDS.map((c) => ({
      _type: 'object',
      _key: key(),
      title: c.title,
      iconName: c.iconName,
      description: [block(c.description)],
    })),
    locationQuote: [block(QUOTE)],
    inPersonLocCityLine: LOC_EXTRA_LINE,
  }

  let tx = client.transaction()
  for (const doc of docs) tx = tx.patch(doc._id, {set: values})
  await tx.commit()

  console.log(`\nÉcrit : ${docs.map((d) => d._id).join(', ')}.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
