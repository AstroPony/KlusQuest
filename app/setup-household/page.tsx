"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import CreateHouseholdForm from "@/components/household/CreateHouseholdForm";

type CreateHouseholdData = {
  name: string;
  locale: string;
};

export default function SetupHouseholdPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCreateHousehold = async (data: CreateHouseholdData) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call to create household
      // For now, we'll simulate the process
      console.log("Creating household:", data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard after successful creation
      router.push("/dashboard");
    } catch (err) {
      setError("Er is iets misgegaan bij het aanmaken van je huisgezin. Probeer het opnieuw.");
      console.error("Household creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-bg via-card to-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <a href="/" className="btn-ghost">
            🏠 Terug naar Home
          </a>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger text-center">
            {error}
          </div>
        )}
        
        <CreateHouseholdForm 
          onSubmit={handleCreateHousehold}
          isLoading={isLoading}
        />
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted">
            Je kunt later altijd meer kinderen en klussen toevoegen
          </p>
        </div>
      </div>
    </main>
  );
} 