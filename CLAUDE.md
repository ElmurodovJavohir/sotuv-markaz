# Project: Sotuv Markaz
AI-powered recruitment and sales training platform for Uzbekistan/CIS.
Domain: sotuv-markaz.uz

## Stack
- Frontend: Nuxt 2 SPA, Vue 2, SCSS, Bootstrap Vue, Element UI, Tailwind 2
- Backend: Django 4.x, Django REST Framework, PostgreSQL
- AI: Claude API (SalesIQ), RAGFlow (planned)
- i18n: nuxt-i18n (RU/UZ/EN) frontend, modeltranslation backend
- Node: 16.20.2 (Nuxt 2 breaks on 18+)
- Dev: `yarn dev` on port 3004, Django on 8000

## Key paths
- Frontend: `sotuv-markaz-frontend/` (97 pages, 20 Vuex modules)
- Backend: `sotuv-markaz-backend/src/` (12 Django apps)
- Figma cache: `figma_cache/` (components + pages, pre-cached)
- Docs: `docs/` (Obsidian vault — specs, ADRs, bugs, playbooks)
- Migration review: `.migration-review/` (per-component and per-page audit logs)
- Agent configs: `.claude/agents/`

## Git
- Prod branch: `fresh_master` (frontend), `main` (backend)
- Remote: `github` (not `origin`)
- `master` is a 2024 archive — never touch
- Never: `git push`, `git reset --hard`, `git stash drop`, `git branch -D`
- Javokhir commits and pushes manually

## SCSS tokens
| Hex | Variable | Use |
|-----|----------|-----|
| `#19192d` | `$dark-blue` | Text, dark bg |
| `#0085ff` | `$blue` | CTA buttons |
| `#268ae7` | `$blue-link` | Links, active tabs |
| `#29b2ff` | `$blue-light` | Gradient start |
| `#768194` | `$grey` | Secondary text |
| `#f5f7f9` | `$bg-section` | Section backgrounds |
| `#eef2f9` | `$border-card` | Card borders |
| `#e8e8e8` | `$border-color` | General borders |
| `#fb2828` | `$red` | Errors |
| `#00a795` | `$green` | Success |
| `#ffb547` | `$amber` | Premium badges |

CTA gradient: `linear-gradient(213.7deg, #29b2ff 0%, #0085ff 100%)`

## Project-specific rules
- Never modify: `<script>` blocks during CSS-only tasks, `store/`, `plugins/`, `middleware/`, `api/`, `nuxt.config.js`, `package.json`, `.env*`, `_fonts.scss`, `_functions.scss`
- Vue 2: use `::v-deep` not `:deep()` for scoped style piercing
- No CSS custom properties (`--foo`) — SCSS variables only
- `!important` only for Bootstrap Vue / Element UI overrides
- SVG icons: `fill="none" stroke="currentColor" stroke-width="1.5"` (outline default)
- Every `<img>` needs `@error` handler — API images sometimes 404
- `jobCard.vue` is shared across 5+ pages — grep before changing width
- Flexbox/grid first — use `position: absolute` only for genuine overlaps
- Figma uses absolute positioning throughout (design quality issue) — translate to flex/grid in code
- Border-radius canonical: buttons 8px, cards 12px, inputs 8px, modals 16px, pills 20px
- Figma MCP threshold: `get_design_context` works under ~300k px², times out above
- Figma file key: `whwt0wJFk3XFkkXNsVgqQh`
- Read from `figma_cache/` first, only call MCP if cache doesn't have it
- Test accounts: `@test.infinity.uz`, SMS code always `1111`
- Header is manually maintained by Javokhir — do not touch `Header.vue`
- No `yarn build` mid-session — reserved for session end
- Backend cross-repo: if backend change needed, log to `BACKEND_CHANGES.md` and stop

## Team
- Javokhir — Tech Lead / PM. Runs all sessions. Uzbek+English mix.

## Workflow
1. Read task → identify scope
2. `grep -rn` before bulk operations
3. Check `figma_cache/` for pre-cached design data
4. Apply fixes in small batches, SCSS only unless explicitly told otherwise
5. STOP at 5+ files — wait for approval
6. Report: exact file count, what changed, what skipped
7. Never auto-commit — Javokhir decides