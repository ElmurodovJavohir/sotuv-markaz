# SHARED.md — Sotuv Markaz

Business domain, shared conventions, and cross-project context.
Referenced by each sub-project's CLAUDE.md.

---

## 1. THE PRODUCT

**Sotuv Markaz** (sotuv-markaz.uz) — AI-powered recruitment and sales training
platform for Uzbekistan and CIS.

### Two product halves

| Product | What it does | Frontend | Backend |
|---------|-------------|----------|---------|
| **Job Marketplace** | Workers and companies connect, apply, hire | `sotuv-markaz-frontend/` (port 3004) | `sotuv-markaz-backend/` (port 8000) |
| **Sales Training + SalesIQ** | E-learning courses + AI candidate assessment | `sotuv-markaz-learning/` (port 3005) | same backend |

Both share SSO and unified user profiles but are separate frontend codebases.

---

## 2. USER TYPES

### Worker (job seeker)
- Registers via phone + SMS OTP
- Completes resume wizard
- Takes SalesIQ assessment → gets DISC/PAEI profile
- Browses and applies to vacancies
- Receives offers, interview invitations, chats with companies

### Company (employer)
- Registers with company profile
- Buys tariff package (Click.uz payment)
- Posts vacancies, searches candidates
- Views SalesIQ results for applicants
- Multi-profile: one company account, multiple HR team members

### Auth
- Two separate strategies via `@nuxtjs/auth-next`: `worker` and `company`
- Workers cannot log in via company strategy and vice versa
- Same phone number CAN have both account types
- SMS verification in dev: code is always `1111` (`SMS_DEBUG=True`)
- Test accounts use `@test.infinity.uz` email domain

---

## 3. SALESIQ ASSESSMENT

The core differentiator. AI-powered sales candidate evaluation.

- **32 questions, 4 phases:** psychological profiling (12), emotional intelligence (8), sales hard skills (8), open-ended scenarios (4)
- **MCQ questions:** deterministic scoring, server-side
- **Open-ended questions:** Claude API evaluation (routed through backend)
- **Questions generated fresh per session** — not a static pool
- **Single attempt, no retakes** — double-submission guards critical
- **Progress can be saved** — autosave is a real feature
- **Output:** score (0–100), DISC profile, PAEI profile, verdict (HA/EHTIMOL/YO'Q)
- **Candidate sees:** their own verdict + profile
- **Company sees:** full results excluding individual answers

**Status:** Spec complete, backend `src/salesiq/` not yet implemented.
See `docs/specs/salesiq-assessment.md` for full spec.

---

## 4. API CONVENTIONS

All sub-projects consume the same backend API.

- **Base URL:** `http://localhost:8000/api/v1/`
- **Error shape:** `{ "detail": "...", "code": "..." }`
- **Pagination:** `LimitOffsetPagination` (limit/offset query params)
- **Auth:** JWT tokens via `Authorization: Bearer <token>`
- **i18n:** `Accept-Language: uz` or `Accept-Language: ru`
- **Filtering:** `django_filter` with explicit `filterset_fields`

### Key API groups
| Path prefix | Domain |
|-------------|--------|
| `/api/v1/common/` | Shared (categories, regions, skills, footer, settings, notifications) |
| `/api/v1/worker/` | Worker profile, auth, resume |
| `/api/v1/company/` | Company profile, auth, vacancies, candidates, offers |
| `/api/v1/interview/` | Interview scheduling |
| `/api/v1/payment/` | Tariffs, orders, Click.uz |
| `/api/v1/resume/` | Resume CRUD |
| `/api/v1/learning/` | Courses, modules, lessons, tests, certificates |

---

## 5. i18n

- **Languages:** Uzbek (uz), Russian (ru), English (en — partial)
- **Backend:** `modeltranslation` — auto-creates `field_uz`, `field_ru` columns
- **Frontend:** `nuxt-i18n` with `languages/uz.js` and `languages/ru.js` (1100+ keys each)
- **Rule:** Every user-facing model field must be registered in `translation.py`
- **Rule:** Every user-facing UI string must have uz + ru translations

---

## 6. BRAND

### Name
- **Current:** Sotuv Markaz (O'zbek)
- **Legacy:** Infinity Sales, Jobhunt — still in some code, being replaced
- **Domain:** sotuv-markaz.uz

### Colors (SCSS canonical)
| Hex | Variable | Use |
|-----|----------|-----|
| `#19192d` | `$dark-blue` | Backgrounds, text |
| `#0085ff` | `$blue` | CTA buttons, primary actions |
| `#268ae7` | `$blue-link` | Links, active tabs, hover |
| `#29b2ff` | `$blue-light` | Gradient start |
| `#768194` | `$grey` | Secondary text |
| `#e8e8e8` | `$border-color` | Borders |
| `#ffb547` | `$amber` | Premium/featured badges |
| `#4facfe` | `$blue-light-2` | Decorative |
| `#00a795` | `$green` | Success, employer CTA |

CTA gradient: `linear-gradient(213.7deg, #29b2ff 0%, #0085ff 100%)`

### Typography
- Primary: VK Sans Display (CDN broken — renders as Lato fallback)
- Secondary: Lato
- Logo: Unbounded

---

## 7. INFRASTRUCTURE

| Service | Tech | Status |
|---------|------|--------|
| Database | PostgreSQL | Running (local) |
| Cache/Broker | Redis | Required for Celery |
| Background tasks | Celery | Configured |
| WebSocket | Django Channels | Chat feature |
| Search | ORM-based (Elasticsearch removed) | Running |
| AI orchestration | RAGFlow (self-hosted) | Not deployed (server needed) |
| AI evaluation | Claude API (Anthropic) | Planned for SalesIQ |
| Payment | Click.uz | Integrated |
| SMS | Custom provider | Working (debug mode: code=1111) |

---

## 8. VOCABULARY

| Term | Meaning |
|------|---------|
| Worker | Job seeker / candidate |
| Company | Employer |
| Vacancy | Job posting |
| Application | Worker applies to vacancy |
| Offer | Company offers position to worker |
| SalesIQ | AI assessment engine |
| DISC | Personality profile (Dominant, Influential, Steady, Compliant) |
| PAEI | Management style (Producer, Administrator, Entrepreneur, Integrator) |
| Tariff | Paid subscription package |
| Chosen Company | Featured/promoted company |
| Top Worker | Premium-listed job seeker |
