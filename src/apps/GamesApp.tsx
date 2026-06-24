import React, { useState, useEffect } from 'react';
import { Gamepad2, Trophy, ArrowLeft, Star } from 'lucide-react';
import SnakeGame from './SnakeGame';
import TetrisGame from './TetrisGame';
import FlappyBirdGame from './FlappyBirdGame';
import SpaceFighterGame from './SpaceFighterGame';
import DinoJumpGame from './DinoJumpGame';
import { useSystemStore } from '../store/useSystemStore';

interface GameItem {
  id: string;
  title: string;
  description: string;
  color: string;
  component: React.ComponentType;
  highScoreKey: string;
}

const GamesApp: React.FC = () => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [scores, setScores] = useState<Record<string, number | string>>({});
  const theme = useSystemStore((state) => state.theme);
  const isLight = theme === 'light';

  const gamesList: GameItem[] = [
    {
      id: 'snake',
      title: 'Snake Xenzia',
      description: 'Classic Nokia retro snake game with multiple maps and succession mode.',
      color: 'from-green-600 to-emerald-700 border-green-500/20 text-green-400',
      component: SnakeGame,
      highScoreKey: 'snake_high_box',
    },
    {
      id: 'tetris',
      title: 'Tetris',
      description: 'Classical block puzzle game with falling tetrominoes and line clearance.',
      color: 'from-purple-600 to-indigo-700 border-purple-500/20 text-purple-400',
      component: TetrisGame,
      highScoreKey: 'tetris_high_score',
    },
    {
      id: 'flappy',
      title: 'Flappy Bird',
      description: 'Tap to flap and guide the golden bird between the green pipe obstacles.',
      color: 'from-yellow-500 to-amber-600 border-yellow-500/20 text-yellow-400',
      component: FlappyBirdGame,
      highScoreKey: 'flappy_high_score',
    },
    {
      id: 'space-fighter',
      title: 'Space Fighter',
      description: '2D arcade space shooter with mouse tracking controls and auto-cannons.',
      color: 'from-sky-600 to-blue-700 border-sky-500/20 text-sky-400',
      component: SpaceFighterGame,
      highScoreKey: 'space_high_score',
    },
    {
      id: 'dino',
      title: 'Dino Jump',
      description: 'Chrome dino runner style jump game. Jump over cacti and duck under birds.',
      color: 'from-gray-600 to-slate-700 border-slate-500/20 text-slate-400',
      component: DinoJumpGame,
      highScoreKey: 'dino_high_score',
    }
  ];

  useEffect(() => {
    const loadedScores: Record<string, number | string> = {};
    gamesList.forEach(game => {
      if (game.id === 'snake') {
        const saved = localStorage.getItem('snake_high_box');
        loadedScores[game.id] = saved ? parseInt(saved, 10) : 0;
      } else {
        const saved = localStorage.getItem(game.highScoreKey);
        loadedScores[game.id] = saved ? parseInt(saved, 10) : 0;
      }
    });
    setScores(loadedScores);
  }, [activeGameId]);

  const activeGame = gamesList.find(g => g.id === activeGameId);
  const ActiveGameComponent = activeGame ? activeGame.component : null;

  const headerClass = isLight
    ? 'bg-white/70 border-black/10 backdrop-blur-md'
    : 'bg-[#12182b]/95 border-white/5';

  const headerTitleClass = isLight ? 'text-slate-900' : 'text-white';
  const backBtnClass = isLight
    ? 'text-slate-500 hover:bg-black/[0.06] hover:text-slate-900 border-black/10'
    : 'text-slate-400 hover:bg-white/5 hover:text-white border-white/5';

  const arcadeBadgeClass = isLight
    ? 'bg-[#3c6eb4]/10 border-[#3c6eb4]/20 text-slate-800'
    : 'bg-[#3c6eb4]/10 border-[#3c6eb4]/20 text-white';

  const bannerDescClass = isLight ? 'text-slate-600' : 'text-slate-400';
  const bannerTitleClass = isLight ? 'text-slate-900' : 'text-white';

  const cardDescClass = isLight ? 'text-slate-600' : 'text-slate-400';
  const cardTitleClass = isLight ? 'text-slate-900' : 'text-white';

  return (
    <div className={`flex flex-col h-full select-none ${isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#0a0f1d] text-slate-200'}`}>

      {/* Header bar — always light-theme-aware */}
      <div className={`border-b px-5 py-3 flex items-center justify-between shadow-md z-10 ${headerClass}`}>
        <div className="flex items-center space-x-3">
          {activeGameId && (
            <button
              onClick={() => setActiveGameId(null)}
              className={`p-1.5 active:bg-black/10 rounded-xl transition-all cursor-pointer border ${backBtnClass}`}
              title="Back to Arcade Dashboard"
            >
              <ArrowLeft size={16} />
            </button>
          )}
          <Gamepad2 className="text-[#3c6eb4]" size={20} />
          <span className={`text-sm font-bold tracking-wide ${headerTitleClass}`}>
            {activeGame ? activeGame.title : 'Arcade Games'}
          </span>
        </div>

        {!activeGameId && (
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl border ${arcadeBadgeClass}`}>
            <Trophy size={14} className="text-yellow-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Arcade Center</span>
          </div>
        )}
      </div>

      {/* Main View Area */}
      <div className="flex-1 overflow-hidden relative">
        {ActiveGameComponent ? (
          /* Game canvas: always keep-dark so the canvas remains readable */
          <div className="h-full w-full keep-dark">
            <ActiveGameComponent />
          </div>
        ) : (
          /* Dashboard - adapts to theme */
          <div className="h-full overflow-y-auto p-6 md:p-8 max-w-4xl mx-auto space-y-6">

            {/* Welcome banner */}
            <div className="liquid-glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="absolute inset-0 bg-[#3c6eb4]/5 blur-3xl -z-10" />
              <div className="space-y-1 text-center md:text-left">
                <h2 className={`text-lg font-bold tracking-wide ${bannerTitleClass}`}>Retro Arcade Console</h2>
                <p className={`text-xs leading-relaxed max-w-md ${bannerDescClass}`}>
                  Launch any of the pre-loaded retro games below. All high scores are stored locally in the environment.
                </p>
              </div>
              <Gamepad2 size={48} className="text-[#3c6eb4]/30 animate-pulse hidden md:block" />
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gamesList.map(game => (
                <div
                  key={game.id}
                  className="liquid-glass-card rounded-2xl p-5 hover:scale-[1.01] transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-bold tracking-wide text-sm ${cardTitleClass}`}>{game.title}</h3>
                      <div className="flex items-center space-x-1.5 text-xs text-amber-500 bg-amber-500/10 border border-amber-500/15 px-2 py-0.5 rounded-lg font-semibold">
                        <Star size={10} className="fill-amber-500" />
                        <span>High: {scores[game.id] || 0}</span>
                      </div>
                    </div>
                    <p className={`text-xs leading-relaxed ${cardDescClass}`}>{game.description}</p>
                  </div>

                  <div className="mt-5">
                    <button
                      onClick={() => setActiveGameId(game.id)}
                      className={`w-full py-2 bg-gradient-to-r ${game.color} hover:brightness-110 active:scale-[0.98] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md`}
                    >
                      Play Game
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}
      </div>

    </div>
  );
};

export default GamesApp;
