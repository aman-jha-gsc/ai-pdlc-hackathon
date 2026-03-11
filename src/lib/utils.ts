import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import type { Coordinates } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRandomCoordinates(
  width: number,
  height: number,
  exclude: Coordinates[] = []
): Coordinates {
  let newCoords: Coordinates;
  const isExcluded = (coords: Coordinates) =>
    exclude.some((c) => c.x === coords.x && c.y === coords.y);

  do {
    newCoords = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
  } while (isExcluded(newCoords));

  return newCoords;
}