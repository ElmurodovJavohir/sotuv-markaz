# Audit Page Map — Tier 1 Scope

**Date:** 2026-05-04
**Branch:** `audit/homepage-design-review-20260504`
**Figma file:** `whwt0wJFk3XFkkXNsVgqQh`
**Scope:** Homepage (8 sections) + Header + Footer

> Live Figma MCP not re-called this session. All Figma values are sourced from
> three cached audits. See "Source of Figma values" in each row.

| # | Area | Figma frame | Figma node | Frontend file | Cached audit source | Status |
|---|------|-------------|------------|---------------|---------------------|--------|
| 1 | Header | (under `2129:49041`) | `2129:49045` | `components/Header.vue` | `HOME_AUDIT.md` §1 (2026-04-12) | Audited; partial fixes; gaps remain |
| 2 | Footer | Footer | `270:5388` | `components/Footer.vue` + `components/layout/FooterLink.vue` | `.migration-review/footer/FIGMA_SPEC.md` + `BUGS_FOUND.md` (2026-04-21) | Migrated; 1 regression found this audit |
| 3 | Hero / MainSection | "Frame 38078" | `2129:49041` | `components/sections/MainSection.vue` | `home-depth-audit-20260419.md` §0 + `.migration-review/home/SECTION_1_HERO_SPEC.md` (2026-04-22) | Mostly DONE in earlier commits; minor cleanups remain |
| 4 | Commercial Offers | "Frame …" | `7060:58342` | `components/sections/CommercialOffers.vue` + `components/cards/CompanyServiceCard.vue` | `SECTION_2_SPEC.md` + `SECTION_2_BUGS_FOUND.md` (2026-05-04) | Section 2 fixes committed today (5b2eb8e8); BUG-1 + suspect items remain |
| 5 | Vacancies by Industry | "По отраслям" | `2129:48706` | `components/sections/VacanciesByIndustry.vue` | `home-depth-audit-20260419.md` §2 | Copy + eyebrow inversion remain |
| 6 | Vacancies by Company | "По компаниям" | `2129:48730` (sticky `2129:52294`) | `components/sections/VacanciesByCompany.vue` | `home-depth-audit-20260419.md` §3 + `HOME_AUDIT.md` §7 | Subtitle copy + brand-color treatment remain |
| 7 | Latest Vacancies | "Вакансии" | `2129:48748` | `components/sections/LatestVacancies.vue` | `home-depth-audit-20260419.md` §4 + `HOME_AUDIT.md` §8 | Premium border ✅; structure verified; specific paddings need fresh measure |
| 8 | News / Blog | "Блог" | `2129:48928` | `components/sections/NewsSection.vue` | `home-depth-audit-20260419.md` §5 + `HOME_AUDIT.md` §10 | Parked (Issue C — 1-row-vs-3-row decision pending) |
| 9 | Opinions / Testimonials | "Люди о нас" | `2129:48997` (sticky `2129:52556`) | `components/sections/OpinionSection.vue` | `home-depth-audit-20260419.md` §6 + `HOME_AUDIT.md` §11 | Title copy + quote icon verification remain |
| 10 | Download Mobile App | "Скачайте наше приложение" | `2129:48865` | `components/sections/DownloadingMobileApp.vue` | `HOME_AUDIT.md` §9 (2026-04-12) | Section now wired in `pages/index.vue:13`; deep visual diff not in cache |

## Out of Tier 1 (skipped)

- Worker pages, Company pages, Auth pages, Static pages — explicit user direction this session
- Sticky header behavior (needs JS / out of CSS-only scope)
- Newsletter component addition (not present in `pages/index.vue`; cached audit "VK ABSENT" — design call needed)
- `MainSearch.vue` (used in hero but cached audit treats as out-of-scope)
- `jobCard.vue` (prototype, not used on homepage; flagged in `HOMEPAGE_INVENTORY.md` §6)

## Verification environment

- Frontend: `http://localhost:3004` (200 OK on `/` and `/uz`)
- Backend: `http://localhost:8000`
- Branch base: `master` @ `2137ec67` (workspace) → frontend submodule `master` (note: `CLAUDE.md` flags `fresh_master` as prod)
- First commit on audit branch: `5b2eb8e8` (Section 2 SCSS fixes from prior session)
- GitHub CLI: ✅ authenticated as `ElmurodovJavohir`
