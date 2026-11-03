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
  fullName: string;
  category: 'SENIOR_CITIZEN' | 'PERSON_WITH_DISABILITY';
  age: number;
  gender: string;
  relationship: string;
  primaryGuardian: string;
  primaryContact: string;
  address: string;
  accessibilityNeeds: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface Booking {
  id: string;
  bookingNumber: string;
  beneficiaryId: string;
  beneficiaryName: string;
  guardianPhone: string;
  serviceName: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  serviceAddress: string;
  caregiverName: string;
  fundingType: 'TRUST_SPONSORED' | 'SPLIT_FUNDING' | 'SELF_FUNDED' | 'DONOR_SPONSORED';
  totalAmountPaise: number;
  subsidyAmountPaise: number;
  familyPayablePaise: number;
  paymentMode: 'CASH_ON_VISIT' | 'ONLINE_UPI' | 'TRUST_GRANT' | 'BANK_TRANSFER';
  paymentStatus: 'PAID' | 'PENDING' | 'SUBSIDIZED';
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
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

export interface AuditLog {
  id: string;
  adminUser: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

// Initial Live Database Records
let beneficiaries: Beneficiary[] = [
  {
    id: 'ben-1',
    fullName: 'Saraswathi Garu',
    category: 'SENIOR_CITIZEN',
    age: 68,
    gender: 'Female',
    relationship: 'Mother',
    primaryGuardian: 'Anita Sharma',
    primaryContact: '+91 98765 43210',
    address: 'Home - T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Walking support, knee pain care',
    status: 'ACTIVE'
  },
  {
    id: 'ben-2',
    fullName: 'Lakshmi Narasimha Rao',
    category: 'SENIOR_CITIZEN',
    age: 72,
    gender: 'Male',
    relationship: 'Father',
    primaryGuardian: 'Anita Sharma',
    primaryContact: '+91 98765 43210',
    address: 'Home - T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Dietary supervision, walking assistance',
    status: 'ACTIVE'
  },
  {
    id: 'ben-3',
    fullName: 'Raghav',
    category: 'PERSON_WITH_DISABILITY',
    age: 28,
    gender: 'Male',
    relationship: 'Son',
    primaryGuardian: 'Anita Sharma',
    primaryContact: '+91 98765 43210',
    address: 'Home - T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Wheelchair assistance, companion care',
    status: 'ACTIVE'
  },
  {
    id: 'ben-4',
    fullName: 'Anil Kumar',
    category: 'PERSON_WITH_DISABILITY',
    age: 34,
    gender: 'Male',
    relationship: 'Brother',
    primaryGuardian: 'K. Sridevi',
    primaryContact: '+91 94444 12345',
    address: 'Bhavani Nagar, Tirupati',
    accessibilityNeeds: 'Speech aid, assisted mobility',
    status: 'ACTIVE'
  }
];

let services = [
  { id: 'srv-1', name: 'Household Support', basePricePaise: 60000, duration: '2 hours' },
  { id: 'srv-2', name: 'Companionship & Care', basePricePaise: 40000, duration: '2 hours' },
  { id: 'srv-3', name: 'Medication Reminder', basePricePaise: 30000, duration: '1 hour' },
  { id: 'srv-4', name: 'Disability Support', basePricePaise: 50000, duration: '3 hours' },
  { id: 'srv-5', name: 'Cooking Assistance', basePricePaise: 45000, duration: '2 hours' },
  { id: 'srv-6', name: 'Grocery & Errands', basePricePaise: 35000, duration: '2 hours' }
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
    guardianPhone: '+91 98765 43210',
    serviceName: 'Household Support',
    scheduledDate: '2026-11-03',
    scheduledTimeSlot: '11:30 AM - 01:30 PM',
    serviceAddress: 'Home - T.T.D. Colony, Tirupati',
    caregiverName: 'Anitha',
    fundingType: 'TRUST_SPONSORED',
    totalAmountPaise: 60000,
    subsidyAmountPaise: 60000,
    familyPayablePaise: 0,
    paymentMode: 'TRUST_GRANT',
    paymentStatus: 'SUBSIDIZED',
    status: 'COMPLETED',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk-2',
    bookingNumber: 'THD-28940',
    beneficiaryId: 'ben-3',
    beneficiaryName: 'Raghav',
    guardianPhone: '+91 98765 43210',
    serviceName: 'Companionship & Care',
    scheduledDate: '2026-11-03',
    scheduledTimeSlot: '10:00 AM - 12:00 PM',
    serviceAddress: 'Home - T.T.D. Colony, Tirupati',
    caregiverName: 'P. Venkatesh',
    fundingType: 'TRUST_SPONSORED',
    totalAmountPaise: 40000,
    subsidyAmountPaise: 40000,
    familyPayablePaise: 0,
    paymentMode: 'TRUST_GRANT',
    paymentStatus: 'SUBSIDIZED',
    status: 'IN_PROGRESS',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk-3',
    bookingNumber: 'THD-28939',
    beneficiaryId: 'ben-2',
    beneficiaryName: 'Lakshmi Narasimha Rao',
    guardianPhone: '+91 98765 43210',
    serviceName: 'Medication Reminder',
    scheduledDate: '2026-11-03',
    scheduledTimeSlot: '09:00 AM - 10:00 AM',
    serviceAddress: 'Home - T.T.D. Colony, Tirupati',
    caregiverName: 'K. Ramesh',
    fundingType: 'SPLIT_FUNDING',
    totalAmountPaise: 30000,
    subsidyAmountPaise: 15000,
    familyPayablePaise: 15000,
    paymentMode: 'ONLINE_UPI',
    paymentStatus: 'PAID',
    status: 'COMPLETED',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk-4',
    bookingNumber: 'THD-28938',
    beneficiaryId: 'ben-4',
    beneficiaryName: 'Anil Kumar',
    guardianPhone: '+91 94444 12345',
    serviceName: 'Disability Support',
    scheduledDate: '2026-11-03',
    scheduledTimeSlot: '04:00 PM - 07:00 PM',
    serviceAddress: 'Bhavani Nagar, Tirupati',
    caregiverName: 'P. Venkatesh',
    fundingType: 'SELF_FUNDED',
    totalAmountPaise: 50000,
    subsidyAmountPaise: 0,
    familyPayablePaise: 50000,
    paymentMode: 'CASH_ON_VISIT',
    paymentStatus: 'PENDING',
    status: 'SCHEDULED',
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
    documentsProvided: 'Aadhaar, BPL Ration Card, Medical Prescriptions',
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

let auditLogs: AuditLog[] = [
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

// 1. Live Overview Analytics Data (Derived strictly from live records)
app.get('/api/v1/analytics', (req: Request, res: Response) => {
  const totalBeneficiaries = beneficiaries.length;
  const activeCaregivers = caregivers.length;
  const totalBookings = bookings.length;
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
  
  // Total Revenue & Sponsored value computed from actual database numbers
  const totalRevenuePaise = bookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.familyPayablePaise : 0), 0);
  const totalSponsoredPaise = bookings.reduce((sum, b) => sum + b.subsidyAmountPaise, 0);

  // Service distribution strictly calculated from actual bookings
  const serviceDistribution: Record<string, number> = {};
  bookings.forEach(b => {
    serviceDistribution[b.serviceName] = (serviceDistribution[b.serviceName] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      totalBeneficiaries,
      activeCaregivers,
      totalBookings,
      completedServices: completedBookings,
      revenueInr: Math.round(totalRevenuePaise / 100),
      sponsoredValueInr: Math.round(totalSponsoredPaise / 100),
      sponsoredServicesCount: bookings.filter(b => b.fundingType !== 'SELF_FUNDED').length,
      completionRate: totalBookings > 0 ? Math.round((completedBookings / totalBookings) * 100) : 0,
      activeSosCount: sosAlerts.filter(s => s.status !== 'RESOLVED').length,
      serviceDistribution,
      recentBookings: bookings.slice(0, 5)
    }
  });
});

// 2. Beneficiaries Search & Auto-Suggest
app.get('/api/v1/beneficiaries/search', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  if (!query) {
    return res.json({ success: true, results: beneficiaries.slice(0, 10) });
  }

  const results = beneficiaries.filter(b => 
    b.fullName.toLowerCase().includes(query) ||
    b.primaryGuardian.toLowerCase().includes(query) ||
    b.primaryContact.includes(query) ||
    b.address.toLowerCase().includes(query)
  );

  res.json({ success: true, results });
});

app.get('/api/v1/beneficiaries', (req: Request, res: Response) => {
  res.json({ success: true, beneficiaries });
});

app.post('/api/v1/beneficiaries', (req: Request, res: Response) => {
  const { fullName, category, age, gender, relationship, primaryGuardian, primaryContact, address, accessibilityNeeds } = req.body;
  const newBen: Beneficiary = {
    id: `ben-${Date.now()}`,
    fullName,
    category: category || 'SENIOR_CITIZEN',
    age: Number(age) || 60,
    gender: gender || 'Other',
    relationship: relationship || 'Family',
    primaryGuardian: primaryGuardian || 'Anita Sharma',
    primaryContact: primaryContact || '+91 98765 43210',
    address: address || 'Tirupati',
    accessibilityNeeds: accessibilityNeeds || 'Standard Assisted Living',
    status: 'ACTIVE'
  };
  beneficiaries.unshift(newBen);

  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    adminUser: 'Raju Kumar (Super Admin)',
    action: 'CREATE',
    module: 'Beneficiaries',
    details: `Registered new beneficiary ${newBen.fullName}`,
    timestamp: new Date().toLocaleString()
  });

  res.status(201).json({ success: true, beneficiary: newBen });
});

// 3. Bookings CRUD with Search, Payment Mode & Payment Status
app.get('/api/v1/bookings', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  if (!query) {
    return res.json({ success: true, bookings });
  }

  const filtered = bookings.filter(b => 
    b.bookingNumber.toLowerCase().includes(query) ||
    b.beneficiaryName.toLowerCase().includes(query) ||
    b.serviceName.toLowerCase().includes(query) ||
    b.caregiverName.toLowerCase().includes(query) ||
    b.paymentStatus.toLowerCase().includes(query) ||
    b.status.toLowerCase().includes(query)
  );

  res.json({ success: true, bookings: filtered });
});

app.post('/api/v1/bookings', (req: Request, res: Response) => {
  const { 
    beneficiaryName, 
    serviceName, 
    scheduledDate, 
    scheduledTimeSlot, 
    serviceAddress, 
    fundingType, 
    caregiverName,
    paymentMode,
    paymentStatus
  } = req.body;

  const targetBen = beneficiaries.find(b => b.fullName.toLowerCase() === (beneficiaryName || '').toLowerCase()) || beneficiaries[0];
  const targetSrv = services.find(s => s.name === serviceName) || services[0];

  const totalAmountPaise = targetSrv.basePricePaise;
  let subsidyAmountPaise = 0;
  if (fundingType === 'TRUST_SPONSORED' || fundingType === 'DONOR_SPONSORED') {
    subsidyAmountPaise = totalAmountPaise;
  } else if (fundingType === 'SPLIT_FUNDING') {
    subsidyAmountPaise = Math.round(totalAmountPaise * 0.5);
  }

  const familyPayablePaise = totalAmountPaise - subsidyAmountPaise;

  const newBooking: Booking = {
    id: `bk-${Date.now()}`,
    bookingNumber: `THD-${Math.floor(20000 + Math.random() * 90000)}`,
    beneficiaryId: targetBen.id,
    beneficiaryName: targetBen.fullName,
    guardianPhone: targetBen.primaryContact,
    serviceName: targetSrv.name,
    scheduledDate: scheduledDate || new Date().toISOString().split('T')[0],
    scheduledTimeSlot: scheduledTimeSlot || '10:00 AM - 12:00 PM',
    serviceAddress: serviceAddress || targetBen.address,
    caregiverName: caregiverName || 'Anitha',
    fundingType: fundingType || 'TRUST_SPONSORED',
    totalAmountPaise,
    subsidyAmountPaise,
    familyPayablePaise,
    paymentMode: paymentMode || (subsidyAmountPaise === totalAmountPaise ? 'TRUST_GRANT' : 'ONLINE_UPI'),
    paymentStatus: paymentStatus || (subsidyAmountPaise === totalAmountPaise ? 'SUBSIDIZED' : 'PENDING'),
    status: 'SCHEDULED',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);

  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    adminUser: 'Raju Kumar (Super Admin)',
    action: 'CREATE_BOOKING',
    module: 'Bookings',
    details: `Created booking ${newBooking.bookingNumber} for ${newBooking.beneficiaryName} (${newBooking.serviceName})`,
    timestamp: new Date().toLocaleString()
  });

  res.status(201).json({ success: true, booking: newBooking });
});

// Update Booking Status / Payment Status
app.patch('/api/v1/bookings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus, paymentMode, caregiverName } = req.body;
  const bk = bookings.find(b => b.id === id);
  if (!bk) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  if (status) bk.status = status;
  if (paymentStatus) bk.paymentStatus = paymentStatus;
  if (paymentMode) bk.paymentMode = paymentMode;
  if (caregiverName) bk.caregiverName = caregiverName;

  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    adminUser: 'Raju Kumar (Super Admin)',
    action: 'UPDATE_BOOKING',
    module: 'Bookings',
    details: `Updated booking ${bk.bookingNumber} - Status: ${bk.status}, Payment: ${bk.paymentStatus}`,
    timestamp: new Date().toLocaleString()
  });

  res.json({ success: true, booking: bk });
});

// Delete / Cancel Booking
app.delete('/api/v1/bookings/:id', (req: Request, res: Response) => {
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    const deleted = bookings.splice(index, 1)[0];
    auditLogs.unshift({
      id: `aud-${Date.now()}`,
      adminUser: 'Raju Kumar (Super Admin)',
      action: 'CANCEL_BOOKING',
      module: 'Bookings',
      details: `Removed booking ${deleted.bookingNumber}`,
      timestamp: new Date().toLocaleString()
    });
  }
  res.json({ success: true, message: 'Booking removed' });
});

// 4. Caregivers Endpoints
app.get('/api/v1/caregivers', (req: Request, res: Response) => {
  res.json({ success: true, caregivers });
});

app.post('/api/v1/caregivers', (req: Request, res: Response) => {
  const { fullName, phone, employmentType, skills, zone } = req.body;
  const newCg: Caregiver = {
    id: `cg-${Date.now()}`,
    fullName,
    phone: phone || '+91 98765 00000',
    employmentType: employmentType || 'SALARIED',
    verificationStatus: 'VERIFIED',
    rating: 5.0,
    activeAssignments: 0,
    skills: skills ? skills.split(',').map((s: string) => s.trim()) : ['General Elder Care'],
    zone: zone || 'Tirupati Urban'
  };
  caregivers.unshift(newCg);
  res.status(201).json({ success: true, caregiver: newCg });
});

// 5. Sponsorship Endpoints
app.get('/api/v1/sponsorship', (req: Request, res: Response) => {
  res.json({ success: true, applications: sponsorshipApplications });
});

app.patch('/api/v1/sponsorship/:id/decision', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const appItem = sponsorshipApplications.find(a => a.id === id);
  if (appItem) {
    appItem.status = status;
    auditLogs.unshift({
      id: `aud-${Date.now()}`,
      adminUser: 'Raju Kumar (Super Admin)',
      action: status === 'APPROVED' ? 'APPROVAL' : 'REJECTION',
      module: 'Sponsorship',
      details: `${status} subsidy application ${appItem.applicationRef} for ${appItem.beneficiaryName}`,
      timestamp: new Date().toLocaleString()
    });
  }
  res.json({ success: true, application: appItem });
});

// 6. SOS Operations
app.get('/api/v1/sos/queue', (req: Request, res: Response) => {
  res.json({ success: true, queue: sosAlerts });
});

app.patch('/api/v1/sos/:id/resolve', (req: Request, res: Response) => {
  const { id } = req.params;
  const alert = sosAlerts.find(a => a.id === id);
  if (alert) {
    alert.status = 'RESOLVED';
    auditLogs.unshift({
      id: `aud-${Date.now()}`,
      adminUser: 'Raju Kumar (Super Admin)',
      action: 'RESOLVE_SOS',
      module: 'SOS Queue',
      details: `Resolved emergency alert ${alert.id} for ${alert.beneficiaryName}`,
      timestamp: new Date().toLocaleString()
    });
  }
  res.json({ success: true, alert });
});

// 7. Audit Logs
app.get('/api/v1/audit-logs', (req: Request, res: Response) => {
  res.json({ success: true, auditLogs });
});

// Health Endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Thodu API Engine',
    port: PORT,
    timestamp: new Date().toISOString(),
    organization: 'Sri Divyang Seva Kendram Trust'
  });
});

app.listen(PORT, () => {
  console.log(`[Thodu API] Running on port ${PORT}`);
  console.log(`[Thodu API] Live destination: https://thodu.sriddha.com (Port ${PORT})`);
});
