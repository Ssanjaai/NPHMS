import React from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonIcon,
} from '@ionic/react';
import {
  documentTextOutline,
  medkitOutline,
  personOutline,
  calendarOutline,
  chevronForwardOutline,
  leafOutline,
  cashOutline,
  chatboxOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  timeOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../../store/auth.store';
import { useHistory } from 'react-router-dom';
import AppCard from '../../components/common/AppCard';
import '../branch-admin/branch-admin.css';
import '../healer/Healers.css';
import './Patient.css';

interface Session {
  id: number;
  sessionNo: string;
  date: string;
  startTime: string;
  endTime: string;
  patient: string;
  healer: string;
  type: string;
  status: 'Completed' | 'Scheduled' | 'Cancelled';
  notes?: {
    treatmentType: string;
    observations: string;
    detailedNotes: string;
    recommendation: string;
  };
}

const PatientDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const history = useHistory();

  const userName = user?.name || 'Valued Patient';
  const userEmail = user?.email || 'patient@phms.com';
  
  const rawBranch = typeof user?.branch === 'object' && user?.branch !== null
    ? (user.branch as any).name
    : (user?.branch || 'Mumbai Main');
  const branchName = rawBranch.toLowerCase().includes('branch') ? rawBranch : `${rawBranch} Branch`;

  // States
  const [resolvedPatientName, setResolvedPatientName] = React.useState(userName);
  const [patientStatus, setPatientStatus] = React.useState('Active');
  const [assignedHealer, setAssignedHealer] = React.useState('Dr. Shailesh');
  const [completedSessions, setCompletedSessions] = React.useState<Session[]>([]);
  const [upcomingSessions, setUpcomingSessions] = React.useState<Session[]>([]);
  const [feedbackReminders, setFeedbackReminders] = React.useState<Session[]>([]);
  
  // Payment Stats
  const [totalBilled, setTotalBilled] = React.useState(0);
  const [totalPaid, setTotalPaid] = React.useState(0);
  const [outstandingBalance, setOutstandingBalance] = React.useState(0);

  React.useEffect(() => {
    // 1. Resolve Patient Name and Status
    let patientName = userName;
    let currentHealer = 'Dr. Shailesh';
    const savedPatients = localStorage.getItem('phms_patients');
    if (savedPatients) {
      try {
        const parsed = JSON.parse(savedPatients);
        const found = parsed.find((p: any) => p.email?.toLowerCase() === userEmail.toLowerCase());
        if (found) {
          patientName = found.name;
          setResolvedPatientName(found.name);
          setPatientStatus(found.status || 'Active');
          currentHealer = found.assignedHealer || 'Dr. Shailesh';
          setAssignedHealer(currentHealer);
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Load and filter sessions
    const savedSessions = localStorage.getItem('phms_sessions');
    let completedList: Session[] = [];
    let upcomingList: Session[] = [];
    
    if (savedSessions) {
      try {
        const parsed: Session[] = JSON.parse(savedSessions);
        const patientSessions = parsed.filter(
          (s) => s.patient?.toLowerCase().trim() === patientName.toLowerCase().trim()
        );
        
        completedList = patientSessions.filter(s => s.status === 'Completed');
        // Sort by date/time descending
        completedList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        upcomingList = patientSessions.filter(s => s.status === 'Scheduled');
        // Sort by date ascending
        upcomingList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      } catch (e) {
        console.error(e);
      }
    }

    // Fallback/Sample data for completed sessions if empty
    if (completedList.length === 0) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      completedList = [
        {
          id: Date.now() - 3600000 * 48, // Booked 2 days ago
          sessionNo: 'SESS-2035',
          date: yesterdayStr,
          startTime: '11:00 AM',
          endTime: '12:00 PM',
          patient: patientName,
          healer: currentHealer,
          type: 'Basic Pranic Healing',
          status: 'Completed',
          notes: {
            treatmentType: 'Basic Pranic Healing',
            observations: 'Patient reported moderate stress levels and shoulder tension. Performed aura cleansing and energized the solar plexus and throat chakras. Patient felt lighter immediately after the session.',
            detailedNotes: 'Energized project area.',
            recommendation: 'Perform soft breathing exercises daily in the morning. Hydrate well and walk in nature twice a day.'
          }
        }
      ];
    }
    setCompletedSessions(completedList);

    // Fallback/Sample data for upcoming sessions if empty
    if (upcomingList.length === 0) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      upcomingList = [
        {
          id: Date.now() + 3600000 * 24, // Booked 1 day in future
          sessionNo: 'SESS-2036',
          date: tomorrowStr,
          startTime: '04:00 PM',
          endTime: '05:00 PM',
          patient: patientName,
          healer: currentHealer,
          type: 'Basic Pranic Healing',
          status: 'Scheduled'
        }
      ];
    }
    setUpcomingSessions(upcomingList);

    // 3. Feedback reminders filtering (completed sessions not reviewed yet)
    const savedReviews = localStorage.getItem('phms_reviews') || '[]';
    try {
      const reviews = JSON.parse(savedReviews);
      const reviewedSessionIds = new Set(reviews.map((r: any) => Number(r.sessionId)));
      const pendingReviews = completedList.filter(s => !reviewedSessionIds.has(s.id));
      setFeedbackReminders(pendingReviews);
    } catch (e) {
      console.error(e);
    }

    // 4. Load Payments Data
    const savedPayments = localStorage.getItem('phms_payments');
    if (savedPayments) {
      try {
        const parsed = JSON.parse(savedPayments);
        const patientPayments = parsed.filter(
          (p: any) => p.patientName?.toLowerCase().trim() === patientName.toLowerCase().trim()
        );
        const billed = patientPayments.reduce((sum: number, item: any) => sum + (item.totalBilled || 0), 0);
        const paid = patientPayments.reduce((sum: number, item: any) => sum + (item.paid || 0), 0);
        const outstanding = patientPayments.reduce((sum: number, item: any) => sum + (item.outstanding || 0), 0);

        setTotalBilled(billed);
        setTotalPaid(paid);
        setOutstandingBalance(outstanding);
      } catch (e) {
        console.error(e);
      }
    }
  }, [userEmail, userName]);

  // Dynamic Progress calculation (completed vs total planned, fallback e.g. target 10 sessions)
  const targetSessions = 10;
  const progressPercent = Math.min(Math.round((completedSessions.length / targetSessions) * 100), 100);

  // Last completed session note
  const lastSessionNote = completedSessions[0];

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Patient Portal</IonTitle>
          <IonButtons slot="end">
            <button className="sa-page__toolbar-avatar pat-toolbar-avatar" onClick={() => history.push('/patient/profile')}>
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="pat-avatar-img" />
              ) : (
                resolvedPatientName[0].toUpperCase()
              )}
            </button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="healer-container">
          
          {/* Welcome Card */}
          <div className="dm-access-card pat-welcome-card">
            <div className="dm-access-card__header pat-welcome-header">
              <IonIcon icon={leafOutline} className="pat-welcome-icon" />
              <h2 className="dm-access-card__title pat-welcome-title">Namaste, {resolvedPatientName}!</h2>
            </div>
            <p className="pat-welcome-subtitle">
              Welcome back to your personalized healing dashboard. Manage your sessions, connect with healers, and upload medical files.
            </p>
            <div className="dm-access-branch-box pat-welcome-details-box">
              <div>
                <span className="dm-access-branch-label pat-detail-label">YOUR REGISTERED BRANCH</span>
                <span className="dm-access-branch-val pat-detail-val">{branchName}</span>
              </div>
              <div className="pat-details-divider">
                <span className="dm-access-branch-label pat-detail-label">YOUR ASSIGNED HEALER</span>
                <span className="dm-access-branch-val pat-detail-val">{assignedHealer}</span>
              </div>
            </div>
          </div>

          {/* Feedback Reminder Widget */}
          {feedbackReminders.length > 0 && (
            <div 
              className="healer-alert-widget pat-alert-widget" 
              onClick={() => history.push('/patient/feedback')}
            >
              <div className="healer-alert-widget__left">
                <IonIcon icon={chatboxOutline} className="healer-alert-widget__icon pat-alert-icon" />
                <div>
                  <h4 className="healer-alert-widget__title pat-alert-title">Pending Session Feedback</h4>
                  <p className="healer-alert-widget__desc pat-alert-desc">
                    You have {feedbackReminders.length} completed session{feedbackReminders.length > 1 ? 's' : ''} awaiting your rating and feedback.
                  </p>
                </div>
              </div>
              <span className="healer-alert-widget__count pat-alert-count">{feedbackReminders.length}</span>
            </div>
          )}

          {/* Dashboard Columns Layout */}
          <div className="healer-profile-grid">
            
            {/* Left Sidebar Column */}
            <div className="healer-profile-left-col">
              
              {/* Progress Overview */}
              <AppCard padding="large" shadow>
                <h3 className="pat-card-title">
                  Healing Progress
                </h3>

                <div className="pat-progress-container">
                  <div className="pat-progress-inner">
                    <div className="pat-progress-header">
                      <span className="pat-progress-label">Sessions Conducted</span>
                      <strong className="pat-progress-val">{completedSessions.length} / {targetSessions}</strong>
                    </div>
                    
                    <div className="pat-progress-bar-bg">
                      <div className="pat-progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
                    </div>

                    <span className="pat-progress-subtext">
                      {progressPercent}% completed
                    </span>
                  </div>
                </div>
              </AppCard>

              {/* Payment Summary */}
              <AppCard padding="large" shadow>
                <div className="healer-card-header-with-action">
                  <h3 className="pat-card-title-no-margin">
                    Payment Summary
                  </h3>
                  <button className="healer-card-edit-btn" onClick={() => history.push('/patient/payments')}>
                    <IonIcon icon={chevronForwardOutline} /> View
                  </button>
                </div>

                <div className="pat-payment-details-list">
                  <div className="pat-payment-row">
                    <span className="pat-payment-label">Total Billed</span>
                    <strong className="pat-payment-value-dark">₹{totalBilled.toLocaleString()}</strong>
                  </div>
                  <div className="pat-payment-row">
                    <span className="pat-payment-label">Total Paid</span>
                    <strong className="pat-payment-value-green">₹{totalPaid.toLocaleString()}</strong>
                  </div>
                  <div className="pat-payment-row-total">
                    <span className="pat-payment-label-bold">Outstanding</span>
                    <strong className={outstandingBalance > 0 ? 'pat-color-red' : 'pat-payment-value-dark'}>₹{outstandingBalance.toLocaleString()}</strong>
                  </div>
                </div>
              </AppCard>

              {/* Quick Navigation Panel */}
              <AppCard padding="large" shadow>
                <h3 className="pat-card-title">
                  Quick Shortcuts
                </h3>
                
                <div className="pat-vertical-list-12">
                  <button 
                    onClick={() => history.push('/patient/health-records')}
                    className="pat-menu-item-btn"
                  >
                    <div className="pat-menu-item-content">
                      <IonIcon icon={documentTextOutline} className="pat-menu-item-icon" />
                      View Health Records
                    </div>
                    <IonIcon icon={chevronForwardOutline} className="pat-chevron-icon" />
                  </button>

                  <button 
                    onClick={() => history.push('/patient/session-history')}
                    className="pat-menu-item-btn"
                  >
                    <div className="pat-menu-item-content">
                      <IonIcon icon={timeOutline} className="pat-menu-item-icon" />
                      View Session Notes
                    </div>
                    <IonIcon icon={chevronForwardOutline} className="pat-chevron-icon" />
                  </button>
                </div>
              </AppCard>

            </div>

            {/* Right Main Column */}
            <div className="healer-profile-right-col">
              
              {/* Upcoming Healing Sessions */}
              <AppCard padding="large" shadow>
                <div className="healer-card-header-with-action">
                  <h3 className="pat-section-title-no-margin">
                    Upcoming Scheduled Sessions
                  </h3>
                  <button className="healer-card-edit-btn" onClick={() => history.push('/patient/session-history')}>
                    View All
                  </button>
                </div>

                {upcomingSessions.length === 0 ? (
                  <div className="pat-empty-state-container">
                    <IonIcon icon={calendarOutline} className="pat-empty-state-icon" />
                    <p className="pat-empty-state-text">No upcoming sessions scheduled.</p>
                  </div>
                ) : (
                  <div className="pat-vertical-list-12-mt12">
                    {upcomingSessions.map((session) => (
                      <div 
                        key={session.id}
                        className="pat-session-list-item"
                      >
                        <div>
                          <strong className="pat-session-title">{session.sessionNo} • {session.type}</strong>
                          <div className="pat-session-meta">
                            <span>Healer: <strong>{session.healer}</strong></span>
                            <span>Slot: <strong>{session.startTime}</strong></span>
                            <span>Created: <strong>{new Date(session.id).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                          </div>
                        </div>

                        <div className="pat-text-right">
                          <span className="pat-session-status-badge">
                            {session.date}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AppCard>

              {/* Recent Session Notes */}
              <AppCard padding="large" shadow>
                <h3 className="pat-card-title-16">
                  Recent Session Notes & Recommendation
                </h3>

                {!lastSessionNote ? (
                  <div className="pat-empty-state-container-32">
                    <IonIcon icon={documentTextOutline} className="pat-empty-state-icon" />
                    <p className="pat-empty-state-text">No session logs available.</p>
                  </div>
                ) : (
                  <div className="pat-vertical-list-16">
                    
                    {/* Session metadata summary */}
                    <div className="pat-session-meta-panel">
                      <span className="pat-session-meta-item">Session: <strong>{lastSessionNote.sessionNo}</strong></span>
                      <span className="pat-session-meta-item">Modality: <strong>{lastSessionNote.type}</strong></span>
                      <span className="pat-session-meta-item">Date Conducted: <strong>{lastSessionNote.date}</strong></span>
                      <span className="pat-session-meta-item">Healer: <strong>{lastSessionNote.healer}</strong></span>
                      <span className="pat-session-meta-item">Created: <strong>{new Date(lastSessionNote.id).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                    </div>

                    {/* Observations */}
                    <div>
                      <h4 className="pat-note-section-title-teal">
                        Healer Observations
                      </h4>
                      <p className="pat-note-text-teal">
                        {lastSessionNote.notes?.observations && lastSessionNote.notes.observations !== '—' 
                          ? lastSessionNote.notes.observations 
                          : 'No observations logged.'
                        }
                      </p>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 className="pat-note-section-title-purple">
                        Wellness Recommendations
                      </h4>
                      <p className="pat-note-text-purple">
                        {lastSessionNote.notes?.recommendation && lastSessionNote.notes.recommendation !== '—' 
                          ? lastSessionNote.notes.recommendation 
                          : 'Ensure regular practice of physical exercises and meditation as advised.'
                        }
                      </p>
                    </div>

                  </div>
                )}
              </AppCard>

            </div>

          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default PatientDashboardPage;
