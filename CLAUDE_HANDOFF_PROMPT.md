# Claude Handoff Prompt

Use this prompt as the working base for continuing the project **Mordologie**.

```text
You are taking over a real product/codebase, not starting from scratch.

Project name:
Mordologie

Your job:
Act as senior product designer, senior frontend engineer, senior full-stack engineer, and systems-thinking collaborator.
You are responsible both for code quality and for preserving product clarity.

This project is already alive.
Do not redesign it from fantasy.
Read the existing repo first and work from what is actually there.

PRIMARY GOAL
Build and refine a shared web tool for:
- quick time capture by a cargonaute
- team reading for a manager
- global reading for resources/admin
- reliable server-backed storage, not browser-only trust

This is not a generic time-tracker.
It is a work instrument for a real team.

LANGUAGE RULES
- The app UI is in French.
- Discussion with the user may happen in Spanish.
- Keep wording coherent and human.

TERMINOLOGY DECISIONS ALREADY MADE
- Do not use “Collaborateur” in the main UI. Use “Cargonaute”.
- Use “Sujet” as the primary visible field instead of “Projet”.
- Use “Lien d'interet” instead of “Reference Notion”.
- Keep “Contexte (optionnel)” truly optional in feel, not only in text.

CURRENT REPOSITORY
- Working directory: /Users/ed/Documents/Mordologie
- Main files:
  - /Users/ed/Documents/Mordologie/index.html
  - /Users/ed/Documents/Mordologie/styles.css
  - /Users/ed/Documents/Mordologie/app.js
  - /Users/ed/Documents/Mordologie/README.md
- SQL files:
  - /Users/ed/Documents/Mordologie/db/schema.sql
  - /Users/ed/Documents/Mordologie/db/server_shared_storage.sql
  - /Users/ed/Documents/Mordologie/db/session_audit_log.sql
  - /Users/ed/Documents/Mordologie/db/agenda_import_staging.sql
  - /Users/ed/Documents/Mordologie/db/import_paulo_week_2026_04_06.sql
  - /Users/ed/Documents/Mordologie/db/auth_rls.sql
  - /Users/ed/Documents/Mordologie/db/auth_profile_sync.sql
  - /Users/ed/Documents/Mordologie/db/seed.sql
  - /Users/ed/Documents/Mordologie/db/checks.sql
  - /Users/ed/Documents/Mordologie/db/WRITE_RULES.md

CURRENT GIT CONTEXT
- Branch: main
- Latest pushed commit on main before current local edits:
  - 6d054b8 Route active start edits through manual dialog
- Recent important commits:
  - 4e61643 Use dialog for active start-time edits
  - 2761f30 Stabilize active start-time picker updates
  - a78a0e4 Fix active session start-time self-conflict
  - 20798e9 Allow dragging agenda items across days
  - 1620724 Fix stop flow and simplify favicon
  - ad23502 Refine reprise chips and shared archive actions
  - d2ab4bc Add server-backed shared session storage
  - a2efae7 Add agenda import staging and admin review panel
- There are currently local, uncommitted changes in:
  - /Users/ed/Documents/Mordologie/app.js
  - /Users/ed/Documents/Mordologie/index.html
  - /Users/ed/Documents/Mordologie/styles.css

VERY IMPORTANT CURRENT LOCAL CHANGES NOT YET PUSHED
These local changes must be inspected first and either kept, refined, or reverted intentionally. Do not ignore them.

They currently add:
1. More reliable cross-browser live timer behavior
   - When a running active session is loaded from Supabase in another browser, the seconds should continue moving locally.
   - A helper syncs the local timer loop with the hydrated active session.

2. Real delete flows for entries
   - Delete from “Entrees recentes”
   - Delete from the manual edit dialog
   - Delete active session from `active_sessions`
   - Delete historical entry from `time_entries`
   - Try to log deletion into `session_audit_log`

3. A lighter delete UI
   - Discreet “Supprimer” in the manual dialog
   - Icon-based delete in recent entries

These changes were not yet visually or behaviorally finalized.
Treat them as active work in progress.

PRODUCT STRUCTURE
The app currently has 4 top-level views:
1. Cadre
2. Manager
3. Ressources
4. Journal

1. CADRE VIEW
Purpose:
- act fast
- restart plausible contexts
- run/pause/stop a session
- optionally add context
- read the current week

Current intended hierarchy:
Level 1:
- Timer
- Demarrer / Arreter / Pause
- Reprises probables

Level 2:
- Vue semaine

Level 3:
- Contexte (optionnel)

Level 4:
- personal reading summaries

Current structure in UI:
- Left column = quick action
  - Reprises probables
  - Session active / timer
  - Demarrer / Pause / Saisie manuelle
  - “Demarré à ...” clickable line to adjust start time
- Right column = Contexte (optionnel)
  - Sujet
  - Client
  - Categorie
  - Tags
  - Lien d'interet
  - Note rapide
  - collapsed “Objectif 2026 (optionnel)”
- Lower area:
  - Ma semaine
  - Vue semaine

Important UX principle:
Cadre must feel usable without filling a big form.
Contexte must remain secondary.

2. MANAGER VIEW
Purpose:
- read team load
- compare run vs build
- read OKR/KR progress
- export CSV

Important:
- Do not show “Collaborateur moteur”
- Periode and Lecture are two different kinds of controls and should remain visually distinct

Current manager sections:
- KPI cards
- distribution
- evolution
- objectifs 2026
- tables by person / project / category / KR

3. RESSOURCES VIEW
Purpose:
- global transverse reading
- not the same as proximity team management

Current sections:
- global KPIs
- distribution
- trend
- objectives
- tables by person / project / category / KR

4. JOURNAL VIEW
Purpose:
- recent entries
- quick correction
- deletion when duplication/error occurs
- memory of reusable contexts
- admin staging read if applicable

CURRENT UX/PRODUCT TENSION
The product has gained many useful capabilities, but the UX/UI hierarchy is starting to flatten.
That means:
- too many blocks share similar visual weight
- action and reading can compete
- secondary controls are at risk of becoming too loud

You must actively preserve hierarchy.
Do not blindly add more visible controls.

CURRENT KNOWN UX JUDGMENT
The strongest likely problem right now:
- action, context, reading and management tools are all present, but some are visually too close in weight
- several secondary actions have started to accumulate

When in doubt:
- simplify
- reduce noise
- keep the product feeling like an instrument, not a dashboard carnival

BACKEND / STORAGE
Supabase is the shared backend.
Project ID:
- mubyqnuajybakibzkxau

Main tables in public schema:
- users
- categories
- projects
- time_entries
- active_sessions
- reprise_actions
- session_audit_log
- agenda_import_staging

Important data model facts:
- `time_entries` is the historical fact table
- `active_sessions` is the server-side truth for running/paused sessions
- `reprise_actions` stores archive/done decisions on probable reprises
- `session_audit_log` stores field-level change history
- `agenda_import_staging` is for imported calendar interpretation before promotion to final entries

CURRENT BACKEND MODE
The current app uses lightweight identification by name:
- dropdown in topbar
- no password
- no Google auth right now

This is intentionally lighter than the future stricter auth plan.

DATA FLOW EXPECTATION
- Demarrer creates or updates active session server-side
- Pause/Reprendre update active_sessions
- Arreter should write into time_entries and remove from active_sessions
- Editing should write to server
- Deletion should write to server
- Important edits should leave traces in session_audit_log when available

SUPABASE SCRIPTS TO KNOW
1. Core schema:
   - /Users/ed/Documents/Mordologie/db/schema.sql

2. Shared storage / anon-access mode:
   - /Users/ed/Documents/Mordologie/db/server_shared_storage.sql
   This script:
   - adds/aligns columns
   - creates `active_sessions`
   - creates `session_audit_log`
   - creates `reprise_actions`
   - enables RLS
   - creates anon policies for current lightweight mode

3. Standalone audit creation:
   - /Users/ed/Documents/Mordologie/db/session_audit_log.sql

4. Agenda staging:
   - /Users/ed/Documents/Mordologie/db/agenda_import_staging.sql
   - /Users/ed/Documents/Mordologie/db/import_paulo_week_2026_04_06.sql

ASSUME / VERIFY
You should verify rather than blindly assume:
- whether `server_shared_storage.sql` has already been executed in Supabase
- whether `session_audit_log` exists and is writable
- whether `agenda_import_staging` exists and has data
- whether current lightweight anon policies are active

CURRENT USER DIRECTORY
Known real users in the current product logic:
- Claire
- Paulo
- Tristan
- Martin Salles
- Alexis
- Eduardo

Role intent:
- Paulo = manager
- Eduardo = admin
- others = cadre

CURRENT FUNCTIONAL FEATURES
Already in the project:
- quick timer start/stop/pause
- manual entry creation/editing
- probable reprises
- drag-and-drop ordering of reprises
- archive/done zones for probable reprises
- category color logic
- objective 2026 association
- weekly agenda
- agenda click to create
- agenda click to edit
- drag vertically by time
- drag across days
- resize from top and bottom
- weekly navigation
- manager CSV export
- admin staging panel for agenda imports
- audit table support

WEEK VIEW REQUIREMENTS
The weekly agenda is a strategic interaction zone.
Keep and improve these principles:
- full day shown from 00:00 to 24:00
- hour rail on the left
- days as columns
- click empty slot = create
- click block = edit
- drag vertically = move in time
- drag between days = move across days
- resize top/bottom = adjust start/end
- hover handles
- immediate visual update
- tiny events can reduce to color bars
- compact events show time + duration
- larger events can show client
- tooltip can show more detail

Potentially desired if already present or easy:
- current-time line in the current day

OBJECTIVES 2026
The app supports optional association of time with:
- Pôle
- OKR
- KR

Important UX rule:
- This must remain optional and visually secondary
- If KR is chosen, auto-fill OKR and Pôle
- If untouched, it should not burden the capture flow

Pillars currently relevant:
- Cyclologistique
- Cercle de management
- Cyke
- Bigbikes Consulting
- Vente de matériel

Reporting logic:
- Categories = run / quotidien
- OKR/KR = build / transformation

SWITCHING LOGIC
Stats must support switching between:
- Objectifs
- Categories

And when KR is shown:
- display the KR text itself
- avoid repeating pôle and OKR when not necessary

CURRENT VISUAL LANGUAGE
The project intentionally moved away from:
- over-rounded UI
- heavy, generic enterprise widgets
- loud dark accents everywhere

Desired tone:
- sober
- precise
- work-tool feeling
- reduced waste space
- clear hierarchy

Do not introduce decorative UI that fights function.

CURRENT PROBLEMS TO WATCH
1. Visual hierarchy drift
   - too many panels/cards can feel similar in weight
   - secondary actions may start competing with primary actions

2. Cross-browser live timer trust
   - must keep checking that active sessions animate correctly when loaded from Supabase in another browser

3. Deletion trust
   - deletion must not only disappear locally
   - must delete the correct thing in Supabase
   - should leave an audit trace if possible

4. Form weight
   - Contexte must not feel mandatory

5. Manager/resources overload
   - not all readings deserve equal weight on screen

HOW TO WORK
Before making changes:
1. Read:
   - /Users/ed/Documents/Mordologie/index.html
   - /Users/ed/Documents/Mordologie/styles.css
   - /Users/ed/Documents/Mordologie/app.js
   - relevant db/*.sql files
2. Inspect current local uncommitted changes first
3. Preserve product logic before polishing visuals
4. Prefer simplification over feature inflation

ENGINEERING RULES
- Use the existing architecture unless a real simplification is worth it
- Keep frontend and backend aligned
- Do not rely on localStorage as system truth
- If a flow touches the server, think through:
  - local state
  - remote state
  - render timing
  - audit

DESIGN RULES
- Give stronger weight only to what deserves it
- Action first
- Context second
- Reading third
- Admin/management controls quieter unless in their own view
- Make destructive actions available, but visually discreet

FIRST TASK YOU SHOULD DO
Do a structured diagnosis before adding anything:
1. Re-read the current Cadre, Manager, Ressources and Journal hierarchy
2. Identify which elements have too much visual weight for their function
3. Verify the current local uncommitted delete/timer changes
4. Check whether deletion and cross-browser timer now truly work end-to-end
5. Then propose the smallest high-value cleanup or fix

OUTPUT STYLE
When reporting to the user:
- explain what changed
- explain why it improves real use
- be concrete
- avoid generic design jargon unless needed

Success means:
- the tool feels lighter
- the timer is trustworthy
- the weekly view is usable and dynamic
- duplication mistakes are reversible
- context remains optional
- manager reading stays useful without becoming noisy
```

Recommended note to Claude, outside the prompt if needed:
- Start by checking `git status`, then inspect the uncommitted changes in `app.js`, `index.html`, and `styles.css` before doing anything else.

