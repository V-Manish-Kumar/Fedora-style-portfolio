import React, { useEffect, useState, useRef } from 'react';
import { useWindowStore } from '../store/useWindowStore';
import { useSystemStore } from '../store/useSystemStore';
import { AppIcon } from '../desktop/AppIcon';
import { Search, XOctagon } from 'lucide-react';

interface ProcessItem {
  pid: number;
  name: string;
  user: string;
  cpu: number;
  memory: number; // in MB
  threads: number;
  isSystem?: boolean;
  appId?: string; // Set for active windows
}

const INITIAL_SYSTEM_PROCESSES: ProcessItem[] = [
  { pid: 0, name: 'kernel_task', user: 'root', cpu: 1.5, memory: 1024, threads: 162, isSystem: true },
  { pid: 1, name: 'launchd', user: 'root', cpu: 0.1, memory: 14.5, threads: 3, isSystem: true },
  { pid: 92, name: 'mds', user: 'root', cpu: 0.4, memory: 112.5, threads: 14, isSystem: true },
  { pid: 142, name: 'WindowServer', user: '_windowserver', cpu: 4.8, memory: 382, threads: 9, isSystem: true },
  { pid: 210, name: 'coreaudiod', user: '_coreaudiod', cpu: 0.2, memory: 28.4, threads: 5, isSystem: true },
  { pid: 310, name: 'Finder', user: 'manish', cpu: 0.2, memory: 184, threads: 7, isSystem: true },
  { pid: 312, name: 'Dock', user: 'manish', cpu: 0.3, memory: 78.2, threads: 4, isSystem: true },
  { pid: 315, name: 'SystemUIServer', user: 'manish', cpu: 0.6, memory: 94.6, threads: 6, isSystem: true },
  { pid: 480, name: 'hald', user: 'root', cpu: 0.0, memory: 8.4, threads: 2, isSystem: true },
];

export const MonitorApp: React.FC = () => {
  const windows = useWindowStore((state) => state.windows);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const theme = useSystemStore((state) => state.theme);

  const [activeTab, setActiveTab] = useState<'cpu' | 'memory'>('cpu');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPid, setSelectedPid] = useState<number | null>(null);
  
  // Keep list of killed system processes to prevent them from showing
  const [killedPids, setKilledPids] = useState<number[]>([]);
  const [processes, setProcesses] = useState<ProcessItem[]>([]);

  const cpuCanvasRef = useRef<HTMLCanvasElement>(null);
  const cpuHistoryRef = useRef<number[]>(Array(50).fill(10)); // initial history array

  // Generate processes list dynamically by combining open windows and background tasks
  useEffect(() => {
    const runningApps: ProcessItem[] = Object.values(windows)
      .filter((win) => win.isOpen && !win.isMinimized)
      .map((win) => {
        // Deterministic PID mapping based on app id characters
        const charSum = win.id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0);
        const pid = 1000 + charSum;
        
        // Dynamic simulated resource calculations based on appId
        let baseCpu = 1.2;
        let baseMem = 120;
        let threads = 6;
        if (win.id === 'terminal') {
          baseCpu = 2.4;
          baseMem = 84;
          threads = 4;
        } else if (win.id === 'browser') {
          baseCpu = 6.2;
          baseMem = 480;
          threads = 24;
        } else if (win.id === 'monitor') {
          baseCpu = 4.5;
          baseMem = 145;
          threads = 8;
        }

        return {
          pid,
          name: win.title,
          user: 'manish',
          cpu: baseCpu,
          memory: baseMem,
          threads,
          appId: win.id,
        };
      });

    // Merge system processes (filtering out any currently "killed" ones)
    const activeSystemProcesses = INITIAL_SYSTEM_PROCESSES.filter(
      (p) => !killedPids.includes(p.pid)
    );

    setProcesses([...runningApps, ...activeSystemProcesses]);
  }, [windows, killedPids]);

  // Periodic resource jitter simulation to animate numbers
  useEffect(() => {
    const timer = setInterval(() => {
      setProcesses((prev) =>
        prev.map((proc) => {
          const jitterCpu = (Math.random() - 0.5) * 0.4;
          const jitterMem = (Math.random() - 0.5) * 1.5;
          
          let targetCpu = Math.max(0.0, proc.cpu + jitterCpu);
          let targetMem = Math.max(5.0, proc.memory + jitterMem);

          // Bound calculations for systems
          if (proc.name === 'kernel_task') {
            targetCpu = Math.max(1.0, Math.min(5.0, targetCpu));
          } else if (proc.name === 'WindowServer') {
            targetCpu = Math.max(3.0, Math.min(10.0, targetCpu));
          } else if (proc.appId === 'browser') {
            targetCpu = Math.max(2.0, Math.min(15.0, targetCpu));
          }

          return {
            ...proc,
            cpu: Number(targetCpu.toFixed(1)),
            memory: Number(targetMem.toFixed(1)),
          };
        })
      );
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  // Update CPU Load history and render to canvas
  useEffect(() => {
    const timer = setInterval(() => {
      // Calculate overall system CPU sum
      const totalCpu = processes.reduce((sum, p) => sum + p.cpu, 0);
      const scaledCpu = Math.min(100, Math.max(4, totalCpu));

      cpuHistoryRef.current.push(scaledCpu);
      if (cpuHistoryRef.current.length > 60) {
        cpuHistoryRef.current.shift();
      }

      const canvas = cpuCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          const w = canvas.width;
          const h = canvas.height;
          ctx.clearRect(0, 0, w, h);

          // Background Grid
          ctx.strokeStyle = theme === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)';
          ctx.lineWidth = 1;
          for (let x = 0; x < w; x += 15) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, h);
            ctx.stroke();
          }
          for (let y = 0; y < h; y += 12) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(w, y);
            ctx.stroke();
          }

          // Render History Curve
          const history = cpuHistoryRef.current;
          const step = w / (history.length - 1);
          
          ctx.beginPath();
          ctx.moveTo(0, h);

          for (let i = 0; i < history.length; i++) {
            const val = history[i];
            const xCoord = i * step;
            const yCoord = h - (val / 100) * (h - 4);
            ctx.lineTo(xCoord, yCoord);
          }

          ctx.lineTo(w, h);
          ctx.closePath();

          // Gradients fill
          const fillGrad = ctx.createLinearGradient(0, 0, 0, h);
          if (activeTab === 'cpu') {
            fillGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
            fillGrad.addColorStop(1, 'rgba(56, 189, 248, 0.0)');
            ctx.fillStyle = fillGrad;
            ctx.fill();

            // Stroke line
            ctx.strokeStyle = '#0ea5e9';
          } else {
            // Memory Pressure Green
            fillGrad.addColorStop(0, 'rgba(34, 197, 94, 0.45)');
            fillGrad.addColorStop(1, 'rgba(34, 197, 94, 0.0)');
            ctx.fillStyle = fillGrad;
            ctx.fill();

            // Stroke line
            ctx.strokeStyle = '#22c55e';
          }

          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let i = 0; i < history.length; i++) {
            const val = history[i];
            const xCoord = i * step;
            const yCoord = h - (val / 100) * (h - 4);
            if (i === 0) ctx.moveTo(xCoord, yCoord);
            else ctx.lineTo(xCoord, yCoord);
          }
          ctx.stroke();
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [processes, theme, activeTab]);

  const handleForceQuit = () => {
    if (selectedPid === null) return;
    const processToKill = processes.find((p) => p.pid === selectedPid);
    if (!processToKill) return;

    if (processToKill.appId) {
      // It's an active app window, close it!
      closeWindow(processToKill.appId);
    } else {
      // System process, temporarily kill it
      setKilledPids((prev) => [...prev, processToKill.pid]);
      
      // Auto restore it 4 seconds later (simulating launchd automatic daemon restart)
      setTimeout(() => {
        setKilledPids((prev) => prev.filter((p) => p !== processToKill.pid));
      }, 4000);
    }
    
    setSelectedPid(null);
  };

  const filteredProcesses = processes.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Totals calculations for bottom statistics
  const totalCpuLoad = Number(processes.reduce((sum, p) => sum + p.cpu, 0).toFixed(1));
  const totalMemLoad = Number((processes.reduce((sum, p) => sum + p.memory, 0) / 1024).toFixed(2));
  const totalThreads = processes.reduce((sum, p) => sum + p.threads, 0);

  return (
    <div className={`flex flex-col h-full select-none text-xs ${
      theme === 'light' ? 'bg-slate-50 text-slate-800' : 'bg-[#0b0f19] text-slate-200'
    }`}>
      {/* Activity Monitor Header Toolbar */}
      <div className={`flex items-center justify-between px-3 py-2 border-b ${
        theme === 'light' ? 'bg-slate-100/80 border-slate-200' : 'bg-slate-900/40 border-white/5'
      }`}>
        <div className="flex items-center space-x-1.5">
          {/* Force Quit Toolbar Action */}
          <button
            onClick={handleForceQuit}
            disabled={selectedPid === null}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
              selectedPid === null
                ? 'opacity-40 border-transparent cursor-not-allowed'
                : 'bg-red-500 hover:bg-red-600 text-white border-red-600 cursor-pointer shadow-sm active:scale-95'
            }`}
            title="Force Quit Selected Process"
          >
            <XOctagon size={12} />
            <span>Force Quit</span>
          </button>
        </div>

        {/* Tab Switcher Grid */}
        <div className={`flex p-0.5 rounded-lg border ${
          theme === 'light' ? 'bg-slate-200/50 border-slate-300/40' : 'bg-white/5 border-white/5'
        }`}>
          <button
            onClick={() => setActiveTab('cpu')}
            className={`px-3 py-1 rounded-md font-bold transition-all text-[10px] ${
              activeTab === 'cpu'
                ? 'bg-[#3c6eb4] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 cursor-pointer'
            }`}
          >
            CPU
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`px-3 py-1 rounded-md font-bold transition-all text-[10px] ${
              activeTab === 'memory'
                ? 'bg-[#3c6eb4] text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 cursor-pointer'
            }`}
          >
            System Memory
          </button>
        </div>

        {/* Filter Input */}
        <div className="relative flex items-center">
          <Search size={11} className="absolute left-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter processes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-7 pr-3 py-1 rounded-md text-[10px] w-40 focus:outline-none border transition-all ${
              theme === 'light'
                ? 'bg-white border-slate-300 text-slate-800 focus:border-[#3c6eb4]'
                : 'bg-slate-950/40 border-white/5 text-slate-200 focus:border-[#3c6eb4]'
            }`}
          />
        </div>
      </div>

      {/* Main Process Table Grid */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`sticky top-0 z-10 text-[10px] font-bold uppercase tracking-wider border-b select-none ${
              theme === 'light'
                ? 'bg-slate-200/60 border-slate-300 text-slate-500'
                : 'bg-slate-900/50 border-white/5 text-slate-400'
            }`}>
              <th className="py-2.5 pl-4 w-[35%]">Process Name</th>
              <th className="py-2.5 w-[13%]">% CPU</th>
              <th className="py-2.5 w-[15%]">{activeTab === 'cpu' ? 'Threads' : 'Memory'}</th>
              <th className="py-2.5 w-[12%]">PID</th>
              <th className="py-2.5 w-[15%]">User</th>
            </tr>
          </thead>
          <tbody>
            {filteredProcesses.length > 0 ? (
              filteredProcesses.map((proc) => {
                const isSelected = proc.pid === selectedPid;
                return (
                  <tr
                    key={proc.pid}
                    onClick={() => setSelectedPid(proc.pid)}
                    onDoubleClick={handleForceQuit}
                    className={`border-b text-[11px] cursor-pointer transition-colors ${
                      theme === 'light'
                        ? isSelected
                          ? 'bg-[#3c6eb4]/15 hover:bg-[#3c6eb4]/20 border-slate-200'
                          : 'hover:bg-slate-100/60 border-slate-200 text-slate-700'
                        : isSelected
                        ? 'bg-[#3c6eb4]/25 hover:bg-[#3c6eb4]/30 border-white/5'
                        : 'hover:bg-white/5 border-white/5 text-slate-300'
                    }`}
                  >
                    <td className="py-2 pl-4 font-semibold flex items-center space-x-2">
                      {proc.appId ? (
                        <AppIcon id={proc.appId} size={16} />
                      ) : (
                        <div className={`w-4 h-4 rounded flex items-center justify-center text-[8px] font-bold text-white shadow-sm bg-gradient-to-br ${
                          proc.name === 'kernel_task' ? 'from-zinc-500 to-zinc-700' : 'from-slate-500 to-slate-700'
                        }`}>
                          ⚙
                        </div>
                      )}
                      <span className="truncate">{proc.name}</span>
                    </td>
                    <td className="py-2 font-mono font-bold text-[#3c6eb4]">{proc.cpu}%</td>
                    <td className="py-2 font-mono font-medium">
                      {activeTab === 'cpu' ? proc.threads : `${proc.memory.toFixed(1)} MB`}
                    </td>
                    <td className="py-2 font-mono text-slate-400">{proc.pid}</td>
                    <td className="py-2 text-slate-400 font-semibold">{proc.user}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-12 text-slate-400">
                  No matching processes running
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Summary Graphs Area */}
      <div className={`p-4 border-t flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 z-0 select-none ${
        theme === 'light' ? 'bg-slate-100 border-slate-200' : 'bg-slate-950/40 border-white/5'
      }`}>
        
        {/* Left Side: Summary labels */}
        <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2 max-w-sm">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">System CPU Load</span>
            <span className="text-sm font-extrabold text-[#3c6eb4]">{totalCpuLoad}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Memory Occupancy</span>
            <span className="text-sm font-extrabold text-green-500">{totalMemLoad} GB / 64 GB</span>
          </div>
          <div className="flex flex-col mt-1">
            <span className="text-[10px] text-slate-400 font-bold">Total Daemons</span>
            <span className="text-xs font-semibold">{filteredProcesses.length} processes</span>
          </div>
          <div className="flex flex-col mt-1">
            <span className="text-[10px] text-slate-400 font-bold">Active Threads</span>
            <span className="text-xs font-semibold">{totalThreads} threads</span>
          </div>
        </div>

        {/* Right Side: Graph panel */}
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-bold uppercase mb-1.5">
            {activeTab === 'cpu' ? 'CPU Load History (Live)' : 'Memory Pressure History'}
          </span>
          <div className={`rounded-xl border p-1 shadow-inner overflow-hidden ${
            theme === 'light' ? 'bg-white border-slate-300' : 'bg-slate-950 border-white/5'
          }`}>
            <canvas
              ref={cpuCanvasRef}
              width={260}
              height={55}
              className="block"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default MonitorApp;
