# Create New Pages — Batch from Figma

## Goal
Create 11 new pages from scratch using Figma designs as exact source. 
These pages don't exist in code yet. No auth required. Demo-ready output.

Every spacing, typography, color, border, and shadow value must be 
read from Figma JSON — not visually estimated.

---

## Pages to create

| # | Name | Route | Figma node | Type |
|---|------|-------|------------|------|
| 1 | about-us | /ru/about | 2129:54518 | Static content |
| 2 | brand-resources | /ru/company-brand | 2129:54399 | Static (may exist — verify) |
| 3 | static-slug | /ru/static/test | 2129:54500 | Dynamic static page |
| 4 | error-500 | (Nuxt error layout) | 2129:63238 | Error page |
| 5 | error-404 | (Nuxt error layout) | 2129:62679 | Error page |
| 6 | partners | /ru/partners | 2129:54819 | Static content |
| 7 | investors | /ru/investors | 2129:54844 | Static content |
| 8 | ads-on-site | /ru/ads | 2129:54869 | Static content |
| 9 | send-message | /ru/feedback | 2129:54923 | Form page |
| 10 | faq | /ru/faq | 2129:54894 | Q&A page |
| 11 | footer-reference | (reference only) | 2129:53544 | Fetch for reference, DO NOT modify Footer.vue |

---

## HARD RULES

- **DO NOT modify** `components/Header.vue` or `components/Footer.vue` — user-managed
- **DO NOT modify backend** — only frontend
- **DO NOT commit** — user reviews and commits
- **DO NOT run yarn build** — hot reload only
- **P30 mandatory** — every px value must have Figma source comment
- **P31 mandatory** — typography in px and numeric weight
- **P32 mandatory** — container widths exact from Figma, no rounding
- **P33 mandatory** — border/radius/shadows exact from Figma
- **i18n mandatory** — both `languages/ru.js` and `languages/uz.js` must be updated
- Every user-facing string must be `$t('key.name')`, never hardcoded

---

## Pre-flight check

Before starting, verify environment:

```bash
cd sotuv-markaz-frontend

# Working tree should be clean or minimal
git status --short | wc -l

# Verify Figma MCP reachable
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3845/mcp
# Expect 400 (bad format) or 200 — anything but connection refused

# Verify dev server  
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3004
# Expect 200 or 301

# Create required directories
mkdir -p figma_cache figma-trees audits
mkdir -p .visual-agent/screenshots/new-pages
mkdir -p .migration-review/new-pages
mkdir -p pages/error
```

If any pre-flight fails: stop and log to `.visual-agent/new-pages-batch-blockers.md`.

---

## Per-page workflow (Steps 1-8)

### Step 1 — Update progress

Write to `.visual-agent/new-pages-batch-progress.json`:

```json
{
  "started_at": "ISO timestamp",
  "current_page": "{page-name}",
  "current_step": "STEP_1_FIGMA_FETCH",
  "completed": [],
  "errored": []
}
```

Update this file after every step.

### Step 2 — Figma fetch

Call MCP:
get_design_context(
nodeId="{figma_node}",
clientFrameworks="vue,nuxt",
clientLanguages="javascript,scss,html"
)

Save IMMEDIATELY:
- Raw response → `figma_cache/{figma_node}.json`
- Update `figma_cache/_index.json` with entry: `{node-id, name, fetched_at}`
- Simplified tree → `figma-trees/{page-name}.json`

If frame too large (response >50KB or timeout):
1. Use `get_metadata({figma_node})` first
2. Iterate through children, calling `get_design_context` for each child
3. Save each chunk separately as `figma_cache/{figma_node}-{child-id}.json`
4. Build composite tree in `figma-trees/{page-name}.json`

Wait 10 seconds between MCP calls.

### Step 3 — Extract design specs from JSON

Parse the Figma JSON. For every visible element extract:

**Layout properties:**
- `absoluteBoundingBox.x`, `.y`, `.width`, `.height`
- `paddingTop`, `paddingRight`, `paddingBottom`, `paddingLeft`
- `itemSpacing` (flex/auto-layout gap)
- `layoutMode` (HORIZONTAL/VERTICAL/NONE)
- `primaryAxisAlignItems`, `counterAxisAlignItems`
- `layoutSizingHorizontal`, `layoutSizingVertical` (FILL/HUG/FIXED)

**Visual properties:**
- `fills` array — background colors, gradients
- `strokes` array — borders (width, color, alignment)
- `cornerRadius` or `rectangleCornerRadii[]`
- `effects` array — shadows, blurs

**Text properties (for TEXT nodes):**
- `characters` (the text content)
- `style.fontSize`
- `style.fontWeight` (numeric: 400/500/600/700)
- `style.lineHeightPx` or `style.lineHeightPercent`
- `style.letterSpacing`
- `style.fontFamily`
- `style.textCase`
- `style.textAlignHorizontal`

Save extracted specs to `.migration-review/new-pages/{page-name}/SPECS.md` 
as a reference table:

```markdown
# {page-name} — Extracted Specs

## Layout
| Element | Node ID | Width | Padding (T/R/B/L) | Gap | Layout mode |
|---------|---------|-------|-------------------|-----|-------------|
| frame   | {id}    | 1242  | 80/64/64/64       | 32  | VERTICAL    |
| hero    | {id}    | FILL  | 0/0/40/0          | 16  | VERTICAL    |
| ...     |         |       |                   |     |             |

## Typography
| Element | Node ID | Font | Size | Weight | Line height | Letter spacing |
|---------|---------|------|------|--------|-------------|----------------|
| h1      | {id}    | Inter| 48   | 700    | 56px        | -0.02em        |
| ...     |         |      |      |        |             |                |

## Colors
| Element | Node ID | Property | Value | Token mapping |
|---------|---------|----------|-------|---------------|
| section bg | {id} | fills[0] | #f5f7f9 | $bg-section |
| heading | {id} | fills[0] | #19192d | $dark-blue |
| ...     |       |          |       |               |

## Borders/Radius/Shadows
| Element | Node ID | Property | Value |
|---------|---------|----------|-------|
| .card   | {id}    | cornerRadius | 12 |
| .card   | {id}    | effects[0] | DROP_SHADOW 0 2 8 0 rgba(0,0,0,0.06) |
```

This SPECS.md is your reference while writing Vue/SCSS.

### Step 4 — Generate Vue page

Create file at the path from the pages table.

**Template structure:**

```vue
<template>
  <div class="page-{name}">
    <div class="container">
      <section class="{section-class}">
        <h1 class="{section-class}__title">{{ $t('{namespace}.{key}') }}</h1>
        <p class="{section-class}__subtitle">{{ $t('{namespace}.{key}') }}</p>
        <!-- more elements -->
      </section>
      <!-- more sections -->
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
        { 
          hid: 'description', 
          name: 'description', 
          content: this.$t('{namespace}.page_description') 
        },
        { 
          hid: 'og:title', 
          property: 'og:title', 
          content: this.$t('{namespace}.page_title') 
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.page-{name} {
  // All spacing/typography with Figma source comments
}
</style>
```

**Style requirements per P30/P31/P32/P33:**

```scss
.page-{name} {
  .container {
    max-width: 1242px;          // figma {frame-node} absoluteBoundingBox.width
    padding: 0 64px;            // figma {frame-node} paddingLeft/paddingRight  
    margin: 0 auto;
  }

  .hero {
    padding-top: 80px;          // figma {hero-node} paddingTop
    padding-bottom: 64px;       // figma {hero-node} paddingBottom
    
    &__title {
      font-size: 48px;          // figma {title-node} fontSize
      font-weight: 700;         // figma {title-node} fontWeight
      line-height: 56px;        // figma {title-node} lineHeightPx
      letter-spacing: -0.02em;  // figma {title-node} letterSpacing
      color: $dark-blue;        // canonical token
      margin: 0 0 24px;         // figma spacing to next element
    }

    &__subtitle {
      font-size: 18px;          // figma {subtitle-node} fontSize
      font-weight: 400;         // figma {subtitle-node} fontWeight
      line-height: 28px;        // figma {subtitle-node} lineHeightPx
      color: $grey;
    }
  }

  .card {
    border-radius: 12px;                       // figma {card-node} cornerRadius
    border: 1px solid $border-color;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);  // figma {card-node} effects[0]
    padding: 24px;                             // figma {card-node} paddingTop/etc
  }
}
```

**Rules while writing:**
- Every px value gets a `// figma {node-id} {property}` comment
- font-size in px, font-weight numeric, line-height in px
- Container widths exact (e.g. 1242px not 1200px)
- Border-radius from Figma cornerRadius
- Colors from canonical token map first, hardcoded hex with comment only if no token

### Step 5 — i18n keys

Read both `languages/ru.js` and `languages/uz.js` first to see their structure.

Add a NEW namespace for each page. **Do NOT modify existing namespaces** (avoid conflict with Agent 3 which may be editing common namespaces).

```js
// languages/ru.js — add at the end of the export
about: {
  page_title: 'О нас',
  page_description: 'Узнайте больше о Sotuv Markaz',
  hero_title: 'Кто мы',
  hero_subtitle: 'Платформа для поиска работы и обучения продажам',
  section_mission_title: 'Наша миссия',
  // ... all visible strings from Figma characters property
},

partners: {
  page_title: 'Партнёры',
  page_description: 'Стать партнёром Sotuv Markaz',
  // ...
},

// repeat for each new page namespace
```

```js
// languages/uz.js — same structure
about: {
  page_title: 'Biz haqimizda',
  page_description: 'Sotuv Markaz haqida ko\'proq ma\'lumot',
  hero_title: 'Biz kimmiz',
  hero_subtitle: 'Ish topish va savdo bo\'yicha ta\'lim platformasi',
  section_mission_title: 'Bizning maqsadimiz',
  // ...
},

partners: {
  page_title: 'Hamkorlar',
  // ...
}
```

**Source for translations:**
- Russian: directly from Figma's `characters` property
- Uzbek: translate from Russian. If translation unclear, use placeholder 
  `"Uz translation pending: {ru text}"` and note in BLOCKERS

**Namespace naming convention:**
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

### Step 6 — Error pages special handling

For error-404 and error-500, do NOT create as regular pages.

Use Nuxt's error layout pattern:

1. Read existing `layouts/error.vue` (or create if missing)
2. Modify to render different content per `error.statusCode`:

```vue
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
import ErrorDefault from '~/components/errors/ErrorDefault.vue'

export default {
  layout: 'empty',
  props: ['error'],
  components: { Error404, Error500, ErrorDefault },
  head() {
    return {
      title: this.error.statusCode === 404 
        ? this.$t('error.code_404.title') 
        : this.$t('error.code_500.title')
    }
  }
}
</script>
```

3. Create `components/errors/Error404.vue` and `Error500.vue` from Figma
4. Create simple `ErrorDefault.vue` as fallback

To test:
- 404: navigate to `http://localhost:3004/ru/this-does-not-exist`
- 500: harder — temporarily throw an error in a test page to force it 
  (don't keep that change)

### Step 7 — Screenshot verification

For each created page, navigate via Playwright:
http://localhost:3004/ru/{route}

Take screenshots at three viewports:
- 1440px → `.visual-agent/screenshots/new-pages/{name}-1440.png`
- 768px → `.visual-agent/screenshots/new-pages/{name}-768.png`
- 375px → `.visual-agent/screenshots/new-pages/{name}-375.png`

If Figma has no mobile design: note "Figma desktop-only" in report and 
skip mobile-specific verification.

For error pages:
- 404: navigate to `http://localhost:3004/ru/non-existent-page`
- 500: skip live screenshot, write code from Figma directly

**Visual compare:**
Side-by-side mental comparison of screenshot vs Figma frame:
- 95-100% match → status DONE
- 80-94% → status GOOD (minor polish)
- <80% → status NEEDS_WORK (log specific gaps)

### Step 8 — Per-page report

Write `.migration-review/new-pages/{page-name}/REPORT.md`:

```markdown
# {page-name} — Creation Report

- Created: {ISO}
- Route: {route}
- Figma node: {node}
- Files created:
  - pages/{path}.vue
  - components/errors/Error404.vue (if applicable)
  - ...

## i18n keys added
- ru.js namespace: {namespace}
- uz.js namespace: {namespace}  
- Total keys: N

## Figma source extraction
- Total elements analyzed: N
- Elements with full spacing data: N
- Elements with full typography data: N
- Elements missing Figma data: N

If any missing, list them:
- Element X: missing `paddingTop` — used estimate, flagged

## P30/P31/P32/P33 validation
- P30 (spacing comments): N px values, all sourced ✓
- P31 (typography format): N text elements, all px-based ✓
- P32 (width exact): max-width = {value} matches Figma ✓
- P33 (border/radius/shadow): N values, all from Figma ✓

## Screenshots
- 1440px: .visual-agent/screenshots/new-pages/{name}-1440.png
- 768px: ...
- 375px: ...

## Match estimate
- 1440px: N%
- 768px: N% (or "no mobile design")
- 375px: N%

## Blockers
- {list any Figma data missing or design questions}
- {list any features that would need backend wiring later}

## Status
DONE | GOOD | NEEDS_WORK
```

Update progress file. Move to next page. Don't pause. Don't ask.

---

## After all 11 pages: Final batch report

Write `.visual-agent/new-pages-batch-report-{date}.md`:

```markdown
# New Pages Batch Report — {date}

## Summary
- Pages created: N / 11
- Total time: {duration}
- Vue files added: N
- Component files added: N
- i18n keys added: N (ru.js + uz.js)

## Pages
| # | Name | Route | Status | Match % | Files | Notes |
|---|------|-------|--------|---------|-------|-------|
| 1 | about-us | /ru/about | DONE | 95% | 1 page | |
| ... |

## P30/P31/P32/P33 validation across all pages
- Total px values added: N
- All have Figma source comments: Y/N
- Violations detected: N (list)
- Typography elements: N, all px/numeric: Y/N
- Container widths: all exact from Figma: Y/N

## Files changed (git diff --stat)
[output]

## i18n namespaces added
- about (ru: N keys, uz: N keys)
- partners (...)
- ...

## Blockers consolidated
- Figma data missing for: [list]
- Translation pending for: [list of Uzbek strings]
- Design questions for Malika: [list]

## Backend gaps surfaced
- send-message page: needs `/api/v1/common/feedback/` verification
- faq page: static content, no backend needed
- ...

## Recommendation
- Pages ready for client demo: [list]
- Pages with minor gaps: [list]
- Pages needing design questions before final polish: [list]

## Next steps
1. User reviews each page in browser
2. User reviews git diff
3. User commits accepted pages
4. Address blockers with Malika
```

Run `git diff --stat` and append output to the report.

---

## OFFLINE MODE

User is offline. Process all pages unattended.

**Don't stop unless:**
- Figma MCP unreachable for >30 min (retry every 5 pages, then stop)
- Working tree dirty with >10 unrelated files (excluding new files)
- Same error 3 times in a row

**Don't:**
- Ask for approval
- Pause between pages
- Commit anything
- Run yarn build
- Modify Header.vue or Footer.vue
- Modify any backend file

**Do:**
- Update progress file every step
- Heartbeat every 5 minutes
- Continue through errors (log to errored array, move on)
- Take all night if needed

---

## START

1. Read this prompt fully
2. Read RECURRING_PATTERNS.md (especially P30, P31, P32, P33)
3. Run pre-flight checks
4. Process 11 pages in sequence
5. Write final batch report
6. Stop

Begin.