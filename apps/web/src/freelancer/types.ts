export interface FreelanceCaregiver {
  id: string;
  refNumber: string;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  gender: string;
  dateOfBirth?: string;
  age: number;
  languages?: string[];
  photoUrl?: string;
  address: string;
  pincode: string;
  employmentType: 'Freelance / Gig';
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

export interface GigBroadcastBooking {
  id: string;
  bookingNumber: string;
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryAge?: number;
  guardianPhone?: string;
  serviceName: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  serviceAddress: string;
  status: string;
  fundingType: string;
  totalAmountPaise: number;
  familyPayablePaise: number;
  subsidyAmountPaise: number;
  caregiverId?: string;
  caregiverName?: string;
  caregiverEtaMinutes?: number;
  geoDistanceKm?: number;
  broadcasted?: boolean;
  vitals?: { bp?: string; pulse?: string; spo2?: string; sugar?: string };
  checklistCompleted?: Array<{ task: string; done: boolean; time?: string }>;
  caregiverNotes?: string;
}

export interface CaregiverPayout {
  id: string;
  caregiverId: string;
  caregiverName: string;
  caregiverRef: string;
  amountInr: number;
  payPeriod: string;
  visitsCount: number;
  hoursLogged: number;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'DISBURSED';
  paymentMode: 'UPI' | 'NEFT_BANK';
  upiId?: string;
  bankAccountMasked?: string;
  requestedAt: string;
  disbursedAt?: string;
  txnRef?: string;
}

export type FreelancerNavTab = 'broadcasts' | 'active_gig' | 'my_gigs' | 'wallet' | 'profile';
