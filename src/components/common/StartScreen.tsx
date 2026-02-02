import { motion } from 'framer-motion';
import type { GameInfo } from '../../types/game';

interface StartScreenProps {
  game: GameInfo;
  onStart: () => void;
  onBack: () => void;
}

export function StartScreen({ game, onStart, onBack }: StartScreenProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.1 }}
          className={`w-32 h-32 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${game.gradient} flex items-center justify-center shadow-xl`}
        >
          <span className="text-6xl">{game.icon}</span>
        </motion.div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-2">{game.titleKo}</h1>
        <p className="text-slate-400 mb-2">{game.title}</p>
        
        {/* Description */}
        <p className="text-slate-300 mb-6">{game.description}</p>

        {/* Game Info */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
            <span className="text-xs text-slate-400 block">난이도</span>
            <span className="text-amber-400 font-bold">{game.difficulty} MD</span>
          </div>
          <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
            <span className="text-xs text-slate-400 block">제한시간</span>
            <span className="text-white font-bold">{game.timeLimit}초</span>
          </div>
          <div className="px-4 py-2 bg-slate-800/50 rounded-lg">
            <span className="text-xs text-slate-400 block">역할</span>
            <span className="text-white font-bold">{game.role}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="btn-primary text-xl py-4"
          >
            🎮 게임 시작
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="btn-secondary"
          >
            ← 뒤로가기
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
