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
    @State private var isLoading: Bool = false
    @State private var alertMessage: String? = nil
    @State private var showAlert: Bool = false
    
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
    
    private var completedVisitsCount: Int {
        bookings.filter { b in
            (b.caregiverName.localizedCaseInsensitiveContains(caregiver.fullName) ||
             caregiver.fullName.localizedCaseInsensitiveContains(b.caregiverName) ||
             b.caregiverId == caregiver.id) &&
            b.status == "Completed"
        }.count
    }
    
    public var body: some View {
        VStack(spacing: 0) {
            // Top App Bar
            CaregiverTopBar(
                caregiver: caregiver,
                availability: availability,
                onAvailabilityChanged: { newStatus in
                    updateAvailability(newStatus)
                },
                onNotificationTap: {
                    alertMessage = "No new operations dispatch alerts right now."
                    showAlert = true
                },
                onLogoutTap: onLogout
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
                        visits: bookings.filter { b in
                            b.caregiverName.localizedCaseInsensitiveContains(caregiver.fullName) ||
                            caregiver.fullName.localizedCaseInsensitiveContains(b.caregiverName) ||
                            b.caregiverId == caregiver.id
                        },
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
                        completedVisitsCount: completedVisitsCount
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
        .task {
            await loadData()
        }
        .alert("Caregiver Notice", isPresented: $showAlert) {
            Button("OK", role: .cancel) {}
        } message: {
            Text(alertMessage ?? "")
        }
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
            
            self.bookings = bList
            if activeVisit != nil {
                self.availability = "On Duty"
            }
        } catch {
            print("Caregiver fetch error: \(error)")
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
