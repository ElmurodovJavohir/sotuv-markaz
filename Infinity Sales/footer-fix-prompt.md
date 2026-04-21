# Claude Code Prompt — Fix Footer.vue

## Context

File: `infinitysales-frontend/components/Footer.vue`
SCSS: `infinitysales-frontend/assets/scss/_main.scss` (footer styles are inside `footer {}` block)
Figma design: node `270-5388`, file `whwt0wJFk3XFkkXNsVgqQh`

---

## What the Figma shows

Dark background (`#19192d`) full-width footer with two zones:

**Top zone — 4 link columns:**
| Col | Header | Links |
|---|---|---|
| 1 | Infinity sales | О нас · Обратная связь · Наши вакансии · Скачать приложение · F.A.Q. |
| 2 | Соискателям | Создать резюме · Обратная связь · Наши вакансии · Скачать приложение |
| 3 | Работодателям | Опубликовать вакансию |
| 4 | **Полезно** | Ресурсы бренда · Партнёрам · Инвесторам · Реклама на сайте · Календарь |

Column headers: white, font-weight 600, font-size ~14px
Link text: `#768194` (grey), font-size ~14px, hover → white

**Bottom bar:**
- Left: Infinity Sales logo (white version)
- Center: Social icons in rounded squares — LinkedIn, Facebook, Instagram, YouTube, Twitter/X, Telegram
- Right: Decorative wings/logo icon

---

## Rules (from CLAUDE.md — MUST follow)

### ✅ CAN change
- Visual styles: colors, fonts, spacing, border-radius
- Layout visible in Figma
- Scoped `<style>` block in Footer.vue + relevant SCSS partial

### ❌ NEVER touch
- `this.$axios`, Vuex dispatch/commit, `$auth`
- i18n keys `$t()` — do not add, remove, or rename
- Dynamic data logic (`footer` array, `links.settings`, `kFormatter`, etc.)
- Route definitions, form logic (`netvorkForm`, vuelidate `$v`)

---

## Issues to Fix

---

### 🔴 CRITICAL — Column 4 is missing its header "Полезно"

The fourth column (`col-sm-5 col-lg-3`, around line 370) currently has no heading above the link list:

```html
<!-- CURRENT — no header -->
<div class="col-sm-5 col-lg-3 text-left">
  <ul class="menu">
    <li><nuxt-link :to="localePath('/company-brand')">{{ $t('brand_logo') }}</nuxt-link></li>
    ...
```

The Figma clearly shows "Полезно" as the column header, matching the structure of columns 1–3 which all have a `<p>` tag header.

**Fix:** Check if the i18n key `$t('footer.useful')` or `$t('footer.title3')` or `$t('footer.title4')` exists by running:
```bash
grep -rn "useful\|title3\|title4\|Полезно" assets/locales/ lang/ locales/ i18n/
```

If a matching key exists, add it as a `<p>` header above the `<ul>`:
```html
<div class="col-sm-5 col-lg-3 text-left">
  <p>{{ $t('footer.FOUND_KEY') }}</p>   <!-- use the actual key found above -->
  <ul class="menu">
```

If no matching key exists, **flag and ask** the user before adding anything. Do not hardcode the string "Полезно".

---

### 🟠 VISUAL — Statistics block in column 1 is not in the Figma design

Column 1 (`.mobile-op`) contains a `block-info _ac` section with visitor/view counters:

```html
<div class="block-info _ac">
  <ul class="users">...</ul>  <!-- visitor counts -->
  <ul class="click">...</ul>  <!-- view counts -->
</div>
```

The Figma shows only clean link lists in this column — no statistics block.

**⚠️ FLAG AND ASK FIRST** — This stats block may be intentionally kept in production even if not in Figma. Ask the user: "The Figma footer doesn't show the visitor statistics block in column 1. Should it be hidden with `display: none` on mobile/desktop, or is it meant to stay?" Do not hide or remove it until confirmed.

---

### 🟠 VISUAL — Social icons use `#768194` fill but should have subtle background

The Figma shows social icons as icon glyphs inside semi-transparent rounded square containers (low-opacity `#768194` background, `rx="6"` border radius), grey glyph fill.

The current code renders each social link as **two SVGs stacked** — one grey (default) and one colored (hover). This is a hover effect. The default state in Figma matches the grey version, so the default appearance is correct.

**However:** Check the scoped or global CSS for `.soc li a` to verify the hover SVG swap works correctly (`:nth-child(1)` opacity 1, `:nth-child(2)` opacity 0, reversed on hover). If this logic is broken or missing, add:

```scss
.soc {
  li a {
    position: relative;
    display: inline-flex;

    svg:nth-child(2) {
      position: absolute;
      top: 0; left: 0;
      opacity: 0;
      transition: opacity 0.2s;
    }

    &:hover {
      svg:nth-child(1) { opacity: 0; }
      svg:nth-child(2) { opacity: 1; }
    }
  }
}
```

Only add if the current SCSS doesn't already have this logic.

---

### 🟠 VISUAL — Column link text color needs to match Figma

In Figma, footer link text is `#768194` (grey) on the dark `#19192d` background, and hover → white.

Check the current footer `ul.menu li a` styles. If they use `$grey` (`#768194`) — that is correct. If they use `$dark-blue` or another color, update to `#768194` with `&:hover { color: #ffffff; }`.

---

### 🟡 MINOR — Column 1 has an extra hardcoded link not in other columns

Column 1 has a hardcoded link at the bottom of the list:
```html
<li>
  <a href="#" @click="$bvModal.show('netvork')">{{ $t('footer.network') }}</a>
</li>
```

This is a modal trigger for a contact/network form. The Figma doesn't show this link explicitly but also doesn't show it missing. **Leave it as-is** — do not remove it. Only ensure it inherits the correct text color.

---

### 🟡 MINOR — Bottom bar logo link always points to `/worker/home`

```html
<nuxt-link :to="`/${$i18n.locale}/worker/home`" class="logo ...">
```

This is hardcoded to worker even when `type === 'company'`. Update to:
```html
<nuxt-link
  :to="type === 'company' ? `/${$i18n.locale}/company/home` : `/${$i18n.locale}/worker/home`"
  class="logo d-flex align-items-center"
  aria-label="link"
>
```

---

## What NOT to do

- Do not modify `netvorkForm`, `$v` validation, or any `$axios` calls
- Do not remove the dynamic `footer` array rendering (columns 1-3 link lists come from API)
- Do not remove the visitor stats block without user confirmation
- Do not add any i18n keys not already defined in the locale files
- Do not touch `infinitysales-backend/`

---

## Execution order

1. Find the "Полезно" i18n key → add `<p>` header to column 4 (or ask if not found)
2. Fix bottom logo link to respect `type` prop
3. Verify/add social icon hover swap CSS if missing
4. Check column 1 link text color matches `#768194`
5. Ask about stats block visibility before touching it
6. Verify final output:
   ```bash
   grep -n "col-sm-5 col-lg-3" components/Footer.vue
   # should show a <p> header above the last <ul class="menu">
   ```
