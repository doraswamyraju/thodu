import SwiftUI
import MapKit
import CoreLocation

public struct AddBeneficiaryView: View {
    public let currentUser: AppUser
    public let onDismiss: () -> Void
    public let onCreated: (Beneficiary) -> Void

    @State private var fullName: String = ""
    @State private var relationship: String = "Mother"
    @State private var ageText: String = "68"
    @State private var gender: String = "Female"
    @State private var phone: String = ""
    @State private var address: String = "T.T.D. Colony, Tirupati"
    @State private var medicalNotes: String = ""
    @State private var isLoading: Bool = false
    @State private var errorMessage: String? = nil

    // MapKit Pin Location State
    @State private var mapCameraPosition: MapCameraPosition
    @State private var pinnedCoordinate: CLLocationCoordinate2D
    @State private var isGeocoding: Bool = false

    private let relationships = ["Mother", "Father", "Spouse", "Child", "Self", "Relative", "Other"]
    private let genders = ["Female", "Male", "Other"]

    public init(
        currentUser: AppUser,
        onDismiss: @escaping () -> Void,
        onCreated: @escaping (Beneficiary) -> Void
    ) {
        self.currentUser = currentUser
        self.onDismiss = onDismiss
        self.onCreated = onCreated

        // Default to Tirupati center (13.6288, 79.4192)
        let initialCoord = CLLocationCoordinate2D(latitude: 13.6288, longitude: 79.4192)
        self._pinnedCoordinate = State(initialValue: initialCoord)
        let span = MKCoordinateSpan(latitudeDelta: 0.012, longitudeDelta: 0.012)
        self._mapCameraPosition = State(initialValue: .region(MKCoordinateRegion(center: initialCoord, span: span)))
    }

    public var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 20) {
                    // 1. Interactive Location Pin Map Section
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Image(systemName: "mappin.and.ellipse")
                                .foregroundColor(Color(hex: "0D5C3A"))
                                .font(.system(size: 16, weight: .bold))
                            Text("Drop Pin at Loved One's Home")
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(Color(hex: "1F2937"))
                            Spacer()
                            if isGeocoding {
                                ProgressView()
                                    .scaleEffect(0.7)
                            }
                        }

                        Text("Pan and zoom the map to center the pin over their residence for verified caregiver routing.")
                            .font(.system(size: 11.5))
                            .foregroundColor(Color(hex: "6B7280"))

                        // Map Container with Fixed Center Pin
                        ZStack(alignment: .center) {
                            Map(position: $mapCameraPosition)
                                .onMapCameraChange(frequency: .onEnd) { context in
                                    pinnedCoordinate = context.camera.centerCoordinate
                                    reverseGeocode(coordinate: context.camera.centerCoordinate)
                                }
                                .frame(height: 220)
                                .cornerRadius(16)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 16)
                                        .stroke(Color(hex: "CBD5E1"), lineWidth: 1)
                                )

                            // Center Pin Marker
                            VStack(spacing: 0) {
                                ZStack {
                                    Circle()
                                        .fill(Color(hex: "DC2626"))
                                        .frame(width: 32, height: 32)
                                        .shadow(color: Color.black.opacity(0.3), radius: 4, x: 0, y: 3)

                                    Image(systemName: "house.fill")
                                        .font(.system(size: 15, weight: .bold))
                                        .foregroundColor(.white)
                                }

                                Image(systemName: "triangle.fill")
                                    .font(.system(size: 10))
                                    .foregroundColor(Color(hex: "DC2626"))
                                    .rotationEffect(.degrees(180))
                                    .offset(y: -2)
                            }
                            .offset(y: -16) // Lift pin tip to the exact center point

                            // Location Coordinates Pill (Bottom Left overlay)
                            VStack {
                                Spacer()
                                HStack {
                                    Text(String(format: "Lat: %.4f, Lng: %.4f", pinnedCoordinate.latitude, pinnedCoordinate.longitude))
                                        .font(.system(size: 10.5, weight: .bold))
                                        .foregroundColor(Color(hex: "1F2937"))
                                        .padding(.horizontal, 8)
                                        .padding(.vertical, 4)
                                        .background(Color.white.opacity(0.92))
                                        .cornerRadius(6)
                                    Spacer()
                                }
                                .padding(8)
                            }
                        }
                    }

                    // 2. Personal Information Fields
                    VStack(alignment: .leading, spacing: 14) {
                        // Full Name
                        VStack(alignment: .leading, spacing: 5) {
                            Text("Full Name *")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: "374151"))
                            TextField("e.g. Saraswathi Amma, Ramanaiah Garu", text: $fullName)
                                .padding(.horizontal, 12)
                                .frame(height: 48)
                                .background(Color.white)
                                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "D1D5DB"), lineWidth: 1))
                                .cornerRadius(10)
                        }

                        // Relationship & Gender Row
                        HStack(spacing: 12) {
                            VStack(alignment: .leading, spacing: 5) {
                                Text("Relationship *")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(Color(hex: "374151"))
                                Picker("Relationship", selection: $relationship) {
                                    ForEach(relationships, id: \.self) {
                                        Text($0)
                                    }
                                }
                                .pickerStyle(MenuPickerStyle())
                                .frame(maxWidth: .infinity)
                                .frame(height: 48)
                                .background(Color.white)
                                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "D1D5DB"), lineWidth: 1))
                                .cornerRadius(10)
                            }

                            VStack(alignment: .leading, spacing: 5) {
                                Text("Gender *")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(Color(hex: "374151"))
                                Picker("Gender", selection: $gender) {
                                    ForEach(genders, id: \.self) {
                                        Text($0)
                                    }
                                }
                                .pickerStyle(MenuPickerStyle())
                                .frame(maxWidth: .infinity)
                                .frame(height: 48)
                                .background(Color.white)
                                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "D1D5DB"), lineWidth: 1))
                                .cornerRadius(10)
                            }
                        }

                        // Age & Phone Row
                        HStack(spacing: 12) {
                            VStack(alignment: .leading, spacing: 5) {
                                Text("Age *")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(Color(hex: "374151"))
                                TextField("68", text: $ageText)
                                    .keyboardType(.numberPad)
                                    .padding(.horizontal, 12)
                                    .frame(height: 48)
                                    .background(Color.white)
                                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "D1D5DB"), lineWidth: 1))
                                    .cornerRadius(10)
                            }
                            .frame(maxWidth: 80)

                            VStack(alignment: .leading, spacing: 5) {
                                Text("Primary Phone Number")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(Color(hex: "374151"))
                                TextField("+91 98765 43210", text: $phone)
                                    .keyboardType(.phonePad)
                                    .padding(.horizontal, 12)
                                    .frame(height: 48)
                                    .background(Color.white)
                                    .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "D1D5DB"), lineWidth: 1))
                                    .cornerRadius(10)
                            }
                        }

                        // Address (auto-populated by Map Pin)
                        VStack(alignment: .leading, spacing: 5) {
                            HStack {
                                Text("Residence Address *")
                                    .font(.system(size: 12, weight: .bold))
                                    .foregroundColor(Color(hex: "374151"))
                                Spacer()
                                Text("Auto-pinned")
                                    .font(.system(size: 10, weight: .semibold))
                                    .foregroundColor(Color(hex: "15803D"))
                            }
                            TextField("Door No, Street, Colony, Tirupati", text: $address)
                                .padding(.horizontal, 12)
                                .frame(height: 48)
                                .background(Color.white)
                                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "D1D5DB"), lineWidth: 1))
                                .cornerRadius(10)
                        }

                        // Medical & Mobility Notes
                        VStack(alignment: .leading, spacing: 5) {
                            Text("Health & Care Requirements (Optional)")
                                .font(.system(size: 12, weight: .bold))
                                .foregroundColor(Color(hex: "374151"))
                            TextField("e.g. Walking assistance, diabetes monitoring, knee therapy", text: $medicalNotes)
                                .padding(.horizontal, 12)
                                .frame(height: 48)
                                .background(Color.white)
                                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "D1D5DB"), lineWidth: 1))
                                .cornerRadius(10)
                        }
                    }

                    // Error Message
                    if let err = errorMessage {
                        HStack(spacing: 6) {
                            Image(systemName: "exclamationmark.circle.fill")
                                .foregroundColor(Color(hex: "DC2626"))
                            Text(err)
                                .font(.system(size: 12))
                                .foregroundColor(Color(hex: "B91C1C"))
                        }
                        .padding(10)
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .background(Color(hex: "FEF2F2"))
                        .cornerRadius(8)
                    }

                    // Save Button
                    Button(action: saveBeneficiary) {
                        HStack(spacing: 8) {
                            if isLoading {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                Text("Registering Loved One...")
                                    .font(.system(size: 15, weight: .bold))
                                    .foregroundColor(.white)
                            } else {
                                Image(systemName: "checkmark")
                                    .font(.system(size: 15, weight: .bold))
                                    .foregroundColor(.white)
                                Text("Save & Add to Family")
                                    .font(.system(size: 15, weight: .bold))
                                    .foregroundColor(.white)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 52)
                        .background(Color(hex: "0D5C3A"))
                        .cornerRadius(12)
                        .shadow(color: Color(hex: "0D5C3A").opacity(0.3), radius: 4, x: 0, y: 2)
                    }
                    .disabled(isLoading)
                    .padding(.top, 8)
                    .padding(.bottom, 24)
                }
                .padding(.horizontal, 16)
                .padding(.top, 12)
            }
            .background(Color(hex: "F8FAF9").ignoresSafeArea())
            .navigationTitle("Add New Loved One")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel", action: onDismiss)
                        .foregroundColor(Color(hex: "0D5C3A"))
                }
            }
        }
    }

    private func reverseGeocode(coordinate: CLLocationCoordinate2D) {
        isGeocoding = true
        let loc = CLLocation(latitude: coordinate.latitude, longitude: coordinate.longitude)
        CLGeocoder().reverseGeocodeLocation(loc) { placemarks, _ in
            isGeocoding = false
            if let p = placemarks?.first {
                var components: [String] = []
                if let subThoroughfare = p.subThoroughfare { components.append(subThoroughfare) }
                if let thoroughfare = p.thoroughfare { components.append(thoroughfare) }
                if let subLocality = p.subLocality { components.append(subLocality) }
                if let locality = p.locality { components.append(locality) }
                if let postalCode = p.postalCode { components.append(postalCode) }

                if !components.isEmpty {
                    self.address = components.joined(separator: ", ")
                }
            }
        }
    }

    private func saveBeneficiary() {
        let trimmedName = fullName.trimmingCharacters(in: .whitespaces)
        if trimmedName.isEmpty {
            errorMessage = "Please enter your loved one's full name."
            return
        }

        let parsedAge = Int(ageText.trimmingCharacters(in: .whitespaces)) ?? 68

        isLoading = true
        errorMessage = nil

        let newBen = Beneficiary(
            id: "ben-\(Date().timeIntervalSince1970)",
            refNumber: "TH-BEN-\(Int.random(in: 1000...9999))",
            fullName: trimmedName,
            category: "Senior Citizen",
            age: parsedAge,
            gender: gender,
            relationship: relationship,
            primaryGuardian: currentUser.name,
            primaryContact: phone.isEmpty ? (currentUser.phone ?? "+91 Not Provided") : phone,
            guardianEmail: currentUser.email,
            address: address.isEmpty ? "Tirupati, Andhra Pradesh" : address,
            latitude: pinnedCoordinate.latitude,
            longitude: pinnedCoordinate.longitude,
            accessibilityNeeds: medicalNotes.isEmpty ? "Assisted Walking & General Elder Care" : medicalNotes,
            status: "Active",
            photoUrl: nil
        )

        Task {
            do {
                let created = try await ThoduApiClient.shared.createBeneficiary(beneficiary: newBen)
                await MainActor.run {
                    isLoading = false
                    onCreated(created)
                    onDismiss()
                }
            } catch {
                await MainActor.run {
                    isLoading = false
                    // If network endpoint is offline, still add locally for seamless continuity
                    onCreated(newBen)
                    onDismiss()
                }
            }
        }
    }
}

