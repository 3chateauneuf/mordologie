-- Mordologie
-- V1.5 auth + roles + row level security
--
-- Applies a simple access model:
-- - cadre: own data only
-- - manager: own data + team perimeter
-- - admin: full access

begin;

alter table public.users
  add column if not exists email text unique,
  add column if not exists auth_user_id uuid unique,
  add column if not exists managed_team_name text;

alter table public.users
  drop constraint if exists users_role_check;

alter table public.users
  add constraint users_role_check
    check (role in ('cadre', 'manager', 'admin'));

create index if not exists idx_users_auth_user_id on public.users(auth_user_id);
create index if not exists idx_users_email on public.users(email);

create or replace function public.current_app_user_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select u.user_id
  from public.users u
  where u.auth_user_id = auth.uid()
    and u.status = 'active'
  limit 1
$$;

create or replace function public.current_app_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select u.role
      from public.users u
      where u.auth_user_id = auth.uid()
        and u.status = 'active'
      limit 1
    ),
    'cadre'
  )
$$;

create or replace function public.current_app_team_name()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select u.team_name
  from public.users u
  where u.auth_user_id = auth.uid()
    and u.status = 'active'
  limit 1
$$;

create or replace function public.current_managed_team_name()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(u.managed_team_name, u.team_name)
  from public.users u
  where u.auth_user_id = auth.uid()
    and u.status = 'active'
  limit 1
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() = 'admin'
$$;

create or replace function public.is_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_app_role() = 'manager'
$$;

alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.categories enable row level security;
alter table public.time_entries enable row level security;

drop policy if exists users_self_or_scope_select on public.users;
create policy users_self_or_scope_select
on public.users
for select
to authenticated
using (
  public.is_admin()
  or user_id = public.current_app_user_id()
  or (
    public.is_manager()
    and team_name = public.current_managed_team_name()
  )
);

drop policy if exists users_admin_manage on public.users;
create policy users_admin_manage
on public.users
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists projects_authenticated_read on public.projects;
create policy projects_authenticated_read
on public.projects
for select
to authenticated
using (public.current_app_user_id() is not null);

drop policy if exists projects_admin_manage on public.projects;
create policy projects_admin_manage
on public.projects
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists categories_authenticated_read on public.categories;
create policy categories_authenticated_read
on public.categories
for select
to authenticated
using (public.current_app_user_id() is not null);

drop policy if exists categories_admin_manage on public.categories;
create policy categories_admin_manage
on public.categories
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists time_entries_scope_select on public.time_entries;
create policy time_entries_scope_select
on public.time_entries
for select
to authenticated
using (
  public.is_admin()
  or user_id = public.current_app_user_id()
  or (
    public.is_manager()
    and team_name = public.current_managed_team_name()
  )
);

drop policy if exists time_entries_self_write on public.time_entries;
create policy time_entries_self_write
on public.time_entries
for insert
to authenticated
with check (
  public.is_admin()
  or user_id = public.current_app_user_id()
);

drop policy if exists time_entries_self_update on public.time_entries;
create policy time_entries_self_update
on public.time_entries
for update
to authenticated
using (
  public.is_admin()
  or user_id = public.current_app_user_id()
)
with check (
  public.is_admin()
  or user_id = public.current_app_user_id()
);

drop policy if exists time_entries_admin_delete on public.time_entries;
create policy time_entries_admin_delete
on public.time_entries
for delete
to authenticated
using (public.is_admin());

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'active_sessions'
  ) then
    execute 'alter table public.active_sessions enable row level security';

    execute 'drop policy if exists active_sessions_scope_select on public.active_sessions';
    execute $policy$
      create policy active_sessions_scope_select
      on public.active_sessions
      for select
      to authenticated
      using (
        public.is_admin()
        or user_id = public.current_app_user_id()
        or (
          public.is_manager()
          and team_name = public.current_managed_team_name()
        )
      )
    $policy$;

    execute 'drop policy if exists active_sessions_self_write on public.active_sessions';
    execute $policy$
      create policy active_sessions_self_write
      on public.active_sessions
      for insert
      to authenticated
      with check (
        public.is_admin()
        or user_id = public.current_app_user_id()
      )
    $policy$;

    execute 'drop policy if exists active_sessions_self_update on public.active_sessions';
    execute $policy$
      create policy active_sessions_self_update
      on public.active_sessions
      for update
      to authenticated
      using (
        public.is_admin()
        or user_id = public.current_app_user_id()
      )
      with check (
        public.is_admin()
        or user_id = public.current_app_user_id()
      )
    $policy$;

    execute 'drop policy if exists active_sessions_self_delete on public.active_sessions';
    execute $policy$
      create policy active_sessions_self_delete
      on public.active_sessions
      for delete
      to authenticated
      using (
        public.is_admin()
        or user_id = public.current_app_user_id()
      )
    $policy$;
  end if;
end
$$;

commit;
