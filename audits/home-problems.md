# home — Problem Analysis

- **Page:** Home (Guest Landing)
- **Route:** /ru/ (and /uz/en variants)
- **Vue file:** sotuv-markaz-frontend/pages/index.vue (118 lines)
- **Figma node:** 2129:48704 (Home Guest — 1440×4335px)
- **Backend:** localhost:8000 (DOWN — 404)
- **Analyzed:** 2026-05-14
- **Auth:** NOT_REQUIRED
- **Figma data:** CACHED

## Region-split score

| Region | Figma | Matched | Rate |
|--------|-------|---------|------|
| Overall | 8 sections | 6 rendered | ~75% |

**Status:** ACHIEVABLE_THIS_SESSION

## Summary by category

| Category | Issues found |
|----------|-------------|
| 6.1 Structural MISSING | 2 |
| 6.2 Structural EXTRA | 0 |
| 6.3 Data wiring | 0 |
| 6.4 Form fields | 0 |
| 6.5 Spacing (P30) | 0 |
| 6.6 Typography (P31) | 0 |
| 6.7 Width/max-width (P32) | 0 |
| 6.8 Borders/radius (P33) | 0 |
| 6.9 Colors | 0 |
| 6.10 Icons | 0 |
| 6.11 Empty states | 0 |
| 6.12 RECURRING_PATTERNS | 0 |
| 6.13 Code health | 1 |
| 6.14 i18n | 0 |
| 6.15 Responsive | 0 |
| 6.16 Interaction states | 0 |
| 6.17 Backend | 0 |
| **TOTAL** | **3** |

## Detailed findings

### 6.1 Structural — components in Figma not in code

| Figma section | Figma node | Status | Notes |
|---|---|---|---|
| Commercial Offers | 7060:58342 | RENDERED | `<commercial-offers />` present |
| Vacancies By Industry | 2129:48706 | RENDERED | `<vacancies-by-industry />` present |
| Vacancies By Company | 2129:48730 | RENDERED | `<vacancies-by-company />` with carousel + arrows |
| Latest Vacancies | 2129:48748 | RENDERED | `<latest-vacancies />` present |
| Download Mobile App | 2129:48865 | **MISSING** | Commented out at line 14–16; app not yet published |
| News Section | (nested) | RENDERED | `<news-section />` present |
| Why Us | (nested) | **MISSING** | Commented out at line 19 |
| Opinion Section | (nested) | RENDERED | `<opinion-section />` present |

**Finding:** 2 sections disabled (Download Mobile App, Why Us). Both intentionally commented with reasons. No visual divergence — code matches Figma in terms of which sections render.

### 6.2 Structural EXTRA — in code not in Figma

No issues found. All rendered components are in Figma.

### 6.3 Data wiring

No issues found. Page is a pure composition of section components; no direct API calls from page itself.

### 6.4 Form fields

No form fields on this page.

### 6.5 Spacing (P30)

No issues found. Page container has no direct spacing rules; spacing delegated to child section components.

### 6.6 Typography (P31)

No issues found. Page has no typography elements; all text in child sections.

### 6.7 Width / Max-Width (P32)

No issues found. Page uses full viewport width; container widths are in child sections.

### 6.8 Borders / Radius / Shadows (P33)

No issues found. Page has no border/radius rules; all visual styling in child sections.

### 6.9 Colors

No issues found. No direct color rules in page-level styles.

### 6.10 Icons

No issues found. No icons on this page.

### 6.11 Empty states

No issues found. Page always renders the same 6–8 sections.

### 6.12 RECURRING_PATTERNS check

| P-rule | Violations found | Count | Lines |
|--------|-----------------|-------|-------|
| P1/P8: ::v-deep | None | 0 | — |
| P3: Tailwind arbitrary | None | 0 | — |
| C1: Hardcoded hex | None | 0 | — |
| IM1: img no @error | None | 0 | — |
| I1: filled icons | None | 0 | — |
| S5: position absolute | None | 0 | — |
| S8: h1/h2 no margin reset | None | 0 | — |
| S7: negative margin-top | None | 0 | — |
| P31: non-px font-size | None | 0 | — |
| P31: non-numeric font-weight | None | 0 | — |
| P31: decimal line-height | None | 0 | — |

No RECURRING_PATTERNS violations found. Page has no `<style>` block.

### 6.13 Code health

| # | Issue | Severity | Detail |
|---|-------|----------|--------|
| CH-01 | No `<style>` block in page component | OK | All styling delegated to child sections (correct modular approach) |
| CH-02 | Unused imports present in `<script>` | P3 | Line 27: `QuickStats` imported but never used (commented out at L45) |
| CH-03 | SEO meta tags outdated | P3 | "Sotuv Markaz" brandin correct, but some production sites still reference "Infinity Sales" |
| CH-04 | Loading state unused | P3 | Lines 52–61: `loading` data property initialized but never used; `mounted()` sets to false immediately |

**Finding:** Minor code hygiene issues. No impact on page rendering or visual correctness.

### 6.14 i18n

No issues found. Page uses static head() meta tags; no dynamic i18n keys.

### 6.15 Responsive

No issues found. Page defers responsive behavior to child section components.

### 6.16 Interaction states

No issues found. No interactive elements on this page directly.

### 6.17 Backend

No backend issues. Page orchestrates sections which handle their own data fetching. (Backend currently offline — status = DOWN.)

## Recommended fix sequence

### Phase A — Code health
- Remove unused `QuickStats` import (L27, L45)
- Remove unused `loading` data property and `mounted()` hook (L52–61)
- Verify SEO meta tags against production requirements

### Phase B — Optional restoration (design decision)
- Uncomment `<downloading-mobile-app />` when app is published
- Uncomment `<why-us />` if section is finalized in Figma

## Files that would change

- `sotuv-markaz-frontend/pages/index.vue` (remove unused code)

## Decisions needed from Javokhir

1. Should "Download Mobile App" section stay hidden, or is it ready for release?
2. Should "Why Us" section be restored?
3. Meta tags — should we update old "Infinity Sales" references to "Sotuv Markaz"?

