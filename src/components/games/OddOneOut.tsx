import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameHeader, ResultModal } from '../common';
import { oddOneOutQuestions } from '../../data';
import { shuffleArray } from '../../data/antonymData';
import { GAMES } from '../../data/gameData';
import { haptic } from '../../utils/haptics';
import { sound } from '../../utils/sound';
import type { OddOneOutQuestion, OddOneOutItem, GameResult } from '../../types/game';
import { Button } from '../common';

interface OddOneOutProps {
  onBack: () => void;
}

export function OddOneOut({ onBack }: OddOneOutProps) {
  const gameInfo = GAMES.find(g => g.id === 'odd-one-out')!;
  const {
    score, combo, status, timeLeft,
    setStatus, addScore, incrementCombo, resetCombo,
    subtractTime, resetGame, incrementCorrect, incrementTotal,
    correctAnswers, totalQuestions, maxCombo
  } = useGameStore();

  const [questions, setQuestions] = useState<OddOneOutQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showRule, setShowRule] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const [answerTime, setAnswerTime] = useState(0);
  const [shuffledItems, setShuffledItems] = useState<OddOneOutItem[]>([]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const shuffled = shuffleArray([...oddOneOutQuestions]);
    setQuestions(shuffled);
    resetGame(3, 45, 1);
  }, []);

  // Shuffle items when question changes
  useEffect(() => {
    if (currentQuestion) {
      setShuffledItems(shuffleArray([...currentQuestion.items]));
    }
  }, [currentQuestion]);

  // Track answer time
  useEffect(() => {
    if (status === 'playing' && selectedItem === null) {
      const start = Date.now();
      const timer = setInterval(() => {
        setAnswerTime((Date.now() - start) / 1000);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [status, selectedItem, currentIndex]);

  const startGame = () => {
    setStatus('playing');
    setAnswerTime(0);
  };

  const handleSelect = useCallback((itemText: string) => {
    if (status !== 'playing' || selectedItem !== null) return;

    setSelectedItem(itemText);
    incrementTotal();

    const correct = itemText === currentQuestion.oddOne;
    setIsCorrect(correct);

    if (correct) {
      haptic.success();
      sound.correct();
      incrementCorrect();
      incrementCombo();
      
      // Base score + speed bonus
      let points = 100;
      if (answerTime < 2) {
        points += 50; // Speed bonus
      }
      
      // Combo bonus
      if (combo >= 3) {
        points = Math.floor(points * 1.5);
      }
      
      addScore(points);
      setShowRule(true);
    } else {
      haptic.error();
      sound.incorrect();
      resetCombo();
      subtractTime(3);
    }

    setTimeout(() => {
      setSelectedItem(null);
      setIsCorrect(null);
      setShowRule(false);
      setAnswerTime(0);
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setQuestions(shuffleArray([...oddOneOutQuestions]));
        setCurrentIndex(0);
      }
    }, correct ? 1500 : 800);
  }, [status, selectedItem, currentQuestion, combo, answerTime, currentIndex, questions.length]);

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
    setQuestions(shuffleArray([...oddOneOutQuestions]));
    setCurrentIndex(0);
    setSelectedItem(null);
    setIsCorrect(null);
    setShowRule(false);
    setResult(null);
    setAnswerTime(0);
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
              <li>• 4개 중 다른 하나를 찾으세요</li>
              <li>• 빠르게 맞출수록 보너스 점수!</li>
              <li>• 정답: +100점 (2초 내 +50)</li>
              <li>• 오답: -3초</li>
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
      <GameHeader maxTime={45} onTimeUp={handleTimeUp} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        {/* Instruction */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-amber-400 text-lg mb-6 text-center"
        >
          🕵️ 다른 하나를 찾으세요!
        </motion.p>

        {/* Combo Display */}
        <AnimatePresence>
          {combo >= 3 && !showRule && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="mb-4 combo-badge"
            >
              🔥 COMBO x{combo}! (1.5x)
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {shuffledItems.map((item) => {
            const isSelected = selectedItem === item.text;
            const isOdd = item.text === currentQuestion.oddOne;
            const showCorrect = selectedItem !== null && isOdd;
            const showWrong = isSelected && !isOdd;

            return (
              <motion.button
                key={item.text}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: showCorrect ? 1.1 : showWrong ? 0.95 : 1,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSelect(item.text)}
                disabled={selectedItem !== null}
                className={`
                  aspect-square rounded-2xl p-4 flex flex-col items-center justify-center
                  transition-all duration-200 border-3
                  ${showCorrect 
                    ? 'bg-emerald-500/30 border-emerald-500 shadow-lg shadow-emerald-500/30' 
                    : showWrong 
                    ? 'bg-red-500/30 border-red-500 animate-shake'
                    : 'bg-slate-800 border-slate-700 hover:border-amber-500/50'
                  }
                `}
              >
                <span className="text-5xl mb-2">{item.icon}</span>
                <span className={`text-lg font-medium ${
                  showCorrect ? 'text-emerald-400' : showWrong ? 'text-red-400' : 'text-white'
                }`}>
                  {item.text}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Rule Popup */}
        <AnimatePresence>
          {showRule && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 bg-emerald-500/20 border border-emerald-500 rounded-xl p-4 text-center"
            >
              <p className="text-emerald-400 font-medium">✨ 정답!</p>
              <p className="text-white">{currentQuestion.rule}</p>
              {answerTime < 2 && (
                <p className="text-amber-400 text-sm mt-1">⚡ 스피드 보너스 +50!</p>
              )}
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
