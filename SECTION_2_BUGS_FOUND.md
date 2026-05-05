# Section 2 — Commercial Offers · Bugs Found

Audit date: **2026-05-04** · Component: `components/sections/CommercialOffers.vue`, `components/cards/CompanyServiceCard.vue`

> Severity legend: 🔴 Major (wrong layout / missing element / broken structure) · 🟡 Medium (wrong spacing, color, font size) · 🟢 Minor (≤2px / 1-shade tolerance)

> **All Figma values reference the cached audit at `.visual-agent/home-depth-audit-20260419.md` (2026-04-19)** — live Figma MCP was permission-denied this session. Re-confirm before implementation.

---

## 🔴 BUG-1 — Fetch size 8 produces second card row not in design

- **File:** `components/sections/CommercialOffers.vue:79`
- **Code:** `await this.$store.dispatch('companyServices/fetchServices', { size: 8 })`
- **Figma:** 1 row of 4 cards
- **Live:** with 8 services in store, `v-for` renders 8 cards × `col-xl-3` = 2 rows of 4
- **Why it matters:** the section visually has 8 cards on xl viewports — design only ever specified 4. This silently doubles the section's vertical footprint and changes the home-page rhythm.
- **Fix candidates:** (a) `size: 4`, or (b) `services.slice(0, 4)` in the v-for, or (c) confirm with Malika that 2 rows is intended (and update Figma).
- **Decision needed before fix.**

---

## 🟡 BUG-2 — Section padding-top is 32px short

- **File:** `components/sections/CommercialOffers.vue:92`
- **Code:** `padding: 56px 0 64px;`
- **Figma:** `padding-top: 88px`
- **Diff:** −32px above the section
- **Fix:** `padding: 88px 0 48px;`

## 🟡 BUG-3 — Section padding-bottom is 16px over

- **File:** `components/sections/CommercialOffers.vue:92`
- **Code:** `padding: 56px 0 64px;`
- **Figma:** `padding-bottom: 48px`
- **Diff:** +16px below the section
- **Fix:** combined with BUG-2 → `padding: 88px 0 48px;`

## 🟡 BUG-4 — Subtitle font-size is 14px (Figma 16px)

- **File:** `components/sections/CommercialOffers.vue:117`
- **Code:** `.commercial-offers__subtitle { font-size: 14px; ... }`
- **Figma:** `16px`
- **Diff:** −2px
- **Fix:** `font-size: 16px;`

## 🟡 BUG-5 — Subtitle font-weight is 400 (Figma 600)

- **File:** `components/sections/CommercialOffers.vue:115-120`
- **Code:** no `font-weight` rule → inherits regular (`400`)
- **Figma:** `600`
- **Note:** A 600-weight subtitle is unusual. Recommend re-verifying with fresh Figma access (see `SECTION_2_OPEN_QUESTIONS.md` §9) before applying.
- **Fix (if confirmed):** add `font-weight: 600;`

## 🟡 BUG-6 — "View all" link font-size is 14px (Figma 18px)

- **File:** `components/sections/CommercialOffers.vue:122-142`
- **Code:** `.commercial-offers__link { font-size: 14px; ... }`
- **Figma:** `18px`
- **Diff:** −4px
- **Note:** 18px is large for a corner link — re-verify with fresh Figma access. If confirmed, the chevron sizing (currently 18×18) should also be revisited.
- **Fix (if confirmed):** `font-size: 18px;` and consider chevron size.

## 🟡 BUG-7 — Inter-card gap uses Bootstrap default (~30px) instead of Figma 20px

- **File:** `components/sections/CommercialOffers.vue:54-58` (relies on `.row` default gutter)
- **Code:** Bootstrap 4 `.row` → `15px` gutter each side → `30px` total between cards
- **Figma:** `20px` between cards
- **Diff:** +10px
- **Fix:** Override row+col gutters within section, e.g.
  ```scss
  &__row {
    margin-left: -10px;
    margin-right: -10px;
    > [class*="col-"] { padding-left: 10px; padding-right: 10px; }
  }
  ```
- **Caveat:** check that no other home section needs the same override (consistency).

## 🟡 BUG-8 — Skeleton border-radius 12px doesn't match card 20px

- **File:** `components/sections/CommercialOffers.vue:149-153`
- **Code:** `.service-card-skeleton { border-radius: 12px; ... }`
- **Live card:** `border-radius: 20px`
- **Why it matters:** a 12→20 jump on render is visible (skeleton corners are tighter than the eventual card). Figma has no loading state, so this is a self-consistency bug, not a Figma diff.
- **Fix:** `border-radius: 20px;`

---

## 🟢 BUG-9 — Card image inset 19px (Figma 20px)

- **Files:** `components/cards/CompanyServiceCard.vue:74-76, 99-100`
- **Code:** `left: 19px; right: 19px;` (on both `__img-wrap` and `__body`)
- **Figma:** card padding `20px` → image width `283 − 40 = 243px`
- **Diff:** 1px each side
- **Within tolerance** but easy to harmonize:
  ```scss
  &__img-wrap, &__body { left: 20px; right: 20px; }
  ```

---

## ⚠ Suspect — needs Figma verification before classification

The following are *probably* bugs but the cached audit didn't measure them precisely. Listed for awareness, not yet for fix:

- **Card hover shadow** — Figma rest state has none; hover state was never captured. Code adds `0 8px 24px rgba(0,0,0,0.08)` on hover. Could be correct, could be invented.
- **Company-name color in card** — code uses `$grey`. Cache didn't diff. If Figma intent is primary text, this should be `$dark-blue`.
- **Title/subtitle line-heights** — code uses `1.3` / `1.5`. Figma absolute values not captured.
- **Worker-home variant** — section also rendered on `pages/worker/home.vue` (logged-in). Figma frame may differ from `2129:48704`.
- **VK Sans Display** — site-wide CDN 404 means everything in this section currently renders in Lato. Tracked elsewhere; not a Section-2-specific bug.

---

## Recommended fix batches

**Batch 1 — safe wins (no design call needed):**
- BUG-2 + BUG-3: section padding `88px 0 48px`
- BUG-4: subtitle 14→16
- BUG-8: skeleton radius 12→20
- BUG-9: card insets 19→20

**Batch 2 — pending Figma re-verification:**
- BUG-5: subtitle weight 400→600
- BUG-6: link size 14→18
- BUG-7: card gutter 30→20

**Batch 3 — pending product decision:**
- BUG-1: fetch size 8 vs visible 4

All in `<style scoped>` of two files. No `<script>` or template changes. ~10 LOC total.
