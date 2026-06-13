import type { GameMode, StoredGameResult } from "./types";
import type { DailyGameSlot } from "./types";
import { createRandomGameSlots, getRecentPlayerIds, type RecentPlayerHistoryEntry, updateRecentPlayerHistory } from "./dailyGame";
import { getDailyGameLimit } from "./constants";

const STORAGE_PREFIX = "guess-xi-world-cup";
const RECENT_PLAYERS_KEY = `${STORAGE_PREFIX}:recent-player-ids`;

export function getGameStorageKey(dateKey: string, mode: GameMode, slot: number): string {
  return `${STORAGE_PREFIX}:${dateKey}:${mode}:${slot}`;
}

export function getDailySlotsStorageKey(dateKey: string, mode: GameMode): string {
  return `${STORAGE_PREFIX}:slots:${dateKey}:${mode}`;
}

export function getRecentPlayersStorageKey(): string {
  return RECENT_PLAYERS_KEY;
}

export function loadStoredGame(dateKey: string, mode: GameMode, slot: number): StoredGameResult | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(getGameStorageKey(dateKey, mode, slot));
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as StoredGameResult;
    return parsed.playerId ? parsed : null;
  } catch {
    return null;
  }
}

export function saveStoredGame(result: StoredGameResult): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(getGameStorageKey(result.dateKey, result.mode, result.slot), JSON.stringify(result));
}

export function loadOrCreateDailySlots(mode: GameMode, dateKey: string, limit = getDailyGameLimit(dateKey)): DailyGameSlot[] {
  if (typeof window === "undefined") {
    return createRandomGameSlots(mode, dateKey, limit);
  }

  const existingSlots = loadDailySlots(dateKey, mode);
  if (existingSlots?.length && existingSlots.length >= limit) {
    return existingSlots;
  }

  const existingPlayerIds = existingSlots?.map((slot) => slot.playerId) ?? [];
  const recentHistory = loadRecentPlayerHistory(dateKey);
  const recentPlayerIds = getRecentPlayerIds(recentHistory, dateKey);
  const combinedRecentIds = [...new Set([...existingPlayerIds, ...recentPlayerIds])];
  const missingSlotCount = Math.max(0, limit - existingPlayerIds.length);
  const newSlots = missingSlotCount > 0
    ? createRandomGameSlots(mode, dateKey, missingSlotCount, combinedRecentIds, Math.random, existingPlayerIds.length)
    : [];
  const slots = [...(existingSlots ?? []), ...newSlots];

  saveDailySlots(dateKey, mode, slots);
  saveRecentPlayerHistory(updateRecentPlayerHistory(recentHistory, newSlots.map((slot) => slot.playerId), dateKey));
  return slots;
}

function loadDailySlots(dateKey: string, mode: GameMode): DailyGameSlot[] | null {
  const raw = window.localStorage.getItem(getDailySlotsStorageKey(dateKey, mode));
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as DailyGameSlot[];
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function saveDailySlots(dateKey: string, mode: GameMode, slots: DailyGameSlot[]): void {
  window.localStorage.setItem(getDailySlotsStorageKey(dateKey, mode), JSON.stringify(slots));
}

function loadRecentPlayerHistory(currentDateKey: string): RecentPlayerHistoryEntry[] {
  const raw = window.localStorage.getItem(RECENT_PLAYERS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    if (parsed.every((item) => typeof item === "string")) {
      return parsed.map((playerId) => ({ playerId, dateKey: currentDateKey }));
    }

    return parsed.filter(
      (item): item is RecentPlayerHistoryEntry =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof item.playerId === "string" &&
        typeof item.dateKey === "string"
    );
  } catch {
    return [];
  }
}

function saveRecentPlayerHistory(history: RecentPlayerHistoryEntry[]): void {
  window.localStorage.setItem(RECENT_PLAYERS_KEY, JSON.stringify(history));
}

export function createInitialStoredGame(
  dateKey: string,
  mode: GameMode,
  slot: number,
  playerId: string
): StoredGameResult {
  return {
    dateKey,
    mode,
    slot,
    playerId,
    completed: false,
    solved: false,
    guesses: [],
    revealedCount: 1
  };
}
