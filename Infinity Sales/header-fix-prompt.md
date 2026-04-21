# Claude Code Prompt — Fix Header.vue

## Context

File: `infinitysales-frontend/components/Header.vue`
SCSS: `infinitysales-frontend/assets/scss/_header.scss`

The Figma design for this header (node `509-28511`, file `whwt0wJFk3XFkkXNsVgqQh`) shows two states:

**State 1 — Unauthenticated (`.header-main`):**
- Left: Two toggle buttons — "Поиск работы" (outlined) + "Поиск сотрудников" (blue gradient)
- Center: Infinity Sales logo
- Right: Language dropdown (flag + chevron), "Войти" button (dark #19192d, with icon), "Опубликовать вакансию" button (blue gradient)

**State 2 — Authenticated (`.header-signed-in`):**
- Row 1: Logo → Search bar (keyword input + location pin + "Поиск" button) → Language dropdown → Chat icon → Bell icon → User avatar + name + role label + chevron
- Row 2 (bottom nav): Tabbed links — "Главная", "Все кандидаты" / "Все вакансии", "Кандидаты / Вакансии ближе к вам", "по отраслям", "Моя доска"

---

## Rules (from CLAUDE.md — MUST follow)

### ✅ CAN change
- Visual styles: colors, fonts, spacing, border-radius, shadows
- Layout differences clearly visible in Figma
- Scoped `<style>` block in Header.vue
- `_header.scss` partial

### ❌ NEVER touch
- `this.$axios` calls, Vuex dispatch/commit, `$auth`, middleware
- i18n keys (`$t()`) — do not add, remove, or rename
- Route definitions, props, emits, business logic in methods/computed

---

## Issues to Fix

### 🔴 CRITICAL — Placeholder/junk text (must remove)

In **both** the worker and company `<ul class="menu__list">` sections, inside `.adap2` divs, there are leftover test strings that must be cleaned up. They appear twice (once for worker, once for company):

```html
<!-- BROKEN — appears inside .adap2 in both worker and company menus -->
<b-button v-b-modal.modal2 class="header__btn header-btn">
  <span class="header-btn__body">sdfsdf</span>   <!-- ← junk text -->
</b-button>
<b-modal id="modal1" size="lg" title="">          <!-- ← ID mismatch: triggers modal2, defines modal1 -->
  <div class="popup__body">
    <h1 class="popup__title">asdfsadf</h1>         <!-- ← junk text -->
    <div class="popup__subtitle">asddfsadf</div>   <!-- ← junk text -->
    <div class="popup__buttons">
      <nuxt-link :to="`/${$i18n.locale}/form/team`" ...>asdfasdfa</nuxt-link>   <!-- ← junk -->
      <nuxt-link :to="`/${$i18n.locale}/form/single`" ...>asdfasdf</nuxt-link>  <!-- ← junk -->
    </div>
  </div>
</b-modal>
```

**Fix:** Remove these entire `<b-button>` + `<b-modal>` blocks from both `.adap2` instances (worker menu and company menu). The `.adap2` divs that contain them should only keep the language dropdown.

---

### 🔴 CRITICAL — CSS typo breaking layout

In the desktop language dropdown (`header-right`), `ml-[10pxx]` appears twice (typo — double `x`):

```html
<span class="ml-[10pxx]">O'zbekcha</span>
<span class="ml-[10pxx]">Русский</span>
```

**Fix:** Change both to `ml-[10px]`.

---

### 🟠 VISUAL — Chat button spacing is off

Current chat button:
```html
<button class="btn notifications _i chat_i !ml-[32px] !mr-[21px]">
```

The `!mr-[21px]` is an odd value. The notification button right after it has `!mr-[32px] !ml-[0px]`. Based on the Figma design, both icon buttons should have equal and consistent spacing. Adjust to:
```html
<button class="btn notifications _i chat_i !ml-[32px] !mr-[16px]">
```
And the bell button:
```html
<button class="btn notifications _i !ml-[16px] !mr-[32px]">
```
This creates a consistent 16px gap between the two icon buttons and 32px outer margins.

---

### 🟠 VISUAL — Signed-in header is missing the search bar

The Figma shows a prominent search bar in the authenticated header row (between logo and right-side icons). The SCSS already has `.header-search` styles defined in `_header.scss` but the template currently has no search bar markup in `header-signed-in > .top`.

The search bar should be placed between the logo and the `.header-right` div. Use the existing pattern from the unauthenticated header (`.header-main`) if it exists, or look for the search input referenced in the SCSS:

```html
<!-- Insert after the logo nuxt-link and before .header-right -->
<div class="header-search mobile-hidden flex-grow-1 mx-4">
  <div class="form-group-wrap d-flex align-items-center">
    <div class="form-group" :class="{ _focus: searchFocus, green: type === 'company' }">
      <i><icons name="search" /></i>
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="type === 'worker' ? $t('search.worker_placeholder') : $t('search.company_placeholder')"
        @focus="searchFocus = true"
        @blur="searchFocus = false"
        @keyup.enter="doSearch"
      />
    </div>
    <button class="btn-blue text-white px-4" @click="doSearch">
      {{ $t('btns.search') }}
    </button>
  </div>
</div>
```

**⚠️ FLAG AND ASK FIRST** before adding this — confirm whether search functionality exists in the codebase (check if `searchQuery` and `doSearch` are already in data/methods, or if this is a new feature). If not present, skip this item and report back.

---

### 🟡 MINOR — Button `aria-label` on mobile menu icon

The hamburger menu toggle `<div class="header__menu menu mr-25" @click="toggleMenu">` has no `aria-label`. Add `aria-label="Toggle menu"` to the wrapping div for accessibility.

---

## What NOT to do

- Do not modify any `this.$axios`, `this.$store`, `$auth`, or `$t()` calls
- Do not rename or restructure Vuex getters/actions
- Do not touch `nuxt.config.js`, `tailwind.config.js`, or store files
- Do not modify the logout modal logic (`sure_delete_b`, `sure_delete_g`)
- Do not touch `infinitysales-backend/`

---

## Execution order

1. Remove the two junk `<b-button>` + `<b-modal>` blocks (worker `.adap2` and company `.adap2`)
2. Fix the two `ml-[10pxx]` → `ml-[10px]` typos
3. Fix chat/bell button spacing
4. Check if search bar exists in data/methods → report before adding
5. Add `aria-label` to hamburger toggle div
6. Run grep sweep: `grep -n "sdfsdf\|asdfsdf\|asdfasd\|10pxx" components/Header.vue` to confirm no junk remains
