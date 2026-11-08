package com.example.data.model

data class VideoMediaItem(
    val id: String,
    val title: String,
    val uri: String,
    val durationMs: Long,
    val durationFormatted: String,
    val resolutionBadge: String, // "8K", "4K", "2K", "1080P", "HD"
    val formatBadge: String,     // "MKV", "WEBM", "MP4"
    val sizeFormatted: String,
    val folderName: String,
    val fps: Int = 60,
    val bitrate: String = "42.0 Mbps",
    val codec: String = "HEVC 10-bit HW+ Smart M13",
    val isFavorite: Boolean = false,
    val isStatusReel: Boolean = false,
    val statusCategory: String = "8K Ultra",
    val lastPlayedTimestamp: Long = 0L,
    val watchedProgressPercent: Int = 0
)

data class AudioTrackItem(
    val id: String,
    val title: String,
    val artist: String,
    val album: String,
    val uri: String,
    val durationMs: Long,
    val durationFormatted: String,
    val qualityBadge: String = "FLAC 24-Bit Studio",
    val sizeFormatted: String = "28.4 MB",
    val folderName: String = "Studio Masters",
    val bpm: Int = 124,
    val isFavorite: Boolean = false
)

enum class AppLanguageOption(val code: String, val labelEn: String, val labelHi: String) {
    SYSTEM("system", "System Default (Auto)", "सिस्टम डिफ़ॉल्ट (Auto)"),
    ENGLISH("en", "English (EN)", "English (अंग्रेज़ी)"),
    HINDI("hi", "हिन्दी (Hindi)", "हिन्दी (Hindi)")
}

enum classPlaybackOrderMode {
    LINE_BY_LINE, // Default sequential mode
    SHUFFLE_RANDOM,
    REPEAT_ONE
}
