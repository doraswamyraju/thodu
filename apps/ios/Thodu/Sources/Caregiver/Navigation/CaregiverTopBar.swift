import SwiftUI

public struct CaregiverTopBar: View {
    public let caregiver: Caregiver
    public let availability: String
    public var onAvailabilityChanged: (String) -> Void
    public var onNotificationTap: () -> Void
    public var onLogoutTap: () -> Void
    
    public init(
        caregiver: Caregiver,
        availability: String,
        onAvailabilityChanged: @escaping (String) -> Void,
        onNotificationTap: @escaping () -> Void,
        onLogoutTap: @escaping () -> Void
    ) {
        self.caregiver = caregiver
        self.availability = availability
        self.onAvailabilityChanged = onAvailabilityChanged
        self.onNotificationTap = onNotificationTap
        self.onLogoutTap = onLogoutTap
    }
    
    public var body: some View {
        HStack(spacing: 12) {
            // Brand Logo & Sub-tag
            VStack(alignment: .leading, spacing: 1) {
                HStack(spacing: 6) {
                    Image("thodu_topbar_logo")
                        .resizable()
                        .scaledToFit()
                        .frame(height: 24)
                    
                    Text("STAFF")
                        .font(.system(size: 9, weight: .black))
                        .foregroundColor(.white)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color(hex: "047857"))
                        .cornerRadius(4)
                }
                
                Text(caregiver.zone)
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(Color(hex: "688273"))
            }
            
            Spacer()
            
            // Availability Menu Pill
            Menu {
                Button(action: { onAvailabilityChanged("Available") }) {
                    Label("Available", systemImage: "checkmark.circle.fill")
                }
                Button(action: { onAvailabilityChanged("On Duty") }) {
                    Label("On Duty", systemImage: "play.circle.fill")
                }
                Button(action: { onAvailabilityChanged("Off Duty") }) {
                    Label("Off Duty", systemImage: "moon.fill")
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
                        .font(.system(size: 9, weight: .bold))
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
                        .font(.system(size: 16))
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
            
            // Logout Button
            Button(action: onLogoutTap) {
                Image(systemName: "rectangle.portrait.and.arrow.right")
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(hex: "DC2626"))
                    .frame(width: 34, height: 34)
                    .background(Color(hex: "FEE2E2"))
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
