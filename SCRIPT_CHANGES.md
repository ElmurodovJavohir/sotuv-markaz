# Script Changes Log

## 2026-05-04 — CommercialOffers.vue

- Changed fetch size from `8` to `4` to match Figma (1 row of 4 cards on xl).
- Reason: BUG-1 from `SECTION_2_BUGS_FOUND.md`.
- Risk: Low — only affects homepage card count; the services list page is unaffected (it has its own pagination).
- Diff: `components/sections/CommercialOffers.vue:79`
  - before: `await this.$store.dispatch('companyServices/fetchServices', { size: 8 })`
  - after:  `await this.$store.dispatch('companyServices/fetchServices', { size: 4 })`
