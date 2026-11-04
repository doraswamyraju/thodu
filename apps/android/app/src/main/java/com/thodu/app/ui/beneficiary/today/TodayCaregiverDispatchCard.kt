package com.thodu.app.ui.beneficiary.today

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.data.model.Booking

@Composable
fun TodayCaregiverDispatchCard(
    activeBooking: Booking?,
    onCallCaregiver: (String) -> Unit = {}
) {
    // CONDITIONAL: Render only if there is an active/in-progress or confirmed booking
    if (activeBooking == null || activeBooking.status.equals("Completed", ignoreCase = true)) {
        return
    }

    Surface(
        shape = RoundedCornerShape(16.dp),
        color = Color.White,
        border = BorderStroke(1.dp, Color(0xFFE5E7EB)),
        shadowElevation = 1.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header: Service Name & Status Badge
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Today's Caregiver Dispatch & Live Status",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827)
                )

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = when (activeBooking.status) {
                        "In Progress" -> Color(0xFFDCFCE7)
                        "Confirmed" -> Color(0xFFDBEAFE)
                        else -> Color(0xFFFEF3C7)
                    },
                    border = BorderStroke(
                        1.dp,
                        when (activeBooking.status) {
                            "In Progress" -> Color(0xFF86EFAC)
                            "Confirmed" -> Color(0xFF93C5FD)
                            else -> Color(0xFFFDE68A)
                        }
                    )
                ) {
                    Text(
                        text = "• ${activeBooking.status}",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = when (activeBooking.status) {
                            "In Progress" -> Color(0xFF15803D)
                            "Confirmed" -> Color(0xFF1D4ED8)
                            else -> Color(0xFFB45309)
                        },
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Service details & Caregiver info
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1.2f)) {
                    Text(
                        text = "CARE SERVICE & SCHEDULE",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF6B7280)
                    )
                    Text(
                        text = activeBooking.serviceName,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1F2937),
                        modifier = Modifier.padding(top = 2.dp)
                    )
                    Text(
                        text = "${activeBooking.scheduledDate} • ${activeBooking.scheduledTimeSlot}",
                        fontSize = 11.sp,
                        color = Color(0xFF6B7280),
                        modifier = Modifier.padding(top = 1.dp)
                    )
                }

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "ASSIGNED CARE SPECIALIST",
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF6B7280)
                    )
                    Text(
                        text = activeBooking.caregiverName,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1F2937),
                        modifier = Modifier.padding(top = 2.dp)
                    )
                    Text(
                        text = "✓ Verified Specialist",
                        fontSize = 11.sp,
                        color = Color(0xFF15803D),
                        modifier = Modifier.padding(top = 1.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Live ETA / GPS Tracker Box
            Surface(
                shape = RoundedCornerShape(10.dp),
                color = Color(0xFFF0FDF4),
                border = BorderStroke(1.dp, Color(0xFFBBF7D0)),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(10.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = CircleShape,
                            color = Color(0xFF15803D),
                            modifier = Modifier.size(28.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    imageVector = Icons.Default.Navigation,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "Caregiver ETA: ~${activeBooking.caregiverEtaMinutes ?: 12} mins",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF14532D)
                            )
                            Text(
                                text = "En route to service address",
                                fontSize = 10.sp,
                                color = Color(0xFF166534)
                            )
                        }
                    }

                    // Call Caregiver Action Button
                    Button(
                        onClick = { onCallCaregiver("+91 98480 22334") },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color.White,
                            contentColor = Color(0xFF15803D)
                        ),
                        border = BorderStroke(1.dp, Color(0xFF86EFAC)),
                        shape = RoundedCornerShape(8.dp),
                        contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp),
                        modifier = Modifier.height(34.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Phone,
                            contentDescription = "Call",
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(text = "Call", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

