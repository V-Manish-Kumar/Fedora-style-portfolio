import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Home, Search, ShieldCheck } from 'lucide-react';
import { useWindowStore } from '../store/useWindowStore';
import { useSystemStore } from '../store/useSystemStore';

interface ShortcutItem {
  name: string;
  url: string;
  logo: React.ReactNode;
}

const BrowserApp: React.FC = () => {
  const browserUrl = useWindowStore((state) => state.browserUrl);
  const setBrowserUrl = useWindowStore((state) => state.setBrowserUrl);
  const theme = useSystemStore((state) => state.theme);
  const isLight = theme === 'light';

  const [inputUrl, setInputUrl] = useState(browserUrl);
  const [searchInput, setSearchInput] = useState('');

  React.useEffect(() => {
    setInputUrl(browserUrl);
    if (browserUrl !== 'chrome://newtab') {
      setSearchInput('');
    }
  }, [browserUrl]);

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = inputUrl.trim();
    if (!finalUrl) return;

    if (finalUrl === 'chrome://newtab') {
      setBrowserUrl('chrome://newtab');
    } else if (
      finalUrl.includes('.') &&
      !finalUrl.includes(' ') &&
      (finalUrl.startsWith('http') || !finalUrl.includes('://'))
    ) {
      if (!finalUrl.startsWith('http')) {
        finalUrl = 'https://' + finalUrl;
      }
      setBrowserUrl(finalUrl);
    } else {
      setBrowserUrl(`https://www.google.com/search?q=${encodeURIComponent(finalUrl)}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    if (!query) return;

    if (
      query.includes('.') &&
      !query.includes(' ') &&
      (query.startsWith('http') || !query.includes('://'))
    ) {
      let url = query;
      if (!url.startsWith('http')) {
        url = 'https://' + url;
      }
      setBrowserUrl(url);
    } else {
      setBrowserUrl(`https://www.google.com/search?q=${encodeURIComponent(query)}`);
    }
  };

  const shortcuts: ShortcutItem[] = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/v-manish-kumar',
      logo: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-[#0077b5]">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      url: 'https://github.com/V-Manish-Kumar',
      logo: (
        <svg viewBox="0 0 24 24" className={`w-7 h-7 ${isLight ? 'fill-slate-800' : 'fill-white'}`}>
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      name: 'Mail',
      url: 'mailto:manishedu980@gmail.com',
      logo: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-rose-500">
          <path d="M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l12-9.728v12.441c0 .552-.448 1-1 1h-22c-.552 0-1-.448-1-1v-12.441l12 9.728z" />
        </svg>
      ),
    },
    {
      name: 'Team Connect',
      url: 'https://team-connect.v-manish-kumar.dev',
      logo: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-[2.5] stroke-indigo-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
        </svg>
      ),
    },
    {
      name: 'Drug Discovery',
      url: 'https://drug-discovery-ai.v-manish-kumar.dev',
      logo: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-[2.5] stroke-emerald-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v1.244c0 .593-.162 1.173-.47 1.68L4.015 14.887c-.82 1.351-.212 3.11 1.296 3.11h13.376c1.508 0 2.116-1.759 1.296-3.11L14.72 6.027a3.003 3.003 0 01-.47-1.68V3.104M9.75 3.104c0-.593.481-1.074 1.074-1.074h2.352c.593 0 1.074.481 1.074 1.074M9.75 3.104h4.5m-9 11.25h9" />
        </svg>
      ),
    },
    {
      name: 'InstaAD AI',
      url: 'https://instaad.ai.v-manish-kumar.dev',
      logo: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-[2] stroke-pink-500">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeLinecap="round" strokeWidth="2.5" />
        </svg>
      ),
    },
    {
      name: 'Mini RAG App',
      url: 'https://rag-system.v-manish-kumar.dev',
      logo: (
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-none stroke-[2.5] stroke-amber-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
  ];

  const navBarClass = isLight
    ? 'bg-white/70 border-black/10 backdrop-blur-md'
    : 'bg-[#181d28]/95 border-white/5';

  const navBtnClass = isLight
    ? 'text-slate-500 hover:bg-black/[0.06] hover:text-slate-900'
    : 'text-slate-400 hover:bg-white/5 hover:text-white';

  const addressBarClass = isLight
    ? 'bg-black/[0.04] border-black/10 hover:border-black/15 focus-within:border-[#3c6eb4] focus-within:bg-black/[0.06]'
    : 'bg-black/30 border-white/5 hover:border-white/10 focus-within:border-[#3c6eb4] focus-within:bg-black/50';

  const inputTextClass = isLight ? 'text-slate-800 placeholder-slate-400' : 'text-slate-200 placeholder-slate-500';

  return (
    <div className={`flex flex-col h-full select-none ${isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#0c101b] text-slate-200'}`}>
      {/* Navigation Bar */}
      <div className={`border-b px-4 py-2.5 flex items-center space-x-3 shadow-md ${navBarClass}`}>
        <div className="flex space-x-1.5">
          <button onClick={() => setBrowserUrl('chrome://newtab')} className={`p-1.5 rounded-lg cursor-pointer transition-colors ${navBtnClass}`} title="Back">
            <ArrowLeft size={14} />
          </button>
          <button className={`p-1.5 opacity-30 rounded-lg ${isLight ? 'text-slate-400' : 'text-slate-400'}`} title="Forward" disabled>
            <ArrowRight size={14} />
          </button>
          <button onClick={() => setBrowserUrl(browserUrl)} className={`p-1.5 rounded-lg cursor-pointer transition-colors ${navBtnClass}`} title="Reload">
            <RotateCw size={14} />
          </button>
          <button onClick={() => setBrowserUrl('chrome://newtab')} className={`p-1.5 rounded-lg cursor-pointer transition-colors ${navBtnClass}`} title="Home">
            <Home size={14} />
          </button>
        </div>

        <form onSubmit={handleNavigate} className={`flex-1 flex items-center rounded-xl px-3.5 py-1.5 transition-all border ${addressBarClass}`}>
          <ShieldCheck size={14} className="text-emerald-500 mr-2.5" />
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            className={`w-full bg-transparent text-xs focus:outline-none font-mono ${inputTextClass}`}
            placeholder="Search Google or enter web address"
          />
          <button type="submit" className="hidden" />
        </form>
      </div>

      {/* Browser Viewport */}
      <div className="flex-grow overflow-y-auto">
        {browserUrl === 'chrome://newtab' ? (
          <div className={`h-full flex flex-col items-center justify-center p-6 md:p-12 max-w-4xl mx-auto min-h-[500px] relative`}>
            <div className="absolute inset-0 bg-[#3c6eb4]/3 rounded-full blur-3xl -z-10 pointer-events-none" />

            {/* Google Logo */}
            <div className="flex items-center text-5xl md:text-6xl font-bold tracking-tight mb-8 select-none">
              <span className="text-[#4285F4]">G</span>
              <span className="text-[#EA4335]">o</span>
              <span className="text-[#FBBC05]">o</span>
              <span className="text-[#4285F4]">g</span>
              <span className="text-[#34A853]">l</span>
              <span className="text-[#EA4335]">e</span>
            </div>

            {/* Google Search Form */}
            <form
              onSubmit={handleSearchSubmit}
              className={`w-full max-w-xl flex items-center rounded-full px-5 py-3 transition-all duration-200 mb-9 border ${
                isLight
                  ? 'bg-white border-black/10 hover:border-black/20 focus-within:border-[#3c6eb4]/60 focus-within:shadow-[0_0_12px_rgba(60,110,180,0.12)] shadow-md'
                  : 'bg-[#1e2533] border-white/10 hover:border-white/20 hover:bg-[#232a3b] focus-within:bg-[#232a3b] focus-within:border-[#3c6eb4]/60 focus-within:shadow-[0_0_12px_rgba(60,110,180,0.15)]'
              }`}
            >
              <Search size={18} className={`mr-3 ${isLight ? 'text-slate-400' : 'text-slate-400'}`} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className={`w-full bg-transparent text-sm focus:outline-none ${isLight ? 'text-slate-900 placeholder-slate-400' : 'text-slate-100 placeholder-slate-400'}`}
                placeholder="Search Google or type a URL"
              />
            </form>

            {/* Shortcut Grid */}
            <div className="grid grid-cols-4 gap-y-6 gap-x-4 w-full max-w-lg mx-auto mt-4 justify-items-center">
              {shortcuts.map((shortcut, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (shortcut.url.startsWith('mailto:')) {
                      window.location.href = shortcut.url;
                    } else {
                      window.open(shortcut.url, '_blank', 'noopener,noreferrer');
                    }
                  }}
                  className="flex flex-col items-center space-y-2 group cursor-pointer w-20"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:-translate-y-0.5 transition-all duration-200 ${
                    isLight ? 'bg-white border border-black/10 shadow-md' : 'bg-slate-800/80 border border-white/10'
                  }`}>
                    {shortcut.logo}
                  </div>
                  <span className={`text-[10px] text-center font-medium truncate w-full px-1 transition-colors ${
                    isLight ? 'text-slate-500 group-hover:text-slate-800' : 'text-slate-400 group-hover:text-slate-100'
                  }`}>
                    {shortcut.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* External Link Redirect Card */
          <div className={`h-full flex items-center justify-center p-8 ${isLight ? 'bg-slate-100/40' : 'bg-slate-900/10'}`}>
            <div className={`border p-6 md:p-8 rounded-2xl max-w-lg text-center shadow-2xl backdrop-blur-md relative overflow-hidden ${
              isLight ? 'bg-white/80 border-black/10' : 'bg-[#161b26]/80 border-white/10'
            }`}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#3c6eb4]/8 rounded-full blur-3xl -z-10" />

              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-[#3c6eb4] ${
                isLight ? 'bg-[#3c6eb4]/10 border border-[#3c6eb4]/20' : 'bg-white/5 border border-white/15'
              }`}>
                <Search size={22} className="animate-pulse" />
              </div>

              <h2 className={`text-lg font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>Security Connection Redirect</h2>
              <p className={`text-xs leading-relaxed mb-6 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                External portals (like GitHub, LinkedIn, and verification links) block direct iframe rendering inside a sandboxed wrapper. Click below to load your destination securely.
              </p>

              <div className={`rounded-xl p-3.5 mb-6 text-left border ${
                isLight ? 'bg-slate-100/80 border-black/10' : 'bg-slate-950/40 border-white/5'
              }`}>
                <div className={`text-[10px] uppercase font-bold mb-1 font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>Target Destination</div>
                <div className="text-xs text-[#3c6eb4] font-mono truncate">{browserUrl}</div>
              </div>

              <div className="flex justify-center space-x-3">
                <button
                  onClick={() => setBrowserUrl('chrome://newtab')}
                  className={`py-2.5 px-5 rounded-xl text-xs font-semibold cursor-pointer border transition-all ${
                    isLight
                      ? 'bg-black/[0.04] hover:bg-black/[0.08] text-slate-700 border-black/10'
                      : 'bg-white/5 hover:bg-white/10 active:bg-white/15 text-slate-300 border-white/10'
                  }`}
                >
                  Back to Hub
                </button>
                <a
                  href={browserUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block py-2.5 px-6 bg-[#3c6eb4] hover:bg-[#3c6eb4]/90 active:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer border border-white/10 transition-all duration-150 shadow-lg hover:shadow-[#3c6eb4]/20"
                >
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowserApp;
