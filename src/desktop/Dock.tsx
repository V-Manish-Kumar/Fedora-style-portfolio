import React from 'react';
import { motion } from 'framer-motion';
import { useWindowStore } from '../store/useWindowStore';
import { useSystemStore } from '../store/useSystemStore';
import { apps } from '../config/apps';
import { AppIcon } from './AppIcon';

export const Dock: React.FC = () => {
  const openWindow = useWindowStore((state) => state.openWindow);
  const windows = useWindowStore((state) => state.windows);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  const setSelectedProjectId = useWindowStore((state) => state.setSelectedProjectId);
  const theme = useSystemStore((state) => state.theme);

  const handleAppClick = (id: string, title: string) => {
    if (id === 'projects') {
      setSelectedProjectId(null);
    }
    const windowState = windows[id];
    if (windowState) {
      if (windowState.isMinimized) {
        focusWindow(id);
      } else if (!windowState.isOpen) {
        openWindow(id, title);
      } else {
        focusWindow(id);
      }
    } else {
      openWindow(id, title);
    }
  };

  return (
    <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2.5 rounded-[28px] flex items-end space-x-3.5 shadow-[0_24px_50px_-12px_rgba(0,0,0,0.45)] z-50 transition-all duration-300 border backdrop-blur-[35px] ${
      theme === 'light'
        ? 'bg-white/40 border-white/40 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.65)]'
        : 'bg-slate-900/40 border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]'
    }`}>
      {apps.filter((app) => !app.hideFromDock).map((app) => {
        const isOpen = windows[app.id]?.isOpen;

        return (
          <motion.div
            key={app.id}
            tabIndex={0}
            className="relative flex flex-col items-center group cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-900/60"
            whileHover={{ y: -10, scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleAppClick(app.id, app.title)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleAppClick(app.id, app.title);
              }
            }}
          >
            {/* Tooltip */}
            <div className={`absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md text-[10px] font-semibold px-2.5 py-1.5 rounded-lg whitespace-nowrap pointer-events-none shadow-2xl ${
              theme === 'light'
                ? 'bg-white/90 border border-black/10 text-slate-800 shadow-black/10'
                : 'bg-slate-900/85 border border-white/10 text-white'
            }`}>
              {app.title}
            </div>

            {/* App Icon Container */}
            <div
              id={`dock-icon-${app.id}`}
              className="w-12 h-12 flex items-center justify-center transition-all duration-300 drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)]"
            >
              <AppIcon id={app.id} size={48} />
            </div>

            {/* Active Indicator (Fedora GNOME dash-to-dock style blue glowing dot) */}
            {isOpen && (
              <div className="absolute -bottom-2 w-1.5 h-1.5 bg-[#4f88dc] rounded-full shadow-[0_0_8px_#4f88dc] transition-all duration-300" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
