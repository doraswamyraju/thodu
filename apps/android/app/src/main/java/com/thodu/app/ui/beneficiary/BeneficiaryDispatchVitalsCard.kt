package com.thodu.app.ui.beneficiary

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.RadioButtonUnchecked
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
fun BeneficiaryDispatchVitalsCard(
    activeBooking: Booking?
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = Color.White,
        border = BorderStroke(1.dp, Color(0xFFE5E7EB)),
        shadowElevation = 1.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header with In Progress Tag
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Today's Caregiver Dispatch & Vitals",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827)
                )

                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Color(0xFFDCFCE7),
                    border = BorderStroke(1.dp, Color(0xFF86EFAC))
                ) {
                    Text(
                        text = "• ${activeBooking?.status ?: "In Progress"}",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF15803D),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Service & Assigned Care Specialist
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "SERVICE & SCHEDULE",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF6B7280)
                    )
                    Text(
                        text = activeBooking?.serviceName ?: "Household Support",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1F2937)
                    )
                    Text(
                        text = "${activeBooking?.scheduledDate ?: "Mar 10, 2026"} • ${activeBooking?.scheduledTimeSlot ?: "10:00 AM - 12:00 PM"}",
                        fontSize = 11.sp,
                        color = Color(0xFF6B7280)
                    )
                }

                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = "ASSIGNED CARE SPECIALIST",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF6B7280)
                    )
                    Text(
                        text = activeBooking?.caregiverName ?: "Anitha",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF1F2937)
                    )
                    Text(
                        text = "✓ Verified Background Checked",
                        fontSize = 11.sp,
                        color = Color(0xFF15803D)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Clinical Vitals Grid
            Text(
                text = "Clinical Vitals Monitored Today:",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF374151)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                VitalBox(
                    label = "Blood Pressure",
                    value = activeBooking?.vitals?.bloodPressure ?: "124/82",
                    unit = "mmHg",
                    modifier = Modifier.weight(1f)
                )
                VitalBox(
                    label = "Pulse Rate",
                    value = "${activeBooking?.vitals?.pulseBpm ?: 74}",
                    unit = "bpm",
                    modifier = Modifier.weight(1f)
                )
                VitalBox(
                    label = "Oxygen SpO2",
                    value = "${activeBooking?.vitals?.oxygenSpo2 ?: 98}%",
                    unit = "",
                    modifier = Modifier.weight(1f)
                )
                VitalBox(
                    label = "Blood Sugar",
                    value = "${activeBooking?.vitals?.bloodSugarMgDl ?: 138}",
                    unit = "mg/dL",
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Daily Care Tasks Checklist
            Text(
                text = "Daily Care Task Completion:",
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF374151)
            )

            Spacer(modifier = Modifier.height(8.dp))

            val tasks = activeBooking?.careTasks ?: listOf(
                com.thodu.app.data.model.CareTask("t1", "Check Vitals (Blood Pressure & Pulse)", true, "10:15 AM"),
                com.thodu.app.data.model.CareTask("t2", "Assisted Morning Walking (20 mins)", true, "10:35 AM"),
                com.thodu.app.data.model.CareTask("t3", "Diabetic Medication Administered", true, "10:55 AM"),
                com.thodu.app.data.model.CareTask("t4", "Nutritional Meal Preparation", false, null)
            )

            tasks.forEach { task ->
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = if (task.completed) Color(0xFFF0FDF4) else Color(0xFFF9FAFB),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 3.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = if (task.completed) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                            contentDescription = null,
                            tint = if (task.completed) Color(0xFF15803D) else Color(0xFF9CA3AF),
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = task.taskName,
                            fontSize = 12.sp,
                            fontWeight = if (task.completed) FontWeight.Medium else FontWeight.Normal,
                            color = if (task.completed) Color(0xFF14532D) else Color(0xFF4B5563),
                            modifier = Modifier.weight(1f)
                        )
                        if (task.completed && task.completedAt != null) {
                            Text(
                                text = task.completedAt,
                                fontSize = 11.sp,
                                color = Color(0xFF15803D)
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun VitalBox(
    label: String,
    value: String,
    unit: String,
    modifier: Modifier = Modifier
) {
    Surface(
        shape = RoundedCornerShape(8.dp),
        color = Color(0xFFF0FDF4),
        border = BorderStroke(1.dp, Color(0xFFDCFCE7)),
        modifier = modifier
    ) {
        Column(
            modifier = Modifier.padding(6.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = label,
                fontSize = 9.sp,
                fontWeight = FontWeight.Medium,
                color = Color(0xFF15803D),
                maxLines = 1
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = value,
                fontSize = 13.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF14532D)
            )
            if (unit.isNotEmpty()) {
                Text(
                    text = unit,
                    fontSize = 9.sp,
                    color = Color(0xFF166534)
                )
            }
        }
    }
}

