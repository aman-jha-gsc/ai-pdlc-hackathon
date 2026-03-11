import Square from './Square';
import type { SquareValue } from '@/types';

type BoardProps = {
  xIsNext: boolean;
  squares: SquareValue[];
  onPlay: (nextSquares: SquareValue[]) => void;
  winningLine?: number[];
};

export default function Board({ xIsNext, squares, onPlay, winningLine }: BoardProps) {
  function handleClick(i: number) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';
    onPlay(nextSquares);
  }
  
  // Helper function from lib/utils to check for winner without returning the line
  function calculateWinner(squares: SquareValue[]) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-2 p-2 bg-foreground/10 rounded-lg">
      {squares.map((value, i) => (
        <Square
          key={i}
          value={value}
          onSquareClick={() => handleClick(i)}
          isWinning={winningLine?.includes(i)}
        />
      ))}
    </div>
  );
}