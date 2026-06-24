import React, { useEffect, useRef } from 'react';
import { useSystemStore } from '../store/useSystemStore';
import { useWindowStore } from '../store/useWindowStore';
import { apps } from '../config/apps';
import { AppIcon } from './AppIcon';
import { Search } from 'lucide-react';

export const ActivitiesOverview: React.FC = () => {
  const activitiesMode = useSystemStore((state) => state.activitiesMode);
  const setActivitiesMode = useSystemStore((state) => state.setActivitiesMode);
  const query = useSystemStore((state) => state.activitiesSearchQuery);
  const setQuery = useSystemStore((state) => state.setActivitiesSearchQuery);

  const openWindow = useWindowStore((state) => state.openWindow);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter apps matching search query
  const filteredApps = query
    ? apps.filter(app =>
      !app.hideFromSearch && (
        app.title.toLowerCase().includes(query.toLowerCase()) ||
        app.id.toLowerCase().includes(query.toLowerCase())
      )
    )
    : [];

  useEffect(() => {
    if (activitiesMode) {
      const timer = setTimeout(() => {
        setQuery('');
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [activitiesMode, setQuery]);

  // Handle Escape key to close
  useEffect(() => {
    if (!activitiesMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActivitiesMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activitiesMode, setActivitiesMode]);

  if (!activitiesMode) return null;

  const handleLaunchApp = (id: string, title: string) => {
    openWindow(id, title);
    setActivitiesMode(false);
  };

  return (
    <>
      {/* Background Blur Overlay (Z-index 40, below scaled windows) */}
      <div 
        onClick={() => setActivitiesMode(false)}
        className="fixed inset-0 z-[40] bg-black/55 backdrop-blur-[38px] cursor-pointer animate-fade-in"
      />

      {/* Search Input and App Results Wrapper (Z-index 65, above scaled windows) */}
      <div className="fixed inset-x-0 top-0 bottom-0 pointer-events-none z-[65] flex flex-col items-center pt-16 px-10 select-none animate-fade-in">
        
        {/* Top Search Bar */}
        <div className="relative w-[360px] max-w-[85vw] mb-12 z-10 pointer-events-auto">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/50" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type to search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-white/10 hover:bg-white/15 focus:bg-white/15 border border-white/15 pl-10 pr-4 py-2 rounded-full text-white placeholder-white/45 text-center text-xs shadow-inner focus:outline-none focus:border-white/30 transition-all font-semibold"
          />
        </div>

        {/* Main Content Area (App Search Results) */}
        {query && (
          <div className="w-full flex-grow flex items-center justify-center z-10 max-w-3xl overflow-hidden pointer-events-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full justify-center overflow-y-auto max-h-[60vh] p-2">
              {filteredApps.length > 0 ? (
                filteredApps.map(app => {
                  return (
                    <div
                      key={app.id}
                      tabIndex={0}
                      onClick={() => handleLaunchApp(app.id, app.title)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleLaunchApp(app.id, app.title);
                        }
                      }}
                      className="flex flex-col items-center justify-center p-4 bg-white/5 hover:bg-[#3c6eb4] border border-white/10 rounded-2xl cursor-pointer text-center text-white transition-all transform hover:scale-105 active:scale-95 group shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
                    >
                      <div className="w-12 h-12 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                        <AppIcon id={app.id} size={48} />
                      </div>
                      <span className="text-xs font-bold">{app.title}</span>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center text-white/40 text-xs py-8">
                  No matching applications
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
