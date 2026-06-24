import React from 'react';
import { useWindowStore } from '../store/useWindowStore';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSystemStore } from '../store/useSystemStore';

interface Project {
  id: string;
  title: string;
  description: string;
  stack: string;
  link: string;
  color: string;
  image: string;
}

const projects: Project[] = [
  {
    id: 'team-connect',
    title: 'Team Connect',
    image: '/team-connect-screenshot.png',
    description: `A comprehensive team collaboration platform designed to streamline team communication and project management.

Key Features:
• Authentication & Authorization: User registration/login, secure Werkzeug password hashing, role-based access control, and an admin dashboard.
• Task Management: Create, update, and delete tasks; set deadlines with real-time countdowns; and track status visually with status categories and deadline alerts.
• Real-Time Messaging: Multi-room chat functionalities, real-time bidirectional communication using Socket.IO, and instant message delivery.
• File Sharing: Secure file uploading and downloading, download tracking counters, and metadata tracking (size, upload date).
• Video Conferencing: Built-in room-based meeting functionality allowing users to join or create video meetings.
• AI Chatbot: Built-in integration with Google Generative AI (Gemini Pro) to provide context-aware chatbot assistance, session management, and instant help.
• Admin Controls: User management dashboard system-wide administrative oversight, user editing/deletion, and error logging/monitoring.`,
    stack: 'Python, Flask, MySQL, Socket.IO, Google Generative AI (Gemini), Gunicorn',
    link: 'https://github.com/V-Manish-Kumar/Team-connect',
    color: 'from-violet-500 to-indigo-600',
  },
  {
    id: 'mcp-server',
    title: 'Unified MCP Server',
    image: '/mcp-server-screenshot.png',
    description: `An intelligent Model Context Protocol (MCP) Server that unifies database management, AI-powered analytics, and workflow automation into a single platform.

Key Features:
• Database Orchestration: Exposes tools to create databases, manage tables (create/modify/drop), and execute custom SQL queries securely.
• Zapier Integration: Connects with Zapier to trigger automation workflows across 6,000+ third-party applications (Gmail, Slack, Zoom).
• MindsDB Integration: Leverages MindsDB for predictive analytics and machine learning directly inside SQL queries.
• Server-Sent Events (SSE): Implements SSE for real-time streaming and tool execution, supporting a modular and extensible architecture.`,
    stack: 'Python, FastMCP, MySQL, MindsDB, Zapier, Docker, SSE',
    link: 'https://github.com/V-Manish-Kumar/Unified-MCP-Server',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'drug-discovery',
    title: 'Drug Discovery AI',
    image: '/drug-discovery-screenshot.png',
    description: `An AI-accelerated cheminformatics and molecule screening platform designed to predict molecular properties and analyze chemical structures.

Key Features:
• Cheminformatics Modeling: Utilizes RDKit to calculate molecular weight, LogP (lipophilicity), Topological Polar Surface Area (TPSA), rotatable bonds, and Lipinski's Rule of Five compliance.
• Structure Visualization: Renders 2D structural representations of chemical molecules from SMILES inputs using RDKit.
• Gemini Property Profiling: Integrates Google Generative AI (Gemini Pro) to generate a comprehensive analysis of therapeutic class, molecular mechanisms, pharmacokinetic properties, side effects, and drug interactions.
• Database Storage: Integrates SQLAlchemy and MySQL to log and monitor screened molecules and predicted property metadata.`,
    stack: 'Python, Flask, RDKit, Google Generative AI (Gemini Pro), MySQL, SQLAlchemy',
    link: 'https://github.com/V-Manish-Kumar/Accelerating-Drug-Discovery-using-AI',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'insta-ad-ai',
    title: 'InstaAD AI - Marketing Ad Generator',
    image: '/insta-ad-ai-screenshot.png',
    description: `A modern full-stack SaaS application that helps small businesses generate professional marketing ads (posters, copy, and videos) in minutes using advanced AI generation.

Key Features:
• AI Ad Content Generation: Generates headlines, body copy, CTAs, and hashtags instantly using Google Gemini 3 Pro, with industry-specific templates.
• AI Media Generation: Creates professional video ads with audio overlays using Google Veo 3 Fast Audio and generates high-quality marketing images via Google Veo 3.
• AI Chat Assistant: Provides an interactive marketing strategist advisor powered by Google Gemini 3 Pro via Puter.js for real-time tips.
• Visual Poster Editor: Features a canvas editor with customizable design templates, allowing direct downloads (exporting posters as PNG and videos as MP4).`,
    stack: 'React 18, Vite, Node.js, Express, Tailwind CSS, Puter.js, Google Gemini, Google Veo 3, html2canvas',
    link: 'https://github.com/V-Manish-Kumar/InstaAdAI-2',
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'rag-system',
    title: 'Mini RAG Application',
    image: '/rag-system-screenshot.png',
    description: `A production-ready Retrieval-Augmented Generation (RAG) system that enables semantic search and grounded question-answering over custom uploaded documents.

Key Features:
• Text Chunking: Implements LangChain for smart text chunking (1000 tokens with 15% overlap) to maintain contextual coherence.
• Vector Embeddings: Embeds chunks using Google Gemini 'text-embedding-004' (768 dimensions) for semantic mapping.
• Semantic Vector Database: Stores and queries embeddings using Qdrant vector database (Cosine similarity with 0.3 threshold and Top-10 chunks).
• Highlighted Reranking: Leverages Jina AI Cross-Encoder ('jina-reranker-v2-base-multilingual') to select the top 5 most relevant context chunks.
• Grounded Generation: Uses Gemini via Puter.js to generate context-grounded answers with precise inline citations based on the retrieved context.`,
    stack: 'React, FastAPI, LangChain, Qdrant, Google Gemini, Jina AI, Puter.js',
    link: 'https://github.com/V-Manish-Kumar/Rag_System',
    color: 'from-amber-500 to-orange-600',
  }
];

const ProjectsApp: React.FC = () => {
  const selectedProjectId = useWindowStore((state) => state.selectedProjectId);
  const setSelectedProjectId = useWindowStore((state) => state.setSelectedProjectId);
  const theme = useSystemStore((state) => state.theme);
  const isLight = theme === 'light';

  const activeProject = selectedProjectId
    ? projects.find(p => p.id === selectedProjectId)
    : null;

  const toolbarClass = isLight
    ? 'bg-white/70 border-black/10 backdrop-blur-md'
    : 'bg-[#181d28]/95 border-white/5';

  const backBtnClass = isLight
    ? 'text-slate-500 hover:bg-black/[0.06] hover:text-slate-900 border-black/10'
    : 'text-slate-400 hover:bg-white/5 hover:text-white border-white/5';

  const titleClass = isLight ? 'text-slate-700' : 'text-slate-300';

  if (activeProject) {
    return (
      <div className={`flex flex-col h-full select-none overflow-hidden ${isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#0c101b] text-slate-200'}`}>
        {/* Navigation Toolbar */}
        <div className={`border-b px-4 py-2.5 flex items-center space-x-3 shadow-md select-none ${toolbarClass}`}>
          <button
            onClick={() => setSelectedProjectId(null)}
            className={`p-1.5 rounded-lg cursor-pointer transition-colors flex items-center justify-center border ${backBtnClass}`}
            title="Back to list"
          >
            <ArrowLeft size={16} />
          </button>
          <div className={`text-xs font-semibold tracking-wide truncate ${titleClass}`}>
            {activeProject.title}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col items-center"
        >
          <div className="max-w-2xl w-full liquid-glass-card rounded-2xl p-5 md:p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h1 className={`text-lg font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>{activeProject.title}</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider text-violet-300 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md">
                Active Project
              </span>
            </div>

            {activeProject.image && (
              <div className={`w-full mb-5 rounded-xl overflow-hidden border shadow-lg ${isLight ? 'border-black/10 bg-white/60' : 'border-white/10 bg-black/25'}`}>
                <img
                  src={activeProject.image}
                  alt={`${activeProject.title} Interface Screenshot`}
                  className="w-full h-auto object-cover max-h-56 select-text pointer-events-auto"
                />
              </div>
            )}

            <p className={`text-xs mb-6 leading-relaxed whitespace-pre-line select-text ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
              {activeProject.description}
            </p>

            <div className={`border-t pt-4 ${isLight ? 'border-black/10' : 'border-white/5'}`}>
              <h3 className={`text-[10px] uppercase font-bold tracking-wider mb-2 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Tech Stack</h3>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {activeProject.stack.split(',').map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] text-[#3c6eb4] bg-[#3c6eb4]/10 border border-[#3c6eb4]/20 px-2 py-0.5 rounded-md font-semibold"
                  >
                    {tech.trim()}
                  </span>
                ))}
              </div>
            </div>

            <a
              href={activeProject.link}
              target="_blank"
              rel="noreferrer"
              className={`w-full text-center py-2.5 bg-gradient-to-r ${activeProject.color} hover:brightness-110 text-white rounded-xl text-xs font-bold block transition-all duration-200 cursor-pointer shadow-lg`}
            >
              View on GitHub
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22 }}
      className={`p-6 h-full overflow-y-auto select-none ${isLight ? 'text-slate-800' : 'text-slate-200'}`}
    >
      <h1 className={`text-xl font-bold mb-6 tracking-tight border-b pb-2 flex items-center ${isLight ? 'text-slate-900 border-black/10' : 'text-white border-white/10'}`}>
        <span className="w-2.5 h-2.5 bg-violet-500 rounded-full mr-2.5 shadow-[0_0_8px_rgba(139,92,246,0.5)]"></span>
        Portfolio Projects
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj, i) => (
          <div
            key={i}
            className="liquid-glass-card p-5 rounded-2xl flex flex-col justify-between hover:border-violet-500/40 hover:bg-white/10 hover:shadow-violet-500/5 transition-all duration-300 relative group overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${proj.color} opacity-[0.03] group-hover:opacity-[0.08] transition-opacity blur-2xl -z-10`} />

            <div>
              <div className="flex justify-between items-start mb-2.5">
                <h2 className={`text-base font-bold tracking-wide group-hover:text-[#3c6eb4] transition-colors ${isLight ? 'text-slate-900' : 'text-white'}`}>{proj.title}</h2>
                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${isLight ? 'text-slate-500 bg-black/[0.04] border border-black/10' : 'text-slate-400 bg-white/5 border border-white/10'}`}>Project</span>
              </div>

              {proj.image && (
                <div className={`w-full mb-3 rounded-lg overflow-hidden border aspect-video flex items-center justify-center ${isLight ? 'border-black/10 bg-white/40' : 'border-white/5 bg-black/10'}`}>
                  <img src={proj.image} alt={proj.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}

              <p className={`text-xs mb-4 leading-relaxed line-clamp-3 ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>{proj.description}</p>
            </div>

            <div>
              <div className="text-[10px] text-[#3c6eb4] mb-4 font-mono font-semibold tracking-wide truncate">{proj.stack}</div>
              <button
                onClick={() => setSelectedProjectId(proj.id)}
                className={`w-full text-center py-2 border rounded-lg text-xs font-semibold block transition-all duration-200 cursor-pointer shadow-sm hover:bg-[#3c6eb4] hover:text-white hover:shadow-[#3c6eb4]/30 ${
                  isLight ? 'bg-black/[0.03] border-black/10 text-slate-700' : 'bg-white/5 border-white/15 text-slate-200'
                }`}
              >
                View Project Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProjectsApp;
