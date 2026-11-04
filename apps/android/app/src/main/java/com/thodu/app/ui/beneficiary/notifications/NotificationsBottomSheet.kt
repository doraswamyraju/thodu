package com.thodu.app.ui.beneficiary.notifications

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.ui.theme.ThoduGreen

data class AppNotification(
    val id: String,
    val title: String,
    val description: String,
    val timestamp: String,
    val type: NotificationType,
    val isRead: Boolean
)

enum class NotificationType {
    DISPATCH,
    VITALS,
    MEDICATION,
    SUBSIDY
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NotificationsBottomSheet(
    onDismiss: () -> Unit
) {
    val sampleNotifications = listOf(
        AppNotification(
            "n1",
            "Caregiver Dispatched",
            "Anitha is on the way for Household Support visit (ETA: ~12 mins).",
            "10:00 AM",
            NotificationType.DISPATCH,
            false
        ),
        AppNotification(
            "n2",
            "Clinical Vitals Recorded",
            "Blood pressure recorded: 124/82 mmHg, Pulse: 74 bpm.",
            "09:15 AM",
            NotificationType.VITALS,
            false
        ),
        AppNotification(
            "n3",
            "Upcoming Medication Reminder",
            "Metformin 500 mg is due at 01:30 PM with lunch.",
            "08:30 AM",
            NotificationType.MEDICATION,
            true
        ),
        AppNotification(
            "n4",
            "Trust Subsidy Approved",
            "100% Care subsidy active under Sri Divyang Seva Kendram Trust.",
            "Yesterday",
            NotificationType.SUBSIDY,
            true
        )
    )

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = Color.White,
        shape = RoundedCornerShape(topStart = 20.dp, topEnd = 20.dp),
        dragHandle = { BottomSheetDefaults.DragHandle() }
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .padding(bottom = 32.dp)
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Notifications,
                        contentDescription = null,
                        tint = ThoduGreen,
                        modifier = Modifier.size(22.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Notification Center",
                        fontSize = 17.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF111827)
                    )
                }

                IconButton(onClick = onDismiss) {
                    Icon(imageVector = Icons.Default.Close, contentDescription = "Close")
                }
            }

            Text(
                text = "Real-time updates regarding care visits, medication, and vitals",
                fontSize = 12.sp,
                color = Color(0xFF6B7280),
                modifier = Modifier.padding(bottom = 14.dp)
            )

            // Notifications List
            LazyColumn(
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                items(sampleNotifications) { notif ->
                    val (icon, bgCol, tintCol) = getNotificationIcon(notif.type)
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = if (notif.isRead) Color(0xFFF9FAFB) else Color(0xFFF0FDF4),
                        border = BorderStroke(1.dp, if (notif.isRead) Color(0xFFE5E7EB) else Color(0xFFBBF7D0)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp),
                            verticalAlignment = Alignment.Top
                        ) {
                            Surface(
                                shape = CircleShape,
                                color = bgCol,
                                modifier = Modifier.size(36.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = icon,
                                        contentDescription = null,
                                        tint = tintCol,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(12.dp))

                            Column(modifier = Modifier.weight(1f)) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.SpaceBetween
                                ) {
                                    Text(
                                        text = notif.title,
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF111827)
                                    )
                                    Text(
                                        text = notif.timestamp,
                                        fontSize = 10.sp,
                                        color = Color(0xFF9CA3AF)
                                    )
                                }
                                Text(
                                    text = notif.description,
                                    fontSize = 12.sp,
                                    color = Color(0xFF4B5563),
                                    modifier = Modifier.padding(top = 2.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

private fun getNotificationIcon(type: NotificationType): Triple<ImageVector, Color, Color> {
    return when (type) {
        NotificationType.DISPATCH -> Triple(Icons.Default.Navigation, Color(0xFFDCFCE7), Color(0xFF15803D))
        NotificationType.VITALS -> Triple(Icons.Default.Favorite, Color(0xFFEFF6FF), Color(0xFF2563EB))
        NotificationType.MEDICATION -> Triple(Icons.Default.Medication, Color(0xFFFEF3C7), Color(0xFFD97706))
        NotificationType.SUBSIDY -> Triple(Icons.Default.Shield, Color(0xFFF3E8FF), Color(0xFF9333EA))
    }
}

