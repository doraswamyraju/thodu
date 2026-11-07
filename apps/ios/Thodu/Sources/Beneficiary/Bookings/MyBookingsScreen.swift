import SwiftUI

public struct MyBookingsScreen: View {
    public let bookings: [Booking]
    public let onBookNewServiceClick: () -> Void
    public let onLiveTrackingClick: (Booking) -> Void
    public let onCallSupportClick: () -> Void
    public let onRebookClick: (Booking) -> Void

    @State private var selectedFilter: BookingFilterTab = .ALL

    public init(
        bookings: [Booking],
        onBookNewServiceClick: @escaping () -> Void,
        onLiveTrackingClick: @escaping (Booking) -> Void = { _ in },
        onCallSupportClick: @escaping () -> Void = {},
        onRebookClick: @escaping (Booking) -> Void = { _ in }
    ) {
        self.bookings = bookings
        self.onBookNewServiceClick = onBookNewServiceClick
        self.onLiveTrackingClick = onLiveTrackingClick
        self.onCallSupportClick = onCallSupportClick
        self.onRebookClick = onRebookClick
    }

    private var filteredBookings: [Booking] {
        switch selectedFilter {
        case .ALL:
            return bookings
        case .UPCOMING:
            return bookings.filter {
                $0.status.localizedCaseInsensitiveContains("Awaiting") ||
                $0.status.localizedCaseInsensitiveContains("Assigned") ||
                $0.status.localizedCaseInsensitiveContains("Upcoming") ||
                $0.status.localizedCaseInsensitiveContains("Scheduled")
            }
        case .IN_SERVICE:
            return bookings.filter {
                $0.status.localizedCaseInsensitiveContains("Progress") ||
                $0.status.localizedCaseInsensitiveContains("Service")
            }
        case .COMPLETED:
            return bookings.filter { $0.status.localizedCaseInsensitiveContains("Completed") }
        case .CANCELLED:
            return bookings.filter { $0.status.localizedCaseInsensitiveContains("Cancelled") }
        }
    }

    private func countForTab(_ tab: BookingFilterTab) -> Int {
        switch tab {
        case .ALL: return bookings.count
        case .UPCOMING:
            return bookings.count {
                $0.status.localizedCaseInsensitiveContains("Awaiting") ||
                $0.status.localizedCaseInsensitiveContains("Assigned") ||
                $0.status.localizedCaseInsensitiveContains("Upcoming") ||
                $0.status.localizedCaseInsensitiveContains("Scheduled")
            }
        case .IN_SERVICE:
            return bookings.count {
                $0.status.localizedCaseInsensitiveContains("Progress") ||
                $0.status.localizedCaseInsensitiveContains("Service")
            }
        case .COMPLETED:
            return bookings.count { $0.status.localizedCaseInsensitiveContains("Completed") }
        case .CANCELLED:
            return bookings.count { $0.status.localizedCaseInsensitiveContains("Cancelled") }
        }
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("My Bookings")
                        .font(.system(size: 24, weight: .black))
                        .foregroundColor(Color(hex: "0F3E26"))
                    Text("Track, rebook or reschedule care visits")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "64748B"))
                }

                Spacer()

                Button(action: onBookNewServiceClick) {
                    HStack(spacing: 4) {
                        Image(systemName: "plus")
                            .font(.system(size: 11, weight: .bold))
                        Text("Book Care")
                            .font(.system(size: 12, weight: .bold))
                    }
                    .foregroundColor(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 7)
                    .background(Color(hex: "0D5C3A"))
                    .cornerRadius(10)
                }
            }

            // Filter Pills Horizontal Scroll
            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 8) {
                    ForEach(BookingFilterTab.allCases) { tab in
                        let isSelected = selectedFilter == tab
                        let count = countForTab(tab)

                        Button(action: { selectedFilter = tab }) {
                            HStack(spacing: 5) {
                                Text(tab.rawValue)
                                    .font(.system(size: 12, weight: isSelected ? .bold : .medium))
                                    .foregroundColor(isSelected ? .white : Color(hex: "475569"))

                                Text("\(count)")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(isSelected ? Color(hex: "0D5C3A") : Color(hex: "64748B"))
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 1)
                                    .background(isSelected ? Color.white : Color(hex: "E2E8F0"))
                                    .clipShape(Capsule())
                            }
                            .padding(.horizontal, 12)
                            .padding(.vertical, 6)
                            .background(isSelected ? Color(hex: "0D5C3A") : Color(hex: "F1F5F9"))
                            .cornerRadius(16)
                        }
                    }
                }
            }

            // Bookings List or Empty State
            if filteredBookings.isEmpty {
                VStack(spacing: 12) {
                    Image(systemName: "calendar.badge.clock")
                        .font(.system(size: 40))
                        .foregroundColor(Color(hex: "94A3B8"))
                        .padding(.top, 24)

                    Text("No \(selectedFilter.rawValue) Bookings")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(Color(hex: "1F2937"))

                    Text("Schedule trusted in-home elder care, mobility or medical assistance.")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "64748B"))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 24)

                    Button(action: onBookNewServiceClick) {
                        Text("Schedule New Visit")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 9)
                            .background(Color(hex: "0D5C3A"))
                            .cornerRadius(12)
                    }
                    .padding(.bottom, 24)
                }
                .frame(maxWidth: .infinity)
                .background(Color(hex: "F8FAF9"))
                .cornerRadius(16)
                .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "E2E8F0"), lineWidth: 1))
            } else {
                VStack(spacing: 12) {
                    ForEach(filteredBookings) { booking in
                        BookingCardView(
                            booking: booking,
                            onLiveTrackingClick: { onLiveTrackingClick(booking) },
                            onCallSupportClick: onCallSupportClick,
                            onRebookClick: { onRebookClick(booking) }
                        )
                    }
                }
            }
        }
    }
}

public struct BookingCardView: View {
    public let booking: Booking
    public let onLiveTrackingClick: () -> Void
    public let onCallSupportClick: () -> Void
    public let onRebookClick: () -> Void

    public var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header Row: Booking # and Status Pill
            HStack {
                HStack(spacing: 6) {
                    Image(systemName: "doc.text.fill")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "0D5C3A"))
                    Text(booking.bookingNumber)
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(Color(hex: "0D5C3A"))
                }

                Spacer()

                // Status Pill
                let (statusBg, statusFg) = statusColors(booking.status)
                Text(booking.status)
                    .font(.system(size: 10.5, weight: .bold))
                    .foregroundColor(statusFg)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(statusBg)
                    .cornerRadius(10)
            }

            Divider().background(Color(hex: "F1F5F9"))

            // Service Title & Time
            HStack(alignment: .top, spacing: 12) {
                ZStack {
                    RoundedRectangle(cornerRadius: 12)
                        .fill(Color(hex: "E8F5E9"))
                        .frame(width: 44, height: 44)
                    Image(systemName: "cross.case.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "15803D"))
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text(booking.serviceName)
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(Color(hex: "0F172A"))

                    HStack(spacing: 4) {
                        Image(systemName: "calendar")
                            .font(.system(size: 10))
                            .foregroundColor(Color(hex: "64748B"))
                        Text("\(booking.scheduledDate) • \(booking.scheduledTimeSlot)")
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "64748B"))
                    }

                    HStack(spacing: 4) {
                        Image(systemName: "person.fill")
                            .font(.system(size: 10))
                            .foregroundColor(Color(hex: "64748B"))
                        Text("For: \(booking.beneficiaryName)")
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(Color(hex: "475569"))
                    }
                }

                Spacer()
            }

            // Caregiver Info Row (if assigned)
            if !booking.caregiverName.isEmpty {
                HStack(spacing: 8) {
                    Image("avatar_caregiver_anitha")
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 28, height: 28)
                        .clipShape(Circle())

                    Text("Caregiver: \(booking.caregiverName)")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(Color(hex: "1E293B"))

                    Spacer()

                    Text(booking.fundingTier)
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(Color(hex: "15803D"))
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color(hex: "DCFCE7"))
                        .cornerRadius(6)
                }
                .padding(8)
                .background(Color(hex: "F8FAF9"))
                .cornerRadius(10)
            }

            // Action Buttons
            HStack(spacing: 8) {
                if booking.status.localizedCaseInsensitiveContains("Progress") || booking.status.localizedCaseInsensitiveContains("Assigned") {
                    Button(action: onLiveTrackingClick) {
                        HStack(spacing: 4) {
                            Image(systemName: "location.fill")
                                .font(.system(size: 11))
                            Text("Live Tracking")
                                .font(.system(size: 11.5, weight: .bold))
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 34)
                        .background(Color(hex: "0D5C3A"))
                        .foregroundColor(.white)
                        .cornerRadius(10)
                    }
                } else {
                    Button(action: onRebookClick) {
                        HStack(spacing: 4) {
                            Image(systemName: "arrow.counterclockwise")
                                .font(.system(size: 11))
                            Text("Rebook Visit")
                                .font(.system(size: 11.5, weight: .bold))
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 34)
                        .background(Color(hex: "0D5C3A"))
                        .foregroundColor(.white)
                        .cornerRadius(10)
                    }
                }

                Button(action: onCallSupportClick) {
                    HStack(spacing: 4) {
                        Image(systemName: "phone")
                            .font(.system(size: 11))
                        Text("Support")
                            .font(.system(size: 11.5, weight: .semibold))
                    }
                    .frame(width: 90)
                    .frame(height: 34)
                    .background(Color.white)
                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "CBD5E1"), lineWidth: 1))
                    .foregroundColor(Color(hex: "334155"))
                    .cornerRadius(10)
                }
            }
        }
        .padding(14)
        .background(Color.white)
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "E2E8F0"), lineWidth: 1))
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.03), radius: 2, x: 0, y: 1)
    }

    private func statusColors(_ status: String) -> (Color, Color) {
        if status.localizedCaseInsensitiveContains("Progress") {
            return (Color(hex: "DCFCE7"), Color(hex: "15803D"))
        } else if status.localizedCaseInsensitiveContains("Assigned") || status.localizedCaseInsensitiveContains("Upcoming") || status.localizedCaseInsensitiveContains("Scheduled") {
            return (Color(hex: "E0F2FE"), Color(hex: "0284C7"))
        } else if status.localizedCaseInsensitiveContains("Completed") {
            return (Color(hex: "F1F5F9"), Color(hex: "475569"))
        } else if status.localizedCaseInsensitiveContains("Cancelled") {
            return (Color(hex: "FEE2E2"), Color(hex: "DC2626"))
        } else {
            return (Color(hex: "FEF3C7"), Color(hex: "D97706"))
        }
    }
}

