import SwiftUI
import MapKit

public struct CaregiverLiveTrackingView: View {
    public let booking: Booking
    public let beneficiary: Beneficiary?
    public let onDismiss: () -> Void

    @State private var cameraPosition: MapCameraPosition
    @State private var caregiverCoord: CLLocationCoordinate2D
    @State private var destinationCoord: CLLocationCoordinate2D
    @State private var etaMinutes: Int = 12
    @State private var isPulsing: Bool = false
    @State private var selectedMapStyle: Int = 0 // 0: Standard, 1: Hybrid
    @State private var routeCoordinates: [CLLocationCoordinate2D]
    @State private var pollTimer: Timer? = nil

    public init(
        booking: Booking,
        beneficiary: Beneficiary?,
        onDismiss: @escaping () -> Void
    ) {
        self.booking = booking
        self.beneficiary = beneficiary
        self.onDismiss = onDismiss

        let destLat = beneficiary?.latitude ?? 13.6288
        let destLng = beneficiary?.longitude ?? 79.4192
        let dest = CLLocationCoordinate2D(latitude: destLat, longitude: destLng)

        // Caregiver coordinates from booking if present, else offset
        let cgLat = booking.caregiverLat ?? (destLat + 0.0055)
        let cgLng = booking.caregiverLng ?? (destLng + 0.0038)
        let cg = CLLocationCoordinate2D(latitude: cgLat, longitude: cgLng)

        self._destinationCoord = State(initialValue: dest)
        self._caregiverCoord = State(initialValue: cg)
        self._etaMinutes = State(initialValue: booking.caregiverEtaMinutes ?? 12)

        let midLat = (destLat + cgLat) / 2
        let midLng = (destLng + cgLng) / 2
        let span = MKCoordinateSpan(latitudeDelta: 0.016, longitudeDelta: 0.016)
        let region = MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: midLat, longitude: midLng), span: span)
        self._cameraPosition = State(initialValue: .region(region))

        self._routeCoordinates = State(initialValue: [
            cg,
            CLLocationCoordinate2D(latitude: destLat + 0.0042, longitude: destLng + 0.0030),
            CLLocationCoordinate2D(latitude: destLat + 0.0028, longitude: destLng + 0.0020),
            CLLocationCoordinate2D(latitude: destLat + 0.0014, longitude: destLng + 0.0008),
            dest
        ])
    }

    public var body: some View {
        ZStack(alignment: .top) {
            // 1. Native Apple MapKit View
            Map(position: $cameraPosition) {
                // Beneficiary Home Destination Marker
                Marker(beneficiary?.fullName ?? "Loved One's Home", systemImage: "house.fill", coordinate: destinationCoord)
                    .tint(Color(hex: "0D5C3A"))

                // Live Caregiver Moving Annotation
                Annotation(booking.caregiverName, coordinate: caregiverCoord) {
                    ZStack {
                        // Pulsing radar halo
                        Circle()
                            .stroke(Color(hex: "0284C7").opacity(0.4), lineWidth: 2)
                            .frame(width: isPulsing ? 54 : 36, height: isPulsing ? 54 : 36)
                            .scaleEffect(isPulsing ? 1.2 : 0.9)
                            .opacity(isPulsing ? 0 : 0.8)

                        Circle()
                            .fill(Color(hex: "0284C7"))
                            .frame(width: 36, height: 36)
                            .shadow(color: Color.black.opacity(0.25), radius: 4, x: 0, y: 2)

                        Image(systemName: "figure.walk")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                    }
                }

                // Route Polyline
                MapPolyline(coordinates: routeCoordinates)
                    .stroke(Color(hex: "0284C7"), lineWidth: 5)
            }
            .mapStyle(selectedMapStyle == 0 ? .standard(elevation: .realistic) : .hybrid(elevation: .realistic))
            .ignoresSafeArea()

            // 2. Top Navigation & Status Bar Overlay
            VStack(spacing: 12) {
                HStack {
                    // Close Button
                    Button(action: onDismiss) {
                        Image(systemName: "chevron.left")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "1F2937"))
                            .frame(width: 40, height: 40)
                            .background(Color.white)
                            .clipShape(Circle())
                            .shadow(color: Color.black.opacity(0.15), radius: 4, x: 0, y: 2)
                    }

                    Spacer()

                    // Live Status Pill
                    HStack(spacing: 6) {
                        Circle()
                            .fill(Color(hex: "16A34A"))
                            .frame(width: 8, height: 8)
                            .scaleEffect(isPulsing ? 1.3 : 1.0)

                        Text("LIVE ETA: ~\(etaMinutes) MINS")
                            .font(.system(size: 12, weight: .black))
                            .foregroundColor(Color(hex: "0D5C3A"))
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 8)
                    .background(Color.white)
                    .clipShape(Capsule())
                    .shadow(color: Color.black.opacity(0.12), radius: 4, x: 0, y: 2)

                    Spacer()

                    // Re-center Map Button
                    Button(action: recenterMap) {
                        Image(systemName: "location.fill")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "0D5C3A"))
                            .frame(width: 40, height: 40)
                            .background(Color.white)
                            .clipShape(Circle())
                            .shadow(color: Color.black.opacity(0.15), radius: 4, x: 0, y: 2)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 8)

                Spacer()

                // 3. Bottom Caregiver Dispatch HUD Card
                VStack(spacing: 14) {
                    // Drag Indicator Handle
                    Capsule()
                        .fill(Color(hex: "CBD5E1"))
                        .frame(width: 36, height: 4)
                        .padding(.top, 4)

                    // Caregiver Profile Row
                    HStack(spacing: 14) {
                        ThoduAvatarView(
                            urlString: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80",
                            fallbackName: booking.caregiverName,
                            size: 54,
                            borderColor: Color(hex: "0284C7"),
                            borderWidth: 2,
                            backgroundColor: Color(hex: "E0F2FE")
                        )

                        VStack(alignment: .leading, spacing: 3) {
                            HStack(spacing: 6) {
                                Text(booking.caregiverName)
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(Color(hex: "0F172A"))

                                Text("4.9 ★")
                                    .font(.system(size: 11, weight: .bold))
                                    .foregroundColor(Color(hex: "B45309"))
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(Color(hex: "FEF3C7"))
                                    .cornerRadius(6)
                            }

                            Text("\(booking.serviceName) • Specialist Attendant")
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "475569"))

                            Text("Speed ~18 km/h • 1.2 km away")
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundColor(Color(hex: "0284C7"))
                        }

                        Spacer()

                        // Call Caregiver Button
                        Button(action: {
                            if let url = URL(string: "tel://+919848022334"), UIApplication.shared.canOpenURL(url) {
                                UIApplication.shared.open(url)
                            }
                        }) {
                            ZStack {
                                Circle()
                                    .fill(Color(hex: "DCFCE7"))
                                    .frame(width: 44, height: 44)
                                Image(systemName: "phone.fill")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(Color(hex: "15803D"))
                            }
                        }
                    }

                    Divider().background(Color(hex: "E2E8F0"))

                    // Dispatch Stepper Progress
                    HStack(alignment: .top, spacing: 0) {
                        trackingStep(title: "Assigned", isDone: true, isActive: false)
                        stepDivider(isDone: true)
                        trackingStep(title: "Dispatched", isDone: true, isActive: false)
                        stepDivider(isDone: true)
                        trackingStep(title: "On The Way", isDone: false, isActive: true)
                        stepDivider(isDone: false)
                        trackingStep(title: "Arrived", isDone: false, isActive: false)
                    }

                    // Destination Address Pill
                    HStack(spacing: 8) {
                        Image(systemName: "mappin.circle.fill")
                            .foregroundColor(Color(hex: "0D5C3A"))
                            .font(.system(size: 16))

                        VStack(alignment: .leading, spacing: 2) {
                            Text("Destination: \(beneficiary?.fullName ?? "Loved One")")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: "1E293B"))
                            Text(beneficiary?.address ?? "Tirupati, Andhra Pradesh")
                                .font(.system(size: 11))
                                .foregroundColor(Color(hex: "64748B"))
                                .lineLimit(1)
                        }

                        Spacer()
                    }
                    .padding(10)
                    .background(Color(hex: "F8FAF9"))
                    .cornerRadius(10)
                }
                .padding(18)
                .background(Color.white)
                .cornerRadius(24)
                .shadow(color: Color.black.opacity(0.18), radius: 12, x: 0, y: -4)
                .padding(.horizontal, 12)
                .padding(.bottom, 24)
            }
        }
        .onAppear {
            withAnimation(.easeInOut(duration: 1.2).repeatForever(autoreverses: true)) {
                isPulsing = true
            }
            startPollingLiveLocation()
        }
        .onDisappear {
            pollTimer?.invalidate()
            pollTimer = nil
        }
    }

    private func startPollingLiveLocation() {
        pollTimer = Timer.scheduledTimer(withTimeInterval: 3.0, repeats: true) { _ in
            Task {
                do {
                    let bks = try await ThoduApiClient.shared.fetchBookings()
                    if let live = bks.first(where: { $0.id == booking.id || $0.bookingNumber == booking.bookingNumber }) {
                        if let lat = live.caregiverLat, let lng = live.caregiverLng {
                            await MainActor.run {
                                withAnimation(.easeInOut(duration: 1.0)) {
                                    self.caregiverCoord = CLLocationCoordinate2D(latitude: lat, longitude: lng)
                                    if let liveEta = live.caregiverEtaMinutes {
                                        self.etaMinutes = liveEta
                                    }
                                    self.routeCoordinates = [
                                        self.caregiverCoord,
                                        CLLocationCoordinate2D(
                                            latitude: (lat * 0.6) + (destinationCoord.latitude * 0.4),
                                            longitude: (lng * 0.6) + (destinationCoord.longitude * 0.4)
                                        ),
                                        self.destinationCoord
                                    ]
                                }
                            }
                        }
                    }
                } catch {
                    // Fail silently on network jitter
                }
            }
        }
    }

    private func recenterMap() {
        let midLat = (destinationCoord.latitude + caregiverCoord.latitude) / 2
        let midLng = (destinationCoord.longitude + caregiverCoord.longitude) / 2
        let span = MKCoordinateSpan(latitudeDelta: 0.016, longitudeDelta: 0.016)
        withAnimation(.easeInOut(duration: 0.6)) {
            cameraPosition = .region(MKCoordinateRegion(center: CLLocationCoordinate2D(latitude: midLat, longitude: midLng), span: span))
        }
    }

    @ViewBuilder
    private func trackingStep(title: String, isDone: Bool, isActive: Bool) -> some View {
        VStack(spacing: 4) {
            ZStack {
                if isDone {
                    Circle()
                        .fill(Color(hex: "15803D"))
                        .frame(width: 20, height: 20)
                    Image(systemName: "checkmark")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(.white)
                } else if isActive {
                    Circle()
                        .fill(Color(hex: "0284C7"))
                        .frame(width: 20, height: 20)
                    Circle()
                        .fill(Color.white)
                        .frame(width: 8, height: 8)
                } else {
                    Circle()
                        .fill(Color(hex: "E2E8F0"))
                        .frame(width: 20, height: 20)
                }
            }

            Text(title)
                .font(.system(size: 10, weight: isActive ? .bold : .medium))
                .foregroundColor(isActive ? Color(hex: "0284C7") : (isDone ? Color(hex: "15803D") : Color(hex: "94A3B8")))
        }
        .frame(maxWidth: .infinity)
    }

    @ViewBuilder
    private func stepDivider(isDone: Bool) -> some View {
        Rectangle()
            .fill(isDone ? Color(hex: "15803D") : Color(hex: "E2E8F0"))
            .frame(height: 2)
            .offset(y: -8)
    }
}

