
export interface CareService {
  id: string;
  name: string;
  category: string;
  pricingType: 'FIXED_PRICE' | 'ENQUIRY_CUSTOM';
  pricePaise?: number;
  durationHours?: number;
  description: string;
  iconName?: string;
  isActive: boolean;
}

export interface Beneficiary {
  id: string;
  refNumber: string;
  fullName: string;
  category: string;
  age: number;
  gender: string;
  relationship?: string;
  primaryGuardian?: string;
  primaryContact: string;
  guardianPhone?: string;
  alternateGuardianPhone?: string;
  guardianEmail?: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  aadhaarNumber?: string;
  udidNumber?: string;
  address: string;
  zone?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  mobilityStatus?: string;
  medicalConditions?: string[];
  allergies?: string;
  emergencyDoctorName?: string;
  emergencyDoctorPhone?: string;
  subsidyTier?: string;
  rationCardNumber?: string;
  accessibilityNeeds?: string;
  status: string;
  avatarBg?: string;
  photoUrl?: string;
}

export interface CareBooking {
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
  beneficiaryLat?: number;
  beneficiaryLng?: number;
  caregiverId?: string;
  caregiverName?: string;
  caregiverLat?: number;
  caregiverLng?: number;
  caregiverEtaMinutes?: number;
  geoDistanceKm?: number;
  fundingType: string;
  totalAmountPaise: number;
  subsidyAmountPaise: number;
  familyPayablePaise: number;
  paymentMode: string;
  paymentStatus: string;
  status: string;
  broadcasted?: boolean;
  createdAt?: string;
  checklistCompleted?: Array<{ task: string; done: boolean; time?: string }>;
  vitals?: { bp?: string; pulse?: string; spo2?: string; sugar?: string };
  caregiverNotes?: string;
}

export interface Caregiver {
  id: string;
  refNumber: string;
  fullName: string;
  phone: string;
  employmentType: string;
  rating: number;
  reviewsCount: number;
  verificationStatus: string;
  availability: string;
  zone: string;
  avatarBg: string;
  photoUrl?: string;
}

export type BeneficiaryNavTab = 'overview' | 'bookings' | 'health' | 'subsidies' | 'profile';

