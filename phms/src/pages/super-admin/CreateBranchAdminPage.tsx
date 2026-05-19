import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonBackButton,
  IonIcon,
} from '@ionic/react';
import {
  saveOutline,
  closeOutline,
  homeOutline,
  personOutline,
  lockClosedOutline,
  mailOutline,
  callOutline,
  calendarOutline,
  maleFemaleOutline,
  locationOutline,
  documentAttachOutline,
  eyeOutline,
  eyeOffOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import './super-admin.css';

const CreateBranchAdminPage: React.FC = () => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    adminName: '',
    username: '',
    password: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Male',
    addressLine1: '',
    addressLine2: '',
    city: '',
    district: '',
    state: '',
    pincode: '',
    idProof: null as any,
    assignedBranch: '',
  });

  const [availableBranches, setAvailableBranches] = useState<any[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const savedBranches = localStorage.getItem('ph_branches');
    if (savedBranches) {
      const branches = JSON.parse(savedBranches);
      setAvailableBranches(branches);
    } else {
      // Fallback if localStorage is empty
      const defaultBranches = [
        { name: 'Uptown Sanctuary' },
        { name: 'Coastal Healing Center' },
        { name: 'Green Valley Branch' },
        { name: 'Downtown Sanctuary' }
      ];
      setAvailableBranches(defaultBranches);
    }
  }, []);

  const handleAssign = () => {
    // Update the admin name for the assigned branch in localStorage
    const savedBranches = localStorage.getItem('ph_branches');
    if (savedBranches && formData.assignedBranch && formData.adminName) {
      const branches = JSON.parse(savedBranches);
      const updatedBranches = branches.map((branch: any) =>
        branch.name === formData.assignedBranch
          ? { ...branch, admin: formData.adminName }
          : branch
      );
      localStorage.setItem('ph_branches', JSON.stringify(updatedBranches));
    }

    // Save the new admin to the ph_admins list
    const savedAdmins = localStorage.getItem('ph_admins');
    const admins = savedAdmins ? JSON.parse(savedAdmins) : [];
    const newAdmin = {
      id: Date.now(),
      name: formData.adminName,
      email: formData.email,
      phone: formData.phone || 'Not Set',
      branch: formData.assignedBranch,
      status: 'active',
      joined: new Date().toISOString().split('T')[0],
    };
    localStorage.setItem('ph_admins', JSON.stringify([...admins, newAdmin]));

    console.log('Creating Branch Admin:', formData);
    // Navigate to Staff Management page so the new admin is visible
    history.push(ROUTES.SUPER_ADMIN.BRANCH_ADMINS);
  };

  const handleCancel = () => {
    history.push(ROUTES.SUPER_ADMIN.DASHBOARD);
  };

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref={ROUTES.SUPER_ADMIN.DASHBOARD} text="" />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Create Branch Admin</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          <div className="sa-page__header">
            <h1 className="sa-page__title">Create Branch Admin</h1>
            <p className="sa-page__subtitle">Create a new admin account and assign them to a branch.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleAssign(); }} className="sa-form-layout">
            <div className="sa-section">
              <div className="sa-section__header">
                <div>
                  <h2 className="sa-section__title">Admin Details</h2>
                  <p className="sa-section__subtitle">Personal and account information</p>
                </div>
              </div>

              <div className="sa-settings__form-grid">
                <div className="sa-settings__form-group">
                  <label className="sa-settings__label sa-label--required">
                    <IonIcon icon={personOutline} style={{ marginRight: '8px' }} />
                    Admin Name
                  </label>
                  <input
                    className="sa-settings__input"
                    placeholder="Full name"
                    value={formData.adminName}
                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                    required
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label sa-label--required">
                    <IonIcon icon={personOutline} style={{ marginRight: '8px' }} />
                    Username
                  </label>
                  <input
                    className="sa-settings__input"
                    placeholder="Login name"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                    autoComplete="off"
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label sa-label--required">
                    <IonIcon icon={lockClosedOutline} style={{ marginRight: '8px' }} />
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="sa-settings__input"
                      placeholder="Secure password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      autoComplete="new-password"
                      style={{ paddingRight: '40px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--color-text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: 0
                      }}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} style={{ fontSize: '20px' }} />
                    </button>
                  </div>
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label sa-label--required">
                    <IonIcon icon={mailOutline} style={{ marginRight: '8px' }} />
                    Email ID
                  </label>
                  <input
                    type="email"
                    className="sa-settings__input"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label sa-label--required">
                    <IonIcon icon={callOutline} style={{ marginRight: '8px' }} />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="sa-settings__input"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label sa-label--required">
                    <IonIcon icon={calendarOutline} style={{ marginRight: '8px' }} />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="sa-settings__input"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    required
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label sa-label--required">
                    <IonIcon icon={maleFemaleOutline} style={{ marginRight: '8px' }} />
                    Gender
                  </label>
                  <select
                    className="sa-settings__input"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label sa-label--required">
                    <IonIcon icon={homeOutline} style={{ marginRight: '8px' }} />
                    Assigned Branch
                  </label>
                  <select
                    className="sa-settings__input"
                    value={formData.assignedBranch}
                    onChange={(e) => setFormData({ ...formData, assignedBranch: e.target.value })}
                    required
                  >
                    <option value="">Select a Branch</option>
                    {availableBranches.map((branch, idx) => (
                      <option key={idx} value={branch.name}>{branch.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label sa-label--required">
                    <IonIcon icon={locationOutline} style={{ marginRight: '8px' }} />
                    Address Line 1
                  </label>
                  <input
                    className="sa-settings__input"
                    placeholder="Building / Street name"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    required
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label sa-label--required">
                    <IonIcon icon={locationOutline} style={{ marginRight: '8px' }} />
                    Address Line 2
                  </label>
                  <input
                    className="sa-settings__input"
                    placeholder="Area / Landmark"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                    required
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label sa-label--required">City</label>
                  <input
                    className="sa-settings__input"
                    placeholder="City name"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  />
                </div>
                <div className="sa-settings__form-group">
                  <label className="sa-settings__label sa-label--required">District</label>
                  <input
                    className="sa-settings__input"
                    placeholder="District name"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    required
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label sa-label--required">State</label>
                  <input
                    className="sa-settings__input"
                    placeholder="State name"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    required
                  />
                </div>
                <div className="sa-settings__form-group">
                  <label className="sa-settings__label sa-label--required">Pincode</label>
                  <input
                    className="sa-settings__input"
                    placeholder="Postal code"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    required
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label sa-label--required">
                    <IonIcon icon={documentAttachOutline} style={{ marginRight: '8px' }} />
                    Upload ID Proof (Aadhaar / PAN)
                  </label>
                  <input
                    type="file"
                    className="sa-settings__input"
                    style={{ padding: '10px', width: '100%' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFormData({ ...formData, idProof: e.target.files[0] });
                      }
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px' }}>
              <button type="button" className="sa-btn sa-btn--outline" onClick={handleCancel}>
                <IonIcon icon={closeOutline} /> Cancel
              </button>
              <button type="submit" className="sa-btn sa-btn--primary">
                <IonIcon icon={saveOutline} /> Create Admin
              </button>
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CreateBranchAdminPage;
