package com.thodu.app.ui.beneficiary

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.data.api.ApiClient
import com.thodu.app.data.model.AppUser
import com.thodu.app.data.model.Beneficiary
import com.thodu.app.data.model.Booking
import com.thodu.app.data.model.CareService
import kotlinx.coroutines.launch

@Composable
fun BeneficiaryDashboardScreen(
    currentUser: AppUser,
    onLogout: () -> Unit
) {
    val coroutineScope = rememberCoroutineScope()

    var beneficiaries by remember { mutableStateOf<List<Beneficiary>>(emptyList()) }
    var selectedBeneficiary by remember { mutableStateOf<Beneficiary?>(null) }
    var bookings by remember { mutableStateOf<List<Booking>>(emptyList()) }
    var services by remember { mutableStateOf<List<CareService>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var showBookCareSheet by remember { mutableStateOf(false) }

    fun refreshData() {
        isLoading = true
        coroutineScope.launch {
            try {
                val benRes = ApiClient.apiService.getBeneficiaries()
                if (benRes.success && benRes.beneficiaries.isNotEmpty()) {
                    beneficiaries = benRes.beneficiaries
                    if (selectedBeneficiary == null) {
                        selectedBeneficiary = benRes.beneficiaries.first()
                    }
                }

                val bkRes = ApiClient.apiService.getBookings()
                if (bkRes.success) {
                    bookings = bkRes.bookings
                }

                val srvRes = ApiClient.apiService.getServices()
                if (srvRes.success) {
                    services = srvRes.services
                }
            } catch (_: Exception) {
            } finally {
                isLoading = false
            }
        }
    }

    LaunchedEffect(Unit) {
        refreshData()
    }

    val activeBooking = remember(bookings, selectedBeneficiary) {
        bookings.firstOrNull { it.beneficiaryId == selectedBeneficiary?.id || it.beneficiaryName == selectedBeneficiary?.fullName }
            ?: bookings.firstOrNull()
    }

    Scaffold(
        topBar = {
            BeneficiaryTopBar(
                beneficiaries = beneficiaries,
                selectedBeneficiary = selectedBeneficiary,
                onSelectBeneficiary = { selectedBeneficiary = it },
                onLogoutClick = onLogout
            )
        },
        floatingActionButton = {
            Column(
                horizontalAlignment = Alignment.End,
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Floating SOS Panic Button
                FloatingActionButton(
                    onClick = {
                        selectedBeneficiary?.let { ben ->
                            coroutineScope.launch {
                                ApiClient.apiService.triggerSos(
                                    com.thodu.app.data.model.SosRequest(
                                        beneficiaryId = ben.id,
                                        beneficiaryName = ben.fullName,
                                        beneficiaryAddress = ben.address,
                                        latitude = ben.latitude,
                                        longitude = ben.longitude,
                                        guardianContact = ben.primaryContact,
                                        emergencyDoctorPhone = ben.emergencyDoctorPhone,
                                        notes = "Floating FAB SOS Panic triggered for ${ben.fullName}"
                                    )
                                )
                                refreshData()
                            }
                        }
                    },
                    containerColor = Color(0xFFDC2626),
                    contentColor = Color.White,
                    shape = CircleShape,
                    modifier = Modifier.size(52.dp)
                ) {
                    Icon(imageVector = Icons.Default.Warning, contentDescription = "Emergency SOS")
                }

                // Floating Book Visit Action
                FloatingActionButton(
                    onClick = { showBookCareSheet = true },
                    containerColor = Color(0xFF0D5C3A),
                    contentColor = Color.White,
                    shape = CircleShape,
                    modifier = Modifier.size(52.dp)
                ) {
                    Icon(imageVector = Icons.Default.Add, contentDescription = "Book Visit")
                }
            }
        },
        containerColor = Color(0xFFF8FAF9)
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            if (isLoading && beneficiaries.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = Color(0xFF0D5C3A))
                }
            } else {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .verticalScroll(rememberScrollState())
                        .padding(horizontal = 16.dp, vertical = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    // 1. Beneficiary Profile Card with Book Care Button
                    selectedBeneficiary?.let { ben ->
                        BeneficiaryProfileCard(
                            beneficiary = ben,
                            onBookCareClick = { showBookCareSheet = true }
                        )
                    }

                    // 2. Today's Caregiver Dispatch & Live Clinical Vitals Card
                    BeneficiaryDispatchVitalsCard(
                        activeBooking = activeBooking
                    )

                    // 3. Emergency Rapid Response SOS Card
                    selectedBeneficiary?.let { ben ->
                        BeneficiarySosCard(
                            beneficiary = ben,
                            onSosTriggered = { refreshData() }
                        )
                    }

                    // 4. Partner Grant & Subsidy Tier (Sri Divyang Seva Kendram Trust)
                    selectedBeneficiary?.let { ben ->
                        BeneficiarySubsidyTierCard(
                            beneficiary = ben
                        )
                    }

                    // 5. Care Bookings & History Filterable List Card
                    BeneficiaryBookingsListCard(
                        bookings = bookings,
                        onBookCareClick = { showBookCareSheet = true }
                    )

                    Spacer(modifier = Modifier.height(70.dp))
                }
            }
        }

        // Modal Bottom Sheet: Schedule Caregiver Visit
        if (showBookCareSheet && selectedBeneficiary != null) {
            BeneficiaryBookCareSheet(
                beneficiary = selectedBeneficiary!!,
                services = services,
                onDismiss = { showBookCareSheet = false },
                onBookingCreated = { refreshData() }
            )
        }
    }
}

