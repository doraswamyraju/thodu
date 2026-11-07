import SwiftUI

public struct BeneficiarySubsidyTierCard: View {
    public let beneficiary: Beneficiary

    public init(beneficiary: Beneficiary) {
        self.beneficiary = beneficiary
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Header
            HStack(spacing: 8) {
                Image(systemName: "shield.fill")
                    .foregroundColor(Color(hex: "15803D"))
                    .font(.system(size: 16))
                Text("Partner Grant & Subsidy Tier")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(hex: "111827"))
            }

            // Green Tier Box
            VStack(alignment: .leading, spacing: 6) {
                Text("ACTIVE GRANT TIER")
                    .font(.system(size: 10, weight: .black))
                    .foregroundColor(Color(hex: "166534"))
                    .tracking(0.5)

                HStack {
                    Text(beneficiary.subsidyTier ?? "Trust Sponsored (100%)")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(hex: "15803D"))

                    Spacer()

                    Text("Verified")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 6)
                        .padding(.vertical, 2)
                        .background(Color(hex: "15803D"))
                        .cornerRadius(6)
                }

                Text("Sri Divyang Seva Kendram Trust provides 100% financial coverage for daily in-home elder care, mobility aids & medical monitoring in Tirupati.")
                    .font(.system(size: 11))
                    .foregroundColor(Color(hex: "166534").opacity(0.85))
                    .lineSpacing(2)
            }
            .padding(12)
            .background(Color(hex: "F0FDF4"))
            .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color(hex: "BBF7D0"), lineWidth: 1))
            .cornerRadius(10)

            // Ration card & details
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Ration / BPL Card Number")
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(Color(hex: "64748B"))
                    Text(beneficiary.rationCardNumber ?? "WAP104829103")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(Color(hex: "1E293B"))
                }

                Spacer()

                Button(action: {}) {
                    Text("Apply for Grant")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(Color(hex: "0D5C3A"))
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color(hex: "ECFDF5"))
                        .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color(hex: "A7F3D0"), lineWidth: 1))
                        .cornerRadius(8)
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "E5E7EB"), lineWidth: 1))
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.03), radius: 2, x: 0, y: 1)
    }
}
