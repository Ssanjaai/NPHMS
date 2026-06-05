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
  IonButton,
  IonBackButton,
  IonModal,
} from '@ionic/react';
import {
  chevronBackOutline,
  searchOutline,
  calendarOutline,
  downloadOutline,
  checkmarkCircleOutline,
  timeOutline,
  walletOutline,
  cashOutline,
  cardOutline,
  printOutline,
  filterOutline,
} from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import './super-admin.css';

const BranchRevenuePage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const branchName = id ? decodeURIComponent(id) : 'Coastal Healing Center';

  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('All Time');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [showExportModal, setShowExportModal] = useState(false);
  const [exportType, setExportType] = useState<'download' | 'print'>('download');

  const revenueData = [
    { id: 1, date: '2026-05-07', patient: 'Elena Gilbert', amount: '₹1,500', method: 'Cash', type: 'Advanced Healing', status: 'Paid' },
    { id: 2, date: '2026-05-07', patient: 'Stefan Salvatore', amount: '₹2,200', method: 'UPI', type: 'Psychotherapy', status: 'Paid' },
    { id: 3, date: '2026-05-06', patient: 'Bonnie Bennett', amount: '₹1,200', method: 'Card', type: 'Basic Healing', status: 'Paid' },
    { id: 4, date: '2026-05-06', patient: 'Damon Salvatore', amount: '₹3,500', method: 'UPI', type: 'Crystal Healing', status: 'Pending' },
    { id: 5, date: '2026-05-05', patient: 'Caroline Forbes', amount: '₹1,500', method: 'Cash', type: 'Psychotherapy', status: 'Paid' },
    { id: 6, date: '2026-05-05', patient: 'Matt Donovan', amount: '₹2,200', method: 'UPI', type: 'Advanced Healing', status: 'Paid' },
    { id: 7, date: '2026-05-04', patient: 'Tyler Lockwood', amount: '₹1,200', method: 'Cash', type: 'Basic Healing', status: 'Paid' },
    { id: 8, date: '2026-05-04', patient: 'Jeremy Gilbert', amount: '₹1,800', method: 'UPI', type: 'Crystal Healing', status: 'Paid' },
    { id: 9, date: '2026-05-03', patient: 'Alaric Saltzman', amount: '₹2,500', method: 'Card', type: 'Psychotherapy', status: 'Paid' },
    { id: 10, date: '2026-05-03', patient: 'Enzo St. John', amount: '₹1,500', method: 'UPI', type: 'Advanced Healing', status: 'Paid' },
  ];

  const filteredRevenue = revenueData.filter(item => {
    const matchesSearch = 
      item.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.method.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'All Status' || item.status === statusFilter;
    
    let matchesDate = true;
    const todayStr = '2026-05-07';
    const yesterdayStr = '2026-05-06';
    
    if (dateRange === 'Today') {
      matchesDate = item.date === todayStr;
    } else if (dateRange === 'Yesterday') {
      matchesDate = item.date === yesterdayStr;
    } else if (dateRange === 'Last 7 Days') {
      matchesDate = item.date >= '2026-05-01';
    } else if (dateRange === 'Select Date' && selectedDate) {
      matchesDate = item.date === selectedDate;
    }
    
    return matchesSearch && matchesDate && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRevenue.length / itemsPerPage);
  const paginatedRevenue = filteredRevenue.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateRange, selectedDate, statusFilter]);

  const getMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'cash': return cashOutline;
      case 'upi': return walletOutline;
      case 'card': return cardOutline;
      default: return cashOutline;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    return status.toLowerCase() === 'paid' ? 'sa-badge--active' : 'sa-badge--inactive';
  };

  const stats = {
    totalIncome: filteredRevenue
      .filter(item => item.status === 'Paid')
      .reduce((sum, item) => sum + parseInt(item.amount.replace(/[^0-9]/g, '')), 0),
    paidCount: filteredRevenue.filter(item => item.status === 'Paid').length,
    pendingCount: filteredRevenue.filter(item => item.status === 'Pending').length,
    pendingAmount: filteredRevenue
      .filter(item => item.status === 'Pending')
      .reduce((sum, item) => sum + parseInt(item.amount.replace(/[^0-9]/g, '')), 0),
  };

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref={ROUTES.SUPER_ADMIN.BRANCHES} text="" />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Branch Revenue</IonTitle>
          <IonButtons slot="end">
            <div className="sa-page__toolbar-actions">
              <IonButton fill="clear" onClick={() => { setExportType('print'); setShowExportModal(true); }}>
                <IonIcon icon={printOutline} />
              </IonButton>
              <IonButton fill="clear" onClick={() => { setExportType('download'); setShowExportModal(true); }}>
                <IonIcon icon={downloadOutline} />
              </IonButton>
              <div className="sa-page__toolbar-avatar">SA</div>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          <div className="sa-page__header">
            <h1 className="sa-page__title">Patient Income: {branchName}</h1>
            <p className="sa-page__subtitle">Detailed breakdown of revenue generated from healing sessions</p>
          </div>

          <div className="sa-stats sa-stats--3">
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Total Income</div>
                <div className="sa-stat-card__value">₹{stats.totalIncome.toLocaleString()}</div>
                <div className="sa-stat-card__detail" style={{ color: '#10b981' }}>From paid sessions</div>
              </div>
              <div className="sa-stat-card__icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <IonIcon icon={cashOutline} />
              </div>
            </div>
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Paid Transactions</div>
                <div className="sa-stat-card__value">{stats.paidCount < 10 ? `0${stats.paidCount}` : stats.paidCount}</div>
                <div className="sa-stat-card__detail">Completed payments</div>
              </div>
              <div className="sa-stat-card__icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                <IonIcon icon={checkmarkCircleOutline} />
              </div>
            </div>
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Pending Transactions</div>
                <div className="sa-stat-card__value">{stats.pendingCount < 10 ? `0${stats.pendingCount}` : stats.pendingCount}</div>
                <div className="sa-stat-card__detail" style={{ color: '#f59e0b' }}>Totaling ₹{stats.pendingAmount.toLocaleString()}</div>
              </div>
              <div className="sa-stat-card__icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                <IonIcon icon={timeOutline} />
              </div>
            </div>
          </div>

          <div className="sa-section" style={{ padding: '16px 24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div className="sa-search" style={{ marginBottom: 0, maxWidth: '400px' }}>
                <IonIcon icon={searchOutline} />
                <input 
                  placeholder="Search by patient or method..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f6fa', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e8ecf1' }}>
                <IonIcon icon={calendarOutline} style={{ color: '#64748b' }} />
                <select 
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#1e293b', fontWeight: 500 }}
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                >
                  <option>All Time</option>
                  <option>Today</option>
                  <option>Yesterday</option>
                  <option>Last 7 Days</option>
                  <option>Select Date</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f6fa', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e8ecf1' }}>
                <IonIcon icon={filterOutline} style={{ color: '#64748b' }} />
                <select 
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#1e293b', fontWeight: 500 }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Paid</option>
                  <option>Pending</option>
                </select>
              </div>

              {dateRange === 'Select Date' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f6fa', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e8ecf1' }}>
                  <input 
                    type="date"
                    className="sa-date-input"
                    placeholder="dd-mm-yyyy"
                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#1e293b', fontWeight: 500 }}
                    value={selectedDate}
                    max="2026-05-07"
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="sa-section" style={{ padding: 0 }}>
            <div className="sa-table-responsive">
              <table className="sa-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Patient Name</th>
                  <th>Session Type</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRevenue.map((item) => (
                  <tr key={item.id}>
                    <td>{item.date}</td>
                    <td>
                      <div className="sa-table__user">
                        <div className="sa-table__avatar sa-table__avatar--primary" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                          {item.patient.split(' ').map((n: string) => n[0]).join('')}
                        </div>
                        <span className="sa-table__user-name">{item.patient}</span>
                      </div>
                    </td>
                    <td>{item.type}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <IonIcon icon={getMethodIcon(item.method)} style={{ fontSize: '16px', color: '#64748b' }} />
                        {item.method}
                      </div>
                    </td>
                    <td><span style={{ fontWeight: 600 }}>{item.amount}</span></td>
                    <td>
                      <span className={`sa-badge ${getStatusBadgeClass(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

            <div className="sa-table__footer">
              <div className="sa-pagination__controls">
                <button 
                  className="sa-pagination__btn" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <IonIcon icon={chevronBackOutline} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    className={`sa-pagination__btn ${currentPage === i + 1 ? 'sa-pagination__btn--active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  className="sa-pagination__btn" 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <IonIcon icon={chevronBackOutline} style={{ transform: 'rotate(180deg)' }} />
                </button>
              </div>
              <div className="sa-pagination__info">
                Showing {filteredRevenue.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredRevenue.length)} of {filteredRevenue.length} transactions
              </div>
            </div>
        </div>
      </div>
    </IonContent>

      {/* Export Confirmation Modal */}
      <IonModal isOpen={showExportModal} onDidDismiss={() => setShowExportModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>{exportType === 'download' ? 'Download Report' : 'Print Report'}</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowExportModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <p className="sa-modal__desc">
              Are you sure you want to {exportType === 'download' ? 'download the transaction report' : 'print the current financial statement'} for <strong>{branchName}</strong>?
            </p>
          </div>
          <div className="sa-modal__footer" style={{ justifyContent: 'center', gap: '12px' }}>
            <button className="sa-btn sa-btn--outline" style={{ flex: 1 }} onClick={() => setShowExportModal(false)}>Cancel</button>
            <button 
              className="sa-btn" 
              style={{ flex: 1, backgroundColor: exportType === 'download' ? 'var(--color-primary)' : '#10b981', color: 'white' }} 
              onClick={() => setShowExportModal(false)}
            >
              Confirm {exportType === 'download' ? 'Download' : 'Print'}
            </button>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
};

export default BranchRevenuePage;
