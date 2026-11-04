package com.thodu.app.ui.beneficiary.today

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.RadioButtonUnchecked
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class TodayTaskItem(
    val title: String,
    val scheduledTime: String,
    val isCompleted: Boolean
)

@Composable
fun TodayTasksListCard(
    onViewAllClick: () -> Unit = {}
) {
    val tasks = listOf(
        TodayTaskItem("Morning Medication", "8:00 AM", true),
        TodayTaskItem("Blood Pressure Check", "10:00 AM", true),
        TodayTaskItem("Lunch & Hydration", "1:00 PM", false),
        TodayTaskItem("Evening Walk", "5:00 PM", false),
        TodayTaskItem("Night Medication", "8:00 PM", false)
    )

    Surface(
        shape = RoundedCornerShape(16.dp),
        color = Color.White,
        border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
        shadowElevation = 1.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header: "Today's Tasks" and "View All ->"
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = "Today's Tasks",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0F172A)
                )

                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .clickable(onClick = onViewAllClick)
                        .padding(4.dp)
                ) {
                    Text(
                        text = "View All",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF0D5C3A)
                    )
                    Spacer(modifier = Modifier.width(3.dp))
                    Icon(
                        imageVector = Icons.Default.ArrowForward,
                        contentDescription = null,
                        tint = Color(0xFF0D5C3A),
                        modifier = Modifier.size(13.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            // Task Rows
            tasks.forEachIndexed { index, task ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 9.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Checkbox Icon
                    Icon(
                        imageVector = if (task.isCompleted) Icons.Default.CheckCircle else Icons.Default.RadioButtonUnchecked,
                        contentDescription = null,
                        tint = if (task.isCompleted) Color(0xFF16A34A) else Color(0xFF94A3B8),
                        modifier = Modifier.size(18.dp)
                    )

                    Spacer(modifier = Modifier.width(10.dp))

                    // Title
                    Text(
                        text = task.title,
                        fontSize = 13.sp,
                        fontWeight = if (task.isCompleted) FontWeight.SemiBold else FontWeight.Normal,
                        color = if (task.isCompleted) Color(0xFF1E293B) else Color(0xFF334155),
                        modifier = Modifier.weight(1f)
                    )

                    // Scheduled Time
                    Text(
                        text = task.scheduledTime,
                        fontSize = 11.sp,
                        color = Color(0xFF64748B),
                        modifier = Modifier.padding(horizontal = 8.dp)
                    )

                    // Status Pill (Completed vs Pending)
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = if (task.isCompleted) Color(0xFFDCFCE7) else Color(0xFFEFF6FF),
                        border = BorderStroke(
                            1.dp,
                            if (task.isCompleted) Color(0xFF86EFAC) else Color(0xFFBFDBFE)
                        )
                    ) {
                        Text(
                            text = if (task.isCompleted) "Completed" else "Pending",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (task.isCompleted) Color(0xFF15803D) else Color(0xFF2563EB),
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                        )
                    }
                }

                if (index < tasks.size - 1) {
                    HorizontalDivider(color = Color(0xFFF1F5F9), thickness = 1.dp)
                }
            }
        }
    }
}

