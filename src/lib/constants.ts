import type { Coordinates } from "./types";

export const GAME_DIMENSIONS = {
  width: 20,
  height: 20,
};

export const INITIAL_SNAKE_POSITION: Coordinates[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

export const INITIAL_GAME_SPEED = 150; // ms