# Infinity Sales — Business Logic Audit

> Legacy: `infinitysales-frontend-legacy/`
> Generated: 2026-04-19

---

## 1. Authentication

### Login Flow

| Field | Worker | Company |
|---|---|---|
| Endpoint | `POST auth/worker/login/` | `POST auth/company/login/` |
| Strategy name | `loginWorker` | `loginCompany` |
| Request body | `{ phone, password }` | `{ phone, password }` |
| Response token field | `access` | `access` |
| Token TTL | 30 days (`maxAge: 3600 * 24 * 30`) | 30 days |
| User profile endpoint | `GET /auth/worker/profile` | `GET /auth/company/profile/` |
| Logout | `false` (disabled — no server-side logout) | `false` |

**Token storage**: `@nuxtjs/auth-next` stores token in cookie (default) + injects as `Authorization: Bearer <token>` globally via axios. The `global: true` flag means ALL requests include the token.

**Strategy selection**: `login/index.vue` checks a `role` variable — if `"company"`, uses `loginCompany`; otherwise `loginWorker`. Call pattern: `this.$auth.loginWith(this.strategy, { data: { phone, password } })`.

**User property**: Worker strategy has `user.property: false` (no auto-parse); company has `user.property: false` with `autoFetch: true`. Both fetch user separately after login.

### Registration Flow

**Worker** — 2-step: SMS OTP first, then full profile
1. `POST /sms-verification/auth/registration/entrypoint/` → sends OTP to phone
2. `POST /sms-verification/auth/registration/verify_code/` → verifies OTP, returns `signed_ticket`
3. `POST auth/worker/registration/register/v2` → full profile creation with `signed_ticket`
   - Required fields: `name, gender, birth_date, district, phone, password, password_confirm, signed_ticket`
   - Optional: `about_me, email, category, salary, currency, studies, experiences, languages, skills, driving_licences, freelancer, socials`
4. After success: `this.$auth.loginWith('loginWorker', ...)` — auto-login

**Company** — 1-step registration (no SMS OTP):
1. `POST auth/company/registration/register/`
   - Required fields: `name, official_name, category, phone, email, district, password, password_confirm`
   - Returns `signature`
2. After success: `this.$auth.loginWith('loginCompany', ...)` — auto-login

### SMS Verification

- Dev mode (`SMS_DEBUG=True` + `HASH_SMS_CODE=True`): code is always `1111`
- Production: real SMS via Uzbek SMS gateway
- `signed_ticket` returned from verify_code is passed to register endpoint as proof of phone ownership
- OTP endpoints: `/sms-verification/auth/registration/entrypoint/` and `/sms-verification/auth/registration/verify_code/`

### Password Reset

1. `POST /auth/registration/password-reset/` → `{ phone }` → sends SMS with reset code
2. `POST auth/registration/password-reset/verify/` → `{ phone, code, new_password }` → resets password

### Token Refresh

- Not implemented in frontend. Token TTL is 30 days. No refresh endpoint configured.
- **Migration risk**: If backend has refresh tokens, frontend ignores them entirely.

---

## 2. Chat (Socket.IO)

**Library**: `socket.io-client` v4.4.1 (package.json)

**Frontend reality**: The Vuex `chat` store does NOT use Socket.IO directly. It only stores UI state (is chat panel open, current chat object, unread flag) and has one REST call:

- `GET /chat/has-unread-message` → `{ has_unread_message: boolean }`

**Socket.IO usage**: Appears to be implemented inside a `vac.js` plugin (Vue Advanced Chat library). Search found `socket\|io(` only in `.nuxt/` (generated) — not in hand-written source.

**Conclusion**: Real-time messaging is handled by the `vac.js` (Vue Advanced Chat) plugin, not custom code. The events and auth mechanism are **not found in source** — needs investigation in `plugins/vac.js` and chat page component directly.

**Migration target**: Keep REST polling for unread indicator; investigate `vac.js` for WS events.

---

## 3. File Upload

**Pattern**: `FormData` + `multipart/form-data` (via axios default headers)

| Upload type | Endpoint | Method | Field name |
|---|---|---|---|
| Worker avatar | `worker/profile/update/` | PATCH | `avatar` |
| Company avatar | (company account page) | PATCH | `avatar` |
| Company media photo | `/company/media/photo/` | POST | `photo` (FormData) |
| Resume/CV file | (worker profile/resume page) | POST | `file` |
| Application attachment | (application pages) | POST | FormData |

**Pattern used**:
```js
const formData = new FormData()
formData.append('avatar', this.form.ava)  // File object
this.$axios.patch('worker/profile/update/', formData)
// Content-Type: multipart/form-data set automatically by axios when FormData passed
```

**Max size / allowed types**: Not found in frontend — enforced by backend only.

**Storage**: Not determined from frontend code — likely S3 or local Django media (needs backend confirmation).

---

## 4. Forms & Validation

**Library**: `vuelidate` (v0.7.x based on Nuxt 2 ecosystem)

**Plugin**: `plugins/vuelidate.js` — `Vue.use(Vuelidate)` globally registered.

**Usage pattern** (from `pages/company/account/main.vue`):
```js
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'

validations: {
  form_1: {
    phone: { required },
    email: { required, email },
    name: { required, minLength: minLength(2), maxLength: maxLength(100) },
  }
}
// Template: :class="{ _error: $v.form_1.phone.$anyError }"
```

**Common validators used**: `required`, `minLength`, `maxLength`, `email`, numeric phone validation via `v-mask` (`+998 XX XXX XX XX`)

**Migration target**: VeeValidate v4 + Zod schema validation (Composition API compatible)

---

## 5. Elasticsearch Endpoints

**Comment in source**: Vacancy store explicitly notes `// TODO: ES_REMOVAL` on ES endpoints.

| Endpoint | Description | ES-dependent |
|---|---|---|
| `GET company/vacancy/search/` | Vacancy list/search with facets | YES — uses `__terms`, `__gte`, `__lte` filter syntax |
| `GET common/category/search/` | Category search suggestions | Likely |
| `GET common/search-suggestion/` | Company search suggestions | Likely |
| `GET company/vacancy/main/filter/` | Filter field metadata | NO (ORM) |
| `GET /common/top-salary-vacancies` | Top salary vacancies | Unknown |

**ES query params pattern** (vacancy search):
```
page_size, search, status__terms, published_at__gte, region,
salary_from__gte, salary_to__lte, salary_type__terms, subcategory__terms
```

The `__terms` suffix and `__gte`/`__lte` are Elasticsearch DSL conventions. When ES is replaced with ORM, these params will change — **major migration risk for all search/filter pages**.

---

## 6. Payment / Billing

**Model**: Company-only. Workers do not pay.

**Currency model**: "Coins" — internal credit system on top of money.

| Endpoint | Description |
|---|---|
| `GET payment/company/plans/` | Subscription plan list |
| `GET /payment/company/packet/list/` | Packet/bundle list |
| `GET /payment/order-history/` | Purchase history |
| `GET /payment/company/tariffs/` | Tariff details (from company store) |
| `GET /common/settings/` | Coin exchange rate settings |
| `GET /common/my-balance/` | Current coin balance |

**State fields**: `plan[], companyPacket[], PacketHistory[], coins[], coinBalance[]`

**Payment gateway**: Not found in frontend source. Likely external redirect or backend-handled.

---

## 7. Complex State Logic

### Top 5 most complex Vuex modules

| Module | Actions | State fields | Notes |
|---|---|---|---|
| `vacancy` | 10 | 11 | 3 near-identical search actions (ES-dependent), facets logic |
| `candidate` | 8+ | 10 | Worker search with facets, dual category endpoints |
| `authentication` | 4 | 6 | Registration fields explode (15+ params for worker) |
| `payment` | 5 | 5 | Coin balance + plans + packets + history |
| `index` (root) | 25+ | many | Homepage data aggregation — fetches 10+ endpoints on load |

### Notable patterns
- **No token refresh**: Token is set once at login, never refreshed. On expiry, user is silently logged out.
- **Accept-Language header**: EVERY store action manually passes `{ 'Accept-Language': this.$i18n.locale }`. Migration to Pinia must replicate this via axios interceptor.
- **Auth injection in store**: `this.$axios` used in all stores. Pinia stores will need `useNuxtApp().$axios` or direct `$fetch` with auth composable.
- **Promise wrapping**: All actions wrap axios in `new Promise((resolve, reject) => {...})` — legacy pattern. Pinia actions can use `async/await` directly.

---

## 8. Migration Risks & Notes

### Critical

1. **ES query param syntax will break**: All vacancy/candidate search pages depend on `__terms`, `__gte`, `__lte` Elasticsearch params. When backend replaces ES with ORM, all search API calls need rewriting. Frontend must wait for backend to finalize new param names.

2. **Auth module (pre-release)**: `@nuxtjs/auth-next 5.0.0-1648802546.c9880dc` is a pre-release. Migration target is `nuxt-auth-utils` or `@sidebase/nuxt-auth`. Strategy names (`loginWorker`, `loginCompany`) and the dual-strategy pattern must be preserved.

3. **No logout endpoint**: Backend has no logout — token simply expires. Frontend must clear cookie/storage on "logout" locally. Don't add a server round-trip that doesn't exist.

4. **signed_ticket flow**: Worker registration requires a `signed_ticket` from SMS verification. This is a 3-step flow — losing the ticket between steps loses the registration session. New frontend must preserve this state across navigation.

### High Priority

5. **Accept-Language in every request**: Currently done per-action. New frontend should use an axios/ofetch interceptor to inject `Accept-Language` globally based on `useI18n().locale`.

6. **FormData uploads**: `Content-Type` is set automatically by axios when a `FormData` object is passed. `$fetch` (Nuxt 4 default) may need explicit headers. Test all upload endpoints after migration.

7. **Chat (vac.js) is a black box**: Real-time chat logic is inside `plugins/vac.js` (Vue Advanced Chat library). Socket events and auth are not visible in store code. Needs a dedicated investigation session before migrating chat.

### Medium Priority

8. **Vuelidate → VeeValidate**: All form validation uses Vuelidate's options-API `validations:{}` pattern. VeeValidate v4 uses Composition API. Every form page needs manual rewrite.

9. **`$v.field.$anyError` CSS class pattern**: Widely used across pages. New pattern with VeeValidate will be `errors.field` from `useField()`. Global search-replace won't work — needs per-component review.

10. **Coin balance not in global store**: `coinBalance` is in `payment` module but not fetched globally. If header shows coin balance, migration needs to fetch it in a layout/composable.
