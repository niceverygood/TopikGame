import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameHeader, ResultModal, Button } from '../common';
import { grammarTrainQuestions } from '../../data';
import { shuffleArray } from '../../data/antonymData';
import { GAMES } from '../../data/gameData';
import { haptic } from '../../utils/haptics';
import { sound } from '../../utils/sound';
import type { GrammarTrainQuestion, GameResult } from '../../types/game';

interface GrammarTrainProps {
  onBack: () => void;
}

export function GrammarTrain({ onBack }: GrammarTrainProps) {
  const gameInfo = GAMES.find(g => g.id === 'grammar-train')!;
  const {
    score, combo, status, timeLeft,
    setStatus, addScore, incrementCombo, resetCombo,
    subtractTime, resetGame, incrementCorrect, incrementTotal,
    correctAnswers, totalQuestions, maxCombo
  } = useGameStore();

  const [questions, setQuestions] = useState<GrammarTrainQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showTrain, setShowTrain] = useState(false);
  const [result, setResult] = useState<GameResult | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const shuffled = shuffleArray([...grammarTrainQuestions]);
    setQuestions(shuffled);
    resetGame(3, 90, 1);
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
      addScore(100);
      setShowTrain(true);
    } else {
      haptic.error();
      sound.incorrect();
      resetCombo();
      subtractTime(3);
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowTrain(false);
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setQuestions(shuffleArray([...grammarTrainQuestions]));
        setCurrentIndex(0);
      }
    }, correct ? 1500 : 800);
  }, [status, selectedAnswer, currentQuestion, combo, currentIndex, questions.length]);

  const handleTimeUp = useCallback(() => {
    setStatus('finished');
    setResult({
      score,
      maxCombo,
      correctAnswers,
      totalQuestions,
      timeSpent: 90 - timeLeft,
      level: 1,
    });
  }, [score, maxCombo, correctAnswers, totalQuestions, timeLeft]);

  useEffect(() => {
    if (status === 'finished' && !result) {
      handleTimeUp();
    }
  }, [status, result, handleTimeUp]);

  const handleRestart = () => {
    setQuestions(shuffleArray([...grammarTrainQuestions]));
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowTrain(false);
    setResult(null);
    resetGame(3, 90, 1);
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
              <li>• 어간에 맞는 조사/어미를 연결하세요</li>
              <li>• 문맥을 보고 올바른 문법을 선택하세요</li>
              <li>• 정답: +100점</li>
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
      <GameHeader maxTime={90} onTimeUp={handleTimeUp} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        {/* Context Hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-400 mb-4 text-center"
        >
          📝 문맥: {currentQuestion.context}
        </motion.p>

        {/* Train Display */}
        <div className="relative w-full max-w-md mb-8">
          {/* Rail Track */}
          <div className="h-4 bg-slate-700 rounded-full mb-4 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-around">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-slate-600 rounded-full" />
              ))}
            </div>
          </div>

          {/* Train Cars */}
          <motion.div 
            className="flex items-center justify-center gap-1"
            animate={showTrain ? { x: [0, 50, 100] } : {}}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            {/* Engine (Stem) */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 border-2 border-blue-500 shadow-lg">
              <span className="text-2xl font-bold text-white">{currentQuestion.stem}</span>
            </div>

            {/* Connector */}
            <div className="w-4 h-2 bg-slate-500 rounded" />

            {/* Grammar Block (Answer) */}
            <motion.div 
              className={`rounded-xl p-4 border-2 shadow-lg ${
                isCorrect === true 
                  ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 border-emerald-500' 
                  : isCorrect === false
                  ? 'bg-gradient-to-br from-red-600 to-red-700 border-red-500 animate-shake'
                  : 'bg-gradient-to-br from-slate-600 to-slate-700 border-slate-500'
              }`}
              animate={isCorrect === true ? { scale: [1, 1.1, 1] } : {}}
            >
              <span className="text-2xl font-bold text-white">
                {selectedAnswer || '?'}
              </span>
            </motion.div>
          </motion.div>

          {/* Full Sentence on Success */}
          <AnimatePresence>
            {showTrain && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-center"
              >
                <p className="text-emerald-400 font-medium">✨ {currentQuestion.fullSentence}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Combo Display */}
        <AnimatePresence>
          {combo >= 2 && !showTrain && (
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

        {/* Grammar Options */}
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
