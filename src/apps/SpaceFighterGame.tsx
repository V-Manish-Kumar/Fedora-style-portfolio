import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Play, RotateCcw, Volume2, VolumeX, Heart } from 'lucide-react';

interface Bullet {
  x: number;
  y: number;
  speed: number;
  isEnemy: boolean;
}

interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  shootTimer: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
}

const SpaceFighterGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
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
    const saved = localStorage.getItem('space_high_score');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const updateHighScore = useCallback((currentScore: number) => {
    const saved = localStorage.getItem('space_high_score');
    const currentHigh = saved ? parseInt(saved, 10) : 0;
    if (currentScore > currentHigh) {
      localStorage.setItem('space_high_score', currentScore.toString());
      setHighScore(currentScore);
    }
  }, []);

  // Control state
  const mousePosRef = useRef({ x: 130, y: 380 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Game Variables
    let shipX = canvas.width / 2;
    let shipY = canvas.height - 50;
    const shipWidth = 24;
    const shipHeight = 24;

    let bullets: Bullet[] = [];
    let enemies: Enemy[] = [];
    let particles: Particle[] = [];

    // Starfield
    const stars: { x: number; y: number; speed: number; size: number }[] = [];
    for (let i = 0; i < 40; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 1.5 + 0.5,
        size: Math.random() * 1.5
      });
    }

    let enemySpawnTimer = 0;
    let fireTimer = 0;
    let currentScore = 0;
    let currentLives = 3;

    // Reset loop variables
    const resetLoopVars = () => {
      bullets = [];
      enemies = [];
      particles = [];
      enemySpawnTimer = 0;
      fireTimer = 0;
      currentScore = 0;
      currentLives = 3;
      setScore(0);
      setLives(3);
      setIsGameOver(false);
    };

    const triggerExplosion = (x: number, y: number, color = '#f59e0b') => {
      playSound(120, 'sawtooth', 0.2);
      for (let i = 0; i < 15; i++) {
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          color,
          alpha: 1,
          size: Math.random() * 3 + 1
        });
      }
    };

    // Main loop
    const draw = () => {
      // Clear
      ctx.fillStyle = '#060a13';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Starfield
      ctx.fillStyle = '#ffffff';
      stars.forEach(star => {
        if (isPlaying && !isGameOver) {
          star.y += star.speed;
          if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
          }
        }
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      if (isPlaying && !isGameOver) {
        // Smoothly move ship towards mouse position
        const targetX = mousePosRef.current.x;
        const targetY = mousePosRef.current.y;
        shipX += (targetX - shipX) * 0.15;
        shipY += (targetY - shipY) * 0.15;

        // Keep inside bounds
        if (shipX < shipWidth) shipX = shipWidth;
        if (shipX > canvas.width - shipWidth) shipX = canvas.width - shipWidth;
        if (shipY < shipHeight) shipY = shipHeight;
        if (shipY > canvas.height - shipHeight) shipY = canvas.height - shipHeight;

        // Fire player bullets
        fireTimer++;
        if (fireTimer >= 14) {
          bullets.push({ x: shipX, y: shipY - 12, speed: -5, isEnemy: false });
          playSound(600, 'sine', 0.05);
          fireTimer = 0;
        }

        // Spawn Enemies
        enemySpawnTimer++;
        if (enemySpawnTimer >= 50) {
          enemies.push({
            x: Math.random() * (canvas.width - 30) + 15,
            y: -20,
            width: 20,
            height: 20,
            speed: Math.random() * 1.2 + 0.8,
            health: 1,
            shootTimer: Math.random() * 100
          });
          enemySpawnTimer = 0;
        }

        // Move bullets
        bullets.forEach((b) => {
          b.y += b.speed;
        });

        // Move enemies & enemy firing
        enemies.forEach(e => {
          e.y += e.speed;
          e.shootTimer++;
          if (e.shootTimer >= 120) {
            bullets.push({ x: e.x, y: e.y + 10, speed: 3.5, isEnemy: true });
            e.shootTimer = 0;
          }
        });

        // Bullet out of bounds cleanup
        bullets = bullets.filter(b => b.y > -10 && b.y < canvas.height + 10);
        // Enemy out of bounds cleanup
        enemies = enemies.filter(e => e.y < canvas.height + 20);

        // Collisions: player bullets with enemies
        bullets.forEach((b, bIdx) => {
          if (b.isEnemy) return;
          enemies.forEach((e, eIdx) => {
            if (
              b.x > e.x - e.width / 2 &&
              b.x < e.x + e.width / 2 &&
              b.y > e.y - e.height / 2 &&
              b.y < e.y + e.height / 2
            ) {
              // Hit!
              triggerExplosion(e.x, e.y, '#f59e0b');
              enemies.splice(eIdx, 1);
              bullets.splice(bIdx, 1);
              currentScore += 100;
              setScore(currentScore);
              updateHighScore(currentScore);
            }
          });
        });

        // Collisions: enemy bullets / enemies with player ship
        bullets.forEach((b, bIdx) => {
          if (!b.isEnemy) return;
          if (
            b.x > shipX - shipWidth / 2 &&
            b.x < shipX + shipWidth / 2 &&
            b.y > shipY - shipHeight / 2 &&
            b.y < shipY + shipHeight / 2
          ) {
            // Hit player!
            triggerExplosion(shipX, shipY, '#ef4444');
            bullets.splice(bIdx, 1);
            currentLives--;
            setLives(currentLives);
            if (currentLives <= 0) {
              setIsGameOver(true);
              setIsPlaying(false);
              playSound(100, 'sawtooth', 0.6);
            }
          }
        });

        enemies.forEach((e, eIdx) => {
          if (
            e.x > shipX - shipWidth / 2 - e.width / 2 &&
            e.x < shipX + shipWidth / 2 + e.width / 2 &&
            e.y > shipY - shipHeight / 2 - e.height / 2 &&
            e.y < shipY + shipHeight / 2 + e.height / 2
          ) {
            // Collision!
            triggerExplosion(e.x, e.y, '#f59e0b');
            triggerExplosion(shipX, shipY, '#ef4444');
            enemies.splice(eIdx, 1);
            currentLives--;
            setLives(currentLives);
            if (currentLives <= 0) {
              setIsGameOver(true);
              setIsPlaying(false);
              playSound(100, 'sawtooth', 0.6);
            }
          }
        });

        // Update particles
        particles.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= 0.02;
        });
        particles = particles.filter(p => p.alpha > 0);
      }

      // Draw player ship
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(shipX, shipY - 12);
      ctx.lineTo(shipX - 12, shipY + 12);
      ctx.lineTo(shipX - 4, shipY + 6);
      ctx.lineTo(shipX + 4, shipY + 6);
      ctx.lineTo(shipX + 12, shipY + 12);
      ctx.closePath();
      ctx.fill();

      // Ship thruster glow
      if (isPlaying && !isGameOver) {
        ctx.fillStyle = Math.random() > 0.5 ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(shipX - 4, shipY + 7);
        ctx.lineTo(shipX + 4, shipY + 7);
        ctx.lineTo(shipX, shipY + 14 + Math.random() * 5);
        ctx.closePath();
        ctx.fill();
      }

      // Draw bullets
      bullets.forEach(b => {
        ctx.fillStyle = b.isEnemy ? '#ef4444' : '#10b981';
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.isEnemy ? 3.5 : 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw enemies
      enemies.forEach(e => {
        ctx.fillStyle = '#f43f5e';
        ctx.beginPath();
        ctx.moveTo(e.x, e.y + 10);
        ctx.lineTo(e.x - 10, e.y - 10);
        ctx.lineTo(e.x, e.y - 4);
        ctx.lineTo(e.x + 10, e.y - 10);
        ctx.closePath();
        ctx.fill();
      });

      // Draw particles
      particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    if (!isPlaying) {
      resetLoopVars();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, isGameOver, playSound]);

  // Handle mouse movement inside canvas
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current = { x, y };
  };

  return (
    <div className="flex h-full select-none text-gray-300 bg-[#02050b] font-sans p-6 overflow-y-auto keep-dark">
      <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 w-full">
        
        {/* Game Area Wrapper */}
        <div 
          onMouseMove={handleMouseMove}
          className="relative border-[8px] border-slate-800 bg-[#060a13] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden cursor-crosshair flex flex-col w-[280px] h-[450px]"
        >
          <canvas 
            ref={canvasRef} 
            width={264} 
            height={434} 
            className="w-full h-full block bg-[#060a13]"
          />

          {/* Overlays */}
          {(!isPlaying || isGameOver) && (
            <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center text-center p-5 z-20">
              {isGameOver ? (
                <>
                  <h2 className="text-xl font-black text-red-500 tracking-wider mb-2">MISSION FAILED</h2>
                  <p className="text-xs text-gray-400 mb-6 font-mono">FINAL SCORE: {score}</p>
                  <button
                    onClick={() => {
                      setIsPlaying(true);
                    }}
                    className="flex items-center space-x-2 py-2 px-5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all border border-sky-500 shadow-lg"
                  >
                    <RotateCcw size={14} />
                    <span>RELAUNCH SHIP</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-sky-500/10 rounded-2xl flex items-center justify-center border border-sky-500/20 mb-4 text-sky-400">
                    <Play size={28} className="ml-1" />
                  </div>
                  <h2 className="text-lg font-bold text-white mb-2">Space Fighter</h2>
                  <p className="text-[11px] text-gray-400 max-w-[190px] leading-relaxed mb-6">
                    Move your mouse inside the viewport area to fly your ship. Auto-cannons will shoot down invaders.
                  </p>
                  <button
                    onClick={() => {
                      setIsPlaying(true);
                    }}
                    className="py-2.5 px-6 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all border border-white/10 shadow-lg"
                  >
                    LAUNCH MISSION
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Side Panel stats */}
        <div className="w-[180px] flex flex-col justify-between self-stretch py-2">
          <div className="space-y-4">
            <h1 className="text-lg font-bold text-white mb-2 pb-2 border-b border-white/10">
              Space Fighter
            </h1>

            {/* Score & Lives Info */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 space-y-4 shadow-md">
              <div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Score</div>
                <div className="text-xl font-bold text-white tracking-wide font-mono mt-0.5">{score}</div>
              </div>
              <div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mb-1">Armor Integrity</div>
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, idx) => (
                    <Heart 
                      key={idx} 
                      size={14} 
                      className={idx < lives ? 'text-red-500 fill-red-500' : 'text-slate-700'} 
                    />
                  ))}
                </div>
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
              <br />• Mouse Movement: Fly Ship
              <br />• Auto-Fire is active
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SpaceFighterGame;
