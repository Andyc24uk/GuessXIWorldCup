import { FREE_DAILY_GAME_LIMIT, getDailyGameLimit } from "./constants";
import { getLaunchPlayerPool } from "./players";
import type { DailyGameSlot, GameMode, Player } from "./types";

export const RECENT_PLAYER_HISTORY_WINDOW_DAYS = 40;
const RECENT_PLAYER_HISTORY_MAX_ENTRIES = 400;

export type RecentPlayerHistoryEntry = {
  playerId: string;
  dateKey: string;
};

export function getLocalDateKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getDailyGameSlots(
  mode: GameMode,
  dateKey = getLocalDateKey(),
  limit = getDailyGameLimit(dateKey)
): DailyGameSlot[] {
  return createRandomGameSlots(mode, dateKey, limit);
}

export function createRandomGameSlots(
  mode: GameMode,
  dateKey = getLocalDateKey(),
  limit = getDailyGameLimit(dateKey),
  recentPlayerIds: string[] = [],
  random: () => number = Math.random,
  slotOffset = 0,
  playerPool = getLaunchPlayerPool()
): DailyGameSlot[] {
  const playerIds = pickRandomPlayerIds(limit, recentPlayerIds, random, playerPool);

  return playerIds.map((playerId, index) => ({
    slot: slotOffset + index,
    playerId,
    mode,
    dateKey,
    selectionMode: "daily-random",
    seedType: "user-day"
  }));
}

export function pickRandomPlayerIds(
  limit: number,
  recentPlayerIds: string[] = [],
  random: () => number = Math.random,
  playerPool = getLaunchPlayerPool()
): string[] {
  const players = playerPool;
  const recent = new Set(recentPlayerIds);
  const preferred = players.filter((player) => !recent.has(player.id));
  const pool = preferred.length >= limit ? preferred : players;

  return pickWithoutAdjacentNationRepeats(pool, Math.min(limit, players.length), random);
}

export function updateRecentPlayerHistory(
  existingHistory: RecentPlayerHistoryEntry[],
  newPlayerIds: string[],
  dateKey: string
): RecentPlayerHistoryEntry[] {
  const dedupedExisting = existingHistory.filter((entry) => !newPlayerIds.includes(entry.playerId));
  const nextHistory = [
    ...newPlayerIds.map((playerId) => ({ playerId, dateKey })),
    ...dedupedExisting
  ];
  return pruneRecentPlayerHistory(nextHistory, dateKey).slice(0, RECENT_PLAYER_HISTORY_MAX_ENTRIES);
}

export function pruneRecentPlayerHistory(
  entries: RecentPlayerHistoryEntry[],
  currentDateKey: string,
  windowDays = RECENT_PLAYER_HISTORY_WINDOW_DAYS
): RecentPlayerHistoryEntry[] {
  return entries.filter((entry) => getDateKeyDistance(entry.dateKey, currentDateKey) < windowDays);
}

export function getRecentPlayerIds(history: RecentPlayerHistoryEntry[], currentDateKey: string): string[] {
  return pruneRecentPlayerHistory(history, currentDateKey).map((entry) => entry.playerId);
}

function pickWithoutAdjacentNationRepeats(players: Player[], limit: number, random: () => number): string[] {
  const selectedPool = shuffle(players, random).slice(0, limit);
  const nationBuckets = new Map<string, Player[]>();
  for (const player of selectedPool) {
    const bucket = nationBuckets.get(player.nation) ?? [];
    bucket.push(player);
    nationBuckets.set(player.nation, bucket);
  }

  const selected: Player[] = [];

  while (selected.length < selectedPool.length) {
    const previousNation = selected.length > 0 ? selected[selected.length - 1].nation : undefined;
    const choices = [...nationBuckets.entries()]
      .filter(([, bucket]) => bucket.length > 0 && bucket[0] && (previousNation == null || bucket[0].nation !== previousNation));
    const fallbackChoices = [...nationBuckets.entries()].filter(([, bucket]) => bucket.length > 0);
    const candidateEntries = choices.length > 0 ? choices : fallbackChoices;
    const maxBucketSize = Math.max(...candidateEntries.map(([, bucket]) => bucket.length));
    const topCandidates = candidateEntries.filter(([, bucket]) => bucket.length === maxBucketSize);
    const [selectedNation, selectedBucket] = topCandidates[Math.floor(random() * topCandidates.length)];

    selected.push(selectedBucket.shift()!);
    if (selectedBucket.length === 0) {
      nationBuckets.delete(selectedNation);
    }
  }

  return selected.map((player) => player.id);
}

function shuffle<T>(items: T[], random: () => number): T[] {
  const output = [...items];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}

function getDateKeyDistance(leftDateKey: string, rightDateKey: string): number {
  const leftDate = parseDateKey(leftDateKey);
  const rightDate = parseDateKey(rightDateKey);
  const millisecondsPerDay = 24 * 60 * 60 * 1000;

  return Math.abs(Math.round((rightDate.getTime() - leftDate.getTime()) / millisecondsPerDay));
}

function parseDateKey(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00Z`);
}
