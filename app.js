const STORAGE_KEY = "cadence-equipe-sessions-v3";
const ACTIVE_SESSION_KEY = "cadence-equipe-active-session-v3";
const ACCESS_PROFILE_KEY = "grand-livre-access-profile-v2";
const CATEGORY_COLOR_KEY = "grand-livre-category-colors-v1";
const REPRISES_ORDER_KEY = "grand-livre-reprises-order-v1";
const REPRISES_ACTIONS_KEY = "grand-livre-reprises-actions-v1";
const REMOTE_SYNC_INTERVAL_MS = 15000;
const QUICK_REPRISES_LIMIT = 6;
const MEMORY_CONTEXT_LIMIT = 8;
const COLOR_PALETTE = ["#0f766e", "#c9802b", "#2563eb", "#dc2626", "#7c3aed", "#0891b2", "#15803d"];
const LOCAL_PROFILE_DIRECTORY = [
  {
    user_id: "USR-001",
    user_name: "Claire",
    role: "cadre",
    team_name: "Conseil Operations France",
    manager_user_id: "USR-002",
    weekly_capacity_hours: 39,
    status: "active",
  },
  {
    user_id: "USR-002",
    user_name: "Paulo",
    role: "manager",
    team_name: "Conseil Operations France",
    managed_team_name: "Conseil Operations France",
    manager_user_id: null,
    weekly_capacity_hours: 39,
    status: "active",
  },
  {
    user_id: "USR-003",
    user_name: "Tristan",
    role: "cadre",
    team_name: "Conseil Operations France",
    manager_user_id: "USR-002",
    status: "active",
  },
  {
    user_id: "USR-004",
    user_name: "Martin Salles",
    role: "cadre",
    team_name: "Conseil Operations France",
    manager_user_id: "USR-002",
    weekly_capacity_hours: 39,
    status: "active",
  },
  {
    user_id: "USR-005",
    user_name: "Alexis",
    role: "cadre",
    team_name: "Conseil Operations France",
    manager_user_id: "USR-002",
    status: "active",
  },
  {
    user_id: "USR-006",
    user_name: "Eduardo",
    role: "admin",
    team_name: "Conseil Operations France",
    manager_user_id: null,
    weekly_capacity_hours: 39,
    status: "active",
  },
];

const form = document.querySelector("#time-form");
const viewTabs = Array.from(document.querySelectorAll("[data-view-target]"));
const viewPanels = Array.from(document.querySelectorAll("[data-view-panel]"));
const analysisToolbarPanel = document.querySelector("#analysis-toolbar-panel");
const analysisToolbarTitle = document.querySelector("#analysis-toolbar-title");
const analysisCollaboratorFilterWrap = document.querySelector("#analysis-collaborator-filter-wrap");
const loginNameInput = document.querySelector("#login-name-input");
const authStatus = document.querySelector("#auth-status");
const collaboratorInput = document.querySelector("#collaborator-input");
const collaboratorSuggestions = document.querySelector("#collaborator-suggestions");
const projectInput = document.querySelector("#project-input");
const projectSuggestions = document.querySelector("#project-suggestions");
const projectMemoryHint = document.querySelector("#project-memory-hint");
const manageProjectButton = document.querySelector("#manage-project-button");
const taskInput = document.querySelector("#task-input");
const manageClientButton = document.querySelector("#manage-client-button");
const categoriesInput = document.querySelector("#categories-input");
const categoriesList = document.querySelector("#categories-list");
const categorySuggestions = document.querySelector("#category-suggestions");
const manageCategoryButton = document.querySelector("#manage-category-button");
const tagsInput = document.querySelector("#tags-input");
const tagsList = document.querySelector("#tags-list");
const tagSuggestions = document.querySelector("#tag-suggestions");
const manageTagsButton = document.querySelector("#manage-tags-button");
const notionInput = document.querySelector("#notion-input");
const manageLinkButton = document.querySelector("#manage-link-button");
const objectiveDisclosure = document.querySelector("#objective-disclosure");
const objectiveSummaryText = document.querySelector("#objective-summary-text");
const objectivePoleInput = document.querySelector("#objective-pole-input");
const objectiveOkrInput = document.querySelector("#objective-okr-input");
const objectiveKrInput = document.querySelector("#objective-kr-input");
const managePoleButton = document.querySelector("#manage-pole-button");
const manageOkrButton = document.querySelector("#manage-okr-button");
const manageKrButton = document.querySelector("#manage-kr-button");
const objectivePoleSelected = document.querySelector("#objective-pole-selected");
const objectiveOkrSelected = document.querySelector("#objective-okr-selected");
const objectiveKrSelected = document.querySelector("#objective-kr-selected");
const notesInput = document.querySelector("#notes-input");
const quickProjects = document.querySelector("#quick-projects");
const repriseActionsShell = document.querySelector("#reprise-actions");
const repriseArchiveZone = document.querySelector("#reprise-archive-zone");
const repriseDoneZone = document.querySelector("#reprise-done-zone");
const toggleButton = document.querySelector("#toggle-button");
const pauseButton = document.querySelector("#pause-button");
const openManualButton = document.querySelector("#open-manual-button");
const activeStartDisplay = document.querySelector("#active-start-display");
const timerDisplay = document.querySelector("#timer-display");
const activeTaskLabel = document.querySelector("#active-task-label");
const todayTotal = document.querySelector("#today-total");
const weekTotal = document.querySelector("#week-total");
const todayPanelCopy = document.querySelector("#today-panel-copy");
const teamCount = document.querySelector("#team-count");
const activeCountCopy = document.querySelector("#active-count-copy");
const personalStatsSwitch = document.querySelector("#personal-stats-switch");
const personalStatsTitle = document.querySelector("#personal-stats-title");
const personalStatsCopy = document.querySelector("#personal-stats-copy");
const personalDistributionBar = document.querySelector("#personal-distribution-bar");
const personalDistributionLegend = document.querySelector("#personal-distribution-legend");
const agendaBoard = document.querySelector("#agenda-board");
const agendaPrevWeekButton = document.querySelector("#agenda-prev-week");
const agendaCurrentWeekButton = document.querySelector("#agenda-current-week");
const agendaNextWeekButton = document.querySelector("#agenda-next-week");
const agendaWeekLabel = document.querySelector("#agenda-week-label");
const periodSwitch = document.querySelector("#period-switch");
const analysisStatsSwitch = document.querySelector("#analysis-stats-switch");
const reportAnchorInput = document.querySelector("#report-anchor");
const managerCollaboratorFilter = document.querySelector("#manager-collaborator-filter");
const exportCsvButton = document.querySelector("#export-csv-button");
const reportTotal = document.querySelector("#report-total");
const reportRange = document.querySelector("#report-range");
const reportTopProject = document.querySelector("#report-top-project");
const reportTopProjectTime = document.querySelector("#report-top-project-time");
const reportTopCategoryLabel = document.querySelector("#report-top-category-label");
const reportTopCategory = document.querySelector("#report-top-category");
const reportTopCategoryTime = document.querySelector("#report-top-category-time");
const reportTopKrCard = document.querySelector("#report-top-kr-card");
const reportTopKr = document.querySelector("#report-top-kr");
const reportTopKrTime = document.querySelector("#report-top-kr-time");
const managerDistributionTitle = document.querySelector("#manager-distribution-title");
const managerDistributionCopy = document.querySelector("#manager-distribution-copy");
const managerDistributionBar = document.querySelector("#manager-distribution-bar");
const managerDistributionLegend = document.querySelector("#manager-distribution-legend");
const evolutionGrid = document.querySelector("#evolution-grid");
const teamReportList = document.querySelector("#team-report-list");
const reportProjectList = document.querySelector("#report-project-list");
const reportCategoryHead = document.querySelector("#report-category-head");
const reportCategoryList = document.querySelector("#report-category-list");
const reportKrShell = document.querySelector("#report-kr-shell");
const reportKrList = document.querySelector("#report-kr-list");
const managerObjectivesPanel = document.querySelector("#manager-objectives-panel");
const managerObjectivesGrid = document.querySelector("#manager-objectives-grid");
const sessionList = document.querySelector("#session-list");
const projectMemoryList = document.querySelector("#project-memory-list");
const agendaImportPanel = document.querySelector("#agenda-import-panel");
const agendaImportList = document.querySelector("#agenda-import-list");
const sessionItemTemplate = document.querySelector("#session-item-template");
const resourceTotal = document.querySelector("#resource-total");
const resourceRange = document.querySelector("#resource-range");
const resourceTopProject = document.querySelector("#resource-top-project");
const resourceTopProjectTime = document.querySelector("#resource-top-project-time");
const resourceTopCategoryLabel = document.querySelector("#resource-top-category-label");
const resourceTopCategory = document.querySelector("#resource-top-category");
const resourceTopCategoryTime = document.querySelector("#resource-top-category-time");
const resourceTopKrCard = document.querySelector("#resource-top-kr-card");
const resourceTopKr = document.querySelector("#resource-top-kr");
const resourceTopKrTime = document.querySelector("#resource-top-kr-time");
const resourceDistributionTitle = document.querySelector("#resource-distribution-title");
const resourceDistributionCopy = document.querySelector("#resource-distribution-copy");
const resourceDistributionBar = document.querySelector("#resource-distribution-bar");
const resourceDistributionLegend = document.querySelector("#resource-distribution-legend");
const resourceEvolutionGrid = document.querySelector("#resource-evolution-grid");
const resourceTeamList = document.querySelector("#resource-team-list");
const resourceProjectList = document.querySelector("#resource-project-list");
const resourceCategoryHead = document.querySelector("#resource-category-head");
const resourceCategoryList = document.querySelector("#resource-category-list");
const resourceKrShell = document.querySelector("#resource-kr-shell");
const resourceKrList = document.querySelector("#resource-kr-list");
const resourceObjectivesPanel = document.querySelector("#resource-objectives-panel");
const resourceObjectivesGrid = document.querySelector("#resource-objectives-grid");

const manualDialog = document.querySelector("#manual-dialog");
const manualCollaboratorInput = document.querySelector("#manual-collaborator-input");
const manualProjectInput = document.querySelector("#manual-project-input");
const manualTaskInput = document.querySelector("#manual-task-input");
const manualCategoriesInput = document.querySelector("#manual-categories-input");
const manualTagsInput = document.querySelector("#manual-tags-input");
const manualNotionInput = document.querySelector("#manual-notion-input");
const manualObjectiveDisclosure = document.querySelector("#manual-objective-disclosure");
const manualObjectiveSummaryText = document.querySelector("#manual-objective-summary-text");
const manualObjectivePoleInput = document.querySelector("#manual-objective-pole-input");
const manualObjectiveOkrInput = document.querySelector("#manual-objective-okr-input");
const manualObjectiveKrInput = document.querySelector("#manual-objective-kr-input");
const manualObjectivePoleSelected = document.querySelector("#manual-objective-pole-selected");
const manualObjectiveOkrSelected = document.querySelector("#manual-objective-okr-selected");
const manualObjectiveKrSelected = document.querySelector("#manual-objective-kr-selected");
const manualStartInput = document.querySelector("#manual-start-input");
const manualEndInput = document.querySelector("#manual-end-input");
const manualNotesInput = document.querySelector("#manual-notes-input");
const cancelManualButton = document.querySelector("#cancel-manual-button");
const deleteManualButton = document.querySelector("#delete-manual-button");
const saveManualButton = document.querySelector("#save-manual-button");

const conflictDialog = document.querySelector("#conflict-dialog");
const conflictMessage = document.querySelector("#conflict-message");
const conflictDetail = document.querySelector("#conflict-detail");
const cancelConflictButton = document.querySelector("#cancel-conflict-button");
const editConflictButton = document.querySelector("#edit-conflict-button");
const adjustConflictButton = document.querySelector("#adjust-conflict-button");
const activeStartDialog = document.querySelector("#active-start-dialog");
const activeStartDialogInput = document.querySelector("#active-start-dialog-input");
const activeStartDialogCancelButton = document.querySelector("#active-start-dialog-cancel");
const activeStartDialogSaveButton = document.querySelector("#active-start-dialog-save");
const fieldManageDialog = document.querySelector("#field-manage-dialog");
const fieldManageTitle = document.querySelector("#field-manage-title");
const fieldManageCopy = document.querySelector("#field-manage-copy");
const fieldManageDetail = document.querySelector("#field-manage-detail");
const fieldManageColorShell = document.querySelector("#field-manage-color-shell");
const fieldManageColorInput = document.querySelector("#field-manage-color-input");
const fieldManageColorSaveButton = document.querySelector("#field-manage-color-save");
const fieldManageCancelButton = document.querySelector("#field-manage-cancel");
const fieldManageEditButton = document.querySelector("#field-manage-edit");
const fieldManageDeleteButton = document.querySelector("#field-manage-delete");
const fieldManageConfirmButton = document.querySelector("#field-manage-confirm");

const OBJECTIVE_2026_CATALOG = [
  {
    pole: "Cyclologistique",
    okrCode: "O1",
    okrLabel:
      "On a developpe le CA et ameliore le taux horaire, en maitrisant le ratio matin/apres-midi",
    krs: [
      "RC 1.1 : On a augmente le CA global du pole cyclologistique de 10% en 2026",
      "RC 1.2 : Le taux horaire global livraison a augmente de 4,82%",
      "RC 1.3 : Le taux horaire de l'apres-midi a augmente de 10%",
      "RC 1.4 : Le ratio de CA matin/apres-midi est passe de 2,95 a 2,5",
    ],
  },
  {
    pole: "Cyclologistique",
    okrCode: "O2",
    okrLabel:
      "On a developpe et diversifie le portefeuille commercial des activites livraison et stockage",
    krs: [
      "RC 2.1 : On a embarque 7 nouveaux clients avec un CA mensuel moyen superieur a 1 000EUR",
      "RC 2.2 : On est passe de 5,6% a 8% de CA sur des clients 100% collecte",
      "RC 2.3 : On a signe 2 contrats supplementaires en co-traitance",
      "RC 2.4 : Le CA du top client ne represente pas plus de 50% du CA entrepot",
      "RC 2.5 : On a augmente de 45% le nombre de clients actifs en stockage et livraison",
      "RC 2.6 : On est passe de 300 a 350 demandes entrantes issues du site web",
      "RC 2.7 : On sait suivre precisement le CA des operations speciales",
    ],
  },
  {
    pole: "Cyclologistique",
    okrCode: "O3",
    okrLabel: "On a renforce l'excellence operationnelle",
    krs: [
      "RC 3.1 : On est passe de 12% a 15% des livraisons en horaires de bureau",
      "RC 3.2 : On a atteint 95% de respect des cut-off",
      "RC 3.3 : Le taux de livraisons en retard de plus de 30 minutes est passe de 1,24% a 1,00%",
      "RC 3.4 : Le taux de livraisons Rive droite hors 12 et 16 reste superieur a 70%",
      "RC 3.5 : On a optimise le chargement au depart et le dechargement au retour de tournee",
    ],
  },
  {
    pole: "Cyclologistique",
    okrCode: "O4",
    okrLabel: "On a developpe de nouvelles prestations a forte valeur ajoutee",
    krs: [
      "RC 4.1 : On est capables d'expedier de la marchandise via des transporteurs partenaires",
      "RC 4.2 : On a defini la strategie et le calendrier d'un 20m3 electrique avec hayon",
      "RC 4.3 : On sait repondre aux demandes spot avec un tarif structure",
      "RC 4.4 : On a lance et commercialise l'offre livraison lourde en zone proche",
    ],
  },
  {
    pole: "Cyclologistique",
    okrCode: "O5",
    okrLabel: "On a progresse en conformite et ameliore l'offre de services",
    krs: [
      "RC 5.1 : On a obtenu le label Entrepositaire agree sous douane",
      "RC 5.2 : On a deploye et commercialise une option de suivi de temperature",
      "RC 5.3 : On garantit 0 colis introuvable et 0 colis rackoone a tort",
      "RC 5.4 : On a deploye un WMS qui couvre au moins 80% du volume transitant par l'entrepot",
    ],
  },
  {
    pole: "Cyclologistique",
    okrCode: "O6",
    okrLabel: "On a ameliore les conditions de travail, l'ergonomie, la securite et les outils",
    krs: [
      "RC 6.1 : Aucun colis ne depasse 15 kg",
      "RC 6.2 : Plus de 80% des livraisons entrantes arrivent sur palettes",
      "RC 6.3 : On a mis en service un gerbeur et un transpalette electriques",
      "RC 6.4 : Le ratio batteries sur velos est superieur a 2 pour les bullit et les bosch",
      "RC 6.5 : On a un calendrier de revisions preventives par types de velo",
    ],
  },
  {
    pole: "Cercle de management",
    okrCode: "O1",
    okrLabel:
      "On anticipe mieux les besoins humains, le planning absorbe l'activite sans generer de tensions",
    krs: [
      "RC 1.1 : Les shifts de depannage restent inferieurs a 5% des shifts course par semaine",
      "RC 1.2 : Moins de 5% des shifts depassent de plus de 45 minutes le planning",
      "RC 1.3 : Aucune semaine consecutive ne depasse durablement les seuils de depannage",
      "RC 1.4 : Le deficit horaire reste inferieur a 0,8% sur l'annee",
      "RC 1.5 : Le planning est publie le mercredi au plus tard",
      "RC 1.6 : On a un cadre pour les indisponibilites des salarie.es",
      "RC 1.7 : On utilise un dashboard pour mieux anticiper le volume de livraison",
    ],
  },
  {
    pole: "Cercle de management",
    okrCode: "O2",
    okrLabel: "Nous avons ancre une formation initiale et continue dans nos pratiques",
    krs: [
      "RC 2.1 : Toutes les personnes recrutees en 2026 ont suivi au moins 3 jours de formation",
      "RC 2.2 : Chaque recrue a beneficie de 3 entretiens de feedback durant ses 2 premiers mois",
      "RC 2.3 : 100% des salarie.es ont suivi une demi-journee de sensibilisation au commercial",
      "RC 2.4 : 5 salarie.es ont suivi une formation externe",
    ],
  },
  {
    pole: "Cercle de management",
    okrCode: "O3",
    okrLabel:
      "Nous investissons dans le materiel et l'equipement necessaires a des conditions de travail optimales",
    krs: [
      "RC 3.1 : 100% des salarie.es en periode d'essai recoivent un kit de base complet",
      "RC 3.2 : 100% du materiel a duree de vie definie est renouvele dans les delais",
      "RC 3.3 : 100% des cadenas sont recuperes lors des departs",
      "RC 3.4 : 100% des salarie.es eligibles recoivent la participation telephone",
    ],
  },
  {
    pole: "Cyke",
    okrCode: "O1",
    okrLabel: "Nous realisons 5000EUR de revenu mensuel recurrent en Europe",
    krs: [
      "R1 : Allemagne : 3 clients pour 1500EUR par mois",
      "R2 : Suisse : 2 clients pour 2000EUR par mois",
      "R3 : Italie : 2 nouveaux clients pour 300EUR par mois",
      "R4 : Espagne : 2 nouveaux clients pour 300EUR par mois",
      "R5 : Urbike a teste sur le terrain et defini son plan de migration",
      "R6 : Les clients etrangers ont 2 propositions d'entretiens utilisateurs dans l'annee",
    ],
  },
  {
    pole: "Cyke",
    okrCode: "O2",
    okrLabel: "Cyke couvre mieux les differents cas d'usage de la cyclologistique",
    krs: [
      "R1 : Entretien utilisateurs pour les ambassadeurs",
      "R2 : 10 visites sur site chez des cyclologisticiens",
      "R3 : On sait comment chaque client utilise Cyke et on en tire des pistes d'amelioration",
      "R4 : On a signe au moins un nouveau client petit colis en sous-traitance",
    ],
  },
  {
    pole: "Cyke",
    okrCode: "O3",
    okrLabel: "Cyke gagne en fiabilite",
    krs: [
      "R1 : Le nombre de pages qui chargent en plus de 3 secondes passe de 17 a 4",
      "R2 : La mediane mensuelle d'erreur Sentry Ruby par jour est inferieure a 5",
      "R3 : La mediane mensuelle d'erreur Sentry JS et mobile par jour est inferieure a 50",
    ],
  },
  {
    pole: "Cyke",
    okrCode: "O4",
    okrLabel:
      "On utilise les projets annexes pour financer Cyke tout en ameliorant le socle de fonctionnalites",
    krs: [
      "R1 : L'equipe ne ressent pas de surcharge ni de ralentissement lies aux projets annexes",
      "R2 : Chaque amelioration d'un projet annexe correspond a la roadmap ou la vision Cyke",
      "R3 : 100% des fonctionnalites liees a un projet annexe sont utilisees par d'autres utilisateurs",
    ],
  },
];

const OBJECTIVE_2026_PILLARS = [
  "Cyclologistique",
  "Cercle de management",
  "Cyke",
  "Bigbikes Consulting",
  "Vente de materiel",
];

const LOCAL_DEMO_SESSIONS = [
  {
    id: "LOC-001",
    collaborator: "Claire",
    project: "Hub Paris - Exploitation",
    task: "Vague du matin B2B",
    categories: ["Preparation de commandes"],
    tags: ["hub", "matin"],
    notionRef: "",
    objectivePole: "Cyclologistique",
    objectiveOkr: "O3 · On a renforce l'excellence operationnelle",
    objectiveKr: "On a atteint 95% de respect des cut-off",
    notes: "Pic de commandes alimentaire.",
    start: "2026-04-07T06:40:00+02:00",
    end: "2026-04-07T08:20:00+02:00",
    durationMs: 6000000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Operations",
  },
  {
    id: "LOC-002",
    collaborator: "Claire",
    project: "SAV Retards & Litiges",
    task: "Reprise tickets clients",
    categories: ["SAV client"],
    tags: ["sav", "clients"],
    notionRef: "",
    objectivePole: "Cyclologistique",
    objectiveOkr: "O3 · On a renforce l'excellence operationnelle",
    objectiveKr: "Le taux de livraisons en retard de plus de 30 minutes est passe de 1,24% a 1,00%",
    notes: "Beaucoup de retours sur creneaux non tenus.",
    start: "2026-04-07T14:10:00+02:00",
    end: "2026-04-07T15:20:00+02:00",
    durationMs: 4200000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Support",
  },
  {
    id: "LOC-003",
    collaborator: "Eduardo",
    project: "Etat de stock Hub Bercy",
    task: "Controle ecarts de stock",
    categories: ["Etat des stocks"],
    tags: ["stock", "hub"],
    notionRef: "",
    objectivePole: "Cyclologistique",
    objectiveOkr: "O5 · On a progresse en conformite et ameliore l'offre de services",
    objectiveKr: "On a deploye un WMS qui couvre au moins 80% du volume transitant par l'entrepot",
    notes: "Trois references a verifier apres retour client.",
    start: "2026-04-07T15:40:00+02:00",
    end: "2026-04-07T17:10:00+02:00",
    durationMs: 5400000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Operations",
  },
  {
    id: "LOC-004",
    collaborator: "Martin Salles",
    project: "Grand Livre de la Comté",
    task: "Ajustements saisie rapide",
    categories: ["Developpement outil interne"],
    tags: ["produit", "ux"],
    notionRef: "",
    objectivePole: "Cyke",
    objectiveOkr: "O3 · Cyke gagne en fiabilite",
    objectiveKr: "Le nombre de pages qui chargent en plus de 3 secondes passe de 17 a 4",
    notes: "Simplification du parcours principal.",
    start: "2026-04-07T10:00:00+02:00",
    end: "2026-04-07T12:00:00+02:00",
    durationMs: 7200000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Product",
  },
  {
    id: "LOC-005",
    collaborator: "Alexis",
    project: "Pilotage marge cooperatif",
    task: "Revue couts SAV",
    categories: ["Finance & administration"],
    tags: ["marge", "sav"],
    notionRef: "",
    objectivePole: "",
    objectiveOkr: "",
    objectiveKr: "",
    notes: "Travail sur les couts caches du SAV.",
    start: "2026-04-08T09:00:00+02:00",
    end: "2026-04-08T10:30:00+02:00",
    durationMs: 5400000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Internal",
  },
  {
    id: "LOC-006",
    collaborator: "Paulo",
    project: "Bacs reemploi & emballages",
    task: "Test process retour contenants",
    categories: ["R&D / innovation"],
    tags: ["test", "reemploi"],
    notionRef: "",
    objectivePole: "",
    objectiveOkr: "",
    objectiveKr: "",
    notes: "Premier test avec deux clients pilotes.",
    start: "2026-04-08T10:45:00+02:00",
    end: "2026-04-08T12:00:00+02:00",
    durationMs: 4500000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Innovation",
  },
  {
    id: "LOC-007",
    collaborator: "Tristan",
    project: "Prospection enseignes Paris",
    task: "Qualification nouveaux comptes",
    categories: ["Prospection commerciale"],
    tags: ["prospection", "retail"],
    notionRef: "",
    objectivePole: "",
    objectiveOkr: "",
    objectiveKr: "",
    notes: "Filtre charge exploitation dans le brief commercial.",
    start: "2026-04-08T14:00:00+02:00",
    end: "2026-04-08T15:20:00+02:00",
    durationMs: 4800000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Business",
  },
  {
    id: "LOC-008",
    collaborator: "Claire",
    project: "Tournees Bio Monceau",
    task: "Dispatch tournees et mise a quai",
    categories: ["Expeditions"],
    tags: ["dispatch", "tournees"],
    notionRef: "",
    objectivePole: "Cyclologistique",
    objectiveOkr: "O3 · On a renforce l'excellence operationnelle",
    objectiveKr: "On a atteint 95% de respect des cut-off",
    notes: "",
    start: "2026-04-09T06:50:00+02:00",
    end: "2026-04-09T08:00:00+02:00",
    durationMs: 4200000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Monceau Bio",
    dbKpiCategoryLabel: "Operations",
  },
  {
    id: "LOC-009",
    collaborator: "Eduardo",
    project: "Hub Paris - Exploitation",
    task: "Point securite et mise a jour standard",
    categories: ["QHSE / amelioration continue"],
    tags: ["qhse", "standard"],
    notionRef: "",
    objectivePole: "Cercle de management",
    objectiveOkr: "O3 · Nous investissons dans le materiel et l'equipement necessaires a des conditions de travail optimales",
    objectiveKr: "100% du materiel a duree de vie definie est renouvele dans les delais",
    notes: "",
    start: "2026-04-09T08:15:00+02:00",
    end: "2026-04-09T09:30:00+02:00",
    durationMs: 4500000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Internal",
  },
  {
    id: "LOC-010",
    collaborator: "Martin Salles",
    project: "Grand Livre de la Comté",
    task: "Lecture manager et capacite",
    categories: ["Developpement outil interne"],
    tags: ["manager", "reporting"],
    notionRef: "",
    objectivePole: "Cyke",
    objectiveOkr: "O2 · Cyke couvre mieux les differents cas d'usage de la cyclologistique",
    objectiveKr: "On sait comment chaque client utilise Cyke et on en tire des pistes d'amelioration",
    notes: "",
    start: "2026-04-09T09:40:00+02:00",
    end: "2026-04-09T11:20:00+02:00",
    durationMs: 6000000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Product",
  },
  {
    id: "LOC-011",
    collaborator: "Claire",
    project: "SAV Retards & Litiges",
    task: "Analyse causes racines",
    categories: ["Incident client / qualite"],
    tags: ["sav", "qualite"],
    notionRef: "",
    objectivePole: "Cyclologistique",
    objectiveOkr: "O3 · On a renforce l'excellence operationnelle",
    objectiveKr: "On a optimise le chargement au depart et le dechargement au retour de tournee",
    notes: "Retards dus aux informations de preparation incompletes.",
    start: "2026-04-09T15:10:00+02:00",
    end: "2026-04-09T16:30:00+02:00",
    durationMs: 4800000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Support",
  },
  {
    id: "LOC-012",
    collaborator: "Alexis",
    project: "Pilotage marge cooperatif",
    task: "Synthese budget avril",
    categories: ["Finance & administration"],
    tags: ["budget", "pilotage"],
    notionRef: "",
    objectivePole: "",
    objectiveOkr: "",
    objectiveKr: "",
    notes: "",
    start: "2026-04-09T11:00:00+02:00",
    end: "2026-04-09T12:20:00+02:00",
    durationMs: 4800000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Internal",
  },
  {
    id: "LOC-013",
    collaborator: "Tristan",
    project: "Prospection enseignes Paris",
    task: "RDV client retail alimentaire",
    categories: ["Prospection commerciale"],
    tags: ["rdv", "client"],
    notionRef: "",
    objectivePole: "",
    objectiveOkr: "",
    objectiveKr: "",
    notes: "",
    start: "2026-04-09T15:30:00+02:00",
    end: "2026-04-09T16:45:00+02:00",
    durationMs: 4500000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Business",
  },
  {
    id: "LOC-014",
    collaborator: "Eduardo",
    project: "Etat de stock Hub Bercy",
    task: "Inventaire tournant",
    categories: ["Etat des stocks"],
    tags: ["stock", "inventaire"],
    notionRef: "",
    objectivePole: "Cyclologistique",
    objectiveOkr: "O5 · On a progresse en conformite et ameliore l'offre de services",
    objectiveKr: "On a deploye un WMS qui couvre au moins 80% du volume transitant par l'entrepot",
    notes: "",
    start: "2026-04-10T07:00:00+02:00",
    end: "2026-04-10T08:10:00+02:00",
    durationMs: 4200000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Operations",
  },
  {
    id: "LOC-015",
    collaborator: "Claire",
    project: "Hub Paris - Exploitation",
    task: "Vague de reappro et cross-dock",
    categories: ["Preparation de commandes"],
    tags: ["reappro", "cross-dock"],
    notionRef: "",
    objectivePole: "Cyclologistique",
    objectiveOkr: "O3 · On a renforce l'excellence operationnelle",
    objectiveKr: "On a atteint 95% de respect des cut-off",
    notes: "",
    start: "2026-04-10T08:15:00+02:00",
    end: "2026-04-10T10:00:00+02:00",
    durationMs: 6300000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Operations",
  },
  {
    id: "LOC-016",
    collaborator: "Martin Salles",
    project: "Grand Livre de la Comté",
    task: "Corrections suggestions intelligentes",
    categories: ["Developpement outil interne"],
    tags: ["suggestions", "priorisation"],
    notionRef: "",
    objectivePole: "Cyke",
    objectiveOkr: "O4 · On utilise les projets annexes pour financer Cyke tout en ameliorant le socle de fonctionnalites",
    objectiveKr: "100% des fonctionnalites liees a un projet annexe sont utilisees par d'autres utilisateurs",
    notes: "",
    start: "2026-04-10T10:15:00+02:00",
    end: "2026-04-10T12:00:00+02:00",
    durationMs: 6300000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Product",
  },
  {
    id: "LOC-017",
    collaborator: "Paulo",
    project: "Bacs reemploi & emballages",
    task: "Prototype retour bacs hub-client",
    categories: ["R&D / innovation"],
    tags: ["prototype", "hub"],
    notionRef: "",
    objectivePole: "Cercle de management",
    objectiveOkr: "O1 · On anticipe mieux les besoins humains, le planning absorbe l'activite sans generer de tensions",
    objectiveKr: "On utilise un dashboard pour mieux anticiper le volume de livraison",
    notes: "",
    start: "2026-04-10T13:40:00+02:00",
    end: "2026-04-10T15:10:00+02:00",
    durationMs: 5400000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Innovation",
  },
  {
    id: "LOC-018",
    collaborator: "Eduardo",
    project: "SAV Retards & Litiges",
    task: "Plan action incidents recurrents",
    categories: ["QHSE / amelioration continue"],
    tags: ["sav", "plan action"],
    notionRef: "",
    objectivePole: "Cyclologistique",
    objectiveOkr: "O5 · On a progresse en conformite et ameliore l'offre de services",
    objectiveKr: "On garantit 0 colis introuvable et 0 colis rackoone a tort",
    notes: "Travail avec Claire sur les causes racines.",
    start: "2026-04-10T15:20:00+02:00",
    end: "2026-04-10T16:40:00+02:00",
    durationMs: 4800000,
    dbTeamName: "Conseil Operations France",
    dbClientName: "Interne",
    dbKpiCategoryLabel: "Internal",
  },
];

let sessions = loadSessions();
let activeSession = loadActiveSession();
let currentCategories = [];
let currentTags = [];
let timerIntervalId = null;
let reportPeriod = "week";
let statsMode = "categories";
let manualEditingSessionId = null;
let pendingConflict = null;
let currentView = getInitialView();
let referenceCatalog = {
  users: [],
  projects: [],
  categories: [],
  loaded: false,
  loadingPromise: null,
};
let accessProfile = {
  mode: "open",
  role: "open",
  session: null,
  appUser: null,
};
const autocompletePopover = createAutocompletePopover();
let autocompleteState = {
  config: null,
  items: [],
  activeIndex: 0,
};
let autocompleteHideTimeoutId = null;
let fieldManageState = null;
let fieldManageConfirmMode = false;
let quickProjectsDragState = null;
let agendaDragState = null;
let suppressNextAgendaClick = false;
let auditTableAvailable = null;
let agendaImportRows = [];
let agendaImportLoaded = false;
let remoteActiveSessions = [];
let repriseActions = loadStoredRepriseActions();
let remoteStateAvailable = false;
let remoteStateLoadingPromise = null;
let remoteSyncIntervalId = null;
let activeDraftSyncTimeoutId = null;

setupTokenInput(categoriesInput, {
  getValues: () => currentCategories,
  setValues: (values) => {
    currentCategories = values;
    renderCategoryTokens();
    syncActiveSessionDraftFromForm({ audit: true, source: "active-session-category" });
  },
  singleValue: true,
});

setupTokenInput(tagsInput, {
  getValues: () => currentTags,
  setValues: (values) => {
    currentTags = values;
    renderTagTokens();
    syncActiveSessionDraftFromForm({ audit: true, source: "active-session-tags" });
  },
});

initializeAutocomplete();
applyBookFavicon();
initializeObjectiveSelections();
initializeViewNavigation();

hydrateFormFromActiveSession();
setDefaultReportAnchor();
startTimerLoopIfNeeded();
render();
registerServiceWorker();
void initializeReferenceCatalog();
void initializeAccessProfile();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (activeSession) {
    stopActiveSession();
    return;
  }

  const sessionDraft = await validateAndNormalizeMainForm();
  if (!sessionDraft) {
    return;
  }

  activeSession = {
    id: createSessionId(),
    ...sessionDraft,
    start: new Date().toISOString(),
    pausedAt: null,
    pausedDurationMs: 0,
    isServerActive: true,
  };

  persistActiveSession();
  startTimerLoopIfNeeded();
  render();
  void upsertActiveSessionToSupabase(activeSession);
});

function createSessionId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `loc-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

pauseButton.addEventListener("click", () => {
  togglePauseSession();
});

openManualButton.addEventListener("click", () => {
  openManualDialog();
});

activeStartDisplay.addEventListener("click", () => {
  showActiveStartEditor();
});

activeStartDialogCancelButton?.addEventListener("click", () => {
  hideActiveStartEditor();
});

activeStartDialogSaveButton?.addEventListener("click", () => {
  updateActiveSessionStart({ reportValidity: true, closeEditor: true, audit: true });
});

projectInput.addEventListener("input", () => {
  projectInput.setCustomValidity("");
  applyProjectMemoryFromInput();
  updateFieldManageButtons();
});

projectInput.addEventListener("blur", () => {
  applyProjectMemoryFromInput();
  void canonicalizeProjectInput();
});

collaboratorInput.addEventListener("change", () => {
  collaboratorInput.setCustomValidity("");
  applyProjectMemoryFromInput();
  renderQuickProjects();
  renderProjectMemoryList();
  renderCadreViews();
  void canonicalizeCollaboratorInput();
});

collaboratorInput.addEventListener("input", () => {
  collaboratorInput.setCustomValidity("");
  renderCurrentUserContext();
});

categoriesInput.addEventListener("input", () => {
  categoriesInput.setCustomValidity("");
  updateFieldManageButtons();
});

categoriesInput.addEventListener("blur", () => {
  void canonicalizeCategorySelection();
});

[
  taskInput,
  notionInput,
  tagsInput,
  objectivePoleInput,
  objectiveOkrInput,
  objectiveKrInput,
].forEach((input) => {
  input.addEventListener("input", () => {
    updateFieldManageButtons();
    syncActiveSessionDraftFromForm();
  });
  input.addEventListener("change", () => {
    syncActiveSessionDraftFromForm({ audit: true, source: "active-session-field" });
  });
});

[projectInput, notesInput].forEach((input) => {
  input.addEventListener("input", () => {
    syncActiveSessionDraftFromForm();
  });
  input.addEventListener("change", () => {
    syncActiveSessionDraftFromForm({ audit: true, source: "active-session-field" });
  });
});

quickProjects.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-memory-key]");
  if (!button) {
    return;
  }

  const memory = getProjectMemories(getCurrentCollaborator()).find((item) => item.key === button.dataset.memoryKey);
  if (!memory) {
    return;
  }

  fillFormFromMemory(memory);
});

quickProjects.addEventListener("dragstart", (event) => {
  const chip = event.target.closest(".chip[data-memory-key]");
  if (!chip) {
    return;
  }

  quickProjectsDragState = {
    key: chip.dataset.memoryKey,
    collaborator: getCurrentCollaborator(),
  };
  quickProjects.classList.add("chip-row--sorting");
  repriseActionsShell?.removeAttribute("hidden");
  chip.classList.add("chip--dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", chip.dataset.memoryKey);
});

quickProjects.addEventListener("dragover", (event) => {
  if (!quickProjectsDragState) {
    return;
  }
  event.preventDefault();

  const dragging = quickProjects.querySelector(".chip--dragging");
  if (!dragging) {
    return;
  }

  const target = event.target.closest(".chip[data-memory-key]");
  quickProjects.querySelectorAll(".chip--drop-target").forEach((chip) => chip.classList.remove("chip--drop-target"));

  if (!target || target === dragging) {
    const bounds = quickProjects.getBoundingClientRect();
    if (event.clientX > bounds.left + bounds.width - 44) {
      const beforePositions = captureChipPositions(quickProjects);
      quickProjects.append(dragging);
      animateChipReorder(quickProjects, beforePositions);
    }
    return;
  }

  target.classList.add("chip--drop-target");
  const rect = target.getBoundingClientRect();
  const insertAfter = event.clientX > rect.left + rect.width / 2;
  const beforePositions = captureChipPositions(quickProjects);
  if (insertAfter) {
    quickProjects.insertBefore(dragging, target.nextSibling);
  } else {
    quickProjects.insertBefore(dragging, target);
  }
  animateChipReorder(quickProjects, beforePositions);
});

quickProjects.addEventListener("drop", (event) => {
  if (!quickProjectsDragState) {
    return;
  }
  event.preventDefault();
  quickProjects.querySelectorAll(".chip--drop-target").forEach((chip) => chip.classList.remove("chip--drop-target"));
  persistReprisesOrderFromDom();
  renderQuickProjects();
  renderProjectMemoryList();
});

quickProjects.addEventListener("dragleave", (event) => {
  const relatedTarget = event.relatedTarget;
  if (relatedTarget && quickProjects.contains(relatedTarget)) {
    return;
  }
  quickProjects.querySelectorAll(".chip--drop-target").forEach((chip) => chip.classList.remove("chip--drop-target"));
});

quickProjects.addEventListener("dragend", () => {
  quickProjects.querySelectorAll(".chip--dragging").forEach((chip) => chip.classList.remove("chip--dragging"));
  quickProjects.querySelectorAll(".chip--drop-target").forEach((chip) => chip.classList.remove("chip--drop-target"));
  quickProjects.classList.remove("chip-row--sorting");
  repriseActionsShell?.setAttribute("hidden", "");
  repriseArchiveZone?.classList.remove("reprise-dropzone--active");
  repriseDoneZone?.classList.remove("reprise-dropzone--active");
  quickProjectsDragState = null;
});

function setupRepriseDropzone(zone, actionKind) {
  if (!zone) {
    return;
  }

  zone.addEventListener("dragover", (event) => {
    if (!quickProjectsDragState) {
      return;
    }
    event.preventDefault();
    zone.classList.add("reprise-dropzone--active");
  });

  zone.addEventListener("dragleave", (event) => {
    const relatedTarget = event.relatedTarget;
    if (relatedTarget && zone.contains(relatedTarget)) {
      return;
    }
    zone.classList.remove("reprise-dropzone--active");
  });

  zone.addEventListener("drop", async (event) => {
    if (!quickProjectsDragState) {
      return;
    }
    event.preventDefault();
    zone.classList.remove("reprise-dropzone--active");

    const memory = getProjectMemories(quickProjectsDragState.collaborator).find(
      (item) => item.key === quickProjectsDragState.key,
    );
    if (!memory) {
      repriseActionsShell?.setAttribute("hidden", "");
      quickProjectsDragState = null;
      return;
    }

    await saveRepriseAction(memory, actionKind);
    repriseActionsShell?.setAttribute("hidden", "");
    quickProjectsDragState = null;
    renderQuickProjects();
    renderProjectMemoryList();
  });
}

setupRepriseDropzone(repriseArchiveZone, "archive");
setupRepriseDropzone(repriseDoneZone, "done");

projectMemoryList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-memory-key]");
  if (!button) {
    return;
  }

  const memory = getProjectMemories(getCurrentCollaborator()).find((item) => item.key === button.dataset.memoryKey);
  if (!memory) {
    return;
  }

  fillFormFromMemory(memory);
});

periodSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-period]");
  if (!button) {
    return;
  }

  reportPeriod = button.dataset.period;
  renderManagerControls();
  renderManagerViews();
});

personalStatsSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-stats-mode]");
  if (!button) {
    return;
  }

  statsMode = button.dataset.statsMode;
  render();
});

analysisStatsSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-stats-mode]");
  if (!button) {
    return;
  }

  statsMode = button.dataset.statsMode;
  render();
});

reportAnchorInput.addEventListener("change", () => {
  renderCadreViews();
  renderManagerViews();
  renderResourcesViews();
});

managerCollaboratorFilter.addEventListener("change", () => {
  renderManagerViews();
});

exportCsvButton?.addEventListener("click", () => {
  exportCurrentAnalysisCsv();
});

sessionList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".session-delete-button");
  if (deleteButton) {
    const sessionId = deleteButton.closest(".session-item")?.dataset.sessionId;
    const session = findSessionById(sessionId);
    if (!session) {
      return;
    }

    const label = session.project || session.task || "cette entree";
    if (!window.confirm(`Supprimer ${label} ?`)) {
      return;
    }

    void deleteSessionEverywhere(session, { source: "journal-delete" });
    return;
  }

  const editButton = event.target.closest(".session-edit-button");
  if (!editButton) {
    return;
  }

  const sessionId = editButton.closest(".session-item")?.dataset.sessionId;
  const session = findSessionById(sessionId);
  if (!session) {
    return;
  }

  openManualDialog(session);
});

agendaBoard.addEventListener("pointerdown", (event) => {
  beginAgendaDrag(event);
});

agendaPrevWeekButton?.addEventListener("click", () => {
  shiftAgendaWeek(-1);
});

agendaCurrentWeekButton?.addEventListener("click", () => {
  reportAnchorInput.value = formatDateInput(new Date());
  renderCadreViews();
  renderManagerViews();
  renderResourcesViews();
});

agendaNextWeekButton?.addEventListener("click", () => {
  shiftAgendaWeek(1);
});

agendaBoard.addEventListener("click", (event) => {
  if (suppressNextAgendaClick) {
    suppressNextAgendaClick = false;
    return;
  }

  const target = event.target.closest("[data-session-id]");
  if (target) {
    const session = findSessionById(target.dataset.sessionId);
    if (session) {
      openManualDialog(session);
    }
    return;
  }

  const track = event.target.closest(".agenda-day-track");
  if (!track) {
    return;
  }

  const slot = resolveAgendaSlotFromClick(track, event);
  if (!slot) {
    return;
  }

  openManualDialog(null, slot);
});

saveManualButton.addEventListener("click", () => {
  saveManualEntry();
});

deleteManualButton?.addEventListener("click", () => {
  if (!manualEditingSessionId) {
    return;
  }

  const session =
    getPersistedActiveSessions().find((item) => item.id === manualEditingSessionId) ??
    findSessionById(manualEditingSessionId);
  if (!session) {
    return;
  }

  const label = session.project || session.task || "cette entree";
  if (!window.confirm(`Supprimer ${label} ?`)) {
    return;
  }

  void deleteSessionEverywhere(session, { source: "manual-delete" });
});

cancelManualButton.addEventListener("click", () => {
  manualEditingSessionId = null;
  if (deleteManualButton) {
    deleteManualButton.hidden = true;
  }
  manualDialog.close();
});

cancelConflictButton.addEventListener("click", () => {
  pendingConflict = null;
  conflictDialog.close();
});

editConflictButton.addEventListener("click", () => {
  if (!pendingConflict?.existingSession) {
    return;
  }

  const existingSession = pendingConflict.existingSession;
  pendingConflict = null;
  conflictDialog.close();
  openManualDialog(existingSession);
});

adjustConflictButton.addEventListener("click", () => {
  if (!pendingConflict) {
    return;
  }

  const adjustedSession = getAdjustedSession(pendingConflict.newSession, pendingConflict.existingSession);
  const callback = pendingConflict.onResolve;
  pendingConflict = null;
  conflictDialog.close();

  if (adjustedSession && callback) {
    callback(adjustedSession);
  }
});

[
  [manageProjectButton, "project"],
  [manageClientButton, "client"],
  [manageCategoryButton, "category"],
  [manageTagsButton, "tags"],
  [manageLinkButton, "link"],
  [managePoleButton, "pole"],
  [manageOkrButton, "okr"],
  [manageKrButton, "kr"],
].forEach(([button, kind]) => {
  button?.addEventListener("click", () => {
    openFieldManageDialog(kind);
  });
});

fieldManageCancelButton?.addEventListener("click", () => {
  resetFieldManageDialog();
  fieldManageDialog?.close();
});

fieldManageEditButton?.addEventListener("click", () => {
  if (!fieldManageState) {
    return;
  }
  focusFieldForEditing(fieldManageState.kind);
  resetFieldManageDialog();
  fieldManageDialog?.close();
});

fieldManageDeleteButton?.addEventListener("click", () => {
  fieldManageConfirmMode = true;
  syncFieldManageDialogMode();
});

fieldManageConfirmButton?.addEventListener("click", () => {
  if (!fieldManageState) {
    return;
  }
  applyFieldManageDeletion(fieldManageState.kind);
  resetFieldManageDialog();
  fieldManageDialog?.close();
});

fieldManageColorSaveButton?.addEventListener("click", async () => {
  if (!fieldManageState || fieldManageState.kind !== "category" || !fieldManageColorInput?.value) {
    return;
  }

  await saveCategoryColor(fieldManageState.detail, fieldManageColorInput.value);
  resetFieldManageDialog();
  fieldManageDialog?.close();
});

function createAutocompletePopover() {
  const popover = document.createElement("div");
  popover.className = "autocomplete-popover";
  popover.hidden = true;
  document.body.append(popover);
  return popover;
}

function getAutocompleteHost(config) {
  return config?.input?.closest("dialog[open]") ?? document.body;
}

function ensureAutocompleteHost(config) {
  const host = getAutocompleteHost(config);
  if (autocompletePopover.parentElement !== host) {
    host.append(autocompletePopover);
  }
}

function initializeAutocomplete() {
  const configs = [
    {
      input: collaboratorInput,
      getOptions: () =>
        getVisibleReferenceUsers().length
          ? getVisibleReferenceUsers().map((item) => item.user_name)
          : uniqueValues("collaborator"),
      applyValue: (value) => {
        collaboratorInput.value = value;
        collaboratorInput.dispatchEvent(new Event("change", { bubbles: true }));
      },
      allowCreate: () => canCreateCollaboratorReference(),
      createLabel: (value) => `Ajouter "${value}" comme nouveau cargonaute`,
      createValue: (value) => createUserReference(value),
    },
    {
      input: projectInput,
      getOptions: () =>
        referenceCatalog.loaded ? referenceCatalog.projects.map((item) => item.project_name) : uniqueValues("project"),
      applyValue: (value) => {
        projectInput.value = value;
        applyProjectMemoryFromInput();
      },
      allowCreate: true,
      createLabel: (value) => `Ajouter "${value}" comme nouveau projet`,
      createValue: (value) => createProjectReference(value, currentCategories[0] ?? ""),
    },
    {
      input: taskInput,
      getOptions: () => uniqueValues("task"),
      applyValue: (value) => {
        taskInput.value = value;
      },
    },
    {
      input: categoriesInput,
      getOptions: () =>
        referenceCatalog.loaded
          ? referenceCatalog.categories.map((item) => item.activity_category_label)
          : uniqueTokenValues("categories"),
      allowCreate: true,
      createLabel: (value) => `Ajouter "${value}" comme nouvelle categorie`,
      createValue: (value) =>
        createCategoryReference(value, {
          userName: collaboratorInput.value.trim(),
          projectName: projectInput.value.trim(),
        }),
      applyValue: (value) => {
        currentCategories = [value];
        renderCategoryTokens();
        categoriesInput.value = "";
      },
    },
    {
      input: tagsInput,
      getOptions: () => uniqueTokenValues("tags"),
      applyValue: (value) => {
        currentTags = Array.from(new Set([...currentTags, value]));
        renderTagTokens();
        tagsInput.value = "";
      },
    },
    {
      input: notionInput,
      getOptions: () => uniqueValues("notionRef"),
      applyValue: (value) => {
        notionInput.value = value;
      },
    },
    {
      input: objectivePoleInput,
      anchor: objectivePoleInput.closest(".objective-block"),
      getOptions: () => mergeSuggestionValues(OBJECTIVE_2026_PILLARS, uniqueValues("objectivePole")),
      applyValue: (value) => {
        objectivePoleInput.value = value;
      },
    },
    {
      input: objectiveOkrInput,
      anchor: objectiveOkrInput.closest(".objective-block"),
      getOptions: () => getObjectiveOkrOptions(objectivePoleInput.value.trim()),
      applyValue: (value) => {
        applyObjectiveOkrSelection(value, {
          poleInput: objectivePoleInput,
          okrInput: objectiveOkrInput,
        });
      },
    },
    {
      input: objectiveKrInput,
      anchor: objectiveKrInput.closest(".objective-block"),
      getOptions: () => getObjectiveKrOptions(objectivePoleInput.value.trim(), objectiveOkrInput.value.trim()),
      applyValue: (value) => {
        applyObjectiveKrSelection(value, {
          poleInput: objectivePoleInput,
          okrInput: objectiveOkrInput,
          krInput: objectiveKrInput,
        });
      },
    },
    {
      input: manualCollaboratorInput,
      getOptions: () =>
        getVisibleReferenceUsers().length
          ? getVisibleReferenceUsers().map((item) => item.user_name)
          : uniqueValues("collaborator"),
      applyValue: (value) => {
        manualCollaboratorInput.value = value;
      },
      allowCreate: () => canCreateCollaboratorReference(),
      createLabel: (value) => `Ajouter "${value}" comme nouveau cargonaute`,
      createValue: (value) => createUserReference(value),
    },
    {
      input: manualProjectInput,
      getOptions: () =>
        referenceCatalog.loaded ? referenceCatalog.projects.map((item) => item.project_name) : uniqueValues("project"),
      applyValue: (value) => {
        manualProjectInput.value = value;
      },
      allowCreate: true,
      createLabel: (value) => `Ajouter "${value}" comme nouveau projet`,
      createValue: (value) => createProjectReference(value, parseTokenString(manualCategoriesInput.value)[0] ?? ""),
    },
    {
      input: manualTaskInput,
      getOptions: () => uniqueValues("task"),
      applyValue: (value) => {
        manualTaskInput.value = value;
      },
    },
    {
      input: manualCategoriesInput,
      getOptions: () =>
        referenceCatalog.loaded
          ? referenceCatalog.categories.map((item) => item.activity_category_label)
          : uniqueTokenValues("categories"),
      allowCreate: true,
      createLabel: (value) => `Ajouter "${value}" comme nouvelle categorie`,
      createValue: (value) =>
        createCategoryReference(value, {
          userName: manualCollaboratorInput.value.trim(),
          projectName: manualProjectInput.value.trim(),
        }),
      applyValue: (value) => {
        manualCategoriesInput.value = value;
      },
    },
    {
      input: manualTagsInput,
      getOptions: () => uniqueTokenValues("tags"),
      applyValue: (value) => {
        const tokens = Array.from(new Set([...parseTokenString(manualTagsInput.value), value]));
        manualTagsInput.value = tokens.join(", ");
      },
    },
    {
      input: manualNotionInput,
      getOptions: () => uniqueValues("notionRef"),
      applyValue: (value) => {
        manualNotionInput.value = value;
      },
    },
    {
      input: manualObjectivePoleInput,
      anchor: manualObjectivePoleInput.closest(".objective-block"),
      getOptions: () => mergeSuggestionValues(OBJECTIVE_2026_PILLARS, uniqueValues("objectivePole")),
      applyValue: (value) => {
        manualObjectivePoleInput.value = value;
      },
    },
    {
      input: manualObjectiveOkrInput,
      anchor: manualObjectiveOkrInput.closest(".objective-block"),
      getOptions: () => getObjectiveOkrOptions(manualObjectivePoleInput.value.trim()),
      applyValue: (value) => {
        applyObjectiveOkrSelection(value, {
          poleInput: manualObjectivePoleInput,
          okrInput: manualObjectiveOkrInput,
        });
      },
    },
    {
      input: manualObjectiveKrInput,
      anchor: manualObjectiveKrInput.closest(".objective-block"),
      getOptions: () => getObjectiveKrOptions(
        manualObjectivePoleInput.value.trim(),
        manualObjectiveOkrInput.value.trim(),
      ),
      applyValue: (value) => {
        applyObjectiveKrSelection(value, {
          poleInput: manualObjectivePoleInput,
          okrInput: manualObjectiveOkrInput,
          krInput: manualObjectiveKrInput,
        });
      },
    },
  ];

  for (const config of configs) {
    setupAutocompleteInput(config);
  }

  document.addEventListener("pointerdown", (event) => {
    if (autocompletePopover.hidden) {
      return;
    }
    if (autocompletePopover.contains(event.target) || autocompleteState.config?.input === event.target) {
      return;
    }
    hideAutocomplete();
  });

  autocompletePopover.addEventListener("pointerenter", () => {
    clearAutocompleteHideTimeout();
  });

  autocompletePopover.addEventListener("pointerleave", () => {
    scheduleAutocompleteHide();
  });

  window.addEventListener("resize", () => {
    if (!autocompletePopover.hidden) {
      positionAutocomplete();
    }
  });

  window.addEventListener(
    "scroll",
    () => {
      if (!autocompletePopover.hidden) {
        positionAutocomplete();
      }
    },
    true,
  );
}

function setupAutocompleteInput(config) {
  config.input.removeAttribute("list");

  config.input.addEventListener("pointerdown", () => {
    clearAutocompleteHideTimeout();
    openAutocomplete(config);
  });

  config.input.addEventListener("focus", () => {
    clearAutocompleteHideTimeout();
    openAutocomplete(config);
  });

  config.input.addEventListener("input", () => {
    clearAutocompleteHideTimeout();
    openAutocomplete(config);
  });

  config.input.addEventListener("keydown", (event) => {
    if (autocompletePopover.hidden || autocompleteState.config?.input !== config.input) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveAutocompleteSelection(1);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      moveAutocompleteSelection(-1);
      return;
    }

    if (event.key === "Enter" || event.key === "Tab") {
      const selected = autocompleteState.items[autocompleteState.activeIndex];
      if (!selected) {
        return;
      }
      event.preventDefault();
      void applyAutocompleteItem(selected, config);
      return;
    }

    if (event.key === "Escape") {
      hideAutocomplete();
    }
  });

  config.input.addEventListener("blur", () => {
    scheduleAutocompleteHide();
  });
}

function applyBookFavicon() {
  const faviconLink = document.querySelector('link[rel="icon"]');
  if (!faviconLink) {
    return;
  }
  faviconLink.href = "icon.svg";
  faviconLink.type = "image/svg+xml";
}

function openAutocomplete(config) {
  clearAutocompleteHideTimeout();
  ensureAutocompleteHost(config);
  const query = config.input.value.trim();
  const items = buildAutocompleteItems(config, query);
  if (!items.length) {
    hideAutocomplete();
    return;
  }

  autocompleteState = {
    config,
    items,
    activeIndex: 0,
  };

  renderAutocomplete(query);
  positionAutocomplete();
  autocompletePopover.hidden = false;
}

function buildAutocompleteItems(config, query) {
  const options = Array.from(new Set((config.getOptions?.() ?? []).filter(Boolean))).sort((a, b) => a.localeCompare(b, "fr"));
  const rankedOptions = rankAutocompleteOptions(options, query);
  const visibleOptions = query ? rankedOptions.slice(0, 9) : rankedOptions;
  const matches = visibleOptions.map((value) => ({
    type: "option",
    value,
    label: value,
  }));

  const normalizedQuery = normalizeText(query);
  const exactMatch = normalizedQuery
    ? options.some((value) => normalizeText(value) === normalizedQuery)
    : false;

  const allowCreate = typeof config.allowCreate === "function" ? config.allowCreate() : config.allowCreate;

  if (allowCreate && normalizedQuery && !exactMatch) {
    matches.push({
      type: "create",
      value: query,
      label: config.createLabel ? config.createLabel(query) : `Ajouter "${query}"`,
    });
  }

  return matches;
}

function rankAutocompleteOptions(options, query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return options;
  }

  return options
    .map((value) => ({ value, score: getAutocompleteScore(value, normalizedQuery) }))
    .filter((item) => Number.isFinite(item.score))
    .sort((left, right) => {
      if (left.score !== right.score) {
        return left.score - right.score;
      }
      return left.value.localeCompare(right.value, "fr");
    })
    .map((item) => item.value);
}

function getAutocompleteScore(value, normalizedQuery) {
  const normalizedValue = normalizeText(value);
  if (!normalizedValue) {
    return Number.POSITIVE_INFINITY;
  }
  if (normalizedValue === normalizedQuery) {
    return 0;
  }
  if (normalizedValue.startsWith(normalizedQuery)) {
    return 1;
  }
  if (normalizedValue.split(" ").some((part) => part.startsWith(normalizedQuery))) {
    return 2;
  }
  if (normalizedValue.includes(normalizedQuery)) {
    return 3;
  }
  const compactQuery = normalizedQuery.replace(/\s+/g, "");
  const compactValue = normalizedValue.replace(/\s+/g, "");
  if (compactValue.includes(compactQuery)) {
    return 4;
  }
  return Number.POSITIVE_INFINITY;
}

function getObjectiveCatalogRows() {
  return OBJECTIVE_2026_CATALOG.map((item) => ({
    pole: item.pole,
    okr: `${item.okrCode} · ${item.okrLabel}`,
    krs: item.krs,
  }));
}

function getObjectiveOkrOptions(selectedPole = "") {
  const normalizedPole = normalizeText(selectedPole);
  const catalogOptions = getObjectiveCatalogRows()
    .filter((item) => !normalizedPole || normalizeText(item.pole) === normalizedPole)
    .map((item) => `${item.pole} · ${item.okr}`);

  return mergeSuggestionValues(catalogOptions, uniqueValues("objectiveOkr"));
}

function getObjectiveKrOptions(selectedPole = "", selectedOkr = "") {
  const normalizedPole = normalizeText(selectedPole);
  const normalizedOkr = normalizeText(selectedOkr);
  const catalogOptions = [];

  for (const item of getObjectiveCatalogRows()) {
    const poleMatches = !normalizedPole || normalizeText(item.pole) === normalizedPole;
    const okrMatches =
      !normalizedOkr ||
      normalizeText(item.okr) === normalizedOkr ||
      normalizeText(`${item.pole} · ${item.okr}`) === normalizedOkr;

    if (!poleMatches || !okrMatches) {
      continue;
    }

    for (const kr of item.krs) {
      catalogOptions.push(extractObjectiveKrContent(kr));
    }
  }

  return mergeSuggestionValues(catalogOptions, uniqueValues("objectiveKr").map(extractObjectiveKrContent));
}

function applyObjectiveOkrSelection(value, { poleInput, okrInput }) {
  const match = findObjectiveOkrMatch(value);
  if (match) {
    poleInput.value = match.pole;
    okrInput.value = match.okr;
    renderObjectiveSelections();
    return;
  }

  okrInput.value = value;
  renderObjectiveSelections();
}

function applyObjectiveKrSelection(value, { poleInput, okrInput, krInput }) {
  const match = findObjectiveKrMatch(value);
  if (match) {
    poleInput.value = match.pole;
    okrInput.value = match.okr;
    krInput.value = extractObjectiveKrContent(match.kr);
    renderObjectiveSelections();
    return;
  }

  krInput.value = extractObjectiveKrContent(value);
  renderObjectiveSelections();
}

function findObjectiveOkrMatch(rawValue) {
  const normalized = normalizeText(rawValue);
  if (!normalized) {
    return null;
  }

  for (const item of getObjectiveCatalogRows()) {
    const candidate = `${item.pole} · ${item.okr}`;
    if (normalizeText(candidate) === normalized || normalizeText(item.okr) === normalized) {
      return item;
    }
  }

  return null;
}

function findObjectiveKrMatch(rawValue) {
  const normalized = normalizeText(rawValue);
  if (!normalized) {
    return null;
  }

  for (const item of getObjectiveCatalogRows()) {
    for (const kr of item.krs) {
      const candidates = [
        kr,
        `${item.pole} · ${item.okr} · ${kr}`,
        extractObjectiveKrContent(kr),
      ];

      if (candidates.some((candidate) => normalizeText(candidate) === normalized)) {
        return {
          pole: item.pole,
          okr: item.okr,
          kr,
        };
      }
    }
  }

  return null;
}

function renderAutocomplete(query) {
  autocompletePopover.innerHTML = "";

  const shouldShowHint =
    autocompleteState.items.length >= 3 &&
    autocompleteState.items[0]?.type === "option" &&
    normalizeText(autocompleteState.items[0].value).startsWith(normalizeText(query));

  if (shouldShowHint) {
    const hint = document.createElement("div");
    hint.className = "autocomplete-hint";
    hint.textContent = `Suggestion immediate: ${autocompleteState.items[0].value} · Tab pour completer`;
    autocompletePopover.append(hint);
  }

  autocompleteState.items.forEach((item, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "autocomplete-option";
    if (item.type === "create") {
      button.classList.add("autocomplete-option-create");
    }
    if (index === autocompleteState.activeIndex) {
      button.classList.add("active");
    }
    button.textContent = item.label;
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      void applyAutocompleteItem(item, autocompleteState.config);
    });
    autocompletePopover.append(button);
  });
}

function positionAutocomplete() {
  const config = autocompleteState.config;
  const input = config?.input;
  if (!input) {
    return;
  }

  const anchor = config.anchor ?? input.closest(".token-field") ?? input;
  const rect = anchor.getBoundingClientRect();
  const host = getAutocompleteHost(config);

  if (host === document.body) {
    autocompletePopover.style.position = "fixed";
    autocompletePopover.style.left = `${rect.left}px`;
    autocompletePopover.style.top = `${rect.bottom + 8}px`;
  } else {
    const hostRect = host.getBoundingClientRect();
    autocompletePopover.style.position = "absolute";
    autocompletePopover.style.left = `${rect.left - hostRect.left}px`;
    autocompletePopover.style.top = `${rect.bottom - hostRect.top + 8}px`;
  }
  autocompletePopover.style.width = `${Math.max(rect.width, 320)}px`;
}

function moveAutocompleteSelection(direction) {
  const itemCount = autocompleteState.items.length;
  if (!itemCount) {
    return;
  }

  autocompleteState.activeIndex = (autocompleteState.activeIndex + direction + itemCount) % itemCount;
  renderAutocomplete(autocompleteState.config?.input.value.trim() ?? "");
}

async function applyAutocompleteItem(item, config) {
  let nextValue = item.value;

  if (item.type === "create" && config.createValue) {
    nextValue = await config.createValue(item.value);
    if (!nextValue) {
      return;
    }
  }

  config.applyValue(nextValue);
  hideAutocomplete();
}

function hideAutocomplete() {
  clearAutocompleteHideTimeout();
  autocompletePopover.hidden = true;
  autocompletePopover.innerHTML = "";
  autocompleteState = {
    config: null,
    items: [],
    activeIndex: 0,
  };
}

function beginAgendaDrag(event) {
  if (event.button !== 0) {
    return;
  }

  const eventElement = event.target.closest(".agenda-event");
  if (!eventElement) {
    return;
  }

  const sessionId = eventElement.dataset.sessionId;
  const session = findSessionById(sessionId);
  const track = eventElement.closest(".agenda-day-track");
  if (!session || !track) {
    return;
  }

  const hourHeight = Number(track.dataset.hourHeight);
  const startHour = Number(track.dataset.startHour);
  const endHour = Number(track.dataset.endHour);
  if (!Number.isFinite(hourHeight) || !Number.isFinite(startHour) || !Number.isFinite(endHour)) {
    return;
  }

  agendaDragState = {
    pointerId: event.pointerId,
    sessionId: session.id,
    originalSession: { ...session },
    previewSession: { ...session },
    eventElement,
    track,
    activeTrack: track,
    startPointerY: event.clientY,
    startPointerX: event.clientX,
    pointerOffsetY: event.clientY - eventElement.getBoundingClientRect().top,
    startHour,
    endHour,
    hourHeight,
    mode: resolveAgendaDragMode(event, eventElement),
    durationMs: Number(session.durationMs) || new Date(session.end).getTime() - new Date(session.start).getTime(),
    moved: false,
  };

  eventElement.classList.add("agenda-event--dragging");
  eventElement.setPointerCapture?.(event.pointerId);

  window.addEventListener("pointermove", handleAgendaDragMove);
  window.addEventListener("pointerup", handleAgendaDragEnd, { once: true });
  window.addEventListener("pointercancel", handleAgendaDragCancel, { once: true });
}

function resolveAgendaDragMode(event, eventElement) {
  if (event.target.closest(".agenda-resize-handle--start")) {
    return "resize-start";
  }
  if (event.target.closest(".agenda-resize-handle--end")) {
    return "resize-end";
  }

  const rect = eventElement.getBoundingClientRect();
  const offsetY = event.clientY - rect.top;
  const edgeThreshold = Math.min(Math.max(rect.height * 0.18, 10), 18);

  if (offsetY <= edgeThreshold) {
    return "resize-start";
  }
  if (offsetY >= rect.height - edgeThreshold) {
    return "resize-end";
  }
  return "move";
}

function handleAgendaDragMove(event) {
  if (!agendaDragState || event.pointerId !== agendaDragState.pointerId) {
    return;
  }

  const originalStart = new Date(agendaDragState.originalSession.start);
  const originalEnd = new Date(agendaDragState.originalSession.end);
  const activeTrack =
    agendaDragState.mode === "move" ? resolveAgendaTrackFromPoint(event.clientX, event.clientY) ?? agendaDragState.activeTrack : agendaDragState.activeTrack;
  if (!activeTrack) {
    return;
  }
  agendaDragState.activeTrack = activeTrack;
  const activeStartHour = Number(activeTrack.dataset.startHour);
  const activeEndHour = Number(activeTrack.dataset.endHour);
  const activeHourHeight = Number(activeTrack.dataset.hourHeight);
  const dayStart = new Date(activeTrack.dataset.dayDate + "T00:00:00");
  dayStart.setHours(activeStartHour, 0, 0, 0);
  const dayEnd = new Date(activeTrack.dataset.dayDate + "T00:00:00");
  dayEnd.setHours(activeEndHour, 0, 0, 0);

  let boundedStart = new Date(originalStart);
  let boundedEnd = new Date(originalEnd);

  if (agendaDragState.mode === "resize-start") {
    const deltaY = event.clientY - agendaDragState.startPointerY;
    const minuteDelta = roundToQuarterHour((deltaY / agendaDragState.hourHeight) * 60);
    boundedStart = new Date(originalStart.getTime() + minuteDelta * 60 * 1000);
    if (boundedStart < dayStart) {
      boundedStart = new Date(dayStart);
    }
    if (boundedStart >= boundedEnd) {
      boundedStart = new Date(boundedEnd.getTime() - 15 * 60 * 1000);
    }
  } else if (agendaDragState.mode === "resize-end") {
    const deltaY = event.clientY - agendaDragState.startPointerY;
    const minuteDelta = roundToQuarterHour((deltaY / agendaDragState.hourHeight) * 60);
    boundedEnd = new Date(originalEnd.getTime() + minuteDelta * 60 * 1000);
    if (boundedEnd > dayEnd) {
      boundedEnd = new Date(dayEnd);
    }
    if (boundedEnd <= boundedStart) {
      boundedEnd = new Date(boundedStart.getTime() + 15 * 60 * 1000);
    }
  } else {
    const trackRect = activeTrack.getBoundingClientRect();
    const rawTopPx = event.clientY - trackRect.top - agendaDragState.pointerOffsetY;
    const boundedTopPx = Math.min(
      Math.max(rawTopPx, 0),
      (activeEndHour - activeStartHour) * activeHourHeight - (agendaDragState.durationMs / 3600000) * activeHourHeight,
    );
    const minutesFromStart = roundToQuarterHour((boundedTopPx / activeHourHeight) * 60);

    boundedStart = new Date(dayStart.getTime() + minutesFromStart * 60 * 1000);
    boundedEnd = new Date(boundedStart.getTime() + agendaDragState.durationMs);

    if (boundedStart < dayStart) {
      boundedStart = new Date(dayStart);
      boundedEnd = new Date(dayStart.getTime() + agendaDragState.durationMs);
    }
    if (boundedEnd > dayEnd) {
      boundedEnd = new Date(dayEnd);
      boundedStart = new Date(dayEnd.getTime() - agendaDragState.durationMs);
    }
  }

  const nextDurationMs = Math.max(boundedEnd.getTime() - boundedStart.getTime(), 15 * 60 * 1000);

  agendaDragState.previewSession = {
    ...agendaDragState.originalSession,
    start: boundedStart.toISOString(),
    end: boundedEnd.toISOString(),
    durationMs: nextDurationMs,
  };

  agendaDragState.moved =
    boundedStart.getTime() !== originalStart.getTime() || boundedEnd.getTime() !== originalEnd.getTime();

  updateAgendaEventPreview(agendaDragState);
}

function handleAgendaDragEnd(event) {
  if (!agendaDragState || event.pointerId !== agendaDragState.pointerId) {
    cleanupAgendaDrag();
    return;
  }

  const state = agendaDragState;
  cleanupAgendaDrag();

  if (!state.moved) {
    return;
  }

  suppressNextAgendaClick = true;
  if (state.originalSession.isServerActive) {
    const nextActiveSession = normalizeSession({
      ...state.originalSession,
      ...state.previewSession,
      isServerActive: true,
    });
    activeSession =
      activeSession?.id === nextActiveSession.id ? nextActiveSession : activeSession;
    persistActiveSession();
    void logSessionChange(state.originalSession, nextActiveSession, `agenda-${state.mode}`);
    render();
    void upsertActiveSessionToSupabase(nextActiveSession);
    return;
  }

  attemptSaveSession(state.previewSession, {
    excludeId: state.originalSession.id,
    onSuccess: (sessionToSave) => {
      upsertSession(sessionToSave);
      persistSessions();
      void logSessionChange(state.originalSession, sessionToSave, `agenda-${state.mode}`);
      void syncSessionToSupabase(sessionToSave, "manual");
      render();
    },
  });
}

function handleAgendaDragCancel() {
  cleanupAgendaDrag();
  render();
}

function cleanupAgendaDrag() {
  if (!agendaDragState) {
    return;
  }

  agendaDragState.eventElement.classList.remove("agenda-event--dragging");
  agendaDragState.eventElement.releasePointerCapture?.(agendaDragState.pointerId);
  agendaDragState = null;
  window.removeEventListener("pointermove", handleAgendaDragMove);
}

function updateAgendaEventPreview(state) {
  if (state.activeTrack && state.eventElement.parentElement !== state.activeTrack) {
    state.activeTrack.append(state.eventElement);
  }

  const start = new Date(state.previewSession.start);
  const end = new Date(state.previewSession.end);
  const startHour = Number(state.activeTrack?.dataset.startHour ?? state.startHour);
  const hourHeight = Number(state.activeTrack?.dataset.hourHeight ?? state.hourHeight);
  const topMinutes = (start.getHours() - startHour) * 60 + start.getMinutes();
  const durationMinutes = Math.max((end.getTime() - start.getTime()) / 60000, 15);
  const topPx = (topMinutes / 60) * hourHeight;
  const heightPx = Math.max((durationMinutes / 60) * hourHeight, 4);

  state.eventElement.style.top = `${topPx}px`;
  state.eventElement.style.height = `${heightPx}px`;
  state.eventElement.style.left = "0%";
  state.eventElement.style.width = "100%";

  const visualSize = getAgendaEventVisualSize(heightPx);
  state.eventElement.classList.toggle("agenda-event--tiny", visualSize === "tiny");
  state.eventElement.classList.toggle("agenda-event--compact", visualSize === "compact");
  renderAgendaEventContents(state.eventElement, state.previewSession, visualSize);
}

function resolveAgendaTrackFromPoint(clientX, clientY) {
  const element = document.elementFromPoint(clientX, clientY);
  return element?.closest(".agenda-day-track") ?? null;
}

function clearAutocompleteHideTimeout() {
  if (!autocompleteHideTimeoutId) {
    return;
  }

  window.clearTimeout(autocompleteHideTimeoutId);
  autocompleteHideTimeoutId = null;
}

function scheduleAutocompleteHide() {
  clearAutocompleteHideTimeout();
  autocompleteHideTimeoutId = window.setTimeout(() => {
    const activeInput = autocompleteState.config?.input;
    if (!activeInput) {
      hideAutocomplete();
      return;
    }

    const focusedInsidePopover = autocompletePopover.contains(document.activeElement);
    if (document.activeElement === activeInput || focusedInsidePopover || autocompletePopover.matches(":hover")) {
      return;
    }

    hideAutocomplete();
  }, 160);
}

function getInitialView() {
  const hash = window.location.hash.replace("#", "");
  return ["cadre", "manager", "resources", "journal"].includes(hash) ? hash : "cadre";
}

function initializeObjectiveSelections() {
  setupObjectiveDisclosure({
    disclosure: objectiveDisclosure,
    summaryText: objectiveSummaryText,
    poleInput: objectivePoleInput,
    okrInput: objectiveOkrInput,
    krInput: objectiveKrInput,
  });
  setupObjectiveDisclosure({
    disclosure: manualObjectiveDisclosure,
    summaryText: manualObjectiveSummaryText,
    poleInput: manualObjectivePoleInput,
    okrInput: manualObjectiveOkrInput,
    krInput: manualObjectiveKrInput,
  });

  setupSingleSelectionDisplay({
    input: objectivePoleInput,
    container: objectivePoleSelected,
  });
  setupSingleSelectionDisplay({
    input: objectiveOkrInput,
    container: objectiveOkrSelected,
  });
  setupSingleSelectionDisplay({
    input: objectiveKrInput,
    container: objectiveKrSelected,
  });
  setupSingleSelectionDisplay({
    input: manualObjectivePoleInput,
    container: manualObjectivePoleSelected,
  });
  setupSingleSelectionDisplay({
    input: manualObjectiveOkrInput,
    container: manualObjectiveOkrSelected,
  });
  setupSingleSelectionDisplay({
    input: manualObjectiveKrInput,
    container: manualObjectiveKrSelected,
  });

  renderObjectiveSelections();
}

function setupObjectiveDisclosure({ disclosure, summaryText, poleInput, okrInput, krInput }) {
  if (!disclosure || !summaryText) {
    return;
  }

  const updateSummary = () => {
    renderObjectiveDisclosureSummary(summaryText, {
      pole: poleInput?.value.trim() ?? "",
      okr: okrInput?.value.trim() ?? "",
      kr: krInput?.value.trim() ?? "",
    });
  };

  for (const input of [poleInput, okrInput, krInput]) {
    input?.addEventListener("input", updateSummary);
    input?.addEventListener("blur", updateSummary);
  }

  updateSummary();
}

function setupSingleSelectionDisplay({ input, container }) {
  if (!input || !container) {
    return;
  }

  input.addEventListener("input", () => {
    renderSingleSelectionTag(input, container, { forceHidden: true });
  });

  input.addEventListener("blur", () => {
    renderSingleSelectionTag(input, container);
  });

  input.addEventListener("focus", () => {
    renderSingleSelectionTag(input, container, { forceHidden: true });
  });
}

function renderObjectiveSelections() {
  renderSingleSelectionTag(objectivePoleInput, objectivePoleSelected);
  renderSingleSelectionTag(objectiveOkrInput, objectiveOkrSelected);
  renderSingleSelectionTag(objectiveKrInput, objectiveKrSelected);
  renderSingleSelectionTag(manualObjectivePoleInput, manualObjectivePoleSelected);
  renderSingleSelectionTag(manualObjectiveOkrInput, manualObjectiveOkrSelected);
  renderSingleSelectionTag(manualObjectiveKrInput, manualObjectiveKrSelected);
  renderObjectiveDisclosureSummary(objectiveSummaryText, {
    pole: objectivePoleInput.value.trim(),
    okr: objectiveOkrInput.value.trim(),
    kr: objectiveKrInput.value.trim(),
  });
  renderObjectiveDisclosureSummary(manualObjectiveSummaryText, {
    pole: manualObjectivePoleInput.value.trim(),
    okr: manualObjectiveOkrInput.value.trim(),
    kr: manualObjectiveKrInput.value.trim(),
  });
  updateFieldManageButtons();
}

function renderObjectiveDisclosureSummary(summaryNode, values) {
  if (!summaryNode) {
    return;
  }

  const parts = [
    formatObjectiveSummaryPole(values.pole),
    formatObjectiveSummaryOkr(values.okr),
    formatObjectiveSummaryKr(values.kr),
  ].filter(Boolean);

  summaryNode.textContent = parts.length ? parts.join(" · ") : "";
}

function formatObjectiveSummaryPole(value) {
  return value?.trim() || "";
}

function formatObjectiveSummaryOkr(value) {
  const normalized = value?.trim();
  if (!normalized) {
    return "";
  }

  const match = normalized.match(/^O\d+/i);
  return match ? match[0].toUpperCase() : truncateObjectiveSummary(normalized, 36);
}

function formatObjectiveSummaryKr(value) {
  const normalized = value?.trim();
  if (!normalized) {
    return "";
  }

  const match = normalized.match(/^RC\s*\d+(?:\.\d+)?/i);
  return match ? match[0].replace(/\s+/g, " ").toUpperCase() : truncateObjectiveSummary(normalized, 44);
}

function truncateObjectiveSummary(value, limit) {
  if (value.length <= limit) {
    return value;
  }

  return `${value.slice(0, Math.max(0, limit - 1)).trimEnd()}…`;
}

function renderSingleSelectionTag(input, container, options = {}) {
  if (!input || !container) {
    return;
  }

  const value = input.value.trim();
  container.innerHTML = "";

  if (!value || options.forceHidden) {
    container.hidden = true;
    return;
  }

  const chip = document.createElement("span");
  chip.className = "token-chip single-token-chip";

  const label = document.createElement("span");
  label.textContent = value;

  const remove = document.createElement("button");
  remove.type = "button";
  remove.setAttribute("aria-label", `Retirer ${value}`);
  remove.textContent = "x";
  remove.addEventListener("click", () => {
    input.value = "";
    container.hidden = true;
    updateFieldManageButtons();
    input.focus();
  });

  chip.append(label, remove);
  container.append(chip);
  container.hidden = false;
}

function initializeViewNavigation() {
  for (const tab of viewTabs) {
    tab.addEventListener("click", () => {
      setCurrentView(tab.dataset.viewTarget);
    });
  }

  window.addEventListener("hashchange", () => {
    const nextView = getInitialView();
    if (nextView !== currentView) {
      currentView = nextView;
      renderViewChrome();
    }
  });
}

function setCurrentView(view) {
  if (!view || view === currentView) {
    return;
  }

  currentView = view;
  window.history.replaceState(null, "", `#${view}`);
  renderViewChrome();
}

function renderViewChrome() {
  const allowedViews = getAllowedViewsForRole();
  if (!allowedViews.includes(currentView)) {
    currentView = allowedViews[0];
    window.history.replaceState(null, "", `#${currentView}`);
  }

  for (const tab of viewTabs) {
    const isAllowed = allowedViews.includes(tab.dataset.viewTarget);
    tab.hidden = !isAllowed;
    tab.classList.toggle("active", isAllowed && tab.dataset.viewTarget === currentView);
  }

  for (const panel of viewPanels) {
    const isAllowed = allowedViews.includes(panel.dataset.viewPanel);
    const isActive = isAllowed && panel.dataset.viewPanel === currentView;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  }

  const isAnalysisView = allowedViews.includes(currentView) && (currentView === "manager" || currentView === "resources");
  analysisToolbarPanel.hidden = !isAnalysisView;
  if (analysisToolbarTitle) {
    analysisToolbarTitle.textContent = currentView === "resources" ? "Vue ressources" : "Pilotage manager";
  }
  if (analysisCollaboratorFilterWrap) {
    analysisCollaboratorFilterWrap.hidden = currentView !== "manager";
  }
}

function loadSessions() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const normalized = parsed.map(normalizeSession);
    const demoSessions = LOCAL_DEMO_SESSIONS.map(normalizeSession);
    if (!normalized.length) {
      return demoSessions;
    }

    const demoCollaborators = new Set(
      LOCAL_DEMO_SESSIONS.map((session) => normalizeText(session.collaborator)),
    );
    const hasVisibleDemoProfiles = normalized.some((session) =>
      demoCollaborators.has(normalizeText(session.collaborator)),
    );

    return hasVisibleDemoProfiles ? normalized : [...demoSessions, ...normalized];
  } catch {
    return LOCAL_DEMO_SESSIONS.map(normalizeSession);
  }
}

function loadActiveSession() {
  try {
    const raw = window.localStorage.getItem(ACTIVE_SESSION_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return parsed ? normalizeSession(parsed) : null;
  } catch {
    return null;
  }
}

function normalizeSession(session) {
  return {
    ...session,
    id: session.id ?? session.time_entry_id ?? session.active_session_id ?? createSessionId(),
    collaborator: session.collaborator ?? "",
    project: session.project ?? "",
    task: session.task ?? "",
    categories: Array.isArray(session.categories) ? session.categories.filter(Boolean) : [],
    tags: Array.isArray(session.tags) ? session.tags.filter(Boolean) : [],
    notionRef: session.notionRef ?? "",
    objectivePole: session.objectivePole ?? "",
    objectiveOkr: session.objectiveOkr ?? "",
    objectiveKr: session.objectiveKr ?? "",
    notes: session.notes ?? "",
    pausedAt: session.pausedAt ?? null,
    pausedDurationMs: Number(session.pausedDurationMs) || 0,
    durationMs: Number(session.durationMs) || 0,
    dbTimeEntryId: session.dbTimeEntryId ?? null,
    dbActiveSessionId: session.dbActiveSessionId ?? null,
    dbUserId: session.dbUserId ?? null,
    dbProjectId: session.dbProjectId ?? null,
    dbActivityCategoryId: session.dbActivityCategoryId ?? null,
    dbTeamName: session.dbTeamName ?? "",
    dbClientName: session.dbClientName ?? "",
    dbKpiCategoryLabel: session.dbKpiCategoryLabel ?? "",
    isServerBacked: Boolean(session.isServerBacked),
    isServerActive: Boolean(session.isServerActive),
  };
}

function parseCsvTokens(rawValue) {
  return String(rawValue ?? "")
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
}

function findUserByName(rawName) {
  return findReferenceMatch(getKnownUsers(), "user_name", rawName);
}

function getSessionSourceUser(session) {
  return (
    getKnownUsers().find((item) => item.user_id === session?.dbUserId) ??
    findUserByName(session?.collaborator ?? "") ??
    accessProfile.appUser ??
    null
  );
}

function mapTimeEntryRowToSession(row) {
  const startIso = row.started_at ?? row.created_at ?? `${row.entry_date}T09:00:00.000Z`;
  const start = new Date(startIso);
  const durationMs = Math.max(Number(row.duration_minutes ?? 0) * 60000, 0);
  const endIso = row.ended_at ?? new Date(start.getTime() + durationMs).toISOString();

  return normalizeSession({
    id: row.source_session_id ?? row.time_entry_id,
    collaborator: row.user_name ?? "",
    project: row.project_name ?? "",
    task: row.task_label ?? "",
    categories: row.activity_category_label ? [row.activity_category_label] : [],
    tags: parseCsvTokens(row.tags_text),
    notionRef: row.notion_ref ?? "",
    objectivePole: row.objective_pole ?? "",
    objectiveOkr: row.objective_okr ?? "",
    objectiveKr: row.objective_kr ?? "",
    notes: row.notes ?? "",
    start: start.toISOString(),
    end: endIso,
    durationMs,
    dbTimeEntryId: row.time_entry_id ?? null,
    dbUserId: row.user_id ?? null,
    dbProjectId: row.project_id ?? null,
    dbActivityCategoryId: row.activity_category_id ?? null,
    dbTeamName: row.team_name ?? "",
    dbClientName: row.client_name ?? "",
    dbKpiCategoryLabel: row.kpi_category_label ?? "",
    isServerBacked: true,
  });
}

function mapActiveSessionRowToSession(row) {
  return normalizeSession({
    id: row.active_session_id,
    collaborator: row.user_name ?? "",
    project: row.project_name ?? "",
    task: row.task_label ?? "",
    categories: row.activity_category_label ? [row.activity_category_label] : [],
    tags: parseCsvTokens(row.tags_text),
    notionRef: row.notion_ref ?? "",
    objectivePole: row.objective_pole ?? "",
    objectiveOkr: row.objective_okr ?? "",
    objectiveKr: row.objective_kr ?? "",
    notes: row.notes ?? "",
    start: row.started_at ?? row.created_at ?? new Date().toISOString(),
    pausedAt: row.paused_at ?? null,
    pausedDurationMs: Number(row.paused_duration_ms) || 0,
    durationMs: 0,
    dbActiveSessionId: row.active_session_id,
    dbUserId: row.user_id ?? null,
    dbProjectId: row.project_id ?? null,
    dbActivityCategoryId: row.activity_category_id ?? null,
    dbTeamName: row.team_name ?? "",
    dbClientName: row.client_name ?? "",
    dbKpiCategoryLabel: row.kpi_category_label ?? "",
    isServerBacked: true,
    isServerActive: true,
  });
}

function hydrateRemoteState(historyRows, activeRows) {
  sessions = historyRows
    .map(mapTimeEntryRowToSession)
    .sort((left, right) => new Date(right.start) - new Date(left.start));

  remoteActiveSessions = activeRows
    .map(mapActiveSessionRowToSession)
    .sort((left, right) => new Date(right.start) - new Date(left.start));

  const currentUserName = accessProfile.appUser?.user_name ?? "";
  activeSession = currentUserName
    ? remoteActiveSessions.find((session) => normalizeText(session.collaborator) === normalizeText(currentUserName)) ?? null
    : null;

  persistSessions();
  persistActiveSession();
  syncTimerLoopWithActiveSession();
}

function hydrateRepriseActions(rows) {
  repriseActions = (rows ?? []).map((row) => ({
    subject_user_name: row.subject_user_name ?? "",
    memory_key: row.memory_key ?? "",
    subject_project_name: row.subject_project_name ?? "",
    action_kind: row.action_kind ?? "archive",
    actor_name: row.actor_name ?? "",
    created_at: row.created_at ?? null,
    updated_at: row.updated_at ?? null,
  }));
  storeRepriseActions(repriseActions);
}

function persistSessions() {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function persistActiveSession() {
  if (!activeSession) {
    window.localStorage.removeItem(ACTIVE_SESSION_KEY);
    return;
  }

  window.localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(activeSession));
}

async function loadServerBackedState({ silent = false } = {}) {
  if (!window.supabase) {
    return false;
  }

  if (remoteStateLoadingPromise) {
    return remoteStateLoadingPromise;
  }

  remoteStateLoadingPromise = (async () => {
    const [historyResult, activeResult, repriseActionsResult] = await Promise.allSettled([
      window.supabase.from("time_entries").select("*").order("created_at", { ascending: false }),
      window.supabase.from("active_sessions").select("*").order("updated_at", { ascending: false }),
      window.supabase.from("reprise_actions").select("*").order("updated_at", { ascending: false }),
    ]);

    const historyRows =
      historyResult.status === "fulfilled" && !historyResult.value.error ? historyResult.value.data ?? [] : null;
    const activeRows =
      activeResult.status === "fulfilled" && !activeResult.value.error ? activeResult.value.data ?? [] : null;
    const repriseActionRows =
      repriseActionsResult.status === "fulfilled" && !repriseActionsResult.value.error
        ? repriseActionsResult.value.data ?? []
        : null;

    if (!historyRows && !activeRows && !repriseActionRows) {
      if (historyResult.status === "fulfilled" && historyResult.value.error) {
        console.warn("time_entries load failed:", historyResult.value.error);
      }
      if (activeResult.status === "fulfilled" && activeResult.value.error) {
        console.warn("active_sessions load failed:", activeResult.value.error);
      }
      if (repriseActionsResult.status === "fulfilled" && repriseActionsResult.value.error) {
        console.warn("reprise_actions load failed:", repriseActionsResult.value.error);
      }
      return false;
    }

    hydrateRemoteState(historyRows ?? [], activeRows ?? []);
    hydrateRepriseActions(repriseActionRows ?? repriseActions);
    remoteStateAvailable = true;

    if (!silent) {
      render();
    }
    return true;
  })();

  const result = await remoteStateLoadingPromise;
  remoteStateLoadingPromise = null;
  return result;
}

function scheduleActiveSessionServerSync({ immediate = false } = {}) {
  if (!activeSession || !window.supabase) {
    return;
  }

  if (activeDraftSyncTimeoutId) {
    window.clearTimeout(activeDraftSyncTimeoutId);
    activeDraftSyncTimeoutId = null;
  }

  const sync = () => {
    activeDraftSyncTimeoutId = null;
    void upsertActiveSessionToSupabase(activeSession);
  };

  if (immediate) {
    sync();
    return;
  }

  activeDraftSyncTimeoutId = window.setTimeout(sync, 600);
}

function startRemoteSyncLoop() {
  if (remoteSyncIntervalId || !window.supabase) {
    return;
  }

  remoteSyncIntervalId = window.setInterval(() => {
    void loadServerBackedState({ silent: false });
  }, REMOTE_SYNC_INTERVAL_MS);
}

function syncActiveSessionDraftFromForm({ audit = false, source = "active-session-context" } = {}) {
  if (!activeSession) {
    return;
  }

  const previousSession = { ...activeSession };
  activeSession = {
    ...activeSession,
    ...readFormValues(),
  };
  persistActiveSession();
  renderActiveSession();
  scheduleActiveSessionServerSync({ immediate: audit });
  if (audit) {
    void logSessionChange(previousSession, activeSession, source);
  }
}

function syncTimerLoopWithActiveSession() {
  if (activeSession && !activeSession.pausedAt) {
    startTimerLoopIfNeeded();
    return;
  }

  stopTimerLoop();
}

function hydrateFormFromActiveSession() {
  const source = activeSession ?? sessions[0] ?? null;
  collaboratorInput.value = activeSession?.collaborator ?? source?.collaborator ?? "";
  projectInput.value = activeSession?.project ?? "";
  taskInput.value = activeSession?.task ?? "";
  notionInput.value = activeSession?.notionRef ?? "";
  objectivePoleInput.value = activeSession?.objectivePole ?? source?.objectivePole ?? "";
  objectiveOkrInput.value = activeSession?.objectiveOkr ?? source?.objectiveOkr ?? "";
  objectiveKrInput.value = activeSession?.objectiveKr ?? source?.objectiveKr ?? "";
  notesInput.value = activeSession?.notes ?? "";
  currentCategories = [...(activeSession?.categories ?? [])];
  currentTags = [...(activeSession?.tags ?? [])];
  renderCategoryTokens();
  renderTagTokens();
  renderObjectiveSelections();
}

function setDefaultReportAnchor() {
  reportAnchorInput.value = formatDateInput(new Date());
}

function readFormValues() {
  return {
    collaborator: getEffectiveCollaboratorValue(collaboratorInput.value),
    project: projectInput.value.trim(),
    task: taskInput.value.trim(),
    categories: [...currentCategories],
    tags: [...currentTags],
    notionRef: notionInput.value.trim(),
    objectivePole: objectivePoleInput.value.trim(),
    objectiveOkr: objectiveOkrInput.value.trim(),
    objectiveKr: objectiveKrInput.value.trim(),
    notes: notesInput.value.trim(),
  };
}

async function validateAndNormalizeMainForm() {
  const sessionDraft = readFormValues();

  if (!sessionDraft.collaborator) {
    showAuthRequiredMessage();
    return null;
  }
  if (!sessionDraft.project) {
    showFieldResolutionError(projectInput, "Choisissez ou saisissez un projet avant de demarrer.");
    return null;
  }

  const resolved = await resolveDraftReferences(sessionDraft, { allowCreate: false });
  if (!resolved.loaded) {
    return hydrateSessionDraftDefaults(sessionDraft);
  }

  const normalizedDraft = buildCanonicalSessionDraft(sessionDraft, resolved);
  const hydratedDraft = hydrateSessionDraftDefaults(normalizedDraft);
  applyCanonicalDraftToMainForm(hydratedDraft);
  return hydratedDraft;
}

function hydrateSessionDraftDefaults(sessionDraft) {
  const hydratedDraft = {
    ...sessionDraft,
    categories: Array.isArray(sessionDraft.categories) ? [...sessionDraft.categories].slice(0, 1) : [],
  };

  if (hydratedDraft.categories.length) {
    return hydratedDraft;
  }

  const memory = resolveProjectMemory(hydratedDraft.project, hydratedDraft.collaborator);
  if (memory?.categories?.length) {
    hydratedDraft.categories = [...memory.categories].slice(0, 1);
  }

  return hydratedDraft;
}

function showFieldResolutionError(input, message) {
  if (authStatus) {
    authStatus.hidden = false;
    authStatus.textContent = message;
  }
  input.setCustomValidity(message);
  input.reportValidity();
  input.setCustomValidity("");
  input.focus();
}

function showAuthRequiredMessage() {
  if (authStatus) {
    authStatus.hidden = false;
    authStatus.textContent = "Choisissez un nom pour lancer une session.";
  }
  loginNameInput?.focus();
}

function updateFieldManageButtons() {
  syncFieldManageButton(manageProjectButton, Boolean(projectInput.value.trim()));
  syncFieldManageButton(manageClientButton, Boolean(taskInput.value.trim()));
  syncFieldManageButton(manageCategoryButton, currentCategories.length > 0);
  syncFieldManageButton(manageTagsButton, currentTags.length > 0);
  syncFieldManageButton(manageLinkButton, Boolean(notionInput.value.trim()));
  syncFieldManageButton(managePoleButton, Boolean(objectivePoleInput.value.trim()));
  syncFieldManageButton(manageOkrButton, Boolean(objectiveOkrInput.value.trim()));
  syncFieldManageButton(manageKrButton, Boolean(objectiveKrInput.value.trim()));
}

function syncFieldManageButton(button, isVisible) {
  if (!button) {
    return;
  }
  button.hidden = !isVisible;
}

function openFieldManageDialog(kind) {
  const payload = getFieldManagePayload(kind);
  if (!payload || !fieldManageDialog) {
    return;
  }

  fieldManageState = payload;
  fieldManageConfirmMode = false;
  fieldManageTitle.textContent = payload.title;
  fieldManageCopy.textContent = payload.copy;
  fieldManageDetail.textContent = payload.detail;
  if (payload.kind === "category" && fieldManageColorInput) {
    fieldManageColorInput.value = getCategoryColor(payload.detail);
  }
  syncFieldManageDialogMode();
  fieldManageDialog.showModal();
}

function getFieldManagePayload(kind) {
  const payloads = {
    project: {
      kind,
      title: "Gerer le projet",
      copy: "Vous pouvez modifier le projet courant ou le supprimer du contexte.",
      detail: projectInput.value.trim(),
    },
    client: {
      kind,
      title: "Gerer le client",
      copy: "Vous pouvez corriger le client courant ou l'effacer du contexte.",
      detail: taskInput.value.trim(),
    },
    category: {
      kind,
      title: "Gerer la categorie",
      copy: "Vous pouvez modifier la categorie choisie ou la retirer.",
      detail: currentCategories.join(", "),
    },
    tags: {
      kind,
      title: "Gerer les tags",
      copy: "Vous pouvez corriger les tags ou tous les retirer en une fois.",
      detail: currentTags.join(", "),
    },
    link: {
      kind,
      title: "Gerer le lien d'interet",
      copy: "Vous pouvez modifier ce lien ou le supprimer du contexte.",
      detail: notionInput.value.trim(),
    },
    pole: {
      kind,
      title: "Gerer le pole",
      copy: "Vous pouvez corriger le pole ou vider toute l'association objectif.",
      detail: objectivePoleInput.value.trim(),
    },
    okr: {
      kind,
      title: "Gerer l'OKR",
      copy: "Vous pouvez corriger l'OKR ou le retirer avec son KR.",
      detail: objectiveOkrInput.value.trim(),
    },
    kr: {
      kind,
      title: "Gerer le KR",
      copy: "Vous pouvez corriger le KR ou le retirer.",
      detail: objectiveKrInput.value.trim(),
    },
  };

  const payload = payloads[kind];
  if (!payload?.detail) {
    return null;
  }

  return payload;
}

function loadStoredCategoryColors() {
  try {
    return JSON.parse(window.localStorage.getItem(CATEGORY_COLOR_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function loadStoredRepriseActions() {
  try {
    return JSON.parse(window.localStorage.getItem(REPRISES_ACTIONS_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function storeRepriseActions(rows) {
  try {
    window.localStorage.setItem(REPRISES_ACTIONS_KEY, JSON.stringify(rows));
  } catch {
    // ignore local storage errors
  }
}

function storeCategoryColor(label, color) {
  const normalized = normalizeText(label);
  if (!normalized || !color) {
    return;
  }

  const current = loadStoredCategoryColors();
  current[normalized] = color;
  try {
    window.localStorage.setItem(CATEGORY_COLOR_KEY, JSON.stringify(current));
  } catch {
    // ignore local storage errors
  }
}

function generateStableHexColor(seed) {
  const source = String(seed || "grand-livre");
  let hash = 0;
  for (const char of source) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return hslToHex(hue, 55, 78);
}

function hslToHex(h, s, l) {
  const saturation = s / 100;
  const lightness = l / 100;
  const c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lightness - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (h < 60) {
    r = c; g = x; b = 0;
  } else if (h < 120) {
    r = x; g = c; b = 0;
  } else if (h < 180) {
    r = 0; g = c; b = x;
  } else if (h < 240) {
    r = 0; g = x; b = c;
  } else if (h < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  const toHex = (value) => Math.round((value + m) * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getCategoryColor(label, fallbackSeed = "") {
  const normalized = normalizeText(label ?? "");
  if (!normalized) {
    return generateStableHexColor(fallbackSeed || label || "sans-categorie");
  }

  const catalogColor = referenceCatalog.categories.find(
    (item) => normalizeText(item.activity_category_label ?? "") === normalized,
  )?.color_hex;
  if (catalogColor) {
    storeCategoryColor(label, catalogColor);
    return catalogColor;
  }

  const storedColor = loadStoredCategoryColors()[normalized];
  if (storedColor) {
    return storedColor;
  }

  const generated = generateStableHexColor(label);
  storeCategoryColor(label, generated);
  return generated;
}

function applyCategorySurface(element, color) {
  if (!element || !color) {
    return;
  }

  element.style.setProperty("--chip-accent", color);
  element.style.background = `${color}22`;
  element.style.borderColor = `${color}55`;
}

function getMemoryAccentColor(memory) {
  const category = memory.categories?.[0] ?? "";
  if (category) {
    return getCategoryColor(category, memory.key);
  }
  return generateStableHexColor(memory.key || memory.project || "memoire");
}

function loadStoredReprisesOrder() {
  try {
    return JSON.parse(window.localStorage.getItem(REPRISES_ORDER_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function storeReprisesOrder(orderMap) {
  try {
    window.localStorage.setItem(REPRISES_ORDER_KEY, JSON.stringify(orderMap));
  } catch {
    // ignore local storage errors
  }
}

function getReprisesOrderKey(collaborator) {
  return normalizeText(collaborator || "global");
}

function getOrderedProjectMemories(collaboratorName = "") {
  const memories = getProjectMemories(collaboratorName);
  const orderMap = loadStoredReprisesOrder();
  const customOrder = orderMap[getReprisesOrderKey(collaboratorName)] ?? [];
  const indexMap = new Map(customOrder.map((key, index) => [key, index]));

  return memories
    .slice()
    .sort((left, right) => {
      const leftIndex = indexMap.has(left.key) ? indexMap.get(left.key) : Number.POSITIVE_INFINITY;
      const rightIndex = indexMap.has(right.key) ? indexMap.get(right.key) : Number.POSITIVE_INFINITY;
      if (leftIndex !== rightIndex) {
        return leftIndex - rightIndex;
      }
      return right.score - left.score || new Date(right.start) - new Date(left.start);
    });
}

function getRepriseAction(memoryKey, collaboratorName) {
  const normalizedCollaborator = normalizeText(collaboratorName);
  const normalizedKey = normalizeText(memoryKey);
  return repriseActions.find(
    (item) =>
      normalizeText(item.subject_user_name) === normalizedCollaborator &&
      normalizeText(item.memory_key) === normalizedKey,
  ) ?? null;
}

function persistReprisesOrderFromDom() {
  const collaborator = getCurrentCollaborator();
  const order = Array.from(quickProjects.querySelectorAll("[data-memory-key]")).map((node) => node.dataset.memoryKey);
  const orderMap = loadStoredReprisesOrder();
  orderMap[getReprisesOrderKey(collaborator)] = order;
  storeReprisesOrder(orderMap);
}

function captureChipPositions(container) {
  return new Map(
    Array.from(container.querySelectorAll(".chip[data-memory-key]")).map((node) => [node.dataset.memoryKey, node.getBoundingClientRect()]),
  );
}

function animateChipReorder(container, previousPositions) {
  const chips = Array.from(container.querySelectorAll(".chip[data-memory-key]"));
  for (const chip of chips) {
    const previous = previousPositions.get(chip.dataset.memoryKey);
    if (!previous) {
      continue;
    }
    const next = chip.getBoundingClientRect();
    const deltaX = previous.left - next.left;
    const deltaY = previous.top - next.top;
    if (!deltaX && !deltaY) {
      continue;
    }
    chip.style.transition = "none";
    chip.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    requestAnimationFrame(() => {
      chip.style.transition = "";
      chip.style.transform = "";
    });
  }
}

async function saveCategoryColor(categoryLabel, color) {
  const match = referenceCatalog.categories.find(
    (item) => normalizeText(item.activity_category_label ?? "") === normalizeText(categoryLabel),
  );

  storeCategoryColor(categoryLabel, color);

  if (match) {
    match.color_hex = color;
    if (window.supabase) {
      const { error } = await window.supabase
        .from("categories")
        .update({ color_hex: color, updated_at: new Date().toISOString() })
        .eq("activity_category_id", match.activity_category_id);
      if (error) {
        console.warn("Category color update failed:", error);
      }
    }
  }

  renderSuggestions();
  render();
}

async function saveRepriseAction(memory, actionKind) {
  const payload = {
    subject_user_name: memory.collaborator,
    memory_key: memory.key,
    subject_project_name: memory.project,
    action_kind: actionKind,
    actor_name: accessProfile.appUser?.user_name ?? memory.collaborator,
    updated_at: new Date().toISOString(),
  };

  const existingIndex = repriseActions.findIndex(
    (item) =>
      normalizeText(item.subject_user_name) === normalizeText(memory.collaborator) &&
      normalizeText(item.memory_key) === normalizeText(memory.key),
  );

  if (existingIndex >= 0) {
    repriseActions[existingIndex] = {
      ...repriseActions[existingIndex],
      ...payload,
    };
  } else {
    repriseActions = [
      {
        ...payload,
        created_at: new Date().toISOString(),
      },
      ...repriseActions,
    ];
  }

  storeRepriseActions(repriseActions);

  if (window.supabase) {
    const { error } = await window.supabase
      .from("reprise_actions")
      .upsert([payload], { onConflict: "subject_user_name,memory_key" });
    if (error) {
      console.warn("reprise_actions upsert failed:", error);
    } else {
      await loadServerBackedState({ silent: false });
    }
  }
}

function syncFieldManageDialogMode() {
  if (!fieldManageDeleteButton || !fieldManageConfirmButton || !fieldManageCopy || !fieldManageState) {
    return;
  }

  fieldManageDeleteButton.hidden = fieldManageConfirmMode;
  fieldManageConfirmButton.hidden = !fieldManageConfirmMode;
  if (fieldManageColorShell) {
    fieldManageColorShell.hidden = fieldManageState.kind !== "category" || fieldManageConfirmMode;
  }

  if (fieldManageConfirmMode) {
    fieldManageCopy.textContent = `Confirmer la suppression pour ${fieldManageState.title.toLowerCase()} ?`;
  } else {
    fieldManageCopy.textContent = fieldManageState.copy;
  }
}

function resetFieldManageDialog() {
  fieldManageState = null;
  fieldManageConfirmMode = false;
  if (fieldManageColorShell) {
    fieldManageColorShell.hidden = true;
  }
}

function focusFieldForEditing(kind) {
  const map = {
    project: projectInput,
    client: taskInput,
    category: categoriesInput,
    tags: tagsInput,
    link: notionInput,
    pole: objectivePoleInput,
    okr: objectiveOkrInput,
    kr: objectiveKrInput,
  };

  const input = map[kind];
  if (!input) {
    return;
  }

  if (kind === "pole" || kind === "okr" || kind === "kr") {
    objectiveDisclosure.open = true;
  }

  input.focus();
  input.select?.();
}

function applyFieldManageDeletion(kind) {
  if (kind === "project") {
    projectInput.value = "";
    delete projectInput.dataset.lastHydratedKey;
    projectMemoryHint.textContent =
      "Commencez a taper: un sujet deja connu recharge automatiquement ses informations utiles.";
  } else if (kind === "client") {
    taskInput.value = "";
  } else if (kind === "category") {
    currentCategories = [];
    categoriesInput.value = "";
    renderCategoryTokens();
  } else if (kind === "tags") {
    currentTags = [];
    tagsInput.value = "";
    renderTagTokens();
  } else if (kind === "link") {
    notionInput.value = "";
  } else if (kind === "pole") {
    objectivePoleInput.value = "";
    objectiveOkrInput.value = "";
    objectiveKrInput.value = "";
    renderObjectiveSelections();
  } else if (kind === "okr") {
    objectiveOkrInput.value = "";
    objectiveKrInput.value = "";
    renderObjectiveSelections();
  } else if (kind === "kr") {
    objectiveKrInput.value = "";
    renderObjectiveSelections();
  }

  updateFieldManageButtons();
}

function stopActiveSession() {
  if (!activeSession) {
    return;
  }

  const end = getActiveSessionEffectiveEnd(activeSession);
  const durationMs = getActiveSessionDurationMs(activeSession);

  const finishedSession = {
    ...activeSession,
    ...readFormValues(),
    pausedAt: null,
    end: end.toISOString(),
    durationMs,
  };

  attemptSaveSession(finishedSession, {
    excludeId: activeSession.id,
    onSuccess: (sessionToSave) => {
      upsertSession(sessionToSave);
      activeSession = null;
      persistSessions();
      persistActiveSession();
      stopTimerLoop();
      resetFormAfterStop();
      render();
      void finalizeStoppedSessionOnSupabase(sessionToSave, "timer");
    },
  });
}


async function initializeReferenceCatalog() {
  const loaded = await ensureReferenceCatalogLoaded();
  if (loaded) {
    await loadServerBackedState({ silent: true });
    startRemoteSyncLoop();
  }
  if (loaded && getAccessRole() === "admin") {
    await loadAgendaImportRows();
  }
  if (loaded) {
    render();
  }
}

async function ensureReferenceCatalogLoaded(force = false) {
  if (!window.supabase) {
    return false;
  }

  if (referenceCatalog.loaded && !force) {
    return true;
  }

  if (referenceCatalog.loadingPromise && !force) {
    return referenceCatalog.loadingPromise;
  }

  referenceCatalog.loadingPromise = (async () => {
    const [usersResult, projectsResult, categoriesResult] = await Promise.all([
      window.supabase.from("users").select("*"),
      window.supabase
        .from("projects")
        .select(
          "project_id,project_name,client_name,status,default_activity_category_id,default_activity_category_label",
        ),
      window.supabase
        .from("categories")
        .select("activity_category_id,activity_category_label,kpi_category_label,color_hex,team_name,active"),
    ]);

    if (usersResult.error || projectsResult.error || categoriesResult.error) {
      console.error("Supabase catalog load error:", {
        users: usersResult.error,
        projects: projectsResult.error,
        categories: categoriesResult.error,
      });
      return false;
    }

    referenceCatalog.users = usersResult.data ?? [];
    referenceCatalog.projects = projectsResult.data ?? [];
    referenceCatalog.categories = categoriesResult.data ?? [];
    referenceCatalog.loaded = true;
    return true;
  })();

  const result = await referenceCatalog.loadingPromise;
  referenceCatalog.loadingPromise = null;
  return result;
}

async function initializeAccessProfile() {
  await ensureReferenceCatalogLoaded();
  const savedName = loadStoredAccessName();
  applyLocalAccessProfile(savedName, { persist: false });
}

function applyLocalAccessProfile(rawName, options = {}) {
  const name = String(rawName ?? "").trim();
  const appUser = name ? findAppUserByName(name) : null;

  if (!name || !appUser) {
    accessProfile = {
      mode: "open",
      role: "open",
      session: null,
      appUser: null,
    };
    activeSession = null;
    persistActiveSession();
    syncTimerLoopWithActiveSession();
    if (options.persist !== false) {
      clearStoredAccessName();
    }
    render();
    return Boolean(appUser);
  }

  accessProfile = {
    mode: "named",
    role: appUser.role ?? "cadre",
    session: null,
    appUser,
  };
  activeSession =
    remoteActiveSessions.find((session) => normalizeText(session.collaborator) === normalizeText(appUser.user_name)) ?? null;
  persistActiveSession();
  syncTimerLoopWithActiveSession();

  if (options.persist !== false) {
    storeAccessName(appUser.user_name);
  }

  if (accessProfile.role === "admin") {
    void loadAgendaImportRows().then(() => {
      renderAgendaImportPanel();
    });
  } else {
    agendaImportRows = [];
    agendaImportLoaded = false;
  }

  void loadServerBackedState({ silent: false });
  render();
  return true;
}

function findAppUserByName(rawName) {
  const normalizedName = normalizeText(rawName);
  if (!normalizedName) {
    return null;
  }

  return getKnownUsers().find((item) => normalizeText(item.user_name ?? "") === normalizedName) ?? null;
}

function loadStoredAccessName() {
  try {
    return window.localStorage.getItem(ACCESS_PROFILE_KEY) ?? "";
  } catch (error) {
    return "";
  }
}

function storeAccessName(name) {
  try {
    window.localStorage.setItem(ACCESS_PROFILE_KEY, name);
  } catch (error) {
    // ignore storage errors in local mode
  }
}

function clearStoredAccessName() {
  try {
    window.localStorage.removeItem(ACCESS_PROFILE_KEY);
  } catch (error) {
    // ignore storage errors in local mode
  }
}

function getAccessRole() {
  return accessProfile.role || "open";
}

function getKnownUsers() {
  const merged = new Map();

  for (const user of LOCAL_PROFILE_DIRECTORY) {
    merged.set(normalizeText(user.user_name ?? ""), user);
  }

  for (const user of referenceCatalog.users) {
    merged.set(normalizeText(user.user_name ?? ""), user);
  }

  return Array.from(merged.values()).filter(Boolean);
}

function getAllowedViewsForRole(role = getAccessRole()) {
  if (role === "cadre") {
    return ["cadre", "journal"];
  }
  if (role === "manager" || role === "admin") {
    return ["cadre", "manager", "resources", "journal"];
  }
  return ["cadre", "journal"];
}

function getManagedTeamNames() {
  const names = new Set();
  const appUser = accessProfile.appUser;

  if (appUser?.team_name) {
    names.add(appUser.team_name);
  }
  if (appUser?.managed_team_name) {
    names.add(appUser.managed_team_name);
  }

  return Array.from(names);
}

function getVisibleReferenceUsers() {
  const knownUsers = getKnownUsers();
  if (!knownUsers.length) {
    return [];
  }

  const role = getAccessRole();
  const appUser = accessProfile.appUser;

  if (role === "admin" || role === "open" || !appUser) {
    return [...knownUsers];
  }

  if (role === "cadre") {
    return knownUsers.filter((item) => item.user_id === appUser.user_id);
  }

  const teams = getManagedTeamNames();
  if (!teams.length) {
    return knownUsers.filter((item) => item.user_id === appUser.user_id);
  }

  return knownUsers.filter(
    (item) => item.user_id === appUser.user_id || teams.includes(item.team_name),
  );
}

function canCreateCollaboratorReference() {
  const role = getAccessRole();
  return role === "admin";
}

function getEffectiveCollaboratorValue(rawValue = "") {
  if (accessProfile.appUser?.user_name) {
    return accessProfile.appUser.user_name;
  }

  return rawValue.trim();
}

function getSessionTeamName(session) {
  if (session.dbTeamName) {
    return session.dbTeamName;
  }
  if (session.teamName) {
    return session.teamName;
  }

  const matchedUser =
    getKnownUsers().find((item) => item.user_id === session.dbUserId) ??
    getKnownUsers().find((item) => normalizeText(item.user_name) === normalizeText(session.collaborator ?? ""));

  return matchedUser?.team_name ?? "";
}

function getScopedSessions(rows) {
  const role = getAccessRole();
  const appUser = accessProfile.appUser;

  if (role === "open" || !appUser) {
    return [];
  }

  if (role === "admin") {
    return rows;
  }

  if (role === "cadre") {
    return rows.filter((session) => normalizeText(session.collaborator) === normalizeText(appUser.user_name));
  }

  const teams = getManagedTeamNames();
  if (!teams.length) {
    return rows.filter((session) => normalizeText(session.collaborator) === normalizeText(appUser.user_name));
  }

  return rows.filter(
    (session) =>
      normalizeText(session.collaborator) === normalizeText(appUser.user_name) ||
      teams.includes(getSessionTeamName(session)),
  );
}

async function resolveDraftReferences(sessionDraft, options = {}) {
  const loaded = await ensureReferenceCatalogLoaded();
  if (!loaded) {
    return {
      loaded: false,
      user: null,
      project: null,
      category: null,
      selectedCategoryLabel: sessionDraft.categories?.[0] ?? "",
    };
  }

  let user = findReferenceMatch(getKnownUsers(), "user_name", sessionDraft.collaborator);
  if (!user && options.allowCreate && sessionDraft.collaborator?.trim()) {
    const createdUserName = await createUserReference(sessionDraft.collaborator.trim());
    user = createdUserName
      ? findReferenceMatch(getKnownUsers(), "user_name", createdUserName)
      : null;
  }

  let project = findReferenceMatch(referenceCatalog.projects, "project_name", sessionDraft.project);
  if (!project && options.allowCreate && sessionDraft.project?.trim()) {
    const createdProjectName = await createProjectReference(sessionDraft.project.trim(), sessionDraft.categories?.[0] ?? "");
    project = createdProjectName
      ? findReferenceMatch(referenceCatalog.projects, "project_name", createdProjectName)
      : null;
  }

  let selectedCategoryLabel = sessionDraft.categories?.[0] || project?.default_activity_category_label || "";
  let category = findReferenceMatch(referenceCatalog.categories, "activity_category_label", selectedCategoryLabel);
  if (!category && options.allowCreate && selectedCategoryLabel?.trim()) {
    const createdCategoryLabel = await createCategoryReference(selectedCategoryLabel.trim(), {
      userName: user?.user_name ?? sessionDraft.collaborator?.trim() ?? "",
      projectName: project?.project_name ?? sessionDraft.project?.trim() ?? "",
    });
    if (createdCategoryLabel) {
      selectedCategoryLabel = createdCategoryLabel;
      category = findReferenceMatch(referenceCatalog.categories, "activity_category_label", createdCategoryLabel);
    }
  }

  return {
    loaded: true,
    user,
    project,
    category,
    selectedCategoryLabel,
  };
}

async function createUserReference(rawName) {
  const userName = rawName.trim();
  if (!userName) {
    return null;
  }
  if (!window.supabase) {
    return userName;
  }

  await ensureReferenceCatalogLoaded();

  const existing = findReferenceMatch(getKnownUsers(), "user_name", userName);
  if (existing) {
    return existing.user_name;
  }

  const nextId = await getNextPrefixedId("users", "user_id", "USR-", 3);
  if (!nextId) {
    return null;
  }

  const teamName = getKnownUsers()[0]?.team_name ?? "Conseil Operations France";
  const managerId = getKnownUsers().find((item) => item.role === "manager" && item.status === "active")?.user_id ?? null;

  const payload = {
    user_id: nextId,
    user_name: userName,
    role: "cadre",
    team_name: teamName,
    manager_user_id: managerId,
    weekly_capacity_hours: 40,
    status: "active",
  };

  const { data, error } = await window.supabase.from("users").insert([payload]).select();
  if (error) {
    console.error("Supabase user insert error:", error);
    return null;
  }

  const insertedUser = data?.[0] ?? payload;
  referenceCatalog.users = [...referenceCatalog.users, insertedUser].sort((left, right) =>
    left.user_name.localeCompare(right.user_name, "fr"),
  );
  renderSuggestions();
  return insertedUser.user_name;
}

async function createProjectReference(rawName, defaultCategoryLabel = "") {
  const projectName = rawName.trim();
  if (!projectName) {
    return null;
  }
  if (!window.supabase) {
    return projectName;
  }

  await ensureReferenceCatalogLoaded();

  const existing = findReferenceMatch(referenceCatalog.projects, "project_name", projectName);
  if (existing) {
    return existing.project_name;
  }

  const nextId = await getNextPrefixedId("projects", "project_id", "PRJ-", 3);
  if (!nextId) {
    return null;
  }

  const defaultCategory = findReferenceMatch(
    referenceCatalog.categories,
    "activity_category_label",
    defaultCategoryLabel,
  );

  const payload = {
    project_id: nextId,
    project_name: projectName,
    client_name: "A renseigner",
    status: "active",
    default_activity_category_id: defaultCategory?.activity_category_id ?? null,
    default_activity_category_label: defaultCategory?.activity_category_label ?? null,
  };

  const { data, error } = await window.supabase.from("projects").insert([payload]).select();
  if (error) {
    console.error("Supabase project insert error:", error);
    return null;
  }

  const insertedProject = data?.[0] ?? payload;
  referenceCatalog.projects = [...referenceCatalog.projects, insertedProject].sort((left, right) =>
    left.project_name.localeCompare(right.project_name, "fr"),
  );
  renderSuggestions();
  return insertedProject.project_name;
}

async function createCategoryReference(rawLabel, options = {}) {
  const categoryLabel = rawLabel.trim();
  if (!categoryLabel) {
    return null;
  }
  if (!window.supabase) {
    return categoryLabel;
  }

  await ensureReferenceCatalogLoaded();

  const existing = findReferenceMatch(referenceCatalog.categories, "activity_category_label", categoryLabel);
  if (existing) {
    return existing.activity_category_label;
  }

  const nextId = await getNextPrefixedId("categories", "activity_category_id", "CAT-", 3);
  if (!nextId) {
    return null;
  }

  const linkedUser = options.userName ? findReferenceMatch(getKnownUsers(), "user_name", options.userName) : null;
  const linkedProject = options.projectName
    ? findReferenceMatch(referenceCatalog.projects, "project_name", options.projectName)
    : null;

  let inheritedCategory = null;
  if (linkedProject?.default_activity_category_id) {
    inheritedCategory =
      referenceCatalog.categories.find(
        (item) => item.activity_category_id === linkedProject.default_activity_category_id,
      ) ?? null;
  }
  if (!inheritedCategory && linkedProject?.default_activity_category_label) {
    inheritedCategory = findReferenceMatch(
      referenceCatalog.categories,
      "activity_category_label",
      linkedProject.default_activity_category_label,
    );
  }

  const payload = {
    activity_category_id: nextId,
    activity_category_label: categoryLabel,
    kpi_category_label: inheritedCategory?.kpi_category_label ?? "Internal / Admin",
    color_hex: getCategoryColor(categoryLabel),
    team_name: linkedUser?.team_name ?? getKnownUsers()[0]?.team_name ?? null,
    active: true,
  };

  const { data, error } = await window.supabase.from("categories").insert([payload]).select();
  if (error) {
    console.error("Supabase category insert error:", error);
    return null;
  }

  const insertedCategory = data?.[0] ?? payload;
  referenceCatalog.categories = [...referenceCatalog.categories, insertedCategory].sort((left, right) =>
    left.activity_category_label.localeCompare(right.activity_category_label, "fr"),
  );
  renderSuggestions();
  return insertedCategory.activity_category_label;
}

function findReferenceMatch(rows, labelField, rawValue) {
  const normalized = normalizeText(rawValue ?? "");
  if (!normalized) {
    return null;
  }

  const exact = rows.find((row) => normalizeText(row[labelField] ?? "") === normalized);
  if (exact) {
    return exact;
  }

  const startsWithMatches = rows.filter((row) => normalizeText(row[labelField] ?? "").startsWith(normalized));
  return startsWithMatches.length === 1 ? startsWithMatches[0] : null;
}

function buildCanonicalSessionDraft(sessionDraft, resolved) {
  const normalizedCategories = resolved.category
    ? [resolved.category.activity_category_label]
    : resolved.selectedCategoryLabel
      ? [resolved.selectedCategoryLabel]
      : sessionDraft.categories.slice(0, 1);

  return {
    ...sessionDraft,
    collaborator: resolved.user?.user_name ?? sessionDraft.collaborator,
    project: resolved.project?.project_name ?? sessionDraft.project,
    categories: normalizedCategories,
    dbUserId: resolved.user?.user_id ?? null,
    dbProjectId: resolved.project?.project_id ?? null,
    dbActivityCategoryId: resolved.category?.activity_category_id ?? null,
    dbTeamName: resolved.user?.team_name ?? "",
    dbClientName: resolved.project?.client_name ?? "",
    dbKpiCategoryLabel: resolved.category?.kpi_category_label ?? "",
  };
}

function applyCanonicalDraftToMainForm(sessionDraft) {
  collaboratorInput.value = sessionDraft.collaborator ?? "";
  projectInput.value = sessionDraft.project ?? "";
  currentCategories = [...(sessionDraft.categories ?? []).slice(0, 1)];
  renderCategoryTokens();
  renderObjectiveSelections();
}

async function canonicalizeCollaboratorInput() {
  const collaborator = collaboratorInput.value.trim();
  if (!collaborator) {
    return;
  }

  const resolved = await resolveDraftReferences({
    collaborator,
    project: projectInput.value.trim(),
    categories: [...currentCategories],
  });
  if (resolved.user) {
    collaboratorInput.value = resolved.user.user_name;
  }
}

async function canonicalizeProjectInput() {
  const project = projectInput.value.trim();
  if (!project) {
    return;
  }

  const resolved = await resolveDraftReferences({
    collaborator: collaboratorInput.value.trim(),
    project,
    categories: [...currentCategories],
  });
  if (resolved.project) {
    projectInput.value = resolved.project.project_name;
  }
  if (!currentCategories.length && resolved.project?.default_activity_category_label) {
    currentCategories = [resolved.project.default_activity_category_label];
    renderCategoryTokens();
  }
}

async function canonicalizeCategorySelection() {
  if (!currentCategories.length) {
    const resolved = await resolveDraftReferences({
      collaborator: collaboratorInput.value.trim(),
      project: projectInput.value.trim(),
      categories: [],
    });
    if (resolved.category) {
      currentCategories = [resolved.category.activity_category_label];
      renderCategoryTokens();
    }
    return;
  }

  const resolved = await resolveDraftReferences({
    collaborator: collaboratorInput.value.trim(),
    project: projectInput.value.trim(),
    categories: [...currentCategories],
  });
  if (resolved.category) {
    currentCategories = [resolved.category.activity_category_label];
    renderCategoryTokens();
  }
}

async function resolveSessionReferences(session) {
  const resolved = await resolveDraftReferences(session);
  const fallbackUser = getSessionSourceUser(session);
  const project =
    resolved.project ??
    findReferenceMatch(referenceCatalog.projects, "project_name", session.project) ??
    null;
  const category =
    resolved.category ??
    findReferenceMatch(referenceCatalog.categories, "activity_category_label", session.categories?.[0] ?? "") ??
    null;

  if (!resolved.loaded && !fallbackUser) {
    return null;
  }

  return {
    user: resolved.user ?? fallbackUser,
    project,
    category,
    selectedCategoryLabel: resolved.selectedCategoryLabel ?? session.categories?.[0] ?? "",
  };
}

async function getNextTimeEntryId() {
  const generated = await getNextPrefixedId("time_entries", "time_entry_id", "TE-", 6);
  if (generated) {
    return generated;
  }
  return `TE-${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}`;
}

async function getNextPrefixedId(tableName, columnName, prefix, padLength) {
  if (!window.supabase) {
    return null;
  }

  const { data, error } = await window.supabase
    .from(tableName)
    .select(columnName)
    .order(columnName, { ascending: false })
    .limit(1);

  if (error) {
    console.error(`Supabase ID lookup error for ${tableName}:`, error);
    return null;
  }

  const lastId = data?.[0]?.[columnName] ?? null;
  const lastNumber = lastId ? Number.parseInt(String(lastId).replace(prefix, ""), 10) : 0;
  const nextNumber = Number.isFinite(lastNumber) ? lastNumber + 1 : 1;
  return `${prefix}${String(nextNumber).padStart(padLength, "0")}`;
}

async function buildTimeEntryPayloadFromSession(session, source = "manual") {
  const references = await resolveSessionReferences(session);
  if (!references) {
    return null;
  }

  const timeEntryId = session.dbTimeEntryId ?? (await getNextTimeEntryId());
  if (!timeEntryId || !references.user) {
    return null;
  }

  const start = new Date(session.start);
  const end = session.end ? new Date(session.end) : getActiveSessionEffectiveEnd(session);
  const durationMs =
    Number(session.durationMs) || Math.max(end.getTime() - start.getTime(), 0);

  return {
    time_entry_id: timeEntryId,
    source_session_id: session.id,
    entry_date: start.toISOString().slice(0, 10),
    started_at: start.toISOString(),
    ended_at: end.toISOString(),
    user_id: references.user.user_id,
    user_name: references.user.user_name,
    team_name: references.user.team_name ?? "",
    project_id: references.project?.project_id ?? session.dbProjectId ?? null,
    project_name: references.project?.project_name ?? session.project ?? "",
    client_name: references.project?.client_name ?? session.dbClientName ?? "",
    activity_category_id: references.category?.activity_category_id ?? session.dbActivityCategoryId ?? null,
    activity_category_label: references.category?.activity_category_label ?? session.categories?.[0] ?? null,
    kpi_category_label: references.category?.kpi_category_label ?? session.dbKpiCategoryLabel ?? null,
    duration_minutes: Math.max(1, Math.round(durationMs / 60000)),
    duration_hours: Number((durationMs / 3600000).toFixed(2)),
    task_label: session.task || "",
    tags_text: (session.tags ?? []).join(", "),
    notion_ref: session.notionRef || "",
    objective_pole: session.objectivePole || "",
    objective_okr: session.objectiveOkr || "",
    objective_kr: session.objectiveKr || "",
    notes: session.notes || "",
    source,
    status: "saved",
  };
}

async function syncSessionToSupabase(session, source = "manual") {
  const payload = await buildTimeEntryPayloadFromSession(session, source);
  if (!payload) {
    return false;
  }

  return createTimeEntry(payload, { updateExisting: Boolean(session.dbTimeEntryId) });
}

async function createTimeEntry(data, options = {}) {
  if (!window.supabase) {
    return false;
  }

  try {
    const query = options.updateExisting
      ? window.supabase
          .from("time_entries")
          .update({
            ...data,
            updated_at: new Date().toISOString(),
          })
          .eq("time_entry_id", data.time_entry_id)
          .select()
      : window.supabase.from("time_entries").insert([data]).select();

    const { data: inserted, error } = await query;

    if (error) {
      console.error("Supabase insert error:", error);
      return false;
    }

    console.log("Supabase insert success:", inserted);
    await loadServerBackedState({ silent: false });
    return true;
  } catch (e) {
    console.error("Unexpected Supabase error:", e);
    return false;
  }
}

async function deleteTimeEntryFromSupabase(session, options = {}) {
  if (!window.supabase || !session) {
    return false;
  }

  let query = null;
  if (session.dbTimeEntryId) {
    query = window.supabase.from("time_entries").delete().eq("time_entry_id", session.dbTimeEntryId);
  } else if (session.id) {
    query = window.supabase.from("time_entries").delete().eq("source_session_id", session.id);
  } else {
    return false;
  }

  const { error } = await query;
  if (error) {
    console.warn("time_entries delete failed:", error);
    return false;
  }

  if (options.reload !== false) {
    await loadServerBackedState({ silent: false });
  }
  return true;
}

async function buildActiveSessionPayload(session) {
  const references = await resolveSessionReferences(session);
  const user = references?.user ?? getSessionSourceUser(session);
  if (!user) {
    return null;
  }

  return {
    active_session_id: session.dbActiveSessionId ?? session.id,
    started_at: session.start,
    paused_at: session.pausedAt ?? null,
    paused_duration_ms: Number(session.pausedDurationMs) || 0,
    user_id: user.user_id ?? session.dbUserId ?? null,
    user_name: user.user_name ?? session.collaborator ?? "",
    team_name: user.team_name ?? session.dbTeamName ?? "",
    project_id: references?.project?.project_id ?? session.dbProjectId ?? null,
    project_name: references?.project?.project_name ?? session.project ?? "",
    client_name: references?.project?.client_name ?? session.dbClientName ?? "",
    activity_category_id: references?.category?.activity_category_id ?? session.dbActivityCategoryId ?? null,
    activity_category_label: references?.category?.activity_category_label ?? session.categories?.[0] ?? null,
    kpi_category_label: references?.category?.kpi_category_label ?? session.dbKpiCategoryLabel ?? null,
    task_label: session.task || "",
    tags_text: (session.tags ?? []).join(", "),
    notion_ref: session.notionRef || "",
    objective_pole: session.objectivePole || "",
    objective_okr: session.objectiveOkr || "",
    objective_kr: session.objectiveKr || "",
    notes: session.notes || "",
    updated_at: new Date().toISOString(),
  };
}

async function upsertActiveSessionToSupabase(session) {
  if (!window.supabase || !session) {
    return false;
  }

  const payload = await buildActiveSessionPayload(session);
  if (!payload) {
    return false;
  }

  const { error } = await window.supabase
    .from("active_sessions")
    .upsert([payload], { onConflict: "active_session_id" });

  if (error) {
    console.warn("active_sessions upsert failed:", error);
    return false;
  }

  await loadServerBackedState({ silent: false });
  return true;
}

async function removeActiveSessionFromSupabase(sessionId, options = {}) {
  if (!window.supabase || !sessionId) {
    return false;
  }

  const { error } = await window.supabase.from("active_sessions").delete().eq("active_session_id", sessionId);
  if (error) {
    console.warn("active_sessions delete failed:", error);
    return false;
  }

  if (options.reload !== false) {
    await loadServerBackedState({ silent: false });
  }
  return true;
}

async function finalizeStoppedSessionOnSupabase(session, source = "timer") {
  const historySaved = await syncSessionToSupabase(session, source);
  const activeRemoved = await removeActiveSessionFromSupabase(session.dbActiveSessionId ?? session.id);
  return historySaved && activeRemoved;
}

async function logSessionChange(previousSession, nextSession, source = "manual") {
  if (!window.supabase) {
    return false;
  }
  if (auditTableAvailable === false) {
    return false;
  }

  const rows = [];
  const actorName = getCurrentCollaborator() || nextSession?.collaborator || "";
  const fields = [
    ["project", "Projet"],
    ["task", "Client"],
    ["start", "Debut"],
    ["end", "Fin"],
    ["durationMs", "Duree"],
    ["categories", "Categorie"],
    ["tags", "Tags"],
    ["notionRef", "Lien d'interet"],
    ["objectivePole", "Pole"],
    ["objectiveOkr", "OKR"],
    ["objectiveKr", "KR"],
    ["notes", "Note"],
  ];

  for (const [field, label] of fields) {
    const before = previousSession?.[field];
    const after = nextSession?.[field];
    const beforeValue = Array.isArray(before) ? before.join(", ") : before;
    const afterValue = Array.isArray(after) ? after.join(", ") : after;
    if (String(beforeValue ?? "") === String(afterValue ?? "")) {
      continue;
    }
    rows.push({
      session_id: nextSession.id,
      change_source: source,
      actor_name: actorName,
      field_label: label,
      old_value:
        field === "durationMs"
          ? beforeValue
            ? formatDurationHours(Number(beforeValue))
            : ""
          : field === "start" || field === "end"
            ? beforeValue
              ? new Date(beforeValue).toLocaleString("fr-FR")
              : ""
            : String(beforeValue ?? ""),
      new_value:
        field === "durationMs"
          ? afterValue
            ? formatDurationHours(Number(afterValue))
            : ""
          : field === "start" || field === "end"
            ? afterValue
              ? new Date(afterValue).toLocaleString("fr-FR")
              : ""
            : String(afterValue ?? ""),
    });
  }

  if (!rows.length) {
    return true;
  }

  const { error } = await window.supabase.from("session_audit_log").insert(rows);
  if (error) {
    if (error.code === "42P01") {
      auditTableAvailable = false;
      console.warn("session_audit_log table missing; audit logging skipped.");
      return false;
    }
    console.warn("session_audit_log insert failed:", error);
    return false;
  }

  auditTableAvailable = true;
  return true;
}

async function logSessionDeletion(session, source = "manual-delete") {
  if (!window.supabase || !session) {
    return false;
  }
  if (auditTableAvailable === false) {
    return false;
  }

  const actorName = getCurrentCollaborator() || session.collaborator || "";
  const oldValue = [
    session.project || session.task || "Sans sujet",
    session.collaborator || "",
    formatDate(session.start),
    formatDuration(Number(session.durationMs) || getActiveSessionDurationMs(session)),
  ]
    .filter(Boolean)
    .join(" · ");

  const { error } = await window.supabase.from("session_audit_log").insert([
    {
      session_id: session.id,
      change_source: source,
      actor_name: actorName,
      field_label: "Suppression",
      old_value: oldValue,
      new_value: "Supprime",
    },
  ]);

  if (error) {
    if (error.code === "42P01") {
      auditTableAvailable = false;
      console.warn("session_audit_log table missing; deletion audit skipped.");
      return false;
    }
    console.warn("session_audit_log deletion insert failed:", error);
    return false;
  }

  auditTableAvailable = true;
  return true;
}

function removeSessionFromLocalState(sessionId) {
  const removedActiveSession = activeSession?.id === sessionId;
  sessions = sessions.filter((item) => item.id !== sessionId);
  remoteActiveSessions = remoteActiveSessions.filter((item) => item.id !== sessionId);

  if (removedActiveSession) {
    activeSession = null;
  }

  persistSessions();
  persistActiveSession();
  syncTimerLoopWithActiveSession();
  if (removedActiveSession) {
    resetFormAfterStop();
  }
}

async function deleteSessionEverywhere(session, { source = "manual-delete" } = {}) {
  if (!session) {
    return false;
  }

  const persistedActiveSession = getPersistedActiveSessions().find((item) => item.id === session.id) ?? null;
  const targetSession = persistedActiveSession ?? session;
  const isActiveEntry = Boolean(persistedActiveSession || targetSession.isServerActive || targetSession.dbActiveSessionId);
  const hasRemoteHistory = Boolean(targetSession.dbTimeEntryId || targetSession.isServerBacked);

  let removed = true;
  if (window.supabase && isActiveEntry) {
    removed = await removeActiveSessionFromSupabase(targetSession.dbActiveSessionId ?? targetSession.id, { reload: false });
  } else if (window.supabase && hasRemoteHistory) {
    removed = await deleteTimeEntryFromSupabase(targetSession, { reload: false });
  }

  if (!removed) {
    window.alert("La suppression n'a pas pu etre enregistree pour le moment.");
    return false;
  }

  removeSessionFromLocalState(targetSession.id);
  await logSessionDeletion(targetSession, source);

  if (manualEditingSessionId === targetSession.id) {
    manualEditingSessionId = null;
    manualDialog.close();
    saveManualButton.textContent = "Enregistrer";
    if (deleteManualButton) {
      deleteManualButton.hidden = true;
    }
  }

  if (window.supabase && (isActiveEntry || hasRemoteHistory)) {
    await loadServerBackedState({ silent: false });
  }

  render();
  return true;
}


function resetFormAfterStop() {
  const lastCollaborator = collaboratorInput.value.trim();
  form.reset();
  collaboratorInput.value = lastCollaborator;
  currentCategories = [];
  currentTags = [];
  renderCategoryTokens();
  renderTagTokens();
  notionInput.value = "";
  objectivePoleInput.value = "";
  objectiveOkrInput.value = "";
  objectiveKrInput.value = "";
  notesInput.value = "";
  renderObjectiveSelections();
  projectMemoryHint.textContent =
    "Commencez a taper: un projet deja connu recharge automatiquement ses informations utiles.";
  delete projectInput.dataset.lastHydratedKey;
}

function togglePauseSession() {
  if (!activeSession) {
    return;
  }

  if (activeSession.pausedAt) {
    const pausedAt = new Date(activeSession.pausedAt).getTime();
    activeSession.pausedDurationMs =
      (Number(activeSession.pausedDurationMs) || 0) + Math.max(Date.now() - pausedAt, 0);
    activeSession.pausedAt = null;
    startTimerLoopIfNeeded();
  } else {
    activeSession.pausedAt = new Date().toISOString();
    stopTimerLoop();
  }

  persistActiveSession();
  render();
  scheduleActiveSessionServerSync({ immediate: true });
}

function updateActiveSessionStart({ reportValidity = true, closeEditor = true, audit = true } = {}) {
  if (!activeSession || !activeStartDialogInput?.value) {
    if (closeEditor) {
      hideActiveStartEditor();
    }
    return false;
  }

  const nextStart = new Date(activeStartDialogInput.value);
  const effectiveEnd = getActiveSessionEffectiveEnd(activeSession);
  const nextDurationMs =
    effectiveEnd.getTime() - nextStart.getTime() - (Number(activeSession.pausedDurationMs) || 0);

  if (Number.isNaN(nextStart.getTime()) || nextDurationMs <= 0 || nextStart > new Date()) {
    if (reportValidity) {
      activeStartDialogInput.setCustomValidity("Le debut doit rester anterieur a maintenant.");
      activeStartDialogInput.reportValidity();
      activeStartDialogInput.setCustomValidity("");
    }
    if (closeEditor) {
      hideActiveStartEditor();
    }
    renderActiveSession();
    return false;
  }

  activeStartDialogInput.setCustomValidity("");

  const previousSession = { ...activeSession };
  const candidate = {
    ...activeSession,
    start: nextStart.toISOString(),
    end: effectiveEnd.toISOString(),
    durationMs: nextDurationMs,
  };

  const overlap = findOverlappingSession(candidate, activeSession.id);
  if (overlap) {
    if (reportValidity) {
      activeStartDialogInput.setCustomValidity("Ce cargonaute a deja une autre session sur ce creneau.");
      activeStartDialogInput.reportValidity();
      activeStartDialogInput.setCustomValidity("");
    }
    if (closeEditor) {
      hideActiveStartEditor();
    }
    activeStartDialogInput.setCustomValidity("");
    renderActiveSession();
    return false;
  }

  activeSession = {
    ...activeSession,
    ...candidate,
  };
  persistActiveSession();
  if (closeEditor) {
    hideActiveStartEditor();
  } else {
    renderActiveSession();
  }
  hydrateFormFromActiveSession();
  if (audit) {
    void logSessionChange(previousSession, activeSession, "active-session-start");
  }
  scheduleActiveSessionServerSync({ immediate: true });
  return true;
}

function openManualDialog(session = null, preset = null) {
  const end = preset?.end ? new Date(preset.end) : new Date();
  const start = preset?.start ? new Date(preset.start) : new Date(end.getTime() - 30 * 60 * 1000);

  manualEditingSessionId = session?.id ?? null;
  manualCollaboratorInput.value =
    session?.collaborator ?? preset?.collaborator ?? collaboratorInput.value.trim();
  manualProjectInput.value = session?.project ?? preset?.project ?? projectInput.value.trim();
  manualTaskInput.value = session?.task ?? preset?.task ?? taskInput.value.trim();
  manualCategoriesInput.value = (session?.categories ?? preset?.categories ?? currentCategories).join(", ");
  manualTagsInput.value = (session?.tags ?? preset?.tags ?? currentTags).join(", ");
  manualNotionInput.value = session?.notionRef ?? preset?.notionRef ?? notionInput.value.trim();
  manualObjectivePoleInput.value = session?.objectivePole ?? preset?.objectivePole ?? objectivePoleInput.value.trim();
  manualObjectiveOkrInput.value = session?.objectiveOkr ?? preset?.objectiveOkr ?? objectiveOkrInput.value.trim();
  manualObjectiveKrInput.value = session?.objectiveKr ?? preset?.objectiveKr ?? objectiveKrInput.value.trim();
  manualNotesInput.value = session?.notes ?? preset?.notes ?? notesInput.value.trim();
  manualStartInput.value = formatDateTimeLocal(session ? new Date(session.start) : start);
  manualEndInput.value = formatDateTimeLocal(session ? new Date(session.end) : end);
  saveManualButton.textContent = session ? "Enregistrer les changements" : "Enregistrer";
  if (deleteManualButton) {
    deleteManualButton.hidden = !session;
  }
  renderObjectiveSelections();
  manualDialog.showModal();
}

function saveManualEntry() {
  const collaborator = getEffectiveCollaboratorValue(manualCollaboratorInput.value);
  const project = manualProjectInput.value.trim();
  const startValue = manualStartInput.value;
  const endValue = manualEndInput.value;

  if (!collaborator) {
    showAuthRequiredMessage();
    return;
  }
  if (!project) {
    manualProjectInput.focus();
    return;
  }
  if (!startValue || !endValue) {
    return;
  }

  const start = new Date(startValue);
  const end = new Date(endValue);
  const durationMs = end.getTime() - start.getTime();
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || durationMs <= 0) {
    manualEndInput.focus();
    return;
  }

  const manualSession = {
    id: manualEditingSessionId ?? crypto.randomUUID(),
    collaborator,
    project,
    task: manualTaskInput.value.trim(),
    categories: parseTokenString(manualCategoriesInput.value),
    tags: parseTokenString(manualTagsInput.value),
    notionRef: manualNotionInput.value.trim(),
    objectivePole: manualObjectivePoleInput.value.trim(),
    objectiveOkr: manualObjectiveOkrInput.value.trim(),
    objectiveKr: manualObjectiveKrInput.value.trim(),
    notes: manualNotesInput.value.trim(),
    start: start.toISOString(),
    end: end.toISOString(),
    durationMs,
  };

  const activeSessionBeingEdited =
    (manualEditingSessionId && getPersistedActiveSessions().find((item) => item.id === manualEditingSessionId)) ?? null;

  if (activeSessionBeingEdited) {
    const nextActiveSession = normalizeSession({
      ...activeSessionBeingEdited,
      ...manualSession,
      pausedAt: activeSessionBeingEdited.pausedAt ?? null,
      pausedDurationMs: Number(activeSessionBeingEdited.pausedDurationMs) || 0,
      isServerActive: true,
    });
    activeSession = nextActiveSession;
    persistActiveSession();
    syncTimerLoopWithActiveSession();
    hydrateFormFromActiveSession();
    manualEditingSessionId = null;
    manualDialog.close();
    saveManualButton.textContent = "Enregistrer";
    renderObjectiveSelections();
    render();
    void logSessionChange(activeSessionBeingEdited, nextActiveSession, "manual-edit-active");
    void upsertActiveSessionToSupabase(nextActiveSession);
    return;
  }

  attemptSaveSession(manualSession, {
    excludeId: manualEditingSessionId,
    onSuccess: (sessionToSave) => {
      const previousSession =
        manualEditingSessionId ? findSessionById(manualEditingSessionId) ?? null : null;
      upsertSession(sessionToSave);
      persistSessions();
      void logSessionChange(previousSession, sessionToSave, previousSession ? "manual-edit" : "manual-create");
      void syncSessionToSupabase(sessionToSave, previousSession ? "manual" : "manual");
      manualEditingSessionId = null;
      manualDialog.close();
      saveManualButton.textContent = "Enregistrer";
      renderObjectiveSelections();
      render();
    },
  });
}

function attemptSaveSession(session, options = {}) {
  const overlap = findOverlappingSession(session, options.excludeId);
  if (overlap) {
    showConflict(session, overlap, options.onSuccess);
    return false;
  }

  if (options.onSuccess) {
    options.onSuccess(session);
  } else {
    upsertSession(session);
    persistSessions();
    render();
  }
  return true;
}

function upsertSession(session) {
  const normalizedSession = normalizeSession(session);
  const index = sessions.findIndex((item) => item.id === session.id);
  if (index >= 0) {
    sessions[index] = normalizedSession;
  } else {
    sessions.unshift(normalizedSession);
  }
  sessions.sort((a, b) => new Date(b.start) - new Date(a.start));
}

function findOverlappingSession(session, excludeId = null) {
  const start = new Date(session.start).getTime();
  const end = new Date(session.end).getTime();
  const collaboratorKey = normalizeText(session.collaborator);

  return (
    getAllSessionsWithActive().find((existing) => {
      if (existing.id === excludeId) {
        return false;
      }
      if (normalizeText(existing.collaborator) !== collaboratorKey) {
        return false;
      }
      const existingStart = new Date(existing.start).getTime();
      const existingEnd = new Date(existing.end).getTime();
      return start < existingEnd && end > existingStart;
    }) ?? null
  );
}

function showConflict(newSession, existingSession, onResolve) {
  pendingConflict = { newSession, existingSession, onResolve };
  const adjusted = getAdjustedSession(newSession, existingSession);
  conflictMessage.textContent =
    "Le meme cargonaute a deja une session qui chevauche ce creneau.";
  conflictDetail.textContent = `${existingSession.collaborator} · ${existingSession.project} · ${formatDate(
    existingSession.start,
  )} · ${formatDuration(existingSession.durationMs)}`;
  adjustConflictButton.disabled = !adjusted;
  conflictDialog.showModal();
}

function getAdjustedSession(newSession, existingSession) {
  const start = new Date(newSession.start).getTime();
  const end = new Date(newSession.end).getTime();
  const existingStart = new Date(existingSession.start).getTime();
  const existingEnd = new Date(existingSession.end).getTime();
  const candidates = [];

  if (start < existingStart) {
    candidates.push({ start, end: existingStart });
  }
  if (end > existingEnd) {
    candidates.push({ start: existingEnd, end });
  }

  const best = candidates
    .map((candidate) => ({ ...candidate, durationMs: candidate.end - candidate.start }))
    .filter((candidate) => candidate.durationMs > 0)
    .sort((a, b) => b.durationMs - a.durationMs)[0];

  if (!best) {
    return null;
  }

  return {
    ...newSession,
    start: new Date(best.start).toISOString(),
    end: new Date(best.end).toISOString(),
    durationMs: best.durationMs,
  };
}

function startTimerLoopIfNeeded() {
  if (!activeSession || activeSession.pausedAt || timerIntervalId) {
    return;
  }

  timerIntervalId = window.setInterval(() => {
    updateLiveCounters();
  }, 1000);
}

function stopTimerLoop() {
  if (!timerIntervalId) {
    return;
  }

  window.clearInterval(timerIntervalId);
  timerIntervalId = null;
}

function updateLiveTimer() {
  timerDisplay.textContent = activeSession ? formatClock(getActiveSessionDurationMs(activeSession)) : "00:00:00";
}

function updateLiveCounters() {
  updateLiveTimer();

  const collaborator = getCurrentCollaborator();
  if (!collaborator || !activeSession) {
    return;
  }

  const activeDurationMs = getActiveSessionDurationMs(activeSession);
  const rows = getSessionsForCollaborator(collaborator);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = getStartOfWeek(now);

  let todayMs = 0;
  let weekMs = 0;
  for (const session of rows) {
    const start = new Date(session.start);
    const durationMs = session.id === activeSession.id ? activeDurationMs : (Number(session.durationMs) || 0);
    if (start >= todayStart) {
      todayMs += durationMs;
    }
    if (start >= weekStart) {
      weekMs += durationMs;
    }
  }

  todayTotal.textContent = formatDuration(todayMs);
  weekTotal.textContent = formatDuration(weekMs);
}

function render() {
  renderViewChrome();
  renderAccessControlledInputs();
  renderCurrentUserContext();
  renderAuthPanel();
  updateFieldManageButtons();
  renderActiveSession();
  renderSuggestions();
  renderQuickProjects();
  renderProjectMemoryList();
  renderAgendaImportPanel();
  renderSessionList();
  renderCadreViews();
  renderManagerControls();
  renderManagerViews();
  renderResourcesViews();
}

function renderCurrentUserContext() {
  // The active identity is now handled directly by the dropdown in the topbar.
}

function renderAccessControlledInputs() {
  const hasAuthenticatedUser = Boolean(accessProfile.appUser?.user_name);

  if (hasAuthenticatedUser) {
    collaboratorInput.value = accessProfile.appUser.user_name;
    manualCollaboratorInput.value = accessProfile.appUser.user_name;
  } else {
    collaboratorInput.value = "";
    manualCollaboratorInput.value = "";
  }

  collaboratorInput.readOnly = hasAuthenticatedUser;
  manualCollaboratorInput.readOnly = hasAuthenticatedUser;
}

function formatRoleLabel(role) {
  if (role === "admin") {
    return "Admin";
  }
  if (role === "manager") {
    return "Manager";
  }
  if (role === "cadre") {
    return "Cargonaute";
  }
  return "Mode local";
}

function renderAuthPanel() {
  if (!loginNameInput) {
    return;
  }

  const authenticated = Boolean(accessProfile.appUser?.user_name);
  const visibleUsers = [...getKnownUsers()].sort((a, b) => a.user_name.localeCompare(b.user_name, "fr"));
  renderLoginNameOptions(visibleUsers);

  loginNameInput.value = authenticated ? accessProfile.appUser.user_name : "";

  if (!authStatus) {
    return;
  }

  if (!visibleUsers.length) {
    authStatus.hidden = false;
    authStatus.textContent = "Aucun nom disponible pour le moment.";
    return;
  }

  authStatus.hidden = true;
  authStatus.textContent = "";
}

function renderActiveSession() {
  if (!activeSession) {
    timerDisplay.textContent = "00:00:00";
    activeTaskLabel.textContent = "Pret a lancer une nouvelle session.";
    toggleButton.textContent = "Demarrer";
    toggleButton.classList.remove("running");
    pauseButton.hidden = true;
    pauseButton.classList.remove("paused");
    activeStartDisplay.textContent = "Le depart se regle si besoin";
    activeStartDisplay.disabled = true;
    return;
  }

  const isPaused = Boolean(activeSession.pausedAt);
  activeTaskLabel.textContent = isPaused ? "Session en pause." : "Session en cours.";
  toggleButton.textContent = "Arreter";
  toggleButton.classList.toggle("running", !isPaused);
  pauseButton.hidden = false;
  pauseButton.textContent = isPaused ? "Reprendre" : "Mettre en pause";
  pauseButton.classList.toggle("paused", isPaused);
  activeStartDisplay.textContent = `Demarre a ${formatTimeLabel(new Date(activeSession.start))}`;
  activeStartDisplay.disabled = false;
  updateLiveTimer();
}

function showActiveStartEditor() {
  if (!activeSession) {
    return;
  }

  const editableSession = normalizeSession({
    ...activeSession,
    end: getActiveSessionEffectiveEnd(activeSession).toISOString(),
    durationMs: getActiveSessionDurationMs(activeSession),
  });

  openManualDialog(editableSession);
  window.setTimeout(() => {
    manualStartInput.focus();
    if (typeof manualStartInput.showPicker === "function") {
      try {
        manualStartInput.showPicker();
      } catch (error) {
        // Some browsers refuse showPicker outside strict user gesture timing.
      }
    }
  }, 0);
}

function hideActiveStartEditor() {
  activeStartDialog?.close();
  renderActiveSession();
}

function renderSuggestions() {
  fillDatalist(
    projectSuggestions,
    referenceCatalog.loaded
      ? referenceCatalog.projects.map((item) => item.project_name).sort((a, b) => a.localeCompare(b, "fr"))
      : uniqueValues("project"),
  );
  fillDatalist(
    collaboratorSuggestions,
    getVisibleReferenceUsers().length
      ? getVisibleReferenceUsers().map((item) => item.user_name).sort((a, b) => a.localeCompare(b, "fr"))
      : uniqueValues("collaborator"),
  );
  fillDatalist(
    categorySuggestions,
    referenceCatalog.loaded
      ? referenceCatalog.categories
          .map((item) => item.activity_category_label)
          .sort((a, b) => a.localeCompare(b, "fr"))
      : uniqueTokenValues("categories"),
  );
  fillDatalist(tagSuggestions, uniqueTokenValues("tags"));

  const currentValue = managerCollaboratorFilter.value || "all";
  const collaborators = getVisibleReferenceUsers().length
    ? getVisibleReferenceUsers().map((item) => item.user_name).sort((a, b) => a.localeCompare(b, "fr"))
    : uniqueValues("collaborator");
  managerCollaboratorFilter.innerHTML = "";

  const teamOption = document.createElement("option");
  teamOption.value = "all";
  teamOption.textContent = "Toute l'equipe";
  managerCollaboratorFilter.append(teamOption);

  for (const collaborator of collaborators) {
    const option = document.createElement("option");
    option.value = collaborator;
    option.textContent = collaborator;
    managerCollaboratorFilter.append(option);
  }

  managerCollaboratorFilter.value = collaborators.includes(currentValue) ? currentValue : "all";
}

function renderLoginNameOptions(users = [...getKnownUsers()].sort((a, b) => a.user_name.localeCompare(b.user_name, "fr"))) {
  if (!loginNameInput) {
    return;
  }

  const currentValue = accessProfile.appUser?.user_name || loginNameInput.value || "";
  loginNameInput.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Choisir un nom";
  loginNameInput.append(placeholder);

  for (const user of users) {
    const option = document.createElement("option");
    option.value = user.user_name;
    option.textContent = user.user_name;
    loginNameInput.append(option);
  }

  loginNameInput.value = users.some((user) => user.user_name === currentValue) ? currentValue : "";
}

function renderQuickProjects() {
  quickProjects.innerHTML = "";
  const collaborator = getCurrentCollaborator();
  const memories = getOrderedProjectMemories(collaborator).slice(0, QUICK_REPRISES_LIMIT);

  // Garantir que les zones Archiver/Traite sont cachées sauf si un drag est en cours
  if (!quickProjectsDragState) {
    repriseActionsShell?.setAttribute("hidden", "");
    quickProjects.classList.remove("chip-row--sorting");
  }

  if (!memories.length) {
    const message = collaborator
      ? "Les reprises probables apparaitront ici."
      : "Choisissez un nom pour retrouver vos reprises probables.";
    quickProjects.append(createEmptyState(message));
    return;
  }

  for (const memory of memories) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.dataset.memoryKey = memory.key;
    button.draggable = true;
    button.textContent = collaborator ? memory.project : `${memory.project} · ${memory.collaborator}`;
    applyCategorySurface(button, getMemoryAccentColor(memory));
    quickProjects.append(button);
  }
}

function renderProjectMemoryList() {
  projectMemoryList.innerHTML = "";
  const collaborator = getCurrentCollaborator();
  const memories = getOrderedProjectMemories(collaborator).slice(0, MEMORY_CONTEXT_LIMIT);

  if (!memories.length) {
    const message = collaborator
      ? `Les contextes memorises de ${collaborator} apparaitront ici.`
      : "Choisissez un cargonaute pour afficher ses contextes memorises.";
    projectMemoryList.append(createEmptyState(message));
    return;
  }

  for (const memory of memories) {
    const card = document.createElement("article");
    card.className = "memory-card";

    const copy = document.createElement("div");
    copy.className = "memory-copy";

    const title = document.createElement("h3");
    title.textContent = memory.project;

    const meta = document.createElement("p");
    meta.className = "muted-copy";
    meta.textContent = `${memory.task || "Client non precise"} · ${memory.usesCount} reprises · ${formatDate(memory.start)}`;

    const tags = document.createElement("div");
    tags.className = "memory-meta";

    if (memory.objectivePole) {
      tags.append(createPill(memory.objectivePole));
    }
    for (const category of memory.categories) {
      tags.append(createPill(category));
    }
    for (const tag of memory.tags) {
      tags.append(createPill(`#${tag}`));
    }
    if (memory.notionRef) {
      tags.append(createPill("Lien"));
    }

    copy.append(title, meta, tags);

    const action = document.createElement("button");
    action.type = "button";
    action.className = "btn btn-secondary";
    action.dataset.memoryKey = memory.key;
    action.textContent = "Recharger";

    card.append(copy, action);
    projectMemoryList.append(card);
  }
}

async function loadAgendaImportRows() {
  if (!window.supabase) {
    return false;
  }

  const { data, error } = await window.supabase
    .from("agenda_import_staging")
    .select("*")
    .order("entry_date", { ascending: false })
    .order("start_time", { ascending: false })
    .limit(24);

  if (error) {
    console.warn("agenda_import_staging load failed:", error);
    agendaImportRows = [];
    agendaImportLoaded = false;
    return false;
  }

  agendaImportRows = data ?? [];
  agendaImportLoaded = true;
  return true;
}

function renderAgendaImportPanel() {
  if (!agendaImportPanel || !agendaImportList) {
    return;
  }

  const visible = getAccessRole() === "admin";
  agendaImportPanel.hidden = !visible;
  if (!visible) {
    return;
  }

  agendaImportList.innerHTML = "";

  if (!agendaImportLoaded) {
    agendaImportList.append(createEmptyState("Chargez ou rechargez la vue pour lire les imports agenda."));
    return;
  }

  if (!agendaImportRows.length) {
    agendaImportList.append(createEmptyState("Aucun import agenda en staging pour le moment."));
    return;
  }

  for (const row of agendaImportRows) {
    const card = document.createElement("article");
    card.className = "memory-card";

    const copy = document.createElement("div");
    copy.className = "memory-copy";

    const title = document.createElement("h3");
    title.textContent = row.title || "Sans titre";

    const meta = document.createElement("p");
    meta.className = "muted-copy";
    const timeLabel = row.end_time ? `${row.start_time.slice(0, 5)} - ${row.end_time.slice(0, 5)}` : `${row.start_time.slice(0, 5)} - ?`;
    meta.textContent = [row.user_name, row.entry_date, timeLabel].filter(Boolean).join(" · ");

    const detail = document.createElement("div");
    detail.className = "memory-meta";
    renderPills(
      detail,
      [
        row.project_name ? `Projet · ${row.project_name}` : "",
        row.client_name ? `Client · ${row.client_name}` : "",
        row.category_label ? `Categorie · ${row.category_label}` : "Categorie a attribuer",
        row.needs_review ? "A revoir" : "",
      ].filter(Boolean),
    );

    const notes = document.createElement("p");
    notes.className = "session-notes";
    notes.textContent = row.review_reason || row.notes || "";
    notes.hidden = !notes.textContent;

    copy.append(title, meta, detail, notes);
    card.append(copy);
    agendaImportList.append(card);
  }
}

function renderSessionList() {
  sessionList.innerHTML = "";
  const visibleSessions = getScopedSessions(sessions);

  if (!visibleSessions.length) {
    sessionList.append(createEmptyState("Le journal affichera ici les entrees enregistrees."));
    return;
  }

  for (const session of visibleSessions.slice(0, 10)) {
    const fragment = sessionItemTemplate.content.cloneNode(true);
    const item = fragment.querySelector(".session-item");
    item.dataset.sessionId = session.id;

    fragment.querySelector(".session-task").textContent = session.project || session.task || "Sans projet";
    fragment.querySelector(".session-secondary").textContent = [
      session.collaborator,
      session.task,
      session.notionRef ? "Lien" : "",
    ]
      .filter(Boolean)
      .join(" · ");
    fragment.querySelector(".session-duration").textContent = formatDuration(session.durationMs);
    fragment.querySelector(".session-date").textContent = formatDate(session.start);

    const notesElement = fragment.querySelector(".session-notes");
    notesElement.textContent = session.notes || "";
    notesElement.hidden = !session.notes;

    const metaParts = [
      ...(session.categories ?? []).slice(0, 1).map((category) => `Categorie · ${category}`),
      ...(session.objectiveOkr ? [`OKR · ${formatObjectiveOkrDisplay(session.objectiveOkr)}`] : []),
      ...(session.objectiveKr ? [`KR · ${formatObjectiveKrDisplay(session.objectiveKr)}`] : []),
    ];
    const categoriesElement = fragment.querySelector(".session-categories");
    categoriesElement.textContent = metaParts.join(" · ");
    categoriesElement.hidden = !metaParts.length;

    renderPills(
      fragment.querySelector(".session-tags"),
      session.tags.map((tag) => `#${tag}`),
    );

    sessionList.append(fragment);
  }
}

function renderCadreViews() {
  renderPersonalStats();
  renderPersonalDistribution();
  renderAgenda();
}

function renderPersonalStats() {
  const collaborator = getCurrentCollaborator();
  if (!collaborator) {
    todayTotal.textContent = "0 h 00";
    weekTotal.textContent = "0 h 00";
  todayPanelCopy.textContent = "Choisissez un nom pour charger votre semaine.";
    teamCount.textContent = "0";
    activeCountCopy.textContent = "Aucune session en cours.";
    return;
  }

  const rows = getSessionsForCollaborator(collaborator);
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = getStartOfWeek(now);

  let todayMs = 0;
  let weekMs = 0;
  for (const session of rows) {
    const start = new Date(session.start);
    const durationMs = Number(session.durationMs) || 0;
    if (start >= todayStart) {
      todayMs += durationMs;
    }
    if (start >= weekStart) {
      weekMs += durationMs;
    }
  }

  todayTotal.textContent = formatDuration(todayMs);
  weekTotal.textContent = formatDuration(weekMs);
  todayPanelCopy.textContent = `Temps saisi aujourd'hui pour ${collaborator}.`;

  const collaborators = new Set(getScopedSessions(getAllSessionsWithActive()).map((session) => session.collaborator).filter(Boolean));
  teamCount.textContent = String(collaborators.size);
  activeCountCopy.textContent = activeSession
    ? `Session en cours pour ${activeSession.collaborator}.`
    : "Aucune session en cours.";
}

function renderPersonalDistribution() {
  const collaborator = getCurrentCollaborator();
  const usesObjectives = statsMode === "objectives";

  personalStatsTitle.textContent = usesObjectives ? "Objectifs en cours" : "Categories en cours";
  personalStatsCopy.textContent = usesObjectives
    ? "Lecture compacte par OKR et KR quand ils sont renseignes."
    : "Lecture compacte par type de travail sur la semaine.";

  if (!collaborator) {
    renderDistribution(personalDistributionBar, personalDistributionLegend, [], 0, "Choisissez un cargonaute pour voir sa semaine.");
    return;
  }

  const range = getPeriodRange(getReportAnchorDate(), "week");
  const rows = getSessionsForCollaborator(collaborator).filter((session) => isSessionInRange(session, range));
  const objectiveRows = buildObjectiveOkrRows(rows);
  const fallbackRows = buildReportRows(rows, "categories");
  const displayRows = usesObjectives ? objectiveRows : fallbackRows;
  const totalMs = displayRows.reduce((sum, row) => sum + row.durationMs, 0);

  renderDistribution(
    personalDistributionBar,
    personalDistributionLegend,
    displayRows,
    totalMs,
    usesObjectives
      ? "Aucun objectif 2026 renseigne cette semaine pour ce cargonaute."
      : "Aucune categorie enregistree cette semaine pour ce cargonaute.",
  );
}

function renderAgenda() {
  agendaBoard.innerHTML = "";
  const collaborator = getCurrentCollaborator();
  if (!collaborator) {
    agendaBoard.append(createEmptyState("Choisissez un nom pour afficher et deplacer vos creneaux."));
    if (agendaWeekLabel) {
      agendaWeekLabel.textContent = "";
    }
    return;
  }
  const range = getPeriodRange(getReportAnchorDate(), "week");
  if (agendaWeekLabel) {
    agendaWeekLabel.textContent = formatPeriodLabel(range.start, range.end, "week");
  }
  const rows = getAllSessionsWithActive().filter((session) => isSessionInRange(session, range));
  const scopedRows = rows.filter((session) => normalizeText(session.collaborator) === normalizeText(collaborator));

  const startHour = 0;
  const endHour = 24;
  const hourHeight = 38;
  agendaBoard.style.setProperty("--agenda-hour-height", `${hourHeight}px`);

  const timeRail = document.createElement("div");
  timeRail.className = "agenda-time-rail";

  const timeRailHead = document.createElement("div");
  timeRailHead.className = "agenda-time-head";
  timeRail.append(timeRailHead);

  const timeRailBody = document.createElement("div");
  timeRailBody.className = "agenda-time-body";
  timeRailBody.style.height = `${(endHour - startHour) * hourHeight}px`;

  for (let hour = startHour; hour <= endHour; hour += 1) {
    const mark = document.createElement("div");
    mark.className = "agenda-time-mark";
    mark.style.top = `${(hour - startHour) * hourHeight}px`;
    mark.textContent = `${String(hour).padStart(2, "0")}:00`;
    timeRailBody.append(mark);
  }

  timeRail.append(timeRailBody);
  agendaBoard.append(timeRail);

  for (let index = 0; index < 7; index += 1) {
    const day = new Date(range.start);
    day.setDate(day.getDate() + index);

    const dayCard = document.createElement("article");
    dayCard.className = "agenda-day";

    const dayRows = scopedRows
      .filter((session) => isSameDay(new Date(session.start), day))
      .sort((a, b) => new Date(a.start) - new Date(b.start));

    const dayTotal = dayRows.reduce((sum, session) => sum + (Number(session.durationMs) || 0), 0);

    const headMeta = document.createElement("div");
    headMeta.className = "agenda-day-meta";

    const dayNumber = document.createElement("strong");
    dayNumber.className = "agenda-day-number";
    dayNumber.textContent = String(day.getDate());

    const headCopy = document.createElement("div");
    headCopy.className = "agenda-day-copy";

    const title = document.createElement("h3");
    title.textContent = formatAgendaDayLabel(day);

    const subtitle = document.createElement("p");
    subtitle.textContent = dayTotal ? formatDurationHours(dayTotal) : "0 h";

    const dayHead = document.createElement("div");
    dayHead.className = "agenda-day-head";
    headCopy.append(title, subtitle);
    headMeta.append(dayNumber, headCopy);
    dayHead.append(headMeta);
    dayCard.append(dayHead);

    const dayTrack = document.createElement("div");
    dayTrack.className = "agenda-day-track";
    dayTrack.style.height = `${(endHour - startHour) * hourHeight}px`;
    dayTrack.dataset.dayDate = formatDateInput(day);
    dayTrack.dataset.startHour = String(startHour);
    dayTrack.dataset.endHour = String(endHour);
    dayTrack.dataset.hourHeight = String(hourHeight);

    if (!dayRows.length) {
      const empty = createEmptyState("Ajouter un shift");
      empty.classList.add("agenda-empty-state");
      dayTrack.append(empty);
      const nowMarker = createAgendaNowMarker(day, startHour, endHour, hourHeight);
      if (nowMarker) {
        dayTrack.append(nowMarker);
      }
      dayCard.append(dayTrack);
      agendaBoard.append(dayCard);
      continue;
    }

    const laidOutRows = layoutAgendaSessions(dayRows, startHour, endHour, hourHeight);

    for (const row of laidOutRows) {
      const session = row.session;
      const visualSize = getAgendaEventVisualSize(row.heightPx);

      const event = document.createElement("button");
      event.type = "button";
      event.className = "agenda-event";
      if (visualSize !== "full") {
        event.classList.add(`agenda-event--${visualSize}`);
      }
      event.dataset.sessionId = session.id;
      event.style.top = `${row.topPx}px`;
      event.style.height = `${row.heightPx}px`;
      event.style.left = `${row.leftOffset}%`;
      event.style.width = `${row.widthPercent}%`;
      event.title = buildAgendaTooltip(session);
      applyAgendaEventColor(event, session);
      renderAgendaEventContents(event, session, visualSize);

      dayTrack.append(event);
    }

    const nowMarker = createAgendaNowMarker(day, startHour, endHour, hourHeight);
    if (nowMarker) {
      dayTrack.append(nowMarker);
    }

    dayCard.append(dayTrack);
    agendaBoard.append(dayCard);
  }
}

function layoutAgendaSessions(dayRows, startHour, endHour, hourHeight) {
  const preparedRows = dayRows.map((session) => {
    const start = new Date(session.start);
    const end = new Date(session.end);
    const visibleStartMinutes = Math.max(0, (start.getHours() - startHour) * 60 + start.getMinutes());
    const visibleEndMinutes = Math.min((endHour - startHour) * 60, (end.getHours() - startHour) * 60 + end.getMinutes());
    return {
      session,
      startMinutes: visibleStartMinutes,
      endMinutes: Math.max(visibleEndMinutes, visibleStartMinutes + 15),
    };
  });

  const groups = [];
  let currentGroup = [];
  let currentMaxEnd = -1;

  for (const row of preparedRows) {
    if (!currentGroup.length || row.startMinutes < currentMaxEnd) {
      currentGroup.push(row);
      currentMaxEnd = Math.max(currentMaxEnd, row.endMinutes);
      continue;
    }

    groups.push(currentGroup);
    currentGroup = [row];
    currentMaxEnd = row.endMinutes;
  }

  if (currentGroup.length) {
    groups.push(currentGroup);
  }

  return groups.flatMap((group) => assignAgendaGroupLanes(group, hourHeight));
}

function assignAgendaGroupLanes(group, hourHeight) {
  const active = [];
  let maxLane = 0;

  for (const row of group) {
    for (let index = active.length - 1; index >= 0; index -= 1) {
      if (active[index].endMinutes <= row.startMinutes) {
        active.splice(index, 1);
      }
    }

    let lane = 0;
    while (active.some((item) => item.lane === lane)) {
      lane += 1;
    }

    row.lane = lane;
    active.push(row);
    maxLane = Math.max(maxLane, lane);
  }

  const columns = Math.max(maxLane + 1, 1);
  const gutterPercent = columns > 1 ? 2.2 : 0;
  const widthPercent = columns > 1 ? (100 - gutterPercent * (columns - 1)) / columns : 100;

  return group.map((row) => ({
    session: row.session,
    topPx: (row.startMinutes / 60) * hourHeight,
    heightPx: Math.max(((row.endMinutes - row.startMinutes) / 60) * hourHeight, 4),
    leftOffset: row.lane * (widthPercent + gutterPercent),
    widthPercent,
  }));
}

function getAgendaEventVisualSize(heightPx) {
  if (heightPx < 24) {
    return "tiny";
  }
  if (heightPx < 46) {
    return "compact";
  }
  return "full";
}

function renderAgendaEventContents(element, session, visualSize) {
  element.innerHTML = "";

  const topHandle = document.createElement("span");
  topHandle.className = "agenda-resize-handle agenda-resize-handle--start";
  topHandle.setAttribute("aria-hidden", "true");
  element.append(topHandle);

  if (visualSize !== "tiny") {
    const time = document.createElement("p");
    time.className = "agenda-event-time";
    time.textContent = `${formatTimeRange(session)} · ${formatDurationHours(session.durationMs)}`;
    element.append(time);
  }

  if (visualSize === "full") {
    const client = document.createElement("p");
    client.className = "agenda-event-client";
    client.textContent = getSessionClientLabel(session);
    element.append(client);

    const icon = document.createElement("span");
    icon.className = "agenda-event-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "i";
    element.append(icon);
  }

  const bottomHandle = document.createElement("span");
  bottomHandle.className = "agenda-resize-handle agenda-resize-handle--end";
  bottomHandle.setAttribute("aria-hidden", "true");
  element.append(bottomHandle);
}

function applyAgendaEventColor(element, session) {
  const label = session.categories?.[0] || session.objectivePole || session.project || session.collaborator || "agenda";
  const baseColor = session.categories?.[0]
    ? getCategoryColor(session.categories[0], label)
    : getAgendaCategoryColor(label);
  element.style.setProperty("--agenda-accent", baseColor);
  element.style.background = `${baseColor}1F`;
  element.style.borderColor = `${baseColor}42`;
}

function getAgendaCategoryColor(label) {
  const normalized = normalizeText(label);
  const palette = [
    ["delivery", "#9dc4f2"],
    ["livraison", "#9dc4f2"],
    ["support", "#efc1da"],
    ["management", "#c8d2f2"],
    ["pilotage", "#c8d2f2"],
    ["interne", "#dce6b1"],
    ["internal", "#dce6b1"],
    ["learning", "#f6dfab"],
    ["formation", "#f6dfab"],
    ["business", "#bfe1c7"],
    ["bizdev", "#bfe1c7"],
  ];
  const matched = palette.find(([token]) => normalized.includes(token));
  return matched ? matched[1] : colorForLabel(label);
}

function createAgendaNowMarker(day, startHour, endHour, hourHeight) {
  const now = new Date();
  if (!isSameDay(day, now)) {
    return null;
  }
  const minutesFromStart = (now.getHours() - startHour) * 60 + now.getMinutes();
  if (minutesFromStart < 0 || minutesFromStart > (endHour - startHour) * 60) {
    return null;
  }

  const marker = document.createElement("div");
  marker.className = "agenda-now-marker";
  marker.style.top = `${(minutesFromStart / 60) * hourHeight}px`;
  const label = document.createElement("span");
  label.className = "agenda-now-label";
  label.textContent = formatTimeLabel(now);
  marker.append(label);
  return marker;
}

function resolveAgendaSlotFromClick(track, event) {
  const dayDate = track.dataset.dayDate;
  const startHour = Number(track.dataset.startHour);
  const endHour = Number(track.dataset.endHour);
  const hourHeight = Number(track.dataset.hourHeight);

  if (!dayDate || !Number.isFinite(startHour) || !Number.isFinite(endHour) || !Number.isFinite(hourHeight)) {
    return null;
  }

  const rect = track.getBoundingClientRect();
  const relativeY = Math.min(Math.max(event.clientY - rect.top, 0), rect.height);
  const minutesFromStart = roundToQuarterHour((relativeY / hourHeight) * 60);
  const boundedMinutes = Math.min(Math.max(minutesFromStart, 0), (endHour - startHour) * 60 - 15);

  const start = new Date(`${dayDate}T00:00:00`);
  start.setHours(startHour, 0, 0, 0);
  start.setMinutes(start.getMinutes() + boundedMinutes);

  const end = new Date(start.getTime() + 30 * 60 * 1000);

  return {
    collaborator: getCurrentCollaborator() || collaboratorInput.value.trim(),
    start,
    end,
  };
}

function roundToQuarterHour(minutes) {
  return Math.round(minutes / 15) * 15;
}

function renderManagerControls() {
  for (const button of periodSwitch.querySelectorAll("[data-period]")) {
    button.classList.toggle("active", button.dataset.period === reportPeriod);
  }

  syncStatsSwitch(personalStatsSwitch);
  syncStatsSwitch(analysisStatsSwitch);
}

function syncStatsSwitch(container) {
  if (!container) {
    return;
  }

  for (const button of container.querySelectorAll("[data-stats-mode]")) {
    button.classList.toggle("active", button.dataset.statsMode === statsMode);
  }
}

function renderManagerViews() {
  const anchor = getReportAnchorDate();
  const range = getPeriodRange(anchor, reportPeriod);
  const filterCollaborator = managerCollaboratorFilter.value;
  const allRows = getScopedSessions(getAllSessionsWithActive().filter((session) => isSessionInRange(session, range)));
  const scopedRows =
    filterCollaborator === "all"
      ? allRows
      : allRows.filter((session) => normalizeText(session.collaborator) === normalizeText(filterCollaborator));

  const usesObjectives = statsMode === "objectives";
  renderManagerSummary(allRows, scopedRows, range, filterCollaborator);
  const managerObjectiveRows = buildObjectiveOkrRows(scopedRows);
  const managerCategoryRows = buildReportRows(scopedRows, "categories");
  const managerDisplayRows = usesObjectives ? managerObjectiveRows : managerCategoryRows;
  const managerObjectiveTotalMs = managerObjectiveRows.reduce((sum, row) => sum + row.durationMs, 0);
  const managerCategoryTotalMs = scopedRows.reduce((sum, session) => sum + (Number(session.durationMs) || 0), 0);
  managerDistributionTitle.textContent = usesObjectives ? "Repartition OKR" : "Repartition categories";
  managerDistributionCopy.textContent = usesObjectives
    ? "Poids relatif des objectifs sur la periode."
    : "Poids relatif des categories sur la periode.";
  reportCategoryHead.textContent = usesObjectives ? "OKR" : "Categorie";
  managerObjectivesPanel.hidden = !usesObjectives;
  reportKrShell.hidden = !usesObjectives;
  renderDistribution(
    managerDistributionBar,
    managerDistributionLegend,
    managerDisplayRows,
    usesObjectives ? managerObjectiveTotalMs : managerCategoryTotalMs,
    usesObjectives ? "Aucun OKR renseigne sur cette plage." : "Aucune categorie disponible sur cette plage.",
  );
  renderEvolutionGrid(evolutionGrid, anchor, filterCollaborator);
  if (usesObjectives) {
    renderManagerObjectives(scopedRows);
  } else {
    managerObjectivesGrid.innerHTML = "";
  }
  renderTeamTable(teamReportList, allRows, range, "Aucune donnee equipe sur cette plage.");
  renderReportTable(
    reportProjectList,
    buildReportRows(scopedRows, "project"),
    scopedRows.reduce((sum, session) => sum + (Number(session.durationMs) || 0), 0),
    "Aucun projet pour cette plage.",
  );
  renderReportTable(
    reportCategoryList,
    managerDisplayRows,
    usesObjectives ? managerObjectiveTotalMs : managerCategoryTotalMs,
    usesObjectives ? "Aucun OKR pour cette plage." : "Aucune categorie pour cette plage.",
  );
  if (usesObjectives) {
    renderReportTable(
      reportKrList,
      buildObjectiveKrRowsFromSessions(scopedRows),
      scopedRows.reduce((sum, session) => sum + (Number(session.durationMs) || 0), 0),
      "Aucun KR pour cette plage.",
    );
  } else {
    reportKrList.innerHTML = "";
  }
}

function renderResourcesViews() {
  const anchor = getReportAnchorDate();
  const range = getPeriodRange(anchor, reportPeriod);
  const allRows = getScopedSessions(getAllSessionsWithActive().filter((session) => isSessionInRange(session, range)));
  const usesObjectives = statsMode === "objectives";
  const totalMs = allRows.reduce((sum, session) => sum + (Number(session.durationMs) || 0), 0);
  const projectTotals = buildReportRows(allRows, "project");
  const objectiveTotals = buildObjectiveOkrRows(allRows);
  const categoryTotals = buildReportRows(allRows, "categories");
  const krTotals = buildObjectiveKrRowsFromSessions(allRows);
  resourceTotal.textContent = formatDuration(totalMs);
  resourceRange.textContent = formatPeriodLabel(range.start, range.end, reportPeriod);
  resourceTopProject.textContent = projectTotals[0]?.label ?? "-";
  resourceTopProjectTime.textContent = projectTotals[0] ? formatDuration(projectTotals[0].durationMs) : "0 h 00";
  resourceDistributionTitle.textContent = usesObjectives ? "Repartition globale OKR" : "Repartition globale categories";
  resourceDistributionCopy.textContent = usesObjectives
    ? "Lecture transversale des objectifs sur la plage choisie."
    : "Lecture transversale des categories sur la plage choisie.";
  resourceCategoryHead.textContent = usesObjectives ? "OKR" : "Categorie";
  resourceObjectivesPanel.hidden = !usesObjectives;
  resourceKrShell.hidden = !usesObjectives;
  resourceTopCategoryLabel.textContent = usesObjectives ? "OKR principal" : "Categorie principale";
  resourceTopCategory.textContent = (usesObjectives ? objectiveTotals[0] : categoryTotals[0])?.label ?? "-";
  resourceTopCategoryTime.textContent = (usesObjectives ? objectiveTotals[0] : categoryTotals[0])
    ? formatDuration((usesObjectives ? objectiveTotals[0] : categoryTotals[0]).durationMs)
    : "0 h 00";
  resourceTopKrCard.hidden = !usesObjectives;
  resourceTopKr.textContent = krTotals[0]?.label ?? "-";
  resourceTopKrTime.textContent = krTotals[0] ? formatDuration(krTotals[0].durationMs) : "0 h 00";

  renderDistribution(
    resourceDistributionBar,
    resourceDistributionLegend,
    usesObjectives ? objectiveTotals : categoryTotals,
    totalMs,
    usesObjectives ? "Aucun OKR renseigne sur cette plage." : "Aucune categorie disponible sur cette plage.",
  );
  renderEvolutionGrid(resourceEvolutionGrid, anchor, "all");
  if (usesObjectives) {
    renderManagerObjectivesInto(resourceObjectivesGrid, allRows);
  } else {
    resourceObjectivesGrid.innerHTML = "";
  }
  renderTeamTable(resourceTeamList, allRows, range, "Aucune donnee equipe sur cette plage.");
  renderReportTable(
    resourceProjectList,
    projectTotals,
    totalMs,
    "Aucun projet sur cette plage.",
  );
  renderReportTable(
    resourceCategoryList,
    usesObjectives ? objectiveTotals : categoryTotals,
    totalMs,
    usesObjectives ? "Aucun OKR sur cette plage." : "Aucune categorie sur cette plage.",
  );
  if (usesObjectives) {
    renderReportTable(
      resourceKrList,
      krTotals,
      totalMs,
      "Aucun KR sur cette plage.",
    );
  } else {
    resourceKrList.innerHTML = "";
  }
}

function getAnalysisExportRows() {
  const anchor = getReportAnchorDate();
  const range = getPeriodRange(anchor, reportPeriod);

  if (currentView === "manager") {
    const allRows = getScopedSessions(getAllSessionsWithActive().filter((session) => isSessionInRange(session, range)));
    const filterCargonaute = managerCollaboratorFilter.value;
    return filterCargonaute === "all"
      ? allRows
      : allRows.filter((session) => normalizeText(session.collaborator) === normalizeText(filterCargonaute));
  }

  return getScopedSessions(getAllSessionsWithActive().filter((session) => isSessionInRange(session, range)));
}

function exportCurrentAnalysisCsv() {
  const rows = getAnalysisExportRows().slice().sort((a, b) => new Date(a.start) - new Date(b.start));
  if (!rows.length) {
    return;
  }

  const csvRows = [
    [
      "date",
      "cargonaute",
      "equipe",
      "client",
      "projet",
      "categorie",
      "kpi_categorie",
      "okr",
      "kr",
      "debut",
      "fin",
      "duree_heures",
      "duree_minutes",
      "lien_interet",
      "note",
    ],
    ...rows.map((session) => [
      new Date(session.start).toISOString().slice(0, 10),
      session.collaborator || "",
      getSessionTeamName(session),
      getSessionClientLabel(session),
      session.project || "",
      session.categories?.[0] || "",
      session.dbKpiCategoryLabel || "",
      formatObjectiveOkrDisplay(session.objectiveOkr),
      formatObjectiveKrDisplay(session.objectiveKr),
      session.start || "",
      session.end || "",
      Number(((Number(session.durationMs) || 0) / 3600000).toFixed(2)).toString(),
      Math.max(1, Math.round((Number(session.durationMs) || 0) / 60000)).toString(),
      session.notionRef || "",
      session.notes || "",
    ]),
  ];

  const csvContent = csvRows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const anchor = getReportAnchorDate();
  const scope = currentView === "manager" ? "manager" : "ressources";
  link.href = url;
  link.download = `grand-livre-${scope}-${reportPeriod}-${formatDateInput(anchor)}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeCsvValue(value) {
  const stringValue = String(value ?? "");
  if (stringValue.includes(",") || stringValue.includes("\"") || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, "\"\"")}"`;
  }
  return stringValue;
}

function renderManagerObjectives(rows) {
  renderManagerObjectivesInto(managerObjectivesGrid, rows);
}

function renderManagerObjectivesInto(container, rows) {
  container.innerHTML = "";

  const cards = OBJECTIVE_2026_CATALOG.map((objective) => buildObjectiveReportCardData(objective, rows));
  const nonEmptyCards = cards.filter((card) => card.totalMs > 0);
  const visibleCards = nonEmptyCards.length ? nonEmptyCards : cards.slice(0, 6);

  if (!visibleCards.length) {
    container.append(createEmptyState("Les objectifs suivis apparaitront ici."));
    return;
  }

  for (const card of visibleCards) {
    container.append(createObjectiveReportCard(card));
  }
}

function buildObjectiveReportCardData(objective, rows) {
  const scopedRows = rows.filter((session) => matchesObjectiveOkr(session.objectiveOkr, objective));
  const totalMs = scopedRows.reduce((sum, session) => sum + (Number(session.durationMs) || 0), 0);
  const krRows = buildObjectiveKrRows(scopedRows, objective);
  const topKr = krRows[0]?.label ?? "Aucun KR dominant";

  return {
    ...objective,
    totalMs,
    sessionCount: scopedRows.length,
    krRows,
    topKr,
  };
}

function buildObjectiveKrRows(rows, objective) {
  const grouped = new Map();

  for (const session of rows) {
    const matchedKr = objective.krs.find((kr) => matchesObjectiveKr(session.objectiveKr, kr));
    const label = matchedKr ? shortenObjectiveLegend(matchedKr) : "Sans KR";
    const current = grouped.get(label) ?? { label, durationMs: 0, count: 0 };
    current.durationMs += Number(session.durationMs) || 0;
    current.count += 1;
    grouped.set(label, current);
  }

  return Array.from(grouped.values()).sort((left, right) => right.durationMs - left.durationMs);
}

function matchesObjectiveOkr(rawValue, objective) {
  const normalized = normalizeObjectiveLabel(rawValue);
  if (!normalized) {
    return false;
  }

  const code = normalizeObjectiveLabel(objective.okrCode);
  const label = normalizeObjectiveLabel(objective.okrLabel);
  return normalized === code || normalized.startsWith(`${code} ·`) || normalized === label || normalized.endsWith(label);
}

function matchesObjectiveKr(rawValue, targetKr) {
  const normalized = normalizeObjectiveLabel(rawValue);
  if (!normalized) {
    return false;
  }

  const target = normalizeObjectiveLabel(targetKr);
  const codeMatch = target.match(/^(rc\s*\d+(?:\.\d+)?|r\d+)/i)?.[0] ?? "";
  return normalized === target || (codeMatch && normalized.startsWith(codeMatch));
}

function normalizeObjectiveLabel(value) {
  return normalizeText(String(value ?? "").replace(/\s+/g, " ").trim());
}

function createObjectiveReportCard(card) {
  const article = document.createElement("article");
  article.className = "objective-report-card";

  const header = document.createElement("div");
  header.className = "objective-report-head";

  const pole = document.createElement("p");
  pole.className = "eyebrow";
  pole.textContent = card.pole;

  const title = document.createElement("h4");
  title.textContent = `${card.okrCode} · ${card.okrLabel}`;

  header.append(pole, title);

  const content = document.createElement("div");
  content.className = "objective-report-content";

  const donut = document.createElement("div");
  donut.className = "objective-donut";
  donut.style.background = buildObjectiveDonutGradient(card.krRows, card.totalMs);

  const donutInner = document.createElement("div");
  donutInner.className = "objective-donut-inner";
  donutInner.innerHTML = `<strong>${card.totalMs ? formatDurationHours(card.totalMs) : "0,0 h"}</strong><span>${card.sessionCount} session${card.sessionCount > 1 ? "s" : ""}</span>`;
  donut.append(donutInner);

  const details = document.createElement("div");
  details.className = "objective-report-details";

  const top = document.createElement("p");
  top.className = "objective-report-top";
  top.textContent = card.totalMs ? `KR dominant · ${card.topKr}` : "Aucun temps rattache sur la plage.";

  const legend = document.createElement("div");
  legend.className = "objective-report-legend";

  if (!card.krRows.length) {
    legend.append(createEmptyState("Aucune saisie rattachee."));
  } else {
    for (const [index, row] of card.krRows.slice(0, 4).entries()) {
      const item = document.createElement("div");
      item.className = "objective-legend-item";

      const swatch = document.createElement("span");
      swatch.className = "objective-legend-swatch";
      swatch.style.background = colorForLabel(`${card.okrCode}-${row.label}-${index}`);

      const label = document.createElement("span");
      label.className = "objective-legend-label";
      label.textContent = `${row.label} · ${formatDurationHours(row.durationMs)}`;

      item.append(swatch, label);
      legend.append(item);
    }
  }

  details.append(top, legend);
  content.append(donut, details);
  article.append(header, content);
  return article;
}

function buildObjectiveDonutGradient(rows, totalMs) {
  if (!totalMs || !rows.length) {
    return "conic-gradient(rgba(24, 56, 74, 0.08) 0deg 360deg)";
  }

  let cursor = 0;
  const segments = rows.map((row, index) => {
    const start = cursor;
    cursor += (row.durationMs / totalMs) * 360;
    const end = index === rows.length - 1 ? 360 : cursor;
    return `${colorForLabel(`objective-${row.label}-${index}`)} ${start}deg ${end}deg`;
  });

  return `conic-gradient(${segments.join(", ")})`;
}

function shortenObjectiveLegend(value) {
  const content = extractObjectiveKrContent(value);
  return content.length <= 42 ? content : `${content.slice(0, 41).trimEnd()}…`;
}

function renderManagerSummary(allRows, scopedRows, range, filterCollaborator) {
  const usesObjectives = statsMode === "objectives";
  const totalMs = scopedRows.reduce((sum, session) => sum + (Number(session.durationMs) || 0), 0);
  const projectTotals = buildReportRows(scopedRows, "project");
  const categoryTotals = usesObjectives ? buildObjectiveOkrRows(scopedRows) : buildReportRows(scopedRows, "categories");
  const krTotals = buildObjectiveKrRowsFromSessions(scopedRows);
  const topProject = projectTotals[0];
  const topCategory = categoryTotals[0];
  const topKr = krTotals[0];

  reportTotal.textContent = formatDuration(totalMs);
  reportRange.textContent = formatPeriodLabel(range.start, range.end, reportPeriod);
  reportTopProject.textContent = topProject ? topProject.label : "-";
  reportTopProjectTime.textContent = topProject ? formatDuration(topProject.durationMs) : "0 h 00";
  reportTopCategoryLabel.textContent = usesObjectives ? "OKR principal" : "Categorie principale";
  reportTopCategory.textContent = topCategory ? topCategory.label : "-";
  reportTopCategoryTime.textContent = topCategory ? formatDuration(topCategory.durationMs) : "0 h 00";
  reportTopKrCard.hidden = !usesObjectives;
  reportTopKr.textContent = topKr ? topKr.label : "-";
  reportTopKrTime.textContent = topKr ? formatDuration(topKr.durationMs) : "0 h 00";
}

function buildObjectiveOkrRows(rows) {
  const grouped = new Map();

  for (const row of rows) {
    const label = formatObjectiveOkrDisplay(row.objectiveOkr);
    if (!label) {
      continue;
    }

    const current = grouped.get(label) ?? { label, durationMs: 0, count: 0 };
    current.durationMs += Number(row.durationMs) || 0;
    current.count += 1;
    grouped.set(label, current);
  }

  return Array.from(grouped.values()).sort((left, right) => right.durationMs - left.durationMs);
}

function buildObjectiveKrRowsFromSessions(rows) {
  const grouped = new Map();

  for (const row of rows) {
    const label = formatObjectiveKrDisplay(row.objectiveKr);
    if (!label) {
      continue;
    }

    const current = grouped.get(label) ?? { label, durationMs: 0, count: 0 };
    current.durationMs += Number(row.durationMs) || 0;
    current.count += 1;
    grouped.set(label, current);
  }

  return Array.from(grouped.values()).sort((left, right) => right.durationMs - left.durationMs);
}

function formatObjectiveOkrDisplay(value) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    return "";
  }

  const codeMatch = normalized.match(/^O\d+/i)?.[0]?.toUpperCase();
  const label = normalized.replace(/^O\d+\s*[·.-]?\s*/i, "").trim();

  if (codeMatch && label) {
    return `${codeMatch} · ${truncateObjectiveSummary(label, 44)}`;
  }

  if (codeMatch) {
    return codeMatch;
  }

  return truncateObjectiveSummary(normalized, 50);
}

function formatObjectiveKrDisplay(value) {
  const content = extractObjectiveKrContent(value);
  return content ? truncateObjectiveSummary(content, 56) : "";
}

function extractObjectiveKrContent(value) {
  const normalized = String(value ?? "").replace(/\s+/g, " ").trim();
  if (!normalized) {
    return "";
  }

  return normalized
    .replace(/^(RC\s*\d+(?:\.\d+)?|R\d+)\s*[:·.-]?\s*/i, "")
    .trim();
}

function renderEvolutionGrid(container, anchor, filterCollaborator) {
  container.innerHTML = "";
  const weeks = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const reference = new Date(anchor);
    reference.setDate(reference.getDate() - offset * 7);
    const range = getPeriodRange(reference, "week");
    const rows = getAllSessionsWithActive().filter((session) => {
      if (!isSessionInRange(session, range)) {
        return false;
      }
      if (filterCollaborator === "all") {
        return true;
      }
      return normalizeText(session.collaborator) === normalizeText(filterCollaborator);
    });

    weeks.push({
      label: formatShortDate(range.start),
      totalMs: rows.reduce((sum, session) => sum + (Number(session.durationMs) || 0), 0),
    });
  }

  const maxValue = Math.max(...weeks.map((week) => week.totalMs), 0);
  if (!maxValue) {
    container.append(createEmptyState("L'evolution apparaitra des que plusieurs semaines seront renseignees."));
    return;
  }

  for (const week of weeks) {
    const item = document.createElement("div");
    item.className = "evolution-item";

    const value = document.createElement("span");
    value.className = "evolution-value";
    value.textContent = formatDuration(week.totalMs);

    const bar = document.createElement("div");
    bar.className = "evolution-bar";
    bar.style.height = `${Math.max((week.totalMs / maxValue) * 150, 14)}px`;

    const label = document.createElement("span");
    label.className = "evolution-label";
    label.textContent = week.label;

    item.append(value, bar, label);
    container.append(item);
  }
}

function getCollaboratorProfile(collaborator) {
  return getKnownUsers().find((item) => normalizeText(item.user_name) === normalizeText(collaborator));
}

function getCapacityHoursForRange(collaborator, range) {
  const weeklyCapacityHours = Number(getCollaboratorProfile(collaborator)?.weekly_capacity_hours) || 0;
  if (!weeklyCapacityHours || !range?.start || !range?.end) {
    return 0;
  }

  const rangeDurationMs = Math.max(new Date(range.end) - new Date(range.start), 0);
  const rangeDurationDays = rangeDurationMs / (24 * 60 * 60 * 1000);
  return Number(((weeklyCapacityHours * rangeDurationDays) / 7).toFixed(1));
}

function formatCapacityRate(durationMs, capacityHours) {
  if (!capacityHours) {
    return "-";
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format((Number(durationMs) || 0) / 3600000 / capacityHours);
}

function renderTeamTable(container, rows, range, emptyMessage) {
  const teamRows = buildReportRows(rows, "collaborator").map((row) => ({
    ...row,
    mainProject: getMainProjectForCollaborator(rows, row.label),
    capacityHours: getCapacityHoursForRange(row.label, range),
  }));

  container.innerHTML = "";
  if (!teamRows.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.append(createEmptyState(emptyMessage));
    tr.append(td);
    container.append(tr);
    return;
  }

  for (const row of teamRows) {
    const tr = document.createElement("tr");
    tr.append(
      createCell(row.label),
      createCell(formatDuration(row.durationMs)),
      createCell(formatCapacityRate(row.durationMs, row.capacityHours)),
      createCell(row.mainProject || "-"),
      createCell(String(row.count)),
    );
    container.append(tr);
  }
}

function renderReportTable(container, rows, totalMs, emptyMessage) {
  container.innerHTML = "";
  if (!rows.length) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.append(createEmptyState(emptyMessage));
    tr.append(td);
    container.append(tr);
    return;
  }

  for (const row of rows) {
    const tr = document.createElement("tr");
    tr.append(
      createCell(row.label),
      createCell(formatDuration(row.durationMs)),
      createCell(formatShare(row.durationMs, totalMs)),
      createCell(String(row.count)),
    );
    container.append(tr);
  }
}

function renderDistribution(barContainer, legendContainer, rows, totalMs, emptyMessage) {
  barContainer.innerHTML = "";
  legendContainer.innerHTML = "";

  if (!rows.length || !totalMs) {
    legendContainer.append(createEmptyState(emptyMessage));
    return;
  }

  for (const row of rows) {
    const color = colorForLabel(row.label);

    const segment = document.createElement("div");
    segment.className = "distribution-segment";
    segment.style.width = `${Math.max((row.durationMs / totalMs) * 100, 2)}%`;
    segment.style.background = color;
    segment.title = `${row.label} · ${formatShare(row.durationMs, totalMs)}`;
    barContainer.append(segment);

    const legend = document.createElement("span");
    legend.className = "legend-item";

    const swatch = document.createElement("span");
    swatch.className = "legend-swatch";
    swatch.style.background = color;

    const label = document.createElement("span");
    label.textContent = `${row.label} · ${formatDuration(row.durationMs)} · ${formatShare(row.durationMs, totalMs)}`;

    legend.append(swatch, label);
    legendContainer.append(legend);
  }
}

function getProjectMemories(collaboratorName = "") {
  const allRows = getAllSessionsWithActive()
    .slice()
    .sort((a, b) => new Date(b.start) - new Date(a.start));
  const now = new Date();
  const memories = new Map();
  const normalizedCollaborator = normalizeText(collaboratorName);

  for (const session of allRows) {
    if (!session.project || !session.collaborator) {
      continue;
    }

    if (normalizedCollaborator && normalizeText(session.collaborator) !== normalizedCollaborator) {
      continue;
    }

    const key = `${normalizeText(session.collaborator)}::${normalizeText(session.project)}`;
    if (getRepriseAction(key, session.collaborator)) {
      continue;
    }
    const sessionDate = new Date(session.start);
    const memory =
      memories.get(key) ??
      {
        key,
        collaborator: session.collaborator,
        project: session.project,
        task: session.task,
        categories: [...(session.categories ?? []).slice(0, 1)],
        tags: [...(session.tags ?? [])],
        notionRef: session.notionRef ?? "",
        objectivePole: session.objectivePole ?? "",
        objectiveOkr: session.objectiveOkr ?? "",
        objectiveKr: session.objectiveKr ?? "",
        notes: session.notes ?? "",
        start: session.start,
        usesCount: 0,
        weekdayHits: 0,
        hourBucketHits: 0,
      };

    memory.usesCount += 1;
    if (sessionDate.getDay() === now.getDay()) {
      memory.weekdayHits += 1;
    }
    if (getHourBucket(sessionDate) === getHourBucket(now)) {
      memory.hourBucketHits += 1;
    }

    if (new Date(memory.start) < sessionDate) {
      memory.task = session.task;
      memory.categories = [...(session.categories ?? []).slice(0, 1)];
      memory.tags = [...(session.tags ?? [])];
      memory.notionRef = session.notionRef ?? "";
      memory.objectivePole = session.objectivePole ?? "";
      memory.objectiveOkr = session.objectiveOkr ?? "";
      memory.objectiveKr = session.objectiveKr ?? "";
      memory.notes = session.notes ?? "";
      memory.start = session.start;
    }

    memories.set(key, memory);
  }

  return Array.from(memories.values())
    .map((memory) => ({
      ...memory,
      score: rankProjectMemory(memory, now),
    }))
    .sort((left, right) => right.score - left.score || new Date(right.start) - new Date(left.start));
}

function getHourBucket(dateValue) {
  return Math.floor(new Date(dateValue).getHours() / 4);
}

function rankProjectMemory(memory, referenceDate = new Date()) {
  const lastStart = new Date(memory.start);
  const daysSinceLastUse = Math.max((referenceDate - lastStart) / (24 * 60 * 60 * 1000), 0);
  const recencyScore = Math.max(0, 1 - Math.min(daysSinceLastUse, 21) / 21);
  const frequencyScore = Math.min(memory.usesCount / 5, 1);
  const weekdayScore = memory.usesCount ? memory.weekdayHits / memory.usesCount : 0;
  const hourScore = memory.usesCount ? memory.hourBucketHits / memory.usesCount : 0;

  return frequencyScore * 40 + recencyScore * 35 + weekdayScore * 15 + hourScore * 10;
}

function fillFormFromMemory(memory) {
  collaboratorInput.value = memory.collaborator;
  projectInput.value = memory.project;
  taskInput.value = memory.task ?? "";
  currentCategories = [...memory.categories].slice(0, 1);
  currentTags = [...memory.tags];
  notionInput.value = memory.notionRef ?? "";
  objectivePoleInput.value = memory.objectivePole ?? "";
  objectiveOkrInput.value = memory.objectiveOkr ?? "";
  objectiveKrInput.value = memory.objectiveKr ?? "";
  renderCategoryTokens();
  renderTagTokens();
  renderObjectiveSelections();
  updateFieldManageButtons();
  projectInput.dataset.lastHydratedKey = memory.key;
  projectMemoryHint.textContent = `${memory.project} reconnu. Les champs reutilisables ont ete recharges.`;
  renderCadreViews();
}

function applyProjectMemoryFromInput() {
  const rawProject = projectInput.value.trim();
  if (!rawProject) {
    delete projectInput.dataset.lastHydratedKey;
    projectMemoryHint.textContent =
      "Commencez a taper: un sujet deja connu recharge automatiquement ses informations utiles.";
    return;
  }

  const memory = resolveProjectMemory(rawProject, collaboratorInput.value.trim());
  if (!memory) {
    projectMemoryHint.textContent = "Aucun sujet connu ne correspond encore completement a cette saisie.";
    return;
  }

  projectMemoryHint.textContent = `${memory.project} reconnu. Categories, tags et lien d'interet rechargeables.`;

  if (projectInput.dataset.lastHydratedKey === memory.key) {
    return;
  }

  if (!collaboratorInput.value.trim()) {
    collaboratorInput.value = memory.collaborator;
  }
  if (!taskInput.value.trim()) {
    taskInput.value = memory.task ?? "";
  }
  if (!currentCategories.length) {
    currentCategories = [...memory.categories].slice(0, 1);
    renderCategoryTokens();
  }
  if (!currentTags.length) {
    currentTags = [...memory.tags];
    renderTagTokens();
  }
  if (!notionInput.value.trim()) {
    notionInput.value = memory.notionRef ?? "";
  }
  if (!objectivePoleInput.value.trim()) {
    objectivePoleInput.value = memory.objectivePole ?? "";
  }
  if (!objectiveOkrInput.value.trim()) {
    objectiveOkrInput.value = memory.objectiveOkr ?? "";
  }
  if (!objectiveKrInput.value.trim()) {
    objectiveKrInput.value = memory.objectiveKr ?? "";
  }
  renderObjectiveSelections();
  updateFieldManageButtons();

  projectInput.dataset.lastHydratedKey = memory.key;
}

function resolveProjectMemory(projectName, collaboratorName) {
  const targetProject = normalizeText(projectName);
  const targetCollaborator = normalizeText(collaboratorName);
  const scopedMemories = targetCollaborator ? getProjectMemories(collaboratorName) : getProjectMemories();
  const candidates = scopedMemories.filter((memory) => normalizeText(memory.project).startsWith(targetProject));

  if (!candidates.length) {
    return null;
  }

  const exactCollaborator = targetCollaborator
    ? candidates.find(
        (memory) =>
          normalizeText(memory.project) === targetProject &&
          normalizeText(memory.collaborator) === targetCollaborator,
      )
    : null;
  if (exactCollaborator) {
    return exactCollaborator;
  }

  const exactProject = candidates.find((memory) => normalizeText(memory.project) === targetProject);
  if (exactProject) {
    return exactProject;
  }

  return candidates.length === 1 ? candidates[0] : null;
}

function getCurrentCollaborator() {
  if (accessProfile.appUser?.user_name) {
    return accessProfile.appUser.user_name;
  }

  return "";
}

function findSessionById(sessionId) {
  if (!sessionId) {
    return null;
  }

  return (
    sessions.find((item) => item.id === sessionId) ??
    remoteActiveSessions.find((item) => item.id === sessionId) ??
    (activeSession?.id === sessionId ? activeSession : null)
  );
}

function getPersistedActiveSessions() {
  const currentId = activeSession?.id ?? null;
  const merged = new Map();

  for (const session of remoteActiveSessions) {
    merged.set(session.id, session);
  }

  if (activeSession) {
    merged.set(activeSession.id, activeSession);
  }

  return Array.from(merged.values()).map((session) => ({
    ...session,
    end: getActiveSessionEffectiveEnd(session).toISOString(),
    durationMs: getActiveSessionDurationMs(session),
    isServerActive: true,
  }));
}

function getSessionsForCollaborator(collaborator) {
  return getScopedSessions(getAllSessionsWithActive()).filter(
    (session) => normalizeText(session.collaborator) === normalizeText(collaborator),
  );
}

function getAllSessionsWithActive() {
  const rows = new Map(sessions.map((session) => [session.id, session]));
  for (const activeRow of getPersistedActiveSessions()) {
    rows.set(activeRow.id, activeRow);
  }
  return Array.from(rows.values()).sort((left, right) => new Date(right.start) - new Date(left.start));
}

function getActiveSessionEffectiveEnd(session) {
  return session.pausedAt ? new Date(session.pausedAt) : new Date();
}

function getActiveSessionDurationMs(session) {
  const start = new Date(session.start).getTime();
  const end = getActiveSessionEffectiveEnd(session).getTime();
  return Math.max(end - start - (Number(session.pausedDurationMs) || 0), 0);
}

function getReportAnchorDate() {
  return reportAnchorInput.value ? new Date(`${reportAnchorInput.value}T12:00:00`) : new Date();
}

function shiftAgendaWeek(delta) {
  const anchor = getReportAnchorDate();
  anchor.setDate(anchor.getDate() + delta * 7);
  reportAnchorInput.value = formatDateInput(anchor);
  renderCadreViews();
  renderManagerViews();
  renderResourcesViews();
}

function getPeriodRange(anchor, period) {
  if (period === "month") {
    return {
      start: new Date(anchor.getFullYear(), anchor.getMonth(), 1),
      end: new Date(anchor.getFullYear(), anchor.getMonth() + 1, 1),
    };
  }

  if (period === "year") {
    return {
      start: new Date(anchor.getFullYear(), 0, 1),
      end: new Date(anchor.getFullYear() + 1, 0, 1),
    };
  }

  const start = getStartOfWeek(anchor);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { start, end };
}

function isSessionInRange(session, range) {
  const start = new Date(session.start);
  return start >= range.start && start < range.end;
}

function buildReportRows(rows, key) {
  const grouped = new Map();

  for (const row of rows) {
    if (key === "categories") {
      const labels = row.categories.length ? row.categories : ["Sans categorie"];
      for (const label of labels) {
        const current = grouped.get(label) ?? { label, durationMs: 0, count: 0 };
        current.durationMs += Number(row.durationMs) || 0;
        current.count += 1;
        grouped.set(label, current);
      }
      continue;
    }

    const label = row[key] || getFallbackLabel(key);
    const current = grouped.get(label) ?? { label, durationMs: 0, count: 0 };
    current.durationMs += Number(row.durationMs) || 0;
    current.count += 1;
    grouped.set(label, current);
  }

  return Array.from(grouped.values()).sort((a, b) => b.durationMs - a.durationMs);
}

function getFallbackLabel(key) {
  if (key === "collaborator") {
    return "Sans cargonaute";
  }
  if (key === "project") {
    return "Sans projet";
  }
  return "Sans categorie";
}

function getMainProjectForCollaborator(rows, collaborator) {
  const projectRows = buildReportRows(
    rows.filter((row) => normalizeText(row.collaborator) === normalizeText(collaborator)),
    "project",
  );
  return projectRows[0]?.label ?? "";
}

function setupTokenInput(input, config) {
  input.addEventListener("keydown", (event) => {
    const autocompleteOpenForInput =
      !autocompletePopover.hidden && autocompleteState.config?.input === input;

    if (autocompleteOpenForInput && (event.key === "Enter" || event.key === "Tab" || event.key === "ArrowDown" || event.key === "ArrowUp")) {
      return;
    }

    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitTokenInput(input, config);
      return;
    }

    if (event.key === "Backspace" && !input.value.trim()) {
      const values = config.getValues();
      if (values.length) {
        config.setValues(values.slice(0, -1));
      }
    }
  });

  input.addEventListener("blur", () => {
    if (!autocompletePopover.hidden && autocompleteState.config?.input === input) {
      return;
    }
    commitTokenInput(input, config);
  });
}

function commitTokenInput(input, config) {
  const tokens = parseTokenString(input.value);
  if (!tokens.length) {
    input.value = "";
    return;
  }

  const nextValues = config.singleValue
    ? [tokens[tokens.length - 1]]
    : Array.from(new Set([...config.getValues(), ...tokens]));

  config.setValues(nextValues);
  input.value = "";
}

function renderCategoryTokens() {
  renderTokenList(categoriesList, currentCategories, (index) => {
    currentCategories = currentCategories.filter((_, itemIndex) => itemIndex !== index);
    renderCategoryTokens();
  });
  updateFieldManageButtons();
}

function renderTagTokens() {
  renderTokenList(tagsList, currentTags, (index) => {
    currentTags = currentTags.filter((_, itemIndex) => itemIndex !== index);
    renderTagTokens();
  });
  updateFieldManageButtons();
}

function renderTokenList(container, values, onRemove) {
  container.innerHTML = "";
  for (const [index, value] of values.entries()) {
    const chip = document.createElement("span");
    chip.className = "token-chip";

    const label = document.createElement("span");
    label.textContent = value;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.setAttribute("aria-label", `Retirer ${value}`);
    remove.textContent = "x";
    remove.addEventListener("click", () => onRemove(index));

    chip.append(label, remove);
    container.append(chip);
  }
}

function renderPills(container, values) {
  container.innerHTML = "";
  for (const value of values) {
    container.append(createPill(value));
  }
}

function createPill(label) {
  const pill = document.createElement("span");
  pill.className = "pill";
  pill.textContent = label;
  return pill;
}

function fillDatalist(element, values) {
  element.innerHTML = "";
  for (const value of values) {
    const option = document.createElement("option");
    option.value = value;
    element.append(option);
  }
}

function mergeSuggestionValues(...lists) {
  return Array.from(new Set(lists.flat().filter(Boolean))).sort((a, b) => a.localeCompare(b, "fr"));
}

function uniqueValues(key) {
  return Array.from(new Set(getAllSessionsWithActive().map((session) => session[key]).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, "fr"),
  );
}

function uniqueTokenValues(key) {
  const values = new Set();
  for (const session of getAllSessionsWithActive()) {
    for (const token of session[key] ?? []) {
      if (token) {
        values.add(token);
      }
    }
  }
  return Array.from(values).sort((a, b) => a.localeCompare(b, "fr"));
}

function createEmptyState(message) {
  const element = document.createElement("div");
  element.className = "empty-state";
  element.textContent = message;
  return element;
}

function getSessionClientLabel(session) {
  if (session.dbClientName) {
    return session.dbClientName;
  }

  const project = referenceCatalog.projects.find(
    (item) => normalizeText(item.project_name) === normalizeText(session.project ?? ""),
  );
  return project?.client_name || session.project || "Sans client";
}

function createCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  return cell;
}

function parseTokenString(rawValue) {
  return rawValue
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);
}

function formatClock(durationMs) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function formatDuration(durationMs) {
  const totalMinutes = Math.round(durationMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours} h ${String(minutes).padStart(2, "0")}`;
}

function formatShare(durationMs, totalMs) {
  if (!totalMs) {
    return "0 %";
  }

  return new Intl.NumberFormat("fr-FR", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(durationMs / totalMs);
}

function formatDate(dateValue) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateValue));
}

function formatShortDate(dateValue) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(new Date(dateValue));
}

function formatDayLabel(dateValue) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
  }).format(new Date(dateValue));
}

function formatAgendaDayLabel(dateValue) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
  })
    .format(new Date(dateValue))
    .replace(".", "")
    .toUpperCase();
}

function formatTimeRange(session) {
  const formatter = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formatter.format(new Date(session.start))} - ${formatter.format(new Date(session.end))}`;
}

function formatDurationHours(durationMs) {
  return `${new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format((Number(durationMs) || 0) / 3600000)} h`;
}

function buildAgendaTooltip(session) {
  const parts = [
    `${session.collaborator} · ${session.project}`,
    `${getSessionClientLabel(session)}`,
    `${formatTimeRange(session)} · ${formatDurationHours(session.durationMs)}`,
    session.task || "",
    session.categories?.length ? `Categorie: ${session.categories.join(", ")}` : "",
    session.tags?.length ? `Tags: ${session.tags.join(", ")}` : "",
    session.notes || "",
  ].filter(Boolean);

  return parts.join("\n");
}

function formatPeriodLabel(start, end, period) {
  if (period === "year") {
    return new Intl.DateTimeFormat("fr-FR", { year: "numeric" }).format(start);
  }

  if (period === "month") {
    return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(start);
  }

  const inclusiveEnd = new Date(end);
  inclusiveEnd.setDate(inclusiveEnd.getDate() - 1);
  return `${formatShortDate(start)} - ${formatShortDate(inclusiveEnd)}`;
}

function formatDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateTimeLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatTimeLabel(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function getStartOfWeek(dateValue) {
  const date = new Date(dateValue);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function isSameDay(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  );
}

function normalizeText(value) {
  return value.trim().toLowerCase();
}

function colorForLabel(label) {
  let hash = 0;
  for (const char of label) {
    hash = (hash << 5) - hash + char.charCodeAt(0);
    hash |= 0;
  }
  return COLOR_PALETTE[Math.abs(hash) % COLOR_PALETTE.length];
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", async () => {
    const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);

    if (isLocalhost) {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((registration) => registration.unregister()));
        if ("caches" in window) {
          const cacheKeys = await window.caches.keys();
          await Promise.all(cacheKeys.map((key) => window.caches.delete(key)));
        }
      } catch (error) {
        // Ignore local cleanup failures and continue without a service worker.
      }
      return;
    }

    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
loginNameInput?.addEventListener("change", async () => {
  if (!loginNameInput.value) {
    await logoutCurrentUser();
    return;
  }

  await loginWithName();
});

async function loginWithName() {
  const name = loginNameInput?.value.trim() ?? "";

  if (!name) {
    if (authStatus) {
      authStatus.hidden = false;
      authStatus.textContent = "Choisissez un nom pour continuer.";
    }
    return;
  }

  if (!referenceCatalog.loaded) {
    await ensureReferenceCatalogLoaded();
  }

  const success = applyLocalAccessProfile(name);
  if (!success) {
    if (authStatus) {
      authStatus.hidden = false;
      authStatus.textContent = "Nom inconnu.";
    }
    return;
  }

  if (authStatus) {
    authStatus.hidden = true;
    authStatus.textContent = "";
  }
}

async function logoutCurrentUser() {
  clearStoredAccessName();
  accessProfile = {
    mode: "open",
    role: "open",
    session: null,
    appUser: null,
  };
  activeSession = null;
  persistActiveSession();
  syncTimerLoopWithActiveSession();
  if (loginNameInput) {
    loginNameInput.value = "";
  }
  if (authStatus) {
    authStatus.hidden = true;
    authStatus.textContent = "";
  }
  render();
}
