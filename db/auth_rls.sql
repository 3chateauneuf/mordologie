-- Mordologie
-- V2 auth + row level security — projet mono-utilisateur
--
-- Il n'y a plus de rôles. Le seul contrôle qui subsiste est « identifié ou
-- non » : toute personne authentifiée voit et écrit tout, personne d'autre
-- n'entre. Le test est partout le même —
--   public.current_app_user_id() is not null
-- — celui que categories_authenticated_read utilisait déjà.
--
-- Idempotent : drop policy if exists / create policy partout, le fichier peut
-- être repassé en entier sans risque.
--
-- ⚠️ ORDRE D'EXÉCUTION. Faire tourner AVANT ce fichier :
--   1. db/category_requests_rls.sql  (supprime les politiques qui dépendent
--      de is_admin() / is_manager() ; sinon leur suppression ici échoue et
--      toute la transaction est annulée)
--   2. db/auth_profile_sync.sql      (le trigger d'inscription écrit encore
--      dans users.role, que ce fichier supprime en fin de course)

begin;

alter table public.users
  add column if not exists email text unique,
  add column if not exists auth_user_id uuid unique,
  add column if not exists managed_team_name text;

create index if not exists idx_users_auth_user_id on public.users(auth_user_id);
create index if not exists idx_users_email on public.users(email);

-- ─── Helpers conservés ──────────────────────────────────────────────────────
-- current_app_user_id est le pivot de tout le RLS, et sert aussi à
-- db/pocket_stop_session.sql. Les deux helpers d'équipe ne servent plus à
-- aucune politique depuis la disparition du périmètre manager ; ils restent
-- définis, la colonne qu'ils lisent existe toujours.

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

alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.categories enable row level security;
alter table public.time_entries enable row level security;

-- ─── Retrait des anciennes politiques par rôle ──────────────────────────────
-- Avant la suppression des fonctions : une politique qui référence une
-- fonction crée une dépendance, et le drop échouerait.

drop policy if exists users_self_or_scope_select on public.users;
drop policy if exists users_admin_manage on public.users;
drop policy if exists projects_admin_manage on public.projects;
drop policy if exists categories_admin_manage on public.categories;
-- Filet : normalement déjà supprimée par category_requests_rls.sql.
drop policy if exists categories_manager_manage on public.categories;
drop policy if exists time_entries_scope_select on public.time_entries;
drop policy if exists time_entries_self_write on public.time_entries;
drop policy if exists time_entries_self_update on public.time_entries;
drop policy if exists time_entries_admin_delete on public.time_entries;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'active_sessions'
  ) then
    execute 'drop policy if exists active_sessions_scope_select on public.active_sessions';
    execute 'drop policy if exists active_sessions_self_write on public.active_sessions';
    execute 'drop policy if exists active_sessions_self_update on public.active_sessions';
    execute 'drop policy if exists active_sessions_self_delete on public.active_sessions';
  end if;
end
$$;

-- ─── Les helpers de rôle n'ont plus aucun consommateur ──────────────────────
drop function if exists public.is_admin();
drop function if exists public.is_manager();
drop function if exists public.current_app_role();

-- ─── Politiques : authentifié = tout ────────────────────────────────────────

drop policy if exists users_authenticated_select on public.users;
create policy users_authenticated_select
on public.users
for select
to authenticated
using (public.current_app_user_id() is not null);

drop policy if exists users_authenticated_manage on public.users;
create policy users_authenticated_manage
on public.users
for all
to authenticated
using (public.current_app_user_id() is not null)
with check (public.current_app_user_id() is not null);

drop policy if exists projects_authenticated_read on public.projects;
create policy projects_authenticated_read
on public.projects
for select
to authenticated
using (public.current_app_user_id() is not null);

drop policy if exists projects_authenticated_manage on public.projects;
create policy projects_authenticated_manage
on public.projects
for all
to authenticated
using (public.current_app_user_id() is not null)
with check (public.current_app_user_id() is not null);

drop policy if exists categories_authenticated_read on public.categories;
create policy categories_authenticated_read
on public.categories
for select
to authenticated
using (public.current_app_user_id() is not null);

drop policy if exists categories_authenticated_manage on public.categories;
create policy categories_authenticated_manage
on public.categories
for all
to authenticated
using (public.current_app_user_id() is not null)
with check (public.current_app_user_id() is not null);

drop policy if exists time_entries_authenticated_select on public.time_entries;
create policy time_entries_authenticated_select
on public.time_entries
for select
to authenticated
using (public.current_app_user_id() is not null);

drop policy if exists time_entries_authenticated_insert on public.time_entries;
create policy time_entries_authenticated_insert
on public.time_entries
for insert
to authenticated
with check (public.current_app_user_id() is not null);

drop policy if exists time_entries_authenticated_update on public.time_entries;
create policy time_entries_authenticated_update
on public.time_entries
for update
to authenticated
using (public.current_app_user_id() is not null)
with check (public.current_app_user_id() is not null);

drop policy if exists time_entries_authenticated_delete on public.time_entries;
create policy time_entries_authenticated_delete
on public.time_entries
for delete
to authenticated
using (public.current_app_user_id() is not null);

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'active_sessions'
  ) then
    execute 'alter table public.active_sessions enable row level security';

    execute 'drop policy if exists active_sessions_authenticated_select on public.active_sessions';
    execute $policy$
      create policy active_sessions_authenticated_select
      on public.active_sessions
      for select
      to authenticated
      using (public.current_app_user_id() is not null)
    $policy$;

    execute 'drop policy if exists active_sessions_authenticated_insert on public.active_sessions';
    execute $policy$
      create policy active_sessions_authenticated_insert
      on public.active_sessions
      for insert
      to authenticated
      with check (public.current_app_user_id() is not null)
    $policy$;

    execute 'drop policy if exists active_sessions_authenticated_update on public.active_sessions';
    execute $policy$
      create policy active_sessions_authenticated_update
      on public.active_sessions
      for update
      to authenticated
      using (public.current_app_user_id() is not null)
      with check (public.current_app_user_id() is not null)
    $policy$;

    execute 'drop policy if exists active_sessions_authenticated_delete on public.active_sessions';
    execute $policy$
      create policy active_sessions_authenticated_delete
      on public.active_sessions
      for delete
      to authenticated
      using (public.current_app_user_id() is not null)
    $policy$;
  end if;
end
$$;

-- ─── La colonne role n'est plus lue par personne ────────────────────────────
-- En dernier : plus aucune politique ni fonction ne s'y réfère à ce stade.
-- Emporte au passage la contrainte users_role_check.
alter table public.users drop column if exists role;

commit;
