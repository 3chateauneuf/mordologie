-- Mordologie Pocket — Preflight
-- ─────────────────────────────────────────────────────────────────────────────
-- EXECUTION RULES — read before running anything.
--
-- This file contains THREE independent statements.
-- Each must be run in isolation, in order, with a manual stop between them.
-- Do NOT select-all and execute the entire file at once.
--
-- ORDER:
--   Step 1 — run the duplicate SELECT alone.  Read the result.  Stop.
--   Step 2 — only if step 1 returned ZERO rows: run CREATE UNIQUE INDEX alone.
--   Step 3 — run the deep verification query.  Confirm all four conditions.
-- ─────────────────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════════════════════
-- STEP 1 — Duplicate check
-- Run this statement alone.
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
-- !! ONLY RUN if step 1 returned ZERO rows !!
--
-- CRITICAL: CREATE INDEX CONCURRENTLY cannot run inside an explicit transaction
-- block. In the Supabase SQL Editor, run this as the ONLY selected statement.
-- Do not wrap in BEGIN/COMMIT. Do not select it together with other statements.
--
-- IF NOT EXISTS: safe to re-run if the step was interrupted.
-- WHERE source_session_id IS NOT NULL: excludes historical rows without a session
-- reference — those remain unconstrained and are not affected.
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS
  idx_time_entries_source_session_id_unique
ON public.time_entries (source_session_id)
WHERE source_session_id IS NOT NULL;


-- ═══════════════════════════════════════════════════════════════════════════════
-- STEP 3 — Deep index verification
-- Run after step 2 completes.
--
-- Expected result: ONE row where ALL of the following are true:
--   indisunique = true    → it is a UNIQUE index
--   indisvalid  = true    → the CONCURRENTLY build completed without error
--   indisready  = true    → the index is active and enforced
--   predicate             → references 'source_session_id' and 'NOT NULL'
--
-- If zero rows: the index does not exist. Repeat step 2.
-- If any boolean is false: the index is unusable. DROP it and repeat step 2.
-- ═══════════════════════════════════════════════════════════════════════════════

SELECT
  ic.relname                                    AS index_name,
  i.indisunique                                 AS is_unique,
  i.indisvalid                                  AS is_valid,
  i.indisready                                  AS is_ready,
  pg_get_expr(i.indpred, i.indrelid)            AS predicate
FROM pg_index     i
JOIN pg_class     ic ON ic.oid = i.indexrelid
JOIN pg_class     tc ON tc.oid = i.indrelid
JOIN pg_namespace n  ON n.oid  = tc.relnamespace
WHERE n.nspname  = 'public'
  AND tc.relname = 'time_entries'
  AND ic.relname = 'idx_time_entries_source_session_id_unique';
