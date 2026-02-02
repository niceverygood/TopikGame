import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';

interface HeartDisplayProps {
  maxHearts?: number;
}

export function HeartDisplay({ maxHearts = 3 }: HeartDisplayProps) {
  const { hearts } = useGameStore();

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxHearts }).map((_, index) => (
        <AnimatePresence key={index} mode="wait">
          {index < hearts ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-2xl"
            >
              ❤️
            </motion.span>
          ) : (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl opacity-30"
            >
              🖤
            </motion.span>
          )}
        </AnimatePresence>
      ))}
    </div>
  );
}
