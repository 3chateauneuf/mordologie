-- Mordologie
-- V1 pragmatic schema
-- PostgreSQL-oriented SQL
--
-- Principles
-- - time_entries is the central fact table
-- - denormalized labels are copied at write time for export simplicity
-- - duration_minutes is the source of truth
-- - duration_hours is optional and may be derived by the application

create table users (
  user_id text primary key
    check (user_id ~ '^USR-[0-9]{3}$'),
  user_name text not null,
  email text unique,
  auth_user_id uuid unique,
  role text not null
    check (role in ('cadre', 'manager', 'admin')),
  team_name text not null,
  managed_team_name text,
  manager_user_id text references users(user_id)
    check (manager_user_id is null or manager_user_id ~ '^USR-[0-9]{3}$'),
  weekly_capacity_hours numeric(5,2) not null default 40.00
    check (weekly_capacity_hours > 0),
  status text not null default 'active'
    check (status in ('active', 'inactive')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table categories (
  activity_category_id text primary key
    check (activity_category_id ~ '^CAT-[0-9]{3}$'),
  activity_category_label text not null,
  kpi_category_label text not null,
  color_hex text
    check (color_hex is null or color_hex ~ '^#[0-9A-Fa-f]{6}$'),
  team_name text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table projects (
  project_id text primary key
    check (project_id ~ '^PRJ-[0-9]{3}$'),
  project_name text not null,
  client_name text not null,
  status text not null default 'active'
    check (status in ('active', 'completed', 'archived')),
  default_activity_category_id text references categories(activity_category_id),
  default_activity_category_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table time_entries (
  time_entry_id text primary key
    check (time_entry_id ~ '^TE-[0-9]{6}$'),

  source_session_id text,

  entry_date date not null,
  started_at timestamptz,
  ended_at timestamptz,

  user_id text not null references users(user_id),
  user_name text not null,
  team_name text not null,

  project_id text references projects(project_id),
  project_name text not null,
  client_name text,

  activity_category_id text references categories(activity_category_id),
  activity_category_label text,
  kpi_category_label text,

  duration_minutes integer not null
    check (duration_minutes > 0),
  duration_hours numeric(6,2),

  task_label text,
  tags_text text,
  notion_ref text,
  objective_pole text,
  objective_okr text,
  objective_kr text,
  notes text,
  source text not null
    check (source in ('quick', 'manual', 'timer')),
  status text not null default 'saved'
    check (status in ('saved', 'submitted')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table active_sessions (
  active_session_id text primary key,

  started_at timestamptz not null,
  paused_at timestamptz,
  paused_duration_ms bigint not null default 0
    check (paused_duration_ms >= 0),

  user_id text references users(user_id),
  user_name text not null,
  team_name text not null,

  project_id text references projects(project_id),
  project_name text not null,
  client_name text,

  activity_category_id text references categories(activity_category_id),
  activity_category_label text,
  kpi_category_label text,

  task_label text,
  tags_text text,
  notion_ref text,
  objective_pole text,
  objective_okr text,
  objective_kr text,
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table reprise_actions (
  subject_user_name text not null,
  memory_key text not null,
  subject_project_name text,
  action_kind text not null
    check (action_kind in ('archive', 'done')),
  actor_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (subject_user_name, memory_key)
);

create table user_ui_preferences (
  owner_user_name text not null,
  collaborator_name text not null,
  preference_key text not null
    check (preference_key in ('day_themes', 'reprises_order', 'profile_avatar')),
  scope_key text not null,
  value_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (owner_user_name, preference_key, scope_key)
);

create index idx_time_entries_entry_date on time_entries(entry_date);
create index idx_time_entries_user_id on time_entries(user_id);
create index idx_time_entries_project_id on time_entries(project_id);
create index idx_time_entries_category_id on time_entries(activity_category_id);
create index idx_time_entries_team_name on time_entries(team_name);
create index idx_time_entries_created_at on time_entries(created_at);
create index idx_time_entries_source_session_id on time_entries(source_session_id);
create index idx_time_entries_started_at on time_entries(started_at);
create index idx_users_auth_user_id on users(auth_user_id);
create index idx_users_email on users(email);
create index idx_active_sessions_user_id on active_sessions(user_id);
create index idx_active_sessions_team_name on active_sessions(team_name);
create index idx_active_sessions_started_at on active_sessions(started_at);
create index idx_active_sessions_updated_at on active_sessions(updated_at);
create index idx_reprise_actions_actor_name on reprise_actions(actor_name);
create index idx_reprise_actions_updated_at on reprise_actions(updated_at);
create index idx_user_ui_preferences_owner_name on user_ui_preferences(owner_user_name);
create index idx_user_ui_preferences_updated_at on user_ui_preferences(updated_at);

-- Write-time rules enforced by the application layer
--
-- time_entries.user_name              := users.user_name
-- time_entries.team_name              := users.team_name
-- time_entries.project_name           := projects.project_name
-- time_entries.client_name            := projects.client_name
-- time_entries.activity_category_label:= categories.activity_category_label
-- time_entries.kpi_category_label     := categories.kpi_category_label
--
-- projects.default_activity_category_label := categories.activity_category_label
--
-- Notes
-- - Denormalized labels are never manually entered by users.
-- - duration_hours should be derived from duration_minutes when present.
-- - source_session_id lets a running session become a historical row without losing continuity.
-- - started_at / ended_at keep the real agenda placement when it is known.
-- - tags_text stores comma-separated tags until a fuller relational model is needed.
-- - objective_* and notes keep richer context available to shared reporting.
-- - Historical time_entries should not be rewritten if source labels change later.
-- - auth_user_id is the link to Supabase Auth when multi-user access is enabled.
-- - managed_team_name can scope manager-level visibility without introducing more tables in V1.5.
-- - active_sessions is the server-side source of truth for running or paused work.
-- - reprise_actions stores which probable reprises should no longer be surfaced.
