import HomeLink from "@/components/HomeLink";
import SiteFooter from "@/components/SiteFooter";
import VersusChallengeCard from "@/components/VersusChallengeCard";

export const metadata = {
  title: "Guess XI Versus Mode",
  description: "Create and share a Guess XI challenge link so friends can play the same World Cup player."
};

export default function VersusStartPage() {
  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <HomeLink />
          <h1>Versus Mode</h1>
          <p className="subtitle">Create one challenge link, share it, and see who guesses the player in fewer clues.</p>
        </div>
      </section>

      <VersusChallengeCard />

      <section className="content-inline-card" aria-labelledby="versus-explainer-title">
        <div className="content-section">
          <h2 id="versus-explainer-title">How Versus Mode works</h2>
          <p>
            Versus Mode creates a shared challenge that sends everyone to the same player. It is useful for group chats, classrooms, offices, pubs,
            and watch parties where you want the same puzzle without accounts or live matchmaking.
          </p>
          <p>
            Daily Mode stays separate, so your regular three games per day are untouched. Versus is there when you want an extra round or want to
            settle a football argument with clues instead of opinions.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
