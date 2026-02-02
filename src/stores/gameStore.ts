import { create } from 'zustand';
import type { GameState, GameStatus, GameResult } from '../types/game';

interface GameStore extends GameState {
  // Actions
  setScore: (score: number) => void;
  addScore: (points: number) => void;
  setCombo: (combo: number) => void;
  incrementCombo: () => void;
  resetCombo: () => void;
  setTimeLeft: (time: number) => void;
  decrementTime: () => void;
  addTime: (seconds: number) => void;
  subtractTime: (seconds: number) => void;
  setHearts: (hearts: number) => void;
  loseHeart: () => void;
  setStatus: (status: GameStatus) => void;
  setLevel: (level: number) => void;
  resetGame: (initialHearts?: number, initialTime?: number, initialLevel?: number) => void;
  getComboMultiplier: () => number;
  getResult: (correctAnswers: number, totalQuestions: number) => GameResult;
  
  // Track session stats
  correctAnswers: number;
  totalQuestions: number;
  incrementCorrect: () => void;
  incrementTotal: () => void;
}

const getComboMultiplier = (combo: number): number => {
  if (combo >= 20) return 2.0;
  if (combo >= 15) return 1.8;
  if (combo >= 10) return 1.5;
  if (combo >= 5) return 1.2;
  return 1.0;
};

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  score: 0,
  combo: 0,
  maxCombo: 0,
  timeLeft: 60,
  hearts: 3,
  status: 'idle',
  level: 1,
  correctAnswers: 0,
  totalQuestions: 0,

  // Actions
  setScore: (score) => set({ score }),
  
  addScore: (points) => {
    const { combo, score } = get();
    const multiplier = getComboMultiplier(combo);
    const actualPoints = Math.floor(points * multiplier);
    set({ score: score + actualPoints });
  },
  
  setCombo: (combo) => set({ combo }),
  
  incrementCombo: () => {
    const { combo, maxCombo } = get();
    const newCombo = combo + 1;
    set({ 
      combo: newCombo,
      maxCombo: Math.max(maxCombo, newCombo)
    });
  },
  
  resetCombo: () => set({ combo: 0 }),
  
  setTimeLeft: (time) => set({ timeLeft: time }),
  
  decrementTime: () => {
    const { timeLeft, status } = get();
    if (timeLeft > 0 && status === 'playing') {
      set({ timeLeft: timeLeft - 1 });
    }
    if (timeLeft <= 1) {
      set({ status: 'finished' });
    }
  },
  
  addTime: (seconds) => {
    const { timeLeft } = get();
    set({ timeLeft: timeLeft + seconds });
  },
  
  subtractTime: (seconds) => {
    const { timeLeft } = get();
    set({ timeLeft: Math.max(0, timeLeft - seconds) });
  },
  
  setHearts: (hearts) => set({ hearts }),
  
  loseHeart: () => {
    const { hearts } = get();
    const newHearts = hearts - 1;
    set({ hearts: newHearts });
    if (newHearts <= 0) {
      set({ status: 'finished' });
    }
  },
  
  setStatus: (status) => set({ status }),
  
  setLevel: (level) => set({ level }),
  
  resetGame: (initialHearts = 3, initialTime = 60, initialLevel = 1) => set({
    score: 0,
    combo: 0,
    maxCombo: 0,
    timeLeft: initialTime,
    hearts: initialHearts,
    status: 'idle',
    level: initialLevel,
    correctAnswers: 0,
    totalQuestions: 0,
  }),
  
  getComboMultiplier: () => getComboMultiplier(get().combo),
  
  incrementCorrect: () => set((state) => ({ correctAnswers: state.correctAnswers + 1 })),
  
  incrementTotal: () => set((state) => ({ totalQuestions: state.totalQuestions + 1 })),
  
  getResult: (correctAnswers, totalQuestions) => {
    const { score, maxCombo, level, timeLeft } = get();
    return {
      score,
      maxCombo,
      correctAnswers,
      totalQuestions,
      timeSpent: 60 - timeLeft, // Assuming 60s default
      level,
    };
  },
}));
