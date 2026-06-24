import React, { useState } from 'react';
import { useSystemStore } from '../store/useSystemStore';
import { Monitor, Info, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'appearance' | 'system'>('appearance');
  const wallpaper = useSystemStore((state) => state.wallpaper);
  const setWallpaper = useSystemStore((state) => state.setWallpaper);
  const theme = useSystemStore((state) => state.theme);
  const setTheme = useSystemStore((state) => state.setTheme);
  const isLight = theme === 'light';

  const wallpapers = [
    { name: 'Fedora Wallpaper', url: '/fedora-wallpaper.png' },
    { name: 'Abstract Cyber', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop' },
    { name: 'Frosted Waves', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2670&auto=format&fit=crop' },
  ];

  const sidebarClass = isLight
    ? 'bg-white/50 border-black/8 backdrop-blur-sm'
    : 'bg-slate-950/60 border-white/5';

  const labelClass = isLight ? 'text-slate-400' : 'text-slate-500';
  const itemActive = isLight ? 'text-slate-900' : 'text-white';
  const itemInactive = isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200';

  const headingClass = isLight
    ? 'text-slate-900 border-black/10'
    : 'text-white border-white/10';

  const sectionLabelClass = isLight ? 'text-slate-500' : 'text-slate-400';

  const themeOptionInactive = isLight
    ? 'bg-black/[0.04] border-transparent hover:bg-black/[0.07] text-slate-600'
    : 'bg-white/5 border-transparent hover:bg-white/10 text-slate-400';

  const wallpaperLabelClass = isLight
    ? 'text-slate-700 bg-black/[0.04]'
    : 'text-slate-300 bg-slate-950/40';

  const sysInfoRowClass = isLight
    ? 'border-black/10'
    : 'border-white/5';

  const sysInfoLabelClass = isLight ? 'text-slate-500' : 'text-slate-400';
  const sysInfoValueClass = isLight ? 'text-slate-900' : 'text-white';

  return (
    <div className={`flex h-full select-none ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
      {/* Settings Navigation Sidebar */}
      <div className={`w-48 border-r p-3.5 space-y-4 ${sidebarClass}`}>
        <div className={`text-[10px] font-bold uppercase tracking-wider px-2 ${labelClass}`}>Settings</div>
        <div className="space-y-1 text-xs">
          <div
            onClick={() => setActiveTab('appearance')}
            className={`relative flex items-center space-x-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
              activeTab === 'appearance' ? itemActive : itemInactive
            }`}
          >
            {activeTab === 'appearance' && (
              <motion.div
                layoutId="activeSettingsTab"
                className="absolute inset-0 liquid-glass-pill rounded-lg -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Monitor size={13} className={activeTab === 'appearance' ? 'text-[#3c6eb4]' : ''} />
            <span className="font-semibold">Appearance</span>
          </div>
          <div
            onClick={() => setActiveTab('system')}
            className={`relative flex items-center space-x-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
              activeTab === 'system' ? itemActive : itemInactive
            }`}
          >
            {activeTab === 'system' && (
              <motion.div
                layoutId="activeSettingsTab"
                className="absolute inset-0 liquid-glass-pill rounded-lg -z-10"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <Info size={13} className={activeTab === 'system' ? 'text-[#3c6eb4]' : ''} />
            <span className="font-semibold">System Info</span>
          </div>
        </div>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'appearance' ? (
          <div>
            <h2 className={`text-sm font-bold uppercase tracking-wider mb-6 border-b pb-2 ${headingClass}`}>Appearance Settings</h2>

            {/* Theme Settings */}
            <div className="mb-6">
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-3 ${sectionLabelClass}`}>Style &amp; Themes</label>
              <div className="grid grid-cols-2 gap-4 max-w-xs">
                <div
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-300 border ${
                    theme === 'light'
                      ? 'liquid-glass-card border-[#3c6eb4] text-white shadow-lg'
                      : themeOptionInactive
                  }`}
                >
                  <Sun size={18} className="mb-1 text-amber-400 animate-pulse" />
                  <span className="text-[10px] font-semibold">Light Theme</span>
                </div>
                <div
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl cursor-pointer transition-all duration-300 border ${
                    theme === 'dark'
                      ? 'liquid-glass-card border-[#3c6eb4] text-white shadow-lg'
                      : themeOptionInactive
                  }`}
                >
                  <Moon size={18} className="mb-1 text-blue-400 animate-pulse" />
                  <span className="text-[10px] font-semibold">Dark Theme</span>
                </div>
              </div>
            </div>

            {/* Wallpapers */}
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-3 ${sectionLabelClass}`}>Desktop Wallpapers</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {wallpapers.map((wp) => (
                  <div
                    key={wp.name}
                    onClick={() => setWallpaper(wp.url)}
                    className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] border ${
                      wallpaper === wp.url
                        ? 'border-[#3c6eb4] ring-2 ring-[#3c6eb4]/30'
                        : isLight ? 'border-black/10 hover:border-black/20' : 'border-white/10 hover:border-white/20'
                    } ${isLight ? 'bg-black/[0.02]' : 'bg-white/5'}`}
                  >
                    <img src={wp.url} alt={wp.name} className="w-full h-20 object-cover" />
                    <div className={`p-2 text-center text-[10px] font-bold ${wallpaperLabelClass}`}>{wp.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-md">
            <h2 className={`text-sm font-bold uppercase tracking-wider mb-6 border-b pb-2 ${headingClass}`}>System Information</h2>

            <div className="liquid-glass-card rounded-2xl p-5 space-y-4">
              {[
                { label: 'OS Name', value: 'Fedora Workstation' },
                { label: 'OS Version', value: 'Fedora 40 (Gnome Edition)' },
                { label: 'Gnome Version', value: 'GNOME 46.2' },
                { label: 'Windowing System', value: 'Wayland' },
                { label: 'Processor', value: 'Intel® Core™ i9-14900K × 32' },
                { label: 'System Memory', value: '65,536 MB (64 GB RAM)' },
              ].map(({ label, value }, idx, arr) => (
                <div key={label} className={`flex justify-between items-center py-2 ${idx < arr.length - 1 ? `border-b ${sysInfoRowClass}` : ''}`}>
                  <span className={`text-xs font-semibold ${sysInfoLabelClass}`}>{label}</span>
                  <span className={`text-xs font-bold ${sysInfoValueClass}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsApp;
