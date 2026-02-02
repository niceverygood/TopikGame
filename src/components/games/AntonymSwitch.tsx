import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameHeader, ResultModal, Button } from '../common';
import { antonymQuestions, shuffleArray } from '../../data';
import { GAMES } from '../../data/gameData';
import { haptic } from '../../utils/haptics';
import { sound } from '../../utils/sound';
import type { AntonymQuestion, GameResult } from '../../types/game';

interface AntonymSwitchProps {
  onBack: () => void;
}

export function AntonymSwitch({ onBack }: AntonymSwitchProps) {
  const gameInfo = GAMES.find(g => g.id === 'antonym-switch')!;
  const {
    score, combo, status, timeLeft,
    setStatus, addScore, incrementCombo, resetCombo,
    subtractTime, addTime, resetGame, incrementCorrect, incrementTotal,
    correctAnswers, totalQuestions, maxCombo
  } = useGameStore();

  const [questions, setQuestions] = useState<AntonymQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFlip, setShowFlip] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const currentQuestion = questions[currentIndex];

  // Initialize game
  useEffect(() => {
    const shuffled = shuffleArray([...antonymQuestions]);
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

  const handleAnswer = useCallback((answer: string) => {
    if (status !== 'playing' || selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    incrementTotal();

    const correct = answer === currentQuestion.answer;
    setIsCorrect(correct);

    if (correct) {
      haptic.success();
      sound.correct();
      setShowFlip(true);
      incrementCorrect();
      incrementCombo();
      
      // Base score + combo bonus
      const baseScore = 100;
      addScore(baseScore);
      
      // Fever bonus every 5 combos
      if ((combo + 1) % 5 === 0) {
        addTime(5);
        sound.fever();
      }
    } else {
      haptic.error();
      sound.incorrect();
      resetCombo();
      subtractTime(2);
    }

    // Move to next question after delay
    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowFlip(false);
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        // Reshuffle and restart
        setQuestions(shuffleArray([...antonymQuestions]));
        setCurrentIndex(0);
      }
    }, correct ? 800 : 600);
  }, [status, selectedAnswer, currentQuestion, combo, currentIndex, questions.length]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    setStatus('finished');
    const timeBonus = Math.floor(timeLeft * 10);
    setResult({
      score: score + timeBonus,
      maxCombo,
      correctAnswers,
      totalQuestions,
      timeSpent: 60 - timeLeft,
      level: 1,
    });
  }, [score, maxCombo, correctAnswers, totalQuestions, timeLeft]);

  // Watch for game end
  useEffect(() => {
    if (status === 'finished' && !result) {
      handleTimeUp();
    }
  }, [status, result, handleTimeUp]);

  const handleRestart = () => {
    setQuestions(shuffleArray([...antonymQuestions]));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFlip(false);
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
              <li>• 화면에 나타난 단어의 반대말을 선택하세요</li>
              <li>• 정답: +100점, 콤보 보너스</li>
              <li>• 오답: -2초, 콤보 초기화</li>
              <li>• 5콤보마다 +5초 보너스!</li>
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
        {/* Word Card */}
        <div className="mb-8 perspective-1000">
          <motion.div
            className={`relative w-64 h-40 ${showFlip ? 'preserve-3d' : ''}`}
            animate={{ rotateY: showFlip ? 180 : 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Front */}
            <div 
              className={`absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 
                         flex items-center justify-center shadow-xl border-2 
                         ${isCorrect === false ? 'border-red-500 animate-shake' : 'border-slate-600'}`}
            >
              <span className="text-4xl font-bold text-white">
                {currentQuestion.word}
              </span>
            </div>
            
            {/* Back */}
            <div 
              className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-700 
                         flex items-center justify-center shadow-xl border-2 border-emerald-500"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <span className="text-4xl font-bold text-white">
                {currentQuestion.answer}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Combo Display */}
        <AnimatePresence>
          {combo >= 2 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="mb-6 combo-badge text-xl"
            >
              🔥 COMBO x{combo}!
            </motion.div>
          )}
        </AnimatePresence>

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

        {/* Progress */}
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
