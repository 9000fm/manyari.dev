'use client';

import React, { useState, useEffect, useCallback } from 'react';

type Cell = {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
};

type GameState = 'playing' | 'won' | 'lost';
type Difficulty = 'beginner' | 'intermediate' | 'expert';

const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10, baseCellSize: 22 },
  intermediate: { rows: 16, cols: 16, mines: 40, baseCellSize: 18 },
  expert: { rows: 16, cols: 30, mines: 99, baseCellSize: 14 },
};

// Calculate responsive cell size based on container width
function useResponsiveCellSize(cols: number, baseCellSize: number): number {
  const [cellSize, setCellSize] = useState(baseCellSize);

  useEffect(() => {
    const calculateSize = () => {
      // Account for container padding, border, and some margin
      const maxWidth = Math.min(window.innerWidth - 60, 460);
      const calculatedSize = Math.floor(maxWidth / cols);
      setCellSize(Math.min(baseCellSize, Math.max(12, calculatedSize)));
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [cols, baseCellSize]);

  return cellSize;
}

const NUMBER_COLORS: Record<number, string> = {
  1: '#0000FF',
  2: '#008000',
  3: '#FF0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
};

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [mineCount, setMineCount] = useState(10);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [firstClick, setFirstClick] = useState(true);

  const { rows, cols, mines, baseCellSize } = DIFFICULTIES[difficulty];
  const cellSize = useResponsiveCellSize(cols, baseCellSize);

  const initializeBoard = useCallback(() => {
    const newBoard: Cell[][] = Array(rows)
      .fill(null)
      .map(() =>
        Array(cols)
          .fill(null)
          .map(() => ({
            isMine: false,
            isRevealed: false,
            isFlagged: false,
            adjacentMines: 0,
          }))
      );

    setBoard(newBoard);
    setGameState('playing');
    setMineCount(mines);
    setTimer(0);
    setIsTimerRunning(false);
    setFirstClick(true);
  }, [rows, cols, mines]);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && gameState === 'playing') {
      interval = setInterval(() => {
        setTimer((t) => Math.min(t + 1, 999));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, gameState]);

  const placeMines = (board: Cell[][], excludeRow: number, excludeCol: number) => {
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    let placed = 0;

    while (placed < mines) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);

      // Don't place mine on first click or adjacent to it
      const isExcluded =
        Math.abs(r - excludeRow) <= 1 && Math.abs(c - excludeCol) <= 1;

      if (!newBoard[r][c].isMine && !isExcluded) {
        newBoard[r][c].isMine = true;
        placed++;
      }
    }

    // Calculate adjacent mines
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (!newBoard[r][c].isMine) {
          let count = 0;
          for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && newBoard[nr][nc].isMine) {
                count++;
              }
            }
          }
          newBoard[r][c].adjacentMines = count;
        }
      }
    }

    return newBoard;
  };

  const revealCell = (board: Cell[][], row: number, col: number): Cell[][] => {
    if (
      row < 0 ||
      row >= rows ||
      col < 0 ||
      col >= cols ||
      board[row][col].isRevealed ||
      board[row][col].isFlagged
    ) {
      return board;
    }

    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    newBoard[row][col].isRevealed = true;

    // If it's an empty cell, reveal adjacent cells
    if (newBoard[row][col].adjacentMines === 0 && !newBoard[row][col].isMine) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            const result = revealCell(newBoard, row + dr, col + dc);
            for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                newBoard[r][c] = result[r][c];
              }
            }
          }
        }
      }
    }

    return newBoard;
  };

  const handleCellClick = (row: number, col: number) => {
    if (gameState !== 'playing' || board[row][col].isFlagged) return;

    let newBoard = board;

    if (firstClick) {
      newBoard = placeMines(board, row, col);
      setFirstClick(false);
      setIsTimerRunning(true);
    }

    if (newBoard[row][col].isMine) {
      // Game over - reveal all mines
      newBoard = newBoard.map((r) =>
        r.map((c) => ({
          ...c,
          isRevealed: c.isMine ? true : c.isRevealed,
        }))
      );
      setBoard(newBoard);
      setGameState('lost');
      setIsTimerRunning(false);
      return;
    }

    newBoard = revealCell(newBoard, row, col);
    setBoard(newBoard);

    // Check for win
    const unrevealedSafeCells = newBoard.flat().filter(
      (c) => !c.isRevealed && !c.isMine
    ).length;
    if (unrevealedSafeCells === 0) {
      setGameState('won');
      setIsTimerRunning(false);
    }
  };

  const handleRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault();
    if (gameState !== 'playing' || board[row][col].isRevealed) return;

    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
    setBoard(newBoard);
    setMineCount((prev) =>
      newBoard[row][col].isFlagged ? prev - 1 : prev + 1
    );
  };

  const getSmiley = () => {
    switch (gameState) {
      case 'won':
        return '😎';
      case 'lost':
        return '💀';
      default:
        return '🙂';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '8px',
        backgroundColor: '#C0C0C0',
        height: '100%',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          maxWidth: cols * cellSize + 8,
          padding: '4px',
          backgroundColor: '#C0C0C0',
          border: '2px inset #808080',
          marginBottom: '4px',
        }}
      >
        {/* Mine counter */}
        <div
          style={{
            backgroundColor: '#000000',
            color: '#FF0000',
            fontFamily: 'Consolas, monospace',
            fontSize: '20px',
            padding: '2px 4px',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          {String(mineCount).padStart(3, '0')}
        </div>

        {/* Smiley button */}
        <button
          onClick={initializeBoard}
          style={{
            width: '30px',
            height: '30px',
            backgroundColor: '#C0C0C0',
            border: '2px outset #FFFFFF',
            cursor: 'pointer',
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {getSmiley()}
        </button>

        {/* Timer */}
        <div
          style={{
            backgroundColor: '#000000',
            color: '#FF0000',
            fontFamily: 'Consolas, monospace',
            fontSize: '20px',
            padding: '2px 4px',
            minWidth: '50px',
            textAlign: 'center',
          }}
        >
          {String(timer).padStart(3, '0')}
        </div>
      </div>

      {/* Board */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gap: '0px',
          border: '3px inset #808080',
          backgroundColor: '#C0C0C0',
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onContextMenu={(e) => handleRightClick(e, rowIndex, colIndex)}
              style={{
                width: cellSize,
                height: cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: cell.isRevealed ? '#C0C0C0' : '#C0C0C0',
                border: cell.isRevealed
                  ? '1px solid #808080'
                  : '2px outset #FFFFFF',
                fontFamily: '"MS Sans Serif", Arial, sans-serif',
                fontSize: cellSize > 18 ? '14px' : '11px',
                fontWeight: 'bold',
                cursor: gameState === 'playing' ? 'pointer' : 'default',
                userSelect: 'none',
                color: cell.adjacentMines > 0 ? NUMBER_COLORS[cell.adjacentMines] : '#000000',
              }}
            >
              {cell.isRevealed
                ? cell.isMine
                  ? '💣'
                  : cell.adjacentMines > 0
                  ? cell.adjacentMines
                  : ''
                : cell.isFlagged
                ? '🚩'
                : ''}
            </div>
          ))
        )}
      </div>

      {/* Difficulty selector */}
      <div
        style={{
          marginTop: '8px',
          display: 'flex',
          gap: '4px',
        }}
      >
        {(['beginner', 'intermediate', 'expert'] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            style={{
              padding: '4px 8px',
              backgroundColor: difficulty === d ? '#000080' : '#C0C0C0',
              color: difficulty === d ? '#FFFFFF' : '#000000',
              border: '1px solid #000000',
              fontFamily: '"MS Sans Serif", Arial, sans-serif',
              fontSize: '11px',
              cursor: 'pointer',
              textTransform: 'capitalize',
            }}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
