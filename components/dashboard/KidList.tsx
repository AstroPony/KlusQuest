"use client";

interface Kid {
  id: string;
  displayName: string;
  avatar?: string;
  level: number;
  xp: number;
  coins: number;
  createdAt: string;
}

interface KidListProps {
  kids: Kid[];
  onEdit: (kid: Kid) => void;
  onDelete: (kidId: string) => void;
}

export default function KidList({ kids, onEdit, onDelete }: KidListProps) {
  if (kids.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-4">👶</div>
        <h3 className="text-lg font-semibold mb-2">Nog geen kinderen toegevoegd</h3>
        <p className="text-muted mb-4">
          Voeg je eerste kind toe om te beginnen met KlusQuest!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {kids.map((kid) => (
        <div key={kid.id} className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">{kid.avatar || "👶"}</div>
              <div>
                <h3 className="font-semibold text-lg">{kid.displayName}</h3>
                <div className="flex items-center space-x-4 text-sm text-muted">
                  <span>Level {kid.level}</span>
                  <span>{kid.xp} XP</span>
                  <span>{kid.coins} 🪙</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(kid)}
                className="btn-sm btn-ghost"
                title="Bewerken"
              >
                ✏️
              </button>
              <button
                onClick={() => onDelete(kid.id)}
                className="btn-sm btn-error"
                title="Verwijderen"
              >
                🗑️
              </button>
            </div>
          </div>
          
          {/* Progress bar for XP */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>XP naar level {kid.level + 1}</span>
              <span>{kid.xp % 100}/100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${(kid.xp % 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 