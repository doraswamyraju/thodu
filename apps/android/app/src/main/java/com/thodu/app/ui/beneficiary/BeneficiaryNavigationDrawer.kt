package com.thodu.app.ui.beneficiary

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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.data.model.AppUser
import com.thodu.app.data.model.Beneficiary
import com.thodu.app.ui.theme.ThoduGreen

enum class BeneficiaryNavTab(val label: String, val icon: ImageVector) {
    TODAY("Today's Care", Icons.Default.Favorite),
    BOOKINGS("Bookings", Icons.Default.EventNote),
    HEALTH("Health Dossier", Icons.Default.HealthAndSafety),
    SUBSIDIES("Grants & Subsidies", Icons.Default.Shield),
    PROFILE("Profile", Icons.Default.Person)
}

@Composable
fun BeneficiaryNavigationDrawer(
    currentUser: AppUser,
    beneficiaries: List<Beneficiary>,
    selectedBeneficiary: Beneficiary?,
    currentTab: BeneficiaryNavTab,
    onTabSelected: (BeneficiaryNavTab) -> Unit,
    onSelectBeneficiary: (Beneficiary) -> Unit,
    onLogoutClick: () -> Unit,
    onCloseDrawer: () -> Unit
) {
    ModalDrawerSheet(
        drawerContainerColor = Color(0xFF073D26), // Deep Forest Green matching web sidebar
        drawerContentColor = Color.White,
        modifier = Modifier.width(310.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .padding(vertical = 16.dp)
        ) {
            // Brand Logo & Trust Subtitle Header
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 8.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        shape = CircleShape,
                        color = Color.White,
                        modifier = Modifier.size(42.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = Icons.Default.VolunteerActivism,
                                contentDescription = null,
                                tint = ThoduGreen,
                                modifier = Modifier.size(24.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            text = "Thodu",
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = "ELDER CARE SERVICES",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFF9B233), // Golden amber
                            letterSpacing = 1.2.sp
                        )
                    }
                }

                Text(
                    text = "Sri Divyang Seva Kendram Trust",
                    fontSize = 11.sp,
                    color = Color(0xFF86EFAC),
                    modifier = Modifier.padding(top = 4.dp)
                )

                Spacer(modifier = Modifier.height(18.dp))

                // Active Loved One Switcher in Drawer
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Color(0xFF0B5D3B).copy(alpha = 0.6f),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(
                            text = "ACTIVE LOVED ONE",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF86EFAC)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Surface(
                                shape = CircleShape,
                                color = Color.White,
                                modifier = Modifier.size(26.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text(
                                        text = selectedBeneficiary?.fullName?.take(1) ?: "S",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp,
                                        color = ThoduGreen
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "${selectedBeneficiary?.fullName ?: "Saraswathi Garu"} (${selectedBeneficiary?.relationship ?: "Mother"})",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(14.dp))
            HorizontalDivider(color = Color(0xFF0B5D3B), thickness = 1.dp)
            Spacer(modifier = Modifier.height(14.dp))

            // Navigation Links
            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(horizontal = 12.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                BeneficiaryNavTab.values().forEach { tab ->
                    val isSelected = currentTab == tab
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = if (isSelected) Color(0xFF0B5D3B) else Color.Transparent,
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable {
                                onTabSelected(tab)
                                onCloseDrawer()
                            }
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 12.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = tab.icon,
                                contentDescription = tab.label,
                                tint = if (isSelected) Color(0xFFF9B233) else Color(0xFFE5E7EB),
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(14.dp))
                            Text(
                                text = tab.label,
                                fontSize = 14.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) Color.White else Color(0xFFE5E7EB)
                            )
                        }
                    }
                }
            }

            // Bottom Guardian Card & Logout
            Surface(
                color = Color(0xFF042617),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 14.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Surface(
                            shape = CircleShape,
                            color = Color(0xFF15803D),
                            modifier = Modifier.size(38.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(
                                    text = currentUser.name.take(2).uppercase(),
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = Color.White
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = currentUser.name,
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                text = "Family Guardian",
                                fontSize = 11.sp,
                                color = Color(0xFF86EFAC)
                            )
                        }
                    }

                    IconButton(onClick = onLogoutClick) {
                        Icon(
                            imageVector = Icons.Default.Logout,
                            contentDescription = "Log out",
                            tint = Color(0xFFFCA5A5)
                        )
                    }
                }
            }
        }
    }
}
