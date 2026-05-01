-- Mordologie
-- Sync Supabase Auth users with public.users by email

begin;

create or replace function public.next_public_user_id()
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  last_number integer;
begin
  select coalesce(max(replace(user_id, 'USR-', '')::integer), 0)
    into last_number
  from public.users;

  return 'USR-' || lpad((last_number + 1)::text, 3, '0');
end;
$$;

create or replace function public.handle_auth_user_sync()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_user_id text;
  inferred_name text;
begin
  if new.email is null then
    return new;
  end if;

  select user_id
    into matched_user_id
  from public.users
  where lower(email) = lower(new.email)
  limit 1;

  if matched_user_id is not null then
    update public.users
    set auth_user_id = new.id,
        updated_at = now()
    where user_id = matched_user_id
      and (auth_user_id is null or auth_user_id = new.id);
    return new;
  end if;

  inferred_name := coalesce(
    nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
    initcap(replace(split_part(new.email, '@', 1), '.', ' '))
  );

  insert into public.users (
    user_id,
    user_name,
    email,
    auth_user_id,
    role,
    team_name,
    managed_team_name,
    manager_user_id,
    weekly_capacity_hours,
    status
  )
  values (
    public.next_public_user_id(),
    inferred_name,
    new.email,
    new.id,
    'cadre',
    'A definir',
    null,
    null,
    39.00,
    'active'
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_sync_public_user on auth.users;
create trigger on_auth_user_created_sync_public_user
after insert or update of email on auth.users
for each row
execute function public.handle_auth_user_sync();

update public.users u
set auth_user_id = a.id,
    updated_at = now()
from auth.users a
where lower(u.email) = lower(a.email)
  and (u.auth_user_id is null or u.auth_user_id = a.id);

commit;
