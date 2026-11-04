package com.thodu.app.ui.beneficiary

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.NotificationsNone
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.data.model.Beneficiary
import com.thodu.app.ui.theme.ThoduGreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BeneficiaryTopBar(
    beneficiaries: List<Beneficiary>,
    selectedBeneficiary: Beneficiary?,
    onSelectBeneficiary: (Beneficiary) -> Unit,
    onLogoutClick: () -> Unit
) {
    var expanded by remember { mutableStateOf(false) }

    Surface(
        color = Color.White,
        shadowElevation = 2.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            // Active Loved One Dropdown Selector
            Box {
                Surface(
                    shape = RoundedCornerShape(20.dp),
                    color = Color(0xFFF0FDF4),
                    border = BorderStroke(1.dp, Color(0xFFBBF7D0)),
                    modifier = Modifier.clickable { expanded = true }
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = CircleShape,
                            color = ThoduGreen,
                            modifier = Modifier.size(24.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(
                                    text = selectedBeneficiary?.fullName?.take(1) ?: "S",
                                    color = Color.White,
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = "Active Loved One",
                                fontSize = 10.sp,
                                color = Color(0xFF15803D),
                                fontWeight = FontWeight.Medium
                            )
                            Text(
                                text = selectedBeneficiary?.fullName ?: "Select Loved One",
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF143627)
                            )
                        }
                        Spacer(modifier = Modifier.width(4.dp))
                        Icon(
                            imageVector = Icons.Default.ArrowDropDown,
                            contentDescription = "Select",
                            tint = ThoduGreen
                        )
                    }
                }

                DropdownMenu(
                    expanded = expanded,
                    onDismissRequest = { expanded = false },
                    modifier = Modifier.background(Color.White)
                ) {
                    beneficiaries.forEach { ben ->
                        DropdownMenuItem(
                            text = {
                                Column {
                                    Text(
                                        text = "${ben.fullName} (${ben.relationship})",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 13.sp
                                    )
                                    Text(
                                        text = "Ref: ${ben.refNumber} • ${ben.age} yrs",
                                        fontSize = 11.sp,
                                        color = Color.Gray
                                    )
                                }
                            },
                            onClick = {
                                onSelectBeneficiary(ben)
                                expanded = false
                            }
                        )
                    }
                }
            }

            // Top Right Actions: Notification Bell & Logout
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(onClick = {}) {
                    Icon(
                        imageVector = Icons.Default.NotificationsNone,
                        contentDescription = "Notifications",
                        tint = Color(0xFF4B5563)
                    )
                }

                IconButton(onClick = onLogoutClick) {
                    Surface(
                        shape = CircleShape,
                        color = Color(0xFFF3F4F6),
                        modifier = Modifier.size(34.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = Icons.Default.Person,
                                contentDescription = "Profile & Logout",
                                tint = Color(0xFF374151),
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}

