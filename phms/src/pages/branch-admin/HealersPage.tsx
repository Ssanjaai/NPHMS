import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonIcon,
} from '@ionic/react';
import {
  searchOutline,
  eyeOutline,
  pencilOutline,
  notificationsOutline,
  settingsOutline,
  downloadOutline,
  filterOutline,
  addOutline,
  trendingUpOutline,
  alertCircleOutline,
  starOutline,
  star,
  checkmarkCircleOutline,
  leafOutline,
  flashOutline,
  heartOutline,
  schoolOutline,
  calendarOutline,
  peopleOutline,
  medkitOutline,
  closeOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../../store/auth.store';
import './branch-admin.css';

// ─── Data types ─────────────────────────────────────────────────────────────

interface HealerRecord {
  id: string;
  name: string;
  initials: string;
  avatarBg: string;
  email: string;
  specialization: string;
  specializationColor: string;
  specializationBg: string;
  branch: string;
  activePatients: number;
  totalPatients: number;
  status: 'ACTIVE' | 'INACTIVE';
  // detail fields
  phone: string;
  joinDate: string;
  experience: string;
  qualification: string;
  sessions: number;
  rating: number;
  nextSession: string;
  bio: string;
}

interface PatientProgressItem {
  label: string;
  sub: string;
  pct: number;
  color: string;
}

interface WorkloadItem {
  healer: string;
  branch: string;
  patients: number;
  max: number;
  loadLevel: 'High Load' | 'Optimal';
  barColor: string;
  badgeColor: string;
  badgeBg: string;
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const HEALERS: HealerRecord[] = [
  {
    id: 'H-2091',
    name: 'Dr. David Anselm',
    initials: 'DA',
    avatarBg: '#0f5b4b',
    email: 'david.a@phms.com',
    specialization: 'Stress Healing',
    specializationColor: '#065f46',
    specializationBg: '#d1fae5',
    branch: 'Main Branch',
    activePatients: 12,
    totalPatients: 458,
    status: 'ACTIVE',
    phone: '+91 98765 43210',
    joinDate: 'Jan 2021',
    experience: '7 years',
    qualification: 'Master Healer (M1)',
    sessions: 940,
    rating: 4.9,
    nextSession: 'Today, 3:00 PM',
    bio: 'Specialises in stress management, corporate burnout recovery, and psychosomatic healing using advanced Pranic techniques.',
  },
  {
    id: 'H-2104',
    name: 'Elena Kovic',
    initials: 'EK',
    avatarBg: '#1e40af',
    email: 'e.kovic@phms.com',
    specialization: 'Energy Cleansing',
    specializationColor: '#065f46',
    specializationBg: '#d1fae5',
    branch: 'North Wing',
    activePatients: 8,
    totalPatients: 212,
    status: 'ACTIVE',
    phone: '+91 98765 43211',
    joinDate: 'Mar 2022',
    experience: '4 years',
    qualification: 'Energy Cleansing Specialist',
    sessions: 520,
    rating: 4.8,
    nextSession: 'Tomorrow, 10:00 AM',
    bio: 'Expert in aura cleansing, chakra balancing and advanced pranic healing for emotional trauma recovery.',
  },
  {
    id: 'H-1988',
    name: 'Marcus Jensen',
    initials: 'MJ',
    avatarBg: '#7c3aed',
    email: 'm.jensen@phms.com',
    specialization: 'Grief Therapy',
    specializationColor: '#475569',
    specializationBg: '#f1f5f9',
    branch: 'South Center',
    activePatients: 0,
    totalPatients: 89,
    status: 'INACTIVE',
    phone: '+91 98765 43213',
    joinDate: 'Aug 2019',
    experience: '9 years',
    qualification: 'Trauma Relief Certified',
    sessions: 680,
    rating: 4.6,
    nextSession: 'On Leave',
    bio: 'Handles cases of grief, loss, PTSD, and trauma recovery with compassionate pranic techniques and emotional first aid.',
  },
];

const PATIENT_PROGRESS: PatientProgressItem[] = [
  { label: 'Chronic Back Pain Path', sub: '12 Active Cases • Dr. Anselm', pct: 75, color: '#0f5b4b' },
  { label: 'Post-Trauma Recovery', sub: '8 Active Cases • Elena Kovic', pct: 42, color: '#0f5b4b' },
];

const WORKLOAD: WorkloadItem[] = [
  { healer: 'Healer A (Main Branch)', branch: 'Main Branch', patients: 15, max: 15, loadLevel: 'High Load', barColor: '#ef4444', badgeColor: '#b91c1c', badgeBg: '#fee2e2' },
  { healer: 'Healer B (North Wing)', branch: 'North Wing', patients: 8, max: 15, loadLevel: 'Optimal', barColor: '#10b981', badgeColor: '#065f46', badgeBg: '#d1fae5' },
  { healer: 'Healer C (South Center)', branch: 'South Center', patients: 9, max: 15, loadLevel: 'Optimal', barColor: '#10b981', badgeColor: '#065f46', badgeBg: '#d1fae5' },
];

const SESSION_BARS = [
  { month: 'JAN', main: 50, north: 38, south: 26 },
  { month: 'FEB', main: 62, north: 45, south: 30 },
  { month: 'MAR', main: 70, north: 55, south: 38 },
  { month: 'APR', main: 65, north: 52, south: 40 },
  { month: 'MAY', main: 88, north: 70, south: 50 },
  { month: 'JUN', main: 72, north: 60, south: 44 },
  { month: 'JUL', main: 68, north: 55, south: 40 },
];

const QUALIFICATIONS = [
  {
    icon: leafOutline,
    iconBg: '#d1fae5',
    iconColor: '#065f46',
    title: 'Master Healer (M1)',
    sub: 'Valid until Dec 2025',
    tags: ['Pranic Psychotherapy', 'Arhatic Yoga'],
  },
  {
    icon: flashOutline,
    iconBg: '#e0f2fe',
    iconColor: '#0369a1',
    title: 'Energy Cleansing Specialist',
    sub: 'Advanced Level II',
    tags: ['Chakra Balancing', 'Aura Scanning'],
  },
  {
    icon: heartOutline,
    iconBg: '#fee2e2',
    iconColor: '#b91c1c',
    title: 'Trauma Relief Certified',
    sub: 'Clinical Residency',
    tags: ['PTSD Care', 'Grief Support'],
  },
  {
    icon: schoolOutline,
    iconBg: '#f1f5f9',
    iconColor: '#475569',
    title: 'Associate Healer',
    sub: 'Supervised Practice',
    tags: ['Foundation Course'],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

const HealersPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'registry' | 'add' | 'analytics'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHealer, setSelectedHealer] = useState<HealerRecord | null>(null);

  // ── Dynamic identity ──────────────────────────────────────────────────────
  const userName = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Aria Seraphina';
  const userInitials = user
    ? `${user.name?.[0] || user.firstName?.[0] || 'B'}${user.name?.split(' ')?.[1]?.[0] || user.lastName?.[0] || 'A'}`.toUpperCase()
    : 'BA';
  const rawBranch = typeof user?.branch === 'object' && user?.branch !== null
    ? (user.branch as any).name
    : (user?.branch || 'Mumbai');
  const branchName = rawBranch.toLowerCase().includes('branch') ? rawBranch : `${rawBranch} Branch`;

  // ── Filtered rows ─────────────────────────────────────────────────────────
  const filtered = HEALERS.filter(h =>
    h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.branch.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = HEALERS.filter(h => h.status === 'ACTIVE').length;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    return Array.from({ length: 5 }).map((_, i) => (
      <IonIcon key={i} icon={i < full ? star : starOutline} style={{ color: '#fbbf24', fontSize: '13px' }} />
    ));
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <IonPage className="sa-page">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>

          {/* Title + Tabs inline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '0 16px', flex: 1 }}>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ba-color-text-main)', whiteSpace: 'nowrap' }}>
              Healer Management
            </span>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', borderRadius: '8px', padding: '3px' }}>
              {(['overview', 'registry', 'add', 'analytics'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: activeTab === tab ? '#ffffff' : 'transparent',
                    color: activeTab === tab ? 'var(--ba-color-primary)' : '#64748b',
                    boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.15s ease',
                    textTransform: 'capitalize',
                  }}
                >
                  {tab === 'add' ? 'Add New' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px' }}>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <IonIcon icon={searchOutline} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '15px' }} />
              <input
                type="text"
                placeholder="Search healers, IDs..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ padding: '7px 12px 7px 32px', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '13px', background: '#f8fafc', outline: 'none', width: '200px' }}
              />
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b', position: 'relative' }}>
              <IonIcon icon={notificationsOutline} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }} />
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#64748b' }}>
              <IonIcon icon={settingsOutline} />
            </button>
            {/* Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ba-color-text-main)' }}>{userName}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>{branchName}</div>
              </div>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--ba-color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>
                {userInitials}
              </div>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content" fullscreen>
        <div className="sa-page__body">

          {/* ── METRIC CARDS ─────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '14px', marginBottom: '24px' }}>
            {/* 1 - Total Healers */}
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Total Healers</div>
                <div className="sa-stat-card__value">142</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} />
                  <span>+12% from last month</span>
                </div>
              </div>
            </div>
            {/* 2 - Active Healers */}
            <div className="sa-stat-card" style={{ '--stat-color': '#10b981' } as any}>
              <div>
                <div className="sa-stat-card__label">Active Healers</div>
                <div className="sa-stat-card__value">{activeCount > 0 ? 128 : activeCount}</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={checkmarkCircleOutline} style={{ color: '#10b981' }} />
                  <span>90.1% availability rate</span>
                </div>
              </div>
            </div>
            {/* 3 - Healing Sessions */}
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Healing Sessions</div>
                <div className="sa-stat-card__value">2,840</div>
                <div className="sa-stat-card__detail">
                  <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} />
                  <span>Monthly peak reached</span>
                </div>
              </div>
            </div>
            {/* 4 - Assigned Patients */}
            <div className="sa-stat-card">
              <div>
                <div className="sa-stat-card__label">Assigned Patients</div>
                <div className="sa-stat-card__value">856</div>
                <div className="sa-stat-card__detail">
                  <span style={{ color: '#64748b' }}>Avg. 6.6 patients/healer</span>
                </div>
              </div>
            </div>
            {/* 5 - Pending Follow-Ups */}
            <div className="sa-stat-card" style={{ borderLeftColor: '#ef4444' } as any}>
              <div style={{ flex: 1 }}>
                <div className="sa-stat-card__label">Pending Follow-Ups</div>
                <div className="sa-stat-card__value" style={{ color: '#ef4444' }}>14</div>
                <div className="sa-stat-card__detail" style={{ color: '#b91c1c' }}>
                  <IonIcon icon={alertCircleOutline} style={{ color: '#ef4444' }} />
                  <span>Urgent attention required</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── HEALER REGISTRY ───────────────────────────────────────────── */}
          <div className="sa-section" style={{ marginBottom: '20px' }}>
            <div className="sa-section__header">
              <div>
                <h2 className="sa-section__title">Healer Registry</h2>
                <p className="sa-section__subtitle">Manage active certifications and workloads</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="sa-btn sa-btn--outline" style={{ fontSize: '13px', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IonIcon icon={filterOutline} /> Filter
                </button>
                <button className="sa-btn sa-btn--outline" style={{ fontSize: '13px', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IonIcon icon={downloadOutline} /> Export CSV
                </button>
                <button className="sa-btn sa-btn--primary" style={{ fontSize: '13px', padding: '7px 14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IonIcon icon={addOutline} /> Add Healer
                </button>
              </div>
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>HEALER ID</th>
                    <th>HEALER NAME</th>
                    <th>CONTACT INFO</th>
                    <th>SPECIALIZATION</th>
                    <th>BRANCH</th>
                    <th>ACTIVE / TOTAL</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'center' }}>ACTI.</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(healer => (
                    <tr key={healer.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedHealer(healer)}>
                      <td style={{ fontWeight: 700, color: 'var(--ba-color-primary)', fontSize: '13px' }}>{healer.id}</td>
                      <td>
                        <div className="sa-table__user">
                          <div
                            className="sa-table__avatar"
                            style={{ background: healer.avatarBg, color: '#fff', fontSize: '13px', fontWeight: 700, width: '34px', height: '34px' }}
                          >
                            {healer.initials}
                          </div>
                          <div className="sa-table__user-info">
                            <span className="sa-table__user-name">{healer.name}</span>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '13px', color: '#475569' }}>{healer.email}</td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: 700,
                          background: healer.specializationBg,
                          color: healer.specializationColor,
                        }}>
                          {healer.specialization}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px', color: '#475569' }}>{healer.branch}</td>
                      <td style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                        {healer.activePatients} / {healer.totalPatients}
                      </td>
                      <td>
                        <span className={`sa-badge ${healer.status === 'ACTIVE' ? 'sa-badge--active' : 'sa-badge--inactive'}`}>
                          {healer.status}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}
                          onClick={e => e.stopPropagation()}>
                          <button
                            className="sa-table__action-btn sa-action-btn--view"
                            title="View details"
                            onClick={e => { e.stopPropagation(); setSelectedHealer(healer); }}
                          >
                            <IonIcon icon={eyeOutline} />
                          </button>
                          <button
                            className="sa-table__action-btn sa-action-btn--edit"
                            title="Edit"
                            onClick={e => e.stopPropagation()}
                          >
                            <IonIcon icon={pencilOutline} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                        No healers found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>Showing 1–{filtered.length} of 142 healers</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button className="sa-pagination__btn" disabled><IonIcon icon={closeOutline} style={{ transform: 'rotate(180deg)' }} /></button>
                <button className="sa-pagination__btn sa-pagination__btn--active">1</button>
                <button className="sa-pagination__btn">2</button>
                <button className="sa-pagination__btn">3</button>
                <button className="sa-pagination__btn"><IonIcon icon={closeOutline} style={{ transform: 'rotate(0deg)' }} /></button>
              </div>
            </div>
          </div>

          {/* ── MIDDLE ROW: Patient Progress + Workload ───────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>

            {/* Patient Progress Overview */}
            <div className="sa-section" style={{ margin: 0 }}>
              <h3 className="sa-section__title" style={{ fontSize: '16px', marginBottom: '4px' }}>Patient Progress Overview</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
                {PATIENT_PROGRESS.map((item, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{item.label}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{item.sub}</div>
                      </div>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '50%',
                        background: `conic-gradient(${item.color} ${item.pct * 3.6}deg, #e2e8f0 0deg)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontSize: '11px', fontWeight: 800, color: '#1e293b',
                        boxShadow: 'inset 0 0 0 8px #fff',
                      }}>
                        {item.pct}%
                      </div>
                    </div>
                    <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${item.pct}%`, background: item.color, borderRadius: '9999px' }} />
                    </div>
                  </div>
                ))}
              </div>
              <button className="sa-btn sa-btn--outline" style={{ width: '100%', marginTop: '20px', justifyContent: 'center', fontSize: '13px' }}>
                View All Assignments
              </button>
            </div>

            {/* Workload Distribution */}
            <div className="sa-section" style={{ margin: 0 }}>
              <h3 className="sa-section__title" style={{ fontSize: '16px', marginBottom: '4px' }}>Workload Distribution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '16px' }}>
                {WORKLOAD.map((w, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{w.healer}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700,
                          color: w.badgeColor, background: w.badgeBg,
                        }}>{w.loadLevel}</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{w.patients} Pat.</span>
                      </div>
                    </div>
                    <div style={{ height: '7px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(w.patients / w.max) * 100}%`, background: w.barColor, borderRadius: '9999px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── BOTTOM ROW: Session Performance + Patient Satisfaction ──── */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>

            {/* Session Performance Bar Chart */}
            <div className="sa-section" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <div>
                  <h3 className="sa-section__title" style={{ fontSize: '16px', marginBottom: '2px' }}>Session Performance</h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>Comparison of healing sessions by branch</p>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>Last 30 Days</span>
              </div>

              {/* Bar chart */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '140px', marginTop: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                {SESSION_BARS.map((bar, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ width: '100%', display: 'flex', gap: '2px', alignItems: 'flex-end', height: '100%', justifyContent: 'center' }}>
                      {/* Main branch bar */}
                      <div style={{ width: '30%', height: `${bar.main}%`, background: '#0f5b4b', borderRadius: '3px 3px 0 0', minHeight: '4px' }} />
                      {/* North wing bar */}
                      <div style={{ width: '30%', height: `${bar.north}%`, background: '#4ade80', borderRadius: '3px 3px 0 0', minHeight: '4px' }} />
                      {/* South center bar */}
                      <div style={{ width: '30%', height: `${bar.south}%`, background: '#a3e635', borderRadius: '3px 3px 0 0', minHeight: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* X-axis labels */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                {SESSION_BARS.map((bar, i) => (
                  <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '10px', fontWeight: 600, color: '#94a3b8' }}>{bar.month}</div>
                ))}
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                {[{ color: '#0f5b4b', label: 'Main Branch' }, { color: '#4ade80', label: 'North Wing' }, { color: '#a3e635', label: 'South Center' }].map((l, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: l.color }} />
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Satisfaction */}
            <div className="sa-section" style={{ margin: 0 }}>
              <h3 className="sa-section__title" style={{ fontSize: '16px', marginBottom: '16px' }}>Patient Satisfaction</h3>

              {/* Donut circle */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: 'conic-gradient(#0f5b4b 0deg 328deg, #e2e8f0 328deg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: 'inset 0 0 0 20px #fff',
                  position: 'relative',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#1e293b', lineHeight: 1 }}>4.9</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>OUT OF 5</div>
                  </div>
                </div>
                <div style={{ marginTop: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Excellent Performance</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px', lineHeight: 1.4 }}>Based on 1,240 verified patient<br />reviews across all branches.</div>
                </div>
              </div>

              {/* Rating breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { label: 'Staff Professionalism', rating: 4.9 },
                  { label: 'Healing Effectiveness', rating: 4.8 },
                  { label: 'Facility Ambiance', rating: 5.0 },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#475569' }}>{item.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {renderStars(item.rating)}
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginLeft: '4px' }}>{item.rating.toFixed(1)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── QUALIFICATIONS SECTION ─────────────────────────────────────── */}
          <div className="sa-section" style={{ marginBottom: '24px' }}>
            <h3 className="sa-section__title" style={{ fontSize: '16px', marginBottom: '20px' }}>Healer Qualifications & Specializations</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}>
              {QUALIFICATIONS.map((q, i) => (
                <div key={i} style={{ border: '1px solid #f1f5f9', borderRadius: '12px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', transition: 'box-shadow 0.2s', cursor: 'default' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: q.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IonIcon icon={q.icon} style={{ fontSize: '20px', color: q.iconColor }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>{q.title}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{q.sub}</div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {q.tags.map((tag, j) => (
                      <span key={j} style={{ padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600, background: '#f1f5f9', color: '#475569' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </IonContent>

      {/* ── HEALER DETAIL MODAL (click View on any row) ─────────────────── */}
      {selectedHealer && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
          }}
          onClick={() => setSelectedHealer(null)}
        >
          <div
            style={{
              background: '#fff', borderRadius: '20px', padding: '32px', maxWidth: '620px', width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative', maxHeight: '90vh', overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedHealer(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: '#f1f5f9', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#475569' }}
            >
              <IonIcon icon={closeOutline} />
            </button>

            {/* Healer header */}
            <div style={{ display: 'flex', gap: '18px', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{
                width: '68px', height: '68px', borderRadius: '50%', background: selectedHealer.avatarBg,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', fontWeight: 800, flexShrink: 0,
              }}>
                {selectedHealer.initials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>{selectedHealer.name}</div>
                <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>{selectedHealer.id} • {selectedHealer.branch}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: 700, background: selectedHealer.specializationBg, color: selectedHealer.specializationColor }}>
                    {selectedHealer.specialization}
                  </span>
                  <span className={`sa-badge ${selectedHealer.status === 'ACTIVE' ? 'sa-badge--active' : 'sa-badge--inactive'}`}>
                    {selectedHealer.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', borderLeft: '4px solid var(--ba-color-primary)' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>{selectedHealer.bio}</p>
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              {[
                { label: 'Email', value: selectedHealer.email, icon: null },
                { label: 'Phone', value: selectedHealer.phone, icon: null },
                { label: 'Joined', value: selectedHealer.joinDate, icon: calendarOutline },
                { label: 'Experience', value: selectedHealer.experience, icon: null },
                { label: 'Qualification', value: selectedHealer.qualification, icon: schoolOutline },
                { label: 'Total Sessions', value: String(selectedHealer.sessions), icon: null },
              ].map((info, i) => (
                <div key={i} style={{ background: '#f8fafc', borderRadius: '10px', padding: '12px 14px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8', marginBottom: '4px' }}>{info.label}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>{info.value}</div>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ba-color-primary)' }}>{selectedHealer.activePatients}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Active Patients</div>
              </div>
              <div style={{ textAlign: 'center', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b' }}>{selectedHealer.totalPatients}</div>
                <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>Total Patients</div>
              </div>
              <div style={{ textAlign: 'center', border: '1px solid #f1f5f9', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#fbbf24' }}>{selectedHealer.rating}</div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '4px' }}>
                  {renderStars(selectedHealer.rating)}
                </div>
              </div>
            </div>

            {/* Next session */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: selectedHealer.status === 'ACTIVE' ? '#e2fbf4' : '#f1f5f9', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px' }}>
              <IonIcon icon={calendarOutline} style={{ fontSize: '20px', color: selectedHealer.status === 'ACTIVE' ? 'var(--ba-color-primary)' : '#94a3b8' }} />
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#94a3b8' }}>Next Session</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{selectedHealer.nextSession}</div>
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="sa-btn sa-btn--outline" style={{ flex: 1, justifyContent: 'center', fontSize: '13px' }}>
                <IonIcon icon={pencilOutline} /> Edit Profile
              </button>
              <button className="sa-btn sa-btn--primary" style={{ flex: 1, justifyContent: 'center', fontSize: '13px' }}>
                <IonIcon icon={peopleOutline} /> View Patients
              </button>
              <button className="sa-btn sa-btn--outline" style={{ flex: 1, justifyContent: 'center', fontSize: '13px' }}>
                <IonIcon icon={medkitOutline} /> Sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </IonPage>
  );
};

export default HealersPage;
