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
} from 'ionicons/icons';
import { useAuthStore } from '../../store/auth.store';
import { useHistory } from 'react-router-dom';
import '../branch-admin/branch-admin.css';

const PatientDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const history = useHistory();

  const userName = user?.name || 'Valued Patient';
  
  const rawBranch = typeof user?.branch === 'object' && user?.branch !== null
    ? (user.branch as any).name
    : (user?.branch || 'Mumbai Main');
  const branchName = rawBranch.toLowerCase().includes('branch') ? rawBranch : `${rawBranch} Branch`;

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Patient Portal</IonTitle>
          <IonButtons slot="end">
            <button className="sa-page__toolbar-avatar">
              {userName[0].toUpperCase()}
            </button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body" style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
          {/* Welcome Card */}
          <div className="dm-access-card" style={{ marginBottom: '28px', background: 'linear-gradient(135deg, #1f7a6a 0%, #115e59 100%)' }}>
            <div className="dm-access-card__header" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <IonIcon icon={leafOutline} style={{ fontSize: '28px', color: '#a7f3d0' }} />
              <h2 className="dm-access-card__title" style={{ fontSize: '22px', margin: 0 }}>Namaste, {userName}!</h2>
            </div>
            <p style={{ color: '#e2f5f1', fontSize: '15px', margin: '12px 0 20px 0', lineHeight: 1.5 }}>
              Welcome back to your personalized healing dashboard. Manage your sessions, connect with healers, and upload medical files.
            </p>
            <div className="dm-access-branch-box" style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.15)' }}>
              <span className="dm-access-branch-label" style={{ color: '#a7f3d0' }}>YOUR REGISTERED BRANCH</span>
              <span className="dm-access-branch-val" style={{ color: 'white' }}>{branchName}</span>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '16px' }}>
            Quick Services
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Health Records Navigation Card */}
            <div 
              className="dm-stat-card" 
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => history.push('/patient/health-records')}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="dm-stat-card__icon dm-stat-card__icon--teal" style={{ width: '48px', height: '48px', borderRadius: '10px' }}>
                    <IonIcon icon={documentTextOutline} style={{ fontSize: '24px' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                      Secure Health Records & Uploads
                    </h4>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                      Upload scanned lab reports, view doctor notes, and share clinical files.
                    </p>
                  </div>
                </div>
                <IonIcon icon={chevronForwardOutline} style={{ color: '#94a3b8', fontSize: '20px' }} />
              </div>
            </div>

            {/* Appointments Mock Card */}
            <div className="dm-stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="dm-stat-card__icon dm-stat-card__icon--blue" style={{ width: '48px', height: '48px', borderRadius: '10px' }}>
                    <IonIcon icon={calendarOutline} style={{ fontSize: '24px' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                      Healing Session Bookings
                    </h4>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                      Schedule new sessions, view appointments, and track your healing calendar.
                    </p>
                  </div>
                </div>
                <IonIcon icon={chevronForwardOutline} style={{ color: '#94a3b8', fontSize: '20px' }} />
              </div>
            </div>

            {/* Healers Mock Card */}
            <div className="dm-stat-card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div className="dm-stat-card__icon dm-stat-card__icon--purple" style={{ width: '48px', height: '48px', borderRadius: '10px' }}>
                    <IonIcon icon={medkitOutline} style={{ fontSize: '24px' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>
                      My Healing Team
                    </h4>
                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                      View assigned healers, track progress plans, and consult clinical advice.
                    </p>
                  </div>
                </div>
                <IonIcon icon={chevronForwardOutline} style={{ color: '#94a3b8', fontSize: '20px' }} />
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PatientDashboardPage;
