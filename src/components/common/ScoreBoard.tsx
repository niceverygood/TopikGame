import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';

interface ScoreBoardProps {
  showCombo?: boolean;
  showMultiplier?: boolean;
}

export function ScoreBoard({ showCombo = true, showMultiplier = true }: ScoreBoardProps) {
  const { score, combo, getComboMultiplier } = useGameStore();
  const multiplier = getComboMultiplier();
  const isFever = combo >= 5;

  return (
    <div className="flex items-center gap-4">
      {/* Score Display */}
      <div className="flex flex-col items-end">
        <span className="text-xs text-slate-400 uppercase tracking-wider">Score</span>
        <motion.span 
          className="score-display"
          key={score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {score.toLocaleString()}
        </motion.span>
      </div>

      {/* Combo Display */}
      {showCombo && (
        <AnimatePresence mode="wait">
          {combo > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`combo-badge ${isFever ? 'animate-pulse-glow' : ''}`}
            >
              <span className="text-lg">🔥</span>
              <span>x{combo}</span>
              {showMultiplier && multiplier > 1 && (
                <span className="text-xs opacity-80">({multiplier.toFixed(1)}x)</span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

// Floating score animation component
export function FloatingScore({ points, x, y }: { points: number; x: number; y: number }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-50 font-bold text-2xl"
      initial={{ x, y, opacity: 1, scale: 1 }}
      animate={{ y: y - 100, opacity: 0, scale: 1.5 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{
        color: points > 0 ? '#10b981' : '#ef4444',
      }}
    >
      {points > 0 ? '+' : ''}{points}
    </motion.div>
  );
}
