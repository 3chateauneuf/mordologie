const STORAGE_KEY = "mordologie-sessions-v1";
const ACTIVE_SESSION_KEY = "mordologie-active-session-v1";
const CATEGORY_COLOR_KEY = "mordologie-category-colors-v1";
const REPRISES_ORDER_KEY = "mordologie-reprises-order-v1";
const REPRISES_ACTIONS_KEY = "mordologie-reprises-actions-v1";
const PLANNED_EVENTS_OVERRIDES_KEY = "mordologie-planned-events-v1";
const PLANNED_CALENDAR_SNAPSHOTS_KEY = "mordologie-planned-calendar-snapshots-v1";
const DAY_THEMES_KEY = "mordologie-day-themes-v1";
const PROFILE_AVATAR_KEY = "mordologie-profile-avatar-v1";
const UI_PREFERENCES_TABLE = "user_ui_preferences";
const DAY_THEMES_PREFERENCE_KEY = "day_themes";
const REPRISES_ORDER_PREFERENCE_KEY = "reprises_order";
const PROFILE_AVATAR_PREFERENCE_KEY = "profile_avatar";
const CALENDAR_ICS_PREFERENCE_KEY = "calendar_ics_url";
const CALENDAR_ICS_URLS_KEY = "mordologie-calendar-ics-urls-v1";
const LOCAL_RESCUE_ACCESS_KEY = "mordologie-local-rescue-access-v1";
const PENDING_STOP_STATE_KEY = "mordologie-pending-stop-v1";
const RECENTLY_STOPPED_SESSIONS_KEY = "mordologie-recently-stopped-sessions-v1";
const RECENTLY_STOPPED_SESSION_TTL_MS = 15 * 60 * 1000;
const MAX_REASONABLE_ACTIVE_SESSION_MS = 18 * 60 * 60 * 1000;
const MAX_REASONABLE_PERSISTED_SESSION_MS = 18 * 60 * 60 * 1000;
const LEGACY_STORAGE_KEYS = {
  [STORAGE_KEY]: "cadence-equipe-sessions-v3",
  [ACTIVE_SESSION_KEY]: "cadence-equipe-active-session-v3",
  [CATEGORY_COLOR_KEY]: "grand-livre-category-colors-v1",
  [REPRISES_ORDER_KEY]: "grand-livre-reprises-order-v1",
  [REPRISES_ACTIONS_KEY]: "grand-livre-reprises-actions-v1",
  [PROFILE_AVATAR_KEY]: "grand-livre-profile-avatar-v1",
};
const REMOTE_SYNC_INTERVAL_MS = 15000;
const QUICK_REPRISES_LIMIT = 6;
const MEMORY_CONTEXT_LIMIT = 8;
const DEMO_MODE_ENABLED = false;
const DEBUG_STOP_SYNC = false;   // set true to trace stop/sync lifecycle
const DEBUG_STATE_LOSS = false;  // set true to trace session state mutations
const COLOR_PALETTE = ["#6FC7C0", "#F3A47D", "#EFB8C8", "#E8D98A", "#9ADAD3", "#F6BE95", "#F5D2DB", "#CDE6B4", "#BFD9E8", "#D8C6E7"];
const RESOURCE_PASTEL_PALETTE = [...COLOR_PALETTE];
const CATEGORY_REWRITE_RULES = [
  {
    matches: ["certification bio", "certificacion bio"],
    category: "Certification",
    impliedTags : ["Bio"],
  },
];
const SEEDED_PLANNED_CALENDAR_SNAPSHOTS = [
  {
    collaborator: "Eduardo",
    source: "google_calendar",
    source_calendar_id: "eduardo@cargonautes.fr",
    week_start: "2026-04-27",
    imported_at: "2026-04-26T15:45:00+02:00",
    events: [
      {
        source_event_id: "2q6e8j9crgnv4vqjr95j5o4c7u_20260427T073000Z",
        title: "Vérifier l'espace de stockage sur le fichier",
        description: "",
        start_at: "2026-04-27T00:00:00+02:00",
        end_at: "2026-04-27T00:15:00+02:00",
      },
      {
        source_event_id: "2q6e8j9crgnv4vqjr95j5o4c7u_20260427T073000Z-shift",
        title: "Point entrepôt",
        description: "",
        start_at: "2026-04-27T09:30:00+02:00",
        end_at: "2026-04-27T10:30:00+02:00",
      },
      {
        source_event_id: "30mhlh6h4322kuk9f0icsa04c0_20260427T100000Z",
        title: "Indisponible",
        description: "",
        start_at: "2026-04-27T12:00:00+02:00",
        end_at: "2026-04-27T14:30:00+02:00",
      },
      {
        source_event_id: "3h81cv9jt98158auc5dvg15ghn",
        title: "Shift Entrepôt",
        description: "",
        start_at: "2026-04-29T09:00:00+02:00",
        end_at: "2026-04-29T13:00:00+02:00",
      },
      {
        source_event_id: "1ft1jkr1nkhadikm9kq1b65h80_20260429T103000Z",
        title: "Point opérationnel Cargonautes",
        description: "",
        start_at: "2026-04-29T12:30:00+02:00",
        end_at: "2026-04-29T13:00:00+02:00",
      },
      {
        source_event_id: "62na35r1kc017plnlhe4o6tklv",
        title: "Réunion entrepôt",
        description: "",
        start_at: "2026-04-30T13:00:00+02:00",
        end_at: "2026-04-30T14:00:00+02:00",
      },
      {
        source_event_id: "1f5ud34r4478k6lmhuugb07m2t",
        title: "Shift coursier",
        description: "",
        start_at: "2026-05-02T07:00:00+02:00",
        end_at: "2026-05-02T12:00:00+02:00",
      },
    ],
  },
];

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

for (const [nextKey, legacyKey] of Object.entries(LEGACY_STORAGE_KEYS)) {
  if (window.localStorage.getItem(nextKey) == null) {
    const legacyValue = window.localStorage.getItem(legacyKey);
    if (legacyValue != null) {
      window.localStorage.setItem(nextKey, legacyValue);
    }
  }
}

const form = document.querySelector("#time-form");
const viewTabs = Array.from(document.querySelectorAll("[data-view-target]"));
const viewPanels = Array.from(document.querySelectorAll("[data-view-panel]"));
const analysisToolbarPanel = document.querySelector("#analysis-toolbar-panel");
const analysisToolbarTitle = document.querySelector("#analysis-toolbar-title");
const analysisCollaboratorFilterWrap = document.querySelector("#analysis-collaborator-filter-wrap");
const authGuestShell = document.querySelector("#auth-guest-shell");
const authUserShell = document.querySelector("#auth-user-shell");
const authRescueSelect = document.querySelector("#auth-rescue-select");
const authRescueButton = document.querySelector("#auth-rescue-button");
const authUserName = document.querySelector("#auth-user-name");
const authUserEmail = document.querySelector("#auth-user-email");
const authUserAvatar = document.querySelector("#auth-user-avatar");
const authAvatarInput = document.querySelector("#auth-avatar-input");
const authRolePill = document.querySelector("#auth-role-pill");
const authSignoutButton = document.querySelector("#auth-signout-button");
const authUserDropdown = document.querySelector("#auth-user-dropdown");
const authChangeAvatarButton = document.querySelector("#auth-change-avatar-button");
const authCalendarIcsInput = document.querySelector("#auth-calendar-ics-input");
const authCalendarIcsSave = document.querySelector("#auth-calendar-ics-save");
const authStatusShell = document.querySelector("#auth-status-shell");
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
const tagsInput = document.querySelector("#tags-input");
const tagsList = document.querySelector("#tags-list");
const tagSuggestions = document.querySelector("#tag-suggestions");
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
const dayThemesList = document.querySelector("#day-themes-list");
const dayThemeInput = document.querySelector("#day-theme-input");
const addDayThemeButton = document.querySelector("#add-day-theme-button");
const quickProjects = document.querySelector("#quick-projects");
const repriseActionsShell = document.querySelector("#reprise-actions");
const repriseArchiveZone = document.querySelector("#reprise-archive-zone");
const repriseDoneZone = document.querySelector("#reprise-done-zone");
const toggleButton = document.querySelector("#toggle-button");
const pauseButton = document.querySelector("#pause-button");

const TIMER_ICON_PLAY  = `<svg viewBox="0 0 24 24" aria-hidden="true" class="btn-icon btn-icon--fill"><path d="M6 4.5l13 7.5-13 7.5V4.5z"/></svg>`;
const TIMER_ICON_STOP  = `<svg viewBox="0 0 24 24" aria-hidden="true" class="btn-icon btn-icon--fill"><rect x="5" y="5" width="14" height="14" rx="2"/></svg>`;
const TIMER_ICON_PAUSE = `<svg viewBox="0 0 24 24" aria-hidden="true" class="btn-icon btn-icon--fill"><rect x="5.5" y="4" width="4.5" height="16" rx="1.5"/><rect x="14" y="4" width="4.5" height="16" rx="1.5"/></svg>`;
const openManualButton = document.querySelector("#open-manual-button");
const activeStartDisplay = document.querySelector("#active-start-display");
const timerDisplay = document.querySelector("#timer-display");
const timerStateLabel = document.querySelector("#timer-state-label");
const timerPanel = document.querySelector(".timer-panel");
const activeSessionStatusCopy = document.querySelector("#active-session-status-copy");
const activeSessionStatusActions = document.querySelector("#active-session-status-actions");
const retryPendingStopButton = document.querySelector("#retry-pending-stop-button");
const activeTaskLabel = document.querySelector("#active-task-label");
const todayTotal = document.querySelector("#today-total");
const weekTotal = document.querySelector("#week-total");
const todayPanelCopy = document.querySelector("#today-panel-copy");
const topCategoryName = document.querySelector("#top-category-name");
const topCategoryTime = document.querySelector("#top-category-time");
const personalStatsSwitch = document.querySelector("#personal-stats-switch");
const personalStatsTitle = document.querySelector("#personal-stats-title");
const personalStatsCopy = document.querySelector("#personal-stats-copy");
const personalDistributionBar = document.querySelector("#personal-distribution-bar");
const personalCategoryRows = document.querySelector("#personal-category-rows");
const personalPeriodSwitch = document.querySelector("#personal-period-switch");
const personalPeriodLabel = document.querySelector("#personal-period-label");
const personalPeriodPrev = document.querySelector("#personal-period-prev");
const personalPeriodNext = document.querySelector("#personal-period-next");
const personalPeriodNav = document.querySelector("#personal-period-nav");
const personalCustomRange = document.querySelector("#personal-custom-range");
const personalCustomFromInput = document.querySelector("#personal-custom-from");
const personalCustomToInput = document.querySelector("#personal-custom-to");
const agendaBoard = document.querySelector("#agenda-board");
const agendaPrevWeekButton = document.querySelector("#agenda-prev-week");
const agendaCurrentWeekButton = document.querySelector("#agenda-current-week");
const agendaNextWeekButton = document.querySelector("#agenda-next-week");
const agendaWeekLabel = document.querySelector("#agenda-week-label");
const agendaCalendarSyncButton = document.querySelector("#agenda-calendar-sync");
const plannedSummary = document.querySelector("#planned-summary");
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
const usersAdminShell = document.querySelector("#users-admin-shell");
const sessionList = document.querySelector("#session-list");
const journalFilterFromInput = document.querySelector("#journal-filter-from");
const journalFilterToInput = document.querySelector("#journal-filter-to");
const journalFilterCategoryInput = document.querySelector("#journal-filter-category");
const journalFilterTagsInput = document.querySelector("#journal-filter-tags");
const journalFilterSubjectInput = document.querySelector("#journal-filter-subject");
const journalFilterResetButton = document.querySelector("#journal-filter-reset");
const journalSideSwitch = document.querySelector("#journal-side-switch");
const projectMemoryList = document.querySelector("#project-memory-list");
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
const reportTotalDelta = document.querySelector("#report-total-delta");
const reportTopProjectDelta = document.querySelector("#report-top-project-delta");
const reportTopCategoryDelta = document.querySelector("#report-top-category-delta");
const resourceTotalDelta = document.querySelector("#resource-total-delta");
const resourceTopProjectDelta = document.querySelector("#resource-top-project-delta");
const resourceTopCategoryDelta = document.querySelector("#resource-top-category-delta");

const manualDialog = document.querySelector("#manual-dialog");
const plannedDialog = document.querySelector("#planned-dialog");
const plannedDialogSubtitle = document.querySelector("#planned-dialog-subtitle");
const plannedDialogSuggestion = document.querySelector("#planned-dialog-suggestion");
const plannedDialogSuggestionCategory = document.querySelector("#planned-dialog-suggestion-category");
const plannedDialogSuggestionDetail = document.querySelector("#planned-dialog-suggestion-detail");
const plannedApplySuggestionButton = document.querySelector("#planned-apply-suggestion-button");
const plannedSubjectInput = document.querySelector("#planned-subject-input");
const plannedTaskInput = document.querySelector("#planned-task-input");
const plannedCategoryInput = document.querySelector("#planned-category-input");
const plannedCategoriesList = document.querySelector("#planned-categories-list");
const plannedTagsList = document.querySelector("#planned-tags-list");
const plannedTagsInput = document.querySelector("#planned-tags-input");
const plannedNotionInput = document.querySelector("#planned-notion-input");
const plannedNotesInput = document.querySelector("#planned-notes-input");
const plannedObjectiveDisclosure = document.querySelector("#planned-objective-disclosure");
const plannedObjectiveSummaryText = document.querySelector("#planned-objective-summary-text");
const plannedObjectivePoleInput = document.querySelector("#planned-objective-pole-input");
const plannedObjectiveOkrInput = document.querySelector("#planned-objective-okr-input");
const plannedObjectiveKrInput = document.querySelector("#planned-objective-kr-input");
const plannedObjectivePoleSelected = document.querySelector("#planned-objective-pole-selected");
const plannedObjectiveOkrSelected = document.querySelector("#planned-objective-okr-selected");
const plannedObjectiveKrSelected = document.querySelector("#planned-objective-kr-selected");
const plannedDialogStatus = document.querySelector("#planned-dialog-status");
const plannedIgnoreButton = document.querySelector("#planned-ignore-button");
const plannedCancelButton = document.querySelector("#planned-cancel-button");
const plannedSaveButton = document.querySelector("#planned-save-button");
const manualDialogStatus = document.querySelector("#manual-dialog-status");
const manualCollaboratorInput = document.querySelector("#manual-collaborator-input");
const manualProjectInput = document.querySelector("#manual-project-input");
const manualTaskInput = document.querySelector("#manual-task-input");
const manualCategoriesInput = document.querySelector("#manual-categories-input");
const manualTagsList = document.querySelector("#manual-tags-list");
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
const manualStartDateInput = document.querySelector("#manual-start-date-input");
const manualStartTimeInput = document.querySelector("#manual-start-time-input");
const manualEndDateInput = document.querySelector("#manual-end-date-input");
const manualEndTimeInput = document.querySelector("#manual-end-time-input");
const manualStartCardTitle = document.querySelector("#manual-start-card-title");
const manualEndCardTitle = document.querySelector("#manual-end-card-title");
const manualDurationInput = document.querySelector("#manual-duration-input");
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
const decisionDialog = document.querySelector("#decision-dialog");
const decisionDialogEyebrow = document.querySelector("#decision-dialog-eyebrow");
const decisionDialogTitle = document.querySelector("#decision-dialog-title");
const decisionDialogCopy = document.querySelector("#decision-dialog-copy");
const decisionDialogDetail = document.querySelector("#decision-dialog-detail");
const decisionDialogCancelButton = document.querySelector("#decision-dialog-cancel");
const decisionDialogConfirmButton = document.querySelector("#decision-dialog-confirm");
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
      "Nous investissons dans le matériel et l’équipement nécessaires à des conditions de travail optimales",
    krs: [
      "RC 3.1 : 100% des salarié·es en période d’essai reçoivent un kit de base complet",
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
      "R1 : L'équipe ne ressent pas de surcharge ni de ralentissement liés aux projets annexes",
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
    categories: ["Préparation de commandes"],
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
    notes: "Beaucoup de retours sur des créneaux non tenus.",
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
    categories: ["État des stocks"],
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
    project: "Mordologie",
    task: "Ajustements saisie rapide",
    categories: ["Développement outil interne"],
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
    categories: ["Expéditions"],
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
    categories: ["QHSE / amélioration continue"],
    tags: ["qhse", "standard"],
    notionRef: "",
    objectivePole: "Cercle de management",
    objectiveOkr: "O3 · Nous investissons dans le matériel et l’équipement nécessaires à des conditions de travail optimales",
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
    project: "Mordologie",
    task: "Lecture manager et capacité",
    categories: ["Développement outil interne"],
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
    categories: ["Incident client / qualité"],
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
    categories: ["État des stocks"],
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
    categories: ["Préparation de commandes"],
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
    project: "Mordologie",
    task: "Corrections suggestions intelligentes",
    categories: ["Développement outil interne"],
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
    categories: ["QHSE / amélioration continue"],
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

const DEMO_REFERENCE_USER = "Eduardo";
const DEMO_LOOKBACK_DAYS = 14;
const DEMO_WEEKDAY_SLOTS = [
  { startHour: 8, startMinute: 0, durationMinutes: 120 },
  { startHour: 10, startMinute: 30, durationMinutes: 120 },
  { startHour: 13, startMinute: 30, durationMinutes: 120 },
  { startHour: 15, startMinute: 45, durationMinutes: 120 },
];
const DEMO_WEEKEND_SLOTS = [
  { startHour: 10, startMinute: 0, durationMinutes: 150 },
  { startHour: 14, startMinute: 0, durationMinutes: 120 },
];
const ROLLING_DEMO_SESSIONS = buildRollingDemoSessions();

let sessions = loadSessions();
let activeSession = loadActiveSession();
let currentCategories = [];
let currentTags = [];
let timerIntervalId = null;
let reportPeriod = "week";
let journalSideMode = "tags";
let personalPeriod = "week";
let personalAnchorDate = new Date();
let statsMode = "categories";
let evolutionFilterLabel = null;
let manualTimingSyncLocked = false;
let dayThemes = loadDayThemes();
let manualCurrentTags = [];
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
let pendingDecisionResolver = null;
let quickProjectsDragState = null;
let agendaDragState = null;
let agendaLastScrolledWeekStart = null;
let suppressNextAgendaClick = false;
let auditTableAvailable = null;
let remoteActiveSessions = [];
let repriseActions = loadStoredRepriseActions();
let remoteStateAvailable = false;
let sharedDayThemesByScope = {};
let sharedReprisesOrderByScope = {};
let sharedProfileAvatarsByOwner = {};
let remoteSyncHealth = {
  history: "unknown",
  active: "unknown",
  reprise: "unknown",
  preferences: "unknown",
};
let remoteSyncStatusSignature = "";
let remoteStateLoadingPromise = null;
let remoteSyncIntervalId = null;
let activeDraftSyncTimeoutId = null;
let authStatusClearTimeoutId = null;
const PLANNED_WORK_DAYS = new Set([1, 2, 3, 4, 5]);
const PLANNED_WORK_START_HOUR = 9;
const PLANNED_WORK_END_HOUR = 18;
let authRescueOptionsSignature = "";
let usersAdminEditingId = null;
let usersAdminDraft = null;
let pendingStoppedSessionState = loadPendingStoppedSessionState();
let recentlyStoppedSessionGuards = loadRecentlyStoppedSessionGuards();

if (
  activeSession && (
    matchesPendingStoppedSession(activeSession) ||
    isRecentlyStoppedSessionLike(activeSession) ||
    isGhostActiveSessionCandidate(activeSession, sessions)
  )
) {
  activeSession = null;
  try {
    window.localStorage.removeItem(ACTIVE_SESSION_KEY);
  } catch {
    // ignore storage issues
  }
}

let plannedEventOverrides = loadStoredPlannedEventOverrides();
let plannedCalendarSnapshots = loadStoredPlannedCalendarSnapshots();
let calendarIcsUrlsByCollaborator = loadCalendarIcsUrls();
let plannedEditingEventId = null;
let plannedEditingEvent = null;
let plannedCurrentCategories = [];
let plannedCurrentTags = [];
let visiblePlannedEvents = [];

setupTokenInput(categoriesInput, {
  getValues: () => currentCategories,
  setValues: (values) => {
    const normalized = normalizeCategoryAndTags(values, currentTags);
    currentCategories = normalized.categories;
    currentTags = normalized.tags;
    renderCategoryTokens();
    renderTagTokens();
    syncActiveSessionDraftFromForm({ audit: true, source: "active-session-category" });
  },
  singleValue: true,
});

setupTokenInput(tagsInput, {
  getValues: () => currentTags,
  setValues: (values) => {
    currentTags = dedupePreservingOrder(values.map(normalizeTag));
    renderTagTokens();
    syncActiveSessionDraftFromForm({ audit: true, source: "active-session-tags" });
  },
});

setupTokenInput(manualTagsInput, {
  getValues: () => manualCurrentTags,
  setValues: (values) => {
    manualCurrentTags = dedupePreservingOrder(values.map(normalizeTag));
    renderManualTagTokens();
  },
});

setupTokenInput(plannedCategoryInput, {
  getValues: () => plannedCurrentCategories,
  setValues: (values) => {
    const normalized = normalizeCategoryAndTags(values, plannedCurrentTags);
    plannedCurrentCategories = normalized.categories;
    plannedCurrentTags = normalized.tags;
    renderPlannedCategoryTokens();
    renderPlannedTagTokens();
  },
  singleValue: true,
});

setupTokenInput(plannedTagsInput, {
  getValues: () => plannedCurrentTags,
  setValues: (values) => {
    plannedCurrentTags = dedupePreservingOrder(values.map(normalizeTag));
    renderPlannedTagTokens();
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
void initializeAuth();

authSignoutButton?.addEventListener("click", async () => {
  await handleAuthSignOut();
});

authUserAvatar?.addEventListener("click", () => {
  if (!authUserDropdown) return;
  const opening = authUserDropdown.hidden;
  authUserDropdown.hidden = !opening;
  authUserAvatar.setAttribute("aria-expanded", String(opening));
  if (opening && authCalendarIcsInput) {
    authCalendarIcsInput.value = getCalendarIcsUrl(getCurrentCollaborator() || "");
  }
});

authChangeAvatarButton?.addEventListener("click", () => {
  authAvatarInput?.click();
  if (authUserDropdown) authUserDropdown.hidden = true;
  authUserAvatar?.setAttribute("aria-expanded", "false");
});

document.addEventListener("click", (event) => {
  if (!authUserDropdown || authUserDropdown.hidden) return;
  const trigger = authUserAvatar?.closest(".auth-identity-trigger") ?? authUserAvatar;
  if (!trigger?.contains(event.target) && !authUserDropdown.contains(event.target)) {
    authUserDropdown.hidden = true;
    authUserAvatar?.setAttribute("aria-expanded", "false");
  }
});

authAvatarInput?.addEventListener("change", async (event) => {
  const input = event.target;
  const file = input?.files?.[0];
  if (!file || !accessProfile.appUser?.user_name) {
    return;
  }

  try {
    const avatarDataUrl = await resizeAvatarFileToDataUrl(file);
    const ownerName = accessProfile.appUser.user_name;
    setLocalProfileAvatar(ownerName, avatarDataUrl);
    await syncProfileAvatarPreference(ownerName, avatarDataUrl);
    applyAuthAvatarVisual(ownerName);
    setAuthStatusMessage("Photo de profil mise à jour.", "success", { persistMs: 2400 });
  } catch {
    setAuthStatusMessage("Impossible de charger cette image de profil.", "error", { persistMs: 3200 });
  } finally {
    if (input) {
      input.value = "";
    }
  }
});

authRescueButton?.addEventListener("click", async () => {
  await applyLocalRescueAccess(authRescueSelect?.value ?? "");
});

authRescueSelect?.addEventListener("keydown", async (event) => {
  if (event.key !== "Enter") {
    return;
  }
  event.preventDefault();
  await applyLocalRescueAccess(authRescueSelect?.value ?? "");
});

function resolveDecisionDialog(result) {
  const resolver = pendingDecisionResolver;
  pendingDecisionResolver = null;
  decisionDialog?.close();
  resolver?.(result);
}

function requestDecision({
  eyebrow = "Confirmation",
  title = "Verifier cette action",
  copy = "",
  detail = "",
  confirmLabel = "Confirmer",
  tone = "primary",
} = {}) {
  if (!decisionDialog || !decisionDialogConfirmButton || !decisionDialogCancelButton) {
    return Promise.resolve(window.confirm(copy || title));
  }

  decisionDialogEyebrow.textContent = eyebrow;
  decisionDialogTitle.textContent = title;
  decisionDialogCopy.textContent = copy;
  decisionDialogDetail.textContent = detail;
  decisionDialogDetail.hidden = !detail;
  decisionDialogConfirmButton.textContent = confirmLabel;
  decisionDialogConfirmButton.className = tone === "danger" ? "btn btn-ghost-danger" : "btn btn-primary";

  if (pendingDecisionResolver) {
    pendingDecisionResolver(false);
    pendingDecisionResolver = null;
  }

  return new Promise((resolve) => {
    pendingDecisionResolver = resolve;
    decisionDialog.showModal();
  });
}

decisionDialogCancelButton?.addEventListener("click", () => {
  resolveDecisionDialog(false);
});

decisionDialogConfirmButton?.addEventListener("click", () => {
  resolveDecisionDialog(true);
});

decisionDialog?.addEventListener("close", () => {
  if (pendingDecisionResolver) {
    const resolver = pendingDecisionResolver;
    pendingDecisionResolver = null;
    resolver(false);
  }
});

async function handlePrimaryTimerAction() {
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
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  await handlePrimaryTimerAction();
});

function createSessionId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `loc-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function shouldIgnoreGlobalShortcut(event) {
  if (
    event.defaultPrevented ||
    event.repeat ||
    event.metaKey ||
    event.ctrlKey ||
    event.altKey
  ) {
    return true;
  }

  const target = event.target;
  if (target instanceof HTMLElement) {
    if (target.isContentEditable) {
      return true;
    }
    if (target.closest("input, textarea, select, [contenteditable='true'], [contenteditable=''], .token-field")) {
      return true;
    }
  }

  return Boolean(document.querySelector("dialog[open]"));
}

toggleButton.addEventListener("click", async () => {
  await handlePrimaryTimerAction();
});

pauseButton.addEventListener("click", () => {
  togglePauseSession();
});

document.addEventListener("keydown", (event) => {
  if (shouldIgnoreGlobalShortcut(event)) {
    return;
  }

  const key = event.key.toLowerCase();
  if (key === "d" && !activeSession) {
    event.preventDefault();
    void handlePrimaryTimerAction();
    return;
  }
  if (key === "s") {
    event.preventDefault();
    openManualDialog();
    return;
  }
  if (key === "p" && activeSession) {
    event.preventDefault();
    togglePauseSession();
    return;
  }
  if (key === "a" && activeSession) {
    event.preventDefault();
    stopActiveSession();
  }
});

openManualButton.addEventListener("click", () => {
  openManualDialog();
});

activeStartDisplay.addEventListener("click", () => {
  showActiveStartEditor();
});

for (const input of [manualStartDateInput, manualStartTimeInput, manualEndDateInput, manualEndTimeInput]) {
  input?.addEventListener("input", () => {
    syncManualDurationFromBounds();
    renderAgendaLivePreview();
  });
  input?.addEventListener("change", () => {
    syncManualDurationFromBounds();
    renderAgendaLivePreview();
  });
}

manualDurationInput?.addEventListener("input", () => {
  syncManualEndFromDuration();
});

manualDurationInput?.addEventListener("blur", () => {
  syncManualEndFromDuration();
  syncManualDurationFromBounds();
});

addDayThemeButton?.addEventListener("click", () => {
  const collaborator = getCurrentCollaborator();
  const label = dayThemeInput?.value.trim();
  if (!collaborator || !label) {
    dayThemeInput?.focus();
    return;
  }

  const scopedThemes = getScopedDayThemes(collaborator);
  const nextScopedThemes = [
    ...scopedThemes,
    {
      id: createSessionId(),
      collaborator,
      label,
      order: scopedThemes.length,
    },
  ];
  setLocalScopedDayThemes(collaborator, nextScopedThemes);
  dayThemeInput.value = "";
  renderDayThemes();
  void syncDayThemesPreferenceForCollaborator(collaborator);
});

dayThemeInput?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addDayThemeButton?.click();
  }
});

dayThemesList?.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-theme-id]");
  if (!removeButton) {
    return;
  }

  const collaborator = getCurrentCollaborator();
  const remainingThemes = getScopedDayThemes(collaborator).filter((item) => item.id !== removeButton.dataset.removeThemeId);
  setLocalScopedDayThemes(collaborator, remainingThemes);
  renderDayThemes();
  if (collaborator) {
    void syncDayThemesPreferenceForCollaborator(collaborator);
  }
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

function resetQuickProjectsDragUi() {
  quickProjects.querySelectorAll(".chip--dragging").forEach((chip) => chip.classList.remove("chip--dragging"));
  quickProjects.querySelectorAll(".chip--drop-target").forEach((chip) => chip.classList.remove("chip--drop-target"));
  quickProjects.classList.remove("chip-row--sorting");
  repriseActionsShell?.setAttribute("hidden", "");
  repriseArchiveZone?.classList.remove("reprise-dropzone--active");
  repriseDoneZone?.classList.remove("reprise-dropzone--active");
  quickProjectsDragState = null;
}

quickProjects.addEventListener("dragend", () => {
  resetQuickProjectsDragUi();
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
      resetQuickProjectsDragUi();
      return;
    }

    await saveRepriseAction(memory, actionKind);
    resetQuickProjectsDragUi();
    renderQuickProjects();
    renderProjectMemoryList();
  });
}

setupRepriseDropzone(repriseArchiveZone, "archive");
setupRepriseDropzone(repriseDoneZone, "done");

document.addEventListener("drop", () => {
  if (!quickProjectsDragState) {
    return;
  }
  window.setTimeout(() => {
    if (quickProjectsDragState) {
      resetQuickProjectsDragUi();
    }
  }, 0);
});

document.addEventListener("dragend", () => {
  if (quickProjectsDragState) {
    resetQuickProjectsDragUi();
  }
});

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
  evolutionFilterLabel = null;
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

personalPeriodSwitch?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-personal-period]");
  if (!button) return;
  personalPeriod = button.dataset.personalPeriod;
  if (personalPeriod !== "custom") personalAnchorDate = new Date();
  renderPersonalPeriodControls();
  renderPersonalDistribution();
});

personalPeriodPrev?.addEventListener("click", () => {
  if (personalPeriod === "week") {
    personalAnchorDate = new Date(personalAnchorDate.getTime() - 7 * 86400000);
  } else if (personalPeriod === "month") {
    personalAnchorDate = new Date(personalAnchorDate.getFullYear(), personalAnchorDate.getMonth() - 1, 1);
  }
  renderPersonalPeriodControls();
  renderPersonalDistribution();
});

personalPeriodNext?.addEventListener("click", () => {
  if (personalPeriod === "week") {
    personalAnchorDate = new Date(personalAnchorDate.getTime() + 7 * 86400000);
  } else if (personalPeriod === "month") {
    personalAnchorDate = new Date(personalAnchorDate.getFullYear(), personalAnchorDate.getMonth() + 1, 1);
  }
  renderPersonalPeriodControls();
  renderPersonalDistribution();
});

personalCustomFromInput?.addEventListener("change", () => renderPersonalDistribution());
personalCustomToInput?.addEventListener("change", () => renderPersonalDistribution());

analysisStatsSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-stats-mode]");
  if (!button) {
    return;
  }

  statsMode = button.dataset.statsMode;
  evolutionFilterLabel = null;
  render();
});

reportAnchorInput.addEventListener("change", () => {
  evolutionFilterLabel = null;
  renderCadreViews();
  renderManagerViews();
  renderResourcesViews();
});

managerCollaboratorFilter.addEventListener("change", () => {
  evolutionFilterLabel = null;
  renderManagerViews();
});

exportCsvButton?.addEventListener("click", () => {
  exportCurrentAnalysisCsv();
});

[journalFilterFromInput, journalFilterToInput, journalFilterCategoryInput, journalFilterTagsInput, journalFilterSubjectInput].forEach((input) => {
  input?.addEventListener("input", () => {
    renderSessionList();
  });
  input?.addEventListener("change", () => {
    renderSessionList();
  });
});

journalSideSwitch?.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-journal-side]");
  if (!btn) return;
  journalSideMode = btn.dataset.journalSide;
  renderTagManager();
});

document.getElementById("journal-sync-btn")?.addEventListener("click", () => {
  void syncAllLocalSessions();
});

journalFilterResetButton?.addEventListener("click", () => {
  if (journalFilterFromInput) journalFilterFromInput.value = "";
  if (journalFilterToInput) journalFilterToInput.value = "";
  if (journalFilterCategoryInput) journalFilterCategoryInput.value = "";
  if (journalFilterTagsInput) journalFilterTagsInput.value = "";
  if (journalFilterSubjectInput) journalFilterSubjectInput.value = "";
  renderSessionList();
});

sessionList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest(".session-delete-button");
  if (deleteButton) {
    const sessionId = deleteButton.closest(".session-item")?.dataset.sessionId;
    const session = findSessionById(sessionId);
    if (!session) {
      return;
    }
    void (async () => {
      const confirmed = await requestDecision({
        eyebrow: "Suppression",
        title: "Supprimer cette entrée",
        copy: `Voulez-vous vraiment supprimer "${session.project || session.task || "cette entrée"}" ?`,
        detail: "Cette action efface l'entrée du journal et de l'agenda.",
        confirmLabel: "Supprimer",
        tone: "danger",
      });
      if (!confirmed) {
        return;
      }
      await deleteSession(session);
    })();
    return;
  }

  const timeRangeTrigger = event.target.closest(".session-time-range");
  if (timeRangeTrigger && !timeRangeTrigger.classList.contains("is-editing")) {
    event.stopPropagation();
    const sid = timeRangeTrigger.closest(".session-item")?.dataset.sessionId;
    const sess = findSessionById(sid);
    if (sess) openTimeRangeInlineEditor(timeRangeTrigger, sess);
    return;
  }

  const sessionItem = event.target.closest(".session-item");
  if (!sessionItem) {
    return;
  }

  const sessionId = sessionItem.dataset.sessionId;
  const session = findSessionById(sessionId);
  if (!session) {
    return;
  }

  openManualDialog(session);
});

sessionList.addEventListener("keydown", (event) => {
  const sessionItem = event.target.closest(".session-item");
  if (!sessionItem) {
    return;
  }
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }
  event.preventDefault();
  const session = findSessionById(sessionItem.dataset.sessionId);
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

authCalendarIcsSave?.addEventListener("click", async () => {
  const collaborator = getCurrentCollaborator();
  if (!collaborator) {
    setAuthStatusMessage("Sélectionnez un profil d'abord.", "warning");
    return;
  }
  const url = authCalendarIcsInput?.value.trim() ?? "";
  if (authUserDropdown) authUserDropdown.hidden = true;
  authUserAvatar?.setAttribute("aria-expanded", "false");
  await saveCalendarIcsUrl(collaborator, url);
  setAuthStatusMessage("URL du calendrier enregistrée.", "success", { persistMs: 2400 });
});

agendaCalendarSyncButton?.addEventListener("click", () => {
  const collaborator = getCurrentCollaborator();
  if (!collaborator) {
    setAuthStatusMessage("Sélectionnez un profil d'abord.", "warning");
    return;
  }
  void syncGoogleCalendar(collaborator);
});

agendaBoard.addEventListener("click", (event) => {
  if (suppressNextAgendaClick) {
    suppressNextAgendaClick = false;
    return;
  }

  const plannedTarget = event.target.closest("[data-planned-id]");
  if (plannedTarget) {
    const plannedEvent = visiblePlannedEvents.find((item) => item.id === plannedTarget.dataset.plannedId);
    if (plannedEvent) {
      openPlannedDialog(plannedEvent);
    }
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

plannedCancelButton?.addEventListener("click", () => {
  closePlannedDialog();
});

plannedIgnoreButton?.addEventListener("click", () => {
  applyPlannedEventDecision("ignored");
});

plannedSaveButton?.addEventListener("click", () => {
  applyPlannedEventDecision("validated");
});

plannedApplySuggestionButton?.addEventListener("click", () => {
  if (!plannedEditingEvent) {
    return;
  }
  if (plannedEditingEvent.suggested_category) {
    plannedCategoryInput.value = plannedEditingEvent.suggested_category;
  }
  plannedCurrentTags = dedupePreservingOrder([...(plannedCurrentTags ?? []), ...(plannedEditingEvent.suggested_tags ?? [])]);
  renderPlannedTagTokens();
  plannedCategoryInput.focus();
});

plannedDialog?.addEventListener("close", () => {
  resetPlannedDialog();
});

manualDialog?.addEventListener("close", () => {
  setManualDialogStatus("");
  manualEditingSessionId = null;
});

retryPendingStopButton?.addEventListener("click", () => {
  void syncPendingStoppedSession({ fromRetry: true });
});

[
  manualCollaboratorInput,
  manualProjectInput,
  manualTaskInput,
  manualCategoriesInput,
  manualTagsInput,
  manualNotionInput,
  manualObjectivePoleInput,
  manualObjectiveOkrInput,
  manualObjectiveKrInput,
  manualNotesInput,
  manualStartDateInput,
  manualStartTimeInput,
  manualEndDateInput,
  manualEndTimeInput,
  manualDurationInput,
].forEach((field) => {
  field?.addEventListener("input", () => {
    setManualDialogStatus("");
  });
  field?.addEventListener("change", () => {
    setManualDialogStatus("");
  });
});

cancelManualButton.addEventListener("click", () => {
  manualEditingSessionId = null;
  if (deleteManualButton) {
    deleteManualButton.hidden = true;
  }
  manualDialog.close();
});

deleteManualButton?.addEventListener("click", () => {
  const session = manualEditingSessionId ? findSessionById(manualEditingSessionId) : null;
  if (!session) {
    return;
  }
  void (async () => {
    const confirmed = await requestDecision({
      eyebrow: "Suppression",
      title: "Supprimer cette entrée",
      copy: `Voulez-vous vraiment supprimer "${session.project || session.task || "cette entrée"}" ?`,
      detail: "Cette action efface l'entrée du journal et de l'agenda.",
      confirmLabel: "Supprimer",
      tone: "danger",
    });
    if (!confirmed) {
      return;
    }
    manualEditingSessionId = null;
    deleteManualButton.hidden = true;
    manualDialog.close();
    await deleteSession(session);
  })();
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
  if (!fieldManageState?.allowDelete) {
    return;
  }
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
      allowCreate: () => canCreateSharedReferenceCatalog(),
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
      input: journalFilterCategoryInput,
      getOptions: () => getCategorySuggestionLabels(),
      applyValue: (value) => {
        journalFilterCategoryInput.value = value;
        renderSessionList();
      },
    },
    {
      input: journalFilterTagsInput,
      getOptions: () => uniqueTokenValues("tags").map((tag) => `#${tag}`),
      applyValue: (value) => {
        journalFilterTagsInput.value = value;
        renderSessionList();
      },
    },
    {
      input: journalFilterSubjectInput,
      getOptions: () => mergeSuggestionValues(uniqueValues("project"), uniqueValues("task")),
      applyValue: (value) => {
        journalFilterSubjectInput.value = value;
        renderSessionList();
      },
    },
    {
      input: categoriesInput,
      getOptions: () => getCategorySuggestionLabels(),
      allowCreate: () => canCreateSharedReferenceCatalog(),
      createLabel: (value) => `Ajouter "${value}" comme nouvelle catégorie`,
      createValue: (value) =>
        createCategoryReference(value, {
          userName: collaboratorInput.value.trim(),
          projectName: projectInput.value.trim(),
        }),
      applyValue: (value) => {
        const normalized = normalizeCategoryAndTags([value], currentTags);
        currentCategories = normalized.categories;
        currentTags = normalized.tags;
        renderCategoryTokens();
        renderTagTokens();
        categoriesInput.value = "";
      },
    },
    {
      input: tagsInput,
      getOptions: () => uniqueTokenValues("tags"),
      applyValue: (value) => {
        currentTags = dedupePreservingOrder([...currentTags, value]);
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
      allowCreate: () => canCreateSharedReferenceCatalog(),
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
      getOptions: () => getCategorySuggestionLabels(),
      allowCreate: () => canCreateSharedReferenceCatalog(),
      createLabel: (value) => `Ajouter "${value}" comme nouvelle catégorie`,
      createValue: (value) =>
        createCategoryReference(value, {
          userName: manualCollaboratorInput.value.trim(),
          projectName: manualProjectInput.value.trim(),
        }),
      applyValue: (value) => {
        const normalized = normalizeCategoryAndTags(
          [value],
          dedupePreservingOrder([...manualCurrentTags, ...parseTokenString(manualTagsInput.value)]),
        );
        manualCategoriesInput.value = normalized.categories.join(", ");
        manualCurrentTags = normalized.tags;
        manualTagsInput.value = "";
        renderManualTagTokens();
      },
    },
    {
      input: manualTagsInput,
      getOptions: () => uniqueTokenValues("tags"),
      applyValue: (value) => {
        manualCurrentTags = dedupePreservingOrder([...manualCurrentTags, value]);
        manualTagsInput.value = "";
        renderManualTagTokens();
      },
    },
    {
      input: plannedCategoryInput,
      anchor: plannedCategoryInput.closest(".dialog-card"),
      getOptions: () => getCategorySuggestionLabels(),
      applyValue: (value) => {
        const normalized = normalizeCategoryAndTags([value], plannedCurrentTags);
        plannedCurrentCategories = normalized.categories;
        plannedCategoryInput.value = "";
        plannedCurrentTags = normalized.tags;
        plannedTagsInput.value = "";
        renderPlannedCategoryTokens();
        renderPlannedTagTokens();
      },
    },
    {
      input: plannedTagsInput,
      getOptions: () => uniqueTokenValues("tags"),
      applyValue: (value) => {
        plannedCurrentTags = dedupePreservingOrder([...plannedCurrentTags, value]);
        plannedTagsInput.value = "";
        renderPlannedTagTokens();
      },
    },
    {
      input: plannedTaskInput,
      getOptions: () => uniqueValues("task"),
      applyValue: (value) => {
        plannedTaskInput.value = value;
      },
    },
    {
      input: plannedNotionInput,
      getOptions: () => uniqueValues("notionRef"),
      applyValue: (value) => {
        plannedNotionInput.value = value;
      },
    },
    {
      input: plannedObjectivePoleInput,
      anchor: plannedObjectivePoleInput.closest(".objective-block"),
      getOptions: () => mergeSuggestionValues(OBJECTIVE_2026_PILLARS, uniqueValues("objectivePole")),
      applyValue: (value) => {
        plannedObjectivePoleInput.value = value;
      },
    },
    {
      input: plannedObjectiveOkrInput,
      anchor: plannedObjectiveOkrInput.closest(".objective-block"),
      getOptions: () => getObjectiveOkrOptions(plannedObjectivePoleInput.value.trim()),
      applyValue: (value) => {
        applyObjectiveOkrSelection(value, {
          poleInput: plannedObjectivePoleInput,
          okrInput: plannedObjectiveOkrInput,
        });
      },
    },
    {
      input: plannedObjectiveKrInput,
      anchor: plannedObjectiveKrInput.closest(".objective-block"),
      getOptions: () => getObjectiveKrOptions(
        plannedObjectivePoleInput.value.trim(),
        plannedObjectiveOkrInput.value.trim(),
      ),
      applyValue: (value) => {
        applyObjectiveKrSelection(value, {
          poleInput: plannedObjectivePoleInput,
          okrInput: plannedObjectiveOkrInput,
          krInput: plannedObjectiveKrInput,
        });
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
  faviconLink.href = "icon.webp";
  faviconLink.type = "image/webp";
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
  if (state.originalSession.isServerActive && isCurrentActiveSession(state.originalSession)) {
    const nextActiveSession = normalizeSession({
      ...state.originalSession,
      ...state.previewSession,
      isServerActive: true,
    });
    activeSession = nextActiveSession;
    persistActiveSession();
    void logSessionChange(state.originalSession, nextActiveSession, `agenda-${state.mode}`);
    render();
    void upsertActiveSessionToSupabase(nextActiveSession);
    return;
  }

  attemptSaveSession(state.previewSession, {
    excludeId: state.originalSession.id,
    onSuccess: (sessionToSave) => {
      upsertSession({ ...sessionToSave, syncStatus: "pending_update" });
      persistSessions();
      void logSessionChange(state.originalSession, sessionToSave, `agenda-${state.mode}`);
      showSaveToast(sessionToSave, { label: "Horaires mis à jour" });
      void (async () => {
        const ok = await syncSessionToSupabase(sessionToSave, "manual", { refreshAfterSuccess: false });
        if (ok) {
          const stored = sessions.find((s) => s.id === sessionToSave.id);
          if (stored?.syncStatus === "pending_update") {
            upsertSession({ ...stored, syncStatus: "synced" });
            persistSessions();
          }
          await loadServerBackedState({ silent: true });
          render();
        }
      })();
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
  return ["cadre", "manager", "resources", "users", "journal", "guide"].includes(hash) ? hash : "guide";
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
  setupObjectiveDisclosure({
    disclosure: plannedObjectiveDisclosure,
    summaryText: plannedObjectiveSummaryText,
    poleInput: plannedObjectivePoleInput,
    okrInput: plannedObjectiveOkrInput,
    krInput: plannedObjectiveKrInput,
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
  setupSingleSelectionDisplay({
    input: plannedObjectivePoleInput,
    container: plannedObjectivePoleSelected,
  });
  setupSingleSelectionDisplay({
    input: plannedObjectiveOkrInput,
    container: plannedObjectiveOkrSelected,
  });
  setupSingleSelectionDisplay({
    input: plannedObjectiveKrInput,
    container: plannedObjectiveKrSelected,
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
  renderSingleSelectionTag(plannedObjectivePoleInput, plannedObjectivePoleSelected);
  renderSingleSelectionTag(plannedObjectiveOkrInput, plannedObjectiveOkrSelected);
  renderSingleSelectionTag(plannedObjectiveKrInput, plannedObjectiveKrSelected);
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
  renderObjectiveDisclosureSummary(plannedObjectiveSummaryText, {
    pole: plannedObjectivePoleInput.value.trim(),
    okr: plannedObjectiveOkrInput.value.trim(),
    kr: plannedObjectiveKrInput.value.trim(),
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

function loadDayThemes() {
  try {
    return JSON.parse(window.localStorage.getItem(DAY_THEMES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function isDemoSession(session) {
  return String(session?.id ?? "").startsWith("DEMO-");
}

function getDemoSessions() {
  return DEMO_MODE_ENABLED ? ROLLING_DEMO_SESSIONS.map(normalizeSession) : [];
}

function persistDayThemes() {
  window.localStorage.setItem(DAY_THEMES_KEY, JSON.stringify(dayThemes));
}

function loadStoredProfileAvatars() {
  try {
    return JSON.parse(window.localStorage.getItem(PROFILE_AVATAR_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function storeProfileAvatars(value) {
  try {
    window.localStorage.setItem(PROFILE_AVATAR_KEY, JSON.stringify(value));
  } catch {
    // ignore local storage errors
  }
}

function getProfileAvatarOwnerKey(ownerName = "") {
  return normalizeText(ownerName || getSharedPreferenceOwnerName() || "global") || "global";
}

function getLocalProfileAvatar(ownerName = "") {
  const ownerKey = getProfileAvatarOwnerKey(ownerName);
  const avatars = loadStoredProfileAvatars();
  return typeof avatars[ownerKey] === "string" ? avatars[ownerKey] : "";
}

function setLocalProfileAvatar(ownerName, dataUrl) {
  const ownerKey = getProfileAvatarOwnerKey(ownerName);
  const avatars = loadStoredProfileAvatars();
  if (dataUrl) {
    avatars[ownerKey] = dataUrl;
  } else {
    delete avatars[ownerKey];
  }
  storeProfileAvatars(avatars);
}

function getSharedPreferenceOwnerName() {
  return accessProfile.appUser?.user_name?.trim() ?? "";
}

function getSharedPreferenceScopeKey(collaborator = "") {
  return normalizeText(collaborator || getCurrentCollaborator() || "global") || "global";
}

function hydrateSharedUiPreferences(rows = []) {
  const nextDayThemesByScope = {};
  const nextReprisesOrderByScope = {};
  const nextProfileAvatarsByOwner = {};
  const nextLocalReprisesOrder = loadStoredReprisesOrder();

  for (const row of rows) {
    const scopeKey = String(row?.scope_key || "global");
    const value = row?.value_json;
    if (row?.preference_key === DAY_THEMES_PREFERENCE_KEY && Array.isArray(value)) {
      const collaborator = row.collaborator_name || getCurrentCollaborator() || "";
      const normalizedThemes = value
        .filter((item) => item && typeof item === "object")
        .map((item, index) => ({
          id: String(item.id || createSessionId()),
          collaborator: item.collaborator || collaborator,
          label: String(item.label || "").trim(),
          order: Number(item.order ?? index) || 0,
        }))
        .filter((item) => item.label);
      nextDayThemesByScope[scopeKey] = normalizedThemes;
      if (collaborator) {
        setLocalScopedDayThemes(collaborator, normalizedThemes);
      }
    }
    if (row?.preference_key === REPRISES_ORDER_PREFERENCE_KEY && Array.isArray(value)) {
      const order = value.map((item) => String(item || "").trim()).filter(Boolean);
      nextReprisesOrderByScope[scopeKey] = order;
      nextLocalReprisesOrder[scopeKey] = order;
    }
    if (row?.preference_key === PROFILE_AVATAR_PREFERENCE_KEY && value && typeof value === "object") {
      const ownerName = row.owner_user_name || row.collaborator_name || "";
      const ownerKey = getProfileAvatarOwnerKey(ownerName);
      const dataUrl = typeof value.data_url === "string" ? value.data_url : "";
      if (dataUrl) {
        nextProfileAvatarsByOwner[ownerKey] = dataUrl;
        setLocalProfileAvatar(ownerName, dataUrl);
      }
    }
    if (row?.preference_key === CALENDAR_ICS_PREFERENCE_KEY && typeof value === "string" && value) {
      const collaborator = row.collaborator_name || row.owner_user_name || "";
      if (collaborator) {
        calendarIcsUrlsByCollaborator[normalizeText(collaborator)] = value;
      }
    }
  }

  storeCalendarIcsUrls(calendarIcsUrlsByCollaborator);
  storeReprisesOrder(nextLocalReprisesOrder);
  sharedDayThemesByScope = nextDayThemesByScope;
  sharedReprisesOrderByScope = nextReprisesOrderByScope;
  sharedProfileAvatarsByOwner = nextProfileAvatarsByOwner;
}

function isMissingSharedPreferencesTableError(error) {
  const message = String(error?.message || "");
  const code = String(error?.code || "");
  return code === "42P01" || code === "PGRST205" || message.includes(UI_PREFERENCES_TABLE);
}

async function syncSharedUiPreference(preferenceKey, collaborator, valueJson) {
  if (!window.supabase) {
    return false;
  }

  const ownerUserName = getSharedPreferenceOwnerName();
  if (!ownerUserName) {
    return false;
  }

  const payload = {
    owner_user_name: ownerUserName,
    collaborator_name: collaborator || ownerUserName,
    preference_key: preferenceKey,
    scope_key: getSharedPreferenceScopeKey(collaborator),
    value_json: valueJson,
    updated_at: new Date().toISOString(),
  };

  const { error } = await window.supabase
    .from(UI_PREFERENCES_TABLE)
    .upsert([payload], { onConflict: "owner_user_name,preference_key,scope_key" });

  if (error) {
    if (!isMissingSharedPreferencesTableError(error)) {
      console.warn(`${preferenceKey} shared preference upsert failed:`, error);
    }
    return false;
  }

  return true;
}

function getLocalScopedDayThemes(collaborator) {
  const key = normalizeText(collaborator || "");
  return dayThemes
    .filter((item) => normalizeText(item.collaborator || "") === key)
    .sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
}

function setLocalScopedDayThemes(collaborator, nextItems) {
  const key = normalizeText(collaborator || "");
  const preserved = dayThemes.filter((item) => normalizeText(item.collaborator || "") !== key);
  dayThemes = [
    ...nextItems.map((item, index) => ({
      id: String(item.id || createSessionId()),
      collaborator,
      label: String(item.label || "").trim(),
      order: Number(item.order ?? index) || 0,
    })).filter((item) => item.label),
    ...preserved,
  ];
  persistDayThemes();
}

function getEffectiveScopedDayThemes(collaborator) {
  const remoteItems = sharedDayThemesByScope[getSharedPreferenceScopeKey(collaborator)];
  if (Array.isArray(remoteItems)) {
    return remoteItems.slice().sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
  }
  return getLocalScopedDayThemes(collaborator);
}

async function syncDayThemesPreferenceForCollaborator(collaborator) {
  const scopeKey = getSharedPreferenceScopeKey(collaborator);
  const scopedThemes = getLocalScopedDayThemes(collaborator);
  sharedDayThemesByScope[scopeKey] = scopedThemes.map((item) => ({ ...item }));
  await syncSharedUiPreference(DAY_THEMES_PREFERENCE_KEY, collaborator, scopedThemes);
}

function getEffectiveReprisesOrderMap() {
  const localOrder = loadStoredReprisesOrder();
  return {
    ...localOrder,
    ...sharedReprisesOrderByScope,
  };
}

async function syncReprisesOrderPreferenceForCollaborator(collaborator, explicitOrder = null) {
  const order = explicitOrder ?? (loadStoredReprisesOrder()[getReprisesOrderKey(collaborator)] ?? []);
  const scopeKey = getSharedPreferenceScopeKey(collaborator);
  sharedReprisesOrderByScope[scopeKey] = [...order];
  await syncSharedUiPreference(REPRISES_ORDER_PREFERENCE_KEY, collaborator, order);
}

function getEffectiveProfileAvatar(ownerName = "") {
  const ownerKey = getProfileAvatarOwnerKey(ownerName);
  return sharedProfileAvatarsByOwner[ownerKey] || getLocalProfileAvatar(ownerName) || "";
}

async function syncProfileAvatarPreference(ownerName, dataUrl) {
  const ownerKey = getProfileAvatarOwnerKey(ownerName);
  if (dataUrl) {
    sharedProfileAvatarsByOwner[ownerKey] = dataUrl;
  } else {
    delete sharedProfileAvatarsByOwner[ownerKey];
  }
  await syncSharedUiPreference(PROFILE_AVATAR_PREFERENCE_KEY, ownerName, { data_url: dataUrl || "" });
}

async function resizeAvatarFileToDataUrl(file) {
  const imageUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("avatar-read-failed"));
    reader.readAsDataURL(file);
  });

  const image = await new Promise((resolve, reject) => {
    const nextImage = new Image();
    nextImage.onload = () => resolve(nextImage);
    nextImage.onerror = () => reject(new Error("avatar-image-invalid"));
    nextImage.src = imageUrl;
  });

  const size = 192;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) {
    return imageUrl;
  }

  const sourceSize = Math.min(image.width, image.height);
  const sourceX = (image.width - sourceSize) / 2;
  const sourceY = (image.height - sourceSize) / 2;
  context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);
  return canvas.toDataURL("image/webp", 0.9);
}

function applyAuthAvatarVisual(ownerName = "") {
  if (!authUserAvatar) {
    return;
  }

  const avatarDataUrl = getEffectiveProfileAvatar(ownerName);
  if (avatarDataUrl) {
    authUserAvatar.textContent = getUserAvatarMonogram(ownerName || accessProfile.appUser?.user_name || "U");
    authUserAvatar.classList.add("has-photo");
    authUserAvatar.style.backgroundImage = `url(${avatarDataUrl})`;
    return;
  }

  authUserAvatar.classList.remove("has-photo");
  authUserAvatar.style.backgroundImage = "";
  authUserAvatar.textContent = getUserAvatarMonogram(ownerName || accessProfile.appUser?.user_name || "U");
}

async function ensureSharedUiPreferencesBackfilled() {
  const collaborator = getCurrentCollaborator();
  if (!collaborator || !window.supabase) {
    return;
  }

  const scopeKey = getSharedPreferenceScopeKey(collaborator);
  if (!Array.isArray(sharedDayThemesByScope[scopeKey])) {
    const localThemes = getLocalScopedDayThemes(collaborator);
    if (localThemes.length) {
      await syncDayThemesPreferenceForCollaborator(collaborator);
    }
  }

  if (!Array.isArray(sharedReprisesOrderByScope[scopeKey])) {
    const localOrder = loadStoredReprisesOrder()[getReprisesOrderKey(collaborator)] ?? [];
    if (localOrder.length) {
      await syncReprisesOrderPreferenceForCollaborator(collaborator, localOrder);
    }
  }

  const ownerName = getSharedPreferenceOwnerName();
  const ownerKey = getProfileAvatarOwnerKey(ownerName);
  if (!sharedProfileAvatarsByOwner[ownerKey]) {
    const localAvatar = getLocalProfileAvatar(ownerName);
    if (localAvatar) {
      await syncProfileAvatarPreference(ownerName, localAvatar);
    }
  }
}

function buildRollingDemoSessions(referenceDate = new Date()) {
  const baseDate = new Date(referenceDate);
  baseDate.setHours(0, 0, 0, 0);

  const seedSessions = LOCAL_DEMO_SESSIONS.filter(
    (session) => normalizeText(session.collaborator) !== normalizeText(DEMO_REFERENCE_USER),
  );
  const templateByCollaborator = new Map();

  for (const session of seedSessions) {
    const key = normalizeText(session.collaborator);
    const current = templateByCollaborator.get(key) ?? [];
    current.push(session);
    templateByCollaborator.set(key, current);
  }

  const fallbackTemplates = seedSessions.slice(0, 6);
  const sessions = [];

  for (const user of LOCAL_PROFILE_DIRECTORY) {
    if (normalizeText(user.user_name) === normalizeText(DEMO_REFERENCE_USER)) {
      continue;
    }

    const templates = templateByCollaborator.get(normalizeText(user.user_name)) ?? fallbackTemplates;
    if (!templates.length) {
      continue;
    }

    for (let offset = DEMO_LOOKBACK_DAYS - 1; offset >= 0; offset -= 1) {
      const day = new Date(baseDate);
      day.setDate(baseDate.getDate() - offset);
      const isWeekend = day.getDay() === 0 || day.getDay() === 6;
      const slots = isWeekend ? DEMO_WEEKEND_SLOTS : DEMO_WEEKDAY_SLOTS;

      slots.forEach((slot, index) => {
        const template = templates[(offset + index) % templates.length];
        sessions.push(materializeDemoSession(template, user, day, slot, index));
      });
    }
  }

  return sessions;
}

function materializeDemoSession(template, user, day, slot, slotIndex) {
  const start = new Date(day);
  start.setHours(slot.startHour, slot.startMinute, 0, 0);
  const end = new Date(start.getTime() + slot.durationMinutes * 60000);
  const dayStamp = `${start.getFullYear()}${String(start.getMonth() + 1).padStart(2, "0")}${String(start.getDate()).padStart(2, "0")}`;
  const userSlug = normalizeText(user.user_name).replace(/[^a-z0-9]+/g, "-");

  return {
    ...template,
    id: `DEMO-${userSlug}-${dayStamp}-${slotIndex + 1}`,
    collaborator: user.user_name,
    dbTeamName: user.team_name ?? template.dbTeamName ?? "",
    dbClientName: template.dbClientName ?? "Interne",
    start: start.toISOString(),
    end: end.toISOString(),
    durationMs: slot.durationMinutes * 60000,
    notes: template.notes || "Demo planning pour lecture visuelle.",
  };
}

function readLocalStorageJsonWithFallback(primaryKey, fallbackKeys = [], fallbackValue = null) {
  const keys = [primaryKey, ...fallbackKeys].filter(Boolean);
  let parseFailedOnPrimary = false;
  for (const key of keys) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw == null) {
        continue;
      }
      const parsed = JSON.parse(raw);
      if (parseFailedOnPrimary && key !== primaryKey) {
        try {
          window.localStorage.setItem(primaryKey, JSON.stringify(parsed));
        } catch {
          // Best-effort self-heal only.
        }
      }
      return parsed;
    } catch {
      if (key === primaryKey) {
        parseFailedOnPrimary = true;
      }
    }
  }
  return fallbackValue;
}

function loadSessions() {
  const parsed = readLocalStorageJsonWithFallback(STORAGE_KEY, [LEGACY_STORAGE_KEYS[STORAGE_KEY]], []);
  const normalized = Array.isArray(parsed)
    ? parsed
        .map(normalizeSession)
        .filter((session) => !isCorruptedPersistedSession(session))
        .filter((session) => DEMO_MODE_ENABLED || !isDemoSession(session))
    : [];
  const demoSessions = getDemoSessions();
  if (!normalized.length) {
    return demoSessions;
  }

  return [...demoSessions, ...normalized];
}

function loadActiveSession() {
  const parsed = readLocalStorageJsonWithFallback(ACTIVE_SESSION_KEY, [LEGACY_STORAGE_KEYS[ACTIVE_SESSION_KEY]], null);
  return parsed ? normalizeSession(parsed) : null;
}

function loadPendingStoppedSessionState() {
  try {
    const raw = window.localStorage.getItem(PENDING_STOP_STATE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed?.session) {
      return null;
    }
    return {
      session: normalizeSession(parsed.session),
      source: parsed.source || "timer",
      state: parsed.state === "syncing" ? "pending" : parsed.state || "pending",
      stopOpId: parsed.stopOpId || `stop-${parsed.session.id || createSessionId()}`,
      remoteActiveSessionId: parsed.remoteActiveSessionId || parsed.session.dbActiveSessionId || parsed.session.id || null,
      pendingOps: {
        create_entry: parsed.pendingOps?.create_entry === "done" ? "done" : "pending",
        stop_active: parsed.pendingOps?.stop_active === "done" ? "done" : "pending",
      },
      errorMessage: parsed.errorMessage || "",
    };
  } catch {
    return null;
  }
}

function persistPendingStoppedSessionState() {
  try {
    if (!pendingStoppedSessionState?.session) {
      window.localStorage.removeItem(PENDING_STOP_STATE_KEY);
      return;
    }
    window.localStorage.setItem(PENDING_STOP_STATE_KEY, JSON.stringify(pendingStoppedSessionState));
  } catch {
    // ignore storage issues
  }
}

function setPendingStoppedSessionState(nextState) {
  pendingStoppedSessionState = nextState?.session ? nextState : null;
  persistPendingStoppedSessionState();
}

function clearPendingStoppedSessionState() {
  logStateLoss("clearPendingStoppedSessionState:before", {
    writer: "clearPendingStoppedSessionState",
  });
  pendingStoppedSessionState = null;
  persistPendingStoppedSessionState();
  logStateLoss("clearPendingStoppedSessionState:after", {
    writer: "clearPendingStoppedSessionState",
  });
}

function buildPendingStopOpsState(previous = null) {
  return {
    create_entry: previous?.create_entry === "done" ? "done" : "pending",
    stop_active: previous?.stop_active === "done" ? "done" : "pending",
  };
}

function logStopSync(event, payload = {}) {
  if (DEBUG_STOP_SYNC) console.info(`[Mordologie stop-sync] ${event}`, payload);
}

function buildStateLossSnapshot(extra = {}) {
  const repriseCount = quickProjects?.querySelectorAll?.("[data-memory-key]")?.length ?? 0;
  return {
    sessionsCount: sessions.length,
    sessionIds: sessions.map((session) => session?.id ?? "").filter(Boolean),
    sessionSyncStates: sessions.map((session) => ({
      id: session?.id ?? "",
      syncStatus: session?.syncStatus ?? "",
      isServerBacked: Boolean(session?.isServerBacked),
    })),
    activeSessionId: activeSession?.id ?? null,
    pendingStoppedSessionState: pendingStoppedSessionState
      ? {
          sessionId: pendingStoppedSessionState.session?.id ?? null,
          state: pendingStoppedSessionState.state ?? "",
          pendingOps: pendingStoppedSessionState.pendingOps ?? null,
          syncStatus: pendingStoppedSessionState.session?.syncStatus ?? "",
        }
      : null,
    reprisesCount: repriseCount,
    ...extra,
  };
}

function logStateLoss(event, payload = {}) {
  if (DEBUG_STATE_LOSS) console.info(`[Mordologie state-loss] ${event}`, buildStateLossSnapshot(payload));
}

function loadRecentlyStoppedSessionGuards() {
  try {
    const raw = window.localStorage.getItem(RECENTLY_STOPPED_SESSIONS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    const now = Date.now();
    return Array.isArray(parsed)
      ? parsed.filter((item) => item && Number(item.expiresAt) > now)
      : [];
  } catch {
    return [];
  }
}

function persistRecentlyStoppedSessionGuards() {
  try {
    const now = Date.now();
    recentlyStoppedSessionGuards = recentlyStoppedSessionGuards.filter((item) => item && Number(item.expiresAt) > now);
    if (!recentlyStoppedSessionGuards.length) {
      window.localStorage.removeItem(RECENTLY_STOPPED_SESSIONS_KEY);
      return;
    }
    window.localStorage.setItem(RECENTLY_STOPPED_SESSIONS_KEY, JSON.stringify(recentlyStoppedSessionGuards));
  } catch {
    // ignore storage issues
  }
}

function rememberRecentlyStoppedSession(session) {
  if (!session) {
    return;
  }
  const collaborator = normalizeText(session.collaborator ?? "");
  const startedAt = String(session.start ?? "").trim();
  const startedAtKey = getSessionStartIdentity(session.start);
  const activeSessionId = normalizeText(session.dbActiveSessionId ?? session.id ?? "");
  if (!collaborator || !startedAtKey) {
    return;
  }
  const expiresAt = Date.now() + RECENTLY_STOPPED_SESSION_TTL_MS;
  recentlyStoppedSessionGuards = recentlyStoppedSessionGuards.filter((item) => {
    if (!item) {
      return false;
    }
    if (Number(item.expiresAt) <= Date.now()) {
      return false;
    }
    const itemStartedAtKey = item.startedAtKey || getSessionStartIdentity(item.startedAt);
    return !(
      item.collaborator === collaborator &&
      itemStartedAtKey === startedAtKey
    );
  });
  recentlyStoppedSessionGuards.unshift({
    collaborator,
    startedAt,
    startedAtKey,
    activeSessionId,
    expiresAt,
  });
  persistRecentlyStoppedSessionGuards();
}

function isRecentlyStoppedSessionLike(sessionLike) {
  const collaborator = normalizeText(sessionLike?.user_name ?? sessionLike?.collaborator ?? "");
  const startedAtKey = getSessionStartIdentity(sessionLike?.started_at ?? sessionLike?.start ?? "");
  const activeSessionId = normalizeText(sessionLike?.active_session_id ?? sessionLike?.dbActiveSessionId ?? sessionLike?.id ?? "");
  if (!collaborator || !startedAtKey) {
    return false;
  }
  const now = Date.now();
  recentlyStoppedSessionGuards = recentlyStoppedSessionGuards.filter((item) => item && Number(item.expiresAt) > now);
  return recentlyStoppedSessionGuards.some((item) => {
    const itemStartedAtKey = item.startedAtKey || getSessionStartIdentity(item.startedAt);
    if (item.collaborator !== collaborator || itemStartedAtKey !== startedAtKey) {
      return false;
    }
    if (!item.activeSessionId || !activeSessionId) {
      return true;
    }
    return item.activeSessionId === activeSessionId;
  });
}

function isRecentlyStoppedRemoteActiveRow(row) {
  return isRecentlyStoppedSessionLike(row);
}

function getVisiblePendingStoppedSessionState() {
  const collaborator = getCurrentCollaborator();
  if (!collaborator || !pendingStoppedSessionState?.session) {
    return null;
  }
  return normalizeText(pendingStoppedSessionState.session.collaborator) === normalizeText(collaborator)
    ? pendingStoppedSessionState
    : null;
}

function matchesPendingStoppedSession(activeLike) {
  const pendingSession = pendingStoppedSessionState?.session;
  if (!pendingSession || !activeLike) {
    return false;
  }
  if (normalizeText(activeLike.collaborator ?? "") !== normalizeText(pendingSession.collaborator ?? "")) {
    return false;
  }
  const activeStartKey = getSessionStartIdentity(activeLike.start);
  const pendingStartKey = getSessionStartIdentity(pendingSession.start);
  if (activeStartKey && pendingStartKey && activeStartKey === pendingStartKey) {
    return true;
  }
  const activeStartMs = new Date(activeLike.start).getTime();
  const pendingStartMs = new Date(pendingSession.start).getTime();
  if (Number.isNaN(activeStartMs) || Number.isNaN(pendingStartMs)) {
    return false;
  }
  return Math.abs(activeStartMs - pendingStartMs) < 5 * 60 * 1000;
}

function shouldBlockActiveSessionSync(sessionLike) {
  if (!sessionLike) {
    return false;
  }
  if (matchesPendingStoppedSession(sessionLike)) {
    return true;
  }
  const collaborator = normalizeText(sessionLike.collaborator ?? "");
  const startedAtKey = getSessionStartIdentity(sessionLike.start);
  if (!collaborator || !startedAtKey) {
    return false;
  }
  return recentlyStoppedSessionGuards.some((item) => {
    const itemStartedAtKey = item.startedAtKey || getSessionStartIdentity(item.startedAt);
    return item.collaborator === collaborator && itemStartedAtKey === startedAtKey;
  });
}

function shouldSuppressRemoteActiveForPendingCollaborator(rowOrSession) {
  const pendingSession = pendingStoppedSessionState?.session;
  if (!pendingSession) {
    return false;
  }
  const rowCollaborator = normalizeText(rowOrSession?.user_name ?? rowOrSession?.collaborator ?? "");
  const pendingCollaborator = normalizeText(pendingSession.collaborator ?? "");
  if (!rowCollaborator || !pendingCollaborator) {
    return false;
  }
  return rowCollaborator === pendingCollaborator;
}

function setStatusNodeMessage(node, message = "", tone = "error") {
  if (!node) {
    return;
  }
  node.textContent = message;
  node.hidden = !message;
  node.dataset.tone = message ? tone : "";
}

function setManualDialogStatus(message = "", tone = "error") {
  setStatusNodeMessage(manualDialogStatus, message, tone);
}

function setPlannedDialogStatus(message = "", tone = "error") {
  setStatusNodeMessage(plannedDialogStatus, message, tone);
}

function extractFirstUrl(rawValue = "") {
  const match = String(rawValue ?? "").match(/https?:\/\/[^\s)]+/i);
  return match ? match[0] : "";
}

function setUsersAdminDraftStatus(message = "", tone = "error") {
  if (!usersAdminDraft) {
    return;
  }
  usersAdminDraft.statusMessage = message;
  usersAdminDraft.statusTone = tone;
}

function clearUsersAdminDraftTransientState() {
  if (!usersAdminDraft) {
    return;
  }
  usersAdminDraft.confirm_delete = false;
  setUsersAdminDraftStatus("");
}

function failUsersAdminDraft(message, tone = "error") {
  setUsersAdminDraftStatus(message, tone);
  renderUsersAdmin();
  return false;
}

function updateRemoteSyncStatus(nextHealth, { silent = false } = {}) {
  remoteSyncHealth = nextHealth;
  const labels = {
    history: "historique",
    active: "session active",
    reprise: "reprises",
    preferences: "preferences",
  };
  const failed = Object.entries(nextHealth)
    .filter(([, value]) => value !== "ok")
    .map(([key]) => labels[key]);
  const allOk = failed.length === 0;
  const signature = `${nextHealth.history}|${nextHealth.active}|${nextHealth.reprise}|${nextHealth.preferences}`;
  const previousSignature = remoteSyncStatusSignature;
  remoteSyncStatusSignature = signature;
  const currentStatusText = authStatus?.textContent || "";
  const currentTone = authStatus?.dataset.tone || "";
  const currentMessageIsSyncRelated = currentStatusText.startsWith("Synchronisation ");
  const shouldRespectCurrentError = currentTone === "error" && currentStatusText && !currentMessageIsSyncRelated;

  if (allOk) {
    if (previousSignature && previousSignature !== signature && !shouldRespectCurrentError) {
      setAuthStatusMessage("Synchronisation rétablie pour l’historique, la session active, les reprises et les préférences.", "success", { persistMs: 2600 });
    }
    return;
  }

  const message = `Synchronisation partielle : ${failed.join(", ")} indisponible${failed.length > 1 ? "s" : ""}.`;
  if ((!silent || previousSignature !== signature) && !shouldRespectCurrentError) {
    setAuthStatusMessage(message, "warning");
  }
}

async function syncPendingStoppedSession({ fromRetry = false } = {}) {
  if (!pendingStoppedSessionState?.session) {
    return false;
  }

  if (pendingStoppedSessionState.state === "syncing" && !fromRetry) {
    return false;
  }

  let sessionToSync = pendingStoppedSessionState.session;
  if (!sessionToSync.dbTimeEntryId) {
    sessionToSync = {
      ...sessionToSync,
      dbTimeEntryId: await getNextTimeEntryId(),
    };
  }

  setPendingStoppedSessionState({
    ...pendingStoppedSessionState,
    session: sessionToSync,
    state: "syncing",
    pendingOps: buildPendingStopOpsState(pendingStoppedSessionState.pendingOps),
    errorMessage: "",
  });
  logStopSync("syncPendingStoppedSession:start", {
    sessionId: sessionToSync.id,
    dbTimeEntryId: sessionToSync.dbTimeEntryId,
    syncStatus: sessionToSync.syncStatus || "",
    pendingOps: buildPendingStopOpsState(pendingStoppedSessionState.pendingOps),
    fromRetry,
  });
  renderActiveSession();

  const syncResult = await finalizeStoppedSessionOnSupabase(
    sessionToSync,
    pendingStoppedSessionState.source || "timer",
  );

  if (syncResult.historySaved && syncResult.activeRemoved) {
    logStopSync("syncPendingStoppedSession:complete", {
      sessionId: sessionToSync.id,
      result: syncResult,
    });
    upsertSession({
      ...sessionToSync,
      syncStatus: "synced",
    });
    persistSessions();
    clearPendingStoppedSessionState();
    setAuthStatusMessage("Session arrêtée et synchronisée.", "success", { persistMs: 2600 });
    showSaveToast(sessionToSync);
    render();
    return true;
  }

  if (syncResult.historySaved) {
    logStopSync("syncPendingStoppedSession:partial", {
      sessionId: sessionToSync.id,
      result: syncResult,
    });
    const partiallySyncedSession = {
      ...sessionToSync,
      dbActiveSessionId: null,
      syncStatus: "pending_remote_stop",
    };
    upsertSession(partiallySyncedSession);
    persistSessions();
    setPendingStoppedSessionState({
      ...pendingStoppedSessionState,
      session: partiallySyncedSession,
      state: "pending",
      remoteActiveSessionId: pendingStoppedSessionState.remoteActiveSessionId ?? sessionToSync.id,
      stopOpId: pendingStoppedSessionState.stopOpId || `stop-${sessionToSync.id}-${Date.now()}`,
      pendingOps: {
        create_entry: "done",
        stop_active: "pending",
      },
      errorMessage: "L'entrée est gardée localement, mais la synchro serveur n'est pas encore finalisée.",
    });
    setAuthStatusMessage("Entrée enregistrée. Fermeture distante de la session à reprendre.", "warning", { persistMs: 3600 });
    render();
    return false;
  }

  logStopSync("syncPendingStoppedSession:failed", {
    sessionId: sessionToSync.id,
    result: syncResult,
  });
  setPendingStoppedSessionState({
    ...pendingStoppedSessionState,
    session: {
      ...sessionToSync,
      dbActiveSessionId: null,
      syncStatus: "pending_create",
    },
    state: "pending",
    remoteActiveSessionId: pendingStoppedSessionState.remoteActiveSessionId ?? sessionToSync.id,
    stopOpId: pendingStoppedSessionState.stopOpId || `stop-${sessionToSync.id}-${Date.now()}`,
    pendingOps: {
      create_entry: "pending",
      stop_active: "pending",
    },
    errorMessage: "L'entrée est gardée localement, mais la synchro serveur n'est pas encore finalisée.",
  });
  setAuthStatusMessage("Session arrêtée localement. Synchronisation à reprendre.", "warning", { persistMs: 3600 });
  renderActiveSession();
  return false;
}

async function completeStoppedSessionLocally(sessionToSave, source = "timer") {
  // Idempotence guard: once a stop has already materialized locally for this
  // session, repeated stop attempts must not create a second pending entry.
  if (
    pendingStoppedSessionState?.session &&
    areSessionsEffectivelySame(pendingStoppedSessionState.session, sessionToSave)
  ) {
    logStopSync("completeStoppedSessionLocally:idempotent-skip", {
      sessionId: sessionToSave.id,
      pendingSessionId: pendingStoppedSessionState.session.id,
    });
    activeSession = null;
    persistActiveSession();
    stopTimerLoop();
    render();
    return;
  }

  const sessionWithServerId = sessionToSave.dbTimeEntryId
    ? sessionToSave
    : {
        ...sessionToSave,
        dbTimeEntryId: await getNextTimeEntryId(),
      };
  cancelActiveSessionServerSync();
  rememberRecentlyStoppedSession(sessionWithServerId);
  const remoteActiveSessionId = sessionWithServerId.dbActiveSessionId ?? sessionWithServerId.id;
  const pendingLocalEntry = {
    ...sessionWithServerId,
    dbActiveSessionId: null,
    isServerActive: false,
    syncStatus: "pending_create",
  };
  logStopSync("completeStoppedSessionLocally:materialized", {
    sessionId: pendingLocalEntry.id,
    dbTimeEntryId: pendingLocalEntry.dbTimeEntryId,
    durationMs: pendingLocalEntry.durationMs,
    start: pendingLocalEntry.start,
    end: pendingLocalEntry.end,
  });
  upsertSession(pendingLocalEntry);
  activeSession = null;
  persistSessions();
  persistActiveSession();
  stopTimerLoop();
  resetFormAfterStop();
  setPendingStoppedSessionState({
    session: pendingLocalEntry,
    source,
    state: "syncing",
    remoteActiveSessionId,
    stopOpId: pendingStoppedSessionState?.stopOpId || `stop-${sessionWithServerId.id}-${Date.now()}`,
    pendingOps: {
      create_entry: "pending",
      stop_active: "pending",
    },
    errorMessage: "",
  });
  render();
  void syncPendingStoppedSession();
}

function normalizeSession(session) {
  const normalizedMeta = normalizeCategoryAndTags(
    Array.isArray(session.categories) ? session.categories.filter(Boolean) : [],
    Array.isArray(session.tags) ? session.tags.filter(Boolean) : [],
  );
  return {
    ...session,
    id: session.id ?? session.time_entry_id ?? session.active_session_id ?? createSessionId(),
    collaborator: session.collaborator ?? "",
    project: session.project ?? "",
    task: session.task ?? "",
    categories: normalizedMeta.categories,
    tags: normalizedMeta.tags,
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
    syncStatus: session.syncStatus ?? (session.isServerBacked ? "synced" : ""),
  };
}

function isCorruptedPersistedSession(session) {
  if (!session) {
    return true;
  }
  const startMs = new Date(session.start).getTime();
  if (Number.isNaN(startMs)) {
    return true;
  }

  const declaredDurationMs = Number(session.durationMs) || 0;
  if (declaredDurationMs > MAX_REASONABLE_PERSISTED_SESSION_MS) {
    return true;
  }

  if (!session.end) {
    return false;
  }

  const endMs = new Date(session.end).getTime();
  if (Number.isNaN(endMs) || endMs <= startMs) {
    return true;
  }

  const boundedDurationMs = endMs - startMs;
  return boundedDurationMs > MAX_REASONABLE_PERSISTED_SESSION_MS;
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
    tags: parseCsvTokens(row.tags_text).map(normalizeTag).filter(Boolean),
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
    tags: parseCsvTokens(row.tags_text).map(normalizeTag).filter(Boolean),
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
  logStateLoss("hydrateRemoteState:before", {
    writer: "hydrateRemoteState",
    historyRowsCount: historyRows.length,
    activeRowsCount: activeRows.length,
  });
  const previousHydratedActiveSessionId = activeSession?.id ?? null;
  const remoteSessions = historyRows.map(mapTimeEntryRowToSession);
  const mergedSessions = new Map();
  const closedRemoteSessionIds = new Set();
  const closedRemoteSessionKeys = new Set();
  const remoteTimeEntryIds = new Set();

  for (const row of historyRows) {
    const sourceSessionId = normalizeText(row?.source_session_id ?? row?.time_entry_id ?? "");
    if (sourceSessionId) {
      closedRemoteSessionIds.add(sourceSessionId);
    }
    const timeEntryId = normalizeText(row?.time_entry_id ?? "");
    if (timeEntryId) {
      remoteTimeEntryIds.add(timeEntryId);
    }
    const userName = normalizeText(row?.user_name ?? "");
    const startedAtKey = getSessionStartIdentity(row?.started_at ?? "");
    if (userName && startedAtKey) {
      closedRemoteSessionKeys.add(`${userName}::${startedAtKey}`);
    }
  }

  for (const session of remoteSessions) {
    if (isCorruptedPersistedSession(session)) {
      continue;
    }
    const key = normalizeText(session.id);
    if (!mergedSessions.has(key)) {
      mergedSessions.set(key, session);
    }
  }

  for (const session of sessions) {
    if (!session || isDemoSession(session)) {
      continue;
    }

    const protectRecentLocalSession = ["pending_create", "pending_remote_stop", "synced", "pending_update"].includes(session.syncStatus || "");
    if (session.isServerBacked && !protectRecentLocalSession) {
      continue;
    }

    const isPendingUpdate = session.syncStatus === "pending_update";
    const localKey = normalizeText(session.id);
    const localRemoteId = normalizeText(session.dbTimeEntryId ?? "");
    const localCollaborator = normalizeText(session.collaborator ?? "");
    const localStartKey = getSessionStartIdentity(session.start);
    const alreadyPresentByStart = localCollaborator && localStartKey
      ? closedRemoteSessionKeys.has(`${localCollaborator}::${localStartKey}`)
      : false;
    const alreadyPresentByRemoteId = localRemoteId ? remoteTimeEntryIds.has(localRemoteId) : false;

    if (!isPendingUpdate && (alreadyPresentByRemoteId || alreadyPresentByStart)) {
      continue;
    }
    if (!localKey || (!isPendingUpdate && mergedSessions.has(localKey))) {
      continue;
    }
    mergedSessions.set(localKey, normalizeSession(session));
  }

  sessions = Array.from(mergedSessions.values()).sort((left, right) => new Date(right.start) - new Date(left.start));
  logStateLoss("hydrateRemoteState:after-merge", {
    writer: "hydrateRemoteState",
    historyRowsCount: historyRows.length,
    activeRowsCount: activeRows.length,
    remoteSessionIds: remoteSessions.map((session) => session?.id ?? "").filter(Boolean),
  });

  const activeRowsFiltered = activeRows
    .filter((row) => {
      const activeSessionId = normalizeText(row?.active_session_id ?? "");
      if (activeSessionId && closedRemoteSessionIds.has(activeSessionId)) {
        return false;
      }
      const userName = normalizeText(row?.user_name ?? "");
      const startedAtKey = getSessionStartIdentity(row?.started_at ?? "");
      if (userName && startedAtKey && closedRemoteSessionKeys.has(`${userName}::${startedAtKey}`)) {
        return false;
      }
      if (isRecentlyStoppedRemoteActiveRow(row) || matchesPendingStoppedSession(row) || shouldSuppressRemoteActiveForPendingCollaborator(row)) {
        return false;
      }
      return true;
    })
    .map(mapActiveSessionRowToSession)
    .sort((left, right) => new Date(right.start) - new Date(left.start));

  // Deduplicate: keep only the newest active session per user.
  // Key priority: user_id (stable DB identity) → user_name → collaborator.
  // Prevents a stale duplicate row from being reinstalled as a ghost timer
  // after clearPendingStoppedSessionState() removes the suppression guard.
  const deduplicatedActives = new Map();
  for (const session of activeRowsFiltered) {
    const key = (typeof session.dbUserId === "string" && session.dbUserId.trim())
      ? session.dbUserId.trim()
      : normalizeText(session.collaborator ?? "");
    if (key && !deduplicatedActives.has(key)) {
      deduplicatedActives.set(key, session);
    }
  }
  remoteActiveSessions = Array.from(deduplicatedActives.values());

  const currentUserName = accessProfile.appUser?.user_name ?? "";
  const previousActiveSession = activeSession;
  const remoteActiveSession = currentUserName
    ? remoteActiveSessions.find((session) => normalizeText(session.collaborator) === normalizeText(currentUserName)) ?? null
    : null;

  if (remoteActiveSession && !isGhostActiveSessionCandidate(remoteActiveSession, Array.from(mergedSessions.values()))) {
    activeSession = remoteActiveSession;
  } else if (
    previousActiveSession &&
    !previousActiveSession.isServerBacked &&
    normalizeText(previousActiveSession.collaborator) === normalizeText(currentUserName) &&
    !isGhostActiveSessionCandidate(previousActiveSession, Array.from(mergedSessions.values()))
  ) {
    activeSession = normalizeSession(previousActiveSession);
  } else {
    activeSession = null;
  }

  persistSessions();
  persistActiveSession();
  if (activeSession) {
    startTimerLoopIfNeeded();
  } else {
    stopTimerLoop();
  }

  const shouldHydrateActiveSessionForm = Boolean(activeSession) &&
    (!projectInput.value.trim() &&
      !taskInput.value.trim() &&
      !currentCategories.length &&
      !currentTags.length &&
      !notionInput.value.trim() &&
      !notesInput.value.trim()
      || activeSession?.id !== previousHydratedActiveSessionId);

  if (shouldHydrateActiveSessionForm) {
    hydrateFormFromActiveSession();
  }
  logStateLoss("hydrateRemoteState:after", {
    writer: "hydrateRemoteState",
    historyRowsCount: historyRows.length,
    activeRowsCount: activeRows.length,
  });
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
  const persistedRows = sessions.filter((session) => !isDemoSession(session));
  logStateLoss("persistSessions", {
    writer: "persistSessions",
    persistedCount: persistedRows.length,
  });
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedRows));
}

function persistActiveSession() {
  if (!activeSession) {
    window.localStorage.removeItem(ACTIVE_SESSION_KEY);
    return;
  }

  window.localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(activeSession));
}

async function loadServerBackedState({ silent = false } = {}) {
  logStateLoss("loadServerBackedState:begin", {
    writer: "loadServerBackedState",
    silent,
  });
  if (!window.supabase) {
    return false;
  }

  if (remoteStateLoadingPromise) {
    return remoteStateLoadingPromise;
  }

  remoteStateLoadingPromise = (async () => {
    const preferenceOwnerName = getSharedPreferenceOwnerName();
    const [historyResult, activeResult, repriseActionsResult, preferencesResult] = await Promise.allSettled([
      window.supabase.from("time_entries").select("*").order("created_at", { ascending: false }),
      window.supabase.from("active_sessions").select("*").order("updated_at", { ascending: false }),
      window.supabase.from("reprise_actions").select("*").order("updated_at", { ascending: false }),
      preferenceOwnerName
        ? window.supabase
            .from(UI_PREFERENCES_TABLE)
            .select("*")
            .eq("owner_user_name", preferenceOwnerName)
            .order("updated_at", { ascending: false })
        : Promise.resolve({ data: [], error: null }),
    ]);

    const historyOk = historyResult.status === "fulfilled" && !historyResult.value.error;
    const activeOk = activeResult.status === "fulfilled" && !activeResult.value.error;
    const repriseOk = repriseActionsResult.status === "fulfilled" && !repriseActionsResult.value.error;
    const rawPreferencesOk = preferencesResult.status === "fulfilled" && !preferencesResult.value.error;
    const preferencesMissingTable =
      preferencesResult.status === "fulfilled" && isMissingSharedPreferencesTableError(preferencesResult.value.error);
    const preferencesOk = rawPreferencesOk || preferencesMissingTable;

    const historyRows = historyOk ? historyResult.value.data ?? [] : null;
    const activeRows = activeOk ? activeResult.value.data ?? [] : null;
    const repriseActionRows = repriseOk ? repriseActionsResult.value.data ?? [] : null;
    const preferenceRows = rawPreferencesOk ? preferencesResult.value.data ?? [] : null;

    if (historyResult.status === "fulfilled" && historyResult.value.error) {
      console.warn("time_entries load failed:", historyResult.value.error);
    }
    if (activeResult.status === "fulfilled" && activeResult.value.error) {
      console.warn("active_sessions load failed:", activeResult.value.error);
    }
    if (repriseActionsResult.status === "fulfilled" && repriseActionsResult.value.error) {
      console.warn("reprise_actions load failed:", repriseActionsResult.value.error);
    }
    if (preferencesResult.status === "fulfilled" && preferencesResult.value.error && !preferencesMissingTable) {
      console.warn("user_ui_preferences load failed:", preferencesResult.value.error);
    }

    updateRemoteSyncStatus(
      {
        history: historyOk ? "ok" : "error",
        active: activeOk ? "ok" : "error",
        reprise: repriseOk ? "ok" : "error",
        preferences: preferencesOk ? "ok" : "error",
      },
      { silent },
    );

    if (!historyRows && !activeRows && !repriseActionRows && !preferenceRows) {
      remoteStateAvailable = false;
      logStateLoss("loadServerBackedState:empty-remote", {
        writer: "loadServerBackedState",
        silent,
      });
      return false;
    }

    logStateLoss("loadServerBackedState:before-hydrate", {
      writer: "loadServerBackedState",
      silent,
      historyRowsCount: historyRows?.length ?? 0,
      activeRowsCount: activeRows?.length ?? 0,
      repriseRowsCount: repriseActionRows?.length ?? 0,
      preferenceRowsCount: preferenceRows?.length ?? 0,
    });
    hydrateRemoteState(historyRows ?? [], activeRows ?? []);
    hydrateRepriseActions(repriseActionRows ?? repriseActions);
    hydrateSharedUiPreferences(preferenceRows ?? []);
    logStateLoss("loadServerBackedState:after-hydrate", {
      writer: "loadServerBackedState",
      silent,
      historyRowsCount: historyRows?.length ?? 0,
      activeRowsCount: activeRows?.length ?? 0,
      repriseRowsCount: repriseActionRows?.length ?? 0,
      preferenceRowsCount: preferenceRows?.length ?? 0,
    });
    remoteStateAvailable = historyOk || activeOk || repriseOk || preferencesOk;
    if (rawPreferencesOk) {
      await ensureSharedUiPreferencesBackfilled();
    }

    if (!silent) {
      render();
    }
    return true;
  })();

  const result = await remoteStateLoadingPromise;
  remoteStateLoadingPromise = null;
  return result;
}

function cancelActiveSessionServerSync() {
  if (!activeDraftSyncTimeoutId) {
    return;
  }
  window.clearTimeout(activeDraftSyncTimeoutId);
  activeDraftSyncTimeoutId = null;
}

function scheduleActiveSessionServerSync({ immediate = false } = {}) {
  if (!activeSession || !window.supabase) {
    return;
  }

  cancelActiveSessionServerSync();

  const scheduledSessionId = activeSession.id;
  const sync = () => {
    activeDraftSyncTimeoutId = null;
    if (!activeSession || activeSession.id !== scheduledSessionId) {
      return;
    }
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
    logStateLoss("startRemoteSyncLoop:tick", {
      writer: "startRemoteSyncLoop",
      intervalMs: REMOTE_SYNC_INTERVAL_MS,
    });
    void loadServerBackedState({ silent: false });
  }, REMOTE_SYNC_INTERVAL_MS);
}

function stopRemoteSyncLoop() {
  if (!remoteSyncIntervalId) {
    return;
  }
  window.clearInterval(remoteSyncIntervalId);
  remoteSyncIntervalId = null;
}

function isCurrentActiveSession(sessionLike) {
  if (!sessionLike || !activeSession) {
    return false;
  }
  return normalizeText(sessionLike.id ?? "") === normalizeText(activeSession.id ?? "");
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
  updateFieldManageButtons();
  applyProjectMemoryFromInput();
}

function resetComposerForm({ collaborator = "", hint = "Commencez à taper : un sujet déjà connu recharge automatiquement ses informations utiles." } = {}) {
  form.reset();
  collaboratorInput.value = collaborator;
  manualCollaboratorInput.value = collaborator;
  currentCategories = [];
  currentTags = [];
  projectInput.value = "";
  taskInput.value = "";
  notionInput.value = "";
  objectivePoleInput.value = "";
  objectiveOkrInput.value = "";
  objectiveKrInput.value = "";
  notesInput.value = "";
  delete projectInput.dataset.lastHydratedKey;
  projectMemoryHint.textContent = hint;
  renderCategoryTokens();
  renderTagTokens();
  renderObjectiveSelections();
  updateFieldManageButtons();
}

function setDefaultReportAnchor() {
  const today = formatDateInput(new Date());
  reportAnchorInput.value = today;
  if (personalCustomFromInput && !personalCustomFromInput.value) personalCustomFromInput.value = today;
  if (personalCustomToInput && !personalCustomToInput.value) personalCustomToInput.value = today;
}

function readFormValues() {
  const normalized = normalizeCategoryAndTags(currentCategories, currentTags);
  return {
    collaborator: getEffectiveCollaboratorValue(collaboratorInput.value),
    project: projectInput.value.trim(),
    task: taskInput.value.trim(),
    categories: normalized.categories,
    tags: normalized.tags,
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
    showFieldResolutionError(projectInput, "Choisissez ou saisissez un projet avant de démarrer.");
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
  setAuthStatusMessage("Choisissez votre nom pour lancer une session.", "warning");
  authRescueSelect?.focus();
}

function updateFieldManageButtons() {
  syncFieldManageButton(manageProjectButton, Boolean(projectInput.value.trim()));
  syncFieldManageButton(manageClientButton, Boolean(taskInput.value.trim()));
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
      title: "Gérer le projet",
      copy: "Vous pouvez modifier le projet courant ou le supprimer du contexte.",
      detail: projectInput.value.trim(),
      allowDelete: true,
    },
    client: {
      kind,
      title: "Gérer le client",
      copy: "Vous pouvez corriger le client courant ou l’effacer du contexte.",
      detail: taskInput.value.trim(),
      allowDelete: true,
    },
    category: {
      kind,
      title: "Gérer la catégorie",
      copy: "Vous pouvez modifier la catégorie choisie ou la retirer.",
      detail: currentCategories.join(", "),
      allowDelete: true,
    },
    tags: {
      kind,
      title: "Gérer les tags",
      copy: "Vous pouvez corriger les tags ou les retirer en une fois.",
      detail: currentTags.join(", "),
      allowDelete: true,
    },
    link: {
      kind,
      title: "Gérer le lien d'intérêt",
      copy: "Vous pouvez modifier ce lien ou le supprimer du contexte.",
      detail: notionInput.value.trim(),
      allowDelete: true,
    },
    pole: {
      kind,
      title: "Gérer le pôle",
      copy: "Vous pouvez corriger ce choix ici. La gestion du catalogue d’objectifs se fait ailleurs.",
      detail: objectivePoleInput.value.trim(),
      allowDelete: false,
    },
    okr: {
      kind,
      title: "Gérer l'OKR",
      copy: "Vous pouvez corriger ce choix ici. La gestion du catalogue d’objectifs se fait ailleurs.",
      detail: objectiveOkrInput.value.trim(),
      allowDelete: false,
    },
    kr: {
      kind,
      title: "Gérer le KR",
      copy: "Vous pouvez corriger ce choix ici. La gestion du catalogue d’objectifs se fait ailleurs.",
      detail: objectiveKrInput.value.trim(),
      allowDelete: false,
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
  const source = String(seed || "mordologie");
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
  const normalized = normalizeComparableText(label ?? "");
  if (!normalized) {
    return generateStableHexColor(fallbackSeed || label || "sans-categorie");
  }

  const catalogColor = referenceCatalog.categories.find(
    (item) => normalizeComparableText(item.activity_category_label ?? "") === normalized,
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
  const orderMap = getEffectiveReprisesOrderMap();
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
  void syncReprisesOrderPreferenceForCollaborator(collaborator, order);
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
  if (!canManageSharedCategoryColors()) {
    return false;
  }

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
  return true;
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

  const allowDelete = fieldManageState.allowDelete !== false;
  const allowCategoryColorEdit = fieldManageState.kind === "category" && canManageSharedCategoryColors();
  fieldManageDeleteButton.hidden = !allowDelete || fieldManageConfirmMode;
  fieldManageConfirmButton.hidden = !allowDelete || !fieldManageConfirmMode;
  if (fieldManageColorShell) {
    fieldManageColorShell.hidden = !allowCategoryColorEdit || fieldManageConfirmMode;
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
      "Commencez à taper : un sujet déjà connu recharge automatiquement ses informations utiles.";
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

  // If this exact timer is already represented by a pending local stop, do
  // nothing: the close is already in progress and must stay single-shot.
  if (matchesPendingStoppedSession(activeSession)) {
    logStopSync("stopActiveSession:idempotent-block", {
      sessionId: activeSession.id,
      collaborator: activeSession.collaborator,
      start: activeSession.start,
    });
    return;
  }

  const persistedMatch = findMatchingPersistedSessionForActive(activeSession);
  if (persistedMatch) {
    void dismissGhostActiveSession(activeSession, persistedMatch);
    return;
  }

  cancelActiveSessionServerSync();

  const end = getActiveSessionEffectiveEnd(activeSession);
  const durationMs = getActiveSessionDurationMs(activeSession);

  logStopSync("stopActiveSession:begin", {
    sessionId: activeSession.id,
    collaborator: activeSession.collaborator,
    start: activeSession.start,
    durationMs,
    pausedAt: activeSession.pausedAt || null,
  });

  const finishedSession = {
    ...activeSession,
    ...readFormValues(),
    pausedAt: null,
    end: end.toISOString(),
    durationMs,
    isServerActive: false,
  };

  const overlap = findOverlappingSession(finishedSession, activeSession.id);
  if (overlap && shouldBypassStopConflict(activeSession, finishedSession, overlap)) {
    setAuthStatusMessage("Conflit résiduel ignoré à l’arrêt. Vérifiez le journal ensuite.", "warning", { persistMs: 4200 });
    completeStoppedSessionLocally(finishedSession, "timer");
    return;
  }

  attemptSaveSession(finishedSession, {
    excludeId: activeSession.id,
    onSuccess: (sessionToSave) => {
      completeStoppedSessionLocally(sessionToSave, "timer");
    },
  });
}


async function initializeAuth() {
  const rescueName = loadStoredLocalRescueName();
  if (rescueName) {
    await applyLocalRescueAccess(rescueName, { silent: true });
    return;
  }
  render();
}

function setAuthStatusMessage(message = "", tone = "neutral", options = {}) {
  if (!authStatus) {
    return;
  }
  if (authStatusClearTimeoutId) {
    window.clearTimeout(authStatusClearTimeoutId);
    authStatusClearTimeoutId = null;
  }
  authStatus.textContent = message;
  authStatus.hidden = !message;
  if (authStatusShell) {
    authStatusShell.hidden = !message;
  }
  authStatus.dataset.tone = message ? tone : "";
  if (message && options.persistMs) {
    const expectedMessage = message;
    authStatusClearTimeoutId = window.setTimeout(() => {
      if (authStatus.textContent === expectedMessage) {
        setAuthStatusMessage("");
      }
    }, options.persistMs);
  }
}

function loadStoredLocalRescueName() {
  try {
    return window.localStorage.getItem(LOCAL_RESCUE_ACCESS_KEY) ?? "";
  } catch (error) {
    return "";
  }
}

function storeLocalRescueName(name) {
  try {
    window.localStorage.setItem(LOCAL_RESCUE_ACCESS_KEY, name);
  } catch (error) {
    // ignore storage issues
  }
}

function clearStoredLocalRescueName() {
  try {
    window.localStorage.removeItem(LOCAL_RESCUE_ACCESS_KEY);
  } catch (error) {
    // ignore storage issues
  }
}

function findKnownUserByName(rawName) {
  const normalizedName = normalizeText(rawName);
  if (!normalizedName) {
    return null;
  }
  return getKnownUsers().find((item) => normalizeText(item.user_name ?? "") === normalizedName) ?? null;
}

async function protectActiveSessionBeforeAccessChange(nextUserName = "") {
  const currentUserName = accessProfile.appUser?.user_name ?? "";
  const hasRunningSession =
    Boolean(activeSession) &&
    Boolean(currentUserName) &&
    normalizeText(activeSession?.collaborator ?? "") === normalizeText(currentUserName);

  if (!hasRunningSession || normalizeText(currentUserName) === normalizeText(nextUserName)) {
    return true;
  }

  setAuthStatusMessage("Synchronisation de la session en cours...", "neutral");
  const synced = await upsertActiveSessionToSupabase(activeSession);
  if (synced) {
    setAuthStatusMessage("Session en cours gardée et synchronisée.", "success", { persistMs: 3200 });
    return true;
  }

  const confirmed = await requestDecision({
    eyebrow: "Session en cours",
    title: "Changer de profil malgre tout",
    copy: "La session en cours n’a pas pu être synchronisée.",
    detail: "Quitter maintenant risque de masquer cette session sur cet appareil.",
    confirmLabel: "Quitter quand meme",
    tone: "danger",
  });
  if (!confirmed) {
    setAuthStatusMessage("Changement de profil annule.", "warning", { persistMs: 3200 });
  }
  return confirmed;
}

async function applyLocalRescueAccess(rawName, { silent = false } = {}) {
  const transitionAllowed = await protectActiveSessionBeforeAccessChange(rawName);
  if (!transitionAllowed) {
    return false;
  }

  const appUser = findKnownUserByName(rawName);
  if (!appUser) {
    if (!silent) {
      setAuthStatusMessage("Profil local introuvable.", "error");
    }
    return false;
  }

  const preservedLocalActiveSession =
    activeSession &&
    !activeSession.isServerBacked &&
    normalizeText(activeSession.collaborator ?? "") === normalizeText(appUser.user_name)
      ? normalizeSession(activeSession)
      : null;

  accessProfile = {
    mode: "local-rescue",
    role: appUser.role ?? "cadre",
    session: null,
    appUser,
  };
  activeSession = null;
  persistActiveSession();
  stopTimerLoop();
  stopRemoteSyncLoop();
  resetComposerForm({ collaborator: appUser.user_name });
  storeLocalRescueName(appUser.user_name);
  referenceCatalog.loaded = false;
  const catalogLoaded = await ensureReferenceCatalogLoaded(true);
  if (catalogLoaded) {
    const refreshedUser = findKnownUserByName(appUser.user_name) ?? appUser;
    accessProfile = {
      ...accessProfile,
      role: refreshedUser.role ?? accessProfile.role,
      appUser: refreshedUser,
    };
  }

  const remoteLoaded = await loadServerBackedState({ silent: true });
  if (window.supabase) {
    startRemoteSyncLoop();
  }
  if (remoteLoaded && pendingStoppedSessionState?.state === "pending") {
    void syncPendingStoppedSession({ fromRetry: true });
  }
  if (!activeSession && preservedLocalActiveSession) {
    activeSession = preservedLocalActiveSession;
    persistActiveSession();
    startTimerLoopIfNeeded();
  }
  setAuthStatusMessage(
    remoteLoaded ? "Profil chargé et synchronisé." : "Profil chargé en local. Synchronisation indisponible pour le moment.",
    remoteLoaded ? "success" : "warning",
    { persistMs: remoteLoaded ? 2600 : undefined },
  );
  // After login, leave the guide and go directly to the main view
  if (currentView === "guide") {
    currentView = "cadre";
    window.history.replaceState(null, "", "#cadre");
  }
  render();
  return true;
}

async function handleAuthSignOut() {
  const transitionAllowed = await protectActiveSessionBeforeAccessChange("");
  if (!transitionAllowed) {
    return;
  }

  clearStoredLocalRescueName();
  setAuthStatusMessage("");
  accessProfile = {
    mode: "open",
    role: "open",
    session: null,
    appUser: null,
  };
  activeSession = null;
  persistActiveSession();
  stopTimerLoop();
  stopRemoteSyncLoop();
  resetComposerForm();
  render();
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

function getAccessRole() {
  return accessProfile.role || "open";
}

function getKnownUsers() {
  if (referenceCatalog.users.length) {
    return [...referenceCatalog.users];
  }
  return [...LOCAL_PROFILE_DIRECTORY];
}

function getAllowedViewsForRole(role = getAccessRole()) {
  if (role === "open") {
    return ["guide"];
  }
  if (role === "cadre") {
    return ["cadre", "journal", "guide"];
  }
  if (role === "admin") {
    return ["cadre", "manager", "resources", "users", "journal", "guide"];
  }
  if (role === "manager") {
    return ["cadre", "manager", "resources", "journal", "guide"];
  }
  return ["cadre", "journal", "guide"];
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
  return false;
}

function canCreateSharedReferenceCatalog() {
  return false;
}

function canManageSharedCategoryColors() {
  const role = getAccessRole();
  return role === "manager" || role === "admin";
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

  let selectedCategoryLabel = normalizeCategorySelection(
    sessionDraft.categories?.[0] || project?.default_activity_category_label || "",
  ).category;
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
  if (!canCreateCollaboratorReference()) {
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
  if (!canCreateSharedReferenceCatalog()) {
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
    normalizeCategorySelection(defaultCategoryLabel).category,
  );

  const payload = {
    project_id: nextId,
    project_name: projectName,
    client_name: "À renseigner",
    status: "active",
    default_activity_category_id: defaultCategory?.activity_category_id ?? null,
    default_activity_category_label: normalizeCategorySelection(defaultCategory?.activity_category_label ?? "").category || null,
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
  const categoryLabel = normalizeCategorySelection(rawLabel).category;
  if (!categoryLabel) {
    return null;
  }
  if (!canCreateSharedReferenceCatalog()) {
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
  const normalizer = labelField === "activity_category_label" ? normalizeComparableText : normalizeText;
  const normalized = normalizer(rawValue ?? "");
  if (!normalized) {
    return null;
  }

  const exact = rows.find((row) => normalizer(row[labelField] ?? "") === normalized);
  if (exact) {
    return exact;
  }

  const startsWithMatches = rows.filter((row) => normalizer(row[labelField] ?? "").startsWith(normalized));
  return startsWithMatches.length === 1 ? startsWithMatches[0] : null;
}

function buildCanonicalSessionDraft(sessionDraft, resolved) {
  const normalizedCategories = resolved.category
    ? [normalizeCategorySelection(resolved.category.activity_category_label).category]
    : resolved.selectedCategoryLabel
      ? [resolved.selectedCategoryLabel]
      : sessionDraft.categories.slice(0, 1);
  const normalizedMeta = normalizeCategoryAndTags(normalizedCategories, sessionDraft.tags ?? []);

  return {
    ...sessionDraft,
    collaborator: resolved.user?.user_name ?? sessionDraft.collaborator,
    project: resolved.project?.project_name ?? sessionDraft.project,
    categories: normalizedMeta.categories,
    tags: normalizedMeta.tags,
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
  currentTags = [...(sessionDraft.tags ?? [])];
  renderCategoryTokens();
  renderTagTokens();
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
    currentCategories = [normalizeCategorySelection(resolved.project.default_activity_category_label).category];
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
      currentCategories = [normalizeCategorySelection(resolved.category.activity_category_label).category];
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
    const normalized = normalizeCategoryAndTags([resolved.category.activity_category_label], currentTags);
    currentCategories = normalized.categories;
    currentTags = normalized.tags;
    renderCategoryTokens();
    renderTagTokens();
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

  const normalizedCategory = normalizeCategorySelection(resolved.selectedCategoryLabel ?? session.categories?.[0] ?? "");

  if (!resolved.loaded && !fallbackUser) {
    return null;
  }

  return {
    user: resolved.user ?? fallbackUser,
    project,
    category,
    selectedCategoryLabel: normalizedCategory.category,
  };
}

function isValidTimeEntryId(value) {
  return /^TE-[0-9]{6}$/.test(String(value ?? ""));
}

function buildFallbackTimeEntryId() {
  const numeric = (Date.now() + Math.floor(Math.random() * 1000)) % 1000000;
  return `TE-${String(numeric).padStart(6, "0")}`;
}

async function getNextTimeEntryId() {
  const nextId = await getNextPrefixedId("time_entries", "time_entry_id", "TE-", 6);
  if (isValidTimeEntryId(nextId)) {
    return nextId;
  }
  return buildFallbackTimeEntryId();
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

function normalizeTimeEntrySource(source = "manual") {
  const raw = String(source ?? "").trim().toLowerCase();
  if (!raw) {
    return "manual";
  }
  if (raw.includes("timer")) {
    return "timer";
  }
  if (raw.includes("quick")) {
    return "quick";
  }
  return "manual";
}

async function buildTimeEntryPayloadFromSession(session, source = "manual") {
  const references = await resolveSessionReferences(session);
  if (!references) {
    return null;
  }

  const existingTimeEntryId = isValidTimeEntryId(session.dbTimeEntryId) ? session.dbTimeEntryId : null;
  const timeEntryId = existingTimeEntryId ?? (await getNextTimeEntryId());
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
    activity_category_label:
      normalizeCategorySelection(references.category?.activity_category_label ?? session.categories?.[0] ?? "").category || null,
    kpi_category_label: references.category?.kpi_category_label ?? session.dbKpiCategoryLabel ?? null,
    duration_minutes: Math.max(1, Math.round(durationMs / 60000)),
    duration_hours: Number((durationMs / 3600000).toFixed(2)),
    task_label: session.task || "",
    tags_text: dedupePreservingOrder((session.tags ?? []).map(normalizeTag)).join(", "),
    notion_ref: session.notionRef || "",
    objective_pole: session.objectivePole || "",
    objective_okr: session.objectiveOkr || "",
    objective_kr: session.objectiveKr || "",
    notes: session.notes || "",
    source: normalizeTimeEntrySource(source),
    status: "saved",
  };
}

async function executeSupabaseMutation({
  queryFactory,
  unavailableMessage = "",
  unavailableTone = "warning",
  errorLogLabel,
  errorMessage,
  unexpectedErrorMessage = null,
  refreshAfterSuccess = true,
  onSuccess = null,
}) {
  if (!window.supabase) {
    if (unavailableMessage) {
      setAuthStatusMessage(unavailableMessage, unavailableTone);
    }
    return false;
  }

  try {
    const result = await queryFactory(window.supabase);
    if (result?.error) {
      console.warn(`${errorLogLabel}:`, result.error);
      setAuthStatusMessage(errorMessage, "error");
      return false;
    }
    if (onSuccess) {
      onSuccess(result);
    }
    if (refreshAfterSuccess) {
      await loadServerBackedState({ silent: false });
    }
    return true;
  } catch (error) {
    console.error(`Unexpected ${errorLogLabel}:`, error);
    setAuthStatusMessage(unexpectedErrorMessage || errorMessage, "error");
    return false;
  }
}

async function syncSessionToSupabase(session, source = "manual", options = {}) {
  const payload = await buildTimeEntryPayloadFromSession(session, source);
  if (!payload) {
    setAuthStatusMessage("Impossible de preparer l'enregistrement serveur pour cette session.", "error");
    return false;
  }

  return createTimeEntry(payload, {
    updateExisting: Boolean(session.dbTimeEntryId),
    refreshAfterSuccess: options.refreshAfterSuccess,
  });
}

async function createTimeEntry(data, options = {}) {
  return executeSupabaseMutation({
    queryFactory: (supabase) => {
      const query = options.updateExisting
        ? supabase
            .from("time_entries")
            .update({
              ...data,
              updated_at: new Date().toISOString(),
            })
            .eq("time_entry_id", data.time_entry_id)
            .select()
        : supabase
            .from("time_entries")
            .upsert([data], { onConflict: "time_entry_id" })
            .select();
      return query;
    },
    errorLogLabel: "time_entries mutation failed",
    errorMessage: "Enregistrement serveur impossible pour le moment.",
    unexpectedErrorMessage: "Erreur inattendue pendant l'enregistrement serveur.",
    refreshAfterSuccess: options.refreshAfterSuccess ?? true,
    onSuccess: () => syncEntryToNotion(data),
  });
}

function syncEntryToNotion(entry) {
  fetch("/api/notion-sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ entry }),
  }).catch(() => {});
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
    activity_category_label:
      normalizeCategorySelection(references?.category?.activity_category_label ?? session.categories?.[0] ?? "").category || null,
    kpi_category_label: references?.category?.kpi_category_label ?? session.dbKpiCategoryLabel ?? null,
    task_label: session.task || "",
    tags_text: dedupePreservingOrder((session.tags ?? []).map(normalizeTag)).join(", "),
    notion_ref: session.notionRef || "",
    objective_pole: session.objectivePole || "",
    objective_okr: session.objectiveOkr || "",
    objective_kr: session.objectiveKr || "",
    notes: session.notes || "",
    updated_at: new Date().toISOString(),
  };
}

async function upsertActiveSessionToSupabase(session) {
  if (!session) {
    return false;
  }
  if (shouldBlockActiveSessionSync(session)) {
    return false;
  }

  const payload = await buildActiveSessionPayload(session);
  if (!payload) {
    setAuthStatusMessage("Impossible de synchroniser cette session en cours.", "error");
    return false;
  }

  // Purge stale rows for this user before upserting. Without a unique index
  // on user_id, every new active_session_id would INSERT a duplicate row
  // instead of replacing the existing one.
  if (window.supabase && payload.active_session_id) {
    try {
      if (payload.user_id) {
        await window.supabase
          .from("active_sessions")
          .delete()
          .eq("user_id", payload.user_id)
          .neq("active_session_id", payload.active_session_id);
      } else if (payload.user_name) {
        await window.supabase
          .from("active_sessions")
          .delete()
          .eq("user_name", payload.user_name)
          .neq("active_session_id", payload.active_session_id);
      }
    } catch (_) {
      // best-effort; proceed with upsert regardless
    }
  }

  // Use user_id as conflict key when the unique index exists (post-migration).
  // Falls back to active_session_id if user_id is absent (pre-migration safety).
  const activeSessionConflictKey = payload.user_id ? "user_id" : "active_session_id";

  return executeSupabaseMutation({
    queryFactory: (supabase) =>
      supabase.from("active_sessions").upsert([payload], { onConflict: activeSessionConflictKey }),
    unavailableMessage: "Synchronisation indisponible pour cette session en cours.",
    unavailableTone: "warning",
    errorLogLabel: "active_sessions upsert failed",
    errorMessage: "Synchronisation de la session en cours impossible.",
  });
}

async function removeActiveSessionFromSupabase(sessionId, options = {}) {
  if (!sessionId) {
    return false;
  }

  return executeSupabaseMutation({
    queryFactory: (supabase) => supabase.from("active_sessions").delete().eq("active_session_id", sessionId),
    errorLogLabel: "active_sessions delete failed",
    errorMessage: "Impossible de nettoyer la session active sur le serveur.",
    refreshAfterSuccess: options.refreshAfterSuccess ?? true,
  });
}

async function removeStoppedSessionGhostsFromSupabase(session, options = {}) {
  if (!window.supabase || !session) {
    return false;
  }

  const collaborator = String(session.collaborator ?? "").trim();
  const sessionStart = String(session.start ?? "").trim();
  const candidateIds = dedupePreservingOrder([
    session.dbActiveSessionId,
    session.id,
  ].filter(Boolean));

  try {
    let removedAny = false;

    for (const activeSessionId of candidateIds) {
      const { error } = await window.supabase
        .from("active_sessions")
        .delete()
        .eq("active_session_id", activeSessionId);
      if (error) {
        console.warn("active_sessions ghost delete by id failed:", error);
        setAuthStatusMessage("Impossible de nettoyer la session active sur le serveur.", "error");
        return false;
      }
      removedAny = true;
    }

    // No targeted IDs available: the remote row doesn't exist or was never
    // pushed. No error means the active session is already gone — treat as done.
    if (!removedAny && candidateIds.length === 0) {
      removedAny = true;
    }

    if (collaborator && sessionStart) {
      const { error } = await window.supabase
        .from("active_sessions")
        .delete()
        .eq("user_name", collaborator)
        .eq("started_at", sessionStart);
      if (error) {
        console.warn("active_sessions ghost delete by identity failed:", error);
        setAuthStatusMessage("Impossible de nettoyer la session active sur le serveur.", "error");
        return false;
      }
      removedAny = true;
    }

    // Sweep older ghost rows for the same user that survived the targeted
    // deletes above (duplicate active_sessions with different IDs/timestamps).
    // Use user_id as the primary sweep key; fall back to user_name.
    // A successful sweep (no error) also marks removedAny to unblock
    // a pending stop that had no specific ID to target.
    const sweepUserId = typeof session.dbUserId === "string" ? session.dbUserId.trim() : "";
    if (sessionStart && (sweepUserId || collaborator)) {
      try {
        const sweepQuery = sweepUserId
          ? window.supabase.from("active_sessions").delete().eq("user_id", sweepUserId).lt("started_at", sessionStart)
          : window.supabase.from("active_sessions").delete().eq("user_name", collaborator).lt("started_at", sessionStart);
        const { error: sweepError } = await sweepQuery;
        if (!sweepError) {
          removedAny = true;
        }
      } catch (_) {
        // supplementary cleanup — ignore errors
      }
    }

    if (removedAny && (options.refreshAfterSuccess ?? true)) {
      await loadServerBackedState({ silent: false });
    }
    return removedAny;
  } catch (error) {
    console.error("Unexpected active_sessions ghost cleanup failed:", error);
    setAuthStatusMessage("Impossible de nettoyer la session active sur le serveur.", "error");
    return false;
  }
}

async function removeTimeEntryFromSupabase(timeEntryId) {
  if (!timeEntryId) {
    return false;
  }

  return executeSupabaseMutation({
    queryFactory: (supabase) => supabase.from("time_entries").delete().eq("time_entry_id", timeEntryId),
    errorLogLabel: "time_entries delete failed",
    errorMessage: "Suppression serveur impossible pour cette entrée.",
  });
}

async function finalizeStoppedSessionOnSupabase(session, source = "timer") {
  const pendingOps = buildPendingStopOpsState(pendingStoppedSessionState?.pendingOps);
  const remoteActiveSessionId = pendingStoppedSessionState?.remoteActiveSessionId ?? session.dbActiveSessionId ?? session.id;
  logStopSync("finalizeStoppedSessionOnSupabase:start", {
    sessionId: session.id,
    dbTimeEntryId: session.dbTimeEntryId,
    remoteActiveSessionId,
    pendingOps,
    source,
  });

  let historySaved = pendingOps.create_entry === "done";
  if (!historySaved) {
    historySaved = await syncSessionToSupabase(session, source, { refreshAfterSuccess: false });
    if (!historySaved) {
      return {
        historySaved: false,
        activeRemoved: false,
      };
    }
  }

  let activeRemoved = pendingOps.stop_active === "done";
  if (!activeRemoved) {
    activeRemoved = await removeStoppedSessionGhostsFromSupabase({
      ...session,
      dbActiveSessionId: remoteActiveSessionId,
    }, { refreshAfterSuccess: false });
  }

  remoteActiveSessions = remoteActiveSessions.filter((item) => {
    if (item.dbActiveSessionId && session.dbActiveSessionId && item.dbActiveSessionId === session.dbActiveSessionId) {
      return false;
    }
    if (item.id && session.id && item.id === session.id) {
      return false;
    }
    return !(
      normalizeText(item.collaborator) === normalizeText(session.collaborator) &&
      String(item.start ?? "") === String(session.start ?? "")
    );
  });

  await loadServerBackedState({ silent: false });

  // If the targeted delete reported failure but the remote row is no longer
  // present after the reload (swept by another device, DB cleanup, or the
  // ghost sweep above), treat stop_active as done so the pending stop does
  // not loop forever waiting for a non-existent row.
  if (!activeRemoved) {
    const stillPresent = remoteActiveSessions.some(
      (item) => normalizeText(item.collaborator ?? "") === normalizeText(session.collaborator ?? ""),
    );
    if (!stillPresent) {
      activeRemoved = true;
    }
  }

  if (!activeRemoved) {
    console.warn("Active session cleanup incomplete after stop; keeping local closure authoritative.", session);
  }

  logStopSync("finalizeStoppedSessionOnSupabase:done", {
    sessionId: session.id,
    historySaved,
    activeRemoved,
  });

  return {
    historySaved,
    activeRemoved,
  };
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
    ["categories", "Catégorie"],
    ["tags", "Tags"],
    ["notionRef", "Lien d'intérêt"],
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


function resetFormAfterStop() {
  const lastCollaborator = collaboratorInput.value.trim();
  resetComposerForm({
    collaborator: lastCollaborator,
    hint: "Commencez à taper : un sujet déjà connu recharge automatiquement ses informations utiles.",
  });
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

function openManualDialog(session = null, preset = null) {
  const end = preset?.end ? new Date(preset.end) : new Date();
  const start = preset?.start ? new Date(preset.start) : new Date(end.getTime() - 30 * 60 * 1000);

  manualEditingSessionId = session?.id ?? null;
  setManualDialogStatus("");
  manualCollaboratorInput.value =
    session?.collaborator ?? preset?.collaborator ?? collaboratorInput.value.trim();
  manualProjectInput.value = session?.project ?? preset?.project ?? projectInput.value.trim();
  manualTaskInput.value = session?.task ?? preset?.task ?? taskInput.value.trim();
  manualCategoriesInput.value = (session?.categories ?? preset?.categories ?? currentCategories).join(", ");
  manualCurrentTags = dedupePreservingOrder(session?.tags ?? preset?.tags ?? currentTags);
  manualTagsInput.value = "";
  manualNotionInput.value = session?.notionRef ?? preset?.notionRef ?? notionInput.value.trim();
  manualObjectivePoleInput.value = session?.objectivePole ?? preset?.objectivePole ?? objectivePoleInput.value.trim();
  manualObjectiveOkrInput.value = session?.objectiveOkr ?? preset?.objectiveOkr ?? objectiveOkrInput.value.trim();
  manualObjectiveKrInput.value = session?.objectiveKr ?? preset?.objectiveKr ?? objectiveKrInput.value.trim();
  manualNotesInput.value = session?.notes ?? preset?.notes ?? notesInput.value.trim();
  const startDateValue = session ? new Date(session.start) : start;
  const endDateValue = session ? new Date(session.end) : end;
  setDateTimeFieldValue(manualStartDateInput, manualStartTimeInput, startDateValue);
  setDateTimeFieldValue(manualEndDateInput, manualEndTimeInput, endDateValue);
  updateManualTimingCardTitles(startDateValue, endDateValue);
  syncManualDurationFromBounds();
  if (deleteManualButton) {
    deleteManualButton.hidden = !session;
  }
  saveManualButton.textContent = session ? "Enregistrer les changements" : "Enregistrer";
  renderManualTagTokens();
  renderObjectiveSelections();
  manualDialog.showModal();
}

function formatManualCardDate(dateValue) {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

function updateManualTimingCardTitles(startDate, endDate) {
  if (manualStartCardTitle) {
    const label = formatManualCardDate(startDate);
    manualStartCardTitle.textContent = label ? `Debut · ${label}` : "Debut";
  }
  if (manualEndCardTitle) {
    const label = formatManualCardDate(endDate);
    manualEndCardTitle.textContent = label ? `Fin · ${label}` : "Fin";
  }
}

function shouldFinalizeActiveSessionFromManualEdit(originalSession, editedSession) {
  if (!originalSession || !editedSession) {
    return false;
  }

  const effectiveEndMs = getActiveSessionEffectiveEnd(originalSession).getTime();
  const editedEndMs = new Date(editedSession.end).getTime();
  if (Number.isNaN(effectiveEndMs) || Number.isNaN(editedEndMs)) {
    return false;
  }

  const endDeltaMs = Math.abs(editedEndMs - effectiveEndMs);
  const sameMinuteWindow = endDeltaMs < 2 * 60 * 1000;
  const samePausedState = Boolean(originalSession.pausedAt) && editedEndMs === new Date(originalSession.pausedAt).getTime();

  return !(sameMinuteWindow || samePausedState);
}

function saveManualEntry() {
  setManualDialogStatus("");
  const collaborator = getEffectiveCollaboratorValue(manualCollaboratorInput.value);
  const project = manualProjectInput.value.trim();
  const start = readDateTimeFieldValue(manualStartDateInput, manualStartTimeInput);
  const end = readDateTimeFieldValue(manualEndDateInput, manualEndTimeInput);

  if (!collaborator) {
    setManualDialogStatus("Choisissez votre nom pour enregistrer cette entrée.", "warning");
    showAuthRequiredMessage();
    return;
  }
  if (!project) {
    setManualDialogStatus("Le sujet est requis pour enregistrer cette entrée.", "error");
    manualProjectInput.focus();
    return;
  }
  if (!start || !end) {
    setManualDialogStatus("Renseignez une date et une heure de debut et de fin.", "error");
    (manualStartDateInput.value ? manualEndTimeInput : manualStartDateInput)?.focus();
    return;
  }
  const durationMs = end.getTime() - start.getTime();
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || durationMs <= 0) {
    setManualDialogStatus("L'heure de fin doit etre posterieure au debut.", "error");
    manualEndTimeInput.focus();
    return;
  }

  const editingSession = manualEditingSessionId
    ? findSessionById(manualEditingSessionId) ?? null
    : null;

  const manualSession = {
    id: manualEditingSessionId ?? createSessionId(),
    dbTimeEntryId: editingSession?.dbTimeEntryId ?? null,
    collaborator,
    project,
    task: manualTaskInput.value.trim(),
    ...normalizeCategoryAndTags(
      parseTokenString(manualCategoriesInput.value),
      dedupePreservingOrder([...manualCurrentTags, ...parseTokenString(manualTagsInput.value)]),
    ),
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
    manualEditingSessionId && isCurrentActiveSession({ id: manualEditingSessionId }) ? activeSession : null;

  if (activeSessionBeingEdited) {
    if (shouldFinalizeActiveSessionFromManualEdit(activeSessionBeingEdited, manualSession)) {
      const finishedSession = normalizeSession({
        ...activeSessionBeingEdited,
        ...manualSession,
        pausedAt: null,
        pausedDurationMs: Number(activeSessionBeingEdited.pausedDurationMs) || 0,
        isServerActive: false,
      });

      attemptSaveSession(finishedSession, {
        excludeId: manualEditingSessionId,
        onSuccess: (sessionToSave) => {
          manualEditingSessionId = null;
          manualDialog.close();
          saveManualButton.textContent = "Enregistrer";
          renderObjectiveSelections();
          void logSessionChange(activeSessionBeingEdited, sessionToSave, "manual-edit-active-stop");
          void completeStoppedSessionLocally(sessionToSave, "manual-edit-active");
        },
      });
      return;
    }

    const nextActiveSession = normalizeSession({
      ...activeSessionBeingEdited,
      ...manualSession,
      pausedAt: activeSessionBeingEdited.pausedAt ?? null,
      pausedDurationMs: Number(activeSessionBeingEdited.pausedDurationMs) || 0,
      isServerActive: true,
    });
    activeSession = nextActiveSession;
    persistActiveSession();
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
      upsertSession({ ...sessionToSave, syncStatus: "pending_update" });
      persistSessions();
      void logSessionChange(editingSession, sessionToSave, editingSession ? "manual-edit" : "manual-create");
      void (async () => {
        const ok = await syncSessionToSupabase(sessionToSave, "manual", { refreshAfterSuccess: false });
        if (ok) {
          const stored = sessions.find((s) => s.id === sessionToSave.id);
          if (stored?.syncStatus === "pending_update") {
            upsertSession({ ...stored, syncStatus: "synced" });
            persistSessions();
          }
          await loadServerBackedState({ silent: true });
          render();
        }
      })();
      showSaveToast(sessionToSave, { label: editingSession ? "Modifié" : "Enregistré" });
      manualEditingSessionId = null;
      manualDialog.close();
      saveManualButton.textContent = "Enregistrer";
      renderObjectiveSelections();
      render();
    },
  });
}

async function deleteSession(session) {
  if (!session) {
    return false;
  }

  const hasHistoricalEntry = Boolean(session.dbTimeEntryId || session.end);
  const hasRemoteActiveGhost =
    Boolean(session.dbActiveSessionId || session.isServerActive) ||
    getPersistedActiveSessions().some((item) => item.id === session.id);

  if (hasRemoteActiveGhost) {
    const removedGhost = await removeStoppedSessionGhostsFromSupabase(session, { refreshAfterSuccess: false });
    if (!removedGhost && !hasHistoricalEntry) {
      return false;
    }
    if (activeSession?.id === session.id) {
      activeSession = null;
      resetComposerForm({ collaborator: getCurrentCollaborator() });
      persistActiveSession();
      stopTimerLoop();
      renderActiveSession();
    }
    remoteActiveSessions = remoteActiveSessions.filter((item) => item.id !== session.id);
  }

  if (session.dbTimeEntryId) {
    const removed = await removeTimeEntryFromSupabase(session.dbTimeEntryId);
    if (!removed) {
      return false;
    }
  }

  if (pendingStoppedSessionState?.session && areSessionsEffectivelySame(pendingStoppedSessionState.session, session)) {
    clearPendingStoppedSessionState();
  }

  sessions = sessions.filter((item) => item.id !== session.id);
  persistSessions();
  render();
  return true;
}

function attemptSaveSession(session, options = {}) {
  const duplicate = findExactDuplicate(session, options.excludeId);
  if (duplicate) {
    showConflict(session, duplicate, options.onSuccess);
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

function areSessionsEffectivelySame(left, right) {
  if (!left || !right) {
    return false;
  }

  if (left.id && right.id && left.id === right.id) {
    return true;
  }

  if (left.dbTimeEntryId && right.dbTimeEntryId && left.dbTimeEntryId === right.dbTimeEntryId) {
    return true;
  }

  if (left.dbActiveSessionId && right.dbActiveSessionId && left.dbActiveSessionId === right.dbActiveSessionId) {
    return true;
  }

  const sameCollaborator = normalizeText(left.collaborator) === normalizeText(right.collaborator);
  const sameStartIdentity = getSessionStartIdentity(left.start) && getSessionStartIdentity(left.start) === getSessionStartIdentity(right.start);
  if (sameCollaborator && sameStartIdentity) {
    return true;
  }

  const leftStart = new Date(left.start).getTime();
  const rightStart = new Date(right.start).getTime();
  const leftEnd = new Date(left.end).getTime();
  const rightEnd = new Date(right.end).getTime();

  if (
    Number.isNaN(leftStart) ||
    Number.isNaN(rightStart) ||
    Number.isNaN(leftEnd) ||
    Number.isNaN(rightEnd)
  ) {
    return false;
  }

  const sameProject = normalizeText(left.project) === normalizeText(right.project);
  const sameTask = normalizeText(left.task) === normalizeText(right.task);
  const sameBounds = Math.abs(leftStart - rightStart) < 60000 && Math.abs(leftEnd - rightEnd) < 60000;

  return sameCollaborator && sameProject && sameTask && sameBounds;
}

function findOverlappingSession(session, excludeId = null, { closedOnly = false } = {}) {
  const start = new Date(session.start).getTime();
  const end = new Date(session.end).getTime();
  const collaboratorKey = normalizeText(session.collaborator);
  const pool = closedOnly ? getSessionsWithPendingStopped() : getAllSessionsWithActive();

  return (
    pool.find((existing) => {
      if (existing.id === excludeId) {
        return false;
      }
      if (areSessionsEffectivelySame(existing, session)) {
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

function findExactDuplicate(session, excludeId = null) {
  if (!session) return null;
  const startMs = new Date(session.start).getTime();
  const endMs = new Date(session.end).getTime();
  if (Number.isNaN(startMs) || Number.isNaN(endMs)) return null;

  const collaboratorKey = normalizeText(session.collaborator ?? "");
  const projectKey = normalizeText(session.project ?? "");
  const taskKey = normalizeText(session.task ?? "");
  const categoryKey = normalizeText((Array.isArray(session.categories) ? session.categories[0] : null) ?? "");
  const poleKey = normalizeText(session.objectivePole ?? "");
  const okrKey = normalizeText(session.objectiveOkr ?? "");
  const krKey = normalizeText(session.objectiveKr ?? "");
  // When editing (excludeId set), also exclude by dbTimeEntryId — after a Supabase sync,
  // loadServerBackedState may create a new local copy with a different id but the same
  // dbTimeEntryId, which would otherwise be wrongly flagged as a duplicate.
  const excludeDbId = excludeId ? (session.dbTimeEntryId ?? null) : null;

  return getSessionsWithPendingStopped().find((existing) => {
    if (!existing || existing.id === excludeId) return false;
    if (excludeDbId && existing.dbTimeEntryId === excludeDbId) return false;
    if (session.dbTimeEntryId && existing.dbTimeEntryId && session.dbTimeEntryId === existing.dbTimeEntryId) return true;
    if (session.dbActiveSessionId && existing.dbActiveSessionId && !existing.isServerActive
        && session.dbActiveSessionId === existing.dbActiveSessionId) return true;
    if (normalizeText(existing.collaborator ?? "") !== collaboratorKey) return false;
    if (normalizeText(existing.project ?? "") !== projectKey) return false;
    if (normalizeText(existing.task ?? "") !== taskKey) return false;
    if (normalizeText((Array.isArray(existing.categories) ? existing.categories[0] : null) ?? "") !== categoryKey) return false;
    if (normalizeText(existing.objectivePole ?? "") !== poleKey) return false;
    if (normalizeText(existing.objectiveOkr ?? "") !== okrKey) return false;
    if (normalizeText(existing.objectiveKr ?? "") !== krKey) return false;
    const existingStart = new Date(existing.start).getTime();
    const existingEnd = new Date(existing.end).getTime();
    if (Number.isNaN(existingStart) || Number.isNaN(existingEnd)) return false;
    return Math.abs(startMs - existingStart) < 60000 && Math.abs(endMs - existingEnd) < 60000;
  }) ?? null;
}

function showConflict(newSession, existingSession, onResolve) {
  pendingConflict = { newSession, existingSession, onResolve };
  const adjusted = getAdjustedSession(newSession, existingSession);
  conflictMessage.textContent =
    "Une entrée identique existe déjà pour ce cargonaute.";
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

function shouldBypassStopConflict(activeLike, finishedSession, overlap) {
  if (!activeLike || !finishedSession || !overlap) {
    return false;
  }
  if (normalizeText(overlap.collaborator) !== normalizeText(finishedSession.collaborator)) {
    return false;
  }

  const sameStartIdentity = getSessionStartIdentity(activeLike.start) === getSessionStartIdentity(overlap.start);
  if (sameStartIdentity) {
    return true;
  }

  if (overlap.isServerBacked && overlap.dbTimeEntryId) {
    const activeStart = new Date(activeLike.start).getTime();
    const finishedStart = new Date(finishedSession.start).getTime();
    const overlapStart = new Date(overlap.start).getTime();
    const overlapEnd = new Date(overlap.end).getTime();
    if ([activeStart, finishedStart, overlapStart, overlapEnd].some(Number.isNaN)) {
      return false;
    }
    const overlapStartedLongBefore = overlapStart + 60 * 60 * 1000 <= finishedStart;
    const noFreePart = !getAdjustedSession(finishedSession, overlap);
    if (overlapStartedLongBefore && noFreePart) {
      return true;
    }
  }

  const persistedMatch = findMatchingPersistedSessionForActive(activeLike);
  if (!persistedMatch) {
    return false;
  }

  if (!areSessionsEffectivelySame(persistedMatch, overlap)) {
    return false;
  }

  const persistedEnd = new Date(persistedMatch.end).getTime();
  const activeStart = new Date(activeLike.start).getTime();
  if ([persistedEnd, activeStart].some(Number.isNaN)) {
    return true;
  }

  return persistedEnd >= activeStart;
}

function setDateTimeFieldValue(dateInput, timeInput, date) {
  if (!dateInput || !timeInput || !(date instanceof Date) || Number.isNaN(date.getTime())) {
    return;
  }
  dateInput.value = formatDateInput(date);
  timeInput.value = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function readDateTimeFieldValue(dateInput, timeInput) {
  if (!dateInput?.value) {
    return null;
  }
  const timeValue = timeInput?.value || "00:00";
  const candidate = new Date(`${dateInput.value}T${timeValue.length === 5 ? timeValue : timeValue.slice(0, 5)}:00`);
  return Number.isNaN(candidate.getTime()) ? null : candidate;
}

function formatDurationInputValue(durationMs) {
  const hours = Math.max(Number(durationMs) || 0, 0) / 3600000;
  if (!hours) {
    return "";
  }
  if (Math.abs(hours - Math.round(hours)) < 0.001) {
    return String(Math.round(hours));
  }
  if (Math.abs(hours * 2 - Math.round(hours * 2)) < 0.001) {
    return String(Math.round(hours * 2) / 2).replace(".", ",");
  }
  return hours.toFixed(2).replace(".", ",");
}

function parseDurationInputHours(rawValue) {
  const raw = (rawValue ?? "").trim().toLowerCase().replace(/\s+/g, "");
  if (!raw) {
    return null;
  }

  if (raw.includes("h")) {
    const [hoursPart, minutesPart = "0"] = raw.split("h");
    const hours = Number(hoursPart.replace(",", "."));
    const minutes = Number(minutesPart.replace(",", "."));
    if (Number.isFinite(hours) && Number.isFinite(minutes)) {
      const total = hours + minutes / 60;
      return total > 0 ? total : null;
    }
  }

  if (raw.includes(":")) {
    const [hoursPart, minutesPart = "0"] = raw.split(":");
    const hours = Number(hoursPart.replace(",", "."));
    const minutes = Number(minutesPart.replace(",", "."));
    if (Number.isFinite(hours) && Number.isFinite(minutes)) {
      const total = hours + minutes / 60;
      return total > 0 ? total : null;
    }
  }

  const decimal = Number(raw.replace(",", "."));
  return Number.isFinite(decimal) && decimal > 0 ? decimal : null;
}

function syncManualDurationFromBounds() {
  if (manualTimingSyncLocked || !manualDurationInput) {
    return;
  }

  const start = readDateTimeFieldValue(manualStartDateInput, manualStartTimeInput);
  const end = readDateTimeFieldValue(manualEndDateInput, manualEndTimeInput);
  if (!start || !end || end <= start) {
    return;
  }

  manualTimingSyncLocked = true;
  manualDurationInput.value = formatDurationInputValue(end.getTime() - start.getTime());
  manualTimingSyncLocked = false;
}

function syncManualEndFromDuration() {
  if (manualTimingSyncLocked) {
    return;
  }

  const start = readDateTimeFieldValue(manualStartDateInput, manualStartTimeInput);
  const durationHours = parseDurationInputHours(manualDurationInput?.value);
  if (!start || !durationHours) {
    return;
  }

  const end = new Date(start.getTime() + durationHours * 3600000);
  manualTimingSyncLocked = true;
  setDateTimeFieldValue(manualEndDateInput, manualEndTimeInput, end);
  manualTimingSyncLocked = false;
}

function startTimerLoopIfNeeded() {
  if (!activeSession || activeSession.pausedAt || timerIntervalId) {
    return;
  }

  timerIntervalId = window.setInterval(() => {
    updateLiveTimer();
    renderVisibleLiveViews();
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

function renderVisibleLiveViews() {
  if (currentView === "cadre") {
    renderCadreViews();
    return;
  }
  if (currentView === "manager") {
    renderManagerViews();
    return;
  }
  if (currentView === "resources") {
    renderResourcesViews();
  }
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
  renderTagManager();
  renderSessionList();
  renderSyncButton();
  renderCadreViews();
  renderManagerControls();
  renderManagerViews();
  renderResourcesViews();
  renderUsersAdmin();
  renderGuideView();
}

function renderCurrentUserContext() {
  // The active identity is handled by the auth shell in the topbar.
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

function getUserAvatarMonogram(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) {
    return "U";
  }
  return words
    .slice(0, 2)
    .map((word) => Array.from(word)[0] || "")
    .join("")
    .toUpperCase();
}

function renderAuthPanel() {
  if (!authGuestShell || !authUserShell) {
    return;
  }

  const authenticated = Boolean(accessProfile.appUser?.user_name);
  authGuestShell.hidden = authenticated;
  authUserShell.hidden = !authenticated;

  if (authenticated) {
    if (authUserName) {
      authUserName.textContent = accessProfile.appUser.user_name ?? "Utilisateur";
    }
    if (authUserEmail) {
      authUserEmail.textContent = accessProfile.appUser.email ?? accessProfile.session?.user?.email ?? "";
    }
    if (authRolePill) {
      authRolePill.textContent = formatRoleLabel(accessProfile.role);
    }
    applyAuthAvatarVisual(accessProfile.appUser.user_name);
    return;
  }

  if (authUserAvatar) {
    authUserAvatar.classList.remove("has-photo");
    authUserAvatar.style.backgroundImage = "";
    authUserAvatar.textContent = "U";
  }

  if (authRescueSelect) {
    const knownUsers = [...getKnownUsers()].sort((left, right) => left.user_name.localeCompare(right.user_name, "fr"));
    const currentValue = loadStoredLocalRescueName() || authRescueSelect.value || "";
    const nextSignature = knownUsers.map((user) => `${user.user_id}:${user.user_name}`).join("|");
    if (authRescueOptionsSignature !== nextSignature) {
      authRescueOptionsSignature = nextSignature;
      authRescueSelect.innerHTML = "";
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Choisir un profil";
      authRescueSelect.append(placeholder);

      for (const user of knownUsers) {
        const option = document.createElement("option");
        option.value = user.user_name;
        option.textContent = user.user_name;
        authRescueSelect.append(option);
      }
    }

    authRescueSelect.value = knownUsers.some((user) => user.user_name === currentValue) ? currentValue : "";
  }
}

function getScopedDayThemes(collaborator) {
  return getEffectiveScopedDayThemes(collaborator);
}

function renderDayThemes() {
  if (!dayThemesList) {
    return;
  }

  dayThemesList.innerHTML = "";
  const collaborator = getCurrentCollaborator();
  if (!collaborator) {
    dayThemesList.append(createEmptyState("Choisissez votre nom pour cadrer vos thèmes du jour."));
    return;
  }

  const items = getScopedDayThemes(collaborator);
  if (!items.length) {
    dayThemesList.append(createEmptyState("Ajoutez 2 ou 3 thèmes pour cadrer la journée."));
    return;
  }

  for (const item of items) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip chip--theme";
    chip.dataset.themeId = item.id;
    chip.setAttribute("aria-label", `Theme du jour ${item.label}`);
    applyCategorySurface(chip, generateStableHexColor(item.label));

    const label = document.createElement("span");
    label.className = "chip-theme-label";
    label.textContent = item.label;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "chip-theme-remove";
    remove.dataset.removeThemeId = item.id;
    remove.setAttribute("aria-label", `Retirer ${item.label}`);
    remove.textContent = "×";

    chip.append(label, remove);
    dayThemesList.append(chip);
  }
}

function renderActiveSession() {
  const pendingStop = getVisiblePendingStoppedSessionState();

  if (activeSessionStatusCopy) {
    activeSessionStatusCopy.textContent = "";
    activeSessionStatusCopy.hidden = true;
    activeSessionStatusCopy.dataset.tone = "";
  }
  if (activeSessionStatusActions) {
    activeSessionStatusActions.hidden = true;
  }

  if (!activeSession) {
    timerDisplay.textContent = "00:00:00";
    if (timerStateLabel) timerStateLabel.textContent = "Prêt";
    timerPanel?.classList.remove("timer-panel--running", "timer-panel--paused");
    activeTaskLabel.textContent = pendingStop
      ? pendingStop.state === "syncing"
        ? "Clôture en cours."
        : "Session arrêtée localement."
      : "Prêt à lancer une nouvelle session.";
    toggleButton.innerHTML = `${TIMER_ICON_PLAY}<span>Démarrer</span>`;
    toggleButton.classList.remove("running");
    pauseButton.hidden = true;
    pauseButton.classList.remove("paused");
    activeStartDisplay.textContent = pendingStop
      ? "La clôture sera synchronisée dès que possible"
      : "L'heure de départ apparaîtra ici";
    activeStartDisplay.disabled = true;

    if (pendingStop && activeSessionStatusCopy) {
      const syncing = pendingStop.state === "syncing";
      activeSessionStatusCopy.textContent = syncing
        ? "Enregistrement en cours…"
        : pendingStop.errorMessage || "L'entrée est gardée localement, mais la synchro serveur n'est pas encore finalisée.";
      activeSessionStatusCopy.hidden = false;
      activeSessionStatusCopy.dataset.tone = syncing ? "warning" : "error";
      if (activeSessionStatusActions) {
        activeSessionStatusActions.hidden = syncing;
      }
    }
    return;
  }

  const isPaused = Boolean(activeSession.pausedAt);
  if (timerStateLabel) timerStateLabel.textContent = isPaused ? "En pause" : "En cours";
  timerPanel?.classList.toggle("timer-panel--running", !isPaused);
  timerPanel?.classList.toggle("timer-panel--paused", isPaused);
  const activeSubject = typeof activeSession.project === "string" ? activeSession.project.trim() : "";
  activeTaskLabel.textContent = activeSubject || (isPaused ? "Session en pause." : "Session en cours.");
  toggleButton.innerHTML = `${TIMER_ICON_STOP}<span>Arrêter</span>`;
  toggleButton.classList.toggle("running", !isPaused);
  pauseButton.hidden = false;
  pauseButton.innerHTML = isPaused
    ? `${TIMER_ICON_PLAY}<span>Reprendre</span>`
    : `${TIMER_ICON_PAUSE}<span>Pause</span>`;
  pauseButton.classList.toggle("paused", isPaused);
  activeStartDisplay.textContent = `Démarré à ${formatTimeLabel(new Date(activeSession.start))}`;
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
    manualStartTimeInput?.focus();
    manualStartTimeInput?.select?.();
  }, 0);
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
    getCategorySuggestionLabels(),
  );
  fillDatalist(tagSuggestions, uniqueTokenValues("tags"));

  const currentValue = managerCollaboratorFilter.value || "all";
  const collaborators = getVisibleReferenceUsers().length
    ? getVisibleReferenceUsers().map((item) => item.user_name).sort((a, b) => a.localeCompare(b, "fr"))
    : uniqueValues("collaborator");
  managerCollaboratorFilter.innerHTML = "";

  const teamOption = document.createElement("option");
  teamOption.value = "all";
  teamOption.textContent = "Toute l'équipe";
  managerCollaboratorFilter.append(teamOption);

  for (const collaborator of collaborators) {
    const option = document.createElement("option");
    option.value = collaborator;
    option.textContent = collaborator;
    managerCollaboratorFilter.append(option);
  }

  managerCollaboratorFilter.value = collaborators.includes(currentValue) ? currentValue : "all";
}

function renderQuickProjects() {
  quickProjects.innerHTML = "";
  const collaborator = getCurrentCollaborator();

  if (!collaborator) {
    quickProjects.append(createEmptyState("Choisissez votre nom pour retrouver vos reprises probables."));
    return;
  }

  const memories = getOrderedProjectMemories(collaborator).slice(0, QUICK_REPRISES_LIMIT);

  if (!memories.length) {
    quickProjects.append(createEmptyState("Les reprises probables apparaîtront ici."));
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

function renderTagManager() {
  const el = document.getElementById("tag-manager-list");
  const cleanupBtn = document.getElementById("tag-cleanup-btn");
  if (!el) return;

  if (journalSideSwitch) {
    for (const btn of journalSideSwitch.querySelectorAll("[data-journal-side]")) {
      btn.classList.toggle("active", btn.dataset.journalSide === journalSideMode);
    }
  }

  if (journalSideMode === "categories") {
    renderCategoryManager(el, cleanupBtn);
    return;
  }

  const tagCounts = new Map();
  for (const session of getSessionsWithPendingStopped()) {
    for (const tag of session.tags ?? []) {
      if (tag) tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  const sorted = Array.from(tagCounts.entries()).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"),
  );

  el.innerHTML = "";

  if (!sorted.length) {
    el.append(createEmptyState("Aucun tag enregistré."));
    if (cleanupBtn) cleanupBtn.hidden = true;
    return;
  }

  const needsCleanup = getSessionsWithPendingStopped().some((s) =>
    (s.tags ?? []).some((t) => t !== normalizeTag(t)),
  );
  if (cleanupBtn) {
    cleanupBtn.hidden = !needsCleanup;
    cleanupBtn.onclick = () => cleanupHistoricalTags(cleanupBtn);
  }

  const allTags = sorted.map(([tag]) => tag);
  for (const [tag, count] of sorted) {
    el.append(buildTagItem(tag, count, allTags));
  }
}

function buildTagItem(tag, count, allTags) {
  const item = document.createElement("div");
  item.className = "tag-manager-item";
  item.dataset.tag = tag;
  showTagDefault(item, tag, count, allTags);
  return item;
}

function showTagDefault(item, tag, count, allTags) {
  item.classList.remove("is-editing");
  while (item.firstChild) item.removeChild(item.firstChild);

  const hash = document.createElement("span");
  hash.className = "tag-hash";
  hash.textContent = "#";

  const label = document.createElement("span");
  label.className = "tag-manager-label";
  label.textContent = tag;

  const countEl = document.createElement("span");
  countEl.className = "tag-manager-count";
  countEl.textContent = count;

  const actions = document.createElement("span");
  actions.className = "tag-manager-actions";

  const renameBtn = document.createElement("button");
  renameBtn.type = "button";
  renameBtn.className = "btn-tag-action";
  renameBtn.textContent = "Renommer";
  renameBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showTagRenameForm(item, tag, count, allTags);
  });

  const mergeBtn = document.createElement("button");
  mergeBtn.type = "button";
  mergeBtn.className = "btn-tag-action is-merge";
  mergeBtn.textContent = "Fusionner";
  mergeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showTagMergeForm(item, tag, count, allTags);
  });

  actions.append(renameBtn, mergeBtn);
  item.append(hash, label, countEl, actions);
}

function showTagRenameForm(item, tag, count, allTags) {
  item.classList.add("is-editing");
  while (item.firstChild) item.removeChild(item.firstChild);

  const input = document.createElement("input");
  input.type = "text";
  input.className = "tag-edit-input";
  input.value = tag;

  const confirmBtn = document.createElement("button");
  confirmBtn.type = "button";
  confirmBtn.className = "btn-tag-confirm";
  confirmBtn.textContent = "Valider";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "btn-tag-cancel";
  cancelBtn.textContent = "✕";
  cancelBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showTagDefault(item, tag, count, allTags);
  });

  const doConfirm = async () => {
    const newTag = normalizeTag(input.value);
    if (!newTag || newTag === tag) {
      showTagDefault(item, tag, count, allTags);
      return;
    }
    confirmBtn.disabled = true;
    cancelBtn.disabled = true;
    confirmBtn.textContent = "…";
    await applyTagRename(tag, newTag);
  };

  confirmBtn.addEventListener("click", (e) => { e.stopPropagation(); doConfirm(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); doConfirm(); }
    if (e.key === "Escape") { e.stopPropagation(); showTagDefault(item, tag, count, allTags); }
  });

  item.append(input, confirmBtn, cancelBtn);
  requestAnimationFrame(() => { input.focus(); input.select(); });
}

function showTagMergeForm(item, tag, count, allTags) {
  item.classList.add("is-editing");
  while (item.firstChild) item.removeChild(item.firstChild);

  const sourceLabel = document.createElement("span");
  sourceLabel.className = "tag-merge-source";
  sourceLabel.textContent = "#" + tag + " →";

  const datalistId = "tag-merge-dl";
  const input = document.createElement("input");
  input.type = "text";
  input.list = datalistId;
  input.className = "tag-edit-input";
  input.placeholder = "tag cible";

  const datalist = document.createElement("datalist");
  datalist.id = datalistId;
  for (const t of allTags.filter((t) => t !== tag)) {
    const opt = document.createElement("option");
    opt.value = t;
    datalist.append(opt);
  }

  const confirmBtn = document.createElement("button");
  confirmBtn.type = "button";
  confirmBtn.className = "btn-tag-confirm";
  confirmBtn.textContent = "Fusionner";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "btn-tag-cancel";
  cancelBtn.textContent = "✕";
  cancelBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showTagDefault(item, tag, count, allTags);
  });

  const doConfirm = async () => {
    const targetTag = normalizeTag(input.value);
    if (!targetTag || targetTag === tag) {
      showTagDefault(item, tag, count, allTags);
      return;
    }
    confirmBtn.disabled = true;
    cancelBtn.disabled = true;
    confirmBtn.textContent = "…";
    await applyTagRename(tag, targetTag);
  };

  confirmBtn.addEventListener("click", (e) => { e.stopPropagation(); doConfirm(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); doConfirm(); }
    if (e.key === "Escape") { e.stopPropagation(); showTagDefault(item, tag, count, allTags); }
  });

  item.append(sourceLabel, input, datalist, confirmBtn, cancelBtn);
  requestAnimationFrame(() => input.focus());
}

async function applyTagRename(oldTag, newTag) {
  if (!window.supabase) return;

  const affected = getSessionsWithPendingStopped().filter(
    (s) => (s.tags ?? []).includes(oldTag) && s.dbTimeEntryId,
  );

  for (const session of affected) {
    const tags = dedupePreservingOrder(
      (session.tags ?? []).map((t) => (t === oldTag ? newTag : t)).filter(Boolean),
    );
    await window.supabase
      .from("time_entries")
      .update({ tags_text: tags.join(", "), updated_at: new Date().toISOString() })
      .eq("time_entry_id", session.dbTimeEntryId);
  }

  await loadServerBackedState({ silent: false });
}

async function cleanupHistoricalTags(btn) {
  if (!window.supabase) return;
  if (btn) { btn.disabled = true; btn.textContent = "…"; }

  const affected = getSessionsWithPendingStopped().filter((s) => {
    const normalized = (s.tags ?? []).map(normalizeTag).filter(Boolean);
    const deduped = dedupePreservingOrder(normalized);
    const original = (s.tags ?? []).join(",");
    return deduped.join(",") !== original && s.dbTimeEntryId;
  });

  for (const session of affected) {
    const tags = dedupePreservingOrder((session.tags ?? []).map(normalizeTag).filter(Boolean));
    await window.supabase
      .from("time_entries")
      .update({ tags_text: tags.join(", "), updated_at: new Date().toISOString() })
      .eq("time_entry_id", session.dbTimeEntryId);
  }

  await loadServerBackedState({ silent: false });
}

function renderCategoryManager(el, cleanupBtn) {
  el.innerHTML = "";
  if (cleanupBtn) cleanupBtn.hidden = true;

  const categoryCounts = new Map();
  for (const session of getSessionsWithPendingStopped()) {
    for (const cat of session.categories ?? []) {
      if (cat) categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
    }
  }

  const sorted = Array.from(categoryCounts.entries()).sort(
    (a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "fr"),
  );

  if (!sorted.length) {
    el.append(createEmptyState("Aucune catégorie enregistrée."));
    return;
  }

  const allCategories = sorted.map(([cat]) => cat);
  for (const [cat, count] of sorted) {
    el.append(buildCategoryItem(cat, count, allCategories));
  }
}

function buildCategoryItem(cat, count, allCategories) {
  const item = document.createElement("div");
  item.className = "tag-manager-item";
  item.dataset.category = cat;
  showCategoryDefault(item, cat, count, allCategories);
  return item;
}

function showCategoryDefault(item, cat, count, allCategories) {
  item.classList.remove("is-editing");
  while (item.firstChild) item.removeChild(item.firstChild);

  const color = getCategoryColor(cat);
  const swatch = document.createElement("span");
  swatch.className = "tag-hash cat-swatch";
  swatch.style.cssText = `width:10px;height:10px;border-radius:50%;background:${color};display:inline-block;flex-shrink:0;`;

  const label = document.createElement("span");
  label.className = "tag-manager-label";
  label.textContent = cat;

  const countEl = document.createElement("span");
  countEl.className = "tag-manager-count";
  countEl.textContent = count;

  const actions = document.createElement("span");
  actions.className = "tag-manager-actions";

  const renameBtn = document.createElement("button");
  renameBtn.type = "button";
  renameBtn.className = "btn-tag-action";
  renameBtn.textContent = "Renommer";
  renameBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showCategoryRenameForm(item, cat, count, allCategories);
  });

  const mergeBtn = document.createElement("button");
  mergeBtn.type = "button";
  mergeBtn.className = "btn-tag-action is-merge";
  mergeBtn.textContent = "Fusionner";
  mergeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showCategoryMergeForm(item, cat, count, allCategories);
  });

  actions.append(renameBtn, mergeBtn);
  item.append(swatch, label, countEl, actions);
}

function showCategoryRenameForm(item, cat, count, allCategories) {
  item.classList.add("is-editing");
  while (item.firstChild) item.removeChild(item.firstChild);

  const input = document.createElement("input");
  input.type = "text";
  input.className = "tag-edit-input";
  input.value = cat;

  const confirmBtn = document.createElement("button");
  confirmBtn.type = "button";
  confirmBtn.className = "btn-tag-confirm";
  confirmBtn.textContent = "Valider";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "btn-tag-cancel";
  cancelBtn.textContent = "✕";
  cancelBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showCategoryDefault(item, cat, count, allCategories);
  });

  const doConfirm = async () => {
    const newCat = input.value.trim();
    if (!newCat || newCat === cat) {
      showCategoryDefault(item, cat, count, allCategories);
      return;
    }
    confirmBtn.disabled = true;
    cancelBtn.disabled = true;
    confirmBtn.textContent = "…";
    await applyCategoryRename(cat, newCat);
  };

  confirmBtn.addEventListener("click", (e) => { e.stopPropagation(); doConfirm(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); doConfirm(); }
    if (e.key === "Escape") { e.stopPropagation(); showCategoryDefault(item, cat, count, allCategories); }
  });

  item.append(input, confirmBtn, cancelBtn);
  requestAnimationFrame(() => { input.focus(); input.select(); });
}

function showCategoryMergeForm(item, cat, count, allCategories) {
  item.classList.add("is-editing");
  while (item.firstChild) item.removeChild(item.firstChild);

  const sourceLabel = document.createElement("span");
  sourceLabel.className = "tag-merge-source";
  sourceLabel.textContent = cat + " →";

  const datalistId = "cat-merge-dl";
  const input = document.createElement("input");
  input.type = "text";
  input.list = datalistId;
  input.className = "tag-edit-input";
  input.placeholder = "catégorie cible";

  const datalist = document.createElement("datalist");
  datalist.id = datalistId;
  for (const c of allCategories.filter((c) => c !== cat)) {
    const opt = document.createElement("option");
    opt.value = c;
    datalist.append(opt);
  }

  const confirmBtn = document.createElement("button");
  confirmBtn.type = "button";
  confirmBtn.className = "btn-tag-confirm";
  confirmBtn.textContent = "Fusionner";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "btn-tag-cancel";
  cancelBtn.textContent = "✕";
  cancelBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showCategoryDefault(item, cat, count, allCategories);
  });

  const doConfirm = async () => {
    const targetCat = input.value.trim();
    if (!targetCat || targetCat === cat) {
      showCategoryDefault(item, cat, count, allCategories);
      return;
    }
    confirmBtn.disabled = true;
    cancelBtn.disabled = true;
    confirmBtn.textContent = "…";
    await applyCategoryRename(cat, targetCat);
  };

  confirmBtn.addEventListener("click", (e) => { e.stopPropagation(); doConfirm(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); doConfirm(); }
    if (e.key === "Escape") { e.stopPropagation(); showCategoryDefault(item, cat, count, allCategories); }
  });

  item.append(sourceLabel, input, datalist, confirmBtn, cancelBtn);
  requestAnimationFrame(() => input.focus());
}

async function applyCategoryRename(oldCat, newCat) {
  if (!window.supabase) return;

  const affected = getSessionsWithPendingStopped().filter(
    (s) => (s.categories ?? []).includes(oldCat) && s.dbTimeEntryId,
  );

  for (const session of affected) {
    await window.supabase
      .from("time_entries")
      .update({ activity_category_label: newCat, updated_at: new Date().toISOString() })
      .eq("time_entry_id", session.dbTimeEntryId);
  }

  await loadServerBackedState({ silent: false });
}

function renderProjectMemoryList() {
  projectMemoryList.innerHTML = "";
  const collaborator = getCurrentCollaborator();

  if (!collaborator) {
    projectMemoryList.append(createEmptyState("Choisissez votre nom pour afficher les contextes mémorisés."));
    return;
  }

  const memories = getOrderedProjectMemories(collaborator).slice(0, MEMORY_CONTEXT_LIMIT);

  if (!memories.length) {
    projectMemoryList.append(createEmptyState(`Les contextes mémorisés de ${collaborator} apparaîtront ici.`));
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
    meta.textContent = `${memory.task || "Client non précisé"} · ${memory.usesCount} reprises · ${formatDate(memory.start)}`;

    const tags = document.createElement("div");
    tags.className = "memory-meta";

    if (memory.objectivePole) {
      tags.append(createPill(memory.objectivePole, { kind: "neutral" }));
    }
    for (const category of memory.categories) {
      tags.append(createPill(category, { kind: "category" }));
    }
    for (const tag of memory.tags) {
      tags.append(createPill(`#${tag}`, { kind: "tag" }));
    }
    if (memory.notionRef) {
      tags.append(createPill("Lien", { kind: "link" }));
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

function getFilteredJournalSessions(rows) {
  const fromDate = journalFilterFromInput?.value ? new Date(`${journalFilterFromInput.value}T00:00:00`) : null;
  const toDate = journalFilterToInput?.value ? new Date(`${journalFilterToInput.value}T23:59:59.999`) : null;
  const categoryFilter = normalizeText(journalFilterCategoryInput?.value ?? "");
  const tagFilter = normalizeText(String(journalFilterTagsInput?.value ?? "").replace(/^#/, ""));
  const subjectFilter = normalizeText(journalFilterSubjectInput?.value ?? "");

  return rows.filter((session) => {
    const start = new Date(session.start);
    if (fromDate && start < fromDate) {
      return false;
    }
    if (toDate && start > toDate) {
      return false;
    }
    if (
      categoryFilter &&
      !(session.categories ?? []).some((category) => normalizeText(category).includes(categoryFilter))
    ) {
      return false;
    }
    if (
      tagFilter &&
      !(session.tags ?? []).some((tag) => normalizeText(tag).includes(tagFilter))
    ) {
      return false;
    }

    const subjectHaystack = normalizeText([session.project, session.task].filter(Boolean).join(" · "));
    if (subjectFilter && !subjectHaystack.includes(subjectFilter)) {
      return false;
    }

    return true;
  });
}

function renderSessionList() {
  sessionList.innerHTML = "";
  const visibleSessions = getFilteredJournalSessions(getScopedSessions(getSessionsWithPendingStopped()));

  if (!visibleSessions.length) {
    const filtersActive = Boolean(
      journalFilterFromInput?.value ||
        journalFilterToInput?.value ||
        journalFilterCategoryInput?.value ||
        journalFilterTagsInput?.value ||
        journalFilterSubjectInput?.value,
    );
    sessionList.append(
      createEmptyState(
        filtersActive
          ? "Aucune entrée ne correspond à ces filtres."
          : "Le journal affichera ici les entrées enregistrées.",
      ),
    );
    return;
  }

  const groups = new Map();
  for (const session of visibleSessions.slice(0, 42)) {
    const dayKey = new Date(session.start).toISOString().slice(0, 10);
    const current = groups.get(dayKey) ?? [];
    current.push(session);
    groups.set(dayKey, current);
  }

  for (const [, daySessions] of groups.entries()) {
    const group = document.createElement("section");
    group.className = "journal-day-group";

    const header = document.createElement("div");
    header.className = "journal-day-header";

    const headerCopy = document.createElement("div");
    headerCopy.className = "journal-day-copy";

    const title = document.createElement("h3");
    title.className = "journal-day-title";
    title.textContent = formatDate(daySessions[0].start);

    const subtitle = document.createElement("p");
    subtitle.className = "journal-day-subtitle";
    subtitle.textContent = `${daySessions.length} entrée${daySessions.length > 1 ? "s" : ""}`;

    const total = document.createElement("strong");
    total.className = "journal-day-total";
    total.textContent = formatDuration(daySessions.reduce((sum, session) => sum + (Number(session.durationMs) || 0), 0));

    headerCopy.append(title, subtitle);
    header.append(headerCopy, total);
    group.append(header);

    const body = document.createElement("div");
    body.className = "journal-day-list";

    for (const session of daySessions) {
      const fragment = sessionItemTemplate.content.cloneNode(true);
      const item = fragment.querySelector(".session-item");
      item.dataset.sessionId = session.id;
      item.title = [
        `Sujet: ${session.project || session.task || "Sans sujet"}`,
        session.task ? `Activité: ${session.task}` : "",
        session.categories?.length ? `Catégorie : ${session.categories.join(", ")}` : "",
        session.tags?.length ? `Tags : ${session.tags.join(", ")}` : "",
        `Horaire: ${formatTimeLabel(new Date(session.start))}${session.end ? ` - ${formatTimeLabel(new Date(session.end))}` : ""}`,
        session.notes ? `Note: ${session.notes}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      fragment.querySelector(".session-task").textContent = session.project || session.task || "Sans sujet";

      const activityElement = fragment.querySelector(".session-activity");
      const activityLabel = getSessionClientLabel(session) || session.task || "Activité non précisée";
      activityElement.textContent = activityLabel;
      activityElement.hidden = !activityLabel;

      const secondaryElement = fragment.querySelector(".session-secondary");
      const secondaryBits = [];
      if (session.objectiveOkr) secondaryBits.push(formatObjectiveOkrDisplay(session.objectiveOkr));
      if (session.objectiveKr) secondaryBits.push(formatObjectiveKrDisplay(session.objectiveKr));
      secondaryElement.textContent = secondaryBits.join(" · ");
      secondaryElement.hidden = !secondaryBits.length;

      fragment.querySelector(".session-duration").textContent = formatDuration(session.durationMs);
      const timeRangeElement = fragment.querySelector(".session-time-range");
      timeRangeElement.textContent = `${formatTimeLabel(new Date(session.start))}${session.end ? ` - ${formatTimeLabel(new Date(session.end))}` : ""}`;

      const dateElement = fragment.querySelector(".session-date");
      dateElement.textContent = formatDate(session.start);
      dateElement.hidden = true;

      const notesElement = fragment.querySelector(".session-notes");
      notesElement.textContent = session.notes || "";
      notesElement.hidden = !session.notes;

      const categoriesElement = fragment.querySelector(".session-categories");
      categoriesElement.innerHTML = "";
      renderPills(categoriesElement, (session.categories ?? []).slice(0, 1), { kind: "category" });
      categoriesElement.hidden = !(session.categories ?? []).length;

      const tagsElement = fragment.querySelector(".session-tags");
      tagsElement.innerHTML = "";
      renderPills(tagsElement, (session.tags ?? []).slice(0, 3).map((tag) => `#${tag}`), { kind: "tag" });
      tagsElement.hidden = !(session.tags ?? []).length;

      body.append(fragment);
    }

    group.append(body);
    sessionList.append(group);
  }
}

function openTimeRangeInlineEditor(el, session) {
  el.classList.add("is-editing");

  const startDate = new Date(session.start);
  const endDate = session.end ? new Date(session.end) : null;

  const toTimeValue = (d) =>
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

  const startInput = document.createElement("input");
  startInput.type = "time";
  startInput.className = "time-quick-input";
  startInput.value = toTimeValue(startDate);

  const sep = document.createElement("span");
  sep.className = "time-quick-sep";
  sep.textContent = "–";

  const endInput = document.createElement("input");
  endInput.type = "time";
  endInput.className = "time-quick-input";
  if (endDate) endInput.value = toTimeValue(endDate);
  endInput.disabled = !endDate;

  const confirmBtn = document.createElement("button");
  confirmBtn.type = "button";
  confirmBtn.className = "time-quick-confirm";
  confirmBtn.setAttribute("aria-label", "Confirmer");
  confirmBtn.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M1.5 5l2.5 2.5 4.5-5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "time-quick-cancel";
  cancelBtn.setAttribute("aria-label", "Annuler");
  cancelBtn.innerHTML = `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true"><path d="M1 1l6 6M7 1L1 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

  el.textContent = "";
  el.append(startInput, sep, endInput, confirmBtn, cancelBtn);
  startInput.focus();

  const restore = () => {
    el.classList.remove("is-editing");
    el.textContent = `${formatTimeLabel(startDate)}${endDate ? ` – ${formatTimeLabel(endDate)}` : ""}`;
  };

  const doConfirm = async () => {
    if (!startInput.value) { restore(); return; }
    const [sh, sm] = startInput.value.split(":").map(Number);
    const newStart = new Date(startDate);
    newStart.setHours(sh, sm, 0, 0);

    let newEnd = endDate;
    if (endDate && endInput.value) {
      const [eh, em] = endInput.value.split(":").map(Number);
      newEnd = new Date(endDate);
      newEnd.setHours(eh, em, 0, 0);
      if (newEnd <= newStart) newEnd = new Date(newEnd.getTime() + 86400000);
    }

    el.classList.remove("is-editing");
    await quickPatchSessionTimes(el, session, newStart, newEnd);
  };

  confirmBtn.addEventListener("click", (e) => { e.stopPropagation(); doConfirm(); });
  cancelBtn.addEventListener("click", (e) => { e.stopPropagation(); restore(); });
  [startInput, endInput].forEach((inp) => {
    inp.addEventListener("click", (e) => e.stopPropagation());
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); doConfirm(); }
      if (e.key === "Escape") { e.stopPropagation(); restore(); }
    });
  });
}

async function quickPatchSessionTimes(el, session, newStart, newEnd) {
  const durationMs = newEnd
    ? Math.max(newEnd.getTime() - newStart.getTime(), 0)
    : (Number(session.durationMs) || 0);

  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) {
    sessions[idx] = {
      ...sessions[idx],
      start: newStart.toISOString(),
      end: newEnd ? newEnd.toISOString() : sessions[idx].end,
      durationMs,
    };
  }
  persistSessions();

  el.textContent = "✓ Mis à jour";
  el.classList.add("time-updated-flash");

  if (session.dbTimeEntryId && window.supabase) {
    try {
      await window.supabase
        .from("time_entries")
        .update({
          started_at: newStart.toISOString(),
          ended_at: newEnd ? newEnd.toISOString() : session.end,
          entry_date: newStart.toISOString().slice(0, 10),
          duration_minutes: Math.max(1, Math.round(durationMs / 60000)),
          duration_hours: Number((durationMs / 3600000).toFixed(2)),
          updated_at: new Date().toISOString(),
        })
        .eq("time_entry_id", session.dbTimeEntryId);
    } catch {}
  }

  setTimeout(() => {
    el.classList.remove("time-updated-flash");
    el.textContent = `${formatTimeLabel(newStart)}${newEnd ? ` – ${formatTimeLabel(newEnd)}` : ""}`;
    const timingEl = el.closest(".session-timing");
    if (timingEl && durationMs > 0) {
      const durEl = timingEl.querySelector(".session-duration");
      if (durEl) durEl.textContent = formatDuration(durationMs);
    }
  }, 1800);
}

function getUnsyncedLocalSessions() {
  return sessions.filter(
    (s) => !s.isServerBacked && s.end && Number(s.durationMs) > 0 && !isDemoSession(s),
  );
}

function renderSyncButton() {
  const btn = document.getElementById("journal-sync-btn");
  const label = document.getElementById("journal-sync-label");
  if (!btn) return;
  const unsynced = getUnsyncedLocalSessions();
  const count = unsynced.length;
  btn.hidden = count === 0;
  if (label) {
    label.textContent = count === 1
      ? "Synchroniser 1 entrée"
      : `Synchroniser ${count} entrées`;
  }
}

async function syncAllLocalSessions() {
  const btn = document.getElementById("journal-sync-btn");
  const label = document.getElementById("journal-sync-label");
  if (btn) btn.disabled = true;

  const unsynced = getUnsyncedLocalSessions();
  if (!unsynced.length) {
    if (btn) btn.hidden = true;
    return;
  }

  let done = 0;
  for (const session of unsynced) {
    if (label) label.textContent = `${done}/${unsynced.length}…`;
    try {
      await syncSessionToSupabase(session, "manual", { refreshAfterSuccess: false });
      done++;
    } catch {}
  }

  if (label) label.textContent = `✓ ${done} entrée${done !== 1 ? "s" : ""} synchronisée${done !== 1 ? "s" : ""}`;
  setTimeout(async () => {
    await loadServerBackedState({ silent: false });
    renderSyncButton();
    if (btn) btn.disabled = false;
  }, 1200);
}

function renderCadreViews() {
  renderDayThemes();
  renderPersonalStats();
  renderPersonalPeriodControls();
  renderPersonalDistribution();
  renderAgenda();
}

function getDisplayedWeekRange() {
  return getPeriodRange(getReportAnchorDate(), "week");
}

function getSummaryCardLabel(index) {
  return document.querySelectorAll(".cadre-summary .summary-card p")[index] ?? null;
}

function renderPersonalStats() {
  const collaborator = getCurrentCollaborator();
  const firstCardLabel = getSummaryCardLabel(0);
  const secondCardLabel = getSummaryCardLabel(1);
  if (!collaborator) {
    if (firstCardLabel) {
      firstCardLabel.textContent = "Aujourd'hui réel";
    }
    if (secondCardLabel) {
      secondCardLabel.textContent = "Cette semaine réelle";
    }
    todayTotal.textContent = "0 h 00";
    weekTotal.textContent = "0 h 00";
    todayPanelCopy.textContent = "Choisissez votre nom pour charger votre temps réel.";
    if (topCategoryName) topCategoryName.textContent = "—";
    if (topCategoryTime) topCategoryTime.textContent = "0 h 00";
    return;
  }

  const rows = getSessionsForCollaborator(collaborator);
  const range = getDisplayedWeekRange();
  const today = new Date();
  const weekContainsToday = today >= range.start && today < range.end;
  const referenceDay = weekContainsToday ? today : range.start;
  const referenceDayStart = new Date(referenceDay.getFullYear(), referenceDay.getMonth(), referenceDay.getDate());
  const referenceDayEnd = new Date(referenceDayStart);
  referenceDayEnd.setDate(referenceDayEnd.getDate() + 1);
  const statsRows = rows.filter((session) => isLiveStatsEligibleSession(session, collaborator, referenceDayStart));

  let referenceDayMs = 0;
  let weekMs = 0;
  for (const session of statsRows) {
    const start = new Date(session.start);
    const durationMs = Number(session.durationMs) || 0;
    if (start >= referenceDayStart && start < referenceDayEnd) {
      referenceDayMs += durationMs;
    }
    if (isSessionInRange(session, range)) {
      weekMs += durationMs;
    }
  }

  if (firstCardLabel) {
    firstCardLabel.textContent = weekContainsToday ? "Aujourd'hui réel" : "Jour repère réel";
  }
  if (secondCardLabel) {
    secondCardLabel.textContent = weekContainsToday ? "Cette semaine réelle" : "Semaine réelle affichée";
  }

  todayTotal.textContent = formatDuration(referenceDayMs);
  weekTotal.textContent = formatDuration(weekMs);
  todayPanelCopy.textContent = weekContainsToday
    ? `Temps réel saisi aujourd'hui pour ${collaborator}.`
    : `Lecture réelle ancrée au ${formatDate(referenceDayStart)} pour ${collaborator}.`;

}

function renderPersonalDistribution() {
  const collaborator = getCurrentCollaborator();
  const usesObjectives = statsMode === "objectives";

  const periodSuffix = personalPeriod === "week" ? "cette semaine"
    : personalPeriod === "month" ? "ce mois"
    : "sur cette période";

  personalStatsTitle.textContent = usesObjectives ? `Objectifs ${periodSuffix}` : `Catégories ${periodSuffix}`;
  personalStatsCopy.textContent = usesObjectives
    ? `Répartition de ton temps par objectif ${periodSuffix}.`
    : `Répartition de ton temps par catégorie ${periodSuffix}.`;

  if (!collaborator) {
    if (topCategoryName) topCategoryName.textContent = "—";
    if (topCategoryTime) topCategoryTime.textContent = "0 h 00";
    renderPersonalWeekDistribution([], 0, usesObjectives, "Choisissez votre nom pour voir vos données.");
    return;
  }

  const range = getPersonalPeriodRange();
  const rows = getSessionsForCollaborator(collaborator).filter((session) => isSessionInRange(session, range));
  const objectiveRows = buildObjectiveOkrRows(rows);
  const fallbackRows = buildReportRows(rows, "categories");
  const displayRows = usesObjectives ? objectiveRows : fallbackRows;
  const totalMs = displayRows.reduce((sum, row) => sum + row.durationMs, 0);

  const topRow = displayRows[0];
  if (topCategoryName) topCategoryName.textContent = topRow?.label ?? "—";
  if (topCategoryTime) topCategoryTime.textContent = topRow ? formatDuration(topRow.durationMs) : "0 h 00";

  renderPersonalWeekDistribution(
    displayRows,
    totalMs,
    usesObjectives,
    usesObjectives
      ? `Aucun objectif 2026 renseigné ${periodSuffix} pour ce cargonaute.`
      : `Aucune catégorie enregistrée ${periodSuffix} pour ce cargonaute.`,
  );
}

function renderAgenda() {
  agendaBoard.innerHTML = "";
  visiblePlannedEvents = [];
  const collaborator = getCurrentCollaborator();
  if (!collaborator) {
    renderPlannedSummary([], null);
    agendaBoard.append(createEmptyState("Choisissez votre nom pour afficher et déplacer vos créneaux."));
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
  const plannedRows = getPlannedEventsForCollaborator(collaborator, range);
  visiblePlannedEvents = plannedRows;
  renderPlannedSummary(plannedRows, range);

  const startHour = 7;
  const endHour = 24;
  const hourHeight = 52;
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

    try {
      const dayCard = document.createElement("article");
      dayCard.className = "agenda-day";
      if (isSameDay(day, new Date())) {
        dayCard.classList.add("agenda-day--today");
      }

      const dayRows = scopedRows
        .filter((session) => isSameDay(new Date(session.start), day))
        .sort((a, b) => new Date(a.start) - new Date(b.start));
      const dayPlannedRows = plannedRows
        .filter((item) => item?.start_at && item?.end_at && isSameDay(new Date(item.start_at), day))
        .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

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

      if (!dayRows.length && !dayPlannedRows.length) {
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

      const laidOutPlannedRows = layoutAgendaPlannedEvents(dayPlannedRows, startHour, endHour, hourHeight);
      for (const row of laidOutPlannedRows) {
        const plannedEvent = row.session;
        const visualSize = getAgendaEventVisualSize(row.heightPx);
        const event = document.createElement("button");
        event.type = "button";
        event.className = "agenda-event agenda-event--planned";
        if (visualSize !== "full") {
          event.classList.add(`agenda-event--${visualSize}`);
        }
        event.dataset.plannedId = plannedEvent.id;
        event.style.top = `${row.topPx}px`;
        event.style.height = `${row.heightPx}px`;
        event.style.left = `${row.leftOffset}%`;
        event.style.width = `${row.widthPercent}%`;
        event.title = buildPlannedEventTooltip(plannedEvent);
        applyPlannedAgendaEventColor(event, plannedEvent);
        renderPlannedAgendaEventContents(event, plannedEvent, visualSize);
        dayTrack.append(event);
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
    } catch (error) {
      console.error("Agenda day render failed:", formatDateInput(day), error);
      const fallbackCard = document.createElement("article");
      fallbackCard.className = "agenda-day";
      const fallbackHead = document.createElement("div");
      fallbackHead.className = "agenda-day-head";
      fallbackHead.innerHTML = `<div class="agenda-day-meta"><strong class="agenda-day-number">${day.getDate()}</strong><div class="agenda-day-copy"><h3>${formatAgendaDayLabel(day)}</h3><p>0 h</p></div></div>`;
      const fallbackTrack = document.createElement("div");
      fallbackTrack.className = "agenda-day-track";
      fallbackTrack.style.height = `${(endHour - startHour) * hourHeight}px`;
      const empty = createEmptyState("Lecture prévue indisponible pour ce jour.");
      empty.classList.add("agenda-empty-state");
      fallbackTrack.append(empty);
      fallbackCard.append(fallbackHead, fallbackTrack);
      agendaBoard.append(fallbackCard);
    }
  }

  const weekKey = range.start.toISOString();
  if (weekKey !== agendaLastScrolledWeekStart) {
    agendaLastScrolledWeekStart = weekKey;
    requestAnimationFrame(() => {
      const nowEl = agendaBoard.querySelector(".agenda-now-marker");
      if (nowEl) {
        nowEl.scrollIntoView({ behavior: "instant", block: "center" });
      }
    });
  }
}

function layoutAgendaSessions(dayRows, startHour, endHour, hourHeight) {
  return layoutAgendaTimedRows(dayRows, startHour, endHour, hourHeight, (session) => session.start, (session) => session.end);
}

function layoutAgendaPlannedEvents(dayRows, startHour, endHour, hourHeight) {
  return layoutAgendaTimedRows(dayRows, startHour, endHour, hourHeight, (event) => event.start_at, (event) => event.end_at);
}

function layoutAgendaTimedRows(dayRows, startHour, endHour, hourHeight, getStart, getEnd) {
  const preparedRows = dayRows.map((session) => {
    const start = new Date(getStart(session));
    const endRaw = getEnd(session);
    const endParsed = endRaw ? new Date(endRaw) : null;
    const end = (endParsed && !isNaN(endParsed.getTime())) ? endParsed : new Date();
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
  if (heightPx < 22) {
    return "tiny";
  }
  if (heightPx < 40) {
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
    const projectLabel = getAgendaEventSecondaryLabel(session);
    if (projectLabel) {
      const client = document.createElement("p");
      client.className = "agenda-event-client";
      client.textContent = projectLabel;
      element.append(client);
    }

    const time = document.createElement("p");
    time.className = "agenda-event-time";
    time.textContent = visualSize === "compact"
      ? formatTimeOnly(session.start)
      : `${formatTimeRange(session)} · ${formatDurationHours(session.durationMs)}`;
    element.append(time);
  }

  if (visualSize === "full") {
    const categoryLabel = session.categories?.[0];
    if (categoryLabel) {
      const cat = document.createElement("p");
      cat.className = "agenda-event-category";
      cat.textContent = categoryLabel;
      element.append(cat);
    }
  }

  const bottomHandle = document.createElement("span");
  bottomHandle.className = "agenda-resize-handle agenda-resize-handle--end";
  bottomHandle.setAttribute("aria-hidden", "true");
  element.append(bottomHandle);
}

function renderAgendaLivePreview() {
  if (!manualEditingSessionId || currentView !== "cadre") return;
  const draftStart = readDateTimeFieldValue(manualStartDateInput, manualStartTimeInput);
  const draftEnd = readDateTimeFieldValue(manualEndDateInput, manualEndTimeInput);
  if (!draftStart || !draftEnd || isNaN(draftStart.getTime()) || isNaN(draftEnd.getTime()) || draftEnd <= draftStart) return;

  const eventEl = agendaBoard.querySelector(`[data-session-id="${CSS.escape(manualEditingSessionId)}"]`);
  if (!eventEl) return;

  const track = eventEl.closest(".agenda-day-track");
  if (!track) return;

  const startHour = Number(track.dataset.startHour);
  const endHour = Number(track.dataset.endHour);
  const hourHeight = Number(track.dataset.hourHeight);
  if (!Number.isFinite(hourHeight)) return;

  if (formatDateInput(draftStart) !== track.dataset.dayDate) {
    renderAgenda();
    return;
  }

  const startMinutes = Math.max(0, (draftStart.getHours() - startHour) * 60 + draftStart.getMinutes());
  const endClamped = Math.min((endHour - startHour) * 60, (draftEnd.getHours() - startHour) * 60 + draftEnd.getMinutes());
  const endMinutes = Math.max(endClamped, startMinutes + 15);
  const topPx = (startMinutes / 60) * hourHeight;
  const heightPx = Math.max(((endMinutes - startMinutes) / 60) * hourHeight, 4);

  eventEl.style.top = `${topPx}px`;
  eventEl.style.height = `${heightPx}px`;

  const visualSize = getAgendaEventVisualSize(heightPx);
  eventEl.classList.toggle("agenda-event--tiny", visualSize === "tiny");
  eventEl.classList.toggle("agenda-event--compact", visualSize === "compact");

  const session = findSessionById(manualEditingSessionId);
  if (session) {
    renderAgendaEventContents(eventEl, {
      ...session,
      start: draftStart.toISOString(),
      end: draftEnd.toISOString(),
      durationMs: draftEnd.getTime() - draftStart.getTime(),
    }, visualSize);
  }
}

function renderPlannedAgendaEventContents(element, plannedEvent, visualSize) {
  element.innerHTML = "";

  const time = document.createElement("p");
  time.className = "agenda-event-time";
  time.innerHTML = `<span class="agenda-event-status">${getPlannedEventStatusSymbol(plannedEvent.status)}</span> ${formatPlannedEventTime(plannedEvent)}`;
  element.append(time);

  if (visualSize === "tiny") {
    return;
  }

  const subject = document.createElement("p");
  subject.className = "agenda-event-client agenda-event-subject";
  subject.textContent = plannedEvent.title || "Événement importé";
  element.append(subject);

  if (visualSize === "full") {
    const category = getPlannedEventDisplayCategory(plannedEvent);
    if (category) {
      const copy = document.createElement("p");
      copy.className = "agenda-event-category";
      copy.textContent = category;
      element.append(copy);
    }
  }
}

function applyPlannedAgendaEventColor(element, plannedEvent) {
  const category = getPlannedEventDisplayCategory(plannedEvent);
  const baseColor = category ? getCategoryColor(category, plannedEvent.title || plannedEvent.id) : "#9baab3";
  element.style.setProperty("--agenda-accent", baseColor);
  element.style.background = `${baseColor}12`;
  element.style.borderColor = `${baseColor}4D`;
}

function buildPlannedEventTooltip(plannedEvent) {
  const bits = [
    `${getPlannedEventStatusSymbol(plannedEvent.status)} ${plannedEvent.title || "Événement importé"}`,
    `${formatPlannedEventWeekday(plannedEvent.start_at)} · ${formatPlannedEventTime(plannedEvent)}`,
    getPlannedEventDisplayCategory(plannedEvent) || "À qualifier",
    plannedEvent.validated_tags?.length
      ? `Tags : ${plannedEvent.validated_tags.join(", ")}`
      : plannedEvent.suggested_tags?.length
        ? `Tags : ${plannedEvent.suggested_tags.join(", ")}`
        : "",
  ];
  return bits.filter(Boolean).join("\n");
}

function formatPlannedEventTime(plannedEvent) {
  return `${formatTimeOnly(plannedEvent.start_at)}-${formatTimeOnly(plannedEvent.end_at)}`;
}

function formatPlannedEventWeekday(value) {
  return new Intl.DateTimeFormat("fr-FR", { weekday: "short", day: "numeric", month: "short" })
    .format(new Date(value))
    .replace(".", "");
}

function getPlannedEventStatusSymbol(status) {
  const map = { pending: "•", suggested: "~", validated: "✓", ignored: "×" };
  return map[status] || "•";
}

function getPlannedEventDisplayCategory(plannedEvent) {
  return plannedEvent.validated_category || plannedEvent.suggested_category || "";
}

function getPlannedEventEditableTags(plannedEvent) {
  return dedupePreservingOrder([...(plannedEvent.validated_tags ?? []), ...(plannedEvent.suggested_tags ?? [])]);
}

function getPlannedConfidenceLabel(confidence = 0) {
  if (confidence >= 0.82) return "forte";
  if (confidence >= 0.62) return "probable";
  return "faible";
}

function syncPlannedDialogSuggestion(plannedEvent) {
  if (!plannedDialogSuggestion || !plannedDialogSuggestionCategory || !plannedDialogSuggestionDetail) {
    return;
  }

  const suggestedCategory = plannedEvent?.suggested_category || "";
  const suggestedTags = plannedEvent?.suggested_tags?.length ? plannedEvent.suggested_tags.join(", ") : "";
  if (!suggestedCategory) {
    plannedDialogSuggestion.hidden = true;
    plannedDialogSuggestionCategory.textContent = "";
    plannedDialogSuggestionDetail.textContent = "";
    return;
  }

  plannedDialogSuggestion.hidden = false;
  plannedDialogSuggestionCategory.textContent = suggestedCategory;
  const detailBits = [`Confiance ${getPlannedConfidenceLabel(plannedEvent.matching_confidence)}`];
  if (suggestedTags) {
    detailBits.push(`Tags : ${suggestedTags}`);
  }
  plannedDialogSuggestionDetail.textContent = detailBits.join(" · ");
}

function renderPlannedSummary(rows, range) {
  if (!plannedSummary) {
    return;
  }
  plannedSummary.innerHTML = "";
  if (!range) {
    plannedSummary.hidden = true;
    return;
  }

  const currentWeekStart = getStartOfWeek(new Date());
  const isPastWeek = range.end <= currentWeekStart;

  if (isPastWeek) {
    const cards = [
      { value: "0 h", label: "Temps planifié" },
      { value: "—", label: "Temps ouvert estimé" },
      { value: "—", label: "Catégorie dominante" },
      { value: "0", label: "Événements à qualifier" },
    ];

    cards.forEach((card) => {
      const article = document.createElement("article");
      article.className = "planned-summary-card planned-summary-card--muted";
      const strong = document.createElement("strong");
      strong.textContent = card.value;
      const span = document.createElement("span");
      span.textContent = card.label;
      article.append(strong, span);
      plannedSummary.append(article);
    });

    const note = document.createElement("p");
    note.className = "planned-summary-note";
    note.textContent = "La lecture prévisionnelle commence cette semaine. Les semaines passées restent en lecture réelle uniquement.";
    plannedSummary.append(note);
    plannedSummary.hidden = false;
    return;
  }

  if (!rows.length) {
    plannedSummary.hidden = true;
    return;
  }

  const activeRows = rows.filter((row) => row.status !== "ignored");
  const plannedMs = activeRows.reduce((sum, row) => sum + (Number(row.durationMs) || 0), 0);
  const plannedWindowMs = getPlannedWorkWindowMinutes(range) * 60000;
  const occupiedWindowMs = getPlannedOccupiedMinutesInWindow(activeRows, range);
  const openWindowMs = Math.max(plannedWindowMs - occupiedWindowMs, 0);
  const qualifierCount = rows.filter((row) => row.status === "pending" || row.status === "suggested").length;
  const categoryRows = buildPlannedCategoryRows(activeRows);
  const dominantCategory = categoryRows[0]?.label || "À qualifier";
  const cards = [
    { value: formatDurationHours(plannedMs), label: "Temps planifié" },
    { value: formatDurationHours(openWindowMs), label: "Temps ouvert estimé" },
    { value: dominantCategory, label: "Catégorie dominante" },
    { value: String(qualifierCount), label: "Événements à qualifier" },
  ];

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "planned-summary-card";
    const strong = document.createElement("strong");
    strong.textContent = card.value;
    const span = document.createElement("span");
    span.textContent = card.label;
    article.append(strong, span);
    plannedSummary.append(article);
  });

  const note = document.createElement("p");
  note.className = "planned-summary-note";
  note.textContent = "Lecture prévisionnelle de l’agenda, distincte du temps réel affiché dans « Ma semaine ». Base estimée sur une plage lun–ven, 9 h–18 h.";
  plannedSummary.append(note);

  plannedSummary.hidden = false;
}

function getPlannedWorkWindowMinutes(range) {
  let totalMinutes = 0;
  for (let cursor = new Date(range.start); cursor < range.end; cursor.setDate(cursor.getDate() + 1)) {
    const day = new Date(cursor);
    if (!PLANNED_WORK_DAYS.has(day.getDay())) {
      continue;
    }
    totalMinutes += (PLANNED_WORK_END_HOUR - PLANNED_WORK_START_HOUR) * 60;
  }
  return totalMinutes;
}

function getPlannedWorkWindowStart(day) {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), PLANNED_WORK_START_HOUR, 0, 0, 0);
}

function getPlannedWorkWindowEnd(day) {
  return new Date(day.getFullYear(), day.getMonth(), day.getDate(), PLANNED_WORK_END_HOUR, 0, 0, 0);
}

function getPlannedOccupiedMinutesInWindow(rows, range) {
  const intervals = [];
  for (const row of rows) {
    const start = new Date(row.start_at);
    const end = new Date(row.end_at);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      continue;
    }
    for (let cursor = new Date(range.start); cursor < range.end; cursor.setDate(cursor.getDate() + 1)) {
      const day = new Date(cursor);
      if (!PLANNED_WORK_DAYS.has(day.getDay())) {
        continue;
      }
      const windowStart = getPlannedWorkWindowStart(day);
      const windowEnd = getPlannedWorkWindowEnd(day);
      const overlapStart = Math.max(start.getTime(), windowStart.getTime());
      const overlapEnd = Math.min(end.getTime(), windowEnd.getTime());
      if (overlapEnd > overlapStart) {
        intervals.push([overlapStart, overlapEnd]);
      }
    }
  }
  intervals.sort((left, right) => left[0] - right[0]);
  let occupiedMs = 0;
  let current = null;
  for (const interval of intervals) {
    if (!current) {
      current = [...interval];
      continue;
    }
    if (interval[0] <= current[1]) {
      current[1] = Math.max(current[1], interval[1]);
      continue;
    }
    occupiedMs += current[1] - current[0];
    current = [...interval];
  }
  if (current) {
    occupiedMs += current[1] - current[0];
  }
  return occupiedMs;
}

function inferPlannedSuggestionFromTitle(rawTitle = "") {
  const title = String(rawTitle ?? "").trim();
  const normalized = normalizeComparableText(title);
  if (!normalized) {
    return {
      suggested_category: "",
      suggested_tags: [],
      status: "pending",
      matching_confidence: 0.2,
    };
  }

  const inferredTags = [];
  if (normalized.includes("entrepot")) inferredTags.push("Entrepot");
  if (normalized.includes("coursier")) inferredTags.push("Coursier");
  if (normalized.includes("operationnel")) inferredTags.push("Operationnel");
  if (normalized.includes("cargonautes")) inferredTags.push("Cargonautes");
  if (normalized.includes("point")) inferredTags.push("Point");
  if (normalized.includes("reunion")) inferredTags.push("Reunion");
  if (normalized.includes("shift")) inferredTags.push("Shift");
  if (normalized.includes("indisponible")) inferredTags.push("Indisponible");

  if (normalized.includes("indisponible")) {
    return {
      suggested_category: "",
      suggested_tags: dedupePreservingOrder(inferredTags),
      status: "pending",
      matching_confidence: 0.18,
    };
  }

  if (normalized.includes("point") || normalized.includes("reunion")) {
    return {
      suggested_category: "Management équipe",
      suggested_tags: dedupePreservingOrder(inferredTags),
      status: "suggested",
      matching_confidence: normalized.includes("operationnel") ? 0.88 : 0.82,
    };
  }

  if (normalized.includes("shift")) {
    return {
      suggested_category: "Management équipe",
      suggested_tags: dedupePreservingOrder(inferredTags),
      status: "suggested",
      matching_confidence: normalized.includes("coursier") ? 0.58 : 0.66,
    };
  }

  if (normalized.includes("verifier") || normalized.includes("verification")) {
    return {
      suggested_category: "Administration interne",
      suggested_tags: dedupePreservingOrder(inferredTags),
      status: "suggested",
      matching_confidence: 0.63,
    };
  }

  return {
    suggested_category: "",
    suggested_tags: dedupePreservingOrder(inferredTags),
    status: "pending",
    matching_confidence: 0.24,
  };
}

function buildPlannedCategoryRows(rows) {
  const grouped = new Map();
  rows.forEach((row) => {
    const label = getPlannedEventDisplayCategory(row);
    if (!label) {
      return;
    }
    const current = grouped.get(label) ?? { label, durationMs: 0, count: 0 };
    current.durationMs += Number(row.durationMs) || 0;
    current.count += 1;
    grouped.set(label, current);
  });
  return Array.from(grouped.values()).sort((a, b) => b.durationMs - a.durationMs);
}

function getPlannedEventsForCollaborator(collaborator, range) {
  const importedRows = getImportedPlannedEventsForCollaborator(collaborator, range);
  if (importedRows.length) {
    return importedRows;
  }

  // If the user has a real calendar configured, never show mock suggestions —
  // only real imports should appear (or nothing if not yet synced for this week).
  if (getCalendarIcsUrl(collaborator)) {
    return [];
  }

  const currentWeekStart = getStartOfWeek(new Date());
  if (range.end <= currentWeekStart) {
    return [];
  }

  const weekOffset = Math.max(
    0,
    Math.round((new Date(range.start).getTime() - currentWeekStart.getTime()) / (7 * 24 * 60 * 60 * 1000)),
  );

  const buildPlannedMockEvent = (definition, index) => {
    const start = new Date(range.start);
    start.setDate(start.getDate() + definition.dayOffset);
    start.setHours(definition.hour, definition.minute, 0, 0);
    const end = new Date(start.getTime() + definition.durationMin * 60000);
    const inferred = inferPlannedSuggestionFromTitle(definition.title);
    const baseCategory = definition.suggested_category ?? inferred.suggested_category ?? "";
    const baseTags = dedupePreservingOrder([...(definition.suggested_tags ?? []), ...(inferred.suggested_tags ?? [])]).slice(0, 4);
    const defaultStatus = definition.status ?? inferred.status ?? (baseCategory ? "suggested" : "pending");
    const id = `planned-${normalizeComparableText(collaborator || "cargonaute")}-${formatDateInput(range.start)}-${definition.key}`;
    const override = plannedEventOverrides[id] ?? {};
    const status = override.status ?? defaultStatus;
    const validatedCategory = override.validated_category ?? (status === "validated" ? baseCategory : "");
    const validatedTags = override.validated_tags ?? (status === "validated" ? baseTags : []);

    return {
      id,
      source: "google_calendar",
      source_event_id: override.source_event_id ?? definition.source_event_id ?? id,
      source_calendar_id: override.source_calendar_id ?? definition.source_calendar_id ?? "google-calendar-snapshot",
      collaborator,
      title: override.title ?? definition.title ?? "Bloc de travail à qualifier",
      description: override.description ?? definition.description ?? "",
      start_at: start.toISOString(),
      end_at: end.toISOString(),
      durationMs: definition.durationMin * 60000,
      day_key: formatDateInput(start),
      suggested_category: baseCategory,
      suggested_tags: baseTags,
      validated_category: validatedCategory,
      validated_tags: dedupePreservingOrder(validatedTags),
      matching_confidence: definition.matching_confidence ?? inferred.matching_confidence ?? (baseCategory ? Math.max(0.58, 0.86 - (index % 4) * 0.08) : 0.24),
      status,
      updated_at: override.updated_at ?? null,
    };
  };

  if (weekOffset === 1) {
    const nextWeekDefinitions = [
      {
        key: "gw1-verifier-stockage",
        dayOffset: 0,
        hour: 0,
        minute: 0,
        durationMin: 15,
        title: "Vérifier l'espace de stockage sur le fichier",
        source_event_id: "2q6e8j9crgnv4vqjr95j5o4c7u_20260427T073000Z",
        source_calendar_id: "eduardo@cargonautes.fr",
      },
      {
        key: "gw1-point-entrepot",
        dayOffset: 0,
        hour: 9,
        minute: 30,
        durationMin: 60,
        title: "Point entrepôt",
        source_event_id: "2q6e8j9crgnv4vqjr95j5o4c7u_20260427T073000Z",
        source_calendar_id: "eduardo@cargonautes.fr",
      },
      {
        key: "gw1-indisponible",
        dayOffset: 0,
        hour: 12,
        minute: 0,
        durationMin: 150,
        title: "Indisponible",
        source_event_id: "30mhlh6h4322kuk9f0icsa04c0_20260427T100000Z",
        source_calendar_id: "eduardo@cargonautes.fr",
      },
      {
        key: "gw1-shift-entrepot",
        dayOffset: 2,
        hour: 9,
        minute: 0,
        durationMin: 240,
        title: "Shift Entrepôt",
        source_event_id: "3h81cv9jt98158auc5dvg15ghn",
        source_calendar_id: "eduardo@cargonautes.fr",
      },
      {
        key: "gw1-point-operationnel",
        dayOffset: 2,
        hour: 12,
        minute: 30,
        durationMin: 30,
        title: "Point opérationnel Cargonautes",
        source_event_id: "1ft1jkr1nkhadikm9kq1b65h80_20260429T103000Z",
        source_calendar_id: "eduardo@cargonautes.fr",
      },
      {
        key: "gw1-reunion-entrepot",
        dayOffset: 3,
        hour: 13,
        minute: 0,
        durationMin: 60,
        title: "Réunion entrepôt",
        source_event_id: "62na35r1kc017plnlhe4o6tklv",
        source_calendar_id: "eduardo@cargonautes.fr",
      },
      {
        key: "gw1-shift-coursier",
        dayOffset: 5,
        hour: 7,
        minute: 0,
        durationMin: 300,
        title: "Shift coursier",
        source_event_id: "1f5ud34r4478k6lmhuugb07m2t",
        source_calendar_id: "eduardo@cargonautes.fr",
      },
    ];

    return nextWeekDefinitions.map(buildPlannedMockEvent);
  }

  const memories = getProjectMemories(collaborator).slice(0, 6);
  const fallbackRows = getSessionsForCollaborator(collaborator)
    .slice()
    .sort((left, right) => new Date(right.start) - new Date(left.start))
    .slice(0, 6)
    .map((session, index) => ({
      key: `fallback-${index}`,
      title: session.task || session.project || "Bloc de travail à qualifier",
      description: session.notes ?? "",
      suggested_category: [...(session.categories ?? []).slice(0, 1)][0] ?? "",
      suggested_tags: [...(session.tags ?? [])],
    }));
  const sources = memories.length
    ? memories.map((memory, index) => ({
        key: memory.key || `memory-${index}`,
        title: memory.task || memory.project || "Bloc de travail à qualifier",
        description: memory.notes ?? "",
        suggested_category: memory.categories?.[0] ?? "",
        suggested_tags: [...(memory.tags ?? [])],
      }))
    : fallbackRows;
  if (!sources.length) {
    return [];
  }

  const slotSets = [
    [
      { key: "s1", dayOffset: 1, hour: 9, minute: 30, durationMin: 60 },
      { key: "s2", dayOffset: 2, hour: 11, minute: 0, durationMin: 90 },
      { key: "s3", dayOffset: 3, hour: 14, minute: 0, durationMin: 60 },
      { key: "s4", dayOffset: 4, hour: 10, minute: 30, durationMin: 75 },
    ],
    [
      { key: "s1", dayOffset: 1, hour: 8, minute: 45, durationMin: 75 },
      { key: "s2", dayOffset: 2, hour: 10, minute: 15, durationMin: 60 },
      { key: "s3", dayOffset: 3, hour: 13, minute: 30, durationMin: 90 },
      { key: "s4", dayOffset: 4, hour: 15, minute: 0, durationMin: 60 },
      { key: "s5", dayOffset: 5, hour: 9, minute: 0, durationMin: 45 },
    ],
    [
      { key: "s1", dayOffset: 1, hour: 9, minute: 0, durationMin: 45 },
      { key: "s2", dayOffset: 2, hour: 11, minute: 30, durationMin: 120 },
      { key: "s3", dayOffset: 3, hour: 15, minute: 15, durationMin: 60 },
      { key: "s4", dayOffset: 4, hour: 10, minute: 0, durationMin: 90 },
    ],
  ];
  const slots = slotSets[weekOffset % slotSets.length];

  return slots.map((slot, index) => {
    const source = sources[(index + weekOffset) % sources.length];
    return buildPlannedMockEvent(
      {
        ...slot,
        title: source.title,
        description: source.description,
        suggested_category: source.suggested_category,
        suggested_tags: source.suggested_tags,
        status: source.suggested_category ? (index % 3 === 2 ? "validated" : "suggested") : "pending",
      },
      index,
    );
  });
}

function openPlannedDialog(plannedEvent) {
  if (!plannedDialog) {
    return;
  }
  plannedEditingEventId = plannedEvent.id;
  plannedEditingEvent = plannedEvent;
  setPlannedDialogStatus("");
  plannedSubjectInput.value = plannedEvent.title || "";
  plannedTaskInput.value = plannedEvent.task || "";
  plannedCurrentCategories = getPlannedEventDisplayCategory(plannedEvent) ? [getPlannedEventDisplayCategory(plannedEvent)] : [];
  plannedCurrentTags = getPlannedEventEditableTags(plannedEvent);
  renderPlannedCategoryTokens();
  plannedNotionInput.value = plannedEvent.notionRef || extractFirstUrl(plannedEvent.description || "") || "";
  plannedNotesInput.value = plannedEvent.notes || plannedEvent.description || "";
  plannedObjectivePoleInput.value = plannedEvent.objectivePole || "";
  plannedObjectiveOkrInput.value = plannedEvent.objectiveOkr || "";
  plannedObjectiveKrInput.value = plannedEvent.objectiveKr || "";
  renderPlannedTagTokens();
  renderObjectiveSelections();
  plannedDialogSubtitle.textContent = `${formatPlannedEventWeekday(plannedEvent.start_at)} · ${formatPlannedEventTime(plannedEvent)}`;
  syncPlannedDialogSuggestion(plannedEvent);
  plannedDialog.showModal();
  requestAnimationFrame(() => plannedSubjectInput.focus());
}

function resetPlannedDialog() {
  plannedEditingEventId = null;
  plannedEditingEvent = null;
  setPlannedDialogStatus("");
  plannedSubjectInput.value = "";
  plannedTaskInput.value = "";
  plannedCurrentCategories = [];
  plannedCategoryInput.value = "";
  plannedCurrentTags = [];
  renderPlannedCategoryTokens();
  plannedNotionInput.value = "";
  plannedNotesInput.value = "";
  plannedObjectivePoleInput.value = "";
  plannedObjectiveOkrInput.value = "";
  plannedObjectiveKrInput.value = "";
  renderPlannedTagTokens();
  renderObjectiveSelections();
  plannedDialogSubtitle.textContent = "";
  syncPlannedDialogSuggestion(null);
}

function closePlannedDialog() {
  plannedDialog?.close();
}

function buildPlannedSessionDraft() {
  if (!plannedEditingEvent) {
    return null;
  }

  const collaborator = plannedEditingEvent.collaborator || getCurrentCollaborator() || accessProfile.appUser?.user_name || "";
  const project = plannedSubjectInput.value.trim();
  const task = plannedTaskInput.value.trim();
  const start = new Date(plannedEditingEvent.start_at);
  const end = new Date(plannedEditingEvent.end_at);
  const normalized = normalizeCategoryAndTags(
    [...plannedCurrentCategories, ...parseTokenString(plannedCategoryInput.value)],
    dedupePreservingOrder([...plannedCurrentTags, ...parseTokenString(plannedTagsInput.value)]),
  );

  if (!collaborator) {
    setPlannedDialogStatus("Choisissez votre nom pour rattacher cet événement à un collaborateur.", "warning");
    return null;
  }
  if (!project) {
    setPlannedDialogStatus("Le sujet est requis pour créer une entrée réelle.", "error");
    plannedSubjectInput.focus();
    return null;
  }
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    setPlannedDialogStatus("Les horaires importés sont invalides pour cet événement.", "error");
    return null;
  }

  return {
    id: createSessionId(),
    collaborator,
    project,
    task,
    categories: normalized.categories,
    tags: normalized.tags,
    notionRef: plannedNotionInput.value.trim(),
    objectivePole: plannedObjectivePoleInput.value.trim(),
    objectiveOkr: plannedObjectiveOkrInput.value.trim(),
    objectiveKr: plannedObjectiveKrInput.value.trim(),
    notes: plannedNotesInput.value.trim(),
    start: start.toISOString(),
    end: end.toISOString(),
    durationMs: Math.max(end.getTime() - start.getTime(), 0),
  };
}

function applyPlannedEventDecision(mode) {
  if (!plannedEditingEventId) {
    return;
  }

  setPlannedDialogStatus("");
  const basePayload = {
    title: plannedSubjectInput.value.trim(),
    task: plannedTaskInput.value.trim(),
    description: plannedNotesInput.value.trim(),
    notionRef: plannedNotionInput.value.trim(),
    objectivePole: plannedObjectivePoleInput.value.trim(),
    objectiveOkr: plannedObjectiveOkrInput.value.trim(),
    objectiveKr: plannedObjectiveKrInput.value.trim(),
    validated_category: plannedCurrentCategories[0] ?? plannedCategoryInput.value.trim(),
    validated_tags: dedupePreservingOrder([...plannedCurrentTags, ...parseTokenString(plannedTagsInput.value)]),
    updated_at: new Date().toISOString(),
  };

  if (mode === "validated") {
    const plannedSession = buildPlannedSessionDraft();
    if (!plannedSession) {
      return;
    }

    attemptSaveSession(plannedSession, {
      onSuccess: (sessionToSave) => {
        upsertSession(sessionToSave);
        persistSessions();
        void logSessionChange(null, sessionToSave, "planned-import-validate");
        void syncSessionToSupabase(sessionToSave, "planned-import");

        plannedEventOverrides[plannedEditingEventId] = {
          ...(plannedEventOverrides[plannedEditingEventId] ?? {}),
          ...basePayload,
          status: "integrated",
          integrated_session_id: sessionToSave.id,
          integrated_at: new Date().toISOString(),
        };
        storePlannedEventOverrides(plannedEventOverrides);
        closePlannedDialog();
        render();
      },
    });
    return;
  }

  plannedEventOverrides[plannedEditingEventId] = {
    ...(plannedEventOverrides[plannedEditingEventId] ?? {}),
    ...basePayload,
    status: mode,
  };
  storePlannedEventOverrides(plannedEventOverrides);
  closePlannedDialog();
  renderCadreViews();
}

function loadStoredPlannedCalendarSnapshots() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(PLANNED_CALENDAR_SNAPSHOTS_KEY) ?? "[]");
    const storedRows = sanitizePlannedCalendarSnapshots(Array.isArray(stored) ? stored : []);
    return mergePlannedCalendarSnapshots(SEEDED_PLANNED_CALENDAR_SNAPSHOTS, storedRows);
  } catch {
    return [...SEEDED_PLANNED_CALENDAR_SNAPSHOTS];
  }
}

function storePlannedCalendarSnapshots(value) {
  try {
    window.localStorage.setItem(PLANNED_CALENDAR_SNAPSHOTS_KEY, JSON.stringify(value));
  } catch {
    // ignore local storage errors
  }
}

function loadCalendarIcsUrls() {
  try {
    const stored = JSON.parse(window.localStorage.getItem(CALENDAR_ICS_URLS_KEY) ?? "{}");
    return typeof stored === "object" && stored !== null && !Array.isArray(stored) ? stored : {};
  } catch {
    return {};
  }
}

function storeCalendarIcsUrls(urls) {
  try {
    window.localStorage.setItem(CALENDAR_ICS_URLS_KEY, JSON.stringify(urls));
  } catch {
    // ignore
  }
}

function getCalendarIcsUrl(collaborator) {
  return calendarIcsUrlsByCollaborator[normalizeText(collaborator || "")] ?? "";
}

async function saveCalendarIcsUrl(collaborator, url) {
  const key = normalizeText(collaborator || "");
  if (!key) return;
  calendarIcsUrlsByCollaborator[key] = url;
  storeCalendarIcsUrls(calendarIcsUrlsByCollaborator);
  await syncSharedUiPreference(CALENDAR_ICS_PREFERENCE_KEY, collaborator, url);
}

async function syncGoogleCalendar(collaborator) {
  const icsUrl = getCalendarIcsUrl(collaborator);
  if (!icsUrl) {
    setAuthStatusMessage("Aucune URL iCal configurée. Collez-la dans votre profil.", "warning", { persistMs: 3500 });
    return;
  }

  setAuthStatusMessage("Synchronisation du calendrier…", "neutral");

  try {
    const proxyUrl = `/api/calendar-proxy?url=${encodeURIComponent(icsUrl)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || `HTTP ${response.status}`);
    }
    const { events } = await response.json();
    if (!Array.isArray(events) || events.length === 0) {
      setAuthStatusMessage("Aucun événement trouvé dans ce calendrier.", "warning", { persistMs: 3200 });
      return;
    }

    // Group events by week
    const snapshotsByWeek = new Map();
    for (const event of events) {
      const startDate = new Date(event.start_at);
      if (Number.isNaN(startDate.getTime())) continue;
      const weekStart = formatDateInput(getStartOfWeek(startDate));
      if (!snapshotsByWeek.has(weekStart)) {
        snapshotsByWeek.set(weekStart, []);
      }
      const durationMs = new Date(event.end_at).getTime() - startDate.getTime();
      if (durationMs <= 0) continue;
      const inferred = inferPlannedSuggestionFromTitle(event.title || "");
      snapshotsByWeek.get(weekStart).push({
        id: `gcal-${normalizeComparableText(collaborator)}-${normalizeComparableText(event.uid || event.title || weekStart)}`,
        source: "google_calendar",
        source_event_id: event.uid || "",
        source_calendar_id: icsUrl,
        collaborator,
        title: event.title || "Sans titre",
        description: event.description || "",
        start_at: event.start_at,
        end_at: event.end_at,
        durationMs,
        day_key: formatDateInput(startDate),
        all_day: event.all_day || false,
        suggested_category: inferred.suggested_category ?? "",
        suggested_tags: inferred.suggested_tags ?? [],
        validated_category: "",
        validated_tags: [],
        matching_confidence: inferred.matching_confidence ?? 0.3,
        status: inferred.suggested_category ? "suggested" : "pending",
        updated_at: null,
      });
    }

    const newSnapshots = [];
    for (const [weekStart, weekEvents] of snapshotsByWeek.entries()) {
      if (weekEvents.length === 0) continue;
      newSnapshots.push({
        collaborator,
        source: "google_calendar",
        source_calendar_id: icsUrl,
        week_start: weekStart,
        imported_at: new Date().toISOString(),
        events: weekEvents,
      });
    }

    // Read raw stored rows (without seeded), replace existing for this collaborator+icsUrl
    let storedRows = [];
    try {
      const raw = JSON.parse(window.localStorage.getItem(PLANNED_CALENDAR_SNAPSHOTS_KEY) ?? "[]");
      storedRows = sanitizePlannedCalendarSnapshots(Array.isArray(raw) ? raw : []);
    } catch {
      storedRows = [];
    }
    const filtered = storedRows.filter(
      (s) => !(normalizeText(s.collaborator) === normalizeText(collaborator) && s.source_calendar_id === icsUrl),
    );
    const updated = [...filtered, ...newSnapshots];
    storePlannedCalendarSnapshots(updated);
    plannedCalendarSnapshots = loadStoredPlannedCalendarSnapshots();

    const eventCount = events.length;
    const weekCount = snapshotsByWeek.size;
    setAuthStatusMessage(
      `${eventCount} événement${eventCount !== 1 ? "s" : ""} importé${eventCount !== 1 ? "s" : ""} (${weekCount} semaine${weekCount !== 1 ? "s" : ""}).`,
      "success",
      { persistMs: 3500 },
    );
    render();
  } catch (err) {
    console.error("Google Calendar sync failed:", err);
    setAuthStatusMessage("Erreur lors de la synchronisation du calendrier.", "error", { persistMs: 4000 });
  }
}

function sanitizePlannedCalendarSnapshots(rows) {
  return (rows ?? [])
    .filter((row) => row && row.collaborator && row.week_start && row.source_calendar_id)
    .map((row) => ({
      ...row,
      events: (row.events ?? []).filter((event) => isValidPlannedSnapshotEvent(event)),
    }))
    .filter((row) => row.events.length > 0);
}

function isLikelyBrokenPlannedSnapshotTitle(value) {
  const normalized = normalizeComparableText(value);
  return normalized === "success no rows returned" || normalized === "no rows returned";
}

function isValidPlannedSnapshotEvent(event) {
  if (!event) {
    return false;
  }
  const start = new Date(event.start_at);
  const end = new Date(event.end_at);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
    return false;
  }
  const durationMs = end.getTime() - start.getTime();
  if (durationMs > 12 * 60 * 60 * 1000) {
    return false;
  }
  if (isLikelyBrokenPlannedSnapshotTitle(event.title ?? "")) {
    return false;
  }
  return true;
}

function getPlannedSnapshotQuality(snapshot) {
  return (snapshot?.events ?? []).filter((event) => isValidPlannedSnapshotEvent(event)).length;
}

function mergePlannedCalendarSnapshots(baseRows, overrideRows) {
  const merged = new Map();
  for (const row of [...(baseRows ?? []), ...(overrideRows ?? [])]) {
    if (!row || !row.collaborator || !row.week_start || !row.source_calendar_id) {
      continue;
    }
    const key = `${normalizeComparableText(row.collaborator)}::${row.week_start}::${normalizeComparableText(row.source_calendar_id)}`;
    const previous = merged.get(key);
    if (!previous) {
      merged.set(key, row);
      continue;
    }
    const previousQuality = getPlannedSnapshotQuality(previous);
    const nextQuality = getPlannedSnapshotQuality(row);
    if (nextQuality > previousQuality) {
      merged.set(key, row);
      continue;
    }
    if (nextQuality === previousQuality && nextQuality > 0) {
      const previousImportedAt = new Date(previous.imported_at ?? 0).getTime();
      const nextImportedAt = new Date(row.imported_at ?? 0).getTime();
      if (nextImportedAt >= previousImportedAt) {
        merged.set(key, row);
      }
    }
  }
  return Array.from(merged.values());
}

function buildPlannedImportedEvent(snapshot, event, index) {
  const title = String(event?.title ?? "").trim();
  const inferred = inferPlannedSuggestionFromTitle(title);
  const id = `planned-import-${normalizeComparableText(snapshot.collaborator)}-${normalizeComparableText(snapshot.source_calendar_id)}-${normalizeComparableText(event.source_event_id || `${snapshot.week_start}-${index}`)}`;
  const override = plannedEventOverrides[id] ?? {};
  const status = override.status ?? inferred.status ?? (inferred.suggested_category ? "suggested" : "pending");
  const validatedCategory = override.validated_category ?? (status === "validated" ? inferred.suggested_category : "");
  const validatedTags = override.validated_tags ?? (status === "validated" ? inferred.suggested_tags : []);
  const startAt = !Number.isNaN(new Date(override.start_at ?? "").getTime()) ? override.start_at : event.start_at;
  const endAt = !Number.isNaN(new Date(override.end_at ?? "").getTime()) ? override.end_at : event.end_at;
  return {
    id,
    source: snapshot.source ?? "google_calendar",
    source_event_id: override.source_event_id ?? event.source_event_id ?? id,
    source_calendar_id: override.source_calendar_id ?? snapshot.source_calendar_id,
    collaborator: snapshot.collaborator,
    title: override.title ?? title ?? "Événement importé",
    description: override.description ?? event.description ?? "",
    start_at: startAt,
    end_at: endAt,
    durationMs: Math.max(new Date(endAt).getTime() - new Date(startAt).getTime(), 0),
    day_key: formatDateInput(new Date(startAt)),
    suggested_category: inferred.suggested_category,
    suggested_tags: inferred.suggested_tags,
    validated_category: validatedCategory,
    validated_tags: dedupePreservingOrder(validatedTags),
    matching_confidence: inferred.matching_confidence,
    status,
    updated_at: override.updated_at ?? snapshot.imported_at ?? null,
  };
}

function getImportedPlannedEventsForCollaborator(collaborator, range) {
  const normalizedCollaborator = normalizeText(collaborator);
  const targetWeekStart = formatDateInput(range.start);
  return plannedCalendarSnapshots
    .filter(
      (snapshot) =>
        normalizeText(snapshot.collaborator) === normalizedCollaborator &&
        String(snapshot.week_start ?? "") === targetWeekStart,
    )
    .flatMap((snapshot) =>
      (snapshot.events ?? [])
        .filter((event) => isValidPlannedSnapshotEvent(event))
        .map((event, index) => buildPlannedImportedEvent(snapshot, event, index)),
    )
    .filter((row) => row.status !== "integrated")
    .filter((row) => {
      const start = new Date(row.start_at);
      const end = new Date(row.end_at);
      return !Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end > range.start && start < range.end;
    })
    .sort((left, right) => new Date(left.start_at) - new Date(right.start_at));
}

function loadStoredPlannedEventOverrides() {
  try {
    return JSON.parse(window.localStorage.getItem(PLANNED_EVENTS_OVERRIDES_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function storePlannedEventOverrides(value) {
  try {
    window.localStorage.setItem(PLANNED_EVENTS_OVERRIDES_KEY, JSON.stringify(value));
  } catch {
    // ignore local storage errors
  }
}

function applyAgendaEventColor(element, session) {
  const label = session.categories?.[0] || session.objectivePole || session.project || session.collaborator || "agenda";
  const baseColor = session.categories?.[0]
    ? getCategoryColor(session.categories[0], label)
    : getAgendaCategoryColor(label);
  element.style.setProperty("--agenda-accent", baseColor);
  element.style.background = `${baseColor}22`;
  element.style.borderColor = `${baseColor}30`;
}

function getAgendaCategoryColor(label) {
  const normalized = normalizeText(label);
  const palette = [
    ["delivery", "#069494"],
    ["livraison", "#069494"],
    ["support", "#FFC0CB"],
    ["management", "#FF8243"],
    ["pilotage", "#FF8243"],
    ["interne", "#FCE883"],
    ["internal", "#FCE883"],
    ["learning", "#FCE883"],
    ["formation", "#FCE883"],
    ["business", "#069494"],
    ["bizdev", "#069494"],
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
  const prevRange = getPreviousPeriodRange(anchor, reportPeriod);
  const filterCollaborator = managerCollaboratorFilter.value;
  const allRows = getScopedSessions(getAllSessionsWithActive().filter((session) => isSessionInRange(session, range)));
  const scopedRows =
    filterCollaborator === "all"
      ? allRows
      : allRows.filter((session) => normalizeText(session.collaborator) === normalizeText(filterCollaborator));

  const allPrevRows = getScopedSessions(getAllSessionsWithActive().filter((session) => isSessionInRange(session, prevRange)));
  const prevRows =
    filterCollaborator === "all"
      ? allPrevRows
      : allPrevRows.filter((session) => normalizeText(session.collaborator) === normalizeText(filterCollaborator));

  const usesObjectives = statsMode === "objectives";
  renderManagerSummary(allRows, scopedRows, range, filterCollaborator);

  const currentTotalMs = scopedRows.reduce((sum, s) => sum + (Number(s.durationMs) || 0), 0);
  const prevTotalMs = prevRows.reduce((sum, s) => sum + (Number(s.durationMs) || 0), 0);
  setKpiDelta(reportTotalDelta, currentTotalMs, prevTotalMs);

  const currentProjectRows = buildReportRows(scopedRows, "project");
  const prevProjectRows = buildReportRows(prevRows, "project");
  const topProjectLabel = currentProjectRows[0]?.label;
  setKpiDelta(
    reportTopProjectDelta,
    currentProjectRows[0]?.durationMs ?? 0,
    prevProjectRows.find((r) => r.label === topProjectLabel)?.durationMs ?? 0,
  );

  const managerObjectiveRows = buildObjectiveOkrRows(scopedRows);
  const managerCategoryRows = buildReportRows(scopedRows, "categories");
  const managerDisplayRows = usesObjectives ? managerObjectiveRows : managerCategoryRows;
  const prevCategoryRows = usesObjectives ? buildObjectiveOkrRows(prevRows) : buildReportRows(prevRows, "categories");
  const topCategoryLabel = managerDisplayRows[0]?.label;
  setKpiDelta(
    reportTopCategoryDelta,
    managerDisplayRows[0]?.durationMs ?? 0,
    prevCategoryRows.find((r) => r.label === topCategoryLabel)?.durationMs ?? 0,
  );

  const managerObjectiveTotalMs = managerObjectiveRows.reduce((sum, row) => sum + row.durationMs, 0);
  const managerCategoryTotalMs = scopedRows.reduce((sum, session) => sum + (Number(session.durationMs) || 0), 0);
  managerDistributionTitle.textContent = usesObjectives ? "Répartition OKR" : "Répartition catégories";
  managerDistributionCopy.textContent = usesObjectives
    ? "Poids relatif des objectifs sur la période."
    : "Poids relatif des catégories sur la période.";
  reportCategoryHead.textContent = usesObjectives ? "OKR" : "Categorie";
  managerObjectivesPanel.hidden = !usesObjectives;
  reportKrShell.hidden = !usesObjectives;
  renderDistribution(
    managerDistributionBar,
    managerDistributionLegend,
    managerDisplayRows,
    usesObjectives ? managerObjectiveTotalMs : managerCategoryTotalMs,
    usesObjectives ? "Aucun OKR renseigné sur cette plage." : "Aucune catégorie disponible sur cette plage.",
    {
      onLabelClick: (label) => {
        evolutionFilterLabel = evolutionFilterLabel === label ? null : label;
        renderManagerViews();
        renderResourcesViews();
      },
      activeLabel: evolutionFilterLabel,
    },
  );
  renderEvolutionGrid(evolutionGrid, anchor, filterCollaborator, evolutionFilterLabel);
  if (usesObjectives) {
    renderManagerObjectives(scopedRows);
  } else {
    managerObjectivesGrid.innerHTML = "";
  }
  renderTeamTable(teamReportList, allRows, range, "Aucune donnée équipe sur cette plage.");
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
    usesObjectives ? "Aucun OKR pour cette plage." : "Aucune catégorie pour cette plage.",
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
  const prevRange = getPreviousPeriodRange(anchor, reportPeriod);
  const allRows = getScopedSessions(getAllSessionsWithActive().filter((session) => isSessionInRange(session, range)));
  const prevAllRows = getScopedSessions(getAllSessionsWithActive().filter((session) => isSessionInRange(session, prevRange)));
  const usesObjectives = statsMode === "objectives";
  const totalMs = allRows.reduce((sum, session) => sum + (Number(session.durationMs) || 0), 0);
  const prevTotalMs = prevAllRows.reduce((sum, session) => sum + (Number(session.durationMs) || 0), 0);
  const projectTotals = buildReportRows(allRows, "project");
  const prevProjectTotals = buildReportRows(prevAllRows, "project");
  const objectiveTotals = buildObjectiveOkrRows(allRows);
  const prevObjectiveTotals = buildObjectiveOkrRows(prevAllRows);
  const categoryTotals = buildReportRows(allRows, "categories");
  const prevCategoryTotals = buildReportRows(prevAllRows, "categories");
  const krTotals = buildObjectiveKrRowsFromSessions(allRows);
  const displayRows = usesObjectives ? objectiveTotals : categoryTotals;
  const prevDisplayRows = usesObjectives ? prevObjectiveTotals : prevCategoryTotals;

  resourceTotal.textContent = formatDuration(totalMs);
  resourceRange.textContent = formatPeriodLabel(range.start, range.end, reportPeriod);
  resourceTopProject.textContent = projectTotals[0]?.label ?? "-";
  resourceTopProjectTime.textContent = projectTotals[0] ? formatDuration(projectTotals[0].durationMs) : "0 h 00";
  resourceDistributionTitle.textContent = usesObjectives ? "Répartition globale OKR" : "Répartition globale catégories";
  resourceDistributionCopy.textContent = usesObjectives
    ? "Lecture transversale des objectifs sur la plage choisie."
    : "Lecture transversale des catégories sur la plage choisie.";
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

  setKpiDelta(resourceTotalDelta, totalMs, prevTotalMs);

  const topResProjectLabel = projectTotals[0]?.label;
  setKpiDelta(
    resourceTopProjectDelta,
    projectTotals[0]?.durationMs ?? 0,
    prevProjectTotals.find((r) => r.label === topResProjectLabel)?.durationMs ?? 0,
  );

  const topResCategoryLabel = displayRows[0]?.label;
  setKpiDelta(
    resourceTopCategoryDelta,
    displayRows[0]?.durationMs ?? 0,
    prevDisplayRows.find((r) => r.label === topResCategoryLabel)?.durationMs ?? 0,
  );

  renderDistribution(
    resourceDistributionBar,
    resourceDistributionLegend,
    displayRows,
    totalMs,
    usesObjectives ? "Aucun OKR renseigné sur cette plage." : "Aucune catégorie disponible sur cette plage.",
    {
      colorResolver: (row) => (usesObjectives ? colorForLabel(row.label) : colorForPastelDistributionLabel(row.label)),
      onLabelClick: (label) => {
        evolutionFilterLabel = evolutionFilterLabel === label ? null : label;
        renderManagerViews();
        renderResourcesViews();
      },
      activeLabel: evolutionFilterLabel,
    },
  );
  renderEvolutionGrid(resourceEvolutionGrid, anchor, "all", evolutionFilterLabel);
  if (usesObjectives) {
    renderManagerObjectivesInto(resourceObjectivesGrid, allRows);
  } else {
    resourceObjectivesGrid.innerHTML = "";
  }
  renderTeamTable(resourceTeamList, allRows, range, "Aucune donnée équipe sur cette plage.");
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
    usesObjectives ? "Aucun OKR sur cette plage." : "Aucune catégorie sur cette plage.",
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

function showSaveToast(session, options = {}) {
  const stack = document.querySelector("#toast-stack");
  if (!stack) return;

  const DURATION = options.duration ?? 3000;
  const label = options.label ?? "Enregistré";
  const project = session?.project || session?.title || "";

  const toast = document.createElement("div");
  toast.className = "save-toast";
  toast.setAttribute("role", "status");

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("class", "save-toast-check");
  svg.setAttribute("aria-hidden", "true");
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  circle.setAttribute("cx", "10");
  circle.setAttribute("cy", "10");
  circle.setAttribute("r", "8.5");
  const check = document.createElementNS("http://www.w3.org/2000/svg", "path");
  check.setAttribute("d", "M6.5 10.5l2.5 2.5 4.5-5");
  svg.append(circle, check);

  const body = document.createElement("div");
  body.className = "save-toast-body";
  const labelEl = document.createElement("p");
  labelEl.className = "save-toast-label";
  labelEl.textContent = label;
  body.append(labelEl);
  if (project) {
    const projectEl = document.createElement("p");
    projectEl.className = "save-toast-project";
    projectEl.textContent = project;
    body.append(projectEl);
  }

  const bar = document.createElement("div");
  bar.className = "save-toast-bar";
  bar.style.animationDuration = `${DURATION}ms`;

  toast.append(svg, body, bar);
  stack.append(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("save-toast--in"));
  });

  const dismiss = () => {
    toast.classList.add("save-toast--out");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  };

  const timer = setTimeout(dismiss, DURATION);
  toast.addEventListener("click", () => { clearTimeout(timer); dismiss(); });
}

function renderGuideView() {
  const shell = document.querySelector("#guide-shell");
  if (!shell) return;
  while (shell.firstChild) shell.removeChild(shell.firstChild);

  const collaborator = getCurrentCollaborator();
  const isLoggedIn = Boolean(accessProfile.appUser?.user_name);
  const sessionCount = isLoggedIn ? getSessionsForCollaborator(collaborator).length : 0;
  const hasCalendar = isLoggedIn && Boolean(getCalendarIcsUrl(collaborator));
  const isNew = isLoggedIn && sessionCount < 5;

  if (!isLoggedIn) {
    shell.append(buildGuideForGuest());
  } else if (isNew) {
    shell.append(buildGuideForNewUser(sessionCount, hasCalendar));
  } else {
    shell.append(buildGuideForExistingUser(hasCalendar));
  }
}

function buildGuideForGuest() {
  const root = document.createElement("div");
  root.className = "guide-guest";

  const hero = document.createElement("div");
  hero.className = "guide-hero";
  const title = document.createElement("h1");
  title.textContent = "Bienvenue sur Mordologie";
  const sub = document.createElement("p");
  sub.className = "guide-hero-sub";
  sub.textContent = "Suivi du temps précis pour les équipes terrain. Chaque session est un contexte — projet, tâche, catégorie — qui alimente les analyses et les objectifs.";
  hero.append(title, sub);

  const cta = document.createElement("div");
  cta.className = "guide-cta";
  const ctaIcon = document.createElement("span");
  ctaIcon.className = "guide-cta-icon";
  ctaIcon.setAttribute("aria-hidden", "true");
  ctaIcon.textContent = "↑";
  const ctaText = document.createElement("p");
  ctaText.textContent = "Sélectionnez votre nom dans la liste en haut à gauche pour commencer.";
  cta.append(ctaIcon, ctaText);

  const features = document.createElement("div");
  features.className = "guide-features";

  const featureData = [
    {
      icon: "⏱",
      title: "Chrono précis",
      desc: "Démarre et arrête à tout moment. Remplis le contexte avant ou pendant — la saisie manuelle permet de corriger après coup.",
    },
    {
      icon: "📅",
      title: "Agenda intégré",
      desc: "Vue semaine avec tes sessions tracées et tes réunions Google Calendar superposées. Glisse un bloc pour ajuster les horaires.",
    },
    {
      icon: "📊",
      title: "Analyses d'équipe",
      desc: "Rapports hebdo / mensuel / annuel par collaborateur, catégorie, projet ou objectif OKR. Zéro export manuel.",
    },
  ];

  for (const f of featureData) {
    const card = document.createElement("div");
    card.className = "guide-feature-card";
    const icon = document.createElement("span");
    icon.className = "guide-feature-icon";
    icon.textContent = f.icon;
    const h = document.createElement("h3");
    h.textContent = f.title;
    const p = document.createElement("p");
    p.textContent = f.desc;
    card.append(icon, h, p);
    features.append(card);
  }

  root.append(hero, cta, features);
  return root;
}

function buildGuideForNewUser(sessionCount, hasCalendar) {
  const root = document.createElement("div");
  root.className = "guide-onboarding";

  const head = document.createElement("div");
  head.className = "guide-onboarding-head";
  const title = document.createElement("h2");
  title.textContent = "Premiers pas";
  const sub = document.createElement("p");
  sub.className = "guide-onboarding-sub";
  sub.textContent = "Suis ces étapes pour tirer le meilleur de l'outil dès le premier jour.";
  head.append(title, sub);

  const steps = [
    {
      done: true,
      label: "Profil sélectionné",
      detail: "Tu es connecté. Tes sessions sont enregistrées à ton nom et synchronisées avec le serveur.",
    },
    {
      done: sessionCount > 0,
      label: "Lancer ton premier chrono",
      detail: "Remplis Sujet + Catégorie, clique ▶ Démarrer. Arrête quand tu finis. Un toast confirme l'enregistrement en bas à droite.",
      action: { label: "Aller saisir", view: "cadre" },
    },
    {
      done: hasCalendar,
      label: "Connecter Google Calendar",
      detail: "Dans ton profil (avatar en haut), colle l'URL iCal privée de ton Google Calendar (Paramètres → Agendas → Adresse secrète au format iCal). Puis clique « Sync calendrier » dans la vue Agenda.",
    },
    {
      done: sessionCount >= 3,
      label: "Explorer les analyses",
      detail: "La vue Gandalf montre la répartition du temps. Passe le curseur sur une barre de catégorie pour voir les tags détaillés de cette catégorie.",
      action: { label: "Voir les analyses", view: "manager" },
    },
  ];

  const list = document.createElement("ol");
  list.className = "guide-steps";

  for (const step of steps) {
    const li = document.createElement("li");
    li.className = "guide-step" + (step.done ? " guide-step--done" : "");

    const check = document.createElement("span");
    check.className = "guide-step-check";
    check.setAttribute("aria-hidden", "true");
    check.textContent = step.done ? "✓" : "";

    const body = document.createElement("div");
    body.className = "guide-step-body";

    const label = document.createElement("strong");
    label.textContent = step.label;

    const detail = document.createElement("p");
    detail.textContent = step.detail;

    body.append(label, detail);

    if (step.action && !step.done) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-secondary guide-step-btn";
      btn.textContent = step.action.label;
      const targetView = step.action.view;
      btn.addEventListener("click", () => {
        const tab = document.querySelector(`[data-view-target="${targetView}"]`);
        tab?.click();
      });
      body.append(btn);
    }

    li.append(check, body);
    list.append(li);
  }

  root.append(head, list);
  return root;
}

function buildGuideForExistingUser(hasCalendar) {
  const root = document.createElement("div");
  root.className = "guide-tips";

  const head = document.createElement("div");
  head.className = "guide-tips-head";
  const title = document.createElement("h2");
  title.textContent = "Astuces & raccourcis";
  const sub = document.createElement("p");
  sub.className = "guide-tips-sub";
  sub.textContent = "Ce que la plupart des utilisateurs découvrent trop tard.";
  head.append(title, sub);

  const tips = [
    {
      icon: "↕",
      title: "Agenda : déplacer & redimensionner",
      desc: "Glisse un bloc pour le déplacer sur la semaine. Étire la poignée en haut ou en bas pour ajuster le début ou la fin — tout sans ouvrir de formulaire.",
    },
    {
      icon: "✏️",
      title: "Édition inline des chips",
      desc: "Double-clic sur un tag ou une catégorie dans le formulaire pour l'éditer directement sur place. Entrée pour valider, Échap pour annuler.",
    },
    {
      icon: "📊",
      title: "Survol des graphiques",
      desc: "Dans Hobbit et Gandalf, passe le curseur sur une catégorie (barre ou légende du donut) : un tooltip liste tous les tags utilisés dans cette catégorie.",
    },
    {
      icon: "#",
      title: "Tags : renommer & fusionner",
      desc: "Dans le panneau latéral du Journal, tu peux renommer un tag sur tout l'historique ou le fusionner dans un autre — utile pour corriger une saisie passée.",
    },
    {
      icon: "📅",
      title: hasCalendar ? "Sync Google Calendar active" : "Connecter Google Calendar",
      desc: hasCalendar
        ? "Clique « Sync calendrier » dans l'Agenda pour importer les événements de la semaine. Clique un événement fantôme pour le convertir en vraie session qualifiée."
        : "Colle l'URL iCal privée de ton Google Calendar dans ton profil. Tes réunions apparaîtront dans l'Agenda comme suggestions à valider en un clic.",
    },
    {
      icon: "🎯",
      title: "Lier à un objectif OKR",
      desc: "Déplie la section « Objectifs » dans le formulaire pour rattacher chaque session à un Pôle, un OKR et un KR. Les analyses reflètent alors où va réellement le temps.",
    },
    {
      icon: "⚡",
      title: "Clic sur l'agenda pour pré-remplir",
      desc: "Clique sur n'importe quelle heure vide dans l'Agenda pour ouvrir la saisie avec début et fin déjà positionnés.",
    },
    {
      icon: "🧠",
      title: "Mémoire des projets",
      desc: "L'app retient tes projets récents avec leurs catégories et tags. Le panneau latéral les propose pour une saisie en un clic — sans retaper à chaque fois.",
    },
  ];

  const grid = document.createElement("div");
  grid.className = "guide-tips-grid";

  for (const tip of tips) {
    const card = document.createElement("div");
    card.className = "guide-tip-card";
    const icon = document.createElement("span");
    icon.className = "guide-tip-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = tip.icon;
    const h = document.createElement("h3");
    h.textContent = tip.title;
    const p = document.createElement("p");
    p.textContent = tip.desc;
    card.append(icon, h, p);
    grid.append(card);
  }

  root.append(head, grid);
  return root;
}

function renderUsersAdmin() {
  if (!usersAdminShell) {
    return;
  }

  usersAdminShell.innerHTML = "";

  if (getAccessRole() !== "admin") {
    usersAdminShell.append(createEmptyState("Cette vue est reservee a l'administration."));
    return;
  }

  const rows = [...referenceCatalog.users].sort((left, right) => left.user_name.localeCompare(right.user_name, "fr"));
  const head = document.createElement("div");
  head.className = "users-admin-head";

  const addButton = document.createElement("button");
  addButton.type = "button";
  addButton.className = "btn btn-primary";
  addButton.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6.5 1v11M1 6.5h11"/></svg> Ajouter`;
  addButton.addEventListener("click", () => {
    usersAdminEditingId = "__new__";
    usersAdminDraft = createUsersAdminDraft();
    renderUsersAdmin();
  });

  head.append(addButton);
  usersAdminShell.append(head);

  const list = document.createElement("div");
  list.className = "users-admin-list";

  if (usersAdminEditingId === "__new__" && usersAdminDraft) {
    list.append(renderUsersAdminEditorCard(null, true));
  }

  if (!rows.length && usersAdminEditingId !== "__new__") {
    list.append(createEmptyState("Aucun utilisateur actif pour le moment."));
  } else {
    for (const user of rows) {
      const isEditing = usersAdminEditingId === user.user_id;
      list.append(isEditing ? renderUsersAdminEditorCard(user, false) : renderUsersAdminDisplayCard(user));
    }
  }

  usersAdminShell.append(list);
}

function createUsersAdminDraft(user = null) {
  const defaultTeamName =
    accessProfile.appUser?.team_name ||
    accessProfile.appUser?.managed_team_name ||
    user?.team_name ||
    "Equipe";

  return {
    user_id: user?.user_id ?? null,
    user_name: user?.user_name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "cadre",
    team_name: user?.team_name ?? defaultTeamName,
    managed_team_name: user?.managed_team_name ?? "",
    confirm_delete: false,
    statusMessage: "",
    statusTone: "error",
  };
}

function renderUsersAdminDisplayCard(user) {
  const card = document.createElement("article");
  card.className = "users-user-card users-user-row";

  const identity = document.createElement("div");
  identity.className = "users-row-identity";
  const avatar = document.createElement("span");
  avatar.className = "users-avatar";
  avatar.textContent = getUserAvatarMonogram(user.user_name ?? "?");
  const nameCopy = document.createElement("div");
  nameCopy.className = "users-row-copy";
  const nameEl = document.createElement("strong");
  nameEl.textContent = user.user_name ?? "Sans nom";
  const statusDot = document.createElement("span");
  statusDot.className = `users-status-dot users-status-dot--${user.status === "active" ? "active" : "inactive"}`;
  statusDot.title = user.status === "active" ? "Actif" : "Inactif";
  nameCopy.append(nameEl, statusDot);
  identity.append(avatar, nameCopy);

  const emailEl = document.createElement("span");
  emailEl.className = "users-row-email muted-copy";
  emailEl.textContent = user.email || "—";

  const roleBadge = document.createElement("span");
  roleBadge.className = `pill users-role-badge users-role-badge--${user.role ?? "cadre"}`;
  roleBadge.textContent = formatUsersRoleLabel(user.role ?? "cadre");

  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "btn users-edit-btn";
  editButton.title = `Modifier ${user.user_name ?? ""}`;
  editButton.setAttribute("aria-label", `Modifier ${user.user_name ?? ""}`);
  editButton.innerHTML = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z"/></svg>`;
  editButton.addEventListener("click", () => {
    usersAdminEditingId = user.user_id;
    usersAdminDraft = createUsersAdminDraft(user);
    renderUsersAdmin();
  });

  card.append(identity, emailEl, roleBadge, editButton);
  return card;
}

function createUsersAdminDisplayField(labelText, valueText, metaText = "") {
  const field = document.createElement("div");
  field.className = "users-display-field";

  const label = document.createElement("span");
  label.className = "users-display-label";
  label.textContent = labelText;

  const value = document.createElement("strong");
  value.textContent = valueText;

  field.append(label, value);
  if (metaText) {
    const meta = document.createElement("span");
    meta.className = "muted-copy";
    meta.textContent = metaText;
    field.append(meta);
  }

  return field;
}

function renderUsersAdminEditorCard(user, isNew) {
  const draft = usersAdminDraft ?? createUsersAdminDraft(user);
  const card = document.createElement("article");
  card.className = "users-user-card users-user-card--editing";

  const grid = document.createElement("div");
  grid.className = "users-edit-grid";

  const nameField = createUsersAdminInputField("Personne", "text", draft.user_name, "Ex. Paulo");
  nameField.input.addEventListener("input", (event) => {
    usersAdminDraft.user_name = event.target.value;
    clearUsersAdminDraftTransientState();
  });

  const emailField = createUsersAdminInputField("Email", "email", draft.email, "prenom@domaine.fr");
  emailField.input.addEventListener("input", (event) => {
    usersAdminDraft.email = event.target.value;
    clearUsersAdminDraftTransientState();
  });

  const roleField = document.createElement("label");
  roleField.className = "field";
  const roleLabel = document.createElement("span");
  roleLabel.textContent = "Role";
  const roleSelect = document.createElement("select");
  roleSelect.className = "select-input users-role-select";
  [
    ["cadre", "Utilisateur normal"],
    ["manager", "Manager"],
    ["admin", "Admin"],
  ].forEach(([value, label]) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    roleSelect.append(option);
  });
  roleSelect.value = draft.role;
  roleSelect.addEventListener("change", (event) => {
    usersAdminDraft.role = event.target.value;
    clearUsersAdminDraftTransientState();
  });
  roleField.append(roleLabel, roleSelect);

  grid.append(nameField.field, emailField.field, roleField);

  const status = document.createElement("p");
  status.className = "users-edit-status";
  status.hidden = !draft.statusMessage;
  status.textContent = draft.statusMessage || "";
  status.dataset.tone = draft.statusMessage ? draft.statusTone || "error" : "";

  const actions = document.createElement("div");
  actions.className = "dialog-actions users-edit-actions";

  if (!isNew) {
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "btn btn-ghost-danger dialog-action-danger";
    deleteButton.textContent = draft.confirm_delete ? "Confirmer la suppression" : "Supprimer";
    deleteButton.addEventListener("click", async () => {
      if (!usersAdminDraft.confirm_delete) {
        usersAdminDraft.confirm_delete = true;
        renderUsersAdmin();
        return;
      }
      await deleteManagedUser(user);
    });
    actions.append(deleteButton);
  }

  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "btn btn-secondary";
  cancelButton.textContent = "Annuler";
  cancelButton.addEventListener("click", () => {
    usersAdminEditingId = null;
    usersAdminDraft = null;
    renderUsersAdmin();
  });

  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.className = "btn btn-primary";
  saveButton.textContent = isNew ? "Creer" : "Enregistrer";
  saveButton.addEventListener("click", async () => {
    await saveManagedUser(user, isNew);
  });

  actions.append(cancelButton, saveButton);
  card.append(grid, status, actions);
  return card;
}

function createUsersAdminInputField(labelText, type, value, placeholder = "") {
  const field = document.createElement("label");
  field.className = "field";
  const label = document.createElement("span");
  label.textContent = labelText;
  const input = document.createElement("input");
  input.type = type;
  input.value = value;
  input.placeholder = placeholder;
  field.append(label, input);
  return { field, input };
}

function formatUsersRoleLabel(role) {
  return (
    {
      cadre: "Utilisateur normal",
      manager: "Manager",
      admin: "Admin",
    }[role] ?? "Utilisateur normal"
  );
}

function validateManagedUserDraft(draft, user = null) {
  const userName = draft.user_name.trim();
  const email = draft.email.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const duplicateName = referenceCatalog.users.find((item) =>
    item.user_id !== (user?.user_id ?? null) && normalizeComparableText(item.user_name) === normalizeComparableText(userName),
  );
  const duplicateEmail = email
    ? referenceCatalog.users.find((item) =>
        item.user_id !== (user?.user_id ?? null) && normalizeText(item.email || "") === normalizeText(email),
      )
    : null;

  if (!userName) {
    return { ok: false, message: "Le nom de la personne est requis." };
  }
  if (duplicateName) {
    return { ok: false, message: "Ce nom est déjà utilisé. Choisissez un nom unique pour éviter les collisions de profil." };
  }
  if (email && !emailPattern.test(email)) {
    return { ok: false, message: "L'adresse email semble invalide." };
  }
  if (duplicateEmail) {
    return { ok: false, message: "Cette adresse e-mail est déjà associée à un autre utilisateur." };
  }

  return {
    ok: true,
    userName,
    email,
  };
}

async function saveManagedUser(user, isNew) {
  if (!usersAdminDraft) {
    return false;
  }
  if (!window.supabase) {
    return failUsersAdminDraft("La synchronisation distante est indisponible pour le moment.");
  }

  const validation = validateManagedUserDraft(usersAdminDraft, user);
  if (!validation.ok) {
    return failUsersAdminDraft(validation.message);
  }

  const { userName, email } = validation;

  const basePayload = {
    user_name: userName,
    email: email || null,
    role: usersAdminDraft.role || "cadre",
    team_name: usersAdminDraft.team_name,
    managed_team_name: usersAdminDraft.role === "manager" ? usersAdminDraft.team_name : null,
    updated_at: new Date().toISOString(),
  };

  let error = null;
  if (isNew) {
    const nextId = await getNextPrefixedId("users", "user_id", "USR-", 3);
    if (!nextId) {
      return failUsersAdminDraft("Impossible de preparer le nouvel utilisateur.");
    }

    ({ error } = await window.supabase.from("users").insert([
      {
        user_id: nextId,
        ...basePayload,
        weekly_capacity_hours: 40,
        status: "active",
      },
    ]));
  } else {
    ({ error } = await window.supabase
      .from("users")
      .update(basePayload)
      .eq("user_id", user.user_id));
  }

  if (error) {
    console.error("Users save failed:", error);
    return failUsersAdminDraft("Impossible d'enregistrer cet utilisateur pour le moment.");
  }

  await ensureReferenceCatalogLoaded(true);
  if (accessProfile.appUser?.user_id === user?.user_id) {
    const refreshedCurrentUser = findKnownUserByName(userName) ?? accessProfile.appUser;
    accessProfile = {
      ...accessProfile,
      role: basePayload.role,
      appUser: refreshedCurrentUser,
    };
    storeLocalRescueName(refreshedCurrentUser.user_name);
  }

  usersAdminEditingId = null;
  usersAdminDraft = null;
  setAuthStatusMessage(isNew ? "Utilisateur cree." : "Utilisateur mis a jour.", "success", { persistMs: 2400 });
  render();
  return true;
}

async function deleteManagedUser(user) {
  if (!window.supabase || !user?.user_id) {
    return failUsersAdminDraft("La synchronisation distante est indisponible pour le moment.");
  }
  if (accessProfile.appUser?.user_id === user.user_id) {
    return failUsersAdminDraft("Impossible de supprimer le profil actuellement utilise.", "warning");
  }

  let { error } = await window.supabase.from("users").delete().eq("user_id", user.user_id);
  if (error?.code === "23503") {
    ({ error } = await window.supabase
      .from("users")
      .update({ status: "inactive", updated_at: new Date().toISOString() })
      .eq("user_id", user.user_id));
    if (!error) {
      await ensureReferenceCatalogLoaded(true);
      usersAdminEditingId = null;
      usersAdminDraft = null;
      setAuthStatusMessage("Utilisateur retire de la liste active.", "success", { persistMs: 2400 });
      render();
      return true;
    }
  }

  if (error) {
    console.error("Users delete failed:", error);
    return failUsersAdminDraft("Impossible de supprimer cet utilisateur pour le moment.");
  }

  await ensureReferenceCatalogLoaded(true);
  usersAdminEditingId = null;
  usersAdminDraft = null;
  setAuthStatusMessage("Utilisateur supprime.", "success", { persistMs: 2400 });
  render();
  return true;
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
  link.download = `mordologie-${scope}-${reportPeriod}-${formatDateInput(anchor)}.csv`;
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
    container.append(createEmptyState("Les objectifs suivis apparaîtront ici."));
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
    return "conic-gradient(rgba(255, 192, 203, 0.22) 0deg 360deg)";
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

function setKpiDelta(el, currentMs, previousMs) {
  if (!el) return;
  if (!previousMs) {
    el.hidden = true;
    return;
  }
  const ratio = (currentMs - previousMs) / previousMs;
  const pct = ratio * 100;
  const absRounded = Math.round(Math.abs(pct));
  const sign = pct > 1 ? "+" : pct < -1 ? "−" : "";
  el.textContent = absRounded < 1 ? "≈ 0 %" : `${sign}${absRounded} %`;
  el.className = `kpi-delta ${pct > 1 ? "kpi-delta--up" : pct < -1 ? "kpi-delta--down" : "kpi-delta--flat"}`;
  el.hidden = false;
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

function renderEvolutionGrid(container, anchor, filterCollaborator, filterLabel) {
  container.innerHTML = "";

  if (filterLabel) {
    const badge = document.createElement("div");
    badge.className = "evolution-filter-badge";
    const text = document.createElement("span");
    text.textContent = filterLabel;
    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "evolution-filter-badge-clear";
    clear.setAttribute("aria-label", "Effacer le filtre");
    clear.innerHTML = `<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 2L8 8M8 2L2 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;
    clear.addEventListener("click", () => {
      evolutionFilterLabel = null;
      renderManagerViews();
      renderResourcesViews();
    });
    badge.append(text, clear);
    container.append(badge);
  }

  const weeks = [];

  for (let offset = 5; offset >= 0; offset -= 1) {
    const reference = new Date(anchor);
    reference.setDate(reference.getDate() - offset * 7);
    const range = getPeriodRange(reference, "week");
    const rows = getAllSessionsWithActive().filter((session) => {
      if (!isSessionInRange(session, range)) return false;
      if (filterCollaborator !== "all" && normalizeText(session.collaborator) !== normalizeText(filterCollaborator)) return false;
      if (filterLabel) {
        const cats = session.categories?.length ? session.categories : ["Sans catégorie"];
        const okr = formatObjectiveOkrDisplay(session.objectiveOkr);
        if (!cats.includes(filterLabel) && okr !== filterLabel) return false;
      }
      return true;
    });

    weeks.push({
      label: formatShortDate(range.start),
      totalMs: rows.reduce((sum, session) => sum + (Number(session.durationMs) || 0), 0),
    });
  }

  const maxValue = Math.max(...weeks.map((week) => week.totalMs), 0);
  if (!maxValue) {
    container.append(createEmptyState("L'évolution apparaîtra dès que plusieurs semaines seront renseignées."));
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

function renderDistribution(barContainer, legendContainer, rows, totalMs, emptyMessage, options = {}) {
  barContainer.innerHTML = "";
  legendContainer.innerHTML = "";

  if (!rows.length || !totalMs) {
    legendContainer.append(createEmptyState(emptyMessage));
    return;
  }

  const hasClick = typeof options.onLabelClick === "function";

  for (const row of rows) {
    const color = options.colorResolver ? options.colorResolver(row) : colorForLabel(row.label);
    const categoryTooltip = formatCategoryTagTooltip(row);
    const isActive = options.activeLabel === row.label;
    const isDimmed = options.activeLabel != null && !isActive;

    const segment = document.createElement("div");
    let segClass = "distribution-segment";
    if (isActive) segClass += " distribution-segment--active";
    if (isDimmed) segClass += " distribution-segment--dimmed";
    segment.className = segClass;
    segment.style.width = `${Math.max((row.durationMs / totalMs) * 100, 2)}%`;
    segment.style.background = color;
    if (hasClick) segment.style.cursor = "pointer";
    attachHoverTooltip(segment, categoryTooltip || `${row.label} · ${formatShare(row.durationMs, totalMs)}`);
    if (hasClick) segment.addEventListener("click", () => options.onLabelClick(row.label));
    barContainer.append(segment);

    const legend = document.createElement("span");
    let legendClass = "legend-item";
    if (isActive) legendClass += " legend-item--active";
    if (isDimmed) legendClass += " legend-item--dimmed";
    legend.className = legendClass;
    if (hasClick) legend.style.cursor = "pointer";
    attachHoverTooltip(legend, categoryTooltip || `${row.label} · ${formatDuration(row.durationMs)} · ${formatShare(row.durationMs, totalMs)}`);
    if (hasClick) legend.addEventListener("click", () => options.onLabelClick(row.label));

    const swatch = document.createElement("span");
    swatch.className = "legend-swatch";
    swatch.style.background = color;

    const label = document.createElement("span");
    label.textContent = `${row.label} · ${formatDuration(row.durationMs)} · ${formatShare(row.durationMs, totalMs)}`;

    legend.append(swatch, label);
    legendContainer.append(legend);
  }
}

function getDistributionColor(label, usesObjectives = false) {
  return colorForLabel(`${usesObjectives ? "objective" : "category"}-${label}`);
}

function colorForPastelDistributionLabel(label) {
  return colorForLabel(`pastel-${label}`);
}

function renderPersonalWeekDistribution(rows, totalMs, usesObjectives, emptyMessage) {
  if (!personalDistributionBar || !personalCategoryRows) return;

  personalDistributionBar.innerHTML = "";
  personalCategoryRows.innerHTML = "";

  if (!rows.length || !totalMs) {
    personalDistributionBar.style.display = "none";
    personalCategoryRows.append(createEmptyState(emptyMessage));
    return;
  }

  personalDistributionBar.style.display = "";

  // Stacked proportional bar (overview)
  for (const row of rows) {
    const color = getDistributionColor(row.label, usesObjectives);
    const segment = document.createElement("div");
    segment.className = "distribution-segment";
    segment.style.width = `${Math.max((row.durationMs / totalMs) * 100, 2)}%`;
    segment.style.background = color;
    const tooltip = usesObjectives ? "" : formatCategoryTagTooltip(row);
    attachHoverTooltip(segment, tooltip || `${row.label} · ${formatShare(row.durationMs, totalMs)}`);
    personalDistributionBar.append(segment);
  }

  // Per-category rows with individual bars
  for (const row of rows) {
    const color = getDistributionColor(row.label, usesObjectives);
    const share = totalMs ? row.durationMs / totalMs : 0;
    const tooltip = usesObjectives ? "" : formatCategoryTagTooltip(row);

    const item = document.createElement("div");
    item.className = "personal-cat-row";
    if (tooltip) attachHoverTooltip(item, tooltip);

    const head = document.createElement("div");
    head.className = "personal-cat-head";

    const swatch = document.createElement("span");
    swatch.className = "personal-cat-swatch";
    swatch.style.background = color;

    const name = document.createElement("span");
    name.className = "personal-cat-name";
    name.textContent = row.label;

    const meta = document.createElement("span");
    meta.className = "personal-cat-meta";
    meta.textContent = `${formatDuration(row.durationMs)} · ${Math.round(share * 100)}%`;

    head.append(swatch, name, meta);

    const track = document.createElement("div");
    track.className = "personal-cat-track";

    const fill = document.createElement("div");
    fill.className = "personal-cat-fill";
    fill.style.width = `${Math.max(share * 100, 2)}%`;
    fill.style.background = color;

    track.append(fill);
    item.append(head, track);
    personalCategoryRows.append(item);
  }
}

function formatCategoryTagTooltip(row) {
  const label = String(row?.label ?? "").trim();
  if (!label || normalizeComparableText(label) === "autres") {
    return "";
  }

  const tagSummary = Array.isArray(row?.tagSummary) ? row.tagSummary.filter(([tag]) => String(tag ?? "").trim()) : [];
  const lines = [label];
  if (!tagSummary.length) {
    lines.push("Etiquettes : aucune");
    return lines.join("\n");
  }

  const visibleTags = tagSummary.slice(0, 8).map(([tag, count]) => `${tag}${count > 1 ? ` (${count})` : ""}`);
  const hiddenCount = tagSummary.length - visibleTags.length;
  lines.push(`Etiquettes : ${visibleTags.join(" · ")}`);
  if (hiddenCount > 0) {
    lines.push(`+ ${hiddenCount} autre${hiddenCount > 1 ? "s" : ""}`);
  }
  return lines.join("\n");
}

let hoverTooltipNode = null;

function ensureHoverTooltipNode() {
  if (hoverTooltipNode?.isConnected) {
    return hoverTooltipNode;
  }

  hoverTooltipNode = document.createElement("div");
  hoverTooltipNode.className = "hover-detail-tooltip";
  hoverTooltipNode.hidden = true;
  document.body.append(hoverTooltipNode);
  return hoverTooltipNode;
}

function showHoverTooltip(content) {
  if (!content) {
    return;
  }
  const tooltip = ensureHoverTooltipNode();
  tooltip.textContent = content;
  tooltip.hidden = false;
}

function hideHoverTooltip() {
  if (!hoverTooltipNode) {
    return;
  }
  hoverTooltipNode.hidden = true;
}

function positionHoverTooltip(event, target) {
  const tooltip = ensureHoverTooltipNode();
  if (tooltip.hidden) {
    return;
  }

  const tooltipRect = tooltip.getBoundingClientRect();
  const margin = 14;
  const fallbackRect = target?.getBoundingClientRect?.();
  const cursorX = event?.clientX ?? (fallbackRect ? fallbackRect.left + fallbackRect.width / 2 : window.innerWidth / 2);
  const cursorY = event?.clientY ?? (fallbackRect ? fallbackRect.top : window.innerHeight / 2);
  let left = cursorX + 16;
  let top = cursorY + 18;

  if (left + tooltipRect.width > window.innerWidth - margin) {
    left = cursorX - tooltipRect.width - 16;
  }
  if (left < margin) {
    left = margin;
  }
  if (top + tooltipRect.height > window.innerHeight - margin) {
    top = cursorY - tooltipRect.height - 18;
  }
  if (top < margin) {
    top = margin;
  }

  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${top}px`;
}

function attachHoverTooltip(target, content) {
  if (!target || !content) {
    return;
  }

  target.removeAttribute("title");

  target.addEventListener("mouseenter", (event) => {
    showHoverTooltip(content);
    positionHoverTooltip(event, target);
  });
  target.addEventListener("mousemove", (event) => {
    positionHoverTooltip(event, target);
  });
  target.addEventListener("mouseleave", () => {
    hideHoverTooltip();
  });
  target.addEventListener("focus", () => {
    showHoverTooltip(content);
    positionHoverTooltip(null, target);
  });
  target.addEventListener("blur", () => {
    hideHoverTooltip();
  });
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
      "Commencez à taper : un sujet déjà connu recharge automatiquement ses informations utiles.";
    return;
  }

  const memory = resolveProjectMemory(rawProject, collaboratorInput.value.trim());
  if (!memory) {
    projectMemoryHint.textContent = "Aucun sujet connu ne correspond encore completement a cette saisie.";
    return;
  }

  projectMemoryHint.textContent = `${memory.project} reconnu. Catégories, tags et lien d'intérêt rechargeables.`;

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
  logStateLoss("getPersistedActiveSessions:before", {
    writer: "getPersistedActiveSessions",
  });
  const merged = new Map();

  for (const session of remoteActiveSessions) {
    if (isGhostActiveSessionCandidate(session) || isStaleActiveSessionCandidate(session) || matchesPendingStoppedSession(session)) {
      continue;
    }
    const collaboratorKey = normalizeText(session.collaborator ?? "");
    const existing = collaboratorKey ? merged.get(collaboratorKey) : null;
    if (!existing || new Date(session.start).getTime() >= new Date(existing.start).getTime()) {
      merged.set(collaboratorKey || session.id, session);
    }
  }

  if (activeSession && !isGhostActiveSessionCandidate(activeSession) && !isStaleActiveSessionCandidate(activeSession, { allowCurrentLocal: true })) {
    const collaboratorKey = normalizeText(activeSession.collaborator ?? "");
    merged.set(collaboratorKey || activeSession.id, activeSession);
  }

  const persistedActiveRows = Array.from(merged.values()).map((session) => ({
    ...session,
    end: getActiveSessionEffectiveEnd(session).toISOString(),
    durationMs: getActiveSessionDurationMs(session),
    isServerActive: true,
  }));
  logStateLoss("getPersistedActiveSessions:after", {
    writer: "getPersistedActiveSessions",
    persistedActiveIds: persistedActiveRows.map((session) => session?.id ?? "").filter(Boolean),
  });
  return persistedActiveRows;
}

function getSessionsWithPendingStopped() {
  const rows = [...sessions];
  const pendingSession = pendingStoppedSessionState?.session;
  if (!pendingSession) {
    return rows;
  }
  const alreadyPresent = rows.some((session) => areSessionsEffectivelySame(session, pendingSession));
  if (!alreadyPresent) {
    rows.unshift(normalizeSession({
      ...pendingSession,
      isServerActive: false,
    }));
  }
  return rows;
}

function getSessionsForCollaborator(collaborator) {
  return getScopedSessions(getAllSessionsWithActive()).filter(
    (session) => normalizeText(session.collaborator) === normalizeText(collaborator),
  );
}

function isLiveStatsEligibleSession(session, collaborator, referenceDayStart = null) {
  if (!session) {
    return false;
  }
  if (!session.isServerActive) {
    return true;
  }
  if (!activeSession || normalizeText(session.id ?? "") !== normalizeText(activeSession.id ?? "")) {
    return false;
  }
  if (normalizeText(session.collaborator ?? "") !== normalizeText(collaborator ?? "")) {
    return false;
  }
  if (!referenceDayStart) {
    return true;
  }
  const start = new Date(session.start);
  if (Number.isNaN(start.getTime())) {
    return false;
  }
  const end = new Date(referenceDayStart);
  end.setDate(end.getDate() + 1);
  return start >= referenceDayStart && start < end;
}

function isGhostActiveSessionCandidate(activeLike, persistedRows = sessions) {
  if (!activeLike) {
    return false;
  }
  const collaborator = normalizeText(activeLike.collaborator ?? "");
  const startKey = getSessionStartIdentity(activeLike.start);
  if (!collaborator || !startKey) {
    return false;
  }
  return persistedRows.some((session) => {
    if (!session || session.isServerActive) {
      return false;
    }
    return (
      normalizeText(session.collaborator ?? "") === collaborator &&
      getSessionStartIdentity(session.start) === startKey
    );
  });
}

function isStaleActiveSessionCandidate(activeLike, options = {}) {
  if (!activeLike?.start) {
    return false;
  }
  if (options.allowCurrentLocal && activeSession && activeLike.id === activeSession.id) {
    return false;
  }
  const startMs = new Date(activeLike.start).getTime();
  if (Number.isNaN(startMs)) {
    return false;
  }
  const durationMs = getActiveSessionDurationMs(activeLike);
  if (!Number.isFinite(durationMs) || durationMs <= 0) {
    return false;
  }
  return durationMs > MAX_REASONABLE_ACTIVE_SESSION_MS;
}

function getAllSessionsWithActive() {
  logStateLoss("getAllSessionsWithActive:before", {
    writer: "getAllSessionsWithActive",
  });
  const rows = new Map(getSessionsWithPendingStopped().map((session) => [session.id, session]));
  for (const activeRow of getPersistedActiveSessions()) {
    rows.set(activeRow.id, activeRow);
  }
  const allRows = Array.from(rows.values()).sort((left, right) => new Date(right.start) - new Date(left.start));
  logStateLoss("getAllSessionsWithActive:after", {
    writer: "getAllSessionsWithActive",
    allSessionIds: allRows.map((session) => session?.id ?? "").filter(Boolean),
  });
  return allRows;
}

function findMatchingPersistedSessionForActive(activeLike) {
  if (!activeLike) {
    return null;
  }
  const collaborator = normalizeText(activeLike.collaborator ?? "");
  const startIdentity = getSessionStartIdentity(activeLike.start);
  if (!collaborator || !startIdentity) {
    return null;
  }
  return sessions.find((session) => (
    !session.isServerActive &&
    normalizeText(session.collaborator ?? "") === collaborator &&
    getSessionStartIdentity(session.start) === startIdentity
  )) ?? null;
}

async function dismissGhostActiveSession(activeLike, persistedMatch = null) {
  if (!activeLike) {
    return false;
  }
  cancelActiveSessionServerSync();
  rememberRecentlyStoppedSession(activeLike);
  activeSession = null;
  persistActiveSession();
  stopTimerLoop();
  resetFormAfterStop();
  clearPendingStoppedSessionState();
  remoteActiveSessions = remoteActiveSessions.filter((item) => {
    if (item.id === activeLike.id) {
      return false;
    }
    if (item.dbActiveSessionId && activeLike.dbActiveSessionId && item.dbActiveSessionId === activeLike.dbActiveSessionId) {
      return false;
    }
    return !(normalizeText(item.collaborator) === normalizeText(activeLike.collaborator) && getSessionStartIdentity(item.start) === getSessionStartIdentity(activeLike.start));
  });
  render();
  void removeStoppedSessionGhostsFromSupabase(activeLike, { refreshAfterSuccess: false }).then(() => {
    void loadServerBackedState({ silent: false });
  });
  setAuthStatusMessage(
    persistedMatch
      ? "Session résiduelle ignorée : l’entrée existe déjà dans le journal."
      : "Session active résiduelle nettoyée.",
    "warning",
    { persistMs: 3600 },
  );
  return true;
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

function getPersonalPeriodRange() {
  if (personalPeriod === "custom") {
    const fromStr = personalCustomFromInput?.value;
    const toStr = personalCustomToInput?.value;
    const from = fromStr ? new Date(`${fromStr}T00:00:00`) : new Date();
    const toDay = toStr ? new Date(`${toStr}T00:00:00`) : from;
    const end = new Date(toDay);
    end.setDate(end.getDate() + 1);
    return { start: from, end };
  }
  return getPeriodRange(personalAnchorDate, personalPeriod);
}

function getIsoWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function renderPersonalPeriodControls() {
  if (!personalPeriodSwitch) return;
  for (const btn of personalPeriodSwitch.querySelectorAll("[data-personal-period]")) {
    btn.classList.toggle("active", btn.dataset.personalPeriod === personalPeriod);
  }
  const isCustom = personalPeriod === "custom";
  if (personalPeriodNav) personalPeriodNav.hidden = isCustom;
  if (personalCustomRange) personalCustomRange.hidden = !isCustom;
  if (!isCustom && personalPeriodLabel) {
    const range = getPersonalPeriodRange();
    let label = formatPeriodLabel(range.start, range.end, personalPeriod);
    if (personalPeriod === "week") {
      label += ` · S${getIsoWeekNumber(range.start)}`;
    }
    personalPeriodLabel.textContent = label;
  }
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

function getPreviousPeriodRange(anchor, period) {
  if (period === "month") {
    return getPeriodRange(new Date(anchor.getFullYear(), anchor.getMonth() - 1, 1), "month");
  }
  if (period === "year") {
    return getPeriodRange(new Date(anchor.getFullYear() - 1, 0, 1), "year");
  }
  const prev = new Date(anchor);
  prev.setDate(prev.getDate() - 7);
  return getPeriodRange(prev, "week");
}

function isSessionInRange(session, range) {
  const start = new Date(session.start);
  return start >= range.start && start < range.end;
}

function buildReportRows(rows, key) {
  const grouped = new Map();

  for (const row of rows) {
    if (key === "categories") {
      const labels = row.categories.length ? row.categories : ["Sans catégorie"];
      for (const label of labels) {
        const current = grouped.get(label) ?? { label, durationMs: 0, count: 0, tagCounts: new Map() };
        current.durationMs += Number(row.durationMs) || 0;
        current.count += 1;
        for (const tag of row.tags ?? []) {
          const cleanedTag = String(tag ?? "").trim();
          if (!cleanedTag) {
            continue;
          }
          current.tagCounts.set(cleanedTag, (current.tagCounts.get(cleanedTag) ?? 0) + 1);
        }
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

  return Array.from(grouped.values())
    .map((row) => ({
      ...row,
      tagSummary:
        row.tagCounts instanceof Map
          ? Array.from(row.tagCounts.entries()).sort((left, right) => right[1] - left[1])
          : [],
    }))
    .sort((a, b) => b.durationMs - a.durationMs);
}

function getFallbackLabel(key) {
  if (key === "collaborator") {
    return "Sans cargonaute";
  }
  if (key === "project") {
    return "Sans projet";
  }
  return "Sans catégorie";
}

function getMainProjectForCollaborator(rows, collaborator) {
  const projectRows = buildReportRows(
    rows.filter((row) => normalizeText(row.collaborator) === normalizeText(collaborator)),
    "project",
  );
  return projectRows[0]?.label ?? "";
}

function setupTokenInput(input, config) {
  const tokenField = input.closest(".token-field");
  if (tokenField && !tokenField.dataset.tokenFieldInteractive) {
    tokenField.dataset.tokenFieldInteractive = "true";
    tokenField.addEventListener("click", (event) => {
      if (event.target.closest(".token-chip")) {
        event.stopPropagation();
        return;
      }
      if (event.target === input || event.target.closest("button")) {
        return;
      }
      focusTokenFieldInput(input);
    });
  }

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

function focusTokenFieldInput(input) {
  if (!input) {
    return;
  }
  input.focus();
  requestAnimationFrame(() => {
    input.scrollIntoView({ block: "nearest", inline: "nearest" });
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
    : dedupePreservingOrder([...config.getValues(), ...tokens]);

  config.setValues(nextValues);
  input.value = "";
}

function renderCategoryTokens() {
  renderTokenList(categoriesList, currentCategories, (index) => {
    currentCategories = currentCategories.filter((_, i) => i !== index);
    renderCategoryTokens();
  }, { kind: "category" });
  updateFieldManageButtons();
}

function renderTagTokens() {
  renderTokenList(tagsList, currentTags, (index) => {
    currentTags = currentTags.filter((_, i) => i !== index);
    renderTagTokens();
  });
  updateFieldManageButtons();
}

function renderManualTagTokens() {
  renderTokenList(manualTagsList, manualCurrentTags, (index) => {
    manualCurrentTags = manualCurrentTags.filter((_, i) => i !== index);
    renderManualTagTokens();
  });
}

function renderPlannedCategoryTokens() {
  renderTokenList(plannedCategoriesList, plannedCurrentCategories, (index) => {
    plannedCurrentCategories = plannedCurrentCategories.filter((_, i) => i !== index);
    renderPlannedCategoryTokens();
  }, { kind: "category" });
}

function renderPlannedTagTokens() {
  renderTokenList(plannedTagsList, plannedCurrentTags, (index) => {
    plannedCurrentTags = plannedCurrentTags.filter((_, i) => i !== index);
    renderPlannedTagTokens();
  });
}

function renderTokenList(container, values, onRemove, options = {}) {
  if (!container) {
    return;
  }
  container.innerHTML = "";
  for (const [index, value] of values.entries()) {
    const chip = document.createElement("span");
    chip.className = "token-chip";
    if (options.kind === "category") {
      chip.classList.add("token-chip--category");
      applyCategorySurface(chip, getCategoryColor(value));
    }

    const label = document.createElement("span");
    label.className = "token-chip-label";
    label.textContent = value;

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "token-chip-remove";
    remove.setAttribute("aria-label", `Retirer ${value}`);
    remove.textContent = "×";
    remove.addEventListener("click", (e) => {
      e.stopPropagation();
      onRemove(index);
    });

    chip.append(label, remove);
    container.append(chip);

    if (options.onEdit) {
      chip.title = "Double-clic pour modifier";
      chip.addEventListener("dblclick", (e) => {
        if (e.target === remove || chip.classList.contains("token-chip--editing")) return;
        e.preventDefault();
        startTokenInlineEdit(chip, label, value, index, options);
      });
    }
  }
}

function startTokenInlineEdit(chip, label, currentValue, index, options) {
  chip.classList.add("token-chip--editing");

  const input = document.createElement("input");
  input.type = "text";
  input.className = "token-chip-edit-input";
  input.value = currentValue;
  input.style.width = `${Math.max(currentValue.length, 3)}ch`;
  label.replaceWith(input);

  requestAnimationFrame(() => { input.select(); input.focus(); });

  let done = false;

  const commit = () => {
    if (done) return;
    done = true;
    const raw = input.value.trim();
    const newValue = options.kind === "category" ? raw : normalizeTag(raw);
    chip.classList.remove("token-chip--editing");
    if (newValue && newValue !== currentValue) {
      options.onEdit(index, newValue);
    } else {
      input.replaceWith(label);
    }
  };

  const cancel = () => {
    if (done) return;
    done = true;
    chip.classList.remove("token-chip--editing");
    input.replaceWith(label);
  };

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); commit(); }
    if (e.key === "Escape") { e.preventDefault(); cancel(); }
    input.style.width = `${Math.max(input.value.length + 1, 3)}ch`;
  });
  input.addEventListener("blur", commit, { once: true });
}

function renderPills(container, values, options = {}) {
  container.innerHTML = "";
  for (const value of values) {
    container.append(createPill(value, options));
  }
}

function createPill(label, options = {}) {
  const pill = document.createElement("span");
  pill.className = "pill";
  const trimmedLabel = String(label ?? "").trim();
  pill.textContent = trimmedLabel;

  const kind = options.kind || inferPillKind(trimmedLabel);
  if (kind) {
    pill.dataset.kind = kind;
  }

  if (kind === "category") {
    applyCategorySurface(pill, getCategoryColor(trimmedLabel));
  }

  return pill;
}

function inferPillKind(label) {
  if (!label) {
    return "";
  }
  if (label.startsWith("#")) {
    return "tag";
  }
  if (label === "Lien") {
    return "link";
  }
  const normalizedLabel = normalizeText(label);
  const knownCategories = getCategorySuggestionLabels().map((item) => normalizeText(item));
  return knownCategories.includes(normalizedLabel) ? "category" : "neutral";
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

function isPlaceholderClientLabel(value) {
  const normalized = normalizeComparableText(value);
  return !normalized || normalized === "a renseigner" || normalized === "sans client";
}

function getSessionClientLabel(session) {
  const taskLabel = String(session.task ?? "").trim();
  if (taskLabel && !isPlaceholderClientLabel(taskLabel)) {
    return taskLabel;
  }

  const storedClientLabel = String(session.dbClientName ?? "").trim();
  if (storedClientLabel && !isPlaceholderClientLabel(storedClientLabel)) {
    return storedClientLabel;
  }

  const project = referenceCatalog.projects.find(
    (item) => normalizeText(item.project_name) === normalizeText(session.project ?? ""),
  );
  const projectClientLabel = String(project?.client_name ?? "").trim();
  if (projectClientLabel && !isPlaceholderClientLabel(projectClientLabel)) {
    return projectClientLabel;
  }

  return "";
}

function getAgendaEventSecondaryLabel(session) {
  const subjectLabel = String(session.project ?? "").trim();
  if (subjectLabel) {
    return subjectLabel;
  }

  const clientLabel = getSessionClientLabel(session);
  if (clientLabel) {
    return clientLabel;
  }

  const categoryLabel = String(session.categories?.[0] ?? "").trim();
  if (categoryLabel) {
    return categoryLabel;
  }

  return "";
}

function createCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  return cell;
}

function parseTokenString(rawValue) {
  return dedupePreservingOrder(
    rawValue
      .split(",")
      .map((token) => token.trim())
      .filter(Boolean),
  );
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
    session.categories?.length ? `Catégorie : ${session.categories.join(", ")}` : "",
    session.tags?.length ? `Tags : ${session.tags.join(", ")}` : "",
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

function formatTimeOnly(value) {
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : formatTimeLabel(date);
}

function getSessionStartIdentity(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return String(Math.floor(date.getTime() / 60000));
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
  return String(value ?? "").trim().toLowerCase();
}

function normalizeTag(tag) {
  return String(tag ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

function normalizeComparableText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[|/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function dedupePreservingOrder(values, normalizer = normalizeComparableText) {
  const seen = new Set();
  const unique = [];

  for (const value of values) {
    const cleaned = String(value ?? "").trim();
    if (!cleaned) {
      continue;
    }
    const key = normalizer(cleaned);
    if (!key || seen.has(key)) {
      continue;
    }
    seen.add(key);
    unique.push(cleaned);
  }

  return unique;
}

function normalizeCategorySelection(rawLabel) {
  const cleaned = String(rawLabel ?? "").trim();
  if (!cleaned) {
    return { category: "", impliedTags : [] };
  }

  const comparable = normalizeComparableText(cleaned);
  const matchedRule = CATEGORY_REWRITE_RULES.find((rule) => rule.matches.includes(comparable));
  if (matchedRule) {
    return {
      category: matchedRule.category,
      impliedTags : [...matchedRule.impliedTags],
    };
  }

  return {
    category: cleaned,
    impliedTags : [],
  };
}

function normalizeCategoryAndTags(categories = [], tags = []) {
  const normalizedTags = [];
  const normalizedCategories = [];

  for (const tag of tags) {
    const cleanedTag = String(tag ?? "").trim();
    if (cleanedTag) {
      normalizedTags.push(cleanedTag);
    }
  }

  for (const category of categories) {
    const normalized = normalizeCategorySelection(category);
    if (normalized.category) {
      normalizedCategories.push(normalized.category);
    }
    normalizedTags.push(...normalized.impliedTags);
  }

  return {
    categories: dedupePreservingOrder(normalizedCategories).slice(0, 1),
    tags: dedupePreservingOrder(normalizedTags),
  };
}

function getCategorySuggestionLabels() {
  const sourceLabels = referenceCatalog.loaded
    ? referenceCatalog.categories.map((item) => item.activity_category_label)
    : uniqueTokenValues("categories");

  const normalizedLabels = sourceLabels.map((label) => normalizeCategorySelection(label).category).filter(Boolean);
  return dedupePreservingOrder(normalizedLabels).sort((left, right) => left.localeCompare(right, "fr"));
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

    navigator.serviceWorker.register("./service-worker.js").then((registration) => {
      registration.update().catch(() => {});
    }).catch(() => {});
  });
}
