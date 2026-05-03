# ADR-0005: Notion task uchun, Obsidian docs uchun

**Sana:** 2026-04-30
**Status:** Qabul qilingan
**Qaror beruvchi:** Javokhir

## Kontekst

Loyiha dokumentatsiyasi va task management uchun bitta yoki ikkita tool ishlatish haqida qaror kerak edi.

## Qaror

Ikki tool, aniq bo'linish bilan:

**Notion (Free plan):**
- Task management (Kanban board)
- Sprint tracking
- Stakeholder-facing docs (Malika ko'radigan narsalar)
- Quick status updates

**Obsidian (`docs/` papka repo ichida):**
- Arxitektura docs
- ADR (Architecture Decision Records)
- Spetsifikatsiyalar (SalesIQ, design tokens)
- Bug tracking va texnik qarz
- Playbooks (Claude Code, feature workflow)
- Meeting eslatmalari

## Sabab

- Notion Free plan — limitlar yo'q (1 member), lekin knowledge base uchun ideal emas
- Obsidian — markdown fayllar repo da, Claude Code ko'ra oladi, git history bor
- Qoida: Notion da "nima qilish kerak" — Obsidian da "nega va qanday"

## Sinxronlash qoidasi

- Yangi ADR qabul qilinganda → CLAUDE.md ga muhim nuqtalarni qo'shish
- Task status o'zgarganda → faqat Notion da yangilash
- Bug topilganda → Obsidian da `bugs/` ga yozish, Notion da task yaratish
