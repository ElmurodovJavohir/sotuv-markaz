# Sotuv Markaz — Knowledge Base

**Domen:** sotuv-markaz.uz
**Jamoa:** Javokhir (Tech Lead/PM), Malika Xakimova (Founder)
**Stack:** Django + DRF + FastAPI | Nuxt 2 + Vue 2 | PostgreSQL | RAGFlow + Claude API
**GitHub:** [backend](https://github.com/ElmurodovJavohir/sotuv-markaz-backend) | [frontend](https://github.com/ElmurodovJavohir/sotuv-markaz-frontend)

---

## Navigatsiya

### Arxitektura
- [[architecture/system-overview]] — platformaning umumiy tuzilishi
- [[architecture/tech-stack]] — texnologiyalar va versiyalar
- [[architecture/ai-pipeline]] — RAGFlow agent pipeline rejasi
- [[architecture/migration-inventory]] — codebase inventarizatsiyasi (97 sahifa, 20 store, 135+ API)

### Spetsifikatsiyalar
- [[specs/salesiq-assessment]] — SalesIQ 32 savol, 4 faza, scoring, verdict
- [[specs/candidate-profile]] — DISC/PAEI natijalar sahifasi (rejada)
- [[specs/design-tokens]] — Figma → kod token migratsiyasi (rejada)

### Qarorlar (ADR)
- [[decisions/0001-separate-codebases]] — ikki frontend alohida repo
- [[decisions/0002-salesiq-simple-architecture]] — SalesIQ oddiy arxitektura
- [[decisions/0003-rebrand-sotuv-markaz]] — Infinity Sales → Sotuv Markaz
- [[decisions/0004-local-server-not-vps]] — Server lokal, VPS emas
- [[decisions/0005-notion-free-obsidian-docs]] — Notion task, Obsidian docs

### Buglar va texnik qarz
- [[bugs/known-backend-bugs]] — API buglar (4 ta)
- [[bugs/known-frontend-bugs]] — UI buglar (5 ta)
- [[bugs/open-design-questions]] — Figma hal qilinmagan savollar (6 ta)

### Playbooks
- [[playbooks/claude-code-session]] — Claude Code bilan ishlash tartibi
- [[playbooks/new-feature-workflow]] — Yangi feature qo'shish jarayoni
- [[playbooks/figma-to-code]] — Figma dizaynni kodga o'tkazish

### Migration review (legacy)
- [[migration-review/footer/BACKEND_AUDIT]] — footer backend audit
- [[migration-review/footer/BACKEND_FOOTER_BACKLOG]] — footer backend tasklar
- `.migration-review/` papkasida Figma screenshots va audit fayllar mavjud

### Uchrashuvlar
- Papka: `meetings/` — har bir uchrashuv `YYYY-MM-DD-mavzu.md` formatda

---

## Sinxronlash qoidalari

| Nima | Qayerda |
|------|---------|
| Task management (nima qilish kerak) | **Notion** (Kanban) |
| Architecture, specs, decisions (nega va qanday) | **Obsidian** (shu vault) |
| AI yo'riqnoma | **CLAUDE.md** (har bir repo da) |
| Umumiy kontekst | **SHARED.md** (root da) |

Yangi ADR qabul qilinganda → CLAUDE.md ga muhim nuqtalarni sync qiling.
Bug topilganda → Obsidian `bugs/` ga yozing + Notion da task yarating.
