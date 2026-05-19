import React from 'react';
import {
  IonContent,
  IonIcon,
  IonMenu,
  IonHeader,
  IonFooter,
  IonMenuToggle,
} from '@ionic/react';
import { useLocation, useHistory } from 'react-router-dom';
import {
  gridOutline,
  businessOutline,
  peopleOutline,
  barChartOutline,
  settingsOutline,
  logOutOutline,
  leafOutline,
  shieldCheckmarkOutline,
  medkitOutline,
  personOutline,
  cashOutline,
  listOutline,
  timeOutline,
  walletOutline,
  calendarOutline,
  chevronDownOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { ROUTES } from '../constants/routes.constant';
import { useAuthStore } from '../store/auth.store';
import './Menu.css';

interface NavItem {
  title: string;
  url?: string;
  icon: string;
  section?: string;
  subItems?: { title: string; url: string; icon?: string }[];
}

const superAdminNav: NavItem[] = [
  /* Main Section */
  { title: 'Dashboard', url: ROUTES.SUPER_ADMIN.DASHBOARD, icon: gridOutline, section: 'Main' },
  { title: 'Branches', url: ROUTES.SUPER_ADMIN.BRANCHES, icon: businessOutline },

  /* Users Section */
  { title: 'Branch Admin', url: ROUTES.SUPER_ADMIN.BRANCH_ADMINS, icon: businessOutline, section: 'Users' },
  { title: 'Healers', url: ROUTES.SUPER_ADMIN.HEALERS, icon: medkitOutline },
  { title: 'Patients', url: ROUTES.SUPER_ADMIN.PATIENTS, icon: peopleOutline },

  /* Daily Operations Section */
  { title: 'Daily Visitor Log', url: ROUTES.SUPER_ADMIN.VISITOR_LOG, icon: listOutline, section: 'Daily Logs' },
  { title: 'Worker Attendance', url: ROUTES.SUPER_ADMIN.ATTENDANCE, icon: timeOutline },

  /* Finance Section */
  { title: 'Revenue', url: ROUTES.SUPER_ADMIN.REVENUE, icon: cashOutline, section: 'Finance' },
  { title: 'Daily Income & Expense', url: ROUTES.SUPER_ADMIN.DAILY_FINANCE, icon: walletOutline },
  { title: 'Reports', url: ROUTES.SUPER_ADMIN.REPORTS, icon: barChartOutline },
  { 
    title: 'Treatment', 
    icon: leafOutline, 
    subItems: [
      { title: 'Treatment Category', url: ROUTES.SUPER_ADMIN.TREATMENT_CATEGORIES, icon: listOutline },
      { title: 'Treatment Type', url: ROUTES.SUPER_ADMIN.TREATMENT_TYPE_LIST, icon: medkitOutline },
    ] 
  },

  /* System Section */
  { title: 'Settings', url: ROUTES.SUPER_ADMIN.SETTINGS, icon: settingsOutline, section: 'System' },
];

const branchAdminNav: NavItem[] = [
  { title: 'Dashboard', url: ROUTES.BRANCH_ADMIN.DASHBOARD, icon: gridOutline, section: 'Main' },
  { title: 'Healers', url: ROUTES.BRANCH_ADMIN.HEALERS, icon: medkitOutline },
  { title: 'Patients', url: ROUTES.BRANCH_ADMIN.PATIENTS, icon: peopleOutline },
  { title: 'Sessions', url: ROUTES.BRANCH_ADMIN.SESSIONS, icon: timeOutline },
  { title: 'Attendance', url: ROUTES.BRANCH_ADMIN.ATTENDANCE, icon: timeOutline, section: 'Operations' },
  { title: 'Visitor Log', url: ROUTES.BRANCH_ADMIN.VISITOR_LOG, icon: listOutline },
  { title: 'Finance', url: ROUTES.BRANCH_ADMIN.FINANCE, icon: cashOutline, section: 'Finance' },
  { title: 'Reports', url: ROUTES.BRANCH_ADMIN.REPORTS, icon: barChartOutline },
  { title: 'Settings', url: ROUTES.BRANCH_ADMIN.SETTINGS, icon: settingsOutline, section: 'System' },
];

const Menu: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { user, logout } = useAuthStore();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const navItems = user?.role === 'SUPER_ADMIN' ? superAdminNav : branchAdminNav;

  // On mobile, parent toggles dropdown only; subitems close sidebar. On desktop, default behavior.
  const handleNavClick = (item: NavItem, isSubItem = false) => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    if (item.subItems && !isSubItem) {
      setExpandedItems(prev => 
        prev.includes(item.title) 
          ? prev.filter(t => t !== item.title) 
          : [...prev, item.title]
      );
      // Do not close sidebar on mobile when toggling parent
      return;
    }
    if (item.url) {
      history.push(item.url);
      // Only close sidebar on mobile for subitems
      if (isSubItem && isMobile) {
        const menuEl = document.querySelector('ion-menu.app-menu') as HTMLIonMenuElement | null;
        if (menuEl) {
          menuEl.close();
        }
      }
    }
  };

  const handleLogout = () => {
    logout();
    history.push(ROUTES.AUTH.LOGIN);
  };

  const userInitials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'SA'
    : 'SA';

  const userName = user
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Super Admin'
    : 'Super Admin';

  return (
    <IonMenu contentId="main" type="overlay" className="app-menu">
      <IonHeader className="ion-no-border">
        {/* Brand Header */}
        <div className="app-menu__brand">
          <div className="app-menu__brand-icon">
            <IonIcon icon={leafOutline} />
          </div>
          <div className="app-menu__brand-text">
            <span className="app-menu__brand-name">Pranic Healing</span>
            <span className="app-menu__brand-sub">Manager</span>
          </div>
        </div>
      </IonHeader>

      <IonContent className="app-menu__content">
        {/* Navigation Items */}
        <nav className="app-menu__nav">
          {navItems.map((item, index) => {
            const isActive = item.url ? location.pathname === item.url : false;
            const isExpanded = expandedItems.includes(item.title);
            
            return (
              <React.Fragment key={item.title + index}>
                {item.section && <div className="app-menu__section-title">{item.section}</div>}
                {item.subItems ? (
                  <button
                    className={`app-menu__nav-item ${isActive ? 'app-menu__nav-item--active' : ''}`}
                    onClick={() => handleNavClick(item, false)}
                  >
                    <IonIcon icon={item.icon} className="app-menu__nav-icon" />
                    <span className="app-menu__nav-label">{item.title}</span>
                    <IonIcon 
                      icon={isExpanded ? chevronDownOutline : chevronForwardOutline} 
                      style={{ marginLeft: 'auto', fontSize: '14px', opacity: 0.5 }} 
                    />
                  </button>
                ) : (
                  <IonMenuToggle auto-hide="false">
                    <button
                      className={`app-menu__nav-item ${isActive ? 'app-menu__nav-item--active' : ''}`}
                      onClick={() => handleNavClick(item, false)}
                    >
                      <IonIcon icon={item.icon} className="app-menu__nav-icon" />
                      <span className="app-menu__nav-label">{item.title}</span>
                    </button>
                  </IonMenuToggle>
                )}
                
                {item.subItems && isExpanded && (
                  <div className="app-menu__sub-nav">
                    {item.subItems.map((subItem) => {
                      const isSubActive = location.pathname === subItem.url;
                      return (
                        <IonMenuToggle auto-hide="false" key={subItem.url}>
                          <button
                            className={`app-menu__nav-item app-menu__nav-item--sub ${isSubActive ? 'app-menu__nav-item--active' : ''}`}
                            onClick={() => handleNavClick(subItem as NavItem, true)}
                          >
                            {subItem.icon && <IonIcon icon={subItem.icon} className="app-menu__nav-icon" style={{ fontSize: '18px' }} />}
                            <span className="app-menu__nav-label">{subItem.title}</span>
                          </button>
                        </IonMenuToggle>
                      );
                    })}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </IonContent>

      <IonFooter className="ion-no-border">
        {/* User Profile at Bottom */}
        <div className="app-menu__footer">
          <div className="app-menu__user">
            <div className="app-menu__user-avatar">{userInitials}</div>
            <div className="app-menu__user-info">
              <span className="app-menu__user-name">{userName}</span>
              <span className="app-menu__user-role">Aria Seraphina</span>
            </div>
          </div>
          <button className="app-menu__logout-btn" onClick={handleLogout} title="Logout">
            <IonIcon icon={logOutOutline} />
          </button>
        </div>
      </IonFooter>
    </IonMenu>
  );
};

export default Menu;
