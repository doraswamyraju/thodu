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
  latitude: number;
  longitude: number;
  accessibilityNeeds: string;
  status: 'Active' | 'Inactive';
  avatarBg: string;
}

export interface Caregiver {
  id: string;
  refNumber: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  email?: string;
  gender?: string;
  dateOfBirth?: string;
  age?: number;
  languages?: string[];
  photoUrl?: string;
  address?: string;
  pincode?: string;
  employmentType: 'Salaried' | 'Freelance / Gig';
  verificationStatus: 'Verified' | 'Pending';
  rating: number;
  ratingReviewsCount: number;
  activeAssignments: number;
  skills: string[];
  zone: string;
  availability: 'Available' | 'On Duty' | 'Off Duty';
  avatarBg: string;
  latitude: number;
  longitude: number;
  experienceYears?: number;
  aadhaarNumber?: string;
  policeClearanceStatus?: 'Verified' | 'Pending';
  workingShift?: string;
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
  beneficiaryLat: number;
  beneficiaryLng: number;
  caregiverId?: string;
  caregiverName: string;
  caregiverLat?: number;
  caregiverLng?: number;
  caregiverEtaMinutes?: number;
  geoDistanceKm?: number;
  fundingType: 'Trust Sponsored' | 'Family Paid' | 'Partially Sponsored' | 'Donor Sponsored';
  totalAmountPaise: number;
  subsidyAmountPaise: number;
  familyPayablePaise: number;
  paymentMode: 'CASH_ON_VISIT' | 'ONLINE_UPI' | 'TRUST_GRANT' | 'BANK_TRANSFER';
  paymentStatus: 'PAID' | 'PENDING' | 'SUBSIDIZED';
  status: 'In Progress' | 'Confirmed' | 'Awaiting Assignment' | 'Scheduled' | 'Completed' | 'Cancelled';
  broadcasted: boolean;
  createdAt: string;
  checklistCompleted?: { task: string; done: boolean; time?: string }[];
  vitals?: { bp: string; pulse: string; spo2: string; sugar: string };
  caregiverNotes?: string;
}

export interface CaregiverPayoutRequest {
  id: string;
  caregiverId: string;
  caregiverName: string;
  caregiverRef: string;
  amountInr: number;
  payPeriod: string;
  visitsCount: number;
  hoursLogged: number;
  upiId: string;
  bankName: string;
  accountNumberMasked: string;
  requestedAt: string;
  status: 'PENDING' | 'APPROVED' | 'DISBURSED';
  decisionNotes?: string;
  disbursedAt?: string;
  txnRef?: string;
}

export interface PaymentTransaction {
  id: string;
  txnRef: string;
  bookingId: string;
  bookingNumber: string;
  beneficiaryName: string;
  guardianName: string;
  payerContact: string;
  amountInr: number;
  subsidyInr: number;
  paymentMode: 'ONLINE_UPI' | 'CASH_ON_VISIT' | 'TRUST_GRANT' | 'BANK_TRANSFER';
  paymentGateway?: string;
  status: 'COMPLETED' | 'PENDING' | 'SUBSIDIZED';
  invoiceNumber: string;
  timestamp: string;
}

export interface StaffMember {
  id: string;
  staffId: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'Super Admin' | 'Trust Care Coordinator' | 'Field Supervisor' | 'Accounts Officer';
  department: string;
  status: 'Active' | 'On Leave';
  serviceZone: string;
  shiftTiming: string;
  joinedDate: string;
}

// 1. Live Caregivers Database (Tirupati coordinates)
let caregivers: Caregiver[] = [
  {
    id: 'cg-1',
    refNumber: 'TH-CAR-1001',
    fullName: 'Anitha',
    phone: '+91 98765 11111',
    alternatePhone: '+91 91234 56789',
    email: 'anitha.care@thodu.org',
    gender: 'Female',
    dateOfBirth: '1990-03-12',
    age: 36,
    languages: ['Telugu', 'English', 'Hindi'],
    photoUrl: '/assets/cg-anitha.png',
    address: '#12-4-56, T.T.D. Colony, Tirupati - 517501, Andhra Pradesh',
    pincode: '517501',
    employmentType: 'Salaried',
    verificationStatus: 'Verified',
    rating: 4.8,
    ratingReviewsCount: 126,
    activeAssignments: 2,
    skills: ['Elder Companionship', 'Cooking', 'Mobility Support', 'Vitals Monitoring'],
    zone: 'Tirupati Urban',
    availability: 'On Duty',
    avatarBg: '#E8F5E9',
    latitude: 13.6300,
    longitude: 79.4215,
    experienceYears: 6,
    aadhaarNumber: 'XXXX-XXXX-4589',
    policeClearanceStatus: 'Verified',
    workingShift: 'Morning (08:00 AM - 02:00 PM)'
  },
  {
    id: 'cg-2',
    refNumber: 'TH-CAR-1002',
    fullName: 'K. Ramesh',
    phone: '+91 98765 22222',
    alternatePhone: '+91 91234 56788',
    email: 'ramesh.k@thodu.org',
    gender: 'Male',
    dateOfBirth: '1988-07-24',
    age: 38,
    languages: ['Telugu', 'Tamil'],
    photoUrl: '/assets/cg-ramesh.png',
    address: 'Near Alipiri Gate, Tirupati - 517507',
    pincode: '517507',
    employmentType: 'Freelance / Gig',
    verificationStatus: 'Verified',
    rating: 4.9,
    ratingReviewsCount: 214,
    activeAssignments: 1,
    skills: ['Cooking Assistance', 'Errands', 'Medication Reminders'],
    zone: 'T.T.D. Colony',
    availability: 'On Duty',
    avatarBg: '#E1F5FE',
    latitude: 13.6335,
    longitude: 79.4180,
    experienceYears: 8,
    aadhaarNumber: 'XXXX-XXXX-7812',
    policeClearanceStatus: 'Verified',
    workingShift: 'Flexible / Shift Based'
  },
  {
    id: 'cg-3',
    refNumber: 'TH-CAR-1003',
    fullName: 'S. Prasad',
    phone: '+91 98765 44444',
    alternatePhone: '+91 91234 56787',
    email: 'prasad.s@thodu.org',
    gender: 'Male',
    dateOfBirth: '1992-11-05',
    age: 34,
    languages: ['Telugu', 'Hindi'],
    address: 'Bhavani Nagar, Tirupati - 517501',
    pincode: '517501',
    employmentType: 'Salaried',
    verificationStatus: 'Verified',
    rating: 4.9,
    ratingReviewsCount: 187,
    activeAssignments: 1,
    skills: ['Disability Support', 'Physiotherapy Assist', 'Wheelchair Transfer'],
    zone: 'Tirupati Urban',
    availability: 'Available',
    avatarBg: '#FFF8E6',
    latitude: 13.6265,
    longitude: 79.4140,
    experienceYears: 5,
    aadhaarNumber: 'XXXX-XXXX-9901',
    policeClearanceStatus: 'Verified',
    workingShift: 'Evening (02:00 PM - 08:00 PM)'
  },
  {
    id: 'cg-4',
    refNumber: 'TH-CAR-1004',
    fullName: 'P. Venkatesh',
    phone: '+91 98765 33333',
    alternatePhone: '+91 91234 56786',
    email: 'venkatesh.p@thodu.org',
    gender: 'Male',
    dateOfBirth: '1995-04-18',
    age: 31,
    languages: ['Telugu', 'English'],
    address: 'Chandragiri Road, Tirupati West - 517502',
    pincode: '517502',
    employmentType: 'Salaried',
    verificationStatus: 'Verified',
    rating: 4.7,
    ratingReviewsCount: 98,
    activeAssignments: 1,
    skills: ['Disability Care', 'Routine Hygiene', 'Bedridden Care'],
    zone: 'Tirupati West',
    availability: 'Available',
    avatarBg: '#EDE7F6',
    latitude: 13.6200,
    longitude: 79.4080,
    experienceYears: 4,
    aadhaarNumber: 'XXXX-XXXX-3341',
    policeClearanceStatus: 'Verified',
    workingShift: 'Full Day (24/7 Live-in)'
  }
];

// 2. Live Beneficiaries Database (with GPS Coordinates for Tirupati)
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
    address: '#14-2, T.T.D. Colony, Tirupati - 517501',
    latitude: 13.6288,
    longitude: 79.4192,
    accessibilityNeeds: 'Walking support, knee pain care, diabetic diet',
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
    address: '#14-2, T.T.D. Colony, Tirupati - 517501',
    latitude: 13.6288,
    longitude: 79.4192,
    accessibilityNeeds: 'Dietary supervision, walking assistance, BP monitoring',
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
    address: '#14-2, T.T.D. Colony, Tirupati - 517501',
    latitude: 13.6288,
    longitude: 79.4192,
    accessibilityNeeds: 'Wheelchair assistance, companion care, speech encouragement',
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
    address: 'Door 45, Near ISKCON, Tirupati - 517507',
    latitude: 13.6402,
    longitude: 79.4255,
    accessibilityNeeds: 'Speech aid, assisted mobility, physiotherapy',
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
    address: 'Lakshmi Nagar, Tirupati - 517501',
    latitude: 13.6240,
    longitude: 79.4120,
    accessibilityNeeds: 'Bedside monitoring, diabetic diet, assisted hygiene',
    status: 'Inactive',
    avatarBg: '#FFEBEE'
  }
];

// 3. Live Care Bookings & Live GPS Tracking
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
    serviceAddress: '#14-2, T.T.D. Colony, Tirupati',
    beneficiaryLat: 13.6288,
    beneficiaryLng: 79.4192,
    caregiverId: 'cg-1',
    caregiverName: 'Anitha',
    caregiverLat: 13.6300,
    caregiverLng: 79.4215,
    caregiverEtaMinutes: 8,
    geoDistanceKm: 0.6,
    fundingType: 'Trust Sponsored',
    totalAmountPaise: 60000,
    subsidyAmountPaise: 60000,
    familyPayablePaise: 0,
    paymentMode: 'TRUST_GRANT',
    paymentStatus: 'SUBSIDIZED',
    status: 'In Progress',
    broadcasted: false,
    createdAt: new Date().toISOString(),
    checklistCompleted: [
      { task: 'Check Vitals (Blood Pressure & Pulse)', done: true, time: '10:15 AM' },
      { task: 'Assisted Morning Walking (20 mins)', done: true, time: '10:35 AM' },
      { task: 'Diabetic Medication Administered', done: true, time: '10:55 AM' },
      { task: 'Nutritional Meal Preparation', done: false }
    ],
    vitals: { bp: '124/82 mmHg', pulse: '74 bpm', spo2: '98%', sugar: '138 mg/dL' },
    caregiverNotes: 'Beneficiary is cheerful today. Complained of minor knee stiffness, warm compression applied.'
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
    serviceAddress: '#14-2, T.T.D. Colony, Tirupati',
    beneficiaryLat: 13.6288,
    beneficiaryLng: 79.4192,
    caregiverId: 'cg-2',
    caregiverName: 'K. Ramesh',
    caregiverLat: 13.6335,
    caregiverLng: 79.4180,
    caregiverEtaMinutes: 14,
    geoDistanceKm: 1.2,
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
    serviceAddress: '#14-2, T.T.D. Colony, Tirupati',
    beneficiaryLat: 13.6288,
    beneficiaryLng: 79.4192,
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
    serviceAddress: 'Door 45, Near ISKCON, Tirupati',
    beneficiaryLat: 13.6402,
    beneficiaryLng: 79.4255,
    caregiverId: 'cg-3',
    caregiverName: 'S. Prasad',
    caregiverLat: 13.6265,
    caregiverLng: 79.4140,
    caregiverEtaMinutes: 25,
    geoDistanceKm: 2.4,
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

// 4. Caregiver Payout Requests
let caregiverPayouts: CaregiverPayoutRequest[] = [
  {
    id: 'pay-201',
    caregiverId: 'cg-2',
    caregiverName: 'K. Ramesh',
    caregiverRef: 'TH-CAR-1002',
    amountInr: 4500,
    payPeriod: 'Oct 25 - Oct 31, 2026',
    visitsCount: 10,
    hoursLogged: 22,
    upiId: 'ramesh.k@okaxis',
    bankName: 'State Bank of India (Tirupati Branch)',
    accountNumberMasked: '•••• •••• 8912',
    requestedAt: '2026-11-01 14:30',
    status: 'PENDING',
    decisionNotes: 'Completed 10 visits with 4.9 average customer rating.'
  },
  {
    id: 'pay-202',
    caregiverId: 'cg-1',
    caregiverName: 'Anitha',
    caregiverRef: 'TH-CAR-1001',
    amountInr: 12000,
    payPeriod: 'Monthly Salary - October 2026',
    visitsCount: 26,
    hoursLogged: 104,
    upiId: 'anitha.trust@upi',
    bankName: 'Andhra Bank / Union Bank',
    accountNumberMasked: '•••• •••• 4421',
    requestedAt: '2026-10-31 18:00',
    status: 'APPROVED',
    decisionNotes: 'Full month salaried roster verified by Coordinator.',
    disbursedAt: '2026-11-01 11:20',
    txnRef: 'TXN-SBI-992147'
  },
  {
    id: 'pay-203',
    caregiverId: 'cg-4',
    caregiverName: 'P. Venkatesh',
    caregiverRef: 'TH-CAR-1004',
    amountInr: 3200,
    payPeriod: 'Weekend Night Shift Assist',
    visitsCount: 4,
    hoursLogged: 32,
    upiId: 'venkat.p@paytm',
    bankName: 'HDFC Bank Tirupati',
    accountNumberMasked: '•••• •••• 1083',
    requestedAt: '2026-11-02 09:15',
    status: 'DISBURSED',
    disbursedAt: '2026-11-02 16:40',
    txnRef: 'TXN-HDFC-881203'
  }
];

// 5. Payments, Subsidies & Billing Ledger
let paymentTransactions: PaymentTransaction[] = [
  {
    id: 'tx-1001',
    txnRef: 'TXN-RAZOR-89101',
    bookingId: 'bk-2',
    bookingNumber: 'TH-8902',
    beneficiaryName: 'Lakshmi Narasimha Rao',
    guardianName: 'Anita Sharma',
    payerContact: '+91 98765 43210',
    amountInr: 225,
    subsidyInr: 225,
    paymentMode: 'ONLINE_UPI',
    paymentGateway: 'Razorpay UPI (GPay)',
    status: 'COMPLETED',
    invoiceNumber: 'INV-TH-2026-0042',
    timestamp: '2026-11-02 11:45'
  },
  {
    id: 'tx-1002',
    txnRef: 'TXN-TRUST-GRANT-091',
    bookingId: 'bk-1',
    bookingNumber: 'TH-8901',
    beneficiaryName: 'Saraswathi Garu',
    guardianName: 'Anita Sharma',
    payerContact: '+91 98765 43210',
    amountInr: 0,
    subsidyInr: 600,
    paymentMode: 'TRUST_GRANT',
    paymentGateway: 'Sri Divyang Seva Kendram Trust Care Endowment',
    status: 'SUBSIDIZED',
    invoiceNumber: 'INV-TH-2026-0041',
    timestamp: '2026-11-02 10:00'
  },
  {
    id: 'tx-1003',
    txnRef: 'TXN-PENDING-0012',
    bookingId: 'bk-3',
    bookingNumber: 'TH-8903',
    beneficiaryName: 'Raghav',
    guardianName: 'Anita Sharma',
    payerContact: '+91 98765 43210',
    amountInr: 100,
    subsidyInr: 300,
    paymentMode: 'ONLINE_UPI',
    paymentGateway: 'UPI Pending Collection',
    status: 'PENDING',
    invoiceNumber: 'INV-TH-2026-0043',
    timestamp: '2026-11-03 09:30'
  }
];

// 6. Internal Staff & Supervisor Management
let staffDirectory: StaffMember[] = [
  {
    id: 'st-1',
    staffId: 'TH-STAFF-01',
    fullName: 'Raju Kumar',
    email: 'raju@thodu.sriddha.com',
    phone: '+91 98765 00001',
    role: 'Super Admin',
    department: 'Trust Executive Board',
    status: 'Active',
    serviceZone: 'All Zones (HQ)',
    shiftTiming: 'Full Time (09:00 AM - 06:00 PM)',
    joinedDate: '2024-01-15'
  },
  {
    id: 'st-2',
    staffId: 'TH-STAFF-02',
    fullName: 'Dr. Mallikarjun Rao',
    email: 'medical@thodu.sriddha.com',
    phone: '+91 98765 00002',
    role: 'Field Supervisor',
    department: 'Clinical Care & Quality Audit',
    status: 'Active',
    serviceZone: 'Tirupati Urban & Alipiri',
    shiftTiming: 'Day Shift (08:00 AM - 04:00 PM)',
    joinedDate: '2024-06-01'
  },
  {
    id: 'st-3',
    staffId: 'TH-STAFF-03',
    fullName: 'Sunita Reddy',
    email: 'coordinator@thodu.sriddha.com',
    phone: '+91 98765 00003',
    role: 'Trust Care Coordinator',
    department: 'Care Dispatch & Roster Board',
    status: 'Active',
    serviceZone: 'T.T.D. Colony & Tirupati West',
    shiftTiming: 'Morning Shift (07:00 AM - 03:00 PM)',
    joinedDate: '2024-08-10'
  },
  {
    id: 'st-4',
    staffId: 'TH-STAFF-04',
    fullName: 'K. Balaji',
    email: 'accounts@thodu.sriddha.com',
    phone: '+91 98765 00004',
    role: 'Accounts Officer',
    department: 'Trust Grants & Disbursements',
    status: 'Active',
    serviceZone: 'Trust Finance Wing',
    shiftTiming: 'General (10:00 AM - 06:00 PM)',
    joinedDate: '2025-02-01'
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

  const totalCaregivers = caregivers.length;
  const salariedStaff = caregivers.filter(c => c.employmentType === 'Salaried').length;
  const freelanceGig = caregivers.filter(c => c.employmentType === 'Freelance / Gig').length;
  const verifiedCaregivers = caregivers.filter(c => c.verificationStatus === 'Verified').length;
  const onDutyCount = caregivers.filter(c => c.availability === 'On Duty').length;
  const availableCount = caregivers.filter(c => c.availability === 'Available').length;

  const totalPayoutPendingInr = caregiverPayouts
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amountInr, 0);

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
      activeSosCount: sosAlerts.filter(s => s.status !== 'RESOLVED').length,
      totalStaffCount: staffDirectory.length,
      pendingPayoutsCount: caregiverPayouts.filter(p => p.status === 'PENDING').length,
      pendingPayoutsAmountInr: totalPayoutPendingInr
    }
  });
});

// 2. Caregivers CRUD & 4-Step Registration

// Update Caregiver Record
app.patch('/api/v1/caregivers/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const cg = caregivers.find(c => c.id === id);
  if (!cg) return res.status(404).json({ error: 'Caregiver not found' });

  const { fullName, phone, employmentType, skills, zone, availability, verificationStatus } = req.body;
  if (fullName !== undefined) cg.fullName = fullName;
  if (phone !== undefined) cg.phone = phone;
  if (employmentType !== undefined) cg.employmentType = employmentType;
  if (skills !== undefined) cg.skills = Array.isArray(skills) ? skills : skills.split(',').map((s: string) => s.trim());
  if (zone !== undefined) cg.zone = zone;
  if (availability !== undefined) cg.availability = availability;
  if (verificationStatus !== undefined) cg.verificationStatus = verificationStatus;

  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    adminUser: 'Raju Kumar (Super Admin)',
    action: 'CAREGIVER_UPDATED',
    module: 'Workforce',
    details: `Updated profile for caregiver ${cg.fullName} (${cg.refNumber})`,
    timestamp: new Date().toLocaleString()
  });

  res.json({ success: true, caregiver: cg });
});

app.get('/api/v1/caregivers', (req: Request, res: Response) => {
  res.json({ success: true, caregivers });
});

app.post('/api/v1/caregivers', (req: Request, res: Response) => {
  const {
    fullName, gender, dateOfBirth, age, phone, alternatePhone, email,
    languages, address, pincode, zone, photoUrl, employmentType,
    skills, experienceYears, aadhaarNumber, workingShift
  } = req.body;

  const newCg: Caregiver = {
    id: `cg-${Date.now()}`,
    refNumber: `TH-CAR-${Math.floor(1000 + caregivers.length + 1)}`,
    fullName: fullName || 'New Caregiver',
    gender: gender || 'Female',
    dateOfBirth: dateOfBirth || '1992-01-01',
    age: age || 34,
    phone: phone || '+91 98765 00000',
    alternatePhone: alternatePhone || '',
    email: email || '',
    languages: languages || ['Telugu', 'English'],
    photoUrl: photoUrl || '',
    address: address || 'Tirupati, Andhra Pradesh',
    pincode: pincode || '517501',
    zone: zone || 'Tirupati Urban',
    employmentType: employmentType || 'Salaried',
    verificationStatus: 'Verified',
    rating: 5.0,
    ratingReviewsCount: 1,
    activeAssignments: 0,
    skills: skills || ['Elder Companionship', 'Cooking Assistance'],
    availability: 'Available',
    avatarBg: '#E8F5E9',
    latitude: 13.6288 + (Math.random() - 0.5) * 0.02,
    longitude: 79.4192 + (Math.random() - 0.5) * 0.02,
    experienceYears: experienceYears || 3,
    aadhaarNumber: aadhaarNumber || 'XXXX-XXXX-1234',
    policeClearanceStatus: 'Verified',
    workingShift: workingShift || 'Morning (08:00 AM - 02:00 PM)'
  };

  caregivers.unshift(newCg);

  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    adminUser: 'Raju Kumar (Super Admin)',
    action: 'CAREGIVER_REGISTERED',
    module: 'Workforce',
    details: `Registered caregiver ${newCg.fullName} (${newCg.refNumber}) via 4-step wizard`,
    timestamp: new Date().toLocaleString()
  });

  res.status(201).json({ success: true, caregiver: newCg });
});

// 3. Bookings CRUD + Assign & Broadcast
app.get('/api/v1/bookings', (req: Request, res: Response) => {
  res.json({ success: true, bookings });
});

app.patch('/api/v1/bookings/:id/assign', (req: Request, res: Response) => {
  const { id } = req.params;
  const { caregiverName } = req.body;
  const bk = bookings.find(b => b.id === id);
  if (!bk) return res.status(404).json({ error: 'Booking not found' });

  const assignedCg = caregivers.find(c => c.fullName === caregiverName);

  bk.caregiverName = caregiverName;
  if (assignedCg) {
    bk.caregiverId = assignedCg.id;
    bk.caregiverLat = assignedCg.latitude;
    bk.caregiverLng = assignedCg.longitude;
    bk.caregiverEtaMinutes = 12;
    bk.geoDistanceKm = 1.1;
  }
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
  const assignedCg = caregivers.find(c => c.fullName === caregiverName);

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
    beneficiaryLat: targetBen.latitude,
    beneficiaryLng: targetBen.longitude,
    caregiverId: assignedCg?.id,
    caregiverName: caregiverName || 'Unassigned',
    caregiverLat: assignedCg?.latitude,
    caregiverLng: assignedCg?.longitude,
    caregiverEtaMinutes: assignedCg ? 15 : undefined,
    geoDistanceKm: assignedCg ? 1.5 : undefined,
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

// Update Beneficiary Record
app.patch('/api/v1/beneficiaries/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const ben = beneficiaries.find(b => b.id === id);
  if (!ben) return res.status(404).json({ error: 'Beneficiary not found' });

  const { fullName, category, age, gender, relationship, primaryGuardian, primaryContact, address, accessibilityNeeds, status } = req.body;
  if (fullName !== undefined) ben.fullName = fullName;
  if (category !== undefined) ben.category = category;
  if (age !== undefined) ben.age = Number(age);
  if (gender !== undefined) ben.gender = gender;
  if (relationship !== undefined) ben.relationship = relationship;
  if (primaryGuardian !== undefined) ben.primaryGuardian = primaryGuardian;
  if (primaryContact !== undefined) ben.primaryContact = primaryContact;
  if (address !== undefined) ben.address = address;
  if (accessibilityNeeds !== undefined) ben.accessibilityNeeds = accessibilityNeeds;
  if (status !== undefined) ben.status = status;

  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    adminUser: 'Raju Kumar (Super Admin)',
    action: 'BENEFICIARY_UPDATED',
    module: 'Beneficiaries',
    details: `Updated profile details for beneficiary ${ben.fullName} (${ben.refNumber})`,
    timestamp: new Date().toLocaleString()
  });

  res.json({ success: true, beneficiary: ben });
});

app.get('/api/v1/beneficiaries', (req: Request, res: Response) => {
  res.json({ success: true, beneficiaries });
});

app.post('/api/v1/beneficiaries', (req: Request, res: Response) => {
  const { fullName, category, age, gender, relationship, primaryGuardian, primaryContact, address, accessibilityNeeds, latitude, longitude } = req.body;
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
    latitude: latitude || 13.6288 + (Math.random() - 0.5) * 0.02,
    longitude: longitude || 79.4192 + (Math.random() - 0.5) * 0.02,
    accessibilityNeeds: accessibilityNeeds || 'Standard Care',
    status: 'Active',
    avatarBg: '#E8F5E9'
  };
  beneficiaries.unshift(newBen);
  res.status(201).json({ success: true, beneficiary: newBen });
});

// 5. Caregiver Earnings & Payout Requests
app.get('/api/v1/caregiver-payouts', (req: Request, res: Response) => {
  res.json({ success: true, payouts: caregiverPayouts });
});

app.patch('/api/v1/caregiver-payouts/:id/decision', (req: Request, res: Response) => {
  const { id } = req.params;
  const { decision, txnRef } = req.body; // 'APPROVED' | 'DISBURSED'
  const payout = caregiverPayouts.find(p => p.id === id);
  if (!payout) return res.status(404).json({ error: 'Payout not found' });

  payout.status = decision;
  if (decision === 'DISBURSED') {
    payout.disbursedAt = new Date().toLocaleString();
    payout.txnRef = txnRef || `TXN-TRUST-${Math.floor(100000 + Math.random() * 900000)}`;
  }

  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    adminUser: 'Raju Kumar (Super Admin)',
    action: `PAYOUT_${decision}`,
    module: 'Caregiver Earnings',
    details: `Marked payout ${payout.id} (₹${payout.amountInr} for ${payout.caregiverName}) as ${decision}. Txn: ${payout.txnRef || 'N/A'}`,
    timestamp: new Date().toLocaleString()
  });

  res.json({ success: true, payout });
});

// 6. Payments Ledger & Transactions
app.get('/api/v1/payments', (req: Request, res: Response) => {
  res.json({ success: true, payments: paymentTransactions });
});

// 7. Staff & Supervisor Management
app.get('/api/v1/staff', (req: Request, res: Response) => {
  res.json({ success: true, staff: staffDirectory });
});

app.post('/api/v1/staff', (req: Request, res: Response) => {
  const { fullName, email, phone, role, department, serviceZone, shiftTiming } = req.body;
  const newStaff: StaffMember = {
    id: `st-${Date.now()}`,
    staffId: `TH-STAFF-0${staffDirectory.length + 1}`,
    fullName,
    email,
    phone,
    role: role || 'Trust Care Coordinator',
    department: department || 'Care Operations',
    status: 'Active',
    serviceZone: serviceZone || 'Tirupati Urban',
    shiftTiming: shiftTiming || 'Day Shift',
    joinedDate: new Date().toISOString().split('T')[0]
  };

  staffDirectory.unshift(newStaff);

  auditLogs.unshift({
    id: `aud-${Date.now()}`,
    adminUser: 'Raju Kumar (Super Admin)',
    action: 'STAFF_ADDED',
    module: 'Staff Management',
    details: `Added new staff member ${newStaff.fullName} as ${newStaff.role}`,
    timestamp: new Date().toLocaleString()
  });

  res.status(201).json({ success: true, staff: newStaff });
});

// 8. Sponsorship & SOS Endpoints
app.get('/api/v1/sponsorship', (req: Request, res: Response) => {
  res.json({ success: true, applications: sponsorshipApplications });
});

app.patch('/api/v1/sponsorship/:id/decision', (req: Request, res: Response) => {
  const { id } = req.params;
  const { decision, notes } = req.body;
  const appItem = sponsorshipApplications.find(a => a.id === id);
  if (appItem) {
    appItem.status = decision;
    auditLogs.unshift({
      id: `aud-${Date.now()}`,
      adminUser: 'Raju Kumar (Super Admin)',
      action: `SPONSORSHIP_${decision}`,
      module: 'Sponsorship',
      details: `${decision} sponsorship ${appItem.applicationRef} for ${appItem.beneficiaryName}. Notes: ${notes || ''}`,
      timestamp: new Date().toLocaleString()
    });
  }
  res.json({ success: true, application: appItem });
});

app.get('/api/v1/sos/queue', (req: Request, res: Response) => {
  res.json({ success: true, queue: sosAlerts });
});

app.patch('/api/v1/sos/:id/resolve', (req: Request, res: Response) => {
  const { id } = req.params;
  const alertItem = sosAlerts.find(a => a.id === id);
  if (alertItem) {
    alertItem.status = 'RESOLVED';
    auditLogs.unshift({
      id: `aud-${Date.now()}`,
      adminUser: 'Raju Kumar (Super Admin)',
      action: 'SOS_RESOLVED',
      module: 'Emergency SOS',
      details: `Resolved SOS ${alertItem.id} for ${alertItem.beneficiaryName}`,
      timestamp: new Date().toLocaleString()
    });
  }
  res.json({ success: true, alert: alertItem });
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
