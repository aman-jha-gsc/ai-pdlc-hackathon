"use client";

import React, { useEffect, useCallback } from "react";
import GameBoard from "@/components/game/GameBoard";
import GameOverModal from "@/components/game/GameOverModal";
import Leaderboard from "@/components/game/Leaderboard";
import { useSnakeGame } from "@/hooks/useSnakeGame";
import { Button } from "@/components/ui/Button";

const BOARD_SIZE = 20;
const CELL_SIZE = 25; // in pixels

export default function HomePage() {
  const {
    snake,
    food,
    direction,
    isGameOver,
    score,
    isRunning,
    startGame,
    handleKeyDown,
    resetGame,
  } = useSnakeGame(BOARD_SIZE);

  const handleKeydownEvent = useCallback(
    (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        handleKeyDown(e.key);
      }
    },
    [handleKeyDown]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydownEvent);
    return () => {
      window.removeEventListener("keydown", handleKeydownEvent);
    };
  }, [handleKeydownEvent]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground p-4 sm:p-6 md:p-8">
      <div className="relative w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter font-mono">
            SNAKE
          </h1>
          <div className="flex items-center gap-4 text-lg font-mono">
            <span>SCORE:</span>
            <span className="text-2xl font-bold">{score}</span>
          </div>
          <div className="relative border-4 border-primary rounded-lg shadow-lg">
            <GameBoard
              boardSize={BOARD_SIZE}
              cellSize={CELL_SIZE}
              snake={snake}
              food={food}
            />
            {!isRunning && !isGameOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                <Button onClick={startGame} size="lg">
                  Start Game
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="w-full lg:w-80">
          <Leaderboard />
        </div>
      </div>

      <GameOverModal
        isOpen={isGameOver}
        score={score}
        onClose={resetGame}
      />
    </main>
  );
}