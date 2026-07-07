-- Mordologie
-- Persiste la liste « À Faire » (todos de la vue Reprendre) dans Supabase au
-- lieu du localStorage seul : elle est stockée comme une préférence par
-- utilisateur dans user_ui_preferences (clé 'reprise_todos', value_json = tableau
-- de tâches {id, text, done, doneAt, archived, archivedAt}). Privée par personne
-- via owner_user_name/scope_key (comme day_themes / reprises_order).
--
-- Cette migration recrée la contrainte CHECK de preference_key avec l'ensemble
-- COMPLET des clés réellement utilisées par l'app (certaines — calendar_ics_url,
-- day_range, weekly_capacity_hours, max_session_hours, calendar_snapshots_v1 —
-- n'étaient pas dans le CHECK d'origine à 3 clés : leurs upserts étaient rejetés
-- en silence et ne persistaient qu'en local). On les autorise donc aussi.
--
-- Idempotent : ré-exécutable sans risque.

begin;

alter table public.user_ui_preferences
  drop constraint if exists user_ui_preferences_preference_key_check;

alter table public.user_ui_preferences
  add constraint user_ui_preferences_preference_key_check
    check (preference_key in (
      'day_themes',
      'reprises_order',
      'profile_avatar',
      'calendar_ics_url',
      'calendar_snapshots_v1',
      'max_session_hours',
      'day_range',
      'weekly_capacity_hours',
      'reprise_todos'
    ));

commit;
