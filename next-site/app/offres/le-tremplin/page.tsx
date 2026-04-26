import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { OfferPageTemplate } from '@/app/components/OfferPageTemplate'
import { sanityFetch } from '@/sanity/live'
import { OFFER_PAGE_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Le Tremplin — Éliane Larre',
  description: 'Formule 1 mois pour démarrer avec structure, clarté et accompagnement.',
}

export default async function LeTremplinPage() {
  const [{ data: offerPage }, { data: siteSettings }] = await Promise.all([
    sanityFetch({ query: OFFER_PAGE_BY_SLUG_QUERY, params: { slug: 'le-tremplin' } }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ])

  if (!offerPage) notFound()

  return <OfferPageTemplate offerPage={offerPage} siteSettings={siteSettings} />
}
