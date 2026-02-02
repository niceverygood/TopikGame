import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameHeader, ResultModal, Button } from '../common';
import { wordMathQuestions } from '../../data';
import { shuffleArray } from '../../data/antonymData';
import { GAMES } from '../../data/gameData';
import { haptic } from '../../utils/haptics';
import { sound } from '../../utils/sound';
import type { WordMathQuestion, GameResult } from '../../types/game';

interface WordMathProps {
  onBack: () => void;
}

export function WordMath({ onBack }: WordMathProps) {
  const gameInfo = GAMES.find(g => g.id === 'word-math')!;
  const {
    score, combo, status, timeLeft,
    setStatus, addScore, incrementCombo, resetCombo,
    subtractTime, resetGame, incrementCorrect, incrementTotal,
    correctAnswers, totalQuestions, maxCombo
  } = useGameStore();

  const [questions, setQuestions] = useState<WordMathQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showMerge, setShowMerge] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [shuffledBlocks, setShuffledBlocks] = useState<string[]>([]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const shuffled = shuffleArray([...wordMathQuestions]);
    setQuestions(shuffled);
    resetGame(3, 60, 1);
  }, []);

  // Shuffle options AND blocks when question changes
  useEffect(() => {
    if (currentQuestion) {
      setShuffledOptions(shuffleArray([...currentQuestion.options]));
      setShuffledBlocks(shuffleArray([...currentQuestion.blocks]));
    }
  }, [currentQuestion]);

  const startGame = () => {
    setStatus('playing');
  };

  const handleAnswer = useCallback((answer: string) => {
    if (status !== 'playing' || selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    incrementTotal();

    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);

    if (correct) {
      haptic.success();
      sound.correct();
      setShowMerge(true);
      incrementCorrect();
      incrementCombo();
      
      // Bonus for not using hint
      const points = showHint ? 70 : 100;
      addScore(points);
    } else {
      haptic.error();
      sound.incorrect();
      resetCombo();
      subtractTime(5);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowHint(false);
      setShowMerge(false);
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setQuestions(shuffleArray([...wordMathQuestions]));
        setCurrentIndex(0);
      }
    }, correct ? 1500 : 800);
  }, [status, selectedAnswer, currentQuestion, combo, showHint, currentIndex, questions.length]);

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
    setQuestions(shuffleArray([...wordMathQuestions]));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowHint(false);
    setShowMerge(false);
    setResult(null);
    resetGame(3, 60, 1);
    setStatus('playing');
  };

  const toggleHint = () => {
    setShowHint(!showHint);
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
              <li>• 단어 블록을 합쳐서 새 단어 만들기</li>
              <li>• 힌트 없이 맞추면 +100점</li>
              <li>• 힌트 사용 시 +70점</li>
              <li>• 오답: -5초</li>
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

  return (
    <div className="min-h-screen flex flex-col">
      <GameHeader maxTime={60} onTimeUp={handleTimeUp} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        {/* Combo Display */}
        <AnimatePresence>
          {combo >= 2 && !showMerge && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="mb-4 combo-badge"
            >
              🔥 COMBO x{combo}!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Equation Display */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 rounded-2xl p-6 mb-6 w-full max-w-md"
        >
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {shuffledBlocks.map((block, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: 1,
                  x: showMerge ? (index - (shuffledBlocks.length - 1) / 2) * -30 : 0
                }}
                transition={{ delay: index * 0.1, duration: showMerge ? 0.3 : 0.2 }}
                className="bg-gradient-to-br from-green-600 to-lime-600 rounded-xl px-4 py-3 border-2 border-green-500"
              >
                <span className="text-2xl font-bold text-white">{block}</span>
              </motion.div>
            ))}
            
            {/* Plus signs */}
            {shuffledBlocks.slice(0, -1).map((_, index) => (
              <motion.span
                key={`plus-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: showMerge ? 0 : 1 }}
                className="text-2xl font-bold text-amber-400"
                style={{ order: index * 2 + 1 }}
              >
                +
              </motion.span>
            ))}

            {/* Equals */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold text-white mx-2"
            >
              =
            </motion.span>

            {/* Result */}
            <motion.div
              animate={{ 
                scale: showMerge ? [1, 1.2, 1] : 1,
                backgroundColor: showMerge ? '#10b981' : '#475569'
              }}
              className="rounded-xl px-4 py-3 border-2 border-slate-500"
            >
              <span className="text-2xl font-bold text-white">
                {showMerge ? currentQuestion.answer : '?'}
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Hint */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 bg-amber-500/20 border border-amber-500 rounded-lg px-4 py-2"
            >
              <p className="text-amber-300 text-sm">💡 {currentQuestion.hint}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hint Button */}
        {!showHint && selectedAnswer === null && (
          <button
            onClick={toggleHint}
            className="mb-4 text-sm text-slate-400 hover:text-amber-400 transition-colors"
          >
            💡 힌트 보기 (-30%)
          </button>
        )}

        {/* Options */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-md">
          {shuffledOptions.map((option, index) => (
            <motion.div
              key={`${currentIndex}-${option}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant="option"
                fullWidth
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                isCorrect={selectedAnswer !== null && option === currentQuestion.answer}
                isIncorrect={selectedAnswer === option && !isCorrect}
                className="text-xl py-4"
              >
                {option}
              </Button>
            </motion.div>
          ))}
        </div>

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
