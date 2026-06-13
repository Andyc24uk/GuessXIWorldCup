import { afterEach, describe, expect, it } from "vitest";
import { createInitialStoredGame, getDailySlotsStorageKey, getRecentPlayersStorageKey, saveStoredGame } from "@/lib/storage";
import { getLaunchPlayerPool, players } from "@/lib/players";
import {
  createVersusShareText,
  createVersusSlot,
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

  it("can resolve different challenge ids to different players", () => {
    const first = getVersusChallengePlayer("abc123");
    const second = getVersusChallengePlayer("def456");

    expect(first).toBeDefined();
    expect(second).toBeDefined();
    expect(getStableVersusPlayerPool().length).toBeGreaterThan(1);
    expect(first?.id).not.toBe(second?.id);
  });

  it("selects versus players only from the strict playable pool", () => {
    const slot = createVersusSlot("abc123");
    const player = getVersusChallengePlayer("abc123");

    expect(slot?.selectionMode).toBe("versus");
    expect(slot?.seedType).toBe("versus");
    expect(player).toBeDefined();
    expect(getLaunchPlayerPool().some((candidate) => candidate.id === player?.id)).toBe(true);
  });

  it("does not select excluded, verify, or suggestion-only players", () => {
    const versusPoolIds = new Set(getStableVersusPlayerPool().map((player) => player.id));

    expect(versusPoolIds.has("england-nico-oreilly")).toBe(false);

    const excludedPlayer = players[0];
    excludedPlayer.exclude = true;
    try {
      expect(getStableVersusPlayerPool().some((player) => player.id === excludedPlayer.id)).toBe(false);
    } finally {
      delete excludedPlayer.exclude;
    }
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
