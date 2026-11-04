import SwiftUI

public struct GoogleSignInButtonIOS: View {
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
                        .progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "0D5C3A")))
                    Text("Authenticating with Google...")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(Color(hex: "374151"))
                } else {
                    Text("G")
                        .font(.system(size: 18, weight: .black))
                        .foregroundColor(Color(hex: "4285F4"))
                    
                    Text("Continue with Google")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(Color(hex: "1F2937"))
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 52)
            .background(Color.white)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color(hex: "D1D5DB"), lineWidth: 1)
            )
            .cornerRadius(12)
            .shadow(color: Color.black.opacity(0.04), radius: 2, x: 0, y: 1)
        }
        .disabled(isLoading)
    }
}

