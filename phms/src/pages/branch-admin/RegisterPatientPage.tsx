import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonIcon,
} from '@ionic/react';
import {
  arrowBackOutline,
  personOutline,
  callOutline,
  locationOutline,
  alertCircleOutline,
  medkitOutline,
  peopleOutline,
  documentTextOutline,
  cloudUploadOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  trashOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { ROUTES } from '../../constants/routes.constant';
import './branch-admin.css';

export default function BARegisterPatientPage() {
  const history = useHistory();
  const { user } = useAuthStore();
  const isBranchAdmin = user?.role === 'BRANCH_ADMIN';

  // Current Date display
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Form states with requested defaults
  const [formData, setFormData] = useState({
    name: 'Elena Gilbert',
    mobile: '+1 234 567 8901',
    email: 'elena.g@example.com',
    emergencyContact: '',
    address: '',
    status: 'Active' as 'Active' | 'On Hold' | 'Completed' | 'Inactive',
    medicalHistory: '',
    treatmentType: 'Pranic Psychotherapy',
    assignedHealer: 'Dr. Aris Varma',
  });

  // Uploaded files state for the 7 requested fields
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: { name: string; size: string } | null }>({
    reports: null,
    labResults: null,
    prescriptions: null,
    scanImages: null,
    consultationNotes: null,
    idProofs: null,
    healingRecords: null,
  });

  // Success alert/modal control
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [newPatientId, setNewPatientId] = useState('');

  // Handle Input Changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Simulate File Upload
  const handleFileChange = (field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setUploadedFiles((prev) => ({
        ...prev,
        [field]: { name: file.name, size: `${sizeMB} MB` },
      }));
    }
  };

  // Clear Uploaded File
  const handleClearFile = (field: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering file chooser again
    setUploadedFiles((prev) => ({
      ...prev,
      [field]: null,
    }));
  };

  // Handle Submit
  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Patient Full Name is required.');
      return;
    }
    if (!formData.mobile.trim()) {
      alert('Phone Number is required.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      alert('A valid email address is required.');
      return;
    }

    // Generate random patient ID for tracking
    const generatedId = `PHMS-P-${Math.floor(10000 + Math.random() * 90000)}`;
    setNewPatientId(generatedId);
    setShowSuccessToast(true);
  };

  const closeAndRedirect = () => {
    setShowSuccessToast(false);
    history.push(ROUTES.BRANCH_ADMIN.PATIENTS);
  };

  if (!isBranchAdmin) {
    return (
      <IonPage className="sa-page">
        <IonContent className="sa-page__content" fullscreen>
          <div className="db-access-restricted-container">
            <div className="db-access-restricted-card">
              <div className="db-access-restricted-icon">
                <IonIcon icon={alertCircleOutline} />
              </div>
              <div className="db-access-restricted-details">
                <span className="db-access-restricted-title">Unauthorized Node Access</span>
                <p className="db-access-restricted-desc">
                  Access Denied. Patient registration is restricted exclusively to authorized Branch Admin users.
                </p>
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // Custom CSS Style Blocks for exact matching with user images
  const customStyles = {
    formCard: {
      background: '#ffffff',
      borderRadius: '16px',
      padding: '28px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.025)',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '24px',
    },
    subHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontSize: '18px',
      fontWeight: 700,
      color: '#0D5C46',
      marginTop: '8px',
      marginBottom: '16px',
    },
    subHeaderIcon: {
      color: '#0D5C46',
      fontSize: '22px',
    },
    label: {
      fontSize: '11px',
      fontWeight: 800,
      color: '#475569',
      letterSpacing: '0.5px',
      marginBottom: '6px',
      textTransform: 'uppercase' as const,
    },
    grayInput: {
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      color: '#1e293b',
      outline: 'none',
      width: '100%',
      transition: 'all 0.2s ease',
    },
    grayTextarea: {
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '12px 16px',
      fontSize: '14px',
      color: '#1e293b',
      outline: 'none',
      width: '100%',
      resize: 'none' as const,
      lineHeight: 1.5,
      transition: 'all 0.2s ease',
    },
    dashedUpload: {
      background: '#f8fafc',
      border: '1px dashed #cbd5e1',
      borderRadius: '8px',
      height: '38px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      width: '100%',
      transition: 'all 0.2s ease',
      position: 'relative' as const,
    },
    dashedUploadActive: {
      background: '#f0fdf4',
      border: '1px solid #a7f3d0',
      borderRadius: '8px',
      height: '38px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 12px',
      cursor: 'pointer',
      width: '100%',
    },
    statusCard: {
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 12px',
      borderRadius: '12px',
      cursor: 'pointer',
      textAlign: 'center' as const,
      transition: 'all 0.2s ease',
      width: '100%',
      minHeight: '104px',
    },
  };

  return (
    <IonPage className="sa-page">
      <IonContent className="sa-page__content" style={{ '--background': '#f8fafc' }} fullscreen>
        <div className="db-corp-layout" style={{ background: '#f8fafc' }}>
          
          <main className="db-corp-canvas">
            
            {/* Horizontal Header Navbar */}
            <header className="db-corp-navbar" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button className="db-corp-nav-icon-btn" onClick={() => history.push(ROUTES.BRANCH_ADMIN.DASHBOARD)} title="Back to Dashboard">
                  <IonIcon icon={arrowBackOutline} style={{ color: '#0D5C46', fontSize: '20px' }} />
                </button>
                <div className="db-corp-navbar-left">
                  <h1 className="db-corp-page-title" style={{ color: '#0d5c46', fontWeight: 800 }}>Register Patient</h1>
                  <p className="db-corp-page-subtitle">Pranic Healing Management System • {formattedDate}</p>
                </div>
              </div>
              
              <div className="db-corp-navbar-right">
                <div className="db-corp-badge-dot" style={{ background: '#10b981', position: 'relative', marginRight: '6px' }} />
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Branch registry active</span>
              </div>
            </header>

            {/* Main Form Workspace Area */}
            <div className="db-hc-layout" style={{ padding: '28px' }}>
              
              <form onSubmit={handleSaveRecord} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                
                {/* 2-Column Grid Layout matching user images */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '28px', alignItems: 'start' }}>
                  
                  {/* LEFT COLUMN: Identity, Contact, Address, Status */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    
                    {/* Card 1: Patient Identity & Contact Info */}
                    <div style={customStyles.formCard}>
                      
                      {/* Section 1: Patient Identity */}
                      <div>
                        <div style={customStyles.subHeader}>
                          <IonIcon icon={personOutline} style={customStyles.subHeaderIcon} />
                          <span>Patient Identity</span>
                        </div>
                        <div className="st-form-group">
                          <label style={customStyles.label}>PATIENT FULL NAME</label>
                          <input 
                            type="text" 
                            name="name" 
                            style={customStyles.grayInput}
                            value={formData.name} 
                            onChange={handleInputChange} 
                            required 
                            placeholder="Elena Gilbert"
                          />
                        </div>
                      </div>

                      {/* Section 2: Contact Information */}
                      <div>
                        <div style={customStyles.subHeader}>
                          <IonIcon icon={callOutline} style={customStyles.subHeaderIcon} />
                          <span>Contact Information</span>
                        </div>
                        
                        <div className="st-form-row" style={{ marginBottom: '16px' }}>
                          <div className="st-form-group">
                            <label style={customStyles.label}>PHONE NUMBER</label>
                            <input 
                              type="tel" 
                              name="mobile" 
                              style={customStyles.grayInput}
                              value={formData.mobile} 
                              onChange={handleInputChange} 
                              required 
                              placeholder="+1 234 567 8901"
                            />
                          </div>

                          <div className="st-form-group">
                            <label style={customStyles.label}>EMAIL ADDRESS</label>
                            <input 
                              type="email" 
                              name="email" 
                              style={customStyles.grayInput}
                              value={formData.email} 
                              onChange={handleInputChange} 
                              required 
                              placeholder="elena.g@example.com"
                            />
                          </div>
                        </div>

                        <div className="st-form-group">
                          <label style={customStyles.label}>EMERGENCY CONTACT DETAILS</label>
                          <input 
                            type="text" 
                            name="emergencyContact" 
                            style={customStyles.grayInput}
                            value={formData.emergencyContact} 
                            onChange={handleInputChange} 
                            placeholder="Name and Relationship (Phone)"
                          />
                        </div>
                      </div>

                      {/* Section 3: Address */}
                      <div>
                        <div style={customStyles.subHeader}>
                          <IonIcon icon={locationOutline} style={customStyles.subHeaderIcon} />
                          <span>Address</span>
                        </div>
                        <div className="st-form-group">
                          <label style={customStyles.label}>RESIDENTIAL/COMMUNICATION ADDRESS</label>
                          <textarea 
                            name="address" 
                            rows={3} 
                            style={customStyles.grayTextarea}
                            value={formData.address} 
                            onChange={handleInputChange} 
                            placeholder="Previous health conditions, treatments, allergies..."
                          />
                        </div>
                      </div>

                    </div>

                    {/* Card 2: Patient Status */}
                    <div style={customStyles.formCard}>
                      <div style={customStyles.subHeader}>
                        <IonIcon icon={alertCircleOutline} style={customStyles.subHeaderIcon} />
                        <span>Patient Status</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        
                        {/* Status active */}
                        <div 
                          onClick={() => setFormData(prev => ({ ...prev, status: 'Active' }))}
                          style={{
                            ...customStyles.statusCard,
                            border: formData.status === 'Active' ? '2px solid #10b981' : '1px solid #cbd5e1',
                            background: formData.status === 'Active' ? '#f0fdf4' : '#f8fafc',
                          }}
                        >
                          <IonIcon icon={checkmarkCircleOutline} style={{ color: '#10b981', fontSize: '22px', marginBottom: '8px' }} />
                          <span style={{ fontWeight: 800, fontSize: '14px', color: formData.status === 'Active' ? '#047857' : '#1e293b' }}>Active</span>
                          <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: 1.3 }}>Currently receiving healing</span>
                        </div>

                        {/* Status on hold */}
                        <div 
                          onClick={() => setFormData(prev => ({ ...prev, status: 'On Hold' }))}
                          style={{
                            ...customStyles.statusCard,
                            border: formData.status === 'On Hold' ? '2px solid #475569' : '1px solid #cbd5e1',
                            background: formData.status === 'On Hold' ? '#f1f5f9' : '#f8fafc',
                          }}
                        >
                          <div style={{ fontSize: '18px', fontWeight: 800, color: '#475569', marginBottom: '8px', fontFamily: 'monospace' }}>||</div>
                          <span style={{ fontWeight: 800, fontSize: '14px', color: '#475569' }}>On Hold</span>
                          <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: 1.3 }}>Temporarily paused</span>
                        </div>

                        {/* Status completed */}
                        <div 
                          onClick={() => setFormData(prev => ({ ...prev, status: 'Completed' }))}
                          style={{
                            ...customStyles.statusCard,
                            border: formData.status === 'Completed' ? '2px solid #475569' : '1px solid #cbd5e1',
                            background: formData.status === 'Completed' ? '#f1f5f9' : '#f8fafc',
                          }}
                        >
                          <IonIcon icon={checkmarkCircleOutline} style={{ color: '#475569', fontSize: '22px', marginBottom: '8px' }} />
                          <span style={{ fontWeight: 800, fontSize: '14px', color: '#475569' }}>Completed</span>
                          <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: 1.3 }}>Treatment successful</span>
                        </div>

                        {/* Status inactive */}
                        <div 
                          onClick={() => setFormData(prev => ({ ...prev, status: 'Inactive' }))}
                          style={{
                            ...customStyles.statusCard,
                            border: formData.status === 'Inactive' ? '2px solid #475569' : '1px solid #cbd5e1',
                            background: formData.status === 'Inactive' ? '#f1f5f9' : '#f8fafc',
                          }}
                        >
                          <IonIcon icon={closeCircleOutline} style={{ color: '#475569', fontSize: '22px', marginBottom: '8px' }} />
                          <span style={{ fontWeight: 800, fontSize: '14px', color: '#475569' }}>Inactive</span>
                          <span style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', lineHeight: 1.3 }}>No longer in system</span>
                        </div>

                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN: Medical History, Assigned Healer, Uploaded Documents */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    
                    {/* Card 1: Medical History & Allocation */}
                    <div style={customStyles.formCard}>
                      
                      {/* Section 1: Medical History */}
                      <div>
                        <div style={customStyles.subHeader}>
                          <IonIcon icon={medkitOutline} style={customStyles.subHeaderIcon} />
                          <span>Medical History</span>
                        </div>
                        <div className="st-form-group">
                          <label style={customStyles.label}>CONDITIONS, TREATMENTS &amp; ALLERGIES</label>
                          <textarea 
                            name="medicalHistory" 
                            rows={4} 
                            style={customStyles.grayTextarea}
                            value={formData.medicalHistory} 
                            onChange={handleInputChange} 
                            placeholder="Previous health conditions, treatments, allergies, medications, reports, or healing-related notes..."
                          />
                        </div>
                      </div>

                      {/* Section 2: Allocation */}
                      <div className="st-form-group" style={{ marginTop: '8px' }}>
                        <label style={customStyles.label}>ASSIGN TREATMENT TYPE</label>
                        <select name="treatmentType" className="st-input" style={customStyles.grayInput} value={formData.treatmentType} onChange={handleInputChange}>
                          <option value="Pranic Psychotherapy">Pranic Psychotherapy</option>
                          <option value="Advanced Pranic Healing">Advanced Pranic Healing</option>
                          <option value="Crystal Pranic Healing">Crystal Pranic Healing</option>
                          <option value="Basic Pranic Healing">Basic Pranic Healing</option>
                        </select>
                      </div>

                      {/* Section 3: Assigned Healer */}
                      <div>
                        <div style={customStyles.subHeader}>
                          <IonIcon icon={peopleOutline} style={customStyles.subHeaderIcon} />
                          <span>Assigned Healer</span>
                        </div>
                        <div className="st-form-group">
                          <label style={customStyles.label}>RESPONSIBLE HEALER</label>
                          <select name="assignedHealer" className="st-input" style={customStyles.grayInput} value={formData.assignedHealer} onChange={handleInputChange}>
                            <option value="Dr. Aris Varma">Dr. Aris Varma</option>
                            <option value="Dr. Anjali Rao">Dr. Anjali Rao</option>
                            <option value="Dr. Kevin Smith">Dr. Kevin Smith</option>
                          </select>
                        </div>
                      </div>

                    </div>

                    {/* Card 2: Uploaded Documents */}
                    <div style={customStyles.formCard}>
                      <div style={customStyles.subHeader}>
                        <IonIcon icon={documentTextOutline} style={customStyles.subHeaderIcon} />
                        <span>Uploaded Documents</span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        
                        {/* 1. Medical Reports */}
                        <div className="st-form-group">
                          <label style={customStyles.label}>Medical Reports</label>
                          {uploadedFiles.reports ? (
                            <div style={customStyles.dashedUploadActive}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '80%' }}>
                                <IonIcon icon={checkmarkCircleOutline} style={{ color: '#10b981' }} />
                                <span style={{ fontSize: '11px', color: '#065f46', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {uploadedFiles.reports.name}
                                </span>
                              </div>
                              <IonIcon icon={trashOutline} onClick={(e) => handleClearFile('reports', e)} style={{ color: '#ef4444', fontSize: '14px' }} />
                            </div>
                          ) : (
                            <label style={customStyles.dashedUpload}>
                              <IonIcon icon={cloudUploadOutline} style={{ color: '#94a3b8', fontSize: '18px' }} />
                              <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileChange('reports', e)} />
                            </label>
                          )}
                        </div>

                        {/* 2. Lab Results */}
                        <div className="st-form-group">
                          <label style={customStyles.label}>Lab Results</label>
                          {uploadedFiles.labResults ? (
                            <div style={customStyles.dashedUploadActive}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '80%' }}>
                                <IonIcon icon={checkmarkCircleOutline} style={{ color: '#10b981' }} />
                                <span style={{ fontSize: '11px', color: '#065f46', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {uploadedFiles.labResults.name}
                                </span>
                              </div>
                              <IonIcon icon={trashOutline} onClick={(e) => handleClearFile('labResults', e)} style={{ color: '#ef4444', fontSize: '14px' }} />
                            </div>
                          ) : (
                            <label style={customStyles.dashedUpload}>
                              <IonIcon icon={cloudUploadOutline} style={{ color: '#94a3b8', fontSize: '18px' }} />
                              <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileChange('labResults', e)} />
                            </label>
                          )}
                        </div>

                        {/* 3. Prescriptions */}
                        <div className="st-form-group">
                          <label style={customStyles.label}>Prescriptions</label>
                          {uploadedFiles.prescriptions ? (
                            <div style={customStyles.dashedUploadActive}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '80%' }}>
                                <IonIcon icon={checkmarkCircleOutline} style={{ color: '#10b981' }} />
                                <span style={{ fontSize: '11px', color: '#065f46', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {uploadedFiles.prescriptions.name}
                                </span>
                              </div>
                              <IonIcon icon={trashOutline} onClick={(e) => handleClearFile('prescriptions', e)} style={{ color: '#ef4444', fontSize: '14px' }} />
                            </div>
                          ) : (
                            <label style={customStyles.dashedUpload}>
                              <IonIcon icon={cloudUploadOutline} style={{ color: '#94a3b8', fontSize: '18px' }} />
                              <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileChange('prescriptions', e)} />
                            </label>
                          )}
                        </div>

                        {/* 4. Scan Images */}
                        <div className="st-form-group">
                          <label style={customStyles.label}>Scan Images</label>
                          {uploadedFiles.scanImages ? (
                            <div style={customStyles.dashedUploadActive}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '80%' }}>
                                <IonIcon icon={checkmarkCircleOutline} style={{ color: '#10b981' }} />
                                <span style={{ fontSize: '11px', color: '#065f46', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {uploadedFiles.scanImages.name}
                                </span>
                              </div>
                              <IonIcon icon={trashOutline} onClick={(e) => handleClearFile('scanImages', e)} style={{ color: '#ef4444', fontSize: '14px' }} />
                            </div>
                          ) : (
                            <label style={customStyles.dashedUpload}>
                              <IonIcon icon={cloudUploadOutline} style={{ color: '#94a3b8', fontSize: '18px' }} />
                              <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileChange('scanImages', e)} />
                            </label>
                          )}
                        </div>

                        {/* 5. Consultation Notes */}
                        <div className="st-form-group">
                          <label style={customStyles.label}>Consultation Notes</label>
                          {uploadedFiles.consultationNotes ? (
                            <div style={customStyles.dashedUploadActive}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '80%' }}>
                                <IonIcon icon={checkmarkCircleOutline} style={{ color: '#10b981' }} />
                                <span style={{ fontSize: '11px', color: '#065f46', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {uploadedFiles.consultationNotes.name}
                                </span>
                              </div>
                              <IonIcon icon={trashOutline} onClick={(e) => handleClearFile('consultationNotes', e)} style={{ color: '#ef4444', fontSize: '14px' }} />
                            </div>
                          ) : (
                            <label style={customStyles.dashedUpload}>
                              <IonIcon icon={cloudUploadOutline} style={{ color: '#94a3b8', fontSize: '18px' }} />
                              <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileChange('consultationNotes', e)} />
                            </label>
                          )}
                        </div>

                        {/* 6. ID Proofs */}
                        <div className="st-form-group">
                          <label style={customStyles.label}>ID Proofs</label>
                          {uploadedFiles.idProofs ? (
                            <div style={customStyles.dashedUploadActive}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '80%' }}>
                                <IonIcon icon={checkmarkCircleOutline} style={{ color: '#10b981' }} />
                                <span style={{ fontSize: '11px', color: '#065f46', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {uploadedFiles.idProofs.name}
                                </span>
                              </div>
                              <IonIcon icon={trashOutline} onClick={(e) => handleClearFile('idProofs', e)} style={{ color: '#ef4444', fontSize: '14px' }} />
                            </div>
                          ) : (
                            <label style={customStyles.dashedUpload}>
                              <IonIcon icon={cloudUploadOutline} style={{ color: '#94a3b8', fontSize: '18px' }} />
                              <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileChange('idProofs', e)} />
                            </label>
                          )}
                        </div>

                        {/* 7. Healing Records */}
                        <div className="st-form-group" style={{ gridColumn: 'span 2' }}>
                          <label style={customStyles.label}>Healing Records</label>
                          {uploadedFiles.healingRecords ? (
                            <div style={customStyles.dashedUploadActive}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '90%' }}>
                                <IonIcon icon={checkmarkCircleOutline} style={{ color: '#10b981' }} />
                                <span style={{ fontSize: '11px', color: '#065f46', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {uploadedFiles.healingRecords.name}
                                </span>
                              </div>
                              <IonIcon icon={trashOutline} onClick={(e) => handleClearFile('healingRecords', e)} style={{ color: '#ef4444', fontSize: '14px' }} />
                            </div>
                          ) : (
                            <label style={customStyles.dashedUpload}>
                              <IonIcon icon={cloudUploadOutline} style={{ color: '#94a3b8', fontSize: '18px' }} />
                              <input type="file" style={{ display: 'none' }} onChange={(e) => handleFileChange('healingRecords', e)} />
                            </label>
                          )}
                        </div>

                      </div>
                    </div>

                  </div>

                </div>

                {/* Bottom Footer Actions block (matches bottom right layout in image) */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px', marginBottom: '28px' }}>
                  <button 
                    type="button" 
                    onClick={() => history.push(ROUTES.BRANCH_ADMIN.DASHBOARD)} 
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '10px 24px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Cancel
                  </button>

                  <button 
                    type="submit" 
                    style={{
                      background: '#0D5C46',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '10px 28px',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Save Record
                  </button>
                </div>

              </form>

            </div>

          </main>

        </div>
      </IonContent>

      {/* Success Modal */}
      {showSuccessToast && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="db-corp-card" style={{ maxWidth: '420px', width: '90%', padding: '32px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', animation: 'scaleUp 0.3s ease-out' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <IonIcon icon={checkmarkCircleOutline} style={{ color: '#10b981', fontSize: '40px' }} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', margin: '0 0 6px 0' }}>Patient Registered Successfully</h3>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0', lineHeight: 1.5 }}>
                Folder for <strong>{formData.name}</strong> has been successfully initialized in the branch registry.
              </p>
            </div>
            
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', padding: '10px 16px', borderRadius: '8px', fontSize: '13px', width: '100%' }}>
              <span style={{ color: '#64748b', fontWeight: 600 }}>SYSTEM RECORD ID:</span>
              <strong style={{ color: '#0D5C46', display: 'block', fontSize: '15px', marginTop: '2px', fontFamily: 'monospace' }}>{newPatientId}</strong>
            </div>

            <button onClick={closeAndRedirect} className="sa-btn sa-btn--primary" style={{ width: '100%', justifyContent: 'center', margin: 0 }}>
              Proceed to Patient Registry
            </button>
          </div>
        </div>
      )}
    </IonPage>
  );
}
