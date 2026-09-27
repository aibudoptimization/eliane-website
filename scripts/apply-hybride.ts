/**
 * Offre hybride (septembre 2026) : met à jour le contenu Sanity en ligne pour retirer l'offre
 * en présentiel exclusive et décrire le nouveau parcours (formulaire → courriel avec le lien
 * de réservation → appel découverte). Ne touche que les champs listés ici ; tout le reste de
 * la page d'accueil est laissé tel quel, y compris ce qu'Éliane a édité dans le Studio.
 *
 *   npx tsx scripts/apply-hybride.ts            essai à blanc : affiche ce qui changerait
 *   npx tsx scripts/apply-hybride.ts --apply    écrit dans le jeu de données
 *
 * Le contenu Sanity est en ligne dès qu'il est écrit : lancer --apply le jour où le nouveau
 * funnel (PR funnel-formulaire) part en production, pas avant.
 */
import {createClient} from 'next-sanity'
import {existsSync, readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {HOME_PAGE_ID, SITE_SETTINGS_ID} from '../sanity/ids'

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

// ── Portable Text ─────────────────────────────────────────────────────────────

type Span = {_type: 'span'; _key: string; text: string; marks: string[]}
type Block = {
  _type: 'block'
  _key: string
  style: 'normal'
  children: Span[]
  markDefs: Array<Record<string, unknown>>
}

let keyCounter = 0
const k = () => `h${Date.now().toString(36)}${(++keyCounter).toString(36)}`

/** `*italique*` devient une marque `em` ; rien d'autre n'est interprété. */
function block(text: string): Block {
  const children: Span[] = []
  const re = /\*(.+?)\*/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) children.push({_type: 'span', _key: k(), text: text.slice(last, m.index), marks: []})
    children.push({_type: 'span', _key: k(), text: m[1], marks: ['em']})
    last = m.index + m[0].length
  }
  if (last < text.length) children.push({_type: 'span', _key: k(), text: text.slice(last), marks: []})
  return {_type: 'block', _key: k(), style: 'normal', children, markDefs: []}
}

/** Un paragraphe par ligne vide. */
function blocks(text: string): Block[] {
  return text.split(/\n\s*\n/).map((p) => block(p.trim()))
}

function ptToText(value: unknown): string {
  if (typeof value === 'string') return value
  if (!Array.isArray(value)) return ''
  return value
    .map((b) => (Array.isArray(b?.children) ? b.children.map((c: {text?: string}) => c.text ?? '').join('') : ''))
    .join('\n\n')
}

// ── Le contenu ────────────────────────────────────────────────────────────────

const MARQUEE = [
  'Formule hybride',
  'Deux rencontres en présentiel à Montréal',
  'Un appel chaque semaine',
  'Accompagnement personnalisé',
  'Approche durable',
]

const PILIER_RENCONTRES = {
  title: 'Deux rencontres en présentiel',
  description:
    "Une au début du parcours, une à la fin, en privé, à Montréal : c'est là qu'on pose les bases et qu'on mesure le chemin parcouru.",
}

const PILIER_APPEL = {
  title: 'Un appel chaque semaine',
  description:
    "Chaque semaine, on fait le point ensemble sur tes entraînements et tes questions. Tu n'es jamais laissée seule entre les deux rencontres.",
}

const SECTION = {
  eyebrow: 'Comment ça se passe',
  title: 'Deux rencontres en présentiel, un appel chaque semaine.',
  intro:
    "Le meilleur des deux : on se voit en personne au début et à la fin de ton parcours, et on se parle chaque semaine entre les deux. Entre nos appels, ton programme t'attend dans ton application.",
  cards: [
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
  ],
  quote:
    "Un programme peut te dire *quoi faire*. Un accompagnement te montre *comment le faire*, et t'aide à progresser plus vite qu'en étant seule.",
  locCityLine: 'Pour les deux rencontres en présentiel. Le reste se passe à distance.',
}

const POUR_TOI_NON = 'Tu ne peux pas te libérer pour deux rencontres en présentiel à Montréal.'

const FAQ_INTRO =
  "Pour toute question sur l'accompagnement, la formule ou la logistique, n'hésite pas. Je réponds personnellement."

const ETAPES = [
  {
    title: 'Remplir le formulaire',
    description:
      "Quelques questions sur ta situation et tes objectifs : c'est tout ce qu'il faut pour commencer. Tu reçois ensuite par courriel le lien pour réserver ton appel découverte.",
  },
  {
    title: 'Réserver ton appel découverte',
    description: 'Tu choisis le moment qui te convient. Quinze minutes, en appel vidéo, gratuit et sans engagement.',
  },
  {
    title: "L'appel découverte",
    description:
      'Je prends le temps de comprendre où tu en es, on clarifie tes objectifs ensemble et je réponds à tes questions.',
  },
  {
    title: 'Présentation de ton offre',
    description: "Après l'appel, je te présente ton offre personnalisée lors d'un second appel vidéo.",
  },
  {
    title: 'Confirmation',
    description: 'On regarde ensemble une date pour débuter ton accompagnement.',
  },
]

const ETAPES_CTA = 'Je veux commencer'

const FAQ_LIEU = {
  id: 'faq-lieu',
  question: 'Où ont lieu les rencontres en présentiel ?',
  answer:
    "Les deux rencontres en présentiel, au début et à la fin du parcours, se déroulent dans un studio privé à Montréal, dans le secteur Ahuntsic / Parc-Extension. L'adresse exacte t'est communiquée après notre premier contact. Le reste de l'accompagnement se fait à distance : ton programme dans ton application, et un appel chaque semaine.",
}

const FAQ_PRIVE = {
  id: 'faq-prive-ou-groupe',
  question: 'Les rencontres et les appels sont-ils privés ou en groupe ?',
  answer:
    "Tout est individuel : les deux rencontres en présentiel comme les appels hebdomadaires. Tu bénéficies d'un accompagnement entièrement personnalisé.",
}

const META_DESCRIPTION =
  'Éliane Larre, entraîneure personnelle à Montréal. Accompagnement hybride et personnalisé : deux rencontres en présentiel et un appel chaque semaine pour progresser avec confiance.'

/** Champs cachés hérités de l'ancienne page : ils servaient de repli et portent l'ancien texte. */
const LEGACY_FIELDS = [
  'marqueeOneItems',
  'marqueeTwoItems',
  'inPersonHeadline',
  'inPersonBenefits',
  'inPersonPunchLine',
  'afterCallFooter',
]

/** Documents des anciennes pages d'offres, absents du schéma et jamais affichés. */
const ORPHAN_TYPES = ['homepageOffers', 'offer', 'offerPage']

// ── Le script ─────────────────────────────────────────────────────────────────

type Keyed = {_key?: string; title?: string; description?: unknown; iconName?: string}

function withKey<T extends {_key?: string}>(item: T, from?: Keyed): T & {_key: string} {
  return {...item, _key: from?._key ?? k()}
}

function show(label: string, before: unknown, after: unknown) {
  const b = typeof before === 'string' ? before : ptToText(before) || JSON.stringify(before)
  const a = typeof after === 'string' ? after : ptToText(after) || JSON.stringify(after)
  console.log(`\n• ${label}\n    avant : ${b}\n    après : ${a}`)
}

async function main() {
  loadEnvLocal()
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_API_TOKEN
  if (!projectId || !dataset) throw new Error('NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET manquants dans .env.local')
  if (APPLY && !token) throw new Error("SANITY_AUTH_TOKEN manquant dans .env.local : impossible d'écrire")

  const client = createClient({projectId, dataset, apiVersion: '2024-10-01', token, useCdn: false})

  const home = await client.fetch<Record<string, unknown> | null>(`*[_id == $id][0]`, {id: HOME_PAGE_ID})
  if (!home) throw new Error(`Document ${HOME_PAGE_ID} introuvable`)
  const settings = await client.fetch<Record<string, unknown> | null>(`*[_id == $id][0]`, {id: SITE_SETTINGS_ID})
  if (!settings) throw new Error(`Document ${SITE_SETTINGS_ID} introuvable`)
  const faqs = await client.fetch<Array<{_id: string; question?: string; answer?: unknown}>>(
    `*[_type == "faq" && _id in $ids]{_id, question, answer}`,
    {ids: [FAQ_LIEU.id, FAQ_PRIVE.id]},
  )
  const orphans = await client.fetch<Array<{_id: string; _type: string}>>(`*[_type in $types]{_id, _type}`, {
    types: ORPHAN_TYPES,
  })
  const draft = await client.fetch<{_id: string} | null>(`*[_id == $id][0]{_id}`, {id: `drafts.${HOME_PAGE_ID}`})

  console.log(APPLY ? 'MODE ÉCRITURE' : 'ESSAI À BLANC (ajoute --apply pour écrire)')

  // — Page d'accueil —
  const set: Record<string, unknown> = {}

  set.marqueeItems = MARQUEE
  show('marqueeItems', JSON.stringify(home.marqueeItems), JSON.stringify(MARQUEE))

  const pillars = Array.isArray(home.offeringFeatures) ? (home.offeringFeatures as Keyed[]) : []
  const iRencontres = pillars.findIndex((p) => /présentiel/i.test(p.title ?? ''))
  const iAppel = pillars.findIndex((p) => /entre les rencontres/i.test(p.title ?? ''))
  if (iRencontres < 0 || iAppel < 0) throw new Error(`Piliers introuvables : ${pillars.map((p) => p.title).join(' | ')}`)
  const newPillars = pillars.map((p, i) => {
    if (i === iRencontres) return {...p, title: PILIER_RENCONTRES.title, description: blocks(PILIER_RENCONTRES.description)}
    if (i === iAppel) return {...p, title: PILIER_APPEL.title, description: blocks(PILIER_APPEL.description)}
    return p
  })
  set.offeringFeatures = newPillars
  show(`offeringFeatures[${iRencontres}]`, `${pillars[iRencontres].title} — ${ptToText(pillars[iRencontres].description)}`, `${PILIER_RENCONTRES.title} — ${PILIER_RENCONTRES.description}`)
  show(`offeringFeatures[${iAppel}]`, `${pillars[iAppel].title} — ${ptToText(pillars[iAppel].description)}`, `${PILIER_APPEL.title} — ${PILIER_APPEL.description}`)

  set.inPersonEyebrow = SECTION.eyebrow
  show('inPersonEyebrow', home.inPersonEyebrow, SECTION.eyebrow)
  set.inPersonTitle = blocks(SECTION.title)
  show('inPersonTitle', home.inPersonTitle, SECTION.title)
  set.inPersonIntro = blocks(SECTION.intro)
  show('inPersonIntro', home.inPersonIntro, SECTION.intro)

  const oldCards = Array.isArray(home.presentielCards) ? (home.presentielCards as Keyed[]) : []
  set.presentielCards = SECTION.cards.map((card, i) =>
    withKey({_type: 'object', ...card, description: blocks(card.description)}, oldCards[i]),
  )
  SECTION.cards.forEach((card, i) =>
    show(`presentielCards[${i}]`, `${oldCards[i]?.title ?? '—'} — ${ptToText(oldCards[i]?.description)}`, `${card.title} — ${card.description}`),
  )

  set.locationQuote = blocks(SECTION.quote)
  show('locationQuote', home.locationQuote, SECTION.quote)
  set.inPersonLocCityLine = SECTION.locCityLine
  show('inPersonLocCityLine', home.inPersonLocCityLine ?? '', SECTION.locCityLine)

  const noItems = Array.isArray(home.forYouNoItems) ? (home.forYouNoItems as string[]) : []
  const iNo = noItems.findIndex((s) => /présentiel/i.test(s))
  if (iNo < 0) throw new Error(`forYouNoItems : aucune ligne « présentiel » — ${JSON.stringify(noItems)}`)
  set.forYouNoItems = noItems.map((s, i) => (i === iNo ? POUR_TOI_NON : s))
  show(`forYouNoItems[${iNo}]`, noItems[iNo], POUR_TOI_NON)

  set.faqSubheadline = blocks(FAQ_INTRO)
  show('faqSubheadline', home.faqSubheadline, FAQ_INTRO)

  const oldSteps = Array.isArray(home.afterCallSteps) ? (home.afterCallSteps as Keyed[]) : []
  set.afterCallSteps = ETAPES.map((step, i) =>
    withKey({_type: 'object', title: step.title, description: blocks(step.description)}, oldSteps[i]),
  )
  ETAPES.forEach((step, i) =>
    show(`afterCallSteps[${i}]`, `${oldSteps[i]?.title ?? '—'} — ${ptToText(oldSteps[i]?.description)}`, `${step.title} — ${step.description}`),
  )
  set.afterCallCtaLabel = ETAPES_CTA
  show('afterCallCtaLabel', home.afterCallCtaLabel, ETAPES_CTA)

  const legacyPresent = LEGACY_FIELDS.filter((f) => home[f] != null)
  console.log(`\n• champs hérités retirés : ${legacyPresent.join(', ') || 'aucun'}`)

  // — FAQ —
  const faqPatches = [FAQ_LIEU, FAQ_PRIVE].map((f) => {
    const doc = faqs.find((d) => d._id === f.id)
    if (!doc) throw new Error(`FAQ ${f.id} introuvable`)
    show(`${f.id}.question`, doc.question, f.question)
    show(`${f.id}.answer`, doc.answer, f.answer)
    return {id: f.id, set: {question: f.question, answer: blocks(f.answer)}}
  })

  // — Paramètres du site —
  show('siteSettings.metaDescription', settings.metaDescription, META_DESCRIPTION)

  // — Ménage —
  console.log(`\n• documents orphelins supprimés : ${orphans.map((o) => `${o._type} ${o._id}`).join(', ') || 'aucun'}`)
  console.log(`• brouillon ${draft ? 'drafts.' + HOME_PAGE_ID + ' supprimé (il ne portait qu\'un autre ordre des vidéos)' : 'aucun'}`)

  if (!APPLY) {
    console.log('\nRien n\'a été écrit.')
    return
  }

  let tx = client
    .transaction()
    .patch(HOME_PAGE_ID, {set, unset: LEGACY_FIELDS})
    .patch(SITE_SETTINGS_ID, {set: {metaDescription: META_DESCRIPTION}})
  for (const f of faqPatches) tx = tx.patch(f.id, {set: f.set})
  for (const o of orphans) tx = tx.delete(o._id)
  if (draft) tx = tx.delete(draft._id)
  await tx.commit()

  console.log('\nÉcrit. Le site affiche le nouveau contenu dès maintenant ; vérifie la page d\'accueil et la FAQ.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
