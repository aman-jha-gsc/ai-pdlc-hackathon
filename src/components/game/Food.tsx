import React from "react";

interface FoodProps {
  x: number;
  y: number;
  size: number;
}

export const Food: React.FC<FoodProps> = ({ x, y, size }) => {
  return (
    <div
      className="absolute bg-food rounded-full"
      style={{
        left: `${x * size}px`,
        top: `${y * size}px`,
        width: `${size}px`,
        height: `${size}px`,
        boxShadow: '0 0 10px hsl(var(--food))',
      }}
    />
  );
};