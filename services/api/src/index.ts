import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5089;

app.use(cors());
app.use(express.json());

// ==========================================
// CENTRAL DATABASE (Single Source of Truth)
// ==========================================

export interface Beneficiary {
  id: string;
  refNumber: string;
  fullName: string;
  category: 'Senior Citizen' | 'Person with Disability';
  age: number;
  gender: string;
  relationship: string;
  primaryGuardian: string;
  primaryContact: string;
  address: string;
  accessibilityNeeds: string;
  status: 'Active' | 'Inactive';
  avatarBg: string;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryAge: number;
  guardianPhone: string;
  serviceName: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  serviceAddress: string;
  caregiverName: string;
  fundingType: 'Trust Sponsored' | 'Family Paid' | 'Partially Sponsored' | 'Donor Sponsored';
  totalAmountPaise: number;
  subsidyAmountPaise: number;
  familyPayablePaise: number;
  paymentMode: 'CASH_ON_VISIT' | 'ONLINE_UPI' | 'TRUST_GRANT' | 'BANK_TRANSFER';
  paymentStatus: 'PAID' | 'PENDING' | 'SUBSIDIZED';
  status: 'In Progress' | 'Confirmed' | 'Awaiting Assignment' | 'Scheduled' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface Caregiver {
  id: string;
  fullName: string;
  phone: string;
  employmentType: 'SALARIED' | 'FREELANCE_GIG';
  verificationStatus: 'VERIFIED' | 'PENDING';
  rating: number;
  activeAssignments: number;
  skills: string[];
  zone: string;
}

export interface Sponsorship {
  id: string;
  applicationRef: string;
  beneficiaryName: string;
  programme: string;
  applicantName: string;
  requestedSubsidyPercent: number;
  documentsProvided: string;
  status: 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  submittedAt: string;
}

export interface SosAlert {
  id: string;
  beneficiaryName: string;
  triggeredBy: string;
  timestamp: string;
  status: 'RESPONDER_DISPATCHED' | 'RESOLVED';
  notes: string;
}

// Live Beneficiaries strictly matching user reference board
let beneficiaries: Beneficiary[] = [
  {
    id: 'ben-1',
    refNumber: 'TH-BEN-1001',
    fullName: 'Saraswathi Garu',
    category: 'Senior Citizen',
    age: 68,
    gender: 'Female',
    relationship: 'Mother',
    primaryGuardian: 'Anita Sharma',
    primaryContact: '+91 98765 43210',
    address: 'T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Walking support, knee pain care',
    status: 'Active',
    avatarBg: '#E8F5E9'
  },
  {
    id: 'ben-2',
    refNumber: 'TH-BEN-1002',
    fullName: 'Lakshmi Narasimha Rao',
    category: 'Senior Citizen',
    age: 72,
    gender: 'Male',
    relationship: 'Father',
    primaryGuardian: 'Anita Sharma',
    primaryContact: '+91 98765 43210',
    address: 'T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Dietary supervision, walking assistance',
    status: 'Active',
    avatarBg: '#E1F5FE'
  },
  {
    id: 'ben-3',
    refNumber: 'TH-BEN-1003',
    fullName: 'Raghav',
    category: 'Person with Disability',
    age: 25,
    gender: 'Male',
    relationship: 'Son',
    primaryGuardian: 'Anita Sharma',
    primaryContact: '+91 98765 43210',
    address: 'T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Wheelchair assistance, companion care',
    status: 'Active',
    avatarBg: '#EDE7F6'
  },
  {
    id: 'ben-4',
    refNumber: 'TH-BEN-1004',
    fullName: 'Anil Kumar',
    category: 'Person with Disability',
    age: 38,
    gender: 'Male',
    relationship: 'Brother',
    primaryGuardian: 'K. Sridevi',
    primaryContact: '+91 94444 12345',
    address: 'T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Speech aid, assisted mobility',
    status: 'Active',
    avatarBg: '#FFF3E0'
  },
  {
    id: 'ben-5',
    refNumber: 'TH-BEN-1005',
    fullName: 'Kamala Devi',
    category: 'Senior Citizen',
    age: 76,
    gender: 'Female',
    relationship: 'Mother',
    primaryGuardian: 'Ravi Kumar',
    primaryContact: '+91 98490 66778',
    address: 'Lakshmi Nagar, Tirupati',
    accessibilityNeeds: 'Bedside monitoring, diabetic diet',
    status: 'Inactive',
    avatarBg: '#FFEBEE'
  }
];

let services = [
  { id: 'srv-1', name: 'Household Support', basePricePaise: 60000, duration: '2 hours' },
  { id: 'srv-2', name: 'Companionship & Care', basePricePaise: 40000, duration: '2 hours' },
  { id: 'srv-3', name: 'Medication Reminders', basePricePaise: 30000, duration: '1 hour' },
  { id: 'srv-4', name: 'Grocery & Errands', basePricePaise: 35000, duration: '2 hours' },
  { id: 'srv-5', name: 'Disability Support', basePricePaise: 50000, duration: '3 hours' },
  { id: 'srv-6', name: 'Cooking Assistance', basePricePaise: 45000, duration: '2 hours' }
];

let caregivers: Caregiver[] = [
  {
    id: 'cg-1',
    fullName: 'Anitha',
    phone: '+91 98765 11111',
    employmentType: 'SALARIED',
    verificationStatus: 'VERIFIED',
    rating: 4.8,
    activeAssignments: 2,
    skills: ['Elder Companionship', 'Cooking', 'Mobility Support'],
    zone: 'Tirupati Urban'
  },
  {
    id: 'cg-2',
    fullName: 'K. Ramesh',
    phone: '+91 98765 22222',
    employmentType: 'FREELANCE_GIG',
    verificationStatus: 'VERIFIED',
    rating: 4.9,
    activeAssignments: 1,
    skills: ['Cooking', 'Errands', 'Medication Reminders'],
    zone: 'T.T.D. Colony'
  },
  {
    id: 'cg-3',
    fullName: 'S. Prasad',
    phone: '+91 98765 44444',
    employmentType: 'SALARIED',
    verificationStatus: 'VERIFIED',
    rating: 4.9,
    activeAssignments: 1,
    skills: ['Disability Support', 'Mobility Assistance'],
    zone: 'Tirupati Urban'
  },
  {
    id: 'cg-4',
    fullName: 'P. Venkatesh',
    phone: '+91 98765 33333',
    employmentType: 'SALARIED',
    verificationStatus: 'VERIFIED',
    rating: 4.7,
    activeAssignments: 1,
    skills: ['Disability Care', 'Physiotherapy Assist'],
    zone: 'Tirupati West'
  }
];

let bookings: Booking[] = [
  {
    id: 'bk-1',
    bookingNumber: 'THD-28941',
    beneficiaryId: 'ben-1',
    beneficiaryName: 'Saraswathi Garu',
    beneficiaryAge: 68,
    guardianPhone: '+91 98765 43210',
    serviceName: 'Household Support',
    scheduledDate: 'Today, 11:30 AM',
    scheduledTimeSlot: '11:30 AM - 01:30 PM',
    serviceAddress: 'T.T.D. Colony, Tirupati',
    caregiverName: 'Anitha',
    fundingType: 'Trust Sponsored',
    totalAmountPaise: 60000,
    subsidyAmountPaise: 60000,
    familyPayablePaise: 0,
    paymentMode: 'TRUST_GRANT',
    paymentStatus: 'SUBSIDIZED',
    status: 'Completed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk-2',
    bookingNumber: 'THD-28940',
    beneficiaryId: 'ben-3',
    beneficiaryName: 'Raghav',
    beneficiaryAge: 25,
    guardianPhone: '+91 98765 43210',
    serviceName: 'Companionship & Care',
    scheduledDate: 'Today, 10:00 AM',
    scheduledTimeSlot: '10:00 AM - 12:00 PM',
    serviceAddress: 'T.T.D. Colony, Tirupati',
    caregiverName: 'P. Venkatesh',
    fundingType: 'Trust Sponsored',
    totalAmountPaise: 40000,
    subsidyAmountPaise: 40000,
    familyPayablePaise: 0,
    paymentMode: 'TRUST_GRANT',
    paymentStatus: 'SUBSIDIZED',
    status: 'In Progress',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk-3',
    bookingNumber: 'THD-28939',
    beneficiaryId: 'ben-2',
    beneficiaryName: 'Lakshmi Narasimha Rao',
    beneficiaryAge: 72,
    guardianPhone: '+91 98765 43210',
    serviceName: 'Medication Reminders',
    scheduledDate: 'Today, 09:00 AM',
    scheduledTimeSlot: '09:00 AM - 10:00 AM',
    serviceAddress: 'T.T.D. Colony, Tirupati',
    caregiverName: 'K. Ramesh',
    fundingType: 'Family Paid',
    totalAmountPaise: 30000,
    subsidyAmountPaise: 0,
    familyPayablePaise: 30000,
    paymentMode: 'ONLINE_UPI',
    paymentStatus: 'PAID',
    status: 'Completed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk-4',
    bookingNumber: 'THD-28938',
    beneficiaryId: 'ben-4',
    beneficiaryName: 'Anil Kumar',
    beneficiaryAge: 38,
    guardianPhone: '+91 94444 12345',
    serviceName: 'Disability Support',
    scheduledDate: 'Today, 04:00 PM',
    scheduledTimeSlot: '04:00 PM - 05:30 PM',
    serviceAddress: 'T.T.D. Colony, Tirupati',
    caregiverName: 'S. Prasad',
    fundingType: 'Partially Sponsored',
    totalAmountPaise: 50000,
    subsidyAmountPaise: 40000,
    familyPayablePaise: 10000,
    paymentMode: 'CASH_ON_VISIT',
    paymentStatus: 'PENDING',
    status: 'Scheduled',
    createdAt: new Date().toISOString()
  }
];

let sponsorshipApplications: Sponsorship[] = [
  {
    id: 'sp-101',
    applicationRef: 'SP-2026-09',
    beneficiaryName: 'Saraswathi Garu',
    programme: 'Elder Care Support Programme',
    applicantName: 'Anita Sharma',
    requestedSubsidyPercent: 100,
    documentsProvided: 'Aadhaar, BPL Ration Card, Prescriptions',
    status: 'APPROVED',
    submittedAt: '2026-11-01'
  },
  {
    id: 'sp-102',
    applicationRef: 'SP-2026-10',
    beneficiaryName: 'Raghav',
    programme: 'Disability Care Aid',
    applicantName: 'Anita Sharma',
    requestedSubsidyPercent: 80,
    documentsProvided: 'UDID Card, Income Certificate',
    status: 'APPROVED',
    submittedAt: '2026-11-02'
  }
];

let sosAlerts: SosAlert[] = [
  {
    id: 'SOS-9912',
    beneficiaryName: 'Saraswathi Garu',
    triggeredBy: 'Anita Sharma (+91 98765 43210)',
    timestamp: new Date().toISOString(),
    status: 'RESPONDER_DISPATCHED',
    notes: 'Urgent mobility assistance required'
  }
];

let auditLogs = [
  {
    id: 'aud-1',
    adminUser: 'Raju Kumar (Super Admin)',
    action: 'APPROVAL',
    module: 'Sponsorship',
    details: 'Approved 100% subsidy for Saraswathi Garu under Elder Care Programme',
    timestamp: '2026-11-02 16:30'
  },
  {
    id: 'aud-2',
    adminUser: 'Raju Kumar (Super Admin)',
    action: 'DISPATCH',
    module: 'Bookings',
    details: 'Dispatched Anitha for Booking THD-28941',
    timestamp: '2026-11-03 11:00'
  }
];

// ==========================================
// API ROUTES
// ==========================================

// 1. Live Overview Analytics Data
app.get('/api/v1/analytics', (req: Request, res: Response) => {
  const totalBeneficiaries = beneficiaries.length;
  const seniorCitizens = beneficiaries.filter(b => b.category === 'Senior Citizen').length;
  const personsWithDisabilities = beneficiaries.filter(b => b.category === 'Person with Disability').length;
  const activeGuardians = new Set(beneficiaries.map(b => b.primaryGuardian)).size;

  const totalBookings = bookings.length;
  const completedServices = bookings.filter(b => b.status === 'Completed').length;
  
  const revenuePaise = bookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.familyPayablePaise : 0), 0);
  const sponsoredPaise = bookings.reduce((sum, b) => sum + b.subsidyAmountPaise, 0);

  // Exact Service Distribution Percentages
  const serviceDistribution = [
    { name: 'Household Support', percentage: 32, color: '#4CAF50' },
    { name: 'Companionship & Care', percentage: 20, color: '#FF9800' },
    { name: 'Medication Reminders', percentage: 16, color: '#9C27B0' },
    { name: 'Grocery & Errands', percentage: 14, color: '#00BCD4' },
    { name: 'Disability Support', percentage: 10, color: '#3F51B5' },
    { name: 'Other Services', percentage: 8, color: '#E91E63' }
  ];

  // Booking Trend for last 6 months
  const bookingsTrend = [
    { month: 'Jun', bookings: 1250, completed: 1100 },
    { month: 'Jul', bookings: 1400, completed: 1300 },
    { month: 'Aug', bookings: 1750, completed: 1600 },
    { month: 'Sep', bookings: 2100, completed: 1950 },
    { month: 'Oct', bookings: 2450, completed: 2300 },
    { month: 'Nov', bookings: 2864, completed: 2561 }
  ];

  res.json({
    success: true,
    data: {
      totalBeneficiaries,
      seniorCitizens,
      seniorCitizensPct: totalBeneficiaries > 0 ? Math.round((seniorCitizens / totalBeneficiaries) * 100) : 0,
      personsWithDisabilities,
      personsWithDisabilitiesPct: totalBeneficiaries > 0 ? Math.round((personsWithDisabilities / totalBeneficiaries) * 100) : 0,
      activeGuardians,
      activeCaregivers: caregivers.length,
      totalBookings,
      completedServices,
      completionRate: 96.8,
      revenueInr: Math.round(revenuePaise / 100),
      sponsoredValueInr: Math.round(sponsoredPaise / 100),
      sponsoredServicesCount: bookings.filter(b => b.fundingType !== 'Family Paid').length,
      beneficiarySatisfaction: 4.8,
      caregiverUtilization: 82,
      onTimeServiceRate: 94.1,
      totalServiceAreas: 12,
      activeAreas: 10,
      newRequestsToday: 28,
      avgResponseTimeMin: 18,
      serviceDistribution,
      bookingsTrend,
      activeSosCount: sosAlerts.filter(s => s.status !== 'RESOLVED').length,
      recentBookings: bookings.slice(0, 5)
    }
  });
});

// 2. Beneficiaries Search & Auto-Suggest
app.get('/api/v1/beneficiaries', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  const categoryFilter = (req.query.category as string || 'ALL');
  const statusFilter = (req.query.status as string || 'ALL');

  let filtered = beneficiaries;

  if (query) {
    filtered = filtered.filter(b => 
      b.fullName.toLowerCase().includes(query) ||
      b.refNumber.toLowerCase().includes(query) ||
      b.primaryGuardian.toLowerCase().includes(query) ||
      b.primaryContact.includes(query) ||
      b.address.toLowerCase().includes(query)
    );
  }

  if (categoryFilter !== 'ALL') {
    filtered = filtered.filter(b => b.category === categoryFilter);
  }

  if (statusFilter !== 'ALL') {
    filtered = filtered.filter(b => b.status === statusFilter);
  }

  res.json({ success: true, beneficiaries: filtered });
});

app.post('/api/v1/beneficiaries', (req: Request, res: Response) => {
  const { fullName, category, age, gender, relationship, primaryGuardian, primaryContact, address, accessibilityNeeds } = req.body;
  const newBen: Beneficiary = {
    id: `ben-${Date.now()}`,
    refNumber: `TH-BEN-${Math.floor(1000 + beneficiaries.length + 1)}`,
    fullName,
    category: category || 'Senior Citizen',
    age: Number(age) || 65,
    gender: gender || 'Female',
    relationship: relationship || 'Mother',
    primaryGuardian: primaryGuardian || 'Anita Sharma',
    primaryContact: primaryContact || '+91 98765 43210',
    address: address || 'T.T.D. Colony, Tirupati',
    accessibilityNeeds: accessibilityNeeds || 'General Assisted Living',
    status: 'Active',
    avatarBg: '#E8F5E9'
  };
  beneficiaries.unshift(newBen);

  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    adminUser: 'Raju Kumar (Super Admin)',
    action: 'CREATE_BENEFICIARY',
    module: 'Beneficiaries',
    details: `Registered ${newBen.fullName} (${newBen.refNumber})`,
    timestamp: new Date().toLocaleString()
  });

  res.status(201).json({ success: true, beneficiary: newBen });
});

// 3. Bookings Endpoints
app.get('/api/v1/bookings', (req: Request, res: Response) => {
  res.json({ success: true, bookings });
});

app.post('/api/v1/bookings', (req: Request, res: Response) => {
  const { beneficiaryName, serviceName, scheduledDate, scheduledTimeSlot, serviceAddress, fundingType, caregiverName } = req.body;
  const targetBen = beneficiaries.find(b => b.fullName.toLowerCase() === (beneficiaryName || '').toLowerCase()) || beneficiaries[0];
  const targetSrv = services.find(s => s.name === serviceName) || services[0];

  const totalAmountPaise = targetSrv.basePricePaise;
  let subsidyAmountPaise = 0;
  if (fundingType === 'Trust Sponsored') {
    subsidyAmountPaise = totalAmountPaise;
  } else if (fundingType === 'Partially Sponsored') {
    subsidyAmountPaise = Math.round(totalAmountPaise * 0.75);
  }

  const newBooking: Booking = {
    id: `bk-${Date.now()}`,
    bookingNumber: `THD-${Math.floor(28900 + bookings.length + 1)}`,
    beneficiaryId: targetBen.id,
    beneficiaryName: targetBen.fullName,
    beneficiaryAge: targetBen.age,
    guardianPhone: targetBen.primaryContact,
    serviceName: targetSrv.name,
    scheduledDate: scheduledDate || 'Today, 10:00 AM',
    scheduledTimeSlot: scheduledTimeSlot || '10:00 AM - 12:00 PM',
    serviceAddress: serviceAddress || targetBen.address,
    caregiverName: caregiverName || 'Anitha',
    fundingType: fundingType || 'Trust Sponsored',
    totalAmountPaise,
    subsidyAmountPaise,
    familyPayablePaise: totalAmountPaise - subsidyAmountPaise,
    paymentMode: subsidyAmountPaise === totalAmountPaise ? 'TRUST_GRANT' : 'ONLINE_UPI',
    paymentStatus: subsidyAmountPaise === totalAmountPaise ? 'SUBSIDIZED' : 'PENDING',
    status: caregiverName === 'Unassigned' ? 'Awaiting Assignment' : 'Confirmed',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});

app.delete('/api/v1/bookings/:id', (req: Request, res: Response) => {
  bookings = bookings.filter(b => b.id !== req.params.id);
  res.json({ success: true, message: 'Booking removed' });
});

// 4. Caregivers Endpoints
app.get('/api/v1/caregivers', (req: Request, res: Response) => {
  res.json({ success: true, caregivers });
});

// 5. Sponsorship Endpoints
app.get('/api/v1/sponsorship', (req: Request, res: Response) => {
  res.json({ success: true, applications: sponsorshipApplications });
});

// 6. SOS Operations
app.get('/api/v1/sos/queue', (req: Request, res: Response) => {
  res.json({ success: true, queue: sosAlerts });
});

// 7. Audit Logs
app.get('/api/v1/audit-logs', (req: Request, res: Response) => {
  res.json({ success: true, auditLogs });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Thodu API Engine',
    timestamp: new Date().toISOString(),
    organization: 'Sri Divyang Seva Kendram Trust'
  });
});

app.listen(PORT, () => {
  console.log(`[Thodu API] Running on port ${PORT}`);
});
