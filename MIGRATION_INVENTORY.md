# MIGRATION INVENTORY

## Infinity Sales Frontend — Nuxt 2 / Vue 2 Legacy Codebase

Generated: 2026-04-19
Project Root: /infinitysales-frontend/
Tech Stack: Nuxt 2 SPA, Vue 2, SCSS, Bootstrap Vue, Element UI, Tailwind CSS 2.2

---

## 1. PAGES (97 total)

### PUBLIC PAGES (16)
pages/index.vue | main landing
pages/login/index.vue | login form
pages/login/forgot.vue | password reset
pages/register/index.vue | registration router
pages/blog/_id.vue | blog detail
pages/blog/index.vue | blog listing
pages/news/_slug.vue | news detail
pages/news/index.vue | news listing
pages/events/_slug.vue | event detail
pages/events/index.vue | events listing
pages/feedback/_slug.vue | feedback detail
pages/static/_slug.vue | static pages
pages/company-brand.vue | company showcase
pages/email/verify.vue | email verification
pages/calendar.vue | calendar view
pages/temp.vue | dev page

### WORKER PAGES (35)
pages/worker/login.vue
pages/worker/register.vue
pages/worker/password.vue
pages/worker/home.vue
pages/worker/profile/index.vue
pages/worker/profile/create-resume.vue
pages/worker/profile/my-resume/index.vue
pages/worker/profile/my-resume/_id.vue
pages/worker/profile/application.vue
pages/worker/account/main.vue
pages/worker/account/notifications.vue
pages/worker/account/password.vue
pages/worker/vacancy/index.vue
pages/worker/vacancy/_slug.vue
pages/worker/vacancy/category/_slug.vue
pages/worker/vacancy/details/_slug.vue
pages/worker/vacancy/details/index.vue
pages/worker/vacancy/our-vacancies.vue
pages/worker/category.vue
pages/worker/advanced-search.vue
pages/worker/search.vue
pages/worker/company/_slug.vue
pages/worker/company/index.vue
pages/worker/desk/application.vue
pages/worker/desk/interview.vue
pages/worker/desk/saved.vue
pages/worker/desk/suggestions.vue
pages/worker/faq/index.vue
pages/worker/faq/_slug.vue
pages/worker/faq/message.vue
pages/worker/faq/questions.vue
pages/worker/buy-service/index.vue
pages/worker/buy-service/buy-history.vue
pages/worker/services/_id.vue
pages/worker/services/index.vue

### COMPANY PAGES (46)
pages/company/login.vue
pages/company/register.vue
pages/company/password.vue
pages/company/index.vue
pages/company/home.vue
pages/company/profile/index.vue
pages/company/profile/application.vue
pages/company/account/main.vue
pages/company/account/notifications.vue
pages/company/account/password.vue
pages/company/candidate/index.vue
pages/company/candidate/_id.vue
pages/company/vacancy/add.vue
pages/company/vacancy/edit/_id.vue
pages/company/vacancy/_slug.vue
pages/company/category.vue
pages/company/advanced-search.vue
pages/company/desk/application.vue
pages/company/desk/interview.vue
pages/company/desk/saved.vue
pages/company/desk/suggestions/index.vue
pages/company/desk/suggestions/_slug.vue
pages/company/faq/index.vue
pages/company/faq/_slug.vue
pages/company/faq/message.vue
pages/company/faq/questions.vue
pages/company/tarif/index.vue
pages/company/tarif/status.vue
pages/company/tarif/package-services.vue
pages/company/tarif/purchase-history.vue
pages/company/tarif/bought-pocket.vue
pages/company/tarif/multi-profile/index.vue
pages/company/tarif/multi-profile/create-profile.vue
pages/company/tarif/multi-profile/edit/index.vue
pages/company/tarif/multi-profile/edit/_id.vue
pages/company/payment.vue
pages/company/subscribe.vue
pages/company/staff.vue
pages/company/top-vacancy.vue

---

## 2. VUEX MODULES (20)

Names: index, authentication, profile, vacancy, candidate, company, desk, resume, category, faq, chat, payment, advertising, chosenCompany, media, jobSeekers, request, salaryQuestion, email, companyServices

---

## 3. API ENDPOINTS (135+)

Authentication (11): login, register, password reset
Worker Profile (7): profile, account, email, notifications
Company Profile (8): profile, account, email, notifications
Vacancy (14): search, CRUD, top, related, filters
Candidates (8): search, detail, filters
Applications (6): applications, interviews
Wishlist (5): wishlist management
Categories (12): categories, skills, languages, regions
News/Content (8): news, blogs, events
Company (7): profiles, services
Payment (9): plans, packages, history
FAQ (6): faq, categories, messages
Common (16): settings, notifications, footer
Chat (1): unread messages
Verification (2): requests, purchases

---

## 4. DEPENDENCIES (70+)

Framework: nuxt 2.4.5, core-js 3.6.5
HTTP: axios, socket.io
Auth/i18n: auth-next (5.0.0-rc), nuxt-i18n 6.15
UI: bootstrap 4.5, bootstrap-vue 2.17, element-ui 2.15, tailwindcss 2.2
Forms: v-mask, v-money, vue-the-mask, vuelidate, libphonenumber-js
Carousels: swiper, vue-awesome-swiper, vue-slick-carousel, vue-gallery-slideshow
UX: aos, vue-awesome-countdown, vue-toastification
Utils: lodash, moment, crypto-js, dotenv
Analytics: google-analytics, vue-gtag, yandex-metrika
Social: facebook-pixel, recaptcha, vue-social-sharing, v-emoji-picker
Other: sitemap, sentry, vue-treeselect, @nuxt/image
Dev: eslint, prettier, stylelint, sass, playwright, babel, autoprefixer

---

## 5. i18n KEYS

languages/uz.js: 1,118 keys (Uzbek)
languages/ru.js: 1,139 keys (Russian)
TOTAL: 2,257 keys

---

## SUMMARY

Pages: 97 (16 public, 35 worker, 46 company)
Store Modules: 20
API Endpoints: 135+
Dependencies: 70+
i18n Keys: 2,257

Tech: Nuxt 2.4.5 (Vue 2.6) SPA with dual-role auth, Elasticsearch search, Vuex state

Migration Path: Nuxt 2->3, auth replacement, UI consolidation, Vuex->Pinia, TypeScript

Generated: 2026-04-19
