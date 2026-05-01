begin;

create table if not exists public.user_ui_preferences (
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

create index if not exists idx_user_ui_preferences_owner_name
  on public.user_ui_preferences(owner_user_name);

create index if not exists idx_user_ui_preferences_updated_at
  on public.user_ui_preferences(updated_at desc);

alter table public.user_ui_preferences enable row level security;

drop policy if exists user_ui_preferences_anon_read_shared on public.user_ui_preferences;
create policy user_ui_preferences_anon_read_shared
on public.user_ui_preferences
for select
to anon
using (true);

drop policy if exists user_ui_preferences_anon_insert_shared on public.user_ui_preferences;
create policy user_ui_preferences_anon_insert_shared
on public.user_ui_preferences
for insert
to anon
with check (true);

drop policy if exists user_ui_preferences_anon_update_shared on public.user_ui_preferences;
create policy user_ui_preferences_anon_update_shared
on public.user_ui_preferences
for update
to anon
using (true)
with check (true);

commit;
