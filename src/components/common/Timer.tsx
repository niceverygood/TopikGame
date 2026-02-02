import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';

interface TimerProps {
  maxTime: number;
  onTimeUp?: () => void;
  showSeconds?: boolean;
}

export function Timer({ maxTime, onTimeUp, showSeconds = true }: TimerProps) {
  const { timeLeft, decrementTime, status } = useGameStore();
  
  const percentage = (timeLeft / maxTime) * 100;
  const isLow = timeLeft <= 10;
  const isCritical = timeLeft <= 5;

  useEffect(() => {
    if (status !== 'playing') return;
    
    const interval = setInterval(() => {
      decrementTime();
    }, 1000);

    return () => clearInterval(interval);
  }, [status, decrementTime]);

  useEffect(() => {
    if (timeLeft <= 0 && onTimeUp) {
      onTimeUp();
    }
  }, [timeLeft, onTimeUp]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <svg 
            className={`w-5 h-5 ${isCritical ? 'text-red-500 animate-pulse' : isLow ? 'text-amber-500' : 'text-slate-400'}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          {showSeconds && (
            <motion.span 
              className={`font-bold text-lg ${
                isCritical ? 'text-red-500' : isLow ? 'text-amber-500' : 'text-slate-300'
              }`}
              animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
            >
              {timeLeft}s
            </motion.span>
          )}
        </div>
      </div>
      
      <div className="progress-bar">
        <motion.div
          className={`progress-bar-fill ${
            isCritical ? 'from-red-500 to-red-600' : 
            isLow ? 'from-amber-500 to-amber-600' : ''
          }`}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
