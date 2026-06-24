import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useSystemStore } from '../store/useSystemStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Accessibility, Wifi, Volume2, Volume1, Volume, VolumeX, ChevronDown, Power } from 'lucide-react';
import { BatteryIcon } from './BatteryIcon';

const RescueConsole: React.FC<{
  onBootDefault: () => void;
  onReboot: () => void;
  onPoweroff: () => void;
}> = ({ onBootDefault, onReboot, onPoweroff }) => {
  const [history, setHistory] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState('');
  const consoleEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, loggedIn]);

  useEffect(() => {
    // Focus console input initially
    inputRef.current?.focus();

    // Auto-refocus on document click anywhere
    const handleGlobalClick = () => {
      inputRef.current?.focus();
    };

    // Exit to default on Ctrl+D
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'd' || e.key === 'D')) {
        e.preventDefault();
        setHistory(prev => [...prev, '^D', 'Resuming normal boot sequence...']);
        setTimeout(onBootDefault, 1000);
      }
    };

    document.addEventListener('click', handleGlobalClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onBootDefault]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputVal.trim();
    setInputVal('');

    if (!loggedIn) {
      setLoggedIn(true);
      setHistory(prev => [...prev, 'Password accepted. Welcome to root maintenance shell.']);
      return;
    }

    if (!cmd) return;
    setHistory(prev => [...prev, `[root@fedora ~]# ${cmd}`]);

    const parts = cmd.split(/\s+/);
    const baseCmd = parts[0].toLowerCase();

    if (baseCmd === 'exit') {
      setHistory(prev => [...prev, 'Resuming normal boot sequence...']);
      setTimeout(onBootDefault, 1000);
    } else if (baseCmd === 'reboot') {
      setHistory(prev => [...prev, 'Initiating system reboot...']);
      setTimeout(onReboot, 1000);
    } else if (baseCmd === 'poweroff' || baseCmd === 'halt') {
      setHistory(prev => [...prev, 'Shutting down system...']);
      setTimeout(onPoweroff, 1000);
    } else if (baseCmd === 'journalctl' && parts.includes('-xb')) {
      setHistory(prev => [
        ...prev,
        '-- Journal begins at Wed 2026-06-24 09:00:00 UTC --',
        '[  0.124] systemd[1]: Mounting /sys/kernel/debug...',
        '[  0.345] kernel: Emergency mode target initialized.',
        '[  0.512] udevd[42]: Failed to load kernel module metadata.',
        '[  0.890] systemd-fsck[110]: /dev/mapper/fedora-root is clean.',
        '-- End of emergency log output --'
      ]);
    } else if (baseCmd === 'help') {
      setHistory(prev => [
        ...prev,
        'Available commands:',
        '  help           - Show this help menu',
        '  exit           - Resume normal graphical boot loading',
        '  reboot         - Reboot the system',
        '  poweroff       - Halt/Shut down the system',
        '  journalctl -xb - Show system diagnostic emergency logs',
        '  ls [dir]       - List directory files (e.g. ls /etc)',
        '  cat <file>     - Display content of a file (e.g. cat /etc/fstab)',
        '  whoami         - Print current user name',
        '  pwd            - Print current directory path',
        '  uname -a       - Print system kernels and hardware specs',
        '  df -h          - Display disk usages',
        '  free -m        - Display physical memory metrics',
        '  clear          - Clear history console lines'
      ]);
    } else if (baseCmd === 'ls') {
      const arg = parts[1] || '';
      if (!arg || arg === '/' || arg === '/root') {
        setHistory(prev => [...prev, 'bin   boot  dev  etc  home  lib  lib64  mnt  opt  proc  root  run  sbin  sys  tmp  usr  var']);
      } else if (arg === '/etc') {
        setHistory(prev => [...prev, 'fstab  hostname  hosts  passwd  resolv.conf  systemd']);
      } else if (arg === '/home') {
        setHistory(prev => [...prev, 'manish']);
      } else {
        setHistory(prev => [...prev, `ls: cannot access '${parts[1]}': No such file or directory`]);
      }
    } else if (baseCmd === 'cat') {
      const arg = parts[1] || '';
      if (!arg) {
        setHistory(prev => [...prev, 'cat: missing file operand']);
      } else if (arg === '/etc/fstab') {
        setHistory(prev => [
          ...prev,
          '# /etc/fstab: static file system information.',
          '#',
          '# <file system>             <mount point>   <type>  <options>       <dump>  <pass>',
          '/dev/mapper/fedora-root     /               ext4    defaults,noatime  1       1',
          'UUID=A1B2-C3D4             /boot           vfat    defaults          1       2',
          '/dev/mapper/fedora-home     /home           ext4    defaults          1       2'
        ]);
      } else if (arg === '/etc/hostname') {
        setHistory(prev => [...prev, 'fedora']);
      } else if (arg === '/etc/hosts') {
        setHistory(prev => [
          ...prev,
          '127.0.0.1   localhost localhost.localdomain fedora',
          '::1         localhost localhost.localdomain fedora'
        ]);
      } else if (arg === '/etc/passwd') {
        setHistory(prev => [
          ...prev,
          'root:x:0:0:root:/root:/bin/bash',
          'manish:x:1000:1000:Manish:/home/manish:/bin/bash'
        ]);
      } else {
        setHistory(prev => [...prev, `cat: ${parts[1]}: No such file or directory`]);
      }
    } else if (baseCmd === 'whoami') {
      setHistory(prev => [...prev, 'root']);
    } else if (baseCmd === 'pwd') {
      setHistory(prev => [...prev, '/root']);
    } else if (baseCmd === 'uname') {
      if (parts.includes('-a') || parts.includes('-r')) {
        setHistory(prev => [...prev, 'Linux fedora 6.8.5-300.fc40.x86_64 #1 SMP Rescue x86_64 GNU/Linux']);
      } else {
        setHistory(prev => [...prev, 'Linux']);
      }
    } else if (baseCmd === 'df') {
      setHistory(prev => [
        ...prev,
        'Filesystem               Size  Used  Avail Use% Mounted on',
        'devtmpfs                 4.0M     0   4.0M   0% /dev',
        'tmpfs                     32G     0    32G   0% /dev/shm',
        '/dev/mapper/fedora-root  1.8T  240G   1.5T  14% /',
        '/dev/sda1                2.0G  180M   1.7G  10% /boot',
        '/dev/mapper/fedora-home  3.6T  1.2T   2.2T  36% /home'
      ]);
    } else if (baseCmd === 'free') {
      setHistory(prev => [
        ...prev,
        '               total        used        free      shared  buff/cache   available',
        'Mem:           64320        2120       45800         124       16400       61800',
        'Swap:           8192           0        8192'
      ]);
    } else if (baseCmd === 'clear') {
      setHistory([]);
      return;
    } else if (baseCmd === 'systemctl') {
      const action = (parts[1] || '').toLowerCase();
      if (action === 'default') {
        setHistory(prev => [...prev, 'Resuming normal boot sequence...']);
        setTimeout(onBootDefault, 1000);
      } else if (action === 'reboot') {
        setHistory(prev => [...prev, 'Initiating system reboot...']);
        setTimeout(onReboot, 1000);
      } else if (action === 'poweroff' || action === 'halt') {
        setHistory(prev => [...prev, 'Shutting down system...']);
        setTimeout(onPoweroff, 1000);
      } else if (action === 'list-units' || action === 'status') {
        setHistory(prev => [
          ...prev,
          'System is running in emergency mode.',
          'Type "journalctl -xb" to view system logs.'
        ]);
      } else {
        setHistory(prev => [...prev, `systemctl: command option '${parts[1]}' is not supported in minimal emergency shell.`]);
      }
    } else {
      setHistory(prev => [...prev, `bash: ${cmd}: command not found. Type "help" for a list of valid commands.`]);
    }
  };

  return (
    <div className="flex-grow flex flex-col justify-start mt-4 overflow-y-auto max-h-[70vh]">
      <div className="space-y-1">
        {history.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap">{line}</div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="flex items-center mt-2">
        <span className="text-emerald-400 font-bold mr-1.5">{loggedIn ? '[root@fedora ~]#' : '(or press Enter to log in as root):'}</span>
        <input 
          ref={inputRef}
          type={loggedIn ? "text" : "password"}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="bg-transparent border-none outline-none text-white flex-1 font-mono text-xs focus:ring-0"
          autoFocus
          placeholder={loggedIn ? "Type command (e.g. help)" : "Password"}
        />
      </form>
      <div ref={consoleEndRef} />
    </div>
  );
};

export const BootScreen: React.FC = () => {
  const bootState = useSystemStore((state) => state.bootState);
  const setBootState = useSystemStore((state) => state.setBootState);
  const theme = useSystemStore((state) => state.theme);
  const wallpaper = useSystemStore((state) => state.wallpaper);
  const volume = useSystemStore((state) => state.volume);
  const setVolume = useSystemStore((state) => state.setVolume);
  const battery = useSystemStore((state) => state.battery);
  const setBattery = useSystemStore((state) => state.setBattery);
  
  const secureBoot = useSystemStore((state) => state.secureBoot);
  const setSecureBoot = useSystemStore((state) => state.setSecureBoot);
  const fastBoot = useSystemStore((state) => state.fastBoot);
  const setFastBoot = useSystemStore((state) => state.setFastBoot);
  const bootOrder = useSystemStore((state) => state.bootOrder);
  const setBootOrder = useSystemStore((state) => state.setBootOrder);

  const getVolumeIcon = (val: number, size: number, className?: string) => {
    if (val === 0) return <VolumeX size={size} className={className} />;
    if (val <= 33) return <Volume size={size} className={className} />;
    if (val <= 66) return <Volume1 size={size} className={className} />;
    return <Volume2 size={size} className={className} />;
  };
  
  const [logLines, setLogLines] = useState<string[]>([]);
  const [grubIndex, setGrubIndex] = useState(0);
  const [grubTimer, setGrubTimer] = useState(5);
  const [rescueMode, setRescueMode] = useState(false);
  
  const [isPowerMenuOpen, setIsPowerMenuOpen] = useState(false);
  const [isAccessMenuOpen, setIsAccessMenuOpen] = useState(false);
  const [isPoweringOn, setIsPoweringOn] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);

  // UEFI BIOS Setup Utility local states
  const [tempSecureBoot, setTempSecureBoot] = useState(secureBoot);
  const [tempFastBoot, setTempFastBoot] = useState(fastBoot);
  const [tempBootOrder, setTempBootOrder] = useState([...bootOrder]);
  const [tempSataMode, setTempSataMode] = useState('AHCI');
  const [tempVtx, setTempVtx] = useState(true);
  const [tempUsbLegacy, setTempUsbLegacy] = useState(true);
  const [tempLan, setTempLan] = useState(true);

  const [activeTab, setActiveTab] = useState(0); // 0: Main, 1: Advanced, 2: Security, 3: Boot, 4: Exit
  const [selectedRow, setSelectedRow] = useState(0);
  const [bootOrderPromptOpen, setBootOrderPromptOpen] = useState(false);
  const [bootPromptIndex, setBootPromptIndex] = useState(0);

  const [bsodProgress, setBsodProgress] = useState(0);

  const tabRowsCount = [8, 4, 3, 3, 3];
  const bootOptions = ['Fedora Workstation', 'Windows Boot Manager'];

  // Sync temp configuration when entering UEFI setup
  useEffect(() => {
    if (bootState === 'uefi') {
      setTempSecureBoot(secureBoot);
      setTempFastBoot(fastBoot);
      setTempBootOrder([...bootOrder]);
      setActiveTab(0);
      setSelectedRow(0);
      setBootOrderPromptOpen(false);
    }
  }, [bootState, secureBoot, fastBoot, bootOrder]);

  // Windows Booting countdown
  useEffect(() => {
    if (bootState !== 'windows_booting') return;

    const timer = setTimeout(() => {
      setBootState('windows_bsod');
    }, 3000);

    return () => clearTimeout(timer);
  }, [bootState, setBootState]);

  // Windows BSOD Progress & Reset timer
  useEffect(() => {
    if (bootState !== 'windows_bsod') return;

    setBsodProgress(0);
    const progressInterval = setInterval(() => {
      setBsodProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25 + 10);
      });
    }, 800);

    const timer = setTimeout(() => {
      setBootState('bios');
    }, 6500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timer);
    };
  }, [bootState, setBootState]);

  // UEFI Keyboard Navigation
  useEffect(() => {
    if (bootState !== 'uefi') return;
    if (bootOrderPromptOpen) return;

    const handleUefiKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', 'Escape', 'F10', 'f10'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft') {
        setActiveTab((prev) => (prev === 0 ? 4 : prev - 1));
        setSelectedRow(0);
      } else if (e.key === 'ArrowRight') {
        setActiveTab((prev) => (prev === 4 ? 0 : prev + 1));
        setSelectedRow(0);
      } else if (e.key === 'ArrowUp') {
        setSelectedRow((prev) => {
          const maxRows = tabRowsCount[activeTab];
          return prev === 0 ? maxRows - 1 : prev - 1;
        });
      } else if (e.key === 'ArrowDown') {
        setSelectedRow((prev) => {
          const maxRows = tabRowsCount[activeTab];
          return prev === maxRows - 1 ? 0 : prev + 1;
        });
      } else if (e.key === 'Enter') {
        if (activeTab === 1) {
          if (selectedRow === 0) setTempSataMode(prev => prev === 'AHCI' ? 'RAID' : 'AHCI');
          if (selectedRow === 1) setTempVtx(prev => !prev);
          if (selectedRow === 2) setTempUsbLegacy(prev => !prev);
          if (selectedRow === 3) setTempLan(prev => !prev);
        } else if (activeTab === 2 && selectedRow === 2) {
          setTempSecureBoot((prev) => !prev);
        } else if (activeTab === 3) {
          if (selectedRow === 0) setTempFastBoot((prev) => !prev);
          if (selectedRow === 1 || selectedRow === 2) {
            setBootPromptIndex(tempBootOrder[selectedRow - 1] === 'Fedora Workstation' ? 0 : 1);
            setBootOrderPromptOpen(true);
          }
        } else if (activeTab === 4) {
          if (selectedRow === 0) {
            setSecureBoot(tempSecureBoot);
            setFastBoot(tempFastBoot);
            setBootOrder(tempBootOrder);
            setBootState('bios');
          } else if (selectedRow === 1) {
            setBootState('grub');
          } else if (selectedRow === 2) {
            setTempSecureBoot(true);
            setTempFastBoot(false);
            setTempBootOrder(['Fedora Workstation', 'Windows Boot Manager']);
          }
        }
      } else if (e.key === 'Escape') {
        setBootState('grub');
      } else if (e.key === 'F10' || e.key === 'f10') {
        setSecureBoot(tempSecureBoot);
        setFastBoot(tempFastBoot);
        setBootOrder(tempBootOrder);
        setBootState('bios');
      }
    };

    window.addEventListener('keydown', handleUefiKeyDown);
    return () => window.removeEventListener('keydown', handleUefiKeyDown);
  }, [bootState, activeTab, selectedRow, bootOrderPromptOpen, tempSecureBoot, tempFastBoot, tempBootOrder]);

  // Dialog KeyDown for boot option prompt
  useEffect(() => {
    if (!bootOrderPromptOpen) return;

    const handlePromptKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        setBootPromptIndex((prev) => (prev === 0 ? 1 : 0));
      } else if (e.key === 'Enter') {
        const selectedOS = bootOptions[bootPromptIndex];
        const otherOS = bootOptions[bootPromptIndex === 0 ? 1 : 0];
        if (selectedRow === 1) {
          setTempBootOrder([selectedOS, otherOS]);
        } else {
          setTempBootOrder([otherOS, selectedOS]);
        }
        setBootOrderPromptOpen(false);
      } else if (e.key === 'Escape') {
        setBootOrderPromptOpen(false);
      }
    };

    window.addEventListener('keydown', handlePromptKeyDown);
    return () => window.removeEventListener('keydown', handlePromptKeyDown);
  }, [bootOrderPromptOpen, bootPromptIndex, selectedRow]);

  const getItemDescription = () => {
    if (activeTab === 0) {
      return 'System date and time specifications, processor info, and memory diagnostics. These parameters are read directly from motherboard RTC and memory profiles.';
    }
    if (activeTab === 1) {
      if (selectedRow === 0) return 'Configures the Serial ATA drive controller mode. AHCI provides native command queuing and hot-plugging features.';
      if (selectedRow === 1) return 'Enables or disables Intel Virtualization Technology (VT-x). Allows a platform to run multiple operating systems in independent partitions.';
      if (selectedRow === 2) return 'Enables support for legacy USB keyboards and mouse devices in DOS/UEFI modes.';
      return 'Enables or disables the integrated onboard Gigabit Ethernet controller.';
    }
    if (activeTab === 2) {
      if (selectedRow === 0) return 'Sets the administrator password for accessing the UEFI Setup Utility. Currently empty.';
      if (selectedRow === 1) return 'Sets the user password for booting the system. Currently empty.';
      return 'Configures Secure Boot policy. Enabled: bootloader files must be cryptographically signed by verified authorities. Disabled: permits booting unsigned kernels.';
    }
    if (activeTab === 3) {
      if (selectedRow === 0) return 'Bypasses full POST diagnostic self-checks and accelerates the verbose boot loading logs to minimize overall startup latency.';
      if (selectedRow === 1) return 'Sets the primary boot loader target. Select "Fedora Workstation" to launch GRUB, or "Windows Boot Manager" to launch Windows.';
      return 'Sets the secondary fallback boot loader target.';
    }
    if (activeTab === 4) {
      if (selectedRow === 0) return 'Saves all changes made in setup options to non-volatile memory (NVRAM) and performs a clean hardware reset.';
      if (selectedRow === 1) return 'Aborts current configurations and exits the setup utility, returning directly to the boot loader menu.';
      return 'Loads default optimized motherboard parameters for stable operations.';
    }
    return '';
  };

  const renderBiosRow = (rowIdx: number, label: string, value: string) => {
    const isSelected = selectedRow === rowIdx;
    let isInteractive = false;
    if (activeTab === 1) isInteractive = true;
    if (activeTab === 2 && rowIdx === 2) isInteractive = true;
    if (activeTab === 3) isInteractive = true;
    if (activeTab === 4) isInteractive = true;

    return (
      <div
        onClick={() => {
          setSelectedRow(rowIdx);
          if (isInteractive) {
            if (activeTab === 1) {
              if (rowIdx === 0) setTempSataMode(prev => prev === 'AHCI' ? 'RAID' : 'AHCI');
              if (rowIdx === 1) setTempVtx(prev => !prev);
              if (rowIdx === 2) setTempUsbLegacy(prev => !prev);
              if (rowIdx === 3) setTempLan(prev => !prev);
            } else if (activeTab === 2 && rowIdx === 2) {
              setTempSecureBoot(prev => !prev);
            } else if (activeTab === 3) {
              if (rowIdx === 0) setTempFastBoot(prev => !prev);
              if (rowIdx === 1 || rowIdx === 2) {
                setBootPromptIndex(tempBootOrder[rowIdx - 1] === 'Fedora Workstation' ? 0 : 1);
                setBootOrderPromptOpen(true);
              }
            } else if (activeTab === 4) {
              if (rowIdx === 0) {
                setSecureBoot(tempSecureBoot);
                setFastBoot(tempFastBoot);
                setBootOrder(tempBootOrder);
                setBootState('bios');
              } else if (rowIdx === 1) {
                setBootState('grub');
              } else if (rowIdx === 2) {
                setTempSecureBoot(true);
                setTempFastBoot(false);
                setTempBootOrder(['Fedora Workstation', 'Windows Boot Manager']);
              }
            }
          }
        }}
        className={`flex justify-between items-center px-2 py-0.5 cursor-pointer font-bold ${
          isSelected ? 'bg-[#ffff55] text-black font-extrabold' : 'text-[#ffffff]'
        }`}
      >
        <span>{label}</span>
        <span className={isSelected ? 'text-black' : 'text-[#55ffff]'}>{value}</span>
      </div>
    );
  };

  // Wake up from suspend state on click or keydown
  useEffect(() => {
    if (!isSuspended) return;
    
    const handleWakeUp = () => {
      setIsSuspended(false);
    };

    window.addEventListener('click', handleWakeUp);
    window.addEventListener('keydown', handleWakeUp);

    return () => {
      window.removeEventListener('click', handleWakeUp);
      window.removeEventListener('keydown', handleWakeUp);
    };
  }, [isSuspended]);

  const handlePowerClick = useCallback(() => {
    if (isPoweringOn) return;
    
    setIsPoweringOn(true);
    
    setTimeout(() => {
      setBootState('bios');
      setIsPoweringOn(false);
    }, 1500);
  }, [isPoweringOn, setBootState]);


  const highContrast = useSystemStore((state) => state.highContrast);
  const setHighContrast = useSystemStore((state) => state.setHighContrast);
  const screenReader = useSystemStore((state) => state.screenReader);
  const setScreenReader = useSystemStore((state) => state.setScreenReader);
  const largeText = useSystemStore((state) => state.largeText);
  const setLargeText = useSystemStore((state) => state.setLargeText);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const logsEndRef = useRef<HTMLDivElement>(null);
  const powerMenuRef = useRef<HTMLDivElement>(null);
  const accessMenuRef = useRef<HTMLDivElement>(null);

  // Close login dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (isPowerMenuOpen && powerMenuRef.current && !powerMenuRef.current.contains(e.target as Node)) {
        setIsPowerMenuOpen(false);
      }
      if (isAccessMenuOpen && accessMenuRef.current && !accessMenuRef.current.contains(e.target as Node)) {
        setIsAccessMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isPowerMenuOpen, isAccessMenuOpen]);

  const executeGrubSelection = useCallback((index: number) => {
    if (index === 0) {
      setRescueMode(false);
      setBootState('booting');
    } else if (index === 1) {
      setRescueMode(true);
      setBootState('booting');
    } else if (index === 2) {
      setBootState('uefi');
    }
  }, [setBootState]);

  // BIOS screen timeline
  useEffect(() => {
    if (bootState === 'bios') {
      setTimeout(() => {
        setLogLines([]);
        setRescueMode(false);
        setGrubTimer(5);
      }, 0);
      const duration = fastBoot ? 500 : 2000;
      const timer = setTimeout(() => {
        if (bootOrder[0] === 'Windows Boot Manager') {
          setBootState('windows_booting');
        } else {
          setBootState('grub');
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [bootState, setBootState, fastBoot, bootOrder]);

  // GRUB timer countdown
  useEffect(() => {
    if (bootState !== 'grub') return;
    
    const interval = setInterval(() => {
      setGrubTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          // Auto boot default kernel
          setRescueMode(false);
          setBootState('booting');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [bootState, setBootState]);

  // GRUB keyboard navigation
  useEffect(() => {
    if (bootState !== 'grub') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setGrubIndex((prev) => (prev === 0 ? 2 : prev - 1));
        setGrubTimer(99); // Reset/disable countdown once user interacts
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setGrubIndex((prev) => (prev === 2 ? 0 : prev + 1));
        setGrubTimer(99); // Reset/disable countdown once user interacts
      } else if (e.key === 'Enter') {
        e.preventDefault();
        executeGrubSelection(grubIndex);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [bootState, grubIndex, executeGrubSelection]);

  // Handle enter key globally on login screen to unlock
  useEffect(() => {
    if (bootState !== 'login') return;

    const handleLoginKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        const activeElement = document.activeElement;
        
        // If an element other than the body is focused, check if it's outside the password submission form
        if (activeElement && activeElement !== document.body) {
          const isInput = activeElement.tagName === 'INPUT';
          const isFormBtn = activeElement.closest('form');
          
          // If the focused element is NOT the password input or a form button, return and let its own key handler execute
          if (!isInput && !isFormBtn) {
            return;
          }
        }

        e.preventDefault();
        try {
          document.documentElement.requestFullscreen().catch(() => {});
        } catch (err) {}
        setBootState('desktop');
      }
    };

    window.addEventListener('keydown', handleLoginKeyDown);
    return () => window.removeEventListener('keydown', handleLoginKeyDown);
  }, [bootState, setBootState]);

  // systemd verbose logging animation
  useEffect(() => {
    if (bootState !== 'booting') return;

    const normalLogs = [
      '[    0.000000] Linux version 6.8.9-300.fc40.x86_64 (mock-builder@fedora) (gcc version 14.0.1) #1 SMP PREEMPT_DYNAMIC',
      '[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-6.8.9-300.fc40.x86_64 root=/dev/mapper/fedora-root ro rd.lvm.lv=fedora/root rhgb quiet',
      `[    0.021034] Secure boot ${secureBoot ? 'enabled' : 'disabled'}`,
      '[    0.143210] smpboot: CPU0: Intel(R) Core(TM) i9-14900K (family: 0x6, model: 0xb7)',
      '[    0.341029] ACPI: Core revision 20230628',
      '[    0.893121] systemd[1]: Inserted module \'autofs4\'',
      '[    1.002934] systemd[1]: systemd 255.4-1.fc40 running in system mode (+PAM +AUDIT +SELINUX +APPARMOR +GLIB...)',
      '[  OK  ] Created slice User and Session Slice.',
      '[  OK  ] Started Dispatch Password Requests to Console Directory Watch.',
      '[  OK  ] Started Forward Password Requests to Wall Directory Watch.',
      '[ INFO ] Mounting local file systems...',
      '[  OK  ] Reached target Local Integrity Protected Volumes.',
      '[  OK  ] Started Firewalld - Dynamic Firewall Daemon.',
      '[  OK  ] Started Load Kernel Modules.',
      '[  OK  ] Started Create Static Device Nodes in /dev.',
      '[ INFO ] Loading network configuration profiles.',
      '[  OK  ] Reached target Preparation for Local File Systems.',
      '[  OK  ] Started File System Check on /dev/mapper/fedora-root.',
      '[  OK  ] Mounted /boot.',
      '[  OK  ] Reached target Local File Systems.',
      '[  OK  ] Started Create Volatile Files and Directories.',
      '[  OK  ] Started Network Name Resolution.',
      '[  OK  ] Started System Security Services Daemon.',
      '[  OK  ] Started Accounts Service.',
      '[  OK  ] Started User Login Management.',
      '[  OK  ] Started GNOME Display Manager.',
      '[  OK  ] Reached target Graphical Interface.'
    ];

    const rescueLogs = [
      '[    0.000000] Linux version 6.8.5-300.fc40.x86_64 (rescue-mode-builder@fedora) (gcc version 14.0.1) #1 SMP Rescue',
      '[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-6.8.5-300.fc40.x86_64 root=/dev/mapper/fedora-root ro single',
      `[    0.021034] Secure boot ${secureBoot ? 'enabled' : 'disabled'}`,
      '[    0.143210] smpboot: CPU0: Intel(R) Core(TM) i9-14900K (family: 0x6, model: 0xb7)',
      '[    0.551029] systemd[1]: Running in rescue mode.',
      '[ INFO ] Loading emergency shell services...',
      '[  OK  ] Started Emergency Shell Service.',
      '[  OK  ] Mounted debugfs on /sys/kernel/debug.',
      '[  OK  ] Started Journal Service.',
      '[ INFO ] Bypassing display managers to initialize maintenance console.',
      '[  OK  ] Reached target Emergency Mode.'
    ];

    const targetLogs = rescueMode ? rescueLogs : normalLogs;
    let i = 0;
    const speed = fastBoot ? 20 : 100;
    const interval = setInterval(() => {
      if (i < targetLogs.length) {
        const nextLine = targetLogs[i];
        setLogLines((prev) => [...prev, nextLine]);
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (rescueMode) {
            setBootState('rescue_shell');
          } else {
            setBootState('login');
          }
        }, 800);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [bootState, rescueMode, setBootState, secureBoot, fastBoot]);

  // Scroll to bottom on logging
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logLines]);

  const renderLogLine = (line: string) => {
    if (line.startsWith('[  OK  ]')) {
      return (
        <div className="flex space-x-2.5">
          <span className="text-[#00ff00] font-bold">[  OK  ]</span>
          <span className="text-gray-200">{line.substring(8)}</span>
        </div>
      );
    } else if (line.startsWith('[ INFO ]')) {
      return (
        <div className="flex space-x-2.5">
          <span className="text-sky-400 font-bold">[ INFO ]</span>
          <span className="text-slate-300">{line.substring(8)}</span>
        </div>
      );
    }
    return <div className="text-zinc-500">{line}</div>;
  };

  if (bootState === 'desktop') return null;

  return (
    <AnimatePresence mode="wait">
      {/* 0. Powered Off State with Central Glowing Power Button */}
      {bootState === 'off' && (
        <motion.div
          key="off"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 bg-[#030508] flex flex-col justify-center items-center z-[100] font-sans select-none overflow-hidden"
        >
          {/* CRT Monitor Flare Turn-On Animation Effect */}
          {isPoweringOn && (
            <motion.div
              initial={{ scaleY: 0.002, scaleX: 0, opacity: 0.8 }}
              animate={{ 
                scaleX: [0, 1.3, 1], 
                scaleY: [0.002, 0.002, 1],
                opacity: [0.8, 1, 0] 
              }}
              transition={{ duration: 1.4, times: [0, 0.35, 1], ease: "easeInOut" }}
              className="absolute inset-0 bg-sky-100 z-[120] pointer-events-none"
            />
          )}

          {/* Deep ambient glowing background */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-600/10 via-indigo-600/5 to-transparent blur-[150px] pointer-events-none animate-pulse duration-[8000ms]" />

          {/* Minimalist Grid Pattern for subtle texture */}
          <div 
            className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px]" 
          />

          {/* Power Button Container */}
          <motion.div
            animate={isPoweringOn ? { scale: [1, 0.92, 1.15], opacity: 0 } : {}}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="flex flex-col items-center space-y-8 z-10"
          >
            {/* Pulsing Outer Ring */}
            <div className="relative flex items-center justify-center">
              <motion.div 
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute w-36 h-36 rounded-full border border-blue-500/15 bg-blue-500/[0.01] blur-md pointer-events-none"
              />
              <motion.div 
                animate={{ scale: [1, 1.16, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                className="absolute w-44 h-44 rounded-full border border-indigo-500/10 pointer-events-none"
              />
              
              {/* Actual Button */}
              <motion.button
                onClick={handlePowerClick}
                disabled={isPoweringOn}
                whileHover={{ 
                  scale: 1.04, 
                  boxShadow: "0 0 50px rgba(59, 130, 246, 0.45)",
                  borderColor: "rgba(59, 130, 246, 0.6)" 
                }}
                whileTap={{ scale: 0.96 }}
                className="relative w-28 h-28 rounded-full bg-zinc-950/80 border-2 border-zinc-800 shadow-[0_0_30px_rgba(59,130,246,0.08)] flex items-center justify-center cursor-pointer transition-colors duration-300 group overflow-hidden"
              >
                {/* 3D Sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/[0.03] to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                
                {/* Inner Bezel */}
                <div className="absolute inset-[6px] rounded-full bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/40 flex items-center justify-center shadow-inner">
                  {/* Glowing Active indicator */}
                  <span className="absolute w-1.5 h-1.5 rounded-full bg-blue-400 top-4 opacity-75 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
                  
                  <Power 
                    size={38} 
                    className={`transition-all duration-700 ${
                      isPoweringOn 
                        ? 'text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.95)]' 
                        : 'text-zinc-600 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]'
                    }`} 
                  />
                </div>
              </motion.button>
            </div>

            {/* Typography Labels */}
            <div className="flex flex-col items-center space-y-3 text-center">
              <h1 className="text-xs font-bold tracking-[0.25em] text-zinc-500 uppercase select-none font-mono">
                {isPoweringOn ? "Initializing Boot Sequence" : "System Status: Standby"}
              </h1>
              <p className="text-[10px] text-zinc-600 tracking-widest font-mono">
                {isPoweringOn ? "Entering Fullscreen Environment..." : "Press Power Button to Start Web Simulation"}
              </p>
              

            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 1. UEFI BIOS POST Screen */}
      {bootState === 'bios' && (
        <motion.div
          key="bios"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black text-gray-300 font-mono p-8 flex flex-col z-[100] select-none"
        >
          <div className="mb-8 flex items-end">
             <div className="text-4xl font-bold mr-4 text-blue-500">GIGABYTE</div>
             <div className="text-xl">UEFI DualBIOS™</div>
          </div>
          <div className="space-y-1 text-sm text-zinc-400">
            <div>Main Processor: Intel(R) Core(TM) i9-14900K CPU @ 3.20GHz</div>
            <div>Main Memory: 65536MB OK (DDR5 Dual Channel)</div>
            <div>Detecting SATA/NVMe drives...</div>
            <div className="pl-4 text-zinc-500">Port 0: M.2 NVMe SSD 2TB OK</div>
            <div className="pl-4 text-zinc-500">Port 1: SATA HDD 4TB OK</div>
            <div className="mt-4">Secure Boot Status: Enabled</div>
          </div>
          <div className="mt-auto self-end text-xs text-zinc-600">Press [DEL] to enter UEFI BIOS SETUP</div>
        </motion.div>
      )}

      {/* 2. Interactive GNU GRUB Boot Menu */}
      {bootState === 'grub' && (
        <motion.div
          key="grub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black text-[#dedede] font-mono p-8 z-[100] flex flex-col select-none justify-between"
        >
          {/* GRUB Version Header */}
          <div className="text-center text-sm mb-4">
            GNU GRUB  version 2.06
          </div>

          {/* Interactive Menu Options Box */}
          <div className="flex-1 flex flex-col justify-center max-w-3xl w-full mx-auto">
            <div className="text-xs text-gray-400 mb-2 leading-relaxed">
              Use the ↑ and ↓ keys to select which entry is highlighted. Press enter to boot the selected OS, 'e' to edit the commands before booting or 'c' for a command-line.
            </div>
            
            {/* Outline list border */}
            <div className="border border-zinc-400/50 p-4 rounded-sm flex flex-col space-y-1.5 min-h-[120px]">
              {[
                'Fedora Workstation (6.8.9-300.fc40.x86_64)',
                'Fedora Workstation (6.8.5-300.fc40.x86_64) (Rescue Mode)',
                'UEFI Firmware Settings'
              ].map((option, idx) => {
                const isSelected = grubIndex === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => {
                      setGrubIndex(idx);
                      setGrubTimer(99); // stop countdown on hover/click
                    }}
                    onDoubleClick={() => executeGrubSelection(idx)}
                    className={`px-3 py-1 cursor-pointer text-sm font-semibold rounded-xs transition-colors ${
                      isSelected 
                        ? 'bg-zinc-200 text-black font-bold' 
                        : 'text-zinc-300 hover:bg-zinc-800/40'
                    }`}
                  >
                    {isSelected ? '* ' : '  '}
                    {option}
                  </div>
                );
              })}
            </div>
          </div>

          {/* GRUB Footer countdown */}
          <div className="text-center text-xs mt-6 text-zinc-400 min-h-[20px]">
            {grubTimer <= 5 ? (
              <span>The highlighted entry will be executed automatically in {grubTimer}s.</span>
            ) : (
              <span>Press enter to boot the highlighted entry.</span>
            )}
          </div>
        </motion.div>
      )}

      {/* 3. Detailed systemd Initialization Logs */}
      {bootState === 'booting' && (
        <motion.div
          key="booting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black text-slate-100 font-mono p-6 z-[100] overflow-y-auto flex flex-col justify-start select-none text-xs leading-5"
        >
          <div className="space-y-0.5">
            {logLines.map((line, idx) => (
              <React.Fragment key={idx}>
                {renderLogLine(line)}
              </React.Fragment>
            ))}
            <div ref={logsEndRef} />
          </div>
        </motion.div>
      )}

      {/* 4. GDM Login Screen */}
      {bootState === 'login' && (
        <motion.div
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`fixed inset-0 bg-cover bg-center z-[100] flex flex-col justify-between items-center py-10 select-none font-sans transition-colors duration-300 ${
            theme === 'light' ? 'text-slate-800' : 'text-white'
          }`}
          style={{ backgroundImage: `url(${wallpaper})` }}
        >
          {/* Blur Overlay */}
          <div className={`absolute inset-0 z-0 transition-all duration-300 ${
            highContrast 
              ? 'bg-black/95' 
              : theme === 'light'
              ? 'bg-white/20 backdrop-blur-[35px]'
              : 'bg-black/40 backdrop-blur-[35px]'
          }`} />

          {/* GNOME Top Bar for GDM Login Screen */}
          <div className={`absolute top-0 left-0 right-0 text-xs font-semibold flex justify-between items-center px-4 select-none z-[110] transition-all ${
            largeText ? 'h-10 text-sm' : 'h-8 text-xs'
          } ${
            highContrast 
              ? 'bg-black border-b border-white text-white font-bold' 
              : theme === 'light'
              ? 'bg-white/15 border-b border-black/5 text-slate-800'
              : 'bg-black/25 text-[#dedede]'
          }`}>
            <div></div>
            {/* Center clock and date */}
            <div className={`font-medium tracking-wide flex items-center space-x-1.5 opacity-95 ${
              theme === 'light' ? 'text-slate-850' : 'text-white'
            }`}>
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              <span className="opacity-40">•</span>
              <span>{new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
            
            {/* Right: accessibility and unified power menu dropdowns */}
            <div className={`flex items-center space-x-3 relative ${
              theme === 'light' ? 'text-slate-700' : 'text-white/80'
            }`}>
              <button 
                onClick={() => {
                  setIsAccessMenuOpen(!isAccessMenuOpen);
                  setIsPowerMenuOpen(false);
                  if (screenReader) speakText("Accessibility Menu opened");
                }}
                className={`w-7 h-7 flex items-center justify-center cursor-pointer transition-all duration-200 shadow-md backdrop-blur-md rounded-full ${
                  theme === 'light'
                    ? isAccessMenuOpen 
                      ? 'bg-black/10 border border-black/15 text-slate-900 font-bold' 
                      : 'bg-black/5 border border-black/10 hover:bg-black/10 text-slate-800'
                    : isAccessMenuOpen 
                      ? 'liquid-glass-pill text-white font-bold' 
                      : 'bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/20 text-white/80'
                }`}
                title="Accessibility Options"
              >
                <Accessibility size={13} className="opacity-95" />
              </button>
              <div 
                tabIndex={0}
                onClick={() => {
                  setIsPowerMenuOpen(!isPowerMenuOpen);
                  setIsAccessMenuOpen(false);
                  if (screenReader) speakText("System Power Status Menu opened");
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsPowerMenuOpen(!isPowerMenuOpen);
                    setIsAccessMenuOpen(false);
                    if (screenReader && !isPowerMenuOpen) speakText("System Power Status Menu opened");
                  }
                }}
                className={`px-3 py-1.5 rounded-full flex items-center space-x-1.5 cursor-pointer transition-all duration-200 shadow-md backdrop-blur-md focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                  theme === 'light'
                    ? isPowerMenuOpen
                      ? 'bg-black/10 border border-black/15 text-slate-900 font-bold'
                      : 'bg-black/5 border border-black/10 hover:bg-black/10 text-slate-800'
                    : isPowerMenuOpen
                      ? 'liquid-glass-pill text-white font-bold'
                      : 'bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/20 text-white/80'
                }`}
                title="System Status & Power"
              >
                <span className={`p-1 border rounded-md flex items-center justify-center backdrop-blur-[2px] ${
                  theme === 'light'
                    ? 'bg-black/5 border-black/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]'
                    : 'bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                }`}>
                  <Wifi size={11.5} className="opacity-90" />
                </span>
                <span className={`p-1 border rounded-md flex items-center justify-center backdrop-blur-[2px] ${
                  theme === 'light'
                    ? 'bg-black/5 border-black/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]'
                    : 'bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                }`}>
                  {getVolumeIcon(volume, 11.5, "opacity-90")}
                </span>
                <span className={`p-1 border rounded-md flex items-center justify-center backdrop-blur-[2px] ${
                  theme === 'light'
                    ? 'bg-black/5 border-black/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]'
                    : 'bg-white/5 border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]'
                }`}>
                  <BatteryIcon percentage={battery} size={12.5} className={`transition-colors duration-200 ${battery > 20 ? 'text-green-400' : 'text-red-500'}`} />
                </span>
                <ChevronDown size={10} className="opacity-75" />
              </div>
              
              {/* Accessibility Dropdown menu */}
              {isAccessMenuOpen && (
                <div 
                  ref={accessMenuRef}
                  className={`absolute top-8 right-14 w-44 rounded-2xl p-2.5 z-[120] text-[10px] backdrop-blur-[38px] transition-all border ${
                    highContrast 
                      ? 'bg-black border-2 border-white text-white' 
                      : theme === 'light'
                      ? 'bg-white/65 border-black/10 text-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_1px_1.5px_rgba(255,255,255,0.7)]'
                      : 'bg-slate-900/45 border-white/12 text-gray-300 shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.18)]'
                  }`}
                >
                  <div className={`font-bold mb-2 px-1 border-b pb-1 select-none ${
                    highContrast 
                      ? 'border-white text-white' 
                      : theme === 'light'
                      ? 'border-black/5 text-slate-850'
                      : 'border-white/5 text-white'
                  }`}>Accessibility Options</div>
                  <div className="space-y-1">
                    <div 
                      tabIndex={0}
                      onClick={() => {
                        const nextVal = !highContrast;
                        setHighContrast(nextVal);
                        speakText(`High Contrast ${nextVal ? 'on' : 'off'}`);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          const nextVal = !highContrast;
                          setHighContrast(nextVal);
                          speakText(`High Contrast ${nextVal ? 'on' : 'off'}`);
                        }
                      }}
                      className={`flex justify-between items-center px-1.5 py-1.5 rounded cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                        highContrast 
                          ? 'bg-white/10 border border-white text-white font-bold' 
                          : theme === 'light'
                          ? 'hover:bg-black/5 text-slate-800'
                          : 'hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      <span>High Contrast</span>
                      <span className={highContrast ? "text-emerald-400 font-bold" : "text-zinc-500 font-semibold"}>
                        {highContrast ? "On" : "Off"}
                      </span>
                    </div>
                    <div 
                      tabIndex={0}
                      onClick={() => {
                        const nextVal = !screenReader;
                        setScreenReader(nextVal);
                        if (nextVal) {
                          speakText("Screen reader turned on. Welcome Manish. Enter your password to sign in.");
                        } else {
                          speakText("Screen reader turned off.");
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          const nextVal = !screenReader;
                          setScreenReader(nextVal);
                          if (nextVal) {
                            speakText("Screen reader turned on. Welcome Manish. Enter your password to sign in.");
                          } else {
                            speakText("Screen reader turned off.");
                          }
                        }
                      }}
                      className={`flex justify-between items-center px-1.5 py-1.5 rounded cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                        screenReader 
                          ? 'bg-white/10 border border-white text-white font-bold' 
                          : theme === 'light'
                          ? 'hover:bg-black/5 text-slate-800'
                          : 'hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      <span>Screen Reader</span>
                      <span className={screenReader ? "text-emerald-400 font-bold" : "text-zinc-500 font-semibold"}>
                        {screenReader ? "On" : "Off"}
                      </span>
                    </div>
                    <div 
                      tabIndex={0}
                      onClick={() => {
                        const nextVal = !largeText;
                        setLargeText(nextVal);
                        speakText(`Large Text ${nextVal ? 'on' : 'off'}`);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          const nextVal = !largeText;
                          setLargeText(nextVal);
                          speakText(`Large Text ${nextVal ? 'on' : 'off'}`);
                        }
                      }}
                      className={`flex justify-between items-center px-1.5 py-1.5 rounded cursor-pointer transition-all focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                        largeText 
                          ? 'bg-white/10 border border-white text-white font-bold' 
                          : theme === 'light'
                          ? 'hover:bg-black/5 text-slate-800'
                          : 'hover:bg-white/5 text-gray-300'
                      }`}
                    >
                      <span>Large Text</span>
                      <span className={largeText ? "text-emerald-400 font-bold" : "text-zinc-500 font-semibold"}>
                        {largeText ? "On" : "Off"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Power/Status Dropdown menu */}
              {isPowerMenuOpen && (
                <div 
                  ref={powerMenuRef}
                  className={`absolute top-8 right-0 w-48 rounded-2xl p-3 z-[120] text-[10px] backdrop-blur-[38px] border transition-all ${
                    highContrast 
                      ? 'bg-black border-2 border-white text-white' 
                      : theme === 'light'
                      ? 'bg-white/65 border-black/10 text-slate-850 shadow-[0_20px_50px_rgba(0,0,0,0.1),inset_0_1px_1.5px_rgba(255,255,255,0.7)]'
                      : 'bg-slate-900/45 border-white/12 text-gray-300 shadow-[0_20px_50px_rgba(0,0,0,0.45),inset_0_1px_1px_rgba(255,255,255,0.18)]'
                  }`}
                >
                  <div className={`flex items-center space-x-2.5 mb-2.5 border-b pb-2.5 ${
                    theme === 'light' ? 'border-black/5' : 'border-white/5'
                  }`}>
                    <span className={`p-1.5 border rounded-md flex items-center justify-center backdrop-blur-[4px] ${
                      theme === 'light'
                        ? 'bg-black/5 border-black/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]'
                        : 'bg-white/10 border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                    }`}>
                      {getVolumeIcon(volume, 12, theme === 'light' ? 'text-slate-800' : 'text-zinc-300')}
                    </span>
                    <input 
                      type="range" 
                      className="w-full accent-[#3c6eb4] bg-white/10 h-1 rounded-lg appearance-none cursor-pointer" 
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                    />
                  </div>
                  <div className={`mb-3 px-1 text-[9px] flex flex-col space-y-2 border-b pb-2.5 ${
                    theme === 'light' ? 'text-slate-600 border-black/5' : 'text-zinc-400 border-white/5'
                  }`}>
                    <div className="flex justify-between items-center w-full">
                      <span className="flex items-center space-x-1.5">
                        <span className={`p-1.5 border rounded-md flex items-center justify-center backdrop-blur-[4px] ${
                          theme === 'light'
                            ? 'bg-black/5 border-black/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]'
                            : 'bg-white/10 border border-white/15 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                        }`}>
                          <BatteryIcon percentage={battery} size={12} className={`transition-colors duration-200 ${battery > 20 ? 'text-green-400' : 'text-red-500'}`} />
                        </span>
                        <span>{battery}% (Remaining)</span>
                      </span>
                      <span>Balanced</span>
                    </div>
                    <div className="flex items-center space-x-2 w-full pt-1">
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={battery}
                        onChange={(e) => setBattery(Number(e.target.value))}
                        className="w-full accent-[#3c6eb4] bg-white/10 h-1 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                  
                  <div className={`space-y-1 pt-1.5 border-t font-medium ${
                    theme === 'light' ? 'border-black/5' : 'border-white/5'
                  }`}>
                    <div 
                      tabIndex={0}
                      className={`px-2 py-1 rounded cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                        theme === 'light' ? 'hover:bg-black/5 text-slate-800' : 'hover:bg-white/5 hover:text-white text-gray-300'
                      }`} 
                      onClick={() => { 
                        setIsPowerMenuOpen(false); 
                        setIsSuspended(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setIsPowerMenuOpen(false);
                          setIsSuspended(true);
                        }
                      }}
                    >
                      Suspend
                    </div>
                    <div 
                      tabIndex={0}
                      className={`px-2 py-1 rounded cursor-pointer transition-colors font-semibold focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                        theme === 'light' ? 'hover:bg-red-500/10 text-red-600' : 'hover:bg-red-950/20 hover:text-red-400 text-red-400'
                      }`}
                      onClick={() => {
                        setIsPowerMenuOpen(false);
                        setBootState('bios');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setIsPowerMenuOpen(false);
                          setBootState('bios');
                        }
                      }}
                    >
                      Restart...
                    </div>
                    <div 
                      tabIndex={0}
                      className={`px-2 py-1 rounded cursor-pointer transition-colors font-semibold focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-1 ${
                        theme === 'light' ? 'hover:bg-red-500/10 text-red-650' : 'hover:bg-red-950/20 hover:text-red-400 text-red-400'
                      }`}
                      onClick={() => {
                        setIsPowerMenuOpen(false);
                        if (document.fullscreenElement) {
                          document.exitFullscreen().catch(() => {});
                        }
                        setBootState('off');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setIsPowerMenuOpen(false);
                          if (document.fullscreenElement) {
                            document.exitFullscreen().catch(() => {});
                          }
                          setBootState('off');
                        }
                      }}
                    >
                      Power Off...
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Login Pod */}
          <div className={`z-10 flex flex-col items-center justify-center flex-grow -mt-10 transition-all duration-300 ${largeText ? 'scale-110' : ''} ${highContrast ? 'contrast-125 saturate-50' : ''}`}>
            {/* Round Avatar Profile (User uploaded image /avatar.jpg) */}
            <div 
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  document.getElementById('gdm-password-input')?.focus();
                }
              }}
              className={`w-24 h-24 rounded-full mb-5 shadow-[0_12px_32px_rgba(0,0,0,0.25)] overflow-hidden hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer relative group focus-visible:outline-2 focus-visible:outline-blue-400 focus-visible:outline-offset-2 backdrop-blur-sm ${
                theme === 'light'
                  ? 'border border-black/15 bg-black/5 hover:border-black/25'
                  : 'border border-white/25 bg-white/5 hover:border-white/45'
              }`}
            >
              <img src="/avatar.jpg" alt="Manish" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
            </div>
            
            <h2 className={`text-xl font-semibold mb-6 drop-shadow-md tracking-wide transition-colors ${
              theme === 'light' ? 'text-slate-800' : 'text-white'
            }`}>Manish</h2>
            
            {/* Password input form with integrated circular sign-in arrow */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                try {
                  document.documentElement.requestFullscreen().catch(() => {});
                } catch (err) {}
                setBootState('desktop');
              }}
              className="relative w-64 flex items-center mt-2"
            >
              <input 
                id="gdm-password-input"
                type="password" 
                placeholder="Password" 
                autoFocus
                className={`w-full pr-12 pl-4 py-2.5 rounded-xl text-center shadow-lg backdrop-blur-md focus:outline-none focus:ring-1 focus:ring-[#3c6eb4] transition-all duration-200 text-sm font-semibold font-mono ${
                  theme === 'light'
                    ? 'bg-black/5 hover:bg-black/10 focus:bg-black/10 border border-black/10 text-slate-800 placeholder-slate-500/60 focus:border-black/20'
                    : 'bg-white/5 hover:bg-white/10 focus:bg-white/10 border border-white/15 text-white placeholder-white/45 focus:border-white/35'
                }`}
                defaultValue="••••••••"
                onFocus={(e) => {
                  const target = e.target;
                  setTimeout(() => target.select(), 0);
                }}
                onClick={(e) => {
                  const target = e.target as HTMLInputElement;
                  target.select();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    try {
                      document.documentElement.requestFullscreen().catch(() => {});
                    } catch (err) {}
                    setBootState('desktop');
                  }
                }}
              />
              <button
                type="submit"
                className={`absolute right-1.5 w-7 h-7 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 shadow-md active:scale-90 ${
                  theme === 'light'
                    ? 'bg-[#3c6eb4]/35 hover:bg-[#3c6eb4]/55 text-slate-800 border border-black/10 backdrop-blur-sm'
                    : 'bg-[#3c6eb4]/35 hover:bg-[#3c6eb4]/55 text-white border border-white/20 backdrop-blur-sm'
                }`}
                title="Sign In"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </form>
          </div>

          {/* Bottom Bar Branding (Fedora OS signature) */}
          <div className={`z-10 flex flex-col items-center space-y-2 transition-all mb-4 ${
            highContrast ? 'opacity-100 font-bold' : 'opacity-85 hover:opacity-100'
          }`}>
            <div className="flex items-center text-white/95">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className={`w-7 h-7 mr-2.5 fill-current transition-colors ${
                highContrast ? 'text-white' : 'text-[#4f88dc]'
              }`}>
                <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm105.8 286.7H290v62h-48.4v-62h-71.8v-43h71.8v-72.2c0-50.1 27.6-77.8 77.8-77.8h46.6v43h-46.6c-21.4 0-31.2 9.8-31.2 34.8v72.2h71.8v43z"/>
              </svg>
              <div className="text-xl font-bold tracking-tight">
                fedora <span className="font-light text-white/80">workstation</span>
              </div>
            </div>
          </div>
          {/* Suspend Screen overlay */}
          {isSuspended && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[9999] flex flex-col justify-center items-center cursor-pointer select-none"
            >
              <div className="text-zinc-600 text-xs font-mono tracking-widest animate-pulse">
                SYSTEM SUSPENDED - CLICK OR PRESS ANY KEY TO WAKE
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* 5. UEFI BIOS Setup Screen */}
      {bootState === 'uefi' && (
        <motion.div
          key="uefi"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0000a8] text-[#ffffff] font-mono p-4 z-[150] select-none text-[11px] flex flex-col justify-between"
        >
          {/* Top Bar Header */}
          <div className="flex justify-between items-center bg-[#c0c0c0] text-[#0000a8] px-2 py-0.5 font-bold">
            <span>Aptio Setup Utility - Copyright (C) 2026 American Megatrends, Inc.</span>
            <span>Version 2.22.1277</span>
          </div>

          {/* Tab Menu */}
          <div className="flex space-x-1.5 mt-2 bg-transparent text-white border-b border-[#ffffff]/40 pb-0.5">
            {['Main', 'Advanced', 'Security', 'Boot', 'Exit'].map((tabName, idx) => {
              const isTabActive = activeTab === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setActiveTab(idx);
                    setSelectedRow(0);
                  }}
                  className={`px-4 py-0.5 cursor-pointer font-bold transition-all ${
                    isTabActive ? 'bg-[#c0c0c0] text-[#0000a8]' : 'hover:bg-white/10 text-gray-300'
                  }`}
                >
                  {tabName}
                </div>
              );
            })}
          </div>

          {/* Main Content Area */}
          <div className="flex-grow my-2 border-2 border-double border-white flex p-3 relative overflow-hidden min-h-[350px]">
            {/* Left Options Pane (70%) */}
            <div className="w-[70%] pr-4 border-r border-[#ffffff]/40 flex flex-col justify-start">
              {activeTab === 0 && (
                <div className="space-y-1.5">
                  <div className="text-yellow-400 font-bold mb-2">System Overview</div>
                  {renderBiosRow(0, 'BIOS Vendor', 'American Megatrends')}
                  {renderBiosRow(1, 'Core Version', '5.26')}
                  {renderBiosRow(2, 'BIOS Version', 'F.40')}
                  {renderBiosRow(3, 'Build Date and Time', '04/12/2026 14:32:00')}
                  {renderBiosRow(4, 'System Date', `[${new Date().toLocaleDateString('en-US', { weekday: 'short', month: '2-digit', day: '2-digit', year: 'numeric' })}]`)}
                  {renderBiosRow(5, 'System Time', `[${new Date().toLocaleTimeString()}]`)}
                  <div className="text-yellow-400 font-bold mt-4 mb-2">Processor / Memory</div>
                  {renderBiosRow(6, 'CPU Type', 'Intel(R) Core(TM) i9-14900K @ 3.20GHz')}
                  {renderBiosRow(7, 'Total Memory', '65536 MB (DDR5 6400MHz)')}
                </div>
              )}

              {activeTab === 1 && (
                <div className="space-y-1.5">
                  <div className="text-yellow-400 font-bold mb-2">Advanced Chipset Settings</div>
                  {renderBiosRow(0, 'SATA Mode Selection', `[${tempSataMode}]`)}
                  {renderBiosRow(1, 'Intel Virtualization Tech', `[${tempVtx ? 'Enabled' : 'Disabled'}]`)}
                  {renderBiosRow(2, 'USB Legacy Support', `[${tempUsbLegacy ? 'Enabled' : 'Disabled'}]`)}
                  {renderBiosRow(3, 'Onboard LAN Controller', `[${tempLan ? 'Enabled' : 'Disabled'}]`)}
                </div>
              )}

              {activeTab === 2 && (
                <div className="space-y-1.5">
                  <div className="text-yellow-400 font-bold mb-2">System Security Level</div>
                  {renderBiosRow(0, 'Administrator Password', '[Not Installed]')}
                  {renderBiosRow(1, 'User Password', '[Not Installed]')}
                  {renderBiosRow(2, 'Secure Boot', `[${tempSecureBoot ? 'Enabled' : 'Disabled'}]`)}
                </div>
              )}

              {activeTab === 3 && (
                <div className="space-y-1.5">
                  <div className="text-yellow-400 font-bold mb-2">Boot Options Priority</div>
                  {renderBiosRow(0, 'Fast Boot', `[${tempFastBoot ? 'Enabled' : 'Disabled'}]`)}
                  {renderBiosRow(1, 'Boot Option #1', `[${tempBootOrder[0]}]`)}
                  {renderBiosRow(2, 'Boot Option #2', `[${tempBootOrder[1]}]`)}
                </div>
              )}

              {activeTab === 4 && (
                <div className="space-y-1.5">
                  <div className="text-yellow-400 font-bold mb-2">Save & Exit Configuration</div>
                  {renderBiosRow(0, 'Save Changes and Reset', '')}
                  {renderBiosRow(1, 'Discard Changes and Exit', '')}
                  {renderBiosRow(2, 'Load Optimized Defaults', '')}
                </div>
              )}
            </div>

            {/* Right Help Pane (30%) */}
            <div className="w-[30%] pl-4 flex flex-col justify-between text-zinc-300">
              <div>
                <div className="text-yellow-400 font-bold border-b border-[#ffffff]/20 pb-1 mb-2">Item Specific Help</div>
                <div className="leading-normal">{getItemDescription()}</div>
              </div>
              <div className="text-[10px] text-zinc-400/80 border-t border-[#ffffff]/20 pt-2 font-mono">
                AMIBIOS (C) 2026 American Megatrends, Inc.
              </div>
            </div>

            {/* Boot Option Selection Modal Popup */}
            {bootOrderPromptOpen && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-[200]">
                <div className="w-80 bg-[#0000a8] border-2 border-double border-white p-3 font-mono shadow-2xl">
                  <div className="text-center font-bold border-b border-white pb-1.5 mb-2.5">
                    {selectedRow === 1 ? 'Boot Option #1' : 'Boot Option #2'}
                  </div>
                  <div className="space-y-1.5">
                    {bootOptions.map((name, index) => {
                      const isHighlighted = bootPromptIndex === index;
                      return (
                        <div
                          key={name}
                          onClick={() => {
                            setBootPromptIndex(index);
                            const selectedOS = name;
                            const otherOS = index === 0 ? 'Windows Boot Manager' : 'Fedora Workstation';
                            if (selectedRow === 1) {
                              setTempBootOrder([selectedOS, otherOS]);
                            } else {
                              setTempBootOrder([otherOS, selectedOS]);
                            }
                            setBootOrderPromptOpen(false);
                          }}
                          className={`px-3 py-1 cursor-pointer font-bold ${
                            isHighlighted ? 'bg-[#ffff55] text-black' : 'text-white'
                          }`}
                        >
                          {isHighlighted ? '» ' : '  '}
                          {name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Guide */}
          <div className="border-t border-[#ffffff]/40 pt-2 flex flex-wrap justify-between items-center text-[10px] text-zinc-300 font-mono">
            <div>F1: General Help</div>
            <div>ESC: Exit</div>
            <div>↑↓: Select Item</div>
            <div>→←: Select Screen</div>
            <div>+-: Change Opt.</div>
            <div>Enter: Select</div>
            <div>F10: Save & Exit</div>
          </div>
        </motion.div>
      )}

      {/* 6. Windows Booting Screen */}
      {bootState === 'windows_booting' && (
        <motion.div
          key="windows_booting"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black z-[150] flex flex-col justify-center items-center select-none"
        >
          {/* Windows 11 Blue Flat Logo */}
          <svg viewBox="0 0 100 100" className="w-16 h-16 fill-[#0078d7] mb-16 select-none">
            <rect x="0" y="0" width="47" height="47" />
            <rect x="53" y="0" width="47" height="47" />
            <rect x="0" y="53" width="47" height="47" />
            <rect x="53" y="53" width="47" height="47" />
          </svg>

          {/* Windows-style Dot Spinner */}
          <div className="w-8 h-8 border-[3px] border-white/20 border-t-white rounded-full animate-spin" />
        </motion.div>
      )}

      {/* 7. Windows Blue Screen of Death (BSoD) */}
      {bootState === 'windows_bsod' && (
        <motion.div
          key="windows_bsod"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#0078d7] text-white z-[150] p-16 select-none flex flex-col justify-between font-sans"
        >
          <div className="max-w-4xl mx-auto flex-grow flex flex-col justify-center">
            {/* Sad Smiley Face */}
            <div className="text-7xl font-light mb-8 select-none">:(</div>
            
            {/* Main message */}
            <div className="text-xl md:text-2xl font-light leading-relaxed mb-8">
              Your PC ran into a problem and needs to restart. We're just collecting some error info, and then we'll restart for you.
            </div>

            {/* Progress Percentage */}
            <div className="text-lg md:text-xl font-light mb-12">
              {bsodProgress}% complete
            </div>

            {/* Error metadata with mock QR code */}
            <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8 mt-4">
              {/* Mock QR Code Block */}
              <div className="w-24 h-24 bg-white p-2 flex flex-col justify-between border border-white/10 shrink-0 select-none">
                <div className="flex justify-between">
                  <div className="w-5 h-5 bg-black border-2 border-white" />
                  <div className="w-5 h-5 bg-black border-2 border-white" />
                </div>
                <div className="h-4 flex justify-around items-center px-1">
                  <div className="w-1.5 h-1.5 bg-black" />
                  <div className="w-1.5 h-1.5 bg-black" />
                  <div className="w-1.5 h-1.5 bg-black" />
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-5 h-5 bg-black border-2 border-white" />
                  <div className="w-4 h-4 bg-black" />
                </div>
              </div>

              {/* Error Details */}
              <div className="text-xs md:text-sm text-blue-100 font-light space-y-2 leading-relaxed">
                <div>
                  For more information about this issue and possible fixes, visit{' '}
                  <span className="underline cursor-pointer font-normal text-white">https://www.windows.com/stopcode</span>
                </div>
                <div className="pt-2 text-[11px] text-blue-200/80">
                  If you call a support person, give them this info:
                </div>
                <div className="font-mono text-white text-[11px] space-y-0.5">
                  <div>Stop code: DUAL_BOOT_FEDORA_IS_SUPERIOR</div>
                  <div>What failed: windows_boot_manager.sys</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 5. Fedora Emergency / Rescue Shell */}
      {bootState === 'rescue_shell' && (
        <motion.div
          key="rescue_shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#000000] text-gray-200 font-mono p-8 flex flex-col justify-start select-text z-[100] text-xs leading-relaxed"
        >
          <div className="space-y-1">
            <div>[  OK  ] Reached target Emergency Mode.</div>
            <div className="text-amber-400 font-bold mt-2">Welcome to emergency mode!</div>
            <div>After logging in, type "journalctl -xb" to view system logs,</div>
            <div>"reboot" to restart the system, "poweroff" to halt, or</div>
            <div>"exit" to resume normal boot loading sequence.</div>
            <div className="mt-4 text-zinc-400">Give root password for maintenance (or press Control-D / type "exit" to continue):</div>
          </div>
          
          <RescueConsole 
            onBootDefault={() => setBootState('login')} 
            onReboot={() => setBootState('bios')} 
            onPoweroff={() => setBootState('off')} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
