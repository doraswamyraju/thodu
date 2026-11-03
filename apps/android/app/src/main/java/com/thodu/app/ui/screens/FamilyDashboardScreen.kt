package com.thodu.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun FamilyDashboardScreen(
    onNavigateToServices: () -> Unit,
    onNavigateToBookings: () -> Unit,
    onTriggerSos: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Good Morning,",
                            fontSize = 12.sp,
                            color = ThoduTextMuted
                        )
                        Text(
                            text = "Anita Sharma",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = ThoduForestGreen
                        )
                    }
                },
                actions = {
                    Button(
                        onClick = onTriggerSos,
                        colors = ButtonDefaults.buttonColors(containerColor = ThoduDangerRed),
                        shape = CircleShape,
                        contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                    ) {
                        Icon(Icons.Default.Warning, contentDescription = "SOS", modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("SOS", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = ThoduWarmCream)
            )
        },
        containerColor = ThoduWarmCream
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(horizontal = 16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Hero Banner
            item {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = ThoduForestGreen)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Text(
                            text = "Better Care.",
                            color = Color.White,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = "Brighter Tomorrows.",
                            color = ThoduAccentYellow,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = "Sri Divyang Seva Kendram Trust is always by your side.",
                            color = Color.White.copy(alpha = 0.9f),
                            fontSize = 12.sp
                        )
                    }
                }
            }

            // Quick Metrics Row
            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    MetricCard(title = "Beneficiaries", count = "2", color = ThoduForestGreen, modifier = Modifier.weight(1f))
                    MetricCard(title = "Upcoming Visits", count = "3", color = ThoduAccentYellow, modifier = Modifier.weight(1f))
                    MetricCard(title = "Active Request", count = "1", color = ThoduHighlightRose, modifier = Modifier.weight(1f))
                }
            }

            // Quick Actions Header
            item {
                Text(
                    text = "Quick Actions",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = ThoduForestGreen
                )
            }

            // Quick Action Grid
            item {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        ActionCard(
                            label = "Book Service",
                            icon = Icons.Default.Home,
                            modifier = Modifier.weight(1f),
                            onClick = onNavigateToServices
                        )
                        ActionCard(
                            label = "My Bookings",
                            icon = Icons.Default.DateRange,
                            modifier = Modifier.weight(1f),
                            onClick = onNavigateToBookings
                        )
                        ActionCard(
                            label = "Care Team",
                            icon = Icons.Default.People,
                            modifier = Modifier.weight(1f),
                            onClick = {}
                        )
                    }
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        ActionCard(label = "Payments", icon = Icons.Default.Receipt, modifier = Modifier.weight(1f), onClick = {})
                        ActionCard(label = "Support", icon = Icons.Default.Help, modifier = Modifier.weight(1f), onClick = {})
                        ActionCard(
                            label = "SOS Alert",
                            icon = Icons.Default.Warning,
                            modifier = Modifier.weight(1f),
                            tint = ThoduDangerRed,
                            onClick = onTriggerSos
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun MetricCard(title: String, count: String, color: Color, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = ThoduSurfaceWhite)
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = count, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = color)
            Spacer(modifier = Modifier.height(2.dp))
            Text(text = title, fontSize = 11.sp, color = ThoduTextMuted)
        }
    }
}

@Composable
fun ActionCard(
    label: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    modifier: Modifier = Modifier,
    tint: Color = ThoduForestGreen,
    onClick: () -> Unit
) {
    Card(
        modifier = modifier.clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = ThoduSurfaceWhite)
    ) {
        Column(
            modifier = Modifier.padding(vertical = 14.dp, horizontal = 8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(icon, contentDescription = label, tint = tint, modifier = Modifier.size(24.dp))
            Spacer(modifier = Modifier.height(6.dp))
            Text(text = label, fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = ThoduTextPrimary)
        }
    }
}

