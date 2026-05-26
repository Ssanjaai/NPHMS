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
} from 'ionicons/icons';
import { useAuthStore } from '../../store/auth.store';
import './branch-admin.css';

interface Visitor {
  id: number;
  name: string;
  type: 'Meditation' | 'Session' | 'Walk-in';
  contact: string;
  entry: string;
  exit: string;
  duration: string;
  status: 'Inside' | 'Exited';
  dateStr: string;
}

const VisitorLogPage: React.FC = () => {
  const { user } = useAuthStore();
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);

  // Initial mock data that EXACTLY matches the image screenshot!
  const [visitors, setVisitors] = useState<Visitor[]>([
    {
      id: 1,
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
      name: 'Meera Kapoor',
      type: 'Walk-in',
      contact: '+91 99887 76655',
      entry: '10:05 AM',
      exit: '—',
      duration: '25m',
      status: 'Inside',
      dateStr: '2026-10-23',
    },
  ]);

  // Modal State for New Entry
  const [newVisitor, setNewVisitor] = useState({
    name: '',
    contact: '',
    type: 'Session' as 'Meditation' | 'Session' | 'Walk-in',
  });

  const handleCheckIn = () => {
    if (!newVisitor.name || !newVisitor.contact) return;

    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const added: Visitor = {
      id: Date.now(),
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
                  Tracking all arrivals and departures for Monday, Oct 23, 2023
                </p>
              </div>
              <div className="vl-header-actions">
                <button className="vl-btn-action">
                  <IonIcon icon={documentTextOutline} /> Visitor Reports
                </button>
                <button className="vl-btn-action">
                  <IonIcon icon={downloadOutline} /> Export Logs
                </button>
                <button className="vl-btn-active-visitors">
                  <IonIcon icon={peopleOutline} /> Active Visitors ({activeVisitorsInsideCount})
                </button>
                <button className="vl-btn-add" onClick={() => setShowCheckInModal(true)}>
                  <IonIcon icon={addOutline} /> Add Visitor
                </button>
              </div>
            </div>
          </div>

          {/* 5 Stats Cards Grid */}
          <div className="vl-stats-grid">
            {/* Card 1 */}
            <div className="vl-stat-card vl-stat-card--total">
              <div className="vl-stat-info">
                <div className="vl-stat-label">TOTAL TODAY</div>
                <div className="vl-stat-value">
                  45 <span className="vl-stat-trend">+12% ↑</span>
                </div>
              </div>
              <div className="vl-stat-icon-wrapper">
                <IonIcon icon={peopleOutline} />
              </div>
            </div>

            {/* Card 2 */}
            <div className="vl-stat-card vl-stat-card--walkins">
              <div className="vl-stat-info">
                <div className="vl-stat-label">WALK-INS</div>
                <div className="vl-stat-value">12</div>
              </div>
              <div className="vl-stat-icon-wrapper">
                <IonIcon icon={checkmarkCircleOutline} style={{ color: '#06b6d4' }} />
              </div>
            </div>

            {/* Card 3 */}
            <div className="vl-stat-card vl-stat-card--meditation">
              <div className="vl-stat-info">
                <div className="vl-stat-label">MEDITATION</div>
                <div className="vl-stat-value">08</div>
              </div>
              <div className="vl-stat-icon-wrapper">
                <IonIcon icon={calendarOutline} style={{ color: '#b45309' }} />
              </div>
            </div>

            {/* Card 4 */}
            <div className="vl-stat-card vl-stat-card--sessions">
              <div className="vl-stat-info">
                <div className="vl-stat-label">SESSIONS</div>
                <div className="vl-stat-value">20</div>
              </div>
              <div className="vl-stat-icon-wrapper">
                <IonIcon icon={timeOutline} style={{ color: '#3b82f6' }} />
              </div>
            </div>

            {/* Card 5 (Dark teal card) */}
            <div className="vl-stat-card vl-stat-card--active-inside">
              <div className="vl-stat-info">
                <div className="vl-stat-label">ACTIVE INSIDE</div>
                <div className="vl-stat-value">05</div>
              </div>
              <div className="vl-stat-icon-wrapper">
                <IonIcon icon={radioOutline} />
              </div>
            </div>
          </div>

          {/* Two-Column Grid Layout */}
          <div className="vl-main-grid">
            {/* Left Column */}
            <div className="vl-left-col">
              {/* Current Logs Card */}
              <div className="vl-card">
                <div className="vl-card-header">
                  <h2 className="vl-card-title">Current Logs</h2>
                  <div className="vl-live-badge">
                    <span className="vl-live-dot" /> Live Update
                  </div>
                </div>

                <div className="sa-table-responsive" style={{ border: 'none' }}>
                  <table className="vl-table">
                    <thead>
                      <tr>
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
                      {visitors.map((visitor) => (
                        <tr key={visitor.id}>
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
                                visitor.type === 'Meditation' ? 'meditation' : visitor.type === 'Session' ? 'session' : 'walkin'
                              }`}
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
                      ))}
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
                  
                  <div className="vl-occupancy-grid">
                    <div className="vl-occupancy-item">
                      <span className="vl-occupancy-val">25%</span>
                      <span className="vl-occupancy-label">Current Capacity</span>
                    </div>
                    <div className="vl-occupancy-item">
                      <span className="vl-occupancy-val">12m</span>
                      <span className="vl-occupancy-label">Wait Time</span>
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

            {/* Right Column */}
            <div className="vl-right-col">
              {/* Now Inside Card */}
              <div className="vl-side-card">
                <div className="vl-card-header" style={{ marginBottom: '16px' }}>
                  <h2 className="vl-side-card-title">Now Inside</h2>
                  <span className="vl-live-badge">
                    <span className="vl-live-dot" /> LIVE
                  </span>
                </div>

                <div className="vl-now-inside-list">
                  {/* Item 1 */}
                  <div className="vl-now-inside-item">
                    <div className="vl-now-inside-avatar">AS</div>
                    <div className="vl-now-inside-info">
                      <span className="vl-now-inside-name">Ananya Sharma</span>
                      <span className="vl-now-inside-sub">Meditation • 08:15 AM</span>
                    </div>
                    <span className="vl-now-inside-dot" />
                  </div>

                  {/* Item 2 */}
                  <div className="vl-now-inside-item">
                    <div className="vl-now-inside-avatar">VM</div>
                    <div className="vl-now-inside-info">
                      <span className="vl-now-inside-name">Vikram Malhotra</span>
                      <span className="vl-now-inside-sub">Session • 10:30 AM</span>
                    </div>
                    <span className="vl-now-inside-dot" />
                  </div>

                  {/* Item 3 */}
                  <div className="vl-now-inside-item">
                    <div className="vl-now-inside-avatar">PV</div>
                    <div className="vl-now-inside-info">
                      <span className="vl-now-inside-name">Priya Varma</span>
                      <span className="vl-now-inside-sub">Session • 10:55 AM</span>
                    </div>
                    <span className="vl-now-inside-dot" />
                  </div>
                </div>

                <button className="vl-btn-view-active">
                  View All 5 Active
                </button>
              </div>

              {/* Peak Visitor Timing */}
              <div className="vl-timing-card">
                <div className="vl-timing-icon">
                  <IonIcon icon={timeOutline} />
                </div>
                <div className="vl-timing-info">
                  <span className="vl-timing-val">10AM - 12PM</span>
                  <span className="vl-timing-sub">PEAK VISITOR TIMING</span>
                  <span className="vl-visitor-sub" style={{ marginTop: '2px' }}>Usually busiest period</span>
                </div>
              </div>

              {/* Quick Daily Summary */}
              <div className="vl-summary-card">
                <h3 className="vl-side-card-title">Quick Daily Summary</h3>
                <div className="vl-summary-item" style={{ marginTop: '8px' }}>
                  <span className="vl-summary-label">Avg. Duration</span>
                  <span className="vl-summary-val">42 min</span>
                </div>
                <div className="vl-summary-item">
                  <span className="vl-summary-label">New Visitors</span>
                  <span className="vl-summary-val">08</span>
                </div>
                <div className="vl-summary-item">
                  <span className="vl-summary-label">Satisfaction Rate</span>
                  <span className="vl-summary-val vl-summary-val--success">94%</span>
                </div>
              </div>

              {/* Growth by Category */}
              <div className="vl-growth-card">
                <h3 className="vl-side-card-title">Growth By Category</h3>
                
                {/* Item 1 */}
                <div className="vl-growth-item" style={{ marginTop: '8px' }}>
                  <div className="vl-growth-header">
                    <span className="vl-growth-label">Sessions</span>
                    <span className="vl-growth-val vl-growth-val--green">+15%</span>
                  </div>
                  <div className="vl-growth-bar">
                    <div className="vl-growth-fill vl-growth-fill--green" style={{ '--growth-pct': '75%' } as React.CSSProperties} />
                  </div>
                </div>

                {/* Item 2 */}
                <div className="vl-growth-item">
                  <div className="vl-growth-header">
                    <span className="vl-growth-label">Meditation</span>
                    <span className="vl-growth-val vl-growth-val--red">-3%</span>
                  </div>
                  <div className="vl-growth-bar">
                    <div className="vl-growth-fill vl-growth-fill--brown" style={{ '--growth-pct': '45%' } as React.CSSProperties} />
                  </div>
                </div>

                {/* Item 3 */}
                <div className="vl-growth-item">
                  <div className="vl-growth-header">
                    <span className="vl-growth-label">Walk-ins</span>
                    <span className="vl-growth-val vl-growth-val--green">+8%</span>
                  </div>
                  <div className="vl-growth-bar">
                    <div className="vl-growth-fill vl-growth-fill--green" style={{ '--growth-pct': '60%' } as React.CSSProperties} />
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
          <div className="sa-modal__header">
            <h2>Visitor Check-In</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowCheckInModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Full Name</label>
              <input 
                className="sa-settings__input" 
                placeholder="Visitor Name"
                value={newVisitor.name}
                onChange={(e) => setNewVisitor({ ...newVisitor, name: e.target.value })}
              />
            </div>
            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Phone/Contact Number</label>
              <input 
                className="sa-settings__input" 
                placeholder="+91 XXXXX XXXXX"
                value={newVisitor.contact}
                onChange={(e) => setNewVisitor({ ...newVisitor, contact: e.target.value })}
              />
            </div>
            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Purpose</label>
              <select 
                className="sa-settings__input"
                value={newVisitor.type}
                onChange={(e) => setNewVisitor({ ...newVisitor, type: e.target.value as any })}
              >
                <option value="Session">Healing Session</option>
                <option value="Meditation">Meditation</option>
                <option value="Walk-in">Walk-in consultation</option>
              </select>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowCheckInModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleCheckIn}>Check-In</button>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
};

export default VisitorLogPage;
