import type {Metadata} from 'next'
import {urlFor} from '@/sanity/imageUrl'
import {SITE_URL, DEFAULT_OG_IMAGE_PATH} from '@/lib/site-config'

type SanityImage = Parameters<typeof urlFor>[0]

export const DEFAULT_ICON_PATH = '/icon.png'
export const DEFAULT_APPLE_ICON_PATH = '/apple-icon.png'
export const DEFAULT_FAVICON_ICO_PATH = '/favicon.ico'

function hasAsset(image: unknown): image is SanityImage {
  return (
    typeof image === 'object' &&
    image !== null &&
    'asset' in image &&
    (image as {asset?: unknown}).asset != null
  )
}

export function resolveSiteIconUrls(siteSettings: {favicon?: unknown} | null | undefined) {
  if (hasAsset(siteSettings?.favicon)) {
    const builder = urlFor(siteSettings.favicon)
    return {
      icon: builder.width(192).height(192).fit('crop').url(),
      apple: builder.width(180).height(180).fit('crop').url(),
      manifest192: builder.width(192).height(192).fit('crop').url(),
      manifest512: builder.width(512).height(512).fit('crop').url(),
    }
  }

  return {
    icon: `${SITE_URL}${DEFAULT_ICON_PATH}`,
    apple: `${SITE_URL}${DEFAULT_APPLE_ICON_PATH}`,
    manifest192: `${SITE_URL}${DEFAULT_ICON_PATH}`,
    manifest512: `${SITE_URL}${DEFAULT_ICON_PATH}`,
  }
}

export function siteIconsMetadata(
  siteSettings: {favicon?: unknown} | null | undefined,
): Pick<Metadata, 'icons'> {
  const {icon, apple} = resolveSiteIconUrls(siteSettings)
  const hasCustom = hasAsset(siteSettings?.favicon)

  if (hasCustom) {
    return {
      icons: {
        icon: [{url: icon, sizes: '192x192', type: 'image/png'}],
        apple: [{url: apple, sizes: '180x180', type: 'image/png'}],
      },
    }
  }

  return {
    icons: {
      icon: [
        {url: icon, sizes: '192x192', type: 'image/png'},
        {url: `${SITE_URL}${DEFAULT_FAVICON_ICO_PATH}`, sizes: '32x32', type: 'image/x-icon'},
      ],
      apple: [{url: apple, sizes: '180x180', type: 'image/png'}],
    },
  }
}
