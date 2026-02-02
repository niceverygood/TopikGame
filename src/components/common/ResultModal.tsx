import { motion, AnimatePresence } from 'framer-motion';
import type { GameResult } from '../../types/game';

interface ResultModalProps {
  isOpen: boolean;
  result: GameResult | null;
  onRestart: () => void;
  onHome: () => void;
  gameName: string;
}

export function ResultModal({ isOpen, result, onRestart, onHome, gameName }: ResultModalProps) {
  if (!result) return null;

  const accuracy = result.totalQuestions > 0 
    ? Math.round((result.correctAnswers / result.totalQuestions) * 100)
    : 0;

  const getGrade = (score: number): { grade: string; color: string; emoji: string } => {
    if (score >= 5000) return { grade: 'S', color: 'from-amber-400 to-yellow-300', emoji: '🏆' };
    if (score >= 3000) return { grade: 'A', color: 'from-emerald-400 to-green-300', emoji: '⭐' };
    if (score >= 2000) return { grade: 'B', color: 'from-blue-400 to-cyan-300', emoji: '👍' };
    if (score >= 1000) return { grade: 'C', color: 'from-purple-400 to-pink-300', emoji: '💪' };
    return { grade: 'D', color: 'from-slate-400 to-slate-300', emoji: '📚' };
  };

  const { grade, color, emoji } = getGrade(result.score);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-700"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="text-6xl mb-2"
              >
                {emoji}
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-1">게임 종료!</h2>
              <p className="text-slate-400">{gameName}</p>
            </div>

            {/* Grade */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="flex justify-center mb-6"
            >
              <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <span className="text-5xl font-black text-slate-900">{grade}</span>
              </div>
            </motion.div>

            {/* Stats */}
            <div className="space-y-3 mb-8">
              <StatRow label="총 점수" value={result.score.toLocaleString()} highlight />
              <StatRow label="최대 콤보" value={`${result.maxCombo}x`} />
              <StatRow label="정답률" value={`${accuracy}%`} />
              <StatRow label="정답/문제" value={`${result.correctAnswers}/${result.totalQuestions}`} />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onHome}
                className="flex-1 btn-secondary"
              >
                🏠 홈으로
              </button>
              <button
                onClick={onRestart}
                className="flex-1 btn-primary"
              >
                🔄 다시하기
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function StatRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 px-4 rounded-lg bg-slate-800/50">
      <span className="text-slate-400">{label}</span>
      <span className={highlight ? 'text-2xl font-bold text-amber-400' : 'text-lg font-semibold text-white'}>
        {value}
      </span>
    </div>
  );
}
