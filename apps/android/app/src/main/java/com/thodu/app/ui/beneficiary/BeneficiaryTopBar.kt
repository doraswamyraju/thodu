package com.thodu.app.ui.beneficiary

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Logout
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowDropDown
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material.icons.filled.NotificationsNone
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.R
import com.thodu.app.data.model.AppUser
import com.thodu.app.data.model.Beneficiary
import com.thodu.app.ui.theme.ThoduGreen

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BeneficiaryTopBar(
    beneficiaries: List<Beneficiary>,
    selectedBeneficiary: Beneficiary?,
    currentUser: AppUser? = null,
    onSelectBeneficiary: (Beneficiary) -> Unit,
    onMenuClick: () -> Unit,
    onLogoClick: () -> Unit,
    onLogoutClick: () -> Unit,
    onNotificationClick: () -> Unit = {},
    onProfileClick: () -> Unit = {},
    onAddNewLovedOneClick: () -> Unit = {}
) {
    var expanded by remember { mutableStateOf(false) }
    var showLogoutDialog by remember { mutableStateOf(false) }

    Surface(
        color = Color.White,
        shadowElevation = 2.dp,
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // 1. LEFT: Hamburger Menu Icon + Clickable Logo that navigates Home
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.weight(1f, fill = false)
                ) {
                    IconButton(
                        onClick = onMenuClick,
                        modifier = Modifier.size(38.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Menu,
                            contentDescription = "Open Sidebar Menu",
                            tint = Color(0xFF143627),
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(2.dp))

                    // Official Thodu Horizontal Brand Logo -> Clicking takes user to Home tab
                    Image(
                        painter = painterResource(id = R.drawable.thodu_topbar_logo),
                        contentDescription = "Thodu Elder Care Services",
                        modifier = Modifier
                            .height(32.dp)
                            .wrapContentWidth()
                            .clip(RoundedCornerShape(6.dp))
                            .clickable(onClick = onLogoClick),
                        contentScale = ContentScale.Fit
                    )
                }

                // 2. CENTER: Active Loved One Switcher Dropdown Pill
                Box(
                    modifier = Modifier
                        .padding(horizontal = 4.dp)
                        .weight(1.3f, fill = false)
                ) {
                    Surface(
                        shape = RoundedCornerShape(18.dp),
                        color = Color(0xFFF0FDF4),
                        border = BorderStroke(1.dp, Color(0xFFBBF7D0)),
                        modifier = Modifier
                            .clip(RoundedCornerShape(18.dp))
                            .clickable { expanded = true }
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 5.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                shape = CircleShape,
                                color = Color(0xFF0D5C3A),
                                modifier = Modifier.size(18.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Text(
                                        text = selectedBeneficiary?.fullName?.take(1) ?: "S",
                                        color = Color.White,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }

                            Spacer(modifier = Modifier.width(5.dp))

                            Text(
                                text = selectedBeneficiary?.fullName?.split(" ")?.first() ?: "Saraswathi",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF143627),
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis
                            )

                            Icon(
                                imageVector = Icons.Default.ArrowDropDown,
                                contentDescription = "Switch loved one",
                                tint = Color(0xFF0D5C3A),
                                modifier = Modifier.size(18.dp)
                            )
                        }
                    }

                    // Dropdown Options
                    DropdownMenu(
                        expanded = expanded,
                        onDismissRequest = { expanded = false },
                        modifier = Modifier.background(Color.White)
                    ) {
                        beneficiaries.forEach { ben ->
                            val isSelected = ben.id == selectedBeneficiary?.id
                            DropdownMenuItem(
                                text = {
                                    Column {
                                        Text(
                                            text = "${ben.fullName} (${ben.relationship})",
                                            fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                            fontSize = 13.sp,
                                            color = if (isSelected) Color(0xFF0D5C3A) else Color(0xFF1F2937)
                                        )
                                        Text(
                                            text = "Ref: ${ben.refNumber} • ${ben.age} yrs • ${ben.category}",
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

                        HorizontalDivider(modifier = Modifier.padding(vertical = 4.dp), color = Color(0xFFE5E7EB))

                        // + Add New Elder / Loved One Option
                        DropdownMenuItem(
                            text = {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(
                                        imageVector = Icons.Default.Add,
                                        contentDescription = null,
                                        tint = Color(0xFF0D5C3A),
                                        modifier = Modifier.size(16.dp)
                                    )
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text(
                                        text = "Add Elder / Family Member",
                                        fontWeight = FontWeight.Bold,
                                        fontSize = 12.5.sp,
                                        color = Color(0xFF0D5C3A)
                                    )
                                }
                            },
                            onClick = {
                                expanded = false
                                onAddNewLovedOneClick()
                            }
                        )
                    }
                }

                // 3. RIGHT: Profile Avatar Icon, Notification Bell & Logout Icon
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.End
                ) {
                    // Profile Icon
                    Surface(
                        shape = CircleShape,
                        color = Color(0xFFE8F5E9),
                        border = BorderStroke(1.5.dp, Color(0xFF0D5C3A)),
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .clickable(onClick = onProfileClick)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = (currentUser?.name?.take(1) ?: selectedBeneficiary?.fullName?.take(1) ?: "U").uppercase(),
                                fontSize = 13.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = Color(0xFF0D5C3A)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(4.dp))

                    // Notification Bell Icon
                    IconButton(
                        onClick = onNotificationClick,
                        modifier = Modifier.size(34.dp)
                    ) {
                        Box(contentAlignment = Alignment.TopEnd) {
                            Icon(
                                imageVector = Icons.Default.NotificationsNone,
                                contentDescription = "Notifications",
                                tint = Color(0xFF374151),
                                modifier = Modifier.size(20.dp)
                            )
                            // Notification dot
                            Surface(
                                shape = CircleShape,
                                color = Color(0xFFDC2626),
                                modifier = Modifier
                                    .size(7.dp)
                                    .offset(x = (-1).dp, y = 1.dp)
                            ) {}
                        }
                    }

                    Spacer(modifier = Modifier.width(2.dp))

                    // Logout Icon
                    IconButton(
                        onClick = { showLogoutDialog = true },
                        modifier = Modifier.size(34.dp)
                    ) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Filled.Logout,
                            contentDescription = "Log out",
                            tint = Color(0xFFDC2626),
                            modifier = Modifier.size(19.dp)
                        )
                    }
                }
            }
        }
    }

    // Confirmation Logout Dialog
    if (showLogoutDialog) {
        AlertDialog(
            onDismissRequest = { showLogoutDialog = false },
            title = {
                Text(
                    text = "Confirm Logout",
                    fontWeight = FontWeight.Bold,
                    fontSize = 17.sp,
                    color = Color(0xFF111827)
                )
            },
            text = {
                Text(
                    text = "Are you sure you want to log out of Thodu Family Portal?",
                    fontSize = 13.sp,
                    color = Color(0xFF4B5563)
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        showLogoutDialog = false
                        onLogoutClick()
                    },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFFDC2626),
                        contentColor = Color.White
                    )
                ) {
                    Text("Logout", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showLogoutDialog = false }) {
                    Text("Cancel", color = Color(0xFF4B5563))
                }
            },
            containerColor = Color.White,
            shape = RoundedCornerShape(16.dp)
        )
    }
}
