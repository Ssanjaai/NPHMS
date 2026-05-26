import React, { useState, useEffect, useRef } from 'react';
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
  addOutline,
  documentTextOutline,
  cloudUploadOutline,
  downloadOutline,
  funnelOutline,
  ellipsisVerticalOutline,
  heartOutline,
  eyeOutline,
  shieldCheckmarkOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  closeCircleOutline,
  lockClosedOutline,
  timeOutline,
  pieChartOutline,
  barChartOutline,
  folderOpenOutline,
  trashOutline,
  documentOutline,
  folderOutline,
  closeOutline,
  chevronBackOutline,
  chevronForwardOutline,
} from 'ionicons/icons';
import { useAuthStore } from '../../store/auth.store';
import './branch-admin.css';

interface UploadedDocument {
  id: number;
  documentName: string;
  patientName: string;
  type: 'Doctor Report' | 'Lab Result' | 'Consultation' | 'General';
  date: string;
  format: 'PDF' | 'JPG' | 'PNG' | 'DOCX' | 'XLSX';
  size: string;
  uploadedBy: string;
}

interface SecurityActivity {
  id: number;
  time: string;
  title: string;
  user: string;
  details: string;
  type: 'upload' | 'access' | 'warning';
}

const DocumentManagementPage: React.FC = () => {
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Branch Names
  const rawBranch = typeof user?.branch === 'object' && user?.branch !== null
    ? (user.branch as any).name
    : (user?.branch || 'Mumbai Main');
  const branchName = rawBranch.toLowerCase().includes('branch') ? rawBranch : `${rawBranch} Branch`;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Add Document Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    patientName: '',
    documentType: 'Doctor Report' as 'Doctor Report' | 'Lab Result' | 'Consultation' | 'General',
    selectedFileName: '',
  });

  // Mock Upload Progress State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFileName, setUploadingFileName] = useState('');

  // Primary Documents State (Interactive)
  const [documents, setDocuments] = useState<UploadedDocument[]>([
    {
      id: 1,
      documentName: 'Post-Op_Scan_V1.pdf',
      patientName: 'Arjun Sharma',
      type: 'Doctor Report',
      date: 'Oct 24, 2023',
      format: 'PDF',
      size: '2.4 MB',
      uploadedBy: 'Dr. Shailesh [Cardiology]',
    },
    {
      id: 2,
      documentName: 'Blood_Work_Q3.jpg',
      patientName: 'Priya Kapoor',
      type: 'Lab Result',
      date: 'Oct 23, 2023',
      format: 'JPG',
      size: '4.8 MB',
      uploadedBy: 'Lab Tech Priya',
    },
    {
      id: 3,
      documentName: 'Healing_Plan_Final.docx',
      patientName: 'Rahul Verma',
      type: 'Consultation',
      date: 'Oct 22, 2023',
      format: 'DOCX',
      size: '1.1 MB',
      uploadedBy: 'Healer Julian',
    },
    {
      id: 4,
      documentName: 'General_Waiver.pdf',
      patientName: 'Meera Singh',
      type: 'General',
      date: 'Oct 20, 2023',
      format: 'PDF',
      size: '0.8 MB',
      uploadedBy: 'Admin Staff David',
    },
  ]);

  // Security Timeline State (Interactive)
  const [activities, setActivities] = useState<SecurityActivity[]>([
    {
      id: 1,
      time: '10:45 AM',
      title: 'Arjun_Scan_V1.pdf Uploaded',
      user: 'Dr. Shailesh',
      details: '[Cardiology]',
      type: 'upload',
    },
    {
      id: 2,
      time: '09:15 AM',
      title: 'Access Granted: Lab Admin',
      user: 'Mumbai Main Terminal 04',
      details: '',
      type: 'access',
    },
    {
      id: 3,
      time: 'Yesterday',
      title: 'Unusual Access Attempt',
      user: 'IP: 192.168.1.14',
      details: '(Blocked)',
      type: 'warning',
    },
  ]);

  // Handle clicking the dashed dropzone
  const handleDropzoneClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle selecting a file from the hidden input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const fileName = files[0].name;
      triggerMockUpload(fileName, 'General', 'Guest Patient');
    }
  };

  // Simulates file encryption and uploading
  const triggerMockUpload = (fileName: string, type: 'Doctor Report' | 'Lab Result' | 'Consultation' | 'General', patient: string) => {
    if (isUploading) return;
    setIsUploading(true);
    setUploadProgress(0);
    setUploadingFileName(fileName);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const extension = (fileName.split('.').pop() || 'PDF').toUpperCase() as any;
            const newDoc: UploadedDocument = {
              id: Date.now(),
              documentName: fileName,
              patientName: patient || 'Guest Patient',
              type: type,
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              format: extension,
              size: `${(Math.random() * 5 + 1).toFixed(1)} MB`,
              uploadedBy: user?.name || 'Branch Admin',
            };

            // Prepend new document
            setDocuments((prevDocs) => [newDoc, ...prevDocs]);

            // Prepend new activity log
            const newAct: SecurityActivity = {
              id: Date.now(),
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              title: `${fileName} Uploaded`,
              user: user?.name || 'Branch Admin',
              details: `[${type}]`,
              type: 'upload',
            };
            setActivities((prevActs) => [newAct, ...prevActs]);

            setIsUploading(false);
            setUploadProgress(0);
            setUploadingFileName('');
          }, 300);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // Handle submitting from the modal
  const handleModalUploadSubmit = () => {
    if (!uploadForm.patientName || !uploadForm.selectedFileName) {
      alert('Please fill out all fields and select a file name.');
      return;
    }
    setShowUploadModal(false);
    triggerMockUpload(
      uploadForm.selectedFileName,
      uploadForm.documentType,
      uploadForm.patientName
    );
    // Reset form
    setUploadForm({
      patientName: '',
      documentType: 'Doctor Report',
      selectedFileName: '',
    });
  };

  // Filter logic
  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'All' || doc.type === filterType;

    return matchesSearch && matchesType;
  });

  // Dynamic values based on list length
  const totalDocsCount = 1280 + documents.length;
  const docReportsCount = 430 + documents.filter((d) => d.type === 'Doctor Report').length;
  const labReportsCount = 313 + documents.filter((d) => d.type === 'Lab Result').length;
  const consultNotesCount = 535 + documents.filter((d) => d.type === 'Consultation').length;
  const recentTodayCount = 20 + documents.length; // Dynamic today uploads

  // Pagination
  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage) || 1;
  const paginatedDocs = filteredDocs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType]);

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className="sa-page__toolbar-title">Document Workspace</IonTitle>
          <div className="dm-header-search">
            <IonIcon icon={searchOutline} className="dm-search-bar-icon" />
            <input
              type="text"
              placeholder="Search patients or files..."
              className="dm-search-bar-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <IonButtons slot="end">
            <button className="sa-page__toolbar-avatar">BA</button>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content">
        <div className="sa-page__body">
          {/* Action Row */}
          <div className="dm-action-row">
            <div className="dm-action-row__left">
              <h1 className="dm-action-row__title">Document Management</h1>
              <p className="dm-action-row__subtitle">
                Manage medical records, lab results, and healer assessments.
              </p>
            </div>
            <div className="dm-action-row__right">
              <button className="dm-action-btn dm-action-btn--outline">
                <IonIcon icon={downloadOutline} className="dm-btn-icon" />
                Export Records
              </button>
              <button className="dm-action-btn dm-action-btn--outline">
                <IonIcon icon={funnelOutline} className="dm-btn-icon" />
                Lab Reports
              </button>
              <button
                className="dm-action-btn dm-action-btn--primary"
                onClick={() => setShowUploadModal(true)}
              >
                <IonIcon icon={addOutline} className="dm-btn-icon dm-btn-icon--plus" />
                Upload Document
              </button>
            </div>
          </div>

          {/* Stat Cards Horizontal Row (5 Cards) */}
          <div className="dm-stats-row">
            <div className="dm-stat-card">
              <div className="dm-stat-card__main">
                <div className="dm-stat-card__left">
                  <div className="dm-stat-card__icon dm-stat-card__icon--teal">
                    <IonIcon icon={documentTextOutline} />
                  </div>
                  <div className="dm-stat-card__meta">
                    <span className="dm-stat-card__label">Total Documents</span>
                    <span className="dm-stat-card__value">{totalDocsCount.toLocaleString()}</span>
                  </div>
                </div>
                <span className="dm-stat-badge dm-stat-badge--success">+12%</span>
              </div>
            </div>

            <div className="dm-stat-card">
              <div className="dm-stat-card__main">
                <div className="dm-stat-card__left">
                  <div className="dm-stat-card__icon dm-stat-card__icon--blue">
                    <IonIcon icon={folderOpenOutline} />
                  </div>
                  <div className="dm-stat-card__meta">
                    <span className="dm-stat-card__label">Doctor Reports</span>
                    <span className="dm-stat-card__value">{docReportsCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dm-stat-card">
              <div className="dm-stat-card__main">
                <div className="dm-stat-card__left">
                  <div className="dm-stat-card__icon dm-stat-card__icon--red">
                    <IonIcon icon={pieChartOutline} />
                  </div>
                  <div className="dm-stat-card__meta">
                    <span className="dm-stat-card__label">Lab Reports</span>
                    <span className="dm-stat-card__value">{labReportsCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dm-stat-card">
              <div className="dm-stat-card__main">
                <div className="dm-stat-card__left">
                  <div className="dm-stat-card__icon dm-stat-card__icon--purple">
                    <IonIcon icon={documentOutline} />
                  </div>
                  <div className="dm-stat-card__meta">
                    <span className="dm-stat-card__label">Consultation Notes</span>
                    <span className="dm-stat-card__value">{consultNotesCount}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="dm-stat-card">
              <div className="dm-stat-card__main">
                <div className="dm-stat-card__left">
                  <div className="dm-stat-card__icon dm-stat-card__icon--green">
                    <IonIcon icon={checkmarkCircleOutline} />
                  </div>
                  <div className="dm-stat-card__meta">
                    <span className="dm-stat-card__label">Recent Uploads</span>
                    <span className="dm-stat-card__value">{recentTodayCount} <span className="dm-stat-subtext">Today</span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Column Layout Grid */}
          <div className="dm-workspace-grid">
            
            {/* COLUMN 1: Documents & Upload (50% span) */}
            <div className="dm-col dm-col--main">
              {/* Recently Uploaded Documents Panel */}
              <div className="dm-panel">
                <div className="dm-panel__header">
                  <h2 className="dm-panel__title">Recently Uploaded Documents</h2>
                  <div className="dm-panel__controls">
                    <div className="dm-panel-filter-tabs">
                      <button
                        className={`dm-filter-tab ${filterType === 'All' ? 'dm-filter-tab--active' : ''}`}
                        onClick={() => setFilterType('All')}
                      >
                        All
                      </button>
                      <button
                        className={`dm-filter-tab ${filterType === 'Doctor Report' ? 'dm-filter-tab--active' : ''}`}
                        onClick={() => setFilterType('Doctor Report')}
                      >
                        Reports
                      </button>
                      <button
                        className={`dm-filter-tab ${filterType === 'Lab Result' ? 'dm-filter-tab--active' : ''}`}
                        onClick={() => setFilterType('Lab Result')}
                      >
                        Lab
                      </button>
                    </div>
                    <button className="dm-icon-btn">
                      <IonIcon icon={ellipsisVerticalOutline} />
                    </button>
                  </div>
                </div>

                <div className="dm-table-container">
                  <table className="dm-table">
                    <thead>
                      <tr>
                        <th>DOCUMENT NAME</th>
                        <th>PATIENT NAME</th>
                        <th>TYPE</th>
                        <th>DATE</th>
                        <th>FORMAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedDocs.length > 0 ? (
                        paginatedDocs.map((doc) => (
                          <tr key={doc.id} className="dm-table-row">
                            <td className="dm-cell-docname">
                              <IonIcon icon={documentOutline} className="dm-cell-icon" />
                              <span className="dm-doc-title">{doc.documentName}</span>
                            </td>
                            <td className="dm-cell-patient">{doc.patientName}</td>
                            <td>
                              <span className={`dm-badge dm-badge--${doc.type.toLowerCase().replace(' ', '-')}`}>
                                {doc.type}
                              </span>
                            </td>
                            <td className="dm-cell-date">{doc.date}</td>
                            <td>
                              <span className={`dm-format dm-format--${doc.format.toLowerCase()}`}>
                                {doc.format}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="dm-table-empty">
                            No documents match your filter query.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination footer */}
                {totalPages > 1 && (
                  <div className="dm-pagination">
                    <button
                      className="dm-page-btn"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((c) => Math.max(c - 1, 1))}
                    >
                      <IonIcon icon={chevronBackOutline} />
                    </button>
                    <span className="dm-page-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      className="dm-page-btn"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((c) => Math.min(c + 1, totalPages))}
                    >
                      <IonIcon icon={chevronForwardOutline} />
                    </button>
                  </div>
                )}

                <div className="dm-panel__footer">
                  <button className="dm-view-all-btn">
                    View All Documents
                    <IonIcon icon={chevronForwardOutline} className="dm-view-all-arrow" />
                  </button>
                </div>
              </div>

              {/* Secure File Upload zone */}
              <div className="dm-panel">
                <div
                  className={`dm-upload-dropzone ${isUploading ? 'dm-upload-dropzone--uploading' : ''}`}
                  onClick={handleDropzoneClick}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                  />
                  <div className="dm-upload-dropzone__body">
                    <div className="dm-upload-cloud-icon">
                      <IonIcon icon={cloudUploadOutline} />
                    </div>
                    <h3 className="dm-upload-dropzone__title">Secure File Upload</h3>
                    <p className="dm-upload-dropzone__text">
                      Drag and drop patient files here, or <span className="dm-upload-link">click to browse</span> local storage.
                    </p>
                    <p className="dm-upload-dropzone__subtext">
                      Supported: PDF, JPG, PNG, DOCX (Max 25MB)
                    </p>
                  </div>
                </div>

                {/* Live Encrypting Animation */}
                {isUploading && (
                  <div className="dm-upload-progress-container">
                    <div className="dm-upload-progress-header">
                      <span className="dm-uploading-file-label">
                        Encrypting & Storing: <strong>{uploadingFileName}</strong>
                      </span>
                      <span className="dm-uploading-file-pct">{uploadProgress}%</span>
                    </div>
                    <div
                      className="dm-upload-progress-bar"
                      style={{ '--progress-pct': `${uploadProgress}%` } as React.CSSProperties}
                    ></div>
                    <span className="dm-uploading-subtext">Ready to encrypt and store...</span>
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 2: Reports, Activity, Distribution (25% span) */}
            <div className="dm-col dm-col--side">
              {/* Recent Reports Card */}
              <div className="dm-panel">
                <div className="dm-panel__header">
                  <h2 className="dm-panel__title">Recent Reports</h2>
                  <IonIcon icon={documentTextOutline} className="dm-panel-header-icon" />
                </div>
                <div className="dm-report-cards-list">
                  <div className="dm-report-item">
                    <div className="dm-report-item__left">
                      <div className="dm-report-item__circle-icon dm-report-item__circle-icon--blue">
                        <IonIcon icon={heartOutline} />
                      </div>
                      <div className="dm-report-item__meta">
                        <h4 className="dm-report-item__title">Cardiology Report</h4>
                        <span className="dm-report-item__patient">Patient: Kumar</span>
                      </div>
                    </div>
                    <button className="dm-report-action-icon">
                      <IonIcon icon={ellipsisVerticalOutline} />
                    </button>
                  </div>

                  <div className="dm-report-item">
                    <div className="dm-report-item__left">
                      <div className="dm-report-item__circle-icon dm-report-item__circle-icon--red">
                        <IonIcon icon={eyeOutline} />
                      </div>
                      <div className="dm-report-item__meta">
                        <h4 className="dm-report-item__title">Ophthalmology</h4>
                        <span className="dm-report-item__patient">Patient: Rao</span>
                      </div>
                    </div>
                    <button className="dm-report-action-icon">
                      <IonIcon icon={ellipsisVerticalOutline} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Lab Activity Tracker */}
              <div className="dm-panel">
                <div className="dm-panel__header">
                  <h2 className="dm-panel__title">Lab Activity</h2>
                </div>
                <div className="dm-lab-activity-list">
                  <div className="dm-lab-activity-row">
                    <div className="dm-lab-activity-item">
                      <div className="dm-lab-activity-bullet"></div>
                      <span className="dm-lab-activity-name">MRI Scan</span>
                    </div>
                    <span className="dm-lab-status dm-lab-status--ready">Ready</span>
                  </div>

                  <div className="dm-lab-activity-row">
                    <div className="dm-lab-activity-item">
                      <div className="dm-lab-activity-bullet dm-lab-activity-bullet--pending"></div>
                      <span className="dm-lab-activity-name">Blood Panel</span>
                    </div>
                    <span className="dm-lab-status dm-lab-status--pending">Pending</span>
                  </div>

                  <div className="dm-lab-activity-row">
                    <div className="dm-lab-activity-item">
                      <div className="dm-lab-activity-bullet"></div>
                      <span className="dm-lab-activity-name">X-Ray Chest</span>
                    </div>
                    <span className="dm-lab-status dm-lab-status--ready">Ready</span>
                  </div>
                </div>
              </div>

              {/* Distribution Ratios */}
              <div className="dm-panel">
                <div className="dm-panel__header">
                  <h2 className="dm-panel__title">Distribution</h2>
                </div>
                <div className="dm-distribution-list">
                  <div className="dm-distribution-row">
                    <div className="dm-dist-meta">
                      <span className="dm-dist-label">LAB REPORTS</span>
                      <span className="dm-dist-value">40%</span>
                    </div>
                    <div
                      className="dm-dist-bar dm-dist-bar--blue"
                      style={{ '--volume-pct': '40%' } as React.CSSProperties}
                    ></div>
                  </div>

                  <div className="dm-distribution-row">
                    <div className="dm-dist-meta">
                      <span className="dm-dist-label">DOCTOR DOCS</span>
                      <span className="dm-dist-value">30%</span>
                    </div>
                    <div
                      className="dm-dist-bar dm-dist-bar--teal"
                      style={{ '--volume-pct': '30%' } as React.CSSProperties}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN 3: Security & Access Control (25% span) */}
            <div className="dm-col dm-col--side">
              {/* Security & Activity Timeline */}
              <div className="dm-panel">
                <div className="dm-panel__header">
                  <h2 className="dm-panel__title">Security & Activity</h2>
                  <button className="dm-panel-close-btn">
                    <IonIcon icon={closeOutline} />
                  </button>
                </div>

                <div className="dm-timeline">
                  {activities.map((act) => (
                    <div className="dm-timeline-item" key={act.id}>
                      <div className="dm-timeline-meta">
                        <span className="dm-timeline-time">{act.time}</span>
                        <div className={`dm-timeline-dot dm-timeline-dot--${act.type}`}></div>
                      </div>
                      <div className="dm-timeline-content">
                        <span className="dm-timeline-title">
                          {act.title}
                        </span>
                        {act.user && (
                          <span className="dm-timeline-user">
                            By {act.user} {act.details && <strong className="dm-timeline-details">{act.details}</strong>}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cloud Storage Usage */}
              <div className="dm-panel">
                <div className="dm-panel__header">
                  <h2 className="dm-panel__title">Storage Usage</h2>
                </div>
                <div className="dm-storage-usage-body">
                  <div className="dm-storage-meta">
                    <span className="dm-storage-label">Cloud Storage</span>
                    <span className="dm-storage-value">72% used</span>
                  </div>
                  <div
                    className="dm-storage-progress-bar"
                    style={{ '--storage-pct': '72%' } as React.CSSProperties}
                  ></div>
                  <span className="dm-storage-backup-subtext">Scheduled backup: 12:00 AM IST</span>
                </div>
              </div>

              {/* Access Control (High-Contrast Teal Card) */}
              <div className="dm-access-card">
                <div className="dm-access-card__header">
                  <IonIcon icon={lockClosedOutline} className="dm-access-shield-icon" />
                  <h2 className="dm-access-card__title">Access Control</h2>
                </div>

                <div className="dm-access-branch-box">
                  <span className="dm-access-branch-label">CURRENT BRANCH</span>
                  <span className="dm-access-branch-val">{branchName}</span>
                </div>

                <div className="dm-access-metrics">
                  <div className="dm-access-row-item">
                    <span className="dm-access-item-label">AES-256 Encryption</span>
                    <div className="dm-green-indicator-dot"></div>
                  </div>

                  <div className="dm-access-row-item">
                    <span className="dm-access-item-label">Role-Based Access (RBAC)</span>
                    <IonIcon icon={shieldCheckmarkOutline} className="dm-green-check-icon" />
                  </div>

                  <div className="dm-access-row-item">
                    <span className="dm-access-item-label">Audit Logging</span>
                    <span className="dm-green-badge">ACTIVE</span>
                  </div>
                </div>

                <button className="dm-access-manage-btn">
                  Manage Permissions
                </button>
              </div>
            </div>

          </div>
        </div>
      </IonContent>

      {/* Upload Document Modal */}
      <IonModal isOpen={showUploadModal} onDidDismiss={() => setShowUploadModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Secure Document Upload</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowUploadModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Patient Name</label>
              <input
                type="text"
                className="sa-input"
                placeholder="Full Patient Name"
                value={uploadForm.patientName}
                onChange={(e) => setUploadForm({ ...uploadForm, patientName: e.target.value })}
              />
            </div>

            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Document Type</label>
              <select
                className="sa-input"
                value={uploadForm.documentType}
                onChange={(e) => setUploadForm({ ...uploadForm, documentType: e.target.value as any })}
              >
                <option value="Doctor Report">Doctor Report</option>
                <option value="Lab Result">Lab Result</option>
                <option value="Consultation">Consultation Notes</option>
                <option value="General">General Waiver</option>
              </select>
            </div>

            <div className="sa-settings__form-group">
              <label className="sa-settings__label">Document File Name</label>
              <input
                type="text"
                className="sa-input"
                placeholder="e.g. MRI_Scan_Final.pdf"
                value={uploadForm.selectedFileName}
                onChange={(e) => setUploadForm({ ...uploadForm, selectedFileName: e.target.value })}
              />
              <span className="dm-modal-tip">Include extension (.pdf, .jpg, .docx)</span>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </button>
            <button className="sa-btn sa-btn--primary" onClick={handleModalUploadSubmit}>
              Upload & Encrypt
            </button>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
};

export default DocumentManagementPage;
