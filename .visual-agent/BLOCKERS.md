# Blockers — Decisions Required

This file tracks items that cannot be resolved automatically and need human decision.

---

## HOME — App Download Section (pages/index.vue)

**Type:** User-managed decision
**Figma node:** 2129:48865
**Code:** `<!-- <downloading-mobile-app /> -->` (commented out in pages/index.vue)

**Issue:** Figma shows an "App Download" section (section 6 of 8) with:
- CTA banner with gradient, iPhone mockup, QR code, App Store button, Google Play button
- The component `DownloadingMobileApp.vue` EXISTS and is fully built
- Code comment says: "Hidden: app download section is not in use yet (no published mobile app)"

**Decision needed:** Should this section be uncommented?
- Option A: Uncomment when mobile app is published. Current state is intentional.
- Option B: Remove the commenting and show section now as a teaser with non-functional links.

**Logged:** 2026-05-08
**Page:** home (pages/index.vue)

---
