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
    onNotificationCenterClick: () -> Unit = {}
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // 1. Beneficiary Profile Header Card (Deep Green gradient with portrait photo, badge, age, Tirupati location & View Profile action)
        BeneficiaryProfileHeaderCard(
            beneficiary = selectedBeneficiary,
            onViewProfileClick = onBookCareClick
        )

        // 2. Today's Caregiver Dispatch Card (Shown only when there is an active booking)
        TodayCaregiverDispatchCard(
            activeBooking = activeBooking,
            onLiveTrackingClick = onBookCareClick
        )

        // 3. Our Services 8-Icon Grid with Book a Service
        CareServicesCatalogCard(
            services = services,
            onSelectServiceToBook = onSelectServiceToBook
        )

        // 4. Daily Tasks & Medication Notification Dual Cards Row
        TasksAndMedicationCardsRow(
            completedTasksCount = 3,
            totalTasksCount = 5,
            dueMedicationsCount = 2,
            onDailyTasksClick = {},
            onMedicationClick = onNotificationCenterClick
        )

        // 5. Today's Tasks Detailed Checklist Card with Completed & Pending Pills
        TodayTasksListCard(
            onViewAllClick = {}
        )
    }
}
