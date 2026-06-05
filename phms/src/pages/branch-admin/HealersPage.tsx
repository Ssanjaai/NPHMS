import React, { useState, useEffect } from 'react';
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
  keyOutline,
  banOutline,
  personOutline,
  documentTextOutline,
  refreshOutline,
  trashOutline,
  timeOutline,
  checkboxOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import './branch-admin.css';

// ─── Interfaces & Structures ───────────────────────────────────────────────

export interface Healer {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  email: string;
  phone: string;
  address: string;
  certificationLevel: string;
  specialization: string[];
  experience: number;
  profilePhoto?: string;
  idProof?: string;
  status: 'ACTIVE' | 'INACTIVE';
  branch: string;
  createdAt: string;
  cumulativeHealingCount: number;
  completedSessions: number;
  pendingNotes: number;
  urgentFollowUps: number;
  avatarBg: string;
  initials: string;
  bio?: string;
}

export interface Patient {
  id: string;
  name: string;
  caseType: string;
  sessionCount: number;
  status: 'Active' | 'Completed' | 'Suspended';
  lastSessionDate: string;
  assignedHealerId: string;
}

export interface ReassignmentLog {
  id: string;
  patientId: string;
  patientName: string;
  prevHealer: string;
  newHealer: string;
  changedBy: string;
  timestamp: string;
  reason: string;
}

export interface AuditLog {
  id: string;
  action: string;
  details: string;
  changedBy: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'SMS' | 'Email' | 'In-App' | 'Dashboard Alert';
  recipient: string;
  message: string;
  timestamp: string;
}

// ─── Default Mock Data ───────────────────────────────────────────────────────

const INITIAL_HEALERS: Healer[] = [
  {
    id: 'H-2091',
    name: 'Dr. David Anselm',
    gender: 'Male',
    dob: '1985-05-12',
    email: 'david.a@phms.com',
    phone: '+91 98765 43210',
    address: 'Flat 402, Sea Breeze, Mumbai',
    certificationLevel: 'Master Healer (M1)',
    specialization: ['Stress Healing', 'Energy Cleansing', 'Aura Cleansing'],
    experience: 7,
    status: 'ACTIVE',
    branch: 'Mumbai',
    createdAt: '2021-01-15',
    cumulativeHealingCount: 458,
    completedSessions: 940,
    pendingNotes: 4,
    urgentFollowUps: 0,
    avatarBg: '#0f5b4b',
    initials: 'DA',
    bio: 'Specializes in stress management, corporate burnout recovery, and psychosomatic healing using advanced Pranic techniques.',
  },
  {
    id: 'H-2104',
    name: 'Elena Kovic',
    gender: 'Female',
    dob: '1992-08-23',
    email: 'e.kovic@phms.com',
    phone: '+91 98765 43211',
    address: 'Sector 15, Vashi, Mumbai',
    certificationLevel: 'Energy Cleansing Specialist',
    specialization: ['Energy Cleansing', 'Chakra Balancing'],
    experience: 4,
    status: 'ACTIVE',
    branch: 'Mumbai',
    createdAt: '2022-03-10',
    cumulativeHealingCount: 212,
    completedSessions: 520,
    pendingNotes: 0,
    urgentFollowUps: 2,
    avatarBg: '#1e40af',
    initials: 'EK',
    bio: 'Expert in aura cleansing, chakra balancing and advanced pranic healing for emotional trauma recovery.',
  },
  {
    id: 'H-1988',
    name: 'Marcus Jensen',
    gender: 'Male',
    dob: '1980-11-04',
    email: 'm.jensen@phms.com',
    phone: '+91 98765 43213',
    address: 'Camp Area, Pune',
    certificationLevel: 'Trauma Relief Certified',
    specialization: ['Grief Therapy', 'PTSD Care'],
    experience: 9,
    status: 'ACTIVE',
    branch: 'Pune',
    createdAt: '2019-08-01',
    cumulativeHealingCount: 89,
    completedSessions: 680,
    pendingNotes: 2,
    urgentFollowUps: 0,
    avatarBg: '#7c3aed',
    initials: 'MJ',
    bio: 'Handles cases of grief, loss, PTSD, and trauma recovery with compassionate pranic techniques.',
  },
  {
    id: 'H-1822',
    name: 'Dr. Anjali Rao',
    gender: 'Female',
    dob: '1978-04-18',
    email: 'anjali.rao@phms.com',
    phone: '+91 98765 43299',
    address: 'Bandra West, Mumbai',
    certificationLevel: 'Master Healer (M1)',
    specialization: ['Stress Healing', 'Grief Therapy'],
    experience: 12,
    status: 'ACTIVE',
    branch: 'Mumbai',
    createdAt: '2018-02-14',
    cumulativeHealingCount: 820,
    completedSessions: 1450,
    pendingNotes: 1,
    urgentFollowUps: 1,
    avatarBg: '#db2777',
    initials: 'AR',
    bio: 'A veteran master healer with deep expertise in psychotherapy and trauma mitigation.',
  },
  {
    id: 'H-1845',
    name: 'Dr. Kevin Smith',
    gender: 'Male',
    dob: '1983-09-30',
    email: 'kevin.smith@phms.com',
    phone: '+91 98765 43224',
    address: 'Powai, Mumbai',
    certificationLevel: 'Associate Healer',
    specialization: ['Energy Cleansing', 'Chakra Balancing'],
    experience: 6,
    status: 'INACTIVE',
    branch: 'Mumbai',
    createdAt: '2019-11-20',
    cumulativeHealingCount: 310,
    completedSessions: 720,
    pendingNotes: 0,
    urgentFollowUps: 0,
    avatarBg: '#b45309',
    initials: 'KS',
    bio: 'Associate healer passionate about basic chakra restoration and localized physical treatments.',
  }
];

const INITIAL_PATIENTS: Patient[] = [
  { id: '#P-101', name: 'Sarah Mitchell', caseType: 'Chronic Back Pain', sessionCount: 12, status: 'Active', lastSessionDate: '2026-05-20', assignedHealerId: 'H-2091' },
  { id: '#P-102', name: 'John Walker', caseType: 'Post-Trauma Recovery', sessionCount: 8, status: 'Active', lastSessionDate: '2026-05-22', assignedHealerId: 'H-2104' },
  { id: '#P-103', name: 'Elena Rostova', caseType: 'Generalized Anxiety', sessionCount: 15, status: 'Active', lastSessionDate: '2026-05-25', assignedHealerId: 'H-1822' },
  { id: '#P-104', name: 'Michael Chen', caseType: 'Corporate Burnout Recovery', sessionCount: 4, status: 'Active', lastSessionDate: '2026-05-26', assignedHealerId: 'H-2091' },
  { id: '#P-105', name: 'Emily Davis', caseType: 'Insomnia & Sleep Alignment', sessionCount: 0, status: 'Active', lastSessionDate: 'Never', assignedHealerId: 'H-1845' },
  { id: '#P-106', name: 'Rohan Mehta', caseType: 'Hypertension Management', sessionCount: 6, status: 'Active', lastSessionDate: '2026-05-18', assignedHealerId: 'H-1822' },
  { id: '#P-107', name: 'Priyah Sharma', caseType: 'Migraine Therapy', sessionCount: 2, status: 'Active', lastSessionDate: '2026-05-24', assignedHealerId: 'H-2091' }
];

const INITIAL_SESSION_HISTORY = [
  { sessionNumber: 'SES-912', patientName: 'Sarah Mitchell', treatmentType: 'Aura Cleansing', date: '2026-05-20', notesStatus: 'Completed', healerId: 'H-2091' },
  { sessionNumber: 'SES-913', patientName: 'Michael Chen', treatmentType: 'Stress Relief Protocol', date: '2026-05-26', notesStatus: 'Pending Notes', healerId: 'H-2091' },
  { sessionNumber: 'SES-914', patientName: 'John Walker', treatmentType: 'Chakra Energizer', date: '2026-05-22', notesStatus: 'Completed', healerId: 'H-2104' },
  { sessionNumber: 'SES-915', patientName: 'Elena Rostova', treatmentType: 'Psychotherapy Sweep', date: '2026-05-25', notesStatus: 'Completed', healerId: 'H-1822' },
  { sessionNumber: 'SES-916', patientName: 'Rohan Mehta', treatmentType: 'Pranic Purifying', date: '2026-05-18', notesStatus: 'Completed', healerId: 'H-1822' }
];

const INITIAL_AUDITS: AuditLog[] = [
  { id: 'A-901', action: 'SYSTEM_BOOT', details: 'Healer Management module loaded.', changedBy: 'System Engine', timestamp: '2026-05-27 10:00:00' }
];

const CERTIFICATIONS = [
  'Master Healer (M1)',
  'Energy Cleansing Specialist',
  'Trauma Relief Certified',
  'Associate Healer'
];

const SPECIALIZATIONS = [
  'Stress Healing',
  'Energy Cleansing',
  'Aura Cleansing',
  'Chakra Balancing',
  'Grief Therapy',
  'PTSD Care'
];

// ─── Main Component ──────────────────────────────────────────────────────────

const HealersPage: React.FC = () => {
  const { user } = useAuthStore();
  const history = useHistory();

  // ── Access Control Layer ──────────────────────────────────────────────────
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isBranchAdmin = user?.role === 'BRANCH_ADMIN';
  const isParaHealer = user?.role === 'HEALER';
  const isAuthenticated = !!user;

  // Resolve current branch
  const assignedBranch = typeof user?.branch === 'object' && user?.branch !== null
    ? (user.branch as any).name
    : (user?.branch || 'Mumbai');

  // ── Local Storage State Hook Up ───────────────────────────────────────────
  const [healers, setHealers] = useState<Healer[]>(() => {
    const saved = localStorage.getItem('phms_healers');
    return saved ? JSON.parse(saved) : INITIAL_HEALERS;
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem('phms_patients');
    return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
  });

  const [reassignmentLogs, setReassignmentLogs] = useState<ReassignmentLog[]>(() => {
    const saved = localStorage.getItem('phms_reassignment_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [audits, setAudits] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('phms_audits');
    return saved ? JSON.parse(saved) : INITIAL_AUDITS;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('phms_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('phms_healers', JSON.stringify(healers));
  }, [healers]);

  useEffect(() => {
    localStorage.setItem('phms_patients', JSON.stringify(patients));
  }, [patients]);

  useEffect(() => {
    localStorage.setItem('phms_reassignment_logs', JSON.stringify(reassignmentLogs));
  }, [reassignmentLogs]);

  useEffect(() => {
    localStorage.setItem('phms_audits', JSON.stringify(audits));
  }, [audits]);

  useEffect(() => {
    localStorage.setItem('phms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // ── Basic UI States ───────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [certFilter, setCertFilter] = useState('All');
  const [specFilter, setSpecFilter] = useState('All');
  const [patientCountFilter, setPatientCountFilter] = useState('All');

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, certFilter, specFilter, patientCountFilter]);

  // Selected healer details and modal flags
  const [selectedHealer, setSelectedHealer] = useState<Healer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showReassignModal, setShowReassignModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  // Form states
  const [addForm, setAddForm] = useState({
    name: '',
    gender: 'Female' as 'Male' | 'Female' | 'Other',
    dob: '',
    email: '',
    phone: '',
    address: '',
    certificationLevel: CERTIFICATIONS[0],
    specialization: [] as string[],
    experience: 0,
    status: true, // Toggle active by default
    bio: '',
  });

  const [editForm, setEditForm] = useState<Healer | null>(null);

  // Patient assignments working variables
  const [selectedPatientToReassign, setSelectedPatientToReassign] = useState<Patient | null>(null);
  const [reassignNewHealerId, setReassignNewHealerId] = useState('');
  const [reassignReason, setReassignReason] = useState('');

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Trigger brief visual toasts
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 5000);
  };

  // Helper function to log Audits
  const logAudit = (action: string, details: string) => {
    const newAudit: AuditLog = {
      id: `A-${Math.floor(1000 + Math.random() * 9000)}`,
      action,
      details,
      changedBy: user?.name || user?.email || 'Aria Seraphina',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAudits(prev => [newAudit, ...prev]);
  };

  // Helper function to send mock notifications
  const sendNotification = (type: 'SMS' | 'Email' | 'In-App' | 'Dashboard Alert', recipient: string, message: string) => {
    const newNotif: Notification = {
      id: `N-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      recipient,
      message,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // ── Security Access Check Redirections ────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <IonPage className="sa-page">
        <IonContent className="sa-page__content" fullscreen>
          <div className="db-access-restricted-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px' }}>
            <div className="db-access-restricted-card" style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #fee2e2', maxWidth: '500px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '60px', color: '#ef4444', marginBottom: '16px' }}><IonIcon icon={banOutline} /></div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Not Authenticated</h2>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>Please log in to access the Healer Management module.</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (user?.role === 'PATIENT') {
    return (
      <IonPage className="sa-page">
        <IonContent className="sa-page__content" fullscreen>
          <div className="db-access-restricted-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '24px' }}>
            <div className="db-access-restricted-card" style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #fee2e2', maxWidth: '500px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '60px', color: '#ef4444', marginBottom: '16px' }}><IonIcon icon={banOutline} /></div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Unauthorized Node Access</h2>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>Access Denied. The Healer Management workspace is restricted. Patients do not possess the required credentials to access this branch data.</p>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // ── Filter & Branch Limit Logic ──────────────────────────────────────────
  const filterHealersByAccess = () => {
    if (isParaHealer) {
      return healers.filter(h => h.email.toLowerCase() === user.email.toLowerCase());
    }
    if (isBranchAdmin) {
      return healers.filter(h => h.branch.toLowerCase() === assignedBranch.toLowerCase());
    }
    return healers;
  };

  const healersListByRole = filterHealersByAccess();

  const filteredHealers = healersListByRole.filter(h => {
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.phone.includes(searchQuery) ||
      h.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.specialization.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || h.status === statusFilter;
    const matchesCert = certFilter === 'All' || h.certificationLevel === certFilter;
    const matchesSpec = specFilter === 'All' || h.specialization.includes(specFilter);

    let matchesPatientCount = true;
    const activePatientCount = patients.filter(p => p.assignedHealerId === h.id && p.status === 'Active').length;
    if (patientCountFilter === 'None') {
      matchesPatientCount = activePatientCount === 0;
    } else if (patientCountFilter === '1-3') {
      matchesPatientCount = activePatientCount >= 1 && activePatientCount <= 3;
    } else if (patientCountFilter === '4+') {
      matchesPatientCount = activePatientCount >= 4;
    }

    return matchesSearch && matchesStatus && matchesCert && matchesSpec && matchesPatientCount;
  });

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredHealers.length / itemsPerPage) || 1;
  const paginatedHealers = filteredHealers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const totalHealers = healersListByRole.length;
  const activeHealers = healersListByRole.filter(h => h.status === 'ACTIVE').length;
  const inactiveHealers = healersListByRole.filter(h => h.status === 'INACTIVE').length;

  const totalHealingSessions = healersListByRole.reduce((sum, h) => sum + h.cumulativeHealingCount, 0);
  const totalAssignedPatients = patients.filter(p => 
    p.status === 'Active' && 
    healersListByRole.some(h => h.id === p.assignedHealerId)
  ).length;

  const totalUrgentCases = healersListByRole.reduce((sum, h) => sum + h.urgentFollowUps, 0);

  // ── Operations Flows ──────────────────────────────────────────────────────

  const handleAddHealerSubmit = (e: React.FormEvent, andAddAnother = false) => {
    e.preventDefault();

    if (!addForm.name || !addForm.dob || !addForm.email || !addForm.phone || !addForm.address || addForm.specialization.length === 0) {
      triggerError('Please fill all mandatory fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(addForm.email)) {
      triggerError('Enter valid email address.');
      return;
    }

    if (addForm.experience < 0) {
      triggerError('Experience cannot be negative.');
      return;
    }

    const emailExists = healers.some(h => h.email.toLowerCase() === addForm.email.toLowerCase());
    if (emailExists) {
      triggerError('Email already exists.');
      return;
    }

    const phoneExists = healers.some(h => h.phone.replace(/[\s+-]/g, '') === addForm.phone.replace(/[\s+-]/g, ''));
    if (phoneExists) {
      triggerError('Phone number already exists.');
      return;
    }

    const cleanName = addForm.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const genUsername = `${cleanName}_${Math.floor(10 + Math.random() * 90)}`;
    const genPassword = `PHMS-${Math.random().toString(36).substring(2, 7).toUpperCase()}#${Math.floor(10 + Math.random() * 90)}`;

    const healerId = `H-${Math.floor(1000 + Math.random() * 9000)}`;

    const newHealer: Healer = {
      id: healerId,
      name: addForm.name,
      gender: addForm.gender,
      dob: addForm.dob,
      email: addForm.email,
      phone: addForm.phone,
      address: addForm.address,
      certificationLevel: addForm.certificationLevel,
      specialization: addForm.specialization,
      experience: Number(addForm.experience),
      status: addForm.status ? 'ACTIVE' : 'INACTIVE',
      branch: assignedBranch,
      createdAt: new Date().toISOString().split('T')[0],
      cumulativeHealingCount: 0,
      completedSessions: 0,
      pendingNotes: 0,
      urgentFollowUps: 0,
      avatarBg: ['#0f5b4b', '#1e40af', '#7c3aed', '#db2777', '#b45309'][Math.floor(Math.random() * 5)],
      initials: addForm.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase(),
      bio: addForm.bio || `Certified healer specializing in ${addForm.specialization.join(', ')}.`,
    };

    setHealers(prev => [...prev, newHealer]);

    sendNotification('SMS', addForm.phone, `Welcome Dr. ${addForm.name}. Your account created. Username: ${genUsername}, Temp Pass: ${genPassword}`);
    sendNotification('Email', addForm.email, `Dear Dr. ${addForm.name}, Welcome to PHMS. Your healer credentials: Username: ${genUsername}, Password: ${genPassword}`);
    logAudit('HEALER_CREATION', `Created healer ${addForm.name} (ID: ${healerId}) assigned to branch ${assignedBranch}. Auto-credentials dispatched.`);

    triggerToast('Healer account created successfully.');

    if (andAddAnother) {
      setAddForm({
        name: '',
        gender: 'Female',
        dob: '',
        email: '',
        phone: '',
        address: '',
        certificationLevel: CERTIFICATIONS[0],
        specialization: [],
        experience: 0,
        status: true,
        bio: '',
      });
    } else {
      setShowAddModal(false);
      setAddForm({
        name: '',
        gender: 'Female',
        dob: '',
        email: '',
        phone: '',
        address: '',
        certificationLevel: CERTIFICATIONS[0],
        specialization: [],
        experience: 0,
        status: true,
        bio: '',
      });
    }
  };

  const handleEditHealerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm) return;

    if (!editForm.email || !editForm.phone || !editForm.address) {
      triggerError('Please fill all mandatory fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editForm.email)) {
      triggerError('Enter valid email address.');
      return;
    }

    if (editForm.experience < 0) {
      triggerError('Experience cannot be negative.');
      return;
    }

    const emailExists = healers.some(h => h.id !== editForm.id && h.email.toLowerCase() === editForm.email.toLowerCase());
    if (emailExists) {
      triggerError('Email already exists.');
      return;
    }

    const phoneExists = healers.some(h => h.id !== editForm.id && h.phone.replace(/[\s+-]/g, '') === editForm.phone.replace(/[\s+-]/g, ''));
    if (phoneExists) {
      triggerError('Phone number already exists.');
      return;
    }

    const oldHealerObj = healers.find(h => h.id === editForm.id);
    if (oldHealerObj && oldHealerObj.status === 'ACTIVE' && editForm.status === 'INACTIVE') {
      if (oldHealerObj.urgentFollowUps > 0) {
        triggerError('Cannot deactivate healer with active urgent follow-up cases.');
        return;
      }
      const activePats = patients.filter(p => p.assignedHealerId === editForm.id && p.status === 'Active');
      if (activePats.length > 0) {
        triggerError(`Reassignment required before deactivation. Healer has ${activePats.length} active patients.`);
        return;
      }
    }

    setHealers(prev => prev.map(h => h.id === editForm.id ? editForm : h));
    logAudit('HEALER_UPDATE', `Updated profile of healer ${editForm.name} (ID: ${editForm.id}).`);
    triggerToast('Healer profile updated successfully.');
    setShowEditModal(false);

    if (selectedHealer && selectedHealer.id === editForm.id) {
      setSelectedHealer(editForm);
    }
  };

  const handleAssignPatient = (patientId: string, healerId: string) => {
    const pat = patients.find(p => p.id === patientId);
    const healer = healers.find(h => h.id === healerId);
    if (!pat || !healer) return;

    if (pat.assignedHealerId === healerId) {
      triggerError('Patient is already assigned to this healer.');
      return;
    }

    const oldHealerId = pat.assignedHealerId;
    const oldHealerName = healers.find(h => h.id === oldHealerId)?.name || 'None';

    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, assignedHealerId: healerId } : p));
    
    const timestampString = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog: ReassignmentLog = {
      id: `R-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId,
      patientName: pat.name,
      prevHealer: oldHealerName,
      newHealer: healer.name,
      changedBy: user?.name || user?.email || 'Aria Seraphina',
      timestamp: timestampString,
      reason: 'Manual reassignment by Admin',
    };
    setReassignmentLogs(prev => [newLog, ...prev]);

    sendNotification('In-App', healer.name, `New Patient Assigned: ${pat.name} linked to your workload.`);
    logAudit('PATIENT_ASSIGNMENT', `Assigned Patient ${pat.name} (ID: ${patientId}) to Healer ${healer.name} (ID: ${healerId}).`);
    triggerToast(`Patient ${pat.name} successfully assigned.`);
    setShowAssignModal(false);
  };

  const handlePatientReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientToReassign || !reassignNewHealerId) {
      triggerError('Please select a new healer.');
      return;
    }

    const patientId = selectedPatientToReassign.id;
    const healerId = reassignNewHealerId;
    const pat = patients.find(p => p.id === patientId);
    const healer = healers.find(h => h.id === healerId);
    if (!pat || !healer) return;

    const oldHealerId = pat.assignedHealerId;
    const oldHealerName = healers.find(h => h.id === oldHealerId)?.name || 'None';

    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, assignedHealerId: healerId } : p));

    const timestampString = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog: ReassignmentLog = {
      id: `R-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId,
      patientName: pat.name,
      prevHealer: oldHealerName,
      newHealer: healer.name,
      changedBy: user?.name || user?.email || 'Aria Seraphina',
      timestamp: timestampString,
      reason: reassignReason || 'Reassigned during workload balancing',
    };
    setReassignmentLogs(prev => [newLog, ...prev]);

    sendNotification('In-App', healer.name, `New Patient Reassigned: ${pat.name} linked to your workload. Reason: ${reassignReason}`);
    logAudit('PATIENT_REASSIGNMENT', `Reassigned Patient ${pat.name} from Healer ${oldHealerName} to ${healer.name}. Reason: ${reassignReason}`);
    triggerToast(`Patient ${pat.name} reassigned to ${healer.name}.`);

    setShowReassignModal(false);
    setSelectedPatientToReassign(null);
    setReassignNewHealerId('');
    setReassignReason('');
  };

  const handleRemovePatientAssignment = (patientId: string) => {
    const pat = patients.find(p => p.id === patientId);
    if (!pat) return;

    const oldHealerId = pat.assignedHealerId;
    const oldHealerName = healers.find(h => h.id === oldHealerId)?.name || 'None';

    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, assignedHealerId: '' } : p));

    const timestampString = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog: ReassignmentLog = {
      id: `R-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId,
      patientName: pat.name,
      prevHealer: oldHealerName,
      newHealer: 'Unassigned',
      changedBy: user?.name || user?.email || 'Aria Seraphina',
      timestamp: timestampString,
      reason: 'Removed from healer caseload',
    };
    setReassignmentLogs(prev => [newLog, ...prev]);

    logAudit('PATIENT_DEASSIGNMENT', `Unassigned Patient ${pat.name} from Healer ${oldHealerName}.`);
    triggerToast(`Patient ${pat.name} removed from caseload.`);
  };

  const handleDeactivateHealer = (healerId: string) => {
    const healer = healers.find(h => h.id === healerId);
    if (!healer) return;

    if (healer.urgentFollowUps > 0) {
      triggerError('Cannot deactivate healer with active urgent follow-up cases.');
      setShowDeactivateModal(false);
      return;
    }

    const activePats = patients.filter(p => p.assignedHealerId === healerId && p.status === 'Active');
    if (activePats.length > 0) {
      triggerError(`Reassignment required before deactivation. Healer has ${activePats.length} active patients.`);
      setShowDeactivateModal(false);
      return;
    }

    setHealers(prev => prev.map(h => h.id === healerId ? { ...h, status: 'INACTIVE' } : h));
    logAudit('HEALER_DEACTIVATION', `Deactivated healer account ${healer.name} (ID: ${healerId}). Login disabled.`);
    sendNotification('Email', healer.email, `Your healer portal login has been temporarily disabled.`);
    triggerToast(`Healer ${healer.name} deactivated.`);
    
    if (selectedHealer && selectedHealer.id === healerId) {
      setSelectedHealer({ ...selectedHealer, status: 'INACTIVE' });
    }
    setShowDeactivateModal(false);
  };

  const handleResetPassword = (healerId: string) => {
    const healer = healers.find(h => h.id === healerId);
    if (!healer) return;

    const newPass = `PHMS-${Math.random().toString(36).substring(2, 7).toUpperCase()}#${Math.floor(10 + Math.random() * 90)}`;
    
    sendNotification('SMS', healer.phone, `Your healer password has been reset by Branch Admin. New Pass: ${newPass}`);
    sendNotification('Email', healer.email, `Dear Dr. ${healer.name}, Your credentials have been reset. Password: ${newPass}`);
    logAudit('PASSWORD_RESET', `Reset login credentials for Healer ${healer.name} (ID: ${healerId}). Credentials dispatched.`);
    
    triggerToast('Password reset successfully. Credentials sent via SMS + Email.');
    setShowResetPasswordModal(false);
  };

  const handleExport = (reportType: string, format: 'PDF' | 'Excel') => {
    logAudit('REPORT_EXPORT', `Exported ${reportType} as ${format} format.`);
    triggerToast(`Successfully downloaded "${reportType}" report as ${format}.`);
  };

  return (
    <IonPage className="sa-page">
      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar" style={{ '--background': '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
          <IonButtons slot="start">
            <IonMenuButton style={{ color: 'var(--ba-color-primary)' }} />
          </IonButtons>

          <div className="db-toolbar-content">
            {/* Left Header Info */}
            <div className="db-toolbar-left">
              <h1 className="db-page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IonIcon icon={leafOutline} style={{ color: 'var(--ba-color-primary)', fontSize: '24px' }} />
                Healer Management
              </h1>
              <p className="db-page-subtitle">Healer Registry, Certifications, Caseload and Reassignments</p>
            </div>

            {/* Add Healer Button */}
            <button 
              onClick={() => history.push('/branch-admin/healers/create')}
              className="st-btn st-btn--primary" 
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <IonIcon icon={addOutline} /> Add New Healer
            </button>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content" fullscreen>
        <div className="sa-page__body" style={{ padding: '24px', background: '#f8fafc', minHeight: '100%' }}>

          {/* ── TOAST NOTIFICATIONS ────────────────────────────────────────── */}
          {toastMessage && (
            <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#0f5b4b', color: '#fff', padding: '12px 24px', borderRadius: '8px', zIndex: 100000, boxShadow: '0 10px 25px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideIn 0.3s ease' }}>
              <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '20px' }} />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>{toastMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: '#ef4444', color: '#fff', padding: '12px 24px', borderRadius: '8px', zIndex: 100000, boxShadow: '0 10px 25px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '10px', animation: 'slideIn 0.3s ease' }}>
              <IonIcon icon={alertCircleOutline} style={{ fontSize: '20px' }} />
              <span style={{ fontSize: '13px', fontWeight: 700 }}>{errorMessage}</span>
            </div>
          )}

          {/* ── PARA HEALER VIEW ONLY REDIRECTION ───────────────────────────── */}
          {isParaHealer ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#1e293b', marginBottom: '4px' }}>Para Healer Access Panel</h2>
                <p style={{ color: '#64748b', fontSize: '13px' }}>Under strict clinical guidelines, Para Healers are authorized to view their own profile and caseloads only.</p>
              </div>

              {healersListByRole.map(healer => (
                <div key={healer.id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px' }}>
                  {/* Basic Profile Details */}
                  <div style={{ display: 'flex', gap: '24px', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '24px', marginBottom: '24px' }}>
                    <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: healer.avatarBg, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: 800 }}>
                      {healer.initials}
                    </div>
                    <div>
                      <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Dr. {healer.name}</h1>
                      <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>ID: {healer.id} • Branch: {healer.branch} • Joined: {healer.createdAt}</div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        {healer.specialization.map((spec, i) => (
                          <span key={i} style={{ padding: '3px 10px', background: '#d1fae5', color: '#065f46', borderRadius: '20px', fontSize: '11px', fontWeight: 700 }}>{spec}</span>
                        ))}
                        <span className={`sa-badge sa-badge--active`}>{healer.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Bio */}
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', marginBottom: '24px', borderLeft: '4px solid var(--ba-color-primary)' }}>
                    <h3 style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#475569' }}>Professional Bio</h3>
                    <p style={{ margin: 0, fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>{healer.bio}</p>
                  </div>

                  {/* Caseload stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ba-color-primary)' }}>{healer.experience} yrs</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Experience</div>
                    </div>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ba-color-primary)' }}>{patients.filter(p => p.assignedHealerId === healer.id && p.status === 'Active').length}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Active Patients</div>
                    </div>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--ba-color-primary)' }}>{healer.cumulativeHealingCount}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Cumulative Sessions</div>
                    </div>
                    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 800, color: '#ef4444' }}>{healer.urgentFollowUps}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginTop: '4px' }}>Urgent Follow-ups</div>
                    </div>
                  </div>

                  {/* Personal Assigned Caseload List */}
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>Your Assigned Active Patients</h3>
                  <table className="sa-table" style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>Patient ID</th>
                        <th>Name</th>
                        <th>Condition Case</th>
                        <th>Sessions</th>
                        <th>Last Treatment</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.filter(p => p.assignedHealerId === healer.id).map(p => (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 700 }}>{p.id}</td>
                          <td style={{ fontWeight: 700, color: 'var(--ba-color-primary)' }}>{p.name}</td>
                          <td>{p.caseType}</td>
                          <td>{p.sessionCount} Sessions</td>
                          <td>{p.lastSessionDate}</td>
                          <td>
                            <span className="sa-badge sa-badge--active">{p.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Dynamic Dashboard Widgets */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div className="sa-stat-card" style={{ background: '#fff', borderLeft: '4px solid var(--ba-color-primary)' }}>
                  <div>
                    <div className="sa-stat-card__label">Total Healers</div>
                    <div className="sa-stat-card__value" style={{ fontSize: '24px' }}>{totalHealers}</div>
                    <div className="sa-stat-card__detail">All registered staff</div>
                  </div>
                </div>

                <div className="sa-stat-card" style={{ background: '#fff', borderLeft: '4px solid #10b981' }}>
                  <div>
                    <div className="sa-stat-card__label">Active Healers</div>
                    <div className="sa-stat-card__value" style={{ fontSize: '24px', color: '#10b981' }}>{activeHealers}</div>
                    <div className="sa-stat-card__detail">Online & Available</div>
                  </div>
                </div>

                <div className="sa-stat-card" style={{ background: '#fff', borderLeft: '4px solid #64748b' }}>
                  <div>
                    <div className="sa-stat-card__label">Inactive Healers</div>
                    <div className="sa-stat-card__value" style={{ fontSize: '24px', color: '#64748b' }}>{inactiveHealers}</div>
                    <div className="sa-stat-card__detail">On leave/deactivated</div>
                  </div>
                </div>

                <div className="sa-stat-card" style={{ background: '#fff', borderLeft: '4px solid #fbbf24' }}>
                  <div>
                    <div className="sa-stat-card__label">Total Healing Count</div>
                    <div className="sa-stat-card__value" style={{ fontSize: '24px', color: '#d97706' }}>{totalHealingSessions}</div>
                    <div className="sa-stat-card__detail">Cumulative sessions</div>
                  </div>
                </div>

                <div className="sa-stat-card" style={{ background: '#fff', borderLeft: '4px solid #3b82f6' }}>
                  <div>
                    <div className="sa-stat-card__label">Total Assigned Patients</div>
                    <div className="sa-stat-card__value" style={{ fontSize: '24px', color: '#2563eb' }}>{totalAssignedPatients}</div>
                    <div className="sa-stat-card__detail">Active workload link</div>
                  </div>
                </div>

                <div className="sa-stat-card" style={{ background: '#fff', borderLeft: '4px solid #ef4444' }}>
                  <div>
                    <div className="sa-stat-card__label">Urgent Cases</div>
                    <div className="sa-stat-card__value" style={{ fontSize: '24px', color: '#ef4444' }}>{totalUrgentCases}</div>
                    <div className="sa-stat-card__detail" style={{ color: '#b91c1c', display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <IonIcon icon={alertCircleOutline} /> Follow-ups flagged
                    </div>
                  </div>
                </div>
              </div>

              {/* Healers Registry Module */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Search & Filters */}
                <div className="sa-section" style={{ margin: 0, padding: '20px', background: '#fff', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between' }}>
                    
                    {/* Search Bar */}
                    <div style={{ position: 'relative', minWidth: '280px' }}>
                      <IonIcon icon={searchOutline} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '16px' }} />
                      <input
                        type="text"
                        placeholder="Search Name, Phone, Email, Specialization..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{ padding: '8px 12px 8px 36px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#f8fafc', outline: 'none', width: '100%', color: '#1e293b' }}
                      />
                    </div>

                    {/* Status filter */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <select 
                        value={statusFilter} 
                        onChange={e => setStatusFilter(e.target.value)}
                        style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', background: '#fff', color: '#1e293b' }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                      </select>
                    </div>

                    {/* Certification level filter */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                     
                      <select 
                        value={certFilter} 
                        onChange={e => setCertFilter(e.target.value)}
                        style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', background: '#fff', color: '#1e293b' }}
                      >
                        <option value="All">All Certifications</option>
                        {CERTIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* Specialization Filter */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#475569' }}>Specialization:</span>
                      <select 
                        value={specFilter} 
                        onChange={e => setSpecFilter(e.target.value)}
                        style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '12px', background: '#fff', color: '#1e293b' }}
                      >
                        <option value="All">All</option>
                        {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>

                    

                  </div>
                </div>

                {/* Actions Header Bar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                    Showing <strong style={{ color: 'var(--ba-color-primary)' }}>{filteredHealers.length}</strong> Healers in {assignedBranch} Branch
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      onClick={() => handleExport('Healer Performance Report', 'PDF')}
                      className="sa-btn sa-btn--outline" 
                      style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <IonIcon icon={downloadOutline} /> PDF Report
                    </button>
                    <button 
                      onClick={() => handleExport('Healer Performance Report', 'Excel')}
                      className="sa-btn sa-btn--outline" 
                      style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <IonIcon icon={downloadOutline} /> Excel Report
                    </button>
                  </div>
                </div>

                {/* Healers Table */}
                <div className="sa-section" style={{ margin: 0, padding: 0, overflow: 'hidden', background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="sa-table">
                      <thead>
                        <tr>
                          <th style={{ padding: '12px 16px' }}>HEALER</th>
                          <th>SPECIALTY</th>
                          <th>BRANCH</th>
                          <th>EXP. (YRS)</th>
                          <th>CURRENT PATIENT</th>
                          <th>STATUS</th>
                          <th style={{ textAlign: 'center' }}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedHealers.map(healer => {
                          const actCount = patients.filter(p => p.assignedHealerId === healer.id && p.status === 'Active').length;
                          return (
                            <tr key={healer.id} style={{ cursor: 'pointer' }} onClick={() => history.push(`/branch-admin/healers/detail/${healer.id}`)}>
                              <td style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                  <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#f1f5f9', color: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>
                                    {healer.initials}
                                  </div>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                    <span style={{ fontWeight: 700, color: '#0d5c46', fontSize: '14px' }}>Dr. {healer.name}</span>
                                    <span style={{ fontSize: '12px', color: '#64748b' }}>{healer.email}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>
                                  {healer.specialization.join(' & ')}
                                </span>
                              </td>
                              <td>
                                <span style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>
                                  {assignedBranch}
                                </span>
                              </td>
                              <td>
                                <span style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>
                                  {healer.experience} Years
                                </span>
                              </td>
                              <td>
                                <span style={{ fontSize: '13px', color: '#334155', fontWeight: 500 }}>
                                  {actCount} Patients
                                </span>
                              </td>
                              <td>
                                <span style={{ 
                                  fontSize: '11px', 
                                  fontWeight: 700, 
                                  padding: '4px 10px', 
                                  borderRadius: '9999px', 
                                  textTransform: 'uppercase',
                                  background: healer.status === 'ACTIVE' ? '#ecfdf5' : '#fef2f2',
                                  color: healer.status === 'ACTIVE' ? '#10b981' : '#ef4444',
                                  display: 'inline-block'
                                }}>
                                  {healer.status}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }} onClick={e => e.stopPropagation()}>
                                  <button 
                                    className="sa-action-btn sa-action-btn--view" 
                                    title="View details"
                                    onClick={() => history.push(`/branch-admin/healers/detail/${healer.id}`)}
                                  >
                                    <IonIcon icon={eyeOutline} />
                                  </button>
                                  <button 
                                    className="sa-action-btn sa-action-btn--edit" 
                                    title="Edit Profile"
                                    onClick={() => history.push(`/branch-admin/healers/edit/${healer.id}`)}
                                  >
                                    <IonIcon icon={pencilOutline} />
                                  </button>
                                  <button 
                                    className="sa-action-btn sa-action-btn--delete" 
                                    title="Deactivate Healer"
                                    onClick={() => {
                                      setSelectedHealer(healer);
                                      setShowDeactivateModal(true);
                                    }}
                                  >
                                    <IonIcon icon={trashOutline} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {filteredHealers.length === 0 && (
                          <tr>
                            <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontSize: '13px' }}>
                              No healers found matching the filters or query.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination Controls */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginTop: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
                    >
                      &lt;
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                      <button 
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        style={{ 
                          width: '36px', 
                          height: '36px', 
                          borderRadius: '8px', 
                          border: currentPage === pageNumber ? 'none' : '1px solid #cbd5e1', 
                          background: currentPage === pageNumber ? '#0d5c46' : '#fff', 
                          color: currentPage === pageNumber ? '#fff' : '#64748b', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          fontWeight: 'bold', 
                          cursor: 'pointer' 
                        }}
                      >
                        {pageNumber}
                      </button>
                    ))}
                    <button 
                      onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      style={{ width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
                    >
                      &gt;
                    </button>
                  </div>
                  <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>
                    Showing {filteredHealers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredHealers.length)} of {filteredHealers.length} healers
                  </span>
                </div>
              </div>

             

              {/* Reports Section */}
              {/* <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h3 style={{ margin: '8px 0 0 0', fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>Simulated Reports Generation</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                  {[
                    { title: 'Healer Performance Report', desc: 'Breakdown of ratings, sessions, and workloads.', reportKey: 'Healer Performance Report' },
                    { title: 'Healing Count Report', desc: 'Branch cumulative session volumes and monthly trends.', reportKey: 'Healing Count Report' },
                    { title: 'Assigned Patient Report', desc: 'Active workload linkages and schedules.', reportKey: 'Assigned Patient Report' },
                    { title: 'Pending Notes Report', desc: 'Completed sessions awaiting clinical logs.', reportKey: 'Pending Notes Report' },
                  ].map((rep, idx) => (
                    <div key={idx} style={{ background: '#fff', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '22px', color: 'var(--ba-color-primary)', marginBottom: '4px' }}><IonIcon icon={documentTextOutline} /></div>
                        <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>{rep.title}</h4>
                        <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#64748b', lineHeight: 1.4 }}>{rep.desc}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                        <button onClick={() => handleExport(rep.reportKey, 'PDF')} className="sa-btn sa-btn--outline" style={{ flex: 1, justifyContent: 'center', fontSize: '10px', padding: '4px 0' }}>
                          PDF
                        </button>
                        <button onClick={() => handleExport(rep.reportKey, 'Excel')} className="sa-btn sa-btn--outline" style={{ flex: 1, justifyContent: 'center', fontSize: '10px', padding: '4px 0' }}>
                          Excel
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div> */}

              
            </div>
          )}
        </div>
      </IonContent>

     

      {/* ── MODAL: ADD HEALER FORM ──────────────────────────────────────── */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '650px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IonIcon icon={addOutline} style={{ color: 'var(--ba-color-primary)' }} /> Add New Healer Profile
              </h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}><IonIcon icon={closeOutline} /></button>
            </div>

            <form onSubmit={e => handleAddHealerSubmit(e, false)}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={addForm.name}
                    onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Gender *</label>
                  <select
                    value={addForm.gender}
                    onChange={e => setAddForm({ ...addForm, gender: e.target.value as any })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={addForm.dob}
                    onChange={e => setAddForm({ ...addForm, dob: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Experience (Years) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="Experience in years"
                    value={addForm.experience}
                    onChange={e => setAddForm({ ...addForm, experience: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@phms.com"
                    value={addForm.email}
                    onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={addForm.phone}
                    onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Certification Level *</label>
                  <select
                    value={addForm.certificationLevel}
                    onChange={e => setAddForm({ ...addForm, certificationLevel: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#fff' }}
                  >
                    {CERTIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Status Default Toggle</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '40px' }}>
                    <input
                      type="checkbox"
                      checked={addForm.status}
                      onChange={e => setAddForm({ ...addForm, status: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '13px', color: '#475569' }}>ACTIVE (Enabled on login node)</span>
                  </div>
                </div>
              </div>

              {/* Specialization selection - checkboxes */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Specializations (Select Multiple) *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {SPECIALIZATIONS.map(spec => {
                    const isChecked = addForm.specialization.includes(spec);
                    return (
                      <div key={spec} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="checkbox"
                          id={`spec-${spec}`}
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setAddForm({ ...addForm, specialization: addForm.specialization.filter(s => s !== spec) });
                            } else {
                              setAddForm({ ...addForm, specialization: [...addForm.specialization, spec] });
                            }
                          }}
                          style={{ cursor: 'pointer' }}
                        />
                        <label htmlFor={`spec-${spec}`} style={{ fontSize: '12px', color: '#475569', cursor: 'pointer' }}>{spec}</label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Full Residential Address *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Street name, landmark, city"
                  value={addForm.address}
                  onChange={e => setAddForm({ ...addForm, address: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', resize: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Clinical Healer Biography (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Specializations summary..."
                  value={addForm.bio}
                  onChange={e => setAddForm({ ...addForm, bio: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', resize: 'none' }}
                />
              </div>

              {/* Form buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setAddForm({
                      name: '',
                      gender: 'Female',
                      dob: '',
                      email: '',
                      phone: '',
                      address: '',
                      certificationLevel: CERTIFICATIONS[0],
                      specialization: [],
                      experience: 0,
                      status: true,
                      bio: '',
                    });
                  }}
                  className="sa-btn sa-btn--outline"
                  style={{ fontSize: '12px', padding: '8px 16px' }}
                >
                  Reset Form
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="sa-btn sa-btn--outline"
                  style={{ fontSize: '12px', padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={e => handleAddHealerSubmit(e, true)}
                  className="sa-btn sa-btn--outline"
                  style={{ fontSize: '12px', padding: '8px 16px', background: '#e0f2fe', color: '#0369a1' }}
                >
                  Save & Add Another
                </button>
                <button
                  type="submit"
                  className="sa-btn sa-btn--primary"
                  style={{ fontSize: '12px', padding: '8px 20px' }}
                >
                  Save Profile
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ── MODAL: EDIT HEALER PROFILE ───────────────────────────────────── */}
      {showEditModal && editForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '650px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IonIcon icon={pencilOutline} style={{ color: 'var(--ba-color-primary)' }} /> Edit Healer Profile: {editForm.name}
              </h2>
              <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}><IonIcon icon={closeOutline} /></button>
            </div>

            <form onSubmit={handleEditHealerSubmit}>
              {/* Locks indicator */}
              <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', borderLeft: '3px solid #cbd5e1', fontSize: '11px', color: '#64748b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IonIcon icon={alertCircleOutline} />
                <span>Healer ID, assigned branch, creation date, and cumulative healing count are locked security elements and cannot be edited.</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                {/* LOCKED fields */}
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Healer ID (Locked)</label>
                  <input
                    type="text"
                    disabled
                    value={editForm.id}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Branch (Locked)</label>
                  <input
                    type="text"
                    disabled
                    value={editForm.branch}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Created Date (Locked)</label>
                  <input
                    type="text"
                    disabled
                    value={editForm.createdAt}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Healing Session Count (Locked)</label>
                  <input
                    type="text"
                    disabled
                    value={editForm.cumulativeHealingCount}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#f1f5f9', color: '#64748b', cursor: 'not-allowed' }}
                  />
                </div>

                {/* EDITABLE FIELDS */}
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    value={editForm.email}
                    onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Experience (Years) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={editForm.experience}
                    onChange={e => setEditForm({ ...editForm, experience: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Certification Level *</label>
                  <select
                    value={editForm.certificationLevel}
                    onChange={e => setEditForm({ ...editForm, certificationLevel: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#fff' }}
                  >
                    {CERTIFICATIONS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Status (ACTIVE/INACTIVE)</label>
                  <select
                    value={editForm.status}
                    onChange={e => setEditForm({ ...editForm, status: e.target.value as any })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>

              {/* Specialization multiple checkboxes */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Specializations *</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {SPECIALIZATIONS.map(spec => {
                    const isChecked = editForm.specialization.includes(spec);
                    return (
                      <div key={spec} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="checkbox"
                          id={`edit-spec-${spec}`}
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setEditForm({ ...editForm, specialization: editForm.specialization.filter(s => s !== spec) });
                            } else {
                              setEditForm({ ...editForm, specialization: [...editForm.specialization, spec] });
                            }
                          }}
                        />
                        <label htmlFor={`edit-spec-${spec}`} style={{ fontSize: '12px', color: '#475569' }}>{spec}</label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '10px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Residential Address *</label>
                <textarea
                  required
                  rows={2}
                  value={editForm.address}
                  onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="sa-btn sa-btn--outline"
                  style={{ fontSize: '12px', padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="sa-btn sa-btn--primary"
                  style={{ fontSize: '12px', padding: '8px 20px' }}
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: ASSIGN PATIENT TO HEALER ─────────────────────────────── */}
      {showAssignModal && selectedHealer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '600px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#1e293b' }}>
                Assign Branch Patients to Dr. {selectedHealer.name}
              </h2>
              <button onClick={() => setShowAssignModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}><IonIcon icon={closeOutline} /></button>
            </div>

            {/* List same branch patients */}
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Select an active patient in your assigned branch node to add to Dr. {selectedHealer.name}&apos;s caseload.</p>

            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <table className="sa-table" style={{ width: '100%', margin: 0 }}>
                <thead>
                  <tr>
                    <th>Patient Name</th>
                    <th>Condition / Type</th>
                    <th>Current Healer Link</th>
                    <th style={{ textAlign: 'center' }}>Link Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => {
                    const linkedHealerName = healers.find(h => h.id === p.assignedHealerId)?.name || 'Unassigned';
                    return (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 800 }}>{p.name}</td>
                        <td>{p.caseType}</td>
                        <td>
                          <span style={{ fontSize: '11px', color: '#64748b', background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px' }}>
                            {linkedHealerName}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            onClick={() => handleAssignPatient(p.id, selectedHealer.id)}
                            className="sa-btn sa-btn--primary"
                            style={{ padding: '4px 10px', fontSize: '11px' }}
                            disabled={p.assignedHealerId === selectedHealer.id}
                          >
                            {p.assignedHealerId === selectedHealer.id ? 'Assigned' : 'Assign Node'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => setShowAssignModal(false)} className="sa-btn sa-btn--outline" style={{ fontSize: '12px', padding: '8px 16px' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: REASSIGN PATIENT TO ANOTHER HEALER ────────────────────── */}
      {showReassignModal && selectedPatientToReassign && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '500px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 800, color: '#1e293b' }}>
                Reassign Patient: {selectedPatientToReassign.name}
              </h2>
              <button onClick={() => setShowReassignModal(false)} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}><IonIcon icon={closeOutline} /></button>
            </div>

            <form onSubmit={handlePatientReassignSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Select New Healer *</label>
                <select
                  required
                  value={reassignNewHealerId}
                  onChange={e => setReassignNewHealerId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', background: '#fff' }}
                >
                  <option value="">-- Choose Branch Healer --</option>
                  {healers.filter(h => h.status === 'ACTIVE' && h.id !== selectedPatientToReassign.assignedHealerId).map(h => (
                    <option key={h.id} value={h.id}>Dr. {h.name} (Active: {patients.filter(p => p.assignedHealerId === h.id && p.status === 'Active').length} Patients)</option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Reason for Reassignment *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Schedule conflict, healer requested caseload balance"
                  value={reassignReason}
                  onChange={e => setReassignReason(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowReassignModal(false)} className="sa-btn sa-btn--outline" style={{ fontSize: '12px', padding: '8px 16px' }}>Cancel</button>
                <button type="submit" className="sa-btn sa-btn--primary" style={{ fontSize: '12px', padding: '8px 20px' }}>Confirm Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL: CONFIRM DEACTIVATE HEALER ────────────────────────────── */}
      {showDeactivateModal && selectedHealer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '450px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: '50px', color: '#ef4444', marginBottom: '16px' }}><IonIcon icon={alertCircleOutline} /></div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>Deactivate Healer</h2>
            
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '10px', lineHeight: 1.6 }}>
              Are you sure you want to deactivate <strong style={{ color: '#334155' }}>Dr. {selectedHealer.name}</strong>? 
              This operation disables their login credentials and restricts workspace nodes access.
            </p>

            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '12px', color: '#475569', textAlign: 'left', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div>Active Urgent Cases: <strong>{selectedHealer.urgentFollowUps}</strong></div>
              <div>Active Patient Caseload: <strong>{patients.filter(p => p.assignedHealerId === selectedHealer.id && p.status === 'Active').length}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'center' }}>
              <button onClick={() => setShowDeactivateModal(false)} className="sa-btn sa-btn--outline" style={{ fontSize: '12px', padding: '8px 20px', flex: 1 }}>Cancel</button>
              <button 
                onClick={() => handleDeactivateHealer(selectedHealer.id)} 
                className="sa-btn sa-btn--primary" 
                style={{ fontSize: '12px', padding: '8px 20px', flex: 1, background: '#ef4444', borderColor: '#ef4444' }}
              >
                Confirm Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL: CONFIRM RESET PASSWORD ────────────────────────────────── */}
      {showResetPasswordModal && selectedHealer && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', zIndex: 100000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '32px', maxWidth: '420px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', color: '#fbbf24', marginBottom: '16px' }}><IonIcon icon={keyOutline} /></div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e293b' }}>Reset Healer Password</h2>
            
            <p style={{ fontSize: '13px', color: '#64748b', marginTop: '10px', lineHeight: 1.6 }}>
              Are you sure you want to regenerate credentials for <strong style={{ color: '#334155' }}>Dr. {selectedHealer.name}</strong>? 
              A new high-security password will be auto-generated and dispatched immediately via SMS + Email nodes.
            </p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '24px', justifyContent: 'center' }}>
              <button onClick={() => setShowResetPasswordModal(false)} className="sa-btn sa-btn--outline" style={{ fontSize: '12px', padding: '8px 20px', flex: 1 }}>Cancel</button>
              <button 
                onClick={() => handleResetPassword(selectedHealer.id)} 
                className="sa-btn sa-btn--primary" 
                style={{ fontSize: '12px', padding: '8px 20px', flex: 1, background: '#fbbf24', borderColor: '#fbbf24', color: '#78350f' }}
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </IonPage>
  );
};

export default HealersPage;
