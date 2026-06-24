import React, { useState, useEffect, useRef } from 'react';
import { useWindowStore } from '../store/useWindowStore';
import { useSystemStore } from '../store/useSystemStore';
import { apps } from '../config/apps';
import { Search } from 'lucide-react';
import { AppIcon } from './AppIcon';
import { motion } from 'framer-motion';
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const openWindow = useWindowStore((state) => state.openWindow);
  const theme = useSystemStore((state) => state.theme);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setQuery('');
        setSelectedIndex(0);
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  const filteredApps = apps.filter((app) =>
    !app.hideFromSearch && (
      app.title.toLowerCase().includes(query.toLowerCase()) ||
      app.id.toLowerCase().includes(query.toLowerCase())
    )
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredApps.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredApps.length) % Math.max(1, filteredApps.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredApps[selectedIndex]) {
        launchApp(filteredApps[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  const launchApp = (app: typeof apps[0]) => {
    openWindow(app.id, app.title);
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 bg-black/45 backdrop-blur-[38px] z-[100] flex justify-center pt-28"
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        className={`w-[480px] max-w-[90vw] rounded-2xl shadow-2xl p-4 flex flex-col h-fit z-10 border ${
          theme === 'light'
            ? 'glass-widget-light text-slate-800'
            : 'glass-widget-dark text-white'
        }`}
        onKeyDown={handleKeyDown}
      >
        {/* Input area */}
        <div className="relative flex items-center mb-3">
          <Search size={18} className="absolute left-3 text-white/50" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search applications..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-[#3c6eb4] transition-all text-sm"
          />
        </div>

        {/* Results */}
        <div className="max-h-[280px] overflow-y-auto space-y-1">
          {filteredApps.length > 0 ? (
            filteredApps.map((app, idx) => {
              const isSelected = idx === selectedIndex;

              return (
                <div
                  key={app.id}
                  onClick={() => launchApp(app)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center px-3 py-2.5 rounded-xl cursor-pointer transition-all ${isSelected
                      ? 'bg-[#3c6eb4] text-white'
                      : 'hover:bg-white/5 text-gray-300'
                    }`}
                >
                  <AppIcon id={app.id} size={20} className="mr-3" />
                  <div className="text-xs font-semibold">{app.title}</div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-6 text-xs text-white/40">
              No matching applications found
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
