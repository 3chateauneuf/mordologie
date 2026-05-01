create table if not exists public.session_audit_log (
  session_audit_log_id bigint generated always as identity primary key,
  session_id text not null,
  change_source text not null,
  actor_name text not null,
  field_label text not null,
  old_value text,
  new_value text,
  created_at timestamptz not null default now()
);

create index if not exists idx_session_audit_log_session_id
  on public.session_audit_log(session_id);

create index if not exists idx_session_audit_log_created_at
  on public.session_audit_log(created_at desc);

alter table public.session_audit_log enable row level security;

drop policy if exists session_audit_log_anon_insert on public.session_audit_log;
create policy session_audit_log_anon_insert
on public.session_audit_log
for insert
to anon
with check (true);

drop policy if exists session_audit_log_anon_select on public.session_audit_log;
create policy session_audit_log_anon_select
on public.session_audit_log
for select
to anon
using (true);
