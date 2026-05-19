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
  medkitOutline,
  heartOutline,
} from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import './super-admin.css';

const PatientDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('phms_patients');
    const allPatients = saved ? JSON.parse(saved) : [
      { id: 1, name: 'Elena Gilbert', email: 'elena.g@example.com', phone: '0876543210', branch: 'Coastal Healing Center', joined: '2024-03-10', treatments: ['Pranic Psychotherapy'] },
      { id: 2, name: 'Stefan Salvatore', email: 'stefan.s@example.com', phone: '0876543211', branch: 'Uptown Sanctuary', joined: '2024-03-12', treatments: ['Stress Relief Healing'] },
    ];
    
    const found = allPatients.find((p: any) => p.id.toString() === id) || allPatients[0];
    setPatient({
      ...found,
      fullName: found.name,
      dob: '1995-11-12',
      gender: 'Female',
      age: 29,
      bloodGroup: 'B+',
      occupation: 'Student',
      address1: '102 Mystic Falls Drive',
      address2: 'Apt 4B',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600020'
    });
  }, [id]);

  if (!patient) return null;

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref={ROUTES.SUPER_ADMIN.PATIENTS} text="" />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Patient Profile</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          
          <div className="sa-profile-header">
            <div className="sa-table__avatar sa-table__avatar--primary" style={{ width: '100px', height: '100px', fontSize: '40px' }}>
              {patient.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="sa-profile-header__content">
              <h1 className="sa-profile-header__title">{patient.name}</h1>
              <p className="sa-profile-header__subtitle">Patient ID: PH-PAT-{patient.id} • {patient.branch}</p>
              <div className="sa-profile-header__badges">
                <span className="sa-badge sa-badge--active">Active Treatment</span>
                {patient.treatments?.map((t: string, i: number) => (
                  <span key={i} className="sa-badge" style={{ background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="sa-section">
              <SectionHeader icon={shieldCheckmarkOutline} title="Medical & Identity" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <InfoItem label="Full Name" value={patient.fullName} icon={personOutline} />
                <InfoItem label="Age / Gender" value={`${patient.age} / ${patient.gender}`} icon={personOutline} />
                <InfoItem label="Blood Group" value={patient.bloodGroup} icon={heartOutline} />
                <InfoItem label="Email ID" value={patient.email} icon={mailOutline} />
                <InfoItem label="Phone Number" value={patient.phone} icon={callOutline} />
                <InfoItem label="Date of Birth" value={patient.dob} icon={calendarOutline} />
                <InfoItem label="Occupation" value={patient.occupation} icon={businessOutline} />
                <InfoItem label="Active Treatment" value={patient.treatments?.join(', ') || 'General Wellness'} icon={medkitOutline} />
              </div>
            </div>

            <div className="sa-section">
              <SectionHeader icon={locationOutline} title="Branch & Address" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <InfoItem label="Registered Branch" value={patient.branch} icon={businessOutline} />
                <InfoItem label="Address Line 1" value={patient.address1} icon={locationOutline} />
                <InfoItem label="Address Line 2" value={patient.address2} icon={locationOutline} />
                <InfoItem label="City" value={patient.city} icon={businessOutline} />
                <InfoItem label="State" value={patient.state} icon={businessOutline} />
                <InfoItem label="Pincode" value={patient.pincode} icon={locationOutline} />
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

export default PatientDetailsPage;
