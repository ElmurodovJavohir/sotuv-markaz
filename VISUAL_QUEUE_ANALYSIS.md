# Visual Queue — Complete Analysis & Processing Plan

**Date**: 2026-05-08  
**Status**: Session 2 — Audit Complete, Ready for Batch Fixes  
**Total Pages**: 97 (87 to process, 10 to skip)  
**Violations Found**: 108 total (36 S4 + 68 C1 + 4 P1)

---

## Executive Summary

The visual migration queue covers 97 Sotuv Markaz frontend pages. Previous session established violation patterns. This session identified all violation instances across the codebase:

- **S4 (Tailwind arbitrary)**: 36 instances — HIGH priority (style-only fix)
- **C1 (hardcoded hex)**: 68 instances — MEDIUM priority (token replacement)
- **P1 (v-deep)**: 4 instances — LOW priority (refactoring)
- **IM1 (@error handlers)**: Already fixed (133 added to 62 files)

---

## Violation Details

### S4 — Tailwind Arbitrary Brackets (36 total)
**Files affected**: ~30 pages  
**Examples**:
- `bg-[#EAEDF2]` → move to SCSS variable + scoped style
- `gap-[7px]` → use Tailwind gap-1, gap-2, gap-3 or SCSS
- `py-[7px]` → round to py-1.5 or py-2, or use SCSS

**Fix pattern**:
1. Remove arbitrary bracket from class
2. Add to `<style lang="scss" scoped>` block
3. Use SCSS tokens where applicable

**Token replacements** (from CLAUDE.md):
- `#EAEDF2` → `$border-card`
- `#e8e8e8` → `$border-color`
- `#e2e5ea` → `$border-light`
- `#19192d` → `$dark-blue`
- `#fff` → `$white` (if exists) or hex directly
- `#f5f7f9` → `$bg-section`

### C1 — Hardcoded Hex in Styles (68 total)
**Files affected**: ~20 pages  
**Examples**:
```scss
color: #19192d;  → color: $dark-blue;
background: #f5f7f9;  → background: $bg-section;
border-color: #e8e8e8;  → border-color: $border-color;
```

**Fix pattern**:
1. Identify hex color in `<style>` block
2. Map to SCSS token from CLAUDE.md
3. Replace hex with `$token-name`
4. If no token exists, create one

### P1 — ::v-deep Violations (4 total)
**Pattern**: `<style scoped>` with `::v-deep` or `:deep()`  
**Fix**: Create second non-scoped `<style lang="scss">` block for ::v-deep rules

---

## Processing Plan

### Strategy
Process pages in 3 batches to manage tokens:

1. **Batch 1 (Pages 0-30)**: 45 min, ~10 files with fixes
2. **Batch 2 (Pages 31-65)**: 45 min, ~10 files with fixes
3. **Batch 3 (Pages 66-97)**: 30 min, ~5 files with fixes

Each batch:
- Identify files with violations
- Apply S4, C1, P1 fixes
- Write audit files
- Update queue-state.json

### Pages to Skip (10 total)
From page-list.json:
1. worker-staff — `skip: true` (legacy)
2. company-payment — `skip: true` (custom)
3. company-faq-index — `skip: true` (no design)
4. company-faq-slug — `skip: true` (no design)
5. company-faq-questions — `skip: true` (no design)
6. email-verify — `skip: true` (utility)
7. events-slug — `skip: true` (dynamic)
8. feedback-slug — `skip: true` (dynamic)
9. news-slug — `skip: true` (dynamic)
10. temp — `skip: true` (dev)

---

## Files with Violations (Pages 0-30)

### Pages with S4 violations:
- pages/worker/register.vue — 2 instances
- pages/login/index.vue — Multiple
- pages/company/register.vue — Multiple
- (Complete list: ~30 files total)

### Pages with C1 violations:
- pages/company/advanced-search.vue
- pages/worker/advanced-search.vue
- pages/company/vacancy/edit/_id.vue
- pages/worker/account/main.vue
- pages/company/account/main.vue
- pages/company/profile/index.vue
- (Complete list: ~20 files total)

### Pages with P1 violations:
- 4 files with ::v-deep (small fix)

---

## Audit File Format

Each page gets an audit file at `audits/{page-slug}-FINAL.md`:

```markdown
# {Page Name} — Final Fix Report

## Status: DONE | PARTIAL | BLOCKED

## Page info
- Vue file: pages/...
- Figma node: 2129:XXXXX | no-figma
- Processed: ISO timestamp

## Fixes applied this session
### S4 (Tailwind arbitrary)
- [List fixes]
### C1 (hex → token)
- [List fixes]
### P1 (v-deep)
- [List fixes]
### Other
- [Any other fixes]

## Remaining issues
- [Anything not fixed with reason]

## Files modified
- [List]
```

---

## Token Reference

From CLAUDE.md SCSS tokens:

| Hex | Token | Use |
|-----|-------|-----|
| #19192d | $dark-blue | Text, dark bg |
| #0085ff | $blue | CTA buttons |
| #268ae7 | $blue-link | Links, active tabs |
| #29b2ff | $blue-light | Gradient start |
| #768194 | $grey | Secondary text |
| #f5f7f9 | $bg-section | Section bg |
| #eef2f9 | $border-card | Card borders |
| #e8e8e8 | $border-color | General borders |
| #fb2828 | $red | Errors |
| #00a795 | $green | Success |
| #ffb547 | $amber | Premium |
| #e2e5ea | $border-light | Light borders |
| #edf1f5 | $border-divider | Dividers |
| #e9eff7 | $btn-secondary | Secondary btn |

---

## Next Session Checklist

- [ ] Resume from page index 1 (worker-login)
- [ ] Process pages 1-30 with S4/C1 fixes
- [ ] Write audit file for each page
- [ ] Update queue-state.json every 5 pages
- [ ] Track token usage and stop if exceeding 70%
- [ ] Commit changes in logical batches (pages 0-10, 11-20, etc.)

---

## Commands for Batch Processing

### Find files with S4 violations:
```bash
grep -r "bg-\[#\|gap-\[\|rounded-\[" pages --include="*.vue" -l
```

### Find files with C1 violations:
```bash
grep -r "color:\s*#\|background:\s*#\|border" pages --include="*.vue" -l
```

### Find files with P1 violations:
```bash
grep -r "::v-deep\|:deep(" pages --include="*.vue" -l
```

---

## Important Notes

1. **Do NOT modify**:
   - Header.vue
   - store/, plugins/, middleware/, api/
   - package.json, nuxt.config.js

2. **Vue 2 Syntax**: Use `<style lang="scss">` (non-scoped) for ::v-deep, NOT `<style scoped>` with `::v-deep`

3. **Figma Cache**: For pages with figmaNode, cache files exist at `figma_cache/pages/{slug}/`

4. **Home Page**: pages/index.vue is a wrapper — violations in section components (MainSection, NewsSection, etc.)

5. **Token Imports**: SCSS tokens already imported in _functions.scss and _variables.scss

---

## Session Status

- Home page: PARTIAL audit complete
- Violation scanning: COMPLETE (36 S4, 68 C1, 4 P1)
- Ready for: Batch fixes starting with page 1
- Token budget: ~35% used so far in session
