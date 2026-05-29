import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonModal,
} from '@ionic/react';
import {
  notificationsOutline,
  helpCircleOutline,
  searchOutline,
  cashOutline,
  peopleOutline,
  personOutline,
  medkitOutline,
  alertCircleOutline,
  shieldCheckmarkOutline,
  trendingUpOutline,
  arrowForwardOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import { useAuthStore } from '../../store/auth.store';
import './branch-admin.css';

interface Transaction {
  id: string;
  type: 'Income' | 'Expense';
  amount: number;
  category: string;
  date: string;
  method: 'UPI' | 'Cash' | 'Card' | 'Bank Transfer';
}

interface Visitor {
  id: string;
  name: string;
  type: 'Walk-in' | 'Meditation' | 'Session' | 'Camp' | 'Healer';
  checkIn: string;
  checkOut?: string;
  status: 'Inside' | 'Completed';
}

interface PatientLog {
  id: string;
  name: string;
  healer: string;
  treatment: string;
  regDate: string;
  status: 'Active' | 'Inactive' | 'On Hold' | 'Completed';
}

interface Payment {
  invoiceId: string;
  patientName: string;
  sessionRef: string;
  totalAmount: number;
  paidAmount: number;
  outstandingBalance: number;
  status: 'Paid' | 'Pending' | 'Partial';
  date: string;
  method?: 'UPI' | 'Cash' | 'Card' | 'Bank Transfer';
}

interface Healer {
  name: string;
  certificationLevel: string;
  specialization: string;
  activePatientsCount: number;
  cumulativeHealingCount: number;
  sessionsPendingNotes: number;
}

interface WorkerAttendance {
  id: string;
  name: string;
  role: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Absent' | 'Half Day';
}

const DashboardPage: React.FC = () => {
  const history = useHistory();
  const { user } = useAuthStore();

  const isBranchAdmin = user?.role === 'BRANCH_ADMIN';

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [showAddTransactionModal, setShowAddTransactionModal] = useState<boolean>(false);
  const [showAddVisitorModal, setShowAddVisitorModal] = useState<boolean>(false);
  const [showMarkAttendanceModal, setShowMarkAttendanceModal] = useState<boolean>(false);

  // States with Mock Data
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: '#TXN-7721', type: 'Income', amount: 1500, category: 'Healing Session Fee', date: '2026-05-26', method: 'UPI' },
    { id: '#TXN-7722', type: 'Expense', amount: 800, category: 'Incense Oils & Supplies', date: '2026-05-26', method: 'Cash' },
    { id: '#TXN-7723', type: 'Income', amount: 2500, category: 'Meditation Course Registry', date: '2026-05-26', method: 'Card' },
    { id: '#TXN-7724', type: 'Income', amount: 1200, category: 'Chakra Balancing Fee', date: '2026-05-25', method: 'UPI' },
    { id: '#TXN-7725', type: 'Expense', amount: 1500, category: 'Facility Utility Maintenance', date: '2026-05-25', method: 'Bank Transfer' },
  ]);

  const [visitors, setVisitors] = useState<Visitor[]>([
    { id: '#VIS-4091', name: 'Rahul Sharma', type: 'Walk-in', checkIn: '09:15 AM', status: 'Inside' },
    { id: '#VIS-4092', name: 'Aarav Mehta', type: 'Meditation', checkIn: '09:45 AM', status: 'Inside' },
    { id: '#VIS-4093', name: 'Meera Sen', type: 'Session', checkIn: '10:10 AM', status: 'Inside' },
    { id: '#VIS-4094', name: 'Dr. Kevin Smith', type: 'Healer', checkIn: '08:30 AM', status: 'Inside' },
    { id: '#VIS-4095', name: 'Sunil Verma', type: 'Camp', checkIn: '07:30 AM', checkOut: '11:00 AM', status: 'Completed' },
  ]);

  const [patients] = useState<PatientLog[]>([
    { id: '#P-8921', name: 'Sarah Mitchell', healer: 'Dr. Anjali Rao', treatment: 'Lower Back Pain', regDate: '2026-05-26', status: 'Active' },
    { id: '#P-8922', name: 'John Walker', healer: 'Dr. Kevin Smith', treatment: 'Osteoarthritis', regDate: '2026-05-25', status: 'Active' },
    { id: '#P-8923', name: 'Elena Rostova', healer: 'Dr. Anjali Rao', treatment: 'Anxiety GAD', regDate: '2026-05-24', status: 'Inactive' },
    { id: '#P-8924', name: 'Karan Malhotra', healer: 'Dr. Kevin Smith', treatment: 'Chronic Fatigue', regDate: '2026-05-26', status: 'Active' },
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    { invoiceId: '#INV-9021', patientName: 'Sarah Mitchell', sessionRef: '#SES-301', totalAmount: 1500, paidAmount: 1500, outstandingBalance: 0, status: 'Paid', date: '2026-05-26', method: 'UPI' },
    { invoiceId: '#INV-9022', patientName: 'John Walker', sessionRef: '#SES-202', totalAmount: 2500, paidAmount: 1000, outstandingBalance: 1500, status: 'Partial', date: '2026-05-25', method: 'Cash' },
    { invoiceId: '#INV-9023', patientName: 'Elena Rostova', sessionRef: '#SES-302', totalAmount: 1200, paidAmount: 0, outstandingBalance: 1200, status: 'Pending', date: '2026-05-24' },
    { invoiceId: '#INV-9024', patientName: 'Karan Malhotra', sessionRef: '#SES-303', totalAmount: 1800, paidAmount: 1800, outstandingBalance: 0, status: 'Paid', date: '2026-05-26', method: 'Card' },
  ]);

  const [healersList] = useState<Healer[]>([
    { name: 'Dr. Anjali Rao', certificationLevel: 'Associate Pranic Healer', specialization: 'Advanced Pranic Healing & Psychotherapy', activePatientsCount: 12, cumulativeHealingCount: 148, sessionsPendingNotes: 3 },
    { name: 'Dr. Kevin Smith', certificationLevel: 'Certified Pranic Healer', specialization: 'Pranic Psychotherapy', activePatientsCount: 8, cumulativeHealingCount: 95, sessionsPendingNotes: 1 },
  ]);

  const [workerAttendanceList, setWorkerAttendanceList] = useState<WorkerAttendance[]>([
    { id: '#WRK-001', name: 'Sanjay M.', role: 'Senior Healer', checkIn: '08:50 AM', checkOut: '05:30 PM', status: 'Present' },
    { id: '#WRK-002', name: 'Rekha D.', role: 'Associate Healer', checkIn: '09:10 AM', checkOut: '01:00 PM', status: 'Half Day' },
    { id: '#WRK-003', name: 'Amit Verma', role: 'Center Coordinator', checkIn: '08:45 AM', checkOut: '06:00 PM', status: 'Present' },
    { id: '#WRK-004', name: 'Priya Nair', role: 'Front Desk Receptionist', checkIn: '--', checkOut: '--', status: 'Absent' },
  ]);



  // Form states
  const [newTxn, setNewTxn] = useState({ type: 'Income' as 'Income' | 'Expense', amount: 1000, category: 'General fee', method: 'UPI' as any });
  const [newVisitor, setNewVisitor] = useState({ name: '', type: 'Walk-in' as any, checkIn: '10:30 AM' });
  const [attendanceWorker, setAttendanceWorker] = useState({ name: 'Sanjay M.', status: 'Present' as any });

  const weeklyFinanceData = [
    { day: 'Mon', current: { income: 12000, expense: 4500 }, previous: { income: 10500, expense: 5000 } },
    { day: 'Tue', current: { income: 15500, expense: 6200 }, previous: { income: 14000, expense: 5500 } },
    { day: 'Wed', current: { income: 10800, expense: 7100 }, previous: { income: 12000, expense: 6800 } },
    { day: 'Thu', current: { income: 14200, expense: 5800 }, previous: { income: 13500, expense: 6000 } },
    { day: 'Fri', current: { income: 18000, expense: 4900 }, previous: { income: 16000, expense: 5200 } },
    { day: 'Sat', current: { income: 16500, expense: 3200 }, previous: { income: 15000, expense: 3500 } },
    { day: 'Sun', current: { income: 9500, expense: 2100 }, previous: { income: 8000, expense: 2500 } },
  ];

  const maxVal = 20000;
  const scale = 180 / maxVal;

  // Dynamic user name details resolution
  const userName = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Aria Seraphina';
  const userInitials = user
    ? `${user.name?.[0] || user.firstName?.[0] || 'B'}${user.name?.split(' ')?.[1]?.[0] || user.lastName?.[0] || 'A'}`.toUpperCase()
    : 'BA';
  const rawBranch = typeof user?.branch === 'object' && user?.branch !== null
    ? (user.branch as any).name
    : (user?.branch || 'Mumbai');
  const branchName = rawBranch.toLowerCase().includes('branch') ? rawBranch : `${rawBranch} Branch`;
  const nameParts = userName.split(' ');
  const displayName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[1][0]}.` : userName;

  // Format today's date
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  // Simulated live skeleton trigger
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Calculated Core Analytics Metrics
  const totalIncomeToday = transactions.filter(t => t.type === 'Income' && t.date === '2026-05-26').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenseToday = transactions.filter(t => t.type === 'Expense' && t.date === '2026-05-26').reduce((sum, t) => sum + t.amount, 0);
  const netBalanceToday = totalIncomeToday - totalExpenseToday;
  const newPatientsCount = patients.filter(p => p.regDate === '2026-05-26').length;
  const activeCasesCount = patients.filter(p => p.status === 'Active').length;

  const pendingPaymentsCount = payments.filter(p => p.status === 'Pending' || p.status === 'Partial').length;
  const activeHealersCount = healersList.length;

  const presentWorkersCount = workerAttendanceList.filter(w => w.status === 'Present').length;
  const absentWorkersCount = workerAttendanceList.filter(w => w.status === 'Absent').length;
  const halfDayWorkersCount = workerAttendanceList.filter(w => w.status === 'Half Day').length;
  const urgentFollowsCount = 3;

  const handleAddTxnSubmit = () => {
    const txn: Transaction = {
      id: `#TXN-${Math.floor(7000 + Math.random() * 999)}`,
      type: newTxn.type,
      amount: Number(newTxn.amount),
      category: newTxn.category,
      date: '2026-05-26',
      method: newTxn.method,
    };
    setTransactions([txn, ...transactions]);

    if (newTxn.type === 'Income') {
      const pay: Payment = {
        invoiceId: `#INV-${Math.floor(9000 + Math.random() * 999)}`,
        patientName: 'Walk-in Patient',
        sessionRef: 'Walk-in Session',
        totalAmount: Number(newTxn.amount),
        paidAmount: Number(newTxn.amount),
        outstandingBalance: 0,
        status: 'Paid',
        date: '2026-05-26',
        method: newTxn.method,
      };
      setPayments([pay, ...payments]);
    }

    setShowAddTransactionModal(false);
    alert('Transaction committed to branch financial ledger successfully!');
  };

  const handleAddVisitorSubmit = () => {
    if (!newVisitor.name) return;
    const vis: Visitor = {
      id: `#VIS-${Math.floor(4000 + Math.random() * 999)}`,
      name: newVisitor.name,
      type: newVisitor.type,
      checkIn: newVisitor.checkIn,
      status: 'Inside',
    };
    setVisitors([vis, ...visitors]);

    setShowAddVisitorModal(false);
    alert('Visitor log check-in recorded successfully!');
  };

  const handleMarkAttendanceSubmit = () => {
    const updated = workerAttendanceList.map(w => 
      w.name === attendanceWorker.name ? { ...w, status: attendanceWorker.status, checkIn: attendanceWorker.status === 'Absent' ? '--' : '09:00 AM' } : w
    );
    setWorkerAttendanceList(updated);

    setShowMarkAttendanceModal(false);
    alert(`Attendance marked successfully: ${attendanceWorker.name} set to [${attendanceWorker.status}]`);
  };

  if (!isBranchAdmin) {
    return (
      <IonPage className="sa-page">
        <IonContent className="sa-page__content" fullscreen>
          <div className="db-access-restricted-container">
            <div className="db-access-restricted-card">
              <div className="db-access-restricted-icon">
                <IonIcon icon={alertCircleOutline} />
              </div>
              <div className="db-access-restricted-details">
                <span className="db-access-restricted-title">Unauthorized Node Access</span>
                <p className="db-access-restricted-desc">
                  Access Denied. The Branch Admin Dashboard is restricted exclusively to authorized Branch Admin users. You do not possess the required credentials to access this branch operational node.
                </p>
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className="sa-page">
      <IonContent className="sa-page__content" fullscreen>
        <div className="db-corp-layout">
          
          <main className="db-corp-canvas">
            
            {/* Sticky Horizontal Header Navbar */}
            <header className="db-corp-navbar">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <IonButtons slot="start" style={{ display: 'flex', alignItems: 'center' }}>
                  <IonMenuButton style={{ color: '#0D5C46' }} />
                </IonButtons>
                <div className="db-corp-navbar-left">
                  <h1 className="db-corp-page-title">Branch Admin Dashboard</h1>
                  <p className="db-corp-page-subtitle">Real-time daily operations node • {formattedDate}</p>
                </div>
              </div>

              <div className="db-corp-navbar-right">


                <button className="db-corp-nav-icon-btn" title="System Alerts">
                  <IonIcon icon={notificationsOutline} />
                  <div className="db-corp-badge-dot" />
                </button>

                <button className="db-corp-nav-icon-btn" title="Help Hub">
                  <IonIcon icon={helpCircleOutline} />
                </button>
                <div className="db-corp-nav-avatar">{userInitials}</div>
              </div>
            </header>

            <div className="db-hc-layout" style={{ padding: '24px' }}>              {/* =========================================================================
                  HEADER METRIC SUMMARY STRIP: BRD WIDGETS
                  ========================================================================= */}
              <div className="db-hc-metrics-grid-10" style={{ marginBottom: '12px' }}>
                
                {/* Widget 1: Daily Income */}
                <div className="db-hc-metric-card db-hc-card-accent-green">
                  <div className="db-hc-card-header">
                    <div className="db-hc-card-icon-wrapper db-hc-icon-green">
                      <IonIcon icon={cashOutline} />
                    </div>
                    <span className="db-hc-card-trend"><IonIcon icon={trendingUpOutline} /> +12.4%</span>
                  </div>
                  <div className="db-hc-card-body">
                    <span className="db-hc-card-label">DAILY INCOME</span>
                    <h3 className="db-hc-card-value">₹{totalIncomeToday}</h3>
                  </div>
                </div>

                {/* Widget 2: Daily Expense */}
                <div className="db-hc-metric-card db-hc-card-accent-red">
                  <div className="db-hc-card-header">
                    <div className="db-hc-card-icon-wrapper db-hc-icon-red">
                      <IonIcon icon={cashOutline} />
                    </div>
                    <span className="db-hc-card-label" style={{ fontSize: '9px', color: '#ef4444' }}>Outflow</span>
                  </div>
                  <div className="db-hc-card-body">
                    <span className="db-hc-card-label">DAILY EXPENSE</span>
                    <h3 className="db-hc-card-value">₹{totalExpenseToday}</h3>
                  </div>
                </div>

                {/* Widget 3: Net Balance */}
                <div className="db-hc-metric-card db-hc-card-accent-teal">
                  <div className="db-hc-card-header">
                    <div className="db-hc-card-icon-wrapper db-hc-icon-teal">
                      <IonIcon icon={shieldCheckmarkOutline} />
                    </div>
                    <span className="db-hc-card-trend"><IonIcon icon={trendingUpOutline} /> Optimal</span>
                  </div>
                  <div className="db-hc-card-body">
                    <span className="db-hc-card-label">NET BALANCE</span>
                    <h3 className="db-hc-card-value" style={{ color: netBalanceToday >= 0 ? '#107C5F' : '#ef4444' }}>
                      ₹{netBalanceToday}
                    </h3>
                  </div>
                </div>

                {/* Widget 4: Today's Sessions */}
                <div className="db-hc-metric-card db-hc-card-accent-blue">
                  <div className="db-hc-card-header">
                    <div className="db-hc-card-icon-wrapper db-hc-icon-blue">
                      <IonIcon icon={peopleOutline} />
                    </div>
                    <span className="st-panel-badge st-panel-badge--green" style={{ fontSize: '9px', background: '#eff6ff', color: '#1d4ed8' }}>
                      4 Today
                    </span>
                  </div>
                  <div className="db-hc-card-body">
                    <span className="db-hc-card-label">TODAY'S SESSIONS</span>
                    <h3 className="db-hc-card-value">4</h3>
                  </div>
                </div>

                {/* Widget 5: Pending Notes */}
                <div className="db-hc-metric-card db-hc-card-accent-orange">
                  <div className="db-hc-card-header">
                    <div className="db-hc-card-icon-wrapper db-hc-icon-orange">
                      <IonIcon icon={medkitOutline} />
                    </div>
                    <span className="sa-badge sa-badge--pending" style={{ fontSize: '9px' }}>Missing observations</span>
                  </div>
                  <div className="db-hc-card-body">
                    <span className="db-hc-card-label">PENDING NOTES</span>
                    <h3 className="db-hc-card-value" style={{ color: '#b45309' }}>3</h3>
                  </div>
                </div>

                {/* Widget 6: Follow-up Alerts */}
                <div className="db-hc-metric-card db-hc-card-accent-red">
                  <div className="db-hc-card-header">
                    <div className="db-hc-card-icon-wrapper db-hc-icon-red">
                      <IonIcon icon={alertCircleOutline} />
                    </div>
                    <span className="sa-badge sa-badge--inactive" style={{ fontSize: '9px' }}>Urgent Action</span>
                  </div>
                  <div className="db-hc-card-body">
                    <span className="db-hc-card-label">FOLLOW-UP ALERTS</span>
                    <h3 className="db-hc-card-value" style={{ color: '#dc2626' }}>{urgentFollowsCount}</h3>
                  </div>
                </div>

                {/* Widget 7: Pending Payments */}
                <div className="db-hc-metric-card db-hc-card-accent-red">
                  <div className="db-hc-card-header">
                    <div className="db-hc-card-icon-wrapper db-hc-icon-red">
                      <IonIcon icon={cashOutline} />
                    </div>
                    <span className="db-hc-card-label" style={{ fontSize: '9px', color: '#b91c1c' }}>Unpaid/Partials</span>
                  </div>
                  <div className="db-hc-card-body">
                    <span className="db-hc-card-label">PENDING PAYMENTS</span>
                    <h3 className="db-hc-card-value" style={{ color: '#ef4444' }}>{pendingPaymentsCount}</h3>
                  </div>
                </div>

                {/* Widget 8: Healer Workload */}
                <div className="db-hc-metric-card db-hc-card-accent-blue">
                  <div className="db-hc-card-header">
                    <div className="db-hc-card-icon-wrapper db-hc-icon-blue">
                      <IonIcon icon={personOutline} />
                    </div>
                    <span className="db-hc-card-label" style={{ fontSize: '9px', color: '#1d4ed8' }}>Healers</span>
                  </div>
                  <div className="db-hc-card-body">
                    <span className="db-hc-card-label">HEALER WORKLOAD</span>
                    <h3 className="db-hc-card-value">{activeHealersCount}</h3>
                  </div>
                </div>

              </div>

              {/* =========================================================================
                  MASTER WORKSPACE CONTENT GRID: LEFT (70%) vs RIGHT SIDEBAR (30%)
                  ========================================================================= */}
              <div className="db-corp-content-grid" style={{ padding: '0' }}>
                
                {/* Left Column (70%): Operations Workspace */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {isLoading ? (
                    <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid #e2e8f0' }}>
                      <div className="db-hc-skeleton db-hc-skeleton-row" style={{ width: '40%', height: '24px', marginBottom: '24px' }} />
                      <div className="db-hc-skeleton db-hc-skeleton-row" style={{ width: '100%' }} />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      
                      {/* Weekly Comparison Section (copied from Super Admin) */}
                      <div className="db-corp-card">
                        <div className="sa-section__header" style={{ marginBottom: '16px' }}>
                          <div>
                            <h2 className="sa-section__title" style={{ fontSize: '20px', fontWeight: 'bold' }}>Weekly Comparison</h2>
                            <p className="sa-section__subtitle" style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>This Week vs Previous Week (Income &amp; Expenses)</p>
                          </div>
                        </div>

                        <div className="sa-finance-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                          <div className="sa-finance-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px' }}>
                            <div className="sa-finance-card__label" style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total This Week Income</div>
                            <div className="sa-finance-card__value" style={{ fontSize: '32px', fontWeight: 'bold', color: '#0D5C46', marginTop: '4px' }}>₹85,500</div>
                          </div>
                          <div className="sa-finance-card" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '16px', borderRadius: '8px' }}>
                            <div className="sa-finance-card__label" style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Total This Week Expenses</div>
                            <div className="sa-finance-card__value" style={{ fontSize: '32px', fontWeight: 'bold', color: '#dc2626', marginTop: '4px' }}>₹33,800</div>
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

                      {/* Healer Workload & Performance Table */}
                      <div className="db-corp-card" style={{ marginTop: '4px' }}>
                        <div className="sa-section__header" style={{ marginBottom: '16px' }}>
                          <div>
                            <h2 className="sa-section__title" style={{ fontSize: '20px', fontWeight: 'bold' }}>Healer Workload &amp; Workforce Performance</h2>
                            <p className="sa-section__subtitle" style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>Cumulative healed logs and active patient cases per healer</p>
                          </div>
                        </div>

                        <div className="st-table-container">
                          <table className="st-table">
                            <thead>
                              <tr>
                                <th>Healer Name</th>
                                <th>Specialization</th>
                                <th>Active Cases</th>
                                <th>Cumulative Healings</th>
                                <th>Pending Observations</th>
                              </tr>
                            </thead>
                            <tbody>
                              {healersList.map((healer, i) => (
                                <tr key={i}>
                                  <td style={{ fontWeight: 'bold', color: '#0d5c46' }}>{healer.name}</td>
                                  <td>{healer.specialization}</td>
                                  <td>
                                    <span className="st-panel-badge st-panel-badge--green">{healer.activePatientsCount} Patients</span>
                                  </td>
                                  <td style={{ fontWeight: 'bold' }}>{healer.cumulativeHealingCount} Healed</td>
                                  <td>
                                    {healer.sessionsPendingNotes > 0 ? (
                                      <span className="sa-badge sa-badge--pending">⚠️ {healer.sessionsPendingNotes} Notes Pending</span>
                                    ) : (
                                      <span className="st-panel-badge st-panel-badge--green">✓ Up to Date</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Urgent Tasks, Follow-ups, and Payments Collections */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        
                        {/* Urgent Follow-ups */}
                        <div className="db-corp-card">
                          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 800, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <IonIcon icon={alertCircleOutline} /> Urgent Follow-up Alerts
                          </h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div style={{ background: '#fdf2f2', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <strong style={{ color: '#991b1b', fontSize: '13px' }}>Elena Gilbert</strong>
                                <div style={{ fontSize: '11px', color: '#b91c1c' }}>Pranic Psychotherapy • Today</div>
                              </div>
                              <span style={{ fontSize: '11px', background: '#dc2626', color: '#ffffff', padding: '2px 8px', borderRadius: '9999px', fontWeight: 'bold' }}>Urgent</span>
                            </div>
                            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <strong style={{ color: '#92400e', fontSize: '13px' }}>Stefan Salvatore</strong>
                                <div style={{ fontSize: '11px', color: '#b45309' }}>Advanced Pranic Healing • Today</div>
                              </div>
                              <span style={{ fontSize: '11px', background: '#d97706', color: '#ffffff', padding: '2px 8px', borderRadius: '9999px', fontWeight: 'bold' }}>Pending</span>
                            </div>
                          </div>
                        </div>

                        {/* Pending Collections */}
                        <div className="db-corp-card">
                          <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 800, color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <IonIcon icon={cashOutline} /> Pending Collections Ledger
                          </h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {payments.filter(p => p.status !== 'Paid').map((pay, i) => (
                              <div key={i} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 14px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                  <strong style={{ color: '#1e293b', fontSize: '13px' }}>{pay.patientName}</strong>
                                  <div style={{ fontSize: '11px', color: '#64748b' }}>Outstanding: ₹{pay.outstandingBalance}</div>
                                </div>
                                <span className={`st-panel-badge ${pay.status === 'Partial' ? 'st-panel-badge--orange' : 'sa-badge--inactive'}`}>
                                  {pay.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>

                    </div>
                  )}

                </div>

                {/* Right Column (30%): Branch Admin Scoped Quick Actions (Primary Dark Green #0D5C46) */}
                <aside className="db-corp-sidebar-right">
                  <h3 className="db-corp-right-title">Branch Admin Portal</h3>
                  
                  <div className="db-corp-action-list">
                    <div className="db-corp-action-item" onClick={() => history.push(ROUTES.BRANCH_ADMIN.REGISTER_PATIENT)}>
                      <span className="db-corp-action-text">Register Patient</span>
                      <IonIcon icon={arrowForwardOutline} className="db-corp-action-icon" />
                    </div>

                    <div className="db-corp-action-item" onClick={() => history.push(ROUTES.BRANCH_ADMIN.CREATE_HEALER)}>
                      <span className="db-corp-action-text">Create Healer</span>
                      <IonIcon icon={arrowForwardOutline} className="db-corp-action-icon" />
                    </div>

                    <div className="db-corp-action-item" onClick={() => history.push(ROUTES.BRANCH_ADMIN.VISITOR_CHECKIN)}>
                      <span className="db-corp-action-text">Log Check-In</span>
                      <IonIcon icon={arrowForwardOutline} className="db-corp-action-icon" />
                    </div>
                    <div className="db-corp-action-item" onClick={() => setShowMarkAttendanceModal(true)}>
                      <span className="db-corp-action-text">Mark Attendance</span>
                      <IonIcon icon={arrowForwardOutline} className="db-corp-action-icon" />
                    </div>
                  </div>

                  {/* Calming layout metadata info */}
                  <div style={{ marginTop: '24px', borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '16px' }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.6)', fontWeight: 800 }}>
                      SYSTEM RESTRICTIONS
                    </span>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', marginTop: '4px', lineHeight: 1.4, margin: 0 }}>
                      Access Scoped strictly to assignments. Unauthorized cross-tenant modifications are blocked and audited automatically under HIPAA compliance.
                    </p>
                  </div>
                </aside>

              </div>

            </div>
          </main>

        </div>

      </IonContent>

      {/* Floating Action FAB triggers */}
      <div className="db-hc-fab-container">
        <button className="db-hc-fab-btn" title="Add Transaction" onClick={() => setShowAddTransactionModal(true)}>
          <IonIcon icon={cashOutline} />
        </button>
        <button className="db-hc-fab-btn" title="Check-In Visitor" onClick={() => history.push(ROUTES.BRANCH_ADMIN.VISITOR_CHECKIN)}>
          <IonIcon icon={peopleOutline} />
        </button>
      </div>

      {/* =========================================================================
          MODALS INTEGRATIONS
          ========================================================================= */}
      {/* 1. Add Transaction */}
      <IonModal isOpen={showAddTransactionModal} onDidDismiss={() => setShowAddTransactionModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Record Transaction Inflow</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowAddTransactionModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="st-form">
              <div className="st-form-group">
                <label className="st-form-label">TRANSACTION TYPE</label>
                <select className="st-input" value={newTxn.type} onChange={(e) => setNewTxn({ ...newTxn, type: e.target.value as any })}>
                  <option value="Income">Income Inflow</option>
                  <option value="Expense">Expense Outflow</option>
                </select>
              </div>

              <div className="st-form-group">
                <label className="st-form-label">TRANSACTION AMOUNT (INR) *</label>
                <input type="number" className="st-input" value={newTxn.amount} onChange={(e) => setNewTxn({ ...newTxn, amount: Number(e.target.value) })} />
              </div>

              <div className="st-form-group">
                <label className="st-form-label">CATEGORY / PURPOSE</label>
                <input type="text" className="st-input" placeholder="e.g. Session Fee" value={newTxn.category} onChange={(e) => setNewTxn({ ...newTxn, category: e.target.value })} />
              </div>

              <div className="st-form-group">
                <label className="st-form-label">PAYMENT METHOD</label>
                <select className="st-input" value={newTxn.method} onChange={(e) => setNewTxn({ ...newTxn, method: e.target.value as any })}>
                  <option value="UPI">UPI Online</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowAddTransactionModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleAddTxnSubmit}>Commit transaction</button>
          </div>
        </div>
      </IonModal>

      {/* 2. Add Visitor */}
      <IonModal isOpen={showAddVisitorModal} onDidDismiss={() => setShowAddVisitorModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Visitor Check-In Log</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowAddVisitorModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="st-form">
              <div className="st-form-group">
                <label className="st-form-label">VISITOR FULL NAME *</label>
                <input type="text" className="st-input" placeholder="Visitor name" value={newVisitor.name} onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })} />
              </div>

              <div className="st-form-group">
                <label className="st-form-label">VISITATION PURPOSE</label>
                <select className="st-input" value={newVisitor.type} onChange={(e) => setNewVisitor({ ...newVisitor, type: e.target.value as any })}>
                  <option value="Walk-in">Walk-in Consultation</option>
                  <option value="Meditation">Group Meditation</option>
                  <option value="Session">Healing Session</option>
                  <option value="Camp">Pranic Camp</option>
                </select>
              </div>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowAddVisitorModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleAddVisitorSubmit}>Log Check-In</button>
          </div>
        </div>
      </IonModal>

      {/* 3. Mark Attendance */}
      <IonModal isOpen={showMarkAttendanceModal} onDidDismiss={() => setShowMarkAttendanceModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Mark Roster Attendance</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowMarkAttendanceModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="st-form">
              <div className="st-form-group">
                <label className="st-form-label">WORKER NAME</label>
                <select className="st-input" value={attendanceWorker.name} onChange={(e) => setAttendanceWorker({ ...attendanceWorker, name: e.target.value })}>
                  <option value="Sanjay M.">Sanjay M.</option>
                  <option value="Rekha D.">Rekha D.</option>
                </select>
              </div>

              <div className="st-form-group">
                <label className="st-form-label">ATTENDANCE STATUS</label>
                <select className="sa-settings__input" style={{ width: '100%', height: '40px', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0 12px' }} value={attendanceWorker.status} onChange={(e) => setAttendanceWorker({ ...attendanceWorker, status: e.target.value as any })}>
                  <option value="Present">Present</option>
                  <option value="Half Day">Half Day</option>
                  <option value="Absent">Absent</option>
                </select>
              </div>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowMarkAttendanceModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleMarkAttendanceSubmit}>Commit Attendance</button>
          </div>
        </div>
      </IonModal>

    </IonPage>
  );
};

export default DashboardPage;
