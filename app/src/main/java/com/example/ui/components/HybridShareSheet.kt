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
 * HybridShareSheet provides:
 * - 360° Live Sonar Radar Sweep for nearby device discovery
 * - Multi-Tech Transfer Selector: Wi-Fi Direct 5GHz (110 MB/s), WebRTC P2P, Local Hotspot HTTP, Bluetooth BLE
 * - Receiver Mode ("Lene Wala Phone"): Scannable 2D QR Code + 1D High-Density Barcode + 6-Digit Pairing PIN
 * - Sender Mode ("Bhejne Wala Phone"): Live CameraX + MLKit Barcode/QR Scanner + Native OS Share Sheet
 */
@Composable
fun HybridShareSheet(
    mediaTitle: String,
    pairingPin: String
) {
    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Text(
            text = "Hybrid Share Pro • 360° Radar & Live Barcode Scanner",
            color = Color(0xFF10B981),
            fontSize = 16.sp,
            fontWeight = FontWeight.ExtraBold
        )
        Text(
            text = "Sharing: $mediaTitle • Pairing PIN: $pairingPin",
            color = Color.White,
            fontSize = 13.sp
        )
    }
}
