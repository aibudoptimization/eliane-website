# Plan 04 — Cutover to Next.js (Production Migration)

**Branch:** `nextjs-migration` → working branch `chore/04-cutover-to-nextjs` → final merge to `main`.
**Scope:** Tag the current Vite production for rollback, delete every Vite-era file from the repo root, hoist `/next-site/*` to the repo root, verify the Next.js site builds and runs on a Vercel preview deploy, then merge to `main` to take over `elianelarre.com` / `www.elianelarre.com`.
**Prerequisite:** Plans 01, 02, and 03 (steps 1–10) merged into `nextjs-migration`. Plan 03 Step 11 (Vercel preview deployment check) has **not yet been completed** — this plan satisfies it.

## Pre-flight already done by Christopher (do NOT redo)

- ✅ Sanity CORS origins include `https://elianelarre.com` and `https://www.elianelarre.com` (with credentials enabled).
- ✅ Vercel project (`eliane-website`, team `aibudoptimization`) Production environment has these env vars: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN`.

If either of the above is unclear at execution time, **stop and ask Christopher** before proceeding.

## Hard rules

- Branch is `nextjs-migration` for the source and `chore/04-cutover-to-nextjs` for the working branch. Final PR target is `main`.
- This plan **does** modify `main` indirectly (via merging the PR) — but only the merge happens against `main`, no direct commits.
- Do not change Vercel project settings via CLI. The Vercel project's "Framework Preset" will auto-detect Next.js once the Vite `vercel.json` is gone and `package.json` has Next.js as a dependency at the root.
- This plan **deletes large portions of the repo**. Verify each delete intentionally. The rollback tag from Step 1 is your safety net.
- Sentence-case rule from earlier plans does not apply here — this is infra, not content.

---

## Step 1 — Tag current production for rollback

This creates an immutable reference to the current Vite production state so we can recover if anything breaks post-cutover.

- [x] Confirm you have a clean checkout: `git status` (CRLF noise is OK; no real diffs)
- [x] Switch to `main` and pull latest:
  ```
  git checkout main
  git pull origin main
  ```
- [x] Tag the current `main` HEAD:
  ```
  git tag pre-nextjs-cutover
  git push origin pre-nextjs-cutover
  ```
- [x] Verify the tag exists locally and remotely:
  ```
  git tag --list 'pre-*'
  git ls-remote --tags origin | grep pre-nextjs-cutover
  ```
- [x] Switch back to `nextjs-migration`:
  ```
  git checkout nextjs-migration
  git pull origin nextjs-migration
  ```

**Verification:**
- [x] `git tag --list 'pre-*'` prints `pre-nextjs-cutover`
- [x] `git ls-remote --tags origin | grep pre-nextjs-cutover` returns one match
- [x] Current branch is `nextjs-migration` (`git branch --show-current`)

**Rollback note (for reference, do not run now):** if production breaks after merge, you can recover via:
```
git revert <merge-commit-sha-of-cutover-PR>
git push origin main
```
Vercel will auto-deploy the revert and you'll be back at `pre-nextjs-cutover` (which equals the old Vite site).

---

## Step 2 — Create the cutover working branch

- [x] From `nextjs-migration`, create the cutover branch:
  ```
  git checkout -b chore/04-cutover-to-nextjs
  ```

**Verification:**
- [x] `git branch --show-current` prints `chore/04-cutover-to-nextjs`

---

## Step 3 — Delete the Vite root files (tracked in git)

Use `git rm -rf` so the deletes are recorded for the upcoming commit. Run from the repo root.

**Files to delete (root level):**
- [x] `git rm -rf index.html`
- [x] `git rm -rf vite.config.js`
- [x] `git rm -rf package.json` (root — the Vite one. Will be replaced by next-site's package.json in Step 5)
- [x] `git rm -rf package-lock.json` (root)
- [x] `git rm -rf vercel.json` (root — Vite-flavored config)
- [x] `git rm -rf .env.example` (root — has only `VITE_GOOGLE_MAPS_API_KEY`, obsolete)

**Directories to delete (root level):**
- [x] `git rm -rf src/`
- [x] `git rm -rf api/` (includes the Google Reviews endpoint, no longer needed)
- [x] `git rm -rf public/` (root — Vite static assets. The next-site has its own public/ that will replace this in Step 5)
- [x] `git rm -rf scripts/` (root — Vite scripts. The next-site has its own scripts/)
- [x] `git rm -rf sanity/` (root — orphaned standalone Sanity Studio, superseded by `next-site/sanity/`)
- [x] `git rm -rf conditions-utilisation/` (root — Vite HTML page, replaced by `next-site/app/conditions-utilisation/`)
- [x] `git rm -rf offres/` (root — Vite offer pages, deleted in Plan 01 from the Next.js side; remove the Vite version too)
- [x] `git rm -rf politique-de-confidentialite/` (root — Vite HTML page, replaced by `next-site/app/politique-de-confidentialite/`)

**Untracked / gitignored cleanup (disk only, optional but recommended):**
- [x] `rm -rf node_modules` (root — Vite deps; Step 5 reinstalls fresh)
- [x] `rm -rf dist` (root — Vite build output)
- [x] `rm -rf .vercel` (root — links to current Vercel config; will be re-linked when Vercel rebuilds the project on the new structure)
- [x] `rm -f .env.local` (root — Vite-flavored local env vars, replaced in Step 5 by `next-site/.env.local` move)

**Verification:**
- [x] `git status` shows the deletes as staged
- [x] At the repo root, only these directories/files remain after the deletes (plus the `.git/` and `next-site/` and `plans/` directories):
  - `GITHUB_ISSUES_GUIDE.md`
  - `next-site/`
  - `plans/`
  - `.git/`
  - `.gitignore` (still the Vite one — replaced in Step 4)
- [x] Confirm: `ls -A | grep -vE '^(\.git|next-site|plans|GITHUB_ISSUES_GUIDE.md|\.gitignore)$'` returns no rows (everything else is gone).

---

## Step 4 — Replace the root `.gitignore`

The current root `.gitignore` is the Vite one. Replace it with the Next.js one from `next-site/.gitignore`. Both will end up at the root after Step 5; we do this swap explicitly in advance to keep the move clean.

- [x] `git rm -f .gitignore` (the Vite one at root)
- [x] `git mv next-site/.gitignore .gitignore`

**Verification:**
- [x] `cat .gitignore` shows the Next.js content (entries for `/.next/`, `.env*`, `*.tsbuildinfo`, etc. — not the old Vite list)
- [x] `git status` shows the rename

---

## Step 5 — Hoist `/next-site/*` to the repo root

Move every remaining file and directory inside `next-site/` up to the root. Use `git mv` so git tracks the moves as renames (preserves blame/history).

Run these one by one (don't shortcut with a glob — git's behavior with hidden files and directories varies). Replace each with `git mv` for cleanliness.

- [x] `git mv next-site/README.md README.md`
- [x] `git mv next-site/app app`
- [x] `git mv next-site/eslint.config.mjs eslint.config.mjs`
- [x] `git mv next-site/lib lib`
- [x] `git mv next-site/next.config.ts next.config.ts`
- [x] `git mv next-site/package.json package.json`
- [x] `git mv next-site/package-lock.json package-lock.json`
- [x] `git mv next-site/public public`
- [x] `git mv next-site/sanity sanity`
- [x] `git mv next-site/sanity.cli.ts sanity.cli.ts`
- [x] `git mv next-site/sanity.config.ts sanity.config.ts`
- [x] `git mv next-site/scripts scripts`
- [x] `git mv next-site/tsconfig.json tsconfig.json`
- [x] `git mv next-site/types types`

**Untracked items inside `next-site/` (move on disk, no git involvement):**
- [x] `mv next-site/.env.local .env.local 2>/dev/null || true` (the local env file; gitignored; safe if missing)
- [x] `rm -rf next-site/node_modules` (will reinstall in Step 6)
- [x] `rm -rf next-site/.next` (build cache)
- [x] `rm -f next-site/next-env.d.ts` (regenerated on next build)
- [x] `rm -f next-site/tsconfig.tsbuildinfo` (regenerated)

**Remove the empty `next-site/` directory:**
- [x] `rmdir next-site` (must be empty at this point)

**Verification:**
- [x] `ls next-site 2>/dev/null` returns nothing
- [x] At repo root, you now see: `app/`, `lib/`, `public/`, `sanity/`, `scripts/`, `types/`, `package.json`, `next.config.ts`, `sanity.config.ts`, `sanity.cli.ts`, `tsconfig.json`, `eslint.config.mjs`, `README.md`, plus the unchanged `plans/`, `GITHUB_ISSUES_GUIDE.md`, `.gitignore`, `.git/`
- [x] `git status` shows the moves as renames (not delete + add). If git lists them as deletes + adds, that's still fine — the file content is identical and git's similarity detection should mark them as renames at PR view time.

---

## Step 6 — Reinstall and rebuild at the new root

- [x] From the repo root, install fresh:
  ```
  npm install
  ```
- [x] Run lint:
  ```
  npm run lint
  ```
  Must pass with zero errors.
- [x] Run build:
  ```
  npm run build
  ```
  Must complete successfully. Watch the output: it should be a Next.js build (mentions `.next/`, route compilation, etc.). If it tries to run Vite, something didn't get deleted in Step 3 — stop and investigate.
- [x] Run dev server smoke test:
  ```
  npm run dev
  ```
  Then visit `http://localhost:3000/`. Confirm:
  - Homepage loads with all sections from Plan 02
  - Marquees animate correctly (Marquee 1 always, Marquee 2 on mobile)
  - No console errors
  - `/studio` loads, Studio works
  - `/conditions-utilisation` and `/politique-de-confidentialite` resolve (they're now at the root level under `app/`)
- [x] Stop the dev server (Ctrl+C).

**Verification:**
- [x] `npm run lint` exit code 0
- [x] `npm run build` exit code 0, output mentions Next.js (not Vite)
- [x] Local browser test passes the bullets above
- [x] No new files appeared that should be ignored — `git status` only shows the Step 3, 4, 5 changes plus possibly `next-env.d.ts` and `tsconfig.tsbuildinfo` (both gitignored, so they shouldn't appear in status)

---

## Step 7 — Sanity-check the production-relevant config files

Open these files and confirm there's nothing pointing at the old `next-site/` subdirectory or Vite paths:

- [x] `next.config.ts` — no path overrides referencing `next-site/`
- [x] `sanity.config.ts` — `basePath: '/studio'` is correct (unchanged from before)
- [x] `tsconfig.json` — `paths` and `include` patterns don't reference `next-site/` (they should be relative — `app/**/*`, `lib/**/*`, etc.)
- [x] `package.json` — `"name"` is fine to leave as `"next-site"` (not user-facing) but feel free to rename to `"elianelarre"` if you want; scripts (`dev`, `build`, `start`, `lint`) work as-is
- [x] `eslint.config.mjs` — no `next-site/` references in the config

If anything references `next-site/`, fix it now.

**Verification:**
- [x] `grep -rn 'next-site/' .` (excluding `.git`, `node_modules`, `.next`) returns no matches in source files. The only acceptable matches are in `plans/` (historical references — leave those).

---

## Step 8 — Commit and push the cutover branch

- [x] `git add -A`
- [x] Sanity check the staged diff: `git status` should show:
  - Many deletes (Vite root files)
  - Many renames (next-site/* → root)
  - Maybe a `.gitignore` rename
  - No accidental modifications outside scope
- [x] Commit:
  ```
  git commit -m "chore(repo): cutover to Next.js — delete Vite root, hoist next-site to root"
  ```
- [x] Push:
  ```
  git push -u origin chore/04-cutover-to-nextjs
  ```

**Verification:**
- [x] Branch appears on GitHub at `aibudoptimization/<repo>/tree/chore/04-cutover-to-nextjs`
- [x] Vercel automatically queues a preview deployment for this push (visible on the Vercel project's Deployments tab)

---

## Step 9 — Vercel preview verification (this satisfies Plan 03 Step 11)

- [x] Open the Vercel project (`eliane-website`) → Deployments. The latest preview deploy for `chore/04-cutover-to-nextjs` should be building.
- [x] Watch the build logs:
  - Framework should auto-detect as **Next.js** (not Vite)
  - No `npm run build` failures
  - No missing-env-var errors (if you see one, the env vars from pre-flight aren't set on Preview environment — go add them, then redeploy)
- [x] Once the deploy succeeds, open the preview URL Vercel gives you (something like `eliane-website-git-chore-04-cutover-to-nextjs-aibudoptimization.vercel.app`).
- [x] Smoke test on the **preview URL**:
  - [x] Homepage loads. All Plan 02 sections render: hero, both marquees, sled, meet trainer, pull quote, offering, in-person, reviews, for-you-or-not, after-call, purple CTA, FAQ, collaborators
  - [x] Top nav shows: Approche, Accompagnement, Témoignages, FAQ, Appel découverte. Each anchor link scrolls to the right section. "Appel découverte" opens cal.com.
  - [x] FAQ links (Ataraxia, Psycom, Précision Nutrition) are clickable and open in new tabs
  - [x] No console errors in DevTools
  - [x] No CORS errors when Sanity content fetches (would appear in Network tab)
  - [x] `/studio` loads at `<preview-url>/studio` — Studio interface renders, no schema errors, no CORS errors
  - [x] Sanity Presentation visual editing works on the preview URL
  - [x] Mobile viewport (DevTools 375px): no horizontal scroll, sections readable, marquee 2 scrolls
  - [x] Repeat at 1280px: marquee 2 shows static 3-column grid
- [x] If any of the above fails: fix on `chore/04-cutover-to-nextjs` (commit, push), Vercel redeploys automatically, retest.

**Verification:**
- [x] Vercel build succeeds with Next.js detection
- [x] All preview-URL smoke checks pass
- [x] **Update `plans/03-nav-faq-and-verification.md`**: open the file and check off all four boxes under "Step 11 — Vercel preview deployment check" (since this Plan 04 Step 9 satisfies them).

> **Do not proceed past this step without Christopher's explicit approval.** The next step merges to `main` and changes production. Stop here, summarize the preview verification results, and wait for Christopher's "go".

---

## Step 10 — Production cutover (PR + merge)

After Christopher approves Step 9:

- [x] Open a PR on GitHub: `chore/04-cutover-to-nextjs` → `main`. Title: `chore: cut over elianelarre.com to Next.js`.
- [x] In the PR description, link the preview URL and note:
  - Tag `pre-nextjs-cutover` is the rollback target
  - Sanity CORS includes the production domain (verified pre-flight)
  - Vercel env vars are set (verified pre-flight)
  - Plan 03 Step 11 is satisfied by this PR's preview verification
- [x] Wait for Christopher's approval on the PR.
- [x] Merge the PR (Christopher will press the button).
- [x] Vercel automatically queues a Production deploy on `main`. Watch the deploy in the Vercel Deployments tab.

**Verification:**
- [x] PR is merged into `main`
- [x] Vercel Production deploy succeeds (logs show Next.js build, no errors)
- [x] Production deploy completes within ~3 minutes

---

## Step 11 — Post-cutover verification

Once the Production deploy is live:

- [x] Visit `https://elianelarre.com` in an **incognito window** (avoids cached old Vite assets):
  - [x] Homepage loads, all sections render
  - [x] No console errors
  - [x] `https://elianelarre.com/studio` loads, Studio renders
  - [x] FAQ links work
  - [x] CTA buttons go to cal.com
- [x] Same checks at `https://www.elianelarre.com` (with the `www`) — both should work
- [x] Mobile check: load production on a phone, scroll through, tap a few CTAs
- [x] Run `curl -sI https://elianelarre.com | head -5` — confirm HTTP 200 and `server: Vercel`

If anything broken on production:
- [ ] Stop. Tell Christopher.
- [ ] Together, decide: fix forward (commit a hotfix, push to `main`) or revert (`git revert <merge-sha> && git push origin main`).

**Verification:**
- [x] Production loads at both apex and www
- [x] Studio loads on production
- [x] No 500 errors in Vercel logs (check Vercel project → Logs)
- [x] No CORS errors in browser DevTools when loading production

---

## Step 12 — Mark Plan 03 Step 11 complete and commit plan updates

- [x] In `plans/03-nav-faq-and-verification.md`, find the four checkboxes under Step 11 — change each `- [ ]` to `- [x]`. Add a note at the end of that step: "Satisfied by Plan 04 cutover — see `plans/04-cutover-to-nextjs.md` Step 9."
- [x] In `plans/04-cutover-to-nextjs.md` (this file), check off all the boxes you completed.
- [x] Commit on `main` (or open a small follow-up PR — your call):
  ```
  git checkout main
  git pull origin main
  git checkout -b docs/mark-cutover-complete
  # edit the plan files
  git add plans/
  git commit -m "docs(plans): mark Plan 03 Step 11 and Plan 04 complete"
  git push -u origin docs/mark-cutover-complete
  ```
- [ ] Open PR `docs/mark-cutover-complete` → `main`, merge.

**Verification:**
- [x] Plan 03 Step 11 boxes are all `[x]`
- [x] Plan 04 boxes are all `[x]`

---

## Step 13 — Cleanup (do this only after a few days of stable production)

These are not for execution by Cursor right now. Listing for Christopher's reference.

- [ ] After 3–7 days of stable production, delete the `nextjs-migration` branch:
  ```
  git push origin --delete nextjs-migration
  git branch -D nextjs-migration  # local
  ```
- [ ] Delete obsolete Vercel env vars (`VITE_*`, `GOOGLE_PLACES_API_KEY`, `GOOGLE_PLACE_ID`, `VERCEL_OIDC_TOKEN` if still present and unused) via the Vercel dashboard.
- [ ] Optionally drop the `pre-nextjs-cutover` tag once you're confident no rollback is needed:
  ```
  git tag -d pre-nextjs-cutover
  git push origin :refs/tags/pre-nextjs-cutover
  ```

---

## Final verification checklist for Plan 04

- [x] `pre-nextjs-cutover` tag exists on remote
- [x] All Vite root files are deleted
- [x] `next-site/` directory no longer exists; its contents are at the repo root
- [x] `npm run lint` and `npm run build` both pass at the new root
- [x] Vercel preview deploy of the cutover branch succeeded as Next.js
- [x] Preview URL passed all smoke checks
- [x] PR merged to `main`, production deploy succeeded
- [x] `https://elianelarre.com` and `https://www.elianelarre.com` both load the new Next.js site
- [x] Studio loads on production at `/studio`
- [x] Plan 03 Step 11 marked complete
- [x] No 500 errors in Vercel logs

---

## Things to escalate to Christopher (don't decide unilaterally)

1. If the preview deploy in Step 9 fails for a non-obvious reason (auto-detected wrong framework, missing peer dep, type errors that didn't appear locally) — stop, paste the error, ask.
2. If Vercel logs show CORS errors against Sanity even though pre-flight confirmed CORS — Christopher needs to recheck the Sanity dashboard CORS list.
3. If the production smoke test (Step 11) reveals visual breakage that wasn't on the preview URL — this would be unusual; report and pause before any "fix forward" action.
4. If you encounter any tracked file that the plan doesn't account for — list it and ask before deleting or moving.
