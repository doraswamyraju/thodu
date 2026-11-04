package com.thodu.app.ui.beneficiary.today

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Checklist
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
import com.thodu.app.data.model.CareTask

@Composable
fun DailyTasksChecklistCard(
    activeBooking: Booking?
) {
    val tasks = activeBooking?.careTasks ?: listOf(
        CareTask("t1", "Check Vitals (Blood Pressure & Pulse)", true, "10:15 AM"),
        CareTask("t2", "Assisted Morning Walking & Exercise (20 mins)", true, "10:35 AM"),
        CareTask("t3", "Diabetic Morning Medication Administered", true, "10:55 AM"),
        CareTask("t4", "Nutritional Lunch Preparation & Hydration", false, null),
        CareTask("t5", "Afternoon Rest & Bedside Repositioning", false, null)
    )

    val completedCount = tasks.count { it.completed }
    val totalCount = tasks.size

    Surface(
        shape = RoundedCornerShape(16.dp),
        color = Color.White,
        border = BorderStroke(1.dp, Color(0xFFE5E7EB)),
        shadowElevation = 1.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header with Progress Counter
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Checklist,
                        contentDescription = null,
                        tint = Color(0xFF0D5C3A),
                        modifier = Modifier.size(20.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Daily Care Tasks",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF111827)
                    )
                }

                Surface(
                    shape = RoundedCornerShape(10.dp),
                    color = Color(0xFFF0FDF4),
                    border = BorderStroke(1.dp, Color(0xFFBBF7D0))
                ) {
                    Text(
                        text = "$completedCount / $totalCount Completed",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF15803D),
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Task Items
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                tasks.forEach { task ->
                    Surface(
                        shape = RoundedCornerShape(8.dp),
                        color = if (task.completed) Color(0xFFF0FDF4) else Color(0xFFF9FAFB),
                        border = BorderStroke(1.dp, if (task.completed) Color(0xFFDCFCE7) else Color(0xFFE5E7EB)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 9.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = if (task.completed) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                                contentDescription = null,
                                tint = if (task.completed) Color(0xFF15803D) else Color(0xFF9CA3AF),
                                modifier = Modifier.size(17.dp)
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text(
                                text = task.taskName,
                                fontSize = 12.sp,
                                fontWeight = if (task.completed) FontWeight.Medium else FontWeight.Normal,
                                color = if (task.completed) Color(0xFF14532D) else Color(0xFF4B5563),
                                modifier = Modifier.weight(1f)
                            )
                            if (task.completed && task.completedAt != null) {
                                Text(
                                    text = "Done at ${task.completedAt}",
                                    fontSize = 10.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = Color(0xFF15803D)
                                )
                            } else {
                                Text(
                                    text = "Pending",
                                    fontSize = 10.sp,
                                    color = Color(0xFF9CA3AF)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

