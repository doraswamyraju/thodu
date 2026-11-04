package com.thodu.app.ui.auth

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.unit.dp

@Composable
fun BottomTirupatiArtwork(modifier: Modifier = Modifier) {
    Canvas(
        modifier = modifier
            .fillMaxWidth()
            .height(95.dp)
    ) {
        val w = size.width
        val h = size.height

        // Soft green landscape hill waves in background
        val hillPathBack = Path().apply {
            moveTo(0f, h * 0.55f)
            cubicTo(w * 0.25f, h * 0.40f, w * 0.45f, h * 0.65f, w * 0.70f, h * 0.48f)
            cubicTo(w * 0.85f, h * 0.38f, w * 0.95f, h * 0.50f, w, h * 0.45f)
            lineTo(w, h)
            lineTo(0f, h)
            close()
        }
        drawPath(hillPathBack, color = Color(0xFFDCFCE7).copy(alpha = 0.65f))

        // Foreground lush green ground wave
        val hillPathFore = Path().apply {
            moveTo(0f, h * 0.70f)
            cubicTo(w * 0.30f, h * 0.60f, w * 0.60f, h * 0.82f, w, h * 0.68f)
            lineTo(w, h)
            lineTo(0f, h)
            close()
        }
        drawPath(hillPathFore, color = Color(0xFFBBF7D0).copy(alpha = 0.85f))

        // Center Temple Gopuram silhouette (Tirupati sacred heritage)
        val gopuramX = w * 0.50f
        val gopuramBaseY = h * 0.80f
        val templeColor = Color(0xFF86EFAC).copy(alpha = 0.55f)

        // Tiered gopuram
        drawRect(templeColor, topLeft = Offset(gopuramX - 22f, gopuramBaseY - 20f), size = androidx.compose.ui.geometry.Size(44f, 20f))
        drawRect(templeColor, topLeft = Offset(gopuramX - 17f, gopuramBaseY - 36f), size = androidx.compose.ui.geometry.Size(34f, 16f))
        drawRect(templeColor, topLeft = Offset(gopuramX - 12f, gopuramBaseY - 50f), size = androidx.compose.ui.geometry.Size(24f, 14f))
        drawRect(templeColor, topLeft = Offset(gopuramX - 7f, gopuramBaseY - 62f), size = androidx.compose.ui.geometry.Size(14f, 12f))
        // Kalasam on top
        drawCircle(templeColor, radius = 5f, center = Offset(gopuramX, gopuramBaseY - 67f))

        // Caregiver escorting elder in wheelchair silhouette on the left
        val silhouetteColor = Color(0xFF15803D).copy(alpha = 0.80f)
        val chairX = w * 0.16f
        val chairY = h * 0.78f

        // Wheelchair Big Wheel
        drawCircle(silhouetteColor, radius = 13f, center = Offset(chairX, chairY), style = androidx.compose.ui.graphics.drawscope.Stroke(width = 3f))
        drawCircle(silhouetteColor, radius = 3f, center = Offset(chairX, chairY))

        // Sitting elder
        drawCircle(silhouetteColor, radius = 6f, center = Offset(chairX - 2f, chairY - 26f))
        drawLine(silhouetteColor, start = Offset(chairX - 2f, chairY - 20f), end = Offset(chairX, chairY - 8f), strokeWidth = 3f)

        // Standing caregiver pushing wheelchair
        val cgX = chairX - 22f
        drawCircle(silhouetteColor, radius = 6f, center = Offset(cgX, chairY - 34f))
        drawLine(silhouetteColor, start = Offset(cgX, chairY - 28f), end = Offset(cgX + 2f, chairY - 4f), strokeWidth = 3.5f)
        // Pushing arm
        drawLine(silhouetteColor, start = Offset(cgX + 2f, chairY - 22f), end = Offset(chairX - 6f, chairY - 18f), strokeWidth = 2.5f)

        // Banyan / sacred tree silhouette on the right
        val treeX = w * 0.86f
        val treeY = h * 0.72f
        val treeColor = Color(0xFF15803D).copy(alpha = 0.75f)

        // Trunk
        drawRect(treeColor, topLeft = Offset(treeX - 4f, treeY), size = androidx.compose.ui.geometry.Size(8f, 22f))
        // Lush Foliage
        drawCircle(treeColor, radius = 18f, center = Offset(treeX, treeY - 8f))
        drawCircle(treeColor, radius = 14f, center = Offset(treeX - 12f, treeY - 4f))
        drawCircle(treeColor, radius = 14f, center = Offset(treeX + 12f, treeY - 4f))
        drawCircle(treeColor, radius = 12f, center = Offset(treeX, treeY - 20f))
    }
}

