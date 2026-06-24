import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface Obstacle {
  x: number;
  width: number;
  height: number;
  type: 'cactus_small' | 'cactus_large' | 'bird';
  y: number;
}

const DinoJumpGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Sound generator
  const playSound = useCallback((frequency: number, type: 'sine' | 'square' | 'triangle' | 'sawtooth' = 'sine', duration = 0.1) => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);

      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio Context warning:', e);
    }
  }, [isMuted]);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('dino_high_score');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const updateHighScore = useCallback((currentScore: number) => {
    const saved = localStorage.getItem('dino_high_score');
    const currentHigh = saved ? parseInt(saved, 10) : 0;
    if (currentScore > currentHigh) {
      localStorage.setItem('dino_high_score', currentScore.toString());
      setHighScore(currentScore);
    }
  }, []);

  const jumpRef = useRef<() => void>(() => {});
  const duckRef = useRef<(isDucking: boolean) => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Game Constants
    const groundY = 120;
    let dinoY = groundY;
    let dinoVy = 0;
    const gravity = 0.6;
    const jumpForce = -9.0;
    const dinoWidth = 22;
    const dinoHeight = 24;

    let isDucking = false;
    let runFrame = 0;

    let obstacles: Obstacle[] = [];
    let gameSpeed = 3.5;
    let obstacleTimer = 0;
    let currentScore = 0;

    // Star/Cloud decorations
    const clouds: { x: number; y: number; speed: number }[] = [];
    for (let i = 0; i < 3; i++) {
      clouds.push({
        x: Math.random() * canvas.width + i * 100,
        y: Math.random() * 40 + 20,
        speed: Math.random() * 0.2 + 0.1
      });
    }

    const resetLogic = () => {
      dinoY = groundY;
      dinoVy = 0;
      obstacles = [];
      gameSpeed = 3.5;
      obstacleTimer = 0;
      currentScore = 0;
      setScore(0);
      setIsGameOver(false);
    };

    const jump = () => {
      if (isGameOver) return;
      if (!isPlaying) {
        setIsPlaying(true);
        playSound(440, 'sine', 0.1);
        return;
      }
      if (dinoY === groundY && !isDucking) {
        dinoVy = jumpForce;
        playSound(600, 'sine', 0.08);
      }
    };

    const setDuckingState = (ducking: boolean) => {
      isDucking = ducking;
    };

    jumpRef.current = jump;
    duckRef.current = setDuckingState;

    const draw = () => {
      // Clear (White/Grey retro background)
      ctx.fillStyle = '#f7f7f7';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Horizon Line
      ctx.strokeStyle = '#535353';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, groundY + dinoHeight);
      ctx.lineTo(canvas.width, groundY + dinoHeight);
      ctx.stroke();

      // Horizontal ground bumps
      ctx.fillStyle = '#737373';
      for (let i = 0; i < canvas.width; i += 80) {
        const lineOffset = (i - (currentScore * 0.5) % 80);
        ctx.fillRect(lineOffset, groundY + dinoHeight + 4, 15, 1);
        ctx.fillRect(lineOffset + 30, groundY + dinoHeight + 8, 8, 1);
      }

      // 2. Draw Clouds
      clouds.forEach(c => {
        if (isPlaying && !isGameOver) {
          c.x -= c.speed;
          if (c.x < -40) {
            c.x = canvas.width + 10;
            c.y = Math.random() * 40 + 20;
          }
        }
        // Classic cloud shapes
        ctx.fillStyle = '#d3d3d3';
        ctx.fillRect(c.x, c.y, 25, 6);
        ctx.fillRect(c.x + 5, c.y - 4, 15, 4);
      });

      if (isPlaying && !isGameOver) {
        // Physics update
        dinoVy += gravity;
        dinoY += dinoVy;

        if (dinoY > groundY) {
          dinoY = groundY;
          dinoVy = 0;
        }

        // Score tick
        currentScore += 0.15;
        const dispScore = Math.floor(currentScore);
        setScore(dispScore);
        updateHighScore(dispScore);

        // Increase speed slightly
        gameSpeed = 3.5 + Math.floor(dispScore / 100) * 0.4;

        // Obstacles spawn logic
        obstacleTimer++;
        if (obstacleTimer >= 90 + Math.random() * 80) {
          const rand = Math.random();
          if (rand < 0.4) {
            // Small Cactus
            obstacles.push({
              x: canvas.width,
              width: 10,
              height: 18,
              type: 'cactus_small',
              y: groundY + dinoHeight - 18
            });
          } else if (rand < 0.75) {
            // Large Cactus
            obstacles.push({
              x: canvas.width,
              width: 16,
              height: 24,
              type: 'cactus_large',
              y: groundY + dinoHeight - 24
            });
          } else if (dispScore > 150) {
            // Flying Bird
            obstacles.push({
              x: canvas.width,
              width: 16,
              height: 12,
              type: 'bird',
              y: groundY - Math.floor(Math.random() * 20)
            });
          }
          obstacleTimer = 0;
        }

        // Move obstacles
        obstacles.forEach(obs => {
          obs.x -= gameSpeed;
        });

        // Collision logic
        obstacles.forEach(obs => {
          // Adjust hitbox for ducking
          const dinoLeft = 30;
          const dinoRight = 30 + dinoWidth;
          const dinoTop = dinoY + (isDucking ? 10 : 0);
          const dinoBottom = dinoY + dinoHeight;

          const obsLeft = obs.x;
          const obsRight = obs.x + obs.width;
          const obsTop = obs.y;
          const obsBottom = obs.y + obs.height;

          if (dinoRight - 4 > obsLeft && dinoLeft + 4 < obsRight) {
            if (dinoBottom - 2 > obsTop && dinoTop + 2 < obsBottom) {
              setIsGameOver(true);
              setIsPlaying(false);
              playSound(150, 'sawtooth', 0.35);
            }
          }
        });

        // Filter offscreen obstacles
        obstacles = obstacles.filter(obs => obs.x > -30);

        // Run frame step
        runFrame = (runFrame + 0.15) % 2;
      }

      // 3. Draw Dino (T-Rex layout block style)
      ctx.fillStyle = '#535353';
      const actualDinoHeight = isDucking ? 14 : dinoHeight;
      const actualDinoWidth = isDucking ? 28 : dinoWidth;
      const drawDinoY = dinoY + (isDucking ? 10 : 0);

      // Render dino shape
      if (isGameOver) {
        // Crash frame (Dino eyes crossed X)
        ctx.fillRect(30, drawDinoY, actualDinoWidth, actualDinoHeight);
        ctx.fillStyle = '#f7f7f7';
        ctx.fillRect(44, drawDinoY + 3, 2, 2); // eye cutout
      } else if (dinoY < groundY) {
        // Jump frame
        ctx.fillRect(30, drawDinoY, actualDinoWidth, actualDinoHeight);
      } else {
        // Run frames
        ctx.fillRect(30, drawDinoY, actualDinoWidth, actualDinoHeight);
        
        // Render simple running legs cutout
        ctx.fillStyle = '#f7f7f7';
        if (Math.floor(runFrame) === 0) {
          ctx.fillRect(32, drawDinoY + actualDinoHeight - 3, 4, 3);
        } else {
          ctx.fillRect(40, drawDinoY + actualDinoHeight - 3, 4, 3);
        }
      }

      // 4. Draw Obstacles
      obstacles.forEach(obs => {
        ctx.fillStyle = '#535353';
        if (obs.type === 'cactus_small') {
          // Small Cactus
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.fillRect(obs.x - 3, obs.y + 4, 3, 3); // left arm
          ctx.fillRect(obs.x + obs.width, obs.y + 2, 3, 4); // right arm
        } else if (obs.type === 'cactus_large') {
          // Large double/triple Cactus
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          ctx.fillRect(obs.x - 4, obs.y + 6, 4, 4); // left arm
          ctx.fillRect(obs.x + obs.width, obs.y + 4, 4, 6); // right arm
        } else {
          // Bird
          ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
          // Wings flapping
          const wingOffset = Math.floor(runFrame) === 0 ? -4 : 4;
          ctx.fillRect(obs.x + 4, obs.y + wingOffset, 6, 4);
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    if (!isPlaying) {
      resetLogic();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, isGameOver, playSound]);

  // Bind key inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w') {
        e.preventDefault();
        jumpRef.current();
      } else if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        duckRef.current(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 's') {
        e.preventDefault();
        duckRef.current(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="flex h-full select-none text-gray-300 bg-[#0e0e0e] font-sans p-6 overflow-y-auto keep-dark">
      <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 w-full">
        
        {/* Game Canvas Box */}
        <div 
          onClick={() => jumpRef.current()}
          className="relative border-[8px] border-slate-800 bg-[#f7f7f7] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden cursor-pointer flex flex-col w-[280px] h-[450px]"
        >
          <canvas 
            ref={canvasRef} 
            width={264} 
            height={434} 
            className="w-full h-full block bg-[#f7f7f7]"
          />

          {/* Overlays */}
          {(!isPlaying || isGameOver) && (
            <div className="absolute inset-0 bg-slate-950/80 flex flex-col items-center justify-center text-center p-5 z-20">
              {isGameOver ? (
                <>
                  <h2 className="text-xl font-black text-red-500 tracking-wider mb-2">GAME OVER</h2>
                  <p className="text-xs text-gray-400 mb-6 font-mono">FINAL SCORE: {score}</p>
                  <button
                    onClick={() => {
                      setIsPlaying(true);
                    }}
                    className="flex items-center space-x-2 py-2 px-5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-all border border-slate-600 shadow-lg"
                  >
                    <RotateCcw size={14} />
                    <span>TAP TO RESTART</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-slate-700/10 rounded-2xl flex items-center justify-center border border-slate-700/20 mb-4 text-slate-400">
                    <Play size={28} className="ml-1" />
                  </div>
                  <h2 className="text-lg font-bold text-white mb-2">Dino Jump</h2>
                  <p className="text-[11px] text-gray-400 max-w-[190px] leading-relaxed mb-6">
                    Tap to jump over cacti and birds. Hold Down Arrow to duck under obstacles.
                  </p>
                  <button
                    className="py-2.5 px-6 bg-slate-700 hover:bg-slate-650 text-white rounded-xl text-xs font-bold cursor-pointer transition-all border border-white/10 shadow-lg"
                  >
                    CLICK TO JUMP
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Side statistics panel */}
        <div className="w-[180px] flex flex-col justify-between self-stretch py-2">
          <div className="space-y-4">
            <h1 className="text-lg font-bold text-white mb-2 pb-2 border-b border-white/10">
              Dino Jump
            </h1>

            {/* Score view */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 space-y-3 shadow-md">
              <div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Score</div>
                <div className="text-xl font-bold text-white tracking-wide font-mono mt-0.5">{score}</div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <div className="bg-[#fbbf24]/10 border border-[#fbbf24]/20 rounded-2xl p-3.5 flex items-center">
              <Trophy size={16} className="text-[#fbbf24] mr-2.5 flex-shrink-0" />
              <div>
                <div className="text-[8px] font-bold text-[#fbbf24]/80 uppercase tracking-wider">High Record</div>
                <div className="text-sm font-bold text-white font-mono">{highScore}</div>
              </div>
            </div>

            <div className="flex justify-between items-center bg-white/5 border border-white/5 p-2 rounded-xl">
              <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider pl-1">Sound FX</span>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                  isMuted ? 'text-gray-500 hover:text-white' : 'text-sky-400 hover:text-sky-300'
                }`}
              >
                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            </div>

            <div className="text-[8px] text-gray-600 leading-normal font-mono px-1">
              Controls:
              <br />• Space / Up Arrow: Jump
              <br />• Down Arrow: Duck
              <br />• Left Mouse Click: Jump
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DinoJumpGame;
