import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { 
  LoginRequestSchema, 
  CreateBookingRequestSchema, 
  TriggerSosRequestSchema 
} from './contracts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5089;
const JWT_SECRET = process.env.JWT_SECRET || 'thodu_super_secret_jwt_key_2026';

app.use(cors());
app.use(express.json());

// In-Memory Database for Live Operations
let beneficiaries = [
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
    accessibilityNeeds: 'Walking support, knee pain care, gentle handling',
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
    accessibilityNeeds: 'Wheelchair assistance, companion support',
    status: 'ACTIVE'
  }
];

let services = [
  {
    id: 'srv-1',
    name: 'Household Support',
    category: 'Household',
    duration: '2 hours',
    basePricePaise: 60000,
    active: true,
    description: 'Light housekeeping, laundry, home organization and daily household tasks.'
  },
  {
    id: 'srv-2',
    name: 'Cooking Assistance',
    category: 'Nutrition',
    duration: '2 hours',
    basePricePaise: 45000,
    active: true,
    description: 'Nutritious meal preparation according to dietary preferences.'
  },
  {
    id: 'srv-3',
    name: 'Medication Reminders',
    category: 'Healthcare Aid',
    duration: '1 hour',
    basePricePaise: 30000,
    active: true,
    description: 'Timely prompts and tracking for prescribed medications.'
  },
  {
    id: 'srv-4',
    name: 'Disability Mobility Support',
    category: 'Assisted Living',
    duration: '3 hours',
    basePricePaise: 50000,
    active: true,
    description: 'Assisted mobility, daily living support, and compassionate accompaniment.'
  }
];

let caregivers = [
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
    activeAssignments: 0,
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

let bookings = [
  {
    id: 'bk-1024',
    bookingNumber: 'TH-8901',
    beneficiaryName: 'Saraswathi Garu',
    serviceName: 'Household Support',
    scheduledDate: '2026-03-10',
    scheduledTimeSlot: '10:00 AM - 12:00 PM',
    serviceAddress: 'Home - T.T.D. Colony, Tirupati',
    fundingType: 'TRUST_SPONSORED',
    totalAmountPaise: 60000,
    subsidyAmountPaise: 60000,
    familyPayablePaise: 0,
    status: 'IN_PROGRESS',
    caregiverName: 'Anitha'
  },
  {
    id: 'bk-1025',
    bookingNumber: 'TH-8902',
    beneficiaryName: 'Lakshmi Narasimha Rao',
    serviceName: 'Cooking Assistance',
    scheduledDate: '2026-03-11',
    scheduledTimeSlot: '11:00 AM - 01:00 PM',
    serviceAddress: 'Home - T.T.D. Colony, Tirupati',
    fundingType: 'SPLIT_FUNDING',
    totalAmountPaise: 45000,
    subsidyAmountPaise: 22500,
    familyPayablePaise: 22500,
    status: 'CONFIRMED',
    caregiverName: 'K. Ramesh'
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
    documentsProvided: 'Aadhaar, BPL Ration Card, Doctor Certificate',
    status: 'UNDER_REVIEW',
    submittedAt: '2026-03-05'
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
    submittedAt: '2026-03-02'
  }
];

let sosAlerts = [
  {
    id: 'SOS-9912',
    beneficiaryName: 'Saraswathi Garu',
    triggeredBy: 'Anita Sharma (+91 98765 43210)',
    timestamp: new Date().toISOString(),
    status: 'RESPONDER_DISPATCHED',
    notes: 'Triggered from Family App - Fall alert simulation'
  }
];

let auditLogs = [
  {
    id: 'aud-1',
    adminUser: 'Trust Administrator',
    action: 'APPROVAL',
    module: 'Sponsorship',
    details: 'Approved 80% subsidy for UDID Cardholder Raghav',
    timestamp: '2026-03-02 14:32:00'
  },
  {
    id: 'aud-2',
    adminUser: 'Trust Operations',
    action: 'DISPATCH',
    module: 'Bookings',
    details: 'Assigned Anitha to booking TH-8901 (Household Support)',
    timestamp: '2026-03-03 09:15:00'
  }
];

// 1. Health check & Stats
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Thodu API Engine',
    port: PORT,
    timestamp: new Date().toISOString(),
    organization: 'Sri Divyang Seva Kendram Trust',
    stats: {
      beneficiariesCount: beneficiaries.length,
      bookingsCount: bookings.length,
      caregiversCount: caregivers.length,
      pendingSponsorships: sponsorshipApplications.filter(s => s.status === 'UNDER_REVIEW').length,
      activeSosCount: sosAlerts.filter(s => s.status !== 'RESOLVED').length
    }
  });
});

// 2. Beneficiaries Endpoints
app.get('/api/v1/beneficiaries', (req: Request, res: Response) => {
  res.json({ success: true, beneficiaries });
});

app.post('/api/v1/beneficiaries', (req: Request, res: Response) => {
  const { fullName, category, age, gender, relationship, primaryGuardian, primaryContact, address, accessibilityNeeds } = req.body;
  const newBen = {
    id: `ben-${Date.now()}`,
    fullName,
    category: category || 'SENIOR_CITIZEN',
    age: Number(age) || 60,
    gender: gender || 'Other',
    relationship: relationship || 'Family',
    primaryGuardian: primaryGuardian || 'Anita Sharma',
    primaryContact: primaryContact || '+91 98765 43210',
    address: address || 'Tirupati',
    accessibilityNeeds: accessibilityNeeds || 'General Assisted Living',
    status: 'ACTIVE'
  };
  beneficiaries.unshift(newBen);
  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    adminUser: 'Trust Admin',
    action: 'CREATE',
    module: 'Beneficiaries',
    details: `Registered beneficiary ${newBen.fullName}`,
    timestamp: new Date().toISOString()
  });
  res.status(201).json({ success: true, beneficiary: newBen });
});

app.delete('/api/v1/beneficiaries/:id', (req: Request, res: Response) => {
  beneficiaries = beneficiaries.filter(b => b.id !== req.params.id);
  res.json({ success: true, message: 'Beneficiary record removed' });
});

// 3. Bookings Endpoints
app.get('/api/v1/bookings', (req: Request, res: Response) => {
  res.json({ success: true, bookings });
});

app.post('/api/v1/bookings', (req: Request, res: Response) => {
  const { beneficiaryName, serviceName, scheduledDate, scheduledTimeSlot, serviceAddress, fundingType, caregiverName } = req.body;
  const srv = services.find(s => s.name === serviceName) || services[0];
  const totalAmountPaise = srv.basePricePaise;
  let subsidyAmountPaise = 0;
  if (fundingType === 'TRUST_SPONSORED' || fundingType === 'DONOR_SPONSORED') {
    subsidyAmountPaise = totalAmountPaise;
  } else if (fundingType === 'SPLIT_FUNDING') {
    subsidyAmountPaise = Math.round(totalAmountPaise * 0.5);
  }

  const newBooking = {
    id: `bk-${Date.now()}`,
    bookingNumber: `TH-${Math.floor(1000 + Math.random() * 9000)}`,
    beneficiaryName: beneficiaryName || 'Saraswathi Garu',
    serviceName: srv.name,
    scheduledDate: scheduledDate || '2026-03-15',
    scheduledTimeSlot: scheduledTimeSlot || '10:00 AM - 12:00 PM',
    serviceAddress: serviceAddress || 'Home - T.T.D. Colony, Tirupati',
    fundingType: fundingType || 'TRUST_SPONSORED',
    totalAmountPaise,
    subsidyAmountPaise,
    familyPayablePaise: totalAmountPaise - subsidyAmountPaise,
    status: 'CONFIRMED',
    caregiverName: caregiverName || 'Anitha'
  };
  bookings.unshift(newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});

app.patch('/api/v1/bookings/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, caregiverName } = req.body;
  const bk = bookings.find(b => b.id === id);
  if (bk) {
    if (status) bk.status = status;
    if (caregiverName) bk.caregiverName = caregiverName;
  }
  res.json({ success: true, booking: bk });
});

// 4. Workforce / Caregivers Endpoints
app.get('/api/v1/caregivers', (req: Request, res: Response) => {
  res.json({ success: true, caregivers });
});

app.post('/api/v1/caregivers', (req: Request, res: Response) => {
  const { fullName, phone, employmentType, skills, zone } = req.body;
  const newCg = {
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

// 5. Sponsorship Applications Endpoints
app.get('/api/v1/sponsorship', (req: Request, res: Response) => {
  res.json({ success: true, applications: sponsorshipApplications });
});

app.patch('/api/v1/sponsorship/:id/decision', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body; // 'APPROVED' or 'REJECTED'
  const appItem = sponsorshipApplications.find(a => a.id === id);
  if (appItem) {
    appItem.status = status;
    auditLogs.unshift({
      id: `aud-${Date.now()}`,
      adminUser: 'Trust Admin',
      action: status === 'APPROVED' ? 'APPROVAL' : 'REJECTION',
      module: 'Sponsorship',
      details: `${status} subsidy application ${appItem.applicationRef} for ${appItem.beneficiaryName}`,
      timestamp: new Date().toISOString()
    });
  }
  res.json({ success: true, application: appItem });
});

// 6. SOS Operations
app.get('/api/v1/sos/queue', (req: Request, res: Response) => {
  res.json({ success: true, queue: sosAlerts });
});

app.post('/api/v1/sos/trigger', (req: Request, res: Response) => {
  const { beneficiaryId, notes } = req.body;
  const newAlert = {
    id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
    beneficiaryName: 'Saraswathi Garu',
    triggeredBy: 'Anita Sharma (+91 98765 43210)',
    timestamp: new Date().toISOString(),
    status: 'RESPONDER_DISPATCHED',
    notes: notes || 'Emergency assistance requested'
  };
  sosAlerts.unshift(newAlert);
  res.status(201).json({ success: true, alert: newAlert });
});

app.patch('/api/v1/sos/:id/resolve', (req: Request, res: Response) => {
  const { id } = req.params;
  const alert = sosAlerts.find(a => a.id === id);
  if (alert) {
    alert.status = 'RESOLVED';
  }
  res.json({ success: true, alert });
});

// 7. Audit Logs Endpoint
app.get('/api/v1/audit-logs', (req: Request, res: Response) => {
  res.json({ success: true, auditLogs });
});

app.listen(PORT, () => {
  console.log(`[Thodu API] Running on port ${PORT}`);
  console.log(`[Thodu API] Live destination: https://thodu.sriddha.com (Port ${PORT})`);
});
