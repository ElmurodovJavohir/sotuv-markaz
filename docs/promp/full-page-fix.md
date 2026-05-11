# Full Page Fix — Match Figma 100%

## Goal
Take ONE page from current state to a complete Figma match. Not partial.
Not "token-clean." The page must be visually indistinguishable from Figma
at 1440px desktop, with structure, data, and styling all correct.

This takes as long as it takes. Don't optimize for speed.

## Roles
- **Claude (you)**: ALL Figma MCP calls, ALL code edits, ALL screenshots,
  cache management, decisions, RECURRING_PATTERNS.md updates
- **OpenCode**: NOT used for Figma. Use only for parallel grep/file scans
  if helpful (rarely needed)

OpenCode does not have Figma MCP access — Claude is the only path to Figma.

## Inputs (per session)
- Page route on localhost:3004
- Page Vue file path (derived from route or asked once)
- Figma node ID (looked up in .visual-agent/page-list.json or asked once)
- Optional: screenshot of current state

## HARD RULES
- No commits, no push, no yarn build
- One page until done — no parallel pages
- Save EVERY Figma MCP response to cache IMMEDIATELY (see Step 0)
- Big script changes (new computed/watcher/Vuex/API) → STOP, ask Javokhir
- Big backend changes (new model/migration/endpoint) → STOP, ask Javokhir
- Small script/backend per P28 → allowed, log to changes files
- Working tree dirty (>5 unrelated files) → STOP, ask Javokhir to clean

---

## STEP 0 — Cache discipline (applies to every Figma call this session)

EVERY Figma MCP call follows this exact pattern:
Before MCP call:

Compute cache_path = figma_cache/{node-id-with-dashes}.json
If file exists AND mtime < 7 days:

Read it, use it, log "cache hit"
Skip MCP call entirely


If file exists AND mtime >= 7 days:

Note "stale, refreshing"
Continue to MCP call



MCP call:
4. Call get_design_context (or get_metadata for huge frames)
5. Params: file_key=whwt0wJFk3XFkkXNsVgqQh,
clientFrameworks="vue,nuxt", clientLanguages="javascript,scss,html"
After MCP call (BEFORE doing anything else with the data):
6. Write response to figma_cache/{node-id}.json
7. Update figma_cache/_index.json:
{
"{node-id}": {
"last_fetched": "{ISO timestamp}",
"size_bytes": N,
"page": "{page-slug}",
"session": "{date}",
"type": "design_context" | "metadata" | "screenshot"
}
}
8. If save fails: STOP, tell Javokhir, do not proceed
9. ONLY THEN process the data

For huge frames that timeout:
- Save the timeout error to cache too (as `{node-id}.error.json`) — don't
  retry the same call later in session
- Use get_metadata to list children, save to {node-id}.metadata.json
- Recurse into each major child, save each as {child-id}.json
- Build {node-id}.children.json manifest listing all child IDs fetched

Cache invalidation:
- Manual only (delete file). The 7-day staleness check handles auto-refresh.
- Never delete cache files mid-session.

This caching pattern is non-negotiable. Every Figma call updates cache.

---

## STEP 1 — Baseline check

```bash
cd sotuv-markaz-frontend
git status
ls figma_cache/{node-id}*.json 2>/dev/null
curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3845/mcp
```

Read the page Vue file fully. Note imported components.
Read RECURRING_PATTERNS.md fully — hold in context.

If working tree has >5 unrelated dirty files → STOP, ask Javokhir.
If MCP doesn't return 200/405 → STOP, tell Javokhir to start Figma desktop.

---

## STEP 2 — Fetch Figma page tree

Apply Step 0 cache discipline. Fetch the page's main frame node.

If the page is auth-gated, the Figma frame may be a dashboard variant (worker
home, profile, etc). Use the node ID provided.

If frame is too large:
- get_metadata first (cache it)
- Recurse into each major child section (header, sidebar, main column, etc.)
- Cache each child response separately
- Build the full picture from cached chunks

Build a hierarchical inventory of every visible element:
PAGE
├── header
│   ├── logo (text/image content, dimensions)
│   ├── search-bar (placeholder text, button text, dimensions)
│   ├── nav-items [{text, href}, ...]
│   ├── lang-switcher (current lang, options)
│   ├── notifications-icon
│   └── user-dropdown (name, role, avatar)
├── sidebar
│   ├── card-1 (type, title, fields, CTA)
│   ├── card-2
│   └── ...
└── main
├── section-1 (heading, content type, children)
└── ...

For every leaf element record:
- text content (exact strings)
- type (button/input/text/icon/image)
- dimensions (w × h)
- spacing (padding 4 sides, margin, gap to siblings)
- exact px (no rounding)
- colors (fill, stroke, text)
- typography (font-size, weight, line-height, letter-spacing)
- border (width, color, radius)
- shadow (full values)
- icon assets (CDN URL if image export)
- any position absolute usage with reason

Save the tree to: `figma-trees/{page-slug}.json` (workspace root).

---

## STEP 3 — Structural audit

Read the Vue file's `<template>` block. Build the equivalent code tree.

Compare side-by-side:

| Figma element | Code element | Status |
|---------------|--------------|--------|
| header > logo "Sotuv Markaz" | header > logo "Infinity Sales" | TEXT_MISMATCH |
| header > nav[5 items] | header > nav[4 items] | MISSING_ITEM |
| sidebar > status-card | (not in code) | MISSING_COMPONENT |
| sidebar > extra-card | (not in figma) | EXTRA_COMPONENT |
| sidebar > profile > contact-list[6] | sidebar > profile > contact-list[2] | MISSING_FIELDS |
| main > section "Специализированные данные" | (not in code) | MISSING_SECTION |

Categorize:
- **STRUCTURAL_MISSING** — Figma has it, code doesn't
- **STRUCTURAL_EXTRA** — Code has it, Figma doesn't
- **TEXT_MISMATCH** — Wrong copy (i18n fix)
- **DATA_MISSING** — Element exists, Figma data not rendered
- **STYLE_MISMATCH** — Element exists with right data, just styled wrong
- **POSITION_WRONG** — Element exists but in wrong tree position

Save: `audits/{page-slug}-structural.md`

---

## STEP 4 — Decision gate

For STRUCTURAL_MISSING with backend implications (new API field, new endpoint,
new Vuex action) → STOP. List to Javokhir. Wait.

For STRUCTURAL_MISSING that's template-only (data exists, just not rendered) →
proceed.

For STRUCTURAL_EXTRA → ask Javokhir whether to remove or hide. Don't auto-delete.

---

## STEP 5 — Apply structural fixes

### 5a. Remove EXTRA components (after approval)
Delete from template, remove unused imports.

### 5b. Add MISSING components
For each STRUCTURAL_MISSING template-only fix:
- Add template block in correct position per Figma tree
- Wire to existing Vuex getters
- Use exact text from Figma (Russian first, then add Uzbek translation)
- If a needed data field doesn't exist anywhere → log to BACKEND_CHANGES.md
  as BIG, mark blocked, continue with rest

### 5c. Reorder POSITION_WRONG
Move template blocks per Figma order. Re-check styles after move (parent
class scope may have changed).

### 5d. Fix TEXT_MISMATCH
Update keys in `languages/ru.js` AND `languages/uz.js`. Both languages
must update. No English-only/Russian-only.

### 5e. Fix DATA_MISSING
Trivial: data is in Vuex, template just isn't rendering it → fix.
Non-trivial: data isn't in Vuex/API → log to BACKEND_CHANGES.md as BIG.

After all structural fixes:
Playwright screenshot → `.visual-agent/screenshots/{page-slug}-after-structure.png`

---

## STEP 6 — Style diff

For every element that exists in BOTH Figma and code, build a diff:

| Element | Property | Figma | Code | Match | Category |
|---------|----------|-------|------|-------|----------|
| .btn-primary | height | 48px | 40px | ❌ | ATOM |
| .btn-primary | border-radius | 8px | 4px | ❌ | ATOM |
| .vacancy-card | padding | 24px | 16px | ❌ | LAYOUT |
| .vacancy-card | gap-to-next | 16px | 24px | ❌ | LAYOUT |

Group by:
- ATOM (button, input, badge, card → fix in shared component file)
- LAYOUT (spacing, gap, position)
- TYPOGRAPHY (font-size, weight, line-height)
- COLOR (map to canonical token if possible)
- BORDER (width, color, radius)
- SHADOW
- ICON (note image-export icons → need download)

Cross-check RECURRING_PATTERNS.md tokens:
- Color matches canonical token → use token
- Color has no canonical match → flag NEW_TOKEN_CANDIDATE
- Atom violates spec → flag ATOM_VIOLATION

Exact spacing: report Figma values verbatim, no rounding (P26).

Save: `audits/{page-slug}-style-diff.md`

---

## STEP 7 — Apply style fixes (strict order)

### 7a. Atom fixes (shared components)
For each ATOM_VIOLATION → fix in shared component file (not the page).
After fixing one shared component → screenshot 2 pages that use it.

### 7b. Icon downloads
For each ICON marked as image export:
- curl Figma CDN URL
- Save to `static/img/icons/{descriptive-name}.svg`
- Replace inline SVG in template with `<img src="/static/img/icons/...">`
- CDN URLs expire in 7 days — do this immediately

### 7c. Layout — convert position:absolute to flex/grid
Per P25, where flex/grid works. Screenshot after each rework.

### 7d. Page-level SCSS
All SCSS fixes from diff: colors, typography, spacing, borders, shadows.
Use exact Figma px values (P26) — no rounding.

### 7e. Template SVG fills
Replace `fill="#hex"` with `fill="currentColor"` where icon should inherit.
Brand/social/payment icons keep their fills.

### 7f. New token candidates
For each NEW_TOKEN_CANDIDATE:
- grep for usage count
- 2+ uses → add to `assets/scss/_functions.scss`
- 1 use → raw hex inline with `// non-token, single-use` comment

After all style fixes:
Playwright screenshot → `.visual-agent/screenshots/{page-slug}-after-style.png`

---

## STEP 8 — Multi-viewport verification

Playwright screenshots at:
- 1440px desktop (primary)
- 768px tablet
- 375px mobile

Save:
- `.visual-agent/screenshots/{page-slug}-1440.png`
- `.visual-agent/screenshots/{page-slug}-768.png`
- `.visual-agent/screenshots/{page-slug}-375.png`

Auth-gated pages: use auth helper if available. Otherwise note "auth-gated,
manual verify needed."

If responsive looks broken at 768/375 and Figma doesn't show mobile design:
note in report, do not attempt mobile fixes.

---

## STEP 9 — Update RECURRING_PATTERNS.md

If during this page you encountered ANY of:
- Token miss not in file
- Recurring structural pattern (e.g. "every page has status-card sidebar")
- Atom variation not documented
- Figma quirk needing workaround
- Grep that would catch a class of problems

→ Update RECURRING_PATTERNS.md NOW, before finishing.

For each new pattern:
P{next-number}: {short title}
Symptom: what the problem looks like in code
Root cause: why it happens
Detection: grep pattern or check
Fix: the canonical solution
First seen: {page} during {session-date}
Token added (if applicable): $name: #hex

Existing pattern with new examples → add to its "Examples seen" list.

New SCSS token → also update Token map table at top + C2 grep allowlist.

---

## STEP 10 — Final verification

Self-check:

| Check | Pass criteria |
|-------|---------------|
| Structure | Code template has every Figma element, right order |
| Data | Every Figma data field renders correctly |
| Atoms | Match RECURRING_PATTERNS.md atom specs |
| Spacing | Every value matches Figma exactly (no rounding) |
| Typography | Font-size/weight/line-height match Figma |
| Colors | Canonical token or annotated raw hex |
| Icons | Replicated or downloaded |
| Layout | No position:absolute where flex/grid works |
| Visual | Side-by-side at 1440px — visually identical |
| Responsive | 768/375 captured (broken-mobile noted if applicable) |
| Patterns | RECURRING_PATTERNS.md updated |
| Cache | All Figma calls saved to figma_cache/, _index.json updated |

Any check fails → fix, re-screenshot, re-check.

Write final report: `audits/{page-slug}-FINAL.md`

```markdown
# {Page} — Full Fix Report

## Status: DONE / PARTIAL / BLOCKED

## Inputs
- Page: {path}
- Route: {route}
- Figma node: {node-id}
- Started / Completed: timestamps

## Cache stats
- MCP calls this session: N
- Cache hits: M
- New cache entries: K
- Total cache size: bytes

## Structural changes
- Components added / removed / reordered: N each (lists)
- Text/i18n changes: N (list)

## Style changes
- Atom fixes: N
- Page SCSS: N
- Icons downloaded: N (list)
- Layout reworks: N (list)

## Backend changes
- Small applied: N
- Big logged (awaiting approval): N (list)

## Script changes
- Small applied: N
- Big logged (awaiting approval): N (list)

## Patterns
- New patterns: N (list with P numbers)
- Reinforced patterns: N
- New tokens: N (list)

## Files changed (full)

## Screenshots
- 1440 / 768 / 375 / hover states

## Blockers
- Anything preventing completion

## Validation checklist
- [ ] Structure / Data / Atoms / Spacing / Typography / Colors / Icons /
      Layout / Visual / Responsive / Patterns / Cache
```

Show `git diff --stat` to Javokhir. List blockers. Stop. No commit.

---

## On failure / partial completion

BIG changes blocking → apply everything that doesn't need approval, save
state, mark BLOCKED with reason. Don't retry until resolved.

Visible regression → revert single fix, log to BUGS_FOUND.md, continue.

MCP down mid-session → complete current step from cache, STOP at next
checkpoint.