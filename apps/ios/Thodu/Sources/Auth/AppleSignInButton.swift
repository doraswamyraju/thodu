import SwiftUI

public struct AppleSignInButton: View {
    public let isLoading: Bool
    public let action: () -> Void
    
    public init(isLoading: Bool, action: @escaping () -> Void) {
        self.isLoading = isLoading
        self.action = action
    }
    
    public var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    Text("Authenticating with Apple...")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(.white)
                } else {
                    Image(systemName: "applelogo")
                        .font(.system(size: 18))
                        .foregroundColor(.white)
                    Text("Sign in with Apple")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(.white)
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 52)
            .background(Color.black)
            .cornerRadius(12)
        }
        .disabled(isLoading)
    }
}
