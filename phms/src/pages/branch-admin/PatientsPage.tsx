import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonModal,
} from '@ionic/react';
import {
  notificationsOutline,
  helpCircleOutline,
  searchOutline,
  filterOutline,
  calendarOutline,
  eyeOutline,
  pencilOutline,
  checkmarkCircleOutline,
  timeOutline,
  documentTextOutline,
  imageOutline,
  alertCircleOutline,
  flagOutline,
  trendingUpOutline,
  downloadOutline,
  printOutline,
  addOutline,
  chevronForwardOutline,
  star,
  mailOutline,
  callOutline,
  waterOutline,
  trashOutline,
  cashOutline,
  personOutline,
  cloudUploadOutline,
  closeOutline,
  shieldCheckmarkOutline,
  swapHorizontalOutline,
  barChartOutline,
  receiptOutline,
  settingsOutline,
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import './branch-admin.css';

// Highly comprehensive Patient structure matching all requirements
interface Patient {
  id: string; // Patient ID
  name: string; // Patient Name
  photoUrl?: string; // Profile Photo Mock
  initials: string;
  avatarColor: string;
  mobile: string; // Mobile Number
  email: string; // Email Address
  gender: 'Male' | 'Female'; // Gender
  age: number; // Age
  bloodGroup: string; // Blood Group
  assignedHealer: string; // Assigned Healer
  regDate: string; // Registration Date
  lastVisitDate: string; // Last Visit Date
  status: 'Active' | 'Inactive'; // Status
  emergencyContact: {
    name: string;
    relation: string;
    mobile: string;
  };
  medicalInfo: {
    conditions: string[];
    allergies: string[];
    medications: string[];
    notes: string;
  };
  appointments: {
    id: string;
    date: string;
    time: string;
    healer: string;
    status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled';
    remindersEnabled: boolean;
  }[];
  sessions: {
    id: string;
    healer: string;
    status: 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled';
    notes: string;
    followUpDate?: string;
  }[];
  financials: {
    balanceDue: number;
    invoices: {
      id: string;
      date: string;
      amount: number;
      status: 'Paid' | 'Unpaid' | 'Partial';
      method?: 'Cash' | 'UPI' | 'Card' | 'Bank Transfer';
    }[];
  };
  documents: {
    id: string;
    name: string;
    category: 'Medical report' | 'Prescription' | 'ID proof' | 'Scan reports' | 'Other';
    size: string;
    date: string;
    type: 'pdf' | 'image';
  }[];
  activityLogs: {
    action: string;
    timestamp: string;
    category: 'login' | 'appointment' | 'payment' | 'profile_update' | 'session_update';
  }[];
}

const PatientsPage: React.FC = () => {
  const { user } = useAuthStore();
  const history = useHistory();

  // Strict Scoping / Access Control Check
  const isBranchAdmin = user?.role === 'BRANCH_ADMIN';

  // Primary State
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '#P-8921',
      name: 'Sarah Mitchell',
      initials: 'SM',
      avatarColor: '#0f5b4b',
      mobile: '9876543210',
      email: 'sarah.m@example.com',
      gender: 'Female',
      age: 34,
      bloodGroup: 'O+',
      assignedHealer: 'Dr. Anjali Rao',
      regDate: '2023-10-12',
      lastVisitDate: '2024-05-20',
      status: 'Active',
      emergencyContact: {
        name: 'Mark Mitchell',
        relation: 'Husband',
        mobile: '9876543299',
      },
      medicalInfo: {
        conditions: ['Lower Back Pain (L4-L5 Compression)', 'Migraines'],
        allergies: ['Lavender Aromatherapy oil', 'Penicillin'],
        medications: ['Energetic alignment sessions thrice weekly', 'Hydration logs'],
        notes: 'Hyper-sensitive to strong aromatherapy. Standard aura cleansing highly recommended.',
      },
      appointments: [
        { id: '#APT-401', date: '2024-05-28', time: '10:30 AM', healer: 'Dr. Anjali Rao', status: 'Confirmed', remindersEnabled: true },
        { id: '#APT-201', date: '2024-05-20', time: '09:15 AM', healer: 'Dr. Anjali Rao', status: 'Completed', remindersEnabled: true },
        { id: '#APT-101', date: '2024-05-02', time: '03:30 PM', healer: 'Dr. Kevin Smith', status: 'Cancelled', remindersEnabled: false },
      ],
      sessions: [
        { id: '#SES-301', healer: 'Dr. Anjali Rao', status: 'Completed', notes: 'Chakra balancing focused on root and solar plexus. Blockages cleared.', followUpDate: '2024-05-28' },
        { id: '#SES-401', healer: 'Dr. Anjali Rao', status: 'Scheduled', notes: 'Pranic psychotherapy session focused on emotional aura release.', followUpDate: '2024-06-05' },
      ],
      financials: {
        balanceDue: 2500,
        invoices: [
          { id: '#INV-9021', date: '2024-05-20', amount: 1500, status: 'Paid', method: 'UPI' },
          { id: '#INV-9022', date: '2024-05-28', amount: 2500, status: 'Unpaid' },
        ],
      },
      documents: [
        { id: '#DOC-001', name: 'Blood_Work_Oct.pdf', category: 'Medical report', size: '2.4 MB', date: '2023-10-14', type: 'pdf' },
        { id: '#DOC-002', name: 'Scan_Result_Chest.jpg', category: 'Scan reports', size: '5.1 MB', date: '2023-10-12', type: 'image' },
      ],
      activityLogs: [
        { action: 'Session #SES-301 completed by Healer Anjali', timestamp: '2 hours ago', category: 'session_update' },
        { action: 'Emergency contact information updated', timestamp: 'Yesterday', category: 'profile_update' },
        { action: 'UPI Payment of ₹1,500 recorded for invoice #INV-9021', timestamp: '3 days ago', category: 'payment' },
        { action: 'User authenticated via security login node', timestamp: 'May 20, 08:30 AM', category: 'login' },
      ],
    },
    {
      id: '#P-8922',
      name: 'John Walker',
      initials: 'JW',
      avatarColor: '#1e3a8a',
      mobile: '9911223344',
      email: 'john.walker@example.com',
      gender: 'Male',
      age: 45,
      bloodGroup: 'A-',
      assignedHealer: 'Dr. Kevin Smith',
      regDate: '2023-10-15',
      lastVisitDate: '2024-05-22',
      status: 'Active',
      emergencyContact: {
        name: 'Jane Walker',
        relation: 'Sister',
        mobile: '9911223399',
      },
      medicalInfo: {
        conditions: ['Osteoarthritis of Right Knee', 'Hypertension'],
        allergies: ['Patchouli incense', 'Sulfonamides'],
        medications: ['Joint alignment alignment', 'Pranic salt baths'],
        notes: 'Avoid burning heavy patchouli or frankincense incense resins in his presence.',
      },
      appointments: [
        { id: '#APT-402', date: '2024-06-02', time: '11:30 AM', healer: 'Dr. Kevin Smith', status: 'Pending', remindersEnabled: true },
        { id: '#APT-202', date: '2024-05-22', time: '02:00 PM', healer: 'Dr. Kevin Smith', status: 'Completed', remindersEnabled: true },
      ],
      sessions: [
        { id: '#SES-302', healer: 'Dr. Kevin Smith', status: 'Completed', notes: 'Cleansing energy flows around knee joint, reducing heat and local inflammation.', followUpDate: '2024-06-02' },
      ],
      financials: {
        balanceDue: 0,
        invoices: [
          { id: '#INV-9023', date: '2024-05-22', amount: 1200, status: 'Paid', method: 'Cash' },
        ],
      },
      documents: [
        { id: '#DOC-003', name: 'Knee_XRay_Report.pdf', category: 'Scan reports', size: '3.2 MB', date: '2023-10-16', type: 'pdf' },
      ],
      activityLogs: [
        { action: 'Session #SES-302 completed by Healer Kevin', timestamp: '3 days ago', category: 'session_update' },
        { action: 'Cash Payment of ₹1,200 recorded for invoice #INV-9023', timestamp: '3 days ago', category: 'payment' },
        { action: 'User authenticated via security login node', timestamp: 'May 22, 09:10 AM', category: 'login' },
      ],
    },
    {
      id: '#P-8923',
      name: 'Elena Rostova',
      initials: 'ER',
      avatarColor: '#b45309',
      mobile: '9876543211',
      email: 'elena.rostova@example.com',
      gender: 'Female',
      age: 28,
      bloodGroup: 'B+',
      assignedHealer: 'Dr. Anjali Rao',
      regDate: '2023-10-18',
      lastVisitDate: '2024-05-25',
      status: 'Inactive',
      emergencyContact: {
        name: 'Dmitri Rostov',
        relation: 'Father',
        mobile: '9876543200',
      },
      medicalInfo: {
        conditions: ['Generalized Anxiety Disorder (GAD)', 'Insomnia'],
        allergies: ['No known environmental allergies'],
        medications: ['Emotional cleansing', 'Crown chakra alignments'],
        notes: 'Responds highly to solar plexus energizing and crown chakra emotional sweeps.',
      },
      appointments: [
        { id: '#APT-203', date: '2024-05-25', time: '05:00 PM', healer: 'Dr. Anjali Rao', status: 'Completed', remindersEnabled: true },
      ],
      sessions: [
        { id: '#SES-303', healer: 'Dr. Anjali Rao', status: 'Completed', notes: 'Psychotherapy session. Calming energy infused into nervous system. Emotional seal applied.', followUpDate: '2024-06-10' },
      ],
      financials: {
        balanceDue: 0,
        invoices: [
          { id: '#INV-9024', date: '2024-05-25', amount: 1800, status: 'Paid', method: 'Card' },
        ],
      },
      documents: [
        { id: '#DOC-004', name: 'Anxiety_Scale_Oct.pdf', category: 'Medical report', size: '1.8 MB', date: '2023-10-20', type: 'pdf' },
      ],
      activityLogs: [
        { action: 'Psychotherapy session #SES-303 closed successfully', timestamp: '5 hours ago', category: 'session_update' },
        { action: 'Registered at Salem Branch node', timestamp: 'Salem Node • Oct 18', category: 'profile_update' },
        { action: 'User authenticated via security login node', timestamp: 'May 25, 11:40 AM', category: 'login' },
      ],
    },
  ]);

  // Selected Patient Workspace
  const [selectedPatientId, setSelectedPatientId] = useState<string>('#P-8921');
  const [profileTab, setProfileTab] = useState<'basic' | 'appointments' | 'financials' | 'documents' | 'logs'>('basic');

  // Search & Filter & Sorting state
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [healerFilter, setHealerFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAptModal, setShowAptModal] = useState(false);
  const [showSesModal, setShowSesModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Form states
  const [newPatient, setNewPatient] = useState({
    name: '',
    mobile: '',
    email: '',
    gender: 'Female' as 'Male' | 'Female',
    age: 30,
    bloodGroup: 'O+',
    assignedHealer: 'Dr. Anjali Rao',
    emergencyName: '',
    emergencyRelation: '',
    emergencyMobile: '',
    conditions: '',
    allergies: '',
    notes: '',
  });

  const [editForm, setEditForm] = useState<Patient | null>(null);

  const [appointmentForm, setAppointmentForm] = useState({
    date: '',
    time: '10:00 AM',
    healer: 'Dr. Anjali Rao',
    status: 'Pending' as 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled' | 'Rescheduled',
  });

  const [sessionForm, setSessionForm] = useState({
    healer: 'Dr. Anjali Rao',
    status: 'Scheduled' as 'Scheduled' | 'Ongoing' | 'Completed' | 'Cancelled',
    notes: '',
    followUpDate: '',
  });

  const [invoiceForm, setInvoiceForm] = useState({
    amount: 1000,
    method: 'UPI' as 'Cash' | 'UPI' | 'Card' | 'Bank Transfer',
  });

  const [documentCategory, setDocumentCategory] = useState<'Medical report' | 'Prescription' | 'ID proof' | 'Scan reports' | 'Other'>('Medical report');

  // Branch Name details
  const userName = user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Aria Seraphina';
  const nameParts = userName.split(' ');
  const displayName = nameParts.length > 1 ? `${nameParts[0]} ${nameParts[1][0]}.` : userName;
  const userInitials = user
    ? `${user.name?.[0] || user.firstName?.[0] || 'B'}${user.name?.split(' ')?.[1]?.[0] || user.lastName?.[0] || 'A'}`.toUpperCase()
    : 'BA';

  const rawBranch = typeof user?.branch === 'object' && user?.branch !== null
    ? (user.branch as any).name
    : (user?.branch || 'Mumbai');
  const branchName = rawBranch.toLowerCase().includes('branch') ? rawBranch : `${rawBranch} Branch`;

  // Filter & Sort Logic
  const filteredPatients = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mobile.includes(searchQuery) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGender = genderFilter === 'All' || p.gender === genderFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesHealer = healerFilter === 'All' || p.assignedHealer === healerFilter;

    return matchesSearch && matchesGender && matchesStatus && matchesHealer;
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortBy === 'Newest') {
      return new Date(b.regDate).getTime() - new Date(a.regDate).getTime();
    }
    if (sortBy === 'Alphabetical') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'Recent Visit') {
      return new Date(b.lastVisitDate).getTime() - new Date(a.lastVisitDate).getTime();
    }
    if (sortBy === 'Reg Date') {
      return new Date(a.regDate).getTime() - new Date(b.regDate).getTime();
    }
    return 0;
  });

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  useEffect(() => {
    if (selectedPatient) {
      setEditForm({ ...selectedPatient });
    }
  }, [selectedPatientId]);

  if (!isBranchAdmin) {
    return (
      <IonPage className="sa-page">
        <IonContent className="sa-page__content" fullscreen>
          <div className="db-access-restricted-container">
            <div className="db-access-restricted-card">
              <div className="db-access-restricted-icon">
                <IonIcon icon={alertCircleOutline} />
              </div>
              <div className="db-access-restricted-details">
                <span className="db-access-restricted-title">Unauthorized Node Access</span>
                <p className="db-access-restricted-desc">
                  Access Denied. The Patient Management workspace is restricted exclusively to authorized Branch Admin users. You do not possess the required credentials to access this branch data.
                </p>
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  // Handle Add Patient Action
  const handleAddPatientSubmit = () => {
    if (!newPatient.name || !newPatient.mobile || !newPatient.email) {
      alert('Please fill in required fields.');
      return;
    }

    const patientId = `#P-${Math.floor(1000 + Math.random() * 9000)}`;
    const added: Patient = {
      id: patientId,
      name: newPatient.name,
      initials: newPatient.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
      avatarColor: ['#0f5b4b', '#1e3a8a', '#b45309', '#7c3aed', '#db2777'][Math.floor(Math.random() * 5)],
      mobile: newPatient.mobile,
      email: newPatient.email,
      gender: newPatient.gender,
      age: Number(newPatient.age),
      bloodGroup: newPatient.bloodGroup,
      assignedHealer: newPatient.assignedHealer,
      regDate: new Date().toISOString().split('T')[0],
      lastVisitDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      emergencyContact: {
        name: newPatient.emergencyName || 'Emergency Name',
        relation: newPatient.emergencyRelation || 'Family',
        mobile: newPatient.emergencyMobile || '9876543210',
      },
      medicalInfo: {
        conditions: newPatient.conditions ? newPatient.conditions.split(',').map((c) => c.trim()) : ['None recorded'],
        allergies: newPatient.allergies ? newPatient.allergies.split(',').map((c) => c.trim()) : ['No known allergies'],
        medications: ['Pranic treatment protocols'],
        notes: newPatient.notes || 'No specialized clinical notes entered.',
      },
      appointments: [],
      sessions: [],
      financials: { balanceDue: 0, invoices: [] },
      documents: [],
      activityLogs: [
        { action: 'Patient registered folder initialized', timestamp: 'Just now', category: 'profile_update' },
      ],
    };

    setPatients([added, ...patients]);
    setSelectedPatientId(patientId);
    setNewPatient({
      name: '',
      mobile: '',
      email: '',
      gender: 'Female',
      age: 30,
      bloodGroup: 'O+',
      assignedHealer: 'Dr. Anjali Rao',
      emergencyName: '',
      emergencyRelation: '',
      emergencyMobile: '',
      conditions: '',
      allergies: '',
      notes: '',
    });
    setShowAddModal(false);
  };

  // Handle Edit Patient Action
  const handleEditPatientSubmit = () => {
    if (!editForm) return;
    const updatedLogs = [
      { action: 'Personal information & medical records updated', timestamp: 'Just now', category: 'profile_update' as any },
      ...editForm.activityLogs,
    ];
    const saved = { ...editForm, activityLogs: updatedLogs };
    setPatients(patients.map((p) => (p.id === editForm.id ? saved : p)));
    setShowEditModal(false);
  };

  // Create Appointment Action
  const handleAddAppointment = () => {
    const aptId = `#APT-${Math.floor(100 + Math.random() * 900)}`;
    const newApt = {
      id: aptId,
      date: appointmentForm.date || new Date().toISOString().split('T')[0],
      time: appointmentForm.time,
      healer: appointmentForm.healer,
      status: appointmentForm.status,
      remindersEnabled: true,
    };
    const log = { action: `Appointment ${aptId} created. State: [Pending] -> [${newApt.status}]`, timestamp: 'Just now', category: 'appointment' as any };

    setPatients(
      patients.map((p) => {
        if (p.id === selectedPatient.id) {
          return {
            ...p,
            appointments: [newApt, ...p.appointments],
            activityLogs: [log, ...p.activityLogs],
          };
        }
        return p;
      })
    );
    setShowAptModal(false);
  };

  // Transition Appointment State Machine (Pending ➔ Confirmed ➔ Completed / Cancelled / Rescheduled)
  const handleTransitionAppointmentStatus = (aptId: string, nextStatus: any) => {
    setPatients(
      patients.map((p) => {
        if (p.id === selectedPatient.id) {
          const oldApt = p.appointments.find(a => a.id === aptId);
          const logText = `Appointment ${aptId} transitioned: [${oldApt?.status}] ➔ [${nextStatus}]`;
          const auditLog = { action: logText, timestamp: 'Just now', category: 'appointment' as any };
          return {
            ...p,
            appointments: p.appointments.map((a) => (a.id === aptId ? { ...a, status: nextStatus } : a)),
            activityLogs: [auditLog, ...p.activityLogs],
          };
        }
        return p;
      })
    );
  };

  // Create Healing Session Action
  const handleAddSession = () => {
    const sesId = `#SES-${Math.floor(100 + Math.random() * 900)}`;
    const newSes = {
      id: sesId,
      healer: sessionForm.healer,
      status: sessionForm.status,
      notes: sessionForm.notes || 'General Pranic restoration session.',
      followUpDate: sessionForm.followUpDate || undefined,
    };
    const log = { action: `Session ${sesId} initialized. State: [${newSes.status}]`, timestamp: 'Just now', category: 'session_update' as any };

    setPatients(
      patients.map((p) => {
        if (p.id === selectedPatient.id) {
          return {
            ...p,
            sessions: [newSes, ...p.sessions],
            activityLogs: [log, ...p.activityLogs],
          };
        }
        return p;
      })
    );
    setShowSesModal(false);
    setSessionForm({ healer: 'Dr. Anjali Rao', status: 'Scheduled', notes: '', followUpDate: '' });
  };

  // Transition Healing Session State Machine (Scheduled ➔ Ongoing ➔ Completed / Cancelled)
  const handleTransitionSessionStatus = (sesId: string, nextStatus: any) => {
    setPatients(
      patients.map((p) => {
        if (p.id === selectedPatient.id) {
          const oldSes = p.sessions.find(s => s.id === sesId);
          const logText = `Session ${sesId} transitioned: [${oldSes?.status}] ➔ [${nextStatus}]`;
          const auditLog = { action: logText, timestamp: 'Just now', category: 'session_update' as any };
          return {
            ...p,
            sessions: p.sessions.map((s) => (s.id === sesId ? { ...s, status: nextStatus } : s)),
            activityLogs: [auditLog, ...p.activityLogs],
          };
        }
        return p;
      })
    );
  };

  // Generate Invoice Action
  const handleGenerateInvoice = () => {
    const invId = `#INV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newInvoice = {
      id: invId,
      date: new Date().toISOString().split('T')[0],
      amount: Number(invoiceForm.amount),
      status: 'Unpaid' as any,
    };
    const log = { action: `Invoice ${invId} generated for amount ₹${invoiceForm.amount}. Status: [Unpaid]`, timestamp: 'Just now', category: 'payment' as any };

    setPatients(
      patients.map((p) => {
        if (p.id === selectedPatient.id) {
          return {
            ...p,
            financials: {
              balanceDue: p.financials.balanceDue + newInvoice.amount,
              invoices: [newInvoice, ...p.financials.invoices],
            },
            activityLogs: [log, ...p.activityLogs],
          };
        }
        return p;
      })
    );
    setShowInvoiceModal(false);
  };

  // Pay Invoice Action with explicit Payment Method Choice (Cash, UPI, Card, Bank Transfer)
  const handlePayInvoice = (invId: string, amount: number, method: any) => {
    setPatients(
      patients.map((p) => {
        if (p.id === selectedPatient.id) {
          return {
            ...p,
            financials: {
              balanceDue: Math.max(0, p.financials.balanceDue - amount),
              invoices: p.financials.invoices.map((i) => (i.id === invId ? { ...i, status: 'Paid' as any, method } : i)),
            },
            activityLogs: [{ action: `Payment of ₹${amount} received via [${method}] for Invoice ${invId}`, timestamp: 'Just now', category: 'payment' as any }, ...p.activityLogs],
          };
        }
        return p;
      })
    );
  };

  // Document Vault Upload Action
  const handleMockDocUpload = () => {
    const docId = `#DOC-${Math.floor(100 + Math.random() * 900)}`;
    const newDoc = {
      id: docId,
      name: `Uploaded_Doc_${Date.now().toString().slice(-4)}.pdf`,
      category: documentCategory,
      size: '1.2 MB',
      date: new Date().toISOString().split('T')[0],
      type: 'pdf' as any,
    };
    const log = { action: `Uploaded file ${newDoc.name} into vault under category: ${newDoc.category}`, timestamp: 'Just now', category: 'profile_update' as any };

    setPatients(
      patients.map((p) => {
        if (p.id === selectedPatient.id) {
          return {
            ...p,
            documents: [newDoc, ...p.documents],
            activityLogs: [log, ...p.activityLogs],
          };
        }
        return p;
      })
    );
    alert('File uploaded to localized document vault successfully!');
  };

  // Document Vault Delete Action
  const handleMockDocDelete = (docId: string) => {
    setPatients(
      patients.map((p) => {
        if (p.id === selectedPatient.id) {
          return {
            ...p,
            documents: p.documents.filter((d) => d.id !== docId),
            activityLogs: [{ action: `Deleted document ${docId} from clinical vault`, timestamp: 'Just now', category: 'profile_update' as any }, ...p.activityLogs],
          };
        }
        return p;
      })
    );
  };

  // Global Analytics metrics calculated dynamically
  const activeCount = patients.filter((p) => p.status === 'Active').length;
  const mtdRegistered = patients.length;

  return (
    <IonPage className="sa-page">
      <IonHeader className="ion-no-border">
        <IonToolbar className="sa-page__toolbar">
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          
          <div className="db-toolbar-content">
            {/* Left Header Info */}
            <div className="db-toolbar-left">
              <h1 className="db-page-title">Patient Management Node</h1>
              <p className="db-page-subtitle">Scoped Patient folders, Medical Workflows and Invoicing control</p>
            </div>

            {/* Right Actions & Profile */}
            <div className="db-toolbar-right">
              {/* Scoped restriction indicator */}
              <span className="st-panel-badge st-panel-badge--green" style={{ marginRight: '12px', fontSize: '10px' }}>
                Scoped: {branchName}
              </span>

              {/* Notification Button */}
              <button className="db-icon-btn" title="Notifications">
                <IonIcon icon={notificationsOutline} />
                <div className="db-badge-dot" />
              </button>

              {/* Help Button */}
              <button className="db-icon-btn" title="Help & Support">
                <IonIcon icon={helpCircleOutline} />
              </button>

              {/* Profile card */}
              <div className="db-profile-card">
                <div className="db-profile-info">
                  <span className="db-profile-name">{displayName}</span>
                  <span className="db-profile-branch">{branchName} Admin</span>
                </div>
                <div className="db-profile-avatar">{userInitials}</div>
              </div>
            </div>
          </div>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sa-page__content" fullscreen>
        <div className="sa-page__body">

          {/* =======================================================
              SECTION 1: CLINICAL STATS PREVIEW PRE-CHECKS RIBBON
             ======================================================= */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', borderLeft: '4px solid #10b981', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Active Cases</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{activeCount}</span>
            </div>
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', borderLeft: '4px solid #1e3a8a', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Total Registered</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>{mtdRegistered}</span>
            </div>
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', borderLeft: '4px solid #f59e0b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Daily Appts Queue</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>18</span>
            </div>
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', borderLeft: '4px solid #8b5cf6', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Documents Vaulted</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>24</span>
            </div>
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)', borderLeft: '4px solid #ef4444', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Pending Balance</span>
              <span style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a' }}>₹{selectedPatient.financials.balanceDue}</span>
            </div>
          </div>

          {/* ==========================================
              SECTION 2: ADVANCED FILTERING & SORTING BAR
             ========================================== */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, color: '#334155' }}>
              <IonIcon icon={filterOutline} />
              <span>FILTERS</span>
            </div>

            {/* Gender filter select */}
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', color: '#475569', outline: 'none', fontWeight: 600 }}
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            {/* Status filter select */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', color: '#475569', outline: 'none', fontWeight: 600 }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Healer filter select */}
            <select
              value={healerFilter}
              onChange={(e) => setHealerFilter(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', color: '#475569', outline: 'none', fontWeight: 600 }}
            >
              <option value="All">All Healers</option>
              <option value="Dr. Anjali Rao">Dr. Anjali Rao</option>
              <option value="Dr. Kevin Smith">Dr. Kevin Smith</option>
            </select>

            {/* Sorting select */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>SORT BY:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', color: '#475569', outline: 'none', fontWeight: 600 }}
              >
                <option value="Newest">Newest Registered</option>
                <option value="Alphabetical">Alphabetical</option>
                <option value="Recent Visit">Recent Visit</option>
                <option value="Reg Date">Oldest Registered</option>
              </select>
            </div>
          </div>

          {/* ==========================================
              SECTION 3: PATIENT REGISTRY TABLE (12 COLS)
             ========================================== */}
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Branch Patient Directory</h2>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>Search and select patients to view complete profile folders</p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                {/* Search Bar Input */}
                <div className="st-header-search" style={{ margin: 0 }}>
                  <IonIcon icon={searchOutline} className="st-search-bar-icon" />
                  <input
                    type="text"
                    placeholder="Search by ID, Name, Mobile, Email..."
                    className="st-search-bar-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ width: '280px' }}
                  />
                </div>

                {/* Add Patient Button */}
                <button className="st-btn st-btn--primary" onClick={() => setShowAddModal(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IonIcon icon={addOutline} /> Add New Patient
                </button>
              </div>
            </div>

            {/* 12-Column Table Formats */}
            <div className="st-table-container">
              <table className="st-table">
                <thead>
                  <tr>
                    <th>PATIENT ID</th>
                    <th>PATIENT NAME</th>
                    <th>GENDER</th>
                    <th>AGE</th>
                    <th>BLOOD</th>
                    <th>MOBILE</th>
                    <th>EMAIL</th>
                    <th>ASSIGNED HEALER</th>
                    <th>REG DATE</th>
                    <th>LAST VISIT</th>
                    <th>STATUS</th>
                    <th style={{ textAlign: 'center' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPatients.length > 0 ? (
                    sortedPatients.map((patient) => {
                      const isSelected = patient.id === selectedPatientId;
                      return (
                        <tr
                          key={patient.id}
                          className={`st-table-row ${isSelected ? 'st-table-row--selected' : ''}`}
                          onClick={() => setSelectedPatientId(patient.id)}
                          style={{ cursor: 'pointer', borderLeft: isSelected ? '4px solid #1f7a6a' : 'none' }}
                        >
                          <td style={{ fontWeight: '700', color: '#1f7a6a' }}>{patient.id}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div
                                style={{
                                  backgroundColor: patient.avatarColor,
                                  color: 'white',
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '50%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 'bold',
                                  fontSize: '11px',
                                }}
                              >
                                {patient.initials}
                              </div>
                              <span style={{ fontWeight: '700', color: '#0f172a' }}>{patient.name}</span>
                            </div>
                          </td>
                          <td>{patient.gender}</td>
                          <td>{patient.age}</td>
                          <td style={{ fontWeight: '700', color: '#ef4444' }}>{patient.bloodGroup}</td>
                          <td>{patient.mobile}</td>
                          <td style={{ fontSize: '11px' }}>{patient.email}</td>
                          <td>{patient.assignedHealer}</td>
                          <td>{patient.regDate}</td>
                          <td>{patient.lastVisitDate}</td>
                          <td>
                            <span className={`st-panel-badge ${patient.status === 'Active' ? 'st-panel-badge--green' : ''}`}>
                              {patient.status}
                            </span>
                          </td>
                          <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button className="pa-doc-action-btn" title="View Folder" onClick={() => setSelectedPatientId(patient.id)}>
                                <IonIcon icon={eyeOutline} />
                              </button>
                              <button className="pa-doc-action-btn" title="Edit Profile" onClick={() => { setSelectedPatientId(patient.id); setShowEditModal(true); }}>
                                <IonIcon icon={pencilOutline} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={12} className="st-table-empty">
                        No registered patients match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="st-pagination">
              <span className="st-pagination-info">
                Showing {sortedPatients.length} of {patients.length} branch patients
              </span>
              <div className="st-pagination-controls">
                <button className="st-page-btn" disabled>«</button>
                <button className="st-page-btn st-page-btn--active">1</button>
                <button className="st-page-btn" disabled>»</button>
              </div>
            </div>
          </div>

          {/* ==========================================
              SECTION 4: COMPLETE PATIENT PROFILE WORKSPACE
             ========================================== */}
          <div className="pa-profile-workspace">
            {/* Header Card */}
            <div className="pa-profile-header-card">
              <div className="pa-profile-header-left">
                <div className="pa-profile-header-avatar">
                  {selectedPatient.initials}
                </div>
                <div className="pa-profile-header-info">
                  <h3 className="pa-profile-header-name">{selectedPatient.name}</h3>
                  <span className="pa-profile-header-meta">
                    Patient ID: <strong>{selectedPatient.id}</strong> • Gender: <strong>{selectedPatient.gender}</strong> • Age: <strong>{selectedPatient.age}</strong> • Blood Group: <strong>{selectedPatient.bloodGroup}</strong>
                  </span>
                </div>
              </div>
              <div className="pa-profile-header-actions">
                <button className="pa-profile-header-btn" onClick={() => setShowAptModal(true)}>
                  <IonIcon icon={calendarOutline} /> Book Appointment
                </button>
                <button className="pa-profile-header-btn" onClick={() => setShowSesModal(true)}>
                  <IonIcon icon={timeOutline} /> Initialize Session
                </button>
                <button className="pa-profile-header-btn" onClick={() => setShowInvoiceModal(true)}>
                  <IonIcon icon={cashOutline} /> Generate Invoice
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="pa-profile-tabs">
              <button 
                className={`pa-profile-tab-btn ${profileTab === 'basic' ? 'pa-profile-tab-btn--active' : ''}`}
                onClick={() => setProfileTab('basic')}
              >
                Basic &amp; Medical Info
              </button>
              <button 
                className={`pa-profile-tab-btn ${profileTab === 'appointments' ? 'pa-profile-tab-btn--active' : ''}`}
                onClick={() => setProfileTab('appointments')}
              >
                Operational Workflows
              </button>
              <button 
                className={`pa-profile-tab-btn ${profileTab === 'financials' ? 'pa-profile-tab-btn--active' : ''}`}
                onClick={() => setProfileTab('financials')}
              >
                Financial &amp; Invoicing Ledger
              </button>
              <button 
                className={`pa-profile-tab-btn ${profileTab === 'documents' ? 'pa-profile-tab-btn--active' : ''}`}
                onClick={() => setProfileTab('documents')}
              >
                Document vault ({selectedPatient.documents.length})
              </button>
              <button 
                className={`pa-profile-tab-btn ${profileTab === 'logs' ? 'pa-profile-tab-btn--active' : ''}`}
                onClick={() => setProfileTab('logs')}
              >
                Activity logs &amp; Audits
              </button>
            </div>

            {/* Profile Content */}
            <div className="pa-profile-body">
              {/* TAB 1: BASIC & MEDICAL INFO */}
              {profileTab === 'basic' && (
                <div className="pa-grid-3">
                  {/* Basic Information Block */}
                  <div className="pa-info-block">
                    <span className="pa-info-block-title">Basic Information</span>
                    <div className="pa-info-field">
                      <span className="pa-info-label">Mobile Number</span>
                      <span className="pa-info-val">{selectedPatient.mobile}</span>
                    </div>
                    <div className="pa-info-field">
                      <span className="pa-info-label">Email Address</span>
                      <span className="pa-info-val">{selectedPatient.email}</span>
                    </div>
                    <div className="pa-info-field">
                      <span className="pa-info-label">Registration Date</span>
                      <span className="pa-info-val">{selectedPatient.regDate}</span>
                    </div>
                    <div className="pa-info-field">
                      <span className="pa-info-label">Last Visit Date</span>
                      <span className="pa-info-val">{selectedPatient.lastVisitDate}</span>
                    </div>
                  </div>

                  {/* Emergency Contact Block */}
                  <div className="pa-info-block">
                    <span className="pa-info-block-title">Emergency Contact Info</span>
                    <div className="pa-info-field">
                      <span className="pa-info-label">Contact Name</span>
                      <span className="pa-info-val">{selectedPatient.emergencyContact.name}</span>
                    </div>
                    <div className="pa-info-field">
                      <span className="pa-info-label">Relation</span>
                      <span className="pa-info-val">{selectedPatient.emergencyContact.relation}</span>
                    </div>
                    <div className="pa-info-field">
                      <span className="pa-info-label">Mobile Number</span>
                      <span className="pa-info-val">{selectedPatient.emergencyContact.mobile}</span>
                    </div>
                    <div className="pa-info-field">
                      <span className="pa-info-label">Clinical Status</span>
                      <span className="st-panel-badge st-panel-badge--green" style={{ width: 'fit-content', marginTop: '4px' }}>
                        Authorized Active Profile
                      </span>
                    </div>
                  </div>

                  {/* Medical Information Block */}
                  <div className="pa-info-block">
                    <span className="pa-info-block-title">Medical Information</span>
                    <div className="pa-info-field">
                      <span className="pa-info-label">Health Conditions</span>
                      <ul className="pa-bullet-list">
                        {selectedPatient.medicalInfo.conditions.map((c, i) => (
                          <li className="pa-bullet-item" key={i}>
                            <div className="pa-bullet-dot pa-bullet-dot--green" />
                            <span className="pa-bullet-text">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pa-info-field" style={{ marginTop: '8px' }}>
                      <span className="pa-info-label">Allergy Alert</span>
                      <ul className="pa-bullet-list">
                        {selectedPatient.medicalInfo.allergies.map((c, i) => (
                          <li className="pa-bullet-item" key={i}>
                            <div className="pa-bullet-dot" />
                            <span className="pa-bullet-text">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pa-info-field" style={{ marginTop: '8px' }}>
                      <span className="pa-info-label">Clinical Notes</span>
                      <span className="pa-bullet-text" style={{ fontStyle: 'italic' }}>
                        "{selectedPatient.medicalInfo.notes}"
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: APPOINTMENTS & SESSIONS WORKFLOWS */}
              {profileTab === 'appointments' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
                  {/* Appointment Architecture (State Machine Enforced) */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                    <span className="pa-info-block-title">Appointment lifecycle (Pending ➔ Confirmed ➔ Completed / Cancelled / Rescheduled)</span>
                    
                    <div className="st-table-container" style={{ marginTop: '12px' }}>
                      <table className="st-table">
                        <thead>
                          <tr>
                            <th>APT ID</th>
                            <th>DATE &amp; TIME</th>
                            <th>HEALER</th>
                            <th>LIFECYCLE STATE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPatient.appointments.length > 0 ? (
                            selectedPatient.appointments.map((a) => (
                              <tr key={a.id} className="st-table-row">
                                <td style={{ fontWeight: '700' }}>{a.id}</td>
                                <td>{a.date} ({a.time})</td>
                                <td>{a.healer}</td>
                                <td>
                                  {/* Interactive State Machine Selector */}
                                  <select
                                    value={a.status}
                                    onChange={(e) => handleTransitionAppointmentStatus(a.id, e.target.value as any)}
                                    style={{
                                      padding: '4px 8px',
                                      borderRadius: '6px',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      background:
                                        a.status === 'Completed' ? '#ecfdf5' :
                                        a.status === 'Confirmed' ? '#eff6ff' :
                                        a.status === 'Cancelled' ? '#fef2f2' : '#fffbeb',
                                      color:
                                        a.status === 'Completed' ? '#047857' :
                                        a.status === 'Confirmed' ? '#1d4ed8' :
                                        a.status === 'Cancelled' ? '#ef4444' : '#b45309',
                                      border: '1px solid #cbd5e1',
                                      outline: 'none',
                                    }}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Confirmed">Confirmed</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="Rescheduled">Rescheduled</option>
                                  </select>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="st-table-empty">
                                No appointments registered.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Healing Session Architecture (State Machine Enforced) */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                    <span className="pa-info-block-title">Session State (Scheduled ➔ Ongoing ➔ Completed / Cancelled)</span>
                    
                    <div className="st-table-container" style={{ marginTop: '12px' }}>
                      <table className="st-table">
                        <thead>
                          <tr>
                            <th>SES ID</th>
                            <th>HEALER</th>
                            <th>SESSION NOTES</th>
                            <th>STATE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPatient.sessions.length > 0 ? (
                            selectedPatient.sessions.map((s) => (
                              <tr key={s.id} className="st-table-row">
                                <td style={{ fontWeight: '700' }}>{s.id}</td>
                                <td>{s.healer}</td>
                                <td style={{ fontSize: '11px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={s.notes}>
                                  {s.notes}
                                </td>
                                <td>
                                  {/* Interactive State Machine Selector */}
                                  <select
                                    value={s.status}
                                    onChange={(e) => handleTransitionSessionStatus(s.id, e.target.value as any)}
                                    style={{
                                      padding: '4px 8px',
                                      borderRadius: '6px',
                                      fontSize: '11px',
                                      fontWeight: 700,
                                      background:
                                        s.status === 'Completed' ? '#ecfdf5' :
                                        s.status === 'Ongoing' ? '#eff6ff' :
                                        s.status === 'Cancelled' ? '#fef2f2' : '#fffbeb',
                                      color:
                                        s.status === 'Completed' ? '#047857' :
                                        s.status === 'Ongoing' ? '#1d4ed8' :
                                        s.status === 'Cancelled' ? '#ef4444' : '#b45309',
                                      border: '1px solid #cbd5e1',
                                      outline: 'none',
                                    }}
                                  >
                                    <option value="Scheduled">Scheduled</option>
                                    <option value="Ongoing">Ongoing</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={4} className="st-table-empty">
                                No sessions recorded.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: FINANCIAL & INVOICING LEDGER */}
              {profileTab === 'financials' && (
                <div>
                  <div className="pa-billing-summary">
                    <div className="pa-billing-box" style={{ borderLeft: '4px solid #ef4444' }}>
                      <span className="pa-info-label">Outstanding Balance</span>
                      <span className="pa-billing-val" style={{ color: selectedPatient.financials.balanceDue > 0 ? '#ef4444' : '#64748b' }}>
                        ₹{selectedPatient.financials.balanceDue}
                      </span>
                    </div>
                    <div className="pa-billing-box" style={{ borderLeft: '4px solid #10b981' }}>
                      <span className="pa-info-label">Completed Collections</span>
                      <span className="pa-billing-val" style={{ color: '#10b981' }}>
                        ₹{selectedPatient.financials.invoices.filter((i) => i.status === 'Paid').reduce((sum, i) => sum + i.amount, 0)}
                      </span>
                    </div>
                    <div className="pa-billing-box">
                      <span className="pa-info-label">Billing Invoices</span>
                      <span className="pa-billing-val">{selectedPatient.financials.invoices.length} Bills</span>
                    </div>
                  </div>

                  <span className="pa-info-block-title">Invoice Records Ledger</span>
                  <div className="st-table-container" style={{ marginTop: '12px' }}>
                    <table className="st-table">
                      <thead>
                        <tr>
                          <th>INVOICE NO</th>
                          <th>BILL DATE</th>
                          <th>AMOUNT DUE</th>
                          <th>PAYMENT METHOD</th>
                          <th>STATUS</th>
                          <th style={{ textAlign: 'center' }}>RECORD PAYMENT (SELECT METHOD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPatient.financials.invoices.length > 0 ? (
                          selectedPatient.financials.invoices.map((i) => (
                            <tr key={i.id} className="st-table-row">
                              <td style={{ fontWeight: '700' }}>{i.id}</td>
                              <td>{i.date}</td>
                              <td style={{ fontWeight: '700' }}>₹{i.amount}</td>
                              <td>{i.method || 'Pending'}</td>
                              <td>
                                <span className={`st-panel-badge ${i.status === 'Paid' ? 'st-panel-badge--green' : 'st-panel-badge--red'}`} style={{ background: i.status === 'Unpaid' ? '#fee2e2' : '', color: i.status === 'Unpaid' ? '#ef4444' : '' }}>
                                  {i.status}
                                </span>
                              </td>
                              <td style={{ textAlign: 'center' }}>
                                {i.status === 'Unpaid' ? (
                                  <div style={{ display: 'inline-flex', gap: '6px' }}>
                                    <button className="st-btn st-btn--primary" onClick={() => handlePayInvoice(i.id, i.amount, 'UPI')} style={{ fontSize: '10px', padding: '4px 10px' }}>UPI</button>
                                    <button className="st-btn st-btn--primary" onClick={() => handlePayInvoice(i.id, i.amount, 'Cash')} style={{ fontSize: '10px', padding: '4px 10px', background: '#10b981' }}>Cash</button>
                                    <button className="st-btn st-btn--primary" onClick={() => handlePayInvoice(i.id, i.amount, 'Card')} style={{ fontSize: '10px', padding: '4px 10px', background: '#3b82f6' }}>Card</button>
                                    <button className="st-btn st-btn--primary" onClick={() => handlePayInvoice(i.id, i.amount, 'Bank Transfer')} style={{ fontSize: '10px', padding: '4px 10px', background: '#8b5cf6' }}>Transfer</button>
                                  </div>
                                ) : (
                                  <button className="st-btn st-btn--outline" onClick={() => alert('Downloading bill receipt PDF...')} style={{ fontSize: '10px', padding: '4px 10px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <IonIcon icon={downloadOutline} /> Download PDF Receipt
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="st-table-empty">
                              No financial invoices found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: DOCUMENT VAULT */}
              {profileTab === 'documents' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span className="pa-info-label" style={{ fontSize: '11px' }}>Category Tag:</span>
                      <select
                        value={documentCategory}
                        onChange={(e) => setDocumentCategory(e.target.value as any)}
                        style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', background: '#ffffff', fontSize: '12px', outline: 'none' }}
                      >
                        <option value="Medical report">Medical report</option>
                        <option value="Prescription">Prescription</option>
                        <option value="ID proof">ID proof</option>
                        <option value="Scan reports">Scan reports</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <button className="st-btn st-btn--primary" onClick={handleMockDocUpload} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IonIcon icon={cloudUploadOutline} /> Upload Document Folder
                    </button>
                  </div>

                  <div className="pa-doc-vault-grid">
                    {selectedPatient.documents.length > 0 ? (
                      selectedPatient.documents.map((d) => (
                        <div className="pa-doc-vault-card" key={d.id}>
                          <div className="pa-doc-left">
                            <div className={`pa-doc-icon ${d.category === 'Scan reports' ? 'pa-doc-icon--image' : ''}`}>
                              <IonIcon icon={d.type === 'pdf' ? documentTextOutline : imageOutline} />
                            </div>
                            <div className="pa-doc-info">
                              <span className="pa-doc-name">{d.name}</span>
                              <span className="pa-doc-meta">{d.category} • {d.size} • {d.date}</span>
                            </div>
                          </div>
                          <div className="pa-doc-right">
                            <button className="pa-doc-action-btn" title="Download Document" onClick={() => alert(`Downloading document: ${d.name}`)}>
                              <IonIcon icon={downloadOutline} />
                            </button>
                            <button className="pa-doc-action-btn pa-doc-action-btn--delete" title="Delete Document" onClick={() => handleMockDocDelete(d.id)}>
                              <IonIcon icon={trashOutline} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="st-table-empty" style={{ gridColumn: 'span 2' }}>
                        Patient Vault is empty. Upload medical reports, prescriptions, scan reports, or ID proofs.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: COMMUNICATIONS & AUDITS */}
              {profileTab === 'logs' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px' }}>
                  {/* Communication Engine & Reminders */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                    <span className="pa-info-block-title">Communications Hub</span>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>SMS Automated Reminders</span>
                          <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8' }}>Send transactional SMS alerts for confirmations</p>
                        </div>
                        <span className="st-panel-badge st-panel-badge--green">Active</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Email Automated Vault Reports</span>
                          <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8' }}>Send encrypted medical reports and invoice receipts</p>
                        </div>
                        <span className="st-panel-badge st-panel-badge--green">Active</span>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <span style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Outstanding Balance Alerts</span>
                          <p style={{ margin: 0, fontSize: '10px', color: '#94a3b8' }}>Auto-trigger payment reminder notices</p>
                        </div>
                        <span className="st-panel-badge st-panel-badge--green">Active</span>
                      </div>
                    </div>
                  </div>

                  {/* Immutable Activity Audit Log */}
                  <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                    <span className="pa-info-block-title">Immutable System Activity Log</span>
                    
                    <div className="pa-activity-logs-list" style={{ marginTop: '16px' }}>
                      {selectedPatient.activityLogs.map((log, idx) => (
                        <div className="pa-activity-log-row" key={idx}>
                          <div className={`pa-activity-log-dot ${
                            log.category === 'payment' ? 'pa-activity-log-dot--payment' :
                            log.category === 'session_update' ? 'pa-activity-log-dot--session' :
                            log.category === 'profile_update' ? 'pa-activity-log-dot--edit' : ''
                          }`} />
                          <div className="pa-activity-log-details">
                            <span className="pa-activity-log-text">{log.action}</span>
                            <span className="pa-activity-log-stamp">{log.timestamp} ({log.category.toUpperCase()})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ==========================================
              SECTION 5: INTELLIGENCE & ANALYTICS PANELS
             ========================================== */}
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0', marginTop: '24px' }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>Intelligence &amp; Analytics Summary</h3>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>Enforced registration patterns, utilizing cancellation rates and healers distribution</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {/* Daily Registration Trends SVG */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                <span className="pa-info-block-title" style={{ fontSize: '10px' }}>Patient Registration Trends (Mtd)</span>
                <svg viewBox="0 0 100 40" style={{ width: '100%', height: '80px', marginTop: '8px' }}>
                  <rect x="5" y="10" width="8" height="30" rx="2" fill="#1f7a6a" />
                  <rect x="20" y="15" width="8" height="25" rx="2" fill="#1f7a6a" />
                  <rect x="35" y="5" width="8" height="35" rx="2" fill="#1f7a6a" />
                  <rect x="50" y="20" width="8" height="20" rx="2" fill="#10b981" />
                  <rect x="65" y="8" width="8" height="32" rx="2" fill="#1f7a6a" />
                  <rect x="80" y="12" width="8" height="28" rx="2" fill="#1f7a6a" />
                </svg>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '8px', color: '#94a3b8', marginTop: '4px', fontWeight: 700 }}>
                  <span>DEC</span><span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span>
                </div>
              </div>

              {/* Caseload distribution progress */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                <span className="pa-info-block-title" style={{ fontSize: '10px' }}>Healer caseload distribution</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
                      <span>Dr. Anjali Rao</span>
                      <span>12 Cases</span>
                    </div>
                    <div className="db-progress-bar-track" style={{ height: '6px' }}>
                      <div className="db-progress-bar" style={{ width: '70%', background: '#1f7a6a', height: '100%', borderRadius: '3px' }} />
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>
                      <span>Dr. Kevin Smith</span>
                      <span>5 Cases</span>
                    </div>
                    <div className="db-progress-bar-track" style={{ height: '6px' }}>
                      <div className="db-progress-bar" style={{ width: '30%', background: '#10b981', height: '100%', borderRadius: '3px' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Utilization Rates */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
                <span className="pa-info-block-title" style={{ fontSize: '10px' }}>Appointment utilization vs cancellations</span>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '12px' }}>
                  <div className="db-circular-chart" style={{ width: '60px', height: '60px' }}>
                    <svg viewBox="0 0 36 36" className="db-circular-svg">
                      <path className="db-circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path className="db-circle-stroke" strokeDasharray="92, 100" stroke="#1f7a6a" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div className="db-circular-chart__content">
                      <span className="db-circular-pct" style={{ fontSize: '12px' }}>92%</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#334155' }}>92% Utilization Rate</span>
                    <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 600 }}>Cancellations reduced by 14%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </IonContent>

      {/* ==========================================
          MODAL 1: ADD NEW PATIENT wizard
         ========================================== */}
      <IonModal isOpen={showAddModal} onDidDismiss={() => setShowAddModal(false)} className="sa-modal">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Register New Patient folder</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowAddModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="st-form">
              {/* Row 1 */}
              <div className="st-form-row">
                <div className="st-form-group">
                  <label className="st-form-label">FULL PATIENT NAME *</label>
                  <input
                    type="text"
                    className="st-input"
                    placeholder="Full Name"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  />
                </div>
                <div className="st-form-group">
                  <label className="st-form-label">MOBILE NUMBER *</label>
                  <input
                    type="text"
                    className="st-input"
                    placeholder="10-digit Mobile"
                    value={newPatient.mobile}
                    onChange={(e) => setNewPatient({ ...newPatient, mobile: e.target.value })}
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="st-form-row">
                <div className="st-form-group">
                  <label className="st-form-label">EMAIL ADDRESS *</label>
                  <input
                    type="email"
                    className="st-input"
                    placeholder="email@example.com"
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                  />
                </div>
                <div className="st-form-row" style={{ gap: '10px' }}>
                  <div className="st-form-group">
                    <label className="st-form-label">GENDER</label>
                    <select
                      className="st-input"
                      value={newPatient.gender}
                      onChange={(e) => setNewPatient({ ...newPatient, gender: e.target.value as any })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="st-form-group">
                    <label className="st-form-label">AGE</label>
                    <input
                      type="number"
                      className="st-input"
                      value={newPatient.age}
                      onChange={(e) => setNewPatient({ ...newPatient, age: Number(e.target.value) })}
                    />
                  </div>
                  <div className="st-form-group">
                    <label className="st-form-label">BLOOD GROUP</label>
                    <input
                      type="text"
                      className="st-input"
                      placeholder="e.g. O+"
                      value={newPatient.bloodGroup}
                      onChange={(e) => setNewPatient({ ...newPatient, bloodGroup: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Row 3 */}
              <div className="st-form-row">
                <div className="st-form-group">
                  <label className="st-form-label">ASSIGNED CLINICAL HEALER</label>
                  <select
                    className="st-input"
                    value={newPatient.assignedHealer}
                    onChange={(e) => setNewPatient({ ...newPatient, assignedHealer: e.target.value })}
                  >
                    <option value="Dr. Anjali Rao">Dr. Anjali Rao</option>
                    <option value="Dr. Kevin Smith">Dr. Kevin Smith</option>
                  </select>
                </div>
              </div>

              <span className="pa-info-block-title" style={{ marginTop: '12px' }}>Emergency Contact</span>
              
              <div className="st-form-row">
                <div className="st-form-group">
                  <label className="st-form-label">CONTACT NAME</label>
                  <input
                    type="text"
                    className="st-input"
                    placeholder="Emergency Name"
                    value={newPatient.emergencyName}
                    onChange={(e) => setNewPatient({ ...newPatient, emergencyName: e.target.value })}
                  />
                </div>
                <div className="st-form-group">
                  <label className="st-form-label">RELATION</label>
                  <input
                    type="text"
                    className="st-input"
                    placeholder="Relation"
                    value={newPatient.emergencyRelation}
                    onChange={(e) => setNewPatient({ ...newPatient, emergencyRelation: e.target.value })}
                  />
                </div>
                <div className="st-form-group">
                  <label className="st-form-label">MOBILE NUMBER</label>
                  <input
                    type="text"
                    className="st-input"
                    placeholder="Emergency Mobile"
                    value={newPatient.emergencyMobile}
                    onChange={(e) => setNewPatient({ ...newPatient, emergencyMobile: e.target.value })}
                  />
                </div>
              </div>

              <span className="pa-info-block-title" style={{ marginTop: '12px' }}>Clinical Information</span>

              <div className="st-form-row">
                <div className="st-form-group">
                  <label className="st-form-label">HEALTH CONDITIONS (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    className="st-input"
                    placeholder="e.g. Hypertension, Lower Back Pain"
                    value={newPatient.conditions}
                    onChange={(e) => setNewPatient({ ...newPatient, conditions: e.target.value })}
                  />
                </div>
                <div className="st-form-group">
                  <label className="st-form-label">ALLERGIES (COMMA SEPARATED)</label>
                  <input
                    type="text"
                    className="st-input"
                    placeholder="e.g. Lavender oil, Dust"
                    value={newPatient.allergies}
                    onChange={(e) => setNewPatient({ ...newPatient, allergies: e.target.value })}
                  />
                </div>
              </div>

              <div className="st-form-group">
                <label className="st-form-label">CLINICAL OBSERVATION NOTES</label>
                <textarea
                  className="st-textarea"
                  rows={2}
                  placeholder="Enter medical notes or healing specifics..."
                  value={newPatient.notes}
                  onChange={(e) => setNewPatient({ ...newPatient, notes: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleAddPatientSubmit}>Add Patient</button>
          </div>
        </div>
      </IonModal>

      {/* ==========================================
          MODAL 2: EDIT PATIENT FORM
         ========================================== */}
      <IonModal isOpen={showEditModal} onDidDismiss={() => setShowEditModal(false)} className="sa-modal">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Edit Patient Profile: {editForm?.name}</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowEditModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            {editForm && (
              <div className="st-form">
                <div className="st-form-row">
                  <div className="st-form-group">
                    <label className="st-form-label">FULL PATIENT NAME</label>
                    <input
                      type="text"
                      className="st-input"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div className="st-form-group">
                    <label className="st-form-label">MOBILE NUMBER</label>
                    <input
                      type="text"
                      className="st-input"
                      value={editForm.mobile}
                      onChange={(e) => setEditForm({ ...editForm, mobile: e.target.value })}
                    />
                  </div>
                </div>

                <div className="st-form-row">
                  <div className="st-form-group">
                    <label className="st-form-label">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      className="st-input"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    />
                  </div>
                  <div className="st-form-row" style={{ gap: '10px' }}>
                    <div className="st-form-group">
                      <label className="st-form-label">AGE</label>
                      <input
                        type="number"
                        className="st-input"
                        value={editForm.age}
                        onChange={(e) => setEditForm({ ...editForm, age: Number(e.target.value) })}
                      />
                    </div>
                    <div className="st-form-group">
                      <label className="st-form-label">BLOOD GROUP</label>
                      <input
                        type="text"
                        className="st-input"
                        value={editForm.bloodGroup}
                        onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
                      />
                    </div>
                    <div className="st-form-group">
                      <label className="st-form-label">CLINICAL STATUS</label>
                      <select
                        className="st-input"
                        value={editForm.status}
                        onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="st-form-row">
                  <div className="st-form-group">
                    <label className="st-form-label">ASSIGNED HEALER</label>
                    <select
                      className="st-input"
                      value={editForm.assignedHealer}
                      onChange={(e) => setEditForm({ ...editForm, assignedHealer: e.target.value })}
                    >
                      <option value="Dr. Anjali Rao">Dr. Anjali Rao</option>
                      <option value="Dr. Kevin Smith">Dr. Kevin Smith</option>
                    </select>
                  </div>
                </div>

                <span className="pa-info-block-title" style={{ marginTop: '12px' }}>Medical Notes</span>

                <div className="st-form-group">
                  <label className="st-form-label">CLINICAL PROFILE OVERVIEW</label>
                  <textarea
                    className="st-textarea"
                    rows={3}
                    value={editForm.medicalInfo.notes}
                    onChange={(e) => setEditForm({
                      ...editForm,
                      medicalInfo: { ...editForm.medicalInfo, notes: e.target.value }
                    })}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleEditPatientSubmit}>Save Changes</button>
          </div>
        </div>
      </IonModal>

      {/* ==========================================
          MODAL 3: CREATE APPOINTMENT
         ========================================== */}
      <IonModal isOpen={showAptModal} onDidDismiss={() => setShowAptModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Book Appointment</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowAptModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="st-form">
              <div className="st-form-group">
                <label className="st-form-label">APPOINTMENT DATE</label>
                <input
                  type="date"
                  className="st-input"
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                />
              </div>
              <div className="st-form-group">
                <label className="st-form-label">SCHEDULED TIME SLOT</label>
                <input
                  type="text"
                  className="st-input"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                />
              </div>
              <div className="st-form-group">
                <label className="st-form-label">ASSIGNED CLINICAL HEALER</label>
                <select
                  className="st-input"
                  value={appointmentForm.healer}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, healer: e.target.value })}
                >
                  <option value="Dr. Anjali Rao">Dr. Anjali Rao</option>
                  <option value="Dr. Kevin Smith">Dr. Kevin Smith</option>
                </select>
              </div>
              <div className="st-form-group">
                <label className="st-form-label">APPOINTMENT INITIAL STATUS</label>
                <select
                  className="st-input"
                  value={appointmentForm.status}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, status: e.target.value as any })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                </select>
              </div>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowAptModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleAddAppointment}>Confirm Appointment</button>
          </div>
        </div>
      </IonModal>

      {/* ==========================================
          MODAL 4: CREATE HEALING SESSION
         ========================================== */}
      <IonModal isOpen={showSesModal} onDidDismiss={() => setShowSesModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Add Healing Session Record</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowSesModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="st-form">
              <div className="st-form-group">
                <label className="st-form-label">CLINICAL HEALER</label>
                <select
                  className="st-input"
                  value={sessionForm.healer}
                  onChange={(e) => setSessionForm({ ...sessionForm, healer: e.target.value })}
                >
                  <option value="Dr. Anjali Rao">Dr. Anjali Rao</option>
                  <option value="Dr. Kevin Smith">Dr. Kevin Smith</option>
                </select>
              </div>
              <div className="st-form-group">
                <label className="st-form-label">SESSION STATUS</label>
                <select
                  className="st-input"
                  value={sessionForm.status}
                  onChange={(e) => setSessionForm({ ...sessionForm, status: e.target.value as any })}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="st-form-group">
                <label className="st-form-label">CLINICAL ENERGETIC SESSION NOTES</label>
                <textarea
                  className="st-textarea"
                  rows={3}
                  placeholder="Describe chakras treated, blockages cleared..."
                  value={sessionForm.notes}
                  onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
                />
              </div>
              <div className="st-form-group">
                <label className="st-form-label">FOLLOW UP RECOMMENDED DATE</label>
                <input
                  type="date"
                  className="st-input"
                  value={sessionForm.followUpDate}
                  onChange={(e) => setSessionForm({ ...sessionForm, followUpDate: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowSesModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleAddSession}>Create Session</button>
          </div>
        </div>
      </IonModal>

      {/* ==========================================
          MODAL 5: GENERATE INVOICE
         ========================================== */}
      <IonModal isOpen={showInvoiceModal} onDidDismiss={() => setShowInvoiceModal(false)} className="sa-modal sa-modal--sm">
        <div className="sa-modal__content">
          <div className="sa-modal__header">
            <h2>Generate Invoice</h2>
            <button className="sa-modal__close-btn" onClick={() => setShowInvoiceModal(false)}>×</button>
          </div>
          <div className="sa-modal__body">
            <div className="st-form">
              <div className="st-form-group">
                <label className="st-form-label">INVOICE AMOUNT (INR) *</label>
                <input
                  type="number"
                  className="st-input"
                  value={invoiceForm.amount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <div className="sa-modal__footer">
            <button className="sa-btn sa-btn--outline" onClick={() => setShowInvoiceModal(false)}>Cancel</button>
            <button className="sa-btn sa-btn--primary" onClick={handleGenerateInvoice}>Generate Bill</button>
          </div>
        </div>
      </IonModal>
    </IonPage>
  );
};

export default PatientsPage;
