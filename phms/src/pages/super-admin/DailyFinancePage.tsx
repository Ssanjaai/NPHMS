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
  IonModal,
} from '@ionic/react';
import {
  searchOutline,
  cashOutline,
  walletOutline,
  trendingUpOutline,
  calendarOutline,
  filterOutline,
  downloadOutline,
  businessOutline,
  addOutline,
  removeOutline,
  arrowUpOutline,
  arrowDownOutline,
  cardOutline,
  listOutline,
} from 'ionicons/icons';
import './super-admin.css';

const DailyFinancePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Advanced Log Filters
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [filterMethod, setFilterMethod] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const today = new Date().toISOString().split('T')[0];
  
  // Refined Financial Records
  const [records, setRecords] = useState([
    { id: 1, patient: 'Elena Gilbert', type: 'income', category: 'Healing', branch: 'Uptown Sanctuary', amount: 1500, method: 'Card', date: today, time: '10:30 AM', status: 'completed' },
    { id: 2, patient: 'Medical Supplies Corp', type: 'expense', category: 'Equipment', branch: 'Uptown Sanctuary', amount: 3200, method: 'UPI', date: today, time: '11:15 AM', status: 'paid' },
    { id: 3, patient: 'Stefan Salvatore', type: 'income', category: 'Consultation', branch: 'Coastal Healing Center', amount: 2000, method: 'UPI', date: today, time: '12:00 PM', status: 'completed' },
    { id: 4, patient: 'Green Valley Staff', type: 'expense', category: 'Misc', branch: 'Green Valley Branch', amount: 450, method: 'Cash', date: today, time: '01:30 PM', status: 'paid' },
    { id: 5, patient: 'Caroline Forbes', type: 'income', category: 'Healing', branch: 'Uptown Sanctuary', amount: 1800, method: 'Cash', date: today, time: '02:45 PM', status: 'completed' },
    { id: 6, patient: 'Downtown Stationery', type: 'expense', category: 'Supplies', branch: 'Downtown Sanctuary', amount: 850, method: 'UPI', date: today, time: '03:15 PM', status: 'paid' },
    { id: 7, patient: 'Organization Salaries', type: 'expense', category: 'Salaries', branch: 'All Branches', amount: 12000, method: 'Bank Transfer', date: today, time: '09:00 AM', status: 'paid' },
    { id: 8, patient: 'Alaric Saltzman', type: 'income', category: 'Recovery', branch: 'Green Valley Branch', amount: 2500, method: 'UPI', date: today, time: '10:00 AM', status: 'completed' },
    { id: 9, patient: 'Coastal Water Board', type: 'expense', category: 'Utilities', branch: 'Coastal Healing Center', amount: 1100, method: 'Cash', date: today, time: '04:00 PM', status: 'pending' },
    { id: 10, patient: 'Bonnie Bennett', type: 'income', category: 'Healing', branch: 'Green Valley Branch', amount: 1200, method: 'UPI', date: today, time: '11:30 AM', status: 'completed' },
  ]);

  const [newEntry, setNewEntry] = useState({
    patient: '',
    type: 'income',
    category: 'Healing',
    branch: 'Uptown Sanctuary',
    amount: 0,
    method: 'Cash',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });

  const handleAddEntry = () => {
    if (!newEntry.patient || newEntry.amount <= 0) return;
    const record = {
      ...newEntry,
      id: Date.now(),
      date: selectedDate,
      status: newEntry.type === 'income' ? 'completed' : 'paid'
    };

    setRecords([record, ...records]);
    setNewEntry({ patient: '', type: 'income', category: 'Healing', branch: 'Uptown Sanctuary', amount: 0, method: 'Cash', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
    setShowAddModal(false);
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.patient.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         r.branch.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date Logic: If range is set, use it. Otherwise use selectedDate (Daily mode)
    let matchesDate = r.date === selectedDate;
    if (dateRange.start && dateRange.end) {
      matchesDate = r.date >= dateRange.start && r.date <= dateRange.end;
    } else if (dateRange.start) {
      matchesDate = r.date >= dateRange.start;
    } else if (dateRange.end) {
      matchesDate = r.date <= dateRange.end;
    }

    const matchesBranch = filterBranch === 'All' || r.branch === filterBranch;
    const matchesType = filterType === 'All' || r.type === filterType;
    const matchesMethod = filterMethod === 'All' || r.method === filterMethod;
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;

    return matchesSearch && matchesDate && matchesBranch && matchesType && matchesMethod && matchesStatus;
  });

  const totalIncome = filteredRecords
    .filter(r => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = filteredRecords
    .filter(r => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const netBalance = totalIncome - totalExpense;
  const totalTransactions = filteredRecords.length;
  const activeBranchCount = new Set(filteredRecords.map(r => r.branch)).size;

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Daily Financial Overview</IonTitle>
          <IonButtons slot="end">
            <button className="sa-page__toolbar-avatar">SA</button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          <div className="sa-page__header">
            <div className="sa-page__header-row">
              <div>
                <h1 className="sa-page__title">Daily Financial Overview</h1>
                <p className="sa-page__subtitle">Track and audit daily organization-wide financial movements</p>
              </div>
            </div>
          </div>

          <div className="sa-stats">
            <div className="sa-stat-card" style={{ '--color-primary': '#10b981' } as any}>
              <div>
                <div className="sa-stat-card__label">Total Daily Income</div>
                <div className="sa-stat-card__value">₹{totalIncome.toLocaleString()}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} /> New cash inflow
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--success">
                <IonIcon icon={arrowUpOutline} />
              </div>
            </div>

            <div className="sa-stat-card" style={{ '--color-primary': '#ef4444' } as any}>
              <div>
                <div className="sa-stat-card__label">Total Daily Expenses</div>
                <div className="sa-stat-card__value">₹{totalExpense.toLocaleString()}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#ef4444', transform: 'rotate(90deg)' }} /> Cash outflow
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--danger">
                <IonIcon icon={arrowDownOutline} />
              </div>
            </div>

            <div className="sa-stat-card" style={{ '--color-primary': '#10b981' } as any}>
              <div>
                <div className="sa-stat-card__label">Daily Net Balance</div>
                <div className="sa-stat-card__value">₹{netBalance.toLocaleString()}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} /> Net daily standing
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--success">
                <IonIcon icon={walletOutline} />
              </div>
            </div>

            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Total Transactions</div>
                <div className="sa-stat-card__value">{totalTransactions}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: 'var(--color-primary)' }} /> Volume processed
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--primary">
                <IonIcon icon={cardOutline} />
              </div>
            </div>

            {/* <div className="sa-stat-card" style={{ '--color-primary': '#7c3aed' } as any}>
              <div>
                <div className="sa-stat-card__label">Active Branch Count</div>
                <div className="sa-stat-card__value">{activeBranchCount}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#7c3aed' }} /> reporting today
                </div>
              </div>
              <div className="sa-stat-card__icon" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
                <IonIcon icon={businessOutline} />
              </div>
            </div> */}
          </div>

          <div className="sa-section" style={{ marginTop: '32px' }}>
            <div className="sa-section-header">
              <div>
                <h2 className="sa-section__title">Branch-wise Daily Finance Summary</h2>
                <p className="sa-section__subtitle">Performance breakdown for {new Date(selectedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
            
            <div className="sa-table-responsive">
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Branch Name</th>
                    <th>Daily Income</th>
                    <th>Daily Expense</th>
                    <th>Net Balance</th>
                    <th>Total Transactions</th>
                  </tr>
                </thead>
                <tbody>
                  {['Uptown Sanctuary', 'Coastal Healing Center', 'Green Valley Branch', 'Downtown Sanctuary'].map((branch, idx) => {
                    const branchRecords = filteredRecords.filter(r => r.branch === branch || (branch === 'All Branches' && r.branch === 'All Branches'));
                    const bIncome = branchRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
                    const bExpense = branchRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
                    const bBalance = bIncome - bExpense;
                    const bTransactions = branchRecords.length;

                    if (bTransactions === 0) return null;

                    return (
                      <tr key={idx}>
                        <td>
                          <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IonIcon icon={businessOutline} style={{ color: 'var(--color-primary)' }} /> {branch}
                          </div>
                        </td>
                        <td><span className="sa-badge sa-badge--present">₹{bIncome.toLocaleString()}</span></td>
                        <td><span className="sa-badge sa-badge--absent">₹{bExpense.toLocaleString()}</span></td>
                        <td>
                          <span style={{ fontWeight: 700, color: bBalance >= 0 ? 'var(--color-success)' : 'var(--color-danger)' }}>
                            ₹{bBalance.toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <div className="sa-badge sa-badge--active">
                            {bTransactions} Entries
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="sa-section-header" style={{ display: 'flex', gap: '16px', marginTop: '40px' }}>
            <div>
              <h2 className="sa-section__title" style={{ margin: 0 }}>Detailed Financial Log</h2>
              <p className="sa-section__subtitle">Complete audit trail for the selected date</p>
            </div>
          </div>
          
          <div className="sa-section-header" style={{ marginTop: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div className="sa-search" style={{ margin: 0, flex: '1.5' }}>
              <IonIcon icon={searchOutline} />
              <input 
                placeholder="Search records by name or branch..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="sa-filter-group" style={{ display: 'flex', gap: '8px', flex: '3', flexWrap: 'wrap' }}>
              <select className="sa-input" style={{ flex: '1', minWidth: '150px' }} value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
                <option value="All">All Branches</option>
                <option value="Uptown Sanctuary">Uptown Sanctuary</option>
                <option value="Coastal Healing Center">Coastal Healing Center</option>
                <option value="Green Valley Branch">Green Valley Branch</option>
                <option value="Downtown Sanctuary">Downtown Sanctuary</option>
              </select>

              <select className="sa-input" style={{ flex: '1', minWidth: '150px' }} value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="All">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>

              <select className="sa-input" style={{ flex: '1', minWidth: '150px' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option value="completed">Completed</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
              </select>

              <button 
                className="sa-btn sa-btn--outline" 
                style={{ flex: '1', minWidth: '100px', justifyContent: 'center' }}
                onClick={() => {
                  setSearchQuery('');
                  setFilterBranch('All');
                  setFilterType('All');
                  setFilterMethod('All');
                  setFilterStatus('All');
                  setDateRange({ start: '', end: '' });
                }}
              >
                Clear
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
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <tr key={record.id}>
                      <td>
                        <div style={{ fontWeight: 600 }}>{record.patient}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{record.category}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <IonIcon icon={businessOutline} style={{ color: '#64748b' }} />
                          {record.branch}
                        </div>
                      </td>
                      <td>
                        <span className={`sa-badge sa-badge--${record.type === 'income' ? 'present' : 'absent'}`}>
                          {record.type.toUpperCase()}
                        </span>
                      </td>
                      <td><div style={{ fontWeight: 700 }}>₹{record.amount.toLocaleString()}</div></td>
                      <td>{record.method}</td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{new Date(record.date).toLocaleDateString()}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{record.time}</div>
                      </td>
                      <td>
                        <span className={`sa-badge sa-badge--${record.status === 'completed' || record.status === 'paid' ? 'active' : 'pending'}`}>
                          {record.status?.toUpperCase() || 'COMPLETED'}
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
                        <h3 className="sa-empty-state__title">No financial records found</h3>
                        <p className="sa-empty-state__text">
                          {searchQuery 
                            ? `No records matching "${searchQuery}" were found.` 
                            : `There are currently no financial records matching the selected filters.`}
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

      {/* Add Entry Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Add Financial Entry</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowAddModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Entry Type</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className={`sa-btn ${newEntry.type === 'income' ? 'sa-btn--primary' : 'sa-btn--outline'}`} 
                  style={{ flex: 1 }}
                  onClick={() => setNewEntry({ ...newEntry, type: 'income' })}
                >
                  Income
                </button>
                <button 
                  className={`sa-btn ${newEntry.type === 'expense' ? 'sa-btn--danger' : 'sa-btn--outline'}`} 
                  style={{ flex: 1 }}
                  onClick={() => setNewEntry({ ...newEntry, type: 'expense' })}
                >
                  Expense
                </button>
              </div>
            </div>
            <div className="sa-form-group">
              <label className="sa-label">Patient/Entity Name</label>
              <input 
                className="sa-input" 
                placeholder="Enter name"
                value={newEntry.patient}
                onChange={(e) => setNewEntry({...newEntry, patient: e.target.value})}
              />
            </div>
            <div className="sa-settings__form-row">
              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Amount (₹)</label>
                <input 
                  type="number"
                  className="sa-settings__input" 
                  placeholder="0.00"
                  value={newEntry.amount}
                  onChange={(e) => setNewEntry({ ...newEntry, amount: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Category</label>
                <select 
                  className="sa-settings__input"
                  value={newEntry.category}
                  onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}
                >
                  <option>Healing</option>
                  <option>Consultation</option>
                  <option>Supplies</option>
                  <option>Utilities</option>
                  <option>Salaries</option>
                  <option>Misc</option>
                </select>
              </div>
            </div>
            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Branch</label>
              <select 
                className="sa-settings__input"
                value={newEntry.branch}
                onChange={(e) => setNewEntry({ ...newEntry, branch: e.target.value })}
              >
                <option>Uptown Sanctuary</option>
                <option>Coastal Healing Center</option>
                <option>Green Valley Branch</option>
                <option>Downtown Sanctuary</option>
              </select>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleAddEntry}>Save Entry</button>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
};


export default DailyFinancePage;
