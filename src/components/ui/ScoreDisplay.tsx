import React from "react";

interface ScoreDisplayProps {
  score: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score }) => {
  return (
    <div className="text-2xl text-foreground">
      Score: <span className="font-bold text-primary">{score}</span>
    </div>
  );
};