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
  medkitOutline,
  gridOutline,
  codeOutline,
  documentTextOutline,
  timeOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import './super-admin.css';

const SAEditTreatmentTypePage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  
  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('success');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    code: '',
    status: 'Active',
    description: '',
    sessionDuration: '30 min',
  });
  const [isCustomDuration, setIsCustomDuration] = useState(false);

  // Data State
  const [categories, setCategories] = useState<any[]>([]);
  const [treatments, setTreatments] = useState<any[]>([]);

  useEffect(() => {
    // Load Categories
    const savedCats = localStorage.getItem('ph_treatment_categories');
    if (savedCats) {
      setCategories(JSON.parse(savedCats));
    }

    const MOCK_TREATMENTS = [
      { id: 1, name: 'Stress Relief Healing', category: 'Mental Wellness', description: 'Energetically clearing stress and mental tension.', createdDate: '2024-01-15', sessionDuration: '45 min', status: 'Active' },
      { id: 2, name: 'Chakra Cleansing', category: 'Energy Maintenance', description: 'Balancing and purifying the main energy centers.', createdDate: '2024-01-15', sessionDuration: '30 min', status: 'Active' },
      { id: 3, name: 'Emotional Healing', category: 'Psychological', description: 'Releasing suppressed emotions and trauma.', createdDate: '2024-01-18', sessionDuration: '1 hr', status: 'Active' },
      { id: 4, name: 'Physical Pain Healing', category: 'Physical Health', description: 'Addressing localized physical ailments and pain.', createdDate: '2024-01-20', sessionDuration: '45 min', status: 'Active' },
      { id: 5, name: 'Energy Balancing', category: 'General Wellness', description: 'Harmonizing the overall energy body.', createdDate: '2024-01-22', sessionDuration: '30 min', status: 'Active' },
      { id: 6, name: 'Pranic Psychotherapy', category: 'Specialized', description: 'Advanced healing for psychological conditions.', createdDate: '2024-02-05', sessionDuration: '1 hr', status: 'Active' },
      { id: 7, name: 'Meditation Therapy', category: 'Spiritual', description: 'Guided healing through meditative states.', createdDate: '2024-02-10', sessionDuration: '45 min', status: 'Active' },
      { id: 8, name: 'Distance Healing', category: 'Remote', description: 'Healing sessions conducted from a distance.', createdDate: '2024-02-12', sessionDuration: '30 min', status: 'Active' },
      { id: 9, name: 'Aura Cleansing', category: 'Energy Maintenance', description: 'Purifying the outer energy shell.', createdDate: '2024-02-15', sessionDuration: '30 min', status: 'Active' },
      { id: 10, name: 'Relationship Healing', category: 'Social', description: 'Improving energetic ties between individuals.', createdDate: '2024-02-18', sessionDuration: '1 hr', status: 'Active' },
      { id: 11, name: 'Sleep Disorder Healing', category: 'Physical Health', description: 'Improving sleep patterns and insomnia.', createdDate: '2024-03-01', sessionDuration: '45 min', status: 'Active' },
      { id: 12, name: 'Anxiety Relief Healing', category: 'Psychological', description: 'Calming the nervous system and mind.', createdDate: '2024-03-05', sessionDuration: '45 min', status: 'Active' },
      { id: 13, name: 'Depression Support Healing', category: 'Psychological', description: 'Uplifting the energetic state and mood.', createdDate: '2024-03-08', sessionDuration: '1 hr', status: 'Active' },
      { id: 14, name: 'Back Pain Healing', category: 'Physical Health', description: 'Targeted healing for spinal and back issues.', createdDate: '2024-03-10', sessionDuration: '45 min', status: 'Active' },
      { id: 15, name: 'Migraine Relief Healing', category: 'Physical Health', description: 'Specialized healing for chronic headaches.', createdDate: '2024-03-12', sessionDuration: '30 min', status: 'Active' },
      { id: 16, name: 'Heart Chakra Healing', category: 'Specific Chakra', description: 'Focusing on emotional and cardiovascular energy.', createdDate: '2024-03-15', sessionDuration: '45 min', status: 'Active' },
      { id: 17, name: 'Solar Plexus Healing', category: 'Specific Chakra', description: 'Addressing digestive and willpower energy.', createdDate: '2024-03-18', sessionDuration: '45 min', status: 'Active' },
      { id: 18, name: 'General Wellness Healing', category: 'General Wellness', description: 'Standard maintenance for overall health.', createdDate: '2024-03-20', sessionDuration: '30 min', status: 'Active' },
      { id: 19, name: 'Follow-up Healing', category: 'General Wellness', description: 'Secondary session to stabilize previous healing.', createdDate: '2024-03-22', sessionDuration: '30 min', status: 'Active' },
      { id: 20, name: 'Advanced Pranic Healing', category: 'Specialized', description: 'High-level healing using color pranas.', createdDate: '2024-03-25', sessionDuration: '1.5 hrs', status: 'Active' },
    ];

    // Load Treatments and find current one
    const savedTreatments = localStorage.getItem('ph_treatments');
    const allTreatments = savedTreatments ? JSON.parse(savedTreatments) : MOCK_TREATMENTS;
    setTreatments(allTreatments);
    
    const current = allTreatments.find((t: any) => t.id === Number(id));
    if (current) {
      setFormData({
        name: current.name || '',
        category: current.category || '',
        code: current.code || '',
        status: current.status || 'Active',
        description: current.description || '',
        sessionDuration: current.sessionDuration || current.duration || '30 min',
      });
      
      const standardDurations = ['30 min', '45 min', '1 hr'];
      if (current.sessionDuration && !standardDurations.includes(current.sessionDuration)) {
        setIsCustomDuration(true);
      }
    }
  }, [id]);

  const handleUpdate = () => {
    if (!formData.name.trim() || !formData.category) {
      setToastMessage('Treatment Name and Category are required');
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    const updatedTreatments = treatments.map((t) => {
      if (t.id === Number(id)) {
        return {
          ...t,
          ...formData,
          lastUpdated: new Date().toISOString(),
        };
      }
      return t;
    });

    localStorage.setItem('ph_treatments', JSON.stringify(updatedTreatments));

    setToastMessage('Treatment Type updated successfully!');
    setToastColor('success');
    setShowToast(true);

    setTimeout(() => {
      history.push(ROUTES.SUPER_ADMIN.TREATMENT_TYPE_LIST);
    }, 1500);
  };

  const handleCancel = () => {
    history.push(ROUTES.SUPER_ADMIN.TREATMENT_TYPE_LIST);
  };

  const activeCategories = categories.filter(c => c.status === 'Active');

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref={ROUTES.SUPER_ADMIN.TREATMENT_TYPE_LIST} text="" />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Edit Treatment Type</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          <div className="sa-page__header">
            <h1 className="sa-page__title">Edit Treatment</h1>
            <p className="sa-page__subtitle">Update treatment protocols and technical specifications</p>
          </div>

          <div className="sa-form-layout">
            <div className="sa-section" style={{ marginBottom: '32px' }}>
              <div className="sa-section__header">
                <div>
                  <h2 className="sa-section__title">Core Information</h2>
                  <p className="sa-section__subtitle">Primary identification and classification</p>
                </div>
              </div>

              <div className="sa-settings__form">
                <div className="sa-form-grid">
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">
                      <IonIcon icon={medkitOutline} style={{ marginRight: '8px', fontSize: '14px' }} />
                      Treatment Type Name <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
                    </label>
                    <input
                      className="sa-settings__input"
                      placeholder="e.g., Stress Relief Healing"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">
                      <IonIcon icon={gridOutline} style={{ marginRight: '8px', fontSize: '14px' }} />
                      Treatment Category <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
                    </label>
                    <select
                      className="sa-settings__input"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="">Select Category</option>
                      {activeCategories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">
                      <IonIcon icon={codeOutline} style={{ marginRight: '8px', fontSize: '14px' }} />
                      Treatment Code (Optional)
                    </label>
                    <input
                      className="sa-settings__input"
                      placeholder="e.g., TRT001"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    />
                  </div>

                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">
                      <IonIcon icon={checkmarkCircleOutline} style={{ marginRight: '8px', fontSize: '14px' }} />
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
            </div>

            <div className="sa-form-grid" style={{ alignItems: 'start' }}>
              <div className="sa-section" style={{ height: '100%', marginBottom: 0 }}>
                <div className="sa-section__header">
                  <div>
                    <h2 className="sa-section__title">Description</h2>
                    <p className="sa-section__subtitle">Short overview of the treatment type</p>
                  </div>
                </div>

                <div className="sa-settings__form">
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">
                      <IonIcon icon={documentTextOutline} style={{ marginRight: '8px' }} />
                      Short Description
                    </label>
                    <input
                      className="sa-settings__input"
                      placeholder="Brief overview of the treatment..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="sa-section" style={{ height: '100%', marginBottom: 0 }}>
                <div className="sa-section__header">
                  <div>
                    <h2 className="sa-section__title">Session Details</h2>
                    <p className="sa-section__subtitle">Technical specifications for the session</p>
                  </div>
                </div>

                <div className="sa-settings__form">
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">
                      <IonIcon icon={timeOutline} style={{ marginRight: '8px' }} />
                      Session Duration
                    </label>
                    <div style={{ position: 'relative' }}>
                      {!isCustomDuration ? (
                        <select
                          className="sa-settings__input"
                          value={formData.sessionDuration}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'Custom') {
                              setIsCustomDuration(true);
                              setFormData({ ...formData, sessionDuration: '' });
                            } else {
                              setIsCustomDuration(false);
                              setFormData({ ...formData, sessionDuration: val });
                            }
                          }}
                        >
                          <option value="30 min">30 min</option>
                          <option value="45 min">45 min</option>
                          <option value="1 hr">1 hr</option>
                          <option value="Custom">Custom...</option>
                        </select>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <input
                            className="sa-settings__input"
                            placeholder="Type duration (e.g. 2 hrs)"
                            value={formData.sessionDuration}
                            onChange={(e) => setFormData({ ...formData, sessionDuration: e.target.value })}
                            autoFocus
                          />
                          <button 
                            className="sa-btn sa-btn--outline" 
                            style={{ padding: '0 12px', height: '42px', minWidth: 'auto' }}
                            type="button"
                            onClick={() => {
                              setIsCustomDuration(false);
                              setFormData({ ...formData, sessionDuration: '30 min' });
                            }}
                          >
                            <IonIcon icon={refreshOutline} style={{ margin: 0 }} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '32px', paddingBottom: '40px', flexWrap: 'wrap' }}>
              <button className="sa-btn sa-btn--outline" type="button" onClick={handleCancel} style={{ color: '#ef4444', borderColor: '#fee2e2' }}>
                <IonIcon icon={closeOutline} /> Cancel
              </button>
              <button className="sa-btn sa-btn--primary" type="button" onClick={handleUpdate} style={{ minWidth: '160px' }}>
                <IonIcon icon={saveOutline} /> Update Treatment
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

export default SAEditTreatmentTypePage;
