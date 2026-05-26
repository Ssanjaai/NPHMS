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
  dateStr: string; // for filtering
}

const FinancePage: React.FC = () => {
  const { user } = useAuthStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalType, setAddModalType] = useState<'income' | 'expense'>('income');
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  // Initial mock data that EXACTLY matches the image screenshot!
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      timestamp: 'Oct 24, 09:15 AM',
      category: 'Session Fee',
      type: 'income',
      amount: 1200,
      mode: 'UPI (GPay)',
      dateStr: '2026-10-24',
    },
    {
      id: 2,
      timestamp: 'Oct 24, 10:30 AM',
      category: 'Utilities',
      type: 'expense',
      amount: 4500,
      mode: 'Bank Trans',
      dateStr: '2026-10-24',
    },
    {
      id: 3,
      timestamp: 'Oct 24, 11:00 AM',
      category: 'Camp Fee',
      type: 'income',
      amount: 8500,
      mode: 'Cash',
      dateStr: '2026-10-24',
    },
    {
      id: 4,
      timestamp: 'Oct 24, 01:45 PM',
      category: 'Session Fee',
      type: 'income',
      amount: 1200,
      mode: 'UPI (PhonePe)',
      dateStr: '2026-10-24',
    },
  ]);

  // Modals / Inputs
  const [newTx, setNewTx] = useState({
    category: 'Session Fee',
    amount: '',
    mode: 'UPI (GPay)',
    description: '',
  });

  // Totals & Distribution
  const cashInHand = 8000;
  const onlineBalance = 5000;
  const totalBalance = cashInHand + onlineBalance;
  
  // Percentages for payment mode distribution
  const cashPct = Math.round((cashInHand / totalBalance) * 100);
  const upiPct = 100 - cashPct;

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

  const handleRecordTx = () => {
    if (!newTx.amount || parseFloat(newTx.amount) <= 0) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const addedTx: Transaction = {
      id: Date.now(),
      timestamp: `${formattedDate}, ${formattedTime}`,
      category: newTx.category,
      type: addModalType,
      amount: parseFloat(newTx.amount),
      mode: newTx.mode,
      dateStr: now.toISOString().split('T')[0],
    };

    setTransactions([addedTx, ...transactions]);
    setShowAddModal(false);
  };

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Finance Management</IonTitle>
          <IonButtons slot="end">
            <button className="sa-page__toolbar-avatar">BA</button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          {/* Header & Breadcrumb Section */}
          <div className="bf-header">
            <div className="bf-breadcrumb">Accounting & Finance / Dashboard</div>
            <div className="bf-header-row">
              <h1 className="bf-title">Finance Management</h1>
              <div className="bf-header-actions">
                <button className="bf-btn-export">
                  <IonIcon icon={downloadOutline} /> Export PDF
                </button>
                <button className="bf-btn-date">
                  <IonIcon icon={calendarOutline} /> Oct 2023
                </button>
              </div>
            </div>
          </div>

          {/* 5 Stats Cards Grid */}
          <div className="bf-stats-grid">
            {/* Card 1 */}
            <div className="bf-stat-card bf-stat-card--revenue">
              <div className="bf-stat-label">TOTAL REVENUE</div>
              <div className="bf-stat-value">₹2,40,000</div>
              <div className="bf-stat-trend bf-stat-trend--up">
                <IonIcon icon={trendingUpOutline} /> +12.5% from last month
              </div>
            </div>

            {/* Card 2 */}
            <div className="bf-stat-card bf-stat-card--daily">
              <div className="bf-stat-label">DAILY REVENUE</div>
              <div className="bf-stat-value">₹15,000</div>
              <div className="bf-stat-subtext">Today, Oct 24</div>
            </div>

            {/* Card 3 */}
            <div className="bf-stat-card bf-stat-card--weekly">
              <div className="bf-stat-label">WEEKLY REVENUE</div>
              <div className="bf-stat-value">₹68,500</div>
              <div className="bf-stat-subtext">Week 42 Avg</div>
            </div>

            {/* Card 4 */}
            <div className="bf-stat-card bf-stat-card--target">
              <div className="bf-stat-label">MONTHLY TARGET</div>
              <div className="bf-stat-value">₹2,40,000</div>
              <div className="bf-stat-progress-bar">
                <div 
                  className="bf-stat-progress-fill" 
                  style={{ '--progress-pct': '85%' } as React.CSSProperties}
                />
              </div>
              <div className="bf-stat-subtext">85% of ₹2,80,000 goal</div>
            </div>

            {/* Card 5 */}
            <div className="bf-stat-card bf-stat-card--expenses">
              <div className="bf-stat-label">TOTAL EXPENSES</div>
              <div className="bf-stat-value">₹33,800</div>
              <div className="bf-stat-trend bf-stat-trend--down">
                <IonIcon icon={trendingDownOutline} /> -2.4% vs last week
              </div>
            </div>
          </div>

          {/* Two-Column Grid */}
          <div className="bf-main-grid">
            {/* Left Column: Daily Transactions */}
            <div className="bf-left-col">
              <div className="bf-card">
                <div className="bf-card-header">
                  <div>
                    <h2 className="bf-card-title">Daily Transactions</h2>
                    <p className="bf-card-subtitle">Detailed ledger of recent activities</p>
                  </div>
                  <div className="bf-card-header-actions">
                    <button 
                      className="bf-btn-add-income"
                      onClick={() => handleOpenAddModal('income')}
                    >
                      <IonIcon icon={addCircleOutline} /> Add Income
                    </button>
                    <button 
                      className="bf-btn-add-expense"
                      onClick={() => handleOpenAddModal('expense')}
                    >
                      <IonIcon icon={removeCircleOutline} /> Add Expense
                    </button>
                  </div>
                </div>

                <div className="sa-table-responsive" style={{ border: 'none' }}>
                  <table className="bf-table">
                    <thead>
                      <tr>
                        <th>TIMESTAMP</th>
                        <th>CATEGORY</th>
                        <th>TYPE</th>
                        <th>AMOUNT</th>
                        <th>MODE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id}>
                          <td>{tx.timestamp}</td>
                          <td>{tx.category}</td>
                          <td>
                            <span className={tx.type === 'income' ? 'bf-badge-income' : 'bf-badge-expense'}>
                              {tx.type}
                            </span>
                          </td>
                          <td>
                            <span className={tx.type === 'income' ? 'bf-amount-income' : 'bf-amount-expense'}>
                              ₹{tx.amount.toLocaleString()}
                            </span>
                          </td>
                          <td>{tx.mode}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bf-table-footer">
                  <button className="bf-link-view-all" onClick={() => setShowAllTransactions(!showAllTransactions)}>
                    {showAllTransactions ? 'Show Recent Transactions' : 'View All Transactions'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Auditing Control & Actions */}
            <div className="bf-right-col">
              {/* Card 1: Auditing Control */}
              <div className="bf-card">
                <div className="bf-card-header" style={{ marginBottom: '16px' }}>
                  <div>
                    <h2 className="bf-card-title">Auditing Control</h2>
                    <p className="bf-card-subtitle">Real-time payment mode balance</p>
                  </div>
                </div>

                {/* Cash in hand item */}
                <div className="bf-audit-item">
                  <div className="bf-audit-icon-wrapper" style={{ background: '#ecfdf5', color: '#10b981' }}>
                    <IonIcon icon={cardOutline} />
                  </div>
                  <div className="bf-audit-info">
                    <span className="bf-audit-label">CASH IN HAND</span>
                    <span className="bf-audit-val">₹{cashInHand.toLocaleString()}</span>
                  </div>
                  <IonIcon icon={swapHorizontalOutline} className="bf-audit-swap" />
                </div>

                {/* Online Balance item */}
                <div className="bf-audit-item">
                  <div className="bf-audit-icon-wrapper" style={{ background: '#eff6ff', color: '#3b82f6' }}>
                    <IonIcon icon={walletOutline} />
                  </div>
                  <div className="bf-audit-info">
                    <span className="bf-audit-label">ONLINE (UPI/BANK)</span>
                    <span className="bf-audit-val">₹{onlineBalance.toLocaleString()}</span>
                  </div>
                  <IonIcon icon={swapHorizontalOutline} className="bf-audit-swap" />
                </div>

                {/* Split progress distribution */}
                <div className="bf-dist-section">
                  <div className="bf-dist-header">
                    <span className="bf-dist-title">Payment Mode Distribution</span>
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
                      <span className="bf-dist-dot bf-dist-dot--cash" /> Cash
                    </div>
                    <div className="bf-dist-legend-item">
                      <span className="bf-dist-dot bf-dist-dot--upi" /> UPI / Online
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Financial Actions Grid */}
              <div className="bf-actions-card">
                <h3 className="bf-actions-title">Financial Actions</h3>
                <div className="bf-actions-grid">
                  <button className="bf-action-item">
                    <IonIcon icon={documentTextOutline} className="bf-action-icon" />
                    <span>Raise Invoice</span>
                  </button>
                  <button className="bf-action-item">
                    <IonIcon icon={peopleOutline} className="bf-action-icon" />
                    <span>Dues List</span>
                  </button>
                  <button className="bf-action-item">
                    <IonIcon icon={businessOutline} className="bf-action-icon" />
                    <span>Stock Cost</span>
                  </button>
                  <button className="bf-action-item">
                    <IonIcon icon={receiptOutline} className="bf-action-icon" />
                    <span>Tax Records</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Full-Width Chart Card: Revenue vs Expense Trend */}
          <div className="bf-card bf-chart-section">
            <div className="bf-chart-header">
              <div>
                <h2 className="bf-card-title">Revenue vs Expense Trend</h2>
                <p className="bf-card-subtitle">Yearly financial comparison analysis</p>
              </div>
              <div className="bf-chart-legend">
                <div className="bf-chart-legend-item">
                  <span className="bf-chart-dot bf-chart-dot--revenue" /> Revenue
                </div>
                <div className="bf-chart-legend-item">
                  <span className="bf-chart-dot bf-chart-dot--expense" /> Expenses
                </div>
              </div>
            </div>

            <div className="bf-chart-bars-container">
              {/* Jun */}
              <div className="bf-chart-bar-col">
                <div className="bf-chart-bar-visual">
                  <div 
                    className="bf-chart-bar-revenue"
                    style={{ '--bar-revenue-height': '70%' } as React.CSSProperties}
                  >
                    <div 
                      className="bf-chart-bar-expense"
                      style={{ '--bar-expense-height': '28%' } as React.CSSProperties}
                    />
                  </div>
                </div>
                <span className="bf-chart-bar-label">Jun</span>
              </div>

              {/* Jul */}
              <div className="bf-chart-bar-col">
                <div className="bf-chart-bar-visual">
                  <div 
                    className="bf-chart-bar-revenue"
                    style={{ '--bar-revenue-height': '80%' } as React.CSSProperties}
                  >
                    <div 
                      className="bf-chart-bar-expense"
                      style={{ '--bar-expense-height': '20%' } as React.CSSProperties}
                    />
                  </div>
                </div>
                <span className="bf-chart-bar-label">Jul</span>
              </div>

              {/* Aug */}
              <div className="bf-chart-bar-col">
                <div className="bf-chart-bar-visual">
                  <div 
                    className="bf-chart-bar-revenue"
                    style={{ '--bar-revenue-height': '65%' } as React.CSSProperties}
                  >
                    <div 
                      className="bf-chart-bar-expense"
                      style={{ '--bar-expense-height': '38%' } as React.CSSProperties}
                    />
                  </div>
                </div>
                <span className="bf-chart-bar-label">Aug</span>
              </div>

              {/* Sep */}
              <div className="bf-chart-bar-col">
                <div className="bf-chart-bar-visual">
                  <div 
                    className="bf-chart-bar-revenue"
                    style={{ '--bar-revenue-height': '75%' } as React.CSSProperties}
                  >
                    <div 
                      className="bf-chart-bar-expense"
                      style={{ '--bar-expense-height': '40%' } as React.CSSProperties}
                    />
                  </div>
                </div>
                <span className="bf-chart-bar-label">Sep</span>
              </div>

              {/* Oct */}
              <div className="bf-chart-bar-col">
                <div className="bf-chart-bar-visual">
                  <div 
                    className="bf-chart-bar-revenue"
                    style={{ '--bar-revenue-height': '85%' } as React.CSSProperties}
                  >
                    <div 
                      className="bf-chart-bar-expense"
                      style={{ '--bar-expense-height': '12%' } as React.CSSProperties}
                    />
                  </div>
                </div>
                <span className="bf-chart-bar-label">Oct</span>
              </div>

              {/* Nov */}
              <div className="bf-chart-bar-col">
                <div className="bf-chart-bar-visual">
                  <div className="bf-chart-bar-visual-inactive" />
                </div>
                <span className="bf-chart-bar-label">Nov</span>
              </div>
            </div>
          </div>
        </div>
      </IonContent>

      {/* Record Transaction Modal */}
      <IonModal
        isOpen={showAddModal}
        onDidDismiss={() => setShowAddModal(false)}
        className="sa-modal sa-modal--sm"
      >
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
              <label className="sa-settings__label">Category</label>
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
                <label className="sa-settings__label">Amount (₹)</label>
                <input
                  type="number"
                  className="sa-input"
                  placeholder="0.00"
                  value={newTx.amount}
                  onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })}
                />
              </div>

              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Payment Mode</label>
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
              <label className="sa-settings__label">Description</label>
              <textarea
                className="sa-input"
                style={{ resize: 'none', height: '60px' }}
                placeholder="Optional transaction description..."
                value={newTx.description}
                onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
              />
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button className="sa-btn sa-btn--primary" onClick={handleRecordTx}>
              Record Entry
            </button>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
};

export default FinancePage;
