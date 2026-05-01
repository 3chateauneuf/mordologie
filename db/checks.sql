-- Mordologie
-- V1 dataset validation checks
-- Run after loading db/schema.sql and db/seed.sql

-- ============================================================================
-- 1. SANITY CHECKS
-- Basic row counts and simple integrity checks
-- ============================================================================

select 'users' as check_name, count(*) as row_count
from users;

select 'categories' as check_name, count(*) as row_count
from categories;

select 'projects' as check_name, count(*) as row_count
from projects;

select 'time_entries' as check_name, count(*) as row_count
from time_entries;

select
  'time_entries with invalid duration' as check_name,
  count(*) as issue_count
from time_entries
where duration_minutes <= 0;

select
  'time_entries missing denormalized labels' as check_name,
  count(*) as issue_count
from time_entries
where user_name is null
   or team_name is null
   or project_name is null
   or client_name is null
   or activity_category_label is null
   or kpi_category_label is null;

select
  'projects missing default category label while default category id exists' as check_name,
  count(*) as issue_count
from projects
where default_activity_category_id is not null
  and default_activity_category_label is null;

-- ============================================================================
-- 2. DISTRIBUTION
-- Category and user-level spread of work
-- ============================================================================

select
  kpi_category_label,
  count(*) as entry_count,
  sum(duration_minutes) as total_minutes,
  round(sum(duration_minutes) / 60.0, 2) as total_hours
from time_entries
group by kpi_category_label
order by total_minutes desc, kpi_category_label;

select
  activity_category_label,
  kpi_category_label,
  count(*) as entry_count,
  sum(duration_minutes) as total_minutes,
  round(sum(duration_minutes) / 60.0, 2) as total_hours
from time_entries
group by activity_category_label, kpi_category_label
order by total_minutes desc, activity_category_label;

select
  user_name,
  count(*) as entry_count,
  sum(duration_minutes) as total_minutes,
  round(sum(duration_minutes) / 60.0, 2) as total_hours
from time_entries
group by user_name
order by total_minutes desc, user_name;

select
  project_name,
  client_name,
  count(*) as entry_count,
  sum(duration_minutes) as total_minutes,
  round(sum(duration_minutes) / 60.0, 2) as total_hours
from time_entries
group by project_name, client_name
order by total_minutes desc, project_name;

-- ============================================================================
-- 3. USAGE PATTERNS
-- Shared projects, repeated work habits, and common combinations
-- ============================================================================

select
  project_name,
  count(distinct user_id) as distinct_users,
  count(*) as entry_count,
  round(sum(duration_minutes) / 60.0, 2) as total_hours
from time_entries
group by project_name
having count(distinct user_id) > 1
order by distinct_users desc, entry_count desc, project_name;

select
  user_name,
  project_name,
  activity_category_label,
  count(*) as repeated_entries,
  sum(duration_minutes) as total_minutes,
  round(sum(duration_minutes) / 60.0, 2) as total_hours
from time_entries
group by user_name, project_name, activity_category_label
having count(*) >= 2
order by repeated_entries desc, total_minutes desc, user_name, project_name;

select
  user_name,
  project_name,
  count(*) as entry_count
from time_entries
group by user_name, project_name
having count(*) >= 2
order by entry_count desc, user_name, project_name;

select
  source,
  status,
  count(*) as entry_count
from time_entries
group by source, status
order by source, status;

-- ============================================================================
-- 4. RECENCY
-- Journal-oriented checks for recent data and latest user activity
-- ============================================================================

select
  entry_date,
  user_name,
  project_name,
  activity_category_label,
  duration_minutes,
  status,
  created_at
from time_entries
where entry_date >= current_date - interval '3 days'
order by entry_date desc, created_at desc;

select
  user_name,
  max(entry_date) as latest_entry_date,
  max(created_at) as latest_created_at
from time_entries
group by user_name
order by latest_created_at desc, user_name;

select
  project_name,
  activity_category_label,
  count(*) as recent_entry_count
from time_entries
where entry_date >= current_date - interval '7 days'
group by project_name, activity_category_label
order by recent_entry_count desc, project_name, activity_category_label;

-- ============================================================================
-- 5. OPTIONAL REALISM SIGNALS
-- Quick heuristics to spot odd patterns in the seed
-- ============================================================================

select
  entry_date,
  user_name,
  count(*) as entries_that_day,
  sum(duration_minutes) as total_minutes,
  round(sum(duration_minutes) / 60.0, 2) as total_hours
from time_entries
group by entry_date, user_name
order by total_minutes desc, entry_date desc, user_name;

select
  user_name,
  count(distinct project_id) as distinct_projects,
  count(distinct activity_category_id) as distinct_categories
from time_entries
group by user_name
order by distinct_projects desc, distinct_categories desc, user_name;
