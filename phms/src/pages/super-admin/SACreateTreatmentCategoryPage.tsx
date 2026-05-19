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
  IonToast,
} from '@ionic/react';
import {
  saveOutline,
  closeOutline,
  refreshOutline,
  folderOutline,
  codeOutline,
  documentTextOutline,
  listOutline,
  checkmarkCircleOutline,
  colorPaletteOutline,
  gridOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import './super-admin.css';

const SACreateTreatmentCategoryPage: React.FC = () => {
  const history = useHistory();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('success');

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    status: 'Active',
  });

  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const savedCategories = localStorage.getItem('ph_treatment_categories');
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      const INITIAL_CATEGORIES = [
        { id: 1, name: 'Physical Healing', treatmentCount: 12, description: 'Focuses on physical ailments and bodily restoration.', createdAt: '2024-05-01', status: 'Active' },
        { id: 2, name: 'Emotional Healing', treatmentCount: 8, description: 'Addressing emotional trauma and inner peace.', createdAt: '2024-05-02', status: 'Active' },
        { id: 3, name: 'Mental Wellness', treatmentCount: 15, description: 'Mental clarity, stress management, and focus.', createdAt: '2024-05-03', status: 'Active' },
        { id: 4, name: 'Chakra Healing', treatmentCount: 10, description: 'Balancing and aligning the energy centers.', createdAt: '2024-05-04', status: 'Inactive' },
      ];
      setCategories(INITIAL_CATEGORIES);
      localStorage.setItem('ph_treatment_categories', JSON.stringify(INITIAL_CATEGORIES));
    }
  }, []);

  const handleCreate = () => {
    // 1. Validate Name
    if (!formData.name.trim()) {
      setToastMessage('Category Name is required');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    // 2. Validate Uniqueness
    const isDuplicate = categories.some(
      (cat) => cat.name.toLowerCase() === formData.name.toLowerCase()
    );
    if (isDuplicate) {
      setToastMessage('Category Name already exists');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    // 3. Create New Category
    const newCategory = {
      id: categories.length + 1,
      ...formData,
      treatmentCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: 'Super Admin', // Mocking current user
      lastUpdated: new Date().toISOString(),
    };

    const updatedCategories = [...categories, newCategory];
    localStorage.setItem('ph_treatment_categories', JSON.stringify(updatedCategories));

    setToastMessage('Category created successfully!');
    setToastColor('success');
    setShowToast(true);

    setTimeout(() => {
      history.push(ROUTES.SUPER_ADMIN.TREATMENT_CATEGORIES);
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      code: '',
      description: '',
      status: 'Active',
    });
  };

  const handleCancel = () => {
    history.push(ROUTES.SUPER_ADMIN.TREATMENT_CATEGORIES);
  };


  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref={ROUTES.SUPER_ADMIN.TREATMENT_CATEGORIES} text="" />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Create Treatment Category</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          <div className="sa-page__header">
            <h1 className="sa-page__title">Add New Category</h1>
            <p className="sa-page__subtitle">Define a new classification for treatments and healing services</p>
          </div>

          <div className="sa-form-layout">
            <div className="sa-section">
              <div className="sa-section__header">
                <div>
                  <h2 className="sa-section__title">Basic Information</h2>
                  <p className="sa-section__subtitle">Core identification details for the category</p>
                </div>
              </div>

              <div className="sa-settings__form">
                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">
                    <IonIcon icon={folderOutline} style={{ marginRight: '8px' }} />
                    Category Name <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    className="sa-settings__input"
                    placeholder="e.g., Advanced Healing"
                    value={formData.name}
                    maxLength={50}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">
                    <IonIcon icon={codeOutline} style={{ marginRight: '8px' }} />
                    Category Code (Optional)
                  </label>
                  <input
                    className="sa-settings__input"
                    placeholder="e.g., AD-001"
                    value={formData.code}
                    maxLength={10}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  />
                </div>

                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">
                    <IonIcon icon={documentTextOutline} style={{ marginRight: '8px' }} />
                    Description
                  </label>
                  <textarea
                    className="sa-settings__input"
                    rows={3}
                    placeholder="Describe the treatments included in this category..."
                    style={{ resize: 'none', padding: '12px' }}
                    value={formData.description}
                    maxLength={200}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="sa-section">
              <div className="sa-section__header">
                <div>
                  <h2 className="sa-section__title">Organization & Status</h2>
                  <p className="sa-section__subtitle">Define sorting logic and availability</p>
                </div>
              </div>

              <div className="sa-settings__form">
                <div className="sa-settings__form-group">
                  <label className="sa-settings__label">
                    <IonIcon icon={checkmarkCircleOutline} style={{ marginRight: '8px' }} />
                    Status
                  </label>
                  <select
                    className="sa-settings__input"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>


            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px', paddingBottom: '40px' }}>
              <button className="sa-btn sa-btn--outline" onClick={handleReset}>
                <IonIcon icon={refreshOutline} /> Reset
              </button>
              <button className="sa-btn sa-btn--outline" onClick={handleCancel} style={{ color: '#ef4444', borderColor: '#fee2e2' }}>
                <IonIcon icon={closeOutline} /> Cancel
              </button>
              <button className="sa-btn sa-btn--primary" onClick={handleCreate} style={{ minWidth: '160px' }}>
                <IonIcon icon={saveOutline} /> Save Category
              </button>
            </div>
          </div>
        </div>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color={toastColor}
          position="bottom"
        />
      </IonContent>
    </IonPage>
  );
};

export default SACreateTreatmentCategoryPage;
