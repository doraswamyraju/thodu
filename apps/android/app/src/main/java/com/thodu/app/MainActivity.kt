package com.thodu.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import com.thodu.app.data.model.AppUser
import com.thodu.app.ui.auth.LoginScreen
import com.thodu.app.ui.screens.FamilyDashboardScreen
import com.thodu.app.ui.theme.ThoduTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            ThoduTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    var currentUser by remember { mutableStateOf<AppUser?>(null) }

                    if (currentUser == null) {
                        LoginScreen(
                            onLoginSuccess = { user ->
                                currentUser = user
                            }
                        )
                    } else {
                        // Render authenticated dashboard
                        FamilyDashboardScreen(
                            onNavigateToServices = {},
                            onNavigateToBookings = {},
                            onTriggerSos = {}
                        )
                    }
                }
            }
        }
    }
}

