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
  useIonViewWillEnter,
} from '@ionic/react';
import {
  searchOutline,
  personAddOutline,
  createOutline,
  trashOutline,
  chevronBackOutline,
  chevronForwardOutline,
  peopleOutline,
  heartOutline,
  checkmarkCircleOutline,
  callOutline,
  mailOutline,
  calendarOutline,
  eyeOutline,
  trendingUpOutline,
} from 'ionicons/icons';
import './super-admin.css';
import { useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';

const PatientsPage: React.FC = () => {
  const history = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientToDelete, setPatientToDelete] = useState<any>(null);
  
  const INITIAL_PATIENTS = [
    { id: 1, name: 'Elena Gilbert', email: 'elena.g@example.com', phone: '+1 234 567 8901', branch: 'Uptown Sanctuary', healer: 'Dr. Aris Varma', lastVisit: '2024-04-20', status: 'active', treatments: ['Pranic Psychotherapy'] },
    { id: 2, name: 'Stefan Salvatore', email: 'stefan.s@example.com', phone: '+1 234 567 8902', branch: 'Coastal Healing Center', healer: 'Maya Rose', lastVisit: '2024-04-18', status: 'recovered', treatments: ['Stress Relief Healing'] },
    { id: 3, name: 'Bonnie Bennett', email: 'bonnie.b@example.com', phone: '+1 234 567 8903', branch: 'Green Valley Branch', healer: 'Samuel Chen', lastVisit: '2024-04-22', status: 'active', treatments: ['Chakra Cleansing'] },
    { id: 4, name: 'Damon Salvatore', email: 'damon.s@example.com', phone: '+1 234 567 8904', branch: 'Downtown Sanctuary', healer: 'Lila Thorne', lastVisit: '2024-03-15', status: 'on-hold', treatments: ['Emotional Healing'] },
    { id: 5, name: 'Caroline Forbes', email: 'caroline.f@example.com', phone: '+1 234 567 8905', branch: 'Uptown Sanctuary', healer: 'Julian Mars', lastVisit: '2024-04-21', status: 'active', treatments: ['Anxiety Relief Healing'] },
    { id: 6, name: 'Matt Donovan', email: 'matt.d@example.com', phone: '+1 234 567 8906', branch: 'Coastal Healing Center', healer: 'Sofia Bell', lastVisit: '2024-04-10', status: 'recovered', treatments: ['Advanced Pranic Healing'] },
  ];

  const [patients, setPatients] = React.useState<any[]>(() => {
    const saved = localStorage.getItem('phms_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  React.useEffect(() => {
    localStorage.setItem('phms_patients', JSON.stringify(patients));
  }, [patients]);

  useIonViewWillEnter(() => {
    const saved = localStorage.getItem('phms_patients');
    if (saved) {
      setPatients(JSON.parse(saved));
    }
  });

  const [newPatient, setNewPatient] = useState({
    name: '',
    email: '',
    phone: '',
    branch: 'Uptown Sanctuary',
    healer: 'Dr. Aris Varma',
  });

  const handleAddPatient = () => {
    if (!newPatient.name || !newPatient.email) return;
    
    const patientObj = {
      id: patients.length + 1,
      ...newPatient,
      lastVisit: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setPatients([...patients, patientObj]);
    setNewPatient({ name: '', email: '', phone: '', branch: 'Uptown Sanctuary', healer: 'Dr. Aris Varma' });
    setShowAddModal(false);
  };

  const handleEditClick = (patient: any) => {
    history.push(ROUTES.SUPER_ADMIN.EDIT_PATIENT.replace(':id', patient.id.toString()));
  };

  const handleDeleteClick = (patient: any) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (patientToDelete) {
      setPatients(patients.filter(p => p.id !== patientToDelete.id));
      setShowDeleteModal(false);
      setPatientToDelete(null);
    }
  };

  const [filterBranch, setFilterBranch] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.healer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesBranch = filterBranch === 'All' || patient.branch === filterBranch;
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Recovered' ? patient.status === 'recovered' : patient.status === filterStatus.toLowerCase().replace(' ', '-'));
    
    return matchesSearch && matchesBranch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearchChange = (e: any) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Patient Directory</IonTitle>
          <IonButtons slot="end">
            <button className="sa-page__toolbar-avatar">SA</button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          <div className="sa-page__header">
            <div className="sa-page__header-row">
              <div>
                <h1 className="sa-page__title">Patient Management</h1>
                <p className="sa-page__subtitle">Track and manage patient records across all branches</p>
              </div>
            </div>
          </div>

          <div className="sa-stats sa-stats--3">
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Total Patients</div>
                <div className="sa-stat-card__value">{patients.length}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} /> Across all branches
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--primary">
                <IonIcon icon={peopleOutline} />
              </div>
            </div>

            <div className="sa-stat-card" style={{ '--color-primary': '#f59e0b' } as any}>
              <div>
                <div className="sa-stat-card__label">Active Treatments</div>
                <div className="sa-stat-card__value">{patients.filter(p => p.status === 'active').length}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#f59e0b' }} /> Currently in therapy
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--warning">
                <IonIcon icon={heartOutline} />
              </div>
            </div>

            <div className="sa-stat-card" style={{ '--color-primary': '#10b981' } as any}>
              <div>
                <div className="sa-stat-card__label">Fully Recovered</div>
                <div className="sa-stat-card__value">{patients.filter(p => p.status === 'recovered').length}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} /> Treatment completed
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--success">
                <IonIcon icon={checkmarkCircleOutline} />
              </div>
            </div>
          </div>

          <div className="sa-filter-row" style={{ marginBottom: '24px' }}>
            <div className="sa-search sa-search--full-mobile" style={{ margin: 0, flex: '2', minWidth: '300px' }}>
              <IonIcon icon={searchOutline} />
              <input 
                placeholder="Search by name, email or healer..." 
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="sa-filter-group" style={{ display: 'flex', gap: '12px', flex: '1', minWidth: '300px' }}>
              <div className="sa-input-group" style={{ flex: '1' }}>
                <select 
                  className="sa-input" 
                  value={filterBranch} 
                  onChange={(e) => { setFilterBranch(e.target.value); setCurrentPage(1); }}
                >
                  <option value="All">All Branches</option>
                  <option value="Uptown Sanctuary">Uptown Sanctuary</option>
                  <option value="Coastal Healing Center">Coastal Healing Center</option>
                  <option value="Green Valley Branch">Green Valley Branch</option>
                  <option value="Downtown Sanctuary">Downtown Sanctuary</option>
                </select>
              </div>
              <div className="sa-input-group" style={{ flex: '1' }}>
                <select 
                  className="sa-input" 
                  value={filterStatus} 
                  onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="On Hold">On Hold</option>
                  <option value="Recovered">Recovered</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="sa-section" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="sa-table-responsive">
              <table className="sa-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  {/* <th>Contact</th> */}
                  <th>Assigned Branch</th>
                  <th>Assigned Healer</th>
                  <th>Treatments</th>
                  <th>Last Visit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPatients.length > 0 ? (
                  paginatedPatients.map((patient) => (
                    <tr key={patient.id}>
                      <td>
                        <div className="sa-table__user">
                          <div className="sa-table__avatar sa-table__avatar--patient">
                            {patient.name.split(' ').map((n: string) => n[0]).join('')}
                          </div>
                          <div className="sa-table__user-info">
                            <span className="sa-table__user-name">{patient.name}</span>
                            {/* <span className="sa-table__user-id">ID: #PT-{1000 + patient.id}</span> */}
                          </div>
                        </div>
                      </td>
                      {/* <td>
                        <div className="sa-table__contact-info">
                          <div className="sa-table__contact-item">
                            <IonIcon icon={mailOutline} /> {patient.email}
                          </div>
                          <div className="sa-table__contact-item">
                            <IonIcon icon={callOutline} /> {patient.phone}
                          </div>
                        </div>
                      </td> */}
                      <td>{patient.branch}</td>
                      <td>{patient.healer}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          {(patient.treatments && patient.treatments.length > 0) ? (
                            patient.treatments.map((t: string, i: number) => (
                              <span key={i} style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-secondary)' }}>
                                {t}{i < (patient.treatments?.length || 0) - 1 ? ',' : ''}
                              </span>
                            ))
                          ) : (
                            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                              General Wellness
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="sa-table__date">
                          <IonIcon icon={calendarOutline} />
                          {patient.lastVisit}
                        </div>
                      </td>
                      <td>
                        <span className={`sa-badge sa-badge--${patient.status.toLowerCase().replace(' ', '-')}`}>
                          {patient.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td>
                        <div className="sa-table__actions">
                          <button className="sa-table__action-btn sa-action-btn--view" onClick={() => history.push(ROUTES.SUPER_ADMIN.PATIENT_DETAILS.replace(':id', patient.id.toString()))} title="View Details">
                            <IonIcon icon={eyeOutline} />
                          </button>
                          <button className="sa-table__action-btn sa-action-btn--edit" onClick={() => handleEditClick(patient)}>
                            <IonIcon icon={createOutline} />
                          </button>
                          <button className="sa-table__action-btn sa-action-btn--delete" onClick={() => handleDeleteClick(patient)}>
                            <IonIcon icon={trashOutline} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '0' }}>
                      <div className="sa-empty-state" style={{ border: 'none', background: 'transparent', margin: '0' }}>
                        <div className="sa-empty-state__icon">
                          <IonIcon icon={peopleOutline} />
                        </div>
                        <h3 className="sa-empty-state__title">No patients found</h3>
                        <p className="sa-empty-state__text">
                          {searchQuery 
                            ? `No patients matching "${searchQuery}" were found.` 
                            : `There are currently no patients ${filterStatus !== 'All' ? `marked as ${filterStatus}` : 'registered'}${filterBranch !== 'All' ? ` in ${filterBranch}` : ''}.`}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

            <div className="sa-table__footer">
              <div className="sa-pagination__info">
                Showing {filteredPatients.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredPatients.length)} of {filteredPatients.length} patients
              </div>
              <div className="sa-pagination__controls">
                <button 
                  className="sa-pagination__btn" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <IonIcon icon={chevronBackOutline} />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    className={`sa-pagination__btn ${currentPage === i + 1 ? 'sa-pagination__btn--active' : ''}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button 
                  className="sa-pagination__btn" 
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <IonIcon icon={chevronForwardOutline} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </IonContent>

      {/* Add Patient Modal */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)} className="sa-modal">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Register New Patient</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowAddModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Full Name</label>
              <input 
                className="sa-settings__input" 
                placeholder="Patient Full Name"
                value={newPatient.name}
                onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
              />
            </div>
            <div className="sa-settings__form-row">
              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Email</label>
                <input 
                  className="sa-settings__input" 
                  placeholder="email@example.com"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                />
              </div>
              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Phone Number</label>
                <input 
                  className="sa-settings__input" 
                  placeholder="+1 234 567 8900"
                  value={newPatient.phone}
                  onChange={(e) => setNewPatient({ ...newPatient, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="sa-settings__form-row">
              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Assigned Branch</label>
                <select 
                  className="sa-settings__input"
                  value={newPatient.branch}
                  onChange={(e) => setNewPatient({ ...newPatient, branch: e.target.value })}
                >
                  <option>Uptown Sanctuary</option>
                  <option>Coastal Healing Center</option>
                  <option>Green Valley Branch</option>
                  <option>Downtown Sanctuary</option>
                </select>
              </div>
              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Assigned Healer</label>
                <select 
                  className="sa-settings__input"
                  value={newPatient.healer}
                  onChange={(e) => setNewPatient({ ...newPatient, healer: e.target.value })}
                >
                  <option>Dr. Aris Varma</option>
                  <option>Maya Rose</option>
                  <option>Samuel Chen</option>
                  <option>Lila Thorne</option>
                </select>
              </div>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleAddPatient}>Register Patient</button>
          </div>
        </div>
      </IonModal>


      {/* Delete Confirmation Modal */}
      <IonModal isOpen={showDeleteModal} onDidDismiss={() => setShowDeleteModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Archive Patient Record</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <p className="sa-modal__desc">
              Are you sure you want to archive <strong>{patientToDelete?.name}</strong>? All their treatment history will be preserved but they will no longer appear in active lists.
            </p>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowDeleteModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--danger" onClick={handleConfirmDelete}>Confirm Archive</button>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
};

export default PatientsPage;
