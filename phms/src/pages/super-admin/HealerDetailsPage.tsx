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
  peopleOutline,
  medkitOutline,
  starOutline,
} from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import './super-admin.css';

const HealerDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [healer, setHealer] = useState<any>(null);

  useEffect(() => {
    // Mock data for healer details
    const healers = [
      { id: 1, name: 'Dr. Aris Varma', specialty: 'Senior Psychotherapist', email: 'aris.v@phms.com', phone: '0876543210', patients: 24, rating: 4.9, joined: '2023-01-16', status: 'Active', branch: 'Coastal Healing Center' },
      { id: 2, name: 'Maya Rose', specialty: 'Advanced Pranic Healer', email: 'maya.r@phms.com', phone: '0876543211', patients: 18, rating: 4.8, joined: '2023-02-20', status: 'Active', branch: 'Uptown Sanctuary' },
    ];
    
    const found = healers.find(h => h.id.toString() === id) || healers[0];
    setHealer({
      ...found,
      fullName: found.name,
      dob: '1985-08-22',
      gender: 'Male',
      experience: '12 Years',
      certification: 'Master Pranic Healer (Level III)',
      address1: '45 Lotus Gardens',
      address2: 'OM Road',
      city: 'Chennai',
      district: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600041'
    });
  }, [id]);

  if (!healer) return null;

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref={ROUTES.SUPER_ADMIN.HEALERS} text="" />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Practitioner Profile</IonTitle>
          
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          
          <div className="sa-profile-header">
            <div className="sa-table__avatar sa-table__avatar--primary" style={{ width: '100px', height: '100px', fontSize: '40px' }}>
              {healer.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="sa-profile-header__content">
              <h1 className="sa-profile-header__title">{healer.name}</h1>
              <p className="sa-profile-header__subtitle">{healer.specialty} • {healer.branch}</p>
              <div className="sa-profile-header__badges">
                <span className="sa-badge sa-badge--active">{healer.status}</span>
                <span className="sa-badge" style={{ background: '#f1f5f9', color: '#64748b' }}>Rating: {healer.rating} ★</span>
              </div>
            </div>
          </div>

          <div className="sa-stats sa-stats--3" style={{ marginBottom: '24px' }}>
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Patients Handled</div>
                <div className="sa-stat-card__value">{healer.patients}</div>
              </div>
              <div className="sa-stat-card__icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                <IonIcon icon={peopleOutline} />
              </div>
            </div>
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Experience</div>
                <div className="sa-stat-card__value">{healer.experience}</div>
              </div>
              <div className="sa-stat-card__icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <IonIcon icon={starOutline} />
              </div>
            </div>
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Success Rate</div>
                <div className="sa-stat-card__value">94%</div>
              </div>
              <div className="sa-stat-card__icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                <IonIcon icon={medkitOutline} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="sa-section">
              <SectionHeader icon={shieldCheckmarkOutline} title="Professional Background" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <InfoItem label="Full Name" value={healer.fullName} icon={personOutline} />
                <InfoItem label="Certification" value={healer.certification} icon={medkitOutline} />
                <InfoItem label="Email ID" value={healer.email} icon={mailOutline} />
                <InfoItem label="Phone Number" value={healer.phone} icon={callOutline} />
                <InfoItem label="Date of Birth" value={healer.dob} icon={calendarOutline} />
                <InfoItem label="Gender" value={healer.gender} icon={personOutline} />
              </div>
            </div>

            <div className="sa-section">
              <SectionHeader icon={locationOutline} title="Branch & Address" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <InfoItem label="Assigned Branch" value={healer.branch} icon={businessOutline} />
                <InfoItem label="Address Line 1" value={healer.address1} icon={locationOutline} />
                <InfoItem label="Address Line 2" value={healer.address2} icon={locationOutline} />
                <InfoItem label="City" value={healer.city} icon={businessOutline} />
                <InfoItem label="State" value={healer.state} icon={businessOutline} />
                <InfoItem label="Pincode" value={healer.pincode} icon={locationOutline} />
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

export default HealerDetailsPage;
