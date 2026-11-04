package com.thodu.app.ui.beneficiary

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.ui.theme.ThoduGreen

@Composable
fun BeneficiaryBottomNavBar(
    currentTab: BeneficiaryNavTab,
    onTabSelected: (BeneficiaryNavTab) -> Unit
) {
    NavigationBar(
        containerColor = Color.White,
        tonalElevation = 8.dp,
        modifier = Modifier
            .fillMaxWidth()
            .height(68.dp)
    ) {
        val tabs = listOf(
            BeneficiaryNavTab.TODAY,
            BeneficiaryNavTab.BOOKINGS,
            BeneficiaryNavTab.HEALTH,
            BeneficiaryNavTab.SUBSIDIES,
            BeneficiaryNavTab.PROFILE
        )

        tabs.forEach { tab ->
            val isSelected = currentTab == tab
            NavigationBarItem(
                selected = isSelected,
                onClick = { onTabSelected(tab) },
                icon = {
                    Icon(
                        imageVector = tab.icon,
                        contentDescription = tab.label,
                        modifier = Modifier.size(22.dp)
                    )
                },
                label = {
                    Text(
                        text = when (tab) {
                            BeneficiaryNavTab.TODAY -> "Today"
                            BeneficiaryNavTab.BOOKINGS -> "Bookings"
                            BeneficiaryNavTab.HEALTH -> "Health"
                            BeneficiaryNavTab.SUBSIDIES -> "Grants"
                            BeneficiaryNavTab.PROFILE -> "Profile"
                        },
                        fontSize = 11.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                    )
                },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = Color(0xFF0D5C3A),
                    selectedTextColor = Color(0xFF0D5C3A),
                    indicatorColor = Color(0xFFE8F5E9),
                    unselectedIconColor = Color(0xFF6B7280),
                    unselectedTextColor = Color(0xFF6B7280)
                )
            )
        }
    }
}
