# Cursor Kickstart Prompt

Copy everything between the `---` lines below into Cursor as your first message.

---

You are picking up the in-progress Next.js migration of `elianelarre.com` (Christopher's client Éliane Larre, fitness coach in Montréal). The Vite/HTML site at the repo root is the live production site on `main`. The Next.js rewrite lives under `/next-site/` on branch `nextjs-migration`, with Sanity Studio embedded at `/studio`. Your job is to execute the implementation plans Christopher and I have already approved.

## Read first, in this exact order

1. `plans/01-cleanup-and-schema.md`
2. `plans/02-homepage-implementation.md`
3. `plans/03-nav-faq-and-verification.md`

These plans are detailed and authoritative. Each step has file paths, exact instructions, seed content, and verification checks. Follow them faithfully — don't improvise.

## Hard rules (apply to every step)

- **Branch:** `nextjs-migration`. **Never merge to `main`.** Plan 01 works on `chore/01-cleanup-and-schema`, Plan 02 on `feat/02-homepage-impl`, Plan 03 on `chore/03-nav-and-verify`. Each plan ends with a PR against `nextjs-migration` — Christopher reviews and merges, not you.
- **Scope:** all work inside `/next-site/`. Do not touch the root Vite site (`/index.html`, `/src/`, `/api/`, `/public/`, `/scripts/`, `/sanity/` at root, `vercel.json`, `vite.config.js`, etc.). The root site is the live production.
- **No design polish.** Goal is structurally correct, content visible, no broken layout. Éliane will review the structure with her team before any visual pass. Don't spend time on animations, color tuning, or pixel-perfect spacing.
- **Preserve emphasis.** Every `**bold**` and `*italic*` in the plans' seed content must end up as a portable-text `strong`/`em` decorator (in Sanity) or `<strong>`/`<em>` (in JSX). Éliane chose those emphases deliberately — they convey meaning, not styling.
- **Sentence case.** Every bullet and every sentence starts with a capital letter. Exception: all-caps kicker labels (`ENTRAÎNEURE PERSONNELLE • MONTRÉAL`, `RENCONTRE TON ENTRAÎNEURE`) stay all-caps.
- **All CTAs** link to `siteSettings.bookingUrl` (the cal.com URL). Plan 02 Step 0 has you confirm this field exists; if it doesn't, add it.
- **CRLF note:** the repo on this Windows machine has CRLF line endings. `git status` should be clean. If you see a non-Windows tool reporting many files as "modified" with no real diff, it's CRLF vs LF noise — ignore it.

## How to work, step by step

1. Start with **Plan 01, Step 1**.
2. For each step: read all of its instructions and verification criteria before doing anything.
3. Execute the step fully, including verification.
4. Mark the checkboxes in the plan file as you complete them (`- [ ]` → `- [x]`). This gives Christopher a visible progress trail.
5. **Default cadence: stop at the end of each numbered Step and report back** with a short summary of what changed + the verification results. Wait for Christopher's "go" before the next step.
6. If Christopher says something like "continue through Step 5" or "do all of Plan 01 in one shot," batch accordingly. Otherwise default to step-by-step check-ins.

## When to ask, not guess

Stop and ask Christopher in plain language if you hit any of these:

- A photo or image asset the plan flags as "Christopher pastes in Cursor chat at execution time" (hero bicep photo, sled push photo, smiling portrait, 3 app screenshots, "accotée sur la barre" photo). **Don't use placeholder images.** Wait for the real one.
- A Sanity Studio document that already has authored content you'd be overwriting.
- An existing schema field the plan refers to but whose exact shape you can't determine from the file.
- An ambiguity between two valid approaches.
- Anything in the plan that contradicts what's actually in the codebase.

## Handling photos and image assets

Christopher provides photos by pasting them into your chat at the moment they're needed. The pattern: he'll say something like "ok do Step X" and paste the photo in the same message. When uploading to Sanity, set the `alt` field thoughtfully — ask Christopher if you're unsure of the right wording for accessibility.

## Verification ritual (before each commit)

In this order:

1. `npm --prefix next-site run lint` — must pass.
2. `npm --prefix next-site run build` — must pass.
3. Dev server smoke test: `npm --prefix next-site run dev`, load `/`, scroll top to bottom, confirm no console errors.
4. If the step touched Sanity: also load `/studio` and confirm no schema errors there.

If any of these fail, fix before committing. Don't commit broken code.

## What you don't do

- Plan 03 Step 11 (Vercel preview deployment setup) is Christopher's separate workstream. Skip it — your job ends when the PR is open and the verification block at the end of Plan 03 passes locally.
- You don't merge PRs. You don't cut releases. You don't change DNS or Vercel project settings.

## Begin

Confirm you've read all three plans, summarize them back in 4–5 sentences so Christopher knows you've understood, then start with **Plan 01, Step 1: Branch hygiene**.

---
