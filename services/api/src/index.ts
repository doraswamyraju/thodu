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
  beneficiaryAge: number;
  beneficiaryCategory: 'SENIOR_CITIZEN' | 'PERSON_WITH_DISABILITY';
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

export interface AuditLog {
  id: string;
  adminUser: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
}

// Initial Database Records matching the live UI reference
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
    address: 'T.T.D. Colony, Tirupati',
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
    address: 'T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Dietary supervision, walking assistance',
    status: 'ACTIVE'
  },
  {
    id: 'ben-3',
    fullName: 'Raghav',
    category: 'PERSON_WITH_DISABILITY',
    age: 25,
    gender: 'Male',
    relationship: 'Son',
    primaryGuardian: 'Anita Sharma',
    primaryContact: '+91 98765 43210',
    address: 'T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Wheelchair assistance, companion care',
    status: 'ACTIVE'
  },
  {
    id: 'ben-4',
    fullName: 'Anil Kumar',
    category: 'PERSON_WITH_DISABILITY',
    age: 38,
    gender: 'Male',
    relationship: 'Brother',
    primaryGuardian: 'K. Sridevi',
    primaryContact: '+91 94444 12345',
    address: 'T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Speech aid, assisted mobility',
    status: 'ACTIVE'
  }
];

let services = [
  { id: 'srv-1', name: 'Household Support', basePricePaise: 60000, duration: '2 hours' },
  { id: 'srv-2', name: 'Cooking Assistance', basePricePaise: 45000, duration: '2 hours' },
  { id: 'srv-3', name: 'Companion Care', basePricePaise: 40000, duration: '2 hours' },
  { id: 'srv-4', name: 'Disability Support', basePricePaise: 50000, duration: '3 hours' },
  { id: 'srv-5', name: 'Medication Reminder', basePricePaise: 30000, duration: '1 hour' },
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

// Live Initial Bookings exactly matching user reference board
let bookings: Booking[] = [
  {
    id: 'bk-1',
    bookingNumber: 'TH-8901',
    beneficiaryId: 'ben-1',
    beneficiaryName: 'Saraswathi Garu',
    beneficiaryAge: 68,
    beneficiaryCategory: 'SENIOR_CITIZEN',
    guardianPhone: '+91 98765 43210',
    serviceName: 'Household Support',
    scheduledDate: 'Mar 10, 2026',
    scheduledTimeSlot: '10:00 AM - 12:00 PM',
    serviceAddress: 'T.T.D. Colony, Tirupati',
    caregiverName: 'Anitha',
    fundingType: 'Trust Sponsored',
    totalAmountPaise: 60000,
    subsidyAmountPaise: 60000,
    familyPayablePaise: 0,
    paymentMode: 'TRUST_GRANT',
    paymentStatus: 'SUBSIDIZED',
    status: 'In Progress',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk-2',
    bookingNumber: 'TH-8902',
    beneficiaryId: 'ben-2',
    beneficiaryName: 'Lakshmi Narasimha Rao',
    beneficiaryAge: 72,
    beneficiaryCategory: 'SENIOR_CITIZEN',
    guardianPhone: '+91 98765 43210',
    serviceName: 'Cooking Assistance',
    scheduledDate: 'Mar 11, 2026',
    scheduledTimeSlot: '11:00 AM - 1:00 PM',
    serviceAddress: 'T.T.D. Colony, Tirupati',
    caregiverName: 'K. Ramesh',
    fundingType: 'Family Paid',
    totalAmountPaise: 45000,
    subsidyAmountPaise: 22500,
    familyPayablePaise: 22500,
    paymentMode: 'ONLINE_UPI',
    paymentStatus: 'PAID',
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk-3',
    bookingNumber: 'TH-8903',
    beneficiaryId: 'ben-3',
    beneficiaryName: 'Raghav',
    beneficiaryAge: 25,
    beneficiaryCategory: 'PERSON_WITH_DISABILITY',
    guardianPhone: '+91 98765 43210',
    serviceName: 'Companion Care',
    scheduledDate: 'Mar 12, 2026',
    scheduledTimeSlot: '9:00 AM - 11:00 AM',
    serviceAddress: 'T.T.D. Colony, Tirupati',
    caregiverName: 'Unassigned',
    fundingType: 'Partially Sponsored',
    totalAmountPaise: 40000,
    subsidyAmountPaise: 30000,
    familyPayablePaise: 10000,
    paymentMode: 'ONLINE_UPI',
    paymentStatus: 'PENDING',
    status: 'Awaiting Assignment',
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk-4',
    bookingNumber: 'TH-8904',
    beneficiaryId: 'ben-4',
    beneficiaryName: 'Anil Kumar',
    beneficiaryAge: 38,
    beneficiaryCategory: 'PERSON_WITH_DISABILITY',
    guardianPhone: '+91 94444 12345',
    serviceName: 'Disability Support',
    scheduledDate: 'Mar 12, 2026',
    scheduledTimeSlot: '4:00 PM - 5:30 PM',
    serviceAddress: 'T.T.D. Colony, Tirupati',
    caregiverName: 'S. Prasad',
    fundingType: 'Trust Sponsored',
    totalAmountPaise: 50000,
    subsidyAmountPaise: 50000,
    familyPayablePaise: 0,
    paymentMode: 'TRUST_GRANT',
    paymentStatus: 'SUBSIDIZED',
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
    adminUser: 'Trust Operations Admin',
    action: 'APPROVAL',
    module: 'Sponsorship',
    details: 'Approved 100% subsidy for Saraswathi Garu under Elder Care Programme',
    timestamp: '2026-11-02 16:30'
  },
  {
    id: 'aud-2',
    adminUser: 'Trust Operations Admin',
    action: 'DISPATCH',
    module: 'Bookings',
    details: 'Dispatched Anitha for Booking TH-8901',
    timestamp: '2026-11-03 11:00'
  }
];

// ==========================================
// API ROUTES
// ==========================================

// 1. Live Overview Analytics Data
app.get('/api/v1/analytics', (req: Request, res: Response) => {
  const totalBookings = bookings.length;
  const awaitingAssignment = bookings.filter(b => b.status === 'Awaiting Assignment' || b.caregiverName === 'Unassigned').length;
  const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
  const inProgress = bookings.filter(b => b.status === 'In Progress').length;
  const scheduled = bookings.filter(b => b.status === 'Scheduled').length;
  const completed = bookings.filter(b => b.status === 'Completed').length;

  const totalRevenuePaise = bookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.familyPayablePaise : 0), 0);
  const totalSponsoredPaise = bookings.reduce((sum, b) => sum + b.subsidyAmountPaise, 0);

  const serviceDistribution: Record<string, number> = {};
  bookings.forEach(b => {
    serviceDistribution[b.serviceName] = (serviceDistribution[b.serviceName] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      totalBeneficiaries: beneficiaries.length,
      activeCaregivers: caregivers.length,
      totalBookings,
      awaitingAssignment,
      confirmed,
      inProgress,
      scheduled,
      completed,
      revenueInr: Math.round(totalRevenuePaise / 100),
      sponsoredValueInr: Math.round(totalSponsoredPaise / 100),
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
    return res.json({ success: true, results: beneficiaries });
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
    address: address || 'T.T.D. Colony, Tirupati',
    accessibilityNeeds: accessibilityNeeds || 'Standard Assisted Living',
    status: 'ACTIVE'
  };
  beneficiaries.unshift(newBen);

  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    adminUser: 'Trust Operations Admin',
    action: 'CREATE',
    module: 'Beneficiaries',
    details: `Registered new beneficiary ${newBen.fullName}`,
    timestamp: new Date().toLocaleString()
  });

  res.status(201).json({ success: true, beneficiary: newBen });
});

// 3. Bookings CRUD
app.get('/api/v1/bookings', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  const statusFilter = (req.query.status as string || 'ALL');
  const serviceFilter = (req.query.service as string || 'ALL');
  const fundingFilter = (req.query.funding as string || 'ALL');

  let filtered = bookings;

  if (query) {
    filtered = filtered.filter(b => 
      b.bookingNumber.toLowerCase().includes(query) ||
      b.beneficiaryName.toLowerCase().includes(query) ||
      b.serviceName.toLowerCase().includes(query) ||
      b.caregiverName.toLowerCase().includes(query) ||
      b.serviceAddress.toLowerCase().includes(query)
    );
  }

  if (statusFilter !== 'ALL') {
    filtered = filtered.filter(b => b.status === statusFilter);
  }

  if (serviceFilter !== 'ALL') {
    filtered = filtered.filter(b => b.serviceName === serviceFilter);
  }

  if (fundingFilter !== 'ALL') {
    filtered = filtered.filter(b => b.fundingType === fundingFilter);
  }

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
    paymentStatus,
    status
  } = req.body;

  const targetBen = beneficiaries.find(b => b.fullName.toLowerCase() === (beneficiaryName || '').toLowerCase()) || beneficiaries[0];
  const targetSrv = services.find(s => s.name === serviceName) || services[0];

  const totalAmountPaise = targetSrv.basePricePaise;
  let subsidyAmountPaise = 0;
  if (fundingType === 'Trust Sponsored' || fundingType === 'Donor Sponsored') {
    subsidyAmountPaise = totalAmountPaise;
  } else if (fundingType === 'Partially Sponsored') {
    subsidyAmountPaise = Math.round(totalAmountPaise * 0.75);
  }

  const familyPayablePaise = totalAmountPaise - subsidyAmountPaise;
  const isAssigned = caregiverName && caregiverName !== 'Unassigned';

  const newBooking: Booking = {
    id: `bk-${Date.now()}`,
    bookingNumber: `TH-${Math.floor(8900 + bookings.length + 1)}`,
    beneficiaryId: targetBen.id,
    beneficiaryName: targetBen.fullName,
    beneficiaryAge: targetBen.age,
    beneficiaryCategory: targetBen.category,
    guardianPhone: targetBen.primaryContact,
    serviceName: targetSrv.name,
    scheduledDate: scheduledDate || 'Mar 15, 2026',
    scheduledTimeSlot: scheduledTimeSlot || '10:00 AM - 12:00 PM',
    serviceAddress: serviceAddress || targetBen.address,
    caregiverName: isAssigned ? caregiverName : 'Unassigned',
    fundingType: fundingType || 'Trust Sponsored',
    totalAmountPaise,
    subsidyAmountPaise,
    familyPayablePaise,
    paymentMode: paymentMode || (subsidyAmountPaise === totalAmountPaise ? 'TRUST_GRANT' : 'ONLINE_UPI'),
    paymentStatus: paymentStatus || (subsidyAmountPaise === totalAmountPaise ? 'SUBSIDIZED' : 'PENDING'),
    status: status || (isAssigned ? 'Confirmed' : 'Awaiting Assignment'),
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);

  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    adminUser: 'Trust Operations Admin',
    action: 'CREATE_BOOKING',
    module: 'Bookings',
    details: `Created booking ${newBooking.bookingNumber} for ${newBooking.beneficiaryName}`,
    timestamp: new Date().toLocaleString()
  });

  res.status(201).json({ success: true, booking: newBooking });
});

// Update Booking
app.patch('/api/v1/bookings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, paymentStatus, paymentMode, caregiverName, serviceName, scheduledDate, scheduledTimeSlot, fundingType } = req.body;
  const bk = bookings.find(b => b.id === id);
  if (!bk) {
    return res.status(404).json({ error: 'Booking not found' });
  }

  if (status) bk.status = status;
  if (paymentStatus) bk.paymentStatus = paymentStatus;
  if (paymentMode) bk.paymentMode = paymentMode;
  if (caregiverName) {
    bk.caregiverName = caregiverName;
    if (bk.status === 'Awaiting Assignment' && caregiverName !== 'Unassigned') {
      bk.status = 'Confirmed';
    }
  }
  if (serviceName) bk.serviceName = serviceName;
  if (scheduledDate) bk.scheduledDate = scheduledDate;
  if (scheduledTimeSlot) bk.scheduledTimeSlot = scheduledTimeSlot;
  if (fundingType) bk.fundingType = fundingType;

  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    adminUser: 'Trust Operations Admin',
    action: 'UPDATE_BOOKING',
    module: 'Bookings',
    details: `Updated booking ${bk.bookingNumber} (${bk.status})`,
    timestamp: new Date().toLocaleString()
  });

  res.json({ success: true, booking: bk });
});

// Delete Booking
app.delete('/api/v1/bookings/:id', (req: Request, res: Response) => {
  const index = bookings.findIndex(b => b.id === req.params.id);
  if (index !== -1) {
    const deleted = bookings.splice(index, 1)[0];
    auditLogs.unshift({
      id: `aud-${Date.now()}`,
      adminUser: 'Trust Operations Admin',
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
      adminUser: 'Trust Operations Admin',
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
      adminUser: 'Trust Operations Admin',
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
