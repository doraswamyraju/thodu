package com.thodu.app.ui.beneficiary.bookings

import android.app.DatePickerDialog
import android.widget.DatePicker
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.data.api.ApiClient
import com.thodu.app.data.model.AppUser
import com.thodu.app.data.model.Beneficiary
import com.thodu.app.data.model.CareService
import com.thodu.app.data.model.CreateBookingRequest
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

data class ServiceOption(
    val id: String,
    val name: String,
    val icon: ImageVector,
    val bgColor: Color,
    val iconColor: Color
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BookServiceScreen(
    currentUser: AppUser,
    beneficiaries: List<Beneficiary>,
    selectedBeneficiary: Beneficiary?,
    initialService: CareService? = null,
    onBackClick: () -> Unit,
    onBookingSuccess: () -> Unit
) {
    val coroutineScope = rememberCoroutineScope()
    val context = LocalContext.current

    // Services Catalog (8 distinct items matching reference media_1793882235492_ef629117.jpg)
    val serviceOptions = remember {
        listOf(
            ServiceOption("srv-personal", "Personal Care", Icons.Default.AccessibilityNew, Color(0xFFE8F5E9), Color(0xFF1B5E20)),
            ServiceOption("srv-health", "Health Monitoring", Icons.Default.Favorite, Color(0xFFFFEBEE), Color(0xFFC2185B)),
            ServiceOption("srv-medication", "Medication Assistance", Icons.Default.Medication, Color(0xFFEDE7F6), Color(0xFF7B1FA2)),
            ServiceOption("srv-meals", "Meals & Nutrition", Icons.Default.Restaurant, Color(0xFFFFF8E1), Color(0xFFF57F17)),
            ServiceOption("srv-physio", "Physio Support", Icons.Default.FitnessCenter, Color(0xFFE0F7FA), Color(0xFF00838F)),
            ServiceOption("srv-doctor", "Doctor Consultation", Icons.Default.LocalHospital, Color(0xFFFFF3E0), Color(0xFFE65100)),
            ServiceOption("srv-lab", "Lab Sample Collection", Icons.Default.Science, Color(0xFFE8EAF6), Color(0xFF283593)),
            ServiceOption("srv-other", "Other Services", Icons.Default.MoreHoriz, Color(0xFFECEFF1), Color(0xFF37474F))
        )
    }

    var selectedService by remember {
        mutableStateOf(
            if (initialService != null) {
                serviceOptions.firstOrNull { it.name.contains(initialService.name, ignoreCase = true) }
                    ?: serviceOptions[0]
            } else {
                serviceOptions[0]
            }
        )
    }

    // "For Whom?" toggle: "Myself" vs "My Family Member"
    var isBookingForMyself by remember { mutableStateOf(true) }
    var chosenBeneficiary by remember {
        mutableStateOf(selectedBeneficiary ?: beneficiaries.firstOrNull())
    }
    var showMemberDropdown by remember { mutableStateOf(false) }

    // Service Date state
    val calendar = remember { Calendar.getInstance() }
    val dateFormatter = remember { SimpleDateFormat("EEE, dd MMM yyyy", Locale.getDefault()) }
    var selectedDateText by remember { mutableStateOf(dateFormatter.format(calendar.time)) }

    val datePickerDialog = remember {
        DatePickerDialog(
            context,
            { _: DatePicker, year: Int, month: Int, dayOfMonth: Int ->
                calendar.set(year, month, dayOfMonth)
                selectedDateText = dateFormatter.format(calendar.time)
            },
            calendar.get(Calendar.YEAR),
            calendar.get(Calendar.MONTH),
            calendar.get(Calendar.DAY_OF_MONTH)
        ).apply {
            datePicker.minDate = System.currentTimeMillis() - 1000
        }
    }

    // Preferred Time Slot state
    val timeSlots = listOf(
        "8:00 AM – 10:00 AM",
        "10:00 AM – 12:00 PM",
        "12:00 PM – 2:00 PM",
        "2:00 PM – 4:00 PM",
        "4:00 PM – 6:00 PM"
    )
    var selectedTimeSlot by remember { mutableStateOf("10:00 AM – 12:00 PM") }
    var showTimeSlotDropdown by remember { mutableStateOf(false) }

    // Section D Care Address Integration
    // Pick from Beneficiary saved addresses or enter customized address
    var careAddress by remember(chosenBeneficiary) {
        mutableStateOf(chosenBeneficiary?.address?.ifEmpty { "Tirupati, Andhra Pradesh" } ?: "Tirupati, Andhra Pradesh")
    }

    // Additional notes
    var notes by remember { mutableStateOf("") }
    var isSubmitting by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var showSuccessDialog by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Text(
                        text = "Book a Service",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = Color(0xFF0F172A)
                    )
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                            contentDescription = "Back",
                            tint = Color(0xFF0F172A)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color.White)
            )
        },
        bottomBar = {
            // Sticky Bottom CTA Button matching reference image
            Surface(
                color = Color.White,
                shadowElevation = 8.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 14.dp)
                ) {
                    Button(
                        onClick = {
                            errorMessage = null
                            isSubmitting = true
                            coroutineScope.launch {
                                try {
                                    val targetBenName = if (isBookingForMyself) {
                                        currentUser.name.ifEmpty { "Self" }
                                    } else {
                                        chosenBeneficiary?.fullName ?: "Family Member"
                                    }
                                    val targetBenId = chosenBeneficiary?.id ?: "ben-${currentUser.id}"
                                    val guardianPhone = currentUser.phone ?: chosenBeneficiary?.primaryContact ?: "+91 98765 43210"

                                    val request = CreateBookingRequest(
                                        beneficiaryId = targetBenId,
                                        beneficiaryName = targetBenName,
                                        serviceName = selectedService.name,
                                        scheduledDate = selectedDateText,
                                        scheduledTimeSlot = selectedTimeSlot,
                                        serviceAddress = careAddress,
                                        guardianPhone = guardianPhone,
                                        specialInstructions = notes.ifEmpty { null },
                                        fundingTier = chosenBeneficiary?.subsidyTier ?: "Trust Sponsored"
                                    )

                                    val res = ApiClient.apiService.createBooking(request)
                                    if (res.success) {
                                        showSuccessDialog = true
                                    } else {
                                        errorMessage = res.message ?: "Failed to schedule booking. Please retry."
                                    }
                                } catch (e: Exception) {
                                    errorMessage = "Network error: ${e.localizedMessage ?: "Unable to connect"}"
                                } finally {
                                    isSubmitting = false
                                }
                            }
                        },
                        enabled = !isSubmitting,
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF0D5C3A),
                            disabledContainerColor = Color(0xFF94A3B8)
                        ),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp)
                    ) {
                        if (isSubmitting) {
                            CircularProgressIndicator(
                                color = Color.White,
                                modifier = Modifier.size(22.dp),
                                strokeWidth = 2.dp
                            )
                        } else {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.Center
                            ) {
                                Text(
                                    text = "Book Service",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.White
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Icon(
                                    imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }
                    }
                }
            }
        },
        containerColor = Color(0xFFF8FAF9)
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(18.dp)
        ) {
            // Header: Title & Calendar Success Graphic (Matching Reference Image)
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Book a Service",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color(0xFF0D5C3A)
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "Choose a service for yourself or your loved one",
                        fontSize = 13.sp,
                        color = Color(0xFF475569)
                    )
                }

                // Green Calendar with Checkmark Badge
                Box(
                    modifier = Modifier.size(54.dp),
                    contentAlignment = Alignment.BottomEnd
                ) {
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color(0xFFE8F5E9),
                        border = BorderStroke(1.5.dp, Color(0xFF0D5C3A)),
                        modifier = Modifier.size(46.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = Icons.Default.CalendarToday,
                                contentDescription = null,
                                tint = Color(0xFF0D5C3A),
                                modifier = Modifier.size(24.dp)
                            )
                        }
                    }
                    Surface(
                        shape = CircleShape,
                        color = Color(0xFF16A34A),
                        modifier = Modifier.size(20.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = Icons.Default.Check,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }
                }
            }

            // Error Banner if submission failed
            if (errorMessage != null) {
                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = Color(0xFFFEE2E2),
                    border = BorderStroke(1.dp, Color(0xFFEF4444)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.ErrorOutline,
                            contentDescription = null,
                            tint = Color(0xFFDC2626),
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = errorMessage ?: "",
                            fontSize = 13.sp,
                            color = Color(0xFF991B1B)
                        )
                    }
                }
            }

            // SECTION 1: Select Service (4x2 Grid Matching Mockup)
            Column(modifier = Modifier.fillMaxWidth()) {
                Text(
                    text = "Select Service",
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0D5C3A)
                )

                Spacer(modifier = Modifier.height(12.dp))

                val rows = serviceOptions.chunked(4)
                for (row in rows) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        for (opt in row) {
                            val isSelected = selectedService.id == opt.id
                            Surface(
                                shape = RoundedCornerShape(14.dp),
                                color = opt.bgColor,
                                border = if (isSelected) BorderStroke(2.dp, Color(0xFF0D5C3A)) else BorderStroke(1.dp, Color(0xFFE2E8F0)),
                                shadowElevation = if (isSelected) 3.dp else 0.dp,
                                modifier = Modifier
                                    .weight(1f)
                                    .aspectRatio(0.92f)
                                    .clip(RoundedCornerShape(14.dp))
                                    .clickable { selectedService = opt }
                            ) {
                                Column(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .padding(6.dp),
                                    horizontalAlignment = Alignment.CenterHorizontally,
                                    verticalArrangement = Arrangement.Center
                                ) {
                                    Icon(
                                        imageVector = opt.icon,
                                        contentDescription = opt.name,
                                        tint = opt.iconColor,
                                        modifier = Modifier.size(28.dp)
                                    )
                                    Spacer(modifier = Modifier.height(6.dp))
                                    Text(
                                        text = opt.name,
                                        fontSize = 10.5.sp,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                        color = if (isSelected) Color(0xFF0D5C3A) else Color(0xFF1E293B),
                                        textAlign = TextAlign.Center,
                                        lineHeight = 12.sp,
                                        maxLines = 2
                                    )
                                }
                            }
                        }
                    }
                    Spacer(modifier = Modifier.height(10.dp))
                }
            }

            // SECTION 2: Booking Details Card
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier.padding(16.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Text(
                        text = "Booking Details",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF0D5C3A)
                    )

                    // Field 1: "For Whom?" Radio/Pill Toggle
                    Column {
                        Text(
                            text = "For Whom?",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF334155)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            // Myself Pill
                            Surface(
                                shape = RoundedCornerShape(22.dp),
                                color = if (isBookingForMyself) Color(0xFFDCFCE7) else Color(0xFFF1F5F9),
                                border = BorderStroke(1.dp, if (isBookingForMyself) Color(0xFF16A34A) else Color(0xFFCBD5E1)),
                                modifier = Modifier
                                    .weight(1f)
                                    .height(44.dp)
                                    .clip(RoundedCornerShape(22.dp))
                                    .clickable { isBookingForMyself = true }
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 12.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.Center
                                ) {
                                    RadioButton(
                                        selected = isBookingForMyself,
                                        onClick = { isBookingForMyself = true },
                                        colors = RadioButtonDefaults.colors(
                                            selectedColor = Color(0xFF0D5C3A),
                                            unselectedColor = Color(0xFF94A3B8)
                                        ),
                                        modifier = Modifier.size(20.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "Myself",
                                        fontSize = 13.sp,
                                        fontWeight = if (isBookingForMyself) FontWeight.Bold else FontWeight.Medium,
                                        color = if (isBookingForMyself) Color(0xFF0D5C3A) else Color(0xFF475569)
                                    )
                                }
                            }

                            // My Family Member Pill
                            Surface(
                                shape = RoundedCornerShape(22.dp),
                                color = if (!isBookingForMyself) Color(0xFFDCFCE7) else Color(0xFFF1F5F9),
                                border = BorderStroke(1.dp, if (!isBookingForMyself) Color(0xFF16A34A) else Color(0xFFCBD5E1)),
                                modifier = Modifier
                                    .weight(1.3f)
                                    .height(44.dp)
                                    .clip(RoundedCornerShape(22.dp))
                                    .clickable { isBookingForMyself = false }
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 12.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.Center
                                ) {
                                    RadioButton(
                                        selected = !isBookingForMyself,
                                        onClick = { isBookingForMyself = false },
                                        colors = RadioButtonDefaults.colors(
                                            selectedColor = Color(0xFF0D5C3A),
                                            unselectedColor = Color(0xFF94A3B8)
                                        ),
                                        modifier = Modifier.size(20.dp)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = "My Family Member",
                                        fontSize = 13.sp,
                                        fontWeight = if (!isBookingForMyself) FontWeight.Bold else FontWeight.Medium,
                                        color = if (!isBookingForMyself) Color(0xFF0D5C3A) else Color(0xFF475569)
                                    )
                                }
                            }
                        }

                        // If "My Family Member", show selector dropdown of user's registered loved ones
                        if (!isBookingForMyself) {
                            Spacer(modifier = Modifier.height(10.dp))
                            Box(modifier = Modifier.fillMaxWidth()) {
                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    border = BorderStroke(1.dp, Color(0xFFCBD5E1)),
                                    color = Color(0xFFFAFAFA),
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(48.dp)
                                        .clip(RoundedCornerShape(10.dp))
                                        .clickable { showMemberDropdown = true }
                                ) {
                                    Row(
                                        modifier = Modifier.padding(horizontal = 14.dp),
                                        verticalAlignment = Alignment.CenterVertically,
                                        horizontalArrangement = Arrangement.SpaceBetween
                                    ) {
                                        Text(
                                            text = chosenBeneficiary?.let { "${it.fullName} (${it.relationship})" }
                                                ?: "Select Family Member / Elder",
                                            fontSize = 13.sp,
                                            fontWeight = FontWeight.Medium,
                                            color = Color(0xFF0F172A)
                                        )
                                        Icon(
                                            imageVector = Icons.Default.ArrowDropDown,
                                            contentDescription = null,
                                            tint = Color(0xFF64748B)
                                        )
                                    }
                                }

                                DropdownMenu(
                                    expanded = showMemberDropdown,
                                    onDismissRequest = { showMemberDropdown = false }
                                ) {
                                    beneficiaries.forEach { ben ->
                                        DropdownMenuItem(
                                            text = {
                                                Column {
                                                    Text(
                                                        text = ben.fullName,
                                                        fontWeight = FontWeight.SemiBold,
                                                        fontSize = 14.sp
                                                    )
                                                    Text(
                                                        text = "${ben.relationship} • ${ben.age} yrs • Ref: ${ben.refNumber}",
                                                        fontSize = 11.sp,
                                                        color = Color(0xFF64748B)
                                                    )
                                                }
                                            },
                                            onClick = {
                                                chosenBeneficiary = ben
                                                careAddress = ben.address
                                                showMemberDropdown = false
                                            }
                                        )
                                    }
                                }
                            }
                        }
                    }

                    // Field 2: Service Date Picker
                    Column {
                        Text(
                            text = "Service Date",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF334155)
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            border = BorderStroke(1.dp, Color(0xFFCBD5E1)),
                            color = Color.White,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(48.dp)
                                .clip(RoundedCornerShape(10.dp))
                                .clickable { datePickerDialog.show() }
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 14.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.CalendarToday,
                                        contentDescription = null,
                                        tint = Color(0xFF0D5C3A),
                                        modifier = Modifier.size(18.dp)
                                    )
                                    Spacer(modifier = Modifier.width(10.dp))
                                    Text(
                                        text = selectedDateText,
                                        fontSize = 13.5.sp,
                                        fontWeight = FontWeight.Medium,
                                        color = Color(0xFF0F172A)
                                    )
                                }
                                Icon(
                                    imageVector = Icons.Default.KeyboardArrowDown,
                                    contentDescription = null,
                                    tint = Color(0xFF64748B)
                                )
                            }
                        }
                    }

                    // Field 3: Preferred Time Slot
                    Column {
                        Text(
                            text = "Preferred Time",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF334155)
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Box(modifier = Modifier.fillMaxWidth()) {
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                border = BorderStroke(1.dp, Color(0xFFCBD5E1)),
                                color = Color.White,
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(48.dp)
                                    .clip(RoundedCornerShape(10.dp))
                                    .clickable { showTimeSlotDropdown = true }
                            ) {
                                Row(
                                    modifier = Modifier.padding(horizontal = 14.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(
                                            imageVector = Icons.Default.AccessTime,
                                            contentDescription = null,
                                            tint = Color(0xFF0D5C3A),
                                            modifier = Modifier.size(18.dp)
                                        )
                                        Spacer(modifier = Modifier.width(10.dp))
                                        Text(
                                            text = selectedTimeSlot,
                                            fontSize = 13.5.sp,
                                            fontWeight = FontWeight.Medium,
                                            color = Color(0xFF0F172A)
                                        )
                                    }
                                    Icon(
                                        imageVector = Icons.Default.KeyboardArrowDown,
                                        contentDescription = null,
                                        tint = Color(0xFF64748B)
                                    )
                                }
                            }

                            DropdownMenu(
                                expanded = showTimeSlotDropdown,
                                onDismissRequest = { showTimeSlotDropdown = false }
                            ) {
                                timeSlots.forEach { slot ->
                                    DropdownMenuItem(
                                        text = { Text(text = slot, fontSize = 13.5.sp) },
                                        onClick = {
                                            selectedTimeSlot = slot
                                            showTimeSlotDropdown = false
                                        }
                                    )
                                }
                            }
                        }
                    }

                    // Field 4: Section D - Care Address Selector / Input
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "Care Visit Address (Section D)",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Color(0xFF334155)
                            )
                            chosenBeneficiary?.zone?.let { zone ->
                                Text(
                                    text = "Zone: $zone",
                                    fontSize = 11.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF0D5C3A)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        OutlinedTextField(
                            value = careAddress,
                            onValueChange = { careAddress = it },
                            placeholder = { Text("House/Flat No, Street, Landmark, Tirupati, AP", fontSize = 13.sp) },
                            leadingIcon = {
                                Icon(
                                    imageVector = Icons.Default.LocationOn,
                                    contentDescription = null,
                                    tint = Color(0xFF0D5C3A),
                                    modifier = Modifier.size(18.dp)
                                )
                            },
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Color(0xFF0D5C3A),
                                unfocusedBorderColor = Color(0xFFCBD5E1),
                                focusedContainerColor = Color.White,
                                unfocusedContainerColor = Color.White
                            ),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        )
                    }

                    // Field 5: Additional Notes (Optional)
                    Column {
                        Text(
                            text = "Additional Notes (Optional)",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = Color(0xFF334155)
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        OutlinedTextField(
                            value = notes,
                            onValueChange = { notes = it },
                            placeholder = {
                                Text(
                                    "Any specific requirements, instructions or care preferences...",
                                    fontSize = 12.5.sp,
                                    color = Color(0xFF94A3B8)
                                )
                            },
                            minLines = 3,
                            maxLines = 4,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Color(0xFF0D5C3A),
                                unfocusedBorderColor = Color(0xFFCBD5E1),
                                focusedContainerColor = Color.White,
                                unfocusedContainerColor = Color.White
                            ),
                            shape = RoundedCornerShape(10.dp),
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(80.dp))
        }
    }

    // Success Confirmation Dialog
    if (showSuccessDialog) {
        AlertDialog(
            onDismissRequest = {
                showSuccessDialog = false
                onBookingSuccess()
            },
            title = {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.CheckCircle,
                        contentDescription = null,
                        tint = Color(0xFF16A34A),
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Booking Confirmed!",
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        color = Color(0xFF0D5C3A)
                    )
                }
            },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(
                        text = "Your booking for ${selectedService.name} on $selectedDateText ($selectedTimeSlot) has been received.",
                        fontSize = 13.5.sp,
                        color = Color(0xFF334155)
                    )
                    Text(
                        text = "A qualified Thodu care specialist is being dispatched as per schedule.",
                        fontSize = 12.5.sp,
                        color = Color(0xFF64748B)
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        showSuccessDialog = false
                        onBookingSuccess()
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF0D5C3A)),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Text("View My Bookings")
                }
            }
        )
    }
}
