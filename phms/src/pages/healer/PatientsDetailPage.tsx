import React, { useState } from 'react';
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
  personOutline,
  medicalOutline,
  documentTextOutline,
} from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { mockPatients, PatientDoc, PatientMock } from './MyPatientsPage';
import './Healers.css';

const PatientsDetailPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'documents'>('profile');
  const [selectedDoc, setSelectedDoc] = useState<PatientDoc | null>(null);

  const patient = mockPatients.find(p => p.id === id);

  if (!patient) {
    return (
      <IonPage className="sa-page">
        <IonHeader className="ion-no-border">
          <IonToolbar className="sa-page__toolbar">
            <IonButtons slot="start">
              <button className="healer-back-btn" onClick={() => history.push('/healer/patients')}>
                <IonIcon icon={arrowBackOutline} />
              </button>
            </IonButtons>
            <IonTitle className="sa-page__toolbar-title">Patient Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="sa-page__content">
          <div className="healer-container">
            <div className="healer-empty-state">
              <p>Patient not found.</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  const renderMockDocumentContent = (doc: PatientDoc, p: PatientMock) => {
    const docName = doc.name.toLowerCase();

    if (docName.includes('mri')) {
      return (
        <div className="healer-doc-paper">
          <div className="healer-doc-header">
            <div className="healer-doc-logo">NPHMS IMAGING CENTER</div>
            <div className="healer-doc-meta-right">
              <div><strong>Report ID:</strong> RAD-2026-9931</div>
              <div><strong>Date:</strong> {doc.date}</div>
            </div>
          </div>
          
          <hr className="healer-doc-divider" />
          
          <div className="healer-doc-patient-info">
            <h3>MRI CLINICAL STUDY REPORT</h3>
            <div className="healer-doc-info-grid">
              <div><strong>Patient Name:</strong> {p.name}</div>
              <div><strong>Age / Gender:</strong> {p.age} / {p.gender}</div>
              <div><strong>Referred By:</strong> Dr. Nilesh Joshi</div>
              <div><strong>Modality:</strong> MRI Lumbar Spine (3.0T)</div>
            </div>
          </div>
          
          <div className="healer-doc-body">
            <h4>CLINICAL INDICATION</h4>
            <p>Chronic lower back pain with radiation to the left lower extremity. Suspected radiculopathy.</p>
            
            <h4>FINDINGS</h4>
            <p><strong>Sagittal and Axial T1 & T2 weighted sequences of the lumbar spine:</strong></p>
            <ul>
              <li><strong>L1-L2, L2-L3, L3-L4:</strong> Normal disc heights. No evidence of bulge, herniation, or canal stenosis.</li>
              <li><strong>L4-L5:</strong> Prominent left paracentral herniation (extrusion) of the nucleus pulposus measuring approximately 6.5mm, causing moderate compression on the descending left L5 nerve root. Mild narrowing of the left neural foramina is observed.</li>
              <li><strong>L5-S1:</strong> Mild diffuse disc bulge without significant root impingement or canal stenosis.</li>
              <li><strong>Conus Medullaris:</strong> Normal signal intensity, terminates at L1.</li>
            </ul>
            
            <h4>IMPRESSION</h4>
            <ol>
              <li>Left paracentral herniated nucleus pulposus at L4-L5 causing moderate mass effect and compression of the left L5 nerve root.</li>
              <li>Mild degenerative changes of the L5-S1 disc.</li>
            </ol>
          </div>
          
          <div className="healer-doc-footer">
            <div className="healer-doc-signature">
              <div className="signature-line"></div>
              <strong>Dr. Rajeshwari Iyer, MD</strong>
              <span>Consultant Radiologist</span>
            </div>
          </div>
        </div>
      );
    }

    if (docName.includes('consultation')) {
      const isPriya = p.name.includes('Priya');
      return (
        <div className="healer-doc-paper">
          <div className="healer-doc-header healer-doc-header--clinic">
            <div className="healer-doc-logo">
              <h2>DR. NILESH JOSHI, MD</h2>
              <span>Consultant Neurologist & Spine Specialist</span>
            </div>
            <div className="healer-doc-meta-right">
              <div>Reg No: 58821-A</div>
              <div>Date: {doc.date}</div>
            </div>
          </div>
          
          <hr className="healer-doc-divider healer-doc-divider--prescription" />
          
          <div className="healer-doc-patient-info">
            <div className="healer-doc-info-grid">
              <div><strong>Patient:</strong> {p.name}</div>
              <div><strong>Age/Gender:</strong> {p.age} / {p.gender}</div>
              <div><strong>Phone:</strong> {p.phone}</div>
              <div><strong>Status:</strong> OP Referral</div>
            </div>
          </div>
          
          <div className="healer-doc-body">
            <h4>CLINICAL OBSERVATIONS</h4>
            {isPriya ? (
              <p>Patient presents with severe anxiety episodes, somatic muscle tension, and weekly chronic migraines. Migraines are preceded by visual auras and triggered by intense sensory environments or high stress. Conventional medications have yielded partial relief. Advised complementary energy healing sessions for nervous system relaxation.</p>
            ) : (
              <p>Patient presents with recurrent lower back pain radiating down the left thigh (sciatic path). Pain has increased over the past 3 months, worsening with prolonged sitting. MRI reports confirm L4-L5 herniated disc compressing the left L5 nerve root. Recommended conservative management including specialized energy healing therapies for pain modulation and inflammation reduction before surgery is considered.</p>
            )}
            
            <h4>RECOMMENDED PLAN</h4>
            <ul>
              <li>Avoid heavy lifting, sudden twisting, or high-impact activities.</li>
              <li>Initiate target energy healing therapy sessions (2-3 times a week) to relieve muscle spasms.</li>
              <li>Incorporate gentle stretching exercises (hamstring, cat-cow) only if pain permits.</li>
              <li>Re-evaluate neurological symptoms (reflexes, muscle strength) in 4 weeks.</li>
            </ul>
          </div>
          
          <div className="healer-doc-footer">
            <div className="healer-doc-signature">
              <div className="signature-line"></div>
              <strong>Dr. Nilesh Joshi, MD</strong>
              <span>Neurologist</span>
            </div>
          </div>
        </div>
      );
    }

    if (docName.includes('eeg')) {
      return (
        <div className="healer-doc-paper">
          <div className="healer-doc-header">
            <div className="healer-doc-logo">METROPOLIS NEURO-LAB</div>
            <div className="healer-doc-meta-right">
              <div><strong>Lab Report ID:</strong> EEG-99212</div>
              <div><strong>Date:</strong> {doc.date}</div>
            </div>
          </div>
          
          <hr className="healer-doc-divider" />
          
          <div className="healer-doc-patient-info">
            <h3>ELECTROENCEPHALOGRAPHY (EEG) REPORT</h3>
            <div className="healer-doc-info-grid">
              <div><strong>Patient Name:</strong> {p.name}</div>
              <div><strong>Age / Gender:</strong> {p.age} / {p.gender}</div>
              <div><strong>Referred By:</strong> Dr. Nilesh Joshi</div>
              <div><strong>Technique:</strong> 10-20 System Electrode Placement</div>
            </div>
          </div>
          
          <div className="healer-doc-body">
            <h4>RECORDING CONDITIONS</h4>
            <p>Awake state with eyes open and closed, hyperventilation for 3 minutes, and photic stimulation.</p>
            
            <h4>FINDINGS</h4>
            <ul>
              <li><strong>Background Activity:</strong> Alpha rhythm of 9.5 Hz, symmetrical and responsive to eye opening, mostly over posterior head regions.</li>
              <li><strong>Photic Stimulation:</strong> Occipital driving response observed at various flash rates without epileptiform discharges.</li>
              <li><strong>Hyperventilation:</strong> Caused mild, diffuse, symmetrical slowing of background activity. No paroxysmal activity triggered.</li>
              <li><strong>Epileptiform Activity:</strong> No focal spikes, sharp waves, or spike-wave complexes noted during recording.</li>
            </ul>
            
            <h4>IMPRESSION</h4>
            <p>Normal awake electroencephalogram. No electrographic evidence of focal or generalized epileptiform activity during the study.</p>
          </div>
          
          <div className="healer-doc-footer">
            <div className="healer-doc-signature">
              <div className="signature-line"></div>
              <strong>Dr. Anita Deshmukh, MD</strong>
              <span>Consultant Neurologist</span>
            </div>
          </div>
        </div>
      );
    }

    if (docName.includes('discharge')) {
      return (
        <div className="healer-doc-paper">
          <div className="healer-doc-header">
            <div className="healer-doc-logo">FORTIS HOSPITALS</div>
            <div className="healer-doc-meta-right">
              <div><strong>Discharge Summary No:</strong> IP-550912</div>
              <div><strong>Discharge Date:</strong> {doc.date}</div>
            </div>
          </div>
          
          <hr className="healer-doc-divider" />
          
          <div className="healer-doc-patient-info">
            <h3>CLINICAL DISCHARGE SUMMARY</h3>
            <div className="healer-doc-info-grid">
              <div><strong>Patient Name:</strong> {p.name}</div>
              <div><strong>Age / Gender:</strong> {p.age} / {p.gender}</div>
              <div><strong>Admission Date:</strong> 2025-08-01</div>
              <div><strong>Discharge Status:</strong> Stable / Ambulatory</div>
            </div>
          </div>
          
          <div className="healer-doc-body">
            <h4>DIAGNOSIS</h4>
            <p>Acute Ischemic Stroke involving the right middle cerebral artery (MCA) territory. Resulting in left-sided hemiparesis.</p>
            
            <h4>SUMMARY OF HOSPITAL COURSE</h4>
            <p>Patient was admitted with sudden onset of left-sided weakness and slurred speech. Received thrombolytic therapy within window. Monitored in ICU. Symptoms stabilized. Left-sided limb mobility has improved significantly from 1/5 to 3/5. Remitted for intensive outpatient physical and energy healing rehabilitation.</p>
            
            <h4>OUTPATIENT ADVICE</h4>
            <ul>
              <li>Continue antiplatelet and antihypertensive therapy as prescribed.</li>
              <li>Undergo physical and occupational rehabilitation daily.</li>
              <li>Energy healing sessions scheduled weekly to aid motor recovery and energy balancing.</li>
            </ul>
          </div>
          
          <div className="healer-doc-footer">
            <div className="healer-doc-signature">
              <div className="signature-line"></div>
              <strong>Dr. Sameer Mehta, DM</strong>
              <span>Chief Neurologist</span>
            </div>
          </div>
        </div>
      );
    }

    // Fallback / default document view for others
    return (
      <div className="healer-doc-paper">
        <div className="healer-doc-header">
          <div className="healer-doc-logo">NPHMS MEDICAL ARCHIVE</div>
          <div className="healer-doc-meta-right">
            <div><strong>Document ID:</strong> DOC-{p.patientId}-{doc.date.replace(/-/g, '')}</div>
            <div><strong>Date:</strong> {doc.date}</div>
          </div>
        </div>
        
        <hr className="healer-doc-divider" />
        
        <div className="healer-doc-patient-info">
          <h3>{doc.type.toUpperCase()}: {doc.name.replace('.pdf', '')}</h3>
          <div className="healer-doc-info-grid">
            <div><strong>Patient Name:</strong> {p.name}</div>
            <div><strong>Age / Gender:</strong> {p.age} / {p.gender}</div>
            <div><strong>Patient ID:</strong> {p.patientId}</div>
            <div><strong>Status:</strong> Logged Document</div>
          </div>
        </div>
        
        <div className="healer-doc-body">
          <h4>DOCUMENT DESCRIPTION</h4>
          <p>This is a scanned file upload of a patient medical record. The authenticity of this electronic copy has been verified by the clinic archives.</p>
          
          <h4>RECORD DETAIL</h4>
          <p>This record corresponds to clinical observations for {p.name}. The diagnosis of <strong>{p.condition}</strong> is active. The recommended healing regimens should be modified according to the diagnostic contents of this clinical record.</p>
          
          <h4>CLINICAL NOTE</h4>
          <p>Please contact the primary healthcare provider or the assigned healer, {p.assignedHealer}, for diagnostic interpretations regarding this patient chart.</p>
        </div>
        
        <div className="healer-doc-footer">
          <div className="healer-doc-signature">
            <div className="signature-line"></div>
            <strong>NPHMS Clinic Registrar</strong>
            <span>Medical Records Department</span>
          </div>
        </div>
      </div>
    );
  };

  if (selectedDoc) {
    return (
      <IonPage className="sa-page">
        <IonHeader className="ion-no-border">
          <IonToolbar className="sa-page__toolbar">
            <IonButtons slot="start">
              <button className="healer-back-btn" onClick={() => setSelectedDoc(null)}>
                <IonIcon icon={arrowBackOutline} />
              </button>
            </IonButtons>
            <IonTitle className="sa-page__toolbar-title">{selectedDoc.name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="healer-doc-viewer-content">
          <div className="healer-doc-viewer-container">
            {renderMockDocumentContent(selectedDoc, patient)}
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
            <button className="healer-back-btn" onClick={() => history.push('/healer/patients')}>
              <IonIcon icon={arrowBackOutline} />
            </button>
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">{patient.name} - Case File</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="healer-container">
          
          <div className="healer-header-box">
            <h2 className="healer-page-title">{patient.name}</h2>
            <p className="healer-page-subtitle">Patient ID: {patient.patientId} | Status: {patient.status}</p>
          </div>

          {/* Tabs */}
          <div className="healer-modal-tabs">
            {(['profile', 'history', 'documents'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`healer-modal-tab-btn ${activeTab === tab ? 'healer-modal-tab-btn--active' : ''}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          {activeTab === 'profile' && (
            <div className="dm-stat-card healer-detail-card">
              <div className="healer-detail-card__header-title-box">
                <IonIcon icon={personOutline} className="healer-detail-card__header-icon" />
                <h3 className="healer-detail-card__header-title">General Information</h3>
              </div>

              <div className="healer-detail-grid">
                <div>
                  <span className="healer-detail-grid__label">PATIENT ID</span>
                  <strong>{patient.patientId}</strong>
                </div>
                <div>
                  <span className="healer-detail-grid__label">FULL NAME</span>
                  <strong>{patient.name}</strong>
                </div>
                <div>
                  <span className="healer-detail-grid__label">AGE / GENDER</span>
                  <strong>{patient.age} yrs / {patient.gender}</strong>
                </div>
                <div>
                  <span className="healer-detail-grid__label">BLOOD GROUP</span>
                  <strong>{patient.bloodGroup}</strong>
                </div>
                <div>
                  <span className="healer-detail-grid__label">EMAIL ID</span>
                  <strong>{patient.email}</strong>
                </div>
                <div>
                  <span className="healer-detail-grid__label">PHONE NUMBER</span>
                  <strong>{patient.phone}</strong>
                </div>
                <div>
                  <span className="healer-detail-grid__label">DATE OF BIRTH</span>
                  <strong>{patient.dob}</strong>
                </div>
                <div>
                  <span className="healer-detail-grid__label">OCCUPATION</span>
                  <strong>{patient.occupation}</strong>
                </div>
                <div>
                  <span className="healer-detail-grid__label">ADDRESS LINE 1</span>
                  <strong>{patient.addressLine1}</strong>
                </div>
                <div>
                  <span className="healer-detail-grid__label">ADDRESS LINE 2</span>
                  <strong>{patient.addressLine2}</strong>
                </div>
                <div>
                  <span className="healer-detail-grid__label">CITY</span>
                  <strong>{patient.city}</strong>
                </div>
                <div>
                  <span className="healer-detail-grid__label">STATE</span>
                  <strong>{patient.state}</strong>
                </div>
                <div>
                  <span className="healer-detail-grid__label">PINCODE</span>
                  <strong>{patient.pincode}</strong>
                </div>
                <div>
                  <span className="healer-detail-grid__label">PATIENT STATUS</span>
                  <span className={`healer-status-badge-inline healer-status-badge-inline--${patient.status.toLowerCase().replace(' ', '-')}`}>
                    {patient.status}
                  </span>
                </div>
                <div className="healer-grid-col-span-2">
                  <span className="healer-detail-grid__label">ASSIGNED HEALER</span>
                  <strong>{patient.assignedHealer}</strong>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="healer-actions-list">
              <div className="dm-stat-card healer-detail-card">
                <div className="healer-detail-card__header-title-box">
                  <IonIcon icon={medicalOutline} className="healer-detail-card__header-icon" />
                  <h3 className="healer-detail-card__header-title">Medical History</h3>
                </div>

                <div className="healer-history-list">
                  {patient.history.map((hist, idx) => (
                    <div key={idx} className="healer-history-item">
                      <div className="healer-history-item__header">
                        <strong>{hist.condition}</strong>
                        <span className="healer-history-item__date">Diagnosed: {hist.diagnosedDate}</span>
                      </div>
                      <p className="healer-history-item__notes">{hist.notes}</p>
                    </div>
                  ))}
                  {patient.history.length === 0 && (
                    <p className="healer-empty-state" style={{ padding: '20px', margin: 0 }}>No medical history logged for this patient.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="dm-stat-card healer-detail-card">
              <div className="healer-detail-card__header-title-box">
                <IonIcon icon={documentTextOutline} className="healer-detail-card__header-icon" />
                <h3 className="healer-detail-card__header-title">Uploaded Documents</h3>
              </div>

              <div className="healer-documents-list">
                {patient.documents.map((doc, idx) => (
                  <div key={idx} className="healer-document-item" onClick={() => setSelectedDoc(doc)}>
                    <div>
                      <strong className="healer-document-item__name">{doc.name}</strong>
                      <span className="healer-document-item__badge">
                        {doc.type}
                      </span>
                    </div>
                    <span className="healer-document-item__date">{doc.date}</span>
                  </div>
                ))}

                {patient.documents.length === 0 && (
                  <p className="healer-empty-state" style={{ padding: '20px', margin: 0 }}>No documents uploaded for this patient.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PatientsDetailPage;
