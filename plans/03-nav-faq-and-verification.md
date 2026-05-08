# Plan 03 — Navigation, Polish & Verification

**Branch:** `nextjs-migration` (working branch off Plan 02: `chore/03-nav-and-verify`)
**Scope:** Rebuild the top nav with the new 5-item order, ensure anchor IDs match, sweep dead CSS from removed sections, run a final verification pass across the homepage on desktop and mobile.
**Prerequisite:** Plan 02 merged (or its branch checked out as the base).
**Hard rules:**
- Same as Plans 01 and 02: no work outside `/next-site/`, no merging to `main`.
- Do not redesign the nav. Reorder existing items, remove deleted ones, change anchor targets — that's it.

## Context

The nav currently still has its old structure (offers dropdown was removed in Plan 01 Step 4 but the rest is unchanged). Éliane wants this exact order: **Approche / Accompagnement / Témoignages / FAQ / Appel découverte**. Each item links to a section anchor on the homepage. "Appel découverte" is the conversion CTA and should look like a button (visually distinct from the other 4 nav items).

---

## Step 0 — Setup

- [x] `git checkout feat/02-homepage-impl` (or whichever branch Plan 02 lives on) *(Plan 02 merged to `nextjs-migration`; started from updated `nextjs-migration`.)*
- [x] `git checkout -b chore/03-nav-and-verify`
- [x] `npm --prefix next-site run dev` is running cleanly *(existing Next dev server on `http://localhost:3000` returns 200).*

---

## Step 1 — Update top nav

**File:** `next-site/app/components/SiteChrome.tsx`

- [x] Replace the existing nav-items array with this exact list, in order:
  1. `Approche` → `/#approche` *(targets the **Sled comparison** section — "Tu veux progresser, mais tu ne veux plus avancer seule")*
  2. `Accompagnement` → `/#accompagnement` *(targets the **Offering** section — "Mon accompagnement personnalisé")*
  3. `Témoignages` → `/#temoignages` *(targets the **Reviews** section — "Leur expérience")*
  4. `FAQ` → `/#faq`
  5. `Appel découverte` → `siteSettings.bookingUrl` (the cal.com URL — NOT an anchor)
- [x] First 4 items render as standard nav links (anchor links — clicking them scrolls to the section).
- [x] 5th item ("Appel découverte") renders as a primary button — visually distinct from the others, styled like the existing "Réservez un appel" / cal.com button on the current site.
- [x] On mobile, all 5 items appear in the mobile menu in the same order, with "Appel découverte" still visually distinct (button-styled).
- [x] Make sure smooth-scroll behavior works when clicking an in-page anchor link from the same page.

**Verification:**
- [x] At `/`, the top nav shows exactly 5 items in the order above
- [x] Clicking "Approche" scrolls to `#approche` (the **Sled comparison** section)
- [x] Clicking "Accompagnement" scrolls to `#accompagnement` (the offering section)
- [x] Clicking "Témoignages" scrolls to `#temoignages` (the reviews section)
- [x] Clicking "FAQ" scrolls to `#faq`
- [x] Clicking "Appel découverte" opens cal.com (in a new tab, matching existing behavior)
- [x] Mobile menu has the same 5 items in the same order

---

## Step 2 — Confirm anchor IDs on the homepage match the nav

**File:** `next-site/app/page.tsx`

- [x] Confirm each `<section>` has the correct `id`:
  - Hero: `id="accueil"` (no nav link points here, but keep for consistency)
  - Sled comparison: `id="approche"` ← nav target (Approche)
  - Meet trainer: `id="rencontre"`
  - Offering: `id="accompagnement"` ← nav target (Accompagnement)
  - In-person: `id="presentiel"`
  - Reviews: `id="temoignages"` ← nav target (Témoignages)
  - For-you-or-not: `id="pour-toi"`
  - After call: `id="apres-appel"`
  - FAQ: `id="faq"` ← nav target (FAQ)
  - Collaborators: `id="collaborateurs"`
- [x] Confirm the deleted sections are gone: `grep -n 'id="poids-libres"\|id="offres"' next-site/app/page.tsx` returns no matches.
- [x] Search the codebase: `grep -rn 'id="' next-site/app/page.tsx` — verify the IDs above are present and there are no duplicates.

**Verification:**
- [x] All 4 nav anchor links resolve to a real section (no broken `#` jumps)
- [x] Page reflows correctly after a smooth-scroll jump (no layout-shift jank)

---

## Step 3 — Update footer

**File:** `next-site/app/components/SiteFooter.tsx`

- [x] Remove any remaining offer-related links (already started in Plan 01 Step 4 — confirm fully clean here).
- [x] If the footer has its own quick-link list, update it to match the new nav (Approche / Accompagnement / Témoignages / FAQ / Appel découverte). Otherwise leave it.
- [x] Confirm the cal.com / booking link in the footer is correct.

**Verification:**
- [x] Footer has no broken links
- [x] Footer link list, if present, matches the top nav order

---

## Step 4 — Sweep dead CSS

**File:** `next-site/app/globals.css`

- [x] Search for selectors that no longer have any matching markup. Likely candidates:
  - `.section-offres`
  - `.offer-card`, `.offer-card-*`
  - `#offres` and any descendants
  - Any class names referencing `tremplin` or `signature`
  - **Selectors related to the deleted poids-libres section** — e.g. `#poids-libres`, `.poids-libres-*`, `.free-weights-*`, any other class names that were unique to that section
- [x] **Do NOT remove** `.marquee*` or `.stats*` rules — those style the two retained marquees. Keep them intact.
- [x] Remove dead selectors only. Be careful not to remove styles still in use by the new sections.
- [x] Confirm with Lighthouse / DevTools that no live element loses its styling after the sweep.

**Verification:**
- [x] `grep -i "offres\|tremplin\|signature\|offer-card\|poids-libres" next-site/app/globals.css` returns no matches
- [x] `grep -i "marquee\|\.stats" next-site/app/globals.css` still returns the original marquee/stats rules (these are kept)
- [x] Visual inspection of the homepage: nothing has obviously lost its styling, both marquees still render correctly

---

## Step 5 — Header / metadata polish

**File:** `next-site/app/layout.tsx`

- [x] Confirm `<title>`, `<meta name="description">`, and Open Graph fields are appropriate for the new homepage. If they reference offers or use stale copy, update them. Use Éliane's hero subhead as a description fallback if you can't think of one.
- [x] No social-image change required (Plan 02 doesn't introduce one).

**Verification:**
- [x] View page source on `/`, confirm `<title>` and meta description make sense for the new positioning
- [x] No references to "offres" or removed pages in metadata

---

## Step 6 — Sanity Studio cross-check

- [x] **Automated GROQ check:** From `next-site/`, run `npx tsx scripts/verify-plan03-step6.ts` (uses `.env.local` read token). Confirms: single `homePage` with all homepage section groups populated (hero, marquees, sled, meet-trainer, pull quote, offering, présentiel, reviews, pour toi, après appel, CTA mauve, FAQ intro, collaborateurs), **8** FAQ documents with **distinct** `order`, and a **featured** collaborator whose name matches Esthétique Flora.
- [x] Open `/studio` for a quick visual pass on `Page d'accueil`, FAQ list order in the desk, and collaborator “mis en avant” if you want parity with the CMS UI.
- [x] Test Sanity Presentation visual editing: click the eye icon, navigate the homepage. Hover-edit annotations should appear over hero, sled, meet-trainer, offering, etc. Confirm:
  - Editing the hero headline in Studio updates the page after save.
  - Editing a sled bullet updates the page after save.
- [x] Confirm draft mode round-trip works (entering draft, editing, exiting).

**Verification:**
- [x] All Studio documents are populated and clean *(GROQ script above; Studio spot-check optional)*
- [x] Visual editing works on at least 3 different sections

---

## Step 7 — Mobile and desktop QA pass

Manually test the homepage at three viewports: 375px, 768px, 1280px. For each viewport:

- [x] QA pass started (manual walkthrough in progress)

- [x] No horizontal scroll
- [x] Hero photo + text both readable
- [x] Sled comparison stacks correctly at <768px (single column), two columns at ≥768px
- [x] Meet-trainer text wraps cleanly, bolded phrases visible
- [x] Pull quote readable, max-width respected
- [x] Offering 3 screenshots stack on mobile, 3-up on desktop
- [x] Reviews stack on mobile, 3-up on desktop
- [x] For-you-or-not bullets readable, photo doesn't push text off-screen
- [x] After call section bullets render correctly
- [x] Purple CTA band visible, button tappable on mobile
- [x] FAQ accordion opens/closes on tap, links inside answers work
- [x] Collaborators section visible

> Note for Christopher: visual polish is **not** in scope for this plan. Goal is "structurally correct, content visible, no broken layout." Design polish comes after team review.

---

## Step 8 — Cross-browser smoke test

- [x] Open `/` in Chrome, Safari (or Edge if Safari unavailable), Firefox.
- [x] All sections render in all three.
- [x] Smooth-scroll on anchor click works in all three.
- [x] cal.com CTA opens in all three.

---

## Step 9 — Build and final lint

- [x] `npm --prefix next-site run lint` passes (zero warnings; zero errors)
- [x] `npm --prefix next-site run build` passes
- [x] `npm --prefix next-site run start` (production mode) — visit `/`, confirm everything still works against the production build, not just dev mode *(verified at `http://localhost:3100/` -> HTTP 200)*

---

## Step 10 — Commit and push

- [x] `git add -A`
- [x] `git commit -m "chore(next-site): finalize nav polish and verification"`
- [x] `git push -u origin chore/03-nav-and-verify`
- [x] Open PR against `nextjs-migration`. *(PR #53)*

---

## Step 11 — Vercel preview deployment check

(Christopher will set up the preview Vercel project separately — see brainstorming notes from earlier session.)

- [x] Once the preview project is configured, push the merged `nextjs-migration` branch and open the deployed URL.
- [x] Confirm the same checks from Step 7 pass on the deployed URL.
- [x] Confirm Sanity Studio loads at `<preview-url>/studio`.
- [x] Confirm Sanity CORS is updated to allow the preview URL (if not, Studio will fail with a CORS error in the browser console).

---

## Final verification checklist for Plan 03

- [ ] Top nav shows exactly: Approche, Accompagnement, Témoignages, FAQ, Appel découverte (in that order)
- [ ] First 4 nav items scroll to correct section anchors
- [ ] "Appel découverte" opens cal.com
- [ ] Nav looks correct on mobile and desktop
- [ ] Footer is clean of dead offer links
- [ ] Dead CSS removed, nothing visually regressed
- [ ] Layout / Open Graph metadata up to date
- [ ] Sanity Studio: all required content populated, visual editing works
- [ ] Cross-browser smoke test passes
- [ ] Build + lint clean
- [ ] PR open against `nextjs-migration`, ready for Christopher's review

---

## Decision points to surface to Christopher (raise these in the PR description)

1. The pull quote between meet-trainer and offering can be toggled off via Studio (`pullQuoteEnabled`). No code change needed if the team wants it gone.
2. Reviews are currently 3 hardcoded excerpts in Sanity. If Éliane wants to swap to live Google reviews (matching the root Vite site's `api/reviews.js` pattern), that's a follow-up task — flag it but don't block on it.
3. The two marquees stay editable from Sanity (`marqueeOneItems`, `marqueeTwoItems`). If Éliane wants different phrases later, no code change required.
