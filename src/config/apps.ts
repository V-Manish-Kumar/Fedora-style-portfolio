export interface AppConfig {
  id: string;
  title: string;
  icon: string;
  component: React.LazyExoticComponent<React.FC>;
  hideFromDock?: boolean;
  hideFromSearch?: boolean;
}

import { lazy } from 'react';

export const apps: AppConfig[] = [
  {
    id: 'terminal',
    title: 'Terminal',
    icon: 'Terminal',
    component: lazy(() => import('../apps/TerminalApp')),
  },
  {
    id: 'file-manager',
    title: 'File Manager',
    icon: 'Folder',
    component: lazy(() => import('../apps/FileManagerApp')),
  },
  {
    id: 'projects',
    title: 'Projects',
    icon: 'Briefcase',
    component: lazy(() => import('../apps/ProjectsApp')),
  },
  {
    id: 'about',
    title: 'About',
    icon: 'User',
    component: lazy(() => import('../apps/AboutApp')),
  },
  {
    id: 'skills',
    title: 'Skills',
    icon: 'Award',
    component: lazy(() => import('../apps/SkillsApp')),
  },
  {
    id: 'resume',
    title: 'Resume',
    icon: 'FileText',
    component: lazy(() => import('../apps/ResumeApp')),
  },
  {
    id: 'browser',
    title: 'Browser',
    icon: 'Globe',
    component: lazy(() => import('../apps/BrowserApp')),
  },
  {
    id: 'certificate',
    title: 'Certificate Viewer',
    icon: 'Award',
    component: lazy(() => import('../apps/CertificateApp')),
    hideFromDock: true,
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'Settings',
    component: lazy(() => import('../apps/SettingsApp')),
  },
  {
    id: 'monitor',
    title: 'System Monitor',
    icon: 'Activity',
    component: lazy(() => import('../apps/MonitorApp')),
  },
  {
    id: 'snake',
    title: 'Snake Xenzia',
    icon: 'Gamepad2',
    component: lazy(() => import('../apps/SnakeGame')),
    hideFromDock: true,
    hideFromSearch: true,
  },
  {
    id: 'tetris',
    title: 'Tetris',
    icon: 'Gamepad2',
    component: lazy(() => import('../apps/TetrisGame')),
    hideFromDock: true,
    hideFromSearch: true,
  },
  {
    id: 'flappy',
    title: 'Flappy Bird',
    icon: 'Gamepad2',
    component: lazy(() => import('../apps/FlappyBirdGame')),
    hideFromDock: true,
    hideFromSearch: true,
  },
  {
    id: 'space-fighter',
    title: 'Space Fighter',
    icon: 'Gamepad2',
    component: lazy(() => import('../apps/SpaceFighterGame')),
    hideFromDock: true,
    hideFromSearch: true,
  },
  {
    id: 'dino',
    title: 'Dino Jump',
    icon: 'Gamepad2',
    component: lazy(() => import('../apps/DinoJumpGame')),
    hideFromDock: true,
    hideFromSearch: true,
  },
  {
    id: 'games',
    title: 'Games',
    icon: 'Gamepad2',
    component: lazy(() => import('../apps/GamesApp')),
    hideFromDock: true,
  },
];

