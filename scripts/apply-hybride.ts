/**
 * Offre hybride (septembre 2026) : la copie du site reste à Éliane, qui la réécrit dans le
 * Studio. Ce script ne fait que ce qui n'est pas de la copie visible :
 *
 *   - la description SEO (meta description), qui disait « accompagnement en présentiel » ;
 *   - le retrait des six champs cachés hérités de l'ancienne page d'accueil, que le code ne lit
 *     plus (ils portaient l'ancien texte présentiel en repli) ;
 *   - la suppression des quatre documents des anciennes pages d'offres (Le Tremplin, Offre
 *     signature), absents du schéma et jamais affichés.
 *
 *   npx tsx scripts/apply-hybride.ts            essai à blanc : affiche ce qui changerait
 *   npx tsx scripts/apply-hybride.ts --apply    écrit dans le jeu de données
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
  const settings = await client.fetch<{metaDescription?: string} | null>(`*[_id == $id][0]{metaDescription}`, {
    id: SITE_SETTINGS_ID,
  })
  if (!settings) throw new Error(`Document ${SITE_SETTINGS_ID} introuvable`)
  const orphans = await client.fetch<Array<{_id: string; _type: string}>>(`*[_type in $types]{_id, _type}`, {
    types: ORPHAN_TYPES,
  })

  console.log(APPLY ? 'MODE ÉCRITURE' : 'ESSAI À BLANC (ajoute --apply pour écrire)')

  console.log(`\n• siteSettings.metaDescription\n    avant : ${settings.metaDescription ?? ''}\n    après : ${META_DESCRIPTION}`)
  const legacyPresent = LEGACY_FIELDS.filter((f) => home[f] != null)
  console.log(`\n• homePage, champs hérités retirés : ${legacyPresent.join(', ') || 'aucun (déjà fait)'}`)
  console.log(`\n• documents orphelins supprimés : ${orphans.map((o) => `${o._type} ${o._id}`).join(', ') || 'aucun (déjà fait)'}`)
  console.log('\nLa copie de la page d\'accueil et de la FAQ n\'est pas touchée : Éliane la réécrit dans le Studio.')

  if (!APPLY) {
    console.log('\nRien n\'a été écrit.')
    return
  }

  let tx = client
    .transaction()
    .patch(SITE_SETTINGS_ID, {set: {metaDescription: META_DESCRIPTION}})
    .patch(HOME_PAGE_ID, {unset: LEGACY_FIELDS})
  for (const o of orphans) tx = tx.delete(o._id)
  await tx.commit()

  console.log('\nÉcrit.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
