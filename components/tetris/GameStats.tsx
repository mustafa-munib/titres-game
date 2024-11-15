import { Card } from '@/components/ui/card';
import { Piece } from '@/lib/tetris.types';

interface GameStatsProps {
  score: number;
  level: number;
  lines: number;
  nextPiece: Piece | null;
}

export function GameStats({ score, level, lines, nextPiece }: GameStatsProps) {
  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gray-900">
        <h2 className="text-xl font-bold mb-4 text-white">Next Piece</h2>
        <div className="grid grid-cols-4 gap-px bg-gray-800 p-2">
          {nextPiece?.shape.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className={`w-4 h-4 ${
                  cell ? 'bg-blue-500' : 'bg-transparent'
                }`}
              />
            ))
          )}
        </div>
      </Card>

      <Card className="p-4 bg-gray-900">
        <div className="space-y-2">
          <div className="flex justify-between text-white">
            <span>Score:</span>
            <span className="font-mono">{score}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>Level:</span>
            <span className="font-mono">{level}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>Lines:</span>
            <span className="font-mono">{lines}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}