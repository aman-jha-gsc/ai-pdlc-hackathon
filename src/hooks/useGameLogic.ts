import { useState, useEffect, useCallback, useRef } from "react";
import {
  GAME_DIMENSIONS,
  INITIAL_SNAKE_POSITION,
  INITIAL_GAME_SPEED,
} from "@/lib/constants";
import type { Coordinates, Direction, GameState } from "@/lib/types";
import { generateRandomCoordinates } from "@/lib/utils";

const createInitialState = (): GameState => ({
  snake: INITIAL_SNAKE_POSITION,
  food: generateRandomCoordinates(
    GAME_DIMENSIONS.width,
    GAME_DIMENSIONS.height,
    INITIAL_SNAKE_POSITION
  ),
  direction: "RIGHT",
  speed: INITIAL_GAME_SPEED,
  isGameOver: false,
  score: 0,
});

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const [isPlaying, setIsPlaying] = useState(false);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const currentDirectionRef = useRef<Direction>(gameState.direction);

  const startGame = useCallback(() => {
    setGameState(createInitialState());
    setIsPlaying(false);
    currentDirectionRef.current = "RIGHT";
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      let newDirection: Direction | null = null;
      switch (e.key) {
        case "ArrowUp":
          if (currentDirectionRef.current !== "DOWN") newDirection = "UP";
          break;
        case "ArrowDown":
          if (currentDirectionRef.current !== "UP") newDirection = "DOWN";
          break;
        case "ArrowLeft":
          if (currentDirectionRef.current !== "RIGHT") newDirection = "LEFT";
          break;
        case "ArrowRight":
          if (currentDirectionRef.current !== "LEFT") newDirection = "RIGHT";
          break;
      }

      if (newDirection) {
        if (!isPlaying && !gameState.isGameOver) {
          setIsPlaying(true);
        }
        setGameState((prev) => ({ ...prev, direction: newDirection! }));
      }
    },
    [isPlaying, gameState.isGameOver]
  );

  const moveSnake = useCallback(() => {
    setGameState((prev) => {
      if (prev.isGameOver) {
        return prev;
      }

      currentDirectionRef.current = prev.direction;
      const newSnake = [...prev.snake];
      const head = { ...newSnake[0] };

      switch (prev.direction) {
        case "UP":
          head.y -= 1;
          break;
        case "DOWN":
          head.y += 1;
          break;
        case "LEFT":
          head.x -= 1;
          break;
        case "RIGHT":
          head.x += 1;
          break;
      }

      // Wall collision
      if (
        head.x < 0 ||
        head.x >= GAME_DIMENSIONS.width ||
        head.y < 0 ||
        head.y >= GAME_DIMENSIONS.height
      ) {
        setIsPlaying(false);
        return { ...prev, isGameOver: true };
      }

      // Self collision
      for (let i = 1; i < newSnake.length; i++) {
        if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
          setIsPlaying(false);
          return { ...prev, isGameOver: true };
        }
      }

      newSnake.unshift(head);

      // Food collision
      if (head.x === prev.food.x && head.y === prev.food.y) {
        const newScore = prev.score + 10;
        const newFood = generateRandomCoordinates(
          GAME_DIMENSIONS.width,
          GAME_DIMENSIONS.height,
          newSnake
        );
        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          score: newScore,
        };
      } else {
        newSnake.pop();
      }

      return { ...prev, snake: newSnake };
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    if (gameLoopRef.current) {
      clearInterval(gameLoopRef.current);
    }
    if (isPlaying && !gameState.isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, gameState.speed);
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [isPlaying, gameState.isGameOver, gameState.speed, moveSnake]);

  return { gameState, startGame, isPlaying };
};