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
  IonModal,
} from '@ionic/react';
import {
  searchOutline,
  calendarOutline,
  checkmarkCircleOutline,
  timeOutline,
  closeCircleOutline,
  chevronBackOutline,
  chevronForwardOutline,
  addOutline,
  peopleOutline,
  medkitOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../../store/auth.store';
import './branch-admin.css';

interface HealingSession {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  patient: string;
  healer: string;
  type: string;
  status: 'Completed' | 'Scheduled' | 'Cancelled';
}

const SessionsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dateRange, setDateRange] = useState('All Sessions');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<HealingSession | null>(null);

  const itemsPerPage = 5;

  const rawBranch = typeof user?.branch === 'object' && user?.branch !== null
    ? (user.branch as any).name
    : (user?.branch || 'Mumbai');
  const branchName = rawBranch.toLowerCase().includes('branch') ? rawBranch : `${rawBranch} Branch`;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // In-memory Mock data for branch sessions
  const [sessions, setSessions] = useState<HealingSession[]>([
    { id: 1, date: todayStr, startTime: '09:00 AM', endTime: '10:00 AM', patient: 'Elena Gilbert', healer: 'Dr. Aris Varma', type: 'Pranic Psychotherapy', status: 'Completed' },
    { id: 2, date: todayStr, startTime: '11:30 AM', endTime: '12:30 PM', patient: 'Stefan Salvatore', healer: 'Julian Mars', type: 'Advanced Pranic Healing', status: 'Completed' },
    { id: 3, date: todayStr, startTime: '03:00 PM', endTime: '04:00 PM', patient: 'Bonnie Bennett', healer: 'Julian Mars', type: 'Basic Pranic Healing', status: 'Scheduled' },
    { id: 4, date: todayStr, startTime: '04:30 PM', endTime: '05:30 PM', patient: 'Damon Salvatore', healer: 'Dr. Aris Varma', type: 'Crystal Healing', status: 'Scheduled' },
    { id: 5, date: yesterdayStr, startTime: '09:30 AM', endTime: '10:30 AM', patient: 'Caroline Forbes', healer: 'Dr. Aris Varma', type: 'Pranic Psychotherapy', status: 'Completed' },
    { id: 6, date: yesterdayStr, startTime: '01:00 PM', endTime: '02:00 PM', patient: 'Matt Donovan', healer: 'Julian Mars', type: 'Advanced Pranic Healing', status: 'Cancelled' },
    { id: 7, date: '2026-05-20', startTime: '10:30 AM', endTime: '11:30 AM', patient: 'Tyler Lockwood', healer: 'Dr. Aris Varma', type: 'Basic Pranic Healing', status: 'Completed' },
    { id: 8, date: '2026-05-19', startTime: '03:00 PM', endTime: '04:00 PM', patient: 'Jeremy Gilbert', healer: 'Julian Mars', type: 'Crystal Healing', status: 'Completed' },
  ]);

  // Form input states
  const [newSession, setNewSession] = useState({
    patient: '',
    healer: 'Dr. Aris Varma',
    date: todayStr,
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    type: 'Basic Pranic Healing',
  });

  const handleAddSession = () => {
    if (!newSession.patient) return;

    const added: HealingSession = {
      id: Date.now(),
      date: newSession.date,
      startTime: newSession.startTime,
      endTime: newSession.endTime,
      patient: newSession.patient,
      healer: newSession.healer,
      type: newSession.type,
      status: 'Scheduled',
    };

    setSessions([added, ...sessions]);
    setNewSession({
      patient: '',
      healer: 'Dr. Aris Varma',
      date: todayStr,
      startTime: '09:00 AM',
      endTime: '10:00 AM',
      type: 'Basic Pranic Healing',
    });
    setShowAddModal(false);
  };

  const handleUpdateStatus = (status: 'Completed' | 'Scheduled' | 'Cancelled') => {
    if (!selectedSession) return;
    setSessions(
      sessions.map((s) => (s.id === selectedSession.id ? { ...s, status } : s))
    );
    setShowStatusModal(false);
    setSelectedSession(null);
  };

  const filteredSessions = sessions.filter((session) => {
    const matchesSearch =
      session.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.healer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.type.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'All' || session.status === filterStatus;

    let matchesDate = true;
    if (dateRange === 'All Sessions') {
      matchesDate = true;
    } else if (dateRange === 'Today') {
      matchesDate = session.date === todayStr;
    } else if (dateRange === 'Yesterday') {
      matchesDate = session.date === yesterdayStr;
    } else if (dateRange === 'Last 7 Days') {
      const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
      matchesDate = session.date >= sevenDaysAgo;
    } else if (dateRange === 'Select Date' && selectedDate) {
      matchesDate = session.date === selectedDate;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Calculate totals
  const totalCount = filteredSessions.length;
  const completedCount = filteredSessions.filter((s) => s.status === 'Completed').length;
  const scheduledCount = filteredSessions.filter((s) => s.status === 'Scheduled').length;
  const cancelledCount = filteredSessions.filter((s) => s.status === 'Cancelled').length;

  const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
  const paginatedSessions = filteredSessions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, dateRange, selectedDate]);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'sa-badge--active';
      case 'scheduled':
        return 'sa-badge--pending';
      case 'cancelled':
        return 'sa-badge--inactive';
      default:
        return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return checkmarkCircleOutline;
      case 'scheduled':
        return timeOutline;
      case 'cancelled':
        return closeCircleOutline;
      default:
        return timeOutline;
    }
  };

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Branch Healing Sessions</IonTitle>
          <IonButtons slot="end">
            <button className="sa-page__toolbar-avatar">BA</button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          {/* Header */}
          <div className="sa-page__header">
            <div className="sa-page__header-row">
              <div>
                <h1 className="sa-page__title">Session Management</h1>
                <p className="sa-page__subtitle">Book and monitor daily healing sessions for {branchName}</p>
              </div>
              <div className="sa-page__header-actions">
                <button className="sa-btn sa-btn--primary" onClick={() => setShowAddModal(true)}>
                  <IonIcon icon={addOutline} style={{ marginRight: '4px' }} /> Book Session
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="sa-stats sa-stats--4">
            <div className="sa-stat-card">
              <div className="sa-stat-card__icon sa-stat-card__icon--primary">
                <IonIcon icon={peopleOutline} />
              </div>
              <div>
                <div className="sa-stat-card__label">Total Sessions</div>
                <div className="sa-stat-card__value">{totalCount}</div>
              </div>
            </div>

            <div className="sa-stat-card">
              <div className="sa-stat-card__icon sa-stat-card__icon--warning">
                <IonIcon icon={timeOutline} style={{ color: '#c47a20' }} />
              </div>
              <div>
                <div className="sa-stat-card__label">Scheduled</div>
                <div className="sa-stat-card__value">{scheduledCount}</div>
              </div>
            </div>

            <div className="sa-stat-card">
              <div className="sa-stat-card__icon sa-stat-card__icon--success">
                <IonIcon icon={checkmarkCircleOutline} style={{ color: '#1a8a5a' }} />
              </div>
              <div>
                <div className="sa-stat-card__label">Completed</div>
                <div className="sa-stat-card__value">{completedCount}</div>
              </div>
            </div>

            <div className="sa-stat-card">
              <div className="sa-stat-card__icon sa-stat-card__icon--danger">
                <IonIcon icon={closeCircleOutline} style={{ color: '#e11d48' }} />
              </div>
              <div>
                <div className="sa-stat-card__label">Cancelled</div>
                <div className="sa-stat-card__value">{cancelledCount}</div>
              </div>
            </div>
          </div>

          {/* Filters Area */}
          <div className="sa-section-header" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '32px' }}>
            <div className="sa-search" style={{ margin: 0, flex: 1.5 }}>
              <IonIcon icon={searchOutline} />
              <input
                placeholder="Search sessions by patient, healer or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="sa-filter-group" style={{ display: 'flex', gap: '8px', flex: 3.5, flexWrap: 'wrap' }}>
              <select
                className="sa-input"
                style={{ flex: 1, minWidth: '130px' }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              <select
                className="sa-input"
                style={{ flex: 1, minWidth: '140px' }}
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="All Sessions">All Sessions</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Select Date">Select Date</option>
              </select>

              {dateRange === 'Select Date' && (
                <input
                  type="date"
                  className="sa-input"
                  style={{ flex: 1, minWidth: '140px' }}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              )}

              <button
                className="sa-btn sa-btn--outline"
                onClick={() => {
                  setSearchQuery('');
                  setFilterStatus('All');
                  setDateRange('All Sessions');
                  setSelectedDate('');
                }}
              >
                Clear
              </button>
            </div>
          </div>

          {/* Table Ledger */}
          <div className="sa-section" style={{ padding: 0, overflow: 'hidden', marginTop: '20px' }}>
            <div className="sa-table-responsive">
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Patient Name</th>
                    <th>Healer Name</th>
                    <th>Session Type</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSessions.length > 0 ? (
                    paginatedSessions.map((session) => (
                      <tr key={session.id}>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600 }}>{session.date}</span>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>
                              {session.startTime} - {session.endTime}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="sa-table__user">
                            <div className="sa-table__avatar sa-table__avatar--primary" style={{ width: '32px', height: '32px', fontSize: '12px' }}>
                              {session.patient.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <span className="sa-table__user-name">{session.patient}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontWeight: 500 }}>{session.healer}</span>
                        </td>
                        <td>{session.type}</td>
                        <td>
                          <span className={`sa-badge ${getStatusBadgeClass(session.status)}`} style={{ gap: '4px' }}>
                            <IonIcon icon={getStatusIcon(session.status)} style={{ fontSize: '14px' }} />
                            {session.status}
                          </span>
                        </td>
                        <td>
                          <div className="sa-table__actions">
                            <button
                              className="sa-btn sa-btn--sm sa-btn--primary"
                              onClick={() => {
                                setSelectedSession(session);
                                setShowStatusModal(true);
                              }}
                            >
                              Update Status
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div className="sa-empty-state" style={{ border: 'none', background: 'transparent', margin: '0' }}>
                          <div className="sa-empty-state__icon">
                            <IonIcon icon={calendarOutline} />
                          </div>
                          <h3 className="sa-empty-state__title">No sessions registered</h3>
                          <p className="sa-empty-state__text">
                            {searchQuery
                              ? `No session matching "${searchQuery}" was found.`
                              : `There are currently no sessions logged for the selected filters.`}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="sa-table__footer">
                <div className="sa-pagination__controls" style={{ order: 2 }}>
                  <button
                    className="sa-pagination__btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
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
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                  >
                    <IonIcon icon={chevronForwardOutline} />
                  </button>
                </div>
                <div className="sa-pagination__info" style={{ order: 1 }}>
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredSessions.length)} of{' '}
                  {filteredSessions.length} registered sessions
                </div>
              </div>
            )}
          </div>
        </div>
      </IonContent>

      {/* Book Session Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Book Healing Session</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowAddModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Patient Name</label>
              <input
                className="sa-input"
                placeholder="Full Name"
                value={newSession.patient}
                onChange={(e) => setNewSession({ ...newSession, patient: e.target.value })}
              />
            </div>

            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Assigned Healer</label>
              <select
                className="sa-input"
                value={newSession.healer}
                onChange={(e) => setNewSession({ ...newSession, healer: e.target.value })}
              >
                <option>Dr. Aris Varma</option>
                <option>Julian Mars</option>
                <option>Maya Rose</option>
                <option>Lila Thorne</option>
              </select>
            </div>

            <div className="sa-settings__form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Session Type</label>
                <select
                  className="sa-input"
                  value={newSession.type}
                  onChange={(e) => setNewSession({ ...newSession, type: e.target.value })}
                >
                  <option>Basic Pranic Healing</option>
                  <option>Advanced Pranic Healing</option>
                  <option>Pranic Psychotherapy</option>
                  <option>Crystal Healing</option>
                </select>
              </div>

              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Session Date</label>
                <input
                  type="date"
                  className="sa-input"
                  value={newSession.date}
                  onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
                />
              </div>
            </div>

            <div className="sa-settings__form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Start Time</label>
                <input
                  type="text"
                  className="sa-input"
                  placeholder="09:00 AM"
                  value={newSession.startTime}
                  onChange={(e) => setNewSession({ ...newSession, startTime: e.target.value })}
                />
              </div>

              <div className="sa-settings__form-group">
                <label className="sa-settings__label">End Time</label>
                <input
                  type="text"
                  className="sa-input"
                  placeholder="10:00 AM"
                  value={newSession.endTime}
                  onChange={(e) => setNewSession({ ...newSession, endTime: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleAddSession}>Book Session</button>
          </div>
        </div>
      </IonModal>

      {/* Update Status Modal */}
      <IonModal isOpen={showStatusModal} onDidDismiss={() => setShowStatusModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Update Session Status</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowStatusModal(false)}>×</button>
          </div>
          <div className="sa-modal__body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {selectedSession && (
              <div style={{ textAlign: 'center', marginBottom: '14px' }}>
                <h3 style={{ margin: '0 0 4px 0' }}>{selectedSession.patient}</h3>
                <p className="sa-text-muted" style={{ margin: 0 }}>{selectedSession.type}</p>
              </div>
            )}
            <button
              className="sa-btn sa-btn--primary"
              style={{ justifyContent: 'center' }}
              onClick={() => handleUpdateStatus('Completed')}
            >
              <IonIcon icon={checkmarkCircleOutline} style={{ marginRight: '6px' }} /> Mark Completed
            </button>
            <button
              className="sa-btn sa-btn--outline"
              style={{ justifyContent: 'center' }}
              onClick={() => handleUpdateStatus('Scheduled')}
            >
              <IonIcon icon={timeOutline} style={{ marginRight: '6px' }} /> Keep Scheduled
            </button>
            <button
              className="sa-btn sa-btn--danger"
              style={{ justifyContent: 'center' }}
              onClick={() => handleUpdateStatus('Cancelled')}
            >
              <IonIcon icon={closeCircleOutline} style={{ marginRight: '6px' }} /> Cancel Session
            </button>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowStatusModal(false)} style={{ width: '100%', justifyContent: 'center' }}>
              Cancel
            </button>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
};

export default SessionsPage;
