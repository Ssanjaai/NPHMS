import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, useLocation } from 'react-router-dom';
import Menu from './components/Menu';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import { ROUTES } from './constants/routes.constant';

/* Super Admin Pages */
import SADashboardPage from './pages/super-admin/DashboardPage';
import SABranchAdminsPage from './pages/super-admin/BranchAdminsPage';
import SAAdminDetailsPage from './pages/super-admin/AdminDetailsPage';
import SACreateBranchAdminPage from './pages/super-admin/CreateBranchAdminPage';
import SAEditBranchAdminPage from './pages/super-admin/EditBranchAdminPage';
import SAHealersPage from './pages/super-admin/HealersPage';
import SAHealerDetailsPage from './pages/super-admin/HealerDetailsPage';
import SAEditHealerPage from './pages/super-admin/EditHealerPage';
import SAPatientsPage from './pages/super-admin/PatientsPage';
import SAPatientDetailsPage from './pages/super-admin/PatientDetailsPage';
import SAEditPatientPage from './pages/super-admin/EditPatientPage';
import SABranchesPage from './pages/super-admin/BranchesPage';
import SABranchDetailsPage from './pages/super-admin/BranchDetailsPage';
import SACreateBranchPage from './pages/super-admin/CreateBranchPage';
import SABranchHealersPage from './pages/super-admin/BranchHealersPage';
import SAHealerPatientsPage from './pages/super-admin/HealerPatientsPage';
import SABranchRevenuePage from './pages/super-admin/BranchRevenuePage';
import SASessionHistoryPage from './pages/super-admin/SessionHistoryPage';
import SAUsersPage from './pages/super-admin/UsersPage';
import SAReportsPage from './pages/super-admin/ReportsPage';
import SASettingsPage from './pages/super-admin/SettingsPage';
import SAVisitorLogPage from './pages/super-admin/VisitorLogPage';
import SAAttendancePage from './pages/super-admin/AttendancePage';
import BAAttendancePage from './pages/branch-admin/AttendancePage';
import BADashboardPage from './pages/branch-admin/DashboardPage';
import BAFinancePage from './pages/branch-admin/FinancePage';
import BAHealersPage from './pages/branch-admin/HealersPage';
import BACreateHealerPage from './pages/branch-admin/CreateHealerPage';
import BAPatientsPage from './pages/branch-admin/PatientsPage';
import BARegisterPatientPage from './pages/branch-admin/RegisterPatientPage';
import BAEditPatientPage from './pages/branch-admin/EditPatientPage';
import BASessionsPage from './pages/branch-admin/SessionsPage';
import SARevenuePage from './pages/super-admin/RevenuePage';
import SADailyFinancePage from './pages/super-admin/DailyFinancePage';
import BAVisitorLogPage from './pages/branch-admin/VisitorLogPage';
import BAVisitorCheckInPage from './pages/branch-admin/VisitorCheckInPage';
import BADocumentManagementPage from './pages/branch-admin/DocumentManagementPage';
import BAReportsPage from './pages/branch-admin/ReportsPage';
import BASettingsPage from './pages/branch-admin/SettingsPage';
import SATreatmentCategoriesPage from './pages/super-admin/TreatmentCategoriesPage';
import SACreateTreatmentCategoryPage from './pages/super-admin/SACreateTreatmentCategoryPage';
import SATreatmentCategoryDetailsPage from './pages/super-admin/SATreatmentCategoryDetailsPage';
import SAEditTreatmentCategoryPage from './pages/super-admin/SAEditTreatmentCategoryPage';
import SATreatmentTypePage from './pages/super-admin/TreatmentTypePage';
import SACreateTreatmentTypePage from './pages/super-admin/SACreateTreatmentTypePage';
import SATreatmentTypeDetailsPage from './pages/super-admin/SATreatmentTypeDetailsPage';
import SAEditTreatmentTypePage from './pages/super-admin/SAEditTreatmentTypePage';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/index.css';

setupIonicReact();

// Routes that should not show the Menu
const AUTH_ROUTES = [
  ROUTES.AUTH.LOGIN,
  ROUTES.AUTH.SIGNUP,
  ROUTES.AUTH.FORGOT_PASSWORD,
  ROUTES.AUTH.RESET_PASSWORD,
];

const AppContent: React.FC = () => {
  const location = useLocation();
  const shouldShowMenu = !AUTH_ROUTES.includes(location.pathname);

  return (
    <IonSplitPane contentId="main">
      {shouldShowMenu && <Menu />}
      <IonRouterOutlet id="main">
        {/* Auth Routes - No Menu */}
        <Route path={ROUTES.AUTH.LOGIN} exact={true}>
          <LoginPage />
        </Route>
        <Route path={ROUTES.AUTH.SIGNUP} exact={true}>
          <SignupPage />
        </Route>
        <Route path={ROUTES.AUTH.FORGOT_PASSWORD} exact={true}>
          <ForgotPasswordPage />
        </Route>

        {/* Super Admin Routes */}
        <Route path={ROUTES.SUPER_ADMIN.DASHBOARD} exact={true}>
          <SADashboardPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.BRANCH_ADMINS} exact={true}>
          <SABranchAdminsPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.BRANCHES} exact={true}>
          <SABranchesPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.BRANCH_DETAILS} exact={true}>
          <SABranchDetailsPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.CREATE_BRANCH} exact={true}>
          <SACreateBranchPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.USERS} exact={true}>
          <SAUsersPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.REPORTS} exact={true}>
          <SAReportsPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.REVENUE} exact={true}>
          <SARevenuePage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.DAILY_FINANCE} exact={true}>
          <SADailyFinancePage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.HEALERS} exact={true}>
          <SAHealersPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.PATIENTS} exact={true}>
          <SAPatientsPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.VISITOR_LOG} exact={true}>
          <SAVisitorLogPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.ATTENDANCE} exact={true}>
          <SAAttendancePage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.SETTINGS} exact={true}>
          <SASettingsPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.BRANCH_ADMIN_DETAILS} exact={true}>
          <SAAdminDetailsPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.CREATE_BRANCH_ADMIN} exact={true}>
          <SACreateBranchAdminPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.EDIT_BRANCH_ADMIN} exact={true}>
          <SAEditBranchAdminPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.HEALER_DETAILS} exact={true}>
          <SAHealerDetailsPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.EDIT_HEALER} exact={true}>
          <SAEditHealerPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.PATIENT_DETAILS} exact={true}>
          <SAPatientDetailsPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.EDIT_PATIENT} exact={true}>
          <SAEditPatientPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.BRANCH_HEALERS} exact={true}>
          <SABranchHealersPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.HEALER_PATIENTS} exact={true}>
          <SAHealerPatientsPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.BRANCH_REVENUE} exact={true}>
          <SABranchRevenuePage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.SESSION_HISTORY} exact={true}>
          <SASessionHistoryPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.TREATMENT_CATEGORIES} exact={true}>
          <SATreatmentCategoriesPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.CREATE_TREATMENT_CATEGORY} exact={true}>
          <SACreateTreatmentCategoryPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.TREATMENT_CATEGORY_DETAILS} exact={true}>
          <SATreatmentCategoryDetailsPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.EDIT_TREATMENT_CATEGORY} exact={true}>
          <SAEditTreatmentCategoryPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.TREATMENT_TYPE_LIST} exact={true}>
          <SATreatmentTypePage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.CREATE_TREATMENT_TYPE} exact={true}>
          <SACreateTreatmentTypePage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.TREATMENT_TYPE_DETAILS} exact={true}>
          <SATreatmentTypeDetailsPage />
        </Route>
        <Route path={ROUTES.SUPER_ADMIN.EDIT_TREATMENT_TYPE} exact={true}>
          <SAEditTreatmentTypePage />
        </Route>

        {/* Default Route */}
        <Route path={ROUTES.BRANCH_ADMIN.DASHBOARD} exact={true}>
          <BADashboardPage />
        </Route>
        <Route path={ROUTES.BRANCH_ADMIN.PATIENTS} exact={true}>
          <BAPatientsPage />
        </Route>
        <Route path={ROUTES.BRANCH_ADMIN.REGISTER_PATIENT} exact={true}>
          <BARegisterPatientPage />
        </Route>
        <Route path={ROUTES.BRANCH_ADMIN.EDIT_PATIENT} exact={true}>
          <BAEditPatientPage />
        </Route>
        <Route path={ROUTES.BRANCH_ADMIN.HEALERS} exact={true}>
          <BAHealersPage />
        </Route>
        <Route path={ROUTES.BRANCH_ADMIN.CREATE_HEALER} exact={true}>
          <BACreateHealerPage />
        </Route>
        <Route path={ROUTES.BRANCH_ADMIN.ATTENDANCE} exact={true}>
          <BAAttendancePage />
        </Route>
        <Route path={ROUTES.BRANCH_ADMIN.VISITOR_LOG} exact={true}>
          <BAVisitorLogPage />
        </Route>
        <Route path={ROUTES.BRANCH_ADMIN.VISITOR_CHECKIN} exact={true}>
          <BAVisitorCheckInPage />
        </Route>
        <Route path={ROUTES.BRANCH_ADMIN.FINANCE} exact={true}>
          <BAFinancePage />
        </Route>
        <Route path={ROUTES.BRANCH_ADMIN.SESSIONS} exact={true}>
          <BASessionsPage />
        </Route>
        <Route path={ROUTES.BRANCH_ADMIN.DOCUMENTS} exact={true}>
          <BADocumentManagementPage />
        </Route>
        <Route path={ROUTES.BRANCH_ADMIN.REPORTS} exact={true}>
          <BAReportsPage />
        </Route>
        <Route path={ROUTES.BRANCH_ADMIN.SETTINGS} exact={true}>
          <BASettingsPage />
        </Route>
        <Route path="/" exact={true}>
          <Redirect to={ROUTES.AUTH.LOGIN} />
        </Route>
      </IonRouterOutlet>
    </IonSplitPane>
  );
};

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <AppContent />
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
