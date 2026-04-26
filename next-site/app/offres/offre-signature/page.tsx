import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { OfferPageTemplate } from '@/app/components/OfferPageTemplate'
import { sanityFetch } from '@/sanity/live'
import { OFFER_PAGE_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Offre signature — Éliane Larre',
  description:
    "Une formule de 12 semaines pour transformer ta façon de t'entraîner avec structure, soutien et encadrement serré.",
}

export default async function OffreSignaturePage() {
  const [{ data: offerPage }, { data: siteSettings }] = await Promise.all([
    sanityFetch({ query: OFFER_PAGE_BY_SLUG_QUERY, params: { slug: 'offre-signature' } }),
    sanityFetch({ query: SITE_SETTINGS_QUERY }),
  ])

  if (!offerPage) notFound()

  return <OfferPageTemplate offerPage={offerPage} siteSettings={siteSettings} />
}
