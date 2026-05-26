import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonMenuButton,
} from '@ionic/react';
import {
  barChartOutline,
  calendarOutline,
  downloadOutline,
  funnelOutline,
  cashOutline,
  peopleOutline,
  timeOutline,
  starOutline,
  chevronForwardOutline,
  chevronBackOutline,
  searchOutline,
  lockClosedOutline,
  filterOutline,
  cardOutline,
  businessOutline,
  walletOutline,
  trendingUpOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../../store/auth.store';
import './branch-admin.css';

interface FinanceRow {
  date: string;
  type: 'Income' | 'Expense';
  category: string;
  amount: string;
  paymentMode: string;
  recordedBy: string;
}

interface VisitorRow {
  date: string;
  name: string;
  purpose: string;
  checkIn: string;
  checkOut: string;
  status: 'Checked Out' | 'Inside Center';
}

interface SessionRow {
  id: string;
  patient: string;
  healer: string;
  treatment: string;
  time: string;
  status: 'Completed' | 'Scheduled' | 'Cancelled';
}

interface AttendanceRow {
  worker: string;
  role: string;
  date: string;
  checkIn: string;
  hours: string;
  status: 'Present' | 'Absent' | 'Half Day';
}

interface HealerRow {
  healer: string;
  specialty: string;
  sessions: number;
  satisfaction: string;
  rating: string;
  status: 'Active' | 'On Leave';
}

const ReportsPage: React.FC = () => {
  const { user } = useAuthStore();

  // Dynamic branch context
  const rawBranch = typeof user?.branch === 'object' && user?.branch !== null
    ? (user.branch as any).name
    : (user?.branch || 'Mumbai');
  const branchName = rawBranch.toLowerCase().includes('branch') ? rawBranch : `${rawBranch} Branch`;

  // Filters State
  const [dateRange, setDateRange] = useState<'Today' | 'This Week' | 'This Month' | 'Custom'>('This Month');
  const [categoryFilter, setCategoryFilter] = useState('All Departments');
  const [searchQuery, setSearchQuery] = useState('');

  // Tabs State
  const [selectedTab, setSelectedTab] = useState<'Finance' | 'Visitors' | 'Sessions' | 'Attendance' | 'Healer'>('Finance');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock ledger data lists
  const financeData: FinanceRow[] = [
    { date: 'Oct 24, 2023 | 10:45 AM', type: 'Income', category: 'Consultation Fee', amount: '₹2,500.00', paymentMode: 'UPI / GPay', recordedBy: 'Anjali Sharma' },
    { date: 'Oct 24, 2023 | 11:30 AM', type: 'Expense', category: 'Medical Supplies', amount: '₹4,200.00', paymentMode: 'Bank Transfer', recordedBy: 'Rajesh Kumar' },
    { date: 'Oct 23, 2023 | 04:15 PM', type: 'Income', category: 'Yoga Session', amount: '₹1,200.00', paymentMode: 'Cash', recordedBy: 'Anjali Sharma' },
    { date: 'Oct 23, 2023 | 05:00 PM', type: 'Income', category: 'Ayurvedic Meds', amount: '₹8,450.00', paymentMode: 'Card', recordedBy: 'Siddharth M.' },
    { date: 'Oct 23, 2023 | 06:10 PM', type: 'Expense', category: 'Utility Bills', amount: '₹12,000.00', paymentMode: 'Bank Transfer', recordedBy: 'Admin Mumbai' }
  ];

  const visitorData: VisitorRow[] = [
    { date: 'Oct 24, 2023', name: 'Karan Johar', purpose: 'Healing Session', checkIn: '09:30 AM', checkOut: '10:30 AM', status: 'Checked Out' },
    { date: 'Oct 24, 2023', name: 'Sunita Patel', purpose: 'Consultation', checkIn: '10:15 AM', checkOut: '11:00 AM', status: 'Checked Out' },
    { date: 'Oct 24, 2023', name: 'Rohan Das', purpose: 'Inquiry', checkIn: '02:00 PM', checkOut: '--', status: 'Inside Center' },
    { date: 'Oct 23, 2023', name: 'Amit Mehra', purpose: 'Therapy Session', checkIn: '03:00 PM', checkOut: '04:30 PM', status: 'Checked Out' },
    { date: 'Oct 23, 2023', name: 'Nisha Sen', purpose: 'Pharmacy Visit', checkIn: '04:45 PM', checkOut: '05:05 PM', status: 'Checked Out' }
  ];

  const sessionData: SessionRow[] = [
    { id: 'S-9081', patient: 'Elena Rodriguez', healer: 'Dr. Aris Varma', treatment: 'Basic Pranic Healing', time: '09:00 AM', status: 'Completed' },
    { id: 'S-9082', patient: 'David Park', healer: 'Julian Mars', treatment: 'Advanced Pranic Healing', time: '11:00 AM', status: 'Completed' },
    { id: 'S-9083', patient: 'Ayesha Khan', healer: 'Dr. Aris Varma', treatment: 'Pranic Psychotherapy', time: '02:30 PM', status: 'Scheduled' },
    { id: 'S-9084', patient: 'Samuel Peterson', healer: 'Julian Mars', treatment: 'Crystal Healing', time: '04:00 PM', status: 'Scheduled' },
    { id: 'S-9085', patient: 'Carol Danvers', healer: 'Dr. Aris Varma', treatment: 'Basic Pranic Healing', time: 'Yesterday', status: 'Completed' }
  ];

  const attendanceData: AttendanceRow[] = [
    { worker: 'Elena Rodriguez', role: 'Senior Healer', date: 'Oct 24, 2023', checkIn: '08:15 AM', hours: '8.5h', status: 'Present' },
    { worker: 'David Park', role: 'Admin Staff', date: 'Oct 24, 2023', checkIn: 'N/A', hours: '0.0h', status: 'Absent' },
    { worker: 'Ayesha Khan', role: 'Lead Healer', date: 'Oct 24, 2023', checkIn: '09:30 AM', hours: '4.0h', status: 'Half Day' },
    { worker: 'Samuel Peterson', role: 'Physician', date: 'Oct 24, 2023', checkIn: '08:00 AM', hours: '8.0h', status: 'Present' },
    { worker: 'Marcus Chen', role: 'Lead Administrator', date: 'Oct 24, 2023', checkIn: '08:30 AM', hours: '8.5h', status: 'Present' }
  ];

  const healerData: HealerRow[] = [
    { healer: 'Dr. Aris Varma', specialty: 'Pranic Psychotherapy', sessions: 148, satisfaction: '98%', rating: '4.9', status: 'Active' },
    { healer: 'Julian Mars', specialty: 'Advanced Pranic', sessions: 120, satisfaction: '96%', rating: '4.8', status: 'Active' },
    { healer: 'Dr. Shailesh Kumar', specialty: 'Clinical Psychology', sessions: 95, satisfaction: '95%', rating: '4.7', status: 'Active' },
    { healer: 'Maya Rose', specialty: 'Crystal Healing', sessions: 84, satisfaction: '97%', rating: '4.8', status: 'Active' },
    { healer: 'Lila Thorne', specialty: 'Basic Pranic', sessions: 72, satisfaction: '92%', rating: '4.5', status: 'Active' }
  ];

  // Helper to reset filters
  const handleResetFilters = () => {
    setDateRange('This Month');
    setCategoryFilter('All Departments');
    setSearchQuery('');
  };

  // Helper to search and filter current active list
  const getFilteredData = () => {
    switch (selectedTab) {
      case 'Finance':
        return financeData.filter(d => 
          d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.recordedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.paymentMode.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'Visitors':
        return visitorData.filter(d => 
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.purpose.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'Sessions':
        return sessionData.filter(d => 
          d.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.healer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.treatment.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'Attendance':
        return attendanceData.filter(d => 
          d.worker.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.role.toLowerCase().includes(searchQuery.toLowerCase())
        );
      case 'Healer':
        return healerData.filter(d => 
          d.healer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.specialty.toLowerCase().includes(searchQuery.toLowerCase())
        );
      default:
        return [];
    }
  };

  const activeFilteredList = getFilteredData();
  const totalPages = Math.ceil(activeFilteredList.length / itemsPerPage) || 1;
  const paginatedList = activeFilteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedTab, searchQuery]);

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Reports Center</IonTitle>
          <IonButtons slot="end">
            <button className="sa-page__toolbar-avatar">BA</button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          {/* Header Row */}
          <div className="rp-header-row">
            <div>
              <div className="rp-title-area">
                <h1 className="rp-title">Operational Reports</h1>
                <div className="rp-isolation-badge">
                  <IonIcon icon={lockClosedOutline} className="rp-lock-icon" />
                  <span>Branch Isolation: {branchName}</span>
                </div>
              </div>
              <p className="rp-subtitle">
                Analyze branch performance, financial health, and workforce productivity across all departments.
              </p>
            </div>
            <div className="rp-header-actions">
              <button className="rp-btn rp-btn--outline">
                <IonIcon icon={downloadOutline} /> Export PDF
              </button>
              <button className="rp-btn rp-btn--primary">
                <IonIcon icon={barChartOutline} /> Export Excel
              </button>
            </div>
          </div>

          {/* Filter Panel (Grey Card) */}
          <div className="rp-filter-card">
            <div className="rp-filter-group">
              <div className="rp-filter-item">
                <span className="rp-filter-label">DATE RANGE</span>
                <div className="rp-filter-toggles">
                  <button
                    className={`rp-toggle-btn ${dateRange === 'Today' ? 'rp-toggle-btn--active' : ''}`}
                    onClick={() => setDateRange('Today')}
                  >
                    Today
                  </button>
                  <button
                    className={`rp-toggle-btn ${dateRange === 'This Week' ? 'rp-toggle-btn--active' : ''}`}
                    onClick={() => setDateRange('This Week')}
                  >
                    This Week
                  </button>
                  <button
                    className={`rp-toggle-btn ${dateRange === 'This Month' ? 'rp-toggle-btn--active' : ''}`}
                    onClick={() => setDateRange('This Month')}
                  >
                    This Month
                  </button>
                  <button
                    className={`rp-toggle-btn ${dateRange === 'Custom' ? 'rp-toggle-btn--active' : ''}`}
                    onClick={() => setDateRange('Custom')}
                  >
                    <IonIcon icon={calendarOutline} className="rp-toggle-icon" />
                    Custom
                  </button>
                </div>
              </div>

              <div className="rp-filter-item">
                <span className="rp-filter-label">CATEGORY</span>
                <div className="rp-select-container">
                  <select
                    className="rp-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option>All Departments</option>
                    <option>Medical</option>
                    <option>Therapy</option>
                    <option>Administrative</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="rp-reset-btn" onClick={handleResetFilters}>
              <IonIcon icon={funnelOutline} />
              Reset All Filters
            </button>
          </div>

          {/* Metrics Ribbon (5 Cards with SVG Sparklines) */}
          <div className="rp-metrics-row">
            {/* Card 1: Finance */}
            <div className="rp-metric-card">
              <div className="rp-metric-top">
                <div className="rp-metric-meta">
                  <span className="rp-metric-label">FINANCE</span>
                  <span className="rp-metric-val">₹85,500</span>
                </div>
                <div className="rp-metric-icon rp-metric-icon--teal">
                  <IonIcon icon={cashOutline} />
                </div>
              </div>
              <div className="rp-metric-trend">
                <span className="rp-trend-badge rp-trend-badge--up">▲ 12%</span>
              </div>
              <div className="rp-sparkline-box">
                <svg className="rp-sparkline" viewBox="0 0 120 30">
                  <path
                    d="M0,30 Q15,5 30,25 T60,10 T90,28 T120,8"
                    fill="none"
                    stroke="#1f7a6a"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Card 2: Visitors */}
            <div className="rp-metric-card">
              <div className="rp-metric-top">
                <div className="rp-metric-meta">
                  <span className="rp-metric-label">VISITORS</span>
                  <span className="rp-metric-val">450 Total</span>
                </div>
                <div className="rp-metric-icon rp-metric-icon--blue">
                  <IonIcon icon={peopleOutline} />
                </div>
              </div>
              <div className="rp-metric-trend">
                <span className="rp-trend-badge rp-trend-badge--up">▲ 8%</span>
              </div>
              <div className="rp-sparkline-box">
                <svg className="rp-sparkline" viewBox="0 0 120 30">
                  <path
                    d="M0,28 Q15,15 30,22 T60,8 T90,26 T120,12"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Card 3: Sessions */}
            <div className="rp-metric-card">
              <div className="rp-metric-top">
                <div className="rp-metric-meta">
                  <span className="rp-metric-label">SESSIONS</span>
                  <span className="rp-metric-val">1,240</span>
                </div>
                <div className="rp-metric-icon rp-metric-icon--red">
                  <IonIcon icon={timeOutline} />
                </div>
              </div>
              <div className="rp-metric-trend">
                <span className="rp-trend-badge rp-trend-badge--down">▼ 3%</span>
              </div>
              <div className="rp-sparkline-box">
                <svg className="rp-sparkline" viewBox="0 0 120 30">
                  <path
                    d="M0,8 Q15,22 30,12 T60,28 T90,14 T120,24"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>

            {/* Card 4: Attendance */}
            <div className="rp-metric-card">
              <div className="rp-metric-top">
                <div className="rp-metric-meta">
                  <span className="rp-metric-label">ATTENDANCE</span>
                  <span className="rp-metric-val">42 Present</span>
                </div>
                <div className="rp-metric-icon rp-metric-icon--green">
                  <IonIcon icon={checkmarkCircleOutline} />
                </div>
              </div>
              <div className="rp-metric-trend">
                <span className="rp-trend-badge rp-trend-badge--up">✔ 98%</span>
              </div>
              <div className="rp-sparkline-box">
                <svg className="rp-sparkline" viewBox="0 0 120 30">
                  <line
                    x1="0" y1="20" x2="120" y2="20"
                    stroke="#10b981"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </svg>
              </div>
            </div>

            {/* Card 5: Healer Perf */}
            <div className="rp-metric-card">
              <div className="rp-metric-top">
                <div className="rp-metric-meta">
                  <span className="rp-metric-label">HEALER PERF.</span>
                  <span className="rp-metric-val">Top 15%</span>
                </div>
                <div className="rp-metric-icon rp-metric-icon--purple">
                  <IonIcon icon={starOutline} />
                </div>
              </div>
              <div className="rp-metric-trend">
                <span className="rp-trend-badge rp-trend-badge--up">★ 4.8</span>
              </div>
              <div className="rp-sparkline-box">
                <svg className="rp-sparkline" viewBox="0 0 120 30">
                  <path
                    d="M0,28 Q15,26 30,15 T60,20 T90,10 T120,5"
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Departmental Ledger Panel (Tabs & Table) */}
          <div className="rp-panel">
            <div className="rp-tabs-container">
              <div className="rp-tabs-list">
                <button
                  className={`rp-tab-btn ${selectedTab === 'Finance' ? 'rp-tab-btn--active' : ''}`}
                  onClick={() => setSelectedTab('Finance')}
                >
                  Finance
                </button>
                <button
                  className={`rp-tab-btn ${selectedTab === 'Visitors' ? 'rp-tab-btn--active' : ''}`}
                  onClick={() => setSelectedTab('Visitors')}
                >
                  Visitors
                </button>
                <button
                  className={`rp-tab-btn ${selectedTab === 'Sessions' ? 'rp-tab-btn--active' : ''}`}
                  onClick={() => setSelectedTab('Sessions')}
                >
                  Sessions
                </button>
                <button
                  className={`rp-tab-btn ${selectedTab === 'Attendance' ? 'rp-tab-btn--active' : ''}`}
                  onClick={() => setSelectedTab('Attendance')}
                >
                  Attendance
                </button>
                <button
                  className={`rp-tab-btn ${selectedTab === 'Healer' ? 'rp-tab-btn--active' : ''}`}
                  onClick={() => setSelectedTab('Healer')}
                >
                  Healer
                </button>
              </div>
            </div>

            {/* Sub-Header Actions */}
            <div className="rp-table-header">
              <span className="rp-table-subtitle">
                Recent {selectedTab} Logs (Showing last 50 entries)
              </span>
              <div className="rp-table-actions">
                <div className="rp-search-box">
                  <IonIcon icon={searchOutline} className="rp-search-icon" />
                  <input
                    placeholder={`Search ${selectedTab.toLowerCase()} records...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="rp-table-btn">
                  <IonIcon icon={downloadOutline} />
                </button>
              </div>
            </div>

            {/* Render tables dynamically depending on active tab */}
            <div className="rp-table-container">
              {selectedTab === 'Finance' && (
                <table className="rp-table">
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>TRANSACTION TYPE</th>
                      <th>CATEGORY</th>
                      <th>AMOUNT</th>
                      <th>PAYMENT MODE</th>
                      <th>RECORDED BY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedList.length > 0 ? (
                      (paginatedList as FinanceRow[]).map((row, idx) => (
                        <tr key={idx} className="rp-table-row">
                          <td className="rp-cell-bold">{row.date}</td>
                          <td>
                            <span className={`rp-badge rp-badge--${row.type.toLowerCase()}`}>
                              {row.type}
                            </span>
                          </td>
                          <td>{row.category}</td>
                          <td className="rp-cell-bold">{row.amount}</td>
                          <td>
                            <div className="rp-mode-cell">
                              <IonIcon icon={cardOutline} className="rp-mode-icon" />
                              {row.paymentMode}
                            </div>
                          </td>
                          <td>{row.recordedBy}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="rp-table-empty">No financial logs match your query.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {selectedTab === 'Visitors' && (
                <table className="rp-table">
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>VISITOR NAME</th>
                      <th>PURPOSE</th>
                      <th>CHECK-IN</th>
                      <th>CHECK-OUT</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedList.length > 0 ? (
                      (paginatedList as VisitorRow[]).map((row, idx) => (
                        <tr key={idx} className="rp-table-row">
                          <td className="rp-cell-bold">{row.date}</td>
                          <td className="rp-cell-bold">{row.name}</td>
                          <td>{row.purpose}</td>
                          <td>{row.checkIn}</td>
                          <td>{row.checkOut}</td>
                          <td>
                            <span className={`rp-badge rp-badge--${row.status === 'Checked Out' ? 'expense' : 'income'}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="rp-table-empty">No visitor logs match your query.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {selectedTab === 'Sessions' && (
                <table className="rp-table">
                  <thead>
                    <tr>
                      <th>SESSION ID</th>
                      <th>PATIENT</th>
                      <th>HEALER</th>
                      <th>TREATMENT</th>
                      <th>TIME</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedList.length > 0 ? (
                      (paginatedList as SessionRow[]).map((row, idx) => (
                        <tr key={idx} className="rp-table-row">
                          <td className="rp-cell-bold">{row.id}</td>
                          <td className="rp-cell-bold">{row.patient}</td>
                          <td>{row.healer}</td>
                          <td>{row.treatment}</td>
                          <td>{row.time}</td>
                          <td>
                            <span className={`rp-badge rp-badge--${row.status === 'Completed' ? 'income' : 'general'}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="rp-table-empty">No session logs match your query.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {selectedTab === 'Attendance' && (
                <table className="rp-table">
                  <thead>
                    <tr>
                      <th>WORKER</th>
                      <th>ROLE</th>
                      <th>DATE</th>
                      <th>CHECK-IN</th>
                      <th>TOTAL HOURS</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedList.length > 0 ? (
                      (paginatedList as AttendanceRow[]).map((row, idx) => (
                        <tr key={idx} className="rp-table-row">
                          <td className="rp-cell-bold">{row.worker}</td>
                          <td>{row.role}</td>
                          <td>{row.date}</td>
                          <td>{row.checkIn}</td>
                          <td className="rp-cell-bold">{row.hours}</td>
                          <td>
                            <span className={`rp-badge rp-badge--${row.status.toLowerCase().replace(' ', '-')}`}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="rp-table-empty">No attendance logs match your query.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}

              {selectedTab === 'Healer' && (
                <table className="rp-table">
                  <thead>
                    <tr>
                      <th>HEALER</th>
                      <th>SPECIALTY</th>
                      <th>SESSIONS CONDUCTED</th>
                      <th>SATISFACTION</th>
                      <th>RATING</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedList.length > 0 ? (
                      (paginatedList as HealerRow[]).map((row, idx) => (
                        <tr key={idx} className="rp-table-row">
                          <td className="rp-cell-bold">{row.healer}</td>
                          <td>{row.specialty}</td>
                          <td className="rp-cell-bold">{row.sessions}</td>
                          <td>{row.satisfaction}</td>
                          <td className="rp-cell-bold">{row.rating} / 5</td>
                          <td>
                            <span className="rp-badge rp-badge--income">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="rp-table-empty">No healer logs match your query.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="rp-pagination">
              <span className="rp-pagination-info">
                Showing 1 to {paginatedList.length} of {activeFilteredList.length} entries
              </span>
              {totalPages > 1 && (
                <div className="rp-pagination-controls">
                  <button
                    className="rp-page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                  >
                    <IonIcon icon={chevronBackOutline} />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      className={`rp-page-btn ${currentPage === i + 1 ? 'rp-page-btn--active' : ''}`}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    className="rp-page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                  >
                    <IonIcon icon={chevronForwardOutline} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Dual Analytics Row (Distribution & Peak activity) */}
          <div className="rp-analytics-grid">
            {/* Left Column: Visitor Type Distribution */}
            <div className="rp-panel">
              <div className="rp-panel-header">
                <h2 className="rp-panel-title">Visitor Type Distribution</h2>
                <button className="rp-view-details-link">View Details</button>
              </div>

              <div className="rp-donut-workspace">
                <div className="rp-donut-chart-container">
                  <div className="rp-donut-chart-donut">
                    <svg className="rp-donut-svg" viewBox="0 0 100 100">
                      {/* Patients: 75% (stroke-dasharray="75 25", offset="0") */}
                      <circle
                        cx="50" cy="50" r="40"
                        className="rp-donut-segment rp-donut-segment--patients"
                      />
                      {/* Healers: 15% (stroke-dasharray="15 85", offset="75") */}
                      <circle
                        cx="50" cy="50" r="40"
                        className="rp-donut-segment rp-donut-segment--healers"
                      />
                      {/* Admin: 10% (stroke-dasharray="10 90", offset="90") */}
                      <circle
                        cx="50" cy="50" r="40"
                        className="rp-donut-segment rp-donut-segment--staff"
                      />
                      <circle cx="50" cy="50" r="32" fill="white" />
                    </svg>
                  </div>
                </div>

                <div className="rp-donut-legend">
                  <div className="rp-legend-item">
                    <div className="rp-legend-dot rp-legend-dot--teal"></div>
                    <span className="rp-legend-name">Patients</span>
                    <span className="rp-legend-pct">75%</span>
                  </div>

                  <div className="rp-legend-item">
                    <div className="rp-legend-dot rp-legend-dot--blue"></div>
                    <span className="rp-legend-name">Healers</span>
                    <span className="rp-legend-pct">15%</span>
                  </div>

                  <div className="rp-legend-item">
                    <div className="rp-legend-dot rp-legend-dot--staff"></div>
                    <span className="rp-legend-name">Admin/Staff</span>
                    <span className="rp-legend-pct">10%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Peak Activity Hours */}
            <div className="rp-panel">
              <div className="rp-panel-header">
                <h2 className="rp-panel-title">Peak Activity Hours</h2>
                <button className="rp-view-details-link">View Details</button>
              </div>

              <div className="rp-bar-chart-workspace">
                <div className="rp-bars-container">
                  <div className="rp-chart-bar" style={{ '--bar-height': '20%' } as React.CSSProperties}></div>
                  <div className="rp-chart-bar" style={{ '--bar-height': '40%' } as React.CSSProperties}></div>
                  <div className="rp-chart-bar" style={{ '--bar-height': '80%' } as React.CSSProperties}></div>
                  <div className="rp-chart-bar rp-chart-bar--peak" style={{ '--bar-height': '100%' } as React.CSSProperties}></div>
                  <div className="rp-chart-bar" style={{ '--bar-height': '70%' } as React.CSSProperties}></div>
                  <div className="rp-chart-bar" style={{ '--bar-height': '40%' } as React.CSSProperties}></div>
                  <div className="rp-chart-bar" style={{ '--bar-height': '40%' } as React.CSSProperties}></div>
                  <div className="rp-chart-bar rp-chart-bar--peak" style={{ '--bar-height': '90%' } as React.CSSProperties}></div>
                  <div className="rp-chart-bar rp-chart-bar--peak" style={{ '--bar-height': '85%' } as React.CSSProperties}></div>
                  <div className="rp-chart-bar" style={{ '--bar-height': '45%' } as React.CSSProperties}></div>
                  <div className="rp-chart-bar" style={{ '--bar-height': '20%' } as React.CSSProperties}></div>
                </div>

                <div className="rp-bars-x-axis">
                  <span>08:00</span>
                  <span>13:00</span>
                  <span>18:00</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default ReportsPage;
