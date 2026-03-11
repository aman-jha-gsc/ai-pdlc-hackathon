import React from "react";
import { SnakeSegment } from "./SnakeSegment";
import { Food } from "./Food";
import type { Coordinates } from "@/lib/types";

interface GameBoardProps {
  width: number;
  height: number;
  snake: Coordinates[];
  food: Coordinates;
}

const CELL_SIZE = 20; // in pixels

export const GameBoard: React.FC<GameBoardProps> = ({
  width,
  height,
  snake,
  food,
}) => {
  return (
    <div
      className="relative bg-board border-2 border-primary/50 shadow-lg"
      style={{
        width: width * CELL_SIZE,
        height: height * CELL_SIZE,
        boxShadow: '0 0 20px hsl(var(--primary) / 0.5)',
      }}
      data-testid="game-board"
    >
      {snake.map((segment, index) => (
        <SnakeSegment key={index} x={segment.x} y={segment.y} size={CELL_SIZE} />
      ))}
      <Food x={food.x} y={food.y} size={CELL_SIZE} />
    </div>
  );
};