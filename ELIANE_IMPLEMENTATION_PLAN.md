# Éliane website — implementation plan

Tracking doc for Éliane's email requests (July 2026). Update checkboxes as work completes.

**Legend:** `[ ]` = not started · `[x]` = done · `[~]` = partial

When steps are finished, tell the agent which numbers are done (e.g. `0.2, 2.2, 2.3`) and it will update this file.

**Approach:** We implement and configure everything ourselves. Éliane gets a **Studio tutorial** at handoff (Phase 4) — no live walkthrough during build.

**Definition of done for Studio steps:** Éliane can find the field, edit the text (including gras/italique where applicable), publish, and see the change on the site — not merely that a field exists in the schema.

---

## Consistency notes (email ↔ codebase)

| Her ask | Reality |
|--------|---------|
| Rencontre ton entraîneure not editable | Schema fields exist on `homePage`, but Studio is **not set up** for Éliane to find/edit them reliably (desk UX, plain text fields, no rich formatting). **Fix required.** |
| Présentiel not editable | Same — section title/intro are on `homePage` but buried; location block is **hardcoded** in code. **Fix required.** |
| Italic / mauve text | Most fields are plain `string`/`text`; site uses **hardcoded** word matching. Need Portable Text in Studio + frontend rendering. |
| Purple punch quotes | Fields exist as plain `text`; no bold/italic in Studio; CSS forced italic (removed in code, Studio control still needed). |
| Share image | We set `image-de-partage.png` in Sanity + repo default (0.3, 2.8). |
| Séances privées copy | Content update in Studio after fields are editable (0.4). |
| Studio first (hour bank) | **Phase 1 (Studio UX + rich text) before** content fill and cosmetic dev fixes. |

---

**Content migration:** Manual only — see [`ELIANE_STUDIO_MANUAL_CONTENT.md`](ELIANE_STUDIO_MANUAL_CONTENT.md). No Sanity token script.

---

## Phase 0 — Setup & content (manual in Studio)

*Copy-paste guide: `ELIANE_STUDIO_MANUAL_CONTENT.md`*

- [ ] **0.1** **Rencontre ton entraîneure** — Studio fully wired: accroche, photo, cartes, citation, lien Instagram editable, publish → site updates
- [ ] **0.2** **Pourquoi le présentiel** — Studio fully wired: accroche, titre, intro, cartes, citation de clôture editable, publish → site updates
- [ ] **0.3** Set `image-de-partage.png` as OG image (Sanity **Paramètres du site → Image de partage** and/or repo default)
- [ ] **0.4** Update pillar **« Séances privées en présentiel »** — mention session count depends on service package
- [ ] **0.5** Rename présentiel section to **« Où ont lieu les séances ensemble »** (eyebrow + titre)
- [ ] **0.6** Set / review `meetTrainerQuote` + `locationQuote` copy in Studio

---

## Phase 1 — Studio enhancements (priority)

*Unlock self-service: Éliane edits text herself; hour bank reserved for dev-only work.*

### Studio structure & discoverability

- [x] **1.0** Refactor Studio desk: singleton + section shortcuts (fixed document id mismatch — migrated to `homePage` / `siteSettings`; async id resolver as fallback)
- [x] **1.5** Expose **location block** in Studio (eyebrow « Où ça se passe », venue, address)

### Rich text (gras / italique) — Studio + site

- [x] **1.3** Add **Portable Text** (gras + italique) to all editable text fields where possible — titles, intros, cartes, citations, piliers, etc.
- [x] **1.4** Render Portable Text on site: **italique → mauve**, gras → bold; remove hardcoded phrase matching (`personnalisé`, `le présentiel`, hero accent list, etc.)
- [x] **1.4b** Purple quote boxes (`meetTrainerQuote`, `locationQuote`): Portable Text in Studio + frontend renders bold/italic; no forced CSS italic

### CTA links & accompagnement visuals

- [ ] **1.1** Add optional **per-section CTA URL** fields with fallback to global `bookingUrl`
- [ ] **1.2** Wire frontend so each CTA uses its own URL when set (keep Cal.com embed when URL is Cal.com)
- [ ] **1.6** Replace single `offeringAppImage` with **3 screenshots** (image + caption): « Ton tableau de bord », « Ta progression », « Tes programmes »
- [ ] **1.7** Update `AccompagnementSection` to display the 3 labeled phone screens
- [ ] **1.8** *(Optional)* Add **mobile-specific hero image** field in Studio

---

## Phase 2 — Dev fixes

- [ ] **2.1** Fix **hero photo crop on mobile** (CSS and/or mobile hero image from 1.8)
- [x] **2.2** Change **hero CTA** from Cal.com to `/#accompagnement` (or per-CTA field from 1.1)
- [ ] **2.3** Replace **favicon / tab icon** with `logo-eliane-larre.png`
- [x] **2.4** Purple quote readability — CSS forced italic removed; Studio rich text via **1.4b**
- [ ] **2.5** Replace **Approche** list dashes with small icons
- [ ] **2.6** Add **italic styling for parenthetical text** in présentiel card descriptions (imputabilité) — or via Portable Text in 1.3
- [ ] **2.7** **Diagnose présentiel icons**: verify distinct `iconName` in Sanity; fix rendering or improve visual distinction
- [ ] **2.8** Set `image-de-partage.png` as default OG in repo if Sanity field is empty (fallback)

---

## Phase 3 — Private unlisted pages

- [ ] **3.1** Confirm scope with Éliane (async): how many pages, who gets links, password vs link-only?
- [ ] **3.2** Add Sanity schema `privatePage` (slug, title, body/content)
- [ ] **3.3** Add route `/p/[slug]` — no nav link, `noindex`
- [ ] **3.4** Migrate Claude artifacts into Sanity documents
- [ ] **3.5** Send Éliane unlisted URLs; verify not indexed / not linked from public site

---

## Phase 4 — QA & handoff

- [ ] **4.1** Mobile QA: hero, CTAs, 3 phone screens, présentiel, quote boxes
- [ ] **4.2** Desktop QA: approche icons, italic/mauve text, all CTA destinations
- [ ] **4.3** Share preview QA: OG image + favicon
- [ ] **4.4** Write and deliver **Studio tutorial** for Éliane (where to edit each section, how gras/italique works, what she should not touch)
- [ ] **4.5** Close / update GitHub issues per `GITHUB_ISSUES_GUIDE.md`

---

## Suggested work order

```
1.0  →  1.3, 1.4, 1.4b  →  0.1, 0.2, 1.5  →  0.3–0.6  →  1.1–1.2  →  2.3, 2.8  →  1.6–1.7  →  2.1, 2.5–2.7  →  3.x  →  4.x
```

*(2.2 already done.)*

---

## Email → step mapping

| Email item | Step(s) |
|-----------|---------|
| Hero photo not cropped on mobile | 1.8, 2.1 |
| Italic / mauve most texts | 1.3, 1.4 |
| Hero CTA → Mon accompagnement | 1.1, 2.2 ✓ |
| CTA links editable in Studio | 1.1, 1.2 |
| Approche dashes → icons | 2.5 |
| Rencontre ton entraîneure not editable | 1.0, 1.3, 1.4, 0.1 |
| Présentiel not editable | 1.0, 1.3, 1.4, 1.5, 0.2, 0.5 |
| 3 phone screens with captions | 1.6, 1.7 |
| Séances privées + session count note | 0.4 |
| Parentheses italic (imputabilité) | 1.3, 2.6 |
| Icons all look the same | 2.7 |
| Purple quotes readable + editable in Studio | 1.4b, 2.4 |
| Share image `image-de-partage.png` | 0.3, 2.8 |
| Favicon `logo-eliane-larre.png` | 2.3 |
| Private Claude artifact pages | 3.1–3.5 |
| Studio tutorial | 4.4 |

---

*Last updated: 2026-07-01*
