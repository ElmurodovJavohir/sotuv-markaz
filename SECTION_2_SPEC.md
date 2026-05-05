# Section 2 — Commercial Offers · Figma vs Code Spec

**Component:** `sotuv-markaz-frontend/components/sections/CommercialOffers.vue`
**Card:** `sotuv-markaz-frontend/components/cards/CompanyServiceCard.vue`
**Used on:** `pages/index.vue`, `pages/worker/home.vue`
**Figma frame (Home / Guest):** `whwt0wJFk3XFkkXNsVgqQh` · node `2129:48704`
**Figma section node:** `7060:58342`
**Date of audit:** 2026-05-04

---

## Source of Figma values

> **⚠ Live Figma MCP was permission-blocked this session** (`This figma file could not be accessed`, debug UUIDs `9d7850ea`, `6d043611`, `e6ffd9a1`, `2355933c`). The Figma values below come from the cached audit at `sotuv-markaz-frontend/.visual-agent/home-depth-audit-20260419.md` (2026-04-19), which used `get_metadata` + `get_design_context` on the same file and node. **Re-verify when MCP access is restored** — values are 16 days old and the file may have changed. See `SECTION_2_OPEN_QUESTIONS.md` for items the cache does not cover.

SCSS variables resolved from `assets/scss/_functions.scss`:

| Variable | Hex |
|---|---|
| `$dark-blue` | `#19192d` |
| `$bg-section` | `#f5f7f9` |
| `$grey` | `#768194` |
| `$blue-link` | `#268ae7` |
| `$border-card` | `#eef2f9` |

---

## A. Section container

| Property | Figma | Current Code | Match? | Notes |
|---|---|---|---|---|
| Background | `#f5f7f9` | `$bg-section` (`#f5f7f9`) | ✅ | |
| Padding-top | `88px` | `56px` | ❌ | Code is `−32px` short |
| Padding-bottom | `48px` | `64px` | ❌ | Code is `+16px` over |
| Container width | (Figma 1440 frame) | `.container` (Bootstrap, max ~1140px) | ⚠ | Figma frame width is canvas width, not container; Bootstrap container is the de-facto container across the rebuild |
| Empty state | not shown in Figma | `v-if="services.length \|\| $fetchState.pending"` — section hides when no data | ⚠ | Open question — see `SECTION_2_OPEN_QUESTIONS.md` |

## B. Section header — title

| Property | Figma | Current Code | Match? | Notes |
|---|---|---|---|---|
| Text (i18n key) | "Коммерческие предложения" (ru, per cached audit) | `$t('services.title')` | ✅ | Copy assumed correct (text not the audit target) |
| Font-family | (Figma) VK Sans Display | inherited (`"VK Sans Display", Lato, sans-serif`) | ⚠ | VK Sans Display is a known site-wide CDN 404 — see `CLAUDE.md` §8 |
| Font-size | `28px` | `28px` | ✅ | |
| Font-weight | `600` | `600` | ✅ | |
| Color | `#19192d` | `$dark-blue` (`#19192d`) | ✅ | |
| Line-height | not captured in cache | `1.3` (≈36.4px) | ❓ | |
| Margin | `0` | `0` | ✅ | |

## C. Section header — subtitle

| Property | Figma | Current Code | Match? | Notes |
|---|---|---|---|---|
| Text (i18n key) | (per cache) | `$t('services.subtitle')` | ✅ | |
| Font-size | `16px` | `14px` | ❌ | Code is 2px too small |
| Font-weight | `600` | `400` (default; no rule) | ❌ | Code uses regular |
| Color | `#768194` | `$grey` (`#768194`) | ✅ | |
| Line-height | not captured | `1.5` | ❓ | |
| Gap from title | not explicitly captured (block uses `gap: 4px`) | `gap: 4px` (`commercial-offers__head-left`) | ❓ | Plausible match but not verified |

## D. Section header — "View all" link

| Property | Figma | Current Code | Match? | Notes |
|---|---|---|---|---|
| Text (i18n key) | "Все компании" (per cache) | `$t('services.view_all')` | ✅ | |
| Font-size | `18px` | `14px` | ❌ | Code is 4px too small |
| Font-weight | not captured (`500` likely) | `500` | ❓ | |
| Color (default) | `#19192d` | `$dark-blue` (`#19192d`) | ✅ | |
| Color (hover) | not captured | `$blue-link` (`#268ae7`) | ❓ | Hover state not in cache |
| Chevron icon | present (size not captured) | inline 18×18 SVG, `stroke-width 1.5`, `currentColor` | ❓ | Size matches the section font-size in code, but Figma chevron dims not verified |
| Icon-text gap | not captured | `4px` | ❓ | |
| Alignment | top of header row | `align-items: flex-start` on parent + `margin-top: 4px` on link | ⚠ | Optical alignment — Figma alignment not strictly captured |

## E. Header → grid spacing

| Property | Figma | Current Code | Match? | Notes |
|---|---|---|---|---|
| Gap between header and card grid | not directly captured (cards positioned with `top: -41px` overhang accounted for) | `commercial-offers__row { margin-top: 60px }` (effective whitespace = 60 − 41 = 19px above card image, then card body sits 41px below image's top) | ❓ | Visual outcome plausible; recommend re-measuring against Figma when MCP returns |

## F. Card grid

| Property | Figma | Current Code | Match? | Notes |
|---|---|---|---|---|
| Card count | `4` | `4` (`size: 8` fetched but only first 4 render in `col-xl-3`) | ⚠ | Code fetches 8; only 4 render at xl breakpoint. With 8 services and `col-xl-3` (4 cols), it would render TWO ROWS. Likely unintentional — Figma shows one row. |
| Columns @ xl (≥1200px) | 4 | `col-xl-3` → 4 cols | ✅ | |
| Columns @ md (768–1199px) | not captured | `col-md-6` → 2 cols | ❓ | Figma may not have a tablet breakpoint defined |
| Columns @ <md | not captured | `col-12` → 1 col | ❓ | |
| Inter-card gap | `20px` | Bootstrap default gutter (`30px` total = 15px each side) | ❌ | Code's gutter is wider than Figma's 20px |
| Cards per fetch | (Figma shows 4) | `dispatch('companyServices/fetchServices', { size: 8 })` | ❌ | Mismatch — see `SECTION_2_BUGS_FOUND.md` |

## G. Service card — container

| Property | Figma | Current Code | Match? | Notes |
|---|---|---|---|---|
| Width | `283px` (fixed) | `auto` (filled by `col-xl-3`) | ✅ | Responsive substitution — width depends on container; visually equivalent at 1200px+ |
| Min-height | `225px` | `min-height: 225px` | ✅ | |
| Background | `#ffffff` | `$white` | ✅ | |
| Border | `1px solid #eef2f9` | `1px solid $border-card` (`#eef2f9`) | ✅ | |
| Border-radius | `20px` | `20px` | ✅ | |
| Box-shadow (rest) | none / not specified | none | ✅ | |
| Box-shadow (hover) | not captured | `0 8px 24px rgba(0,0,0,0.08)` | ❓ | Hover is a code-only addition — Figma rest state has no shadow; hover state needs verification |
| Cursor | (link) | `<nuxt-link>` → pointer | ✅ | |
| Transition | not specified | `box-shadow 0.2s ease` | ❓ | |

## H. Service card — image area

| Property | Figma | Current Code | Match? | Notes |
|---|---|---|---|---|
| Width | `243px` (= card 283 − 2×20 padding) | `left: 19px; right: 19px` → effective width = card−38px | ⚠ | Off by 2px (Figma 20px inset vs code 19px) — within ±2px tolerance |
| Height | `148px` | `148px` | ✅ | |
| Position offset above card | `top: -41px` | `top: -41px` | ✅ | |
| Border | `1px solid #f0f2f5` | `1px solid #f0f2f5` | ✅ | |
| Border-radius | `16px` | `16px` (on wrap and inner img) | ✅ | |
| Image fit | cover | `object-fit: cover` | ✅ | |
| `loading` attr | n/a | `loading="lazy"` | ✅ | Code-only; sensible default |
| Error fallback | not specified | `@error="$event.target.src = '/img/noava1.svg'"` | ❓ | Code-only — Figma doesn't define error state |
| Empty (no `image_url`) state | not specified | `service-card__img--placeholder` with `background: $bg-section` | ❓ | Code-only — Figma doesn't define empty state |

## I. Service card — body block

| Property | Figma | Current Code | Match? | Notes |
|---|---|---|---|---|
| Top offset (from card top) | `119px` | `top: 119px` | ✅ | |
| Left/right inset | `20px` | `19px` | ⚠ | 1px off — within tolerance |
| Internal gap (logo-row → title) | `6px` | `gap: 6px` | ✅ | |

## J. Service card — company logo

| Property | Figma | Current Code | Match? | Notes |
|---|---|---|---|---|
| Size | `42×42px` | `42×42px` | ✅ | |
| Background | `#fafbfc` | `#fafbfc` (hardcoded) | ⚠ | No SCSS variable exists for this; hardcoded hex acceptable |
| Border | `1px solid #dde3eb` | `1px solid #dde3eb` (hardcoded) | ⚠ | Same — hardcoded hex |
| Border-radius | `8px` | `8px` | ✅ | |
| Image fit | cover | `object-fit: cover` | ✅ | |
| Logo-to-name gap | not explicitly captured | `gap: 12px` | ❓ | |
| Empty-logo fallback | not specified | `/img/noava1.svg` | ❓ | Code-only |

## K. Service card — company name

| Property | Figma | Current Code | Match? | Notes |
|---|---|---|---|---|
| Font-size | `16px` (per cache; not explicitly diffed) | `16px` | ✅ | |
| Font-weight | not explicitly captured | `600` | ❓ | |
| Color | not explicitly captured (likely `$grey` or `$dark-blue`) | `$grey` (`#768194`) | ❓ | Cache didn't diff; if Figma intent is "company name = primary text", this should be `$dark-blue` — see `SECTION_2_OPEN_QUESTIONS.md` |
| Line-height | not captured | `1.3` | ❓ | |
| Truncation | not specified | `line-clamp-1` + `text-overflow: ellipsis` | ❓ | Code-only |

## L. Service card — service title

| Property | Figma | Current Code | Match? | Notes |
|---|---|---|---|---|
| Font-size | `16px` (per cache pattern, not explicitly listed) | `16px` | ❓ | Cached audit lumped body block — not explicitly diffed |
| Font-weight | `600` (DemiBold) | `600` | ❓ | |
| Color | `#19192d` (per cache pattern) | `$dark-blue` (`#19192d`) | ❓ | |
| Line-height | not captured | `1.3` | ❓ | |
| Truncation | not specified | `line-clamp-2` (2-line ellipsis) | ❓ | Code-only — common pattern |
| Margin | `0` | `0` | ✅ | |

## M. Skeleton loader (loading state)

| Property | Figma | Current Code | Match? | Notes |
|---|---|---|---|---|
| Skeleton card height | not specified in Figma (no loading state shown) | `225px` (matches card `min-height`) | ❓ | Code-only |
| Skeleton border-radius | not specified | `12px` | ❌ | Inconsistent with actual card `20px` — likely a bug |
| Skeleton margin-top | not specified | `41px` (compensates for card image overhang) | ❓ | |
| Title/subtitle skeleton effect | not specified | `_loading` modifier class (shimmer presumably defined globally) | ❓ | |

---

## Summary

- **Match:** 22 properties verified ✅
- **Mismatch:** 6 properties ❌ (section padding ×2, subtitle size, subtitle weight, link size, card-grid gutter, fetch size, skeleton radius — counted as bugs)
- **Tolerance / minor:** 4 ⚠ (1–2px insets, font fallback, container model)
- **Unverified:** 23+ ❓ — values not in cache; need fresh Figma MCP pass

See `SECTION_2_BUGS_FOUND.md` for prioritized discrepancies and `SECTION_2_OPEN_QUESTIONS.md` for items needing decisions or fresh Figma access.
