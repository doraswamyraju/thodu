package com.thodu.app.ui.beneficiary.bookings

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.data.model.Booking

enum class BookingFilterTab(val label: String) {
    ALL("All"),
    UPCOMING("Upcoming"),
    IN_SERVICE("In Service"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled")
}

@Composable
fun MyBookingsScreen(
    bookings: List<Booking>,
    onBookNewServiceClick: () -> Unit,
    onLiveTrackingClick: (Booking) -> Unit = {},
    onCallSupportClick: () -> Unit = {},
    onRebookClick: (Booking) -> Unit = {}
) {
    var selectedFilter by remember { mutableStateOf(BookingFilterTab.ALL) }

    // Counts for filter pills
    val upcomingCount = remember(bookings) { bookings.count { it.status.equals("Awaiting Assignment", true) || it.status.equals("Caregiver Assigned", true) || it.status.equals("Upcoming", true) } }
    val inServiceCount = remember(bookings) { bookings.count { it.status.equals("In Progress", true) || it.status.equals("In Service", true) } }
    val completedCount = remember(bookings) { bookings.count { it.status.equals("Completed", true) } }
    val cancelledCount = remember(bookings) { bookings.count { it.status.equals("Cancelled", true) } }

    val filteredBookings = remember(selectedFilter, bookings) {
        when (selectedFilter) {
            BookingFilterTab.ALL -> bookings
            BookingFilterTab.UPCOMING -> bookings.filter { it.status.equals("Awaiting Assignment", true) || it.status.equals("Caregiver Assigned", true) || it.status.equals("Upcoming", true) }
            BookingFilterTab.IN_SERVICE -> bookings.filter { it.status.equals("In Progress", true) || it.status.equals("In Service", true) }
            BookingFilterTab.COMPLETED -> bookings.filter { it.status.equals("Completed", true) }
            BookingFilterTab.CANCELLED -> bookings.filter { it.status.equals("Cancelled", true) }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // 1. TOP HEADER: "My Bookings" with Subtitle and Calendar Check Icon
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(
                    text = "My Bookings",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Black,
                    color = Color(0xFF0F3E26)
                )
                Spacer(modifier = Modifier.height(2.dp))
                Text(
                    text = "View, track and manage your service bookings",
                    fontSize = 12.sp,
                    color = Color(0xFF5A6E63)
                )
            }

            // Calendar Checkmark Badge Illustration
            Surface(
                shape = RoundedCornerShape(14.dp),
                color = Color(0xFFF0FDF4),
                border = BorderStroke(1.5.dp, Color(0xFF86EFAC)),
                modifier = Modifier.size(46.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = Icons.Default.EventAvailable,
                        contentDescription = null,
                        tint = Color(0xFF16A34A),
                        modifier = Modifier.size(26.dp)
                    )
                }
            }
        }

        // 2. ACTION BANNER: "Book a New Service"
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = Color(0xFF0D5C3A),
            shadowElevation = 2.dp,
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(16.dp))
                .clickable(onClick = onBookNewServiceClick)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    shape = CircleShape,
                    color = Color.White.copy(alpha = 0.2f),
                    modifier = Modifier.size(38.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.AddBox,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Book a New Service",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "Schedule a service for yourself or your loved one",
                        fontSize = 11.sp,
                        color = Color.White.copy(alpha = 0.85f)
                    )
                }

                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                    contentDescription = null,
                    tint = Color.White,
                    modifier = Modifier.size(18.dp)
                )
            }
        }

        // 3. HORIZONTAL STATUS FILTER CHIPS CAROUSEL
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .horizontalScroll(rememberScrollState()),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            BookingFilterTab.values().forEach { tab ->
                val isSelected = selectedFilter == tab
                val count = when (tab) {
                    BookingFilterTab.ALL -> bookings.size
                    BookingFilterTab.UPCOMING -> upcomingCount
                    BookingFilterTab.IN_SERVICE -> inServiceCount
                    BookingFilterTab.COMPLETED -> completedCount
                    BookingFilterTab.CANCELLED -> cancelledCount
                }

                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = if (isSelected) Color(0xFF0D5C3A) else Color.White,
                    border = BorderStroke(1.dp, if (isSelected) Color(0xFF0D5C3A) else Color(0xFFE2E8F0)),
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .clickable { selectedFilter = tab }
                ) {
                    Text(
                        text = "${tab.label} ($count)",
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.SemiBold,
                        color = if (isSelected) Color.White else Color(0xFF475569),
                        modifier = Modifier.padding(horizontal = 14.dp, vertical = 7.dp)
                    )
                }
            }
        }

        // 4. BOOKINGS CARDS LIST
        if (filteredBookings.isEmpty()) {
            Surface(
                shape = RoundedCornerShape(16.dp),
                color = Color.White,
                border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(32.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        imageVector = Icons.Default.EventBusy,
                        contentDescription = null,
                        tint = Color(0xFF94A3B8),
                        modifier = Modifier.size(48.dp)
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(
                        text = "No ${selectedFilter.label} Bookings",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF334155)
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = "Any bookings in this category will appear here",
                        fontSize = 12.sp,
                        color = Color(0xFF64748B)
                    )
                }
            }
        } else {
            filteredBookings.forEach { booking ->
                BookingItemCard(
                    booking = booking,
                    onLiveTrackingClick = { onLiveTrackingClick(booking) },
                    onCallClick = onCallSupportClick,
                    onActionClick = { onRebookClick(booking) }
                )
            }
        }

        // 5. FOOTER HELP CARD: "Need Help with a Booking?"
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = Color(0xFFF0FDF4),
            border = BorderStroke(1.dp, Color(0xFFBBF7D0)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Info,
                    contentDescription = null,
                    tint = Color(0xFF16A34A),
                    modifier = Modifier.size(24.dp)
                )

                Spacer(modifier = Modifier.width(10.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Need Help with a Booking?",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF14532D)
                    )
                    Text(
                        text = "Call our support team for assistance or changes",
                        fontSize = 11.sp,
                        color = Color(0xFF166534)
                    )
                }

                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = Color(0xFF0D5C3A),
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .clickable(onClick = onCallSupportClick)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 7.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Phone,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(13.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Call Support",
                            fontSize = 11.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(20.dp))
    }
}

@Composable
private fun BookingItemCard(
    booking: Booking,
    onLiveTrackingClick: () -> Unit,
    onCallClick: () -> Unit,
    onActionClick: () -> Unit
) {
    val isInService = booking.status.equals("In Progress", true) || booking.status.equals("In Service", true)
    val isCompleted = booking.status.equals("Completed", true)
    val isCancelled = booking.status.equals("Cancelled", true)
    val isUpcoming = !isInService && !isCompleted && !isCancelled

    val (icon, iconBg, iconTint) = getBookingVisual(booking.serviceName)

    Surface(
        shape = RoundedCornerShape(18.dp),
        color = Color.White,
        border = BorderStroke(1.dp, if (isInService) Color(0xFF86EFAC) else Color(0xFFE2E8F0)),
        shadowElevation = if (isInService) 3.dp else 1.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(14.dp)
        ) {
            // Row 1: Icon, Title, Subtitle & Status Badge
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.Top
            ) {
                // Service Icon Box
                Surface(
                    shape = RoundedCornerShape(14.dp),
                    color = iconBg,
                    modifier = Modifier.size(46.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = icon,
                            contentDescription = booking.serviceName,
                            tint = iconTint,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = booking.serviceName,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF0F172A)
                    )
                    Text(
                        text = "${booking.beneficiaryName} • Home Visit",
                        fontSize = 11.5.sp,
                        color = Color(0xFF64748B)
                    )
                }

                // Status Badge Pill
                StatusPill(
                    status = when {
                        isInService -> "In Service"
                        isCompleted -> "Completed"
                        isCancelled -> "Cancelled"
                        else -> "Upcoming"
                    }
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Row 2: Date & Time Schedule
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.CalendarToday,
                    contentDescription = null,
                    tint = Color(0xFF64748B),
                    modifier = Modifier.size(13.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = booking.scheduledDate.ifEmpty { "Today" },
                    fontSize = 11.5.sp,
                    color = Color(0xFF334155),
                    fontWeight = FontWeight.Medium
                )

                Spacer(modifier = Modifier.width(12.dp))

                Icon(
                    imageVector = Icons.Default.AccessTime,
                    contentDescription = null,
                    tint = Color(0xFF64748B),
                    modifier = Modifier.size(13.dp)
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = booking.scheduledTimeSlot.ifEmpty { "10:00 AM - 12:00 PM" },
                    fontSize = 11.5.sp,
                    color = Color(0xFF334155),
                    fontWeight = FontWeight.Medium
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Row 3: Action Buttons (Call, Live Tracking, Reschedule, Rebook)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.End,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Call Button (Icon outline)
                IconButton(
                    onClick = onCallClick,
                    modifier = Modifier
                        .size(34.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color(0xFFF1F5F9))
                ) {
                    Icon(
                        imageVector = Icons.Default.Phone,
                        contentDescription = "Call",
                        tint = Color(0xFF0D5C3A),
                        modifier = Modifier.size(16.dp)
                    )
                }

                Spacer(modifier = Modifier.width(8.dp))

                if (isInService) {
                    // Green "Live Tracking >" Button
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = Color.White,
                        border = BorderStroke(1.dp, Color(0xFF0D5C3A)),
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .clickable(onClick = onLiveTrackingClick)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocationOn,
                                contentDescription = null,
                                tint = Color(0xFF0D5C3A),
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "Live Tracking",
                                fontSize = 11.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF0D5C3A)
                            )
                            Spacer(modifier = Modifier.width(2.dp))
                            Icon(
                                imageVector = Icons.Default.ChevronRight,
                                contentDescription = null,
                                tint = Color(0xFF0D5C3A),
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }
                } else if (isCompleted) {
                    // "Rebook" Button
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = Color(0xFFF0FDF4),
                        border = BorderStroke(1.dp, Color(0xFF86EFAC)),
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .clickable(onClick = onActionClick)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Refresh,
                                contentDescription = null,
                                tint = Color(0xFF15803D),
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "Rebook",
                                fontSize = 11.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF15803D)
                            )
                        }
                    }
                } else {
                    // "Reschedule" Button
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = Color(0xFFF8FAFC),
                        border = BorderStroke(1.dp, Color(0xFFCBD5E1)),
                        modifier = Modifier
                            .clip(RoundedCornerShape(10.dp))
                            .clickable(onClick = onActionClick)
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.EditCalendar,
                                contentDescription = null,
                                tint = Color(0xFF475569),
                                modifier = Modifier.size(14.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = "Reschedule",
                                fontSize = 11.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF475569)
                            )
                        }
                    }
                }
            }

            // Row 4: Stepper Timeline (Only for In Service cards)
            if (isInService) {
                Spacer(modifier = Modifier.height(14.dp))
                HorizontalDivider(color = Color(0xFFE2E8F0))
                Spacer(modifier = Modifier.height(10.dp))

                BookingStepperLine(currentStep = 2)
            }
        }
    }
}

@Composable
private fun StatusPill(status: String) {
    val (bg, textCol, icon) = when (status) {
        "In Service" -> Triple(Color(0xFFDCFCE7), Color(0xFF15803D), Icons.Default.FiberManualRecord)
        "Completed" -> Triple(Color(0xFFDCFCE7), Color(0xFF15803D), Icons.Default.Check)
        "Cancelled" -> Triple(Color(0xFFFEE2E2), Color(0xFFDC2626), Icons.Default.Close)
        else -> Triple(Color(0xFFFEF3C7), Color(0xFFB45309), Icons.Default.Event)
    }

    Surface(
        shape = RoundedCornerShape(12.dp),
        color = bg
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = icon,
                contentDescription = null,
                tint = textCol,
                modifier = Modifier.size(11.dp)
            )
            Spacer(modifier = Modifier.width(3.dp))
            Text(
                text = status,
                fontSize = 10.5.sp,
                fontWeight = FontWeight.Bold,
                color = textCol
            )
        }
    }
}

@Composable
private fun BookingStepperLine(currentStep: Int) {
    val steps = listOf("Booked", "Dispatched", "In Service", "Completed")

    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        steps.forEachIndexed { index, stepName ->
            val isDone = index < currentStep
            val isCurrent = index == currentStep

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Surface(
                    shape = CircleShape,
                    color = when {
                        isDone -> Color(0xFF16A34A)
                        isCurrent -> Color(0xFF0D5C3A)
                        else -> Color(0xFFE2E8F0)
                    },
                    modifier = Modifier.size(16.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        if (isDone) {
                            Icon(
                                imageVector = Icons.Default.Check,
                                contentDescription = null,
                                tint = Color.White,
                                modifier = Modifier.size(10.dp)
                            )
                        } else if (isCurrent) {
                            Box(
                                modifier = Modifier
                                    .size(6.dp)
                                    .clip(CircleShape)
                                    .background(Color.White)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(2.dp))

                Text(
                    text = stepName,
                    fontSize = 9.sp,
                    fontWeight = if (isCurrent) FontWeight.Bold else FontWeight.Medium,
                    color = if (isCurrent) Color(0xFF0D5C3A) else Color(0xFF64748B)
                )
            }

            if (index < steps.size - 1) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .height(2.dp)
                        .offset(y = (-6).dp)
                        .background(if (index < currentStep) Color(0xFF16A34A) else Color(0xFFE2E8F0))
                )
            }
        }
    }
}

private fun getBookingVisual(name: String): Triple<ImageVector, Color, Color> {
    val n = name.lowercase()
    return when {
        n.contains("household") || n.contains("meal") -> Triple(Icons.Default.Restaurant, Color(0xFFFEF3C7), Color(0xFFD97706))
        n.contains("health") || n.contains("vitals") -> Triple(Icons.Default.Favorite, Color(0xFFFFE4E6), Color(0xFFE11D48))
        n.contains("medication") -> Triple(Icons.Default.Medication, Color(0xFFFEE2E2), Color(0xFFEF4444))
        n.contains("physio") -> Triple(Icons.Default.FitnessCenter, Color(0xFFF3E8FF), Color(0xFF9333EA))
        n.contains("doctor") -> Triple(Icons.Default.LocalHospital, Color(0xFFE0F2FE), Color(0xFF0284C7))
        else -> Triple(Icons.Default.AccessibilityNew, Color(0xFFE8F5E9), Color(0xFF16A34A))
    }
}

