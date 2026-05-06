/**
 * Plan 03 Step 6 — Sanity data checks (GROQ).
 * Run from repo root: npx --prefix next-site tsx next-site/scripts/verify-plan03-step6.ts
 * Or from next-site: npx tsx scripts/verify-plan03-step6.ts
 * Requires `.env.local` with NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 * and SANITY_API_READ_TOKEN (or SANITY_AUTH_TOKEN).
 */
import {createClient} from 'next-sanity'
import {readFileSync, existsSync} from 'node:fs'
import {resolve} from 'node:path'
import {COLLABORATORS_QUERY, FAQS_QUERY, HOMEPAGE_QUERY} from '../sanity/queries'

function loadEnvLocal(): void {
  const p = resolve(process.cwd(), '.env.local')
  if (!existsSync(p)) {
    throw new Error('Missing next-site/.env.local')
  }
  for (const line of readFileSync(p, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i === -1) continue
    const key = t.slice(0, i).trim()
    let val = t.slice(i + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = val
  }
}

function portableTextPlain(blocks: unknown): string {
  if (!Array.isArray(blocks)) return ''
  let out = ''
  for (const block of blocks as Array<{_type?: string; children?: Array<{text?: string}>}>) {
    if (block?._type === 'block' && Array.isArray(block.children)) {
      for (const c of block.children) {
        if (typeof c?.text === 'string') out += c.text
      }
    }
  }
  return out.trim()
}

function sledItemsHaveText(
  items: Array<{text?: unknown}> | null | undefined,
  label: string,
): void {
  const list = Array.isArray(items) ? items : []
  if (list.length < 1) throw new Error(`homePage: ${label} needs at least one item`)
  for (let i = 0; i < list.length; i++) {
    const plain = portableTextPlain(list[i]?.text)
    if (!plain) throw new Error(`homePage: ${label}[${i}] has empty text`)
  }
}

function assertHomePage(h: Record<string, unknown> | null): void {
  if (h == null) throw new Error('homePage: no document found')

  if (!portableTextPlain(h.heroHeadline)) throw new Error('homePage: heroHeadline empty')
  const heroAsset = (h.heroImage as {asset?: unknown} | null)?.asset
  if (heroAsset == null) throw new Error('homePage: heroImage missing')

  const m1 = h.marqueeOneItems as string[] | undefined
  const m2 = h.marqueeTwoItems as string[] | undefined
  if ((m1?.length ?? 0) < 2) throw new Error('homePage: marqueeOneItems needs ≥2 phrases')
  if ((m2?.length ?? 0) < 3) throw new Error('homePage: marqueeTwoItems needs ≥3 phrases')

  sledItemsHaveText(h.sledFromItems as Array<{text?: unknown}>, 'sledFromItems')
  sledItemsHaveText(h.sledToItems as Array<{text?: unknown}>, 'sledToItems')

  if (!portableTextPlain(h.meetTrainerBody)) {
    throw new Error('homePage: meetTrainerBody empty')
  }

  if (h.pullQuoteEnabled === true) {
    const pq = typeof h.pullQuoteText === 'string' ? h.pullQuoteText.trim() : ''
    if (!pq) throw new Error('homePage: pullQuoteEnabled but pullQuoteText empty')
  }

  const features = h.offeringFeatures as unknown[] | undefined
  const images = h.offeringImages as unknown[] | undefined
  if ((features?.length ?? 0) < 1) throw new Error('homePage: offeringFeatures empty')
  if ((images?.length ?? 0) < 1) throw new Error('homePage: offeringImages empty')

  const punch = typeof h.inPersonPunchLine === 'string' ? h.inPersonPunchLine.trim() : ''
  if (!punch) throw new Error('homePage: inPersonPunchLine empty')

  const reviews = h.reviewsList as unknown[] | undefined
  if ((reviews?.length ?? 0) < 1) throw new Error('homePage: reviewsList empty')

  const yes = h.forYouYesItems as string[] | undefined
  const no = h.forYouNoItems as string[] | undefined
  if ((yes?.length ?? 0) < 1) throw new Error('homePage: forYouYesItems empty')
  if ((no?.length ?? 0) < 1) throw new Error('homePage: forYouNoItems empty')

  const after = h.afterCallItems as string[] | undefined
  if ((after?.length ?? 0) < 1) throw new Error('homePage: afterCallItems empty')

  if (!h.purpleCtaHeadline || !h.purpleCtaButtonLabel || !h.purpleCtaFooter) {
    throw new Error('homePage: purple CTA fields incomplete')
  }

  if (!h.faqHeadline) throw new Error('homePage: faqHeadline empty')
  if (!h.collaboratorsHeadline) throw new Error('homePage: collaboratorsHeadline empty')
}

function assertFaqs(faqs: Array<{order?: number; question?: string}> | null): void {
  if (!Array.isArray(faqs)) throw new Error('faq: fetch failed')
  if (faqs.length !== 8) throw new Error(`faq: expected 8 documents, got ${faqs.length}`)
  const orders = faqs.map((f) => f.order).filter((o): o is number => typeof o === 'number')
  if (orders.length !== 8) throw new Error('faq: every entry must have numeric order')
  const sorted = [...orders].sort((a, b) => a - b)
  const unique = new Set(sorted)
  if (unique.size !== 8) throw new Error(`faq: duplicate order values: ${sorted.join(', ')}`)
}

function assertFeaturedFlora(
  collaborators: Array<{name?: string; featured?: boolean}> | null,
): void {
  if (!Array.isArray(collaborators)) throw new Error('collaborator: fetch failed')
  const hit = collaborators.find(
    (c) =>
      c.featured === true &&
      typeof c.name === 'string' &&
      /flora|esthétique/i.test(c.name),
  )
  if (!hit) {
    throw new Error(
      'collaborator: no featured document matching Esthétique Flora (name / featured flag)',
    )
  }
}

async function main(): Promise<void> {
  loadEnvLocal()
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const token = process.env.SANITY_API_READ_TOKEN ?? process.env.SANITY_AUTH_TOKEN
  if (!projectId || !dataset || !token) {
    throw new Error('Missing NEXT_PUBLIC_SANITY_* or SANITY_API_READ_TOKEN / SANITY_AUTH_TOKEN')
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    useCdn: false,
    token,
  })

  const [home, faqs, collaborators] = await Promise.all([
    client.fetch(HOMEPAGE_QUERY),
    client.fetch(FAQS_QUERY),
    client.fetch(COLLABORATORS_QUERY),
  ])

  assertHomePage(home as Record<string, unknown> | null)
  assertFaqs(faqs as Array<{order?: number}> | null)
  assertFeaturedFlora(collaborators as Array<{name?: string; featured?: boolean}> | null)

  console.log('Plan 03 Step 6 (GROQ): OK — homePage sections, 8 FAQs (unique order), Flora featured.')
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err)
  process.exit(1)
})
