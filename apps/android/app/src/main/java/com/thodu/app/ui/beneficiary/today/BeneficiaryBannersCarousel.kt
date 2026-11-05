package com.thodu.app.ui.beneficiary.today

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowForward
import androidx.compose.material.icons.filled.CardGiftcard
import androidx.compose.material.icons.filled.MedicalServices
import androidx.compose.material.icons.filled.VolunteerActivism
import androidx.compose.material3.Icon
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

data class PromoBanner(
    val id: String,
    val tag: String,
    val title: String,
    val subtitle: String,
    val ctaText: String,
    val icon: ImageVector,
    val gradientColors: List<Color>,
    val accentColor: Color
)

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun BeneficiaryBannersCarousel(
    onBannerClick: (PromoBanner) -> Unit = {}
) {
    val banners = listOf(
        PromoBanner(
            id = "b1",
            tag = "TRUST GRANT PARTNERSHIP",
            title = "Up to 100% Care Subsidy",
            subtitle = "Sri Divyang Seva Kendram Trust covers home care for eligible elders & BPL cardholders",
            ctaText = "Apply Now",
            icon = Icons.Default.VolunteerActivism,
            gradientColors = listOf(Color(0xFF064E3B), Color(0xFF047857), Color(0xFF059669)),
            accentColor = Color(0xFFFDE047)
        ),
        PromoBanner(
            id = "b2",
            tag = "SPECIAL CARE PACKAGE",
            title = "Monthly Vitals & Health Dossier",
            subtitle = "Dedicated nurse visit twice a week for BP, SpO2, blood sugar & doctor consultation",
            ctaText = "View Package",
            icon = Icons.Default.MedicalServices,
            gradientColors = listOf(Color(0xFF1E3A8A), Color(0xFF2563EB), Color(0xFF3B82F6)),
            accentColor = Color(0xFF67E8F9)
        ),
        PromoBanner(
            id = "b3",
            tag = "FESTIVE WELLNESS OFFER",
            title = "Flat ₹200 Off First Home Physio",
            subtitle = "Post-stroke mobility, joint rehabilitation & gentle elder therapy at your doorstep",
            ctaText = "Claim Offer",
            icon = Icons.Default.CardGiftcard,
            gradientColors = listOf(Color(0xFF78350F), Color(0xFFD97706), Color(0xFFF59E0B)),
            accentColor = Color(0xFFFEF08A)
        )
    )

    val pagerState = rememberPagerState(pageCount = { banners.size })

    // Auto-advance carousel every 4 seconds
    LaunchedEffect(pagerState) {
        while (true) {
            delay(4000)
            val nextPage = (pagerState.currentPage + 1) % banners.size
            pagerState.animateScrollToPage(nextPage)
        }
    }

    Column(modifier = Modifier.fillMaxWidth()) {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier
                .fillMaxWidth()
                .height(132.dp)
        ) { page ->
            val banner = banners[page]
            Surface(
                shape = RoundedCornerShape(18.dp),
                shadowElevation = 2.dp,
                modifier = Modifier
                    .fillMaxSize()
                    .clip(RoundedCornerShape(18.dp))
                    .clickable { onBannerClick(banner) }
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Brush.horizontalGradient(banner.gradientColors))
                        .padding(horizontal = 16.dp, vertical = 14.dp)
                ) {
                    // Right background decorative large icon
                    Icon(
                        imageVector = banner.icon,
                        contentDescription = null,
                        tint = Color.White.copy(alpha = 0.12f),
                        modifier = Modifier
                            .size(110.dp)
                            .align(Alignment.CenterEnd)
                            .offset(x = 18.dp)
                    )

                    Column(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(end = 60.dp),
                        verticalArrangement = Arrangement.SpaceBetween
                    ) {
                        // Tag Pill
                        Surface(
                            shape = RoundedCornerShape(6.dp),
                            color = banner.accentColor.copy(alpha = 0.25f)
                        ) {
                            Text(
                                text = banner.tag,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.ExtraBold,
                                color = banner.accentColor,
                                letterSpacing = 0.5.sp,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }

                        // Title & Subtitle
                        Column {
                            Text(
                                text = banner.title,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White,
                                maxLines = 1
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = banner.subtitle,
                                fontSize = 11.sp,
                                color = Color.White.copy(alpha = 0.88f),
                                lineHeight = 14.sp,
                                maxLines = 2
                            )
                        }

                        // CTA Link
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = banner.ctaText,
                                fontSize = 11.5.sp,
                                fontWeight = FontWeight.Bold,
                                color = banner.accentColor
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.ArrowForward,
                                contentDescription = null,
                                tint = banner.accentColor,
                                modifier = Modifier.size(11.dp)
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Pager Dots Indicator
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            repeat(banners.size) { index ->
                val isSelected = pagerState.currentPage == index
                Box(
                    modifier = Modifier
                        .padding(horizontal = 3.dp)
                        .height(4.dp)
                        .width(if (isSelected) 18.dp else 5.dp)
                        .clip(CircleShape)
                        .background(if (isSelected) Color(0xFF0D5C3A) else Color(0xFFD1D5DB))
                )
            }
        }
    }
}

