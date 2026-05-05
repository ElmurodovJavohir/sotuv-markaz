# Known backend bugs

> Frontend audit dan aniqlangan. Qarang: [[../decisions/0003-rebrand-sotuv-markaz]]

## BUG-BE-001: `/api/v1/common/catgory/with-salary` typo

**Severity:** Medium
**Status:** Yopildi (commit 622e26a, 2026-05-04)

URL da `category` o'rniga `catgory` yozilgan. Endpoint 301 redirect qaytaradi — har bir frontend call ga 200-500ms latency qo'shadi.

**Fix bajarildi:** `/category/with-salary/` to'g'ri URL bilan ishlaydi. Eski `/catgory/with-salary/` `RedirectView` orqali permanent (301) redirect qaytaradi.

---

## BUG-BE-002: Skills endpoint performance

**Severity:** Medium
**Status:** Yopildi (commit 878de03, 2026-05-05)

`/api/v1/common/skills/?search=<query>` ba'zan 2+ soniya javob bermaydi (PEND).
`search=undefined` yuborilganda (frontend bug) — butun filtrsiz natija qaytadi.

**Fix bajarildi:**
- `src/helpers/functions.py::normalize_search()` helper qo'shildi — `undefined`/`null`/`none`/`nan`/whitespace ni bo'sh search sifatida treat qiladi.
- 6 view fayl ichida 10 search call site ushbu helper bilan o'rab olindi (worker skills, tags, kategoriya search, kompaniya/vacancy header search, wishlist va h.k.).
- `WorkerSkills.title` ustida trigram GIN index allaqachon mavjud (migration `0209_workerskills_trigram_index`).

---

## BUG-BE-003: Category select endpoint

**Severity:** Low
**Status:** Tekshirildi — kod sog'lom, prod cache ni tekshirish kerak

`/api/v1/common/category/select/` ba'zan PEND.

**Tekshiruv natijasi (2026-05-05):**
- Lokal profilingdagi haqiqiy holat: 39 parent + 3 daraja child uchun atigi **2 query**, jami **16-22ms** DB+serialization (`prefetch_related` to'g'ri ishlaydi).
- HTTP wall-time ~400ms — bu middleware (auth, debug toolbar, language detection) tufayli, query xarajati emas.
- Lokal `USE_CACHE=False` bo'lgani uchun `cache_page()` no-op. Prod-da `USE_CACHE=True` da cache hit darhol qaytadi.

**Asosiy ishonchli sabab "PEND" hodisalari uchun:** prod cache miss yoki cache backend (Redis) bilan tarmoq muammolari. Kod tarafida tuzatish kerak emas.

**Tavsiya:** prod-da APM (Sentry Performance) bilan p95 latency va cache hit-rate ni kuzatish.

---

## BUG-BE-004: Test fayllar bo'sh

**Severity:** Low (lekin AI workflow uchun blocker)
**Status:** Ochiq

`src/company/tests.py` — `# Create your tests here.` yozilgan, bo'sh.
Boshqa app larda ham testlar yo'q yoki minimal.

AI kod o'zgartirganida natijani tekshira olmaydi.


---

## BUG-BE-005: Seed company avatars are placeholder text-on-color PNGs

**Severity:** Low (cosmetic — affects only dev/seed environment)
**Status:** Ochiq

`seed_test_data.py` generates `cdn/avatars/test_company_<id>.png` as 512×512 PNGs containing only a solid color square with the company name rendered as text in the center (e.g. yellow square with "Ucell" written on it).

Frontend code already pulls `item.avatar_url` correctly via `<img>` (same pattern as `CompanyServiceCard.vue` `item.image_url` and blog posts), but the rendered result looks text-styled rather than like a real branded logo because the source PNG itself contains text.

Per Figma node 2129:48730 the design expects real branded company logos (Texnomart yellow with star icon, TBC Bank teal with mark, Saber Group abstract logo, Korzinka shopping cart, etc.).

**Fix on backend:** either bundle real logo PNGs in the seed data fixtures, or rewrite the placeholder generator to draw a generic icon (building/briefcase silhouette) instead of company-name text.

**Frontend:** already correct, no change needed.

---

## BUG-BE-006: `/api/v1/common/feedback/` endpoint missing

**Severity:** High (footer "Обратная связь" modal cannot submit)
**Status:** Yopildi (2026-05-06) — `Feedback` model + `FeedbackCreateView` (AllowAny) + URL route added in `src/common/`, migration `0211_feedback`. Verified: `POST /api/v1/common/feedback/` → 201.

`Footer.vue::netvorkForm()` POSTs `name`, `phone`, `text` to `/api/v1/common/feedback/`.

- Browser network tab: `OPTIONS /api/v1/common/feedback/` → 200 (CORS preflight passes), `POST` → 404 Not Found, Django renders "Page not found" (URLconf has no matching pattern).
- Confirmed: `src/common/urls.py` has no `feedback/` route, and there is no `Feedback` model/view/serializer anywhere in `src/common/`.
- Both worker (`#netvork`) and company (`#netvork_g`) feedback variants hit the same endpoint, so both modals are broken.

**Fix on backend:** add `Feedback` model (name, phone, text, created_at), `FeedbackCreateView` (POST only, AllowAny), and `path("feedback/", ...)` in `src/common/urls.py`. Optional: forward to admin email or Telegram bot on save.

**Frontend:** already correct after [components/Footer.vue:320](sotuv-markaz-frontend/components/Footer.vue:320) was changed from `/api/v1/common/feedback/` to `/common/feedback/` (axios baseURL prepends `/api/v1`).
