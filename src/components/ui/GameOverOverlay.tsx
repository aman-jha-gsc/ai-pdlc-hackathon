import React from "react";
import { Button } from "./Button";

interface GameOverOverlayProps {
  isGameOver: boolean;
  score: number;
  onRestart: () => void;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  isGameOver,
  score,
  onRestart,
}) => {
  if (!isGameOver) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center animate-game-over-in"
      data-testid="game-over-overlay"
    >
      <h2 className="text-5xl font-bold text-red-500">GAME OVER</h2>
      <p className="mt-4 text-2xl text-white">Final Score: {score}</p>
      <Button onClick={onRestart} className="mt-6">
        Restart
      </Button>
    </div>
  );
};