# Plan 02 — Homepage Implementation

**Branch:** `nextjs-migration` (working branch off it: `feat/02-homepage-impl`)
**Scope:** Render the new homepage end-to-end in `next-site/app/page.tsx`. Update existing sections, add new sections, wire all content to the Sanity schema from Plan 01. Seed Sanity documents with the email content. Hook all CTAs to cal.com.
**Prerequisite:** Plan 01 merged (or at least its branch checked out as the base of this work).
**Hard rules:**
- All work inside `/next-site/`. Do not touch the root Vite site, `main` branch, or production deployment.
- Do not optimize layout or animations. Speed > polish — Éliane will review the structure with her team first.
- Preserve every `<strong>` and `<em>` from the email content as portable-text decorators or `<strong>` tags so emphasis is editable in Studio later.
- Sentence case rule: every bullet point and every sentence starts with a capital letter. Apply this whenever transcribing content.
- All CTAs link to her cal.com booking URL (read from `siteSettings.bookingUrl` or equivalent — confirm the existing field name in Step 0).
- Heading order is strict: one `<h1>` (in hero), `<h2>` per major section, `<h3>` for sub-blocks.

## Section order (final, top to bottom)

1. **Hero** (`#accueil`) — updated content + photo on left
2. **Marquee 1** (no anchor) — small uppercase scrolling band — `.marquee` (kept from current site)
3. **Marquee 2** (no anchor) — larger gold serif band, static 3-column grid on desktop / scrolling on mobile — `.stats` block (kept from current site, with one text edit)
4. **Sled comparison** (`#approche`) — "Tu veux progresser, mais tu ne veux plus avancer seule" ← **NAV TARGET (Approche)**
5. **Meet trainer** (`#rencontre`) — "Rencontre ton entraîneure"
6. **Pull quote** (transition) — "Tu n'as pas besoin d'un autre programme…"
7. **Offering** (`#accompagnement`) — "Mon accompagnement personnalisé" (3 app screenshots + 4 features) ← **NAV TARGET (Accompagnement)**
8. **In-person** (`#presentiel`) — "Pourquoi le présentiel" (existing format + new punch line)
9. **Reviews** (`#temoignages`) — "Leur expérience" (3 static cards) ← **NAV TARGET (Témoignages)**
10. **For you or not** (`#pour-toi`) — "Pour toi ou pas?"
11. **After call** (`#apres-appel`) — "Comment ça se passe après l'appel?"
12. **Purple band CTA** — "Es-tu prête à investir en toi ?"
13. **FAQ** (`#faq`) — Updated questions + clickable links ← **NAV TARGET (FAQ)**
14. **Collaborators** (`#collaborateurs`) — "Mes collaborateurs"
15. (Footer — unchanged)

> The current `#poids-libres` section is **deleted** entirely. Steps below cover its removal.
>
> Anchor IDs above are the **final** IDs used by the new top nav (Plan 03). Use these IDs when building each section so Plan 03 doesn't have to rewire them.

---

## Step 0 — Setup

- [x] `git checkout chore/01-cleanup-and-schema` (or whichever branch Plan 01 is on) *(Plan 01 already merged; started from updated `nextjs-migration`.)*
- [x] `git checkout -b feat/02-homepage-impl`
- [x] Confirm `npm --prefix next-site run dev` starts cleanly *(existing dev server on `localhost:3000` healthy: `/` + `/studio` return 200).*
- [x] In `next-site/sanity/schemaTypes/siteSettings.ts`, locate the booking URL field. If none exists, add `bookingUrl` (url, required, default the existing cal.com URL Éliane uses). All CTAs in this plan reference it.

---

## Step 1 — Seed Sanity content

Before touching `app/page.tsx`, populate the `Page d'accueil` document and the FAQ entries in Studio (manually via UI or programmatically if Cursor wants to write a one-off script — manual is fine).

> **Execution note (recommended):** Since `faq.answer` moved from plain text to portable text in Plan 01, existing legacy FAQ values can show the "Invalid property value" warning until reset. To avoid repetitive manual resets, prefer a **one-time migration/seed script in this Step 1** that upserts the 8 FAQ entries from Éliane's email directly in the new portable-text shape (including `link` annotations), then archive/delete legacy FAQs not in the email list.

**Open `/studio` and edit `Page d'accueil`:**

### Hero
- `heroKicker`: `ENTRAÎNEURE PERSONNELLE • MONTRÉAL`
- `heroHeadline` (rich text, no italic this time unless Éliane decides later): `Un service d'accompagnement personnalisé pour t'entraîner avec confiance, progresser durablement et arrêter de toujours recommencer`
- `heroSubheadline`: `Un accompagnement sur mesure, conçu pour toi qui veut intégrer l'entraînement à ta vie, ou pour toi qui crois avoir tout essayé, mais qui n'arrives toujours pas à atteindre tes objectifs et à les maintenir.`
- `heroImage`: bicep photo (Christopher will paste in Cursor chat at execution time, with the lighting/flash crop instruction noted).
- `heroCtaLabel`: `Je veux discuter de mes objectifs`
- `heroCtaSubtext`: `Appel gratuit, sans engagement pour voir si l'accompagnement est adapté à toi.`

### Marquees
- `marqueeOneItems` (kept from current site, unchanged):
  1. `Entraînements en présentiel`
  2. `À Montréal`
  3. `10+ années de pratique`
  4. `Approche personnalisée`
- `marqueeTwoItems` (one edit — middle item):
  1. `Approche durable`
  2. `Accompagnement personnalisé`  *(was "Accompagnement sur mesure")*
  3. `Progression mesurable`

### Sled comparison
- `sledHeadline`: `Tu veux progresser, mais tu ne veux plus avancer seule.`
- `sledSubheadline`: `Que tu débutes ou que tu t'entraînes déjà depuis un moment, l'objectif est le même : avoir un cadre clair, te sentir guidée et savoir que tu avances dans la bonne direction.`
- `sledImage`: sled-push photo (Christopher will paste in Cursor chat).
- `sledFromTitle`: `Là où tu es aujourd'hui`
- `sledFromItems` (preserve **bold** as portable-text strong decorator):
  1. `Tu ne sais pas toujours **quoi faire au gym** ni si tu exécutes les mouvements correctement.`
  2. `Tu as déjà essayé des programmes, des vidéos ou des applications, mais tu finis par **décrocher**.`
  3. `Tu veux des résultats, mais **tu ne veux pas tomber dans une approche extrême ou irréaliste**.`
  4. `Tu aimerais **te sentir plus confiante** dans ton corps, dans tes entraînements et dans tes choix.`
  5. `Tu sens que **tu pourrais aller plus loin** avec un encadrement plus humain, plus précis et plus personnalisé.`
- `sledToTitle`: `Là où je vais t'amener`
- `sledToItems`:
  1. `Vers une **routine d'entraînement claire, réaliste et adaptée à ton quotidien**, pour que tu puisses rester constante.`
  2. `Vers une **meilleure compréhension de ton corps**, de ton énergie et de ce dont tu as besoin pour progresser sans t'épuiser.`
  3. `Vers une façon de bouger plus contrôlée, plus précise et plus efficace, **pour que chaque entraînement ait un vrai impact**.`
  4. `Vers un sentiment de solidité, de **confiance et de maîtrise de ton corps**.`
  5. `Vers plus d'autonomie, avec **des bases concrètes en entraînement et en nutrition** que tu pourras continuer d'utiliser bien après l'accompagnement.`
- `sledCtaLabel`: `C'est là que je veux aller`

### Meet trainer
- `meetTrainerKicker`: `RENCONTRE TON ENTRAÎNEURE`
- `meetTrainerImage`: smiling portrait (Christopher pastes in Cursor chat).
- `meetTrainerBody` (rich text, preserve **bold** as strong decorator — these are the phrases Éliane wants visually larger):
  ```
  Depuis plus de 12 ans, l'entraînement fait partie de ma vie. **Au fil des années, j'ai appris que les résultats durables ne viennent pas d'une routine parfaite, d'un plan extrême ou d'une motivation constante.** Ils viennent d'une structure réaliste, d'une meilleure compréhension de son corps et d'habitudes qu'on arrive réellement à maintenir dans le quotidien.

  J'accompagne mes clientes comme j'aborde mon propre parcours : avec équilibre, sans extrêmes ni restrictions, et en m'adaptant aux différentes saisons de la vie. **Je ne suis pas là pour te donner un plan impossible à maintenir.** Je suis là pour t'aider à t'entraîner avec intention, à mieux comprendre ce que tu fais, à progresser de façon sécuritaire et à bâtir une routine qui s'intègre vraiment à ta vie.

  **Ma spécialité :** aider les femmes à se sentir plus fortes, plus confiantes et plus en maîtrise de leur corps. Des femmes qui veulent des résultats, oui, mais surtout une méthode qui respecte leur rythme, leur réalité et leur corps.

  **À travers mon accompagnement, mon but est de t'amener vers plus de clarté, de constance et d'autonomie.**
  **Je veux que tu saches quoi faire, pourquoi tu le fais, et comment continuer à prendre soin de toi bien après notre travail ensemble.**
  ```
- `meetTrainerCtaLabel`: `Voir mon quotidien sur Instagram`
- `meetTrainerCtaUrl`: (Éliane's Instagram URL — pull from existing site if already configured, otherwise leave for Christopher to fill)

### Pull quote
- `pullQuoteText`: `Tu n'as pas besoin d'un autre programme. Tu as besoin d'un cadre, d'un regard expert et d'un accompagnement qui s'adapte réellement à toi.`
- `pullQuoteEnabled`: `true`

### Offering
- `offeringHeadline`: `Mon accompagnement personnalisé`
- `offeringImages`: 3 app screenshots (Christopher pastes in Cursor chat).
- `offeringFeatures`:
  1. `title`: `Un plan clair` — `description`: `Ton programme est intégré à ton application personnalisée pour t'offrir une structure claire et des outils concrets pour soutenir ta progression.`
  2. `title`: `Des séances privées en présentiel` — `description`: `Tu es guidée, corrigée et accompagnée en temps réel pour progresser avec confiance.`
  3. `title`: `Un suivi entre les rencontres` — `description`: `Tu n'es pas laissée seule entre deux séances. L'accompagnement te garde engagée, alignée et constante.`
  4. `title`: `Des enseignements concrets et utiles` — `description`: `Je suis là pour te partager mes connaissances en entraînement et nutrition pour te permettre de comprendre et maintenir tes résultats.`
- `offeringCtaLabel`: `Je veux voir si l'accompagnement est adapté pour moi`

### In-person
The `#presentiel` section's body is staying hardcoded in JSX (Plan 01 only added one Sanity field for this group: the new punch line). Only seed `inPersonPunchLine` here:
- `inPersonPunchLine`: `Un programme peut te dire quoi faire.\nUn accompagnement en présentiel te montre comment le faire et t'aide à progresser plus rapidement qu'en étant seule.`
  *(The line break is intentional — render with `white-space: pre-line` or split into two `<p>`s.)*

### Reviews
- `reviewsHeadline`: `Leur expérience`
- `reviewsList` (3 entries, condensed to 1–2 sentences each):
  1. `name`: `Claudie Larose` — `rating`: `5` — `excerpt`: `L'encadrement est super bien structuré : on se voit une fois par semaine en présentiel, et entre les séances, elle est toujours disponible pour répondre à mes questions. Ce que j'apprécie le plus, c'est l'ambiance sans pression — chacun évolue à son rythme, sans jugement.`
  2. `name`: `Erwanne Frenette` — `rating`: `5` — `excerpt`: `Le fait que les séances soient en présentiel fait vraiment une différence pour rester motivée et bien encadrée. Tout est structuré, clair et professionnel, ce qui me permet de me sentir en confiance.`
  3. `name`: `Laurie Ciorra` — `rating`: `5` — `excerpt`: `Éliane offre un service 100% personnalisé. Elle est patiente, motivante, encadrante et disponible 24/7 pour ses clientes. Elle m'a aidé à passer d'un mode de vie sédentaire à active.`

### For you or not
- `forYouHeadline`: `Pour toi ou pas?`
- `forYouImage`: photo "accotée sur la barre" (Christopher pastes in Cursor chat).
- `forYouYesTitle`: `C'est pour toi si :`
- `forYouYesItems`:
  - `Tu veux être accompagnée sérieusement.`
  - `Tu es prête à t'impliquer.`
  - `Tu veux apprendre à bien t'entraîner.`
  - `Tu veux une approche personnalisée plutôt qu'un plan générique.`
  - `Tu veux des résultats durables, pas une solution express.`
- `forYouNoTitle`: `Ce n'est probablement pas pour toi si :`
- `forYouNoItems`:
  - `Tu cherches uniquement le prix le plus bas.`
  - `Tu veux une solution miracle sans implication.`
  - `Tu n'es pas disponible pour des séances en présentiel à Montréal.`
  - `Tu préfères un programme 100 % autonome, sans accompagnement.`
- `forYouFooter`: `Cet accompagnement s'adresse aux femmes qui veulent investir sérieusement dans leur progression, leur confiance et leur santé à long terme.`
- `forYouCtaLabel`: `Je veux savoir si c'est pour moi`

### After call
- `afterCallHeadline`: `Comment ça se passe après l'appel?`
- `afterCallIntro`: `L'appel découverte sert à :`
- `afterCallItems`:
  - `Comprendre où tu en es.`
  - `Clarifier tes objectifs.`
  - `Voir si l'accompagnement est adapté.`
  - `Répondre à tes questions.`
  - `Te recommander la meilleure prochaine étape.`
- `afterCallFooter`: `L'appel est gratuit, sans engagement, et sert d'abord à voir si l'accompagnement est réellement pertinent pour toi.`
- `afterCallCtaLabel`: `Je suis prête à avoir plus d'informations`

### Purple CTA
- `purpleCtaHeadline`: `Es-tu prête à investir en toi ?`
- `purpleCtaButtonLabel`: `Je veux passer à l'action`
- `purpleCtaFooter`: `Gratuit et sans engagement`

### FAQ intro
- `faqHeadline`: `Questions fréquentes`

### Collaborators
- `collaboratorsHeadline`: `Mes collaborateurs`
- `collaboratorsIntro`: (leave blank for now)

### FAQ documents
Update / replace existing FAQ documents (or create new ones) with the following — use the `link` annotation from Plan 01 Step 7 for the underlined URLs:

1. **Q:** `Quelles formations as-tu suivies ?`
   **A:** A bulleted list (use a list block in portable text):
   - `**Ataraxia**, École de formation pour entraîneur privé en présentiel (juillet 2025).` Link "Ataraxia" → `https://ataraxia-entraineur.com` (open in new tab)
   - `**PRECOG**, formation d'un an avec Psycom, spécialisée en développement psychologique, communication humaine, relations interpersonnelles et leadership (mars 2026).` Link "Psycom" → `https://www.communicationpsycom.com` (open in new tab)
   - `**Précision Nutrition**, formation en coaching nutritionnel (en cours).` Link "Précision Nutrition" → `https://www.precisionnutrition.com` (open in new tab)
   - `**MOMENTUM**, formation d'un an dans la continuité de PRECOG (en cours).`
2. **Q:** `À qui s'adresse ton accompagnement ?`
   **A:** `Mon accompagnement s'adresse autant aux femmes qui débutent qu'à celles qui ont déjà de l'expérience en entraînement. Chaque démarche est entièrement personnalisée, en fonction de ton niveau, de tes objectifs et de ta réalité.`
3. **Q:** `Où ont lieu les séances ?`
   **A:** `Les séances se déroulent au Biner Training, au 220, boulevard Crémazie Ouest, à Montréal.`
4. **Q:** `Les séances sont-elles privées ou en groupe ?`
   **A:** `Les séances sont entièrement privées. Tu bénéficies d'un accompagnement individuel, dans un espace dédié au Biner Training.`
5. **Q:** `Quel type d'équipement utilises-tu ?`
   **A:** `Je travaille exclusivement avec poids libres et accessoires, notamment les bandes élastiques, le ballon, le step, le banc et d'autres outils complémentaires. Si tu t'entraînes à la maison, ton programme est adapté en fonction de l'équipement dont tu disposes.`
6. **Q:** `Fais-tu des programmes pour la maison ?`
   **A:** `Oui. Je crée ton programme en fonction de l'équipement auquel tu as accès à la maison. À noter : selon tes objectifs, il est possible que certains équipements soient recommandés pour te permettre de progresser de façon optimale.`
7. **Q:** `Puis-je m'entraîner avec une blessure ou une condition médicale ?`
   **A:** `Chaque situation mérite d'être évaluée avec attention. Lors de l'appel découverte, nous prenons le temps de voir comment adapter l'accompagnement à ta réalité. Selon le contexte, l'avis d'un professionnel de la santé peut être requis avant de débuter.`
8. **Q:** `Accompagnes-tu les femmes enceintes ou en post-partum ?`
   **A:** `Oui, avec certaines précautions. Un avis médical est requis avant de débuter ou de reprendre l'entraînement. Nous en discutons lors de l'appel découverte afin d'adapter l'accompagnement à ta situation.`

If there are existing FAQ entries that don't appear above, **archive or delete** them so the live FAQ matches the email exactly.

### Collaborator documents
Create one collaborator entry:
- `name`: `Esthétique Flora`
- `featured`: `true`
- `order`: `1`
- All other fields blank for now.

**Verification for Step 1:**
- [x] `Page d'accueil` document saves without validation errors *(seed script now uploads/links hero, sled, meet-trainer, offering x3, and for-you images)*
- [x] All 8 FAQ entries saved, links visible (clickable indicator in the editor toolbar) *(seed script upserted portable-text answers + links)*
- [x] One collaborator created, marked featured *(Esthétique Flora, featured=true, order=1)*

---

## Step 2 — Build the homepage component shell

In `next-site/app/page.tsx`:

- [x] Update the GROQ fetch (or imported query from `sanity/queries.ts`) to use the new query from Plan 01 Step 8.
- [x] Fetch collaborators in parallel (separate query).
- [x] Type the response with the updated TypeScript interfaces.
- [x] **Delete the current `<section ... id="poids-libres">` block entirely** along with any imports / helpers that were only used by it.
- [x] Reorganize the `<main>` body into the new section order below. For each block, the marker indicates whether you preserve the existing JSX or build fresh:
  - **[preserve]** = the section already exists in some form on the current page; keep its markup/CSS, only change what's noted in subsequent steps
  - **[new]** = no existing equivalent; create a fresh stub (heading + empty `<div>`) and let subsequent steps fill it in

  Order:
  1. `<section id="accueil">` (Hero) — **[preserve]** the existing hero structure; rearrange to photo-on-left in Step 3
  2. `<div className="marquee">…</div>` (Marquee 1) — **[preserve]**, items come from Sanity in Step 4
  3. `<section className="stats" aria-label="…">…</section>` (Marquee 2) — **[preserve]**, no `id`, items + `aria-label` from Sanity in Step 4
  4. `<section id="approche">` (Sled comparison) — **[new]**
  5. `<section id="rencontre">` (Meet trainer) — **[new]**
  6. Pull quote (no ID) — **[new]**, wrapped in `{data.pullQuoteEnabled && (...)}`
  7. `<section id="accompagnement">` (Offering) — **[new]** *(replaces the current `#introduction` JSX, which is removed)*
  8. `<section id="presentiel">` (In-person) — **[preserve]**, just append the punch line in Step 9
  9. `<section id="temoignages">` (Reviews) — **[new]**
  10. `<section id="pour-toi">` (For-you-or-not) — **[preserve]**, rename ID from current `ce-quil-faut-savoir` to `pour-toi` and swap hardcoded bullets for Sanity arrays in Step 11
  11. `<section id="apres-appel">` (After call) — **[new]**
  12. Purple CTA band (no ID) — **[new]**
  13. `<section id="faq">` (FAQ) — **[preserve]** the existing FAQ component, point it at the updated documents, and add the link mark renderer in Step 14
  14. `<section id="collaborateurs">` (Collaborators) — **[new]**

- [x] Sections being **deleted entirely**: `#introduction` (replaced by `#accompagnement`), `#poids-libres` (removed), `#offres` (already removed in Plan 01), the existing `.close` block at the bottom (replaced by the new Purple CTA + FAQ + Collaborators).
- [x] Remove all imports related to deleted offer components and the deleted free-weights helpers.

**Verification:**
- [ ] `npm --prefix next-site run dev`, visit `/`, see every block from the "Section order" list rendered in order (use DevTools to confirm IDs match exactly: `accueil`, `approche`, `rencontre`, `accompagnement`, `presentiel`, `temoignages`, `pour-toi`, `apres-appel`, `faq`, `collaborateurs`)
- [x] Both marquees render right after the hero (Marquee 1 then Marquee 2)
- [x] No `#poids-libres` element on the page
- [x] No console errors, no TypeScript errors
- [x] `npm --prefix next-site run build` passes

---

## Step 3 — Hero section

- [x] Layout: photo on left, text on right. Use the existing hero CSS structure where possible (don't restyle, just rearrange). On mobile, stack with photo above text.
- [x] Render `heroKicker` as a small uppercase line above the headline. **No bullet (`•`) at the start** — the dot in the middle of the kicker text stays. (Confirm with `grep` that you haven't accidentally added a leading `•`.)
- [x] Render `heroHeadline` as `<h1>` using `<PortableText>`.
- [x] Render `heroSubheadline` as `<p>`.
- [x] CTA button: text from `heroCtaLabel`, link to `siteSettings.bookingUrl`. Below the button, render `heroCtaSubtext` as a smaller secondary line.
- [x] Hero image with `next/image`, alt from `heroImage.alt`. Sized appropriately (avoid Layout Shift — set width/height).

**Verification:**
- [ ] Hero displays correctly on desktop and mobile viewports (use DevTools responsive mode)
- [x] Clicking the hero CTA opens the booking URL (in a new tab if that's the existing pattern) *(Cal embed 404 issue fixed; user confirmed working)*
- [ ] Lighthouse: no LCP regressions on hero (eyeball is fine — no formal audit needed)

---

## Step 4 — Marquee 1 and Marquee 2

Both marquees already exist in the current `app/page.tsx` (around lines 139–195) and are styled by `globals.css` (`.marquee*` and `.stats*` rules). The work here is **rewiring the hardcoded item lists to come from Sanity** — markup and CSS stay as-is.

### Marquee 1 (`.marquee`, scrolling)

- [x] Locate the existing `<div className="marquee" role="presentation">` block (about line 139 of the pre-edit `page.tsx`).
- [x] Replace the hardcoded `<span>` items inside `.marquee-inner` with a render loop over `data.marqueeOneItems`. The marquee needs the items duplicated (current markup repeats the list 4 times across 2 `.marquee-inner` divs to make the seamless loop) — preserve that doubling pattern, just generate it from the array. Render `<span className="marquee-sep">·</span>` between items.
- [x] Default fallback if Sanity returns empty: render the original 4 hardcoded items so the page never breaks.

### Marquee 2 (`.stats` block — static desktop, scrolling mobile)

- [x] Locate the existing `<section className="stats" ...>` block (about line 161 of pre-edit `page.tsx`).
- [x] **Update the `aria-label`** to: `aria-label="Approche durable, accompagnement personnalisé, progression mesurable"` (replacing "sur mesure" with "personnalisé").
- [x] In the desktop grid (`.stats-desktop`), render 3 `<div className="stat">` cells, one per item in `data.marqueeTwoItems`. Each cell contains `<p className="stat-phrase">{item}</p>`.
- [x] In the mobile marquee (`.stats-marquee-wrap` → `.stats-marquee-track` → `.stats-marquee-inner`), render the items in the same duplicated pattern as Marquee 1 (the existing markup repeats them 6 times across 2 `.stats-marquee-inner` divs — preserve that pattern, generate from the array).
- [x] Validation safety: if `data.marqueeTwoItems.length !== 3`, log a console warning in dev and fall back to the default 3 items (`Approche durable`, `Accompagnement personnalisé`, `Progression mesurable`). The desktop grid CSS expects exactly 3.

**Verification:**
- [x] Marquee 1 renders right below the hero, scrolling continuously, with the 4 items
- [x] Marquee 2 on desktop (≥768px) shows 3 static columns: "Approche durable" / "Accompagnement personnalisé" / "Progression mesurable"
- [x] Marquee 2 on mobile (<768px) shows the 3 items scrolling continuously in reverse
- [x] DevTools: `aria-label` on the stats section reads "Approche durable, accompagnement personnalisé, progression mesurable"
- [x] No "sur mesure" text appears anywhere in the rendered DOM of these two marquees (`document.body.innerText.includes('sur mesure')` returns false within those sections)
- [x] Editing `marqueeTwoItems` in Studio and reloading updates both desktop grid and mobile marquee

---

## Step 5 — Sled comparison section

- [x] `<h2>` from `sledHeadline` (rendered via PortableText so italic/strong is preserved).
- [x] Subheadline `<p>` from `sledSubheadline`.
- [x] Sled image displayed prominently (Éliane wants the photo with the sled — placement is your call: above the comparison columns is fine, or to one side at desktop).
- [x] Two-column layout for desktop (≥768px), stacked on mobile:
  - Left column: `sledFromTitle` heading, then `sledFromItems` rendered as a `<ul>` of PortableText items. Use a slightly muted color or smaller dot style.
  - Right column: `sledToTitle` heading, then `sledToItems` rendered the same way, with a plum accent color or a small arrow icon at the top of the column for visual contrast.
- [x] Between the two columns at desktop, an arrow icon (any simple SVG arrow, or use `lucide` if already installed). Hidden on mobile.
- [x] CTA button at the bottom: `sledCtaLabel`, links to `siteSettings.bookingUrl`.
- [x] Bold spans inside list items render as `<strong>` (default browser bold is fine for now — Plan 03 may slightly enlarge them but it's optional).

**Verification:**
- [x] Two columns visible at ≥768px, single column at <768px
- [x] All 5 + 5 bullets render with correct emphasis
- [x] CTA opens booking URL

---

## Step 6 — Meet trainer section

- [x] Layout: image on one side, text on the other (mirror of hero, or designer's choice — stick with what's already in the codebase if there's an existing portrait section).
- [x] `meetTrainerKicker` as a small uppercase line above the body.
- [x] `<h2>` is implicit in the kicker styling; if there's no `<h2>`, add a hidden one for accessibility (`<h2 className="sr-only">Rencontre ton entraîneure</h2>`).
- [x] `meetTrainerBody` rendered with `<PortableText>`. Apply this rule in your portable-text components:
  - Default `<strong>` renders inline at slightly larger size and plum accent color (e.g. `font-weight: 700; font-size: 1.08em; color: var(--plum)` — pull the plum color from the existing site palette).
  - All other styling default.
- [x] CTA: `meetTrainerCtaLabel` linking to `meetTrainerCtaUrl`. Open in new tab.

**Verification:**
- [x] Bolded phrases visibly stand out (slightly larger, plum color)
- [x] Long text reads cleanly — no width overflow on mobile
- [x] Instagram CTA opens in new tab

---

## Step 7 — Pull quote (transition)

- [x] Wrapped in `{data.pullQuoteEnabled && (...)}`.
- [x] Centered, no background, generous vertical padding, italic, max-width 60ch.
- [x] Render with `<blockquote>` for semantics, `<p>` inside for the text.

**Verification:**
- [x] Quote displays between meet-trainer and offering sections
- [x] Toggling `pullQuoteEnabled` to false in Studio (and reloading) hides the section

---

## Step 8 — Offering section ("Mon accompagnement personnalisé")

- [x] `<h2>` from `offeringHeadline`.
- [x] Render `offeringImages` as 3 images side by side at desktop, stacked at mobile, with `alt` text. Reasonable max-width per image (e.g. 240px) — they're phone screenshots, so portrait aspect ratio.
- [x] Render `offeringFeatures` as 4 items in a grid (2x2 at desktop, 1 column on mobile). Each item: bold `title`, then `description` paragraph below.
- [x] CTA: `offeringCtaLabel` → booking URL.

**Verification:**
- [x] 3 screenshots render side by side at desktop
- [x] 4 features render in a grid
- [x] CTA works

---

## Step 9 — In-person section ("Pourquoi le présentiel")

- [x] **Do not change the existing structure or content.** Éliane said "même format que présentement".
- [x] At the end of the section, append the new punch line from `inPersonPunchLine`. Render in `<p>` with `white-space: pre-line` so the embedded `\n` becomes a real line break, OR split on `\n` and render two `<p>`s. Bolded styling (matches her email — both lines are bold). Centered, slightly larger text.
- [x] **Confirm the `#poids-libres` section is gone** (deleted in Step 2). The only remaining "présentiel" content on the page is `#presentiel`. There should be no second sibling section about poids libres or free weights.

**Verification:**
- [x] Existing `#presentiel` section content is unchanged
- [x] New punch line appears at the end with line break preserved
- [x] `grep -n 'poids-libres\|freeWeights\|Poids libres' next-site/app/page.tsx` returns no matches

---

## Step 10 — Reviews section ("Leur expérience")

- [x] `<h2>` from `reviewsHeadline`.
- [x] Render `reviewsList` as 3 cards. At desktop, 3 columns. At mobile, single column stacked or horizontally scrollable — single column is simpler, do that.
- [x] Each card displays:
  - Person name (bold)
  - Star rating (render `rating` as that many filled stars, `5 - rating` empty stars — use any star icon, lucide's `Star` is fine)
  - Excerpt as a paragraph
- [x] No "verified" or "Google" branding — these are static cards.

**Verification:**
- [x] 3 cards visible at desktop, stacked on mobile
- [x] All 3 names + 5-star ratings + excerpts visible

---

## Step 11 — For you or not section ("Pour toi ou pas?")

The current homepage already has an equivalent section at `id="ce-quil-faut-savoir"` (a yes-list / no-list pattern). **Reuse its existing markup and CSS** — rename the section ID to `pour-toi`, swap the heading text and bullets to come from Sanity, and update the kicker/intro language to match the email. Don't rebuild from scratch.

- [x] Locate the existing `<section ... id="ce-quil-faut-savoir">` block in `app/page.tsx`.
- [x] Change the section's `id` to `pour-toi`.
- [x] `<h2>` from `forYouHeadline`.
- [x] Photo (`forYouImage`) on one side, two columns of bullets on the other (or three columns total: image + yes-list + no-list — keep whatever 2-column / 3-column layout the existing section uses).
- [x] Yes column: `forYouYesTitle` heading + `forYouYesItems` as `<ul>`. Replace any hardcoded bullets with the Sanity array.
- [x] No column: `forYouNoTitle` heading + `forYouNoItems` as `<ul>`. Replace any hardcoded bullets with the Sanity array. Slightly muted or with a visual indicator (e.g., a different bullet color — match the existing styling).
- [x] Below both columns: `forYouFooter` paragraph.
- [x] CTA: `forYouCtaLabel` → booking URL.

**Verification:**
- [x] The renamed section has `id="pour-toi"`, no element on the page has `id="ce-quil-faut-savoir"`
- [x] Both lists render with correct titles and items pulled from Sanity
- [x] Footer paragraph visible
- [x] CTA works

---

## Step 12 — After call section ("Comment ça se passe après l'appel?")

- [x] `<h2>` from `afterCallHeadline`.
- [x] `afterCallIntro` as `<p>`.
- [x] `afterCallItems` as `<ul>`.
- [x] `afterCallFooter` as `<p>`.
- [x] CTA: `afterCallCtaLabel` → booking URL.

**Verification:**
- [x] All elements render in order
- [x] CTA works

---

## Step 13 — Purple CTA band

- [x] Full-width plum / purple band, white text, centered content.
- [x] `<h2>` from `purpleCtaHeadline` (e.g. "Es-tu prête à investir en toi ?").
- [x] Button styled as primary CTA: text from `purpleCtaButtonLabel`, link to `siteSettings.bookingUrl`. Use a contrasting button color (white background, plum text) for visibility on the dark band.
- [x] Below the button, smaller text: `purpleCtaFooter`.

**Verification:**
- [x] Band renders with purple background
- [x] Button is clearly clickable and visible
- [x] Footer text appears below the button

---

## Step 14 — FAQ section

- [x] `<h2>` from `faqHeadline`.
- [x] Render the FAQ documents fetched from Sanity. Reuse the existing FAQ accordion component / styling (don't rebuild — just point it at the updated content).
- [x] In the portable-text components for FAQ answers, register a `link` mark renderer that produces `<a href={value.href} target={value.openInNewTab ? '_blank' : '_self'} rel={value.openInNewTab ? 'noopener noreferrer' : undefined}>`.
- [x] Confirm bold (`strong` decorator) and bullet lists render correctly.

**Verification:**
- [x] All 8 FAQ questions render in order
- [x] Clicking the Ataraxia link opens `https://ataraxia-entraineur.com` in a new tab
- [x] Same for Psycom and Précision Nutrition links
- [x] Bullet list in the first FAQ ("Quelles formations as-tu suivies ?") renders as a list with bolded program names

---

## Step 15 — Collaborators section

- [x] `<h2>` from `collaboratorsHeadline`.
- [x] Below it, render `collaboratorsIntro` if present.
- [x] Render the collaborators list. Featured collaborators (e.g. Esthétique Flora) appear first, larger, with optional logo and clickable link if `website` is set. Non-featured ones appear smaller below in a simple list (none for now — this is just so the structure handles future entries).
- [x] If a logo is missing (as in the Esthétique Flora case for now), display the name as text only.
- [x] If no collaborators have `featured: true`, hide the section entirely.

**Verification:**
- [x] "Esthétique Flora" appears in the section as text-only (no logo)
- [x] Adding a second collaborator in Studio with `featured: true` makes it appear
- [x] Setting a collaborator to `featured: false` hides them from the prominent area

---

## Step 16 — Sentence-case sweep

- [x] Re-read every string of content in the homepage and FAQ. Confirm:
  - Every bullet starts with a capital letter.
  - Every sentence (after a period or new paragraph) starts with a capital letter.
  - Special cases: kicker labels in ALL CAPS (`ENTRAÎNEURE PERSONNELLE • MONTRÉAL`, `RENCONTRE TON ENTRAÎNEURE`) stay as-is.
- [x] Apply fixes directly in Studio (content edits, no code change).

**Verification:**
- [x] Visually scan the live homepage top to bottom — no lowercase sentence starts

---

## Step 17 — Commit and push

- [x] `git add -A`
- [x] `git commit -m "feat(next-site): rebuild homepage from Éliane's email — sections 1-13 + FAQ"`
- [x] `git push -u origin feat/02-homepage-impl`
- [x] Open PR against `nextjs-migration`. Do not merge yet — Plan 03 finalizes nav and verification.

---

## Final verification checklist for Plan 02

- [ ] `npm --prefix next-site run lint` passes
- [x] `npm --prefix next-site run build` passes
- [x] All blocks listed under "Section order" (hero, two marquees, sled, meet trainer, pull quote, offering, in-person, reviews, for-you-or-not, after-call, purple CTA, FAQ, collaborators) render in correct order on `/`
- [x] No `#poids-libres` section on the page
- [x] All anchor IDs match the list at the top of this plan
- [x] All CTAs link to `siteSettings.bookingUrl`
- [x] Bold and italic from the email content are preserved as `<strong>` / `<em>`
- [x] Bolded phrases in the meet-trainer section are visibly larger and plum-colored
- [x] FAQ links are clickable and open in new tabs
- [x] Sentence case applied to all bullets and sentences
- [x] Mobile layout is functional (not pretty — design pass comes later)
- [x] No console errors
- [x] No 404s on remaining routes
