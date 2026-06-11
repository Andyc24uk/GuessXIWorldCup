import type { GameMode, StoredGameResult } from "./types";
import type { DailyGameSlot } from "./types";
import { createRandomGameSlots, updateRecentPlayerHistory } from "./dailyGame";
import { FREE_DAILY_GAME_LIMIT } from "./constants";

const STORAGE_PREFIX = "guess-xi-world-cup";
const RECENT_PLAYERS_KEY = `${STORAGE_PREFIX}:recent-player-ids`;

export function getGameStorageKey(dateKey: string, mode: GameMode, slot: number): string {
  return `${STORAGE_PREFIX}:${dateKey}:${mode}:${slot}`;
}

export function getDailySlotsStorageKey(dateKey: string, mode: GameMode): string {
  return `${STORAGE_PREFIX}:slots:${dateKey}:${mode}`;
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

export function loadOrCreateDailySlots(mode: GameMode, dateKey: string, limit = FREE_DAILY_GAME_LIMIT): DailyGameSlot[] {
  if (typeof window === "undefined") {
    return createRandomGameSlots(mode, dateKey, limit);
  }

  const existingSlots = loadDailySlots(dateKey, mode);
  if (existingSlots?.length) {
    return existingSlots;
  }

  const recentPlayerIds = loadRecentPlayerIds();
  const slots = createRandomGameSlots(mode, dateKey, limit, recentPlayerIds);
  saveDailySlots(dateKey, mode, slots);
  saveRecentPlayerIds(updateRecentPlayerHistory(recentPlayerIds, slots.map((slot) => slot.playerId)));
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

function loadRecentPlayerIds(): string[] {
  const raw = window.localStorage.getItem(RECENT_PLAYERS_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function saveRecentPlayerIds(playerIds: string[]): void {
  window.localStorage.setItem(RECENT_PLAYERS_KEY, JSON.stringify(playerIds));
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
