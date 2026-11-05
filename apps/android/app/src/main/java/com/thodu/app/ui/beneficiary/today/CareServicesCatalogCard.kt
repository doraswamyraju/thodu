package com.thodu.app.ui.beneficiary.today

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
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

data class ServiceVisualItem(
    val id: String,
    val title: String,
    val icon: ImageVector,
    val bgColor: Color,
    val tintColor: Color
)

@Composable
fun CareServicesCatalogCard(
    services: List<CareService>,
    onSelectServiceToBook: (CareService?) -> Unit
) {
    // 8 standard services with rich distinct background tints and icons
    val defaultServices = listOf(
        ServiceVisualItem("srv-1", "Personal Care", Icons.Default.AccessibilityNew, Color(0xFFE8F5E9), Color(0xFF16A34A)),
        ServiceVisualItem("srv-2", "Health Monitor", Icons.Default.Favorite, Color(0xFFFFEBEE), Color(0xFFE11D48)),
        ServiceVisualItem("srv-3", "Medication Help", Icons.Default.Medication, Color(0xFFFEE2E2), Color(0xFFEF4444)),
        ServiceVisualItem("srv-4", "Meals & Nutrition", Icons.Default.Restaurant, Color(0xFFFEF3C7), Color(0xFFD97706)),
        ServiceVisualItem("srv-5", "Physio Support", Icons.Default.FitnessCenter, Color(0xFFF3E8FF), Color(0xFF9333EA)),
        ServiceVisualItem("srv-6", "Doctor Consult", Icons.Default.LocalHospital, Color(0xFFE0F2FE), Color(0xFF0284C7)),
        ServiceVisualItem("srv-7", "Lab Samples", Icons.Default.Science, Color(0xFFEDE9FE), Color(0xFF7C3AED)),
        ServiceVisualItem("srv-8", "More Services", Icons.Default.MoreHoriz, Color(0xFFE0F7FA), Color(0xFF00897B))
    )

    // Match with backend services if available, or fall back to standard 8
    val displayItems: List<ServiceVisualItem> = if (services.isNotEmpty()) {
        services.filter { it.isActive }.take(8).mapIndexed { idx, srv ->
            val fallback = defaultServices.getOrElse(idx) { defaultServices[0] }
            val (icon, bgCol, tintCol) = mapNameToVisual(srv.name, fallback)
            ServiceVisualItem(
                id = srv.id,
                title = srv.name.split(" ").take(2).joinToString(" "),
                icon = icon,
                bgColor = bgCol,
                tintColor = tintCol
            )
        }
    } else {
        defaultServices
    }

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
                    imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                    contentDescription = null,
                    tint = Color(0xFF0D5C3A),
                    modifier = Modifier.size(13.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Grid of Services in 2 Rows of 4 Cards
        val rows = displayItems.chunked(4)

        rows.forEachIndexed { rowIndex, rowItems ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                rowItems.forEach { item ->
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = item.bgColor,
                        border = BorderStroke(1.dp, Color.White),
                        shadowElevation = 1.dp,
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(16.dp))
                            .clickable {
                                val srvMatch = services.firstOrNull { it.id == item.id || it.name.contains(item.title, ignoreCase = true) }
                                onSelectServiceToBook(srvMatch)
                            }
                    ) {
                        Column(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 12.dp, horizontal = 4.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Surface(
                                shape = CircleShape,
                                color = item.tintColor.copy(alpha = 0.15f),
                                modifier = Modifier.size(36.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = item.icon,
                                        contentDescription = item.title,
                                        tint = item.tintColor,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(6.dp))

                            Text(
                                text = item.title,
                                fontSize = 10.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF1F2937),
                                textAlign = TextAlign.Center,
                                maxLines = 2,
                                lineHeight = 12.sp
                            )
                        }
                    }
                }
            }

            if (rowIndex < rows.size - 1) {
                Spacer(modifier = Modifier.height(8.dp))
            }
        }
    }
}

private fun mapNameToVisual(name: String, fallback: ServiceVisualItem): Triple<ImageVector, Color, Color> {
    val n = name.lowercase()
    return when {
        n.contains("household") || n.contains("meal") || n.contains("cooking") -> 
            Triple(Icons.Default.Restaurant, Color(0xFFFEF3C7), Color(0xFFD97706))
        n.contains("bedside") || n.contains("mobility") || n.contains("wheelchair") -> 
            Triple(Icons.Default.AccessibilityNew, Color(0xFFE8F5E9), Color(0xFF16A34A))
        n.contains("medication") || n.contains("vitals") -> 
            Triple(Icons.Default.Medication, Color(0xFFFEE2E2), Color(0xFFEF4444))
        n.contains("companion") || n.contains("walking") -> 
            Triple(Icons.Default.Elderly, Color(0xFFF0FDF4), Color(0xFF047857))
        n.contains("physio") || n.contains("rehab") -> 
            Triple(Icons.Default.FitnessCenter, Color(0xFFF3E8FF), Color(0xFF9333EA))
        n.contains("live-in") || n.contains("critical") -> 
            Triple(Icons.Default.Favorite, Color(0xFFFFEBEE), Color(0xFFE11D48))
        n.contains("palliative") || n.contains("nursing") -> 
            Triple(Icons.Default.LocalHospital, Color(0xFFE0F2FE), Color(0xFF0284C7))
        else -> Triple(fallback.icon, fallback.bgColor, fallback.tintColor)
    }
}
