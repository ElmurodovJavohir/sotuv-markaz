# SHARED.md — Infinity Sales Workspace

This file is referenced by each sub-project's `CLAUDE.md`. It contains the
minimum context needed across projects — business domain, shared conventions,
cross-cutting infrastructure.

When you're working on a specific sub-project, read its `CLAUDE.md` first.
Only dip into this file when you need the bigger picture.

---

## 1. THE PRODUCT

**Infinity Sales** — an AI-powered recruitment + sales training SaaS targeting
Uzbekistan and the broader CIS market.

Previously branded **Jobhunt**. Migration is complete; if you see "Jobhunt" or
"jobhunt" anywhere outside HTML comments, it's legacy debt to be cleaned up.

### Two product halves

1. **Job Marketplace** — workers, companies, vacancies, applications, chat
2. **Sales Training / SalesIQ** — AI-scored assessments with DISC + PAEI
   psychological profiling, plus a course/lesson learning platform

Both halves share one backend. The frontend is split across two Nuxt apps:
- `infinitysales-frontend/` (job marketplace) — port 3004
- `infinitysales-learning/` (SalesIQ + courses) — port 3005

---

## 2. WORKSPACE LAYOUT

```
~/<workspace-root>/
├── infinitysales-frontend/      # Nuxt 2 — job marketplace
│   └── CLAUDE.md
├── infinitysales-backend/       # Django REST + FastAPI
│   └── CLAUDE.md
├── infinitysales-learning/      # Nuxt — learning + SalesIQ
│   └── CLAUDE.md
└── SHARED.md                    # this file
```

---

## 3. TEAM

- **Javokhir** — Technical Lead + Product Manager. Runs all sessions.
  Communicates in Uzbek + English mix. Expects expert-level responses, not beginner.
- **Malika Xakimova** — Founder. Owns brand, design direction, business decisions.
  Figma file is hers: `whwt0wJFk3XFkkXNsVgqQh`.

---

## 4. USER TYPES & CORE FLOWS

### Worker (job seeker)
- Registers via phone + SMS → completes resume wizard → browses vacancies → applies
- Can take SalesIQ assessments to build a verified sales profile
- Gets offers, invitations to interview, can chat with companies

### Company (employer)
- Registers, completes company profile, buys a tariff package
- Posts vacancies, searches candidates, sends offers
- Reviews SalesIQ results for candidates
- Multi-profile: one company account can have multiple sub-profiles (HR team members)

### Auth strategies
Backend exposes two auth strategies via `@nuxtjs/auth-next`:
- `worker` — phone-based, SMS OTP
- `company` — phone-based, separate flow

Workers cannot log in via the company strategy and vice versa. A person can,
however, have both types of accounts with the same phone. Don't assume 1:1.

---

## 5. TECH STACK SUMMARY

| Layer | Choice |
|---|---|
| Frontend main | Nuxt 2, Vue 2, Bootstrap Vue, Element UI, SCSS, Tailwind |
| Frontend learning | Nuxt (verify version), Vue, SCSS |
| Backend main | Django 4.x + DRF |
| Backend AI | FastAPI + Claude API + RAGFlow |
| DB | PostgreSQL |
| i18n | `nuxt-i18n` (frontend) + `modeltranslation` (backend) |

---

## 6. DESIGN SYSTEM

### Figma
- File key: `whwt0wJFk3XFkkXNsVgqQh`
- Main page node: `2129:48704` (home)
- News/blog/events: `2129:59214`
- **Figma MCP** is available in Claude Code CLI only (not claude.ai chat).
  Local server at `http://127.0.0.1:3845/mcp`.
  Params: `clientFrameworks="vue,nuxt"`, `clientLanguages="javascript,scss,html"`.

### Fonts (important)
- Design intent: VK Sans Display (headings) + Unbounded + Lato (body)
- Reality: **VK Sans Display never loaded.** The `cdn.jsdelivr.net/.../vk-sans-display` URL in `nuxt.config.js` returns 404. The whole site falls back to Lato.
- **Do not "fix" this by self-hosting VK Sans Display.** License is proprietary. User is working on EULA clarification.
- Alternative under consideration if licensing fails: **Manrope** (OFL-1.1, Google Fonts).

### Brand colors (canonical)
| Hex | Variable | Use |
|---|---|---|
| `#19192d` | `$dark-blue` | Primary text, dark surfaces |
| `#0085ff` | `$blue` | Primary CTA |
| `#268ae7` | `$blue-link` | Links |
| `#29b2ff` | `$blue-light` | Gradient stop |
| `#4facfe` | `$blue-light-2` | Secondary accents |
| `#768194` | `$grey` | Secondary text |
| `#e8e8e8` | `$border-color` | Borders |
| `#ffb547` | `$amber` | Warnings, highlights |
| `#00a795` | `$green` | Success |

### Primary CTA gradient
`linear-gradient(213.7deg, #29b2ff 0%, #0085ff 100%)` — direction matters.

### Component radii
- Buttons: `8px` small/medium, `12px` large CTA
- Cards: `12px` main, `8px` sidebar/small items

---

## 7. BUSINESS VOCABULARY

| Term | Meaning |
|---|---|
| Worker | Job seeker user |
| Company | Employer user |
| Vacancy | Job posting |
| Application | Worker applying to a vacancy |
| Interview | Scheduled meeting flow after application |
| Offer | Company-initiated contact to a worker |
| Tariff | Paid subscription plan for companies |
| Multi-profile | Sub-account under one company (HR team members) |
| SalesIQ | The assessment engine for sales competency |
| DISC | Personality quadrant (Dominance, Influence, Steadiness, Conscientiousness) |
| PAEI | Management style framework (Producer, Administrator, Entrepreneur, Integrator) |
| Seekers / Candidates | Same thing — both used in code |
| Desk | User's personal dashboard ("My desk" = my applications/saved/interviews) |

---

## 8. SHARED CONVENTIONS

### Language codes
- `ru` — Russian (default)
- `uz` — Uzbek (Latin script in product)
- `en` — English

### URL locale prefix
Frontend routes are always prefixed: `/ru/worker/login`, `/uz/company/home`.

### Phone format
International with Uzbekistan code: `+998XXYYYYYYY` (12 digits total).
Frontend sometimes strips the `+998` prefix in display; backend always stores full.

### SMS verification in dev
With `SMS_DEBUG=True` + `HASH_SMS_CODE=True` on backend, the verification code
is always `1111`. This is dev-only; production uses real SMS.

### Test account convention
All seed/test accounts use `@test.infinity.uz` email domain.
Seed script: `infinitysales-backend/src/common/management/commands/seed_test_data.py`.

---

## 9. KNOWN ISSUES (CROSS-PROJECT)

### Backend bugs (frontend-visible)
- `/api/v1/common/catgory/with-salary` — typo in URL, should be `category`.
  Currently returns 301 redirect, adding latency.
- `/api/v1/common/skills/?search=undefined` — frontend sometimes sends literal `"undefined"` string. Backend should treat it as empty; frontend should send empty or omit.
- `/api/v1/common/category/select/` and `/skills/` sometimes PEND (>2s no response).

### Frontend bugs (backend-visible)
- Axios calls sending `search=undefined` when a JS variable is undefined. This is a front-end bug in axios param building — needs `|| ''` fallback.

### Design bugs
- VK Sans Display never loads (see Section 6). Everything renders in Lato fallback, which means typography doesn't match Figma anywhere.

---

## 10. INFRASTRUCTURE NOTES

### Git
- Main repo branch: `fresh_master` (NOT `master` — `master` is a 2024 archive)
- Remote name: `github` (literal — not `origin`)
- Feature branches: `fix/<desc>-YYYYMMDD`, `redesign/<scope>-YYYYMMDD`

### Dev ports
- `3004` — frontend main (Nuxt)
- `3005` — frontend learning (Nuxt)
- `8000` — backend Django
- `8001` — backend FastAPI

### Tools Javokhir uses
- Claude Code CLI — primary execution environment
- Figma MCP — local server, CLI-only
- Playwright MCP — for screenshot + visual regression
- Notion — project management. Workspace: "Infinity Sales — AI Dev Platform"
  (only touch Notion when explicitly asked)

---

## 11. DECISION LOG (living)

Append important architectural decisions here as they are made. Each entry
should be short: date, decision, rationale.

- **2026-04-19** — Autonomous visual-sync agent deprecated after brand-icon
  leakage incident (73 logos converted to outline style, including own UIC logo).
  Future batch fixes will require per-class skip filters; alternatively, move to
  component-by-component manual pipeline.

- **2026-04-19** — VK Sans Display confirmed to not exist as a public npm package.
  Current site runs entirely on Lato fallback. License clarification pending from
  VK (`dsn.vk.com/fonts`) before deciding: self-host VK Sans / switch to Manrope /
  other OFL alternative.

- **2026-04-19** — Hard rule: backend bugs discovered during frontend work go to
  `.visual-agent/backend-issues.md`. Frontend agent does not fix backend.

---

## 12. WHEN THINGS CROSS PROJECT BOUNDARIES

If a task requires changes in both frontend and backend (e.g. adding a new field
that appears in both the API response and the UI), don't attempt it in a single
session. Instead:

1. Do the backend change first (migration + serializer + endpoint).
2. Verify the new API shape with curl or Postman.
3. Switch to the frontend session, consume the new field.

This keeps each CLAUDE.md scope clean and avoids mid-session context switching
that loses state.