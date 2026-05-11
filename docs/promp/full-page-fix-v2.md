# Full Page Fix v2 — Honest Figma Match

## What changed from v1
v1 produced false-DONE status. Pages were marked DONE when they were
token-clean but structurally divergent. This version adds enforceable
structural checks that cannot be rubber-stamped.

## Goal
Each page must match its Figma design at the COMPONENT level, not just
the token level. If a sidebar card is missing in code but present in
Figma, page is NOT done — it's PARTIAL with a clear blocker list.

## Roles
- Claude (you): all Figma MCP calls, all code edits, all screenshots,
  all decisions, RECURRING_PATTERNS.md updates, queue state
- OpenCode: not used (no MCP access)

## Scope rules (CRITICAL)
- DO NOT modify components/Header.vue or assets/scss/_header.scss
- DO NOT modify components/Footer.vue or assets/scss/_footer.scss
- These are user-managed. If a structural diff shows header/footer mismatch,
  log to BLOCKERS.md as "user-managed, skip" and continue.


## State files this session uses

### .visual-agent/page-queue.json (NEW — replaces page-list.json for queue purposes)
Single source of truth for which pages are running/done/blocked.
Schema:
{
"queue_started_at": "ISO",
"last_session_ended_at": "ISO",
"pages": [
{
"name": "worker-profile",
"path": "pages/worker/profile/index.vue",
"route": "/ru/worker/profile",
"figma_node": "2129:52692",
"auth_required": true,
"status": "NOT_RUN | RUNNING | DONE | PARTIAL | BLOCKED | SKIPPED",
"current_step": null,
"structural_score": null,
"started_at": null,
"completed_at": null,
"audits": [],
"blockers": [],
"scope_excluded": ["header", "footer"]
}
]
}

### .visual-agent/queue-heartbeat.json (NEW — written every operation)
Crash protection. Updated CONSTANTLY.
{
"last_heartbeat": "ISO",
"current_page": "worker-profile",
"current_step": "STEP_3_STRUCTURAL_AUDIT",
"current_substep": "comparing sidebar components",
"next_action": "compare main column form fields against Figma",
"files_modified_this_page": ["pages/..."],
"session_id": "session-{date}-{N}"
}

If queue-heartbeat.json's last_heartbeat is older than 5 min when resuming,
assume previous session crashed. Continue from current_step.

## On resume

If `.visual-agent/page-queue.json` exists:
1. Read it
2. Find first page with status NOT_RUN
3. Continue from there
4. If a page has status RUNNING and heartbeat is stale: that page crashed
   mid-work — re-read its current_step and resume from that step (don't
   restart page from scratch)

If both files don't exist: initialize page-queue.json from .visual-agent/page-list.json
(filtering only entries with figma_node !== null).

---

## Per-page workflow (Steps 0-10)

### STEP 0 — Update heartbeat + page status

Mark the page status: RUNNING in page-queue.json.
Update heartbeat with current_page = this page, current_step = STEP_1.
Write started_at timestamp.

### STEP 1 — Baseline

```bash
cd sotuv-markaz-frontend
git status --short | grep -v -E '_header|_footer|^components/Header|^components/Footer' | wc -l
# Should be small. If >5 unrelated dirty files: STOP this page,
# log to BLOCKERS.md, set status PARTIAL with reason "dirty tree", move on.

curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3845/mcp
# If not 200/405: log MCP_DOWN, mark page BLOCKED, retry every 5 pages
```

Read RECURRING_PATTERNS.md fully.
Read the page Vue file fully + all child component imports.

### STEP 2 — Figma fetch (cache discipline)

For node {figma_node}:
1. Check figma_cache/{node-id-with-dashes}.json
2. Fresh (<7 days) → use, log "cache hit"
3. Else → call get_design_context with file_key=whwt0wJFk3XFkkXNsVgqQh,
   clientFrameworks="vue,nuxt", clientLanguages="javascript,scss,html"
4. SAVE response to figma_cache/{node-id}.json IMMEDIATELY before processing
5. Update figma_cache/_index.json

If frame is too large / timeout:
- get_metadata first → save {node-id}.metadata.json
- Recurse into major children → save each as {child-id}.json
- Build {node-id}.children.json manifest
- Wait 10s between MCP calls

After successful fetch: build hierarchical inventory tree.
Save to: figma-trees/{page-name}.json

### STEP 3 — STRUCTURAL AUDIT (the gate that v1 skipped)

This is the step that prevents false-DONE. Do it explicitly. Do not skip.
Do not summarize. Produce the full table.

Open figma-trees/{page-name}.json. Open the Vue file.

Build TWO trees side by side:

#### Figma tree (extract every visible component)
- Every section, card, form field, button, sidebar component
- Every empty-state CTA ("+ Добавить X")
- Every count badge / chip (e.g. "465", "321")
- Every filter group with its label and items
- Every save/submit button

#### Code tree (extract every visible component)
- Every <section>, .card, .form-group, .btn in template
- Note conditional rendering (v-if blocks may hide structure)

#### Cross-reference table

Write to audits/{page-name}-structural.md:

```markdown
# Structural Audit — {page-name}
- Figma node: {node-id}
- Code: {file path}
- Audited: {ISO}

## Sidebar components

| Figma component | Code component | Status | Backend needed? |
|----------------|---------------|--------|-----------------|
| status-card "Статус продвижения" | (not in code) | MISSING | YES — promotion API |
| profile-card.age "23 года" | (not in code) | MISSING | NO — birth_date in API |
| profile-card.join-date "В Infinity sales с..." | (not in code) | MISSING | NO — date_joined |
| contacts.location | (not in code) | MISSING | NO — region/district |
| contacts.email | (not in code) | MISSING | NO — user.email |
| contacts.instagram | (not in code) | MISSING | YES — new field needed |
| ... | | | |

## Main column components

| Figma component | Code component | Status | Backend needed? |
|----------------|---------------|--------|-----------------|
| section "Специализированные данные" | (not in code) | MISSING | NO — resume model has these |
| save button "Сохранить" | (not in code) | MISSING | NO — PUT /worker/profile exists |
| ... | | | |

## Filter / List components (for list pages)

| Figma element | Code element | Status |
|---------------|--------------|--------|
| Filter group "Профессиональная область" with counts | "Отрасль" group, no counts | LABEL_MISMATCH + MISSING_COUNTS |
| Filter group "Регион работы" | (not present, only "Город/район") | MISSING_FILTER_GROUP |
| Filter expand/collapse with "ещё N вариантов" | Static list | MISSING_INTERACTION |
| Card with logo + name + vacancy_count + region | Card with logo + name + "Неизвестно" | MISSING_DATA_BINDING |
| ... | | |

## Card / Empty state components

| Figma element | Code element | Status |
|---------------|--------------|--------|
| Empty state "+ Добавить место работы" | Empty section "Опыт работы" with no CTA | MISSING_EMPTY_STATE_CTA |
| ... | | |

## Layout type

| Aspect | Figma | Code | Status |
|--------|-------|------|--------|
| Page structure | Two-column with stepper sidebar + form | Single column form | LAYOUT_WRONG_TYPE |
| ... | | | |

## Out-of-scope (ignored per scope rules)
- Header changes (user-managed)
- Footer changes (user-managed)

## Summary
- STRUCTURAL_MISSING: N items
- STRUCTURAL_EXTRA: N items
- LABEL_MISMATCH: N items
- MISSING_DATA_BINDING: N items
- LAYOUT_WRONG_TYPE: yes/no
- Backend changes needed (BIG): N (list)
- Backend changes needed (SMALL): N (list)
- Script changes needed (BIG): N (list)
- Template-only changes: N

## Structural score
Computed: (matched_components / total_figma_components) * 100
This page: {score}%

## Decision
- score >= 95% AND no BIG backend/script: proceed to Step 5 (apply fixes)
- score 70-95% OR has BIG items: proceed to Step 5 for everything fixable,
  defer BIG to BLOCKERS.md, mark page PARTIAL
- score < 70%: page is fundamentally divergent. Apply only safe template-only
  fixes, mark page BLOCKED, log full diff for human decision
```

### STEP 4 — Decision gate (auto)

Read structural_score from Step 3.
Update page-queue.json with this score.

If structural_score >= 95% with no BIG blockers → proceed to Step 5
If 70-95% or BIG blockers → proceed but mark final status PARTIAL
If <70% → mark BLOCKED, write detailed report, skip remaining steps

In ALL cases: log BIG backend/script items to BLOCKERS.md.
Never STOP for human input. This runs offline.

### STEP 5 — Apply structural fixes

Order strictly:

#### 5a. Layout type fix (if LAYOUT_WRONG_TYPE)
If page should be wizard but is single form, OR two-column but is single column:
- This is a BIG template change
- Log to BLOCKERS.md with full description + Figma reference
- Mark page PARTIAL
- Skip to Step 7 (style fixes only) — don't try to invent wizard logic

#### 5b. Add MISSING components (template-only, backend exists)
For each STRUCTURAL_MISSING marked "Backend: NO":
- Add template block in correct position per Figma tree
- Wire to existing Vuex getter / API field
- Use exact text from Figma — Russian primary, add Uzbek to languages/uz.js
- After each addition: re-screenshot, verify it renders (not blank)

#### 5c. Add MISSING components (backend gap)
For each STRUCTURAL_MISSING marked "Backend: YES":
- DO NOT add stub data
- DO NOT invent API responses
- Log to BACKEND_CHANGES.md as BIG with:
  - Component description
  - Figma reference
  - What backend field/endpoint is needed
  - Page that needs it
- Add HTML comment in template at the position where it should go:
  `<!-- TODO: {component-name} — needs backend {field/endpoint}, see BACKEND_CHANGES.md -->`

#### 5d. Remove EXTRA components (only obvious cases)
If code has component that Figma doesn't AND it's clearly outdated
(e.g. demo block, deprecated widget):
- Comment it out (don't delete) with `<!-- REMOVED: not in Figma {date} -->`
- If unclear: leave it, log to BLOCKERS.md as "extra component, decide"

#### 5e. Fix LABEL_MISMATCH
- Update i18n keys in languages/ru.js AND languages/uz.js
- Both must update

#### 5f. Fix MISSING_DATA_BINDING
- Element exists, data exists in Vuex/props, just isn't bound: trivial fix
- Element exists, data missing from API: log to BACKEND_CHANGES.md as SMALL
  (just adding a field to serializer)

#### 5g. Fix MISSING_EMPTY_STATE_CTA
- Add the "+ Добавить X" empty-state CTA per Figma
- Wire to existing route or modal trigger if obvious
- If unclear what the CTA should do: log to BLOCKERS.md, leave non-functional

#### 5h. Fix MISSING_COUNTS / MISSING_BADGES
- Element exists in code, count/badge missing
- Add the binding (data usually in API response, just not rendered)

#### 5i. Vue 2 syntax check (MANDATORY before screenshot)
After ALL structural fixes, run:
```bash
grep -E '<template[^>]*v-for[^>]*:key|<template[^>]*:key[^>]*v-for' \
  {modified files}
```
If any match: fix per RECURRING_PATTERNS.md (move :key to inner elements
or replace <template> with <div>). Re-grep until 0 matches.

#### 5j. Screenshot verification
Take Playwright screenshot at 1440px.
Save: .visual-agent/screenshots/{page-name}-after-structure.png

Open the screenshot. Verify:
- Page loads (no blank/overlay/Nuxt error)
- All MISSING components Backend:NO have actually been added (visible)
- All MISSING components Backend:YES have visible TODO comment in DOM (or nothing)

If page is blank or overlay shows error: revert last 3 changes one at a time
until page loads. Log to BUGS_FOUND.md what broke.

### STEP 6 — Style diff

For every element that exists in BOTH Figma and code (post-structural-fix),
build a diff:

| Element | Property | Figma | Code | Match |
|---------|----------|-------|------|-------|
| .btn-primary | height | 48px | 40px | ❌ |
| ... | | | | |

Group:
- ATOM (fix in shared component file)
- LAYOUT (spacing, gap, position)
- TYPOGRAPHY
- COLOR (map to canonical token)
- BORDER
- SHADOW
- ICON (note image-export icons → download to static/img/icons/)

Save: audits/{page-name}-style-diff.md

### STEP 7 — Apply style fixes (in order)

7a. Atom fixes in shared component files
7b. Icon downloads (curl Figma CDN, save to static/img/icons/{name}.svg)
7c. Layout — convert position:absolute to flex/grid where possible (P25)
7d. Page-level SCSS — exact Figma px values, no rounding (P26)
7e. Template SVG fills → currentColor (except brand icons)
7f. New token candidates → add to _functions.scss if used 2+ times

After all style fixes: Playwright screenshot at 1440px.
Save: .visual-agent/screenshots/{page-name}-after-style.png

### STEP 8 — Multi-viewport screenshots

1440px (primary), 768px (tablet), 375px (mobile)
Save all three to .visual-agent/screenshots/{page-name}-{width}.png

If 768/375 looks broken AND Figma has no mobile design: note in report,
do not attempt mobile fixes.

### STEP 9 — Update RECURRING_PATTERNS.md

If new patterns observed (token miss, structural pattern, atom variation,
Figma quirk):
- Add P-rule with symptom, root cause, detection grep, fix, page first seen
- New tokens → also update Token map and C2 grep allowlist

### STEP 10 — Final verification + report

Self-check:
[ ] Structure: every Figma component has matching code (or logged to BACKEND/BLOCKERS)
[ ] Layout: type matches Figma OR logged as LAYOUT_WRONG_TYPE blocker
[ ] Empty states: + Добавить X CTAs in place
[ ] Counts/badges: rendered where Figma shows them
[ ] Atoms: button, input, card match RECURRING_PATTERNS.md specs
[ ] Spacing: exact Figma px (no rounding)
[ ] Typography: font-size/weight/line-height match
[ ] Colors: canonical token or annotated raw hex
[ ] Icons: replicated or downloaded
[ ] Vue 2 syntax: no <template :key=...> patterns
[ ] Visual: side-by-side check at 1440px — actually identical (not just "looks ok")
[ ] Patterns: RECURRING_PATTERNS.md updated
[ ] Cache: figma_cache/_index.json updated
[ ] Heartbeat: queue-heartbeat.json updated

Determine final status:
- All checks pass + structural_score 100% + no BLOCKERS for this page → DONE
- Structural fixes applied + remaining items in BLOCKERS.md → PARTIAL
- Couldn't proceed past Step 4 → BLOCKED

Write audits/{page-name}-FINAL.md with EXPLICIT structure:

```markdown
# {page-name} — Final Report
## Status: DONE | PARTIAL | BLOCKED
## Structural score: {N}%

## What was fixed
### Structural changes
- Components added: N (list with paths)
- Components removed/commented: N
- Layout type changes: N
- i18n changes: N (list of keys)

### Style changes
- Atom fixes (shared): N
- Page SCSS: N
- Icons downloaded: N
- Layout reworks: N

## What was NOT fixed (blockers)
### Backend BIG (in BACKEND_CHANGES.md)
- {item} — needs {description}
- ...

### Script BIG (in SCRIPT_CHANGES.md)
- {item} — needs {description}
- ...

### Layout blockers (in BLOCKERS.md)
- {item} — wizard structure needs rebuild

### User-managed (out of scope)
- Header changes (skipped per scope rule)
- Footer changes (skipped per scope rule)

## Files changed (full)
- pages/...
- components/...
- assets/scss/...
- languages/ru.js, languages/uz.js (if applicable)

## Screenshots
- 1440: path
- 768: path
- 375: path

## Cache hits / fetches this page
- Hits: N
- Fresh fetches: N

## Decision required from human
- {item} — explain what decision is needed
```

Update page-queue.json: status, structural_score, completed_at, audits list,
blockers list. Mark heartbeat last_session_ended_at.

Move to next page in queue.

---

## Five recurring patterns to actively check on EVERY page

These are the failure modes from the v1 sessions. Step 3 must explicitly
check each:

### CHK-1: Sidebar audit
Compare ALL sidebar/aside content. Figma sidebars typically have:
- Status/promotion cards
- Profile cards with multiple field rows
- Action CTAs (Create resume, Sales IQ)
- Toggles ("Открыт к предложениям")
- Filter groups with COUNTS per item
Frontend often misses 50%+ of these. List every one.

### CHK-2: Card content depth
Figma cards have: icon + title + count + region + verified mark
Frontend often shows: icon + title + "Неизвестно"
List every missing card field.

### CHK-3: Filter/empty-state CTAs
Figma uses "+ Добавить X" empty states everywhere.
Figma uses "ещё N вариантов" expand toggles in filters.
Frontend often has none. List every missing empty-state pattern.

### CHK-4: Form field completeness
Figma forms have: every field labeled with red asterisk for required
Frontend forms often miss: 30-50% of fields, or have different ordering
Compare field-by-field.

### CHK-5: Save/submit/cancel buttons
Figma forms always have save/cancel buttons in specific positions.
Frontend often has wrong buttons or missing entirely.

If ANY of CHK-1 through CHK-5 has missing items, structural_score < 95%
and page CANNOT be marked DONE.

---

## OFFLINE MODE — autonomous rules

User is offline. Multiple sessions will run.

- DO NOT stop for any reason except: MCP down for >30 min, dirty tree
  >5 unrelated files (excluding header/footer)
- DO NOT ask for approval — log decisions, continue
- DO NOT commit — user reviews and commits between sessions
- DO update queue-heartbeat.json before EVERY operation (file write, MCP call,
  screenshot)
- DO update page-queue.json after EVERY page (status change)
- If a page would take >2 hours: mark PARTIAL with reason "complexity exceeds
  session budget", move on
- If 3 consecutive pages get same regression type: STOP, log systematic issue
  to BLOCKERS.md

## When queue empty: final report

Write .visual-agent/full-queue-report.md:

```markdown
# Queue Final Report — {date range}

## Summary table
| Page | Status | Score | Started | Completed | Files | Blockers |
|------|--------|-------|---------|-----------|-------|----------|

## Aggregated blockers needing your decision
### Backend BIG (consolidated)
- Field: instagram (Worker model) — needed by: profile, contacts
- Field: telegram (Worker model) — needed by: profile, contacts
- New endpoint: SalesIQ score — needed by: profile, dashboard
- New model: PromotionStatus — needed by: profile sidebar, account
- ...

### Script BIG (consolidated)
- Wizard logic for create-resume — needs Vuex flow
- Filter expand/collapse interaction for company list
- ...

### Layout blockers
- create-resume: wizard structure complete rebuild
- ...

## Pattern observations
- Patterns reinforced: P{N}, P{N+1}
- New patterns added: list
- Token additions: list

## Recommended next session focus
- Pages that need re-fix after backend changes: list
- Pages PARTIAL with template-only blockers: list (can be finished now)
- Pages BLOCKED entirely: list (need decisions first)
```

---

## Session start

1. Read this file end to end
2. Read RECURRING_PATTERNS.md end to end
3. Initialize or resume page-queue.json
4. Initialize queue-heartbeat.json
5. Begin first page in queue with status NOT_RUN

Now the kickoff prompt — paste this in Claude Code:
Read docs/promp/full-page-fix-v2.md and RECURRING_PATTERNS.md fully.

Initialize state files:
- .visual-agent/page-queue.json from .visual-agent/page-list.json (only entries
  where figma_node !== null and status: matched)
- .visual-agent/queue-heartbeat.json (empty, will be populated)

For each page in page-queue.json with status NOT_RUN, run Steps 0–10 of
full-page-fix-v2.md.

SCOPE EXCLUSIONS — do not modify:
- components/Header.vue
- components/Footer.vue
- assets/scss/_header.scss
- assets/scss/_footer.scss

If a page's structural diff shows header/footer mismatch, log "user-managed,
skip" and continue with rest of page.

OFFLINE MODE:
- I am not available — do not ask, do not pause, do not commit
- Log every problem (BLOCKERS.md, BACKEND_CHANGES.md, SCRIPT_CHANGES.md, BUGS_FOUND.md)
- Update queue-heartbeat.json before EVERY operation
- Update page-queue.json after EVERY page
- Auto-continue between pages

STOP CONDITIONS (only):
- Figma MCP unreachable >30 min (retry every 5 pages, then stop if still down)
- Working tree dirty >5 unrelated files (excluding header/footer)
- Same regression on 3+ consecutive pages

PROFILE PAGE WAS PREVIOUSLY MARKED DONE INCORRECTLY:
- Set worker-profile, worker-create-resume, worker-company, worker-search,
  worker-vacancy, worker-vacancy-details, worker-home, worker-desk-saved,
  worker-desk-interview, worker-desk-application status to NOT_RUN
- These need to be re-audited honestly with the v2 prompt
- Their old "DONE" marking was based on v1's broken verification gate

When queue completes (or you hit a stop condition):
- Write .visual-agent/full-queue-report.md
- List consolidated backend/script decisions I need to make
- Stop

If running for the second/third time: read queue-heartbeat.json. If a page
has status RUNNING with stale heartbeat, resume from its current_step.

Start.