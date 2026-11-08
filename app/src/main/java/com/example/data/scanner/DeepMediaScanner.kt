package com.example.data.scanner

import android.content.ContentUris
import android.content.Context
import android.provider.MediaStore
import com.example.data.model.AudioTrackItem
import com.example.data.model.VideoMediaItem
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.util.Locale
import java.util.concurrent.TimeUnit

/**
 * DeepMediaScanner scans device MediaStore for all Videos (8K/4K/1080P/HD, MKV/WEBM/MP4)
 * and Audio songs with duplicate-key protection and safe fallbacks so Compose LazyColumn never crashes.
 */
class DeepMediaScanner(private val context: Context) {

    suspend fun scanAllDeviceVideos(): List<VideoMediaItem> = withContext(Dispatchers.IO) {
        val results = mutableListOf<VideoMediaItem>()
        val seenIds = mutableSetOf<String>()

        try {
            val projection = arrayOf(
                MediaStore.Video.Media._ID,
                MediaStore.Video.Media.DISPLAY_NAME,
                MediaStore.Video.Media.DURATION,
                MediaStore.Video.Media.SIZE,
                MediaStore.Video.Media.WIDTH,
                MediaStore.Video.Media.HEIGHT,
                MediaStore.Video.Media.BUCKET_DISPLAY_NAME,
                MediaStore.Video.Media.DATE_MODIFIED
            )
            val sortOrder = "${MediaStore.Video.Media.DATE_MODIFIED} DESC"

            context.contentResolver.query(
                MediaStore.Video.Media.EXTERNAL_CONTENT_URI,
                projection,
                null,
                null,
                sortOrder
            )?.use { cursor ->
                val idCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media._ID)
                val nameCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.DISPLAY_NAME)
                val durCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.DURATION)
                val sizeCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.SIZE)
                val widthCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.WIDTH)
                val heightCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.HEIGHT)
                val folderCol = cursor.getColumnIndexOrThrow(MediaStore.Video.Media.BUCKET_DISPLAY_NAME)

                while (cursor.moveToNext()) {
                    val rawId = cursor.getLong(idCol).toString()
                    val uniqueId = if (seenIds.contains(rawId)) "${rawId}_${results.size}" else rawId
                    seenIds.add(uniqueId)

                    val name = cursor.getString(nameCol) ?: "Video_$uniqueId.mp4"
                    val durationMs = cursor.getLong(durCol).coerceAtLeast(1000L)
                    val sizeBytes = cursor.getLong(sizeCol).coerceAtLeast(0L)
                    val width = cursor.getInt(widthCol)
                    val height = cursor.getInt(heightCol)
                    val folder = cursor.getString(folderCol) ?: "Internal Storage"

                    val contentUri = ContentUris.withAppendedId(
                        MediaStore.Video.Media.EXTERNAL_CONTENT_URI,
                        rawId.toLongOrNull() ?: 0L
                    ).toString()

                    val maxDim = maxOf(width, height)
                    val resBadge = when {
                        maxDim >= 7680 -> "8K"
                        maxDim >= 3840 -> "4K"
                        maxDim >= 2560 -> "2K"
                        maxDim >= 1920 -> "1080P"
                        else -> "HD"
                    }

                    val ext = name.substringAfterLast('.', "MP4").uppercase(Locale.ROOT)
                    results.add(
                        VideoMediaItem(
                            id = uniqueId,
                            title = name.substringBeforeLast('.'),
                            uri = contentUri,
                            durationMs = durationMs,
                            durationFormatted = formatDuration(durationMs),
                            resolutionBadge = resBadge,
                            formatBadge = ext,
                            sizeFormatted = String.format(Locale.US, "%.2fMB", sizeBytes / (1024f * 1024f)),
                            folderName = folder,
                            isStatusReel = durationMs <= 90_000L
                        )
                    )
                }
            }
        } catch (_: Throwable) {
            // Safe catch so permission transitions never crash startup
        }

        results
    }

    suspend fun scanAllDeviceAudio(): List<AudioTrackItem> = withContext(Dispatchers.IO) {
        val tracks = mutableListOf<AudioTrackItem>()
        val seenIds = mutableSetOf<String>()

        try {
            val projection = arrayOf(
                MediaStore.Audio.Media._ID,
                MediaStore.Audio.Media.TITLE,
                MediaStore.Audio.Media.ARTIST,
                MediaStore.Audio.Media.ALBUM,
                MediaStore.Audio.Media.DURATION,
                MediaStore.Audio.Media.SIZE
            )
            context.contentResolver.query(
                MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                projection,
                "${MediaStore.Audio.Media.IS_MUSIC} != 0",
                null,
                "${MediaStore.Audio.Media.DATE_ADDED} DESC"
            )?.use { cursor ->
                val idCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID)
                val titleCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)
                val artistCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)
                val albumCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)
                val durCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)
                val sizeCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.SIZE)

                while (cursor.moveToNext()) {
                    val rawId = cursor.getLong(idCol).toString()
                    val uniqueId = if (seenIds.contains(rawId)) "${rawId}_${tracks.size}" else rawId
                    seenIds.add(uniqueId)

                    val durationMs = cursor.getLong(durCol).coerceAtLeast(1000L)
                    val sizeBytes = cursor.getLong(sizeCol).coerceAtLeast(0L)
                    val uri = ContentUris.withAppendedId(
                        MediaStore.Audio.Media.EXTERNAL_CONTENT_URI,
                        rawId.toLongOrNull() ?: 0L
                    ).toString()

                    tracks.add(
                        AudioTrackItem(
                            id = uniqueId,
                            title = cursor.getString(titleCol) ?: "Track $uniqueId",
                            artist = cursor.getString(artistCol) ?: "Hybrid Studio Artist",
                            album = cursor.getString(albumCol) ?: "Studio Masters",
                            uri = uri,
                            durationMs = durationMs,
                            durationFormatted = formatDuration(durationMs),
                            sizeFormatted = String.format(Locale.US, "%.1f MB", sizeBytes / (1024f * 1024f))
                        )
                    )
                }
            }
        } catch (_: Throwable) {
        }

        tracks
    }

    private fun formatDuration(durationMs: Long): String {
        val hours = TimeUnit.MILLISECONDS.toHours(durationMs)
        val minutes = TimeUnit.MILLISECONDS.toMinutes(durationMs) % 60
        val seconds = TimeUnit.MILLISECONDS.toSeconds(durationMs) % 60
        return if (hours > 0) {
            String.format(Locale.US, "%02d:%02d:%02d", hours, minutes, seconds)
        } else {
            String.format(Locale.US, "%02d:%02d", minutes, seconds)
        }
    }
}
