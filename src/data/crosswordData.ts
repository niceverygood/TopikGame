import type { CrosswordPuzzle } from '../types/game';

export const crosswordPuzzles: CrosswordPuzzle[] = [
  {
    size: 5,
    grid: [
      [{ letter: "학" }, { letter: "교" }, { black: true }, { letter: "선" }, { letter: "생" }],
      [{ letter: "생" }, { black: true }, { black: true }, { letter: "물" }, { black: true }],
      [{ black: true }, { letter: "가" }, { letter: "족" }, { black: true }, { black: true }],
      [{ letter: "친" }, { letter: "구" }, { black: true }, { letter: "책" }, { letter: "상" }],
      [{ black: true }, { black: true }, { black: true }, { black: true }, { black: true }],
    ],
    clues: {
      across: [
        { number: 1, clue: "학생들이 공부하는 곳", answer: "학교", row: 0, col: 0 },
        { number: 2, clue: "수업을 가르치는 사람", answer: "선생", row: 0, col: 3 },
        { number: 3, clue: "부모와 자녀로 이루어진 그룹", answer: "가족", row: 2, col: 1 },
        { number: 4, clue: "함께 노는 사람", answer: "친구", row: 3, col: 0 },
        { number: 5, clue: "책을 놓는 가구", answer: "책상", row: 3, col: 3 },
      ],
      down: [
        { number: 1, clue: "학교에서 배우는 사람", answer: "학생", row: 0, col: 0 },
        { number: 6, clue: "마실 수 있는 것", answer: "물", row: 0, col: 3 },
        { number: 7, clue: "나의 아버지와 어머니", answer: "가구", row: 2, col: 1 },
      ]
    }
  },
  {
    size: 5,
    grid: [
      [{ letter: "사" }, { letter: "과" }, { black: true }, { letter: "비" }, { letter: "행" }],
      [{ letter: "랑" }, { black: true }, { black: true }, { letter: "빔" }, { black: true }],
      [{ black: true }, { letter: "오" }, { letter: "렌" }, { letter: "지" }, { black: true }],
      [{ letter: "포" }, { letter: "도" }, { black: true }, { black: true }, { letter: "집" }],
      [{ black: true }, { black: true }, { black: true }, { black: true }, { black: true }],
    ],
    clues: {
      across: [
        { number: 1, clue: "빨간색 과일", answer: "사과", row: 0, col: 0 },
        { number: 2, clue: "하늘을 나는 탈것", answer: "비행", row: 0, col: 3 },
        { number: 3, clue: "주황색 과일", answer: "오렌지", row: 2, col: 1 },
        { number: 4, clue: "보라색 과일", answer: "포도", row: 3, col: 0 },
      ],
      down: [
        { number: 1, clue: "좋아하는 감정", answer: "사랑", row: 0, col: 0 },
        { number: 5, clue: "비가 올 때 필요한 것 (비+빔)", answer: "비빔", row: 0, col: 3 },
        { number: 6, clue: "사는 곳", answer: "집", row: 3, col: 4 },
      ]
    }
  },
];

// Helper to get empty grid for user input
export const createEmptyGrid = (puzzle: CrosswordPuzzle): (string | null)[][] => {
  return puzzle.grid.map(row => 
    row.map(cell => cell.black ? null : '')
  );
};

// Helper to check if a cell is correct
export const checkCell = (
  puzzle: CrosswordPuzzle, 
  userGrid: (string | null)[][], 
  row: number, 
  col: number
): boolean => {
  const cell = puzzle.grid[row][col];
  if (cell.black) return true;
  return userGrid[row][col] === cell.letter;
};

// Helper to check if puzzle is complete
export const isPuzzleComplete = (
  puzzle: CrosswordPuzzle,
  userGrid: (string | null)[][]
): boolean => {
  for (let row = 0; row < puzzle.size; row++) {
    for (let col = 0; col < puzzle.size; col++) {
      if (!puzzle.grid[row][col].black) {
        if (userGrid[row][col] !== puzzle.grid[row][col].letter) {
          return false;
        }
      }
    }
  }
  return true;
};
