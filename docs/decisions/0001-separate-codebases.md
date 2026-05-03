# ADR-0001: Job Marketplace va Sales Training alohida codebase

**Sana:** 2026-03
**Status:** Qabul qilingan
**Qaror beruvchi:** Javokhir

## Kontekst

Platformada ikkita asosiy product bor: Job Marketplace va Sales Training. Ularni bitta monorepo da yoki alohida repolarda yuritish haqida qaror kerak edi.

## Qaror

Alohida codebase, shared SSO orqali bog'liq:
- `infinitysales-frontend/` — Job Marketplace (Nuxt 2, port 3004)
- `infinitysales-learning/` — Sales Training + SalesIQ (port 3005)
- `infinitysales-backend/` — umumiy backend (Django + FastAPI)

## Sabab

- Har bir product o'z tezligida rivojlanadi
- Deploy alohida — biri buzilsa ikkinchisiga ta'sir qilmaydi
- Backend bitta chunki database va auth shared
- SSO orqali user ikki platformada ham bir identity bilan kiradi

## Oqibat

- Frontend komponentlar share qilinmaydi (duplicate bo'lishi mumkin)
- Auth logic backend da markazlashgan — frontend lar faqat token oladi
- Yangi dev kelganda 3 ta repo ni tushuntirish kerak
