-- Mordologie — suppression du circuit de demande de catégorie
--
-- Le projet est devenu mono-utilisateur. Une catégorie inconnue est créée
-- directement depuis l'autocomplétion ; personne ne demande plus rien à
-- personne. Le code de l'app ne connaît plus category_requests (PR #16).
--
-- Ce fichier créait la table et ses politiques. Il fait maintenant l'inverse :
-- il démonte proprement ce qu'il avait monté.
--
-- ⚠️ À exécuter EN PREMIER, avant db/auth_rls.sql. Les politiques ci-dessous
-- dépendent de public.is_admin() et public.is_manager(), que auth_rls.sql
-- supprime. Dans l'autre sens, la suppression des fonctions échoue et tout le
-- script est annulé.
--
-- Idempotent : le repasser ne fait rien de plus.

begin;

-- Politiques de la table, supprimées avant la table elle-même. « drop table »
-- les emporterait, mais les nommer laisse une trace de ce qui a existé.
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'category_requests'
  ) then
    execute 'drop policy if exists category_requests_self_insert on public.category_requests';
    execute 'drop policy if exists category_requests_scope_select on public.category_requests';
    execute 'drop policy if exists category_requests_decider_update on public.category_requests';
  end if;
end
$$;

-- Politique ADDITIVE posée par ce fichier sur une AUTRE table : elle ouvrait
-- categories au manager pour qu'approuver une demande puisse créer la
-- catégorie canonique. Elle dépend de is_manager() et doit partir ici, sinon
-- auth_rls.sql ne pourra pas supprimer cette fonction.
drop policy if exists categories_manager_manage on public.categories;

drop index if exists public.idx_category_requests_status;

drop table if exists public.category_requests;

commit;
