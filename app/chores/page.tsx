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
  kidIds?: string[];
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
  kidIds?: string[];
  baseXp: number;
  baseCoins: number;
};

type Kid = {
  id: string;
  displayName: string;
};

export default function ChoresPage() {
  const { user, isLoaded } = useUser();
  const [chores, setChores] = useState<Chore[]>([]);
  const [kids, setKids] = useState<Kid[]>([]);
  const [loading, setLoading] = useState(true);
  const [kidsLoading, setKidsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingChore, setEditingChore] = useState<Chore | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchChores();
      fetchKids();
    }
  }, [user]);

  const fetchChores = async () => {
    try {
      const response = await fetch("/api/chores");
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Je moet ingelogd zijn om klussen te bekijken");
        }
        throw new Error(`Failed to fetch chores: ${response.status}`);
      }
      const data = await response.json();
      setChores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kon klussen niet ophalen");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKids = async () => {
    try {
      setKidsLoading(true);
      const response = await fetch("/api/kids");
      if (response.ok) {
        const kidsData = await response.json();
        setKids(kidsData);
      } else {
        if (response.status === 401) {
          console.error("User not authenticated for kids API");
        } else {
          console.error("Failed to fetch kids:", response.status);
        }
      }
    } catch (err) {
      console.error("Error fetching kids:", err);
    } finally {
      setKidsLoading(false);
    }
  };

  const handleAddMockChores = async () => {
    try {
      const response = await fetch("/api/chores/mock", {
        method: "POST"
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Je moet ingelogd zijn om mock klussen toe te voegen");
        } else {
          throw new Error(`Kon mock klussen niet toevoegen: ${response.status}`);
        }
      }

      const result = await response.json();
      setSuccess(result.message);
      await fetchChores();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kon mock klussen niet toevoegen");
      console.error(err);
    }
  };

  const handleCreateChore = async (choreData: Omit<Chore, "id" | "completed" | "completions">) => {
    try {
      // If multiple kids are selected, create a chore for each
      if (choreData.kidIds && choreData.kidIds.length > 0) {
        const promises = choreData.kidIds.map(kidId => {
          const singleChoreData = {
            ...choreData,
            kidId: kidId,
            kidIds: undefined // Remove kidIds for individual API calls
          };
          
          return fetch("/api/chores", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(singleChoreData)
          });
        });

        const responses = await Promise.all(promises);
        
        // Check if all responses are successful
        for (const response of responses) {
          if (!response.ok) {
            if (response.status === 401) {
              throw new Error("Je moet ingelogd zijn om klussen aan te maken");
            } else if (response.status === 400) {
              const errorData = await response.json();
              throw new Error(errorData.error || "Ongeldige gegevens voor klus");
            } else {
              throw new Error(`Kon klus niet aanmaken: ${response.status}`);
            }
          }
        }
        
        setSuccess(`${choreData.kidIds.length} klus(sen) succesvol aangemaakt!`);
      } else {
        // Single chore creation (existing logic)
        const response = await fetch("/api/chores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(choreData)
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Je moet ingelogd zijn om klussen aan te maken");
          } else if (response.status === 400) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Ongeldige gegevens voor klus");
          } else {
            throw new Error(`Kon klus niet aanmaken: ${response.status}`);
          }
        }
        
        setSuccess("Klus succesvol aangemaakt!");
      }
      
      await fetchChores();
      setShowForm(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kon klus niet aanmaken");
      console.error(err);
    }
  };

  const handleEditChore = async (choreData: ChoreFormData) => {
    try {
      // For editing, we only support single kid assignment
      const editData = {
        title: choreData.title,
        description: choreData.description,
        frequency: choreData.frequency,
        kidId: choreData.kidIds && choreData.kidIds.length > 0 ? choreData.kidIds[0] : choreData.kidId,
        baseXp: choreData.baseXp,
        baseCoins: choreData.baseCoins,
        active: true
      };

      const response = await fetch(`/api/chores/${choreData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData)
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Je moet ingelogd zijn om klussen bij te werken");
        } else if (response.status === 400) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Ongeldige gegevens voor klus");
        } else {
          throw new Error(`Kon klus niet bijwerken: ${response.status}`);
        }
      }
      
      await fetchChores();
      setEditingChore(null);
      setError(null);
      setSuccess("Klus succesvol bijgewerkt!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Kon klus niet bijwerken");
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

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Laden...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Je moet ingelogd zijn</h1>
          <p className="mb-4">Log in om klussen te beheren</p>
          <a href="/sign-in" className="btn-primary">
            Inloggen
          </a>
        </div>
      </div>
    );
  }

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
          <div className="flex items-center gap-4">
            <a href="/" className="btn-ghost">
              🏠 Home
            </a>
            <a href="/dashboard" className="btn-ghost">
              ← Terug naar Dashboard
            </a>
            <h1 className="text-3xl font-bold">Klussen Beheren</h1>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddMockChores}
              className="btn-secondary"
            >
              🎲 Mock Klussen Toevoegen
            </button>
            <a
              href="/kid-simple"
              className="btn-secondary"
            >
              🎮 Bekijk Kid View
            </a>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              + Nieuwe Klus
            </button>
          </div>
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

      {success && (
        <div className="alert alert-success mb-6">
          <span>{success}</span>
          <button 
            onClick={() => setSuccess(null)}
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
                kidIds: editingChore.kid?.id ? [editingChore.kid.id] : [],
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