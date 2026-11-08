package com.example.viewmodel

import androidx.lifecycle.ViewModel
import com.example.data.model.AppLanguageOption
import com.example.data.model.AudioTrackItem
import com.example.data.model.VideoMediaItem
import com.example.helpers.MascotCompanionHelper
import com.example.helpers.MascotCompanionModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

class PlayerViewModel : ViewModel() {

    // Permanent Custom Gallery Photo Wallpaper & Studio Theme State
    private val _customGalleryWallpaperUri = MutableStateFlow<String?>(null)
    val customGalleryWallpaperUri: StateFlow<String?> = _customGalleryWallpaperUri.asStateFlow()

    private val _selectedThemeId = MutableStateFlow("aurora-emerald")
    val selectedThemeId: StateFlow<String> = _selectedThemeId.asStateFlow()

    // App Language State: ONLY System Default, English, and Hindi
    private val _appLanguage = MutableStateFlow(AppLanguageOption.SYSTEM)
    val appLanguage: StateFlow<AppLanguageOption> = _appLanguage.asStateFlow()

    // 10 3D Fluffy Mascots State
    private val _mascots = MutableStateFlow(MascotCompanionHelper.DEFAULT_10_MASCOTS)
    val mascots: StateFlow<List<MascotCompanionModel>> = _mascots.asStateFlow()

    private val _activeMascot = MutableStateFlow(MascotCompanionHelper.DEFAULT_10_MASCOTS.first())
    val activeMascot: StateFlow<MascotCompanionModel> = _activeMascot.asStateFlow()

    // Video & Audio Lists + Bi-Directional Playback Handover
    private val _videos = MutableStateFlow<List<VideoMediaItem>>(emptyList())
    val videos: StateFlow<List<VideoMediaItem>> = _videos.asStateFlow()

    private val _audioTracks = MutableStateFlow<List<AudioTrackItem>>(emptyList())
    val audioTracks: StateFlow<List<AudioTrackItem>> = _audioTracks.asStateFlow()

    private val _activeVideo = MutableStateFlow<VideoMediaItem?>(null)
    val activeVideo: StateFlow<VideoMediaItem?> = _activeVideo.asStateFlow()

    private val _isVideoPlaying = MutableStateFlow(false)
    val isVideoPlaying: StateFlow<Boolean> = _isVideoPlaying.asStateFlow()

    private val _activeAudio = MutableStateFlow<AudioTrackItem?>(null)
    val activeAudio: StateFlow<AudioTrackItem?> = _activeAudio.asStateFlow()

    private val _isAudioPlaying = MutableStateFlow(false)
    val isAudioPlaying: StateFlow<Boolean> = _isAudioPlaying.asStateFlow()

    // Dynamic Hold-Slide Playback Speed (0.25x to 8.00x)
    private val _playbackSpeed = MutableStateFlow(1.0f)
    val playbackSpeed: StateFlow<Float> = _playbackSpeed.asStateFlow()

    // 3D Equalizer ON/OFF Gate & 5-Second DJ Auto-Crossfade
    private val _isEqualizer3DEnabled = MutableStateFlow(false)
    val isEqualizer3DEnabled: StateFlow<Boolean> = _isEqualizer3DEnabled.asStateFlow()

    private val _isCrossfade5sEnabled = MutableStateFlow(true)
    val isCrossfade5sEnabled: StateFlow<Boolean> = _isCrossfade5sEnabled.asStateFlow()

    fun setVideos(list: List<VideoMediaItem>) {
        _videos.value = list
    }

    fun setAudioTracks(list: List<AudioTrackItem>) {
        _audioTracks.value = list
    }

    fun setCustomGalleryWallpaper(uri: String?) {
        _customGalleryWallpaperUri.value = uri
    }

    fun setThemeId(themeId: String) {
        _selectedThemeId.value = themeId
    }

    fun setAppLanguage(option: AppLanguageOption) {
        _appLanguage.value = option
    }

    fun selectMascot(mascot: MascotCompanionModel) {
        _activeMascot.value = mascot
    }

    /**
     * Play Video -> Automatically stops any playing Audio song & moves Video to #1 in History (Latest First)
     */
    fun playVideo(video: VideoMediaItem) {
        if (_isAudioPlaying.value) {
            _isAudioPlaying.value = false
        }
        val now = System.currentTimeMillis()
        _videos.value = _videos.value.map {
            if (it.id == video.id) it.copy(lastPlayedTimestamp = now) else it
        }
        _activeVideo.value = video.copy(lastPlayedTimestamp = now)
        _isVideoPlaying.value = true
    }

    /**
     * Play Audio -> Automatically stops & closes any background/mini Video
     */
    fun playAudio(track: AudioTrackItem) {
        if (_isVideoPlaying.value || _activeVideo.value != null) {
            _isVideoPlaying.value = false
            _activeVideo.value = null
        }
        _activeAudio.value = track
        _isAudioPlaying.value = true
    }

    fun updateDynamicSpeed(speed: Float) {
        _playbackSpeed.value = speed.coerceIn(0.25f, 8.0f)
    }

    fun toggleEqualizer3D(enabled: Boolean) {
        _isEqualizer3DEnabled.value = enabled
    }
}
