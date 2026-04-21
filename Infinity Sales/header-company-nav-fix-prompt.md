# Header — Company Nav Color Fix Prompt

## Context

File: `infinitysales-frontend/assets/scss/_header.scss`

The company bottom nav buttons use `class="green"` on their `<button>` elements
(see `Header.vue` lines ~1707–1741, company `<nav>` section).
The SCSS currently styles `button.green` active/hover states with `#268ae7` (worker blue-link)
instead of `#00a795` (company green, `$green` variable in `_functions.scss`).

Figma reference: company header node `509-28511`
(file `wg6Shl7MXCYT0OXYhRbPvt`, URL: https://www.figma.com/design/wg6Shl7MXCYT0OXYhRbPvt/1.0-Infinity-Sales--Web-)

---

## Exact changes — `_header.scss`

Fix 4 lines inside `.header-signed-in .bottom nav`:

### 1. Active nav link text color (line ~650)
```scss
// BEFORE
&.nuxt-link-exact-active button.green {
  color: #268ae7;   // ← wrong: worker blue
  ...
}

// AFTER
&.nuxt-link-exact-active button.green {
  color: #00a795;   // ← company green ($green)
  ...
}
```

### 2. Hover text color (line ~705)
```scss
// BEFORE
button.green {
  &:hover {
    color: #268ae7;   // ← wrong
  }
  ...
}

// AFTER
button.green {
  &:hover {
    color: #00a795;   // ← $green
  }
  ...
}
```

### 3. Active underline color (line ~710)
```scss
// BEFORE
button.green {
  &::after {
    background: #268ae7;   // ← wrong
    ...
  }
}

// AFTER
button.green {
  &::after {
    background: #00a795;   // ← $green
    ...
  }
}
```

### 4. `.active` class text color (line ~715)
```scss
// BEFORE
button.green {
  &.active {
    color: #268ae7;   // ← wrong
    ...
  }
}

// AFTER
button.green {
  &.active {
    color: #00a795;   // ← $green
    ...
  }
}
```

---

## Rules
- **Never** touch `$axios`, Vuex store, `$auth`, route definitions, `$t()` keys, or `infinitysales-backend/`
- This is a pure SCSS colour fix — no HTML, no JS changes needed
- Use `$green` variable (already imported via `_functions.scss`) instead of hardcoded hex for cleaner code

---

## Verification
After fixing, run:
```bash
grep -n "268ae7" infinitysales-frontend/assets/scss/_header.scss | grep -i "green"
```
Expected output: **no matches** (all four `#268ae7` occurrences inside `button.green` contexts should be gone).

Also visually confirm: log in as a company user, navigate to any page with the bottom nav, and check that the active page underline and text are green (`#00a795`) not blue.
