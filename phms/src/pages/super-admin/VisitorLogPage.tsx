import React, { useState, useMemo } from 'react';
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
  searchOutline,
  businessOutline,
  peopleOutline,
  filterOutline,
  printOutline,
  calendarOutline,
  footstepsOutline,
  leafOutline,
  medkitOutline,
  mapOutline,
  personOutline,
  closeOutline,
  eyeOutline,
  createOutline,
  downloadOutline,
  chevronBackOutline,
  chevronForwardOutline,
  timeOutline,
  callOutline,
  locationOutline,
  documentTextOutline,
  trendingUpOutline,
  checkmarkCircleOutline,
} from 'ionicons/icons';
import './super-admin.css';

interface Visitor {
  id: string;
  name: string;
  email: string;
  gender: 'Male' | 'Female' | 'Other';
  type: 'Walk-in' | 'Meditation' | 'Session' | 'Camp' | 'Healer';
  phone: string;
  branch: string;
  address: string;
  idProof: {
    type: string;
    number: string;
  };
  feedback: string;
  entryDate: string;
  entryTime: string;
  exitTime: string | null;
  status: 'Inside Center' | 'Exited';
  notes: string;
}

const VisitorLogPage: React.FC = () => {
  // State
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [filterBranch, setFilterBranch] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState<'PDF' | 'Excel'>('PDF');
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Mock Data
  const [visitors, setVisitors] = useState<Visitor[]>([
    { 
      id: 'V-1001', 
      name: 'John Smith', 
      email: 'john.smith@example.com',
      gender: 'Male',
      type: 'Session', 
      phone: '+91 98765 43210', 
      branch: 'Uptown Sanctuary', 
      address: '123 Peace Ave, Downtown District',
      idProof: { type: 'Aadhar', number: 'XXXX-XXXX-1234' },
      feedback: 'The healing session was very calming. Highly recommend the lead healer.',
      entryDate: '2024-05-11', 
      entryTime: '09:15 AM', 
      exitTime: '10:30 AM', 
      status: 'Exited', 
      notes: 'First time visitor, interested in basic healing.' 
    },
    { 
      id: 'V-1002', 
      name: 'Anita Rao', 
      email: 'anita.rao@email.com',
      gender: 'Female',
      type: 'Healer', 
      phone: '+91 98765 43211', 
      branch: 'Coastal Healing Center', 
      address: '45 Lotus Garden, Beach Road',
      idProof: { type: 'Driving License', number: 'DL-987654321' },
      feedback: 'Excellent facilities and the management is very supportive.',
      entryDate: '2024-05-11', 
      entryTime: '10:00 AM', 
      exitTime: null, 
      status: 'Inside Center', 
      notes: 'Regular healer for morning sessions.' 
    },
    { 
      id: 'V-1003', 
      name: 'David Miller', 
      email: 'david.m@web.com',
      gender: 'Male',
      type: 'Walk-in', 
      phone: '+91 98765 43212', 
      branch: 'Green Valley Branch', 
      address: 'Apartment 4B, Hill View Residency',
      idProof: { type: 'Passport', number: 'Z1234567' },
      feedback: 'Quick response at the reception. Looking forward to the meditation classes.',
      entryDate: '2024-05-11', 
      entryTime: '10:45 AM', 
      exitTime: '11:15 AM', 
      status: 'Exited', 
      notes: 'Inquiry about meditation classes.' 
    },
    { 
      id: 'V-1004', 
      name: 'Priya Sharma', 
      email: 'priya.s@mail.com',
      gender: 'Female',
      type: 'Meditation', 
      phone: '+91 98765 43213', 
      branch: 'Uptown Sanctuary',   
      address: '78 Shanti Niwas, Sector 5',
      idProof: { type: 'Aadhar', number: 'XXXX-XXXX-5678' },
      feedback: 'Peaceful atmosphere, perfect for meditation.',
      entryDate: '2024-05-11', 
      entryTime: '11:30 AM', 
      exitTime: null, 
      status: 'Inside Center', 
      notes: 'Attending the 11:30 AM group meditation.' 
    },
    { 
      id: 'V-1005', 
      name: 'Robert Wilson', 
      email: 'rob.w@outlook.com',
      gender: 'Male',
      type: 'Camp', 
      phone: '+91 98765 43214', 
      branch: 'Downtown Sanctuary', 
      address: 'B-22 Green Meadows, Pine Street',
      idProof: { type: 'Voter ID', number: 'ABC1234567' },
      feedback: 'The camp organization is top-notch.',
      entryDate: '2024-05-11', 
      entryTime: '12:00 PM', 
      exitTime: null, 
      status: 'Inside Center', 
      notes: 'Participating in the weekend healing camp.' 
    }
  ]);

  // Derived Stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayVisitors = visitors.filter(v => v.entryDate === today);
    
    return {
      total: visitors.length,
      today: todayVisitors.length,
      inside: visitors.filter(v => v.status === 'Inside Center').length,
      types: {
        'Walk-in': visitors.filter(v => v.type === 'Walk-in').length,
        'Meditation': visitors.filter(v => v.type === 'Meditation').length,
        'Session': visitors.filter(v => v.type === 'Session').length,
        'Camp': visitors.filter(v => v.type === 'Camp').length,
        'Healer': visitors.filter(v => v.type === 'Healer').length,
      }
    };
  }, [visitors]);

  // Filtering Logic
  const filteredVisitors = useMemo(() => {
    return visitors.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           v.phone.includes(searchQuery);
      const matchesType = filterType === 'All' || v.type === filterType;
      const matchesBranch = filterBranch === 'All' || v.branch === filterBranch;
      const matchesStatus = filterStatus === 'All' || v.status === filterStatus;
      
      let matchesDate = true;
      if (dateRange.start && dateRange.end) {
        matchesDate = v.entryDate >= dateRange.start && v.entryDate <= dateRange.end;
      } else if (dateRange.start) {
        matchesDate = v.entryDate >= dateRange.start;
      }

      return matchesSearch && matchesType && matchesBranch && matchesStatus && matchesDate;
    });
  }, [visitors, searchQuery, filterType, filterBranch, filterStatus, dateRange]);

  // Pagination
  const paginatedVisitors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredVisitors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredVisitors, currentPage]);

  const totalPages = Math.ceil(filteredVisitors.length / itemsPerPage);

  // Handlers
  const handleViewDetails = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setViewMode('details');
  };

  const handleBackToList = () => {
    setViewMode('list');
    setSelectedVisitor(null);
  };

  const handleEditVisitor = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisitor) return;

    setVisitors(prev => prev.map(v => v.id === selectedVisitor.id ? selectedVisitor : v));
    setShowEditModal(false);
  };

  const handleExport = (format: 'PDF' | 'Excel') => {
    setExportFormat(format);
    setShowExportModal(true);
    // In a real app, this would trigger the actual file generation/download
    console.log(`Generating ${format} for ${filteredVisitors.length} records...`);
  };

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            {viewMode === 'details' ? (
              <button className="sa-back-btn" onClick={handleBackToList}>
                <IonIcon icon={chevronBackOutline} /> 
              </button>
            ) : (
              <IonMenuButton />
            )}
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">
            {viewMode === 'details' ? 'Visitor Information' : 'Visitor Management'}
          </IonTitle>
          <IonButtons slot="end">
            <div className="sa-page__toolbar-actions">
              {viewMode === 'list' && (
                <>
                  <button className="sa-btn sa-btn--outline sa-btn--sm" onClick={() => handleExport('PDF')}>
                    <IonIcon icon={downloadOutline} /> PDF
                  </button>
                </>
              )}
              <button className="sa-page__toolbar-avatar">SA</button>
            </div>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        {viewMode === 'list' ? (
          <div className="sa-page__body">
            {/* Header Section */}
            <div className="sa-page__header">
              <div className="sa-page__header-row">
                <div>
                  <h1 className="sa-page__title">Visitor Dashboard</h1>
                  <p className="sa-page__subtitle">Centralized monitoring of visitors across all branches</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="sa-stats" style={{ marginBottom: '24px', gridTemplateColumns: 'repeat(4, 1fr)' }}>
              <div className="sa-stat-card">
                <div>
                  <div className="sa-stat-card__label">Total Visitors</div>
                  <div className="sa-stat-card__value">{stats.total}</div>
                  <div className="sa-stat-card__detail">
                    <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} /> Overall records
                  </div>
                </div>
                <div className="sa-stat-card__icon sa-stat-card__icon--primary">
                  <IonIcon icon={peopleOutline} />
                </div>
              </div>

              <div className="sa-stat-card" style={{ '--color-primary': '#10b981' } as any}>
                <div>
                  <div className="sa-stat-card__label">Today Visitors</div>
                  <div className="sa-stat-card__value">{stats.today}</div>
                  <div className="sa-stat-card__detail">
                    <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} /> New entries today
                  </div>
                </div>
                <div className="sa-stat-card__icon sa-stat-card__icon--info">
                  <IonIcon icon={calendarOutline} />
                </div>
              </div>

              <div className="sa-stat-card" style={{ '--color-primary': '#16a34a' } as any}>
                <div>
                  <div className="sa-stat-card__label">Active Inside</div>
                  <div className="sa-stat-card__value">{stats.inside}</div>
                  <div className="sa-stat-card__detail">
                    <IonIcon icon={trendingUpOutline} style={{ color: '#16a34a' }} /> Currently present
                  </div>
                </div>
                <div className="sa-stat-card__icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                  <IonIcon icon={businessOutline} />
                </div>
              </div>

              <div className="sa-stat-card" style={{ '--color-primary': '#f59e0b' } as any}>
                <div>
                  <div className="sa-stat-card__label">Sessions</div>
                  <div className="sa-stat-card__value">{stats.types.Session}</div>
                  <div className="sa-stat-card__detail">
                    <IonIcon icon={trendingUpOutline} style={{ color: '#f59e0b' }} /> Healing sessions
                  </div>
                </div>
                <div className="sa-stat-card__icon sa-stat-card__icon--warning">
                  <IonIcon icon={medkitOutline} />
                </div>
              </div>

              <div className="sa-stat-card" style={{ '--color-primary': '#10b981' } as any}>
                <div>
                  <div className="sa-stat-card__label">Meditation</div>
                  <div className="sa-stat-card__value">{stats.types.Meditation}</div>
                  <div className="sa-stat-card__detail">
                    <IonIcon icon={trendingUpOutline} style={{ color: '#10b981' }} /> Group meditation
                  </div>
                </div>
                <div className="sa-stat-card__icon sa-stat-card__icon--success">
                  <IonIcon icon={leafOutline} />
                </div>
              </div>

              <div className="sa-stat-card" style={{ '--color-primary': '#ef4444' } as any}>
                <div>
                  <div className="sa-stat-card__label">Walk-in</div>
                  <div className="sa-stat-card__value">{stats.types['Walk-in']}</div>
                  <div className="sa-stat-card__detail">
                    <IonIcon icon={trendingUpOutline} style={{ color: '#ef4444' }} /> Direct arrivals
                  </div>
                </div>
                <div className="sa-stat-card__icon" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                  <IonIcon icon={footstepsOutline} />
                </div>
              </div>

              <div className="sa-stat-card" style={{ '--color-primary': '#e11d48' } as any}>
                <div>
                  <div className="sa-stat-card__label">Camp</div>
                  <div className="sa-stat-card__value">{stats.types.Camp}</div>
                  <div className="sa-stat-card__detail">
                    <IonIcon icon={trendingUpOutline} style={{ color: '#e11d48' }} /> Camp participants
                  </div>
                </div>
                <div className="sa-stat-card__icon" style={{ backgroundColor: '#fff1f2', color: '#e11d48' }}>
                  <IonIcon icon={mapOutline} />
                </div>
              </div>

              <div className="sa-stat-card" style={{ '--color-primary': '#7c3aed' } as any}>
                <div>
                  <div className="sa-stat-card__label">Healer</div>
                  <div className="sa-stat-card__value">{stats.types.Healer}</div>
                  <div className="sa-stat-card__detail">
                    <IonIcon icon={trendingUpOutline} style={{ color: '#7c3aed' }} /> Visiting healers
                  </div>
                </div>
                <div className="sa-stat-card__icon" style={{ backgroundColor: '#f5f3ff', color: '#7c3aed' }}>
                  <IonIcon icon={personOutline} />
                </div>
              </div>
            </div>

            {/* Filters & Table */}
            <div className="sa-section">
              <div className="sa-section__header">
                <h2 className="sa-section__title">Visitor Records</h2>
              </div>

              <div className="sa-filter-row" style={{ marginBottom: '24px' }}>
                <div className="sa-search" style={{ margin: 0, flex: '2', minWidth: '300px' }}>
                  <IonIcon icon={searchOutline} />
                  <input 
                    placeholder="Search by Visitor Name..." 
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                
                <div className="sa-input-group" style={{ display: 'flex', flexDirection: 'row', gap: '8px', alignItems: 'center', flex: '1.5', minWidth: '280px' }}>
                  <input 
                    type="date" 
                    className="sa-input sa-date-input" 
                    placeholder="dd-mm-yyyy"
                    value={dateRange.start} 
                    onChange={(e) => { setDateRange({...dateRange, start: e.target.value}); setCurrentPage(1); }} 
                  />
                  <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 600 }}>to</span>
                  <input 
                    type="date" 
                    className="sa-input sa-date-input" 
                    placeholder="dd-mm-yyyy"
                    value={dateRange.end} 
                    onChange={(e) => { setDateRange({...dateRange, end: e.target.value}); setCurrentPage(1); }} 
                  />
                </div>

                <div className="sa-filter-group">
                  <div className="sa-input-group" style={{ flex: '1', minWidth: '120px' }}>
                    <select className="sa-input" value={filterBranch} onChange={(e) => { setFilterBranch(e.target.value); setCurrentPage(1); }}>
                      <option value="All">All Branches</option>
                      <option value="Uptown Sanctuary">Uptown Sanctuary</option>
                      <option value="Coastal Healing Center">Coastal Healing Center</option>
                      <option value="Green Valley Branch">Green Valley Branch</option>
                      <option value="Downtown Sanctuary">Downtown Sanctuary</option>
                    </select>
                  </div>

                  <div className="sa-input-group" style={{ flex: '1', minWidth: '120px' }}>
                    <select className="sa-input" value={filterType} onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}>
                      <option value="All">All Visitor Types</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Meditation">Meditation</option>
                      <option value="Session">Session</option>
                      <option value="Camp">Camp</option>
                      <option value="Healer">Healer</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="sa-table-container" style={{ margin: '0 -24px', borderTop: '1px solid #f0f1f5' }}>
                <table className="sa-table" style={{ minWidth: '1000px' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center' }}>Visitor Name</th>
                      <th style={{ textAlign: 'center' }}>Visitor Type</th>
                      <th style={{ textAlign: 'center' }}>Branch Name</th>
                      <th style={{ textAlign: 'center' }}>Entry Date</th>
                      <th style={{ textAlign: 'center' }}>Notes</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedVisitors.length > 0 ? (
                      paginatedVisitors.map((v) => (
                        <tr key={v.id}>
                          <td style={{ fontWeight: 600, textAlign: 'center' }}>{v.name}</td>
                          <td style={{ textAlign: 'center' }}>{v.type}</td>
                          <td style={{ textAlign: 'center' }}>{v.branch}</td>
                          <td style={{ textAlign: 'center' }}>{v.entryDate}</td>
                          <td style={{ textAlign: 'center' }}>{v.notes}</td>
                          <td style={{ textAlign: 'center' }}>
                            <div className="sa-table__actions" style={{ justifyContent: 'center' }}>
                              <button className="sa-table__action-btn" onClick={() => handleViewDetails(v)}>
                                <IonIcon icon={eyeOutline} />
                              </button>
                            </div>
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
                            <h3 className="sa-empty-state__title">No visitor records found</h3>
                            <p className="sa-empty-state__text">
                              {searchQuery 
                                ? `No visitors matching "${searchQuery}" were found.` 
                                : `There are currently no visitor records matching the selected filters.`}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* FULL PAGE DETAIL VIEW */
          <div className="sa-page__body sa-detail-view" style={{ animation: 'fadeIn 0.3s ease-out' }}>
            <div className="sa-page__header" style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div className="sa-table__avatar sa-table__avatar--primary" style={{ width: '80px', height: '80px', fontSize: '32px' }}>
                    {selectedVisitor?.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <h1 className="sa-page__title" style={{ fontSize: '32px', margin: 0 }}>{selectedVisitor?.name}</h1>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {/* Action buttons removed as requested */}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
              {/* Main Info Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                
                {/* Information Sections Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                  
                  {/* Basic Information */}
                  <div className="sa-section" style={{ marginBottom: 0 }}>
                    <h3 className="sa-section__title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', marginBottom: '20px' }}>
                      <IonIcon icon={personOutline} style={{ color: 'var(--color-primary)' }} /> Basic Information
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="sa-info-item">
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Name</label>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '15px' }}>{selectedVisitor?.name}</div>
                      </div>
                      <div className="sa-info-item">
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Address</label>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '15px' }}>{selectedVisitor?.email}</div>
                      </div>
                      <div className="sa-info-item">
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Number</label>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '15px' }}>{selectedVisitor?.phone}</div>
                      </div>
                      <div className="sa-info-item">
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Gender</label>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '15px' }}>{selectedVisitor?.gender}</div>
                      </div>
                    </div>
                  </div>

                  {/* Visit & Identity */}
                  <div className="sa-section" style={{ marginBottom: 0 }}>
                    <h3 className="sa-section__title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', marginBottom: '20px' }}>
                      <IonIcon icon={businessOutline} style={{ color: 'var(--color-primary)' }} /> Visit & Identity
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="sa-info-item">
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Visitor Type</label>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '15px' }}>{selectedVisitor?.type}</div>
                      </div>
                      <div className="sa-info-item">
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Branch Location</label>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '15px' }}>{selectedVisitor?.branch}</div>
                      </div>
                      <div className="sa-info-item">
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID Proof ({selectedVisitor?.idProof.type})</label>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '15px' }}>{selectedVisitor?.idProof.number}</div>
                      </div>
                      <div className="sa-info-item">
                        <label style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Address</label>
                        <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '15px', lineHeight: 1.4 }}>{selectedVisitor?.address}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visitor Feedback & Notes */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                   <div className="sa-section" style={{ marginBottom: 0 }}>
                    <h3 className="sa-section__title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', marginBottom: '20px' }}>
                      <IonIcon icon={peopleOutline} style={{ color: 'var(--color-primary)' }} /> Visitor Feedback
                    </h3>
                    <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '12px', border: '1px solid #e0f2fe' }}>
                      <p style={{ margin: 0, fontSize: '15px', color: '#0369a1', fontStyle: 'italic', lineHeight: 1.6 }}>
                        "{selectedVisitor?.feedback || 'No feedback provided yet.'}"
                      </p>
                    </div>
                  </div>

                  <div className="sa-section" style={{ marginBottom: 0 }}>
                    <h3 className="sa-section__title" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', marginBottom: '20px' }}>
                      <IonIcon icon={documentTextOutline} style={{ color: 'var(--color-primary)' }} />Notes
                    </h3>
                    <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', minHeight: '120px', color: '#475569', lineHeight: 1.6 }}>
                      {selectedVisitor?.notes || 'No specific notes recorded for this visitor.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar: Visit Summary & Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div className="sa-section" style={{ marginBottom: 0 }}>
                  <h3 className="sa-section__title" style={{ fontSize: '18px', marginBottom: '24px' }}>Visit Summary</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #dcfce7' }}>
                      <div>
                        <div style={{ marginBottom: '8px' }}>
                          <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>Entry Date</div>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: '#14532d' }}>{selectedVisitor?.entryDate}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>Entry Time</div>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: '#14532d' }}>{selectedVisitor?.entryTime}</div>
                        </div>
                      </div>
                      <IonIcon icon={calendarOutline} style={{ fontSize: '24px', color: '#22c55e' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#fff7ed', borderRadius: '12px', border: '1px solid #ffedd5' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#9a3412', fontWeight: 600 }}>Exit Time</div>
                        <div style={{ fontSize: '18px', fontWeight: 700, color: '#7c2d12' }}>{selectedVisitor?.exitTime || 'Ongoing'}</div>
                      </div>
                      <IonIcon icon={timeOutline} style={{ fontSize: '24px', color: '#f97316' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visitor Details Modal (REMOVED AND REPLACED BY FULL PAGE) */}

        {/* Edit Visitor Modal */}
        {/* ... (keep the edit modal as is) */}

        {/* Edit Visitor Modal */}
        <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)} className="sa-modal">
          <div className="sa-modal__container" style={{ maxWidth: '600px' }}>
            <div className="sa-modal__header">
              <h2 className="sa-modal__title">Edit Visitor Record</h2>
              <button className="sa-modal__close" onClick={() => setShowEditModal(false)}>
                <IonIcon icon={closeOutline} />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit}>
              {selectedVisitor && (
                <div className="sa-modal__body">
                  <div className="sa-form-grid">
                    <div className="sa-input-group">
                      <label className="sa-label">Visitor Name</label>
                      <input 
                        type="text" 
                        className="sa-input" 
                        value={selectedVisitor.name}
                        onChange={(e) => setSelectedVisitor({...selectedVisitor, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="sa-input-group">
                      <label className="sa-label">Contact Number</label>
                      <input 
                        type="tel" 
                        className="sa-input" 
                        value={selectedVisitor.phone}
                        onChange={(e) => setSelectedVisitor({...selectedVisitor, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div className="sa-input-group">
                      <label className="sa-label">Visitor Type</label>
                      <select 
                        className="sa-input"
                        value={selectedVisitor.type}
                        onChange={(e) => setSelectedVisitor({...selectedVisitor, type: e.target.value as any})}
                        required
                      >
                        <option value="Walk-in">Walk-in</option>
                        <option value="Meditation">Meditation</option>
                        <option value="Session">Session</option>
                        <option value="Camp">Camp</option>
                        <option value="Healer">Healer</option>
                      </select>
                    </div>
                    <div className="sa-input-group">
                      <label className="sa-label">Branch</label>
                      <select 
                        className="sa-input"
                        value={selectedVisitor.branch}
                        onChange={(e) => setSelectedVisitor({...selectedVisitor, branch: e.target.value})}
                        required
                      >
                        <option value="Uptown Sanctuary">Uptown Sanctuary</option>
                        <option value="Coastal Healing Center">Coastal Healing Center</option>
                        <option value="Green Valley Branch">Green Valley Branch</option>
                        <option value="Downtown Sanctuary">Downtown Sanctuary</option>
                      </select>
                    </div>
                    <div className="sa-input-group">
                      <label className="sa-label">Entry Time</label>
                      <input 
                        type="text" 
                        className="sa-input" 
                        value={selectedVisitor.entryTime}
                        onChange={(e) => setSelectedVisitor({...selectedVisitor, entryTime: e.target.value})}
                        required
                      />
                    </div>
                    <div className="sa-input-group">
                      <label className="sa-label">Exit Time</label>
                      <input 
                        type="text" 
                        className="sa-input" 
                        value={selectedVisitor.exitTime || ''}
                        onChange={(e) => setSelectedVisitor({...selectedVisitor, exitTime: e.target.value || null})}
                        placeholder="--:-- AM/PM"
                      />
                    </div>
                    <div className="sa-input-group" style={{ gridColumn: 'span 2' }}>
                      <label className="sa-label">Notes</label>
                      <textarea 
                        className="sa-input" 
                        rows={3}
                        value={selectedVisitor.notes}
                        onChange={(e) => setSelectedVisitor({...selectedVisitor, notes: e.target.value})}
                      ></textarea>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="sa-modal__footer">
                <button type="button" className="sa-btn sa-btn--outline" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="sa-btn sa-btn--primary">Save Changes</button>
              </div>
            </form>
          </div>
        </IonModal>

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
                Download {exportFormat}?
              </h3>
              <p style={{ color: '#64748b', lineHeight: 1.6, fontSize: '15px', marginBottom: '8px' }}>
                Are you sure you want to download the visitor log report for <strong>{filteredVisitors.length}</strong> records?
              </p>
              <p style={{ color: '#94a3b8', fontSize: '13px', fontStyle: 'italic' }}>
                Selected format: {exportFormat}
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

export default VisitorLogPage;
