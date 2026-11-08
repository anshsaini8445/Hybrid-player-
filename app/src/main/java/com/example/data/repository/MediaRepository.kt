package com.example.data.repository

import com.example.data.model.AudioTrackItem
import com.example.data.model.VideoMediaItem
import com.example.data.scanner.DeepMediaScanner

class MediaRepository(private val scanner: DeepMediaScanner) {

    suspend fun loadVideosWithBuiltInSamples(): List<VideoMediaItem> {
        val deviceVideos = scanner.scanAllDeviceVideos()
        if (deviceVideos.isNotEmpty()) return deviceVideos

        val now = System.currentTimeMillis()
        return listOf(
            VideoMediaItem(
                id = "vid-ramayana",
                title = "Ramayana (2026) Hindi Movie 480p HDR Master",
                uri = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
                durationMs = 10732000L,
                durationFormatted = "02:58:52",
                resolutionBadge = "HD",
                formatBadge = "MKV",
                sizeFormatted = "572.56MB",
                folderName = "JioSphere",
                lastPlayedTimestamp = now - 300_000L,
                watchedProgressPercent = 34
            ),
            VideoMediaItem(
                id = "vid-shanghai-4k",
                title = "Welcome to futuristic Shanghai City 2088 (4K HDR)",
                uri = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
                durationMs = 19000L,
                durationFormatted = "00:19",
                resolutionBadge = "4K",
                formatBadge = "WEBM",
                sizeFormatted = "62.11MB",
                folderName = "Ansh videos",
                isFavorite = true,
                isStatusReel = true,
                statusCategory = "Cyberpunk",
                lastPlayedTimestamp = now - 60_000L,
                watchedProgressPercent = 65
            ),
            VideoMediaItem(
                id = "vid-anim-coding",
                title = "Animation vs. Coding(1080P HD)",
                uri = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
                durationMs = 566000L,
                durationFormatted = "09:26",
                resolutionBadge = "1080P",
                formatBadge = "MP4",
                sizeFormatted = "55.06MB",
                folderName = "Ansh videos",
                isFavorite = true,
                isStatusReel = true,
                statusCategory = "Coding",
                lastPlayedTimestamp = now - 10_000L,
                watchedProgressPercent = 45
            ),
            VideoMediaItem(
                id = "vid-kickflip-8k",
                title = "The Kickflip — Midnight Street Skate 8K 60FPS",
                uri = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
                durationMs = 43000L,
                durationFormatted = "00:43",
                resolutionBadge = "8K",
                formatBadge = "MP4",
                sizeFormatted = "118.40MB",
                folderName = "Ansh videos",
                isFavorite = true,
                isStatusReel = true,
                statusCategory = "8K Ultra",
                lastPlayedTimestamp = now,
                watchedProgressPercent = 82
            )
        )
    }

    suspend fun loadAudioWithBuiltInSamples(): List<AudioTrackItem> {
        val deviceAudio = scanner.scanAllDeviceAudio()
        if (deviceAudio.isNotEmpty()) return deviceAudio

        return listOf(
            AudioTrackItem(
                id = "aud-1",
                title = "Midnight Skyline Drive (Dolby 3D Bass Mix)",
                artist = "Arijit & Hybrid Synth Collective",
                album = "Shanghai 2088 OST",
                uri = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
                durationMs = 252000L,
                durationFormatted = "04:12",
                isFavorite = true
            ),
            AudioTrackItem(
                id = "aud-2",
                title = "Kesariya Tera Ishq — LoFi 8D Spatial Studio",
                artist = "Pritam • Hybrid Acoustic",
                album = "Bollywood 8D Spatial",
                uri = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
                durationMs = 238000L,
                durationFormatted = "03:58",
                isFavorite = true
            )
        )
    }
}
