import { describe, expect, it } from "vitest";
import { applyGuessToGame, buildClues, CASUAL_CLUE_ORDER, enforceClubDependency, getClueOrder, isCorrectGuess } from "@/lib/gameLogic";
import { createGuessOptionFromPlayer, searchGuessOptions } from "@/lib/guessOptions";
import { players } from "@/lib/players";
import {
  createPlayerSheetHeaderMap,
  getPlayerSheetCell,
  isExcludedSheetValue,
  mapPlayerSheetRowByHeader,
  PLAYER_SHEET_COLUMNS,
  PLAYER_SHEET_FIELD_MAP,
  validatePlayerSheetHeaders
} from "@/lib/sheetSchema";
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

    expect(player?.careerPath).toBe("Benfica -> Monaco -> Manchester City");
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

describe("sheet schema", () => {
  it("places Career Path immediately before Fact", () => {
    expect(PLAYER_SHEET_COLUMNS.indexOf("Career Path")).toBe(PLAYER_SHEET_COLUMNS.indexOf("Fact") - 1);
    expect(PLAYER_SHEET_FIELD_MAP["Career Path"]).toBe("careerPath");
  });

  it("keeps Exclude as an optional first column", () => {
    expect(PLAYER_SHEET_COLUMNS[0]).toBe("Exclude");
    expect(PLAYER_SHEET_FIELD_MAP["Exclude"]).toBe("exclude");
  });

  it("reads player sheet cells by exact header name instead of fixed index", () => {
    const headers = ["Fact", "Player Name", "Career Path", "Nation"];
    const row = ["Treble winner.", "Bernardo Silva", "Benfica -> Monaco -> Manchester City", "Portugal"];
    const headerMap = createPlayerSheetHeaderMap(headers);

    expect(getPlayerSheetCell(row, headerMap, "Player Name")).toBe("Bernardo Silva");
    expect(getPlayerSheetCell(row, headerMap, "Career Path")).toBe("Benfica -> Monaco -> Manchester City");
  });

  it("treats Exclude as backward-compatible when absent", () => {
    const headers = PLAYER_SHEET_COLUMNS.filter((column) => column !== "Exclude");

    expect(() => validatePlayerSheetHeaders(headers)).not.toThrow();
  });

  it("reports missing required player sheet headers clearly", () => {
    const headers = PLAYER_SHEET_COLUMNS.filter((column) => column !== "Club");

    expect(() => validatePlayerSheetHeaders(headers)).toThrow("Missing required player sheet header: Club");
  });

  it("maps Exclude values to the player exclude field", () => {
    const headers = [...PLAYER_SHEET_COLUMNS];
    const row = headers.map((header) => {
      if (header === "Exclude") {
        return "Yes";
      }
      if (header === "Player Name") {
        return "Test Player";
      }
      return "value";
    });

    expect(mapPlayerSheetRowByHeader(row, headers).exclude).toBe(true);
    expect(isExcludedSheetValue("X")).toBe(true);
    expect(isExcludedSheetValue("true")).toBe(true);
    expect(isExcludedSheetValue("yes")).toBe(true);
    expect(isExcludedSheetValue("")).toBe(false);
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

  it("offers suggestion-only names without accepting them for the active answer", () => {
    const player = players.find((item) => item.id === "bernardo-silva");
    const suggestions = searchGuessOptions("Zidane");

    expect(suggestions.some((option) => option.displayName === "Zinedine Zidane" && option.suggestionOnly)).toBe(true);
    expect(isCorrectGuess("Zinedine Zidane", player!)).toBe(false);
  });

  it("can keep excluded player rows in autocomplete while removing them from answer eligibility", () => {
    const option = createGuessOptionFromPlayer({
      ...createTestPlayer({
        displayName: "Suggestion Only Player",
        fullName: "Suggestion Only Player",
        searchAliases: ["Suggestion Alias"]
      }),
      exclude: true
    });

    expect(option.displayName).toBe("Suggestion Only Player");
    expect(option.acceptedAnswers).toContain("Suggestion Alias");
    expect(option.playablePlayerId).toBeUndefined();
    expect(option.suggestionOnly).toBe(true);
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
