import SwiftUI

@main
struct ThoduApp: App {
    @State private var currentUser: AppUser? = nil

    var body: some Scene {
        WindowGroup {
            Group {
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
            .preferredColorScheme(.light)
        }
    }
}
