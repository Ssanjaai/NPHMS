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
  saveOutline,
  personOutline,
  mailOutline,
  callOutline,
  locationOutline,
  businessOutline,
  calendarOutline,
  shieldCheckmarkOutline,
  medkitOutline,
  starOutline,
  languageOutline,
  cloudUploadOutline,
} from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import './super-admin.css';

const EditHealerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [healer, setHealer] = useState<any>(null);

  useEffect(() => {
    // In a real app, fetch from localStorage or API
    // Using mock data for now
    const healers = [
      { id: 1, name: 'Dr. Aris Varma', email: 'aris.v@phms.com', specialty: 'Energy Healing', branch: 'Uptown Sanctuary', experience: 8, status: 'active' },
      { id: 2, name: 'Maya Rose', email: 'maya.r@phms.com', specialty: 'Advanced Pranic Healing', branch: 'Coastal Healing Center', experience: 5, status: 'active' },
    ];
    const found = healers.find(h => h.id.toString() === id) || healers[0];
    setHealer({
      ...found,
      gender: 'Male',
      dob: '1985-08-22',
      phone: '0876543210',
      address: '45 Lotus Gardens, OM Road, Chennai',
      certLevel: 'Advanced',
      languages: 'English, Tamil',
      verification: 'Verified'
    });
  }, [id]);

  const handleSave = () => {
    // Logic to save data
    history.push(ROUTES.SUPER_ADMIN.HEALERS);
  };

  if (!healer) return null;

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref={ROUTES.SUPER_ADMIN.HEALERS} text="" />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Edit Healer Profile</IonTitle>
          <IonButtons slot="end">
            <IonButton className="sa-btn sa-btn--primary sa-btn--sm" onClick={handleSave} style={{ marginRight: '16px' }}>
              <IonIcon icon={saveOutline} slot="start" />
              <span className="sa-hide-on-mobile">Save Changes</span>
              <span className="sa-show-on-mobile">Save</span>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          
          <div className="sa-grid-2">
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Section 1: Basic Information */}
              <div className="sa-section">
                <div className="sa-section-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IonIcon icon={personOutline} style={{ color: 'var(--color-primary)', fontSize: '20px' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Basic Information</h2>
                  </div>
                </div>
                
                <div className="sa-settings__form-grid">
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Healer Full Name</label>
                    <input className="sa-settings__input" value={healer.name} onChange={e => setHealer({...healer, name: e.target.value})} />
                  </div>
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Profile Photo</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="sa-table__avatar sa-table__avatar--primary" style={{ width: '45px', height: '45px' }}>{healer.name[0]}</div>
                      <button className="sa-btn sa-btn--outline sa-btn--sm">Change Photo</button>
                    </div>
                  </div>
                </div>

                <div className="sa-settings__form-grid">
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Gender</label>
                    <select className="sa-settings__input" value={healer.gender} onChange={e => setHealer({...healer, gender: e.target.value})}>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Date of Birth</label>
                    <input type="date" className="sa-settings__input" value={healer.dob} onChange={e => setHealer({...healer, dob: e.target.value})} />
                  </div>
                </div>

                <div className="sa-settings__form-grid">
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Phone Number</label>
                    <input className="sa-settings__input" value={healer.phone} onChange={e => setHealer({...healer, phone: e.target.value})} />
                  </div>
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Email Address</label>
                    <input className="sa-settings__input" value={healer.email} onChange={e => setHealer({...healer, email: e.target.value})} />
                  </div>
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">Address</label>
                  <textarea className="sa-settings__input" style={{ height: '100px' }} value={healer.address} onChange={e => setHealer({...healer, address: e.target.value})} />
                </div>
              </div>

              {/* Section 2: Login Details */}
              <div className="sa-section">
                <div className="sa-section-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IonIcon icon={shieldCheckmarkOutline} style={{ color: 'var(--color-primary)', fontSize: '20px' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Login Details</h2>
                  </div>
                </div>
                
                <div className="sa-settings__form-grid">
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Username</label>
                    <input className="sa-settings__input" value={healer.name.toLowerCase().replace(' ', '_')} readOnly />
                  </div>
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Password (Auto Generated)</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input className="sa-settings__input" type="password" value="••••••••" readOnly />
                      <button className="sa-btn sa-btn--outline sa-btn--sm">Regenerate</button>
                    </div>
                  </div>
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">Account Status</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      className={`sa-btn ${healer.status === 'active' ? 'sa-btn--primary' : 'sa-btn--outline'}`}
                      onClick={() => setHealer({...healer, status: 'active'})}
                    >Active</button>
                    <button 
                      className={`sa-btn ${healer.status === 'inactive' ? 'sa-btn--danger' : 'sa-btn--outline'}`}
                      onClick={() => setHealer({...healer, status: 'inactive'})}
                    >Inactive</button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Section 3: Professional Details */}
              <div className="sa-section">
                <div className="sa-section-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IonIcon icon={medkitOutline} style={{ color: 'var(--color-primary)', fontSize: '20px' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Professional Details</h2>
                  </div>
                </div>
                
                <div className="sa-settings__form-grid">
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Certification Level</label>
                    <select className="sa-settings__input" value={healer.certLevel} onChange={e => setHealer({...healer, certLevel: e.target.value})}>
                      <option>Beginner</option>
                      <option>Intermediate</option>
                      <option>Advanced</option>
                      <option>Master Healer</option>
                    </select>
                  </div>
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Area of Specialization</label>
                    <select className="sa-settings__input" value={healer.specialty} onChange={e => setHealer({...healer, specialty: e.target.value})}>
                      <option>Energy Healing</option>
                      <option>Meditation</option>
                      <option>Spiritual Therapy</option>
                      <option>Yoga Therapy</option>
                      <option>Chakra Healing</option>
                      <option>Mental Wellness</option>
                    </select>
                  </div>
                </div>

                <div className="sa-settings__form-grid">
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Years of Experience</label>
                    <input type="number" className="sa-settings__input" value={healer.experience} onChange={e => setHealer({...healer, experience: parseInt(e.target.value) || 0})} />
                  </div>
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Languages Known</label>
                    <input className="sa-settings__input" value={healer.languages} onChange={e => setHealer({...healer, languages: e.target.value})} placeholder="e.g. English, Tamil, Hindi" />
                  </div>
                </div>
              </div>

              {/* Section 4: Verification Documents */}
              <div className="sa-section">
                <div className="sa-section-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IonIcon icon={cloudUploadOutline} style={{ color: 'var(--color-primary)', fontSize: '20px' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Verification Documents</h2>
                  </div>
                </div>
                
                <div className="sa-settings__form-grid">
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">ID Proof (Aadhaar / PAN / Passport)</label>
                    <div className="sa-file-upload">
                      <IonIcon icon={cloudUploadOutline} />
                      <span>Upload ID Proof</span>
                      <input type="file" />
                    </div>
                  </div>
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Certification Upload</label>
                    <div className="sa-file-upload">
                      <IonIcon icon={cloudUploadOutline} />
                      <span>Upload Certification</span>
                      <input type="file" />
                    </div>
                  </div>
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">Profile Verification Status</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="sa-badge sa-badge--active" style={{ padding: '8px 16px' }}>Verified Practitioner</div>
                    <button className="sa-btn sa-btn--outline sa-btn--sm">Change Status</button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'flex-end', gap: '16px', paddingBottom: '40px' }}>
            <button className="sa-btn sa-btn--outline" onClick={() => history.push(ROUTES.SUPER_ADMIN.HEALERS)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleSave}>Save Profile</button>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditHealerPage;
