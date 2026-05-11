# Style Diff — home
- Figma node: 2129:48704
- Code: pages/index.vue (compositional)
- Audited: 2026-05-08T09:47:00Z
- Screenshots: .visual-agent/screenshots/home-{1440,768,375}-after.png

## Style violations found and status

| # | Section | Element | Figma spec | Code (before) | Code (after) | Status |
|---|---------|---------|-----------|---------------|--------------|--------|
| 1 | Testimonials (OpinionSection) | carousel arrow prev — loading template | fill=currentColor | fill="#268ae7" | fill="currentColor" | FIXED |
| 2 | Testimonials (OpinionSection) | carousel arrow next — loading template | fill=currentColor | fill="#268ae7" | fill="currentColor" | FIXED |
| 3 | Testimonials (OpinionSection) | carousel arrow prev — body template | fill=currentColor | fill="#268ae7" | fill="currentColor" | FIXED |
| 4 | Testimonials (OpinionSection) | carousel arrow next — body template | fill=currentColor | fill="#268ae7" | fill="currentColor" | FIXED |
| 5 | Blog/News (NewsSection) | post chip — text color | #189fff (Figma) | #189fff | #189fff (TODO: tokenize) | DEFERRED (no token yet) |
| 6 | Blog/News (NewsSection) | post chip — bg color | #e8f6ff (Figma) | #e8f6ff | #e8f6ff (TODO: tokenize) | DEFERRED (no token yet) |
| 7 | Vacancies by Company | view-all link color | $grey | $grey | $grey | ✓ ALREADY CORRECT |

## Notes
- Fixes 1–4: C1 violation (hardcoded hex in SVG fill attribute). Changed to `fill="currentColor"`. The `.opinion-nav` buttons' `color: $dark-blue` (hover: `color: $white`) cascades into the SVG correctly.
- Items 5–6: Figma uses #189fff / #e8f6ff for blog category chips. These ARE the correct Figma values, just not tokenized. Cannot create a canonical token without design system alignment. TODO comments added in code.
- Item 7: Already correct from prior session (non-scoped style block with `color: $grey`).

## Style score
- Total style issues found: 6 (4 C1 hardcoded fills + 2 untokenized chip colors)
- Fixed this session: 4
- Deferred (token needed): 2
- Fix rate: 4/6 = 67% (remaining 2 are blocked on design system token creation)
