# Known backend bugs

> Frontend audit dan aniqlangan. Qarang: [[../decisions/0003-rebrand-sotuv-markaz]]

## BUG-BE-001: `/api/v1/common/catgory/with-salary` typo

**Severity:** Medium
**Status:** Ochiq
**Topilgan:** 2026-04 (frontend API audit)

URL da `category` o'rniga `catgory` yozilgan. Endpoint 301 redirect qaytaradi — har bir frontend call ga 200-500ms latency qo'shadi.

**Fix:** URL pattern ni to'g'rilash + backward compat uchun eski URL da permanent redirect qo'yish.

---

## BUG-BE-002: Skills endpoint performance

**Severity:** Medium
**Status:** Ochiq

`/api/v1/common/skills/?search=<query>` ba'zan 2+ soniya javob bermaydi (PEND).
`search=undefined` yuborilganda (frontend bug) — butun filtrsiz natija qaytadi.

**Fix:** `"undefined"` string ni bo'sh search sifatida treat qilish. Index qo'shish.

---

## BUG-BE-003: Category select endpoint

**Severity:** Medium
**Status:** Ochiq

`/api/v1/common/category/select/` ba'zan PEND.
Ehtimoliy sabab: N+1 query yoki missing index.

---

## BUG-BE-004: Test fayllar bo'sh

**Severity:** Low (lekin AI workflow uchun blocker)
**Status:** Ochiq

`src/company/tests.py` — `# Create your tests here.` yozilgan, bo'sh.
Boshqa app larda ham testlar yo'q yoki minimal.

AI kod o'zgartirganida natijani tekshira olmaydi.
