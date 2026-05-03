# Open design questions

> Figma bilan kod o'rtasida hal qilinmagan savollar.
> Har bir savol uchun qaror qabul qilinganda → ADR ga yozish.

## OQ-001: OTP digit count — 5 yoki 6?

**Sahifa:** Forgot password step 2
**Figma:** 6 ta digit box
**Kod:** CodeInput.vue 5 ta render qiladi
**Kerak:** Backend SMS OTP uzunligini tekshirish
**Qaror:** ❓ Kutilmoqda

## OQ-002: Guest header — transparent yoki white?

**Sahifa:** Home page
**Figma:** Dark/transparent header hero ustida
**Kod:** Doim oq background
**Kerak:** IntersectionObserver (script o'zgartirish talab qiladi)
**Qaror:** ❓ Script lock olib tashlanishi kerak

## OQ-003: Home header logged-in variant

**Figma:** Faqat guest variant bor (node 2129:49045)
**Kerak:** Logged-in user transparent header ko'radimi?
**Qaror:** ❓ Malika dan so'rash

## OQ-004: Social login buttons

**Sahifa:** Login, Register
**Figma:** Google, Apple, Telegram, Facebook, OneID ikonlar
**Kod:** Hammasi `href="#"` — OAuth flow yo'q
**Qaror:** ❓ Placeholder sifatida qoldirish yoki olib tashlash

## OQ-005: "Learn" button destination

**Sahifa:** Home header
**Figma:** Button bor, link target ko'rinmaydi
**Kerak:** Learning app ga (`port 3005`) yoki specific sahifaga
**Qaror:** ❓ Kutilmoqda

## OQ-006: Footer "Обратная связь" — modal yoki link?

**Figma:** Link sifatida ko'rsatilgan
**Kod:** `$bvModal.show('netvork')` — modal ochadi
**Kerak:** Backend da `action` field yoki hardcode qoldirish
**Qaror:** ❓ Qarang [[../decisions/0003-rebrand-sotuv-markaz]] — footer rebranding bilan birga hal qilish
