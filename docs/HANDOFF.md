# Medico — Complete Session Handoff

> **Purpose:** Comprehensive record of the Cursor Cloud Agent advisory session (5–10 Sep 2026) so a new model, a new account, or a future agent can continue without re-deriving context.
>
> **Source conversation:** Assessment, work plan, Cloud Agent / self-hosted worker setup, M0 + M0.1 reviews, email/queue, design-in-repo strategy, folio-reader Figma critique, and open requests.
>
> **Last updated:** 10 September 2026.
>
> **How to use this file:** Paste it (or `docs/HANDOFF.md` if copied into the Medico repo) at the start of a new agent session. After each milestone merges, append a History entry and update Immediate Next Steps. Do not treat older sections as current code truth if later History entries contradict them.

---

## 1. Identity

| Item | Value |
|---|---|
| Product | **Medico** (also **Medicosolomed**) |
| URL / brand | medicosolomed.com (intended); marketing name in Inertia title: `Medicosolomed` |
| Owner | Mohamed Balla (`mohamedballa` on GitHub), solo |
| Repo | https://github.com/mohamedballa/Medico |
| Product type | SaaS for medical education, inspired by SoloLearn |
| Audience | Medical students and health professionals |
| Curriculum intent | Basic sciences first (Anatomy, Biochemistry, Physiology), later pathology / pharmacology / microbiology, then clinical (IM, Surgery, Pediatrics, OBGYN) |
| Content hierarchy | Subject → Topic → Chapter → Module |
| Per module | Folios (Editor.js slides) + MCQs + Flashcards |
| Planned extras | Progress, streaks, leaderboard, Students Hub (Challenge, Rapid Questions, Recall), Stripe billing |

---

## 2. Stack (do not change unless asked)

- PHP 8.4, Laravel 12, Inertia 2 (`inertiajs/inertia-laravel` + `@inertiajs/react`)
- React 19.1, Vite 7, Tailwind CSS 3.3.2
- PostgreSQL 17 (production / Sail). SQLite is **CI-only**
- Laravel Sail (Docker). Host Ubuntu tower has **no PHP**; run everything via `./vendor/bin/sail …`
- Editor.js (`@editorjs/editorjs` + header, image, list, paragraph, table)
- Ziggy (`ziggy-js`)
- PHPUnit 11; GitHub Actions CI
- Docker Compose: `laravel.test` (custom `docker/Dockerfile`, Ubuntu 24.04 + PHP 8.4 + Node 22) + `pgsql`. **nginx service was deleted in M0** (it proxied to php-fpm :9000; the app container runs `artisan serve` on :80). Adminer lives in git-ignored `docker-compose.override.yml`

**Do not:** introduce a second UI library, add auth packages that replace the custom auth without being asked, switch the DB, or rebuild Home before M5.

---

## 3. Developer environment

### Machines

- **Thin client:** Linux Mint on a mid-2010 MacBook Pro. Browser-first. Cursor **desktop is not used** (too heavy).
- **Dev server:** Intel tower on the LAN, Ubuntu Server. Checkout: `~/projects/Medico`. Access: SSH + **code-server** (VS Code in the browser).
- **Git:** commits from code-server; GitHub is the remote.

### Cursor agents

- Cloud Agents run **on the tower**, not in Cursor’s managed VM, because PHP/Composer/Node/Docker/Postgres already exist there and the seeded DB is needed for verification.
- Worker process (must stay up):

```bash
tmux new -s cursor-worker -d 'cd ~/projects/Medico && agent worker start --name medico-tower'
```

- Control surface: https://cursor.com/agents (browser on the MacBook or phone). Environment dropdown: **`medico-tower`**.
- The worker is **not** a second agent. It executes tool calls (file edits, `sail artisan test`) on the real checkout. Kill it and `medico-tower` disappears from the picker.
- **Hard rule:** tree must be **clean and on `main`** before every agent run. Never edit the same branch in code-server while an agent is live.

### Email / queues (dev)

- Notifications (`VerifyEmailNotification`, `ResetPasswordNotification`) implement `ShouldQueue`.
- `.env` typically `QUEUE_CONNECTION=database`. Nothing sends until a worker runs.
- Dev options:
  - `QUEUE_CONNECTION=sync` — send inline, no worker (simplest).
  - Keep `database` and run `./vendor/bin/sail artisan queue:listen --tries=3 --timeout=60` in tmux (reloads code per job). **Do not** leave `queue:work` running across code changes; it boots once and serves stale code.
- Mail: `.env.example` uses `MAIL_MAILER=log` (writes `storage/logs/laravel.log`). Mailpit in `docker-compose.override.yml` is recommended (`MAIL_HOST=mailpit`, `MAIL_PORT=1025`, UI `:8025`).
- Production (M8): Supervisor `queue:work`, `queue:restart` on deploy, real provider (Resend / Postmark / Mailgun / SES) + SPF/DKIM. Do not launch on Gmail.

---

## 4. Git and process rules (agreed)

- **One long-lived branch: `main`.** Nine stale feature branches (`Auth`, `Folio`, `Module`, `Pages`, `Progress`, `Questions`, `Recall`, `develop`, and later `Dashboard`) were deleted in M0.
- One milestone = one `cursor/…` branch = one agent session = one PR.
- Merge with **`--no-ff`** (keep logical commits). Not squash.
- Conventional commits: `feat|fix|test|chore|docs(scope): …`. Ban “Testing”, “some modification”, “new commit”.
- Every milestone ships feature tests. Acceptance = pass on the **tower**, not the agent’s summary.
- Postgres is the target. Never write MySQL-only migration APIs (`->after()` as a requirement, `enum()->change()` without a driver-aware path).
- Security: Zero-Trust. Server-side validation. Quiz correctness **never** trusted from the client. No `Model::create($request->all())`. Signed + throttled auth.
- Design source of truth: repo `design/` + root `AGENTS.md`. Agents must not invent student layouts once those files exist.
- Purple/violet banned on customer UI (developer rule). Admin indigo/purple is tolerated until M1 token cleanup.
- Do not rebuild Home/About/Terms before **M5**. Do not add billing before **M6**.

---

## 5. How this advisory session started (do not repeat)

This conversation ran in a **New Project** Cloud Agent workspace (empty repo). The advisor **cannot** commit to Medico from here. Code work happens in a **separate** agent attached to `mohamedballa/Medico` on `medico-tower`.

First clone of GitHub default branch found a 15-commit Laravel scaffold (`Hello World` Home). User clarified default branch was wrong. Re-clone used `Dashboard` (52 commits). That was the real app.

---

## 6. Assessment of `Dashboard` (pre-M0) — still useful as “what we inherited”

Approximate completion **before M0** against an MVP:

| Layer | Then | Notes |
|---|---|---|
| Docker / Vite / Postgres | ~70% | nginx broken |
| Data model | ~85% | subjects, topics, chapters, modules, folios, slides, questions, choices, flashcards, `user_module_progress`, `user_streaks` |
| Auth | ~75% | custom signup/login/verify/reset |
| Admin authoring | ~60% | CRUD + Editor.js; missing Folio Create/Edit pages, all Flashcard pages, Error page |
| Marketing site | ~30% | Home is PNG screenshots |
| **Student learning** | **0%** | `Dashboard.jsx` / `Syllabus.jsx` empty headers |
| Billing | 0% | |
| Tests / CI | 0% | stock example tests |

**Overall MVP then: ~30%.** Schema and authoring existed; the learner loop (lesson → quiz → progress → streak) did not.

### Backend-first debate

Developer argued backend first so a frontend rewrite would not force a backend rewrite. Advisor agreed **for the schema**, not for 21 admin React pages. Correct order: schema → thinnest learner loop → authoring only as deep as real content. Schema is done; do not repeat the pattern with billing (no full plan-admin before one student can pay).

### Pre-M0 ship-blocking bugs (most fixed in M0 / M0.1)

1. File `FlashCard.php` vs class `Flashcard` — latent PSR-4 issue (masked by `optimize-autoloader: true`).
2. Missing Inertia pages: Folios Create/Edit, Flashcards Index/Create/Edit, Error.
3. DB enum `mcq, fill_in, short_answer` vs controller `mcq, true_false`.
4. `question_text` / `explanation` type mismatch store vs update vs casts.
5. Home linked to `/Demo` and `/Subscribe` (404).
6. nginx `fastcgi_pass laravel.test:9000` while app listens on :80.
7. Six zero-byte junk files in repo root (`=`, `[`, `ERROR`, `@php`, `[internal]`, `IlluminateFoundationComposerScripts::postAutoloadDump`).
8. Dead `app/Http/Kernel.php` (Laravel 12 uses `bootstrap/app.php`), `routes/webcopy.php`, `config/appNew.php`.

### Pre-M0 security findings (most fixed in M0 / M0.1)

- Unauthenticated `Route::inertia('/Admin')` and `/Dashboard`.
- Verification link not signed / not expiring (only `sha1(email)`).
- No rate limits on auth endpoints.
- User enumeration (“email does not exist” vs “wrong password”).
- `is_admin` in `$fillable`.
- Nested `choices.*.id` / `slides.*.id` not scoped to parent (admin IDOR).
- Image upload unvalidated.
- Adminer `restart: always` in main compose (dangerous if compose is deployed).
- Multi-row writes without transactions.

### Frontend critique (still true until M5)

`Home.jsx`: 27 `<img>` tags, **zero** text nodes, ~4 MB of PNG exports (mobile/tablet/desktop duplicates). Not crawlable, not accessible, not translatable. Must be rebuilt as HTML + Tailwind in **M5**. Student UI must **not** copy this pattern.

---

## 7. Milestone roadmap (canonical)

Each milestone is one branch, one session, one merge. “Done” = acceptance on the Ubuntu tower.

### M0 — Stabilize — **DONE (merged)**

Mechanical cleanup + security + CI. See §8.

### M0.1 — Follow-up — **PR completed, CI green; merge not confirmed in this chat**

`$validated` everywhere remaining, seeder rewrite, email+IP throttling, Home CTA fixes. See §9. **First action for a new agent: confirm this is on `main`.**

### M1 — Publishing + student syllabus — **BLOCKED on design files**

- Migration: `is_published` boolean default `false` on `subjects` and `modules`. Admin toggles (Inertia PATCH, admin-only).
- `LearnController@index` → `GET /learn` middleware `auth` + `verified`. Only published subjects → topics → chapters → published modules, eager-loaded, ordered by `order`. Attach current user’s `completed` / `progress_percentage` from `user_module_progress` (null-safe).
- `resources/js/Pages/Learn/Index.jsx`: HTML + Tailwind from `design/`. Accordion subject → topic → chapter; module cards with completion. Mobile-first 375 and 1280. No PNG-as-UI, no lorem.
- Extract learn components under `resources/js/components/learn/` (ModuleCard, ProgressRing, StatusBadge, SubjectAccordion).
- Fix `tailwind.config.js` tokens (missing `#`, typos, casing) per `design/README.md`.
- `GET /Syllabus` → 302 `/learn`. Nav, Footer, Home links → `/learn`. Three remaining Home `href="Syllabus"` (relative) must become `"/learn"`.
- Authenticated `/dashboard` redirects to `/learn` until M4.
- Remove `Pages/Syllabus2.jsx` if still present.
- Feature tests: guest 302 login; unverified 302 verification notice; published-only payload; unpublished 404/not in list; admin toggle 403 for non-admin.
- **Do not** touch billing, progress writes, or Home layout beyond those links.

### M2 — Folio reader

- `GET /learn/modules/{module}` (published only).
- Read-only Editor.js renderer: `header`, `paragraph`, `list`, `image`, `table`, plus **if decision A is accepted:** `callout`, `figure-row`.
- Sanitize Editor.js HTML (`DOMPurify` or strip server-side).
- Slide prev/next, keyboard arrows, optional swipe. Progress per agreed semantics.
- F / Q / R chrome per agreed lock rules.
- If custom tools: ship admin Editor.js tools in the **same** milestone so authors can create what the reader shows.
- SVG upload: allow `svg` **only with sanitization** (scripts in SVG). Current validator is `jpg,jpeg,png,webp`.
- Tests: unpublished → 403/404; published → 200 with slides.

### M3 — MCQ player

- Table `question_attempts`: `user_id`, `question_id`, `selected_label`, `is_correct`, `answered_at`; index `(user_id, question_id)`.
- `AttemptController@store`: choice must belong to that question; `is_correct` computed **server-side only**.
- UI: one question at a time, lock on submit, reveal correct + explanation, Next.
- Module summary: score, wrong answers + explanations.
- Retake allowed; show best and latest (per spec once written).
- Test: tampering `is_correct` in the request has no effect.

### M4 — Flashcards + progress + streaks

- `flashcard_reviews`: `user_id`, `flashcard_id`, `rating`, `reviewed_at`. Flip UI: Again / Good / Easy. SM-2 can wait for M7.
- `ProgressService::recordModuleCompletion(User, Module)`: writes `user_module_progress` with `unique(user_id, module_id)`; updates `user_streaks` with `unique(user_id)`. Streak logic in one **unit-tested** pure method.
- Real `Dashboard.jsx`: continue, streak, completed modules, weak areas.
- Completing a module twice must not create two progress rows. Streak increments **once per calendar day**.
- Spec draft: a day counts when ≥1 module completed **or** ≥10 questions answered; timezone from browser sent with the request — confirm in `student-experience.md`.

### M5 — Marketing HTML

- Rewrite Home, About, Pricing as text + Tailwind from Figma. Delete ~4 MB screenshot PNGs. Keep logo / hero illustration as SVG.
- Real copy. Pricing skeleton free vs pro, **no payment**.
- Meta description, OpenGraph, sitemap.
- Home relative `Syllabus` links already should be `/learn` from M1.
- Target: Lighthouse mobile ≥ 90 Performance, Accessibility, SEO.

### M6 — Billing

- Laravel Cashier + Stripe Checkout. One plan: Pro monthly.
- `subscribed` middleware. `modules.is_free` so the free tier is **content-driven**.
- Webhooks for cancel / failed payment. Test with Stripe CLI on the tower.

### M7 — Students Hub v1

- Leaderboard: weekly XP from attempts + completions, cached query.
- Rapid Questions: 10 random published MCQs, timer, score.
- Recall: due flashcards (SM-2 on `flashcard_reviews`).
- **Challenge (1v1) is out of scope** until the above have real users.

### M8 — Hardening

- Feature tests for every controller action; ≥ 70% coverage on `app/`.
- CI Postgres is already partly done (M0.1 added a postgres:17 fresh-seed job). Still: consider running the **full PHPUnit suite** against Postgres, not only seed.
- Security headers (CSP, HSTS), `TrustProxies`, `APP_DEBUG=false` on staging.
- Production compose: php-fpm + nginx (the :9000 design done properly), queue worker, scheduled Postgres backups.
- Mail provider + DNS.

---

## 8. M0 — what landed (merged)

**Branch:** `cursor/m0-cleanup-hardening-3782` (5 commits). Worked in `~/projects/Medico`. Tests inside Sail.

### Git

- `main` reset to `Dashboard`, dropping only the throwaway “Testing” commit that replaced Home with Hello World; force-pushed.
- Deleted local+remote: `Auth`, `Folio`, `Module`, `Pages`, `Progress`, `Questions`, `Recall`, `develop`.
- **GitHub default branch was still `Dashboard` at M0 report time.** User was told to switch Settings → Branches to `main`, then delete `Dashboard`. Confirm this was done.

### Code (requested + extras)

- Deleted junk files, `Kernel.php`, `webcopy.php`, `appNew.php`.
- `FlashCard.php` → `Flashcard.php`.
- Duplicate unauthenticated Inertia routes removed; keep controller routes only (`/signup`, `/login`, etc. — **case-sensitive**).
- `questions.type` aligned to `[mcq, true_false]` via **driver-aware** migration: Postgres drop/re-add `questions_type_check`; SQLite `enum()->change()` rebuild. Aborts if rows outside the set exist. `Question::TYPES` is the single source of truth.
- `QuestionController::update` validation aligned with store (`question_text` array, etc.).
- `DB::transaction` around question+choices and folio+slides.
- Nested ids: `Rule::exists()->where(parent_id)`; updates via parent relation.
- Missing pages created: `Error`, Folios Create/Edit, Flashcards Index/Create/Edit.
- `is_admin` removed from `$fillable`; `php artisan medico:make-admin {email}`.
- Signed, expiring verification URLs + **`signed` middleware** (generated signed URLs previously were **not validated**).
- Generic login / resend responses (no enumeration).
- Upload: `required|image|mimes:jpg,jpeg,png,webp|max:2048`. CSRF: `csrf-token` meta in `app.blade.php`; uploads via axios (XSRF). Previous path read a missing meta tag and always threw.
- nginx service **deleted**. Adminer → `docker-compose.override.yml` (git-ignored; `.example` committed).
- `.env.example`: `APP_NAME=Medico`, `DB_CONNECTION=pgsql`, Postgres vars.
- GitHub Actions: composer, PHPUnit, `npm ci && npm run build`. First CI run failed because tests rendered Blade `@vite` with no manifest → `withoutVite()` in `TestCase`.
- `flash.success` shared in `HandleInertiaRequests` (admin pages rendered it but it was never shared).
- `Questions/Edit.jsx` was an empty stub; `Questions/Create.jsx` passed `{ data }` to Inertia `post()` which **ignores** it — MCQs could never be created. Rebuilt on shared `QuestionForm`.
- Nav/Navbar/Login/Signup/Home links fixed to real case-sensitive routes (`/Signup` duplicate was gone).
- 44 feature tests, 460 assertions.

### M0 leftover notes (agent)

- Home `/Demo` `/Subscribe` still 404 at M0 end → fixed in M0.1 to `/signup`.
- Seeder still garbage at M0 end → rewritten in M0.1.
- `ModuleController` / `SubjectController` still `$request->all()` at M0 end → M0.1.
- Admin colors indigo/purple — deferred to M1 tokens.
- Error page only used outside debug mode by design.
- Throttling was per-IP at M0 end → M0.1 email+IP.

### After M0 merge (developer ops)

```bash
./vendor/bin/sail up -d --remove-orphans   # kills stale medico-nginx-1
```

---

## 9. M0.1 — what landed (CI green; merge unconfirmed here)

**Branch:** `cursor/m0-1-followup-3782` off `main` (post-M0 merge), 4 commits. CI: PHP tests, PostgreSQL fresh-seed, frontend build.

1. **Mass assignment:** Only `SubjectController` and `ModuleController` still used `$request->all()`. Fixed. `AdminMassAssignmentTest` covers all seven admin controllers store+update with `is_published=1`, `id=999`, forged `created_at`. Honest caveat: `$fillable` already blocked those columns; tests pin the contract.
2. **Seeder:** `question_text` / `explanation` as Editor.js documents `{time, blocks:[{type:"paragraph", data:{text}}], version:"2.31.0"}`. No users, no progress, no streaks. One transaction. `true_false` sample added. `SeederTest` asserts counts, document shape, zero users/progress. Verified `migrate:fresh --seed` twice on scratch Postgres `medico_m01_check` (dev DB with 3 subjects **not** touched) and SQLite. CI: SQLite fresh-seed in tests job + **postgres:17 service job** running migrate:fresh --seed twice.
3. **Throttling:** `RateLimiter::for('auth')` in `AppServiceProvider`: 6/min by `lower(trim(email))|'|'.ip` **and** 60/min by IP. Applied `throttle:auth` to login, signup, forgot-password, reset-password, verification resend. Signed verify link stays IP-keyed, loosened 6 → 60/min (signature is the guard; 6/min would bite a lecture hall). Duplicate `Inertia::share('auth')` removed from `AppServiceProvider` (already in `HandleInertiaRequests`).
4. **Home.jsx:** six `/Demo` + three `/Subscribe` → **`/signup`** (not `/Signup` — that route no longer exists). Relative `href="Syllabus"` left for M1 → `"/learn"`.

**Admin colors untouched (correct).**

---

## 10. Auth and admin access (current contract)

There are **no seeded admin credentials**. After M0.1, the seeder creates **zero users**. `is_admin` cannot be set via signup or forms.

```bash
./vendor/bin/sail artisan medico:make-admin you@example.com
```

Flow: `/signup` → verify email (queue worker or `sync`) → login → `make-admin` → reload `/admin`. `is_admin` is read each request; no re-login required.

`/admin` **403** means: not logged in, or logged in without `is_admin`. `AdminMiddleware` returns Inertia `Error` 403 for both.

Inspect users:

```bash
./vendor/bin/sail artisan tinker --execute='dump(App\Models\User::select("id","email","is_admin","email_verified_at")->get()->toArray());'
```

Laravel email verification is **not a separate package**. It is:

1. `MustVerifyEmail` on `User` (already).
2. `email_verified_at` column (already).
3. Notification (custom `VerifyEmailNotification`).
4. Routes `verification.notice` / `verification.verify` (must be `signed` + throttled) / resend, plus `verified` middleware.

This app **logs the user out after signup** and refuses login until verified (stricter than stock Laravel, which keeps them logged in and gates with `verified`). Learner routes must still use `['auth', 'verified']` so no path skips verification.

---

## 11. Design-in-repo strategy (agreed; not yet confirmed committed)

**Do not attach Figma only to chat.** Commit assets so every agent session has the same contract.

### Proposed tree

```
Medico/
├── AGENTS.md
└── design/
    ├── README.md                 # tokens, breakpoints, component inventory
    ├── student-experience.md     # behavior rules (testable)
    ├── screens/
    │   ├── learn-index.375.png
    │   ├── learn-index.1280.png
    │   ├── module-detail.375.png
    │   ├── folio-slide.375.png
    │   ├── folio-slide.1280.png
    │   ├── quiz-question.375.png
    │   ├── quiz-result.375.png
    │   ├── flashcard.375.png
    │   └── dashboard.375.png
    └── components/
        ├── module-card-states.png
        └── buttons.png
```

Naming: `screen-name.width.png`. Export 2× from Figma. Keep each PNG ≲ 2 MB. Ordinary git; no LFS.

Upload via code-server drag-and-drop or `scp` from the MacBook. Commit message example: `docs(design): add student UI frames, tokens, and behavior spec`.

### `AGENTS.md` (commit this)

```markdown
# Medico — agent notes

- Design source of truth: `design/README.md` (tokens, component inventory) and `design/screens/*.png`.
  Read both before building or changing any page under `resources/js/Pages/Learn/**` or `resources/js/components/learn/**`.
- Student behavior spec: `design/student-experience.md`. Any ambiguity in a milestone prompt is resolved by this file.
- Run tests inside Sail: `./vendor/bin/sail artisan test`. Host has no PHP.
- Postgres is the target; SQLite is CI-only. Never write MySQL-only migration calls (`->after()`, `enum()->change()` without a driver-aware path).
- Milestone prompts define scope. Do not rebuild Home/About/Terms before M5.
```

### What belongs in prose vs PNG

- **PNG:** layout, spacing, type hierarchy, color.
- **Markdown:** state transitions, ordering, empty/error/loading, what a tap does, lock rules. Do **not** restate “the button is blue and 44px tall.”

---

## 12. Folio reader Figma review (one ~520 px export, 8 Sep 2026)

The frame shows: authenticated-looking marketing nav (but Sign up / Login), blue “General Introduction” bar, module title “What is Anatomy?”, “Anatomical Position →” as a next-module chip, F / Q / R circles (F active), mint progress with a **knob**, white reading card with anatomy copy, yellow “Did you know” callout, inline sketches (eye, microscope, histology), full-width “continue”, dark footer with Syllabus / Blog / About.

### Content-model mismatch (must decide before M2)

Editor.js today: header, paragraph, list, image, table. The mockup needs:

- Text beside a small illustration (and the export itself overlapped/hid text — freehand Figma, not a component).
- Floating yellow callout.

| Option | Meaning | Cost |
|---|---|---|
| **A (recommended)** | Custom Editor.js tools `callout` and `figure-row` (stacks &lt; 768 px) | Admin + student work in M2 |
| **B** | Flatten to stacked image + paragraph; callout as styled paragraph | Loses brand character |

### Open product decisions (recommendations in parentheses)

| ID | Question | Recommendation |
|---|---|---|
| A | Custom tools vs flatten | **A — custom tools** |
| B | Progress: slides vs folios; scrubber vs read-only | **Read-only, slides viewed / total in module; no knob** |
| C | Continue | **Next slide; last slide label “Start quiz” → Q. Viewing records viewed. Module completes only after quiz.** |
| D | F/Q/R | **Q and R locked until every Folio slide viewed** |
| E | “Anatomical Position →” | **Breadcrumb, not next-module. Next module after Recall.** |
| F | Blog in nav/footer | **Remove until a blog exists** |
| G | Body type | **Karla ≥ 16 px / line-height 1.6; Spectral for headings** |

Also: authenticated nav (Dashboard / avatar / Logout); hide footer on reader screens; add tokens `note-bg` / `note-fg`; F/Q/R need labels or `aria-label`; casing of “continue”; **export 375 and 1280**, not 520.

### Draft spec (paste into `student-experience.md` after user confirms)

```markdown
## Module reader — Folio tab
- Header: breadcrumb Subject › Chapter › Module. No next-module link here.
- Tabs F/Q/R with labels Folio / Quiz / Recall. Q and R unlocked once every slide in the module has been viewed. Locked tabs show a lock icon and a tooltip.
- Progress bar = slides viewed / total slides in the module. Read-only; no knob.
- Slide blocks: header, paragraph, list, image, table, callout (yellow note), figure-row (text + illustration; stacks vertically < 768 px).
- "Continue": next slide. On the last slide: label becomes "Start quiz", goes to Q. Viewing a slide records it as viewed.
- Authenticated nav: Home, Syllabus, Dashboard, avatar → Logout.
- Footer hidden on reader screens.
- Body text 16 px Karla, headings Spectral, min contrast 4.5:1.
```

### Extra screens still needed from Figma

Learn index; module card states; folio at 375 **and** 1280; quiz question; quiz result; flashcard/recall; dashboard; authenticated nav.

---

## 13. Advisor requests to the developer (status)

### Blockers before M1

1. **Confirm M0.1 merged** onto `main`, tree clean.
2. **Commit `design/` + `AGENTS.md`.**
3. **Export missing frames at 375 and 1280.**
4. **Answer decisions A–G** in `student-experience.md` (or accept the recommendation column).

### Not blocking but still needed

5. Token table in `design/README.md` (include yellow note, mint progress; fix `#`, typos, casing).
6. Component inventory (one line each + tap behavior).
7. Empty / error / loading copy for `/learn`.
8. Who writes the first three **real** medical modules (content, not code).

### Do not send

More 520 px exports; Home rewrite before M5; billing/leaderboard/Challenge scope; a separate admin-color ticket.

---

## 14. Reusable prompts

### After M0.1 merge — only if M0.1 is still open

Tell the Medico agent: `Merge --no-ff into main, push, delete the branch.`

### M1 (new conversation on `medico-tower`, branch off `main`)

```
Follow design/ and AGENTS.md. Laravel 12 / Inertia 2 / React 19 / Tailwind 3 / Postgres. Work on a new branch off main.

Design source of truth: design/README.md, design/student-experience.md, and design/screens/*.png. Match spacing, type scale, and colors exactly; do not invent layouts. Build every visual element as HTML + Tailwind using tokens — no exported PNG for text, buttons, or layout; SVG only for icons and illustrations. Extract reusable components into resources/js/components/learn/ (ModuleCard, ProgressRing, StatusBadge, SubjectAccordion). Before writing pages, fix tailwind.config.js to match design/README.md (missing '#' on Paragraph and White, Backggroundfooter typo, lowercase semantic token names) and update existing usages.

Milestone M1 — Publishing + student syllabus:
1. Migration: add is_published boolean default false to subjects and modules. Admin toggles on Admin/Subjects/Index and Admin/Modules/Index (Inertia PATCH, admin-only).
2. App\Http\Controllers\LearnController@index → GET /learn (middleware: auth, verified). Return only published subjects → topics → chapters → published modules, eager-loaded, ordered by order. Include for the current user each module's completed and progress_percentage from user_module_progress (null-safe).
3. Pages/Learn/Index.jsx as specified above. Mobile-first, 375 and 1280.
4. GET /Syllabus → 302 /learn. Update Nav.jsx, Footer.jsx, and the three relative href="Syllabus" links in Home.jsx to /learn. Remove Pages/Syllabus2.jsx if present.
5. Redirect authenticated users from /dashboard to /learn until M4.
6. Feature tests (tests/Feature/LearnTest.php): guest → 302 login; unverified → 302 verification notice; verified user sees published modules only; unpublished module not in payload; admin toggle flips is_published and is admin-only (403 for non-admin).
7. Run ./vendor/bin/sail artisan test and npm run build; both must pass. Conventional commits. Do not touch billing, progress writes, or the Home page layout beyond those links.
```

---

## 15. Command cheat sheet (tower)

```bash
# Worker
tmux ls
tmux attach -t cursor-worker

# Git hygiene before an agent run
git checkout main && git pull && git status   # must be clean

# Sail
./vendor/bin/sail up -d --remove-orphans
./vendor/bin/sail composer install
./vendor/bin/sail npm ci
./vendor/bin/sail artisan migrate:fresh --seed   # WIPER; then make-admin
./vendor/bin/sail artisan medico:make-admin you@example.com
./vendor/bin/sail artisan test
./vendor/bin/sail npm run build
./vendor/bin/sail artisan queue:listen --tries=3 --timeout=60
./vendor/bin/sail artisan queue:failed
./vendor/bin/sail artisan tinker --execute='dump(DB::table("jobs")->count());'
./vendor/bin/sail artisan route:list
```

Verification after agent PRs: `git log main..HEAD`, `git diff main --stat`, run tests/build, click the milestone acceptance list in a browser against the tower URL.

---

## 16. Immediate next steps (as of 10 Sep 2026)

1. Developer: merge M0.1 if not merged; `git checkout main && git pull`; confirm GitHub default branch is `main` and `Dashboard` is deleted.
2. Developer: Figma exports + `design/README.md` + `design/student-experience.md` (include A–G) + `AGENTS.md`; commit to Medico.
3. Developer: `make-admin` for local `/admin` review; `QUEUE_CONNECTION=sync` or `queue:listen` for signup mail.
4. New Medico agent on `medico-tower`: paste the M1 prompt. **Do not start M1 without step 2** — building `/learn` without the design is a guaranteed rewrite.
5. Content: start writing three real modules in admin so M2/M3 render truth, not seeder lorem.

---

## 17. Tone and working style for successor models

The developer asked for a brutally honest advisor: do not flatter, do not invent calendar estimates (hours/week is their variable), do not start coding in **this** empty-repo session, do not guess product UX when Figma exists. Challenge backend-first when it means building admin UI before any student screen. Prefer Sail commands. When the developer reports an agent finished a milestone, demand tower verification before merge, then give the **next prompt**, not a new architecture.

If a later agent is asked to implement: follow `AGENTS.md`, stay inside the named milestone, run tests in Sail, conventional commits, open a PR, wait for the developer to verify.

---

## 18. Files / artifacts mentioned but not in this workspace

- Medico source: GitHub `mohamedballa/Medico` only.
- Folio mockup PNG was attached in chat (Figma export, ~520 px). Copy it into `design/screens/` with proper 375/1280 exports; do not treat the chat attachment as the source of truth.
- This handoff file was written in the **advisory** Cloud Agent workspace. Copy it into Medico as `docs/HANDOFF.md` (or replace this file’s role) so it lives with the code.

