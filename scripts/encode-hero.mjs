/**
 * One-off / repeatable: resize hero portrait to 2400×3000 (4:5) and emit WebP + JPEG.
 * Usage: node scripts/encode-hero.mjs <path-to-source.png>
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const src = process.argv[2];
if (!src) {
  console.error('Usage: node scripts/encode-hero.mjs <path-to-source-image>');
  process.exit(1);
}

const W = 2400;
const H = 3000;
const outDir = path.join(process.cwd(), 'public', 'images');

await mkdir(outDir, { recursive: true });

const base = sharp(src).resize(W, H, { fit: 'cover', position: 'top' });

await base
  .clone()
  .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: '4:4:4' })
  .toFile(path.join(outDir, 'eliane-hero.jpg'));

await base
  .clone()
  .webp({ quality: 88, effort: 6 })
  .toFile(path.join(outDir, 'eliane-hero.webp'));

console.log(`Wrote ${W}×${H} eliane-hero.jpg and eliane-hero.webp → ${outDir}`);
