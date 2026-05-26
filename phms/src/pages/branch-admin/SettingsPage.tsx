import React, { useState, useEffect } from 'react';
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
  lockClosedOutline,
  alertCircleOutline,
  addOutline,
  filterOutline,
  chevronForwardOutline,
  chevronBackOutline,
  cameraOutline,
  createOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../../store/auth.store';
import './branch-admin.css';

interface BranchUser {
  id: number;
  name: string;
  role: 'Para Healer' | 'Patient' | 'Worker/Staff';
  contact: string;
  lastLogin: string;
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
  const defaultContact = isSalem ? '+91 XXXXX XXXX' : (isMumbai ? '+91 YYYYY YYYY' : '+91 ZZZZZ ZZZZ');
  const defaultHours = '9 AM - 6 PM';
  const defaultAddress = isSalem 
    ? '12/B Heritage Plaza, Omalur Main Road, Salem, Tamil Nadu, 636004' 
    : (isMumbai ? '404 Corporate Park, Omalur Main Road, Mumbai, Maharashtra, 400001' : '123 Spiritual Pathway, Healing Center');

  // Branch Profile Forms State (Save & Discard capabilities)
  const [branchForm, setBranchForm] = useState({
    name: defaultBranchName,
    contact: defaultContact,
    hours: defaultHours,
    email: defaultEmail,
    address: defaultAddress,
  });

  const [savedForm, setSavedForm] = useState({ ...branchForm });
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showDiscardToast, setShowDiscardToast] = useState(false);

  // Active Directory Users State (Search & Filters & Mock Addition)
  const [users, setUsers] = useState<BranchUser[]>([
    { id: 1, name: 'Ravi Kumar', role: 'Para Healer', contact: '9876543210', lastLogin: '10 mins ago' },
    { id: 2, name: 'Priya Sharma', role: 'Patient', contact: '9911223344', lastLogin: '2 days ago' },
    { id: 3, name: 'Kumar Swamy', role: 'Worker/Staff', contact: '9876543211', lastLogin: '3 weeks ago' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Add User Modal State
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    role: 'Para Healer' as 'Para Healer' | 'Patient' | 'Worker/Staff',
    contact: '',
  });

  // Action: Save Branch Changes
  const handleSaveBranch = () => {
    setSavedForm({ ...branchForm });
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  // Action: Discard changes (restores to saved state)
  const handleDiscardBranch = () => {
    setBranchForm({ ...savedForm });
    setShowDiscardToast(true);
    setTimeout(() => setShowDiscardToast(false), 3000);
  };

  // Action: Add new user to Directory
  const handleAddUserSubmit = () => {
    if (!newUser.name || !newUser.contact) {
      alert('Please fill out all fields.');
      return;
    }

    const added: BranchUser = {
      id: Date.now(),
      name: newUser.name,
      role: newUser.role,
      contact: newUser.contact,
      lastLogin: 'Just registered',
    };

    setUsers([added, ...users]);
    setNewUser({ name: '', role: 'Para Healer', contact: '' });
    setShowAddUserModal(false);
  };

  // Filtering Directory Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.contact.includes(searchQuery);

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalUsersCount = 9 + users.length; // Fake total directory size
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter]);

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Branch Settings Workspace</IonTitle>
          <div className="st-header-search">
            <IonIcon icon={searchOutline} className="st-search-bar-icon" />
            <input
              type="text"
              placeholder="Global search..."
              className="st-search-bar-input"
            />
          </div>
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
          {/* Header Row */}
          <div className="st-header-row">
            <div>
              <h1 className="st-page-title">Branch Settings</h1>
              <p className="st-page-subtitle">
                Manage official center profiles, control branch user accounts, configure operating hours, and maintain role-based system security.
              </p>
            </div>
          </div>

          {/* Toast Notification Mocks */}
          {showSaveToast && (
            <div className="st-toast-notification st-toast-notification--success">
              <IonIcon icon={checkmarkCircleOutline} className="toast-icon" />
              <span>Branch settings saved successfully!</span>
            </div>
          )}
          {showDiscardToast && (
            <div className="st-toast-notification st-toast-notification--warning">
              <IonIcon icon={alertCircleOutline} className="toast-icon" />
              <span>Changes discarded. Restored original center profile.</span>
            </div>
          )}

          {/* Two Columns Grid */}
          <div className="st-layout-grid">
            
            {/* COLUMN 1: Branch Information (Card - 45% width) */}
            <div className="st-panel">
              <div className="st-panel__header">
                <h2 className="st-panel__title">Branch Information</h2>
                <span className="st-panel-badge st-panel-badge--green">Active Branch</span>
              </div>

              {/* Salem PH Logo Box */}
              <div className="st-logo-frame">
                <div className="st-logo-box">
                  <div className="st-logo-circle">
                    <svg className="st-logo-svg" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="16" fill="rgba(255,255,255,0.08)" stroke="white" strokeWidth="1" />
                      <line x1="20" y1="10" x2="20" y2="30" stroke="white" strokeWidth="1" />
                      <line x1="10" y1="20" x2="30" y2="20" stroke="white" strokeWidth="1" />
                      <circle cx="20" cy="20" r="4" fill="white" />
                    </svg>
                  </div>
                  <button className="st-logo-edit-btn" title="Edit Logo">
                    <IonIcon icon={createOutline} />
                  </button>
                </div>
                <span className="st-logo-desc">{branchForm.name} Official Logo</span>
              </div>

              {/* Form Input fields */}
              <div className="st-form">
                <div className="st-form-group">
                  <label className="st-form-label">BRANCH NAME</label>
                  <input
                    type="text"
                    className="st-input"
                    value={branchForm.name}
                    onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                  />
                </div>

                <div className="st-form-row">
                  <div className="st-form-group">
                    <label className="st-form-label">CONTACT NUMBER</label>
                    <input
                      type="text"
                      className="st-input"
                      value={branchForm.contact}
                      onChange={(e) => setBranchForm({ ...branchForm, contact: e.target.value })}
                    />
                  </div>

                  <div className="st-form-group">
                    <label className="st-form-label">OPERATING HOURS</label>
                    <input
                      type="text"
                      className="st-input"
                      value={branchForm.hours}
                      onChange={(e) => setBranchForm({ ...branchForm, hours: e.target.value })}
                    />
                  </div>
                </div>

                <div className="st-form-group">
                  <label className="st-form-label">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    className="st-input"
                    value={branchForm.email}
                    onChange={(e) => setBranchForm({ ...branchForm, email: e.target.value })}
                  />
                </div>

                <div className="st-form-group">
                  <label className="st-form-label">ADDRESS</label>
                  <textarea
                    className="st-textarea"
                    rows={3}
                    value={branchForm.address}
                    onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                  />
                </div>
              </div>

              {/* Warnings restriction card banner */}
              <div className="st-warning-card">
                <div className="st-warning-icon">
                  <IonIcon icon={alertCircleOutline} />
                </div>
                <div className="st-warning-details">
                  <strong>Restrictions:</strong> Branch Admins cannot delete this branch, create new branches, or edit other branch profiles.
                </div>
              </div>

              {/* Footer Save & Discard Buttons */}
              <div className="st-form-footer">
                <button className="st-btn st-btn--primary" onClick={handleSaveBranch}>
                  Save Changes
                </button>
                <button className="st-btn st-btn--outline" onClick={handleDiscardBranch}>
                  Discard
                </button>
              </div>
            </div>

            {/* COLUMN 2: User Access Directory (Card - 55% width) */}
            <div className="st-panel">
              <div className="st-panel__header">
                <h2 className="st-panel__title">User Access Directory</h2>
                <button className="st-btn st-btn--primary" onClick={() => setShowAddUserModal(true)}>
                  <IonIcon icon={addOutline} className="btn-plus-icon" /> Add User
                </button>
              </div>

              {/* User Directory Filters */}
              <div className="st-directory-filters">
                <div className="st-search-box">
                  <IonIcon icon={searchOutline} className="st-search-icon" />
                  <input
                    placeholder="Search users by name..."
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
                    <option value="Worker/Staff">Worker/Staff</option>
                  </select>
                </div>
              </div>

              {/* User Access Ledger Table */}
              <div className="st-table-container">
                <table className="st-table">
                  <thead>
                    <tr>
                      <th>USER NAME</th>
                      <th>ROLE</th>
                      <th>CONTACT</th>
                      <th>LAST LOGIN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.length > 0 ? (
                      paginatedUsers.map((u) => (
                        <tr key={u.id} className="st-table-row">
                          <td>
                            <div className="st-table-user-cell">
                              <div className="st-table-user-avatar">
                                {u.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <span className="st-table-user-name">{u.name}</span>
                            </div>
                          </td>
                          <td>{u.role}</td>
                          <td>{u.contact}</td>
                          <td className="st-table-last-login">{u.lastLogin}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="st-table-empty">
                          No branch workers match your filter choices.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination indicators */}
              <div className="st-pagination">
                <span className="st-pagination-info">
                  Showing {paginatedUsers.length} of {totalUsersCount} branch users
                </span>
                {totalPages > 1 && (
                  <div className="st-pagination-controls">
                    <button
                      className="st-page-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                    >
                      <IonIcon icon={chevronBackOutline} />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        className={`st-page-btn ${currentPage === i + 1 ? 'st-page-btn--active' : ''}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      className="st-page-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                    >
                      <IonIcon icon={chevronForwardOutline} />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Branding Copyrights Footer */}
          <div className="st-footer">
            <span className="st-footer-copyright">
              © 2024 Pranic Healing Management System (PHMS). All rights reserved.
            </span>
            <div className="st-footer-links">
              <button className="st-footer-link">System Health</button>
              <button className="st-footer-link">Security Audit Log</button>
              <button className="st-footer-link">Help & Documentation</button>
            </div>
          </div>

        </div>
      </IonContent>

      {/* Add User Modal */}
      <IonModal isOpen={showAddUserModal} onDidDismiss={() => setShowAddUserModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Add User to Directory</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowAddUserModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Full Name</label>
              <input
                type="text"
                className="sa-input"
                placeholder="Worker or Patient Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>

            <div className="sa-settings__form-group">
              <label className="sa-settings__label">User Role</label>
              <select
                className="sa-input"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
              >
                <option value="Para Healer">Para Healer</option>
                <option value="Patient">Patient</option>
                <option value="Worker/Staff">Worker/Staff</option>
              </select>
            </div>

            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Contact Number</label>
              <input
                type="text"
                className="sa-input"
                placeholder="Mobile number e.g. 9876543210"
                value={newUser.contact}
                onChange={(e) => setNewUser({ ...newUser, contact: e.target.value })}
              />
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowAddUserModal(false)}>
              Cancel
            </button>
            <button className="sa-btn sa-btn--primary" onClick={handleAddUserSubmit}>
              Add User
            </button>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
};

export default SettingsPage;
