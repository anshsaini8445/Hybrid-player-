package com.example

import android.Manifest
import android.os.Build
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.example.data.repository.MediaRepository
import com.example.data.scanner.DeepMediaScanner
import com.example.ui.screens.VideoSectionScreen
import com.example.viewmodel.PlayerViewModel

class MainActivity : ComponentActivity() {

    private val playerViewModel: PlayerViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val scanner = DeepMediaScanner(applicationContext)
        val repository = MediaRepository(scanner)

        setContent {
            var permissionsGranted by remember { mutableStateOf(false) }

            val permissionLauncher = rememberLauncherForActivityResult(
                contract = ActivityResultContracts.RequestMultiplePermissions()
            ) {
                permissionsGranted = true
            }

            // Single clean startup permission flow (no duplicate launchers)
            LaunchedEffect(Unit) {
                val perms = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    arrayOf(
                        Manifest.permission.READ_MEDIA_VIDEO,
                        Manifest.permission.READ_MEDIA_AUDIO,
                        Manifest.permission.READ_MEDIA_IMAGES,
                        Manifest.permission.CAMERA
                    )
                } else {
                    arrayOf(
                        Manifest.permission.READ_EXTERNAL_STORAGE,
                        Manifest.permission.CAMERA
                    )
                }
                permissionLauncher.launch(perms)
            }

            LaunchedEffect(permissionsGranted) {
                playerViewModel.setVideos(repository.loadVideosWithBuiltInSamples())
                playerViewModel.setAudioTracks(repository.loadAudioWithBuiltInSamples())
            }

            val videos by playerViewModel.videos.collectAsState()
            val activeMascot by playerViewModel.activeMascot.collectAsState()

            Surface(
                modifier = Modifier.fillMaxSize(),
                color = Color(0xFF061311)
            ) {
                VideoSectionScreen(
                    videos = videos,
                    activeMascot = activeMascot,
                    onPlayVideo = { playerViewModel.playVideo(it) }
                )
            }
        }
    }
}
