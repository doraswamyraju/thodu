import SwiftUI
import MapKit
import CoreLocation

public struct CaregiverInAppNavigationView: View {
    public let visit: Booking
    public let caregiver: Caregiver
    public var onArrival: () -> Void
    public var onDismiss: () -> Void
    
    @ObservedObject private var locationManager = CaregiverLocationManager.shared
    
    @State private var cameraPosition: MapCameraPosition
    @State private var caregiverCoord: CLLocationCoordinate2D
    @State private var destinationCoord: CLLocationCoordinate2D
    @State private var selectedMapStyle: Int = 0 // 0: Standard, 1: Hybrid Satellite
    @State private var isPulsing: Bool = false
    @State private var etaMinutes: Int
    @State private var distanceKm: Double
    @State private var speedKmh: Int = 26
    @State private var nextInstruction: String = "In 250m, turn left toward T.T.D. Colony"
    @State private var timer: Timer? = nil
    
    public init(
        visit: Booking,
        caregiver: Caregiver,
        onArrival: @escaping () -> Void,
        onDismiss: @escaping () -> Void
    ) {
        self.visit = visit
        self.caregiver = caregiver
        self.onArrival = onArrival
        self.onDismiss = onDismiss
        
        let dest = CLLocationCoordinate2D(latitude: visit.beneficiaryLat, longitude: visit.beneficiaryLng)
        
        // Start from caregiver's real GPS if available, else initial offset near Tirupati
        let initialCg: CLLocationCoordinate2D
        if let userLoc = CaregiverLocationManager.shared.userLocation {
            initialCg = userLoc
        } else {
            initialCg = CLLocationCoordinate2D(latitude: visit.beneficiaryLat + 0.0075, longitude: visit.beneficiaryLng + 0.0050)
        }
        
        self._destinationCoord = State(initialValue: dest)
        self._caregiverCoord = State(initialValue: initialCg)
        self._etaMinutes = State(initialValue: visit.caregiverEtaMinutes ?? 8)
        
        let currentLoc = CLLocation(latitude: initialCg.latitude, longitude: initialCg.longitude)
        let targetLoc = CLLocation(latitude: dest.latitude, longitude: dest.longitude)
        self._distanceKm = State(initialValue: currentLoc.distance(from: targetLoc) / 1000.0)
        
        let midLat = (dest.latitude + initialCg.latitude) / 2
        let midLng = (dest.longitude + initialCg.longitude) / 2
        let span = MKCoordinateSpan(latitudeDelta: 0.016, longitudeDelta: 0.016)
        let region = MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: midLat, longitude: midLng), span: span)
        self._cameraPosition = State(initialValue: .region(region))
    }
    
    private var routeCoordinates: [CLLocationCoordinate2D] {
        [
            caregiverCoord,
            CLLocationCoordinate2D(
                latitude: (caregiverCoord.latitude * 0.7) + (destinationCoord.latitude * 0.3),
                longitude: (caregiverCoord.longitude * 0.7) + (destinationCoord.longitude * 0.3)
            ),
            CLLocationCoordinate2D(
                latitude: (caregiverCoord.latitude * 0.3) + (destinationCoord.latitude * 0.7),
                longitude: (caregiverCoord.longitude * 0.3) + (destinationCoord.longitude * 0.7)
            ),
            destinationCoord
        ]
    }
    
    public var body: some View {
        ZStack(alignment: .top) {
            // 1. FULL-SCREEN APPLE MAPKIT VIEW
            Map(position: $cameraPosition) {
                // Beneficiary Residence Marker
                Annotation(visit.beneficiaryName, coordinate: destinationCoord) {
                    ZStack {
                        Circle()
                            .fill(Color(hex: "16A34A").opacity(0.3))
                            .frame(width: isPulsing ? 56 : 40, height: isPulsing ? 56 : 40)
                            .scaleEffect(isPulsing ? 1.2 : 0.95)
                            .opacity(isPulsing ? 0 : 0.8)
                        Circle()
                            .fill(Color(hex: "0B5D3B"))
                            .frame(width: 36, height: 36)
                            .shadow(color: Color.black.opacity(0.3), radius: 4, x: 0, y: 2)
                        Image(systemName: "house.fill")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.white)
                    }
                }
                
                // Caregiver Live Vehicle Annotation
                Annotation(caregiver.fullName, coordinate: caregiverCoord) {
                    ZStack {
                        Circle()
                            .fill(Color(hex: "0284C7").opacity(0.3))
                            .frame(width: 50, height: 50)
                        Circle()
                            .fill(Color(hex: "0284C7"))
                            .frame(width: 38, height: 38)
                            .shadow(color: Color.black.opacity(0.3), radius: 4, x: 0, y: 2)
                        Image(systemName: "car.fill")
                            .font(.system(size: 17, weight: .bold))
                            .foregroundColor(.white)
                    }
                }
                
                // Route Polyline
                MapPolyline(coordinates: routeCoordinates)
                    .stroke(Color(hex: "0284C7"), lineWidth: 6)
            }
            .mapStyle(selectedMapStyle == 0 ? .standard(elevation: .realistic) : .hybrid(elevation: .realistic))
            .ignoresSafeArea()
            
            // 2. FLOATING IN-APP TURN-BY-TURN HUD (TOP)
            VStack(spacing: 8) {
                HStack(spacing: 12) {
                    // Turn maneuver icon
                    ZStack {
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color(hex: "0B5D3B"))
                            .frame(width: 48, height: 48)
                        Image(systemName: "arrow.turn.up.right.fill")
                            .font(.system(size: 22, weight: .bold))
                            .foregroundColor(.white)
                    }
                    
                    VStack(alignment: .leading, spacing: 3) {
                        Text(nextInstruction)
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(Color(hex: "1B382B"))
                            .lineLimit(1)
                        
                        HStack(spacing: 12) {
                            Text(String(format: "%.1f km", distanceKm))
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(Color(hex: "0284C7"))
                            Text("•")
                                .foregroundColor(Color(hex: "94A3B8"))
                            Text("ETA: ~\(etaMinutes) mins")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(Color(hex: "166534"))
                            Text("•")
                                .foregroundColor(Color(hex: "94A3B8"))
                            Text("\(speedKmh) km/h")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(Color(hex: "64748B"))
                        }
                    }
                    
                    Spacer()
                    
                    // Exit navigation button
                    Button(action: {
                        stopBroadcasting()
                        onDismiss()
                    }) {
                        Image(systemName: "xmark.circle.fill")
                            .font(.system(size: 24))
                            .foregroundColor(Color(hex: "94A3B8"))
                    }
                }
                .padding(14)
                .background(Color.white)
                .cornerRadius(18)
                .shadow(color: Color.black.opacity(0.15), radius: 10, x: 0, y: 3)
                .padding(.horizontal, 16)
                .padding(.top, 8)
                
                Spacer()
            }
            
            // 3. FLOATING MAP CONTROLS (RIGHT)
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    VStack(spacing: 10) {
                        // Re-center on Caregiver
                        Button(action: centerOnCaregiver) {
                            Image(systemName: "location.fill")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(Color(hex: "0B5D3B"))
                                .frame(width: 44, height: 44)
                                .background(Color.white)
                                .clipShape(Circle())
                                .shadow(color: Color.black.opacity(0.15), radius: 4, x: 0, y: 2)
                        }
                        
                        // Fit entire route
                        Button(action: fitRouteInView) {
                            Image(systemName: "arrow.up.left.and.down.right.and.arrow.up.right.and.down.left")
                                .font(.system(size: 15, weight: .bold))
                                .foregroundColor(Color(hex: "0284C7"))
                                .frame(width: 44, height: 44)
                                .background(Color.white)
                                .clipShape(Circle())
                                .shadow(color: Color.black.opacity(0.15), radius: 4, x: 0, y: 2)
                        }
                        
                        // Satellite / Standard toggle
                        Button(action: {
                            selectedMapStyle = selectedMapStyle == 0 ? 1 : 0
                        }) {
                            Image(systemName: selectedMapStyle == 0 ? "globe.americas.fill" : "map.fill")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(Color(hex: "4B5563"))
                                .frame(width: 44, height: 44)
                                .background(Color.white)
                                .clipShape(Circle())
                                .shadow(color: Color.black.opacity(0.15), radius: 4, x: 0, y: 2)
                        }
                    }
                    .padding(.trailing, 16)
                    .padding(.bottom, 220)
                }
            }
            
            // 4. BOTTOM DESTINATION CARD & CLOCK-IN (BOTTOM)
            VStack {
                Spacer()
                VStack(spacing: 12) {
                    // Beneficiary Info & Live Transmission Status
                    HStack {
                        VStack(alignment: .leading, spacing: 3) {
                            HStack(spacing: 6) {
                                Circle()
                                    .fill(Color(hex: "16A34A"))
                                    .frame(width: 7, height: 7)
                                Text("TRANSMITTING LIVE GPS TO BENEFICIARY APP")
                                    .font(.system(size: 9, weight: .black))
                                    .foregroundColor(Color(hex: "166534"))
                            }
                            Text(visit.beneficiaryName)
                                .font(.system(size: 17, weight: .bold))
                                .foregroundColor(Color(hex: "1B382B"))
                            Text("Age: \(visit.beneficiaryAge) • \(visit.serviceName)")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "688273"))
                        }
                        
                        Spacer()
                        
                        // Direct call button
                        if let url = URL(string: "tel://\(visit.guardianPhone)") {
                            Link(destination: url) {
                                Image(systemName: "phone.fill")
                                    .font(.system(size: 15))
                                    .foregroundColor(Color(hex: "0B5D3B"))
                                    .frame(width: 42, height: 42)
                                    .background(Color(hex: "DCFCE7"))
                                    .clipShape(Circle())
                            }
                        }
                    }
                    
                    HStack(spacing: 6) {
                        Image(systemName: "mappin.circle.fill")
                            .font(.system(size: 13))
                            .foregroundColor(Color(hex: "16A34A"))
                        Text(visit.serviceAddress)
                            .font(.system(size: 11))
                            .foregroundColor(Color(hex: "4B5563"))
                            .lineLimit(1)
                    }
                    
                    Divider()
                    
                    // "I Have Arrived & Clock In" Button
                    Button(action: {
                        stopBroadcasting()
                        onArrival()
                    }) {
                        HStack(spacing: 8) {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 18))
                            Text("I Have Arrived & Clock In")
                                .font(.system(size: 15, weight: .bold))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 50)
                        .background(Color(hex: "0B5D3B"))
                        .cornerRadius(14)
                        .shadow(color: Color(hex: "0B5D3B").opacity(0.3), radius: 6, x: 0, y: 3)
                    }
                }
                .padding(18)
                .background(Color.white)
                .cornerRadius(24)
                .shadow(color: Color.black.opacity(0.18), radius: 14, x: 0, y: -4)
                .padding(.horizontal, 14)
                .padding(.bottom, 24)
            }
        }
        .onAppear {
            startBroadcasting()
            withAnimation(.easeInOut(duration: 1.2).repeatForever(autoreverses: true)) {
                isPulsing = true
            }
        }
        .onDisappear {
            stopBroadcasting()
        }
    }
    
    // MARK: - Live Location Broadcasting & Movement Simulation
    private func startBroadcasting() {
        locationManager.startTracking()
        
        // Immediate broadcast
        broadcastCurrentLocation()
        
        // Periodic broadcast & GPS interpolation every 3 seconds
        timer = Timer.scheduledTimer(withTimeInterval: 3.0, repeats: true) { _ in
            updateLocationStep()
        }
    }
    
    private func stopBroadcasting() {
        timer?.invalidate()
        timer = nil
    }
    
    private func updateLocationStep() {
        // If real GPS is moving, use real GPS
        if let realGPS = locationManager.userLocation {
            self.caregiverCoord = realGPS
        } else {
            // Smoothly interpolate along street route toward beneficiary
            let step = 0.05
            let newLat = caregiverCoord.latitude + (destinationCoord.latitude - caregiverCoord.latitude) * step
            let newLng = caregiverCoord.longitude + (destinationCoord.longitude - caregiverCoord.longitude) * step
            self.caregiverCoord = CLLocationCoordinate2D(latitude: newLat, longitude: newLng)
        }
        
        // Update distance & ETA
        let currentLoc = CLLocation(latitude: caregiverCoord.latitude, longitude: caregiverCoord.longitude)
        let targetLoc = CLLocation(latitude: destinationCoord.latitude, longitude: destinationCoord.longitude)
        let remainingMeters = currentLoc.distance(from: targetLoc)
        self.distanceKm = max(remainingMeters / 1000.0, 0.1)
        self.etaMinutes = max(Int(ceil(remainingMeters / 300.0)), 1)
        
        if distanceKm < 0.2 {
            self.nextInstruction = "You have arrived at \(visit.beneficiaryName)'s home!"
        }
        
        broadcastCurrentLocation()
    }
    
    private func broadcastCurrentLocation() {
        Task {
            do {
                try await ThoduApiClient.shared.broadcastCaregiverLocation(
                    bookingId: visit.id,
                    latitude: caregiverCoord.latitude,
                    longitude: caregiverCoord.longitude,
                    etaMinutes: etaMinutes
                )
            } catch {
                print("Broadcast error: \(error.localizedDescription)")
            }
        }
    }
    
    private func centerOnCaregiver() {
        withAnimation(.easeInOut(duration: 0.6)) {
            cameraPosition = .region(
                MKCoordinateRegion(
                    center: caregiverCoord,
                    span: MKCoordinateSpan(latitudeDelta: 0.008, longitudeDelta: 0.008)
                )
            )
        }
    }
    
    private func fitRouteInView() {
        let midLat = (destinationCoord.latitude + caregiverCoord.latitude) / 2
        let midLng = (destinationCoord.longitude + caregiverCoord.longitude) / 2
        let latDelta = max(abs(destinationCoord.latitude - caregiverCoord.latitude) * 1.6, 0.012)
        let lngDelta = max(abs(destinationCoord.longitude - caregiverCoord.longitude) * 1.6, 0.012)
        withAnimation(.easeInOut(duration: 0.6)) {
            cameraPosition = .region(
                MKCoordinateRegion(
                    center: CLLocationCoordinate2D(latitude: midLat, longitude: midLng),
                    span: MKCoordinateSpan(latitudeDelta: latDelta, longitudeDelta: lngDelta)
                )
            )
        }
    }
}

