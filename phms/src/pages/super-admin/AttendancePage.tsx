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
  timeOutline,
  businessOutline,
  peopleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  calendarOutline,
  filterOutline,
  downloadOutline,
  alertCircleOutline,
  logInOutline,
  logOutOutline,
  informationCircleOutline,
  documentTextOutline,
  chevronBackOutline,
  flashOutline,
  trendingUpOutline,
} from 'ionicons/icons';
import './super-admin.css';

const AttendancePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<any>(null);
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportInfo, setExportInfo] = useState({ title: '', count: 0, branch: '' });
  const [viewMode, setViewMode] = useState<'daily' | 'history'>('daily');
  const [historyWorker, setHistoryWorker] = useState<any>(null);
  const [summaryType, setSummaryType] = useState<'daily' | 'monthly'>('daily');
  
  const [attendance, setAttendance] = useState([
    // May 12, 2024 (Today/Recent)
    { id: 1, name: 'Dr. Aris Varma', branch: 'Uptown Sanctuary', date: '2024-05-12', checkIn: '08:50 AM', checkOut: '05:30 PM', status: 'present', shift: 'Full Day' },
    { id: 2, name: 'Maya Rose', branch: 'Coastal Healing Center', date: '2024-05-12', checkIn: '09:15 AM', checkOut: null, status: 'present', shift: 'Full Day' },
    { id: 4, name: 'Lila Thorne', branch: 'Downtown Sanctuary', date: '2024-05-12', checkIn: '08:55 AM', checkOut: null, status: 'present', shift: 'Full Day' },
    { id: 6, name: 'Sarah Connor', branch: 'Coastal Healing Center', date: '2024-05-12', checkIn: '08:30 AM', checkOut: '04:30 PM', status: 'present', shift: 'Full Day' },
    { id: 8, name: 'Dwight Schrute', branch: 'Green Valley Branch', date: '2024-05-12', checkIn: '08:45 AM', checkOut: '01:00 PM', status: 'half-day', shift: 'Full Day' },
    { id: 9, name: 'Jim Halpert', branch: 'Uptown Sanctuary', date: '2024-05-12', checkIn: '09:10 AM', checkOut: '05:15 PM', status: 'present', shift: 'Full Day' },
    { id: 10, name: 'Pam Beesly', branch: 'Downtown Sanctuary', date: '2024-05-12', checkIn: '08:55 AM', checkOut: '05:00 PM', status: 'present', shift: 'Full Day' },

    // May 11, 2024
    { id: 11, name: 'Dr. Aris Varma', branch: 'Uptown Sanctuary', date: '2024-05-11', checkIn: '08:55 AM', checkOut: '05:40 PM', status: 'present', shift: 'Full Day' },
    { id: 12, name: 'Samuel Chen', branch: 'Green Valley Branch', date: '2024-05-11', checkIn: null, checkOut: null, status: 'absent', shift: 'Full Day' },
    { id: 13, name: 'Julian Mars', branch: 'Uptown Sanctuary', date: '2024-05-11', checkIn: '09:00 AM', checkOut: '01:00 PM', status: 'half-day', shift: 'Morning' },
    { id: 14, name: 'Angela Martin', branch: 'Downtown Sanctuary', date: '2024-05-11', checkIn: '08:30 AM', checkOut: '04:30 PM', status: 'present', shift: 'Full Day' },
    { id: 15, name: 'Oscar Martinez', branch: 'Coastal Healing Center', date: '2024-05-11', checkIn: '08:45 AM', checkOut: '05:15 PM', status: 'present', shift: 'Full Day' },

    // May 10, 2024
    { id: 16, name: 'Michael Scott', branch: 'Downtown Sanctuary', date: '2024-05-10', checkIn: null, checkOut: null, status: 'absent', shift: 'Full Day' },
    { id: 17, name: 'Kevin Malone', branch: 'Green Valley Branch', date: '2024-05-10', checkIn: '09:30 AM', checkOut: '01:30 PM', status: 'half-day', shift: 'Morning' },
    { id: 18, name: 'Stanley Hudson', branch: 'Coastal Healing Center', date: '2024-05-10', checkIn: '09:00 AM', checkOut: '05:00 PM', status: 'present', shift: 'Full Day' },
    { id: 19, name: 'Phyllis Vance', branch: 'Uptown Sanctuary', date: '2024-05-10', checkIn: '08:50 AM', checkOut: '05:10 PM', status: 'present', shift: 'Full Day' },

    // May 09, 2024
    { id: 20, name: 'Creed Bratton', branch: 'Green Valley Branch', date: '2024-05-09', checkIn: '10:00 AM', checkOut: '02:00 PM', status: 'half-day', shift: 'Full Day' },
    { id: 21, name: 'Meredith Palmer', branch: 'Downtown Sanctuary', date: '2024-05-09', checkIn: null, checkOut: null, status: 'absent', shift: 'Full Day' },
    { id: 22, name: 'Kelly Kapoor', branch: 'Coastal Healing Center', date: '2024-05-09', checkIn: '09:15 AM', checkOut: '05:45 PM', status: 'present', shift: 'Full Day' },

    // May 08, 2024
    { id: 23, name: 'Ryan Howard', branch: 'Uptown Sanctuary', date: '2024-05-08', checkIn: '09:00 AM', checkOut: '05:00 PM', status: 'present', shift: 'Full Day' },
    { id: 24, name: 'Toby Flenderson', branch: 'Downtown Sanctuary', date: '2024-05-08', checkIn: null, checkOut: null, status: 'absent', shift: 'Full Day' },
    
    // May 07, 2024
    { id: 25, name: 'Dr. Aris Varma', branch: 'Uptown Sanctuary', date: '2024-05-07', checkIn: '08:50 AM', checkOut: '05:30 PM', status: 'present', shift: 'Full Day' },
    { id: 26, name: 'Maya Rose', branch: 'Coastal Healing Center', date: '2024-05-07', checkIn: '09:15 AM', checkOut: '05:15 PM', status: 'present', shift: 'Full Day' },
    
    // May 06, 2024
    { id: 27, name: 'Samuel Chen', branch: 'Green Valley Branch', date: '2024-05-06', checkIn: '08:45 AM', checkOut: '12:45 PM', status: 'half-day', shift: 'Morning' },
    { id: 28, name: 'Lila Thorne', branch: 'Downtown Sanctuary', date: '2024-05-06', checkIn: '08:55 AM', checkOut: '05:00 PM', status: 'present', shift: 'Full Day' },
    
    // May 05, 2024 (Sunday - Some worked)
    { id: 29, name: 'Julian Mars', branch: 'Uptown Sanctuary', date: '2024-05-05', checkIn: '09:00 AM', checkOut: '05:00 PM', status: 'present', shift: 'Full Day' },
    
    // May 04, 2024
    { id: 30, name: 'Sarah Connor', branch: 'Coastal Healing Center', date: '2024-05-04', checkIn: '08:30 AM', checkOut: '04:30 PM', status: 'present', shift: 'Full Day' },
    { id: 31, name: 'Michael Scott', branch: 'Downtown Sanctuary', date: '2024-05-04', checkIn: '09:15 AM', checkOut: '01:15 PM', status: 'half-day', shift: 'Full Day' },
    
    // May 01, 2024
    { id: 32, name: 'Pam Beesly', branch: 'Downtown Sanctuary', date: '2024-05-01', checkIn: '08:55 AM', checkOut: '05:00 PM', status: 'present', shift: 'Full Day' },
    { id: 33, name: 'Jim Halpert', branch: 'Uptown Sanctuary', date: '2024-05-01', checkIn: '09:10 AM', checkOut: '05:15 PM', status: 'present', shift: 'Full Day' },
    { id: 34, name: 'Dwight Schrute', branch: 'Green Valley Branch', date: '2024-05-01', checkIn: null, checkOut: null, status: 'absent', shift: 'Full Day' },
  ]);

  const filteredAttendance = attendance.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         record.branch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBranch = filterBranch === 'All' || record.branch === filterBranch;
    const matchesStatus = filterStatus === 'All' || record.status === filterStatus;
    
    let matchesDate = true;
    
    // If user has set a custom range, use it
    if (dateRange.start || dateRange.end) {
      if (dateRange.start && dateRange.end) {
        matchesDate = record.date >= dateRange.start && record.date <= dateRange.end;
      } else if (dateRange.start) {
        matchesDate = record.date >= dateRange.start;
      } else if (dateRange.end) {
        matchesDate = record.date <= dateRange.end;
      }
    } else {
      // Default to the summaryType toggle (Daily/Monthly)
      if (summaryType === 'daily') {
        matchesDate = record.date === '2024-05-12';
      } else {
        matchesDate = record.date.startsWith('2024-05');
      }
    }

    return matchesSearch && matchesBranch && matchesStatus && matchesDate;
  });


  const totalWorkers = attendance.length;
  const presentCount = attendance.filter(a => a.status === 'present').length;
  const absentCount = attendance.filter(a => a.status === 'absent').length;
  const halfDayCount = attendance.filter(a => a.status === 'half-day').length;

  const branches = Array.from(new Set(attendance.map(a => a.branch)));
  const branchSummary = branches.map(branch => {
    const branchAttendance = attendance.filter(a => {
      const isBranch = a.branch === branch;
      if (!isBranch) return false;
      
      if (summaryType === 'daily') {
        // Mocking '2024-05-12' as current date for demonstration
        return a.date === '2024-05-12';
      } else {
        // Monthly - all records in May 2024 for this mock
        return a.date.startsWith('2024-05');
      }
    });
    return {
      name: branch,
      total: branchAttendance.length,
      present: branchAttendance.filter(a => a.status === 'present').length,
      absent: branchAttendance.filter(a => a.status === 'absent').length,
      halfDay: branchAttendance.filter(a => a.status === 'half-day').length
    };
  });
  const handleExport = (branchName?: string) => {
    const timeframe = summaryType === 'daily' ? 'Daily' : 'Monthly';
    if (branchName) {
      setExportInfo({
        title: `${timeframe} Branch Report`,
        count: 0, // Not needed for branch report message
        branch: branchName
      });
    } else {
      setExportInfo({
        title: 'Attendance Log Ready',
        count: filteredAttendance.length,
        branch: ''
      });
    }
    setShowExportModal(true);
  };
  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Worker Attendance</IonTitle>
          <IonButtons slot="end">
            <button className="sa-page__toolbar-avatar">SA</button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          <div className="sa-page__header">
            <div className="sa-page__header-row" style={{ flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 className="sa-page__title">Daily Attendance Log</h1>
                <p className="sa-page__subtitle">Manage and monitor staff attendance across all branches</p>
              </div>
              <div className="sa-page__header-actions" style={{ flexWrap: 'wrap', gap: '8px' }}>
                <button className="sa-btn sa-btn--primary" onClick={() => setShowReportModal(true)}>
                  <IonIcon icon={documentTextOutline} /> Report Center
                </button>
                <button className="sa-btn sa-btn--outline" onClick={() => handleExport()}>
                  <IonIcon icon={downloadOutline} /> Quick Export
                </button>
              </div>
            </div>
          </div>

          <div className="sa-stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Total Workers</div>
                <div className="sa-stat-card__value">{totalWorkers}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} /> Organization-wide
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--primary">
                <IonIcon icon={peopleOutline} />
              </div>
            </div>

            <div className="sa-stat-card" style={{ '--color-primary': '#10b981' } as any}>
              <div>
                <div className="sa-stat-card__label">Present</div>
                <div className="sa-stat-card__value">{presentCount}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} /> Currently on duty
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--success">
                <IonIcon icon={checkmarkCircleOutline} />
              </div>
            </div>

            <div className="sa-stat-card" style={{ '--color-primary': '#ef4444' } as any}>
              <div>
                <div className="sa-stat-card__label">Absent</div>
                <div className="sa-stat-card__value">{absentCount}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#ef4444', transform: 'rotate(90deg)' }} /> Leaves/Unreported
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--danger">
                <IonIcon icon={closeCircleOutline} />
              </div>
            </div>

            <div className="sa-stat-card" style={{ '--color-primary': '#f59e0b' } as any}>
              <div>
                <div className="sa-stat-card__label">Half Day</div>
                <div className="sa-stat-card__value">{halfDayCount}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#f59e0b' }} /> Partial shifts
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--warning">
                <IonIcon icon={timeOutline} />
              </div>
            </div>
          </div>

          <div className="sa-section">
            <div className="sa-section__header" style={{ flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 className="sa-section__title">Branch-wise Attendance Summary</h2>
                <p className="sa-section__subtitle">
                  {summaryType === 'daily' ? 'Daily' : 'Monthly'} overview of attendance across branches
                </p>
              </div>
              <div className="sa-input-group" style={{ width: '100%', maxWidth: '200px' }}>
                <select 
                  className="sa-input" 
                  value={summaryType} 
                  onChange={(e) => setSummaryType(e.target.value as any)}
                >
                  <option value="daily">Daily View</option>
                  <option value="monthly">Monthly View</option>
                </select>
              </div>
            </div>
            <div className="sa-table-responsive">
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Branch Name</th>
                    <th>Total Workers</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Half Day</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {branchSummary.map((summary, index) => (
                    <tr key={index}>
                      <td>
                        <div className="sa-table__branch-info" style={{ fontWeight: 600, color: 'var(--color-primary-dark)' }}>
                          <IonIcon icon={businessOutline} /> {summary.name}
                        </div>
                      </td>
                      <td>{summary.total}</td>
                      <td>
                        <span className="sa-badge sa-badge--present">{summary.present}</span>
                      </td>
                      <td>
                        <span className="sa-badge sa-badge--absent">{summary.absent}</span>
                      </td>
                      <td>
                        <span className="sa-badge sa-badge--half-day">{summary.halfDay}</span>
                      </td>
                      <td>
                        <button className="sa-btn sa-btn--sm sa-btn--primary" onClick={() => handleExport(summary.name)}>
                          <IonIcon icon={downloadOutline} /> Branch Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {viewMode === 'history' && (
            <div className="sa-section" style={{ borderLeft: '4px solid var(--color-primary)' }}>
              <div className="sa-section__header">
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button className="sa-back-btn" onClick={() => setViewMode('daily')}>
                      <IonIcon icon={chevronBackOutline} />
                    </button>
                    <h2 className="sa-section__title">Attendance History: {historyWorker?.name}</h2>
                  </div>
                  <p className="sa-section__subtitle">Detailed attendance trail for the selected staff member</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                   <button className="sa-btn sa-btn--sm sa-btn--outline">
                    <IonIcon icon={downloadOutline} /> PDF History
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="sa-section-header" style={{ marginTop: '24px' }}>
            <div className="sa-filter-row" style={{ 
              width: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px' 
            }}>
              <div className="sa-search" style={{ margin: 0, width: '100%' }}>
                <IonIcon icon={searchOutline} />
                <input 
                  placeholder="Search by Worker Name..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                gap: '12px',
                width: '100%'
              }}>
                <div className="sa-input-group" style={{ margin: 0 }}>
                  <select className="sa-input" style={{ width: '100%' }} value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)}>
                    <option value="All">All Branches</option>
                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <div className="sa-input-group" style={{ margin: 0 }}>
                  <select className="sa-input" style={{ width: '100%' }} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="All">All Statuses</option>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="half-day">Half Day</option>
                  </select>
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr auto 1fr', 
                alignItems: 'center', 
                gap: '8px', 
                width: '100%' 
              }}>
                <input 
                  type="date" 
                  className="sa-input sa-date-input" 
                  placeholder="dd-mm-yyyy"
                  style={{ width: '100%' }} 
                  value={dateRange.start} 
                  onChange={(e) => setDateRange({...dateRange, start: e.target.value})} 
                />
                <span style={{ color: '#64748b', fontSize: '12px', fontWeight: 700 }}>to</span>
                <input 
                  type="date" 
                  className="sa-input sa-date-input" 
                  placeholder="dd-mm-yyyy"
                  style={{ width: '100%' }} 
                  value={dateRange.end} 
                  onChange={(e) => setDateRange({...dateRange, end: e.target.value})} 
                />
              </div>

              <button 
                className="sa-btn sa-btn--outline" 
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => {
                  setSearchQuery('');
                  setFilterBranch('All');
                  setFilterStatus('All');
                  setDateRange({ start: '', end: '' });
                }}
              >
                <IonIcon icon={filterOutline} /> Clear Filters
              </button>
            </div>
          </div>

          <div className="sa-section" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="sa-table-responsive">
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Worker Name</th>
                    <th>Branch</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Attendance Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.length > 0 ? (
                    filteredAttendance.map((record) => (
                      <tr key={record.id}>
                        <td>
                          <div className="sa-table__user" style={{ cursor: 'pointer' }} onClick={() => {
                            setHistoryWorker(record);
                            setViewMode('history');
                            setSearchQuery(record.name);
                          }}>
                            <div className="sa-table__avatar sa-table__avatar--staff">
                              {record.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div className="sa-table__user-info">
                              <span className="sa-table__user-name">{record.name}</span>
                              <span className="sa-table__user-email">{record.shift} Shift</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="sa-table__branch-info">
                            <IonIcon icon={businessOutline} /> {record.branch}
                          </div>
                        </td>
                        <td>
                          <div className="sa-table__date">
                            <IonIcon icon={calendarOutline} />
                            {record.date}
                          </div>
                        </td>
                        <td>
                          <div className="sa-table__time">
                            <IonIcon icon={logInOutline} /> {record.checkIn || '--:--'}
                          </div>
                        </td>
                        <td>
                          <div className="sa-table__time">
                            <IonIcon icon={logOutOutline} /> {record.checkOut || '--:--'}
                          </div>
                        </td>
                        <td>
                          <span className={`sa-badge sa-badge--${record.status}`}>
                            {record.status.replace('-', ' ')}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '0' }}>
                        <div className="sa-empty-state" style={{ border: 'none', background: 'transparent', margin: '0' }}>
                          <div className="sa-empty-state__icon">
                            <IonIcon icon={peopleOutline} />
                          </div>
                          <h3 className="sa-empty-state__title">No attendance records found</h3>
                          <p className="sa-empty-state__text">
                            {searchQuery 
                              ? `No records matching "${searchQuery}" were found.` 
                              : `There are currently no attendance records matching the selected filters.`}
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

        {/* Report Center Modal */}
        <IonModal isOpen={showReportModal} onDidDismiss={() => setShowReportModal(false)} className="sa-modal">
          <div className="sa-modal__container" style={{ maxWidth: '800px' }}>
            <div className="sa-modal__header">
              <h2 className="sa-modal__title">Attendance Report Center</h2>
              <button className="sa-modal__close" onClick={() => setShowReportModal(false)}>
                <IonIcon icon={closeCircleOutline} />
              </button>
            </div>
            <div className="sa-modal__body">
              <p className="sa-modal__desc">Select a report type to generate organization-wide or branch-specific attendance records.</p>
              
              <div className="sa-report-cards sa-report-cards--responsive">
                <div className="sa-report-card" onClick={() => alert('Generating Daily Report...')}>
                  <div className="sa-report-card__icon"><IonIcon icon={calendarOutline} /></div>
                  <h3 className="sa-report-card__title">Daily Attendance Report</h3>
                  <p className="sa-report-card__desc">Full audit log for all branches for the selected date.</p>
                  <div className="sa-report-card__action">Generate PDF <IonIcon icon={downloadOutline} /></div>
                </div>

                <div className="sa-report-card" onClick={() => alert('Generating Monthly Report...')}>
                  <div className="sa-report-card__icon"><IonIcon icon={documentTextOutline} /></div>
                  <h3 className="sa-report-card__title">Monthly Attendance Report</h3>
                  <p className="sa-report-card__desc">Consolidated monthly summary with present/absent trends.</p>
                  <div className="sa-report-card__action">Generate Excel <IonIcon icon={downloadOutline} /></div>
                </div>

                <div className="sa-report-card" onClick={() => alert('Opening Branch Summary...')}>
                  <div className="sa-report-card__icon"><IonIcon icon={businessOutline} /></div>
                  <h3 className="sa-report-card__title">Branch-wise Summary</h3>
                  <p className="sa-report-card__desc">Comparative performance analysis across all sanctuary locations.</p>
                  <div className="sa-report-card__action">View Analysis <IonIcon icon={flashOutline} /></div>
                </div>

                <div className="sa-report-card" onClick={() => alert('Select a worker from the main log to view history')}>
                  <div className="sa-report-card__icon"><IonIcon icon={peopleOutline} /></div>
                  <h3 className="sa-report-card__title">Worker History</h3>
                  <p className="sa-report-card__desc">Detailed individual attendance trail for specific staff members.</p>
                  <div className="sa-report-card__action">View Details <IonIcon icon={timeOutline} /></div>
                </div>
              </div>

              <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: 700 }}>Bulk Export Options</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="sa-btn sa-btn--primary" style={{ flex: 1 }}>
                    <IonIcon icon={downloadOutline} /> Export All as PDF
                  </button>
                  <button className="sa-btn sa-btn--outline" style={{ flex: 1 }}>
                    <IonIcon icon={downloadOutline} /> Export All as Excel
                  </button>
                </div>
              </div>
            </div>
            <div className="sa-modal__footer">
              <button className="sa-btn sa-btn--outline" onClick={() => setShowReportModal(false)}>Close</button>
            </div>
          </div>
        </IonModal>

        {/* Export Confirmation Modal */}
        <IonModal isOpen={showExportModal} onDidDismiss={() => setShowExportModal(false)} className="sa-modal sa-modal--sm">
          <div className="sa-modal__content">
            <div className="sa-modal__header">
              <h2 className="sa-modal__title">Confirm Download</h2>
              <button className="sa-modal__close-btn" onClick={() => setShowExportModal(false)}>×</button>
            </div>
            
            <div className="sa-modal__body" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div className="sa-export-success-icon" style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: '#e0f2fe', 
                color: '#0284c7', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 24px',
                fontSize: '40px',
                border: '4px solid #bae6fd'
              }}>
                <IonIcon icon={downloadOutline} />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
                Download Report?
              </h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '15px', marginBottom: '8px' }}>
                {exportInfo.branch ? (
                  <>Are you sure you want to download the attendance report for <strong>{exportInfo.branch}</strong>?</>
                ) : (
                  <>Are you sure you want to download the attendance report for <strong>{exportInfo.count}</strong> records?</>
                )}
              </p>
              <p style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>
                {exportInfo.title}
              </p>
            </div>
            
            <div className="sa-modal__footer" style={{ borderTop: 'none', paddingTop: 0, gap: '12px' }}>
              <button className="sa-btn sa-btn--outline" style={{ flex: 1, height: '48px' }} onClick={() => setShowExportModal(false)}>Cancel</button>
              <button 
                className="sa-btn sa-btn--primary" 
                style={{ flex: 1, height: '48px', fontSize: '16px' }} 
                onClick={() => {
                  setShowExportModal(false);
                  // Trigger actual download logic here
                }}
              >
                Download
              </button>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default AttendancePage;
