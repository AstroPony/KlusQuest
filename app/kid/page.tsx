"use client";

import GameDemo from "@/components/pixi/GameDemo";

export default function KidPage() {
  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
      <header className="text-center space-y-2">
        <div className="flex justify-center mb-4">
          <a href="/dashboard" className="btn-ghost">
            ← Terug naar Dashboard
          </a>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          KlusQuest — Kid View
        </h1>
        <p className="text-muted">Speel en verdien punten door op tegels te tikken!</p>
      </header>
      
      <GameDemo />
    </main>
  );
} 