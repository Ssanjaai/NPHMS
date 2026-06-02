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
  const [filterWorkerName, setFilterWorkerName] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const handleWorkerClick = (workerName: string) => {
    setFilterWorkerName(workerName);
    setCurrentPage(1);
    const element = document.getElementById('historical-attendance-logs');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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

  // Historical log items matching the screenshot (expanded for pagination support)!
  const [historicalLogs] = useState<HistoricalLog[]>([
    { id: 1, date: 'Oct 24, 2023', workerName: 'David Park', status: 'Present', hours: '8.5h', remarks: 'Regular shift.' },
    { id: 2, date: 'Oct 24, 2023', workerName: 'Elena Rodriguez', status: 'Half Day', hours: '4.0h', remarks: "Doctor's appointment in the afternoon." },
    { id: 3, date: 'Oct 23, 2023', workerName: 'Samuel Peterson', status: 'Absent', hours: '0.0h', remarks: 'Medical leave (Cert submitted).' },
    { id: 4, date: 'Oct 23, 2023', workerName: 'Ayesha Khan', status: 'Present', hours: '9.0h', remarks: 'Completed healer session logs.' },
    { id: 5, date: 'Oct 22, 2023', workerName: 'Elena Rodriguez', status: 'Present', hours: '8.0h', remarks: 'Regular shift.' },
    { id: 6, date: 'Oct 22, 2023', workerName: 'David Park', status: 'Present', hours: '8.5h', remarks: 'Regular shift.' },
    { id: 7, date: 'Oct 21, 2023', workerName: 'Samuel Peterson', status: 'Present', hours: '8.0h', remarks: 'Regular shift.' },
    { id: 8, date: 'Oct 21, 2023', workerName: 'Ayesha Khan', status: 'Half Day', hours: '4.5h', remarks: 'Left early for personal reasons.' },
    { id: 9, date: 'Oct 20, 2023', workerName: 'David Park', status: 'Present', hours: '8.5h', remarks: 'Regular shift.' },
    { id: 10, date: 'Oct 20, 2023', workerName: 'Elena Rodriguez', status: 'Present', hours: '8.0h', remarks: 'Regular shift.' },
    { id: 11, date: 'Oct 19, 2023', workerName: 'Samuel Peterson', status: 'Present', hours: '8.0h', remarks: 'Regular shift.' },
    { id: 12, date: 'Oct 19, 2023', workerName: 'Ayesha Khan', status: 'Present', hours: '8.5h', remarks: 'Regular shift.' },
  ]);

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
    let matchesDate = true;
    if (filterDate) {
      const [year, month, day] = filterDate.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthStr = months[parseInt(month, 10) - 1];
      const dayStr = parseInt(day, 10).toString(); // remove leading zero
      const expectedDateStr = `${monthStr} ${dayStr}, ${year}`;
      matchesDate = log.date === expectedDateStr;
    }
    const matchesStatus = filterStatus === 'All' || log.status === filterStatus;
    const matchesWorker = !filterWorkerName || log.workerName.toLowerCase().includes(filterWorkerName.toLowerCase());
    
    // For role check in mock: David Park is Admin Staff, Elena Rodriguez is Senior Healer, Samuel Peterson is Physician, Ayesha Khan is Lead Healer
    let matchesRole = true;
    if (filterRole !== 'All') {
      if (filterRole === 'Healer' && !log.workerName.includes('Rodriguez') && !log.workerName.includes('Khan')) matchesRole = false;
      if (filterRole === 'Staff' && !log.workerName.includes('Park')) matchesRole = false;
      if (filterRole === 'Physician' && !log.workerName.includes('Peterson')) matchesRole = false;
    }

    return matchesDate && matchesStatus && matchesRole && matchesWorker;
  });

  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(totalPages, 1));
  const indexOfLastItem = activePage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const paginatedHistory = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);

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

          {/* Daily Attendance Grid (Full-Width) */}
          <div className="at-main-grid" style={{ gridTemplateColumns: '1fr' }}>
            {/* Left Column: Mark Daily Attendance */}
            <div className="at-left-col">
              <div className="at-card">
                <div className="at-card-header">
                  <div>
                    <h2 className="at-card-title">Mark Daily Attendance</h2>
                  </div>
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
                            <div 
                              className="vl-avatar-wrapper" 
                              onClick={() => handleWorkerClick(worker.name)}
                              style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                              title={`Click to view ${worker.name}'s attendance history`}
                            >
                              <span className="vl-visitor-name" style={{ color: '#0d5c46', textDecoration: 'underline', fontWeight: 700 }}>{worker.name}</span>
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
          </div>

          {/* Historical Logs Full-Width Section */}
          <div className="bf-card at-history-section" id="historical-attendance-logs">
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
                <input
                  type="text"
                  placeholder="Search Worker Name..."
                  className="at-filter-input"
                  value={filterWorkerName}
                  onChange={(e) => {
                    setFilterWorkerName(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', outline: 'none', color: '#1e293b' }}
                />
              </div>

              <div className="at-filter-group">
                <input
                  type="date"
                  className="at-filter-input"
                  value={filterDate}
                  onChange={(e) => {
                    setFilterDate(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="at-filter-group">
                <select
                  className="at-filter-input"
                  value={filterRole}
                  onChange={(e) => {
                    setFilterRole(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="All">All Roles</option>
                  <option value="Healer">Healer</option>
                  <option value="Staff">Staff</option>
                  <option value="Physician">Physician</option>
                </select>
              </div>

              <div className="at-filter-group">
                <select
                  className="at-filter-input"
                  value={filterStatus}
                  onChange={(e) => {
                    setFilterStatus(e.target.value);
                    setCurrentPage(1);
                  }}
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
                  setFilterWorkerName('');
                  setCurrentPage(1);
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
                  {paginatedHistory.length > 0 ? (
                    paginatedHistory.map((log) => (
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', color: '#64748b', padding: '30px' }}>
                        No historical attendance records match your search filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
            <div className="at-pagination">
              <span className="at-pagination-info">
                {filteredHistory.length > 0 ? (
                  `Showing ${indexOfFirstItem + 1}-${Math.min(indexOfLastItem, filteredHistory.length)} of ${filteredHistory.length} records`
                ) : (
                  'Showing 0-0 of 0 records'
                )}
              </span>
              <div className="at-pagination-controls">
                <button
                  className="at-pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={activePage === 1}
                  style={{ opacity: activePage === 1 ? 0.5 : 1, cursor: activePage === 1 ? 'not-allowed' : 'pointer' }}
                >
                  <IonIcon icon={chevronBackOutline} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`at-pagination-btn ${activePage === pageNum ? 'at-pagination-btn--active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{ cursor: 'pointer' }}
                  >
                    {pageNum}
                  </button>
                ))}
                {totalPages === 0 && (
                  <button className="at-pagination-btn at-pagination-btn--active" disabled>
                    1
                  </button>
                )}
                <button
                  className="at-pagination-btn"
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={activePage === totalPages || totalPages === 0}
                  style={{ opacity: (activePage === totalPages || totalPages === 0) ? 0.5 : 1, cursor: (activePage === totalPages || totalPages === 0) ? 'not-allowed' : 'pointer' }}
                >
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <button 
                className="sa-btn sa-btn--primary"
                style={{ width: '240px', justifyContent: 'center' }}
                onClick={() => handleUpdateStatus('Present')}
              >
                Mark Present
              </button>
              <button 
                className="sa-btn sa-btn--danger"
                style={{ width: '240px', justifyContent: 'center' }}
                onClick={() => handleUpdateStatus('Absent')}
              >
                Mark Absent
              </button>
              <button 
                className="sa-btn sa-btn--warning"
                style={{ width: '240px', justifyContent: 'center', color: '#ffffff' }}
                onClick={() => handleUpdateStatus('Half Day')}
              >
                Mark Half Day
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
