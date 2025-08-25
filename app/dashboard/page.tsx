import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/auth/SignOutButton";

export default async function Dashboard() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  return (
    <main className="p-6 max-w-5xl mx-auto space-y-6">
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

      {/* Welcome Message for New Users */}
      <div className="card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <div className="text-center space-y-4">
          <div className="text-4xl">🎉</div>
          <h2 className="text-xl font-semibold">Welkom bij KlusQuest!</h2>
          <p className="text-muted">
            Je bent klaar om te beginnen! Voeg je eerste kind toe en maak je eerste klus aan.
          </p>
          <div className="flex gap-3 justify-center">
            <button className="btn-primary">👶 Kind Toevoegen</button>
            <a href="/chores" className="btn-ghost">📝 Klussen Beheren</a>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Snelle Acties</h2>
          <div className="space-y-3">
            <button className="btn-primary w-full">👶 Kind Toevoegen</button>
            <a href="/chores" className="btn-ghost w-full">📝 Klussen Beheren</a>
            <button className="btn-ghost w-full">💰 Beloning Maken</button>
          </div>
        </div>

        {/* Household Overview */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Huisgezin Overzicht</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Kinderen:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span>Actieve Klussen:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span>Vandaag Voltooid:</span>
              <span className="font-medium">0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for future features */}
      <div className="card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
        <h3 className="font-semibold mb-2">🚧 In Ontwikkeling</h3>
        <p className="text-muted">
          Deze dashboard wordt momenteel gebouwd. Binnenkort kun je hier kinderen beheren, 
          klussen toewijzen en de voortgang bijhouden.
        </p>
      </div>
    </main>
  );
} 