# Known frontend bugs

## BUG-FE-001: VK Sans Display font yuklanmaydi

**Severity:** High (pre-existing)
**Status:** Ochiq
**Ta'sir:** Butun sayt Lato fallback da ishlaydi

`nuxt.config.js:49` — CDN URL 404 qaytaradi. Figma da barcha typography VK Sans Display da dizayn qilingan — hech biri to'g'ri ko'rinmaydi.

---

## BUG-FE-002: CTA gradient angle inconsistency

**Severity:** Low
**Status:** Ochiq

Figma da 3 xil burchak: 214.09°, 222.02°, 179.99°.
CLAUDE.md canonical: `213.7deg`.
Qaror: CLAUDE.md canonical ishlatish. Qarang: [[open-design-questions]]

---

## BUG-FE-003: Home page hero rasm yuklanmaydi

**Severity:** Medium (dev environment)
**Status:** Ochiq

CSS to'g'ri (`background-image: var(--bg-img)`), lekin API dan kelgan `image_url` dev serverda 404. Production da ishlashi mumkin.

---

## BUG-FE-004: search=undefined frontend bug

**Severity:** Low
**Status:** Ochiq

Frontend `undefined` o'zgaruvchini string sifatida API ga yuboradi. Backend ni ham fix qilish kerak ([[known-backend-bugs#BUG-BE-002]]).

---

## BUG-FE-005: og:title va meta hali "Infinity Sales"

**Severity:** Medium
**Status:** Ochiq

`pages/index.vue` va boshqa sahifalarda SEO meta taglar eski nom bilan.
Qarang: [[../decisions/0003-rebrand-sotuv-markaz]]
