import type { SquareValue } from '@/types';
import { cn } from '@/lib/utils';

type SquareProps = {
  value: SquareValue;
  onSquareClick: () => void;
  isWinning?: boolean;
};

export default function Square({ value, onSquareClick, isWinning }: SquareProps) {
  return (
    <button
      className={cn(
        "flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-background rounded-md transition-colors duration-200 ease-in-out",
        "text-4xl md:text-5xl font-bold",
        "hover:bg-foreground/10 disabled:cursor-not-allowed",
        {
          "text-blue-400": value === 'X',
          "text-red-400": value === 'O',
          "bg-green-500/30 text-white animate-pulse": isWinning,
        }
      )}
      onClick={onSquareClick}
      disabled={!!value}
      aria-label={`Square ${value || 'empty'}`}
    >
      {value}
    </button>
  );
}