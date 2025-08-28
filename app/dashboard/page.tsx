"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import SignOutButton from "@/components/auth/SignOutButton";
import KidForm from "@/components/dashboard/KidForm";
import KidList from "@/components/dashboard/KidList";
import HouseholdOverview from "@/components/dashboard/HouseholdOverview";
import ChoreApproval from "@/components/dashboard/ChoreApproval";

interface Kid {
  id: string;
  displayName: string;
  avatar?: string;
  level: number;
  xp: number;
  coins: number;
  createdAt: string;
}

interface HouseholdStats {
  totalKids: number;
  totalChores: number;
  completedToday: number;
  totalXP: number;
  totalCoins: number;
  completionRate: number;
}

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

export default function Dashboard() {
  const { user, isLoaded } = useUser();
  const [kids, setKids] = useState<Kid[]>([]);
  const [stats, setStats] = useState<HouseholdStats>({
    totalKids: 0,
    totalChores: 0,
    completedToday: 0,
    totalXP: 0,
    totalCoins: 0,
    completionRate: 0
  });
  const [completions, setCompletions] = useState<ChoreCompletion[]>([]);
  const [showKidForm, setShowKidForm] = useState(false);
  const [editingKid, setEditingKid] = useState<Kid | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    if (isLoaded && user) {
      fetchData();
    }
  }, [isLoaded, user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [kidsRes, statsRes, completionsRes] = await Promise.all([
        fetch('/api/kids'),
        fetch('/api/household/stats'),
        fetch('/api/household/completions')
      ]);

      if (kidsRes.ok) {
        const kidsData = await kidsRes.json();
        setKids(kidsData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (completionsRes.ok) {
        const completionsData = await completionsRes.json();
        setCompletions(completionsData);
      }
    } catch (err) {
      setError('Fout bij het ophalen van gegevens');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKid = async (data: { displayName: string; avatar?: string }) => {
    try {
      const response = await fetch('/api/kids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const newKid = await response.json();
        setKids(prev => [...prev, newKid]);
        setShowKidForm(false);
        fetchData(); // Refresh stats
      } else {
        setError('Fout bij het aanmaken van kind');
      }
    } catch (err) {
      setError('Fout bij het aanmaken van kind');
      console.error('Error creating kid:', err);
    }
  };

  const handleUpdateKid = async (data: { displayName: string; avatar?: string }) => {
    if (!editingKid) return;

    try {
      const response = await fetch(`/api/kids/${editingKid.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const updatedKid = await response.json();
        setKids(prev => prev.map(k => k.id === editingKid.id ? updatedKid : k));
        setEditingKid(null);
        fetchData(); // Refresh stats
      } else {
        setError('Fout bij het bijwerken van kind');
      }
    } catch (err) {
      setError('Fout bij het bijwerken van kind');
      console.error('Error updating kid:', err);
    }
  };

  const handleDeleteKid = async (kidId: string) => {
    if (!confirm('Weet je zeker dat je dit kind wilt verwijderen?')) return;

    try {
      const response = await fetch(`/api/kids/${kidId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setKids(prev => prev.filter(k => k.id !== kidId));
        fetchData(); // Refresh stats
      } else {
        setError('Fout bij het verwijderen van kind');
      }
    } catch (err) {
      setError('Fout bij het verwijderen van kind');
      console.error('Error deleting kid:', err);
    }
  };

  const handleApproveCompletion = async (completionId: string) => {
    try {
      const response = await fetch(`/api/household/completions/${completionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true })
      });

      if (response.ok) {
        setCompletions(prev => 
          prev.map(c => c.id === completionId ? { ...c, approved: true } : c)
        );
        fetchData(); // Refresh stats
      } else {
        setError('Fout bij het goedkeuren van klus');
      }
    } catch (err) {
      setError('Fout bij het goedkeuren van klus');
      console.error('Error approving completion:', err);
    }
  };

  const handleDenyCompletion = async (completionId: string) => {
    try {
      const response = await fetch(`/api/household/completions/${completionId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: false })
      });

      if (response.ok) {
        setCompletions(prev => 
          prev.map(c => c.id === completionId ? { ...c, approved: false } : c)
        );
        fetchData(); // Refresh stats
      } else {
        setError('Fout bij het afwijzen van klus');
      }
    } catch (err) {
      setError('Fout bij het afwijzen van klus');
      console.error('Error denying completion:', err);
    }
  };

  if (!isLoaded || !user) {
    return <div>Loading...</div>;
  }

  return (
    <main className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parent Dashboard</h1>
          <p className="text-muted">Welkom, {user.firstName || user.emailAddresses[0]?.emailAddress}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted">Account</p>
          <p className="font-medium">{user.emailAddresses[0]?.emailAddress}</p>
          <SignOutButton />
        </div>
      </header>

      {/* Error Display */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="btn-sm btn-ghost">✕</button>
        </div>
      )}

      {/* Household Overview */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Huisgezin Overzicht</h2>
        {loading ? (
          <div className="card p-8 text-center">
            <div className="text-2xl mb-2">⏳</div>
            <p>Gegevens laden...</p>
          </div>
        ) : (
          <HouseholdOverview stats={stats} />
        )}
      </section>

      {/* Kids Management */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Kinderen Beheren</h2>
          <button 
            onClick={() => setShowKidForm(true)}
            className="btn-primary"
          >
            👶 Kind Toevoegen
          </button>
        </div>

        {showKidForm && (
          <KidForm
            onSubmit={handleCreateKid}
            onCancel={() => setShowKidForm(false)}
          />
        )}

        {editingKid && (
          <KidForm
            kid={editingKid}
            onSubmit={handleUpdateKid}
            onCancel={() => setEditingKid(null)}
            isEditing={true}
          />
        )}

        <KidList
          kids={kids}
          onEdit={setEditingKid}
          onDelete={handleDeleteKid}
        />
      </section>

      {/* Chore Approvals */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Klus Goedkeuringen</h2>
        <ChoreApproval
          completions={completions}
          onApprove={handleApproveCompletion}
          onDeny={handleDenyCompletion}
        />
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Snelle Acties</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <a href="/chores" className="card p-6 text-center hover:bg-accent/5 transition-colors">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold">Klussen Beheren</h3>
            <p className="text-sm text-muted">Voeg klussen toe en wijs ze toe</p>
          </a>
          
          <button className="card p-6 text-center hover:bg-accent/5 transition-colors">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-semibold">Beloningen</h3>
            <p className="text-sm text-muted">Maak beloningen voor je kinderen</p>
          </button>
          
          <button className="card p-6 text-center hover:bg-accent/5 transition-colors">
            <div className="text-3xl mb-2">📊</div>
            <h3 className="font-semibold">Rapporten</h3>
            <p className="text-sm text-muted">Bekijk voortgang en statistieken</p>
          </button>
        </div>
      </section>
    </main>
  );
} 