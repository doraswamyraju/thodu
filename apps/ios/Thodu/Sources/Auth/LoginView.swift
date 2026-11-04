import SwiftUI

public struct LoginView: View {
    @State private var selectedRole: String = "BENEFICIARY"
    @State private var isLoadingGoogle: Bool = false
    @State private var isLoadingApple: Bool = false
    @State private var errorMessage: String? = nil
    @State private var existingUsers: [AppUser] = []
    @State private var showUserPicker: Bool = false
    
    public var onLoginSuccess: (AppUser) -> Void
    
    public init(onLoginSuccess: @escaping (AppUser) -> Void) {
        self.onLoginSuccess = onLoginSuccess
    }
    
    private struct RoleItem: Identifiable {
        let id: String
        let title: String
        let subtitle: String
        let iconName: String
    }
    
    private let roles = [
        RoleItem(id: "BENEFICIARY", title: "Family / Elder", subtitle: "Manage loved one care & SOS", iconName: "heart.fill"),
        RoleItem(id: "CAREGIVER", title: "Salaried Caregiver", subtitle: "Duty rosters, vitals & care tasks", iconName: "cross.case.fill"),
        RoleItem(id: "FREELANCER", title: "Freelance Caregiver", subtitle: "Live gig radar & wallet payouts", iconName: "briefcase.fill"),
        RoleItem(id: "ADMIN", title: "Operations Admin", subtitle: "Fleet dispatch & monitoring", iconName: "shield.lefthalf.filled")
    ]
    
    public var body: some View {
        ScrollView {
            VStack(spacing: 24) {
                // Header Logo
                VStack(spacing: 8) {
                    ZStack {
                        Circle()
                            .fill(Color(hex: "0D5C3A").opacity(0.12))
                            .frame(width: 76, height: 76)
                        Image(systemName: "hands.sparkles.fill")
                            .font(.system(size: 36))
                            .foregroundColor(Color(hex: "0D5C3A"))
                    }
                    
                    Text("Thodu")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(Color(hex: "143627"))
                    
                    Text("Elder & Assisted Care Platform")
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(Color(hex: "4A6B5D"))
                }
                .padding(.top, 30)
                
                // Role Picker
                VStack(alignment: .leading, spacing: 10) {
                    Text("Select your access profile")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(hex: "6B7280"))
                        .padding(.horizontal, 4)
                    
                    ForEach(roles) { role in
                        let isSelected = selectedRole == role.id
                        Button(action: {
                            selectedRole = role.id
                        }) {
                            HStack(spacing: 14) {
                                ZStack {
                                    RoundedRectangle(cornerRadius: 8)
                                        .fill(isSelected ? Color(hex: "0D5C3A") : Color(hex: "F3F4F6"))
                                        .frame(width: 40, height: 40)
                                    Image(systemName: role.iconName)
                                        .font(.system(size: 18))
                                        .foregroundColor(isSelected ? .white : Color(hex: "4B5563"))
                                }
                                
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(role.title)
                                        .font(.system(size: 15, weight: .bold))
                                        .foregroundColor(isSelected ? Color(hex: "143627") : Color(hex: "1F2937"))
                                    Text(role.subtitle)
                                        .font(.system(size: 12))
                                        .foregroundColor(Color(hex: "6B7280"))
                                }
                                
                                Spacer()
                                
                                if isSelected {
                                    Image(systemName: "checkmark.circle.fill")
                                        .foregroundColor(Color(hex: "0D5C3A"))
                                        .font(.system(size: 20))
                                }
                            }
                            .padding(14)
                            .background(isSelected ? Color(hex: "E8F5E9") : Color.white)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(isSelected ? Color(hex: "0D5C3A") : Color(hex: "E5E7EB"), lineWidth: isSelected ? 2 : 1)
                            )
                            .cornerRadius(12)
                        }
                        .buttonStyle(PlainButtonStyle())
                    }
                }
                
                // Error banner
                if let err = errorMessage {
                    HStack(spacing: 8) {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .foregroundColor(Color(hex: "DC2626"))
                        Text(err)
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "991B1B"))
                    }
                    .padding(12)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(Color(hex: "FEE2E2"))
                    .cornerRadius(8)
                }
                
                // Auth Buttons: Apple & Google for iOS
                VStack(spacing: 12) {
                    AppleSignInButton(isLoading: isLoadingApple) {
                        performOAuthLogin(provider: "APPLE")
                    }
                    
                    GoogleSignInButtonIOS(isLoading: isLoadingGoogle) {
                        performOAuthLogin(provider: "GOOGLE")
                    }
                }
                
                // Live database registered accounts picker
                if !existingUsers.isEmpty {
                    VStack(spacing: 8) {
                        Button(action: {
                            showUserPicker.toggle()
                        }) {
                            HStack {
                                Image(systemName: showUserPicker ? "chevron.up" : "chevron.down")
                                    .font(.system(size: 12, weight: .semibold))
                                Text(showUserPicker ? "Hide registered database accounts" : "Select registered database account")
                                    .font(.system(size: 13, weight: .medium))
                            }
                            .foregroundColor(Color(hex: "0D5C3A"))
                        }
                        
                        if showUserPicker {
                            VStack(spacing: 6) {
                                ForEach(existingUsers) { user in
                                    Button(action: {
                                        selectedRole = user.role
                                        performOAuthLogin(provider: "GOOGLE", emailOverride: user.email, nameOverride: user.name)
                                    }) {
                                        HStack(spacing: 12) {
                                            Circle()
                                                .fill(Color(hex: "E0E7FF"))
                                                .frame(width: 34, height: 34)
                                                .overlay(
                                                    Text(String(user.name.prefix(1)))
                                                        .font(.system(size: 14, weight: .bold))
                                                        .foregroundColor(Color(hex: "3730A3"))
                                                )
                                            
                                            VStack(alignment: .leading, spacing: 2) {
                                                Text(user.name)
                                                    .font(.system(size: 13, weight: .bold))
                                                    .foregroundColor(Color(hex: "111827"))
                                                Text("\(user.email) • \(user.role)")
                                                    .font(.system(size: 11))
                                                    .foregroundColor(Color(hex: "6B7280"))
                                            }
                                            
                                            Spacer()
                                            
                                            Image(systemName: "arrow.right.circle.fill")
                                                .foregroundColor(Color(hex: "0D5C3A"))
                                        }
                                        .padding(10)
                                        .background(Color.white)
                                        .overlay(
                                            RoundedRectangle(cornerRadius: 10)
                                                .stroke(Color(hex: "E5E7EB"), lineWidth: 1)
                                        )
                                        .cornerRadius(10)
                                    }
                                    .buttonStyle(PlainButtonStyle())
                                }
                            }
                        }
                    }
                }
                
                // Sri Divyang Seva Kendram Trust subsidy badge
                HStack(spacing: 10) {
                    Image(systemName: "checkmark.shield.fill")
                        .foregroundColor(Color(hex: "475569"))
                    Text("Subsidies & grants for eligible families sponsored by Sri Divyang Seva Kendram Trust.")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "475569"))
                }
                .padding(12)
                .frame(maxWidth: .infinity)
                .background(Color(hex: "F1F5F9"))
                .cornerRadius(10)
                .padding(.top, 10)
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 30)
        }
        .background(Color(hex: "F8FAF9").ignoresSafeArea())
        .task {
            do {
                self.existingUsers = try await ThoduApiClient.shared.fetchUsers()
            } catch {
                // Silently handle
            }
        }
    }
    
    private func performOAuthLogin(provider: String, emailOverride: String? = nil, nameOverride: String? = nil) {
        if provider == "APPLE" {
            isLoadingApple = true
        } else {
            isLoadingGoogle = true
        }
        errorMessage = nil
        
        Task {
            do {
                let email = emailOverride ?? (
                    selectedRole == "BENEFICIARY" ? "anita.sharma@example.com" :
                    selectedRole == "CAREGIVER" ? "anitha.care@example.com" :
                    selectedRole == "FREELANCER" ? "suresh.kumar@example.com" : "raju@thodu.sriddha.com"
                )
                let name = nameOverride ?? (
                    selectedRole == "BENEFICIARY" ? "Anita Sharma" :
                    selectedRole == "CAREGIVER" ? "Anitha" :
                    selectedRole == "FREELANCER" ? "Suresh Kumar" : "Raju Kumar"
                )
                
                let req = OAuthLoginRequest(
                    provider: provider,
                    email: email,
                    name: name,
                    role: selectedRole,
                    idToken: "ios_\(provider.lowercased())_token_\(Date().timeIntervalSince1970)"
                )
                
                let (user, _) = try await ThoduApiClient.shared.loginWithOAuth(request: req)
                
                await MainActor.run {
                    isLoadingApple = false
                    isLoadingGoogle = false
                    onLoginSuccess(user)
                }
            } catch {
                await MainActor.run {
                    isLoadingApple = false
                    isLoadingGoogle = false
                    errorMessage = "Login failed: \(error.localizedDescription)"
                }
            }
        }
    }
}

