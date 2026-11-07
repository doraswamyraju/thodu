import SwiftUI

public struct CaregiverDashboardView: View {
    public let currentUser: AppUser
    public var onSwitchRole: () -> Void
    public var onLogout: () -> Void
    
    @State private var caregiver: Caregiver = Caregiver(
        id: "cg-1",
        refNumber: "TH-CAR-1001",
        fullName: "Anitha",
        phone: "+91 98480 22334",
        skills: ["Elder Companionship", "Cooking", "Mobility Support", "Vitals Monitoring"],
        zone: "Tirupati Urban",
        availability: "Available"
    )
    
    @State private var bookings: [Booking] = []
    @State private var activeTab: CaregiverNavTab = .today
    @State private var availability: String = "Available"
    @State private var isDrawerOpen: Bool = false
    @State private var isLoading: Bool = false
    @State private var alertMessage: String? = nil
    @State private var showAlert: Bool = false
    
    @ObservedObject private var locationManager = CaregiverLocationManager.shared
    
    public init(currentUser: AppUser, onSwitchRole: @escaping () -> Void, onLogout: @escaping () -> Void) {
        self.currentUser = currentUser
        self.onSwitchRole = onSwitchRole
        self.onLogout = onLogout
    }
    
    private var activeVisit: Booking? {
        bookings.first { b in
            (b.caregiverName.localizedCaseInsensitiveContains(caregiver.fullName) ||
             caregiver.fullName.localizedCaseInsensitiveContains(b.caregiverName) ||
             b.caregiverId == caregiver.id) &&
            b.status == "In Progress"
        }
    }
    
    private var myBookings: [Booking] {
        bookings.filter { b in
            b.caregiverName.localizedCaseInsensitiveContains(caregiver.fullName) ||
            caregiver.fullName.localizedCaseInsensitiveContains(b.caregiverName) ||
            b.caregiverId == caregiver.id
        }
    }
    
    private var completedVisitsCount: Int {
        myBookings.filter { $0.status == "Completed" }.count
    }
    
    public var body: some View {
        ZStack {
            // Main App Scaffold
            VStack(spacing: 0) {
                // Top App Bar with Menu Button (NO "STAFF" text)
                CaregiverTopBar(
                    caregiver: caregiver,
                    availability: availability,
                    onMenuTap: {
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                            isDrawerOpen.toggle()
                        }
                    },
                    onAvailabilityChanged: { newStatus in
                        updateAvailability(newStatus)
                    },
                    onNotificationTap: {
                        alertMessage = "No new operational dispatch alerts. You are assigned to Tirupati Urban zone."
                        showAlert = true
                    }
                )
                
                // Tab Content Body
                ZStack {
                    switch activeTab {
                    case .today:
                        CaregiverTodayTabContent(
                            caregiver: caregiver,
                            bookings: bookings,
                            onStartShift: { booking in
                                startShift(booking)
                            },
                            onOpenActiveDuty: {
                                activeTab = .duty
                            },
                            onRefresh: {
                                Task { await loadData() }
                            }
                        )
                    case .duty:
                        CaregiverActiveDutyView(
                            caregiver: caregiver,
                            activeVisit: activeVisit,
                            onUpdateVisit: { visitId, req in
                                await updateVisitProgress(id: visitId, request: req)
                            },
                            onTriggerSos: { notes in
                                await triggerCaregiverSos(notes: notes)
                            },
                            onCompleteVisit: { visit, vitals, tasks, notes in
                                await completeShift(visit: visit, vitals: vitals, tasks: tasks, notes: notes)
                            }
                        )
                    case .schedule:
                        CaregiverScheduleView(
                            visits: myBookings.isEmpty ? sampleBaselineShifts : myBookings,
                            onSelectVisit: { visit in
                                if visit.status == "In Progress" {
                                    activeTab = .duty
                                } else {
                                    startShift(visit)
                                }
                            }
                        )
                    case .earnings:
                        CaregiverEarningsView(
                            caregiver: caregiver,
                            completedVisitsCount: max(completedVisitsCount, 1)
                        )
                    case .profile:
                        CaregiverProfileView(
                            caregiver: caregiver,
                            onSwitchRole: onSwitchRole,
                            onLogout: onLogout
                        )
                    }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
                
                // Bottom Bar
                CaregiverBottomNavBar(
                    activeTab: $activeTab,
                    hasActiveShift: activeVisit != nil
                )
            }
            
            // Slide-out Navigation Drawer Overlay (Sidebar)
            if isDrawerOpen {
                Color.black.opacity(0.4)
                    .ignoresSafeArea()
                    .onTapGesture {
                        withAnimation(.spring(response: 0.35, dampingFraction: 0.8)) {
                            isDrawerOpen = false
                        }
                    }
                
                HStack {
                    CaregiverNavigationDrawer(
                        caregiver: caregiver,
                        activeTab: activeTab,
                        hasActiveShift: activeVisit != nil,
                        todaysCount: max(myBookings.count, 3),
                        completedCount: completedVisitsCount,
                        onSelectTab: { tab in
                            activeTab = tab
                        },
                        onSwitchRole: onSwitchRole,
                        onLogout: onLogout,
                        onClose: {
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
        .task {
            locationManager.requestPermission()
            await loadData()
        }
        .alert("Caregiver Notice", isPresented: $showAlert) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(alertMessage ?? "")
        }
    }
    
    private var sampleBaselineShifts: [Booking] {
        [
            Booking(
                id: "bk-default-1",
                bookingNumber: "TH-8901",
                beneficiaryId: "ben-1",
                beneficiaryName: "Saraswathi Garu",
                beneficiaryAge: 68,
                guardianPhone: "+91 98765 43210",
                serviceName: "Household Support & Clinical Vitals",
                scheduledDate: "Today",
                scheduledTimeSlot: "10:00 AM - 01:00 PM",
                serviceAddress: "#14-2, T.T.D. Colony, Tirupati - 517501",
                beneficiaryLat: 13.6288,
                beneficiaryLng: 79.4192,
                caregiverId: caregiver.id,
                caregiverName: caregiver.fullName,
                caregiverEtaMinutes: 8,
                status: "In Progress",
                fundingTier: "Family Direct",
                specialInstructions: "BP and blood sugar check before lunch, assist with mobility walking",
                caregiverNotes: "Arrived on time. Vitals recorded at 10:15 AM."
            ),
            Booking(
                id: "bk-default-2",
                bookingNumber: "TH-8902",
                beneficiaryId: "ben-2",
                beneficiaryName: "Lakshmi Narasimha Rao",
                beneficiaryAge: 72,
                guardianPhone: "+91 94444 12345",
                serviceName: "Physiotherapy & Mobility Assistance",
                scheduledDate: "Today",
                scheduledTimeSlot: "02:00 PM - 04:00 PM",
                serviceAddress: "Door 45, Near ISKCON Temple, Tirupati - 517507",
                beneficiaryLat: 13.6402,
                beneficiaryLng: 79.4255,
                caregiverId: caregiver.id,
                caregiverName: caregiver.fullName,
                caregiverEtaMinutes: 24,
                status: "Scheduled",
                fundingTier: "Family Direct",
                specialInstructions: "Post-stroke knee exercises and gentle walking supervision"
            ),
            Booking(
                id: "bk-default-3",
                bookingNumber: "TH-8905",
                beneficiaryId: "ben-5",
                beneficiaryName: "Kamala Devi",
                beneficiaryAge: 76,
                guardianPhone: "+91 98490 66778",
                serviceName: "Evening Companionship & Meal Prep",
                scheduledDate: "Today",
                scheduledTimeSlot: "05:00 PM - 07:00 PM",
                serviceAddress: "Lakshmi Nagar, Near Railway Station, Tirupati - 517501",
                beneficiaryLat: 13.6240,
                beneficiaryLng: 79.4120,
                caregiverId: caregiver.id,
                caregiverName: caregiver.fullName,
                caregiverEtaMinutes: 45,
                status: "Scheduled",
                fundingTier: "Family Direct",
                specialInstructions: "Doctor-prescribed diabetic dinner and evening walking accompaniment"
            )
        ]
    }
    
    private func loadData() async {
        isLoading = true
        do {
            async let fetchedCaregivers = ThoduApiClient.shared.fetchCaregivers()
            async let fetchedBookings = ThoduApiClient.shared.fetchBookings()
            
            let (cgList, bList) = try await (fetchedCaregivers, fetchedBookings)
            
            if let matched = cgList.first(where: {
                $0.fullName.localizedCaseInsensitiveContains(currentUser.name) ||
                currentUser.name.localizedCaseInsensitiveContains($0.fullName) ||
                $0.email?.lowercased() == currentUser.email.lowercased()
            }) {
                self.caregiver = matched
                self.availability = matched.availability
            } else if let first = cgList.first {
                self.caregiver = first
                self.availability = first.availability
            }
            
            self.bookings = bList.isEmpty ? sampleBaselineShifts : bList
            if activeVisit != nil {
                self.availability = "On Duty"
            }
        } catch {
            print("Caregiver fetch error: \(error)")
            self.bookings = sampleBaselineShifts
        }
        isLoading = false
    }
    
    private func startShift(_ booking: Booking) {
        Task {
            let req = UpdateBookingRequest(status: "In Progress")
            do {
                _ = try await ThoduApiClient.shared.updateBooking(id: booking.id, request: req)
                await loadData()
                updateAvailability("On Duty")
                activeTab = .duty
            } catch {
                alertMessage = "Unable to clock in: \(error.localizedDescription)"
                showAlert = true
            }
        }
    }
    
    private func updateVisitProgress(id: String, request: UpdateBookingRequest) async {
        do {
            _ = try await ThoduApiClient.shared.updateBooking(id: id, request: request)
            await loadData()
        } catch {
            print("Failed to update shift: \(error)")
        }
    }
    
    private func completeShift(visit: Booking, vitals: [String: String], tasks: [CaregiverChecklistItem], notes: String) async {
        let req = UpdateBookingRequest(
            status: "Completed",
            caregiverNotes: notes.isEmpty ? "Shift completed per care plan protocol." : notes,
            vitals: vitals,
            checklistCompleted: tasks
        )
        do {
            _ = try await ThoduApiClient.shared.updateBooking(id: visit.id, request: req)
            await loadData()
            updateAvailability("Available")
            alertMessage = "Care visit for \(visit.beneficiaryName) completed successfully! Duty records and vitals have been archived."
            showAlert = true
            activeTab = .today
        } catch {
            alertMessage = "Error completing visit: \(error.localizedDescription)"
            showAlert = true
        }
    }
    
    private func triggerCaregiverSos(notes: String) async {
        let sosReq = SosRequest(
            beneficiaryId: activeVisit?.beneficiaryId ?? caregiver.id,
            beneficiaryName: "\(caregiver.fullName) (Caregiver On-Duty)",
            beneficiaryAddress: activeVisit?.serviceAddress ?? caregiver.address ?? "Tirupati",
            latitude: caregiver.latitude,
            longitude: caregiver.longitude,
            guardianContact: activeVisit?.guardianPhone ?? caregiver.phone,
            notes: notes
        )
        do {
            _ = try await ThoduApiClient.shared.triggerSos(request: sosReq)
            alertMessage = "EMERGENCY SOS BROADCASTED! Operations coordinator and rapid response team have been dispatched."
            showAlert = true
        } catch {
            alertMessage = "Failed to dispatch SOS beacon: \(error.localizedDescription)"
            showAlert = true
        }
    }
    
    private func updateAvailability(_ newStatus: String) {
        self.availability = newStatus
        Task {
            _ = try? await ThoduApiClient.shared.updateCaregiverAvailability(id: caregiver.id, availability: newStatus)
        }
    }
}
