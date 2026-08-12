/**
 * Apply Phase 0 homepage + site settings content from ELIANE_STUDIO_MANUAL_CONTENT.md
 * Run: npx tsx scripts/apply-phase0-content.ts
 */
import {createClient} from 'next-sanity'
import {createReadStream, existsSync, readFileSync} from 'node:fs'
import {basename, resolve} from 'node:path'
import {HOME_PAGE_ID, SITE_SETTINGS_ID} from '../sanity/ids'

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
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    process.env[key] = val
  }
}

type Span = {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

type Block = {
  _type: 'block'
  _key: string
  style: 'normal'
  children: Span[]
  markDefs: Array<Record<string, unknown>>
  listItem?: 'bullet' | 'number'
  level?: number
}

let keyCounter = 0
const k = () => `k${++keyCounter}`

/** Supports **bold** and *italic* inline marks. */
function mdToBlock(text: string, opts?: {listItem?: 'bullet' | 'number'; level?: number}): Block {
  const children: Span[] = []
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g
  let last = 0
  let m: RegExpExecArray | null

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) {
      children.push({_type: 'span', _key: k(), text: text.slice(last, m.index), marks: []})
    }
    if (m[1] != null) {
      children.push({_type: 'span', _key: k(), text: m[1], marks: ['strong']})
    } else if (m[2] != null) {
      children.push({_type: 'span', _key: k(), text: m[2], marks: ['em']})
    }
    last = m.index + m[0].length
  }
  if (last < text.length) {
    children.push({_type: 'span', _key: k(), text: text.slice(last), marks: []})
  }
  if (children.length === 0) {
    children.push({_type: 'span', _key: k(), text, marks: []})
  }

  return {
    _type: 'block',
    _key: k(),
    style: 'normal',
    children,
    markDefs: [],
    ...(opts?.listItem ? {listItem: opts.listItem, level: opts.level ?? 1} : {}),
  }
}

function blocks(text: string): Block[] {
  return [mdToBlock(text)]
}

async function main() {
  loadEnvLocal()

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_API_READ_TOKEN

  if (!projectId || !dataset || !token) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_* or SANITY_AUTH_TOKEN in .env.local')
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-10-01',
    token,
    useCdn: false,
  })

  const ogImagePath = resolve(process.cwd(), 'public/images/image-de-partage.png')
  if (!existsSync(ogImagePath)) {
    throw new Error(`OG image not found: ${ogImagePath}`)
  }

  const ogAsset = await client.assets.upload('image', createReadStream(ogImagePath), {
    filename: basename(ogImagePath),
  })

  const logoPath = resolve(process.cwd(), 'public/images/logo-eliane-larre.png')
  if (!existsSync(logoPath)) {
    throw new Error(`Favicon source not found: ${logoPath}`)
  }
  const faviconAsset = await client.assets.upload('image', createReadStream(logoPath), {
    filename: basename(logoPath),
  })

  const homePatch = {
    heroSubheadline: blocks(
      "Un accompagnement sur mesure, conçu pour toi qui veux intégrer l'entraînement à ta vie, ou pour toi qui crois avoir tout essayé, mais qui n'arrives toujours pas à atteindre tes objectifs et à les maintenir.",
    ),
    meetTrainerCards: [
      {
        _key: k(),
        label: 'Mon parcours',
        body: blocks(
          "Depuis plus de 12 ans, l'entraînement fait partie de ma vie. **Au fil des années, j'ai appris que les résultats durables ne viennent pas d'une routine parfaite, d'un plan extrême ou d'une motivation constante.** Ils viennent d'une structure réaliste, d'une meilleure compréhension de son corps et d'habitudes qu'on arrive réellement à maintenir dans le quotidien.",
        ),
      },
      {
        _key: k(),
        label: 'Ma philosophie',
        body: blocks(
          "J'accompagne mes clientes comme j'aborde mon propre parcours : avec équilibre, sans extrêmes ni restrictions, et en m'adaptant aux différentes saisons de la vie. **Je ne suis pas là pour te donner un plan impossible à maintenir.** Je suis là pour t'aider à t'entraîner avec intention, à mieux comprendre ce que tu fais, à progresser de façon sécuritaire et à bâtir une routine qui s'intègre vraiment à ta vie.",
        ),
      },
      {
        _key: k(),
        label: 'Ma spécialité',
        body: blocks(
          'Aider les femmes à se sentir plus fortes, plus confiantes et plus en maîtrise de leur corps. Des femmes qui veulent des résultats, oui, mais surtout une méthode qui respecte leur rythme, leur réalité et leur corps.',
        ),
      },
      {
        _key: k(),
        label: 'Mon engagement',
        body: blocks(
          "**Mon but est de t'amener vers plus de clarté, de constance et d'autonomie.** Je veux que tu saches quoi faire, pourquoi tu le fais, et comment continuer à prendre soin de toi bien après notre travail ensemble.",
        ),
      },
    ],
    meetTrainerQuote: blocks(
      "Tu n'as pas besoin d'un autre programme. Tu as besoin d'un cadre, d'un regard expert et d'un accompagnement qui s'adapte réellement à toi.",
    ),
    offeringTitle: blocks('Un accompagnement *personnalisé*, du début à la fin.'),
    offeringLead: blocks(
      'Quatre piliers conçus ensemble pour te donner le cadre, la guidance et les outils dont tu as besoin pour progresser sans te perdre en route.',
    ),
    offeringAppDescription: blocks(
      "Tes entraînements, ton historique de progression et tes communications avec moi, regroupés au même endroit. Simple, lisible, fait pour t'accompagner sans t'alourdir.",
    ),
    offeringFeatures: [
      {
        _key: k(),
        title: 'Un plan clair',
        description: blocks(
          "Ton programme est intégré à ton application personnalisée pour t'offrir une structure claire et des outils concrets pour soutenir ta progression.",
        ),
      },
      {
        _key: k(),
        title: 'Séances privées en présentiel',
        description: blocks(
          "Tu es guidée, corrigée et accompagnée en temps réel pour progresser avec confiance. Le nombre de séances dépend de l'offre de service choisie.",
        ),
      },
      {
        _key: k(),
        title: 'Suivi entre les rencontres',
        description: blocks(
          "Tu n'es pas laissée seule entre deux séances. L'accompagnement te garde engagée, alignée et constante.",
        ),
      },
      {
        _key: k(),
        title: 'Enseignements concrets et utiles',
        description: blocks(
          'Je suis là pour te partager mes connaissances en entraînement et nutrition pour te permettre de comprendre et maintenir tes résultats.',
        ),
      },
    ],
    inPersonEyebrow: 'Où ont lieu les séances ensemble',
    inPersonTitle: blocks('Où ont lieu les séances ensemble'),
    inPersonIntro: blocks(
      "Parce que la façon dont on s'entraîne change tout. Voici ce que le présentiel t'offre que rien d'autre ne peut remplacer.",
    ),
    presentielCards: [
      {
        _key: k(),
        title: 'Correction en temps réel',
        description: blocks(
          "J'ajuste ta technique pour maximiser ta progression et diminuer les risques de blessure.",
        ),
        iconName: 'check',
      },
      {
        _key: k(),
        title: 'Progression sécuritaire',
        description: blocks("Je t'aide à progresser tout en respectant ton rythme."),
        iconName: 'shield',
      },
      {
        _key: k(),
        title: 'Imputabilité',
        description: blocks(
          "Le présentiel ajoute une structure *(qui soutient l'engagement au-delà de la motivation seule)* qui t'aide à rester constante.",
        ),
        iconName: 'clock',
      },
      {
        _key: k(),
        title: 'Adaptation à ton état',
        description: blocks(
          'Un entraînement sur mesure, selon ton énergie, tes besoins et tes envies.',
        ),
        iconName: 'eye',
      },
    ],
    locationQuote: blocks(
      "Un programme peut te dire *quoi faire*. Un accompagnement en présentiel te montre *comment le faire* et t'aide à progresser plus rapidement qu'en étant seule.",
    ),
    inPersonLocEyebrow: 'Où ça se passe',
    // Secteur large uniquement : aucun nom de salle ni adresse précise sur le site.
    inPersonLocVenue: 'Montréal — Ahuntsic / Parc-Extension',
    inPersonLocStreet:
      "Studio privé. L'adresse exacte t'est communiquée après notre premier contact.",
    inPersonLocCityLine: '',
    reviewsTitle: blocks("Ce qu'*elles* en disent."),
    afterCallIntro: blocks(
      "L'appel est gratuit, sans engagement, et sert d'abord à voir si l'accompagnement est réellement pertinent pour toi.",
    ),
  }

  const existingHome = await client.fetch<{_id: string} | null>(
    `*[_type == "homePage"][0]{_id}`,
  )
  const homeId = existingHome?._id ?? HOME_PAGE_ID

  await client
    .transaction()
    .createIfNotExists({_id: homeId, _type: 'homePage'})
    .patch(homeId, {set: homePatch})
    .createIfNotExists({_id: SITE_SETTINGS_ID, _type: 'siteSettings'})
    .patch(SITE_SETTINGS_ID, {
      set: {
        ogImage: {
          _type: 'image',
          asset: {_type: 'reference', _ref: ogAsset._id},
        },
        favicon: {
          _type: 'image',
          asset: {_type: 'reference', _ref: faviconAsset._id},
        },
      },
    })
    .commit()

  console.log('Phase 0 content applied:')
  console.log(`- homePage (${homeId}): meet trainer, présentiel, accompagnement, reviews, after-call`)
  console.log(`- siteSettings (${SITE_SETTINGS_ID}): ogImage + favicon uploaded`)
  console.log('Publish in Studio if documents show as drafts.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
