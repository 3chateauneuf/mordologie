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
const journalFilterFromInput = document.querySelector("#journal-filter-from");
const journalFilterToInput = document.querySelector("#journal-filter-to");
const journalFilterCategoryInput = document.querySelector("#journal-filter-category");
const journalFilterSubjectInput = document.querySelector("#journal-filter-subject");
const journalFilterResetButton = document.querySelector("#journal-filter-reset");
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
