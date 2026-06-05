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
  peopleOutline,
  searchOutline,
  phonePortraitOutline,
  calendarOutline,
  arrowBackOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import '../branch-admin/branch-admin.css';
import './Healers.css';

export interface PatientDoc {
  name: string;
  type: string;
  date: string;
}

export interface MedicalHistoryItem {
  condition: string;
  diagnosedDate: string;
  notes: string;
}

export interface PatientMock {
  id: string;
  name: string;
  patientId: string;
  phone: string;
  gender: string;
  age: number;
  bloodGroup: string;
  email: string;
  dob: string;
  occupation: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  condition: string;
  lastSession: string;
  status: string;
  assignedHealer: string;
  history: MedicalHistoryItem[];
  documents: PatientDoc[];
}

export const mockPatients: PatientMock[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    patientId: 'PAT-10023',
    phone: '+91 98765 43210',
    gender: 'Male',
    age: 45,
    bloodGroup: 'O+',
    email: 'rajesh.kumar@gmail.com',
    dob: '1981-04-12',
    occupation: 'Software Engineer',
    addressLine1: 'Flat 402, Sai Kripa Heights',
    addressLine2: 'Link Road, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    address: 'Flat 402, Sai Kripa Heights, Andheri West, Mumbai',
    condition: 'Chronic Back Pain',
    lastSession: '2026-06-01',
    status: 'Active',
    assignedHealer: 'Dr. David',
    history: [
      { condition: 'L4-L5 Herniated Disc', diagnosedDate: '2025-11-15', notes: 'Severe lower back pain radiating to left leg. Recommended for conservative therapy.' },
      { condition: 'Hypertension', diagnosedDate: '2024-03-10', notes: 'Controlled with medications.' }
    ],
    documents: [
      { name: 'MRI_Spine_Lumbar.pdf', type: 'Lab Report', date: '2025-11-20' },
      { name: 'Consultation_Notes_Dr_Joshi.pdf', type: 'Consultation Note', date: '2025-11-22' },
    ]
  },
  {
    id: '2',
    name: 'Priya Sharma',
    patientId: 'PAT-10045',
    phone: '+91 87654 32109',
    gender: 'Female',
    age: 34,
    bloodGroup: 'A+',
    email: 'priya.sharma@yahoo.com',
    dob: '1992-08-24',
    occupation: 'Graphic Designer',
    addressLine1: 'Building 12B, Clover Park',
    addressLine2: 'Viman Nagar',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411014',
    address: 'Building 12B, Clover Park, Pune',
    condition: 'Anxiety & Migraine',
    lastSession: '2026-06-03',
    status: 'Active',
    assignedHealer: 'Dr. David',
    history: [
      { condition: 'Generalized Anxiety Disorder', diagnosedDate: '2025-06-05', notes: 'Presents with stress, muscle tension, and insomnia.' },
      { condition: 'Chronic Migraine', diagnosedDate: '2023-09-12', notes: 'Triggered by stress and bright lights.' }
    ],
    documents: [
      { name: 'Neurologist_Consultation_Priya.pdf', type: 'Consultation Note', date: '2025-07-02' },
      { name: 'EEG_Report.pdf', type: 'Lab Report', date: '2025-06-30' },
    ]
  },
  {
    id: '3',
    name: 'Amit Patel',
    patientId: 'PAT-10088',
    phone: '+91 76543 21098',
    gender: 'Male',
    age: 52,
    bloodGroup: 'B+',
    email: 'amit.patel@gmail.com',
    dob: '1974-12-05',
    occupation: 'Business Owner',
    addressLine1: 'Shanti Sadan',
    addressLine2: 'Opp. Municipal Market, CG Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '380009',
    address: 'Shanti Sadan, CG Road, Ahmedabad',
    condition: 'Post-stroke Rehabilitation',
    lastSession: '2026-05-28',
    status: 'On Hold',
    assignedHealer: 'Dr. David',
    history: [
      { condition: 'Ischemic Stroke', diagnosedDate: '2025-08-01', notes: 'Left-sided weakness. Undergoing occupational and healing sessions.' }
    ],
    documents: [
      { name: 'Discharge_Summary_Fortis.pdf', type: 'Doctor Report', date: '2025-08-15' },
      { name: 'Physiotherapy_Assessment_Amit.pdf', type: 'Other Document', date: '2025-09-01' },
    ]
  },
  {
    id: '4',
    name: 'Sunita Rao',
    patientId: 'PAT-10112',
    phone: '+91 65432 10987',
    gender: 'Female',
    age: 29,
    bloodGroup: 'AB+',
    email: 'sunita.rao@hotmail.com',
    dob: '1997-02-18',
    occupation: 'Content Writer',
    addressLine1: 'RMV Extension',
    addressLine2: 'Near Veterinary College, Sadashivnagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560080',
    address: 'RMV Extension, Sadashivnagar, Bengaluru',
    condition: 'Insomnia',
    lastSession: '2026-06-02',
    status: 'Completed',
    assignedHealer: 'Dr. David',
    history: [
      { condition: 'Primary Insomnia', diagnosedDate: '2026-01-20', notes: 'Difficulty falling asleep. Stress-induced. Responding well to relaxation therapies.' }
    ],
    documents: [
      { name: 'Sleep_Study_Analysis.pdf', type: 'Lab Report', date: '2026-02-05' }
    ]
  },
  {
    id: '5',
    name: 'Vikram Singh',
    patientId: 'PAT-10156',
    phone: '+91 54321 09876',
    gender: 'Male',
    age: 60,
    bloodGroup: 'O-',
    email: 'vikram.singh@gurgaonlabs.com',
    dob: '1966-06-30',
    occupation: 'Retired Bank Manager',
    addressLine1: 'House No 14',
    addressLine2: 'Sector 15',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122001',
    address: 'House No 14, Sector 15, Gurgaon',
    condition: 'Arthritis Pain Management',
    lastSession: '2026-05-30',
    status: 'Inactive',
    assignedHealer: 'Dr. David',
    history: [
      { condition: 'Osteoarthritis', diagnosedDate: '2022-04-14', notes: 'Pain in bilateral knee joints. Pain worsens with activity.' }
    ],
    documents: [
      { name: 'XRay_Knee_Bilateral.pdf', type: 'Lab Report', date: '2025-10-10' },
      { name: 'Orthopedic_Referral_Vikram.pdf', type: 'Doctor Report', date: '2025-10-15' }
    ]
  }
];

const MyPatientsPage: React.FC = () => {
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <button className="healer-back-btn" onClick={() => history.push('/healer/dashboard')}>
              <IonIcon icon={arrowBackOutline} />
            </button>
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Assigned Patients</IonTitle>
          <IonButtons slot="end">
            <IonMenuButton />
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="healer-container">
          
          {/* Search Bar */}
          <div className="healer-search-bar">
            <IonIcon icon={searchOutline} className="healer-search-bar__icon" />
            <input
              type="text"
              placeholder="Search assigned patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="healer-search-bar__input"
            />
          </div>

          <h3 className="healer-sub-title">
            Assigned Patients List (BRD 6.9)
          </h3>

          <div className="healer-actions-list">
            {filteredPatients.map(patient => (
              <div 
                key={patient.id} 
                className="dm-stat-card healer-patient-card" 
                onClick={() => {
                  history.push(`/healer/patients/details/${patient.id}`);
                }}
              >
                <div className="healer-patient-card__header">
                  <div className="healer-patient-card__header-top">
                    <div className="healer-patient-card__badges">
                      <span className="healer-badge">
                        {patient.patientId}
                      </span>
                      <span className={`healer-status-badge-inline healer-status-badge-inline--${patient.status.toLowerCase().replace(' ', '-')}`}>
                        {patient.status}
                      </span>
                    </div>
                    <span className="healer-patient-card__assigned">
                      Healer: {patient.assignedHealer}
                    </span>
                  </div>
                  <div>
                    <h4 className="healer-patient-card__name">
                      {patient.name}
                    </h4>
                    <p className="healer-patient-card__info">
                      {patient.gender}, {patient.age} years | <strong>{patient.condition}</strong>
                    </p>
                  </div>
                </div>

                <div className="healer-patient-card__footer">
                  <div className="healer-footer-item">
                    <IonIcon icon={phonePortraitOutline} className="healer-footer-item__icon" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="healer-footer-item">
                    <IonIcon icon={calendarOutline} className="healer-footer-item__icon" />
                    <span>Last Session: {patient.lastSession}</span>
                  </div>
                </div>
              </div>
            ))}

            {filteredPatients.length === 0 && (
              <div className="healer-empty-state">
                <IonIcon icon={peopleOutline} className="healer-empty-state__icon" />
                <p>No patients found.</p>
              </div>
            )}
          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default MyPatientsPage;
