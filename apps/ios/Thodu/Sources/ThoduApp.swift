import SwiftUI

@main
struct ThoduApp: App {
    @State private var currentUser: AppUser? = nil

    var body: some Scene {
        WindowGroup {
            Group {
                if let user = currentUser {
                    if user.role.uppercased() == "CAREGIVER" {
                        CaregiverDashboardView(
                            currentUser: user,
                            onSwitchRole: {
                                // Switch role to Beneficiary
                                self.currentUser = AppUser(
                                    id: user.id,
                                    email: user.email,
                                    name: user.name,
                                    avatarUrl: user.avatarUrl,
                                    role: "BENEFICIARY",
                                    provider: user.provider,
                                    phone: user.phone,
                                    createdAt: user.createdAt,
                                    lastLoginAt: user.lastLoginAt
                                )
                            },
                            onLogout: {
                                self.currentUser = nil
                            }
                        )
                    } else {
                        BeneficiaryDashboardView(
                            currentUser: user,
                            onSwitchRole: {
                                // Switch role to Caregiver
                                self.currentUser = AppUser(
                                    id: user.id,
                                    email: user.email,
                                    name: user.name,
                                    avatarUrl: user.avatarUrl,
                                    role: "CAREGIVER",
                                    provider: user.provider,
                                    phone: user.phone,
                                    createdAt: user.createdAt,
                                    lastLoginAt: user.lastLoginAt
                                )
                            },
                            onLogout: {
                                self.currentUser = nil
                            }
                        )
                    }
                } else {
                    LoginView { user in
                        self.currentUser = user
                    }
                }
            }
            .preferredColorScheme(.light)
        }
    }
}
