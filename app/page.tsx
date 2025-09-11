import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import SignOutButton from "@/components/auth/SignOutButton";

export default async function Home() {
  const { userId } = await auth();
  return (
    <main className="min-h-screen bg-gradient-to-br from-bg via-card to-bg">
      <div className="p-6 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex items-center justify-between">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            KlusQuest
          </h1>
          <nav className="flex items-center gap-3">
            {userId ? (
              <>
                <Link className="btn-ghost" href="/dashboard">Dashboard</Link>
                <Link className="btn-primary" href="/kid-simple">🧒 Eenvoudige Kid View</Link>
              </>
            ) : (
              <>
                <Link className="btn-ghost" href="/sign-in">Inloggen</Link>
                <Link className="btn-primary" href="/sign-up">Account Aanmaken</Link>
              </>
            )}
          </nav>
        </header>
        {userId ? (
          <div className="text-right">
            <SignOutButton className="btn-ghost" />
          </div>
        ) : null}

        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <h2 className="text-5xl font-bold leading-tight">
            Maak klussen leuk voor <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              het hele gezin
            </span>
          </h2>
          <p className="text-xl text-muted max-w-2xl mx-auto">
            KlusQuest maakt huishoudelijke taken voelen als een spel. Kinderen verdienen XP en munten,
            ouders houden overzicht. Win-win voor iedereen!
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {userId ? (
              <>
                <Link className="btn-primary text-lg px-8 py-3" href="/kid-simple">
                  🧒 Eenvoudige Kid View
                </Link>
                <Link className="btn-ghost text-lg px-8 py-3" href="/dashboard">
                  📊 Open Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link className="btn-primary text-lg px-8 py-3" href="/sign-up">
                  🚀 Start Gratis
                </Link>
                <Link className="btn-ghost text-lg px-8 py-3" href="/sign-in">
                  🔐 Al een account?
                </Link>
                <Link className="btn-ghost text-lg px-8 py-3" href="/onboarding">
                  🧭 Onboarding
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-6">
          <div className="card text-center space-y-3">
            <div className="text-4xl">🎮</div>
            <h3 className="text-xl font-semibold">Gamified Experience</h3>
            <p className="text-muted">Klussen voelen als speelse quests met XP en badges</p>
          </div>
          <div className="card text-center space-y-3">
            <div className="text-4xl">🏆</div>
            <h3 className="text-xl font-semibold">Reward System</h3>
            <p className="text-muted">Verdien XP en munten voor beloningen</p>
          </div>
          <div className="card text-center space-y-3">
            <div className="text-4xl">🌐</div>
            <h3 className="text-xl font-semibold">Bilingual</h3>
            <p className="text-muted">Nederlands + Engels ondersteuning</p>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="card bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold">✅ Klaar om te beginnen?</h3>
            <p className="text-muted">
              Start vandaag nog met het gamificeren van klussen in jouw gezin!
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
