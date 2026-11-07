import SwiftUI

public extension Color {
    static let thoduForestGreen = Color(red: 11/255, green: 93/255, blue: 59/255)
    static let thoduSecondaryGreen = Color(red: 46/255, green: 125/255, blue: 50/255)
    static let thoduAccentYellow = Color(red: 249/255, green: 178/255, blue: 51/255)
    static let thoduHighlightRose = Color(red: 216/255, green: 27/255, blue: 96/255)
    static let thoduWarmCream = Color(red: 255/255, green: 248/255, blue: 230/255)
    static let thoduDangerRed = Color(red: 198/255, green: 40/255, blue: 40/255)
    static let thoduTextPrimary = Color(red: 30/255, green: 45/255, blue: 36/255)
    static let thoduTextMuted = Color(red: 107/255, green: 124/255, blue: 114/255)

    public init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}


