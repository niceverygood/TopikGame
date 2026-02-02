import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameHeader, ResultModal, Button } from '../common';
import { wordMatchLevel1, wordMatchLevel4, shuffleCards } from '../../data';
import { GAMES } from '../../data/gameData';
import { haptic } from '../../utils/haptics';
import { sound } from '../../utils/sound';
import type { MatchCard, GameResult } from '../../types/game';

interface WordMatchProps {
  onBack: () => void;
}

interface CardState {
  card: MatchCard;
  isFlipped: boolean;
  isMatched: boolean;
}

export function WordMatch({ onBack }: WordMatchProps) {
  const gameInfo = GAMES.find(g => g.id === 'word-match')!;
  const {
    score, combo, status, timeLeft,
    setStatus, addScore, incrementCombo, resetCombo,
    loseHeart, resetGame, incrementCorrect, incrementTotal,
    correctAnswers, totalQuestions, maxCombo
  } = useGameStore();

  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<CardState[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [result, setResult] = useState<GameResult | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const totalPairs = cards.length / 2;

  useEffect(() => {
    const levelCards = level === 1 ? wordMatchLevel1 : wordMatchLevel4;
    const shuffled = shuffleCards([...levelCards]);
    setCards(shuffled.map(card => ({
      card,
      isFlipped: false,
      isMatched: false,
    })));
    resetGame(3, 60, level);
  }, [level]);

  // Preview cards at start
  useEffect(() => {
    if (status === 'playing' && cards.length > 0) {
      // Show all cards for 3 seconds
      setCards(prev => prev.map(c => ({ ...c, isFlipped: true })));
      setTimeout(() => {
        setCards(prev => prev.map(c => ({ ...c, isFlipped: false })));
      }, 3000);
    }
  }, [status]);

  const startGame = () => {
    setStatus('playing');
  };

  const handleCardClick = useCallback((index: number) => {
    if (status !== 'playing' || isChecking) return;
    if (cards[index].isFlipped || cards[index].isMatched) return;
    if (selectedCards.length >= 2) return;

    haptic.light();
    sound.click();

    // Flip the card
    setCards(prev => prev.map((c, i) => 
      i === index ? { ...c, isFlipped: true } : c
    ));

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    // Check for match when 2 cards are selected
    if (newSelected.length === 2) {
      setIsChecking(true);
      const [first, second] = newSelected;
      const card1 = cards[first].card;
      const card2 = cards[second].card;

      incrementTotal();

      if (card1.pairId === card2.pairId && first !== second) {
        // Match!
        haptic.success();
        sound.correct();
        setShowMatch(true);

        setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            i === first || i === second ? { ...c, isMatched: true } : c
          ));
          setSelectedCards([]);
          setShowMatch(false);
          setIsChecking(false);
          
          incrementCorrect();
          incrementCombo();
          
          const points = level === 1 ? 15 : 20;
          addScore(points);
          
          const newMatchedPairs = matchedPairs + 1;
          setMatchedPairs(newMatchedPairs);

          // Check if game complete
          if (newMatchedPairs === totalPairs) {
            addScore(100); // Completion bonus
            setTimeout(() => {
              setStatus('finished');
            }, 500);
          }
        }, 600);
      } else {
        // No match
        haptic.error();
        sound.incorrect();
        resetCombo();
        loseHeart();
        addScore(-3);

        setTimeout(() => {
          setCards(prev => prev.map((c, i) =>
            i === first || i === second ? { ...c, isFlipped: false } : c
          ));
          setSelectedCards([]);
          setIsChecking(false);
        }, 1200);
      }
    }
  }, [status, isChecking, cards, selectedCards, matchedPairs, totalPairs, level]);

  const handleTimeUp = useCallback(() => {
    setStatus('finished');
    setResult({
      score,
      maxCombo,
      correctAnswers,
      totalQuestions,
      timeSpent: 60 - timeLeft,
      level,
    });
  }, [score, maxCombo, correctAnswers, totalQuestions, timeLeft, level]);

  useEffect(() => {
    if (status === 'finished' && !result) {
      setResult({
        score,
        maxCombo,
        correctAnswers,
        totalQuestions,
        timeSpent: 60 - timeLeft,
        level,
      });
    }
  }, [status, result, score, maxCombo, correctAnswers, totalQuestions, timeLeft, level]);

  const handleRestart = () => {
    const levelCards = level === 1 ? wordMatchLevel1 : wordMatchLevel4;
    const shuffled = shuffleCards([...levelCards]);
    setCards(shuffled.map(card => ({
      card,
      isFlipped: false,
      isMatched: false,
    })));
    setSelectedCards([]);
    setShowMatch(false);
    setMatchedPairs(0);
    setResult(null);
    resetGame(3, 60, level);
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
              <li>• 카드를 뒤집어 같은 짝을 찾으세요</li>
              <li>• 처음 3초간 모든 카드 공개!</li>
              <li>• 매칭 성공: +15~20점</li>
              <li>• 매칭 실패: 하트 -1, -3점</li>
            </ul>
          </div>

          {/* Level Selection */}
          <div className="flex gap-3 mb-6">
            <Button
              variant={level === 1 ? 'primary' : 'secondary'}
              onClick={() => setLevel(1)}
              className="flex-1"
            >
              Lv.1 동일 단어
            </Button>
            <Button
              variant={level === 4 ? 'primary' : 'secondary'}
              onClick={() => setLevel(4)}
              className="flex-1"
            >
              Lv.4 단어-뜻
            </Button>
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

  const gridCols = level === 1 ? 'grid-cols-4' : 'grid-cols-4';

  return (
    <div className="min-h-screen flex flex-col">
      <GameHeader maxTime={60} showHearts onTimeUp={handleTimeUp} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        {/* Progress */}
        <div className="mb-4 text-center">
          <p className="text-slate-400 text-sm">
            찾은 짝: {matchedPairs} / {totalPairs}
          </p>
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

        {/* Card Grid */}
        <div className={`grid ${gridCols} gap-2`}>
          {cards.map((cardState, index) => {
            const { card, isFlipped, isMatched } = cardState;
            // const isSelected = selectedCards.includes(index); // Not used in render

            return (
              <motion.button
                key={card.id}
                onClick={() => handleCardClick(index)}
                disabled={isFlipped || isMatched}
                className="perspective-1000"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className={`relative w-16 h-20 sm:w-20 sm:h-24 preserve-3d transition-transform duration-300
                    ${isFlipped || isMatched ? 'rotate-y-180' : ''}`}
                  animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Card Back */}
                  <div className={`absolute inset-0 backface-hidden rounded-xl flex items-center justify-center
                    bg-gradient-to-br from-orange-500 to-red-600 border-2 border-orange-400 shadow-lg
                    ${isMatched ? 'opacity-50' : ''}`}>
                    <span className="text-2xl">🃏</span>
                  </div>

                  {/* Card Front */}
                  <div 
                    className={`absolute inset-0 backface-hidden rounded-xl flex items-center justify-center p-2
                      bg-white border-2 shadow-lg
                      ${isMatched 
                        ? 'border-emerald-500 bg-emerald-50' 
                        : 'border-slate-300'
                      }`}
                    style={{ transform: 'rotateY(180deg)' }}
                  >
                    <span className={`text-sm sm:text-base font-medium text-center leading-tight
                      ${card.type === 'word' ? 'text-slate-800' : 'text-slate-600'}`}>
                      {card.content}
                    </span>
                  </div>
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* Match Effect */}
        <AnimatePresence>
          {showMatch && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center pointer-events-none z-50"
            >
              <div className="bg-emerald-500/80 text-white text-3xl font-bold px-8 py-4 rounded-xl shadow-2xl">
                ✨ Match!
              </div>
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
