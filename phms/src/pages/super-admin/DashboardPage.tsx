import React from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonModal,
} from '@ionic/react';
import {
  notificationsOutline,
  businessOutline,
  peopleOutline,
  flashOutline,
  medkitOutline,
  eyeOutline,
  trendingUpOutline,
  addCircleOutline,
  peopleCircleOutline,
  gridOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import './super-admin.css';

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const [showReportModal, setShowReportModal] = React.useState(false);
  const [branchesCount, setBranchesCount] = React.useState(0);

  React.useEffect(() => {
    const savedBranches = localStorage.getItem('ph_branches');
    if (savedBranches) {
      const branches = JSON.parse(savedBranches);
      setBranchesCount(branches.length);
    } else {
      // Fallback to initial count if nothing in localStorage
      setBranchesCount(4);
    }
  }, []);

  const stats = [
    { label: 'Total Branches', value: branchesCount.toString(), detail: 'Across all regions', icon: businessOutline },
    { label: 'Total Patients', value: '2,840', detail: 'Organization-wide', icon: peopleOutline },
    { label: 'Active Sessions', value: '142', detail: 'Live now', icon: flashOutline },
    { label: 'Healer Count', value: '1', detail: 'Certified practitioners', icon: medkitOutline },
    { label: 'Total Visitors', value: '450', detail: "Today's footfall", icon: eyeOutline },
  ];

  const weeklyFinanceData = [
    { day: 'Mon', current: { income: 12000, expense: 4500 }, previous: { income: 10500, expense: 5000 } },
    { day: 'Tue', current: { income: 15500, expense: 6200 }, previous: { income: 14000, expense: 5500 } },
    { day: 'Wed', current: { income: 10800, expense: 7100 }, previous: { income: 12000, expense: 6800 } },
    { day: 'Thu', current: { income: 14200, expense: 5800 }, previous: { income: 13500, expense: 6000 } },
    { day: 'Fri', current: { income: 18000, expense: 4900 }, previous: { income: 16000, expense: 5200 } },
    { day: 'Sat', current: { income: 16500, expense: 3200 }, previous: { income: 15000, expense: 3500 } },
    { day: 'Sun', current: { income: 9500, expense: 2100 }, previous: { income: 8000, expense: 2500 } },
  ];

  // Scale factor for chart visualization (max height ~180px)
  const maxVal = 20000;
  const scale = 180 / maxVal;

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Dashboard</IonTitle>
          <IonButtons slot="end">
            <div className="sa-page__toolbar-actions">
              <IonButton fill="clear">
                <IonIcon icon={notificationsOutline} />
              </IonButton>
              <div className="sa-page__toolbar-avatar">AS</div>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          {/* Subtitle */}
          <p className="sa-page__subtitle">
            Monitoring {branchesCount} sanctuaries across the organization.
          </p>

          {/* Stat Cards */}
          <div className="sa-stats">
            {stats.map((stat, i) => (
              <div 
                className="sa-stat-card" 
                key={i}
                style={{ 
                  '--color-primary': i === 2 ? '#f59e0b' : i === 3 ? '#7c3aed' : i === 4 ? '#ef4444' : '#10b981' 
                } as any}
              >
                <div>
                  <div className="sa-stat-card__label">{stat.label}</div>
                  <div className="sa-stat-card__value">{stat.value}</div>
                  <div className="sa-stat-card__detail">
                    <IonIcon icon={trendingUpOutline} /> {stat.detail}
                  </div>
                </div>
                <div 
                  className={`sa-stat-card__icon ${
                    i === 0 ? 'sa-stat-card__icon--primary' : 
                    i === 1 ? 'sa-stat-card__icon--success' : 
                    i === 2 ? 'sa-stat-card__icon--warning' : 
                    'sa-stat-card__icon--info'
                  }`}
                  style={i >= 3 ? { backgroundColor: i === 3 ? '#f5f3ff' : '#fef2f2', color: i === 3 ? '#7c3aed' : '#ef4444' } : {}}
                >
                  <IonIcon icon={stat.icon} />
                </div>
              </div>
            ))}
          </div>

          {/* Finance + Quick Actions Grid */}
          <div className="sa-grid-2">
            {/* Finance Section */}
            <div className="sa-section">
              <div className="sa-section__header">
                <div>
                  <h2 className="sa-section__title">Weekly Comparison</h2>
                  <p className="sa-section__subtitle">This Week vs Previous Week (Income & Expenses)</p>
                </div>
              </div>

              <div className="sa-finance-grid">
                <div className="sa-finance-card">
                  <div className="sa-finance-card__label">Total This Week Income</div>
                  <div className="sa-finance-card__value">₹85,500</div>
                </div>
                <div className="sa-finance-card">
                  <div className="sa-finance-card__label">Total This Week Expenses</div>
                  <div className="sa-finance-card__value">₹33,800</div>
                </div>
              </div>

              {/* Weekly Comparison Chart */}
              <div className="sa-chart-container">
                <div className="sa-chart-plot-area">
                  {weeklyFinanceData.map((data, i) => (
                    <div className="sa-chart-day-group sa-chart-group" key={i}>
                      <div className="sa-chart-bars-row">
                        {/* Income Pair */}
                        <div className="sa-chart-bar-pair">
                          <div 
                            className="sa-chart-bar sa-chart-bar--income-prev" 
                            style={{ height: `${data.previous.income * scale}px` }} 
                            title="Prev Week Income"
                          />
                          <div 
                            className="sa-chart-bar sa-chart-bar--income-current" 
                            style={{ height: `${data.current.income * scale}px` }} 
                            title="This Week Income"
                          />
                        </div>
                        {/* Expense Pair */}
                        <div className="sa-chart-bar-pair">
                          <div 
                            className="sa-chart-bar sa-chart-bar--expense-prev" 
                            style={{ height: `${data.previous.expense * scale}px` }} 
                            title="Prev Week Expense"
                          />
                          <div 
                            className="sa-chart-bar sa-chart-bar--expense-current" 
                            style={{ height: `${data.current.expense * scale}px` }} 
                            title="This Week Expense"
                          />
                        </div>
                      </div>
                      
                      {/* Comparison Tooltip */}
                      <div className="sa-chart-tooltip">
                        <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '8px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '4px' }}>
                          {data.day} Comparison
                        </div>
                        <div className="sa-chart-tooltip-grid">
                          <div className="sa-chart-tooltip-section">
                            <div className="sa-chart-tooltip-title">This Week</div>
                            <div className="sa-chart-tooltip-item">
                              <div className="sa-chart-tooltip-dot" style={{ background: '#10b981' }} />
                              <span>₹{data.current.income.toLocaleString()}</span>
                            </div>
                            <div className="sa-chart-tooltip-item">
                              <div className="sa-chart-tooltip-dot" style={{ background: '#ef4444' }} />
                              <span>₹{data.current.expense.toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="sa-chart-tooltip-section">
                            <div className="sa-chart-tooltip-title">Prev Week</div>
                            <div className="sa-chart-tooltip-item">
                              <div className="sa-chart-tooltip-dot" style={{ background: '#a7f3d0' }} />
                              <span>₹{data.previous.income.toLocaleString()}</span>
                            </div>
                            <div className="sa-chart-tooltip-item">
                              <div className="sa-chart-tooltip-dot" style={{ background: '#fecaca' }} />
                              <span>₹{data.previous.expense.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="sa-chart-x-axis">
                  {weeklyFinanceData.map((data, i) => (
                    <div key={i} className="sa-chart-day-group">
                      <span className="sa-chart-label">{data.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="sa-quick-actions">
              <h3 className="sa-quick-actions__title">Super Admin Portal</h3>
              <div className="sa-quick-action" onClick={() => history.push(ROUTES.SUPER_ADMIN.CREATE_BRANCH)}>
                <span className="sa-quick-action__label">Create New Branch</span>
                <IonIcon icon={addCircleOutline} className="sa-quick-action__icon" />
              </div>
              <div className="sa-quick-action" onClick={() => history.push(ROUTES.SUPER_ADMIN.CREATE_BRANCH_ADMIN)}>
                <span className="sa-quick-action__label">Create Branch Admins</span>
                <IonIcon icon={peopleCircleOutline} className="sa-quick-action__icon" />
              </div>
              <div className="sa-quick-action" onClick={() => setShowReportModal(true)}>
                <span className="sa-quick-action__label">Organization Reports</span>
                <IonIcon icon={gridOutline} className="sa-quick-action__icon" />
              </div>
            </div>
          </div>
        </div>
      </IonContent>

      {/* MODALS */}
      

      {/* 3. Organization Reports Modal */}
      <IonModal isOpen={showReportModal} onDidDismiss={() => setShowReportModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Generate Quick Report</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowReportModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Report Type</label>
              <select className="sa-settings__input">
                <option>Financial Summary</option>
                <option>Patient Sessions Volume</option>
                <option>Visitor Logs</option>
                <option>Branch Performance Comparison</option>
              </select>
            </div>
            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Time Range</label>
              <select className="sa-settings__input">
                <option>Today</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Year to Date</option>
              </select>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowReportModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary">Generate & Download</button>
          </div>
        </div>
      </IonModal>

    </IonPage>
  );
};

export default DashboardPage;
