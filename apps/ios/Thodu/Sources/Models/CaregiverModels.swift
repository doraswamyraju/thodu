import Foundation

public enum CaregiverNavTab: String, CaseIterable, Identifiable {
    case today = "Today"
    case duty = "Active Duty"
    case schedule = "Schedule"
    case earnings = "Earnings"
    case profile = "Staff Profile"
    
    public var id: String { rawValue }
    
    public var iconName: String {
        switch self {
        case .today: return "calendar.day.timeline.left"
        case .duty: return "cross.case.fill"
        case .schedule: return "clock.arrow.circlepath"
        case .earnings: return "indianrupeesign.circle.fill"
        case .profile: return "person.crop.badge.checkmark"
        }
    }
}

public struct CaregiverChecklistItem: Codable, Identifiable, Equatable {
    public var id: String { task }
    public var task: String
    public var done: Bool
    public var time: String?
    
    public init(task: String, done: Bool, time: String? = nil) {
        self.task = task
        self.done = done
        self.time = time
    }
}

public struct Caregiver: Codable, Identifiable {
    public let id: String
    public let refNumber: String
    public var fullName: String
    public var phone: String
    public var alternatePhone: String?
    public var email: String?
    public var gender: String?
    public var age: Int?
    public var languages: [String]?
    public var photoUrl: String?
    public var address: String?
    public var pincode: String?
    public var employmentType: String
    public var verificationStatus: String
    public var rating: Double
    public var ratingReviewsCount: Int
    public var activeAssignments: Int
    public var skills: [String]
    public var zone: String
    public var availability: String // "Available", "On Duty", "Off Duty"
    public var avatarBg: String?
    public var latitude: Double
    public var longitude: Double
    public var experienceYears: Int?
    public var aadhaarNumber: String?
    public var policeClearanceStatus: String?
    public var workingShift: String?
    public var monthlySalaryInr: Int?
    
    public init(
        id: String,
        refNumber: String,
        fullName: String,
        phone: String,
        alternatePhone: String? = nil,
        email: String? = nil,
        gender: String? = "Female",
        age: Int? = 36,
        languages: [String]? = ["Telugu", "English", "Hindi"],
        photoUrl: String? = nil,
        address: String? = "#12-4-56, T.T.D. Colony, Tirupati - 517501, Andhra Pradesh",
        pincode: String? = "517501",
        employmentType: String = "Salaried",
        verificationStatus: String = "Verified",
        rating: Double = 4.9,
        ratingReviewsCount: Int = 126,
        activeAssignments: Int = 2,
        skills: [String] = ["Elder Companionship", "Cooking", "Mobility Support", "Vitals Monitoring"],
        zone: String = "Tirupati Urban",
        availability: String = "Available",
        avatarBg: String? = "#E8F5E9",
        latitude: Double = 13.6300,
        longitude: Double = 79.4215,
        experienceYears: Int? = 6,
        aadhaarNumber: String? = "XXXX-XXXX-4589",
        policeClearanceStatus: String? = "Verified",
        workingShift: String? = "Morning Shift (08:00 AM - 02:00 PM)",
        monthlySalaryInr: Int? = 22000
    ) {
        self.id = id
        self.refNumber = refNumber
        self.fullName = fullName
        self.phone = phone
        self.alternatePhone = alternatePhone
        self.email = email
        self.gender = gender
        self.age = age
        self.languages = languages
        self.photoUrl = photoUrl
        self.address = address
        self.pincode = pincode
        self.employmentType = employmentType
        self.verificationStatus = verificationStatus
        self.rating = rating
        self.ratingReviewsCount = ratingReviewsCount
        self.activeAssignments = activeAssignments
        self.skills = skills
        self.zone = zone
        self.availability = availability
        self.avatarBg = avatarBg
        self.latitude = latitude
        self.longitude = longitude
        self.experienceYears = experienceYears
        self.aadhaarNumber = aadhaarNumber
        self.policeClearanceStatus = policeClearanceStatus
        self.workingShift = workingShift
        self.monthlySalaryInr = monthlySalaryInr
    }
}

public struct CaregiversResponse: Codable {
    public let success: Bool
    public let caregivers: [Caregiver]
}

public struct UpdateBookingRequest: Codable {
    public let status: String?
    public let caregiverNotes: String?
    public let vitals: [String: String]?
    public let checklistCompleted: [CaregiverChecklistItem]?
    
    public init(status: String? = nil, caregiverNotes: String? = nil, vitals: [String: String]? = nil, checklistCompleted: [CaregiverChecklistItem]? = nil) {
        self.status = status
        self.caregiverNotes = caregiverNotes
        self.vitals = vitals
        self.checklistCompleted = checklistCompleted
    }
}

public struct SingleBookingResponse: Codable {
    public let success: Bool
    public let booking: Booking
}

public struct SalarySlipItem: Identifiable {
    public let id = UUID()
    public let month: String
    public let amount: String
    public let status: String
    public let date: String
    public let accountMasked: String
}

