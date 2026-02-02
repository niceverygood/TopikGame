import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameHeader, ResultModal, Button } from '../common';
import { syllableSlotQuestions } from '../../data';
import { shuffleArray } from '../../data/antonymData';
import { GAMES } from '../../data/gameData';
import { haptic } from '../../utils/haptics';
import { sound } from '../../utils/sound';
import type { SyllableSlotQuestion, GameResult } from '../../types/game';

interface SyllableSlotProps {
  onBack: () => void;
}

export function SyllableSlot({ onBack }: SyllableSlotProps) {
  const gameInfo = GAMES.find(g => g.id === 'syllable-slot')!;
  const {
    score, combo, status, hearts, timeLeft,
    setStatus, addScore, incrementCombo, resetCombo,
    loseHeart, resetGame, incrementCorrect, incrementTotal,
    correctAnswers, totalQuestions, maxCombo
  } = useGameStore();

  const [questions, setQuestions] = useState<SyllableSlotQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [choIndex, setChoIndex] = useState(0);
  const [jungIndex, setJungIndex] = useState(0);
  const [jongIndex, setJongIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const shuffled = shuffleArray([...syllableSlotQuestions]);
    setQuestions(shuffled);
    resetGame(3, 45, 1);
  }, []);

  const startGame = () => {
    setStatus('playing');
    // Play target sound 3 times
    playTargetSound();
  };

  const playTargetSound = () => {
    // Using Web Speech API for TTS
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentQuestion?.target || '');
      utterance.lang = 'ko-KR';
      utterance.rate = 0.8;
      
      // Play 3 times with delays
      speechSynthesis.speak(utterance);
      setTimeout(() => speechSynthesis.speak(new SpeechSynthesisUtterance(currentQuestion?.target || '')), 800);
      setTimeout(() => speechSynthesis.speak(new SpeechSynthesisUtterance(currentQuestion?.target || '')), 1600);
    }
  };

  const scrollSlot = (slot: 'cho' | 'jung' | 'jong', direction: 'up' | 'down') => {
    haptic.light();
    sound.click();
    
    const delta = direction === 'up' ? -1 : 1;
    
    if (slot === 'cho') {
      setChoIndex(prev => {
        const len = currentQuestion.chosung.length;
        return (prev + delta + len) % len;
      });
    } else if (slot === 'jung') {
      setJungIndex(prev => {
        const len = currentQuestion.jungsung.length;
        return (prev + delta + len) % len;
      });
    } else {
      setJongIndex(prev => {
        const len = currentQuestion.jongsung.length;
        return (prev + delta + len) % len;
      });
    }
  };

  const checkAnswer = useCallback(() => {
    if (status !== 'playing') return;

    const selectedCho = currentQuestion.chosung[choIndex];
    const selectedJung = currentQuestion.jungsung[jungIndex];
    const selectedJong = currentQuestion.jongsung[jongIndex];

    incrementTotal();

    const correct = 
      selectedCho === currentQuestion.answer.cho &&
      selectedJung === currentQuestion.answer.jung &&
      selectedJong === currentQuestion.answer.jong;

    setIsCorrect(correct);

    if (correct) {
      haptic.success();
      sound.correct();
      incrementCorrect();
      incrementCombo();
      
      const points = showHint ? 60 : 120;
      addScore(points);
    } else {
      haptic.error();
      sound.incorrect();
      resetCombo();
      loseHeart();
      setShowHint(true);
    }

    setTimeout(() => {
      if (correct) {
        setIsCorrect(null);
        setShowHint(false);
        setChoIndex(0);
        setJungIndex(0);
        setJongIndex(0);
        
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
        } else {
          setQuestions(shuffleArray([...syllableSlotQuestions]));
          setCurrentIndex(0);
        }
      } else {
        setIsCorrect(null);
      }
    }, correct ? 1500 : 1000);
  }, [status, currentQuestion, choIndex, jungIndex, jongIndex, showHint, currentIndex, questions.length]);

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
    setQuestions(shuffleArray([...syllableSlotQuestions]));
    setCurrentIndex(0);
    setChoIndex(0);
    setJungIndex(0);
    setJongIndex(0);
    setShowHint(false);
    setIsCorrect(null);
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
              <li>• 소리를 3번 듣고 음절을 맞추세요</li>
              <li>• 슬롯을 스와이프해서 자모 선택</li>
              <li>• 힌트 없이 정답: +120점</li>
              <li>• 힌트 후 정답: +60점</li>
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

  const selectedCho = currentQuestion.chosung[choIndex];
  const selectedJung = currentQuestion.jungsung[jungIndex];
  const selectedJong = currentQuestion.jongsung[jongIndex];

  return (
    <div className="min-h-screen flex flex-col">
      <GameHeader maxTime={45} showHearts onTimeUp={handleTimeUp} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        {/* Audio Button */}
        <button
          onClick={playTargetSound}
          className="mb-6 p-4 bg-fuchsia-600 hover:bg-fuchsia-500 rounded-full shadow-lg shadow-fuchsia-500/30 transition-colors"
        >
          <span className="text-3xl">🔊</span>
        </button>

        {/* Target Display */}
        <div className="mb-6 text-center">
          <p className="text-slate-400 text-sm mb-1">목표 음절</p>
          <AnimatePresence mode="wait">
            {showHint ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-5xl font-bold text-fuchsia-400"
              >
                {currentQuestion.target}
              </motion.div>
            ) : (
              <motion.div className="text-5xl font-bold text-slate-500">
                ?
              </motion.div>
            )}
          </AnimatePresence>
          <p className="text-slate-500 text-sm mt-1">{currentQuestion.meaning}</p>
        </div>

        {/* Combo Display */}
        <AnimatePresence>
          {combo >= 2 && (
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

        {/* Slot Machine */}
        <div className={`bg-gradient-to-br from-fuchsia-900/30 to-pink-900/30 rounded-2xl p-6 border-2 
          ${isCorrect === true ? 'border-emerald-500' : isCorrect === false ? 'border-red-500' : 'border-fuchsia-500/30'}`}>
          <div className="flex gap-4">
            {/* Chosung Slot */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => scrollSlot('cho', 'up')}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                ▲
              </button>
              <div className="w-20 h-20 bg-slate-800 rounded-xl flex items-center justify-center border-2 border-fuchsia-500/50 overflow-hidden">
                <motion.span 
                  key={choIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl font-bold text-white"
                >
                  {selectedCho}
                </motion.span>
              </div>
              <button
                onClick={() => scrollSlot('cho', 'down')}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                ▼
              </button>
              <span className="text-xs text-slate-500 mt-1">초성</span>
            </div>

            {/* Jungsung Slot */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => scrollSlot('jung', 'up')}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                ▲
              </button>
              <div className="w-20 h-20 bg-slate-800 rounded-xl flex items-center justify-center border-2 border-fuchsia-500/50 overflow-hidden">
                <motion.span 
                  key={jungIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl font-bold text-white"
                >
                  {selectedJung}
                </motion.span>
              </div>
              <button
                onClick={() => scrollSlot('jung', 'down')}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                ▼
              </button>
              <span className="text-xs text-slate-500 mt-1">중성</span>
            </div>

            {/* Jongsung Slot */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => scrollSlot('jong', 'up')}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                ▲
              </button>
              <div className="w-20 h-20 bg-slate-800 rounded-xl flex items-center justify-center border-2 border-fuchsia-500/50 overflow-hidden">
                <motion.span 
                  key={jongIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl font-bold text-white"
                >
                  {selectedJong || '-'}
                </motion.span>
              </div>
              <button
                onClick={() => scrollSlot('jong', 'down')}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                ▼
              </button>
              <span className="text-xs text-slate-500 mt-1">종성</span>
            </div>
          </div>
        </div>

        {/* Check Button */}
        <Button
          onClick={checkAnswer}
          variant="primary"
          className="mt-6 text-xl py-4 px-12"
          disabled={isCorrect !== null}
        >
          확인
        </Button>

        {/* Feedback */}
        <AnimatePresence>
          {isCorrect === true && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-emerald-400 font-bold text-xl"
            >
              ✨ 정답! +{showHint ? 60 : 120}점
            </motion.div>
          )}
          {isCorrect === false && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 text-red-400 text-lg"
            >
              다시 시도해보세요!
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
