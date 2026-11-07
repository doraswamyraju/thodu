import SwiftUI

public struct BeneficiaryTopBar: View {
    public let beneficiaries: [Beneficiary]
    public let selectedBeneficiary: Beneficiary?
    public let currentUser: AppUser?
    public let onSelectBeneficiary: (Beneficiary) -> Void
    public let onMenuClick: () -> Void
    public let onLogoClick: () -> Void
    public let onLogoutClick: () -> Void
    public let onNotificationClick: () -> Void
    public let onProfileClick: () -> Void
    public let onAddNewLovedOneClick: () -> Void

    @State private var showBeneficiaryPicker = false
    @State private var showLogoutDialog = false

    public init(
        beneficiaries: [Beneficiary],
        selectedBeneficiary: Beneficiary?,
        currentUser: AppUser? = nil,
        onSelectBeneficiary: @escaping (Beneficiary) -> Void,
        onMenuClick: @escaping () -> Void,
        onLogoClick: @escaping () -> Void,
        onLogoutClick: @escaping () -> Void,
        onNotificationClick: @escaping () -> Void = {},
        onProfileClick: @escaping () -> Void = {},
        onAddNewLovedOneClick: @escaping () -> Void = {}
    ) {
        self.beneficiaries = beneficiaries
        self.selectedBeneficiary = selectedBeneficiary
        self.currentUser = currentUser
        self.onSelectBeneficiary = onSelectBeneficiary
        self.onMenuClick = onMenuClick
        self.onLogoClick = onLogoClick
        self.onLogoutClick = onLogoutClick
        self.onNotificationClick = onNotificationClick
        self.onProfileClick = onProfileClick
        self.onAddNewLovedOneClick = onAddNewLovedOneClick
    }

    public var body: some View {
        VStack(spacing: 0) {
            HStack(spacing: 6) {
                // 1. LEFT: Hamburger Menu Icon + Thodu Logo
                HStack(spacing: 4) {
                    Button(action: onMenuClick) {
                        Image(systemName: "line.3.horizontal")
                            .font(.system(size: 19, weight: .bold))
                            .foregroundColor(Color(hex: "143627"))
                            .frame(width: 36, height: 36)
                    }

                    Button(action: onLogoClick) {
                        Image("thodu_topbar_logo")
                            .resizable()
                            .scaledToFit()
                            .frame(height: 30)
                            .cornerRadius(6)
                    }
                }

                Spacer()

                // 2. CENTER: Loved One Switcher Dropdown Pill
                Menu {
                    ForEach(beneficiaries) { ben in
                        Button(action: { onSelectBeneficiary(ben) }) {
                            HStack {
                                Text(ben.fullName)
                                if ben.id == selectedBeneficiary?.id {
                                    Image(systemName: "checkmark")
                                }
                            }
                        }
                    }

                    Divider()

                    Button(action: onAddNewLovedOneClick) {
                        Label("Add New Loved One", systemImage: "person.badge.plus")
                    }
                } label: {
                    HStack(spacing: 6) {
                        ThoduAvatarView(
                            urlString: selectedBeneficiary?.photoUrl,
                            fallbackName: selectedBeneficiary?.fullName ?? "Loved One",
                            size: 24,
                            borderColor: Color(hex: "0D5C3A").opacity(0.2),
                            borderWidth: 1
                        )

                        Text(selectedBeneficiary?.fullName.components(separatedBy: " ").first ?? "Loved One")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(Color(hex: "0D5C3A"))
                            .lineLimit(1)

                        Image(systemName: "chevron.down")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundColor(Color(hex: "0D5C3A"))
                    }
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(Color(hex: "F0FDF4"))
                    .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color(hex: "BBF7D0"), lineWidth: 1))
                    .cornerRadius(18)
                }

                Spacer()

                // 3. RIGHT: Profile Avatar, Notification Bell, Logout
                HStack(spacing: 4) {
                    // Profile Avatar (loads real Google profile pic or fallback initial)
                    Button(action: onProfileClick) {
                        ThoduAvatarView(
                            urlString: currentUser?.avatarUrl,
                            fallbackName: currentUser?.name ?? "User",
                            size: 32,
                            borderColor: Color(hex: "0D5C3A").opacity(0.3),
                            borderWidth: 1.5,
                            backgroundColor: Color(hex: "DCFCE7")
                        )
                    }

                    // Notification Bell with Badge
                    Button(action: onNotificationClick) {
                        ZStack(alignment: .topTrailing) {
                            Image(systemName: "bell")
                                .font(.system(size: 17))
                                .foregroundColor(Color(hex: "374151"))
                                .frame(width: 32, height: 32)

                            Circle()
                                .fill(Color(hex: "DC2626"))
                                .frame(width: 7, height: 7)
                                .offset(x: -4, y: 5)
                        }
                    }

                    // Logout Button
                    Button(action: { showLogoutDialog = true }) {
                        Image(systemName: "rectangle.portrait.and.arrow.right")
                            .font(.system(size: 16))
                            .foregroundColor(Color(hex: "DC2626"))
                            .frame(width: 32, height: 32)
                    }
                }
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(Color.white)
            .shadow(color: Color.black.opacity(0.04), radius: 2, x: 0, y: 1)

            Divider().background(Color(hex: "E5E7EB"))
        }
        .alert("Confirm Logout", isPresented: $showLogoutDialog) {
            Button("Logout", role: .destructive) {
                onLogoutClick()
            }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text("Are you sure you want to log out of Thodu Family Portal?")
        }
    }
}

