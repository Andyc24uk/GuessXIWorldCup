import { FREE_DAILY_GAME_LIMIT } from "./constants";
import { getLaunchPlayerPool } from "./players";
import type { DailyGameSlot, GameMode } from "./types";

const RECENT_PLAYER_HISTORY_LIMIT = 30;

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDailyGameSlots(
  mode: GameMode,
  dateKey = getLocalDateKey(),
  limit = FREE_DAILY_GAME_LIMIT
): DailyGameSlot[] {
  return createRandomGameSlots(mode, dateKey, limit);
}

export function createRandomGameSlots(
  mode: GameMode,
  dateKey = getLocalDateKey(),
  limit = FREE_DAILY_GAME_LIMIT,
  recentPlayerIds: string[] = [],
  random: () => number = Math.random
): DailyGameSlot[] {
  const playerIds = pickRandomPlayerIds(limit, recentPlayerIds, random);

  return playerIds.map((playerId, index) => ({
    slot: index,
    playerId,
    mode,
    dateKey,
    selectionMode: "daily-random",
    seedType: "user-day"
  }));
}

export function pickRandomPlayerIds(limit: number, recentPlayerIds: string[] = [], random: () => number = Math.random): string[] {
  const players = getLaunchPlayerPool();
  const recent = new Set(recentPlayerIds);
  const available = players.map((player) => player.id);
  const preferred = available.filter((playerId) => !recent.has(playerId));
  const pool = preferred.length >= limit ? preferred : available;
  const shuffled = shuffle(pool, random);

  return shuffled.slice(0, Math.min(limit, available.length));
}

export function updateRecentPlayerHistory(existingHistory: string[], newPlayerIds: string[]): string[] {
  return [...newPlayerIds, ...existingHistory.filter((playerId) => !newPlayerIds.includes(playerId))].slice(0, RECENT_PLAYER_HISTORY_LIMIT);
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const output = [...items];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}
