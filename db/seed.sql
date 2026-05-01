-- Mordologie
-- V1 realistic seed data for an internal logistics cooperative
-- Covers roughly the last 3 weeks from 2026-04-10

begin;

truncate table time_entries, projects, categories, users cascade;

insert into users (
  user_id,
  user_name,
  email,
  auth_user_id,
  role,
  team_name,
  managed_team_name,
  manager_user_id,
  weekly_capacity_hours,
  status,
  created_at,
  updated_at
) values
  ('USR-001', 'Claire', 'claire@cargonautes.fr', null, 'cadre', 'Conseil Operations France', null, 'USR-002', 39.00, 'active', '2025-09-01T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('USR-002', 'Paulo', 'paulo@cargonautes.fr', null, 'manager', 'Conseil Operations France', 'Conseil Operations France', null, 39.00, 'active', '2025-09-01T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('USR-003', 'Tristan', 'tristan@cargonautes.fr', null, 'cadre', 'Conseil Operations France', null, 'USR-002', 39.00, 'active', '2025-10-01T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('USR-004', 'Martin Salles', 'martin.salles@cargonautes.fr', null, 'cadre', 'Conseil Operations France', null, 'USR-002', 39.00, 'active', '2025-10-15T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('USR-005', 'Alexis', 'alexis@cargonautes.fr', null, 'cadre', 'Conseil Operations France', null, 'USR-002', 37.00, 'active', '2025-11-01T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('USR-006', 'Eduardo', 'eduardo@cargonautes.fr', null, 'admin', 'Conseil Operations France', null, null, 39.00, 'active', '2025-11-15T08:00:00Z', '2026-04-10T08:00:00Z');

insert into categories (
  activity_category_id,
  activity_category_label,
  kpi_category_label,
  team_name,
  active,
  created_at,
  updated_at
) values
  ('CAT-001', 'Preparation de commandes', 'Operations', 'Conseil Operations France', true, '2025-09-01T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('CAT-002', 'Expeditions', 'Operations', 'Conseil Operations France', true, '2025-09-01T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('CAT-003', 'Livraison dernier kilometre', 'Operations', 'Conseil Operations France', true, '2025-09-01T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('CAT-004', 'Etat des stocks', 'Operations', 'Conseil Operations France', true, '2025-09-01T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('CAT-005', 'SAV client', 'Support', 'Conseil Operations France', true, '2025-09-01T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('CAT-006', 'Incident client / qualite', 'Support', 'Conseil Operations France', true, '2025-09-01T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('CAT-007', 'QHSE / amelioration continue', 'Internal', 'Conseil Operations France', true, '2025-09-01T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('CAT-008', 'Developpement outil interne', 'Product', 'Conseil Operations France', true, '2025-09-01T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('CAT-009', 'Finance & administration', 'Internal', 'Conseil Operations France', true, '2025-09-01T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('CAT-010', 'Prospection commerciale', 'Business', 'Conseil Operations France', true, '2025-09-01T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('CAT-011', 'R&D / innovation', 'Innovation', 'Conseil Operations France', true, '2025-09-01T08:00:00Z', '2026-04-10T08:00:00Z');

insert into projects (
  project_id,
  project_name,
  client_name,
  status,
  default_activity_category_id,
  default_activity_category_label,
  created_at,
  updated_at
) values
  ('PRJ-001', 'Hub Paris - Exploitation', 'Interne', 'active', 'CAT-001', 'Preparation de commandes', '2025-12-01T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('PRJ-002', 'Tournees Bio Monceau', 'Monceau Bio', 'active', 'CAT-003', 'Livraison dernier kilometre', '2025-12-08T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('PRJ-003', 'SAV Retards & Litiges', 'Interne', 'active', 'CAT-005', 'SAV client', '2025-12-15T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('PRJ-004', 'Etat de stock Hub Bercy', 'Interne', 'active', 'CAT-004', 'Etat des stocks', '2025-12-22T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('PRJ-005', 'Qualite & QHSE Dernier Kilometre', 'Interne', 'active', 'CAT-007', 'QHSE / amelioration continue', '2026-01-05T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('PRJ-006', 'Mordologie', 'Interne', 'active', 'CAT-008', 'Developpement outil interne', '2026-01-12T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('PRJ-007', 'Pilotage marge cooperatif', 'Interne', 'active', 'CAT-009', 'Finance & administration', '2026-01-19T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('PRJ-008', 'Prospection enseignes Paris', 'Interne', 'active', 'CAT-010', 'Prospection commerciale', '2026-01-26T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('PRJ-009', 'Bacs reemploi & emballages', 'Interne', 'active', 'CAT-011', 'R&D / innovation', '2026-02-02T08:00:00Z', '2026-04-10T08:00:00Z'),
  ('PRJ-010', 'Pilotage coop & capacites', 'Interne', 'active', 'CAT-009', 'Finance & administration', '2026-02-09T08:00:00Z', '2026-04-10T08:00:00Z');

insert into time_entries (
  time_entry_id,
  entry_date,
  user_id,
  user_name,
  team_name,
  project_id,
  project_name,
  client_name,
  activity_category_id,
  activity_category_label,
  kpi_category_label,
  duration_minutes,
  duration_hours,
  task_label,
  source,
  status,
  created_at,
  updated_at
) values
  ('TE-000001', '2026-03-24', 'USR-001', 'Claire', 'Conseil Operations France', 'PRJ-001', 'Hub Paris - Exploitation', 'Interne', 'CAT-001', 'Preparation de commandes', 'Operations', 105, 1.75, 'Vague du matin B2B', 'timer', 'submitted', '2026-03-24T06:40:00Z', '2026-03-24T08:25:00Z'),
  ('TE-000002', '2026-03-24', 'USR-006', 'Eduardo', 'Conseil Operations France', 'PRJ-004', 'Etat de stock Hub Bercy', 'Interne', 'CAT-004', 'Etat des stocks', 'Operations', 90, 1.50, 'Controle ecarts de stock', 'manual', 'submitted', '2026-03-24T08:45:00Z', '2026-03-24T10:15:00Z'),
  ('TE-000003', '2026-03-24', 'USR-004', 'Martin Salles', 'Conseil Operations France', 'PRJ-006', 'Mordologie', 'Interne', 'CAT-008', 'Developpement outil interne', 'Product', 120, 2.00, 'Simplification saisie rapide', 'timer', 'submitted', '2026-03-24T09:30:00Z', '2026-03-24T11:30:00Z'),
  ('TE-000004', '2026-03-24', 'USR-005', 'Alexis', 'Conseil Operations France', 'PRJ-007', 'Pilotage marge cooperatif', 'Interne', 'CAT-009', 'Finance & administration', 'Internal', 75, 1.25, 'Revue couts SAV', 'manual', 'submitted', '2026-03-24T12:30:00Z', '2026-03-24T13:45:00Z'),
  ('TE-000005', '2026-03-25', 'USR-003', 'Tristan', 'Conseil Operations France', 'PRJ-008', 'Prospection enseignes Paris', 'Interne', 'CAT-010', 'Prospection commerciale', 'Business', 90, 1.50, 'Qualification nouveaux comptes', 'manual', 'submitted', '2026-03-25T09:00:00Z', '2026-03-25T10:30:00Z'),
  ('TE-000006', '2026-03-25', 'USR-002', 'Paulo', 'Conseil Operations France', 'PRJ-009', 'Bacs reemploi & emballages', 'Interne', 'CAT-011', 'R&D / innovation', 'Innovation', 105, 1.75, 'Test retour contenants', 'timer', 'submitted', '2026-03-25T10:45:00Z', '2026-03-25T12:30:00Z'),

  ('TE-000007', '2026-03-31', 'USR-001', 'Claire', 'Conseil Operations France', 'PRJ-002', 'Tournees Bio Monceau', 'Monceau Bio', 'CAT-002', 'Expeditions', 'Operations', 75, 1.25, 'Dispatch tournees et mise a quai', 'timer', 'submitted', '2026-03-31T06:50:00Z', '2026-03-31T08:05:00Z'),
  ('TE-000008', '2026-03-31', 'USR-006', 'Eduardo', 'Conseil Operations France', 'PRJ-005', 'Qualite & QHSE Dernier Kilometre', 'Interne', 'CAT-007', 'QHSE / amelioration continue', 'Internal', 90, 1.50, 'Point securite et standard quai', 'manual', 'submitted', '2026-03-31T08:15:00Z', '2026-03-31T09:45:00Z'),
  ('TE-000009', '2026-03-31', 'USR-001', 'Claire', 'Conseil Operations France', 'PRJ-003', 'SAV Retards & Litiges', 'Interne', 'CAT-005', 'SAV client', 'Support', 75, 1.25, 'Reprise tickets clients', 'quick', 'submitted', '2026-03-31T14:10:00Z', '2026-03-31T15:25:00Z'),
  ('TE-000010', '2026-03-31', 'USR-004', 'Martin Salles', 'Conseil Operations France', 'PRJ-006', 'Mordologie', 'Interne', 'CAT-008', 'Developpement outil interne', 'Product', 105, 1.75, 'Vue manager et capacite', 'timer', 'submitted', '2026-03-31T14:30:00Z', '2026-03-31T16:15:00Z'),
  ('TE-000011', '2026-04-01', 'USR-005', 'Alexis', 'Conseil Operations France', 'PRJ-010', 'Pilotage coop & capacites', 'Interne', 'CAT-009', 'Finance & administration', 'Internal', 60, 1.00, 'Arbitrage charge vs capacite', 'manual', 'submitted', '2026-04-01T08:30:00Z', '2026-04-01T09:30:00Z'),
  ('TE-000012', '2026-04-01', 'USR-003', 'Tristan', 'Conseil Operations France', 'PRJ-008', 'Prospection enseignes Paris', 'Interne', 'CAT-010', 'Prospection commerciale', 'Business', 75, 1.25, 'RDV client retail alimentaire', 'manual', 'submitted', '2026-04-01T14:00:00Z', '2026-04-01T15:15:00Z'),

  ('TE-000013', '2026-04-07', 'USR-001', 'Claire', 'Conseil Operations France', 'PRJ-001', 'Hub Paris - Exploitation', 'Interne', 'CAT-001', 'Preparation de commandes', 'Operations', 100, 1.67, 'Vague du matin B2B', 'timer', 'submitted', '2026-04-07T06:40:00Z', '2026-04-07T08:20:00Z'),
  ('TE-000014', '2026-04-07', 'USR-001', 'Claire', 'Conseil Operations France', 'PRJ-003', 'SAV Retards & Litiges', 'Interne', 'CAT-005', 'SAV client', 'Support', 70, 1.17, 'Reprise tickets clients', 'quick', 'submitted', '2026-04-07T14:10:00Z', '2026-04-07T15:20:00Z'),
  ('TE-000015', '2026-04-07', 'USR-006', 'Eduardo', 'Conseil Operations France', 'PRJ-004', 'Etat de stock Hub Bercy', 'Interne', 'CAT-004', 'Etat des stocks', 'Operations', 90, 1.50, 'Controle ecarts de stock', 'manual', 'submitted', '2026-04-07T15:40:00Z', '2026-04-07T17:10:00Z'),
  ('TE-000016', '2026-04-07', 'USR-004', 'Martin Salles', 'Conseil Operations France', 'PRJ-006', 'Mordologie', 'Interne', 'CAT-008', 'Developpement outil interne', 'Product', 120, 2.00, 'Ajustements saisie rapide', 'timer', 'submitted', '2026-04-07T10:00:00Z', '2026-04-07T12:00:00Z'),
  ('TE-000017', '2026-04-08', 'USR-005', 'Alexis', 'Conseil Operations France', 'PRJ-007', 'Pilotage marge cooperatif', 'Interne', 'CAT-009', 'Finance & administration', 'Internal', 90, 1.50, 'Revue couts SAV', 'manual', 'submitted', '2026-04-08T09:00:00Z', '2026-04-08T10:30:00Z'),
  ('TE-000018', '2026-04-08', 'USR-002', 'Paulo', 'Conseil Operations France', 'PRJ-009', 'Bacs reemploi & emballages', 'Interne', 'CAT-011', 'R&D / innovation', 'Innovation', 75, 1.25, 'Test process retour contenants', 'timer', 'submitted', '2026-04-08T10:45:00Z', '2026-04-08T12:00:00Z'),
  ('TE-000019', '2026-04-08', 'USR-003', 'Tristan', 'Conseil Operations France', 'PRJ-008', 'Prospection enseignes Paris', 'Interne', 'CAT-010', 'Prospection commerciale', 'Business', 80, 1.33, 'Qualification nouveaux comptes', 'manual', 'submitted', '2026-04-08T14:00:00Z', '2026-04-08T15:20:00Z'),
  ('TE-000020', '2026-04-09', 'USR-001', 'Claire', 'Conseil Operations France', 'PRJ-002', 'Tournees Bio Monceau', 'Monceau Bio', 'CAT-002', 'Expeditions', 'Operations', 70, 1.17, 'Dispatch tournees et mise a quai', 'timer', 'submitted', '2026-04-09T06:50:00Z', '2026-04-09T08:00:00Z'),
  ('TE-000021', '2026-04-09', 'USR-006', 'Eduardo', 'Conseil Operations France', 'PRJ-005', 'Qualite & QHSE Dernier Kilometre', 'Interne', 'CAT-007', 'QHSE / amelioration continue', 'Internal', 75, 1.25, 'Plan action incidents recurrents', 'manual', 'submitted', '2026-04-09T08:15:00Z', '2026-04-09T09:30:00Z'),
  ('TE-000022', '2026-04-09', 'USR-001', 'Claire', 'Conseil Operations France', 'PRJ-003', 'SAV Retards & Litiges', 'Interne', 'CAT-006', 'Incident client / qualite', 'Support', 80, 1.33, 'Analyse causes racines', 'manual', 'submitted', '2026-04-09T15:10:00Z', '2026-04-09T16:30:00Z'),
  ('TE-000023', '2026-04-10', 'USR-006', 'Eduardo', 'Conseil Operations France', 'PRJ-004', 'Etat de stock Hub Bercy', 'Interne', 'CAT-004', 'Etat des stocks', 'Operations', 70, 1.17, 'Inventaire tournant', 'quick', 'submitted', '2026-04-10T07:00:00Z', '2026-04-10T08:10:00Z'),
  ('TE-000024', '2026-04-10', 'USR-001', 'Claire', 'Conseil Operations France', 'PRJ-001', 'Hub Paris - Exploitation', 'Interne', 'CAT-001', 'Preparation de commandes', 'Operations', 105, 1.75, 'Vague de reappro et cross-dock', 'timer', 'saved', '2026-04-10T08:15:00Z', '2026-04-10T10:00:00Z'),
  ('TE-000025', '2026-04-10', 'USR-004', 'Martin Salles', 'Conseil Operations France', 'PRJ-006', 'Mordologie', 'Interne', 'CAT-008', 'Developpement outil interne', 'Product', 105, 1.75, 'Corrections suggestions intelligentes', 'timer', 'saved', '2026-04-10T10:15:00Z', '2026-04-10T12:00:00Z'),
  ('TE-000026', '2026-04-10', 'USR-002', 'Paulo', 'Conseil Operations France', 'PRJ-009', 'Bacs reemploi & emballages', 'Interne', 'CAT-011', 'R&D / innovation', 'Innovation', 90, 1.50, 'Prototype retour bacs hub-client', 'manual', 'saved', '2026-04-10T13:40:00Z', '2026-04-10T15:10:00Z'),
  ('TE-000027', '2026-04-10', 'USR-006', 'Eduardo', 'Conseil Operations France', 'PRJ-003', 'SAV Retards & Litiges', 'Interne', 'CAT-007', 'QHSE / amelioration continue', 'Internal', 80, 1.33, 'Plan action incidents recurrents', 'manual', 'saved', '2026-04-10T15:20:00Z', '2026-04-10T16:40:00Z');

commit;
