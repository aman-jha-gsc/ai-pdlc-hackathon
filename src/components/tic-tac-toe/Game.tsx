'use client';

import { useState, useEffect } from 'react';
import Board from './Board';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { calculateWinner } from '@/lib/utils';
import type { SquareValue } from '@/types';

export default function Game() {
  const [history, setHistory] = useState<(SquareValue[])[]>([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  function handlePlay(nextSquares: SquareValue[]) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function restartGame() {
    setHistory([Array(9).fill(null)]);
    setCurrentMove(0);
  }

  const winnerInfo = calculateWinner(currentSquares);
  const winner = winnerInfo ? winnerInfo.winner : null;
  const isDraw = !winner && currentSquares.every(Boolean);

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = 'Game is a Draw';
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }
  
  if (!isClient) {
    // Render a placeholder or null on the server to avoid hydration mismatch
    return null;
  }

  return (
    <Card className="w-full max-w-md animate-fadeIn">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl" data-testid="status">{status}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} winningLine={winnerInfo?.line} />
        <Button onClick={restartGame} variant="secondary" className="w-full max-w-xs">
          Restart Game
        </Button>
      </CardContent>
    </Card>
  );
}