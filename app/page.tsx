import HomePageClient from "@/components/HomePageClient";
import SiteFooter from "@/components/SiteFooter";

export default function HomePage() {
  return (
    <main className="app-shell">
      <HomePageClient />

      <section className="home-content-card" aria-labelledby="home-content-title">
        <div className="home-content-grid">
          <article className="content-section">
            <p className="content-eyebrow">About the game</p>
            <h2 id="home-content-title">What is Guess XI?</h2>
            <p>
              Guess XI: World Cup is a free daily football guessing game built for supporters who enjoy testing their memory, football knowledge,
              and feel for tournament squads. Each round asks you to identify a World Cup player from a growing trail of shirt-based visual cues and
              clue cards.
            </p>
          </article>

          <article className="content-section">
            <h2>How the football guessing game works</h2>
            <p>
              Daily Mode gives you three players each day. Start from the mystery shirt, enter a guess, and reveal more clues only when you need
              them. The aim is not just to get the answer, but to solve it before the late clues make the player obvious.
            </p>
          </article>

          <article className="content-section">
            <h2>Why clues and kits matter</h2>
            <p>
              Position, World Cup history, club information, career path, and late-stage hints all narrow the field in different ways. The kit
              reveal gives you one more visual push without relying on official badges, player photos, or tournament branding.
            </p>
          </article>

          <article className="content-section">
            <h2>Play daily or challenge friends</h2>
            <p>
              You can stick to the three daily games or open Versus Mode to create a shared challenge link. That makes Guess XI easy to drop into
              group chats, watch parties, lunch breaks, classroom debates, or pub quizzes without needing accounts or live multiplayer.
            </p>
          </article>

          <article className="content-section">
            <h2>Independent fan-made football trivia game</h2>
            <p>
              Guess XI is an independent, 100% unofficial football trivia project designed for fans around the world who are watching, enjoying,
              and celebrating the World Cup. It is designed for lightweight browser play with simple graphics and publicly available player data
              and does not make use of or purport to represent official tournament assets or player photography.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
