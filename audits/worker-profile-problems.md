# Page Problem Audit: worker-profile

**Page:** Worker Profile  
**Route:** `/ru/worker/profile`  
**Vue file:** `sotuv-markaz-frontend/pages/worker/profile/index.vue` (5703 lines)  
**Figma node:** `2129:56453` ("Profile", 1440×2062px — Соискатель page)  
**Audit date:** 2026-05-10  
**Audited by:** Claude Code (Page Problem Analyzer v2)

> **P29 NOTE:** `sotuv-markaz-frontend/.visual-agent/page-list.json` has WRONG Figma node for
> `worker-profile` (`2129:52692` maps to "General informations" → `account/main.vue`).
> Correct node confirmed from `figma_cache/mapping.json`. File must be updated.

---

## Match Score

| Area | Figma components | In code | Score |
|------|-----------------|---------|-------|
| Left sidebar | 6 | 1.5 | **25%** |
| Right panel (sections) | 8 | 8 | **100%** |
| Right panel (inputs/controls) | 3 | 2 | **67%** |
| Social Media section | 1 | 0 | **0%** |
| **Overall** | **18** | **11.5** | **64%** |

---

## Category 1 — Structural Divergences from Figma

Figma node `2129:56453` sidebar has 6 distinct blocks. Code has 1 component (`<ProfileEdit>`) + email card.

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| S-01 | **"Статус продвижения"** promotion status card (timer badge + "Получить статус" button) — in Figma sidebar frame `2129:56455`, entirely absent from code | P2 | Missing |
| S-02 | **"Составить профиль"** completeness progress bar (45%) — in Figma sidebar frame `7078:34934`, absent from code | P2 | Missing |
| S-03 | **"Skills IQ"** widget — in Figma sidebar, absent from code (backend `src/salesiq/` is placeholder only) | P3 | Missing |
| S-04 | **"Открыт к предложениям"** toggle — in Figma as standalone sidebar card (`2129:56459`); in code buried inside `<ProfileEdit>` prop with no visual parity | P2 | `ProfileEdit.vue` |
| S-05 | **"Создать для резюме"** sidebar card (Figma frame `7060:57708`) — absent from code | P3 | Missing |
| S-06 | **Social Media section** — `WorkerProfileSerializer` returns `socials[]` field, but NO social media section exists anywhere in the profile page template | P2 | `index.vue` |
| S-07 | **Profession input field** — Figma right panel has "Профессия/ключевые слова" input; `Worker.position` is **commented out** in backend model | P2 | BE blocker |
| S-08 | **Figma shows compact section rows** (each with "Добавить" CTA); code renders fully expanded inline sections. Empty-state matches Figma; filled state is undocumented in Figma | P3 | `index.vue` |
| S-09 | Page has `.profile__cards` 3-column grid block (CSS defined at L5211) — NOT present in Figma "Profile" frame | P3 | `index.vue:5211` |

---

## Category 2 — Data / API Mismatches

| # | Issue | Severity | Detail |
|---|-------|----------|--------|
| D-01 | `Worker.position` commented out in model — Figma right panel has profession input | P2 | `backend/src/worker/models.py` |
| D-02 | `WorkerProfileSerializer` returns `socials` but profile page never renders social links | P2 | `serializers.py:504` |
| D-03 | `WorkerDetailSerializer.Meta.fields` lists `district` and `region` twice each (lines 401–402) | P3 | `serializers.py:388–418` |
| D-04 | `fetchLisence` dispatch — typo in action name (missing `c`); if renamed in store this silently breaks | P3 | `index.vue:4260` |
| D-05 | `profile/fetchSkills` fetches ALL skills for autocomplete; `res.data.results` is paginated but no pagination handling in template | P3 | `index.vue:4252–4256` |

---

## Category 3 — Forms

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| F-01 | About me textarea: no visible `maxlength` attribute in template; backend `about_me` field max_length not verified in UI | P3 | `index.vue:~L219` |
| F-02 | Date pickers use `<b-calendar>` (Bootstrap Vue default) — heavy component, Figma shows simple select inputs | P3 | Experience/Education modals |
| F-03 | `checkMonthEnd` validator references `siblings.working` — property name diverges from Vuelidate sibling access pattern | P3 | `index.vue:4213` |
| F-04 | `<!-- :class="{ _error: $v.form_3.freelancer.$anyError }" -->` — commented-out Vuelidate error binding; if rule exists it silently never shows | P3 | `index.vue:3657` |
| F-05 | PRO-locked portfolio `@click` handler uses string literal `'return true'` instead of `null`/no-op — JS evaluates string as truthy, does nothing, but is misleading | P2 | `index.vue:4182` |

---

## Category 4 — Atoms / Reusable Components

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| A-01 | Delete button SVG (red trash + red background `rect`) inlined verbatim at 5 locations (L239, L1287, L1509, L3295, L4071) — not extracted into atom | P3 | `index.vue` |
| A-02 | `.empty-section` pattern (icon + click-to-add text) inlined in every section (×8) — should be `<empty-section-row>` atom | P3 | `index.vue` |
| A-03 | PRO-lock info icon SVG (circle with `i`) inlined at L3686 and L3702 — appears twice for same UI state | P3 | `index.vue:3686` |

---

## Category 5 — Spacing Violations (S-rules from RECURRING_PATTERNS.md)

All below violate rule **P3** (Tailwind arbitrary classes) and **S5** (non-8-grid values).

| # | Class | Value | Line(s) | Issue |
|---|-------|-------|---------|-------|
| SP-01 | `mt-28px` | 28px (off-grid) | 56 | Should be 24px or 32px |
| SP-02 | `mb-13px` | 13px (off-grid) | Multiple | Should be 12px or 16px |
| SP-03 | `mr-11px` | 11px (off-grid) | 230, 1278, 1500, 3286 | Should be 12px |
| SP-04 | `mr-13px` | 13px (off-grid) | 3684 | Should be 12px or 16px |
| SP-05 | `p-5px` | 5px (off-grid) | 3526 | Non-standard padding |
| SP-06 | `bottom-13px` `left-10px` | Off-grid positioning | 320 | Non-standard absolute offsets |
| SP-07 | `w-105px` `min-w-105px` | 105px | 4038 | Non-standard fixed width |
| SP-08 | `.modals` padding `32px 28px 28px` | 28px (off-grid) | 5440 | Should be 24px or 32px |
| SP-09 | `margin-right-12` | Custom non-Tailwind utility class in template | 3526 | Not from design system |

---

## Category 6 — Typography Violations (T-rules)

| # | Issue | Severity | Line(s) | Pattern |
|---|-------|----------|---------|---------|
| TY-01 | `text-10px` — arbitrary font-size below 12px minimum | P2 | 320 | T3/P3 |
| TY-02 | `text-11px` — arbitrary sub-minimum font-size | P2 | 4053 | T3/P3 |
| TY-03 | `<h1>` used as section header for О себе, Опыт, Навыки, Образование, Сертификаты, Водительские права, Иностранные языки, Фрилансер, Портфолио (9 `<h1>` tags inside content) — semantic misuse, browser adds default 2em top/bottom margin inflating spacing | P2 | 219, 399, 1267, 1489, 2354, 3116, 3273, 3646, 3676 | T6/S8 |
| TY-04 | `leading-120pct` `leading-130` — Tailwind arbitrary line-heights (non-standard format) | P3 | 4048, 4053 | P3 |
| TY-05 | `.profile__about_footer__title { font-size: 18px }` — section titles 18px vs Figma (need verify with filled Figma state) | P3 | 5302 | T1 |

---

## Category 7 — Color Violations (C-rules)

All below violate rule **C1** (no hardcoded hex where SCSS token exists).

### `pages/worker/profile/index.vue`

| # | Hex | Should be | Occurrences | Lines |
|---|-----|-----------|-------------|-------|
| C-01 | `#F1B747` | `$amber` | 1 | 68 (PRO badge fill) |
| C-02 | `#FF4E4E` | `$red` | 6 fills/strokes | 239, 1287, 1509, 3295, 4083–4112 |
| C-03 | `#E2EBFB` | No token exists | 1 | 1413 (skill tag background) |
| C-04 | `#D1D5D9` | No token exists | 1 | 3697 (disabled plus icon) |
| C-05 | `#E2E5EA` | No token exists | 1 | 3713 (PRO-lock circle border) |

### `components/sections/ProfileEdit.vue`

| # | Hex | Should be | Occurrences | Lines |
|---|-----|-----------|-------------|-------|
| C-06 | `#F1B747` | `$amber` | 1 | 27 (PRO badge rect fill) |
| C-07 | `#4CAF50` | No token (external green) | 1 | 82 (verified badge fill) |
| C-08 | `#76C773` | No token | 1 | 454 (checkbox fill) |
| C-09 | `#268ae7` | `$blue-link` | 11 strokes | 147, 154, 187, 194, 201, 208, 231, 254, 329, 336, 343 |
| C-10 | `#268ae7` | `$blue-link` | 5 fills | 260, 264, 268, 272, 276 |
| C-11 | `#768194` | `$grey` | 4 strokes | 535, 542, 570, 577 |
| C-12 | `#FF4E4E` | `$red` | 1 | 381 (delete stroke) |
| C-13 | `#D1D5D9` | No token | 1 | 399 (unavailable icon) |

**Total C1 violations: 34 instances across 2 files.**

> `#E2EBFB`, `#D1D5D9`, `#E2E5EA`, `#4CAF50`, `#76C773` have no matching SCSS token — token may need to be added or SVG colors corrected.

---

## Category 8 — Icons / Images

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| I-01 | Delete trash SVG in portfolio loop renders with hardcoded `fill="#FF4E4E"` — no `currentColor` | P2 | `index.vue:4071–4116` |
| I-02 | Info circle SVG (PRO lock) uses `fill="#D1D5D9"` — does not respond to color context | P3 | `index.vue:3697` |
| I-03 | PRO badge SVG in `ProfileEdit.vue` uses `fill="#F1B747"` rect — not `currentColor` or token | P2 | `ProfileEdit.vue:27` |
| I-04 | Verified check circle: `fill="#4CAF50"` is a Material Design green, not Sotuv Markaz `$green` (`#00a795`) | P2 | `ProfileEdit.vue:82` |
| I-05 | All edit/pencil SVGs use `stroke="currentColor"` ✓ | OK | Various |
| I-06 | Profile `<img>` has `@error="$event.target.style.opacity=0"` handler ✓ | OK | `ProfileEdit.vue` |

---

## Category 9 — Empty States

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| E-01 | `.empty-section { border-radius: 6px }` — non-canonical (spec: inputs 8px) | P2 | `index.vue:5402` |
| E-02 | `.dropdown-menu { border-radius: 6px }` — non-canonical | P2 | `index.vue:5333` |
| E-03 | `.b-form-file input { border-radius: 6px }` and `label { border-radius: 6px }` — non-canonical | P2 | `index.vue:5508, 5515` |
| E-04 | PRO-locked portfolio empty state uses two separate v-if branches showing near-identical "Добавить" UI — DRY violation | P3 | `index.vue:3961–3973` |
| E-05 | Empty state for portfolio PRO-locked: add icon changes from 16×16 to 10×10 based on status — inconsistent icon sizing strategy | P3 | `index.vue:3912–3957` |

---

## Category 10 — Recurring Patterns Checklist

| Pattern ID | Name | Status | Finding |
|------------|------|--------|---------|
| P1 | No `::v-deep` outside scoped | PASS | None found |
| P2 | `!important` only for BV/EUI | PASS | Used correctly |
| P3 | No Tailwind arbitrary classes | **FAIL** | 12+ instances (`mt-28px`, `mb-13px`, `mr-11px`, `text-10px`, `text-11px`, `p-5px`, `w-105px`, `leading-120pct`, `leading-130`, etc.) |
| P4 | No CSS custom properties | PASS | None found |
| P5 | SCSS tokens for all hex colors | **FAIL** | 34 C1 violations |
| P6 | `img` has `@error` handler | PASS | `ProfileEdit.vue` avatar ✓ |
| P7 | `jobCard.vue` width not changed | N/A | Not used in this page |
| P8 | No `:deep()` in .scss files | PASS | None found |
| P25 | No hardcoded SVG hex | **FAIL** | See Category 7 |
| P29 | Figma node verified | **FAIL** | `page-list.json` has wrong node `2129:52692`; correct is `2129:56453` |

---

## Category 11 — Code Health

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| CH-01 | **5703-line single file** — all 8 profile sections in one Vue file; modals, form logic, all styles in one component | P2 | `index.vue` |
| CH-02 | **500-line non-scoped `<style>` block** (L5164–5662) — global CSS that can bleed into other pages | P2 | `index.vue:5164` |
| CH-03 | **`skilss` typo** — used consistently as variable name (`this.skilss.tags`, `$bvModal.show('profile_skilss')`, class `.skilss`) — a pervasive typo but consistent; changing would require search-replace | P3 | `index.vue` throughout |
| CH-04 | **`fetchLisence`** — typo in Vuex dispatch name (missing `c`); requires matching store action name to fix | P3 | `index.vue:4260` |
| CH-05 | Commented-out Vuelidate binding left in template | P3 | `index.vue:3657` |
| CH-06 | `isBetweenDates` validator (L4217) doesn't show why it failed — no specific error message key | P3 | `index.vue:4217` |
| CH-07 | `margin-right-12` used as a utility class in template (`class="... margin-right-12"`) — defined somewhere in global SCSS, not Tailwind; mixing CSS utility conventions | P3 | `index.vue:3526` |

---

## Category 12 — i18n

| # | Issue | Severity | Detail |
|---|-------|----------|--------|
| i18n-01 | `$t('freeland.licenses')` used for **Сертификаты** section header (line 2359) — key value is `'Лицензии и сертификаты'` which is correct, but key is under `freeland` namespace (confusing; should be under `add` or `certificate`) | P3 | `index.vue:2359` |
| i18n-02 | `$t('freeland.add')` used for Portfolio submit button (line 3864) — key from wrong namespace | P3 | `index.vue:3864` |
| i18n-03 | No missing key errors detected — all `$t()` references map to existing ru.js keys | OK | — |
| i18n-04 | Section headers use `$t('add.skills')`, `$t('add.portfolio')`, etc. consistently ✓ | OK | — |

---

## Category 13 — Responsive

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| R-01 | `sm:!p-0` Tailwind responsive + `!important` override — P3 and P2 violation combined | P2 | `index.vue:56` |
| R-02 | `@media (max-width: 565px)` — non-standard breakpoint (Tailwind `sm`=640px, Bootstrap `md`=768px) | P2 | `index.vue:5193, 5271` |
| R-03 | `@media (max-width: 550px)` — another non-standard breakpoint in same file | P2 | `index.vue:5615, 5631` |
| R-04 | Three overlapping breakpoints used in same file: 550px, 565px, 768px — no consistent breakpoint system | P2 | `index.vue` styles |
| R-05 | Sidebar `col-md-3` + content `col-md-9` grid collapses correctly on mobile, but sidebar components that exist in Figma (status card, progress bar) won't stack properly since they don't exist in code | P3 | `index.vue:~L42` |

---

## Category 14 — Interactions / Hover States

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| INT-01 | Portfolio delete button (red trash SVG) has no `:hover` or transition effect | P3 | `index.vue:4071` |
| INT-02 | PRO-locked portfolio click handler uses string `'return true'` as else-branch — evaluates to no-op but is misleading | P2 | `index.vue:4182` |
| INT-03 | `.profile__cards_item:hover` has `box-shadow: 0 4px 12px 0 rgba(0,0,0,0.08)` — correct pattern ✓ | OK | `index.vue:5259` |
| INT-04 | Edit pencil link (`nuxt-link to="/worker/account/main"`) in `ProfileEdit.vue` navigates away from the profile page — correct UX | OK | `ProfileEdit.vue` |
| INT-05 | `freelancer` toggle is `v-model` on checkbox, PATCH sent via watcher — no loading/error state shown to user | P3 | `index.vue:script` |

---

## Category 15 — Backend Issues

| # | Issue | Severity | Location |
|---|-------|----------|----------|
| BE-01 | `Worker.position` field **commented out** in model — Figma right panel "Профессия/ключевые слова" input has no backend field to save to | P2 | `backend/src/worker/models.py` |
| BE-02 | `WorkerDetailSerializer.Meta.fields` lists `district` and `region` twice each — DRF ignores duplicates but indicates copy-paste error | P3 | `backend/src/worker/serializers.py:388` |
| BE-03 | `WorkerProfileSerializer` returns `socials` field but profile page has no UI for it | P2 | `backend/src/worker/serializers.py:472` |
| BE-04 | SalesIQ app (`src/salesiq/`) is a placeholder — "Skills IQ" widget in Figma sidebar sidebar is not implementable until backend is built | P3 | `backend/src/salesiq/` |
| BE-05 | `WorkerProfileSerializer` does not return `user_id` or `more_info` (those are in `WorkerDetailSerializer` only) — if company view embeds this page it will be missing contact info | P3 | `serializers.py:463` |

---

## Summary: Top Priorities

### Fix immediately (P2 blockers)
1. **`page-list.json` wrong Figma node** — update `2129:52692` → `2129:56453` for `worker-profile`
2. **Social Media section missing** — `socials` returned by API, no UI to manage it
3. **Sidebar components missing** — Status promo, profile completeness bar, open-to-work toggle (standalone)
4. **34 C1 color violations** — `ProfileEdit.vue` alone has 13 hardcoded hex in SVG attributes
5. **`<h1>` semantic misuse** — 9 section headers using `<h1>`, add `margin: 0` override or convert to `<h2>`/`<p>`
6. **4 × `border-radius: 6px`** — should be 8px everywhere (`.empty-section`, dropdown, file inputs)
7. **`text-10px` / `text-11px`** — below 12px minimum; need Figma-verified values
8. **Non-standard breakpoints** — 550px and 565px mixed with Bootstrap's 768px

### Fix soon (P3 quality)
9. **12+ Tailwind arbitrary classes** — convert to SCSS variables or 8-grid Tailwind classes
10. **5703-line file** — split profile sections into child components (one per section)
11. **500-line global style block** — scope or move to shared partial
12. **`skilss` typo** — pervasive but fixable with search-replace
13. **`fetchLisence` typo** — fix in both dispatch call and Vuex store action name
14. **`freeland.licenses` i18n key** — rename to `add.certificates` or `certificate.section_title`
15. **Delete button atom** — extract repeated red trash SVG into `<DeleteButton>` atom

### Backend required (block on Javokhir)
16. **`Worker.position`** — uncomment field + migration + Figma-confirmed label ("Профессия")
17. **SalesIQ** — Skills IQ widget blocked until `src/salesiq/` is implemented

---

*Total problems found: 68 across 15 categories*  
*Critical (P2): 28 | Quality (P3): 40*
