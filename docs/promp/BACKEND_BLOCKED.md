## New pages — backend considerations

### send-message (/ru/feedback)
Existing endpoint: POST /api/v1/common/feedback/
Already implemented in backend. Frontend just needs to wire form to this endpoint.
Form fields needed: name, email, subject, message, category (dropdown)
Check FeedbackCreateView serializer for exact fields.

### faq (/ru/faq)
No dynamic backend needed — static content.
i18n keys hold all Q&A content.
Future: could become CMS-driven but not for v1.

### partners, investors, ads-on-site, about-us
Static pages, no backend needed.

### error-404, error-500
Pure frontend, Nuxt error layout.