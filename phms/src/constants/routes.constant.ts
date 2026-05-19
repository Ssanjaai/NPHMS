/**
 * Application Routes
 */

export const ROUTES = {
  // Auth Routes
  AUTH: {
    LOGIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // Super Admin Routes
  SUPER_ADMIN: {
    DASHBOARD: '/super-admin/dashboard',
    USERS: '/super-admin/users',
    BRANCH_ADMINS: '/super-admin/branch-admins',
    BRANCH_ADMIN_DETAILS: '/super-admin/branch-admins/details/:id',
    CREATE_BRANCH_ADMIN: '/super-admin/branch-admins/create',
    EDIT_BRANCH_ADMIN: '/super-admin/branch-admins/edit/:id',
    HEALERS: '/super-admin/healers',
    HEALER_DETAILS: '/super-admin/healers/details/:id',
    EDIT_HEALER: '/super-admin/healers/edit/:id',
    PATIENTS: '/super-admin/patients',
    PATIENT_DETAILS: '/super-admin/patients/details/:id',
    EDIT_PATIENT: '/super-admin/patients/edit/:id',
    BRANCHES: '/super-admin/branches',
    BRANCH_DETAILS: '/super-admin/branches/details/:id',
    CREATE_BRANCH: '/super-admin/branches/create',
    BRANCH_HEALERS: '/super-admin/branches/healers/:id',
    HEALER_PATIENTS: '/super-admin/branches/healers/:branchId/patients/:healerId',
    BRANCH_REVENUE: '/super-admin/branches/revenue/:id',
    SESSION_HISTORY: '/super-admin/branches/sessions/:id',
    REPORTS: '/super-admin/reports',
    REVENUE: '/super-admin/revenue',
    VISITOR_LOG: '/super-admin/visitor-log',
    ATTENDANCE: '/super-admin/attendance',
    DAILY_FINANCE: '/super-admin/daily-finance',
    TREATMENT_CATEGORIES: '/super-admin/treatment-categories',
    CREATE_TREATMENT_CATEGORY: '/super-admin/treatment-categories/create',
    TREATMENT_CATEGORY_DETAILS: '/super-admin/treatment-categories/details/:id',
    EDIT_TREATMENT_CATEGORY: '/super-admin/treatment-categories/edit/:id',
    TREATMENT_TYPE_LIST: '/super-admin/treatment-types',
    CREATE_TREATMENT_TYPE: '/super-admin/treatment-types/create',
    TREATMENT_TYPE_DETAILS: '/super-admin/treatment-types/details/:id',
    EDIT_TREATMENT_TYPE: '/super-admin/treatment-types/edit/:id',
    SETTINGS: '/super-admin/settings',
  },

  // Branch Admin Routes
  BRANCH_ADMIN: {
    DASHBOARD: '/branch-admin/dashboard',
    HEALERS: '/branch-admin/healers',
    PATIENTS: '/branch-admin/patients',
    SESSIONS: '/branch-admin/sessions',
    ATTENDANCE: '/branch-admin/attendance',
    VISITOR_LOG: '/branch-admin/visitor-log',
    FINANCE: '/branch-admin/finance',
    REPORTS: '/branch-admin/reports',
    SETTINGS: '/branch-admin/settings',
  },

  // Healer Routes
  HEALER: {
    DASHBOARD: '/healer/dashboard',
    SESSIONS: '/healer/sessions',
    PATIENTS: '/healer/patients',
    SCHEDULE: '/healer/schedule',
    AVAILABILITY: '/healer/availability',
    PROFILE: '/healer/profile',
  },

  // Patient Routes
  PATIENT: {
    DASHBOARD: '/patient/dashboard',
    APPOINTMENTS: '/patient/appointments',
    HEALERS: '/patient/healers',
    PROFILE: '/patient/profile',
    HEALTH_RECORDS: '/patient/health-records',
    VISITORS: '/patient/visitors',
  },

  // Common Routes
  COMMON: {
    HOME: '/',
    NOT_FOUND: '/404',
    UNAUTHORIZED: '/401',
  },
};
