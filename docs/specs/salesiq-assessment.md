# SalesIQ Assessment spetsifikatsiya

**Status:** Spec tayyor, backend implement qilinmagan
**Qaror:** [[../decisions/0002-salesiq-simple-architecture]]

## Umumiy

- 32 ta savol, 4 faza
- Bir martalik test — qayta topshirish yo'q
- Progress saqlanadi (autosave)
- Savollar har sessiya uchun AI tomonidan generatsiya qilinadi
- Natija faqat kandidatga ko'rinadi (verdict) — kompaniya to'liq natijani ko'radi

## 4 faza

| Faza | Savollar soni | Turi | Baholash |
|------|--------------|------|----------|
| 1. Psixologik profil | 12 | MCQ | DISC, PAEI, MBTI, Big Five, Grit |
| 2. Emotional Intelligence | 8 | MCQ | Stress, empathy, self-regulation |
| 3. Sales hard skills | 8 | MCQ + 1 open-ended | Prospecting, SPIN, objections, closing |
| 4. Amaliy scenariylar | 4 | Open-ended | Role-play, resilience, best deal, time mgmt |

## Scoring

| Modul | Ball |
|-------|------|
| Psixologik | 25 |
| EQ | 20 |
| Savdo | 25 |
| Amaliy | 20 |
| Grit | 10 |
| **Jami** | **100** |

## Verdict

| Daraja | Ball oralig'i | Ma'nosi |
|--------|--------------|---------|
| HA (Elite) | 85-100 | Darhol yollash tavsiya |
| HA (Yaxshi) | 70-84 | Yollash mumkin |
| EHTIMOL | 55-69 | Qo'shimcha suhbat kerak |
| YO'Q (Past) | 40-54 | Tavsiya etilmaydi |
| YO'Q (Mos emas) | 0-39 | Mos kelmaydi |

## Profil mapping

- DISC: Dominant, Influential, Steady, Compliant
- PAEI: Producer, Administrator, Entrepreneur, Integrator
- Har bir MCQ javob varianti DISC/PAEI ballariga ta'sir qiladi

## AI evaluation (open-ended)

- Claude API orqali (backend da route qilinadi)
- Bitta API call — barcha javoblar bir vaqtda yuboriladi
- Natija: structured JSON (score, profiles, verdict, insights)

## Ochiq savollar (stakeholder bilan hal qilish kerak)

Batafsil ro'yxat: past conversation da mavjud.
Asosiy ochiq masalalar:
- Har bir MCQ javobning aniq balli
- Test vaqt chegarasi bormi
- Modul vaznlari (hozirgi: 25/20/25/20/10)
- AI evaluation uchun aniq mezonlar
- Tizim integrity qoidalari (copy-paste, tab switch)

## Backend implement rejasi

1. `src/salesiq/` app yaratish
2. Modellar: Assessment, Question, Response, AIReview
3. API: start test, save progress, submit, get results
4. Claude API integration (FastAPI orqali)
5. Company-side results view
