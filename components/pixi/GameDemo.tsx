"use client";
import { useState } from "react";
import PixiBoard from "./PixiBoard";

type GameState = {
  score: number;
  level: number;
  moves: number;
};

export default function GameDemo() {
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    level: 1,
    moves: 0,
  });

  const handleTileTap = (tile: { x: number; y: number; id: number }) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + 10,
      moves: prev.moves + 1,
    }));

    // Level up every 50 points
    if (gameState.score + 10 >= gameState.level * 50) {
      setGameState(prev => ({
        ...prev,
        level: prev.level + 1,
        score: prev.score + 10,
        moves: prev.moves + 1,
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Game Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary">{gameState.score}</div>
          <div className="text-sm text-muted">Score</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-accent">{gameState.level}</div>
          <div className="text-sm text-muted">Level</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warn">{gameState.moves}</div>
          <div className="text-sm text-muted">Moves</div>
        </div>
      </div>

      {/* Game Board */}
      <div className="card">
        <PixiBoard 
          rows={6} 
          cols={6} 
          tileSize={60} 
          onTileTap={handleTileTap} 
        />
      </div>

      {/* Instructions */}
      <div className="card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <h3 className="font-semibold mb-2">🎮 Hoe te spelen</h3>
        <p className="text-sm text-muted">
          Tik op de gekleurde tegels om punten te verdienen! Elke tegel geeft je 10 punten. 
          Verzamel 50 punten om een level omhoog te gaan.
        </p>
      </div>
    </div>
  );
} 