-- Mordologie Pocket — Preflight
-- ─────────────────────────────────────────────────────────────────────────────
-- EXECUTION RULES — read before running anything.
--
-- This file contains THREE independent statements.
-- Each must be run in isolation, in order, with a manual stop between them.
-- Do NOT select-all and execute the entire file at once.
--
-- ORDER:
--   Step 1 — run the duplicate SELECT.  Read the result.  Stop.
--   Step 2 — only if step 1 returned ZERO rows: run the CREATE UNIQUE INDEX.
--   Step 3 — run the verification SELECT to confirm the index exists.
-- ─────────────────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════════════════════
-- STEP 1 — Duplicate check
-- Run this statement alone first.
--
-- Expected result: ZERO rows.
-- If any rows appear → stop, do not proceed, investigate duplicates manually.
-- ═══════════════════════════════════════════════════════════════════════════════

SELECT
  source_session_id,
  COUNT(*)                                        AS occurrences,
  array_agg(time_entry_id ORDER BY created_at)    AS te_ids,
  array_agg(created_at   ORDER BY created_at)     AS created_ats
FROM public.time_entries
WHERE source_session_id IS NOT NULL
GROUP BY source_session_id
HAVING COUNT(*) > 1;


-- ═══════════════════════════════════════════════════════════════════════════════
-- STEP 2 — Create partial unique index
--
-- !! ONLY RUN if step 1 returned zero rows !!
--
-- IMPORTANT: CREATE INDEX CONCURRENTLY cannot run inside an explicit transaction
-- block. Run this statement ALONE in the SQL Editor (do not wrap in BEGIN/COMMIT,
-- do not select it together with other statements).
--
-- IF NOT EXISTS: safe to re-run if the step was interrupted.
-- WHERE source_session_id IS NOT NULL: NULL rows are excluded from the constraint
-- (historical entries logged without a timer session reference are unaffected).
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS
  idx_time_entries_source_session_id_unique
ON public.time_entries (source_session_id)
WHERE source_session_id IS NOT NULL;


-- ═══════════════════════════════════════════════════════════════════════════════
-- STEP 3 — Verify the index exists
-- Run this after step 2 completes.
--
-- Expected: one row.
-- indexname  = idx_time_entries_source_session_id_unique
-- indexdef   contains UNIQUE and WHERE (source_session_id IS NOT NULL)
--
-- If zero rows: step 2 failed silently. Do not install the RPC yet.
-- ═══════════════════════════════════════════════════════════════════════════════

SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'time_entries'
  AND indexname = 'idx_time_entries_source_session_id_unique';
