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
  medkitOutline,
  heartOutline,
  shieldCheckmarkOutline,
  calendarOutline,
  callOutline,
  alertCircleOutline,
  cameraOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import AppCard from '../../components/common/AppCard';
import '../branch-admin/branch-admin.css';
import '../healer/Healers.css';
import './Patient.css';

const ProfilePage: React.FC = () => {
  const history = useHistory();
  const { user, updateUser } = useAuthStore();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const userName = user?.name || 'Valued Patient';
  const userEmail = user?.email || 'patient@phms.com';
  const userPhone = user?.phoneNumber || '+91 98765 43210';

  const rawBranch = typeof user?.branch === 'object' && user?.branch !== null
    ? (user.branch as any).name
    : (user?.branch || 'Mumbai Main');
  const branchName = rawBranch.toLowerCase().includes('branch') ? rawBranch : `${rawBranch} Branch`;

  // Default patient values for fallback
  const defaultPatient = {
    id: user?.id || 'pat-1',
    name: userName,
    email: userEmail,
    mobile: userPhone,
    gender: 'Male' as const,
    age: 35,
    bloodGroup: 'O+ ',
    dateOfBirth: '1991-04-12',
    occupation: 'Software Engineer',
    assignedHealer: 'Dr. Shailesh',
    regDate: '2025-10-15',
    lastVisitDate: '2026-06-01',
    status: 'Active' as const,
    address: '404 Tranquil Hills, Powai, Mumbai',
    treatmentType: 'Basic Pranic Healing',
    emergencyContact: {
      name: 'Anjali Sharma',
      relation: 'Spouse',
      mobile: '+91 98765 43219'
    },
    medicalInfo: {
      conditions: ['Chronic Fatigue', 'Mild Insomnia'],
    },
    profilePhoto: user?.avatar || ''
  };

  // State
  const [currentPatient, setCurrentPatient] = React.useState<any>(null);

  React.useEffect(() => {
    const savedPatients = localStorage.getItem('phms_patients');
    let list: any[] = [];
    if (savedPatients) {
      try {
        list = JSON.parse(savedPatients);
      } catch (e) {
        console.error(e);
      }
    }

    // Match patient by email
    let foundPatient = list.find((p: any) => p.email?.toLowerCase() === userEmail.toLowerCase());
    if (foundPatient) {
      // Sync auth avatar to patient profilePhoto if not set
      if (!foundPatient.profilePhoto && user?.avatar) {
        foundPatient.profilePhoto = user.avatar;
        const updatedList = list.map((p: any) => 
          p.email?.toLowerCase() === userEmail.toLowerCase() ? foundPatient : p
        );
        localStorage.setItem('phms_patients', JSON.stringify(updatedList));
      }
      setCurrentPatient(foundPatient);
    } else {
      // Add default patient to localStorage if not found so they exist
      setCurrentPatient(defaultPatient);
      list.push(defaultPatient);
      localStorage.setItem('phms_patients', JSON.stringify(list));
    }
  }, [userEmail, userName, userPhone, rawBranch, user?.avatar]);

  // Save updates to localStorage and state
  const savePatientUpdates = (updatedFields: any) => {
    const activePatient = currentPatient || { ...defaultPatient };
    const mergedPatient = { ...activePatient, ...updatedFields };

    setCurrentPatient(mergedPatient);

    const savedPatients = localStorage.getItem('phms_patients');
    let list: any[] = [];
    if (savedPatients) {
      try {
        list = JSON.parse(savedPatients);
      } catch (e) {
        console.error(e);
      }
    }

    const updatedList = list.map((p: any) => 
      p.email?.toLowerCase() === userEmail.toLowerCase() ? mergedPatient : p
    );
    if (!updatedList.some((p: any) => p.email?.toLowerCase() === userEmail.toLowerCase())) {
      updatedList.push(mergedPatient);
    }
    
    localStorage.setItem('phms_patients', JSON.stringify(updatedList));

    // Update global auth store state
    if (updatedFields.profilePhoto !== undefined) {
      updateUser({ avatar: updatedFields.profilePhoto });
    }
  };

  // Base64 converter for local profile image uploading
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        savePatientUpdates({ profilePhoto: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const patient = currentPatient || defaultPatient;
  const initials = patient.name
    ? `${patient.name[0] || 'P'}${patient.name.split(' ')?.[1]?.[0] || 'T'}`.toUpperCase()
    : 'PT';

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <button className="healer-back-btn" onClick={() => history.push('/patient/dashboard')}>
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
        <div className="healer-container">
          
          <div className="healer-profile-grid">
            
            {/* Left Column */}
            <div className="healer-profile-left-col">
              
              {/* Profile Card */}
              <AppCard padding="large" shadow>
                <div className="healer-profile-photo-section">
                  <div className="healer-avatar-wrapper pat-avatar-wrapper-override" onClick={() => fileInputRef.current?.click()}>
                    {patient.profilePhoto ? (
                      <img src={patient.profilePhoto} alt="Patient Profile" className="healer-avatar-img" />
                    ) : (
                      <div className="healer-avatar-initials pat-avatar-initials-override">{initials}</div>
                    )}
                    <div className="healer-avatar-hover-overlay">
                      <IonIcon icon={cameraOutline} />
                      <span>Upload</span>
                    </div>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="pat-display-none"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />

                  <button className="healer-photo-upload-btn" onClick={() => fileInputRef.current?.click()}>
                    Upload / Update Photo
                  </button>

                  <div className="pat-profile-title-container">
                    <h2 className="pat-profile-name-title">
                      {patient.name}
                    </h2>
                    <span className={`healer-status-badge ${
                      patient.status === 'Active' || patient.status === 'Completed'
                        ? 'healer-status-badge--completed' 
                        : patient.status === 'On Hold'
                          ? 'healer-status-badge--scheduled'
                          : 'healer-status-badge--partial'
                    }`}>
                      {patient.status}
                    </span>
                  </div>

                  <div className="pat-profile-divider-box">
                    <div className="pat-profile-row-item">
                      <span className="pat-label-gray">Patient ID</span>
                      <strong className="pat-val-dark">{patient.id}</strong>
                    </div>
                    <div className="pat-profile-row-item">
                      <span className="pat-label-gray">Registered On</span>
                      <strong className="pat-val-dark">{patient.regDate}</strong>
                    </div>
                    <div className="pat-profile-row-item-no-margin">
                      <span className="pat-label-gray">Last Visit</span>
                      <strong className="pat-val-dark">{patient.lastVisitDate}</strong>
                    </div>
                  </div>
                </div>
              </AppCard>

              {/* Emergency Contact */}
              <AppCard padding="large" shadow>
                <h3 className="pat-card-title">
                  Emergency Contact
                </h3>
                <div className="pat-vertical-list-12">
                  <div className="pat-flex-align-center-gap12">
                    <IonIcon icon={alertCircleOutline} className="pat-alert-icon-red" />
                    <div>
                      <span className="healer-credential-card__label pat-alert-label-red">CONTACT PERSON</span>
                      <strong className="pat-val-dark-13">
                        {patient.emergencyContact?.name || 'Not Assigned'} ({patient.emergencyContact?.relation || 'Spouse'})
                      </strong>
                    </div>
                  </div>
                  <div className="pat-flex-align-center-gap12">
                    <IonIcon icon={callOutline} className="pat-alert-icon-red" />
                    <div>
                      <span className="healer-credential-card__label pat-alert-label-red">PHONE NUMBER</span>
                      <strong className="pat-val-dark-13">{patient.emergencyContact?.mobile || 'N/A'}</strong>
                    </div>
                  </div>
                </div>
              </AppCard>

            </div>

            {/* Right Column */}
            <div className="healer-profile-right-col">
              
              {/* Personal & Medical Info */}
              <AppCard padding="large" shadow>
                <h3 className="pat-card-title-16-m16">
                  Personal Information
                </h3>
                
                <div className="healer-detail-grid pat-detail-grid-flat">
                  <div>
                    <span className="healer-detail-grid__label">GENDER</span>
                    <strong>{patient.gender}</strong>
                  </div>
                  <div>
                    <span className="healer-detail-grid__label">AGE</span>
                    <strong>{patient.age} Years</strong>
                  </div>
                  <div>
                    <span className="healer-detail-grid__label">DATE OF BIRTH</span>
                    <strong>{patient.dateOfBirth}</strong>
                  </div>
                  <div>
                    <span className="healer-detail-grid__label">BLOOD GROUP</span>
                    <strong>{patient.bloodGroup}</strong>
                  </div>
                  <div>
                    <span className="healer-detail-grid__label">OCCUPATION</span>
                    <strong>{patient.occupation}</strong>
                  </div>
                  <div>
                    <span className="healer-detail-grid__label">RESIDENTIAL ADDRESS</span>
                    <strong>{patient.address || 'N/A'}</strong>
                  </div>
                </div>
              </AppCard>

              {/* Medical History Summary */}
              <AppCard padding="large" shadow>
                <h3 className="pat-card-title-16-m16">
                  Medical History Summary
                </h3>
                
                <div className="pat-vertical-list-14">
                  <div>
                    <span className="healer-credential-card__label pat-label-teal">PRIMARY CONDITIONS</span>
                    <div className="pat-flex-wrap-gap8-mt6">
                      {patient.medicalInfo?.conditions && patient.medicalInfo.conditions.length > 0 ? (
                        patient.medicalInfo.conditions.map((cond: string, idx: number) => (
                          <span 
                            key={idx} 
                            className="pat-condition-badge-red"
                          >
                            {cond}
                          </span>
                        ))
                      ) : (
                        <span className="pat-label-gray-13">No active medical conditions logged.</span>
                      )}
                    </div>
                  </div>

                  <div className="pat-divider-dashed-pt12">
                    <span className="healer-credential-card__label pat-label-10">CLINICAL NOTES & HISTORY</span>
                    <p className="pat-clinical-notes-p">
                      {patient.name === 'Valued Patient' || patient.name === defaultPatient.name
                        ? 'Lumbar Disc Herniation (Diagnosed 2024). Patient complains of chronic back fatigue. Energy sweeps scheduled on lower back chakras.'
                        : 'No detailed clinical notes available in primary records.'
                      }
                    </p>
                  </div>
                </div>
              </AppCard>

              {/* Assigned Treatment & Healer */}
              <AppCard padding="large" shadow>
                <h3 className="pat-card-title-16-m16">
                  Assigned Treatment Modality & Healing Team
                </h3>
                
                <div className="pat-grid-2col-gap16">
                  <div className="healer-cert-display pat-cert-display-teal">
                    <div className="healer-cert-title-row">
                      <div className="healer-cert-icon-container pat-cert-icon-teal">
                        <IonIcon icon={medkitOutline} />
                      </div>
                      <div>
                        <h4 className="healer-cert-name pat-cert-name-teal">{patient.assignedHealer || 'Assigned Healer'}</h4>
                        <span className="pat-cert-sub-teal">Primary Healing Practitioner</span>
                      </div>
                    </div>
                  </div>

                  <div className="healer-cert-display pat-cert-display-purple">
                    <div className="healer-cert-title-row">
                      <div className="healer-cert-icon-container pat-cert-icon-purple">
                        <IonIcon icon={heartOutline} />
                      </div>
                      <div>
                        <h4 className="healer-cert-name pat-cert-name-purple">{patient.treatmentType || 'Basic Pranic Healing'}</h4>
                        <span className="pat-cert-sub-purple">Assigned Treatment Type</span>
                      </div>
                    </div>
                  </div>
                </div>
              </AppCard>

              {/* Contact Information */}
              <AppCard padding="large" shadow>
                <h3 className="pat-card-title-16-m16">
                  Contact Information
                </h3>
                
                <div className="healer-profile-info-list pat-vertical-list-16">
                  <div className="healer-profile-info-item pat-flex-align-center-gap12">
                    <IonIcon icon={mailOutline} className="pat-info-item-icon-teal" />
                    <div>
                      <span className="healer-credential-card__label pat-label-10">EMAIL ADDRESS</span>
                      <strong className="pat-val-dark-13">{patient.email}</strong>
                    </div>
                  </div>

                  <div className="healer-profile-info-item pat-flex-align-center-gap12">
                    <IonIcon icon={phonePortraitOutline} className="pat-info-item-icon-teal" />
                    <div>
                      <span className="healer-credential-card__label pat-label-10">MOBILE NUMBER</span>
                      <strong className="pat-val-dark-13">{patient.mobile}</strong>
                    </div>
                  </div>

                  <div className="healer-profile-info-item pat-flex-align-center-gap12">
                    <IonIcon icon={businessOutline} className="pat-info-item-icon-teal" />
                    <div>
                      <span className="healer-credential-card__label pat-label-10">BRANCH LOCATION</span>
                      <strong className="pat-val-dark-13">{branchName}</strong>
                    </div>
                  </div>
                </div>
              </AppCard>

            </div>

          </div>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
