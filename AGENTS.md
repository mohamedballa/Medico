# Medico — agent notes

- Design source of truth: `design/README.md` (tokens, component inventory) and `design/screens/*.png`.
  Read both before building or changing any page under `resources/js/Pages/Learn/**` or `resources/js/components/learn/**`.
- Student behavior spec: `design/student-experience.md`. Any ambiguity in a milestone prompt is resolved by this file.
- Run tests inside Sail: `./vendor/bin/sail artisan test`. Host has no PHP.
- Postgres is the target; SQLite is CI-only. Never write MySQL-only migration calls (`->after()`, `enum()->change()`).
- Milestone prompts define scope. Do not rebuild Home/About/Terms before M5.