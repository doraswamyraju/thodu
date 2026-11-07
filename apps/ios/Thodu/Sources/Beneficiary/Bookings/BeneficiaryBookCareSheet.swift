import SwiftUI

public struct BeneficiaryBookCareSheet: View {
    public let beneficiary: Beneficiary
    public let services: [CareService]
    public let onDismiss: () -> Void
    public let onBookingCreated: () -> Void

    @State private var selectedService: CareService?
    @State private var instructions: String = ""
    @State private var isSubmitting: Bool = false
    @State private var errorMessage: String? = nil

    public init(
        beneficiary: Beneficiary,
        services: [CareService],
        onDismiss: @escaping () -> Void,
        onBookingCreated: @escaping () -> Void
    ) {
        self.beneficiary = beneficiary
        self.services = services
        self.onDismiss = onDismiss
        self.onBookingCreated = onBookingCreated
        _selectedService = State(initialValue: services.first)
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Schedule Care Visit")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(Color(hex: "0F3E26"))
                    Text("For \(beneficiary.fullName)")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "64748B"))
                }
                Spacer()
                Button(action: onDismiss) {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 22))
                        .foregroundColor(Color(hex: "94A3B8"))
                }
            }

            Divider()

            // Service Picker
            VStack(alignment: .leading, spacing: 6) {
                Text("Select Care Service")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(Color(hex: "1E293B"))

                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(services.isEmpty ? [CareService(id: "default", name: "In-Home Companion", category: "Daily Living")] : services) { srv in
                            let isSelected = selectedService?.id == srv.id
                            Button(action: { selectedService = srv }) {
                                Text(srv.name)
                                    .font(.system(size: 12, weight: isSelected ? .bold : .medium))
                                    .foregroundColor(isSelected ? .white : Color(hex: "1F2937"))
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 7)
                                    .background(isSelected ? Color(hex: "0D5C3A") : Color(hex: "F1F5F9"))
                                    .cornerRadius(10)
                            }
                        }
                    }
                }
            }

            // Location
            HStack(spacing: 8) {
                Image(systemName: "mappin.and.ellipse")
                    .foregroundColor(Color(hex: "0D5C3A"))
                Text(beneficiary.address)
                    .font(.system(size: 12))
                    .foregroundColor(Color(hex: "475569"))
            }
            .padding(10)
            .background(Color(hex: "F8FAF9"))
            .cornerRadius(10)

            // Special notes
            VStack(alignment: .leading, spacing: 4) {
                Text("Special Instructions")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(Color(hex: "64748B"))
                TextField("Caregiver preferences, diet, mobility notes...", text: $instructions)
                    .font(.system(size: 13))
                    .padding(10)
                    .background(Color(hex: "F8FAF9"))
                    .cornerRadius(10)
            }

            if let err = errorMessage {
                Text(err)
                    .font(.system(size: 12))
                    .foregroundColor(.red)
            }

            // Submit Button
            Button(action: submitQuickBooking) {
                HStack {
                    if isSubmitting {
                        ProgressView().progressViewStyle(CircularProgressViewStyle(tint: .white))
                    } else {
                        Text("Confirm Caregiver Visit")
                            .font(.system(size: 14, weight: .bold))
                    }
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 48)
                .background(Color(hex: "0D5C3A"))
                .cornerRadius(12)
            }
            .disabled(isSubmitting)
        }
        .padding(20)
        .background(Color.white)
        .cornerRadius(20)
    }

    private func submitQuickBooking() {
        guard let srv = selectedService ?? services.first else {
            errorMessage = "Please select a service"
            return
        }

        isSubmitting = true
        let req = CreateBookingRequest(
            beneficiaryId: beneficiary.id,
            beneficiaryName: beneficiary.fullName,
            serviceName: srv.name,
            scheduledDate: "Today, Immediate",
            scheduledTimeSlot: "10:00 AM - 12:00 PM",
            serviceAddress: beneficiary.address,
            guardianPhone: beneficiary.primaryContact,
            specialInstructions: instructions.isEmpty ? nil : instructions,
            fundingTier: beneficiary.subsidyTier ?? "Trust Sponsored"
        )

        Task {
            do {
                _ = try await ThoduApiClient.shared.createBooking(request: req)
                await MainActor.run {
                    isSubmitting = false
                    onBookingCreated()
                    onDismiss()
                }
            } catch {
                await MainActor.run {
                    isSubmitting = false
                    onBookingCreated()
                    onDismiss()
                }
            }
        }
    }
}

