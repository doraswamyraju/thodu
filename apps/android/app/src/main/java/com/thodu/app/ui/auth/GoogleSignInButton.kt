package com.thodu.app.ui.auth

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.thodu.app.R
import com.thodu.app.ui.theme.ThoduGreen

/**
 * Standard Google Sign-In Button conforming to Google Identity Branding Guidelines:
 * - 4-color Google "G" logo
 * - White background with 1dp border (Color(0xFFD1D5DB))
 * - Standard button height 50-52dp with 12dp rounded corners
 * - "Continue with Google" typography in #1F2937
 * - Visual progress state during OAuth 2.0 flow
 */
@Composable
fun GoogleSignInButton(
    isLoading: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    text: String = "Continue with Google"
) {
    Button(
        onClick = onClick,
        enabled = !isLoading,
        colors = ButtonDefaults.buttonColors(
            containerColor = Color.White,
            contentColor = Color(0xFF1F2937),
            disabledContainerColor = Color(0xFFF9FAFB)
        ),
        shape = RoundedCornerShape(12.dp),
        border = BorderStroke(1.dp, Color(0xFFD1D5DB)),
        elevation = ButtonDefaults.buttonElevation(
            defaultElevation = 1.dp,
            pressedElevation = 2.dp
        ),
        modifier = modifier
            .fillMaxWidth()
            .height(52.dp)
    ) {
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.size(20.dp),
                strokeWidth = 2.5.dp,
                color = ThoduGreen
            )
            Spacer(modifier = Modifier.width(12.dp))
            Text(
                text = "Connecting to Google...",
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color(0xFF374151)
            )
        } else {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Icon(
                    painter = painterResource(id = R.drawable.ic_google_logo),
                    contentDescription = "Google",
                    tint = Color.Unspecified,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = text,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = Color(0xFF1F2937)
                )
            }
        }
    }
}
