import HomeLink from "@/components/HomeLink";
import GameCard from "@/components/GameCard";
import SiteFooter from "@/components/SiteFooter";
import { createVersusSlot } from "@/lib/versus";

type VersusPageProps = {
  params: Promise<{
    challengeId: string;
  }>;
};

export default async function VersusChallengePage({ params }: VersusPageProps) {
  const { challengeId } = await params;
  const slot = createVersusSlot(challengeId);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <HomeLink />
          <p className="eyebrow">Challenge your friends</p>
          <h1>Versus Mode</h1>
          <p className="subtitle">Same challenge. Same player.</p>
        </div>
      </section>

      {slot ? (
        <GameCard slot={slot} />
      ) : (
        <section className="game-card">
          <div className="result-box miss">
            <strong>Challenge unavailable</strong>
            <span>This Versus challenge could not be loaded from the current playable pool.</span>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  );
}
