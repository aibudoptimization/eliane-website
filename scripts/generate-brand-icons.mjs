/**
 * Generate favicon / PWA icons from public/images/logo-eliane-larre.png
 * and sync OG fallback to app/opengraph-image.png from image-de-partage.png.
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
const ogSrc = join(root, 'public/images/image-de-partage.png')
const appDir = join(root, 'app')

async function generateIcons() {
  const logo = sharp(logoSrc).ensureAlpha()

  const icon32 = await logo.clone().resize(32, 32, {fit: 'cover'}).png().toBuffer()
  const icon192 = await logo.clone().resize(192, 192, {fit: 'cover'}).png().toBuffer()
  const apple180 = await logo.clone().resize(180, 180, {fit: 'cover'}).png().toBuffer()

  writeFileSync(join(appDir, 'icon.png'), icon192)
  writeFileSync(join(appDir, 'apple-icon.png'), apple180)
  writeFileSync(join(appDir, 'favicon.ico'), await pngToIco(icon32))

  const og = await sharp(ogSrc)
    .resize(1200, 630, {fit: 'cover', position: 'centre'})
    .png()
    .toBuffer()
  writeFileSync(join(appDir, 'opengraph-image.png'), og)

  console.log('Generated app/icon.png (192×192)')
  console.log('Generated app/apple-icon.png (180×180)')
  console.log('Generated app/favicon.ico (32×32)')
  console.log('Generated app/opengraph-image.png (1200×630)')
}

generateIcons().catch((err) => {
  console.error(err)
  process.exit(1)
})
