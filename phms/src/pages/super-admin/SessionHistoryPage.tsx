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
} from '@ionic/react';
import {
  chevronBackOutline,
  searchOutline,
  calendarOutline,
  filterOutline,
  downloadOutline,
  ellipsisHorizontalOutline,
  checkmarkCircleOutline,
  timeOutline,
  closeCircleOutline,
} from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import './super-admin.css';

const SessionHistoryPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const branchName = id ? decodeURIComponent(id) : 'Coastal Healing Center';

  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const sessionData = [
    { id: 1, date: '2026-05-07', startTime: '09:00 AM', endTime: '10:00 AM', patient: 'Elena Gilbert', healer: 'Dr. Aris Varma', type: 'Pranic Psychotherapy', status: 'Completed' },
    { id: 2, date: '2026-05-07', startTime: '11:30 AM', endTime: '12:30 PM', patient: 'Stefan Salvatore', healer: 'Maya Rose', type: 'Advanced Pranic Healing', status: 'Completed' },
    { id: 3, date: '2026-05-07', startTime: '03:00 PM', endTime: '04:00 PM', patient: 'Bonnie Bennett', healer: 'Samuel Chen', type: 'Basic Pranic Healing', status: 'Scheduled' },
    { id: 4, date: '2026-05-07', startTime: '04:30 PM', endTime: '05:30 PM', patient: 'Damon Salvatore', healer: 'Lila Thorne', type: 'Crystal Healing', status: 'Scheduled' },
    { id: 5, date: '2026-05-06', startTime: '09:30 AM', endTime: '10:30 AM', patient: 'Caroline Forbes', healer: 'Julian Mars', type: 'Pranic Psychotherapy', status: 'Completed' },
    { id: 6, date: '2026-05-06', startTime: '01:00 PM', endTime: '02:00 PM', patient: 'Matt Donovan', healer: 'Sofia Bell', type: 'Advanced Pranic Healing', status: 'Cancelled' },
    { id: 7, date: '2026-05-05', startTime: '10:30 AM', endTime: '11:30 AM', patient: 'Tyler Lockwood', healer: 'Dr. Aris Varma', type: 'Basic Pranic Healing', status: 'Completed' },
    { id: 8, date: '2026-05-05', startTime: '03:00 PM', endTime: '04:00 PM', patient: 'Jeremy Gilbert', healer: 'Maya Rose', type: 'Crystal Healing', status: 'Completed' },
    { id: 10, date: '2026-04-25', startTime: '02:30 PM', endTime: '03:30 PM', patient: 'Enzo St. John', healer: 'Lila Thorne', type: 'Pranic Psychotherapy', status: 'Completed' },
    { id: 11, date: '2026-04-15', startTime: '10:00 AM', endTime: '11:00 AM', patient: 'Katherine Pierce', healer: 'Julian Mars', type: 'Basic Pranic Healing', status: 'Cancelled' },
    { id: 12, date: '2026-04-10', startTime: '01:30 PM', endTime: '02:30 PM', patient: 'Hayley Marshall', healer: 'Sofia Bell', type: 'Advanced Pranic Healing', status: 'Completed' },
    { id: 13, date: '2026-05-10', startTime: '10:00 AM', endTime: '11:00 AM', patient: 'Klaus Mikaelson', healer: 'Dr. Aris Varma', type: 'Pranic Psychotherapy', status: 'Scheduled' },
  ];

  const filteredSessions = sessionData.filter(session => {
    const matchesSearch = 
      session.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.healer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.type.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Simple date string comparison for mock purposes
    // Real app would use library like date-fns
    const todayStr = '2026-05-07';
    const yesterdayStr = '2026-05-06';
    
    let matchesDate = true;
    if (dateRange === 'All Sessions') {
      matchesDate = true;
    } else if (dateRange === 'Today') {
      matchesDate = session.date === todayStr;
    } else if (dateRange === 'Yesterday') {
      matchesDate = session.date === yesterdayStr;
    } else if (dateRange === 'Last 7 Days') {
      // For mock: anything from 2026-05-01 onwards
      matchesDate = session.date >= '2026-05-01';
    } else if (dateRange === 'Last 30 Days') {
      // For mock: anything from 2026-04-07 onwards
      matchesDate = session.date >= '2026-04-07';
    } else if (dateRange === 'Select Date' && selectedDate) {
      matchesDate = session.date === selectedDate;
    }
    
    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredSessions.length / itemsPerPage);
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, dateRange, selectedDate]);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'sa-badge--active';
      case 'scheduled': return 'sa-badge--inactive';
      case 'cancelled': return 'sa-badge--danger';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return checkmarkCircleOutline;
      case 'scheduled': return timeOutline;
      case 'cancelled': return closeCircleOutline;
      default: return timeOutline;
    }
  };

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref={ROUTES.SUPER_ADMIN.BRANCHES} text="" />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Total Sessions</IonTitle>
          <IonButtons slot="end">
            <div className="sa-page__toolbar-actions">
              {/* <IonButton fill="clear" onClick={() => {}}>
                <IonIcon icon={downloadOutline} />
              </IonButton> */}
              <div className="sa-page__toolbar-avatar">SA</div>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          {/* Header */}
          <div className="sa-page__header">
            <div className="sa-page__header-row">
              <div>
                <h1 className="sa-page__title">Session History: {branchName}</h1>
                <p className="sa-page__subtitle">Comprehensive log of all healing sessions conducted at this sanctuary</p>
              </div>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="sa-section" style={{ padding: '16px 24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div className="sa-search" style={{ marginBottom: 0, maxWidth: '400px' }}>
                <IonIcon icon={searchOutline} />
                <input 
                  placeholder="Search by patient, healer or type..." 
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
                  <option>All Sessions</option>
                  <option>Today</option>
                  <option>Yesterday</option>
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Select Date</option>
                </select>
              </div>

              {dateRange === 'Select Date' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f6fa', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e8ecf1' }}>
                  <input 
                    type="date"
                    style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#1e293b', fontWeight: 500 }}
                    value={selectedDate}
                    max="2026-05-10"
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              )}

              <div style={{ flex: 1 }} />

            </div>
          </div>

          {/* Sessions Table */}
          <div className="sa-section" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="sa-table-container">
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Patient Name</th>
                    <th>Healer Name</th>
                    <th>Session Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSessions.length > 0 ? (
                    paginatedSessions.map((session) => (
                      <tr key={session.id}>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600, color: '#1e293b' }}>{session.date}</span>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>
                              {session.startTime} - {session.endTime}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="sa-table__user">
                            <div className="sa-table__avatar sa-table__avatar--primary" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                              {session.patient.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <span className="sa-table__user-name">{session.patient}</span>
                          </div>
                        </td>
                        <td>
                          <div className="sa-table__user">
                            <span style={{ fontWeight: 500 }}>{session.healer}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ color: '#475569' }}>{session.type}</span>
                        </td>
                        <td>
                          <span className={`sa-badge ${getStatusBadgeClass(session.status)}`} style={{ gap: '4px' }}>
                            <IonIcon icon={getStatusIcon(session.status)} style={{ fontSize: '14px' }} />
                            {session.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: '0' }}>
                        <div className="sa-empty-state" style={{ border: 'none', background: 'transparent', margin: '0' }}>
                          <div className="sa-empty-state__icon">
                            <IonIcon icon={calendarOutline} />
                          </div>
                          <h3 className="sa-empty-state__title">No sessions found</h3>
                          <p className="sa-empty-state__text">
                            {searchQuery 
                              ? `No sessions matching "${searchQuery}" were found.` 
                              : `There are currently no sessions recorded for the selected period.`}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="sa-table__footer">
              <div className="sa-pagination__controls" style={{ order: 2 }}>
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
              <div className="sa-pagination__info" style={{ order: 1 }}>
                Showing {filteredSessions.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredSessions.length)} of {filteredSessions.length} sessions
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SessionHistoryPage;
