-- Mordologie Pocket — pocket_stop_session RPC
-- ─────────────────────────────────────────────────────────────────────────────
-- Prerequisites (must be verified before running this file):
--   1. pocket_preflight.sql step 1 returned ZERO duplicate rows.
--   2. pocket_preflight.sql step 2 created the unique index.
--   3. pocket_preflight.sql step 3 confirmed: indisunique + indisvalid +
--      indisready = true, predicate references source_session_id IS NOT NULL.
--
-- This file:
--   A. Guard DO block — verifies index state via pg_class + pg_index before
--      creating the function. Aborts loudly on any missing condition.
--   B. Function pocket_stop_session().
--   C. Permissions: REVOKE from PUBLIC, GRANT to authenticated.
--   D. Validation queries (read the SQL Editor warning in section D first).
-- ─────────────────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════════════════════
-- A. Guard: verify index is present, unique, valid, ready, and partial
-- ═══════════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_indisunique boolean;
  v_indisvalid  boolean;
  v_indisready  boolean;
  v_predicate   text;
BEGIN
  SELECT
    i.indisunique,
    i.indisvalid,
    i.indisready,
    pg_get_expr(i.indpred, i.indrelid)
  INTO v_indisunique, v_indisvalid, v_indisready, v_predicate
  FROM pg_index     i
  JOIN pg_class     ic ON ic.oid = i.indexrelid
  JOIN pg_class     tc ON tc.oid = i.indrelid
  JOIN pg_namespace n  ON n.oid  = tc.relnamespace
  WHERE n.nspname  = 'public'
    AND tc.relname = 'time_entries'
    AND ic.relname = 'idx_time_entries_source_session_id_unique';

  IF NOT FOUND THEN
    RAISE EXCEPTION
      'STOP: index idx_time_entries_source_session_id_unique not found in schema public. '
      'Run pocket_preflight.sql steps 1–3 first.';
  END IF;

  IF NOT v_indisunique THEN
    RAISE EXCEPTION
      'STOP: index exists but indisunique = false. It is not a UNIQUE index. '
      'Drop it and recreate with CREATE UNIQUE INDEX CONCURRENTLY.';
  END IF;

  IF NOT v_indisvalid THEN
    RAISE EXCEPTION
      'STOP: index exists but indisvalid = false. '
      'The CONCURRENTLY build likely failed partway through. '
      'Drop the index (DROP INDEX CONCURRENTLY) and repeat preflight step 2.';
  END IF;

  IF NOT v_indisready THEN
    RAISE EXCEPTION
      'STOP: index exists but indisready = false. '
      'The index is not yet ready for use. Wait and re-run this guard.';
  END IF;

  IF v_predicate IS NULL THEN
    RAISE EXCEPTION
      'STOP: index has no WHERE predicate (it is not a partial index). '
      'Expected a partial index WHERE source_session_id IS NOT NULL. '
      'Drop the index and recreate it with the correct WHERE clause.';
  END IF;

  IF v_predicate NOT ILIKE '%source_session_id%'
  OR v_predicate NOT ILIKE '%not null%' THEN
    RAISE EXCEPTION
      'STOP: index predicate does not match expected WHERE source_session_id IS NOT NULL. '
      'Got: %. Drop and recreate the index.', v_predicate;
  END IF;
END;
$$;


-- ═══════════════════════════════════════════════════════════════════════════════
-- B. Function
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.pocket_stop_session(
  p_active_session_id  text,
  p_ended_at           timestamptz,    -- ignored when the session is paused
  p_notes              text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp     -- prevents search-path hijacking
AS $$
DECLARE
  v_row             active_sessions%ROWTYPE;
  v_caller_user_id  text;
  v_user_id         text;
  v_effective_end   timestamptz;
  v_duration_ms     bigint;
  v_dur_min         integer;
  v_dur_hours       numeric(6,2);
  v_entry_date      date;
  v_te_id           text;
  v_last_num        integer;
  v_kpi_cat_label   text;
  v_err_constraint  text;
  v_retry           integer := 0;
  v_orphan_cleaned  boolean := false;
  v_notes_final     text;
BEGIN

  -- ── A. Auth ────────────────────────────────────────────────────────────────
  -- current_app_user_id() maps auth.uid() → users.user_id.
  -- Returns NULL when called outside an authenticated request
  -- (SQL Editor superuser context — see section D testing notes).
  v_caller_user_id := public.current_app_user_id();
  IF v_caller_user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'unauthenticated');
  END IF;

  -- ── B. Lock active_session row ─────────────────────────────────────────────
  -- FOR UPDATE: serializes concurrent stop attempts on the same row.
  -- Second caller blocks here, then finds NOT FOUND after first commits.
  SELECT * INTO v_row
  FROM public.active_sessions
  WHERE active_session_id = p_active_session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    -- Row is gone. Either already stopped cleanly, or never existed.
    IF EXISTS (
      SELECT 1 FROM public.time_entries
      WHERE source_session_id = p_active_session_id
    ) THEN
      RETURN jsonb_build_object(
        'ok',               true,
        'already_stopped',  true,
        'cleaned_orphan_active_session', false
      );
    ELSE
      RETURN jsonb_build_object('ok', false, 'error', 'session_not_found');
    END IF;
  END IF;

  -- ── C. Ownership ───────────────────────────────────────────────────────────
  -- Strict owner-only. No admin bypass — stopping someone else's timer via
  -- Pocket is not a supported use case; admins use the desktop.
  --
  -- Sessions with NULL user_id are pre-migration rows; user_name is NOT a safe
  -- identity proof (no UNIQUE constraint). Return session_missing_user_id so
  -- the user can stop from the desktop where the session lives in localStorage.
  IF v_row.user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'session_missing_user_id');
  END IF;

  IF v_row.user_id != v_caller_user_id THEN
    RETURN jsonb_build_object('ok', false, 'error', 'forbidden');
  END IF;

  -- Ownership verified: user_id is non-null and matches caller.
  v_user_id := v_row.user_id;

  -- ── D. Effective end ───────────────────────────────────────────────────────
  -- Mirrors desktop getActiveSessionEffectiveEnd:
  --   paused  → paused_at  (p_ended_at is ignored)
  --   running → p_ended_at
  v_effective_end := COALESCE(v_row.paused_at, p_ended_at);

  -- ── E. Validate effective end ──────────────────────────────────────────────
  IF v_effective_end IS NULL THEN
    -- Session is running and caller did not provide an end time.
    RETURN jsonb_build_object('ok', false, 'error', 'ended_at_required');
  END IF;

  IF v_effective_end < v_row.started_at THEN
    RETURN jsonb_build_object('ok', false, 'error', 'ended_at_before_started_at');
  END IF;

  -- 5 minutes tolerance for clock drift between mobile client and DB server.
  IF v_effective_end > now() + INTERVAL '5 minutes' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'ended_at_in_future');
  END IF;

  -- ── F. Duration ────────────────────────────────────────────────────────────
  -- Exact replica of desktop formula:
  --   effectiveEnd   = paused_at  if paused,  else  chosen end
  --   durationMs     = max(effectiveEnd − started_at − paused_duration_ms, 0)
  --   duration_min   = max(1, round(durationMs / 60000))
  --   duration_hours = round(durationMs / 3600000, 2)
  v_duration_ms := GREATEST(
    (EXTRACT(EPOCH FROM (v_effective_end - v_row.started_at)) * 1000)::bigint
    - COALESCE(v_row.paused_duration_ms, 0),
    0
  );
  v_dur_min   := GREATEST(1, ROUND(v_duration_ms / 60000.0)::integer);
  v_dur_hours := ROUND(v_duration_ms / 3600000.0, 2);

  -- ── G. entry_date ──────────────────────────────────────────────────────────
  -- UTC date of started_at. Matches desktop: start.toISOString().slice(0, 10).
  v_entry_date := (v_row.started_at AT TIME ZONE 'UTC')::date;

  -- ── H. kpi_category_label ──────────────────────────────────────────────────
  -- WRITE_RULES: resolve from reference table at write time.
  IF v_row.activity_category_id IS NOT NULL THEN
    SELECT kpi_category_label INTO v_kpi_cat_label
    FROM public.categories
    WHERE activity_category_id = v_row.activity_category_id;
  END IF;
  v_kpi_cat_label := COALESCE(v_kpi_cat_label, v_row.kpi_category_label);

  -- ── I. Notes ───────────────────────────────────────────────────────────────
  -- Three cases:
  --   p_notes non-empty + session notes non-empty → append (session || \n || mobile)
  --   p_notes non-empty + no session notes        → use p_notes
  --   p_notes empty or null                       → keep session notes as-is
  v_notes_final := CASE
    WHEN NULLIF(p_notes, '') IS NOT NULL AND NULLIF(v_row.notes, '') IS NOT NULL
      THEN v_row.notes || E'\n' || p_notes
    WHEN NULLIF(p_notes, '') IS NOT NULL
      THEN p_notes
    ELSE
      v_row.notes
  END;

  -- ── J. INSERT time_entry — with internal TE-ID retry ──────────────────────
  -- time_entry_id generated as MAX+1 within transaction.
  -- READ COMMITTED (Supabase default): each SELECT MAX in the loop sees fresh
  -- committed data, so retries after a PK collision get the correct next ID.
  --
  -- Two unique_violation cases inside the nested BEGIN/EXCEPTION:
  --
  --   source_session_id conflict:
  --     A concurrent transaction already created the time_entry. The FOR UPDATE
  --     lock above prevents this in normal operation; this is a safety net.
  --     We also attempt to clean up the orphaned active_session row (if it
  --     survived somehow) since ownership has already been verified.
  --
  --   time_entry_id PK conflict:
  --     Two concurrent stops of DIFFERENT sessions computed the same MAX+1.
  --     NOT masked as already_stopped. Retry up to 3 times; fail explicitly.
  LOOP
    SELECT COALESCE(
      MAX(SUBSTRING(time_entry_id FROM 4)::integer), 0
    ) + 1 INTO v_last_num
    FROM public.time_entries
    WHERE time_entry_id ~ '^TE-[0-9]{6}$';

    v_te_id := 'TE-' || LPAD(v_last_num::text, 6, '0');

    BEGIN
      INSERT INTO public.time_entries (
        time_entry_id,
        source_session_id,
        entry_date,
        started_at,
        ended_at,
        user_id,
        user_name,
        team_name,
        project_id,
        project_name,
        client_name,
        activity_category_id,
        activity_category_label,
        kpi_category_label,
        task_label,
        tags_text,
        notion_ref,
        objective_pole,
        objective_okr,
        objective_kr,
        notes,
        duration_minutes,
        duration_hours,
        source,
        status
      ) VALUES (
        v_te_id,
        p_active_session_id,
        v_entry_date,
        v_row.started_at,
        v_effective_end,
        v_user_id,
        v_row.user_name,
        v_row.team_name,
        v_row.project_id,
        v_row.project_name,
        v_row.client_name,
        v_row.activity_category_id,
        v_row.activity_category_label,
        v_kpi_cat_label,
        v_row.task_label,
        v_row.tags_text,
        v_row.notion_ref,
        v_row.objective_pole,
        v_row.objective_okr,
        v_row.objective_kr,
        v_notes_final,
        v_dur_min,
        v_dur_hours,
        'timer',   -- schema CHECK: ('quick','manual','timer')
        'saved'
      );

      EXIT; -- INSERT succeeded.

    EXCEPTION WHEN unique_violation THEN
      GET STACKED DIAGNOSTICS v_err_constraint = CONSTRAINT_NAME;

      IF v_err_constraint ILIKE '%source_session_id%' THEN
        -- time_entry for this session already exists (orphan scenario).
        -- The nested block rolls back the failed INSERT, but the outer
        -- transaction is still alive. We can safely attempt cleanup:
        -- if active_sessions still has this row (ownership already verified),
        -- delete it so it stops appearing as an active session on all clients.
        DELETE FROM public.active_sessions
        WHERE active_session_id = p_active_session_id
          AND user_id = v_caller_user_id;

        v_orphan_cleaned := FOUND;  -- true if the DELETE removed a row

        RETURN jsonb_build_object(
          'ok',                           true,
          'already_stopped',              true,
          'cleaned_orphan_active_session', v_orphan_cleaned
        );
      END IF;

      -- time_entry_id PK collision. Retry up to 3 times.
      v_retry := v_retry + 1;
      IF v_retry >= 3 THEN
        RETURN jsonb_build_object('ok', false, 'error', 'id_collision_exhausted');
      END IF;
      -- Continue loop: SELECT MAX will see the newly committed row.
    END;
  END LOOP;

  -- ── K. DELETE active_session ───────────────────────────────────────────────
  -- Same transaction as the INSERT above. If this fails, INSERT is rolled back.
  DELETE FROM public.active_sessions
  WHERE active_session_id = p_active_session_id;

  RETURN jsonb_build_object(
    'ok',               true,
    'already_stopped',  false,
    'time_entry_id',    v_te_id,
    'duration_minutes', v_dur_min,
    'duration_hours',   v_dur_hours,
    'entry_date',       v_entry_date::text,
    'started_at',       v_row.started_at,
    'ended_at',         v_effective_end
  );

END;
$$;


-- ═══════════════════════════════════════════════════════════════════════════════
-- C. Permissions
-- ═══════════════════════════════════════════════════════════════════════════════

REVOKE EXECUTE ON FUNCTION public.pocket_stop_session(text, timestamptz, text)
  FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.pocket_stop_session(text, timestamptz, text)
  TO authenticated;


-- ═══════════════════════════════════════════════════════════════════════════════
-- D. Validation queries
-- ─────────────────────────────────────────────────────────────────────────────
-- !! SQL EDITOR WARNING !!
-- The Supabase SQL Editor runs as the postgres superuser, NOT as an authenticated
-- user. auth.uid() returns NULL in that context. Any call to pocket_stop_session()
-- from the SQL Editor will return {"ok": false, "error": "unauthenticated"}.
-- This is CORRECT — not a bug.
--
-- Queries D1–D3 do not call the function and run fine in the SQL Editor.
-- Queries D4–D9 must be run from an authenticated JS client (see snippet below).
--
-- JS test snippet:
--   const { data, error } = await supabase.rpc('pocket_stop_session', {
--     p_active_session_id: '<id>',
--     p_ended_at: new Date().toISOString(),
--     p_notes: 'test depuis pocket'
--   });
--   console.log(data, error);
-- ═══════════════════════════════════════════════════════════════════════════════

-- D1. Verify function signature and security mode (SQL Editor OK):
--
-- SELECT routine_name, security_type
-- FROM information_schema.routines
-- WHERE routine_schema = 'public'
--   AND routine_name   = 'pocket_stop_session';
-- Expected: 1 row, security_type = 'DEFINER'.

-- D2. Verify permissions (SQL Editor OK):
--
-- SELECT grantee, privilege_type
-- FROM information_schema.routine_privileges
-- WHERE routine_schema = 'public'
--   AND routine_name   = 'pocket_stop_session';
-- Expected: exactly one row — grantee = 'authenticated', privilege_type = 'EXECUTE'.
-- If PUBLIC also appears: the REVOKE did not take effect.

-- D3. Find a real active session to test with (SQL Editor OK):
--
-- SELECT active_session_id, user_id, user_name, project_name, started_at, paused_at
-- FROM public.active_sessions
-- ORDER BY started_at DESC
-- LIMIT 5;

-- D4. Happy path — stop own session at now() (requires JS authenticated client):
-- Expected: {"ok": true, "already_stopped": false, "time_entry_id": "TE-...", ...}

-- D5. Verify time_entry was created (SQL Editor OK after D4):
--
-- SELECT time_entry_id, source_session_id, started_at, ended_at,
--        duration_minutes, duration_hours, source, notes, entry_date, user_id
-- FROM public.time_entries
-- WHERE source_session_id = '<active_session_id>';
-- Expected: 1 row, source = 'timer', duration_minutes >= 1.

-- D6. Verify active_session was deleted (SQL Editor OK after D4):
--
-- SELECT COUNT(*) FROM public.active_sessions
-- WHERE active_session_id = '<active_session_id>';
-- Expected: 0.

-- D7. Idempotency — call again from JS with same session_id:
-- Expected: {"ok": true, "already_stopped": true, "cleaned_orphan_active_session": false}

-- D8. Forbidden — call from a different authenticated user's JS session:
-- Expected: {"ok": false, "error": "forbidden"}

-- D9. Future date — p_ended_at = new Date(Date.now() + 3_600_000).toISOString():
-- Expected: {"ok": false, "error": "ended_at_in_future"}

-- D10. Notes append test — start a fresh session, stop it with p_notes:
--   First call:  p_notes = 'nota desde móvil'
--   Check:       notes = 'nota desde móvil'  (no prior session notes)
--   If the session had notes = 'nota del desktop':
--   First call:  p_notes = 'nota desde móvil'
--   Check:       notes = 'nota del desktop\nnota desde móvil'
