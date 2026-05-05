# Section 2 — Commercial Offers · Open Questions

Audit date: **2026-05-04** · Component: `components/sections/CommercialOffers.vue`

---

## 0. Blocker — fresh Figma access

The live Figma MCP is permission-denied this session (`This figma file could not be accessed`). All Figma values in `SECTION_2_SPEC.md` come from the cached audit `sotuv-markaz-frontend/.visual-agent/home-depth-audit-20260419.md` dated **2026-04-19** (16 days old). Many properties (line-heights, hover states, loading states, responsive breakpoints, exact gaps inside cards) were never measured in that pass and are marked `❓` in the spec table.

**Decision needed:** Should we (a) proceed to implementation against the cached audit values now, or (b) wait until Figma MCP access is restored and re-extract all `❓` values? Path (b) is safer; path (a) risks shipping fixes that don't match the current Figma source-of-truth.

---

## 1. Loading skeleton — Figma never shows it

The current code uses a separate `<template #loading>` branch that shows 4 grey blocks at `height: 225px; border-radius: 12px; margin-top: 41px`.

Open questions:
- Figma file does not show a loading state at all (cache confirms only a single rendered state).
- The skeleton border-radius is `12px` while the rendered card is `20px` — should these match?
- Should the skeleton mimic the card's image-overhang structure (image block on top, body on bottom) instead of being a flat grey rectangle?

**Recommendation:** align skeleton radius with card radius (20px). Keep skeleton flat — overhang structure is overkill. Confirm with Malika.

---

## 2. Empty state — section disappears entirely

`<section v-if="services.length || $fetchState.pending">` — if the API returns zero services and the fetch resolved, the entire section is removed from the DOM. Figma does not show an empty state.

Open questions:
- Is silent removal intentional, or should there be an "empty" placeholder ("Скоро здесь появятся предложения" or similar)?
- If silent removal is fine, the layout shift between page-with-section and page-without-section affects every consuming page (`/`, `/worker/home`).

**Recommendation:** keep `v-if` but document the behavior. No design needed unless empty results are common.

---

## 3. Card hover state

Code adds `box-shadow: 0 8px 24px rgba(0,0,0,0.08)` on hover. Figma cache does not document a hover state for these cards.

Open questions:
- Is a shadow specified anywhere in Figma we can verify?
- If no hover treatment is specified, should we keep the current shadow, drop it, or use a different lift (border color change, scale)?

**Recommendation:** keep current hover shadow (sensible default). Re-verify against Figma when MCP access returns.

---

## 4. Card width: fixed 283px vs responsive `col-xl-3`

Figma specifies card width = `283px`. Current code uses Bootstrap `col-xl-3` which gives ~270px at 1140px container. At wider viewports the card scales up.

Open questions:
- Should the card be locked to 283px (using `max-width` on the column), matching Figma exactly?
- Or is responsive scaling acceptable, since the entire site uses Bootstrap grid?

**Recommendation:** keep responsive grid. 283px is Figma's mockup size, not a brand constraint.

---

## 5. Card image inset: 19px (code) vs 20px (Figma)

`__img-wrap` and `__body` use `left: 19px; right: 19px`. Figma spec is 20px. 1px difference is within tolerance.

**Recommendation:** harmonize to `20px` if we're already touching this file for other fixes; otherwise leave.

---

## 6. Inter-card gap: Bootstrap gutter (~30px) vs Figma 20px

`commercial-offers__row` uses default Bootstrap `.row` gutters (15px each side = 30px between cards). Figma spec: 20px.

Open questions:
- Override gutters on this section only (e.g., `g-3` Bootstrap 5 utility — but this is BV4)? Or use SCSS `margin: 0 -10px` + per-col `padding: 0 10px`?
- Same question applies to other home sections (VacanciesByIndustry, NewsSection) — gutter consistency across sections matters.

**Recommendation:** if we tighten gutters here, document and propagate to sibling sections in a single batch.

---

## 7. Fetch size 8 vs visible 4

Vuex action: `fetchServices({ size: 8 })`. Renders all 8 in the loop. With `col-xl-3` (4 columns) → 8 services renders as 2 rows on xl screens. Figma shows 1 row of 4.

Open questions:
- Is the second row intentional (more inventory)?
- Or should `size: 4`?
- If 8, should we add a horizontal scroller / paginate / `slice(0, 4)`?

**Recommendation:** confirm with Malika. This is a content/UX decision, not a CSS one. Logged as BUG-1 (Major) in `SECTION_2_BUGS_FOUND.md` because the layout is visibly broken without a decision.

---

## 8. Image error / placeholder behavior

Code:
- On `<img>` error: `$event.target.src = '/img/noava1.svg'` (replaces with avatar placeholder)
- On `image_url` missing: renders `<div class="--placeholder">` (grey block)

Figma: no error or empty image state captured.

Open questions:
- Is `noava1.svg` (a person silhouette) appropriate for a commercial-offer image, or should we use a service-specific placeholder?
- Same question for the company logo's empty state (currently `noava1.svg`).

**Recommendation:** create a service-specific placeholder. `noava1.svg` is wrong semantically.

---

## 9. Subtitle font weight: 400 (code) vs 600 (Figma)

Code has no `font-weight` rule on `__subtitle` → inherits `500` from body or `400` default. Figma cache says `600` (DemiBold).

Open questions:
- A 600-weight subtitle is unusual (subtitles are typically lighter than the title). Could the cached value be a Figma anomaly or designer error?
- Compare to other home-section subtitles — are they all 600 in Figma, or is this section unique?

**Recommendation:** verify with a fresh Figma MCP pass on at least 3 home-section subtitles before committing to 600.

---

## 10. "View all" link size: 14px (code) vs 18px (Figma cache)

Cache says the link is `18px`. Code uses `14px`. An 18px link is large for a top-right "view all" — typically these are 14px.

Open questions:
- Is the cached value correct? An 18px link in the corner would be visually heavy.
- Is the chevron icon also 18×18 (which the code has) or larger?

**Recommendation:** verify with fresh Figma access. If 18px is correct, also re-evaluate the chevron sizing.

---

## 11. Company-name color in card

Code: `$grey` (`#768194`). Figma cache did not explicitly call out this color (only listed body-block as ✅ at the structural level).

Open questions:
- Is the company name supposed to be muted ($grey) or primary ($dark-blue)?
- Pattern across the site varies — some cards put company name at full strength, some muted.

**Recommendation:** verify with fresh Figma. Likely $grey (typical secondary metadata pattern) but not confirmed.

---

## 12. Cross-page consistency

`CommercialOffers.vue` is used on both `pages/index.vue` (guest home) and `pages/worker/home.vue` (logged-in worker home). The Figma audit only covered the guest home frame (`2129:48704`).

Open questions:
- Does the worker-home frame show this section identically, or with variations (different size, different copy, different fetch params)?
- Should `worker/home.vue` use a different component or pass props (e.g., `:size="6"`)?

**Recommendation:** screenshot the section on both pages once dev server is running; compare. If different, parameterize the component.

---

## 13. VK Sans Display font

The site uses VK Sans Display by declaration but the CDN returns 404 (per `CLAUDE.md` §8 "Known frontend bugs"). All text in this section actually renders in Lato.

Open questions:
- Is this a Section-2 concern, or a global one?

**Recommendation:** out of scope for this audit. Already tracked in `docs/bugs/known-frontend-bugs.md`.
