import SwiftUI

public struct CaregiverTodayTabContent: View {
    public let caregiver: Caregiver
    public let bookings: [Booking]
    public var onStartShift: (Booking) -> Void
    public var onOpenActiveDuty: () -> Void
    public var onRefresh: () -> Void
    
    public init(
        caregiver: Caregiver,
        bookings: [Booking],
        onStartShift: @escaping (Booking) -> Void,
        onOpenActiveDuty: @escaping () -> Void,
        onRefresh: @escaping () -> Void
    ) {
        self.caregiver = caregiver
        self.bookings = bookings
        self.onStartShift = onStartShift
        self.onOpenActiveDuty = onOpenActiveDuty
        self.onRefresh = onRefresh
    }
    
    private var myVisits: [Booking] {
        bookings.filter { b in
            b.caregiverName.localizedCaseInsensitiveContains(caregiver.fullName) ||
            caregiver.fullName.localizedCaseInsensitiveContains(b.caregiverName) ||
            b.caregiverId == caregiver.id
        }
    }
    
    private var activeVisit: Booking? {
        myVisits.first { $0.status == "In Progress" }
    }
    
    private var completedCount: Int {
        myVisits.filter { $0.status == "Completed" }.count
    }
    
    private var upcomingVisits: [Booking] {
        myVisits.filter { $0.status != "Completed" && $0.status != "In Progress" }
    }
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 20) {
                // 1. WELCOME & SHIFT ROSTER HERO
                VStack(alignment: .leading, spacing: 14) {
                    HStack(alignment: .top) {
                        VStack(alignment: .leading, spacing: 6) {
                            Text("● SALARIED CAREGIVER WORKFORCE")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(Color(hex: "A7F3D0"))
                                .padding(.horizontal, 8)
                                .padding(.vertical, 3)
                                .background(Color.white.opacity(0.15))
                                .cornerRadius(12)
                            
                            Text("Good Day, \(caregiver.fullName)!")
                                .font(.system(size: 22, weight: .bold))
                                .foregroundColor(.white)
                            
                            Text("Shift: \(caregiver.workingShift ?? "Morning Shift (08:00 AM - 02:00 PM)")\nZone: \(caregiver.zone)")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "C4D6CC"))
                                .lineSpacing(3)
                        }
                        
                        Spacer()
                        
                        // Shift stats pills
                        VStack(spacing: 8) {
                            VStack(spacing: 2) {
                                Text("SHIFTS")
                                    .font(.system(size: 9, weight: .bold))
                                    .foregroundColor(Color(hex: "A7F3D0"))
                                Text("\(myVisits.count)")
                                    .font(.system(size: 18, weight: .black))
                                    .foregroundColor(.white)
                            }
                            .frame(width: 68, height: 48)
                            .background(Color.white.opacity(0.12))
                            .cornerRadius(10)
                            
                            VStack(spacing: 2) {
                                Text("DONE")
                                    .font(.system(size: 9, weight: .bold))
                                    .foregroundColor(Color(hex: "A7F3D0"))
                                Text("\(completedCount)")
                                    .font(.system(size: 18, weight: .black))
                                    .foregroundColor(.white)
                            }
                            .frame(width: 68, height: 48)
                            .background(Color.white.opacity(0.12))
                            .cornerRadius(10)
                        }
                    }
                }
                .padding(20)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(
                    LinearGradient(
                        colors: [Color(hex: "063A24"), Color(hex: "0B4D31")],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .cornerRadius(20)
                
                // 2. ACTIVE VISIT HIGHLIGHT (If In-Progress)
                if let active = activeVisit {
                    VStack(alignment: .leading, spacing: 14) {
                        HStack(spacing: 12) {
                            ZStack {
                                RoundedRectangle(cornerRadius: 12)
                                    .fill(Color(hex: "DCFCE7"))
                                    .frame(width: 44, height: 44)
                                Image(systemName: "clock.badge.checkmark.fill")
                                    .font(.system(size: 20))
                                    .foregroundColor(Color(hex: "166534"))
                            }
                            
                            VStack(alignment: .leading, spacing: 2) {
                                Text("CURRENT ACTIVE SHIFT")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(Color(hex: "166534"))
                                Text(active.beneficiaryName)
                                    .font(.system(size: 17, weight: .bold))
                                    .foregroundColor(Color(hex: "1B382B"))
                                Text("\(active.serviceName) • \(active.scheduledTimeSlot)")
                                    .font(.system(size: 12))
                                    .foregroundColor(Color(hex: "5A6E63"))
                            }
                            
                            Spacer()
                        }
                        
                        Button(action: onOpenActiveDuty) {
                            HStack(spacing: 6) {
                                Text("Open Active Shift Workspace")
                                    .font(.system(size: 14, weight: .bold))
                                Image(systemName: "arrow.right")
                                    .font(.system(size: 12, weight: .bold))
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 44)
                            .background(Color(hex: "16A34A"))
                            .cornerRadius(12)
                        }
                    }
                    .padding(16)
                    .background(Color.white)
                    .cornerRadius(18)
                    .overlay(
                        RoundedRectangle(cornerRadius: 18)
                            .stroke(Color(hex: "16A34A"), lineWidth: 2)
                    )
                    .shadow(color: Color(hex: "16A34A").opacity(0.12), radius: 8, x: 0, y: 4)
                }
                
                // 3. TODAY'S SCHEDULED VISITS LIST
                VStack(alignment: .leading, spacing: 14) {
                    HStack {
                        Text("Today's Assigned Shifts")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "1B382B"))
                        Spacer()
                        Button(action: onRefresh) {
                            Image(systemName: "arrow.clockwise")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(Color(hex: "0B5D3B"))
                        }
                    }
                    
                    if upcomingVisits.isEmpty && activeVisit == nil {
                        VStack(spacing: 8) {
                            Image(systemName: "checkmark.seal.fill")
                                .font(.system(size: 36))
                                .foregroundColor(Color(hex: "CBD5E1"))
                            Text("All scheduled shifts for today are completed!")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(Color(hex: "64748B"))
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 32)
                        .background(Color.white)
                        .cornerRadius(16)
                    } else {
                        ForEach(upcomingVisits) { visit in
                            VStack(alignment: .leading, spacing: 12) {
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(visit.beneficiaryName)
                                            .font(.system(size: 16, weight: .bold))
                                            .foregroundColor(Color(hex: "1B382B"))
                                        Text("\(visit.serviceName) • Ref: \(visit.bookingNumber)")
                                            .font(.system(size: 12))
                                            .foregroundColor(Color(hex: "688273"))
                                    }
                                    Spacer()
                                    
                                    // Call elder guardian
                                    if let url = URL(string: "tel://\(visit.guardianPhone)") {
                                        Link(destination: url) {
                                            Image(systemName: "phone.fill")
                                                .font(.system(size: 13))
                                                .foregroundColor(Color(hex: "0B5D3B"))
                                                .frame(width: 34, height: 34)
                                                .background(Color(hex: "E8F5E9"))
                                                .clipShape(Circle())
                                        }
                                    }
                                }
                                
                                Divider()
                                
                                HStack(spacing: 16) {
                                    HStack(spacing: 5) {
                                        Image(systemName: "clock")
                                            .font(.system(size: 12))
                                            .foregroundColor(Color(hex: "64748B"))
                                        Text(visit.scheduledTimeSlot)
                                            .font(.system(size: 12, weight: .medium))
                                            .foregroundColor(Color(hex: "334155"))
                                    }
                                    
                                    HStack(spacing: 5) {
                                        Image(systemName: "mappin.and.ellipse")
                                            .font(.system(size: 12))
                                            .foregroundColor(Color(hex: "64748B"))
                                        Text(visit.serviceAddress)
                                            .font(.system(size: 12, weight: .medium))
                                            .foregroundColor(Color(hex: "334155"))
                                            .lineLimit(1)
                                    }
                                }
                                
                                // Start Shift / Clock-In Button
                                Button(action: {
                                    onStartShift(visit)
                                }) {
                                    HStack(spacing: 6) {
                                        Image(systemName: "play.circle.fill")
                                            .font(.system(size: 15))
                                        Text("Start Shift / Clock In")
                                            .font(.system(size: 14, weight: .bold))
                                    }
                                    .foregroundColor(.white)
                                    .frame(maxWidth: .infinity)
                                    .frame(height: 42)
                                    .background(Color(hex: "0B5D3B"))
                                    .cornerRadius(10)
                                }
                            }
                            .padding(16)
                            .background(Color.white)
                            .cornerRadius(16)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
                            )
                        }
                    }
                }
            }
            .padding(16)
            .padding(.bottom, 60)
        }
        .background(Color(hex: "F8FAF9").ignoresSafeArea())
    }
}

