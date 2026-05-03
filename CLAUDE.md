# Sotuv Markaz — Cross-Project Guide

You are Claude Code working on Sotuv Markaz, an AI-powered recruitment and sales
training platform for Uzbekistan and the CIS market. Domain: **sotuv-markaz.uz**

Read this file, then read the sub-project CLAUDE.md for whichever repo you are
working in. For shared business context, see `SHARED.md`.

---

## 1. WORKSPACE LAYOUT

```
sotuv-markaz/                      ← workspace root (you are here)
├── sotuv-markaz-backend/          ← Django REST + FastAPI (port 8000/8001)
│   └── CLAUDE.md
├── sotuv-markaz-frontend/         ← Nuxt 2 job marketplace (port 3004)
│   └── CLAUDE.md
├── sotuv-markaz-learning/         ← Learning + SalesIQ (port 3005)
│   └── CLAUDE.md
├── docs/                          ← Obsidian vault — specs, decisions, bugs
├── .claude/                       ← Claude Code config
│   ├── agents/                    ← Agent instruction files
│   └── settings.local.json
├── .playwright-mcp/               ← Visual verification
├── CLAUDE.md                      ← THIS FILE
└── SHARED.md                      ← Business domain, team, conventions
```

Each sub-project has its own CLAUDE.md with repo-specific rules. This file
covers cross-cutting concerns only.

**GitHub repos:**
- https://github.com/ElmurodovJavohir/sotuv-markaz-backend
- https://github.com/ElmurodovJavohir/sotuv-markaz-frontend

---

## 2. TEAM

- **Javokhir** — Technical Lead / PM. Runs all sessions. Communicates in
  Uzbek + English mix. Expects expert-level responses.
- **Malika Xakimova** — Founder. Owns brand, design, business decisions.

---

## 3. CROSS-PROJECT RULES

### Communication
- Terse, directional instructions — Javokhir writes in Uzbek/English mix
- Technical responses in English, conversational in Uzbek/mixed
- No fluff: no "Great question!", no "Let me know if you need anything!"
- Report numbers, not vibes: "37 files fixed" beats "most files fixed"

### Git discipline (all repos)
- Never run `git push` — Javokhir pushes manually
- Never run `git reset --hard`, `git stash drop`, `git branch -D`
- Work on feature branches, not `fresh_master` (frontend) or `main` (backend)
- Branch naming: `fix/<description>-YYYYMMDD` or `feat/<description>-YYYYMMDD`
- Commit messages: `feat(module): short description` or `fix(module): short description`
- Never auto-commit — Javokhir decides when to commit

### Cross-repo changes
- Never modify `sotuv-markaz-backend/` while working on `sotuv-markaz-frontend/`
- Never modify `sotuv-markaz-frontend/` while working on `sotuv-markaz-backend/`
- If a backend change is needed to unblock frontend work, log it and stop

### When you are unsure
Stop. Ask Javokhir. Specifically when:
- A change touches more than 5 files
- Git state looks unusual (detached HEAD, unexpected branches)
- A cross-repo dependency is discovered
- An architecture decision is ambiguous

Silence after a question is NOT permission to proceed. Wait.

---

## 4. DOCUMENTATION

### docs/ (Obsidian vault)
Architecture decisions, specs, bugs, playbooks, meeting notes.
Claude Code can read these for context. Structure:

```
docs/
├── architecture/     ← system overview, tech stack, AI pipeline
├── specs/            ← SalesIQ assessment, candidate profile, design tokens
├── decisions/        ← ADR (Architecture Decision Records)
├── bugs/             ← known backend/frontend bugs, open design questions
├── playbooks/        ← Claude Code session guide, feature workflow, Figma-to-code
├── meetings/         ← meeting notes with stakeholders
└── migration-review/ ← legacy Figma migration audit docs (footer, header, etc.)
```

### Notion (external)
Task management only — Kanban board at workspace "Sotuv Markaz — AI Dev Platform".
Do NOT create/modify Notion tasks unless Javokhir explicitly asks.

---

## 5. FIGMA

- **File key:** `whwt0wJFk3XFkkXNsVgqQh`
- **MCP:** `http://127.0.0.1:3845/mcp` (Claude Code CLI only)
- **Tools:** `get_design_context` (primary), `get_screenshot`, `get_metadata`
- **Params:** `clientFrameworks: "vue,nuxt"`, `clientLanguages: "javascript,scss,html"`
- **CDN URLs expire in 7 days** — download assets and commit to `static/img/`
- **Page-to-Figma mapping:** `sotuv-markaz-frontend/.visual-agent/page-list.json`

---

## 6. KNOWN STATE (as of 2026-04-30)

### Done
- Backend core (12+ Django apps, all APIs)
- Frontend core (97 pages, 20 Vuex modules)
- UI/design migration (80+ files, tokens, header, footer, login)
- Learning backend (courses, tests, certificates)
- SalesIQ specification (32 questions, 4 phases)
- Seed data command

### In progress
- Figma audit (header/footer done, remaining pages pending)
- SalesIQ stakeholder questions (waiting for Malika's answers)
- Local dev environment (docker-compose needed)

### Not started
- SalesIQ Django app (`src/salesiq/`)
- SalesIQ frontend integration
- RAGFlow deployment (server not purchased)
- AI agent pipeline
- Production deployment
- Candidate profile page (DISC/PAEI charts)

---

## 7. AGENT SYSTEM (`.claude/agents/`)

Three specialist agent instruction files exist from prior Windsurf sessions:
- `fe-pages-agent.md` — page-level Vue files
- `fe-components-agent.md` — reusable components
- `fe-styles-agent.md` — global SCSS

These can be used as reference for Claude Code sub-agents or RAGFlow agents.
They contain detailed scope boundaries, quality gates, and workflow patterns.
