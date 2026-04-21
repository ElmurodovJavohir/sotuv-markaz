# CLAUDE.md — infinitysales-learning

You are Claude Code working on the Infinity Sales Learning Platform. Read this
file fully before taking any action.

For cross-project context (shared API, business vocabulary), see `../CLAUDE.md`.
For the sibling frontend (job marketplace), see `../infinitysales-frontend/CLAUDE.md`.

---

## 1. PROJECT QUICK FACTS

- **What it is:** Sales training + course platform with SalesIQ assessment engine
- **Relation to main app:** Separate Nuxt app consuming the same backend
- **Tech:** Nuxt (confirm version — 2 or 3) + Vue + SCSS + Tailwind
- **Dev URL:** `http://localhost:3005`
- **Backend:** Same as main app — `../infinitysales-backend/` on :8000 / :8001
- **Users:** Both workers and companies; learning is open to authenticated users

---

## 2. HARD BOUNDARIES — NEVER CROSS

### Files you must never modify
- `../infinitysales-backend/` — entire sibling directory
- `../infinitysales-frontend/` — entire sibling directory
- `node_modules/`, `.nuxt/`, `dist/`
- `package.json`, `yarn.lock`, `package-lock.json`
- `.env*` files
- `nuxt.config.js` unless user explicitly asks

### Regions you must never modify
- Any file with `axios.`, `this.$store`, API client code — unless user explicitly asks
- Auth middleware / guards — these are shared with main app conceptually; breaking them breaks everything

### Commands you must never run
- `yarn build` during a session unless final verification
- `yarn install`, `npm install`
- `git push`
- Destructive git operations without explicit approval

---

## 3. WHAT YOU MAY MODIFY

- Page templates under `pages/`
- Component templates under `components/`
- Layouts under `layouts/`
- SCSS under `assets/scss/`
- Static assets

---

## 4. PROJECT PAGES (expected — verify before assuming)

The learning platform has these main routes:

```
/courses                 # courses list
/courses/[slug]          # course detail
/lessons/[id]            # lesson page
/test/[id]               # test engine (SalesIQ assessment flow)
/profile                 # 3 tabs
/blog                    # blog list
/notifications           # user notifications
```

If the structure has changed, verify with `find pages -name "*.vue"` before
assuming any route exists.

---

## 5. SALESIQ ASSESSMENT — KEY RULES

The test engine on `/test/[id]` is the most sensitive part of this app. Break
it and candidates can't complete their assessment.

- **MCQ questions:** deterministic scoring, server-side
- **Open-ended questions:** AI-evaluated, minimum 30 words required
- **Questions generated fresh per candidate** — not a static pool
- **Single attempt, no retakes** — double-submission guards are critical
- **Progress can be saved mid-test** — autosave is a real feature, not cosmetic
- **DISC and PAEI profiling** — results pipeline produces these; don't alter the data shape

### Forbidden on the test engine

- Do NOT change input validation behavior
- Do NOT alter the submission payload shape
- Do NOT "optimize" the autosave interval without confirming with user
- Do NOT skip the minimum-word-count check for open-ended questions

If you need to touch the test engine, stop and confirm scope with Javokhir first.

---

## 6. WORKING STYLE

Same as main frontend CLAUDE.md — terse instructions, single comprehensive
prompts, grep-based discovery, stop at major decisions.

### Learning-specific notes

- Content (course text, lesson bodies) comes from the backend — do not hardcode.
- If a page loads with skeleton placeholders indefinitely, the backend is the issue, not the frontend. Don't "fix" by adding fake data in components.
- i18n applies here too. Check `i18n/` for existing translations before adding new UI text.

---

## 7. CANDIDATE PROFILE PAGE (PLANNED)

The SalesIQ candidate profile page is a known planned feature:

- Hero block: grade, score, verdict
- DISC chart
- PAEI chart
- Module-by-module breakdown
- AI-generated strengths + development areas
- **Two views:** candidate-facing (self) and company-facing (assessing)

If asked to work on this: the company view and candidate view have DIFFERENT data
shape (company sees more detail, candidate sees a filtered version). Don't
share a single component between them.

---

## 8. REFERENCES

- Main frontend: `../infinitysales-frontend/CLAUDE.md`
- Backend: `../infinitysales-backend/CLAUDE.md`
- Shared context: `../SHARED.md`

---

## 9. WHEN YOU ARE UNSURE

Stop. Ask. Especially when:
- The change touches the test engine
- The change affects data shown to a company vs. data shown to a candidate
- You're not sure whether the learning platform and main frontend share a component

Silence after a question is not permission to proceed. Wait.