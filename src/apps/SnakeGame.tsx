import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, RefreshCw, Layers, Zap } from 'lucide-react';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

interface SnakeMap {
  id: string;
  name: string;
  walls: Position[];
  targetScore: number;
}

// Generate walls for Snake Xenzia Nokia maps (grid size: 20x20, coordinates: 0-19)
const MAPS: SnakeMap[] = [
  {
    id: 'box',
    name: 'Map 1: Box',
    walls: [], // Box map has no inner walls, only borders (borders are handled in collision)
    targetScore: 50,
  },
  {
    id: 'tunnel',
    name: 'Map 2: Tunnel',
    // Vertical rails in the middle left and middle right
    walls: [
      { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 }, { x: 5, y: 8 }, { x: 5, y: 9 },
      { x: 5, y: 10 }, { x: 5, y: 11 }, { x: 5, y: 12 }, { x: 5, y: 13 }, { x: 5, y: 14 },
      { x: 14, y: 5 }, { x: 14, y: 6 }, { x: 14, y: 7 }, { x: 14, y: 8 }, { x: 14, y: 9 },
      { x: 14, y: 10 }, { x: 14, y: 11 }, { x: 14, y: 12 }, { x: 14, y: 13 }, { x: 14, y: 14 },
    ],
    targetScore: 70,
  },
  {
    id: 'rails',
    name: 'Map 3: Rails',
    // Four horizontal lines
    walls: [
      { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 }, { x: 6, y: 5 }, { x: 7, y: 5 },
      { x: 12, y: 5 }, { x: 13, y: 5 }, { x: 14, y: 5 }, { x: 15, y: 5 }, { x: 16, y: 5 },
      { x: 3, y: 14 }, { x: 4, y: 14 }, { x: 5, y: 14 }, { x: 6, y: 14 }, { x: 7, y: 14 },
      { x: 12, y: 14 }, { x: 13, y: 14 }, { x: 14, y: 14 }, { x: 15, y: 14 }, { x: 16, y: 14 },
    ],
    targetScore: 95,
  },
  {
    id: 'apartment',
    name: 'Map 4: Apartment',
    // Corner block walls that create room-like structures
    walls: [
      { x: 4, y: 4 }, { x: 5, y: 4 }, { x: 6, y: 4 }, { x: 4, y: 5 }, { x: 4, y: 6 },
      { x: 15, y: 4 }, { x: 14, y: 4 }, { x: 13, y: 4 }, { x: 15, y: 5 }, { x: 15, y: 6 },
      { x: 4, y: 15 }, { x: 5, y: 15 }, { x: 6, y: 15 }, { x: 4, y: 14 }, { x: 4, y: 13 },
      { x: 15, y: 15 }, { x: 14, y: 15 }, { x: 13, y: 15 }, { x: 15, y: 14 }, { x: 15, y: 13 },
      { x: 9, y: 9 }, { x: 10, y: 9 }, { x: 9, y: 10 }, { x: 10, y: 10 }
    ],
    targetScore: 120,
  }
];

const GRID_SIZE = 20;

const SnakeGame: React.FC = () => {
  const [selectedMapIndex, setSelectedMapIndex] = useState(0);
  const [successionMode, setSuccessionMode] = useState(false);
  const [snake, setSnake] = useState<Position[]>([
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 }
  ]);
  const [food, setFood] = useState<Position>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('UP');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScores, setHighScores] = useState<Record<string, number>>({});
  const [speed, setSpeed] = useState(150); // Speed in ms

  const currentMap = MAPS[selectedMapIndex];

  // Load high scores on mount
  useEffect(() => {
    const scores: Record<string, number> = {};
    MAPS.forEach((map) => {
      const saved = localStorage.getItem(`snake_high_${map.id}`);
      scores[map.id] = saved ? parseInt(saved, 10) : 0;
    });
    setHighScores(scores);
  }, []);

  // Save new high score
  const updateHighScore = useCallback((mapId: string, newScore: number) => {
    const currentHigh = highScores[mapId] || 0;
    if (newScore > currentHigh) {
      localStorage.setItem(`snake_high_${mapId}`, newScore.toString());
      setHighScores(prev => ({ ...prev, [mapId]: newScore }));
    }
  }, [highScores]);

  // Generate food avoiding snake and walls
  const generateFood = useCallback((currentSnake: Position[]) => {
    let newFood: Position;
    let attempts = 0;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      attempts++;
    } while (
      (currentSnake.some(s => s.x === newFood.x && s.y === newFood.y) ||
      currentMap.walls.some(w => w.x === newFood.x && w.y === newFood.y)) &&
      attempts < 400
    );
    setFood(newFood);
  }, [currentMap]);

  // Reset Game
  const resetGame = useCallback((mapIdx = selectedMapIndex) => {
    setSnake([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ]);
    setDirection('UP');
    setIsGameOver(false);
    setScore(0);
    setIsPlaying(true);
    setSpeed(150);
    
    // Generate food for the new snake
    const initialSnake = [
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 }
    ];
    let newFood: Position;
    const targetMap = MAPS[mapIdx];
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (
      initialSnake.some(s => s.x === newFood.x && s.y === newFood.y) ||
      targetMap.walls.some(w => w.x === newFood.x && w.y === newFood.y)
    );
    setFood(newFood);
  }, [selectedMapIndex]);

  // Handle succession advancement
  const handleSuccessionSuccess = useCallback(() => {
    if (selectedMapIndex < MAPS.length - 1) {
      const nextIdx = selectedMapIndex + 1;
      setSelectedMapIndex(nextIdx);
      resetGame(nextIdx);
    } else {
      setIsPlaying(false);
      setIsGameOver(true);
      alert('Congratulations! You completed Nokia Succession Mode!');
    }
  }, [selectedMapIndex, resetGame]);

  // Game Loop
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const gameInterval = setInterval(() => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        let newHead = { ...head };

        switch (direction) {
          case 'UP':
            newHead.y -= 1;
            break;
          case 'DOWN':
            newHead.y += 1;
            break;
          case 'LEFT':
            newHead.x -= 1;
            break;
          case 'RIGHT':
            newHead.x += 1;
            break;
        }

        // Boundary Collision (Xenzia style - hitting wall = game over)
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setIsGameOver(true);
          setIsPlaying(false);
          updateHighScore(currentMap.id, score);
          return prevSnake;
        }

        // Wall Collision
        if (currentMap.walls.some(w => w.x === newHead.x && w.y === newHead.y)) {
          setIsGameOver(true);
          setIsPlaying(false);
          updateHighScore(currentMap.id, score);
          return prevSnake;
        }

        // Self Collision
        if (prevSnake.some(s => s.x === newHead.x && s.y === newHead.y)) {
          setIsGameOver(true);
          setIsPlaying(false);
          updateHighScore(currentMap.id, score);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Eat Food
        if (newHead.x === food.x && newHead.y === food.y) {
          const nextScore = score + 10;
          setScore(nextScore);
          updateHighScore(currentMap.id, nextScore);
          
          // Succession Mode criteria check
          if (successionMode && nextScore >= currentMap.targetScore) {
            clearInterval(gameInterval);
            setTimeout(() => {
              handleSuccessionSuccess();
            }, 100);
            return prevSnake;
          }

          generateFood(newSnake);
          // Increase speed slightly
          if (speed > 50) {
            setSpeed(prev => Math.max(50, prev - 3));
          }
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speed);

    return () => clearInterval(gameInterval);
  }, [isPlaying, isGameOver, direction, food, score, speed, currentMap, generateFood, updateHighScore, successionMode, selectedMapIndex, handleSuccessionSuccess]);

  // Key Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isGameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isGameOver, direction]);

  return (
    <div className="flex h-full select-none text-[#1b2a1a] p-4 bg-slate-950 font-mono overflow-y-auto keep-dark">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 w-full">
        
        {/* Nokia 3310 Mobile Retro Frame */}
        <div className="relative w-[280px] h-[480px] bg-gradient-to-b from-gray-700 to-gray-900 rounded-[40px] border-4 border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.2)] flex flex-col items-center p-3 select-none">
          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 mb-2">NOKIA</div>
          
          {/* LCD Screen Display */}
          <div className="relative w-[230px] h-[210px] bg-[#9bb08f] rounded-lg border-[6px] border-slate-950 shadow-[inset_0_4px_8px_rgba(0,0,0,0.4)] flex flex-col p-1.5 overflow-hidden">
            {/* Status bar */}
            <div className="flex justify-between items-center border-b border-[#1b2a1a]/30 pb-0.5 text-[8px] font-bold select-none">
              <span className="truncate max-w-[100px]">{successionMode ? 'SUCCESSION' : currentMap.name}</span>
              <span className="font-mono">SCORE:{score}</span>
            </div>

            {/* Canvas grid container */}
            <div className="flex-1 relative bg-[#9bb08f] border border-[#1b2a1a]/15 mt-1 grid grid-cols-20 grid-rows-20 gap-[0.5px]">
              {/* Outer border check overlay */}
              {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, idx) => {
                const x = idx % GRID_SIZE;
                const y = Math.floor(idx / GRID_SIZE);

                const isSnake = snake.some(s => s.x === x && s.y === y);
                const isHead = snake[0]?.x === x && snake[0]?.y === y;
                const isFood = food.x === x && food.y === y;
                const isWall = currentMap.walls.some(w => w.x === x && w.y === y);

                return (
                  <div
                    key={idx}
                    className={`w-full h-full rounded-[1px] transition-all duration-75 ${
                      isHead
                        ? 'bg-[#1b2a1a] shadow-[inset_0_0_1px_#9bb08f]'
                        : isSnake
                        ? 'bg-[#2d422b]'
                        : isFood
                        ? 'bg-[#1b2a1a] animate-pulse rounded-full'
                        : isWall
                        ? 'bg-[#1b2a1a]'
                        : 'bg-transparent'
                    }`}
                  />
                );
              })}

              {/* Game overlays */}
              {(!isPlaying || isGameOver) && (
                <div className="absolute inset-0 bg-[#9bb08f]/95 flex flex-col items-center justify-center text-center p-3 text-[#1b2a1a] select-none">
                  {isGameOver ? (
                    <>
                      <h2 className="text-sm font-bold tracking-widest uppercase mb-1">GAME OVER</h2>
                      <p className="text-[9px] mb-2 font-semibold">SCORE: {score}</p>
                      <button
                        onClick={() => resetGame()}
                        className="px-2.5 py-1 text-[8px] bg-[#1b2a1a] text-[#9bb08f] rounded font-bold border border-[#1b2a1a] hover:bg-[#2d422b]"
                      >
                        RESTART
                      </button>
                    </>
                  ) : (
                    <>
                      <h2 className="text-sm font-bold tracking-wider uppercase mb-1">SNAKE XENZIA</h2>
                      <p className="text-[8px] mb-3 text-center">
                        {successionMode
                          ? `Reach ${currentMap.targetScore} pts to unlock next map.`
                          : 'Classic Nokia simulation game.'}
                      </p>
                      <button
                        onClick={() => resetGame()}
                        className="px-3 py-1.5 text-[9px] bg-[#1b2a1a] text-[#9bb08f] rounded font-bold border border-[#1b2a1a] hover:bg-[#2d422b] uppercase tracking-wider cursor-pointer"
                      >
                        PLAY NOW
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Physical Keypad Simulation */}
          <div className="mt-4 w-full grid grid-cols-3 gap-2 px-6 select-none">
            {/* Top row controls */}
            <div className="h-9" />
            <button
              onClick={() => isPlaying && direction !== 'DOWN' && setDirection('UP')}
              className="h-9 bg-slate-700 active:bg-slate-800 text-slate-300 rounded-lg flex items-center justify-center text-[10px] font-bold border border-slate-600 shadow cursor-pointer"
            >
              ▲
            </button>
            <div className="h-9" />

            {/* Left Right */}
            <button
              onClick={() => isPlaying && direction !== 'RIGHT' && setDirection('LEFT')}
              className="h-9 bg-slate-700 active:bg-slate-800 text-slate-300 rounded-lg flex items-center justify-center text-[10px] font-bold border border-slate-600 shadow cursor-pointer"
            >
              ◀
            </button>
            <div className="h-9 bg-slate-600 text-slate-400 rounded-full flex items-center justify-center text-[9px]">5</div>
            <button
              onClick={() => isPlaying && direction !== 'LEFT' && setDirection('RIGHT')}
              className="h-9 bg-slate-700 active:bg-slate-800 text-slate-300 rounded-lg flex items-center justify-center text-[10px] font-bold border border-slate-600 shadow cursor-pointer"
            >
              ▶
            </button>

            {/* Down */}
            <div className="h-9" />
            <button
              onClick={() => isPlaying && direction !== 'UP' && setDirection('DOWN')}
              className="h-9 bg-slate-700 active:bg-slate-800 text-slate-300 rounded-lg flex items-center justify-center text-[10px] font-bold border border-slate-600 shadow cursor-pointer"
            >
              ▼
            </button>
            <div className="h-9" />
          </div>
        </div>

        {/* Side panel controls */}
        <div className="flex-1 bg-slate-900/60 border border-white/10 rounded-2xl p-5 text-gray-300 flex flex-col justify-between self-stretch min-h-[440px]">
          <div>
            <h1 className="text-lg font-bold text-white mb-2 flex items-center border-b border-white/10 pb-2">
              <Zap className="mr-2 text-yellow-500" size={18} />
              Snake Xenzia
            </h1>
            
            {/* Mode selection */}
            <div className="flex space-x-2 mb-4 mt-2">
              <button
                onClick={() => {
                  setSuccessionMode(false);
                  setIsPlaying(false);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  !successionMode
                    ? 'bg-blue-600 border-blue-500 text-white font-bold'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                Classic Mode
              </button>
              <button
                onClick={() => {
                  setSuccessionMode(true);
                  setSelectedMapIndex(0);
                  setIsPlaying(false);
                }}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  successionMode
                    ? 'bg-yellow-600 border-yellow-500 text-white font-bold'
                    : 'bg-white/5 border-white/10 text-gray-400'
                }`}
              >
                Succession Mode
              </button>
            </div>

            {/* Map selection in Classic Mode */}
            {!successionMode ? (
              <div className="mb-4">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block mb-1.5">Select Map</span>
                <div className="space-y-1">
                  {MAPS.map((map, i) => (
                    <div
                      key={map.id}
                      onClick={() => {
                        setSelectedMapIndex(i);
                        setIsPlaying(false);
                      }}
                      className={`flex justify-between items-center p-2 rounded-lg cursor-pointer border text-xs font-medium ${
                        selectedMapIndex === i
                          ? 'bg-[#3c6eb4]/20 border-[#3c6eb4] text-white'
                          : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      <span>{map.name}</span>
                      <span className="text-[10px] opacity-75 font-semibold">High: {highScores[map.id] || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3.5 mb-4 text-xs">
                <div className="font-bold text-yellow-400 mb-1 flex items-center">
                  <Layers size={14} className="mr-1.5" />
                  Succession Progress
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed mb-3">
                  Start from Map 1. Beat the target score to advance to the next map.
                </p>
                <div className="space-y-1.5">
                  {MAPS.map((map, i) => {
                    const isUnlocked = i <= selectedMapIndex;
                    const isCurrent = i === selectedMapIndex;
                    return (
                      <div
                        key={map.id}
                        className={`flex justify-between items-center p-2 rounded-lg border text-[10px] ${
                          isCurrent
                            ? 'bg-yellow-500/20 border-yellow-500 text-white font-semibold'
                            : isUnlocked
                            ? 'bg-white/5 border-white/5 text-green-400'
                            : 'bg-white/5 border-white/5 text-gray-600 opacity-50'
                        }`}
                      >
                        <span className="flex items-center">
                          <span className="mr-2">{isUnlocked ? '✓' : '🔒'}</span>
                          {map.name}
                        </span>
                        <span>Goal: {map.targetScore} pts</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* High Scores summary */}
          <div className="border-t border-white/5 pt-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2.5 flex items-center">
              <Trophy size={12} className="mr-1.5 text-yellow-500" />
              Highest Records
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              {MAPS.map(map => (
                <div key={map.id} className="bg-white/5 p-2 rounded-lg border border-white/5">
                  <div className="text-gray-500 text-[8px] font-bold uppercase truncate">{map.name.split(':')[1].trim()}</div>
                  <div className="text-sm font-bold text-white mt-0.5">{highScores[map.id] || 0}</div>
                </div>
              ))}
            </div>
            
            {/* Keyboard tips */}
            <div className="text-[8px] text-gray-500 mt-4 leading-normal flex items-center space-x-1.5">
              <RefreshCw size={10} />
              <span>Use standard Keyboard Arrow Keys or WASD to navigate snake.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SnakeGame;
