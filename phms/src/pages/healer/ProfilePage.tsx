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
  personOutline,
  arrowBackOutline,
  mailOutline,
  phonePortraitOutline,
  businessOutline,
  ribbonOutline,
  leafOutline,
  checkmarkDoneOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import AppCard from '../../components/common/AppCard';
import '../branch-admin/branch-admin.css';
import './Healers.css';

const ProfilePage: React.FC = () => {
  const history = useHistory();
  const { user } = useAuthStore();

  const userName = user?.name || 'Valued Healer';
  const userEmail = user?.email || 'healer@phms.com';
  const userPhone = user?.phoneNumber || '+91 98765 43210';
  
  const rawBranch = typeof user?.branch === 'object' && user?.branch !== null
    ? (user.branch as any).name
    : (user?.branch || 'Mumbai Main');
  const branchName = rawBranch.toLowerCase().includes('branch') ? rawBranch : `${rawBranch} Branch`;

  // BRD 6.4: Certification level, specialization, healing count details
  const certificationLevel = 'Associate Certified Pranic Healer (ACPH)';
  const specialization = 'Pranic Psychotherapy, Crystal Healing, Cellular Healing';
  const healingCount = 142;

  const userInitials = userName
    ? `${userName[0] || 'H'}${userName.split(' ')?.[1]?.[0] || 'P'}`.toUpperCase()
    : 'HP';

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <button className="healer-back-btn" onClick={() => history.push('/healer/dashboard')}>
              <IonIcon icon={arrowBackOutline} />
            </button>
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">My Profile</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="healer-container--narrow">
          
          {/* Header Card */}
          <div className="healer-profile-header-card">
            <div className="healer-profile-avatar">
              {userInitials}
            </div>
            <h2 className="healer-profile-name">{userName}</h2>
            <span className="healer-profile-role-badge">
              Para Healer
            </span>
          </div>

          <h3 className="healer-section-title">
            Healer Credentials (BRD 6.4)
          </h3>

          <div className="healer-actions-list--margin-bottom">
            {/* Certification Level */}
            <div className="dm-stat-card healer-stat-card">
              <div className="healer-credential-card__inner">
                <div className="dm-stat-card__icon dm-stat-card__icon--purple healer-document-item__icon-container">
                  <IonIcon icon={ribbonOutline} style={{ fontSize: '22px' }} />
                </div>
                <div>
                  <span className="healer-credential-card__label">CERTIFICATION LEVEL</span>
                  <strong className="healer-credential-card__value">{certificationLevel}</strong>
                </div>
              </div>
            </div>

            {/* Specialization */}
            <div className="dm-stat-card healer-stat-card">
              <div className="healer-credential-card__inner">
                <div className="dm-stat-card__icon dm-stat-card__icon--teal healer-document-item__icon-container">
                  <IonIcon icon={leafOutline} style={{ fontSize: '22px' }} />
                </div>
                <div>
                  <span className="healer-credential-card__label">SPECIALIZATIONS</span>
                  <strong className="healer-credential-card__value">{specialization}</strong>
                </div>
              </div>
            </div>

            {/* Healing Count */}
            <div className="dm-stat-card healer-stat-card">
              <div className="healer-credential-card__inner">
                <div className="dm-stat-card__icon dm-stat-card__icon--blue healer-document-item__icon-container">
                  <IonIcon icon={checkmarkDoneOutline} style={{ fontSize: '22px' }} />
                </div>
                <div>
                  <span className="healer-credential-card__label">CUMULATIVE HEALING COUNT</span>
                  <strong className="healer-credential-card__value--highlight">{healingCount} sessions</strong>
                </div>
              </div>
            </div>
          </div>

          <h3 className="healer-section-title">
            Contact & General Information
          </h3>

          <AppCard padding="large" shadow>
            <div className="healer-profile-info-list">
              <div className="healer-profile-info-item">
                <IonIcon icon={mailOutline} className="healer-profile-info-item__icon" />
                <div>
                  <span className="healer-profile-info-item__label">EMAIL ADDRESS</span>
                  <strong>{userEmail}</strong>
                </div>
              </div>

              <div className="healer-profile-info-item">
                <IonIcon icon={phonePortraitOutline} className="healer-profile-info-item__icon" />
                <div>
                  <span className="healer-profile-info-item__label">PHONE NUMBER</span>
                  <strong>{userPhone}</strong>
                </div>
              </div>

              <div className="healer-profile-info-item">
                <IonIcon icon={businessOutline} className="healer-profile-info-item__icon" />
                <div>
                  <span className="healer-profile-info-item__label">ASSIGNED BRANCH</span>
                  <strong>{branchName}</strong>
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
