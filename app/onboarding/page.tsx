"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import RoleSelector from "@/components/auth/RoleSelector";
import CreateHouseholdForm from "@/components/household/CreateHouseholdForm";

type UserRole = "PARENT" | "KID";
type OnboardingStep = "role" | "household" | "complete";

type CreateHouseholdData = {
  name: string;
  locale: string;
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("role");
  const [userRole, setUserRole] = useState<UserRole | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRoleSelect = (role: UserRole) => {
    setUserRole(role);
    if (role === "KID") {
      // Kids don't need to create households, they join existing ones
      setCurrentStep("complete");
    } else {
      // Parents need to create households
      setCurrentStep("household");
    }
  };

  const handleCreateHousehold = async (data: CreateHouseholdData) => {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call to create household
      console.log("Creating household:", { ...data, userRole });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentStep("complete");
    } catch (err) {
      setError("Er is iets misgegaan bij het aanmaken van je huisgezin. Probeer het opnieuw.");
      console.error("Household creation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = () => {
    if (userRole === "PARENT") {
      router.push("/dashboard");
    } else {
      router.push("/kid-simple");
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case "role":
        return <RoleSelector onRoleSelect={handleRoleSelect} />;
      
      case "household":
        return (
          <CreateHouseholdForm 
            onSubmit={handleCreateHousehold}
            isLoading={isLoading}
          />
        );
      
      case "complete":
        return (
          <div className="text-center space-y-6">
            <div className="text-6xl">🎉</div>
            <h2 className="text-2xl font-bold">Welkom bij KlusQuest!</h2>
            <p className="text-muted">
              {userRole === "PARENT" 
                ? "Je huisgezin is aangemaakt. Je kunt nu beginnen met het toevoegen van kinderen en klussen!"
                : "Je bent klaar om te beginnen! Vraag je ouder om je toe te voegen aan hun huisgezin."
              }
            </p>
            <button
              onClick={handleComplete}
              className="btn-primary px-8 py-3"
            >
              {userRole === "PARENT" ? "Ga naar Dashboard" : "Start met Spelen"}
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "role":
        return "Kies je Rol";
      case "household":
        return "Maak je Huisgezin";
      case "complete":
        return "Klaar!";
      default:
        return "";
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case "role":
        return "Vertel ons wat je bent om de juiste ervaring te krijgen";
      case "household":
        return "Maak je eerste huisgezin aan om te beginnen";
      case "complete":
        return "Je bent klaar om te beginnen!";
      default:
        return "";
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-bg via-card to-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {["role", "household", "complete"].map((step, index) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full ${
                  currentStep === step 
                    ? "bg-primary" 
                    : index < ["role", "household", "complete"].indexOf(currentStep)
                    ? "bg-primary/50"
                    : "bg-white/20"
                }`}
              />
            ))}
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">{getStepTitle()}</h1>
            <p className="text-muted">{getStepDescription()}</p>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-6 p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger text-center">
            {error}
          </div>
        )}

        {/* Step content */}
        {renderStep()}

        {/* Navigation */}
        {currentStep === "household" && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentStep("role")}
              className="text-sm text-muted hover:text-white transition-colors"
            >
              ← Terug naar rol selectie
            </button>
          </div>
        )}
      </div>
    </main>
  );
} 