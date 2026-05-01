begin;

-- Demo / fake projects seen in production-like data that should not remain in
-- the shared Mordologie catalog.
with demo_projects(project_name, client_name) as (
  values
    ('Monceau Retail Supply', 'Monceau Retail Group'),
    ('Asteria PMO Sinistres', 'Asteria Assurances'),
    ('Velinor Qualite Data', 'Velinor Pharma'),
    ('Dossier Elections 2026', 'Ville de Saint-Just'),
    ('Portail RH 2026', 'Groupe Novaris'),
    ('Support Finance Daily', 'Banque Helios'),
    ('Academy Managers', 'Interne'),
    ('CRM Pipeline Q2', 'Interne'),
    ('Offres Secteur Public', 'Interne'),
    ('Gouvernance Equipe France', 'Interne')
),
target_projects as (
  select p.project_id, p.project_name, p.client_name, p.default_activity_category_id
  from public.projects p
  join demo_projects d
    on p.project_name = d.project_name
   and p.client_name = d.client_name
),
deleted_time_entries as (
  delete from public.time_entries te
  using target_projects tp
  where te.project_id = tp.project_id
     or (te.project_name = tp.project_name and coalesce(te.client_name, '') = coalesce(tp.client_name, ''))
  returning te.project_id, te.project_name, te.client_name, te.activity_category_id
),
deleted_active_sessions as (
  delete from public.active_sessions act
  using target_projects tp
  where act.project_id = tp.project_id
     or (act.project_name = tp.project_name and coalesce(act.client_name, '') = coalesce(tp.client_name, ''))
  returning act.project_id, act.project_name, act.client_name, act.activity_category_id
),
deleted_reprise_actions as (
  delete from public.reprise_actions ra
  using target_projects tp
  where coalesce(ra.subject_project_name, '') = tp.project_name
  returning ra.subject_project_name
),
deleted_projects as (
  delete from public.projects p
  using target_projects tp
  where p.project_id = tp.project_id
  returning p.project_id, p.project_name, p.default_activity_category_id
),
candidate_categories as (
  select distinct activity_category_id
  from (
    select activity_category_id from deleted_time_entries
    union all
    select activity_category_id from deleted_active_sessions
    union all
    select default_activity_category_id as activity_category_id from deleted_projects
  ) x
  where activity_category_id is not null
),
deleted_categories as (
  delete from public.categories c
  using candidate_categories cc
  where c.activity_category_id = cc.activity_category_id
    and not exists (
      select 1
      from public.projects p
      where p.default_activity_category_id = c.activity_category_id
    )
    and not exists (
      select 1
      from public.time_entries te
      where te.activity_category_id = c.activity_category_id
    )
    and not exists (
      select 1
      from public.active_sessions act
      where act.activity_category_id = c.activity_category_id
    )
  returning c.activity_category_id, c.activity_category_label
)
select
  (select count(*) from target_projects) as targeted_projects,
  (select count(*) from deleted_time_entries) as deleted_time_entries,
  (select count(*) from deleted_active_sessions) as deleted_active_sessions,
  (select count(*) from deleted_reprise_actions) as deleted_reprise_actions,
  (select count(*) from deleted_projects) as deleted_projects,
  (select count(*) from deleted_categories) as deleted_orphan_categories;

commit;
