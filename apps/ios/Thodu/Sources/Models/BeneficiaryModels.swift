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

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        self.id = (try? c.decode(String.self, forKey: .id)) ?? "ben-\(UUID().uuidString.prefix(6))"
        self.refNumber = (try? c.decode(String.self, forKey: .refNumber)) ?? "TH-BEN-001"
        self.fullName = (try? c.decode(String.self, forKey: .fullName)) ?? "Beneficiary"
        self.category = (try? c.decodeIfPresent(String.self, forKey: .category)) ?? "Senior Citizen"
        self.age = (try? c.decodeIfPresent(Int.self, forKey: .age)) ?? 68
        self.gender = (try? c.decodeIfPresent(String.self, forKey: .gender)) ?? "Not Specified"
        self.relationship = (try? c.decodeIfPresent(String.self, forKey: .relationship)) ?? "Self / Loved One"
        self.primaryGuardian = (try? c.decodeIfPresent(String.self, forKey: .primaryGuardian)) ?? ""
        self.guardianPhone = try? c.decodeIfPresent(String.self, forKey: .guardianPhone)
        self.primaryContact = (try? c.decodeIfPresent(String.self, forKey: .primaryContact)) ?? "+91 Not Provided"
        self.alternateGuardianPhone = try? c.decodeIfPresent(String.self, forKey: .alternateGuardianPhone)
        self.guardianEmail = try? c.decodeIfPresent(String.self, forKey: .guardianEmail)
        self.dateOfBirth = try? c.decodeIfPresent(String.self, forKey: .dateOfBirth)
        self.bloodGroup = try? c.decodeIfPresent(String.self, forKey: .bloodGroup)
        self.address = (try? c.decodeIfPresent(String.self, forKey: .address)) ?? "Tirupati, Andhra Pradesh"
        self.zone = try? c.decodeIfPresent(String.self, forKey: .zone)
        self.pincode = try? c.decodeIfPresent(String.self, forKey: .pincode)
        self.latitude = (try? c.decodeIfPresent(Double.self, forKey: .latitude)) ?? 13.6288
        self.longitude = (try? c.decodeIfPresent(Double.self, forKey: .longitude)) ?? 79.4192
        self.mobilityStatus = try? c.decodeIfPresent(String.self, forKey: .mobilityStatus)
        self.medicalConditions = try? c.decodeIfPresent([String].self, forKey: .medicalConditions)
        self.allergies = try? c.decodeIfPresent(String.self, forKey: .allergies)
        self.accessibilityNeeds = try? c.decodeIfPresent(String.self, forKey: .accessibilityNeeds)
        self.emergencyDoctorName = try? c.decodeIfPresent(String.self, forKey: .emergencyDoctorName)
        self.emergencyDoctorPhone = try? c.decodeIfPresent(String.self, forKey: .emergencyDoctorPhone)
        self.subsidyTier = (try? c.decodeIfPresent(String.self, forKey: .subsidyTier)) ?? "Family Self-Funded"
        self.rationCardNumber = try? c.decodeIfPresent(String.self, forKey: .rationCardNumber)
        self.status = (try? c.decodeIfPresent(String.self, forKey: .status)) ?? "Active"
        self.avatarBg = try? c.decodeIfPresent(String.self, forKey: .avatarBg)
        self.photoUrl = try? c.decodeIfPresent(String.self, forKey: .photoUrl)
    }
}

public struct BeneficiariesResponse: Codable {
    public let success: Bool
    public let beneficiaries: [Beneficiary]
}

public struct CreateBeneficiaryResponse: Codable {
    public let success: Bool
    public let beneficiary: Beneficiary?
    public let message: String?
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

    public init(from decoder: Decoder) throws {
        let container = try? decoder.container(keyedBy: CodingKeys.self)
        let bp = (try? container?.decodeIfPresent(String.self, forKey: .bloodPressure)) ?? (try? container?.decodeIfPresent(String.self, forKey: .bp))
        self.bloodPressure = bp ?? "124/82"

        if let pInt = try? container?.decodeIfPresent(Int.self, forKey: .pulseBpm) {
            self.pulseBpm = pInt
        } else if let pStr = try? container?.decodeIfPresent(String.self, forKey: .pulse) {
            self.pulseBpm = Int(pStr.components(separatedBy: CharacterSet.decimalDigits.inverted).joined()) ?? 74
        } else {
            self.pulseBpm = 74
        }

        if let oInt = try? container?.decodeIfPresent(Int.self, forKey: .oxygenSpo2) {
            self.oxygenSpo2 = oInt
        } else if let oStr = try? container?.decodeIfPresent(String.self, forKey: .spo2) {
            self.oxygenSpo2 = Int(oStr.components(separatedBy: CharacterSet.decimalDigits.inverted).joined()) ?? 98
        } else {
            self.oxygenSpo2 = 98
        }

        if let sInt = try? container?.decodeIfPresent(Int.self, forKey: .bloodSugarMgDl) {
            self.bloodSugarMgDl = sInt
        } else if let sStr = try? container?.decodeIfPresent(String.self, forKey: .sugar) {
            self.bloodSugarMgDl = Int(sStr.components(separatedBy: CharacterSet.decimalDigits.inverted).joined()) ?? 110
        } else {
            self.bloodSugarMgDl = 110
        }

        self.recordedAt = (try? container?.decodeIfPresent(String.self, forKey: .recordedAt)) ?? "Today, 09:15 AM"
    }

    public func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encodeIfPresent(bloodPressure, forKey: .bloodPressure)
        try container.encodeIfPresent(pulseBpm, forKey: .pulseBpm)
        try container.encodeIfPresent(oxygenSpo2, forKey: .oxygenSpo2)
        try container.encodeIfPresent(bloodSugarMgDl, forKey: .bloodSugarMgDl)
        try container.encodeIfPresent(recordedAt, forKey: .recordedAt)
    }

    enum CodingKeys: String, CodingKey {
        case bloodPressure, pulseBpm, oxygenSpo2, bloodSugarMgDl, recordedAt
        case bp, pulse, spo2, sugar
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
    public let beneficiaryLat: Double
    public let beneficiaryLng: Double
    public let caregiverId: String?
    public let caregiverName: String
    public let caregiverLat: Double?
    public let caregiverLng: Double?
    public let caregiverEtaMinutes: Int?
    public let status: String // In Progress, Confirmed, Scheduled, Completed, Awaiting Assignment
    public let fundingTier: String
    public let specialInstructions: String?
    public let caregiverNotes: String?
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
        beneficiaryLat: Double = 13.6288,
        beneficiaryLng: Double = 79.4192,
        caregiverId: String? = "cg-anitha",
        caregiverName: String = "Anitha",
        caregiverLat: Double? = 13.6300,
        caregiverLng: Double? = 79.4215,
        caregiverEtaMinutes: Int? = 18,
        status: String = "In Progress",
        fundingTier: String = "Trust Sponsored",
        specialInstructions: String? = "Gentle mobility support and blood sugar monitoring",
        caregiverNotes: String? = nil,
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
        self.beneficiaryLat = beneficiaryLat
        self.beneficiaryLng = beneficiaryLng
        self.caregiverId = caregiverId
        self.caregiverName = caregiverName
        self.caregiverLat = caregiverLat
        self.caregiverLng = caregiverLng
        self.caregiverEtaMinutes = caregiverEtaMinutes
        self.status = status
        self.fundingTier = fundingTier
        self.specialInstructions = specialInstructions
        self.caregiverNotes = caregiverNotes
        self.vitals = vitals
        self.careTasks = careTasks
    }

    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        self.id = (try? c.decode(String.self, forKey: .id)) ?? "bk-\(UUID().uuidString.prefix(6))"
        self.bookingNumber = (try? c.decode(String.self, forKey: .bookingNumber)) ?? "#TH-BK-8921"
        self.beneficiaryId = (try? c.decode(String.self, forKey: .beneficiaryId)) ?? "ben-1"
        self.beneficiaryName = (try? c.decode(String.self, forKey: .beneficiaryName)) ?? "Beneficiary"
        self.beneficiaryAge = (try? c.decodeIfPresent(Int.self, forKey: .beneficiaryAge)) ?? 68
        self.guardianPhone = (try? c.decodeIfPresent(String.self, forKey: .guardianPhone)) ?? "+91 98765 43210"
        self.serviceName = (try? c.decode(String.self, forKey: .serviceName)) ?? "Household Support & Vitals"
        self.scheduledDate = (try? c.decodeIfPresent(String.self, forKey: .scheduledDate)) ?? "Today"
        self.scheduledTimeSlot = (try? c.decodeIfPresent(String.self, forKey: .scheduledTimeSlot)) ?? "10:00 AM - 4:00 PM"
        self.serviceAddress = (try? c.decodeIfPresent(String.self, forKey: .serviceAddress)) ?? "T.T.D. Colony, Tirupati"
        self.beneficiaryLat = (try? c.decodeIfPresent(Double.self, forKey: .beneficiaryLat)) ?? 13.6288
        self.beneficiaryLng = (try? c.decodeIfPresent(Double.self, forKey: .beneficiaryLng)) ?? 79.4192
        self.caregiverId = try? c.decodeIfPresent(String.self, forKey: .caregiverId)
        self.caregiverName = (try? c.decodeIfPresent(String.self, forKey: .caregiverName)) ?? "Anitha"
        self.caregiverLat = try? c.decodeIfPresent(Double.self, forKey: .caregiverLat)
        self.caregiverLng = try? c.decodeIfPresent(Double.self, forKey: .caregiverLng)
        self.caregiverEtaMinutes = try? c.decodeIfPresent(Int.self, forKey: .caregiverEtaMinutes)
        self.status = (try? c.decodeIfPresent(String.self, forKey: .status)) ?? "In Progress"
        self.fundingTier = (try? c.decodeIfPresent(String.self, forKey: .fundingTier)) ?? (try? c.decodeIfPresent(String.self, forKey: .fundingType)) ?? "Trust Sponsored (100%)"
        self.specialInstructions = try? c.decodeIfPresent(String.self, forKey: .specialInstructions)
        self.caregiverNotes = try? c.decodeIfPresent(String.self, forKey: .caregiverNotes)
        self.vitals = try? c.decodeIfPresent(VitalsLog.self, forKey: .vitals)
        self.careTasks = try? c.decodeIfPresent([CareTask].self, forKey: .careTasks)
    }

    public func encode(to encoder: Encoder) throws {
        var c = encoder.container(keyedBy: CodingKeys.self)
        try c.encode(id, forKey: .id)
        try c.encode(bookingNumber, forKey: .bookingNumber)
        try c.encode(beneficiaryId, forKey: .beneficiaryId)
        try c.encode(beneficiaryName, forKey: .beneficiaryName)
        try c.encode(beneficiaryAge, forKey: .beneficiaryAge)
        try c.encode(guardianPhone, forKey: .guardianPhone)
        try c.encode(serviceName, forKey: .serviceName)
        try c.encode(scheduledDate, forKey: .scheduledDate)
        try c.encode(scheduledTimeSlot, forKey: .scheduledTimeSlot)
        try c.encode(serviceAddress, forKey: .serviceAddress)
        try c.encode(beneficiaryLat, forKey: .beneficiaryLat)
        try c.encode(beneficiaryLng, forKey: .beneficiaryLng)
        try c.encodeIfPresent(caregiverId, forKey: .caregiverId)
        try c.encode(caregiverName, forKey: .caregiverName)
        try c.encodeIfPresent(caregiverLat, forKey: .caregiverLat)
        try c.encodeIfPresent(caregiverLng, forKey: .caregiverLng)
        try c.encodeIfPresent(caregiverEtaMinutes, forKey: .caregiverEtaMinutes)
        try c.encode(status, forKey: .status)
        try c.encode(fundingTier, forKey: .fundingTier)
        try c.encodeIfPresent(specialInstructions, forKey: .specialInstructions)
        try c.encodeIfPresent(caregiverNotes, forKey: .caregiverNotes)
        try c.encodeIfPresent(vitals, forKey: .vitals)
        try c.encodeIfPresent(careTasks, forKey: .careTasks)
    }

    enum CodingKeys: String, CodingKey {
        case id, bookingNumber, beneficiaryId, beneficiaryName, beneficiaryAge, guardianPhone, serviceName, scheduledDate, scheduledTimeSlot, serviceAddress, beneficiaryLat, beneficiaryLng, caregiverId, caregiverName, caregiverLat, caregiverLng, caregiverEtaMinutes, status, specialInstructions, caregiverNotes, vitals, careTasks
        case fundingTier, fundingType
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
    case PROFILE = "Profile"

    public var id: String { rawValue }

    public var iconName: String {
        switch self {
        case .TODAY: return "heart.fill"
        case .BOOKINGS: return "calendar"
        case .HEALTH: return "cross.case.fill"
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
    case SYSTEM

    public var iconName: String {
        switch self {
        case .DISPATCH: return "figure.walk"
        case .VITALS: return "waveform.path.ecg"
        case .MEDICATION: return "pills.fill"
        case .SYSTEM: return "bell.badge.fill"
        }
    }

    public var color: Color {
        switch self {
        case .DISPATCH: return Color(hex: "0D5C3A")
        case .VITALS: return Color(hex: "2563EB")
        case .MEDICATION: return Color(hex: "E11D48")
        case .SYSTEM: return Color(hex: "0D5C3A")
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

