package com.thodu.app.ui.beneficiary.today

import androidx.compose.animation.core.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
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
    onLiveTrackingClick: () -> Unit = {},
    onBookCareClick: () -> Unit = {}
) {
    // If no active booking, render an inviting "Book Assistance" card
    if (activeBooking == null || activeBooking.status.equals("Completed", ignoreCase = true)) {
        Surface(
            shape = RoundedCornerShape(18.dp),
            color = Color(0xFFF8FAF9),
            border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(14.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    shape = CircleShape,
                    color = Color(0xFFDCFCE7),
                    modifier = Modifier.size(44.dp)
                ) {
                    Box(contentAlignment = Alignment.Center) {
                        Icon(
                            imageVector = Icons.Default.MedicalServices,
                            contentDescription = null,
                            tint = Color(0xFF15803D),
                            modifier = Modifier.size(22.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "No Caregiver Dispatched",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1F2937)
                    )
                    Text(
                        text = "Schedule companion, nursing or physio care",
                        fontSize = 11.5.sp,
                        color = Color(0xFF6B7280)
                    )
                }

                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = Color(0xFF0D5C3A),
                    modifier = Modifier
                        .clip(RoundedCornerShape(10.dp))
                        .clickable(onClick = onBookCareClick)
                ) {
                    Text(
                        text = "Book Care",
                        fontSize = 11.5.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 7.dp)
                    )
                }
            }
        }
        return
    }

    // Pulsing animation for the "Live" radar effect
    val infiniteTransition = rememberInfiniteTransition(label = "beacon")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.35f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "pulse"
    )

    Surface(
        shape = RoundedCornerShape(20.dp),
        color = Color.White,
        border = BorderStroke(1.5.dp, Color(0xFFBAE6FD)),
        shadowElevation = 3.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color(0xFFF0F9FF),
                            Color(0xFFFFFFFF)
                        )
                    )
                )
                .padding(14.dp)
        ) {
            // Top Row: Section Header & Live Tracking Pill
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    // Pulsing radar dot
                    Box(contentAlignment = Alignment.Center) {
                        Box(
                            modifier = Modifier
                                .size(12.dp)
                                .scale(pulseScale)
                                .clip(CircleShape)
                                .background(Color(0xFF22C55E).copy(alpha = 0.4f))
                        )
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF16A34A))
                        )
                    }

                    Spacer(modifier = Modifier.width(6.dp))

                    Text(
                        text = "LIVE CAREGIVER DISPATCH",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.ExtraBold,
                        color = Color(0xFF0369A1),
                        letterSpacing = 0.5.sp
                    )
                }

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Color(0xFFDCFCE7),
                    border = BorderStroke(1.dp, Color(0xFF86EFAC))
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = null,
                            tint = Color(0xFF15803D),
                            modifier = Modifier.size(12.dp)
                        )
                        Spacer(modifier = Modifier.width(3.dp))
                        Text(
                            text = "In Service",
                            fontSize = 10.5.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF15803D)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Middle Row: Caregiver Details & Avatar
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Caregiver Photo
                Surface(
                    shape = CircleShape,
                    border = BorderStroke(2.dp, Color(0xFF38BDF8)),
                    color = Color.White,
                    modifier = Modifier.size(54.dp)
                ) {
                    Image(
                        painter = painterResource(id = R.drawable.avatar_caregiver_anitha),
                        contentDescription = activeBooking.caregiverName,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                }

                Spacer(modifier = Modifier.width(12.dp))

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = activeBooking.caregiverName.ifEmpty { "Anitha (Caregiver)" },
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF0F172A)
                    )

                    Spacer(modifier = Modifier.height(2.dp))

                    Text(
                        text = "${activeBooking.serviceName} • Specialist Attendant",
                        fontSize = 12.sp,
                        color = Color(0xFF475569)
                    )

                    Spacer(modifier = Modifier.height(4.dp))

                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Default.AccessTime,
                            contentDescription = null,
                            tint = Color(0xFF64748B),
                            modifier = Modifier.size(12.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = activeBooking.scheduledTimeSlot.ifEmpty { "10:00 AM - 4:00 PM" },
                            fontSize = 11.5.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFF64748B)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Action Buttons: Call Caregiver & Live GPS Tracking
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                // Call Button
                OutlinedButton(
                    onClick = {},
                    shape = RoundedCornerShape(12.dp),
                    border = BorderStroke(1.dp, Color(0xFFCBD5E1)),
                    colors = ButtonDefaults.outlinedButtonColors(
                        containerColor = Color.White,
                        contentColor = Color(0xFF334155)
                    ),
                    modifier = Modifier
                        .weight(1f)
                        .height(38.dp),
                    contentPadding = PaddingValues(horizontal = 10.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.Phone,
                        contentDescription = "Call",
                        tint = Color(0xFF0D5C3A),
                        modifier = Modifier.size(15.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Call",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                // Live Tracking Button
                Button(
                    onClick = onLiveTrackingClick,
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF0D5C3A),
                        contentColor = Color.White
                    ),
                    modifier = Modifier
                        .weight(1.5f)
                        .height(38.dp),
                    contentPadding = PaddingValues(horizontal = 12.dp)
                ) {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = "Track Location",
                        tint = Color.White,
                        modifier = Modifier.size(15.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = "Track Location",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
}
