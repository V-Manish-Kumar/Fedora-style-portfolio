import React, { useEffect, useRef, useCallback } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useWindowStore } from '../store/useWindowStore';
import { vfs } from '../config/vfs';
import type { VFSNode } from '../config/vfs';

const SHORTCUTS = [
  { keys: 'Ctrl+F4 / Alt+F4', desc: 'Close active window' },
  { keys: 'Ctrl+Tab', desc: 'Switch between windows' },
  { keys: 'Alt+Q', desc: 'Open window switcher' },
  { keys: 'Ctrl+Shift+Alt+Q', desc: 'Exit the portfolio' },
];

const TerminalApp: React.FC = () => {
  const terminalRef = useRef<HTMLDivElement>(null);
  const termInstance = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon | null>(null);

  const currentDir = useRef<string>('/home/manish');
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef<number>(-1);

  // Full line buffer + cursor position for proper left/right editing
  const lineBuffer = useRef<string>('');
  const cursorPos = useRef<number>(0); // position within lineBuffer

  const openWindow = useWindowStore((state) => state.openWindow);
  const setSelectedProjectId = useWindowStore((state) => state.setSelectedProjectId);

  const resolveVFSNode = useCallback((pathStr: string): { node: VFSNode; absolutePath: string } | null => {
    let rawPath = pathStr.trim();
    if (rawPath.startsWith('~')) {
      rawPath = '/home/manish' + rawPath.slice(1);
    } else if (!rawPath.startsWith('/')) {
      rawPath = currentDir.current + (currentDir.current === '/' ? '' : '/') + rawPath;
    }

    const inputSegments = rawPath.split('/').filter(Boolean);
    const segments: string[] = [];
    for (const seg of inputSegments) {
      if (seg === '.') {
        continue;
      } else if (seg === '..') {
        if (segments.length > 2) segments.pop();
      } else {
        segments.push(seg);
      }
    }

    if (segments.length < 2 || segments[0].toLowerCase() !== 'home' || segments[1].toLowerCase() !== 'manish') {
      return null;
    }

    let currentNode: VFSNode = vfs;
    const finalSegments = ['home', 'manish'];

    for (let i = 2; i < segments.length; i++) {
      const seg = segments[i];
      if (!currentNode.children) return null;
      const found = currentNode.children.find(c => c.name.toLowerCase() === seg.toLowerCase());
      if (!found) return null;
      currentNode = found;
      finalSegments.push(found.name);
    }

    return { node: currentNode, absolutePath: '/' + finalSegments.join('/') };
  }, []);

  const processCommand = useCallback((input: string, term: Terminal) => {
    if (!input) return;
    const args = input.trim().split(/\s+/);
    const cmd = args[0].toLowerCase();

    switch (cmd) {
      case 'help':
        term.writeln('\x1b[33m┌─ Available Commands ───────────────────────────────────────┐\x1b[0m');
        term.writeln('  \x1b[36mls\x1b[0m        List directory contents');
        term.writeln('  \x1b[36mcd\x1b[0m        Change directory (e.g., cd projects)');
        term.writeln('  \x1b[36mcat\x1b[0m       View file / open app (e.g., cat skills.txt)');
        term.writeln('  \x1b[36mpwd\x1b[0m       Print working directory');
        term.writeln('  \x1b[36mclear\x1b[0m     Clear terminal screen');
        term.writeln('  \x1b[36mhistory\x1b[0m   Show command history');
        term.writeln('  \x1b[36mneofetch\x1b[0m  System info');
        term.writeln('  \x1b[36mabout\x1b[0m     Open About app');
        term.writeln('  \x1b[36mskills\x1b[0m    Open Skills app');
        term.writeln('  \x1b[36mprojects\x1b[0m  Open Projects app');
        term.writeln('  \x1b[36mresume\x1b[0m    Open Resume viewer');
        term.writeln('');
        term.writeln('\x1b[33m┌─ Desktop Keyboard Shortcuts ──────────────────────────────┐\x1b[0m');
        SHORTCUTS.forEach(s => {
          term.writeln(`  \x1b[35m${s.keys.padEnd(24)}\x1b[0m ${s.desc}`);
        });
        term.writeln('\x1b[33m└───────────────────────────────────────────────────────────┘\x1b[0m');
        break;

      case 'clear':
        term.clear();
        break;
      case 'whoami':
        term.writeln('manish');
        break;
      case 'pwd':
        term.writeln(currentDir.current);
        break;
      case 'date':
        term.writeln(new Date().toString());
        break;

      case 'ls': {
        const target = args[1] ?? '.';
        const resolved = resolveVFSNode(target);
        if (!resolved) {
          term.writeln(`\x1b[31mls: cannot access '${args[1]}': No such file or directory\x1b[0m`);
        } else if (resolved.node.type === 'file') {
          term.writeln(resolved.node.name);
        } else {
          const contents = resolved.node.children?.map(c =>
            c.type === 'folder' ? `\x1b[34m${c.name}/\x1b[0m` : c.name
          ) || [];
          term.writeln(contents.join('  '));
        }
        break;
      }

      case 'cd': {
        const target = args[1];
        if (!target || target === '~') { currentDir.current = '/home/manish'; break; }
        const resolved = resolveVFSNode(target);
        if (resolved && resolved.node.type === 'folder') {
          currentDir.current = resolved.absolutePath;
        } else if (resolved && resolved.node.type === 'file') {
          term.writeln(`\x1b[31mbash: cd: ${target}: Not a directory\x1b[0m`);
        } else {
          term.writeln(`\x1b[31mbash: cd: ${target}: No such file or directory\x1b[0m`);
        }
        break;
      }

      case 'cat': {
        const target = args[1];
        if (!target) { term.writeln('\x1b[31mcat: missing operand\x1b[0m'); break; }
        const resolved = resolveVFSNode(target);
        if (!resolved) { term.writeln(`\x1b[31mcat: ${target}: No such file or directory\x1b[0m`); break; }
        if (resolved.node.type === 'folder') { term.writeln(`\x1b[31mcat: ${target}: Is a directory\x1b[0m`); break; }
        const node = resolved.node;
        if (node.content) term.writeln(node.content);
        if (node.appId) {
          if (node.appId === 'projects') {
            const id = node.name.replace('.md', '');
            setSelectedProjectId(id);
          } else if (node.appId === 'certificate') {
            const id = node.name.replace('.txt', '').replace('.md', '');
            useWindowStore.getState().setSelectedCertificateId(id);
          } else if (node.appId === 'browser' && node.url) {
            useWindowStore.getState().setBrowserUrl(node.url);
          }
          openWindow(node.appId, node.appId === 'certificate' ? 'Certificate Viewer' : node.appId.charAt(0).toUpperCase() + node.appId.slice(1));
          term.writeln(`\x1b[32mOpening ${node.appId}...\x1b[0m`);
        }
        break;
      }

      case 'history':
        commandHistory.current.forEach((c, i) => term.writeln(`  \x1b[90m${String(i + 1).padStart(3)}\x1b[0m  ${c}`));
        break;

      case 'neofetch':
        term.writeln('\x1b[34m         .---.        \x1b[0m \x1b[1mmanish\x1b[0m@\x1b[1mfedora\x1b[0m');
        term.writeln('\x1b[34m        /     \\       \x1b[0m -------------');
        term.writeln('\x1b[34m        \\  f  /       \x1b[0m OS: Fedora Workstation 40');
        term.writeln('\x1b[34m         `---`        \x1b[0m Kernel: 6.8.9-300.fc40');
        term.writeln('\x1b[34m                      \x1b[0m DE: GNOME 46 (Dash to Dock)');
        term.writeln('\x1b[34m                      \x1b[0m Shell: bash 5.2.26');
        term.writeln('\x1b[34m                      \x1b[0m Theme: macOS Glassmorphic');
        break;

      case 'about':    openWindow('about',    'About');    term.writeln('\x1b[32mOpening About...\x1b[0m'); break;
      case 'skills':   openWindow('skills',   'Skills');   term.writeln('\x1b[32mOpening Skills...\x1b[0m'); break;
      case 'projects': openWindow('projects', 'Projects'); term.writeln('\x1b[32mOpening Projects...\x1b[0m'); break;
      case 'resume':   openWindow('resume',   'Resume');   term.writeln('\x1b[32mOpening Resume...\x1b[0m'); break;

      default:
        term.writeln(`\x1b[31mbash: ${cmd}: command not found\x1b[0m`);
    }
  }, [openWindow, resolveVFSNode, setSelectedProjectId]);

  useEffect(() => {
    if (!terminalRef.current) return;

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      theme: {
        background: '#0d1117',
        foreground: '#c9d1d9',
        cursor: '#58a6ff',
        black: '#0d1117',
        red: '#f85149',
        green: '#3fb950',
        yellow: '#d29922',
        blue: '#58a6ff',
        magenta: '#bc8cff',
        cyan: '#39c5cf',
        white: '#b1bac4',
      },
      fontFamily: '"Cascadia Code", "Fira Code", "JetBrains Mono", monospace',
      fontSize: 13,
      lineHeight: 1.4,
      scrollback: 2000,
      allowProposedApi: true,
    });

    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(terminalRef.current);

    // Small delay to let the DOM settle before fitting
    setTimeout(() => fit.fit(), 50);

    termInstance.current = term;
    fitAddon.current = fit;

    const getPrompt = () => {
      const displayPath = currentDir.current.startsWith('/home/manish')
        ? '~' + currentDir.current.slice('/home/manish'.length)
        : currentDir.current;
      return `\r\n\x1b[32mmanish@fedora\x1b[0m:\x1b[34m${displayPath}\x1b[0m$ `;
    };

    const writePrompt = () => term.write(getPrompt());

    // Re-draw current line after cursor movement or edit
    const redrawLine = () => {
      const buf = lineBuffer.current;
      const pos = cursorPos.current;
      // Move to beginning of line input area, clear it, rewrite, reposition cursor
      term.write(`\x1b[2K\r${getPrompt().replace('\r\n', '')}${buf}`);
      // Move cursor left by (buf.length - pos) to place it correctly
      const moveLeft = buf.length - pos;
      if (moveLeft > 0) term.write(`\x1b[${moveLeft}D`);
    };

    term.writeln('\x1b[1;34m Welcome to Fedora Workstation \x1b[0m— Portfolio Terminal');
    term.writeln(' Type \x1b[36mhelp\x1b[0m for available commands and keyboard shortcuts.');
    writePrompt();

    term.onKey(({ domEvent }) => {
      const ev = domEvent;
      // Stop events from bubbling to ImmersiveManager (prevents window close etc.)
      ev.stopPropagation();

      const buf = lineBuffer.current;
      const pos = cursorPos.current;

      // Enter
      if (ev.keyCode === 13) {
        const cmd = buf.trim();
        term.write('\r\n');
        processCommand(cmd, term);
        if (cmd) {
          commandHistory.current.push(cmd);
          historyIndex.current = commandHistory.current.length;
        }
        lineBuffer.current = '';
        cursorPos.current = 0;
        writePrompt();
        return;
      }

      // Backspace
      if (ev.keyCode === 8) {
        if (pos > 0) {
          lineBuffer.current = buf.slice(0, pos - 1) + buf.slice(pos);
          cursorPos.current = pos - 1;
          redrawLine();
        }
        return;
      }

      // Delete (forward delete)
      if (ev.keyCode === 46) {
        if (pos < buf.length) {
          lineBuffer.current = buf.slice(0, pos) + buf.slice(pos + 1);
          redrawLine();
        }
        return;
      }

      // Arrow Left
      if (ev.keyCode === 37) {
        if (pos > 0) {
          cursorPos.current = pos - 1;
          term.write('\x1b[D');
        }
        return;
      }

      // Arrow Right
      if (ev.keyCode === 39) {
        if (pos < buf.length) {
          cursorPos.current = pos + 1;
          term.write('\x1b[C');
        }
        return;
      }

      // Home (Ctrl+A or Home key)
      if (ev.keyCode === 36 || (ev.ctrlKey && ev.key === 'a')) {
        if (pos > 0) {
          term.write(`\x1b[${pos}D`);
          cursorPos.current = 0;
        }
        return;
      }

      // End (Ctrl+E or End key)
      if (ev.keyCode === 35 || (ev.ctrlKey && ev.key === 'e')) {
        const moveRight = buf.length - pos;
        if (moveRight > 0) {
          term.write(`\x1b[${moveRight}C`);
          cursorPos.current = buf.length;
        }
        return;
      }

      // Arrow Up — history prev
      if (ev.keyCode === 38) {
        if (historyIndex.current > 0) {
          historyIndex.current -= 1;
          lineBuffer.current = commandHistory.current[historyIndex.current];
          cursorPos.current = lineBuffer.current.length;
          redrawLine();
        }
        return;
      }

      // Arrow Down — history next
      if (ev.keyCode === 40) {
        if (historyIndex.current < commandHistory.current.length - 1) {
          historyIndex.current += 1;
          lineBuffer.current = commandHistory.current[historyIndex.current];
        } else {
          historyIndex.current = commandHistory.current.length;
          lineBuffer.current = '';
        }
        cursorPos.current = lineBuffer.current.length;
        redrawLine();
        return;
      }

      // Ctrl+C — cancel current line
      if (ev.ctrlKey && ev.key === 'c') {
        term.write('^C');
        lineBuffer.current = '';
        cursorPos.current = 0;
        writePrompt();
        return;
      }

      // Ctrl+L — clear screen
      if (ev.ctrlKey && ev.key === 'l') {
        term.clear();
        writePrompt();
        return;
      }

      // Ctrl+U — clear to beginning
      if (ev.ctrlKey && ev.key === 'u') {
        lineBuffer.current = buf.slice(pos);
        cursorPos.current = 0;
        redrawLine();
        return;
      }

      // Ctrl+K — clear to end
      if (ev.ctrlKey && ev.key === 'k') {
        lineBuffer.current = buf.slice(0, pos);
        redrawLine();
        return;
      }

      // Skip other control/alt/meta combos
      if (ev.ctrlKey || ev.altKey || ev.metaKey) return;

      // Printable character — insert at cursor position
      if (ev.key.length === 1) {
        lineBuffer.current = buf.slice(0, pos) + ev.key + buf.slice(pos);
        cursorPos.current = pos + 1;
        if (pos === buf.length) {
          // Appending to end — simple write
          term.write(ev.key);
        } else {
          // Inserting mid-line — redraw
          redrawLine();
        }
      }
    });

    const handleResize = () => {
      if (fitAddon.current) fitAddon.current.fit();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      term.dispose();
    };
  }, [processCommand]);

  return (
    <div
      ref={terminalRef}
      className="w-full h-full bg-[#0d1117] keep-dark"
      style={{ padding: '4px' }}
      // Stop keyboard events from escaping to ImmersiveManager when terminal is active
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
    />
  );
};

export default TerminalApp;
