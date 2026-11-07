import SwiftUI

public struct BeneficiaryHealthDossierCard: View {
    public let beneficiary: Beneficiary

    public init(beneficiary: Beneficiary) {
        self.beneficiary = beneficiary
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Header
            HStack(spacing: 10) {
                ZStack {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(Color(hex: "EFF6FF"))
                        .frame(width: 36, height: 36)
                    Image(systemName: "cross.case.fill")
                        .font(.system(size: 18))
                        .foregroundColor(Color(hex: "2563EB"))
                }

                VStack(alignment: .leading, spacing: 2) {
                    Text("Clinical Health Dossier")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(Color(hex: "111827"))
                    Text("Medical conditions, accessibility needs & doctor")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "6B7280"))
                }
            }

            Divider().background(Color(hex: "F1F5F9"))

            // Conditions Chips
            VStack(alignment: .leading, spacing: 6) {
                Text("CHRONIC CONDITIONS & VITALS")
                    .font(.system(size: 10, weight: .bold))
                    .foregroundColor(Color(hex: "64748B"))
                    .tracking(0.5)

                let conditions = beneficiary.medicalConditions ?? ["Hypertension", "Type 2 Diabetes", "Mobility Assistance"]
                HStack(spacing: 6) {
                    ForEach(conditions, id: \.self) { condition in
                        Text(condition)
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(Color(hex: "1E40AF"))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color(hex: "DBEAFE"))
                            .cornerRadius(8)
                    }
                }
            }

            // Allergies & Mobility Notes
            VStack(alignment: .leading, spacing: 6) {
                HStack {
                    Text("Allergies:")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(Color(hex: "334155"))
                    Text(beneficiary.allergies ?? "Penicillin, Dust")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "DC2626"))
                }

                HStack {
                    Text("Accessibility:")
                        .font(.system(size: 12, weight: .bold))
                        .foregroundColor(Color(hex: "334155"))
                    Text(beneficiary.accessibilityNeeds ?? "Wheelchair required for stairs")
                        .font(.system(size: 12))
                        .foregroundColor(Color(hex: "475569"))
                }
            }

            // Attending Doctor Card
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Attending Physician")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(Color(hex: "64748B"))
                    Text(beneficiary.emergencyDoctorName ?? "Dr. K. Srinivas (Cardiologist)")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(Color(hex: "0F172A"))
                    Text("SVIMS Hospital, Tirupati")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "64748B"))
                }

                Spacer()

                Button(action: {
                    let phone = beneficiary.emergencyDoctorPhone ?? "+919440012345"
                    if let url = URL(string: "tel://\(phone.replacingOccurrences(of: " ", with: ""))"), UIApplication.shared.canOpenURL(url) {
                        UIApplication.shared.open(url)
                    }
                }) {
                    HStack(spacing: 4) {
                        Image(systemName: "phone.fill")
                            .font(.system(size: 11))
                        Text("Call Doctor")
                            .font(.system(size: 11, weight: .bold))
                    }
                    .foregroundColor(.white)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color(hex: "2563EB"))
                    .cornerRadius(8)
                }
            }
            .padding(10)
            .background(Color(hex: "F8FAFC"))
            .cornerRadius(10)
        }
        .padding(16)
        .background(Color.white)
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "E5E7EB"), lineWidth: 1))
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.03), radius: 2, x: 0, y: 1)
    }
}
