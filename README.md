# Hybrid Player Pro — Complete A-to-Z Multiplatform Repository (Android & Web)

A comprehensive, production-grade media player supporting **4K/8K Ultra HD video playback**, **3D Audio Studio with 5-second DJ crossfade**, **Real Hybrid Share Pro**, and **10 photorealistic 3D mascot companions**.

## Repository Structure & Overview

This repository contains both the **Native Android Studio (Kotlin + Jetpack Compose + Media3 ExoPlayer)** application and the **Web/PWA Studio (React + TypeScript + Tailwind CSS)** application, configured with automated **GitHub Actions CI/CD** to build runnable APKs and release ZIP bundles on every push.

```
├── .github/
│   └── workflows/
│       └── build-and-release.yml    # Automated GitHub Actions workflow (builds APK & Web ZIP)
├── gradle/
│   └── wrapper/
│       └── gradle-wrapper.properties # Repeatable Gradle wrapper configuration
├── gradlew                          # POSIX executable for repeatable builds
├── gradlew.bat                      # Windows Gradle wrapper script
├── settings.gradle.kts              # Android multi-module settings
├── build.gradle.kts                 # Root project Gradle configuration
├── gradle.properties                # JVM & AndroidX optimization properties
├── app/
│   ├── build.gradle.kts             # Android application dependencies & SDK setup
│   ├── proguard-rules.pro           # Code shrinking and obfuscation rules
│   └── src/
│       ├── main/
│       │   ├── AndroidManifest.xml  # Complete system permissions & activity config
│       │   ├── java/com/example/
│       │   │   ├── MainActivity.kt
│       │   │   ├── data/
│       │   │   │   ├── model/MediaModels.kt
│       │   │   │   ├── repository/MediaRepository.kt
│       │   │   │   └── scanner/DeepMediaScanner.kt
│       │   │   ├── helpers/MascotCompanionHelper.kt
│       │   │   ├── ui/
│       │   │   │   ├── components/
│       │   │   │   │   ├── Equalizer3DPanel.kt
│       │   │   │   │   ├── HybridShareSheet.kt
│       │   │   │   │   └── NetworkStreamSheet.kt
│       │   │   │   ├── screens/
│       │   │   │   │   ├── AudioStudioScreen.kt
│       │   │   │   │   ├── MeToolkitScreen.kt
│       │   │   │   │   ├── SearchScreen.kt
│       │   │   │   │   ├── VideoPlayerScreen.kt
│       │   │   │   │   └── VideoSectionScreen.kt
│       │   │   │   └── theme/HybridTheme.kt
│       │   │   └── viewmodel/PlayerViewModel.kt
│       │   └── res/
│       │       ├── drawable/        # 10 3D Plush Mascot drawables & logo
│       │       ├── mipmap-*/        # Standard application launcher icons
│       │       ├── values/strings.xml (English)
│       │       ├── values-hi/strings.xml (हिन्दी)
│       │       └── values/themes.xml
│       └── test/java/com/example/ExampleRobolectricTest.kt
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── data/mediaData.ts
│   ├── components/
│   │   ├── AudioStudioSection.tsx
│   │   ├── MediaVisuals.tsx
│   │   ├── MeToolkitSection.tsx
│   │   └── VideoPlayerModal.tsx
│   └── assets/images/               # High-fidelity 3D mascot assets
└── public/
```

## GitHub Actions & Repeatable Build Pipeline

Pushing to this repository automatically triggers the GitHub Actions workflow (`.github/workflows/build-and-release.yml`):
- **Web App**: Builds the production distribution, packages `HybridPlayer-Web-Dist.zip` and complete source code bundle, and exposes them under Actions Artifacts.
- **Android APK**: Executes `./gradlew assembleDebug` using Java 17 Temurin, packaging and publishing the resulting `.apk` binaries directly to GitHub Actions artifacts.

## Running Locally

### Android Studio
1. Open the project root folder in **Android Studio** (Hedgehog or newer).
2. Allow Gradle to synchronize dependencies.
3. Select an emulator or physical device and click **Run (Shift + F10)**.

### Web Studio
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the local development server:
   ```bash
   npm run dev
   ```
3. Create a production build:
   ```bash
   npm run build
   ```
