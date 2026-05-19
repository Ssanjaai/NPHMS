import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonBackButton,
  IonButton,
} from '@ionic/react';
import {
  personOutline,
  mailOutline,
  callOutline,
  locationOutline,
  businessOutline,
  calendarOutline,
  shieldCheckmarkOutline,
  createOutline,
  lockClosedOutline,
  keyOutline,
  peopleOutline,
  medkitOutline,
} from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import './super-admin.css';

const AdminDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const savedAdmins = localStorage.getItem('ph_admins');
    if (savedAdmins) {
      const allAdmins = JSON.parse(savedAdmins);
      const foundAdmin = allAdmins.find((a: any) => a.id.toString() === id);
      if (foundAdmin) {
        setAdmin({
          ...foundAdmin,
          fullName: foundAdmin.name,
          username: foundAdmin.name.toLowerCase().replace(' ', '_'),
          password: '••••••••',
          dob: '1990-05-15',
          gender: 'Male',
          patientsHandled: 124,
          address1: '123 Healing Way',
          address2: 'Suite 400',
          city: 'Chennai',
          district: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600001'
        });
      }
    }
  }, [id]);

  if (!admin) {
    return (
      <IonPage>
        <IonContent>
          <div style={{ padding: '20px', textAlign: 'center' }}>Loading admin details...</div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref={ROUTES.SUPER_ADMIN.BRANCH_ADMINS} text="" />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Administrator Profile</IonTitle>
          <IonButtons slot="end">
            <IonButton 
              className="sa-btn sa-btn--primary sa-btn--sm" 
              style={{ marginRight: '8px' }}
              onClick={() => history.push(ROUTES.SUPER_ADMIN.EDIT_BRANCH_ADMIN.replace(':id', id))}
            >
              <IonIcon icon={createOutline} slot="start" />
              <span className="sa-hide-on-mobile" style={{ marginLeft: '6px' }}>Edit Profile</span>
              <span className="sa-show-on-mobile" style={{ marginLeft: '6px' }}>Edit</span>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body" style={{ margin: '0 auto' }}>
          
          {/* Main Profile Card */}
          <div className="sa-profile-header">
            <div className="sa-table__avatar sa-table__avatar--primary" style={{ width: '100px', height: '100px', fontSize: '40px' }}>
              {admin.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="sa-profile-header__content">
              <h1 className="sa-profile-header__title">{admin.name}</h1>
              <p className="sa-profile-header__subtitle">{admin.branch} Administrator</p>
              <div className="sa-profile-header__badges">
                <span className={`sa-badge sa-badge--${admin.status === 'active' ? 'active' : 'Inactive'}`}>
                  {admin.status}
                </span>
                <span className="sa-badge" style={{ background: '#f1f5f9', color: '#64748b' }}>Joined {admin.joined}</span>
              </div>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="sa-stats sa-stats--2" style={{ marginBottom: '24px' }}>
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Healers Assigned</div>
                <div className="sa-stat-card__value">12</div>
                <div className="sa-stat-card__detail">Active practitioners in branch</div>
              </div>
              <div className="sa-stat-card__icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <IonIcon icon={medkitOutline} />
              </div>
            </div>
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Patients Handled</div>
                <div className="sa-stat-card__value">{admin.patientsHandled}</div>
                <div className="sa-stat-card__detail">Total assignments across branch</div>
              </div>
              <div className="sa-stat-card__icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                <IonIcon icon={peopleOutline} />
              </div>
            </div>
          </div>

          {/* Detailed Information Sections */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Personal & Account */}
            <div className="sa-section">
              <SectionHeader icon={shieldCheckmarkOutline} title="Account & Identity" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <InfoItem label="Admin Name" value={admin.name} icon={personOutline} />
                <InfoItem label="Full Name" value={admin.fullName} icon={personOutline} />
                <InfoItem label="Username" value={admin.username} icon={keyOutline} />
                <InfoItem label="Password" value={admin.password} icon={lockClosedOutline} />
                <InfoItem label="Email ID" value={admin.email} icon={mailOutline} />
                <InfoItem label="Phone Number" value={admin.phone} icon={callOutline} />
                <InfoItem label="Date of Birth" value={admin.dob} icon={calendarOutline} />
                <InfoItem label="Gender" value={admin.gender} icon={personOutline} />
              </div>
            </div>

            {/* Location */}
            <div className="sa-section">
              <SectionHeader icon={locationOutline} title="Branch & Address" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <InfoItem label="Assigned Branch" value={admin.branch} icon={businessOutline} />
                <InfoItem label="Address Line 1" value={admin.address1} icon={locationOutline} />
                <InfoItem label="Address Line 2" value={admin.address2} icon={locationOutline} />
                <InfoItem label="City" value={admin.city} icon={businessOutline} />
                <InfoItem label="District" value={admin.district} icon={businessOutline} />
                <InfoItem label="State" value={admin.state} icon={businessOutline} />
                <InfoItem label="Pincode" value={admin.pincode} icon={locationOutline} />
              </div>
            </div>

          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

const SectionHeader: React.FC<{ icon: string, title: string }> = ({ icon, title }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
    <IonIcon icon={icon} style={{ color: 'var(--color-primary)', fontSize: '20px' }} />
    <h2 style={{ fontSize: '17px', fontWeight: 600, margin: 0, color: '#1e293b' }}>{title}</h2>
  </div>
);

const InfoItem: React.FC<{ label: string, value: string, icon: string }> = ({ label, value, icon }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
    <div style={{ background: '#f8fafc', padding: '8px', borderRadius: '8px', color: '#64748b' }}>
      <IonIcon icon={icon} style={{ fontSize: '16px', display: 'block' }} />
    </div>
    <div>
      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
      <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: 500, marginTop: '2px' }}>{value}</div>
    </div>
  </div>
);

export default AdminDetailsPage;
