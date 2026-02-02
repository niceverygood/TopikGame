import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameHeader, ResultModal, Button, HeartDisplay } from '../common';
import { chosungQuestions } from '../../data';
import { shuffleArray } from '../../data/antonymData';
import { GAMES } from '../../data/gameData';
import { haptic } from '../../utils/haptics';
import { sound } from '../../utils/sound';
import type { ChosungQuestion, GameResult } from '../../types/game';

interface ChosungDetectiveProps {
  onBack: () => void;
}

export function ChosungDetective({ onBack }: ChosungDetectiveProps) {
  const gameInfo = GAMES.find(g => g.id === 'chosung-detective')!;
  const {
    score, combo, status, hearts, timeLeft,
    setStatus, addScore, incrementCombo, resetCombo,
    loseHeart, resetGame, incrementCorrect, incrementTotal,
    correctAnswers, totalQuestions, maxCombo
  } = useGameStore();

  const [questions, setQuestions] = useState<ChosungQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const shuffled = shuffleArray([...chosungQuestions]);
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
      incrementCorrect();
      incrementCombo();
      
      const baseScore = 100;
      addScore(baseScore);
      
      if ((combo + 1) % 5 === 0) {
        sound.fever();
      }
    } else {
      haptic.error();
      sound.incorrect();
      resetCombo();
      loseHeart();
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowHint(false);
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setQuestions(shuffleArray([...chosungQuestions]));
        setCurrentIndex(0);
      }
    }, correct ? 800 : 1000);
  }, [status, selectedAnswer, currentQuestion, combo, currentIndex, questions.length]);

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

  useEffect(() => {
    if (status === 'finished' && !result) {
      handleTimeUp();
    }
  }, [status, result, handleTimeUp]);

  const handleRestart = () => {
    setQuestions(shuffleArray([...chosungQuestions]));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowHint(false);
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
              <li>• 힌트와 초성을 보고 단어를 맞추세요</li>
              <li>• 정답: +100점, 콤보 보너스</li>
              <li>• 오답: 하트 1개 감소</li>
              <li>• 하트가 모두 없어지면 게임 종료!</li>
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
      <GameHeader maxTime={60} showHearts onTimeUp={handleTimeUp} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        {/* Hint Card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-violet-900/50 to-purple-900/50 rounded-2xl p-6 mb-6 w-full max-w-md border border-violet-500/30"
        >
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">💡 힌트</p>
            <p className="text-xl text-white mb-4">{currentQuestion.hint}</p>
            
            {/* Chosung Display */}
            <div className="flex justify-center gap-2">
              {currentQuestion.chosung.split('').map((char, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="w-14 h-14 bg-slate-800 rounded-xl flex items-center justify-center border-2 border-violet-500"
                >
                  <span className="text-3xl font-bold text-violet-400">{char}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Combo Display */}
        <AnimatePresence>
          {combo >= 2 && (
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

        {/* Feedback */}
        <AnimatePresence>
          {isCorrect === true && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-2xl text-emerald-400 font-bold"
            >
              ✨ 정답! +100점
            </motion.div>
          )}
          {isCorrect === false && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 text-xl text-red-400"
            >
              정답: {currentQuestion.answer}
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
