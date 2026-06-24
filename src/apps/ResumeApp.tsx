import React from 'react';
import { Download } from 'lucide-react';
import { useSystemStore } from '../store/useSystemStore';

const ResumeApp: React.FC = () => {
  const theme = useSystemStore((state) => state.theme);
  const isLight = theme === 'light';

  return (
    <div className={`flex flex-col h-full select-none ${isLight ? 'bg-white/30' : 'bg-slate-950/45'}`}>
      {/* PDF Viewer Header toolbar */}
      <div className={`border-b px-5 py-2.5 flex justify-between items-center z-10 shadow-lg ${
        isLight
          ? 'bg-white/60 border-black/10 backdrop-blur-md'
          : 'bg-slate-900/90 border-white/10'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 bg-red-500 rounded-full"></span>
          <span className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>resume1.pdf</span>
        </div>
        <a
          href="/resume1.pdf"
          download="resume1.pdf"
          className="flex items-center space-x-2 bg-[#3c6eb4] hover:bg-[#3c6eb4]/90 active:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors text-xs font-medium cursor-pointer border border-white/10 text-white no-underline"
        >
          <Download size={12} />
          <span>Download PDF</span>
        </a>
      </div>

      {/* PDF Document Canvas */}
      <div className={`flex-1 ${isLight ? 'bg-slate-100/50' : 'bg-slate-900/20'}`}>
        <iframe
          src="/resume1.pdf"
          className="w-full h-full border-none"
          title="Manish Resume"
        />
      </div>
    </div>
  );
};

export default ResumeApp;
