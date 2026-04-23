export const HOMEPAGE_QUERY = `*[_type == "homePage"][0]{
  heroHeadline[]{..., children[]{...}},
  heroSubheadline,
  heroImage { ..., "asset": asset-> },
  introHeadline[]{..., children[]{...}},
  introDescription,
  introImage { ..., "asset": asset-> },
  approachHeadline[]{..., children[]{...}},
  approachDescription,
  approachImage { ..., "asset": asset-> },
  freeWeightsHeadline[]{..., children[]{...}},
  freeWeightsBullets[]{..., children[]{...}},
  freeWeightsImage { ..., "asset": asset-> }
}`

export const HOMEPAGE_OFFERS_QUERY = `*[_type == "homepageOffers"][0]{
  tremplinDurationBadge,
  tremplinTitle,
  tremplinDuration,
  tremplinPitch,
  tremplinFeatures,
  tremplinIdealFor,
  tremplinLinkUrl,
  signatureDurationBadge,
  signatureShowPopularBadge,
  signatureTitle,
  signatureDuration,
  signaturePitch,
  signatureFeatures,
  signatureIdealFor,
  signatureLinkUrl
}`

export const FAQS_QUERY = `*[_type == "faq"] | order(order asc){
  _id,
  question,
  answer,
  order
}`

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  contactEmail,
  calBookingUrl,
  calNamespace,
  instagramUrl
}`
