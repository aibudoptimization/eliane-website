/** Brand plum — matches `--plum` in globals.css */
export const DEFAULT_ACCENT_ITALIC_COLOR = '#552772'

/** Body text on lavender quote boxes — matches `--ink` */
export const DEFAULT_QUOTE_ITALIC_COLOR = '#1a1410'

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/

/** Swatches shown in Studio color pickers (brand defaults). */
export const BRAND_ITALIC_COLOR_SWATCHES = [
  {hex: DEFAULT_ACCENT_ITALIC_COLOR},
  {hex: DEFAULT_QUOTE_ITALIC_COLOR},
]

/** Reads hex from legacy string or @sanity/color-input object `{ hex: '#…' }`. */
export function colorFieldToHex(value: unknown, fallback: string): string {
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (HEX_COLOR.test(trimmed)) return trimmed
  }
  if (typeof value === 'object' && value !== null && 'hex' in value) {
    const hex = (value as {hex?: string}).hex
    if (typeof hex === 'string' && HEX_COLOR.test(hex.trim())) return hex.trim()
  }
  return fallback
}

export function normalizeHexColor(value: unknown, fallback: string): string {
  return colorFieldToHex(value, fallback)
}

export function resolveSiteColors(siteSettings: {
  accentItalicColor?: unknown
  quoteItalicColor?: unknown
} | null | undefined) {
  return {
    accentItalic: normalizeHexColor(
      siteSettings?.accentItalicColor,
      DEFAULT_ACCENT_ITALIC_COLOR,
    ),
    quoteItalic: normalizeHexColor(
      siteSettings?.quoteItalicColor,
      DEFAULT_QUOTE_ITALIC_COLOR,
    ),
  }
}

export function siteColorCssVars(
  siteSettings: {
    accentItalicColor?: unknown
    quoteItalicColor?: unknown
  } | null | undefined,
): Record<string, string> {
  const {accentItalic, quoteItalic} = resolveSiteColors(siteSettings)
  return {
    '--accent-italic': accentItalic,
    '--quote-italic': quoteItalic,
  }
}
