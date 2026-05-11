# Design Migration Status — Sotuv Markaz Frontend
**Generated:** 2026-05-08  
**Scope:** `sotuv-markaz-frontend/` — Nuxt 2 / Vue 2 / SCSS / Bootstrap Vue  
**Total pages:** 97 (16 public, 35 worker, 46 company)  
**Source of truth:** `.visual-agent/`, `.migration-review/`, GitHub issues, git log

---

## What this migration covers

Three parallel tracks run simultaneously:

| Track | What | Method |
|-------|------|--------|
| **Token sweep** | Replace raw hex literals with SCSS variables across all 97 pages | Autonomous agent run (2026-04-19) |
| **Figma depth audit** | Section-by-section comparison of live vs Figma design values | Manual + cached audit sessions |
| **Rebrand** | "Infinity Sales" → "Sotuv Markaz" in all user-facing strings | Manual batch (2026-05-07) |

---

## Track 1 — Autonomous Token Sweep

**Run date:** 2026-04-19 00:26–01:09 UTC  
**Results file:** `.visual-agent/autonomous-progress.json`  
**Total fixes applied:** 744 raw-hex → SCSS token swaps  

### Pages — status breakdown

| Status | Count | Meaning |
|--------|-------|---------|
| `done` | 74 | Token sweep completed, page rendered correctly after |
| `broken` | 13 | Fixes applied but Playwright detected a render issue post-fix |
| `failed` | 2 | Automation aborted (page redirected during eval — auth gate) |

### Done pages (74)

home, worker-login, worker-register, worker-home, worker-search,
worker-vacancy-details, worker-profile, worker-create-resume,
worker-desk-application, worker-desk-saved, worker-desk-interview,
worker-category, news, worker-faq, company-vacancy-add, company-candidates,
worker-top-vacancy, worker-desk-suggestions, worker-faq-message,
worker-my-resume-id, worker-vacancy-category, worker-company-slug,
worker-advanced-search, calendar, company-brand, static-slug, blog-index,
blog-id, events-index, register-index, company-login, company-advanced-search,
company-candidate-id, company-desk-application, company-desk-interview,
company-desk-saved, company-faq-message, worker-account-main,
worker-account-notifications, worker-account-password, worker-password,
worker-staff, worker-services-index, worker-services-id,
worker-buy-service-index, worker-buy-service-history,
worker-profile-application, worker-my-resume-index, worker-faq-slug,
worker-faq-questions, worker-vacancy-details-index, worker-vacancy-our-vacancies,
company-account-main, company-account-notifications, company-account-password,
company-password, company-payment, company-faq-index, company-faq-slug,
company-faq-questions, company-desk-suggestions-index,
company-desk-suggestions-slug, company-tarif-index, company-tarif-bought-pocket,
company-tarif-package-services, company-tarif-purchase-history,
company-tarif-multi-profile-create, company-tarif-multi-profile-edit,
events-slug, feedback-slug, news-slug, temp

### Broken pages — need post-sweep verification (13)

| Page | Fixes applied | Notes |
|------|--------------|-------|
| `worker-vacancy` | 50 | Playwright rendered broken after sweep |
| `worker-company` | 31 | Broken post-sweep |
| `worker-vacancy-slug` | 52 | Broken post-sweep |
| `company-home` | 19 | No `<style>` in page file — section components carry styles |
| `company-index` | 0 | Redirect wall (no fixes applied) |
| `company-register` | 5 | Broken post-sweep |
| `worker-subscribe` | 6 | Broken post-sweep |
| `company-profile-index` | 31 | Broken post-sweep |
| `company-category` | 8 | Broken post-sweep |
| `company-vacancy-slug` | 26 | Broken post-sweep |
| `company-tarif-status` | 4 | Broken post-sweep |
| `company-tarif-multi-profile-index` | 6 | Broken post-sweep |
| `email-verify` | 2 | Broken post-sweep |

### Failed pages — automation could not run (2)

| Page | Error |
|------|-------|
| `company-profile-application` | `Execution context was destroyed` — page navigated during eval |
| `company-vacancy-edit-id` | Same navigation error — edit page requires auth + valid vacancy ID |

---

## Track 2 — Figma Depth Audit

Audit is tiered. Only **Tier 1 (homepage + shared chrome)** has been fully executed against Figma values. Worker and company pages have received token sweeps only.

### Tier 1 — Homepage + Header + Footer

**Figma file:** `whwt0wJFk3XFkkXNsVgqQh`  
**Audit docs:** `HOME_AUDIT.md` (2026-04-12), `.visual-agent/home-depth-audit-20260419.md` (2026-04-19), `FULL_AUDIT_REPORT.md` (2026-05-04)  
**GitHub issues filed:** 9 ([#2–#10](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues))

| # | Area | Component file | Figma node | Status | GitHub issue |
|---|------|---------------|------------|--------|--------------|
| 1 | Header | `components/Header.vue` | `2129:49045` | Partial — audited, fixes pending | [#3](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/3) open |
| 2 | Footer | `components/Footer.vue` | `270:5388` | **DONE** — all bugs resolved | [#2](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/2) open (regression) |
| 3 | Hero / MainSection | `components/sections/MainSection.vue` | `2129:49041` | Mostly done — 7 code bugs remain (C-1..C-7) | [#4](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/4) open |
| 4 | CommercialOffers | `components/sections/CommercialOffers.vue` | `7060:58342` | 95% done — 1 open decision | [#5](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/5) open |
| 5 | VacanciesByIndustry | `components/sections/VacanciesByIndustry.vue` | `2129:48706` | Not done — copy + DOM restructure needed | [#6](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/6) open |
| 6 | VacanciesByCompany | `components/sections/VacanciesByCompany.vue` | `2129:48730` | Not done — copy + brand cards blocked | [#7](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/7) open |
| 7 | LatestVacancies | `components/sections/LatestVacancies.vue` + `jobCard.vue` | `2129:48748` | Structure verified — card needs major restructure | [#8](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/8) open |
| 8 | NewsSection | `components/sections/NewsSection.vue` | `2129:48928` | **PARKED** — product decision pending | [#9](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/9) open |
| 9 | OpinionSection | `components/sections/OpinionSection.vue` | `2129:48997` | Not done — title copy + quote icon | [#10](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/10) open |
| 10 | DownloadingMobileApp | `components/sections/DownloadingMobileApp.vue` | `2129:48865` | Wired in index.vue — deep diff not done | — |

#### Footer — detailed status

All migration bugs resolved:

| Bug | Issue | Status |
|-----|-------|--------|
| BUG-01 | VK Sans Display font CDN 404 (pre-existing, not footer-specific) | Not fixable — EULA pending |
| BUG-02 | Facebook button style inconsistency | ✅ Fixed |
| BUG-03 | Column 1 heading "Infinity sales" → "Infinity Sales" | ✅ Fixed |
| BUG-04 | Divider exported as raster image | ✅ Fixed (CSS `border-top`) |
| BUG-05 | Absolute positioning for column layout | ✅ Fixed (flexbox/grid) |
| BUG-06 | "Infinity sales" casing inconsistency | ✅ Fixed |
| BUG-07 | No copyright row in Figma (regression risk) | ✅ Kept with deliberate deviation |
| BUG-08 | Twitter/Telegram `v-if` wrong condition | ✅ Fixed |

#### Hero/MainSection — remaining bugs

| Bug | File | Issue | Resolution path |
|-----|------|-------|-----------------|
| C-1 | `MainSection.vue`, `_sections.scss:4` | `background-image: var(--bg-img)` — CSS custom property violates CLAUDE.md | Apply inline via `:style` (script change needed) |
| C-2 | `MainSection.vue:6` | `v-if="bgImg && bgImg.length"` hides hero until API resolves | Remove `v-if`, always render (script change) |
| C-3 | `MainSection.vue:172-351` | Dead SCSS: `._hide`, `.redirect-link`, `.buttons`, `.buttons1` | Delete dead CSS |
| C-4 | `MainSection.vue:27,44,48,63,64` | `stroke="#189FFF"` — non-canonical color (≠ `$blue`, ≠ `$blue-light`) | Verify with Javokhir → replace with `$blue` |
| C-5 | `MainSection.vue:22` | `gap-[24px]` Tailwind arbitrary value mixed with Bootstrap utilities | Replace with scoped `gap: 24px` SCSS |
| C-6 | `_sections.scss:49` | `bottom: -35px` vs Figma implied `-40px` | Change to `bottom: -40px` |
| C-7 | `MainSection.vue:79-84` | Dead `:class` ternary (always evaluates to `''`) | Remove binding |

#### Open decisions (homepage)

| ID | Section | Question |
|----|---------|----------|
| OQ-1 | CommercialOffers | `fetchServices size: 8` vs Figma `4` — which is correct? |
| OQ-2 | NewsSection | 3 rows (News/Articles/Events) vs 1 row (4-card "Блог") — awaiting Malika |
| OQ-3 | Header | Transparent-over-hero vs always-white — JS scroll behavior needed |
| OQ-4 | VacanciesByCompany Part B | Brand-color cards need fresh `get_design_context` call before implementing |
| OQ-5 | OpinionSection Part B | Quote icon SVG needs fresh Figma MCP call |
| OQ-6 | Newsletter section | Entirely absent from `pages/index.vue`; no API endpoint exists |

### Tier 2 — Component-level migrations (.migration-review/)

These are independent per-component/page audit sessions:

| Area | Files touched | Status | Notes |
|------|--------------|--------|-------|
| `components/Footer.vue` | 1 | **DONE** | Full Figma spec extracted, all bugs resolved |
| `components/Header.vue` | 1 | **PARTIAL** | Screenshots captured; fixes pending GitHub #3 |
| Login page (`pages/worker/login.vue`) | 1 | **DONE** | Desktop + mobile screenshots, hover states, open questions logged |
| Forgot-password (`pages/login/forgot.vue`) | 1 | **DONE** | 3-step flow audited, open questions OQ-02..OQ-05 |
| Register page (`pages/register/index.vue`) | 1 | **DONE** | Token sweep + border-radius fix (`4px → 8px`) |
| Worker profile (`pages/worker/profile/index.vue`) | 1 | **DONE** | 31 token swaps, gradient migrated to tokens |
| Worker vacancy list (`pages/worker/vacancy/index.vue`) | 1 | **DONE** | 14 token swaps |
| Worker vacancy detail slug (`pages/worker/vacancy/_slug.vue`) | 1 | **DONE** | 13 token swaps, 4 non-token colors annotated |
| Worker vacancy detail page (`pages/worker/vacancy/details/_slug.vue`) | 1 | **DONE** | Figma-sync SCSS block added |
| Candidate cards (4 files) | 4 | **DONE** | Grid + list + mobile variants synced to Figma `509:36829` |
| Company home (`pages/company/index.vue` + `home.vue`) | 0 | No styles — thin wrapper, exits clean | Child section components carry all styles |

### Tier 3 — Pages NOT yet depth-audited (no Figma comparison done)

Only received token sweeps from the autonomous run. No Figma node → code diff:

- All 35 worker pages (except those in Tier 2 above)
- All 46 company pages (except `company-candidates`, `company-candidate-id`, `company-desk-*`, `company-faq-*`, `company-tarif-*`)
- Static pages
- Events pages
- Feedback pages

---

## Track 3 — Rebrand: Infinity Sales → Sotuv Markaz

**Branch:** `rebrand/sotuv-markaz`  
**Backup:** `backup/pre-rebrand-20260507`  
**Date:** 2026-05-07  
**Status:** **DONE**

### Scope executed

| Category | Files | Changes |
|----------|-------|---------|
| Page meta/SEO (`<title>`, `og:*`, description, keywords) | 13 pages | All `Infinity Sales` → `Sotuv Markaz` in `head()` strings |
| Logo `alt` attributes | 5 files | 7 occurrences |
| Visible header/footer text | 3 components | 6 occurrences |
| i18n values (`languages/ru.js`, `languages/uz.js`) | 2 files | 9 key values (keys unchanged) |
| Survey text | `SocialQuestionsCheckbox.vue`, `SocialQuestionsRadio.vue` | 2 occurrences |
| Test selector | `tests/take-header.js` | 1 occurrence |
| SCSS comment header | `assets/scss/_functions.scss` | 1 occurrence |
| Docs | `README.md`, `HOME_AUDIT.md`, `SECTION_1_HERO_SPEC.md` | Documentation only |

**Total files modified:** 28  
**Verification:** `rg -i "Infinity Sales"` returns zero hits across `*.vue *.js *.json *.scss` (excluding the rebrand audit docs themselves).

### Scope deferred (B1–B5)

Items skipped because they are code identifiers, not user-facing strings:

| Item | Examples | Reason |
|------|---------|--------|
| B1 | CSS class names (`.infinity-*`) | Would break existing selectors |
| B2 | JS variable/function names | Would break imports and usage |
| B3 | Vuex store keys | Would break state access across 20 modules |
| B4 | API URL fragments (`/infinity-sales/`) | Backend-owned |
| B5 | Package names in `package.json` | Require `yarn install` |

---

## Known Blockers (cross-cutting)

| Blocker | Impact | Owner |
|---------|--------|-------|
| VK Sans Display font CDN 404 | All pages render in Lato — typography diff on every audit screenshot | Design / legal — EULA needed |
| Hero background image API returns 404 in dev | Hero shows solid `$navy` instead of office photo | Backend — needs seed data or fallback asset |
| NewsSection layout decision | Section parked — can't merge 3 rows → 1 until decided | Malika (product call) |
| VacanciesByCompany brand cards — needs Figma MCP re-call | Issue #7 Part B blocked | Next session with MCP loaded |
| OpinionSection quote icon — needs Figma MCP re-call | Issue #10 Part B blocked | Next session with MCP loaded |
| GitHub Copilot bot not granted repo access | All 9 GitHub issues are unassigned | Javokhir to assign manually |
| OTP digit count (5 vs 6) | Login/forgot open question OQ-02 | Backend confirmation needed |
| 13 "broken" pages from autonomous run | May have visual regressions post-sweep | Needs Playwright verify pass |
| 2 pages never swept (`company-profile-application`, `company-vacancy-edit-id`) | Raw hex may remain | Needs manual token sweep |

---

## .visual-agent/ Directory Inventory

The `.visual-agent/` directory inside `sotuv-markaz-frontend/` serves as the scratch + artifact store for all automated work.

| Path | Contents | Purpose |
|------|----------|---------|
| `audit/` | 240+ JSON + PNG pairs (desktop + mobile per page) | Live page design-violation snapshots from Playwright |
| `specs/` | 44 `*-computed.json` files | Computed CSS property dumps per page |
| `autonomous-progress.json` | Run log with per-page status + fix counts | Tracks the 2026-04-19 token sweep run |
| `home-depth-audit-20260419.md` | Section-by-section Figma vs live table for homepage | Primary homepage audit doc |
| `session-report-home-20260419.md` | Commits landed, visual diff summary, backend issues | Homepage session summary |
| `backend-issues.md` | API issues found during frontend work | 5 endpoints with wrong trailing slash; empty arrays in dev |
| `fix-plans/` | batch1/2/3 results JSON, fonts.md, license.md | Planning artifacts from earlier sessions |
| `reports/` | (legacy batch reports) | Earlier automated fix batches |
| `diff-screenshots/`, `diffs/`, `screenshots/` | Before/after PNGs for individual sections | Visual evidence for audit findings |
| `specs/` | `*-computed.json` per page | CSS computed-value dumps |
| `autonomous-log/`, `autonomous-run.log` | Verbose log from the 2026-04-19 sweep | Debugging autonomous run |
| Various `*.js`, `*.py` scripts | `screenshot.js`, `audit-page.js`, `fix-img-errors.py`, etc. | Tooling for screenshot capture and diff |
| `page-list.json`, `figma-structure.json` | Page inventory + Figma structure dump | Source data for agents |
| `discovered-components.txt`, `discovered-pages.txt` | Grepped inventory | Discovery phase artifacts |

---

## Recurring Pattern Catalog (RECURRING_PATTERNS.md)

Patterns identified across the codebase for systematic future fixing:

| ID | Category | Pattern | Canonical fix |
|----|----------|---------|---------------|
| S1 | Spacing | Section padding not matching Figma vertical rhythm (drift ≤32px) | Add Figma node comment + use `88px / 48px` default rhythm |
| S2 | Spacing | Bootstrap `.row` gutter 30px vs Figma 20px in cards grids | Override `margin` / `padding` on row + cols in scoped SCSS |
| S3 | Spacing | Legacy `margin-bottom-30` class instead of Figma gap | Replace with section-scoped gap or `margin-bottom: 20px` |
| T1 | Typography | Tailwind arbitrary values mixed with Bootstrap (`gap-[24px]`, `w-[312px]`) | Replace with scoped SCSS |
| T2 | Typography | Font-weight 400 where Figma specifies 600 (subtitle/eyebrow) | Token-aligned `font-weight: 600` |
| C1 | Color | Raw `stroke="..."` SVG attributes in templates (not patchable via SCSS) | Template change required |
| C2 | Color | `rgba(118, 129, 148, 0.24)` — not direct `$grey` swap (alpha changes behavior) | Keep annotated or decide on `rgba($grey, 0.24)` |
| L1 | Layout | Figma absolute positioning translated literally → breaks on non-1440px | Always convert to flex/grid |
| L2 | Layout | `v-if` on whole section guards with API-dependent data → flash-of-absence | Render section always; show skeleton |
| B1 | Bug | `v-if="value !== 0"` — null is not 0, so always true (Twitter/Telegram pattern) | Use truthy check `v-if="value"` |

---

## What's Next (priority order)

### Immediate — unblock open issues
1. **Decide open questions:** CommercialOffers size (#5), NewsSection layout (#9) — Javokhir + Malika
2. **Fresh Figma MCP calls** for issues #7 Part B (brand cards) and #10 Part B (quote icon)
3. **Assign GitHub issues #2–#10** manually once Copilot bot granted repo access

### Short-term — fix outstanding homepage items
4. Apply GitHub issues #3 (header), #6 (VacanciesByIndustry), #7, #8, #10 — template + i18n changes
5. Fix Hero dead code bugs C-3, C-5, C-6 (CSS-only) and C-1, C-2, C-4, C-7 (need script changes)
6. Add Newsletter section (new component + `pages/index.vue` wiring)

### Medium-term — broken pages
7. Run Playwright verify pass on 13 "broken" pages from autonomous run
8. Manual token sweep for 2 failed pages (`company-profile-application`, `company-vacancy-edit-id`)

### Long-term — Tier 2 audit
9. Worker pages depth audit vs Figma (only token sweeps done so far)
10. Company pages depth audit vs Figma
11. `jobCard.vue` restructure (width 312→384, add logo, fix order, move bookmark) — blocked on LatestVacancies decision

### Blocked / external
- VK Sans Display font: EULA from VK.com
- Hero background image: backend seed data
- OTP digit count: backend confirmation
