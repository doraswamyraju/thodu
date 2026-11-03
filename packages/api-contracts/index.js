"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerSosRequestSchema = exports.CreateBookingRequestSchema = exports.LoginRequestSchema = exports.BookingStatusSchema = exports.FundingTypeSchema = exports.UserRoleSchema = void 0;
const zod_1 = require("zod");
exports.UserRoleSchema = zod_1.z.enum([
    'FAMILY',
    'CAREGIVER_SALARIED',
    'CAREGIVER_GIG',
    'ADMIN',
    'ADMIN_STAFF'
]);
exports.FundingTypeSchema = zod_1.z.enum([
    'SELF_FUNDED',
    'TRUST_SPONSORED',
    'DONOR_SPONSORED',
    'SPLIT_FUNDING'
]);
exports.BookingStatusSchema = zod_1.z.enum([
    'PENDING',
    'CONFIRMED',
    'IN_PROGRESS',
    'COMPLETED',
    'CANCELLED'
]);
exports.LoginRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6)
});
exports.CreateBookingRequestSchema = zod_1.z.object({
    beneficiaryId: zod_1.z.string().uuid().or(zod_1.z.string()),
    serviceId: zod_1.z.string().uuid().or(zod_1.z.string()),
    serviceAddress: zod_1.z.string().min(5),
    scheduledDate: zod_1.z.string(),
    scheduledTimeSlot: zod_1.z.string(),
    specialInstructions: zod_1.z.string().optional(),
    fundingType: exports.FundingTypeSchema
});
exports.TriggerSosRequestSchema = zod_1.z.object({
    beneficiaryId: zod_1.z.string().optional(),
    latitude: zod_1.z.number().optional(),
    longitude: zod_1.z.number().optional(),
    notes: zod_1.z.string().optional()
});
