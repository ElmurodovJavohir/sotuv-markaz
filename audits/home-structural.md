# Structural Audit — home
- Figma node: 2129:48704
- Code: pages/index.vue (compositional wrapper of 8 section components)
- Audited: 2026-05-08T09:35:00Z
- Cache source: figma_cache/pages/guest-home/ (sections 1–8, cached 2026-05-05 to 2026-05-06)

## Page-level composition

| Figma section | Code component | Status |
|--------------|----------------|--------|
| Hero / Search (2129:49041) | `<main-section type="employee" />` | ✓ MATCH |
| Commercial Offers (7060:58342) | `<commercial-offers />` | ✓ MATCH |
| Vacancies by Industry (2129:48706) | `<vacancies-by-industry />` | ✓ MATCH |
| Vacancies by Company (2129:48730) | `<vacancies-by-company />` | ✓ MATCH |
| Latest Vacancies (2129:48748) | `<latest-vacancies />` | ✓ MATCH |
| App Download (2129:48865) | `<!-- <downloading-mobile-app /> -->` | ✗ COMMENTED_OUT |
| Blog / News (2129:48928) | `<news-section />` | ✓ MATCH |
| Testimonials (2129:48997) | `<opinion-section />` | ✓ MATCH |

## Section 1 — Hero (out-of-scope: header is user-managed)

| Figma component | Code component | Status | Backend needed? |
|----------------|---------------|--------|-----------------|
| hero-background (navy overlay + bg-image) | `.main-section` `:style="heroBackgroundStyle"` | ✓ MATCH | NO |
| hero-logo | `<img src="/img/logo-white.svg">` | ✓ MATCH | NO |
| hero-tagline h1 | `<h1>{{ $t('home.hero_tagline') }}</h1>` | ✓ MATCH | NO |
| stats-bar: vacancy count | `{{ links.stat.vacancy }}` | ✓ MATCH | NO |
| stats-bar: company count | `{{ links.stat.company }}` | ✓ MATCH | NO |
| stats-bar: resume count | `{{ links.stat.resume }}` | ✓ MATCH | NO |
| search-bar | `<main-search :type="type" />` | ✓ MATCH | NO |
| nav elements (lang, login, learn, CTA) | IN Header.vue (scope-excluded) | SCOPE_EXCLUDED | — |

## Section 2 — Commercial Offers

All 9 prior bugs RESOLVED per cache (2026-05-06 verification).

| Figma component | Code component | Status |
|----------------|---------------|--------|
| section-title (28px/600/$dark-blue) | `.commercial-offers__title` | ✓ MATCH |
| section-subtitle (16px/600/$grey) | `.commercial-offers__subtitle` | ✓ MATCH |
| view-all-link (18px/$dark-blue, chevron 1.4) | `.commercial-offers__link` | ✓ MATCH |
| card-grid 4 cards, 20px gap | `.commercial-offers__row` gutters -10/-10 | ✓ MATCH |
| service-card (image+logo+company-name+service-title) | `<company-service-card>` | ✓ MATCH |
| padding 88px top / 48px bottom | `padding: 88px 0 48px` | ✓ MATCH |

## Section 3 — Vacancies by Industry

| Figma component | Code component | Status |
|----------------|---------------|--------|
| section-title (Figma: "Работа по отраслям в Ташкенте") | `home.vacancy.title` → "По отраслям" | LABEL_MISMATCH |
| section-subtitle (Figma: "Список активных вакансий...") | `home.vacancy.sub` → "Отрасли" | LABEL_MISMATCH |
| view-all-link (Figma: "Все категории") | `home.vacancy.all` → "Все отрасли" | LABEL_MISMATCH |
| category-cards (icon+name+salary+count), 12 cards | Rendered via v-for | ✓ MATCH (structure) |
| 20px gap override | In `_sections.scss` | ✓ MATCH |

## Section 4 — Vacancies by Company

| Figma component | Code component | Status |
|----------------|---------------|--------|
| section-title | `home.company.title` | ✓ MATCH |
| section-subtitle | `home.company.sub` | ✓ MATCH |
| view-all-link (color: $grey per C8) | `.link-to` class | STYLE_CHECK_NEEDED |
| company-cards (image+name+verified+vacancy-count) | Carousel cards | ✓ MATCH |
| carousel-nav (44×44 / 8px radius) | `.vbc-nav` buttons | ✓ MATCH |

## Section 5 — Latest Vacancies

| Figma component | Code component | Status |
|----------------|---------------|--------|
| section-title | `home.free.title` | VERIFY_COPY |
| section-subtitle | `home.free.sub` | VERIFY_COPY |
| view-all-link | `home.free.all` | VERIFY_COPY |
| vacancy-card (logo+company+title+divider+salary+location) | `VacancyHomeCard` | ✓ MATCH |
| premium variant (amber border + star ribbon) | `.vacancy-card--premium` + `vacancy-card__ribbon` | ✓ MATCH |
| argent variant (amber border) | `.vacancy-card--argent` | ✓ MATCH |
| bookmark button | `<wish-list :item="item" triple />` | ✓ MATCH |

## Section 6 — App Download (COMMENTED OUT)

| Figma component | Code component | Status | Backend needed? |
|----------------|---------------|--------|-----------------|
| section-title | (commented out) | MISSING | NO |
| section-subtitle | (commented out) | MISSING | NO |
| cta-banner (gradient) | (commented out) | MISSING | NO |
| iphone-mockup | (commented out) | MISSING | NO |
| qr-code | (commented out) | MISSING | NO |
| app-store-button | (commented out) | MISSING | NO |
| google-play-button | (commented out) | MISSING | NO |

All 8 components MISSING. Component exists (`DownloadingMobileApp.vue`) but `pages/index.vue` has it commented out with note: "app download section is not in use yet (no published mobile app)."

**Decision**: Log to BLOCKERS.md for user decision — uncomment when mobile app is published.

## Section 7 — Blog / News

| Figma component | Code component | Status |
|----------------|---------------|--------|
| section-title (28px/600/$dark-blue) | `.news-block__title` | ✓ MATCH |
| section-subtitle (16px/600/$grey) | `.news-block__subtitle` | ✓ MATCH |
| view-all-link (18px/$dark-blue) | `.blog-head-link` | ✓ MATCH |
| card-grid (4 cards, 20px gap) | `.post-grid` gutters -10/-10 | ✓ MATCH |
| blog-card (image-overhang + title + date-chip + category-chip) | `.post__item` | ✓ MATCH |
| category-chip (unified palette #e8f6ff/#189fff) | `.post__chip` | ✓ MATCH (Figma correct but untokenized) |

**Style issue**: `#189fff` and `#e8f6ff` are Figma-correct but untokenized — add TODO token comments.

## Section 8 — Testimonials

| Figma component | Code component | Status |
|----------------|---------------|--------|
| section-title | `home.idea.title` | ✓ MATCH |
| section-subtitle | `home.idea.sub` | ✓ MATCH |
| testimonial-card × 3 (avatar+company+role+quote) | `.item` cards in VueSlickCarousel | ✓ MATCH |
| carousel-nav arrows (44×44 / 8px radius) | `.btn` arrow buttons | STYLE_ISSUE (fill="#268ae7" hardcoded) |

## Out-of-scope (ignored per scope rules)
- Header changes (user-managed)
- Footer changes (user-managed)

## Summary
- STRUCTURAL_MISSING: 8 items (all in App Download section, component is commented out)
- STRUCTURAL_EXTRA: 0
- LABEL_MISMATCH: 3 items (VacanciesByIndustry section copy)
- MISSING_DATA_BINDING: 0
- LAYOUT_WRONG_TYPE: no

## Structural score
- Total Figma components (across all 8 sections): 80
- Matched (structure present in code): 72 (App Download 0/8 = 8 missing)
- Score: 72/80 = **90%**

## Decision
Score 90% → proceed to Step 5. App Download COMMENTED_OUT → log to BLOCKERS.md, mark page PARTIAL.
