import { z } from 'zod';

export const UserRoleSchema = z.enum([
  'FAMILY',
  'CAREGIVER_SALARIED',
  'CAREGIVER_GIG',
  'ADMIN',
  'ADMIN_STAFF'
]);

export const FundingTypeSchema = z.enum([
  'SELF_FUNDED',
  'TRUST_SPONSORED',
  'DONOR_SPONSORED',
  'SPLIT_FUNDING'
]);

export const BookingStatusSchema = z.enum([
  'PENDING',
  'CONFIRMED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
]);

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const CreateBookingRequestSchema = z.object({
  beneficiaryId: z.string().uuid().or(z.string()),
  serviceId: z.string().uuid().or(z.string()),
  serviceAddress: z.string().min(5),
  scheduledDate: z.string(),
  scheduledTimeSlot: z.string(),
  specialInstructions: z.string().optional(),
  fundingType: FundingTypeSchema
});

export const TriggerSosRequestSchema = z.object({
  beneficiaryId: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  notes: z.string().optional()
});

export type UserRole = z.infer<typeof UserRoleSchema>;
export type FundingType = z.infer<typeof FundingTypeSchema>;
export type BookingStatus = z.infer<typeof BookingStatusSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type CreateBookingRequest = z.infer<typeof CreateBookingRequestSchema>;
export type TriggerSosRequest = z.infer<typeof TriggerSosRequestSchema>;

