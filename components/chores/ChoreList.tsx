"use client";
import { useState } from "react";

type Chore = {
  id: string;
  title: string;
  description?: string;
  frequency: string;
  baseXp: number;
  baseCoins: number;
  completed: boolean;
};

type Props = {
  chores: Chore[];
  onComplete: (choreId: string) => void;
};

export default function ChoreList({ chores, onComplete }: Props) {
  const todayChores = chores.filter(chore => 
    chore.frequency === "DAILY" || 
    (chore.frequency === "WEEKLY" && new Date().getDay() === 1) // Monday
  );

  if (todayChores.length === 0) {
    return (
      <div className="card text-center py-12">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold mb-2">Geen klussen vandaag!</h3>
        <p className="text-muted">Je hebt alle klussen voor vandaag afgerond.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todayChores.map((chore) => (
        <div 
          key={chore.id} 
          className={`card transition-all duration-200 ${
            chore.completed 
              ? 'bg-primary/10 border-primary/30 opacity-75' 
              : 'hover:bg-white/5'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-semibold">{chore.title}</h4>
              {chore.description && (
                <p className="text-sm text-muted mt-1">{chore.description}</p>
              )}
              <div className="flex gap-3 mt-2 text-sm">
                <span className="text-primary">⭐ {chore.baseXp} XP</span>
                <span className="text-warn">💰 {chore.baseCoins} munten</span>
                <span className="text-accent">📅 {chore.frequency}</span>
              </div>
            </div>
            
            {!chore.completed ? (
              <button
                onClick={() => onComplete(chore.id)}
                className="btn-primary px-4 py-2"
              >
                Klaar!
              </button>
            ) : (
              <div className="text-primary font-semibold">✅ Voltooid</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 