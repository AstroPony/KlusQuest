"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import KidDashboard from "@/components/dashboard/KidDashboard";

interface Kid {
  id: string;
  displayName: string;
  avatar?: string;
  level: number;
  xp: number;
  coins: number;
}

export default function KidSimplePage() {
  const { user, isLoaded } = useUser();
  const [kids, setKids] = useState<Kid[]>([]);
  const [selectedKidId, setSelectedKidId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchKids();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchKids = async () => {
    try {
      const response = await fetch("/api/kids");
      if (response.ok) {
        const kidsData = await response.json();
        setKids(kidsData);
        if (kidsData.length > 0) {
          setSelectedKidId(kidsData[0].id);
        }
      }
    } catch (err) {
      console.error("Error fetching kids:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <main className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="text-center">Laden...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Je moet ingelogd zijn</h1>
          <p className="mb-4">Log in om de kid view te bekijken</p>
          <a href="/sign-in" className="btn-primary">
            Inloggen
          </a>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="text-center">Kinderen laden...</div>
      </main>
    );
  }

  if (kids.length === 0) {
    return (
      <main className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Geen kinderen gevonden</h1>
          <p className="mb-4">Voeg eerst kinderen toe via het dashboard</p>
          <a href="/dashboard" className="btn-primary">
            Ga naar Dashboard
          </a>
        </div>
      </main>
    );
  }

  const selectedKid = kids.find(kid => kid.id === selectedKidId);

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-center mb-4 gap-2">
        <a href="/" className="btn-ghost">
          🏠 Home
        </a>
        <a href="/dashboard" className="btn-ghost">
          ← Terug naar Dashboard
        </a>
      </div>

      {/* Kid Selector for Parents */}
      {kids.length > 1 && (
        <div className="card p-4">
          <h2 className="text-lg font-semibold mb-3">Kies een kind om te bekijken:</h2>
          <div className="flex gap-2 flex-wrap">
            {kids.map(kid => (
              <button
                key={kid.id}
                onClick={() => setSelectedKidId(kid.id)}
                className={`btn ${
                  selectedKidId === kid.id 
                    ? 'btn-primary' 
                    : 'btn-ghost'
                }`}
              >
                {kid.displayName}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {selectedKid && (
        <KidDashboard 
          kidId={selectedKid.id} 
          kidName={selectedKid.displayName} 
        />
      )}
    </main>
  );
} 