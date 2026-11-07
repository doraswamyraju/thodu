import SwiftUI

/// Official Google "G" Logo component conforming to Google Identity Branding Guidelines.
/// Renders the official 4-color emblem (Blue #4285F4, Red #EA4335, Yellow #FBBC05, Green #34A853).
public struct GoogleGLogo: View {
    public var size: CGFloat
    
    public init(size: CGFloat = 20) {
        self.size = size
    }
    
    public var body: some View {
        Image("google_logo")
            .resizable()
            .scaledToFit()
            .frame(width: size, height: size)
    }
}

