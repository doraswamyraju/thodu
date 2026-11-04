export interface SalariedCaregiver {
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
  monthlySalaryInr?: number;
}

export interface CaregiverVisit {
  id: string;
  bookingNumber: string;
  beneficiaryId: string;
  beneficiaryName: string;
  beneficiaryAge?: number;
  guardianPhone?: string;
  caregiverId?: string;
  caregiverName?: string;
  serviceName: string;
  scheduledDate: string;
  scheduledTimeSlot: string;
  serviceAddress: string;
  status: string;
  fundingType: string;
  vitals?: { bp?: string; pulse?: string; spo2?: string; sugar?: string };
  checklistCompleted?: Array<{ task: string; done: boolean; time?: string }>;
  caregiverNotes?: string;
}

export type CaregiverNavTab = 'overview' | 'duty' | 'schedule' | 'earnings' | 'profile';
