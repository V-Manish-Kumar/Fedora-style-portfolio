import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

type Board = (string | null)[][];
type PieceType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
type Position = { x: number; y: number };

const SHAPES: Record<PieceType, number[][]> = {
  I: [[1, 1, 1, 1]],
  O: [
    [1, 1],
    [1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1]
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1]
  ]
};

const COLORS: Record<PieceType, string> = {
  I: 'bg-cyan-500 border-cyan-400',
  O: 'bg-yellow-500 border-yellow-400',
  T: 'bg-purple-500 border-purple-400',
  S: 'bg-green-500 border-green-400',
  Z: 'bg-red-500 border-red-400',
  J: 'bg-blue-500 border-blue-400',
  L: 'bg-orange-500 border-orange-400'
};

const BOARD_COLS = 10;
const BOARD_ROWS = 20;

const createEmptyBoard = (): Board =>
  Array.from({ length: BOARD_ROWS }, () => Array(BOARD_COLS).fill(null));

const TetrisGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentPiece, setCurrentPiece] = useState<{ type: PieceType; shape: number[][]; pos: Position }>({
    type: 'I',
    shape: SHAPES['I'],
    pos: { x: 3, y: 0 }
  });
  const [nextPieceType, setNextPieceType] = useState<PieceType>('O');
  const [isMuted, setIsMuted] = useState(true);

  // Synth sounds with Web Audio API
  const playSound = useCallback((frequency: number, type: 'sine' | 'square' | 'triangle' | 'sawtooth' = 'sine', duration = 0.1) => {
    if (isMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  }, [isMuted]);

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('tetris_high_score');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const updateHighScore = useCallback((currentScore: number) => {
    const saved = localStorage.getItem('tetris_high_score');
    const currentHigh = saved ? parseInt(saved, 10) : 0;
    if (currentScore > currentHigh) {
      localStorage.setItem('tetris_high_score', currentScore.toString());
      setHighScore(currentScore);
    }
  }, []);

  // Get a random piece
  const getRandomPieceType = (): PieceType => {
    const types: PieceType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    return types[Math.floor(Math.random() * types.length)];
  };

  // Spawn Piece
  const spawnPiece = useCallback((nextType: PieceType) => {
    const shape = SHAPES[nextType];
    const pos = {
      x: Math.floor((BOARD_COLS - shape[0].length) / 2),
      y: 0
    };

    // Collision on spawn = game over
    if (checkCollision(shape, pos, board)) {
      setIsGameOver(true);
      setIsPlaying(false);
      updateHighScore(score);
      playSound(150, 'sawtooth', 0.5);
      return;
    }

    setCurrentPiece({ type: nextType, shape, pos });
    setNextPieceType(getRandomPieceType());
  }, [board, score, updateHighScore, playSound]);

  // Start game
  const startGame = () => {
    setBoard(createEmptyBoard());
    setScore(0);
    setLines(0);
    setLevel(1);
    setIsGameOver(false);
    setIsPlaying(true);
    const initialType = getRandomPieceType();
    const nextType = getRandomPieceType();
    
    const shape = SHAPES[initialType];
    const pos = {
      x: Math.floor((BOARD_COLS - shape[0].length) / 2),
      y: 0
    };
    setCurrentPiece({ type: initialType, shape, pos });
    setNextPieceType(nextType);
    playSound(440, 'triangle', 0.2);
  };

  // Move checks
  const checkCollision = (shape: number[][], pos: Position, currentBoard: Board): boolean => {
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const nextX = pos.x + c;
          const nextY = pos.y + r;

          if (
            nextX < 0 ||
            nextX >= BOARD_COLS ||
            nextY >= BOARD_ROWS
          ) {
            return true;
          }

          if (nextY >= 0 && currentBoard[nextY][nextX] !== null) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Rotate Piece
  const rotatePiece = () => {
    if (!isPlaying) return;
    const { shape, pos, type } = currentPiece;
    
    // Transpose and reverse rows to rotate 90 deg clockwise
    const newShape = Array.from({ length: shape[0].length }, (_, colIndex) =>
      shape.map(row => row[colIndex]).reverse()
    );

    // Wall kick: shift left or right if out of bounds after rotation
    let kickX = 0;
    if (pos.x + newShape[0].length > BOARD_COLS) {
      kickX = BOARD_COLS - (pos.x + newShape[0].length);
    } else if (pos.x < 0) {
      kickX = -pos.x;
    }

    const testPos = { x: pos.x + kickX, y: pos.y };

    if (!checkCollision(newShape, testPos, board)) {
      setCurrentPiece({ type, shape: newShape, pos: testPos });
      playSound(330, 'sine', 0.08);
    }
  };

  // Move Piece
  const movePiece = (dirX: number, dirY: number) => {
    if (!isPlaying) return false;
    const { shape, pos, type } = currentPiece;
    const newPos = { x: pos.x + dirX, y: pos.y + dirY };

    if (!checkCollision(shape, newPos, board)) {
      setCurrentPiece({ type, shape, pos: newPos });
      if (dirX !== 0) playSound(220, 'sine', 0.05);
      return true;
    }

    // Lock Piece if moving down hits collision
    if (dirY > 0) {
      lockPiece();
    }
    return false;
  };

  // Hard Drop
  const hardDrop = () => {
    if (!isPlaying) return;
    const { shape, pos } = currentPiece;
    let currentY = pos.y;
    while (!checkCollision(shape, { x: pos.x, y: currentY + 1 }, board)) {
      currentY++;
    }
    
    const dropDist = currentY - pos.y;
    setScore(prev => prev + dropDist * 2);
    
    // Place block directly at target height
    const finalPos = { x: pos.x, y: currentY };
    
    // Modify board
    const newBoard = board.map(row => [...row]);
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const boardY = finalPos.y + r;
          const boardX = finalPos.x + c;
          if (boardY >= 0 && boardY < BOARD_ROWS) {
            newBoard[boardY][boardX] = currentPiece.type;
          }
        }
      }
    }

    playSound(600, 'square', 0.15);
    clearLinesAndSpawn(newBoard);
  };

  const lockPiece = () => {
    const { shape, pos } = currentPiece;
    const newBoard = board.map(row => [...row]);

    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[r].length; c++) {
        if (shape[r][c] !== 0) {
          const boardY = pos.y + r;
          const boardX = pos.x + c;
          if (boardY >= 0 && boardY < BOARD_ROWS) {
            newBoard[boardY][boardX] = currentPiece.type;
          }
        }
      }
    }
    playSound(180, 'triangle', 0.08);
    clearLinesAndSpawn(newBoard);
  };

  const clearLinesAndSpawn = (currentBoard: Board) => {
    // Check complete rows
    const filteredBoard = currentBoard.filter(row => row.some(cell => cell === null));
    const clearedCount = BOARD_ROWS - filteredBoard.length;

    let newBoard = [...filteredBoard];
    if (clearedCount > 0) {
      // Add empty rows on top
      const emptyRows = Array.from({ length: clearedCount }, () => Array(BOARD_COLS).fill(null));
      newBoard = [...emptyRows, ...newBoard];

      // Score matrix
      const scoreBonus = [0, 100, 300, 500, 800];
      const pts = scoreBonus[clearedCount] * level;
      setScore(prev => {
        const next = prev + pts;
        updateHighScore(next);
        return next;
      });
      setLines(prev => {
        const nextLines = prev + clearedCount;
        // Increase level every 10 lines
        setLevel(Math.floor(nextLines / 10) + 1);
        return nextLines;
      });

      playSound(523, 'sine', 0.25);
    }

    setBoard(newBoard);
    spawnPiece(nextPieceType);
  };

  // Game tick drop interval (level dependent speed)
  useEffect(() => {
    if (!isPlaying || isGameOver) return;

    const intervalTime = Math.max(100, 800 - (level - 1) * 75);
    const tick = setInterval(() => {
      movePiece(0, 1);
    }, intervalTime);

    return () => clearInterval(tick);
  }, [isPlaying, isGameOver, level, currentPiece, board, nextPieceType]);

  // Key Event listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePiece(0, 1);
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          rotatePiece();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentPiece, board, nextPieceType]);

  // Helper to render preview grid of next piece
  const renderPreviewGrid = () => {
    const nextShape = SHAPES[nextPieceType];
    const previewGrid = Array.from({ length: 4 }, () => Array(4).fill(null));
    const offsetRow = Math.floor((4 - nextShape.length) / 2);
    const offsetCol = Math.floor((4 - nextShape[0].length) / 2);

    for (let r = 0; r < nextShape.length; r++) {
      for (let c = 0; c < nextShape[r].length; c++) {
        if (nextShape[r][c] !== 0) {
          previewGrid[r + offsetRow][c + offsetCol] = nextPieceType;
        }
      }
    }

    return (
      <div className="grid grid-cols-4 gap-1 p-2 bg-slate-950/60 border border-white/5 rounded-xl w-24 h-24">
        {previewGrid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`w-full h-full rounded-[3px] border ${
                cell ? `${COLORS[cell as PieceType]}` : 'bg-slate-900/40 border-transparent'
              }`}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className="flex h-full select-none text-gray-300 bg-[#070b13] font-sans p-6 overflow-y-auto keep-dark">
      <div className="max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-center gap-8 w-full">
        
        {/* Playable Tetris board */}
        <div className="relative border-[8px] border-slate-800 bg-slate-950 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col w-[260px] h-[480px]">
          {/* Grid lines layout */}
          <div className="grid grid-cols-10 grid-rows-20 gap-[0.5px] w-full h-full p-[0.5px] relative">
            {board.map((row, r) =>
              row.map((cell, c) => {
                // Determine if cell is part of currently falling piece
                let isCurrent = false;
                let activeType: PieceType | null = null;
                const { shape, pos, type } = currentPiece;

                if (isPlaying) {
                  const pieceRow = r - pos.y;
                  const pieceCol = c - pos.x;
                  if (
                    pieceRow >= 0 &&
                    pieceRow < shape.length &&
                    pieceCol >= 0 &&
                    pieceCol < shape[pieceRow].length
                  ) {
                    if (shape[pieceRow][pieceCol] !== 0) {
                      isCurrent = true;
                      activeType = type;
                    }
                  }
                }

                const cellFill = isCurrent && activeType ? COLORS[activeType] : cell ? COLORS[cell as PieceType] : null;

                return (
                  <div
                    key={`${r}-${c}`}
                    className={`w-full h-full rounded-[2px] transition-all duration-75 border ${
                      cellFill ? cellFill : 'bg-slate-900/15 border-slate-900/35'
                    }`}
                  />
                );
              })
            )}

            {/* Overlays */}
            {(!isPlaying || isGameOver) && (
              <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center text-center p-5 z-20">
                {isGameOver ? (
                  <>
                    <h2 className="text-xl font-black text-red-500 tracking-wider mb-2">GAME OVER</h2>
                    <p className="text-xs text-gray-400 mb-6 font-mono">FINAL SCORE: {score}</p>
                    <button
                      onClick={startGame}
                      className="flex items-center space-x-2 py-2 px-5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all border border-red-500 shadow-lg"
                    >
                      <RotateCcw size={14} />
                      <span>TRY AGAIN</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-[#3c6eb4]/10 rounded-2xl flex items-center justify-center border border-[#3c6eb4]/20 mb-4 text-[#3c6eb4]">
                      <Play size={28} className="ml-1" />
                    </div>
                    <h2 className="text-lg font-bold text-white mb-2">Classic Tetris</h2>
                    <p className="text-[11px] text-gray-500 max-w-[180px] leading-relaxed mb-6">
                      Classic block matching puzzle game. Stack falling blocks to clear lines.
                    </p>
                    <button
                      onClick={startGame}
                      className="py-2.5 px-6 bg-[#3c6eb4] hover:bg-[#3c6eb4]/90 active:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all border border-white/10 shadow-lg"
                    >
                      START GAME
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Side Control Board */}
        <div className="w-[180px] flex flex-col justify-between self-stretch py-2">
          {/* Main Info */}
          <div className="space-y-4">
            {/* Next Piece preview container */}
            <div>
              <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Next Block</div>
              {renderPreviewGrid()}
            </div>

            {/* Score Stats */}
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 space-y-3 shadow-md">
              <div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Score</div>
                <div className="text-xl font-bold text-white tracking-wide font-mono mt-0.5">{score}</div>
              </div>
              <div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Level</div>
                <div className="text-sm font-semibold text-sky-400 font-mono mt-0.5">{level}</div>
              </div>
              <div>
                <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wider">Lines Cleared</div>
                <div className="text-sm font-semibold text-emerald-400 font-mono mt-0.5">{lines}</div>
              </div>
            </div>
          </div>

          {/* High Score / Audio controls */}
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
              <br />• Left/Right, A/D: Move
              <br />• Up, W: Rotate Block
              <br />• Down, S: Soft Drop
              <br />• Space: Hard Drop
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TetrisGame;
