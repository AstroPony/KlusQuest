import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg via-card to-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Start je KlusQuest
          </h1>
          <p className="text-muted mt-2">Maak een account aan om te beginnen</p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card border border-white/10 shadow-xl",
            }
          }}
          redirectUrl="/onboarding"
        />
      </div>
    </div>
  );
} 