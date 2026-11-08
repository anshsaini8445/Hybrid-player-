package com.example.ui.theme

import androidx.compose.ui.graphics.Color

data class StudioPictureTheme(
    val id: String,
    val name: String,
    val primaryAccent: Color,
    val cardTranslucentBg: Color
)

object HybridThemeCatalog {
    val STUDIO_THEMES = listOf(
        StudioPictureTheme(
            id = "aurora-emerald",
            name = "Aurora Emerald Studio (Default)",
            primaryAccent = Color(0xFF10B981),
            cardTranslucentBg = Color(0x24FFFFFF)
        ),
        StudioPictureTheme(
            id = "shanghai-cyber",
            name = "Shanghai 2088 Neon Horizon",
            primaryAccent = Color(0xFFEC4899),
            cardTranslucentBg = Color(0x24FFFFFF)
        ),
        StudioPictureTheme(
            id = "oceanic-8k",
            name = "Abyssal Sapphire 8K Cinema",
            primaryAccent = Color(0xFF38BDF8),
            cardTranslucentBg = Color(0x24FFFFFF)
        ),
        StudioPictureTheme(
            id = "royal-velvet",
            name = "Royal Crimson Dolby Hall",
            primaryAccent = Color(0xFFF59E0B),
            cardTranslucentBg = Color(0x24FFFFFF)
        )
    )
}
