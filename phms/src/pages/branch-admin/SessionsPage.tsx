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
  cashOutline,
  starOutline,
  star,
  pencilOutline,
  eyeOutline,
  trashOutline,
  notificationsOutline,
  downloadOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { ROUTES } from '../../constants/routes.constant';
import './branch-admin.css';

export interface HealingSession {
  id: number;
  sessionNo: string; // S-0001 per patient sequential
  date: string;
  startTime: string;
  endTime: string;
  patient: string;
  healer: string;
  type: string;
  status: 'Completed' | 'Scheduled' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending';
  paymentMethod?: 'Cash' | 'UPI';
  followUp: {
    required: boolean;
    urgency: 'Urgent' | 'Pending' | 'None';
  };
  notes?: {
    treatmentType: string;
    observations: string;
    detailedNotes: string;
    recommendation: string;
  };
  feedback?: {
    rating: number;
    comment: string;
  };
}

const SessionsPage: React.FC = () => {
  const history = useHistory();
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [dateRange, setDateRange] = useState('All Sessions');
  const [selectedDate, setSelectedDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modals & States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  
  const [selectedSession, setSelectedSession] = useState<HealingSession | null>(null);

  const itemsPerPage = 5;

  const rawRole = user?.role || 'BRANCH_ADMIN'; // BRANCH_ADMIN | HEALER | PATIENT
  const rawBranch = typeof user?.branch === 'object' && user?.branch !== null
    ? (user.branch as any).name
    : (user?.branch || 'Mumbai');
  const branchName = rawBranch.toLowerCase().includes('branch') ? rawBranch : `${rawBranch} Branch`;

  const todayStr = new Date().toISOString().split('T')[0];
  const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  // In-memory Mock data for branch sessions
  const [sessions, setSessions] = useState<HealingSession[]>([
    { 
      id: 1, 
      sessionNo: 'S-0001', 
      date: todayStr, 
      startTime: '09:00 AM', 
      endTime: '10:00 AM', 
      patient: 'Elena Gilbert', 
      healer: 'Dr. Aris Varma', 
      type: 'Pranic Psychotherapy', 
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'UPI',
      followUp: { required: true, urgency: 'Urgent' },
      notes: { treatmentType: 'Pranic Psychotherapy', observations: 'Solar plexus chakra cleared.', detailedNotes: 'Patient felt significant mental release from crown sweeps.', recommendation: 'Daily meditation logs' },
      feedback: { rating: 5, comment: 'Incredible emotional release!' }
    },
    { 
      id: 2, 
      sessionNo: 'S-0001', 
      date: todayStr, 
      startTime: '11:30 AM', 
      endTime: '12:30 PM', 
      patient: 'Stefan Salvatore', 
      healer: 'Julian Mars', 
      type: 'Advanced Pranic Healing', 
      status: 'Completed',
      paymentStatus: 'Pending',
      followUp: { required: true, urgency: 'Pending' },
      notes: { treatmentType: 'Advanced Pranic Healing', observations: 'Congestion around heart chakra.', detailedNotes: 'Energy flow stabilizing. Next alignment session strongly recommended.', recommendation: 'Salt water baths twice weekly.' }
    },
    { 
      id: 3, 
      sessionNo: 'S-0001', 
      date: todayStr, 
      startTime: '03:00 PM', 
      endTime: '04:00 PM', 
      patient: 'Bonnie Bennett', 
      healer: 'Julian Mars', 
      type: 'Basic Pranic Healing', 
      status: 'Scheduled',
      paymentStatus: 'Pending',
      followUp: { required: false, urgency: 'None' }
    },
    { 
      id: 4, 
      sessionNo: 'S-0002', 
      date: todayStr, 
      startTime: '04:30 PM', 
      endTime: '05:30 PM', 
      patient: 'Elena Gilbert', 
      healer: 'Dr. Aris Varma', 
      type: 'Crystal Healing', 
      status: 'Scheduled',
      paymentStatus: 'Pending',
      followUp: { required: true, urgency: 'Urgent' }
    },
    { 
      id: 5, 
      sessionNo: 'S-0002', 
      date: yesterdayStr, 
      startTime: '09:30 AM', 
      endTime: '10:30 AM', 
      patient: 'Stefan Salvatore', 
      healer: 'Dr. Aris Varma', 
      type: 'Pranic Psychotherapy', 
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'Cash',
      followUp: { required: false, urgency: 'None' },
      notes: { treatmentType: 'Pranic Psychotherapy', observations: 'Emotional blockages dissolved.', detailedNotes: 'Patient sleeps much better.', recommendation: 'Continue weekly psychotherapy.' }
    },
    { 
      id: 6, 
      sessionNo: 'S-0001', 
      date: yesterdayStr, 
      startTime: '01:00 PM', 
      endTime: '02:00 PM', 
      patient: 'Matt Donovan', 
      healer: 'Julian Mars', 
      type: 'Advanced Pranic Healing', 
      status: 'Cancelled',
      paymentStatus: 'Pending',
      followUp: { required: false, urgency: 'None' }
    },
    { 
      id: 7, 
      sessionNo: 'S-0001', 
      date: '2026-05-20', 
      startTime: '10:30 AM', 
      endTime: '11:30 AM', 
      patient: 'Tyler Lockwood', 
      healer: 'Dr. Aris Varma', 
      type: 'Basic Pranic Healing', 
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'UPI',
      followUp: { required: false, urgency: 'None' },
      notes: { treatmentType: 'Basic Pranic Healing', observations: 'Root chakra energized.', detailedNotes: 'Knee joint inflammation reduced.', recommendation: 'Follow-up in two weeks.' }
    },
    { 
      id: 8, 
      sessionNo: 'S-0001', 
      date: '2026-05-19', 
      startTime: '03:00 PM', 
      endTime: '04:00 PM', 
      patient: 'Jeremy Gilbert', 
      healer: 'Julian Mars', 
      type: 'Crystal Healing', 
      status: 'Completed',
      paymentStatus: 'Paid',
      paymentMethod: 'Cash',
      followUp: { required: false, urgency: 'None' },
      notes: { treatmentType: 'Crystal Healing', observations: 'Aura sweeping performed.', detailedNotes: 'Energy flow maximized.', recommendation: 'Meditation weekly' }
    },
  ]);

  // Form input states
  const [newSession, setNewSession] = useState({
    patient: '',
    healer: 'Dr. Aris Varma',
    date: todayStr,
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    type: 'Basic Pranic Healing',
    followUpRequired: false,
    followUpUrgency: 'None' as 'Urgent' | 'Pending' | 'None',
  });

  // Edit session form states
  const [editSession, setEditSession] = useState({
    patient: '',
    healer: 'Dr. Aris Varma',
    date: todayStr,
    startTime: '09:00 AM',
    endTime: '10:00 AM',
    type: 'Basic Pranic Healing',
    status: 'Scheduled' as 'Completed' | 'Scheduled' | 'Cancelled',
    paymentStatus: 'Pending' as 'Paid' | 'Pending',
    paymentMethod: 'UPI' as 'UPI' | 'Cash',
    followUpRequired: false,
    followUpUrgency: 'None' as 'Urgent' | 'Pending' | 'None',
    observations: '',
    detailedNotes: '',
    recommendation: '',
    rating: 5,
    comment: '',
  });

  // Helper: Sequentially calculate S-XXXX per patient name
  const getNextSessionNo = (patientName: string): string => {
    const patientSessions = sessions.filter(
      s => s.patient.toLowerCase().trim() === patientName.toLowerCase().trim()
    );
    const nextSeq = patientSessions.length + 1;
    return `S-${String(nextSeq).padStart(4, '0')}`;
  };

  // Add Session trigger
  const handleAddSession = () => {
    if (!newSession.patient.trim()) {
      alert('Patient name is required.');
      return;
    }

    const patientNo = getNextSessionNo(newSession.patient);
    const added: HealingSession = {
      id: Date.now(),
      sessionNo: patientNo,
      date: newSession.date,
      startTime: newSession.startTime,
      endTime: newSession.endTime,
      patient: newSession.patient.trim(),
      healer: newSession.healer,
      type: newSession.type,
      status: 'Scheduled',
      paymentStatus: 'Pending',
      followUp: {
        required: newSession.followUpRequired,
        urgency: newSession.followUpRequired ? newSession.followUpUrgency : 'None',
      },
    };

    setSessions([added, ...sessions]);
    setNewSession({
      patient: '',
      healer: 'Dr. Aris Varma',
      date: todayStr,
      startTime: '09:00 AM',
      endTime: '10:00 AM',
      type: 'Basic Pranic Healing',
      followUpRequired: false,
      followUpUrgency: 'None',
    });
    setShowAddModal(false);
    alert(`Session ${patientNo} successfully scheduled! Reminder push notification & SMS simulated to patient.`);
  };

  // Delete Session
  const handleDeleteSession = (id: number) => {
    if (window.confirm('Are you sure you want to delete this session record?')) {
      setSessions(sessions.filter(s => s.id !== id));
      alert('Session record removed.');
    }
  };

  // Save changes from Edit Session modal
  const handleEditSessionSubmit = () => {
    if (!selectedSession) return;
    if (!editSession.patient.trim()) {
      alert('Patient name is required.');
      return;
    }

    let updatedNotes = selectedSession.notes;
    if (editSession.status === 'Completed') {
      updatedNotes = {
        treatmentType: editSession.type,
        observations: editSession.observations || 'No explicit observations logged.',
        detailedNotes: editSession.detailedNotes || 'No detailed treatment logs.',
        recommendation: editSession.recommendation || 'None',
      };
    }

    setSessions(
      sessions.map((s) => {
        if (s.id === selectedSession.id) {
          // Increment healer cumulative score logic mockup
          if (editSession.status === 'Completed' && s.status !== 'Completed') {
            console.log(`Healer ${s.healer} cumulative healing count incremented.`);
          }
          return {
            ...s,
            patient: editSession.patient.trim(),
            healer: editSession.healer,
            date: editSession.date,
            startTime: editSession.startTime,
            endTime: editSession.endTime,
            type: editSession.type,
            status: editSession.status,
            paymentStatus: editSession.paymentStatus,
            paymentMethod: editSession.paymentMethod,
            followUp: {
              required: editSession.followUpRequired,
              urgency: editSession.followUpRequired ? editSession.followUpUrgency : 'None',
            },
            notes: updatedNotes,
            feedback: editSession.status === 'Completed' ? {
              rating: Number(editSession.rating),
              comment: editSession.comment.trim(),
            } : undefined,
          };
        }
        return s;
      })
    );

    setShowEditModal(false);
    setSelectedSession(null);
    alert('Session record updated successfully.');
  };

  // Mock PDF & Excel Export triggers
  const handleExport = (format: 'PDF' | 'Excel') => {
    alert(`Exporting Session Logs in ${format} format... Report will download momentarily.`);
  };

  // Filter Registry based on Scoped Roles
  const filteredSessions = sessions.filter((session) => {
    // 1. Role Scoped Restrictions
    if (rawRole === 'HEALER') {
      // Healer only sees their assigned patients' sessions
      if (session.healer !== user?.name && session.healer !== 'Dr. Aris Varma') {
        return false;
      }
    } else if (rawRole === 'PATIENT') {
      // Patient only views their own sessions
      if (session.patient.toLowerCase() !== 'elena gilbert') {
        return false;
      }
    }

    // 2. Main Search Match
    const matchesSearch =
      session.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.healer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      session.sessionNo.toLowerCase().includes(searchQuery.toLowerCase());

    // 3. Status Filters
    const matchesStatus = filterStatus === 'All' || session.status === filterStatus;

    // 4. Date Range Filters
    let matchesDate = true;
    if (dateRange === 'Today') {
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

  // Calculate dynamic totals
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
        return 'sa-badge--active'; // Green
      case 'scheduled':
        return 'sa-badge--pending'; // Orange
      case 'cancelled':
        return 'sa-badge--inactive'; // Red
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

  const getPaymentBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return 'st-panel-badge--green';
      case 'pending':
        return 'sa-badge--inactive';
      default:
        return '';
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
            <button className="sa-page__toolbar-avatar">{rawRole === 'HEALER' ? 'H' : rawRole === 'PATIENT' ? 'P' : 'BA'}</button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          
          {/* Page Title & Scoped Headers */}
          <div className="sa-page__header">
            <div className="sa-page__header-row">
              <div>
                <h1 className="sa-page__title">Session Management</h1>
                <p className="sa-page__subtitle">Book and monitor daily healing sessions for {branchName}</p>
              </div>
              <div className="sa-page__header-actions" style={{ display: 'flex', gap: '8px' }}>
                <button className="sa-btn sa-btn--outline" onClick={() => handleExport('PDF')}>
                  <IonIcon icon={downloadOutline} style={{ marginRight: '4px' }} /> PDF
                </button>
                <button className="sa-btn sa-btn--outline" onClick={() => handleExport('Excel')}>
                  <IonIcon icon={downloadOutline} style={{ marginRight: '4px' }} /> Excel
                </button>
                {rawRole !== 'PATIENT' && (
                  <button className="sa-btn sa-btn--primary" onClick={() => setShowAddModal(true)}>
                    <IonIcon icon={addOutline} style={{ marginRight: '4px' }} /> Book Session
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Core Analytics Cards */}
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

          {/* Advanced Filters Block */}
          <div className="sa-section-header" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '32px' }}>
            <div className="sa-search" style={{ margin: 0, flex: 1.5 }}>
              <IonIcon icon={searchOutline} />
              <input
                placeholder="Search by ID, patient, healer, or treatment..."
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

          {/* Directory Ledger Table */}
          <div className="sa-section" style={{ padding: 0, overflow: 'hidden', marginTop: '20px' }}>
            <div className="sa-table-responsive">
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Session ID</th>
                    <th>Patient</th>
                    <th>Healer</th>
                    <th>Treatment Type</th>
                    <th>Date &amp; Time</th>
                    <th>Status</th>
                    <th>Payment Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSessions.length > 0 ? (
                    paginatedSessions.map((session) => (
                      <tr 
                        key={session.id} 
                        style={{
                          background: session.followUp?.urgency === 'Urgent' ? '#fdf2f2' : 'transparent',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <td style={{ fontWeight: 'bold', color: 'var(--ba-color-primary)' }}>{session.sessionNo}</td>
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
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 600 }}>{session.date}</span>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>
                              {session.startTime} - {session.endTime}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className={`sa-badge ${getStatusBadgeClass(session.status)}`} style={{ gap: '4px' }}>
                            <IonIcon icon={getStatusIcon(session.status)} style={{ fontSize: '14px' }} />
                            {session.status}
                          </span>
                        </td>
                        <td>
                          <span className={`st-panel-badge ${getPaymentBadgeClass(session.paymentStatus)}`}>
                            {session.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {/* View Notes */}
                            <button
                              className="pa-doc-action-btn"
                              title="View Observations"
                              onClick={() => {
                                history.push(`/branch-admin/sessions/detail/${session.id}`);
                              }}
                            >
                              <IonIcon icon={eyeOutline} />
                            </button>

                            {/* Edit Session Scoped for non-patients */}
                            {rawRole !== 'PATIENT' && (
                              <button
                                className="pa-doc-action-btn"
                                title="Edit Session"
                                onClick={() => {
                                  setSelectedSession(session);
                                  setEditSession({
                                    patient: session.patient,
                                    healer: session.healer,
                                    date: session.date,
                                    startTime: session.startTime,
                                    endTime: session.endTime,
                                    type: session.type,
                                    status: session.status,
                                    paymentStatus: session.paymentStatus,
                                    paymentMethod: session.paymentMethod || 'UPI',
                                    followUpRequired: session.followUp?.required || false,
                                    followUpUrgency: session.followUp?.urgency || 'None',
                                    observations: session.notes?.observations || '',
                                    detailedNotes: session.notes?.detailedNotes || '',
                                    recommendation: session.notes?.recommendation || '',
                                    rating: session.feedback?.rating || 5,
                                    comment: session.feedback?.comment || '',
                                  });
                                  setShowEditModal(true);
                                }}
                              >
                                <IonIcon icon={pencilOutline} style={{ color: '#6366f1' }} />
                              </button>
                            )}

                            {/* Delete Action Scoped for Admins */}
                            {rawRole === 'BRANCH_ADMIN' && (
                              <button
                                className="pa-doc-action-btn pa-doc-action-btn--delete"
                                title="Delete Session"
                                onClick={() => handleDeleteSession(session.id)}
                              >
                                <IonIcon icon={trashOutline} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '40px 0' }}>
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

            {/* Pagination Controls */}
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

      {/* ── MODAL: BOOK HEALING SESSION ────────────────────────────── */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Book Healing Session</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowAddModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Patient Name *</label>
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

            {/* Follow-up flag toggle */}
            <div style={{ marginTop: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="followUpRequired" 
                  checked={newSession.followUpRequired} 
                  onChange={(e) => setNewSession({ ...newSession, followUpRequired: e.target.checked })} 
                />
                <label htmlFor="followUpRequired" style={{ fontWeight: 'bold', fontSize: '13px', color: '#334155' }}>
                  Mark Follow-up Required
                </label>
              </div>

              {newSession.followUpRequired && (
                <div className="sa-settings__form-group" style={{ marginTop: '10px' }}>
                  <label className="sa-settings__label">Follow-up Urgency</label>
                  <select 
                    className="sa-input"
                    value={newSession.followUpUrgency}
                    onChange={(e) => setNewSession({ ...newSession, followUpUrgency: e.target.value as any })}
                  >
                    <option value="None">None</option>
                    <option value="Pending">Pending (Orange)</option>
                    <option value="Urgent">Urgent (Red)</option>
                  </select>
                </div>
              )}
            </div>

          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleAddSession}>Book Session</button>
          </div>
        </div>
      </IonModal>

      {/* ── MODAL: EDIT HEALING SESSION ────────────────────────────── */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Edit Healing Session</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowEditModal(false)}>×</button>
          </div>
          <div className="sa-modal__body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Patient Name *</label>
              <input
                className="sa-input"
                placeholder="Full Name"
                value={editSession.patient}
                onChange={(e) => setEditSession({ ...editSession, patient: e.target.value })}
              />
            </div>

            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Assigned Healer</label>
              <select
                className="sa-input"
                value={editSession.healer}
                onChange={(e) => setEditSession({ ...editSession, healer: e.target.value })}
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
                  value={editSession.type}
                  onChange={(e) => setEditSession({ ...editSession, type: e.target.value })}
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
                  value={editSession.date}
                  onChange={(e) => setEditSession({ ...editSession, date: e.target.value })}
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
                  value={editSession.startTime}
                  onChange={(e) => setEditSession({ ...editSession, startTime: e.target.value })}
                />
              </div>

              <div className="sa-settings__form-group">
                <label className="sa-settings__label">End Time</label>
                <input
                  type="text"
                  className="sa-input"
                  placeholder="10:00 AM"
                  value={editSession.endTime}
                  onChange={(e) => setEditSession({ ...editSession, endTime: e.target.value })}
                />
              </div>
            </div>

            <div className="sa-settings__form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Session Status</label>
                <select
                  className="sa-input"
                  value={editSession.status}
                  onChange={(e) => setEditSession({ ...editSession, status: e.target.value as any })}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Payment Status</label>
                <select
                  className="sa-input"
                  value={editSession.paymentStatus}
                  onChange={(e) => setEditSession({ ...editSession, paymentStatus: e.target.value as any })}
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {editSession.paymentStatus === 'Paid' && (
              <div className="sa-settings__form-group" style={{ marginTop: '12px' }}>
                <label className="sa-settings__label">Payment Method</label>
                <select
                  className="sa-input"
                  value={editSession.paymentMethod}
                  onChange={(e) => setEditSession({ ...editSession, paymentMethod: e.target.value as any })}
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>
            )}

            {/* Follow-up flag toggle */}
            <div style={{ marginTop: '16px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="editFollowUpRequired" 
                  checked={editSession.followUpRequired} 
                  onChange={(e) => setEditSession({ ...editSession, followUpRequired: e.target.checked })} 
                />
                <label htmlFor="editFollowUpRequired" style={{ fontWeight: 'bold', fontSize: '13px', color: '#334155' }}>
                  Mark Follow-up Required
                </label>
              </div>

              {editSession.followUpRequired && (
                <div className="sa-settings__form-group" style={{ marginTop: '10px' }}>
                  <label className="sa-settings__label">Follow-up Urgency</label>
                  <select 
                    className="sa-input"
                    value={editSession.followUpUrgency}
                    onChange={(e) => setEditSession({ ...editSession, followUpUrgency: e.target.value as any })}
                  >
                    <option value="None">None</option>
                    <option value="Pending">Pending (Orange)</option>
                    <option value="Urgent">Urgent (Red)</option>
                  </select>
                </div>
              )}
            </div>

            {/* observations Notes panel if Completed */}
            {editSession.status === 'Completed' && (
              <div style={{ marginTop: '16px', background: '#ecfdf5', padding: '16px', borderRadius: '8px', border: '1px solid #a7f3d0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <h4 style={{ margin: 0, color: '#0d5c46', fontSize: '13px', fontWeight: 800 }}>Clinical Healing Records</h4>
                
                <div className="sa-settings__form-group">
                  <label className="sa-settings__label" style={{ color: '#0d5c46' }}>Healing Observations</label>
                  <textarea 
                    className="sa-input" 
                    rows={2} 
                    value={editSession.observations}
                    onChange={(e) => setEditSession({ ...editSession, observations: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label" style={{ color: '#0d5c46' }}>Detailed Clinical Notes</label>
                  <textarea 
                    className="sa-input" 
                    rows={2} 
                    value={editSession.detailedNotes}
                    onChange={(e) => setEditSession({ ...editSession, detailedNotes: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label" style={{ color: '#0d5c46' }}>Next Recommendations</label>
                  <input 
                    type="text"
                    className="sa-input" 
                    value={editSession.recommendation}
                    onChange={(e) => setEditSession({ ...editSession, recommendation: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label" style={{ color: '#0d5c46' }}>Feedback Stars</label>
                  <div style={{ display: 'flex', gap: '6px', fontSize: '20px', color: '#f59e0b', marginTop: '2px' }}>
                    {[1, 2, 3, 4, 5].map((starVal) => (
                      <IonIcon
                        key={starVal}
                        icon={starVal <= editSession.rating ? star : starOutline}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setEditSession({ ...editSession, rating: starVal })}
                      />
                    ))}
                  </div>
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label" style={{ color: '#0d5c46' }}>Feedback Comments</label>
                  <input 
                    type="text"
                    className="sa-input" 
                    value={editSession.comment}
                    onChange={(e) => setEditSession({ ...editSession, comment: e.target.value })}
                  />
                </div>
              </div>
            )}

          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleEditSessionSubmit}>Save Changes</button>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
};

export default SessionsPage;
