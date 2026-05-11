# Phase 2 — Per-Page Fix Execution

## Role
Claude is manager. OpenCode is worker. For each page task list:
1. Claude reads tasks/{page-slug}.md
2. Claude decides what to dispatch (excludes BIG items, batches small ones)
3. OpenCode executes
4. Claude validates result via screenshot diff and audit log
5. Claude moves to next task or escalates

## Input
tasks/{page-slug}.md (produced by Phase 1)

## Order of execution per page (strict)

1. **Atom fixes first** (shared components used by this page)
   - Find which atoms violate spec
   - Fix the atom in its component file (not in the page)
   - One atom fix propagates to all pages using it
2. **Icon downloads**
   - Download every icon CDN URL listed
   - Save to static/img/icons/{name}.svg
   - Replace inline SVG in Vue with <img src="...">
3. **Layout rework**
   - Convert position:absolute to flex/grid where flagged
   - Verify with screenshot — revert if visibly broken
4. **SCSS fixes** (page-level)
   - Apply all SCSS diff items in one pass
   - Use exact px values from Figma, not rounded scale values
5. **Template fixes**
   - DOM structure, class renames
   - grep before any class rename to check usage
6. **Script-small fixes** (allowed)
   - Apply per P28
   - Log to SCRIPT_CHANGES.md
7. **Backend-small fixes** (allowed)
   - Apply per P28
   - Log to BACKEND_CHANGES.md
8. **Screenshot verification**
   - Playwright screenshot at 1440px → save to screenshots/{page-slug}-after.png
   - Note any visible regression
9. **STOP for big changes**
   - Any SCRIPT_BIG or BACKEND_BIG item → write to BLOCKERS.md, do not attempt

## Per-fix validation
After each atom or major fix:
- If shared atom changed → screenshot 2 pages that use it
- If page-level fix → screenshot the page
- If something looks broken → revert that single fix, log to BUGS_FOUND.md

## Output per page
Append to tasks/{page-slug}.md a "Phase 2 Result" section:
- Fixes applied: N
- Fixes skipped (big): N
- Fixes failed (reverted): N
- Files changed: list
- Screenshots: paths
- Blockers logged: N

Write/update BLOCKERS.md with all big-change items needing your decision.

## Rules
- One page at a time, full sequence per page
- No commits
- Show git diff per page before moving on
- If pre-existing dirty files >5, STOP and ask Javokhir to clean baseline first