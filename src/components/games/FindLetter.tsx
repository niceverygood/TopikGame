import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameHeader, ResultModal, Button } from '../common';
import { findLetterStages } from '../../data';
import { shuffleArray } from '../../data/antonymData';
import { GAMES } from '../../data/gameData';
import { haptic } from '../../utils/haptics';
import { sound } from '../../utils/sound';
import type { FindLetterStage, GameResult } from '../../types/game';

interface FindLetterProps {
  onBack: () => void;
}

export function FindLetter({ onBack }: FindLetterProps) {
  const gameInfo = GAMES.find(g => g.id === 'find-letter')!;
  const {
    score, combo, status, timeLeft,
    setStatus, addScore, incrementCombo, resetCombo,
    subtractTime, resetGame, incrementCorrect, incrementTotal,
    correctAnswers, totalQuestions, maxCombo
  } = useGameStore();

  const [stages, setStages] = useState<FindLetterStage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [foundPositions, setFoundPositions] = useState<Set<string>>(new Set());
  const [showStamp, setShowStamp] = useState<{ row: number; col: number } | null>(null);
  const [showWrong, setShowWrong] = useState<{ row: number; col: number } | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);

  const currentStage = stages[currentIndex];

  useEffect(() => {
    const shuffled = shuffleArray([...findLetterStages]);
    setStages(shuffled);
    resetGame(3, 30, 1);
  }, []);

  const startGame = () => {
    setStatus('playing');
  };

  const isTargetPosition = (row: number, col: number): boolean => {
    return currentStage.targetPositions.some(
      ([r, c]) => r === row && c === col
    );
  };

  const handleCellClick = useCallback((row: number, col: number) => {
    if (status !== 'playing') return;

    const posKey = `${row}-${col}`;
    if (foundPositions.has(posKey)) return;

    if (isTargetPosition(row, col)) {
      haptic.success();
      sound.correct();
      
      setShowStamp({ row, col });
      setTimeout(() => setShowStamp(null), 500);
      
      const newFound = new Set(foundPositions);
      newFound.add(posKey);
      setFoundPositions(newFound);
      
      incrementCombo();
      addScore(20);

      // Check if all found
      if (newFound.size === currentStage.targetPositions.length) {
        incrementCorrect();
        incrementTotal();
        addScore(50); // Bonus for clearing
        
        setTimeout(() => {
          setFoundPositions(new Set());
          if (currentIndex < stages.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else {
            setStages(shuffleArray([...findLetterStages]));
            setCurrentIndex(0);
          }
        }, 1000);
      }
    } else {
      haptic.error();
      sound.incorrect();
      resetCombo();
      subtractTime(1);
      
      setShowWrong({ row, col });
      setTimeout(() => setShowWrong(null), 300);
    }
  }, [status, currentStage, foundPositions, currentIndex, stages.length]);

  const handleTimeUp = useCallback(() => {
    setStatus('finished');
    setResult({
      score,
      maxCombo,
      correctAnswers,
      totalQuestions,
      timeSpent: 30 - timeLeft,
      level: 1,
    });
  }, [score, maxCombo, correctAnswers, totalQuestions, timeLeft]);

  useEffect(() => {
    if (status === 'finished' && !result) {
      handleTimeUp();
    }
  }, [status, result, handleTimeUp]);

  const handleRestart = () => {
    setStages(shuffleArray([...findLetterStages]));
    setCurrentIndex(0);
    setFoundPositions(new Set());
    setShowStamp(null);
    setShowWrong(null);
    setResult(null);
    resetGame(3, 30, 1);
    setStatus('playing');
  };

  if (status === 'idle') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <div className={`w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${gameInfo.gradient} flex items-center justify-center shadow-xl`}>
            <span className="text-6xl">{gameInfo.icon}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{gameInfo.titleKo}</h1>
          <p className="text-slate-400 mb-6">{gameInfo.description}</p>
          
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-amber-400 mb-2">🎮 게임 방법</h3>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• 그리드에서 목표 글자를 찾으세요</li>
              <li>• 빠르게 모두 찾으면 보너스!</li>
              <li>• 정답 발견: +20점</li>
              <li>• 오답: -1초</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={startGame} variant="primary" fullWidth className="text-xl py-4">
              🎮 게임 시작
            </Button>
            <Button onClick={onBack} variant="secondary" fullWidth>
              ← 뒤로가기
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!currentStage) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const remainingCount = currentStage.targetPositions.length - foundPositions.size;

  return (
    <div className="min-h-screen flex flex-col">
      <GameHeader maxTime={30} onTimeUp={handleTimeUp} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        {/* Target Display */}
        <div className="mb-6 text-center">
          <p className="text-slate-400 text-sm mb-2">찾아야 할 글자</p>
          <motion.div
            key={currentStage.target}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-block bg-gradient-to-br from-cyan-500 to-teal-600 rounded-xl px-6 py-3 shadow-lg"
          >
            <span className="text-4xl font-bold text-white">{currentStage.target}</span>
          </motion.div>
          <p className="text-amber-400 mt-2">남은 개수: {remainingCount}개</p>
        </div>

        {/* Combo Display */}
        <AnimatePresence>
          {combo >= 5 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="mb-4 combo-badge"
            >
              🔥 Fever! x{combo}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <div className="grid grid-cols-4 gap-2">
            {currentStage.grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const posKey = `${rowIndex}-${colIndex}`;
                const isFound = foundPositions.has(posKey);
                // isTargetPosition is called for check but value not directly used
                const isStamped = showStamp?.row === rowIndex && showStamp?.col === colIndex;
                const isWrong = showWrong?.row === rowIndex && showWrong?.col === colIndex;

                return (
                  <motion.button
                    key={posKey}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    disabled={isFound}
                    animate={isWrong ? { x: [-3, 3, -3, 3, 0] } : {}}
                    className={`
                      w-16 h-16 rounded-xl text-2xl font-bold transition-all relative
                      ${isFound
                        ? 'bg-emerald-500/30 border-2 border-emerald-500 text-emerald-300'
                        : 'bg-slate-700 border-2 border-slate-600 text-white hover:bg-slate-600'
                      }
                      ${isWrong ? 'bg-red-500/30' : ''}
                    `}
                    whileTap={{ scale: 0.9 }}
                  >
                    {cell}
                    
                    {/* Stamp effect */}
                    <AnimatePresence>
                      {isStamped && (
                        <motion.div
                          initial={{ scale: 0, rotate: -30 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <span className="text-4xl">✓</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-6 text-slate-400 text-sm">
          스테이지 {currentIndex + 1}
        </div>
      </main>

      <ResultModal
        isOpen={status === 'finished' && result !== null}
        result={result}
        onRestart={handleRestart}
        onHome={onBack}
        gameName={gameInfo.titleKo}
      />
    </div>
  );
}
