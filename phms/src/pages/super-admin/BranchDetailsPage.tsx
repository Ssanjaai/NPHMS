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
  homeOutline,
  locationOutline,
  callOutline,
  calendarOutline,
  peopleOutline,
  barChartOutline,
  flashOutline,
  informationCircleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  timeOutline,
} from 'ionicons/icons';
import { useParams, useHistory } from 'react-router-dom';
import { ROUTES } from '../../constants/routes.constant';
import './super-admin.css';

const BranchDetailsPage: React.FC = () => {
  const history = useHistory();
  const { id } = useParams<{ id: string }>();
  const branchName = id ? decodeURIComponent(id) : 'Uptown Sanctuary';

  // State for branch data
  const [branchData, setBranchData] = useState<any>({
    name: branchName,
    region: 'Northern Region',
    admin: 'John Admin',
    phone: '0876543210',
    est: '2023-01-16',
    address: '123 Healing Road, Northern District, City Plaza, 110045',
    details: 'The Uptown Sanctuary is a premier healing branch specializing in advanced pranic protocols. Established to serve the growing community in the northern region, it features state-of-the-art meditation halls and multiple dedicated private healing rooms. Our mission is to provide a serene space for recovery and spiritual growth.',
    stats: [
      { label: 'Total Sessions', value: '1,248', icon: flashOutline },
      { label: 'Monthly Revenue', value: '₹145k', icon: barChartOutline },
      { label: 'Staff Count', value: '12', icon: peopleOutline },
      { label: 'Active Patients', value: '86', icon: peopleOutline }
    ]
  });
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  useEffect(() => {
    const savedBranches = localStorage.getItem('ph_branches');
    if (savedBranches) {
      const branches = JSON.parse(savedBranches);
      const found = branches.find((b: any) => b.name === branchName);
      if (found) {
        setStatus(found.status === 'active' ? 'active' : 'inactive');
        // Merge found data with defaults/stats
        setBranchData((prev: any) => ({
          ...prev,
          ...found,
          // If the branch from localStorage doesn't have address or details, keep the defaults
          address: found.address || prev.address,
          details: found.details || prev.details,
          phone: found.phone || prev.phone,
          region: found.region || prev.region,
        }));
      }
    }
  }, [branchName]);

  const toggleStatus = () => {
    const newStatus = status === 'active' ? 'inactive' : 'active';
    setStatus(newStatus);

    // Persist to localStorage
    const savedBranches = localStorage.getItem('ph_branches');
    if (savedBranches) {
      const branches = JSON.parse(savedBranches);
      const updated = branches.map((b: any) =>
        b.name === branchName ? { ...b, status: newStatus } : b
      );
      localStorage.setItem('ph_branches', JSON.stringify(updated));
    }
  };

  const isActive = status === 'active';

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/super-admin/branches" text="" />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Branch Overview</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          {/* Header Section */}
          <div className="sa-page__header">
            <div className="sa-header-main" style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div className="sa-branch-card__icon sa-branch-card__icon--large" style={{ flexShrink: 0 }}>
                <IonIcon icon={homeOutline} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%', marginBottom: '4px' }}>
                  <h1 className="sa-page__title" style={{ margin: 0, lineHeight: 1.2 }}>{branchData.name}</h1>
                  <button
                    onClick={toggleStatus}
                    className={`sa-status-pill ${isActive ? 'sa-status-pill--active' : 'sa-status-pill--inactive'}`}
                  >
                    <IonIcon icon={isActive ? checkmarkCircleOutline : closeCircleOutline} />
                    {isActive ? 'Active' : 'Inactive'}
                  </button>
                </div>
                <div className="sa-page__subtitle sa-page__subtitle--responsive">
                  <span className="sa-subtitle-item">
                    <IonIcon icon={locationOutline} /> {branchData.region}
                  </span>
                  <span className="sa-subtitle-separator">•</span>
                  <span className="sa-subtitle-item">Established {branchData.est}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="sa-stats sa-stats--4">
            {branchData.stats.map((stat: { label: string; value: string; icon: string }, i: number) => {
              const isSessionStat = stat.label === 'Total Sessions';
              const isRevenueStat = stat.label === 'Monthly Revenue';
              const isStaffStat = stat.label === 'Staff Count';
              
              const handleClick = () => {
                if (isSessionStat) {
                  history.push(ROUTES.SUPER_ADMIN.SESSION_HISTORY.replace(':id', encodeURIComponent(branchName)));
                } else if (isRevenueStat) {
                  history.push(ROUTES.SUPER_ADMIN.BRANCH_REVENUE.replace(':id', encodeURIComponent(branchName)));
                } else if (isStaffStat) {
                  history.push(ROUTES.SUPER_ADMIN.BRANCH_HEALERS.replace(':id', encodeURIComponent(branchName)));
                }
              };

              return (
                <div 
                  className={`sa-stat-card ${(isSessionStat || isRevenueStat || isStaffStat) ? 'sa-stat-card--interactive' : ''}`} 
                  key={i}
                  onClick={handleClick}
                  style={(isSessionStat || isRevenueStat || isStaffStat) ? { cursor: 'pointer' } : {}}
                >
                  <div>
                    <div className="sa-stat-card__label">{stat.label}</div>
                    <div className="sa-stat-card__value" style={{ fontSize: '24px' }}>{stat.value}</div>
                  </div>
                  <div className="sa-stat-card__icon">
                    <IonIcon icon={stat.icon} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="sa-grid-2">
            <div>
              {/* Branch Overview */}
              <div className="sa-section">
                <div className="sa-section__header">
                  <h2 className="sa-section__title">
                    <IonIcon icon={informationCircleOutline} style={{ marginRight: '8px', color: 'var(--color-primary)' }} />
                    About this Sanctuary
                  </h2>
                </div>
                <p style={{ lineHeight: '1.6', color: 'var(--color-text-secondary)', fontSize: '15px' }}>
                  {branchData.details}
                </p>
              </div>

              {/* Location & Contact */}
              <div className="sa-section">
                <div className="sa-section__header">
                  <h2 className="sa-section__title">
                    <IonIcon icon={locationOutline} style={{ marginRight: '8px', color: 'var(--color-primary)' }} />
                    Location &amp; Contact
                  </h2>
                </div>
                <div className="sa-settings__form-grid">
                  <div className="sa-settings__form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="sa-settings__label">Physical Address</label>
                    <p style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 500, color: 'var(--color-text-primary)' }}>{branchData.address}</p>
                  </div>
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Contact Number</label>
                    <div className="sa-branch-card__meta-item" style={{ fontSize: '15px', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                      <IonIcon icon={callOutline} style={{ color: 'var(--color-primary)' }} /> {branchData.phone}
                    </div>
                  </div>
                  <div className="sa-settings__form-group">
                    <label className="sa-settings__label">Geographic Region</label>
                    <div className="sa-branch-card__meta-item" style={{ fontSize: '15px', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                      <IonIcon icon={locationOutline} style={{ color: 'var(--color-primary)' }} /> {branchData.region}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              {/* Administration */}
              <div className="sa-section">
                <div className="sa-section__header">
                  <h2 className="sa-section__title">Administration</h2>
                </div>
                <div className="sa-branch-card__admin" style={{ cursor: 'default' }}>
                  <div>
                    <div className="sa-branch-card__admin-label">Primary Branch Admin</div>
                    <div className="sa-branch-card__admin-name" style={{ fontSize: '16px' }}>{branchData.admin}</div>
                  </div>
                  <div className="sa-page__toolbar-avatar" style={{ background: 'var(--color-primary-dark)' }}>
                    {branchData.admin.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '12px' }}>
                  Admin is responsible for practitioner attendance, financial reconciliation, and branch-level patient reporting.
                </p>
              </div>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BranchDetailsPage;
