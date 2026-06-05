import React from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
} from '@ionic/react';
import {
  arrowBackOutline,
  hourglassOutline,
} from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { mockSessions } from './SessionLogPage';
import './Healers.css';

const SessionsRecordPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();

  const session = mockSessions.find(s => s.id === id);

  if (!session) {
    return (
      <IonPage className="sa-page">
        <IonHeader className="ion-no-border">
          <IonToolbar className="sa-page__toolbar">
            <IonButtons slot="start">
              <button className="healer-back-btn" onClick={() => history.push('/healer/sessions')}>
                <IonIcon icon={arrowBackOutline} />
              </button>
            </IonButtons>
            <IonTitle className="sa-page__toolbar-title">Session Record</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="sa-page__content">
          <div className="healer-container">
            <div className="healer-empty-state">
              <p>Session record not found.</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <button className="healer-back-btn" onClick={() => history.push('/healer/sessions')}>
              <IonIcon icon={arrowBackOutline} />
            </button>
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">{session.patientName} - Session Details</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="healer-container">
          
          <div className="healer-header-box">
            <h2 className="healer-page-title">{session.patientName}</h2>
            <p className="healer-page-subtitle">Patient ID: {session.patientId} | Status: {session.status}</p>
          </div>

          <div className="dm-stat-card healer-detail-card">
            <div className="healer-detail-card__header">
              <div>
                <span className="healer-detail-card__sub-label">TREATMENT TYPE</span>
                <h3 className="healer-detail-card__header-title healer-session-detail-type">{session.type}</h3>
              </div>
              <span className={`healer-status-badge healer-status-badge--${session.status === 'Completed' ? 'completed' : 'scheduled'}`}>
                {session.status}
              </span>
            </div>

            <div className="healer-detail-grid">
              <div>
                <span className="healer-detail-grid__label">SESSION DATE</span>
                <strong>{session.date}</strong>
              </div>
              <div>
                <span className="healer-detail-grid__label">SESSION TIME</span>
                <strong>{session.time}</strong>
              </div>
            </div>

            {session.status === 'Completed' ? (
              <div className="healer-detail-card__section-list">
                <div>
                  <span className="healer-detail-section__label">OBSERVATIONS</span>
                  <span className="healer-detail-section__value healer-detail-section__value--block">{session.observations}</span>
                </div>
                <div className="healer-margin-top-16">
                  <span className="healer-detail-section__label">TREATMENT NOTES</span>
                  <span className="healer-detail-section__value healer-detail-section__value--block">{session.notes}</span>
                </div>
                <div className="healer-margin-top-16">
                  <span className="healer-detail-section__label">NEXT RECOMMENDATION</span>
                  <span className="healer-detail-section__value healer-detail-section__value--block">{session.recommendation}</span>
                </div>
                <div className="healer-margin-top-16">
                  <span className="healer-detail-section__label">FOLLOW-UP REQUIRED</span>
                  <span 
                    className={`healer-follow-up-badge healer-follow-up-badge--${
                      session.followUp ? 'yes' : 'no'
                    }`}
                  >
                    {session.followUp ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="healer-scheduled-notice-box">
                <IonIcon icon={hourglassOutline} className="healer-scheduled-notice-icon" />
                <p className="healer-scheduled-notice-text">This session is currently scheduled. Remarks and notes will be available once the session is marked completed.</p>
              </div>
            )}

          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default SessionsRecordPage;
