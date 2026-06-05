import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonIcon,
  useIonToast,
} from '@ionic/react';
import {
  arrowBackOutline,
  closeOutline,
  alertCircleOutline,
  checkmarkCircleOutline,
  swapHorizontalOutline,
  trashOutline,
} from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { ROUTES } from '../../constants/routes.constant';
import { Healer, Patient } from './HealersPage';
import './branch-admin.css';

// Initial session history dummy data matching HealersPage.tsx
const INITIAL_SESSION_HISTORY = [
  { sessionNumber: 'SES-912', patientName: 'Sarah Mitchell', treatmentType: 'Aura Cleansing', date: '2026-05-20', notesStatus: 'Completed', healerId: 'H-2091' },
  { sessionNumber: 'SES-913', patientName: 'Michael Chen', treatmentType: 'Stress Relief Protocol', date: '2026-05-26', notesStatus: 'Pending Notes', healerId: 'H-2091' },
  { sessionNumber: 'SES-914', patientName: 'John Walker', treatmentType: 'Chakra Energizer', date: '2026-05-22', notesStatus: 'Completed', healerId: 'H-2104' },
  { sessionNumber: 'SES-915', patientName: 'Elena Rostova', treatmentType: 'Psychotherapy Sweep', date: '2026-05-25', notesStatus: 'Completed', healerId: 'H-1822' },
  { sessionNumber: 'SES-916', patientName: 'Rohan Mehta', treatmentType: 'Pranic Purifying', date: '2026-05-18', notesStatus: 'Completed', healerId: 'H-1822' }
];

export default function InfoHealersPage() {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [present] = useIonToast();

  const isBranchAdmin = user?.role === 'BRANCH_ADMIN';
  const assignedBranch = user?.branch || 'Mumbai';

  // Load healers and patients from localStorage
  const [healers, setHealers] = useState<Healer[]>(() => {
    const saved = localStorage.getItem('phms_healers');
    return saved ? JSON.parse(saved) : [];
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('phms_patients');
    return saved ? JSON.parse(saved) : [];
  });

  // Modals for reassigning
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [selectedPatientToReassign, setSelectedPatientToReassign] = useState<Patient | null>(null);
  const [targetHealerId, setTargetHealerId] = useState('');

  const healer = healers.find((h) => h.id === id);

  // Formatted date display for header
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Save data back to localStorage when states update
  useEffect(() => {
    localStorage.setItem('phms_patients', JSON.stringify(patients));
  }, [patients]);

  const triggerToast = (msg: string, color: 'success' | 'danger' = 'success') => {
    present({
      message: msg,
      duration: 3000,
      position: 'top',
      color: color,
    });
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
                <span className="db-access-restricted-title">Unauthorized Access</span>
                <p className="db-access-restricted-desc">
                  Access Denied. Viewing this Healer Profile requires an authorized Branch Admin session.
                </p>
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (!healer) {
    return (
      <IonPage className="sa-page">
        <IonContent className="sa-page__content" style={{ '--background': '#f8fafc' }} fullscreen>
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <IonIcon icon={alertCircleOutline} style={{ fontSize: '48px', color: '#ef4444', marginBottom: '16px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>Healer Profile Not Found</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
              The healer with ID {id} was not found in the database.
            </p>
            <button 
              className="st-btn st-btn--primary" 
              onClick={() => history.push(ROUTES.BRANCH_ADMIN.HEALERS)}
            >
              Back to Healers Registry
            </button>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // ── REASSIGNMENT & REMOVE HANDLERS ──────────────────────────────────
  const handleRemovePatientAssignment = (patientId: string) => {
    const pat = patients.find(p => p.id === patientId);
    if (!pat) return;

    setPatients(prev =>
      prev.map(p =>
        p.id === patientId ? { ...p, assignedHealerId: '' } : p
      )
    );

    // Save audit log
    const savedLogs = localStorage.getItem('phms_reassignment_logs') || '[]';
    const logs = JSON.parse(savedLogs);
    const newLog = {
      id: `L-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: pat.id,
      patientName: pat.name,
      prevHealer: healer.name,
      newHealer: 'Unassigned',
      changedBy: user?.name || user?.email || 'Aria Seraphina',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      reason: 'Removed from healer caseload',
    };
    localStorage.setItem('phms_reassignment_logs', JSON.stringify([newLog, ...logs]));

    triggerToast(`Patient ${pat.name} removed from caseload.`);
  };

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientToReassign || !targetHealerId) return;

    const targetHealer = healers.find(h => h.id === targetHealerId);
    if (!targetHealer) {
      triggerToast('Please select a valid healer.', 'danger');
      return;
    }

    setPatients(prev =>
      prev.map(p =>
        p.id === selectedPatientToReassign.id ? { ...p, assignedHealerId: targetHealerId } : p
      )
    );

    // Save audit log
    const savedLogs = localStorage.getItem('phms_reassignment_logs') || '[]';
    const logs = JSON.parse(savedLogs);
    const newLog = {
      id: `L-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: selectedPatientToReassign.id,
      patientName: selectedPatientToReassign.name,
      prevHealer: healer.name,
      newHealer: targetHealer.name,
      changedBy: user?.name || user?.email || 'Aria Seraphina',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      reason: 'Caseload reassignment',
    };
    localStorage.setItem('phms_reassignment_logs', JSON.stringify([newLog, ...logs]));

    triggerToast(`Reassigned ${selectedPatientToReassign.name} to Dr. ${targetHealer.name}.`);
    setShowReassignModal(false);
    setSelectedPatientToReassign(null);
    setTargetHealerId('');
  };

  // Healers available for reassignment (exclude current healer and only active ones)
  const availableHealers = healers.filter(h => h.id !== healer.id && h.status === 'ACTIVE');

  // Filter linked patients
  const linkedPatients = patients.filter(p => p.assignedHealerId === healer.id);
  const activePatientsCount = patients.filter(p => p.assignedHealerId === healer.id && p.status === 'Active').length;

  return (
    <IonPage className="sa-page">
      <IonContent className="sa-page__content" style={{ '--background': '#f8fafc' }} fullscreen>
        <div className="db-corp-layout" style={{ background: '#f8fafc', minHeight: '100%' }}>
          
          <main className="db-corp-canvas">
            {/* ── TOP NAV BAR ────────────────────────────────────── */}
            <header className="db-corp-navbar" style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button 
                  className="db-corp-back-btn" 
                  onClick={() => history.push(ROUTES.BRANCH_ADMIN.HEALERS)} 
                  title="Back to Healers Registry"
                >
                  <IonIcon icon={arrowBackOutline} />
                </button>
                <div className="db-corp-navbar-left">
                  <h1 className="db-corp-page-title" style={{ color: '#0d5c46', fontWeight: 800, fontSize: '20px', margin: 0 }}>Healer Detailed Profile</h1>
                  <p className="db-corp-page-subtitle" style={{ color: '#64748b', fontSize: '12px', margin: '2px 0 0 0' }}>Pranic Healing Management System • {formattedDate}</p>
                </div>
              </div>
            </header>

            {/* ── WORKSPACE WRAPPER ───────────────────────────────── */}
            <div style={{ padding: '32px', display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '32px', maxWidth: '880px', width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                
                {/* Profile Header Block */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid #f1f5f9' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: healer.avatarBg || '#0d5c46', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800 }}>
                    {healer.initials}
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#1e293b' }}>
                      {healer.name.toLowerCase().startsWith('dr.') ? healer.name : `Dr. ${healer.name}`}
                    </h2>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>ID: {healer.id} • {healer.branch || assignedBranch} Branch</div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', alignItems: 'center' }}>
                      <span style={{ 
                        fontSize: '11px', 
                        fontWeight: 700, 
                        padding: '4px 10px', 
                        borderRadius: '9999px', 
                        textTransform: 'uppercase',
                        background: healer.status === 'ACTIVE' ? '#ecfdf5' : '#fef2f2',
                        color: healer.status === 'ACTIVE' ? '#10b981' : '#ef4444',
                        display: 'inline-block'
                      }}>{healer.status}</span>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Joined: {healer.createdAt}</span>
                    </div>
                  </div>
                </div>

                {/* 2-Column Grid Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '32px' }}>
                  
                  {/* Left Column: Basic Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', borderRight: '1px solid #f1f5f9', paddingRight: '32px' }}>
                    <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#0d5c46', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', letterSpacing: '0.5px' }}>Basic Details</h3>
                    
                    {[
                      { label: 'Gender', val: healer.gender },
                      { label: 'Date of Birth', val: healer.dob },
                      { label: 'Mobile Number', val: healer.phone },
                      { label: 'Email Address', val: healer.email },
                      { label: 'Address', val: healer.address },
                      { label: 'Certification', val: healer.certificationLevel },
                      { label: 'Experience (Years)', val: `${healer.experience} Years` },
                      { label: 'Specialization', val: healer.specialization.join(', ') },
                    ].map((item, idx) => (
                      <div key={idx} style={{ fontSize: '13px' }}>
                        <div style={{ color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', fontSize: '9px', marginBottom: '3px', letterSpacing: '0.4px' }}>{item.label}</div>
                        <div style={{ color: '#334155', fontWeight: 600, lineHeight: 1.4 }}>{item.val || 'Not Specified'}</div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Caseload & Performance */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Performance Stats Cards Row */}
                    <div>
                      <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 800, textTransform: 'uppercase', color: '#0d5c46', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '16px', letterSpacing: '0.5px' }}>Caseload & Performance</h3>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                        <div style={{ background: '#f8fafc', padding: '12px 6px', borderRadius: '8px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
                          <div style={{ fontSize: '18px', fontWeight: 800, color: '#0d5c46' }}>{healer.cumulativeHealingCount || healer.completedSessions || 0}</div>
                          <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px', lineHeight: 1.1 }}>Healing count</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '12px 6px', borderRadius: '8px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
                          <div style={{ fontSize: '18px', fontWeight: 800, color: '#3b82f6' }}>{activePatientsCount}</div>
                          <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px', lineHeight: 1.1 }}>Active Patients</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '12px 6px', borderRadius: '8px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
                          <div style={{ fontSize: '18px', fontWeight: 800, color: '#10b981' }}>{healer.completedSessions || 0}</div>
                          <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px', lineHeight: 1.1 }}>Sessions done</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '12px 6px', borderRadius: '8px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
                          <div style={{ fontSize: '18px', fontWeight: 800, color: '#ef4444' }}>{healer.urgentFollowUps || 0}</div>
                          <div style={{ fontSize: '9px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px', lineHeight: 1.1 }}>Urgent Flags</div>
                        </div>
                      </div>
                    </div>

                    {/* Linked Active Caseload Table */}
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Linked Active Caseload</h4>
                      <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <table className="sa-table" style={{ width: '100%', margin: 0 }}>
                          <thead style={{ background: '#f8fafc' }}>
                            <tr>
                              <th style={{ padding: '8px 12px', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>PATIENT NAME</th>
                              <th style={{ padding: '8px 12px', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>CASE TYPE</th>
                              <th style={{ padding: '8px 12px', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>SESSIONS</th>
                              <th style={{ padding: '8px 12px', fontSize: '11px', color: '#64748b', fontWeight: 700, textAlign: 'center' }}>ACTION</th>
                            </tr>
                          </thead>
                          <tbody>
                            {linkedPatients.map(p => (
                              <tr key={p.id}>
                                <td style={{ padding: '10px 12px', fontSize: '12px', fontWeight: 800, color: '#1e293b' }}>{p.name}</td>
                                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#475569' }}>{p.caseType}</td>
                                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#475569' }}>{p.sessionCount} Sessions</td>
                                <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                                    <button 
                                      onClick={() => {
                                        setSelectedPatientToReassign(p);
                                        setShowReassignModal(true);
                                      }}
                                      style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', fontWeight: 700, color: '#475569', cursor: 'pointer' }}
                                    >
                                      Reassign
                                    </button>
                                    <button 
                                      onClick={() => handleRemovePatientAssignment(p.id)}
                                      style={{ background: '#fee2e2', border: 'none', borderRadius: '4px', padding: '4px 8px', fontSize: '10px', fontWeight: 700, color: '#ef4444', cursor: 'pointer' }}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                            {linkedPatients.length === 0 && (
                              <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '12px', fontStyle: 'italic', background: '#f8fafc' }}>
                                  No patients currently linked.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Recent Treatment Session Log */}
                    <div>
                      <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 800, color: '#475569', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Recent Treatment Session Log</h4>
                      <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                        <table className="sa-table" style={{ width: '100%', margin: 0 }}>
                          <thead style={{ background: '#f8fafc' }}>
                            <tr>
                              <th style={{ padding: '8px 12px', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>SESSION</th>
                              <th style={{ padding: '8px 12px', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>PATIENT</th>
                              <th style={{ padding: '8px 12px', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>TREATMENT TYPE</th>
                              <th style={{ padding: '8px 12px', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>DATE</th>
                              <th style={{ padding: '8px 12px', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>NOTES</th>
                            </tr>
                          </thead>
                          <tbody>
                            {INITIAL_SESSION_HISTORY.filter(s => s.healerId === healer.id).map((s, i) => (
                              <tr key={i}>
                                <td style={{ padding: '10px 12px', fontSize: '12px', fontWeight: 700, color: '#1e293b' }}>{s.sessionNumber}</td>
                                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#475569' }}>{s.patientName}</td>
                                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#475569' }}>{s.treatmentType}</td>
                                <td style={{ padding: '10px 12px', fontSize: '12px', color: '#64748b' }}>{s.date}</td>
                                <td style={{ padding: '10px 12px' }}>
                                  <span style={{ 
                                    fontSize: '10px', 
                                    padding: '2px 6px', 
                                    borderRadius: '4px', 
                                    background: s.notesStatus === 'Completed' ? '#d1fae5' : '#fee2e2', 
                                    color: s.notesStatus === 'Completed' ? '#065f46' : '#ef4444', 
                                    fontWeight: 700,
                                    display: 'inline-block' 
                                  }}>
                                    {s.notesStatus}
                                  </span>
                                </td>
                              </tr>
                            ))}
                            {INITIAL_SESSION_HISTORY.filter(s => s.healerId === healer.id).length === 0 && (
                              <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#94a3b8', fontSize: '12px', fontStyle: 'italic', background: '#f8fafc' }}>
                                  No session logs found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Footer Buttons Block */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                  <button 
                    onClick={() => history.push(ROUTES.BRANCH_ADMIN.HEALERS)} 
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
                    Back to Registry
                  </button>
                </div>

              </div>
            </div>

          </main>
        </div>

        {/* ── MODAL: REASSIGN PATIENT TO OTHER HEALER ───────────────────────── */}
        {showReassignModal && selectedPatientToReassign && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
            <div style={{ background: '#fff', borderRadius: '16px', padding: '28px', maxWidth: '480px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IonIcon icon={swapHorizontalOutline} style={{ color: '#0d5c46' }} /> Reassign Patient Caseload
                </h3>
                <button 
                  onClick={() => {
                    setShowReassignModal(false);
                    setSelectedPatientToReassign(null);
                    setTargetHealerId('');
                  }} 
                  style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
                >
                  <IonIcon icon={closeOutline} />
                </button>
              </div>

              <form onSubmit={handleReassignSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Patient Name</span>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>{selectedPatientToReassign.name}</div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Select Target Healer *</label>
                  <select
                    required
                    value={targetHealerId}
                    onChange={e => setTargetHealerId(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', background: '#fff', color: '#1e293b' }}
                  >
                    <option value="">Select an Active Healer...</option>
                    {availableHealers.map(h => (
                      <option key={h.id} value={h.id}>Dr. {h.name} ({h.specialization.join(', ')})</option>
                    ))}
                  </select>
                  {availableHealers.length === 0 && (
                    <span style={{ fontSize: '11px', color: '#ef4444', display: 'block', marginTop: '6px' }}>No other active healers are registered in this branch.</span>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReassignModal(false);
                      setSelectedPatientToReassign(null);
                      setTargetHealerId('');
                    }}
                    style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!targetHealerId}
                    style={{ background: '#0d5c46', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: !targetHealerId ? 'not-allowed' : 'pointer', opacity: !targetHealerId ? 0.6 : 1 }}
                  >
                    Reassign Caseload
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </IonContent>
    </IonPage>
  );
}
