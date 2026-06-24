import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trophy, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const FlappyBirdGame: React.FC = () => {
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

      gainNode.gain.setValueAtTime(0.06, audioCtx.currentTime);
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
    const saved = localStorage.getItem('flappy_high_score');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const updateHighScore = useCallback((currentScore: number) => {
    const saved = localStorage.getItem('flappy_high_score');
    const currentHigh = saved ? parseInt(saved, 10) : 0;
    if (currentScore > currentHigh) {
      localStorage.setItem('flappy_high_score', currentScore.toString());
      setHighScore(currentScore);
    }
  }, []);

  const triggerReset = useCallback(() => {
    setIsPlaying(false);
    setIsGameOver(false);
    setScore(0);
  }, []);

  // Jump trigger
  const jumpRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Game Variables
    let birdY = canvas.height / 2;
    let birdVelocity = 0;
    const gravity = 0.22;
    const jumpPower = -4.7;
    const birdSize = 14;

    interface Pipe {
      x: number;
      topHeight: number;
      bottomHeight: number;
      width: number;
      passed: boolean;
    }

    let pipes: Pipe[] = [];
    const pipeWidth = 44;
    const pipeGap = 95;
    const pipeSpeed = 2;
    let spawnTimer = 0;

    let bgOffset = 0;
    let groundOffset = 0;

    // Trigger jump
    const jump = () => {
      if (isGameOver) {
        triggerReset();
        setTimeout(() => {
          setIsPlaying(true);
          playSound(350, 'sine', 0.1);
        }, 50);
        return;
      }
      if (!isPlaying) {
        setIsPlaying(true);
        playSound(350, 'sine', 0.1);
        return;
      }
      birdVelocity = jumpPower;
      playSound(450, 'sine', 0.08);
    };

    jumpRef.current = jump;

    // Physics & Render Loop
    const draw = () => {
      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Background Sky (Gradient)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, '#70c5ce');
      skyGrad.addColorStop(1, '#bee8ed');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Clouds / Silhouettes (Parallax Scrolling)
      if (isPlaying && !isGameOver) bgOffset = (bgOffset + 0.3) % 200;
      ctx.fillStyle = '#bde5e9';
      ctx.fillRect(0, canvas.height - 120, canvas.width, 120);

      // Simple mountains / cloud shapes
      ctx.fillStyle = '#9cd3db';
      ctx.beginPath();
      ctx.moveTo(-bgOffset, canvas.height - 60);
      ctx.lineTo(100 - bgOffset, canvas.height - 110);
      ctx.lineTo(200 - bgOffset, canvas.height - 60);
      ctx.lineTo(300 - bgOffset, canvas.height - 105);
      ctx.lineTo(400 - bgOffset, canvas.height - 60);
      ctx.lineTo(500 - bgOffset, canvas.height - 110);
      ctx.lineTo(600 - bgOffset, canvas.height - 60);
      ctx.lineTo(canvas.width + 100, canvas.height - 60);
      ctx.lineTo(canvas.width + 100, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fill();

      // 3. Draw Pipes
      if (isPlaying && !isGameOver) {
        spawnTimer++;
        if (spawnTimer >= 100) {
          const minH = 40;
          const maxH = canvas.height - pipeGap - 80;
          const topHeight = Math.floor(Math.random() * (maxH - minH) + minH);
          const bottomHeight = canvas.height - topHeight - pipeGap - 30; // 30 is ground height
          pipes.push({
            x: canvas.width,
            topHeight,
            bottomHeight,
            width: pipeWidth,
            passed: false
          });
          spawnTimer = 0;
        }
      }

      pipes.forEach((pipe) => {
        if (isPlaying && !isGameOver) {
          pipe.x -= pipeSpeed;
        }

        // Draw Pipe Stem (Green with highlights)
        ctx.fillStyle = '#73c73f';
        ctx.strokeStyle = '#2d5218';
        ctx.lineWidth = 2.5;

        // Top Pipe
        ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
        ctx.strokeRect(pipe.x, 0, pipe.width, pipe.topHeight);
        // Top Lip
        ctx.fillStyle = '#96df58';
        ctx.fillRect(pipe.x - 3, pipe.topHeight - 14, pipe.width + 6, 14);
        ctx.strokeRect(pipe.x - 3, pipe.topHeight - 14, pipe.width + 6, 14);

        // Bottom Pipe
        const bottomY = canvas.height - pipe.bottomHeight - 30;
        ctx.fillStyle = '#73c73f';
        ctx.fillRect(pipe.x, bottomY, pipe.width, pipe.bottomHeight);
        ctx.strokeRect(pipe.x, bottomY, pipe.width, pipe.bottomHeight);
        // Bottom Lip
        ctx.fillStyle = '#96df58';
        ctx.fillRect(pipe.x - 3, bottomY, pipe.width + 6, 14);
        ctx.strokeRect(pipe.x - 3, bottomY, pipe.width + 6, 14);

        // Check Score
        if (!pipe.passed && pipe.x + pipe.width < canvas.width / 2) {
          pipe.passed = true;
          setScore(prev => {
            const next = prev + 1;
            updateHighScore(next);
            return next;
          });
          playSound(587, 'sine', 0.1);
        }
      });

      // Clear offscreen pipes
      pipes = pipes.filter(p => p.x > -pipeWidth - 10);

      // 4. Draw Ground
      if (isPlaying && !isGameOver) groundOffset = (groundOffset + pipeSpeed) % 24;
      ctx.fillStyle = '#ded895';
      ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
      ctx.fillStyle = '#568322';
      ctx.fillRect(0, canvas.height - 35, canvas.width, 5);

      // Draw grass texture on ground
      ctx.fillStyle = '#73c73f';
      ctx.beginPath();
      for (let i = -groundOffset; i < canvas.width + 24; i += 12) {
        ctx.moveTo(i, canvas.height - 30);
        ctx.lineTo(i + 6, canvas.height - 24);
        ctx.lineTo(i + 12, canvas.height - 30);
      }
      ctx.fill();

      // 5. Draw Bird
      if (isPlaying && !isGameOver) {
        birdVelocity += gravity;
        birdY += birdVelocity;
      }

      // Ground collision
      if (birdY + birdSize > canvas.height - 30) {
        birdY = canvas.height - 30 - birdSize;
        if (isPlaying) {
          setIsGameOver(true);
          setIsPlaying(false);
          playSound(180, 'sawtooth', 0.4);
        }
      }
      // Top ceiling boundary
      if (birdY < 0) {
        birdY = 0;
        birdVelocity = 0.5;
      }

      // Pipe collisions
      pipes.forEach(pipe => {
        const birdLeft = canvas.width / 2 - birdSize;
        const birdRight = canvas.width / 2 + birdSize;
        const birdTop = birdY - birdSize;
        const birdBottom = birdY + birdSize;

        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + pipe.width;
        const pipeTopLimit = pipe.topHeight;
        const pipeBottomLimit = canvas.height - pipe.bottomHeight - 30;

        if (birdRight > pipeLeft && birdLeft < pipeRight) {
          if (birdTop < pipeTopLimit || birdBottom > pipeBottomLimit) {
            setIsGameOver(true);
            setIsPlaying(false);
            playSound(180, 'sawtooth', 0.4);
          }
        }
      });

      // Render Bird (Round golden body with beak and wing)
      ctx.save();
      ctx.translate(canvas.width / 2, birdY);
      
      // Rotate based on velocity
      let angle = birdVelocity * 0.06;
      if (angle > 0.5) angle = 0.5;
      if (angle < -0.3) angle = -0.3;
      ctx.rotate(angle);

      // Body shadow/outline
      ctx.fillStyle = '#3c2e12';
      ctx.beginPath();
      ctx.arc(0, 0, birdSize + 2, 0, Math.PI * 2);
      ctx.fill();

      // Golden Yellow Body
      ctx.fillStyle = '#fce23e';
      ctx.beginPath();
      ctx.arc(0, 0, birdSize, 0, Math.PI * 2);
      ctx.fill();

      // Eye
      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(4, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.arc(5, -4, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Beak (Orange)
      ctx.fillStyle = '#f87b1c';
      ctx.beginPath();
      ctx.moveTo(8, -1);
      ctx.lineTo(16, 2);
      ctx.lineTo(8, 5);
      ctx.closePath();
      ctx.fill();

      // Wing (White/Yellow)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-5, 2, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, isGameOver, playSound]);

  // Click & space trigger binding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowUp') {
        e.preventDefault();
        jumpRef.current();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);



  return (
    <div className="flex h-full select-none text-gray-300 bg-[#0c181c] font-sans p-6 overflow-y-auto keep-dark">
      <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 w-full">
        
        {/* Game Canvas Container */}
        <div 
          onClick={() => jumpRef.current()}
          className="relative border-[8px] border-slate-800 bg-[#70c5ce] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden cursor-pointer flex flex-col w-[280px] h-[450px]"
        >
          <canvas 
            ref={canvasRef} 
            width={264} 
            height={434} 
            className="w-full h-full block bg-[#70c5ce]"
          />

          {/* Overlays */}
          {(!isPlaying || isGameOver) && (
            <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center text-center p-5 z-20">
              {isGameOver ? (
                <>
                  <h2 className="text-xl font-black text-red-500 tracking-wider mb-2">GAME OVER</h2>
                  <p className="text-xs text-gray-400 mb-6 font-mono">FINAL SCORE: {score}</p>
                  <button
                    onClick={() => {
                      triggerReset();
                    }}
                    className="flex items-center space-x-2 py-2 px-5 bg-[#73c73f] hover:bg-[#96df58] text-slate-950 rounded-xl text-xs font-bold cursor-pointer transition-all border border-[#73c73f] shadow-lg"
                  >
                    <RotateCcw size={14} />
                    <span>TAP TO RESTART</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[#fbbf24]/10 rounded-2xl flex items-center justify-center border border-[#fbbf24]/20 mb-4 text-[#fbbf24]">
                    <Play size={28} className="ml-1 animate-pulse" />
                  </div>
                  <h2 className="text-lg font-bold text-white mb-2">Flappy Bird</h2>
                  <p className="text-[11px] text-gray-400 max-w-[190px] leading-relaxed mb-6">
                    Tap the screen or press the Spacebar to flap your wings and avoid green pipes.
                  </p>
                  <button
                    className="py-2.5 px-6 bg-[#3c6eb4] hover:bg-[#3c6eb4]/90 active:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all border border-white/10 shadow-lg"
                  >
                    CLICK TO FLAP
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Info panel */}
        <div className="w-[180px] flex flex-col justify-between self-stretch py-2">
          <div className="space-y-4">
            <h1 className="text-lg font-bold text-white mb-2 pb-2 border-b border-white/10">
              Flappy Bird
            </h1>

            {/* Score box */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 space-y-3 shadow-md">
              <div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Current Score</div>
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
              <br />• Space / Up Arrow: Flap
              <br />• Left Mouse Click: Flap
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default FlappyBirdGame;
