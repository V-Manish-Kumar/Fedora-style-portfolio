import React from 'react';
import { useWindowStore } from '../store/useWindowStore';
import { ExternalLink, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSystemStore } from '../store/useSystemStore';

interface Certificate {
  id: string;
  title: string;
  image: string;
  url: string;
  description: string;
}

const certificates: Certificate[] = [
  {
    id: 'csharp-w3schools',
    title: 'W3Schools: Certified in C# Programming',
    image: '/csharp-w3schools.png',
    url: 'https://www.coursera.org/account/accomplishments/verify/MBPJRHFZQ4AU',
    description: 'Certified in C# programming language. Demonstrated proficiency in object-oriented programming concepts.'
  },
  {
    id: 'unity-essentials',
    title: 'Unity Essentials Badge',
    image: '/unity-essentials.png',
    url: 'https://www.credly.com/badges/e8e68424-b685-4ecd-9320-cdedc893237a/linked_in_profile',
    description: 'Verified Credly badge for completion of the Unity Essentials pathway.'
  },
  {
    id: 'mlops-google',
    title: 'Google: Machine Learning Operations (MLOps) for Generative AI',
    image: '/mlops-google.png',
    url: 'https://www.cloudskillsboost.google/public_profiles/4a1472cd-92c3-42cb-982c-ada09de4e668/badges/16065226',
    description: 'Completed comprehensive certification in MLOps for Generative AI on Google Cloud Skills Boost.'
  },
  {
    id: 'ai-fundamentals-ibm',
    title: 'IBM: Artificial Intelligence Fundamentals',
    image: '/ai-fundamentals-ibm.png',
    url: 'https://www.credly.com/badges/159d748c-1491-430c-85dc-b030e039c545/linked_in_profile',
    description: 'Credly badge for IBM AI Fundamentals certification.'
  },
  {
    id: 'salesforce-agentblazer',
    title: 'Salesforce Developer: Agentblazer Champion',
    image: '/salesforce-agentblazer.png',
    url: 'https://drive.google.com/file/d/1fsq9x69JitZWlUYocxJ-wdmQv__y4QnZ/view',
    description: 'Completed 8-week virtual internship program and achieved champion status in Agentblazer.'
  },
  {
    id: 'github-copilot-microsoft',
    title: 'Microsoft: GitHub Copilot',
    image: '/github-copilot-microsoft.png',
    url: 'https://learn.microsoft.com/en-us/users/manish-3030/credentials/5432446d57c0275a',
    description: 'Microsoft Certified Specialist credential in GitHub Copilot.'
  },
  {
    id: 'oracle-ai-foundations',
    title: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
    image: '/oracle-ai-foundations.png',
    url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=322808110OCI25AICFA',
    description: 'Validates fundamental understanding of Artificial Intelligence and Machine Learning concepts and OCI AI features.'
  },
  {
    id: 'redhat-openshift',
    title: 'Red Hat OpenShift Development I: Introduction to Containers with Podman',
    image: '/redhat-openshift.png',
    url: 'https://www.credly.com/badges/ee9e258e-fdb0-4e09-a42a-028b0e5864e6',
    description: 'Demonstrates skills in containerizing applications and running them on Red Hat OpenShift.'
  },
  {
    id: 'oracle-devops',
    title: 'Oracle Cloud Infrastructure 2025 Certified DevOps Professional',
    image: '/oracle-devops.png',
    url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=7AEEBD9F190A5E0F1BF2490FF222E3ED36C1DEA1B8E5DD7C98CC3FFB3DB5BF3F',
    description: 'Equips you with essential skills to thrive in dynamic DevOps environments and leverage Oracle Cloud Infrastructure (OCI) to streamline workflows effectively.'
  },
  {
    id: 'oracle-datascience',
    title: 'Oracle Cloud Infrastructure 2025 Certified Data Science Professional',
    image: '/oracle-datascience.png',
    url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=7AEEBD9F190A5E0F1BF2490FF222E3ED67937320B849FD463D9563BE0724C73B',
    description: 'For data scientists responsible for building data science solutions and managing the complete lifecycle of machine learning models on OCI.'
  },
  {
    id: 'oracle-multicloud',
    title: 'Oracle Cloud Infrastructure 2025 Certified Multicloud Architect Professional',
    image: '/oracle-multicloud.png',
    url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=874DE1256B1E74975C92A9DB6DF686881F1496CAB463AC112327A36FD12F992C',
    description: 'Evaluates expertise in designing and implementing Oracle Cloud Infrastructure (OCI) multicloud solutions.'
  },
  {
    id: 'oracle-vectorsearch',
    title: 'Oracle AI Vector Search Certified Professional',
    image: '/oracle-vectorsearch.png',
    url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=03B9B8853EDC7FB8ACD75B913E009FA7F2E2A5D3FB50756E46DCBF3A2630A9C0',
    description: 'For DBAs and AI engineers to build AI-driven applications using vector data storage, indexing, and Retrieval-Augmented Generation (RAG) using PL/SQL and Python.'
  },
  {
    id: 'oracle-generativeai',
    title: 'Oracle Cloud Infrastructure 2025 Certified Generative AI Professional',
    image: '/oracle-generativeai.png',
    url: 'https://catalog-education.oracle.com/ords/certview/sharebadge?id=9D2354E114690816B73579DD1AD32E8862CC7E3174CC67A2181F91117829A614',
    description: 'Designed for ML/AI engineers to build, trace, evaluate, and deploy Large Language Model (LLM) applications using OCI Generative AI Service.'
  },
  {
    id: 'machine-learning-columbia',
    title: 'Columbia University: Machine Learning I',
    image: '/machine-learning-columbia.png',
    url: 'https://badges.plus.columbia.edu/8681f608-8b78-4e22-b6ff-7bd126b2857b#acc.WQmAhVl5',
    description: 'Certification showing proficiency in regression analysis and classification techniques.'
  }
];

const CertificateApp: React.FC = () => {
  const selectedCertificateId = useWindowStore((state) => state.selectedCertificateId);
  const setSelectedCertificateId = useWindowStore((state) => state.setSelectedCertificateId);
  const theme = useSystemStore((state) => state.theme);
  const isLight = theme === 'light';

  const activeCert = certificates.find((c) => c.id === selectedCertificateId);

  const toolbarClass = isLight
    ? 'bg-white/70 border-black/10 backdrop-blur-md'
    : 'bg-[#181d28]/95 border-white/5';

  const backBtnClass = isLight
    ? 'text-slate-500 hover:bg-black/[0.06] hover:text-slate-900 border-black/10'
    : 'text-slate-400 hover:bg-white/5 hover:text-white border-white/5';

  if (activeCert) {
    return (
      <div className={`flex flex-col h-full select-none overflow-hidden ${isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#0c101b] text-slate-200'}`}>
        {/* Navigation Toolbar */}
        <div className={`border-b px-4 py-2.5 flex items-center space-x-3 shadow-md ${toolbarClass}`}>
          <button
            onClick={() => setSelectedCertificateId(null)}
            className={`p-1.5 rounded-lg cursor-pointer transition-colors flex items-center justify-center border ${backBtnClass}`}
            title="Back to list"
          >
            <ArrowLeft size={16} />
          </button>
          <div className={`text-xs font-semibold tracking-wide truncate ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
            {activeCert.title}
          </div>
        </div>

        {/* Certificate Display Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col items-center"
        >
          <div className="max-w-3xl w-full liquid-glass-card rounded-2xl p-5 md:p-6 shadow-2xl flex flex-col items-center space-y-6">
            {/* Image Container */}
            <div className={`relative group w-full max-w-2xl rounded-xl overflow-hidden border shadow-2xl ${isLight ? 'border-black/10 bg-white/60' : 'border-white/15 bg-black/40'}`}>
              <img
                src={activeCert.image}
                alt={activeCert.title}
                className="w-full h-auto object-contain max-h-[450px]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/fedora-wallpaper.png';
                }}
              />
            </div>

            {/* Title and Description */}
            <div className="text-center max-w-xl space-y-3">
              <h1 className={`text-lg md:text-xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {activeCert.title}
              </h1>
              <p className={`text-xs md:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-300'}`}>
                {activeCert.description}
              </p>
            </div>

            {/* Verify Button */}
            <a
              href={activeCert.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 py-2.5 px-6 bg-[#3c6eb4] hover:bg-[#3c6eb4]/90 active:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer border border-white/10 transition-all duration-150 shadow-lg hover:shadow-[#3c6eb4]/20"
            >
              <span>Verify Credential</span>
              <ExternalLink size={12} />
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
      className={`flex flex-col h-full select-none overflow-y-auto p-6 ${isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#0c101b] text-slate-200'}`}
    >
      <h1 className={`text-xl font-bold mb-6 border-b pb-3 ${isLight ? 'text-slate-900 border-black/10' : 'text-white border-white/10'}`}>
        Certificates &amp; Credentials
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            onClick={() => setSelectedCertificateId(cert.id)}
            className={`cursor-pointer border p-4 rounded-xl flex items-center space-x-4 transition-all duration-200 shadow-md group hover:liquid-glass-card ${
              isLight
                ? 'bg-black/[0.02] border-black/8 hover:border-black/15'
                : 'bg-white/[0.02] border-white/5'
            }`}
          >
            <div className={`w-16 h-12 rounded-lg overflow-hidden border flex-shrink-0 ${isLight ? 'border-black/10 bg-white/60' : 'border-white/10 bg-black/40'}`}>
              <img
                src={cert.image}
                alt={cert.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/fedora-wallpaper.png';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className={`text-xs font-bold truncate transition-colors group-hover:text-[#3c6eb4] ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>
                {cert.title}
              </h2>
              <p className={`text-[10px] line-clamp-2 mt-1 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                {cert.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default CertificateApp;
