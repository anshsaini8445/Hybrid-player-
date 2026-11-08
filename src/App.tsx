/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Folder,
  Heart,
  Search,
  Trash2,
  Share2,
  Info,
  MoreVertical,
  CheckSquare,
  ArrowUpDown,
  LayoutGrid,
  List,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  X,
  BatteryCharging,
  Battery,
  Palette,
  Image as ImageIcon,
  Cpu,
  Music,
  Download,
  Check,
  Film,
  Lock,
  Plus,
  Radio,
  Zap,
  ShieldCheck,
  Smartphone,
  Clock
} from 'lucide-react';
import {
  VideoItem,
  AudioTrack,
  AppTheme,
  MascotItem,
  AppLanguageMode,
  UI_TRANSLATIONS,
  BUILTIN_THEMES,
  INITIAL_VIDEOS,
  INITIAL_AUDIO_TRACKS,
  MASCOT_COLLECTION
} from './data/mediaData';
import {
  HybridLogoIcon,
  VideoThumbnailArt
} from './components/MediaVisuals';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import {
  AudioStudioSection,
  STUDIO_PICTURE_WALLPAPERS
} from './components/AudioStudioSection';
import {
  MeToolkitSection,
  HybridShareStudioWidget
} from './components/MeToolkitSection';

export default function App() {
  // ============================================================================
  // 1. PERMANENT THEME, STUDIO PICTURE BACKDROP & GALLERY WALLPAPER STATE
  //    Applies uniformly across Video, Audio, Search Bar & Me Sections!
  // ============================================================================
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return localStorage.getItem('hybrid_active_theme_id') || 'hybrid-default';
  });
  const [activeBackdropId, setActiveBackdropId] = useState<string>(() => {
    return localStorage.getItem('hybrid_studio_backdrop_id') || 'aurora-emerald';
  });
  const [customWallpaper, setCustomWallpaper] = useState<string | null>(() => {
    return localStorage.getItem('hybrid_custom_wallpaper') || null;
  });
  const [wallpaperDim, setWallpaperDim] = useState<number>(() => {
    const saved = localStorage.getItem('hybrid_wallpaper_dim');
    return saved ? parseFloat(saved) : 0.48;
  });
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);

  const activeTheme: AppTheme =
    BUILTIN_THEMES.find((t) => t.id === activeThemeId) || BUILTIN_THEMES[0];

  const activeStudioBackdrop =
    STUDIO_PICTURE_WALLPAPERS.find((b) => b.id === activeBackdropId) ||
    STUDIO_PICTURE_WALLPAPERS[0];

  useEffect(() => {
    localStorage.setItem('hybrid_active_theme_id', activeThemeId);
  }, [activeThemeId]);

  useEffect(() => {
    localStorage.setItem('hybrid_studio_backdrop_id', activeBackdropId);
  }, [activeBackdropId]);

  useEffect(() => {
    localStorage.setItem('hybrid_wallpaper_dim', String(wallpaperDim));
  }, [wallpaperDim]);

  const handleGalleryWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCustomWallpaper(dataUrl);
      try {
        localStorage.setItem('hybrid_custom_wallpaper', dataUrl);
      } catch {
        // Keep in memory if image exceeds storage quota
      }
      showToast('Gallery photo applied permanently across Video, Audio & Search!');
    };
    reader.readAsDataURL(file);
  };

  const clearCustomWallpaper = () => {
    setCustomWallpaper(null);
    localStorage.removeItem('hybrid_custom_wallpaper');
    showToast('Restored Studio Picture Backdrop');
  };

  // ============================================================================
  // 2. DEVICE TIME & BATTERY TELEMETRY
  // ============================================================================
  const [deviceTime, setDeviceTime] = useState<string>('');
  const [batteryLevel, setBatteryLevel] = useState<number>(88);
  const [isCharging, setIsCharging] = useState<boolean>(true);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = now.getMinutes().toString().padStart(2, '0');
      const h12 = hours % 12 || 12;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      setDeviceTime(`${h12.toString().padStart(2, '0')}:${mins} ${ampm}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 10000);

    if ('getBattery' in navigator) {
      (navigator as any)
        .getBattery()
        .then((batt: any) => {
          setBatteryLevel(Math.round(batt.level * 100));
          setIsCharging(Boolean(batt.charging));
          batt.addEventListener('levelchange', () =>
            setBatteryLevel(Math.round(batt.level * 100))
          );
          batt.addEventListener('chargingchange', () =>
            setIsCharging(Boolean(batt.charging))
          );
        })
        .catch(() => {});
    }
    return () => clearInterval(interval);
  }, []);

  // ============================================================================
  // 3. NAVIGATION & SUB-TABS STATE
  // ============================================================================
  const [bottomTab, setBottomTab] = useState<'video' | 'audio' | 'search' | 'me'>('video');
  const [videoSubTab, setVideoSubTab] = useState<'video' | 'folder' | 'status' | 'favorites'>('video');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [statusCategoryFilter, setStatusCategoryFilter] = useState<string>('All');
  const [isGridView, setIsGridView] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'title' | 'resolution'>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [headerFavBurst, setHeaderFavBurst] = useState<boolean>(false);

  // ============================================================================
  // 4. VIDEO LIBRARY & CHRONOLOGICAL HISTORY (LATEST FIRST)
  // ============================================================================
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [historyOpen, setHistoryOpen] = useState<boolean>(true);

  const historyVideos = [...videos]
    .filter((v) => v.lastPlayedAt > 0)
    .sort((a, b) => b.lastPlayedAt - a.lastPlayedAt);

  // ============================================================================
  // 5. 2-SECOND HOLD MULTI-SELECT & BATCH ACTIONS
  // ============================================================================
  const [selectionMode, setSelectionMode] = useState<boolean>(false);
  const [selectedVideoIds, setSelectedVideoIds] = useState<string[]>([]);
  const [holdingVideoId, setHoldingVideoId] = useState<string | null>(null);
  const [showMoreSelectionMenu, setShowMoreSelectionMenu] = useState<boolean>(false);
  const [showHybridShareModal, setShowHybridShareModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [singleActionVideo, setSingleActionVideo] = useState<VideoItem | null>(null);

  const holdTimerRef = useRef<NodeJS.Timeout | null>(null);
  const didTriggerHoldRef = useRef<boolean>(false);

  const startVideoHold = (videoId: string) => {
    didTriggerHoldRef.current = false;
    setHoldingVideoId(videoId);
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);

    holdTimerRef.current = setTimeout(() => {
      didTriggerHoldRef.current = true;
      setHoldingVideoId(null);
      setSelectionMode(true);
      setSelectedVideoIds((prev) =>
        prev.includes(videoId) ? prev : [...prev, videoId]
      );
      if (navigator.vibrate) navigator.vibrate(45);
      showToast('Selection Mode Active — Tap more videos or Select All');
    }, 1400);
  };

  const cancelVideoHold = () => {
    setHoldingVideoId(null);
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
  };

  const toggleSelectVideo = (videoId: string) => {
    setSelectedVideoIds((prev) => {
      const next = prev.includes(videoId)
        ? prev.filter((id) => id !== videoId)
        : [...prev, videoId];
      if (next.length === 0) setSelectionMode(false);
      return next;
    });
  };

  const handleSelectAllVideos = (visibleList: VideoItem[]) => {
    const visibleIds = visibleList.map((v) => v.id);
    const allSelected = visibleIds.every((id) => selectedVideoIds.includes(id));
    if (allSelected) {
      setSelectedVideoIds([]);
      setSelectionMode(false);
    } else {
      setSelectionMode(true);
      setSelectedVideoIds(visibleIds);
    }
  };

  const handleDeleteSelectedVideos = () => {
    if (selectedVideoIds.length === 0) return;
    const count = selectedVideoIds.length;
    setVideos((prev) => prev.filter((v) => !selectedVideoIds.includes(v.id)));
    if (activeVideo && selectedVideoIds.includes(activeVideo.id)) {
      setActiveVideo(null);
      setIsVideoPlaying(false);
      setPlayerMode('closed');
    }
    setSelectedVideoIds([]);
    setSelectionMode(false);
    setShowMoreSelectionMenu(false);
    showToast(`Deleted ${count} video${count > 1 ? 's' : ''} from list`);
  };

  // ============================================================================
  // 6. VIDEO PLAYER, MINI PiP, BACKGROUND VIDEO & 4K/8K SMART M13 DECODER
  // ============================================================================
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(INITIAL_VIDEOS[0]);
  const [playerMode, setPlayerMode] = useState<'mini' | 'full' | 'background' | 'closed'>('mini');
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(false);
  const [decoderEngine, setDecoderEngine] = useState<'HW+ Smart M13' | '8K Direct Ultra' | 'SW Fast Safe'>('HW+ Smart M13');
  const [showDecoderModal, setShowDecoderModal] = useState<boolean>(false);

  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  // ============================================================================
  // 7. ADVANCED AUDIO (PDO) SECTION & BI-DIRECTIONAL MEDIA HANDOVER
  // ============================================================================
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>(INITIAL_AUDIO_TRACKS);
  const [activeAudio, setActiveAudio] = useState<AudioTrack | null>(INITIAL_AUDIO_TRACKS[0]);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState<number>(0);
  const [audioDuration, setAudioDuration] = useState<number>(252);

  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Play Video -> Automatically Stop any playing Audio song & update History #1
  const playVideoItem = (video: VideoItem, openFull = true) => {
    if (isAudioPlaying && audioElementRef.current) {
      audioElementRef.current.pause();
      setIsAudioPlaying(false);
      showToast(`Audio paused • Playing "${video.title.slice(0, 24)}..."`);
    }

    const nowTs = Date.now();
    setVideos((prev) =>
      prev.map((v) =>
        v.id === video.id
          ? {
              ...v,
              lastPlayedAt: nowTs,
              watchedProgress: v.watchedProgress > 0 ? v.watchedProgress : 18
            }
          : v
      )
    );

    setActiveVideo({ ...video, lastPlayedAt: nowTs });
    setPlayerMode(openFull ? 'full' : playerMode === 'closed' ? 'full' : playerMode);
    setIsVideoPlaying(true);

    setTimeout(() => {
      if (videoElementRef.current) {
        videoElementRef.current.currentTime = 0;
        videoElementRef.current.play().catch(() => {});
      }
    }, 50);
  };

  // Play Audio Track -> Automatically Stop & Close any playing background/mini Video!
  const playAudioTrack = (track: AudioTrack) => {
    if ((isVideoPlaying || playerMode !== 'closed') && videoElementRef.current) {
      videoElementRef.current.pause();
      setIsVideoPlaying(false);
      setPlayerMode('closed');
      showToast(`Background video stopped • Playing "${track.title.slice(0, 24)}..."`);
    } else if (playerMode !== 'closed') {
      setIsVideoPlaying(false);
      setPlayerMode('closed');
    }

    setActiveAudio(track);
    setIsAudioPlaying(true);
    setTimeout(() => {
      if (audioElementRef.current) {
        audioElementRef.current.play().catch(() => {});
      }
    }, 50);
  };

  const toggleVideoPlayPause = () => {
    if (!videoElementRef.current || !activeVideo) return;
    if (isVideoPlaying) {
      videoElementRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      if (isAudioPlaying && audioElementRef.current) {
        audioElementRef.current.pause();
        setIsAudioPlaying(false);
      }
      const nowTs = Date.now();
      setVideos((prev) =>
        prev.map((v) => (v.id === activeVideo.id ? { ...v, lastPlayedAt: nowTs } : v))
      );
      videoElementRef.current.play().catch(() => {});
      setIsVideoPlaying(true);
    }
  };

  const toggleAudioPlayPause = () => {
    if (!audioElementRef.current || !activeAudio) return;
    if (isAudioPlaying) {
      audioElementRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      if (videoElementRef.current) {
        videoElementRef.current.pause();
      }
      setIsVideoPlaying(false);
      if (playerMode !== 'closed') {
        setPlayerMode('closed');
        showToast('Background video stopped automatically');
      }
      audioElementRef.current.play().catch(() => {});
      setIsAudioPlaying(true);
    }
  };

  const handleExtractVideoToMp3 = (video: VideoItem) => {
    const newTrack: AudioTrack = {
      id: `extracted-${Date.now()}`,
      title: `${video.title} (Extracted Audio)`,
      artist: video.folder,
      album: 'Converted Video Audio',
      duration: video.duration,
      durationSec: video.durationSec,
      src: INITIAL_AUDIO_TRACKS[0].src,
      quality: '320kbps MP3',
      size: '8.2 MB',
      folder: video.folder,
      coverGradient: 'from-emerald-600 via-teal-800 to-slate-950',
      bpm: 120,
      isFavorite: true
    };
    setAudioTracks((prev) => [newTrack, ...prev]);
    showToast(`Converted "${video.title.slice(0, 22)}..." to MP3 in Audio Studio!`);
  };

  const handleLocalVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const added: VideoItem[] = Array.from(files).map((file, idx) => ({
      id: `local-vid-${Date.now()}-${idx}`,
      title: file.name.replace(/\.[^/.]+$/, ''),
      duration: '03:12',
      durationSec: 192,
      resolution: file.size > 50 * 1024 * 1024 ? '4K' : '1080P',
      format: file.name.toLowerCase().endsWith('.mkv')
        ? 'MKV'
        : file.name.toLowerCase().endsWith('.webm')
        ? 'WEBM'
        : 'MP4',
      size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      folder: 'Local Phone Storage',
      src: URL.createObjectURL(file),
      fallbackSrc: URL.createObjectURL(file),
      posterGradient: 'from-emerald-950 via-slate-900 to-cyan-950',
      posterAccent: '#10b981',
      posterLabel: 'LOCAL DEVICE VIDEO',
      fps: 60,
      bitrate: '28.5 Mbps',
      codec: 'HW+ Hybrid Decoder',
      isFavorite: false,
      isStatus: true,
      statusCategory: '8K Ultra',
      watchedProgress: 12,
      lastPlayedAt: Date.now() + idx
    }));

    setVideos((prev) => [...added, ...prev]);
    playVideoItem(added[0], true);
  };

  // ============================================================================
  // 8. 3D MASCOT COMPANION & APP LANGUAGE STATE (System Default / English / Hindi)
  // ============================================================================
  const [mascots, setMascots] = useState<MascotItem[]>(MASCOT_COLLECTION);
  const [activeMascot, setActiveMascot] = useState<MascotItem>(MASCOT_COLLECTION[0]);
  const [showMascot, setShowMascot] = useState<boolean>(true);
  const [mascotSize, setMascotSize] = useState<number>(76);

  const [langMode, setLangMode] = useState<AppLanguageMode>(() => {
    const saved = localStorage.getItem('hybrid_app_lang') as AppLanguageMode | null;
    if (saved === 'system' || saved === 'en' || saved === 'hi') return saved;
    return 'system';
  });

  useEffect(() => {
    localStorage.setItem('hybrid_app_lang', langMode);
  }, [langMode]);

  const resolvedLang: 'en' | 'hi' =
    langMode === 'hi'
      ? 'hi'
      : langMode === 'en'
      ? 'en'
      : typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('hi')
      ? 'hi'
      : 'en';

  const t = UI_TRANSLATIONS[resolvedLang];

  const handleUploadCustomMascotPhoto = (mascotId: string, dataUrl: string) => {
    setMascots((prev) =>
      prev.map((m) => (m.id === mascotId ? { ...m, imageUrl: dataUrl, filterCss: 'none' } : m))
    );
    if (activeMascot.id === mascotId) {
      setActiveMascot((prev) => ({ ...prev, imageUrl: dataUrl, filterCss: 'none' }));
    }
    setShowMascot(true);
    showToast(
      resolvedLang === 'hi'
        ? 'कस्टम 3D टेडी मैस्कॉट फोटो सेव और लागू हो गया!'
        : 'Custom 3D Mascot photo saved & applied!'
    );
  };

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const filteredVideos = videos
    .filter((v) => {
      if (videoSubTab === 'favorites' && !v.isFavorite) return false;
      if (videoSubTab === 'status' && !v.isStatus) return false;
      if (
        videoSubTab === 'status' &&
        statusCategoryFilter !== 'All' &&
        v.statusCategory !== statusCategoryFilter
      ) {
        return false;
      }
      if (videoSubTab === 'folder' && selectedFolder && v.folder !== selectedFolder) {
        return false;
      }
      if (
        searchQuery.trim() !== '' &&
        !v.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !v.folder.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'resolution') {
        const rank = { '8K': 5, '4K': 4, '2K': 3, '1080P': 2, HD: 1 };
        return rank[b.resolution] - rank[a.resolution];
      }
      return b.lastPlayedAt - a.lastPlayedAt;
    });

  const folderGroups = Array.from(new Set(videos.map((v) => v.folder))).map((folderName) => {
    const items = videos.filter((v) => v.folder === folderName);
    return { name: folderName, count: items.length, sample: items[0] };
  });

  const selectedVideoObjects = videos.filter((v) => selectedVideoIds.includes(v.id));

  return (
    <div
      style={{
        backgroundImage: customWallpaper
          ? `url(${customWallpaper})`
          : activeStudioBackdrop.cssBackground,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
      className="min-h-screen text-slate-100 relative flex flex-col overflow-x-hidden"
    >
      {/* Translucent Dim Layer over Gallery Wallpaper so user photo shines everywhere */}
      {customWallpaper && (
        <div
          style={{ backgroundColor: `rgba(8, 10, 18, ${wallpaperDim})` }}
          className="fixed inset-0 pointer-events-none z-0 backdrop-blur-[2px]"
        />
      )}

      {/* Persistent Audio Element */}
      <audio
        ref={audioElementRef}
        src={activeAudio?.src}
        onTimeUpdate={() => {
          if (audioElementRef.current) {
            setAudioCurrentTime(audioElementRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioElementRef.current && audioElementRef.current.duration) {
            setAudioDuration(audioElementRef.current.duration);
          }
        }}
        onEnded={() => {
          const idx = audioTracks.findIndex((t) => t.id === activeAudio?.id);
          const nextTrack = audioTracks[(idx + 1) % audioTracks.length];
          if (nextTrack) playAudioTrack(nextTrack);
        }}
      />

      {/* ==========================================================================
          TOP HEADER BAR: HYBRID PLAYER ICON + LIVE DEVICE TIME & BATTERY
         ========================================================================== */}
      <header className="sticky top-0 z-30 px-4 pt-3 pb-2.5 bg-black/45 backdrop-blur-2xl border-b border-white/15">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <HybridLogoIcon size={44} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white truncate">
                  Hybrid Player
                </h1>
              </div>
              <div className="flex items-center gap-2.5 mt-0.5 text-xs font-mono font-semibold text-emerald-300 tabular-nums">
                <span className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-md text-white">
                  <Clock className="w-3.5 h-3.5 text-emerald-400" />
                  {deviceTime || '08:56 PM'}
                </span>
                <span className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 rounded-md text-emerald-300">
                  {isCharging ? (
                    <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Battery className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {batteryLevel}%
                </span>
                <button
                  onClick={() => setShowDecoderModal(true)}
                  className="hidden sm:flex items-center gap-1 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-md text-amber-300 hover:bg-amber-500/30 transition-colors"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  {decoderEngine}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <label
              className="cursor-pointer min-h-[42px] px-3 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 flex items-center gap-1.5 text-xs font-semibold text-white transition-all active:scale-95"
              title="Set Photo from Gallery as Permanent Wallpaper Everywhere"
            >
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">{t.galleryBg}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleGalleryWallpaperUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={() => setShowThemeModal(true)}
              className="min-h-[42px] px-3 py-2 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-400/50 flex items-center gap-1.5 text-xs font-semibold text-emerald-300 transition-all active:scale-95"
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">{t.themes}</span>
            </button>

            <label
              className="cursor-pointer min-h-[42px] px-3 py-2 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg shadow-red-600/25 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">{t.addVideo}</span>
              <input
                type="file"
                accept="video/*,.mkv,.webm,.mp4"
                multiple
                onChange={handleLocalVideoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </header>

      {/* Background Audio Banner when browsing Video tab */}
      {isAudioPlaying && activeAudio && bottomTab !== 'audio' && (
        <div className="relative z-20 max-w-6xl w-full mx-auto px-4 pt-2">
          <div className="bg-white/15 border border-emerald-400/50 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg backdrop-blur-2xl">
            <div
              onClick={() => setBottomTab('audio')}
              className="flex items-center gap-3 min-w-0 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/25 border border-emerald-400/50 flex items-center justify-center shrink-0 animate-pulse">
                <Music className="w-4 h-4 text-emerald-300" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  Playing Audio: {activeAudio.title}
                </p>
                <p className="text-[11px] text-emerald-300 truncate">
                  Auto-stops when you play any video • Tap to open 3D Audio Studio
                </p>
              </div>
            </div>
            <button
              onClick={toggleAudioPlayPause}
              className="p-2 rounded-xl bg-emerald-400 text-slate-950 font-bold hover:bg-emerald-300 shrink-0"
            >
              <Pause className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      )}

      {/* 2-Second Hold Multi-Select Action Toolbar (Video Section) */}
      {selectionMode && bottomTab === 'video' && (
        <div className="sticky top-[69px] z-30 bg-emerald-950/95 border-b border-emerald-500/50 backdrop-blur-xl px-4 py-2.5 shadow-2xl">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectionMode(false);
                  setSelectedVideoIds([]);
                  setShowMoreSelectionMenu(false);
                }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
              <span className="text-sm font-bold text-white tabular-nums">
                {selectedVideoIds.length} Selected
              </span>
              <button
                onClick={() => handleSelectAllVideos(filteredVideos)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-xs font-bold text-emerald-300 transition-colors"
              >
                {selectedVideoIds.length === filteredVideos.length
                  ? 'Deselect All'
                  : `Select All (${filteredVideos.length})`}
              </button>
            </div>

            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => setShowHybridShareModal(true)}
                className="px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                Hybrid Share
              </button>

              <button
                onClick={handleDeleteSelectedVideos}
                className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-95"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>

              <button
                onClick={() => setShowDetailsModal(true)}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95"
              >
                <Info className="w-4 h-4 text-cyan-400" />
                Details
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMoreSelectionMenu((p) => !p)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMoreSelectionMenu && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl py-2 z-50 text-xs font-semibold text-slate-200">
                    <button
                      onClick={() => {
                        setVideos((prev) =>
                          prev.map((v) =>
                            selectedVideoIds.includes(v.id) ? { ...v, isFavorite: true } : v
                          )
                        );
                        setShowMoreSelectionMenu(false);
                        showToast('Added selected videos to Favorites ❤️');
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center gap-2.5"
                    >
                      <Heart className="w-4 h-4 text-rose-400" /> Add to Favorites
                    </button>
                    <button
                      onClick={() => {
                        const first = videos.find((v) => selectedVideoIds.includes(v.id));
                        if (first) playVideoItem(first, true);
                        setShowMoreSelectionMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center gap-2.5"
                    >
                      <Play className="w-4 h-4 text-emerald-400" /> Play Selected in Queue
                    </button>
                    <button
                      onClick={() => {
                        const first = videos.find((v) => selectedVideoIds.includes(v.id));
                        if (first) handleExtractVideoToMp3(first);
                        setShowMoreSelectionMenu(false);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center gap-2.5"
                    >
                      <Music className="w-4 h-4 text-amber-400" /> Extract to Audio (MP3)
                    </button>
                    <button
                      onClick={() => {
                        setShowMoreSelectionMenu(false);
                        setShowDecoderModal(true);
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center gap-2.5"
                    >
                      <Cpu className="w-4 h-4 text-cyan-400" /> Optimize for 4K/8K Smooth Play
                    </button>
                    <button
                      onClick={() => {
                        setShowMoreSelectionMenu(false);
                        showToast('Locked selected videos in Private Safe Vault 🔒');
                      }}
                      className="w-full px-4 py-2.5 text-left hover:bg-white/10 flex items-center gap-2.5"
                    >
                      <Lock className="w-4 h-4 text-purple-400" /> Move to Private Vault
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================================================
          MAIN CONTENT AREA
         ========================================================================== */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 pt-3 pb-32 flex flex-col gap-4">
        {bottomTab === 'video' && (
          <>
            {/* Chronological History Strip (Latest First) */}
            {historyVideos.length > 0 && (
              <section className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setHistoryOpen((p) => !p)}
                    className="flex items-center gap-2 text-base font-bold text-white hover:text-emerald-400 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full border border-emerald-400 flex items-center justify-center text-emerald-400">
                      <RotateCcw className="w-3 h-3" />
                    </div>
                    <span>
                      {t.history} ({historyVideos.length})
                    </span>
                    {historyOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                    <span className="text-[11px] font-normal text-emerald-300 ml-1">
                      • {t.latestFirst}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setVideos((prev) =>
                        prev.map((v) => ({ ...v, lastPlayedAt: 0, watchedProgress: 0 }))
                      );
                      showToast('Watch history cleared');
                    }}
                    className="p-2 text-slate-300 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {historyOpen && (
                  <div className="flex items-center gap-3 overflow-x-auto pb-1.5 pt-0.5">
                    {historyVideos.map((hVid, idx) => (
                      <div
                        key={hVid.id}
                        onClick={() => playVideoItem(hVid, true)}
                        className="group relative w-40 sm:w-48 aspect-video rounded-2xl overflow-hidden border border-white/25 bg-white/10 shrink-0 cursor-pointer shadow-lg hover:border-emerald-400 transition-all"
                      >
                        <VideoThumbnailArt video={hVid} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                        <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                          {idx === 0 ? 'LATEST • NOW' : `#${idx + 1} RECENT`}
                        </span>

                        <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-cyan-300">
                          {hVid.resolution}
                        </span>

                        <p className="absolute bottom-3 left-2.5 right-16 text-[11px] font-bold text-white truncate">
                          {hVid.title}
                        </p>

                        <span className="absolute bottom-2.5 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-white flex items-center gap-1 tabular-nums">
                          <Play className="w-2.5 h-2.5 fill-white" />
                          {hVid.duration}
                        </span>

                        <div className="absolute bottom-0 inset-x-0 h-1 bg-white/20">
                          <div
                            style={{ width: `${Math.max(15, hVid.watchedProgress)}%` }}
                            className="h-full bg-emerald-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Sub-navigation bar with 7-Heart Burst on Favorites icon */}
            <div className="flex items-center justify-between gap-2 border-b border-white/15 pb-2 pt-1 overflow-x-auto">
              <div className="flex items-center gap-5 sm:gap-7 shrink-0">
                <button
                  onClick={() => {
                    setVideoSubTab('video');
                    setSelectedFolder(null);
                  }}
                  className={`relative pb-2 flex items-center gap-2 text-sm sm:text-base font-bold transition-colors whitespace-nowrap ${
                    videoSubTab === 'video' ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <span className="w-5 h-4 rounded bg-emerald-500 text-slate-950 flex items-center justify-center">
                    <Play className="w-3 h-3 fill-current" />
                  </span>
                  {t.video}
                  {videoSubTab === 'video' && (
                    <span className="absolute bottom-0 inset-x-0 h-1 rounded-full bg-emerald-400" />
                  )}
                </button>

                <button
                  onClick={() => setVideoSubTab('folder')}
                  className={`relative pb-2 flex items-center gap-2 text-sm sm:text-base font-bold transition-colors whitespace-nowrap ${
                    videoSubTab === 'folder' ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Folder className="w-4 h-4" />
                  {t.folder}
                  {videoSubTab === 'folder' && (
                    <span className="absolute bottom-0 inset-x-0 h-1 rounded-full bg-emerald-400" />
                  )}
                </button>

                <button
                  onClick={() => setVideoSubTab('status')}
                  className={`relative pb-2 flex items-center gap-2 text-sm sm:text-base font-bold transition-colors whitespace-nowrap ${
                    videoSubTab === 'status' ? 'text-white' : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Radio className="w-4 h-4 text-emerald-400" />
                  {t.status}
                  <span className="text-[10px] font-mono text-emerald-300">4K/8K</span>
                  {videoSubTab === 'status' && (
                    <span className="absolute bottom-0 inset-x-0 h-1 rounded-full bg-emerald-400" />
                  )}
                </button>

                <div className="relative">
                  <button
                    onClick={() => {
                      setVideoSubTab(videoSubTab === 'favorites' ? 'video' : 'favorites');
                      setHeaderFavBurst(true);
                      setTimeout(() => setHeaderFavBurst(false), 1900);
                    }}
                    className={`pb-2 transition-colors ${
                      videoSubTab === 'favorites'
                        ? 'text-rose-400'
                        : 'text-white/70 hover:text-rose-300'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${videoSubTab === 'favorites' ? 'fill-rose-500' : ''}`}
                    />
                  </button>
                  {headerFavBurst && (
                    <span className="pointer-events-none absolute -top-4 left-0 text-sm animate-ping">
                      ❤️❤️❤️
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 pb-2">
                <button
                  onClick={() => {
                    if (selectionMode) {
                      setSelectionMode(false);
                      setSelectedVideoIds([]);
                    } else {
                      setSelectionMode(true);
                      showToast('Tap videos to select or press Select All');
                    }
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${
                    selectionMode
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-white/75 hover:text-white'
                  }`}
                >
                  <CheckSquare className="w-5 h-5" />
                </button>

                <button
                  onClick={() => {
                    const order: ('newest' | 'title' | 'resolution')[] = [
                      'newest',
                      'resolution',
                      'title'
                    ];
                    const next = order[(order.indexOf(sortBy) + 1) % order.length];
                    setSortBy(next);
                    showToast(`Sorted by ${next.toUpperCase()}`);
                  }}
                  className="p-1.5 text-white/75 hover:text-white transition-colors"
                >
                  <ArrowUpDown className="w-5 h-5" />
                </button>

                <button
                  onClick={() => setIsGridView((p) => !p)}
                  className="p-1.5 text-white/75 hover:text-white transition-colors"
                >
                  {isGridView ? (
                    <List className="w-5 h-5" />
                  ) : (
                    <LayoutGrid className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Status Sub-Tab */}
            {videoSubTab === 'status' && (
              <div className="flex flex-col gap-4">
                <div className="rounded-3xl p-4 sm:p-5 bg-white/12 backdrop-blur-2xl border border-white/25 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                      <Zap className="w-4 h-4" />
                      <span>ULTRA HD STATUS STUDIO • 2K / 4K / 8K 60FPS READY</span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1">
                      Crystal-Clear 8K & 4K Status Reels (Samsung M13 & All Devices)
                    </h2>
                    <p className="text-xs text-white/80 mt-0.5">
                      Smart HW+ Adaptive Downscaler enabled — plays 8K, 4K, and 2K status videos at 60FPS with zero lag.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDecoderModal(true)}
                    className="px-3.5 py-2 rounded-xl bg-emerald-400 text-slate-950 text-xs font-extrabold hover:bg-emerald-300 transition-colors shrink-0"
                  >
                    8K Engine: {decoderEngine}
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {['All', '8K Ultra', '4K Nature', 'Cyberpunk', 'Anime', 'Cars', 'Coding'].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setStatusCategoryFilter(cat)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                          statusCategoryFilter === cat
                            ? 'bg-emerald-400 text-slate-950 shadow-lg'
                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/15'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredVideos.map((stVid) => (
                    <div
                      key={stVid.id}
                      className="group rounded-3xl overflow-hidden bg-white/12 border border-white/20 hover:border-emerald-400/60 transition-all shadow-xl flex flex-col justify-between backdrop-blur-2xl"
                    >
                      <div
                        onClick={() => playVideoItem(stVid, true)}
                        className="relative aspect-video cursor-pointer overflow-hidden"
                      >
                        <VideoThumbnailArt video={stVid} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-400 text-slate-950 text-xs font-extrabold shadow-md">
                            {stVid.resolution} ULTRA
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-black/70 text-[11px] font-mono text-white border border-white/15">
                            {stVid.fps} FPS
                          </span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-xl transition-all group-hover:scale-110">
                            <Play className="w-6 h-6 fill-current ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-xs font-mono font-bold text-white tabular-nums">
                          ▶ {stVid.duration}
                        </span>
                      </div>

                      <div className="p-4 flex flex-col gap-3">
                        <div>
                          <h3 className="text-sm font-bold text-white line-clamp-1">
                            {stVid.title}
                          </h3>
                          <p className="text-xs text-white/75 mt-1">
                            {stVid.resolution} · {stVid.format} · {stVid.size} · {stVid.codec}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/15">
                          <button
                            onClick={() => playVideoItem(stVid, true)}
                            className="flex-1 py-2 rounded-xl bg-emerald-400/25 hover:bg-emerald-400 text-emerald-300 hover:text-slate-950 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" /> Play {stVid.resolution}
                          </button>
                          <button
                            onClick={() => {
                              setSingleActionVideo(stVid);
                              setShowHybridShareModal(true);
                            }}
                            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              showToast(`Saved "${stVid.title.slice(0, 20)}..." to Status Gallery!`)
                            }
                            className="p-2 rounded-xl bg-white/10 hover:bg-emerald-500/30 text-emerald-300"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Folder View */}
            {videoSubTab === 'folder' && !selectedFolder && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {folderGroups.map((fg) => (
                  <div
                    key={fg.name}
                    onClick={() => setSelectedFolder(fg.name)}
                    className="p-4 rounded-3xl bg-white/12 border border-white/20 hover:border-emerald-400/60 cursor-pointer flex items-center justify-between gap-4 transition-all shadow-lg backdrop-blur-2xl"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                        <Folder className="w-7 h-7 text-emerald-300 fill-emerald-400/20" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-white truncate">{fg.name}</h3>
                        <p className="text-xs text-white/75 mt-0.5">
                          {fg.count} {fg.count === 1 ? ' video' : ' videos'} · Ready for 4K/8K
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-lg">
                      Open
                    </span>
                  </div>
                ))}
              </div>
            )}

            {videoSubTab === 'folder' && selectedFolder && (
              <div className="flex items-center justify-between bg-white/12 backdrop-blur-xl px-4 py-2.5 rounded-2xl border border-white/20">
                <span className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <Folder className="w-4 h-4" /> Folder: {selectedFolder}
                </span>
                <button
                  onClick={() => setSelectedFolder(null)}
                  className="text-xs font-bold text-white bg-white/15 px-3 py-1 rounded-lg hover:bg-white/25"
                >
                  ← All Folders
                </button>
              </div>
            )}

            {/* Main Video List Cards (Translucent Frosted Glass so Backdrop/Gallery Photo shines through) */}
            {videoSubTab !== 'status' &&
              (videoSubTab !== 'folder' || selectedFolder !== null) && (
                <>
                  <div className="flex items-center justify-between text-xs text-white/80 px-1">
                    <span>
                      Tip: <strong className="text-emerald-300">Tap any video</strong> for Pure-White 8X Player, or <strong className="text-emerald-300">Hold 2s</strong> to Multi-Select.
                    </span>
                    <span className="font-mono tabular-nums">{filteredVideos.length} videos</span>
                  </div>

                  <div
                    className={
                      isGridView
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                        : 'flex flex-col gap-3.5'
                    }
                  >
                    {filteredVideos.map((video) => {
                      const isSelected = selectedVideoIds.includes(video.id);
                      const isHolding = holdingVideoId === video.id;
                      const isCurrentlyPlaying =
                        activeVideo?.id === video.id && playerMode !== 'closed';

                      return (
                        <div
                          key={video.id}
                          onMouseDown={() => startVideoHold(video.id)}
                          onMouseUp={cancelVideoHold}
                          onMouseLeave={cancelVideoHold}
                          onTouchStart={() => startVideoHold(video.id)}
                          onTouchEnd={cancelVideoHold}
                          onClick={() => {
                            if (didTriggerHoldRef.current) {
                              didTriggerHoldRef.current = false;
                              return;
                            }
                            if (selectionMode) {
                              toggleSelectVideo(video.id);
                            } else {
                              playVideoItem(video, true);
                            }
                          }}
                          className={`relative rounded-[26px] p-3.5 sm:p-4 transition-all cursor-pointer select-none backdrop-blur-2xl border ${
                            isSelected
                              ? 'bg-emerald-500/30 border-emerald-300 ring-2 ring-emerald-400/50'
                              : isCurrentlyPlaying
                              ? 'bg-white/20 border-white/60 shadow-xl'
                              : 'bg-white/12 hover:bg-white/18 border-white/20'
                          } ${isHolding ? 'scale-[0.98] ring-2 ring-white' : ''}`}
                        >
                          <div
                            className={
                              isGridView
                                ? 'flex flex-col gap-3'
                                : 'flex items-center justify-between gap-3.5 sm:gap-4'
                            }
                          >
                            <div
                              className={`relative rounded-2xl overflow-hidden shrink-0 bg-slate-950 border border-white/15 ${
                                isGridView ? 'w-full aspect-video' : 'w-36 sm:w-44 aspect-video'
                              }`}
                            >
                              <VideoThumbnailArt video={video} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-[#0a2e36]/95 border border-cyan-400/30 text-[11px] font-extrabold text-cyan-300 shadow">
                                {video.resolution}
                              </span>

                              <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/85 text-[11px] font-mono font-bold text-white flex items-center gap-1 tabular-nums">
                                <Play className="w-2.5 h-2.5 fill-white" />
                                {video.duration}
                              </span>

                              {selectionMode && (
                                <div className="absolute top-2 left-2 w-6 h-6 rounded-lg bg-black/80 border border-white/40 flex items-center justify-center">
                                  {isSelected && (
                                    <div className="w-full h-full rounded-lg bg-emerald-400 flex items-center justify-center text-slate-950">
                                      <Check className="w-4 h-4 stroke-[3]" />
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            <div className="flex-1 min-w-0 flex flex-col justify-between gap-1.5">
                              <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug line-clamp-2">
                                {video.title}
                              </h3>

                              <div className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm font-medium text-white/80 tabular-nums">
                                <span>{video.resolution}</span>
                                <span aria-hidden="true">•</span>
                                <span>{video.format}</span>
                                <span aria-hidden="true">•</span>
                                <span>{video.size}</span>
                              </div>

                              <div className="mt-1 flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setVideoSubTab('folder');
                                    setSelectedFolder(video.folder);
                                  }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-400/40 text-xs font-bold text-emerald-200 transition-colors"
                                >
                                  <Folder className="w-3.5 h-3.5 fill-emerald-300 text-emerald-300" />
                                  {video.folder}
                                </button>
                              </div>
                            </div>

                            <div className="shrink-0 self-center">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSingleActionVideo(video);
                                }}
                                className="min-w-[40px] min-h-[40px] rounded-xl hover:bg-white/15 flex items-center justify-center text-white transition-colors"
                              >
                                <MoreVertical className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
          </>
        )}

        {/* ========================================================================
            TAB 2: UPGRADED 3D AUDIO STUDIO SECTION (Implements All 10 User Points!)
           ======================================================================== */}
        {bottomTab === 'audio' && (
          <AudioStudioSection
            audioTracks={audioTracks}
            activeAudio={activeAudio}
            isAudioPlaying={isAudioPlaying}
            audioCurrentTime={audioCurrentTime}
            audioDuration={audioDuration}
            activeMascot={activeMascot}
            activeTheme={activeTheme}
            customWallpaper={customWallpaper}
            activeBackdropId={activeBackdropId}
            onChangeBackdropId={(id) => {
              setCustomWallpaper(null);
              setActiveBackdropId(id);
            }}
            onUploadGalleryWallpaper={handleGalleryWallpaperUpload}
            onUpdateTracks={setAudioTracks}
            onPlayTrack={playAudioTrack}
            onTogglePlayPause={toggleAudioPlayPause}
            onSeekAudio={(sec) => {
              setAudioCurrentTime(sec);
              if (audioElementRef.current) audioElementRef.current.currentTime = sec;
            }}
            onShowToast={showToast}
            audioElementRef={audioElementRef}
            isBackgroundVideoActive={Boolean(
              activeVideo && playerMode !== 'closed' && isVideoPlaying
            )}
            backgroundVideoTitle={activeVideo?.title}
            onOpenBackgroundVideo={() => setPlayerMode('full')}
          />
        )}

        {/* ========================================================================
            TAB 3: GLOBAL SEARCH BAR & RESULTS (Same Translucent Theme/Photo Backdrop!)
           ======================================================================== */}
        {bottomTab === 'search' && (
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="w-5 h-5 text-white/80 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search 4K/8K videos, movies, folders, or studio songs..."
                className="w-full pl-12 pr-4 py-4 rounded-3xl bg-white/15 backdrop-blur-2xl border border-white/30 text-sm font-bold text-white placeholder-white/70 outline-none focus:border-white shadow-xl"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-3">
              {filteredVideos.map((v) => (
                <div
                  key={v.id}
                  onClick={() => playVideoItem(v, true)}
                  className="p-3.5 rounded-3xl bg-white/12 backdrop-blur-2xl border border-white/20 hover:border-white/50 flex items-center justify-between gap-3 cursor-pointer shadow-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-24 aspect-video rounded-xl overflow-hidden shrink-0 border border-white/20">
                      <VideoThumbnailArt video={v} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{v.title}</h4>
                      <p className="text-xs text-white/75">
                        {v.resolution} · {v.format} · {v.folder}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-300 shrink-0">
                    {v.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================
            TAB 4: ME SECTION (Real Hybrid Share + 10 Real 3D Mascots + Hindi/English + Network Stream)
           ======================================================================== */}
        {bottomTab === 'me' && (
          <MeToolkitSection
            mascots={mascots}
            activeMascot={activeMascot}
            showMascot={showMascot}
            mascotSize={mascotSize}
            onSelectMascot={(m) => {
              setActiveMascot(m);
              setShowMascot(true);
            }}
            onUploadCustomMascotPhoto={handleUploadCustomMascotPhoto}
            onToggleShowMascot={() => setShowMascot((p) => !p)}
            onChangeMascotSize={setMascotSize}
            langMode={langMode}
            resolvedLang={resolvedLang}
            onChangeLangMode={setLangMode}
            customWallpaper={customWallpaper}
            wallpaperDim={wallpaperDim}
            activeBackdropId={activeBackdropId}
            onUploadGalleryWallpaper={handleGalleryWallpaperUpload}
            onClearGalleryWallpaper={clearCustomWallpaper}
            onChangeWallpaperDim={setWallpaperDim}
            onChangeBackdropId={(id: string) => {
              setCustomWallpaper(null);
              setActiveBackdropId(id);
            }}
            onPlayNetworkStreamInFullPlayer={(streamVideo: VideoItem) => {
              setVideos((prev) =>
                prev.some((v) => v.id === streamVideo.id) ? prev : [streamVideo, ...prev]
              );
              playVideoItem(streamVideo, true);
            }}
            onSaveStreamToLibrary={(streamVideo: VideoItem) => {
              setVideos((prev) =>
                prev.some((v) => v.id === streamVideo.id) ? prev : [streamVideo, ...prev]
              );
            }}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* ==========================================================================
          PURE-WHITE VIDEO PLAYER MODAL (Full / Mini PiP / Background Mode)
         ========================================================================== */}
      {activeVideo && playerMode !== 'closed' && (
        <VideoPlayerModal
          activeVideo={activeVideo}
          playlistQueue={videos}
          playerMode={playerMode}
          isVideoPlaying={isVideoPlaying}
          deviceTime={deviceTime}
          batteryLevel={batteryLevel}
          decoderEngine={decoderEngine}
          onSelectVideo={(v) => playVideoItem(v, playerMode === 'full')}
          onReorderQueue={(newQ) => setVideos(newQ)}
          onTogglePlayPause={toggleVideoPlayPause}
          onChangePlayerMode={(m) => {
            if (m === 'closed') {
              if (videoElementRef.current) videoElementRef.current.pause();
              setIsVideoPlaying(false);
            }
            setPlayerMode(m);
          }}
          onChangeDecoder={(d) => setDecoderEngine(d)}
          onExtractMp3={handleExtractVideoToMp3}
          onOpenDetails={(v) => {
            setSelectedVideoIds([v.id]);
            setShowDetailsModal(true);
          }}
          onShowToast={showToast}
          videoElementRef={videoElementRef}
        />
      )}

      {/* 4K / 8K Smart M13 Decoder Modal */}
      {showDecoderModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl max-w-lg w-full p-6 flex flex-col gap-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Cpu className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-extrabold text-white">
                  4K / 8K / 2K Smart Hybrid Decoder Engine
                </h3>
              </div>
              <button
                onClick={() => setShowDecoderModal(false)}
                className="p-1.5 rounded-xl bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 text-xs text-slate-200 leading-relaxed space-y-1.5">
              <p className="font-bold text-emerald-300">
                Smooth 8K / 4K Playback on Samsung M13 & All Devices:
              </p>
              <p>
                Automatically adapts high-bitrate 8K/4K HEVC & WEBM frames to your display pipeline so videos never stutter or show a black screen.
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {(
                [
                  {
                    id: 'HW+ Smart M13',
                    title: 'HW+ Smart M13 Adaptive Mode (Recommended)',
                    desc: 'Dynamically scales 8K/4K/2K streams to match your screen refresh rate with zero frame drop.'
                  },
                  {
                    id: '8K Direct Ultra',
                    title: '8K / 4K Direct Original Bitrate',
                    desc: 'Full uncompressed resolution for flagship GPUs and desktop displays.'
                  },
                  {
                    id: 'SW Fast Safe',
                    title: 'Software Fast Decoder (MKV / WEBM Safe Mode)',
                    desc: 'Bypasses hardware codec limits to play any MKV, WEBM, or HEVC file smoothly.'
                  }
                ] as const
              ).map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setDecoderEngine(mode.id);
                    showToast(`Switched 4K/8K Decoder to ${mode.id}`);
                    setShowDecoderModal(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 ${
                    decoderEngine === mode.id
                      ? 'bg-emerald-500/20 border-emerald-400 text-white'
                      : 'bg-black/40 border-white/10 text-slate-300 hover:border-white/25'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold text-white">{mode.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{mode.desc}</p>
                  </div>
                  {decoderEngine === mode.id && (
                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Single Video 3-Dot Action Sheet */}
      {singleActionVideo && (
        <div
          onClick={() => setSingleActionVideo(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-white/15 rounded-3xl max-w-md w-full p-5 flex flex-col gap-2 shadow-2xl"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div className="w-20 aspect-video rounded-xl overflow-hidden shrink-0">
                <VideoThumbnailArt video={singleActionVideo} />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-bold text-white truncate">
                  {singleActionVideo.title}
                </h4>
                <p className="text-xs text-slate-400">
                  {singleActionVideo.resolution} · {singleActionVideo.format} ·{' '}
                  {singleActionVideo.size}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playVideoItem(singleActionVideo, true);
                setSingleActionVideo(null);
              }}
              className="w-full px-4 py-3 rounded-2xl hover:bg-white/10 flex items-center gap-3 text-sm font-bold text-white"
            >
              <Play className="w-4 h-4 text-emerald-400" /> Play in Pure-White Pro Player
            </button>

            <button
              onClick={() => {
                setSelectedVideoIds([singleActionVideo.id]);
                setSelectionMode(true);
                setSingleActionVideo(null);
              }}
              className="w-full px-4 py-3 rounded-2xl hover:bg-white/10 flex items-center gap-3 text-sm font-bold text-white"
            >
              <CheckSquare className="w-4 h-4 text-emerald-400" /> Select Multiple Videos
            </button>

            <button
              onClick={() => {
                setSelectedVideoIds([singleActionVideo.id]);
                setSingleActionVideo(null);
                setShowHybridShareModal(true);
              }}
              className="w-full px-4 py-3 rounded-2xl hover:bg-white/10 flex items-center gap-3 text-sm font-bold text-white"
            >
              <Share2 className="w-4 h-4 text-cyan-400" /> Hybrid Share
            </button>

            <button
              onClick={() => {
                setSelectedVideoIds([singleActionVideo.id]);
                setSingleActionVideo(null);
                setShowDetailsModal(true);
              }}
              className="w-full px-4 py-3 rounded-2xl hover:bg-white/10 flex items-center gap-3 text-sm font-bold text-white"
            >
              <Info className="w-4 h-4 text-amber-400" /> Media & Codec Details
            </button>

            <button
              onClick={() => {
                setVideos((prev) => prev.filter((v) => v.id !== singleActionVideo.id));
                setSingleActionVideo(null);
                showToast('Video deleted');
              }}
              className="w-full px-4 py-3 rounded-2xl hover:bg-red-500/20 flex items-center gap-3 text-sm font-bold text-red-400"
            >
              <Trash2 className="w-4 h-4" /> Delete Video
            </button>
          </div>
        </div>
      )}

      {/* Hybrid Share Modal (Full Radar + QR/Barcode Receiver + Live Camera Barcode Scanner) */}
      {showHybridShareModal && (
        <div
          onClick={() => setShowHybridShareModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-950/95 border border-emerald-500/40 rounded-3xl max-w-4xl w-full p-4 sm:p-6 flex flex-col gap-3 shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-emerald-300">
                HYBRID SHARE PRO • RADAR + QR & BARCODE LIVE CAMERA SCANNER
              </span>
              <button
                onClick={() => setShowHybridShareModal(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <HybridShareStudioWidget
              mediaTitle={
                selectedVideoObjects.length > 0
                  ? `${selectedVideoObjects[0].title}${
                      selectedVideoObjects.length > 1
                        ? ` (+${selectedVideoObjects.length - 1} more)`
                        : ''
                    }`
                  : (activeVideo || videos[0])?.title || 'Hybrid 4K Media'
              }
              mediaUrl={(selectedVideoObjects[0] || activeVideo || videos[0])?.src || ''}
              mediaSize={(selectedVideoObjects[0] || activeVideo || videos[0])?.size || '62.11 MB'}
              lang={resolvedLang}
              onShowToast={showToast}
              onClose={() => setShowHybridShareModal(false)}
            />
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && (
        <div
          onClick={() => setShowDetailsModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-white/20 rounded-3xl max-w-md w-full p-6 flex flex-col gap-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Info className="w-5 h-5 text-cyan-400" />
                Media Technical Details
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-1.5 rounded-xl bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {(selectedVideoObjects.length > 0 ? selectedVideoObjects : [activeVideo || videos[0]])
              .slice(0, 2)
              .map((v) => (
                <div
                  key={v.id}
                  className="p-4 rounded-2xl bg-black/50 border border-white/10 text-xs space-y-2 font-mono"
                >
                  <p className="text-sm font-sans font-bold text-white">{v.title}</p>
                  <p className="text-slate-300">
                    Resolution: <span className="text-emerald-400">{v.resolution} ({v.fps} FPS)</span>
                  </p>
                  <p className="text-slate-300">
                    Format / Size: <span className="text-cyan-300">{v.format} • {v.size}</span>
                  </p>
                  <p className="text-slate-300">
                    Codec: <span className="text-amber-300">{v.codec}</span>
                  </p>
                  <p className="text-slate-300">
                    Bitrate: <span className="text-white">{v.bitrate}</span>
                  </p>
                  <p className="text-slate-300">
                    Folder Path: <span className="text-emerald-300">/storage/emulated/0/{v.folder}/</span>
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Theme & Gallery Wallpaper Modal */}
      {showThemeModal && (
        <div
          onClick={() => setShowThemeModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-slate-900 border border-white/20 rounded-3xl max-w-lg w-full p-6 flex flex-col gap-4 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                <Palette className="w-5 h-5 text-emerald-400" />
                Permanent Theme & Gallery Photo Studio
              </h3>
              <button
                onClick={() => setShowThemeModal(false)}
                className="p-1.5 rounded-xl bg-white/10 text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <label className="cursor-pointer w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg">
              <ImageIcon className="w-4 h-4" />
              Choose Photo from Gallery (Applies to Video, Audio & Search)
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  handleGalleryWallpaperUpload(e);
                  setShowThemeModal(false);
                }}
                className="hidden"
              />
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              {STUDIO_PICTURE_WALLPAPERS.map((wp) => (
                <button
                  key={wp.id}
                  onClick={() => {
                    setCustomWallpaper(null);
                    setActiveBackdropId(wp.id);
                    setShowThemeModal(false);
                    showToast(`Applied ${wp.name} across all screens!`);
                  }}
                  style={{ background: wp.cssBackground }}
                  className={`p-3.5 rounded-2xl border text-left ${
                    activeBackdropId === wp.id && !customWallpaper
                      ? 'border-white ring-2 ring-white/50'
                      : 'border-white/20'
                  }`}
                >
                  <p className="text-[10px] font-mono text-emerald-300 font-bold">
                    STUDIO PICTURE
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">{wp.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar */}
      <nav className="fixed bottom-3 inset-x-3 z-30 max-w-lg mx-auto">
        <div className="rounded-[34px] bg-[#142329]/85 backdrop-blur-2xl border border-white/20 p-2 grid grid-cols-4 gap-2 shadow-[0_12px_35px_rgba(0,0,0,0.85)]">
          <button
            onClick={() => setBottomTab('video')}
            className={`h-14 rounded-[26px] flex flex-col items-center justify-center transition-all ${
              bottomTab === 'video'
                ? 'bg-[#0c3b2e] border border-emerald-400/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Film className="w-5 h-5" />
            <span className="w-5 h-1 rounded-full bg-emerald-400 mt-1" />
          </button>

          <button
            onClick={() => setBottomTab('audio')}
            className={`h-14 rounded-[26px] flex flex-col items-center justify-center transition-all relative ${
              bottomTab === 'audio'
                ? 'bg-[#0c3b2e] border border-emerald-400/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Music className="w-5 h-5" />
            {isAudioPlaying && (
              <span className="text-[9px] font-mono text-emerald-300 mt-0.5">PLAYING</span>
            )}
          </button>

          <button
            onClick={() => setBottomTab('search')}
            className={`h-14 rounded-[26px] flex flex-col items-center justify-center transition-all ${
              bottomTab === 'search'
                ? 'bg-[#0c3b2e] border border-emerald-400/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => setBottomTab('me')}
            className={`h-14 rounded-[26px] flex flex-col items-center justify-center transition-all ${
              bottomTab === 'me'
                ? 'bg-[#0c3b2e] border border-emerald-400/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-white/5 text-slate-300 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Toast Feedback Banner */}
      {toastMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-white text-black text-xs font-extrabold shadow-2xl flex items-center gap-2 border border-white">
          <ShieldCheck className="w-4 h-4" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
