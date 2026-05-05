# Backend Changes Log

## 2026-05-06 — Delete legacy junk News records

**Why:** Blog index page (`/ru/blog`) showed 2 broken cards with garbage random-string titles ("wLMmGMsDCiJWnZBbozvh…", "LEeozkhdsDgedpbwLhokf…") and empty `cover_url`. These were `News` rows id=9 and id=10 — leftovers from a much older seed cycle (titles and slugs are random alphanumeric strings, no real content).

**Change (data only):** `News.objects.filter(id__in=[9, 10]).delete()`. Confirmed `News.objects.count() == 5` after deletion (matches `seed_test_data` `NEWS_DATA` length).

**Follow-up:** `seed_test_data` could include a `--cleanup` step that removes records whose slug doesn't match any current `NEWS_DATA`/`BLOG_DATA` slug pattern.

## 2026-05-06 — Generate proper blog/news cover placeholders

**Why:** Blog detail page (`/ru/blog/<slug>`) and related-articles cards rendered as huge flat-grey rectangles because seed data wrote 1200×480 grey JPEGs to `cover`/`image` fields. UX was broken even though frontend was correct.

**Change:** New management command `seed_blog_covers` generates brand-toned vertical gradients (using `$dark-blue`/`$blue-link`/etc.) with the post title overlaid as wrapped white text and a soft shadow. No trademarked content reproduced. Rewrites both `cover` (card) and `image` (hero) per existing record path.

**Files added:**
- `src/common/management/commands/seed_blog_covers.py`

**Files modified:**
- `mediafiles/news/seed-*-img_*.jpg` and `mediafiles/blogs/seed-*-cover_*.jpg` — regenerated for 12 posts (5 News + 5 Blog + 2 legacy)

**Run:** `python manage.py seed_blog_covers` (re-run after any `seed_test_data --reset`).

## 2026-05-06 — Expose `salary` on freelancer list endpoint

**Why:** Frontend `Freelancers.vue` (Figma 2129:120806) needs to render the salary line on each freelancer card. The serializer was omitting the field even though `WorkerResume.salary` already exists on the model.

**Change:** `src/resume/serializers/freelancer.py` — added `"salary"` to `FreelancerSerializer.Meta.fields`. No model change, no migration.

**Verification:** `GET /api/v1/resume/freelancers/?freelancer=true&size=2` now includes `"salary":"2479.00"` per result.

**Follow-up needed:** Figma shows "от X до Y UZS" (range), but the model only has a single `salary` DecimalField. If a true range is desired, a migration adding `salary_from`/`salary_to` is required (and `currency_merged_salary` would need updating).

## 2026-05-05 — Backfill default WorkerResume rows for seeded workers

**Why:** Home page "Соискатели / Ish izlovchilar" section returned `total: 0` from `/api/v1/resume/job-seeker/` (both ru & uz). 205 seeded workers existed but 0 `WorkerResume` rows — `seed_test_data.py` only creates a default resume when a worker is **newly** created (`if w_created:`). Earlier seed runs predated that hook, so existing workers had no resumes.

**Change (data only, no code):**
1. DB drift: `resume_workerresume` has NOT NULL columns absent from the model — `gender`, `contact_views`, `total_experience` (and a few others). To let `DefaultResumeProcessor.get_or_create_default_resume()` succeed:
   - `ALTER TABLE resume_workerresume ALTER COLUMN gender SET DEFAULT 1;`
   - `ALTER TABLE resume_workerresume ALTER COLUMN contact_views SET DEFAULT 0;`
   - `ALTER TABLE resume_workerresume ALTER COLUMN total_experience SET DEFAULT 0;`
2. Ran `DefaultResumeProcessor(w).get_or_create_default_resume()` for every `Worker` with active user → 52 resumes created (36 visible per `VisibleResumesManager`). Followed up with raw `UPDATE … SET gender = worker.gender` to persist real gender values.
3. Backfilled `district` on all 36 visible resumes (was null) from `worker.user.district`, falling back to a random district when missing.

**Verification:** `curl -H "Accept-Language: uz" http://localhost:8000/api/v1/resume/job-seeker/?limit=3` now returns `total: 36`.

**Follow-up needed (proper backend fix):**
- The DB-vs-model drift on `gender` / `contact_views` is BUG-BE-006-class. A migration should either drop NOT NULL on these columns or add the fields to the `WorkerResume` model.
- The seed command should run `DefaultResumeProcessor` for **already-existing** workers too, not just newly-created ones.

## 2026-05-04 — Company logo placeholders

**Why:** Frontend home sections (Commercial Offers, By Companies, Latest Vacancies) showed colored briefcase icons instead of logos because seeded test companies (Texnomart, Ucell, Hamkorbank, Uzcard, Yandex Go Uzbekistan, Beeline Uzbekistan, Kapitalbank, Alif Bank) had briefcase placeholder PNGs uploaded as `avatar`. Frontend rendered them correctly — source data was the issue.

**Change:** Added management command `seed_company_logos` that generates initial-letter avatars (single/double letter on solid color, rounded square, 512×512 PNG via Pillow) and assigns them to the 8 seeded companies. Also sets `top=True` so they appear in `/api/v1/company/top/`.

**Files added:**
- `src/common/management/commands/seed_company_logos.py`

**Files modified:**
- `mediafiles/avatars/test_company_2{10..17}.png` — replaced briefcase placeholders with letter avatars
- DB: `company.avatar` and `company.top` updated for the 8 seeded companies (via `Company.objects.filter(...).update()` — bypasses save() override)

**Run:** `python manage.py seed_company_logos`

**Notes:**
- Letter avatars are generic auto-avatars (not reproductions of trademarked brand logos).
- Stale `mediafiles/avatars/test_company_20[2-9].png` files (from a prior seed cycle when company IDs were 202-209) were removed.
- `seed_test_data.py` re-seeded companies between earlier and later sessions, shifting IDs from 202-209 → 210-217 and resetting `top=False`. The new command should be re-run after every reset.
