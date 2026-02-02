import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameHeader, ResultModal, Button } from '../common';
import { wordRailWords } from '../../data';
import { shuffleArray } from '../../data/antonymData';
import { GAMES } from '../../data/gameData';
import { haptic } from '../../utils/haptics';
import { sound } from '../../utils/sound';
import type { WordRailWord, GameResult } from '../../types/game';

interface WordRailProps {
  onBack: () => void;
}

export function WordRail({ onBack }: WordRailProps) {
  const gameInfo = GAMES.find(g => g.id === 'word-rail')!;
  const {
    score, combo, status, timeLeft,
    setStatus, addScore, incrementCombo, resetCombo,
    resetGame, incrementCorrect, incrementTotal,
    correctAnswers, totalQuestions, maxCombo
  } = useGameStore();

  const [words, setWords] = useState<WordRailWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [placedSyllables, setPlacedSyllables] = useState<string[]>([]);
  const [availableSyllables, setAvailableSyllables] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showError, setShowError] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);

  const currentWord = words[currentIndex];

  useEffect(() => {
    const shuffled = shuffleArray([...wordRailWords]);
    setWords(shuffled);
    resetGame(3, 45, 1);
  }, []);

  useEffect(() => {
    if (currentWord) {
      setAvailableSyllables(shuffleArray([...currentWord.shuffled]));
      setPlacedSyllables([]);
      setIsComplete(false);
    }
  }, [currentWord]);

  const startGame = () => {
    setStatus('playing');
  };

  const handleSyllableSelect = useCallback((syllable: string, index: number) => {
    if (status !== 'playing' || isComplete) return;

    haptic.light();
    sound.click();

    // Check if it's a decoy
    if (currentWord.decoys.includes(syllable)) {
      haptic.error();
      sound.incorrect();
      setShowError(true);
      setTimeout(() => setShowError(false), 500);
      addScore(-5);
      return;
    }

    const newPlaced = [...placedSyllables, syllable];
    const expectedSyllable = currentWord.syllables[placedSyllables.length];

    if (syllable !== expectedSyllable) {
      // Wrong order - bounce back
      haptic.error();
      sound.incorrect();
      setShowError(true);
      setTimeout(() => setShowError(false), 500);
      addScore(-5);
      return;
    }

    // Correct placement
    haptic.success();
    setPlacedSyllables(newPlaced);
    
    // Remove from available
    const newAvailable = [...availableSyllables];
    newAvailable.splice(index, 1);
    setAvailableSyllables(newAvailable);

    // Check if complete
    if (newPlaced.length === currentWord.syllables.length) {
      setIsComplete(true);
      incrementCorrect();
      incrementTotal();
      incrementCombo();
      
      // Perfect bonus if no errors
      const baseScore = 100;
      addScore(baseScore);
      
      sound.fever();

      setTimeout(() => {
        if (currentIndex < words.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setWords(shuffleArray([...wordRailWords]));
          setCurrentIndex(0);
        }
      }, 2000);
    }
  }, [status, currentWord, placedSyllables, availableSyllables, isComplete, currentIndex, words.length]);

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
    setWords(shuffleArray([...wordRailWords]));
    setCurrentIndex(0);
    setPlacedSyllables([]);
    setAvailableSyllables([]);
    setIsComplete(false);
    setShowError(false);
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
              <li>• 음절을 순서대로 탭해서 배열하세요</li>
              <li>• 올바른 순서로 기차칸을 연결!</li>
              <li>• 틀린 음절 선택: -5점</li>
              <li>• 단어 완성: +100점</li>
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

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        {/* Combo Display */}
        <AnimatePresence>
          {combo >= 2 && !isComplete && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="mb-4 combo-badge"
            >
              🔥 x{combo}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rail Track */}
        <div className="w-full max-w-md mb-8">
          {/* Track background */}
          <div className="relative h-32 bg-slate-800/30 rounded-xl overflow-hidden">
            {/* Rails */}
            <div className="absolute bottom-8 left-0 right-0 h-2 bg-slate-600 rounded-full mx-4" />
            <div className="absolute bottom-4 left-0 right-0 h-2 bg-slate-600 rounded-full mx-4" />
            
            {/* Train Cars */}
            <motion.div 
              className="absolute bottom-6 left-4 right-4 flex items-center gap-2"
              animate={isComplete ? { x: [0, 100, 200] } : {}}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            >
              {/* Engine */}
              <div className="w-16 h-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-lg flex items-center justify-center shadow-lg border-2 border-indigo-400">
                <span className="text-2xl">🚂</span>
              </div>

              {/* Placed syllable cars */}
              {currentWord.syllables.map((_, i) => {
                const placed = placedSyllables[i];
                return (
                  <motion.div
                    key={i}
                    initial={placed ? { scale: 0 } : {}}
                    animate={{ scale: 1 }}
                    className={`w-14 h-10 rounded-lg flex items-center justify-center shadow-lg border-2
                      ${placed 
                        ? 'bg-gradient-to-br from-violet-500 to-purple-600 border-violet-400' 
                        : 'bg-slate-700 border-slate-600 border-dashed'
                      }`}
                  >
                    <span className="text-xl font-bold text-white">
                      {placed || '?'}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Complete message */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center"
              >
                <p className="text-emerald-400 font-bold text-2xl">
                  🎉 {currentWord.word}!
                </p>
                <p className="text-slate-400">기차가 출발합니다!</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Available Syllables */}
        <div className="w-full max-w-md">
          <p className="text-slate-400 text-sm mb-3 text-center">음절을 순서대로 탭하세요</p>
          
          <motion.div 
            className="flex flex-wrap gap-3 justify-center"
            animate={showError ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.3 }}
          >
            {availableSyllables.map((syllable, index) => {
              const isDecoy = currentWord.decoys.includes(syllable);
              return (
                <motion.button
                  key={`${syllable}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleSyllableSelect(syllable, index)}
                  disabled={isComplete}
                  className={`w-16 h-16 rounded-xl text-2xl font-bold shadow-lg transition-all
                    ${isDecoy 
                      ? 'bg-gradient-to-br from-red-600 to-rose-700 border-2 border-red-500' 
                      : 'bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-slate-500'
                    }
                    hover:scale-105 active:scale-95 text-white
                  `}
                  whileTap={{ scale: 0.9 }}
                >
                  {syllable}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        <div className="mt-8 text-slate-400 text-sm">
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
