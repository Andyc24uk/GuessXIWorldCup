import { describe, expect, it } from "vitest";
import { applyGuessToGame, buildClues, CASUAL_CLUE_ORDER, enforceClubDependency, getClueOrder, isCorrectGuess } from "@/lib/gameLogic";
import { players } from "@/lib/players";
import type { Player, StoredGameResult } from "@/lib/types";

describe("clue ordering", () => {
  it("keeps casual mode in the friendly fixed order", () => {
    expect(getClueOrder("casual")).toEqual(CASUAL_CLUE_ORDER);
  });

  it("uses eleven launch clues with kit reveal last", () => {
    const player = createTestPlayer({
      displayName: "Dani Olmo",
      fullName: "Daniel Olmo Carvajal",
      searchAliases: []
    });
    const clues = buildClues(player, "casual");

    expect(clues).toHaveLength(11);
    expect(clues[8].key).toBe("careerPath");
    expect(clues[8].label).toBe("Career Path");
    expect(clues[10].key).toBe("kit");
  });

  it("generates a current-club career path fallback when no custom path exists", () => {
    const player = createTestPlayer({
      displayName: "Dani Olmo",
      fullName: "Daniel Olmo Carvajal",
      searchAliases: []
    });
    const clues = buildClues(player, "casual");

    expect(clues.find((clue) => clue.key === "careerPath")?.value).toBe("Current club: Test FC");
  });

  it("uses curated career paths and notable fact overrides when available", () => {
    const player = players.find((item) => item.id === "bernardo-silva");
    const clues = buildClues(player!, "casual");

    expect(clues.find((clue) => clue.key === "careerPath")?.value).toBe("Benfica → Monaco → Manchester City");
    expect(clues.find((clue) => clue.key === "fact")?.value).toContain("2022-23 treble-winning team");
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

describe("game result state", () => {
  it("captures solving on clue 1 before revealing the remaining clues", () => {
    const player = createTestPlayer({
      displayName: "Dani Olmo",
      fullName: "Daniel Olmo Carvajal",
      searchAliases: []
    });
    const next = applyGuessToGame(createStoredGame({ revealedCount: 1 }), "Olmo", player, 11, "2026-06-12T00:00:00.000Z");

    expect(next.completed).toBe(true);
    expect(next.solved).toBe(true);
    expect(next.revealedCount).toBe(11);
    expect(next.solvedClueCount).toBe(1);
  });

  it("captures solving on clue 6 before revealing the remaining clues", () => {
    const player = createTestPlayer({
      displayName: "Dani Olmo",
      fullName: "Daniel Olmo Carvajal",
      searchAliases: []
    });
    const next = applyGuessToGame(createStoredGame({ revealedCount: 6 }), "Olmo", player, 11, "2026-06-12T00:00:00.000Z");

    expect(next.completed).toBe(true);
    expect(next.solved).toBe(true);
    expect(next.revealedCount).toBe(11);
    expect(next.solvedClueCount).toBe(6);
  });

  it("does not set a solved clue count on a failed final guess", () => {
    const player = createTestPlayer({
      displayName: "Dani Olmo",
      fullName: "Daniel Olmo Carvajal",
      searchAliases: []
    });
    const next = applyGuessToGame(createStoredGame({ revealedCount: 11 }), "wrong", player, 11, "2026-06-12T00:00:00.000Z");

    expect(next.completed).toBe(true);
    expect(next.solved).toBe(false);
    expect(next.solvedClueCount).toBeUndefined();
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

function createStoredGame(overrides: Partial<StoredGameResult> = {}): StoredGameResult {
  return {
    dateKey: "2026-06-12",
    mode: "casual",
    slot: 0,
    playerId: "test-player",
    completed: false,
    solved: false,
    guesses: [],
    revealedCount: 1,
    ...overrides
  };
}
