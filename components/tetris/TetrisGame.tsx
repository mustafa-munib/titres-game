"use client";

import { useCallback, useEffect, useState } from 'react';
import { GameBoard } from './GameBoard';
import { GameStats } from './GameStats';
import { GameControls } from './GameControls';
import { useGameLogic } from '@/hooks/useGameLogic';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

export default function TetrisGame() {
  const {
    board,
    score,
    level,
    lines,
    isGameOver,
    isPaused,
    currentPiece,
    nextPiece,
    togglePause,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    resetGame,
  } = useGameLogic();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (isGameOver) return;

      switch (event.key) {
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          rotate();
          break;
        case ' ':
          hardDrop();
          break;
        case 'p':
          togglePause();
          break;
        default:
          break;
      }
    },
    [isGameOver, moveLeft, moveRight, moveDown, rotate, hardDrop, togglePause]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-2xl flex flex-col md:flex-row gap-8">
      <div className="flex flex-col gap-4">
        <GameBoard board={board} currentPiece={currentPiece} />
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={togglePause}
            disabled={isGameOver}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </Button>
          <Button variant="outline" size="icon" onClick={resetGame}>
            <RotateCcw size={20} />
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col gap-6">
        <GameStats
          score={score}
          level={level}
          lines={lines}
          nextPiece={nextPiece}
        />
        <GameControls
          onMoveLeft={moveLeft}
          onMoveRight={moveRight}
          onMoveDown={moveDown}
          onRotate={rotate}
          onHardDrop={hardDrop}
          disabled={isGameOver || isPaused}
        /> 
      </div>
    </div>
  );
}