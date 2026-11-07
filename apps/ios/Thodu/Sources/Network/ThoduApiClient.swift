import Foundation

public final class ThoduApiClient {
    public static let shared = ThoduApiClient()
    
    // Central Live Server Domain (HTTPS)
    private let baseURL = "https://thodu.sriddha.com"
    
    private init() {}
    
    // MARK: - Auth Endpoints
    public func fetchUsers() async throws -> [AppUser] {
        guard let url = URL(string: "\(baseURL)/api/v1/auth/users") else {
            throw URLError(.badURL)
        }
        
        let (data, response) = try await URLSession.shared.data(from: url)
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw URLError(.badServerResponse)
        }
        
        let decoded = try JSONDecoder().decode(UsersListResponse.self, from: data)
        return decoded.users
    }
    
    public func loginWithOAuth(request: OAuthLoginRequest) async throws -> (AppUser, String) {
        guard let url = URL(string: "\(baseURL)/api/v1/auth/oauth") else {
            throw URLError(.badURL)
        }
        
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.httpBody = try JSONEncoder().encode(request)
        
        let (data, response) = try await URLSession.shared.data(for: urlRequest)
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw URLError(.badServerResponse)
        }
        
        let decoded = try JSONDecoder().decode(OAuthLoginResponse.self, from: data)
        guard decoded.success, let user = decoded.user, let token = decoded.token else {
            throw NSError(domain: "AuthError", code: 401, userInfo: [NSLocalizedDescriptionKey: decoded.message ?? "Authentication failed"])
        }
        
        return (user, token)
    }

    // MARK: - Beneficiary Module Endpoints
    public func fetchBeneficiaries(email: String? = nil, phone: String? = nil) async throws -> [Beneficiary] {
        var components = URLComponents(string: "\(baseURL)/api/v1/beneficiaries")
        var queryItems: [URLQueryItem] = []
        if let email = email, !email.isEmpty {
            queryItems.append(URLQueryItem(name: "email", value: email))
        }
        if let phone = phone, !phone.isEmpty {
            queryItems.append(URLQueryItem(name: "phone", value: phone))
        }
        if !queryItems.isEmpty {
            components?.queryItems = queryItems
        }
        
        guard let url = components?.url else {
            throw URLError(.badURL)
        }

        let (data, response) = try await URLSession.shared.data(from: url)
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw URLError(.badServerResponse)
        }

        let decoded = try JSONDecoder().decode(BeneficiariesResponse.self, from: data)
        return decoded.beneficiaries
    }

    public func fetchBookings() async throws -> [Booking] {
        guard let url = URL(string: "\(baseURL)/api/v1/bookings") else {
            throw URLError(.badURL)
        }

        let (data, response) = try await URLSession.shared.data(from: url)
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw URLError(.badServerResponse)
        }

        let decoded = try JSONDecoder().decode(BookingsResponse.self, from: data)
        return decoded.bookings
    }

    public func fetchServices() async throws -> [CareService] {
        guard let url = URL(string: "\(baseURL)/api/v1/services") else {
            throw URLError(.badURL)
        }

        let (data, response) = try await URLSession.shared.data(from: url)
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw URLError(.badServerResponse)
        }

        let decoded = try JSONDecoder().decode(ServicesResponse.self, from: data)
        return decoded.services
    }

    public func createBooking(request: CreateBookingRequest) async throws -> GenericResponse {
        guard let url = URL(string: "\(baseURL)/api/v1/bookings") else {
            throw URLError(.badURL)
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.httpBody = try JSONEncoder().encode(request)

        let (data, response) = try await URLSession.shared.data(for: urlRequest)
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw URLError(.badServerResponse)
        }

        return try JSONDecoder().decode(GenericResponse.self, from: data)
    }

    public func triggerSos(request: SosRequest) async throws -> GenericResponse {
        guard let url = URL(string: "\(baseURL)/api/v1/sos/queue") else {
            throw URLError(.badURL)
        }

        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "POST"
        urlRequest.setValue("application/json", forHTTPHeaderField: "Content-Type")
        urlRequest.httpBody = try JSONEncoder().encode(request)

        let (data, response) = try await URLSession.shared.data(for: urlRequest)
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw URLError(.badServerResponse)
        }

        return try JSONDecoder().decode(GenericResponse.self, from: data)
    }
}
