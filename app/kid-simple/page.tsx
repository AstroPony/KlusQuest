"use client";
import { useState, useEffect } from "react";
import ChoreList from "@/components/chores/ChoreList";

type Chore = {
  id: string;
  title: string;
  description?: string;
  frequency: string;
  baseXp: number;
  baseCoins: number;
  completed: boolean;
  completions: Array<{
    id: string;
    createdAt: Date;
    kidId: string;
  }>;
};

type KidStats = {
  level: number;
  xp: number;
  coins: number;
};

export default function KidSimplePage() {
  const [chores, setChores] = useState<Chore[]>([
    {
      id: "1",
      title: "Tafel afruimen",
      description: "Na het eten de tafel afruimen",
      frequency: "DAILY",
      baseXp: 15,
      baseCoins: 2,
      completed: false,
      completions: [],
    },
    {
      id: "2", 
      title: "Kamer opruimen",
      description: "Speelgoed opruimen en kamer netjes maken",
      frequency: "DAILY",
      baseXp: 20,
      baseCoins: 3,
      completed: false,
      completions: [],
    },
    {
      id: "3",
      title: "Wassen ophangen",
      description: "Help met de was ophangen",
      frequency: "WEEKLY",
      baseXp: 25,
      baseCoins: 4,
      completed: false,
      completions: [],
    },
  ]);

  const [stats, setStats] = useState<KidStats>({
    level: 1,
    xp: 0,
    coins: 10,
  });

  const handleCompleteChore = (choreId: string, kidId: string) => {
    const chore = chores.find(c => c.id === choreId);
    if (!chore || chore.completed) return;

    // Mark as completed
    setChores(prev => prev.map(c => 
      c.id === choreId ? { ...c, completed: true } : c
    ));

    // Update stats
    setStats(prev => {
      const newXp = prev.xp + chore.baseXp;
      const newCoins = prev.coins + chore.baseCoins;
      const newLevel = Math.floor(newXp / 100) + 1;
      
      return {
        level: newLevel,
        xp: newXp,
        coins: newCoins,
      };
    });

    // Show celebration
    showCelebration(chore.title);
  };

  const showCelebration = (choreTitle: string) => {
    // Simple celebration - could be enhanced later
    alert(`🎉 Gefeliciteerd! Je hebt "${choreTitle}" voltooid!`);
  };

  return (
    <main className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <header className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <a href="/dashboard" className="btn-ghost">
            ← Terug naar Dashboard
          </a>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Mijn Klussen
        </h1>
        <p className="text-muted">Vandaag&apos;s taken en je voortgang</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-primary">{stats.level}</div>
          <div className="text-sm text-muted">Level</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-accent">{stats.xp}</div>
          <div className="text-sm text-muted">XP</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-warn">{stats.coins}</div>
          <div className="text-sm text-muted">Munten</div>
        </div>
      </div>

      {/* Chores */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Vandaag&apos;s Klussen</h2>
        <ChoreList chores={chores} onComplete={handleCompleteChore} />
      </div>

      {/* Quick Actions */}
      <div className="card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <h3 className="font-semibold mb-2">💡 Tips</h3>
        <ul className="text-sm text-muted space-y-1">
          <li>• Voltooi klussen om XP en munten te verdienen</li>
          <li>• Elke 100 XP ga je een level omhoog</li>
          <li>• Munten kun je later uitgeven aan beloningen</li>
        </ul>
      </div>
    </main>
  );
} 