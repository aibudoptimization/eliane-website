# Cursor Prompt — "Comment ça se passe / Après l'appel découverte" Section

Implement the **process/journey section** in the existing page. Do not touch any other section. All brand CSS tokens (`--plum`, `--beige-deep`, `--mid`, etc.) already exist in the file — do not redefine them.

---

## 1. CSS — add the following rules

Find the existing section CSS block and add the rules below (create a new `/* Process section */` comment block):

```css
/* ==== Comment ça se passe ==== */

.process-eyebrow {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.26em;
  text-transform: uppercase;
  color: var(--plum);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.process-eyebrow::before {
  content: '';
  width: 18px;
  height: 1px;
  background: var(--plum);
  opacity: 0.5;
  flex-shrink: 0;
}

.process-header {
  margin-bottom: 52px;
}
.process-header h2 {
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(1.6rem, 3vw, 2rem);
  color: var(--ink);
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin-bottom: 12px;
}
.process-sub {
  font-size: 0.8rem;
  color: var(--mid);
  line-height: 1.75;
  max-width: 480px;
  font-weight: 300;
}

/* 3-column spine grid:
   left col (steps 1,3,5) | 60px center (arrows) | right col (steps 2,4) */
.process-grid {
  display: grid;
  grid-template-columns: 1fr 60px 1fr;
  align-items: start;
}

.process-col {
  display: flex;
  flex-direction: column;
}
.process-col.left {
  align-items: flex-end;
  text-align: right;
  padding-right: 16px;
}
.process-col.right {
  align-items: flex-start;
  text-align: left;
  padding-left: 16px;
}
.process-col.center {
  align-items: center;
}

.process-step {
  padding: 12px 0 16px;
  max-width: 236px;
}
.process-step-title {
  font-family: var(--font-serif);
  font-size: 1.06rem;
  font-weight: 400;
  color: var(--ink);
  line-height: 1.3;
  margin-bottom: 7px;
}
.process-step-desc {
  font-family: var(--font-sans);
  font-size: 0.72rem;
  font-weight: 300;
  color: var(--mid);
  line-height: 1.7;
}

/* Step 5 — final destination, plum colour */
.process-step.destination .process-step-title { color: var(--plum); }
.process-step.destination .process-step-desc  { color: #7a4da0; }

/* Arrow icon wrappers — adjust margin-top per arrow to float
   between the two steps it connects */
.process-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--plum);
  opacity: 0.58;
}

/* CTA row */
.process-cta {
  display: flex;
  justify-content: center;
  margin-top: 48px;
}

/* Responsive */
@media (max-width: 768px) {
  .process-grid { grid-template-columns: 1fr; }
  .process-col.center { display: none; }
  .process-col.left,
  .process-col.right {
    align-items: flex-start;
    text-align: left;
    padding: 0;
  }
  .process-step { max-width: 100%; }
}
```

---

## 2. HTML — add the section

Add the block below as a new `<section>` in the page (after the "Pour toi / Pas pour toi" section):

```html
<!-- ==== Comment ça se passe / Après l'appel découverte ==== -->
<section class="section alt">
  <div class="container">

    <!-- Header -->
    <div class="process-header">
      <div class="process-eyebrow">Comment ça se passe</div>
      <h2>Après l'appel découverte.</h2>
      <p class="process-sub">L'appel est gratuit, sans engagement, et sert d'abord à voir si l'accompagnement est réellement pertinent pour toi.</p>
    </div>

    <!-- 3-column grid -->
    <div class="process-grid">

      <!-- LEFT — steps 1, 3, 5 -->
      <div class="process-col left">

        <div class="process-step" style="padding-top: 14px;">
          <div class="process-step-title">Comprendre où tu en es</div>
          <p class="process-step-desc">On prend le temps de regarder ton point de départ : ton historique d'entraînement, ton mode de vie et ce qui t'a freinée par le passé.</p>
        </div>

        <div style="height: 40px;"></div>

        <div class="process-step">
          <div class="process-step-title">Voir si l'accompagnement est adapté</div>
          <p class="process-step-desc">Je te dirai honnêtement si ce que j'offre correspond à ce que tu cherches — ou pas.</p>
        </div>

        <div style="height: 40px;"></div>

        <div class="process-step destination">
          <div class="process-step-title">Te recommander la meilleure prochaine étape</div>
          <p class="process-step-desc">Que ce soit avec moi ou ailleurs, tu repars avec une direction claire pour avancer.</p>
        </div>

      </div>

      <!-- CENTER — arrow icons (one per transition) -->
      <!--
        Arrow connections:
          1. Right side of title 1  →  top of title 2   (curves right then down)
          2. Left side of title 2   →  top of title 3   (curves left then down)
          3. Right side of title 3  →  top of title 4   (curves right then down)
          4. Left side of title 4   →  top of title 5   (curves left then down)
          5. Right side of title 5  →  top of CTA       (curves right/down to centre)

        Each arrow SVG should:
          - Be approximately 36–44px wide
          - Use stroke colour var(--plum), opacity ~0.58
          - Have an open arrowhead (two lines, not a filled triangle)
          - Adjust margin-top on each .process-arrow div to float it
            in the vertical gap between the two steps it connects.
      -->
      <div class="process-col center">

        <!-- Arrow 1 -->
        <div class="process-arrow" style="margin-top: 60px;">
          <!-- INSERT SVG ARROW 1 HERE (right-curving) -->
        </div>

        <!-- Arrow 2 -->
        <div class="process-arrow" style="margin-top: 60px;">
          <!-- INSERT SVG ARROW 2 HERE (left-curving) -->
        </div>

        <!-- Arrow 3 -->
        <div class="process-arrow" style="margin-top: 60px;">
          <!-- INSERT SVG ARROW 3 HERE (right-curving) -->
        </div>

        <!-- Arrow 4 -->
        <div class="process-arrow" style="margin-top: 60px;">
          <!-- INSERT SVG ARROW 4 HERE (left-curving) -->
        </div>

        <!--
          Arrow 5 (title 5 → CTA):
          This arrow bridges the grid and the CTA row below.
          Recommended approach: position it absolutely between the
          grid's bottom and the CTA, or add it as a full-width row
          between .process-grid and .process-cta with a centred SVG.
        -->

      </div>

      <!-- RIGHT — steps 2, 4 -->
      <div class="process-col right">

        <!-- Spacer: pushes step 2 below step 1 visually -->
        <div style="height: 100px;"></div>

        <div class="process-step">
          <div class="process-step-title">Clarifier tes objectifs</div>
          <p class="process-step-desc">On met des mots précis sur ce que tu veux vraiment atteindre, et sur ce qui compte pour toi à long terme.</p>
        </div>

        <div style="height: 40px;"></div>

        <div class="process-step">
          <div class="process-step-title">Répondre à tes questions</div>
          <p class="process-step-desc">Tu peux poser tout ce que tu veux : logistique, fréquence, méthode, prix. Aucune question n'est de trop.</p>
        </div>

      </div>

    </div><!-- /process-grid -->

    <!-- CTA -->
    <div class="process-cta">
      <a href="https://cal.com/elianelarre/appel-decouverte" class="btn btn-primary">
        Je suis prête à avoir plus d'informations
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </a>
    </div>

  </div>
</section>
```

---

## 3. Arrow icons — notes for implementation

- **Style:** Hand-drawn looking, thin stroke (1.2–1.5px), open arrowhead (two angled lines).
- **Colour:** `var(--plum)` (#552772), opacity ~0.58.
- **Size:** ~36–44px. Do not exceed 48px or the arrows will feel heavy.
- **Alternating direction:**
  - Arrows 1 & 3 curve toward the **right** (connecting left-col title to right-col title).
  - Arrows 2 & 4 curve toward the **left** (connecting right-col title to left-col title).
  - Arrow 5 curves toward the **centre/down** (from left-col title 5 toward centred CTA).
- **Float gap:** Each arrow should visually start ~12px away from the title edge and end ~12px above the next title top. Adjust `margin-top` on `.process-arrow` divs as needed after inserting the actual SVG sizes.
- **On mobile:** The `.process-col.center` column is hidden (`display: none`) — arrows are decorative only and not needed at mobile breakpoints.

---

## Summary of what's new

| Element | Value |
|---|---|
| Section background | `var(--beige-deep)` (#ebe4d9) |
| Layout | 3-column CSS grid (`1fr 60px 1fr`) |
| Steps left col | 1, 3, 5 — right-aligned text |
| Steps right col | 2, 4 — left-aligned, 100px top spacer |
| Step title font | Playfair Display 1.06rem / 400 |
| Step desc font | Poppins 0.72rem / 300 / var(--mid) |
| Step 5 colour | var(--plum) title, #7a4da0 desc |
| Gap between steps | 40px `<div>` spacer |
| CTA | Centred, 48px margin-top, existing `.btn.btn-primary` class |
| Arrows | SVG icons inserted manually in `.process-col.center` |
