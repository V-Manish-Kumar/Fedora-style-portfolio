# Manish Kumar Vodlamodi — Portfolio OS

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

A high-fidelity, interactive, browser-based simulation of a **Fedora 40 GNOME Desktop Environment** — built as a portfolio showcase. Boot through GRUB, log in via GDM, and explore a fully functional desktop with draggable windows, a working terminal, games, projects, certificates, and more.

🔗 **[Live Demo →](https://v-manish-kumar.vercel.app)**

---

## ✨ Features

| Feature | Description |
|---|---|
| **GNU GRUB Bootloader** | Arrow-key navigatable OS selector with auto-countdown |
| **Systemd Boot Sequence** | Realistic verbose Linux boot log simulation |
| **GDM Login Screen** | Password-validated login with keyboard Enter support, light/dark |
| **Glassmorphism UI** | Liquid glass panels, frosted blur, glow effects across all apps |
| **Light / Dark Theme** | Full system-wide theme toggle — all apps adapt |
| **Activities Overview** | Mission Control–style workspace switcher |
| **Window Manager** | Draggable, resizable, minimizable, stackable windows via `react-rnd` |
| **Working Terminal** | xterm.js shell with `neofetch`, `ls`, `cat`, `help`, and more |
| **Skills Pyramid** | Interactive 5-level skills pyramid (AI → Fundamentals) |
| **Skills Blender** | Mix skills into custom blended developer personas |
| **Projects App** | Detailed project cards with screenshots and GitHub links |
| **Certificates App** | 14 verified professional certificates with credential links |
| **File Manager** | Virtual filesystem with sidebar navigation and grid/list modes |
| **System Monitor** | Live CPU/RAM graphs, process table, Force Quit utility |
| **Browser** | Simulated browser with bookmarks, address bar and search |
| **Resume Viewer** | Inline PDF viewer with download |
| **Arcade Games** | Snake, Tetris, Flappy Bird, Space Fighter, Dino Jump |
| **Settings** | Wallpaper picker, theme toggle, system info panel |

---

## 🛠 Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TypeScript |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4, Vanilla CSS |
| **State Management** | Zustand |
| **Animations** | Framer Motion |
| **Window Management** | react-rnd |
| **Terminal** | @xterm/xterm + @xterm/addon-fit |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) 18+
- npm 9+

### 1. Clone
```bash
git clone https://github.com/V-Manish-Kumar/Portfolio-2.git
cd Portfolio-2
```

### 2. Install
```bash
npm install
```

### 3. Develop
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 4. Build for Production
```bash
npm run build
```
Output is in the `dist/` directory.

### 5. Preview Production Build
```bash
npm run preview
```

---

## ☁️ Deploy to Vercel — One Click

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/V-Manish-Kumar/Portfolio-2)

Or manually:

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repo
3. Vercel auto-detects Vite — no manual settings needed (all config is in `vercel.json`)
4. Click **Deploy** ✅

The `vercel.json` in this repo already configures:
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- SPA client-side routing rewrite (`/*` → `/index.html`)
- Long-term asset cache headers
- Security headers (X-Frame-Options, CSP, etc.)
- Inline PDF rendering for the resume viewer

---

## 📁 Project Structure

```
Portfolio-2/
├── public/                 # Static assets served at /
│   ├── avatar.jpg          # Profile photo
│   ├── resume1.pdf         # Resume PDF
│   ├── fedora-wallpaper.png
│   ├── favicon.svg
│   ├── *.png               # Certificate images & project screenshots
│   └── icons.svg
├── src/
│   ├── apps/               # All app window components
│   │   ├── AboutApp.tsx
│   │   ├── BrowserApp.tsx
│   │   ├── CertificateApp.tsx
│   │   ├── FileManagerApp.tsx
│   │   ├── GamesApp.tsx
│   │   ├── MonitorApp.tsx
│   │   ├── ProjectsApp.tsx
│   │   ├── ResumeApp.tsx
│   │   ├── SettingsApp.tsx
│   │   ├── SkillsApp.tsx
│   │   ├── TerminalApp.tsx
│   │   └── *Game.tsx       # Individual game components
│   ├── config/             # App registry and virtual filesystem
│   ├── desktop/            # OS chrome (Dock, TopBar, BootScreen, etc.)
│   ├── store/              # Zustand state stores
│   └── main.tsx
├── index.html
├── vite.config.ts
├── vercel.json             # Vercel deployment configuration
├── tsconfig.json
└── package.json
```

---

## 🔑 Key Design Decisions

- **Absolute asset paths (`/`)**: All public assets use absolute paths (e.g. `/avatar.jpg`) so they resolve correctly regardless of the route the user is on — critical for Vercel's SPA routing.
- **SPA Rewrite**: The `vercel.json` rewrites all routes to `/index.html` so React Router / deep links work on direct access or page refresh.
- **`keep-dark` class**: Game canvases and the Terminal retain forced dark mode via a `.keep-dark` CSS utility even when the system theme is Light.
- **Code Splitting**: Vite's `manualChunks` splits `vendor` (React), `motion` (Framer Motion), and `terminal` (xterm.js) into separate chunks for faster initial load.

---

## 📜 License

MIT — feel free to fork and adapt for your own portfolio.
