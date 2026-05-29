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
  downloadOutline,
  calendarOutline,
  trendingUpOutline,
  trendingDownOutline,
  addCircleOutline,
  removeCircleOutline,
  cardOutline,
  walletOutline,
  swapHorizontalOutline,
  documentTextOutline,
  peopleOutline,
  businessOutline,
  receiptOutline,
  arrowUpOutline,
  arrowDownOutline,
  searchOutline,
  filterOutline,
  trashOutline,
  pencilOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  pieChartOutline,
  printOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../../store/auth.store';
import './branch-admin.css';

interface Transaction {
  id: number;
  timestamp: string;
  category: string;
  type: 'income' | 'expense';
  amount: number;
  mode: string;
  recordedBy: string;
  description?: string;
  dateStr: string; // YYYY-MM-DD
}

const FinancePage: React.FC = () => {
  const { user } = useAuthStore();
  
  // Dynamic Branch State (Super Admin readiness)
  const [selectedBranch, setSelectedBranch] = useState('Mumbai Branch');

  // Modals & States
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<'income' | 'expense'>('income');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterMode, setFilterMode] = useState('All');
  const [filterMonth, setFilterMonth] = useState('All');
  const [filterQuarter, setFilterQuarter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Receipt Modal State
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptTx, setReceiptTx] = useState<Transaction | null>(null);

  // Core Mock Transactions Ledger
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      timestamp: '2026-05-28, 09:15 AM',
      category: 'Session Fee',
      type: 'income',
      amount: 1200,
      mode: 'UPI (GPay)',
      recordedBy: 'Admin - Anjali Rao',
      description: 'Elena Gilbert Pranic Psychotherapy',
      dateStr: '2026-05-28',
    },
    {
      id: 2,
      timestamp: '2026-05-27, 10:30 AM',
      category: 'Utilities',
      type: 'expense',
      amount: 4500,
      mode: 'Bank Trans',
      recordedBy: 'Admin - Anjali Rao',
      description: 'Monthly electricity bill',
      dateStr: '2026-05-27',
    },
    {
      id: 3,
      timestamp: '2026-05-26, 11:00 AM',
      category: 'Camp Fee',
      type: 'income',
      amount: 8500,
      mode: 'Cash',
      recordedBy: 'Admin - Anjali Rao',
      description: 'Summer healing camp registration',
      dateStr: '2026-05-26',
    },
    {
      id: 4,
      timestamp: '2026-05-25, 01:45 PM',
      category: 'Session Fee',
      type: 'income',
      amount: 1200,
      mode: 'UPI (PhonePe)',
      recordedBy: 'Admin - Anjali Rao',
      description: 'Stefan Salvatore Advanced Healing',
      dateStr: '2026-05-25',
    },
  ]);

  // Form input states
  const [newTx, setNewTx] = useState({
    category: 'Session Fee',
    amount: '',
    mode: 'UPI (GPay)',
    description: '',
  });

  const [editTxState, setEditTxState] = useState({
    category: 'Session Fee',
    amount: '',
    mode: 'UPI (GPay)',
    description: '',
  });

  // Super Admin readiness dynamic baseline aggregation
  const getBranchBaselines = (branch: string) => {
    switch (branch) {
      case 'Pune Branch':
        return { rev: 185000, exp: 28400, cash: 62000, online: 94600 };
      case 'Delhi Branch':
        return { rev: 210000, exp: 31200, cash: 71000, online: 107800 };
      case 'All Branches (Consolidated)':
        return { rev: 635000, exp: 93400, cash: 213000, online: 328400 };
      case 'Mumbai Branch':
      default:
        return { rev: 240000, exp: 33800, cash: 80000, online: 126000 };
    }
  };

  const baselines = getBranchBaselines(selectedBranch);

  // Compute live real-time totals dynamically (Dashboard Sync)
  const incomeFromTransactions = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenseFromTransactions = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRevenue = baselines.rev + incomeFromTransactions;
  const totalExpenses = baselines.exp + expenseFromTransactions;
  const netBalance = totalRevenue - totalExpenses;

  // Real-time audit balances
  const cashInHand = baselines.cash + transactions
    .filter((t) => t.type === 'income' && t.mode.toLowerCase() === 'cash')
    .reduce((sum, t) => sum + t.amount, 0) - transactions
    .filter((t) => t.type === 'expense' && t.mode.toLowerCase() === 'cash')
    .reduce((sum, t) => sum + t.amount, 0);

  const onlineBalance = baselines.online + transactions
    .filter((t) => t.type === 'income' && t.mode.toLowerCase() !== 'cash')
    .reduce((sum, t) => sum + t.amount, 0) - transactions
    .filter((t) => t.type === 'expense' && t.mode.toLowerCase() !== 'cash')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = cashInHand + onlineBalance;
  const cashPct = totalBalance > 0 ? Math.round((cashInHand / totalBalance) * 100) : 0;
  const upiPct = 100 - cashPct;

  // Profit Insights
  const profitMarginPct = totalRevenue > 0 ? Math.round((netBalance / totalRevenue) * 100) : 0;
  const expenseRatioPct = totalRevenue > 0 ? Math.round((totalExpenses / totalRevenue) * 100) : 0;

  // Add transaction popup
  const handleOpenAddModal = (type: 'income' | 'expense') => {
    setAddModalType(type);
    setNewTx({
      category: type === 'income' ? 'Session Fee' : 'Utilities',
      amount: '',
      mode: type === 'income' ? 'UPI (GPay)' : 'Bank Trans',
      description: '',
    });
    setShowAddModal(true);
  };

  // Transaction Validation & Submit (Rule 7 Validation)
  const handleRecordTx = () => {
    const parsedAmount = parseFloat(newTx.amount);
    
    // Validation Rules
    if (!newTx.amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Validation Error: Transaction amount must be a positive number greater than zero.');
      return;
    }
    if (!newTx.category.trim()) {
      alert('Validation Error: Please specify a transaction category.');
      return;
    }
    if (!newTx.mode.trim()) {
      alert('Validation Error: Please select a valid payment mode.');
      return;
    }

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = now.toISOString().split('T')[0];

    const addedTx: Transaction = {
      id: Date.now(),
      timestamp: `${formattedDate}, ${formattedTime}`,
      category: newTx.category,
      type: addModalType,
      amount: parsedAmount,
      mode: newTx.mode,
      recordedBy: user?.name || 'Admin - Anjali Rao',
      description: newTx.description.trim() || 'No remarks provided.',
      dateStr: formattedDate,
    };

    setTransactions([addedTx, ...transactions]);
    setShowAddModal(false);
    alert(`Success: ${addModalType.toUpperCase()} transaction recorded under category "${newTx.category}". All analytics updated!`);
  };

  // Soft Edit Dialog Trigger
  const handleOpenEditModal = (tx: Transaction) => {
    setSelectedTx(tx);
    setEditTxState({
      category: tx.category,
      amount: String(tx.amount),
      mode: tx.mode,
      description: tx.description || '',
    });
    setShowEditModal(true);
  };

  // Save changes with validation
  const handleEditTxSubmit = () => {
    if (!selectedTx) return;
    const parsedAmount = parseFloat(editTxState.amount);

    // Validation Rules
    if (!editTxState.amount.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Validation Error: Transaction amount must be a positive number greater than zero.');
      return;
    }
    if (!editTxState.category.trim()) {
      alert('Validation Error: Please specify a transaction category.');
      return;
    }
    if (!editTxState.mode.trim()) {
      alert('Validation Error: Please select a valid payment mode.');
      return;
    }

    setTransactions(
      transactions.map((t) => {
        if (t.id === selectedTx.id) {
          return {
            ...t,
            category: editTxState.category,
            amount: parsedAmount,
            mode: editTxState.mode,
            description: editTxState.description.trim(),
          };
        }
        return t;
      })
    );

    setShowEditModal(false);
    setSelectedTx(null);
    alert('Success: Transaction record updated successfully.');
  };

  // Delete/Archive Action
  const handleDeleteTx = (id: number) => {
    if (window.confirm('Are you sure you want to permanently delete this financial ledger record? This will alter active cash balances.')) {
      setTransactions(transactions.filter((t) => t.id !== id));
      alert('Success: Transaction record removed from registry.');
    }
  };

  // Print Receipt simulator
  const handlePrintReceipt = (tx: Transaction) => {
    setReceiptTx(tx);
    setShowReceiptModal(true);
  };

  // Mock Report Export Triggers
  const handleExportReport = (format: 'PDF' | 'Excel') => {
    alert(`Generating Consolidated financial report in ${format} format for selected filters...\nLedger, Revenue graphs, and Expense spreadsheets exported successfully.`);
  };

  // Comprehensive Search & Advanced Filtering calculations (Rule 9 & Rule 3)
  const filteredTransactions = transactions.filter((tx) => {
    // 1. Search filter
    const matchesSearch =
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.recordedBy.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Transaction type filter
    const matchesType = filterType === 'All' || tx.type === filterType.toLowerCase();

    // 3. Payment mode filter
    const matchesMode = filterMode === 'All' || tx.mode.toLowerCase().includes(filterMode.toLowerCase());

    // 4. Monthly filter
    let matchesMonth = true;
    if (filterMonth !== 'All') {
      const parts = tx.dateStr.split('-'); // [YYYY, MM, DD]
      const yearMonth = `${parts[0]}-${parts[1]}`;
      matchesMonth = yearMonth === filterMonth;
    }

    // 5. Quarterly filter
    let matchesQuarter = true;
    if (filterQuarter !== 'All') {
      const monthInt = parseInt(tx.dateStr.split('-')[1], 10);
      if (filterQuarter === 'Q1') {
        matchesQuarter = monthInt >= 1 && monthInt <= 3;
      } else if (filterQuarter === 'Q2') {
        matchesQuarter = monthInt >= 4 && monthInt <= 6;
      } else if (filterQuarter === 'Q3') {
        matchesQuarter = monthInt >= 7 && monthInt <= 9;
      } else if (filterQuarter === 'Q4') {
        matchesQuarter = monthInt >= 10 && monthInt <= 12;
      }
    }

    // 6. Custom Date Range Pickers (From-To)
    let matchesCustomRange = true;
    if (startDate) {
      matchesCustomRange = matchesCustomRange && tx.dateStr >= startDate;
    }
    if (endDate) {
      matchesCustomRange = matchesCustomRange && tx.dateStr <= endDate;
    }

    return matchesSearch && matchesType && matchesMode && matchesMonth && matchesQuarter && matchesCustomRange;
  });

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Finance &amp; Ledger Control</IonTitle>
          <IonButtons slot="end">
            <button className="sa-page__toolbar-avatar">BA</button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          
          {/* Header row & Branch selector */}
          <div className="bf-header">
            <div className="bf-breadcrumb">
              <span>Accounting &amp; Finance</span> / <span>Ledger Management</span>
            </div>
            
            <div className="bf-header-row" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 className="bf-title">Finance Management</h1>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                  Monitor treasury accounts, cash flows, and record branch collections
                </p>
              </div>

              {/* Dynamic Branch selector to demonstrate consolidation compatibility */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>SCOPED:</span>
                <select
                  className="sa-input"
                  style={{ minWidth: '220px', fontWeight: 600, border: '1px solid #cbd5e1' }}
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                >
                  <option value="Mumbai Branch">Mumbai Branch</option>
                  <option value="Pune Branch">Pune Branch</option>
                  <option value="Delhi Branch">Delhi Branch</option>
                  <option value="All Branches (Consolidated)">All Branches (Consolidated)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Stats Analytics Cards Panel with dynamic balances */}
          <div className="bf-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginTop: '20px' }}>
            
            {/* Revenue card */}
            <div className="bf-stat-card bf-stat-card--revenue">
              <div className="bf-stat-label">TOTAL REVENUE</div>
              <div className="bf-stat-value">₹{totalRevenue.toLocaleString()}</div>
              <div className="bf-stat-trend bf-stat-trend--up">
                <IonIcon icon={trendingUpOutline} /> +12.5% vs last month
              </div>
            </div>

            {/* Expenses card */}
            <div className="bf-stat-card bf-stat-card--expenses">
              <div className="bf-stat-label">TOTAL EXPENSES</div>
              <div className="bf-stat-value">₹{totalExpenses.toLocaleString()}</div>
              <div className="bf-stat-trend bf-stat-trend--down">
                <IonIcon icon={trendingDownOutline} /> -2.4% vs last week
              </div>
            </div>

            {/* NEW Net Balance card (Rule 1) */}
            <div className="bf-stat-card" style={{ background: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)', color: 'white' }}>
              <div className="bf-stat-label" style={{ color: 'rgba(255,255,255,0.8)' }}>NET TREASURY BALANCE</div>
              <div className="bf-stat-value" style={{ color: 'white' }}>₹{netBalance.toLocaleString()}</div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#e6fffa', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <IonIcon icon={checkmarkCircleOutline} /> Dynamic Balance Sheet Clear
              </div>
            </div>

            {/* Target card */}
            <div className="bf-stat-card bf-stat-card--target">
              <div className="bf-stat-label">MONTHLY TARGET</div>
              <div className="bf-stat-value">₹2,80,000</div>
              <div className="bf-stat-progress-bar">
                <div 
                  className="bf-stat-progress-fill" 
                  style={{ '--progress-pct': `${Math.min(100, Math.round((totalRevenue / 280000) * 100))}%` } as React.CSSProperties}
                />
              </div>
              <div className="bf-stat-subtext">
                {Math.round((totalRevenue / 280000) * 100)}% of goal reached
              </div>
            </div>

            {/* Insights card */}
            <div className="bf-stat-card" style={{ background: '#f8fafc', border: '1px solid #cbd5e1' }}>
              <div className="bf-stat-label" style={{ color: '#475569' }}>PROFIT RATIO INSIGHTS</div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>MARGIN</div>
                  <strong style={{ fontSize: '16px', color: '#0f766e' }}>{profitMarginPct}%</strong>
                </div>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>EXPENSE RATIO</div>
                  <strong style={{ fontSize: '16px', color: '#b91c1c' }}>{expenseRatioPct}%</strong>
                </div>
              </div>
              <div className="bf-stat-subtext" style={{ color: '#64748b', fontSize: '10px', marginTop: '6px' }}>
                Based on active operational margins
              </div>
            </div>

          </div>

          {/* Advanced Filtering Controls Block */}
          <div className="sa-section" style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: 'white' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 800, color: '#334155', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IonIcon icon={filterOutline} style={{ color: 'var(--ba-color-primary)' }} /> Advanced Query Search Filters
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {/* Category/Remarks Search */}
              <div className="sa-search" style={{ margin: 0, width: '100%' }}>
                <IonIcon icon={searchOutline} />
                <input
                  placeholder="Search by category, remarks, or creator..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Type Select */}
              <select
                className="sa-input"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Income">Income (Cash In)</option>
                <option value="Expense">Expense (Cash Out)</option>
              </select>

              {/* Mode Select */}
              <select
                className="sa-input"
                value={filterMode}
                onChange={(e) => setFilterMode(e.target.value)}
              >
                <option value="All">All Payment Modes</option>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI / Online</option>
                <option value="Bank">Bank Transfers</option>
              </select>

              {/* Monthly Filter */}
              <select
                className="sa-input"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              >
                <option value="All">All Months (2026)</option>
                <option value="2026-05">May 2026</option>
                <option value="2026-04">April 2026</option>
                <option value="2026-03">March 2026</option>
              </select>

              {/* Quarterly Filter */}
              <select
                className="sa-input"
                value={filterQuarter}
                onChange={(e) => setFilterQuarter(e.target.value)}
              >
                <option value="All">All Quarters (YTD)</option>
                <option value="Q1">Q1 (Jan - Mar)</option>
                <option value="Q2">Q2 (Apr - Jun)</option>
                <option value="Q3">Q3 (Jul - Sep)</option>
                <option value="Q4">Q4 (Oct - Dec)</option>
              </select>
            </div>

            {/* Custom From-To Picker Block */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginTop: '12px', borderTop: '1px dashed #e2e8f0', paddingTop: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>CUSTOM FROM:</span>
              <input
                type="date"
                className="sa-input"
                style={{ width: '150px', padding: '6px 10px', fontSize: '12px' }}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>TO:</span>
              <input
                type="date"
                className="sa-input"
                style={{ width: '150px', padding: '6px 10px', fontSize: '12px' }}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <button 
                className="sa-btn sa-btn--outline"
                style={{ padding: '6px 12px', fontSize: '12px' }}
                onClick={() => {
                  setSearchQuery('');
                  setFilterType('All');
                  setFilterMode('All');
                  setFilterMonth('All');
                  setFilterQuarter('All');
                  setStartDate('');
                  setEndDate('');
                }}
              >
                Reset Filters
              </button>

              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <button className="bf-btn-export" style={{ margin: 0 }} onClick={() => handleExportReport('PDF')}>
                  <IonIcon icon={downloadOutline} style={{ marginRight: '4px' }} /> Export PDF
                </button>
                <button className="bf-btn-export" style={{ margin: 0, background: '#16a34a', borderColor: '#16a34a', color: 'white' }} onClick={() => handleExportReport('Excel')}>
                  <IonIcon icon={downloadOutline} style={{ marginRight: '4px' }} /> Export Excel
                </button>
              </div>
            </div>
          </div>

          {/* Daily Transactions Card - Full Width */}
          <div className="bf-card" style={{ marginTop: '24px' }}>
            <div className="bf-card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 className="bf-card-title">Daily Transactions</h2>
                <p className="bf-card-subtitle">Detailed ledger of active operational collections</p>
              </div>
              <div className="bf-card-header-actions" style={{ display: 'flex', gap: '8px' }}>
                <button 
                  className="bf-btn-add-income"
                  onClick={() => handleOpenAddModal('income')}
                >
                  <IonIcon icon={addCircleOutline} /> Add Income
                </button>
                <button 
                  className="bf-btn-add-expense"
                  style={{ background: '#ef4444', borderColor: '#ef4444', color: 'white' }}
                  onClick={() => handleOpenAddModal('expense')}
                >
                  <IonIcon icon={removeCircleOutline} /> Add Expense
                </button>
              </div>
            </div>

            {/* Ledger Table */}
            <div className="sa-table-responsive" style={{ border: 'none', overflowX: 'auto' }}>
              <table className="bf-table" style={{ width: '100%', minWidth: '700px' }}>
                <thead>
                  <tr>
                    <th>TIMESTAMP</th>
                    <th>CATEGORY</th>
                    <th>REMARKS</th>
                    <th>TYPE</th>
                    <th>AMOUNT</th>
                    <th>MODE</th>
                    <th>RECORDED BY</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id}>
                        <td style={{ fontWeight: 600 }}>{tx.timestamp}</td>
                        <td style={{ fontWeight: 700, color: 'var(--ba-color-primary)' }}>{tx.category}</td>
                        <td style={{ fontSize: '12px', color: '#64748b' }}>{tx.description || '—'}</td>
                        <td>
                          <span className={tx.type === 'income' ? 'bf-badge-income' : 'bf-badge-expense'} style={{ textTransform: 'uppercase', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: 800 }}>
                            {tx.type}
                          </span>
                        </td>
                        <td>
                          <strong className={tx.type === 'income' ? 'bf-amount-income' : 'bf-amount-expense'} style={{ fontSize: '14px' }}>
                            ₹{tx.amount.toLocaleString()}
                          </strong>
                        </td>
                        <td style={{ fontWeight: 500 }}>{tx.mode}</td>
                        <td style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>{tx.recordedBy}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              className="pa-doc-action-btn"
                              title="Print Receipt"
                              onClick={() => handlePrintReceipt(tx)}
                            >
                              <IonIcon icon={printOutline} />
                            </button>
                            <button
                              className="pa-doc-action-btn"
                              title="Edit Entry"
                              onClick={() => handleOpenEditModal(tx)}
                            >
                              <IonIcon icon={pencilOutline} style={{ color: '#4f46e5' }} />
                            </button>
                            <button
                              className="pa-doc-action-btn pa-doc-action-btn--delete"
                              title="Delete Record"
                              onClick={() => handleDeleteTx(tx.id)}
                            >
                              <IonIcon icon={trashOutline} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    /* Beautiful Empty State Graphic (Rule 8) */
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '50px 0' }}>
                        <div className="sa-empty-state" style={{ border: 'none', background: 'transparent', margin: '0' }}>
                          <div className="sa-empty-state__icon" style={{ background: '#f1f5f9', color: '#94a3b8' }}>
                            <IonIcon icon={alertCircleOutline} />
                          </div>
                          <h3 className="sa-empty-state__title" style={{ color: '#475569', fontWeight: 700 }}>
                            No transactions matching filters
                          </h3>
                          <p className="sa-empty-state__text" style={{ color: '#64748b', fontSize: '13px' }}>
                            There are currently no recorded transactions found for the selected query, date range, or category filter.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lower Grid: Auditing Control, Heatmap, Ledger Operations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
            
            {/* Auditing Control Card */}
            <div className="bf-card" style={{ margin: 0 }}>
              <div className="bf-card-header" style={{ marginBottom: '16px' }}>
                <div>
                  <h2 className="bf-card-title">Auditing Control</h2>
                  <p className="bf-card-subtitle">Real-time payment mode cash balances</p>
                </div>
              </div>

              <div className="bf-audit-item">
                <div className="bf-audit-icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}>
                  <IonIcon icon={cardOutline} />
                </div>
                <div className="bf-audit-info">
                  <span className="bf-audit-label">CASH BALANCE</span>
                  <span className="bf-audit-val">₹{cashInHand.toLocaleString()}</span>
                </div>
                <IonIcon icon={swapHorizontalOutline} className="bf-audit-swap" />
              </div>

              <div className="bf-audit-item" style={{ marginTop: '12px' }}>
                <div className="bf-audit-icon-wrapper" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                  <IonIcon icon={walletOutline} />
                </div>
                <div className="bf-audit-info">
                  <span className="bf-audit-label">ONLINE BANK/UPI</span>
                  <span className="bf-audit-val">₹{onlineBalance.toLocaleString()}</span>
                </div>
                <IonIcon icon={swapHorizontalOutline} className="bf-audit-swap" />
              </div>

              {/* Splitting progress distribution */}
              <div className="bf-dist-section" style={{ marginTop: '20px' }}>
                <div className="bf-dist-header">
                  <span className="bf-dist-title">Split Ledger Share</span>
                  <span className="bf-dist-total">₹{totalBalance.toLocaleString()} Total</span>
                </div>
                <div className="bf-dist-bar">
                  <div 
                    className="bf-dist-bar-cash"
                    style={{ '--cash-pct': `${cashPct}%` } as React.CSSProperties}
                  >
                    CASH {cashPct}%
                  </div>
                  <div 
                    className="bf-dist-bar-upi"
                    style={{ '--upi-pct': `${upiPct}%` } as React.CSSProperties}
                  >
                    UPI {upiPct}%
                  </div>
                </div>
                <div className="bf-dist-legend">
                  <div className="bf-dist-legend-item">
                    <span className="bf-dist-dot bf-dist-dot--cash" /> Cash Balance
                  </div>
                  <div className="bf-dist-legend-item">
                    <span className="bf-dist-dot bf-dist-dot--upi" /> Online Deposits
                  </div>
                </div>
              </div>
            </div>

  
            {/* Financial Actions Grid / Ledger Operations */}
            <div className="bf-actions-card" style={{ margin: 0, padding: '20px' }}>
              <h3 className="bf-actions-title" style={{ margin: '0 0 14px 0', fontSize: '14px' }}>Ledger Operations</h3>
              <div className="bf-actions-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button className="bf-action-item" style={{ padding: '12px' }} onClick={() => alert('Simulator: Opening Raise Invoice portal...')}>
                  <IonIcon icon={documentTextOutline} className="bf-action-icon" />
                  <span>Raise Invoice</span>
                </button>
                <button className="bf-action-item" style={{ padding: '12px' }} onClick={() => alert('Simulator: Fetching outstanding patient dues ledger...')}>
                  <IonIcon icon={peopleOutline} className="bf-action-icon" />
                  <span>Dues List</span>
                </button>
                <button className="bf-action-item" style={{ padding: '12px' }} onClick={() => alert('Simulator: Opening stock supplies cost registry...')}>
                  <IonIcon icon={businessOutline} className="bf-action-icon" />
                  <span>Stock Cost</span>
                </button>
                <button className="bf-action-item" style={{ padding: '12px' }} onClick={() => alert('Simulator: Opening tax archives...')}>
                  <IonIcon icon={receiptOutline} className="bf-action-icon" />
                  <span>Tax Records</span>
                </button>
              </div>
            </div>

          </div>

         

        </div>
      </IonContent>

      {/* ── DIALOG: RECORD TRANSACTION ────────────────────────────── */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Record Branch Transaction</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowAddModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Transaction Type</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className={`sa-btn ${addModalType === 'income' ? 'sa-btn--primary' : 'sa-btn--outline'}`}
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setAddModalType('income')}
                >
                  <IonIcon icon={arrowUpOutline} style={{ marginRight: '4px' }} /> Income (Cash In)
                </button>
                <button
                  className={`sa-btn ${addModalType === 'expense' ? 'sa-btn--danger' : 'sa-btn--outline'}`}
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setAddModalType('expense')}
                >
                  <IonIcon icon={arrowDownOutline} style={{ marginRight: '4px' }} /> Expense (Cash Out)
                </button>
              </div>
            </div>

            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Category *</label>
              <select
                className="sa-input"
                value={newTx.category}
                onChange={(e) => setNewTx({ ...newTx, category: e.target.value })}
              >
                {addModalType === 'income' ? (
                  <>
                    <option value="Session Fee">Session Fee</option>
                    <option value="Camp Fee">Camp Fee</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Misc">Miscellaneous</option>
                  </>
                ) : (
                  <>
                    <option value="Utilities">Utilities</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Rent">Rent</option>
                    <option value="Misc">Miscellaneous</option>
                  </>
                )}
              </select>
            </div>

            <div className="sa-settings__form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Amount (₹) *</label>
                <input
                  type="number"
                  className="sa-input"
                  placeholder="0.00"
                  value={newTx.amount}
                  onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                />
              </div>

              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Payment Mode *</label>
                <select
                  className="sa-input"
                  value={newTx.mode}
                  onChange={(e) => setNewTx({ ...newTx, mode: e.target.value })}
                >
                  {addModalType === 'income' ? (
                    <>
                      <option value="UPI (GPay)">UPI (GPay)</option>
                      <option value="UPI (PhonePe)">UPI (PhonePe)</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                    </>
                  ) : (
                    <>
                      <option value="Bank Trans">Bank Trans</option>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Description / Remarks</label>
              <textarea
                className="sa-input"
                style={{ resize: 'none', height: '60px' }}
                placeholder="Details of the transaction..."
                value={newTx.description}
                onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
              />
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleRecordTx}>Record Entry</button>
          </div>
        </div>
      </IonModal>

      {/* ── DIALOG: EDIT TRANSACTION ──────────────────────────────── */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Edit Transaction Ledger</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowEditModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Category *</label>
              <select
                className="sa-input"
                value={editTxState.category}
                onChange={(e) => setEditTxState({ ...editTxState, category: e.target.value })}
              >
                {selectedTx?.type === 'income' ? (
                  <>
                    <option value="Session Fee">Session Fee</option>
                    <option value="Camp Fee">Camp Fee</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Misc">Miscellaneous</option>
                  </>
                ) : (
                  <>
                    <option value="Utilities">Utilities</option>
                    <option value="Supplies">Supplies</option>
                    <option value="Salaries">Salaries</option>
                    <option value="Rent">Rent</option>
                    <option value="Misc">Miscellaneous</option>
                  </>
                )}
              </select>
            </div>

            <div className="sa-settings__form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Amount (₹) *</label>
                <input
                  type="number"
                  className="sa-input"
                  value={editTxState.amount}
                  onChange={(e) => setEditTxState({ ...editTxState, amount: e.target.value })}
                />
              </div>

              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Payment Mode *</label>
                <select
                  className="sa-input"
                  value={editTxState.mode}
                  onChange={(e) => setEditTxState({ ...editTxState, mode: e.target.value })}
                >
                  {selectedTx?.type === 'income' ? (
                    <>
                      <option value="UPI (GPay)">UPI (GPay)</option>
                      <option value="UPI (PhonePe)">UPI (PhonePe)</option>
                      <option value="Cash">Cash</option>
                      <option value="Card">Card</option>
                    </>
                  ) : (
                    <>
                      <option value="Bank Trans">Bank Trans</option>
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Description / Remarks</label>
              <textarea
                className="sa-input"
                style={{ resize: 'none', height: '60px' }}
                value={editTxState.description}
                onChange={(e) => setEditTxState({ ...editTxState, description: e.target.value })}
              />
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleEditTxSubmit}>Save Changes</button>
          </div>
        </div>
      </IonModal>

      {/* ── DIALOG: PRINT RECEIPT INVOICE ──────────────────────────── */}
      <IonModal isOpen={showReceiptModal} onDidDismiss={() => setShowReceiptModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content" style={{ padding: '24px' }}>
          <div style={{ border: '2px dashed #cbd5e1', padding: '20px', borderRadius: '8px', background: '#faf5ff', fontFamily: 'monospace' }}>
            <div style={{ textAlign: 'center', borderBottom: '1px dashed #cbd5e1', paddingBottom: '12px', marginBottom: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--ba-color-primary)' }}>NPHMS TREASURY</h2>
              <span style={{ fontSize: '10px', color: '#64748b' }}>BRANCH COLLECTION RECEIPT</span>
            </div>
            
            {receiptTx && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>RECEIPT ID:</span>
                  <strong>#TX-{receiptTx.id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>TIMESTAMP:</span>
                  <strong>{receiptTx.timestamp}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>CATEGORY:</span>
                  <strong style={{ color: 'var(--ba-color-primary)' }}>{receiptTx.category}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>TX TYPE:</span>
                  <strong style={{ color: receiptTx.type === 'income' ? '#0f766e' : '#b91c1c' }}>{receiptTx.type.toUpperCase()}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>PAYMENT MODE:</span>
                  <strong>{receiptTx.mode}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>RECORDED BY:</span>
                  <strong>{receiptTx.recordedBy}</strong>
                </div>
                <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '8px', marginTop: '4px' }}>
                  <span>REMARKS / DETAILS:</span>
                  <div style={{ color: '#475569', fontStyle: 'italic', marginTop: '2px' }}>
                    {receiptTx.description || 'No remarks logged.'}
                  </div>
                </div>
                <div style={{ borderTop: '2px dashed #cbd5e1', paddingTop: '12px', marginTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                  <strong>TOTAL AMOUNT:</strong>
                  <strong style={{ color: 'var(--ba-color-primary)' }}>₹{receiptTx.amount.toLocaleString()}.00</strong>
                </div>
              </div>
            )}

            <div style={{ textAlign: 'center', borderTop: '1px dashed #cbd5e1', paddingTop: '12px', marginTop: '12px', fontSize: '10px', color: '#64748b' }}>
              Thank you for trusting NPHMS Wellness Services.<br/>
              Simulated security checksum node verified.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            <button className="sa-btn sa-btn--outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowReceiptModal(false)}>Close</button>
            <button className="sa-btn sa-btn--primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { alert('Receipt print command simulated. Sending to thermal printer...'); setShowReceiptModal(false); }}>
              Print thermal receipt
            </button>
          </div>
        </div>
      </IonModal>

    </IonPage>
  );
};

export default FinancePage;
