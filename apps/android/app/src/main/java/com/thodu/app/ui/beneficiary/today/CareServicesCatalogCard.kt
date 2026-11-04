package com.thodu.app.ui.beneficiary.today

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.data.model.CareService

data class ServiceGridItem(
    val id: String,
    val title: String,
    val icon: ImageVector,
    val cardBg: Color,
    val iconTint: Color
)

@Composable
fun CareServicesCatalogCard(
    services: List<CareService>,
    onSelectServiceToBook: (CareService?) -> Unit
) {
    // 8 Beautiful Care Services matching the design inspiration
    val catalogItems = listOf(
        ServiceGridItem("srv-1", "Personal\nCare", Icons.Default.Elderly, Color(0xFFF0FDF4), Color(0xFF15803D)),
        ServiceGridItem("srv-2", "Health\nMonitoring", Icons.Default.Favorite, Color(0xFFFEF2F2), Color(0xFFDC2626)),
        ServiceGridItem("srv-3", "Medication\nAssistance", Icons.Default.Medication, Color(0xFFFFF1F2), Color(0xFFE11D48)),
        ServiceGridItem("srv-4", "Meals &\nNutrition", Icons.Default.Restaurant, Color(0xFFFFFBEB), Color(0xFFD97706)),
        ServiceGridItem("srv-5", "Physio\nSupport", Icons.Default.FitnessCenter, Color(0xFFF0FDF4), Color(0xFF16A34A)),
        ServiceGridItem("srv-6", "Doctor\nConsultation", Icons.Default.MedicalServices, Color(0xFFF0FDF4), Color(0xFF0D5C3A)),
        ServiceGridItem("srv-7", "Lab Sample\nCollection", Icons.Default.Science, Color(0xFFEFF6FF), Color(0xFF2563EB)),
        ServiceGridItem("srv-8", "More\nServices", Icons.Default.MoreHoriz, Color(0xFFF0FDF4), Color(0xFF0D5C3A))
    )

    Column(modifier = Modifier.fillMaxWidth()) {
        // Section Header: "Our Services" and "Book a Service ->"
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "Our Services",
                fontSize = 17.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF143627)
            )

            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .clip(RoundedCornerShape(8.dp))
                    .clickable { onSelectServiceToBook(null) }
                    .padding(4.dp)
            ) {
                Text(
                    text = "Book a Service",
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

        Spacer(modifier = Modifier.height(12.dp))

        // Row 1 (4 Items)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            catalogItems.take(4).forEach { item ->
                ServiceBox(
                    item = item,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        val matched = services.firstOrNull { it.name.contains(item.title.replace("\n", " "), ignoreCase = true) }
                        onSelectServiceToBook(matched)
                    }
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Row 2 (4 Items)
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            catalogItems.drop(4).take(4).forEach { item ->
                ServiceBox(
                    item = item,
                    modifier = Modifier.weight(1f),
                    onClick = {
                        val matched = services.firstOrNull { it.name.contains(item.title.replace("\n", " "), ignoreCase = true) }
                        onSelectServiceToBook(matched)
                    }
                )
            }
        }
    }
}

@Composable
private fun ServiceBox(
    item: ServiceGridItem,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = item.cardBg,
        border = BorderStroke(1.dp, Color.White),
        shadowElevation = 1.dp,
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .clickable(onClick = onClick)
    ) {
        Column(
            modifier = Modifier
                .padding(vertical = 12.dp, horizontal = 4.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                imageVector = item.icon,
                contentDescription = item.title,
                tint = item.iconTint,
                modifier = Modifier.size(28.dp)
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = item.title,
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF1E293B),
                textAlign = TextAlign.Center,
                lineHeight = 13.sp,
                maxLines = 2,
                minLines = 2
            )
        }
    }
}
