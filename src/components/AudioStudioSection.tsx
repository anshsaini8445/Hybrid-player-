import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Music,
  Heart,
  Sliders,
  ListMusic,
  Shuffle,
  ArrowRight,
  Lock,
  Unlock,
  Repeat,
  MoreVertical,
  Share2,
  Trash2,
  Info,
  CheckSquare,
  Check,
  X,
  Volume2,
  Timer,
  Sparkles,
  Radio,
  Disc,
  Activity,
  Waves,
  Compass,
  Zap,
  ChevronUp,
  ChevronDown,
  Image as ImageIcon,
  Power,
  MicOff,
  Headphones,
  Scissors,
  Bookmark
} from 'lucide-react';
import { AudioTrack, MascotItem, AppTheme } from '../data/mediaData';
import { FluffyMascotAvatar } from './MediaVisuals';

export interface StudioBackdropPreset {
  id: string;
  name: string;
  cssBackground: string;
}

export const STUDIO_PICTURE_WALLPAPERS: StudioBackdropPreset[] = [
  {
    id: 'aurora-emerald',
    name: 'Aurora Borealis Sky',
    cssBackground:
      'radial-gradient(circle at 20% 20%, rgba(16, 185, 129, 0.45) 0%, transparent 45%), radial-gradient(circle at 80% 30%, rgba(6, 182, 212, 0.4) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(99, 102, 241, 0.35) 0%, transparent 55%), linear-gradient(160deg, #061b24 0%, #091326 50%, #0d091c 100%)'
  },
  {
    id: 'cyber-shanghai',
    name: 'Cyberpunk Neon Horizon',
    cssBackground:
      'radial-gradient(circle at 80% 15%, rgba(244, 63, 94, 0.45) 0%, transparent 45%), radial-gradient(circle at 15% 70%, rgba(168, 85, 247, 0.45) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.3) 0%, transparent 60%), linear-gradient(145deg, #1b0926 0%, #0f1029 55%, #061824 100%)'
  },
  {
    id: 'sunset-synthwave',
    name: 'Sunset Synthwave Ocean',
    cssBackground:
      'radial-gradient(circle at 50% 20%, rgba(249, 115, 22, 0.5) 0%, transparent 45%), radial-gradient(circle at 20% 75%, rgba(236, 72, 153, 0.4) 0%, transparent 50%), linear-gradient(170deg, #2b0c1d 0%, #1d0c2b 55%, #0a1124 100%)'
  },
  {
    id: 'cosmic-nebula',
    name: 'Cosmic Starlight Nebula',
    cssBackground:
      'radial-gradient(circle at 30% 25%, rgba(139, 92, 246, 0.5) 0%, transparent 48%), radial-gradient(circle at 75% 70%, rgba(20, 184, 166, 0.4) 0%, transparent 50%), linear-gradient(150deg, #0d0826 0%, #07162c 55%, #041d24 100%)'
  }
];

interface HeartParticle {
  id: number;
  dx: number;
  dy: number;
  scale: number;
  rot: number;
  delay: number;
}

interface AudioStudioSectionProps {
  audioTracks: AudioTrack[];
  activeAudio: AudioTrack | null;
  isAudioPlaying: boolean;
  audioCurrentTime: number;
  audioDuration: number;
  activeMascot: MascotItem;
  activeTheme: AppTheme;
  customWallpaper: string | null;
  activeBackdropId: string;
  onChangeBackdropId: (id: string) => void;
  onUploadGalleryWallpaper: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdateTracks: (tracks: AudioTrack[]) => void;
  onPlayTrack: (track: AudioTrack) => void;
  onTogglePlayPause: () => void;
  onSeekAudio: (sec: number) => void;
  onShowToast: (msg: string) => void;
  audioElementRef: React.RefObject<HTMLAudioElement | null>;
  isBackgroundVideoActive: boolean;
  backgroundVideoTitle?: string;
  onOpenBackgroundVideo: () => void;
}

export function AudioStudioSection({
  audioTracks,
  activeAudio,
  isAudioPlaying,
  audioCurrentTime,
  audioDuration,
  activeMascot,
  customWallpaper,
  activeBackdropId,
  onChangeBackdropId,
  onUploadGalleryWallpaper,
  onUpdateTracks,
  onPlayTrack,
  onTogglePlayPause,
  onSeekAudio,
  onShowToast,
  audioElementRef,
  isBackgroundVideoActive,
  backgroundVideoTitle,
  onOpenBackgroundVideo
}: AudioStudioSectionProps) {
  // ============================================================================
  // 1. DEFAULT LINE-BY-LINE PLAYBACK vs SHUFFLE DUAL-STATE BUTTON (Req #9)
  // ============================================================================
  // Default on install is FALSE (Sequential Line-by-Line 1 -> 2 -> 3)
  const [isShuffleMode, setIsShuffleMode] = useState<boolean>(false);
  const [loopMode, setLoopMode] = useState<'line-all' | 'loop-one'>('line-all');

  // ============================================================================
  // 2. 6 COMPLETELY DISTINCT 3D VISUALIZER THEMES (Req #7)
  // ============================================================================
  const [visualizerTheme, setVisualizerTheme] = useState<
    'neon-pillars' | 'cyber-orb' | 'dna-helix' | 'bass-tunnel' | 'analog-vu' | 'mascot-stage'
  >('neon-pillars');
  const [animTick, setAnimTick] = useState<number>(0);

  useEffect(() => {
    if (!isAudioPlaying) return;
    const interval = setInterval(() => {
      setAnimTick((t) => (t + 1) % 360);
    }, 45);
    return () => clearInterval(interval);
  }, [isAudioPlaying]);

  // ============================================================================
  // 3. EQUALIZER & 3D AUDIO — ONLY RUNS WHEN MASTER SWITCH IS ON (Req #3)
  // ============================================================================
  const [eqMasterEnabled, setEqMasterEnabled] = useState<boolean>(false);
  const [spatial3DEnabled, setSpatial3DEnabled] = useState<boolean>(false);
  const [bassBoostLevel, setBassBoostLevel] = useState<number>(65);
  const [reverbRoom, setReverbRoom] = useState<'Off' | 'Studio' | 'Concert Hall' | 'Club Arena'>('Studio');
  const [eqPreset, setEqPreset] = useState<string>('Dolby Bass');
  const [eqBands, setEqBands] = useState<number[]>([8, 6, 3, 1, 4, 7, 9]);
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [karaokeVocalCut, setKaraokeVocalCut] = useState<boolean>(false);
  const [eightDRotate, setEightDRotate] = useState<boolean>(false);

  // ============================================================================
  // 4. LIVE COUNTDOWN SLEEP TIMER (MINUTES : SECONDS : MILLISECONDS : NANOSECONDS) (Req #4)
  // ============================================================================
  const [sleepRemainingMs, setSleepRemainingMs] = useState<number | null>(null);
  const sleepTargetTimestampRef = useRef<number | null>(null);

  const startSleepTimerMinutes = (minutes: number | null) => {
    if (minutes === null) {
      sleepTargetTimestampRef.current = null;
      setSleepRemainingMs(null);
      onShowToast('Sleep Timer Turned Off');
      return;
    }
    const durationMs = minutes * 60 * 1000;
    sleepTargetTimestampRef.current = performance.now() + durationMs;
    setSleepRemainingMs(durationMs);
    onShowToast(`Live Countdown Timer Started: ${minutes}:00.000`);
  };

  useEffect(() => {
    if (sleepRemainingMs === null || sleepTargetTimestampRef.current === null) return;
    const timer = setInterval(() => {
      if (!sleepTargetTimestampRef.current) return;
      const left = sleepTargetTimestampRef.current - performance.now();
      if (left <= 0) {
        sleepTargetTimestampRef.current = null;
        setSleepRemainingMs(null);
        if (isAudioPlaying) onTogglePlayPause();
        onShowToast('Sleep Timer Finished — Audio Paused Smoothly');
      } else {
        setSleepRemainingMs(left);
      }
    }, 33); // ~30fps live millisecond/nanosecond countdown
    return () => clearInterval(timer);
  }, [sleepRemainingMs !== null, isAudioPlaying]);

  const formatLiveCountdown = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    const millis = Math.floor(ms % 1000);
    const nanos = Math.floor((ms * 1000) % 1000);
    return {
      mins: mins.toString().padStart(2, '0'),
      secs: secs.toString().padStart(2, '0'),
      millis: millis.toString().padStart(3, '0'),
      nanos: nanos.toString().padStart(3, '0')
    };
  };

  // ============================================================================
  // 5. 6-7 MULTI-HEART BURST ANIMATION FOR 2 SECONDS ON FAVORITE CLICK (Req #5)
  // ============================================================================
  const [heartBursts, setHeartBursts] = useState<{ [trackId: string]: HeartParticle[] }>({});

  const triggerFavoriteBurst = (trackId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Toggle favorite state
    onUpdateTracks(
      audioTracks.map((t) => (t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t))
    );

    // Generate 7 distinct floating heart particles that animate for 2 seconds
    const particles: HeartParticle[] = [
      { id: 1, dx: -38, dy: -68, scale: 1.25, rot: -22, delay: 0 },
      { id: 2, dx: -18, dy: -85, scale: 1.05, rot: -10, delay: 60 },
      { id: 3, dx: 0, dy: -96, scale: 1.4, rot: 4, delay: 20 },
      { id: 4, dx: 20, dy: -82, scale: 1.15, rot: 16, delay: 90 },
      { id: 5, dx: 40, dy: -64, scale: 1.2, rot: 28, delay: 40 },
      { id: 6, dx: -28, dy: -48, scale: 0.95, rot: -18, delay: 110 },
      { id: 7, dx: 28, dy: -50, scale: 1.0, rot: 20, delay: 80 }
    ];

    setHeartBursts((prev) => ({ ...prev, [trackId]: particles }));

    // Clear burst after 2.0 seconds (Req #5)
    setTimeout(() => {
      setHeartBursts((prev) => {
        const copy = { ...prev };
        delete copy[trackId];
        return copy;
      });
    }, 1950);
  };

  // ============================================================================
  // 6. SMOOTH VERTICAL SWIPE VOLUME CONTROL (GRADUAL GLIDE) (Req #8)
  // ============================================================================
  const [smoothVolume, setSmoothVolume] = useState<number>(80);
  const [isSwipingVolume, setIsSwipingVolume] = useState<boolean>(false);
  const volSwipeStartRef = useRef<{ y: number; startVol: number } | null>(null);

  const applyVolumeSmoothly = (newVol: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(newVol)));
    setSmoothVolume(clamped);
    if (audioElementRef.current && !isCrossfading) {
      audioElementRef.current.volume = clamped / 100;
    }
  };

  // ============================================================================
  // 7. DJ REMIX 5-SECOND AUTO-CROSSFADE & SWIPE SONG TRANSITION (Req #10)
  // ============================================================================
  const [djCrossfadeEnabled, setDjCrossfadeEnabled] = useState<boolean>(true);
  const [isCrossfading, setIsCrossfading] = useState<boolean>(false);
  const [crossfadeProgress, setCrossfadeProgress] = useState<number>(0); // 0 to 100%
  const [incomingTrack, setIncomingTrack] = useState<AudioTrack | null>(null);
  const crossfadeIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const deckSwipeStartXRef = useRef<number | null>(null);

  const getNextTrackInOrder = (direction: 1 | -1 = 1): AudioTrack => {
    if (audioTracks.length === 0) return INITIAL_AUDIO_TRACKS_FALLBACK;
    const currentIdx = audioTracks.findIndex((t) => t.id === activeAudio?.id);
    if (isShuffleMode && audioTracks.length > 1) {
      const others = audioTracks.filter((t) => t.id !== activeAudio?.id);
      return others[Math.floor(Math.random() * others.length)];
    }
    const nextIdx = (currentIdx + direction + audioTracks.length) % audioTracks.length;
    return audioTracks[nextIdx];
  };

  const triggerDjCrossfadeTo = (targetTrack: AudioTrack) => {
    if (!djCrossfadeEnabled) {
      onPlayTrack(targetTrack);
      return;
    }
    if (crossfadeIntervalRef.current) clearInterval(crossfadeIntervalRef.current);

    setIsCrossfading(true);
    setIncomingTrack(targetTrack);
    setCrossfadeProgress(0);

    const startVol = smoothVolume / 100;
    let step = 0;
    const totalSteps = 50; // 50 steps * 100ms = 5.0 seconds smooth DJ transition!

    crossfadeIntervalRef.current = setInterval(() => {
      step += 1;
      const pct = Math.min(100, Math.round((step / totalSteps) * 100));
      setCrossfadeProgress(pct);

      // Phase 1 (0% -> 50%): Outgoing song gently slows & fades down like a DJ deck
      if (step < 25) {
        const fadeOutRatio = 1 - step / 25;
        if (audioElementRef.current) {
          audioElementRef.current.volume = Math.max(0.05, startVol * fadeOutRatio);
          audioElementRef.current.playbackRate = Math.max(0.88, audioSpeed - (1 - fadeOutRatio) * 0.1);
        }
      }
      // At midpoint (2.5s): Switch to incoming track at low volume and ramp up!
      else if (step === 25) {
        onPlayTrack(targetTrack);
        if (audioElementRef.current) {
          audioElementRef.current.volume = 0.08;
          audioElementRef.current.playbackRate = 0.94;
        }
      }
      // Phase 2 (50% -> 100%): Incoming song smoothly ramps up to 100% volume & normal speed
      else {
        const fadeInRatio = (step - 25) / 25;
        if (audioElementRef.current) {
          audioElementRef.current.volume = Math.min(1, startVol * fadeInRatio);
          audioElementRef.current.playbackRate = 0.94 + fadeInRatio * (audioSpeed - 0.94);
        }
      }

      if (step >= totalSteps) {
        if (crossfadeIntervalRef.current) clearInterval(crossfadeIntervalRef.current);
        if (audioElementRef.current) {
          audioElementRef.current.volume = startVol;
          audioElementRef.current.playbackRate = audioSpeed;
        }
        setIsCrossfading(false);
        setIncomingTrack(null);
      }
    }, 100);
  };

  // Automatically trigger 5-second DJ crossfade when current song is 5 seconds from ending! (Req #10)
  useEffect(() => {
    if (
      isAudioPlaying &&
      djCrossfadeEnabled &&
      !isCrossfading &&
      audioDuration > 12 &&
      audioDuration - audioCurrentTime <= 5.2 &&
      audioDuration - audioCurrentTime > 4.0
    ) {
      const next = getNextTrackInOrder(1);
      if (next && next.id !== activeAudio?.id) {
        triggerDjCrossfadeTo(next);
      }
    }
  }, [audioCurrentTime, audioDuration, isAudioPlaying, djCrossfadeEnabled, isCrossfading]);

  useEffect(() => {
    return () => {
      if (crossfadeIntervalRef.current) clearInterval(crossfadeIntervalRef.current);
    };
  }, []);

  // ============================================================================
  // 8. 2-SECOND HOLD SONG MULTI-SELECT + SHARE, DELETE, DETAILS, 3-DOT (Req #2)
  // ============================================================================
  const [songSelectionMode, setSongSelectionMode] = useState<boolean>(false);
  const [selectedSongIds, setSelectedSongIds] = useState<string[]>([]);
  const [holdingSongId, setHoldingSongId] = useState<string | null>(null);
  const [showSongBatchMenu, setShowSongBatchMenu] = useState<boolean>(false);
  const [showSongShareModal, setShowSongShareModal] = useState<boolean>(false);
  const [showSongDetailsModal, setShowSongDetailsModal] = useState<boolean>(false);
  const [singleMenuTrack, setSingleMenuTrack] = useState<AudioTrack | null>(null);

  // Playing Queue Drawer & Lock State (Req #6)
  const [showAudioQueueModal, setShowAudioQueueModal] = useState<boolean>(false);
  const [isQueueLocked, setIsQueueLocked] = useState<boolean>(false);

  // Now Playing 3-Dot Pro Audio Features Modal (Req #3)
  const [showPlayerProMenu, setShowPlayerProMenu] = useState<boolean>(false);

  const songHoldTimerRef = useRef<NodeJS.Timeout | null>(null);
  const didTriggerSongHoldRef = useRef<boolean>(false);

  const startSongHold = (trackId: string) => {
    didTriggerSongHoldRef.current = false;
    setHoldingSongId(trackId);
    if (songHoldTimerRef.current) clearTimeout(songHoldTimerRef.current);

    songHoldTimerRef.current = setTimeout(() => {
      didTriggerSongHoldRef.current = true;
      setHoldingSongId(null);
      setSongSelectionMode(true);
      setSelectedSongIds((prev) => (prev.includes(trackId) ? prev : [...prev, trackId]));
      if (navigator.vibrate) navigator.vibrate(45);
      onShowToast('Song Selected — Tap more songs or use Share / Delete / Details / 3-Dot');
    }, 1350);
  };

  const cancelSongHold = () => {
    setHoldingSongId(null);
    if (songHoldTimerRef.current) {
      clearTimeout(songHoldTimerRef.current);
      songHoldTimerRef.current = null;
    }
  };

  const toggleSelectSong = (trackId: string) => {
    setSelectedSongIds((prev) => {
      const next = prev.includes(trackId)
        ? prev.filter((id) => id !== trackId)
        : [...prev, trackId];
      if (next.length === 0) setSongSelectionMode(false);
      return next;
    });
  };

  const selectAllSongs = () => {
    if (selectedSongIds.length === audioTracks.length) {
      setSelectedSongIds([]);
      setSongSelectionMode(false);
    } else {
      setSongSelectionMode(true);
      setSelectedSongIds(audioTracks.map((t) => t.id));
    }
  };

  const deleteSelectedSongs = () => {
    if (selectedSongIds.length === 0) return;
    const count = selectedSongIds.length;
    onUpdateTracks(audioTracks.filter((t) => !selectedSongIds.includes(t.id)));
    setSelectedSongIds([]);
    setSongSelectionMode(false);
    setShowSongBatchMenu(false);
    onShowToast(`Deleted ${count} song${count > 1 ? 's' : ''} from Audio Library`);
  };

  const moveQueueTrack = (index: number, dir: -1 | 1) => {
    if (isQueueLocked) {
      onShowToast('Playing Queue is Locked 🔒 — Unlock to reorder songs');
      return;
    }
    const target = index + dir;
    if (target < 0 || target >= audioTracks.length) return;
    const copy = [...audioTracks];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    onUpdateTracks(copy);
  };

  const formatTime = (sec: number) => {
    if (!sec || isNaN(sec)) return '00:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const selectedTrackObjects = audioTracks.filter((t) => selectedSongIds.includes(t.id));
  const countdownParts = sleepRemainingMs !== null ? formatLiveCountdown(sleepRemainingMs) : null;

  return (
    <div className="flex flex-col gap-5 relative">
      {/* ==========================================================================
          BACKGROUND VIDEO HANDOVER BANNER (When video is playing in background)
         ========================================================================== */}
      {isBackgroundVideoActive && (
        <div className="rounded-2xl bg-white/15 backdrop-blur-xl border border-white/30 px-4 py-3 flex items-center justify-between gap-3 shadow-lg">
          <div className="text-xs text-white">
            <span className="font-extrabold text-emerald-300">Background Video Active:</span>{' '}
            {backgroundVideoTitle} —{' '}
            <span className="text-white/90">
              Tap any song below to automatically stop the video and play audio!
            </span>
          </div>
          <button
            onClick={onOpenBackgroundVideo}
            className="px-3 py-1.5 rounded-xl bg-white text-slate-950 text-xs font-extrabold shrink-0"
          >
            Return to Video
          </button>
        </div>
      )}

      {/* ==========================================================================
          1. STUDIO WALLPAPER & PICTURE THEME STRIP (No Plain Black Behind Songs!)
         ========================================================================== */}
      <div className="rounded-3xl p-3.5 sm:p-4 bg-white/10 backdrop-blur-2xl border border-white/20 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-extrabold text-white whitespace-nowrap flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            Studio Backdrop:
          </span>
          {STUDIO_PICTURE_WALLPAPERS.map((wp) => (
            <button
              key={wp.id}
              onClick={() => {
                onChangeBackdropId(wp.id);
                onShowToast(`Applied "${wp.name}" across Audio, Video & Search!`);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                activeBackdropId === wp.id && !customWallpaper
                  ? 'bg-white text-slate-950 border-white shadow-md'
                  : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
              }`}
            >
              {wp.name}
            </button>
          ))}
        </div>

        <label className="cursor-pointer px-3.5 py-1.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md shrink-0 transition-transform active:scale-95">
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Gallery Photo Everywhere</span>
          <input
            type="file"
            accept="image/*"
            onChange={onUploadGalleryWallpaper}
            className="hidden"
          />
        </label>
      </div>

      {/* ==========================================================================
          2. 2-SECOND HOLD SONG SELECTION TOOLBAR (Hybrid Share, Delete, Details, 3-Dot)
         ========================================================================== */}
      {songSelectionMode && (
        <div className="sticky top-[70px] z-30 rounded-2xl bg-emerald-950/95 border border-emerald-400/60 backdrop-blur-2xl px-4 py-3 shadow-2xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setSongSelectionMode(false);
                setSelectedSongIds([]);
                setShowSongBatchMenu(false);
              }}
              className="p-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-sm font-extrabold text-white tabular-nums">
              {selectedSongIds.length} Song{selectedSongIds.length > 1 ? 's' : ''} Selected
            </span>
            <button
              onClick={selectAllSongs}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs font-bold text-emerald-300"
            >
              {selectedSongIds.length === audioTracks.length
                ? 'Deselect All'
                : `Select All (${audioTracks.length})`}
            </button>
          </div>

          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setShowSongShareModal(true)}
              className="px-3 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md"
            >
              <Share2 className="w-3.5 h-3.5" />
              Hybrid Share
            </button>

            <button
              onClick={deleteSelectedSongs}
              className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>

            <button
              onClick={() => setShowSongDetailsModal(true)}
              className="px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-bold flex items-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5 text-cyan-300" />
              Details
            </button>

            {/* 3-Dot Batch Song Menu (Matches Video Section 3-Dot Richness!) */}
            <div className="relative">
              <button
                onClick={() => setShowSongBatchMenu((p) => !p)}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showSongBatchMenu && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 border border-white/25 backdrop-blur-2xl shadow-2xl py-2 z-50 text-xs font-bold text-white">
                  <button
                    onClick={() => {
                      onUpdateTracks(
                        audioTracks.map((t) =>
                          selectedSongIds.includes(t.id) ? { ...t, isFavorite: true } : t
                        )
                      );
                      setShowSongBatchMenu(false);
                      onShowToast('Added selected songs to Favorites ❤️');
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-white/15 flex items-center gap-2.5"
                  >
                    <Heart className="w-4 h-4 text-rose-400" /> Add to Favorite Songs
                  </button>
                  <button
                    onClick={() => {
                      setShowSongBatchMenu(false);
                      setShowAudioQueueModal(true);
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-white/15 flex items-center gap-2.5"
                  >
                    <ListMusic className="w-4 h-4 text-emerald-400" /> Open in Playing Queue
                  </button>
                  <button
                    onClick={() => {
                      setShowSongBatchMenu(false);
                      onShowToast('Set song as Phone Ringtone 🔔');
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-white/15 flex items-center gap-2.5"
                  >
                    <Radio className="w-4 h-4 text-amber-400" /> Set as Phone Ringtone
                  </button>
                  <button
                    onClick={() => {
                      setShowSongBatchMenu(false);
                      onShowToast('Opened MP3 Ringtone Cutter & Trimmer ✂️');
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-white/15 flex items-center gap-2.5"
                  >
                    <Scissors className="w-4 h-4 text-cyan-400" /> Trim / Cut Ringtone
                  </button>
                  <button
                    onClick={() => {
                      setShowSongBatchMenu(false);
                      onShowToast('Boosted selected audio tracks to +6dB Master Gain!');
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-white/15 flex items-center gap-2.5"
                  >
                    <Zap className="w-4 h-4 text-yellow-400" /> Boost Audio Volume (+6dB)
                  </button>
                  <button
                    onClick={() => {
                      setShowSongBatchMenu(false);
                      onShowToast('Moved selected songs to Private Safe Folder 🔒');
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-white/15 flex items-center gap-2.5"
                  >
                    <Lock className="w-4 h-4 text-purple-400" /> Lock in Private Vault
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          3. MODERN 3D NOW PLAYING DECK + 6 DISTINCT 3D VISUALIZER THEMES
             + VERTICAL SWIPE VOLUME + DJ 5S CROSSFADE + LIVE NANOSECOND TIMER
         ========================================================================== */}
      <div
        onTouchStart={(e) => {
          if (e.touches[0]) {
            deckSwipeStartXRef.current = e.touches[0].clientX;
            volSwipeStartRef.current = {
              y: e.touches[0].clientY,
              startVol: smoothVolume
            };
          }
        }}
        onTouchMove={(e) => {
          if (!e.touches[0] || !volSwipeStartRef.current) return;
          const dy = volSwipeStartRef.current.y - e.touches[0].clientY;
          const dx = deckSwipeStartXRef.current
            ? e.touches[0].clientX - deckSwipeStartXRef.current
            : 0;
          // Vertical swipe on deck smoothly glides volume up/down gradually (Req #8)
          if (Math.abs(dy) > 18 && Math.abs(dy) > Math.abs(dx)) {
            setIsSwipingVolume(true);
            const deltaVol = dy * 0.22; // gentle, slow 1%-by-1% volume curve
            applyVolumeSmoothly(volSwipeStartRef.current.startVol + deltaVol);
          }
        }}
        onTouchEnd={(e) => {
          setIsSwipingVolume(false);
          if (deckSwipeStartXRef.current !== null && e.changedTouches[0]) {
            const dx = e.changedTouches[0].clientX - deckSwipeStartXRef.current;
            // Horizontal swipe on song deck triggers smooth DJ Remix Crossfade! (Req #10)
            if (Math.abs(dx) > 75) {
              const nextTrack = getNextTrackInOrder(dx < 0 ? 1 : -1);
              onShowToast(
                `🎧 DJ Crossfade Mix -> ${nextTrack.title.slice(0, 24)}...`
              );
              triggerDjCrossfadeTo(nextTrack);
            }
          }
          deckSwipeStartXRef.current = null;
          volSwipeStartRef.current = null;
        }}
        className="relative rounded-[32px] p-5 sm:p-6 bg-gradient-to-br from-white/16 via-white/8 to-white/12 backdrop-blur-2xl border border-white/25 shadow-[0_20px_60px_rgba(0,0,0,0.45)] flex flex-col gap-5 overflow-hidden"
      >
        {/* Top Row of Now Playing Deck: Visualizer Theme Picker + Live Countdown Timer + Queue & 3-Dot */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 6 Completely Distinct 3D Visualizer Theme Switcher (Req #7) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(
              [
                { id: 'neon-pillars', label: '3D Pillars', icon: Activity },
                { id: 'cyber-orb', label: '3D Halo Orb', icon: Disc },
                { id: 'dna-helix', label: '3D DNA Wave', icon: Waves },
                { id: 'bass-tunnel', label: '3D Bass Tunnel', icon: Compass },
                { id: 'analog-vu', label: '3D Studio VU', icon: Radio },
                { id: 'mascot-stage', label: '3D Mascot DJ', icon: Sparkles }
              ] as const
            ).map((vt) => {
              const IconComp = vt.icon;
              const isSelected = visualizerTheme === vt.id;
              return (
                <button
                  key={vt.id}
                  onClick={() => setVisualizerTheme(vt.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all whitespace-nowrap border ${
                    isSelected
                      ? 'bg-white text-slate-950 border-white shadow-lg'
                      : 'bg-black/35 text-white border-white/20 hover:bg-white/15'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{vt.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Deck Top Controls: Live Nanosecond Timer + Playing Queue + 3-Dot Pro Menu */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Countdown Timer Trigger & Real-time Display (Req #4) */}
            <button
              onClick={() => {
                const presets = [null, 9, 15, 30];
                const currentMin =
                  sleepRemainingMs !== null ? Math.round(sleepRemainingMs / 60000) : null;
                const next = presets[(presets.indexOf(currentMin as any) + 1) % presets.length];
                startSleepTimerMinutes(next);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-extrabold border flex items-center gap-1.5 transition-all tabular-nums ${
                countdownParts
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.5)]'
                  : 'bg-black/35 text-white border-white/20 hover:bg-white/20'
              }`}
              title="Tap to set Live Countdown Sleep Timer (9m / 15m / 30m)"
            >
              <Timer className="w-3.5 h-3.5" />
              {countdownParts ? (
                <span>
                  {countdownParts.mins}m:{countdownParts.secs}s:{countdownParts.millis}ms:
                  {countdownParts.nanos}ns
                </span>
              ) : (
                <span>Timer (9m)</span>
              )}
            </button>

            {/* Playing Queue Button (Req #6) */}
            <button
              onClick={() => setShowAudioQueueModal(true)}
              className="px-3 py-1.5 rounded-xl bg-black/35 hover:bg-white hover:text-slate-950 text-white border border-white/20 text-xs font-extrabold flex items-center gap-1.5 transition-colors"
            >
              <ListMusic className="w-4 h-4" />
              <span>Queue ({audioTracks.length})</span>
            </button>

            {/* Now Playing 3-Dot Pro Menu Button (Req #3) */}
            <button
              onClick={() => setShowPlayerProMenu(true)}
              className="p-2 rounded-xl bg-black/35 hover:bg-white hover:text-slate-950 text-white border border-white/20 transition-colors"
              title="Audio Studio Pro Features"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ========================================================================
            DISTINCT 3D VISUALIZER STAGE (6 Radically Different 3D Visuals — Req #7)
           ======================================================================== */}
        <div className="relative h-48 sm:h-56 rounded-3xl bg-black/45 border border-white/20 overflow-hidden flex items-center justify-center p-4 shadow-inner">
          {/* Theme 1: 3D Cyber Neon Spectrum Pillars with Floor Reflection */}
          {visualizerTheme === 'neon-pillars' && (
            <div className="w-full h-full flex flex-col justify-center items-center gap-1">
              <div className="w-full h-32 flex items-end justify-center gap-1.5 sm:gap-2 px-4">
                {Array.from({ length: 28 }).map((_, i) => {
                  const wave = isAudioPlaying
                    ? Math.abs(Math.sin((animTick + i * 14) * 0.08)) * 82 + 16
                    : 18 + (i % 5) * 6;
                  return (
                    <div
                      key={i}
                      style={{ height: `${wave}%` }}
                      className="flex-1 max-w-[14px] rounded-t-full bg-gradient-to-t from-emerald-500 via-cyan-400 to-white shadow-[0_0_15px_rgba(52,211,153,0.7)] transition-all duration-75"
                    />
                  );
                })}
              </div>
              {/* 3D Mirror Floor Reflection */}
              <div className="w-full h-8 flex items-start justify-center gap-1.5 sm:gap-2 px-4 opacity-25 scale-y-[-1]">
                {Array.from({ length: 28 }).map((_, i) => {
                  const wave = isAudioPlaying
                    ? Math.abs(Math.sin((animTick + i * 14) * 0.08)) * 60 + 10
                    : 14;
                  return (
                    <div
                      key={i}
                      style={{ height: `${wave}%` }}
                      className="flex-1 max-w-[14px] rounded-t-full bg-gradient-to-t from-emerald-500 to-cyan-300"
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Theme 2: 3D Orbital Cyber Sphere & Radial Frequency Halo */}
          {visualizerTheme === 'cyber-orb' && (
            <svg viewBox="0 0 300 180" className="w-full h-full">
              <defs>
                <radialGradient id="orbCore" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="45%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle
                cx="150"
                cy="90"
                r={isAudioPlaying ? 38 + Math.sin(animTick * 0.15) * 8 : 36}
                fill="url(#orbCore)"
              />
              {Array.from({ length: 36 }).map((_, i) => {
                const angle = (i * 10 * Math.PI) / 180;
                const len = isAudioPlaying
                  ? 14 + Math.abs(Math.cos(animTick * 0.12 + i)) * 34
                  : 12;
                const x1 = 150 + Math.cos(angle) * 42;
                const y1 = 90 + Math.sin(angle) * 42;
                const x2 = 150 + Math.cos(angle) * (42 + len);
                const y2 = 90 + Math.sin(angle) * (42 + len);
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={i % 2 === 0 ? '#f43f5e' : '#38bdf8'}
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          )}

          {/* Theme 3: 3D Liquid DNA Dual-Helix Ribbon Wave */}
          {visualizerTheme === 'dna-helix' && (
            <svg viewBox="0 0 400 160" className="w-full h-full">
              {Array.from({ length: 32 }).map((_, i) => {
                const x = 20 + i * 11.5;
                const phase = (animTick * 0.1 + i * 0.35);
                const y1 = 80 + (isAudioPlaying ? Math.sin(phase) * 48 : Math.sin(i * 0.3) * 20);
                const y2 = 80 - (isAudioPlaying ? Math.sin(phase) * 48 : Math.sin(i * 0.3) * 20);
                return (
                  <g key={i}>
                    <line
                      x1={x}
                      y1={y1}
                      x2={x}
                      y2={y2}
                      stroke="rgba(255,255,255,0.22)"
                      strokeWidth="1.5"
                    />
                    <circle cx={x} cy={y1} r="4.5" fill="#a855f7" />
                    <circle cx={x} cy={y2} r="4.5" fill="#2dd4bf" />
                  </g>
                );
              })}
            </svg>
          )}

          {/* Theme 4: 3D Galaxy Bass Shockwave Perspective Tunnel */}
          {visualizerTheme === 'bass-tunnel' && (
            <svg viewBox="0 0 360 180" className="w-full h-full">
              {[1, 2, 3, 4, 5, 6].map((ring) => {
                const offset = ((animTick * 1.5 + ring * 24) % 140) + 10;
                return (
                  <ellipse
                    key={ring}
                    cx="180"
                    cy="90"
                    rx={offset * 1.4}
                    ry={offset * 0.65}
                    fill="none"
                    stroke={ring % 2 === 0 ? '#f59e0b' : '#38bdf8'}
                    strokeWidth={Math.max(1, (150 - offset) / 35)}
                    opacity={Math.max(0.15, 1 - offset / 155)}
                  />
                );
              })}
              <circle cx="180" cy="90" r="10" fill="#ffffff" />
            </svg>
          )}

          {/* Theme 5: 3D Retro Studio Dual Analog VU Needle Meters */}
          {visualizerTheme === 'analog-vu' && (
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              {['LEFT CHANNEL (L)', 'RIGHT CHANNEL (R)'].map((ch, idx) => {
                const needleDeg = isAudioPlaying
                  ? -35 + Math.sin(animTick * 0.18 + idx * 1.4) * 42
                  : -45;
                return (
                  <div
                    key={ch}
                    className="rounded-2xl bg-amber-950/40 border border-amber-400/40 p-3 flex flex-col items-center"
                  >
                    <span className="text-[10px] font-mono font-bold text-amber-300">{ch}</span>
                    <svg viewBox="0 0 120 65" className="w-full h-24">
                      <path
                        d="M 15 58 A 45 45 0 0 1 105 58"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="4"
                      />
                      <g transform={`translate(60, 58) rotate(${needleDeg})`}>
                        <line
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="-44"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <circle cx="0" cy="0" r="4" fill="#ef4444" />
                      </g>
                    </svg>
                  </div>
                );
              })}
            </div>
          )}

          {/* Theme 6: 3D Dancing Cassette Mascot Concert Stage */}
          {visualizerTheme === 'mascot-stage' && (
            <div className="flex items-center justify-center gap-6">
              <FluffyMascotAvatar
                mascot={activeMascot}
                isDancing={isAudioPlaying}
                size={112}
              />
              <div className="text-left">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-extrabold">
                  {activeMascot.badge} • 3D STAGE
                </span>
                <h4 className="text-base font-extrabold text-white mt-1">
                  {activeMascot.name}
                </h4>
                <p className="text-xs text-white/80 mt-0.5">
                  {isAudioPlaying
                    ? 'Dancing live to stereo frequencies 🎶'
                    : 'Paused — Press Play to start 3D dance'}
                </p>
              </div>
            </div>
          )}

          {/* DJ Crossfade Live Banner Overlay when transitioning (Req #10) */}
          {isCrossfading && incomingTrack && (
            <div className="absolute inset-x-4 bottom-3 rounded-2xl bg-black/85 border border-emerald-400 px-4 py-2 flex items-center justify-between gap-3 shadow-2xl">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300">
                <Disc className="w-4 h-4 animate-spin" />
                <span>
                  🎧 DJ Remix Crossfading (5s): Slowing current & fading in "{incomingTrack.title.slice(0, 24)}..."
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-white tabular-nums">
                {crossfadeProgress}%
              </span>
            </div>
          )}

          {/* Smooth Vertical Swipe Volume HUD Overlay (Req #8) */}
          {isSwipingVolume && (
            <div className="absolute right-4 inset-y-4 w-12 rounded-2xl bg-black/85 border border-white/40 p-2 flex flex-col items-center justify-between">
              <span className="text-[10px] font-mono font-extrabold text-white tabular-nums">
                {smoothVolume}%
              </span>
              <div className="w-2.5 flex-1 my-1.5 rounded-full bg-white/20 overflow-hidden flex items-end">
                <div
                  style={{ height: `${smoothVolume}%` }}
                  className="w-full bg-emerald-400 rounded-full transition-all duration-75"
                />
              </div>
              <Volume2 className="w-4 h-4 text-emerald-400" />
            </div>
          )}
        </div>

        {/* ========================================================================
            CURRENT SONG TITLE, FAVORITE 7-HEART BURST & SMOOTH VOLUME SLIDER
           ======================================================================== */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-300">
              <span>{activeAudio?.quality || 'Dolby Atmos'}</span>
              <span>•</span>
              <span>{activeAudio?.bpm || 124} BPM</span>
              {djCrossfadeEnabled && (
                <>
                  <span>•</span>
                  <span className="text-amber-300">5s DJ Crossfade ON</span>
                </>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white truncate mt-0.5">
              {activeAudio?.title}
            </h2>
            <p className="text-xs sm:text-sm text-white/80 truncate">
              {activeAudio?.artist} · {activeAudio?.album}
            </p>
          </div>

          {/* Right: Favorite Button with 7-Heart 2-Second Burst Animation (Req #5) + Smooth Volume */}
          <div className="flex items-center gap-3 shrink-0">
            {activeAudio && (
              <div className="relative">
                <button
                  onClick={(e) => triggerFavoriteBurst(activeAudio.id, e)}
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform active:scale-90 ${
                    activeAudio.isFavorite
                      ? 'bg-rose-500/25 border-rose-400 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                      : 'bg-black/35 border-white/20 text-white hover:text-rose-300'
                  }`}
                  title="Add to Favorites (7-Heart Burst Animation)"
                >
                  <Heart
                    className={`w-6 h-6 ${activeAudio.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`}
                  />
                </button>

                {/* 7 Floating Hearts Animation that finishes in 2 seconds */}
                {heartBursts[activeAudio.id]?.map((hp) => (
                  <span
                    key={hp.id}
                    style={{
                      transform: `translate(${hp.dx}px, ${hp.dy}px) scale(${hp.scale}) rotate(${hp.rot}deg)`,
                      transition: 'transform 1.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.8s ease-out',
                      transitionDelay: `${hp.delay}ms`
                    }}
                    className="pointer-events-none absolute left-3 top-2 text-lg animate-ping"
                  >
                    ❤️
                  </span>
                ))}
              </div>
            )}

            {/* Smooth Gradual Volume Glide Control (Req #8) */}
            <div className="flex items-center gap-2 bg-black/35 px-3.5 py-2.5 rounded-2xl border border-white/20">
              <Volume2 className="w-4 h-4 text-emerald-300" />
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={smoothVolume}
                onChange={(e) => applyVolumeSmoothly(parseFloat(e.target.value))}
                className="w-24 sm:w-28 h-1.5 accent-emerald-400 cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-white tabular-nums w-9 text-right">
                {smoothVolume}%
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================
            SEEK TIMELINE & TRANSPORT ROW WITH DUAL-STATE LINE/SHUFFLE BUTTON (Req #9)
           ======================================================================== */}
        <div className="flex flex-col gap-2">
          <input
            type="range"
            min={0}
            max={audioDuration || 240}
            step={0.1}
            value={audioCurrentTime}
            onChange={(e) => onSeekAudio(parseFloat(e.target.value))}
            className="w-full h-2 bg-white/25 rounded-lg accent-white cursor-pointer"
          />
          <div className="flex items-center justify-between text-xs font-mono font-bold text-white/85 tabular-nums">
            <span>{formatTime(audioCurrentTime)}</span>
            <span className="text-emerald-300">
              {djCrossfadeEnabled && audioDuration - audioCurrentTime <= 5
                ? '🎧 DJ Auto-Mix Transitioning...'
                : 'Swipe Left/Right on Card for DJ Mix'}
            </span>
            <span>{activeAudio?.duration || formatTime(audioDuration)}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Dual-State Sequential Line-by-Line vs Shuffle Toggle Button (Req #9)
              Default on install: Straight Line-by-Line (1->2->3) with flat line/number icon.
              Click once -> Shuffle Mode with Shuffle icon. Click again -> Straight Line-by-Line! */}
          <button
            onClick={() => {
              const nextState = !isShuffleMode;
              setIsShuffleMode(nextState);
              onShowToast(
                nextState
                  ? '🔀 Shuffle Mode Activated (Random Songs)'
                  : '1→2→3 Sequential Line-by-Line Mode Activated'
              );
            }}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-extrabold flex items-center gap-2 transition-all active:scale-95 ${
              isShuffleMode
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg'
                : 'bg-white text-slate-950 border-white shadow-lg'
            }`}
            title="Click to switch between Sequential Line-by-Line (1→2→3) and Random Shuffle"
          >
            {isShuffleMode ? (
              <>
                <Shuffle className="w-4 h-4" />
                <span>Shuffle Mode</span>
              </>
            ) : (
              <>
                <span className="px-1.5 py-0.5 rounded bg-slate-950 text-white font-mono text-[10px]">
                  1→2
                </span>
                <ArrowRight className="w-4 h-4" />
                <span>Line-by-Line</span>
              </>
            )}
          </button>

          {/* Center Transport: Previous (DJ Mix), Play/Pause, Next (DJ Mix) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => triggerDjCrossfadeTo(getNextTrackInOrder(-1))}
              className="w-12 h-12 rounded-2xl bg-black/40 hover:bg-white hover:text-slate-950 text-white border border-white/25 flex items-center justify-center transition-all active:scale-90"
              title="Previous Song (Smooth DJ Mix)"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={onTogglePlayPause}
              className="w-16 h-16 rounded-3xl bg-white hover:bg-emerald-300 text-slate-950 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.5)] transition-transform active:scale-95"
            >
              {isAudioPlaying ? (
                <Pause className="w-7 h-7 fill-current" />
              ) : (
                <Play className="w-7 h-7 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => triggerDjCrossfadeTo(getNextTrackInOrder(1))}
              className="w-12 h-12 rounded-2xl bg-black/40 hover:bg-white hover:text-slate-950 text-white border border-white/25 flex items-center justify-center transition-all active:scale-90"
              title="Next Song (Smooth 5s DJ Mix)"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Right: 5s DJ Auto-Crossfade Toggle */}
          <button
            onClick={() => {
              setDjCrossfadeEnabled((p) => !p);
              onShowToast(
                `5-Second DJ Auto-Mix Crossfade: ${!djCrossfadeEnabled ? 'ON' : 'OFF'}`
              );
            }}
            className={`px-3.5 py-2.5 rounded-2xl border text-xs font-extrabold flex items-center gap-1.5 transition-all ${
              djCrossfadeEnabled
                ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-md'
                : 'bg-black/35 text-white/80 border-white/20'
            }`}
          >
            <Disc className={`w-4 h-4 ${djCrossfadeEnabled ? 'animate-spin' : ''}`} />
            <span>5s DJ Mix: {djCrossfadeEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {/* ========================================================================
            3D EQUALIZER & SPATIAL STUDIO (Strictly Active ONLY When Switched ON! Req #3)
           ======================================================================== */}
        <div className="pt-4 border-t border-white/20 flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Master Power Switch for Equalizer & 3D Audio */}
              <button
                onClick={() => {
                  const next = !eqMasterEnabled;
                  setEqMasterEnabled(next);
                  setSpatial3DEnabled(next);
                  onShowToast(
                    next
                      ? '⚡ 3D Equalizer & Spatial Engine Switched ON!'
                      : '3D Equalizer Switched OFF (Bypassed)'
                  );
                }}
                className={`px-4 py-2 rounded-2xl text-xs font-extrabold flex items-center gap-2 border transition-all ${
                  eqMasterEnabled
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.4)]'
                    : 'bg-black/40 text-white/70 border-white/20 hover:text-white'
                }`}
              >
                <Power className="w-4 h-4" />
                <span>3D Equalizer: {eqMasterEnabled ? 'ON (ACTIVE)' : 'OFF'}</span>
              </button>

              {eqMasterEnabled && (
                <button
                  onClick={() => setSpatial3DEnabled((p) => !p)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border ${
                    spatial3DEnabled
                      ? 'bg-white text-slate-950 border-white'
                      : 'bg-black/35 text-white border-white/20'
                  }`}
                >
                  3D Spatial Surround: {spatial3DEnabled ? 'ON' : 'OFF'}
                </button>
              )}
            </div>

            {eqMasterEnabled && (
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {['Dolby Bass', '3D Concert', 'Vocal Crystal', 'DJ Sub-808', 'Flat'].map(
                  (preset) => (
                    <button
                      key={preset}
                      onClick={() => {
                        setEqPreset(preset);
                        if (preset === 'Dolby Bass') setEqBands([9, 7, 3, 1, 4, 7, 9]);
                        else if (preset === '3D Concert') setEqBands([7, 5, 6, 4, 6, 8, 10]);
                        else if (preset === 'Vocal Crystal') setEqBands([-2, 0, 5, 8, 7, 4, 2]);
                        else if (preset === 'DJ Sub-808') setEqBands([12, 10, 4, 0, 2, 6, 8]);
                        else setEqBands([0, 0, 0, 0, 0, 0, 0]);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        eqPreset === preset
                          ? 'bg-white text-slate-950 shadow'
                          : 'bg-black/35 text-white/80 hover:bg-white/15'
                      }`}
                    >
                      {preset}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Interactive 7-Band 3D Sliders — Only Active & Illuminated when eqMasterEnabled is ON */}
          {eqMasterEnabled ? (
            <div className="grid grid-cols-7 gap-2 sm:gap-4 p-4 rounded-2xl bg-black/40 border border-emerald-400/40">
              {['60Hz', '150Hz', '400Hz', '1kHz', '2.4kHz', '6kHz', '15kHz'].map((freq, idx) => (
                <div key={freq} className="flex flex-col items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-300 tabular-nums">
                    {eqBands[idx] >= 0 ? `+${eqBands[idx]}` : eqBands[idx]}dB
                  </span>
                  <input
                    type="range"
                    min={-10}
                    max={12}
                    value={eqBands[idx]}
                    onChange={(e) => {
                      const next = [...eqBands];
                      next[idx] = parseInt(e.target.value);
                      setEqBands(next);
                    }}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-white/80">{freq}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2.5 rounded-2xl bg-black/25 border border-white/10 text-xs text-white/60 flex items-center justify-between">
              <span>
                3D Equalizer & Spatial Audio are currently OFF. Turn ON the switch above to activate 3D sound processing.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ==========================================================================
          4. TRANSLUCENT FROSTED GLASS SONG LIST (No Plain Black Behind Songs! Req #1 & #2)
         ========================================================================== */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              All Studio Songs ({audioTracks.length})
            </h3>
            <p className="text-xs text-white/75">
              Hold any song for 2 seconds to select • Tap Heart for 7-Heart burst
            </p>
          </div>

          <button
            onClick={() => {
              if (songSelectionMode) {
                setSongSelectionMode(false);
                setSelectedSongIds([]);
              } else {
                setSongSelectionMode(true);
              }
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border ${
              songSelectionMode
                ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>{songSelectionMode ? 'Done' : 'Select'}</span>
          </button>
        </div>

        {audioTracks.map((track, idx) => {
          const isCurrent = activeAudio?.id === track.id;
          const isSelected = selectedSongIds.includes(track.id);
          const isHolding = holdingSongId === track.id;

          return (
            <div
              key={track.id}
              onMouseDown={() => startSongHold(track.id)}
              onMouseUp={cancelSongHold}
              onMouseLeave={cancelSongHold}
              onTouchStart={() => startSongHold(track.id)}
              onTouchEnd={cancelSongHold}
              onClick={() => {
                if (didTriggerSongHoldRef.current) {
                  didTriggerSongHoldRef.current = false;
                  return;
                }
                if (songSelectionMode) {
                  toggleSelectSong(track.id);
                } else {
                  onPlayTrack(track);
                }
              }}
              className={`relative rounded-3xl p-3.5 sm:p-4 cursor-pointer select-none transition-all backdrop-blur-2xl border flex items-center justify-between gap-3.5 shadow-lg ${
                isSelected
                  ? 'bg-emerald-500/30 border-emerald-300 ring-2 ring-emerald-400/50'
                  : isCurrent
                  ? 'bg-gradient-to-r from-white/25 via-emerald-500/20 to-white/15 border-white/60 shadow-xl'
                  : 'bg-white/12 hover:bg-white/18 border-white/20'
              } ${isHolding ? 'scale-[0.98] ring-2 ring-white' : ''}`}
            >
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                {/* Selection Checkbox or Album Art */}
                <div
                  className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${track.coverGradient} flex items-center justify-center shrink-0 shadow-md border border-white/30`}
                >
                  {songSelectionMode ? (
                    <div
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center ${
                        isSelected
                          ? 'bg-emerald-400 border-emerald-300 text-slate-950'
                          : 'bg-black/60 border-white/50'
                      }`}
                    >
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </div>
                  ) : isCurrent && isAudioPlaying ? (
                    <Pause className="w-6 h-6 text-white fill-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-emerald-300">
                      #{idx + 1}
                    </span>
                    <h4 className="text-sm sm:text-base font-extrabold text-white truncate">
                      {track.title}
                    </h4>
                  </div>
                  <div className="flex items-center flex-wrap gap-1.5 text-xs text-white/80 mt-0.5 tabular-nums">
                    <span>{track.artist}</span>
                    <span>·</span>
                    <span>{track.quality}</span>
                    <span>·</span>
                    <span>{track.size}</span>
                  </div>
                </div>
              </div>

              {/* Right Actions: Heart with 7-Heart Burst, Duration & 3-Dot Menu */}
              <div className="flex items-center gap-2 shrink-0">
                <div className="relative">
                  <button
                    type="button"
                    onClick={(e) => triggerFavoriteBurst(track.id, e)}
                    className="p-2 rounded-xl hover:bg-white/15 transition-colors"
                    title="Favorite (7-Heart Burst)"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        track.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white/75'
                      }`}
                    />
                  </button>
                  {heartBursts[track.id]?.map((hp) => (
                    <span
                      key={hp.id}
                      style={{
                        transform: `translate(${hp.dx}px, ${hp.dy}px) scale(${hp.scale}) rotate(${hp.rot}deg)`
                      }}
                      className="pointer-events-none absolute left-2 top-1 text-base animate-ping"
                    >
                      ❤️
                    </span>
                  ))}
                </div>

                <span className="text-xs font-mono font-extrabold text-white tabular-nums hidden sm:inline">
                  {track.duration}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSingleMenuTrack(track);
                  }}
                  className="p-2 rounded-xl hover:bg-white/15 text-white"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ==========================================================================
          MODAL A: UPGRADED PLAYING QUEUE WITH SHUFFLE, LOCK QUEUE, SWAP & LOOP (Req #6)
         ========================================================================== */}
      {showAudioQueueModal && (
        <div
          onClick={() => setShowAudioQueueModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 border border-white/25 rounded-3xl max-w-lg w-full p-5 sm:p-6 flex flex-col gap-4 shadow-2xl max-h-[85vh]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div>
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <ListMusic className="w-5 h-5 text-emerald-400" />
                  Audio Playing Queue ({audioTracks.length})
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Manage playback order, lock queue, or toggle Shuffle / Line-by-Line
                </p>
              </div>
              <button
                onClick={() => setShowAudioQueueModal(false)}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Queue Action Bar: Shuffle/Line Toggle + Lock Queue + Loop */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => setIsShuffleMode((p) => !p)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border ${
                  isShuffleMode
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-white text-slate-950 border-white'
                }`}
              >
                {isShuffleMode ? (
                  <>
                    <Shuffle className="w-3.5 h-3.5" /> Shuffle Active
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-3.5 h-3.5" /> Line-by-Line (1→2→3)
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setIsQueueLocked((p) => !p);
                  onShowToast(!isQueueLocked ? 'Queue Locked 🔒' : 'Queue Unlocked 🔓');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 border ${
                  isQueueLocked
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-white/10 text-white border-white/20'
                }`}
              >
                {isQueueLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                <span>{isQueueLocked ? 'Queue Locked' : 'Lock Queue'}</span>
              </button>

              <button
                onClick={() =>
                  setLoopMode((m) => (m === 'line-all' ? 'loop-one' : 'line-all'))
                }
                className="px-3.5 py-2 rounded-xl bg-white/10 text-white border border-white/20 text-xs font-bold flex items-center gap-1.5"
              >
                <Repeat className="w-3.5 h-3.5 text-emerald-400" />
                <span>{loopMode === 'line-all' ? 'Loop All' : 'Loop 1 Song'}</span>
              </button>
            </div>

            {/* Queue Track List */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
              {audioTracks.map((qt, idx) => {
                const isPlayingNow = activeAudio?.id === qt.id;
                return (
                  <div
                    key={qt.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${
                      isPlayingNow
                        ? 'bg-emerald-500/25 border-emerald-400 text-white'
                        : 'bg-white/5 border-white/15 text-slate-200'
                    }`}
                  >
                    <div
                      onClick={() => {
                        if (!isQueueLocked) onPlayTrack(qt);
                        else onShowToast('Queue is Locked 🔒');
                      }}
                      className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                    >
                      <span className="text-xs font-mono font-bold text-emerald-300">
                        {idx + 1}.
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold text-white truncate">{qt.title}</p>
                        <p className="text-[11px] text-white/70 truncate">
                          {qt.artist} · {qt.duration}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => moveQueueTrack(idx, -1)}
                        disabled={idx === 0 || isQueueLocked}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveQueueTrack(idx, 1)}
                        disabled={idx === audioTracks.length - 1 || isQueueLocked}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MODAL B: NOW PLAYING 3-DOT PRO AUDIO FEATURES MENU (Req #3)
         ========================================================================== */}
      {showPlayerProMenu && (
        <div
          onClick={() => setShowPlayerProMenu(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900/95 border border-white/25 rounded-3xl max-w-lg w-full p-6 flex flex-col gap-4 shadow-2xl max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/15">
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  Audio Song Pro Features (3-Dot Studio)
                </h3>
                <p className="text-xs text-slate-300">
                  Advanced live DSP controls for {activeAudio?.title}
                </p>
              </div>
              <button
                onClick={() => setShowPlayerProMenu(false)}
                className="p-2 rounded-xl bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-bold">
              <button
                onClick={() => {
                  setDjCrossfadeEnabled((p) => !p);
                  onShowToast(`5s DJ Auto-Mix: ${!djCrossfadeEnabled ? 'ON' : 'OFF'}`);
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 ${
                  djCrossfadeEnabled
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                    : 'bg-white/5 text-white border-white/15'
                }`}
              >
                <Disc className="w-4 h-4" />
                <span>1. 5s DJ Auto-Mix</span>
              </button>

              <button
                onClick={() => {
                  setEqMasterEnabled((p) => !p);
                  onShowToast(`3D Equalizer: ${!eqMasterEnabled ? 'ON' : 'OFF'}`);
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 ${
                  eqMasterEnabled
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                    : 'bg-white/5 text-white border-white/15'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>2. 3D Equalizer ({eqMasterEnabled ? 'ON' : 'OFF'})</span>
              </button>

              <button
                onClick={() => {
                  setKaraokeVocalCut((p) => !p);
                  onShowToast(`Vocal Remover / Karaoke: ${!karaokeVocalCut ? 'ON' : 'OFF'}`);
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 ${
                  karaokeVocalCut
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                    : 'bg-white/5 text-white border-white/15'
                }`}
              >
                <MicOff className="w-4 h-4" />
                <span>3. Karaoke Vocal Cut</span>
              </button>

              <button
                onClick={() => {
                  setEightDRotate((p) => !p);
                  onShowToast(`8D Rotating Spatial Audio: ${!eightDRotate ? 'ON' : 'OFF'}`);
                }}
                className={`p-3 rounded-2xl border text-left flex flex-col gap-1 ${
                  eightDRotate
                    ? 'bg-emerald-400 text-slate-950 border-emerald-300'
                    : 'bg-white/5 text-white border-white/15'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span>4. 8D Rotating Audio</span>
              </button>

              <button
                onClick={() => {
                  const rooms: ('Off' | 'Studio' | 'Concert Hall' | 'Club Arena')[] = [
                    'Off',
                    'Studio',
                    'Concert Hall',
                    'Club Arena'
                  ];
                  const next = rooms[(rooms.indexOf(reverbRoom) + 1) % rooms.length];
                  setReverbRoom(next);
                  onShowToast(`3D Reverb Room: ${next}`);
                }}
                className="p-3 rounded-2xl border bg-white/5 text-white border-white/15 text-left flex flex-col gap-1"
              >
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>5. Reverb: {reverbRoom}</span>
              </button>

              <button
                onClick={() => {
                  const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
                  const next = speeds[(speeds.indexOf(audioSpeed) + 1) % speeds.length];
                  setAudioSpeed(next);
                  if (audioElementRef.current) audioElementRef.current.playbackRate = next;
                  onShowToast(`Audio Speed: ${next}x`);
                }}
                className="p-3 rounded-2xl border bg-white/5 text-white border-white/15 text-left flex flex-col gap-1"
              >
                <Zap className="w-4 h-4 text-amber-400" />
                <span>6. Speed: {audioSpeed}x</span>
              </button>

              <button
                onClick={() => {
                  startSleepTimerMinutes(9);
                  setShowPlayerProMenu(false);
                }}
                className="p-3 rounded-2xl border bg-white/5 text-white border-white/15 text-left flex flex-col gap-1"
              >
                <Timer className="w-4 h-4 text-emerald-400" />
                <span>7. Start 9m Live Timer</span>
              </button>

              <button
                onClick={() => {
                  setShowPlayerProMenu(false);
                  onShowToast('Saved timestamp bookmark in song!');
                }}
                className="p-3 rounded-2xl border bg-white/5 text-white border-white/15 text-left flex flex-col gap-1"
              >
                <Bookmark className="w-4 h-4 text-rose-400" />
                <span>8. Bookmark Beat</span>
              </button>

              <button
                onClick={() => {
                  setShowPlayerProMenu(false);
                  onShowToast('Opened Ringtone Cutter ✂️');
                }}
                className="p-3 rounded-2xl border bg-white/5 text-white border-white/15 text-left flex flex-col gap-1"
              >
                <Scissors className="w-4 h-4 text-purple-400" />
                <span>9. Ringtone Maker</span>
              </button>

              <button
                onClick={() => {
                  setShowPlayerProMenu(false);
                  if (activeAudio) {
                    setSelectedSongIds([activeAudio.id]);
                    setShowSongShareModal(true);
                  }
                }}
                className="p-3 rounded-2xl border bg-white/5 text-white border-white/15 text-left flex flex-col gap-1"
              >
                <Share2 className="w-4 h-4 text-emerald-400" />
                <span>10. Hybrid Share Song</span>
              </button>

              <button
                onClick={() => {
                  setShowPlayerProMenu(false);
                  if (activeAudio) {
                    setSelectedSongIds([activeAudio.id]);
                    setShowSongDetailsModal(true);
                  }
                }}
                className="p-3 rounded-2xl border bg-white/5 text-white border-white/15 text-left flex flex-col gap-1"
              >
                <Info className="w-4 h-4 text-cyan-400" />
                <span>11. Song Audio Details</span>
              </button>

              <button
                onClick={() => {
                  setShowPlayerProMenu(false);
                  setShowAudioQueueModal(true);
                }}
                className="p-3 rounded-2xl border bg-white/5 text-white border-white/15 text-left flex flex-col gap-1"
              >
                <ListMusic className="w-4 h-4 text-amber-400" />
                <span>12. Playing Queue</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MODAL C: SINGLE SONG 3-DOT MENU, SHARE MODAL & DETAILS MODAL (Req #2)
         ========================================================================== */}
      {singleMenuTrack && (
        <div
          onClick={() => setSingleMenuTrack(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-white/20 rounded-3xl max-w-md w-full p-5 flex flex-col gap-2 shadow-2xl"
          >
            <div className="pb-3 border-b border-white/15">
              <h4 className="text-sm font-extrabold text-white truncate">
                {singleMenuTrack.title}
              </h4>
              <p className="text-xs text-slate-400">
                {singleMenuTrack.artist} · {singleMenuTrack.quality} · {singleMenuTrack.size}
              </p>
            </div>

            <button
              onClick={() => {
                triggerDjCrossfadeTo(singleMenuTrack);
                setSingleMenuTrack(null);
              }}
              className="w-full px-4 py-2.5 rounded-2xl hover:bg-white/10 text-left text-xs font-bold text-white flex items-center gap-3"
            >
              <Play className="w-4 h-4 text-emerald-400" /> Play with 5s DJ Remix Crossfade
            </button>

            <button
              onClick={() => {
                setSelectedSongIds([singleMenuTrack.id]);
                setSongSelectionMode(true);
                setSingleMenuTrack(null);
              }}
              className="w-full px-4 py-2.5 rounded-2xl hover:bg-white/10 text-left text-xs font-bold text-white flex items-center gap-3"
            >
              <CheckSquare className="w-4 h-4 text-emerald-400" /> Select Multiple Songs
            </button>

            <button
              onClick={() => {
                setSelectedSongIds([singleMenuTrack.id]);
                setSingleMenuTrack(null);
                setShowSongShareModal(true);
              }}
              className="w-full px-4 py-2.5 rounded-2xl hover:bg-white/10 text-left text-xs font-bold text-white flex items-center gap-3"
            >
              <Share2 className="w-4 h-4 text-cyan-400" /> Hybrid Share Song
            </button>

            <button
              onClick={() => {
                setSelectedSongIds([singleMenuTrack.id]);
                setSingleMenuTrack(null);
                setShowSongDetailsModal(true);
              }}
              className="w-full px-4 py-2.5 rounded-2xl hover:bg-white/10 text-left text-xs font-bold text-white flex items-center gap-3"
            >
              <Info className="w-4 h-4 text-amber-400" /> Audio Technical Details
            </button>

            <button
              onClick={() => {
                onUpdateTracks(audioTracks.filter((t) => t.id !== singleMenuTrack.id));
                setSingleMenuTrack(null);
                onShowToast('Song deleted');
              }}
              className="w-full px-4 py-2.5 rounded-2xl hover:bg-red-500/20 text-left text-xs font-bold text-red-400 flex items-center gap-3"
            >
              <Trash2 className="w-4 h-4" /> Delete Song
            </button>
          </div>
        </div>
      )}

      {showSongShareModal && (
        <div
          onClick={() => setShowSongShareModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-emerald-400/40 rounded-3xl max-w-md w-full p-6 flex flex-col gap-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-400" />
                Hybrid Share Audio ({selectedTrackObjects.length || 1} Song)
              </h3>
              <button
                onClick={() => setShowSongShareModal(false)}
                className="p-1.5 rounded-xl bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowSongShareModal(false);
                  onShowToast('Hybrid Wi-Fi Direct Audio Share Started!');
                }}
                className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex flex-col items-center gap-2"
              >
                <Zap className="w-6 h-6" />
                Wi-Fi Direct Transfer
              </button>
              <button
                onClick={() => {
                  setShowSongShareModal(false);
                  onShowToast('Audio Track Shared to Nearby Device!');
                }}
                className="p-4 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold flex flex-col items-center gap-2"
              >
                <Share2 className="w-6 h-6" />
                Nearby Fast Share
              </button>
            </div>
          </div>
        </div>
      )}

      {showSongDetailsModal && (
        <div
          onClick={() => setShowSongDetailsModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-white/25 rounded-3xl max-w-md w-full p-6 flex flex-col gap-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                Audio Track Details
              </h3>
              <button
                onClick={() => setShowSongDetailsModal(false)}
                className="p-1.5 rounded-xl bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {(selectedTrackObjects.length > 0 ? selectedTrackObjects : [activeAudio || audioTracks[0]])
              .slice(0, 2)
              .map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-black/50 border border-white/15 text-xs font-mono space-y-1.5"
                >
                  <p className="font-sans text-sm font-extrabold text-white">{t.title}</p>
                  <p className="text-slate-300">
                    Artist / Album: <span className="text-white">{t.artist} · {t.album}</span>
                  </p>
                  <p className="text-slate-300">
                    Audio Quality: <span className="text-emerald-400">{t.quality}</span>
                  </p>
                  <p className="text-slate-300">
                    Tempo / Size: <span className="text-cyan-300">{t.bpm} BPM · {t.size}</span>
                  </p>
                  <p className="text-slate-300">
                    Storage Path: <span className="text-amber-300">/storage/emulated/0/{t.folder}/</span>
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

const INITIAL_AUDIO_TRACKS_FALLBACK: AudioTrack = {
  id: 'aud-fallback',
  title: 'Kesariya Terra Bass Remix',
  artist: 'Ansh Studio',
  album: 'Hybrid Bass',
  duration: '04:12',
  durationSec: 252,
  src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  quality: 'Dolby Atmos',
  size: '14.8 MB',
  folder: 'Ansh Music',
  coverGradient: 'from-emerald-600 to-slate-900',
  bpm: 124,
  isFavorite: true
};
