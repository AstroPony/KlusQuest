"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import KidDashboard from "@/components/dashboard/KidDashboard";

interface KidData {
  id: string;
  displayName: string;
  avatar?: string;
  level: number;
  xp: number;
  coins: number;
}

interface InviteData {
  kid: KidData;
  household: {
    id: string;
    name: string;
  };
}

export default function KidAccessPage({ params }: { params: { token: string } }) {
  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validateInvite = useCallback(async () => {
    try {
      setLoading(true);
      
      // Validate the invite token
      const response = await fetch(`/api/kid-access/validate/${params.token}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError("Deze uitnodigingslink is niet geldig of verlopen");
        } else if (response.status === 410) {
          setError("Deze uitnodigingslink is verlopen");
        } else {
          setError("Er is een fout opgetreden bij het valideren van de link");
        }
        return;
      }

      const data = await response.json();
      setInviteData(data);
      
      // Store the access token in localStorage for PWA access
      localStorage.setItem("kidAccessToken", params.token);
      localStorage.setItem("kidData", JSON.stringify(data.kid));
      
    } catch (err) {
      setError("Kon de uitnodigingslink niet valideren");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [params.token]);

  useEffect(() => {
    validateInvite();
  }, [validateInvite]);

  const handleLogout = () => {
    // Clear kid access data
    localStorage.removeItem("kidAccessToken");
    localStorage.removeItem("kidData");
    
    // Redirect to home
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔐</div>
          <h1 className="text-2xl font-bold mb-2">Uitnodigingslink Valideren</h1>
          <p className="text-muted">Even geduld...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold mb-2">Toegang Geweigerd</h1>
          <p className="text-muted mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="btn-primary"
          >
            Terug naar Home
          </button>
        </div>
      </div>
    );
  }

  if (!inviteData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{inviteData.kid.avatar || "👶"}</div>
              <div>
                <h1 className="text-xl font-semibold">
                  Welkom, {inviteData.kid.displayName}!
                </h1>
                <p className="text-sm text-muted">
                  {inviteData.household.name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-muted">Level {inviteData.kid.level}</p>
                <p className="text-sm font-medium">
                  {inviteData.kid.xp} XP • {inviteData.kid.coins} 🪙
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="btn-ghost text-sm"
                title="Uitloggen"
              >
                🚪
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <KidDashboard
          kidId={inviteData.kid.id}
          kidName={inviteData.kid.displayName}
        />
      </main>

      {/* PWA Install Prompt */}
      <div className="fixed bottom-4 right-4">
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <h3 className="font-semibold mb-2">📱 Installeer als App</h3>
          <p className="text-sm text-muted mb-3">
            Installeer KlusQuest op je telefoon voor de beste ervaring!
          </p>
          <button
            onClick={() => {
              // This will trigger the PWA install prompt
              if ('serviceWorker' in navigator) {
                // Show PWA install instructions
                alert("Om de app te installeren:\n1. Tik op de deel-knop\n2. Kies 'Zet op beginscherm'\n3. Tik 'Voeg toe'");
              }
            }}
            className="btn-primary w-full"
          >
            📲 Installeren
          </button>
        </div>
      </div>
    </div>
  );
} 
