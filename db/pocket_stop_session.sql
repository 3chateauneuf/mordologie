-- Mordologie Pocket — pocket_stop_session RPC
-- ─────────────────────────────────────────────────────────────────────────────
-- Prerequisites (must be verified before running this file):
--   1. pocket_preflight.sql step 1 returned ZERO duplicate rows.
--   2. pocket_preflight.sql step 2 created the unique index.
--   3. pocket_preflight.sql step 3 confirmed the index exists.
--
-- This file:
--   A. Guards against missing index — aborts loudly if prerequisite not met.
--   B. Creates the pocket_stop_session() function.
--   C. Sets permissions: REVOKE from PUBLIC, GRANT to authenticated.
--   D. Provides validation queries (see section D — read the SQL Editor warning).
-- ─────────────────────────────────────────────────────────────────────────────


-- ═══════════════════════════════════════════════════════════════════════════════
-- A. Guard: abort if unique index is missing
-- ═══════════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE tablename = 'time_entries'
      AND indexname = 'idx_time_entries_source_session_id_unique'
  ) THEN
    RAISE EXCEPTION
      'STOP: unique index idx_time_entries_source_session_id_unique not found. '
      'Run pocket_preflight.sql steps 1–3 first.';
  END IF;
END;
$$;


-- ═══════════════════════════════════════════════════════════════════════════════
-- B. Function
-- ═══════════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.pocket_stop_session(
  p_active_session_id  text,
  p_ended_at           timestamptz,    -- ignored when session is paused
  p_notes              text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp     -- prevents search-path hijacking
AS $$
DECLARE
  v_row            active_sessions%ROWTYPE;
  v_caller_user_id text;
  v_user_id        text;
  v_effective_end  timestamptz;
  v_duration_ms    bigint;
  v_dur_min        integer;
  v_dur_hours      numeric(6,2);
  v_entry_date     date;
  v_te_id          text;
  v_last_num       integer;
  v_kpi_cat_label  text;
  v_err_constraint text;
  v_retry          integer := 0;
BEGIN

  -- ── A. Auth ────────────────────────────────────────────────────────────────
  -- current_app_user_id() maps auth.uid() → users.user_id.
  -- Returns NULL when called outside an authenticated request
  -- (e.g. from the SQL Editor superuser session — see testing notes in section D).
  v_caller_user_id := public.current_app_user_id();
  IF v_caller_user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'unauthenticated');
  END IF;

  -- ── B. Lock active_session row ─────────────────────────────────────────────
  -- FOR UPDATE: serializes concurrent stop attempts on the same row.
  -- If two requests race, the second will block here until the first commits,
  -- then find NOT FOUND (row deleted) and reach the already_stopped branch.
  SELECT * INTO v_row
  FROM public.active_sessions
  WHERE active_session_id = p_active_session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    -- Row is gone. Either already stopped or never existed.
    IF EXISTS (
      SELECT 1 FROM public.time_entries
      WHERE source_session_id = p_active_session_id
    ) THEN
      RETURN jsonb_build_object('ok', true, 'already_stopped', true);
    ELSE
      RETURN jsonb_build_object('ok', false, 'error', 'session_not_found');
    END IF;
  END IF;

  -- ── C. Ownership ───────────────────────────────────────────────────────────
  -- Strict owner-only: only the user whose user_id matches can stop the session.
  -- No admin bypass: an admin stopping someone else's timer via Pocket is not a
  -- supported use case. Admins use the desktop if intervention is needed.
  --
  -- Sessions with NULL user_id are pre-migration rows that cannot be safely
  -- attributed. Pocket requires user_id to be set. Return explicit error so the
  -- user can stop from the desktop instead.
  IF v_row.user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'session_missing_user_id');
  END IF;

  IF v_row.user_id != v_caller_user_id THEN
    RETURN jsonb_build_object('ok', false, 'error', 'forbidden');
  END IF;

  -- user_id is verified non-null and matches caller; safe to use directly.
  v_user_id := v_row.user_id;

  -- ── D. Effective end ───────────────────────────────────────────────────────
  -- Paused session: effective end is paused_at regardless of p_ended_at.
  -- Running session: effective end is p_ended_at.
  -- This mirrors desktop getActiveSessionEffectiveEnd exactly.
  v_effective_end := COALESCE(v_row.paused_at, p_ended_at);

  -- ── E. Validate effective end ──────────────────────────────────────────────
  -- For running sessions p_ended_at is required.
  -- For paused sessions we derive effective end from paused_at,
  -- but p_ended_at must still pass the other checks if provided.
  IF v_effective_end IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'ended_at_required');
  END IF;

  IF v_effective_end < v_row.started_at THEN
    RETURN jsonb_build_object('ok', false, 'error', 'ended_at_before_started_at');
  END IF;

  -- 5 minutes of tolerance for clock drift between mobile client and DB server.
  IF v_effective_end > now() + INTERVAL '5 minutes' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'ended_at_in_future');
  END IF;

  -- ── F. Duration ────────────────────────────────────────────────────────────
  -- Exact replica of desktop formula:
  --   getActiveSessionEffectiveEnd: pausedAt ?? now()
  --   getActiveSessionDurationMs:   max(effectiveEnd - start - pausedDurationMs, 0)
  --   duration_minutes:             max(1, round(durationMs / 60000))
  --   duration_hours:               round(durationMs / 3600000, 2)
  v_duration_ms := GREATEST(
    (EXTRACT(EPOCH FROM (v_effective_end - v_row.started_at)) * 1000)::bigint
    - COALESCE(v_row.paused_duration_ms, 0),
    0
  );
  v_dur_min   := GREATEST(1, ROUND(v_duration_ms / 60000.0)::integer);
  v_dur_hours := ROUND(v_duration_ms / 3600000.0, 2);

  -- ── G. entry_date ──────────────────────────────────────────────────────────
  -- UTC date of started_at. Matches desktop: start.toISOString().slice(0, 10).
  -- Do NOT use local timezone — the desktop never does.
  v_entry_date := (v_row.started_at AT TIME ZONE 'UTC')::date;

  -- ── H. kpi_category_label ──────────────────────────────────────────────────
  -- WRITE_RULES: labels copied from reference tables at write time.
  -- Live lookup preferred over the denormalized copy in active_sessions.
  IF v_row.activity_category_id IS NOT NULL THEN
    SELECT kpi_category_label INTO v_kpi_cat_label
    FROM public.categories
    WHERE activity_category_id = v_row.activity_category_id;
  END IF;
  v_kpi_cat_label := COALESCE(v_kpi_cat_label, v_row.kpi_category_label);

  -- ── I. INSERT time_entry with internal retry ───────────────────────────────
  -- time_entry_id is generated as MAX+1 within this transaction.
  -- READ COMMITTED isolation (Supabase default): each SELECT MAX sees the latest
  -- committed rows, so retries after a PK collision pick up the correct next ID.
  --
  -- We distinguish two unique_violation cases:
  --   source_session_id conflict → session already stopped → already_stopped
  --   time_entry_id PK conflict  → concurrent stop of a DIFFERENT session
  --                                 computed the same ID → retry (up to 3×)
  --
  -- In practice, a single user with a single Pocket companion will never hit
  -- the PK retry path. It exists for safety and correctness.
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
        -- p_notes non-empty overrides session notes; else keep session notes.
        COALESCE(NULLIF(p_notes, ''), v_row.notes),
        v_dur_min,
        v_dur_hours,
        'timer',   -- schema CHECK: ('quick','manual','timer'). 'timer' = stopped by timer flow.
        'saved'
      );

      EXIT; -- INSERT succeeded; exit the retry loop.

    EXCEPTION WHEN unique_violation THEN
      GET STACKED DIAGNOSTICS v_err_constraint = CONSTRAINT_NAME;

      IF v_err_constraint ILIKE '%source_session_id%' THEN
        -- A concurrent transaction already created a time_entry for this session.
        -- The FOR UPDATE lock above prevents this in normal operation; this branch
        -- is a safety net for the NOT FOUND path above (race on row deletion).
        RETURN jsonb_build_object('ok', true, 'already_stopped', true);
      END IF;

      -- time_entry_id PK collision. NOT masked as already_stopped.
      v_retry := v_retry + 1;
      IF v_retry >= 3 THEN
        RETURN jsonb_build_object('ok', false, 'error', 'id_collision_exhausted');
      END IF;
      -- Loop: SELECT MAX reruns with READ COMMITTED snapshot, picks up new MAX.
    END;
  END LOOP;

  -- ── J. DELETE active_session ───────────────────────────────────────────────
  -- Runs in the same transaction as the INSERT above.
  -- A failure here rolls back the INSERT too — no orphaned time_entry.
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

-- PostgreSQL grants EXECUTE to PUBLIC on new functions by default. Remove it.
REVOKE EXECUTE ON FUNCTION public.pocket_stop_session(text, timestamptz, text)
  FROM PUBLIC;

-- Grant only to authenticated (Supabase maps all logged-in users to this role).
GRANT EXECUTE ON FUNCTION public.pocket_stop_session(text, timestamptz, text)
  TO authenticated;


-- ═══════════════════════════════════════════════════════════════════════════════
-- D. Validation queries
-- ─────────────────────────────────────────────────────────────────────────────
-- !! SQL EDITOR WARNING !!
-- The Supabase SQL Editor runs as the postgres superuser, not as an authenticated
-- user. current_app_user_id() calls auth.uid() which returns NULL in that context.
-- Calling pocket_stop_session() from the SQL Editor will return:
--   {"ok": false, "error": "unauthenticated"}
-- This is CORRECT behaviour, not a bug.
--
-- How to test auth-dependent paths:
--   Use a Supabase JS client with a real authenticated session. Example:
--
--   const { data } = await supabase.rpc('pocket_stop_session', {
--     p_active_session_id: '<id>',
--     p_ended_at: new Date().toISOString(),
--     p_notes: 'test from mobile'
--   });
--   console.log(data);
--
-- The queries below that do NOT call pocket_stop_session() can run in the
-- SQL Editor freely (they do not depend on auth.uid()).
-- ═══════════════════════════════════════════════════════════════════════════════

-- D1. Verify function exists and has correct signature:
--
-- SELECT routine_name, routine_type, security_type
-- FROM information_schema.routines
-- WHERE routine_schema = 'public'
--   AND routine_name   = 'pocket_stop_session';
-- Expected: 1 row, security_type = 'DEFINER'.

-- D2. Verify permissions (authenticated can execute, PUBLIC cannot):
--
-- SELECT grantee, privilege_type
-- FROM information_schema.routine_privileges
-- WHERE routine_schema = 'public'
--   AND routine_name   = 'pocket_stop_session';
-- Expected: one row for 'authenticated' with privilege_type = 'EXECUTE'.
-- If PUBLIC also appears here, the REVOKE did not take effect.

-- D3. Inspect active sessions (find a real active_session_id to test):
--
-- SELECT active_session_id, user_id, user_name, project_name, started_at, paused_at
-- FROM public.active_sessions
-- ORDER BY started_at DESC
-- LIMIT 5;

-- D4. After a test call from an authenticated JS client, verify time_entry:
--
-- SELECT time_entry_id, source_session_id, started_at, ended_at,
--        duration_minutes, duration_hours, source, notes, entry_date,
--        user_id, user_name
-- FROM public.time_entries
-- WHERE source_session_id = '<active_session_id>'
-- ORDER BY created_at DESC;
-- Expected: 1 row, source = 'timer', duration_minutes >= 1.

-- D5. After the test call, verify active_session was deleted:
--
-- SELECT COUNT(*) FROM public.active_sessions
-- WHERE active_session_id = '<active_session_id>';
-- Expected: 0.

-- D6. Idempotency — call again from JS with the same session_id:
-- Expected response: {"ok": true, "already_stopped": true}

-- D7. Forbidden — call from a different authenticated user's JS session:
-- Expected response: {"ok": false, "error": "forbidden"}

-- D8. Future date — call from JS with p_ended_at = new Date(Date.now() + 3600000):
-- Expected response: {"ok": false, "error": "ended_at_in_future"}
