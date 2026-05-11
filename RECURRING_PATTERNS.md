# Recurring Visual Bug Patterns — Sotuv Markaz Frontend

**Date:** 2026-05-04
**Scope:** `sotuv-markaz-frontend/` (Nuxt 2 / Vue 2 / SCSS / Bootstrap Vue / Element UI / Tailwind 2)
**Method:** Read-only audit. Sources: git history (50+ commits, branches `master`, `redesign/home-20260419`, `visual-sync-autonomous-20260419-0313`, copilot/* PRs), workspace audit docs (`SECTION_2_*.md`, `FULL_AUDIT_REPORT.md`, `SCRIPT_CHANGES.md`), `.visual-agent/home-depth-audit-20260419.md`, `.visual-agent/session-report-home-20260419.md`, and grep across `components/`.

**Canonical SCSS tokens** (from `assets/scss/_functions.scss`):

| Token | Hex | Use |
|---|---|---|
| `$dark-blue` | `#19192d` | Primary text |
| `$navy` | `#001444` | Hero overlay, dark CTAs |
| `$bg-section` | `#f5f7f9` | Page section backgrounds |
| `$grey` | `#768194` | Muted/secondary text |
| `$white` | `#fff` | — |
| `$blue` | `#0085ff` | CTA gradient start |
| `$blue-light` | `#29b2ff` | CTA gradient end |
| `$blue-link` | `#268ae7` | Links, active states, focus |
| `$green` | `#00a795` | Success / company brand |
| `$green-light` | `#76c773` | Available/active toggle state (register wizard) — lighter than `$green`, intentional |
| `$red` | `#fb2828` | Error |
| `$warning` | `#ffb547` | Warning amber |
| `$border-card` | `#eef2f9` | Card borders |
| `$border-light` | `#e2e5ea` | Light borders |
| `$border-divider` | `#edf1f5` | Dividers / inputs |
| `$btn-secondary` | `#e9eff7` | Secondary button bg |
| `$cta-gradient` | `linear-gradient(213.7deg, #0085ff 0%, #29b2ff 61.058%)` | Brand CTA |

**Canonical radii:** 8px (small/buttons), 10px (form fields per af9c7cee), 12px (medium card), 16px (image frame), 20px (large card), 50% (avatars + circular nav arrows per fd854d3a).

**Canonical font weights** (Figma): 400 / 500 / 600 / 700.

---

## CATEGORY S — Spacing / Sizing

### S1. Section padding does not match Figma vertical rhythm
- **What happens:** Section `padding-top` / `padding-bottom` set without referencing Figma. Drift up to 32px.
- **Where found:** `components/sections/CommercialOffers.vue:92` had `padding: 56px 0 64px;` vs Figma `88px / 48px` (commit `5b2eb8e8`, BUG-2 + BUG-3 in `SECTION_2_BUGS_FOUND.md`). Hero stats spacing `gap-[100px] → gap-[24px]` (commit `a1863992`).
- **Root cause:** Values copied from older mocks or invented. No section padding token.
- **Universal fix rule:** Every `<section>` SCSS rule must cite Figma node ID in a comment, e.g. `// Figma 7060:58342: 88/48`. If unknown, use `padding: 88px 0 48px` as the default home-section rhythm.
- **Check command:** `grep -nE "padding:\s*[0-9]+px\s+0\s+[0-9]+px" components/sections` then cross-check each hit against the Figma node listed in `FULL_AUDIT_REPORT.md` page table.

### S2. Bootstrap row default gutter (30px) instead of Figma 20px between cards
- **What happens:** `.row` + `col-xl-3` produces 15px gutters (30px between cards). Figma specifies 20px.
- **Where found:** `components/sections/CommercialOffers.vue:54-58` (`SECTION_2_BUGS_FOUND.md` BUG-7). Same pattern likely in `VacanciesByIndustry.vue` (uses `col-sm-6 col-lg-4 col-xl-3 item-wrap margin-bottom-30`) and `SeekersByCategory.vue:83,160`.
- **Root cause:** Bootstrap 4 grid default (15px) never overridden per section.
- **Universal fix rule:** When section-internal gap ≠ 30px, override row+col gutters in scoped SCSS:
  ```scss
  &__row { margin-left: -10px; margin-right: -10px;
    > [class*="col-"] { padding-left: 10px; padding-right: 10px; }
  }
  ```
- **Check command:** `grep -rn "class=\"row\"" components/sections` — every hit needs explicit gutter logic.

### S3. Legacy utility class `margin-bottom-30` instead of Figma value
- **What happens:** Cards in section grids use shared `.margin-bottom-30` global helper rather than per-section spacing.
- **Where found:** `components/sections/SeekersByCategory.vue:83,160`; `components/sections/VacanciesByIndustry.vue:90,524`.
- **Root cause:** Global utility class predates the design tokens; Figma has 20px row gap, not 30px.
- **Universal fix rule:** Replace `margin-bottom-30` on grid items with section-scoped gap or row-margin override matching Figma value (typically 20px).
- **Check command:** `grep -rn "margin-bottom-30\|margin-top-30" components/sections`.

### S4. `gap-[24px]` Tailwind arbitrary value where SCSS would be cleaner
- **What happens:** Tailwind arbitrary brackets used for one-off values that hide the design intent and bypass tokens.
- **Where found:** Fixed in `f6f0515a` — `MainSection.vue` `<div class="d-flex justify-content-center gap-[24px]">` → `class="menu-stats__row"` with scoped SCSS. Still present in `BusyOrNot.vue`, `Chat.vue`, `historyCard.vue`, `advertising-card.vue`, `coin-use.vue`, `jobCard.vue` (all use `gap-[Npx]`, `w-[Npx]`, `rounded-[Npx]`, `text-[#19192d]`).
- **Root cause:** Tailwind 2 enabled JIT arbitrary values site-wide; quicker than naming a class.
- **Universal fix rule:** Inside section/card components, prefer scoped SCSS class. Tailwind arbitrary brackets are forbidden for any value that appears more than once or that maps to a token.
- **Check command:** `grep -rnE "(gap|p|m|w|h|rounded|text|bg)-\[[^\]]+\]" components/sections components/cards`.

### S5. `position: absolute` translated literally from Figma instead of flow layout
- **What happens:** Figma frame uses absolute coords; engineer copies `top: 119px; left: 19px;` instead of using flex/gap.
- **Where found:** `components/cards/CompanyServiceCard.vue:74-76,99-100` (`top: -41px; left: 19px; right: 19px;` — fixed insets in `5b2eb8e8`); `components/sections/LatestVacancies.vue:311`; `components/sections/VacanciesByCompany.vue:350,404,448`; `components/sections/Freelancers.vue:391,413`; `components/sections/OpinionSection.vue:520`; `components/sections/NewsSection.vue:193`; `components/sections/WhyUs.vue:344`.
- **Root cause:** Figma MCP `get_design_context` returns absolute coords; pasted directly.
- **Universal fix rule:** `position: absolute` only for genuine overlays (badge on card, image overhang). For row/column layouts use `display: flex; flex-direction; gap`. The image-overhang pattern in CompanyServiceCard is the canonical exception.
- **Check command:** `grep -rn "position:\s*absolute" components/sections components/cards` — manually validate each.

### S6. Card image inset off by 1px (19 vs 20)
- **What happens:** Inset values 19px instead of Figma 20px.
- **Where found:** `components/cards/CompanyServiceCard.vue` (commit `5b2eb8e8` fixed 19→20). `components/cards/jobCard.vue:4` still has `px-[19px] pt-[19px] pb-[19px]`.
- **Root cause:** Off-by-one from Figma export rounding.
- **Universal fix rule:** Card padding should always be one of `8 / 12 / 16 / 20 / 24px`. Never 19/21/22.
- **Check command:** `grep -rnE "(px|pt|pb|pl|pr|left|right|top|bottom)\W*\[?(11|13|17|19|21|23|25)px" components`.

---

## CATEGORY T — Typography

### T1. Subtitle font-weight inherits 400 instead of Figma 600
- **What happens:** Section subtitle has no `font-weight` rule → inherits 400 / 500. Figma calls 600.
- **Where found:** `components/sections/CommercialOffers.vue:115-120` (BUG-5 in `SECTION_2_BUGS_FOUND.md`). Likely repeats across home sections — see `home-depth-audit-20260419.md` §1.
- **Root cause:** Subtitle styles written before Figma weight was extracted; assumption that subtitle = lighter.
- **Universal fix rule:** Always set `font-weight` explicitly on every text node. Never inherit. Allowed values: 400, 500, 600, 700.
- **Check command:** `grep -rnL "font-weight" components/sections` — files missing the property.

### T2. Subtitle font-size 14px where Figma is 16px (and similar -2px drift)
- **What happens:** Default 14px substituted for Figma 16px.
- **Where found:** `CommercialOffers.vue:117` (BUG-4); `home-depth-audit-20260419.md` lists same drift across multiple sections; hero stat label 13px → 14px (commit `a1863992`).
- **Root cause:** 14px is the Bootstrap body default; engineers use it without checking Figma.
- **Universal fix rule:** Section subtitle = 16px / 600 / `$grey`. Eyebrow = 14px / 500. Card title = 16-18px / 600. Body text = 14px / 400.
- **Check command:** `grep -rnE "font-size:\s*14px" components/sections` — verify each is body text, not subtitle.

### T3. "View all" link font-size 14px where Figma is 18px
- **What happens:** Corner section links rendered too small.
- **Where found:** `CommercialOffers.vue:122-142` (BUG-6 in `SECTION_2_BUGS_FOUND.md`).
- **Root cause:** Same default-14 reflex as T2.
- **Universal fix rule:** Section "view all" link = 18px (per cached audit) — but verify with Figma. Pair font-size with chevron icon size.
- **Check command:** `grep -rn "view\|all\|__link\|see-all" components/sections` and inspect font-size.

### T4. Hero number font-size 28px where Figma is 32px
- **What happens:** Hero stat numbers undersized; line-height 1 (no value) instead of explicit 32px.
- **Where found:** `components/sections/MainSection.vue` (commit `a1863992`: 28→32px / lh 1→32px / gap 8→10 / 4→12 / 13→14).
- **Root cause:** Initial cut from old mock.
- **Universal fix rule:** Hero stats: 32/32, label 14/16, gaps 10 + 12.
- **Check command:** Visual inspection + grep `quick__row\|menu-stats` for sizes.

### T5. VK Sans Display CDN 404 — entire site silently falls back to Lato
- **What happens:** Font CDN returns 404, all text renders in Lato. Many "typography mismatch" audit findings root-cause to this, not CSS.
- **Where found:** Every page. Documented in `session-report-home-20260419.md` §3 and `SECTION_2_OPEN_QUESTIONS.md` §13.
- **Root cause:** No EULA from dsn.vk.com; CDN URL invalid.
- **Universal fix rule:** Out of CSS scope. Until EULA: do not chase per-component font-family fixes; treat all type drift caused by metric difference as "post-EULA". Do not edit `_fonts.scss` / `$fontFamily`.
- **Check command:** Network tab → `vk-sans-display` 404 means root cause is global.

---

## CATEGORY B — Borders / Radius

### B1. Border-radius mismatch between skeleton and final card (12 vs 20)
- **What happens:** Loading skeleton uses 12px radius; rendered card uses 20px → visible jump on data load.
- **Where found:** `components/sections/CommercialOffers.vue:149-153` (BUG-8, fixed in `5b2eb8e8`).
- **Root cause:** Skeletons authored independently of cards.
- **Universal fix rule:** Skeleton must use the same `border-radius` as the component it stands in for. Reuse the SCSS variable (`$card-radius` if introduced) or repeat the literal.
- **Check command:** `grep -rn "skeleton" components/sections` — for each, diff its radius vs the wrapped card's radius.

### B2. Carousel nav arrow radius 8px instead of 50% circular
- **What happens:** Carousel arrows rectangular with 8px corners.
- **Where found:** `components/sections/VacanciesByCompany.vue:353` (commit `fd854d3a`: 8px → 50%).
- **Root cause:** Square button default carried over from `i-btn`.
- **Universal fix rule:** Round nav arrows: `border-radius: 50%; width: 44px; height: 44px;`.
- **Check command:** `grep -rnB2 "width: 44px" components/sections` — every 44×44 control on a carousel must be `border-radius: 50%`.

### B3. Form-field radius 8 vs container radius 10 — visible "chopped piece" hover
- **What happens:** Role switcher button radius 8px while its container is 10px → on hover the bg fill extends past the container edge.
- **Where found:** `assets/scss/_header.scss` (commit `af9c7cee`: 8 → 10).
- **Root cause:** Inner radius < outer radius.
- **Universal fix rule:** When nesting radii: `inner = outer - padding` OR equal. Never `inner > outer - padding`.
- **Check command:** Visual hover inspection on any nested rounded UI.

### B4. Bootstrap-default gutter creates 30px corner artifacts on bordered grids
- **What happens:** See S2 — same root.
- **Universal fix rule:** Same as S2.
- **Check command:** Same as S2.

---

## CATEGORY C — Color / Contrast

### C1. Hardcoded hex that exactly matches an SCSS variable
- **What happens:** `color: #19192d`, `color: #768194`, `color: #00a795`, `color: #268ae7`, `background: #fff`, `background: #f5f7f9` instead of `$dark-blue`, `$grey`, `$green`, `$blue-link`, `$white`, `$bg-section`.
- **Where found:**
  - `components/Chat.vue:1045,1107,1142,1145,1154,1196,1249,1257,1317,1325,1371,1377,1426` (multiple).
  - `components/CandidateMobile.vue:620,635,644,663,674,735,811,899,965`.
  - `components/Footer.vue:486,498` (`#303246`, `#404258` — these are footer-dark not in token table).
  - `components/MainSearch.vue:348,383,399,414,421,452`.
  - `components/WorkerProfileDumb.vue:411,429,447,453,496,501,552,565,567,630,638,667,689,726,730,762,836,900,928,937` (heavy).
  - `components/Modal.vue:152` (`#268ae7` → should be `$blue-link`).
  - `components/cards/CompanyServiceCard.vue:118` (`#fafbfc` — not in tokens, but recurs).
  - `components/sections/VacanciesByCompany.vue:355` (`#f5f7f9` → `$bg-section`).
- **Root cause:** Figma exports give literal hex; `_functions.scss` is not auto-imported in scoped style blocks for global components, so engineers paste hex.
- **Universal fix rule:** Any hex matching a value in the canonical token table MUST use the SCSS variable. Hex literals only allowed for one-off Figma colors not yet tokenized — and then add a `// TODO token: <hex>` comment.
- **Check command:** `grep -rnE "(color|background|background-color|border|fill|stroke):\s*#(19192d|001444|f5f7f9|768194|0085ff|29b2ff|268ae7|00a795|fb2828|ffb547|eef2f9|e2e5ea|edf1f5|e8e8e8|e9eff7)" components`.

### C2. `$blue` (#0085ff) vs `$blue-link` (#268ae7) confused
- **What happens:** Engineers reach for `$blue` (CTA solid) for link/active states where `$blue-link` is canonical, or vice versa.
- **Where found:** `WorkerProfileDumb.vue:667` uses `#268ae7` (correct token: `$blue-link`); `Modal.vue:152` same pattern. Audit risk flagged in root `CLAUDE.md` "they are NOT interchangeable".
- **Root cause:** Names too similar; CTA gradient and link blue look similar at a glance.
- **Universal fix rule:** `$blue` is ONLY for CTA gradients (`.i-btn_blue`). All links, focus rings, active form borders → `$blue-link`. CTA gradient: `linear-gradient(213.7deg, #29b2ff 0%, #0085ff 100%)`.
- **Check command:** `grep -rn "\$blue\b" components | grep -v "blue-link\|blue-light"` — every hit must be a CTA, not a link.

### C3. Login button: solid navy where Figma calls ghost outline
- **What happens:** Hero "Войти" button rendered as solid `$navy` when Figma is transparent + 1px white-60 border.
- **Where found:** `assets/scss/_header.scss:1136-1158` (commit `e6580d68`: solid → ghost).
- **Root cause:** Default `i-btn` style assumed.
- **Universal fix rule:** Buttons on dark hero overlay = ghost (transparent bg, `1px solid rgba(255,255,255,.6)`, hover `rgba(255,255,255,.1)`). Solid navy only for raised CTAs.
- **Check command:** Visual + `grep -rn "btn-login\|hero.*btn\|navy.*important" assets/scss components`.

### C4. Brand-color card treatment missing on company carousel
- **What happens:** `VacanciesByCompany` shows generic CompanyCard; Figma calls for brand-color filled top half (Texnomart yellow, TBC Bank teal, Korzinka red).
- **Where found:** `components/sections/VacanciesByCompany.vue` — flagged in `home-depth-audit-20260419.md` §3 and Issue #7 Part B.
- **Root cause:** Reuse of generic card without per-brand override.
- **Universal fix rule:** Carousel of branded entities → component must accept `:brand-color` prop, applied as `background` on top half.
- **Check command:** `grep -rn "brand\|brandColor\|company.*color" components/sections/VacanciesByCompany.vue`.

---

## CATEGORY I — Icons / SVG

### I1. Filled icons (`fill="#19192d"` etc.) where Figma calls outline
- **What happens:** Inline `<svg>` paths use `fill="#hex"` instead of `fill="none" stroke="currentColor" stroke-width="1.5"`.
- **Where found:** `components/sections/Freelancers.vue:33,67,93,151,181,241`; `components/sections/CompanyOfTheDay.vue:33,71,110,194`. Mass-fixed in commit `ca98b5cc` ("icon-stroke 634 fixes across 41 files"); known to have re-introduced bugs (commit `2ce9eedb` cleaned up duplicates).
- **Root cause:** Figma SVG export defaults to filled paths; engineers commit raw export.
- **Universal fix rule:** Inline icons must be `fill="none" stroke="currentColor" stroke-width="1.5"`. Color via parent's `color:`. Use brand colors only when Figma explicitly fills (e.g. `#76C773` for verified-check on Freelancers cards).
- **Check command:** `grep -rnE "fill=\"#[0-9a-fA-F]{3,8}\"" components` — each hit needs Figma verification.

### I2. Duplicate `stroke-width="1.5"` attributes from regex bug in autonomous fixer
- **What happens:** Up to 20 `stroke-width="1.5"` attributes on a single `<svg>` after the autonomous run, breaking compile.
- **Where found:** `pages/temp.vue` and `components/Header.vue` after commit `ca98b5cc`; cleaned in `2ce9eedb`.
- **Root cause:** `.visual-agent/autonomous-fix.js` icon-stroke regex did not dedupe `stroke-width=` attribute when re-iterating sibling paths.
- **Universal fix rule:** When scripting SVG transforms, always strip + re-add (don't append). Hand edits: each `<svg>` tag has at most one `stroke-width`.
- **Check command:** `grep -rnE "stroke-width=\"[0-9.]+\"\s+stroke-width=" components pages`.

### I3. Wrong stroke-width (1 or 2 instead of Figma 1.5)
- **What happens:** Inline icons render with stroke-width 1 (too thin) or 2 (too bold).
- **Where found:** Header.vue has 7 `stroke-width=` occurrences; `BusyOrNot.vue` has 6; `MainSearch.vue` 5. Manually verify each.
- **Root cause:** Mixed sources (Figma, Iconify, Element UI).
- **Universal fix rule:** Figma standard stroke = 1.5. Bootstrap-icons stroke = 2 — leave alone if used inside `b-icon`.
- **Check command:** `grep -rnE "stroke-width=\"(1|2|2.5|3)\"" components` (1.5 omitted intentionally).

---

## CATEGORY ASSET — Images / Loading

### IM1. `<img>` without `@error` fallback
- **What happens:** Broken backend image → ugly browser default placeholder.
- **Where found:** Mass-fixed across 91 files in commit `ca98b5cc` ("img-error-handler 91"); regression risk on every new `<img>`.
- **Root cause:** Backend dev DB returns 404s for many image fields (e.g., `bgImg[0].image_url` on hero); no front-end safety net.
- **Universal fix rule:** Every `<img>` must have `@error="$event.target.src = '/img/<placeholder>.svg'"` (or `style.display='none'`). Use a context-appropriate placeholder — `noava1.svg` is for avatars only, NOT for service / company cards (`SECTION_2_OPEN_QUESTIONS.md` §8).
- **Check command:** `grep -rn "<img" components pages | grep -v "@error\|onerror"`.

### IM2. Wrong placeholder semantically (avatar where service expected)
- **What happens:** `noava1.svg` (person silhouette) used as fallback for non-avatar images.
- **Where found:** `components/sections/CommercialOffers.vue` and `components/cards/CompanyServiceCard.vue` (per `SECTION_2_OPEN_QUESTIONS.md` §8).
- **Root cause:** Single shared placeholder asset.
- **Universal fix rule:** Three placeholders: `/img/noava1.svg` (avatar), `/img/no-image-service.svg` (service/product TBD), `/img/no-logo.svg` (company).
- **Check command:** `grep -rn "noava1" components pages`.

### IM3. Hero background-image dependent on backend, no static fallback
- **What happens:** `bgImg[0].image_url` 404s → solid `$navy` fallback, missing the office photo.
- **Where found:** `components/sections/MainSection.vue` (per `session-report-home-20260419.md` §3).
- **Root cause:** Backend-driven asset with no shipped fallback.
- **Universal fix rule:** Every backend-driven hero/banner must ship a `static/img/<name>-fallback.jpg` and use it via CSS `background-image: url(...), $navy;` cascade.
- **Check command:** `grep -rn "background-image.*url.*\$" components/sections`.

---

## CATEGORY L — Layout / Structure

### L1. Inverted eyebrow pattern (small subtitle on top, big title below)
- **What happens:** Section heads render `<span>sub</span>` (small) ABOVE `<div>title</div>` (big), inverting Figma's "title top / subtitle below" pattern.
- **Where found:** `home-depth-audit-20260419.md` §2 — `VacanciesByIndustry.vue` confirmed; suspected on `VacanciesByCompany`, `LatestVacancies`, `OpinionSection`, `NewsSection`.
- **Root cause:** Old design had eyebrow-then-title; never updated when Figma flipped.
- **Universal fix rule:** Section head = `<h2>` title FIRST, `<p>` subtitle SECOND (Figma standard). Eyebrow as separate small label only when explicit in Figma.
- **Check command:** `grep -rnB1 -A3 "section-head\|__head\|__title-wrap" components/sections`.

### L2. Card structure inverted (title above company name; logo missing)
- **What happens:** `jobCard.vue` renders title-then-company; Figma: logo top-left, company name (74px), title (110px), divider (152), salary (169), location (194), bookmark top-right.
- **Where found:** `components/cards/jobCard.vue:4` — `class="job-card bg-white cursor-pointer px-[19px] pt-[19px] pb-[19px] w-[312px] rounded-[20px]"`. Width 312 (should be 384), missing logo, inverted order, missing horizontal divider (`home-depth-audit-20260419.md` §4).
- **Root cause:** Card built before final Figma; never re-spec'd.
- **Universal fix rule:** Vacancy card slots: row 1 = logo 42×42 + bookmark 42×42; row 2 = company name 16/`$grey`; row 3 = title 16-18/600/`$dark-blue`; divider; row 4 = salary 16/`$dark-blue`; row 5 = location 14/`$grey`. Width 384 / radius 20 / padding 20.
- **Check command:** Read `jobCard.vue` template + visual diff.

### L3. Copyright row missing from Footer
- **What happens:** `<p class="footer__copyright">` block accidentally deleted from template; only restored in `edafc6ae`.
- **Where found:** `components/Footer.vue` — BUG-07 in migration-review.
- **Root cause:** Mass refactor (likely `ca98b5cc`'s 91 files) dropped non-`<img>` lines.
- **Universal fix rule:** Footer must contain copyright, year, and `footer.copyright_suffix` i18n key. Add a snapshot test or visual regression for footer.
- **Check command:** `grep -n "footer__copyright\|copyrightYears" components/Footer.vue`.

### L4. Section rendered with wrong cardinality (8 cards vs 4)
- **What happens:** API fetched `size: 8`, template renders all 8 in 4-col grid → 2 rows where Figma shows 1.
- **Where found:** `components/sections/CommercialOffers.vue:79` (`SECTION_2_BUGS_FOUND.md` BUG-1, fixed in `5b2eb8e8` to `size: 4`).
- **Root cause:** Fetch size disconnected from grid.
- **Universal fix rule:** When v-for over store data, fetch size = visible card count (or use `slice(0, N)` in template). Document the count in a comment matching Figma.
- **Check command:** `grep -rn "fetch.*size\|size:\s*[0-9]" store components/sections`.

### L5. Dead/no-op middleware that should redirect guests
- **What happens:** Auth middleware exists but doesn't redirect (commit `32eb8eea` replaced "dead-no-op auth middleware with guestHome redirect").
- **Where found:** `pages/index.vue` middleware chain.
- **Root cause:** Stub never finished.
- **Universal fix rule:** Out of pure-CSS scope but flag during audit.
- **Check command:** `grep -rn "middleware" pages | head` and inspect.

### L6. Section component used on both guest and logged-in pages without variant
- **What happens:** `CommercialOffers.vue` rendered on `pages/index.vue` AND `pages/worker/home.vue` — Figma cache only covered guest.
- **Where found:** `SECTION_2_OPEN_QUESTIONS.md` §12.
- **Root cause:** No prop-driven variant.
- **Universal fix rule:** Sections used on multiple page types should accept a variant prop and verify both Figma frames.
- **Check command:** `grep -rln "CommercialOffers\|VacanciesByIndustry\|LatestVacancies" pages`.

---

## CATEGORY H — Hover / Interaction State

### H1. Hover shadow invented (not in Figma)
- **What happens:** Cards add `box-shadow: 0 8px 24px rgba(0,0,0,0.08)` on hover; Figma never shows hover.
- **Where found:** `CompanyServiceCard.vue` hover (BUG analysis in `SECTION_2_OPEN_QUESTIONS.md` §3).
- **Root cause:** Sensible default, but unconfirmed.
- **Universal fix rule:** Document every hover treatment as either "Figma N:M" or "designer-default". When designer-default, use the shared `$card-hover-shadow` (TBD).
- **Check command:** `grep -rn ":hover" components/cards components/sections`.

### H2. Hover bg opacity too weak (.06 vs .10)
- **What happens:** Role switcher hover used 6% opacity → "chopped" feel.
- **Where found:** `assets/scss/_header.scss` (commit `af9c7cee`).
- **Root cause:** Default low value.
- **Universal fix rule:** White hover on dark = `rgba(255,255,255,0.10)`. Black hover on light = `rgba(0,0,0,0.04-0.06)`.
- **Check command:** `grep -rnE "rgba\((0|255).*0\.0[1-5]" components assets/scss`.

### H3. Missing hover on clickable card
- **What happens:** `cursor: pointer` set but no hover treatment → feels unclickable.
- **Where found:** `components/cards/jobCard.vue:4` `cursor-pointer` with no `:hover`.
- **Root cause:** Forgotten.
- **Universal fix rule:** Any element with `cursor: pointer` MUST have a `:hover` style change (color, shadow, or border).
- **Check command:** Files matching `cursor-pointer\|cursor:\s*pointer` then check absence of `:hover` in same file scope.

---

## CATEGORY i18n — Copy / Locale

### i18n1. API-driven text wrong locale ("Категории руЛ")
- **What happens:** Backend returns wrong-locale or broken text; rendered directly.
- **Where found:** `MainSection.vue` hero `bgImg[0].title` (commit `68e93f2d` switched to `$t('home.hero_tagline')`).
- **Root cause:** Backend locale handling broken; frontend trusts API.
- **Universal fix rule:** All canonical Figma copy lives in `languages/ru.js` + `uz.js` under named keys, never API-driven. API only for user-generated content.
- **Check command:** `grep -rn "title.*api\|name.*api" components/sections`.

### i18n2. Section copy doesn't match Figma (sub = "Отрасли" vs "Список активных вакансий…")
- **What happens:** Locale keys hold short stubs instead of Figma-canonical strings.
- **Where found:** `home.vacancy.title`, `home.vacancy.sub`, `home.company.sub`, `home.idea.title`, `home.idea.sub`, `home.news.title`, `home.news.sub` — all flagged in `home-depth-audit-20260419.md` §1-§6 and Issue #6, #7, #10. Partially fixed in `8330e865`.
- **Root cause:** Initial scaffolding copy never replaced.
- **Universal fix rule:** Every section title/subtitle key value must equal the Figma string for both `ru.js` and `uz.js`. Add a comment with Figma node ID above each key.
- **Check command:** Read `languages/ru.js` and diff against Figma.

---

## CATEGORY 9 — Tooling / Process

### P1. `:deep()` / `::v-deep` rejected by stylelint — non-scoped block is the working pattern
- **What happens:** Engineer adds `:deep()` to pierce child component styles; stylelint blocks the build.
- **Where found:** `components/sections/VacanciesByCompany.vue:467` has the canonical comment: `// Non-scoped to pierce child component styling without :deep() (stylelint rejects it).` Only one occurrence in `components/`.
- **Root cause:** Stylelint config in this repo rejects `:deep()` and `::v-deep`.
- **Universal fix rule:** To pierce a child component's styles, add a SECOND non-scoped `<style lang="scss">` block (no `scoped`) below the scoped block. Prefix selectors with the parent component's root class to avoid global leakage.
- **Check command:** `grep -rnE "::v-deep|:deep\(" components` — every hit is a bug.

### P2. `!important` overuse outside Bootstrap/Element UI overrides
- **What happens:** `!important` chains to win specificity battles instead of restructuring selectors.
- **Where found:** `components/Header.vue` (60 occurrences); `components/WorkerProfileDumb.vue` (31). Total 125 across 15 files.
- **Root cause:** Inability to override BV/Element UI without `!important` (legitimate); copy-paste of pattern into custom code (illegitimate).
- **Universal fix rule:** `!important` allowed ONLY when overriding `.b-` or `.el-` selectors. Anywhere else: increase specificity, scope, or extract a non-scoped block.
- **Check command:** `grep -rn "!important" components | grep -vE "\.b-|\.el-"`.

### P3. Tailwind arbitrary class hides design intent
- **What happens:** See S4. `class="text-[#19192d]"` instead of token; `w-[312px]` hardcodes Figma value in template.
- **Universal fix rule:** Same as S4.
- **Check command:** Same as S4.

### P4. Custom CSS variables (`--foo`) in SCSS-only repo
- **What happens:** Engineers introduce CSS custom properties in components.
- **Where found:** `grep "--[a-z-]+:"` returned 0 hits in `components/` — clean. Keep it that way.
- **Root cause:** N/A currently.
- **Universal fix rule:** This repo is SCSS-only. Any `--foo:` declaration in component SCSS is a bug — use SCSS variables.
- **Check command:** `grep -rnE "^\s*--[a-z][a-z0-9-]*:" components`.

### P5. Stylelint single-line declaration block violation from autonomous tooling
- **What happens:** Touch-target injection emitted `.cls { min-height: 44px; min-width: 44px; }` on one line; rule `declaration-block-single-line-max-declarations` failed.
- **Where found:** 7 files in commit `ca98b5cc`, repaired in `2ce9eedb`.
- **Root cause:** Codegen template forgot newlines.
- **Universal fix rule:** One declaration per line. Codemod templates must emit `\n  ` between declarations.
- **Check command:** `grep -rnE "\{\s*[a-z-]+:[^;}]+;\s*[a-z-]+:" components` — multi-decl single-line blocks.

### P6. Forbidden auto-edits during autonomous run
- **What happens:** Autonomous tooling could edit `font-family`, `_fonts.scss`, `_functions.scss`, `nuxt.config.js`, `store/`, `plugins/`, `middleware/`, `api/`, `i18n/`. Commit `ca98b5cc` reports zero such edits — this is the safe boundary.
- **Where found:** `.visual-agent/autonomous-fix.js` boundary checks.
- **Root cause:** Without boundary, codemods drift across the repo.
- **Universal fix rule:** Visual fixes touch `.vue` (`<template>` / `<style>`) and `assets/scss/_*.scss` ONLY. Never `_functions.scss`, `_fonts.scss`, `nuxt.config.js`, `store/`, `plugins/`, `middleware/`, `api/`, `languages/` (i18n is a separate fix-class).
- **Check command:** `git diff --stat | grep -E "(_functions|_fonts|nuxt.config|store/|plugins/|middleware/|api/)"` — must be empty for visual-only PRs.

---

## CATEGORY 10 — Backend-coupled visual bugs

### BE1. Endpoints return 301 (missing trailing slash) → empty section render
- **What happens:** 5 home endpoints 301; section shows skeleton forever or collapses.
- **Where found:** `VacanciesByIndustry`, `VacanciesByCompany`, `LatestVacancies`, `NewsSection` (per `session-report-home-20260419.md` §4).
- **Root cause:** Django URL patterns lack trailing slash.
- **Universal fix rule:** Backend fix; flag during frontend audit. Frontend should not redirect-follow silently for GET data fetches in Vuex.
- **Check command:** Network tab → 301 on `/api/<resource>` calls. (Backend repo work.)

### BE2. Section disappears entirely on empty result
- **What happens:** `<section v-if="services.length || $fetchState.pending">` removes section when API returns empty.
- **Where found:** `components/sections/CommercialOffers.vue` (`SECTION_2_OPEN_QUESTIONS.md` §2).
- **Root cause:** No empty state designed.
- **Universal fix rule:** When v-if-removing a section is intentional, document. Otherwise add empty-state component with copy.
- **Check command:** `grep -rnE "v-if=\"[a-zA-Z_.$]*\.length" components/sections`.

---

## UNIVERSAL CHECKLIST

Before committing any visual change, run through this list. Every item is grep-able or visually testable.

### Tokens & Colors
- [ ] No hex literal in `.vue` `<style>` matches a value in the canonical token table (`grep -rnE "(color|background|background-color|border|fill|stroke):\s*#(19192d|001444|f5f7f9|768194|0085ff|29b2ff|268ae7|00a795|76c773|fb2828|ffb547|eef2f9|e2e5ea|edf1f5|e8e8e8|e9eff7)" components` returns zero in changed files).
- [ ] `$blue` only used in CTA gradients; `$blue-link` for every link, focus, active form border.
- [ ] CTA gradient = `linear-gradient(213.7deg, #29b2ff 0%, #0085ff 100%)` exactly.
- [ ] No `--foo:` CSS custom property declarations in `components/` (`grep -rnE "^\s*--[a-z]" components` returns 0).

### Spacing
- [ ] Section padding cites Figma node ID in a comment, or uses canonical `padding: 88px 0 48px` for home sections.
- [ ] Card padding is one of 8 / 12 / 16 / 20 / 24px. No 19/21/22.
- [ ] No `position: absolute` introduced for what could be `flex` + `gap` (only valid for genuine overlays — badges, image overhang).
- [ ] No `gap-[Npx]` / `w-[Npx]` / `text-[#hex]` Tailwind arbitrary brackets in `components/sections/*.vue` or `components/cards/*.vue`.
- [ ] No `margin-bottom-30` global utility on grid items; per-section row gutter override used instead.
- [ ] `.row` inside a section either accepts the 30px Bootstrap default by intent, or overrides gutters to match Figma (typically 20px).
- [ ] `0` (not `0px`) for zero values.

### Typography
- [ ] Every text node has explicit `font-weight` (400 / 500 / 600 / 700). No inheritance for headings/subtitles.
- [ ] Section subtitle = 16px / 600 / `$grey` (verify per section).
- [ ] Card title = 16-18px / 600 / `$dark-blue`.
- [ ] Body text = 14px / 400.
- [ ] Hero stat number = 32px / line-height 32px; label = 14px.
- [ ] No 14px on a section subtitle or "view all" link without verification.

### Borders / Radius
- [ ] Skeleton `border-radius` matches the rendered card it stands in for (typically 20px, NOT 12px).
- [ ] Carousel nav arrows = 44×44 with `border-radius: 50%`.
- [ ] Nested radius: inner ≤ outer − padding. Form inputs inside 10px container = 10px, not 8px.
- [ ] Standard radii: 8 / 10 / 12 / 16 / 20 / 50%. No 5px, 7px, 11px.

### Icons / SVG
- [ ] Inline icons: `fill="none" stroke="currentColor" stroke-width="1.5"` (Figma standard).
- [ ] No `fill="#hex"` on icon paths unless Figma explicitly fills (e.g., verified-check `#76C773`).
- [ ] Each `<svg>` has at most one `stroke-width` attribute on each path/element (no duplicates).
- [ ] No `stroke-width="1"` or `"2"` on Figma-sourced icons (1.5 only); 2 allowed for Bootstrap icons.

### Images
- [ ] Every `<img>` has `@error` handler (`grep "<img" file | grep -v "@error"` returns 0).
- [ ] `noava1.svg` only used for avatars; service/company use service-specific or `no-logo.svg`.
- [ ] Backend-driven hero/banner has a static `static/img/...-fallback.jpg` fallback.

### Layout / Structure
- [ ] Section heads: big title FIRST, subtitle SECOND (Figma standard), eyebrow only when explicit.
- [ ] Vacancy card: logo top-left, bookmark top-right, company-then-title order, divider before salary, width 384, padding 20.
- [ ] Footer renders `<p class="footer__copyright">` with year + `footer.copyright_suffix`.
- [ ] Fetch `size` matches visible card count (or template uses `slice(0, N)`); commented with Figma reference.
- [ ] Section used on multiple page variants (guest vs worker vs company) audited against each Figma frame.

### Hover / Interaction
- [ ] Every `cursor: pointer` element has a `:hover` style change.
- [ ] White-on-dark hover bg = `rgba(255,255,255,0.10)`. Black-on-light hover bg ≤ `rgba(0,0,0,0.06)`.
- [ ] Hero buttons on dark overlay = ghost outline (transparent + white-60 border), not solid navy.
- [ ] Hover shadow reuses shared variable, not invented per-card.

### i18n
- [ ] Section title/subtitle text from `languages/ru.js` + `uz.js`, never API.
- [ ] `home.*` keys match Figma-canonical strings in BOTH locales.

### Tooling / Process
- [ ] No `:deep()` or `::v-deep` (`grep -rnE "::v-deep|:deep\(" components` = 0). Use a non-scoped second `<style>` block instead.
- [ ] No `!important` outside `.b-` / `.el-` overrides.
- [ ] One CSS declaration per line (no `{ a: 1; b: 2; }` single-liners).
- [ ] Visual-only PR diff touches only `.vue` and `assets/scss/_*.scss` — never `_functions.scss`, `_fonts.scss`, `nuxt.config.js`, `store/`, `plugins/`, `middleware/`, `api/`, `languages/`.
- [ ] Each `<svg>` has at most one of each attribute after a codemod (no duplicate `stroke-width=`).

### Backend-coupled
- [ ] No silent 301 redirects in Network tab for home-page data calls.
- [ ] Sections that v-if-remove themselves on empty results are documented or have an empty-state component.

---

# ADDENDUM — 2026-05-04 (PM live session)

Findings from a same-day live fix-session covering: header capsule wrapper alignment, search bar rebuild, language dropdown artifacts, news/blog card spacing & radius, advanced-search filter page rebuild, filter icon color.

These extend (not replace) the categories above. Each item lists the exact bug observed, the file/line, and the rule generalized for future use.

---

## S7. Negative `margin-top` on grid compensating for image overhang — bad arithmetic
- **What happens:** A `.post-grid { margin-top: -17px }` (or similar) was added to "make space for image overhang", but the math was wrong. Effective gap from section header to image top was 7px instead of Figma's ~23px.
- **Where found:** `components/sections/NewsSection.vue` `.post-grid { margin-top: -17px }` → fixed to `-1px`.
- **Root cause:** `head-bottom + head.margin-bottom + post-grid.margin-top + post-grid.padding-top - image_overhang` was computed wrong.
- **Universal fix rule:** Compute target negative margin as `figma_subtitle_to_image_gap - image_overhang`. If Figma gap = 23px and overhang = 41px, post-grid `margin-top` should be `-(41-23) = -18px`. Or simpler — set `padding-top = overhang + figma_gap` and remove negatives entirely.
- **Check command:** `grep -rnE "margin-top:\s*-[0-9]" components/sections`.

## S8. `<h1>` / `<h2>` browser-default margins inflate header→content gap
- **What happens:** Hero/section heading inherits Bootstrap reboot's `<h1>` (~21px top + bottom margin + oversized font). Spacing grows by 20–40px beyond Figma.
- **Where found:** `components/sections/MainSection.vue` hero `<h1>{{ $t('home.hero_tagline') }}</h1>` had no scoped reset; logo→stats gap was 25px wider than Figma.
- **Root cause:** Heading elements not reset in scoped styles.
- **Universal fix rule:** For every heading inside a Figma-specced layout, add `.parent h1, .parent h2, .parent h3 { margin: 0; font-size: <fig>; font-weight: <fig>; line-height: <fig>; }` in scoped styles.
- **Check command:** `grep -B2 -A4 "<h[1-3]" components/sections/*.vue` — every heading inside a `<style scoped>` should have explicit overrides.

## S9. Image-overhang cards: padding stacks (card-padding + body-padding both apply)
- **What happens:** Card uses `padding-top: 120px` (to push body below the image overhang) AND `.card__bottom { padding-top: 12px }` adds 12px more. Title sits at y=132 instead of Figma's y=119.
- **Where found:** `components/sections/NewsSection.vue` — fixed by setting `.post__bottom { padding-top: 0 }` and adjusting card padding-top to 119.
- **Root cause:** Two stacked positioning models (absolute image + flow body) with both contributing top-spacing.
- **Universal fix rule:** Pick ONE positioning model per card. Either (a) absolute body with `top: <fig-y>`, OR (b) padding-top on card with `padding-top: 0` on body. Don't combine.
- **Check command:** `grep -B1 -A8 "top:\s*-[0-9]" components/cards/*.vue components/sections/*.vue | grep -E "padding-top|^--"` — check if both card-level and body-level padding-top exist.

## S10. Card with fixed bottom row not pinned (varies with title length)
- **What happens:** Cards with shorter titles show their date/badge row higher than cards with longer titles. Bottom row is not pinned to the card bottom.
- **Where found:** `components/sections/NewsSection.vue` `.post__item` was `display: block` → `.post__meta` floated against title bottom.
- **Root cause:** Block flow cascades meta below title; if title is shorter, meta is higher.
- **Universal fix rule:** Cards with fixed bottom row → `.card { display: flex; flex-direction: column; }`, `.card__bottom { flex: 1 1 auto; display: flex; flex-direction: column; }`, `.card__meta { margin-top: auto; }`.
- **Check command:** `grep -B2 -A20 "&__bottom\|&__body" components/cards/*.vue components/sections/*.vue | grep -E "display\s*:\s*block|^--|flex"`.

## C5. `<router-link>` / `<nuxt-link>` styled as non-link inherits framework blue (`#268ae7`)
- **What happens:** A `<router-link>` wrapping a "filter" or "icon" element renders blue because default link color applies. Icon SVGs using `stroke="currentColor"` end up blue when designer wants dark.
- **Where found:** `components/MainSearch.vue` `.advanced-icon-container` (router-link) — filter icon was blue `#268ae7` instead of Figma's dark `#1c1d3d`.
- **Root cause:** Default `<a>` color cascades; `currentColor` on inner SVG inherits it.
- **Universal fix rule:** Any link styled as a non-link must have explicit `color: <intended>` AND `text-decoration: none` on default + `:hover`. If the link contains an icon using `currentColor`, this also colors the icon.
- **Check command:** `grep -nB2 -A4 "<router-link\|<nuxt-link" components/ pages/ | grep -E "class=\".*icon\|class=\".*btn\|class=\".*filter"`.

## C6. Per-category chip theming where Figma uses unified palette
- **What happens:** Code hand-rolls separate colors for `--news` (blue), `--event` (green), `--blog` (orange) chips when Figma uses a single neutral chip color across all categories.
- **Where found:** `components/sections/NewsSection.vue` `.post__chip` had 3 modifiers (`--news`, `--event`, `--blog`) — collapsed to single `bg #e8f6ff / color #189fff` per Figma.
- **Root cause:** Engineer added category theming as a "nice touch"; Figma never specified it.
- **Universal fix rule:** Don't theme by data category unless Figma explicitly shows distinct colors per category. Default to Figma's neutral chip style.
- **Check command:** `grep -rnE "&--(news|event|blog|premium|urgent|featured|sale)" components/` — each modifier should map to a Figma-specified variant.

## C7. Bootstrap-Vue `b-dropdown .dropdown-toggle` shows white bg artifact on `.show` state
- **What happens:** Clicking the language dropdown reveals a white/light-blue `#ebf1fa` rectangle behind the button while the menu is open. Not in Figma.
- **Where found:** `components/Header.vue` `.language-dropdown .dropdown-toggle` on hero header.
- **Root cause:** Framework default `.show > .btn-secondary.dropdown-toggle { background: #ebf1fa }`.
- **Universal fix rule:** When using `b-dropdown` on a colored or transparent surface, override ALL pseudo-states together: `&, &:hover, &:focus, &:active, &.show { background: transparent !important; border: none !important; box-shadow: none !important; color: <intended> !important; }`. Also `&::after { display: none }` to remove the caret if you have your own arrow icon.
- **Check command:** `grep -rn "b-dropdown\|dropdown-toggle" components/ pages/` — verify each instance has the full override.

## L5. Container max-width override per-section breaks alignment with rest of page
- **What happens:** Header had a custom `.header-main .container { max-width: 1440px; padding: 64px }` rule, making the header capsule wider than the search bar wrapper below it. Visual misalignment.
- **Where found:** `components/Header.vue:3543` `.header-signed-in, .header-main { & > .container { max-width: 1440px; ... } }`.
- **Root cause:** Header given its own container width during navigation migration without considering hero-page header's overlay alignment with content sections.
- **Universal fix rule:** Don't override `.container` rules per-section unless deliberately. If you must, scope tightly: `.header-main:not(.is-hero) > .container { ... }` so other variants inherit the global container width.
- **Check command:** `grep -rnE "\.container\s*\{[^}]*max-width" components/ assets/scss/`.

## L6. Tailwind arbitrary `bg-[#hex]` silently fails — page renders dark instead of light
- **What happens:** `<div class="bg-[#f5f7f9] page">` doesn't apply `#f5f7f9`. Page renders against the dark `<body>` bg.
- **Where found:** `pages/worker/advanced-search.vue` outer wrapper rendered dark navy instead of `#f5f7f9` light grey.
- **Root cause:** Tailwind 2 + JIT mode in this Nuxt 2 setup is unreliable for arbitrary brackets; some classes generate, some don't.
- **Universal fix rule:** Don't trust Tailwind arbitrary brackets for any layout-critical or visually-critical value (`bg-[#hex]`, `gap-[Npx]`, `w-[Npx]`, `h-[Npx]`, `rounded-[Npx]`). Use scoped SCSS instead. Tailwind utility classes (`flex items-center text-white`) are fine.
- **Check command:** `grep -rnE "class=.*\[#[0-9a-fA-F]{3,7}\]|class=.*\[[0-9]+px\]" components/ pages/`.

## P7. Empty section with no fallback when backend facet data is missing
- **What happens:** Filter section's "Отрасль" stayed empty because `state.vacancy.facet._filter_category` was missing/404 in dev. Section appeared broken.
- **Where found:** `pages/worker/advanced-search.vue` `getAllFilters()` only populated from facet — fixed by seeding from `state.category.select_category` first, then merging facet counts when available.
- **Root cause:** Frontend logic assumed facet always present; no fallback.
- **Universal fix rule:** When a section depends on backend facet data that may be missing, seed the visible options from the most authoritative non-facet source first, then merge facet counts when available. Section should never render empty due to missing optional data.
- **Check command:** `grep -rnE "facet\._filter|_filter_" components/ pages/` — verify each has a fallback path.

## P8. `:deep()` and `::v-deep` both rejected by stylelint in this repo
- **What happens:** Adding `::v-deep .child` triggers `selector-pseudo-element-no-unknown`. Replacing with `:deep(.child)` triggers a similar rule. Both fail compile, page renders dark with stylelint error overlay.
- **Where found:** Live session: `components/MainSearch.vue` `.advanced-icon-container :deep(.advanced-icon svg)` — removed entirely; styled the wrapper class `.advanced-icon` directly.
- **Root cause:** stylelint config rejects both. Vue 2 deprecated `::v-deep`, repo predates `:deep()`.
- **Universal fix rule:** Don't use `:deep()` or `::v-deep` in scoped styles in this codebase. Either:
  1. Style the wrapper class (which IS scoped) — its descendants get the styles via cascade
  2. Use a separate non-scoped `<style lang="scss">` block (no `scoped`) with a high-specificity selector prefixed by the parent component's root class (already documented in P1)
- **Check command:** `grep -rnE "::v-deep|:deep\(" components/ pages/`.

---

## ADDENDUM SUMMARY

8 new patterns from today's PM session, all consistent with categories 1–9 above:

| Pattern | Category | Severity |
|---|---|---|
| S7 — Negative margin-top math wrong | Spacing | High |
| S8 — `<h1>`/`<h2>` default margins inflate spacing | Spacing | High |
| S9 — Image-overhang card padding stacks | Spacing | Medium |
| S10 — Bottom row of card not pinned | Spacing/Layout | High |
| C5 — Link color inherited into styled-as-non-link element | Color | Medium |
| C6 — Per-category chip theming vs Figma unified | Color | Low-Medium |
| C7 — `b-dropdown .show` state white bg artifact | Framework Override | Medium |
| L5 — Container max-width per-section breaks alignment | Layout | High |
| L6 — Tailwind arbitrary `bg-[#hex]` silent fail | Framework / Layout | High |
| P7 — Empty section on missing facet | Data | Medium |
| P8 — `:deep()` / `::v-deep` both stylelint-rejected | Tooling | Medium |

(11 entries, 10 new patterns + 1 confirmation of P1.)

These extend the Universal Checklist:

### Spacing (additions)
- [ ] No `<h1>`/`<h2>` inside a section without an explicit `margin: 0` reset.
- [ ] Image-overhang cards: only ONE place sets the body's vertical position (either card padding-top OR body's absolute top, not both).
- [ ] Cards with a fixed bottom row use `flex-direction: column` + `flex: 1 1 auto` on body + `margin-top: auto` on the bottom row.
- [ ] Negative `margin-top` compensating for image overhang has the math written in a comment: `// = figma_gap (23) - image_overhang (41) = -18px`.

### Color (additions)
- [ ] `<router-link>`/`<nuxt-link>` styled as non-link has explicit `color:` AND `text-decoration: none` on both default + `:hover`.
- [ ] Chips/badges use the Figma-specified single color, not per-category theming, unless Figma explicitly shows variants.
- [ ] Every `b-dropdown .dropdown-toggle` in scoped styles overrides `&, &:hover, &:focus, &:active, &.show` together with `background: transparent !important`, and `&::after { display: none }` if a custom caret is present.

### Layout (additions)
- [ ] No `.container { max-width }` override that's broader-scoped than necessary; use `:not(.modifier)` to scope tightly.
- [ ] No Tailwind arbitrary `bg-[#hex]`, `gap-[Npx]`, `w-[Npx]`, `rounded-[Npx]` for layout/visual-critical values — scoped SCSS only.

### Data (additions)
- [ ] Sections depending on backend facet data have a fallback seed from a more authoritative source.

### Tooling (confirmations)
- [ ] No `:deep()` AND no `::v-deep` in scoped styles. Style the wrapper class or use a non-scoped second `<style>` block.

---

# ADDENDUM 2 — 2026-05-04 PM (visual-fix-agent session)

Findings from a 2026-05-04 PM session covering: login button (Header `.btn-login`), CommercialOffers section, VacanciesByIndustry section, VacanciesByCompany section. These confirm and extend earlier patterns.

## I4. CSS `path { fill }` rule overrides SVG `fill="none"` attribute on outline icons
- **What happens:** SVG declares `<path fill="none" stroke="currentColor">` so only the stroke shows. But a CSS rule like `.btn-login path { fill: $white !important }` (originally written for the OLD filled icon) silently keeps overriding → outline icon renders as a filled blob. CSS specificity beats SVG presentation attributes.
- **Where found:** `assets/scss/_header.scss .header-main.is-hero .btn-login path { fill: $white !important }` was filling the new outline arrow→door icon (this session). Same risk every time a filled icon is migrated to outline anywhere.
- **Root cause:** When swapping a filled icon for an outline icon, the SCSS sibling rule for fill/stroke was written for the old icon and never updated.
- **Universal fix rule:** When migrating filled → outline, run `grep -rE "path\s*\{[^}]*fill" assets/scss/ components/` and update every match. For outline icons: `path { fill: none; stroke: $color; }`.

## T6. Lato fallback (BUG-08) renders DemiBold heavier than Figma
- **What happens:** Figma DemiBold (600) renders correctly in Figma with VK Sans Display, but VK Sans Display CDN returns 404 → Lato fallback. Lato 600 is visually heavier than VK Sans Display DemiBold → live page text looks ~10% bolder than design.
- **Where found:** Login button "Войти" (this session: 600 → 500 to match visual). Same applies to all DemiBold text on prominent UI surfaces.
- **Universal fix rule:** When Figma shows DemiBold (600) on prominent UI text and live looks too heavy, drop weight by 100 (600 → 500) and comment: `// 500 to compensate for Lato fallback (BUG-08)`.

## I5. Stroke-width 1.5 is project default but Figma `Linear / Arrows /*` icons use 1.4
- **What happens:** Project codebase default = `stroke-width="1.5"`. Figma "Linear / Arrows / Alt Arrow Right", "Logout", and similar arrow primitives ship with `stroke-width="1.4"`.
- **Where found:** This session updated chevrons in CommercialOffers, VacanciesByIndustry, VacanciesByCompany (1.5 → 1.4).
- **Universal fix rule:** Default outline icon = 1.5. **Arrow primitives from Figma "Linear / Arrows /*" namespace = 1.4.** Always check the source SVG's `stroke-width=` attribute when fetching from Figma MCP.

## C8. "View all" link color varies per Figma section (dark vs grey)
- **What happens:** Global `.section-head .link-to { color: $dark-blue }` is wrong for some sections. Figma node `2129:48741` (Companies "Все компании") uses grey `#768194`.
- **Where found:** This session scoped `.vacancies-by-company :deep(.link-to) { color: $grey; gap: 4px }` to override the global default. Same per-section verification needed for OpinionSection, NewsSection, LatestVacancies.
- **Universal fix rule:** For every section, capture the "View all" link's `color:` from Figma. If it differs from `$dark-blue`, add a scoped override.

## S11. Carousel arrows position: outside cards (-64) vs against cards (-22)
- **What happens:** Carousel nav arrows positioned 22px outside cards. Figma puts them in the page-margin region, ~60–80px outside.
- **Where found:** `VacanciesByCompany.vue` (this session: -22 → -64 desktop, fallback -22 below 1280px viewport).
- **Universal fix rule:** Carousel arrows = `left/right: -64px` desktop, `-22px` below 1280px (avoid clipping), hide `<768px`.

## R5. Carousel arrows are 8px square-rounded with 1.6px border, NOT circles (corrects B2)
- **What happens:** Earlier B2 implied 50% circular as the canonical. Re-verified Figma node `2129:48743`: nav arrows are 44×44 with `border-radius: 8px` and `border: 1.6px solid #f5f7f9`. NOT circles.
- **Where found:** This session: `VacanciesByCompany.vue` `.vbc-nav { border-radius: 50% → 8px; border: 1.6px solid $bg-section }`.
- **Universal fix rule:** Carousel nav arrows = `width: 44px; height: 44px; border-radius: 8px; border: 1.6px solid $bg-section; background: $white;`. **B2 in main categories should be re-read with this correction in mind.**

## IM4. Logo fallback as colored block + initial text vs simple placeholder image
- **What happens:** When `item.avatar_url` is null, fallback rendered as colored bg + first character of name → looks like text content baked into the image.
- **Where found:** `VacanciesByCompany.vue` had `.vbc-card__logo-initial` (this session: removed in favor of always-`<img>` with `/img/noava1.svg` error fallback).
- **Universal fix rule:** Always `<img :src="item.avatar_url || '/img/noava1.svg'" @error="$event.target.src = '/img/noava1.svg'">`. Never CSS-rendered colored block + text initial.

## ADDENDUM 2 SUMMARY

7 new/refined patterns:

| Pattern | Category | Severity |
|---|---|---|
| I4 — `path { fill }` overrides SVG `fill="none"` on outline icons | Icons | High |
| T6 — Lato fallback heavier; 600 → 500 compensation | Typography | Medium |
| I5 — Arrow chevrons use 1.4 stroke (not 1.5) | Icons | Medium |
| C8 — "View all" link color varies per Figma section | Color | Medium |
| S11 — Carousel arrows at -64px (not -22px) | Spacing/Layout | Medium |
| R5 — Carousel arrows 8px square-rounded (corrects B2) | Borders | Medium |
| IM4 — Logo fallback as text vs placeholder image | Image | Medium |

### Universal Checklist additions (Addendum 2)

#### Icons
- [ ] **I4** When migrating filled → outline icons, also update `path { fill: ... }` CSS rules (`grep -rE "path\s*\{[^}]*fill" assets/scss/ components/`).
- [ ] **I5** Chevron / "Linear / Arrows /*" icons use `stroke-width="1.4"`. Other outline icons remain at 1.5.

#### Typography
- [ ] **T6** When Figma DemiBold (600) renders too heavy under Lato, drop to 500 with reason comment.

#### Color
- [ ] **C8** "View all" link color verified per-section against Figma (Companies = `$grey`, others usually `$dark-blue`).

#### Spacing/Layout
- [ ] **S11** Carousel arrows positioned `-64px` outside cards desktop, `-22px` below 1280px viewport.

#### Borders (correction)
- [ ] **R5** Carousel arrows = 8px square-rounded with 1.6px `$bg-section` border (NOT 50% circle).

#### Image
- [ ] **IM4** Logo/avatar `<img>` falls back to `/img/noava1.svg`, never to CSS-rendered text initial.

## P25: Layout strategy (block-first, absolute as last resort)

Figma uses absolute positioning everywhere because designers work that way.
The frontend must NOT mirror this. Order of preference:
1. Flexbox (90% of cases)
2. CSS Grid (galleries, tables, complex layouts)
3. Block + margin (simple stacking)
4. position: absolute — ONLY when 1–3 cannot achieve the layout

When you encounter `position: absolute` in Figma export:
- Re-derive the layout using flex/grid first
- Use absolute only for: tooltips, dropdowns, badges-on-images, decorative overlays

## P26: Exact spacing — never approximate

Spacing values from Figma must be exact, not rounded.
- Header button gap: read Figma value, apply exact px (e.g. 12px not "around 12px")
- Card internal padding: exact px on each side
- Stack gap: exact px

If Figma shows two buttons with 12px between them, the CSS is exactly:
gap: 12px (or margin-right: 12px on the first one)

Round only when Figma value is fractional (e.g. 11.5px → 12px).
Never round whole numbers (12px → 16px to "match the scale" is WRONG).

The spacing scale (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80) is a guideline
for new design — for migration, follow Figma exactly.

## P27: Icon assets — download from Figma

Icons that cannot be replicated as code (multi-color, complex paths, brand
glyphs) must be downloaded from Figma and committed to static/img/icons/.

Workflow:
1. get_design_context returns the icon as image export (CDN URL)
2. Download the SVG/PNG to static/img/icons/{descriptive-name}.svg
3. Replace the inline SVG in the Vue file with <img src="/static/img/icons/...">
4. Commit the asset file alongside the Vue change

CDN URLs expire in 7 days — download immediately, do not link.

Icons that CAN be replicated as code:
- Single-color outline icons → use stroke="currentColor"
- Standard shapes (chevron, plus, x, search) → inline SVG with current pattern

## P28: Script and backend changes — size-gated

Small script changes (allowed without asking):
- Adding a class binding (e.g. :class="{ active: isActive }")
- Renaming a CSS class reference in template
- Toggling an existing flag/prop
- Adding a missing v-if/v-show wrapper for layout
- Importing an existing component

Big script changes (STOP and ask Javokhir):
- New computed property or watcher
- New Vuex action/mutation
- New API call
- Refactoring component lifecycle
- Adding new props or emits
- Logic in mounted/created/destroyed

Small backend changes (allowed without asking):
- Adding a missing field to an existing serializer
- Updating a string value in seed data
- Adding a missing translation key

Big backend changes (STOP and ask Javokhir):
- New model or migration
- New endpoint
- Permission/auth changes
- Database schema changes
- Anything touching multiple apps

Log every script/backend change to SCRIPT_CHANGES.md or BACKEND_CHANGES.md.

---

# ADDENDUM 3 — 2026-05-08 (worker-profile audit session)

## C1 — New instances in `pages/worker/account/main.vue`
- Lines 482/489: `stroke="#268ae7"` on "+" add-social button SVG — fixed to `stroke="currentColor"`
- Lines 665/666: `fill="#268ae7"` + `stroke="#268ae7"` on pen/edit icon in phone-change modal — fixed to `fill="currentColor"` + `stroke="currentColor"`
- Pattern: C1 violations appear in modal SVGs that were written independently from the main template. Modal SVG icons are a recurring blind spot for the grep sweeps because they're deeply nested.

## P29: Verify Figma node mapping before starting audit
- **What happens:** `page-list.json` entry points to wrong code file. `worker-profile → 2129:52692` maps to "General informations" (account settings form) but queue entry listed `pages/worker/profile/index.vue` (resume editor). The correct file is `pages/worker/account/main.vue`.
- **Where found:** 2026-05-08, worker-profile audit. Discovered because Figma screenshot showed Ф.И.О./Пол/Регион form while code had О себе/Опыт sections.
- **Universal fix rule:** At STEP_1 of every page audit, confirm the Figma frame name and compare it to the page's actual visible title in the browser. If they don't match, check sibling pages before proceeding. Update `page-list.json` if the mapping is wrong.
- **Check command:** Compare `Figma frame name` vs `<h1>` text in code. If mismatch, search for the correct code file via `grep -rl "$frame_title_key" pages/`.