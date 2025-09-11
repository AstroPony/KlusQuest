"use client";

interface HouseholdStats {
  totalKids: number;
  totalChores: number;
  completedToday: number;
  totalXP: number;
  totalCoins: number;
  completionRate: number;
}

interface HouseholdOverviewProps {
  stats: HouseholdStats;
}

export default function HouseholdOverview({ stats }: HouseholdOverviewProps) {
  const formatCompletionRate = (rate: number) => {
    return `${Math.round(rate * 100)}%`;
  };

  return (
    <div className="space-y-6">
      {/* 2x2 Grid for main stats */}
      <div className="grid grid-cols-2 gap-4">
        {/* Kids Count */}
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">👶</div>
          <div className="text-2xl font-bold text-primary">{stats.totalKids}</div>
          <div className="text-sm text-muted">Kinderen</div>
        </div>

        {/* Active Chores */}
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">📝</div>
          <div className="text-2xl font-bold text-accent">{stats.totalChores}</div>
          <div className="text-sm text-muted">Actieve Klussen</div>
        </div>

        {/* Completed Today */}
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">✅</div>
          <div className="text-2xl font-bold text-green-500">{stats.completedToday}</div>
          <div className="text-sm text-muted">Vandaag Voltooid</div>
        </div>

        {/* Completion Rate */}
        <div className="card p-4 text-center">
          <div className="text-2xl mb-2">📊</div>
          <div className="text-2xl font-bold text-blue-500">
            {formatCompletionRate(stats.completionRate)}
          </div>
          <div className="text-sm text-muted">Voltooiingsgraad</div>
        </div>
      </div>

      {/* Additional sections below the grid */}
      <div className="space-y-4">
        {/* Total Progress */}
        <div className="card p-4">
          <h3 className="font-semibold mb-3 text-center">Totale Voortgang</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{stats.totalXP}</div>
              <div className="text-sm text-muted">Totaal XP</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.totalCoins}</div>
              <div className="text-sm text-muted">Totaal Munten</div>
            </div>
          </div>
        </div>

        {/* Completion Rate Chart */}
        <div className="card p-4">
          <h3 className="font-semibold mb-3 text-center">Voltooiingsgraad</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Vandaag</span>
              <span>{formatCompletionRate(stats.completionRate)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.completionRate * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-muted text-center">
              {stats.completedToday} van {stats.totalChores} klussen voltooid
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 