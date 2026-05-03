# AI agent pipeline

## Arxitektura

```
Javokhir (Director)
       ↓
  PM Agent — feature → task breakdown, API spec
   ↙      ↘
Backend    Frontend
Agent      Agent
       ↓
  Review Agent — kod sifati, best practices
       ↓
  Biznes agentlar
   ↙          ↘
SalesIQ      Job Matcher
Agent        Agent
```

## Agentlar

| Agent | Rol | Stack | Status |
|-------|-----|-------|--------|
| PM Agent | Feature request → tasks, API spec, sprint breakdown | RAGFlow + Claude | 📋 To Do |
| Backend Agent | Django models, FastAPI routes, migrations, pytest | RAGFlow + Claude | 📋 To Do |
| Frontend Agent | Vue/Nuxt komponentlar, API integratsiya | RAGFlow + Claude | 📋 To Do |
| Review Agent | Kod sifati, best practices, xatoliklarni aniqlash | RAGFlow + Claude | 📋 To Do |
| SalesIQ Agent | Kandidat javoblarini AI bilan baholash | Claude API | 📋 To Do |
| Job Matcher Agent | Kandidat profili ↔ vakansiya moslashtirish | RAGFlow + Claude | 📋 To Do |

## Server talablari

| Parametr | Minimum | Optimal |
|----------|---------|---------|
| RAM | 8 GB | 16 GB |
| CPU | 2 core | 4-6 core |
| Disk | 40 GB | 256 GB SSD |
| OS | Ubuntu 22.04 | Ubuntu 22.04 |

Qaror: [[../decisions/0004-local-server-not-vps]] — lokal server, VPS emas.

## 8 fazali roadmap

| # | Bosqich | Blocker |
|---|---------|---------|
| 0 | RAGFlow Docker o'rnatish | Server kerak |
| 1 | PM Agent system prompt va test | RAGFlow ishlashi |
| 2 | Backend Agent | Phase 1 |
| 3 | Frontend Agent | Phase 1 |
| 4 | Orchestration pipeline (PM → BE → FE) | Phase 1-3 |
| 5 | GitHub MCP ulash | Phase 4 |
| 6 | Review Agent | Phase 4 |
| 7 | SalesIQ + Job Matcher agentlari | Phase 6 |

## Hozir nimani AI qiladi (server kutmasdan)

**Claude Code (CLI)** — terminal dan `claude` buyrug'i bilan:
- Kod yozish/o'zgartirish (backend + frontend)
- Figma MCP orqali dizayn audit
- Test yozish
- Migration yaratish
- Code review

Bu uchun kerak: yangilangan CLAUDE.md + docker-compose + testlar.
Batafsil: [[../playbooks/claude-code-session]]
