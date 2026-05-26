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
  notificationsOutline,
  helpCircleOutline,
  ellipsisVerticalOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  timeOutline,
  calendarOutline,
  downloadOutline,
  documentTextOutline,
  chevronBackOutline,
  chevronForwardOutline,
  peopleOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../../store/auth.store';
import './branch-admin.css';

interface WorkerDailyAttendance {
  id: number;
  name: string;
  role: string;
  checkIn: string;
  checkOut: string;
  status: 'Present' | 'Absent' | 'Half Day' | 'Select...';
}

interface HistoricalLog {
  id: number;
  date: string;
  workerName: string;
  status: 'Present' | 'Absent' | 'Half Day';
  hours: string;
  remarks: string;
}

const AttendancePage: React.FC = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Historical Log Filters
  const [filterDate, setFilterDate] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modal / Modify States
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<WorkerDailyAttendance | null>(null);

  // Daily staff attendance data matching the screenshot!
  const [dailyAttendance, setDailyAttendance] = useState<WorkerDailyAttendance[]>([
    { id: 1, name: 'Elena Rodriguez', role: 'Senior Healer', checkIn: '08:15 AM', checkOut: '--', status: 'Present' },
    { id: 2, name: 'David Park', role: 'Admin Staff', checkIn: 'N/A', checkOut: 'N/A', status: 'Absent' },
    { id: 3, name: 'Ayesha Khan', role: 'Lead Healer', checkIn: '09:30 AM', checkOut: '--', status: 'Half Day' },
    { id: 4, name: 'Samuel Peterson', role: 'Physician', checkIn: '08:00 AM', checkOut: '--', status: 'Select...' },
  ]);

  // Historical log items matching the screenshot!
  const [historicalLogs] = useState<HistoricalLog[]>([
    { id: 1, date: 'Oct 24, 2023', workerName: 'David Park', status: 'Present', hours: '8.5h', remarks: 'Regular shift.' },
    { id: 2, date: 'Oct 24, 2023', workerName: 'Elena Rodriguez', status: 'Half Day', hours: '4.0h', remarks: "Doctor's appointment in the afternoon." },
    { id: 3, date: 'Oct 23, 2023', workerName: 'Samuel Peterson', status: 'Absent', hours: '0.0h', remarks: 'Medical leave (Cert submitted).' },
  ]);

  const handleBulkMarkPresent = () => {
    setDailyAttendance(
      dailyAttendance.map((w) =>
        w.status === 'Select...' || w.status === 'Absent'
          ? { ...w, status: 'Present', checkIn: '08:00 AM' }
          : w
      )
    );
  };

  const handleUpdateStatus = (status: 'Present' | 'Absent' | 'Half Day' | 'Select...') => {
    if (!selectedWorker) return;
    setDailyAttendance(
      dailyAttendance.map((w) =>
        w.id === selectedWorker.id
          ? {
              ...w,
              status,
              checkIn: status === 'Absent' ? 'N/A' : w.checkIn === 'N/A' ? '08:30 AM' : w.checkIn,
              checkOut: status === 'Absent' ? 'N/A' : w.checkOut,
            }
          : w
      )
    );
    setShowStatusModal(false);
    setSelectedWorker(null);
  };

  const filteredDaily = dailyAttendance.filter((w) =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHistory = historicalLogs.filter((log) => {
    const matchesDate = !filterDate || log.date.includes(filterDate);
    const matchesStatus = filterStatus === 'All' || log.status === filterStatus;
    
    // For role check in mock: David Park is Admin Staff, Elena Rodriguez is Senior Healer, Samuel Peterson is Physician
    let matchesRole = true;
    if (filterRole !== 'All') {
      if (filterRole === 'Healer' && !log.workerName.includes('Rodriguez')) matchesRole = false;
      if (filterRole === 'Staff' && !log.workerName.includes('Park')) matchesRole = false;
      if (filterRole === 'Physician' && !log.workerName.includes('Peterson')) matchesRole = false;
    }

    return matchesDate && matchesStatus && matchesRole;
  });

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Worker Attendance</IonTitle>
          <IonButtons slot="end">
            <button className="sa-page__toolbar-avatar">BA</button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          {/* Header row with search */}
          <div className="at-header">
            <div className="at-title-row">
              <h1 className="at-title">Worker Attendance</h1>
              <div className="at-search">
                <IonIcon icon={searchOutline} style={{ color: '#64748b' }} />
                <input
                  placeholder="Search staff by name or role..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Stats Cards Row */}
          <div className="at-stats-grid">
            {/* Card 1 */}
            <div className="at-stat-card at-stat-card--total">
              <div>
                <div className="at-stat-label">TOTAL STAFF</div>
                <div className="at-stat-value">
                  28 <span className="at-stat-trend at-stat-trend--up">~ +2</span>
                </div>
              </div>
              <div className="vl-stat-icon-wrapper">
                <IonIcon icon={peopleOutline} />
              </div>
            </div>

            {/* Card 2 */}
            <div className="at-stat-card at-stat-card--present">
              <div>
                <div className="at-stat-label">PRESENT TODAY</div>
                <div className="at-stat-value">
                  22 <span className="at-stat-trend at-stat-trend--up">~ 82%</span>
                </div>
              </div>
              <div className="vl-stat-icon-wrapper">
                <IonIcon icon={checkmarkCircleOutline} style={{ color: '#10b981' }} />
              </div>
            </div>

            {/* Card 3 */}
            <div className="at-stat-card at-stat-card--absent">
              <div>
                <div className="at-stat-label">ABSENT</div>
                <div className="at-stat-value">
                  3 <span className="at-stat-trend at-stat-trend--down">~ -1</span>
                </div>
              </div>
              <div className="vl-stat-icon-wrapper">
                <IonIcon icon={closeCircleOutline} style={{ color: '#ef4444' }} />
              </div>
            </div>

            {/* Card 4 */}
            <div className="at-stat-card at-stat-card--halfday">
              <div>
                <div className="at-stat-label">HALF DAY</div>
                <div className="at-stat-value">
                  3 <span className="at-stat-trend at-stat-trend--neutral">~ Stable</span>
                </div>
              </div>
              <div className="vl-stat-icon-wrapper">
                <IonIcon icon={timeOutline} style={{ color: '#f59e0b' }} />
              </div>
            </div>
          </div>

          {/* Two-Column Grid */}
          <div className="at-main-grid">
            {/* Left Column: Mark Daily Attendance */}
            <div className="at-left-col">
              <div className="at-card">
                <div className="at-card-header">
                  <div>
                    <h2 className="at-card-title">Mark Daily Attendance</h2>
                  </div>
                  <button className="at-btn-bulk" onClick={handleBulkMarkPresent}>
                    ✓ Bulk Mark Present
                  </button>
                </div>

                <div className="sa-table-responsive" style={{ border: 'none' }}>
                  <table className="at-table">
                    <thead>
                      <tr>
                        <th>WORKER NAME</th>
                        <th>ROLE</th>
                        <th>CHECK-IN</th>
                        <th>CHECK-OUT</th>
                        <th>STATUS</th>
                        <th>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDaily.map((worker) => (
                        <tr key={worker.id}>
                          <td>
                            <div className="vl-avatar-wrapper">
                              <div className="at-avatar">
                                {worker.name.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <span className="vl-visitor-name">{worker.name}</span>
                            </div>
                          </td>
                          <td>{worker.role}</td>
                          <td>{worker.checkIn}</td>
                          <td>{worker.checkOut}</td>
                          <td>
                            {worker.status === 'Select...' ? (
                              <button
                                className="at-dropdown"
                                onClick={() => {
                                  setSelectedWorker(worker);
                                  setShowStatusModal(true);
                                }}
                              >
                                Select...
                              </button>
                            ) : (
                              <span
                                className={`at-badge at-badge--${
                                  worker.status === 'Present'
                                    ? 'present'
                                    : worker.status === 'Absent'
                                    ? 'absent'
                                    : 'halfday'
                                }`}
                              >
                                {worker.status}
                              </span>
                            )}
                          </td>
                          <td>
                            <button
                              className="at-dots"
                              onClick={() => {
                                setSelectedWorker(worker);
                                setShowStatusModal(true);
                              }}
                            >
                              <IonIcon icon={ellipsisVerticalOutline} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column: Monthly Summary */}
            <div className="at-right-col">
              <div className="at-card">
                <div className="at-card-header" style={{ marginBottom: '16px' }}>
                  <h2 className="at-card-title">Monthly Summary</h2>
                </div>

                {/* Donut Rate chart */}
                <div className="at-donut-container">
                  <div className="at-donut">
                    <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%' }}>
                      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" style={{ stroke: '#f1f5f9', strokeWidth: '3.2', fill: 'none' }} />
                      <path strokeDasharray="94, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" style={{ stroke: '#1f7a6a', strokeWidth: '3.2', fill: 'none', strokeLinecap: 'round' }} />
                    </svg>
                    <div className="at-donut-val">
                      <span className="at-donut-label">94%</span>
                      <span className="at-donut-sub">RATE</span>
                    </div>
                  </div>
                  <span className="vl-visitor-sub" style={{ marginTop: '12px', fontWeight: 700 }}>Attendance Rate</span>
                </div>

                {/* Trend Section */}
                <div className="at-trend-section">
                  <div className="at-trend-header">
                    <span className="at-card-title" style={{ fontSize: '12px' }}>ATTENDANCE TREND (30 DAYS)</span>
                    <span className="vl-visitor-sub" style={{ fontWeight: 700 }}>Last 30 Days</span>
                  </div>

                  <div className="at-trend-bars">
                    <div className="at-trend-bar" style={{ '--bar-height': '60%' } as React.CSSProperties} />
                    <div className="at-trend-bar" style={{ '--bar-height': '75%' } as React.CSSProperties} />
                    <div className="at-trend-bar" style={{ '--bar-height': '50%' } as React.CSSProperties} />
                    <div className="at-trend-bar" style={{ '--bar-height': '85%' } as React.CSSProperties} />
                    <div className="at-trend-bar" style={{ '--bar-height': '92%' } as React.CSSProperties} />
                    <div className="at-trend-bar" style={{ '--bar-height': '94%' } as React.CSSProperties} />
                  </div>
                </div>

                {/* Consistent Staff list */}
                <div className="at-consistent-section">
                  <span className="at-card-title" style={{ fontSize: '12px' }}>TOP CONSISTENT STAFF</span>
                  <div className="at-consistent-list">
                    <div className="at-consistent-item">
                      <div className="at-consistent-avatar">ER</div>
                      <span className="at-consistent-name">Elena Rodriguez</span>
                      <span className="at-consistent-val">100%</span>
                    </div>
                    <div className="at-consistent-item">
                      <div className="at-consistent-avatar">SP</div>
                      <span className="at-consistent-name">Samuel Peterson</span>
                      <span className="at-consistent-val">98%</span>
                    </div>
                    <div className="at-consistent-item">
                      <div className="at-consistent-avatar">AK</div>
                      <span className="at-consistent-name">Ayesha Khan</span>
                      <span className="at-consistent-val">97%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Logs Full-Width Section */}
          <div className="bf-card at-history-section">
            <div className="at-history-header">
              <div>
                <h2 className="bf-card-title">Historical Attendance Logs</h2>
                <p className="bf-card-subtitle">View and manage past attendance records across the enterprise.</p>
              </div>
              <div className="at-history-actions">
                <button className="at-btn-action">
                  <IonIcon icon={downloadOutline} /> Export PDF
                </button>
                <button className="at-btn-action">
                  <IonIcon icon={documentTextOutline} /> Export Excel
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            <div className="at-filter-panel">
              <div className="at-filter-group">
                <span className="at-filter-label">Date Range:</span>
                <input
                  type="date"
                  className="at-filter-input"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                />
              </div>

              <div className="at-filter-group">
                <span className="at-filter-label">Role:</span>
                <select
                  className="at-filter-input"
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                >
                  <option value="All">All Roles</option>
                  <option value="Healer">Healer</option>
                  <option value="Staff">Staff</option>
                  <option value="Physician">Physician</option>
                </select>
              </div>

              <div className="at-filter-group">
                <span className="at-filter-label">Status:</span>
                <select
                  className="at-filter-input"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Half Day">Half Day</option>
                </select>
              </div>

              <button
                className="at-clear-filters"
                onClick={() => {
                  setFilterDate('');
                  setFilterRole('All');
                  setFilterStatus('All');
                }}
              >
                Clear Filters
              </button>
            </div>

            {/* Log Table */}
            <div className="sa-table-responsive" style={{ border: 'none' }}>
              <table className="bf-table" style={{ marginTop: '0' }}>
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>WORKER</th>
                    <th>STATUS</th>
                    <th>TOTAL HOURS</th>
                    <th>REMARKS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHistory.map((log) => (
                    <tr key={log.id}>
                      <td>{log.date}</td>
                      <td>
                        <span style={{ fontWeight: 700 }}>{log.workerName}</span>
                      </td>
                      <td>
                        <span
                          className={`at-badge at-badge--${
                            log.status === 'Present'
                              ? 'present'
                              : log.status === 'Absent'
                              ? 'absent'
                              : 'halfday'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                      <td>{log.hours}</td>
                      <td>{log.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
            <div className="at-pagination">
              <span className="at-pagination-info">Showing 1-{filteredHistory.length} of 280 records</span>
              <div className="at-pagination-controls">
                <button className="at-pagination-btn" disabled>
                  <IonIcon icon={chevronBackOutline} />
                </button>
                <button className="at-pagination-btn at-pagination-btn--active">1</button>
                <button className="at-pagination-btn">2</button>
                <button className="at-pagination-btn">3</button>
                <button className="at-pagination-btn">
                  <IonIcon icon={chevronForwardOutline} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </IonContent>

      {/* Mark Attendance Modal */}
      <IonModal isOpen={showStatusModal} onDidDismiss={() => setShowStatusModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Mark Worker Attendance</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowStatusModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            {selectedWorker && (
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: '0 0 4px 0' }}>{selectedWorker.name}</h3>
                <p className="sa-text-muted">{selectedWorker.role}</p>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button 
                className="sa-btn sa-btn--primary"
                style={{ justifyContent: 'center' }}
                onClick={() => handleUpdateStatus('Present')}
              >
                Mark Present
              </button>
              <button 
                className="sa-btn sa-btn--danger"
                style={{ justifyContent: 'center' }}
                onClick={() => handleUpdateStatus('Absent')}
              >
                Mark Absent
              </button>
              <button 
                className="sa-btn sa-btn--warning"
                style={{ justifyContent: 'center', color: '#ffffff' }}
                onClick={() => handleUpdateStatus('Half Day')}
              >
                Mark Half Day
              </button>
              <button 
                className="sa-btn sa-btn--outline"
                style={{ justifyContent: 'center' }}
                onClick={() => handleUpdateStatus('Select...')}
              >
                Reset Select
              </button>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowStatusModal(false)} style={{ width: '100%', justifyContent: 'center' }}>Cancel</button>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
};

export default AttendancePage;
