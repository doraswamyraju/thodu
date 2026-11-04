import Foundation

public final class ThoduApiClient {
    public static let shared = ThoduApiClient()
    
    // Central Live Server Domain (HTTPS)
    private let baseURL = "https://thodu.sriddha.com"
    
    private init() {}
    
    public func fetchUsers() async throws -> [AppUser] {
        guard let url = URL(string: "\(baseURL)/api/v1/auth/users") else {
            throw URLError(.badURL)
        }
        
        let (data, response) = try await URLSession.shared.data(from: url)
        guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
            throw URLError(.badServerResponse)
        }
        
        let decoded = try JSONDecoder().decode(UsersListResponse.self, data: data)
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
        
        let decoded = try JSONDecoder().decode(OAuthLoginResponse.self, data: data)
        guard decoded.success, let user = decoded.user, let token = decoded.token else {
            throw NSError(domain: "AuthError", code: 401, userInfo: [NSLocalizedDescriptionKey: decoded.message ?? "Authentication failed"])
        }
        
        return (user, token)
    }
}

