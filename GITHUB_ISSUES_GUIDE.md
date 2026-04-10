# GitHub Issues Guide (for AI dev agents)

Use this document as standing instructions whenever you work in this repository. The goal is predictable tracking: every meaningful unit of work maps to an issue, issues stay current, and milestones reflect real progress.

---

## 1. Core rules

1. **No silent work** — If you implement a feature, fix a bug, or make a non-trivial change, there must be a GitHub issue that describes it (or you must update an existing one). Do not merge substantial work without issue linkage.
2. **One primary issue per PR** — Prefer one focused issue per pull request. If a PR must cover multiple issues, list every related issue in the PR description and explain why.
3. **Update issues before you finish** — Refresh the issue body or a comment with what changed, blockers, and verification notes while the work is in progress, not only when the PR merges.
4. **Milestones are commitments** — Assign issues to milestones when scope is known. Move or renegotiate milestones explicitly (comment on the issue and adjust the milestone) if dates or scope change.

---

## 2. When to create a new issue

Create a **new** issue when:

- The work is a distinct deliverable or bug (can be titled and tested independently).
- Scope is unclear — the issue is the place to clarify acceptance criteria before coding.
- The request came from chat or elsewhere without an existing issue.

Use an **existing** issue when:

- The user or backlog already opened one for this task.
- The work is clearly a sub-step of an existing issue — then use that issue and add a checklist or comment rather than spawning duplicates.

If you are unsure, **search open and closed issues** for duplicates before creating a new one.

**Tiny / trivial changes** — The team may agree to skip a new issue for **obvious one-off fixes** (e.g. single typo, formatting-only). If in doubt, **open or attach to an existing issue**; never use “trivial” to avoid tracking **behavioral or dependency changes**.

---

## 3. Issue quality checklist

Every issue you create or curate should aim to include:

| Element | Purpose |
|--------|---------|
| **Title** | Imperative, specific: `Add login rate limiting` not `Auth stuff`. |
| **Context** | Why this exists; link to specs, designs, or prior discussion. |
| **Acceptance criteria** | Bullet list of what “done” means (observable behavior). |
| **Out of scope** | Optional but reduces scope creep. |
| **Labels** | Type (see §4), optional priority, `blocked` when stuck—use **only** names from that list unless the team adds new ones. |
| **Milestone** | Target release or sprint milestone, when applicable. |

For bugs, add: **steps to reproduce**, **expected vs actual**, **environment** (OS, version, branch).

**Dependencies** — When work waits on another issue, state **`Blocked by #N`** (and optionally **`Blocks #M`**) in the issue body so milestones and boards stay honest.

**Risk flags** — Call out in the issue (and PR) when the change is **breaking**, touches **auth/security**, **migrations/data**, or **production config** so review and testing get the right attention.

---

## 4. Labels and conventions (this repo)

**Repository:** [aibudoptimization/eliane-website](https://github.com/aibudoptimization/eliane-website)

Use **only** the names below for type, priority, and blocked state. GitHub’s default labels (`duplicate`, `good first issue`, `help wanted`, `invalid`, `question`, `wontfix`) stay available for their usual meaning; do not add ad-hoc label names unless the team decides to extend this list.

### Type (pick one primary)

| Label | When to use |
|--------|-------------|
| `bug` | Incorrect behavior, regression, or defect. |
| `feature` | New capability or user-visible behavior. |
| `enhancement` | Improvement to something that already exists (UX polish, perf, small behavior tweak). |
| `chore` | Tooling, dependencies, CI, refactors—no meaningful product behavior change. |
| `documentation` | README, guides, comments, or other docs-only work. |

### Priority (optional; at most one)

| Label | When to use |
|--------|-------------|
| `priority:high` | Urgent, release-critical, or blocking other work. |
| `priority:low` | Can wait; nice-to-have when there is capacity. |

If neither fits, omit priority. For finer grading later, the team may adopt `P0` / `P1` / `P2` **instead of** this pair—do not mix schemes on the same issue.

### Blocked

| Label | When to use |
|--------|-------------|
| `blocked` | Waiting on another person, a decision, or an external dependency. Always say **who/what** in the issue body (`Blocked by #N` or a short note). Remove `blocked` when unblocked. |

### Agent / contributor rule

Apply labels consistently; **do not invent new label names** per issue. If something does not fit, use the closest existing label and describe nuance in the issue body—or ask the maintainer to add a label to this section first.

---

## 5. Branching and integration to `main`

**Workflow** — Do substantial work on a **dedicated branch**, not by committing directly to `main`. When the maintainer accepts the outcome, integrate via **merge into `main`** (almost always through a **pull request** so the diff and linked issues stay visible).

**Why this is sound** — `main` stays the agreed “good” line of history; each branch is one reviewable slice of work; issues and PRs line up with that slice. This is the usual **feature-branch** / **GitHub Flow** style and works well for solo or small teams.

**AI agent behavior**

- Branch from **up-to-date `main`** (or the repository’s default branch if it is not named `main`) unless the user says otherwise.
- Use predictable branch names, e.g. `feature/123-short-slug`, `fix/456-short-slug`, or `chore/what-changed` — include the issue number when there is one.
- Open a **PR from your branch into `main`**; link the issue in the PR body (`Closes #N`, etc.). Prefer **draft PRs** while work is incomplete if that matches team habit.
- **Do not merge to `main`** unless the user explicitly approves (many agents cannot merge anyway; treat merge as a human decision after acceptance).
- If the user merges locally or outside GitHub, still **update the issue** (and close it when criteria are met) so tracking matches reality.

---

## 6. Milestones

**Creating / assigning**

- When the user defines a release or sprint, ensure issues for that batch are assigned to the corresponding milestone.
- Issues without a milestone should be **backlog** or explicitly “unscheduled” — avoid leaving important work orphaned if the team tracks releases by milestone.

**Progress and honesty**

- If work will miss the milestone, **update the issue**: comment with reason, new target, and any dependency. Move the issue to the correct milestone in GitHub.
- When all issues for a milestone are done, verify **closed** state and that no open issues remain attached (or document exceptions in the milestone description or a summary issue).

**AI agent behavior**

- After completing work tied to a milestone, confirm the issue is **closed** only when acceptance criteria are met (or when the user confirms deferral).
- Do not bulk-close issues without verifying each one.

---

## 7. Pull requests and commits

**PR description must include:**

- `Closes #123` or `Fixes #123` for a single issue (GitHub auto-closes on merge to the default branch when worded correctly).
- For multiple issues: `Closes #123, closes #456` or list them and close manually if GitHub syntax does not apply.
- Short summary of changes and how acceptance criteria were satisfied.
- **How to verify** — Commands run (`npm test`, `pytest`, …), manual steps, or **screenshots** for UI changes. If tests were not run, say why (and only when the user accepts that).

**Size and scope**

- Keep PRs **small and reviewable**. If scope grows, **split work** (new issue + new PR) or explicitly extend acceptance criteria on the same issue with a comment.

**CI / checks**

- If the repo has **required checks**, treat **green CI** as part of “ready to merge.” Note failures in the PR; do not ask the user to merge a broken build unless they explicitly override.

**Commits**

- Reference the issue in the subject or body: e.g. `Add rate limiter (#123)` — helps history and code archeology.

---

## 8. Comments: what to post and when

Post a **comment** on the issue when:

- Starting work: brief note (“Implementing on branch `feature/xyz`”).
- Blocked: who/what is blocking, date of next check.
- Behavior or scope changes: what changed and why.
- PR opened: link to PR.
- After review: address review outcome; note if acceptance criteria were tightened.

Avoid noise: one consolidated update is better than five micro-comments.

---

## 9. Project boards (optional)

If the repository uses GitHub Projects:

- Move the issue card across columns (**Todo / In progress / Done**) to match reality.
- The issue’s **open/closed** state and the board should agree; fix discrepancies when you notice them.

---

## 10. Session workflow for AI agents

At **start** of a coding session:

1. Confirm the **goal** with the user (or infer from the issue they reference).
2. Find or create the **issue**; read acceptance criteria.
3. Note the **milestone** and labels; fix if missing or wrong.
4. Create a **branch from `main`**, push it, and use it for all commits in this task.

During **implementation**:

5. Keep the issue updated (comment or checklist in the issue body if appropriate).
6. Open a **draft PR** from your branch into `main` early if the workflow uses PRs.

At **end** of the session (or before handoff):

7. Ensure **PR** (branch → `main`) links the issue and describes verification.
8. Update the issue: status, branch name, PR link, what remains (if anything).
9. If using milestones/projects, ensure **assignments and columns** match the true state.

---

## 11. Closing issues

Close an issue when:

- Acceptance criteria are met on the default branch (or the agreed release branch), **or**
- The user explicitly accepts closing as **won’t-fix** / duplicate / obsolete — state that in a final comment.

Do **not** close issues only because a PR was opened; close when work is merged (or when the user directs otherwise).

---

## 12. Quick reference: GitHub keywords in PRs

Common auto-close phrases (default branch merge):

- `Closes #N`
- `Fixes #N`
- `Resolves #N`

Use these so automation stays reliable.

---

## 13. Security, privacy, and hygiene

- **Never** paste **secrets** (API keys, tokens, passwords), **customer PII**, or **internal-only URLs/credentials** into issues, PR descriptions, comments, or commit messages. Use placeholders and rotate anything that was ever exposed.
- Prefer **reference links** to specs or designs instead of pasting huge blobs; summarize in the issue.

---

## 14. Epics and large work (optional)

For big features that span multiple PRs:

- Use a **single tracking issue** (“Epic: …”) with a **checklist** of child tasks (each child can be its own issue: `Part of #N` in the body).
- Close the epic when **all** children are done and verified on `main`, or when the user explicitly narrows scope.

Use **GitHub Discussions** (if enabled) for **open-ended questions** or brainstorming; open an **issue** once there is a concrete decision or deliverable.

---

## 15. What to paste at the start of a new chat

You can paste the block below to prime an agent:

```text
Follow GITHUB_ISSUES_GUIDE.md in this repo for all GitHub issue and milestone hygiene.
- Find or create issues for this task; avoid duplicate issues; use Blocked by #N when needed.
- Work on a branch from main; open a PR into main; merge only after I accept (or I will merge).
- Keep acceptance criteria and milestone accurate; comment with blockers, branch name, and PR links.
- PR must reference issues (Closes/Fixes #N), include how you verified, and respect CI. No secrets in issues/PRs.
- Update the issue before handoff.
```

---

*When milestones or Project columns change, update this file. If you add or rename labels on GitHub, update §4 to match so agents stay aligned.*
