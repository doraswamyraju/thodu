package com.thodu.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val ThoduColorScheme = lightColorScheme(
    primary = ThoduForestGreen,
    secondary = ThoduSecondaryGreen,
    tertiary = ThoduAccentYellow,
    background = ThoduWarmCream,
    surface = ThoduSurfaceWhite,
    onPrimary = ThoduSurfaceWhite,
    onSecondary = ThoduSurfaceWhite,
    onBackground = ThoduTextPrimary,
    onSurface = ThoduTextPrimary,
    error = ThoduDangerRed
)

@Composable
fun ThoduTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = ThoduColorScheme,
        content = content
    )
}
