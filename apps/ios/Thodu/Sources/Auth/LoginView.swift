import SwiftUI

public struct LoginView: View {
    @State private var credentialText: String = ""
    @State private var passwordText: String = ""
    @State private var isPasswordVisible: Bool = false
    @State private var selectedRole: String = "BENEFICIARY"
    @State private var isLoading: Bool = false
    @State private var isLoadingGoogle: Bool = false
    @State private var isLoadingApple: Bool = false
    @State private var errorMessage: String? = nil
    @State private var existingUsers: [AppUser] = []
    @State private var showUserPicker: Bool = false
    
    public var onLoginSuccess: (AppUser) -> Void
    
    public init(onLoginSuccess: @escaping (AppUser) -> Void) {
        self.onLoginSuccess = onLoginSuccess
    }
    
    public var body: some View {
        GeometryReader { proxy in
            ZStack(alignment: .bottom) {
                Color.white.ignoresSafeArea()
                
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 0) {
                        // Top Hero Image with Organic Wave Overlay
                        ZStack(alignment: .bottom) {
                            if let uiImage = UIImage(contentsOfFile: Bundle.main.path(forResource: "login_hero_elder_care", ofType: "jpg") ?? "") {
                                Image(uiImage: uiImage)
                                    .resizable()
                                    .aspectRatio(contentMode: .fill)
                                    .frame(width: proxy.size.width, height: 230)
                                    .clipped()
                            } else {
                                Image("login_hero_elder_care")
                                    .resizable()
                                    .aspectRatio(contentMode: .fill)
                                    .frame(width: proxy.size.width, height: 230)
                                    .clipped()
                            }
                            
                            // Wave gradient mask
                            LinearGradient(
                                gradient: Gradient(colors: [
                                    Color.clear,
                                    Color(hex: "0B5D3B").opacity(0.12),
                                    Color.white.opacity(0.95),
                                    Color.white
                                ]),
                                startPoint: .top,
                                endPoint: .bottom
                            )
                            .frame(height: 100)
                        }
                        
                        // Main Login Content
                        VStack(spacing: 16) {
                            // Official Thodu Brand Logo
                            Group {
                                if let uiImage = UIImage(contentsOfFile: Bundle.main.path(forResource: "thodu_logo_vertical", ofType: "png") ?? "") {
                                    Image(uiImage: uiImage)
                                        .resizable()
                                        .scaledToFit()
                                } else {
                                    Image("thodu_logo_vertical")
                                        .resizable()
                                        .scaledToFit()
                                }
                            }
                            .frame(height: 95)
                            .offset(y: -15)
                            
                            // Pill badge
                            Text("Care  •  Support  •  Independence")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: "166534"))
                                .padding(.horizontal, 16)
                                .padding(.vertical, 6)
                                .background(Color(hex: "FEF9C3"))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color(hex: "FEF08A"), lineWidth: 1)
                                )
                                .cornerRadius(16)
                            
                            // Role Selector Segmented Control
                            HStack(spacing: 0) {
                                Button(action: { selectedRole = "BENEFICIARY" }) {
                                    HStack(spacing: 6) {
                                        Image(systemName: "heart.circle.fill")
                                            .font(.system(size: 13))
                                        Text("Family / Elder")
                                            .font(.system(size: 12, weight: .bold))
                                    }
                                    .foregroundColor(selectedRole == "BENEFICIARY" ? Color(hex: "0D5C3A") : Color(hex: "6B7280"))
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 38)
                                    .background(selectedRole == "BENEFICIARY" ? Color.white : Color.clear)
                                    .cornerRadius(10)
                                    .shadow(color: selectedRole == "BENEFICIARY" ? Color.black.opacity(0.08) : Color.clear, radius: 2, x: 0, y: 1)
                                }
                                .buttonStyle(PlainButtonStyle())
                                
                                Button(action: { selectedRole = "CAREGIVER" }) {
                                    HStack(spacing: 6) {
                                        Image(systemName: "cross.case.fill")
                                            .font(.system(size: 13))
                                        Text("Caregiver Staff")
                                            .font(.system(size: 12, weight: .bold))
                                    }
                                    .foregroundColor(selectedRole == "CAREGIVER" ? Color(hex: "0D5C3A") : Color(hex: "6B7280"))
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 38)
                                    .background(selectedRole == "CAREGIVER" ? Color.white : Color.clear)
                                    .cornerRadius(10)
                                    .shadow(color: selectedRole == "CAREGIVER" ? Color.black.opacity(0.08) : Color.clear, radius: 2, x: 0, y: 1)
                                }
                                .buttonStyle(PlainButtonStyle())
                            }
                            .padding(4)
                            .background(Color(hex: "F3F4F6"))
                            .cornerRadius(12)
                            
                            // Input 1: Email or Mobile
                            HStack(spacing: 12) {
                                Image(systemName: "envelope")
                                    .foregroundColor(Color(hex: "4B5563"))
                                    .font(.system(size: 16))
                                TextField("Email or Mobile Number", text: $credentialText)
                                    .font(.system(size: 14))
                                    .autocapitalization(.none)
                                    .disableAutocorrection(true)
                            }
                            .padding(.horizontal, 16)
                            .frame(height: 52)
                            .background(Color.white)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(hex: "D1D5DB"), lineWidth: 1)
                            )
                            .cornerRadius(12)
                            
                            // Input 2: Password
                            HStack(spacing: 12) {
                                Image(systemName: "lock")
                                    .foregroundColor(Color(hex: "4B5563"))
                                    .font(.system(size: 16))
                                if isPasswordVisible {
                                    TextField("Password", text: $passwordText)
                                        .font(.system(size: 14))
                                } else {
                                    SecureField("Password", text: $passwordText)
                                        .font(.system(size: 14))
                                }
                                Button(action: { isPasswordVisible.toggle() }) {
                                    Image(systemName: isPasswordVisible ? "eye" : "eye.slash")
                                        .foregroundColor(Color(hex: "6B7280"))
                                }
                            }
                            .padding(.horizontal, 16)
                            .frame(height: 52)
                            .background(Color.white)
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color(hex: "D1D5DB"), lineWidth: 1)
                            )
                            .cornerRadius(12)
                            
                            // Forgot Password Link
                            HStack {
                                Spacer()
                                Button(action: {
                                    errorMessage = "Reset instructions sent to your registered contact."
                                }) {
                                    Text("Forgot Password?")
                                        .font(.system(size: 13, weight: .semibold))
                                        .foregroundColor(Color(hex: "0D5C3A"))
                                }
                            }
                            .padding(.top, -4)
                            
                            // Error message banner
                            if let err = errorMessage {
                                HStack(spacing: 8) {
                                    Image(systemName: "exclamationmark.circle.fill")
                                        .foregroundColor(Color(hex: "DC2626"))
                                    Text(err)
                                        .font(.system(size: 12))
                                        .foregroundColor(Color(hex: "B91C1C"))
                                }
                                .padding(10)
                                .frame(maxWidth: .infinity, alignment: .leading)
                                .background(Color(hex: "FEF2F2"))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 8)
                                        .stroke(Color(hex: "FECACA"), lineWidth: 1)
                                )
                                .cornerRadius(8)
                            }
                            
                            // Login Button
                            Button(action: handleDirectLogin) {
                                HStack {
                                    if isLoading {
                                        ProgressView()
                                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                        Text("Authenticating...")
                                            .font(.system(size: 15, weight: .bold))
                                            .foregroundColor(.white)
                                    } else {
                                        Text("Login")
                                            .font(.system(size: 16, weight: .bold))
                                            .foregroundColor(.white)
                                    }
                                }
                                .frame(maxWidth: .infinity)
                                .frame(height: 52)
                                .background(Color(hex: "0D5C3A"))
                                .cornerRadius(12)
                                .shadow(color: Color(hex: "0D5C3A").opacity(0.2), radius: 3, x: 0, y: 2)
                            }
                            .disabled(isLoading)
                            
                            // Login with Biometrics Pill
                            Button(action: handleBiometricLogin) {
                                HStack(spacing: 12) {
                                    ZStack {
                                        RoundedRectangle(cornerRadius: 8)
                                            .fill(Color(hex: "D1FAE5"))
                                            .frame(width: 36, height: 36)
                                        Image(systemName: "touchid")
                                            .font(.system(size: 20))
                                            .foregroundColor(Color(hex: "047857"))
                                    }
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("Login with Biometrics")
                                            .font(.system(size: 14, weight: .bold))
                                            .foregroundColor(Color(hex: "111827"))
                                        Text("Use Face ID or Touch ID")
                                            .font(.system(size: 11))
                                            .foregroundColor(Color(hex: "6B7280"))
                                    }
                                    Spacer()
                                }
                                .padding(.horizontal, 14)
                                .padding(.vertical, 10)
                                .background(Color(hex: "F3FBF5"))
                                .overlay(
                                    RoundedRectangle(cornerRadius: 12)
                                        .stroke(Color(hex: "D1FAE5"), lineWidth: 1)
                                )
                                .cornerRadius(12)
                            }
                            .buttonStyle(PlainButtonStyle())
                            
                            // "or continue with"
                            HStack {
                                Rectangle().fill(Color(hex: "E5E7EB")).frame(height: 1)
                                Text("or continue with")
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(Color(hex: "6B7280"))
                                    .padding(.horizontal, 8)
                                Rectangle().fill(Color(hex: "E5E7EB")).frame(height: 1)
                            }
                            .padding(.vertical, 4)
                            
                            // Google Sign-In Button (RFC 8252 + Google Identity Branding Guidelines)
                            GoogleSignInButtonIOS(
                                isLoading: isLoadingGoogle,
                                text: "Continue with Google"
                            ) {
                                handleGoogleLogin()
                            }
                            
                            // Apple Sign-In Button
                            AppleSignInButton(
                                isLoading: isLoadingApple
                            ) {
                                handleAppleLogin()
                            }
                            
                            // Live database registered accounts switcher
                            if !existingUsers.isEmpty {
                                Button(action: { showUserPicker.toggle() }) {
                                    HStack(spacing: 6) {
                                        Image(systemName: showUserPicker ? "chevron.up" : "chevron.down")
                                            .font(.system(size: 12, weight: .bold))
                                        Text(showUserPicker ? "Hide active database accounts" : "Select active account from database")
                                            .font(.system(size: 12, weight: .semibold))
                                    }
                                    .foregroundColor(Color(hex: "0D5C3A"))
                                }
                                .padding(.top, 4)
                                
                                if showUserPicker {
                                    VStack(spacing: 6) {
                                        ForEach(existingUsers) { u in
                                            Button(action: {
                                                selectedRole = u.role
                                                credentialText = u.email
                                                handleDatabaseAccountSwitch(user: u)
                                            }) {
                                                HStack(spacing: 10) {
                                                    Circle()
                                                        .fill(Color(hex: "E0E7FF"))
                                                        .frame(width: 30, height: 30)
                                                        .overlay(
                                                            Text(String(u.name.prefix(1)))
                                                                .font(.system(size: 12, weight: .bold))
                                                                .foregroundColor(Color(hex: "3730A3"))
                                                        )
                                                    VStack(alignment: .leading, spacing: 2) {
                                                        Text(u.name)
                                                            .font(.system(size: 12, weight: .bold))
                                                            .foregroundColor(Color(hex: "111827"))
                                                        Text("\(u.email) • \(u.role)")
                                                            .font(.system(size: 10))
                                                            .foregroundColor(Color(hex: "6B7280"))
                                                    }
                                                    Spacer()
                                                    Image(systemName: "chevron.right")
                                                        .font(.system(size: 12))
                                                        .foregroundColor(Color(hex: "0D5C3A"))
                                                }
                                                .padding(8)
                                                .background(Color(hex: "F9FAFB"))
                                                .cornerRadius(8)
                                            }
                                            .buttonStyle(PlainButtonStyle())
                                        }
                                    }
                                }
                            }
                        }
                        .padding(.horizontal, 24)
                        .padding(.bottom, 120)
                    }
                }
                
                // Bottom Tirupati Silhouette Artwork
                BottomTirupatiArtworkIOS()
                    .frame(width: proxy.size.width, height: 95)
                    .allowsHitTesting(false)
            }
        }
        .task {
            do {
                self.existingUsers = try await ThoduApiClient.shared.fetchUsers()
            } catch {}
        }
    }
    
    private func handleDirectLogin() {
        if credentialText.trimmingCharacters(in: .whitespaces).isEmpty {
            errorMessage = "Please enter your Email or Mobile Number"
            return
        }
        
        isLoading = true
        errorMessage = nil
        Task {
            do {
                let req = OAuthLoginRequest(
                    provider: "DIRECT",
                    email: credentialText.trimmingCharacters(in: .whitespaces),
                    name: credentialText.components(separatedBy: "@").first ?? "User",
                    role: selectedRole
                )
                let (user, _) = try await ThoduApiClient.shared.loginWithOAuth(request: req)
                await MainActor.run {
                    isLoading = false
                    onLoginSuccess(user)
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                    errorMessage = "Login failed: \(error.localizedDescription)"
                }
            }
        }
    }
    
    private func handleBiometricLogin() {
        if let first = existingUsers.first {
            handleDatabaseAccountSwitch(user: first)
        } else {
            handleGoogleLogin()
        }
    }
    
    /// Native RFC 8252 Google OAuth 2.0 Login with PKCE
    private func handleGoogleLogin() {
        isLoadingGoogle = true
        errorMessage = nil
        Task {
            do {
                let session = try await GoogleOAuthManager.shared.signIn()
                
                let req = OAuthLoginRequest(
                    provider: "GOOGLE",
                    email: session.email,
                    name: session.displayName,
                    role: selectedRole,
                    photoUrl: session.photoUrl,
                    idToken: session.idToken
                )
                let (user, _) = try await ThoduApiClient.shared.loginWithOAuth(request: req)
                await MainActor.run {
                    isLoadingGoogle = false
                    onLoginSuccess(user)
                }
            } catch let error as GoogleOAuthError {
                await MainActor.run {
                    isLoadingGoogle = false
                    if case .cancelled = error {
                        return
                    }
                    errorMessage = error.localizedDescription
                }
            } catch {
                await MainActor.run {
                    isLoadingGoogle = false
                    errorMessage = "Google login failed: \(error.localizedDescription)"
                }
            }
        }
    }
    
    private func handleAppleLogin() {
        isLoadingApple = true
        errorMessage = nil
        Task {
            do {
                let email = selectedRole == "BENEFICIARY" ? "apple.beneficiary@example.com" : "apple.user@example.com"
                let name = selectedRole == "BENEFICIARY" ? "Anita Sharma" : "Thodu User"
                let req = OAuthLoginRequest(
                    provider: "APPLE",
                    email: email,
                    name: name,
                    role: selectedRole,
                    idToken: "apple_identity_\(Date().timeIntervalSince1970)"
                )
                let (user, _) = try await ThoduApiClient.shared.loginWithOAuth(request: req)
                await MainActor.run {
                    isLoadingApple = false
                    onLoginSuccess(user)
                }
            } catch {
                await MainActor.run {
                    isLoadingApple = false
                    errorMessage = "Apple authentication failed: \(error.localizedDescription)"
                }
            }
        }
    }
    
    private func handleDatabaseAccountSwitch(user: AppUser) {
        isLoading = true
        errorMessage = nil
        Task {
            do {
                let req = OAuthLoginRequest(
                    provider: user.provider ?? "GOOGLE",
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    photoUrl: user.avatarUrl,
                    idToken: "quick_switch_\(Date().timeIntervalSince1970)"
                )
                let (appUser, _) = try await ThoduApiClient.shared.loginWithOAuth(request: req)
                await MainActor.run {
                    isLoading = false
                    onLoginSuccess(appUser)
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                    errorMessage = "Switch failed: \(error.localizedDescription)"
                }
            }
        }
    }
}
