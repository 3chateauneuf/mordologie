-- Mordologie Pocket — Preflight
-- Step 1 of 2: run this BEFORE pocket_stop_session.sql
--
-- Purpose:
--   1. Detect any duplicate source_session_id values in time_entries.
--   2. If the query below returns zero rows, create the partial unique index.
--   3. If it returns any rows, DO NOT proceed — investigate duplicates first.
--
-- Run order: execute this file, verify output, then run pocket_stop_session.sql.

-- ── 1. Duplicate check ──────────────────────────────────────────────────────
--
-- Expected result: zero rows.
-- If any rows appear, stop. Resolve duplicates manually before adding the index.

SELECT
  source_session_id,
  COUNT(*)          AS occurrences,
  array_agg(time_entry_id ORDER BY created_at) AS te_ids
FROM time_entries
WHERE source_session_id IS NOT NULL
GROUP BY source_session_id
HAVING COUNT(*) > 1;

-- ── 2. Partial unique index ──────────────────────────────────────────────────
--
-- Run only after confirming the query above returned 0 rows.
-- CONCURRENTLY: does not lock the table for reads/writes during build.
-- IF NOT EXISTS: safe to re-run.
-- WHERE source_session_id IS NOT NULL: does not constrain rows where it is null
-- (historical entries without a session reference remain untouched).

CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS
  idx_time_entries_source_session_id_unique
ON public.time_entries (source_session_id)
WHERE source_session_id IS NOT NULL;

-- ── 3. Verify index was created ──────────────────────────────────────────────

SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename  = 'time_entries'
  AND indexname  = 'idx_time_entries_source_session_id_unique';

-- Expected: one row showing a UNIQUE index with WHERE clause.
