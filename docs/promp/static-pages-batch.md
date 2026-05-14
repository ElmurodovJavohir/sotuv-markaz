# Static Pages Batch — Create or Fix (10 pages)

## Goal
Process 10 static/low-dynamic pages. For each:
- If page file doesn't exist → CREATE from Figma
- If page file exists → AUDIT + FIX using analyzer-v3 methodology

Use the queue runner pattern from `page-problem-analyzer-v3.md`. 
This prompt is a scoped subset — only these 10 pages, not the full queue.

---

## Pages

| # | Name | Route | Figma node | Suggested Vue path |
|---|------|-------|------------|-------------------|
| 1 | error-500 | (Nuxt error layout) | 2129:63238 | layouts/error.vue + components/errors/Error500.vue |
| 2 | error-404 | (Nuxt error layout) | 2129:62679 | layouts/error.vue + components/errors/Error404.vue |
| 3 | partners | /ru/partners | 2129:54819 | pages/partners.vue |
| 4 | investors | /ru/investors | 2129:54844 | pages/investors.vue |
| 5 | ads-on-site | /ru/ads | 2129:54869 | pages/ads.vue |
| 6 | send-message | /ru/feedback | 2129:54923 | pages/feedback.vue (or pages/contact.vue) |
| 7 | faq | /ru/faq | 2129:54894 | pages/faq.vue |
| 8 | about-us | /ru/about | 2129:54518 | pages/about.vue |
| 9 | brand-resources | /ru/company-brand | 2129:54399 | pages/company-brand.vue |
| 10 | static-slug | /ru/static/test | 2129:54500 | pages/static/_slug.vue |

---

## HARD RULES

- Use ALL rules from `page-problem-analyzer-v3.md` — including Step 2.5 
  component traversal, Phase A-H fix workflow
- P30/P31/P32/P33 mandatory — every px value needs Figma source comment
- i18n MANDATORY for both `languages/ru.js` and `languages/uz.js`
- DO NOT touch Header.vue or Footer.vue
- DO NOT modify backend
- DO NOT commit
- DO NOT run yarn build
- Take screenshots after each phase, revert if page breaks

---

## Per-page decision tree

### Step 1 — Check if page exists

```bash
# For each page in the list:
ls {suggested-vue-path} 2>/dev/null
```

Three outcomes:

**Outcome A — File exists at expected path:**
- Path: CREATE_OR_FIX = "FIX"
- Proceed with analyzer-v3 full workflow (Steps 1-12)

**Outcome B — File exists at different path:**
- Search: `find pages/ -name "*.vue" | xargs grep -l "{distinctive-text-from-figma}"`
- Or search by route in nuxt config
- If found: update the table with actual path, mark as FIX
- If not: mark as CREATE

**Outcome C — File doesn't exist:**
- Path: CREATE_OR_FIX = "CREATE"
- Use create-new-pages workflow (Figma → Vue from scratch)

### Step 2 — Run appropriate workflow

#### For FIX path (existing pages):
Use full analyzer-v3 (`docs/promp/page-problem-analyzer-v3.md`):
- Step 1-7: AUDIT (page + components, 17 categories)
- Step 8: APPLY FIXES (Phase A-H)
- Step 9: Visual verify
- Step 10: FIX-LOG.md
- Step 11: Update queue

#### For CREATE path (new pages):

##### Step 2.A — Figma fetch
```
get_design_context(
  nodeId="{figma_node}",
  clientFrameworks="vue,nuxt",
  clientLanguages="javascript,scss,html"
)
```
Save to `figma_cache/{node}.json` immediately.
Save tree to `figma-trees/{page-name}.json`.

##### Step 2.B — Extract specs
Per element, extract from JSON:
- Layout: paddingTop/Right/Bottom/Left, itemSpacing, layoutMode, width
- Visual: fills, strokes, cornerRadius, effects
- Typography: fontSize, fontWeight (numeric), lineHeightPx, letterSpacing

Save to `.migration-review/static-pages/{name}/SPECS.md`.

##### Step 2.C — Generate Vue file

Template structure:
```vue
<template>
  <div class="page-{name}">
    <div class="container">
      <section class="hero">
        <h1 class="hero__title">{{ $t('{namespace}.hero_title') }}</h1>
        <!-- more sections from Figma -->
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: '{PascalCaseName}',
  head() {
    return {
      title: this.$t('{namespace}.page_title') + ' — Sotuv Markaz',
      meta: [
        { hid: 'description', name: 'description', content: this.$t('{namespace}.page_description') }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.page-{name} {
  .container {
    max-width: 1242px;     // figma {frame-node} absoluteBoundingBox.width
    padding: 0 64px;       // figma {frame-node} paddingLeft/paddingRight
    margin: 0 auto;
  }
  
  .hero {
    padding-top: 80px;     // figma {hero-node} paddingTop
    padding-bottom: 64px;  // figma {hero-node} paddingBottom
    
    &__title {
      font-size: 48px;     // figma {title-node} fontSize
      font-weight: 700;    // figma {title-node} fontWeight
      line-height: 56px;   // figma {title-node} lineHeightPx
      color: $dark-blue;
    }
  }
}
</style>
```

Every px value needs `// figma {node-id} {property}` comment.

##### Step 2.D — i18n keys

Add to BOTH `languages/ru.js` and `languages/uz.js`:

```js
// ru.js — pick a new namespace per page
about: {
  page_title: 'Russian title from Figma characters',
  page_description: 'Russian description',
  hero_title: '...',
  // all visible strings
}
```

```js
// uz.js
about: {
  page_title: 'Uzbek title',
  page_description: 'Uzbek description',
  hero_title: '...',
}
```

Russian: from Figma `characters` directly.
Uzbek: translate reasonably. If unclear: placeholder `"Uz translation pending"`, log to BLOCKERS.

Namespace conventions:
- about-us → `about`
- partners → `partners`
- investors → `investors`
- ads-on-site → `ads`
- send-message → `feedback`
- faq → `faq`
- error-404 → `error.code_404`
- error-500 → `error.code_500`
- brand-resources → `brand`
- static-slug → `static`

##### Step 2.E — Error pages special

For error-404 and error-500:
- Read existing `layouts/error.vue` (or create if missing)
- Modify to switch on `error.statusCode`
- Create `components/errors/Error404.vue` and `Error500.vue` from Figma

```vue
<!-- layouts/error.vue -->
<template>
  <div class="error-page">
    <error-404 v-if="error.statusCode === 404" />
    <error-500 v-else-if="error.statusCode === 500" />
    <error-default v-else :error="error" />
  </div>
</template>

<script>
import Error404 from '~/components/errors/Error404.vue'
import Error500 from '~/components/errors/Error500.vue'

export default {
  layout: 'empty',
  props: ['error'],
  components: { Error404, Error500 }
}
</script>
```

##### Step 2.F — Screenshot verify

Navigate via Playwright:
- 1440px → `.visual-agent/screenshots/static-pages/{name}-1440.png`
- 768px → `-768.png`
- 375px → `-375.png`

For error pages: navigate to non-existent route to trigger 404.

Visual compare with Figma, estimate match %.

##### Step 2.G — Per-page report

Write `.migration-review/static-pages/{name}/REPORT.md`:

```markdown
# {name} — {CREATE or FIX} Report

- Path: CREATE | FIX
- Created/Modified: {ISO}
- Route: {route}
- Figma node: {node}
- Files: [list]

## Figma source extraction
- Elements analyzed: N
- Spacing properties extracted: N
- Typography properties extracted: N
- Missing Figma data for: [list]

## P30-P33 validation
- All px values have Figma source comments: Y/N
- Typography in px/numeric: Y/N
- Container width exact: Y/N
- Borders/radius from Figma: Y/N

## i18n
- ru.js keys added: N
- uz.js keys added: N

## Screenshots
- 1440px: [path]
- 768px: [path]
- 375px: [path]

## Match estimate
- 1440px: N%
- Mobile: N% (or "no mobile design in Figma")

## Blockers
- [list]

## Status
DONE | GOOD | NEEDS_WORK
```

### Step 3 — Update queue

Write `.visual-agent/static-pages-batch-queue.json`:

```json
{
  "started_at": "ISO",
  "pages": [
    {
      "name": "about-us",
      "path_status": "CREATE | FIX",
      "vue_path": "pages/about.vue",
      "figma_node": "2129:54518",
      "status": "NOT_RUN | RUNNING | DONE | PARTIAL | ERRORED",
      "started_at": null,
      "completed_at": null,
      "match_estimate": null,
      "files_changed": [],
      "blockers": []
    }
  ]
}
```

Update after every page.

### Step 4 — Move to next page

Don't pause. Don't ask. Continue.

---

## When all 10 pages done — final report

Write `.visual-agent/static-pages-batch-report-{date}.md`:

```markdown
# Static Pages Batch Report — {date}

## Summary
- Total pages: 10
- CREATED: N
- FIXED: N
- DONE (95%+ match): N
- PARTIAL: N
- ERRORED: N

## Per-page status
| # | Name | Path | Status | Match % | Files | Blockers |
|---|------|------|--------|---------|-------|----------|

## Files changed (git diff --stat)

## i18n keys added
- ru.js: N keys across N namespaces
- uz.js: N keys

## Validation summary
- P30 (spacing comments): N violations across all files
- P31 (typography format): N
- P32 (width exact): N
- P33 (borders): N

## Blockers consolidated
- Figma data missing: [list]
- Uzbek translation pending: [list]  
- Design questions: [list]

## Decisions needed from Javokhir
[questions]

## Recommendation
- Pages ready for client demo: [list]
- Pages needing polish: [list]
```

---

## OFFLINE MODE

User is offline. Process all 10 pages unattended.

Don't stop unless:
- Figma MCP unreachable >30 min
- 3 consecutive pages error with same issue
- Working tree dirty >10 unrelated files

Don't:
- Ask for approval
- Pause between pages
- Commit anything
- Modify Header.vue or Footer.vue
- Modify backend

Do:
- Update queue + heartbeat every step
- Continue through errors
- Take all night if needed

---

## START

1. Read this prompt fully
2. Read `docs/promp/page-problem-analyzer-v3.md` for analyzer methodology
3. Read RECURRING_PATTERNS.md (P30-P33 especially)
4. For each of 10 pages: check existence, run CREATE or FIX path
5. Update queue after each page
6. Write final batch report when all done
7. Stop

Begin.