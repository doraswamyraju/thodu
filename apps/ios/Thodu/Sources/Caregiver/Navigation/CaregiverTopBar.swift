import SwiftUI

public struct CaregiverTopBar: View {
    public let caregiver: Caregiver
    public let availability: String
    public var onMenuTap: () -> Void
    public var onAvailabilityChanged: (String) -> Void
    public var onNotificationTap: () -> Void
    
    public init(
        caregiver: Caregiver,
        availability: String,
        onMenuTap: @escaping () -> Void,
        onAvailabilityChanged: @escaping (String) -> Void,
        onNotificationTap: @escaping () -> Void
    ) {
        self.caregiver = caregiver
        self.availability = availability
        self.onMenuTap = onMenuTap
        self.onAvailabilityChanged = onAvailabilityChanged
        self.onNotificationTap = onNotificationTap
    }
    
    public var body: some View {
        HStack(spacing: 12) {
            // Hamburger Menu Button to open sidebar
            Button(action: onMenuTap) {
                Image(systemName: "line.3.horizontal")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(Color(hex: "1F2937"))
                    .frame(width: 36, height: 36)
                    .background(Color(hex: "F3F4F6"))
                    .clipShape(Circle())
            }
            
            // Clean Brand Logo (NO "STAFF" word)
            Image("thodu_topbar_logo")
                .resizable()
                .scaledToFit()
                .frame(height: 26)
            
            Spacer()
            
            // Availability Status Menu Pill
            Menu {
                Button(action: { onAvailabilityChanged("Available") }) {
                    Label("Available for Shifts", systemImage: "checkmark.circle.fill")
                }
                Button(action: { onAvailabilityChanged("On Duty") }) {
                    Label("Currently On Duty", systemImage: "play.circle.fill")
                }
                Button(action: { onAvailabilityChanged("Off Duty") }) {
                    Label("Off Duty / Break", systemImage: "moon.fill")
                }
            } label: {
                HStack(spacing: 5) {
                    Circle()
                        .fill(statusColor)
                        .frame(width: 7, height: 7)
                    Text(availability)
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(statusTextColor)
                    Image(systemName: "chevron.down")
                        .font(.system(size: 8, weight: .bold))
                        .foregroundColor(statusTextColor)
                }
                .padding(.horizontal, 9)
                .padding(.vertical, 5)
                .background(statusBgColor)
                .cornerRadius(14)
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(statusBorderColor, lineWidth: 1)
                )
            }
            
            // Notification Bell
            Button(action: onNotificationTap) {
                ZStack(alignment: .topTrailing) {
                    Image(systemName: "bell.fill")
                        .font(.system(size: 15))
                        .foregroundColor(Color(hex: "374151"))
                    
                    Circle()
                        .fill(Color(hex: "DC2626"))
                        .frame(width: 7, height: 7)
                        .offset(x: 1, y: -2)
                }
                .frame(width: 34, height: 34)
                .background(Color(hex: "F3F4F6"))
                .clipShape(Circle())
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(Color.white)
        .overlay(
            Rectangle()
                .frame(height: 1)
                .foregroundColor(Color(hex: "E5E7EB")),
            alignment: .bottom
        )
    }
    
    private var statusColor: Color {
        switch availability {
        case "Available": return Color(hex: "16A34A")
        case "On Duty": return Color(hex: "0284C7")
        default: return Color(hex: "9CA3AF")
        }
    }
    
    private var statusTextColor: Color {
        switch availability {
        case "Available": return Color(hex: "166534")
        case "On Duty": return Color(hex: "0369A1")
        default: return Color(hex: "4B5563")
        }
    }
    
    private var statusBgColor: Color {
        switch availability {
        case "Available": return Color(hex: "DCFCE7")
        case "On Duty": return Color(hex: "E0F2FE")
        default: return Color(hex: "F3F4F6")
        }
    }
    
    private var statusBorderColor: Color {
        switch availability {
        case "Available": return Color(hex: "BBF7D0")
        case "On Duty": return Color(hex: "BAE6FD")
        default: return Color(hex: "E5E7EB")
        }
    }
}
