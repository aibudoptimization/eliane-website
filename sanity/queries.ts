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
  "heroSubheadline": ${ptArray('heroSubheadline')},
  heroImage { ..., "asset": asset-> },
  heroCtaLabel,
  heroCtaSubtext,
  marqueeItems,
  marqueeOneItems,
  marqueeTwoItems,
  "sledHeadline": ${ptArray('sledHeadline')},
  sledEyebrow,
  "sledSubheadline": ${ptArray('sledSubheadline')},
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
  "meetTrainerCards": coalesce(meetTrainerCards, [])[]{
    _key,
    label,
    "body": ${ptArray('body')}
  },
  "meetTrainerQuote": ${ptArray('meetTrainerQuote')},
  meetTrainerCtaLabel,
  meetTrainerCtaUrl,
  offeringEyebrow,
  "offeringTitle": ${ptArray('offeringTitle')},
  "offeringLead": ${ptArray('offeringLead')},
  offeringFeatures[]{ _key, title, "description": ${ptArray('description')} },
  offeringAppKicker,
  offeringAppTitle,
  "offeringAppDescription": ${ptArray('offeringAppDescription')},
  offeringAppImage { ..., "asset": asset-> },
  offeringImages[] { ..., "asset": asset-> },
  offeringCtaLabel,
  inPersonEyebrow,
  "inPersonTitle": ${ptArray('inPersonTitle')},
  inPersonHeadline,
  "inPersonIntro": ${ptArray('inPersonIntro')},
  presentielCards[]{ _key, title, "description": ${ptArray('description')}, iconName },
  inPersonBenefits[]{ _key, icon, title, text },
  "locationQuote": ${ptArray('locationQuote')},
  inPersonLocEyebrow,
  inPersonLocVenue,
  inPersonLocStreet,
  inPersonLocCityLine,
  inPersonPunchLine,
  reviewsEyebrow,
  "reviewsTitle": ${ptArray('reviewsTitle')},
  reviewsHeadline,
  testimonialVideos[]{
    _key,
    reviewerName,
    reviewerRole,
    video { asset->{ url } },
    poster { ..., "asset": asset-> },
  },
  reviewsList[]{ _key, name, rating, excerpt },
  forYouEyebrow,
  "forYouTitle": ${ptArray('forYouTitle')},
  forYouHeadline,
  forYouImage { ..., "asset": asset-> },
  forYouYesTitle,
  forYouYesItems,
  forYouNoTitle,
  forYouNoItems,
  "forYouFooter": ${ptArray('forYouFooter')},
  forYouCtaLabel,
  afterCallEyebrow,
  "afterCallHeadline": ${ptArray('afterCallHeadline')},
  "afterCallIntro": ${ptArray('afterCallIntro')},
  afterCallSteps[]{
    _key,
    title,
    "description": ${ptArray('description')}
  },
  afterCallItems,
  afterCallFooter,
  afterCallCtaLabel,
  purpleCtaEyebrow,
  "purpleCtaHeadline": ${ptArray('purpleCtaHeadline')},
  purpleCtaButtonLabel,
  purpleCtaFooter,
  faqEyebrow,
  "faqHeadline": ${ptArray('faqHeadline')},
  "faqSubheadline": ${ptArray('faqSubheadline')},
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
  instagramUrl,
  metaTitle,
  metaDescription,
  favicon { ..., "asset": asset-> },
  ogImage { ..., "asset": asset-> }
}`
