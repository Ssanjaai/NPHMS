import React, { useState } from 'react';
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
  searchOutline,
  cashOutline,
  trendingUpOutline,
  walletOutline,
  alertCircleOutline,
  calendarOutline,
  filterOutline,
  downloadOutline,
  businessOutline,
  cardOutline,
  flashOutline,
  documentTextOutline,
  printOutline,
  logoWhatsapp,
  phonePortraitOutline,
  shieldCheckmarkOutline,
  lockClosedOutline,
} from 'ionicons/icons';
import './super-admin.css';

const RevenuePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRange, setSelectedRange] = useState('This Month');
  
  const today = new Date().toISOString().split('T')[0];
  const date5DaysAgo = new Date(); date5DaysAgo.setDate(date5DaysAgo.getDate() - 5);
  const date10DaysAgo = new Date(); date10DaysAgo.setDate(date10DaysAgo.getDate() - 10);
  const date20DaysAgo = new Date(); date20DaysAgo.setDate(date20DaysAgo.getDate() - 20);

  const [transactions, setTransactions] = useState([
    { id: 1, patient: 'Elena Gilbert', branch: 'Uptown Sanctuary', amount: 1500, method: 'Credit Card', status: 'completed', date: today, time: '10:30 AM' },
    { id: 2, patient: 'Stefan Salvatore', branch: 'Coastal Healing Center', amount: 2000, method: 'UPI', status: 'completed', date: today, time: '11:15 AM' },
    { id: 3, patient: 'Bonnie Bennett', branch: 'Green Valley Branch', amount: 1200, method: 'Cash', status: 'pending', date: date5DaysAgo.toISOString().split('T')[0], time: '12:00 PM' },
    { id: 4, patient: 'Damon Salvatore', branch: 'Downtown Sanctuary', amount: 3500, method: 'Debit Card', status: 'completed', date: date5DaysAgo.toISOString().split('T')[0], time: '04:45 PM' },
    { id: 5, patient: 'Caroline Forbes', branch: 'Uptown Sanctuary', amount: 1800, method: 'UPI', status: 'completed', date: date10DaysAgo.toISOString().split('T')[0], time: '02:30 PM' },
    { id: 6, patient: 'Matt Donovan', branch: 'Coastal Healing Center', amount: 900, method: 'Cash', status: 'failed', date: date10DaysAgo.toISOString().split('T')[0], time: '11:00 AM' },
    { id: 7, patient: 'Alaric Saltzman', branch: 'Green Valley Branch', amount: 2500, method: 'UPI', status: 'completed', date: date20DaysAgo.toISOString().split('T')[0], time: '09:00 AM' },
    { id: 8, patient: 'Tyler Lockwood', branch: 'Downtown Sanctuary', amount: 1200, method: 'Cash', status: 'completed', date: date20DaysAgo.toISOString().split('T')[0], time: '03:15 PM' },
  ]);

  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Salaries', branch: 'All Branches', amount: 15000, date: today, status: 'paid' },
    { id: 2, category: 'Rent', branch: 'Uptown Sanctuary', amount: 5000, date: date10DaysAgo.toISOString().split('T')[0], status: 'paid' },
    { id: 3, category: 'Medical Supplies', branch: 'Coastal Healing Center', amount: 3200, date: date10DaysAgo.toISOString().split('T')[0], status: 'paid' },
    { id: 4, category: 'Utilities', branch: 'Green Valley Branch', amount: 1200, date: date5DaysAgo.toISOString().split('T')[0], status: 'pending' },
  ]);

  const [matrixFilter, setMatrixFilter] = useState('Overall');
  const [matrixDateRange, setMatrixDateRange] = useState({ start: '', end: '' });
  
  // Audit Log Filters
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterMode, setFilterMode] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const getCommonFilters = (items: any[]) => {
    let filtered = [...items];
    const todayStr = new Date().toISOString().split('T')[0];
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    const oneMonthAgo = new Date(); oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];

    if (matrixFilter === '1Month') {
      filtered = filtered.filter(i => i.date >= oneMonthAgoStr);
    } else if (matrixFilter === '7Days') {
      filtered = filtered.filter(i => i.date >= sevenDaysAgoStr);
    } else if (matrixFilter === 'Custom' && matrixDateRange.start && matrixDateRange.end) {
      filtered = filtered.filter(i => i.date >= matrixDateRange.start && i.date <= matrixDateRange.end);
    }
    return filtered;
  };

  const dynamicTransactions = getCommonFilters(transactions);
  const dynamicExpenses = getCommonFilters(expenses);

  const totalIncome = dynamicTransactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalPending = dynamicTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = dynamicExpenses
    .filter(e => e.status === 'paid')
    .reduce((sum, e) => sum + e.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  const getFilteredTotals = (branchName: string) => {
    let filteredT = dynamicTransactions.filter(t => t.branch === branchName && t.status === 'completed');
    let filteredE = dynamicExpenses.filter(e => e.branch === branchName || e.branch === 'All Branches');

    const income = filteredT.reduce((sum, t) => sum + t.amount, 0);
    const expense = filteredE.reduce((sum, e) => sum + (e.branch === 'All Branches' ? e.amount / 4 : e.amount), 0);
    
    return { income, expense: Math.round(expense), balance: Math.round(income - expense) };
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.patient.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.branch.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBranch = filterBranch === 'All' || t.branch === filterBranch;
    const matchesMode = filterMode === 'All' || t.method.includes(filterMode);
    
    let matchesDate = true;
    if (dateRange.start && dateRange.end) {
      matchesDate = t.date >= dateRange.start && t.date <= dateRange.end;
    } else if (dateRange.start) {
      matchesDate = t.date >= dateRange.start;
    } else if (dateRange.end) {
      matchesDate = t.date <= dateRange.end;
    }

    return matchesSearch && matchesBranch && matchesMode && matchesDate;
  });

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Finance Dashboard</IonTitle>
          <IonButtons slot="end">
            <button className="sa-page__toolbar-avatar">SA</button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          <div className="sa-page__header">
            <div className="sa-page__header-row" style={{ flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ flex: '1', minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <h1 className="sa-page__title" style={{ margin: 0 }}>Branch-wise Revenue Monitoring</h1>
                  <span className="sa-badge sa-badge--active" style={{ display: 'flex', alignItems: 'center', gap: '4px', textTransform: 'uppercase', fontSize: '10px' }}>
                    <IonIcon icon={shieldCheckmarkOutline} /> Super Admin Access
                  </span>
                </div>
                <p className="sa-page__subtitle">Full organizational financial visibility and cross-branch auditing</p>
              </div>
              <div className="sa-page__header-actions" style={{ flexWrap: 'wrap', gap: '8px' }}>
                <button className="sa-btn sa-btn--primary">
                  <IonIcon icon={flashOutline} /> Global Financial Audit
                </button>
              </div>
            </div>
          </div>

          <div className="sa-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Total Income</div>
                <div className="sa-stat-card__value">₹{totalIncome.toLocaleString()}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} /> Organization-wide Consolidated
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--primary">
                <IonIcon icon={cashOutline} />
              </div>
            </div>

            <div className="sa-stat-card" style={{ '--color-primary': '#ef4444' } as any}>
              <div>
                <div className="sa-stat-card__label">Total Expenses</div>
                <div className="sa-stat-card__value">₹{totalExpenses.toLocaleString()}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#ef4444', transform: 'rotate(90deg)' }} /> Organization-wide Spending
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--danger">
                <IonIcon icon={walletOutline} />
              </div>
            </div>

            <div className="sa-stat-card" style={{ '--color-primary': '#10b981' } as any}>
              <div>
                <div className="sa-stat-card__label">Net Balance</div>
                <div className="sa-stat-card__value">₹{netProfit.toLocaleString()}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} /> Consolidated Standing
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--success">
                <IonIcon icon={trendingUpOutline} />
              </div>
            </div>
          </div>

          {/* <div style={{ marginTop: '32px' }}>
             <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: '#1e293b' }}>Payment Mode Visibility</h3>
             <div className="sa-stats sa-stats--4">
                <div className="sa-stat-card" style={{ '--color-primary': '#64748b' } as any}>
                  <div>
                    <div className="sa-stat-card__label">Cash</div>
                    <div className="sa-stat-card__value">₹{transactions.filter(t => t.method === 'Cash' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</div>
                  </div>
                  <div className="sa-stat-card__icon" style={{ backgroundColor: '#f8fafc', color: '#64748b' }}>
                    <IonIcon icon={cashOutline} />
                  </div>
                </div>
                <div className="sa-stat-card" style={{ '--color-primary': '#7c3aed' } as any}>
                  <div>
                    <div className="sa-stat-card__label">UPI</div>
                    <div className="sa-stat-card__value">₹{transactions.filter(t => t.method === 'UPI' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</div>
                  </div>
                  <div className="sa-stat-card__icon" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
                    <IonIcon icon={phonePortraitOutline} />
                  </div>
                </div>
                <div className="sa-stat-card" style={{ '--color-primary': '#3b82f6' } as any}>
                  <div>
                    <div className="sa-stat-card__label">Card</div>
                    <div className="sa-stat-card__value">₹{transactions.filter(t => t.method.includes('Card') && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</div>
                  </div>
                  <div className="sa-stat-card__icon" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                    <IonIcon icon={cardOutline} />
                  </div>
                </div>
                <div className="sa-stat-card" style={{ '--color-primary': '#0ea5e9' } as any}>
                  <div>
                    <div className="sa-stat-card__label">Bank Transfer</div>
                    <div className="sa-stat-card__value">₹{transactions.filter(t => t.method.includes('Transfer') && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}</div>
                  </div>
                  <div className="sa-stat-card__icon" style={{ backgroundColor: '#f0f9ff', color: '#0ea5e9' }}>
                    <IonIcon icon={businessOutline} />
                  </div>
                </div>
             </div>
          </div> */}

          <div className="sa-section" style={{ marginTop: '32px' }}>
            <div className="sa-section__header">
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                   <div>
                    <h2 className="sa-section__title" style={{ margin: 0 }}>Financial Report Center</h2>
                    <p className="sa-section__subtitle">Generate and export detailed financial statements</p>
                   </div>
                   <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%', maxWidth: '300px' }}>
                      <button className="sa-btn sa-btn--primary" style={{ flex: 1 }}>
                        <IonIcon icon={downloadOutline} /> PDF Export
                      </button>
                      <button className="sa-btn sa-btn--outline" style={{ flex: 1 }}>
                        <IonIcon icon={downloadOutline} /> Excel Export
                      </button>
                   </div>
                </div>
                
                {/* <div className="sa-report-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div className="sa-report-card" onClick={() => alert('Generating Daily Finance Report...')}>
                    <div className="sa-report-card__icon"><IonIcon icon={calendarOutline} /></div>
                    <h3 className="sa-report-card__title">Daily Report</h3>
                    <p className="sa-report-card__desc">Daily audit log for all sanctuary branches.</p>
                    <div className="sa-report-card__action">Generate <IonIcon icon={downloadOutline} /></div>
                  </div>
                  <div className="sa-report-card" onClick={() => alert('Generating Monthly Finance Report...')}>
                    <div className="sa-report-card__icon"><IonIcon icon={documentTextOutline} /></div>
                    <h3 className="sa-report-card__title">Monthly Report</h3>
                    <p className="sa-report-card__desc">Consolidated monthly financial summary.</p>
                    <div className="sa-report-card__action">Generate <IonIcon icon={downloadOutline} /></div>
                  </div>
                  <div className="sa-report-card" onClick={() => alert('Generating Branch-wise Finance Report...')}>
                    <div className="sa-report-card__icon"><IonIcon icon={businessOutline} /></div>
                    <h3 className="sa-report-card__title">Branch Report</h3>
                    <p className="sa-report-card__desc">Regional performance breakdown and analysis.</p>
                    <div className="sa-report-card__action">Generate <IonIcon icon={downloadOutline} /></div>
                  </div>
                </div> */}
              </div>
            </div>
            
            <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 className="sa-section__title">Cross-Branch Performance Matrix</h2>
                <p className="sa-section__subtitle">Consolidated revenue monitoring and regional comparisons</p>
              </div>
              <div className="sa-matrix-filters" style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
                gap: '4px', 
                background: '#f1f5f9', 
                padding: '6px', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                width: '100%',
                maxWidth: '480px'
              }}>
                <button 
                  className={`sa-filter-tab ${matrixFilter === 'Overall' ? 'active' : ''}`}
                  onClick={() => setMatrixFilter('Overall')}
                  style={{ 
                    padding: '10px 20px', 
                    borderRadius: '10px', 
                    fontSize: '13px', 
                    fontWeight: 700, 
                    border: 'none', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s ease',
                    background: matrixFilter === 'Overall' ? '#fff' : 'transparent', 
                    color: matrixFilter === 'Overall' ? '#0f172a' : '#64748b',
                    boxShadow: matrixFilter === 'Overall' ? '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' : 'none' 
                  }}
                >
                  Overall Total
                </button>
                <button 
                  className={`sa-filter-tab ${matrixFilter === '7Days' ? 'active' : ''}`}
                  onClick={() => setMatrixFilter('7Days')}
                  style={{ 
                    padding: '10px 20px', 
                    borderRadius: '10px', 
                    fontSize: '13px', 
                    fontWeight: 700, 
                    border: 'none', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s ease',
                    background: matrixFilter === '7Days' ? '#fff' : 'transparent', 
                    color: matrixFilter === '7Days' ? '#0f172a' : '#64748b',
                    boxShadow: matrixFilter === '7Days' ? '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' : 'none' 
                  }}
                >
                  Last 7 Days
                </button>
                <button 
                  className={`sa-filter-tab ${matrixFilter === '1Month' ? 'active' : ''}`}
                  onClick={() => setMatrixFilter('1Month')}
                  style={{ 
                    padding: '10px 20px', 
                    borderRadius: '10px', 
                    fontSize: '13px', 
                    fontWeight: 700, 
                    border: 'none', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s ease',
                    background: matrixFilter === '1Month' ? '#fff' : 'transparent', 
                    color: matrixFilter === '1Month' ? '#0f172a' : '#64748b',
                    boxShadow: matrixFilter === '1Month' ? '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' : 'none' 
                  }}
                >
                  Last 1 Month
                </button>
                {/* <button 
                  className={`sa-filter-tab ${matrixFilter === 'Custom' ? 'active' : ''}`}
                  onClick={() => setMatrixFilter('Custom')}
                  style={{ 
                    padding: '10px 20px', 
                    borderRadius: '10px', 
                    fontSize: '13px', 
                    fontWeight: 700, 
                    border: 'none', 
                    cursor: 'pointer', 
                    transition: 'all 0.2s ease',
                    background: matrixFilter === 'Custom' ? '#fff' : 'transparent', 
                    color: matrixFilter === 'Custom' ? '#0f172a' : '#64748b',
                    boxShadow: matrixFilter === 'Custom' ? '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)' : 'none' 
                  }}
                >
                  Custom Range
                </button> */}
              </div>
            </div>

            {matrixFilter === 'Custom' && (
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                alignItems: 'center', 
                marginTop: '16px', 
                padding: '16px 24px', 
                background: '#f8fafc', 
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                width: 'fit-content'
              }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>Auditing Period:</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="date" className="sa-input" value={matrixDateRange.start} onChange={(e) => setMatrixDateRange({...matrixDateRange, start: e.target.value})} style={{ width: 'auto', border: '1px solid #cbd5e1' }} />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>TO</span>
                  <input type="date" className="sa-input" value={matrixDateRange.end} onChange={(e) => setMatrixDateRange({...matrixDateRange, end: e.target.value})} style={{ width: 'auto', border: '1px solid #cbd5e1' }} />
                </div>
              </div>
            )}

            <div className="sa-table-responsive">
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Branch Name</th>
                    <th>Income</th>
                    <th>Expense</th>
                    <th>Net Balance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {['Uptown Sanctuary', 'Coastal Healing Center', 'Green Valley Branch', 'Downtown Sanctuary'].map((branch, idx) => {
                    const stats = getFilteredTotals(branch);
                    return (
                      <tr key={idx}>
                        <td>
                          <div className="sa-table__branch-info" style={{ fontWeight: 600 }}>
                            <IonIcon icon={businessOutline} /> {branch}
                          </div>
                        </td>
                        <td><span className="sa-badge sa-badge--present">₹{stats.income.toLocaleString()}</span></td>
                        <td><span className="sa-badge sa-badge--absent">₹{stats.expense.toLocaleString()}</span></td>
                        <td>
                          <span style={{ fontWeight: 700, color: stats.balance >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            ₹{stats.balance.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <button 
                            className="sa-btn sa-btn--sm sa-btn--primary"
                            onClick={() => alert(`Generating ${matrixFilter === 'Overall' ? 'Full Historical' : matrixFilter === '7Days' ? 'Last 7 Days' : 'Last 1 Month'} Finance Report for ${branch}...`)}
                          >
                            <IonIcon icon={downloadOutline} /> Report
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* <div className="sa-grid-2">
            <div className="sa-section">
              <div className="sa-section__header">
                <div>
                  <h2 className="sa-section__title">Monthly Income Flow</h2>
                  <p className="sa-section__subtitle">Income vs Expenses over the last 30 days</p>
                </div>
              </div>
              <div className="sa-chart-placeholder" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className="sa-chart-bar" style={{ height: '120px', width: '30px' }}></div>
                  <span style={{ fontSize: '10px' }}>Income</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className="sa-chart-bar sa-chart-bar--secondary" style={{ height: '160px', width: '30px' }}></div>
                  <span style={{ fontSize: '10px' }}>Expense</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div className="sa-chart-bar" style={{ height: '90px', width: '30px' }}></div>
                  <span style={{ fontSize: '10px' }}>Profit</span>
                </div>
              </div>
            </div>

            <div className="sa-quick-actions">
              <h2 className="sa-quick-actions__title">Expense Categories</h2>
              <div className="sa-quick-action">
                <div className="sa-quick-action__label">Staff Salaries</div>
                <div className="sa-quick-action__icon">₹15k</div>
              </div>
              <div className="sa-quick-action">
                <div className="sa-quick-action__label">Branch Rent</div>
                <div className="sa-quick-action__icon">₹5k</div>
              </div>
              <div className="sa-quick-action">
                <div className="sa-quick-action__label">Medical Supplies</div>
                <div className="sa-quick-action__icon">₹3.2k</div>
              </div>
              <div className="sa-quick-action">
                <div className="sa-quick-action__label">Others</div>
                <div className="sa-quick-action__icon">₹1.2k</div>
              </div>
            </div>
          </div> */}

          <div className="sa-section-header" style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '32px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1.5', minWidth: '240px' }}>
              <h2 className="sa-section__title" style={{ margin: 0 }}>Daily Financial Overview</h2>
              <p className="sa-section__subtitle">Detailed audit trail of all transactions</p>
            </div>
            
            <div className="sa-filter-row sa-revenue-filters" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
              <div className="sa-search">
                <IonIcon icon={searchOutline} />
                <input 
                  placeholder="Search by patient..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="sa-filter-selects" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', width: '100%' }}>
                <div className="sa-input-group">
                  <select className="sa-input" style={{ width: '100%' }} value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
                    <option value="All">All Branches</option>
                    <option value="Uptown Sanctuary">Uptown Sanctuary</option>
                    <option value="Coastal Healing Center">Coastal Healing Center</option>
                    <option value="Green Valley Branch">Green Valley Branch</option>
                    <option value="Downtown Sanctuary">Downtown Sanctuary</option>
                  </select>
                </div>

                <div className="sa-input-group">
                  <select className="sa-input" style={{ width: '100%' }} value={filterMode} onChange={(e) => setFilterMode(e.target.value)}>
                    <option value="All">All Payment Modes</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Credit/Debit Card</option>
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank Transfer</option>
                  </select>
                </div>
              </div>

              <div className="sa-date-range" style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '8px', width: '100%' }}>
                <input 
                  type="date" 
                  className="sa-input sa-date-input" 
                  placeholder="dd-mm-yyyy"
                  value={dateRange.start} 
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})} 
                  style={{ width: '100%' }} 
                />
                <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 700 }}>to</span>
                <input 
                  type="date" 
                  className="sa-input sa-date-input" 
                  placeholder="dd-mm-yyyy"
                  value={dateRange.end} 
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})} 
                  style={{ width: '100%' }} 
                />
              </div>

              <button 
                className="sa-btn sa-btn--outline"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setSearchQuery('');
                  setFilterBranch('All');
                  setFilterMode('All');
                  setDateRange({ start: '', end: '' });
                }}
              >
                <IonIcon icon={filterOutline} /> Clear All Filters
              </button>
            </div>
          </div>

          <div className="sa-section" style={{ padding: 0 }}>
            <div className="sa-table-responsive">
              <table className="sa-table">
              <thead>
                <tr>
                  <th>Patient/Entity Name</th>
                  <th>Branch</th>
                  <th>Transaction Type</th>
                  <th>Amount</th>
                  <th>Payment Method</th>
                  <th>Date & Time</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{t.patient}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Clinical Service</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <IonIcon icon={businessOutline} style={{ color: '#64748b' }} />
                          {t.branch}
                        </div>
                      </td>
                      <td>
                        <span className={`sa-badge sa-badge--${t.status === 'completed' ? 'present' : 'absent'}`}>
                          {t.status === 'completed' ? 'INCOME' : 'EXPENSE'}
                        </span>
                      </td>
                      <td><div style={{ fontWeight: 700 }}>₹{t.amount.toLocaleString()}</div></td>
                      <td>{t.method}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{new Date(t.date).toLocaleDateString()}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{t.time}</div>
                      </td>
                      <td>
                        <span className={`sa-badge sa-badge--${t.status === 'completed' || t.status === 'paid' ? 'active' : 'pending'}`}>
                          {t.status?.toUpperCase() || 'COMPLETED'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '0' }}>
                      <div className="sa-empty-state" style={{ border: 'none', background: 'transparent', margin: '0' }}>
                        <div className="sa-empty-state__icon">
                          <IonIcon icon={cashOutline} />
                        </div>
                        <h3 className="sa-empty-state__title">No transactions found</h3>
                        <p className="sa-empty-state__text">
                          {searchQuery 
                            ? `No transactions matching "${searchQuery}" were found.` 
                            : `There are currently no transactions matching the selected filters.`}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </IonContent>
    </IonPage>
  );
};

export default RevenuePage;
