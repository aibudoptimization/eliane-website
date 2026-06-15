# Implementation prompt — "Mon accompagnement" section

You have three reference files:
- `accompagnement-mockup.html` — visual layout mockup. Open it in a browser to see exactly how the section should look.
- `app-screenshot.png` (or similar) — the real phone screenshot image to use in the app panel.
- This prompt — spec, CSS tokens, content, and Sanity instructions.

Recreate the **"Mon accompagnement"** section in the existing site codebase. It sits between the "Rencontre ton entraîneure" section and the "Pourquoi le présentiel" section. Do not change any surrounding sections.

---

## Layout overview

Two parts stacked vertically inside the section:

1. **Header** — eyebrow + H2 + lead paragraph
2. **Body** — two-column grid: vertical timeline (left) + app panel (right)
3. **CTA** — centered button below the body

Section background: `var(--beige)` (#f6f1ea). Use the existing `.section` class (100px padding top/bottom).

---

## Header

```
Eyebrow:  "Mon accompagnement"
H2:       "Un accompagnement personnalisé, du début à la fin."
          ("personnalisé" is italic + plum colored — use <em> or .accent)
Lead:     "Quatre piliers conçus ensemble pour te donner le cadre,
           la guidance et les outils dont tu as besoin pour progresser
           sans te perdre en route."
```

---

## Body grid

```css
display: grid;
grid-template-columns: 1.05fr 0.95fr;
gap: 64px;  /* tighten to 28–32px on mobile */
align-items: start;
```

### Left column — vertical timeline

Four items stacked. Each item = small lavender circle with a number + title + description paragraph. A thin vertical line runs through all the circles connecting them.

**Circle:**
- `width/height: 36px`, `border-radius: 50%`
- `background: var(--lavender)` (#dfc7ed)
- Number inside: italic serif, `color: var(--plum)`, ~14px

**Connecting line:**
- `position: absolute`, `left: 18px` (center of the circles), `top: first-circle-center`, `bottom: last-circle-center`
- `width: 1px`, `background: rgba(85,39,114,0.15)`
- Wrapper needs `position: relative`

**Item layout per pillar:**
```
[circle]  Title (font-weight: 500, ~1.05rem)
          Description (font-weight: 300, ~0.97rem, color: var(--mid))
```

Gap between items: ~24–28px.

**Pillar content (in order):**

| # | Title | Description |
|---|-------|-------------|
| 1 | Un plan clair | Ton programme est intégré à ton application personnalisée pour t'offrir une structure claire et des outils concrets pour soutenir ta progression. |
| 2 | Séances privées en présentiel | Tu es guidée, corrigée et accompagnée en temps réel pour progresser avec confiance. |
| 3 | Suivi entre les rencontres | Tu n'es pas laissée seule entre deux séances. L'accompagnement te garde engagée, alignée et constante. |
| 4 | Enseignements concrets et utiles | Je suis là pour te partager mes connaissances en entraînement et nutrition pour te permettre de comprendre et maintenir tes résultats. |

### Right column — app panel

A card with `background: var(--beige-deep)` (#ebe4d9), `border-radius: var(--radius)` (22px), `overflow: hidden`, `box-shadow: var(--shadow-card)`.

**Top — image area:**
- The provided phone screenshot PNG goes here
- `width: 100%`, `object-fit: cover`
- No specific height constraint — let the image breathe naturally
- Dark background behind the image (`background: #111`) in case of transparency

**Bottom — text area, padding ~22px 22px 24px:**
```
Small eyebrow:  "Application personnalisée"  (same eyebrow style as site, color: var(--mid))
H3:             "Un outil pensé pour toi, accessible où que tu sois."
Paragraph:      "Tes entraînements, ton historique de progression et tes
                 communications avec moi, regroupés au même endroit.
                 Simple, lisible, fait pour t'accompagner sans t'alourdir."
```

---

## CTA

Centered, below the body grid, with ~48px top margin.

```
Button text: "Je veux voir si l'accompagnement est adapté pour moi →"
Style: .btn.btn-primary (existing plum pill button)
Link: https://cal.com/elianelarre/appel-decouverte
```

---

## Key CSS tokens (already defined in the site)

```css
--beige:        #f6f1ea
--beige-deep:   #ebe4d9
--plum:         #552772
--lavender:     #dfc7ed
--mid:          #5a5048
--font-serif:   'Playfair Display', Georgia, serif
--font-sans:    'Poppins', system-ui, sans-serif
--radius:       22px
--shadow-card:  0 14px 44px rgba(85,39,114,0.08), 0 4px 12px rgba(26,20,16,0.04)
```

---

## Reveal animations

Use the existing `.reveal` and `.reveal-stagger` classes:
- Header block: `.reveal`
- Timeline items: `.reveal-stagger` on the wrapper (children stagger in)
- App panel: `.reveal`
- CTA: `.reveal`

---

## Mobile (≤ 920px)

- Grid collapses to single column
- Timeline comes first, app panel below
- App panel image: let it fill naturally, no fixed height

---

## Sanity Studio — schema changes

Add these fields to the page or section document that controls this section:

```js
{
  name: 'accompagnementPillars',
  title: 'Piliers (4 items)',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      { name: 'title', title: 'Titre', type: 'string' },
      { name: 'description', title: 'Description', type: 'text' },
    ],
    preview: { select: { title: 'title' } },
  }],
  validation: Rule => Rule.length(4),
},
{
  name: 'appSectionTitle',
  title: 'App — Titre',
  type: 'string',
},
{
  name: 'appSectionDescription',
  title: 'App — Description',
  type: 'text',
},
{
  name: 'appScreenshot',
  title: 'App — Screenshot (phones)',
  type: 'image',
  options: { hotspot: true },
},
```

Wire the fetched values into the component: `accompagnementPillars` → timeline items, `appSectionTitle/Description` → app card text, `appScreenshot` → the image in the app panel.

---

## ⚠️ Manual step — enter content in Sanity Studio

After deploying the schema, go to **Sanity Studio → [page document]** and fill in:

**Pillars (in order):**

| # | Title | Description |
|---|-------|-------------|
| 1 | Un plan clair | Ton programme est intégré à ton application personnalisée pour t'offrir une structure claire et des outils concrets pour soutenir ta progression. |
| 2 | Séances privées en présentiel | Tu es guidée, corrigée et accompagnée en temps réel pour progresser avec confiance. |
| 3 | Suivi entre les rencontres | Tu n'es pas laissée seule entre deux séances. L'accompagnement te garde engagée, alignée et constante. |
| 4 | Enseignements concrets et utiles | Je suis là pour te partager mes connaissances en entraînement et nutrition pour te permettre de comprendre et maintenir tes résultats. |

**App title:** Un outil pensé pour toi, accessible où que tu sois.

**App description:** Tes entraînements, ton historique de progression et tes communications avec moi, regroupés au même endroit. Simple, lisible, fait pour t'accompagner sans t'alourdir.

**App screenshot:** Upload the provided phone mockup PNG.

---

## Implementation checklist

- [ ] Section placed between "Rencontre" and "Présentiel" sections
- [ ] Section background `var(--beige)`, existing `.section` padding
- [ ] Header: eyebrow + H2 with italic plum "personnalisé" + lead paragraph
- [ ] Two-column body grid (1.05fr / 0.95fr)
- [ ] Timeline: lavender circles, thin connecting line, 4 items with stagger reveal
- [ ] App panel: `var(--beige-deep)` card, phone PNG at top, text below
- [ ] CTA button centered below grid
- [ ] Reveal animations on all blocks
- [ ] Mobile: single column, timeline above app panel
- [ ] Sanity schema added and deployed
- [ ] ⚠️ Content manually entered in Sanity Studio
