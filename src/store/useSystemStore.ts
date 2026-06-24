import { create } from 'zustand';

interface SystemStore {
  bootState: 'off' | 'bios' | 'grub' | 'booting' | 'login' | 'desktop' | 'uefi' | 'windows_booting' | 'windows_bsod' | 'rescue_shell';
  theme: 'dark' | 'light';
  wallpaper: string;
  volume: number;
  brightness: number;
  battery: number;
  highContrast: boolean;
  screenReader: boolean;
  largeText: boolean;
  activitiesMode: boolean;
  activitiesSearchQuery: string;
  nightLight: boolean;
  secureBoot: boolean;
  fastBoot: boolean;
  bootOrder: string[];
  setBootState: (state: 'off' | 'bios' | 'grub' | 'booting' | 'login' | 'desktop' | 'uefi' | 'windows_booting' | 'windows_bsod' | 'rescue_shell') => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setWallpaper: (wallpaper: string) => void;
  setVolume: (volume: number) => void;
  setBrightness: (brightness: number) => void;
  setBattery: (battery: number) => void;
  setHighContrast: (val: boolean) => void;
  setScreenReader: (val: boolean) => void;
  setLargeText: (val: boolean) => void;
  setActivitiesMode: (val: boolean) => void;
  setActivitiesSearchQuery: (query: string) => void;
  setNightLight: (val: boolean) => void;
  setSecureBoot: (val: boolean) => void;
  setFastBoot: (val: boolean) => void;
  setBootOrder: (order: string[]) => void;
  skipBoot: () => void;
}

export const useSystemStore = create<SystemStore>((set) => ({
  bootState: 'off',
  theme: 'dark',
  wallpaper: '/fedora-wallpaper.png',
  volume: 70,
  brightness: 80,
  battery: 84,
  highContrast: false,
  screenReader: false,
  largeText: false,
  activitiesMode: false,
  activitiesSearchQuery: '',
  nightLight: false,
  secureBoot: true,
  fastBoot: false,
  bootOrder: ['Fedora Workstation', 'Windows Boot Manager'],
  setBootState: (state) => set({ bootState: state }),
  setTheme: (theme) => set({ theme }),
  setWallpaper: (wallpaper) => set({ wallpaper }),
  setVolume: (volume) => set({ volume }),
  setBrightness: (brightness) => set({ brightness }),
  setBattery: (battery) => set({ battery }),
  setHighContrast: (val) => set({ highContrast: val }),
  setScreenReader: (val) => set({ screenReader: val }),
  setLargeText: (val) => set({ largeText: val }),
  setActivitiesMode: (val) => set({ activitiesMode: val }),
  setActivitiesSearchQuery: (query) => set({ activitiesSearchQuery: query }),
  setNightLight: (val) => set({ nightLight: val }),
  setSecureBoot: (val) => set({ secureBoot: val }),
  setFastBoot: (val) => set({ fastBoot: val }),
  setBootOrder: (order) => set({ bootOrder: order }),
  skipBoot: () => set({ bootState: 'desktop' }),
}));
