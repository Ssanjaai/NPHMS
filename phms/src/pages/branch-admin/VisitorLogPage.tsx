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
  useIonViewWillEnter,
} from '@ionic/react';
import {
  peopleOutline,
  timeOutline,
  checkmarkCircleOutline,
  calendarOutline,
  documentTextOutline,
  downloadOutline,
  addOutline,
  chevronBackOutline,
  chevronForwardOutline,
  radioOutline,
  filterOutline,
  logoWhatsapp,
  logInOutline,
  logOutOutline,
  searchOutline,
  closeOutline,
  alertCircleOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../../store/auth.store';
import { useHistory } from 'react-router-dom';
import './branch-admin.css';

interface Visitor {
  id: number;
  visitorId: string; // VIS-0001
  name: string;
  type: 'Walk-in' | 'Meditation' | 'Session' | 'Camp' | 'Healer';
  contact: string;
  entry: string;
  exit: string;
  duration: string;
  status: 'Inside' | 'Exited';
  dateStr: string;
}

const VisitorLogPage: React.FC = () => {
  const { user } = useAuthStore();
  const history = useHistory();
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  // Advanced Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterDate, setFilterDate] = useState(''); // Default empty to display all logs
  const [filterStatus, setFilterStatus] = useState<'All' | 'Inside' | 'Exited'>('All');

  // Export Modal States
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'PDF' | 'Excel' | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportState, setExportState] = useState<'idle' | 'generating' | 'completed'>('idle');

  // Helper sequential generator for VIS-XXXX
  const genVisId = (existing: Visitor[]) => {
    const maxNum = existing.reduce((max, v) => {
      const match = v.visitorId?.match(/VIS-(\d+)/);
      return match ? Math.max(max, parseInt(match[1], 10)) : max;
    }, 0);
    return `VIS-${String(maxNum + 1).padStart(4, '0')}`;
  };

  // Initial mock data that EXACTLY matches the BRD categories!
  const MOCK_VISITORS: Visitor[] = [
    {
      id: 1,
      visitorId: 'VIS-0001',
      name: 'Ananya Sharma',
      type: 'Meditation',
      contact: '+91 98765 43210',
      entry: '08:15 AM',
      exit: '—',
      duration: '2h 15m',
      status: 'Inside',
      dateStr: '2026-10-23',
    },
    {
      id: 2,
      visitorId: 'VIS-0002',
      name: 'Rahul Prasad',
      type: 'Session',
      contact: '+91 91234 56789',
      entry: '09:30 AM',
      exit: '10:45 AM',
      duration: '1h 15m',
      status: 'Exited',
      dateStr: '2026-10-23',
    },
    {
      id: 3,
      visitorId: 'VIS-0003',
      name: 'Meera Kapoor',
      type: 'Walk-in',
      contact: '+91 99887 76655',
      entry: '10:05 AM',
      exit: '—',
      duration: '25m',
      status: 'Inside',
      dateStr: '2026-10-23',
    },
    {
      id: 4,
      visitorId: 'VIS-0004',
      name: 'Vikram Roy',
      type: 'Camp',
      contact: '+91 98123 45678',
      entry: '10:30 AM',
      exit: '—',
      duration: '15m',
      status: 'Inside',
      dateStr: '2026-10-23',
    },
    {
      id: 5,
      visitorId: 'VIS-0005',
      name: 'Dr. Priya Varma',
      type: 'Healer',
      contact: '+91 98760 12345',
      entry: '07:45 AM',
      exit: '—',
      duration: '2h 45m',
      status: 'Inside',
      dateStr: '2026-10-23',
    },
  ];

  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const cached = localStorage.getItem('phms_visitor_logs');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return MOCK_VISITORS;
      }
    }
    localStorage.setItem('phms_visitor_logs', JSON.stringify(MOCK_VISITORS));
    return MOCK_VISITORS;
  });

  useIonViewWillEnter(() => {
    const cached = localStorage.getItem('phms_visitor_logs');
    if (cached) {
      try {
        setVisitors(JSON.parse(cached));
      } catch (e) {
        // ignore
      }
    }
  });

  useEffect(() => {
    localStorage.setItem('phms_visitor_logs', JSON.stringify(visitors));
  }, [visitors]);

  // Modal State for New Entry
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    contact: '',
    type: 'Session' as 'Walk-in' | 'Meditation' | 'Session' | 'Camp' | 'Healer',
  });

  const handleCheckIn = () => {
    if (!newVisitor.name || !newVisitor.contact) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const added: Visitor = {
      id: Date.now(),
      visitorId: genVisId(visitors),
      name: newVisitor.name,
      type: newVisitor.type,
      contact: newVisitor.contact,
      entry: formattedTime,
      exit: '—',
      duration: '5m',
      status: 'Inside',
      dateStr: now.toISOString().split('T')[0],
    };

    setVisitors([added, ...visitors]);
    setNewVisitor({ name: '', contact: '', type: 'Session' });
    setShowCheckInModal(false);
  };

  const handleCheckOut = (id: number) => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setVisitors(
      visitors.map((v) =>
        v.id === id
          ? {
              ...v,
              status: 'Exited',
              exit: formattedTime,
              duration: '1h 0m', // simulated duration
            }
          : v
      )
    );
  };

  // Toast notification helper
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Interactive Exporter progress trigger
  const handleExportReport = (format: 'PDF' | 'Excel') => {
    setExportFormat(format);
    setExportProgress(0);
    setExportState('generating');
    setShowExportModal(true);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 15) + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setExportProgress(100);
        setTimeout(() => {
          setExportState('completed');
          triggerToast(`${format} statement compiled and cached successfully!`);
        }, 300);
      } else {
        setExportProgress(progress);
      }
    }, 120);
  };

  // Dynamic stats calculation using BRD baselines + live added check-ins today
  const todayStr = new Date().toISOString().split('T')[0];
  const liveWalkins = visitors.filter(v => v.type === 'Walk-in' && v.dateStr === todayStr).length;
  const liveMeditation = visitors.filter(v => v.type === 'Meditation' && v.dateStr === todayStr).length;
  const liveSessions = visitors.filter(v => v.type === 'Session' && v.dateStr === todayStr).length;
  const liveCamp = visitors.filter(v => v.type === 'Camp' && v.dateStr === todayStr).length;
  const liveHealers = visitors.filter(v => v.type === 'Healer' && v.dateStr === todayStr).length;

  const countWalkins = 12 + liveWalkins;
  const countMeditation = 8 + liveMeditation;
  const countSessions = 20 + liveSessions;
  const countCamp = 3 + liveCamp;
  const countHealers = 2 + liveHealers;

  // Advanced query filtering logic
  const filteredVisitors = visitors.filter((v) => {
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.contact.includes(searchQuery) ||
      (v.visitorId || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'All' || v.type === filterType;
    const matchesDate = !filterDate || v.dateStr === filterDate;
    const matchesStatus = filterStatus === 'All' || v.status === filterStatus;

    return matchesSearch && matchesType && matchesDate && matchesStatus;
  });

  const activeVisitorsInsideCount = visitors.filter((v) => v.status === 'Inside').length;

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Daily Visitor Log</IonTitle>
          <IonButtons slot="end">
            <button className="sa-page__toolbar-avatar">BA</button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          {/* Header Info */}
          <div className="vl-header">
            <div className="bf-breadcrumb">Daily Visitor Log</div>
            <div className="bf-header-row">
              <div className="vl-title-group">
                <h1 className="vl-title">Daily Visitor Log</h1>
                <p className="vl-subtitle">
                  Auditing center arrivals and departures for Monday, Oct 23, 2023
                </p>
              </div>
              <div className="vl-header-actions">
                <button className="vl-btn-action" onClick={() => handleExportReport('PDF')}>
                  <IonIcon icon={downloadOutline} /> Export PDF
                </button>
                <button className="vl-btn-action" style={{ background: '#16a34a', borderColor: '#16a34a' }} onClick={() => handleExportReport('Excel')}>
                  <IonIcon icon={downloadOutline} /> Export Excel
                </button>
                <button className="vl-btn-add" onClick={() => history.push('/visitor-log/check-in', { from: '/branch-admin/visitor-log' })}>
                  <IonIcon icon={addOutline} /> Add Visitor
                </button>
              </div>
            </div>
          </div>

          {/* 5 Stats Cards Grid — Enforced BRD Visitor Categories */}
          <div className="vl-stats-grid">
            {/* Card 1: Walk-ins */}
            <div className="vl-stat-card vl-stat-card--total" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1px solid #bfdbfe' }}>
              <div className="vl-stat-info">
                <div className="vl-stat-label" style={{ color: '#1e40af' }}>WALK-INS</div>
                <div className="vl-stat-value" style={{ color: '#1d4ed8' }}>{countWalkins}</div>
              </div>
              <div className="vl-stat-icon-wrapper" style={{ background: 'rgba(29, 78, 216, 0.1)', color: '#1d4ed8' }}>
                <IonIcon icon={checkmarkCircleOutline} />
              </div>
            </div>

            {/* Card 2: Meditation */}
            <div className="vl-stat-card vl-stat-card--meditation" style={{ background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)', border: '1px solid #fed7aa' }}>
              <div className="vl-stat-info">
                <div className="vl-stat-label" style={{ color: '#7c2d12' }}>MEDITATION</div>
                <div className="vl-stat-value" style={{ color: '#c2410c' }}>{countMeditation}</div>
              </div>
              <div className="vl-stat-icon-wrapper" style={{ background: 'rgba(194, 65, 12, 0.1)', color: '#c2410c' }}>
                <IonIcon icon={calendarOutline} />
              </div>
            </div>

            {/* Card 3: Sessions */}
            <div className="vl-stat-card vl-stat-card--sessions" style={{ background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)', border: '1px solid #a7f3d0' }}>
              <div className="vl-stat-info">
                <div className="vl-stat-label" style={{ color: '#065f46' }}>SESSIONS</div>
                <div className="vl-stat-value" style={{ color: '#047857' }}>{countSessions}</div>
              </div>
              <div className="vl-stat-icon-wrapper" style={{ background: 'rgba(4, 120, 87, 0.1)', color: '#047857' }}>
                <IonIcon icon={timeOutline} />
              </div>
            </div>

            {/* Card 4: Camp */}
            <div className="vl-stat-card" style={{ background: 'linear-gradient(135deg, #fdf4ff 0%, #f3e8ff 100%)', border: '1px solid #e9d5ff', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="vl-stat-info">
                <div className="vl-stat-label" style={{ color: '#6b21a8' }}>CAMP</div>
                <div className="vl-stat-value" style={{ color: '#7e22ce' }}>{countCamp}</div>
              </div>
              <div className="vl-stat-icon-wrapper" style={{ background: 'rgba(126, 34, 206, 0.1)', color: '#7e22ce', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <IonIcon icon={peopleOutline} />
              </div>
            </div>

            {/* Card 5: Healers */}
            <div className="vl-stat-card" style={{ background: 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)', border: '1px solid #a5f3fc', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="vl-stat-info">
                <div className="vl-stat-label" style={{ color: '#083344' }}>HEALERS</div>
                <div className="vl-stat-value" style={{ color: '#0369a1' }}>{countHealers}</div>
              </div>
              <div className="vl-stat-icon-wrapper" style={{ background: 'rgba(3, 105, 161, 0.1)', color: '#0369a1', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                <IonIcon icon={radioOutline} />
              </div>
            </div>
          </div>

          {/* Spacious Main Grid Layout */}
          <div className="vl-main-grid" style={{ gridTemplateColumns: '1fr' }}>
            {/* Left Column */}
            <div className="vl-left-col">
              {/* Current Logs Card */}
              <div className="vl-card">
                <div className="vl-card-header" style={{ marginBottom: '16px' }}>
                  <h2 className="vl-card-title">Current Logs</h2>
                  <div className="vl-live-badge">
                    <span className="vl-live-dot" /> Live Update
                  </div>
                </div>

                {/* Advanced Search & Filtering Controls */}
                <div className="sa-section" style={{ margin: '0 0 20px 0', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#f8fafc' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                    {/* Visitor Search Textbox */}
                    <div className="sa-search" style={{ margin: 0, width: '100%', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IonIcon icon={searchOutline} style={{ color: '#64748b', fontSize: '16px' }} />
                      <input
                        placeholder="Search Name, ID, or Phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px', color: '#1e293b' }}
                      />
                    </div>

                    {/* Visitor Type Filter */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                      <select
                        className="sa-input"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', background: '#fff', fontSize: '13px', outline: 'none', color: '#334155' }}
                      >
                        <option value="All">All Visitor Types</option>
                        <option value="Walk-in">Walk-in</option>
                        <option value="Meditation">Meditation</option>
                        <option value="Session">Session</option>
                        <option value="Camp">Camp</option>
                        <option value="Healer">Healer</option>
                      </select>
                    </div>

                    {/* Date Picker Filter */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                      <input
                        type="date"
                        className="sa-input"
                        value={filterDate}
                        onChange={(e) => setFilterDate(e.target.value)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', background: '#fff', fontSize: '13px', outline: 'none', color: '#334155' }}
                      />
                    </div>

                    {/* Status Filter */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                      <select
                        className="sa-input"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', width: '100%', background: '#fff', fontSize: '13px', outline: 'none', color: '#334155' }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Inside">Inside</option>
                        <option value="Exited">Exited</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="sa-table-responsive" style={{ border: 'none' }}>
                  <table className="vl-table">
                    <thead>
                      <tr>
                        <th>Visitor ID</th>
                        <th>Visitor Name</th>
                        <th>Type</th>
                        <th>Contact</th>
                        <th>Entry</th>
                        <th>Exit</th>
                        <th>Duration</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVisitors.length > 0 ? (
                        filteredVisitors.map((visitor) => (
                          <tr key={visitor.id}>
                            <td style={{ fontWeight: 700, color: '#7c2d12', fontFamily: 'monospace', fontSize: '11px' }}>{visitor.visitorId || '—'}</td>
                            <td>
                              <div className="vl-avatar-wrapper">
                                <div className="vl-avatar">
                                  {visitor.name.split(' ').map((n) => n[0]).join('')}
                                </div>
                                <div className="vl-visitor-info">
                                  <span className="vl-visitor-name">{visitor.name}</span>
                                </div>
                              </div>
                            </td>
                            <td>
                              <span 
                                className={`vl-badge-type vl-badge-type--${
                                  visitor.type === 'Meditation' ? 'meditation' : visitor.type === 'Session' ? 'session' : visitor.type === 'Walk-in' ? 'walkin' : visitor.type === 'Camp' ? 'camp' : 'healer'
                                }`}
                                style={{
                                  textTransform: 'uppercase', fontSize: '9px', padding: '2px 8px', borderRadius: '12px', fontWeight: 800,
                                  background: visitor.type === 'Session' ? '#eff6ff' : visitor.type === 'Walk-in' ? '#ecfdf5' : visitor.type === 'Meditation' ? '#fffbeb' : visitor.type === 'Camp' ? '#fdf4ff' : '#ecfeff',
                                  color: visitor.type === 'Session' ? '#2563eb' : visitor.type === 'Walk-in' ? '#10b981' : visitor.type === 'Meditation' ? '#d97706' : visitor.type === 'Camp' ? '#c084fc' : '#0891b2',
                                  border: `1px solid ${visitor.type === 'Session' ? '#bfdbfe' : visitor.type === 'Walk-in' ? '#a7f3d0' : visitor.type === 'Meditation' ? '#fde68a' : visitor.type === 'Camp' ? '#f3e8ff' : '#cffafe'}`
                                }}
                              >
                                {visitor.type}
                              </span>
                            </td>
                            <td>
                              <span className="vl-visitor-sub">{visitor.contact}</span>
                            </td>
                            <td>{visitor.entry}</td>
                            <td>{visitor.exit}</td>
                            <td>{visitor.duration}</td>
                            <td>
                              <span 
                                className={`vl-badge-status vl-badge-status--${
                                  visitor.status === 'Inside' ? 'inside' : 'exited'
                                }`}
                              >
                                {visitor.status === 'Inside' && <span className="vl-now-inside-dot" />}
                                {visitor.status}
                              </span>
                            </td>
                            <td>
                              <div className="sa-table__actions">
                                {visitor.status === 'Inside' ? (
                                  <button
                                    className="sa-btn sa-btn--sm sa-btn--primary"
                                    onClick={() => handleCheckOut(visitor.id)}
                                  >
                                    <IonIcon icon={logOutOutline} style={{ marginRight: '4px' }} /> Check-Out
                                  </button>
                                ) : (
                                  <button
                                    className="sa-btn sa-btn--sm sa-btn--outline"
                                    disabled
                                  >
                                    Exited
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={9} style={{ textAlign: 'center', padding: '40px 0' }}>
                            <div style={{ textAlign: 'center', color: '#64748b' }}>
                              <IonIcon icon={alertCircleOutline} style={{ fontSize: '32px', color: '#94a3b8', marginBottom: '8px' }} />
                              <div style={{ fontWeight: 600, fontSize: '13px' }}>No visitors match selected filter queries.</div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer / Pagination */}
                <div className="vl-table-footer">
                  <span className="vl-table-info">Showing 3 of 45 visitors</span>
                  <div className="vl-table-pagination">
                    <button className="vl-pagination-btn" disabled>
                      <IonIcon icon={chevronBackOutline} />
                    </button>
                    <button className="vl-pagination-btn" disabled>
                      <IonIcon icon={chevronForwardOutline} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Responsive Row for Now Inside and Quick Daily Summary */}
              <div className="vl-responsive-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', margin: '0 0 24px 0' }}>
                {/* Now Inside Card */}
                <div className="vl-side-card">
                  <div className="vl-card-header" style={{ marginBottom: '16px' }}>
                    <h2 className="vl-side-card-title">Now Inside</h2>
                    <span className="vl-live-badge">
                      <span className="vl-live-dot" /> LIVE
                    </span>
                  </div>

                  <div className="vl-now-inside-list">
                    {visitors.filter((v) => v.status === 'Inside').length > 0 ? (
                      visitors.filter((v) => v.status === 'Inside').slice(0, 5).map((visitor) => (
                        <div key={visitor.id} className="vl-now-inside-item">
                          <div className="vl-now-inside-avatar">
                            {visitor.name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                          </div>
                          <div className="vl-now-inside-info">
                            <span className="vl-now-inside-name">{visitor.name}</span>
                            <span className="vl-now-inside-sub">{visitor.type} • {visitor.entry}</span>
                          </div>
                          <span className="vl-now-inside-dot" />
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '24px 16px', color: '#64748b', fontSize: '12px', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                        No visitors currently inside.
                      </div>
                    )}
                  </div>

                  <button 
                    className="vl-btn-view-active"
                    onClick={() => {
                      setFilterStatus(filterStatus === 'Inside' ? 'All' : 'Inside');
                      setFilterType('All');
                      setSearchQuery('');
                    }}
                    style={{ 
                      background: filterStatus === 'Inside' ? '#f0fdfa' : undefined, 
                      borderColor: filterStatus === 'Inside' ? '#10b981' : undefined, 
                      color: filterStatus === 'Inside' ? '#10b981' : undefined,
                      fontWeight: 700 
                    }}
                  >
                    {filterStatus === 'Inside' ? 'Show All Logs' : `View All ${visitors.filter(v => v.status === 'Inside').length} Active`}
                  </button>
                </div>

                {/* Quick Daily Summary */}
                <div className="vl-summary-card">
                  <h3 className="vl-side-card-title">Quick Daily Summary</h3>
                  <div className="vl-summary-item" style={{ marginTop: '8px' }}>
                    <span className="vl-summary-label">Avg. Stay Duration</span>
                    <span className="vl-summary-val">42 min</span>
                  </div>
                  <div className="vl-summary-item">
                    <span className="vl-summary-label">New Visitors Today</span>
                    <span className="vl-summary-val">08</span>
                  </div>
                </div>
              </div>

              {/* Volume & Type Distribution Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                {/* Visitor Volume Card */}
                <div className="vl-card">
                  <div className="vl-card-header">
                    <h2 className="vl-card-title">Visitor Volume</h2>
                    <select className="sa-input" style={{ width: '120px', padding: '6px' }}>
                      <option>Last 7 Days</option>
                      <option>Last 30 Days</option>
                    </select>
                  </div>
                  {/* volume custom bar graph */}
                  <div className="vl-volume-bars">
                    {/* Mon */}
                    <div className="vl-volume-bar-col">
                      <div className="vl-volume-bar-visual">
                        <div 
                          className="vl-volume-bar-fill" 
                          style={{ '--volume-pct': '35%' } as React.CSSProperties}
                        />
                      </div>
                      <span className="vl-volume-bar-label">Mon</span>
                    </div>

                    {/* Tue */}
                    <div className="vl-volume-bar-col">
                      <div className="vl-volume-bar-visual">
                        <div 
                          className="vl-volume-bar-fill" 
                          style={{ '--volume-pct': '45%' } as React.CSSProperties}
                        />
                      </div>
                      <span className="vl-volume-bar-label">Tue</span>
                    </div>

                    {/* Wed */}
                    <div className="vl-volume-bar-col">
                      <div className="vl-volume-bar-visual">
                        <div 
                          className="vl-volume-bar-fill" 
                          style={{ '--volume-pct': '60%' } as React.CSSProperties}
                        />
                      </div>
                      <span className="vl-volume-bar-label">Wed</span>
                    </div>

                    {/* Thu */}
                    <div className="vl-volume-bar-col">
                      <div className="vl-volume-bar-visual">
                        <div 
                          className="vl-volume-bar-fill" 
                          style={{ '--volume-pct': '55%' } as React.CSSProperties}
                        />
                      </div>
                      <span className="vl-volume-bar-label">Thu</span>
                    </div>

                    {/* Fri */}
                    <div className="vl-volume-bar-col">
                      <div className="vl-volume-bar-visual">
                        <div 
                          className="vl-volume-bar-fill" 
                          style={{ '--volume-pct': '75%' } as React.CSSProperties}
                        />
                      </div>
                      <span className="vl-volume-bar-label">Fri</span>
                    </div>

                    {/* Sat */}
                    <div className="vl-volume-bar-col">
                      <div className="vl-volume-bar-visual">
                        <div 
                          className="vl-volume-bar-fill" 
                          style={{ '--volume-pct': '40%' } as React.CSSProperties}
                        />
                      </div>
                      <span className="vl-volume-bar-label">Sat</span>
                    </div>

                    {/* Sun */}
                    <div className="vl-volume-bar-col">
                      <div className="vl-volume-bar-visual">
                        <div 
                          className="vl-volume-bar-fill vl-volume-bar-fill--active" 
                          style={{ '--volume-pct': '85%' } as React.CSSProperties}
                        />
                      </div>
                      <span className="vl-volume-bar-label">Sun</span>
                    </div>
                  </div>
                </div>

                {/* Type Distribution Card */}
                <div className="vl-card">
                  <div className="vl-card-header">
                    <h2 className="vl-card-title">Type Distribution</h2>
                  </div>
                  {/* circular visual distribution */}
                  <div className="vl-donut-container">
                    <div className="vl-donut-visual">
                      <svg viewBox="0 0 36 36" className="vl-donut-chart">
                        <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" style={{ stroke: '#f1f5f9', strokeWidth: '3.5', fill: 'none' }} />
                        <path strokeDasharray="44, 100" strokeDashoffset="0" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" style={{ stroke: '#3b82f6', strokeWidth: '3.5', fill: 'none' }} />
                        <path strokeDasharray="27, 100" strokeDashoffset="-44" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" style={{ stroke: '#10b981', strokeWidth: '3.5', fill: 'none' }} />
                        <path strokeDasharray="18, 100" strokeDashoffset="-71" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" style={{ stroke: '#b45309', strokeWidth: '3.5', fill: 'none' }} />
                        <path strokeDasharray="11, 100" strokeDashoffset="-89" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" style={{ stroke: '#94a3b8', strokeWidth: '3.5', fill: 'none' }} />
                      </svg>
                      <div className="vl-donut-content">
                        <span className="vl-donut-number">45</span>
                        <span className="vl-donut-label">Total</span>
                      </div>
                    </div>
                    
                    <div className="vl-donut-legend">
                      <div className="vl-donut-legend-item">
                        <div className="vl-donut-legend-left">
                          <span className="vl-donut-dot vl-donut-dot--session" /> Sessions
                        </div>
                        <span className="vl-donut-legend-pct">44%</span>
                      </div>
                      <div className="vl-donut-legend-item">
                        <div className="vl-donut-legend-left">
                          <span className="vl-donut-dot vl-donut-dot--walkin" /> Walk-in
                        </div>
                        <span className="vl-donut-legend-pct">27%</span>
                      </div>
                      <div className="vl-donut-legend-item">
                        <div className="vl-donut-legend-left">
                          <span className="vl-donut-dot vl-donut-dot--meditation" /> Meditation
                        </div>
                        <span className="vl-donut-legend-pct">18%</span>
                      </div>
                      <div className="vl-donut-legend-item">
                        <div className="vl-donut-legend-left">
                          <span className="vl-donut-dot vl-donut-dot--other" /> Other
                        </div>
                        <span className="vl-donut-legend-pct">11%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Real-time Occupancy Solid Card */}
              <div className="vl-occupancy-card">
                <div className="vl-occupancy-info">
                  <h3 className="vl-occupancy-title">Real-time Occupancy</h3>
                  <p className="vl-occupancy-sub">Current center capacity tracking and visitor flow optimization</p>
                  
                  <div className="vl-occupancy-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                    <div className="vl-occupancy-item">
                      <span className="vl-occupancy-val">25%</span>
                      <span className="vl-occupancy-label">Current Capacity</span>
                    </div>
                    <div className="vl-occupancy-item">
                      <span className="vl-occupancy-val">52m</span>
                      <span className="vl-occupancy-label">Avg Stay</span>
                    </div>
                  </div>
                </div>
                
                <div className="vl-occupancy-graphic">
                  <div className="vl-occupancy-bar" style={{ '--bar-height': '25%' } as React.CSSProperties} />
                  <div className="vl-occupancy-bar" style={{ '--bar-height': '40%' } as React.CSSProperties} />
                  <div className="vl-occupancy-bar" style={{ '--bar-height': '55%' } as React.CSSProperties} />
                  <div className="vl-occupancy-bar" style={{ '--bar-height': '35%' } as React.CSSProperties} />
                  <div className="vl-occupancy-bar vl-occupancy-bar--active" style={{ '--bar-height': '80%' } as React.CSSProperties} />
                  <div className="vl-occupancy-bar" style={{ '--bar-height': '45%' } as React.CSSProperties} />
                </div>
              </div>

              {/* Activity History Card */}
              <div className="vl-card">
                <div className="vl-card-header" style={{ marginBottom: '24px' }}>
                  <h2 className="vl-card-title">Activity History</h2>
                  <button className="sa-btn sa-btn--sm sa-btn--outline">
                    <IonIcon icon={filterOutline} /> Filter by type
                  </button>
                </div>

                <div className="vl-timeline">
                  {/* Timeline 1 */}
                  <div className="vl-timeline-item">
                    <span className="vl-timeline-dot" />
                    <div className="vl-timeline-content">
                      <span className="vl-timeline-time">TODAY, 11:20 AM</span>
                      <span className="vl-timeline-title">Meera Kapoor checked in for a Walk-in consultation.</span>
                      <span className="vl-timeline-sub">Front desk: Sarah Logan</span>
                    </div>
                  </div>

                  {/* Timeline 2 */}
                  <div className="vl-timeline-item">
                    <span className="vl-timeline-dot" />
                    <div className="vl-timeline-content">
                      <span className="vl-timeline-time">TODAY, 10:45 AM</span>
                      <span className="vl-timeline-title">Rahul Prasad completed his Pranic Healing session.</span>
                      <div className="vl-timeline-tags">
                        <span className="vl-timeline-tag">Session #402</span>
                        <span className="vl-timeline-tag">Healer: Dr. Arjun</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline 3 */}
                  <div className="vl-timeline-item">
                    <span className="vl-timeline-dot vl-timeline-dot--inactive" />
                    <div className="vl-timeline-content">
                      <span className="vl-timeline-time">TODAY, 10:00 AM</span>
                      <span className="vl-timeline-title">Center peak occupancy reached (12 visitors).</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </IonContent>

      {/* Check-In Modal */}
      <IonModal isOpen={showCheckInModal} onDidDismiss={() => setShowCheckInModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header" style={{ background: '#0D5C46', color: '#fff', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#fff' }}>Visitor Check-In</h2>
            <button className="sa-modal__close-btn" style={{ color: '#fff', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }} onClick={() => setShowCheckInModal(false)}>×</button>
          </div>
          <div className="sa-modal__body" style={{ padding: '20px' }}>
            <div className="sa-settings__form-group" style={{ marginBottom: '14px', textAlign: 'left' }}>
              <label className="sa-settings__label" style={{ fontWeight: 700, fontSize: '11px', color: '#475569' }}>Full Name *</label>
              <input 
                className="sa-settings__input" 
                placeholder="Visitor Full Name"
                value={newVisitor.name}
                onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>
            <div className="sa-settings__form-group" style={{ marginBottom: '14px', textAlign: 'left' }}>
              <label className="sa-settings__label" style={{ fontWeight: 700, fontSize: '11px', color: '#475569' }}>Phone/Contact Number *</label>
              <input 
                className="sa-settings__input" 
                placeholder="+91 XXXXX XXXXX"
                value={newVisitor.contact}
                onChange={(e) => setNewVisitor({ ...newVisitor, contact: e.target.value })}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none' }}
              />
            </div>
            <div className="sa-settings__form-group" style={{ marginBottom: '0', textAlign: 'left' }}>
              <label className="sa-settings__label" style={{ fontWeight: 700, fontSize: '11px', color: '#475569' }}>Purpose Dropdown *</label>
              <select 
                className="sa-settings__input"
                value={newVisitor.type}
                onChange={(e) => setNewVisitor({ ...newVisitor, type: e.target.value as any })}
                style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', outline: 'none', background: '#fff', cursor: 'pointer' }}
              >
                <option value="Walk-in">Walk-in</option>
                <option value="Meditation">Meditation Hall</option>
                <option value="Session">Healing Session</option>
                <option value="Camp">Camp / Workshop</option>
                <option value="Healer">Healer Duty</option>
              </select>
            </div>
          </div>
          <div className="sa-modal__footer" style={{ padding: '12px 20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="sa-btn sa-btn--outline" onClick={() => setShowCheckInModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" style={{ background: '#0D5C46', borderColor: '#0D5C46' }} onClick={handleCheckIn}>Check-In</button>
          </div>
        </div>
      </IonModal>

      {/* ── MODAL: PREMIUM REPORT EXPORTER ────────────────────────────── */}
      <IonModal isOpen={showExportModal} onDidDismiss={() => { if (exportState === 'completed') setShowExportModal(false); }} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header" style={{ background: '#0d5c46', color: '#fff', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 className="sa-modal__title" style={{ color: '#fff', fontSize: '16px', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IonIcon icon={downloadOutline} /> 
              {exportState === 'generating' ? `Compiling ${exportFormat} Report` : `${exportFormat} Export Complete`}
            </h2>
            {exportState === 'completed' && (
              <button className="sa-modal__close-btn" style={{ color: '#fff', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }} onClick={() => setShowExportModal(false)}>&times;</button>
            )}
          </div>

          <div className="sa-modal__body" style={{ padding: '24px', textAlign: 'center' }}>
            {exportState === 'generating' ? (
              <div>
                {/* Spinning loader wheel */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <div style={{
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #0d5c46',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    animation: 'spin 1s linear infinite'
                  }} />
                </div>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}} />

                <h4 style={{ margin: '0 0 8px 0', fontWeight: 700, color: '#334155', fontSize: '15px' }}>
                  Processing visitor log archives...
                </h4>
                <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>
                  Compiling sequential VIS IDs, aggregating counts, and generating document statements.
                </p>

                {/* Progress bar */}
                <div style={{ width: '100%', background: '#e2e8f0', borderRadius: '8px', height: '12px', overflow: 'hidden', position: 'relative' }}>
                  <div style={{
                    width: `${exportProgress}%`,
                    background: 'linear-gradient(90deg, #10b981 0%, #0d5c46 100%)',
                    height: '100%',
                    transition: 'width 0.1s ease-out'
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                  <span>Formatting logs...</span>
                  <span>{exportProgress}%</span>
                </div>
              </div>
            ) : (
              <div>
                {/* Success Checkmark Ring */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
                  <div style={{
                    background: '#ecfdf5',
                    borderRadius: '50%',
                    width: '72px',
                    height: '72px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #a7f3d0'
                  }}>
                    <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '42px', color: '#10b981' }} />
                  </div>
                </div>

                <h3 style={{ margin: '0 0 8px 0', fontWeight: 800, color: '#0d5c46', fontSize: '18px' }}>
                  Visitor Logs Ready!
                </h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                  Your {exportFormat} statement for **Mumbai Branch** visitor audit logs has been compiled. All checked-in and exited categories have been structured.
                </p>

                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '20px', fontSize: '11px', textAlign: 'left', fontFamily: 'monospace', color: '#475569', lineHeight: 1.6 }}>
                  <div><strong>File Name:</strong> PHMS-Visitor-Log-{new Date().getFullYear()}.{exportFormat?.toLowerCase() === 'excel' ? 'xlsx' : 'pdf'}</div>
                  <div><strong>Format:</strong> {exportFormat === 'Excel' ? 'Microsoft Excel Spreadsheet' : 'Adobe PDF Document'}</div>
                  <div><strong>Size:</strong> {exportFormat === 'Excel' ? '12.4 KB' : '82.5 KB'}</div>
                  <div><strong>Checksum:</strong> SHA256-a9c04d8b...</div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="sa-btn sa-btn--primary"
                    style={{ flex: 1, background: '#10b981', border: 'none', justifyContent: 'center', fontSize: '13px', padding: '10px' }}
                    onClick={() => {
                      setShowExportModal(false);
                      triggerToast(`Downloaded PHMS-Visitor-Log.${exportFormat?.toLowerCase() === 'excel' ? 'xlsx' : 'pdf'} successfully!`);
                    }}
                  >
                    Download File
                  </button>
                  <button
                    type="button"
                    className="sa-btn sa-btn--outline"
                    style={{ flex: 1, justifyContent: 'center', fontSize: '13px', padding: '10px' }}
                    onClick={() => setShowExportModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </IonModal>

      {/* Live Toast Success Alert */}
      {showToast && (
        <div style={{
          position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
          background: '#0D5C46', color: 'white', padding: '12px 24px', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 99999, fontWeight: 700, fontSize: '13px',
          animation: 'fadeInUp 0.2s ease-out'
        }}>
          <IonIcon icon={checkmarkCircleOutline} style={{ marginRight: '6px', verticalAlign: 'middle', fontSize: '16px' }} />
          {toastMessage}
        </div>
      )}
    </IonPage>
  );
};

export default VisitorLogPage;
