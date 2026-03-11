"use client";

import React from "react";
import { GameBoard } from "@/components/game/GameBoard";
import { useGameLogic } from "@/hooks/useGameLogic";
import { ScoreDisplay } from "@/components/ui/ScoreDisplay";
import { GameOverOverlay } from "@/components/ui/GameOverOverlay";
import { GAME_DIMENSIONS } from "@/lib/constants";

export default function HomePage() {
  const { gameState, startGame, isPlaying } = useGameLogic();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 font-mono">
      <div className="relative flex flex-col items-center">
        <h1 className="mb-4 text-5xl font-bold text-primary tracking-widest">
          SNAKE
        </h1>
        <ScoreDisplay score={gameState.score} />
        <div className="mt-4 relative">
          <GameBoard
            width={GAME_DIMENSIONS.width}
            height={GAME_DIMENSIONS.height}
            snake={gameState.snake}
            food={gameState.food}
          />
          <GameOverOverlay
            isGameOver={gameState.isGameOver}
            score={gameState.score}
            onRestart={startGame}
          />
        </div>
        <div className="mt-6 text-center text-foreground/80">
          <p>Use Arrow Keys to Move</p>
          {!isPlaying && !gameState.isGameOver && (
             <p className="mt-2 text-lg animate-pulse">Press any arrow key to start</p>
          )}
        </div>
      </div>
    </main>
  );
}