import React, { useState } from 'react';
import { Sparkles, Cloud, Code2, Cpu, Database, RefreshCw, Layers } from 'lucide-react';
import { useSystemStore } from '../store/useSystemStore';
import { motion, AnimatePresence } from 'framer-motion';

interface Skill {
  name: string;
  level: number;
}

interface Layer {
  level: number;
  title: string;
  skills: Skill[];
  color: string;
  borderColor: string;
  shadowColor: string;
  textColorDark: string;
  textColorLight: string;
  width: string;
  description: string;
  icon: React.ReactNode;
}

const SkillsApp: React.FC = () => {
  const theme = useSystemStore((state) => state.theme);
  const isLight = theme === 'light';

  const [activeView, setActiveView] = useState<'pyramid' | 'blender'>('pyramid');
  const [selectedLevel, setSelectedLevel] = useState<number>(5);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [blending, setBlending] = useState(false);
  const [blendResult, setBlendResult] = useState<{
    role: string;
    description: string;
    capabilities: string[];
    color: string;
  } | null>(null);

  const layers: Layer[] = [
    {
      level: 5,
      title: 'Artificial Intelligence',
      icon: <Sparkles size={16} />,
      skills: [
        { name: 'Generative AI', level: 90 },
        { name: 'RAG Systems', level: 85 },
        { name: 'TensorFlow', level: 75 },
        { name: 'Vector Search', level: 80 },
        { name: 'NLP & LLMs', level: 85 },
        { name: 'Pandas & NumPy', level: 80 }
      ],
      color: 'from-amber-500 to-orange-400',
      borderColor: 'border-orange-500/30',
      shadowColor: 'shadow-orange-500/20',
      textColorDark: 'text-orange-400',
      textColorLight: 'text-orange-600',
      width: 'w-2/5 max-w-[180px]',
      description: 'Advanced capabilities in deep learning, vector representations, prompt engineering, semantic retrieval pipelines, and conversational AI systems.'
    },
    {
      level: 4,
      title: 'Cloud & DevOps',
      icon: <Cloud size={16} />,
      skills: [
        { name: 'Google Cloud Platform', level: 80 },
        { name: 'MLOps', level: 75 },
        { name: 'Git & GitFlow', level: 90 },
        { name: 'Docker Containers', level: 70 },
        { name: 'Salesforce Platform', level: 85 },
        { name: 'Red Hat OpenShift', level: 75 }
      ],
      color: 'from-pink-500 to-rose-400',
      borderColor: 'border-rose-500/30',
      shadowColor: 'shadow-rose-500/20',
      textColorDark: 'text-rose-400',
      textColorLight: 'text-rose-600',
      width: 'w-[55%] max-w-[240px]',
      description: 'Continuous integration, cloud deployment architectures, automated pipeline monitoring, container virtualization, and secure DevOps environments.'
    },
    {
      level: 3,
      title: 'Software & Web Development',
      icon: <Code2 size={16} />,
      skills: [
        { name: 'React & TSX', level: 85 },
        { name: 'Spring Boot', level: 80 },
        { name: 'Flask', level: 90 },
        { name: 'Node.js', level: 75 },
        { name: 'RESTful APIs', level: 90 },
        { name: 'WebSockets', level: 80 }
      ],
      color: 'from-purple-500 to-fuchsia-400',
      borderColor: 'border-fuchsia-500/30',
      shadowColor: 'shadow-fuchsia-500/20',
      textColorDark: 'text-fuchsia-400',
      textColorLight: 'text-fuchsia-600',
      width: 'w-[70%] max-w-[300px]',
      description: 'Creating highly responsive layouts, complex visual web applications, stateless REST services, and asynchronous web interfaces.'
    },
    {
      level: 2,
      title: 'Programming Languages',
      icon: <Cpu size={16} />,
      skills: [
        { name: 'Python', level: 95 },
        { name: 'Java', level: 90 },
        { name: 'JavaScript', level: 85 },
        { name: 'C#', level: 80 },
        { name: 'C / C++', level: 75 },
        { name: 'Apex (Salesforce)', level: 80 }
      ],
      color: 'from-blue-500 to-cyan-400',
      borderColor: 'border-cyan-500/30',
      shadowColor: 'shadow-cyan-500/20',
      textColorDark: 'text-cyan-400',
      textColorLight: 'text-blue-600',
      width: 'w-[85%] max-w-[360px]',
      description: 'Fluency in dynamic scripting languages, statically typed backend runtimes, browser scripts, and database object execution environments.'
    },
    {
      level: 1,
      title: 'Core Fundamentals',
      icon: <Database size={16} />,
      skills: [
        { name: 'Data Structures & Algorithms', level: 90 },
        { name: 'Object-Oriented Programming', level: 95 },
        { name: 'Relational SQL Databases', level: 85 },
        { name: 'Computer Networks', level: 80 },
        { name: 'System Design', level: 75 }
      ],
      color: 'from-emerald-500 to-teal-400',
      borderColor: 'border-teal-500/30',
      shadowColor: 'shadow-teal-500/20',
      textColorDark: 'text-teal-400',
      textColorLight: 'text-emerald-600',
      width: 'w-full max-w-[420px]',
      description: 'Foundational programming concepts, algorithmic time complexity analysis, network packets transmission, database normalization, and patterns design.'
    }
  ];

  // Flat list of all skill names
  const allSkillsFlat = layers.flatMap(l => l.skills.map(s => s.name));

  const handleToggleSkill = (name: string) => {
    setSelectedSkills(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const handleBlend = () => {
    if (selectedSkills.length === 0) return;
    setBlending(true);
    setBlendResult(null);

    setTimeout(() => {
      setBlending(false);

      const hasAI = selectedSkills.some(s => ['Generative AI', 'RAG Systems', 'TensorFlow', 'Vector Search', 'NLP & LLMs'].includes(s));
      const hasCloudDevOps = selectedSkills.some(s => ['Google Cloud Platform', 'MLOps', 'Docker Containers', 'Red Hat OpenShift'].includes(s));
      const hasWeb = selectedSkills.some(s => ['React & TSX', 'Node.js', 'WebSockets', 'RESTful APIs'].includes(s));
      const hasBackend = selectedSkills.some(s => ['Spring Boot', 'Flask', 'Java', 'C#'].includes(s));
      const hasCore = selectedSkills.some(s => ['Data Structures & Algorithms', 'System Design', 'Computer Networks'].includes(s));

      if (hasAI && hasCloudDevOps && selectedSkills.includes('Python')) {
        setBlendResult({
          role: 'MLOps & AI Platform Engineer',
          description: 'A cutting-edge role focused on deploying, optimizing, and monitoring complex AI pipelines and large language models inside secure cloud container services.',
          capabilities: ['Automated model retraining pipelines', 'LLM hosting optimizations', 'Continuous model health validation'],
          color: 'from-orange-500 to-rose-500'
        });
      } else if (hasAI && hasWeb) {
        setBlendResult({
          role: 'AI Product Front-End Engineer',
          description: 'Specializes in bridging user experience design with generative capabilities, integrating real-time vector queries and streaming chat interfaces into fast web views.',
          capabilities: ['Streaming token rendering', 'Client-side vector search filtering', 'Responsive layout components for complex AI agents'],
          color: 'from-amber-500 to-fuchsia-500'
        });
      } else if (hasAI) {
        setBlendResult({
          role: 'Generative AI Systems Architect',
          description: 'Tasked with building neural model embeddings, constructing knowledge retrieval indexing, and customizing RAG-augmented backend services to support custom query agents.',
          capabilities: ['Vector database sharding configurations', 'LLM fine-tuning & prompt alignments', 'High-speed model execution hooks'],
          color: 'from-orange-500 to-amber-400'
        });
      } else if (hasCloudDevOps && hasBackend) {
        setBlendResult({
          role: 'Cloud Native Infrastructure Architect',
          description: 'Expert in designing highly scalable microservices, structuring continuous deployment pipelines, and managing container nodes across public cloud environments.',
          capabilities: ['Docker & OpenShift orchestration templates', 'Robust API rate-limiting rules', 'Multi-region cloud replication architectures'],
          color: 'from-pink-500 to-purple-500'
        });
      } else if (hasWeb && hasBackend) {
        setBlendResult({
          role: 'Full-Stack Software Engineer',
          description: 'A versatile generalist developer capable of coding fluid UI views, managing relational databases, and designing stateless client-server messaging targets.',
          capabilities: ['Pixel-perfect responsive page layouts', 'Multi-tier relational database migrations', 'Real-time WebSocket event synchronization'],
          color: 'from-purple-500 to-blue-500'
        });
      } else if (hasCore && selectedSkills.includes('Python')) {
        setBlendResult({
          role: 'Computational Algorithm Engineer',
          description: 'Focuses on optimizing data parsing runtimes, implementing custom graph algorithms, and resolving high-throughput structural bottlenecks.',
          capabilities: ['Asymptotic code optimization structures', 'Complex graph query models', 'High-fidelity computational scripting'],
          color: 'from-emerald-500 to-cyan-500'
        });
      } else {
        setBlendResult({
          role: 'Versatile Cross-Functional Developer',
          description: 'A multi-disciplinary profile combining core software development, database design, and structured system principles to solve diverse computational challenges.',
          capabilities: ['Clean object-oriented architecture patterns', 'Modular code structure separation', 'Rapid multi-language prototyping capabilities'],
          color: 'from-blue-500 to-teal-400'
        });
      }
    }, 1200);
  };

  const selectedLevelData = layers.find(l => l.level === selectedLevel) || layers[0];

  // Theme-responsive class helpers
  const dividerH = isLight ? 'border-black/10' : 'border-white/5';
  const dividerBg = isLight ? 'bg-black/[0.06]' : 'bg-white/5';
  const mutedText = isLight ? 'text-slate-500' : 'text-slate-500';
  const bodyText = isLight ? 'text-slate-700' : 'text-slate-300';
  const strongText = isLight ? 'text-slate-900' : 'text-white';
  const descText = isLight ? 'text-slate-600' : 'text-slate-400';
  const skillNameText = isLight ? 'text-slate-800' : 'text-slate-100';
  const progressTrack = isLight
    ? 'bg-black/[0.05] border border-black/[0.06]'
    : 'bg-white/5 border border-white/5';

  // Unselected tier pill classes
  const unselectedTier = isLight
    ? 'bg-black/[0.03] border-black/10 hover:bg-black/[0.07] hover:border-black/15'
    : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08] hover:border-white/15';

  // Tag & helper button classes
  const unselectedTag = isLight
    ? 'bg-black/[0.02] border-black/10 hover:bg-black/[0.06] hover:border-black/15'
    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.06] hover:border-white/15';
  const helperBtn = isLight
    ? 'bg-black/[0.03] hover:bg-black/[0.07] border border-black/10 text-slate-600'
    : 'bg-white/5 hover:bg-white/10 border border-white/5 text-slate-400';

  // Blender cup & result card
  const blenderCup = isLight
    ? 'bg-black/[0.02] border-black/10'
    : 'bg-white/[0.02] border-white/10';
  const resultCard = isLight
    ? 'bg-black/[0.02] border border-black/10'
    : 'bg-white/[0.02] border border-white/5';

  return (
    <div className={`flex flex-col h-full select-none ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>

      {/* Visual Navigation Tabs */}
      <div className={`flex justify-center space-x-3 mb-6 p-4 border-b ${dividerH}`}>
        <button
          onClick={() => setActiveView('pyramid')}
          className={`relative px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all ${
            activeView === 'pyramid' ? strongText : `${bodyText} hover:${strongText}`
          }`}
        >
          {activeView === 'pyramid' && (
            <motion.div
              layoutId="activeSkillsTab"
              className="absolute inset-0 liquid-glass-pill rounded-xl -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span className="flex items-center space-x-1.5">
            <Layers size={13} />
            <span>Skills Pyramid</span>
          </span>
        </button>
        <button
          onClick={() => setActiveView('blender')}
          className={`relative px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all ${
            activeView === 'blender' ? strongText : `${bodyText} hover:${strongText}`
          }`}
        >
          {activeView === 'blender' && (
            <motion.div
              layoutId="activeSkillsTab"
              className="absolute inset-0 liquid-glass-pill rounded-xl -z-10"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
          <span className="flex items-center space-x-1.5">
            <RefreshCw size={13} />
            <span>Skills Blender</span>
          </span>
        </button>
      </div>

      {/* Main Panel views */}
      <div className="flex-1 overflow-hidden p-6 pt-0">
        <AnimatePresence mode="wait">
          {activeView === 'pyramid' ? (
            <motion.div
              key="pyramid"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-stretch"
            >
              {/* Left Column: Centered interactive pyramid layers */}
              <div className={`flex flex-col justify-center items-center space-y-4 py-4 pr-0 md:pr-4 border-r ${dividerH}`}>
                <div className={`text-[10px] uppercase font-bold tracking-widest ${mutedText} mb-6 select-none text-center`}>
                  Click a tier to inspect skill statistics
                </div>
                <div className="w-full flex flex-col items-center space-y-3.5 max-w-[440px]">
                  {layers.map((layer) => {
                    const isSelected = selectedLevel === layer.level;
                    const textColClass = isLight ? layer.textColorLight : layer.textColorDark;

                    return (
                      <div
                        key={layer.level}
                        onClick={() => setSelectedLevel(layer.level)}
                        className={`h-11 rounded-2xl cursor-pointer flex items-center justify-between px-5 font-bold text-[10px] tracking-wider uppercase border transition-all duration-300 shadow-md ${
                          isSelected
                            ? `bg-gradient-to-r ${layer.color} text-slate-950 border-white/25 scale-[1.04] shadow-lg ${layer.shadowColor}`
                            : `${unselectedTier} hover:scale-[1.02]`
                        } ${layer.width}`}
                      >
                        <span className="flex items-center space-x-1.5">
                          <span className={isSelected ? 'text-slate-900' : textColClass}>
                            {layer.icon}
                          </span>
                          <span className={isSelected ? 'text-slate-900' : bodyText}>
                            Lvl {layer.level}: {layer.title.split(' ')[0]}
                          </span>
                        </span>
                        <span className={`text-[8px] font-mono border rounded px-1 ${
                          isSelected
                            ? 'border-slate-950 text-slate-950'
                            : `${isLight ? 'border-black/10' : 'border-white/10'} ${mutedText}`
                        }`}>
                          {layer.skills.length} skills
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className={`h-6 mt-4 w-full flex justify-between items-center text-[9px] ${mutedText} font-semibold px-4`}>
                  <span>Specialized Skillsets (High Level)</span>
                  <div className={`h-[1px] ${dividerBg} flex-1 mx-3`} />
                  <span>Foundational Engineering (Low Level)</span>
                </div>
              </div>

              {/* Right Column: Dynamic level details card */}
              <div className="flex flex-col justify-start overflow-y-auto pl-0 md:pl-4">
                <div className={`liquid-glass-card rounded-3xl p-6 border transition-all duration-500 h-full flex flex-col justify-between ${selectedLevelData.borderColor} ${selectedLevelData.shadowColor}`}>

                  {/* Category Header */}
                  <div>
                    <div className={`flex justify-between items-center border-b ${dividerH} pb-4 mb-4`}>
                      <div className="flex items-center space-x-2.5">
                        <span className={`p-2 rounded-xl ${isLight ? 'bg-black/[0.04] border border-black/10' : 'bg-white/5 border border-white/10'} flex items-center justify-center ${
                          isLight ? selectedLevelData.textColorLight : selectedLevelData.textColorDark
                        }`}>
                          {selectedLevelData.icon}
                        </span>
                        <div>
                          <div className={`text-[8px] uppercase tracking-wider ${mutedText} font-bold`}>Tier level {selectedLevelData.level}</div>
                          <h3 className={`text-sm font-extrabold tracking-wide uppercase mt-0.5 ${
                            isLight ? selectedLevelData.textColorLight : selectedLevelData.textColorDark
                          }`}>
                            {selectedLevelData.title}
                          </h3>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r ${selectedLevelData.color} text-slate-950`}>
                        Tier Lvl {selectedLevelData.level}
                      </span>
                    </div>

                    {/* Category Description */}
                    <p className={`text-xs ${descText} leading-relaxed mb-6 select-text italic`}>
                      "{selectedLevelData.description}"
                    </p>

                    {/* Skill Meters */}
                    <div className="space-y-4">
                      {selectedLevelData.skills.map((skill, idx) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-center text-xs font-semibold">
                            <span className={skillNameText}>{skill.name}</span>
                            <span className={`text-[10px] font-mono ${
                              isLight ? selectedLevelData.textColorLight : selectedLevelData.textColorDark
                            }`}>{skill.level}%</span>
                          </div>
                          {/* Progress Meter */}
                          <div className={`w-full h-2 rounded-full overflow-hidden relative ${progressTrack}`}>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.level}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className={`bg-gradient-to-r ${selectedLevelData.color} h-full rounded-full`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Level Info Footer */}
                  <div className={`mt-8 pt-4 border-t ${dividerH} text-[9px] ${mutedText} text-center font-medium select-none`}>
                    Select other layers in the pyramid block on the left to swap capability metrics.
                  </div>

                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="blender"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full items-stretch"
            >
              {/* Left Column: Skill Selector Tags Grid */}
              <div className={`flex flex-col justify-start overflow-y-auto pr-0 md:pr-4 border-r ${dividerH} h-full`}>
                <div className={`text-[10px] uppercase font-bold tracking-widest ${mutedText} mb-4 select-none`}>
                  Select 2 or more skills to mix in the blender:
                </div>
                <div className="flex flex-wrap gap-2 py-2">
                  {layers.map((layer) => {
                    const textColClass = isLight ? layer.textColorLight : layer.textColorDark;
                    return (
                      <React.Fragment key={layer.level}>
                        {layer.skills.map((skill) => {
                          const isSelected = selectedSkills.includes(skill.name);
                          return (
                            <button
                              key={skill.name}
                              onClick={() => handleToggleSkill(skill.name)}
                              className={`px-3 py-1.5 rounded-full border text-[10px] font-semibold cursor-pointer transition-all duration-200 ${
                                isSelected
                                  ? `bg-gradient-to-r ${layer.color} text-slate-950 border-white/20 shadow-md font-bold`
                                  : `${unselectedTag} ${bodyText}`
                              }`}
                            >
                              <span className="flex items-center space-x-1">
                                <span className={isSelected ? 'text-slate-900' : textColClass}>
                                  {layer.icon}
                                </span>
                                <span>{skill.name}</span>
                              </span>
                            </button>
                          );
                        })}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Selection Helpers */}
                <div className="mt-4 flex space-x-2 select-none">
                  <button
                    onClick={() => setSelectedSkills([])}
                    className={`px-3 py-1 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${helperBtn}`}
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={() => setSelectedSkills(allSkillsFlat.slice(0, 8))}
                    className={`px-3 py-1 rounded-lg text-[9px] font-bold tracking-wider uppercase transition-colors cursor-pointer ${helperBtn}`}
                  >
                    Pre-select Mix
                  </button>
                </div>
              </div>

              {/* Right Column: Blender Cup & Result Card */}
              <div className="flex flex-col justify-start pl-0 md:pl-4">
                <div className="liquid-glass-card rounded-3xl p-6 border border-white/10 h-full flex flex-col justify-between items-stretch">

                  {/* Blender Cup / Mixing Container */}
                  <div className="flex flex-col items-center text-center">
                    <div className={`relative w-36 h-36 rounded-full border flex items-center justify-center shadow-inner overflow-hidden mb-6 ${blenderCup}`}>

                      {/* Rotating glow ring when blending */}
                      <AnimatePresence>
                        {blending && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="absolute inset-2 rounded-full border-2 border-dashed border-sky-400 opacity-60"
                          />
                        )}
                      </AnimatePresence>

                      <div className="z-10 flex flex-col items-center">
                        {blending ? (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 0.6 }}
                            className="text-sky-400 font-bold font-mono text-[10px] tracking-widest"
                          >
                            BLENDING...
                          </motion.div>
                        ) : (
                          <>
                            <div className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${mutedText}`}>
                              {selectedSkills.length} SKILLS
                            </div>
                            <div className={`text-[8px] tracking-wider ${mutedText}`}>in blender cup</div>
                          </>
                        )}
                      </div>

                      {/* Small dots floating inside the blender */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {selectedSkills.slice(0, 10).map((s, index) => {
                          const angle = (index * 360) / Math.min(10, selectedSkills.length);
                          const radius = 48;
                          const x = Math.cos((angle * Math.PI) / 180) * radius;
                          const y = Math.sin((angle * Math.PI) / 180) * radius;
                          return (
                            <motion.div
                              key={s}
                              animate={blending ? {
                                x: [x, 0, x],
                                y: [y, 0, y],
                                rotate: [0, 360, 0]
                              } : {
                                y: [y, y + 4, y],
                              }}
                              transition={blending ? {
                                duration: 1.2,
                                repeat: Infinity,
                                ease: 'easeInOut'
                              } : {
                                duration: 2 + (index % 3),
                                repeat: Infinity,
                                ease: 'easeInOut'
                              }}
                              className="absolute w-2.5 h-2.5 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]"
                              style={{ left: `calc(50% - 5px + ${x}px)`, top: `calc(50% - 5px + ${y}px)` }}
                            />
                          );
                        })}
                      </div>
                    </div>

                    {/* Blend triggering button */}
                    <button
                      disabled={selectedSkills.length === 0 || blending}
                      onClick={handleBlend}
                      className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider shadow transition-all cursor-pointer select-none active:scale-95 ${
                        selectedSkills.length === 0
                          ? `${isLight ? 'bg-black/[0.03] border-black/10' : 'bg-white/5 border-transparent'} ${mutedText} cursor-not-allowed opacity-50`
                          : 'bg-[#3c6eb4] hover:bg-[#3c6eb4]/90 text-white border-white/10 hover:border-white/20'
                      }`}
                    >
                      <RefreshCw size={13} className={blending ? 'animate-spin' : ''} />
                      <span>Mix Custom Role</span>
                    </button>
                  </div>

                  {/* Dynamic Blend Result display card */}
                  <div className="flex-1 mt-6 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                      {blendResult ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          className={`rounded-2xl p-4 relative overflow-hidden ${resultCard}`}
                        >
                          <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${blendResult.color} opacity-[0.04] blur-2xl rounded-full`} />

                          <div className="flex items-center space-x-1.5 text-[8px] font-bold uppercase tracking-widest text-[#d97706] mb-1">
                            <Sparkles size={10} />
                            <span>Blended Capability Result</span>
                          </div>

                          <h4 className={`text-[13px] font-extrabold tracking-wide uppercase leading-tight mb-2 ${strongText}`}>
                            {blendResult.role}
                          </h4>

                          <p className={`text-[10px] ${descText} leading-relaxed mb-3.5`}>
                            {blendResult.description}
                          </p>

                          <div className={`space-y-1.5 border-t ${dividerH} pt-3`}>
                            <div className={`text-[8px] font-bold ${mutedText} uppercase tracking-widest mb-1`}>Core Capability Pillars</div>
                            {blendResult.capabilities.map((c, idx) => (
                              <div key={idx} className={`flex items-start space-x-1.5 text-[9px] ${bodyText} leading-normal`}>
                                <span className="text-amber-500 font-bold mt-0.5">•</span>
                                <span className="select-text">{c}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ) : (
                        <div className={`text-center p-6 border border-dashed ${isLight ? 'border-black/10' : 'border-white/5'} rounded-2xl text-[10px] ${mutedText} italic select-none`}>
                          {selectedSkills.length === 0
                            ? 'Toggle skills tags on the left to load them into the blender.'
                            : 'Click "Mix Custom Role" to blend selected skills and compile profile.'}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
};

export default SkillsApp;
