import VersusChallengeCard from "@/components/VersusChallengeCard";

export default function VersusStartPage() {
  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">Asynchronous challenge</p>
          <h1>Versus Mode</h1>
          <p className="subtitle">Create one challenge link, share it, and see who guesses the player in fewer clues.</p>
        </div>
      </section>

      <VersusChallengeCard />
    </main>
  );
}
