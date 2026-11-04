package com.thodu.app.ui.beneficiary.today

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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

@Composable
fun CareServicesCatalogCard(
    services: List<CareService>,
    onSelectServiceToBook: (CareService?) -> Unit
) {
    // Dynamically render the exact live care services updated in the Admin panel
    val activeServices = if (services.isNotEmpty()) {
        services.filter { it.isActive }
    } else {
        emptyList()
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

        // Grid of Services dynamically mapped from Admin database
        // Chunk into rows of 4 for a clean visual grid
        val rows = activeServices.chunked(4)

        rows.forEachIndexed { index, rowServices ->
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                rowServices.forEach { srv ->
                    val (icon, bgCol, tintCol, shortTitle) = getAdminServiceVisual(srv.name)
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = bgCol,
                        border = BorderStroke(1.dp, Color.White),
                        shadowElevation = 1.dp,
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(16.dp))
                            .clickable { onSelectServiceToBook(srv) }
                    ) {
                        Column(
                            modifier = Modifier.padding(vertical = 12.dp, horizontal = 4.dp),
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Icon(
                                imageVector = icon,
                                contentDescription = srv.name,
                                tint = tintCol,
                                modifier = Modifier.size(28.dp)
                            )

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = shortTitle,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Color(0xFF1E293B),
                                textAlign = TextAlign.Center,
                                lineHeight = 13.sp,
                                maxLines = 2,
                                minLines = 2
                            )

                            Spacer(modifier = Modifier.height(4.dp))

                            Text(
                                text = if (srv.pricingType == "FIXED_PRICE") "₹${(srv.pricePaise ?: 0) / 100}" else "Enquiry",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (srv.pricingType == "FIXED_PRICE") Color(0xFF0D5C3A) else Color(0xFF2563EB)
                            )
                        }
                    }
                }

                // Balance any unfilled slots in row
                if (rowServices.size < 4) {
                    repeat(4 - rowServices.size) {
                        Spacer(modifier = Modifier.weight(1f))
                    }
                }
            }

            if (index < rows.size - 1) {
                Spacer(modifier = Modifier.height(8.dp))
            }
        }
    }
}

// Maps admin service names directly to their icons and clean two-line labels
private data class ServiceVisualConfig(
    val icon: ImageVector,
    val bg: Color,
    val tint: Color,
    val shortTitle: String
)

private fun getAdminServiceVisual(serviceName: String): ServiceVisualConfig {
    val n = serviceName.lowercase()
    return when {
        n.contains("household") || n.contains("meal") -> ServiceVisualConfig(
            Icons.Default.Home,
            Color(0xFFF0FDF4),
            Color(0xFF15803D),
            "Household\n& Meal Prep"
        )
        n.contains("bedside") || n.contains("mobility") -> ServiceVisualConfig(
            Icons.Default.AccessibilityNew,
            Color(0xFFEFF6FF),
            Color(0xFF2563EB),
            "Bedside &\nMobility"
        )
        n.contains("medication") || n.contains("vitals") -> ServiceVisualConfig(
            Icons.Default.Medication,
            Color(0xFFFFF1F2),
            Color(0xFFE11D48),
            "Medication &\nVitals"
        )
        n.contains("companion") || n.contains("walking") -> ServiceVisualConfig(
            Icons.Default.Elderly,
            Color(0xFFFFFBEB),
            Color(0xFFD97706),
            "Companion\nCare"
        )
        n.contains("physio") || n.contains("rehab") -> ServiceVisualConfig(
            Icons.Default.FitnessCenter,
            Color(0xFFF3E8FF),
            Color(0xFF7C3AED),
            "Physio &\nRehab"
        )
        n.contains("live-in") || n.contains("critical") -> ServiceVisualConfig(
            Icons.Default.MedicalServices,
            Color(0xFFD1FAE5),
            Color(0xFF047857),
            "24/7 Live-in\nCritical Care"
        )
        n.contains("palliative") || n.contains("nursing") -> ServiceVisualConfig(
            Icons.Default.Healing,
            Color(0xFFE0F2FE),
            Color(0xFF0284C7),
            "Palliative\nHome Nursing"
        )
        else -> ServiceVisualConfig(
            Icons.Default.VolunteerActivism,
            Color(0xFFF0FDF4),
            Color(0xFF0D5C3A),
            serviceName.take(15)
        )
    }
}
