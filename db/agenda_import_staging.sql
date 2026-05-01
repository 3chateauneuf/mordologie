create table if not exists public.agenda_import_staging (
  agenda_import_id bigint generated always as identity primary key,
  import_batch text not null,
  source_kind text not null default 'calendar_capture',
  source_label text,

  user_name text not null,
  team_name text,

  entry_date date not null,
  start_time time not null,
  end_time time,

  title text not null,
  project_name text,
  client_name text,
  category_label text,
  notes text,

  needs_review boolean not null default false,
  review_reason text,
  imported_at timestamptz not null default now()
);

create index if not exists idx_agenda_import_staging_batch
  on public.agenda_import_staging(import_batch);

create index if not exists idx_agenda_import_staging_user_date
  on public.agenda_import_staging(user_name, entry_date);

comment on table public.agenda_import_staging is
  'Zone de staging pour importer des captures d agenda avant attribution complete vers time_entries.';
