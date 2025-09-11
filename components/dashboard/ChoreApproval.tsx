"use client";

interface ChoreCompletion {
  id: string;
  choreId: string;
  choreTitle: string;
  kidId: string;
  kidName: string;
  kidAvatar?: string;
  xpEarned: number;
  coinsEarned: number;
  createdAt: string;
  approved: boolean;
}

interface ChoreApprovalProps {
  completions: ChoreCompletion[];
  onApprove: (completionId: string) => void;
  onDeny: (completionId: string) => void;
}

export default function ChoreApproval({ completions, onApprove, onDeny }: ChoreApprovalProps) {
  const pendingCompletions = completions.filter(c => !c.approved);
  const approvedCompletions = completions.filter(c => c.approved);

  if (completions.length === 0) {
    return (
      <div className="card p-8 text-center">
        <div className="text-4xl mb-4">📝</div>
        <h3 className="text-lg font-semibold mb-2">Nog geen klussen voltooid</h3>
        <p className="text-muted">
          Wanneer je kinderen klussen voltooien, verschijnen ze hier ter goedkeuring.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Pending Approvals */}
      {pendingCompletions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-orange-600">
            ⏳ Wachtend op Goedkeuring ({pendingCompletions.length})
          </h3>
          <div className="space-y-3">
            {pendingCompletions.map((completion) => (
              <div key={completion.id} className="card p-4 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{completion.kidAvatar || "👶"}</div>
                    <div>
                      <div className="font-medium">{completion.kidName}</div>
                      <div className="text-sm text-muted">{completion.choreTitle}</div>
                      <div className="text-xs text-muted">
                        {new Date(completion.createdAt).toLocaleString('nl-NL')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-muted mb-1">Verdient:</div>
                    <div className="font-medium text-yellow-600">{completion.xpEarned} XP</div>
                    <div className="font-medium text-yellow-500">{completion.coinsEarned} 🪙</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onApprove(completion.id)}
                      className="btn-sm btn-primary"
                      title="Goedkeuren"
                    >
                      ✅ Goedkeuren
                    </button>
                    <button
                      onClick={() => onDeny(completion.id)}
                      className="btn-sm btn-error"
                      title="Afwijzen"
                    >
                      ❌ Afwijzen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Approved */}
      {approvedCompletions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-green-600">
            ✅ Recent Goedgekeurd ({approvedCompletions.length})
          </h3>
          <div className="space-y-3">
            {approvedCompletions.slice(0, 5).map((completion) => (
              <div key={completion.id} className="card p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{completion.kidAvatar || "👶"}</div>
                    <div>
                      <div className="font-medium">{completion.kidName}</div>
                      <div className="text-sm text-muted">{completion.choreTitle}</div>
                      <div className="text-xs text-muted">
                        {new Date(completion.createdAt).toLocaleString('nl-NL')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-muted mb-1">Verdiend:</div>
                    <div className="font-medium text-yellow-600">{completion.xpEarned} XP</div>
                    <div className="font-medium text-yellow-500">{completion.coinsEarned} 🪙</div>
                  </div>
                  
                  <div className="text-green-600 text-sm font-medium">
                    ✅ Goedgekeurd
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 