# Mordologie — Code Map

Orientation document for new contributors. Read this before opening `app.js`
(12k lines) or `styles.css` (4.5k lines).

## Project shape

```
/
├── index.html              Single-page desktop app shell
├── app.js                  All desktop logic (monolithic, no bundler)
├── styles.css              All desktop styles (monolithic)
├── mobile.html / .css / .js   Pocket mobile companion (read-only)
├── api/calendar-proxy.js   Vercel serverless ICS fetcher + RRULE expander
├── db/                     SQL: schema, seed, RLS, RPCs (pocket_stop_session)
├── service-worker.js       PWA caching
├── manifest.webmanifest    PWA manifest
└── vercel.json             Routing (cleanUrls), cache headers
```

No build step. Files are served as-is. Vendored deps load from CDN
(`supabase-js@2`).

## Runtime model (desktop)

- Vanilla DOM, no framework. State lives in module-scope `let` bindings in
  `app.js`.
- Persistence is dual:
  - `localStorage` keys (see CONFIG & CONSTANTS section) for offline.
  - Supabase tables (`time_entries`, `active_sessions`, `users`,
    `projects`, `categories`, `user_ui_preferences`, `reprise_actions`)
    for sync.
- Sync is eventual: writes go to memory + localStorage first, then upserted
  to Supabase on a polling interval. The REMOTE SYNC ENGINE section drives
  this loop.
- Auth on desktop is name-based (no Supabase Auth) — the user picks their
  name from a rescue select. Pocket (mobile) uses Supabase Auth magic
  links and routes through `current_app_user_id()` in RLS.

## app.js — section map

Sections are marked with `// SECTION:` banners. Search for the name to
jump. Line numbers below are approximate and drift as the file evolves —
trust the markers, not the numbers.

| Section                                  | Approx. line | What lives here |
|------------------------------------------|--------------|-----------------|
| CONFIG & CONSTANTS                       | top          | Storage keys, palettes, seed data, debug flags |
| DOM REFERENCES                           | ~230         | Cached `querySelector` results, one per node |
| GLOBAL STATE                             | ~730         | `let` bindings — `sessions`, `activeSession`, etc. |
| DIALOGS & MODAL HELPERS                  | ~960         | Decision dialog, field-manage helpers |
| AUTOCOMPLETE SUBSYSTEM                   | ~1920        | Shared popover; typing only filters, side-effects on confirm |
| AGENDA INTERACTION                       | ~2500        | Drag/resize/clone hit-testing |
| VIEW NAVIGATION & UI CHROME              | ~2790        | Top-level view tabs, role pill |
| STORAGE — PREFERENCES, PROFILES, THEMES  | ~2850        | Day themes, avatars, shared UI prefs |
| SESSION LOAD & PERSISTENCE               | ~3260        | localStorage read/write for sessions |
| REMOTE SYNC ENGINE                       | ~3570        | Hydration, drift, status — eventual consistency |
| FORM HYDRATION                           | ~4310        | Capture form ↔ draft binding |
| STORAGE — COLORS & REPRISES              | ~4520        | Category colors and reprises ordering |
| FIELD MANAGEMENT DIALOG                  | ~4800        | Inline rename/delete/color for references |
| AUTH INITIALIZATION                      | ~4940        | App-user resolution (name-based) |
| CANONICALIZATION & SAVE PIPELINE         | ~5560        | Resolves typed values → IDs, then upsert |
| MANUAL ENTRY EDITOR                      | ~6280        | Backfill sessions; bidirectional duration binding |
| TIMER & LIVE RENDER                      | ~6820        | 1Hz tick |
| AUTH PANEL & ACCESS CONTROL              | ~6870        | Identity dropdown + role-gated inputs |
| SUGGESTIONS, JOURNAL & MEMORY            | ~7170        | Quick projects, tag/category managers, journal list |
| SYNC INDICATOR & ORCHESTRATION           | ~8030        | Sync badge, manual sync button, silent catch-up |
| CADRE, AGENDA & PLANNED RENDERING        | ~8430        | Cadre stats, week agenda, planned-event overlay |
| CALENDAR ICS                             | ~9600        | ICS fetch + snapshot, multi-URL merge |
| RESOURCES, GUIDE & USERS ADMIN           | ~10140       | Read-only resources, onboarding guide, users CRUD |
| MANAGER & PERSONAL REPORTS               | ~11000       | Team table, evolution grid, distribution charts |
| TOKEN INPUTS & APPLY HELPERS             | ~11930       | Chip-style inputs, project-memory apply, tail helpers |
| SERVICE WORKER & BOOT                    | bottom       | PWA registration; boot happens after this |

## styles.css — section map

| Section                            | What lives here |
|------------------------------------|-----------------|
| VARIABLES & BASE                   | `:root` tokens, resets, base elements |
| APP SHELL & TOPBAR                 | Outer grid, max-width, topbar |
| AUTH SHELL & DROPDOWN              | Guest landing, identity dropdown |
| STATUS TOASTS                      | Floating status messages by tone |
| COMPOSER FORM                      | 3-column capture grid + dialogs |
| JOURNAL FILTERS & SESSION LIST     | Toolbar + entry rows |
| TIMER PANEL                        | Live session card + controls |
| PERSONAL STATS                     | Solo dashboard card |
| CATEGORY & TAG ROWS                | Manager row layouts |
| AGENDA INTERACTION                 | Drag/clone cursor + ghost styles |
| SESSION ROW DISPLAY/EDIT           | Two-mode entry row |
| JOURNAL DAY HEADERS                | Sticky day headers + empty state |
| TIMER STATES & UI POLISH           | Running/paused, late overrides |
| GUIDE VIEW                         | Guest / new-user / existing-user variants |

## Sensitive zones — review carefully

These paths are race-tolerant and load-bearing. Behavioural regressions
here have caused production incidents. Don't refactor without an explicit
test plan.

- **Session save / stop / sync** — `saveSession`, `stopSession`,
  `syncStopToServer`, `autoSyncMissingSessions`. The path from clicking
  "Arrêter" to a `time_entries` row landing in Supabase is the most
  critical lifecycle in the app. See CANONICALIZATION & SAVE PIPELINE
  and SYNC INDICATOR & ORCHESTRATION.

- **`.upsert([...], { onConflict: ... })` calls** — every one is idempotent
  by design (`time_entry_id`, `active_session_id`, `owner_user_name,preference_key,scope_key`,
  `subject_user_name,memory_key`). Don't change the conflict keys.

- **`deleteSession`** — destructive; double-deletion guards live in the
  function. Reviewed and frozen.

- **Autocomplete contract** — typing only filters; side-effects fire only
  in `applyValue` (Enter / click / Tab). See AUTOCOMPLETE SUBSYSTEM and
  the input-event handlers near the GLOBAL STATE section. Past regression:
  side-effects were firing on every keystroke.

- **Manual sync from `anon` vs `authenticated`** — desktop uses anon key
  (no Supabase Auth session). Pocket uses authenticated. If a desktop user
  ever has an auth session in localStorage (e.g., clicked a magic link in
  the same browser), RLS for `authenticated` will silently filter rows.

## Conventions

- **Naming**: feature-prefixed CSS classes (`.composer-*`, `.journal-*`).
  JS function prefixes — `render*` for DOM writers, `load*`/`store*` for
  localStorage, `sync*` for memory↔DOM↔remote binding, `apply*` for
  draft → state writes, `resolve*` for async lookups.
- **Render functions are idempotent** — call them after any state change.
  They check their own visibility and skip work when hidden.
- **No comments that restate the code.** Add a comment only when the
  *why* would surprise a reader.
- **No new IDs/selectors without checking app.js DOM REFERENCES** —
  every new node the app interacts with should be cached at the top.

## Recommended next steps (post-Phase-1)

The file is still monolithic. Worth considering after Phase 1 settles:

1. **Phase 2** — internal cleanup, section by section:
   - Group truly co-located functions (some `apply*` helpers live far
     from their callers; `applyProjectMemoryFromInput` at ~11420 is
     called from AUTOCOMPLETE at ~1980).
   - Extract duplicated helpers (date range arithmetic, color hashing).
   - Rename ambiguous variables (`row` overloaded for sessions, users,
     time_entries).

2. **Phase 3** — modularization (only with confidence + tests):
   - Promote `<script src="app.js">` to `<script type="module">`.
   - Split into modules along section boundaries:
     `state.js`, `autocomplete.js`, `agenda.js`, `journal.js`,
     `sync.js`, `reports.js`, `users-admin.js`, `boot.js`.
   - Requires care with the global mutable state — likely needs a small
     pub/sub or explicit getter/setter layer first.

Neither Phase 2 nor 3 should start without an explicit greenlight.
