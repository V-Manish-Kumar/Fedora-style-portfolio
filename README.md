# Manish Kumar Vodlamodi — Portfolio OS

<div align="center">

[![Live Demo](https://img.shields.io/badge/_Live_Demo-Visit_Portfolio-3c6eb4?style=for-the-badge)](https://v-manish-kumar.vercel.app)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/new/clone?repository-url=https://github.com/V-Manish-Kumar/Fedora-style-portfolio)

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-black?logo=framer)](https://www.framer.com/motion)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-orange)](https://zustand-demo.pmnd.rs)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](LICENSE)

</div>

---

> **A fully interactive, browser-based Fedora 40 GNOME Desktop OS simulation** — built from scratch as a portfolio showcase.  
> Boot through a realistic GRUB menu, log in via a GDM-style login screen, and interact with a complete windowed desktop including a functional terminal, browser, file manager, system monitor, skill visualizer, and five arcade games — all in your browser.

---

##  Preview

| Boot Sequence | Desktop | Skills Pyramid |
|---|---|---|
| GNU GRUB → systemd → GDM | Window Manager + Dock + TopBar | 5-Level Interactive Pyramid |

| Light Mode | Games Arcade | System Monitor |
|---|---|---|
| Full Glassmorphic Light Theme | 5 Retro Games | Live CPU/RAM Charts |

---

##  Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Application Layer](#-application-layer)
- [State Management](#-state-management)
- [Performance & Build](#-performance--build)
- [Deployment](#-deployment)
- [Design System](#-design-system)
- [Virtual Filesystem](#-virtual-filesystem)
- [Project Structure](#-project-structure)
- [Local Development](#-local-development)
- [Key Design Decisions](#-key-design-decisions)

---

##  Overview

This project simulates a complete Linux desktop operating system experience inside the browser. The entire UI lifecycle follows an authentic Fedora boot path:

```
Power On  →  UEFI/BIOS POST  →  GNU GRUB  →  systemd boot logs
          →  GDM Login Screen  →  GNOME Desktop  →  Apps
```

Every component is purpose-built in React + TypeScript with no UI kit dependencies — all visuals are crafted using Tailwind CSS v4 utilities and vanilla CSS with custom glassmorphism tokens.

---

##  Architecture

```

                    Browser / Vercel CDN                  

                    React 19 + Vite 8                     
                                                          
        
   Boot Layer    Desktop Shell     App Windows     
                                                   
   BootScreen    TopBar          Terminal          
   (BIOS/GRUB    Dock            Browser           
    systemd /    Desktop         Skills            
    GDM Login)   Activities      Projects          
                 SearchModal     FileManager       
                 ImmersiveMgr    Monitor           
                                 Certificates      
                                 Games (×5)        
        
                                                       
    
                Zustand State Stores                    
    useSystemStore    useWindowStore                   
    
                                                          
      
              Shared Config Layer                       
    apps.ts (registry)    vfs.ts (virtual FS)          
      

```

### Boot State Machine

The `bootState` field in `useSystemStore` drives a linear state machine that controls which layer renders:

```
'off' → 'bios' → 'grub' → 'booting' → 'login' → 'desktop'
                                ↓
                     'uefi' → 'windows_booting' → 'windows_bsod'
                                ↓
                          'rescue_shell'
```

| State | Renders |
|---|---|
| `off` | Blank black screen |
| `bios` | UEFI BIOS POST screen |
| `grub` | GNU GRUB bootloader with arrow-key navigation and countdown |
| `booting` | Verbose systemd service log animation (colored `[OK]` / `[FAILED]`) |
| `login` | GDM-style login screen with avatar, password field, clock |
| `desktop` | Full GNOME desktop shell + all apps |
| `rescue_shell` | Minimal recovery terminal overlay |
| `windows_bsod` | Satirical Windows BSOD screen |

---

##  Tech Stack

### Core Runtime

| Technology | Version | Role |
|---|---|---|
| **React** | 19.2 | UI framework — concurrent rendering, automatic batching |
| **TypeScript** | 6.0 | Static typing, interfaces, strict null checks |
| **Vite** | 8.0 | Build tool — ESM-native, HMR, Rollup bundler |
| **Node.js** | 18+ | Runtime for build scripts |

### Styling

| Technology | Version | Role |
|---|---|---|
| **Tailwind CSS** | v4 (Vite plugin) | Utility-first styling with JIT engine |
| **Vanilla CSS** | — | Global design tokens, animations, glassmorphism classes |
| **backdrop-filter** | CSS Level 5 | Core of the liquid glass UI (`backdrop-blur`) |

### State & Interaction

| Technology | Version | Role |
|---|---|---|
| **Zustand** | 5.0 | Lightweight reactive state — system store + window store |
| **Framer Motion** | 12 | Spring animations, layout animations, gesture handling |
| **react-rnd** | 10.5 | Draggable + resizable window containers |

### Terminal

| Technology | Version | Role |
|---|---|---|
| **@xterm/xterm** | 6.0 | Full-featured terminal emulator (xterm.js) |
| **@xterm/addon-fit** | 0.11 | Auto-fits terminal canvas to container size |

### Icons & Assets

| Technology | Role |
|---|---|
| **Lucide React** | 1000+ pixel-perfect SVG icons as React components |
| **Custom SVG Icons** | App icons, OS logos, dock items hand-crafted in SVG |

---

##  Application Layer

Each application is a fully independent React component rendered inside a managed window frame. Apps communicate exclusively through the shared Zustand stores.

### Terminal App (`TerminalApp.tsx`)

Built on **xterm.js** with a custom command parser:

```
Commands supported:
  help          →  Lists all available commands
  neofetch      →  ASCII art system info (OS, kernel, shell, resolution, DE, RAM)
  ls [path]     →  Lists virtual filesystem directory contents
  cat [file]    →  Outputs virtual file text content
  pwd           →  Prints current virtual directory
  cd [dir]      →  Changes virtual directory
  clear / cls   →  Clears the terminal buffer
  whoami        →  Returns current user identity
  uname -a      →  Returns system/kernel version string
  uptime        →  Simulated system uptime
  date          →  Current date/time
  echo [text]   →  Prints input text back
  history       →  Shows command history
  exit          →  Closes the terminal window
```

Terminal uses `@xterm/addon-fit` to auto-resize the canvas and applies a custom dark color theme locked via the `.keep-dark` CSS class (the terminal always stays dark regardless of the system light/dark toggle).

### Skills App (`SkillsApp.tsx`)

Two-panel interactive skills showcase:

**Panel 1 — Skills Pyramid**
- 5 tiers rendered as a true CSS pyramid (widest at base)
- Tiers: `AI & ML` → `DevOps & Cloud` → `Web Development` → `Backend & Systems` → `CS Fundamentals`
- Each tier expands on click to reveal skill tags with individual proficiency bars
- Selected tier is highlighted; others dim with opacity transitions

**Panel 2 — Skills Blender**
- Users select individual skills across 5 categories using checkbox-style pill buttons
- Clicking "Mix Custom Role" runs a weighted matching algorithm against a role definition table
- Outputs a blended developer persona (e.g. *MLOps & AI Platform Engineer*, *Cloud-Native Infrastructure Architect*) with:
  - Role title and description
  - Key capabilities list
  - Match score rationale
- An animated "Blender Cup" SVG shakes and spins during the mixing process

### System Monitor (`MonitorApp.tsx`)

A full macOS Activity Monitor / GNOME System Monitor clone:

- **Process Table**: Combines real open app windows (with deterministic PID assignment based on app ID) and simulated system daemons (`kernel_task`, `WindowServer`, `launchd`, `mds`, etc.)
- **CPU Jitter**: A `setInterval` at 1500ms applies random ±0.2% fluctuation to all CPU values, simulating live readings
- **Live Graph Canvas**: A second `setInterval` at 1000ms appends the total CPU load to a circular history buffer (60 samples) and re-draws a smooth SVG-like curve on an HTML `<canvas>` with a gradient fill
- **Force Quit**: Selecting a process and clicking Force Quit either calls `closeWindow()` on app processes or temporarily removes system daemons from the list (auto-restored after 4 seconds via `setTimeout`, simulating `launchd` daemon restart)
- **Tabs**: Switches between CPU and Memory Pressure graph modes

### File Manager (`FileManagerApp.tsx`)

Navigates a **Virtual Filesystem (VFS)** defined in `src/config/vfs.ts`:

```
Home/
 About/
    about.md         → opens AboutApp
 Projects/
    team-connect.md  → opens ProjectsApp + sets selectedProjectId
    drug-discovery.md
    insta-ad-ai.md
    rag-system.md
    mcp-server.md
 Skills/
    skills.md        → opens SkillsApp
 Contact/
    contact.md       → opens BrowserApp (mailto)
 resume1.pdf          → opens ResumeApp
```

Supports grid and list view modes, double-click to open, breadcrumb navigation, sidebar with animated active indicator (Framer Motion `layoutId`).

### Browser App (`BrowserApp.tsx`)

Simulated Chromium-style browser:

- Address bar with URL/search detection (URL if contains `.` and no spaces, else Google search)
- Navigation buttons (Back, Reload, Home)
- New Tab page with Google logo, search bar, and shortcut grid (LinkedIn, GitHub, Mail, 4 project links)
- External links cannot be iframed (CORS/X-Frame-Options) so a custom "Security Redirect" card explains and provides an external link

### Games (`GamesApp.tsx` + individual game files)

All games are implemented as vanilla HTML Canvas via React refs:

| Game | Implementation Highlights |
|---|---|
| **Snake Xenzia** | Multi-map mode (Box, Border, Obstacles), succession mode, localStorage high scores per map |
| **Tetris** | Full Tetromino system with 7-bag randomizer, line clear scoring, level speed progression |
| **Flappy Bird** | Gravity physics, pipe gap generation with seeded randomness, frame-rate-independent delta time |
| **Space Fighter** | Mouse-tracked player ship, auto-firing cannons, enemy wave spawning, collision AABB detection |
| **Dino Jump** | Procedural obstacle spawning, duck mechanic (ArrowDown), increasing scroll speed |

Game canvases are wrapped in `.keep-dark` to force dark rendering regardless of the system theme. The GamesApp **dashboard shell** (header, game cards, descriptions) is fully theme-aware.

---

##  State Management

Two Zustand stores handle all shared state with no prop drilling.

### `useSystemStore.ts`

```typescript
interface SystemStore {
  bootState: 'off' | 'bios' | 'grub' | 'booting' | 'login' | 'desktop'
           | 'uefi' | 'windows_booting' | 'windows_bsod' | 'rescue_shell';
  theme: 'dark' | 'light';          // system-wide theme toggle
  wallpaper: string;                 // CSS background-image URL
  volume: number;                    // 0–100
  brightness: number;                // 0–100
  battery: number;                   // 0–100 (simulated)
  highContrast: boolean;
  screenReader: boolean;
  largeText: boolean;
  activitiesMode: boolean;           // Mission Control overlay
  activitiesSearchQuery: string;
  nightLight: boolean;
  secureBoot: boolean;
  fastBoot: boolean;
  bootOrder: string[];               // GRUB entry order
}
```

### `useWindowStore.ts`

```typescript
interface WindowStore {
  windows: Record<string, WindowState>;  // id → state map
  openWindow(id, title): void;
  closeWindow(id): void;
  focusWindow(id): void;
  minimizeWindow(id): void;
  // Cross-app communication state:
  browserUrl: string;                    // drives BrowserApp navigation
  setBrowserUrl(url): void;
  selectedProjectId: string | null;      // drives ProjectsApp detail view
  setSelectedProjectId(id): void;
  selectedCertificateId: string | null;  // drives CertificateApp detail view
  setSelectedCertificateId(id): void;
}

interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  x: number; y: number;
  width: number; height: number;
}
```

---

##  Performance & Build

### Code Splitting Strategy

Vite's Rollup bundler is configured with a `manualChunks` function to split the bundle into focused chunks:

```
dist/assets/
 vendor-[hash].js         React 19 + ReactDOM + scheduler    (~224 KB / 69 KB gz)
 motion-[hash].js         Framer Motion                       (~133 KB / 44 KB gz)
 terminal-[hash].js       xterm.js + addon-fit                (~342 KB / 87 KB gz)
 index-[hash].js          Core app shell                      (~120 KB / 30 KB gz)
 SkillsApp-[hash].js      Skills Pyramid + Blender            (~20 KB / 6 KB gz)
 TerminalApp-[hash].js    Terminal command engine             (~8 KB / 3 KB gz)
 GamesApp + *Game.js      Individual game chunks             (7–12 KB each)
 [other app chunks]       Lazy-loaded per app window
```

All app window components are **code-split** via dynamic imports — they are only fetched when the user first opens that window. The initial page load delivers only the shell, boot sequence, and vendor chunks.

### Cache Strategy (via `vercel.json`)

```
/assets/*   →  Cache-Control: public, max-age=31536000, immutable
             (Hashed filenames = safe permanent caching)

/*.png, /*.jpg  →  Cache-Control: public, max-age=86400, stale-while-revalidate=604800
                  (Images re-validated after 1 day, served stale for 7 days)

/resume1.pdf  →  Cache-Control: public, max-age=86400
                 Content-Disposition: inline   (renders in iframe, not download)
```

### Build Output (production)

```
 2211 modules transformed
 Built in ~1.4s
 0 TypeScript errors
 0 lint warnings
```

---

##  Deployment

### One-Click Vercel Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/V-Manish-Kumar/Fedora-style-portfolio)

### Manual GitHub → Vercel Deploy

1. Fork / clone this repository
2. Push to your GitHub account
3. Visit [vercel.com/new](https://vercel.com/new) → Import Repository
4. Vercel auto-detects Vite from `vercel.json` — **no manual configuration needed**
5. Click **Deploy**

### `vercel.json` Breakdown

```json
{
  "framework": "vite",                   ← tells Vercel which preset to use
  "buildCommand": "npm run build",       ← tsc + vite build
  "outputDirectory": "dist",            ← where built files go
  "installCommand": "npm install",
  "cleanUrls": true,                    ← removes .html extensions
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],                                    ← SPA fallback for React routing
  "headers": [
    "/assets/*"  → long-term immutable cache
    "/*.png"     → image caching with stale-while-revalidate
    "/resume1.pdf" → inline PDF rendering
    "/*"         → security headers (X-Frame-Options, XSS-Protection, etc.)
  ]
}
```

---

##  Design System

### Glassmorphism Token Classes (`src/index.css`)

```css
/* Primary glass card — used for all app window backgrounds */
.liquid-glass-card {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(38px) saturate(1.4);
  border: 1px solid rgba(255, 255, 255, 0.13);
  box-shadow: 0 8px 32px rgba(0,0,0,0.28),
              inset 0 1px 1px rgba(255,255,255,0.18);
}

/* Pill variant — used for sidebar active indicators */
.liquid-glass-pill { ... }

/* Force dark — overrides light theme for terminal/games */
.keep-dark {
  color-scheme: dark;
  --tw-bg-opacity: 1;
}
```

### Light Theme Implementation

Every app reads theme from `useSystemStore` and computes an `isLight` boolean:

```typescript
const theme = useSystemStore((state) => state.theme);
const isLight = theme === 'light';

// Usage pattern:
className={isLight ? 'bg-white/60 text-slate-900' : 'bg-slate-900/80 text-slate-200'}
```

All hardcoded dark-only classes (`text-white`, `bg-slate-900`, `border-white/10`) were refactored to be conditionally applied. Components that must always stay dark (Terminal, Game canvases) use the `.keep-dark` utility.

### Color Palette

| Token | Dark Mode | Light Mode | Usage |
|---|---|---|---|
| Accent Blue | `#3c6eb4` | `#3c6eb4` | Buttons, active states, focus rings |
| Surface | `rgba(0,0,0,0.25)` | `rgba(255,255,255,0.6)` | Card backgrounds |
| Border | `rgba(255,255,255,0.10)` | `rgba(0,0,0,0.10)` | Card outlines |
| Text Primary | `rgb(226,232,240)` slate-200 | `rgb(15,23,42)` slate-900 | Body text |
| Text Secondary | `rgb(148,163,184)` slate-400 | `rgb(100,116,139)` slate-500 | Captions |

### Typography

| Element | Font | Weight | Size |
|---|---|---|---|
| OS Title / H1 | Inter (system-ui) | 700 | 1.25–2rem |
| App Window Title | Inter | 600 | 0.875rem |
| Body / Description | Inter | 400 | 0.75–0.875rem |
| Terminal | JetBrains Mono / monospace | 400 | 0.8125rem |
| Labels / Badges | Inter | 700 | 0.625rem |

---

##  Virtual Filesystem

The VFS (`src/config/vfs.ts`) defines a typed recursive tree that the File Manager traverses:

```typescript
interface VFSNode {
  name: string;
  type: 'folder' | 'file';
  appId?: string;           // which app to open on double-click
  url?: string;             // optional URL for browser app
  children?: VFSNode[];
}
```

File double-clicks trigger cross-store navigation:
- `.md` files in `Projects/` → `setSelectedProjectId(id)` + `openWindow('projects')`
- `.txt` files in a `Certificates/` path → `setSelectedCertificateId(id)` + `openWindow('certificate')`
- Files with `appId: 'browser'` + `url` → `setBrowserUrl(url)` + `openWindow('browser')`
- `.pdf` → `openWindow('resume')`

---

##  Project Structure

```
Portfolio-2/

 public/                           # Static assets — served at root /
    avatar.jpg                    # Profile photo (login screen + About app)
    resume1.pdf                   # Inline PDF for Resume app
    fedora-wallpaper.png          # Default desktop wallpaper
    favicon.svg                   # Browser tab icon
    icons.svg                     # SVG sprite sheet
   
    # Certificate images (14 files):
    oracle-ai-foundations.png
    oracle-devops.png
    oracle-datascience.png
    oracle-multicloud.png
    oracle-vectorsearch.png
    oracle-generativeai.png
    mlops-google.png
    ai-fundamentals-ibm.png
    github-copilot-microsoft.png
    salesforce-agentblazer.png
    redhat-openshift.png
    unity-essentials.png
    csharp-w3schools.png
    machine-learning-columbia.png
   
    # Project screenshots (5 files):
        team-connect-screenshot.png
        drug-discovery-screenshot.png
        insta-ad-ai-screenshot.png
        mcp-server-screenshot.png
        rag-system-screenshot.png

 src/
    main.tsx                      # React root — renders <App />
    App.tsx                       # Mounts <BootScreen /> (owns entire lifecycle)
    App.css                       # App-level resets
    index.css                     # Global design system tokens, animations
   
    apps/                         # All application window components
       AboutApp.tsx              # Profile, education, interests, philosophy
       BrowserApp.tsx            # Chrome-style browser with new tab / address bar
       CertificateApp.tsx        # 14 certificates with grid + detail view
       FileManagerApp.tsx        # VFS navigator with grid/list + sidebar
       GamesApp.tsx              # Arcade dashboard hub
       DinoJumpGame.tsx          # Chrome Dino canvas game
       FlappyBirdGame.tsx        # Flappy Bird canvas game
       SnakeGame.tsx             # Multi-map Snake canvas game
       SpaceFighterGame.tsx      # Space shooter canvas game
       TetrisGame.tsx            # Full Tetris canvas game
       MonitorApp.tsx            # Activity monitor with live canvas charts
       ProjectsApp.tsx           # Project cards + detail view with screenshots
       ResumeApp.tsx             # Inline PDF iframe viewer
       SettingsApp.tsx           # Theme toggle + wallpaper picker + system info
       SkillsApp.tsx             # Skills Pyramid + Skills Blender
       TerminalApp.tsx           # xterm.js terminal with custom command parser
   
    desktop/                      # OS shell components
       BootScreen.tsx            # BIOS/GRUB/systemd/GDM — 1700+ lines
       Desktop.tsx               # Wallpaper canvas, window container
       TopBar.tsx                # GNOME top bar — clock, notifications, quick settings
       Dock.tsx                  # Bottom dock with hover magnification
       AppIcon.tsx               # Dynamic SVG icon renderer for all apps
       ActivitiesOverview.tsx    # Mission Control workspace overlay
       SearchModal.tsx           # Spotlight-style app search
       ImmersiveManager.tsx      # Fullscreen app management
       BatteryIcon.tsx           # SVG battery level indicator
   
    windows/
       Window.tsx                # react-rnd window frame with title bar, controls
   
    config/
       apps.ts                   # App registry — id, title, icon, default size/position
       vfs.ts                    # Virtual filesystem tree definition
   
    store/
        useSystemStore.ts         # System state — boot, theme, wallpaper, hw simulation
        useWindowStore.ts         # Window manager state — open/close/focus/minimize

 index.html                        # Entry HTML with SEO meta, OG, Twitter Card
 vite.config.ts                    # Vite config — base '/', plugins, code splitting
 vercel.json                       # Vercel deploy config — rewrites, headers, preset
 tsconfig.json                     # TypeScript project references
 tsconfig.app.json                 # App-level TS config (strict mode)
 tsconfig.node.json                # Node/tooling TS config
 package.json                      # Dependencies and scripts
 .gitignore                        # Excludes node_modules, dist, Electron artifacts
```

---

##  Local Development

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- npm 9+
- Git

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/V-Manish-Kumar/Fedora-style-portfolio.git
cd Fedora-style-portfolio

# 2. Install dependencies
npm install

# 3. Start the development server (with Hot Module Replacement)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Available Scripts

```bash
npm run dev        # Start Vite HMR dev server on port 5173
npm run build      # Type-check (tsc -b) then build production bundle to dist/
npm run preview    # Serve the production dist/ folder locally on port 4173
npm run lint       # Run ESLint across all .ts/.tsx files
```

### TypeScript Strict Mode

This project uses strict TypeScript (`tsconfig.app.json`):
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

---

##  Key Design Decisions

### 1. `base: '/'` in `vite.config.ts`
Using `base: '/'` ensures all generated asset URLs are absolute (`/assets/index-abc123.js`). Using `'./'` (relative) would break on Vercel when assets are served from a CDN edge and routes are rewritten — a common SPA deployment bug.

### 2. SPA Rewrite in `vercel.json`
The `rewrites` rule `/(.*) → /index.html` makes React handle all routing client-side. Without it, navigating directly to a deep URL (or refreshing) returns a 404 from Vercel's static file server.

### 3. `.keep-dark` CSS Class
Some components (Terminal, Game canvases) must always render with a dark background regardless of the global theme. The `.keep-dark` utility forces `color-scheme: dark` and resets Tailwind dark-mode context, preventing light theme styles from bleeding in.

### 4. Cross-App Communication via Store
Instead of prop-drilling through window components, app-to-app navigation uses the Zustand store as a message bus:
- File Manager tells Projects app which project to show via `setSelectedProjectId`
- File Manager tells Browser app which URL to load via `setBrowserUrl`
- This decouples apps completely; they only depend on the shared store interface

### 5. Deterministic PIDs in System Monitor
App PIDs are calculated as `1000 + sum(charCodes(appId))` — this makes PIDs stable across re-renders without needing a separate registry, while still appearing "realistic" in the process table.

### 6. VFS as Pure Config
The Virtual Filesystem is a plain TypeScript object, not runtime state. This means it's bundled at build time (zero network request), type-checked, and tree-shaken. Any file or folder can be opened to launch an app by just setting the `appId` field.

---

##  Live Demo

 **[v-manish-kumar.vercel.app](https://v-manish-kumar.vercel.app)**

---

## ‍ About the Author

**Manish Kumar Vodlamodi**  
B.Tech CSE (AI/ML) — Malla Reddy College of Engineering and Technology  
CGPA: 8.3 | Expected Graduation: June 2027

-  [LinkedIn](https://www.linkedin.com/in/v-manish-kumar)
-  [GitHub](https://github.com/V-Manish-Kumar)
-  [manishedu980@gmail.com](mailto:manishedu980@gmail.com)

---

##  License

MIT © 2025 Manish Kumar Vodlamodi  
Free to fork, adapt, and use for your own portfolio. Attribution appreciated but not required.
