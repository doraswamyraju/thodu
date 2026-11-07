import SwiftUI

public struct BeneficiaryProfileHeaderCard: View {
    public let beneficiary: Beneficiary
    public let onViewProfileClick: () -> Void

    public init(beneficiary: Beneficiary, onViewProfileClick: @escaping () -> Void = {}) {
        self.beneficiary = beneficiary
        self.onViewProfileClick = onViewProfileClick
    }

    public var body: some View {
        ZStack(alignment: .topTrailing) {
            // Background horizontal gradient matching Android
            RoundedRectangle(cornerRadius: 20)
                .fill(
                    LinearGradient(
                        colors: [
                            Color(hex: "074326"), // Deep rich forest
                            Color(hex: "0F683D"), // Emerald green
                            Color(hex: "147A47")  // Vibrant green
                        ],
                        startPoint: .leading,
                        endPoint: .trailing
                    )
                )

            // Faint heart watermark in top right
            Image(systemName: "heart.circle.fill")
                .resizable()
                .scaledToFit()
                .frame(width: 90, height: 90)
                .foregroundColor(Color.white.opacity(0.08))
                .offset(x: 10, y: -10)
                .clipped()

            HStack(spacing: 12) {
                // Circular portrait avatar with double white border (loads real photo)
                ThoduAvatarView(
                    urlString: beneficiary.photoUrl,
                    fallbackName: beneficiary.fullName,
                    size: 56,
                    borderColor: .white,
                    borderWidth: 2.5
                )

                // Info Column
                VStack(alignment: .leading, spacing: 3) {
                    // Beneficiary pill badge
                    Text("Beneficiary")
                        .font(.system(size: 10, weight: .bold))
                        .foregroundColor(Color(hex: "074326"))
                        .padding(.horizontal, 7)
                        .padding(.vertical, 2)
                        .background(Color.white.opacity(0.95))
                        .cornerRadius(10)

                    // Full name
                    Text(beneficiary.fullName)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.white)
                        .lineLimit(1)
                        .minimumScaleFactor(0.85)

                    // Age & Location Row
                    HStack(spacing: 4) {
                        Image(systemName: "calendar")
                            .font(.system(size: 10))
                            .foregroundColor(Color.white.opacity(0.85))
                        Text("\(beneficiary.age) Yrs")
                            .font(.system(size: 11))
                            .foregroundColor(Color.white.opacity(0.9))

                        Text("|")
                            .font(.system(size: 10))
                            .foregroundColor(Color.white.opacity(0.6))

                        Image(systemName: "mappin.and.ellipse")
                            .font(.system(size: 10))
                            .foregroundColor(Color.white.opacity(0.85))
                        Text(beneficiary.address.components(separatedBy: ",").first ?? "Tirupati")
                            .font(.system(size: 11))
                            .foregroundColor(Color.white.opacity(0.9))
                            .lineLimit(1)
                    }
                }

                Spacer()

                // "View Profile >" Glass Button
                Button(action: onViewProfileClick) {
                    HStack(spacing: 2) {
                        Text("View Profile")
                            .font(.system(size: 11, weight: .semibold))
                            .foregroundColor(.white)
                        Image(systemName: "chevron.right")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 6)
                    .background(Color.white.opacity(0.18))
                    .overlay(
                        RoundedRectangle(cornerRadius: 20)
                            .stroke(Color.white.opacity(0.4), lineWidth: 1)
                    )
                    .cornerRadius(20)
                }
            }
            .padding(16)
        }
        .frame(height: 104)
        .shadow(color: Color.black.opacity(0.08), radius: 4, x: 0, y: 2)
    }
}

