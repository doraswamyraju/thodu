import SwiftUI
import Combine

public struct BeneficiaryBannersCarousel: View {
    public let onBannerClick: (PromoBanner) -> Void

    @State private var currentIndex: Int = 0
    private let timer = Timer.publish(every: 4.0, on: .main, in: .common).autoconnect()

    public let banners: [PromoBanner] = [
        PromoBanner(
            id: "b1",
            tag: "VERIFIED ELDER CARE",
            title: "Tirupati's Trusted Home Attendants",
            subtitle: "Background-verified, compassionate caregivers for companionship, mobility & household care",
            ctaText: "Book Caregiver",
            iconName: "heart.text.square.fill",
            gradientColors: [Color(hex: "064E3B"), Color(hex: "047857"), Color(hex: "059669")],
            accentColor: Color(hex: "FDE047")
        ),
        PromoBanner(
            id: "b2",
            tag: "SPECIAL CARE PACKAGE",
            title: "Monthly Vitals & Health Dossier",
            subtitle: "Dedicated nurse visit twice a week for BP, SpO2, blood sugar & doctor consultation",
            ctaText: "View Package",
            iconName: "cross.case.fill",
            gradientColors: [Color(hex: "1E3A8A"), Color(hex: "2563EB"), Color(hex: "3B82F6")],
            accentColor: Color(hex: "67E8F9")
        ),
        PromoBanner(
            id: "b3",
            tag: "FESTIVE WELLNESS OFFER",
            title: "Flat ₹200 Off First Home Physio",
            subtitle: "Post-stroke mobility, joint rehabilitation & gentle elder therapy at your doorstep",
            ctaText: "Claim Offer",
            iconName: "gift.fill",
            gradientColors: [Color(hex: "78350F"), Color(hex: "D97706"), Color(hex: "F59E0B")],
            accentColor: Color(hex: "FEF08A")
        )
    ]

    public init(onBannerClick: @escaping (PromoBanner) -> Void = { _ in }) {
        self.onBannerClick = onBannerClick
    }

    public var body: some View {
        VStack(spacing: 8) {
            TabView(selection: $currentIndex) {
                ForEach(0..<banners.count, id: \.self) { index in
                    let banner = banners[index]
                    ZStack(alignment: .trailing) {
                        // Background Gradient
                        RoundedRectangle(cornerRadius: 18)
                            .fill(LinearGradient(colors: banner.gradientColors, startPoint: .leading, endPoint: .trailing))

                        // Large decorative background icon
                        Image(systemName: banner.iconName)
                            .resizable()
                            .scaledToFit()
                            .frame(width: 110, height: 110)
                            .foregroundColor(Color.white.opacity(0.12))
                            .offset(x: 18)
                            .clipped()

                        // Foreground content
                        VStack(alignment: .leading, spacing: 6) {
                            // Tag pill
                            Text(banner.tag)
                                .font(.system(size: 9, weight: .black))
                                .tracking(0.5)
                                .foregroundColor(banner.accentColor)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(banner.accentColor.opacity(0.25))
                                .cornerRadius(6)

                            // Title & Subtitle
                            VStack(alignment: .leading, spacing: 2) {
                                Text(banner.title)
                                    .font(.system(size: 15, weight: .bold))
                                    .foregroundColor(.white)
                                    .lineLimit(1)

                                Text(banner.subtitle)
                                    .font(.system(size: 11))
                                    .foregroundColor(Color.white.opacity(0.88))
                                    .lineLimit(2)
                                    .lineSpacing(2)
                            }

                            Spacer(minLength: 0)

                            // CTA Link
                            HStack(spacing: 4) {
                                Text(banner.ctaText)
                                    .font(.system(size: 11.5, weight: .bold))
                                    .foregroundColor(banner.accentColor)

                                Image(systemName: "arrow.right")
                                    .font(.system(size: 10, weight: .bold))
                                    .foregroundColor(banner.accentColor)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.trailing, 60)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 14)
                    }
                    .tag(index)
                    .onTapGesture {
                        onBannerClick(banner)
                    }
                }
            }
            .tabViewStyle(PageTabViewStyle(indexDisplayMode: .never))
            .frame(height: 132)
            .shadow(color: Color.black.opacity(0.06), radius: 3, x: 0, y: 2)
            .onReceive(timer) { _ in
                withAnimation {
                    currentIndex = (currentIndex + 1) % banners.count
                }
            }

            // Pager dots indicator
            HStack(spacing: 6) {
                ForEach(0..<banners.count, id: \.self) { idx in
                    Capsule()
                        .fill(currentIndex == idx ? Color(hex: "0D5C3A") : Color(hex: "D1D5DB"))
                        .frame(width: currentIndex == idx ? 18 : 5, height: 4)
                        .animation(.easeInOut(duration: 0.25), value: currentIndex)
                }
            }
        }
    }
}
