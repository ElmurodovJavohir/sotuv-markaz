# AGENTS.md — Sotuv Markaz

You are working on Sotuv Markaz (sotuv-markaz.uz) — AI-powered recruitment and sales training platform for Uzbekistan/CIS.

Tech Lead: Javokhir

---

## Projects

**Frontend** — `sotuv-markaz-frontend/`
- Nuxt 2 SPA, Vue 2, SCSS, Bootstrap Vue, Element UI
- i18n: Russian (default) + Uzbek via `nuxt-i18n`
- Auth: `@nuxtjs/auth-next` (dual: worker + company)
- State: 19 Vuex modules in `store/`
- Figma: file key `whwt0wJFk3XFkkXNsVgqQh`
- Dev: `http://localhost:3004` (`yarn dev`)
- Prod branch: `fresh_master`

**Backend** — `sotuv-markaz-backend/`
- Django 4.x + DRF + PostgreSQL
- i18n: `modeltranslation` for bilingual DB fields (ru/uz)
- AI: Claude API for SalesIQ scoring
- Dev: `http://localhost:8000`

---

## Subagents

You have 3 subagents available. Use them for parallel work.

- **@worker** — General executor. Reads, writes, edits files, runs commands, generates code. Use when you need to make changes or create things.
- **@explorer** — Fast read-only search. Greps, finds files, traces dependencies. Use when you need to gather information without modifying anything.
- **@reviewer** — Code auditor. Reviews quality, finds bugs, compares against specs. Use when you need analysis or audit reports.

Delegate to subagents when a task has independent parts that can run in parallel.

---

## Hard boundaries

### Never modify
- `<script>` blocks in `.vue` files (during visual/CSS work)
- `store/`, `plugins/`, `middleware/`, `api/`, `services/`
- `package.json`, `yarn.lock`, `nuxt.config.js`
- `assets/scss/_fonts.scss`, `assets/scss/_functions.scss`
- Existing Django migration files — create new ones
- `.env*` files

### Never run
- `yarn install`, `npm install`, `pip install` (without approval)
- `yarn build` (reserve for final verification)
- `git push`, `git reset --hard`, `git branch -D`
- `python manage.py migrate --fake`, `flush`, `reset_db`

### Never do
- Hardcode hex values when SCSS variable exists
- Invent new SCSS variable names
- Change serializer fields without checking frontend consumers
- Add endpoints without serializer + permissions + URL + OpenAPI annotation
- Commit secrets or API keys

---

## SCSS variables (canonical)

| Hex       | Variable        | Usage              |
|-----------|-----------------|--------------------|
| `#19192d` | `$dark-blue`    | Primary dark text  |
| `#0085ff` | `$blue`         | CTA primary        |
| `#268ae7` | `$blue-link`    | Links, focus       |
| `#29b2ff` | `$blue-light`   | CTA gradient end   |
| `#768194` | `$grey`         | Secondary text     |
| `#e8e8e8` | `$border-color` | Borders            |
| `#ffb547` | `$amber`        | Premium/warning    |
| `#00a795` | `$green`        | Success            |
| `#f5f7f9` | `$bg-light`     | Section background |
| `#001444` | `$navy`         | Dark overlays      |

CTA gradient: `linear-gradient(213.7deg, #29b2ff 0%, #0085ff 100%)`

---

## Component conventions

- Button border-radius: `8px` (small/medium), `12px` (large CTA)
- Card border-radius: `12px` (main), `8px` (small)
- Bootstrap Vue overrides: `:deep(.b-element) { ... !important; }` in scoped styles
- Element UI overrides: `:deep(.el-element) { ... }` in scoped styles
- SVG icons: `fill="none" stroke="currentColor" stroke-width="1.5"` (except brand icons)
- Images: always add `@error="$event.target.style.opacity=0"`

---

## Homepage sections (pages/index.vue)

1. MainSection (Hero) — `components/sections/MainSection.vue`
2. CommercialOffers — `components/sections/CommercialOffers.vue`
3. VacanciesByIndustry — `components/sections/VacanciesByIndustry.vue`
4. VacanciesByCompany — `components/sections/VacanciesByCompany.vue`
5. LatestVacancies — `components/sections/LatestVacancies.vue`
6. DownloadingMobileApp — `components/sections/DownloadingMobileApp.vue`
7. NewsSection — `components/sections/NewsSection.vue`
8. OpinionSection — `components/sections/OpinionSection.vue`

---

## Backend conventions

- Serializers: separate List / Detail / Create / Update variants
- Permissions: explicit `permission_classes` on every ViewSet
- Pagination: `LimitOffsetPagination` globally
- Filtering: `DjangoFilterBackend` + explicit `filterset_fields`
- Errors: `{ "detail": "...", "code": "..." }` shape
- Migrations: one logical change per file, descriptive names
- i18n: register bilingual fields in `translation.py`

---

## Output rules

- All user-facing strings: i18n in both `ru` and `uz`
- Structured data: JSON format
- File paths: absolute from repo root
- Colors: hex lowercase, no shorthand
- Commit messages: `scope(component): description`

---

## Working style

- Terse instructions in Uzbek/English mix from Javokhir
- Stop and ask when touching 5+ files
- Never auto-commit — Javokhir decides when
- Show migration SQL before running
- Visual correctness needs screenshot verification, not just "200 OK"
