import SwiftUI

// MARK: - Beneficiary Model
public struct Beneficiary: Codable, Identifiable, Hashable {
    public let id: String
    public let refNumber: String
    public let fullName: String
    public let category: String
    public let age: Int
    public let gender: String
    public let relationship: String
    public let primaryGuardian: String
    public let guardianPhone: String?
    public let primaryContact: String
    public let alternateGuardianPhone: String?
    public let guardianEmail: String?
    public let dateOfBirth: String?
    public let bloodGroup: String?
    public let address: String
    public let zone: String?
    public let pincode: String?
    public let latitude: Double
    public let longitude: Double
    public let mobilityStatus: String?
    public let medicalConditions: [String]?
    public let allergies: String?
    public let accessibilityNeeds: String?
    public let emergencyDoctorName: String?
    public let emergencyDoctorPhone: String?
    public let subsidyTier: String?
    public let rationCardNumber: String?
    public let status: String
    public let avatarBg: String?
    public let photoUrl: String?

    public init(
        id: String,
        refNumber: String = "TH-BEN-001",
        fullName: String,
        category: String = "Senior Citizen",
        age: Int = 65,
        gender: String = "Not Specified",
        relationship: String = "Self (Primary)",
        primaryGuardian: String = "",
        guardianPhone: String? = nil,
        primaryContact: String = "",
        alternateGuardianPhone: String? = nil,
        guardianEmail: String? = nil,
        dateOfBirth: String? = nil,
        bloodGroup: String? = "O+",
        address: String = "Tirupati, Andhra Pradesh",
        zone: String? = nil,
        pincode: String? = "517501",
        latitude: Double = 13.6288,
        longitude: Double = 79.4192,
        mobilityStatus: String? = "Assisted Walking",
        medicalConditions: [String]? = ["Hypertension", "Type 2 Diabetes"],
        allergies: String? = "Penicillin",
        accessibilityNeeds: String? = "Wheelchair for long distances",
        emergencyDoctorName: String? = "Dr. K. Srinivas (Cardiologist)",
        emergencyDoctorPhone: String? = "+91 94400 12345",
        subsidyTier: String? = "Trust Sponsored (100%)",
        rationCardNumber: String? = "WAP104829103",
        status: String = "Active",
        avatarBg: String? = "#0B5D3B",
        photoUrl: String? = nil
    ) {
        self.id = id
        self.refNumber = refNumber
        self.fullName = fullName
        self.category = category
        self.age = age
        self.gender = gender
        self.relationship = relationship
        self.primaryGuardian = primaryGuardian
        self.guardianPhone = guardianPhone
        self.primaryContact = primaryContact
        self.alternateGuardianPhone = alternateGuardianPhone
        self.guardianEmail = guardianEmail
        self.dateOfBirth = dateOfBirth
        self.bloodGroup = bloodGroup
        self.address = address
        self.zone = zone
        self.pincode = pincode
        self.latitude = latitude
        self.longitude = longitude
        self.mobilityStatus = mobilityStatus
        self.medicalConditions = medicalConditions
        self.allergies = allergies
        self.accessibilityNeeds = accessibilityNeeds
        self.emergencyDoctorName = emergencyDoctorName
        self.emergencyDoctorPhone = emergencyDoctorPhone
        self.subsidyTier = subsidyTier
        self.rationCardNumber = rationCardNumber
        self.status = status
        self.avatarBg = avatarBg
        self.photoUrl = photoUrl
    }
}

public struct BeneficiariesResponse: Codable {
    public let success: Bool
    public let beneficiaries: [Beneficiary]
}

// MARK: - Booking & Vitals Models
public struct VitalsLog: Codable, Hashable {
    public let bloodPressure: String?
    public let pulseBpm: Int?
    public let oxygenSpo2: Int?
    public let bloodSugarMgDl: Int?
    public let recordedAt: String?

    public init(
        bloodPressure: String? = "124/82",
        pulseBpm: Int? = 74,
        oxygenSpo2: Int? = 98,
        bloodSugarMgDl: Int? = 110,
        recordedAt: String? = "Today, 09:15 AM"
    ) {
        self.bloodPressure = bloodPressure
        self.pulseBpm = pulseBpm
        self.oxygenSpo2 = oxygenSpo2
        self.bloodSugarMgDl = bloodSugarMgDl
        self.recordedAt = recordedAt
    }
}

public struct CareTask: Codable, Identifiable, Hashable {
    public let id: String
    public let taskName: String
    public let completed: Bool
    public let completedAt: String?
}

public struct Booking: Codable, Identifiable, Hashable {
    public let id: String
    public let bookingNumber: String
    public let beneficiaryId: String
    public let beneficiaryName: String
    public let beneficiaryAge: Int
    public let guardianPhone: String
    public let serviceName: String
    public let scheduledDate: String
    public let scheduledTimeSlot: String
    public let serviceAddress: String
    public let caregiverId: String?
    public let caregiverName: String
    public let caregiverEtaMinutes: Int?
    public let status: String // In Progress, Confirmed, Scheduled, Completed, Awaiting Assignment
    public let fundingTier: String
    public let specialInstructions: String?
    public let vitals: VitalsLog?
    public let careTasks: [CareTask]?

    public init(
        id: String,
        bookingNumber: String,
        beneficiaryId: String,
        beneficiaryName: String,
        beneficiaryAge: Int = 68,
        guardianPhone: String = "+91 98765 43210",
        serviceName: String,
        scheduledDate: String = "Today",
        scheduledTimeSlot: String = "10:00 AM - 4:00 PM",
        serviceAddress: String = "T.T.D. Colony, Tirupati",
        caregiverId: String? = "cg-anitha",
        caregiverName: String = "Anitha",
        caregiverEtaMinutes: Int? = 18,
        status: String = "In Progress",
        fundingTier: String = "Trust Sponsored",
        specialInstructions: String? = "Gentle mobility support and blood sugar monitoring",
        vitals: VitalsLog? = VitalsLog(),
        careTasks: [CareTask]? = nil
    ) {
        self.id = id
        self.bookingNumber = bookingNumber
        self.beneficiaryId = beneficiaryId
        self.beneficiaryName = beneficiaryName
        self.beneficiaryAge = beneficiaryAge
        self.guardianPhone = guardianPhone
        self.serviceName = serviceName
        self.scheduledDate = scheduledDate
        self.scheduledTimeSlot = scheduledTimeSlot
        self.serviceAddress = serviceAddress
        self.caregiverId = caregiverId
        self.caregiverName = caregiverName
        self.caregiverEtaMinutes = caregiverEtaMinutes
        self.status = status
        self.fundingTier = fundingTier
        self.specialInstructions = specialInstructions
        self.vitals = vitals
        self.careTasks = careTasks
    }
}

public struct BookingsResponse: Codable {
    public let success: Bool
    public let bookings: [Booking]
}

// MARK: - Care Service Model
public struct CareService: Codable, Identifiable, Hashable {
    public let id: String
    public let name: String
    public let category: String
    public let pricingType: String // FIXED_PRICE, ENQUIRY_CUSTOM
    public let pricePaise: Int64?
    public let durationHours: Int?
    public let description: String
    public let isActive: Bool

    public init(
        id: String,
        name: String,
        category: String,
        pricingType: String = "FIXED_PRICE",
        pricePaise: Int64? = 49900,
        durationHours: Int? = 4,
        description: String = "Compassionate professional elder care service",
        isActive: Bool = true
    ) {
        self.id = id
        self.name = name
        self.category = category
        self.pricingType = pricingType
        self.pricePaise = pricePaise
        self.durationHours = durationHours
        self.description = description
        self.isActive = isActive
    }
}

public struct ServicesResponse: Codable {
    public let success: Bool
    public let services: [CareService]
}

// MARK: - Requests & Responses
public struct CreateBookingRequest: Codable {
    public let beneficiaryId: String
    public let beneficiaryName: String
    public let serviceName: String
    public let scheduledDate: String
    public let scheduledTimeSlot: String
    public let serviceAddress: String
    public let guardianPhone: String
    public let specialInstructions: String?
    public let fundingTier: String

    public init(
        beneficiaryId: String,
        beneficiaryName: String,
        serviceName: String,
        scheduledDate: String,
        scheduledTimeSlot: String,
        serviceAddress: String,
        guardianPhone: String,
        specialInstructions: String? = nil,
        fundingTier: String = "Trust Sponsored"
    ) {
        self.beneficiaryId = beneficiaryId
        self.beneficiaryName = beneficiaryName
        self.serviceName = serviceName
        self.scheduledDate = scheduledDate
        self.scheduledTimeSlot = scheduledTimeSlot
        self.serviceAddress = serviceAddress
        self.guardianPhone = guardianPhone
        self.specialInstructions = specialInstructions
        self.fundingTier = fundingTier
    }
}

public struct SosRequest: Codable {
    public let beneficiaryId: String
    public let beneficiaryName: String
    public let beneficiaryAddress: String
    public let latitude: Double
    public let longitude: Double
    public let guardianContact: String
    public let emergencyDoctorPhone: String?
    public let notes: String?

    public init(
        beneficiaryId: String,
        beneficiaryName: String,
        beneficiaryAddress: String,
        latitude: Double,
        longitude: Double,
        guardianContact: String,
        emergencyDoctorPhone: String? = nil,
        notes: String? = "1-Tap SOS triggered from iOS Mobile App"
    ) {
        self.beneficiaryId = beneficiaryId
        self.beneficiaryName = beneficiaryName
        self.beneficiaryAddress = beneficiaryAddress
        self.latitude = latitude
        self.longitude = longitude
        self.guardianContact = guardianContact
        self.emergencyDoctorPhone = emergencyDoctorPhone
        self.notes = notes
    }
}

public struct GenericResponse: Codable {
    public let success: Bool
    public let message: String?
}

// MARK: - Navigation Tabs & Filter Enums
public enum BeneficiaryNavTab: String, CaseIterable, Identifiable {
    case TODAY = "Today"
    case BOOKINGS = "Bookings"
    case HEALTH = "Health"
    case SUBSIDIES = "Grants"
    case PROFILE = "Profile"

    public var id: String { rawValue }

    public var iconName: String {
        switch self {
        case .TODAY: return "heart.fill"
        case .BOOKINGS: return "calendar"
        case .HEALTH: return "cross.case.fill"
        case .SUBSIDIES: return "shield.fill"
        case .PROFILE: return "person.fill"
        }
    }
}

public enum BookingFilterTab: String, CaseIterable, Identifiable {
    case ALL = "All"
    case UPCOMING = "Upcoming"
    case IN_SERVICE = "In Service"
    case COMPLETED = "Completed"
    case CANCELLED = "Cancelled"

    public var id: String { rawValue }
}

// MARK: - Promotional Banner Model
public struct PromoBanner: Identifiable {
    public let id: String
    public let tag: String
    public let title: String
    public let subtitle: String
    public let ctaText: String
    public let iconName: String
    public let gradientColors: [Color]
    public let accentColor: Color

    public init(
        id: String,
        tag: String,
        title: String,
        subtitle: String,
        ctaText: String,
        iconName: String,
        gradientColors: [Color],
        accentColor: Color
    ) {
        self.id = id
        self.tag = tag
        self.title = title
        self.subtitle = subtitle
        self.ctaText = ctaText
        self.iconName = iconName
        self.gradientColors = gradientColors
        self.accentColor = accentColor
    }
}

// MARK: - Task Item Model
public struct TodayTaskItem: Identifiable {
    public let id = UUID()
    public let title: String
    public let scheduledTime: String
    public var isCompleted: Bool

    public init(title: String, scheduledTime: String, isCompleted: Bool) {
        self.title = title
        self.scheduledTime = scheduledTime
        self.isCompleted = isCompleted
    }
}

// MARK: - Notification Model
public enum NotificationType {
    case DISPATCH
    case VITALS
    case MEDICATION
    case SUBSIDY

    public var iconName: String {
        switch self {
        case .DISPATCH: return "figure.walk"
        case .VITALS: return "waveform.path.ecg"
        case .MEDICATION: return "pills.fill"
        case .SUBSIDY: return "shield.fill"
        }
    }

    public var color: Color {
        switch self {
        case .DISPATCH: return Color(hex: "0D5C3A")
        case .VITALS: return Color(hex: "2563EB")
        case .MEDICATION: return Color(hex: "E11D48")
        case .SUBSIDY: return Color(hex: "D97706")
        }
    }
}

public struct AppNotification: Identifiable {
    public let id: String
    public let title: String
    public let description: String
    public let timestamp: String
    public let type: NotificationType
    public var isRead: Bool
}

