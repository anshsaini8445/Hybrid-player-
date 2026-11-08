# Hybrid Player Pro (4K / 8K Ultra Media, 3D Audio & Hybrid Share Studio)

Complete **A-to-Z Source Code** for **Hybrid Player Pro**, featuring:

1. **Video Section & Chronological History (`src/App.tsx`)**
   - Permanent Gallery Photo Wallpaper & Studio Picture Backdrops across Video, Audio, Search, and Me sections.
   - Top bar with live Device Clock (`HH:MM AM/PM`), live Battery percentage (`%`), and `HW+ Smart M13` 4K/8K Decoder selector.
   - Latest-First Watch History strip, Folder browser, 4K/8K 60FPS Status Reels, and 2-Second Hold Multi-Select toolbar.

2. **Pure-White 8X Pro Video Player (`src/components/VideoPlayerModal.tsx`)**
   - Hold-and-slide Dynamic Speed control (`0.25x` to `8.00x`) with live rotating speedometer needle.
   - Smooth horizontal swipe seek with live `+sec / -sec` and millisecond/nanosecond telemetry.
   - Auto-Play Next Video on finish, Interactive Playing Queue with Up/Down swap and Shuffle, 25 Pro Tools in the 3-dot menu, and scrollable bottom quick-action ribbon.

3. **3D Audio Studio (`src/components/AudioStudioSection.tsx`)**
   - 5-Band 3D Equalizer (animates only when switched ON) + 6 distinct 3D Visualizers.
   - Live `MM : SS . ms : ns` high-precision timer, 7-Heart 2-second burst animation, vertical swipe volume bar, default Line-by-Line playback mode, and 5-Second DJ Auto-Crossfade.

4. **Me & Toolkit Section (`src/components/MeToolkitSection.tsx`)**
   - **Real Hybrid Share Pro**: 360° Live Sonar Radar, Multi-Tech selector (`Wi-Fi Direct 5GHz`, `WebRTC P2P`, `Hotspot HTTP`, `Bluetooth BLE`), Receiver 2D QR + 1D Barcode + 6-Digit PIN, and Sender Live Camera Barcode/QR Scanner (`getUserMedia`).
   - **10 Photorealistic 3D Fluffy Puppy & Teddy Mascots**: Studio 3D renders (`src/assets/images/`) with horned checkered bucket hat, starry galaxy eyes, smiley headphones, and cassette tape in paws + custom photo upload.
   - **App Languages**: Clean 3-mode language switcher (`System Default (Auto)`, `English`, `हिन्दी (Hindi)`).
   - **Advanced Network Stream Studio**: Live embedded HD/4K stream player, 3 buffer modes, live ping telemetry, and 6 verified 4K/8K/HD stream channels.

---

## Complete Project File Structure (A to Z)

```text
├── index.html
├── metadata.json
├── package.json
├── tsconfig.json
├── vite.config.ts
├── .gitignore
├── .env.example
└── src/
    ├── main.tsx
    ├── index.css
    ├── App.tsx
    ├── data/
    │   └── mediaData.ts
    ├── components/
    │   ├── MediaVisuals.tsx
    │   ├── VideoPlayerModal.tsx
    │   ├── AudioStudioSection.tsx
    │   └── MeToolkitSection.tsx
    └── assets/
        └── images/
            ├── mascot_honey_teddy_3d_1794114727822.jpg
            ├── mascot_sky_puppy_3d_1794114729020.jpg
            ├── mascot_mocha_puppy_3d_1794114729811.jpg
            └── mascot_berry_teddy_3d_1794114730850.jpg
```

## Run Locally

```bash
npm install
npm run dev
```
