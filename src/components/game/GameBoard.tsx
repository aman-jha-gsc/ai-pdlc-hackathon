"use client";

import React, { useRef, useEffect } from "react";
import { Position } from "@/types";

interface GameBoardProps {
  boardSize: number;
  cellSize: number;
  snake: Position[];
  food: Position;
}

const GameBoard: React.FC<GameBoardProps> = ({
  boardSize,
  cellSize,
  snake,
  food,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardDimension = boardSize * cellSize;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = "hsl(var(--background))";
    ctx.fillRect(0, 0, boardDimension, boardDimension);

    // Draw snake
    ctx.fillStyle = "hsl(var(--primary))";
    snake.forEach((segment) => {
      ctx.fillRect(
        segment.x * cellSize,
        segment.y * cellSize,
        cellSize,
        cellSize
      );
    });

    // Draw snake head
    ctx.fillStyle = "hsl(var(--primary-foreground))";
    ctx.fillRect(
        snake[0].x * cellSize,
        snake[0].y * cellSize,
        cellSize,
        cellSize
    );


    // Draw food
    ctx.fillStyle = "hsl(var(--destructive))";
    ctx.beginPath();
    ctx.arc(
        food.x * cellSize + cellSize / 2,
        food.y * cellSize + cellSize / 2,
        cellSize / 2.5,
        0,
        2 * Math.PI
    );
    ctx.fill();

  }, [snake, food, boardDimension, cellSize]);

  return (
    <canvas
      ref={canvasRef}
      width={boardDimension}
      height={boardDimension}
      className="bg-card"
    />
  );
};

export default GameBoard;