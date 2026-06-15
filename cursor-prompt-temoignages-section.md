# Implementation prompt — "Témoignages" section (video carousel)

You have two reference files:
- `temoignages-mockup.html` — open in a browser to see the layout and interaction. The JS carousel is already working — study it closely, the component logic is in there.
- This prompt — full spec, CSS tokens, Sanity schema, and content entry instructions.

Replace the existing text-based testimonials section with this video carousel. Same section ID (`#temoignages`), same position in the page.

---

## Layout overview

```
[Full width] Eyebrow + H2 (left) | Prev/Next arrow buttons (right)
[Carousel]   3 vertical video cards — side · CENTER · side
             Center card is larger, autoplays muted, shows badges
             Side cards are smaller, dimmed, paused
[Dots]       Progress indicator — 1 pill + N circles
```

Section background: `var(--beige)` (#f6f1ea). Use existing `.section` class.

---

## Header

```
Eyebrow: "Leur expérience"
H2:      "Ce qu'elles en disent."
         ("elles" is italic + plum)
```

Nav buttons (prev / next) sit at the same row as the header, aligned to the bottom-right. Style: white circle (`46px`), subtle border and shadow, turns plum on hover. Same arrows as existing testimonial section.

---

## Carousel

### Wrapper
- `overflow: hidden` to clip side cards
- Edge fade: `::before` (left) and `::after` (right) pseudo-elements with `background: linear-gradient(to right/left, var(--beige), transparent)`, width `80px`, `z-index: 2`, `pointer-events: none`

### Card sizes
| State  | Width  | Height | Opacity | Scale |
|--------|--------|--------|---------|-------|
| Side   | 160px  | 284px  | 0.55    | 0.91  |
| Center | 210px  | 373px  | 1       | 1     |

Cards: `border-radius: 18px`, `overflow: hidden`. **No shadow, no outline, no ring.**

Cards transition smoothly: `transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22,1,0.36,1)`.

### Video element
```html
<video src="{sanity_video_url}" autoplay muted playsinline loop
       style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;">
</video>
```
- Center card: `autoplay muted` — plays silently as soon as it enters center
- Side cards: **paused** — `autoplay` removed, `.pause()` called via JS
- All cards loop

### Dim overlay
Absolute `inset: 0`, `background: rgba(26,20,16,0.30)`. On center card: `opacity: 0` (no dim).

### Center card badges

**"En lecture" badge** — top-left:
- `background: var(--lavender)`, pill shape, `color: var(--plum)`
- Pulsing dot: `width/height: 6px`, `border-radius: 50%`, `background: var(--plum)`, CSS `animation: blink 1.4s ease infinite` (opacity 1→0.35→1)
- Only visible on center card (`opacity: 1`), hidden on side cards (`opacity: 0`)

**Mute toggle** — top-right:
- `background: rgba(26,20,16,0.65)`, pill shape, beige text, subtle border
- Default state: muted — shows speaker-with-X icon + "Son coupé"
- On click: toggles `video.muted`, switches to speaker-wave icon + "Son activé"
- Only visible on center card

### Name + stars overlay — all cards
```
Gradient: linear-gradient(to top, rgba(18,14,10,0.94) 0%, transparent 100%)
padding: 40px 14px 14px
Stars: ★★★★★ in gold (#e4c045), letter-spacing: 2px
Name: font-weight 500, color: var(--beige)
Role: "Cliente", smaller, 50% opacity beige
```

---

## Carousel logic

```js
let active = 0;  // index of center video

function goTo(index) {
  // Pause current center video
  const currentVid = centerCard.querySelector('video');
  if (currentVid) currentVid.pause();

  active = (index + total) % total;

  // Re-render: show videos[active-1], videos[active], videos[active+1]
  // New center video: play() + muted = true + reset mute toggle badge
  // Side videos: pause()

  updateDots();
}

prevBtn.addEventListener('click', () => goTo(active - 1));
nextBtn.addEventListener('click', () => goTo(active + 1));
```

On initial load: `goTo(0)` — first video autoplays muted in center.

---

## Progress dots

```
Active dot:   width 22px, height 6px, border-radius 999px, background: var(--plum)
Inactive dot: width 6px,  height 6px, border-radius 50%,   background: rgba(85,39,114,0.20)
Gap: 8px
```

Clicking a dot calls `goTo(index)`.

---

## Key CSS tokens

```css
--beige:    #f6f1ea
--plum:     #552772
--lavender: #dfc7ed
--gold:     #e4c045
--font-serif: 'Playfair Display', Georgia, serif
--font-sans:  'Poppins', system-ui, sans-serif
--radius:   22px
```

---

## Mobile (≤ 768px)

```
Side cards:   width 110px, height 195px
Center card:  width 160px, height 284px
Edge fade:    width 40px
Section padding: reduced
```

---

## Sanity Studio — schema

Add to the page document:

```js
{
  name: 'testimonialVideos',
  title: 'Témoignages vidéo',
  type: 'array',
  of: [{
    type: 'object',
    name: 'testimonialVideo',
    fields: [
      {
        name: 'reviewerName',
        title: 'Nom de la cliente',
        type: 'string',
        validation: Rule => Rule.required(),
      },
      {
        name: 'reviewerRole',
        title: 'Rôle (ex: Cliente)',
        type: 'string',
        initialValue: 'Cliente',
      },
      {
        name: 'video',
        title: 'Vidéo témoignage (MP4 vertical)',
        type: 'file',
        options: { accept: 'video/mp4' },
        validation: Rule => Rule.required(),
      },
      {
        name: 'poster',
        title: 'Image de couverture (optionnel — affichée avant chargement)',
        type: 'image',
        options: { hotspot: true },
      },
    ],
    preview: {
      select: { title: 'reviewerName', subtitle: 'reviewerRole' },
    },
  }],
}
```

In the component, fetch `testimonialVideos` from Sanity and map:
- `video.asset.url` → `<video src>`
- `poster.asset.url` → `<video poster>` (optional, shown before video loads)
- `reviewerName` → name overlay
- `reviewerRole` → role overlay

The array can hold any number of videos — the carousel always shows 3 at a time and loops.

---

## ⚠️ Manual step — enter content in Sanity Studio

After deploying the schema, go to **Sanity Studio → [page document] → Témoignages vidéo** and add 4 entries:

| # | Nom | Rôle | Vidéo |
|---|-----|------|-------|
| 1 | Claudie Larose   | Cliente | Upload MP4 |
| 2 | Erwanne Frenette | Cliente | Upload MP4 |
| 3 | Laurie Ciorra    | Cliente | Upload MP4 |
| 4 | [4e cliente]     | Cliente | Upload MP4 |

Upload the vertical MP4 files provided by the client. Recommended: compress videos to under 10MB each for fast loading (use Handbrake or similar).

---

## Implementation checklist

- [ ] Replace existing text testimonial section with this video carousel
- [ ] Keep section ID `#temoignages` and nav link
- [ ] Beige background, existing `.section` class
- [ ] Header: eyebrow + H2 (italic plum "elles") + nav arrows right-aligned
- [ ] 3 cards visible: side (160×284, 0.55 opacity, scale 0.91) · center (210×373, full) · side
- [ ] **No shadow, no ring, no outline** on cards
- [ ] Edge fade (beige gradient left + right)
- [ ] Center card: autoplay muted, "En lecture" badge, mute toggle
- [ ] Side cards: paused, dim overlay
- [ ] Name + stars gradient overlay on all cards
- [ ] Smooth transition on prev/next (opacity + transform)
- [ ] Progress dots: pill for active, circle for inactive
- [ ] Mobile responsive card sizes
- [ ] Sanity schema added and deployed
- [ ] ⚠️ Videos uploaded in Sanity Studio
