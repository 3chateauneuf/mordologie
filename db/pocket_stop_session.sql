-- Mordologie Pocket — pocket_stop_session RPC
-- Step 2 of 2: run AFTER pocket_preflight.sql succeeds with zero duplicates.
--
-- What this file does, in order:
--   1. Creates the pocket_stop_session() function.
--   2. Revokes execute from public, grants to authenticated only.
--   3. Provides manual validation queries to run after deployment.

-- ── 1. Function ─────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.pocket_stop_session(
  p_active_session_id  text,
  p_ended_at           timestamptz,
  p_notes              text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_row              active_sessions%ROWTYPE;
  v_caller_user_id   text;
  v_caller_user_name text;
  v_user_id          text;
  v_effective_end    timestamptz;
  v_duration_ms      bigint;
  v_dur_min          integer;
  v_dur_hours        numeric(6,2);
  v_entry_date       date;
  v_te_id            text;
  v_last_num         integer;
  v_kpi_cat_label    text;
  v_err_constraint   text;
BEGIN

  -- ── A. Auth: caller must be authenticated ──────────────────────────────────
  v_caller_user_id := public.current_app_user_id();
  IF v_caller_user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'unauthenticated');
  END IF;

  -- ── B. Lock the active_session row ────────────────────────────────────────
  -- FOR UPDATE serializes concurrent stop attempts on the same session.
  -- If another transaction already deleted the row, this returns NOT FOUND.
  SELECT * INTO v_row
  FROM public.active_sessions
  WHERE active_session_id = p_active_session_id
  FOR UPDATE;

  IF NOT FOUND THEN
    -- Row is gone. Two possibilities:
    -- (a) Already stopped — a time_entry for this session exists.
    -- (b) Never existed — nothing to find.
    IF EXISTS (
      SELECT 1 FROM public.time_entries
      WHERE source_session_id = p_active_session_id
    ) THEN
      RETURN jsonb_build_object('ok', true, 'already_stopped', true);
    ELSE
      RETURN jsonb_build_object('ok', false, 'error', 'session_not_found');
    END IF;
  END IF;

  -- ── C. Ownership check ────────────────────────────────────────────────────
  -- active_sessions.user_id is nullable for pre-migration rows.
  -- Primary check: user_id equality.
  -- Fallback (user_id IS NULL): match caller's user_name instead.
  IF v_row.user_id IS NOT NULL THEN
    IF v_row.user_id != v_caller_user_id AND NOT public.is_admin() THEN
      RETURN jsonb_build_object('ok', false, 'error', 'forbidden');
    END IF;
  ELSE
    SELECT user_name INTO v_caller_user_name
    FROM public.users
    WHERE user_id = v_caller_user_id AND status = 'active'
    LIMIT 1;

    IF v_caller_user_name IS DISTINCT FROM v_row.user_name AND NOT public.is_admin() THEN
      RETURN jsonb_build_object('ok', false, 'error', 'forbidden');
    END IF;
  END IF;

  -- ── D. Compute effective end ───────────────────────────────────────────────
  -- If the session is paused, the effective end is paused_at (same as desktop).
  -- p_ended_at is used only when the session is running.
  v_effective_end := COALESCE(v_row.paused_at, p_ended_at);

  -- ── E. Validate effective end ──────────────────────────────────────────────
  IF v_effective_end IS NULL THEN
    -- Session is running and no end time was provided.
    RETURN jsonb_build_object('ok', false, 'error', 'ended_at_required');
  END IF;

  IF v_effective_end < v_row.started_at THEN
    RETURN jsonb_build_object('ok', false, 'error', 'ended_at_before_started_at');
  END IF;

  -- Allow up to 5 minutes of clock drift between client and server.
  IF v_effective_end > now() + INTERVAL '5 minutes' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'ended_at_in_future');
  END IF;

  -- ── F. Duration — exact same formula as desktop ───────────────────────────
  -- getActiveSessionDurationMs: max(effectiveEnd - start - pausedDurationMs, 0)
  -- duration_minutes: max(1, round(durationMs / 60000))
  -- duration_hours:   round(durationMs / 3600000, 2)
  v_duration_ms := GREATEST(
    (EXTRACT(EPOCH FROM (v_effective_end - v_row.started_at)) * 1000)::bigint
    - COALESCE(v_row.paused_duration_ms, 0),
    0
  );
  v_dur_min   := GREATEST(1, ROUND(v_duration_ms / 60000.0)::integer);
  v_dur_hours := ROUND(v_duration_ms / 3600000.0, 2);

  -- ── G. entry_date — UTC convention, same as desktop ───────────────────────
  -- Desktop: start.toISOString().slice(0, 10)  →  UTC date of started_at.
  -- Do NOT use local timezone here. Must match desktop convention exactly.
  v_entry_date := (v_row.started_at AT TIME ZONE 'UTC')::date;

  -- ── H. Resolve user_id for time_entries (NOT NULL) ────────────────────────
  v_user_id := v_row.user_id;
  IF v_user_id IS NULL THEN
    SELECT user_id INTO v_user_id
    FROM public.users
    WHERE user_name = v_row.user_name AND status = 'active'
    LIMIT 1;
  END IF;

  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'user_not_found');
  END IF;

  -- ── I. Resolve kpi_category_label ─────────────────────────────────────────
  -- Prefer the live reference table over the denormalized copy in active_sessions
  -- (WRITE_RULES: labels must be copied from reference tables at write time).
  IF v_row.activity_category_id IS NOT NULL THEN
    SELECT kpi_category_label INTO v_kpi_cat_label
    FROM public.categories
    WHERE activity_category_id = v_row.activity_category_id;
  END IF;
  -- Fallback: use whatever was stored in the active_session at start time.
  v_kpi_cat_label := COALESCE(v_kpi_cat_label, v_row.kpi_category_label);

  -- ── J. Generate time_entry_id ──────────────────────────────────────────────
  -- Reads MAX within this transaction. Concurrent stops of DIFFERENT sessions
  -- could collide on the PK; the exception handler distinguishes this from a
  -- source_session_id duplicate and returns 'id_collision_retry' for the caller
  -- to retry (re-calling this function will compute the next available ID).
  SELECT COALESCE(
    MAX(SUBSTRING(time_entry_id FROM 4)::integer), 0
  ) + 1 INTO v_last_num
  FROM public.time_entries
  WHERE time_entry_id ~ '^TE-[0-9]{6}$';

  v_te_id := 'TE-' || LPAD(v_last_num::text, 6, '0');

  -- ── K. Idempotency check before INSERT ────────────────────────────────────
  -- The unique index on source_session_id (created in pocket_preflight.sql)
  -- provides DB-level enforcement, but an explicit check here gives a clean
  -- already_stopped response instead of a constraint violation.
  IF EXISTS (
    SELECT 1 FROM public.time_entries
    WHERE source_session_id = p_active_session_id
  ) THEN
    -- Entry was created by a concurrent transaction between our FOR UPDATE
    -- check and this point. Treat as successfully stopped.
    RETURN jsonb_build_object('ok', true, 'already_stopped', true);
  END IF;

  -- ── L. INSERT time_entry ──────────────────────────────────────────────────
  -- source = 'timer': consistent with desktop timer-stopped entries.
  -- notes: mobile note overrides session notes if provided, else keeps original.
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
    COALESCE(NULLIF(p_notes, ''), v_row.notes),
    v_dur_min,
    v_dur_hours,
    'timer',
    'saved'
  );

  -- ── M. DELETE active_session ──────────────────────────────────────────────
  -- Runs in the same transaction as the INSERT above.
  -- If this fails (e.g., FK violation), the INSERT is rolled back too.
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

EXCEPTION WHEN unique_violation THEN
  -- Distinguish which constraint was violated.
  -- Requires PG 14+ (Supabase ≥ PG 15 ✓).
  GET STACKED DIAGNOSTICS v_err_constraint = CONSTRAINT_NAME;

  IF v_err_constraint ILIKE '%source_session_id%' THEN
    -- A concurrent transaction already created a time_entry for this session.
    RETURN jsonb_build_object('ok', true, 'already_stopped', true);
  ELSE
    -- PK collision on time_entry_id: two concurrent stops of different sessions
    -- computed the same MAX+1. Caller should retry; the next call will compute
    -- the correct next ID. NOT silently masked as already_stopped.
    RETURN jsonb_build_object('ok', false, 'error', 'id_collision_retry');
  END IF;

END;
$$;

-- ── 2. Permissions ───────────────────────────────────────────────────────────
-- Remove default public execute grant (PostgreSQL grants execute to PUBLIC
-- on new functions by default).
-- Grant only to authenticated role (Supabase maps logged-in users here).

REVOKE EXECUTE ON FUNCTION public.pocket_stop_session(text, timestamptz, text)
  FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.pocket_stop_session(text, timestamptz, text)
  TO authenticated;

-- ── 3. Manual validation queries ─────────────────────────────────────────────
-- Run these after deploying the function to verify correct behavior.
-- Replace '<active_session_id>' with a real ID from your active_sessions table.

-- 3a. Inspect current active sessions (find a real ID to test with):
--
-- SELECT active_session_id, user_name, project_name, started_at, paused_at
-- FROM active_sessions
-- ORDER BY started_at DESC
-- LIMIT 5;

-- 3b. Dry-run test — stop a session at current time:
--
-- SELECT pocket_stop_session(
--   '<active_session_id>',
--   now(),
--   'Test depuis pocket_stop_session'
-- );

-- 3c. Verify the time_entry was created:
--
-- SELECT time_entry_id, source_session_id, started_at, ended_at,
--        duration_minutes, source, notes, entry_date
-- FROM time_entries
-- WHERE source_session_id = '<active_session_id>';

-- 3d. Verify active_session was deleted:
--
-- SELECT * FROM active_sessions
-- WHERE active_session_id = '<active_session_id>';
-- Expected: zero rows.

-- 3e. Idempotency test — call again with the same session_id:
--
-- SELECT pocket_stop_session('<active_session_id>', now(), null);
-- Expected: {"ok": true, "already_stopped": true}

-- 3f. Forbidden test — attempt to stop another user's session
--     (requires being logged in as a different user):
--
-- SELECT pocket_stop_session('<other_users_active_session_id>', now(), null);
-- Expected: {"ok": false, "error": "forbidden"}

-- 3g. Future date test:
--
-- SELECT pocket_stop_session(
--   '<active_session_id>',
--   now() + interval '1 hour',
--   null
-- );
-- Expected: {"ok": false, "error": "ended_at_in_future"}
