import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameHeader, ResultModal, Button } from '../common';
import { errorHunterQuestions } from '../../data';
import { shuffleArray } from '../../data/antonymData';
import { GAMES } from '../../data/gameData';
import { haptic } from '../../utils/haptics';
import { sound } from '../../utils/sound';
import type { ErrorHunterQuestion, GameResult } from '../../types/game';

interface ErrorHunterProps {
  onBack: () => void;
}

export function ErrorHunter({ onBack }: ErrorHunterProps) {
  const gameInfo = GAMES.find(g => g.id === 'error-hunter')!;
  const {
    score, combo, status, timeLeft,
    setStatus, addScore, incrementCombo, resetCombo,
    loseHeart, resetGame, incrementCorrect, incrementTotal,
    correctAnswers, totalQuestions, maxCombo
  } = useGameStore();

  const [questions, setQuestions] = useState<ErrorHunterQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showCorrection, setShowCorrection] = useState(false);
  const [selectedCorrection, setSelectedCorrection] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const shuffled = shuffleArray([...errorHunterQuestions]);
    setQuestions(shuffled);
    resetGame(3, 60, 1);
  }, []);

  // Shuffle options when question changes
  useEffect(() => {
    if (currentQuestion) {
      setShuffledOptions(shuffleArray([...currentQuestion.options]));
    }
  }, [currentQuestion]);

  const startGame = () => {
    setStatus('playing');
  };

  // Remove punctuation for comparison
  const cleanWord = (word: string) => word.replace(/[.,!?。，！？]/g, '');

  const handleWordTap = (word: string) => {
    if (status !== 'playing' || selectedWord !== null) return;

    setSelectedWord(word);
    
    // Compare without punctuation
    if (cleanWord(word) === cleanWord(currentQuestion.errorWord)) {
      haptic.medium();
      sound.click();
      setShowCorrection(true);
    } else {
      haptic.error();
      sound.incorrect();
      loseHeart();
      resetCombo();
      
      setTimeout(() => {
        setSelectedWord(null);
      }, 500);
    }
  };

  const handleCorrection = useCallback((correction: string) => {
    if (!showCorrection) return;

    setSelectedCorrection(correction);
    incrementTotal();

    const correct = correction === currentQuestion.correction;
    setIsCorrect(correct);

    if (correct) {
      haptic.success();
      sound.correct();
      incrementCorrect();
      incrementCombo();
      addScore(100);
    } else {
      haptic.error();
      sound.incorrect();
      resetCombo();
      loseHeart();
    }

    setShowExplanation(true);

    setTimeout(() => {
      setSelectedWord(null);
      setShowCorrection(false);
      setSelectedCorrection(null);
      setIsCorrect(null);
      setShowExplanation(false);
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setQuestions(shuffleArray([...errorHunterQuestions]));
        setCurrentIndex(0);
      }
    }, 2000);
  }, [showCorrection, currentQuestion, combo, currentIndex, questions.length]);

  const handleTimeUp = useCallback(() => {
    setStatus('finished');
    setResult({
      score,
      maxCombo,
      correctAnswers,
      totalQuestions,
      timeSpent: 60 - timeLeft,
      level: 1,
    });
  }, [score, maxCombo, correctAnswers, totalQuestions, timeLeft]);

  useEffect(() => {
    if (status === 'finished' && !result) {
      handleTimeUp();
    }
  }, [status, result, handleTimeUp]);

  const handleRestart = () => {
    setQuestions(shuffleArray([...errorHunterQuestions]));
    setCurrentIndex(0);
    setSelectedWord(null);
    setShowCorrection(false);
    setSelectedCorrection(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setResult(null);
    resetGame(3, 60, 1);
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
              <li>• 문장에서 틀린 부분을 터치하세요</li>
              <li>• 올바른 표현을 선택하세요</li>
              <li>• 정답: +100점</li>
              <li>• 오답: 하트 1개 감소</li>
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

  if (!currentQuestion) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const words = currentQuestion.sentence.split(' ');

  return (
    <div className="min-h-screen flex flex-col">
      <GameHeader maxTime={60} showHearts onTimeUp={handleTimeUp} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        {/* Instruction */}
        <p className="text-amber-400 text-sm mb-4">👆 틀린 부분을 터치하세요</p>

        {/* Sentence Display */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-2xl p-6 mb-6 w-full max-w-md"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            {words.map((word, index) => {
              const isError = cleanWord(word) === cleanWord(currentQuestion.errorWord);
              const isSelected = selectedWord === word;
              // const showAsCorrect = isCorrect && isSelected; // Not used currently
              const showAsError = isSelected && !isError;

              return (
                <motion.button
                  key={index}
                  onClick={() => handleWordTap(word)}
                  disabled={selectedWord !== null}
                  className={`px-3 py-2 rounded-lg text-lg font-medium transition-all
                    ${isSelected && isError ? 'bg-red-500/30 border-2 border-red-500 text-red-300' : ''}
                    ${showAsError ? 'animate-shake bg-slate-700' : ''}
                    ${!isSelected ? 'bg-slate-700/50 hover:bg-slate-700 text-white' : ''}
                  `}
                  whileTap={{ scale: 0.95 }}
                >
                  {word}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Correction Modal */}
        <AnimatePresence>
          {showCorrection && !showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full max-w-md"
            >
              <p className="text-center text-slate-300 mb-3">올바른 표현을 선택하세요:</p>
              <div className="grid grid-cols-1 gap-2">
                {shuffledOptions.map((option) => (
                  <Button
                    key={option}
                    variant="option"
                    fullWidth
                    onClick={() => handleCorrection(option)}
                    className="text-lg"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={`w-full max-w-md p-4 rounded-xl ${
                isCorrect ? 'bg-emerald-500/20 border border-emerald-500' : 'bg-red-500/20 border border-red-500'
              }`}
            >
              <p className={`text-center font-bold mb-2 ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
                {isCorrect ? '✨ 정답!' : '❌ 오답'}
              </p>
              <p className="text-slate-300 text-sm text-center">
                {currentQuestion.explanation}
              </p>
              <p className="text-center mt-2 text-white">
                ✓ {currentQuestion.errorWord} → {currentQuestion.correction}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Combo Display */}
        <AnimatePresence>
          {combo >= 2 && !showExplanation && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="mt-4 combo-badge"
            >
              🔥 COMBO x{combo}!
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6 text-slate-400 text-sm">
          문제 {currentIndex + 1}
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
