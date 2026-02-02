import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore';
import { GameHeader, ResultModal, Button } from '../common';
import { crosswordPuzzles, createEmptyGrid, isPuzzleComplete } from '../../data';
import { GAMES } from '../../data/gameData';
import { haptic } from '../../utils/haptics';
import { sound } from '../../utils/sound';
import type { CrosswordPuzzle, GameResult } from '../../types/game';

interface CrosswordProps {
  onBack: () => void;
}

export function Crossword({ onBack }: CrosswordProps) {
  const gameInfo = GAMES.find(g => g.id === 'crossword')!;
  const {
    score, combo, status, timeLeft,
    setStatus, addScore, incrementCombo, resetCombo,
    subtractTime, resetGame, incrementCorrect, incrementTotal,
    correctAnswers, totalQuestions, maxCombo
  } = useGameStore();

  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [userGrid, setUserGrid] = useState<(string | null)[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [direction, setDirection] = useState<'across' | 'down'>('across');
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());
  const [result, setResult] = useState<GameResult | null>(null);

  const puzzle: CrosswordPuzzle = crosswordPuzzles[puzzleIndex];

  useEffect(() => {
    setUserGrid(createEmptyGrid(puzzle));
    setCompletedWords(new Set());
    resetGame(3, 120, 1);
  }, [puzzleIndex]);

  // 현재 선택된 단어의 모든 셀 위치 계산
  const getSelectedWordCells = useCallback(() => {
    if (!selectedCell) return [];
    const { row, col } = selectedCell;
    const cells: { row: number; col: number }[] = [];

    if (direction === 'across') {
      // 단어 시작 찾기
      let startCol = col;
      while (startCol > 0 && !puzzle.grid[row][startCol - 1].black) {
        startCol--;
      }
      // 단어 끝까지 추가
      for (let c = startCol; c < puzzle.size && !puzzle.grid[row][c].black; c++) {
        cells.push({ row, col: c });
      }
    } else {
      // 단어 시작 찾기
      let startRow = row;
      while (startRow > 0 && !puzzle.grid[startRow - 1][col].black) {
        startRow--;
      }
      // 단어 끝까지 추가
      for (let r = startRow; r < puzzle.size && !puzzle.grid[r][col].black; r++) {
        cells.push({ row: r, col });
      }
    }
    return cells;
  }, [selectedCell, direction, puzzle]);

  // 현재 선택된 힌트 찾기
  const getCurrentClue = useCallback(() => {
    if (!selectedCell) return null;
    const { row, col } = selectedCell;
    const clues = direction === 'across' ? puzzle.clues.across : puzzle.clues.down;

    for (const clue of clues) {
      if (direction === 'across') {
        if (row === clue.row && col >= clue.col && col < clue.col + clue.answer.length) {
          return clue;
        }
      } else {
        if (col === clue.col && row >= clue.row && row < clue.row + clue.answer.length) {
          return clue;
        }
      }
    }
    return null;
  }, [selectedCell, direction, puzzle]);

  const selectedWordCells = getSelectedWordCells();
  const currentClue = getCurrentClue();

  const startGame = () => {
    setStatus('playing');
  };

  const handleCellClick = (row: number, col: number) => {
    if (status !== 'playing') return;
    if (puzzle.grid[row][col].black) return;

    haptic.light();

    if (selectedCell?.row === row && selectedCell?.col === col) {
      // Toggle direction
      setDirection(prev => prev === 'across' ? 'down' : 'across');
    } else {
      setSelectedCell({ row, col });
    }
  };

  const handleKeyInput = useCallback((char: string) => {
    if (status !== 'playing' || !selectedCell) return;

    const { row, col } = selectedCell;
    if (puzzle.grid[row][col].black) return;

    // Update grid
    const newGrid = userGrid.map(r => [...r]);
    newGrid[row][col] = char.toUpperCase();
    setUserGrid(newGrid);
    
    haptic.light();
    addScore(10);

    // Check if any word is completed
    checkWordCompletion(newGrid, row, col);

    // Move to next cell
    moveToNextCell(row, col);
  }, [status, selectedCell, puzzle, userGrid, direction]);

  const checkWordCompletion = (grid: (string | null)[][], row: number, col: number) => {
    // Check across words
    for (const clue of puzzle.clues.across) {
      const wordKey = `across-${clue.number}`;
      if (completedWords.has(wordKey)) continue;

      let word = '';
      for (let c = clue.col; c < puzzle.size && !puzzle.grid[clue.row][c].black; c++) {
        const cell = grid[clue.row][c];
        if (!cell) break;
        word += cell;
      }

      if (word === clue.answer.toUpperCase()) {
        haptic.success();
        sound.correct();
        incrementCorrect();
        incrementCombo();
        addScore(50);
        setCompletedWords(prev => new Set([...prev, wordKey]));
      }
    }

    // Check down words
    for (const clue of puzzle.clues.down) {
      const wordKey = `down-${clue.number}`;
      if (completedWords.has(wordKey)) continue;

      let word = '';
      for (let r = clue.row; r < puzzle.size && !puzzle.grid[r][clue.col].black; r++) {
        const cell = grid[r][clue.col];
        if (!cell) break;
        word += cell;
      }

      if (word === clue.answer.toUpperCase()) {
        haptic.success();
        sound.correct();
        incrementCorrect();
        incrementCombo();
        addScore(50);
        setCompletedWords(prev => new Set([...prev, wordKey]));
      }
    }

    // Check if puzzle complete
    if (isPuzzleComplete(puzzle, grid)) {
      addScore(200);
      sound.fever();
      setTimeout(() => setStatus('finished'), 1000);
    }
  };

  const moveToNextCell = (row: number, col: number) => {
    if (direction === 'across') {
      // Move right
      for (let c = col + 1; c < puzzle.size; c++) {
        if (!puzzle.grid[row][c].black) {
          setSelectedCell({ row, col: c });
          return;
        }
      }
    } else {
      // Move down
      for (let r = row + 1; r < puzzle.size; r++) {
        if (!puzzle.grid[r][col].black) {
          setSelectedCell({ row: r, col });
          return;
        }
      }
    }
  };

  const handleBackspace = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    
    const newGrid = userGrid.map(r => [...r]);
    newGrid[row][col] = '';
    setUserGrid(newGrid);
    
    haptic.light();
  };

  // Keyboard layout
  const koreanKeys = [
    ['ㅂ', 'ㅈ', 'ㄷ', 'ㄱ', 'ㅅ', 'ㅛ', 'ㅕ', 'ㅑ', 'ㅐ', 'ㅔ'],
    ['ㅁ', 'ㄴ', 'ㅇ', 'ㄹ', 'ㅎ', 'ㅗ', 'ㅓ', 'ㅏ', 'ㅣ'],
    ['ㅋ', 'ㅌ', 'ㅊ', 'ㅍ', 'ㅠ', 'ㅜ', 'ㅡ'],
  ];

  const handleTimeUp = useCallback(() => {
    setStatus('finished');
    setResult({
      score,
      maxCombo,
      correctAnswers,
      totalQuestions: puzzle.clues.across.length + puzzle.clues.down.length,
      timeSpent: 120 - timeLeft,
      level: 1,
    });
  }, [score, maxCombo, correctAnswers, puzzle, timeLeft]);

  useEffect(() => {
    if (status === 'finished' && !result) {
      setResult({
        score,
        maxCombo,
        correctAnswers,
        totalQuestions: puzzle.clues.across.length + puzzle.clues.down.length,
        timeSpent: 120 - timeLeft,
        level: 1,
      });
    }
  }, [status, result, score, maxCombo, correctAnswers, puzzle, timeLeft]);

  const handleRestart = () => {
    setUserGrid(createEmptyGrid(puzzle));
    setSelectedCell(null);
    setDirection('across');
    setCompletedWords(new Set());
    setResult(null);
    resetGame(3, 120, 1);
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
              <li>• 힌트를 보고 빈칸을 채우세요</li>
              <li>• 셀을 탭하면 방향 전환</li>
              <li>• 단어 완성: +50점</li>
              <li>• 퍼즐 완성: +200점 보너스</li>
            </ul>
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

  return (
    <div className="min-h-screen flex flex-col">
      <GameHeader maxTime={120} onTimeUp={handleTimeUp} onBack={onBack} />

      <main className="flex-1 flex flex-col items-center p-4 max-w-2xl mx-auto w-full overflow-auto">
        {/* Current Clue Display - 현재 선택된 힌트 크게 표시 */}
        <div className="w-full max-w-md mb-4">
          {currentClue ? (
            <motion.div
              key={`${direction}-${currentClue.number}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500 rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className="bg-amber-500 text-white font-bold text-xl w-10 h-10 rounded-lg flex items-center justify-center">
                  {currentClue.number}
                </div>
                <div className="flex-1">
                  <div className="text-amber-400 text-sm font-semibold mb-1">
                    {direction === 'across' ? '→ 가로' : '↓ 세로'}
                  </div>
                  <div className="text-white text-lg">{currentClue.clue}</div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="bg-slate-800/50 rounded-xl p-4 text-center text-slate-400">
              👆 칸을 선택하세요 (탭하면 가로↔세로 전환)
            </div>
          )}
        </div>

        {/* Grid */}
        <div className="bg-slate-800/30 rounded-xl p-3 mb-4">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${puzzle.size}, 1fr)` }}>
            {puzzle.grid.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                const isInSelectedWord = selectedWordCells.some(c => c.row === rowIndex && c.col === colIndex);
                const userValue = userGrid[rowIndex]?.[colIndex];
                const isBlack = cell.black;

                // Check if this cell is part of a completed word
                const isInCompletedWord = [...completedWords].some(key => {
                  const [dir, num] = key.split('-');
                  const clues = dir === 'across' ? puzzle.clues.across : puzzle.clues.down;
                  const clue = clues.find(c => c.number === parseInt(num));
                  if (!clue) return false;
                  
                  if (dir === 'across') {
                    return rowIndex === clue.row && colIndex >= clue.col && colIndex < clue.col + clue.answer.length;
                  } else {
                    return colIndex === clue.col && rowIndex >= clue.row && rowIndex < clue.row + clue.answer.length;
                  }
                });

                return (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    disabled={isBlack}
                    className={`
                      w-11 h-11 sm:w-12 sm:h-12 text-xl font-bold relative rounded-md transition-all
                      ${isBlack 
                        ? 'bg-slate-900' 
                        : isSelected
                        ? 'bg-amber-400 border-2 border-amber-300 shadow-lg shadow-amber-500/30'
                        : isInSelectedWord
                        ? 'bg-amber-500/30 border-2 border-amber-400/50'
                        : isInCompletedWord
                        ? 'bg-emerald-500/40 border-2 border-emerald-400'
                        : 'bg-white border-2 border-slate-300'
                      }
                    `}
                  >
                    {/* Cell number - 더 눈에 띄게 */}
                    {cell.number && (
                      <span className={`absolute top-0.5 left-1 text-xs font-bold ${
                        isSelected || isInSelectedWord ? 'text-amber-800' : 'text-blue-600'
                      }`}>
                        {cell.number}
                      </span>
                    )}
                    {/* User input */}
                    {!isBlack && (
                      <span className={`${
                        isSelected ? 'text-amber-900' :
                        isInCompletedWord ? 'text-emerald-700' : 'text-slate-800'
                      }`}>
                        {userValue || ''}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Clues - 힌트 목록 개선 */}
        <div className="w-full max-w-md grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-800/30 rounded-lg p-3">
            <h4 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <span className="bg-amber-500/20 px-2 py-1 rounded">→</span> 가로
            </h4>
            <ul className="space-y-2">
              {puzzle.clues.across.map(clue => {
                const isCurrentClue = currentClue?.number === clue.number && direction === 'across';
                const isCompleted = completedWords.has(`across-${clue.number}`);
                return (
                  <li 
                    key={`across-${clue.number}`}
                    onClick={() => {
                      setSelectedCell({ row: clue.row, col: clue.col });
                      setDirection('across');
                    }}
                    className={`text-sm p-2 rounded cursor-pointer transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 line-through'
                        : isCurrentClue
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-500'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <span className={`font-bold mr-1 ${isCurrentClue ? 'text-amber-400' : ''}`}>
                      {clue.number}.
                    </span>
                    {clue.clue}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-3">
            <h4 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
              <span className="bg-amber-500/20 px-2 py-1 rounded">↓</span> 세로
            </h4>
            <ul className="space-y-2">
              {puzzle.clues.down.map(clue => {
                const isCurrentClue = currentClue?.number === clue.number && direction === 'down';
                const isCompleted = completedWords.has(`down-${clue.number}`);
                return (
                  <li 
                    key={`down-${clue.number}`}
                    onClick={() => {
                      setSelectedCell({ row: clue.row, col: clue.col });
                      setDirection('down');
                    }}
                    className={`text-sm p-2 rounded cursor-pointer transition-all ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 line-through'
                        : isCurrentClue
                        ? 'bg-amber-500/30 text-amber-300 border border-amber-500'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <span className={`font-bold mr-1 ${isCurrentClue ? 'text-amber-400' : ''}`}>
                      {clue.number}.
                    </span>
                    {clue.clue}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Virtual Keyboard */}
        <div className="w-full max-w-md space-y-1">
          {koreanKeys.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {row.map((key) => (
                <button
                  key={key}
                  onClick={() => handleKeyInput(key)}
                  className="w-8 h-10 sm:w-10 sm:h-12 bg-slate-700 rounded text-white font-medium
                    hover:bg-slate-600 active:bg-slate-500 transition-colors"
                >
                  {key}
                </button>
              ))}
            </div>
          ))}
          <div className="flex justify-center gap-2 mt-2">
            <button
              onClick={handleBackspace}
              className="px-6 py-2 bg-slate-600 rounded text-white hover:bg-slate-500"
            >
              ⌫ 지우기
            </button>
          </div>
        </div>
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
