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
  medkitOutline,
  documentTextOutline,
  cloudUploadOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  pauseOutline,
  closeCircleOutline,
  peopleOutline,
} from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import './super-admin.css';

const EditPatientPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('phms_patients');
    if (saved) {
      const allPatients = JSON.parse(saved);
      const found = allPatients.find((p: any) => p.id.toString() === id);
      if (found) {
        setPatient({
          ...found,
          emergencyContact: found.emergencyContact || '',
          address: found.address || '',
          medicalHistory: found.medicalHistory || '',
        });
      }
    }
  }, [id]);

  const handleSave = () => {
    const saved = localStorage.getItem('phms_patients');
    if (saved) {
      const allPatients = JSON.parse(saved);
      const updatedPatients = allPatients.map((p: any) => 
        p.id.toString() === id ? { ...p, ...patient } : p
      );
      localStorage.setItem('phms_patients', JSON.stringify(updatedPatients));
      history.push(ROUTES.SUPER_ADMIN.PATIENTS);
    }
  };

  if (!patient) return null;

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref={ROUTES.SUPER_ADMIN.PATIENTS} text="" />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Edit Patient Record</IonTitle>
          <IonButtons slot="end">
            <IonButton className="sa-btn sa-btn--primary sa-btn--sm" onClick={handleSave} style={{ marginRight: '16px' }}>
              <IonIcon icon={saveOutline} slot="start" />
              <span className="sa-hide-on-mobile">Save Record</span>
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
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Patient Identity</h2>
                  </div>
                </div>
                
                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">Patient Full Name</label>
                  <input className="sa-settings__input" value={patient.name} onChange={e => setPatient({...patient, name: e.target.value})} placeholder="Full name of the patient" />
                </div>

                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <IonIcon icon={callOutline} style={{ color: 'var(--color-primary)', fontSize: '20px' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Contact Information </h2>
                  </div>
                  <div className="sa-settings__form-grid">
                    <div className="sa-settings__form-group">
                      <label className="sa-settings__label">Phone Number</label>
                      <input className="sa-settings__input" value={patient.phone} onChange={e => setPatient({...patient, phone: e.target.value})} />
                    </div>
                    <div className="sa-settings__form-group">
                      <label className="sa-settings__label">Email Address</label>
                      <input className="sa-settings__input" value={patient.email} onChange={e => setPatient({...patient, email: e.target.value})} />
                    </div>
                  </div>
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Emergency Contact Details</label>
                    <input className="sa-settings__input" value={patient.emergencyContact} onChange={e => setPatient({...patient, emergencyContact: e.target.value})} placeholder="Name and Relationship (Phone)" />
                  </div>
                </div>

                <div style={{ marginTop: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <IonIcon icon={locationOutline} style={{ color: 'var(--color-primary)', fontSize: '20px' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Address </h2>
                  </div>
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Residential/Communication Address</label>
                    <textarea className="sa-settings__input" style={{ height: '80px' }} value={patient.address} onChange={e => setPatient({...patient, address: e.target.value})} />
                  </div>
                </div>
              </div>

              {/* Section 2: Patient Status */}
              <div className="sa-section">
                <div className="sa-section-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IonIcon icon={alertCircleOutline} style={{ color: 'var(--color-primary)', fontSize: '20px' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Patient Status</h2>
                  </div>
                </div>
                
                <div className="sa-status-grid">
                  <button 
                    className={`sa-status-btn ${patient.status === 'active' ? 'active' : ''}`}
                    onClick={() => setPatient({...patient, status: 'active'})}
                  >
                    <IonIcon icon={checkmarkCircleOutline} /> Active 
                    <span>Currently receiving healing</span>
                  </button>
                  <button 
                    className={`sa-status-btn ${patient.status === 'on-hold' ? 'on-hold' : ''}`}
                    onClick={() => setPatient({...patient, status: 'on-hold'})}
                  >
                    <IonIcon icon={pauseOutline} /> On Hold 
                    <span>Temporarily paused</span>
                  </button>
                  <button 
                    className={`sa-status-btn ${patient.status === 'completed' ? 'completed' : ''}`}
                    onClick={() => setPatient({...patient, status: 'completed'})}
                  >
                    <IonIcon icon={checkmarkCircleOutline} /> Completed 
                    <span>Treatment successful</span>
                  </button>
                  <button 
                    className={`sa-status-btn ${patient.status === 'inactive' ? 'inactive' : ''}`}
                    onClick={() => setPatient({...patient, status: 'inactive'})}
                  >
                    <IonIcon icon={closeCircleOutline} /> Inactive
                    <span>No longer in system</span>
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Section 3: Medical & Care Details */}
              <div className="sa-section">
                <div className="sa-section-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IonIcon icon={medkitOutline} style={{ color: 'var(--color-primary)', fontSize: '20px' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Medical History </h2>
                  </div>
                </div>
                
                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">Conditions, Treatments & Allergies</label>
                  <textarea 
                    className="sa-settings__input" 
                    style={{ height: '80px' }} 
                    value={patient.medicalHistory} 
                    onChange={e => setPatient({...patient, medicalHistory: e.target.value})}
                    placeholder="Previous health conditions, treatments, allergies, medications, reports, or healing-related notes..."
                  />
                </div>

                <div className="sa-settings__form-group" style={{ marginTop: '16px' }}>
                  <label className="sa-settings__label">Assign Treatment Type</label>
                  <select 
                    className="sa-settings__input" 
                    value={patient.treatments?.[0] || ''} 
                    onChange={e => setPatient({...patient, treatments: [e.target.value]})}
                  >
                    <option value="">Select Treatment Type</option>
                    <option>Stress Relief Healing</option>
                    <option>Chakra Cleansing</option>
                    <option>Emotional Healing</option>
                    <option>Physical Pain Healing</option>
                    <option>Energy Balancing</option>
                    <option>Pranic Psychotherapy</option>
                    <option>Meditation Therapy</option>
                    <option>Distance Healing</option>
                    <option>Aura Cleansing</option>
                    <option>Relationship Healing</option>
                    <option>Sleep Disorder Healing</option>
                    <option>Anxiety Relief Healing</option>
                    <option>Depression Support Healing</option>
                    <option>Back Pain Healing</option>
                    <option>Migraine Relief Healing</option>
                    <option>Heart Chakra Healing</option>
                    <option>Solar Plexus Healing</option>
                    <option>General Wellness Healing</option>
                    <option>Follow-up Healing</option>
                    <option>Advanced Pranic Healing</option>
                  </select>
                </div>

                <div style={{ marginTop: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <IonIcon icon={peopleOutline} style={{ color: 'var(--color-primary)', fontSize: '20px' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Assigned Healer</h2>
                  </div>
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Responsible Healer</label>
                    <select className="sa-settings__input" value={patient.healer} onChange={e => setPatient({...patient, healer: e.target.value})}>
                      <option>Dr. Aris Varma</option>
                      <option>Maya Rose</option>
                      <option>Samuel Chen</option>
                      <option>Lila Thorne</option>
                      <option>Julian Mars</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 4: Document Management */}
              <div className="sa-section">
                <div className="sa-section-header" style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '12px', marginBottom: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IonIcon icon={documentTextOutline} style={{ color: 'var(--color-primary)', fontSize: '20px' }} />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>Uploaded Documents </h2>
                  </div>
                </div>
                
                <div className="sa-docs-grid">
                  <div className="sa-doc-upload-item">
                    <label>Medical Reports</label>
                    <div className="sa-file-mini-upload">
                      <IonIcon icon={cloudUploadOutline} />
                      <input type="file" />
                    </div>
                  </div>
                  <div className="sa-doc-upload-item">
                    <label>Lab Results</label>
                    <div className="sa-file-mini-upload">
                      <IonIcon icon={cloudUploadOutline} />
                      <input type="file" />
                    </div>
                  </div>
                  <div className="sa-doc-upload-item">
                    <label>Prescriptions</label>
                    <div className="sa-file-mini-upload">
                      <IonIcon icon={cloudUploadOutline} />
                      <input type="file" />
                    </div>
                  </div>
                  <div className="sa-doc-upload-item">
                    <label>Scan Images</label>
                    <div className="sa-file-mini-upload">
                      <IonIcon icon={cloudUploadOutline} />
                      <input type="file" />
                    </div>
                  </div>
                  <div className="sa-doc-upload-item">
                    <label>Consultation Notes</label>
                    <div className="sa-file-mini-upload">
                      <IonIcon icon={cloudUploadOutline} />
                      <input type="file" />
                    </div>
                  </div>
                  <div className="sa-doc-upload-item">
                    <label>ID Proofs</label>
                    <div className="sa-file-mini-upload">
                      <IonIcon icon={cloudUploadOutline} />
                      <input type="file" />
                    </div>
                  </div>
                  <div className="sa-doc-upload-item">
                    <label>Healing Records</label>
                    <div className="sa-file-mini-upload">
                      <IonIcon icon={cloudUploadOutline} />
                      <input type="file" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="sa-page__footer-actions">
            <button className="sa-btn sa-btn--outline" onClick={() => history.push(ROUTES.SUPER_ADMIN.PATIENTS)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleSave}>Save Record</button>
          </div>
        </div>
      </IonContent>

      <style dangerouslySetInnerHTML={{ __html: `
        .sa-status-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 16px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
          gap: 6px;
        }
        .sa-status-btn ion-icon { font-size: 20px; }
        .sa-status-btn span { font-size: 11px; opacity: 0.7; }
        .sa-status-btn:hover { border-color: var(--color-primary); background: #f0f7ff; }
        
        .sa-status-btn.active.active { border-color: #10b981; background: #ecfdf5; color: #059669; }
        .sa-status-btn.on-hold.on-hold { border-color: #f59e0b; background: #fffbeb; color: #d97706; }
        .sa-status-btn.completed.completed { border-color: #3b82f6; background: #eff6ff; color: #2563eb; }
        .sa-status-btn.inactive.inactive { border-color: #ef4444; background: #fef2f2; color: #dc2626; }
        
        .sa-doc-upload-item { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .sa-doc-upload-item label { font-size: 13px; font-weight: 600; color: #475569; }
        .sa-file-mini-upload {
          height: 44px;
          width: 100%;
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          background: #f8fafc;
          transition: all 0.2s ease;
        }
        .sa-file-mini-upload:hover { border-color: var(--color-primary); background: #f0f7ff; }
        .sa-file-mini-upload input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
        .sa-file-mini-upload ion-icon { font-size: 20px; color: #94a3b8; }
      `}} />
    </IonPage>
  );
};

export default EditPatientPage;
