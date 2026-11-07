import SwiftUI

public struct BeneficiaryDashboardView: View {
    public let currentUser: AppUser
    public let onLogout: () -> Void

    @State private var currentTab: BeneficiaryNavTab = .TODAY
    @State private var beneficiaries: [Beneficiary] = []
    @State private var selectedBeneficiary: Beneficiary? = nil
    @State private var bookings: [Booking] = []
    @State private var services: [CareService] = []
    @State private var isLoading = true
    @State private var isDrawerOpen = false
    @State private var showBookCareSheet = false
    @State private var showBookServiceScreen = false
    @State private var selectedServiceForBooking: CareService? = nil
    @State private var showNotificationsSheet = false
    @State private var showSosConfirmation = false

    public init(currentUser: AppUser, onLogout: @escaping () -> Void) {
        self.currentUser = currentUser
        self.onLogout = onLogout
    }

    private var activeBooking: Booking? {
        bookings.first { $0.beneficiaryId == selectedBeneficiary?.id || $0.beneficiaryName == selectedBeneficiary?.fullName }
            ?? bookings.first
    }

    public var body: some View {
        ZStack {
            Color(hex: "F8FAF9").ignoresSafeArea()

            // Main App Scaffold
            VStack(spacing: 0) {
                // 1. Top Bar
                BeneficiaryTopBar(
                    beneficiaries: beneficiaries,
                    selectedBeneficiary: selectedBeneficiary,
                    currentUser: currentUser,
                    onSelectBeneficiary: { ben in
                        selectedBeneficiary = ben
                    },
                    onMenuClick: {
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                            isDrawerOpen.toggle()
                        }
                    },
                    onLogoClick: {
                        currentTab = .TODAY
                    },
                    onLogoutClick: onLogout,
                    onNotificationClick: {
                        showNotificationsSheet = true
                    },
                    onProfileClick: {
                        currentTab = .PROFILE
                    },
                    onAddNewLovedOneClick: {
                        showBookServiceScreen = true
                    }
                )

                // 2. Tab Content Container
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 14) {
                        if isLoading {
                            HStack(spacing: 8) {
                                ProgressView()
                                    .progressViewStyle(CircularProgressViewStyle(tint: Color(hex: "0D5C3A")))
                                Text("Refreshing Family Portal...")
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(Color(hex: "64748B"))
                            }
                            .frame(maxWidth: .infinity)
                            .padding(.top, 10)
                        }

                        switch currentTab {
                        case .TODAY:
                            if let ben = selectedBeneficiary {
                                BeneficiaryTodayTabContent(
                                    selectedBeneficiary: ben,
                                    activeBooking: activeBooking,
                                    services: services,
                                    onBookCareClick: {
                                        selectedServiceForBooking = nil
                                        showBookServiceScreen = true
                                    },
                                    onSelectServiceToBook: { srv in
                                        selectedServiceForBooking = srv
                                        showBookServiceScreen = true
                                    },
                                    onNotificationCenterClick: {
                                        showNotificationsSheet = true
                                    },
                                    onProfileClick: {
                                        currentTab = .PROFILE
                                    }
                                )
                            }

                        case .BOOKINGS:
                            MyBookingsScreen(
                                bookings: bookings,
                                onBookNewServiceClick: {
                                    selectedServiceForBooking = nil
                                    showBookServiceScreen = true
                                },
                                onLiveTrackingClick: { _ in
                                    currentTab = .TODAY
                                },
                                onCallSupportClick: {
                                    if let url = URL(string: "tel://18008463876"), UIApplication.shared.canOpenURL(url) {
                                        UIApplication.shared.open(url)
                                    }
                                },
                                onRebookClick: { booking in
                                    selectedServiceForBooking = services.first { $0.name.localizedCaseInsensitiveContains(booking.serviceName) }
                                    showBookServiceScreen = true
                                }
                            )

                        case .HEALTH:
                            if let ben = selectedBeneficiary {
                                BeneficiaryProfileCard(
                                    beneficiary: ben,
                                    onBookCareClick: { showBookCareSheet = true }
                                )
                                BeneficiaryHealthDossierCard(
                                    beneficiary: ben
                                )
                            }
                            BeneficiaryDispatchVitalsCard(
                                activeBooking: activeBooking
                            )

                        case .SUBSIDIES:
                            if let ben = selectedBeneficiary {
                                BeneficiarySubsidyTierCard(
                                    beneficiary: ben
                                )
                                BeneficiaryProfileCard(
                                    beneficiary: ben,
                                    onBookCareClick: { showBookCareSheet = true }
                                )
                            }

                        case .PROFILE:
                            if let ben = selectedBeneficiary {
                                BeneficiaryProfileCard(
                                    beneficiary: ben,
                                    onBookCareClick: { showBookCareSheet = true }
                                )
                                BeneficiaryHealthDossierCard(
                                    beneficiary: ben
                                )
                            }
                        }

                        Spacer(minLength: 160)
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 12)
                }
                .background(Color(hex: "F8FAF9").ignoresSafeArea())

                // 3. Bottom Navigation Bar
                BeneficiaryBottomNavBar(
                    currentTab: currentTab,
                    onTabSelected: { tab in
                        currentTab = tab
                    }
                )
            }

            // Floating SOS Alert & Quick Book Button
            VStack {
                Spacer()
                HStack {
                    // Floating SOS Button (Red pill)
                    Button(action: { showSosConfirmation = true }) {
                        HStack(spacing: 5) {
                            Image(systemName: "exclamationmark.triangle.fill")
                                .font(.system(size: 13, weight: .bold))
                            Text("SOS")
                                .font(.system(size: 13, weight: .heavy))
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 10)
                        .background(Color(hex: "DC2626"))
                        .clipShape(Capsule())
                        .shadow(color: Color(hex: "DC2626").opacity(0.35), radius: 4, x: 0, y: 2)
                    }

                    Spacer()

                    // Floating "+ Book Service" Button
                    Button(action: {
                        selectedServiceForBooking = nil
                        showBookServiceScreen = true
                    }) {
                        HStack(spacing: 6) {
                            Image(systemName: "plus")
                                .font(.system(size: 13, weight: .bold))
                            Text("Book Care")
                                .font(.system(size: 13, weight: .bold))
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 16)
                        .padding(.vertical, 10)
                        .background(Color(hex: "0D5C3A"))
                        .clipShape(Capsule())
                        .shadow(color: Color(hex: "0D5C3A").opacity(0.35), radius: 4, x: 0, y: 2)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 72)
            }

            // Slide-out Navigation Drawer Overlay
            if isDrawerOpen {
                Color.black.opacity(0.4)
                    .ignoresSafeArea()
                    .onTapGesture {
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                            isDrawerOpen = false
                        }
                    }

                HStack {
                    BeneficiaryNavigationDrawer(
                        currentUser: currentUser,
                        beneficiaries: beneficiaries,
                        selectedBeneficiary: selectedBeneficiary,
                        currentTab: currentTab,
                        onTabSelected: { tab in
                            currentTab = tab
                        },
                        onSelectBeneficiary: { ben in
                            selectedBeneficiary = ben
                        },
                        onLogoutClick: onLogout,
                        onCloseDrawer: {
                            withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                                isDrawerOpen = false
                            }
                        }
                    )
                    .transition(.move(edge: .leading))

                    Spacer()
                }
                .ignoresSafeArea()
            }
        }
        .onAppear {
            loadData()
        }
        .sheet(isPresented: $showBookCareSheet) {
            if let ben = selectedBeneficiary {
                BeneficiaryBookCareSheet(
                    beneficiary: ben,
                    services: services,
                    onDismiss: { showBookCareSheet = false },
                    onBookingCreated: { loadData() }
                )
            }
        }
        .sheet(isPresented: $showNotificationsSheet) {
            NotificationsBottomSheet(
                onDismiss: { showNotificationsSheet = false }
            )
        }
        .sheet(isPresented: $showBookServiceScreen) {
            BookServiceScreen(
                currentUser: currentUser,
                beneficiaries: beneficiaries,
                selectedBeneficiary: selectedBeneficiary,
                initialService: selectedServiceForBooking,
                onBackClick: { showBookServiceScreen = false },
                onBookingSuccess: {
                    showBookServiceScreen = false
                    loadData()
                }
            )
        }
        .alert("Emergency SOS Alert", isPresented: $showSosConfirmation) {
            Button("Cancel", role: .cancel) {}
            Button("CONFIRM SOS", role: .destructive) {
                if let ben = selectedBeneficiary {
                    let req = SosRequest(
                        beneficiaryId: ben.id,
                        beneficiaryName: ben.fullName,
                        beneficiaryAddress: ben.address,
                        latitude: ben.latitude,
                        longitude: ben.longitude,
                        guardianContact: ben.primaryContact
                    )
                    Task {
                        _ = try? await ThoduApiClient.shared.triggerSos(request: req)
                    }
                }
            }
        } message: {
            Text("This will immediately transmit your emergency coordinates and notify Sri Divyang Seva Kendram Trust responders and ambulance dispatch.")
        }
    }

    private func loadData() {
        isLoading = true
        Task {
            // Personalized user fallback beneficiary
            let userFallbackBen = Beneficiary(
                id: "ben-\(currentUser.id)",
                refNumber: "TH-BEN-001",
                fullName: currentUser.name,
                category: "Senior Citizen",
                age: 68,
                gender: "Not Specified",
                relationship: "Self (Loved One)",
                primaryGuardian: currentUser.name,
                primaryContact: currentUser.phone ?? "+91 Not Provided",
                guardianEmail: currentUser.email,
                address: "Tirupati, Andhra Pradesh",
                status: "Active",
                photoUrl: currentUser.avatarUrl
            )

            // Fallback sample booking tailored to this user
            let sampleBooking = Booking(
                id: "bk-001",
                bookingNumber: "#TH-BK-8921",
                beneficiaryId: userFallbackBen.id,
                beneficiaryName: userFallbackBen.fullName,
                beneficiaryAge: userFallbackBen.age,
                guardianPhone: userFallbackBen.primaryContact,
                serviceName: "Household Support & Vitals",
                scheduledDate: "Today",
                scheduledTimeSlot: "10:00 AM - 4:00 PM",
                serviceAddress: userFallbackBen.address,
                caregiverId: "cg-anitha",
                caregiverName: "Anitha",
                caregiverEtaMinutes: 18,
                status: "In Progress",
                fundingTier: "Trust Sponsored (100%)",
                specialInstructions: "Assistance with morning vitals check and lunch preparation",
                vitals: VitalsLog(
                    bloodPressure: "124/82",
                    pulseBpm: 74,
                    oxygenSpo2: 98,
                    bloodSugarMgDl: 110,
                    recordedAt: "Today, 09:15 AM"
                )
            )

            // 1. Fetch Beneficiaries (filter by current logged-in user email)
            var fetchedBens: [Beneficiary] = []
            do {
                fetchedBens = try await ThoduApiClient.shared.fetchBeneficiaries(email: currentUser.email, phone: currentUser.phone)
            } catch {
                print("Failed to fetch beneficiaries for \(currentUser.email): \(error)")
            }

            // If empty, fetch all to allow family switching or check case-insensitive match
            if fetchedBens.isEmpty {
                if let allBens = try? await ThoduApiClient.shared.fetchBeneficiaries(), !allBens.isEmpty {
                    let matching = allBens.filter {
                        ($0.guardianEmail?.lowercased() == currentUser.email.lowercased()) ||
                        ($0.primaryContact == currentUser.phone && !(currentUser.phone ?? "").isEmpty)
                    }
                    fetchedBens = matching.isEmpty ? allBens : matching
                }
            }

            // If still empty, use personalized user fallback
            if fetchedBens.isEmpty {
                fetchedBens = [userFallbackBen]
            }

            // 2. Fetch Bookings independently
            let fetchedBks = (try? await ThoduApiClient.shared.fetchBookings()) ?? []

            // 3. Fetch Services independently
            let fetchedSrvs = (try? await ThoduApiClient.shared.fetchServices()) ?? []

            await MainActor.run {
                self.beneficiaries = fetchedBens
                self.selectedBeneficiary = fetchedBens.first
                self.bookings = fetchedBks.isEmpty ? [sampleBooking] : fetchedBks
                self.services = fetchedSrvs
                self.isLoading = false
            }
        }
    }
}
