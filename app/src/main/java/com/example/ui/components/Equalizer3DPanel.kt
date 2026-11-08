package com.example.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/**
 * Equalizer3DPanel animates 5-Band 3D Equalizer & 6 3D Visualizers ONLY when switched ON.
 */
@Composable
fun Equalizer3DPanel(
    isEnabled: Boolean,
    activeVisualizerName: String
) {
    Column(
        modifier = Modifier.padding(12.dp),
        verticalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        Text(
            text = if (isEnabled) "3D Equalizer ACTIVE ($activeVisualizerName)" else "3D Equalizer STANDBY (OFF)",
            color = if (isEnabled) Color(0xFF10B981) else Color(0xFF94A3B8),
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold
        )
    }
}
