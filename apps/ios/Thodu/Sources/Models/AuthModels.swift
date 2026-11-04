import Foundation

public struct AppUser: Codable, Identifiable {
    public let id: String
    public let email: String
    public let name: String
    public let avatarUrl: String?
    public let role: String // BENEFICIARY, CAREGIVER, FREELANCER, ADMIN
    public let provider: String // GOOGLE, APPLE
    public let phone: String?
    public let createdAt: String?
    public let lastLoginAt: String?
}

public struct OAuthLoginRequest: Codable {
    public let provider: String
    public let email: String
    public let name: String
    public let role: String
    public let photoUrl: String?
    public let idToken: String?
    
    public init(provider: String, email: String, name: String, role: String, photoUrl: String? = nil, idToken: String? = nil) {
        self.provider = provider
        self.email = email
        self.name = name
        self.role = role
        self.photoUrl = photoUrl
        self.idToken = idToken
    }
}

public struct OAuthLoginResponse: Codable {
    public let success: BooleanLiteralType
    public let user: AppUser?
    public let token: String?
    public let message: String?
}

public struct UsersListResponse: Codable {
    public let success: Bool
    public let count: Int
    public let users: [AppUser]
}

