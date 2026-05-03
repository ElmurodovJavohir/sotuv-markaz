# System overview

## Platformaning ikki qismi

**Sotuv Markaz** ikkita alohida, lekin bog'liq productdan iborat:

| Product | Tavsif | Port | Repo |
|---------|--------|------|------|
| Job Marketplace | Kompaniyalar va sales mutaxassislarni bog'lash | 3004 | `infinitysales-frontend/` |
| Sales Training + SalesIQ | E-learning + AI assessment | 3005 | `infinitysales-learning/` |
| Backend API | Django REST + FastAPI | 8000 / 8001 | `infinitysales-backend/` |

Ikkala frontend **alohida codebase**, lekin shared SSO va unified user profile orqali bog'liq.

## Modullar

| Modul | Tavsif | Status |
|-------|--------|--------|
| AUTH | SSO, JWT — ikkala app uchun shared | ✅ Ishlaydi |
| Company Side | Employer dashboard, job posting, kandidat pipeline | ✅ Ishlaydi |
| Candidate Side | Profil, arizalar, SalesIQ natijalari | ✅ Ishlaydi |
| SalesIQ | AI assessment — hard + soft skills, DISC/PAEI | 📋 Spec tayyor, backend yo'q |
| Sales Training | E-learning: kurslar, testlar, sertifikat | ✅ Backend tayyor, frontend scaffold |
| Common | Bildirish, qidiruv, shared komponentlar | ✅ Ishlaydi |
| Chat | Worker ↔ Company xabar almashish | ✅ Ishlaydi |
| Payment | Click.uz integratsiya, tariff paketlar | ✅ Ishlaydi |
| Interview | Suhbat jadvallashtirish | ✅ Ishlaydi |

## User types

- **Worker** — ish izlovchi (telefon + SMS OTP orqali ro'yxatdan o'tadi)
- **Company** — ish beruvchi (alohida auth strategy)
- Bitta telefon raqam ikkala tipda ham ro'yxatdan o'tishi mumkin

## Qarang
- [[tech-stack]] — texnologiyalar batafsil
- [[ai-pipeline]] — RAGFlow agent rejasi
- [[../specs/salesiq-assessment]] — SalesIQ spetsifikatsiya
