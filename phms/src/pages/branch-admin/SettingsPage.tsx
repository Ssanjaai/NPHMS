import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonIcon,
  IonMenuButton,
  IonModal,
} from '@ionic/react';
import {
  notificationsOutline,
  searchOutline,
  alertCircleOutline,
  addOutline,
  filterOutline,
  checkmarkCircleOutline,
  businessOutline,
  peopleOutline,
  shieldCheckmarkOutline,
  documentTextOutline,
  calendarOutline,
  alarmOutline,
  cardOutline,
  barChartOutline,
  constructOutline,
  keyOutline,
  refreshOutline,
  lockOpenOutline,
  lockClosedOutline,
  globeOutline,
  timeOutline,
  cloudUploadOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../../store/auth.store';
import './branch-admin.css';

interface BranchUser {
  id: number;
  name: string;
  role: 'Para Healer' | 'Patient';
  contact: string;
  email: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  isLocked: boolean;
}

interface ActiveSession {
  id: number;
  ip: string;
  device: string;
  location: string;
  activeSince: string;
}

interface SecurityLog {
  id: number;
  timestamp: string;
  event: string;
  user: string;
  status: 'Success' | 'Failed';
}

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();

  // Dynamic prefill branch info
  const rawBranch = typeof user?.branch === 'object' && user?.branch !== null
    ? (user.branch as any).name
    : (user?.branch || 'Salem');
  const isSalem = rawBranch.toLowerCase().includes('salem');
  const isMumbai = rawBranch.toLowerCase().includes('mumbai');

  const defaultBranchName = isSalem ? 'Salem PH Center' : (isMumbai ? 'Mumbai PH Center' : `${rawBranch} PH Center`);
  const defaultEmail = isSalem ? 'salem@pranichealing.com' : (isMumbai ? 'mumbai@pranichealing.com' : `${rawBranch.toLowerCase().replace(/ /g, '')}@pranichealing.com`);
  const defaultContact = isSalem ? '+91 98765 43210' : (isMumbai ? '+91 99112 23344' : '+91 98765 00000');
  const defaultAddress = isSalem 
    ? '12/B Heritage Plaza, Omalur Main Road, Salem, Tamil Nadu, 636004' 
    : (isMumbai ? '404 Corporate Park, Omalur Main Road, Mumbai, Maharashtra, 400001' : '123 Spiritual Pathway, Healing Center');

  // Active Tab State
  const [activeTab, setActiveTab] = useState<string>('center');
  const [showToastMessage, setShowToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setShowToastMessage(msg);
    setTimeout(() => setShowToastMessage(null), 3000);
  };

  // ==========================================
  // TAB 1: Center Profile Configuration State
  // ==========================================
  const [centerForm, setCenterForm] = useState({
    name: defaultBranchName,
    contact: defaultContact,
    email: defaultEmail,
    address: defaultAddress,
    timezone: 'Asia/Kolkata (IST)',
    emergencyContact: '+91 91100 91100',
    operatingHours: '9 AM - 6 PM',
  });
  const [savedCenterForm, setSavedCenterForm] = useState({ ...centerForm });
  const [logoUploaded, setLogoUploaded] = useState<boolean>(true);

  // ==========================================
  // TAB 2: User Accounts Configuration State
  // ==========================================
  const [users, setUsers] = useState<BranchUser[]>([
    { id: 1, name: 'Ravi Kumar', role: 'Para Healer', contact: '9876543210', email: 'ravi.kumar@example.com', status: 'Active', lastLogin: '10 mins ago', isLocked: false },
    { id: 2, name: 'Priya Sharma', role: 'Patient', contact: '9911223344', email: 'priya.sharma@example.com', status: 'Active', lastLogin: '2 days ago', isLocked: false },
    { id: 3, name: 'Sanjay Verma', role: 'Para Healer', contact: '9876543211', email: 'sanjay.verma@example.com', status: 'Inactive', lastLogin: '3 weeks ago', isLocked: true },
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showSuccessSummary, setShowSuccessSummary] = useState(false);
  const [generatedCreds, setGeneratedCreds] = useState({
    username: '',
    password: '',
    name: '',
    role: '',
    contact: '',
    email: '',
  });

  const [newUser, setNewUser] = useState({
    name: '',
    role: 'Para Healer' as 'Para Healer' | 'Patient',
    contact: '',
    email: '',
    autoGen: true,
    sendSMS: true,
    sendEmail: true,
  });

  // ==========================================
  // TAB 3: Security & Session Log State
  // ==========================================
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [twoFactor, setTwoFactor] = useState<boolean>(false);
  const [sessions, setSessions] = useState<ActiveSession[]>([
    { id: 1, ip: '192.168.1.104', device: 'Chrome / Windows 11', location: 'Salem, IN (Current Session)', activeSince: 'Today, 02:40 PM' },
    { id: 2, ip: '106.213.85.12', device: 'Safari / iPhone 15', location: 'Mumbai, IN', activeSince: 'Yesterday, 10:15 AM' },
  ]);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([
    { id: 1, timestamp: '2026-06-03 14:32:10', event: 'User Login', user: 'Ravi Kumar', status: 'Success' },
    { id: 2, timestamp: '2026-06-03 13:15:42', event: 'Password Reset Request', user: 'Sanjay Verma', status: 'Success' },
    { id: 3, timestamp: '2026-06-03 09:44:12', event: 'Failed Authentication Attempt', user: 'admin@phms.com', status: 'Failed' },
  ]);

  // ==========================================
  // TAB 4: Notifications Settings State
  // ==========================================
  const [notificationConfig, setNotificationConfig] = useState({
    smsEnabled: true,
    emailEnabled: true,
    sessionReminder: '24_hours_before',
    feedbackReminder: '1_day_after',
  });

  // ==========================================
  // TAB 5: Document Upload Rules State
  // ==========================================
  const [documentConfig, setDocumentConfig] = useState({
    pdf: true,
    png: true,
    jpg: true,
    doc: false,
    xlsx: false,
    maxSize: '10MB',
    retention: '5_years',
  });

  // ==========================================
  // TAB 6: Attendance Validation Rules State
  // ==========================================
  const [attendanceConfig, setAttendanceConfig] = useState({
    checkInTime: '09:00',
    checkOutTime: '18:00',
    gracePeriod: '15_mins',
    halfDayThreshold: '12:00',
  });

  // ==========================================
  // TAB 7: Session Configuration State
  // ==========================================
  const [sessionConfig, setSessionConfig] = useState({
    defaultDuration: '60_mins',
    reminderTiming: '24_hours_before',
    autoFollowUpAlert: true,
  });

  // ==========================================
  // TAB 8: Finance & Invoicing State
  // ==========================================
  const [financeConfig, setFinanceConfig] = useState({
    cash: true,
    upi: true,
    bankTransfer: true,
    receiptFormat: 'TXN-YYYY-XXXX',
    invoiceFormat: 'INV-YYYY-XXXX',
  });

  // ==========================================
  // TAB 9: Reports & Export Customization State
  // ==========================================
  const [reportsConfig, setReportsConfig] = useState({
    defaultRange: 'this_month',
    exportPdf: true,
    exportExcel: true,
    pdfHeader: 'Pranic Healing Center - Official Summary Statement',
    pdfFooter: 'Confidential document generated by PHMS. Salem Branch.',
  });

  // ==========================================
  // TAB 10: System Utilities State
  // ==========================================
  const [backupStatus, setBackupStatus] = useState<string>('Yesterday, 11:30 PM');
  const [isBackingUp, setIsBackingUp] = useState<boolean>(false);

  // ==========================================
  // ACTIONS / HANDLERS
  // ==========================================
  const handleSaveCenter = () => {
    setSavedCenterForm({ ...centerForm });
    triggerToast('Center profile settings saved successfully!');
  };

  const handleDiscardCenter = () => {
    setCenterForm({ ...savedCenterForm });
    triggerToast('Discarded changes. Restored last saved profile.');
  };

  const handleToggleUserStatus = (userId: number) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    triggerToast('User status updated successfully.');
  };

  const handleToggleUserLock = (userId: number) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, isLocked: !u.isLocked };
      }
      return u;
    }));
    const toggledUser = users.find(u => u.id === userId);
    triggerToast(toggledUser?.isLocked ? 'User account unlocked!' : 'User account locked successfully.');
  };

  const handleResetUserPassword = (userName: string) => {
    triggerToast(`Password reset link compiled and sent to ${userName}.`);
  };

  const handleResendCredentials = (userName: string) => {
    triggerToast(`Account credentials queued for re-dispatch to ${userName}.`);
  };

  const handleAddUserSubmit = () => {
    if (!newUser.name || !newUser.contact || !newUser.email) {
      alert('Please fill out all fields.');
      return;
    }

    const cleanName = newUser.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const generatedUsername = `${cleanName}.${newUser.role === 'Para Healer' ? 'healer' : 'patient'}`;
    const generatedPassword = `PHMS-${Math.random().toString(36).substring(2, 8).toUpperCase()}!`;

    const added: BranchUser = {
      id: Date.now(),
      name: newUser.name,
      role: newUser.role,
      contact: newUser.contact,
      email: newUser.email,
      status: 'Active',
      lastLogin: 'Never',
      isLocked: false,
    };

    setUsers([added, ...users]);
    setGeneratedCreds({
      username: generatedUsername,
      password: generatedPassword,
      name: newUser.name,
      role: newUser.role,
      contact: newUser.contact,
      email: newUser.email,
    });

    setShowSuccessSummary(true);
  };

  const handleCloseSuccessSummary = () => {
    setShowSuccessSummary(false);
    setShowAddUserModal(false);
    setNewUser({
      name: '',
      role: 'Para Healer',
      contact: '',
      email: '',
      autoGen: true,
      sendSMS: true,
      sendEmail: true,
    });
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      alert('Please fill in all password fields.');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      alert('New password and password confirmation do not match.');
      return;
    }
    setPasswordForm({ current: '', new: '', confirm: '' });
    triggerToast('Primary login credentials updated successfully!');
  };

  const handleRevokeSession = (sessionId: number) => {
    setSessions(sessions.filter(s => s.id !== sessionId));
    triggerToast('Access token revoked. Session terminated successfully.');
  };

  const handleBackupNow = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupStatus(new Date().toLocaleString());
      triggerToast('Database snapshot archived successfully!');
    }, 2000);
  };

  // Filter users inside user directory tab
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.contact.includes(searchQuery) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Branch Settings Workspace</IonTitle>
          
          <IonButtons slot="end">
            <button className="st-header-bell" title="Notifications">
              <IonIcon icon={notificationsOutline} />
            </button>
            <button className="sa-page__toolbar-avatar">BA</button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content" fullscreen>
        <div className="sa-page__body">
          {/* Header row */}
          <div className="st-header-row">
            <div>
              <h1 className="st-page-title">Branch Settings Console</h1>
              <p className="st-page-subtitle">
                Configure clinic operations, user directories, file upload rules, notifications triggers, security parameters, and reports export layouts.
              </p>
            </div>
          </div>

          {/* Action Toasts */}
          {showToastMessage && (
            <div className="st-toast-notification st-toast-notification--success" style={{ zIndex: 1000 }}>
              <IonIcon icon={checkmarkCircleOutline} className="toast-icon" />
              <span>{showToastMessage}</span>
            </div>
          )}

          {/* Tabbed Console Panel wrapper */}
          <div className="st-settings-console">
            
            {/* LEFT SIDEBAR NAVIGATION BUTTONS */}
            <div className="st-settings-nav">
              <button 
                className={`st-settings-nav-item ${activeTab === 'center' ? 'active' : ''}`}
                onClick={() => setActiveTab('center')}
              >
                <IonIcon icon={businessOutline} /> Center Profile
              </button>
              <button 
                className={`st-settings-nav-item ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <IonIcon icon={peopleOutline} /> User Directory
              </button>
              <button 
                className={`st-settings-nav-item ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <IonIcon icon={shieldCheckmarkOutline} /> Security & Logs
              </button>
              <button 
                className={`st-settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <IonIcon icon={notificationsOutline} /> Notifications
              </button>
              <button 
                className={`st-settings-nav-item ${activeTab === 'documents' ? 'active' : ''}`}
                onClick={() => setActiveTab('documents')}
              >
                <IonIcon icon={documentTextOutline} /> Document Rules
              </button>
              <button 
                className={`st-settings-nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
                onClick={() => setActiveTab('attendance')}
              >
                <IonIcon icon={calendarOutline} /> Attendance Rules
              </button>
              <button 
                className={`st-settings-nav-item ${activeTab === 'sessions' ? 'active' : ''}`}
                onClick={() => setActiveTab('sessions')}
              >
                <IonIcon icon={alarmOutline} /> Session Config
              </button>
              <button 
                className={`st-settings-nav-item ${activeTab === 'finance' ? 'active' : ''}`}
                onClick={() => setActiveTab('finance')}
              >
                <IonIcon icon={cardOutline} /> Finance & Billing
              </button>
              <button 
                className={`st-settings-nav-item ${activeTab === 'reports' ? 'active' : ''}`}
                onClick={() => setActiveTab('reports')}
              >
                <IonIcon icon={barChartOutline} /> Reports Prefs
              </button>
              <button 
                className={`st-settings-nav-item ${activeTab === 'utilities' ? 'active' : ''}`}
                onClick={() => setActiveTab('utilities')}
              >
                <IonIcon icon={constructOutline} /> System Utilities
              </button>
            </div>

            {/* RIGHT PANEL CONTENT DRAWER */}
            <div className="st-settings-content-panel">

              {/* TAB 1: CENTER PROFILE */}
              {activeTab === 'center' && (
                <>
                  <div className="st-settings-section-header">
                    <h2 className="st-settings-section-title">Center Profile Settings</h2>
                    <p className="st-settings-section-desc">Manage physical address coordinates, business hours, and operational contact channels.</p>
                  </div>

                  {/* Logo Management */}
                  <div className="sa-code-box" style={{ display: 'flex', gap: '20px', alignItems: 'center', padding: '16px', borderRadius: '8px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '8px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {logoUploaded ? (
                        <div style={{ background: 'var(--color-primary)', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>Logo</div>
                      ) : (
                        <IonIcon icon={businessOutline} style={{ fontSize: '32px', color: '#64748b' }} />
                      )}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Center Logo</div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="sa-btn sa-btn--sm sa-btn--outline" onClick={() => { setLogoUploaded(true); triggerToast('Logo uploaded successfully!'); }}>Upload Logo</button>
                        {logoUploaded && (
                          <button className="sa-btn sa-btn--sm sa-btn--delete-light" onClick={() => { setLogoUploaded(false); triggerToast('Logo removed.'); }}>Remove</button>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="st-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="st-form-group">
                      <label className="st-form-label">BRANCH NAME</label>
                      <input
                        type="text"
                        className="st-input"
                        value={centerForm.name}
                        onChange={(e) => setCenterForm({ ...centerForm, name: e.target.value })}
                      />
                    </div>

                    <div className="st-settings-grid-row">
                      <div className="st-form-group">
                        <label className="st-form-label">BRANCH CONTACT NUMBER</label>
                        <input
                          type="text"
                          className="st-input"
                          value={centerForm.contact}
                          onChange={(e) => setCenterForm({ ...centerForm, contact: e.target.value })}
                        />
                      </div>
                      <div className="st-form-group">
                        <label className="st-form-label">EMERGENCY CONTACT NUMBER</label>
                        <input
                          type="text"
                          className="st-input"
                          value={centerForm.emergencyContact}
                          onChange={(e) => setCenterForm({ ...centerForm, emergencyContact: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="st-settings-grid-row">
                      <div className="st-form-group">
                        <label className="st-form-label">BRANCH EMAIL ADDRESS</label>
                        <input
                          type="email"
                          className="st-input"
                          value={centerForm.email}
                          onChange={(e) => setCenterForm({ ...centerForm, email: e.target.value })}
                        />
                      </div>
                      <div className="st-form-group">
                        <label className="st-form-label">TIME ZONE</label>
                        <select
                          className="sa-input"
                          value={centerForm.timezone}
                          onChange={(e) => setCenterForm({ ...centerForm, timezone: e.target.value })}
                        >
                          <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                          <option value="America/New_York (EST)">America/New_York (EST)</option>
                          <option value="GMT/UTC (UTC)">GMT/UTC (UTC)</option>
                        </select>
                      </div>
                    </div>

                    <div className="st-settings-grid-row">
                      <div className="st-form-group">
                        <label className="st-form-label">OPERATING HOURS</label>
                        <input
                          type="text"
                          className="st-input"
                          value={centerForm.operatingHours}
                          onChange={(e) => setCenterForm({ ...centerForm, operatingHours: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="st-form-group">
                      <label className="st-form-label">POSTAL ADDRESS</label>
                      <textarea
                        className="st-textarea"
                        rows={3}
                        value={centerForm.address}
                        onChange={(e) => setCenterForm({ ...centerForm, address: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="st-form-footer" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button className="st-btn st-btn--outline" onClick={handleDiscardCenter}>Discard</button>
                    <button className="st-btn st-btn--primary" onClick={handleSaveCenter}>Save Changes</button>
                  </div>
                </>
              )}

              {/* TAB 2: USER DIRECTORY */}
              {activeTab === 'users' && (
                <>
                  <div className="st-settings-section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h2 className="st-settings-section-title">User Accounts Directory</h2>
                      <p className="st-settings-section-desc">Create Patient or Para Healer profiles, audit status records, and handle active credentials.</p>
                    </div>
                    <button className="st-btn st-btn--primary" onClick={() => setShowAddUserModal(true)}>
                      <IonIcon icon={addOutline} /> Add User
                    </button>
                  </div>

                  {/* Filters */}
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', width: '100%' }}>
                    <div className="st-search-box" style={{ flex: 1, minWidth: '240px' }}>
                      <IonIcon icon={searchOutline} className="st-search-icon" />
                      <input
                        placeholder="Search by name, email, or contact..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="st-select-container">
                      <IonIcon icon={filterOutline} className="st-filter-icon" />
                      <select
                        className="st-select"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                      >
                        <option value="All">All Roles</option>
                        <option value="Para Healer">Para Healer</option>
                        <option value="Patient">Patient</option>
                      </select>
                    </div>
                  </div>

                  {/* Users Ledger Table */}
                  <div className="st-table-container">
                    <table className="st-table">
                      <thead>
                        <tr>
                          <th>USER</th>
                          <th>ROLE</th>
                          <th>CONTACT</th>
                          <th>LAST LOGIN</th>
                          <th>STATUS</th>
                          <th style={{ textAlign: 'right' }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((u) => {
                            const statusColor = u.status === 'Active' ? 'income' : 'expense';
                            return (
                              <tr key={u.id} className="st-table-row">
                                <td>
                                  <div className="st-table-user-cell">
                                    <div className="st-table-user-avatar">
                                      {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span className="st-table-user-name" style={{ color: u.isLocked ? '#94a3b8' : 'inherit', textDecoration: u.isLocked ? 'line-through' : 'none' }}>
                                        {u.name} {u.isLocked && '🔒'}
                                      </span>
                                      <span style={{ fontSize: '11px', color: '#64748b' }}>{u.email}</span>
                                    </div>
                                  </div>
                                </td>
                                <td>{u.role}</td>
                                <td>{u.contact}</td>
                                <td style={{ fontSize: '12px', color: '#64748b' }}>{u.lastLogin}</td>
                                <td>
                                  <span className={`rp-badge rp-badge--${statusColor}`}>
                                    {u.status}
                                  </span>
                                </td>
                                <td>
                                   <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                     <button 
                                       className="st-settings-action-btn" 
                                       title="Reset Password"
                                       onClick={() => handleResetUserPassword(u.name)}
                                     >
                                       <IonIcon icon={keyOutline} />
                                     </button>
                                     <button 
                                       className="st-settings-action-btn" 
                                       title="Resend Access Details"
                                       onClick={() => handleResendCredentials(u.name)}
                                     >
                                       <IonIcon icon={notificationsOutline} />
                                     </button>
                                     <button
                                       className={`st-settings-action-btn ${u.isLocked ? 'st-settings-action-btn--success' : 'st-settings-action-btn--danger'}`}
                                       title={u.isLocked ? 'Unlock Account' : 'Lock Account'}
                                       onClick={() => handleToggleUserLock(u.id)}
                                     >
                                       <IonIcon icon={u.isLocked ? lockOpenOutline : lockClosedOutline} />
                                     </button>
                                     <button
                                       className={`sa-btn ${u.status === 'Active' ? 'sa-btn--delete-light' : 'sa-btn--primary'}`}
                                       style={{ whiteSpace: 'nowrap', padding: '4px 10px', fontSize: '11px', height: '32px', borderRadius: '16px' }}
                                       onClick={() => handleToggleUserStatus(u.id)}
                                     >
                                       {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                                     </button>
                                   </div>
                                 </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="st-table-empty">
                              No matching directory profiles found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* TAB 3: SECURITY & SESSIONS */}
              {activeTab === 'security' && (
                <>
                  <div className="st-settings-section-header">
                    <h2 className="st-settings-section-title">Security & Audit Logs</h2>
                    <p className="st-settings-section-desc">Manage login keys, enable 2FA verification, view active sessions, and check audit records.</p>
                  </div>

                  {/* Change Password Form */}
                  <form onSubmit={handleSaveSecurity} className="sa-code-box" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px', borderRadius: '8px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>Change Administrator Password</div>
                    
                    <div className="st-form-group">
                      <label className="st-form-label">CURRENT PASSWORD</label>
                      <input
                        type="password"
                        className="st-input"
                        value={passwordForm.current}
                        onChange={(e) => setPasswordForm({ ...passwordForm, current: e.target.value })}
                        placeholder="••••••••"
                      />
                    </div>

                    <div className="st-settings-grid-row">
                      <div className="st-form-group">
                        <label className="st-form-label">NEW PASSWORD</label>
                        <input
                          type="password"
                          className="st-input"
                          value={passwordForm.new}
                          onChange={(e) => setPasswordForm({ ...passwordForm, new: e.target.value })}
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="st-form-group">
                        <label className="st-form-label">CONFIRM NEW PASSWORD</label>
                        <input
                          type="password"
                          className="st-input"
                          value={passwordForm.confirm}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirm: e.target.value })}
                          placeholder="••••••••"
                        />
                      </div>
                    </div>

                    <button type="submit" className="st-btn st-btn--primary" style={{ width: 'fit-content', marginTop: '8px' }}>Update Password</button>
                  </form>

                  {/* Two-Factor Authentication (2FA) */}
                  <div className="st-settings-toggle-row">
                    <div className="st-settings-toggle-info">
                      <span className="st-settings-toggle-label">Two-Factor Authentication (2FA)</span>
                      <span className="st-settings-toggle-desc">Require email or SMS OTP confirmation code alongside passwords during logins.</span>
                    </div>
                    <label className="st-toggle-switch">
                      <input
                        type="checkbox"
                        checked={twoFactor}
                        onChange={(e) => { setTwoFactor(e.target.checked); triggerToast(e.target.checked ? '2FA enforcement activated!' : '2FA deactivated.'); }}
                      />
                      <span className="st-toggle-slider"></span>
                    </label>
                  </div>

                  {/* Active Sessions */}
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Active Logged-In Sessions</div>
                    <div className="st-table-container">
                      <table className="st-table">
                        <thead>
                          <tr>
                            <th>DEVICE</th>
                            <th>IP ADDRESS</th>
                            <th>LOCATION</th>
                            <th>ACTIVE SINCE</th>
                            <th style={{ textAlign: 'right' }}>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sessions.map(s => (
                            <tr key={s.id}>
                              <td style={{ fontWeight: 600 }}>{s.device}</td>
                              <td>{s.ip}</td>
                              <td>{s.location}</td>
                              <td>{s.activeSince}</td>
                              <td style={{ textAlign: 'right' }}>
                                <button className="sa-btn sa-btn--sm sa-btn--delete-light" onClick={() => handleRevokeSession(s.id)}>Revoke</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Security Audit Log */}
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>Security Audit Log</div>
                    <div className="st-table-container">
                      <table className="st-table">
                        <thead>
                          <tr>
                            <th>TIMESTAMP</th>
                            <th>EVENT TYPE</th>
                            <th>USER ENTITY</th>
                            <th>STATUS</th>
                          </tr>
                        </thead>
                        <tbody>
                          {securityLogs.map(l => (
                            <tr key={l.id}>
                              <td style={{ fontSize: '12px', color: '#64748b' }}>{l.timestamp}</td>
                              <td style={{ fontWeight: 500 }}>{l.event}</td>
                              <td>{l.user}</td>
                              <td>
                                <span className={`rp-badge rp-badge--${l.status === 'Success' ? 'income' : 'expense'}`}>
                                  {l.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 4: NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <>
                  <div className="st-settings-section-header">
                    <h2 className="st-settings-section-title">Notification Channels & Timers</h2>
                    <p className="st-settings-section-desc">Manage SMS and Email alert rules, check reminders, and setup patient feedback triggers.</p>
                  </div>

                  <div className="st-settings-toggle-row">
                    <div className="st-settings-toggle-info">
                      <span className="st-settings-toggle-label">SMS Notification Deliveries</span>
                      <span className="st-settings-toggle-desc">Deliver instant text alerts to patient and healer mobile phones for appointments.</span>
                    </div>
                    <label className="st-toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationConfig.smsEnabled}
                        onChange={(e) => {
                          setNotificationConfig({ ...notificationConfig, smsEnabled: e.target.checked });
                          triggerToast(e.target.checked ? 'SMS communications enabled.' : 'SMS communications disabled.');
                        }}
                      />
                      <span className="st-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="st-settings-toggle-row">
                    <div className="st-settings-toggle-info">
                      <span className="st-settings-toggle-label">Email Notification Deliveries</span>
                      <span className="st-settings-toggle-desc">Dispatch detailed intake credentials and invoices via automated email routes.</span>
                    </div>
                    <label className="st-toggle-switch">
                      <input
                        type="checkbox"
                        checked={notificationConfig.emailEnabled}
                        onChange={(e) => {
                          setNotificationConfig({ ...notificationConfig, emailEnabled: e.target.checked });
                          triggerToast(e.target.checked ? 'Email communications enabled.' : 'Email communications disabled.');
                        }}
                      />
                      <span className="st-toggle-slider"></span>
                    </label>
                  </div>

                  <div className="st-settings-grid-row">
                    <div className="st-form-group">
                      <label className="st-form-label">SESSION REMINDER ALERTS</label>
                      <select
                        className="sa-input"
                        value={notificationConfig.sessionReminder}
                        onChange={(e) => {
                          setNotificationConfig({ ...notificationConfig, sessionReminder: e.target.value });
                          triggerToast('Session reminder timing threshold modified.');
                        }}
                      >
                        <option value="1_hour_before">1 Hour Before Booking</option>
                        <option value="12_hours_before">12 Hours Before Booking</option>
                        <option value="24_hours_before">24 Hours Before Booking (Default)</option>
                        <option value="48_hours_before">48 Hours Before Booking</option>
                      </select>
                    </div>

                    <div className="st-form-group">
                      <label className="st-form-label">FEEDBACK REQUEST ALERTS</label>
                      <select
                        className="sa-input"
                        value={notificationConfig.feedbackReminder}
                        onChange={(e) => {
                          setNotificationConfig({ ...notificationConfig, feedbackReminder: e.target.value });
                          triggerToast('Feedback timing dispatch updated.');
                        }}
                      >
                        <option value="immediate">Immediately After Session</option>
                        <option value="1_day_after">1 Day After Session (Default)</option>
                        <option value="3_days_after">3 Days After Session</option>
                        <option value="never">Do Not Request Feedback</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 5: DOCUMENT RULES */}
              {activeTab === 'documents' && (
                <>
                  <div className="st-settings-section-header">
                    <h2 className="st-settings-section-title">Document Workspace Guidelines</h2>
                    <p className="st-settings-section-desc">Enforce constraints on file uploads, restrict file extensions, and check retention schedules.</p>
                  </div>

                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>ALLOWED FILE FORMATS</div>
                    <div className="st-settings-checkbox-grid">
                      <label className="st-settings-checkbox-item">
                        <input
                          type="checkbox"
                          checked={documentConfig.pdf}
                          onChange={(e) => setDocumentConfig({ ...documentConfig, pdf: e.target.checked })}
                        />
                        <span className="st-settings-checkbox-label">PDF Documents (.pdf)</span>
                      </label>
                      <label className="st-settings-checkbox-item">
                        <input
                          type="checkbox"
                          checked={documentConfig.png}
                          onChange={(e) => setDocumentConfig({ ...documentConfig, png: e.target.checked })}
                        />
                        <span className="st-settings-checkbox-label">PNG Images (.png)</span>
                      </label>
                      <label className="st-settings-checkbox-item">
                        <input
                          type="checkbox"
                          checked={documentConfig.jpg}
                          onChange={(e) => setDocumentConfig({ ...documentConfig, jpg: e.target.checked })}
                        />
                        <span className="st-settings-checkbox-label">JPEG Images (.jpg, .jpeg)</span>
                      </label>
                      <label className="st-settings-checkbox-item">
                        <input
                          type="checkbox"
                          checked={documentConfig.doc}
                          onChange={(e) => setDocumentConfig({ ...documentConfig, doc: e.target.checked })}
                        />
                        <span className="st-settings-checkbox-label">Word Documents (.doc, .docx)</span>
                      </label>
                      <label className="st-settings-checkbox-item">
                        <input
                          type="checkbox"
                          checked={documentConfig.xlsx}
                          onChange={(e) => setDocumentConfig({ ...documentConfig, xlsx: e.target.checked })}
                        />
                        <span className="st-settings-checkbox-label">Excel Spreadsheets (.xlsx)</span>
                      </label>
                    </div>
                  </div>

                  <div className="st-settings-grid-row">
                    <div className="st-form-group">
                      <label className="st-form-label">MAXIMUM FILE UPLOAD LIMIT</label>
                      <select
                        className="sa-input"
                        value={documentConfig.maxSize}
                        onChange={(e) => {
                          setDocumentConfig({ ...documentConfig, maxSize: e.target.value });
                          triggerToast(`Maximum document size capped at ${e.target.value}.`);
                        }}
                      >
                        <option value="5MB">5 MB Max Limit</option>
                        <option value="10MB">10 MB Max Limit (Default)</option>
                        <option value="20MB">20 MB Max Limit</option>
                        <option value="50MB">50 MB Max Limit</option>
                      </select>
                    </div>

                    <div className="st-form-group">
                      <label className="st-form-label">DOCUMENT RETENTION POLICY</label>
                      <select
                        className="sa-input"
                        value={documentConfig.retention}
                        onChange={(e) => {
                          setDocumentConfig({ ...documentConfig, retention: e.target.value });
                          triggerToast('Medical record retention timelines adjusted.');
                        }}
                      >
                        <option value="1_year">Archive for 1 Year</option>
                        <option value="3_years">Archive for 3 Years</option>
                        <option value="5_years">Archive for 5 Years (Default)</option>
                        <option value="indefinite">Keep Records Indefinitely</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 6: ATTENDANCE RULES */}
              {activeTab === 'attendance' && (
                <>
                  <div className="st-settings-section-header">
                    <h2 className="st-settings-section-title">Attendance Verification Rules</h2>
                    <p className="st-settings-section-desc">Manage standard check-in schedules, grace timings, and rules for healers and staff.</p>
                  </div>

                  <div className="st-settings-grid-row">
                    <div className="st-form-group">
                      <label className="st-form-label">DEFAULT CHECK-IN TIMING</label>
                      <input
                        type="time"
                        className="st-input"
                        value={attendanceConfig.checkInTime}
                        onChange={(e) => setAttendanceConfig({ ...attendanceConfig, checkInTime: e.target.value })}
                      />
                    </div>

                    <div className="st-form-group">
                      <label className="st-form-label">DEFAULT CHECK-OUT TIMING</label>
                      <input
                        type="time"
                        className="st-input"
                        value={attendanceConfig.checkOutTime}
                        onChange={(e) => setAttendanceConfig({ ...attendanceConfig, checkOutTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="st-settings-grid-row">
                    <div className="st-form-group">
                      <label className="st-form-label">LATE ENTRY GRACE THRESHOLD</label>
                      <select
                        className="sa-input"
                        value={attendanceConfig.gracePeriod}
                        onChange={(e) => setAttendanceConfig({ ...attendanceConfig, gracePeriod: e.target.value })}
                      >
                        <option value="5_mins">5 Minutes Grace Period</option>
                        <option value="10_mins">10 Minutes Grace Period</option>
                        <option value="15_mins">15 Minutes Grace Period (Default)</option>
                        <option value="30_mins">30 Minutes Grace Period</option>
                      </select>
                    </div>

                    <div className="st-form-group">
                      <label className="st-form-label">HALF-DAY ATTENDANCE CUTOFF</label>
                      <input
                        type="time"
                        className="st-input"
                        value={attendanceConfig.halfDayThreshold}
                        onChange={(e) => setAttendanceConfig({ ...attendanceConfig, halfDayThreshold: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div className="sa-code-box" style={{ padding: '12px', borderRadius: '8px', fontSize: '13px', lineHeight: 1.5 }}>
                    <strong>Attendance Policy Rules:</strong> Committing attendance logs automatically locks check-in coordinates. Late arrivals exceeding grace timings are flagged in warnings status, and check-ins past the Half-Day cutoff register as Half Day.
                  </div>
                </>
              )}

              {/* TAB 7: SESSION TIMINGS */}
              {activeTab === 'sessions' && (
                <>
                  <div className="st-settings-section-header">
                    <h2 className="st-settings-section-title">Session Configuration Defaults</h2>
                    <p className="st-settings-section-desc">Configure booking length scales, patient reminders, and post-session tracking settings.</p>
                  </div>

                  <div className="st-settings-grid-row">
                    <div className="st-form-group">
                      <label className="st-form-label">DEFAULT SESSION DURATION</label>
                      <select
                        className="sa-input"
                        value={sessionConfig.defaultDuration}
                        onChange={(e) => setSessionConfig({ ...sessionConfig, defaultDuration: e.target.value })}
                      >
                        <option value="30_mins">30 Minutes Duration</option>
                        <option value="45_mins">45 Minutes Duration</option>
                        <option value="60_mins">60 Minutes Duration (Default)</option>
                        <option value="90_mins">90 Minutes Duration</option>
                      </select>
                    </div>

                    <div className="st-form-group">
                      <label className="st-form-label">APPOINTMENT REMINDER TIMING</label>
                      <select
                        className="sa-input"
                        value={sessionConfig.reminderTiming}
                        onChange={(e) => setSessionConfig({ ...sessionConfig, reminderTiming: e.target.value })}
                      >
                        <option value="1_hour_before">1 Hour Before Session</option>
                        <option value="2_hours_before">2 Hours Before Session</option>
                        <option value="24_hours_before">24 Hours Before Session (Default)</option>
                      </select>
                    </div>
                  </div>

                  <div className="st-settings-toggle-row">
                    <div className="st-settings-toggle-info">
                      <span className="st-settings-toggle-label">Automatic Follow-up Alerts</span>
                      <span className="st-settings-toggle-desc">Trigger follow-up notifications and self-healing schedules 3 days after session completions.</span>
                    </div>
                    <label className="st-toggle-switch">
                      <input
                        type="checkbox"
                        checked={sessionConfig.autoFollowUpAlert}
                        onChange={(e) => {
                          setSessionConfig({ ...sessionConfig, autoFollowUpAlert: e.target.checked });
                          triggerToast(e.target.checked ? 'Follow-up alerts enabled.' : 'Follow-up alerts disabled.');
                        }}
                      />
                      <span className="st-toggle-slider"></span>
                    </label>
                  </div>
                </>
              )}

              {/* TAB 8: FINANCE & INVOICING */}
              {activeTab === 'finance' && (
                <>
                  <div className="st-settings-section-header">
                    <h2 className="st-settings-section-title">Finance & Invoicing Setup</h2>
                    <p className="st-settings-section-desc">Confirm valid cash payment channels and configure sequential document formatting templates.</p>
                  </div>

                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>APPROVED PAYMENT METHODS</div>
                    <div className="st-settings-checkbox-grid">
                      <label className="st-settings-checkbox-item">
                        <input
                          type="checkbox"
                          checked={financeConfig.cash}
                          onChange={(e) => setFinanceConfig({ ...financeConfig, cash: e.target.checked })}
                        />
                        <span className="st-settings-checkbox-label">Cash Ledger Entries</span>
                      </label>
                      <label className="st-settings-checkbox-item">
                        <input
                          type="checkbox"
                          checked={financeConfig.upi}
                          onChange={(e) => setFinanceConfig({ ...financeConfig, upi: e.target.checked })}
                        />
                        <span className="st-settings-checkbox-label">UPI Transfer (GPay, PhonePe)</span>
                      </label>
                      <label className="st-settings-checkbox-item">
                        <input
                          type="checkbox"
                          checked={financeConfig.bankTransfer}
                          onChange={(e) => setFinanceConfig({ ...financeConfig, bankTransfer: e.target.checked })}
                        />
                        <span className="st-settings-checkbox-label">Direct Bank Transfers (IMPS, NEFT)</span>
                      </label>
                    </div>
                  </div>

                  <div className="st-settings-grid-row">
                    <div className="st-form-group">
                      <label className="st-form-label">RECEIPT NUMBER FORMAT</label>
                      <input
                        type="text"
                        className="st-input"
                        value={financeConfig.receiptFormat}
                        onChange={(e) => setFinanceConfig({ ...financeConfig, receiptFormat: e.target.value })}
                        placeholder="TXN-YYYY-XXXX"
                      />
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Variables supported: `YYYY` (Year), `XXXX` (Sequential Serial)</span>
                    </div>

                    <div className="st-form-group">
                      <label className="st-form-label">INVOICE NUMBER FORMAT</label>
                      <input
                        type="text"
                        className="st-input"
                        value={financeConfig.invoiceFormat}
                        onChange={(e) => setFinanceConfig({ ...financeConfig, invoiceFormat: e.target.value })}
                        placeholder="INV-YYYY-XXXX"
                      />
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Variables supported: `YYYY` (Year), `XXXX` (Sequential Serial)</span>
                    </div>
                  </div>
                </>
              )}

              {/* TAB 9: REPORTS PREFERENCES */}
              {activeTab === 'reports' && (
                <>
                  <div className="st-settings-section-header">
                    <h2 className="st-settings-section-title">Reports & Export Formats</h2>
                    <p className="st-settings-section-desc">Manage standard analytics parameters, pre-selected ranges, and printed sheet layouts.</p>
                  </div>

                  <div className="st-form-group">
                    <label className="st-form-label">DEFAULT REPORTS VIEW RANGE</label>
                    <select
                      className="sa-input"
                      value={reportsConfig.defaultRange}
                      onChange={(e) => setReportsConfig({ ...reportsConfig, defaultRange: e.target.value })}
                    >
                      <option value="today">Today's Transactions</option>
                      <option value="this_week">This Week (Last 7 Days)</option>
                      <option value="this_month">This Month (Last 30 Days) (Default)</option>
                      <option value="this_quarter">This Fiscal Quarter</option>
                    </select>
                  </div>

                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>ALLOWED DOWNLOAD DOCUMENT TYPES</div>
                    <div className="st-settings-checkbox-grid">
                      <label className="st-settings-checkbox-item">
                        <input
                          type="checkbox"
                          checked={reportsConfig.exportPdf}
                          onChange={(e) => setReportsConfig({ ...reportsConfig, exportPdf: e.target.checked })}
                        />
                        <span className="st-settings-checkbox-label">PDF Sheets (Portable Document)</span>
                      </label>
                      <label className="st-settings-checkbox-item">
                        <input
                          type="checkbox"
                          checked={reportsConfig.exportExcel}
                          onChange={(e) => setReportsConfig({ ...reportsConfig, exportExcel: e.target.checked })}
                        />
                        <span className="st-settings-checkbox-label">Excel Compilation (.xlsx)</span>
                      </label>
                    </div>
                  </div>

                  <div className="st-form-group" style={{ marginTop: '10px' }}>
                    <label className="st-form-label">PDF STATEMENT HEADER CUSTOMIZATION</label>
                    <input
                      type="text"
                      className="st-input"
                      value={reportsConfig.pdfHeader}
                      onChange={(e) => setReportsConfig({ ...reportsConfig, pdfHeader: e.target.value })}
                    />
                  </div>

                  <div className="st-form-group">
                    <label className="st-form-label">PDF STATEMENT FOOTER DISCLAIMER</label>
                    <input
                      type="text"
                      className="st-input"
                      value={reportsConfig.pdfFooter}
                      onChange={(e) => setReportsConfig({ ...reportsConfig, pdfFooter: e.target.value })}
                    />
                  </div>
                </>
              )}

              {/* TAB 10: UTILITIES */}
              {activeTab === 'utilities' && (
                <>
                  <div className="st-settings-section-header">
                    <h2 className="st-settings-section-title">System Utilities & Backup Control</h2>
                    <p className="st-settings-section-desc">Audit real-time metrics, perform secure backups, and browse user guides.</p>
                  </div>

                  {/* System Health Indicators */}
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '12px' }}>REAL-TIME SYSTEM HEALTH</div>
                    <div className="st-settings-stat-grid">
                      <div className="st-settings-stat-box">
                        <span className="st-settings-stat-label">Database Server</span>
                        <span className="st-settings-stat-value" style={{ color: '#10b981' }}>ONLINE (0.4ms)</span>
                      </div>
                      <div className="st-settings-stat-box">
                        <span className="st-settings-stat-label">Cloud Backup Storage</span>
                        <span className="st-settings-stat-value" style={{ color: '#10b981' }}>HEALTHY (42% Full)</span>
                      </div>
                      <div className="st-settings-stat-box">
                        <span className="st-settings-stat-label">SMS / Email API Gateways</span>
                        <span className="st-settings-stat-value" style={{ color: '#10b981' }}>CONNECTED</span>
                      </div>
                    </div>
                  </div>

                  {/* Backup Status */}
                  <div className="sa-code-box" style={{ padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, marginBottom: '4px' }}>Compile Database Snapshot</div>
                      <div style={{ fontSize: '13px', color: '#64748b' }}>Last compilation saved on: <strong>{backupStatus}</strong></div>
                    </div>
                    <button 
                      className="st-btn st-btn--primary" 
                      disabled={isBackingUp}
                      onClick={handleBackupNow}
                    >
                      <IonIcon icon={cloudUploadOutline} /> {isBackingUp ? 'Archiving Database...' : 'Backup Now'}
                    </button>
                  </div>

                  {/* Documentation & Manuals */}
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#334155', marginBottom: '10px' }}>HELP & OPERATIONAL DOCUMENTATION</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button className="st-footer-link" style={{ textAlign: 'left', width: 'fit-content', padding: '6px 0' }} onClick={() => alert('Accessing PHMS System Administrator Guide v2.4')}>📘 Read Branch Admin Systems Operations Guide</button>
                      <button className="st-footer-link" style={{ textAlign: 'left', width: 'fit-content', padding: '6px 0' }} onClick={() => alert('Accessing Patient Privacy and HIPAA Data Rules')}>🔒 Review Patient Privacy and Electronic Medical Records Guideline</button>
                    </div>
                  </div>

                  {/* Version Information */}
                  <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                    <span>Software License: <strong>Proprietary Enterprise</strong></span>
                    <span>System Version: <strong>v2.4.1-stable</strong></span>
                  </div>
                </>
              )}

            </div>
          </div>

          {/* Branding Copyrights Footer */}
          <div className="st-footer" style={{ marginTop: '32px' }}>
            <span className="st-footer-copyright">
              © 2024 Pranic Healing Management System (PHMS). All rights reserved.
            </span>
          </div>

        </div>
      </IonContent>

      {/* Add User Modal */}
      <IonModal isOpen={showAddUserModal} onDidDismiss={handleCloseSuccessSummary} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          {!showSuccessSummary ? (
            <>
              <div className="sa-modal__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Add User to Directory</h2>
                <button className="sa-modal__close-btn" style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }} onClick={() => setShowAddUserModal(false)}>×</button>
              </div>
              <div className="sa-modal__body">
                <div className="sa-settings__form-group" style={{ marginBottom: '16px' }}>
                  <label className="sa-settings__label" style={{ fontWeight: 600, fontSize: '12px', display: 'block', marginBottom: '6px' }}>Full Name</label>
                  <input
                    type="text"
                    className="sa-input"
                    placeholder="Patient or Healer Full Name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group" style={{ marginBottom: '16px' }}>
                  <label className="sa-settings__label" style={{ fontWeight: 600, fontSize: '12px', display: 'block', marginBottom: '6px' }}>User Role</label>
                  <select
                    className="sa-input"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  >
                    <option value="Para Healer">Para Healer</option>
                    <option value="Patient">Patient</option>
                  </select>
                </div>

                <div className="sa-settings__form-group" style={{ marginBottom: '16px' }}>
                  <label className="sa-settings__label" style={{ fontWeight: 600, fontSize: '12px', display: 'block', marginBottom: '6px' }}>Contact Number</label>
                  <input
                    type="text"
                    className="sa-input"
                    placeholder="Mobile number e.g. 9876543210"
                    value={newUser.contact}
                    onChange={(e) => setNewUser({ ...newUser, contact: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group" style={{ marginBottom: '16px' }}>
                  <label className="sa-settings__label" style={{ fontWeight: 600, fontSize: '12px', display: 'block', marginBottom: '6px' }}>Email Address</label>
                  <input
                    type="email"
                    className="sa-input"
                    placeholder="Email address e.g. ravi@example.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>

                {/* Secure Credential Generation & Delivery Checkboxes */}
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="checkbox"
                      id="autoGen"
                      checked={newUser.autoGen}
                      onChange={(e) => setNewUser({ ...newUser, autoGen: e.target.checked })}
                    />
                    <label htmlFor="autoGen" style={{ fontSize: '12px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>Auto-generate secure password</label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="checkbox"
                      id="sendSMS"
                      checked={newUser.sendSMS}
                      onChange={(e) => setNewUser({ ...newUser, sendSMS: e.target.checked })}
                    />
                    <label htmlFor="sendSMS" style={{ fontSize: '12px', color: '#475569', cursor: 'pointer' }}>Send login credentials via SMS</label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="checkbox"
                      id="sendEmail"
                      checked={newUser.sendEmail}
                      onChange={(e) => setNewUser({ ...newUser, sendEmail: e.target.checked })}
                    />
                    <label htmlFor="sendEmail" style={{ fontSize: '12px', color: '#475569', cursor: 'pointer' }}>Send login credentials via Email</label>
                  </div>
                </div>
              </div>
              <div className="sa-modal__footer" style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button className="sa-btn sa-btn--outline" onClick={() => setShowAddUserModal(false)}>
                  Cancel
                </button>
                <button className="sa-btn sa-btn--primary" onClick={handleAddUserSubmit}>
                  Add User
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="sa-modal__header">
                <h2 style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IonIcon icon={checkmarkCircleOutline} /> Credentials Generated!
                </h2>
              </div>
              <div className="sa-modal__body" style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', lineHeight: 1.5 }}>
                  The user account for <strong>{generatedCreds.name}</strong> ({generatedCreds.role}) has been successfully created.
                </p>

                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '16px', textAlign: 'left', fontFamily: 'monospace', fontSize: '12px' }}>
                  <div style={{ marginBottom: '6px' }}><strong>Username:</strong> {generatedCreds.username}</div>
                  <div style={{ marginBottom: '6px' }}><strong>Temporary Password:</strong> {generatedCreds.password}</div>
                  <div style={{ borderTop: '1px solid #e2e8f0', marginTop: '10px', paddingTop: '8px', color: '#047857', fontWeight: 600 }}>
                    {newUser.sendSMS && <div>📱 Delivered via SMS to {generatedCreds.contact}</div>}
                    {newUser.sendEmail && <div>✉️ Delivered via Email to {generatedCreds.email}</div>}
                  </div>
                </div>

                <p style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic' }}>
                  Please share these temporary credentials with the user. They will be prompted to change their password on first login.
                </p>
              </div>
              <div className="sa-modal__footer" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button className="sa-btn sa-btn--primary" style={{ width: '100%' }} onClick={handleCloseSuccessSummary}>
                  Done
                </button>
              </div>
            </>
          )}
        </div>
      </IonModal>
    </IonPage>
  );
};

export default SettingsPage;
