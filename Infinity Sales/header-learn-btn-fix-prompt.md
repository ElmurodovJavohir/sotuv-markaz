# Claude Code Prompt — Remove rogue "Learn" button from unauthenticated header

## Context

File: `infinitysales-frontend/components/Header.vue`
Figma reference: node `2129-49892`, file `whwt0wJFk3XFkkXNsVgqQh`

**Symptom:** In the unauthenticated `.header-main`, the right-side auth area shows an extra dark "Learn" button (visible in the Uzbek locale between "Kirish" and "Rezyumeni yaratish"). It does NOT appear in the Figma design.

---

## Root Cause — found at line 2570

Inside `<div class="auth-wrapper">` in the unauthenticated header, there is an unfinished Learning Platform link that was prematurely added:

```html
<!-- REMOVE THIS ENTIRE BLOCK — lines 2570–2575 -->
<nuxt-link to="/learning" class="header-learn-btn">
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 1L1 5l8 4 8-4-8-4zM1 9l8 4 8-4M1 13l8 4 8-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <span>Learn</span>
</nuxt-link>
```

**Why it's wrong:**
- Not in the Figma design — the auth area should only have: login button → CTA (Создать резюме / Опубликовать вакансию)
- Hardcoded English `"Learn"` — not using `$t()`
- Route `/learning` has no locale prefix and no `localePath()`
- No `v-if` — renders unconditionally for all users, all locales, both `type === 'worker'` and `type === 'company'`

---

## Fix

**Step 1 — Remove the nuxt-link block** (lines 2570–2575):

Delete these 6 lines entirely:
```html
<nuxt-link to="/learning" class="header-learn-btn">
  <svg ...>...</svg>
  <span>Learn</span>
</nuxt-link>
```

The `<div class="auth-wrapper">` should contain only two children after this fix:
1. The login `<nuxt-link class="btn btn-login ...">` (the "Войти" / "Kirish" button)
2. The register `<nuxt-link class="register-btn" ...>` (the "Создать резюме" / "Опубликовать вакансию" button)

---

**Step 2 — Remove the orphaned CSS** in the scoped `<style>` block (near the bottom of the file):

```scss
/* REMOVE THIS ENTIRE BLOCK */
.header-learn-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 20px;
  background: #19192d;
  border: none;
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  /* ... rest of the rule */
}
```

Find the `.header-learn-btn` rule in the scoped style block and delete it entirely.

---

## Rules (MUST follow)

- ✅ Delete the template block + its CSS rule
- ❌ Do NOT modify any other part of the auth-wrapper
- ❌ Do NOT touch the login or register nuxt-link elements
- ❌ Do NOT add, rename, or remove any `$t()` keys
- ❌ Do NOT touch `infinitysales-backend/`

---

## Verification

After the fix, run:
```bash
grep -n "Learn\|learning\|header-learn-btn" components/Header.vue
```

Expected result: **zero matches** (or only commented-out code).

Also confirm the auth-wrapper now has exactly 2 children:
```bash
grep -n "auth-wrapper\|btn-login\|register-btn" components/Header.vue
```
