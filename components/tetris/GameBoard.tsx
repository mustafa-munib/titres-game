import { Cell, Piece } from '@/lib/tetris.types';
import { string } from 'zod';

interface GameBoardProps {
  board: Cell[][];
  currentPiece: Piece | null;
}



const CELL_COLORS:any = {
	0: "bg-gray-900",
	1: "bg-red-500",
	2: "bg-blue-500",
	3: "bg-green-500",
	4: "bg-yellow-500",
	5: "bg-purple-500",
	6: "bg-orange-500",
	7: "bg-cyan-500",
};

export function GameBoard({ board, currentPiece }: GameBoardProps) {
  const getDisplayBoard = () => {
    const displayBoard = board.map(row => [...row]);

    if (currentPiece) {
      const { shape, position } = currentPiece;
      shape.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            const boardY = y + position.y;
            const boardX = x + position.x;
            if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length) {
              displayBoard[boardY][boardX] = value;
            }
          }
        });
      });
    }

    return displayBoard;
  };

  return (
    <div className="grid gap-px bg-gray-700 p-px rounded-lg">
      {getDisplayBoard().map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className={`w-6 h-6 ${CELL_COLORS[cell]} transition-colors duration-100`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}