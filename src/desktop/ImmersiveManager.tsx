import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWindowStore } from '../store/useWindowStore';
import { useSystemStore } from '../store/useSystemStore';
import { AppIcon } from './AppIcon';
import { motion, AnimatePresence } from 'framer-motion';

export const ImmersiveManager: React.FC = () => {
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  // Refs to avoid stale closures in keydown/keyup handlers
  const showSwitcherRef = useRef(false);
  const highlightedIndexRef = useRef(0);
  const triggerModifierRef = useRef<'Alt' | 'Control'>('Alt');

  // Keep refs in sync
  useEffect(() => { showSwitcherRef.current = showSwitcher; }, [showSwitcher]);
  useEffect(() => { highlightedIndexRef.current = highlightedIndex; }, [highlightedIndex]);

  const bootState = useSystemStore((state) => state.bootState);
  const windows = useWindowStore((state) => state.windows);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);

  // Custom screen reader engine
  const screenReader = useSystemStore((state) => state.screenReader);

  const speakText = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  }, []);

  // Monitor active window and open windows list
  const prevActiveRef = useRef<string | null>(null);
  const prevOpenListRef = useRef<string[]>([]);

  useEffect(() => {
    if (!screenReader) return;

    const openList = Object.values(windows)
      .filter((w) => w.isOpen)
      .map((w) => w.id);

    const isGame = (id: string | null) => 
      id ? ['snake', 'tetris', 'flappy', 'space-fighter', 'dino', 'games'].includes(id) : false;

    // Newly opened window
    const newlyOpened = openList.find((id) => !prevOpenListRef.current.includes(id));
    if (newlyOpened && !isGame(newlyOpened)) {
      const title = windows[newlyOpened]?.title || newlyOpened;
      speakText(`${title} window opened.`);
    }

    // Closed window
    const newlyClosed = prevOpenListRef.current.find((id) => !openList.includes(id));
    if (newlyClosed && !isGame(newlyClosed)) {
      const title = windows[newlyClosed]?.title || newlyClosed;
      speakText(`${title} window closed.`);
    }

    // Change in focus
    if (activeWindowId && activeWindowId !== prevActiveRef.current && !isGame(activeWindowId)) {
      const title = windows[activeWindowId]?.title || activeWindowId;
      speakText(`${title} window focused.`);
    }

    prevActiveRef.current = activeWindowId;
    prevOpenListRef.current = openList;
  }, [activeWindowId, windows, screenReader, speakText]);

  // Global focusin and click event listeners
  useEffect(() => {
    if (!screenReader) return;

    const handleFocusIn = (e: FocusEvent) => {
      const activeWinId = useWindowStore.getState().activeWindowId;
      const isGame = activeWinId && ['snake', 'tetris', 'flappy', 'space-fighter', 'dino', 'games'].includes(activeWinId);
      if (isGame) return;

      const el = e.target as HTMLElement;
      if (!el) return;

      let name = '';
      let role = '';

      if (el.getAttribute('aria-label')) {
        name = el.getAttribute('aria-label') || '';
      } else if (el.getAttribute('title')) {
        name = el.getAttribute('title') || '';
      } else if (el.tagName === 'INPUT') {
        const inputEl = el as HTMLInputElement;
        name = inputEl.placeholder || inputEl.name || 'text input';
        role = 'input field';
      } else {
        name = el.innerText || el.textContent || '';
      }

      name = name.replace(/\s+/g, ' ').trim();
      if (name.length > 60) {
        name = name.slice(0, 60) + '...';
      }

      if (!role) {
        if (el.tagName === 'BUTTON' || el.getAttribute('role') === 'button') {
          role = 'button';
        } else if (el.tagName === 'A' || el.getAttribute('role') === 'link') {
          role = 'link';
        } else if (el.closest('.space-y-1.text-xs') && el.closest('.w-48')) {
          role = 'sidebar location';
        } else if (el.closest('.grid') && el.closest('.p-5')) {
          role = 'file manager item';
        } else if (el.id?.startsWith('dock-icon-')) {
          role = 'dock shortcut';
        } else {
          role = 'element';
        }
      }

      if (name) {
        speakText(`${name} ${role}`);
      }
    };

    const handleClick = (e: MouseEvent) => {
      const activeWinId = useWindowStore.getState().activeWindowId;
      const isGame = activeWinId && ['snake', 'tetris', 'flappy', 'space-fighter', 'dino', 'games'].includes(activeWinId);
      if (isGame) return;

      const el = e.target as HTMLElement;
      if (!el) return;

      const interactive = el.closest('button, a, [role="button"], [tabIndex], input, select');
      if (!interactive) return;

      const label = interactive.getAttribute('aria-label') || interactive.getAttribute('title') || interactive.textContent || '';
      const text = label.replace(/\s+/g, ' ').trim();
      if (text) {
        speakText(`Clicked: ${text.length > 50 ? text.slice(0, 50) + '...' : text}`);
      }
    };

    document.addEventListener('focusin', handleFocusIn);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('focusin', handleFocusIn);
      document.removeEventListener('click', handleClick);
    };
  }, [screenReader, speakText]);

  // Filter open windows and sort by zIndex descending (active first)
  const openWindows = Object.values(windows)
    .filter((w) => w.isOpen)
    .sort((a, b) => b.zIndex - a.zIndex);

  // Keep a ref so keyup handler always has fresh openWindows
  const openWindowsRef = useRef(openWindows);
  useEffect(() => { openWindowsRef.current = openWindows; }, [openWindows]);

  const activeWindowIdRef = useRef(activeWindowId);
  useEffect(() => { activeWindowIdRef.current = activeWindowId; }, [activeWindowId]);

  const commitSwitcher = useCallback(() => {
    if (!showSwitcherRef.current) return;
    const wins = openWindowsRef.current;
    const idx = highlightedIndexRef.current;
    const targetWin = wins[idx];
    setShowSwitcher(false);
    if (targetWin) focusWindow(targetWin.id);
  }, [focusWindow]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Note: synthetic events from Electron have isTrusted=false — allow them.

      // 1. Block Escape from exiting fullscreen
      if (e.key === 'Escape' || (e.ctrlKey && e.key === 'Escape')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        return;
      }

      // 2. Close active window: Alt+F4 OR Ctrl+F4 OR Ctrl+W (when not in terminal)
      const isCloseWindow =
        (e.altKey && e.key === 'F4') ||
        (e.ctrlKey && e.key === 'F4') ||
        (e.ctrlKey && (e.key === 'w' || e.key === 'W'));

      if (isCloseWindow) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        if (bootState === 'desktop') {
          const wid = activeWindowIdRef.current;
          if (wid) closeWindow(wid);
        }
        return;
      }

      // 3. Task switcher: Alt+Tab, Ctrl+Tab, Alt+Q
      const isSwitcherTrigger =
        (e.altKey && e.key === 'Tab') ||
        (e.ctrlKey && e.key === 'Tab') ||
        (e.altKey && (e.key === 'q' || e.key === 'Q'));

      if (bootState === 'desktop' && isSwitcherTrigger) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        const wins = openWindowsRef.current;
        if (wins.length === 0) return;

        triggerModifierRef.current = e.ctrlKey ? 'Control' : 'Alt';

        setShowSwitcher((showing) => {
          if (!showing) {
            const initialIndex = wins.length > 1 ? 1 : 0;
            setHighlightedIndex(initialIndex);
            highlightedIndexRef.current = initialIndex;
          } else {
            setHighlightedIndex((prev) => {
              const next = (prev + 1) % wins.length;
              highlightedIndexRef.current = next;
              return next;
            });
          }
          showSwitcherRef.current = true;
          return true;
        });
        return;
      }

      // 4. Trap browser navigation shortcuts
      if (
        e.key === 'F11' ||
        e.key === 'F5' ||
        (e.ctrlKey && (e.key === 'r' || e.key === 'R')) ||
        (e.ctrlKey && (e.key === 't' || e.key === 'T')) ||
        (e.ctrlKey && (e.key === 'w' || e.key === 'W')) ||
        (e.ctrlKey && (e.key === 'n' || e.key === 'N'))
      ) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const currentModifier = triggerModifierRef.current;
      const shouldCommit =
        (currentModifier === 'Alt' && e.key === 'Alt') ||
        (currentModifier === 'Control' && e.key === 'Control');

      if (shouldCommit) {
        commitSwitcher();
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        // Dismiss switcher on Escape
        setShowSwitcher(false);
        showSwitcherRef.current = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
    };
  // Dependencies are stable — stale closures fixed via refs
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bootState, closeWindow, commitSwitcher]);

  // Universal interaction handler to enter fullscreen
  useEffect(() => {
    const handleUniversalInteraction = () => {
      if (bootState !== 'off' && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    };

    document.addEventListener('click', handleUniversalInteraction);
    document.addEventListener('keydown', handleUniversalInteraction);

    return () => {
      document.removeEventListener('click', handleUniversalInteraction);
      document.removeEventListener('keydown', handleUniversalInteraction);
    };
  }, [bootState]);

  return (
    <>
      {/* Alt+Tab / Ctrl+Tab Task Switcher Modal */}
      <AnimatePresence>
        {showSwitcher && (
          <div className="fixed inset-0 bg-black/45 z-[9999] flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ type: 'tween', ease: 'easeOut', duration: 0.1 }}
              className="bg-[#10141e]/96 border border-white/10 p-6 rounded-2xl max-w-2xl w-[90%] shadow-2xl backdrop-blur-md"
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
                Running Tasks — Ctrl+Tab to Switch · Ctrl+F4 to Close
              </div>
              <div className="flex flex-wrap gap-4 items-center justify-center">
                {openWindows.map((win, idx) => {
                  const isHighlighted = highlightedIndex === idx;

                  return (
                    <div
                      key={win.id}
                      onClick={() => {
                        setHighlightedIndex(idx);
                        setShowSwitcher(false);
                        showSwitcherRef.current = false;
                        focusWindow(win.id);
                      }}
                      className={`flex flex-col items-center justify-center w-24 h-24 rounded-xl border transition-all duration-75 ease-out cursor-pointer select-none p-2 ${
                        isHighlighted
                          ? 'bg-[#3c6eb4]/20 border-[#3c6eb4] shadow-[0_0_12px_rgba(60,110,180,0.25)]'
                          : 'bg-white/[0.02] border-transparent hover:border-white/10 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="mb-2 relative w-12 h-12 flex items-center justify-center">
                        <AppIcon id={win.id} size={36} />
                      </div>
                      <span className="text-[10px] font-semibold text-slate-200 text-center line-clamp-2 leading-tight w-full break-words">
                        {win.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
