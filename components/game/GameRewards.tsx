"use client";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import NavigationBreadcrumb, { NavigationPatterns } from "@/components/ui/NavigationBreadcrumb";
import MemoryMatch from "@/components/game/games/MemoryMatch";
import ColorSort from "@/components/game/games/ColorSort";
import NumberPuzzle from "@/components/game/games/NumberPuzzle";
import WordScramble from "@/components/game/games/WordScramble";
import PatternMatch from "@/components/game/games/PatternMatch";

type MiniGame = {
  id: string;
  name: string;
  description: string;
  xpCost: number;
  coinCost: number;
  icon: string;
  unlocked: boolean;
  difficulty: "easy" | "medium" | "hard";
};

type GameRewardsProps = {
  kidId: string;
  kidXp: number;
  kidCoins: number;
  onRewardUnlock: (gameId: string, xpEarned: number, coinsEarned: number) => void;
  onClose?: () => void;
};

export default function GameRewards({ kidId, kidXp, kidCoins, onRewardUnlock, onClose }: GameRewardsProps) {
  const { user, isLoaded } = useUser();
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null);
  const [scores, setScores] = useState<Record<string, { bestScore: number; attempts: number }>>({});

  const [miniGames, setMiniGames] = useState<MiniGame[]>([
    { id: "memory-match", name: "Memory Match", description: "Match pairs of cards to earn XP and coins", xpCost: 0, coinCost: 5, icon: "🧠", unlocked: true, difficulty: "easy" },
    { id: "color-sort", name: "Color Sort", description: "Sort colored balls into matching containers", xpCost: 20, coinCost: 10, icon: "🎨", unlocked: false, difficulty: "medium" },
    { id: "number-puzzle", name: "Number Puzzle", description: "Solve math puzzles for bonus rewards", xpCost: 50, coinCost: 25, icon: "🔢", unlocked: false, difficulty: "hard" },
    { id: "word-scramble", name: "Word Scramble", description: "Unscramble words to unlock special items", xpCost: 30, coinCost: 15, icon: "🔤", unlocked: false, difficulty: "medium" },
    { id: "pattern-match", name: "Pattern Match", description: "Complete patterns for maximum rewards", xpCost: 100, coinCost: 50, icon: "🧩", unlocked: false, difficulty: "hard" },
  ]);

  // Unlock games based on XP level
  useEffect(() => {
    setMiniGames((prev) => prev.map((game) => ({ ...game, unlocked: game.xpCost <= kidXp })));
  }, [kidXp]);

  // Load best scores per game for this kid
  useEffect(() => {
    async function load() {
      const next: Record<string, { bestScore: number; attempts: number }> = {};
      for (const g of miniGames) {
        try {
          const res = await fetch(`/api/games/${g.id}/score?kidId=${kidId}`);
          if (res.ok) {
            const data = await res.json();
            next[g.id] = { bestScore: data.bestScore ?? 0, attempts: data.attempts ?? 0 };
          }
        } catch {}
      }
      setScores(next);
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kidId]);

  const startGame = (game: MiniGame) => {
    if (!game.unlocked) {
      if (kidCoins >= game.coinCost) {
        setMiniGames((prev) => prev.map((g) => (g.id === game.id ? { ...g, unlocked: true } : g)));
        onRewardUnlock(game.id, 0, -game.coinCost);
      }
      return;
    }
    setSelectedGame(game);
  };

  // When a game completes, apply rewards, save score, and refresh best score
  const onGameComplete = async (score: number, durationSeconds?: number) => {
    if (!selectedGame) return;
    const diff = selectedGame.difficulty;
    const base = diff === "easy" ? 10 : diff === "medium" ? 25 : 50;
    const coinBase = diff === "easy" ? 2 : diff === "medium" ? 5 : 10;
    const perfBonus = Math.max(0, Math.floor(score / 200));
    const xpReward = base + perfBonus;
    const coinReward = coinBase + Math.min(5, Math.floor(score / 500));
    onRewardUnlock(selectedGame.id, xpReward, coinReward);

    try {
      await fetch(`/api/games/${selectedGame.id}/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kidId, score: Math.floor(score), durationSeconds }),
      });
      const res = await fetch(`/api/games/${selectedGame.id}/score?kidId=${kidId}`);
      if (res.ok) {
        const data = await res.json();
        setScores((prev) => ({ ...prev, [selectedGame.id]: { bestScore: data.bestScore ?? 0, attempts: data.attempts ?? 0 } }));
      }
    } catch {}

    setSelectedGame(null);
    if (onClose) {
      // Optionally close the overlay shortly after completion
      setTimeout(() => onClose(), 800);
    }
  };

  const getDifficultyColor = (d: string) => (d === "easy" ? "text-green-500" : d === "medium" ? "text-yellow-500" : "text-red-500");
  const getDifficultyBg = (d: string) => (d === "easy" ? "bg-green-500/20" : d === "medium" ? "bg-yellow-500/20" : "bg-red-500/20");

  if (selectedGame) {
    const commonProps = { onComplete: onGameComplete, onExit: () => setSelectedGame(null) } as const;
    switch (selectedGame.id) {
      case "memory-match":
        return <MemoryMatch {...commonProps} />;
      case "color-sort":
        return <ColorSort {...commonProps} />;
      case "number-puzzle":
        return <NumberPuzzle {...commonProps} />;
      case "word-scramble":
        return <WordScramble {...commonProps} />;
      case "pattern-match":
        return <PatternMatch {...commonProps} />;
    }
  }

  return (
    <div className="card p-6 relative">
      <NavigationBreadcrumb items={NavigationPatterns.gameView} className="mb-4" />

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">🎮 Mini-Games</h3>
        {onClose && (
          <button onClick={onClose} className="btn btn-ghost" aria-label="Close games">✕</button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-primary/10 rounded-lg">
          <div className="text-2xl font-bold text-primary">{kidXp}</div>
          <div className="text-sm text-muted">Total XP</div>
        </div>
        <div className="text-center p-3 bg-yellow-500/10 rounded-lg">
          <div className="text-2xl font-bold text-yellow-500">{kidCoins}</div>
          <div className="text-sm text-muted">Coins</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {miniGames.map((game) => (
          <div key={game.id} className={`p-4 rounded-lg border transition-all duration-200 ${game.unlocked ? "bg-white/5 border-white/20 hover:border-primary/40 hover:bg-primary/5" : "bg-gray-500/10 border-gray-500/30 opacity-60"}`}>
            <div className="text-center">
              <div className="text-3xl mb-2">{game.icon}</div>
              <h4 className="font-semibold mb-1">{game.name}</h4>
              <p className="text-sm text-muted mb-3">{game.description}</p>
              <div className="flex justify-center mb-3">
                <span className={`text-xs px-2 py-1 rounded ${getDifficultyBg(game.difficulty)} ${getDifficultyColor(game.difficulty)}`}>{game.difficulty.toUpperCase()}</span>
              </div>
              <div className="text-xs text-muted mb-2">Best: {scores[game.id]?.bestScore ?? 0} • Tries: {scores[game.id]?.attempts ?? 0}</div>
              {!game.unlocked && (
                <div className="text-xs text-muted mb-3">
                  <div>Unlock: {game.xpCost} XP</div>
                  <div>Or: {game.coinCost} Coins</div>
                </div>
              )}
              <button onClick={() => startGame(game)} disabled={!game.unlocked && kidCoins < game.coinCost} className={`btn btn-sm w-full ${game.unlocked ? "btn-primary" : kidCoins >= game.coinCost ? "btn-warning" : "btn-disabled"}`}>
                {game.unlocked ? "▶ Play" : kidCoins >= game.coinCost ? "🔓 Unlock" : "🔒 Locked"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-blue-500/20 rounded-lg">
        <h4 className="font-semibold mb-2">ℹ️ How Mini-Games Work</h4>
        <div className="text-sm text-muted space-y-1">
          <p>• Easy Games: Quick fun for small rewards</p>
          <p>• Medium Games: Balanced challenge and rewards</p>
          <p>• Hard Games: Maximum challenge for big rewards</p>
          <p>• Bonus Rewards: Great performance yields extra XP and coins!</p>
        </div>
      </div>
    </div>
  );
}

