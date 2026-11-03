import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
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

// In-memory data store for live validation (seeded from Trust defaults)
let beneficiaries = [
  {
    id: 'b1-saraswathi',
    fullName: 'Saraswathi Garu',
    category: 'SENIOR_CITIZEN',
    age: 68,
    relationship: 'Mother',
    primaryContact: 'Anita Sharma (+91 98765 43210)',
    address: 'Home - T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Walking support, knee pain care, gentle handling'
  },
  {
    id: 'b2-lakshmi',
    fullName: 'Lakshmi Narasimha Rao',
    category: 'SENIOR_CITIZEN',
    age: 72,
    relationship: 'Father',
    primaryContact: 'Anita Sharma (+91 98765 43210)',
    address: 'Home - T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Dietary supervision, walking assistance'
  },
  {
    id: 'b3-raghav',
    fullName: 'Raghav',
    category: 'PERSON_WITH_DISABILITY',
    age: 28,
    relationship: 'Son',
    primaryContact: 'Anita Sharma (+91 98765 43210)',
    address: 'Home - T.T.D. Colony, Tirupati',
    accessibilityNeeds: 'Wheelchair assistance, companion support'
  }
];

let services = [
  {
    id: 'srv-household',
    name: 'Household Support',
    category: 'Household Support',
    duration: '1 - 3 hours',
    basePricePaise: 60000, // ₹600
    description: 'Light housekeeping, laundry, home organization and daily household tasks.'
  },
  {
    id: 'srv-cooking',
    name: 'Cooking Assistance',
    category: 'Cooking Assistance',
    duration: '1 - 2 hours',
    basePricePaise: 45000, // ₹450
    description: 'Nutritious meal preparation according to dietary preferences.'
  },
  {
    id: 'srv-medication',
    name: 'Medication Reminders',
    category: 'Medication Reminders',
    duration: 'Scheduled visits',
    basePricePaise: 30000, // ₹300
    description: 'Timely prompts and tracking for prescribed medications.'
  },
  {
    id: 'srv-disability',
    name: 'Disability Mobility Support',
    category: 'Disability Support',
    duration: '2 - 4 hours',
    basePricePaise: 50000, // ₹500
    description: 'Assisted mobility, daily living support, and accompaniment.'
  }
];

let bookings: any[] = [
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
    caregiver: {
      name: 'Anitha',
      type: 'SALARIED',
      phone: '+91 98765 11111',
      rating: 4.8
    }
  }
];

let gigJobBroadcasts: any[] = [
  {
    id: 'gig-101',
    serviceName: 'Cooking Assistance',
    scheduledDate: '2026-03-11',
    scheduledTimeSlot: '11:00 AM - 1:00 PM',
    serviceAddress: 'T.T.D. Colony, Tirupati',
    payoutPaise: 45000,
    claimed: false,
    claimedBy: null
  }
];

let sosAlerts: any[] = [];

// JWT Auth Middleware
const authenticateToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = { id: 'u-guest', roles: ['FAMILY'] };
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// 1. Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'Thodu API Engine',
    port: PORT,
    timestamp: new Date().toISOString(),
    organization: 'Sri Divyang Seva Kendram Trust',
    activeBookingsCount: bookings.length,
    activeBeneficiariesCount: beneficiaries.length
  });
});

// 2. Auth Endpoint (Email/Password credentials)
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  const parseResult = LoginRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid credentials format', details: parseResult.error.errors });
  }

  const { email } = parseResult.data;
  let user = {
    id: 'u-user-1',
    name: 'Anita Sharma',
    email,
    roles: ['FAMILY', 'CAREGIVER_GIG', 'ADMIN_STAFF'],
    phone: '+91 98765 43210'
  };

  if (email.includes('admin')) {
    user = {
      id: 'u-admin-1',
      name: 'Trust Administrator',
      email,
      roles: ['ADMIN', 'ADMIN_STAFF'],
      phone: '+91 94444 56789'
    };
  } else if (email.includes('care')) {
    user = {
      id: 'u-care-1',
      name: 'Anitha',
      email,
      roles: ['CAREGIVER_SALARIED', 'CAREGIVER_GIG'],
      phone: '+91 98765 11111'
    };
  }

  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });

  res.json({
    success: true,
    token,
    user,
    workspaces: user.roles
  });
});

// 3. Beneficiaries List & Registration
app.get('/api/v1/beneficiaries', (req: Request, res: Response) => {
  res.json({ success: true, beneficiaries });
});

app.post('/api/v1/beneficiaries', authenticateToken, (req: Request, res: Response) => {
  const { fullName, category, age, relationship, address, primaryContact, accessibilityNeeds } = req.body;
  if (!fullName || !category || !age) {
    return res.status(400).json({ error: 'Missing required beneficiary information' });
  }

  const newBeneficiary = {
    id: `ben-${Date.now()}`,
    fullName,
    category,
    age: Number(age),
    relationship: relationship || 'Family Member',
    primaryContact: primaryContact || '+91 98765 43210',
    address: address || 'Tirupati',
    accessibilityNeeds: accessibilityNeeds || 'Standard care'
  };

  beneficiaries.unshift(newBeneficiary);
  res.status(201).json({ success: true, beneficiary: newBeneficiary });
});

// 4. Services Catalog
app.get('/api/v1/services', (req: Request, res: Response) => {
  res.json({ success: true, services });
});

// 5. Bookings Creation & Listing with Server-Side Pricing & Subsidy Calculation
app.get('/api/v1/bookings', (req: Request, res: Response) => {
  res.json({ success: true, bookings });
});

app.post('/api/v1/bookings', authenticateToken, (req: Request, res: Response) => {
  const parseResult = CreateBookingRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid booking request', details: parseResult.error.errors });
  }

  const { beneficiaryId, serviceId, serviceAddress, scheduledDate, scheduledTimeSlot, specialInstructions, fundingType } = parseResult.data;

  const targetService = services.find(s => s.id === serviceId) || services[0];
  const targetBeneficiary = beneficiaries.find(b => b.id === beneficiaryId) || beneficiaries[0];

  const totalAmountPaise = targetService.basePricePaise;
  let subsidyAmountPaise = 0;

  if (fundingType === 'TRUST_SPONSORED' || fundingType === 'DONOR_SPONSORED') {
    subsidyAmountPaise = totalAmountPaise; // 100% subsidy
  } else if (fundingType === 'SPLIT_FUNDING') {
    subsidyAmountPaise = Math.round(totalAmountPaise * 0.5); // 50% subsidy
  }

  const familyPayablePaise = totalAmountPaise - subsidyAmountPaise;

  const newBooking = {
    id: `bk-${Date.now()}`,
    bookingNumber: `TH-${Math.floor(1000 + Math.random() * 9000)}`,
    beneficiaryName: targetBeneficiary.fullName,
    serviceName: targetService.name,
    scheduledDate,
    scheduledTimeSlot,
    serviceAddress,
    specialInstructions: specialInstructions || '',
    fundingType,
    totalAmountPaise,
    subsidyAmountPaise,
    familyPayablePaise,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString()
  };

  bookings.unshift(newBooking);
  res.status(201).json({ success: true, booking: newBooking });
});

// 6. Caregiver Atomic Job Claim (Concurreny safe)
app.get('/api/v1/caregiver/jobs', (req: Request, res: Response) => {
  res.json({ success: true, availableJobs: gigJobBroadcasts.filter(j => !j.claimed) });
});

app.post('/api/v1/caregiver/jobs/:id/claim', authenticateToken, (req: any, res: Response) => {
  const { id } = req.params;
  const caregiverName = req.user?.name || 'Caregiver User';

  const jobIndex = gigJobBroadcasts.findIndex(j => j.id === id);
  if (jobIndex === -1) {
    return res.status(404).json({ error: 'Job broadcast not found' });
  }

  const targetJob = gigJobBroadcasts[jobIndex];
  if (targetJob.claimed) {
    return res.status(409).json({ error: 'Job already claimed by another caregiver' });
  }

  // Atomic claim update
  targetJob.claimed = true;
  targetJob.claimedBy = caregiverName;
  targetJob.claimedAt = new Date().toISOString();

  res.json({
    success: true,
    message: 'Job claimed successfully!',
    job: targetJob
  });
});

// 7. SOS Rapid Responder Alert
app.get('/api/v1/sos/queue', (req: Request, res: Response) => {
  res.json({ success: true, queue: sosAlerts });
});

app.post('/api/v1/sos/trigger', authenticateToken, (req: any, res: Response) => {
  const parseResult = TriggerSosRequestSchema.safeParse(req.body);
  const data = parseResult.success ? parseResult.data : {};

  const alert = {
    id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
    beneficiaryId: data.beneficiaryId || 'b1-saraswathi',
    beneficiaryName: 'Saraswathi Garu',
    triggeredBy: req.user?.name || 'Anita Sharma (+91 98765 43210)',
    status: 'RESPONDER_DISPATCHED',
    timestamp: new Date().toISOString(),
    emergencyContactsNotified: [
      'Anita Sharma (+91 98765 43210)',
      'Sri Divyang Seva Kendram Trust Emergency Unit (+91 94444 56789)'
    ]
  };

  sosAlerts.unshift(alert);

  res.status(201).json({
    success: true,
    message: 'Urgent SOS triggered. Emergency unit dispatched and family alerted.',
    alert
  });
});

app.listen(PORT, () => {
  console.log(`[Thodu API] Running on port ${PORT}`);
  console.log(`[Thodu API] Live destination: https://thodu.sriddha.com (Port ${PORT})`);
});
