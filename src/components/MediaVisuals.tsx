import React from 'react';
import { MascotItem, VideoItem } from '../data/mediaData';

export function HybridLogoIcon({ size = 44 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative rounded-2xl bg-[#16070a] border border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.45)] flex items-center justify-center overflow-hidden shrink-0"
    >
      {/* Glowing radial aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(239,68,68,0.45),transparent_70%)]" />
      <div className="absolute inset-0.5 rounded-[14px] border border-red-400/30 pointer-events-none" />
      <svg viewBox="0 0 64 64" className="w-4/5 h-4/5 drop-shadow-[0_0_8px_rgba(248,113,113,0.9)]">
        <defs>
          <linearGradient id="hybridPlayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d4d" />
            <stop offset="50%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
        </defs>
        <path
          d="M18 13 C18 10, 21 8.5, 24 10.2 L51 27.2 C53.8 29, 53.8 35, 51 36.8 L24 53.8 C21 55.5, 18 54, 18 51 Z"
          fill="url(#hybridPlayGrad)"
          stroke="#fca5a5"
          strokeWidth="2"
        />
        <path
          d="M23 19 L43 32 L23 45 Z"
          fill="#450a0a"
          opacity="0.55"
        />
        <circle cx="24" cy="20" r="1.5" fill="#fecaca" />
        <circle cx="38" cy="32" r="1.8" fill="#fef08a" />
      </svg>
    </div>
  );
}

export function VideoThumbnailArt({
  video,
  className = 'w-full h-full'
}: {
  video: VideoItem;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${video.posterGradient} ${className}`}>
      {/* Custom tailored artwork matching each video in the user's screenshot */}
      {video.id === 'vid-ramayana-hd' && (
        <svg viewBox="0 0 240 135" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="ramaSky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#431407" />
              <stop offset="55%" stopColor="#9a3412" />
              <stop offset="100%" stopColor="#1c1917" />
            </linearGradient>
          </defs>
          <rect width="240" height="135" fill="url(#ramaSky)" />
          <circle cx="185" cy="42" r="24" fill="#fb923c" opacity="0.45" />
          {/* Temple pillars & silhouettes */}
          <rect x="18" y="20" width="12" height="105" fill="#291509" />
          <rect x="205" y="20" width="12" height="105" fill="#291509" />
          {/* Noble warrior silhouettes in saffron robes */}
          <circle cx="72" cy="56" r="10" fill="#fdba74" />
          <path d="M56 125 L63 68 L81 68 L88 125 Z" fill="#ea580c" />
          <path d="M90 36 Q104 68 90 118" stroke="#fde047" strokeWidth="2.5" fill="none" />
          <circle cx="110" cy="60" r="9.5" fill="#fed7aa" />
          <path d="M96 125 L102 72 L118 72 L124 125 Z" fill="#f97316" />
          <circle cx="145" cy="63" r="9" fill="#ffedd5" />
          <path d="M132 125 L138 75 L152 75 L158 125 Z" fill="#c2410c" />
        </svg>
      )}

      {video.id === 'vid-shanghai-4k' && (
        <svg viewBox="0 0 240 135" className="w-full h-full object-cover">
          <defs>
            <linearGradient id="shanghaiSky" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="50%" stopColor="#581c87" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>
          <rect width="240" height="135" fill="url(#shanghaiSky)" />
          <circle cx="92" cy="58" r="28" fill="#0d9488" opacity="0.35" />
          {/* Futuristic towers */}
          <rect x="105" y="18" width="14" height="90" fill="#fb923c" opacity="0.85" />
          <rect x="122" y="30" width="12" height="78" fill="#38bdf8" opacity="0.75" />
          <rect x="88" y="38" width="14" height="70" fill="#a855f7" opacity="0.8" />
          <rect x="138" y="45" width="18" height="63" fill="#f43f5e" opacity="0.7" />
          {/* Neon river reflection */}
          <rect x="0" y="106" width="240" height="29" fill="#090d16" />
          <line x1="70" y1="112" x2="170" y2="112" stroke="#f59e0b" strokeWidth="2" />
          <line x1="85" y1="119" x2="155" y2="119" stroke="#38bdf8" strokeWidth="1.5" />
        </svg>
      )}

      {video.id === 'vid-anim-coding' && (
        <svg viewBox="0 0 240 135" className="w-full h-full object-cover">
          <rect width="240" height="135" fill="#050505" />
          {/* Stick figure with laptop */}
          <circle cx="58" cy="46" r="10" fill="#facc15" />
          <line x1="58" y1="56" x2="58" y2="88" stroke="#facc15" strokeWidth="5" strokeLinecap="round" />
          <line x1="58" y1="88" x2="46" y2="114" stroke="#facc15" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="58" y1="88" x2="70" y2="114" stroke="#facc15" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="58" y1="68" x2="78" y2="72" stroke="#facc15" strokeWidth="4" strokeLinecap="round" />
          {/* White Laptop */}
          <polygon points="72,62 92,62 89,76 69,76" fill="#f8fafc" />
          <rect x="65" y="76" width="24" height="3" fill="#cbd5e1" />
          {/* Code text print("hi")_ */}
          <text x="98" y="84" fill="#e2e8f0" fontSize="17" fontFamily="monospace" fontWeight="bold">
            print("hi")_
          </text>
        </svg>
      )}

      {video.id === 'vid-kickflip-4k' && (
        <svg viewBox="0 0 240 135" className="w-full h-full object-cover">
          <rect width="240" height="135" fill="#040608" />
          <ellipse cx="120" cy="108" rx="75" ry="8" fill="#10b981" opacity="0.25" />
          <path d="M55 96 L88 80 L156 80 L185 96 Z" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="82" cy="98" r="10" fill="#0f172a" stroke="#94a3b8" strokeWidth="2.5" />
          <circle cx="158" cy="98" r="10" fill="#0f172a" stroke="#94a3b8" strokeWidth="2.5" />
          <line x1="15" y1="108" x2="225" y2="108" stroke="#334155" strokeWidth="1.5" />
        </svg>
      )}

      {!['vid-ramayana-hd', 'vid-shanghai-4k', 'vid-anim-coding', 'vid-kickflip-4k'].includes(video.id) && (
        <svg viewBox="0 0 240 135" className="w-full h-full object-cover">
          <circle cx="180" cy="36" r="32" fill={video.posterAccent} opacity="0.28" />
          <polygon points="15,135 85,52 155,135" fill="rgba(255,255,255,0.08)" />
          <polygon points="95,135 165,38 235,135" fill="rgba(255,255,255,0.13)" />
          <text x="16" y="32" fill="rgba(255,255,255,0.75)" fontSize="11" fontFamily="monospace" fontWeight="bold">
            {video.posterLabel}
          </text>
        </svg>
      )}
    </div>
  );
}

export function FluffyMascotAvatar({
  mascot,
  isDancing = false,
  size = 84
}: {
  mascot: MascotItem;
  isDancing?: boolean;
  size?: number;
}) {
  const [imgError, setImgError] = React.useState(false);

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative select-none rounded-2xl overflow-hidden flex items-center justify-center border-2 transition-all duration-300 shadow-[0_10px_25px_rgba(0,0,0,0.65)] ${
        isDancing
          ? 'border-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.55)] animate-bounce'
          : 'border-white/25'
      }`}
    >
      {!imgError && mascot.imageUrl ? (
        <img
          src={mascot.imageUrl}
          alt={mascot.name}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          style={{
            filter: mascot.cssFilter && mascot.cssFilter !== 'none' ? mascot.cssFilter : undefined
          }}
          className="w-full h-full object-cover"
        />
      ) : (
        <svg viewBox="0 0 120 120" className="w-full h-full bg-slate-900">
          <circle cx="60" cy="60" r="42" fill={mascot.furColor} />
          <circle cx="46" cy="54" r="6" fill="#090d16" />
          <circle cx="74" cy="54" r="6" fill="#090d16" />
          <ellipse cx="60" cy="64" rx="10" ry="7" fill={mascot.snoutColor} />
        </svg>
      )}
      {isDancing && (
        <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[8px] font-extrabold shadow">
          ♪ 3D
        </span>
      )}
    </div>
  );
}
