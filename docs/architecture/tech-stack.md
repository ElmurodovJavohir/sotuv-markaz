# Tech stack

## Backend

| Texnologiya | Versiya | Maqsad |
|-------------|---------|--------|
| Python | 3.x | Asosiy til |
| Django | 4.x | REST API, admin, ORM |
| Django REST Framework | — | API layer |
| FastAPI | — | AI services (port 8001) |
| PostgreSQL | — | Asosiy database |
| Redis | — | Cache, Celery broker |
| Celery | — | Background tasks |
| Channels | — | WebSocket (chat) |
| modeltranslation | — | UZ/RU bilingual fields |
| django-filters | — | API filtrlash |

## Frontend (Job Marketplace)

| Texnologiya | Versiya | Maqsad |
|-------------|---------|--------|
| Nuxt | 2.x | SSR framework |
| Vue | 2.x | UI framework |
| SCSS | — | Styling (NO CSS custom properties) |
| Bootstrap Vue | 2.17 | UI components |
| Element UI | 2.15 | Form components |
| Tailwind CSS | 2.x | Utility classes |
| nuxt-i18n | 6.x | RU/UZ/EN lokalizatsiya |
| @nuxtjs/auth-next | — | Dual auth (worker/company) |
| Vuex | — | 19 modul state management |

## Frontend (Learning)

| Texnologiya | Versiya | Maqsad |
|-------------|---------|--------|
| Nuxt | — | Framework |
| Vue | — | UI |
| Port | 3005 | Dev server |

## AI & Orchestration

| Texnologiya | Maqsad | Status |
|-------------|--------|--------|
| Claude API (Anthropic) | SalesIQ open-ended answer evaluation | 📋 Rejada |
| RAGFlow | Agent orchestration, self-hosted | 📋 Server kerak |
| Figma MCP | Dizayn → kod bridge (Claude Code uchun) | ✅ Sozlangan |

## Design & PM

| Tool | Maqsad |
|------|--------|
| Figma | UI dizayn (file key: `whwt0wJFk3XFkkXNsVgqQh`) |
| Notion | Task management (Kanban) |
| Obsidian | Knowledge base (shu vault) |
| XMind | System architecture diagram |

## Key constraints
- Frontend da `<script>` bloklari CSS-only migration uchun lock qilingan edi — endi yangilash kerak
- VK Sans Display font CDN 404 qaytaradi — butun sayt Lato da ishlaydi
- Elasticsearch olib tashlangan, ORM search ishlatiladi
