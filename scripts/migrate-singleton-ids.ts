/**
 * One-time migration: move singleton documents to stable ids (homePage, siteSettings).
 *
 * Usage:
 *   npx tsx scripts/migrate-singleton-ids.ts
 */

import {createClient} from 'next-sanity'
import {existsSync, readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {HOME_PAGE_ID, SITE_SETTINGS_ID} from '../sanity/ids'

const PRESERVE_ENV_KEYS = new Set(['SANITY_AUTH_TOKEN', 'SANITY_API_TOKEN'])

function loadEnvLocal(): void {
  const p = resolve(process.cwd(), '.env.local')
  if (!existsSync(p)) throw new Error('Missing .env.local in project root')

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

async function migrateSingleton(
  client: ReturnType<typeof createClient>,
  schemaType: string,
  targetId: string,
) {
  const doc = await client.fetch<Record<string, unknown> | null>(
    `*[_type == $schemaType][0]`,
    {schemaType},
  )

  if (!doc) {
    console.log(`- ${schemaType}: no document found, skipping`)
    return
  }

  const currentId = String(doc._id)
  if (currentId === targetId) {
    console.log(`- ${schemaType}: already uses id "${targetId}"`)
    return
  }

  const draft = await client.fetch<Record<string, unknown> | null>(
    `*[_id == $draftId][0]`,
    {draftId: `drafts.${currentId}`},
  )

  const {_rev, ...published} = doc
  let tx = client
    .transaction()
    .createOrReplace({...published, _id: targetId} as typeof doc & {_id: string})

  if (draft) {
    const {_rev: draftRev, ...draftBody} = draft
    tx = tx.createOrReplace({...draftBody, _id: `drafts.${targetId}`} as typeof draft & {_id: string})
    tx = tx.delete(`drafts.${currentId}`)
  }

  tx = tx.delete(currentId)
  await tx.commit()

  console.log(`- ${schemaType}: migrated ${currentId} -> ${targetId}`)
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
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  console.log('Migrating singleton document ids...')
  await migrateSingleton(client, 'homePage', HOME_PAGE_ID)
  await migrateSingleton(client, 'siteSettings', SITE_SETTINGS_ID)
  console.log('Done.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
