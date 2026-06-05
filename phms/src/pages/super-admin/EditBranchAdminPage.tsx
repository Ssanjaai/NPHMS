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
import { useHistory, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import './super-admin.css';

const EditBranchAdminPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
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
    // Load branches
    const savedBranches = localStorage.getItem('ph_branches');
    if (savedBranches) {
      setAvailableBranches(JSON.parse(savedBranches));
    }

    // Load admin data to edit
    const savedAdmins = localStorage.getItem('ph_admins');
    if (savedAdmins && id) {
      const admins = JSON.parse(savedAdmins);
      const adminToEdit = admins.find((a: any) => a.id.toString() === id);
      if (adminToEdit) {
        setFormData({
          ...formData,
          adminName: adminToEdit.name || '',
          email: adminToEdit.email || '',
          phone: adminToEdit.phone || '',
          assignedBranch: adminToEdit.branch || '',
          // Other fields might not be in the list, so we'd normally fetch them from a detailed API
        });
      }
    }
  }, [id]);

  const handleUpdate = () => {
    // Update the admin name for the assigned branch in localStorage if it changed
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

    // Update the admin in the ph_admins list
    const savedAdmins = localStorage.getItem('ph_admins');
    if (savedAdmins && id) {
      const admins = JSON.parse(savedAdmins);
      const updatedAdmins = admins.map((a: any) =>
        a.id.toString() === id
          ? {
              ...a,
              name: formData.adminName,
              email: formData.email,
              phone: formData.phone,
              branch: formData.assignedBranch,
            }
          : a
      );
      localStorage.setItem('ph_admins', JSON.stringify(updatedAdmins));
    }

    console.log('Updating Branch Admin:', formData);
    history.push(ROUTES.SUPER_ADMIN.BRANCH_ADMINS);
  };

  const handleCancel = () => {
    history.push(ROUTES.SUPER_ADMIN.BRANCH_ADMINS);
  };

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref={ROUTES.SUPER_ADMIN.BRANCH_ADMINS} text="" />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Edit Branch Admin</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          <div className="sa-page__header">
            <h1 className="sa-page__title">Edit Administrator</h1>
            <p className="sa-page__subtitle">Update account details and branch assignment.</p>
          </div>

          <div className="sa-form-layout">
            <div className="sa-section">
              <div className="sa-section__header">
                <div>
                  <h2 className="sa-section__title">Admin Details</h2>
                  <p className="sa-section__subtitle">Personal and account information</p>
                </div>
              </div>

              <div className="sa-settings__form-grid">
                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">
                    <IonIcon icon={personOutline} style={{ marginRight: '8px' }} />
                    Admin Name
                  </label>
                  <input
                    className="sa-settings__input"
                    placeholder="Full name"
                    value={formData.adminName}
                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">
                    <IonIcon icon={personOutline} style={{ marginRight: '8px' }} />
                    Username
                  </label>
                  <input
                    className="sa-settings__input"
                    placeholder="Login name"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">
                    <IonIcon icon={lockClosedOutline} style={{ marginRight: '8px' }} />
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="sa-settings__input"
                      placeholder="Leave blank to keep current password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                  <label className="sa-settings__label">
                    <IonIcon icon={mailOutline} style={{ marginRight: '8px' }} />
                    Email ID
                  </label>
                  <input
                    type="email"
                    className="sa-settings__input"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">
                    <IonIcon icon={callOutline} style={{ marginRight: '8px' }} />
                    Phone Number
                  </label>
                  <input
                    className="sa-settings__input"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">
                    <IonIcon icon={calendarOutline} style={{ marginRight: '8px' }} />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="sa-settings__input"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">
                    <IonIcon icon={maleFemaleOutline} style={{ marginRight: '8px' }} />
                    Gender
                  </label>
                  <select
                    className="sa-settings__input"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">
                    <IonIcon icon={homeOutline} style={{ marginRight: '8px' }} />
                    Assigned Branch
                  </label>
                  <select
                    className="sa-settings__input"
                    value={formData.assignedBranch}
                    onChange={(e) => setFormData({ ...formData, assignedBranch: e.target.value })}
                  >
                    {availableBranches.map((branch, idx) => (
                      <option key={idx} value={branch.name}>{branch.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">
                    <IonIcon icon={locationOutline} style={{ marginRight: '8px' }} />
                    Address Line 1
                  </label>
                  <input
                    className="sa-settings__input"
                    placeholder="Building / Street name"
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">
                    <IonIcon icon={locationOutline} style={{ marginRight: '8px' }} />
                    Address Line 2
                  </label>
                  <input
                    className="sa-settings__input"
                    placeholder="Area / Landmark (optional)"
                    value={formData.addressLine2}
                    onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">City</label>
                  <input
                    className="sa-settings__input"
                    placeholder="City name"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">District</label>
                  <input
                    className="sa-settings__input"
                    placeholder="District name"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">State</label>
                  <input
                    className="sa-settings__input"
                    placeholder="State name"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">Pincode</label>
                  <input
                    className="sa-settings__input"
                    placeholder="Postal code"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">
                    <IonIcon icon={documentAttachOutline} style={{ marginRight: '8px' }} />
                    Update ID Proof (Aadhaar / PAN)
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
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '24px' }}>
              <button className="sa-btn sa-btn--outline" onClick={handleCancel}>
                <IonIcon icon={closeOutline} /> Cancel
              </button>
              <button className="sa-btn sa-btn--primary" onClick={handleUpdate}>
                <IonIcon icon={saveOutline} /> Update Administrator
              </button>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default EditBranchAdminPage;
