import { create } from 'zustand';

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

interface WindowStore {
  windows: Record<string, WindowState>;
  activeWindowId: string | null;
  selectedProjectId: string | null;
  selectedCertificateId: string | null;
  browserUrl: string;
  openWindow: (id: string, title: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  setSelectedProjectId: (id: string | null) => void;
  setSelectedCertificateId: (id: string | null) => void;
  setBrowserUrl: (url: string) => void;
}

export const useWindowStore = create<WindowStore>((set) => ({
  windows: {},
  activeWindowId: null,
  selectedProjectId: null,
  selectedCertificateId: null,
  browserUrl: 'chrome://newtab',
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  setSelectedCertificateId: (id) => set({ selectedCertificateId: id }),
  setBrowserUrl: (url) => set({ browserUrl: url }),

  openWindow: (id, title) =>
    set((state) => {
      const windowExists = state.windows[id];
      const maxZIndex = Object.values(state.windows).reduce(
        (max, w) => Math.max(max, w.zIndex),
        0
      );

      return {
        windows: {
          ...state.windows,
          [id]: {
            id,
            title,
            isOpen: true,
            isMinimized: false,
            isMaximized: windowExists?.isMaximized || false,
            zIndex: maxZIndex + 1,
          },
        },
        activeWindowId: id,
      };
    }),

  closeWindow: (id) =>
    set((state) => {
      const newWindows = { ...state.windows };
      newWindows[id] = { ...newWindows[id], isOpen: false };
      
      let nextActiveId = state.activeWindowId;
      if (state.activeWindowId === id) {
        const remainingOpen = Object.values(newWindows)
          .filter((w) => w.isOpen && !w.isMinimized)
          .sort((a, b) => b.zIndex - a.zIndex);
        nextActiveId = remainingOpen.length > 0 ? remainingOpen[0].id : null;
      }

      return {
        windows: newWindows,
        activeWindowId: nextActiveId,
      };
    }),

  minimizeWindow: (id) =>
    set((state) => {
      const newWindows = {
        ...state.windows,
        [id]: { ...state.windows[id], isMinimized: true },
      };

      let nextActiveId = state.activeWindowId;
      if (state.activeWindowId === id) {
        const remainingOpen = Object.values(newWindows)
          .filter((w) => w.isOpen && !w.isMinimized)
          .sort((a, b) => b.zIndex - a.zIndex);
        nextActiveId = remainingOpen.length > 0 ? remainingOpen[0].id : null;
      }

      return {
        windows: newWindows,
        activeWindowId: nextActiveId,
      };
    }),

  maximizeWindow: (id) =>
    set((state) => ({
      windows: {
        ...state.windows,
        [id]: { ...state.windows[id], isMaximized: !state.windows[id].isMaximized },
      },
    })),

  focusWindow: (id) =>
    set((state) => {
      const maxZIndex = Object.values(state.windows).reduce(
        (max, w) => Math.max(max, w.zIndex),
        0
      );
      if (state.windows[id].zIndex === maxZIndex && state.activeWindowId === id) {
        return state;
      }
      return {
        windows: {
          ...state.windows,
          [id]: { ...state.windows[id], zIndex: maxZIndex + 1, isMinimized: false },
        },
        activeWindowId: id,
      };
    }),
}));
