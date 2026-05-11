# Phase 1 — Per-Page Inventory & Task List Generation

## Role
You are the inventory agent. For each page in the input list, produce a complete
task list. You do NOT modify code. You produce one .md file per page.

## Input
List of pages with Figma node IDs (passed in by orchestrator).

## For each page, run this sequence:

### Step A: Cache lookup
Check figma_cache/ for the page's Figma node.
- Fresh (<7 days) → use cache
- Stale or missing → call Figma MCP get_design_context, save to cache
- Cap: 5 MCP calls per page, 40 total per session

If frame is too large (timeout / >300k px²):
- Call get_metadata to list children
- Call get_design_context on each major child frame separately
- Stitch results in cache

### Step B: Extract Figma inventory
For every visible element in the page Figma frame, record:
- Element type (button/input/card/icon/text/section/container)
- Node ID
- Position (relative to parent — note if absolute in Figma)
- Dimensions (w × h)
- Spacing (padding all 4 sides, margin, gap to siblings)
- Colors (fill, stroke, text)
- Typography (font-size, weight, line-height, letter-spacing)
- Border (width, color, radius)
- Shadow (offset x/y, blur, spread, color, opacity)
- Icon assets (CDN URL if present — note for download)

### Step C: Map to current code
Read the page Vue file and all child components imported.
For each Figma element, find the matching code element by:
- Class name match
- Text content match
- Position in DOM tree
- Visual role (header/card/button)

If no match found: mark as MISSING_IN_CODE.
If code has element not in Figma: mark as EXTRA_IN_CODE.

### Step D: Diff and categorize fixes
Produce a diff for each matched element. Categorize each fix:

| Category | Examples |
|----------|----------|
| SCSS | color, font, spacing, border, shadow, radius |
| TEMPLATE | DOM structure, class names, element type swap |
| ICON_DOWNLOAD | Figma exports image — download SVG to static/img/icons/ |
| LAYOUT_REWORK | Figma uses position absolute, code should use flex/grid |
| SCRIPT_SMALL | Allowed per RECURRING_PATTERNS.md P28 |
| SCRIPT_BIG | Requires Javokhir approval |
| BACKEND_SMALL | Serializer field, seed data, translation key |
| BACKEND_BIG | Requires Javokhir approval |
| ATOM_VIOLATION | Button/input/card doesn't match RECURRING_PATTERNS.md atoms |

### Step E: Atom-level audit
Cross-reference RECURRING_PATTERNS.md atom specs.
For every button, input, badge, card on the page:
- Check height, border-radius, font-weight, font-size, padding
- Check exact spacing between sibling atoms (button-to-button gap, etc.)
- Flag any deviation as ATOM_VIOLATION

### Step F: Layout strategy check
Per P25, for any element using position: absolute in current code:
- Can this be flex? → flag as LAYOUT_REWORK
- Can this be grid? → flag as LAYOUT_REWORK
- Genuinely needs absolute? → keep, note "P25 exception: {reason}"

### Step G: Output
Write tasks/{page-slug}.md with this structure:

```markdown
# Page Task List: {page-slug}
- File: pages/...
- Route: /ru/...
- Figma node: {node-id}
- Cache status: hit/miss/stale
- Generated: {date}

## Summary
- Total elements: N
- Total fixes: N
- Fixes by category: {table}
- Blockers (BIG changes needing approval): N

## Fixes

### SCSS Fixes
| # | Element | Property | Current | Figma | Line |
|---|---------|----------|---------|-------|------|
| 1 | .btn-primary | height | 40px | 48px | 84 |

### Template Fixes
| # | Element | Change | Reason |

### Icon Downloads
| # | Figma node | Asset name | Target path | CDN URL |

### Layout Rework
| # | Element | Current | Should be | Reason |

### Atom Violations
| # | Element | Spec violated | Current | Expected |

### Script Changes (small — allowed)
| # | Element | Change | Reason |

### Script Changes (big — REQUIRES APPROVAL)
| # | Element | Change | Why needed |

### Backend Changes (small — allowed)
| # | Endpoint/field | Change | Reason |

### Backend Changes (big — REQUIRES APPROVAL)
| # | Endpoint/model | Change | Why needed |

## Open Questions
List anything ambiguous (Figma unclear, missing data, design conflict).

## Atoms used on this page
List of all atoms (button variants, input variants, card variants) with their specs.
```

### Step H: Continue
Move to next page. Do not stop unless:
- MCP call cap hit (40)
- Wall clock exceeds reasonable session length
- A page produces an unrecoverable error → log and skip

## Final output
Write tasks/_INDEX.md summarizing all pages processed:

| Page | Total fixes | SCSS | Template | Icons | Layout | Atoms | Script-big | Backend-big |
|------|-------------|------|----------|-------|--------|-------|------------|-------------|

## Rules
- No code changes — inventory only
- No commits
- No yarn build
- All Figma data saved to figma_cache/
- All task lists saved to tasks/