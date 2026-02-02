// Common game types
export type GameStatus = 'idle' | 'playing' | 'paused' | 'finished';

export interface GameState {
  score: number;
  combo: number;
  maxCombo: number;
  timeLeft: number;
  hearts: number;
  status: GameStatus;
  level: number;
}

export interface GameResult {
  score: number;
  maxCombo: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number;
  level: number;
}

// Game-specific types
export interface AntonymQuestion {
  word: string;
  answer: string;
  options: string[];
}

export interface ChosungQuestion {
  hint: string;
  chosung: string;
  answer: string;
  options: string[];
}

export interface ErrorHunterQuestion {
  sentence: string;
  errorWord: string;
  correction: string;
  options: string[];
  explanation: string;
}

export interface GrammarTrainQuestion {
  stem: string;
  context: string;
  answer: string;
  options: string[];
  fullSentence: string;
}

export interface StoryDialogue {
  speaker: 'staff' | 'user' | 'other';
  text: string;
  blank?: boolean;
}

export interface StoryScene {
  id: number;
  title: string;
  background: string;
  dialogues: StoryDialogue[];
  answer: string;
  options: string[];
  newVocab: string;
}

export interface OddOneOutItem {
  text: string;
  icon: string;
  category: string;
}

export interface OddOneOutQuestion {
  items: OddOneOutItem[];
  oddOne: string;
  rule: string;
}

export interface WordMathQuestion {
  blocks: string[];
  equation: string;
  answer: string;
  options: string[];
  hint: string;
}

export interface JamoFishingWord {
  word: string;
  slots: string[];
  targetJamos: string[];
  decoyJamos: string[];
}

export interface SyllableSlotQuestion {
  target: string;
  meaning: string;
  chosung: string[];
  jungsung: string[];
  jongsung: string[];
  answer: { cho: string; jung: string; jong: string };
}

export interface WordRailWord {
  word: string;
  syllables: string[];
  shuffled: string[];
  decoys: string[];
}

export interface FindLetterStage {
  target: string;
  targetCount: number;
  grid: string[][];
  targetPositions: [number, number][];
}

export interface MatchCard {
  id: number;
  type: 'word' | 'meaning' | 'context';
  content: string;
  pairId: number;
}

export interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  row: number;
  col: number;
}

export interface CrosswordCell {
  letter?: string;
  black?: boolean;
  number?: number;
}

export interface CrosswordPuzzle {
  size: number;
  grid: CrosswordCell[][];
  clues: {
    across: CrosswordClue[];
    down: CrosswordClue[];
  };
}

// Game info for menu
export interface GameInfo {
  id: string;
  title: string;
  titleKo: string;
  description: string;
  difficulty: number;
  timeLimit: number;
  role: string;
  icon: string;
  gradient: string;
}
