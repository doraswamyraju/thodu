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

export interface Caregiver {
  id: string;
  refNumber: string;
  fullName: string;
  phone: string;
  employmentType: 'Salaried' | 'Freelance / Gig';
  verificationStatus: 'Verified' | 'Pending';
  rating: number;
  ratingReviewsCount: number;
  activeAssignments: number;
  skills: string[];
  zone: string;
  availability: 'Available' | 'On Duty' | 'Off Duty';
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
  broadcasted: boolean;
  createdAt: string;
}

// 1. Live Caregivers Database (Matching Image 1)
let caregivers: Caregiver[] = [
  {
    id: 'cg-1',
    refNumber: 'TH-CAR-1001',
    fullName: 'Anitha',
    phone: '+91 98765 11111',
    employmentType: 'Salaried',
    verificationStatus: 'Verified',
    rating: 4.8,
    ratingReviewsCount: 126,
    activeAssignments: 2,
    skills: ['Elder Companionship', 'Cooking', 'Mobility Support'],
    zone: 'Tirupati Urban',
    availability: 'Available',
    avatarBg: '#E8F5E9'
  },
  {
    id: 'cg-2',
    refNumber: 'TH-CAR-1002',
    fullName: 'K. Ramesh',
    phone: '+91 98765 22222',
    employmentType: 'Freelance / Gig',
    verificationStatus: 'Verified',
    rating: 4.9,
    ratingReviewsCount: 214,
    activeAssignments: 1,
    skills: ['Cooking', 'Errands', 'Medication Reminders'],
    zone: 'T.T.D. Colony',
    availability: 'On Duty',
    avatarBg: '#E1F5FE'
  },
  {
    id: 'cg-3',
    refNumber: 'TH-CAR-1003',
    fullName: 'S. Prasad',
    phone: '+91 98765 44444',
    employmentType: 'Salaried',
    verificationStatus: 'Verified',
    rating: 4.9,
    ratingReviewsCount: 187,
    activeAssignments: 1,
    skills: ['Disability Support', 'Mobility Assistance'],
    zone: 'Tirupati Urban',
    availability: 'Available',
    avatarBg: '#FFF8E6'
  },
  {
    id: 'cg-4',
    refNumber: 'TH-CAR-1004',
    fullName: 'P. Venkatesh',
    phone: '+91 98765 33333',
    employmentType: 'Salaried',
    verificationStatus: 'Verified',
    rating: 4.7,
    ratingReviewsCount: 98,
    activeAssignments: 1,
    skills: ['Disability Care', 'Physiotherapy Assist'],
    zone: 'Tirupati West',
    availability: 'Available',
    avatarBg: '#EDE7F6'
  }
];

// 2. Live Beneficiaries Database
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

// 3. Live Bookings Database (Matching Reference Board TH-8901 to TH-8904)
let bookings: Booking[] = [
  {
    id: 'bk-1',
    bookingNumber: 'TH-8901',
    beneficiaryId: 'ben-1',
    beneficiaryName: 'Saraswathi Garu',
    beneficiaryAge: 68,
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
    broadcasted: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk-2',
    bookingNumber: 'TH-8902',
    beneficiaryId: 'ben-2',
    beneficiaryName: 'Lakshmi Narasimha Rao',
    beneficiaryAge: 72,
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
    broadcasted: false,
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk-3',
    bookingNumber: 'TH-8903',
    beneficiaryId: 'ben-3',
    beneficiaryName: 'Raghav',
    beneficiaryAge: 25,
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
    broadcasted: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'bk-4',
    bookingNumber: 'TH-8904',
    beneficiaryId: 'ben-4',
    beneficiaryName: 'Anil Kumar',
    beneficiaryAge: 38,
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
    broadcasted: false,
    createdAt: new Date().toISOString()
  }
];

let sponsorshipApplications = [
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

let sosAlerts = [
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
    action: 'BROADCAST',
    module: 'Bookings',
    details: 'Broadcasted booking TH-8903 (Companion Care) to eligible freelance caregivers in Tirupati',
    timestamp: '2026-11-03 10:15'
  },
  {
    id: 'aud-2',
    adminUser: 'Raju Kumar (Super Admin)',
    action: 'ASSIGNMENT',
    module: 'Bookings',
    details: 'Assigned Anitha to booking TH-8901 (Household Support)',
    timestamp: '2026-11-03 11:00'
  }
];

// ==========================================
// API ROUTES
// ==========================================

// 1. Live Analytics
app.get('/api/v1/analytics', (req: Request, res: Response) => {
  const totalBookings = bookings.length;
  const awaitingAssignment = bookings.filter(b => b.status === 'Awaiting Assignment' || b.caregiverName === 'Unassigned').length;
  const confirmed = bookings.filter(b => b.status === 'Confirmed').length;
  const inProgress = bookings.filter(b => b.status === 'In Progress').length;
  const scheduled = bookings.filter(b => b.status === 'Scheduled').length;
  const completed = bookings.filter(b => b.status === 'Completed').length;

  const totalRevenuePaise = bookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.familyPayablePaise : 0), 0);
  const totalSponsoredPaise = bookings.reduce((sum, b) => sum + b.subsidyAmountPaise, 0);

  // Workforce stats
  const totalCaregivers = caregivers.length;
  const salariedStaff = caregivers.filter(c => c.employmentType === 'Salaried').length;
  const freelanceGig = caregivers.filter(c => c.employmentType === 'Freelance / Gig').length;
  const verifiedCaregivers = caregivers.filter(c => c.verificationStatus === 'Verified').length;
  const onDutyCount = caregivers.filter(c => c.availability === 'On Duty').length;
  const availableCount = caregivers.filter(c => c.availability === 'Available').length;

  res.json({
    success: true,
    data: {
      totalBeneficiaries: beneficiaries.length,
      seniorCitizens: beneficiaries.filter(b => b.category === 'Senior Citizen').length,
      personsWithDisabilities: beneficiaries.filter(b => b.category === 'Person with Disability').length,
      totalCaregivers,
      salariedStaff,
      salariedStaffPct: totalCaregivers > 0 ? Math.round((salariedStaff / totalCaregivers) * 100) : 0,
      freelanceGig,
      freelanceGigPct: totalCaregivers > 0 ? Math.round((freelanceGig / totalCaregivers) * 100) : 0,
      verifiedCaregivers,
      verifiedCaregiversPct: totalCaregivers > 0 ? Math.round((verifiedCaregivers / totalCaregivers) * 100) : 0,
      onDutyCount,
      availableCount,
      totalBookings,
      awaitingAssignment,
      confirmed,
      inProgress,
      scheduled,
      completed,
      revenueInr: Math.round(totalRevenuePaise / 100),
      sponsoredValueInr: Math.round(totalSponsoredPaise / 100),
      activeSosCount: sosAlerts.filter(s => s.status !== 'RESOLVED').length
    }
  });
});

// 2. Caregivers CRUD
app.get('/api/v1/caregivers', (req: Request, res: Response) => {
  const query = (req.query.q as string || '').toLowerCase().trim();
  const employment = (req.query.employment as string || 'ALL');
  const zone = (req.query.zone as string || 'ALL');
  const availability = (req.query.availability as string || 'ALL');
  const verification = (req.query.verification as string || 'ALL');

  let filtered = caregivers;

  if (query) {
    filtered = filtered.filter(c => 
      c.fullName.toLowerCase().includes(query) ||
      c.refNumber.toLowerCase().includes(query) ||
      c.phone.includes(query) ||
      c.zone.toLowerCase().includes(query)
    );
  }

  if (employment !== 'ALL') {
    filtered = filtered.filter(c => c.employmentType === employment);
  }
  if (zone !== 'ALL') {
    filtered = filtered.filter(c => c.zone === zone);
  }
  if (availability !== 'ALL') {
    filtered = filtered.filter(c => c.availability === availability);
  }
  if (verification !== 'ALL') {
    filtered = filtered.filter(c => c.verificationStatus === verification);
  }

  res.json({ success: true, caregivers: filtered });
});

app.post('/api/v1/caregivers', (req: Request, res: Response) => {
  const { fullName, phone, employmentType, skills, zone } = req.body;
  const newCg: Caregiver = {
    id: `cg-${Date.now()}`,
    refNumber: `TH-CAR-${Math.floor(1000 + caregivers.length + 1)}`,
    fullName,
    phone: phone || '+91 98765 00000',
    employmentType: employmentType || 'Salaried',
    verificationStatus: 'Verified',
    rating: 5.0,
    ratingReviewsCount: 1,
    activeAssignments: 0,
    skills: skills ? skills.split(',').map((s: string) => s.trim()) : ['General Elder Care'],
    zone: zone || 'Tirupati Urban',
    availability: 'Available',
    avatarBg: '#E8F5E9'
  };
  caregivers.unshift(newCg);
  res.status(201).json({ success: true, caregiver: newCg });
});

// 3. Bookings CRUD + Assign & Broadcast Endpoints
app.get('/api/v1/bookings', (req: Request, res: Response) => {
  res.json({ success: true, bookings });
});

// Assign Caregiver directly
app.patch('/api/v1/bookings/:id/assign', (req: Request, res: Response) => {
  const { id } = req.params;
  const { caregiverName } = req.body;
  const bk = bookings.find(b => b.id === id);
  if (!bk) return res.status(404).json({ error: 'Booking not found' });

  bk.caregiverName = caregiverName;
  bk.status = caregiverName === 'Unassigned' ? 'Awaiting Assignment' : 'Confirmed';
  bk.broadcasted = false;

  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    adminUser: 'Raju Kumar (Super Admin)',
    action: 'ASSIGNMENT',
    module: 'Bookings',
    details: `Assigned ${caregiverName} to booking ${bk.bookingNumber}`,
    timestamp: new Date().toLocaleString()
  });

  res.json({ success: true, booking: bk });
});

// Broadcast Job to Freelancers / Gig Caregivers
app.post('/api/v1/bookings/:id/broadcast', (req: Request, res: Response) => {
  const { id } = req.params;
  const bk = bookings.find(b => b.id === id);
  if (!bk) return res.status(404).json({ error: 'Booking not found' });

  bk.broadcasted = true;
  bk.caregiverName = 'Unassigned';
  bk.status = 'Awaiting Assignment';

  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    adminUser: 'Raju Kumar (Super Admin)',
    action: 'BROADCAST',
    module: 'Bookings',
    details: `Broadcasted booking ${bk.bookingNumber} (${bk.serviceName}) to all eligible gig caregivers in ${bk.serviceAddress}`,
    timestamp: new Date().toLocaleString()
  });

  res.json({ success: true, message: 'Booking broadcasted to all eligible caregivers!', booking: bk });
});

app.post('/api/v1/bookings', (req: Request, res: Response) => {
  const { beneficiaryName, serviceName, scheduledDate, scheduledTimeSlot, serviceAddress, fundingType, caregiverName, paymentMode, paymentStatus, status } = req.body;
  const targetBen = beneficiaries.find(b => b.fullName.toLowerCase() === (beneficiaryName || '').toLowerCase()) || beneficiaries[0];

  const newBooking: Booking = {
    id: `bk-${Date.now()}`,
    bookingNumber: `TH-${Math.floor(8900 + bookings.length + 1)}`,
    beneficiaryId: targetBen.id,
    beneficiaryName: targetBen.fullName,
    beneficiaryAge: targetBen.age,
    guardianPhone: targetBen.primaryContact,
    serviceName: serviceName || 'Household Support',
    scheduledDate: scheduledDate || 'Mar 15, 2026',
    scheduledTimeSlot: scheduledTimeSlot || '10:00 AM - 12:00 PM',
    serviceAddress: serviceAddress || targetBen.address,
    caregiverName: caregiverName || 'Unassigned',
    fundingType: fundingType || 'Trust Sponsored',
    totalAmountPaise: 60000,
    subsidyAmountPaise: fundingType === 'Trust Sponsored' ? 60000 : 0,
    familyPayablePaise: fundingType === 'Trust Sponsored' ? 0 : 60000,
    paymentMode: paymentMode || 'TRUST_GRANT',
    paymentStatus: paymentStatus || 'SUBSIDIZED',
    status: status || (caregiverName && caregiverName !== 'Unassigned' ? 'Confirmed' : 'Awaiting Assignment'),
    broadcasted: false,
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});

app.delete('/api/v1/bookings/:id', (req: Request, res: Response) => {
  bookings = bookings.filter(b => b.id !== req.params.id);
  res.json({ success: true, message: 'Booking removed' });
});

// 4. Beneficiaries Endpoints
app.get('/api/v1/beneficiaries', (req: Request, res: Response) => {
  res.json({ success: true, beneficiaries });
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
    accessibilityNeeds: accessibilityNeeds || 'Standard Care',
    status: 'Active',
    avatarBg: '#E8F5E9'
  };
  beneficiaries.unshift(newBen);
  res.status(201).json({ success: true, beneficiary: newBen });
});

// 5. Sponsorship & SOS Endpoints
app.get('/api/v1/sponsorship', (req: Request, res: Response) => {
  res.json({ success: true, applications: sponsorshipApplications });
});

app.get('/api/v1/sos/queue', (req: Request, res: Response) => {
  res.json({ success: true, queue: sosAlerts });
});

app.get('/api/v1/audit-logs', (req: Request, res: Response) => {
  res.json({ success: true, auditLogs });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', service: 'Thodu API Engine' });
});

app.listen(PORT, () => {
  console.log(`[Thodu API] Running on port ${PORT}`);
});
