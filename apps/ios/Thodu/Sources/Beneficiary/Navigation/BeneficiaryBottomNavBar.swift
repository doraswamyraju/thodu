import SwiftUI

public struct BeneficiaryBottomNavBar: View {
    public let currentTab: BeneficiaryNavTab
    public let onTabSelected: (BeneficiaryNavTab) -> Void

    public init(
        currentTab: BeneficiaryNavTab,
        onTabSelected: @escaping (BeneficiaryNavTab) -> Void
    ) {
        self.currentTab = currentTab
        self.onTabSelected = onTabSelected
    }

    private let tabs: [BeneficiaryNavTab] = [.TODAY, .BOOKINGS, .HEALTH, .PROFILE]

    public var body: some View {
        VStack(spacing: 0) {
            Divider().background(Color(hex: "E5E7EB"))

            HStack(spacing: 0) {
                ForEach(tabs) { tab in
                    let isSelected = currentTab == tab
                    Button(action: { onTabSelected(tab) }) {
                        VStack(spacing: 4) {
                            ZStack {
                                if isSelected {
                                    Capsule()
                                        .fill(Color(hex: "E8F5E9"))
                                        .frame(width: 48, height: 26)
                                }

                                Image(systemName: tab.iconName)
                                    .font(.system(size: 17, weight: isSelected ? .bold : .regular))
                                    .foregroundColor(isSelected ? Color(hex: "0D5C3A") : Color(hex: "6B7280"))
                            }

                            Text(tab.rawValue)
                                .font(.system(size: 11, weight: isSelected ? .bold : .medium))
                                .foregroundColor(isSelected ? Color(hex: "0D5C3A") : Color(hex: "6B7280"))
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 6)
                    }
                    .buttonStyle(PlainButtonStyle())
                }
            }
            .frame(height: 56)
            .background(Color.white)
        }
    }
}

