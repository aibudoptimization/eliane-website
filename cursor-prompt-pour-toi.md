# Cursor Prompt — "Pour toi / Pas pour toi" Section Redesign

Modify the **"Pour toi / pas pour toi"** section in the existing page. Do not touch any other section. All brand CSS tokens (`--plum`, `--lavender`, `--beige`, etc.) already exist in the file — do not redefine them.

---

## 1. CSS changes

Find the existing `/* Pour toi / pas pour toi */` CSS block and replace/add the following rules:

### `.fit-col` — shared card base
Remove the two overrides below (they will be replaced by the rules in step 2):
```css
/* DELETE these lines: */
.fit-col { background: var(--white); ... }
.fit-col.no { background: transparent; box-shadow: none; padding: 36px 0 36px 8px; }
```

Add a shared transition on `.fit-col`:
```css
.fit-col {
  border-radius: var(--radius);
  padding: 36px 32px;
  box-shadow: var(--shadow-card);
  transition: transform 0.5s var(--ease), box-shadow 0.5s var(--ease);
}
.fit-col:hover { transform: translateY(-4px); box-shadow: var(--shadow-card-hover); }
```

### `.fit-col.yes` — left "Pour toi" card
```css
.fit-col.yes {
  background: #f3faf4;
  border: 1px solid #c2dfc8;
  border-left: 4px solid #2d6e3a;
}
```

### `.fit-col.no` — middle "Pas pour toi" card (now a real card)
```css
.fit-col.no {
  background: #fef7f6;
  border: 1px solid #f0d4d0;
  border-left: 4px solid #c0594a;
}
```

### `.fit-pill` — new "Pour toi" pill badge (add this rule)
```css
.fit-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(45, 110, 58, 0.11);
  color: #2d6e3a;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 14px;
}
```

### `.fit-col-label` — label colors
```css
.fit-col.yes .fit-col-label { color: #2d6e3a; }
.fit-col.no  .fit-col-label { color: #b84a3a; }
```

### `.fit-icon` — icon circle colors
```css
.fit-icon.check { background: rgba(45, 110, 58, 0.14); color: #2d6e3a; }
.fit-icon.cross { background: rgba(192, 89, 74, 0.14); color: #b84a3a; }
```

### `.fit-footer` — footer layout (70% quote / 30% CTA)
Replace the existing `.fit-footer` rule:
```css
.fit-footer {
  margin-top: 48px;
  display: grid;
  grid-template-columns: 1.55fr 0.7fr;
  gap: 48px;
  align-items: center;
}
```

### `.fit-quote` — new quote block (add this rule, replaces the plain `<p>` style)
```css
.fit-quote {
  background: var(--lavender);
  border-radius: var(--radius);
  padding: 22px 28px;
  position: relative;
}
.fit-quote::before {
  content: '\201C';
  position: absolute;
  top: -8px;
  left: 18px;
  font-family: var(--font-serif);
  font-size: 3.5rem;
  line-height: 1;
  color: var(--plum);
  opacity: 0.35;
}
.fit-quote p {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.05rem;
  color: var(--ink);
  line-height: 1.6;
  padding-left: 4px;
}
```

### Responsive — update the mobile breakpoint for `.fit-footer`
```css
@media (max-width: 920px) {
  .fit-grid { grid-template-columns: 1fr; gap: 16px; }
  .fit-image { aspect-ratio: 4/3; }
  .fit-col.no { padding: 22px; }
  .fit-footer { grid-template-columns: 1fr; gap: 24px; margin-top: 36px; }
}
```

---

## 2. HTML changes

Find the `<!-- ==== Pour toi / pas pour toi ==== -->` section and apply the following changes:

### LEFT card (`.fit-col.yes`)
- **Remove** the `<h3>` tag that says "Ces phrases te ressemblent"
- **Add** a `.fit-pill` div as the very first child of `.fit-col.yes`, before `.fit-col-label`:
  ```html
  <div class="fit-pill">✓ Pour toi</div>
  ```
- Keep the `.fit-col-label` text as-is ("C'est pour toi si")
- Checkmark icons already use `.fit-icon.check` — no change needed there

### MIDDLE card (`.fit-col.no`)
- **Remove** the `class="no"` override that made it transparent — it now inherits the card styles from step 1
- **Remove** the `<h3>` tag that says "Ces phrases ne s'alignent pas"
- Keep the `.fit-col-label` text as-is ("Ce n'est probablement pas pour toi si")
- Cross icons: change `.fit-icon.cross` background/color — already handled by the CSS update above

### FOOTER (`.fit-footer`)
Replace the existing `<p>` quote text with a `.fit-quote` wrapper:
```html
<!-- BEFORE -->
<p>Cet accompagnement s'adresse aux femmes qui veulent investir sérieusement dans leur progression, leur confiance et leur santé à long terme.</p>

<!-- AFTER -->
<div class="fit-quote">
  <p>Cet accompagnement s'adresse aux femmes qui veulent investir sérieusement dans leur progression, leur confiance et leur santé à long terme.</p>
</div>
```

The CTA button (`<a class="btn btn-primary">`) that follows remains unchanged.

---

## Summary of what changes
| Element | Before | After |
|---|---|---|
| Left card background | `var(--white)` | `#f3faf4` (subtle sage) |
| Left card border | none | left 4px solid `#2d6e3a` |
| Left card pill badge | absent | ✓ Pour toi pill added |
| Left card h3 title | "Ces phrases te ressemblent" | **removed** |
| Left checkmarks | muted green circle | green circle `rgba(45,110,58,0.14)` |
| Middle card background | transparent | `#fef7f6` (subtle blush) |
| Middle card border | none | left 4px solid `#c0594a` |
| Middle card h3 title | "Ces phrases ne s'alignent pas" | **removed** |
| Middle cross icons | muted grey circle | red-tinted circle `rgba(192,89,74,0.14)` |
| Footer layout | `1.2fr 1fr` | `1.55fr 0.7fr` |
| Quote | plain `<p>` in serif | lavender block with `"` mark (`.fit-quote`) |
