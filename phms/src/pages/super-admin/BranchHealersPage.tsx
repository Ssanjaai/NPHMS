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
  IonButton,
  IonBackButton,
} from '@ionic/react';
import {
  chevronBackOutline,
  searchOutline,
  peopleOutline,
  medkitOutline,
  starOutline,
  mailOutline,
  callOutline,
  ellipsisHorizontalOutline,
} from 'ionicons/icons';
import { useHistory, useParams } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import './super-admin.css';

const BranchHealersPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const branchName = id ? decodeURIComponent(id) : 'Coastal Healing Center';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const healerData = [
    { id: 1, name: 'Dr. Aris Varma', specialty: 'Senior Psychotherapist', email: 'aris.v@phms.com', phone: '0876543210', patients: 24, rating: 4.9, joined: '2023-01-16', status: 'Active' },
    { id: 2, name: 'Maya Rose', specialty: 'Advanced Pranic Healer', email: 'maya.r@phms.com', phone: '0876543211', patients: 18, rating: 4.8, joined: '2023-02-20', status: 'Active' },
    { id: 3, name: 'Samuel Chen', specialty: 'Crystal Healing Specialist', email: 'samuel.c@phms.com', phone: '0876543212', patients: 15, rating: 4.7, joined: '2022-02-10', status: 'Active' },
    { id: 4, name: 'Lila Thorne', specialty: 'Basic Pranic Healer', email: 'lila.t@phms.com', phone: '0876543213', patients: 12, rating: 4.6, joined: '2023-04-05', status: 'Active' },
    { id: 5, name: 'Julian Mars', specialty: 'Advanced Pranic Healer', email: 'julian.m@phms.com', phone: '0876543214', patients: 10, rating: 4.5, joined: '2023-05-12', status: 'Inactive' },
    { id: 6, name: 'Sofia Bell', specialty: 'Pranic Psychotherapist', email: 'sofia.b@phms.com', phone: '0876543215', patients: 20, rating: 4.9, joined: '2023-06-01', status: 'Active' },
  ];

  const filteredHealers = healerData.filter(healer => {
    const matchesSearch = healer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      healer.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || healer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredHealers.length / itemsPerPage);
  const paginatedHealers = filteredHealers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref={ROUTES.SUPER_ADMIN.BRANCHES} text="" />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Branch Practitioners</IonTitle>
          <IonButtons slot="end">
            <div className="sa-page__toolbar-actions">
              <div className="sa-page__toolbar-avatar">SA</div>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          <div className="sa-page__header">
            <h1 className="sa-page__title">Medical Staff: {branchName}</h1>
            <p className="sa-page__subtitle">Overview of healers and their current patient assignments</p>
          </div>

          <div className="sa-stats sa-stats--3">
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Total Healers</div>
                <div className="sa-stat-card__value">12</div>
                <div className="sa-stat-card__detail">Fully Certified</div>
              </div>
              <div className="sa-stat-card__icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>
                <IonIcon icon={peopleOutline} />
              </div>
            </div>
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Avg Patients/Healer</div>
                <div className="sa-stat-card__value">15</div>
                <div className="sa-stat-card__detail">Optimal Load</div>
              </div>
              <div className="sa-stat-card__icon" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                <IonIcon icon={medkitOutline} />
              </div>
            </div>
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Top Rated</div>
                <div className="sa-stat-card__value">4.9</div>
                <div className="sa-stat-card__detail">Patient Satisfaction</div>
              </div>
              <div className="sa-stat-card__icon" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>
                <IonIcon icon={starOutline} />
              </div>
            </div>
          </div>

          <div className="sa-section" style={{ padding: '16px 24px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div className="sa-search" style={{ marginBottom: 0, maxWidth: '400px' }}>
                <IonIcon icon={searchOutline} />
                <input 
                  placeholder="Search by name or specialty..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f6fa', padding: '6px 12px', borderRadius: '8px', border: '1px solid #e8ecf1' }}>
                <IonIcon icon={peopleOutline} style={{ color: '#64748b', fontSize: '18px' }} />
                <select 
                  style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: '#1e293b', fontWeight: 500 }}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>
          </div>

          <div className="sa-section" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="sa-table-container">
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Healer Details</th>
                    <th>Specialty</th>
                    <th>Contact</th>
                    <th>Patients Handled</th>
                    <th>Joined</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedHealers.length > 0 ? (
                    paginatedHealers.map((healer) => (
                      <tr key={healer.id}>
                        <td>
                          <div className="sa-table__user">
                            <div className="sa-table__avatar sa-table__avatar--primary" style={{ width: '38px', height: '38px' }}>
                              {healer.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div className="sa-table__user-info">
                              <span className="sa-table__user-name">{healer.name}</span>
                              <span className="sa-table__user-email">ID: PH-2024-{healer.id}</span>
                            </div>
                          </div>
                        </td>
                        <td>{healer.specialty}</td>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748b' }}>
                              <IonIcon icon={mailOutline} style={{ fontSize: '14px' }} /> {healer.email}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748b' }}>
                              <IonIcon icon={callOutline} style={{ fontSize: '14px' }} /> {healer.phone}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div 
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--color-primary)' }}
                            onClick={() => history.push(ROUTES.SUPER_ADMIN.HEALER_PATIENTS.replace(':branchId', encodeURIComponent(branchName)).replace(':healerId', healer.name))}
                          >
                            <IonIcon icon={peopleOutline} style={{ fontSize: '18px' }} />
                            <span style={{ fontWeight: 700, fontSize: '16px', textDecoration: 'underline' }}>{healer.patients}</span>
                          </div>
                        </td>
                        <td>{healer.joined}</td>
                        <td>
                          <span className={`sa-badge ${healer.status.toLowerCase() === 'active' ? 'sa-badge--active' : 'sa-badge--inactive'}`}>
                            {healer.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '0' }}>
                        <div className="sa-empty-state" style={{ border: 'none', background: 'transparent', margin: '0' }}>
                          <div className="sa-empty-state__icon">
                            <IonIcon icon={peopleOutline} />
                          </div>
                          <h3 className="sa-empty-state__title">No healers found</h3>
                          <p className="sa-empty-state__text">
                            {searchQuery 
                              ? `No practitioners matching "${searchQuery}" were found.` 
                              : `There are currently no healers matching the selected filters.`}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="sa-table__footer">
              <div className="sa-pagination__controls" style={{ order: 2 }}>
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
                  <IonIcon icon={chevronBackOutline} style={{ transform: 'rotate(180deg)' }} />
                </button>
              </div>
              <div className="sa-pagination__info" style={{ order: 1 }}>
                Showing {filteredHealers.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredHealers.length)} of {filteredHealers.length} healers
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BranchHealersPage;
