import { describe, expect, it } from "vitest";
import { CASUAL_CLUE_ORDER, enforceClubDependency, getClueOrder, isCorrectGuess } from "@/lib/gameLogic";
import { players } from "@/lib/players";
import type { Player } from "@/lib/types";

describe("clue ordering", () => {
  it("keeps casual mode in the friendly fixed order", () => {
    expect(getClueOrder("casual")).toEqual(CASUAL_CLUE_ORDER);
  });

  it("keeps club country before club team", () => {
    const order = enforceClubDependency(["club", "shirtNumber", "clubCountry", "position"]);

    expect(order.indexOf("clubCountry")).toBeLessThan(order.indexOf("club"));
  });

  it("keeps club country before club team after seeded ultra shuffle", () => {
    const order = getClueOrder("ultra", "2026-06-09:0:ultra", true);

    expect(order.indexOf("clubCountry")).toBeLessThan(order.indexOf("club"));
  });
});

describe("guess matching", () => {
  it("matches display names and aliases case-insensitively", () => {
    const player = players.find((item) => item.id === "kevin-de-bruyne");

    expect(player).toBeDefined();
    expect(isCorrectGuess("KDB", player!)).toBe(true);
  });

  it("accepts meaningful partial name guesses", () => {
    const player = createTestPlayer({
      displayName: "Dani Olmo",
      fullName: "Daniel Olmo Carvajal",
      searchAliases: ["Dani Olmo", "Daniel Olmo Carvajal"]
    });

    expect(isCorrectGuess("Dani Olmo", player)).toBe(true);
    expect(isCorrectGuess("Olmo", player)).toBe(true);
    expect(isCorrectGuess("Daniel Olmo Carvajal", player)).toBe(true);
  });

  it("does not accept short connector name parts", () => {
    const player = createTestPlayer({
      displayName: "Kevin De Bruyne",
      fullName: "Kevin De Bruyne",
      searchAliases: []
    });

    expect(isCorrectGuess("De", player)).toBe(false);
    expect(isCorrectGuess("Bruyne", player)).toBe(true);
  });
});

function createTestPlayer(overrides: Pick<Player, "displayName" | "fullName" | "searchAliases">): Player {
  return {
    id: "test-player",
    fullName: overrides.fullName,
    displayName: overrides.displayName,
    searchAliases: overrides.searchAliases,
    acceptedAnswers: overrides.searchAliases,
    nationality: "Test",
    nation: "Test",
    nationSlug: "test",
    shirtNumber: 10,
    position: "Midfielder",
    club: "Test FC",
    clubCountry: "Testland",
    age: 26,
    internationalDebut: "2020-01-01",
    caps: 10,
    internationalGoals: 1,
    nationalTeamDebutYear: 2020,
    worldCupAppearances: "First World Cup",
    kitPrimaryColor: "#ffffff",
    kitSecondaryColor: "#111111",
    kitAccentColor: "#cccccc",
    clueFact: "Test fact.",
    playedAlongside: "Test teammate.",
    sources: "TEST",
    snapshotDate: "2026-06-11",
    difficultyTier: "easy",
    fameTier: "National"
  };
}
