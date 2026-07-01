# Éliane website — implementation plan

Tracking doc for Éliane's email requests (July 2026). Update checkboxes as work completes.

**Legend:** `[ ]` = not started · `[x]` = done · `[~]` = partial

When steps are finished, tell the agent which numbers are done (e.g. `0.2, 2.2, 2.3`) and it will update this file.

**Approach:** We implement and configure everything ourselves. Éliane gets a **Studio tutorial** at handoff (Phase 4) — no live walkthrough during build.

**Definition of done for Studio steps:** Éliane can find the field, edit the text (including gras/italique where applicable), publish, and see the change on the site — not merely that a field exists in the schema.

---

## Current status (2026-07-01)

**Branch:** `main` — Studio enhancement work merged via **PR #57** (`studio-enhancement`).

**Phase 1 core engineering is done.** Studio has section shortcuts, FAQ/Collaborateurs hubs, Portable Text on titles/subtitles/citations, location block fields, and consistent field descriptions. Frontend renders rich text (mauve italic on body copy; black italic on lavender quote boxes).

**Next blocker: Phase 0** — manual content entry in Studio using [`ELIANE_STUDIO_MANUAL_CONTENT.md`](ELIANE_STUDIO_MANUAL_CONTENT.md). Several fields may appear empty after the rich-text migration; paste copy from the guide, format, and publish.

**Then:** per-section CTA URLs (1.1–1.2) → three phone screens (1.6–1.7) → favicon + OG fallback (2.3, 2.8) → remaining dev polish (2.1, 2.5–2.7) → QA & handoff (4.x).

---

## Consistency notes (email ↔ codebase)

| Her ask | Reality |
|--------|---------|
| Rencontre ton entraîneure not editable | **Fixed in code** (PR #57): section shortcut, rich-text cartes + citation, Instagram CTA fields. **Pending:** manual content in Studio (0.1). |
| Présentiel not editable | **Fixed in code**: titre, intro, cartes, citation, location block in Studio. **Pending:** rename + copy (0.2, 0.5) and content entry. |
| Italic / mauve text | **Done** — Portable Text in Studio; site renders italique → mauve via `portableTextComponents`. |
| Purple punch quotes | **Done** — `quoteRichTextField` (Gras + Italique, no mauve); site uses plain `<em>` on lavender. Also: Pour toi citation, meet trainer quote, location quote. |
| Share image | Still pending — upload `image-de-partage.png` in Studio (0.3) and/or repo fallback (2.8). |
| Séances privées copy | Content update in Studio after fields are editable (0.4). |
| Studio first (hour bank) | **Phase 1 engineering complete.** Hour bank now for content fill + remaining dev (CTAs, screens, polish). |

---

**Content migration:** Manual only — see [`ELIANE_STUDIO_MANUAL_CONTENT.md`](ELIANE_STUDIO_MANUAL_CONTENT.md). No Sanity token script.

---

## Phase 0 — Setup & content (manual in Studio)

*Copy-paste guide: `ELIANE_STUDIO_MANUAL_CONTENT.md`*

- [~] **0.1** **Rencontre ton entraîneure** — Studio wired (accroche, photo, cartes, citation, lien Instagram). **Remaining:** paste/format content, publish, verify on site
- [~] **0.2** **Pourquoi le présentiel** — Studio wired (accroche, titre, intro, cartes, citation, lieu). **Remaining:** paste/format content, publish, verify on site
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

- [x] **1.3** Add **Portable Text** (gras + italique) to all editable text fields where possible — titles, intros, cartes, citations, piliers, FAQ sous-titre, etc.
- [x] **1.4** Render Portable Text on site: **italique → mauve**, gras → bold; remove hardcoded phrase matching (`personnalisé`, `le présentiel`, hero accent list, etc.)
- [x] **1.4b** Purple quote boxes (`meetTrainerQuote`, `locationQuote`, `forYouFooter`): Portable Text in Studio + frontend renders bold/italic; no forced CSS italic

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
- [~] **2.6** Add **italic styling for parenthetical text** in présentiel card descriptions (imputabilité) — available via Portable Text in Studio (1.3); verify after 0.2 content entry
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
✓ 1.0, 1.3, 1.4, 1.4b, 1.5, 2.2, 2.4  (merged PR #57)
→ 0.1–0.6 (manual Studio content)
→ 1.1–1.2 (per-section CTA URLs)
→ 2.3, 2.8 (favicon + OG fallback)
→ 1.6–1.7 (3 phone screens)
→ 2.1, 2.5–2.7 (polish)
→ 3.x (private pages, if scoped)
→ 4.x (QA + tutorial)
```

---

## Email → step mapping

| Email item | Step(s) |
|-----------|---------|
| Hero photo not cropped on mobile | 1.8, 2.1 |
| Italic / mauve most texts | 1.3 ✓, 1.4 ✓ |
| Hero CTA → Mon accompagnement | 1.1, 2.2 ✓ |
| CTA links editable in Studio | 1.1, 1.2 |
| Approche dashes → icons | 2.5 |
| Rencontre ton entraîneure not editable | 1.0 ✓, 1.3 ✓, 1.4 ✓, 0.1 |
| Présentiel not editable | 1.0 ✓, 1.3 ✓, 1.4 ✓, 1.5 ✓, 0.2, 0.5 |
| 3 phone screens with captions | 1.6, 1.7 |
| Séances privées + session count note | 0.4 |
| Parentheses italic (imputabilité) | 1.3 ✓, 2.6 |
| Icons all look the same | 2.7 |
| Purple quotes readable + editable in Studio | 1.4b ✓, 2.4 ✓ |
| Share image `image-de-partage.png` | 0.3, 2.8 |
| Favicon `logo-eliane-larre.png` | 2.3 |
| Private Claude artifact pages | 3.1–3.5 |
| Studio tutorial | 4.4 |

---

*Last updated: 2026-07-01 (post PR #57 merge, branch cleanup)*
