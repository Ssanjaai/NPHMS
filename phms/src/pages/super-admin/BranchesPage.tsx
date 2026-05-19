import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenuButton,
  IonModal,
} from '@ionic/react';
import {
  notificationsOutline,
  searchOutline,
  addOutline,
  homeOutline,
  locationOutline,
  callOutline,
  calendarOutline,
  chevronForwardOutline,
  trashOutline,
  businessOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  trendingUpOutline,
} from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import './super-admin.css';

const BranchesPage: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{newBranch?: any}>();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<any>(null);
  const [branchToDelete, setBranchToDelete] = useState<any>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [admins, setAdmins] = useState<any[]>([]);
  const filters = ['All', 'Active', 'Inactive', 'Closed'];

  const INITIAL_BRANCHES = [
    {
      name: 'Uptown Sanctuary',
      region: 'Northern Region',
      status: 'active',
      admin: 'John Admin',
      phone: '0876543210',
      est: '2023-01-16',
    },
    {
      name: 'Coastal Healing Center',
      region: 'Western Region',
      status: 'active',
      admin: 'Sarah Admin',
      phone: '0876543211',
      est: '2023-02-20',
    },
    {
      name: 'Green Valley Branch',
      region: 'Southern Region',
      status: 'Inactive',
      admin: 'Mike Admin',
      phone: '0876543212',
      est: '2022-02-10',
    },
    {
      name: 'Downtown Sanctuary',
      region: 'Central Region',
      status: 'active',
      admin: 'Elena Thorne',
      phone: '0876543212',
      est: '2023-04-05',
    },
  ];

  const [branches, setBranches] = useState<any[]>(() => {
    const savedBranches = localStorage.getItem('ph_branches');
    return savedBranches ? JSON.parse(savedBranches) : INITIAL_BRANCHES;
  });

  // Save branches to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ph_branches', JSON.stringify(branches));
  }, [branches]);

  // Re-sync from localStorage every time this page is visited
  useEffect(() => {
    const savedBranches = localStorage.getItem('ph_branches');
    if (savedBranches) {
      setBranches(JSON.parse(savedBranches));
    }
    
    const savedAdmins = localStorage.getItem('ph_admins');
    if (savedAdmins) {
      setAdmins(JSON.parse(savedAdmins));
    } else {
      const INITIAL_ADMINS = [
        { id: 1, name: 'John Admin', email: 'john.a@phms.com', phone: '0876543210', branch: 'Uptown Sanctuary', status: 'active', joined: '2023-01-16' },
        { id: 2, name: 'Sarah Admin', email: 'sarah.m@phms.com', phone: '0876543211', branch: 'Coastal Healing Center', status: 'active', joined: '2023-02-20' },
        { id: 3, name: 'Mike Admin', email: 'mike.t@phms.com', phone: '0876543212', branch: 'Green Valley Branch', status: 'Inactive', joined: '2022-02-10' },
        { id: 4, name: 'Elena Thorne', email: 'elena.t@phms.com', phone: '0876543212', branch: 'Downtown Sanctuary', status: 'active', joined: '2023-04-05' },
      ];
      setAdmins(INITIAL_ADMINS);
      localStorage.setItem('ph_admins', JSON.stringify(INITIAL_ADMINS));
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.state?.newBranch) {
      // Clear state so it doesn't add again on reload
      history.replace({ ...location, state: undefined });
    }
  }, [location, history]);

  const handleCreateBranch = () => {
    history.push(ROUTES.SUPER_ADMIN.CREATE_BRANCH);
  };

  const openEditModal = (branch: any, index: number) => {
    setEditingIndex(index);
    setSelectedBranch({ ...branch });
    setShowEditModal(true);
  };

  const openReportModal = (branch: any) => {
    setSelectedBranch({ ...branch });
    setShowReportModal(true);
  };

  const handleSaveEdit = () => {
    if (editingIndex !== null && selectedBranch) {
      const newBranches = [...branches];
      // Find the actual index if filtered
      // const actualIndex = branches.findIndex(b => b.name === newBranches[editingIndex].name);
      
      newBranches[editingIndex] = selectedBranch;
      setBranches(newBranches);

      // Update ph_admins if admin changed
      if (selectedBranch.admin !== 'Unassigned') {
        const savedAdmins = localStorage.getItem('ph_admins');
        if (savedAdmins) {
          const allAdmins = JSON.parse(savedAdmins);
          const updatedAdmins = allAdmins.map((admin: any) => 
            admin.name === selectedBranch.admin ? { ...admin, branch: selectedBranch.name } : admin
          );
          localStorage.setItem('ph_admins', JSON.stringify(updatedAdmins));
          setAdmins(updatedAdmins);
        }
      }
    }
    setShowEditModal(false);
  };

  const handleDeleteBranch = (index: number) => {
    const branch = filteredBranches[index];
    setBranchToDelete(branch);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (branchToDelete) {
      setBranches(branches.filter(b => b.name !== branchToDelete.name));
      setShowDeleteModal(false);
      setBranchToDelete(null);
    }
  };

  const totalBranches = branches.length;
  const activeBranches = branches.filter(b => b.status?.toLowerCase() === 'active').length;
  const inactiveBranches = branches.filter(b => b.status?.toLowerCase() === 'inactive').length;

  const filteredBranches = branches
    .filter(b => activeFilter === 'All' || b.status?.toLowerCase() === activeFilter.toLowerCase())
    .filter(b => 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      b.region.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Branches</IonTitle>
          <IonButtons slot="end">
            <div className="sa-page__toolbar-actions">
              <IonButton fill="clear">
                <IonIcon icon={notificationsOutline} />
              </IonButton>
              <div className="sa-page__toolbar-avatar">AS</div>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          {/* Page Header */}
          <div className="sa-page__header">
            <div className="sa-page__header-row">
              <div>
                <h1 className="sa-page__title">Sanctuary Branches</h1>
                <p className="sa-page__subtitle">Manage healing centers and administrative assignments</p>
              </div>
              <button className="sa-btn sa-btn--primary" onClick={handleCreateBranch}>
                <IonIcon icon={addOutline} /> Create New Branch
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="sa-stats sa-stats--3">
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Total Branches</div>
                <div className="sa-stat-card__value">{totalBranches}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} /> Across all regions
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--primary">
                <IonIcon icon={businessOutline} />
              </div>
            </div>

            <div className="sa-stat-card" style={{ '--color-primary': '#10b981' } as any}>
              <div>
                <div className="sa-stat-card__label">Active</div>
                <div className="sa-stat-card__value">{activeBranches}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} /> Operational now
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--success">
                <IonIcon icon={checkmarkCircleOutline} />
              </div>
            </div>

            <div className="sa-stat-card" style={{ '--color-primary': '#f59e0b' } as any}>
              <div>
                <div className="sa-stat-card__label">Inactive</div>
                <div className="sa-stat-card__value">{inactiveBranches}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#f59e0b', transform: 'rotate(90deg)' }} /> Pending review
                </div>
              </div>
              <div className="sa-stat-card__icon sa-stat-card__icon--warning">
                <IonIcon icon={alertCircleOutline} />
              </div>
            </div>
          </div>

          {/* Search & Filters */}
          <div className="sa-filter-row" style={{ marginBottom: 24 }}>
            <div className="sa-search">
              <IonIcon icon={searchOutline} />
              <input 
                placeholder="Search by name or region..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="sa-filters" style={{ marginBottom: 0 }}>
              {filters.map(f => (
                <button
                  key={f}
                  className={`sa-filter-tab ${activeFilter === f ? 'sa-filter-tab--active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Branch Cards */}
          <div className="sa-branches-grid">
            {filteredBranches.length > 0 ? (
              filteredBranches.map((branch, i) => (
                <div className="sa-branch-card" key={i}>
                  <div className="sa-branch-card__header">
                    <div className="sa-branch-card__name-row">
                      <div className="sa-branch-card__icon">
                        <IonIcon icon={homeOutline} />
                      </div>
                      <div>
                        <h3 className="sa-branch-card__name">{branch.name}</h3>
                        <p className="sa-branch-card__region">
                          <IonIcon icon={locationOutline} /> {branch.region}
                        </p>
                      </div>
                    </div>
                    <span className={`sa-badge sa-badge--${branch.status}`}>
                      {branch.status}
                    </span>
                  </div>

                  <div 
                    className="sa-branch-card__admin" 
                    onClick={() => {
                      if (branch.admin !== 'Unassigned') {
                        history.push(ROUTES.SUPER_ADMIN.BRANCH_DETAILS.replace(':id', encodeURIComponent(branch.name)));
                      } else {
                        alert('This branch is currently unassigned. Please assign a branch admin to access its dashboard.');
                      }
                    }}
                    style={branch.admin === 'Unassigned' ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                  >
                    <div>
                      <div className="sa-branch-card__admin-label">Branch Admin</div>
                      <div className="sa-branch-card__admin-name">{branch.admin}</div>
                    </div>
                    <IonIcon icon={chevronForwardOutline} style={{ color: '#999' }} />
                  </div>

                  <div className="sa-branch-card__meta">
                    <div className="sa-branch-card__meta-item">
                      <IonIcon icon={callOutline} /> {branch.phone}
                    </div>
                    <div className="sa-branch-card__meta-item">
                      <IonIcon icon={calendarOutline} /> Est. {branch.est}
                    </div>
                  </div>

                  <div className="sa-branch-card__actions" style={{ marginTop: '16px', borderTop: '1px solid #f0f1f5', paddingTop: '12px' }}>
                    <button 
                      className="sa-btn sa-btn--delete-light sa-btn--sm" 
                      style={{ width: '100%', justifyContent: 'center' }} 
                      onClick={() => handleDeleteBranch(i)}
                    >
                      Delete Branch
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="sa-empty-state">
                <div className="sa-empty-state__icon">
                  <IonIcon icon={businessOutline} />
                </div>
                <h3 className="sa-empty-state__title">
                  {activeFilter === 'Closed' ? 'No closed branches available' : `No ${activeFilter.toLowerCase()} branches found`}
                </h3>
                <p className="sa-empty-state__text">
                  {searchQuery 
                    ? `No branches matching "${searchQuery}" were found in this category.` 
                    : `There are currently no branches marked as ${activeFilter.toLowerCase()}.`}
                </p>
              </div>
            )}
          </div>
        </div>
      </IonContent>



      {/* 2. Edit Details Modal */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)} className="sa-modal">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Edit Branch Details</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowEditModal(false)}>×</button>
          </div>
          {selectedBranch && (
            <div className="sa-modal__body">
              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Branch Name</label>
                <input 
                  className="sa-settings__input" 
                  value={selectedBranch.name}
                  onChange={(e) => setSelectedBranch({...selectedBranch, name: e.target.value})}
                />
              </div>
              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Region</label>
                <select 
                  className="sa-settings__input"
                  value={selectedBranch.region}
                  onChange={(e) => setSelectedBranch({...selectedBranch, region: e.target.value})}
                >
                  <option>Northern Region</option>
                  <option>Southern Region</option>
                  <option>Eastern Region</option>
                  <option>Western Region</option>
                  <option>Central Region</option>
                </select>
              </div>
              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Assigned Admin</label>
                <select 
                  className="sa-settings__input"
                  value={selectedBranch.admin}
                  onChange={(e) => setSelectedBranch({...selectedBranch, admin: e.target.value})}
                >
                  <option value="Unassigned">Unassigned</option>
                  {admins.map((admin, idx) => (
                    <option key={idx} value={admin.name}>{admin.name}</option>
                  ))}
                </select>
              </div>
              <div className="sa-settings__form-group">
                <label className="sa-settings__label">Status</label>
                <select 
                  className="sa-settings__input"
                  value={selectedBranch.status}
                  onChange={(e) => setSelectedBranch({...selectedBranch, status: e.target.value})}
                >
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          )}
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleSaveEdit}>Save Changes</button>
          </div>
        </div>
      </IonModal>

      {/* 3. Branch Reports Modal */}
      <IonModal isOpen={showReportModal} onDidDismiss={() => setShowReportModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Branch Overview</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowReportModal(false)}>×</button>
          </div>
          {selectedBranch && (
            <div className="sa-modal__body">
              <p className="sa-modal__desc">
                Generating snapshot reports for <strong>{selectedBranch.name}</strong> as of {new Date().toLocaleDateString()}.
              </p>
              
              <div className="sa-finance-grid" style={{ marginBottom: 0 }}>
                <div className="sa-finance-card" style={{ padding: '12px' }}>
                  <div className="sa-finance-card__label">Total Sessions</div>
                  <div className="sa-finance-card__value" style={{ fontSize: '18px' }}>142</div>
                </div>
                <div className="sa-finance-card" style={{ padding: '12px' }}>
                  <div className="sa-finance-card__label">Est. Revenue</div>
                  <div className="sa-finance-card__value" style={{ fontSize: '18px' }}>₹12k</div>
                </div>
              </div>
              
            </div>
          )}
          <div className="sa-modal__footer" style={{ justifyContent: 'center' }}>
            <button className="sa-btn sa-btn--outline" style={{ flex: 1 }} onClick={() => setShowReportModal(false)}>Close</button>
            <button className="sa-btn sa-btn--primary" style={{ flex: 1 }}>Download PDF</button>
          </div>
        </div>
      </IonModal>

      {/* 4. Delete Confirmation Modal */}
      <IonModal isOpen={showDeleteModal} onDidDismiss={() => setShowDeleteModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Confirm Delete</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowDeleteModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <p className="sa-modal__desc">
              Are you sure you want to delete <strong>{branchToDelete?.name}</strong>? This action will permanently remove the branch and all its associated data.
            </p>
          </div>
          <div className="sa-modal__footer" style={{ justifyContent: 'center', gap: '12px' }}>
            <button className="sa-btn sa-btn--outline" style={{ flex: 1 }} onClick={() => setShowDeleteModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--danger" style={{ flex: 1 }} onClick={handleConfirmDelete}>Confirm Delete</button>
          </div>
        </div>
      </IonModal>
      
    </IonPage>
  );
};

export default BranchesPage;
