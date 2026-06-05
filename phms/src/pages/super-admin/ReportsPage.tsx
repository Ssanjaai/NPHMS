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
  flashOutline,
  peopleOutline,
  cashOutline,
  starOutline,
  documentTextOutline,
  footstepsOutline,
  pulseOutline,
  briefcaseOutline,
  calendarOutline,
  chevronForwardOutline,
  downloadOutline,
  searchOutline,
  filterOutline,
  medkitOutline,
  barChartOutline,
  statsChartOutline,
  pieChartOutline,
  trendingUpOutline,
  expandOutline,
  checkmarkCircleOutline,
  syncOutline,
  closeCircleOutline,
  timeOutline,
} from 'ionicons/icons';
import './super-admin.css';
import { useLocation } from 'react-router-dom';

const ReportsPage: React.FC = () => {
  const location = useLocation();
  const [activeToggle, setActiveToggle] = useState('Income');
  const [timeRange, setTimeRange] = useState('Last 7 Days');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, setFilterBranch] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [chartType, setChartType] = useState('Bar');
  const [viewType, setViewType] = useState('Monthly');
  const [graphBranch, setGraphBranch] = useState('All');
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportInfo, setExportInfo] = useState({ title: '', format: '', type: 'individual' });

  // Healers mapped to actual branch names from the system
  const healers = [
    { name: 'Dr. Aris Varma', branch: 'Uptown Sanctuary', perf: 85 },
    { name: 'Julian Mars', branch: 'Uptown Sanctuary', perf: 79 },
    { name: 'Maya Rose', branch: 'Coastal Healing Center', perf: 92 },
    { name: 'Sofia Bell', branch: 'Coastal Healing Center', perf: 82 },
    { name: 'Samuel Chen', branch: 'Green Valley Branch', perf: 78 },
    { name: 'Lila Thorne', branch: 'Downtown Sanctuary', perf: 88 },
    { name: 'Dr. Vikram', branch: 'vennadur', perf: 88 },
    { name: 'Dr. Sofia', branch: 'vadugampalayam', perf: 91 },
    { name: 'Dr. Rahul', branch: 'Salem Center', perf: 76 },
  ];

  const [branches, setBranches] = useState<any[]>([]);

  // Re-sync branches from localStorage on every page visit
  useEffect(() => {
    const savedBranches = localStorage.getItem('ph_branches');
    if (savedBranches) {
      const allBranches = JSON.parse(savedBranches);
      const activeOnly = allBranches.filter((b: any) => b.status?.toLowerCase() === 'active');
      setBranches(activeOnly);
    }
  }, [location.pathname]);
  
  const [recentExports] = useState([
    { 
      id: 1, 
      name: 'Daily Income Report - Uptown', 
      type: 'PDF', 
      date: 'Today, 10:45 AM', 
      status: 'Generated',
      generatedBy: 'Admin Sarah',
      lastDownloaded: 'Today, 11:00 AM'
    },
    { 
      id: 2, 
      name: 'Monthly Visitor Summary', 
      type: 'Excel', 
      date: 'Today, 10:30 AM', 
      status: 'Processing',
      generatedBy: 'Super Admin',
      lastDownloaded: '-'
    },
    { 
      id: 3, 
      name: 'Healer Workload Audit', 
      type: 'PDF', 
      date: 'Yesterday, 04:20 PM', 
      status: 'Failed',
      generatedBy: 'Admin Sarah',
      lastDownloaded: '-'
    },
    { 
      id: 4, 
      name: 'Annual Financial Forecast', 
      type: 'PDF', 
      date: 'Yesterday, 02:15 PM', 
      status: 'Generated',
      generatedBy: 'Admin James',
      lastDownloaded: 'Yesterday, 03:30 PM'
    },
  ]);

  interface Stat {
    label: string;
    value: string;
    change: string;
    icon: string;
  }

  const stats: Stat[] = [
    { label: 'Total Reports', value: '450', change: '+12', icon: documentTextOutline },
    { label: 'Finance Reports', value: '85', change: '+5', icon: cashOutline },
    { label: 'Visitor Reports', value: '120', change: '+8', icon: footstepsOutline },
    { label: 'Patient Reports', value: '145', change: '+10', icon: peopleOutline },
    { label: 'Healer Reports', value: '65', change: '+4', icon: medkitOutline },
    { label: 'Attendance Reports', value: '35', change: '+2', icon: calendarOutline },
  ];

  const getChartData = () => {
    switch (viewType) {
      case 'Daily':
        return [
          { name: 'Mon', val: 45, color: '#10b981' },
          { name: 'Tue', val: 62, color: '#10b981' },
          { name: 'Wed', val: 38, color: '#10b981' },
          { name: 'Thu', val: 75, color: '#10b981' },
          { name: 'Fri', val: 55, color: '#10b981' },
          { name: 'Sat', val: 88, color: '#10b981' },
          { name: 'Sun', val: 32, color: '#10b981' }
        ];
      case 'Yearly':
        return [
          { name: '2022', val: 65, color: '#7c3aed' },
          { name: '2023', val: 82, color: '#7c3aed' },
          { name: '2024', val: 95, color: '#7c3aed' },
          { name: '2025', val: 40, color: '#7c3aed' }
        ];
      default: // Monthly
        return [
          { name: 'Uptown', val: 75, color: '#10b981' },
          { name: 'Coastal', val: 92, color: '#3b82f6' },
          { name: 'Green V.', val: 58, color: '#f59e0b' },
          { name: 'Downtown', val: 82, color: '#ef4444' }
        ];
    }
  };

  const currentChartData = getChartData();

  const reportSections = [
    {
      category: 'Finance Reports',
      icon: cashOutline,
      color: '#10b981',
      type: 'Operational',
      reports: [
        { title: 'Daily Income Report', desc: 'Detailed breakdown of organization-wide revenue' },
        { title: 'Daily Expense Report', desc: 'Audit log of daily expenditures across branches' },
        { title: 'Net Balance Report', desc: 'Consolidated profit and loss analysis' },
        { title: 'Branch-wise Finance Report', desc: 'Regional financial performance comparison' },
      ]
    },
    {
      category: 'Visitor Reports',
      icon: footstepsOutline,
      color: '#3b82f6',
      type: 'Operational',
      reports: [
        { title: 'Daily Visitor Report', desc: 'Daily footfall and visitor purpose details' },
        { title: 'Monthly Visitor Report', desc: 'Consolidated monthly traffic trends' },
        { title: 'Visitor Type Summary', desc: 'Distribution of visitor categories' },
        { title: 'Branch-wise Visitor Report', desc: 'Regional visitor volume analysis' },
      ]
    },
    {
      category: 'Patient Reports',
      icon: pulseOutline,
      color: '#7c3aed',
      type: 'Clinical',
      reports: [
        { title: 'Active Patient Report', desc: 'List of patients currently undergoing treatment' },
        { title: 'Completed Treatment Report', desc: 'Historical record of successfully healed cases' },
        { title: 'Patient Session History', desc: 'Detailed log of individual session notes' },
        { title: 'Follow-up Report', desc: 'Schedule of upcoming patient check-ins' },
      ]
    },
    {
      category: 'Healer Reports',
      icon: medkitOutline,
      color: '#ec4899',
      type: 'Staff',
      reports: [
        { title: 'Healing Count Report', desc: 'Total treatments performed per healer' },
        { title: 'Healer Workload Report', desc: 'Analysis of session distribution among staff' },
        { title: 'Active Patient Count', desc: 'Current caseload per individual healer' },
        { title: 'Session Performance Report', desc: 'Patient feedback and recovery metrics' },
      ]
    },
    {
      category: 'Attendance Reports',
      icon: calendarOutline,
      color: '#f59e0b',
      type: 'Staff',
      reports: [
        { title: 'Daily Attendance Report', desc: 'Staff and healer check-in/out records' },
        { title: 'Monthly Attendance Report', desc: 'Consolidated monthly attendance summary' },
        { title: 'Worker Attendance Summary', desc: 'Individual attendance performance records' },
        { title: 'Branch-wise Attendance Report', desc: 'Regional staffing and presence levels' },
      ]
    }
  ];

  // Build filtered sections with all filters working together
  const filteredSections = reportSections
    // Step 1: Filter by report type (Operational / Clinical / Staff)
    .filter(section => filterType === 'All' || section.type === filterType)
    // Step 2: Map sections and filter individual reports by search query
    .map(section => ({
      ...section,
      reports: section.reports
        .filter(report => {
          if (!searchQuery) return true;
          const q = searchQuery.toLowerCase();
          return (
            report.title.toLowerCase().includes(q) ||
            report.desc.toLowerCase().includes(q) ||
            section.category.toLowerCase().includes(q)
          );
        })
        .map(report => ({
          ...report,
          // Contextualize report with selected branch
          displayTitle: filterBranch !== 'All' 
            ? `${report.title} — ${filterBranch}` 
            : report.title,
          displayDesc: filterBranch !== 'All'
            ? `${report.desc} (Branch: ${filterBranch})`
            : report.desc,
          branchContext: filterBranch !== 'All' ? filterBranch : null,
        }))
    }))
    // Step 3: Only keep sections that have matching reports
    .filter(section => section.reports.length > 0);

  const formatDisplayDate = () => {
    if (dateRange.start && dateRange.end) {
      return `${dateRange.start} to ${dateRange.end}`;
    }
    return new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const handleBulkExport = () => {
    setExportInfo({ title: 'Management Reports', format: 'ZIP', type: 'bulk' });
    setShowExportModal(true);
  };

  const handleExport = (reportTitle: string, format: 'PDF' | 'Excel') => {
    setExportInfo({ title: reportTitle, format, type: 'individual' });
    setShowExportModal(true);
  };

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">PHMS Reports</IonTitle>
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
            <div className="sa-page__header-row" style={{ flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h1 className="sa-page__title">Management Reports</h1>
                <p className="sa-page__subtitle">Generate and export detailed organizational performance records</p>
              </div>
              <div className="sa-page__header-actions" style={{ flexWrap: 'wrap', gap: '8px' }}>
                <button className="sa-btn sa-btn--primary" onClick={handleBulkExport}>
                  <IonIcon icon={downloadOutline} /> Bulk Export Reports
                </button>
              </div>
            </div>
          </div>

          <div className="sa-section-header" style={{ marginTop: '24px' }}>
            <div className="sa-filter-row" style={{ width: '100%' }}>
              <div className="sa-search" style={{ margin: 0, flex: '2' }}>
                <IonIcon icon={searchOutline} />
                <input 
                  placeholder="Search reports..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="sa-filter-dropdowns-row">
                <div className="sa-filter-group" style={{ flex: '1' }}>
                  <IonIcon icon={briefcaseOutline} />
                  <select 
                    className="sa-input" 
                    value={filterBranch}
                    onChange={(e) => setFilterBranch(e.target.value)}
                  >
                    <option value="All">All Active Branches</option>
                    {branches.map((b, i) => (
                      <option key={i} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sa-filter-group" style={{ flex: '1' }}>
                  <IonIcon icon={filterOutline} />
                  <select 
                    className="sa-input" 
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="All">All Types</option>
                    <option value="Operational">Operational</option>
                    <option value="Clinical">Clinical</option>
                    <option value="Staff">Staff</option>
                  </select>
                </div>
              </div>

              <div className="sa-date-range-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1.2', background: '#fff', padding: '6px 12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <input type="date" className="sa-input" style={{ border: 'none', padding: '4px', fontSize: '13px' }} value={dateRange.start} onChange={(e) => setDateRange({...dateRange, start: e.target.value})} />
                <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700 }}>TO</span>
                <input type="date" className="sa-input" style={{ border: 'none', padding: '4px', fontSize: '13px' }} value={dateRange.end} onChange={(e) => setDateRange({...dateRange, end: e.target.value})} />
              </div>

              <button 
                className="sa-btn sa-btn--outline" 
                style={{ flex: '0.4', minWidth: '80px', justifyContent: 'center', padding: '10px' }}
                onClick={() => {
                  setSearchQuery('');
                  setFilterBranch('All');
                  setFilterType('All');
                  setDateRange({ start: '', end: '' });
                }}
              >
                Clear
              </button>
            </div>

            {/* Active Filter Tags */}
            {(searchQuery || filterBranch !== 'All' || filterType !== 'All' || (dateRange.start && dateRange.end)) && (
              <div style={{ 
                display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px',
                padding: '12px 16px', background: '#f0fdf4', borderRadius: '10px', 
                border: '1px solid #bbf7d0', alignItems: 'center'
              }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#16a34a', marginRight: '4px' }}>
                  Active Filters:
                </span>
                {searchQuery && (
                  <span style={{
                    fontSize: '11px', fontWeight: 600, color: '#1e293b', background: 'white',
                    padding: '4px 10px', borderRadius: '20px', border: '1px solid #e2e8f0',
                    display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
                  }} onClick={() => setSearchQuery('')}>
                    🔍 "{searchQuery}" ✕
                  </span>
                )}
                {filterBranch !== 'All' && (
                  <span style={{
                    fontSize: '11px', fontWeight: 600, color: '#7c3aed', background: '#7c3aed10',
                    padding: '4px 10px', borderRadius: '20px', border: '1px solid #7c3aed30',
                    display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
                  }} onClick={() => setFilterBranch('All')}>
                    🏢 {filterBranch} ✕
                  </span>
                )}
                {filterType !== 'All' && (
                  <span style={{
                    fontSize: '11px', fontWeight: 600, color: '#3b82f6', background: '#3b82f610',
                    padding: '4px 10px', borderRadius: '20px', border: '1px solid #3b82f630',
                    display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
                  }} onClick={() => setFilterType('All')}>
                    📋 {filterType} ✕
                  </span>
                )}
                {dateRange.start && dateRange.end && (
                  <span style={{
                    fontSize: '11px', fontWeight: 600, color: '#f59e0b', background: '#f59e0b10',
                    padding: '4px 10px', borderRadius: '20px', border: '1px solid #f59e0b30',
                    display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer'
                  }} onClick={() => setDateRange({ start: '', end: '' })}>
                    📅 {dateRange.start} → {dateRange.end} ✕
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Stat Cards */}
          <div className="sa-stats sa-stats--6">
            {stats.map((stat, i) => (
              <div className="sa-stat-card" key={i}>
                <div>
                  <div className="sa-stat-card__icon" style={{ marginBottom: 8, display: 'inline-flex' }}>
                    <IonIcon icon={stat.icon} />
                  </div>
                  <div className="sa-stat-card__value">{stat.value}</div>
                  <div className="sa-stat-card__label" style={{ marginBottom: 0 }}>{stat.label}</div>
                </div>
                {stat.change && (
                  <span style={{ fontSize: 12, color: '#1a8a5a', fontWeight: 600 }}>{stat.change}</span>
                )}
              </div>
            ))}
          </div>

          {/* Analytics Section */}
          <div style={{ marginTop: '40px' }}>
            {/* Organization-wide Analytics */}
            <div className="sa-section" style={{ marginBottom: '24px' }}>
              <div className="sa-section__header" style={{ marginBottom: '20px' }}>
                <div>
                  <h2 className="sa-section__title">Organization-wide Analytics</h2>
                  <p className="sa-section__subtitle">Complete organization performance overview</p>
                </div>
              </div>
              <div className="sa-stats sa-stats--5" style={{ marginBottom: 0 }}>
                {[
                  { label: 'Total Branches', value: '12', icon: briefcaseOutline, color: '#10b981' },
                  { label: 'Total Patients', value: '2,450', icon: peopleOutline, color: '#7c3aed' },
                  { label: 'Total Healers', value: '84', icon: medkitOutline, color: '#ec4899' },
                  { label: 'Total Visitors', value: '5,120', icon: footstepsOutline, color: '#3b82f6' },
                  { label: 'Overall Finance', value: '₹42.5L', icon: cashOutline, color: '#10b981' },
                ].map((s, i) => (
                  <div className="sa-stat-card" key={i} style={{ padding: '16px', borderLeft: `4px solid ${s.color}` }}>
                    <div>
                      <div className="sa-stat-card__label" style={{ fontSize: '10px' }}>{s.label}</div>
                      <div className="sa-stat-card__value" style={{ fontSize: '20px' }}>{s.value}</div>
                    </div>
                    <div style={{ color: s.color, opacity: 0.8 }}>
                      <IonIcon icon={s.icon} style={{ fontSize: '24px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sa-grid-2">
              {/* Branch-wise Performance Graph */}
              <div className="sa-section" style={{ margin: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#1e293b' }}>Healer Performance Graph 📈</h3>
                    <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>Analyzing practitioner workload and session throughput</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <select 
                      className="sa-input" 
                      style={{ fontSize: '11px', padding: '4px 8px', width: 'auto', background: '#f1f5f9' }}
                      value={graphBranch}
                      onChange={(e) => setGraphBranch(e.target.value)}
                    >
                      <option value="All">All Active Branches</option>
                      {branches.map((b, i) => (
                        <option key={i} value={b.name}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="sa-chart-placeholder" style={{ 
                  flex: 1, 
                  minHeight: '240px', 
                  background: '#f8fafc', 
                  borderRadius: '12px', 
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  position: 'relative'
                }}>
                  {/* Chart Grid Lines */}
                  <div style={{ position: 'absolute', inset: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none' }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ width: '100%', height: '1px', background: '#e2e8f0', opacity: 0.5 }} />
                    ))}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', width: '100%', position: 'relative', zIndex: 1 }}>
                    {graphBranch === 'All' 
                      ? branches.map((b, i) => {
                          const perf = 70 + (i * 7) % 25;
                          const branchHealerCount = healers.filter(h => h.branch.toLowerCase() === b.name.toLowerCase()).length;
                          return (
                            <div key={i} className="sa-chart-bar-group" style={{ 
                              display: 'flex', flexDirection: 'column', alignItems: 'center', 
                              gap: '12px', cursor: 'pointer', transition: 'all 0.3s ease', flex: 1
                            }}>
                              <div style={{ 
                                width: '40px', height: `${perf * 2}px`, background: '#ec4899', 
                                borderRadius: '6px 6px 0 0', position: 'relative',
                                boxShadow: '0 4px 12px -2px rgba(236,72,153,0.3)'
                              }}>
                                <div className="sa-chart-tooltip" style={{ 
                                  position: 'absolute', top: '-55px', left: '50%', transform: 'translateX(-50%)',
                                  background: '#1e293b', color: 'white', padding: '8px 14px', borderRadius: '8px',
                                  fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap',
                                  opacity: 0, visibility: 'hidden', transition: 'all 0.2s ease',
                                  zIndex: 10, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                }}>
                                  <div style={{ fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.15)', marginBottom: '4px', paddingBottom: '4px' }}>{b.name}</div>
                                  Performance: {perf}%<br/>
                                  <small style={{ fontWeight: 400, opacity: 0.8 }}>Healers: {branchHealerCount} | Region: {b.region}</small>
                                </div>
                              </div>
                              <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textAlign: 'center' }}>{b.name}</span>
                            </div>
                          );
                        })
                      : healers
                          .filter(h => h.branch.toLowerCase() === graphBranch.toLowerCase())
                          .map((h, i) => (
                            <div key={i} className="sa-chart-bar-group" style={{ 
                              display: 'flex', flexDirection: 'column', alignItems: 'center', 
                              gap: '12px', cursor: 'pointer', transition: 'all 0.3s ease', flex: 1
                            }}>
                              <div style={{ 
                                width: '40px', height: `${h.perf * 2}px`, background: '#7c3aed', 
                                borderRadius: '6px 6px 0 0', position: 'relative',
                                boxShadow: '0 4px 12px -2px rgba(124,58,237,0.3)'
                              }}>
                                <div className="sa-chart-tooltip" style={{ 
                                  position: 'absolute', top: '-55px', left: '50%', transform: 'translateX(-50%)',
                                  background: '#1e293b', color: 'white', padding: '8px 14px', borderRadius: '8px',
                                  fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap',
                                  opacity: 0, visibility: 'hidden', transition: 'all 0.2s ease',
                                  zIndex: 10, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                                }}>
                                  <div style={{ fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.15)', marginBottom: '4px', paddingBottom: '4px' }}>{h.name}</div>
                                  Performance: {h.perf}%<br/>
                                  <small style={{ fontWeight: 400, opacity: 0.8 }}>Branch: {graphBranch}</small>
                                </div>
                              </div>
                              <span style={{ fontSize: '10px', fontWeight: 700, color: '#64748b', textAlign: 'center' }}>{h.name}</span>
                            </div>
                          ))
                    }
                  </div>
                </div>
              </div>

              {/* Monthly Report Summary */}
              <div className="sa-section" style={{ margin: 0, height: '100%' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', color: '#1e293b' }}>Monthly Report Summary</h3>
                <div className="sa-grid-2" style={{ gap: '12px' }}>
                  {[
                    { label: 'Monthly Income', value: '₹8.4L', sub: 'Expenses: ₹3.2L', icon: cashOutline, color: '#10b981' },
                    { label: 'Monthly Visitors', value: '1,240', sub: '+15% from last month', icon: footstepsOutline, color: '#3b82f6' },
                    { label: 'Patient Activity', value: '840 Sessions', sub: '92% completion rate', icon: pulseOutline, color: '#7c3aed' },
                    { label: 'Monthly Attendance', value: '96%', sub: 'Avg. staff presence', icon: calendarOutline, color: '#f59e0b' }
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${item.color}15`, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IonIcon icon={item.icon} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>{item.label}</span>
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>{item.value}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>{item.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Daily Activity Overview */}
            <div className="sa-section" style={{ marginTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#1e293b' }}>Daily Activity Overview</h3>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
              <div className="sa-stats sa-stats--4" style={{ marginBottom: 0 }}>
                {[
                  { label: 'Daily Finance', value: '₹42,500', sub: 'Income: ₹32k | Exp: ₹10k', icon: cashOutline, color: '#10b981' },
                  { label: 'Today Visitors', value: '48', sub: '12 New | 36 Returning', icon: footstepsOutline, color: '#3b82f6' },
                  { label: 'Today Sessions', value: '84', sub: '65 Completed | 19 Pending', icon: pulseOutline, color: '#7c3aed' },
                  { label: 'Worker Attendance', value: '92%', sub: '78 Present | 4 On Leave', icon: briefcaseOutline, color: '#f59e0b' }
                ].map((d, i) => (
                  <div key={i} style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', gap: '16px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'white', color: d.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <IonIcon icon={d.icon} style={{ fontSize: '20px' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>{d.label}</div>
                      <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: '2px 0' }}>{d.value}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{d.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reports Sections */}
          <div className="sa-reports-container" style={{ marginTop: '32px' }}>
            {filteredSections.length > 0 ? (
              filteredSections.map((section, idx) => (
                <div key={idx} className="sa-report-group" style={{ marginBottom: '40px' }}>
                  <div className="sa-section__header" style={{ marginBottom: '20px', borderLeft: `4px solid ${section.color}`, paddingLeft: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${section.color}15`, color: section.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <IonIcon icon={section.icon} style={{ fontSize: '20px' }} />
                      </div>
                      <div>
                        <h2 className="sa-section__title" style={{ fontSize: '18px' }}>{section.category}</h2>
                        <p className="sa-section__subtitle" style={{ fontSize: '11px' }}>{section.reports.length} report types available in this category</p>
                      </div>
                    </div>
                  </div>

                  <div className="sa-report-grid" style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                    gap: '16px' 
                  }}>
                    {section.reports.map((report: any, rIdx: number) => (
                      <div className="sa-report-card" key={rIdx} onClick={() => alert(`Preparing ${report.displayTitle || report.title}...`)}>
                        <div className="sa-report-card__header">
                           <div className="sa-report-card__icon" style={{ backgroundColor: `${section.color}15`, color: section.color }}>
                             <IonIcon icon={documentTextOutline} />
                           </div>
                           {report.branchContext && (
                             <span style={{
                               fontSize: '10px', fontWeight: 700, color: '#7c3aed',
                               background: '#7c3aed15', padding: '3px 10px', borderRadius: '20px',
                               display: 'flex', alignItems: 'center', gap: '4px'
                             }}>
                               <IonIcon icon={briefcaseOutline} style={{ fontSize: '12px' }} />
                               {report.branchContext}
                             </span>
                           )}
                           <div className="sa-report-card__action">
                             <IonIcon icon={chevronForwardOutline} />
                           </div>
                        </div>
                        <h3 className="sa-report-card__title" style={{ fontSize: '15px', marginTop: '12px' }}>{report.displayTitle || report.title}</h3>
                        <p className="sa-report-card__desc" style={{ fontSize: '12px', marginTop: '4px' }}>{report.displayDesc || report.desc}</p>
                        {(dateRange.start && dateRange.end) && (
                          <p style={{ fontSize: '10px', color: '#7c3aed', marginTop: '4px', fontWeight: 600 }}>
                            📅 {dateRange.start} → {dateRange.end}
                          </p>
                        )}
                        <div className="sa-report-card__footer" style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                           <button 
                            className="sa-btn sa-btn--sm sa-btn--primary" 
                            style={{ padding: '6px 12px', fontSize: '11px' }}
                            onClick={(e) => { e.stopPropagation(); handleExport(report.displayTitle || report.title, 'PDF'); }}
                           >
                             <IonIcon icon={downloadOutline} /> PDF
                           </button>
                           <button 
                            className="sa-btn sa-btn--sm sa-btn--outline" 
                            style={{ padding: '6px 12px', fontSize: '11px' }}
                            onClick={(e) => { e.stopPropagation(); handleExport(report.displayTitle || report.title, 'Excel'); }}
                           >
                             <IonIcon icon={downloadOutline} /> Excel
                           </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="sa-empty-state" style={{ padding: '60px 20px', borderRadius: '16px' }}>
                <div className="sa-empty-state__icon">
                  <IonIcon icon={searchOutline} />
                </div>
                <h3 className="sa-empty-state__title">No reports found</h3>
                <p className="sa-empty-state__text">Try adjusting your search query or category filters</p>
                <button 
                  className="sa-btn sa-btn--primary" 
                  style={{ marginTop: '20px' }}
                  onClick={() => {
                    setSearchQuery('');
                    setFilterBranch('All');
                    setFilterType('All');
                    setDateRange({ start: '', end: '' });
                  }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

          {/* Recent Export Status
          <div className="sa-section" style={{ marginTop: '40px' }}>
            <div className="sa-section__header" style={{ marginBottom: '20px' }}>
              <div>
                <h2 className="sa-section__title">Recent Export Status</h2>
                <p className="sa-section__subtitle">Track report generation authorship and download timestamps</p>
              </div>
              <button className="sa-btn sa-btn--sm sa-btn--outline">View Audit Log</button>
            </div>

            <div className="sa-table-responsive" style={{ background: 'white', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
              <table className="sa-table">
                <thead>
                  <tr>
                    <th>Report Name</th>
                    <th>Format</th>
                    <th>Generated By</th>
                    <th>Last Generated</th>
                    <th>Last Downloaded</th>
                    <th>Status</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExports.map((exportItem) => (
                    <tr key={exportItem.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{exportItem.name}</div>
                      </td>
                      <td>
                        <span className={`sa-badge ${exportItem.type === 'PDF' ? 'sa-badge--absent' : 'sa-badge--present'}`} style={{ fontSize: '10px' }}>
                          {exportItem.type}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#475569' }}>{exportItem.generatedBy}</div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                          <IonIcon icon={timeOutline} style={{ fontSize: '14px' }} />
                          {exportItem.date}
                        </div>
                      </td>
                      <td>
                        <div style={{ fontSize: '12px', color: exportItem.lastDownloaded === '-' ? '#94a3b8' : '#64748b' }}>
                          {exportItem.lastDownloaded}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <IonIcon 
                            icon={
                              exportItem.status === 'Generated' ? checkmarkCircleOutline : 
                              exportItem.status === 'Processing' ? syncOutline : closeCircleOutline
                            } 
                            style={{ 
                              color: exportItem.status === 'Generated' ? '#10b981' : 
                                     exportItem.status === 'Processing' ? '#3b82f6' : '#ef4444',
                              fontSize: '18px',
                              animation: exportItem.status === 'Processing' ? 'spin 2s linear infinite' : 'none'
                            }}
                          />
                          <span style={{ 
                            fontSize: '13px', 
                            fontWeight: 600,
                            color: exportItem.status === 'Generated' ? '#10b981' : 
                                   exportItem.status === 'Processing' ? '#3b82f6' : '#ef4444'
                          }}>
                            {exportItem.status}
                          </span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button 
                          className="sa-btn sa-btn--sm sa-btn--outline" 
                          disabled={exportItem.status !== 'Generated'}
                          style={{ padding: '6px 12px', fontSize: '11px' }}
                        >
                          {exportItem.status === 'Generated' ? 'Download' : exportItem.status === 'Processing' ? 'Waiting...' : 'Retr/y'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div> */}
        </div>

        {/* Export Confirmation Modal */}
        <IonModal isOpen={showExportModal} onDidDismiss={() => setShowExportModal(false)} className="sa-modal sa-modal--sm">
          <div className="sa-modal__content">
            <div className="sa-modal__header">
              <h2 className="sa-modal__title">Confirm Download</h2>
              <button className="sa-modal__close-btn" onClick={() => setShowExportModal(false)}>×</button>
            </div>
            
            <div className="sa-modal__body" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <div className="sa-export-success-icon" style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: '#e0f2fe', 
                color: '#0284c7', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 24px',
                fontSize: '40px',
                border: '4px solid #bae6fd'
              }}>
                <IonIcon icon={downloadOutline} />
              </div>
              <h3 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>
                Download {exportInfo.format}?
              </h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '15px', marginBottom: '8px' }}>
                {exportInfo.type === 'bulk' ? (
                  <>Are you sure you want to download the bulk export for all filtered management reports?</>
                ) : (
                  <>Are you sure you want to download the <strong>{exportInfo.title}</strong> in <strong>{exportInfo.format}</strong> format?</>
                )}
              </p>
              <p style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>
                {exportInfo.type === 'bulk' ? 'Archive format: ZIP' : `Report format: ${exportInfo.format}`}
              </p>
            </div>
            
            <div className="sa-modal__footer" style={{ borderTop: 'none', paddingTop: 0, gap: '12px' }}>
              <button className="sa-btn sa-btn--outline" style={{ flex: 1, height: '48px' }} onClick={() => setShowExportModal(false)}>Cancel</button>
              <button 
                className="sa-btn sa-btn--primary" 
                style={{ flex: 1, height: '48px', fontSize: '16px' }} 
                onClick={() => {
                  setShowExportModal(false);
                  // Trigger actual download logic here
                }}
              >
                Download
              </button>
            </div>
          </div>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ReportsPage;
