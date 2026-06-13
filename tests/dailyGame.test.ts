import { describe, expect, it } from "vitest";
import { DAILY_GAME_LIMIT_OVERRIDES, FREE_DAILY_GAME_LIMIT, getDailyGameLimit } from "@/lib/constants";
import {
  RECENT_PLAYER_HISTORY_WINDOW_DAYS,
  createRandomGameSlots,
  getDailyGameSlots,
  getRecentPlayerIds,
  pickRandomPlayerIds,
  pruneRecentPlayerHistory,
  updateRecentPlayerHistory,
  type RecentPlayerHistoryEntry
} from "@/lib/dailyGame";
import { getLaunchPlayerPool, isPlayablePlayer, players } from "@/lib/players";
import type { Player } from "@/lib/types";

describe("daily game selection", () => {
  it("creates the default free daily slot count", () => {
    const slots = getDailyGameSlots("casual", "2026-06-09");

    expect(slots).toHaveLength(FREE_DAILY_GAME_LIMIT);
    expect(slots.every((slot) => slot.dateKey === "2026-06-09")).toBe(true);
  });

  it("uses configured daily limit overrides", () => {
    DAILY_GAME_LIMIT_OVERRIDES["2026-06-15"] = 5;

    try {
      expect(getDailyGameLimit("2026-06-14")).toBe(3);
      expect(getDailyGameLimit("2026-06-15")).toBe(5);
      expect(getDailyGameSlots("casual", "2026-06-15")).toHaveLength(5);
    } finally {
      delete DAILY_GAME_LIMIT_OVERRIDES["2026-06-15"];
    }
  });

  it("does not repeat a player within the daily slot set", () => {
    const slots = createRandomGameSlots("casual", "2026-06-09", FREE_DAILY_GAME_LIMIT, [], () => 0.42);
    const playerIds = slots.map((slot) => slot.playerId);

    expect(new Set(playerIds).size).toBe(playerIds.length);
  });

  it("selects a player from the playable pool", () => {
    const [id] = pickRandomPlayerIds(1, [], () => 0.5);

    expect(getLaunchPlayerPool().some((player) => player.id === id)).toBe(true);
  });

  it("excludes marked players and verify-placeholder rows from the playable daily pool without removing source data", () => {
    const excludedPlayer = players[0];
    const verifyPlayer = players.find((player) => player.id === "england-nico-oreilly");

    excludedPlayer.exclude = true;

    try {
      expect(players.some((item) => item.id === excludedPlayer.id)).toBe(true);
      expect(getLaunchPlayerPool().some((item) => item.id === excludedPlayer.id)).toBe(false);
      expect(pickRandomPlayerIds(players.length, [], () => 0).includes(excludedPlayer.id)).toBe(false);
      expect(verifyPlayer).toBeDefined();
      expect(isPlayablePlayer(verifyPlayer!)).toBe(false);
      expect(getLaunchPlayerPool().some((item) => item.id === verifyPlayer!.id)).toBe(false);
    } finally {
      delete excludedPlayer.exclude;
    }
  });

  it("avoids recent player history when enough alternatives exist", () => {
    const recentPlayerIds = getLaunchPlayerPool().slice(0, 30).map((player) => player.id);
    const picked = pickRandomPlayerIds(3, recentPlayerIds, () => 0.1);

    expect(picked.every((playerId) => !recentPlayerIds.includes(playerId))).toBe(true);
  });

  it("avoids consecutive same-nation players when alternatives exist", () => {
    const pool = [
      createTestPlayer("a1", "Nation A"),
      createTestPlayer("a2", "Nation A"),
      createTestPlayer("b1", "Nation B"),
      createTestPlayer("b2", "Nation B"),
      createTestPlayer("c1", "Nation C")
    ];

    const picked = pickRandomPlayerIds(5, [], () => 0.2, pool);
    const nations = picked.map((id) => pool.find((player) => player.id === id)?.nation);

    expect(nations).toHaveLength(5);
    for (let index = 1; index < nations.length; index += 1) {
      expect(nations[index]).not.toBe(nations[index - 1]);
    }
  });

  it("falls back gracefully when same-nation adjacency cannot be avoided", () => {
    const pool = [createTestPlayer("only-a1", "Nation A"), createTestPlayer("only-a2", "Nation A")];
    const picked = pickRandomPlayerIds(2, [], () => 0.3, pool);

    expect(picked).toHaveLength(2);
  });

  it("keeps recent history for a 40-day window", () => {
    const existing: RecentPlayerHistoryEntry[] = [
      { playerId: "older", dateKey: "2026-05-03" },
      { playerId: "kept", dateKey: "2026-05-05" }
    ];
    const next = updateRecentPlayerHistory(existing, ["new-player"], "2026-06-13");

    expect(RECENT_PLAYER_HISTORY_WINDOW_DAYS).toBe(40);
    expect(next.map((entry) => entry.playerId)).toEqual(["new-player", "kept"]);
  });

  it("returns recent player ids still inside the active window", () => {
    const history: RecentPlayerHistoryEntry[] = [
      { playerId: "fresh", dateKey: "2026-06-13" },
      { playerId: "recent", dateKey: "2026-05-10" },
      { playerId: "expired", dateKey: "2026-05-01" }
    ];

    expect(pruneRecentPlayerHistory(history, "2026-06-13").map((entry) => entry.playerId)).toEqual(["fresh", "recent"]);
    expect(getRecentPlayerIds(history, "2026-06-13")).toEqual(["fresh", "recent"]);
  });
});

function createTestPlayer(id: string, nation: string): Player {
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
    difficultyTier: "medium",
    fameTier: "National"
  };
}
