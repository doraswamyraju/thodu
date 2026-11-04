package com.thodu.app.ui.beneficiary.today

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AccessTime
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.R
import com.thodu.app.data.model.Booking

@Composable
fun TodayCaregiverDispatchCard(
    activeBooking: Booking?,
    onLiveTrackingClick: () -> Unit = {}
) {
    // Only display if active
    if (activeBooking == null || activeBooking.status.equals("Completed", ignoreCase = true)) {
        return
    }

    Surface(
        shape = RoundedCornerShape(20.dp),
        border = BorderStroke(1.dp, Color(0xFFBAE6FD).copy(alpha = 0.8f)),
        shadowElevation = 2.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.horizontalGradient(
                        colors = listOf(
                            Color(0xFFF0F9FF), // Ice blue
                            Color(0xFFE0F2FE), // Sky tint
                            Color(0xFFF8FAFC)
                        )
                    )
                )
                .padding(14.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Caregiver Photo with Live Badge
                Box {
                    Surface(
                        shape = CircleShape,
                        border = BorderStroke(2.dp, Color.White),
                        color = Color.White,
                        modifier = Modifier.size(56.dp)
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.avatar_caregiver_anitha),
                            contentDescription = activeBooking.caregiverName,
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Crop
                        )
                    }

                    // Green "• Live" Pill Overlay
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = Color(0xFF16A34A),
                        modifier = Modifier
                            .align(Alignment.BottomCenter)
                            .offset(y = 4.dp)
                    ) {
                        Text(
                            text = "• Live",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White,
                            modifier = Modifier.padding(horizontal = 6.dp, vertical = 1.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.width(14.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "Today's Caregiver Dispatch",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF0F172A)
                    )

                    Spacer(modifier = Modifier.height(2.dp))

                    Text(
                        text = "${activeBooking.caregiverName} (Caregiver)",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Color(0xFF334155)
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = Color(0xFFDCFCE7),
                            border = BorderStroke(1.dp, Color(0xFF86EFAC))
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Default.AccessTime,
                                    contentDescription = null,
                                    tint = Color(0xFF15803D),
                                    modifier = Modifier.size(11.dp)
                                )
                                Spacer(modifier = Modifier.width(3.dp))
                                Text(
                                    text = "In Service",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF15803D)
                                )
                            }
                        }

                        Text(
                            text = "  |  10:00 AM - 4:00 PM",
                            fontSize = 10.sp,
                            color = Color(0xFF64748B)
                        )
                    }
                }

                // "Live Tracking" White Button with Pin
                Surface(
                    shape = RoundedCornerShape(18.dp),
                    color = Color.White,
                    border = BorderStroke(1.dp, Color(0xFF0D5C3A)),
                    shadowElevation = 1.dp,
                    modifier = Modifier
                        .clip(RoundedCornerShape(18.dp))
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
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF0D5C3A)
                        )
                    }
                }
            }
        }
    }
}
