# Post-Session Learning — Update RECURRING_PATTERNS.md

## Role
You just finished a migration session. Before stopping, extract every
recurring problem you encountered and update RECURRING_PATTERNS.md so
future sessions don't re-hit them.

## Inputs to review
1. The git diff from this session (your changes)
2. .visual-agent/batch{N}-audit.md or tasks/*.md (this session's findings)
3. SCRIPT_CHANGES.md (any logged script issues)
4. BACKEND_CHANGES.md (any logged backend issues)
5. BUGS_FOUND.md (any reverts you had to make)
6. BLOCKERS.md (anything escalated to Javokhir)
7. Existing RECURRING_PATTERNS.md (so you don't duplicate)

## Step 1 — Extract problems from this session

For each issue you encountered, classify it:

**RECURRING** — happened in this session AND looks like it'll happen again
- Token violations introduced ($warning, $border-light, etc.)
- Position:absolute in code where flex would work
- Icon attempts to inline-SVG when it should be downloaded asset
- Wrong border-radius (8 vs 12 vs 4)
- Spacing rounded to scale instead of Figma exact value
- Script change made without size gate check
- Atom violation caught only after page-level fix

**ONE-OFF** — specific to this page/component, won't repeat
- Skip these, don't add to patterns file

**NEW PATTERN** — happened more than once this session, not yet documented
- Worth adding as a new P-rule

## Step 2 — Decide what to add

For each RECURRING or NEW PATTERN issue, write a candidate entry:
P{next-number}: {short title}
Symptom: what the problem looks like in code
Root cause: why it keeps happening
Detection: how to catch it next time (grep pattern, check, or rule)
Fix: the canonical solution
Examples seen: {file}:{line} from this session

Skip if the pattern is already covered by an existing P-rule (just add a new
example to the existing rule instead).

## Step 3 — Update the file

Read RECURRING_PATTERNS.md.
Append new P-rules at the next available P number.
Add new examples to existing rules where applicable.

If the same rule is being violated repeatedly, add a "Detection grep" line:
Detection grep: grep -rn '$warning|$border-light' --include='.vue' --include='.scss'

So next session can run the grep upfront.

## Step 4 — Update the session report

Write to .visual-agent/session-{date}-learnings.md:

```markdown
# Session Learnings — {date}

## Patterns added to RECURRING_PATTERNS.md
- P{N}: {title} — first seen in {file}
- P{N+1}: {title} — recurring 3 times this session

## Patterns confirmed (already in file)
- P14: token violations re-introduced — added detection grep
- P25: position absolute — caught 4 instances, all reworked

## Open question for Javokhir
- Should we add a pre-commit hook that runs the detection greps?
- Should P{N} also fail CI?
```

## Step 5 — Output summary

Tell Javokhir:
- N new patterns added
- N existing patterns reinforced with new examples
- N detection greps added
- Whether RECURRING_PATTERNS.md grew significantly (>200 lines added → suggest splitting into chapters)

## Rules
- Don't invent patterns — only document what actually happened
- Don't write speculative rules ("this might happen if...") — only observed problems
- Keep entries terse — one paragraph max per pattern
- Always include at least one real file:line example from the session