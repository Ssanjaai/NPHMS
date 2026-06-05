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

      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 2);
      const dayAfterStr = dayAfter.toISOString().split('T')[0];

      upcomingList = [
        {
          id: Date.now() - 3600000 * 2, // Booked 2 hours ago
          sessionNo: 'SESS-2041',
          date: tomorrowStr,
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          patient: patientName,
          healer: currentHealer,
          type: 'Advanced Pranic Healing',
          status: 'Scheduled'
        },
        {
          id: Date.now() - 3600000 * 24, // Booked 24 hours ago
          sessionNo: 'SESS-2048',
          date: dayAfterStr,
          startTime: '04:30 PM',
          endTime: '05:30 PM',
          patient: patientName,
          healer: currentHealer,
          type: 'Pranic Psychotherapy',
          status: 'Scheduled'
        }
      ];
    }
    setUpcomingSessions(upcomingList);

    // 3. Load feedbacks to check which completed sessions need reviews
    const savedFeedbacks = localStorage.getItem('phms_feedbacks') || '[]';
    try {
      const feedbacks = JSON.parse(savedFeedbacks);
      const feedbackSessionIds = feedbacks.map((f: any) => f.sessionId);
      
      const pendingFeedback = completedList.filter(s => !feedbackSessionIds.includes(s.id));
      setFeedbackReminders(pendingFeedback);
    } catch (e) {
      console.error(e);
    }

    // 4. Load Billing summary
    const savedPayments = localStorage.getItem('phms_patient_payments');
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
            <button className="sa-page__toolbar-avatar" onClick={() => history.push('/patient/profile')} style={{ overflow: 'hidden', padding: 0 }}>
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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
          <div className="dm-access-card" style={{ marginBottom: '28px', background: 'linear-gradient(135deg, #0f766e 0%, #115e59 100%)' }}>
            <div className="dm-access-card__header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <IonIcon icon={leafOutline} style={{ fontSize: '28px', color: '#a7f3d0' }} />
              <h2 className="dm-access-card__title" style={{ fontSize: '22px', margin: 0 }}>Namaste, {resolvedPatientName}!</h2>
            </div>
            <p style={{ color: '#e2f5f1', fontSize: '15px', margin: '12px 0 20px 0', lineHeight: 1.5 }}>
              Welcome back to your personalized healing dashboard. Manage your sessions, connect with healers, and upload medical files.
            </p>
            <div className="dm-access-branch-box" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.15)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span className="dm-access-branch-label" style={{ color: '#a7f3d0' }}>YOUR REGISTERED BRANCH</span>
                <span className="dm-access-branch-val" style={{ color: 'white', display: 'block', marginTop: '4px' }}>{branchName}</span>
              </div>
              <div style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: '20px' }}>
                <span className="dm-access-branch-label" style={{ color: '#a7f3d0' }}>YOUR ASSIGNED HEALER</span>
                <span className="dm-access-branch-val" style={{ color: 'white', display: 'block', marginTop: '4px' }}>{assignedHealer}</span>
              </div>
            </div>
          </div>

          {/* Feedback Reminder Widget */}
          {feedbackReminders.length > 0 && (
            <div 
              className="healer-alert-widget" 
              style={{ cursor: 'pointer', marginBottom: '24px' }}
              onClick={() => history.push('/patient/feedback')}
            >
              <div className="healer-alert-widget__left">
                <IonIcon icon={chatboxOutline} className="healer-alert-widget__icon" style={{ color: '#ea580c' }} />
                <div>
                  <h4 className="healer-alert-widget__title" style={{ color: '#c2410c' }}>Pending Session Feedback</h4>
                  <p className="healer-alert-widget__desc" style={{ color: '#ea580c' }}>
                    You have {feedbackReminders.length} completed session{feedbackReminders.length > 1 ? 's' : ''} awaiting your rating and feedback.
                  </p>
                </div>
              </div>
              <span className="healer-alert-widget__count" style={{ background: '#ea580c' }}>{feedbackReminders.length}</span>
            </div>
          )}

          {/* Dashboard Columns Layout */}
          <div className="healer-profile-grid">
            
            {/* Left Sidebar Column */}
            <div className="healer-profile-left-col">
              
              {/* Progress Overview */}
              <AppCard padding="large" shadow>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0' }}>
                  Healing Progress
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0' }}>
                  <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: '#64748b' }}>Sessions Conducted</span>
                      <strong style={{ color: '#0f766e' }}>{completedSessions.length} / {targetSessions}</strong>
                    </div>
                    
                    <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${progressPercent}%`, height: '100%', background: '#0f766e', borderRadius: '5px', transition: 'width 0.3s ease' }}></div>
                    </div>

                    <span style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'right', display: 'block' }}>
                      {progressPercent}% completed
                    </span>
                  </div>
                </div>
              </AppCard>

              {/* Payment Summary */}
              <AppCard padding="large" shadow>
                <div className="healer-card-header-with-action">
                  <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                    Payment Summary
                  </h3>
                  <button className="healer-card-edit-btn" onClick={() => history.push('/patient/payments')}>
                    <IonIcon icon={chevronForwardOutline} /> View
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#64748b' }}>Total Billed</span>
                    <strong style={{ color: '#1e293b' }}>₹{totalBilled.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#64748b' }}>Total Paid</span>
                    <strong style={{ color: '#16a34a' }}>₹{totalPaid.toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', paddingTop: '8px', borderTop: '1px dashed #e2e8f0' }}>
                    <span style={{ color: '#64748b', fontWeight: '700' }}>Outstanding</span>
                    <strong style={{ color: outstandingBalance > 0 ? '#dc2626' : '#1e293b', fontWeight: '700' }}>₹{outstandingBalance.toLocaleString()}</strong>
                  </div>
                </div>
              </AppCard>

              {/* Quick Navigation Panel */}
              <AppCard padding="large" shadow>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0' }}>
                  Quick Shortcuts
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button 
                    onClick={() => history.push('/patient/health-records')}
                    style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                      <IonIcon icon={documentTextOutline} style={{ color: '#0f766e', fontSize: '18px' }} />
                      View Health Records
                    </div>
                    <IonIcon icon={chevronForwardOutline} style={{ color: '#94a3b8' }} />
                  </button>

                  <button 
                    onClick={() => history.push('/patient/session-history')}
                    style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', textAlign: 'left' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                      <IonIcon icon={timeOutline} style={{ color: '#0f766e', fontSize: '18px' }} />
                      View Session Notes
                    </div>
                    <IonIcon icon={chevronForwardOutline} style={{ color: '#94a3b8' }} />
                  </button>
                </div>
              </AppCard>

            </div>

            {/* Right Main Column */}
            <div className="healer-profile-right-col">
              
              {/* Upcoming Healing Sessions */}
              <AppCard padding="large" shadow>
                <div className="healer-card-header-with-action">
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                    Upcoming Scheduled Sessions
                  </h3>
                  <button className="healer-card-edit-btn" onClick={() => history.push('/patient/session-history')}>
                    View All
                  </button>
                </div>

                {upcomingSessions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 16px', color: '#94a3b8' }}>
                    <IonIcon icon={calendarOutline} style={{ fontSize: '40px', opacity: 0.3, marginBottom: '8px' }} />
                    <p style={{ margin: 0, fontSize: '14px' }}>No upcoming sessions scheduled.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                    {upcomingSessions.map((session) => (
                      <div 
                        key={session.id}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafb', border: '1px solid #e2e8f0', padding: '14px', borderRadius: '10px' }}
                      >
                        <div>
                          <strong style={{ fontSize: '14px', color: '#1e293b' }}>{session.sessionNo} • {session.type}</strong>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                            <span>Healer: <strong>{session.healer}</strong></span>
                            <span>Slot: <strong>{session.startTime}</strong></span>
                            <span>Created: <strong>{new Date(session.id).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f766e', background: '#e2f5f1', padding: '4px 10px', borderRadius: '6px' }}>
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
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 12px 0' }}>
                  Recent Session Notes & Recommendation
                </h3>

                {!lastSessionNote ? (
                  <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8' }}>
                    <IonIcon icon={documentTextOutline} style={{ fontSize: '40px', opacity: 0.3, marginBottom: '8px' }} />
                    <p style={{ margin: 0, fontSize: '14px' }}>No session logs available.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Session metadata summary */}
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                      <span style={{ fontSize: '12px', color: '#475569' }}>Session: <strong>{lastSessionNote.sessionNo}</strong></span>
                      <span style={{ fontSize: '12px', color: '#475569' }}>Modality: <strong>{lastSessionNote.type}</strong></span>
                      <span style={{ fontSize: '12px', color: '#475569' }}>Date Conducted: <strong>{lastSessionNote.date}</strong></span>
                      <span style={{ fontSize: '12px', color: '#475569' }}>Healer: <strong>{lastSessionNote.healer}</strong></span>
                      <span style={{ fontSize: '12px', color: '#475569' }}>Created: <strong>{new Date(lastSessionNote.id).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</strong></span>
                    </div>

                    {/* Observations */}
                    <div>
                      <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#0f766e', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 6px 0' }}>
                        Healer Observations
                      </h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#334155', lineHeight: 1.5, background: '#fafafb', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #0f766e' }}>
                        {lastSessionNote.notes?.observations && lastSessionNote.notes.observations !== '—' 
                          ? lastSessionNote.notes.observations 
                          : 'No observations logged.'
                        }
                      </p>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h4 style={{ fontSize: '12px', fontWeight: '800', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 6px 0' }}>
                        Wellness Recommendations
                      </h4>
                      <p style={{ margin: 0, fontSize: '13px', color: '#5b21b6', lineHeight: 1.5, background: '#faf8fc', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #7c3aed', fontWeight: '500' }}>
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
