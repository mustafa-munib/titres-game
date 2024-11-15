"use client";

import { useState, useCallback, useEffect } from 'react';
import { SHAPES, Cell, Piece } from '@/lib/tetris.types';

const BOARD_HEIGHT = 20;
const BOARD_WIDTH = 10;
const INITIAL_SPEED = 1000;
const SPEED_INCREASE = 0.85;

export function useGameLogic() {
  const [board, setBoard] = useState<Cell[][]>(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [nextPiece, setNextPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dropTime, setDropTime] = useState(INITIAL_SPEED);

  function createEmptyBoard(): Cell[][] {
    return Array(BOARD_HEIGHT).fill(Array(BOARD_WIDTH).fill(0));
  }

  const createNewPiece = useCallback((): Piece => {
    const shapeIndex = Math.floor(Math.random() * SHAPES.length);
    return {
      shape: SHAPES[shapeIndex],
      position: { x: Math.floor(BOARD_WIDTH / 2) - 2, y: 0 },
      color: shapeIndex + 1,
    };
  }, []);

  const isValidMove = useCallback(
    (piece: Piece, moveX: number = 0, moveY: number = 0): boolean => {
      return piece.shape.every((row, y) =>
        row.every((value, x) => {
          if (value === 0) return true;
          const newX = piece.position.x + x + moveX;
          const newY = piece.position.y + y + moveY;
          return (
            newX >= 0 &&
            newX < BOARD_WIDTH &&
            newY < BOARD_HEIGHT &&
            (newY < 0 || board[newY][newX] === 0)
          );
        })
      );
    },
    [board]
  );

  const mergePieceToBoard = useCallback(
    (piece: Piece): void => {
      const newBoard = board.map(row => [...row]);
      piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const boardY = y + piece.position.y;
            if (boardY >= 0) {
              newBoard[boardY][x + piece.position.x] = piece.color;
            }
          }
        });
      });
      setBoard(newBoard);
    },
    [board]
  );

  const clearLines = useCallback((): number => {
    let linesCleared = 0;
    const newBoard = board.filter(row => {
      if (row.every(cell => cell !== 0)) {
        linesCleared++;
        return false;
      }
      return true;
    });

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }

    if (linesCleared > 0) {
      setBoard(newBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + calculateScore(linesCleared, level));
      const newLevel = Math.floor((lines + linesCleared) / 10) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        setDropTime(prev => prev * SPEED_INCREASE);
      }
    }

    return linesCleared;
  }, [board, level, lines]);

  const moveLeft = useCallback(() => {
    if (isPaused || !currentPiece) return;
    if (isValidMove(currentPiece, -1, 0)) {
      setCurrentPiece({
        ...currentPiece,
        position: {
          ...currentPiece.position,
          x: currentPiece.position.x - 1,
        },
      });
    }
  }, [currentPiece, isPaused, isValidMove]);

  const moveRight = useCallback(() => {
    if (isPaused || !currentPiece) return;
    if (isValidMove(currentPiece, 1, 0)) {
      setCurrentPiece({
        ...currentPiece,
        position: {
          ...currentPiece.position,
          x: currentPiece.position.x + 1,
        },
      });
    }
  }, [currentPiece, isPaused, isValidMove]);

  const moveDown = useCallback(() => {
    if (isPaused || !currentPiece) return;
    if (isValidMove(currentPiece, 0, 1)) {
      setCurrentPiece({
        ...currentPiece,
        position: {
          ...currentPiece.position,
          y: currentPiece.position.y + 1,
        },
      });
    } else {
      mergePieceToBoard(currentPiece);
      clearLines();
      if (currentPiece.position.y <= 0) {
        setIsGameOver(true);
      } else {
        setCurrentPiece(nextPiece);
        setNextPiece(createNewPiece());
      }
    }
  }, [
    currentPiece,
    isPaused,
    isValidMove,
    mergePieceToBoard,
    clearLines,
    nextPiece,
    createNewPiece,
  ]);

  const rotate = useCallback(() => {
    if (isPaused || !currentPiece) return;
    const rotatedShape = currentPiece.shape[0].map((_, i) =>
      currentPiece.shape.map(row => row[i]).reverse()
    );
    const rotatedPiece = {
      ...currentPiece,
      shape: rotatedShape,
    };
    if (isValidMove(rotatedPiece)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [currentPiece, isPaused, isValidMove]);

  const hardDrop = useCallback(() => {
    if (isPaused || !currentPiece) return;
    let dropDistance = 0;
    while (isValidMove(currentPiece, 0, dropDistance + 1)) {
      dropDistance++;
    }
    setCurrentPiece({
      ...currentPiece,
      position: {
        ...currentPiece.position,
        y: currentPiece.position.y + dropDistance,
      },
    });
    moveDown();
  }, [currentPiece, isPaused, isValidMove, moveDown]);

  const calculateScore = (linesCleared: number, level: number): number => {
    const basePoints = [0, 40, 100, 300, 1200];
    return basePoints[linesCleared] * level;
  };

  const togglePause = useCallback(() => {
    if (!isGameOver) {
      setIsPaused(prev => !prev);
    }
  }, [isGameOver]);

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPiece(createNewPiece());
    setNextPiece(createNewPiece());
    setScore(0);
    setLevel(1);
    setLines(0);
    setIsGameOver(false);
    setIsPaused(false);
    setDropTime(INITIAL_SPEED);
  }, [createNewPiece]);

  useEffect(() => {
    if (!currentPiece && !isGameOver) {
      setCurrentPiece(createNewPiece());
      setNextPiece(createNewPiece());
    }
  }, [currentPiece, isGameOver, createNewPiece]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      const interval = setInterval(moveDown, dropTime);
      return () => clearInterval(interval);
    }
  }, [isPaused, isGameOver, moveDown, dropTime]);

  return {
    board,
    score,
    level,
    lines,
    isGameOver,
    isPaused,
    currentPiece,
    nextPiece,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    togglePause,
    resetGame,
  };
}