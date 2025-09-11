"use client";
import { useState, useEffect, useCallback } from "react";
import ChoreList from "@/components/chores/ChoreList";
import ProgressBar from "@/components/ui/ProgressBar";
import Celebration from "@/components/ui/Celebration";
import GameRewards from "@/components/game/GameRewards";
import { enqueueCompletion, flushQueue, initOfflineQueue } from "@/lib/offlineQueue";
import { KidEarningsSummary } from "@/components/ui/KidEarningsSummary";

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

type Props = {
  kidId: string;
  kidName: string;
};

export default function KidDashboard({ kidId, kidName }: Props) {
  const [chores, setChores] = useState<Chore[]>([]);
  const [stats, setStats] = useState<KidStats>({
    level: 1,
    xp: 0,
    coins: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Celebration state
  const [celebration, setCelebration] = useState<{
    isVisible: boolean;
    choreTitle: string;
    xpGained: number;
    coinsGained: number;
    levelUp: boolean;
    newLevel?: number;
  }>({
    isVisible: false,
    choreTitle: "",
    xpGained: 0,
    coinsGained: 0,
    levelUp: false,
  });

  // Game rewards state
  const [showGameRewards, setShowGameRewards] = useState(false);
  const [luxuryUnlocked, setLuxuryUnlocked] = useState<string | null>(null);

  const fetchKidData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch chores for this kid
      const choresResponse = await fetch(`/api/kids/${kidId}/chores`);
      if (!choresResponse.ok) throw new Error("Failed to fetch chores");
      const choresData = await choresResponse.json();
      setChores(choresData);

      // Fetch kid stats
      const kidsResponse = await fetch("/api/kids");
      if (!kidsResponse.ok) throw new Error("Failed to fetch kids");
      const kidsData = await kidsResponse.json();
      const kid = kidsData.find((k: any) => k.id === kidId);
      
      if (kid) {
        setStats({
          level: kid.level,
          xp: kid.xp,
          coins: kid.coins,
        });
      }

      setError(null);
    } catch (err) {
      setError("Kon gegevens niet ophalen");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [kidId]);

  useEffect(() => {
    fetchKidData();
    if (typeof window !== 'undefined') {
      initOfflineQueue();
      flushQueue();
    }
  }, [fetchKidData]);

  const handleCompleteChore = async (choreId: string, choreKidId: string) => {
    try {
      const chore = chores.find(c => c.id === choreId);
      if (!chore || chore.completed) return;

      // Use the current kid's ID if no choreKidId is provided
      const kidIdToUse = choreKidId || kidId;
      
      if (!kidIdToUse) {
        setError("Geen kind ID gevonden voor deze klus");
        return;
      }

      let ok = false;
      try {
        const response = await fetch(`/api/chores/${choreId}/complete`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kidId: kidIdToUse })
        });
        ok = response.ok;
      } catch {
        // If offline, queue it
        enqueueCompletion({ choreId, kidId: kidIdToUse });
        ok = true;
      }

      if (!ok) {
        setError("Kon klus niet voltooien");
        return;
      }

      // Update local state
      setChores(prev => prev.map(c => 
        c.id === choreId ? { ...c, completed: true } : c
      ));

      // Calculate new stats
      const newXp = stats.xp + chore.baseXp;
      const newCoins = stats.coins + chore.baseCoins;
      const newLevel = Math.floor(newXp / 100) + 1;
      const levelUp = newLevel > stats.level;

      setStats({
        level: newLevel,
        xp: newXp,
        coins: newCoins,
      });

      // Show celebration
      setCelebration({
        isVisible: true,
        choreTitle: chore.title,
        xpGained: chore.baseXp,
        coinsGained: chore.baseCoins,
        levelUp,
        newLevel: levelUp ? newLevel : undefined,
      });

      // Play a cheerful sound effect (no assets)
      try { playSuccessSound(levelUp); } catch {}

      // Refresh data after a short delay
      setTimeout(() => {
        fetchKidData();
      }, 1000);

    } catch (err) {
      setError("Kon klus niet voltooien");
      console.error(err);
    }
  };

  const closeCelebration = () => {
    setCelebration(prev => ({ ...prev, isVisible: false }));
  };

  const handleGameRewardUnlock = (gameId: string, xpEarned: number, coinsEarned: number) => {
    // Update stats with earned rewards
    setStats(prev => ({
      ...prev,
      xp: prev.xp + xpEarned,
      coins: prev.coins + coinsEarned,
    }));

    // Show celebration for game completion
    setCelebration({
      isVisible: true,
      choreTitle: "Mini-spel voltooid!",
      xpGained: xpEarned,
      coinsGained: coinsEarned,
      levelUp: xpEarned > 0,
    });

    // Also try to unlock a luxury mapped to this game
    fetch(`/api/games/${gameId}/win`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kidId }),
    })
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (data?.granted?.luxury?.title) {
          setLuxuryUnlocked(data.granted.luxury.title as string);
          setTimeout(() => setLuxuryUnlocked(null), 6000);
        }
      })
      .catch(() => {});
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-2xl mb-4">⏳</div>
        <p>Laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error text-center">
        <span>{error}</span>
        <button 
          onClick={fetchKidData}
          className="btn-ghost btn-sm ml-2"
        >
          Opnieuw proberen
        </button>
      </div>
    );
  }

  const xpForNextLevel = stats.level * 100;
  const xpProgress = stats.xp % 100;

  return (
    <div className="space-y-6">
      {luxuryUnlocked && (
        <div className="alert alert-success">
          🎉 Nieuwe luxe ontgrendeld: <strong>{luxuryUnlocked}</strong>
        </div>
      )}
      <KidEarningsSummary coins={stats.coins} xp={stats.xp} kidName={kidName} />
      {/* Header with kid info */}
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-600 bg-clip-text text-transparent">
          {kidName}'s Dashboard
        </h1>
        <p className="text-muted">Je voortgang en vandaag's klussen</p>
      </header>

      {/* At-a-glance stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center p-6">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-2xl font-bold text-primary">{stats.level}</div>
          <div className="text-muted">Level</div>
        </div>
        
        <div className="card text-center p-6">
          <div className="text-3xl mb-2">⚡</div>
          <div className="text-2xl font-bold text-primary">{stats.xp}</div>
          <div className="text-muted">Totaal XP</div>
        </div>
        
        <div className="card text-center p-6">
          <div className="text-3xl mb-2">🪙</div>
          <div className="text-2xl font-bold text-warn">{stats.coins}</div>
          <div className="text-muted">Munten</div>
        </div>
      </div>

      {/* Game Rewards Button */}
      <div className="text-center">
        <button
          onClick={() => setShowGameRewards(true)}
          className="btn-primary text-lg px-8 py-3"
        >
          🎮 Speel Mini-spellen
        </button>
        <p className="text-sm text-muted mt-2">
          Verdien extra XP en munten door spellen te spelen!
        </p>
      </div>

      {/* Progress Bars */}
      <div className="card p-6 space-y-4">
        <h3 className="text-xl font-semibold">Voortgang</h3>
        
        <ProgressBar
          current={xpProgress}
          max={100}
          label="XP naar volgend level"
          color="primary"
          showPercentage={false}
        />
        
        <div className="text-sm text-muted text-center">
          {100 - xpProgress} XP nodig voor level {stats.level + 1}
        </div>
      </div>

      {/* Today's Chores */}
      <div className="card p-6">
        <h3 className="text-xl font-semibold mb-4">Vandaag's Klussen</h3>
        
        {chores.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎉</div>
            <h4 className="text-lg font-semibold mb-2">Geen klussen vandaag!</h4>
            <p className="text-muted">Je hebt alle klussen voor vandaag afgerond.</p>
          </div>
        ) : (
          <ChoreList
            chores={chores}
            onComplete={handleCompleteChore}
            showActions={false}
            currentKidId={kidId}
          />
        )}
      </div>

      {/* Celebration Modal */}
      <Celebration
        isVisible={celebration.isVisible}
        onClose={closeCelebration}
        choreTitle={celebration.choreTitle}
        xpGained={celebration.xpGained}
        coinsGained={celebration.coinsGained}
        levelUp={celebration.levelUp}
        newLevel={celebration.newLevel}
      />

      {/* Game Rewards Overlay */}
      {showGameRewards && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <GameRewards
              kidId={kidId}
              kidXp={stats.xp}
              kidCoins={stats.coins}
              onRewardUnlock={handleGameRewardUnlock}
              onClose={() => setShowGameRewards(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Tiny celebratory sound using Web Audio API
function playSuccessSound(levelUp: boolean) {
  const AC: any = (window as any).AudioContext || (window as any).webkitAudioContext;
  if (!AC) return;
  const ctx = new AC();
  const now = ctx.currentTime;
  const notes = levelUp ? [523.25, 659.25, 783.99] : [523.25, 659.25]; // C5, E5, G5
  const dur = 0.16;
  notes.forEach((f, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = f;
    osc.connect(gain);
    gain.connect(ctx.destination);
    const start = now + i * (dur * 0.6);
    const end = start + dur;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.25, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);
    osc.start(start);
    osc.stop(end + 0.03);
  });
}

