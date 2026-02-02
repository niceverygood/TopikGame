import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameHeader, ResultModal, Button } from '../common';
import { storyScenes } from '../../data';
import { shuffleArray } from '../../data/antonymData';
import { GAMES } from '../../data/gameData';
import { haptic } from '../../utils/haptics';
import { sound } from '../../utils/sound';
import type { StoryScene, GameResult } from '../../types/game';

interface StoryQuestProps {
  onBack: () => void;
}

const backgroundColors: Record<string, string> = {
  cafe: 'from-amber-900/30 to-orange-900/30',
  restaurant: 'from-red-900/30 to-rose-900/30',
  subway: 'from-slate-800/30 to-gray-900/30',
  shop: 'from-pink-900/30 to-purple-900/30',
  street: 'from-green-900/30 to-emerald-900/30',
  phone: 'from-blue-900/30 to-indigo-900/30',
  calendar: 'from-violet-900/30 to-purple-900/30',
  hospital: 'from-cyan-900/30 to-teal-900/30',
  taxi: 'from-yellow-900/30 to-amber-900/30',
  hotel: 'from-indigo-900/30 to-blue-900/30',
};

const backgroundIcons: Record<string, string> = {
  cafe: '☕',
  restaurant: '🍽️',
  subway: '🚇',
  shop: '🛍️',
  street: '🏙️',
  phone: '📱',
  calendar: '📅',
  hospital: '🏥',
  taxi: '🚕',
  hotel: '🏨',
};

export function StoryQuest({ onBack }: StoryQuestProps) {
  const gameInfo = GAMES.find(g => g.id === 'story-quest')!;
  const {
    score, combo, status, timeLeft,
    setStatus, addScore, incrementCombo, resetCombo,
    loseHeart, resetGame, incrementCorrect, incrementTotal,
    correctAnswers, totalQuestions, maxCombo
  } = useGameStore();

  const [scenes, setScenes] = useState<StoryScene[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentDialogueIndex, setCurrentDialogueIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showVocab, setShowVocab] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [result, setResult] = useState<GameResult | null>(null);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const currentScene = scenes[currentIndex];
  const currentDialogue = currentScene?.dialogues[currentDialogueIndex];

  useEffect(() => {
    const shuffled = shuffleArray([...storyScenes]);
    setScenes(shuffled);
    resetGame(3, 90, 1);
  }, []);

  // Shuffle options when scene changes
  useEffect(() => {
    if (currentScene) {
      setShuffledOptions(shuffleArray([...currentScene.options]));
    }
  }, [currentScene]);

  // Typing effect
  useEffect(() => {
    if (!currentDialogue || currentDialogue.blank) return;
    
    const text = currentDialogue.text;
    let index = 0;
    setTypingText('');
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setTypingText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
        // Move to next dialogue after delay
        setTimeout(() => {
          if (currentDialogueIndex < currentScene.dialogues.length - 1) {
            setCurrentDialogueIndex(prev => prev + 1);
          }
        }, 500);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentDialogue, currentDialogueIndex, currentScene]);

  const startGame = () => {
    setStatus('playing');
  };

  const handleAnswer = useCallback((answer: string) => {
    if (status !== 'playing' || selectedAnswer !== null) return;

    setSelectedAnswer(answer);
    incrementTotal();

    const correct = answer === currentScene.answer;
    setIsCorrect(correct);

    if (correct) {
      haptic.success();
      sound.correct();
      incrementCorrect();
      incrementCombo();
      addScore(100);
      setShowVocab(true);
    } else {
      haptic.error();
      sound.incorrect();
      resetCombo();
      loseHeart();
    }

    setTimeout(() => {
      setSelectedAnswer(null);
      setIsCorrect(null);
      setShowVocab(false);
      setCurrentDialogueIndex(0);
      
      if (currentIndex < scenes.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setScenes(shuffleArray([...storyScenes]));
        setCurrentIndex(0);
      }
    }, correct ? 2000 : 1500);
  }, [status, selectedAnswer, currentScene, combo, currentIndex, scenes.length]);

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
    setScenes(shuffleArray([...storyScenes]));
    setCurrentIndex(0);
    setCurrentDialogueIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowVocab(false);
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
              <li>• 상황에 맞는 대화를 읽으세요</li>
              <li>• 빈칸에 들어갈 말을 선택하세요</li>
              <li>• 정답: +100점, 새 단어 획득</li>
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

  if (!currentScene) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const bgColor = backgroundColors[currentScene.background] || 'from-slate-800/30 to-slate-900/30';
  const bgIcon = backgroundIcons[currentScene.background] || '💬';

  return (
    <div className="min-h-screen flex flex-col">
      <GameHeader maxTime={90} showHearts onTimeUp={handleTimeUp} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center p-4 max-w-2xl mx-auto w-full">
        {/* Scene Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-md rounded-t-2xl bg-gradient-to-br ${bgColor} p-4 border-b border-slate-700`}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{bgIcon}</span>
            <div>
              <h2 className="text-lg font-bold text-white">{currentScene.title}</h2>
              <p className="text-sm text-slate-400">Scene {currentIndex + 1}</p>
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className={`w-full max-w-md bg-gradient-to-br ${bgColor} p-4 min-h-[200px]`}>
          <div className="space-y-3">
            {currentScene.dialogues.slice(0, currentDialogueIndex + 1).map((dialogue, index) => {
              const isUser = dialogue.speaker === 'user';
              const isBlank = dialogue.blank;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      isUser
                        ? 'bg-amber-500 text-white rounded-br-sm'
                        : 'bg-slate-700 text-white rounded-bl-sm'
                    }`}
                  >
                    {isBlank ? (
                      <span>
                        {dialogue.text.replace('_______', '')}
                        <span className={`inline-block min-w-[60px] border-b-2 ${
                          selectedAnswer 
                            ? isCorrect 
                              ? 'border-emerald-400 text-emerald-400' 
                              : 'border-red-400 text-red-400'
                            : 'border-white/50'
                        }`}>
                          {selectedAnswer || '_______'}
                        </span>
                      </span>
                    ) : (
                      index === currentDialogueIndex ? typingText : dialogue.text
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Options - Show when blank dialogue is reached */}
        {currentDialogue?.blank && selectedAnswer === null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-slate-800/50 rounded-b-2xl p-4"
          >
            <div className="grid grid-cols-1 gap-2">
              {shuffledOptions.map((option) => (
                <Button
                  key={option}
                  variant="option"
                  fullWidth
                  onClick={() => handleAnswer(option)}
                  className="text-lg"
                >
                  {option}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Vocab Badge */}
        <AnimatePresence>
          {showVocab && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="mt-6 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-4 text-center"
            >
              <p className="text-sm text-emerald-200">🎉 새 단어 획득!</p>
              <p className="text-2xl font-bold text-white">{currentScene.newVocab}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Combo */}
        <AnimatePresence>
          {combo >= 2 && !showVocab && (
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
