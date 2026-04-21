# Claude Code Prompt — Fix Header.vue (Worker variant)

## Context

File: `infinitysales-frontend/components/Header.vue`
SCSS: `infinitysales-frontend/assets/scss/_header.scss`

This component is shared — it renders worker OR company UI based on the `type` prop (`'worker'` | `'company'`).

**The previous prompt (node 509-28511) covered the company header.**
**This prompt (node 335-5565) covers the worker header.** Fix worker-specific issues without breaking company behavior.

Figma design: node `335-5565`, file `whwt0wJFk3XFkkXNsVgqQh`

---

## What the Figma shows — Worker header

**State 1 — Unauthenticated (`.header-main`, `type === 'worker'`):**
- Left toggle: "Поиск работы" button = **active/filled** (blue gradient `linear-gradient(213.7deg, #0085ff 0%, #29b2ff 61.058%)`)
- Left toggle: "Поиск сотрудников" button = outlined/ghost
- Center: Infinity Sales logo
- Right: Language dropdown (flag + chevron) → "Войти" button (dark `#19192d`, login icon) → "**Создать резюме**" button (blue gradient)

**State 2 — Authenticated (`.header-signed-in`, `type === 'worker'`):**
- Row 1: Logo → Search bar (text input + **filter/sliders icon** + "Поиск" button) → Language dropdown → Chat icon → Bell icon → Avatar + Name + "**Соискатель**" label + chevron
- Row 2 (bottom nav): "Главная" | "Все вакансии" | "Вакансии ближе к вам" | "Вакансии по отраслям" | "Вакансии месяца" | "**Моя доска**"
- Active tab indicator: blue underline `#0085ff` (not green)

---

## Rules (from CLAUDE.md — MUST follow)

### ✅ CAN change
- Visual styles: colors, fonts, spacing, border-radius, shadows
- Scoped `<style>` block + `_header.scss`

### ❌ NEVER touch
- `this.$axios`, Vuex dispatch/commit, `$auth`, middleware
- i18n keys `$t()` — do not add, remove, or rename
- Route definitions, props, emits, business logic in methods/computed
- Company-specific code paths (`type === 'company'`)

---

## Issues to Fix (Worker-specific)

---

### 🔴 CRITICAL — "Моя доска" is styled differently from all other worker nav tabs

Worker nav tabs live inside `<nav v-if="user && user.user_type === 'worker' && type === 'worker'" class="d-flex">` (around line 1623). That nav contains: Главная, Все вакансии, Вакансии ближе к вам, Вакансии по отраслям, Вакансии месяца — all as `<nuxt-link class="btn"><button>...</button></nuxt-link>`.

But "Моя доска" is rendered **outside** that nav as a separate element:

```html
<!-- CURRENT — outside the nav, uses different .desc class -->
<nuxt-link
  v-if="!(company && user.user_type === 'company' && type === 'company')"
  :to="`/${$i18n.locale}/worker/desk/application`"
  class="desc"
  aria-label="link"
>
  <button aria-label="button">{{ $t('menu.desk') }}</button>
</nuxt-link>
```

This causes "Моя доска" to have different hover/active styles than the other tabs (it uses `.desc` selector rules in SCSS instead of nav `button` rules).

**Fix:** Move `$t('menu.desk')` inside the worker `<nav>` block, consistent with the other tabs. Add it as the last item:

```html
<nuxt-link
  :to="`/${$i18n.locale}/worker/desk/application`"
  class="btn"
  aria-label="link"
><button>{{ $t('menu.desk') }}</button></nuxt-link>
```

**Important:** The `v-if="!(company && ...)"` condition that wraps the current `.desc` element is there to prevent it showing for company. Once you move `$t('menu.desk')` into the worker nav (which already has its own `v-if="user.user_type === 'worker'"` guard), the original `.desc` element should be **removed** for the worker case only. Verify the company nav at line ~1663 already has its own "Моя доска" — it does — so removing the shared `.desc` element is safe.

---

### 🔴 CRITICAL — Junk/placeholder text (same as company prompt, affects worker menu too)

Inside the worker `<ul class="menu__list">` (the mobile menu), there are two `.adap2` divs. The first contains the language dropdown (keep it). The second also contains a dead `<b-button>` + `<b-modal>` block with placeholder text:

```html
<div class="adap2">
  <b-button v-b-modal.modal2 class="header__btn header-btn">
    <span class="header-btn__body">sdfsdf</span>   <!-- ← DELETE this block -->
  </b-button>
  <b-modal id="modal1" size="lg" title="">
    <div class="popup__body">
      <h1 class="popup__title">asdfsadf</h1>
      ...
    </div>
  </b-modal>
</div>
```

**Fix:** Remove the entire `<b-button>` + `<b-modal>` pair from the worker `<ul class="menu__list">` `.adap2`. Leave the language `<b-dropdown>` alone.
(Also remove the same block from the company `<ul class="menu__list">` `.adap2` if not already done.)

---

### 🔴 CRITICAL — CSS typo `ml-[10pxx]`

In the desktop language dropdown (`header-right`), two `<span>` elements have a double-`x` typo:

```html
<span class="ml-[10pxx]">O'zbekcha</span>
<span class="ml-[10pxx]">Русский</span>
```

Tailwind silently ignores `10pxx` so the spacing is zero. **Fix:** Change both to `ml-[10px]`.

---

### 🟠 VISUAL — Worker role label shows coin balance instead of "Соискатель"

In the Figma, under the user's name in the top-right avatar block, it shows the label **"Соискатель"** (worker) / **"Работодатель"** (company).

Current code (worker block, around line 599):
```html
<span data-profile="profile">
  {{ $t('account.balance') }}
  <span class="!text-[#19192d]">
    {{ coinBalance.coins }}
    <icon class="w-[12px] h-[12px]" name="coin" />
  </span>
</span>
```

This shows the coin balance. Figma shows the role label instead.

**⚠️ FLAG AND ASK FIRST** — The coin balance display may be intentional product behavior that differs from Figma. Before changing, ask the user: "Should the sub-label under the name show the role ('Соискатель'/'Работодатель') or keep the coin balance?" Do not change this until confirmed.

---

### 🟠 VISUAL — Worker search bar is missing the filter/sliders icon

The Figma shows a small sliders/filter icon (⊞) **inside** the search bar between the keyword input and the "Поиск" button — worker only. The company search bar does not have this icon.

Current worker search form (around line 1020): the `form-group-wrap` has the keyword input and the region dropdown, but no filter/sliders icon.

**⚠️ FLAG AND ASK FIRST** — Check if `<icons name="filter">` or similar exists in the icons component (`components/icons.vue`). Run: `grep -n "filter\|sliders\|tune" components/icons.vue`. If the icon exists, add it between the input wrapper and the search button. If it does not exist, report back without adding.

---

### 🟠 VISUAL — Bottom nav active state uses wrong color in SCSS

The SCSS for the bottom nav active/hover underline (`_header.scss`, around line 636–696) uses `#268ae7` as the underline color:

```scss
button::after {
  background: #268ae7;
}
```

But the Figma design uses `$blue` = `#0085ff` for the worker active tab indicator (blue gradient brand color). The company nav correctly uses green.

**Fix (worker only):** The active underline for worker nav buttons should use `#0085ff`:

```scss
// In .header-signed-in .bottom nav button::after
background: #0085ff; // was #268ae7
```

And the hover color on nav `a:hover button`:
```scss
// In .header-signed-in .bottom nav a:hover button
color: #0085ff; // was #19192d
```

Do not change the `.green` button variants — those are company-specific and correct.

---

### 🟡 MINOR — Chat button spacing asymmetry

```html
<!-- Current -->
<button class="btn notifications _i chat_i !ml-[32px] !mr-[21px]">
<button class="btn notifications _i !mr-[32px] !ml-[0px]">
```

The `!mr-[21px]` is an odd value creating unequal padding between the two icon buttons. Normalize to:

```html
<button class="btn notifications _i chat_i !ml-[32px] !mr-[16px]">
<button class="btn notifications _i !ml-[16px] !mr-[32px]">
```

---

## What NOT to do

- Do not modify any `this.$axios`, `this.$store.dispatch`, `$auth`, or `$t()` calls
- Do not touch the company nav section (`type === 'company'`) unless the junk text fix applies
- Do not touch `nuxt.config.js`, `tailwind.config.js`, or any store files
- Do not modify logout modal logic (`sure_delete_b`, `sure_delete_g`)
- Do not touch `infinitysales-backend/`

---

## Execution order

1. Remove junk `<b-button>` + `<b-modal>` blocks from both worker and company `.adap2` sections
2. Fix `ml-[10pxx]` → `ml-[10px]` (2 occurrences)
3. Move `$t('menu.desk')` into worker `<nav>` as last item; remove the shared `.desc` element
4. Fix bottom nav active underline color `#268ae7` → `#0085ff` (worker only, not `.green` variants)
5. Fix chat/bell button spacing
6. **Ask** about role label (Соискатель vs balance) before changing
7. **Check** filter icon availability before adding to search bar
8. Run grep sweep to confirm cleanup:
   ```bash
   grep -n "sdfsdf\|asdfsdf\|asdfasd\|10pxx" components/Header.vue
   ```
