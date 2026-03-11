import React from "react";

interface SnakeSegmentProps {
  x: number;
  y: number;
  size: number;
}

export const SnakeSegment: React.FC<SnakeSegmentProps> = ({ x, y, size }) => {
  return (
    <div
      className="absolute bg-snake"
      style={{
        left: `${x * size}px`,
        top: `${y * size}px`,
        width: `${size}px`,
        height: `${size}px`,
      }}
    />
  );
};