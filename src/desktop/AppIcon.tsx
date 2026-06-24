import React from 'react';

interface AppIconProps {
  id: string;
  size?: number;
  className?: string;
}

export const AppIcon: React.FC<AppIconProps> = ({ id, size = 48, className = '' }) => {
  // Bevel overlay for 3D glass edge
  const BevelOverlay = () => (
    <div className="absolute inset-0 border border-white/20 rounded-[22%] pointer-events-none shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.4),inset_0_-1px_1.5px_rgba(0,0,0,0.2)]" />
  );

  // Gloss overlay for realistic glass glare reflection
  const GlossOverlay = () => (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none rounded-[22%]"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 0 L100 0 L100 35 Q50 62 0 35 Z"
        fill="url(#icon-gloss-grad)"
        opacity="0.14"
      />
      <defs>
        <linearGradient id="icon-gloss-grad" x1="50" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );

  // Render the core emblem graphic inside the glass tile
  const renderEmblem = () => {
    switch (id) {
      case 'terminal':
        return (
          <div className="w-[85%] h-[85%] flex flex-col p-[12%] justify-center font-mono font-bold leading-none text-emerald-400 text-[100%] drop-shadow-[0_0_6px_rgba(52,211,153,0.55)]">
            <span className="mb-[6%] opacity-60 flex space-x-1">
              <span className="w-[4px] h-[4px] rounded-full bg-red-500" />
              <span className="w-[4px] h-[4px] rounded-full bg-yellow-500" />
              <span className="w-[4px] h-[4px] rounded-full bg-green-500" />
            </span>
            <span className="flex-1 flex items-center">{`>_`}</span>
            <span className="text-[45%] text-emerald-500/60 font-normal select-none">run_process</span>
          </div>
        );

      case 'file-manager': // Frosted Amber Folder
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-[90%] h-[90%] drop-shadow-[0_4px_6px_rgba(0,0,0,0.22)]">
            {/* Back Flap */}
            <path d="M15 25 C15 21 19 18 23 18 L45 18 C48 18 51 22 54 24 L60 28 L85 28 C89 28 92 31 92 35 L92 78 C92 82 89 85 85 85 L15 85 C11 85 8 82 8 78 L8 29 C8 25 11 25 15 25 Z" fill="#d97706" opacity="0.8" />
            {/* Document sheet */}
            <rect x="25" y="24" width="50" height="35" rx="3" fill="white" opacity="0.85" />
            <line x1="32" y1="32" x2="68" y2="32" stroke="#cbd5e1" strokeWidth="3.5" strokeLinecap="round" />
            <line x1="32" y1="40" x2="60" y2="40" stroke="#cbd5e1" strokeWidth="3.5" strokeLinecap="round" />
            {/* Transparent Front Flap */}
            <path d="M8 38 C8 34 11 32 15 32 L85 32 C89 32 92 34 92 38 L92 78 C92 82 89 85 85 85 L15 85 C11 85 8 82 8 78 Z" fill="url(#folder-front-grad)" fillOpacity="0.85" />
            <path d="M10 35 L88 35" stroke="#fef3c7" strokeWidth="2" opacity="0.3" strokeLinecap="round" />
            <defs>
              <linearGradient id="folder-front-grad" x1="50" y1="32" x2="50" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fbbf24" />
                <stop offset="1" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'projects': // Glowing code brackets
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-[85%] h-[85%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]">
            <path d="M 32,32 L 18,50 L 32,68" stroke="#a78bfa" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_5px_#a78bfa]" />
            <path d="M 68,32 L 82,50 L 68,68" stroke="#a78bfa" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_0_5px_#a78bfa]" />
            <line x1="56" y1="26" x2="44" y2="74" stroke="#38bdf8" strokeWidth="6.5" strokeLinecap="round" className="drop-shadow-[0_0_5px_#38bdf8]" />
          </svg>
        );

      case 'about': // Glowing profile card info
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-[85%] h-[85%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
            <circle cx="50" cy="50" r="35" fill="url(#about-avatar-grad)" />
            <circle cx="50" cy="50" r="31" stroke="rgba(255,255,255,0.2)" strokeWidth="3" fill="none" />
            <circle cx="50" cy="38" r="11" fill="white" />
            <path d="M26,72 C26,58 35,56 50,56 C65,56 74,58 74,72 C74,74 72,76 69,76 H31 C28,76 26,74 26,72 Z" fill="white" />
            <defs>
              <linearGradient id="about-avatar-grad" x1="50" y1="15" x2="50" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#1d4ed8" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'skills': // Glowing AI brain / neural connections
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-[85%] h-[85%] drop-shadow-[0_4px_10px_rgba(34,211,238,0.3)]">
            {/* Connecting lines */}
            <path d="M30 45 L50 25 L70 45" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <path d="M30 45 L50 65 L70 45" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <path d="M50 25 L50 78" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <path d="M30 45 L70 45" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <path d="M50 45 L20 70" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />
            <path d="M50 45 L80 70" stroke="rgba(255,255,255,0.25)" strokeWidth="3" />

            {/* AI Nodes with glowing gradients */}
            <circle cx="50" cy="25" r="7" fill="url(#ai-node-cyan)" className="drop-shadow-[0_0_4px_#22d3ee]" />
            <circle cx="30" cy="45" r="7" fill="url(#ai-node-purple)" className="drop-shadow-[0_0_4px_#c084fc]" />
            <circle cx="70" cy="45" r="7" fill="url(#ai-node-purple)" className="drop-shadow-[0_0_4px_#c084fc]" />
            <circle cx="50" cy="45" r="9" fill="url(#ai-node-center)" className="drop-shadow-[0_0_8px_#38bdf8]" stroke="#ffffff" strokeWidth="1.5" />
            <circle cx="20" cy="70" r="7" fill="url(#ai-node-cyan)" className="drop-shadow-[0_0_4px_#22d3ee]" />
            <circle cx="80" cy="70" r="7" fill="url(#ai-node-cyan)" className="drop-shadow-[0_0_4px_#22d3ee]" />
            <circle cx="50" cy="78" r="7" fill="url(#ai-node-purple)" className="drop-shadow-[0_0_4px_#c084fc]" />

            <defs>
              <linearGradient id="ai-node-cyan" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#22d3ee" />
                <stop offset="1" stopColor="#0891b2" />
              </linearGradient>
              <linearGradient id="ai-node-purple" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#e9d5ff" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
              <linearGradient id="ai-node-center" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#ffffff" />
                <stop offset="0.5" stopColor="#38bdf8" />
                <stop offset="1" stopColor="#0369a1" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'resume': // CV Document layout
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-[90%] h-[90%] drop-shadow-[0_4px_7px_rgba(0,0,0,0.22)]">
            {/* Paper sheet */}
            <rect x="18" y="8" width="64" height="84" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
            
            {/* Profile image placeholder on the CV */}
            <rect x="26" y="16" width="16" height="16" rx="3" fill="#cbd5e1" />
            <circle cx="34" cy="22" r="4" fill="#94a3b8" />
            <path d="M28 30 C28 26 31 25 34 25 C37 25 40 26 40 30 Z" fill="#94a3b8" />
            
            {/* Name and Header lines */}
            <line x1="48" y1="18" x2="74" y2="18" stroke="#475569" strokeWidth="3" strokeLinecap="round" />
            <line x1="48" y1="26" x2="68" y2="26" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            
            {/* Body lines */}
            <line x1="26" y1="40" x2="74" y2="40" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <line x1="26" y1="48" x2="74" y2="48" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="56" x2="66" y2="56" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            
            <line x1="26" y1="66" x2="74" y2="66" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
            <line x1="26" y1="74" x2="70" y2="74" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1="26" y1="82" x2="58" y2="82" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'certificate': // Certificate page with ribbon seal
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-[85%] h-[85%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
            {/* Certificate Background Page */}
            <rect x="20" y="15" width="60" height="70" rx="3" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1.5" />
            <rect x="25" y="20" width="50" height="60" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.3" />
            
            {/* Text lines */}
            <line x1="32" y1="32" x2="68" y2="32" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="38" y1="42" x2="62" y2="42" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" />
            <line x1="30" y1="52" x2="70" y2="52" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round" />
            
            {/* Ribbon seal */}
            <g transform="translate(50, 68)">
              <path d="M-6 0 L-10 20 L-2 16 L6 20 L2 0 Z" fill="#ef4444" />
              <path d="M2 0 L6 20 L-2 16 L-10 20 L-6 0 Z" fill="#b91c1c" opacity="0.2" />
              
              <circle cx="0" cy="0" r="10" fill="url(#seal-gold-grad)" stroke="#d97706" strokeWidth="1" className="drop-shadow-[0_2px_4px_rgba(217,119,6,0.5)]" />
              <circle cx="0" cy="0" r="7" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" fill="none" strokeDasharray="2,2" />
            </g>
            <defs>
              <linearGradient id="seal-gold-grad" x1="-10" y1="-10" x2="10" y2="10" gradientUnits="userSpaceOnUse">
                <stop stopColor="#fbbf24" />
                <stop offset="1" stopColor="#d97706" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'browser': // Globe browser with glowing rings
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-[90%] h-[90%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]">
            <circle cx="50" cy="50" r="42" fill="url(#browser-world-grad)" />
            <ellipse cx="50" cy="50" rx="38" ry="14" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
            <ellipse cx="50" cy="50" rx="14" ry="38" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
            <line x1="8" y1="50" x2="92" y2="50" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
            <line x1="50" y1="8" x2="50" y2="92" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
            <ellipse cx="50" cy="50" rx="43" ry="22" stroke="url(#ring-glow-grad)" strokeWidth="4" transform="rotate(-28 50 50)" className="drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]" />
            <ellipse cx="50" cy="50" rx="36" ry="10" stroke="url(#ring-glow-grad-inner)" strokeWidth="2" transform="rotate(40 50 50)" className="drop-shadow-[0_0_4px_rgba(129,140,248,0.5)]" />
            <defs>
              <linearGradient id="browser-world-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06b6d4" />
                <stop offset="0.5" stopColor="#3b82f6" />
                <stop offset="1" stopColor="#1e3a8a" />
              </linearGradient>
              <linearGradient id="ring-glow-grad" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#22d3ee" />
                <stop offset="0.5" stopColor="#ffffff" />
                <stop offset="1" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="ring-glow-grad-inner" x1="0" y1="0" x2="100" y2="0" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a5b4fc" />
                <stop offset="1" stopColor="#818cf8" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'settings': // Detailed metal gears
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-[90%] h-[90%] drop-shadow-[0_4px_6px_rgba(0,0,0,0.25)]">
            <g transform="translate(42, 58) scale(0.65)">
              <circle cx="0" cy="0" r="28" fill="url(#gear-dark-grad)" />
              {[...Array(8)].map((_, i) => (
                <path key={i} d="M-8 -38 L8 -38 L12 -26 L-12 -26 Z" fill="url(#gear-dark-grad)" transform={`rotate(${i * 45})`} />
              ))}
              <circle cx="0" cy="0" r="26" fill="url(#gear-med-grad)" />
              <circle cx="0" cy="0" r="10" fill="#475569" />
            </g>
            <g transform="translate(68, 36) scale(0.5)">
              <circle cx="0" cy="0" r="28" fill="url(#gear-dark-grad)" />
              {[...Array(8)].map((_, i) => (
                <path key={i} d="M-8 -38 L8 -38 L12 -26 L-12 -26 Z" fill="url(#gear-dark-grad)" transform={`rotate(${i * 45 + 22.5})`} />
              ))}
              <circle cx="0" cy="0" r="26" fill="url(#gear-med-grad)" />
              <circle cx="0" cy="0" r="10" fill="#475569" />
            </g>
            <g transform="translate(34, 34) scale(0.6)">
              <circle cx="0" cy="0" r="28" fill="url(#gear-dark-grad)" />
              {[...Array(8)].map((_, i) => (
                <path key={i} d="M-8 -38 L8 -38 L12 -26 L-12 -26 Z" fill="url(#gear-dark-grad)" transform={`rotate(${i * 45 + 10})`} />
              ))}
              <circle cx="0" cy="0" r="26" fill="url(#gear-light-grad)" />
              <circle cx="0" cy="0" r="10" fill="#334155" />
            </g>
            <defs>
              <linearGradient id="gear-med-grad" x1="0" y1="-30" x2="0" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#cbd5e1" />
                <stop offset="1" stopColor="#64748b" />
              </linearGradient>
              <linearGradient id="gear-light-grad" x1="0" y1="-30" x2="0" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f1f5f9" />
                <stop offset="1" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="gear-dark-grad" x1="0" y1="-30" x2="0" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#94a3b8" />
                <stop offset="1" stopColor="#334155" />
              </linearGradient>
            </defs>
          </svg>
        );

      case 'monitor': // Heart rate graph wave
        return (
          <div className="w-[85%] h-[85%] bg-slate-950/70 border border-slate-900 rounded-[18%] overflow-hidden flex flex-col p-[6%] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(circle, #f43f5e 1px, transparent 1px), linear-gradient(to right, rgba(244,63,94,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,63,94,0.06) 1px, transparent 1px)',
                backgroundSize: '100% 100%, 8px 8px, 8px 8px'
              }}
            />
            <svg viewBox="0 0 100 100" fill="none" className="w-full h-full relative z-10">
              <path
                d="M0 50 L25 50 L32 30 L40 75 L48 45 L54 55 L60 50 L75 50 L82 15 L88 85 L94 50 L100 50"
                stroke="#38bdf8"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-[0_0_6px_#38bdf8]"
              />
              <circle cx="82" cy="15" r="3.5" fill="#38bdf8" />
            </svg>
          </div>
        );
      case 'snake':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-[85%] h-[85%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
            <rect x="20" y="20" width="12" height="12" fill="#22c55e" rx="2" />
            <rect x="34" y="20" width="12" height="12" fill="#22c55e" rx="2" />
            <rect x="48" y="20" width="12" height="12" fill="#22c55e" rx="2" />
            <rect x="48" y="34" width="12" height="12" fill="#22c55e" rx="2" />
            <rect x="48" y="48" width="12" height="12" fill="#22c55e" rx="2" />
            <rect x="62" y="48" width="12" height="12" fill="#22c55e" rx="2" />
            <circle cx="78" cy="54" r="5" fill="#ef4444" />
          </svg>
        );

      case 'tetris':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-[85%] h-[85%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
            <rect x="25" y="55" width="14" height="14" fill="#a855f7" rx="2" />
            <rect x="39" y="55" width="14" height="14" fill="#a855f7" rx="2" />
            <rect x="53" y="55" width="14" height="14" fill="#a855f7" rx="2" />
            <rect x="39" y="41" width="14" height="14" fill="#a855f7" rx="2" />
            <rect x="55" y="20" width="14" height="14" fill="#06b6d4" rx="2" />
            <rect x="55" y="34" width="14" height="14" fill="#06b6d4" rx="2" />
            <rect x="55" y="48" width="14" height="14" fill="#06b6d4" rx="2" />
            <rect x="55" y="62" width="14" height="14" fill="#06b6d4" rx="2" />
          </svg>
        );

      case 'flappy':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-[85%] h-[85%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
            <circle cx="45" cy="50" r="22" fill="#fce23e" />
            <circle cx="53" cy="42" r="6" fill="white" />
            <circle cx="54" cy="42" r="2" fill="black" />
            <path d="M 65,48 L 80,51 L 65,56 Z" fill="#f87b1c" />
            <ellipse cx="32" cy="52" rx="10" ry="7" fill="white" />
          </svg>
        );

      case 'space-fighter':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-[85%] h-[85%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
            <path d="M50 15 L25 75 L38 68 L50 78 L62 68 L75 75 Z" fill="#38bdf8" />
            <circle cx="50" cy="45" r="5" fill="#f43f5e" />
            <path d="M50 5 L50 10" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
          </svg>
        );

      case 'dino':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-[80%] h-[80%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
            <rect x="40" y="20" width="30" height="20" fill="#535353" />
            <rect x="40" y="40" width="20" height="30" fill="#535353" />
            <rect x="25" y="45" width="15" height="15" fill="#535353" />
            <rect x="35" y="70" width="8" height="15" fill="#535353" />
            <rect x="52" y="70" width="8" height="15" fill="#535353" />
            <rect x="45" y="24" width="4" height="4" fill="#f7f7f7" />
          </svg>
        );
      case 'games':
        return (
          <svg viewBox="0 0 100 100" fill="none" className="w-[85%] h-[85%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.35)]">
            <path d="M 22,35 C 32,35 38,32 50,32 C 62,32 68,35 78,35 C 92,35 94,52 90,68 C 86,84 74,86 64,80 C 58,76 54,74 50,74 C 46,74 42,76 36,80 C 26,86 14,84 10,68 C 6,52 8,35 22,35 Z" fill="url(#games-controller-grad)" />
            <rect x="24" y="50" width="8" height="14" fill="white" rx="1" />
            <rect x="21" y="53" width="14" height="8" fill="white" rx="1" />
            <circle cx="70" cy="50" r="4.5" fill="#f43f5e" />
            <circle cx="78" cy="57" r="4.5" fill="#eab308" />
            <defs>
              <linearGradient id="games-controller-grad" x1="0" y1="32" x2="0" y2="85" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366f1" />
                <stop offset="1" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
          </svg>
        );

      default:
        return <span className="text-lg font-bold font-sans text-white/50">?</span>;
    }
  };

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative select-none flex-shrink-0 group ${className}`}
    >
      {/* Frosted Glass Tile Wrapper (Matches Control Center widget design) */}
      <div className="relative w-full h-full glass-widget rounded-[22%] flex items-center justify-center overflow-hidden transition-all duration-300 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_28px_-6px_rgba(0,0,0,0.5)] border border-white/20">
        {renderEmblem()}
        <BevelOverlay />
        <GlossOverlay />
      </div>
    </div>
  );
};
