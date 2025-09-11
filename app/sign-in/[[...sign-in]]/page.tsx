import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg via-card to-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welkom bij KlusQuest
          </h1>
          <p className="text-muted mt-2">Log in om je klussen te beheren</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-card border border-white/10 shadow-xl",
              socialButtonsBlockButtonText: "text-white",
              socialButtonsBlockButton: "text-white",
            }
          }}
        />
      </div>
    </div>
  );
} 
