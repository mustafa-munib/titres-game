import { Button } from '@/components/ui/button';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronDown } from 'lucide-react';

interface GameControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  disabled: boolean;
}

export function GameControls({
  onMoveLeft,
  onMoveRight,
  onMoveDown,
  onRotate,
  onHardDrop,
  disabled,
}: GameControlsProps) {
  return (
    <div className="grid grid-cols-3 gap-2 max-w-[200px]">
      <div />
      <Button
        variant="outline"
        size="icon"
        onClick={onRotate}
        disabled={disabled}
        className="aspect-square"
      >
        <ArrowUp size={20} />
      </Button>
      <div />
      <Button
        variant="outline"
        size="icon"
        onClick={onMoveLeft}
        disabled={disabled}
        className="aspect-square"
      >
        <ArrowLeft size={20} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onMoveDown}
        disabled={disabled}
        className="aspect-square"
      >
        <ArrowDown size={20} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onMoveRight}
        disabled={disabled}
        className="aspect-square"
      >
        <ArrowRight size={20} />
      </Button>
      <div />
      <Button
        variant="outline"
        size="icon"
        onClick={onHardDrop}
        disabled={disabled}
        className="aspect-square"
      >
        <ChevronDown size={20} />
      </Button>
      <div />
    </div>
  );
}