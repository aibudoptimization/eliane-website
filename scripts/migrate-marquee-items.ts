/**
 * One-time migration: copy marqueeOneItems + marqueeTwoItems into marqueeItems.
 *
 * Usage (from repo root, with .env.local):
 *   npx tsx scripts/migrate-marquee-items.ts
 *
 * Skips if marqueeItems already has ≥2 phrases.
 *
 * If you get 403 "permission update required" with an Editor token:
 * - Confirm the token in SANITY_AUTH_TOKEN is the one shown once at creation (not the Viewer token).
 * - Try a temporary Administrator token, or run after `npx sanity login` (your user account).
 * - Or paste phrases in Studio: Page d'accueil → Bande défilante.
 */

import {createClient} from 'next-sanity'
import {existsSync, readFileSync} from 'node:fs'
import {resolve} from 'node:path'

/** Do not overwrite tokens already set (e.g. by `sanity exec --with-user-token`). */
const PRESERVE_ENV_KEYS = new Set(['SANITY_AUTH_TOKEN', 'SANITY_API_TOKEN'])

function loadEnvLocal(): void {
  const p = resolve(process.cwd(), '.env.local')
  if (!existsSync(p)) {
    throw new Error('Missing .env.local in project root')
  }
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

function getWriteToken(): string {
  const auth = process.env.SANITY_AUTH_TOKEN?.trim()
  const read = process.env.SANITY_API_READ_TOKEN?.trim()
  if (auth) return auth
  if (read) return read
  throw new Error('No Sanity token in .env.local')
}

const DEFAULT_MARQUEE_ITEMS = [
  'Entraînements en présentiel',
  'À Montréal',
  '10+ années de pratique',
  'Approche personnalisée',
  'Approche durable',
  'Progression mesurable',
]

function mergeLegacyMarquee(
  one: string[] | undefined,
  two: string[] | undefined,
): string[] {
  const legacy = [...(one ?? []), ...(two ?? [])]
  const seen = new Set<string>()
  return legacy.filter((item) => {
    const trimmed = item.trim()
    if (!trimmed || seen.has(trimmed)) return false
    seen.add(trimmed)
    return true
  })
}

async function main() {
  loadEnvLocal()

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  if (!projectId || !dataset) {
    throw new Error(
      'Missing Sanity env vars. Need NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.',
    )
  }

  const token = getWriteToken()
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01'

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  })

  const home = await client.fetch<{
    _id: string
    marqueeItems?: string[]
    marqueeOneItems?: string[]
    marqueeTwoItems?: string[]
  } | null>(`*[_type == "homePage"][0]{
    _id,
    marqueeItems,
    marqueeOneItems,
    marqueeTwoItems
  }`)

  if (!home?._id) {
    throw new Error('No homePage document found. Run seed or create the document in Studio first.')
  }

  const tokenSource = process.env.SANITY_AUTH_TOKEN?.trim()
    ? 'SANITY_AUTH_TOKEN'
    : 'SANITY_API_READ_TOKEN'

  const existing = home.marqueeItems?.filter((s) => typeof s === 'string' && s.trim()) ?? []
  let merged = mergeLegacyMarquee(home.marqueeOneItems, home.marqueeTwoItems)
  if (merged.length < 2) {
    merged = DEFAULT_MARQUEE_ITEMS
  }

  if (existing.length >= 2) {
    console.log(`Skipped: marqueeItems already has ${existing.length} phrase(s).`)
    existing.forEach((phrase) => console.log(`  - ${phrase}`))
    return
  }

  console.log(`Using token from ${tokenSource}`)
  console.log(`Will write ${merged.length} phrase(s) to marqueeItems:`)
  merged.forEach((phrase) => console.log(`  - ${phrase}`))

  const patchIds = home._id.startsWith('drafts.')
    ? [home._id]
    : [home._id, `drafts.${home._id}`]

  let patched = false
  let lastError: unknown

  for (const id of patchIds) {
    try {
      await client.patch(id).set({marqueeItems: merged}).commit()
      console.log(`\nMigrated homePage (${id}) successfully.`)
      patched = true
      break
    } catch (err) {
      const status = (err as {statusCode?: number}).statusCode
      if (status === 404) continue
      lastError = err
    }
  }

  if (!patched) throw lastError
}

main().catch((err) => {
  console.error('Marquee migration failed:', err)
  process.exit(1)
})
