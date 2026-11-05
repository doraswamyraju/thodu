package com.thodu.app.ui.beneficiary.today

import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.thodu.app.data.model.Beneficiary
import com.thodu.app.data.model.Booking
import com.thodu.app.data.model.CareService

@Composable
fun BeneficiaryTodayTabContent(
    selectedBeneficiary: Beneficiary,
    activeBooking: Booking?,
    services: List<CareService>,
    onBookCareClick: () -> Unit,
    onSelectServiceToBook: (CareService?) -> Unit,
    onNotificationCenterClick: () -> Unit = {},
    onProfileClick: () -> Unit = {}
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // 1. Beneficiary Profile Header Card
        BeneficiaryProfileHeaderCard(
            beneficiary = selectedBeneficiary,
            onViewProfileClick = onProfileClick
        )

        // 2. Promotional & Trust Subsidy Image / Banner Slider (New Offers, Trust Grants, Health Camps)
        BeneficiaryBannersCarousel(
            onBannerClick = { onBookCareClick() }
        )

        // 3. Today's Caregiver Dispatch & Live Status Card (Redesigned)
        TodayCaregiverDispatchCard(
            activeBooking = activeBooking,
            onLiveTrackingClick = onBookCareClick,
            onBookCareClick = onBookCareClick
        )

        // 4. Our Services 8-Icon Grid with "Book a Service ->"
        CareServicesCatalogCard(
            services = services,
            onSelectServiceToBook = onSelectServiceToBook
        )

        // 5. Daily Tasks & Medication Notification Dual Cards Row
        TasksAndMedicationCardsRow(
            completedTasksCount = 3,
            totalTasksCount = 5,
            dueMedicationsCount = 2,
            onDailyTasksClick = {},
            onMedicationClick = onNotificationCenterClick
        )

        // 6. Today's Tasks Detailed Checklist Card
        TodayTasksListCard(
            onViewAllClick = {}
        )
    }
}
