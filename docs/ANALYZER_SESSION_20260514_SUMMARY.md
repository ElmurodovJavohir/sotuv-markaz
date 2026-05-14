# Analyzer Session 2026-05-14 — Summary & Action Items

**Analyzer:** Sotuv Markaz Page Problem Analyzer v3  
**Session:** analyzer-20260514-1  
**Date:** 2026-05-14  
**Pages analyzed:** 84 (2 deep, 79 rapid scan, 5 missing files)  
**Total violations found:** 242+  

---

## Quick Summary

✅ **Good news:** 71/84 pages are ≥95% compliant — most codebase is clean  
❌ **Bad news:** 130+ hardcoded hex colors need fixing (C1 violation)  
⚠️ **Watch:** 6 pages use `:deep()` which violates stylelint (P1/P8)  
🚨 **Blocked:** worker-profile (pre-analyzed; blocked by backend `Worker.position` field)

---

## Top 5 Immediate Action Items

### 1. HIGHEST PRIORITY: Fix Hardcoded Hex Colors (130+ instances)

**What:** Replace `#268ae7` with `$blue-link` in SVG attributes  
**Where:** 17 pages, mostly in company section  
**Top violators:**
- company-candidate-id (18 instances)
- company-profile-application (10)
- company-vacancy-add (10)
- company-profile-index (8)
- company-vacancy-edit-id (8)

**Fix:** Find/Replace in each file:
```
OLD: stroke="#268ae7"
NEW: stroke="currentColor"

// Add to parent element styling:
color: $blue-link;
```

**Time estimate:** 2-3 hours (10 minutes per file × 17 files)  
**Impact:** High (visual consistency, SCSS discipline)

---

### 2. Fix `:deep()` Violations (6 instances, 3 pages)

**What:** Pages using `:deep()` or `::v-deep` which stylelint rejects  
**Where:**
- worker-advanced-search (2 instances)
- events-index (2)
- worker-services-id (3)

**Fix:** Convert scoped styles with `:deep()` to non-scoped `<style>` block:
```vue
<!-- OLD (BROKEN) -->
<style scoped>
::v-deep .child-selector { ... }
</style>

<!-- NEW (CORRECT) -->
<style scoped>
/* regular scoped styles */
</style>

<style lang="scss">
/* Non-scoped block for piercing */
.worker-advanced-search .child-selector { ... }
</style>
```

**Time estimate:** 1-2 hours (20-30 min per file)  
**Impact:** Medium (prevents stylelint failures during build)

---

### 3. Correct Queue: Fix Missing Files (5 pages)

**What:** Queue references pages that don't exist  
**Pages:**
- about-us → file not found (should be `pages/about.vue`?)
- partners → file not found
- investors → file not found
- ads-on-site → file not found
- faq → file not found (might be `pages/faq.vue` or worker/faq variant?)

**Fix:** Mark as ERRORED in queue or update paths to match actual files

**Time estimate:** 30 minutes

---

### 4. Backend Task: Uncomment `Worker.position` Field

**What:** worker-profile blocked by missing backend field  
**Details:**
- Figma shows "Профессия/ключевые слова" input
- Backend model has field commented out
- Serializer doesn't return it

**Fix (backend):** Uncomment field in `src/worker/models.py`, run migration, add to serializer

**Impact:** HIGH — worker-profile UI can't save profession/keywords without this

**Blocker:** Cannot test until backend is online

---

### 5. Add `@error` Handlers to `<img>` Tags (~15 pages)

**What:** Images without fallback error handling  
**Pattern:**
```vue
<!-- BAD -->
<img :src="avatarUrl" />

<!-- GOOD -->
<img :src="avatarUrl" @error="$event.target.src = '/img/noava1.svg'" />
```

**Pages needing review:** worker-buy-service-*, static-slug, and others

**Time estimate:** 2-3 hours  
**Impact:** Medium (prevents ugly browser placeholders on missing images)

---

## Medium-Priority Items (Phase 2)

- [ ] Standardize responsive breakpoints (some pages use 550px/565px instead of 768px)
- [ ] Remove unused imports from entry pages
- [ ] Verify file paths in queue match actual codebase
- [ ] Extract repeated SVG patterns into atomic components

---

## Long-Term Architectural Items (Phase 3 — Javokhir's decision)

- **Modularize worker-profile:** 5700-line single file → break into sub-components
- **Implement Social Media section:** API returns `socials` but UI never renders it
- **Implement Skills IQ:** Figma sidebar widget, currently backend stub (`src/salesiq/`)
- **Verify Figma node mappings:** Some pages may have wrong node IDs (see P29 pattern)

---

## Files Generated This Session

1. **`audits/home-problems.md`** — Deep analysis of home page (READY_TO_FINISH, score 97%)
2. **`.visual-agent/analyzer-batch-report-20260514.md`** — Full batch analysis with top 20 pages, fix sequences, and statistics
3. **`.visual-agent/batch-scan-results.csv`** — Rapid scan results for all 84 pages (violation counts, file sizes)
4. **`.visual-agent/analyzer-heartbeat.json`** — Session completion marker
5. **`docs/ANALYZER_SESSION_20260514_SUMMARY.md`** — This file

---

## How to Use These Reports

### For Quick Assessment
→ Read **this file** (ANALYZER_SESSION_20260514_SUMMARY.md)

### For Detailed Fix Plan
→ Read **`.visual-agent/analyzer-batch-report-20260514.md`** (pages by readiness, fix sequences)

### For Individual Page Audits
→ Check **`audits/{page-name}-problems.md`** files (generated as work continues)

### For Violation Counts & Metrics
→ Use **`batch-scan-results.csv`** (pivot, filter, sort by violation type)

---

## Status Dashboard

| Metric | Value | Status |
|---|---|---|
| Pages analyzed (deep) | 2/84 | ⏳ In progress |
| Pages scanned (rapid) | 79/84 | ✅ Complete |
| Missing files flagged | 5/84 | ⚠️ Action needed |
| Hardcoded hex violations | 130+ | 🔴 CRITICAL |
| `:deep()` violations | 6 | 🟠 HIGH |
| Codebase compliance (≥95%) | 71/84 | ✅ Excellent |

---

## Next Session Checklist

- [ ] Backend online? Verify `/api/v1/` returns 200+
- [ ] Read batch report + understand priorities
- [ ] Apply Phase 1 fixes (hex colors, :deep() violations)
- [ ] Update queue (missing files, fix verification)
- [ ] Re-run analyzer on fixed pages to confirm score improvement
- [ ] Continue deep-audits on Phase 2 pages

---

## Contact & Notes

**Questions?** Refer to:
- RECURRING_PATTERNS.md — full pattern definitions
- CLAUDE.md (project level) — stack & rules
- sotuv-markaz-frontend/CLAUDE.md — frontend-specific rules

**Backend status:** ⚠️ **OFFLINE (404)** — many API checks skipped  
**Figma cache:** ✅ Available (pre-cached from 2026-05-08)  
**Dev server:** ℹ️ Not verified (assuming running on :3004)

---

*Report generated by Claude Code analyzer session 20260514-1*  
*Awaiting Javokhir's review and action on Phase 1 recommendations*

