import React, { useState } from 'react';
import { Folder, FileText, ArrowLeft, Grid, List as ListIcon, Heart, User, Award, Briefcase, FileCode } from 'lucide-react';
import { useWindowStore } from '../store/useWindowStore';
import { useSystemStore } from '../store/useSystemStore';
import { motion } from 'framer-motion';

import { vfs } from '../config/vfs';
import type { VFSNode } from '../config/vfs';
import { apps } from '../config/apps';
import { AppIcon } from '../desktop/AppIcon';

const FileManagerApp: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<VFSNode[]>([vfs]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const theme = useSystemStore((state) => state.theme);
  const isLight = theme === 'light';

  const openWindow = useWindowStore((state) => state.openWindow);
  const setSelectedProjectId = useWindowStore((state) => state.setSelectedProjectId);
  const setSelectedCertificateId = useWindowStore((state) => state.setSelectedCertificateId);
  const setBrowserUrl = useWindowStore((state) => state.setBrowserUrl);

  const currentFolder = currentPath[currentPath.length - 1];

  const handleNavigate = (node: VFSNode) => {
    if (node.type === 'folder') {
      setCurrentPath([...currentPath, node]);
    } else if (node.type === 'file') {
      if (node.appId) {
        if (node.appId === 'projects') {
          const id = node.name.replace('.md', '');
          setSelectedProjectId(id);
        } else if (node.appId === 'certificate') {
          const id = node.name.replace('.txt', '').replace('.md', '');
          setSelectedCertificateId(id);
        } else if (node.appId === 'browser' && node.url) {
          setBrowserUrl(node.url);
        }
        const appConfig = apps.find(a => a.id === node.appId);
        const title = appConfig ? appConfig.title : (node.appId.charAt(0).toUpperCase() + node.appId.slice(1));
        openWindow(node.appId, title);
      }
    }
  };

  const handleGoBack = () => {
    if (currentPath.length > 1) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };

  const navigateToSidebar = (folderName: string) => {
    if (folderName === 'Home') {
      setCurrentPath([vfs]);
      return;
    }
    const found = vfs.children?.find(n => n.name.toLowerCase() === folderName.toLowerCase());
    if (found) {
      setCurrentPath([vfs, found]);
    }
  };

  const isActiveFolder = (name: string) => {
    const activeName = currentPath.length === 1 ? 'Home' : currentFolder.name;
    return activeName.toLowerCase() === name.toLowerCase();
  };

  const breadcrumbs = currentPath.map(n => n.name).join(' / ');

  const getFileIcon = (child: VFSNode) => {
    if (child.type === 'folder') {
      return <Folder size={viewMode === 'grid' ? 44 : 20} className="text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.2)]" />;
    }

    if (child.appId && ['snake', 'tetris', 'flappy', 'space-fighter', 'dino', 'games'].includes(child.appId)) {
      return (
        <div className={`flex items-center justify-center ${viewMode === 'grid' ? 'w-11 h-11' : 'w-5 h-5'}`}>
          <AppIcon id={child.appId} size={viewMode === 'grid' ? 44 : 20} />
        </div>
      );
    }

    if (child.name.endsWith('.pdf')) {
      return <FileText size={viewMode === 'grid' ? 44 : 20} className="text-rose-500 drop-shadow-[0_2px_8px_rgba(239,68,68,0.2)]" />;
    }
    if (child.name.endsWith('.md')) {
      return <FileCode size={viewMode === 'grid' ? 44 : 20} className="text-violet-400 drop-shadow-[0_2px_8px_rgba(139,92,246,0.2)]" />;
    }
    return <FileText size={viewMode === 'grid' ? 44 : 20} className={`drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)] ${isLight ? 'text-slate-500' : 'text-slate-300'}`} />;
  };

  const sidebarClass = isLight
    ? 'bg-white/50 border-black/8 backdrop-blur-sm'
    : 'bg-slate-950/60 border-white/5';

  const sidebarItemActive = isLight ? 'text-slate-900' : 'text-white';
  const sidebarItemInactive = isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-slate-200';

  const toolbarClass = isLight
    ? 'bg-white/60 border-black/8 backdrop-blur-sm'
    : 'bg-slate-900/50 border-white/5';

  const breadcrumbClass = isLight
    ? 'bg-black/[0.04] border-black/10 text-slate-700'
    : 'bg-white/5 border-white/5 text-slate-300';

  const viewToggleClass = isLight
    ? 'bg-black/[0.04] border-black/10'
    : 'bg-white/5 border-white/5';

  const fileItemGrid = isLight
    ? 'bg-black/[0.02] border border-black/8 hover:liquid-glass-card shadow-sm hover:shadow-lg'
    : 'bg-white/[0.02] border border-white/5 hover:liquid-glass-card shadow-sm hover:shadow-lg';

  const fileItemList = isLight
    ? 'hover:bg-black/[0.04] rounded-xl border border-transparent hover:border-black/10'
    : 'hover:bg-white/5 rounded-xl border border-transparent hover:border-white/5';

  const fileNameClass = isLight ? 'text-slate-700' : 'text-slate-200';

  return (
    <div className={`flex h-full select-none ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
      {/* Sidebar */}
      <div className={`w-48 border-r flex flex-col p-3.5 space-y-4 ${sidebarClass}`}>
        <div className={`text-[10px] font-bold uppercase tracking-wider px-2 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Locations</div>
        <div className="space-y-1 text-xs">
          {[
            { name: 'Home', icon: <span className={`text-sm font-bold ${isActiveFolder('Home') ? 'text-[#3c6eb4]' : ''}`}>⌂</span> },
            { name: 'About', icon: <User size={13} className={isActiveFolder('About') ? 'text-blue-400' : isLight ? 'text-slate-400' : 'text-slate-400'} /> },
            { name: 'Projects', icon: <Briefcase size={13} className={isActiveFolder('Projects') ? 'text-violet-400' : isLight ? 'text-slate-400' : 'text-slate-400'} /> },
            { name: 'Skills', icon: <Award size={13} className={isActiveFolder('Skills') ? 'text-emerald-400' : isLight ? 'text-slate-400' : 'text-slate-400'} /> },
            { name: 'Contact', icon: <Heart size={13} className={isActiveFolder('Contact') ? 'text-rose-400' : isLight ? 'text-slate-400' : 'text-slate-400'} /> },
          ].map(({ name, icon }) => (
            <div
              key={name}
              onClick={() => navigateToSidebar(name)}
              className={`relative flex items-center space-x-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                isActiveFolder(name) ? sidebarItemActive : sidebarItemInactive
              }`}
            >
              {isActiveFolder(name) && (
                <motion.div
                  layoutId="activeFileSidebar"
                  className="absolute inset-0 liquid-glass-pill rounded-lg -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {icon}
              <span className="font-semibold">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Files Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className={`flex items-center px-4 py-2.5 border-b space-x-4 ${toolbarClass}`}>
          <button
            onClick={handleGoBack}
            disabled={currentPath.length === 1}
            className={`p-1.5 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer ${
              isLight ? 'hover:bg-black/[0.06] text-slate-500 hover:text-slate-800' : 'hover:bg-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <ArrowLeft size={14} />
          </button>

          {/* Breadcrumbs */}
          <div className={`flex-1 px-3 py-1 rounded-xl text-xs truncate border font-medium ${breadcrumbClass}`}>
            {breadcrumbs}
          </div>

          {/* View Toggles */}
          <div className={`flex p-0.5 rounded-lg border ${viewToggleClass}`}>
            <button onClick={() => setViewMode('grid')} className={`p-1 rounded ${viewMode === 'grid' ? 'bg-[#3c6eb4] text-white shadow-sm' : `${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'} cursor-pointer`}`}>
              <Grid size={13} />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-[#3c6eb4] text-white shadow-sm' : `${isLight ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 hover:text-white'} cursor-pointer`}`}>
              <ListIcon size={13} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className={`flex-grow p-5 overflow-y-auto ${viewMode === 'grid' ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 content-start' : 'flex flex-col space-y-1'}`}>
          {currentFolder.children?.length === 0 && (
            <div className={`col-span-full text-center text-xs mt-12 font-medium ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>Folder is empty</div>
          )}
          {currentFolder.children?.map((child, idx) => (
            <div
              key={idx}
              onDoubleClick={() => handleNavigate(child)}
              className={`cursor-pointer rounded-2xl select-none transition-all duration-200 ${
                viewMode === 'grid'
                  ? `flex flex-col items-center justify-center p-4 text-center space-y-2.5 ${fileItemGrid}`
                  : `flex items-center px-4 py-3 space-x-3.5 ${fileItemList}`
              }`}
            >
              {getFileIcon(child)}
              <span className={`text-[11px] font-semibold break-all leading-normal line-clamp-2 ${fileNameClass}`}>{child.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileManagerApp;
