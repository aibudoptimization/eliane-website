# Implementation prompt — "Pourquoi le présentiel" section

You have two reference files:
- `presentiel-mockup.html` — open in a browser to see the exact layout and styling.
- This prompt — spec, CSS tokens, content, and Sanity instructions.

Recreate the **"Pourquoi le présentiel"** section in the existing codebase. It sits between the "Mon accompagnement" section and the "Témoignages" section. Do not change any surrounding sections.

---

## Layout overview

```
[Full width] Eyebrow + H2 + subtitle
[55% / 45% grid] 2×2 cards (left)  |  Où ça se passe card (right)
[Full width] Lavender quote block
```

Section background: `var(--offer-warm-sand)` (#e8dfd4). Use existing `.section.sand` class.

---

## Header (full width)

```
Eyebrow:   "Pourquoi le présentiel"
H2:        "Pourquoi le présentiel change tout."
           ("le présentiel" is italic + plum — use <span class="em"> or <em>)
Subtitle:  "Parce que la façon dont on s'entraîne change tout.
            Voici ce que le présentiel t'offre que rien d'autre ne peut remplacer."
```

---

## Body grid — 55 / 45

```css
display: grid;
grid-template-columns: 1.22fr 1fr;
gap: 28px;         /* tighten to ~20px on mobile */
align-items: start;
margin-bottom: 28px;
```

### Left column (55%) — 2×2 card grid

```css
display: grid;
grid-template-columns: 1fr 1fr;
gap: 16px;
```

**Card anatomy:**
- `background: #fff`, `border-radius: var(--radius)` (22px), `overflow: hidden`
- Box shadow: `var(--shadow-card)`
- Hover: `translateY(-3px)` + `var(--shadow-card-hover)`

**Card header (plum bar):**
- `background: var(--plum)` (#552772)
- `padding: 16px 20px`
- `display: flex; align-items: center; gap: 12px`
- SVG icon: `color: var(--lavender)` (#dfc7ed), `stroke-width: 1.6`, size 22×22
- Title: `font-size: ~0.97rem`, `font-weight: 500`, `color: var(--beige)`, `line-height: 1.35`

**Card body:**
- `padding: 18px 20px 20px`
- Description: `font-size: ~0.93rem`, `color: var(--mid)`, `line-height: 1.72`

**The 4 cards with their icons and content:**

| # | Icon (SVG path) | Title | Description |
|---|-----------------|-------|-------------|
| 1 | Circle + checkmark | Correction en temps réel | J'ajuste ta technique pour maximiser ta progression et diminuer les risques de blessure. |
| 2 | Shield path | Progression sécuritaire | Je t'aide à progresser tout en respectant ton rythme. |
| 3 | Circle + clock hands | Imputabilité | Le présentiel ajoute une structure qui soutient l'engagement. |
| 4 | Eye + inner circle | Adaptation à ton état | Un entraînement sur mesure, selon ton énergie, tes besoins et tes envies. |

Copy the exact SVG paths from `presentiel-mockup.html` — search for `card-header` to find each one.

---

### Right column (45%) — Où ça se passe card

White card, `border-radius: var(--radius)`, `padding: 22px 24px 26px`, `box-shadow: var(--shadow-card)`. No `overflow: hidden` on the outer card — overflow is handled by the inset map only.

**Internal layout: flex column, gap 20px**

```
Eyebrow: "Où ça se passe"  ← top, full width

Inner grid (2 columns, 1fr 1fr, gap 20px, align-items: center):
  Left:  address details (Lieu + Adresse)
  Right: Google Maps iframe inset
```

**Left — address details:**
```
Detail row 1: label "Lieu"    / value "Biner Training"
Detail row 2: label "Adresse" / value "220 Boulevard Crémazie Ouest · Montréal, QC H2P 1C6"
```
No borders between rows. Label: small caps, muted. Value: Playfair Display serif ~1rem.

**Right — inset map:**
```html
<div style="border-radius: 14px; overflow: hidden; aspect-ratio: 1/1;
            box-shadow: 0 4px 14px rgba(26,20,16,0.10);">
  <iframe
    src="https://www.google.com/maps?q=Biner+Training+220+Boulevard+Crémazie+Ouest+Montréal&t=&z=15&ie=UTF8&iwloc=&output=embed"
    style="width:100%; height:100%; border:0; display:block;
           filter: saturate(0.88) contrast(0.94);"
    loading="lazy"
    referrerpolicy="no-referrer-when-downgrade"
    title="Carte vers Biner Training, Montréal"
    allowfullscreen>
  </iframe>
</div>
```

- Map is square (`aspect-ratio: 1/1`), rounded corners (14px), inset shadow.
- No external link to Google Maps. No "Voir l'itinéraire" button.
- Remove any existing link button from the current implementation.

---

## Quote — full width below the grid

```html
<div class="presentiel-quote">
  <p>Un programme peut te dire <em>quoi faire</em>. Un accompagnement en présentiel
  te montre <em>comment le faire</em> et t'aide à progresser plus rapidement
  qu'en étant seule.</p>
</div>
```

Styling:
- `background: var(--lavender)` (#dfc7ed)
- `border-radius: var(--radius)`, `padding: 26px 32px`
- Opening `"` typographic mark: `position: absolute`, top-left, Playfair serif, 4rem, plum, 35% opacity
- Text: Playfair Display italic, ~1.18rem, `color: var(--ink)`, `line-height: 1.58`
- `em` / italic words: `color: var(--plum)`

---

## Key CSS tokens

```css
--offer-warm-sand: #e8dfd4   /* section background */
--plum:            #552772
--lavender:        #dfc7ed
--beige:           #f6f1ea
--mid:             #5a5048
--ink:             #1a1410
--font-serif:      'Playfair Display', Georgia, serif
--font-sans:       'Poppins', system-ui, sans-serif
--radius:          22px
--shadow-card:     0 14px 44px rgba(85,39,114,0.08), 0 4px 12px rgba(26,20,16,0.04)
--shadow-card-hover: 0 22px 60px rgba(85,39,114,0.14), 0 6px 16px rgba(26,20,16,0.06)
```

---

## Reveal animations

Use existing classes:
- Header block: `.reveal`
- 2×2 card grid wrapper: `.reveal-stagger` (children stagger in)
- Location card: `.reveal`
- Quote block: `.reveal`

---

## Mobile (≤ 920px)

- Grid collapses to single column
- Cards come first, location block below
- Quote below everything
- Card grid: `grid-template-columns: 1fr 1fr` (stays 2-col on mobile, fine for cards)
- On very small screens (≤ 540px): card grid collapses to `1fr`

---

## Sanity Studio — schema changes

Add these fields to the section document:

```js
{
  name: 'presentielCards',
  title: 'Pourquoi le présentiel — 4 cards',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      { name: 'title',       title: 'Titre',       type: 'string' },
      { name: 'description', title: 'Description', type: 'text'   },
      { name: 'iconName',    title: 'Icône (nom)', type: 'string',
        description: 'check | shield | clock | eye — maps to the SVG in the component' },
    ],
    preview: { select: { title: 'title' } },
  }],
  validation: Rule => Rule.length(4),
},
{
  name: 'locationQuote',
  title: 'Citation de clôture',
  type: 'text',
},
```

The location details (Biner Training, address, map URL) can remain hardcoded in the component since they won't change, or you can add them as fields if the client wants flexibility.

---

## ⚠️ Manual step — enter content in Sanity Studio

After deploying the schema, fill in:

**Cards (in order):**

| # | Titre | Description | Icône |
|---|-------|-------------|-------|
| 1 | Correction en temps réel | J'ajuste ta technique pour maximiser ta progression et diminuer les risques de blessure. | check |
| 2 | Progression sécuritaire | Je t'aide à progresser tout en respectant ton rythme. | shield |
| 3 | Imputabilité | Le présentiel ajoute une structure qui soutient l'engagement. | clock |
| 4 | Adaptation à ton état | Un entraînement sur mesure, selon ton énergie, tes besoins et tes envies. | eye |

**Citation de clôture:**
> Un programme peut te dire quoi faire. Un accompagnement en présentiel te montre comment le faire et t'aide à progresser plus rapidement qu'en étant seule.

---

## Implementation checklist

- [ ] Section uses `.section.sand` (`background: var(--offer-warm-sand)`)
- [ ] Full-width header: eyebrow + H2 (italic plum "le présentiel") + subtitle
- [ ] 55/45 grid (`grid-template-columns: 1.22fr 1fr`)
- [ ] 4 cards: plum header bar with icon + title fused, white body with description
- [ ] Card hover: `translateY(-3px)` + elevated shadow
- [ ] Location card: embedded Google Maps iframe (no external link button)
- [ ] Location info below map: eyebrow, H3, description, Lieu row, Adresse row
- [ ] Full-width lavender quote block below the grid
- [ ] Reveal animations on all blocks
- [ ] Mobile: single column, cards above location, quote at bottom
- [ ] Sanity schema updated and deployed
- [ ] ⚠️ Content manually entered in Sanity Studio
