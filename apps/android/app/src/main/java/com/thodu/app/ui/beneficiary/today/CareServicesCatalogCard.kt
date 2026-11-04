package com.thodu.app.ui.beneficiary.today

import androidx.compose.foundation.BorderStroke
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.data.model.CareService
import com.thodu.app.ui.theme.ThoduGreen

@Composable
fun CareServicesCatalogCard(
    services: List<CareService>,
    onSelectServiceToBook: (CareService) -> Unit
) {
    Surface(
        shape = RoundedCornerShape(16.dp),
        color = Color.White,
        border = BorderStroke(1.dp, Color(0xFFE5E7EB)),
        shadowElevation = 1.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column {
                    Text(
                        text = "Our Care Services",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF111827)
                    )
                    Text(
                        text = "Select any service below to book immediate or scheduled care",
                        fontSize = 11.sp,
                        color = Color(0xFF6B7280)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // Service Icons Grid (4 Services)
            val displayServices = services.take(4)

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                displayServices.forEach { srv ->
                    val (icon, bgCol, tintCol) = getServiceIconConfig(srv.name)
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color(0xFFF9FAFB),
                        border = BorderStroke(1.dp, Color(0xFFE5E7EB)),
                        modifier = Modifier
                            .weight(1f)
                            .clickable { onSelectServiceToBook(srv) }
                    ) {
                        Column(
                            modifier = Modifier.padding(8.dp),
                            horizontalAlignment = Alignment.CenterHorizontally
                        ) {
                            Surface(
                                shape = CircleShape,
                                color = bgCol,
                                modifier = Modifier.size(42.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = icon,
                                        contentDescription = srv.name,
                                        tint = tintCol,
                                        modifier = Modifier.size(22.dp)
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = srv.name,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF1F2937),
                                textAlign = TextAlign.Center,
                                maxLines = 2,
                                minLines = 2,
                                lineHeight = 12.sp
                            )

                            Spacer(modifier = Modifier.height(4.dp))

                            Text(
                                text = if (srv.pricingType == "FIXED_PRICE") "₹${(srv.pricePaise ?: 0)/100}" else "Enquiry",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF0D5C3A)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            // "Book a Service" CTA Button
            Button(
                onClick = {
                    services.firstOrNull()?.let { onSelectServiceToBook(it) }
                },
                colors = ButtonDefaults.buttonColors(
                    containerColor = Color(0xFF0D5C3A),
                    contentColor = Color.White
                ),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(44.dp)
            ) {
                Text(
                    text = "Book a Service →",
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp
                )
            }
        }
    }
}

private fun getServiceIconConfig(serviceName: String): Triple<ImageVector, Color, Color> {
    return when {
        serviceName.contains("Household", ignoreCase = true) -> Triple(Icons.Default.Home, Color(0xFFDCFCE7), Color(0xFF15803D))
        serviceName.contains("Bedside", ignoreCase = true) || serviceName.contains("Mobility", ignoreCase = true) -> Triple(Icons.Default.AccessibilityNew, Color(0xFFEFF6FF), Color(0xFF2563EB))
        serviceName.contains("Medication", ignoreCase = true) || serviceName.contains("Clinical", ignoreCase = true) -> Triple(Icons.Default.Medication, Color(0xFFFEF3C7), Color(0xFFD97706))
        serviceName.contains("Physio", ignoreCase = true) -> Triple(Icons.Default.FitnessCenter, Color(0xFFF3E8FF), Color(0xFF9333EA))
        else -> Triple(Icons.Default.VolunteerActivism, Color(0xFFFCE7F3), Color(0xFFDB2777))
    }
}

