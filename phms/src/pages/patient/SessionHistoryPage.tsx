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
  IonModal,
} from '@ionic/react';
import {
  timeOutline,
  arrowBackOutline,
  personOutline,
  calendarOutline,
  leafOutline,
  documentTextOutline,
  closeOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import AppCard from '../../components/common/AppCard';
import '../branch-admin/branch-admin.css';
import '../healer/Healers.css';
import './Patient.css';

interface HealingSession {
  id: number;
  sessionNo: string;
  date: string;
  startTime: string;
  endTime: string;
  patient: string;
  healer: string;
  type: string;
  status: 'Completed' | 'Scheduled' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending';
  notes?: {
    treatmentType: string;
    observations: string;
    detailedNotes: string;
    recommendation: string;
  };
}

const SessionHistoryPage: React.FC = () => {
  const history = useHistory();
  const { user } = useAuthStore();

  const userName = user?.name || 'Valued Patient';
  const userEmail = user?.email || 'patient@phms.com';

  const [sessions, setSessions] = React.useState<HealingSession[]>([]);
  const [selectedSession, setSelectedSession] = React.useState<HealingSession | null>(null);

  // Load sessions from localStorage
  React.useEffect(() => {
    // 1. Resolve patient name
    let patientName = userName;
    let currentHealer = 'Dr. Shailesh';
    const savedPatients = localStorage.getItem('phms_patients');
    if (savedPatients) {
      try {
        const parsed = JSON.parse(savedPatients);
        const found = parsed.find((p: any) => p.email?.toLowerCase() === userEmail.toLowerCase());
        if (found) {
          patientName = found.name;
          currentHealer = found.assignedHealer || 'Dr. Shailesh';
        }
      } catch (e) {
        console.error(e);
      }
    }

    // 2. Load sessions matching patientName
    const savedSessions = localStorage.getItem('phms_sessions');
    let filtered: HealingSession[] = [];
    if (savedSessions) {
      try {
        const parsed: HealingSession[] = JSON.parse(savedSessions);
        filtered = parsed.filter(
          (s) => s.patient?.toLowerCase().trim() === patientName.toLowerCase().trim()
        );
      } catch (e) {
        console.error(e);
      }
    }

    // Fallback/Sample data for session history if empty
    if (filtered.length === 0) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      filtered = [
        {
          id: Date.now() - 3600000 * 2, // Booked 2 hours ago
          sessionNo: 'SESS-2041',
          date: tomorrowStr,
          startTime: '10:00 AM',
          endTime: '11:00 AM',
          patient: patientName,
          healer: currentHealer,
          type: 'Advanced Pranic Healing',
          status: 'Scheduled',
          paymentStatus: 'Pending'
        },
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
          paymentStatus: 'Paid',
          notes: {
            treatmentType: 'Basic Pranic Healing',
            observations: 'Patient reported moderate stress levels and shoulder tension. Performed aura cleansing and energized the solar plexus and throat chakras. Patient felt lighter immediately after the session.',
            detailedNotes: 'Successfully completed the basic chakra alignment protocol. Cleansed both front and back solar plexus chakras. Energized the throat chakra to ease communication blockages.',
            recommendation: 'Perform soft breathing exercises daily in the morning. Hydrate well and walk in nature twice a day.'
          }
        }
      ];
    }

    // Sort by date/time descending
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setSessions(filtered);
  }, [userEmail, userName]);

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <button className="healer-back-btn" onClick={() => history.push('/patient/dashboard')}>
              <IonIcon icon={arrowBackOutline} />
            </button>
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Healing Sessions History</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="healer-container pat-container-narrow-900">
          
          <div className="healer-header-box">
            <h1 className="healer-page-title">Session History</h1>
            <p className="healer-page-subtitle">
              Track your complete healing timeline. View notes and recommendations logged by your assigned healer.
            </p>
          </div>

          <AppCard padding="large" shadow>
            <h3 className="pat-card-title-16-m16">
              My Healing Sessions ({sessions.length})
            </h3>

            {sessions.length === 0 ? (
              <div className="pat-empty-state-container-40">
                <IonIcon icon={timeOutline} className="pat-empty-state-icon-large" />
                <p className="pat-empty-state-text-no-size">No session logs found on your account.</p>
              </div>
            ) : (
              <div className="pat-vertical-list-16">
                {sessions.map((session) => (
                  <div 
                    key={session.id}
                    className="pat-session-card"
                  >
                    <div className="pat-session-card-header">
                      <div>
                        <div className="pat-flex-align-center-gap8">
                          <strong className="pat-session-card-title-text">{session.sessionNo}</strong>
                          <span className="pat-session-badge-teal">
                            {session.type}
                          </span>
                        </div>
                        
                        <p className="pat-session-card-healer-line">
                          <IonIcon icon={personOutline} className="pat-icon-teal-0d" /> Healer: <strong>{session.healer}</strong>
                        </p>
                        
                        <p className="pat-session-card-date-line">
                          <IonIcon icon={calendarOutline} className="pat-icon-teal-0d" /> Conducted: <strong>{session.date} • {session.startTime} - {session.endTime}</strong>
                        </p>
                      </div>

                      <div className="pat-flex-col-align-end-gap8">
                        <span className={`healer-status-badge ${
                          session.status === 'Completed' ? 'healer-status-badge--completed' : 'healer-status-badge--scheduled'
                        }`}>
                          {session.status}
                        </span>

                        {session.status === 'Completed' && (
                          <button 
                            className="healer-photo-upload-btn pat-view-notes-btn"
                            onClick={() => setSelectedSession(session)}
                          >
                            View Notes & Advice
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AppCard>

        </div>

        {/* Detailed Session Notes Modal */}
        <IonModal 
          isOpen={selectedSession !== null} 
          onDidDismiss={() => setSelectedSession(null)}
          className="healer-modal-popup"
        >
          <div className="healer-modal-container">
            <IonHeader className="ion-no-border">
              <IonToolbar className="healer-modal-toolbar">
                <IonTitle>Session Notes: {selectedSession?.sessionNo}</IonTitle>
                <IonButtons slot="end">
                  <button className="healer-modal-close-btn" onClick={() => setSelectedSession(null)}>
                    <IonIcon icon={closeOutline} className="pat-modal-close-icon" />
                  </button>
                </IonButtons>
              </IonToolbar>
            </IonHeader>

            <IonContent className="ion-padding healer-modal-content">
              {selectedSession && (
                <div className="pat-modal-body-container">
                  
                  {/* Overview Card */}
                  <AppCard padding="large" shadow>
                    <div className="pat-vertical-list-8">
                      <div className="pat-modal-row-item">
                        <span className="pat-label-gray">Session Modality</span>
                        <strong className="pat-val-teal">{selectedSession.type}</strong>
                      </div>
                      <div className="pat-modal-row-item">
                        <span className="pat-label-gray">Healing Practitioner</span>
                        <strong className="pat-val-dark-1e">{selectedSession.healer}</strong>
                      </div>
                      <div className="pat-modal-row-item">
                        <span className="pat-label-gray">Conduct Date</span>
                        <strong className="pat-val-dark-1e">{selectedSession.date}</strong>
                      </div>
                      <div className="pat-modal-row-item">
                        <span className="pat-label-gray">Timing Slot</span>
                        <strong className="pat-val-dark-1e">{selectedSession.startTime} - {selectedSession.endTime}</strong>
                      </div>
                    </div>
                  </AppCard>

                  {/* Observations Section */}
                  <div>
                    <h4 className="pat-modal-section-title-teal">
                      Healer Observations & Aura Assessment
                    </h4>
                    <div className="pat-modal-text-panel-teal">
                      {selectedSession.notes?.observations && selectedSession.notes.observations !== '—' 
                        ? selectedSession.notes.observations 
                        : 'No observations logged for this session.'
                      }
                    </div>
                  </div>

                  {/* Detailed Notes Section */}
                  <div>
                    <h4 className="pat-modal-section-title-teal">
                      Session Treatment Summary
                    </h4>
                    <div className="pat-modal-text-panel-teal">
                      {selectedSession.notes?.detailedNotes && selectedSession.notes.detailedNotes !== '—' 
                        ? selectedSession.notes.detailedNotes 
                        : 'No detailed clinical summary logged.'
                      }
                    </div>
                  </div>

                  {/* Recommendations Section */}
                  <div>
                    <h4 className="pat-modal-section-title-purple">
                      <IonIcon icon={leafOutline} /> Healer Recommendations & Advice
                    </h4>
                    <div className="pat-modal-text-panel-purple">
                      {selectedSession.notes?.recommendation && selectedSession.notes.recommendation !== '—' 
                        ? selectedSession.notes.recommendation 
                        : 'No specific recommendations logged yet. Ensure regular practice of physical exercises and meditation as advised.'
                      }
                    </div>
                  </div>

                  <button 
                    className="healer-btn-primary pat-modal-close-btn-footer" 
                    onClick={() => setSelectedSession(null)}
                  >
                    Done
                  </button>

                </div>
              )}
            </IonContent>
          </div>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default SessionHistoryPage;
