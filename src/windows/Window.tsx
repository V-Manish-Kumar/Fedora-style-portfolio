import React, { useRef } from 'react';
import type { ReactNode } from 'react';
import { Rnd } from 'react-rnd';
import { useWindowStore } from '../store/useWindowStore';
import { useSystemStore } from '../store/useSystemStore';
import { Minus, Square, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface WindowProps {
  id: string;
  title: string;
  children: ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
}

export const Window: React.FC<WindowProps> = ({ id, title, children, defaultWidth = 800, defaultHeight = 600 }) => {
  const windowState = useWindowStore((state) => state.windows[id]);
  const activeWindowId = useWindowStore((state) => state.activeWindowId);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const minimizeWindow = useWindowStore((state) => state.minimizeWindow);
  const maximizeWindow = useWindowStore((state) => state.maximizeWindow);
  const focusWindow = useWindowStore((state) => state.focusWindow);
  
  const highContrast = useSystemStore((state) => state.highContrast);
  const activitiesMode = useSystemStore((state) => state.activitiesMode);
  const setActivitiesMode = useSystemStore((state) => state.setActivitiesMode);
  const activitiesSearchQuery = useSystemStore((state) => state.activitiesSearchQuery);
  const theme = useSystemStore((state) => state.theme);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rndRef = useRef<any>(null);

  const [position, setPosition] = React.useState({
    x: window.innerWidth / 2 - defaultWidth / 2,
    y: Math.max(32, window.innerHeight / 2 - defaultHeight / 2),
  });
  const [size, setSize] = React.useState({
    width: defaultWidth,
    height: defaultHeight,
  });

  const [isDragging, setIsDragging] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);

  const [dockIconOffset, setDockIconOffset] = React.useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = React.useState(false);

  const APP_BACKGROUNDS: Record<string, { dark: string; light: string }> = {
    terminal: { dark: 'bg-[#1e1e1e]', light: 'bg-[#1e1e1e]' },
    monitor: { dark: 'bg-black', light: 'bg-slate-50' },
    'file-manager': { dark: 'bg-[#0c0f19]', light: 'bg-white' },
    browser: { dark: 'bg-[#0b0f19]', light: 'bg-white' },
    settings: { dark: 'bg-[#0c0f19]', light: 'bg-slate-50' },
  };
  const appBgClass = APP_BACKGROUNDS[id]
    ? (theme === 'light' ? APP_BACKGROUNDS[id].light : APP_BACKGROUNDS[id].dark)
    : (theme === 'light' ? 'bg-white text-slate-800' : 'bg-[#0c0f19] text-slate-200');

  // Sort windows by ID to give deterministic grid order in overview
  const windows = useWindowStore((state) => state.windows);
  const openWindowsList = Object.values(windows)
    .filter((w) => w.isOpen && !w.isMinimized)
    .sort((a, b) => a.id.localeCompare(b.id));

  const myIndex = openWindowsList.findIndex((w) => w.id === id);
  const totalOpen = openWindowsList.length;

  // Compute grid slots for Mission Control / Activities Overview
  let cols = 1;
  let rows = 1;
  if (totalOpen > 1) {
    if (totalOpen <= 2) {
      cols = 2;
      rows = 1;
    } else if (totalOpen <= 4) {
      cols = 2;
      rows = 2;
    } else if (totalOpen <= 6) {
      cols = 3;
      rows = 2;
    } else {
      cols = 3;
      rows = 3;
    }
  }

  const col = myIndex >= 0 ? myIndex % cols : 0;
  const row = myIndex >= 0 ? Math.floor(myIndex / cols) : 0;

  const workspaceWidth = window.innerWidth;
  const workspaceHeight = window.innerHeight - 150; // space for topbar and dock
  const cellWidth = workspaceWidth / cols;
  const cellHeight = workspaceHeight / rows;

  const maxCellWidth = cellWidth * 0.82;
  const maxCellHeight = cellHeight * 0.72;

  const currentWidth = windowState?.isMaximized ? window.innerWidth : size.width;
  const currentHeight = windowState?.isMaximized ? window.innerHeight : size.height;

  const scaleX = maxCellWidth / currentWidth;
  const scaleY = maxCellHeight / currentHeight;
  const overviewScale = Math.min(scaleX, scaleY, 0.58);

  const cellCenterX = col * cellWidth + cellWidth / 2;
  const cellCenterY = 48 + row * cellHeight + cellHeight / 2;

  const currentCenterX = windowState?.isMaximized ? (window.innerWidth / 2) : (position.x + size.width / 2);
  const currentCenterY = windowState?.isMaximized ? (window.innerHeight / 2) : (position.y + size.height / 2);

  const overviewXOffset = cellCenterX - currentCenterX;
  const overviewYOffset = cellCenterY - currentCenterY;

  // Track dock icon offset for Genie minimize animation
  React.useEffect(() => {
    if (windowState?.isMinimized) {
      const dockIcon = document.getElementById(`dock-icon-${id}`);
      if (dockIcon) {
        const rect = dockIcon.getBoundingClientRect();
        const iconCenterX = rect.left + rect.width / 2;
        const iconCenterY = rect.top + rect.height / 2;

        const wCenterX = windowState.isMaximized ? (window.innerWidth / 2) : (position.x + size.width / 2);
        const wCenterY = windowState.isMaximized ? (window.innerHeight / 2) : (position.y + size.height / 2);

        setDockIconOffset({
          x: iconCenterX - wCenterX,
          y: iconCenterY - wCenterY,
        });
      } else {
        const wCenterX = windowState.isMaximized ? (window.innerWidth / 2) : (position.x + size.width / 2);
        const wCenterY = windowState.isMaximized ? (window.innerHeight / 2) : (position.y + size.height / 2);
        setDockIconOffset({
          x: window.innerWidth / 2 - wCenterX,
          y: window.innerHeight - 30 - wCenterY,
        });
      }
    }
  }, [windowState?.isMinimized, id, windowState?.isMaximized, position, size]);

  React.useEffect(() => {
    return () => {
      document.body.classList.remove('window-action-active');
    };
  }, []);

  if (!windowState) return null;

  const isActive = activeWindowId === id;

  const handleDragStart = () => {
    setIsDragging(true);
    document.body.classList.add('window-action-active');
    focusWindow(id);
  };

  const handleFocus = () => {
    focusWindow(id);
  };

  // In overview mode, counter-scale text and close buttons so they remain fully crisp/readable
  const counterScale = 1 / overviewScale;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={
        windowState.isMinimized
          ? 'minimized'
          : activitiesMode
          ? 'overview'
          : 'visible'
      }
      exit="exit"
      variants={{
        visible: {
          display: 'block',
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          transition: { type: 'spring', stiffness: 350, damping: 28 }
        },
        minimized: {
          opacity: 0,
          scale: 0.05,
          x: dockIconOffset.x,
          y: dockIconOffset.y,
          transitionEnd: { display: 'none' },
          transition: { type: 'spring', stiffness: 220, damping: 25 }
        },
        overview: {
          display: 'block',
          opacity: activitiesSearchQuery !== '' ? 0.08 : 1,
          scale: overviewScale * (isHovered ? 1.05 : 1),
          x: overviewXOffset,
          y: overviewYOffset,
          transition: { type: 'spring', stiffness: 280, damping: 26 }
        },
        exit: {
          opacity: 0,
          scale: 0.93,
          transition: { duration: 0.1, ease: 'easeIn' }
        }
      }}
        style={{
          position: 'absolute',
          zIndex: activitiesMode
            ? (isHovered ? 85 : 45 + (windowState.zIndex % 5))
            : (windowState.isMaximized ? 70 : windowState.zIndex),
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        <Rnd
          ref={rndRef}
          size={windowState.isMaximized ? { width: '100%', height: '100%' } : size}
          position={windowState.isMaximized ? { x: 0, y: 0 } : position}
          onDragStart={handleDragStart}
          onDragStop={(_, d) => {
            setIsDragging(false);
            document.body.classList.remove('window-action-active');
            if (!windowState.isMaximized) {
              setPosition({ x: d.x, y: Math.max(32, d.y) });
            }
          }}
          onResizeStart={() => {
            setIsResizing(true);
            document.body.classList.add('window-action-active');
          }}
          onResizeStop={(_e, _direction, ref, _delta, pos) => {
            setIsResizing(false);
            document.body.classList.remove('window-action-active');
            if (!windowState.isMaximized) {
              setSize({
                width: ref.offsetWidth,
                height: ref.offsetHeight,
              });
              setPosition({
                x: pos.x,
                y: Math.max(32, pos.y),
              });
            }
          }}
          minWidth={300}
          minHeight={200}
          bounds={windowState.isMaximized ? "window" : "#desktop-workspace-bounds"}
          dragHandleClassName="window-handle"
          onMouseDown={handleFocus}
          disableDragging={windowState.isMaximized || activitiesMode}
          enableResizing={!windowState.isMaximized && !activitiesMode}
          style={{ pointerEvents: 'auto', display: 'flex', flexDirection: 'column' }}
          onMouseEnter={() => {
            if (activitiesMode) setIsHovered(true);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
          }}
          className={`flex flex-col rounded-2xl overflow-hidden relative ${
            isDragging || isResizing
              ? 'transition-none'
              : 'transition-[width,height,transform,background-color,border-color,box-shadow,opacity] duration-200 ease-out'
          } ${
            highContrast
              ? 'bg-black border-2 border-white text-white'
              : theme === 'light'
              ? `glass-widget-light text-slate-800 ${
                  activitiesMode
                    ? isHovered
                      ? 'shadow-[0_25px_60px_rgba(60,110,180,0.22)] border-[#3c6eb4]/50'
                      : 'shadow-black/10 border-black/5'
                    : isActive
                    ? 'shadow-[0_24px_60px_rgba(0,0,0,0.18)] border-black/10'
                    : 'shadow-black/10'
                }`
              : `glass-widget-dark text-white ${
                  activitiesMode
                    ? isHovered
                      ? 'shadow-[0_25px_60px_rgba(60,110,180,0.4)] border-[#3c6eb4]/50'
                      : 'shadow-black/30 border-white/5'
                    : isActive
                    ? 'shadow-[0_24px_60px_rgba(0,0,0,0.55)] border-white/20'
                    : 'shadow-black/35'
                }`
          }`}
        >
          {/* Blocks standard input and clicks during overview mode */}
          {activitiesMode && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                focusWindow(id);
                setActivitiesMode(false);
              }}
              className="absolute inset-0 z-[80] cursor-pointer bg-transparent"
            />
          )}

          {/* Mission Control Title Card */}
          {activitiesMode && (
            <div
              style={{
                transform: `translateX(-50%) scale(${counterScale})`,
                transformOrigin: 'bottom center',
                top: '-48px'
              }}
              className="absolute left-1/2 bg-slate-900/95 border border-white/15 px-3 py-1 rounded-full text-white text-[10px] font-bold shadow-2xl pointer-events-none select-none z-[90] whitespace-nowrap"
            >
              {title}
            </div>
          )}

          {/* Mission Control Close Button */}
          {activitiesMode && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeWindow(id);
              }}
              style={{
                transform: `scale(${counterScale})`,
                transformOrigin: 'center',
                top: '-12px',
                right: '-12px'
              }}
              className="absolute w-6 h-6 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/85 text-white flex items-center justify-center shadow-lg border border-white/20 cursor-pointer z-[95] active:scale-90"
              title="Close Window"
            >
              <X size={10} strokeWidth={3} />
            </button>
          )}

          <div className={`window-handle flex items-center px-4 h-11 select-none border-b transition-all ${
            highContrast
              ? 'bg-black border-white'
              : theme === 'light'
              ? 'bg-white/10 border-black/5 text-slate-800'
              : 'bg-white/5 border-white/5 text-white'
          }`}>
            {/* macOS Controls (Left) */}
            <div className="flex space-x-2 absolute left-4">
              <button
                onClick={(e) => { e.stopPropagation(); closeWindow(id); }}
                className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] hover:bg-[#ff5f56]/80 flex items-center justify-center group cursor-pointer"
              >
                <X size={8} className="text-black opacity-0 group-hover:opacity-100" strokeWidth={3} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); minimizeWindow(id); }}
                className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] hover:bg-[#ffbd2e]/80 flex items-center justify-center group cursor-pointer"
              >
                <Minus size={8} className="text-black opacity-0 group-hover:opacity-100" strokeWidth={3} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); maximizeWindow(id); }}
                className="w-3.5 h-3.5 rounded-full bg-[#27c93f] hover:bg-[#27c93f]/80 flex items-center justify-center group cursor-pointer"
              >
                <Square size={6} className="text-black opacity-0 group-hover:opacity-100" strokeWidth={3} />
              </button>
            </div>
            {/* Title (Center) */}
            <div className={`flex-1 text-center text-xs font-semibold tracking-wide pointer-events-none ${
              theme === 'light' ? 'text-slate-800' : 'text-white/90'
            }`}>{title}</div>
          </div>

          {/* Content Area */}
          <div className={`flex-1 overflow-auto p-0 m-0 relative z-0 text-slate-200 grid grid-cols-1 grid-rows-1 ${appBgClass}`}>
            {children}
          </div>
        </Rnd>
      </motion.div>
  );
};
