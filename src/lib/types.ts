export interface Coordinates {
  x: number;
  y: number;
}

export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

export interface GameState {
  snake: Coordinates[];
  food: Coordinates;
  direction: Direction;
  speed: number;
  isGameOver: boolean;
  score: number;
}