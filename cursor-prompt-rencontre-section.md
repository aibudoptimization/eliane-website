# Implementation prompt — "Rencontre ton entraîneure" section

The attached HTML file (`eliane-larre-bio-redesign.html`) is a fully working reference. Recreate the **"Rencontre ton entraîneure"** section exactly as it appears in that file. Do not change any text, content, or images.

---

## Where to find it in the reference file

Search for `<!-- ==== Bio (auto-play cards) ==== -->`. Everything until the next section comment is this section.

---

## Layout

Two-column grid (`0.85fr 1.15fr`, `gap: 64px`, `align-items: start`):

- **Left column** — portrait photo, `position: sticky`, `top: calc(var(--nav-h) + 20px)`, `aspect-ratio: 4/5`, rounded corners, card shadow.
- **Right column** — flex column containing, in order:
  1. Eyebrow label ("Rencontre ton entraîneure") — always visible
  2. Card stack (auto-play, 4 cards)
  3. Quote block (always visible, lavender background)
  4. Instagram link (always visible)

---

## Card stack

- **4 cards**, absolutely positioned inside a `height: 260px` container (`bio-card-area`)
- Background: `var(--beige)` (warm cream, NOT white)
- Only **one card visible at a time** — all others `opacity: 0`. No peeking, no offset, no shadow stacking. Clean invisible deck.
- Each card has: a small uppercase label (e.g. "MON PARCOURS"), a paragraph of text, and a circular SVG timer in the top-right corner

### Card content (in order)
1. **Mon parcours** — "Depuis plus de 12 ans…"
2. **Ma philosophie** — "J'accompagne mes clientes…"
3. **Ma spécialité** — "Aider les femmes à se sentir…" *(no bold label prefix)*
4. **Mon engagement** — "Mon but est de t'amener…"

---

## Auto-play timer

- Each card displays for **9 seconds** (`DURATION = 9000`)
- Circular SVG ring in the top-right corner of the active card fills from 0 → 100% over the 9s
- Ring starts animating **after** the peel transition completes (~1350ms after card change)
- Ring uses `stroke-dashoffset` animation: circumference = `75.4` (radius 12, `2πr`)

---

## Card transition — diagonal peel (bottom-right → top-left)

This is the core visual. When cards change:

1. **Exiting card** gets class `is-peeling` → triggers `cardPeelOut` CSS animation (1.3s, linear)
2. **Entering card** gets class `is-revealing` → sits at full size behind the peeling card, **no clip-path of its own**
3. After 1350ms, classes are cleaned up: exiting → `is-past` (opacity 0), entering → `is-active` (opacity 1)

### Why multi-keyframe clip-path

CSS interpolates polygon vertices linearly between two keyframes. With only start/end keyframes, the polygon vertices collapse inward — not diagonally. The fix: define a keyframe every 10% where the diagonal peel line is correctly placed. Between consecutive keyframes, the interpolation stays on the diagonal.

The peel line at step `n` (where n goes 0→10) has two points:
- On the right edge: `(100%, (100 - n*10)%)`
- On the bottom edge: `((100 - n*10)%, 100%)`

Copy the exact `@keyframes cardPeelOut` from the reference file (11 keyframes, 0%–100%).

---

## Post-it flag navigation

4 thin vertical tabs (`10px × 34px`) positioned `right: -12px` of the card area, sticking out beyond the card's right edge:
- `border-radius: 0 4px 4px 0` (rounded on right only)
- `border-left: none`
- Inactive: `background: var(--beige-deep)`, subtle border
- Active: `background: var(--plum)`, slightly wider (`14px`), plum shadow
- Hover: widens to `13px`, light plum tint
- Clicking a flag jumps to that card and resets the timer

---

## Quote block (always visible, below cards)

- Background: `var(--lavender)`
- Border radius: `var(--radius)`
- Opening `"` typographic mark (absolute positioned, plum, 3.5rem, serif)
- Text: italic serif, centered, `color: var(--ink)`
- Content: *"Tu n'as pas besoin d'un autre programme. Tu as besoin d'un cadre, d'un regard expert et d'un accompagnement qui s'adapte réellement à toi."*

---

## Key CSS tokens (match the rest of the site)

```css
--beige:       #f6f1ea
--beige-deep:  #ebe4d9
--plum:        #552772
--lavender:    #dfc7ed
--font-serif:  'Playfair Display', Georgia, serif
--font-sans:   'Poppins', system-ui, sans-serif
--radius:      22px
--nav-h:       92px
```

---

## Mobile (≤ 920px)

- Grid collapses to single column
- Photo: `position: static`, `max-width: 480px`, centered
- Card area: `height: auto; min-height: 240px`
- All cards: `opacity: 1 !important; transform: none !important` (stack normally, no animations)
- Flag navigation: `display: none`

---

## Sanity Studio — schema changes

The section content must be editable from Sanity. Update the schema and page document accordingly.

### Fields to add to the bio/rencontre section schema

```js
// In your bio or page schema (e.g. schemas/rencontrePage.js or wherever this section lives)

{
  name: 'bioCards',
  title: 'Cards (auto-play)',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {
          name: 'label',
          title: 'Label (e.g. Mon parcours)',
          type: 'string',
        },
        {
          name: 'body',
          title: 'Card text',
          type: 'text',   // or 'array' of blocks if you need rich text
        },
      ],
      preview: {
        select: { title: 'label', subtitle: 'body' },
      },
    },
  ],
  validation: Rule => Rule.max(4),
},
{
  name: 'pullQuote',
  title: 'Quote (shown below cards)',
  type: 'text',
},
{
  name: 'instagramUrl',
  title: 'Instagram URL',
  type: 'url',
},
{
  name: 'bioPhoto',
  title: 'Portrait photo',
  type: 'image',
  options: { hotspot: true },
},
```

### Component changes

Once the schema is updated, replace all hardcoded card text, quote text, Instagram URL, and photo `src` with values fetched from Sanity via your existing GROQ query for this page. The structure maps directly: `bioCards[0..3]` → cards 1–4, `pullQuote` → lavender quote block, `instagramUrl` → Instagram link href, `bioPhoto` → left column image.

---

## ⚠️ Manual step — enter content in Sanity Studio

After deploying the schema changes, go to **Sanity Studio → [your page document]** and fill in the following fields manually:

**Cards (in order):**

| # | Label | Body text |
|---|-------|-----------|
| 1 | Mon parcours | Depuis plus de 12 ans, l'entraînement fait partie de ma vie. Au fil des années, j'ai appris que les résultats durables ne viennent pas d'une routine parfaite, d'un plan extrême ou d'une motivation constante. Ils viennent d'une structure réaliste, d'une meilleure compréhension de son corps et d'habitudes qu'on arrive réellement à maintenir dans le quotidien. |
| 2 | Ma philosophie | J'accompagne mes clientes comme j'aborde mon propre parcours : avec équilibre, sans extrêmes ni restrictions, et en m'adaptant aux différentes saisons de la vie. Je ne suis pas là pour te donner un plan impossible à maintenir. Je suis là pour t'aider à t'entraîner avec intention, à mieux comprendre ce que tu fais, à progresser de façon sécuritaire et à bâtir une routine qui s'intègre vraiment à ta vie. |
| 3 | Ma spécialité | Aider les femmes à se sentir plus fortes, plus confiantes et plus en maîtrise de leur corps. Des femmes qui veulent des résultats, oui, mais surtout une méthode qui respecte leur rythme, leur réalité et leur corps. |
| 4 | Mon engagement | Mon but est de t'amener vers plus de clarté, de constance et d'autonomie. Je veux que tu saches quoi faire, pourquoi tu le fais, et comment continuer à prendre soin de toi bien après notre travail ensemble. |

**Quote:**
> Tu n'as pas besoin d'un autre programme. Tu as besoin d'un cadre, d'un regard expert et d'un accompagnement qui s'adapte réellement à toi.

**Instagram URL:** `https://www.instagram.com/eliane.au.naturel`

**Portrait photo:** upload the same portrait used in the current bio section.

---

## Implementation checklist

- [ ] Section background: `var(--beige-deep)` (`.section.alt`)
- [ ] Sticky photo left column
- [ ] 4 auto-play cards with beige background
- [ ] `cardPeelOut` keyframe animation (copy exactly from reference)
- [ ] Entering card: full size, no clip-path, sits behind peeling card at z-index 3
- [ ] Circular SVG ring timer, starts after peel completes
- [ ] Post-it flag tabs (not dots)
- [ ] Lavender quote block, centered italic text
- [ ] Instagram link with `align-self: flex-start` (prevents underline stretching full width)
- [ ] Mobile fallback
- [ ] Sanity schema updated and deployed
- [ ] ⚠️ Content manually entered in Sanity Studio (see table above)
