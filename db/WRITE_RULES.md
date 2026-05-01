# V1 Write Rules

This project uses a pragmatic semi-denormalized model for V1.

## Source of truth

- `duration_minutes` is the source of truth for effort.
- `duration_hours` is optional and may be derived at write time.
- Reference tables are the source of truth for labels.

## Denormalized fields copied at write time

When creating a `time_entry`, the application must resolve and copy:

- `user_name` from `users.user_name`
- `team_name` from `users.team_name`
- `project_name` from `projects.project_name`
- `client_name` from `projects.client_name`
- `activity_category_label` from `categories.activity_category_label`
- `kpi_category_label` from `categories.kpi_category_label`

These values:

- must never be manually entered by end users
- must never be set independently from the reference tables

## Team name consistency

`time_entries.team_name` exists only for export simplicity.

Rule:

- always copy it from `users.team_name`
- never set it directly in the input form or API payload

## Project default category rule

If a project has a default category:

- `projects.default_activity_category_id` references the category
- `projects.default_activity_category_label` is copied from the category label

This label is also application-maintained, never free text.

## ID conventions

Use readable text IDs with fixed prefixes:

- `USR-001`
- `PRJ-001`
- `CAT-001`
- `TE-000001`

The SQL schema validates these formats with check constraints.

## Minimal input flow

1. User selects a project.
2. Application loads the referenced project.
3. Application suggests the project default category if present.
4. User confirms or changes the category.
5. User enters an optional task label.
6. User enters a duration or uses the timer.
7. Application resolves all denormalized labels from reference tables.
8. Application writes the `time_entry`.

## Practical write example

For a time entry creation, the application should:

1. Load `users` by `user_id`
2. Load `projects` by `project_id`
3. Load `categories` by `activity_category_id`
4. Compute:
   - `duration_minutes`
   - optional `duration_hours = round(duration_minutes / 60.0, 2)`
5. Insert the row with both IDs and resolved labels

## Historical consistency

For V1, if a project or category label changes later:

- update the reference table
- do not rewrite past `time_entries`

This keeps exports readable without adding a heavier historical snapshot system yet.

## active_sessions — unique index requirement

`active_sessions` must have a unique index on `user_id`:

```sql
CREATE UNIQUE INDEX IF NOT EXISTS active_sessions_user_id_unique
ON public.active_sessions(user_id);
```

The load-bearing index is `active_sessions_user_id_unique`. `upsertActiveSessionToSupabase`
uses `onConflict: "user_id"` when a `user_id` is present in the payload. Without the unique
index, the `onConflict: "user_id"` upsert is rejected. Before this unique-index rule and the
user_id conflict key, duplicate active rows could accumulate for the same user and later be
reinstalled as ghost timers.

Rules:
- never drop this index without updating `upsertActiveSessionToSupabase`
- the fallback `onConflict: "active_session_id"` exists only for rows that genuinely
  lack a `user_id` (pre-migration safety guard — should not occur in normal operation)
- the pre-delete sweep in `upsertActiveSessionToSupabase` provides a second safety net,
  but the unique index is the primary guard
