import ShirtGraphic from "@/components/ShirtGraphic";
import { nationKitConfigs, type NationKitConfig } from "@/lib/kits";
import type { Player } from "@/lib/types";

export const metadata = {
  title: "Guess XI Kit Gallery",
  description: "Visual review gallery for generic Guess XI national-colour shirts."
};

export default function KitsPage() {
  const sortedKits = [...nationKitConfigs].sort((a, b) => a.nation.localeCompare(b.nation));

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
        {sortedKits.map((kit) => {
          const previewPlayer = createPreviewPlayer(kit);

          return (
            <article className="kit-card" key={kit.nation}>
              <header className="kit-card-header">
                <h2>{kit.nation}</h2>
                <span>{kit.patternType}</span>
              </header>
              <div className="kit-shirt-pair">
                <div>
                  <ShirtGraphic player={previewPlayer} showName={false} showNumber={false} view="front" />
                </div>
                <div>
                  <ShirtGraphic player={previewPlayer} showName showNumber view="back" />
                </div>
              </div>
              <dl className="kit-meta">
                <div>
                  <dt>Collar</dt>
                  <dd>{kit.collarType}</dd>
                </div>
                <div>
                  <dt>Trim</dt>
                  <dd>{kit.trimStyle}</dd>
                </div>
              </dl>
            </article>
          );
        })}
      </section>
    </main>
  );
}

function createPreviewPlayer(kit: NationKitConfig): Player {
  return {
    id: `preview-${kit.nation.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    fullName: "Preview Player",
    displayName: "Player",
    searchAliases: [],
    acceptedAnswers: ["Player"],
    nationality: kit.nation,
    nation: kit.nation,
    nationSlug: kit.nation.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    shirtNumber: 10,
    position: "Forward",
    club: "Preview FC",
    clubCountry: kit.nation,
    age: 26,
    internationalDebut: "2020-01-01",
    caps: 10,
    internationalGoals: 3,
    nationalTeamDebutYear: 2020,
    worldCupAppearances: "First World Cup",
    kitPrimaryColor: kit.baseColor,
    kitSecondaryColor: kit.secondaryColor,
    kitAccentColor: kit.accentColor,
    clueFact: "Gallery preview only.",
    playedAlongside: "Gallery preview only.",
    sources: "GALLERY",
    snapshotDate: "2026-06-11",
    difficultyTier: "easy",
    fameTier: "Elite"
  };
}
