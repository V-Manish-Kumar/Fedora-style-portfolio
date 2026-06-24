import React, { Suspense } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useSystemStore } from '../store/useSystemStore';
import { useWindowStore } from '../store/useWindowStore';
import { Dock } from './Dock';
import { TopBar } from './TopBar';
import { Window } from '../windows/Window';
import { apps } from '../config/apps';
import { ActivitiesOverview } from './ActivitiesOverview';

export const Desktop: React.FC = () => {
  const wallpaper = useSystemStore((state) => state.wallpaper);
  const windows = useWindowStore((state) => state.windows);
  const largeText = useSystemStore((state) => state.largeText);
  const highContrast = useSystemStore((state) => state.highContrast);
  const activitiesMode = useSystemStore((state) => state.activitiesMode);
  const theme = useSystemStore((state) => state.theme);

  const hasMaximizedWindow = Object.values(windows).some(
    (win) => win.isOpen && win.isMaximized && !win.isMinimized
  );

  return (
    <div 
      className={`relative w-screen h-screen overflow-hidden bg-gray-900 bg-cover bg-center transition-all duration-300 ${
        theme === 'light' ? 'light theme-light text-slate-850' : 'dark theme-dark text-slate-200'
      } ${
        largeText ? 'text-[14px]' : 'text-xs'
      } ${
        highContrast ? 'contrast-[1.15] saturate-[0.75] bg-black' : ''
      }`}
      style={{ backgroundImage: `url(${wallpaper})` }}
      onContextMenu={(e) => e.preventDefault()}
    >
      {(!hasMaximizedWindow || activitiesMode) && <TopBar />}
      {/* Desktop boundary for windows when not maximized */}
      <div id="desktop-workspace-bounds" className="absolute top-8 left-0 right-0 bottom-0 pointer-events-none z-0" />
      {/* Desktop Icons Area (Optional implementation) */}
      <div className="absolute inset-0 p-4 pointer-events-none">
        {/* We can map desktop shortcut icons here later */}
      </div>

      {/* Render Open Windows */}
      <AnimatePresence>
        {Object.values(windows)
          .filter((win) => win.isOpen)
          .map((win) => {
            const appConfig = apps.find(a => a.id === win.id);
            if (!appConfig) return null;

            const AppContent = appConfig.component;

            return (
              <Window key={win.id} id={win.id} title={win.title}>
                <Suspense fallback={<div className="p-8 text-white">Loading...</div>}>
                  <AppContent />
                </Suspense>
              </Window>
            );
          })}
      </AnimatePresence>

      {/* Activities Overview Overlay */}
      <ActivitiesOverview />

      {/* Dock */}
      <Dock />
    </div>
  );
};
