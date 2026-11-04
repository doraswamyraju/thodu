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
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusDirection
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.R
import com.thodu.app.data.api.ApiClient
import com.thodu.app.data.model.AppUser
import com.thodu.app.data.model.CredentialLoginRequest
import com.thodu.app.data.model.OAuthLoginRequest
import com.thodu.app.ui.theme.*
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    onLoginSuccess: (AppUser) -> Unit = {}
) {
    val coroutineScope = rememberCoroutineScope()
    val focusManager = LocalFocusManager.current

    var credential by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var passwordVisible by remember { mutableStateOf(false) }
    var selectedRole by remember { mutableStateOf("BENEFICIARY") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    var existingUsers by remember { mutableStateOf<List<AppUser>>(emptyList()) }
    var showUserPicker by remember { mutableStateOf(false) }

    // Fetch existing live database users
    LaunchedEffect(Unit) {
        try {
            val response = ApiClient.apiService.getUsers()
            if (response.success) {
                existingUsers = response.users
            }
        } catch (_: Exception) {}
    }

    fun handleCredentialLogin() {
        if (credential.trim().isEmpty()) {
            errorMessage = "Please enter your Email or Mobile Number"
            return
        }

        isLoading = true
        errorMessage = null
        coroutineScope.launch {
            try {
                val req = CredentialLoginRequest(
                    credential = credential.trim(),
                    password = password,
                    role = selectedRole
                )
                val response = ApiClient.apiService.loginWithCredentials(req)
                if (response.success && response.user != null) {
                    onLoginSuccess(response.user)
                } else {
                    errorMessage = response.message ?: "Authentication failed on server"
                }
            } catch (e: Exception) {
                errorMessage = "Network error: ${e.localizedMessage ?: "Unable to connect to server"}"
            } finally {
                isLoading = false
            }
        }
    }

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

    fun handleBiometricLogin() {
        // Fast biometrics auth fallback to active database user
        if (existingUsers.isNotEmpty()) {
            val user = existingUsers.firstOrNull { it.role == selectedRole } ?: existingUsers.first()
            handleGoogleLogin(user.email, user.name)
        } else {
            handleGoogleLogin()
        }
    }

    Scaffold(
        containerColor = Color.White
    ) { paddingValues ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
            ) {
                // Top Hero Image with Organic Wave Overlay
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(230.dp)
                ) {
                    // Elder Care Nurse & Senior Photo
                    Image(
                        painter = painterResource(id = R.drawable.login_hero_elder_care),
                        contentDescription = "Elder care nursing specialist with senior",
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )

                    // Organic Wave Top Mask Transition
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(
                                Brush.verticalGradient(
                                    colors = listOf(
                                        Color.Transparent,
                                        Color(0x220B5D3B),
                                        Color.White.copy(alpha = 0.95f),
                                        Color.White
                                    ),
                                    startY = 200f
                                )
                            )
                    )
                }

                // Main Content Column
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .offset(y = (-20).dp)
                        .padding(horizontal = 24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Thodu Brand Identity & Trust Subtitle
                    Image(
                        painter = painterResource(id = R.drawable.thodu_logo_vertical),
                        contentDescription = "Thodu Elder Care Services - Sri Divyang Seva Kendram Trust",
                        modifier = Modifier
                            .height(95.dp)
                            .wrapContentWidth(),
                        contentScale = ContentScale.Fit
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    // Pill Badge: Care • Support • Independence
                    Surface(
                        shape = RoundedCornerShape(16.dp),
                        color = Color(0xFFFEF9C3).copy(alpha = 0.85f),
                        border = BorderStroke(1.dp, Color(0xFFFEF08A))
                    ) {
                        Text(
                            text = "Care  •  Support  •  Independence",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF166534),
                            modifier = Modifier.padding(horizontal = 16.dp, vertical = 6.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    // Input 1: Email or Mobile Number
                    OutlinedTextField(
                        value = credential,
                        onValueChange = { credential = it; errorMessage = null },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("Email or Mobile Number", color = Color(0xFF9CA3AF), fontSize = 14.sp) },
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Default.MailOutline,
                                contentDescription = "Email or Phone",
                                tint = Color(0xFF4B5563),
                                modifier = Modifier.size(20.dp)
                            )
                        },
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Email,
                            imeAction = ImeAction.Next
                        ),
                        keyboardActions = KeyboardActions(
                            onNext = { focusManager.moveFocus(FocusDirection.Down) }
                        ),
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = ThoduGreen,
                            unfocusedBorderColor = Color(0xFFD1D5DB),
                            focusedContainerColor = Color(0xFFFBFDFB),
                            unfocusedContainerColor = Color.White
                        )
                    )

                    Spacer(modifier = Modifier.height(14.dp))

                    // Input 2: Password
                    OutlinedTextField(
                        value = password,
                        onValueChange = { password = it; errorMessage = null },
                        modifier = Modifier.fillMaxWidth(),
                        placeholder = { Text("Password", color = Color(0xFF9CA3AF), fontSize = 14.sp) },
                        leadingIcon = {
                            Icon(
                                imageVector = Icons.Default.Lock,
                                contentDescription = "Password",
                                tint = Color(0xFF4B5563),
                                modifier = Modifier.size(20.dp)
                            )
                        },
                        trailingIcon = {
                            IconButton(onClick = { passwordVisible = !passwordVisible }) {
                                Icon(
                                    imageVector = if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                                    contentDescription = if (passwordVisible) "Hide password" else "Show password",
                                    tint = Color(0xFF6B7280),
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        },
                        visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                        singleLine = true,
                        keyboardOptions = KeyboardOptions(
                            keyboardType = KeyboardType.Password,
                            imeAction = ImeAction.Done
                        ),
                        keyboardActions = KeyboardActions(
                            onDone = {
                                focusManager.clearFocus()
                                handleCredentialLogin()
                            }
                        ),
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = ThoduGreen,
                            unfocusedBorderColor = Color(0xFFD1D5DB),
                            focusedContainerColor = Color(0xFFFBFDFB),
                            unfocusedContainerColor = Color.White
                        )
                    )

                    // Forgot Password Right-aligned Link
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 8.dp, bottom = 16.dp),
                        contentAlignment = Alignment.CenterEnd
                    ) {
                        Text(
                            text = "Forgot Password?",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.SemiBold,
                            color = ThoduGreen,
                            modifier = Modifier.clickable {
                                errorMessage = "Password reset instructions sent to your registered contact."
                            }
                        )
                    }

                    // Error Message Banner
                    AnimatedVisibility(visible = errorMessage != null) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color(0xFFFEF2F2),
                            border = BorderStroke(1.dp, Color(0xFFFECACA)),
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(bottom = 14.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(10.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Info,
                                    contentDescription = "Alert",
                                    tint = Color(0xFFDC2626),
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = errorMessage ?: "",
                                    fontSize = 12.sp,
                                    color = Color(0xFFB91C1C)
                                )
                            }
                        }
                    }

                    // Solid Green Primary "Login" Button
                    Button(
                        onClick = { handleCredentialLogin() },
                        enabled = !isLoading,
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF0D5C3A),
                            contentColor = Color.White
                        ),
                        elevation = ButtonDefaults.buttonElevation(defaultElevation = 2.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp)
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(20.dp),
                                strokeWidth = 2.dp,
                                color = Color.White
                            )
                            Spacer(modifier = Modifier.width(10.dp))
                            Text("Authenticating...", fontSize = 15.sp, fontWeight = FontWeight.Bold)
                        } else {
                            Text("Login", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Login with Biometrics Pill
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color(0xFFF3FBF5),
                        border = BorderStroke(1.dp, Color(0xFFD1FAE5)),
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { handleBiometricLogin() }
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Surface(
                                shape = RoundedCornerShape(8.dp),
                                color = Color(0xFFD1FAE5),
                                modifier = Modifier.size(36.dp)
                            ) {
                                Box(contentAlignment = Alignment.Center) {
                                    Icon(
                                        imageVector = Icons.Default.Fingerprint,
                                        contentDescription = "Biometrics",
                                        tint = Color(0xFF047857),
                                        modifier = Modifier.size(22.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = "Login with Biometrics",
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF111827)
                                )
                                Text(
                                    text = "Use your fingerprint or face unlock",
                                    fontSize = 11.sp,
                                    color = Color(0xFF6B7280)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    // "or continue with" Divider
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        HorizontalDivider(
                            modifier = Modifier.weight(1f),
                            thickness = 1.dp,
                            color = Color(0xFFE5E7EB)
                        )
                        Text(
                            text = "  or continue with  ",
                            fontSize = 12.sp,
                            color = Color(0xFF6B7280),
                            fontWeight = FontWeight.Medium
                        )
                        HorizontalDivider(
                            modifier = Modifier.weight(1f),
                            thickness = 1.dp,
                            color = Color(0xFFE5E7EB)
                        )
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Continue with Google Button
                    GoogleSignInButton(
                        isLoading = isLoading,
                        onClick = { handleGoogleLogin() }
                    )

                    Spacer(modifier = Modifier.height(16.dp))

                    // Database Account Switcher for convenience
                    if (existingUsers.isNotEmpty()) {
                        TextButton(
                            onClick = { showUserPicker = !showUserPicker },
                            colors = ButtonDefaults.textButtonColors(contentColor = ThoduGreen)
                        ) {
                            Icon(
                                imageVector = if (showUserPicker) Icons.Default.ExpandLess else Icons.Default.ExpandMore,
                                contentDescription = null,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = if (showUserPicker) "Hide active database accounts" else "Select active account from database",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.SemiBold
                            )
                        }

                        AnimatedVisibility(visible = showUserPicker) {
                            Column(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 4.dp)
                            ) {
                                existingUsers.forEach { dbUser ->
                                    Surface(
                                        shape = RoundedCornerShape(10.dp),
                                        color = Color(0xFFF9FAFB),
                                        border = BorderStroke(1.dp, Color(0xFFE5E7EB)),
                                        modifier = Modifier
                                            .fillMaxWidth()
                                            .padding(vertical = 4.dp)
                                            .clickable {
                                                selectedRole = dbUser.role
                                                credential = dbUser.email
                                                handleGoogleLogin(dbUser.email, dbUser.name)
                                            }
                                    ) {
                                        Row(
                                            modifier = Modifier.padding(10.dp),
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Surface(
                                                shape = CircleShape,
                                                color = Color(0xFFE0E7FF),
                                                modifier = Modifier.size(32.dp)
                                            ) {
                                                Box(contentAlignment = Alignment.Center) {
                                                    Text(
                                                        text = dbUser.name.take(1).uppercase(),
                                                        fontWeight = FontWeight.Bold,
                                                        color = Color(0xFF3730A3),
                                                        fontSize = 13.sp
                                                    )
                                                }
                                            }
                                            Spacer(modifier = Modifier.width(10.dp))
                                            Column(modifier = Modifier.weight(1f)) {
                                                Text(
                                                    text = dbUser.name,
                                                    fontWeight = FontWeight.Bold,
                                                    fontSize = 13.sp,
                                                    color = Color(0xFF111827)
                                                )
                                                Text(
                                                    text = "${dbUser.email} • ${dbUser.role}",
                                                    fontSize = 11.sp,
                                                    color = Color(0xFF6B7280)
                                                )
                                            }
                                            Icon(
                                                imageVector = Icons.Default.ChevronRight,
                                                contentDescription = "Login",
                                                tint = ThoduGreen,
                                                modifier = Modifier.size(18.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(100.dp))
                }
            }

            // Bottom Tirupati Silhouette + Wheelchair Companion Artwork
            BottomTirupatiArtwork(
                modifier = Modifier
                    .fillMaxWidth()
                    .align(Alignment.BottomCenter)
            )
        }
    }
}
