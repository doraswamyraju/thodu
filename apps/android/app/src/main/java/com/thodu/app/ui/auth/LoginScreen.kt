package com.thodu.app.ui.auth

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.data.api.ApiClient
import com.thodu.app.data.model.AppUser
import com.thodu.app.data.model.OAuthLoginRequest
import com.thodu.app.ui.theme.ThoduGreen
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(
    onLoginSuccess: (AppUser) -> Unit = {}
) {
    val coroutineScope = rememberCoroutineScope()
    var selectedRole by remember { mutableStateOf("BENEFICIARY") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var existingUsers by remember { mutableStateOf<List<AppUser>>(emptyList()) }
    var showUserPicker by remember { mutableStateOf(false) }

    // Fetch existing live database users for convenience
    LaunchedEffect(Unit) {
        try {
            val response = ApiClient.apiService.getUsers()
            if (response.success) {
                existingUsers = response.users
            }
        } catch (_: Exception) {
            // Silently handled
        }
    }

    val roles = listOf(
        RoleOption("BENEFICIARY", "Family / Elder", Icons.Default.Favorite, "Manage loved one care & SOS"),
        RoleOption("CAREGIVER", "Salaried Caregiver", Icons.Default.MedicalServices, "Duty rosters, vitals & care tasks"),
        RoleOption("FREELANCER", "Freelance Caregiver", Icons.Default.WorkHistory, "Live gig radar & wallet payouts"),
        RoleOption("ADMIN", "Operations Admin", Icons.Default.AdminPanelSettings, "Fleet dispatch & monitoring")
    )

    fun handleGoogleLogin(emailOverride: String? = null, nameOverride: String? = null) {
        isLoading = true
        errorMessage = null
        coroutineScope.launch {
            try {
                val email = emailOverride ?: when (selectedRole) {
                    "BENEFICIARY" -> "anita.sharma@example.com"
                    "CAREGIVER" -> "anitha.care@example.com"
                    "FREELANCER" -> "suresh.kumar@example.com"
                    else -> "raju@thodu.sriddha.com"
                }
                val name = nameOverride ?: when (selectedRole) {
                    "BENEFICIARY" -> "Anita Sharma"
                    "CAREGIVER" -> "Anitha"
                    "FREELANCER" -> "Suresh Kumar"
                    else -> "Raju Kumar"
                }

                val req = OAuthLoginRequest(
                    provider = "GOOGLE",
                    email = email,
                    name = name,
                    role = selectedRole,
                    idToken = "android_g_token_${System.currentTimeMillis()}"
                )

                val response = ApiClient.apiService.loginWithOAuth(req)
                if (response.success && response.user != null) {
                    onLoginSuccess(response.user)
                } else {
                    errorMessage = response.message ?: "Authentication failed on server."
                }
            } catch (e: Exception) {
                errorMessage = "Network error: ${e.localizedMessage ?: "Unable to connect to server"}"
            } finally {
                isLoading = false
            }
        }
    }

    Scaffold(
        containerColor = Color(0xFFF8FAF9)
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(20.dp))

            // Brand Header
            Surface(
                shape = CircleShape,
                color = ThoduGreen.copy(alpha = 0.12f),
                modifier = Modifier.size(76.dp)
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = Icons.Default.VolunteerActivism,
                        contentDescription = "Thodu Care",
                        tint = ThoduGreen,
                        modifier = Modifier.size(42.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Thodu",
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF143627)
            )
            Text(
                text = "Elder & Assisted Care Platform",
                fontSize = 14.sp,
                color = Color(0xFF4A6B5D),
                fontWeight = FontWeight.Medium
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Step 1: Select Role
            Text(
                text = "Select your access profile",
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF6B7280),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(12.dp))

            roles.forEach { role ->
                val isSelected = selectedRole == role.id
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = if (isSelected) Color(0xFFE8F5E9) else Color.White,
                    border = BorderStroke(
                        width = if (isSelected) 2.dp else 1.dp,
                        color = if (isSelected) ThoduGreen else Color(0xFFE5E7EB)
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp)
                        .clickable { selectedRole = role.id }
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (isSelected) ThoduGreen else Color(0xFFF3F4F6),
                            modifier = Modifier.size(40.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Icon(
                                    imageVector = role.icon,
                                    contentDescription = role.title,
                                    tint = if (isSelected) Color.White else Color(0xFF4B5563),
                                    modifier = Modifier.size(22.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.width(14.dp))

                        Column(modifier = Modifier.weight(1f)) {
                            Text(
                                text = role.title,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = if (isSelected) Color(0xFF143627) else Color(0xFF1F2937)
                            )
                            Text(
                                text = role.subtitle,
                                fontSize = 12.sp,
                                color = Color(0xFF6B7280)
                            )
                        }

                        if (isSelected) {
                            Icon(
                                imageVector = Icons.Default.CheckCircle,
                                contentDescription = "Selected",
                                tint = ThoduGreen,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // Error Display
            AnimatedVisibility(visible = errorMessage != null) {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = Color(0xFFFEE2E2),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(bottom = 16.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.ErrorOutline,
                            contentDescription = "Error",
                            tint = Color(0xFFDC2626),
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = errorMessage ?: "",
                            fontSize = 13.sp,
                            color = Color(0xFF991B1B)
                        )
                    }
                }
            }

            // Google Sign In Button (Android Native)
            GoogleSignInButton(
                isLoading = isLoading,
                onClick = { handleGoogleLogin() }
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Quick Account Switcher (from live DB)
            if (existingUsers.isNotEmpty()) {
                TextButton(
                    onClick = { showUserPicker = !showUserPicker },
                    colors = ButtonDefaults.textButtonColors(contentColor = ThoduGreen)
                ) {
                    Icon(
                        imageVector = if (showUserPicker) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = if (showUserPicker) "Hide registered accounts" else "Select registered account from database",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )
                }

                AnimatedVisibility(visible = showUserPicker) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 8.dp)
                    ) {
                        existingUsers.forEach { dbUser ->
                            Surface(
                                shape = RoundedCornerShape(10.dp),
                                color = Color.White,
                                border = BorderStroke(1.dp, Color(0xFFE5E7EB)),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                                    .clickable {
                                        selectedRole = dbUser.role
                                        handleGoogleLogin(dbUser.email, dbUser.name)
                                    }
                            ) {
                                Row(
                                    modifier = Modifier.padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Surface(
                                        shape = CircleShape,
                                        color = Color(0xFFE0E7FF),
                                        modifier = Modifier.size(36.dp)
                                    ) {
                                        Box(contentAlignment = Alignment.Center) {
                                            Text(
                                                text = dbUser.name.take(1).uppercase(),
                                                fontWeight = FontWeight.Bold,
                                                color = Color(0xFF3730A3)
                                            )
                                        }
                                    }
                                    Spacer(modifier = Modifier.width(12.dp))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = dbUser.name,
                                            fontWeight = FontWeight.Bold,
                                            fontSize = 14.sp,
                                            color = Color(0xFF111827)
                                        )
                                        Text(
                                            text = "${dbUser.email} • ${dbUser.role}",
                                            fontSize = 11.sp,
                                            color = Color(0xFF6B7280)
                                        )
                                    }
                                    Icon(
                                        imageVector = Icons.Default.Login,
                                        contentDescription = "Sign in",
                                        tint = ThoduGreen,
                                        modifier = Modifier.size(18.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(30.dp))

            // Trust Subsidies Partner Note
            Surface(
                shape = RoundedCornerShape(10.dp),
                color = Color(0xFFF1F5F9),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.Shield,
                        contentDescription = "Partner Notice",
                        tint = Color(0xFF475569),
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "Subsidies & grants for eligible families sponsored by Sri Divyang Seva Kendram Trust.",
                        fontSize = 11.sp,
                        color = Color(0xFF475569),
                        lineHeight = 15.sp
                    )
                }
            }

            Spacer(modifier = Modifier.height(20.dp))
        }
    }
}

private data class RoleOption(
    val id: String,
    val title: String,
    val icon: androidx.compose.ui.graphics.vector.ImageVector,
    val subtitle: String
)

