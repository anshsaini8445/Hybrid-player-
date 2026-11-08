export interface VideoItem {
  id: string;
  title: string;
  duration: string;
  durationSec: number;
  resolution: '8K' | '4K' | '2K' | '1080P' | 'HD';
  format: 'MKV' | 'WEBM' | 'MP4';
  size: string;
  folder: string;
  src: string;
  fallbackSrc: string;
  posterGradient: string;
  posterAccent: string;
  posterLabel: string;
  fps: number;
  bitrate: string;
  codec: string;
  isFavorite?: boolean;
  isStatus?: boolean;
  statusCategory?: '8K Ultra' | '4K Nature' | 'Cyberpunk' | 'Anime' | 'Cars' | 'Coding';
  watchedProgress: number;
  lastPlayedAt: number;
}

export interface AudioTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSec: number;
  src: string;
  quality: 'FLAC 24-Bit' | '320kbps MP3' | 'Dolby Atmos' | 'Hi-Res 96kHz';
  size: string;
  folder: string;
  coverGradient: string;
  bpm: number;
  isFavorite?: boolean;
}

export interface AppTheme {
  id: string;
  name: string;
  subtitle: string;
  bgGradient: string;
  cardBg: string;
  accentColor: string;
  accentHex: string;
  badgeText: string;
}

export interface MascotItem {
  id: string;
  name: string;
  badge: string;
  type: 'Teddy' | 'Puppy';
  hatStyle: string;
  primaryColor: string;
  secondaryColor: string;
  earStyle: 'round' | 'floppy';
  furColor: string;
  snoutColor: string;
  imageUrl: string;
  cssFilter?: string;
}

export type AppLanguageMode = 'system' | 'en' | 'hi';

export const UI_TRANSLATIONS = {
  en: {
    appName: 'Hybrid Player',
    history: 'History',
    latestFirst: 'Latest First',
    video: 'Video',
    folder: 'Folder',
    status: 'Status',
    audio: 'Audio Studio',
    search: 'Search',
    me: 'Me & Toolkit',
    galleryBg: 'Gallery BG',
    themes: 'Themes',
    addVideo: 'Add Video',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    hybridShare: 'Hybrid Share',
    delete: 'Delete',
    details: 'Details',
    networkStream: 'Network Stream Studio',
    appLanguage: 'App Language (System / EN / HI)',
    mascotStudio: '3D Fluffy Puppy & Teddy Mascots',
    wallpaperTitle: 'Themes & Gallery Photo Wallpaper',
    pickGalleryPhoto: 'Pick Photo from Gallery (Applies Everywhere)'
  },
  hi: {
    appName: 'हाइब्रिड प्लेयर (Hybrid Player)',
    history: 'इतिहास (History)',
    latestFirst: 'अभी देखे गए सबसे पहले',
    video: 'वीडियो',
    folder: 'फ़ोल्डर',
    status: 'स्टेटस',
    audio: 'ऑडियो स्टूडियो',
    search: 'खोजें',
    me: 'मी और टूलकिट',
    galleryBg: 'गैलरी फोटो',
    themes: 'थीम्स',
    addVideo: 'वीडियो जोड़ें',
    selectAll: 'सभी चुनें',
    deselectAll: 'चयन हटाएं',
    hybridShare: 'हाइब्रिड शेयर',
    delete: 'हटाएं',
    details: 'विवरण (Details)',
    networkStream: 'नेटवर्क स्ट्रीम स्टूडियो',
    appLanguage: 'ऐप भाषा (System Default / हिन्दी / English)',
    mascotStudio: '3D पपी और टेडी बियर मैस्कॉट स्टूडियो',
    wallpaperTitle: 'थीम और गैलरी फोटो वॉलपेपर (हर स्क्रीन पर)',
    pickGalleryPhoto: 'गैलरी से अपनी फोटो लगाएं (हर जगह स्थायी)'
  }
};

export const BUILTIN_THEMES: AppTheme[] = [
  {
    id: 'hybrid-default',
    name: 'Hybrid Crimson Dark (Default)',
    subtitle: 'Original Hybrid Player Obsidian + Emerald & Crimson Glow',
    bgGradient: 'linear-gradient(180deg, #160c12 0%, #0d0b11 45%, #090d14 100%)',
    cardBg: 'rgba(26, 36, 54, 0.86)',
    accentColor: 'emerald',
    accentHex: '#10b981',
    badgeText: 'DEFAULT ACTIVE'
  },
  {
    id: 'cyber-matrix',
    name: 'Neon Matrix Emerald',
    subtitle: 'Deep Cyber Forest with Ultra-Crisp Emerald Highlights',
    bgGradient: 'linear-gradient(160deg, #041f18 0%, #071318 50%, #050a0e 100%)',
    cardBg: 'rgba(13, 38, 34, 0.85)',
    accentColor: 'emerald',
    accentHex: '#10b981',
    badgeText: 'AMOLED SAVER'
  },
  {
    id: 'royal-amethyst',
    name: 'Royal Nebula Purple',
    subtitle: 'Midnight Velvet Cosmos with Violet Studio Surfaces',
    bgGradient: 'linear-gradient(160deg, #1d0c30 0%, #100b20 55%, #090812 100%)',
    cardBg: 'rgba(32, 23, 56, 0.85)',
    accentColor: 'violet',
    accentHex: '#8b5cf6',
    badgeText: 'STUDIO PRO'
  },
  {
    id: 'ocean-titanium',
    name: 'Oceanic Titanium Blue',
    subtitle: 'Deep Marine Slate for Long Night Movie Sessions',
    bgGradient: 'linear-gradient(160deg, #081c30 0%, #0a1424 55%, #060b14 100%)',
    cardBg: 'rgba(18, 35, 58, 0.86)',
    accentColor: 'cyan',
    accentHex: '#06b6d4',
    badgeText: 'CINEMA HDR'
  }
];

export const INITIAL_VIDEOS: VideoItem[] = [
  {
    id: 'vid-shanghai-4k',
    title: 'Welcome to futuristic Shanghai City 2088 (Ultra 4K HDR)',
    duration: '00:19',
    durationSec: 19,
    resolution: '4K',
    format: 'WEBM',
    size: '62.11MB',
    folder: 'Ansh videos',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    fallbackSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterGradient: 'from-indigo-950 via-purple-900 to-amber-700',
    posterAccent: '#f59e0b',
    posterLabel: 'SHANGHAI 2088 • 4K HDR',
    fps: 60,
    bitrate: '42.8 Mbps',
    codec: 'HEVC Main10 (HW+ Hybrid)',
    isFavorite: true,
    isStatus: true,
    statusCategory: 'Cyberpunk',
    watchedProgress: 68,
    lastPlayedAt: Date.now() - 1000 * 60 * 2
  },
  {
    id: 'vid-kickflip-4k',
    title: 'The Kickflip — Midnight Hypercar Street Drift 8K',
    duration: '00:43',
    durationSec: 43,
    resolution: '8K',
    format: 'MP4',
    size: '318.40MB',
    folder: 'Ansh videos',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    fallbackSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    posterGradient: 'from-slate-950 via-zinc-900 to-emerald-900',
    posterAccent: '#10b981',
    posterLabel: 'HYPERCAR 8K • 60FPS',
    fps: 60,
    bitrate: '68.4 Mbps',
    codec: 'AV1 / H.264 Smart Scale',
    isFavorite: true,
    isStatus: true,
    statusCategory: '8K Ultra',
    watchedProgress: 38,
    lastPlayedAt: Date.now() - 1000 * 60 * 14
  },
  {
    id: 'vid-ramayana-hd',
    title: 'Ramayana (2026) Hindi Movie 480p HD Epic Trailer',
    duration: '02:58:52',
    durationSec: 596,
    resolution: 'HD',
    format: 'MKV',
    size: '572.56MB',
    folder: 'JioSphere',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    fallbackSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    posterGradient: 'from-amber-950 via-orange-900 to-red-950',
    posterAccent: '#fb923c',
    posterLabel: 'EPIC CINEMA • DOLBY AUDIO',
    fps: 24,
    bitrate: '8.4 Mbps',
    codec: 'H.264 High@L4.1 + AAC 5.1',
    isFavorite: false,
    isStatus: false,
    watchedProgress: 24,
    lastPlayedAt: Date.now() - 1000 * 60 * 45
  },
  {
    id: 'vid-anim-coding',
    title: 'Animation vs. Coding (1080P HD) — print("hi")',
    duration: '09:26',
    durationSec: 566,
    resolution: '1080P',
    format: 'MP4',
    size: '55.06MB',
    folder: 'Ansh videos',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    fallbackSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    posterGradient: 'from-neutral-950 via-slate-900 to-yellow-900/60',
    posterAccent: '#eab308',
    posterLabel: 'print("hi")_ • 1080P',
    fps: 60,
    bitrate: '12.2 Mbps',
    codec: 'AVC1 Progressive (HW+)',
    isFavorite: true,
    isStatus: true,
    statusCategory: 'Coding',
    watchedProgress: 0,
    lastPlayedAt: 0
  },
  {
    id: 'vid-alps-8k',
    title: 'Swiss Alps Glacier Flight — Real 8K 60FPS Dolby Vision',
    duration: '12:14',
    durationSec: 734,
    resolution: '8K',
    format: 'MKV',
    size: '1.42GB',
    folder: '8K Ultra Demos',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    fallbackSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    posterGradient: 'from-sky-950 via-cyan-900 to-emerald-950',
    posterAccent: '#38bdf8',
    posterLabel: '8K ULTRA HD • HDR10+',
    fps: 60,
    bitrate: '85.0 Mbps',
    codec: 'HEVC 8K -> Smart M13 Engine',
    isFavorite: false,
    isStatus: true,
    statusCategory: '8K Ultra',
    watchedProgress: 0,
    lastPlayedAt: 0
  },
  {
    id: 'vid-tokyo-2k',
    title: 'Tokyo Midnight Rain Neon GT-R Status 2K QHD',
    duration: '00:15',
    durationSec: 15,
    resolution: '2K',
    format: 'MP4',
    size: '28.90MB',
    folder: 'WhatsApp Status',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    fallbackSrc: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    posterGradient: 'from-fuchsia-950 via-purple-950 to-cyan-900',
    posterAccent: '#e879f9',
    posterLabel: '2K QHD • 60FPS STATUS',
    fps: 60,
    bitrate: '24.5 Mbps',
    codec: 'H.264 High Profile (HW+)',
    isFavorite: true,
    isStatus: true,
    statusCategory: 'Cars',
    watchedProgress: 0,
    lastPlayedAt: 0
  }
];

export const INITIAL_AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'aud-1',
    title: 'Kesariya Terra Bass Remix (Dolby Atmos Studio)',
    artist: 'Ansh Studio & Arijit Vibe',
    album: 'Hybrid Bass Vol. 1',
    duration: '04:12',
    durationSec: 252,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    quality: 'Dolby Atmos',
    size: '14.8 MB',
    folder: 'Ansh Music',
    coverGradient: 'from-emerald-600 via-teal-700 to-slate-900',
    bpm: 124,
    isFavorite: true
  },
  {
    id: 'aud-2',
    title: 'Midnight Cyberpunk Synthwave Drive (8D Spatial)',
    artist: 'Neon Horizon',
    album: 'Shanghai 2088 OST',
    duration: '05:38',
    durationSec: 338,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    quality: 'FLAC 24-Bit',
    size: '38.4 MB',
    folder: 'Lossless FLAC',
    coverGradient: 'from-purple-600 via-indigo-800 to-slate-950',
    bpm: 118,
    isFavorite: true
  },
  {
    id: 'aud-3',
    title: 'Ramayana Theme — Sitar & Orchestral Epic Score',
    artist: 'Hans & Divine Strings',
    album: 'Epic Indian Cinema',
    duration: '03:54',
    durationSec: 234,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    quality: 'Hi-Res 96kHz',
    size: '29.1 MB',
    folder: 'JioSphere Audio',
    coverGradient: 'from-amber-500 via-orange-700 to-red-950',
    bpm: 96,
    isFavorite: false
  },
  {
    id: 'aud-4',
    title: 'Tokyo Drift Phonk 808 Sub-Bass Booster',
    artist: 'Kaito Drift',
    album: 'JDM Night Runners',
    duration: '02:58',
    durationSec: 178,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    quality: '320kbps MP3',
    size: '7.4 MB',
    folder: 'Bass Boosted',
    coverGradient: 'from-rose-600 via-pink-800 to-zinc-950',
    bpm: 140,
    isFavorite: true
  },
  {
    id: 'aud-5',
    title: 'Lofi Rain & Coding Focus Beats (print("hi"))',
    artist: 'Chilled Cassette Puppy',
    album: 'Late Night Commits',
    duration: '06:15',
    durationSec: 375,
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    quality: 'FLAC 24-Bit',
    size: '41.2 MB',
    folder: 'Ansh Music',
    coverGradient: 'from-cyan-600 via-blue-800 to-slate-950',
    bpm: 84,
    isFavorite: false
  }
];

export const MASCOT_COLLECTION: MascotItem[] = [
  {
    id: 'm1',
    name: 'Honey Beat Teddy',
    badge: 'HONEY TAPE',
    type: 'Teddy',
    hatStyle: 'Turquoise-Gold Checkered Horn Hat',
    primaryColor: '#f59e0b',
    secondaryColor: '#14b8a6',
    earStyle: 'round',
    furColor: '#d97706',
    snoutColor: '#fde68a',
    imageUrl: '/src/assets/images/mascot_honey_teddy_3d_1794114727822.jpg',
    cssFilter: 'none'
  },
  {
    id: 'm2',
    name: 'Sky DJ Puppy',
    badge: 'SKY PUPPY',
    type: 'Puppy',
    hatStyle: 'Royal-Cyan Checkered Horn Hat',
    primaryColor: '#38bdf8',
    secondaryColor: '#3b82f6',
    earStyle: 'floppy',
    furColor: '#93c5fd',
    snoutColor: '#fef3c7',
    imageUrl: '/src/assets/images/mascot_sky_puppy_3d_1794114729020.jpg',
    cssFilter: 'none'
  },
  {
    id: 'm3',
    name: 'Berry Vibe Teddy',
    badge: 'BERRY MIX',
    type: 'Teddy',
    hatStyle: 'Mint-Lime Checkered Horn Hat',
    primaryColor: '#f43f5e',
    secondaryColor: '#10b981',
    earStyle: 'round',
    furColor: '#fb7185',
    snoutColor: '#ffe4e6',
    imageUrl: '/src/assets/images/mascot_berry_teddy_3d_1794114730850.jpg',
    cssFilter: 'none'
  },
  {
    id: 'm4',
    name: 'Mocha Star Puppy',
    badge: 'MOCHA TAPE',
    type: 'Puppy',
    hatStyle: 'Sunny-Gold Checkered Horn Hat',
    primaryColor: '#a16207',
    secondaryColor: '#eab308',
    earStyle: 'floppy',
    furColor: '#78350f',
    snoutColor: '#fde68a',
    imageUrl: '/src/assets/images/mascot_mocha_puppy_3d_1794114729811.jpg',
    cssFilter: 'none'
  },
  {
    id: 'm5',
    name: 'Mint Groove Teddy',
    badge: 'MINT BEAT',
    type: 'Teddy',
    hatStyle: 'Coral-Emerald Checkered Horn Hat',
    primaryColor: '#10b981',
    secondaryColor: '#f97316',
    earStyle: 'round',
    furColor: '#34d399',
    snoutColor: '#d1fae5',
    imageUrl: '/src/assets/images/mascot_honey_teddy_3d_1794114727822.jpg',
    cssFilter: 'hue-rotate(95deg) saturate(1.15)'
  },
  {
    id: 'm6',
    name: 'Sunny Bass Puppy',
    badge: 'SUNNY PUP',
    type: 'Puppy',
    hatStyle: 'Violet-Gold Checkered Horn Hat',
    primaryColor: '#eab308',
    secondaryColor: '#06b6d4',
    earStyle: 'floppy',
    furColor: '#facc15',
    snoutColor: '#fef9c3',
    imageUrl: '/src/assets/images/mascot_sky_puppy_3d_1794114729020.jpg',
    cssFilter: 'hue-rotate(55deg) saturate(1.2)'
  },
  {
    id: 'm7',
    name: 'Peach Remix Teddy',
    badge: 'PEACH TAPE',
    type: 'Teddy',
    hatStyle: 'Royal-Sky Checkered Horn Hat',
    primaryColor: '#fb923c',
    secondaryColor: '#6366f1',
    earStyle: 'round',
    furColor: '#fdba74',
    snoutColor: '#ffedd5',
    imageUrl: '/src/assets/images/mascot_berry_teddy_3d_1794114730850.jpg',
    cssFilter: 'hue-rotate(35deg) saturate(1.15)'
  },
  {
    id: 'm8',
    name: 'Snowy Turbo Puppy',
    badge: 'SNOWY PUP',
    type: 'Puppy',
    hatStyle: 'Berry-Rose Checkered Horn Hat',
    primaryColor: '#e2e8f0',
    secondaryColor: '#ec4899',
    earStyle: 'floppy',
    furColor: '#f1f5f9',
    snoutColor: '#fce7f3',
    imageUrl: '/src/assets/images/mascot_mocha_puppy_3d_1794114729811.jpg',
    cssFilter: 'hue-rotate(190deg) brightness(1.08)'
  },
  {
    id: 'm9',
    name: 'Pistachio Lofi Teddy',
    badge: 'LOFI TAPE',
    type: 'Teddy',
    hatStyle: 'Tangerine Checkered Horn Hat',
    primaryColor: '#84cc16',
    secondaryColor: '#f97316',
    earStyle: 'round',
    furColor: '#a3e635',
    snoutColor: '#ecfccb',
    imageUrl: '/src/assets/images/mascot_berry_teddy_3d_1794114730850.jpg',
    cssFilter: 'hue-rotate(140deg) saturate(1.1)'
  },
  {
    id: 'm10',
    name: 'Cinnamon Wave Puppy',
    badge: 'WAVE PUP',
    type: 'Puppy',
    hatStyle: 'Electric-Teal Checkered Horn Hat',
    primaryColor: '#ea580c',
    secondaryColor: '#0d9488',
    earStyle: 'floppy',
    furColor: '#c2410c',
    snoutColor: '#ffedd5',
    imageUrl: '/src/assets/images/mascot_mocha_puppy_3d_1794114729811.jpg',
    cssFilter: 'hue-rotate(-25deg) saturate(1.25)'
  }
];
