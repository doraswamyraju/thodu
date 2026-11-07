import SwiftUI

/// Universal avatar component that handles remote image URLs (e.g. Google profile pictures, backend avatars)
/// with graceful fallback to user initials and robust image caching/scaling.
public struct ThoduAvatarView: View {
    public let urlString: String?
    public let fallbackName: String
    public let size: CGFloat
    public let borderColor: Color
    public let borderWidth: CGFloat
    public let backgroundColor: Color
    
    public init(
        urlString: String?,
        fallbackName: String = "User",
        size: CGFloat = 40,
        borderColor: Color = .clear,
        borderWidth: CGFloat = 0,
        backgroundColor: Color = Color(hex: "0D5C3A").opacity(0.12)
    ) {
        self.urlString = urlString
        self.fallbackName = fallbackName
        self.size = size
        self.borderColor = borderColor
        self.borderWidth = borderWidth
        self.backgroundColor = backgroundColor
    }
    
    public var body: some View {
        Group {
            if let urlString = urlString, let url = URL(string: urlString), !urlString.isEmpty {
                AsyncImage(url: url) { phase in
                    switch phase {
                    case .success(let image):
                        image
                            .resizable()
                            .aspectRatio(contentMode: .fill)
                    case .failure, .empty:
                        fallbackInitials
                    @unknown default:
                        fallbackInitials
                    }
                }
            } else {
                fallbackInitials
            }
        }
        .frame(width: size, height: size)
        .clipShape(Circle())
        .overlay(Circle().stroke(borderColor, lineWidth: borderWidth))
    }
    
    private var fallbackInitials: some View {
        ZStack {
            Circle().fill(backgroundColor)
            
            Text(String(fallbackName.trimmingCharacters(in: .whitespaces).prefix(1)).uppercased())
                .font(.system(size: size * 0.42, weight: .bold))
                .foregroundColor(Color(hex: "0D5C3A"))
        }
    }
}
