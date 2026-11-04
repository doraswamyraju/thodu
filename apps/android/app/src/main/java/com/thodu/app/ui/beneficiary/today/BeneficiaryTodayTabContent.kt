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
    onSelectServiceToBook: (CareService) -> Unit
) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // 1. Beneficiary Profile Card
        BeneficiaryProfileHeaderCard(
            beneficiary = selectedBeneficiary,
            onBookCareClick = onBookCareClick
        )

        // 2. Today's Caregiver Dispatch & Live Status Card (ONLY IF THERE ARE ACTIVE VISITS)
        TodayCaregiverDispatchCard(
            activeBooking = activeBooking
        )

        // 3. Our Services Icons followed by Book a Service
        CareServicesCatalogCard(
            services = services,
            onSelectServiceToBook = onSelectServiceToBook
        )

        // 4. Daily Tasks Checklist
        DailyTasksChecklistCard(
            activeBooking = activeBooking
        )

        // 5. Medication Notification Card
        MedicationNotificationCard()
    }
}

