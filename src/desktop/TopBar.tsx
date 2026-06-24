import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Volume2, Volume1, Volume, VolumeX, Sun, SunDim, Search, Moon, Plane, Settings, Power, Lock, Bell, Accessibility, RotateCw } from 'lucide-react';
import { BatteryIcon } from './BatteryIcon';
import { useSystemStore } from '../store/useSystemStore';
import { useWindowStore } from '../store/useWindowStore';
import { SearchModal } from './SearchModal';
import { motion, AnimatePresence } from 'framer-motion';
export const TopBar: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAccessMenuOpen, setIsAccessMenuOpen] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Quick Settings toggle states
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [airplaneMode, setAirplaneMode] = useState(false);

  const nightLightEnabled = useSystemStore((state) => state.nightLight);
  const setNightLightEnabled = useSystemStore((state) => state.setNightLight);

  const volume = useSystemStore((state) => state.volume);
  const setVolume = useSystemStore((state) => state.setVolume);
  const brightness = useSystemStore((state) => state.brightness);
  const setBrightness = useSystemStore((state) => state.setBrightness);
  const battery = useSystemStore((state) => state.battery);
  const setBattery = useSystemStore((state) => state.setBattery);

  const highContrast = useSystemStore((state) => state.highContrast);
  const setHighContrast = useSystemStore((state) => state.setHighContrast);
  const screenReader = useSystemStore((state) => state.screenReader);
  const setScreenReader = useSystemStore((state) => state.setScreenReader);
  const largeText = useSystemStore((state) => state.largeText);
  const setLargeText = useSystemStore((state) => state.setLargeText);

  const setBootState = useSystemStore((state) => state.setBootState);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);
  const openWindow = useWindowStore((state) => state.openWindow);
  const activitiesMode = useSystemStore((state) => state.activitiesMode);
  const setActivitiesMode = useSystemStore((state) => state.setActivitiesMode);
  const theme = useSystemStore((state) => state.theme);
  const setTheme = useSystemStore((state) => state.setTheme);

  const getVolumeIcon = (val: number, size: number, className?: string) => {
    if (val === 0) return <VolumeX size={size} className={className} />;
    if (val <= 33) return <Volume size={size} className={className} />;
    if (val <= 66) return <Volume1 size={size} className={className} />;
    return <Volume2 size={size} className={className} />;
  };

  const getBrightnessIcon = (val: number, size: number, className?: string) => {
    if (val <= 50) return <SunDim size={size} className={className} />;
    return <Sun size={size} className={className} />;
  };
  const windows = useWindowStore((state) => state.windows);

  const calendarRef = useRef<HTMLDivElement>(null);
  const quickSettingsRef = useRef<HTMLDivElement>(null);
  const accessMenuRef = useRef<HTMLDivElement>(null);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isCalendarOpen && calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (isQuickSettingsOpen && quickSettingsRef.current && !quickSettingsRef.current.contains(e.target as Node)) {
        setIsQuickSettingsOpen(false);
      }
      if (isAccessMenuOpen && accessMenuRef.current && !accessMenuRef.current.contains(e.target as Node)) {
        setIsAccessMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isCalendarOpen, isQuickSettingsOpen, isAccessMenuOpen]);

  const activeWindow = activeWindowId ? windows[activeWindowId] : null;

  const formatTime = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + 
           '  ' + 
           date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  // Generate calendar days
  const getDaysInMonth = () => {
    const days = [];
    const date = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), 1);
    const startDay = date.getDay();
    const totalDays = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 0).getDate();

    // Padding for prev month days
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    // Days in current month
    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }
    return days;
  };

  return (
    <div className={`absolute top-0 left-0 right-0 h-8 text-xs font-semibold flex justify-between items-center px-3 select-none z-[60] border-b backdrop-blur-md transition-all ${
      theme === 'light'
        ? 'bg-white/35 border-white/20 shadow-xs text-slate-800'
        : 'bg-slate-900/35 border-white/5 shadow-xs text-[#dedede]'
    }`}>
      
      {/* Left side: Activities & App Menu */}
      <div className="flex items-center space-x-2 h-full">
        <div 
          tabIndex={0}
          onClick={() => setActivitiesMode(!activitiesMode)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setActivitiesMode(!activitiesMode);
            }
          }}
          className={`px-3 h-[75%] rounded-md flex items-center cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 border shadow-xs ${
            theme === 'light'
              ? 'bg-black/5 border-black/5 hover:bg-black/10 text-slate-800'
              : 'bg-white/5 border-white/5 hover:bg-white/10 text-[#dedede]'
          } ${activitiesMode ? 'liquid-glass-pill text-white font-bold border-blue-400/25' : ''}`}
        >
          Activities
        </div>
        {activeWindow && activeWindow.isOpen && (
          <>
            <span className="text-[#666] font-light">|</span>
            <div className={`px-3 h-[75%] rounded-md flex items-center cursor-pointer transition-all duration-200 space-x-1.5 border shadow-xs ${
              theme === 'light'
                ? 'bg-black/5 border-black/5 hover:bg-black/10 text-slate-800'
                : 'bg-white/5 border-white/5 hover:bg-white/10 text-white'
            }`}>
              <span className="w-1.5 h-1.5 bg-[#4f88dc] rounded-full inline-block"></span>
              <span>{activeWindow.title}</span>
            </div>
          </>
        )}
      </div>

      {/* Center: Clock */}
      <div 
        tabIndex={0}
        onClick={() => {
          setIsCalendarOpen(!isCalendarOpen);
          setIsQuickSettingsOpen(false);
          setIsAccessMenuOpen(false);
          setIsSearchOpen(false);
          setCalendarDate(new Date());
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsCalendarOpen(!isCalendarOpen);
            setIsQuickSettingsOpen(false);
            setIsAccessMenuOpen(false);
            setIsSearchOpen(false);
            setCalendarDate(new Date());
          }
        }}
        className={`px-4 h-[75%] rounded-md flex items-center cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 border shadow-xs ${
          theme === 'light'
            ? 'bg-black/5 border-black/5 hover:bg-black/10 text-slate-800'
            : 'bg-white/5 border-white/5 hover:bg-white/10 text-[#dedede]'
        } ${isCalendarOpen ? 'liquid-glass-pill text-white font-bold border-blue-400/25' : ''}`}
      >
        {formatTime(time)}
      </div>

      {/* Right side: Search, Accessibility, & Status Tray Pill */}
      <div className="flex items-center space-x-2 h-full">
        {/* Separate Search Button */}
        <button 
          onClick={() => {
            setIsSearchOpen(!isSearchOpen);
            setIsCalendarOpen(false);
            setIsQuickSettingsOpen(false);
            setIsAccessMenuOpen(false);
            if (screenReader) speakText("Search panel opened. Type app name to search.");
          }}
          className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border shadow-xs ${
            theme === 'light'
              ? 'bg-black/5 border-black/5 hover:bg-black/10 text-slate-800'
              : 'bg-white/5 border-white/5 hover:bg-white/10 text-[#dedede]'
          } ${
            isSearchOpen ? 'liquid-glass-pill text-white font-bold border-blue-400/25' : ''
          }`}
          title="Search Applications"
        >
          <Search size={14} className="opacity-95" />
        </button>

        {/* Accessibility Button */}
        <button 
          onClick={() => {
            setIsAccessMenuOpen(!isAccessMenuOpen);
            setIsCalendarOpen(false);
            setIsQuickSettingsOpen(false);
            setIsSearchOpen(false);
            if (screenReader) speakText("Accessibility Options Menu opened");
          }}
          className={`w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 border shadow-xs ${
            theme === 'light'
              ? 'bg-black/5 border-black/5 hover:bg-black/10 text-slate-800'
              : 'bg-white/5 border-white/5 hover:bg-white/10 text-[#dedede]'
          } ${
            isAccessMenuOpen ? 'liquid-glass-pill text-white font-bold border-blue-400/25' : ''
          }`}
          title="Accessibility Options"
        >
          <Accessibility size={14} className="opacity-95" />
        </button>

        {/* Status Tray Pill */}
        <div 
          tabIndex={0}
          onClick={() => {
            setIsQuickSettingsOpen(!isQuickSettingsOpen);
            setIsCalendarOpen(false);
            setIsAccessMenuOpen(false);
            setIsSearchOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsQuickSettingsOpen(!isQuickSettingsOpen);
              setIsCalendarOpen(false);
              setIsAccessMenuOpen(false);
              setIsSearchOpen(false);
            }
          }}
          className={`flex items-center space-x-1.5 px-2.5 h-[75%] rounded-full cursor-pointer transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 border shadow-xs ${
            theme === 'light'
              ? 'bg-black/5 border-black/5 hover:bg-black/10 text-slate-800'
              : 'bg-white/5 border-white/5 hover:bg-white/10 text-[#dedede]'
          } ${isQuickSettingsOpen ? 'liquid-glass-pill text-white font-bold border-blue-400/25' : ''}`}
        >
          <span className={`p-1 rounded-md flex items-center justify-center border shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${
            theme === 'light'
              ? 'bg-black/5 border-black/5'
              : 'bg-white/5 border-white/10'
          }`}>
            <Wifi size={11} className={wifiEnabled && !airplaneMode ? 'text-white' : 'opacity-40'} />
          </span>
          <span className={`p-1 rounded-md flex items-center justify-center border shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${
            theme === 'light'
              ? 'bg-black/5 border-black/5'
              : 'bg-white/5 border-white/10'
          }`}>
            {getVolumeIcon(volume, 11, "opacity-80")}
          </span>
          <span className={`p-1 rounded-md flex items-center justify-center border shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${
            theme === 'light'
              ? 'bg-black/5 border-black/5'
              : 'bg-white/5 border-white/10'
          }`}>
            <BatteryIcon percentage={battery} size={11} className={`transition-colors duration-200 ${battery > 20 ? 'text-green-400' : 'text-red-500'}`} />
          </span>
        </div>
      </div>

      {/* Calendar & Notifications Popover */}
      <AnimatePresence>
        {isCalendarOpen && (
          <motion.div 
            ref={calendarRef}
            initial={{ opacity: 0, y: -10, scale: 0.95, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: -10, scale: 0.95, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className={`absolute top-9 left-1/2 w-[620px] max-w-[95vw] rounded-2xl p-5 z-[70] grid grid-cols-1 md:grid-cols-2 gap-5 text-gray-300 border backdrop-blur-[38px] ${
              theme === 'light'
                ? 'bg-white/55 border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1.5px_rgba(255,255,255,0.65)]'
                : 'bg-slate-900/45 border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.18)]'
            }`}
          >
          {/* Left Panel: Notifications */}
          <div className="border-r border-white/5 pr-4 flex flex-col min-h-[250px]">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-white text-sm">Notifications</span>
              <button className="text-[10px] text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded transition-all">Clear All</button>
            </div>
            <div className="flex-1 flex flex-col justify-center items-center text-center opacity-40">
              <Bell size={32} className="mb-2" />
              <p className="text-xs">No Notifications</p>
            </div>
          </div>

          {/* Right Panel: Calendar */}
          <div className="flex flex-col">
            <div className="text-sm font-bold text-white mb-1">
              {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
            <div className="text-xs text-white/50 mb-3">{time.getFullYear()}</div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center mb-3 bg-white/5 p-1 rounded-lg border border-white/5">
              <div className="flex space-x-1">
                <button 
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear() - 1, calendarDate.getMonth(), 1))} 
                  className="px-1.5 py-0.5 hover:bg-white/10 rounded text-white/80 hover:text-white text-[10px] font-bold cursor-pointer transition-colors" 
                  title="Prev Year"
                >
                  «
                </button>
                <button 
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))} 
                  className="px-1.5 py-0.5 hover:bg-white/10 rounded text-white/80 hover:text-white text-[10px] font-bold cursor-pointer transition-colors" 
                  title="Prev Month"
                >
                  ‹
                </button>
              </div>
              <div className="text-[10px] font-bold text-white select-none">
                {calendarDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
              <div className="flex space-x-1">
                <button 
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))} 
                  className="px-1.5 py-0.5 hover:bg-white/10 rounded text-white/80 hover:text-white text-[10px] font-bold cursor-pointer transition-colors" 
                  title="Next Month"
                >
                  ›
                </button>
                <button 
                  onClick={() => setCalendarDate(new Date(calendarDate.getFullYear() + 1, calendarDate.getMonth(), 1))} 
                  className="px-1.5 py-0.5 hover:bg-white/10 rounded text-white/80 hover:text-white text-[10px] font-bold cursor-pointer transition-colors" 
                  title="Next Year"
                >
                  »
                </button>
              </div>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-y-2 text-center text-[10px]">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                <div key={d} className="font-semibold text-white/40">{d}</div>
              ))}
              {getDaysInMonth().map((day, idx) => {
                const isToday = day === time.getDate() && 
                                calendarDate.getMonth() === time.getMonth() && 
                                calendarDate.getFullYear() === time.getFullYear();
                return (
                  <div 
                    key={idx} 
                    tabIndex={day ? 0 : -1}
                    className={`h-6 w-6 flex items-center justify-center rounded-full mx-auto focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                      isToday ? 'bg-[#3c6eb4] text-white font-bold' : day ? 'hover:bg-white/5 cursor-pointer text-white/80' : ''
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Quick Settings Popover */}
      <AnimatePresence>
        {isQuickSettingsOpen && (
          <motion.div 
            ref={quickSettingsRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className={`absolute top-9 right-2 w-[340px] rounded-2xl p-4 z-[70] text-gray-300 border backdrop-blur-[38px] ${
              theme === 'light'
                ? 'bg-white/55 border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1.5px_rgba(255,255,255,0.65)]'
                : 'bg-slate-900/45 border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.18)]'
            }`}
          >
          {/* Quick Toggles Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {/* Wifi Toggle */}
            <div 
              tabIndex={0}
              onClick={() => setWifiEnabled(!wifiEnabled)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setWifiEnabled(!wifiEnabled);
                }
              }}
              className={`flex items-center p-2 rounded-xl cursor-pointer transition-all duration-200 border border-white/5 focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                wifiEnabled && !airplaneMode ? 'bg-[#3c6eb4] text-white' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <Wifi size={14} className="mr-2" />
              <div className="text-[10px]">
                <div className="font-bold">Wi-Fi</div>
                <div className="opacity-70">{wifiEnabled && !airplaneMode ? 'Connected' : 'Off'}</div>
              </div>
            </div>

            {/* Bluetooth Toggle */}
            <div 
              tabIndex={0}
              onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setBluetoothEnabled(!bluetoothEnabled);
                }
              }}
              className={`flex items-center p-2 rounded-xl cursor-pointer transition-all duration-200 border border-white/5 focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                bluetoothEnabled ? 'bg-[#3c6eb4] text-white' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <span className="mr-2 text-sm font-semibold">⚡</span>
              <div className="text-[10px]">
                <div className="font-bold">Bluetooth</div>
                <div className="opacity-70">{bluetoothEnabled ? 'On' : 'Off'}</div>
              </div>
            </div>

            {/* Night Light Toggle */}
            <div 
              tabIndex={0}
              onClick={() => setNightLightEnabled(!nightLightEnabled)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setNightLightEnabled(!nightLightEnabled);
                }
              }}
              className={`flex items-center p-2 rounded-xl cursor-pointer transition-all duration-200 border border-white/5 focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                nightLightEnabled ? 'bg-[#c27a3d] text-white' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <Moon size={14} className="mr-2" />
              <div className="text-[10px]">
                <div className="font-bold">Night Light</div>
                <div className="opacity-70">{nightLightEnabled ? 'On' : 'Off'}</div>
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <div 
              tabIndex={0}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setTheme(theme === 'dark' ? 'light' : 'dark');
                }
              }}
              className={`flex items-center p-2 rounded-xl cursor-pointer transition-all duration-200 border border-white/5 focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                theme === 'dark' ? 'bg-[#3c6eb4] text-white' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <Sun size={14} className="mr-2" />
              <div className="text-[10px]">
                <div className="font-bold">Dark Style</div>
                <div className="opacity-70">{theme === 'dark' ? 'Dark' : 'Light'}</div>
              </div>
            </div>

            {/* Airplane Mode */}
            <div 
              tabIndex={0}
              onClick={() => setAirplaneMode(!airplaneMode)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setAirplaneMode(!airplaneMode);
                }
              }}
              className={`flex items-center p-2 rounded-xl cursor-pointer transition-all duration-200 border border-white/5 col-span-2 focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                airplaneMode ? 'bg-[#e24a4a] text-white' : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <Plane size={14} className="mr-2" />
              <div className="text-[10px]">
                <div className="font-bold">Airplane Mode</div>
                <div className="opacity-70">{airplaneMode ? 'Active' : 'Inactive'}</div>
              </div>
            </div>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center space-x-3 mb-3 px-1">
            <span className={`p-1 rounded-md flex items-center justify-center border shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${
              theme === 'light'
                ? 'bg-black/5 border-black/5'
                : 'bg-white/5 border-white/10'
            }`}>
              {getVolumeIcon(volume, 11, "opacity-70")}
            </span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="flex-1 accent-[#3c6eb4] bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] w-6 text-right font-mono">{volume}%</span>
          </div>

          {/* Brightness Slider */}
          <div className="flex items-center space-x-3 mb-4 px-1">
            <span className={`p-1 rounded-md flex items-center justify-center border shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${
              theme === 'light'
                ? 'bg-black/5 border-black/5'
                : 'bg-white/5 border-white/10'
            }`}>
              {getBrightnessIcon(brightness, 11, "opacity-70")}
            </span>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="flex-1 accent-[#3c6eb4] bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-[10px] w-6 text-right font-mono">{brightness}%</span>
          </div>

          {/* Battery Status Slider */}
          <div className="flex flex-col space-y-1.5 px-1 py-1.5 border-t border-white/5 mb-3">
            <div className="flex justify-between items-center text-[10px] opacity-80">
              <span className="flex items-center space-x-1.5">
                <span className={`p-1 rounded-md flex items-center justify-center border shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${
                  theme === 'light'
                    ? 'bg-black/5 border-black/5'
                    : 'bg-white/5 border-white/10'
                }`}>
                  <BatteryIcon percentage={battery} size={11} className={`transition-colors duration-200 ${battery > 20 ? 'text-green-400' : 'text-red-500'}`} /> 
                </span>
                <span>{battery}% (Remaining)</span>
              </span>
              <span>Power Mode: Balanced</span>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={battery}
                onChange={(e) => setBattery(Number(e.target.value))}
                className="w-full accent-[#3c6eb4] bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          {/* Quick Settings System Controls */}
          <div className="flex justify-between items-center pt-2 border-t border-white/5">
            <button 
              onClick={() => {
                openWindow('settings', 'Settings');
                setIsQuickSettingsOpen(false);
              }}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-colors" 
              title="Settings"
            >
              <Settings size={14} />
            </button>
            <div className="flex space-x-1.5">
              <button 
                onClick={() => {
                  setIsQuickSettingsOpen(false);
                  setBootState('login');
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-colors" 
                title="Lock Screen"
              >
                <Lock size={14} />
              </button>
              <button 
                onClick={() => {
                  setIsQuickSettingsOpen(false);
                  setBootState('bios');
                }}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white cursor-pointer transition-colors" 
                title="Restart"
              >
                <RotateCw size={14} />
              </button>
              <button 
                onClick={() => {
                  setIsQuickSettingsOpen(false);
                  if (document.fullscreenElement) {
                    document.exitFullscreen().catch(() => {});
                  }
                  setBootState('off');
                }}
                className="p-2 rounded-lg bg-red-950/30 border border-red-900/40 hover:bg-red-500 hover:text-white text-red-400 cursor-pointer transition-colors" 
                title="Power Off"
              >
                <Power size={14} />
              </button>
            </div>
          </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Accessibility Dropdown Menu */}
      <AnimatePresence>
        {isAccessMenuOpen && (
          <motion.div 
            ref={accessMenuRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            className={`absolute top-9 right-16 w-44 rounded-xl p-2.5 z-[70] text-[10px] border ${
              highContrast 
                ? 'bg-black border-2 border-white text-white' 
                : theme === 'light'
                ? 'bg-white/55 border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.12),inset_0_1px_1.5px_rgba(255,255,255,0.65)] backdrop-blur-[35px] text-slate-800' 
                : 'bg-slate-900/45 border-white/12 shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.18)] backdrop-blur-[35px] text-gray-300'
            }`}
          >
          <div className={`font-bold mb-2 px-1 border-b pb-1 select-none ${highContrast ? 'border-white text-white' : 'border-white/5 text-white'}`}>Accessibility Options</div>
          <div className="space-y-1">
            <div 
              tabIndex={0}
              onClick={() => {
                const nextVal = !highContrast;
                setHighContrast(nextVal);
                speakText(`High Contrast ${nextVal ? 'on' : 'off'}`);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const nextVal = !highContrast;
                  setHighContrast(nextVal);
                  speakText(`High Contrast ${nextVal ? 'on' : 'off'}`);
                }
              }}
              className={`flex justify-between items-center px-1.5 py-1.5 rounded cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                highContrast 
                  ? 'bg-white/10 border border-white text-white font-bold' 
                  : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <span>High Contrast</span>
              <span className={highContrast ? "text-emerald-400 font-bold" : "text-zinc-500 font-semibold"}>
                {highContrast ? "On" : "Off"}
              </span>
            </div>
            <div 
              tabIndex={0}
              onClick={() => {
                const nextVal = !screenReader;
                setScreenReader(nextVal);
                if (nextVal) {
                  speakText("Screen reader turned on.");
                } else {
                  speakText("Screen reader turned off.");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const nextVal = !screenReader;
                  setScreenReader(nextVal);
                  if (nextVal) {
                    speakText("Screen reader turned on.");
                  } else {
                    speakText("Screen reader turned off.");
                  }
                }
              }}
              className={`flex justify-between items-center px-1.5 py-1.5 rounded cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                screenReader 
                  ? 'bg-white/10 border border-white text-white font-bold' 
                  : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <span>Screen Reader</span>
              <span className={screenReader ? "text-emerald-400 font-bold" : "text-zinc-500 font-semibold"}>
                {screenReader ? "On" : "Off"}
              </span>
            </div>
            <div 
              tabIndex={0}
              onClick={() => {
                const nextVal = !largeText;
                setLargeText(nextVal);
                speakText(`Large Text ${nextVal ? 'on' : 'off'}`);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const nextVal = !largeText;
                  setLargeText(nextVal);
                  speakText(`Large Text ${nextVal ? 'on' : 'off'}`);
                }
              }}
              className={`flex justify-between items-center px-1.5 py-1.5 rounded cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                largeText 
                  ? 'bg-white/10 border border-white text-white font-bold' 
                  : 'hover:bg-white/5 text-gray-300'
              }`}
            >
              <span>Large Text</span>
              <span className={largeText ? "text-emerald-400 font-bold" : "text-zinc-500 font-semibold"}>
                {largeText ? "On" : "Off"}
              </span>
            </div>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <AnimatePresence>
        {isSearchOpen && (
          <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};
