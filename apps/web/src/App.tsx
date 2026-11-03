import React, { useState, useEffect } from 'react';
import {
  Activity, AlertTriangle, ArrowUpRight, Award, Bell, Calendar, Check, CheckCircle2, CheckSquare, ChevronDown, ChevronLeft, ChevronRight, Clock, DollarSign, Download, Edit3, Eye, FileText, Filter, Heart, LayoutDashboard, Lock, LogOut, Mail, MapPin, MoreVertical, PhoneCall, Plus, Radio, RefreshCw, Search, Send, Shield, ShieldCheck, Trash2, TrendingUp, UserPlus, Users, X
} from 'lucide-react';
import './style.css';

type NavSection = 'overview' | 'map' | 'bookings' | 'beneficiaries' | 'workforce' | 'earnings' | 'payments' | 'staff' | 'funding' | 'sos' | 'audit';

interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
}

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5089' 
  : '';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('thodu_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [emailInput, setEmailInput] = useState('raju@thodu.sriddha.com');
  const [passwordInput, setPasswordInput] = useState('admin123');
  const [activeSection, setActiveSection] = useState<NavSection>('overview'); // Direct to requested screen
  const [loading, setLoading] = useState(false);

  // Live Database States
  const [analytics, setAnalytics] = useState<any>(null);
  const [beneficiaries, setBeneficiaries] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [caregivers, setCaregivers] = useState<any[]>([]);
  const [sponsorships, setSponsorships] = useState<any[]>([]);
  const [sosQueue, setSosQueue] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // 1. Caregiver Workforce Filter States (Matching Image 1)
  const [cgTab, setCgTab] = useState<'ALL' | 'SALARIED' | 'FREELANCE' | 'ON_DUTY' | 'AVAILABLE'>('ALL');
  const [cgSearchQuery, setCgSearchQuery] = useState('');
  const [cgEmploymentFilter, setCgEmploymentFilter] = useState('ALL');
  const [cgZoneFilter, setCgZoneFilter] = useState('ALL');
  const [cgAvailabilityFilter, setCgAvailabilityFilter] = useState('ALL');
  const [cgVerificationFilter, setCgVerificationFilter] = useState('ALL');
  const [selectedCgIds, setSelectedCgIds] = useState<string[]>([]);
  const [openCgActionId, setOpenCgActionId] = useState<string | null>(null);

  // 2. Bookings Filter & Action States (Matching Image from previous request)
  const [bookingSearchQuery, setBookingSearchQuery] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');
  const [bookingServiceFilter, setBookingServiceFilter] = useState('ALL');
  const [bookingFundingFilter, setBookingFundingFilter] = useState('ALL');
  const [openBookingActionId, setOpenBookingActionId] = useState<string | null>(null);

  // Beneficiaries Section States (Exact Match to Reference Image 2)
  const [benTab, setBenTab] = useState<'ALL' | 'SENIOR' | 'DISABILITY'>('ALL');
  const [benSearchQuery, setBenSearchQuery] = useState('');
  const [benCategoryFilter, setBenCategoryFilter] = useState('ALL');
  const [benStatusFilter, setBenStatusFilter] = useState('ALL');
  const [selectedBenIds, setSelectedBenIds] = useState<string[]>([]);
  const [openBenActionId, setOpenBenActionId] = useState<string | null>(null);
  const [selectedBeneficiaryDetail, setSelectedBeneficiaryDetail] = useState<any | null>(null);

  // 200% Modules State
  const [caregiverPayouts, setCaregiverPayouts] = useState<any[]>([]);
  const [paymentTransactions, setPaymentTransactions] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedTrackingBooking, setSelectedTrackingBooking] = useState<any | null>(null);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);

  // 4-Step Caregiver Wizard State (Matching Image)
  const [cgWizardStep, setCgWizardStep] = useState<number>(1);
  const [cgWizardForm, setCgWizardForm] = useState({
    fullName: 'Anitha',
    gender: 'Female',
    dateOfBirth: '1990-03-12',
    age: 36,
    phone: '+91 98765 11111',
    alternatePhone: '+91 91234 56789',
    email: 'anitha.care@gmail.com',
    languages: ['Telugu', 'English', 'Hindi'],
    address: '#12-4-56, T.T.D. Colony, Tirupati - 517501, Andhra Pradesh',
    zone: 'Tirupati Urban',
    pincode: '517501',
    employmentType: 'Salaried',
    skills: ['Elder Companionship', 'Cooking Assistance', 'Mobility Support'],
    experienceYears: 6,
    aadhaarNumber: 'XXXX-XXXX-4589',
    policeClearanceStatus: 'Verified',
    workingShift: 'Morning (08:00 AM - 02:00 PM)'
  });

  const [newStaffForm, setNewStaffForm] = useState({
    fullName: '',
    role: 'Trust Care Coordinator',
    phone: '',
    email: '',
    serviceZone: 'Tirupati Urban'
  });

  const [editingBooking, setEditingBooking] = useState<any | null>(null);

  const [editingBeneficiary, setEditingBeneficiary] = useState<any | null>(null);
  const [editingCaregiver, setEditingCaregiver] = useState<any | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<any | null>(null);


  // Form State for Add Beneficiary
  
  // Beneficiary 4-Step Wizard State
  const [benWizardStep, setBenWizardStep] = useState<number>(1);
  const [benWizardForm, setBenWizardForm] = useState({
    fullName: '',
    category: 'Senior Citizen',
    dateOfBirth: '1958-05-14',
    age: 68,
    gender: 'Female',
    bloodGroup: 'B+',
    photoUrl: '',
    aadhaarNumber: 'XXXX-XXXX-8912',
    udidNumber: '',
    relationship: 'Mother',
    primaryGuardian: 'Anita Sharma',
    guardianPhone: '+91 98765 43210',
    alternateGuardianPhone: '+91 91234 56789',
    guardianEmail: 'anita.sharma@gmail.com',
    address: '#14-2, T.T.D. Colony, Tirupati - 517501',
    zone: 'T.T.D. Colony',
    pincode: '517501',
    mobilityStatus: 'Assisted Walking',
    medicalConditions: ['Hypertension', 'Type 2 Diabetes', 'Osteoarthritis'],
    allergies: 'Penicillin',
    accessibilityNeeds: 'Walking support, routine knee compression, diabetic diet',
    emergencyDoctorName: 'Dr. S. K. Raman (Apollo Tirupati)',
    emergencyDoctorPhone: '+91 98480 11223',
    subsidyTier: '100% Trust Covered (BPL/White Card)',
    rationCardNumber: 'WAP-1082-99120'
  });

  const [newBenForm, setNewBenForm] = useState({
    fullName: '',
    category: 'Senior Citizen',
    age: '',
    gender: 'Female',
    relationship: 'Mother',
    primaryGuardian: 'Anita Sharma',
    primaryContact: '+91 98765 43210',
    address: 'T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Walking assistance, routine health monitoring'
  });

  const [assigningBooking, setAssigningBooking] = useState<any | null>(null);

  // Modals state
  const [showAddBookingModal, setShowAddBookingModal] = useState(false);
  const [showAddBenModal, setShowAddBenModal] = useState(false);
  const [showAddCaregiverModal, setShowAddCaregiverModal] = useState(false);
  const [selectedCaregiverDetail, setSelectedCaregiverDetail] = useState<any | null>(null);

  // Auto-Suggest for Customer in Booking
  const [beneficiaryQuery, setBeneficiaryQuery] = useState('');
  const [suggestedBeneficiaries, setSuggestedBeneficiaries] = useState<any[]>([]);
  const [showSuggestDropdown, setShowSuggestDropdown] = useState(false);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    beneficiaryName: '',
    serviceName: 'Household Support',
    scheduledDate: 'Mar 15, 2026',
    scheduledTimeSlot: '10:00 AM - 12:00 PM',
    serviceAddress: 'T.T.D. Colony, Tirupati',
    fundingType: 'Trust Sponsored',
    caregiverName: 'Unassigned',
    paymentMode: 'TRUST_GRANT',
    paymentStatus: 'SUBSIDIZED',
    status: 'Awaiting Assignment'
  });

  // Caregiver Form State
  const [newCgForm, setNewCgForm] = useState({
    fullName: '',
    phone: '+91 98765 00000',
    employmentType: 'Salaried',
    skills: 'Elder Companionship, Cooking',
    zone: 'Tirupati Urban'
  });

  // Fetch Live Database
  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, benRes, bkRes, cgRes, spRes, sosRes, audRes, payRes, txRes, stRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/analytics`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/beneficiaries`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/bookings`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/caregivers`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/sponsorship`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/sos/queue`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/audit-logs`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/caregiver-payouts`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/payments`).then(r => r.json()).catch(() => null),
        fetch(`${API_BASE_URL}/api/v1/staff`).then(r => r.json()).catch(() => null)
      ]);

      if (analyticsRes?.data) setAnalytics(analyticsRes.data);
      if (benRes?.beneficiaries) setBeneficiaries(benRes.beneficiaries);
      if (bkRes?.bookings) setBookings(bkRes.bookings);
      if (cgRes?.caregivers) setCaregivers(cgRes.caregivers);
      if (spRes?.applications) setSponsorships(spRes.applications);
      if (sosRes?.queue) setSosQueue(sosRes.queue);
      if (audRes?.auditLogs) setAuditLogs(audRes.auditLogs);
      if (payRes?.payouts) setCaregiverPayouts(payRes.payouts);
      if (txRes?.payments) setPaymentTransactions(txRes.payments);
      if (stRes?.staff) setStaffList(stRes.staff);
    } catch (e) {
      console.error('Fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user: UserSession = {
      id: 'usr-admin',
      name: 'Raju Kumar',
      email: emailInput,
      role: 'Super Admin',
      phone: '+91 94444 56789'
    };
    localStorage.setItem('thodu_session', JSON.stringify(user));
    setSession(user);
  };

  const handleLogout = () => {
    if (window.confirm('Log out from Thodu Admin Panel?')) {
      localStorage.removeItem('thodu_session');
      setSession(null);
    }
  };

  // Broadcast Booking to Gig Caregivers
  
  
  const exportToCsv = (filename: string, rows: object[]) => {
    if (!rows || !rows.length) return;
    const separator = ',';
    const keys = Object.keys(rows[0]);
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = (row as any)[k] === null || (row as any)[k] === undefined ? '' : (row as any)[k];
          cell = cell instanceof Date ? cell.toLocaleString() : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleBeneficiarySearch = (val: string) => {
    setBeneficiaryQuery(val);
    setBookingForm(prev => ({ ...prev, beneficiaryName: val }));
    if (val.trim().length > 0) {
      const matches = beneficiaries.filter(b => 
        b.fullName.toLowerCase().includes(val.toLowerCase()) ||
        b.primaryGuardian?.toLowerCase().includes(val.toLowerCase()) ||
        b.primaryContact?.includes(val)
      );
      setSuggestedBeneficiaries(matches);
      setShowSuggestDropdown(true);
    } else {
      setShowSuggestDropdown(false);
    }
  };

  const selectSuggestedBeneficiary = (b: any) => {
    setBeneficiaryQuery(b.fullName);
    setBookingForm(prev => ({
      ...prev,
      beneficiaryName: b.fullName,
      serviceAddress: b.address
    }));
    setShowSuggestDropdown(false);
  };

  const toggleSelectBen = (id: string) => {
    setSelectedBenIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selectAllBens = () => {
    if (selectedBenIds.length === filteredBeneficiaries.length) {
      setSelectedBenIds([]);
    } else {
      setSelectedBenIds(filteredBeneficiaries.map(b => b.id));
    }
  };

  const handleSaveBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBooking) {
        const res = await fetch(`${API_BASE_URL}/api/v1/bookings/${editingBooking.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingForm)
        });
        const data = await res.json();
        if (data.booking) {
          setShowAddBookingModal(false);
          setEditingBooking(null);
          fetchData();
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/v1/bookings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bookingForm)
        });
        const data = await res.json();
        if (data.booking) {
          setShowAddBookingModal(false);
          fetchData();
        }
      }
    } catch (err) {
      alert('Failed to save booking');
    }
  };

  const handleSaveBeneficiary = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBeneficiary) {
        const res = await fetch(`${API_BASE_URL}/api/v1/beneficiaries/${editingBeneficiary.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBenForm)
        });
        const data = await res.json();
        if (data.beneficiary) {
          setShowAddBenModal(false);
          setEditingBeneficiary(null);
          fetchData();
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/v1/beneficiaries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBenForm)
        });
        const data = await res.json();
        if (data.beneficiary) {
          setShowAddBenModal(false);
          fetchData();
        }
      }
    } catch (err) {
      alert('Error saving beneficiary');
    }
  };

  // Filtered Beneficiaries matching tabs and search
  const filteredBeneficiaries = beneficiaries.filter(b => {
    const matchesTab = benTab === 'ALL' || 
      (benTab === 'SENIOR' && b.category === 'Senior Citizen') ||
      (benTab === 'DISABILITY' && b.category === 'Person with Disability');

    const matchesCategory = benCategoryFilter === 'ALL' || b.category === benCategoryFilter;
    const matchesStatus = benStatusFilter === 'ALL' || b.status === benStatusFilter;

    const matchesQuery = !benSearchQuery || 
      b.fullName.toLowerCase().includes(benSearchQuery.toLowerCase()) ||
      b.refNumber.toLowerCase().includes(benSearchQuery.toLowerCase()) ||
      b.primaryGuardian.toLowerCase().includes(benSearchQuery.toLowerCase()) ||
      b.primaryContact.includes(benSearchQuery);

    return matchesTab && matchesCategory && matchesStatus && matchesQuery;
  });

  const handleBroadcastBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/bookings/${bookingId}/broadcast`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Booking broadcasted to all active gig caregivers in the area!');
        setOpenBookingActionId(null);
        fetchData();
      }
    } catch (e) {
      alert('Error broadcasting booking');
    }
  };

  // Assign Caregiver directly to booking
  const handleAssignCaregiver = async (bookingId: string, caregiverName: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/bookings/${bookingId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caregiverName })
      });
      const data = await res.json();
      if (data.success) {
        setAssigningBooking(null);
        setOpenBookingActionId(null);
        fetchData();
      }
    } catch (e) {
      alert('Error assigning caregiver');
    }
  };

  // Filtered Caregivers
  const filteredCaregivers = caregivers.filter(cg => {
    const matchesTab = cgTab === 'ALL' ||
      (cgTab === 'SALARIED' && cg.employmentType === 'Salaried') ||
      (cgTab === 'FREELANCE' && cg.employmentType.includes('Freelance')) ||
      (cgTab === 'ON_DUTY' && cg.availability === 'On Duty') ||
      (cgTab === 'AVAILABLE' && cg.availability === 'Available');

    const matchesEmployment = cgEmploymentFilter === 'ALL' || cg.employmentType === cgEmploymentFilter;
    const matchesZone = cgZoneFilter === 'ALL' || cg.zone === cgZoneFilter;
    const matchesAvailability = cgAvailabilityFilter === 'ALL' || cg.availability === cgAvailabilityFilter;
    const matchesVerification = cgVerificationFilter === 'ALL' || cg.verificationStatus === cgVerificationFilter;

    const matchesQuery = !cgSearchQuery ||
      cg.fullName.toLowerCase().includes(cgSearchQuery.toLowerCase()) ||
      cg.refNumber.toLowerCase().includes(cgSearchQuery.toLowerCase()) ||
      cg.phone.includes(cgSearchQuery) ||
      cg.zone.toLowerCase().includes(cgSearchQuery.toLowerCase());

    return matchesTab && matchesEmployment && matchesZone && matchesAvailability && matchesVerification && matchesQuery;
  });

  // Filtered Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesQuery = !bookingSearchQuery || 
      b.beneficiaryName.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
      b.bookingNumber.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
      b.caregiverName.toLowerCase().includes(bookingSearchQuery.toLowerCase()) ||
      b.serviceAddress.toLowerCase().includes(bookingSearchQuery.toLowerCase());

    const matchesStatus = bookingStatusFilter === 'ALL' || b.status === bookingStatusFilter;
    const matchesService = bookingServiceFilter === 'ALL' || b.serviceName === bookingServiceFilter;
    const matchesFunding = bookingFundingFilter === 'ALL' || b.fundingType === bookingFundingFilter;

    return matchesQuery && matchesStatus && matchesService && matchesFunding;
  });

  // Checkbox helpers
  const toggleSelectCg = (id: string) => {
    setSelectedCgIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const selectAllCgs = () => {
    if (selectedCgIds.length === filteredCaregivers.length) {
      setSelectedCgIds([]);
    } else {
      setSelectedCgIds(filteredCaregivers.map(c => c.id));
    }
  };

  // 1. SIGN IN SCREEN
  if (!session) {
    return (
      <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top, #FFF8E6 0%, #F5EED8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ maxWidth: '460px', width: '100%', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 20px 40px rgba(11, 93, 59, 0.08)', border: '1px solid #E5E9E6', padding: '40px 36px', textAlign: 'center' }}>
          <div style={{ marginBottom: '24px' }}>
            <img src="/thodu_logo_horizontal.png" alt="Thodu Elder Care" style={{ width: '280px', height: 'auto', margin: '0 auto', display: 'block' }} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B', marginBottom: '6px' }}>Super Admin Sign In</h2>
          <p style={{ fontSize: '13px', color: '#6B7C72', marginBottom: '28px' }}>Sri Divyang Seva Kendram Trust</p>
          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#6B7C72" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input type="email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} required style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '12px', border: '1.5px solid #E5E9E6', fontSize: '14px', outline: 'none' }} />
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#6B7C72" style={{ position: 'absolute', left: 14, top: 14 }} />
                <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} required style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '12px', border: '1.5px solid #E5E9E6', fontSize: '14px', outline: 'none' }} />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px', justifyContent: 'center' }}>
              Sign In to Super Admin Workspace →
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="web-layout">
      {/* Left Sidebar */}
      <aside className="web-sidebar">
        <div className="sidebar-brand">
          <img src="/thodu_logo_horizontal.png" alt="Thodu" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
        </div>

        <nav className="sidebar-nav">
          <button className={`nav-link ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => setActiveSection('overview')}>
            <TrendingUp size={18} />
            <span>Overview & Analytics</span>
          </button>
          
          <button className={`nav-link ${activeSection === 'map' ? 'active' : ''}`} onClick={() => setActiveSection('map')}>
            <MapPin size={18} />
            <span>Live Dispatch Map</span>
          </button>
          <button className={`nav-link ${activeSection === 'bookings' ? 'active' : ''}`} onClick={() => setActiveSection('bookings')}>
            <Calendar size={18} />
            <span>Care Bookings</span>
          </button>
          <button className={`nav-link ${activeSection === 'beneficiaries' ? 'active' : ''}`} onClick={() => setActiveSection('beneficiaries')}>
            <Users size={18} />
            <span>Beneficiaries & Families</span>
          </button>
          <button className={`nav-link ${activeSection === 'workforce' ? 'active' : ''}`} onClick={() => setActiveSection('workforce')}>
            <ShieldCheck size={18} />
            <span>Caregiver Workforce</span>
          </button>
          
          <button className={`nav-link ${activeSection === 'earnings' ? 'active' : ''}`} onClick={() => setActiveSection('earnings')}>
            <Award size={18} />
            <span>Caregiver Earnings</span>
          </button>
          <button className={`nav-link ${activeSection === 'payments' ? 'active' : ''}`} onClick={() => setActiveSection('payments')}>
            <DollarSign size={18} />
            <span>Billing & Payments</span>
          </button>
          <button className={`nav-link ${activeSection === 'staff' ? 'active' : ''}`} onClick={() => setActiveSection('staff')}>
            <Users size={18} />
            <span>Trust Staff Directory</span>
          </button>
          <button className={`nav-link ${activeSection === 'funding' ? 'active' : ''}`} onClick={() => setActiveSection('funding')}>
            <DollarSign size={18} />
            <span>Sponsorship & Subsidies</span>
          </button>
          <button className={`nav-link ${activeSection === 'sos' ? 'active' : ''}`} onClick={() => setActiveSection('sos')}>
            <AlertTriangle size={18} color="#FF8A80" />
            <span style={{ color: activeSection === 'sos' ? '#FFF' : '#FF8A80' }}>
              SOS Queue {analytics?.activeSosCount > 0 && `(${analytics.activeSosCount})`}
            </span>
          </button>
          <button className={`nav-link ${activeSection === 'audit' ? 'active' : ''}`} onClick={() => setActiveSection('audit')}>
            <FileText size={18} />
            <span>Trust Audit Logs</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
                RK
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600 }}>Raju Kumar</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Super Admin</p>
              </div>
            </div>
            <button onClick={handleLogout} title="Log Out" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#FF8A80' }}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <main className="web-main">
        {/* Top Header */}
        <header className="web-topbar">
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>
              {activeSection === 'workforce' && 'Caregiver Workforce'}
              {activeSection === 'map' && 'Fleet Geo-Operations & Live Dispatch Map'}
              {activeSection === 'earnings' && 'Caregiver Earnings & Payout Requests'}
              {activeSection === 'payments' && 'Financial Ledger & Invoices'}
              {activeSection === 'staff' && 'Trust Staff Management & Operations'}

              {activeSection === 'bookings' && 'Care Service Bookings & Dispatch Board'}
              {activeSection === 'beneficiaries' && 'Beneficiaries & Families'}
              {activeSection === 'overview' && 'Overview & Analytics'}
              {activeSection === 'funding' && 'Trust Sponsorship & Subsidies'}
              {activeSection === 'sos' && 'Emergency Rapid Response Queue'}
              {activeSection === 'audit' && 'Trust Security Audit Trail'}
            </h1>
            <p style={{ fontSize: '12px', color: '#6B7C72' }}>
              {activeSection === 'workforce' && 'Manage caregivers, their employment, availability and verification'}
              {activeSection === 'bookings' && 'Manage salaried roster assignment, gig broadcasts, and status'}
              {activeSection === 'beneficiaries' && 'Manage all registered beneficiaries and their family/guardian details'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 10 }} />
              <input 
                placeholder="Search by name, phone, or ID..."
                style={{ padding: '7px 12px 7px 34px', borderRadius: '10px', border: '1px solid #E5E9E6', fontSize: '12px', width: '260px', outline: 'none' }}
              />
            </div>

            <button onClick={fetchData} title="Refresh Database" style={{ background: '#FFF', border: '1px solid #E5E9E6', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px' }}>
              <RefreshCw size={13} className={loading ? 'spin' : ''} /> Refresh
            </button>

            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FFF', border: '1px solid #FFCDD2', color: '#C62828', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
              <LogOut size={13} /> Log Out
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div className="web-content">
          {/* ========================================================================= */}
          {/* 1. CAREGIVER WORKFORCE (EXACT PIXEL-PERFECT CLONE OF IMAGE 1)              */}
          {/* ========================================================================= */}
          {activeSection === 'workforce' && (
            <div>
              {/* Header Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
                <button 
                  className="btn-primary" 
                  onClick={() => setShowAddCaregiverModal(true)}
                  style={{ padding: '10px 20px', fontSize: '14px' }}
                >
                  <Plus size={16} /> Add Caregiver
                </button>
              </div>

              {/* 4 Summary Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                {/* 1. Total Caregivers */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} color="#0B5D3B" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Caregivers</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.totalCaregivers ?? caregivers.length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +12.1% vs last month</span>
                  </div>
                </div>

                {/* 2. Salaried Staff */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={22} color="#D81B60" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Salaried Staff</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.salariedStaff ?? caregivers.filter(c => c.employmentType === 'Salaried').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#6B7C72' }}>
                      ({analytics?.salariedStaffPct ?? 60}%)
                    </span>
                  </div>
                </div>

                {/* 3. Freelancers / Gig */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E1F5FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <TrendingUp size={22} color="#0288D1" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Freelancers / Gig</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.freelanceGig ?? caregivers.filter(c => c.employmentType.includes('Freelance')).length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#6B7C72' }}>
                      ({analytics?.freelanceGigPct ?? 25}%)
                    </span>
                  </div>
                </div>

                {/* 4. Verified Caregivers */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF8E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={22} color="#F9B233" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Verified Caregivers</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.verifiedCaregivers ?? caregivers.filter(c => c.verificationStatus === 'Verified').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>
                      ({analytics?.verifiedCaregiversPct ?? 96}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Segment Tabs */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <button 
                  onClick={() => setCgTab('ALL')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: cgTab === 'ALL' ? '#0B5D3B' : '#FFF', color: cgTab === 'ALL' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  All Caregivers ({caregivers.length})
                </button>
                <button 
                  onClick={() => setCgTab('SALARIED')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: cgTab === 'SALARIED' ? '#0B5D3B' : '#FFF', color: cgTab === 'SALARIED' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  Salaried ({caregivers.filter(c => c.employmentType === 'Salaried').length})
                </button>
                <button 
                  onClick={() => setCgTab('FREELANCE')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: cgTab === 'FREELANCE' ? '#0B5D3B' : '#FFF', color: cgTab === 'FREELANCE' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  Freelancers ({caregivers.filter(c => c.employmentType.includes('Freelance')).length})
                </button>
                <button 
                  onClick={() => setCgTab('ON_DUTY')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: cgTab === 'ON_DUTY' ? '#0B5D3B' : '#FFF', color: cgTab === 'ON_DUTY' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  On Duty ({caregivers.filter(c => c.availability === 'On Duty').length})
                </button>
                <button 
                  onClick={() => setCgTab('AVAILABLE')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: cgTab === 'AVAILABLE' ? '#0B5D3B' : '#FFF', color: cgTab === 'AVAILABLE' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  Available ({caregivers.filter(c => c.availability === 'Available').length})
                </button>
              </div>

              {/* Filter Toolbar */}
              <div style={{ background: '#FFF', borderRadius: 14, padding: '14px 18px', border: '1px solid #E5E9E6', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={15} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input 
                    placeholder="Search by name, phone, or caregiver ID..."
                    value={cgSearchQuery}
                    onChange={e => setCgSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <select 
                  value={cgEmploymentFilter} 
                  onChange={e => setCgEmploymentFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Employment: All</option>
                  <option value="Salaried">Employment: Salaried</option>
                  <option value="Freelance / Gig">Employment: Freelance / Gig</option>
                </select>

                <select 
                  value={cgZoneFilter} 
                  onChange={e => setCgZoneFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Zone: All</option>
                  <option value="Tirupati Urban">Tirupati Urban</option>
                  <option value="T.T.D. Colony">T.T.D. Colony</option>
                  <option value="Tirupati West">Tirupati West</option>
                </select>

                <select 
                  value={cgAvailabilityFilter} 
                  onChange={e => setCgAvailabilityFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Availability: All</option>
                  <option value="Available">Available</option>
                  <option value="On Duty">On Duty</option>
                </select>

                <select 
                  value={cgVerificationFilter} 
                  onChange={e => setCgVerificationFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Verification: All</option>
                  <option value="Verified">Verified</option>
                  <option value="Pending">Pending</option>
                </select>

                <button 
                  onClick={() => exportToCsv('thodu_caregivers_roster.csv', caregivers)}
                  style={{ background: '#FFF', border: '1px solid #E5E9E6', padding: '9px 16px', borderRadius: 8, fontSize: '13px', fontWeight: 600, color: '#1E2D24', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Download size={14} /> Export
                </button>
              </div>

              {/* Caregiver Table */}
              <div className="data-table-card">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>
                        <input 
                          type="checkbox" 
                          checked={selectedCgIds.length === filteredCaregivers.length && filteredCaregivers.length > 0}
                          onChange={selectAllCgs}
                        />
                      </th>
                      <th>CAREGIVER</th>
                      <th>EMPLOYMENT</th>
                      <th>PHONE</th>
                      <th>ZONE / AREA</th>
                      <th>RATING</th>
                      <th>VERIFICATION</th>
                      <th>AVAILABILITY</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCaregivers.map(cg => (
                      <tr key={cg.id}>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={selectedCgIds.includes(cg.id)}
                            onChange={() => toggleSelectCg(cg.id)}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: cg.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#0B5D3B' }}>
                              {cg.fullName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <strong style={{ fontSize: '13px' }}>{cg.fullName}</strong>
                              <div style={{ fontSize: '11px', color: '#6B7C72' }}>{cg.refNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 9999, fontWeight: 600, background: cg.employmentType === 'Salaried' ? '#E8F5E9' : '#E1F5FE', color: cg.employmentType === 'Salaried' ? '#2E7D32' : '#0288D1' }}>
                            {cg.employmentType}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1E2D24', fontSize: '12px' }}>
                            <PhoneCall size={12} color="#6B7C72" />
                            <span>{cg.phone}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6B7C72', fontSize: '12px' }}>
                            <MapPin size={12} />
                            <span>{cg.zone}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '12px' }}>
                            <span style={{ color: '#F9B233' }}>★</span>
                            <strong>{cg.rating}</strong>
                            <span style={{ color: '#6B7C72', fontSize: '11px' }}>({cg.ratingReviewsCount})</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 9999, fontWeight: 600, background: '#E8F5E9', color: '#2E7D32', display: 'flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>
                            <CheckCircle2 size={12} /> {cg.verificationStatus}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 9999, fontWeight: 600, background: cg.availability === 'Available' ? '#E8F5E9' : '#FFF3E0', color: cg.availability === 'Available' ? '#2E7D32' : '#E65100', display: 'flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>
                            ● {cg.availability}
                          </span>
                        </td>
                        <td style={{ position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button 
                              title="View Caregiver"
                              onClick={() => setSelectedCaregiverDetail(cg)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}
                            >
                              <Eye size={15} />
                            </button>
                            <button 
                              title="Edit Record"
                              onClick={() => {
    setEditingCaregiver(cg);
    setCgWizardForm({
      fullName: cg.fullName,
      gender: cg.gender || 'Female',
      dateOfBirth: cg.dateOfBirth || '1990-01-01',
      age: cg.age || 36,
      phone: cg.phone,
      alternatePhone: cg.alternatePhone || '',
      email: cg.email || '',
      languages: cg.languages || ['Telugu', 'English'],
      address: cg.address || '',
      zone: cg.zone,
      pincode: cg.pincode || '517501',
      employmentType: cg.employmentType,
      skills: cg.skills,
      experienceYears: cg.experienceYears || 5,
      aadhaarNumber: cg.aadhaarNumber || 'XXXX-XXXX-1234',
      policeClearanceStatus: cg.policeClearanceStatus || 'Verified',
      workingShift: cg.workingShift || 'Morning (08:00 AM - 02:00 PM)'
    });
    setShowAddCaregiverModal(true);
  }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}
                            >
                              <Edit3 size={15} />
                            </button>
                            <button 
                              onClick={() => setOpenCgActionId(openCgActionId === cg.id ? null : cg.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}
                            >
                              <MoreVertical size={15} />
                            </button>
                          </div>

                          {openCgActionId === cg.id && (
                            <div style={{ position: 'absolute', right: 20, top: 38, background: '#FFF', border: '1px solid #E5E9E6', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, width: 140 }}>
                              <button 
                                onClick={() => {
                                  setSelectedCaregiverDetail(cg);
                                  setOpenCgActionId(null);
                                }}
                                style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: '12px', cursor: 'pointer' }}
                              >
                                View Profile
                              </button>
                              <button 
                                onClick={async () => {
                                  setCaregivers(prev => prev.map(c => c.id === cg.id ? { ...c, availability: c.availability === 'Available' ? 'On Duty' : 'Available' } : c));
                                  setOpenCgActionId(null);
                                }}
                                style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: '12px', cursor: 'pointer', color: '#0B5D3B' }}
                              >
                                Toggle Duty
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Table Pagination */}
                <div style={{ padding: '14px 20px', borderTop: '1px solid #E5E9E6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6B7C72' }}>
                  <span>Showing 1 – {filteredCaregivers.length} of {caregivers.length} caregivers</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span>Rows per page:</span>
                    <select style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #E5E9E6', fontSize: '12px' }}>
                      <option>10</option>
                      <option>25</option>
                    </select>
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E5E9E6', background: '#FFF' }}>&lt;</button>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: '#0B5D3B', color: '#FFF', fontWeight: 600 }}>1</button>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E5E9E6', background: '#FFF' }}>&gt;</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. CARE SERVICE BOOKINGS & DISPATCH (WITH ASSIGN & BROADCAST FEATURES!)   */}
          {/* ========================================================================= */}
          
          {/* ========================================================================= */}
          {/* DISPATCH CENTER & LIVE TRACKING MAP (REAL-TIME TIRUPATI FLEET)           */}
          {/* ========================================================================= */}
          {activeSection === 'map' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B' }}>Live Dispatch & Fleet Map</h2>
                  <p style={{ fontSize: '13px', color: '#6B7C72', marginTop: 2 }}>
                    Real-time GPS positions of caregivers and beneficiary residences across Tirupati service zones
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button 
                    onClick={() => setActiveSection('bookings')}
                    className="btn-primary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    View All Bookings
                  </button>
                </div>
              </div>

              {/* Map Canvas with SVG Grid & Simulated Live GPS Pins */}
              <div className="map-canvas-container" style={{ position: 'relative', height: 500, background: '#E2EAE5', borderRadius: 16, overflow: 'hidden', border: '1px solid #C8D6CD' }}>
                {/* SVG Map Grid Background representing Tirupati Area */}
                <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0B5D3B" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  {/* Roadways Simulation */}
                  <path d="M 0 250 Q 250 200, 500 260 T 1000 240" fill="none" stroke="#FFF" strokeWidth="12" />
                  <path d="M 0 250 Q 250 200, 500 260 T 1000 240" fill="none" stroke="#A7C4B5" strokeWidth="6" />
                  <path d="M 350 0 L 400 600" fill="none" stroke="#FFF" strokeWidth="10" />
                  <path d="M 350 0 L 400 600" fill="none" stroke="#A7C4B5" strokeWidth="5" />
                </svg>

                {/* Tirupati Zone Label Overlays */}
                <div style={{ position: 'absolute', top: 20, left: 24, background: 'rgba(255,255,255,0.9)', padding: '6px 14px', borderRadius: 10, fontSize: '12px', fontWeight: 700, color: '#0B5D3B', border: '1px solid #D1DDD5' }}>
                  📍 Tirupati Urban Core • T.T.D. Colony
                </div>
                <div style={{ position: 'absolute', bottom: 20, left: 24, background: 'rgba(255,255,255,0.9)', padding: '8px 16px', borderRadius: 12, fontSize: '11px', color: '#4A5D52', border: '1px solid #D1DDD5' }}>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>Map Legend:</div>
                  <div style={{ display: 'flex', gap: 14 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2E7D32' }}></span> Beneficiary Home</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F9B233' }}></span> Caregiver In-Transit</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0288D1' }}></span> Active On-Visit</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, borderRadius: '50%', background: '#C62828' }}></span> SOS Alert</span>
                  </div>
                </div>

                {/* Beneficiary Pins */}
                {beneficiaries.map((b, idx) => {
                  const top = 150 + (idx * 55) % 300;
                  const left = 200 + (idx * 140) % 650;
                  return (
                    <div 
                      key={b.id} 
                      onClick={() => setSelectedBeneficiaryDetail(b)}
                      style={{ position: 'absolute', top, left, transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 10 }}
                      title={`Beneficiary: ${b.fullName} (${b.address})`}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#2E7D32', border: '3px solid #FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' }}>
                        <Users size={16} />
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.75)', color: '#FFF', padding: '2px 8px', borderRadius: 4, fontSize: '10px', marginTop: 4, textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {b.fullName}
                      </div>
                    </div>
                  );
                })}

                {/* Active Caregivers Pins with Transit Radar Pulse */}
                {caregivers.filter(c => c.availability === 'On Duty').map((c, idx) => {
                  const top = 200 + (idx * 90) % 250;
                  const left = 280 + (idx * 180) % 600;
                  return (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedCaregiverDetail(c)}
                      style={{ position: 'absolute', top, left, transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 20 }}
                      title={`Caregiver: ${c.fullName} (${c.zone})`}
                    >
                      <div className="map-radar-pulse" style={{ background: '#F9B233', left: '50%', top: '50%' }}></div>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F9B233', border: '3px solid #FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                        <ShieldCheck size={18} />
                      </div>
                      <div style={{ background: '#0B5D3B', color: '#FFF', padding: '2px 8px', borderRadius: 4, fontSize: '10px', marginTop: 4, textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 600 }}>
                        {c.fullName} (In Transit)
                      </div>
                    </div>
                  );
                })}

                {/* Active SOS Beacon (if any) */}
                {sosQueue.filter(s => s.status !== 'RESOLVED').map((s) => (
                  <div key={s.id} style={{ position: 'absolute', top: 220, left: 320, transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 30 }}>
                    <div className="map-radar-pulse map-sos-pulse" style={{ background: '#C62828', left: '50%', top: '50%' }}></div>
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: '#C62828', border: '3px solid #FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', boxShadow: '0 6px 16px rgba(198,40,40,0.5)' }}>
                      <AlertTriangle size={22} />
                    </div>
                    <div style={{ background: '#C62828', color: '#FFF', padding: '3px 8px', borderRadius: 4, fontSize: '10px', marginTop: 4, fontWeight: 700, whiteSpace: 'nowrap' }}>
                      EMERGENCY: {s.beneficiaryName}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Cards: Live Care Active Visits & Breadcrumb Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18, marginTop: 20 }}>
                <div className="data-table-card">
                  <div className="table-header">
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Active Live Care Visits</h3>
                      <p style={{ fontSize: '12px', color: '#6B7C72' }}>Ongoing assignments with live ETA and geo-fence check-in</p>
                    </div>
                  </div>
                  <table>
                    <thead>
                      <tr>
                        <th>Booking</th>
                        <th>Beneficiary</th>
                        <th>Caregiver</th>
                        <th>Distance & ETA</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.filter(b => b.status === 'In Progress' || b.status === 'Confirmed').map(b => (
                        <tr key={b.id}>
                          <td><strong>{b.bookingNumber}</strong></td>
                          <td>{b.beneficiaryName}</td>
                          <td><strong>{b.caregiverName}</strong></td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', color: '#0B5D3B', fontWeight: 600 }}>
                              <Clock size={13} /> {b.caregiverEtaMinutes || 10} mins ({b.geoDistanceKm || 0.8} km)
                            </div>
                          </td>
                          <td>
                            <button 
                              onClick={() => setSelectedTrackingBooking(b)}
                              style={{ background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#0B5D3B', padding: '4px 10px', borderRadius: 6, fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              Live Drawer
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Service Zones Coverage stats */}
                <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '1px solid #E5E9E6' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E2D24', marginBottom: 14 }}>Tirupati Zone Health</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#FAFBF9', borderRadius: 8 }}>
                      <span>Tirupati Urban:</span>
                      <strong style={{ color: '#0B5D3B' }}>2 Active Visits • 1 Available</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#FAFBF9', borderRadius: 8 }}>
                      <span>T.T.D. Colony:</span>
                      <strong style={{ color: '#0B5D3B' }}>1 Active Visit • 1 Gig Broadcast</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', background: '#FAFBF9', borderRadius: 8 }}>
                      <span>Tirupati West:</span>
                      <strong style={{ color: '#0B5D3B' }}>1 On Standby (Salaried)</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {activeSection === 'bookings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B' }}>All Care Bookings & Dispatch</h2>
                  <p style={{ fontSize: '13px', color: '#6B7C72', marginTop: 2 }}>
                    Manage salaried roster assignment and caregiver dispatch
                  </p>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={() => setShowAddBookingModal(true)}
                  style={{ padding: '10px 20px', fontSize: '14px' }}
                >
                  <Plus size={16} /> Create Booking
                </button>
              </div>

              {/* 4 Dispatch KPI Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={22} color="#0B5D3B" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Bookings</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>{bookings.length}</h3>
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +12.4% vs last month</span>
                  </div>
                </div>

                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF8E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} color="#F9B233" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Awaiting Assignment</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#F9B233', margin: '2px 0' }}>
                      {bookings.filter(b => b.caregiverName === 'Unassigned').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#E65100', fontWeight: 600 }}>Unassigned Roster</span>
                  </div>
                </div>

                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={22} color="#2E7D32" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Confirmed</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#2E7D32', margin: '2px 0' }}>
                      {bookings.filter(b => b.status === 'Confirmed').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +18.8% vs last month</span>
                  </div>
                </div>

                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E1F5FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <RefreshCw size={22} color="#0288D1" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>In Progress</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#0288D1', margin: '2px 0' }}>
                      {bookings.filter(b => b.status === 'In Progress').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#0288D1', fontWeight: 600 }}>Active Care Visits</span>
                  </div>
                </div>
              </div>

              {/* Filter Toolbar */}
              <div style={{ background: '#FFF', borderRadius: 14, padding: '14px 18px', border: '1px solid #E5E9E6', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={15} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input 
                    placeholder="Search booking ID or beneficiary..."
                    value={bookingSearchQuery}
                    onChange={e => setBookingSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <select 
                  value={bookingStatusFilter} 
                  onChange={e => setBookingStatusFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Status: All Statuses</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Awaiting Assignment">Awaiting Assignment</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                </select>

                <select 
                  value={bookingServiceFilter} 
                  onChange={e => setBookingServiceFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Service: All Services</option>
                  <option value="Household Support">Household Support</option>
                  <option value="Cooking Assistance">Cooking Assistance</option>
                  <option value="Companion Care">Companion Care</option>
                  <option value="Disability Support">Disability Support</option>
                </select>

                <button 
                  onClick={() => {
                    setBookingSearchQuery('');
                    setBookingStatusFilter('ALL');
                    setBookingServiceFilter('ALL');
                    setBookingFundingFilter('ALL');
                  }}
                  style={{ background: '#FFF', border: '1px solid #E5E9E6', padding: '9px 16px', borderRadius: 8, fontSize: '13px', fontWeight: 600, color: '#1E2D24', cursor: 'pointer' }}
                >
                  Clear Filters
                </button>
              </div>

              {/* Data Table */}
              <div className="data-table-card">
                <table>
                  <thead>
                    <tr>
                      <th>REF ⬍</th>
                      <th>BENEFICIARY</th>
                      <th>SERVICE</th>
                      <th>ADDRESS</th>
                      <th>DATE & TIME ⬍</th>
                      <th>FUNDING</th>
                      <th>ASSIGNED CAREGIVER</th>
                      <th>PAYABLE ⬍</th>
                      <th>STATUS</th>
                      <th>ACTIONS / DISPATCH</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map(bk => (
                      <tr key={bk.id}>
                        <td><strong>{bk.bookingNumber}</strong></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Users size={14} color="#0B5D3B" />
                            </div>
                            <div>
                              <strong style={{ fontSize: '13px' }}>{bk.beneficiaryName}</strong>
                              <div style={{ fontSize: '11px', color: '#6B7C72' }}>Age: {bk.beneficiaryAge} yrs</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Heart size={14} color="#0B5D3B" />
                            <span>{bk.serviceName}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6B7C72', fontSize: '12px' }}>
                            <MapPin size={12} />
                            <span>{bk.serviceAddress}</span>
                          </div>
                        </td>
                        <td>
                          <div>{bk.scheduledDate}</div>
                          <div style={{ fontSize: '11px', color: '#6B7C72' }}>{bk.scheduledTimeSlot}</div>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 9999, fontWeight: 600, background: bk.fundingType === 'Trust Sponsored' ? '#E8F5E9' : bk.fundingType === 'Family Paid' ? '#E1F5FE' : '#FFF8E1', color: bk.fundingType === 'Trust Sponsored' ? '#2E7D32' : bk.fundingType === 'Family Paid' ? '#0288D1' : '#F57F17' }}>
                            {bk.fundingType}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <ShieldCheck size={14} color={bk.caregiverName === 'Unassigned' ? '#F9B233' : '#0B5D3B'} />
                            <span style={{ fontWeight: bk.caregiverName === 'Unassigned' ? 400 : 600, color: bk.caregiverName === 'Unassigned' ? '#6B7C72' : '#1E2D24' }}>
                              {bk.caregiverName}
                            </span>
                          </div>
                        </td>
                        <td><strong>₹{(bk.familyPayablePaise / 100).toFixed(0)}</strong></td>
                        <td>
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 9999, fontWeight: 600, background: bk.status === 'Completed' ? '#E8F5E9' : bk.status === 'In Progress' ? '#E8F5E9' : bk.status === 'Awaiting Assignment' ? '#FFF3E0' : '#E3F2FD', color: bk.status === 'Completed' || bk.status === 'In Progress' ? '#2E7D32' : bk.status === 'Awaiting Assignment' ? '#E65100' : '#1565C0' }}>
                            {bk.status}
                          </span>
                        </td>
                        <td style={{ position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            {/* Broadcast Button */}
                            <button 
                              title="Broadcast Job to Freelancers"
                              onClick={() => handleBroadcastBooking(bk.id)}
                              style={{ background: '#FFF8E6', border: '1px solid #F9B233', color: '#B78103', borderRadius: 6, padding: '4px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                            >
                              <Radio size={12} /> Broadcast
                            </button>

                            {/* Direct Assign Button */}
                            <button 
                              title="Assign Caregiver"
                              onClick={() => setAssigningBooking(bk)}
                              style={{ background: '#E8F5E9', border: '1px solid #C8E6C9', color: '#0B5D3B', borderRadius: 6, padding: '4px 8px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                            >
                              <UserPlus size={12} /> Assign
                            </button>

                            <button 
                              onClick={() => setOpenBookingActionId(openBookingActionId === bk.id ? null : bk.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                            >
                              <MoreVertical size={16} color="#6B7C72" />
                            </button>
                          </div>

                          {openBookingActionId === bk.id && (
                            <div style={{ position: 'absolute', right: 20, top: 38, background: '#FFF', border: '1px solid #E5E9E6', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, width: 140 }}>
                              <button 
                                onClick={async () => {
                                  if (window.confirm('Delete this booking?')) {
                                    await fetch(`${API_BASE_URL}/api/v1/bookings/${bk.id}`, { method: 'DELETE' });
                                    setOpenBookingActionId(null);
                                    fetchData();
                                  }
                                }}
                                style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: '12px', cursor: 'pointer', color: '#C62828' }}
                              >
                                Delete Booking
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. OVERVIEW & ANALYTICS (FIXED ALIGNMENT & CHART SIZING)                   */}
          {/* ========================================================================= */}
          {activeSection === 'overview' && (
            <div>
              {/* Banner */}
              <div className="overview-welcome-banner">
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#0B5D3B' }}>Good Evening, Raju! 👋</h2>
                  <p style={{ fontSize: '14px', color: '#6B7C72', marginTop: 4 }}>
                    Here's how Thodu is caring for our elders and special members today.
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FFF', padding: '8px 16px', borderRadius: '12px', border: '1px solid #F5E6BE', fontSize: '13px', fontWeight: 600, color: '#0B5D3B' }}>
                  <Calendar size={16} />
                  <span>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', weekday: 'short' })}</span>
                </div>
              </div>

              {/* 6 Top Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 14, marginBottom: 24 }}>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Beneficiaries</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '6px 0' }}>{beneficiaries.length}</h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +8.4% vs last month</span>
                </div>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Active Caregivers</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '6px 0' }}>{caregivers.length}</h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +12.1%</span>
                </div>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Bookings (This Month)</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '6px 0' }}>{bookings.length}</h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +18.7%</span>
                </div>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Services Completed</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '6px 0' }}>{bookings.filter(b => b.status === 'Completed').length}</h3>
                  <span style={{ fontSize: '11px', color: '#6B7C72' }}>96.8% completion</span>
                </div>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Revenue (This Month)</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '6px 0' }}>₹{analytics?.revenueInr ?? 0}</h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +26.3%</span>
                </div>
                <div className="metric-pill-card">
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Sponsored Services</span>
                  <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '6px 0' }}>{bookings.filter(b => b.fundingType !== 'Family Paid').length}</h3>
                  <span style={{ fontSize: '11px', color: '#6B7C72' }}>(₹{analytics?.sponsoredValueInr ?? 0} value)</span>
                </div>
              </div>

              {/* Middle Row with properly bounded chart container */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.1fr 1fr', gap: 18, marginBottom: 24 }}>
                {/* Bookings Trend Chart without overflow bars */}
                <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '1px solid #E5E9E6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E2D24' }}>Bookings Trend</h3>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Last 6 Months</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '140px', borderBottom: '1px solid #E5E9E6', paddingBottom: 10 }}>
                    {[
                      { m: 'Jun', b: 40, c: 35 },
                      { m: 'Jul', b: 55, c: 50 },
                      { m: 'Aug', b: 70, c: 65 },
                      { m: 'Sep', b: 85, c: 80 },
                      { m: 'Oct', b: 100, c: 92 },
                      { m: 'Nov', b: 120, c: 110 }
                    ].map(item => (
                      <div key={item.m} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: '100px' }}>
                          <div style={{ width: 12, height: `${item.b}px`, background: '#0B5D3B', borderRadius: '3px 3px 0 0' }} />
                          <div style={{ width: 12, height: `${item.c}px`, background: '#81C784', borderRadius: '3px 3px 0 0' }} />
                        </div>
                        <span style={{ fontSize: '11px', color: '#6B7C72' }}>{item.m}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'center', gap: 18, marginTop: 12, fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 10, height: 10, background: '#0B5D3B', borderRadius: 2 }} />
                      <span>Bookings</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 10, height: 10, background: '#81C784', borderRadius: 2 }} />
                      <span>Completed</span>
                    </div>
                  </div>
                </div>

                {/* Service Distribution Donut */}
                <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '1px solid #E5E9E6' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E2D24', marginBottom: 14 }}>
                    Service Distribution
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'conic-gradient(#4CAF50 0% 32%, #FF9800 32% 52%, #9C27B0 52% 68%, #00BCD4 68% 82%, #3F51B5 82% 92%, #E91E63 92% 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#FFF', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800 }}>4</span>
                        <span style={{ fontSize: '9px', color: '#6B7C72' }}>Services</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, fontSize: '11px' }}>
                      <div><strong style={{ color: '#4CAF50' }}>●</strong> Household Support: 32%</div>
                      <div><strong style={{ color: '#FF9800' }}>●</strong> Companionship: 20%</div>
                      <div><strong style={{ color: '#9C27B0' }}>●</strong> Medication: 16%</div>
                      <div><strong style={{ color: '#00BCD4' }}>●</strong> Disability Aid: 14%</div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={{ background: '#FFF', borderRadius: 16, padding: 20, border: '1px solid #E5E9E6' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1E2D24', marginBottom: 14 }}>
                    Quick Actions
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    <div className="action-tile-btn" onClick={() => setActiveSection('bookings')}>
                      <Calendar size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '10px', fontWeight: 600 }}>Bookings</span>
                    </div>
                    <div className="action-tile-btn" onClick={() => setActiveSection('beneficiaries')}>
                      <Users size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '10px', fontWeight: 600 }}>Beneficiary</span>
                    </div>
                    <div className="action-tile-btn" onClick={() => setActiveSection('workforce')}>
                      <ShieldCheck size={18} color="#0B5D3B" />
                      <span style={{ fontSize: '10px', fontWeight: 600 }}>Caregiver</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* OTHER SECTIONS */}
          
          {/* ========================================================================= */}
          {/* CAREGIVER EARNINGS & PAYOUT REQUESTS SCREEN                                */}
          {/* ========================================================================= */}
          {activeSection === 'earnings' && (
            <div>
              {/* 4 Summary Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={22} color="#E65100" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Pending Requests</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {caregiverPayouts.filter(p => p.status === 'PENDING').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#E65100', fontWeight: 600 }}>
                      ₹{caregiverPayouts.filter(p => p.status === 'PENDING').reduce((s, p) => s + p.amountInr, 0).toLocaleString()} awaiting approval
                    </span>
                  </div>
                </div>

                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={22} color="#0B5D3B" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Disbursed This Month</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      ₹{caregiverPayouts.filter(p => p.status === 'DISBURSED').reduce((s, p) => s + p.amountInr, 0).toLocaleString()}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>100% on-time bank transfers</span>
                  </div>
                </div>

                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E1F5FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <DollarSign size={22} color="#0288D1" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Caregiver Pool</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>{caregivers.length}</h3>
                    <span style={{ fontSize: '11px', color: '#6B7C72' }}>Salaried + Verified Gig</span>
                  </div>
                </div>

                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EDE7F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={22} color="#512DA8" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Rating Incentives</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>₹1,500</h3>
                    <span style={{ fontSize: '11px', color: '#512DA8', fontWeight: 600 }}>Earned for 4.9+ star service</span>
                  </div>
                </div>
              </div>

              {/* Payout Requests Data Table */}
              <div className="data-table-card">
                <div className="table-header">
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Caregiver Withdrawal & Payout Requests</h3>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>Review and approve requested shift payouts and monthly salaries</p>
                  </div>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Ref</th>
                      <th>Caregiver</th>
                      <th>Pay Period</th>
                      <th>Visits / Hours</th>
                      <th>Bank / UPI</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {caregiverPayouts.map(pay => (
                      <tr key={pay.id}>
                        <td><strong>{pay.id}</strong></td>
                        <td>
                          <strong>{pay.caregiverName}</strong>
                          <div style={{ fontSize: '11px', color: '#6B7C72' }}>{pay.caregiverRef}</div>
                        </td>
                        <td>{pay.payPeriod}</td>
                        <td>
                          <div>{pay.visitsCount} visits</div>
                          <div style={{ fontSize: '11px', color: '#6B7C72' }}>{pay.hoursLogged} hours logged</div>
                        </td>
                        <td>
                          <div>{pay.upiId}</div>
                          <div style={{ fontSize: '11px', color: '#6B7C72' }}>{pay.bankName} ({pay.accountNumberMasked})</div>
                        </td>
                        <td><strong style={{ fontSize: '14px', color: '#0B5D3B' }}>₹{pay.amountInr.toLocaleString()}</strong></td>
                        <td>
                          <span className={`badge ${pay.status === 'DISBURSED' ? 'badge-success' : pay.status === 'APPROVED' ? 'badge-primary' : 'badge-warning'}`}>
                            {pay.status}
                          </span>
                        </td>
                        <td>
                          {pay.status === 'PENDING' && (
                            <button 
                              onClick={async () => {
                                const txn = prompt('Enter Bank Transaction Ref (e.g. TXN-SBI-991204):', 'TXN-SBI-' + Math.floor(100000 + Math.random() * 900000));
                                if (txn) {
                                  await fetch(`${API_BASE_URL}/api/v1/caregiver-payouts/${pay.id}/decision`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ decision: 'DISBURSED', txnRef: txn })
                                  });
                                  fetchData();
                                }
                              }}
                              style={{ background: '#0B5D3B', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: 6, fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                            >
                              Approve & Disburse
                            </button>
                          )}
                          {pay.status === 'DISBURSED' && (
                            <span style={{ fontSize: '11px', color: '#6B7C72' }}>Ref: {pay.txnRef}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          
          {/* ========================================================================= */}
          {/* PAYMENTS, BILLING & SUBSIDY LEDGER                                        */}
          {/* ========================================================================= */}
          {activeSection === 'payments' && (
            <div>
              {/* 3 Overview Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6' }}>
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Family Collections (UPI / Cash)</span>
                  <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#0B5D3B', margin: '4px 0' }}>
                    ₹{paymentTransactions.filter(t => t.status === 'COMPLETED').reduce((s, t) => s + t.amountInr, 0).toLocaleString()}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>100% verified settlement</span>
                </div>

                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6' }}>
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Trust Endowed Subsidies Absorbed</span>
                  <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#D81B60', margin: '4px 0' }}>
                    ₹{paymentTransactions.reduce((s, t) => s + t.subsidyInr, 0).toLocaleString()}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#6B7C72' }}>Covered by Sri Divyang Seva Kendram Trust</span>
                </div>

                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6' }}>
                  <span style={{ fontSize: '12px', color: '#6B7C72' }}>Pending Family Invoices</span>
                  <h3 style={{ fontSize: '26px', fontWeight: 800, color: '#F9B233', margin: '4px 0' }}>
                    ₹{paymentTransactions.filter(t => t.status === 'PENDING').reduce((s, t) => s + t.amountInr, 0).toLocaleString()}
                  </h3>
                  <span style={{ fontSize: '11px', color: '#E65100', fontWeight: 600 }}>Awaiting UPI confirmation</span>
                </div>
              </div>

              {/* Transactions Ledger Table */}
              <div className="data-table-card">
                <div className="table-header">
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Central Financial Ledger & Invoices</h3>
                    <p style={{ fontSize: '12px', color: '#6B7C72' }}>Live payment transactions, Trust grant offsets, and official receipts</p>
                  </div>
                  <button 
                    onClick={() => exportToCsv('thodu_payments_ledger.csv', paymentTransactions)}
                    style={{ background: '#FFF', border: '1px solid #E5E9E6', borderRadius: 8, padding: '8px 14px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Download size={14} /> Export CSV
                  </button>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Invoice #</th>
                      <th>Beneficiary & Guardian</th>
                      <th>Care Service</th>
                      <th>Amount Paid</th>
                      <th>Trust Subsidy</th>
                      <th>Mode & Gateway</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentTransactions.map(tx => (
                      <tr key={tx.id}>
                        <td><strong>{tx.invoiceNumber}</strong><div style={{ fontSize: '11px', color: '#6B7C72' }}>{tx.txnRef}</div></td>
                        <td>
                          <strong>{tx.beneficiaryName}</strong>
                          <div style={{ fontSize: '11px', color: '#6B7C72' }}>Guardian: {tx.guardianName} ({tx.payerContact})</div>
                        </td>
                        <td>{tx.bookingNumber}</td>
                        <td><strong style={{ fontSize: '13px' }}>₹{tx.amountInr}</strong></td>
                        <td><span style={{ color: '#0B5D3B', fontWeight: 600 }}>₹{tx.subsidyInr} (Free)</span></td>
                        <td>
                          <div>{tx.paymentMode}</div>
                          <div style={{ fontSize: '11px', color: '#6B7C72' }}>{tx.paymentGateway}</div>
                        </td>
                        <td>
                          <span className={`badge ${tx.status === 'COMPLETED' ? 'badge-success' : tx.status === 'SUBSIDIZED' ? 'badge-primary' : 'badge-warning'}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td>
                          <button 
                            onClick={() => setSelectedReceipt(tx)}
                            style={{ background: '#FAFBF9', border: '1px solid #E5E9E6', padding: '6px 10px', borderRadius: 6, fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Receipt
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          
          {/* ========================================================================= */}
          {/* STAFF MANAGEMENT & SUPERVISOR ROLES                                       */}
          {/* ========================================================================= */}
          {activeSection === 'staff' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B' }}>Trust Internal Staff & Supervisors</h2>
                  <p style={{ fontSize: '13px', color: '#6B7C72', marginTop: 2 }}>
                    Manage administrators, clinical supervisors, and coordinators of Sri Divyang Seva Kendram Trust
                  </p>
                </div>
                <button 
                  onClick={() => setShowAddStaffModal(true)}
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: '14px' }}
                >
                  <Plus size={16} /> Add Staff Member
                </button>
              </div>

              {/* Staff Directory Table */}
              <div className="data-table-card">
                <table>
                  <thead>
                    <tr>
                      <th>Staff ID</th>
                      <th>Name & Contact</th>
                      <th>Role</th>
                      <th>Department</th>
                      <th>Service Zone</th>
                      <th>Shift Timing</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffList.map(st => (
                      <tr key={st.id}>
                        <td><strong>{st.staffId}</strong></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#0B5D3B', fontSize: '12px' }}>
                              {st.fullName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <strong>{st.fullName}</strong>
                              <div style={{ fontSize: '11px', color: '#6B7C72' }}>{st.email} • {st.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge badge-primary">{st.role}</span></td>
                        <td>{st.department}</td>
                        <td>{st.serviceZone}</td>
                        <td>{st.shiftTiming}</td>
                        <td><span className="badge badge-success">{st.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {activeSection === 'beneficiaries' && (
            <div>
              {/* Header Title with Add Beneficiary Button */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#0B5D3B' }}>Beneficiaries & Families</h2>
                  <p style={{ fontSize: '13px', color: '#6B7C72', marginTop: 2 }}>
                    Manage all registered beneficiaries and their family/guardian details
                  </p>
                </div>
                <button 
                  className="btn-primary" 
                  onClick={() => {
    setEditingBeneficiary(null);
    setBenWizardStep(1);
    setBenWizardForm({
      fullName: '',
      category: 'Senior Citizen',
      dateOfBirth: '1958-05-14',
      age: 68,
      gender: 'Female',
      bloodGroup: 'B+',
      photoUrl: '',
      aadhaarNumber: '',
      udidNumber: '',
      relationship: 'Mother',
      primaryGuardian: '',
      guardianPhone: '',
      alternateGuardianPhone: '',
      guardianEmail: '',
      address: '',
      zone: 'T.T.D. Colony',
      pincode: '517501',
      mobilityStatus: 'Assisted Walking',
      medicalConditions: ['Routine Elder Care'],
      allergies: 'None',
      accessibilityNeeds: 'Standard daily living assistance',
      emergencyDoctorName: 'Dr. Raman',
      emergencyDoctorPhone: '+91 98480 11223',
      subsidyTier: '100% Trust Covered (BPL/White Card)',
      rationCardNumber: ''
    });
    setShowAddBenModal(true);
  }}
                  style={{ padding: '10px 20px', fontSize: '14px' }}
                >
                  <Plus size={16} /> Add Beneficiary
                </button>
              </div>

              {/* 4 Summary Cards at Top */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
                {/* 1. Total Beneficiaries */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} color="#0B5D3B" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Total Beneficiaries</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.totalBeneficiaries ?? beneficiaries.length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>↑ +8.4% vs last month</span>
                  </div>
                </div>

                {/* 2. Senior Citizens */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users size={22} color="#C62828" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Senior Citizens</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.seniorCitizens ?? beneficiaries.filter(b => b.category === 'Senior Citizen').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#6B7C72' }}>
                      ({analytics?.seniorCitizensPct ?? 60}%)
                    </span>
                  </div>
                </div>

                {/* 3. Persons with Disabilities */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#E1F5FE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={22} color="#0288D1" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Persons with Disabilities</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.personsWithDisabilities ?? beneficiaries.filter(b => b.category === 'Person with Disability').length}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#6B7C72' }}>
                      ({analytics?.personsWithDisabilitiesPct ?? 40}%)
                    </span>
                  </div>
                </div>

                {/* 4. Family Members / Guardians */}
                <div style={{ background: '#FFF', borderRadius: 14, padding: 18, border: '1px solid #E5E9E6', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#FFF8E6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={22} color="#F9B233" />
                  </div>
                  <div>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>Family Members / Guardians</span>
                    <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#1E2D24', margin: '2px 0' }}>
                      {analytics?.activeGuardians ?? 3}
                    </h3>
                    <span style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>Active Contacts</span>
                  </div>
                </div>
              </div>

              {/* Category Segment Tabs matching reference */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <button 
                  onClick={() => setBenTab('ALL')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: benTab === 'ALL' ? '#0B5D3B' : '#FFF', color: benTab === 'ALL' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  All Beneficiaries ({beneficiaries.length})
                </button>
                <button 
                  onClick={() => setBenTab('SENIOR')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: benTab === 'SENIOR' ? '#0B5D3B' : '#FFF', color: benTab === 'SENIOR' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  Senior Citizens ({beneficiaries.filter(b => b.category === 'Senior Citizen').length})
                </button>
                <button 
                  onClick={() => setBenTab('DISABILITY')}
                  style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: benTab === 'DISABILITY' ? '#0B5D3B' : '#FFF', color: benTab === 'DISABILITY' ? '#FFF' : '#1E2D24', fontWeight: 600, fontSize: '13px', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                >
                  Persons with Disabilities ({beneficiaries.filter(b => b.category === 'Person with Disability').length})
                </button>
              </div>

              {/* Filter and Search Bar matching reference */}
              <div style={{ background: '#FFF', borderRadius: 14, padding: '14px 18px', border: '1px solid #E5E9E6', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
                  <Search size={15} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 12 }} />
                  <input 
                    placeholder="Search by name, phone, or ID..."
                    value={benSearchQuery}
                    onChange={e => setBenSearchQuery(e.target.value)}
                    style={{ width: '100%', padding: '9px 12px 9px 34px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <select 
                  value={benCategoryFilter} 
                  onChange={e => setBenCategoryFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Category: All</option>
                  <option value="Senior Citizen">Category: Senior Citizen</option>
                  <option value="Person with Disability">Category: Person with Disability</option>
                </select>

                <select style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}>
                  <option>Age: All</option>
                  <option>Below 40</option>
                  <option>60 - 75</option>
                  <option>75+</option>
                </select>

                <select style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}>
                  <option>Area: All</option>
                  <option>T.T.D. Colony</option>
                  <option>Lakshmi Nagar</option>
                  <option>Bhavani Nagar</option>
                </select>

                <select 
                  value={benStatusFilter} 
                  onChange={e => setBenStatusFilter(e.target.value)}
                  style={{ padding: '9px 12px', borderRadius: 8, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                >
                  <option value="ALL">Status: All</option>
                  <option value="Active">Status: Active</option>
                  <option value="Inactive">Status: Inactive</option>
                </select>

                <button 
                  onClick={() => exportToCsv('thodu_beneficiaries_registry.csv', beneficiaries)}
                  style={{ background: '#FFF', border: '1px solid #E5E9E6', padding: '9px 16px', borderRadius: 8, fontSize: '13px', fontWeight: 600, color: '#1E2D24', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Download size={14} /> Export
                </button>
              </div>

              {/* Beneficiaries Table */}
              <div className="data-table-card">
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>
                        <input 
                          type="checkbox" 
                          checked={selectedBenIds.length === filteredBeneficiaries.length && filteredBeneficiaries.length > 0}
                          onChange={selectAllBens}
                        />
                      </th>
                      <th>BENEFICIARY ⬍</th>
                      <th>CATEGORY</th>
                      <th>AGE</th>
                      <th>PRIMARY GUARDIAN</th>
                      <th>PHONE</th>
                      <th>ADDRESS</th>
                      <th>STATUS ⬍</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBeneficiaries.map(ben => (
                      <tr key={ben.id}>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={selectedBenIds.includes(ben.id)}
                            onChange={() => toggleSelectBen(ben.id)}
                          />
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 34, height: 34, borderRadius: '50%', background: ben.avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', color: '#0B5D3B' }}>
                              {ben.fullName.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <strong style={{ fontSize: '13px' }}>{ben.fullName}</strong>
                              <div style={{ fontSize: '11px', color: '#6B7C72' }}>{ben.refNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 9999, fontWeight: 600, background: ben.category === 'Senior Citizen' ? '#E8F5E9' : '#E1F5FE', color: ben.category === 'Senior Citizen' ? '#2E7D32' : '#0288D1', display: 'flex', alignItems: 'center', gap: 4 }}>
                              {ben.category === 'Senior Citizen' ? 'Senior Citizen' : 'Person with Disability'}
                            </span>
                          </div>
                        </td>
                        <td>{ben.age} yrs</td>
                        <td>{ben.primaryGuardian} ({ben.relationship})</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1E2D24', fontSize: '12px' }}>
                            <PhoneCall size={12} color="#6B7C72" />
                            <span>{ben.primaryContact}</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#6B7C72', fontSize: '12px' }}>
                            <MapPin size={12} />
                            <span>{ben.address}</span>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: 9999, fontWeight: 600, background: ben.status === 'Active' ? '#E8F5E9' : '#FFEBEE', color: ben.status === 'Active' ? '#2E7D32' : '#C62828' }}>
                            {ben.status}
                          </span>
                        </td>
                        <td style={{ position: 'relative' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button 
                              title="View Details"
                              onClick={() => setSelectedBeneficiaryDetail(ben)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}
                            >
                              <Eye size={15} />
                            </button>
                            <button 
                              title="Edit Record"
                              onClick={() => {
    setEditingBeneficiary(ben);
    setBenWizardStep(1);
    setBenWizardForm({
      fullName: ben.fullName,
      category: ben.category,
      dateOfBirth: ben.dateOfBirth || '1958-05-14',
      age: ben.age,
      gender: ben.gender,
      bloodGroup: ben.bloodGroup || 'B+',
      photoUrl: ben.photoUrl || '',
      aadhaarNumber: ben.aadhaarNumber || '',
      udidNumber: ben.udidNumber || '',
      relationship: ben.relationship,
      primaryGuardian: ben.primaryGuardian,
      guardianPhone: ben.guardianPhone || ben.primaryContact,
      alternateGuardianPhone: ben.alternateGuardianPhone || '',
      guardianEmail: ben.guardianEmail || '',
      address: ben.address,
      zone: ben.zone || 'T.T.D. Colony',
      pincode: ben.pincode || '517501',
      mobilityStatus: ben.mobilityStatus || 'Assisted Walking',
      medicalConditions: ben.medicalConditions || ['Routine Elder Care'],
      allergies: ben.allergies || 'None',
      accessibilityNeeds: ben.accessibilityNeeds,
      emergencyDoctorName: ben.emergencyDoctorName || 'Dr. Raman',
      emergencyDoctorPhone: ben.emergencyDoctorPhone || '+91 98480 11223',
      subsidyTier: ben.subsidyTier || '100% Trust Covered (BPL/White Card)',
      rationCardNumber: ben.rationCardNumber || ''
    });
    setShowAddBenModal(true);
  }}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}
                            >
                              <Edit3 size={15} />
                            </button>
                            <button 
                              onClick={() => setOpenBenActionId(openBenActionId === ben.id ? null : ben.id)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}
                            >
                              <MoreVertical size={15} />
                            </button>
                          </div>

                          {openBenActionId === ben.id && (
                            <div style={{ position: 'absolute', right: 20, top: 38, background: '#FFF', border: '1px solid #E5E9E6', borderRadius: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', zIndex: 100, width: 140 }}>
                              <button 
                                onClick={() => {
                                  setSelectedBeneficiaryDetail(ben);
                                  setOpenBenActionId(null);
                                }}
                                style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: '12px', cursor: 'pointer' }}
                              >
                                View Profile
                              </button>
                              <button 
                                onClick={async () => {
                                  if (window.confirm(`Deactivate ${ben.fullName}?`)) {
                                    setBeneficiaries(prev => prev.map(b => b.id === ben.id ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' } : b));
                                    setOpenBenActionId(null);
                                  }
                                }}
                                style={{ width: '100%', padding: '8px 12px', background: 'none', border: 'none', textAlign: 'left', fontSize: '12px', cursor: 'pointer', color: '#C62828' }}
                              >
                                Toggle Status
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Footer */}
                <div style={{ padding: '14px 20px', borderTop: '1px solid #E5E9E6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#6B7C72' }}>
                  <span>Showing 1 – {filteredBeneficiaries.length} of {beneficiaries.length} beneficiaries</span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span>Rows per page:</span>
                    <select style={{ padding: '4px 8px', borderRadius: 6, border: '1px solid #E5E9E6', fontSize: '12px' }}>
                      <option>10</option>
                      <option>25</option>
                      <option>50</option>
                    </select>

                    <div style={{ display: 'flex', gap: 4 }}>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E5E9E6', background: '#FFF', cursor: 'pointer' }}>&lt;</button>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: '#0B5D3B', color: '#FFF', fontWeight: 600, cursor: 'pointer' }}>1</button>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E5E9E6', background: '#FFF', cursor: 'pointer' }}>2</button>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E5E9E6', background: '#FFF', cursor: 'pointer' }}>3</button>
                      <button style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #E5E9E6', background: '#FFF', cursor: 'pointer' }}>&gt;</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'funding' && (
            <div className="data-table-card">
              <div className="table-header">
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Sponsorship Applications</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Ref #</th>
                    <th>Beneficiary</th>
                    <th>Programme</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sponsorships.map(sp => (
                    <tr key={sp.id}>
                      <td><strong>{sp.applicationRef}</strong></td>
                      <td>{sp.beneficiaryName}</td>
                      <td>{sp.programme}</td>
                      <td><span className="badge badge-success">{sp.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'sos' && (
            <div className="data-table-card" style={{ borderLeft: '4px solid #C62828' }}>
              <div className="table-header" style={{ background: '#FFF5F5' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#C62828' }}>Emergency SOS Queue</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Alert ID</th>
                    <th>Beneficiary</th>
                    <th>Triggered By</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sosQueue.map(alert => (
                    <tr key={alert.id}>
                      <td><strong>{alert.id}</strong></td>
                      <td>{alert.beneficiaryName}</td>
                      <td>{alert.triggeredBy}</td>
                      <td><span className="badge badge-danger">{alert.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'audit' && (
            <div className="data-table-card">
              <div className="table-header">
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>Trust Immutable Audit Trail</h3>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Administrator</th>
                    <th>Action</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log, i) => (
                    <tr key={log.id || i}>
                      <td>{log.timestamp}</td>
                      <td><strong>{log.adminUser}</strong></td>
                      <td>{log.action}</td>
                      <td>{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL: DIRECT ASSIGN CAREGIVER MODAL                                      */}
      {/* ========================================================================= */}
      {assigningBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 20, maxWidth: 440, width: '100%', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0B5D3B' }}>
                Assign Caregiver to {assigningBooking.bookingNumber}
              </h3>
              <button onClick={() => setAssigningBooking(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <p style={{ fontSize: '12px', color: '#6B7C72', marginBottom: 16 }}>
              Select an available caregiver for {assigningBooking.beneficiaryName} ({assigningBooking.serviceName})
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
              {caregivers.map(cg => (
                <div 
                  key={cg.id} 
                  onClick={() => handleAssignCaregiver(assigningBooking.id, cg.fullName)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', cursor: 'pointer', background: '#FAFBF9' }}
                >
                  <div>
                    <strong>{cg.fullName}</strong>
                    <div style={{ fontSize: '11px', color: '#6B7C72' }}>{cg.employmentType} • ★ {cg.rating}</div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#0B5D3B', fontWeight: 600 }}>Assign →</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CAREGIVER */}
      
      {/* ========================================================================= */}
      {/* 4-STEP CAREGIVER REGISTRATION WIZARD (EXACT MATCH TO USER REFERENCE IMAGE) */}
      {/* ========================================================================= */}
      {showAddCaregiverModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#FFF', borderRadius: 24, maxWidth: 960, width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: '28px 32px', boxShadow: '0 20px 50px rgba(0,0,0,0.25)' }}>
            
            {/* Top Bar with Back Arrow, Title & Subtitle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button 
                  onClick={() => setShowAddCaregiverModal(false)}
                  style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid #E5E9E6', background: '#FAFBF9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <ChevronLeft size={20} color="#1E2D24" />
                </button>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0B5D3B' }}>Add Caregiver</h2>
                  <p style={{ fontSize: '12px', color: '#6B7C72', marginTop: 2 }}>
                    Register a new caregiver to your workforce
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button 
                  onClick={() => setShowAddCaregiverModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Stepper Navigation matching image */}
            <div className="stepper-header">
              <div className={`step-item ${cgWizardStep === 1 ? 'active' : ''}`} onClick={() => setCgWizardStep(1)}>
                <span className={`step-badge ${cgWizardStep > 1 ? 'completed' : ''}`}>1</span>
                <span>Basic Details</span>
              </div>
              <ChevronRight size={14} color="#9EAFA5" />

              <div className={`step-item ${cgWizardStep === 2 ? 'active' : ''}`} onClick={() => setCgWizardStep(2)}>
                <span className={`step-badge ${cgWizardStep > 2 ? 'completed' : ''}`}>2</span>
                <span>Professional Details</span>
              </div>
              <ChevronRight size={14} color="#9EAFA5" />

              <div className={`step-item ${cgWizardStep === 3 ? 'active' : ''}`} onClick={() => setCgWizardStep(3)}>
                <span className={`step-badge ${cgWizardStep > 3 ? 'completed' : ''}`}>3</span>
                <span>Verification & Documents</span>
              </div>
              <ChevronRight size={14} color="#9EAFA5" />

              <div className={`step-item ${cgWizardStep === 4 ? 'active' : ''}`} onClick={() => setCgWizardStep(4)}>
                <span className="step-badge">4</span>
                <span>Availability & Preferences</span>
              </div>
            </div>

            {/* STEP 1: BASIC DETAILS (EXACT CLONE OF REFERENCE IMAGE) */}
            {cgWizardStep === 1 && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28 }}>
                  {/* Left Column: Form Fields */}
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0B5D3B', marginBottom: 4 }}>Basic Details</h3>
                    <p style={{ fontSize: '12px', color: '#6B7C72', marginBottom: 20 }}>
                      Enter the caregiver's personal and contact information
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Full Name <span style={{ color: '#D32F2F' }}>*</span>
                        </label>
                        <input 
                          required
                          value={cgWizardForm.fullName}
                          onChange={e => setCgWizardForm({ ...cgWizardForm, fullName: e.target.value })}
                          placeholder="e.g. Anitha"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Gender <span style={{ color: '#D32F2F' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, height: 40 }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', cursor: 'pointer' }}>
                            <input 
                              type="radio" 
                              name="cgGender" 
                              checked={cgWizardForm.gender === 'Male'} 
                              onChange={() => setCgWizardForm({ ...cgWizardForm, gender: 'Male' })} 
                            />
                            <span>Male</span>
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', cursor: 'pointer' }}>
                            <input 
                              type="radio" 
                              name="cgGender" 
                              checked={cgWizardForm.gender === 'Female'} 
                              onChange={() => setCgWizardForm({ ...cgWizardForm, gender: 'Female' })} 
                            />
                            <span>Female</span>
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '13px', cursor: 'pointer' }}>
                            <input 
                              type="radio" 
                              name="cgGender" 
                              checked={cgWizardForm.gender === 'Other'} 
                              onChange={() => setCgWizardForm({ ...cgWizardForm, gender: 'Other' })} 
                            />
                            <span>Other</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Date of Birth <span style={{ color: '#D32F2F' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                          <Calendar size={16} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 12 }} />
                          <input 
                            type="date"
                            value={cgWizardForm.dateOfBirth}
                            onChange={e => {
                              const dob = e.target.value;
                              const birthYear = new Date(dob).getFullYear();
                              const currentYear = new Date().getFullYear();
                              const calcAge = currentYear - birthYear;
                              setCgWizardForm({ ...cgWizardForm, dateOfBirth: dob, age: calcAge > 0 ? calcAge : 30 });
                            }}
                            style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Age
                        </label>
                        <input 
                          readOnly
                          value={`${cgWizardForm.age} yrs`}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', background: '#F5F7F6', fontSize: '13px', color: '#4A5D52' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Phone Number <span style={{ color: '#D32F2F' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                          <PhoneCall size={15} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 12 }} />
                          <input 
                            required
                            value={cgWizardForm.phone}
                            onChange={e => setCgWizardForm({ ...cgWizardForm, phone: e.target.value })}
                            placeholder="+91 98765 11111"
                            style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Alternate Phone (Optional)
                        </label>
                        <div style={{ position: 'relative' }}>
                          <PhoneCall size={15} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 12 }} />
                          <input 
                            value={cgWizardForm.alternatePhone}
                            onChange={e => setCgWizardForm({ ...cgWizardForm, alternatePhone: e.target.value })}
                            placeholder="+91 91234 56789"
                            style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Email ID <span style={{ color: '#D32F2F' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                          <Mail size={15} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 12 }} />
                          <input 
                            type="email"
                            required
                            value={cgWizardForm.email}
                            onChange={e => setCgWizardForm({ ...cgWizardForm, email: e.target.value })}
                            placeholder="anitha.care@gmail.com"
                            style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                          />
                        </div>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Language(s) Known <span style={{ color: '#D32F2F' }}>*</span>
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '6px 10px', borderRadius: 10, border: '1px solid #E5E9E6', background: '#FFF' }}>
                          {cgWizardForm.languages.map(lang => (
                            <span key={lang} className="tag-pill">
                              {lang}
                              <span 
                                onClick={() => setCgWizardForm({ ...cgWizardForm, languages: cgWizardForm.languages.filter(l => l !== lang) })}
                                style={{ cursor: 'pointer', marginLeft: 2 }}
                              >
                                ×
                              </span>
                            </span>
                          ))}
                          <button 
                            type="button"
                            onClick={() => {
                              const extra = prompt('Add spoken language (e.g. Kannada, Tamil):');
                              if (extra && !cgWizardForm.languages.includes(extra)) {
                                setCgWizardForm({ ...cgWizardForm, languages: [...cgWizardForm.languages, extra] });
                              }
                            }}
                            style={{ background: 'none', border: 'none', color: '#0B5D3B', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                        Address <span style={{ color: '#D32F2F' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <MapPin size={16} color="#6B7C72" style={{ position: 'absolute', left: 12, top: 12 }} />
                        <textarea 
                          rows={2}
                          required
                          value={cgWizardForm.address}
                          onChange={e => setCgWizardForm({ ...cgWizardForm, address: e.target.value })}
                          placeholder="#12-4-56, T.T.D. Colony, Tirupati - 517501, Andhra Pradesh"
                          style={{ width: '100%', padding: '10px 14px 10px 36px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px', resize: 'none' }}
                        />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Zone / Service Area <span style={{ color: '#D32F2F' }}>*</span>
                        </label>
                        <select 
                          value={cgWizardForm.zone}
                          onChange={e => setCgWizardForm({ ...cgWizardForm, zone: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                        >
                          <option value="Tirupati Urban">Tirupati Urban</option>
                          <option value="T.T.D. Colony">T.T.D. Colony</option>
                          <option value="Tirupati West">Tirupati West</option>
                          <option value="Alipiri & Kapilatheertham">Alipiri & Kapilatheertham</option>
                          <option value="Renigunta Zone">Renigunta Zone</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Pincode <span style={{ color: '#D32F2F' }}>*</span>
                        </label>
                        <input 
                          value={cgWizardForm.pincode}
                          onChange={e => setCgWizardForm({ ...cgWizardForm, pincode: e.target.value })}
                          placeholder="517501"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Caregiver Photo & Guidelines matching image */}
                  <div>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1E2D24', marginBottom: 12 }}>
                      Caregiver Photo <span style={{ color: '#D32F2F' }}>*</span>
                    </h3>

                    <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                      <div style={{ width: 110, height: 120, borderRadius: 14, overflow: 'hidden', border: '1px solid #E5E9E6', position: 'relative', background: '#E8F5E9' }}>
                        <img 
                          src="/assets/cg-anitha.png" 
                          alt="Preview" 
                          onError={(e: any) => { e.target.src = 'https://images.unsplash.com/photo-1594824813583-09747a82b3a8?w=200&auto=format&fit=crop&q=80'; }}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                        />
                        <div style={{ position: 'absolute', right: 6, bottom: 6, width: 26, height: 26, borderRadius: '50%', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}>
                          <Edit3 size={13} color="#0B5D3B" />
                        </div>
                      </div>

                      <div className="photo-upload-box" style={{ flex: 1, padding: 16 }}>
                        <Download size={22} color="#0B5D3B" style={{ transform: 'rotate(180deg)', margin: '0 auto 6px auto' }} />
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E2D24' }}>Upload Photo</div>
                        <div style={{ fontSize: '10px', color: '#6B7C72', marginTop: 2 }}>(JPG, PNG)<br />Max 2 MB</div>
                      </div>
                    </div>

                    <div style={{ background: '#FFF9EB', border: '1px solid #F5E6BE', borderRadius: 14, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', fontWeight: 700, color: '#0B5D3B', marginBottom: 8 }}>
                        <CheckCircle2 size={16} /> Quick Information
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '11px', color: '#4A5D52' }}>
                        <div>✓ Supported file types: JPG, PNG</div>
                        <div>✓ Photo should be a clear face photo</div>
                        <div>✓ Max file size: 2 MB</div>
                        <div>✓ All * marked fields are mandatory</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 18, borderTop: '1px solid #E5E9E6' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowAddCaregiverModal(false)}
                    style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #E5E9E6', background: '#FFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>

                  <div style={{ display: 'flex', gap: 12 }}>
                    <button 
                      type="button"
                      onClick={() => alert('Draft saved to local storage!')}
                      style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #0B5D3B', color: '#0B5D3B', background: '#FFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Save as Draft
                    </button>
                    <button 
                      type="button"
                      onClick={() => setCgWizardStep(2)}
                      className="btn-primary"
                      style={{ padding: '10px 24px', fontSize: '13px' }}
                    >
                      Next: Professional Details →
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: PROFESSIONAL DETAILS */}
            {cgWizardStep === 2 && (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0B5D3B', marginBottom: 4 }}>Professional Details</h3>
                <p style={{ fontSize: '12px', color: '#6B7C72', marginBottom: 20 }}>
                  Caregiver employment model, specializations, and prior clinical/elder care experience
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>Employment Classification</label>
                    <select 
                      value={cgWizardForm.employmentType}
                      onChange={e => setCgWizardForm({ ...cgWizardForm, employmentType: e.target.value as any })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                    >
                      <option value="Salaried">Salaried Staff (Full-time trust employee)</option>
                      <option value="Freelance / Gig">Freelance / Gig (Shift-based verified partner)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>Prior Care Experience (Years)</label>
                    <input 
                      type="number"
                      value={cgWizardForm.experienceYears}
                      onChange={e => setCgWizardForm({ ...cgWizardForm, experienceYears: Number(e.target.value) })}
                      placeholder="e.g. 5"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>Core Care Skills & Specializations</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {['Elder Companionship', 'Cooking Assistance', 'Mobility Support', 'Physiotherapy Assist', 'Disability Support', 'Bedridden Care', 'Medication Reminders', 'Vitals Monitoring', 'Wound Dressing'].map(skill => (
                      <label key={skill} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, border: '1px solid #E5E9E6', background: cgWizardForm.skills.includes(skill) ? '#E8F5E9' : '#FFF', cursor: 'pointer', fontSize: '12px' }}>
                        <input 
                          type="checkbox"
                          checked={cgWizardForm.skills.includes(skill)}
                          onChange={e => {
                            if (e.target.checked) {
                              setCgWizardForm({ ...cgWizardForm, skills: [...cgWizardForm.skills, skill] });
                            } else {
                              setCgWizardForm({ ...cgWizardForm, skills: cgWizardForm.skills.filter(s => s !== skill) });
                            }
                          }}
                        />
                        <span>{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 18, borderTop: '1px solid #E5E9E6' }}>
                  <button type="button" onClick={() => setCgWizardStep(1)} style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #E5E9E6', background: '#FFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    ← Back: Basic Details
                  </button>
                  <button type="button" onClick={() => setCgWizardStep(3)} className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }}>
                    Next: Verification & Documents →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: VERIFICATION & DOCUMENTS */}
            {cgWizardStep === 3 && (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0B5D3B', marginBottom: 4 }}>Trust Verification & KYC</h3>
                <p style={{ fontSize: '12px', color: '#6B7C72', marginBottom: 20 }}>
                  Statutory compliance and background verification required by Sri Divyang Seva Kendram Trust
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>Aadhaar Card Number</label>
                    <input 
                      value={cgWizardForm.aadhaarNumber}
                      onChange={e => setCgWizardForm({ ...cgWizardForm, aadhaarNumber: e.target.value })}
                      placeholder="XXXX-XXXX-4589"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>Police Background Clearance</label>
                    <select 
                      value={cgWizardForm.policeClearanceStatus}
                      onChange={e => setCgWizardForm({ ...cgWizardForm, policeClearanceStatus: e.target.value as any })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                    >
                      <option value="Verified">✓ Verified (Certificate on file)</option>
                      <option value="Pending">⏳ Pending Verification</option>
                    </select>
                  </div>
                </div>

                <div style={{ border: '2px dashed #C8D6CD', borderRadius: 12, padding: 24, textAlign: 'center', background: '#FAFBF9', marginBottom: 20 }}>
                  <ShieldCheck size={28} color="#0B5D3B" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Upload Identity Documents</div>
                  <div style={{ fontSize: '11px', color: '#6B7C72', marginTop: 4 }}>Upload scanned Aadhaar / Police Clearance / Voter ID (PDF or JPG)</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 18, borderTop: '1px solid #E5E9E6' }}>
                  <button type="button" onClick={() => setCgWizardStep(2)} style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #E5E9E6', background: '#FFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    ← Back: Professional Details
                  </button>
                  <button type="button" onClick={() => setCgWizardStep(4)} className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }}>
                    Next: Availability & Preferences →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: AVAILABILITY & FINAL REGISTRATION */}
            {cgWizardStep === 4 && (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0B5D3B', marginBottom: 4 }}>Availability & Work Shift</h3>
                <p style={{ fontSize: '12px', color: '#6B7C72', marginBottom: 20 }}>
                  Assign the default roster shift and finalize onboarding into the live database
                </p>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>Roster Shift</label>
                  <select 
                    value={cgWizardForm.workingShift}
                    onChange={e => setCgWizardForm({ ...cgWizardForm, workingShift: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                  >
                    <option value="Morning (08:00 AM - 02:00 PM)">Morning (08:00 AM - 02:00 PM)</option>
                    <option value="Evening (02:00 PM - 08:00 PM)">Evening (02:00 PM - 08:00 PM)</option>
                    <option value="Full Day (24/7 Live-in)">Full Day (24/7 Live-in)</option>
                    <option value="Flexible / Shift Based">Flexible / Shift Based (Gig On-Demand)</option>
                  </select>
                </div>

                <div style={{ background: '#E8F5E9', borderRadius: 14, padding: 18, border: '1px solid #C8E6C9', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle2 size={20} color="#0B5D3B" />
                    <div>
                      <strong style={{ fontSize: '13px', color: '#0B5D3B' }}>Ready to Register into Live Database</strong>
                      <p style={{ fontSize: '12px', color: '#2E7D32', marginTop: 2 }}>
                        {cgWizardForm.fullName || 'Caregiver'} will immediately be available for dispatch on the Care Bookings board.
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 18, borderTop: '1px solid #E5E9E6' }}>
                  <button type="button" onClick={() => setCgWizardStep(3)} style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #E5E9E6', background: '#FFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    ← Back: Verification
                  </button>
                  <button 
                    type="button" 
                    onClick={async () => {
                      try {
                        if (editingCaregiver) {
                          const res = await fetch(`${API_BASE_URL}/api/v1/caregivers/${editingCaregiver.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(cgWizardForm)
                          });
                          if (res.ok) {
                            setShowAddCaregiverModal(false);
                            setEditingCaregiver(null);
                            setCgWizardStep(1);
                            fetchData();
                          }
                        } else {
                          const res = await fetch(`${API_BASE_URL}/api/v1/caregivers`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(cgWizardForm)
                          });
                          if (res.ok) {
                            setShowAddCaregiverModal(false);
                            setCgWizardStep(1);
                            fetchData();
                          }
                        }
                      } catch (err) {
                        alert('Error saving caregiver');
                      }
                    }} 
                    className="btn-primary" 
                    style={{ padding: '10px 28px', fontSize: '13px' }}
                  >
                    {editingCaregiver ? 'Save Caregiver Changes ✓' : 'Confirm & Complete Registration ✓'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      {/* MODAL 1: CREATE / EDIT CARE BOOKING */}
      {showAddBookingModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 20, maxWidth: 580, width: '100%', padding: 28, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>
                {editingBooking ? `Edit Booking ${editingBooking.bookingNumber}` : 'Create & Dispatch Care Booking'}
              </h3>
              <button onClick={() => setShowAddBookingModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveBooking}>
              {/* Customer / Beneficiary Name with Auto Suggest */}
              <div className="autosuggest-container" style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>
                  Customer / Beneficiary Name (Search & Auto-Suggest)
                </label>
                <input 
                  required
                  placeholder="Type to search (e.g. Saraswathi, Raghav, Anil)..." 
                  value={beneficiaryQuery}
                  onChange={e => handleBeneficiarySearch(e.target.value)}
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}
                />
                {showSuggestDropdown && suggestedBeneficiaries.length > 0 && (
                  <div className="autosuggest-dropdown">
                    {suggestedBeneficiaries.map(b => (
                      <div 
                        key={b.id} 
                        className="autosuggest-item"
                        onClick={() => selectSuggestedBeneficiary(b)}
                      >
                        <div>
                          <strong>{b.fullName}</strong>
                          <div style={{ fontSize: '11px', color: '#6B7C72' }}>{b.category === 'SENIOR_CITIZEN' ? 'Senior Citizen' : 'Person with Disability'} • Age: {b.age} • {b.address}</div>
                        </div>
                        <span style={{ fontSize: '11px', color: '#0B5D3B', fontWeight: 600 }}>Select</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Care Service</label>
                  <select value={bookingForm.serviceName} onChange={e => setBookingForm({...bookingForm, serviceName: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="Household Support">Household Support (₹600)</option>
                    <option value="Cooking Assistance">Cooking Assistance (₹450)</option>
                    <option value="Companion Care">Companion Care (₹400)</option>
                    <option value="Disability Support">Disability Support (₹500)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Funding Route</label>
                  <select value={bookingForm.fundingType} onChange={e => setBookingForm({...bookingForm, fundingType: e.target.value as any})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="Trust Sponsored">Trust Sponsored (100% Free)</option>
                    <option value="Family Paid">Family Paid (Full Fee)</option>
                    <option value="Partially Sponsored">Partially Sponsored (75% Trust)</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Payment Mode</label>
                  <select value={bookingForm.paymentMode} onChange={e => setBookingForm({...bookingForm, paymentMode: e.target.value as any})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="TRUST_GRANT">Trust Grant / Subsidized</option>
                    <option value="ONLINE_UPI">Online UPI (GPay / PhonePe)</option>
                    <option value="CASH_ON_VISIT">Cash on Visit</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Payment Status</label>
                  <select value={bookingForm.paymentStatus} onChange={e => setBookingForm({...bookingForm, paymentStatus: e.target.value as any})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="SUBSIDIZED">Subsidized (Covered by Trust)</option>
                    <option value="PAID">Paid</option>
                    <option value="PENDING">Pending</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Date</label>
                  <input value={bookingForm.scheduledDate} onChange={e => setBookingForm({...bookingForm, scheduledDate: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Time Slot</label>
                  <input value={bookingForm.scheduledTimeSlot} onChange={e => setBookingForm({...bookingForm, scheduledTimeSlot: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Assigned Caregiver</label>
                  <select value={bookingForm.caregiverName} onChange={e => setBookingForm({...bookingForm, caregiverName: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="Unassigned">Unassigned (Awaiting Assignment)</option>
                    {caregivers.map(cg => (
                      <option key={cg.id} value={cg.fullName}>{cg.fullName} ({cg.employmentType})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Booking Status</label>
                  <select value={bookingForm.status} onChange={e => setBookingForm({...bookingForm, status: e.target.value as any})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="In Progress">In Progress</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Awaiting Assignment">Awaiting Assignment</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Service Address</label>
                <input required value={bookingForm.serviceAddress} onChange={e => setBookingForm({...bookingForm, serviceAddress: e.target.value})} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
                {editingBooking ? 'Save Changes' : 'Confirm & Dispatch Booking'}
              </button>
            </form>
          </div>
        </div>
      )}

      
      {/* ========================================================================= */}
      {/* 4-STEP BENEFICIARY REGISTRATION & EDIT WIZARD (PIXEL-PERFECT DESIGN)      */}
      {/* ========================================================================= */}
      {showAddBenModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ background: '#FFF', borderRadius: 24, maxWidth: 960, width: '100%', maxHeight: '92vh', overflowY: 'auto', padding: '28px 32px', boxShadow: '0 20px 50px rgba(0,0,0,0.25)' }}>
            
            {/* Top Bar with Back Arrow, Title & Subtitle */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <button 
                  onClick={() => { setShowAddBenModal(false); setEditingBeneficiary(null); }}
                  style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid #E5E9E6', background: '#FAFBF9', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <ChevronLeft size={20} color="#1E2D24" />
                </button>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0B5D3B' }}>
                    {editingBeneficiary ? `Edit Beneficiary: ${editingBeneficiary.fullName}` : 'Register Beneficiary & Family'}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#6B7C72', marginTop: 2 }}>
                    {editingBeneficiary ? 'Update care profile, guardian details, and subsidy tier' : 'Add a senior citizen or person with disability to trust registry'}
                  </p>
                </div>
              </div>

              <button 
                onClick={() => { setShowAddBenModal(false); setEditingBeneficiary(null); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}
              >
                <X size={22} />
              </button>
            </div>

            {/* Stepper Navigation */}
            <div className="stepper-header">
              <div className={`step-item ${benWizardStep === 1 ? 'active' : ''}`} onClick={() => setBenWizardStep(1)}>
                <span className={`step-badge ${benWizardStep > 1 ? 'completed' : ''}`}>1</span>
                <span>Beneficiary Profile</span>
              </div>
              <ChevronRight size={14} color="#9EAFA5" />

              <div className={`step-item ${benWizardStep === 2 ? 'active' : ''}`} onClick={() => setBenWizardStep(2)}>
                <span className={`step-badge ${benWizardStep > 2 ? 'completed' : ''}`}>2</span>
                <span>Guardian & Family</span>
              </div>
              <ChevronRight size={14} color="#9EAFA5" />

              <div className={`step-item ${benWizardStep === 3 ? 'active' : ''}`} onClick={() => setBenWizardStep(3)}>
                <span className={`step-badge ${benWizardStep > 3 ? 'completed' : ''}`}>3</span>
                <span>Medical & Care Needs</span>
              </div>
              <ChevronRight size={14} color="#9EAFA5" />

              <div className={`step-item ${benWizardStep === 4 ? 'active' : ''}`} onClick={() => setBenWizardStep(4)}>
                <span className="step-badge">4</span>
                <span>Trust Subsidy Tier</span>
              </div>
            </div>

            {/* STEP 1: BENEFICIARY PROFILE */}
            {benWizardStep === 1 && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 28 }}>
                  <div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0B5D3B', marginBottom: 4 }}>Personal Information</h3>
                    <p style={{ fontSize: '12px', color: '#6B7C72', marginBottom: 20 }}>
                      Enter personal and demographic details of the care recipient
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Full Name <span style={{ color: '#D32F2F' }}>*</span>
                        </label>
                        <input 
                          required
                          value={benWizardForm.fullName}
                          onChange={e => setBenWizardForm({ ...benWizardForm, fullName: e.target.value })}
                          placeholder="e.g. Saraswathi Garu"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Care Category <span style={{ color: '#D32F2F' }}>*</span>
                        </label>
                        <select 
                          value={benWizardForm.category}
                          onChange={e => setBenWizardForm({ ...benWizardForm, category: e.target.value as any })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                        >
                          <option value="Senior Citizen">Senior Citizen (Elderly Care)</option>
                          <option value="Person with Disability">Person with Disability (Divyang)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Date of Birth
                        </label>
                        <input 
                          type="date"
                          value={benWizardForm.dateOfBirth}
                          onChange={e => {
                            const dob = e.target.value;
                            const birthYear = new Date(dob).getFullYear();
                            const currentYear = new Date().getFullYear();
                            const calcAge = currentYear - birthYear;
                            setBenWizardForm({ ...benWizardForm, dateOfBirth: dob, age: calcAge > 0 ? calcAge : 68 });
                          }}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Age
                        </label>
                        <input 
                          value={`${benWizardForm.age} yrs`}
                          readOnly
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', background: '#F5F7F6', fontSize: '13px', color: '#4A5D52' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Gender
                        </label>
                        <select 
                          value={benWizardForm.gender}
                          onChange={e => setBenWizardForm({ ...benWizardForm, gender: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Blood Group
                        </label>
                        <select 
                          value={benWizardForm.bloodGroup}
                          onChange={e => setBenWizardForm({ ...benWizardForm, bloodGroup: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                        >
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Aadhaar Number
                        </label>
                        <input 
                          value={benWizardForm.aadhaarNumber}
                          onChange={e => setBenWizardForm({ ...benWizardForm, aadhaarNumber: e.target.value })}
                          placeholder="XXXX-XXXX-8912"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                        />
                      </div>
                    </div>

                    {benWizardForm.category === 'Person with Disability' && (
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          UDID (Unique Disability ID) Card No.
                        </label>
                        <input 
                          value={benWizardForm.udidNumber}
                          onChange={e => setBenWizardForm({ ...benWizardForm, udidNumber: e.target.value })}
                          placeholder="e.g. AP-DIS-2018-88124"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                        />
                      </div>
                    )}

                    <div style={{ marginBottom: 16 }}>
                      <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                        Full Residence Address <span style={{ color: '#D32F2F' }}>*</span>
                      </label>
                      <textarea 
                        rows={2}
                        required
                        value={benWizardForm.address}
                        onChange={e => setBenWizardForm({ ...benWizardForm, address: e.target.value })}
                        placeholder="#14-2, T.T.D. Colony, Tirupati - 517501, Andhra Pradesh"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px', resize: 'none' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16 }}>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Service Zone <span style={{ color: '#D32F2F' }}>*</span>
                        </label>
                        <select 
                          value={benWizardForm.zone}
                          onChange={e => setBenWizardForm({ ...benWizardForm, zone: e.target.value })}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                        >
                          <option value="T.T.D. Colony">T.T.D. Colony</option>
                          <option value="Tirupati Urban">Tirupati Urban</option>
                          <option value="Tirupati West">Tirupati West</option>
                          <option value="Alipiri & Kapilatheertham">Alipiri & Kapilatheertham</option>
                          <option value="Renigunta Zone">Renigunta Zone</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                          Pincode
                        </label>
                        <input 
                          value={benWizardForm.pincode}
                          onChange={e => setBenWizardForm({ ...benWizardForm, pincode: e.target.value })}
                          placeholder="517501"
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Photo & Identity Box */}
                  <div>
                    <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1E2D24', marginBottom: 12 }}>
                      Beneficiary Photo
                    </h3>

                    <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
                      <div style={{ width: 110, height: 120, borderRadius: 14, overflow: 'hidden', border: '1px solid #E5E9E6', position: 'relative', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '32px', fontWeight: 800, color: '#0B5D3B' }}>
                          {benWizardForm.fullName ? benWizardForm.fullName.substring(0, 2).toUpperCase() : 'BN'}
                        </span>
                      </div>

                      <div className="photo-upload-box" style={{ flex: 1, padding: 16 }}>
                        <Download size={22} color="#0B5D3B" style={{ transform: 'rotate(180deg)', margin: '0 auto 6px auto' }} />
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E2D24' }}>Upload ID Photo</div>
                        <div style={{ fontSize: '10px', color: '#6B7C72', marginTop: 2 }}>JPG, PNG (Max 2MB)</div>
                      </div>
                    </div>

                    <div style={{ background: '#F4F8F5', border: '1px solid #D1DDD5', borderRadius: 14, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '13px', fontWeight: 700, color: '#0B5D3B', marginBottom: 8 }}>
                        <CheckCircle2 size={16} /> Trust Care Mission
                      </div>
                      <p style={{ fontSize: '11px', color: '#4A5D52', lineHeight: '1.5' }}>
                        Sri Divyang Seva Kendram Trust provides prioritized daily living assistance, medical accompaniment, and 100% subsidized care for verified elder and disabled beneficiaries in Tirupati.
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 18, borderTop: '1px solid #E5E9E6' }}>
                  <button 
                    type="button" 
                    onClick={() => { setShowAddBenModal(false); setEditingBeneficiary(null); }}
                    style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #E5E9E6', background: '#FFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button"
                    onClick={() => setBenWizardStep(2)}
                    className="btn-primary"
                    style={{ padding: '10px 24px', fontSize: '13px' }}
                  >
                    Next: Guardian & Family →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: GUARDIAN & FAMILY */}
            {benWizardStep === 2 && (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0B5D3B', marginBottom: 4 }}>Primary Guardian & Emergency Contacts</h3>
                <p style={{ fontSize: '12px', color: '#6B7C72', marginBottom: 20 }}>
                  Enter family guardian details who will manage bookings, approve care notes, and receive SOS alerts
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18, marginBottom: 18 }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Primary Guardian Name <span style={{ color: '#D32F2F' }}>*</span>
                    </label>
                    <input 
                      required
                      value={benWizardForm.primaryGuardian}
                      onChange={e => setBenWizardForm({ ...benWizardForm, primaryGuardian: e.target.value })}
                      placeholder="e.g. Anita Sharma"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Relationship to Beneficiary <span style={{ color: '#D32F2F' }}>*</span>
                    </label>
                    <select 
                      value={benWizardForm.relationship}
                      onChange={e => setBenWizardForm({ ...benWizardForm, relationship: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                    >
                      <option value="Daughter">Daughter</option>
                      <option value="Son">Son</option>
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Spouse">Spouse</option>
                      <option value="Brother">Brother</option>
                      <option value="Sister">Sister</option>
                      <option value="Legal Guardian">Legal Guardian</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Primary Contact Phone (WhatsApp) <span style={{ color: '#D32F2F' }}>*</span>
                    </label>
                    <input 
                      required
                      value={benWizardForm.guardianPhone}
                      onChange={e => setBenWizardForm({ ...benWizardForm, guardianPhone: e.target.value })}
                      placeholder="+91 98765 43210"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Alternate Emergency Phone
                    </label>
                    <input 
                      value={benWizardForm.alternateGuardianPhone}
                      onChange={e => setBenWizardForm({ ...benWizardForm, alternateGuardianPhone: e.target.value })}
                      placeholder="+91 91234 56789"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                    Guardian Email Address (For Invoices & Reports)
                  </label>
                  <input 
                    type="email"
                    value={benWizardForm.guardianEmail}
                    onChange={e => setBenWizardForm({ ...benWizardForm, guardianEmail: e.target.value })}
                    placeholder="anita.sharma@gmail.com"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 18, borderTop: '1px solid #E5E9E6' }}>
                  <button type="button" onClick={() => setBenWizardStep(1)} style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #E5E9E6', background: '#FFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    ← Back: Profile
                  </button>
                  <button type="button" onClick={() => setBenWizardStep(3)} className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }}>
                    Next: Medical & Care Needs →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: MEDICAL & CARE NEEDS */}
            {benWizardStep === 3 && (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0B5D3B', marginBottom: 4 }}>Medical History & Daily Care Plan</h3>
                <p style={{ fontSize: '12px', color: '#6B7C72', marginBottom: 20 }}>
                  Caregivers will adhere to these daily clinical routines, dietary instructions, and mobility aids
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Mobility Independence
                    </label>
                    <select 
                      value={benWizardForm.mobilityStatus}
                      onChange={e => setBenWizardForm({ ...benWizardForm, mobilityStatus: e.target.value as any })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                    >
                      <option value="Independent">Independent (Needs minimal assistance)</option>
                      <option value="Assisted Walking">Assisted Walking (Walker / Stick / Escort)</option>
                      <option value="Wheelchair Bound">Wheelchair Bound</option>
                      <option value="Bedridden">Bedridden (Requires full hygiene & turn care)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Known Drug / Food Allergies
                    </label>
                    <input 
                      value={benWizardForm.allergies}
                      onChange={e => setBenWizardForm({ ...benWizardForm, allergies: e.target.value })}
                      placeholder="e.g. Penicillin, Peanuts (or None)"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                    Diagnosed Medical Conditions
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    {['Hypertension', 'Type 2 Diabetes', 'Osteoarthritis', 'Dementia / Memory Loss', 'Post-Stroke Rehab', 'Cardiovascular Disease', 'Cerebral Palsy', 'Visual Impairment', 'Hearing Impairment'].map(cond => (
                      <label key={cond} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 8, border: '1px solid #E5E9E6', background: benWizardForm.medicalConditions.includes(cond) ? '#E8F5E9' : '#FFF', cursor: 'pointer', fontSize: '12px' }}>
                        <input 
                          type="checkbox"
                          checked={benWizardForm.medicalConditions.includes(cond)}
                          onChange={e => {
                            if (e.target.checked) {
                              setBenWizardForm({ ...benWizardForm, medicalConditions: [...benWizardForm.medicalConditions, cond] });
                            } else {
                              setBenWizardForm({ ...benWizardForm, medicalConditions: benWizardForm.medicalConditions.filter(c => c !== cond) });
                            }
                          }}
                        />
                        <span>{cond}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18, marginBottom: 18 }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Emergency Attending Doctor Name & Hospital
                    </label>
                    <input 
                      value={benWizardForm.emergencyDoctorName}
                      onChange={e => setBenWizardForm({ ...benWizardForm, emergencyDoctorName: e.target.value })}
                      placeholder="e.g. Dr. S. K. Raman (Apollo Tirupati)"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Doctor's Phone
                    </label>
                    <input 
                      value={benWizardForm.emergencyDoctorPhone}
                      onChange={e => setBenWizardForm({ ...benWizardForm, emergencyDoctorPhone: e.target.value })}
                      placeholder="+91 98480 11223"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                    Specific Accessibility & Daily Living Needs
                  </label>
                  <textarea 
                    rows={2}
                    value={benWizardForm.accessibilityNeeds}
                    onChange={e => setBenWizardForm({ ...benWizardForm, accessibilityNeeds: e.target.value })}
                    placeholder="e.g. Walking assistance, routine knee compression, diabetic salt-free meal preparation"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px', resize: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 18, borderTop: '1px solid #E5E9E6' }}>
                  <button type="button" onClick={() => setBenWizardStep(2)} style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #E5E9E6', background: '#FFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    ← Back: Guardian Details
                  </button>
                  <button type="button" onClick={() => setBenWizardStep(4)} className="btn-primary" style={{ padding: '10px 24px', fontSize: '13px' }}>
                    Next: Trust Subsidy Tier →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SUBSIDY TIER & FINALIZATION */}
            {benWizardStep === 4 && (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0B5D3B', marginBottom: 4 }}>Trust Sponsorship & Subsidy Allocation</h3>
                <p style={{ fontSize: '12px', color: '#6B7C72', marginBottom: 20 }}>
                  Allocate financial subsidy tier under Sri Divyang Seva Kendram Trust charitable grant
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 20 }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      Subsidy Tier
                    </label>
                    <select 
                      value={benWizardForm.subsidyTier}
                      onChange={e => setBenWizardForm({ ...benWizardForm, subsidyTier: e.target.value as any })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px', background: '#FFF' }}
                    >
                      <option value="100% Trust Covered (BPL/White Card)">100% Trust Covered (Below Poverty Line / White Card)</option>
                      <option value="75% Trust Grant">75% Trust Grant (Family pays 25%)</option>
                      <option value="50% Trust Grant">50% Trust Grant (Family pays 50%)</option>
                      <option value="Family Self-Funded">Family Self-Funded (Standard Fee)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 6 }}>
                      White Ration Card / BPL Certificate No.
                    </label>
                    <input 
                      value={benWizardForm.rationCardNumber}
                      onChange={e => setBenWizardForm({ ...benWizardForm, rationCardNumber: e.target.value })}
                      placeholder="e.g. WAP-1082-99120"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ background: '#E8F5E9', borderRadius: 14, padding: 18, border: '1px solid #C8E6C9', marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <CheckCircle2 size={22} color="#0B5D3B" />
                    <div>
                      <strong style={{ fontSize: '14px', color: '#0B5D3B' }}>
                        {editingBeneficiary ? 'Ready to Update Live Database' : 'Ready to Register Beneficiary'}
                      </strong>
                      <p style={{ fontSize: '12px', color: '#2E7D32', marginTop: 2 }}>
                        Beneficiary <strong>{benWizardForm.fullName}</strong> will immediately appear in the Registry, Dispatch Map, and Care Bookings roster.
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 18, borderTop: '1px solid #E5E9E6' }}>
                  <button type="button" onClick={() => setBenWizardStep(3)} style={{ padding: '10px 22px', borderRadius: 10, border: '1px solid #E5E9E6', background: '#FFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
                    ← Back: Medical Needs
                  </button>
                  <button 
                    type="button" 
                    onClick={async () => {
                      try {
                        if (editingBeneficiary) {
                          const res = await fetch(`${API_BASE_URL}/api/v1/beneficiaries/${editingBeneficiary.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(benWizardForm)
                          });
                          if (res.ok) {
                            setShowAddBenModal(false);
                            setEditingBeneficiary(null);
                            setBenWizardStep(1);
                            fetchData();
                          }
                        } else {
                          const res = await fetch(`${API_BASE_URL}/api/v1/beneficiaries`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(benWizardForm)
                          });
                          if (res.ok) {
                            setShowAddBenModal(false);
                            setBenWizardStep(1);
                            fetchData();
                          }
                        }
                      } catch (err) {
                        alert('Error saving beneficiary record');
                      }
                    }} 
                    className="btn-primary" 
                    style={{ padding: '10px 28px', fontSize: '13px' }}
                  >
                    {editingBeneficiary ? 'Save Beneficiary Changes ✓' : 'Confirm Registration & Dispatch ✓'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}


      
      {/* ========================================================================= */}
      {/* COMPREHENSIVE BENEFICIARY PROFILE MODAL WITH TABS & CARE CLINICAL DOSSIER */}
      {/* ========================================================================= */}
      {selectedBeneficiaryDetail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 24, maxWidth: 680, width: '100%', padding: '32px 36px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E5E9E6', paddingBottom: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 54, height: 54, borderRadius: '50%', background: selectedBeneficiaryDetail.avatarBg || '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '20px', color: '#0B5D3B' }}>
                  {selectedBeneficiaryDetail.fullName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1E2D24' }}>{selectedBeneficiaryDetail.fullName}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>{selectedBeneficiaryDetail.refNumber}</span>
                    <span className="badge badge-success">{selectedBeneficiaryDetail.category}</span>
                    <span style={{ fontSize: '12px', color: '#6B7C72' }}>• {selectedBeneficiaryDetail.age} yrs ({selectedBeneficiaryDetail.gender})</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button 
                  onClick={() => {
                    const ben = selectedBeneficiaryDetail;
                    setSelectedBeneficiaryDetail(null);
                    setEditingBeneficiary(ben);
                    setBenWizardForm({
                      fullName: ben.fullName,
                      category: ben.category,
                      dateOfBirth: ben.dateOfBirth || '1958-05-14',
                      age: ben.age,
                      gender: ben.gender,
                      bloodGroup: ben.bloodGroup || 'B+',
                      photoUrl: ben.photoUrl || '',
                      aadhaarNumber: ben.aadhaarNumber || '',
                      udidNumber: ben.udidNumber || '',
                      relationship: ben.relationship,
                      primaryGuardian: ben.primaryGuardian,
                      guardianPhone: ben.guardianPhone || ben.primaryContact,
                      alternateGuardianPhone: ben.alternateGuardianPhone || '',
                      guardianEmail: ben.guardianEmail || '',
                      address: ben.address,
                      zone: ben.zone || 'T.T.D. Colony',
                      pincode: ben.pincode || '517501',
                      mobilityStatus: ben.mobilityStatus || 'Assisted Walking',
                      medicalConditions: ben.medicalConditions || ['Routine Elder Care'],
                      allergies: ben.allergies || 'None',
                      accessibilityNeeds: ben.accessibilityNeeds,
                      emergencyDoctorName: ben.emergencyDoctorName || 'Dr. Raman',
                      emergencyDoctorPhone: ben.emergencyDoctorPhone || '+91 98480 11223',
                      subsidyTier: ben.subsidyTier || '100% Trust Covered (BPL/White Card)',
                      rationCardNumber: ben.rationCardNumber || ''
                    });
                    setShowAddBenModal(true);
                  }}
                  className="btn-primary"
                  style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Edit3 size={13} /> Edit Profile
                </button>
                <button onClick={() => setSelectedBeneficiaryDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}><X size={20} /></button>
              </div>
            </div>

            {/* Subsidy Banner */}
            <div style={{ background: '#FAFBF9', border: '1px solid #E5E9E6', borderRadius: 14, padding: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: '11px', color: '#6B7C72', display: 'block' }}>TRUST SPONSORSHIP STATUS</span>
                <strong style={{ fontSize: '14px', color: '#0B5D3B' }}>{selectedBeneficiaryDetail.subsidyTier || '100% Trust Covered (BPL/White Card)'}</strong>
                {selectedBeneficiaryDetail.rationCardNumber && (
                  <div style={{ fontSize: '11px', color: '#6B7C72', marginTop: 2 }}>White Card No: {selectedBeneficiaryDetail.rationCardNumber}</div>
                )}
              </div>
              <span className="badge badge-success">Active Beneficiary</span>
            </div>

            {/* 3 Detail Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Card 1: Family & Contact */}
              <div style={{ background: '#FAFBF9', padding: 16, borderRadius: 14, border: '1px solid #E5E9E6' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0B5D3B', marginBottom: 10 }}>Family Guardian & Residence</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '12px' }}>
                  <div><strong>Primary Guardian:</strong> {selectedBeneficiaryDetail.primaryGuardian} ({selectedBeneficiaryDetail.relationship})</div>
                  <div><strong>Primary Phone:</strong> {selectedBeneficiaryDetail.guardianPhone || selectedBeneficiaryDetail.primaryContact}</div>
                  <div><strong>Alternate Contact:</strong> {selectedBeneficiaryDetail.alternateGuardianPhone || 'Not specified'}</div>
                  <div><strong>Service Zone:</strong> {selectedBeneficiaryDetail.zone || 'Tirupati Urban'}</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Full Address:</strong> {selectedBeneficiaryDetail.address}</div>
                </div>
              </div>

              {/* Card 2: Medical & Mobility */}
              <div style={{ background: '#FAFBF9', padding: 16, borderRadius: 14, border: '1px solid #E5E9E6' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0B5D3B', marginBottom: 10 }}>Clinical Profile & Mobility Aid</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '12px' }}>
                  <div><strong>Blood Group:</strong> {selectedBeneficiaryDetail.bloodGroup || 'B+'}</div>
                  <div><strong>Mobility Level:</strong> {selectedBeneficiaryDetail.mobilityStatus || 'Assisted Walking'}</div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <strong>Diagnosed Conditions:</strong>{' '}
                    {selectedBeneficiaryDetail.medicalConditions ? selectedBeneficiaryDetail.medicalConditions.join(', ') : 'Routine Elder Care'}
                  </div>
                  <div><strong>Known Allergies:</strong> {selectedBeneficiaryDetail.allergies || 'None'}</div>
                  <div><strong>Emergency Doctor:</strong> {selectedBeneficiaryDetail.emergencyDoctorName || 'Dr. Raman'} ({selectedBeneficiaryDetail.emergencyDoctorPhone || '+91 98480 11223'})</div>
                  <div style={{ gridColumn: 'span 2' }}><strong>Daily Living Assistance:</strong> {selectedBeneficiaryDetail.accessibilityNeeds}</div>
                </div>
              </div>

              {/* Card 3: Identification & Trust Compliance */}
              <div style={{ background: '#FAFBF9', padding: 16, borderRadius: 14, border: '1px solid #E5E9E6' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0B5D3B', marginBottom: 10 }}>Verification & Identity Numbers</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, fontSize: '12px' }}>
                  <div><strong>Aadhaar Number:</strong> {selectedBeneficiaryDetail.aadhaarNumber || 'XXXX-XXXX-8912'}</div>
                  <div><strong>UDID Disability Card:</strong> {selectedBeneficiaryDetail.udidNumber || 'N/A (Senior Citizen)'}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
              <button 
                onClick={() => setSelectedBeneficiaryDetail(null)}
                style={{ padding: '10px 22px', borderRadius: 8, border: '1px solid #E5E9E6', background: '#FFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}


      {/* MODAL: CAREGIVER DETAIL PROFILE */}
      {selectedCaregiverDetail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 20, maxWidth: 500, width: '100%', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>Caregiver Profile</h3>
              <button onClick={() => setSelectedCaregiverDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18 }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px', color: '#0B5D3B' }}>
                {selectedCaregiverDetail.fullName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{selectedCaregiverDetail.fullName}</h4>
                <p style={{ fontSize: '12px', color: '#6B7C72' }}>{selectedCaregiverDetail.staffId} • {selectedCaregiverDetail.employmentType}</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '13px', background: '#FAFBF9', padding: 16, borderRadius: 12, border: '1px solid #E5E9E6' }}>
              <div><strong>Rating:</strong> ★ {selectedCaregiverDetail.rating} ({selectedCaregiverDetail.reviewCount || 120} reviews)</div>
              <div><strong>Service Zone:</strong> {selectedCaregiverDetail.zone}</div>
              <div><strong>Phone Contact:</strong> {selectedCaregiverDetail.phone}</div>
              <div><strong>Availability Status:</strong> <span className="badge badge-success">{selectedCaregiverDetail.availability}</span></div>
              <div><strong>Verification:</strong> <span className="badge badge-success">✓ Background Verified</span></div>
            </div>
          </div>
        </div>
      )}
    
      {/* ========================================================================= */}
      {/* LIVE BOOKING TRACKING & CLINICAL CHECKLIST DRAWER                          */}
      {/* ========================================================================= */}
      {selectedTrackingBooking && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ background: '#FFF', width: '100%', maxWidth: 520, height: '100%', padding: '24px 28px', overflowY: 'auto', boxShadow: '-10px 0 30px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <span style={{ fontSize: '12px', color: '#0B5D3B', fontWeight: 700 }}>LIVE VISIT MONITOR</span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1E2D24' }}>{selectedTrackingBooking.bookingNumber}</h3>
              </div>
              <button onClick={() => setSelectedTrackingBooking(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={22} /></button>
            </div>

            {/* Live Status Header */}
            <div style={{ background: '#E8F5E9', borderRadius: 14, padding: 16, border: '1px solid #C8E6C9', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 700 }}>CAREGIVER ETA</div>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: '#0B5D3B' }}>{selectedTrackingBooking.caregiverEtaMinutes || 8} Mins Away</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', color: '#6B7C72' }}>DISTANCE</div>
                  <strong style={{ fontSize: '14px', color: '#1E2D24' }}>{selectedTrackingBooking.geoDistanceKm || 0.6} km</strong>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#4A5D52', marginTop: 8 }}>
                Caregiver <strong>{selectedTrackingBooking.caregiverName}</strong> is en route to {selectedTrackingBooking.beneficiaryName}
              </div>
            </div>

            {/* Vitals Recorded */}
            {selectedTrackingBooking.vitals && (
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1E2D24', marginBottom: 10 }}>Live Clinical Vitals</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  <div style={{ background: '#FAFBF9', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6' }}>
                    <span style={{ fontSize: '11px', color: '#6B7C72' }}>Blood Pressure</span>
                    <strong style={{ display: 'block', fontSize: '14px', color: '#0B5D3B', marginTop: 2 }}>{selectedTrackingBooking.vitals.bp}</strong>
                  </div>
                  <div style={{ background: '#FAFBF9', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6' }}>
                    <span style={{ fontSize: '11px', color: '#6B7C72' }}>Pulse Rate</span>
                    <strong style={{ display: 'block', fontSize: '14px', color: '#0B5D3B', marginTop: 2 }}>{selectedTrackingBooking.vitals.pulse}</strong>
                  </div>
                  <div style={{ background: '#FAFBF9', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6' }}>
                    <span style={{ fontSize: '11px', color: '#6B7C72' }}>Oxygen (SpO2)</span>
                    <strong style={{ display: 'block', fontSize: '14px', color: '#0B5D3B', marginTop: 2 }}>{selectedTrackingBooking.vitals.spo2}</strong>
                  </div>
                  <div style={{ background: '#FAFBF9', padding: '10px 14px', borderRadius: 10, border: '1px solid #E5E9E6' }}>
                    <span style={{ fontSize: '11px', color: '#6B7C72' }}>Blood Sugar</span>
                    <strong style={{ display: 'block', fontSize: '14px', color: '#0B5D3B', marginTop: 2 }}>{selectedTrackingBooking.vitals.sugar}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Checklist */}
            {selectedTrackingBooking.checklistCompleted && (
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1E2D24', marginBottom: 10 }}>Visit Care Checklist</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedTrackingBooking.checklistCompleted.map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 8, background: c.done ? '#E8F5E9' : '#FAFBF9', border: '1px solid #E5E9E6' }}>
                      <span style={{ fontSize: '12px', fontWeight: c.done ? 600 : 400, color: c.done ? '#0B5D3B' : '#1E2D24' }}>{c.task}</span>
                      <span style={{ fontSize: '11px', color: c.done ? '#2E7D32' : '#9EAFA5', fontWeight: 600 }}>{c.done ? '✓ ' + (c.time || 'Done') : 'Pending'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Caregiver Notes */}
            {selectedTrackingBooking.caregiverNotes && (
              <div style={{ background: '#FFF9EB', border: '1px solid #F5E6BE', borderRadius: 12, padding: 14, marginBottom: 24, fontSize: '12px', color: '#4A5D52' }}>
                <strong style={{ color: '#0B5D3B', display: 'block', marginBottom: 4 }}>Caregiver Field Notes:</strong>
                "{selectedTrackingBooking.caregiverNotes}"
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button 
                onClick={() => alert(`Calling Caregiver ${selectedTrackingBooking.caregiverName}...`)}
                style={{ flex: 1, padding: 12, borderRadius: 10, background: '#0B5D3B', color: '#FFF', border: 'none', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <PhoneCall size={15} /> Call Caregiver
              </button>
              <button 
                onClick={() => alert(`Calling Family Guardian for ${selectedTrackingBooking.beneficiaryName}...`)}
                style={{ flex: 1, padding: 12, borderRadius: 10, background: '#FFF', color: '#0B5D3B', border: '1px solid #0B5D3B', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <PhoneCall size={15} /> Call Guardian
              </button>
            </div>
          </div>
        </div>
      )}


      
      {/* MODAL: ADD STAFF MEMBER */}
      {showAddStaffModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 20, maxWidth: 500, width: '100%', padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0B5D3B' }}>Add Internal Staff Member</h3>
              <button onClick={() => setShowAddStaffModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await fetch(`${API_BASE_URL}/api/v1/staff`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newStaffForm)
              });
              setShowAddStaffModal(false);
              fetchData();
            }}>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Full Name</label>
                <input required value={newStaffForm.fullName} onChange={e => setNewStaffForm({ ...newStaffForm, fullName: e.target.value })} placeholder="e.g. Sunita Reddy" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Role</label>
                  <select value={newStaffForm.role} onChange={e => setNewStaffForm({ ...newStaffForm, role: e.target.value as any })} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }}>
                    <option value="Trust Care Coordinator">Trust Care Coordinator</option>
                    <option value="Field Supervisor">Field Supervisor</option>
                    <option value="Accounts Officer">Accounts Officer</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone</label>
                  <input required value={newStaffForm.phone} onChange={e => setNewStaffForm({ ...newStaffForm, phone: e.target.value })} placeholder="+91 98765 00003" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Email</label>
                <input required type="email" value={newStaffForm.email} onChange={e => setNewStaffForm({ ...newStaffForm, email: e.target.value })} placeholder="staff@thodu.sriddha.com" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: 4 }}>Assigned Service Zone</label>
                <input value={newStaffForm.serviceZone} onChange={e => setNewStaffForm({ ...newStaffForm, serviceZone: e.target.value })} placeholder="Tirupati Urban" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #E5E9E6' }} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
                Confirm Add Staff Member
              </button>
            </form>
          </div>
        </div>
      )}

    
      {/* ========================================================================= */}
      {/* OFFICIAL TRUST RECEIPT MODAL (80G TAX EXEMPTION & TRUST ENDOWMENT)       */}
      {/* ========================================================================= */}
      {selectedReceipt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1250, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#FFF', borderRadius: 20, maxWidth: 600, width: '100%', padding: '32px 36px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)', maxHeight: '90vh', overflowY: 'auto' }}>
            
            {/* Trust Header with Seal */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0B5D3B', paddingBottom: 16, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src="/assets/thodu-logo.png" alt="Thodu Logo" style={{ height: 48, objectFit: 'contain' }} />
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0B5D3B' }}>Sri Divyang Seva Kendram Trust</h3>
                  <p style={{ fontSize: '11px', color: '#6B7C72' }}>Regd. Public Charitable Trust • Elder & Disability Care Services</p>
                  <p style={{ fontSize: '10px', color: '#0B5D3B', fontWeight: 600 }}>Tirupati, Andhra Pradesh - 517501</p>
                </div>
              </div>
              <button onClick={() => setSelectedReceipt(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6B7C72' }}><X size={20} /></button>
            </div>

            {/* Receipt Details Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F4F8F5', padding: '12px 16px', borderRadius: 10, marginBottom: 20, border: '1px solid #D1DDD5' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#6B7C72', display: 'block' }}>OFFICIAL RECEIPT NO.</span>
                <strong style={{ fontSize: '15px', color: '#0B5D3B' }}>{selectedReceipt.invoiceNumber}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: '#6B7C72', display: 'block' }}>DATE & TIME</span>
                <strong style={{ fontSize: '13px', color: '#1E2D24' }}>{selectedReceipt.timestamp}</strong>
              </div>
            </div>

            {/* Payer & Beneficiary Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20, fontSize: '12px' }}>
              <div style={{ background: '#FAFBF9', padding: '12px 14px', borderRadius: 10, border: '1px solid #E5E9E6' }}>
                <span style={{ fontSize: '11px', color: '#6B7C72', fontWeight: 600, display: 'block', marginBottom: 4 }}>CARE BENEFICIARY</span>
                <strong style={{ fontSize: '13px', color: '#1E2D24' }}>{selectedReceipt.beneficiaryName}</strong>
                <div style={{ color: '#6B7C72', marginTop: 2 }}>Booking Ref: {selectedReceipt.bookingNumber}</div>
              </div>
              <div style={{ background: '#FAFBF9', padding: '12px 14px', borderRadius: 10, border: '1px solid #E5E9E6' }}>
                <span style={{ fontSize: '11px', color: '#6B7C72', fontWeight: 600, display: 'block', marginBottom: 4 }}>PAID BY / GUARDIAN</span>
                <strong style={{ fontSize: '13px', color: '#1E2D24' }}>{selectedReceipt.guardianName}</strong>
                <div style={{ color: '#6B7C72', marginTop: 2 }}>Contact: {selectedReceipt.payerContact}</div>
              </div>
            </div>

            {/* Financial Line Item Breakdown */}
            <div style={{ border: '1px solid #E5E9E6', borderRadius: 12, overflow: 'hidden', marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '10px 14px', background: '#F0F4F1', fontSize: '11px', fontWeight: 700, color: '#0B5D3B' }}>
                <span>SERVICE ITEM</span>
                <span style={{ textAlign: 'right' }}>FEE RATE</span>
                <span style={{ textAlign: 'right' }}>AMOUNT</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '12px 14px', fontSize: '12px', borderBottom: '1px solid #F0F2F0' }}>
                <div>
                  <strong>Scheduled Care Support Visit</strong>
                  <div style={{ fontSize: '11px', color: '#6B7C72' }}>Mode: {selectedReceipt.paymentGateway || selectedReceipt.paymentMode}</div>
                </div>
                <span style={{ textAlign: 'right' }}>₹{selectedReceipt.amountInr + selectedReceipt.subsidyInr}</span>
                <span style={{ textAlign: 'right', fontWeight: 700 }}>₹{selectedReceipt.amountInr + selectedReceipt.subsidyInr}</span>
              </div>
              {selectedReceipt.subsidyInr > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '10px 14px', fontSize: '12px', background: '#E8F5E9', color: '#0B5D3B' }}>
                  <span>Less: Sri Divyang Trust Subsidy Grant (100% Free)</span>
                  <span></span>
                  <span style={{ textAlign: 'right', fontWeight: 700 }}>- ₹{selectedReceipt.subsidyInr}</span>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '12px 14px', fontSize: '14px', background: '#FAFBF9', fontWeight: 800 }}>
                <span>Net Amount Paid:</span>
                <span></span>
                <span style={{ textAlign: 'right', color: '#0B5D3B' }}>₹{selectedReceipt.amountInr}</span>
              </div>
            </div>

            {/* Statutory Compliance Footer */}
            <div style={{ background: '#FFF9EB', border: '1px solid #F5E6BE', borderRadius: 10, padding: 12, marginBottom: 20, fontSize: '11px', color: '#4A5D52' }}>
              <strong>Trust Statutory Exemption:</strong> Donations and contributions to Sri Divyang Seva Kendram Trust are eligible for tax deduction under Section 80G of the Income Tax Act.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <button 
                onClick={() => setSelectedReceipt(null)}
                style={{ padding: '10px 18px', borderRadius: 8, border: '1px solid #E5E9E6', background: '#FFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
              >
                Close
              </button>
              <button 
                onClick={() => window.print()}
                className="btn-primary"
                style={{ padding: '10px 22px', fontSize: '13px' }}
              >
                Print Official Receipt 🖨️
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}