import SwiftUI

/**
 * Standard Google Sign-In Button for iOS conforming to Google Identity Branding Guidelines:
 * - Official 4-color Google "G" logo
 * - Pure white background (#FFFFFF) with 1pt border (#D1D5DB)
 * - 52pt height with 12pt rounded corners
 * - "Continue with Google" typography in #1F2937 (15pt SemiBold)
 * - Animated progress spinner and feedback during RFC 8252 OAuth flow
 */
public struct GoogleSignInButtonIOS: View {
    public let isLoading: Bool
    public let text: String
    public let isCompact: Bool
    public let action: () -> Void
    
    public init(
        isLoading: Bool,
        text: String = "Continue with Google",
        isCompact: Bool = false,
        action: @escaping () -> Void
    ) {
        self.isLoading = isLoading
        self.text = text
        self.isCompact = isCompact
        self.action = action
    }
    
    public var body: some View {
        Button(action: action) {
            HStack(spacing: 12) {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "0D5C3A")))
                        .scaleEffect(0.9)
                    
                    Text(isCompact ? "Connecting..." : "Connecting to Google...")
                        .font(.system(size: 15, weight: .semibold))
                        .foregroundColor(Color(hex: "374151"))
                } else {
                    GoogleGLogo(size: 20)
                    
                    Text(isCompact ? "Google" : text)
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
