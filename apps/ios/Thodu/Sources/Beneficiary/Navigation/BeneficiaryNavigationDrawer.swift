import SwiftUI

public struct BeneficiaryNavigationDrawer: View {
    public let currentUser: AppUser
    public let beneficiaries: [Beneficiary]
    public let selectedBeneficiary: Beneficiary?
    public let currentTab: BeneficiaryNavTab
    public let onTabSelected: (BeneficiaryNavTab) -> Void
    public let onSelectBeneficiary: (Beneficiary) -> Void
    public let onLogoutClick: () -> Void
    public let onCloseDrawer: () -> Void

    public init(
        currentUser: AppUser,
        beneficiaries: [Beneficiary],
        selectedBeneficiary: Beneficiary?,
        currentTab: BeneficiaryNavTab,
        onTabSelected: @escaping (BeneficiaryNavTab) -> Void,
        onSelectBeneficiary: @escaping (Beneficiary) -> Void,
        onLogoutClick: @escaping () -> Void,
        onCloseDrawer: @escaping () -> Void
    ) {
        self.currentUser = currentUser
        self.beneficiaries = beneficiaries
        self.selectedBeneficiary = selectedBeneficiary
        self.currentTab = currentTab
        self.onTabSelected = onTabSelected
        self.onSelectBeneficiary = onSelectBeneficiary
        self.onLogoutClick = onLogoutClick
        self.onCloseDrawer = onCloseDrawer
    }

    private let menuItems: [BeneficiaryNavTab] = [.TODAY, .BOOKINGS, .HEALTH, .SUBSIDIES, .PROFILE]

    public var body: some View {
        ZStack(alignment: .leading) {
            Color(hex: "073D26").ignoresSafeArea()

            VStack(alignment: .leading, spacing: 18) {
                // Header Logo
                HStack(spacing: 8) {
                    Image("thodu_topbar_logo")
                        .resizable()
                        .scaledToFit()
                        .frame(height: 28)

                    Spacer()

                    Button(action: onCloseDrawer) {
                        Image(systemName: "xmark")
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.white.opacity(0.8))
                            .frame(width: 32, height: 32)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 16)

                // Current User Profile Header
                HStack(spacing: 12) {
                    ZStack {
                        Circle()
                            .fill(Color(hex: "15803D"))
                            .frame(width: 44, height: 44)
                        Text(currentUser.name.prefix(1).uppercased())
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        Text(currentUser.name)
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.white)
                        Text(currentUser.email)
                            .font(.system(size: 11))
                            .foregroundColor(.white.opacity(0.75))
                            .lineLimit(1)
                        Text("Family Guardian • Tirupati")
                            .font(.system(size: 10, weight: .semibold))
                            .foregroundColor(Color(hex: "FDE047"))
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color.white.opacity(0.08))
                .cornerRadius(12)
                .padding(.horizontal, 16)

                // Loved Ones List
                VStack(alignment: .leading, spacing: 6) {
                    Text("LOVED ONES")
                        .font(.system(size: 10, weight: .black))
                        .tracking(0.5)
                        .foregroundColor(.white.opacity(0.6))
                        .padding(.horizontal, 20)

                    ForEach(beneficiaries) { ben in
                        let isSelected = selectedBeneficiary?.id == ben.id
                        Button(action: {
                            onSelectBeneficiary(ben)
                            onCloseDrawer()
                        }) {
                            HStack(spacing: 10) {
                                Image("avatar_saraswathi")
                                    .resizable()
                                    .frame(width: 28, height: 28)
                                    .clipShape(Circle())

                                VStack(alignment: .leading, spacing: 1) {
                                    Text(ben.fullName)
                                        .font(.system(size: 13, weight: isSelected ? .bold : .medium))
                                        .foregroundColor(.white)
                                    Text("\(ben.age) yrs • \(ben.relationship)")
                                        .font(.system(size: 10))
                                        .foregroundColor(.white.opacity(0.7))
                                }

                                Spacer()

                                if isSelected {
                                    Circle()
                                        .fill(Color(hex: "22C55E"))
                                        .frame(width: 8, height: 8)
                                }
                            }
                            .padding(.horizontal, 14)
                            .padding(.vertical, 8)
                            .background(isSelected ? Color.white.opacity(0.12) : Color.clear)
                            .cornerRadius(10)
                        }
                        .padding(.horizontal, 12)
                    }
                }

                Divider().background(Color.white.opacity(0.15))

                // Navigation Tabs
                VStack(spacing: 4) {
                    ForEach(menuItems) { tab in
                        let isSelected = currentTab == tab
                        Button(action: {
                            onTabSelected(tab)
                            onCloseDrawer()
                        }) {
                            HStack(spacing: 12) {
                                Image(systemName: tab.iconName)
                                    .font(.system(size: 16))
                                    .foregroundColor(isSelected ? Color(hex: "FDE047") : .white.opacity(0.85))
                                    .frame(width: 24)

                                Text(tab.rawValue)
                                    .font(.system(size: 14, weight: isSelected ? .bold : .medium))
                                    .foregroundColor(isSelected ? Color(hex: "FDE047") : .white)

                                Spacer()
                            }
                            .padding(.horizontal, 16)
                            .padding(.vertical, 10)
                            .background(isSelected ? Color.white.opacity(0.15) : Color.clear)
                            .cornerRadius(10)
                        }
                        .padding(.horizontal, 12)
                    }
                }

                Spacer()

                // Emergency Helpline Card
                VStack(alignment: .leading, spacing: 6) {
                    HStack(spacing: 6) {
                        Image(systemName: "phone.badge.waveform.fill")
                            .foregroundColor(Color(hex: "FDE047"))
                        Text("24/7 Trust Helpline")
                            .font(.system(size: 12, weight: .bold))
                            .foregroundColor(.white)
                    }
                    Text("Tirupati: 1800-THODU-SOS (84638)")
                        .font(.system(size: 11, weight: .heavy))
                        .foregroundColor(Color(hex: "FDE047"))
                }
                .padding(12)
                .frame(maxWidth: .infinity, alignment: .leading)
                .background(Color.white.opacity(0.08))
                .cornerRadius(12)
                .padding(.horizontal, 16)

                // Logout
                Button(action: {
                    onCloseDrawer()
                    onLogoutClick()
                }) {
                    HStack(spacing: 10) {
                        Image(systemName: "rectangle.portrait.and.arrow.right")
                            .font(.system(size: 15))
                            .foregroundColor(Color(hex: "F87171"))
                        Text("Sign Out")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(Color(hex: "F87171"))
                        Spacer()
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                }
                .padding(.horizontal, 12)
                .padding(.bottom, 20)
            }
        }
        .frame(width: 290)
    }
}
