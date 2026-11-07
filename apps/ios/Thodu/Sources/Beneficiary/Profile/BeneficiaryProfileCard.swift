import SwiftUI

public struct BeneficiaryProfileCard: View {
    public let beneficiary: Beneficiary
    public let onBookCareClick: () -> Void

    public init(beneficiary: Beneficiary, onBookCareClick: @escaping () -> Void) {
        self.beneficiary = beneficiary
        self.onBookCareClick = onBookCareClick
    }

    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            // Header Row
            HStack(spacing: 12) {
                ThoduAvatarView(
                    urlString: beneficiary.photoUrl,
                    fallbackName: beneficiary.fullName,
                    size: 50,
                    borderColor: Color(hex: "0D5C3A"),
                    borderWidth: 1.5
                )

                VStack(alignment: .leading, spacing: 2) {
                    HStack(spacing: 6) {
                        Text(beneficiary.fullName)
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(Color(hex: "111827"))

                        Text(beneficiary.status)
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(Color(hex: "15803D"))
                            .padding(.horizontal, 6)
                            .padding(.vertical, 1)
                            .background(Color(hex: "DCFCE7"))
                            .cornerRadius(6)
                    }

                    Text("ID: \(beneficiary.refNumber) • \(beneficiary.category)")
                        .font(.system(size: 11))
                        .foregroundColor(Color(hex: "6B7280"))
                }

                Spacer()

                Button(action: onBookCareClick) {
                    HStack(spacing: 4) {
                        Image(systemName: "plus")
                            .font(.system(size: 11, weight: .bold))
                        Text("Book Care")
                            .font(.system(size: 11.5, weight: .bold))
                    }
                    .foregroundColor(.white)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color(hex: "0D5C3A"))
                    .cornerRadius(8)
                }
            }

            Divider().background(Color(hex: "F1F5F9"))

            // Detailed Grid Info
            VStack(spacing: 8) {
                ProfileFieldRow(iconName: "person.2.fill", label: "Relationship", value: beneficiary.relationship)
                ProfileFieldRow(iconName: "person.crop.circle.badge.checkmark", label: "Primary Guardian", value: beneficiary.primaryGuardian.isEmpty ? "Anita Sharma" : beneficiary.primaryGuardian)
                ProfileFieldRow(iconName: "phone.fill", label: "Emergency Phone", value: beneficiary.primaryContact)
                ProfileFieldRow(iconName: "drop.fill", label: "Blood Group", value: beneficiary.bloodGroup ?? "O Positive (O+)")
                ProfileFieldRow(iconName: "mappin.circle.fill", label: "Home Address", value: beneficiary.address)
            }
        }
        .padding(16)
        .background(Color.white)
        .overlay(RoundedRectangle(cornerRadius: 16).stroke(Color(hex: "E5E7EB"), lineWidth: 1))
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.03), radius: 2, x: 0, y: 1)
    }
}

public struct ProfileFieldRow: View {
    public let iconName: String
    public let label: String
    public let value: String

    public var body: some View {
        HStack(spacing: 8) {
            Image(systemName: iconName)
                .font(.system(size: 12))
                .foregroundColor(Color(hex: "0D5C3A"))
                .frame(width: 18)

            Text(label)
                .font(.system(size: 11.5, weight: .medium))
                .foregroundColor(Color(hex: "64748B"))
                .frame(width: 115, alignment: .leading)

            Text(value)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(Color(hex: "1E293B"))
                .lineLimit(1)

            Spacer()
        }
    }
}

