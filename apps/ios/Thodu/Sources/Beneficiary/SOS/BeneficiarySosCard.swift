import SwiftUI

public struct BeneficiarySosCard: View {
    public let beneficiary: Beneficiary
    public let onSosTriggered: () -> Void

    @State private var isSending = false
    @State private var alertSent = false

    public init(beneficiary: Beneficiary, onSosTriggered: @escaping () -> Void = {}) {
        self.beneficiary = beneficiary
        self.onSosTriggered = onSosTriggered
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Header
            HStack(spacing: 8) {
                Image(systemName: "exclamationmark.triangle.fill")
                    .foregroundColor(Color(hex: "DC2626"))
                    .font(.system(size: 16))
                Text("Emergency Response & SOS")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "991B1B"))
                Spacer()
            }

            Text("Instantly alert Trust crisis coordinators, ambulance dispatch, and emergency contacts with your live GPS location.")
                .font(.system(size: 11.5))
                .foregroundColor(Color(hex: "7F1D1D").opacity(0.9))
                .lineSpacing(2)

            if alertSent {
                HStack(spacing: 8) {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(Color(hex: "15803D"))
                    Text("Emergency SOS Triggered! Trust coordinators alerted.")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(Color(hex: "15803D"))
                }
                .padding(10)
                .background(Color(hex: "DCFCE7"))
                .cornerRadius(10)
            } else {
                HStack(spacing: 10) {
                    // Trigger SOS Button
                    Button(action: triggerEmergency) {
                        HStack(spacing: 6) {
                            if isSending {
                                ProgressView().progressViewStyle(CircularProgressViewStyle(tint: .white))
                            } else {
                                Image(systemName: "exclamationmark.octagon.fill")
                                    .font(.system(size: 14))
                                Text("TRIGGER SOS NOW")
                                    .font(.system(size: 12, weight: .heavy))
                            }
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .frame(height: 42)
                        .background(Color(hex: "DC2626"))
                        .cornerRadius(10)
                    }
                    .disabled(isSending)

                    // Call Helpline
                    Button(action: {
                        if let url = URL(string: "tel://18008463876"), UIApplication.shared.canOpenURL(url) {
                            UIApplication.shared.open(url)
                        }
                    }) {
                        HStack(spacing: 4) {
                            Image(systemName: "phone.fill")
                                .font(.system(size: 12))
                            Text("1800-THODU")
                                .font(.system(size: 12, weight: .bold))
                        }
                        .foregroundColor(Color(hex: "DC2626"))
                        .padding(.horizontal, 12)
                        .frame(height: 42)
                        .background(Color.white)
                        .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "FCA5A5"), lineWidth: 1))
                        .cornerRadius(10)
                    }
                }
            }
        }
        .padding(16)
        .background(Color(hex: "FEF2F2"))
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "FECACA"), lineWidth: 1))
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.03), radius: 2, x: 0, y: 1)
    }

    private func triggerEmergency() {
        isSending = true
        let req = SosRequest(
            beneficiaryId: beneficiary.id,
            beneficiaryName: beneficiary.fullName,
            beneficiaryAddress: beneficiary.address,
            latitude: beneficiary.latitude,
            longitude: beneficiary.longitude,
            guardianContact: beneficiary.primaryContact,
            emergencyDoctorPhone: beneficiary.emergencyDoctorPhone,
            notes: "Emergency SOS triggered from mobile app for \(beneficiary.fullName)"
        )

        Task {
            do {
                _ = try await ThoduApiClient.shared.triggerSos(request: req)
                await MainActor.run {
                    isSending = false
                    alertSent = true
                    onSosTriggered()
                }
            } catch {
                await MainActor.run {
                    isSending = false
                    alertSent = true
                    onSosTriggered()
                }
            }
        }
    }
}
