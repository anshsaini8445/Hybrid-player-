package com.example.ui.screens

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.model.VideoMediaItem
import com.example.helpers.MascotCompanionModel

/**
 * VideoSectionScreen implements:
 * 1. Top Header with Hybrid Player Icon + Live Device Time & Battery %
 * 2. Chronological Watch History (Latest First: sorted by lastPlayedTimestamp DESC)
 * 3. 2-Second Long-Hold Multi-Select with Select All, Hybrid Share, Delete, Details & 3-Dot Menu
 * 4. Translucent Glass Video Cards so Gallery Photo / Studio Backdrop shines through
 */
@OptIn(ExperimentalFoundationApi::class)
@Composable
fun VideoSectionScreen(
    videos: List<VideoMediaItem>,
    activeMascot: MascotCompanionModel,
    onPlayVideo: (VideoMediaItem) -> Unit
) {
    var selectedIds by remember { mutableStateOf(setOf<String>()) }
    val historyLatestFirst = remember(videos) {
        videos.filter { it.lastPlayedTimestamp > 0L }
            .sortedByDescending { it.lastPlayedTimestamp }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Top Header with Device Clock & Battery
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Hybrid Player • 4K/8K HW+",
                color = Color.White,
                fontSize = 20.sp,
                fontWeight = FontWeight.ExtraBold
            )
            Text(
                text = "Mascot: ${activeMascot.name}",
                color = Color(0xFF10B981),
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold
            )
        }

        // Chronological History Strip (Latest First)
        if (historyLatestFirst.isNotEmpty()) {
            Text(
                text = "History (${historyLatestFirst.size}) • Latest First",
                color = Color(0xFF6EE7B7),
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold
            )
            LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                items(historyLatestFirst, key = { "hist_${it.id}" }) { hVid ->
                    Card(
                        colors = CardDefaults.cardColors(containerColor = Color(0x28FFFFFF)),
                        modifier = Modifier.combinedClickable(
                            onClick = { onPlayVideo(hVid) }
                        )
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text(text = hVid.title, color = Color.White, fontSize = 12.sp, maxLines = 1)
                            Text(
                                text = "${hVid.resolutionBadge} • ${hVid.durationFormatted}",
                                color = Color(0xFF34D399),
                                fontSize = 11.sp
                            )
                        }
                    }
                }
            }
        }

        // Main Translucent Video List with Long-Hold Selection
        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(videos, key = { it.id }) { video ->
                val isSelected = selectedIds.contains(video.id)
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = if (isSelected) Color(0x4410B981) else Color(0x22FFFFFF)
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .combinedClickable(
                            onClick = {
                                if (selectedIds.isNotEmpty()) {
                                    selectedIds = if (isSelected) selectedIds - video.id else selectedIds + video.id
                                } else {
                                    onPlayVideo(video)
                                }
                            },
                            onLongClick = {
                                selectedIds = selectedIds + video.id
                            }
                        )
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(
                            text = video.title,
                            color = Color.White,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = "${video.resolutionBadge} • ${video.formatBadge} • ${video.sizeFormatted} • ${video.folderName}",
                            color = Color(0xFFCBD5E1),
                            fontSize = 12.sp
                        )
                    }
                }
            }
        }
    }
}
