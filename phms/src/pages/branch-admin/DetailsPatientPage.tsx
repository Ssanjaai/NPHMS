import React, { useState } from 'react';
import { IonIcon, IonModal } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { ROUTES } from '../../constants/routes.constant';
import { Patient } from './PatientsPage';
import {
  arrowBackOutline,
  pencilOutline,
  timeOutline,
  personOutline,
  shieldCheckmarkOutline,
  checkmarkCircleOutline,
  calendarOutline,
  downloadOutline,
  cloudUploadOutline,
  documentTextOutline,
  imageOutline,
  eyeOutline,
  trashOutline,
  star,
  trendingUpOutline,
  receiptOutline,
  swapHorizontalOutline,
  addOutline,
} from 'ionicons/icons';
import './branch-admin.css';

export interface DetailsPatientPageProps {
  patient: Patient;
  onBack: () => void;
  onUpdatePatient: (updatedPatient: Patient) => void;
}

const DetailsPatientPage: React.FC<DetailsPatientPageProps> = ({
  patient,
  onBack,
  onUpdatePatient,
}) => {
  const history = useHistory();
  const { user } = useAuthStore();

  const [profileTab, setProfileTab] = useState<'basic' | 'sessions' | 'financials' | 'documents' | 'feedback' | 'logs'>('basic');
  const [showAptModal, setShowAptModal] = useState(false);
  const [showSesModal, setShowSesModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showRecordPaymentModal, setShowRecordPaymentModal] = useState(false);

  const [appointmentForm, setAppointmentForm] = useState({
    date: '',
    time: '10:00 AM',
    healer: 'Dr. Anjali Rao',
    status: 'Pending' as 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled',
  });

  const [sessionForm, setSessionForm] = useState({
    healer: 'Dr. Anjali Rao',
    status: 'Scheduled' as 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled',
    notes: '',
    followUpDate: '',
  });

  const [invoiceForm, setInvoiceForm] = useState({
    amount: 1000,
    method: 'UPI' as 'Cash' | 'UPI' | 'Card' | 'Bank Transfer',
  });

  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentRecord, setPaymentRecord] = useState({
    amountPaid: 0,
    method: 'UPI' as 'Cash' | 'UPI' | 'Bank Transfer',
    status: 'Paid' as 'Paid' | 'Partial' | 'Pending',
  });

  const [documentCategory, setDocumentCategory] = useState<'Doctor Report' | 'Lab Report' | 'Consultation Note' | 'Other'>('Doctor Report');

  const userName = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Aria Seraphina';
  const nameParts = userName.split(' ');
  const displayName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[1][0]}.` : userName;

  const handleQuickRemoveHealer = () => {
    const oldHealer = patient.assignedHealer || 'None';
    if (oldHealer === 'None') return;

    const timestampString = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const updatedHealerHistory = [
      {
        prevHealer: oldHealer,
        newHealer: 'None',
        changedBy: displayName,
        timestamp: timestampString,
      },
      ...(patient.healerHistory || []),
    ];
    const updatedActivityLogs = [
      {
        action: `Healer assignment removed (unassigned): [${oldHealer}] ➔ [None]`,
        timestamp: 'Just now',
        category: 'profile_update' as const,
      },
      ...patient.activityLogs,
    ];

    const updatedPatient: Patient = {
      ...patient,
      assignedHealer: 'None',
      healerHistory: updatedHealerHistory,
      activityLogs: updatedActivityLogs
    };
    onUpdatePatient(updatedPatient);
    alert('Healer allocation removed successfully. Patient credentials locked.');
  };

  const handleTransitionAppointmentStatus = (aptId: string, nextStatus: any) => {
    const oldApt = patient.appointments.find(a => a.id === aptId);
    const logText = `Appointment ${aptId} transitioned: [${oldApt?.status}] ➔ [${nextStatus}]`;
    const auditLog = { action: logText, timestamp: 'Just now', category: 'appointment' as any };
    
    const updatedPatient: Patient = {
      ...patient,
      appointments: patient.appointments.map((a) => (a.id === aptId ? { ...a, status: nextStatus } : a)),
      activityLogs: [auditLog, ...patient.activityLogs],
    };
    onUpdatePatient(updatedPatient);
  };

  const handleAddAppointment = () => {
    const aptId = `#APT-${Math.floor(100 + Math.random() * 900)}`;
    const newApt = {
      id: aptId,
      date: appointmentForm.date || new Date().toISOString().split('T')[0],
      time: appointmentForm.time,
      healer: appointmentForm.healer,
      status: appointmentForm.status,
      remindersEnabled: true,
    };
    const log = { action: `Appointment ${aptId} created. State: [Pending] -> [${newApt.status}]`, timestamp: 'Just now', category: 'appointment' as any };

    const updatedPatient: Patient = {
      ...patient,
      appointments: [newApt, ...patient.appointments],
      activityLogs: [log, ...patient.activityLogs],
    };
    onUpdatePatient(updatedPatient);
    setShowAptModal(false);
  };

  const handleAddSession = () => {
    const sesId = `#SES-${Math.floor(100 + Math.random() * 900)}`;
    const newSes = {
      id: sesId,
      healer: sessionForm.healer,
      status: sessionForm.status,
      notes: sessionForm.notes || 'General Pranic restoration session.',
      followUpDate: sessionForm.followUpDate || undefined,
    };
    const log = { action: `Session ${sesId} initialized. State: [${newSes.status}]`, timestamp: 'Just now', category: 'session_update' as any };

    const updatedPatient: Patient = {
      ...patient,
      sessions: [newSes, ...patient.sessions],
      activityLogs: [log, ...patient.activityLogs],
    };
    onUpdatePatient(updatedPatient);
    setShowSesModal(false);
    setSessionForm({ healer: 'Dr. Anjali Rao', status: 'Scheduled', notes: '', followUpDate: '' });
  };

  const handleGenerateInvoice = () => {
    const invId = `#INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice = {
      id: invId,
      date: new Date().toISOString().split('T')[0],
      amount: Number(invoiceForm.amount),
      status: 'Unpaid' as any,
    };
    const log = { action: `Invoice ${invId} generated for amount ₹${invoiceForm.amount}. Status: [Unpaid]`, timestamp: 'Just now', category: 'payment' as any };

    const updatedPatient: Patient = {
      ...patient,
      financials: {
        balanceDue: patient.financials.balanceDue + newInvoice.amount,
        invoices: [newInvoice, ...patient.financials.invoices],
      },
      activityLogs: [log, ...patient.activityLogs],
    };
    onUpdatePatient(updatedPatient);
    setShowInvoiceModal(false);
  };

  const handleRecordPaymentSubmit = () => {
    if (!selectedInvoice || !paymentRecord.amountPaid) {
      alert('Please enter a valid amount.');
      return;
    }

    const amountPaid = Number(paymentRecord.amountPaid);
    const method = paymentRecord.method;
    const nextStatus = paymentRecord.status;

    const updatedInvoices = patient.financials.invoices.map((inv) => {
      if (inv.id === selectedInvoice.id) {
        return {
          ...inv,
          status: nextStatus as any,
          method: method as any,
        };
      }
      return inv;
    });

    const newBalanceDue = updatedInvoices
      .filter((inv) => inv.status !== 'Paid')
      .reduce((sum, inv) => sum + inv.amount, 0);

    const log = {
      action: `Payment of ₹${amountPaid} recorded via [${method}]. Invoice ${selectedInvoice.id} transitioned to [${nextStatus}]`,
      timestamp: 'Just now',
      category: 'payment' as const,
    };

    const updatedPatient: Patient = {
      ...patient,
      financials: {
        balanceDue: newBalanceDue,
        invoices: updatedInvoices,
      },
      activityLogs: [log, ...patient.activityLogs],
    };
    onUpdatePatient(updatedPatient);
    setShowRecordPaymentModal(false);
    setSelectedInvoice(null);
    alert('Payment recorded in the branch financials ledger successfully!');
  };

  const handleMockDocUpload = () => {
    const docId = `#DOC-${Math.floor(100 + Math.random() * 900)}`;
    const newDoc = {
      id: docId,
      name: `Uploaded_Doc_${Date.now().toString().slice(-4)}.pdf`,
      category: documentCategory,
      size: '1.2 MB',
      date: new Date().toISOString().split('T')[0],
      type: 'pdf' as any,
      uploadedBy: displayName,
    };
    const log = { action: `Uploaded file ${newDoc.name} into vault under category: ${newDoc.category}`, timestamp: 'Just now', category: 'profile_update' as any };

    const updatedPatient: Patient = {
      ...patient,
      documents: [newDoc, ...patient.documents],
      activityLogs: [log, ...patient.activityLogs],
    };
    onUpdatePatient(updatedPatient);
    alert('File uploaded to localized document vault successfully!');
  };

  const handleMockDocDelete = (docId: string) => {
    const updatedPatient: Patient = {
      ...patient,
      documents: patient.documents.filter((d) => d.id !== docId),
      activityLogs: [{ action: `Deleted document ${docId} from clinical vault`, timestamp: 'Just now', category: 'profile_update' as any }, ...patient.activityLogs],
    };
    onUpdatePatient(updatedPatient);
  };

  return (
    <>
      <div className="pa-profile-workspace" style={{ padding: 0, background: 'transparent', boxShadow: 'none', border: 'none' }}>
        {/* Floating Back Button */}
        <div style={{ marginBottom: '16px' }}>
          <button 
            className="st-btn st-btn--outline" 
            onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, background: '#ffffff', border: '1px solid #cbd5e1', color: 'var(--ba-color-primary)' }}
          >
            <IonIcon icon={arrowBackOutline} /> Back
          </button>
        </div>

        {/* Header Card */}
        <div style={{
          background: 'var(--ba-color-primary)', // Beautiful teal green canvas matching Super Admin theme
          borderRadius: '16px',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '20px',
          color: '#ffffff',
          boxShadow: '0 4px 20px rgba(31, 122, 106, 0.15)',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Avatar */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              border: '2px solid rgba(255, 255, 255, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '20px',
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.15)',
              textShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              {patient.initials}
            </div>
            
            {/* Patient Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.5px' }}>
                {patient.name}
              </h2>
              <span style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500 }}>
                Patient ID: <strong style={{ color: '#ffffff' }}>{patient.id}</strong> • Gender: <strong style={{ color: '#ffffff' }}>{patient.gender}</strong> • Age: <strong style={{ color: '#ffffff' }}>{patient.age}</strong>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => patient && history.push(ROUTES.BRANCH_ADMIN.EDIT_PATIENT.replace(':id', encodeURIComponent(patient.id)))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                e.currentTarget.style.borderColor = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              <IonIcon icon={pencilOutline} style={{ fontSize: '16px' }} /> Edit Profile
            </button>
            <button 
              onClick={() => setShowSesModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                borderRadius: '8px',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.borderColor = '#ffffff';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)';
              }}
            >
              <IonIcon icon={timeOutline} style={{ fontSize: '16px' }} /> Start Session
            </button>
          </div>
        </div>

        {/* Tabs navigation */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '24px',
          background: '#ffffff',
          padding: '0 8px',
          gap: '32px',
          overflowX: 'auto'
        }}>
          {[
            { id: 'basic', label: 'BASIC INFO' },
            { id: 'sessions', label: 'SESSION HISTORY' },
            { id: 'financials', label: 'PAYMENTS' },
            { id: 'documents', label: `DOCUMENT VAULT (${patient.documents.length})` },
            { id: 'feedback', label: 'FEEDBACK' },
            { id: 'logs', label: 'AUDIT LOGS' }
          ].map((tab) => {
            const isActive = profileTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setProfileTab(tab.id as any)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '16px 4px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: isActive ? 'var(--ba-color-primary)' : '#64748b',
                  borderBottom: isActive ? '3px solid var(--ba-color-primary)' : '3px solid transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="pa-profile-body" style={{ padding: 0, background: 'transparent' }}>
          {profileTab === 'basic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px',
                alignItems: 'start'
              }}>
                {/* BASIC INFORMATION CARD */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: 'var(--ba-color-primary)',
                    margin: '0 0 16px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    BASIC INFORMATION
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Mobile */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>
                        MOBILE NUMBER
                      </span>
                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '14px 16px',
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#1e293b'
                      }}>
                        {patient.mobile}
                      </div>
                    </div>

                    {/* Email */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>
                        EMAIL ADDRESS
                      </span>
                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '14px 16px',
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#1e293b'
                      }}>
                        {patient.email}
                      </div>
                    </div>

                    {/* Registration Date */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>
                        REGISTRATION DATE
                      </span>
                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '14px 16px',
                        fontSize: '15px',
                        fontWeight: 700,
                        color: '#1e293b'
                      }}>
                        {patient.regDate}
                      </div>
                    </div>
                  </div>
                </div>

                {/* MEDICAL INFORMATION CARD */}
                <div style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: 800,
                    color: 'var(--ba-color-primary)',
                    margin: '0 0 16px 0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    MEDICAL INFORMATION
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Health Conditions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>
                        HEALTH CONDITIONS
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px 0' }}>
                        {patient.medicalInfo.conditions.map((c, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '6px',
                              height: '6px',
                              borderRadius: '50%',
                              background: '#10b981', // green bullet
                              flexShrink: 0
                            }} />
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>
                              {c}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Clinical Notes */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.5px' }}>
                        CLINICAL NOTES
                      </span>
                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '14px 16px',
                        fontSize: '14px',
                        fontStyle: 'italic',
                        color: '#475569',
                        lineHeight: '1.5'
                      }}>
                        "{patient.medicalInfo.notes}"
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secondary Healer Allocation & Credentials Segment */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {/* Healer Allocation */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                  <span className="pa-info-block-title" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', margin: '0 0 16px 0' }}>
                    <IonIcon icon={personOutline} style={{ color: '#1f7a6a' }} />
                    Clinical Healer Allocation
                  </span>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Current Assigned Healer</span>
                      <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '4px 0 0 0' }}>
                        {patient.assignedHealer === 'None' ? 'None (Unassigned)' : patient.assignedHealer}
                      </h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b' }}>
                        Responsible practitioner managing pranic therapies.
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px' }}>
                      {patient.assignedHealer === 'None' ? (
                        <button className="st-btn st-btn--primary" onClick={() => patient && history.push(ROUTES.BRANCH_ADMIN.EDIT_PATIENT.replace(':id', encodeURIComponent(patient.id)))} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <IonIcon icon={addOutline} /> Assign Healer
                        </button>
                      ) : (
                        <>
                          <button className="st-btn st-btn--primary" onClick={() => patient && history.push(ROUTES.BRANCH_ADMIN.EDIT_PATIENT.replace(':id', encodeURIComponent(patient.id)))} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <IonIcon icon={swapHorizontalOutline} /> Reassign
                          </button>
                          <button className="st-btn st-btn--outline" onClick={handleQuickRemoveHealer} style={{ color: '#ef4444', borderColor: '#fee2e2', background: '#fef2f2' }}>
                            <IonIcon icon={trashOutline} /> Remove
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Credentials */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                  <span className="pa-info-block-title" style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', margin: '0 0 16px 0' }}>
                    <IonIcon icon={shieldCheckmarkOutline} style={{ color: '#10b981' }} />
                    Patient Account Credentials
                  </span>
                  {patient.credentials ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Username</span>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#1f7a6a', marginTop: '2px' }}>{patient.credentials.username}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                        <span className="st-panel-badge st-panel-badge--green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
                          <IonIcon icon={checkmarkCircleOutline} /> ✓ Credentials Generated
                        </span>
                        <span className="st-panel-badge st-panel-badge--green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
                          <IonIcon icon={checkmarkCircleOutline} /> ✓ SMS & Email Dispatched
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', border: '2px dashed #cbd5e1', borderRadius: '8px', gap: '6px' }}>
                      <IonIcon icon={personOutline} style={{ fontSize: '24px', color: '#f59e0b' }} />
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Credentials Lock Active</span>
                      <p style={{ margin: 0, fontSize: '10px', color: '#64748b', textAlign: 'center' }}>
                        Credentials will auto-generate and email/SMS alerts will trigger once a healer is assigned.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {profileTab === 'sessions' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Chronological Session History Timeline */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e6f4f1', paddingBottom: '12px', marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--ba-color-primary)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                    <IonIcon icon={timeOutline} style={{ color: 'var(--ba-color-primary)', fontSize: '18px' }} />
                    Chronological Session History Timeline
                  </h4>
                  <button className="st-btn st-btn--primary" onClick={() => setShowSesModal(true)} style={{ fontSize: '12px', padding: '6px 14px', whiteSpace: 'nowrap' }}>
                    + Add Session
                  </button>
                </div>

                {/* Timeline List Nodes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', paddingLeft: '12px', borderLeft: '2px solid #e2e8f0', marginLeft: '12px' }}>
                  {patient.sessions.length > 0 ? (
                    [...patient.sessions].reverse().map((s, index, arr) => {
                      const seqNo = `S-${String(arr.length - index).padStart(4, '0')}`;
                      return (
                        <div key={s.id} style={{ position: 'relative', paddingLeft: '16px' }}>
                          {/* Timeline Bullet Circle */}
                          <div 
                            style={{ 
                              position: 'absolute', 
                              left: '-24px', 
                              top: '2px', 
                              width: '12px', 
                              height: '12px', 
                              borderRadius: '50%', 
                              background: s.status === 'Completed' ? '#10b981' : '#f59e0b',
                              border: '3px solid #ffffff',
                              boxShadow: '0 0 0 2px #e2e8f0'
                            }} 
                          />

                          {/* Session Timeline Card */}
                          <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <strong style={{ color: 'var(--ba-color-primary)', fontSize: '13px' }}>{seqNo}</strong>
                              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{s.followUpDate ? `📅 Follow-up: ${s.followUpDate}` : 'Date: TBD'}</span>
                            </div>

                            <div style={{ fontSize: '12px', color: '#1e293b' }}>
                              Healer: <strong>{s.healer}</strong> • Status:{' '}
                              <span style={{ fontWeight: 'bold', color: s.status === 'Completed' ? '#10b981' : '#b45309' }}>
                                {s.status}
                              </span>
                            </div>

                            {/* observations Notes */}
                            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 12px', borderRadius: '6px', marginTop: '4px' }}>
                              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 800, marginBottom: '2px' }}>
                                Chakra observations
                              </div>
                              <p style={{ margin: 0, fontSize: '11px', color: '#475569', fontStyle: 'italic' }}>
                                {s.notes || 'No observations logged for this session.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
                      <p style={{ margin: 0, fontSize: '13px' }}>No session logs logged for this patient profile timeline.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointments Table */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #e6f4f1', paddingBottom: '12px', marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ba-color-primary)', textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                    <IonIcon icon={calendarOutline} style={{ color: 'var(--ba-color-primary)', fontSize: '18px' }} />
                    Operational Appointments Lifecycle
                  </h4>
                  <button className="st-btn st-btn--outline" onClick={() => setShowAptModal(true)} style={{ fontSize: '12px', padding: '6px 14px', whiteSpace: 'nowrap' }}>
                    + Book Appointment
                  </button>
                </div>

                <div className="st-table-container">
                  <table className="st-table">
                    <thead>
                      <tr>
                        <th style={{ whiteSpace: 'nowrap' }}>APT ID</th>
                        <th style={{ whiteSpace: 'nowrap' }}>DATE &amp; TIME</th>
                        <th style={{ whiteSpace: 'nowrap' }}>HEALER</th>
                        <th style={{ whiteSpace: 'nowrap' }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.appointments.length > 0 ? (
                        patient.appointments.map((a) => (
                          <tr key={a.id} className="st-table-row">
                            <td style={{ fontWeight: '700', whiteSpace: 'nowrap' }}>{a.id}</td>
                            <td style={{ fontSize: '11px', whiteSpace: 'nowrap' }}>{a.date} ({a.time})</td>
                            <td style={{ whiteSpace: 'nowrap' }}>{a.healer}</td>
                            <td>
                              <select
                                value={a.status}
                                onChange={(e) => handleTransitionAppointmentStatus(a.id, e.target.value as any)}
                                style={{
                                  padding: '4px 8px',
                                  borderRadius: '6px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  background:
                                    a.status === 'Completed' ? '#ecfdf5' :
                                    a.status === 'Confirmed' ? '#eff6ff' :
                                    a.status === 'Cancelled' ? '#fef2f2' : '#fffbeb',
                                  color:
                                    a.status === 'Completed' ? '#047857' :
                                    a.status === 'Confirmed' ? '#1d4ed8' :
                                    a.status === 'Cancelled' ? '#ef4444' : '#b45309',
                                  border: '1px solid #cbd5e1',
                                  outline: 'none',
                                }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Rescheduled">Rescheduled</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="st-table-empty">
                            No scheduled appointments.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {profileTab === 'financials' && (() => {
            const computedBalanceDue = patient.financials.invoices
              .filter((i) => i.status !== 'Paid')
              .reduce((sum, i) => sum + i.amount, 0);
            const totalCollected = patient.financials.invoices
              .filter((i) => i.status === 'Paid')
              .reduce((sum, i) => sum + i.amount, 0);

            return (
              <div>
                <div className="pa-billing-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                  <div className="sa-stat-card" style={{ borderLeft: '4px solid #ef4444', padding: '16px' }}>
                    <span className="sa-stat-card__label">Outstanding Balance</span>
                    <span className="sa-stat-card__value" style={{ color: computedBalanceDue > 0 ? '#ef4444' : '#64748b' }}>
                      ₹{computedBalanceDue}
                    </span>
                  </div>
                  <div className="sa-stat-card" style={{ borderLeft: '4px solid #10b981', padding: '16px' }}>
                    <span className="sa-stat-card__label">Completed Collections</span>
                    <span className="sa-stat-card__value" style={{ color: '#10b981' }}>
                      ₹{totalCollected}
                    </span>
                  </div>
                  <div className="sa-stat-card" style={{ borderLeft: '4px solid #3b82f6', padding: '16px' }}>
                    <span className="sa-stat-card__label">Billing Invoices</span>
                    <span className="sa-stat-card__value" style={{ color: '#3b82f6' }}>
                      {patient.financials.invoices.length} Bills
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span className="pa-info-block-title" style={{ margin: 0 }}>Payment Records Ledger</span>
                  <button className="st-btn st-btn--primary" onClick={() => setShowInvoiceModal(true)} style={{ fontSize: '10px', padding: '4px 8px' }}>
                    + Generate Invoice
                  </button>
                </div>

                <div className="st-table-container">
                  <table className="st-table">
                    <thead>
                      <tr>
                        <th>INVOICE NO</th>
                        <th>BILL DATE</th>
                        <th>AMOUNT DUE</th>
                        <th>PAYMENT METHOD</th>
                        <th>STATUS</th>
                        <th style={{ textAlign: 'center' }}>RECORD PAYMENT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patient.financials.invoices.length > 0 ? (
                        patient.financials.invoices.map((i) => (
                          <tr key={i.id} className="st-table-row">
                            <td style={{ fontWeight: '700' }}>{i.id}</td>
                            <td>{i.date}</td>
                            <td style={{ fontWeight: '700' }}>₹{i.amount}</td>
                            <td>{i.method || 'Pending'}</td>
                            <td>
                              <span className={`st-panel-badge ${
                                i.status === 'Paid' ? 'st-panel-badge--green' :
                                i.status === 'Partial' ? 'st-panel-badge--orange' : 'st-panel-badge--red'
                              }`} style={{ background: i.status === 'Unpaid' ? '#fee2e2' : i.status === 'Partial' ? '#fffbeb' : '', color: i.status === 'Unpaid' ? '#ef4444' : i.status === 'Partial' ? '#b45309' : '' }}>
                                {i.status}
                              </span>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {i.status !== 'Paid' ? (
                                <button 
                                  className="st-btn st-btn--primary" 
                                  onClick={() => { setSelectedInvoice(i); setPaymentRecord({ amountPaid: i.amount, method: 'UPI', status: 'Paid' }); setShowRecordPaymentModal(true); }} 
                                  style={{ fontSize: '10px', padding: '4px 10px' }}
                                >
                                  Record Payment
                                </button>
                              ) : (
                                <button className="st-btn st-btn--outline" onClick={() => alert(`Downloading invoice receipt PDF for ${i.id}...`)} style={{ fontSize: '10px', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <IonIcon icon={downloadOutline} /> Download PDF Receipt
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="st-table-empty">
                            No financial invoices found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })()}

          {profileTab === 'documents' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span className="pa-info-label" style={{ fontSize: '11px', fontWeight: 700 }}>Category Tag:</span>
                  <select
                    value={documentCategory}
                    onChange={(e) => setDocumentCategory(e.target.value as any)}
                    style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', outline: 'none' }}
                  >
                    <option value="Doctor Report">Doctor Report</option>
                    <option value="Lab Report">Lab Report</option>
                    <option value="Consultation Note">Consultation Note</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <button className="st-btn st-btn--primary" onClick={handleMockDocUpload} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IonIcon icon={cloudUploadOutline} /> Upload Document File
                </button>
              </div>

              <div className="pa-doc-vault-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                {patient.documents.length > 0 ? (
                  patient.documents.map((d) => (
                    <div className="pa-doc-vault-card" key={d.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div className="pa-doc-left" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div className={`pa-doc-icon ${d.type === 'image' ? 'pa-doc-icon--image' : ''}`} style={{ width: '40px', height: '40px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyItems: 'center', color: 'var(--ba-color-primary)', fontSize: '20px', justifyContent: 'center' }}>
                          <IonIcon icon={d.type === 'pdf' ? documentTextOutline : imageOutline} />
                        </div>
                        <div className="pa-doc-info" style={{ display: 'flex', flexDirection: 'column' }}>
                          <span className="pa-doc-name" style={{ fontWeight: 700, color: '#334155', fontSize: '14px' }}>{d.name}</span>
                          <span className="pa-doc-meta" style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{d.category} • {d.size} • {d.date}</span>
                        </div>
                      </div>
                      <div className="pa-doc-right" style={{ display: 'flex', gap: '6px' }}>
                        <button className="sa-action-btn sa-action-btn--view" title="View Document" onClick={() => alert(`Viewing document: ${d.name}\nUploaded By: ${d.uploadedBy || 'System'}\nUpload Date: ${d.date}`)}>
                          <IonIcon icon={eyeOutline} />
                        </button>
                        <button className="sa-action-btn sa-action-btn--edit" title="Download Document" onClick={() => alert(`Downloading document: ${d.name}`)}>
                          <IonIcon icon={downloadOutline} />
                        </button>
                        <button className="sa-action-btn sa-action-btn--delete" title="Delete Document" onClick={() => handleMockDocDelete(d.id)}>
                          <IonIcon icon={trashOutline} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="st-table-empty" style={{ gridColumn: 'span 2' }}>
                    Patient Vault is empty. Upload Doctor Reports, Lab Reports, Consultation Notes, or Other files.
                  </div>
                )}
              </div>
            </div>
          )}

          {profileTab === 'feedback' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: '#ffffff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span className="pa-info-block-title" style={{ fontSize: '13px', margin: 0, display: 'flex', alignItems: 'center', gap: '4px', color: '#0f172a' }}>
                  <IonIcon icon={star} style={{ color: '#f59e0b' }} />
                  Patient Experience &amp; Healing Feedback
                </span>
                <span className="st-panel-badge st-panel-badge--green" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  🔒 Quality Audit Locked Ledger
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {patient.feedback && patient.feedback.length > 0 ? (
                  patient.feedback.map((f, idx) => (
                    <div key={idx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, background: '#e2e8f0', padding: '3px 8px', borderRadius: '6px', color: '#475569' }}>
                            Ref: {f.sessionRef}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <IonIcon
                                key={i}
                                icon={star}
                                style={{ color: i < f.rating ? '#f59e0b' : '#cbd5e1', marginRight: '2px', fontSize: '14px' }}
                              />
                            ))}
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Submitted: {f.date}</span>
                      </div>
                      
                      <blockquote style={{ margin: 0, paddingLeft: '14px', borderLeft: '3px solid #1f7a6a', fontStyle: 'italic', fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                        "{f.comment}"
                      </blockquote>
                    </div>
                  ))
                ) : (
                  <div className="st-table-empty">
                    No feedback ratings recorded for this patient.
                  </div>
                )}
              </div>
            </div>
          )}

          {profileTab === 'logs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {/* Status Change Audit Table */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                  <span className="pa-info-block-title" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', marginBottom: '12px', margin: 0 }}>
                    <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} />
                    Patient Status Change History Log
                  </span>
                  
                  <div className="st-table-container">
                    <table className="st-table" style={{ fontSize: '11px' }}>
                      <thead>
                        <tr>
                          <th>PREV STATUS</th>
                          <th>NEW STATUS</th>
                          <th>CHANGED BY</th>
                          <th>TIMESTAMP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patient.statusHistory && patient.statusHistory.length > 0 ? (
                          patient.statusHistory.map((s, idx) => (
                            <tr key={idx} className="st-table-row">
                              <td style={{ textDecoration: 'line-through', color: '#94a3b8' }}>{s.prevStatus}</td>
                              <td style={{ fontWeight: 800, color: '#10b981' }}>{s.newStatus}</td>
                              <td>{s.changedBy}</td>
                              <td style={{ color: '#64748b' }}>{s.timestamp}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="st-table-empty" style={{ fontSize: '10px' }}>No status transitions logged.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Healer Assignment Audit Table */}
                <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                  <span className="pa-info-block-title" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', marginBottom: '12px', margin: 0 }}>
                    <IonIcon icon={personOutline} style={{ color: '#1f7a6a' }} />
                    Healer Assignment History Log
                  </span>
                  
                  <div className="st-table-container">
                    <table className="st-table" style={{ fontSize: '11px' }}>
                      <thead>
                        <tr>
                          <th>PREV HEALER</th>
                          <th>NEW HEALER</th>
                          <th>CHANGED BY</th>
                          <th>TIMESTAMP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patient.healerHistory && patient.healerHistory.length > 0 ? (
                          patient.healerHistory.map((h, idx) => (
                            <tr key={idx} className="st-table-row">
                              <td style={{ textDecoration: 'line-through', color: '#94a3b8' }}>{h.prevHealer}</td>
                              <td style={{ fontWeight: 800, color: '#1f7a6a' }}>{h.newHealer}</td>
                              <td>{h.changedBy}</td>
                              <td style={{ color: '#64748b' }}>{h.timestamp}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="st-table-empty" style={{ fontSize: '10px' }}>No healer assignments logged.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Immutable Activity Timeline */}
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                <span className="pa-info-block-title" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', marginBottom: '16px', margin: 0 }}>
                  <IonIcon icon={receiptOutline} style={{ color: '#8b5cf6' }} />
                  Immutable System Activity Timeline Logs
                </span>
                
                <div className="pa-activity-logs-list">
                  {patient.activityLogs.map((log, idx) => (
                    <div className="pa-activity-log-row" key={idx} style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                      <div className={`pa-activity-log-dot ${
                        log.category === 'payment' ? 'pa-activity-log-dot--payment' :
                        log.category === 'session_update' ? 'pa-activity-log-dot--session' :
                        log.category === 'profile_update' ? 'pa-activity-log-dot--edit' : ''
                      }`} style={{ width: '8px', height: '8px', borderRadius: '50%', background: log.category === 'payment' ? '#ef4444' : log.category === 'session_update' ? '#10b981' : '#3b82f6', marginTop: '6px', flexShrink: 0 }} />
                      <div className="pa-activity-log-details">
                        <span className="pa-activity-log-text" style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{log.action}</span>
                        <span className="pa-activity-log-stamp" style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', display: 'block' }}>
                          {log.timestamp} • Category: <strong style={{ color: '#64748b' }}>{log.category.toUpperCase()}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          MODAL 3: CREATE APPOINTMENT
         ========================================== */}
      <IonModal isOpen={showAptModal} onDidDismiss={() => setShowAptModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Book Appointment</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowAptModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="st-form">
              <div className="st-form-group">
                <label className="st-form-label">APPOINTMENT DATE</label>
                <input
                  type="date"
                  className="st-input"
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                />
              </div>
              <div className="st-form-group">
                <label className="st-form-label">SCHEDULED TIME SLOT</label>
                <input
                  type="text"
                  className="st-input"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                />
              </div>
              <div className="st-form-group">
                <label className="st-form-label">ASSIGNED CLINICAL HEALER</label>
                <select
                  className="st-input"
                  value={appointmentForm.healer}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, healer: e.target.value })}
                >
                  <option value="Dr. Anjali Rao">Dr. Anjali Rao</option>
                  <option value="Dr. Kevin Smith">Dr. Kevin Smith</option>
                </select>
              </div>
              <div className="st-form-group">
                <label className="st-form-label">APPOINTMENT INITIAL STATUS</label>
                <select
                  className="st-input"
                  value={appointmentForm.status}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, status: e.target.value as any })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
              </div>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowAptModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleAddAppointment}>Confirm Appointment</button>
          </div>
        </div>
      </IonModal>

      {/* ==========================================
          MODAL 4: CREATE HEALING SESSION
         ========================================== */}
      <IonModal isOpen={showSesModal} onDidDismiss={() => setShowSesModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Add Healing Session Record</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowSesModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="st-form">
              <div className="st-form-group">
                <label className="st-form-label">CLINICAL HEALER</label>
                <select
                  className="st-input"
                  value={sessionForm.healer}
                  onChange={(e) => setSessionForm({ ...sessionForm, healer: e.target.value })}
                >
                  <option value="Dr. Anjali Rao">Dr. Anjali Rao</option>
                  <option value="Dr. Kevin Smith">Dr. Kevin Smith</option>
                </select>
              </div>
              <div className="st-form-group">
                <label className="st-form-label">SESSION STATUS</label>
                <select
                  className="st-input"
                  value={sessionForm.status}
                  onChange={(e) => setSessionForm({ ...sessionForm, status: e.target.value as any })}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="st-form-group">
                <label className="st-form-label">CLINICAL ENERGETIC SESSION NOTES</label>
                <textarea
                  className="st-textarea"
                  rows={3}
                  placeholder="Describe chakras treated, blockages cleared..."
                  value={sessionForm.notes}
                  onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
                />
              </div>
              <div className="st-form-group">
                <label className="st-form-label">FOLLOW UP RECOMMENDED DATE</label>
                <input
                  type="date"
                  className="st-input"
                  value={sessionForm.followUpDate}
                  onChange={(e) => setSessionForm({ ...sessionForm, followUpDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowSesModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleAddSession}>Create Session</button>
          </div>
        </div>
      </IonModal>

      {/* ==========================================
          MODAL 5: GENERATE INVOICE
         ========================================== */}
      <IonModal isOpen={showInvoiceModal} onDidDismiss={() => setShowInvoiceModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Generate Invoice</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowInvoiceModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="st-form">
              <div className="st-form-group">
                <label className="st-form-label">INVOICE AMOUNT (INR) *</label>
                <input
                  type="number"
                  className="st-input"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowInvoiceModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleGenerateInvoice}>Generate Bill</button>
          </div>
        </div>
      </IonModal>

      {/* ==========================================
          MODAL 6: RECORD PAYMENT FOR INVOICE
         ========================================== */}
      <IonModal isOpen={showRecordPaymentModal} onDidDismiss={() => setShowRecordPaymentModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Record Bill Payment: {selectedInvoice?.id}</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowRecordPaymentModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            {selectedInvoice && (
              <div className="st-form">
                <div className="st-form-group">
                  <label className="st-form-label">TOTAL INVOICE AMOUNT (INR)</label>
                  <input
                    type="text"
                    className="st-input"
                    value={`₹${selectedInvoice.amount}`}
                    disabled
                    style={{ background: '#f1f5f9', fontWeight: 'bold' }}
                  />
                </div>
                
                <div className="st-form-group">
                  <label className="st-form-label">AMOUNT RECEIVED (INR) *</label>
                  <input
                    type="number"
                    className="st-input"
                    value={paymentRecord.amountPaid}
                    onChange={(e) => setPaymentRecord({ ...paymentRecord, amountPaid: Number(e.target.value) })}
                    placeholder="Enter amount paid"
                  />
                </div>

                <div className="st-form-group">
                  <label className="st-form-label">PAYMENT CHANNEL MODE *</label>
                  <select
                    className="st-input"
                    value={paymentRecord.method}
                    onChange={(e) => setPaymentRecord({ ...paymentRecord, method: e.target.value as any })}
                  >
                    <option value="UPI">UPI Payment Channel</option>
                    <option value="Cash">Cash Handover Ledger</option>
                    <option value="Bank Transfer">Bank Wire Transfer</option>
                  </select>
                </div>

                <div className="st-form-group">
                  <label className="st-form-label">POST-TRANSACTION STATUS *</label>
                  <select
                    className="st-input"
                    value={paymentRecord.status}
                    onChange={(e) => setPaymentRecord({ ...paymentRecord, status: e.target.value as any })}
                  >
                    <option value="Paid">Fully Paid (Settled)</option>
                    <option value="Partial">Partially Paid (Pending balance)</option>
                    <option value="Pending">Still Pending (Unpaid)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowRecordPaymentModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleRecordPaymentSubmit}>Save Payment Record</button>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default DetailsPatientPage;
