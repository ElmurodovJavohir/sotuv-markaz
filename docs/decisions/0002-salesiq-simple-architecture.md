# ADR-0002: SalesIQ oddiy arxitektura

**Sana:** 2026-03
**Status:** Qabul qilingan
**Qaror beruvchi:** Javokhir

## Kontekst

SalesIQ assessment engine uchun ikki variant bor edi:
1. Murakkab: har bir savol uchun alohida scoring module, real-time AI evaluation
2. Oddiy: savollar + javoblar saqlanadi, submission da bitta AI review

## Qaror

Oddiy variant tanlandi:
- MCQ savollar — deterministic scoring (backend yoki client-side)
- Open-ended savollar — Claude API orqali baholash
- Barcha javoblar saqlanadi → submission tugaganda bitta API call
- Natija: score (0-100), DISC profil, PAEI profil, verdict (HA/EHTIMOL/YO'Q)

## Sabab

- MVP tezroq chiqadi
- AI call soni minimal (1 ta session uchun 1 ta call)
- Debugging oson — bitta JSON response
- Kelajakda murakkablashtirishga imkon bor

## Oqibat

- AI ning har bir savolni alohida baholashi yo'q
- Barcha scoring logic bitta prompt da
- Prompt engineering muhim — yaxshi natija uchun prompt sifati kerak
