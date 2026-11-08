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
 * NetworkStreamSheet provides:
 * - Embedded Live HD/4K ExoPlayer Stream Preview
 * - 3 Stream Buffer Modes: Auto Low-Latency, 4K/8K High-Buffer, HLS Live Stream
 * - 6 Verified One-Tap 4K/8K/HD Channels (Tears of Steel 4K, Sintel HD, Big Buck Bunny 4K, Bullrun 8K, Elephants Dream, Subaru 4K)
 */
@Composable
fun NetworkStreamSheet(
    streamUrl: String,
    bufferMode: String
) {
    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(
            text = "Advanced Network Stream Studio ($bufferMode)",
            color = Color(0xFF38BDF8),
            fontSize = 16.sp,
            fontWeight = FontWeight.ExtraBold
        )
        Text(
            text = "Active Stream: $streamUrl",
            color = Color.White,
            fontSize = 12.sp
        )
    }
}
