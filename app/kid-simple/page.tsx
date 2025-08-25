"use client";
import KidDashboard from "@/components/dashboard/KidDashboard";

export default function KidSimplePage() {
  // For now, we'll use a mock kid ID
  // In a real app, this would come from authentication or URL params
  const mockKidId = "1";
  const mockKidName = "Emma";

  return (
    <main className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-center mb-4">
        <a href="/dashboard" className="btn-ghost">
          ← Terug naar Dashboard
        </a>
      </div>
      
      <KidDashboard 
        kidId={mockKidId} 
        kidName={mockKidName} 
      />
    </main>
  );
} 