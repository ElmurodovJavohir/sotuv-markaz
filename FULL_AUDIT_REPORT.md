# Full Design Audit Report
**Date:** 2026-05-04
**Branch:** `audit/homepage-design-review-20260504`
**Auditor:** Claude Code (Opus 4.7) — autonomous session
**Scope (Tier 1, per Javokhir):** Homepage 8 sections + Header + Footer

---

## Methodology

This audit ran without re-calling Figma MCP. The frontend repo already contained
three layered cached audits totaling ~1,200 lines of extracted Figma values:

| Cached audit | Date | Coverage |
|---|---|---|
| `sotuv-markaz-frontend/HOME_AUDIT.md` | 2026-04-12 | All 12 sections, shallow diff |
| `sotuv-markaz-frontend/.visual-agent/home-depth-audit-20260419.md` | 2026-04-19 | All 8 sections, deep values |
| `sotuv-markaz-frontend/.migration-review/footer/{FIGMA_SPEC,BUGS_FOUND}.md` | 2026-04-21 | Footer, fully resolved |
| `sotuv-markaz-frontend/.migration-review/home/SECTION_1_HERO_SPEC.md` | 2026-04-22 | Hero, deep |
| `SECTION_2_{SPEC,BUGS_FOUND,OPEN_QUESTIONS}.md` (workspace root) | 2026-05-04 | CommercialOffers, deep |

For each Tier 1 area I:
1. Read source files (`components/sections/*.vue`, `Header.vue`, `Footer.vue`).
2. Cross-referenced cached Figma values against current source.
3. Decided inline-fix vs GitHub issue.
4. Filed grouped GitHub issues per component (one per logical group), with exact before/after code.

---

## Pages Audited

| # | Area | Route | Figma node | Issues filed | Inline fix | Notes |
|---|------|-------|-----------|--------------|------------|-------|
| 1 | Header | `/ru/` (guest) | `2129:49045` | [#3](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/3) | — | Includes MainSearch filter-label bug |
| 2 | Footer | all | `270:5388` | [#2](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/2) | — | Copyright row regression vs migration spec |
| 3 | Hero / MainSection | `/ru/` | `2129:49041` | [#4](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/4) | — | Tailwind cleanup + dead CSS + search-bar offset |
| 4 | CommercialOffers | `/ru/` | `7060:58342` | [#5](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/5) | ✅ committed pre-audit (5b2eb8e8) | BUG-1 (size 8 vs 4) tracker open for decision |
| 5 | VacanciesByIndustry | `/ru/` | `2129:48706` | [#6](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/6) | — | Title/subtitle/all-link copy + eyebrow re-verify |
| 6 | VacanciesByCompany | `/ru/` | `2129:48730` (sticky `2129:52294`) | [#7](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/7) | — | Subtitle copy + brand-color cards (Part B blocked on Figma re-extract) |
| 7 | LatestVacancies | `/ru/` | `2129:48748` | [#8](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/8) | — | Card structure verified ✅; minor i18n + bookmark icon |
| 8 | NewsSection | `/ru/` | `2129:48928` | [#9](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/9) | — | PARKED — needs Malika's product call (1 row vs 3 rows) |
| 9 | OpinionSection | `/ru/` | `2129:48997` | [#10](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/10) | — | Title copy + quote icon verification |
| 10 | DownloadingMobileApp | `/ru/` | `2129:48865` | — | — | Section wired in `pages/index.vue:13`; deep visual diff not in cache. Audit deferred. |

**Total issues filed:** 9 (one duplicate `#1` was closed as dup of `#2`).

---

## Inline Fixes Applied

| # | File | Change | Type | Commit |
|---|------|--------|------|--------|
| 1 | `components/cards/CompanyServiceCard.vue` | Image inset 19→20 + minor SCSS | Pre-existing (committed pre-audit, brought in via first commit on audit branch) | `5b2eb8e8` |
| 2 | `components/sections/CommercialOffers.vue` | `fetchServices size: 8 → 4` + minor SCSS | Pre-existing | `5b2eb8e8` |

**No new inline fixes were applied during this session.** Per the user's "Tier 1 only" directive and the depth of cache, all remaining work was filed as GitHub issues with exact before/after code so GitHub Copilot Coding Agent can pick them up.

---

## GitHub Issues Created

| # | Issue | Severity | Component | Status |
|---|-------|----------|-----------|--------|
| 2 | [Footer: Copyright row missing](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/2) | 🟡 high | Footer.vue | open |
| 3 | [Header: Guest background + Login button](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/3) | 🔴/🟡 critical+high | Header.vue + MainSearch.vue | open, decision-needed |
| 4 | [Hero: Tailwind cleanup + offset](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/4) | 🟢 low | MainSection.vue + _sections.scss | open |
| 5 | [CommercialOffers: fetch size decision](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/5) | question | CommercialOffers.vue | open, decision-needed |
| 6 | [VacanciesByIndustry: copy + eyebrow](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/6) | 🟡 high | i18n files + maybe template | open |
| 7 | [VacanciesByCompany: subtitle + brand cards](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/7) | 🟡 high | i18n + VacanciesByCompany.vue | open, Part B needs MCP |
| 8 | [LatestVacancies: verified ✅, minor cleanup](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/8) | 🟢 low | LatestVacancies.vue | open |
| 9 | [NewsSection: 1-row vs 3-row PARKED](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/9) | question | NewsSection.vue | open, blocked on Malika |
| 10 | [OpinionSection: title copy + quote icon](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend/issues/10) | 🟡 high | i18n + OpinionSection.vue | open, Part B needs MCP |

**Severity breakdown (excluding question/parked):** 1 critical (Header bg) · 5 high · 2 low.

**Assignment status:** All 9 issues are **unassigned**. Initial attempt to assign to GitHub Copilot Coding Agent failed with `Bot does not have access to the repository`. Javokhir to assign manually after verifying the bot is invited / the repo is enabled for Copilot Coding Agent.

---

## Pages Skipped (no Figma frame found)

None in Tier 1 scope. All 8 homepage sections + Header + Footer have Figma nodes.

## Pages Skipped (requires auth / special state)

None in Tier 1 scope. Header guest state was the explicit target; logged-in header variant is OPEN_QUESTION #3 in `docs/bugs/open-design-questions.md` and out of scope.

## Areas Not Audited This Session

| Area | Reason |
|---|---|
| Worker pages (`pages/worker/*`) | Tier 2 — explicitly skipped per user direction |
| Company pages (`pages/company/*`) | Tier 2 — explicitly skipped |
| Auth pages (login/register/password) | Tier 2 — explicitly skipped |
| Static pages (`/static/*`) | Tier 3 — explicitly skipped |
| `MainSearch.vue` deep audit | Out of scope per cached HOME_AUDIT (only filter-label bug rolled into Header issue #3) |
| `jobCard.vue` (unused prototype) | Inventory flagged it for deletion in a separate cleanup ticket — out of scope here |
| Newsletter component | Cached audit: 'absent from `pages/index.vue`'; design call needed (not in current Figma scope, not added) |
| `DownloadingMobileApp.vue` deep diff | Cached audit only confirms presence; deep visual values not extracted. Deferred to next audit pass. |

---

## Known Limitations

1. **No fresh Figma MCP calls.** All Figma values are 13–22 days old (newest cache 2026-04-22, oldest 2026-04-12). Two issues (#7 Part B, #10 Part B) explicitly require a fresh `get_design_context` before implementing the named work.
2. **No live Playwright screenshots.** Playwright MCP was not loaded in this session; `.visual-agent/screenshot.js`-style scripts were available but not run (would have added wall-clock without changing audit conclusions).
3. **No `<script>` block changes.** Per CLAUDE.md §2 ("for CSS-only tasks, leave `<script>` untouched"), all proposed fixes are template/SCSS/i18n only. NewsSection layout collapse (#9) and Header transparent variant (#3) both require script changes — explicitly flagged in the issue bodies.
4. **Hover/animation states.** Card hover shadows, AOS animations, and carousel transitions were not part of the Figma cache and were not re-extracted.
5. **Backend-dependent issues** (e.g., hero image URL 404, locale "Ishga kirish" on `/ru/` route) are pre-existing in `docs/bugs/known-backend-bugs.md` and were not refiled here.
6. **Branch baseline.** Audit branch was created from `master`. CLAUDE.md flags `fresh_master` as the prod branch and `master` as a 2024 archive. Confirm with Javokhir before merging issue PRs back.
7. **Copilot bot assignment failed.** All issues filed unassigned. Javokhir must assign manually.

---

## Recommended Next Steps

1. **Verify the audit branch baseline** — confirm `master` is the right branch to audit (vs `fresh_master`).
2. **Decide PARKED items** — issues #5 (CommercialOffers fetch size), #9 (NewsSection layout) — both need Javokhir + Malika.
3. **Re-run Figma MCP** for issues #7 Part B (brand-color cards) and #10 Part B (quote icon SVG) before implementation.
4. **Assign issues to GitHub Copilot Coding Agent** once the bot is granted repo access.
5. **Tier 2 audit** when ready — Worker pages, Company pages, Auth pages have Figma nodes per `page-list.json` but no recent cached audits.
