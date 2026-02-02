import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameHeader, ResultModal, Button } from '../common';
import { jamoFishingWords } from '../../data';
import { shuffleArray } from '../../data/antonymData';
import { GAMES } from '../../data/gameData';
import { haptic } from '../../utils/haptics';
import { sound } from '../../utils/sound';
import type { JamoFishingWord, GameResult } from '../../types/game';

interface JamoFishingProps {
  onBack: () => void;
}

interface SwimmingJamo {
  id: string;
  jamo: string;
  isTarget: boolean;
  x: number;
  y: number;
  speed: number;
  direction: 'left' | 'right';
  caught: boolean;
}

export function JamoFishing({ onBack }: JamoFishingProps) {
  const gameInfo = GAMES.find(g => g.id === 'jamo-fishing')!;
  const {
    score, combo, status, timeLeft,
    setStatus, addScore, incrementCombo, resetCombo,
    resetGame, incrementCorrect, incrementTotal,
    correctAnswers, totalQuestions, maxCombo
  } = useGameStore();

  const [words, setWords] = useState<JamoFishingWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [collectedJamos, setCollectedJamos] = useState<string[]>([]);
  const [swimmingJamos, setSwimmingJamos] = useState<SwimmingJamo[]>([]);
  const [showCatch, setShowCatch] = useState<{ x: number; y: number; jamo: string } | null>(null);
  const [wordComplete, setWordComplete] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentWord = words[currentIndex];

  useEffect(() => {
    const shuffled = shuffleArray([...jamoFishingWords]);
    setWords(shuffled);
    resetGame(3, 45, 1);
  }, []);

  // Spawn swimming jamos
  useEffect(() => {
    if (status !== 'playing' || !currentWord || wordComplete) return;

    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;

    // 중복 자모를 올바르게 처리 (예: "밥"에서 ㅂ가 2번 필요한 경우)
    const neededTargets = [...currentWord.targetJamos];
    collectedJamos.forEach(collected => {
      const idx = neededTargets.indexOf(collected);
      if (idx > -1) neededTargets.splice(idx, 1);
    });
    
    const allJamos = [
      ...neededTargets,
      ...currentWord.decoyJamos.slice(0, 3)
    ];

    const spawned: SwimmingJamo[] = allJamos.map((jamo, i) => ({
      id: `${currentIndex}-${i}-${Date.now()}`,
      jamo,
      isTarget: neededTargets.includes(jamo),
      x: 50 + Math.random() * (containerWidth - 100),
      y: 50 + Math.random() * (containerHeight - 100),
      speed: 0.5 + Math.random() * 1,
      direction: Math.random() > 0.5 ? 'left' : 'right',
      caught: false,
    }));

    setSwimmingJamos(spawned);

    // Animation loop
    const interval = setInterval(() => {
      setSwimmingJamos(prev => prev.map(fish => {
        if (fish.caught) return fish;
        let newX = fish.direction === 'right' 
          ? fish.x + fish.speed 
          : fish.x - fish.speed;
        let newDirection = fish.direction;
        
        // Bounce off walls
        if (newX > containerWidth - 70) {
          newX = containerWidth - 70;
          newDirection = 'left';
        } else if (newX < 10) {
          newX = 10;
          newDirection = 'right';
        }
        
        return { ...fish, x: newX, direction: newDirection };
      }));
    }, 32);

    return () => clearInterval(interval);
  }, [status, currentWord, currentIndex, collectedJamos, wordComplete]);

  const startGame = () => {
    setStatus('playing');
    setCollectedJamos([]);
  };

  const handleCatch = useCallback((fish: SwimmingJamo, e: React.MouseEvent | React.TouchEvent) => {
    if (status !== 'playing' || fish.caught || wordComplete) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    
    if (fish.isTarget) {
      haptic.success();
      sound.correct();
      
      setShowCatch({ x: rect.left, y: rect.top, jamo: fish.jamo });
      setTimeout(() => setShowCatch(null), 500);
      
      const newCollected = [...collectedJamos, fish.jamo];
      setCollectedJamos(newCollected);
      incrementCombo();
      addScore(20);
      
      // Mark as caught
      setSwimmingJamos(prev => prev.map(f => 
        f.id === fish.id ? { ...f, caught: true } : f
      ));

      // Check if word complete
      const neededJamos = [...currentWord.targetJamos];
      let remaining = [...neededJamos];
      newCollected.forEach(j => {
        const idx = remaining.indexOf(j);
        if (idx > -1) remaining.splice(idx, 1);
      });

      if (remaining.length === 0) {
        setWordComplete(true);
        incrementCorrect();
        incrementTotal();
        addScore(150);
        sound.fever();

        setTimeout(() => {
          setWordComplete(false);
          setCollectedJamos([]);
          setSwimmingJamos([]);
          
          if (currentIndex < words.length - 1) {
            setCurrentIndex(prev => prev + 1);
          } else {
            setWords(shuffleArray([...jamoFishingWords]));
            setCurrentIndex(0);
          }
        }, 1500);
      }
    } else {
      haptic.error();
      sound.incorrect();
      resetCombo();
      addScore(-10);
      
      setSwimmingJamos(prev => prev.map(f => 
        f.id === fish.id ? { ...f, caught: true } : f
      ));
    }
  }, [status, collectedJamos, currentWord, wordComplete, currentIndex, words.length, combo]);

  const handleTimeUp = useCallback(() => {
    setStatus('finished');
    setResult({
      score,
      maxCombo,
      correctAnswers,
      totalQuestions,
      timeSpent: 45 - timeLeft,
      level: 1,
    });
  }, [score, maxCombo, correctAnswers, totalQuestions, timeLeft]);

  useEffect(() => {
    if (status === 'finished' && !result) {
      handleTimeUp();
    }
  }, [status, result, handleTimeUp]);

  const handleRestart = () => {
    setWords(shuffleArray([...jamoFishingWords]));
    setCurrentIndex(0);
    setCollectedJamos([]);
    setSwimmingJamos([]);
    setWordComplete(false);
    setResult(null);
    resetGame(3, 45, 1);
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
              <li>• 헤엄치는 자모 물고기를 탭하세요</li>
              <li>• 파란 물고기가 필요한 자모!</li>
              <li>• 빨간 물고기는 미끼 (-10점)</li>
              <li>• 단어 완성: +150점</li>
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

  if (!currentWord) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <GameHeader maxTime={45} onTimeUp={handleTimeUp} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center p-4 max-w-2xl mx-auto w-full overflow-hidden">
        {/* Target Word Slots */}
        <div className="mb-4">
          <p className="text-center text-slate-400 text-sm mb-2">목표 단어</p>
          <div className="flex gap-2 justify-center mb-2">
            {currentWord.slots.map((slot, i) => {
              const collected = collectedJamos[i];
              return (
                <motion.div
                  key={i}
                  animate={collected ? { scale: [1, 1.2, 1] } : {}}
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold border-2
                    ${collected 
                      ? 'bg-sky-500/30 border-sky-500 text-sky-300' 
                      : 'bg-slate-800 border-slate-600 text-slate-500'
                    }`}
                >
                  {collected || slot}
                </motion.div>
              );
            })}
          </div>
          
          {/* Word display */}
          <AnimatePresence>
            {wordComplete && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-center"
              >
                <span className="text-3xl font-bold text-emerald-400">✨ {currentWord.word}!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Combo */}
        <AnimatePresence>
          {combo >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="combo-badge mb-4"
            >
              🔥 x{combo}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fishing Area */}
        <div 
          ref={containerRef}
          className="relative w-full flex-1 min-h-[300px] bg-gradient-to-b from-sky-900/30 to-blue-900/50 rounded-2xl overflow-hidden"
          style={{ 
            backgroundImage: 'linear-gradient(180deg, rgba(14,165,233,0.1) 0%, rgba(30,64,175,0.3) 100%)'
          }}
        >
          {/* Water waves */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-sky-400/20 to-transparent" />
          
          {/* Swimming Jamos */}
          {swimmingJamos.filter(f => !f.caught).map((fish) => (
            <motion.button
              key={fish.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => handleCatch(fish, e)}
              className={`absolute w-16 h-12 rounded-full flex items-center justify-center text-2xl font-bold
                ${fish.isTarget 
                  ? 'bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-lg shadow-sky-500/50' 
                  : 'bg-gradient-to-br from-red-400 to-rose-500 text-white shadow-lg shadow-red-500/50'
                }
              `}
              style={{ 
                left: fish.x, 
                top: fish.y,
                transform: fish.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)'
              }}
              whileTap={{ scale: 0.8 }}
            >
              <span style={{ transform: fish.direction === 'left' ? 'scaleX(-1)' : 'scaleX(1)' }}>
                {fish.jamo}
              </span>
            </motion.button>
          ))}

          {/* Catch Effect */}
          <AnimatePresence>
            {showCatch && (
              <motion.div
                initial={{ scale: 1, opacity: 1, y: showCatch.y }}
                animate={{ scale: 1.5, opacity: 0, y: showCatch.y - 50 }}
                exit={{ opacity: 0 }}
                className="fixed text-3xl font-bold text-emerald-400 pointer-events-none"
                style={{ left: showCatch.x }}
              >
                +{showCatch.jamo}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 flex gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-sky-500" />
              <span className="text-slate-300">타겟</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <span className="text-slate-300">미끼</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-slate-400 text-sm">
          단어 {currentIndex + 1} / {words.length}
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
