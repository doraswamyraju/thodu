import SwiftUI

@main
struct ThoduApp: App {
    @State private var currentUser: AppUser? = nil

    var body: some Scene {
        WindowGroup {
            if let user = currentUser {
                BeneficiaryDashboardView(
                    currentUser: user,
                    onLogout: {
                        self.currentUser = nil
                    }
                )
            } else {
                LoginView { user in
                    self.currentUser = user
                }
            }
        }
    }
}
