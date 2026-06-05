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
  chatboxOutline,
  arrowBackOutline,
  star,
  starOutline,
  checkmarkCircleOutline,
  timeOutline,
  calendarOutline,
  personOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import AppCard from '../../components/common/AppCard';
import '../branch-admin/branch-admin.css';
import '../healer/Healers.css';

interface Feedback {
  id: number;
  sessionId: number;
  sessionNo: string;
  patientName: string;
  healerName: string;
  rating: number;
  comments: string;
  date: string;
}

const FeedbackPage: React.FC = () => {
  const history = useHistory();
  const { user } = useAuthStore();

  const userName = user?.name || 'Valued Patient';
  const userEmail = user?.email || 'patient@phms.com';

  // State
  const [sessions, setSessions] = React.useState<any[]>([]);
  const [feedbacks, setFeedbacks] = React.useState<Feedback[]>([]);
  const [selectedSession, setSelectedSession] = React.useState<any | null>(null);
  
  // Form State
  const [rating, setRating] = React.useState<number>(5);
  const [comments, setComments] = React.useState<string>('');
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  // Load from localStorage
  React.useEffect(() => {
    // 1. Load patient name and healer
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

    // 2. Load sessions matching patient name and status 'Completed'
    const savedSessions = localStorage.getItem('phms_sessions');
    let completedList: any[] = [];
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        completedList = parsed.filter(
          (s: any) => 
            s.patient?.toLowerCase().trim() === patientName.toLowerCase().trim() &&
            s.status === 'Completed'
        );
      } catch (e) {
        console.error(e);
      }
    }

    // Fallback completed sessions if empty
    const session2035Id = Date.now() - 3600000 * 48; // keep matching timestamp reference
    if (completedList.length === 0) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

      completedList = [
        {
          id: Date.now() - 3600000 * 12, // 12 hours ago
          sessionNo: 'SESS-2038',
          date: yesterdayStr,
          startTime: '03:00 PM',
          endTime: '04:00 PM',
          patient: patientName,
          healer: currentHealer,
          type: 'Advanced Pranic Healing',
          status: 'Completed'
        },
        {
          id: session2035Id,
          sessionNo: 'SESS-2035',
          date: twoDaysAgoStr,
          startTime: '11:00 AM',
          endTime: '12:00 PM',
          patient: patientName,
          healer: currentHealer,
          type: 'Basic Pranic Healing',
          status: 'Completed'
        }
      ];
    }
    setSessions(completedList);

    // 3. Load feedbacks list
    const savedFeedbacks = localStorage.getItem('phms_feedbacks');
    let feedbacksList: Feedback[] = [];
    if (savedFeedbacks) {
      try {
        feedbacksList = JSON.parse(savedFeedbacks);
      } catch (e) {
        console.error(e);
      }
    }

    const patientFeedbacks = feedbacksList.filter(
      (f) => f.patientName?.toLowerCase().trim() === patientName.toLowerCase().trim()
    );
    if (patientFeedbacks.length === 0) {
      const sampleFeedback: Feedback = {
        id: Date.now() - 3600000 * 24, // 1 day ago
        sessionId: session2035Id,
        sessionNo: 'SESS-2035',
        patientName: patientName,
        healerName: currentHealer,
        rating: 5,
        comments: 'Excellent healing session. I felt immediate relief from my shoulder tension and felt very calm and energized afterwards. The healer was highly professional and compassionate.',
        date: new Date(Date.now() - 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      
      feedbacksList = [sampleFeedback, ...feedbacksList];
      localStorage.setItem('phms_feedbacks', JSON.stringify(feedbacksList));
    }
    setFeedbacks(feedbacksList);
  }, [userEmail, userName]);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSession) return;

    const newFeedback: Feedback = {
      id: Date.now(),
      sessionId: selectedSession.id,
      sessionNo: selectedSession.sessionNo,
      patientName: selectedSession.patient,
      healerName: selectedSession.healer,
      rating,
      comments,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    const updatedFeedbacks = [newFeedback, ...feedbacks];
    setFeedbacks(updatedFeedbacks);
    localStorage.setItem('phms_feedbacks', JSON.stringify(updatedFeedbacks));

    // Also write an audit log
    const savedAudits = localStorage.getItem('phms_audits') || '[]';
    try {
      const audits = JSON.parse(savedAudits);
      const newAudit = {
        id: `A-${Math.floor(1000 + Math.random() * 9000)}`,
        action: 'PATIENT_FEEDBACK',
        details: `Patient ${selectedSession.patient} submitted rating of ${rating}/5 for session ${selectedSession.sessionNo}.`,
        changedBy: user?.name || user?.email || 'Patient',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      localStorage.setItem('phms_audits', JSON.stringify([newAudit, ...audits]));
    } catch (err) {
      console.error(err);
    }

    setSuccessMsg(`Feedback submitted successfully for session ${selectedSession.sessionNo}!`);
    setSelectedSession(null);
    setComments('');
    setRating(5);

    setTimeout(() => {
      setSuccessMsg(null);
    }, 4000);
  };

  const getFeedbackForSession = (sessionId: number) => {
    return feedbacks.find(f => f.sessionId === sessionId);
  };

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <button className="healer-back-btn" onClick={() => history.push('/patient/dashboard')}>
              <IonIcon icon={arrowBackOutline} />
            </button>
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Session Feedback</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="healer-container" style={{ maxWidth: '900px' }}>
          
          <div className="healer-header-box">
            <h1 className="healer-page-title">Give Session Reviews</h1>
            <p className="healer-page-subtitle">
              Your feedback is crucial for tracing progress. Submit ratings and testimonials for your completed sessions.
            </p>
          </div>

          {successMsg && (
            <div style={{ background: '#e2f5f1', border: '1px solid #ccfbf1', padding: '16px', borderRadius: '12px', color: '#0f766e', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '14px', fontWeight: '600' }}>
              <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '20px' }} />
              {successMsg}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: selectedSession ? '1.2fr 1fr' : '1fr', gap: '24px', alignItems: 'start' }}>
            
            {/* Completed Sessions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <AppCard padding="large" shadow>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', margin: '0 0 16px 0' }}>
                  Completed Healing Sessions ({sessions.length})
                </h3>

                {sessions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8' }}>
                    <IonIcon icon={timeOutline} style={{ fontSize: '40px', opacity: 0.3, marginBottom: '8px' }} />
                    <p style={{ margin: 0, fontSize: '14px' }}>No completed sessions found to rate.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {sessions.map((session) => {
                      const submittedFeedback = getFeedbackForSession(session.id);
                      const isSelected = selectedSession?.id === session.id;

                      return (
                        <div 
                          key={session.id} 
                          style={{
                            background: isSelected ? '#e2f5f1' : '#f8fafc',
                            border: `1px solid ${isSelected ? '#0f766e' : '#e2e8f0'}`,
                            borderRadius: '10px',
                            padding: '16px',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <strong style={{ fontSize: '15px', color: '#0f172a' }}>{session.sessionNo}</strong>
                                <span style={{ fontSize: '12px', background: '#e2f5f1', color: '#0f766e', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
                                  {session.type}
                                </span>
                              </div>
                              <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <IonIcon icon={personOutline} /> Healer: {session.healer}
                              </p>
                              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <IonIcon icon={calendarOutline} /> Conducted: {session.date} • {session.startTime}
                              </p>
                            </div>

                            <div>
                              {submittedFeedback ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                  <span style={{ fontSize: '12px', color: '#15803d', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <IonIcon icon={checkmarkCircleOutline} /> Submitted
                                  </span>
                                  <div style={{ display: 'flex', gap: '2px' }}>
                                    {[1, 2, 3, 4, 5].map((s) => (
                                      <IonIcon 
                                        key={s} 
                                        icon={s <= (submittedFeedback.rating || 5) ? star : starOutline} 
                                        style={{ fontSize: '14px', color: '#f59e0b' }} 
                                      />
                                    ))}
                                  </div>
                                </div>
                              ) : (
                                <button 
                                  className="healer-photo-upload-btn"
                                  style={{ border: '1px solid #0f766e', color: '#0f766e', background: isSelected ? 'white' : 'transparent' }}
                                  onClick={() => {
                                    setSelectedSession(session);
                                    setComments('');
                                    setRating(5);
                                  }}
                                >
                                  Submit Review
                                </button>
                              )}
                            </div>
                          </div>

                           {submittedFeedback && (
                             <div style={{ marginTop: '12px', background: '#ffffff', padding: '10px 12px', borderRadius: '6px', borderLeft: '3px solid #16a34a', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                               {submittedFeedback.comments && (
                                 <span style={{ fontSize: '13px', color: '#475569', fontStyle: 'italic' }}>
                                   "{submittedFeedback.comments}"
                                 </span>
                               )}
                               <span style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'right' }}>
                                 Submitted On: {submittedFeedback.date}
                               </span>
                             </div>
                           )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </AppCard>
            </div>

            {/* Submit Feedback Form panel */}
            {selectedSession && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <AppCard padding="large" shadow>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f766e', margin: '0 0 16px 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '6px' }}>
                    Rate Session {selectedSession.sessionNo}
                  </h3>

                  <form onSubmit={handleSubmitFeedback} className="healer-form">
                    <div>
                      <span className="healer-form-label">Healer Rating</span>
                      <div style={{ display: 'flex', gap: '8px', margin: '8px 0 16px 0' }}>
                        {[1, 2, 3, 4, 5].map((starNum) => (
                          <button
                            key={starNum}
                            type="button"
                            style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer' }}
                            onClick={() => setRating(starNum)}
                          >
                            <IonIcon 
                              icon={starNum <= rating ? star : starOutline} 
                              style={{ fontSize: '28px', color: '#f59e0b' }} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="healer-form-label">Written Feedback</label>
                      <textarea
                        required
                        rows={4}
                        className="healer-form-textarea"
                        placeholder="Share your experience (e.g., pain relief, energy levels, healer conduct)..."
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                      <button 
                        type="submit" 
                        className="healer-btn-primary" 
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: 'none', background: '#0f766e', color: 'white', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Submit Feedback
                      </button>
                      <button 
                        type="button" 
                        className="healer-btn-secondary" 
                        onClick={() => setSelectedSession(null)}
                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', background: 'white', color: '#475569', fontWeight: '700', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </AppCard>
              </div>
            )}

          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default FeedbackPage;
