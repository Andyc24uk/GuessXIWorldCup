import AnswerKitGraphic from "@/components/AnswerKitGraphic";
import { nationKitAssetColours } from "@/lib/nationKitAssets";
import type { Player } from "@/lib/types";

export const metadata = {
  title: "Guess XI Kit Gallery",
  description: "Visual review gallery for generic Guess XI national-colour shirts."
};

export default function KitsPage() {
  const sortedKits = Object.entries(nationKitAssetColours).sort(([a], [b]) => a.localeCompare(b));

  return (
    <main className="kit-gallery-shell">
      <header className="kit-gallery-header">
        <p className="eyebrow">Visual review</p>
        <h1>Guess XI Kit Gallery</h1>
        <p className="kit-gallery-disclaimer">
          Generic national-colour shirts for gameplay. No official crests, badges, sponsors, manufacturer marks, or official kit designs.
        </p>
      </header>

      <section className="kit-gallery-grid" aria-label="Generic national kit gallery">
        {sortedKits.map(([nation, colours]) => {
          const previewPlayer = createPreviewPlayer(nation);

          return (
            <article className="kit-card" key={nation}>
              <header className="kit-card-header">
                <h2>{nation}</h2>
                <span>{colours.shirt} / {colours.shorts}</span>
              </header>
              <div className="kit-review-panel">
                <AnswerKitGraphic player={previewPlayer} showCaption={false} />
              </div>
              <dl className="kit-meta">
                <div>
                  <dt>Shirt</dt>
                  <dd>{colours.shirt}</dd>
                </div>
                <div>
                  <dt>Shorts</dt>
                  <dd>{colours.shorts}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </section>
    </main>
  );
}

function createPreviewPlayer(nation: string): Player {
  return {
    id: `preview-${nation.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    fullName: "Preview Player",
    displayName: "Player",
    searchAliases: [],
    acceptedAnswers: ["Player"],
    nationality: nation,
    nation,
    nationSlug: nation.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    shirtNumber: 10,
    position: "Forward",
    club: "Preview FC",
    clubCountry: nation,
    age: 26,
    internationalDebut: "2020-01-01",
    caps: 10,
    internationalGoals: 3,
    nationalTeamDebutYear: 2020,
    worldCupAppearances: "First World Cup",
    kitPrimaryColor: "#ffffff",
    kitSecondaryColor: "#10231d",
    kitAccentColor: "#e7bd4a",
    clueFact: "Gallery preview only.",
    playedAlongside: "Gallery preview only.",
    sources: "GALLERY",
    snapshotDate: "2026-06-11",
    difficultyTier: "easy",
    fameTier: "Elite"
  };
}
