import React from 'react';
import { useSystemStore } from '../store/useSystemStore';

const AboutApp: React.FC = () => {
  const theme = useSystemStore((state) => state.theme);
  const isLight = theme === 'light';

  return (
    <div className={`p-8 h-full overflow-y-auto max-w-2xl mx-auto select-none ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
      <div className="flex items-center space-x-6 mb-8">
        <div className="w-24 h-24 rounded-full overflow-hidden border border-white/20 shadow-xl relative animate-float">
          <img src="/avatar.jpg" alt="Manish Kumar Vodlamodi" className="w-full h-full object-cover" />
          <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-md -z-10" />
        </div>
        <div>
          <h1 className={`text-3xl font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>Manish Kumar Vodlamodi</h1>
          <p className="text-[#3c6eb4] font-medium text-base">Computer Science &amp; AI/ML Student</p>
        </div>
      </div>

      <div className={`space-y-6 leading-relaxed text-sm ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
        <p className={`text-base ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>
          I'm a Computer Science Engineering student at Malla Reddy College of Engineering and Technology,
          specializing in AI/ML with a CGPA of 8.3. I'm passionate about developing innovative solutions that
          combine web development with artificial intelligence. I enjoy building scalable collaboration platforms,
          AI-powered applications, and exploring the intersection of healthcare and technology.
        </p>

        <section>
          <h2 className={`text-lg font-semibold mt-6 border-b pb-2 mb-2 ${isLight ? 'text-slate-900 border-black/10' : 'text-white border-white/10'}`}>Education</h2>
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between items-start">
              <span className={`font-semibold ${isLight ? 'text-slate-800' : 'text-slate-100'}`}>B.Tech in Computer Science and Engineering (AI/ML)</span>
              <span className={`text-xs whitespace-nowrap ml-4 ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Sep 2023 – June 2027</span>
            </div>
            <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>Malla Reddy College of Engineering and Technology</div>
            <div className={`text-xs ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>CGPA: 8.3</div>
          </div>
        </section>

        <section>
          <h2 className={`text-lg font-semibold mt-6 border-b pb-2 mb-2 ${isLight ? 'text-slate-900 border-black/10' : 'text-white border-white/10'}`}>Interests</h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              'AI & Machine Learning',
              'Web Development',
              'Software Engineering',
              'Generative AI',
              'Real-time Systems',
              'Healthcare Technology',
              'MLOps',
              'Game Development'
            ].map(interest => (
              <span
                key={interest}
                className={`px-2.5 py-1 rounded-full ${isLight ? 'bg-black/[0.04] border border-black/10 text-slate-700' : 'bg-white/5 border border-white/10 text-slate-300'}`}
              >
                {interest}
              </span>
            ))}
          </div>
        </section>

        <section>
          <h2 className={`text-lg font-semibold mt-6 border-b pb-2 mb-2 ${isLight ? 'text-slate-900 border-black/10' : 'text-white border-white/10'}`}>Philosophy</h2>
          <p className={`italic font-serif ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            "The best way to predict the future is to create it." — Peter Drucker
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutApp;
