# Project Memory: Fedora Plasma Portfolio

## Current Status
- Project is functionally complete as a pure React web application.
- Dev server and production builds are verified and working cleanly.

## Completed Tasks
- Defined architectural plan and file structure.
- Created `implementation_plan.md` and `task.md`.
- Initialized Vite React TypeScript project.
- Installed core dependencies and Tailwind CSS.
- Built Boot sequence, GDM style login screen, Desktop workspace, and Dock.
- Integrated xterm.js terminal and Custom Command parser.
- Built the File Manager, About, Skills, Projects apps.
- Built the Settings and System Monitor apps (with Force Quit integration).
- Redesigned full system icons into premium 3D glass tiles with diagonal sheen and glowing elements.
- Implemented high-fidelity glassmorphism across windows, status panels, quick settings dropdowns, search modals, and activities overlays.
- Verified components via dev server.

## Pending Work
- None at this time.

## Architectural Decisions
- **Framework**: React with Vite and TypeScript.
- **Styling**: Tailwind CSS for responsive and fast styling, using Glassmorphism for macOS/KDE aesthetics.
- **State Management**: Zustand for managing window states and settings to avoid React Context re-render overhead.
- **Window Management**: `react-rnd` to handle draggable, resizable windows inside the desktop workspace.
- **Terminal**: `xterm.js` for an authentic Linux terminal experience.
- **Pure Web Focus**: Designed as a lightweight web simulation optimized for static hosting platforms like Vercel.

## Bugs Discovered
- Tailwind CSS v3/v4 version conflict causing missing utility builds and unstyled screens.
- Template boilerplate CSS restricting `#root` container width to `1126px` and centering it.
- Browser crash (`ReferenceError: process is not defined` from `react-draggable`) when dragging or interaction begins.

## Fixes Applied
- **Vite & Tailwind v4 Alignment**: Upgraded devDependencies to Tailwind CSS v4, prepended `@import "tailwindcss"` in `src/index.css`, and verified a full compile of `60.63 kB` stylesheet.
- **Full-Screen Desktop Layout**: Removed centering margins and fixed width from `src/index.css`, replacing it with a full-viewport base style (`100vw`/`100vh` base structure).
- **Vite Process Polyfill**: Added `process.env` define key to `vite.config.ts` to prevent runtime process errors.
- **Fedora GNOME Conversion & Overhaul**: Fully migrated desktop shells, login layouts, quick settings dashboard, calendars, taskbar items, and individual page styles to GNOME 40+ aesthetics.

## Changes Log - 2026-06-20T12:54:00+05:30
- Redesigned `BootScreen.tsx` to resemble Fedora GDM login screen with official branding.
- Rewrote `TopBar.tsx` as a correct GNOME status bar with interactive quick-toggles, sliders, clock, and calendars.
- Updated `Dock.tsx` with customized color gradients, border glow styling, and tooltips.
- Overhauled `Window.tsx` and all visual apps (`About`, `Skills`, `Projects`, `Resume`, `Browser`, `File Manager`, `Settings`, `Terminal`) with readable high-contrast typography and matching translucent glass container styles.
- Generated and set premium custom Fedora default wallpaper.

## Changes Log - 2026-06-20T13:14:00+05:30
- Overhauled `BootScreen.tsx` to integrate an interactive GNU GRUB 2.06 bootloader selector (arrow navigation, automatic boot countdown).
- Created a verbose scrolling systemd boot sequence with bright green `[  OK  ]` indicators to simulate realistic Linux service initialization.
- Added conditional rendering in `src/App.tsx` so the main `<Desktop />` is mounted only when `bootState === 'desktop'`.
- Fixed a closure bug in `BootScreen` where log updates were batching the mutated reference of index `i`, leading to `undefined` lines and runtime crashes.

## Changes Log - 2026-06-20T13:34:00+05:30
- Copied the user's uploaded portrait image to `public/avatar.jpg` and bound it on the GDM login profile photo element.
- Integrated the GDM top bar on the login screen, complete with accessibility and status tray dropdown panels (volume control, Suspend, Restart, Power Off system actions).
- Unified the password entry field by placing the circular blue submission arrow button directly inside the right border of the input container.
- Enforced native HTML form-submission behavior on GDM by wrapping password inputs inside form elements, removing the disabled tag, adding autoFocus, and triggering desktop unlocks on keyboard Enter.

## Changes Log - 2026-06-20T13:50:00+05:30
- Implemented global window-level `Enter` keydown handler on the login screen, allowing instant unlock from anywhere on the GDM interface without needing manual input focus.
- Wrapped text selection inside a `setTimeout` callback in the `onFocus` event of the GDM password field. This prevents standard browser mouse clicks from deselecting highlighted text on focus.
- Resolved all Markdown validator path warnings in `walkthrough.md` by standardizing file asset references to forward-slash Windows absolute path configurations.

## Changes Log - 2026-06-20T14:00:00+05:30
- Replaced all colorful, platform-dependent emojis on the GDM login status bar and power/status dropdown panels with crisp, monochrome vector icons from `lucide-react` (Accessibility, Wifi, Volume2, Battery, ChevronDown), matching the desktop top bar and real Fedora GNOME login aesthetics.

## Changes Log - 2026-06-22T19:05:00+05:30
- Overhauled the desktop design system in `index.css` to introduce refined, premium glassmorphism classes (`.glass-widget`, `.glass-widget-light`, `.glass-widget-dark`) with deep backdrop blur (`38px` to `40px`) and top-edge reflective border outlines.
- Rewrote `AppIcon.tsx` to display all application icons within uniform, floating glassy squircle cards complete with diagonal sheen overlays, custom shadows, and vector emblems.
- Configured windows (`Window.tsx`), panels, and quick settings dropdowns (`TopBar.tsx`) to match the new frosted glass look.
- Synchronized the TopBar quick settings "Dark Style" toggle with the global Zustand theme store.
- Upgraded the activities/Mission Control overlay (`ActivitiesOverview.tsx`) to use a deeper background blur of `38px`.
- Refactored `SearchModal.tsx` to read the global theme and adapt its container to use `glass-widget-light` / `glass-widget-dark` with `backdrop-blur-[38px]`.

## Changes Log - 2026-06-23T06:00:00+05:30
### Certificate Screenshots
- Assigned uploaded screenshot images to their respective certificates in `CertificateApp.tsx`.
- Added new certificates: **Oracle AI Foundations Associate**, **Red Hat OpenShift Development I**.
- Fixed Microsoft GitHub Copilot certificate ID and image mapping.
- Copied 5 Oracle cloud certification screenshots (`oracle-generativeai.png`, `oracle-vectorsearch.png`, `oracle-devops.png`, `oracle-multicloud.png`, `oracle-datascience.png`) to `/public` folder.

### Browser App Icon Layout
- Updated `BrowserApp.tsx` so the three browser shortcut icons (e.g. Google, GitHub, LinkedIn) are centered on the page below the search bar, with the middle icon centered and the flanking icons beside it.

## Changes Log - 2026-06-23T14:30:00+05:30
### React Web App Optimization
- Pruned unused scripts and dependencies from `package.json`.
- Simplified power button and environment triggers in `BootScreen.tsx` and `TopBar.tsx` for standard browser workflows.
- Ran `npm install` to clean up node modules and verified production compile via `npm run build`.

## Changes Log - 2026-06-24T07:45:00+05:30
### Hidden Retro Games and Arcade App Integration
- Created 5 high-fidelity game components in `src/apps/`:
  - `SnakeGame.tsx` (Snake Xenzia): Authentic Nokia 3310 keypad bezel, 4 classic maps, succession progression mode, and per-map high scores.
  - `TetrisGame.tsx` (Tetris): Classical 10x20 grid, next piece preview, level speed increments, sound effects, and high score tracking.
  - `FlappyBirdGame.tsx` (Flappy Bird): Smooth canvas rendering, parallax city/ground scrolling, sound effects, and high score tracking.
  - `SpaceFighterGame.tsx` (Space Fighter): 2D arcade spaceshooter with mouse cursor tracking, auto-cannons, particle explosions, armor integrity hearts, and high score tracking.
  - `DinoJumpGame.tsx` (Dino Jump): Google Chrome T-Rex style runner, jumping over small/large cacti and flying birds, speed increments, sound effects, and high score tracking.
- Created `GamesApp.tsx` as a unified retro arcade portal and dashboard. When opened, it presets all 5 games in a grid menu displaying their per-game high scores, with the ability to launch and play them directly inside the app container.
- Registered all 5 games and the `games` parent app in `src/config/apps.ts` with `hideFromDock: true` to prevent them from showing in the bottom app tray.
- Ensured these games are completely absent from the File Manager files, making them accessible exclusively via the global Desktop search bar (searching "games" or individual game titles).
- Added custom pixelated vector game icons and a gamepad controller icon for all new apps in `src/desktop/AppIcon.tsx`.
- Resolved TypeScript compiler strict rules by pruning unused imports, variables, and indexing.

## Changes Log - 2026-06-24T07:50:00+05:30
### Flappy Bird Gameplay Tuning
- Adjusted gravity parameter (`0.4` -> `0.22`) and jump velocity (`-6.2` -> `-4.7`) in `FlappyBirdGame.tsx` to provide a much smoother, floatier flight path.
- Updated controls so pressing the Spacebar also triggers immediate game restarts after a Game Over or when in standby, allowing full keyboard-driven play without requiring mouse clicks.

## Changes Log - 2026-06-24T09:30:00+05:30
### Fedora Rescue Mode and Restart Button
- Added a glassmorphic Restart button (using the RotateCw icon) to the home screen Quick Settings panel footer, between the Lock Screen and Power Off buttons.
- Configured `'rescue_shell'` as a valid system state inside the Zustand store (`useSystemStore.ts`).
- Modified systemd rescue mode boot logging animation in `BootScreen.tsx` to bypass graphical targets and end at the Emergency Mode target.
- Overhauled the `RescueConsole` component with a highly interactive terminal simulation supporting common Linux shell commands (`help`, `exit`, `reboot`, `poweroff`, `journalctl -xb`, `ls`, `cat`, `whoami`, `pwd`, `uname -a`, `df -h`, `free -m`, `clear`, `systemctl`).
- Implemented global click refocus handling and standard keyboard shortcut `Ctrl+D` support to exit the rescue mode shell back to normal boot.

## Changes Log - 2026-06-24T09:40:00+05:30
### Light Theme Glassmorphic UI and Lock Screen Sync
- Bound the background image of the GDM login screen inside `BootScreen.tsx` to the store's `wallpaper` state, enabling settings changes to reflect dynamically on the lock screen.
- Integrated `theme` store state inside the GDM login screen, styling all panels, blur overlays, password input boxes, and dropdown menus to transition cleanly to light or dark styles.
- Updated `glass-widget-light` borders and shadows in `index.css` to use a subtle dark border (`rgba(0, 0, 0, 0.08)`) and high backdrop blur.
- Overrode opaque dark backgrounds (such as `#0c101b`, `#0a0d16`, and `bg-slate-950/45`) to adapt to translucent glass in light mode, preventing dark text on dark backgrounds.
- Created a `.keep-dark` utility rule in `index.css` and added it to retro arcade games (Snake, Tetris, Space Fighter, Flappy Bird, Dino Jump) and the terminal app, isolating their dark text/background elements from light theme overrides.



