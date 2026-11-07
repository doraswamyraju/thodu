import SwiftUI

public struct NotificationsBottomSheet: View {
    public let onDismiss: () -> Void

    @State private var notifications: [AppNotification] = [
        AppNotification(id: "n1", title: "Caregiver Dispatched", description: "Anitha is on the way for Household Support visit (ETA: ~18 mins).", timestamp: "10:00 AM", type: .DISPATCH, isRead: false),
        AppNotification(id: "n2", title: "Clinical Vitals Recorded", description: "Blood pressure recorded: 124/82 mmHg, Pulse: 74 bpm, Sugar: 110 mg/dL.", timestamp: "09:15 AM", type: .VITALS, isRead: false),
        AppNotification(id: "n3", title: "Trust Grant 100% Approved", description: "Sri Divyang Seva Kendram Trust approved 100% home care subsidy for Saraswathi Amma.", timestamp: "Yesterday", type: .SUBSIDY, isRead: true),
        AppNotification(id: "n4", title: "Evening Medication Reminder", description: "Amlodipine 5mg & Metformin 500mg due with dinner at 8:00 PM.", timestamp: "Yesterday", type: .MEDICATION, isRead: true)
    ]

    public init(onDismiss: @escaping () -> Void) {
        self.onDismiss = onDismiss
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack {
                HStack(spacing: 8) {
                    Image(systemName: "bell.fill")
                        .foregroundColor(Color(hex: "0D5C3A"))
                    Text("Notifications")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "0F3E26"))
                }

                Spacer()

                Button(action: markAllAsRead) {
                    Text("Mark all read")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(Color(hex: "0D5C3A"))
                }

                Button(action: onDismiss) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "94A3B8"))
                }
                .padding(.leading, 6)
            }

            Divider()

            ScrollView {
                VStack(spacing: 10) {
                    ForEach(notifications) { notif in
                        HStack(alignment: .top, spacing: 12) {
                            ZStack {
                                Circle()
                                    .fill(notif.type.color.opacity(0.12))
                                    .frame(width: 38, height: 38)
                                Image(systemName: notif.type.iconName)
                                    .font(.system(size: 16))
                                    .foregroundColor(notif.type.color)
                            }

                            VStack(alignment: .leading, spacing: 3) {
                                HStack {
                                    Text(notif.title)
                                        .font(.system(size: 13, weight: .bold))
                                        .foregroundColor(Color(hex: "0F172A"))
                                    Spacer()
                                    Text(notif.timestamp)
                                        .font(.system(size: 11))
                                        .foregroundColor(Color(hex: "94A3B8"))
                                }

                                Text(notif.description)
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "475569"))
                                    .lineSpacing(2)
                            }

                            if !notif.isRead {
                                Circle()
                                    .fill(Color(hex: "DC2626"))
                                    .frame(width: 7, height: 7)
                                    .padding(.top, 4)
                            }
                        }
                        .padding(12)
                        .background(notif.isRead ? Color.white : Color(hex: "F0FDF4"))
                        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "E2E8F0"), lineWidth: 1))
                        .cornerRadius(12)
                    }
                }
            }
        }
        .padding(20)
        .background(Color.white)
        .cornerRadius(20)
    }

    private func markAllAsRead() {
        for i in notifications.indices {
            notifications[i].isRead = true
        }
    }
}

