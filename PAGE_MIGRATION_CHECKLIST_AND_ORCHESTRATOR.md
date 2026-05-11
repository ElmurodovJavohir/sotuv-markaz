# Page Migration Checklist & Orchestrator

---

## PART 1: When is a page "DONE"?

A page is complete when ALL of these pass:

### Level 1 — Token compliance (automated, already done for most pages)
- [ ] Zero hardcoded hex in `<style>` blocks that match SCSS token table
- [ ] Zero `:deep()` — all converted to `::v-deep`
- [ ] Zero Tailwind arbitrary brackets with standard class alternatives
- [ ] CTA gradients use canonical `213.7deg` angle
- [ ] `0px` → `0` everywhere

### Level 2 — Figma property match (automated with cached data)
- [ ] **Colors**: every color in `<style>` matches Figma (via token or exact hex with `// non-token` comment)
- [ ] **Typography**: font-size, font-weight, line-height, letter-spacing match Figma for every text element
- [ ] **Spacing**: padding (all 4 sides), margin, gap match Figma values
- [ ] **Borders**: width, color, radius match Figma
- [ ] **Shadows**: box-shadow matches Figma effect values
- [ ] **Dimensions**: width, height, min/max constraints match where specified
- [ ] **Opacity**: matches Figma if < 1

### Level 3 — Layout compliance (automated check + visual verify)
- [ ] No `position: absolute` where flex/grid works
- [ ] Page renders correctly at 1440px (desktop)
- [ ] Page renders correctly at 768px (tablet)
- [ ] Page renders correctly at 375px (mobile)
- [ ] No horizontal scrollbar at any breakpoint

### Level 4 — Component compliance (automated)
- [ ] All shared components used on this page are themselves DONE
- [ ] `::v-deep` overrides for Bootstrap Vue / Element UI use `!important` only where needed
- [ ] Every `<img>` has `@error` handler
- [ ] SVG icons use `fill="none" stroke="currentColor" stroke-width="1.5"` (except brand icons)

### Level 5 — Visual verification (Javokhir reviews)
- [ ] Playwright screenshot at 1440px matches Figma screenshot
- [ ] No structural divergence (Figma layout matches Vue template structure)
- [ ] Hover states work on interactive elements
- [ ] No visual regressions from prior working state

### Page status values
- **TOKEN_DONE** — Level 1 passes
- **FIGMA_SYNCED** — Levels 1-4 pass
- **VERIFIED** — All 5 levels pass (Javokhir approved)
- **BLOCKED** — Cannot complete due to external dependency
- **PARKED** — Waiting for design/product decision

---

## PART 2: Per-page QA checklist (from recurring patterns)

Run this checklist on every page AFTER applying fixes:

### Colors (P01)
- [ ] No `#19192d` → should be `$dark-blue`
- [ ] No `#0085ff` → should be `$blue`
- [ ] No `#268ae7` → should be `$blue-link`
- [ ] No `#29b2ff` → should be `$blue-light`
- [ ] No `#768194` → should be `$grey`
- [ ] No `#fff/#ffffff` → should be `$white`
- [ ] No `color: white/black` keywords in style blocks
- [ ] `$blue` used only in CTA gradients, not for links
- [ ] `$blue-link` used for links and active states, not CTAs

### Gradients (P02)
- [ ] All CTA gradients: `linear-gradient(213.7deg, $blue-light 0%, $blue 100%)`
- [ ] No variant angles (214.09°, 222.02°, 179.99°, 218°)

### Spacing (P06, P19)
- [ ] Section padding matches Figma (cite node if available)
- [ ] Card padding is canonical: 8/12/16/20/24px
- [ ] No Bootstrap `.row` gutter overrides needed (check if Figma gap ≠ 30px)
- [ ] No `margin-bottom-30` utility class
- [ ] `0` not `0px`

### Typography (P07)
- [ ] Every text element has explicit `font-weight`
- [ ] DemiBold 600 used correctly (→ 500 if Lato renders too heavy, with comment)
- [ ] Subtitle pattern: 16px / 600 / `$grey`

### Borders & Radius (P09)
- [ ] Buttons: 8px
- [ ] Cards: 12px
- [ ] Inputs: 8px
- [ ] Modals: 16px
- [ ] Pills/tags: 20px or 50%

### Shadows (P16)
- [ ] Card shadows match Figma values
- [ ] No made-up shadow values

### Icons (P10)
- [ ] Outline: `fill="none" stroke="currentColor" stroke-width="1.5"`
- [ ] No `fill="#hex"` unless Figma explicitly fills
- [ ] Arrows/chevrons: `stroke-width="1.4"`

### Images (P15)
- [ ] Every `<img>` has `@error` handler
- [ ] `object-fit: cover` on thumbnails
- [ ] Avatar placeholder uses `noava1.svg`

### Hover (P18)
- [ ] Every `cursor: pointer` has `:hover` change
- [ ] Card hover: `translateY(-2px)` + shadow
- [ ] Button hover on gradient: `filter: brightness(0.95)`

### Layout (P19)
- [ ] No `position: absolute` where flex/grid works
- [ ] Section title comes before subtitle in HTML order (P17)

### Framework (P04, P05, P08, P14)
- [ ] `::v-deep` not `:deep()` for scoped style piercing
- [ ] `!important` only for `.b-` / `.el-` library overrides
- [ ] No unscoped `<style>` leaking globally (unless namespaced with root class)

---

## PART 3: Claude Code → OpenCode Orchestrator Prompt

Copy this into Claude Code. It dispatches pages to OpenCode one by one.

```markdown
# TASK: Full Figma page migration orchestrator

You are the orchestrator. For each page, you generate a compact prompt
and send it to OpenCode via the ask-opencode MCP tool. OpenCode does
the heavy lifting (reading files, diffing, fixing). You just dispatch
and collect results.

## SETUP
- Working directory: sotuv-markaz-frontend/ (on master branch)
- Figma cache: ../figma_cache/
- OpenCode MCP: connected (ask-opencode tool)

## PAGES TO PROCESS
{PASTE PAGE LIST HERE — format: page_path | figma_node | route}

## FOR EACH PAGE, DO:

### Step 1: Check cache
Look for ../figma_cache/ data for this page's Figma node.
- If design_context.json exists → include extracted values in the prompt
- If only metadata.json exists → include structure info
- If nothing cached → tell OpenCode to call Figma MCP and SAVE the response

### Step 2: Generate OpenCode prompt
Send to OpenCode via ask-opencode:

"Fix page {PAGE_PATH} to match Figma design.

FIGMA DATA:
{paste key values from cache: colors, typography, spacing, borders, shadows}

CURRENT FILE: {PAGE_PATH}
Read the <style> block and fix every mismatch:

FIXES TO APPLY:
1. Colors: replace any hardcoded hex with SCSS tokens where match exists
2. Typography: match font-size, font-weight, line-height to Figma
3. Spacing: match padding, margin, gap to Figma
4. Borders: match width, color, radius to Figma
5. Shadows: match box-shadow to Figma
6. Layout: flex/grid instead of position:absolute

SCSS TOKENS: $dark-blue=#19192d, $blue=#0085ff, $blue-link=#268ae7, 
$blue-light=#29b2ff, $grey=#768194, $bg-section=#f5f7f9, 
$border-card=#eef2f9, $border-color=#e8e8e8, $white=#fff, 
$red=#fb2828, $green=#00a795, $amber=#ffb547

RULES:
- Style blocks only, no script changes
- ::v-deep not :deep()
- Save any Figma MCP response to ../figma_cache/
- Do NOT commit

Report: files changed, properties fixed, issues found."

### Step 3: Collect result
Read OpenCode response. Log:
- Page name
- Files changed
- Properties fixed
- Issues needing visual review
- Backend changes needed

### Step 4: Move to next page

## AFTER ALL PAGES
Print summary table:
| Page | Files | Properties | Status | Visual review needed |
```

---

## PART 4: Page priority list (use with orchestrator)

### Batch 1 — Homepage components (9 GitHub issues)
| Page/Component | File | Figma node | Cache status |
|---------------|------|-----------|-------------|
| Hero/MainSection | components/sections/MainSection.vue | 2129:49041 | cached |
| VacanciesByIndustry | components/sections/VacanciesByIndustry.vue | 2129:48706 | cached (homepage) |
| VacanciesByCompany | components/sections/VacanciesByCompany.vue | 2129:48730 | cached (homepage) |
| LatestVacancies | components/sections/LatestVacancies.vue | 2129:48748 | cached (homepage) |
| OpinionSection | components/sections/OpinionSection.vue | 2129:48997 | cached (homepage) |
| DownloadingMobileApp | components/sections/DownloadingMobileApp.vue | 2129:48865 | cached (homepage) |

### Batch 2 — Priority pages (design_context cached)
| Page | File | Figma node | Cache status |
|------|------|-----------|-------------|
| Vacancy list | pages/worker/vacancy/index.vue | 2129:58545 | cached |
| Vacancy detail | pages/worker/vacancy/details/_slug.vue | 2129:58892 | cached |
| Worker profile | pages/worker/profile/index.vue | 2129:56453 | cached |
| Register | pages/worker/register.vue | 2129:49252 | cached |
| Company home | pages/company/home.vue | 2129:120760 | cached |

### Batch 3 — 13 broken pages (need Playwright verification)
| Page | File | Fixes applied | Issue |
|------|------|--------------|-------|
| worker-vacancy | pages/worker/vacancy/index.vue | 50 | Playwright broken post-sweep |
| worker-company | pages/worker/company/index.vue | 31 | Broken post-sweep |
| worker-vacancy-slug | pages/worker/vacancy/_slug.vue | 52 | Broken post-sweep |
| company-home | pages/company/home.vue | 19 | No style in page file |
| company-index | pages/company/index.vue | 0 | Redirect wall |
| company-register | pages/company/register.vue | 5 | Broken post-sweep |
| worker-subscribe | pages/worker/subscribe.vue | 6 | Broken post-sweep |
| company-profile-index | pages/company/profile/index.vue | 31 | Broken post-sweep |
| company-category | pages/company/category.vue | 8 | Broken post-sweep |
| company-vacancy-slug | pages/company/vacancy/_slug.vue | 26 | Broken post-sweep |
| company-tarif-status | pages/company/tarif/status.vue | 4 | Broken post-sweep |
| company-tarif-multi-profile | pages/company/tarif/multi-profile/index.vue | 6 | Broken post-sweep |
| email-verify | pages/email/verify.vue | 2 | Broken post-sweep |

### Batch 4 — Remaining worker pages (token done, no Figma depth)
All worker pages not in batches 1-3.

### Batch 5 — Remaining company pages
All company pages not in batches 1-3.

---

## PART 5: Figma cache rules (for OpenCode)

Include this in every OpenCode prompt:

```
FIGMA CACHE RULES:
1. Before calling Figma MCP, check ../figma_cache/ for existing data
2. Cache locations:
   - Components: ../figma_cache/components/{node_id}/design_context.json
   - Pages: ../figma_cache/pages/{page_slug}/{section}/design_context.json
3. If cache exists → read from file, do NOT call MCP
4. If cache does NOT exist → call MCP, SAVE response immediately:
   - get_metadata → save as metadata.json
   - get_design_context → save as design_context.json
   - get_screenshot → save as screenshot.json
5. MCP threshold: get_design_context works under ~300k px², times out above
   - For large frames: get_metadata first, then get_design_context on grandchildren
6. Wait 10 seconds between MCP calls
7. File key: whwt0wJFk3XFkkXNsVgqQh
8. Params: clientFrameworks="vue,nuxt", clientLanguages="javascript,scss,html"
```
