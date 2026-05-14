# Page Analyzer + Fixer v3 — Queue Runner

## Goal
Iterate through every page in `.visual-agent/page-list.json`. For each page:
1. AUDIT — find every problem (Figma migration, code health, backend, 
   RECURRING_PATTERNS, i18n) across page + all imported components
2. FIX — apply every fix that is safe to apply automatically
3. LOG — write per-page report with what was fixed and what's deferred

Run unattended. User reviews afterward.

---

## HARD RULES

### Audit rules
- Component traversal MANDATORY — page file alone never sufficient
- Never write "No issues found" without confirming child components were audited
- Never mark a page DONE if less than 50% of its imports were audited
- Include `File` column in every violation table
- Every px value spacing/typography requires Figma source verification

### Fix rules
- DO NOT modify `components/Header.vue` or `components/Footer.vue` (user-managed)
- DO NOT modify backend code — frontend only
- DO NOT commit anything
- DO NOT run `yarn build`
- DO take Playwright screenshot after each major fix to verify no regression
- DO revert immediately if a fix breaks the page

### Backend gap handling
- Worker fields missing (instagram, telegram, facebook, is_open_to_offers): 
  add template with `v-if="false"` placeholder, log to BACKEND_BLOCKED.md
- SalesIQ, promotion data: feature-flag hide, log to BACKEND_BLOCKED.md
- Continue with frontend fixes — don't stop because of backend gaps

### Auto-decision rules (no asking)
- Hardcoded hex matching canonical token → replace with token
- Tailwind arbitrary brackets `bg-[#hex]` → move to scoped SCSS with token
- `<template :key=>` Vue 3 syntax → fix to Vue 2 pattern
- Missing `@error` on `<img>` → add handler
- `border-radius: 6px` where Figma says `8px` → fix to `8px`
- Hardcoded `#4CAF50` brand color → `$green` token
- `$warning` → `$amber`, `$border-light` → `$border-color`
- Material `#4CAF50` → `$green` (#00a795)
- Component in code but not in Figma → REMOVE with `<!-- REMOVED: not in Figma -->` comment
- Component in Figma but not in code (frontend-only) → ADD with Figma exact specs
- Component in Figma needing backend that doesn't exist → ADD with `v-if="false"`, log
- Broken i18n key rendering as raw text → add to both ru.js and uz.js

### Stop conditions (only these)
- Figma MCP unreachable >30 min (retry every 5 pages, then stop if still down)
- 3 consecutive pages error with same regression type (systematic issue)
- Working tree dirty with >15 files excluding header/footer (cleanup needed)
- Same fix breaks the page 3 times → log and skip that fix

---

## State files

### `.visual-agent/analyzer-queue.json`
Tracks page progress.

```json
{
  "started_at": "ISO",
  "last_session_ended_at": "ISO",
  "pages": [
    {
      "name": "worker-profile",
      "path": "pages/worker/profile/index.vue",
      "route": "/ru/worker/profile",
      "figma_node": "2129:56453",
      "auth_required": true,
      "status": "NOT_RUN | RUNNING | DONE | PARTIAL | BLOCKED | ERRORED",
      "started_at": null,
      "completed_at": null,
      "audit_file": null,
      "fix_log": null,
      "components_audited": null,
      "problems_found": null,
      "fixes_applied": null,
      "fixes_deferred": null
    }
  ]
}
```

### `.visual-agent/analyzer-heartbeat.json`
Crash protection. Updated every operation.

```json
{
  "last_heartbeat": "ISO",
  "current_page": "worker-profile",
  "current_step": "STEP_5_AUDIT_COMPONENTS",
  "next_action": "extracting layout properties from ProfileEdit.vue",
  "files_modified_this_page": ["pages/worker/profile/index.vue"],
  "session_id": "analyzer-fixer-{date}-{N}"
}
```

### `.visual-agent/component-trees/{page-name}.json`
Component tree for each page (built in Step 2.5).

---

## Initialization

If `analyzer-queue.json` doesn't exist:
1. Read `.visual-agent/page-list.json`
2. Filter: `figmaNode !== null` AND `skip !== true`
3. Initialize all pages to `NOT_RUN`

If file exists: resume — pick first `NOT_RUN` page.

If page has `RUNNING` status with stale heartbeat (>5min): resume from 
`current_step`, don't restart.

---

## Per-page workflow (Steps 1-12)

### Step 1 — Identity + heartbeat

```bash
# Verify Vue file
ls -la {vue-path}

# Update heartbeat: current_page, current_step = STEP_1
# Update queue: this page status RUNNING, started_at = now
```

If Vue file missing: mark page ERRORED ("Vue file not found"), next page.

### Step 2 — Read all base files

A. Vue page file — full template + script + style
B. RECURRING_PATTERNS.md — hold P-rules in context (especially P30-P33)
C. i18n files: `languages/ru.js` AND `languages/uz.js`
D. Figma cache: check `figma_cache/{figma_node}.json`
E. Backend models at `sotuv-markaz-backend/src/` (relevant ones only)

### Step 2.5 — Component traversal (MANDATORY)

For the page's Vue file:

1. Parse `<script>` block, find all `import` statements
2. Filter to local components:
   - `~/components/...`
   - `@/components/...`
   - `./components/...`
3. Exclude: Header.vue, Footer.vue
4. For each imported component:
   - Read the file
   - Find ITS imports (recursive depth 2)
   - Build full tree

Save to `.visual-agent/component-trees/{page-name}.json`:

```json
{
  "page": "worker-profile",
  "page_file": "pages/worker/profile/index.vue",
  "imports": [
    {
      "name": "ProfileEdit",
      "file": "components/sections/ProfileEdit.vue",
      "imports": [
        {
          "name": "BaseButton",
          "file": "components/atoms/BaseButton.vue",
          "imports": []
        }
      ]
    }
  ]
}
```

Audit coverage rule:
- Page file: 100% (always)
- Direct imports (depth 1): 100%
- Grandchildren (depth 2): 50% minimum, prioritize by:
  1. Components with `<style>` blocks
  2. Section-named components (Hero, Section, Card)
  3. Components imported in 3+ other pages (atoms)

### Step 3 — Fetch Figma

For the page's Figma node:
1. Cache hit (<7 days)? Use it
2. Else: `get_design_context`, save to `figma_cache/{node}.json` immediately
3. Update `figma_cache/_index.json`
4. Large frames: `get_metadata` first, recurse children
5. Wait 10s between MCP calls

Save tree: `figma-trees/{page-name}.json`

Also fetch Figma for each imported component if it has a known Figma node 
(check page-list.json or search by name in parent frame).

If image-flattened: try `forceCode: true`, fall back to screenshot fallback.

### Step 4 — Screenshots (both languages)

For each language: /ru/{route} AND /uz/{route}
Three viewports each:
- 1440px → `.visual-agent/screenshots/analysis/{name}-{lang}-1440.png`
- 768px → same with -768
- 375px → same with -375

Auth:
- Read `.visual-agent/test-accounts.json`
- Login via Playwright if auth required
- If 401: screenshot redirect, note "auth blocked", continue

### Step 5 — Backend live audit (if backend up)

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/api/v1/
```

If 200/404 (responding): 
```bash
TOKEN={from login}
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/{endpoint}/ | jq
```

Document response shape. Compare to Figma needs.

If down: note "backend offline", continue with code-only analysis.

### Step 6 — Build problem list

Write to `audits/{page-name}-problems.md`. 

Check EVERY category across page file + all audited components.

Every violation table includes `File` column.

#### 6.1 STRUCTURAL — in Figma not in code

| # | File | Component | Figma | Code | Status | Backend? |
|---|------|-----------|-------|------|--------|----------|

#### 6.2 STRUCTURAL_EXTRA — in code not in Figma

| # | File | Component | Code location | Likely reason | Action |
|---|------|-----------|---------------|---------------|--------|

#### 6.3 DATA WIRING

| # | File | Figma data | API field? | Serializer? | Template? | Action |
|---|------|------------|------------|-------------|-----------|--------|

#### 6.4 FORM FIELDS

| # | File | Figma field | Required | Type | API field | In code? |
|---|------|-------------|----------|------|-----------|----------|

#### 6.5 SPACING (P30: Figma annotation MANDATORY)

**Cover page file + ALL audited components.**

Never "No issues found" without confirming all child components checked.

| # | File | Element | Figma source | Figma value | Code value | Status |
|---|------|---------|--------------|-------------|------------|--------|

Required: `Figma source` column has node ID + property name 
(e.g., "node 2129:48704 paddingTop").

If not in Figma JSON: status = FIGMA_ANNOTATION_MISSING (blocker).

#### 6.6 TYPOGRAPHY (P31)

| # | File | Element | Figma source | Figma (size/weight/lh) | Code | Status |
|---|------|---------|--------------|------------------------|------|--------|

Format: numeric weight, px line-height, px font-size.

#### 6.7 WIDTH (P32)

| # | File | Element | Figma source | Figma value | Code | Status |
|---|------|---------|--------------|-------------|------|--------|

#### 6.8 BORDERS / RADIUS / SHADOWS (P33)

| # | File | Element | Property | Figma source | Figma | Code |
|---|------|---------|----------|--------------|-------|------|

#### 6.9 COLORS

| # | File | Element | Figma | Code | Canonical token? |
|---|------|---------|-------|------|------------------|

#### 6.10 ICONS

| # | File | Icon | Figma | Code | Action |
|---|------|------|-------|------|--------|

#### 6.11 EMPTY STATES

| # | File | Section | Figma empty | Code state | Action |
|---|------|---------|-------------|------------|--------|

#### 6.12 RECURRING PATTERNS

For each P-rule, run detection across page + components.

| # | P-rule | File | Lines | Count |
|---|--------|------|-------|-------|

Check all P1-P33.

#### 6.13 CODE HEALTH

| # | File | Issue | Lines | Type |
|---|------|-------|-------|------|

#### 6.14 i18n (both languages)

For every $t() call across page + components:

| # | File | Issue | RU.js | UZ.js | Rendered as |
|---|------|-------|-------|-------|-------------|

#### 6.15 RESPONSIVE

| # | File | Viewport | Issue |
|---|------|----------|-------|

#### 6.16 INTERACTION STATES

| # | File | Element | Issue |
|---|------|---------|-------|

#### 6.17 BACKEND ANALYSIS

| # | Field/endpoint | Complexity | Time | Blocks |
|---|---------------|------------|------|--------|

### Step 7 — Region-split score

| Region | Files | Figma comps | Matched | Rate |
|--------|-------|-------------|---------|------|

Lowest region determines status:
- <50% → MAJOR_DIVERGENCE
- 50-94% → ACHIEVABLE_THIS_SESSION
- ≥95% → READY_TO_FINISH

### Step 8 — Apply fixes automatically

This is where AUDIT becomes FIX. Walk through each category and apply safe fixes.

#### Order of fixes (strict)

##### Phase A — Code health (safe)
- Remove unused imports
- Remove commented-out dead code
- Remove `console.log` statements
- Fix typos in non-store code (skilss → skills, fetchLisence → fetchLicense)
  - ONLY if not breaking imports
- Add missing `@error` handlers on `<img>`

##### Phase B — RECURRING_PATTERNS violations
- P1/P8 — Move `:deep()` and `::v-deep` out of scoped styles
- P3 — Convert Tailwind arbitrary brackets to scoped SCSS with tokens
- P5/P14 — Replace hardcoded hex with canonical tokens
- P10 — Convert hardcoded SVG fills to `currentColor` + CSS class
- P28 — Fix Vue 3 syntax leaks (`<template :key>`)

##### Phase C — Color tokens
- `#19192d` → `$dark-blue`
- `#0085ff` → `$blue` (CTA buttons)
- `#268ae7` → `$blue-link` (links, secondary)
- `#29b2ff` → `$blue-light`
- `#768194` → `$grey`
- `#e8e8e8` → `$border-color`
- `#fb2828` → `$red`
- `#00a795` → `$green`
- `#ffb547` → `$amber`
- `#4CAF50` → `$green` (Material → brand)
- `$warning` → `$amber` (non-canonical alias)
- `$border-light` → `$border-color` (non-canonical alias)

##### Phase D — Atoms and structure
- Wrong border-radius → Figma value (with source comment)
- Missing save buttons on forms with PUT endpoints
- Position-swapped checkboxes (label/checkbox order from Figma)
- Reorder components per Figma vertical position

##### Phase E — Structural changes
- Remove EXTRA components (in code, not in Figma)
- Add MISSING components from Figma:
  - Frontend-only (no backend gap): add with real data
  - Backend gap exists: add template with `v-if="false"` + comment
- Label mismatches: update text via i18n

##### Phase F — i18n
- Add missing keys to BOTH ru.js and uz.js
- Fix broken keys rendering as raw text (btns.search, footer.brand_name)
- Rebrand "Infinity Sales" → "Sotuv Markaz" strings

##### Phase G — Spacing/typography (P30/P31/P32/P33)
For every spacing/typography mismatch:
1. Read Figma value from cache JSON
2. Update CSS with exact value
3. Add source comment: `// figma {node-id} {property}`

Example:
```scss
.hero {
  padding-top: 80px;     // figma 2129:48704 paddingTop
  padding-left: 64px;    // figma 2129:48704 paddingLeft
  gap: 32px;             // figma 2129:48704 itemSpacing
}

.hero__title {
  font-size: 48px;       // figma 2129:48710 fontSize
  font-weight: 700;      // figma 2129:48710 fontWeight  
  line-height: 56px;     // figma 2129:48710 lineHeightPx
}
```

##### Phase H — Backend-blocked structural placeholders
For components requiring missing backend:
- Add template with `v-if="false"`
- Add HTML comment: `<!-- TODO: needs backend, hidden until {field/endpoint} -->`
- Log to BACKEND_BLOCKED.md with field/endpoint needed

#### Verify after each phase

```bash
# Quick syntax check  
cd sotuv-markaz-frontend
node -e "require('vue-template-compiler').compile(...)"  # if available

# Hot reload — wait 4s for Nuxt
sleep 4

# Playwright check: page loads, no blank, no error
```

If page broken after a phase:
- Revert last 3 changes one at a time
- Re-verify after each revert
- When page works again: log broken fix to BUGS_FOUND.md, continue to next phase

### Step 9 — Final screenshot + visual verify

Take final screenshots:
- 1440px → `.visual-agent/screenshots/final/{name}-ru-1440.png`
- Same for /uz and other viewports

Visual side-by-side compare with Figma:
- Sidebar match %
- Main column match %
- Overall match %

### Step 10 — Per-page fix log

Write to `audits/{page-name}-FIX-LOG.md`:

```markdown
# {page-name} — Fix Log

- Audit: audits/{page-name}-problems.md
- Started: {ISO}
- Completed: {ISO}

## Fixes applied (by phase)

### Phase A — Code health
- Removed unused import {X} from pages/...
- Removed commented dead code (line N)
- ...

### Phase B — RECURRING_PATTERNS
- P5: Replaced {N} hardcoded hex with tokens
- P28: Fixed {N} Vue 3 syntax leaks
- ...

### Phase C — Color tokens
- {file}: #19192d → $dark-blue (N occurrences)
- ...

### Phase D — Atoms and structure
- ...

### Phase E — Structural
- REMOVED: "CV pdf yuklab oling" card from sidebar (not in Figma)
- ADDED: Location row in sidebar contacts
- ADDED: Save button at form bottom
- HIDDEN (v-if=false): SalesIQ card — needs backend
- ...

### Phase F — i18n
- Added uz.js: btns.search, footer.brand_name, footer.copyright_suffix
- ...

### Phase G — Spacing/typography
- pages/index.vue .hero padding-top 60px → 80px (figma paddingTop)
- pages/index.vue .hero font-size 28px → 32px (figma fontSize)
- ProfileEdit.vue .card border-radius 6px → 12px (figma cornerRadius)
- ...

### Phase H — Backend-blocked placeholders
- Added template for instagram contact row with v-if="false"
- Added template for SalesIQ card with v-if="false"
- ...

## Fixes deferred

| Type | Item | Reason |
|------|------|--------|
| Backend | Worker.instagram field | needs migration |
| Decision | Promotion card wiring | needs Malika |
| Refactor | 5703-line file split | out of scope |

## Files changed
- pages/...
- components/...
- languages/ru.js (+N keys)
- languages/uz.js (+N keys)

## Match estimate
- Before: 64%
- After: ~85% (estimate, needs visual verify)

## Status
DONE | PARTIAL | NEEDS_REVIEW
```

### Step 11 — Update queue

Update `analyzer-queue.json`:
- Page status: DONE | PARTIAL | BLOCKED based on results
- completed_at: now
- audit_file: path to problems.md
- fix_log: path to FIX-LOG.md
- components_audited: count
- problems_found: count
- fixes_applied: count
- fixes_deferred: count

### Step 12 — Move to next page

Update heartbeat: current_page = next NOT_RUN page.
Continue. Don't pause. Don't ask.

---

## When queue empty: Final batch report

Write `.visual-agent/analyzer-batch-report-{date}.md`:

```markdown
# Analyzer + Fixer Batch Report — {date range}

## Summary
- Total pages: N
- DONE (95%+ match, fixes complete): N
- PARTIAL (some fixes applied, backend gaps remain): N
- BLOCKED (can't proceed): N
- ERRORED: N

## Total work
- Vue files modified: N
- Components audited: N
- Total fixes applied: N
- Total fixes deferred: N
- i18n keys added: N
- Backend gaps logged: N (deduplicated)

## Pages by status
[tables sorted by status]

## Consolidated backend gap backlog
[deduplicated table — what backend needs to add]

## Top 10 most-recurring problem types
[which P-rules were violated most]

## Decisions needed from Javokhir
[explicit questions]

## Next session focus
- Pages that need re-audit after backend lands
- Pages PARTIAL with template-only blockers
- Pages BLOCKED needing decisions
```

Run `git diff --stat` at the end.

---

## OFFLINE MODE

User is offline. Process all pages.

Don't stop unless stop conditions hit.
Don't ask for approval.
Don't commit.
Don't run yarn build.

Take all night. Multiple sessions OK — resume from queue state.

---

## START

1. Read this prompt fully
2. Read RECURRING_PATTERNS.md (especially P30-P33)
3. Initialize or resume `analyzer-queue.json`
4. Process every NOT_RUN page through Steps 1-12
5. Write final batch report when queue empty
6. Stop

Begin.