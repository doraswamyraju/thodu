import SwiftUI

public struct BeneficiaryTodayTabContent: View {
    public let selectedBeneficiary: Beneficiary
    public let activeBooking: Booking?
    public let services: [CareService]
    public let onBookCareClick: () -> Void
    public let onSelectServiceToBook: (CareService?) -> Void
    public let onLiveTrackingClick: () -> Void
    public let onNotificationCenterClick: () -> Void
    public let onProfileClick: () -> Void

    public init(
        selectedBeneficiary: Beneficiary,
        activeBooking: Booking?,
        services: [CareService],
        onBookCareClick: @escaping () -> Void,
        onSelectServiceToBook: @escaping (CareService?) -> Void,
        onLiveTrackingClick: @escaping () -> Void = {},
        onNotificationCenterClick: @escaping () -> Void = {},
        onProfileClick: @escaping () -> Void = {}
    ) {
        self.selectedBeneficiary = selectedBeneficiary
        self.activeBooking = activeBooking
        self.services = services
        self.onBookCareClick = onBookCareClick
        self.onSelectServiceToBook = onSelectServiceToBook
        self.onLiveTrackingClick = onLiveTrackingClick
        self.onNotificationCenterClick = onNotificationCenterClick
        self.onProfileClick = onProfileClick
    }

    public var body: some View {
        VStack(spacing: 16) {
            // 1. Beneficiary Profile Header Card (Saraswathi Amma)
            BeneficiaryProfileHeaderCard(
                beneficiary: selectedBeneficiary,
                onViewProfileClick: onProfileClick
            )

            // 2. Promotional Banners Carousel (Trust Subsidy, Vitals Package, Festive Physio)
            BeneficiaryBannersCarousel(
                onBannerClick: { _ in onBookCareClick() }
            )

            // 3. Today's Caregiver Dispatch & Live Status Card
            TodayCaregiverDispatchCard(
                activeBooking: activeBooking,
                onLiveTrackingClick: onLiveTrackingClick,
                onBookCareClick: onBookCareClick
            )

            // 4. Our Services 8-Grid Catalog
            CareServicesCatalogCard(
                services: services,
                onSelectServiceToBook: onSelectServiceToBook
            )

            // 5. Daily Tasks & Medication Notification Dual Cards Row
            TasksAndMedicationCardsRow(
                completedTasksCount: 3,
                totalTasksCount: 5,
                dueMedicationsCount: 2,
                onDailyTasksClick: {},
                onMedicationClick: onNotificationCenterClick
            )

            // 6. Today's Tasks Detailed Checklist Card
            TodayTasksListCard(
                onViewAllClick: {}
            )
        }
    }
}
