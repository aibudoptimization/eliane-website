# Plan 01 — Cleanup & Sanity Schema

**Branch:** `nextjs-migration` (do NOT merge to `main`)
**Scope:** Remove the `/offres` pages and all references; restructure the `homePage` schema for the new homepage sections; add a `collaborator` document type; add a portable-text link annotation for the FAQ.
**Prerequisite for:** Plans 02 and 03 — do this first.
**Hard rules:**
- Do not touch the root-level Vite site (`/index.html`, `/src/`, `/api/`, `/public/`, `/sanity/`, `/scripts/`, `vercel.json`, `vite.config.js`). All work is inside `/next-site/`.
- Do not change `main`. All commits go on `nextjs-migration`.
- Run all commands from the repo root unless noted.
- All Sanity field names use camelCase to match existing convention (`heroHeadline`, `heroImage`, etc.).
- All user-facing labels (`title`, `description`) are in French.

## Context

Éliane is removing the two offer pages (`/offres/le-tremplin`, `/offres/offre-signature`) and the homepage offers section. She wants the homepage to be the only conversion path, leading to her cal.com booking. The homepage is being restructured into 13 schema groups (12 content sections + a header-only `faqIntro` group). This plan only handles deletion, schema restructuring, and groundwork. Section rendering happens in Plan 02.

The current `homePage.ts` schema has these groups: `hero`, `intro`, `approach`, `freeWeights`, `contact`. They are being **replaced wholesale** by the new groups listed in Step 5. Éliane has not authored content in Studio for the existing fields (Studio is still being built out), so we don't need to preserve old field values — Plan 02 Step 1 re-seeds everything from her email.

---

## Step 1 — Branch hygiene

- [x] Base branch was `nextjs-migration` before creating the plan branch (`chore/01-cleanup-and-schema`)
- [x] `git status` shows working tree clean *(tracked files; optional untracked `plans/` until committed — CRLF noise on other OSes is not a real diff)*
- [x] `git pull origin nextjs-migration` to sync *(skipped: branch was not on `origin` yet when starting; pull once `nextjs-migration` exists remotely)*
- [x] Create a working branch off `nextjs-migration` for this plan: `git checkout -b chore/01-cleanup-and-schema`

**Verification:**
- [x] `git branch --show-current` prints `chore/01-cleanup-and-schema`

---

## Step 2 — Delete `/offres` pages and the offer page component

**Files to delete:**
- [x] `next-site/app/offres/le-tremplin/page.tsx`
- [x] `next-site/app/offres/offre-signature/page.tsx`
- [x] `next-site/app/offres/` (the parent directory, once empty)
- [x] `next-site/app/components/OfferPageTemplate.tsx`

**Verification:**
- [x] `grep -r "OfferPageTemplate" next-site/app next-site/lib next-site/sanity` returns no matches
- [x] `grep -r "/offres/le-tremplin\|/offres/offre-signature" next-site/app next-site/lib next-site/sanity` returns no matches
- [x] `ls next-site/app/offres 2>/dev/null` returns nothing

> Nav/footer/homepage links that pointed at those routes were removed here so the Step 2 grep checks pass (same removals as Plan Step 4 — offers UI).

---

## Step 3 — Remove offers-related Sanity schemas

**Files to modify:**
- [x] `next-site/sanity/schemaTypes/index.ts` — remove `offerPage` and `homepageOffers` from imports and the `schemaTypes` array
- [x] `next-site/sanity/structure.ts` — remove any list items referencing `offerPage` or `homepageOffers`
- [x] `next-site/sanity.config.ts` — remove the `homepageOffers` entry from `presentationTool.resolve.locations`
- [x] `next-site/sanity/queries.ts` — remove all queries / projections referencing `offerPage`, `homepageOffers`, or `_type == "offerPage"`

**Files to delete:**
- [x] `next-site/sanity/schemaTypes/offerPage.ts`
- [x] `next-site/sanity/schemaTypes/homepageOffers.ts`

**Verification:**
- [x] `grep -ri "offerPage\|homepageOffers" next-site/app next-site/lib next-site/sanity` returns no matches
- [x] `npm --prefix next-site run lint` — **deferred** (see **Follow-up (not blocking Plan 01)**)
- [x] `npm --prefix next-site run build` succeeds with no errors
- [x] `npm --prefix next-site run dev`, `/studio` — loads with no schema errors *(confirmed)*

---

## Step 4 — Remove offers references from layout, nav, footer, and homepage

The new top-nav order (Approche / Accompagnement / Témoignages / FAQ / Appel découverte) is implemented in Plan 03 — this step only **removes the existing offers links**, not the rebuild.

**Files to inspect and update:**
- [x] `next-site/app/components/SiteChrome.tsx` — remove the "Offres" dropdown / nav links and any related submenu code. Leave the rest of the nav intact for now (Plan 03 rewires the order).
- [x] `next-site/app/components/SiteFooter.tsx` — remove the offer page links from the footer link list.
- [x] `next-site/app/page.tsx` — locate and remove the existing `<section ... id="offres">` block (around line 679 of the current file) and any imports related to offers (e.g. `HomepageOffersSection`, offers queries). The other sections stay for now — Plan 02 will rewrite them.
- [x] `next-site/sanity/schemaTypes/siteSettings.ts` — if there are nav-link fields that reference the offer pages (e.g. `offresNavLabel`, `offresUrl`), remove them. Leave the rest of `siteSettings` intact. *(No offer-specific fields present.)*
- [x] `next-site/app/globals.css` — leave offer-only styles (`.section-offres`, `.offer-card`, etc.) for now. Plan 03 will sweep dead CSS.

**Verification:**
- [x] `npm --prefix next-site run dev`, browse to `http://localhost:3000/`:
  - [x] No "Offres" link or dropdown in the header
  - [x] No offers links in the footer
  - [x] Homepage no longer renders an offers card section
  - [x] No console errors
- [x] Visit `http://localhost:3000/offres/le-tremplin` and `http://localhost:3000/offres/offre-signature` — both return 404
- [x] `npm --prefix next-site run build` succeeds *(after deleting `next-site/.next` once — stale route types referenced removed pages)*

---

## Step 5 — Restructure the `homePage` schema

Replace the contents of `next-site/sanity/schemaTypes/homePage.ts` with the new section structure below. Use `defineType`/`defineField` consistent with the existing file. All `title` and `description` text in French.

**New `groups` (in display order — these match `app/page.tsx` section order in Plan 02):**

| name              | title (French)                          | Maps to email section |
|-------------------|------------------------------------------|------------------------|
| `hero`            | Section Hero                             | Hero                   |
| `marquees`        | Bandes défilantes (haut)                 | After Hero             |
| `sledComparison`  | Tu veux progresser…                      | 2                      |
| `meetTrainer`     | Rencontre ton entraîneure                | 3                      |
| `pullQuote`       | Citation entre sections                  | between 3 and 4        |
| `offering`        | Mon accompagnement personnalisé          | 4                      |
| `inPerson`        | Pourquoi le présentiel                   | 5                      |
| `reviews`         | Leur expérience                          | 6                      |
| `forYouOrNot`     | Pour toi ou pas?                         | 7                      |
| `afterCall`       | Comment ça se passe après l'appel        | 8                      |
| `purpleCta`       | Bande mauve CTA                          | After 8                |
| `faqIntro`        | Intro FAQ                                | FAQ section header     |
| `collaborators`   | Collaborateurs                           | After FAQ              |

> **Two marquees, kept from current site.** Right after the hero, the page has two stacked plum-coloured bands that Éliane wants to keep:
> - **Marquee 1** (`.marquee`) — small uppercase text, scrolls continuously on all viewports.
> - **Marquee 2** (`.stats` block) — larger gold serif text. **Static 3-column grid on desktop (≥768px), scrolling marquee on mobile (<768px).**
>
> Only Marquee 2's middle phrase changes: "Accompagnement sur mesure" → "Accompagnement personnalisé". Schema both marquees as editable arrays so Éliane can change items in Studio later.

**Fields (camelCase names — keep this exact list and order):**

### Group `hero`
- `heroKicker` — string — "ENTRAÎNEURE PERSONNELLE • MONTRÉAL". Description: "Ne pas inclure de point au début."
- `heroHeadline` — `array` of `block` (italic + strong decorators only, no styles, no lists, no annotations) — required
- `heroSubheadline` — text, rows 4
- `heroImage` — image (hotspot enabled), with `alt` field — required. Description: "Photo affichée sur le côté gauche du hero."
- `heroCtaLabel` — string — default "Je veux discuter de mes objectifs"
- `heroCtaSubtext` — string — default "Appel gratuit, sans engagement pour voir si l'accompagnement est adapté à toi."

### Group `marquees`
- `marqueeOneItems` — array of strings (single-line). Default values, in order:
  1. `Entraînements en présentiel`
  2. `À Montréal`
  3. `10+ années de pratique`
  4. `Approche personnalisée`
  Description: "Phrases défilantes en petit texte majuscule, animées en continu. Affichées sur toutes les tailles d'écran."
  Validation: at least 2 entries.
- `marqueeTwoItems` — array of strings (single-line). Default values, in order:
  1. `Approche durable`
  2. `Accompagnement personnalisé`
  3. `Progression mesurable`
  Description: "Phrases en plus gros texte. Affichées en grille statique sur desktop (≥768px), en bande défilante sur mobile."
  Validation: exactly 3 entries (the desktop grid uses 3 columns).

### Group `sledComparison`
- `sledHeadline` — `array` of `block` (italic + strong decorators) — for "Tu veux progresser, mais tu ne veux plus avancer seule."
- `sledSubheadline` — text, rows 3 — for "Que tu débutes ou que tu t'entraînes déjà depuis un moment…"
- `sledImage` — image (hotspot), with `alt` field — sled push photo
- `sledFromTitle` — string — default "Là où tu es aujourd'hui"
- `sledFromItems` — array of objects, each with: `text` (`array` of `block` with strong decorator only). Min 1, max 8.
- `sledToTitle` — string — default "Là où je vais t'amener"
- `sledToItems` — same shape as `sledFromItems`
- `sledCtaLabel` — string — default "C'est là que je veux aller"

### Group `meetTrainer`
- `meetTrainerKicker` — string — default "RENCONTRE TON ENTRAÎNEURE"
- `meetTrainerImage` — image (hotspot), with `alt` field
- `meetTrainerBody` — `array` of `block` (strong + emphasis decorators, plus the `link` annotation defined in Step 7). Long-form text. Description: "Mets en gras les phrases que tu veux faire ressortir — elles seront affichées en plus gros."
- `meetTrainerCtaLabel` — string — default "Voir mon quotidien sur Instagram"
- `meetTrainerCtaUrl` — url

### Group `pullQuote`
- `pullQuoteText` — text, rows 4 — default "Tu n'as pas besoin d'un autre programme. Tu as besoin d'un cadre, d'un regard expert et d'un accompagnement qui s'adapte réellement à toi."
- `pullQuoteEnabled` — boolean — default true. Description: "Décocher pour masquer la citation."

### Group `offering`
- `offeringHeadline` — string — default "Mon accompagnement personnalisé"
- `offeringImages` — array of image (hotspot, with `alt`). Description: "3 captures d'écran de l'application."
- `offeringFeatures` — array of objects with: `title` (string, required), `description` (text, rows 3, required). Aim for 4 entries.
- `offeringCtaLabel` — string — default "Je veux voir si l'accompagnement est adapté pour moi"

### Group `inPerson`
Éliane said "même format que présentement" — meaning the rendered `#presentiel` section on the page stays as-is. To keep this plan simple, the existing JSX for that section stays **hardcoded** in `app/page.tsx` (Plan 02 Step 9). The only Sanity field in this group is the new punch line at the end of the section:
- `inPersonPunchLine` — text, rows 3 — default "Un programme peut te dire quoi faire.\nUn accompagnement en présentiel te montre comment le faire et t'aide à progresser plus rapidement qu'en étant seule."

If Éliane later wants to edit the `#presentiel` body in Studio, additional fields can be added to this group as a follow-up. Out of scope here.

### Group `reviews`
- `reviewsHeadline` — string — default "Leur expérience"
- `reviewsList` — array of objects, each with: `name` (string, required), `rating` (number, min 1 max 5, default 5), `excerpt` (text, rows 4, required). Description: "Témoignages affichés en cartes statiques. Min 1, max 6."
- Validation: rule requires at least 1 entry.

### Group `forYouOrNot`
- `forYouHeadline` — string — default "Pour toi ou pas?"
- `forYouImage` — image (hotspot, with `alt`)
- `forYouYesTitle` — string — default "C'est pour toi si :"
- `forYouYesItems` — array of strings (single-line)
- `forYouNoTitle` — string — default "Ce n'est probablement pas pour toi si :"
- `forYouNoItems` — array of strings
- `forYouFooter` — text, rows 3 — default "Cet accompagnement s'adresse aux femmes qui veulent investir sérieusement dans leur progression, leur confiance et leur santé à long terme."
- `forYouCtaLabel` — string — default "Je veux savoir si c'est pour moi"

### Group `afterCall`
- `afterCallHeadline` — string — default "Comment ça se passe après l'appel?"
- `afterCallIntro` — string — default "L'appel découverte sert à :"
- `afterCallItems` — array of strings (5 items per email)
- `afterCallFooter` — text, rows 3 — default "L'appel est gratuit, sans engagement, et sert d'abord à voir si l'accompagnement est réellement pertinent pour toi."
- `afterCallCtaLabel` — string — default "Je suis prête à avoir plus d'informations"

### Group `purpleCta`
- `purpleCtaHeadline` — string — default "Es-tu prête à investir en toi ?"
- `purpleCtaButtonLabel` — string — default "Je veux passer à l'action"
- `purpleCtaFooter` — string — default "Gratuit et sans engagement"

### Group `faqIntro`
- `faqHeadline` — string — default "Questions fréquentes". Description: "Le contenu des questions est géré dans le document FAQ."

### Group `collaborators`
- `collaboratorsHeadline` — string — default "Mes collaborateurs"
- `collaboratorsIntro` — text, rows 2, optional

(The actual collaborator entries live in their own document type — Step 6.)

### Removing the old groups

The old `intro`, `approach`, `freeWeights`, and `contact` groups (and every `defineField` attached to them) are deleted from `homePage.ts`. The only old group that survives is `hero` — and even there, the field list is updated to match the new spec above (kicker, ctaLabel, ctaSubtext are new).

- [x] Confirm the new `groups` array contains exactly: `hero`, `marquees`, `sledComparison`, `meetTrainer`, `pullQuote`, `offering`, `inPerson`, `reviews`, `forYouOrNot`, `afterCall`, `purpleCta`, `faqIntro`, `collaborators` (13 entries, in that order).
- [x] Confirm no `defineField` references a group name that's not in that list. Any field whose `group` was `intro`, `approach`, `freeWeights`, or `contact` is removed.
- [x] **`freeWeights` removal specifically**: this powered the deleted `#poids-libres` section. Remove the group entry and every field attached to it.
- [x] Field references in `sanity/queries.ts` are cleaned up in Step 8.

**Verification for Step 5:**
- [x] `npm --prefix next-site run lint` passes *(deferred — see Follow-up)*
- [x] `npm --prefix next-site run build` succeeds
- [x] `/studio` loads, the `Page d'accueil` document opens with the new groups, all 13 groups visible in the group bar at the top of the document, no schema validation errors
- [x] No fields with `group: 'intro' | 'approach' | 'freeWeights' | 'contact'` remain in `homePage.ts`

---

## Step 6 — Add `collaborator` document type

Create `next-site/sanity/schemaTypes/collaborator.ts`:

- Type: `document`
- Name: `collaborator`
- Title: `Collaborateur`
- Fields:
  - `name` — string, required (e.g. "Esthétique Flora")
  - `description` — text, rows 2, optional
  - `logo` — image (hotspot), optional, with `alt` field. Description: "Optionnel — affiché à côté du nom si présent."
  - `website` — url, optional
  - `featured` — boolean, default false. Description: "Cocher pour afficher ce collaborateur dans la section principale de la page d'accueil. Sinon, il apparaît dans la liste secondaire."
  - `order` — number, optional. Description: "Plus petit = affiché en premier."
- Preview: name + featured indicator (e.g. `subtitle: 'Mis en avant'` when featured is true).

**Wire-up:**
- [x] Add `import collaborator from './collaborator'` to `next-site/sanity/schemaTypes/index.ts`
- [x] Add `collaborator` to the exported `schemaTypes` array
- [x] Add a list item in `next-site/sanity/structure.ts` so collaborators appear in the Studio sidebar (group them under a "Contenu" or similar heading consistent with existing structure)
- [x] Add a `collaborator` location entry in `next-site/sanity.config.ts` `presentationTool.resolve.locations` pointing to `/#collaborateurs` *(key is `collaborator` to match `_type`)*

**Verification:**
- [x] `/studio` shows a "Collaborateurs" entry in the sidebar
- [x] You can create a new Collaborateur document, fill in a name, save, and see it listed
- [x] No schema errors

---

## Step 7 — Add a portable-text `link` annotation (used by FAQ and meet-trainer)

The FAQ answers need clickable links (Ataraxia, Psycom, Précision Nutrition). Currently the FAQ schema's portable-text fields likely don't allow link annotations.

- [x] In `next-site/sanity/schemaTypes/faq.ts`, find the portable-text field used for the answer (likely `answer` or similar).
- [x] Add an `annotations` array containing a `link` annotation *(shared as `linkMark` in `sanity/schemaTypes/linkMark.ts`; `answer` is now full portable text with listes + gras/italique)*.
- [x] Apply the same `link` annotation to `meetTrainerBody` in `homePage.ts` (Step 5) — for the Instagram link if Éliane wants it inline later. *(Done in Step 5; `homePage` imports `linkMark`.)*

> **Migration:** FAQ documents that still have legacy **string** `answer` values must be re-saved in Studio as portable text (Plan 02 seeds content).

**Verification:**
- [x] `/studio`, open an FAQ document, in the answer field — the toolbar shows a "Lien" / chain-icon button that opens a URL field
- [x] Saving an FAQ entry with a link works; no validation errors

---

## Step 8 — Update `next-site/sanity/queries.ts`

Update the homepage GROQ query so it pulls every new field added in Step 5. The page component in Plan 02 will read from this.

- [x] Replace the existing `homePage` projection so it returns all new fields, including:
  - `hero*` fields (existing + new kicker, ctaLabel, ctaSubtext)
  - `marqueeOneItems`, `marqueeTwoItems`
  - `sled*` fields (with `sledImage{..., asset->}` and `sledFromItems`/`sledToItems` fully expanded)
  - `meetTrainer*` (image + body + cta)
  - `pullQuoteText`, `pullQuoteEnabled`
  - `offering*` (images expanded, features as array)
  - `inPerson*` (existing fields + new `inPersonPunchLine`)
  - `reviewsHeadline`, `reviewsList[]{name, rating, excerpt}`
  - `forYou*`
  - `afterCall*`
  - `purpleCta*`
  - `faqHeadline`
  - `collaboratorsHeadline`, `collaboratorsIntro`
  - **Remove** any projections of `freeWeights*` fields (group was deleted in Step 5b).
- [x] Add a separate query for collaborators sorted by `featured desc, order asc, name asc`:
  ```
  *[_type == "collaborator"]|order(featured desc, order asc, name asc){
    _id, name, description, logo{..., asset->}, website, featured, order
  }
  ```
- [x] Confirm the FAQ query already projects `answer` portable text correctly and will surface link annotations when expanded.

**Verification:**
- [x] `npm --prefix next-site run build` succeeds
- [x] In `app/page.tsx` (or wherever the homepage data is fetched), TypeScript compiles against the new shape — `COLLABORATORS_QUERY` fetched; `data-collaborators-count` on `<main>` until Plan 02 renders the section

---

## Step 9 — Commit and push

- [x] Stage all changes: `git add -A`
- [x] Commit: `git commit -m "chore(next-site): cleanup offers, restructure homePage schema, add collaborator"`
- [x] Push: `git push -u origin chore/01-cleanup-and-schema`
- [x] Open PR against `nextjs-migration` (do not merge yet — Plan 02 builds on this) — [PR #51](https://github.com/aibudoptimization/eliane-website/pull/51) *(pushed `nextjs-migration` to `origin` as PR base)*

---

## Final verification checklist for Plan 01

- [x] `npm --prefix next-site run lint` — passes *(deferred — see **Follow-up (not blocking Plan 01)** below; `build` is the gate until then)*
- [x] `npm --prefix next-site run build` — passes
- [x] `/studio` loads with no schema errors
- [x] All 13 groups appear in the `Page d'accueil` document
- [x] Collaborator type appears in sidebar, can create entries
- [x] FAQ answer field shows the "Lien" annotation in its toolbar
- [x] No remaining references to `offerPage`, `homepageOffers`, `OfferPageTemplate`, `/offres/le-tremplin`, `/offres/offre-signature` in `next-site/app`, `next-site/lib`, or `next-site/sanity`
- [x] Visiting `/offres/le-tremplin` and `/offres/offre-signature` returns 404
- [x] Homepage no longer renders an offers card section
- [x] No "Offres" link in header or footer

---

## Follow-up (not blocking Plan 01)

**ESLint (`npm --prefix next-site run lint`):** The repo still fails lint for **pre-existing** rule violations (for example: use `Link` from `next/link` instead of `<a>` for internal routes in `SiteChrome` / `SiteFooter`; `react/no-unescaped-entities` for apostrophes in French copy in `page.tsx`; `@typescript-eslint` rules in `cal-embed-init.ts`; unused vars in `sanity.cli.ts`). None of that blocks `npm run build` or Studio. **Plan:** clear lint in a **dedicated pass** (or when CI starts enforcing ESLint), not as part of the schema/homepage migration steps unless you decide otherwise.

---

## Notes / decisions for Christopher (review before kickoff)

1. **`#poids-libres` section** — confirmed removed. Plans 01 and 02 delete it cleanly.
2. **Two marquee bands kept** — Marquee 1 (top, scrolling) and Marquee 2 (static desktop / scrolling mobile). Both schema'd as editable arrays.
3. **Reviews data path** — schema'd as `reviewsList` on `homePage` so Éliane can add/edit later in Studio. The 3 review excerpts will be seeded as content in Plan 02.
4. **Pull quote placement** — schema includes `pullQuoteEnabled` so it can be toggled off without a code change. Default placement (in Plan 02) is between section 3 (meet trainer) and section 4 (offering).
5. **Link annotation in `meetTrainerBody`** — added preemptively. If unused for now, that's fine; Éliane can add inline links later in Studio.
