# Visual Fix Queue — Complete Roadmap

**Project**: Sotuv Markaz Frontend (Nuxt 2)  
**Total Pages**: 97 (87 to process after skips)  
**Total Violations**: 108 (36 S4 + 68 C1 + 4 P1)  
**Status**: Queue initialized, ready for batch processing

---

## Quick Start

### For the Next Session
1. **Resume from**: Page index 1 in `page-list.json` (worker-login)
2. **Read**: `VISUAL_QUEUE_ANALYSIS.md` (technical guide with token reference)
3. **Process**: Pages 1-30 with S4/C1 fixes
4. **Update**: `queue-state.json` every 5 pages
5. **Audit**: Write `audits/{page-slug}-FINAL.md` for each page

### Key Files
- **Queue State**: `sotuv-markaz-frontend/.visual-agent/queue-state.json` (resume point)
- **Blockers**: `sotuv-markaz-frontend/.visual-agent/BLOCKERS.md` (constraints & strategy)
- **Analysis**: `VISUAL_QUEUE_ANALYSIS.md` (technical details, token reference)
- **Session Summary**: `SESSION_2_SUMMARY.md` (what was done, current status)
- **Page List**: `sotuv-markaz-frontend/.visual-agent/page-list.json` (all 97 pages)
- **Audits**: `audits/{page-slug}-FINAL.md` (per-page results)

---

## Violation Summary

### S4 — Tailwind Arbitrary Brackets (36 instances)
**What**: `bg-[#hex]`, `gap-[Npx]`, `rounded-[Npx]` in class attributes  
**Where**: ~30 files (mostly form pages, advanced-search, register)  
**How to fix**:
1. Remove bracket notation from class
2. Add to `<style lang="scss" scoped>` block
3. Use SCSS token if applicable

**Example**:
```vue
<!-- BEFORE -->
<button class="bg-[#EAEDF2] py-[7px]">

<!-- AFTER -->
<button class="!bg-btn-secondary py-1.5">
<style lang="scss" scoped>
.!bg-btn-secondary { background: $btn-secondary !important; }
</style>
```

### C1 — Hardcoded Hex in Styles (68 instances)
**What**: `color: #19192d;` or `background: #fff;` in `<style>` blocks  
**Where**: ~20 files (company account pages, category, etc.)  
**How to fix**:
1. Identify the hex in SCSS token list (see below)
2. Replace with `$token-name`

**Token List** (from CLAUDE.md):
```
#19192d → $dark-blue
#0085ff → $blue
#268ae7 → $blue-link
#29b2ff → $blue-light
#768194 → $grey
#f5f7f9 → $bg-section
#eef2f9 → $border-card
#e8e8e8 → $border-color
#fb2828 → $red
#00a795 → $green
#ffb547 → $amber
#e2e5ea → $border-light
#edf1f5 → $border-divider
#e9eff7 → $btn-secondary
```

### P1 — ::v-deep in Scoped Styles (4 instances)
**What**: `<style scoped>` with `::v-deep` selector  
**Where**: 4 files  
**How to fix**:
1. Create second `<style lang="scss">` block (NO `scoped` attribute)
2. Move ::v-deep rules there

**Example**:
```vue
<!-- BEFORE -->
<style scoped lang="scss">
  ::v-deep .component { ... }
</style>

<!-- AFTER -->
<style lang="scss" scoped>
  /* scoped styles here */
</style>
<style lang="scss">
  .component { ... }
</style>
```

---

## Pages to Process

### Total: 87 pages (after skipping 10)

### Batch 1: Pages 0-30 (HIGH priority, ~15 files with violations)
- Estimated time: 45 min
- Focus: Form pages (register, login, advanced-search)
- High violation density

#### Pages in Batch 1:
0. home (DONE — audit: audits/home-FINAL.md)
1. worker-login (redirect — skip to 2)
2. worker-register (2 S4 violations)
3. worker-home (check)
4. worker-search (check)
5. worker-vacancy (check)
6. worker-vacancy-details (check)
7. worker-profile (check)
8. worker-create-resume (check)
9. worker-company (check)
10. worker-desk-application (check)
... (continue to 30)

### Batch 2: Pages 31-65 (MEDIUM priority, ~10 files with violations)
- Estimated time: 45 min
- Focus: Company pages, desk pages
- Medium violation density

### Batch 3: Pages 66-97 (LOW priority, ~5 files with violations)
- Estimated time: 30 min
- Focus: Remaining pages
- Low violation density

---

## Pages to Skip (10 total)

These have `skip: true` in page-list.json:

1. **worker-staff** — legacy page
2. **company-payment** — custom payment flow
3. **company-faq-index** — no Figma design
4. **company-faq-slug** — no Figma design
5. **company-faq-questions** — no Figma design
6. **email-verify** — utility page
7. **events-slug** — dynamic content page
8. **feedback-slug** — dynamic content page
9. **news-slug** — dynamic content page
10. **temp** — dev/testing page

---

## Processing Workflow

### For Each Page:
1. **Identify violations**:
   ```bash
   grep -E "bg-\[#|gap-\[|rounded-\[" pages/path/to/page.vue
   grep -E "color:\s*#|background:\s*#" pages/path/to/page.vue
   grep -E "::v-deep|:deep\(" pages/path/to/page.vue
   ```

2. **Apply fixes**:
   - S4: Move to scoped SCSS, use tokens
   - C1: Replace hex with $token
   - P1: Move to non-scoped `<style>` block

3. **Write audit file**:
   ```
   audits/{page-slug}-FINAL.md
   ```
   (Template in VISUAL_QUEUE_ANALYSIS.md)

4. **Update queue**:
   ```json
   {
     "current_page_index": N,
     "pages_done": ["pages/index.vue", ...],
     "pages_partial": [...],
     "current_step": "PAGE_DONE"
   }
   ```

### Commit Strategy:
- After every 10 pages
- Commit message: `docs: visual queue batch {N} audit (pages {start}-{end})`
- Example: `docs: visual queue batch 1 audit (pages 0-10)`

---

## Important Constraints

### DO NOT MODIFY
- **Header.vue** (Javokhir maintains this)
- store/, plugins/, middleware/, api/ directories
- package.json, nuxt.config.js
- _fonts.scss, _functions.scss

### MUST USE
- Vue 2 syntax (NO :deep() from Vue 3)
- SCSS tokens from CLAUDE.md (NO custom CSS variables)
- `@error` handlers (already added in bulk fix IM1)
- scoped styles for component-level rules

---

## Current Progress

| Metric | Value |
|--------|-------|
| Pages Started | 1 (home) |
| Pages Done | 1 (home — PARTIAL) |
| Pages Remaining | 86 |
| Progress | 1.15% |
| Audit Files | 1 (home-FINAL.md) |
| Violations Fixed | 0 (in progress) |

---

## Session Timeline

### Session 1 (Completed)
- ✅ Pattern inventory (IM1, S4, C1, P1, etc.)
- ✅ P1 fix (1 file: events/index.vue)
- ✅ IM1 bulk fix (133 @error handlers added)

### Session 2 (Current)
- ✅ Queue initialization complete
- ✅ Violation discovery (108 violations found)
- ✅ Documentation & processing plan
- ⏳ Ready for: Batch fixes (pages 1-30)

### Session 3 (Next)
- Process pages 1-30 (S4/C1/P1 fixes)
- Write 30 audit files
- Commit batch 1

### Sessions 4-5
- Process pages 31-65 (S4/C1/P1 fixes)
- Write audit files
- Commit batches 2-3

### Session 6 (Optional)
- Process pages 66-97
- Final audit sweep
- Project completion

---

## Troubleshooting

### Token Not Found
If a hex color doesn't match the token list:
1. Check CLAUDE.md for canonical tokens
2. If not listed, add new token to _variables.scss
3. Document in VISUAL_QUEUE_ANALYSIS.md

### File Too Large for Direct Editing
Use Bash grep to find violations, then Edit tool with line context:
```bash
grep -n "pattern" file.vue | head -5
# Use line numbers to scope Edit tool replacements
```

### Merge Conflicts
- Keep your changes (visual fixes)
- Resolve conflicts in favor of new SCSS variables
- Test page renders correctly

---

## Success Criteria

✅ **Session complete when**:
- All pages audited (87 pages)
- All audit files written to `audits/`
- All violations fixed (S4, C1, P1)
- queue-state.json shows 100% progress
- No uncommitted changes (all batches committed)

---

## Contact & Questions

- **Project Lead**: Javokhir Elmurodov
- **Timezone**: Riga/Latvia (+03:00)
- **Git**: Push to `github` remote, NOT `origin`
- **Commits**: Logical batches (10 pages per commit)

---

**Status**: Queue Ready → Proceed to Batch 1 (Pages 1-30) in next session
