import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAMES } from './data/gameData';
import { useGameStore } from './stores/gameStore';
import type { GameInfo } from './types/game';

// Game Components
import { AntonymSwitch } from './components/games/AntonymSwitch';
import { ChosungDetective } from './components/games/ChosungDetective';
import { ErrorHunter } from './components/games/ErrorHunter';
import { GrammarTrain } from './components/games/GrammarTrain';
import { StoryQuest } from './components/games/StoryQuest';
import { OddOneOut } from './components/games/OddOneOut';
import { WordMath } from './components/games/WordMath';
import { JamoFishing } from './components/games/JamoFishing';
import { SyllableSlot } from './components/games/SyllableSlot';
import { WordRail } from './components/games/WordRail';
import { FindLetter } from './components/games/FindLetter';
import { WordMatch } from './components/games/WordMatch';
import { Crossword } from './components/games/Crossword';

function GameCard({ game, onClick }: { game: GameInfo; onClick: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="game-card text-left w-full"
    >
      <div className="flex items-start gap-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <span className="text-3xl">{game.icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white mb-1">{game.titleKo}</h3>
          <p className="text-sm text-slate-400 mb-2 line-clamp-2">{game.description}</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="px-2 py-1 bg-slate-700 rounded text-amber-400">
              {game.difficulty} MD
            </span>
            <span className="text-slate-500">{game.timeLimit}초</span>
            <span className="text-slate-500">{game.role}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

function HomePage({ onSelectGame }: { onSelectGame: (gameId: string) => void }) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <header className="relative overflow-hidden py-12 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-purple-500/10" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">
                TOPIK PLAY
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-2">
              한국어 학습을 게임처럼 재미있게!
            </p>
            <p className="text-slate-400">
              13가지 미니게임으로 어휘, 문법, 발음을 마스터하세요
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-8 mt-8"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">13</div>
              <div className="text-sm text-slate-400">미니게임</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">∞</div>
              <div className="text-sm text-slate-400">문제 수</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">FREE</div>
              <div className="text-sm text-slate-400">완전 무료</div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Games Grid */}
      <main className="max-w-4xl mx-auto px-4 pb-12">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-white mb-6 flex items-center gap-2"
        >
          <span>🎮</span> 게임 목록
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-4">
          {GAMES.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <GameCard game={game} onClick={() => onSelectGame(game.id)} />
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>TOPIK PLAY - 한국어 학습 미니게임</p>
          <p className="mt-1">Made with ❤️ for Korean learners</p>
        </footer>
      </main>
    </div>
  );
}

export default function App() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const resetGame = useGameStore((state) => state.resetGame);

  const handleBack = useCallback(() => {
    resetGame();
    setSelectedGame(null);
  }, [resetGame]);

  const handleSelectGame = useCallback((gameId: string) => {
    resetGame();
    setSelectedGame(gameId);
  }, [resetGame]);

  const renderGame = () => {
    switch (selectedGame) {
      case 'antonym-switch':
        return <AntonymSwitch onBack={handleBack} />;
      case 'chosung-detective':
        return <ChosungDetective onBack={handleBack} />;
      case 'error-hunter':
        return <ErrorHunter onBack={handleBack} />;
      case 'grammar-train':
        return <GrammarTrain onBack={handleBack} />;
      case 'story-quest':
        return <StoryQuest onBack={handleBack} />;
      case 'odd-one-out':
        return <OddOneOut onBack={handleBack} />;
      case 'word-math':
        return <WordMath onBack={handleBack} />;
      case 'jamo-fishing':
        return <JamoFishing onBack={handleBack} />;
      case 'syllable-slot':
        return <SyllableSlot onBack={handleBack} />;
      case 'word-rail':
        return <WordRail onBack={handleBack} />;
      case 'find-letter':
        return <FindLetter onBack={handleBack} />;
      case 'word-match':
        return <WordMatch onBack={handleBack} />;
      case 'crossword':
        return <Crossword onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      {selectedGame ? (
        <motion.div
          key={selectedGame}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          {renderGame()}
        </motion.div>
      ) : (
        <motion.div
          key="home"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <HomePage onSelectGame={handleSelectGame} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
