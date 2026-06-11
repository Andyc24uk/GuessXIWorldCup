import { describe, expect, it } from "vitest";
import {
  getKitConfigForPlayer,
  nationKitConfigs,
  SUPPORTED_KIT_COLLAR_TYPES,
  SUPPORTED_KIT_PATTERN_TYPES,
  SUPPORTED_KIT_TRIM_STYLES
} from "@/lib/kits";
import type { Player } from "@/lib/types";

const WORLD_CUP_2026_NATIONS = [
  "Algeria",
  "Argentina",
  "Australia",
  "Austria",
  "Belgium",
  "Bosnia and Herzegovina",
  "Brazil",
  "Canada",
  "Cape Verde",
  "Colombia",
  "Croatia",
  "Curacao",
  "Czechia",
  "DR Congo",
  "Ecuador",
  "Egypt",
  "England",
  "France",
  "Germany",
  "Ghana",
  "Haiti",
  "Iran",
  "Iraq",
  "Ivory Coast",
  "Japan",
  "Jordan",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Norway",
  "Panama",
  "Paraguay",
  "Portugal",
  "Qatar",
  "Saudi Arabia",
  "Scotland",
  "Senegal",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Tunisia",
  "Turkey",
  "Uruguay",
  "USA",
  "Uzbekistan"
];

describe("nation kit configs", () => {
  it("includes every 2026 World Cup nation once", () => {
    const nations = nationKitConfigs.map((config) => config.nation).sort();

    expect(nations).toHaveLength(48);
    expect(nations).toEqual([...WORLD_CUP_2026_NATIONS].sort());
  });

  it("does not include duplicate nation keys", () => {
    const nations = nationKitConfigs.map((config) => config.nation);
    const uniqueNations = new Set(nations);

    expect(uniqueNations.size).toBe(nations.length);
  });

  it("uses required hex colours on every configured kit", () => {
    const hexColor = /^#[0-9a-f]{6}$/i;

    for (const config of nationKitConfigs) {
      expect(config.baseColor, config.nation).toMatch(hexColor);
      expect(config.secondaryColor, config.nation).toMatch(hexColor);
      expect(config.accentColor, config.nation).toMatch(hexColor);
    }
  });

  it("uses only supported pattern, collar, and trim values", () => {
    for (const config of nationKitConfigs) {
      expect(SUPPORTED_KIT_PATTERN_TYPES, config.nation).toContain(config.patternType);
      expect(SUPPORTED_KIT_COLLAR_TYPES, config.nation).toContain(config.collarType);
      expect(SUPPORTED_KIT_TRIM_STYLES, config.nation).toContain(config.trimStyle);
    }
  });

  it("resolves common nation aliases to configured kits", () => {
    expect(getKitConfigForPlayer(createPlayer("United States")).nation).toBe("USA");
    expect(getKitConfigForPlayer(createPlayer("Cote d'Ivoire")).nation).toBe("Ivory Coast");
    expect(getKitConfigForPlayer(createPlayer("Turkiye")).nation).toBe("Turkey");
  });

  it("falls back to player colours for nations not yet configured", () => {
    const player = createPlayer("Atlantis");

    expect(getKitConfigForPlayer(player).baseColor).toBe(player.kitPrimaryColor);
  });
});

function createPlayer(nation: string): Player {
  return {
    id: `test-${nation}`,
    fullName: "Test Player",
    displayName: "Test Player",
    searchAliases: [],
    acceptedAnswers: ["Test Player"],
    nationality: nation,
    nation,
    nationSlug: nation.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    shirtNumber: 10,
    position: "Forward",
    club: "Test FC",
    clubCountry: "Testland",
    age: 28,
    internationalDebut: "2026-01-01",
    caps: 1,
    internationalGoals: 0,
    nationalTeamDebutYear: 2026,
    worldCupAppearances: "First World Cup",
    kitPrimaryColor: "#123456",
    kitSecondaryColor: "#abcdef",
    kitAccentColor: "#fedcba",
    clueFact: "Test fact.",
    playedAlongside: "Test teammate.",
    sources: "TEST",
    snapshotDate: "2026-06-11",
    difficultyTier: "easy",
    fameTier: "Elite"
  };
}
