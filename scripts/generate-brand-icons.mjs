/**
 * Generate favicon / PWA icons from public/images/logo-eliane-larre.png.
 * OG image is served via layout.tsx (Sanity ogImage → /images/image-de-partage.png).
 * Do not add app/opengraph-image.png — it overrides generateMetadata for Facebook.
 *
 * Run: node scripts/generate-brand-icons.mjs
 */
import {readFileSync, writeFileSync} from 'node:fs'
import {dirname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import sharp from 'sharp'
import pngToIco from 'png-to-ico'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const logoSrc = join(root, 'public/images/logo-eliane-larre.png')
const publicDir = join(root, 'public')

async function generateIcons() {
  const logo = sharp(logoSrc).ensureAlpha()

  const icon32 = await logo.clone().resize(32, 32, {fit: 'cover'}).png().toBuffer()
  const icon192 = await logo.clone().resize(192, 192, {fit: 'cover'}).png().toBuffer()
  const apple180 = await logo.clone().resize(180, 180, {fit: 'cover'}).png().toBuffer()

  writeFileSync(join(publicDir, 'icon.png'), icon192)
  writeFileSync(join(publicDir, 'apple-icon.png'), apple180)
  writeFileSync(join(publicDir, 'favicon.ico'), await pngToIco(icon32))

  console.log('Generated public/icon.png (192×192)')
  console.log('Generated public/apple-icon.png (180×180)')
  console.log('Generated public/favicon.ico (32×32)')
  console.log('OG: use public/images/image-de-partage.png (Sanity or /images/ fallback in layout)')
}

generateIcons().catch((err) => {
  console.error(err)
  process.exit(1)
})
