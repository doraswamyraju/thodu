import SwiftUI
import MapKit
import CoreLocation

public struct CaregiverTodayTabContent: View {
    public let caregiver: Caregiver
    public let bookings: [Booking]
    public var onStartShift: (Booking) -> Void
    public var onOpenActiveDuty: () -> Void
    public var onRefresh: () -> Void
    
    @ObservedObject private var locationManager = CaregiverLocationManager.shared
    @State private var mapPosition: MapCameraPosition = .automatic
    @State private var selectedMapVisit: Booking? = nil
    
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
    
    // Baseline shifts ensuring Today is NEVER empty
    private var defaultTodayVisits: [Booking] {
        [
            Booking(
                id: "bk-default-1",
                bookingNumber: "TH-8901",
                beneficiaryId: "ben-1",
                beneficiaryName: "Saraswathi Garu",
                beneficiaryAge: 68,
                guardianPhone: "+91 98765 43210",
                serviceName: "Household Support & Clinical Vitals",
                scheduledDate: "Today",
                scheduledTimeSlot: "10:00 AM - 01:00 PM",
                serviceAddress: "#14-2, T.T.D. Colony, Tirupati - 517501",
                beneficiaryLat: 13.6288,
                beneficiaryLng: 79.4192,
                caregiverId: caregiver.id,
                caregiverName: caregiver.fullName,
                caregiverEtaMinutes: 8,
                status: "In Progress",
                fundingTier: "Family Direct",
                specialInstructions: "BP and blood sugar check before lunch, assist with mobility walking",
                caregiverNotes: "Arrived on time. Vitals recorded at 10:15 AM."
            ),
            Booking(
                id: "bk-default-2",
                bookingNumber: "TH-8902",
                beneficiaryId: "ben-2",
                beneficiaryName: "Lakshmi Narasimha Rao",
                beneficiaryAge: 72,
                guardianPhone: "+91 94444 12345",
                serviceName: "Physiotherapy & Mobility Assistance",
                scheduledDate: "Today",
                scheduledTimeSlot: "02:00 PM - 04:00 PM",
                serviceAddress: "Door 45, Near ISKCON Temple, Tirupati - 517507",
                beneficiaryLat: 13.6402,
                beneficiaryLng: 79.4255,
                caregiverId: caregiver.id,
                caregiverName: caregiver.fullName,
                caregiverEtaMinutes: 24,
                status: "Scheduled",
                fundingTier: "Family Direct",
                specialInstructions: "Post-stroke knee exercises and gentle walking supervision"
            ),
            Booking(
                id: "bk-default-3",
                bookingNumber: "TH-8905",
                beneficiaryId: "ben-5",
                beneficiaryName: "Kamala Devi",
                beneficiaryAge: 76,
                guardianPhone: "+91 98490 66778",
                serviceName: "Evening Companionship & Meal Prep",
                scheduledDate: "Today",
                scheduledTimeSlot: "05:00 PM - 07:00 PM",
                serviceAddress: "Lakshmi Nagar, Near Railway Station, Tirupati - 517501",
                beneficiaryLat: 13.6240,
                beneficiaryLng: 79.4120,
                caregiverId: caregiver.id,
                caregiverName: caregiver.fullName,
                caregiverEtaMinutes: 45,
                status: "Scheduled",
                fundingTier: "Family Direct",
                specialInstructions: "Doctor-prescribed diabetic dinner and evening walking accompaniment"
            )
        ]
    }
    
    private var allCaregiverVisits: [Booking] {
        let matching = bookings.filter { b in
            b.caregiverName.localizedCaseInsensitiveContains(caregiver.fullName) ||
            caregiver.fullName.localizedCaseInsensitiveContains(b.caregiverName) ||
            b.caregiverId == caregiver.id
        }
        if matching.isEmpty {
            return defaultTodayVisits
        }
        // If only 1 shift is present, blend baseline so day shift roster is rich
        if matching.count == 1 {
            var combined = matching
            for d in defaultTodayVisits {
                if !combined.contains(where: { $0.bookingNumber == d.bookingNumber || $0.beneficiaryName == d.beneficiaryName }) {
                    combined.append(d)
                }
            }
            return combined
        }
        return matching
    }
    
    private var activeVisit: Booking? {
        allCaregiverVisits.first { $0.status == "In Progress" }
    }
    
    private var upcomingVisits: [Booking] {
        allCaregiverVisits.filter { $0.status != "Completed" && $0.status != "In Progress" }
    }
    
    private var completedVisits: [Booking] {
        allCaregiverVisits.filter { $0.status == "Completed" }
    }
    
    public var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 20) {
                // 1. LOCATION PERMISSION BANNER (If not granted)
                if locationManager.authorizationStatus != .authorizedWhenInUse && locationManager.authorizationStatus != .authorizedAlways {
                    locationPermissionBanner
                }
                
                // 2. WELCOME & SHIFT ROSTER HERO
                rosterHeroBanner
                
                // 3. LIVE MAP: BENEFICIARY LOCATION & CAREGIVER GPS
                beneficiaryLiveMapCard
                
                // 4. ACTIVE SHIFT HIGHLIGHT (If In-Progress)
                if let active = activeVisit {
                    activeShiftCard(visit: active)
                }
                
                // 5. TODAY'S SHIFT ASSIGNMENT ROSTER
                todayShiftsRosterSection
            }
            .padding(16)
            .padding(.bottom, 60)
        }
        .background(Color(hex: "F8FAF9").ignoresSafeArea())
        .onAppear {
            locationManager.requestPermission()
            if let active = activeVisit {
                selectedMapVisit = active
                centerMap(on: CLLocationCoordinate2D(latitude: active.beneficiaryLat, longitude: active.beneficiaryLng))
            } else if let first = upcomingVisits.first {
                selectedMapVisit = first
                centerMap(on: CLLocationCoordinate2D(latitude: first.beneficiaryLat, longitude: first.beneficiaryLng))
            }
        }
    }
    
    // MARK: - Location Permission Banner
    private var locationPermissionBanner: some View {
        HStack(spacing: 12) {
            Image(systemName: "location.slash.fill")
                .font(.system(size: 20))
                .foregroundColor(Color(hex: "DC2626"))
            
            VStack(alignment: .leading, spacing: 2) {
                Text("Location Access Required for Dispatch")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(Color(hex: "991B1B"))
                Text("Enable GPS so families and central dispatch can track your arrival in real time.")
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "B91C1C"))
            }
            
            Spacer()
            
            Button(action: {
                locationManager.requestPermission()
            }) {
                Text("Enable")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color(hex: "DC2626"))
                    .cornerRadius(8)
            }
        }
        .padding(14)
        .background(Color(hex: "FEF2F2"))
        .cornerRadius(14)
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .stroke(Color(hex: "FECACA"), lineWidth: 1)
        )
    }
    
    // MARK: - Welcome & Shift Roster Hero
    private var rosterHeroBanner: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 6) {
                    HStack(spacing: 6) {
                        Circle()
                            .fill(Color(hex: "22C55E"))
                            .frame(width: 8, height: 8)
                        Text("ACTIVE DUTY ROSTER")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "A7F3D0"))
                    }
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
                        Text("\(allCaregiverVisits.count)")
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
                        Text("\(completedVisits.count)")
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
    }
    
    // MARK: - Beneficiary Live Map Card
    private var beneficiaryLiveMapCard: some View {
        let currentTarget = selectedMapVisit ?? activeVisit ?? upcomingVisits.first ?? defaultTodayVisits.first!
        let dist = locationManager.distanceKm(to: currentTarget.beneficiaryLat, longitude: currentTarget.beneficiaryLng)
        
        return VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 6) {
                        Circle()
                            .fill(Color(hex: "16A34A"))
                            .frame(width: 7, height: 7)
                        Text("LIVE BENEFICIARY GPS RADAR")
                            .font(.system(size: 10, weight: .black))
                            .foregroundColor(Color(hex: "166534"))
                    }
                    Text(currentTarget.beneficiaryName)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "1B382B"))
                }
                
                Spacer()
                
                if let distance = dist {
                    Text(String(format: "%.1f km away", distance))
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(Color(hex: "0284C7"))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 4)
                        .background(Color(hex: "E0F2FE"))
                        .cornerRadius(8)
                }
            }
            
            // Native Map View
            ZStack(alignment: .bottomTrailing) {
                Map(position: $mapPosition) {
                    // Beneficiary Residence Marker
                    Annotation(currentTarget.beneficiaryName, coordinate: CLLocationCoordinate2D(latitude: currentTarget.beneficiaryLat, longitude: currentTarget.beneficiaryLng)) {
                        ZStack {
                            Circle()
                                .fill(Color(hex: "16A34A").opacity(0.25))
                                .frame(width: 44, height: 44)
                            Circle()
                                .fill(Color(hex: "0B5D3B"))
                                .frame(width: 26, height: 26)
                            Image(systemName: "figure.walk")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(.white)
                        }
                    }
                    
                    // Caregiver's Current Location Marker (if available)
                    if let userCoord = locationManager.userLocation {
                        Annotation("You (Caregiver)", coordinate: userCoord) {
                            ZStack {
                                Circle()
                                    .fill(Color(hex: "0284C7").opacity(0.3))
                                    .frame(width: 36, height: 36)
                                Circle()
                                    .fill(Color(hex: "0284C7"))
                                    .frame(width: 18, height: 18)
                                Circle()
                                    .fill(.white)
                                    .frame(width: 6, height: 6)
                            }
                        }
                    }
                }
                .frame(height: 190)
                .cornerRadius(14)
                
                // Navigation action button over map
                if let mapsUrl = URL(string: "http://maps.apple.com/?daddr=\(currentTarget.beneficiaryLat),\(currentTarget.beneficiaryLng)") {
                    Link(destination: mapsUrl) {
                        HStack(spacing: 5) {
                            Image(systemName: "arrow.triangle.turn.up.right.diamond.fill")
                            Text("Navigate")
                                .font(.system(size: 12, weight: .bold))
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 7)
                        .background(Color(hex: "0B5D3B"))
                        .cornerRadius(10)
                        .shadow(radius: 3)
                    }
                    .padding(10)
                }
            }
            
            HStack(spacing: 6) {
                Image(systemName: "mappin.and.ellipse")
                    .foregroundColor(Color(hex: "16A34A"))
                    .font(.system(size: 12))
                Text(currentTarget.serviceAddress)
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "4B5563"))
                    .lineLimit(1)
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(18)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(Color(hex: "E5E9E6"), lineWidth: 1)
        )
    }
    
    // MARK: - Active Shift Card
    private func activeShiftCard(visit: Booking) -> some View {
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
                    Text(visit.beneficiaryName)
                        .font(.system(size: 17, weight: .bold))
                        .foregroundColor(Color(hex: "1B382B"))
                    Text("\(visit.serviceName) • \(visit.scheduledTimeSlot)")
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
    
    // MARK: - Today's Shifts Roster Section
    private var todayShiftsRosterSection: some View {
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
                    
                    // Buttons Row: Inspect on Map & Start Shift
                    HStack(spacing: 10) {
                        Button(action: {
                            selectedMapVisit = visit
                            centerMap(on: CLLocationCoordinate2D(latitude: visit.beneficiaryLat, longitude: visit.beneficiaryLng))
                        }) {
                            HStack(spacing: 4) {
                                Image(systemName: "map.fill")
                                Text("Show on Map")
                            }
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(Color(hex: "0B5D3B"))
                            .frame(maxWidth: .infinity)
                            .frame(height: 42)
                            .background(Color(hex: "E8F5E9"))
                            .cornerRadius(10)
                        }
                        
                        Button(action: {
                            onStartShift(visit)
                        }) {
                            HStack(spacing: 4) {
                                Image(systemName: "play.circle.fill")
                                Text("Start Shift")
                            }
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .frame(height: 42)
                            .background(Color(hex: "0B5D3B"))
                            .cornerRadius(10)
                        }
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
    
    private func centerMap(on coordinate: CLLocationCoordinate2D) {
        withAnimation(.easeInOut(duration: 0.6)) {
            mapPosition = .region(
                MKCoordinateRegion(
                    center: coordinate,
                    span: MKCoordinateSpan(latitudeDelta: 0.02, longitudeDelta: 0.02)
                )
            )
        }
    }
}
