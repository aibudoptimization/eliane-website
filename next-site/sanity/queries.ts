/** Inner projection for portable-text blocks (links). */
const ptInner = String.raw`
  ...,
  markDefs[]{
    ...,
    _type == "link" => {
      href,
      openInNewTab
    }
  }
`

/** `field` must be an array of blocks or null — coalesce avoids GROQ errors on null. */
function ptArray(field: string): string {
  return `coalesce(${field}, [])[]{${ptInner}}`
}

export const HOMEPAGE_QUERY = `*[_type == "homePage"][0]{
  heroKicker,
  "heroHeadline": ${ptArray('heroHeadline')},
  heroSubheadline,
  heroImage { ..., "asset": asset-> },
  heroCtaLabel,
  heroCtaSubtext,
  marqueeOneItems,
  marqueeTwoItems,
  "sledHeadline": ${ptArray('sledHeadline')},
  sledSubheadline,
  sledImage { ..., "asset": asset-> },
  sledFromTitle,
  "sledFromItems": coalesce(sledFromItems, [])[]{
    ...,
    "text": ${ptArray('text')}
  },
  sledToTitle,
  "sledToItems": coalesce(sledToItems, [])[]{
    ...,
    "text": ${ptArray('text')}
  },
  sledCtaLabel,
  meetTrainerKicker,
  meetTrainerImage { ..., "asset": asset-> },
  "meetTrainerBody": ${ptArray('meetTrainerBody')},
  meetTrainerCtaLabel,
  meetTrainerCtaUrl,
  pullQuoteText,
  pullQuoteEnabled,
  offeringHeadline,
  offeringImages[] { ..., "asset": asset-> },
  offeringFeatures[]{ title, description },
  offeringCtaLabel,
  inPersonHeadline,
  inPersonIntro,
  inPersonBenefits[]{ icon, title, text },
  inPersonPunchLine,
  reviewsHeadline,
  reviewsList[]{ name, rating, excerpt },
  forYouHeadline,
  forYouImage { ..., "asset": asset-> },
  forYouYesTitle,
  forYouYesItems,
  forYouNoTitle,
  forYouNoItems,
  forYouFooter,
  forYouCtaLabel,
  afterCallHeadline,
  afterCallIntro,
  afterCallItems,
  afterCallFooter,
  afterCallCtaLabel,
  purpleCtaHeadline,
  purpleCtaButtonLabel,
  purpleCtaFooter,
  faqHeadline,
  collaboratorsHeadline,
  collaboratorsIntro
}`

export const COLLABORATORS_QUERY = `*[_type == "collaborator"]|order(featured desc, order asc, name asc){
  _id,
  name,
  description,
  logo { ..., "asset": asset-> },
  website,
  featured,
  order
}`

export const FAQS_QUERY = `*[_type == "faq"] | order(order asc){
  _id,
  question,
  answer,
  order
}`

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  contactEmail,
  bookingUrl,
  calBookingUrl,
  calNamespace,
  instagramUrl
}`
