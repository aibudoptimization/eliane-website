/**
 * One-time migration: convert legacy string/text homePage fields to Portable Text blocks.
 * Run: npx tsx scripts/migrate-rich-text-fields.ts
 * Requires SANITY_AUTH_TOKEN (write) and NEXT_PUBLIC_SANITY_* env vars.
 */
import {createClient} from 'next-sanity'

type Block = {
  _type: 'block'
  _key: string
  style: 'normal'
  children: Array<{_type: 'span'; _key: string; text: string; marks: string[]}>
  markDefs: unknown[]
}

let keyCounter = 0
const k = () => `k${++keyCounter}`

function stringToBlocks(text: string): Block[] {
  const trimmed = text.trim()
  if (!trimmed) return []
  return [
    {
      _type: 'block',
      _key: k(),
      style: 'normal',
      children: [{_type: 'span', _key: k(), text: trimmed, marks: []}],
      markDefs: [],
    },
  ]
}

function migrateValue(value: unknown): Block[] | undefined {
  if (typeof value === 'string' && value.trim()) {
    return stringToBlocks(value)
  }
  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
    return undefined
  }
  return undefined
}

const TOP_LEVEL_FIELDS = [
  'heroSubheadline',
  'meetTrainerQuote',
  'offeringTitle',
  'offeringLead',
  'offeringAppDescription',
  'inPersonTitle',
  'inPersonIntro',
  'locationQuote',
  'forYouFooter',
  'reviewsTitle',
] as const

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_AUTH_TOKEN ?? process.env.SANITY_API_READ_TOKEN

  if (!projectId || !dataset || !token) {
    throw new Error('Missing Sanity env vars (projectId, dataset, SANITY_AUTH_TOKEN).')
  }

  const client = createClient({projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false})

  const doc = await client.fetch<Record<string, unknown> | null>(`*[_type == "homePage"][0]`)

  if (!doc) {
    throw new Error('No homePage document found.')
  }

  const patch: Record<string, unknown> = {}

  for (const field of TOP_LEVEL_FIELDS) {
    const migrated = migrateValue(doc[field])
    if (migrated) patch[field] = migrated
  }

  const meetCards = doc.meetTrainerCards as
    | Array<{_key?: string; label?: string; body?: unknown}>
    | undefined
  if (Array.isArray(meetCards)) {
    patch.meetTrainerCards = meetCards.map((card) => {
      const body = migrateValue(card.body)
      return body ? {...card, body} : card
    })
  }

  const pillars = doc.offeringFeatures as
    | Array<{_key?: string; title?: string; description?: unknown}>
    | undefined
  if (Array.isArray(pillars)) {
    patch.offeringFeatures = pillars.map((pillar) => {
      const description = migrateValue(pillar.description)
      return description ? {...pillar, description} : pillar
    })
  }

  const presentielCards = doc.presentielCards as
    | Array<{_key?: string; title?: string; description?: unknown; iconName?: string}>
    | undefined
  if (Array.isArray(presentielCards)) {
    patch.presentielCards = presentielCards.map((card) => {
      const description = migrateValue(card.description)
      return description ? {...card, description} : card
    })
  }

  const steps = doc.afterCallSteps as
    | Array<{_key?: string; title?: string; description?: unknown}>
    | undefined
  if (Array.isArray(steps)) {
    patch.afterCallSteps = steps.map((step) => {
      const description = migrateValue(step.description)
      return description ? {...step, description} : step
    })
  }

  const legacyQuote = migrateValue(doc.inPersonPunchLine)
  if (legacyQuote && !doc.locationQuote) {
    patch.locationQuote = legacyQuote
  }

  if (Object.keys(patch).length === 0) {
    console.log('Nothing to migrate — fields already Portable Text or empty.')
    return
  }

  await client.patch(doc._id as string).set(patch).commit()
  console.log(`Migrated homePage (${doc._id as string}):`, Object.keys(patch).join(', '))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
