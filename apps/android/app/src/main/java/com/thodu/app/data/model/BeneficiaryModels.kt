package com.thodu.app.data.model

import com.google.gson.annotations.SerializedName

// 1. Beneficiary
data class Beneficiary(
    @SerializedName("id") val id: String,
    @SerializedName("refNumber") val refNumber: String,
    @SerializedName("fullName") val fullName: String,
    @SerializedName("category") val category: String = "Senior Citizen",
    @SerializedName("age") val age: Int = 65,
    @SerializedName("gender") val gender: String = "Not Specified",
    @SerializedName("relationship") val relationship: String = "Self (Primary)",
    @SerializedName("primaryGuardian") val primaryGuardian: String = "",
    @SerializedName("guardianPhone") val guardianPhone: String? = null,
    @SerializedName("primaryContact") val primaryContact: String = "",
    @SerializedName("alternateGuardianPhone") val alternateGuardianPhone: String? = null,
    @SerializedName("guardianEmail") val guardianEmail: String? = null,
    @SerializedName("dateOfBirth") val dateOfBirth: String? = null,
    @SerializedName("bloodGroup") val bloodGroup: String? = null,
    @SerializedName("address") val address: String = "Tirupati, Andhra Pradesh",
    @SerializedName("zone") val zone: String? = null,
    @SerializedName("pincode") val pincode: String? = null,
    @SerializedName("latitude") val latitude: Double = 13.6288,
    @SerializedName("longitude") val longitude: Double = 79.4192,
    @SerializedName("mobilityStatus") val mobilityStatus: String? = null,
    @SerializedName("medicalConditions") val medicalConditions: List<String>? = null,
    @SerializedName("allergies") val allergies: String? = null,
    @SerializedName("accessibilityNeeds") val accessibilityNeeds: String? = null,
    @SerializedName("emergencyDoctorName") val emergencyDoctorName: String? = null,
    @SerializedName("emergencyDoctorPhone") val emergencyDoctorPhone: String? = null,
    @SerializedName("subsidyTier") val subsidyTier: String? = "Family Self-Funded",
    @SerializedName("rationCardNumber") val rationCardNumber: String? = null,
    @SerializedName("status") val status: String = "Active",
    @SerializedName("avatarBg") val avatarBg: String? = "#0B5D3B",
    @SerializedName("photoUrl") val photoUrl: String? = null
)

data class BeneficiariesResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("beneficiaries") val beneficiaries: List<Beneficiary>
)

// 2. Booking
data class VitalsLog(
    @SerializedName("bloodPressure") val bloodPressure: String?,
    @SerializedName("pulseBpm") val pulseBpm: Int?,
    @SerializedName("oxygenSpo2") val oxygenSpo2: Int?,
    @SerializedName("bloodSugarMgDl") val bloodSugarMgDl: Int?,
    @SerializedName("recordedAt") val recordedAt: String?
)

data class CareTask(
    @SerializedName("id") val id: String,
    @SerializedName("taskName") val taskName: String,
    @SerializedName("completed") val completed: Boolean,
    @SerializedName("completedAt") val completedAt: String?
)

data class Booking(
    @SerializedName("id") val id: String,
    @SerializedName("bookingNumber") val bookingNumber: String,
    @SerializedName("beneficiaryId") val beneficiaryId: String,
    @SerializedName("beneficiaryName") val beneficiaryName: String,
    @SerializedName("beneficiaryAge") val beneficiaryAge: Int,
    @SerializedName("guardianPhone") val guardianPhone: String,
    @SerializedName("serviceName") val serviceName: String,
    @SerializedName("scheduledDate") val scheduledDate: String,
    @SerializedName("scheduledTimeSlot") val scheduledTimeSlot: String,
    @SerializedName("serviceAddress") val serviceAddress: String,
    @SerializedName("caregiverId") val caregiverId: String?,
    @SerializedName("caregiverName") val caregiverName: String,
    @SerializedName("caregiverEtaMinutes") val caregiverEtaMinutes: Int?,
    @SerializedName("status") val status: String, // In Progress, Confirmed, Scheduled, Completed, Awaiting Assignment
    @SerializedName("fundingTier") val fundingTier: String,
    @SerializedName("specialInstructions") val specialInstructions: String?,
    @SerializedName("vitals") val vitals: VitalsLog?,
    @SerializedName("careTasks") val careTasks: List<CareTask>?
)

data class BookingsResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("bookings") val bookings: List<Booking>
)

// 3. Care Service
data class CareService(
    @SerializedName("id") val id: String,
    @SerializedName("name") val name: String,
    @SerializedName("category") val category: String,
    @SerializedName("pricingType") val pricingType: String, // FIXED_PRICE, ENQUIRY_CUSTOM
    @SerializedName("pricePaise") val pricePaise: Long?,
    @SerializedName("durationHours") val durationHours: Int?,
    @SerializedName("description") val description: String,
    @SerializedName("isActive") val isActive: Boolean
)

data class ServicesResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("services") val services: List<CareService>
)

// 4. Create Booking Request
data class CreateBookingRequest(
    @SerializedName("beneficiaryId") val beneficiaryId: String,
    @SerializedName("beneficiaryName") val beneficiaryName: String,
    @SerializedName("serviceName") val serviceName: String,
    @SerializedName("scheduledDate") val scheduledDate: String,
    @SerializedName("scheduledTimeSlot") val scheduledTimeSlot: String,
    @SerializedName("serviceAddress") val serviceAddress: String,
    @SerializedName("guardianPhone") val guardianPhone: String,
    @SerializedName("specialInstructions") val specialInstructions: String? = null,
    @SerializedName("fundingTier") val fundingTier: String = "Trust Sponsored"
)

// 5. Emergency SOS Request
data class SosRequest(
    @SerializedName("beneficiaryId") val beneficiaryId: String,
    @SerializedName("beneficiaryName") val beneficiaryName: String,
    @SerializedName("beneficiaryAddress") val beneficiaryAddress: String,
    @SerializedName("latitude") val latitude: Double,
    @SerializedName("longitude") val longitude: Double,
    @SerializedName("guardianContact") val guardianContact: String,
    @SerializedName("emergencyDoctorPhone") val emergencyDoctorPhone: String? = null,
    @SerializedName("notes") val notes: String? = "1-Tap SOS triggered from Mobile App"
)

data class GenericResponse(
    @SerializedName("success") val success: Boolean,
    @SerializedName("message") val message: String? = null
)

