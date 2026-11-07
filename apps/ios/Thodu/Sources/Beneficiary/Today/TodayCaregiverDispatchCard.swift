import SwiftUI

public struct TodayCaregiverDispatchCard: View {
    public let activeBooking: Booking?
    public let onLiveTrackingClick: () -> Void
    public let onBookCareClick: () -> Void

    @State private var isPulsing = false

    public init(
        activeBooking: Booking?,
        onLiveTrackingClick: @escaping () -> Void = {},
        onBookCareClick: @escaping () -> Void = {}
    ) {
        self.activeBooking = activeBooking
        self.onLiveTrackingClick = onLiveTrackingClick
        self.onBookCareClick = onBookCareClick
    }

    public var body: some View {
        if let booking = activeBooking, !booking.status.localizedCaseInsensitiveContains("Completed") {
            // Active Caregiver Dispatched Card
            VStack(alignment: .leading, spacing: 14) {
                // Header with Pulsing Live Status
                HStack {
                    HStack(spacing: 6) {
                        // Pulsing beacon dot
                        ZStack {
                            Circle()
                                .fill(Color(hex: "0284C7").opacity(0.3))
                                .frame(width: 14, height: 14)
                                .scaleEffect(isPulsing ? 1.4 : 1.0)
                                .opacity(isPulsing ? 0.3 : 0.8)

                            Circle()
                                .fill(Color(hex: "0284C7"))
                                .frame(width: 8, height: 8)
                        }
                        .onAppear {
                            withAnimation(.easeInOut(duration: 1.2).repeatForever(autoreverses: true)) {
                                isPulsing = true
                            }
                        }

                        Text("CAREGIVER ON THE WAY")
                            .font(.system(size: 11, weight: .black))
                            .tracking(0.5)
                            .foregroundColor(Color(hex: "0369A1"))
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(Color(hex: "E0F2FE"))
                    .cornerRadius(12)

                    Spacer()

                    // ETA Pill
                    Text("ETA ~\(booking.caregiverEtaMinutes ?? 18) mins")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(Color(hex: "0369A1"))
                }

                // Progress Bar
                GeometryReader { geo in
                    ZStack(alignment: .leading) {
                        RoundedRectangle(cornerRadius: 3)
                            .fill(Color(hex: "E2E8F0"))
                            .frame(height: 6)

                        RoundedRectangle(cornerRadius: 3)
                            .fill(Color(hex: "0284C7"))
                            .frame(width: geo.size.width * 0.65, height: 6)
                    }
                }
                .frame(height: 6)

                // Caregiver Profile Info
                HStack(spacing: 12) {
                    // Caregiver Avatar
                    Image("avatar_caregiver_anitha")
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 54, height: 54)
                        .clipShape(Circle())
                        .overlay(Circle().stroke(Color(hex: "38BDF8"), lineWidth: 2))

                    VStack(alignment: .leading, spacing: 3) {
                        HStack(spacing: 6) {
                            Text(booking.caregiverName.isEmpty ? "Anitha (Caregiver)" : booking.caregiverName)
                                .font(.system(size: 15, weight: .bold))
                                .foregroundColor(Color(hex: "0F172A"))

                            Text("4.9 ★")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(Color(hex: "B45309"))
                                .padding(.horizontal, 5)
                                .padding(.vertical, 1)
                                .background(Color(hex: "FEF3C7"))
                                .cornerRadius(6)
                        }

                        Text("\(booking.serviceName) • Specialist Attendant")
                            .font(.system(size: 12))
                            .foregroundColor(Color(hex: "475569"))

                        HStack(spacing: 4) {
                            Image(systemName: "clock")
                                .font(.system(size: 11))
                                .foregroundColor(Color(hex: "64748B"))
                            Text(booking.scheduledTimeSlot.isEmpty ? "10:00 AM - 4:00 PM" : booking.scheduledTimeSlot)
                                .font(.system(size: 11.5, weight: .medium))
                                .foregroundColor(Color(hex: "64748B"))
                        }
                    }

                    Spacer()
                }

                // Action Buttons: Call & Track Location
                HStack(spacing: 10) {
                    Button(action: {
                        if let url = URL(string: "tel://+919876543210"), UIApplication.shared.canOpenURL(url) {
                            UIApplication.shared.open(url)
                        }
                    }) {
                        HStack(spacing: 6) {
                            Image(systemName: "phone.fill")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "0D5C3A"))
                            Text("Call")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: "334155"))
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 38)
                        .background(Color.white)
                        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color(hex: "CBD5E1"), lineWidth: 1))
                        .cornerRadius(12)
                    }

                    Button(action: onLiveTrackingClick) {
                        HStack(spacing: 6) {
                            Image(systemName: "location.fill")
                                .font(.system(size: 12))
                                .foregroundColor(.white)
                            Text("Track Location")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(.white)
                        }
                        .frame(maxWidth: .infinity * 1.5)
                        .frame(height: 38)
                        .background(Color(hex: "0D5C3A"))
                        .cornerRadius(12)
                    }
                }
            }
            .padding(16)
            .background(
                LinearGradient(
                    colors: [Color(hex: "F0F9FF"), Color.white],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
            .overlay(
                RoundedRectangle(cornerRadius: 20)
                    .stroke(Color(hex: "BAE6FD"), lineWidth: 1.5)
            )
            .cornerRadius(20)
            .shadow(color: Color.black.opacity(0.04), radius: 3, x: 0, y: 1)
        } else {
            // Empty State Card
            HStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(Color(hex: "DCFCE7"))
                        .frame(width: 44, height: 44)
                    Image(systemName: "cross.case.fill")
                        .font(.system(size: 20))
                        .foregroundColor(Color(hex: "15803D"))
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text("No Caregiver Dispatched")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(Color(hex: "1F2937"))
                    Text("Schedule companion, nursing or physio care")
                        .font(.system(size: 11.5))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()

                Button(action: onBookCareClick) {
                    Text("Book Care")
                        .font(.system(size: 11.5, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 7)
                        .background(Color(hex: "0D5C3A"))
                        .cornerRadius(10)
                }
            }
            .padding(14)
            .background(Color(hex: "F8FAF9"))
            .overlay(
                RoundedRectangle(cornerRadius: 18)
                    .stroke(Color(hex: "E2E8F0"), lineWidth: 1)
            )
            .cornerRadius(18)
        }
    }
}
