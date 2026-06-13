import { afterEach, describe, expect, it } from "vitest";
import { shouldShowVersusPlayAgain } from "@/lib/gameUi";
import { isPlayablePlayer, getLaunchPlayerPool } from "@/lib/players";
import { shareWithFallback, createNativeSharePayload } from "@/lib/share";
import { createInitialStoredGame, getDailySlotsStorageKey, getRecentPlayersStorageKey, saveStoredGame } from "@/lib/storage";
import {
  createVersusShareText,
  createVersusSlot,
  getNextVersusChallengeId,
  getStableVersusPlayerPool,
  getVersusChallengePlayer,
  getVersusChallengeUrl
} from "@/lib/versus";

describe("versus mode", () => {
  afterEach(() => {
    delete (globalThis as { window?: unknown }).window;
  });

  it("resolves the same challenge id to the same player", () => {
    const first = getVersusChallengePlayer("abc123");
    const second = getVersusChallengePlayer("abc123");

    expect(first?.id).toBe(second?.id);
  });

  it("resolves different challenge ids deterministically across a controlled playable pool", () => {
    const pool = createPlayableFixturePool();
    const candidateChallengeIds = ["abc123", "def456", "ghi789", "jkl012", "mno345", "pqr678", "stu901", "vwx234"];
    const resolvedIds = candidateChallengeIds.map((challengeId) => getVersusChallengePlayer(challengeId, pool)?.id);

    expect(resolvedIds.every(Boolean)).toBe(true);
    expect(new Set(resolvedIds).size).toBeGreaterThan(1);
  });

  it("selects versus players only from the strict playable pool", () => {
    const slot = createVersusSlot("abc123");
    const player = getVersusChallengePlayer("abc123");

    expect(slot?.selectionMode).toBe("versus");
    expect(slot?.seedType).toBe("versus");
    expect(player).toBeDefined();
    expect(getLaunchPlayerPool().some((candidate) => candidate.id === player?.id)).toBe(true);
  });

  it("does not select excluded, verify, incomplete, or suggestion-only fixture players", () => {
    const playablePool = createPlayableFixturePool();
    const excludedPlayer = { ...createFixturePlayer("excluded", "Nation X"), exclude: true };
    const verifyPlayer = { ...createFixturePlayer("verify", "Nation Y"), careerPath: "[Verify]" };
    const incompletePlayer = { ...createFixturePlayer("incomplete", "Nation Z"), clubCountry: "" };
    const suggestionOnlyPlayer = { id: "suggestion-only-player" };
    const sourceRows = [...playablePool, excludedPlayer, verifyPlayer, incompletePlayer];
    const strictPool = sourceRows.filter(isPlayablePlayer);
    const strictPoolIds = new Set(strictPool.map((player) => player.id));

    expect(strictPoolIds).toEqual(new Set(playablePool.map((player) => player.id)));
    expect(strictPoolIds.has(excludedPlayer.id)).toBe(false);
    expect(strictPoolIds.has(verifyPlayer.id)).toBe(false);
    expect(strictPoolIds.has(incompletePlayer.id)).toBe(false);
    expect(strictPoolIds.has(suggestionOnlyPlayer.id)).toBe(false);

    const resolved = getVersusChallengePlayer("fixture123", strictPool);
    expect(resolved).toBeDefined();
    expect(strictPoolIds.has(resolved!.id)).toBe(true);
  });

  it("does not count against daily mode slot storage or no-repeat memory", () => {
    const storage = createLocalStorageMock();
    (globalThis as { window?: unknown }).window = {
      localStorage: storage
    };

    const dailySlotsKey = getDailySlotsStorageKey("2026-06-13", "casual");
    const recentPlayersKey = getRecentPlayersStorageKey();
    storage.setItem(dailySlotsKey, JSON.stringify([{ slot: 0, playerId: "daily-player", mode: "casual", dateKey: "2026-06-13" }]));
    storage.setItem(recentPlayersKey, JSON.stringify([{ playerId: "daily-player", dateKey: "2026-06-13" }]));

    saveStoredGame(
      createInitialStoredGame("versus:abc123", "casual", 0, getLaunchPlayerPool()[0].id)
    );

    expect(storage.getItem(dailySlotsKey)).toBe(JSON.stringify([{ slot: 0, playerId: "daily-player", mode: "casual", dateKey: "2026-06-13" }]));
    expect(storage.getItem(recentPlayersKey)).toBe(JSON.stringify([{ playerId: "daily-player", dateKey: "2026-06-13" }]));
  });

  it("includes the challenge url in solved versus share text and uses solved clue count", () => {
    const challengeUrl = getVersusChallengeUrl("abc123");
    const text = createVersusShareText("Mathew Ryan", true, 4, challengeUrl);

    expect(text).toContain(challengeUrl);
    expect(text).toContain("I got it in 4 clues in Guess XI Versus Mode.");
    expect(text).toContain("⚽ ⚽ ⚽ ⚽ ⚪️ ⚪️ ⚪️ ⚪️ ⚪️ ⚪️ ⚪️");
  });

  it("uses eleven footballs and stumped wording for failed versus share text", () => {
    const challengeUrl = getVersusChallengeUrl("abc123");
    const text = createVersusShareText("Mathew Ryan", false, 11, challengeUrl);

    expect(text).toContain(challengeUrl);
    expect(text).toContain("I was stumped in Guess XI Versus Mode.");
    expect(text).toContain("⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽ ⚽");
  });

  it("shows Play again? for versus results but not daily results", () => {
    const versusSlot = createVersusSlot("abc123");
    const dailySlot = {
      slot: 0,
      playerId: getLaunchPlayerPool()[0].id,
      mode: "casual" as const,
      dateKey: "2026-06-13",
      selectionMode: "daily-random" as const,
      seedType: "user-day" as const
    };

    expect(shouldShowVersusPlayAgain(versusSlot!, true)).toBe(true);
    expect(shouldShowVersusPlayAgain(dailySlot, true)).toBe(false);
  });

  it("produces the same next challenge id from the same current challenge id", () => {
    expect(getNextVersusChallengeId("abc123")).toBe(getNextVersusChallengeId("abc123"));
  });

  it("different challenge ids generally produce different next challenge ids", () => {
    expect(getNextVersusChallengeId("abc123")).not.toBe(getNextVersusChallengeId("def456"));
  });

  it("play again from the same challenge sends users to the same next url", () => {
    const firstUrl = getVersusChallengeUrl(getNextVersusChallengeId("abc123"));
    const secondUrl = getVersusChallengeUrl(getNextVersusChallengeId("abc123"));

    expect(firstUrl).toBe(secondUrl);
  });

  it("the deterministic next challenge resolves to a strict playable player", () => {
    const nextChallengeId = getNextVersusChallengeId("abc123");
    const nextPlayer = getVersusChallengePlayer(nextChallengeId);

    expect(nextChallengeId).toHaveLength(6);
    expect(nextPlayer).toBeDefined();
    expect(getLaunchPlayerPool().some((candidate) => candidate.id === nextPlayer?.id)).toBe(true);
  });

  it("the deterministic next challenge avoids excluded, verify, incomplete, and suggestion-only players", () => {
    const playablePool = createPlayableFixturePool();
    const strictPool = [
      ...playablePool,
      { ...createFixturePlayer("excluded-next", "Nation D"), exclude: true },
      { ...createFixturePlayer("verify-next", "Nation E"), caps: "[Verify]" },
      { ...createFixturePlayer("blank-next", "Nation F"), playedAlongside: "" }
    ].filter(isPlayablePlayer);
    const nextChallengeId = getNextVersusChallengeId("abc123", strictPool);
    const nextPlayer = getVersusChallengePlayer(nextChallengeId, strictPool);
    const versusPoolIds = new Set(strictPool.map((player) => player.id));

    expect(nextPlayer).toBeDefined();
    expect(versusPoolIds.has(nextPlayer!.id)).toBe(true);
    expect(versusPoolIds).toEqual(new Set(playablePool.map((player) => player.id)));
  });

  it("the deterministic next challenge tries to avoid the same player where possible", () => {
    const currentPlayer = getVersusChallengePlayer("abc123");
    const nextPlayer = getVersusChallengePlayer(getNextVersusChallengeId("abc123"));

    if (getStableVersusPlayerPool().length > 1) {
      expect(nextPlayer?.id).not.toBe(currentPlayer?.id);
    }
  });

  it("deterministic play again does not affect daily storage", () => {
    const storage = createLocalStorageMock();
    (globalThis as { window?: unknown }).window = {
      localStorage: storage
    };

    const dailySlotsKey = getDailySlotsStorageKey("2026-06-13", "casual");
    const recentPlayersKey = getRecentPlayersStorageKey();
    storage.setItem(dailySlotsKey, JSON.stringify([{ slot: 0, playerId: "daily-player", mode: "casual", dateKey: "2026-06-13" }]));
    storage.setItem(recentPlayersKey, JSON.stringify([{ playerId: "daily-player", dateKey: "2026-06-13" }]));

    getNextVersusChallengeId("abc123");

    expect(storage.getItem(dailySlotsKey)).toBe(JSON.stringify([{ slot: 0, playerId: "daily-player", mode: "casual", dateKey: "2026-06-13" }]));
    expect(storage.getItem(recentPlayersKey)).toBe(JSON.stringify([{ playerId: "daily-player", dateKey: "2026-06-13" }]));
  });
});

describe("share helpers", () => {
  afterEach(() => {
    delete (globalThis as { navigator?: unknown }).navigator;
  });

  it("removes duplicate url text from native share payloads", () => {
    const url = "https://guessxi.app/v/abc123";
    const payload = createNativeSharePayload(`Mathew Ryan\nCan you beat me?\n${url}`, url);

    expect(payload.url).toBe(url);
    expect(payload.text).toBe("Mathew Ryan\nCan you beat me?");
  });

  it("treats share cancellation as non-fatal", async () => {
    (globalThis as { navigator?: unknown }).navigator = {
      share: async () => {
        const error = new Error("cancelled");
        error.name = "AbortError";
        throw error;
      }
    };

    await expect(shareWithFallback({ fullText: "Hello\nhttps://guessxi.app/", url: "https://guessxi.app/" })).resolves.toBe("cancelled");
  });

  it("falls back to clipboard if native share fails", async () => {
    let copied = "";
    (globalThis as { navigator?: unknown }).navigator = {
      share: async () => {
        throw new Error("share failed");
      },
      clipboard: {
        writeText: async (value: string) => {
          copied = value;
        }
      }
    };

    await expect(shareWithFallback({ fullText: "Hello\nhttps://guessxi.app/", url: "https://guessxi.app/" })).resolves.toBe("copied");
    expect(copied).toContain("https://guessxi.app/");
  });
});

function createLocalStorageMock() {
  const store = new Map<string, string>();

  return {
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    }
  };
}

function createFixturePlayer(id: string, nation: string) {
  return {
    id,
    fullName: `Player ${id}`,
    displayName: `Player ${id}`,
    searchAliases: [`Player ${id}`, id],
    acceptedAnswers: [`Player ${id}`, id],
    nationality: nation,
    nation,
    nationSlug: nation.toLowerCase().replace(/\s+/g, "-"),
    shirtNumber: 10,
    position: "Midfielder",
    club: `${nation} FC`,
    clubCountry: nation,
    age: 25,
    internationalDebut: "2024-01-01",
    caps: 12,
    internationalGoals: 2,
    nationalTeamDebutYear: 2024,
    worldCupAppearances: "First World Cup",
    careerPath: `Academy ${nation} -> ${nation} FC`,
    kitPrimaryColor: "#ffffff",
    kitSecondaryColor: "#111111",
    kitAccentColor: "#cccccc",
    clueFact: `${nation} fact`,
    playedAlongside: `${nation} teammate`,
    sources: "TEST",
    snapshotDate: "2026-06-13",
    difficultyTier: "medium" as const,
    fameTier: "National" as const
  };
}

function createPlayableFixturePool() {
  return [
    createFixturePlayer("fixture-a", "Nation A"),
    createFixturePlayer("fixture-b", "Nation B"),
    createFixturePlayer("fixture-c", "Nation C"),
    createFixturePlayer("fixture-d", "Nation D"),
    createFixturePlayer("fixture-e", "Nation E")
  ];
}
