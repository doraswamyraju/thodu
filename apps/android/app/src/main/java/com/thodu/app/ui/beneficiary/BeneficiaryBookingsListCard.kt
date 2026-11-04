package com.thodu.app.ui.beneficiary

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.data.model.Booking

@Composable
fun BeneficiaryBookingsListCard(
    bookings: List<Booking>,
    onBookCareClick: () -> Unit
) {
    var selectedFilter by remember { mutableStateOf("All") }
    val filters = listOf("All", "In Progress", "Confirmed", "Scheduled", "Completed")

    val filtered = remember(selectedFilter, bookings) {
        if (selectedFilter == "All") bookings
        else bookings.filter { it.status.equals(selectedFilter, ignoreCase = true) }
    }

    Surface(
        shape = RoundedCornerShape(16.dp),
        color = Color.White,
        border = BorderStroke(1.dp, Color(0xFFE5E7EB)),
        shadowElevation = 1.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Care Bookings & History",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827)
                )

                Text(
                    text = "${filtered.size} visits",
                    fontSize = 12.sp,
                    color = Color(0xFF6B7280)
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Filter Tabs
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(6.dp)
            ) {
                filters.take(4).forEach { filter ->
                    val isSelected = selectedFilter == filter
                    Surface(
                        shape = RoundedCornerShape(14.dp),
                        color = if (isSelected) Color(0xFF0D5C3A) else Color(0xFFF3F4F6),
                        modifier = Modifier
                            .weight(1f)
                            .clickable { selectedFilter = filter }
                    ) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier.padding(vertical = 6.dp)
                        ) {
                            Text(
                                text = filter,
                                fontSize = 11.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) Color.White else Color(0xFF4B5563)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Bookings List Items
            if (filtered.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 20.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "No care visits found under '$selectedFilter'",
                        fontSize = 12.sp,
                        color = Color.Gray
                    )
                }
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    filtered.forEach { bk ->
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = Color(0xFFFAFAFA),
                            border = BorderStroke(1.dp, Color(0xFFE5E7EB)),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.padding(12.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Text(
                                            text = bk.bookingNumber,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 13.sp,
                                            color = Color(0xFF0D5C3A)
                                        )
                                        Spacer(modifier = Modifier.width(6.dp))
                                        Text(
                                            text = "• ${bk.serviceName}",
                                            fontWeight = FontWeight.SemiBold,
                                            fontSize = 13.sp,
                                            color = Color(0xFF1F2937)
                                        )
                                    }
                                    Text(
                                        text = "${bk.scheduledDate} • ${bk.scheduledTimeSlot}",
                                        fontSize = 11.sp,
                                        color = Color(0xFF6B7280),
                                        modifier = Modifier.padding(top = 2.dp)
                                    )
                                    Text(
                                        text = "Care Specialist: ${bk.caregiverName}",
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Medium,
                                        color = Color(0xFF374151),
                                        modifier = Modifier.padding(top = 2.dp)
                                    )
                                }

                                Surface(
                                    shape = RoundedCornerShape(10.dp),
                                    color = when (bk.status) {
                                        "In Progress" -> Color(0xFFDCFCE7)
                                        "Confirmed" -> Color(0xFFDBEAFE)
                                        "Completed" -> Color(0xFFF3F4F6)
                                        else -> Color(0xFFFEF3C7)
                                    }
                                ) {
                                    Text(
                                        text = bk.status,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = when (bk.status) {
                                            "In Progress" -> Color(0xFF15803D)
                                            "Confirmed" -> Color(0xFF1D4ED8)
                                            "Completed" -> Color(0xFF4B5563)
                                            else -> Color(0xFFB45309)
                                        },
                                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

