-- Mordologie — category_requests : schéma + RLS (Phase B)
--
-- La table category_requests a été créée hors migration. Ce fichier documente
-- son schéma et active le row level security avec les politiques du flux de
-- demande de catégorie :
--   - cadre          : crée sa propre demande, lit ses propres demandes
--   - manager / admin : lisent toutes les demandes et les décident (update)
--
-- ⚠️ Aujourd'hui le RLS est probablement DÉSACTIVÉ sur cette table (la clé
-- publishable/anon peut lire les lignes). Le front fonctionne donc déjà sans ce
-- fichier ; l'exécuter est un DURCISSEMENT de sécurité. Exécuter le fichier
-- ENTIER : activer le RLS sans les politiques casserait l'envoi des demandes.
--
-- Dépend des helpers définis dans auth_rls.sql :
--   public.current_app_user_id(), public.is_admin(), public.is_manager()

begin;

-- Schéma (no-op si la table existe déjà ; utile pour une install fraîche).
create table if not exists public.category_requests (
  request_id           uuid primary key default gen_random_uuid(),
  user_id              text not null,
  user_name            text,
  label                text not null,
  justification        text,
  source_time_entry_id text,
  status               text not null default 'pending'
                         check (status in ('pending', 'approved', 'rejected')),
  created_at           timestamptz not null default now(),
  decided_at           timestamptz,
  decided_by           text,
  decision_note        text,
  seen_at              timestamptz
);

create index if not exists idx_category_requests_status
  on public.category_requests(status);

alter table public.category_requests enable row level security;

-- Insert : un utilisateur authentifié crée sa propre demande.
drop policy if exists category_requests_self_insert on public.category_requests;
create policy category_requests_self_insert
on public.category_requests
for insert
to authenticated
with check (user_id = public.current_app_user_id());

-- Select : le demandeur voit ses demandes ; manager/admin voient tout.
drop policy if exists category_requests_scope_select on public.category_requests;
create policy category_requests_scope_select
on public.category_requests
for select
to authenticated
using (
  user_id = public.current_app_user_id()
  or public.is_admin()
  or public.is_manager()
);

-- Update : seuls manager/admin décident (approuver / refuser).
drop policy if exists category_requests_decider_update on public.category_requests;
create policy category_requests_decider_update
on public.category_requests
for update
to authenticated
using (public.is_admin() or public.is_manager())
with check (public.is_admin() or public.is_manager());

-- Approuver une demande crée la catégorie canonique (insert dans categories).
-- auth_rls.sql ne l'autorise qu'à l'admin (categories_admin_manage). On ajoute
-- une politique ADDITIVE pour le manager, cohérente avec l'app
-- (canCreateSharedCategory = manager || admin). Purement additive : ne touche
-- pas la politique admin existante.
drop policy if exists categories_manager_manage on public.categories;
create policy categories_manager_manage
on public.categories
for all
to authenticated
using (public.is_manager())
with check (public.is_manager());

commit;
