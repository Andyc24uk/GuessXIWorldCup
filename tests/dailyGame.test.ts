import { describe, expect, it } from "vitest";
import { FREE_DAILY_GAME_LIMIT } from "@/lib/constants";
import { createRandomGameSlots, getDailyGameSlots, pickRandomPlayerIds, updateRecentPlayerHistory } from "@/lib/dailyGame";
import { players } from "@/lib/players";

describe("daily game selection", () => {
  it("creates three free daily slots", () => {
    const slots = getDailyGameSlots("casual", "2026-06-09");

    expect(slots).toHaveLength(FREE_DAILY_GAME_LIMIT);
    expect(slots.every((slot) => slot.dateKey === "2026-06-09")).toBe(true);
  });

  it("does not repeat a player within the three daily slots", () => {
    const slots = createRandomGameSlots("casual", "2026-06-09", FREE_DAILY_GAME_LIMIT, [], () => 0.42);
    const playerIds = slots.map((slot) => slot.playerId);

    expect(new Set(playerIds).size).toBe(playerIds.length);
  });

  it("selects a player from the seed pool", () => {
    const [id] = pickRandomPlayerIds(1, [], () => 0.5);

    expect(players.some((player) => player.id === id)).toBe(true);
  });

  it("avoids recent player history when enough alternatives exist", () => {
    const recentPlayerIds = players.slice(0, 30).map((player) => player.id);
    const picked = pickRandomPlayerIds(3, recentPlayerIds, () => 0.1);

    expect(picked.every((playerId) => !recentPlayerIds.includes(playerId))).toBe(true);
  });

  it("keeps only the 30 most recent player ids", () => {
    const existing = players.slice(0, 30).map((player) => player.id);
    const next = players.slice(30, 33).map((player) => player.id);
    const history = updateRecentPlayerHistory(existing, next);

    expect(history).toHaveLength(30);
    expect(history.slice(0, 3)).toEqual(next);
  });
});
