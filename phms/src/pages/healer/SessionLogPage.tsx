import React, { useState } from 'react';
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
  calendarOutline,
  timeOutline,
  personOutline,
  arrowBackOutline,
  checkmarkCircleOutline,
  hourglassOutline,
  documentTextOutline,
  leafOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import '../branch-admin/branch-admin.css';
import './Healers.css';

export interface SessionMock {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  type: string;
  status: 'Completed' | 'Scheduled' | 'Cancelled';
  notes: string;
  observations: string;
  recommendation: string;
  followUp: boolean;
}

export const mockSessions: SessionMock[] = [
  { 
    id: '1', 
    patientName: 'Rajesh Kumar', 
    patientId: 'PAT-10023', 
    date: '2026-06-04', 
    time: '14:30 - 15:30', 
    type: 'Pranic Psychotherapy', 
    status: 'Scheduled',
    notes: 'To be filled after session.',
    observations: 'N/A',
    recommendation: 'N/A',
    followUp: false
  },
  { 
    id: '2', 
    patientName: 'Sunita Rao', 
    patientId: 'PAT-10112', 
    date: '2026-06-04', 
    time: '16:00 - 17:00', 
    type: 'Advanced Pranic Healing', 
    status: 'Scheduled',
    notes: 'To be filled after session.',
    observations: 'N/A',
    recommendation: 'N/A',
    followUp: false
  },
  { 
    id: '3', 
    patientName: 'Priya Sharma', 
    patientId: 'PAT-10045', 
    date: '2026-06-03', 
    time: '10:00 - 11:00', 
    type: 'Basic Pranic Healing', 
    status: 'Completed',
    notes: 'Session focused on healing the emotional throat chakra. Patient reports relief from chronic fatigue.',
    observations: 'Throat chakra congestion significantly reduced after cleaning.',
    recommendation: 'Recommended next session in 3 days.',
    followUp: true
  },
  { 
    id: '4', 
    patientName: 'Vikram Singh', 
    patientId: 'PAT-10156', 
    date: '2026-05-30', 
    time: '11:30 - 12:30', 
    type: 'Advanced Pranic Healing', 
    status: 'Completed',
    notes: 'Knee joints energized with light-whitish green and red. Pain level reduced from 8 to 4.',
    observations: 'Basic chakra and knee chakras depleted of prana.',
    recommendation: 'Recommended daily light walking and weekly pranic treatment.',
    followUp: true
  },
  { 
    id: '5', 
    patientName: 'Amit Patel', 
    patientId: 'PAT-10088', 
    date: '2026-05-28', 
    time: '15:00 - 16:00', 
    type: 'Pranic Crystal Healing', 
    status: 'Completed',
    notes: 'Used laser crystal to clean aura congestion. Post-stroke motor skills showing incremental improvement.',
    observations: 'Aura is cleaner, congestion in solar plexus chakra resolved.',
    recommendation: 'Continue twice-weekly sessions.',
    followUp: false
  },
];

const SessionLogPage: React.FC = () => {
  const history = useHistory();
  const [filter, setFilter] = useState<'Today' | 'History' | 'All'>('All');

  const todayDateStr = '2026-06-04'; // Matching mock today

  const filteredSessions = mockSessions.filter(session => {
    if (filter === 'Today') {
      return session.date === todayDateStr;
    }
    if (filter === 'History') {
      return session.date !== todayDateStr;
    }
    return true;
  });

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <button className="healer-back-btn" onClick={() => history.push('/healer/dashboard')}>
              <IonIcon icon={arrowBackOutline} />
            </button>
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Sessions</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="healer-container">
          
          {/* Segment Tabs */}
          <div className="healer-tab-segmented">
            {(['All', 'Today', 'History'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`healer-segmented-btn ${filter === tab ? 'healer-segmented-btn--active' : ''}`}
              >
                {tab === 'Today' ? "Today's Sessions" : tab === 'History' ? 'Session History' : 'All Sessions'}
              </button>
            ))}
          </div>

          <div className="healer-actions-list">
            {filteredSessions.map(session => (
              <div 
                key={session.id} 
                className="dm-stat-card healer-session-card" 
                onClick={() => history.push(`/healer/sessions/details/${session.id}`)}
              >
                <div className="healer-session-card__header">
                  <div className="healer-session-card__title-box">
                    <IonIcon icon={personOutline} className="healer-session-card__title-icon" />
                    <h4 className="healer-session-card__name">
                      {session.patientName}
                    </h4>
                    <span className="healer-session-card__id">({session.patientId})</span>
                  </div>

                  <span
                    className={`healer-status-badge ${
                      session.status === 'Completed' 
                        ? 'healer-status-badge--completed' 
                        : 'healer-status-badge--scheduled'
                    }`}
                  >
                    <IonIcon icon={session.status === 'Completed' ? checkmarkCircleOutline : hourglassOutline} />
                    {session.status}
                  </span>
                </div>

                <div className="healer-session-card__type">
                  Type: <strong>{session.type}</strong>
                </div>

                <div className="healer-session-card__footer">
                  <div className="healer-footer-item">
                    <IonIcon icon={calendarOutline} className="healer-footer-item__icon" />
                    <span>{session.date}</span>
                  </div>
                  <div className="healer-footer-item">
                    <IonIcon icon={timeOutline} className="healer-footer-item__icon" />
                    <span>{session.time}</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredSessions.length === 0 && (
              <div className="healer-empty-state">
                <IonIcon icon={calendarOutline} className="healer-empty-state__icon" />
                <p>No sessions found in this category.</p>
              </div>
            )}
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default SessionLogPage;
