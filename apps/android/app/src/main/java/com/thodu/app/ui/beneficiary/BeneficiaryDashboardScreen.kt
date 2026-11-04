package com.thodu.app.ui.beneficiary

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.thodu.app.data.model.*
import com.thodu.app.ui.beneficiary.notifications.NotificationsBottomSheet
import com.thodu.app.ui.beneficiary.today.BeneficiaryTodayTabContent
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BeneficiaryDashboardScreen(
    currentUser: AppUser,
    onLogout: () -> Unit
) {
    val coroutineScope = rememberCoroutineScope()
    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)

    var currentTab by remember { mutableStateOf(BeneficiaryNavTab.TODAY) }
    var beneficiaries by remember { mutableStateOf<List<Beneficiary>>(emptyList()) }
    var selectedBeneficiary by remember { mutableStateOf<Beneficiary?>(null) }
    var bookings by remember { mutableStateOf<List<Booking>>(emptyList()) }
    var services by remember { mutableStateOf<List<CareService>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var showBookCareSheet by remember { mutableStateOf(false) }
    var showNotificationsSheet by remember { mutableStateOf(false) }

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

    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            BeneficiaryNavigationDrawer(
                currentUser = currentUser,
                beneficiaries = beneficiaries,
                selectedBeneficiary = selectedBeneficiary,
                currentTab = currentTab,
                onTabSelected = { tab ->
                    currentTab = tab
                },
                onSelectBeneficiary = { ben ->
                    selectedBeneficiary = ben
                },
                onLogoutClick = onLogout,
                onCloseDrawer = {
                    coroutineScope.launch { drawerState.close() }
                }
            )
        }
    ) {
        Scaffold(
            topBar = {
                BeneficiaryTopBar(
                    beneficiaries = beneficiaries,
                    selectedBeneficiary = selectedBeneficiary,
                    onSelectBeneficiary = { selectedBeneficiary = it },
                    onMenuClick = {
                        coroutineScope.launch { drawerState.open() }
                    },
                    onLogoClick = {
                        currentTab = BeneficiaryNavTab.TODAY
                    },
                    onLogoutClick = onLogout,
                    onNotificationClick = {
                        showNotificationsSheet = true
                    }
                )
            },
            bottomBar = {
                BeneficiaryBottomNavBar(
                    currentTab = currentTab,
                    onTabSelected = { tab -> currentTab = tab }
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
                                        SosRequest(
                                            beneficiaryId = ben.id,
                                            beneficiaryName = ben.fullName,
                                            beneficiaryAddress = ben.address,
                                            latitude = ben.latitude,
                                            longitude = ben.longitude,
                                            guardianContact = ben.primaryContact,
                                            emergencyDoctorPhone = ben.emergencyDoctorPhone,
                                            notes = "1-Tap SOS Distress Triggered for ${ben.fullName}"
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
                        when (currentTab) {
                            BeneficiaryNavTab.TODAY -> {
                                selectedBeneficiary?.let { ben ->
                                    BeneficiaryTodayTabContent(
                                        selectedBeneficiary = ben,
                                        activeBooking = activeBooking,
                                        services = services,
                                        onBookCareClick = { showBookCareSheet = true },
                                        onSelectServiceToBook = { _ -> showBookCareSheet = true },
                                        onNotificationCenterClick = { showNotificationsSheet = true }
                                    )
                                }
                            }

                            BeneficiaryNavTab.BOOKINGS -> {
                                // Dedicated Bookings Tab
                                selectedBeneficiary?.let { ben ->
                                    BeneficiaryProfileCard(
                                        beneficiary = ben,
                                        onBookCareClick = { showBookCareSheet = true }
                                    )
                                }
                                BeneficiaryBookingsListCard(
                                    bookings = bookings,
                                    onBookCareClick = { showBookCareSheet = true }
                                )
                            }

                            BeneficiaryNavTab.HEALTH -> {
                                // Dedicated Health Dossier Tab
                                selectedBeneficiary?.let { ben ->
                                    BeneficiaryProfileCard(
                                        beneficiary = ben,
                                        onBookCareClick = { showBookCareSheet = true }
                                    )
                                    BeneficiaryHealthDossierCard(
                                        beneficiary = ben
                                    )
                                }
                                BeneficiaryDispatchVitalsCard(
                                    activeBooking = activeBooking
                                )
                            }

                            BeneficiaryNavTab.SUBSIDIES -> {
                                // Dedicated Grants & Subsidies Tab
                                selectedBeneficiary?.let { ben ->
                                    BeneficiarySubsidyTierCard(
                                        beneficiary = ben
                                    )
                                    BeneficiaryProfileCard(
                                        beneficiary = ben,
                                        onBookCareClick = { showBookCareSheet = true }
                                    )
                                }
                            }

                            BeneficiaryNavTab.PROFILE -> {
                                // Family Guardian Profile Tab
                                selectedBeneficiary?.let { ben ->
                                    BeneficiaryProfileCard(
                                        beneficiary = ben,
                                        onBookCareClick = { showBookCareSheet = true }
                                    )
                                    BeneficiaryHealthDossierCard(
                                        beneficiary = ben
                                    )
                                }
                            }
                        }

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

            // Modal Bottom Sheet: Notification Center
            if (showNotificationsSheet) {
                NotificationsBottomSheet(
                    onDismiss = { showNotificationsSheet = false }
                )
            }
        }
    }
}
