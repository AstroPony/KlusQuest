"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import ChoreList from "@/components/chores/ChoreList";
import ChoreForm from "@/components/chores/ChoreForm";

type Chore = {
  id: string;
  title: string;
  description?: string;
  frequency: string;
  baseXp: number;
  baseCoins: number;
  completed: boolean;
  kid?: {
    id: string;
    displayName: string;
    avatar?: string;
  };
  completions: Array<{
    id: string;
    createdAt: Date;
    kidId: string;
  }>;
};

type ChoreFormData = {
  id?: string;
  title: string;
  description?: string;
  frequency: string;
  kidId?: string;
  baseXp: number;
  baseCoins: number;
};

type Kid = {
  id: string;
  displayName: string;
};

export default function ChoresPage() {
  const { user } = useUser();
  const [chores, setChores] = useState<Chore[]>([]);
  const [kids, setKids] = useState<Kid[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChore, setEditingChore] = useState<Chore | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchChores();
      fetchKids();
    }
  }, [user]);

  const fetchChores = async () => {
    try {
      const response = await fetch("/api/chores");
      if (!response.ok) throw new Error("Failed to fetch chores");
      const data = await response.json();
      setChores(data);
    } catch (err) {
      setError("Kon klussen niet ophalen");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKids = async () => {
    try {
      // For now, we'll use a mock kids array
      // TODO: Create proper kids API endpoint
      setKids([
        { id: "1", displayName: "Emma" },
        { id: "2", displayName: "Lucas" }
      ]);
    } catch (err) {
      console.error("Error fetching kids:", err);
    }
  };

  const handleCreateChore = async (choreData: Omit<Chore, "id" | "completed" | "completions">) => {
    try {
      const response = await fetch("/api/chores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(choreData)
      });

      if (!response.ok) throw new Error("Failed to create chore");
      
      await fetchChores();
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError("Kon klus niet aanmaken");
      console.error(err);
    }
  };

  const handleEditChore = async (choreData: ChoreFormData) => {
    try {
      const response = await fetch(`/api/chores/${choreData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: choreData.title,
          description: choreData.description,
          frequency: choreData.frequency,
          kidId: choreData.kidId,
          baseXp: choreData.baseXp,
          baseCoins: choreData.baseCoins,
          active: true
        })
      });

      if (!response.ok) throw new Error("Failed to update chore");
      
      await fetchChores();
      setEditingChore(null);
      setError(null);
    } catch (err) {
      setError("Kon klus niet bijwerken");
      console.error(err);
    }
  };

  const handleDeleteChore = async (choreId: string) => {
    if (!confirm("Weet je zeker dat je deze klus wilt verwijderen?")) return;

    try {
      const response = await fetch(`/api/chores/${choreId}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete chore");
      
      await fetchChores();
      setError(null);
    } catch (err) {
      setError("Kon klus niet verwijderen");
      console.error(err);
    }
  };

  const handleCompleteChore = async (choreId: string, kidId: string) => {
    try {
      const response = await fetch(`/api/chores/${choreId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kidId })
      });

      if (!response.ok) throw new Error("Failed to complete chore");
      
      await fetchChores();
      setError(null);
    } catch (err) {
      setError("Kon klus niet voltooien");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Laden...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Klussen Beheren</h1>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
        >
          + Nieuwe Klus
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-6">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="btn-ghost btn-sm"
          >
            ✕
          </button>
        </div>
      )}

      {showForm && (
        <div className="mb-8">
          <ChoreForm
            kids={kids}
            onSubmit={handleCreateChore}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {editingChore && (
        <div className="mb-8">
                  <ChoreForm
          chore={{
            id: editingChore.id,
            title: editingChore.title,
            description: editingChore.description,
            frequency: editingChore.frequency,
            kidId: editingChore.kid?.id,
            baseXp: editingChore.baseXp,
            baseCoins: editingChore.baseCoins
          }}
          kids={kids}
          onSubmit={handleEditChore}
          onCancel={() => setEditingChore(null)}
          isEditing={true}
        />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Vandaag</h2>
          <ChoreList
            chores={chores}
            onComplete={handleCompleteChore}
            onEdit={setEditingChore}
            onDelete={handleDeleteChore}
            showActions={true}
          />
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Alle Klussen</h2>
          <div className="space-y-3">
            {chores.map((chore) => (
              <div 
                key={chore.id} 
                className="card p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold">{chore.title}</h4>
                    {chore.description && (
                      <p className="text-sm text-muted mt-1">{chore.description}</p>
                    )}
                    <div className="flex gap-3 mt-2 text-sm">
                      <span className="text-primary">⭐ {chore.baseXp} XP</span>
                      <span className="text-warn">💰 {chore.baseCoins} munten</span>
                      <span className="text-accent">📅 {chore.frequency}</span>
                      {chore.kid && (
                        <span className="text-info">👤 {chore.kid.displayName}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setEditingChore(chore)}
                      className="btn-secondary btn-sm"
                      title="Bewerken"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteChore(chore.id)}
                      className="btn-error btn-sm"
                      title="Verwijderen"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 