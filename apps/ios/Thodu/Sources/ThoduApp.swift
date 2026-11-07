import SwiftUI

@main
struct ThoduApp: App {
    @State private var currentUser: AppUser? = nil

    var body: some Scene {
        WindowGroup {
            if currentUser != nil {
                FamilyDashboardView()
            } else {
                LoginView { user in
                    self.currentUser = user
                }
            }
        }
    }
}
