import { LAUNCH_GAME_MODE } from "./constants";
import { getLaunchPlayerPool } from "./players";
import type { DailyGameSlot, Player } from "./types";

const DEFAULT_BASE_URL = "https://guessxi.app";
const CHALLENGE_ID_LENGTH = 6;
const CHALLENGE_ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

export function createVersusChallengeId(random: () => number = Math.random, length = CHALLENGE_ID_LENGTH): string {
  let output = "";

  for (let index = 0; index < length; index += 1) {
    output += CHALLENGE_ALPHABET[Math.floor(random() * CHALLENGE_ALPHABET.length)];
  }

  return output;
}

export function createFreshVersusChallengeId(currentPlayerId?: string, random: () => number = Math.random): string {
  let fallbackId = createVersusChallengeId(random);

  if (!currentPlayerId) {
    return fallbackId;
  }

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const nextId = attempt === 0 ? fallbackId : createVersusChallengeId(random);
    const nextPlayer = getVersusChallengePlayer(nextId);
    fallbackId = nextId;

    if (nextPlayer && nextPlayer.id !== currentPlayerId) {
      return nextId;
    }
  }

  return fallbackId;
}

export function getNextVersusChallengeId(currentChallengeId: string, pool = getStableVersusPlayerPool()): string {
  const normalizedCurrentId = normalizeChallengeId(currentChallengeId);
  const currentPlayerId = getVersusChallengePlayer(normalizedCurrentId, pool)?.id;
  let fallbackId = createDeterministicChallengeId(`${normalizedCurrentId}:next:0`);

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const nextId = createDeterministicChallengeId(`${normalizedCurrentId}:next:${attempt}`);
    const nextPlayer = getVersusChallengePlayer(nextId, pool);
    fallbackId = nextId;

    if (!currentPlayerId || !nextPlayer || nextPlayer.id !== currentPlayerId) {
      return nextId;
    }
  }

  return fallbackId;
}

export function getVersusChallengePlayer(challengeId: string, pool = getStableVersusPlayerPool()): Player | undefined {
  if (!pool.length) {
    return undefined;
  }

  const normalizedId = normalizeChallengeId(challengeId);
  const seed = hashChallengeId(normalizedId);
  return pool[seed % pool.length];
}

export function getStableVersusPlayerPool(): Player[] {
  return [...getLaunchPlayerPool()].sort((left, right) => left.id.localeCompare(right.id));
}

export function createVersusSlot(challengeId: string): DailyGameSlot | null {
  const player = getVersusChallengePlayer(challengeId);
  if (!player) {
    return null;
  }

  return {
    slot: 0,
    playerId: player.id,
    mode: LAUNCH_GAME_MODE,
    dateKey: `versus:${normalizeChallengeId(challengeId)}`,
    selectionMode: "versus",
    seedType: "versus"
  };
}

export function getVersusChallengeUrl(challengeId: string, baseUrl = DEFAULT_BASE_URL): string {
  const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
  return `${normalizedBaseUrl}/v/${normalizeChallengeId(challengeId)}`;
}

export function createVersusShareText(
  playerName: string,
  solved: boolean,
  cluesUsed: number,
  challengeUrl: string,
  clueCount = 11
): string {
  const normalizedCluesUsed = Math.max(0, Math.min(cluesUsed, clueCount));
  const symbols = Array.from({ length: clueCount }, (_, index) => (index < normalizedCluesUsed ? "⚽" : "⚪️")).join(" ");

  if (solved) {
    return `${playerName}\n${symbols}\nI got it in ${normalizedCluesUsed} clue${normalizedCluesUsed === 1 ? "" : "s"} in Guess XI Versus Mode.\nCan you beat me?\n${challengeUrl}`;
  }

  return `${playerName}\n${Array.from({ length: clueCount }, () => "⚽").join(" ")}\nI was stumped in Guess XI Versus Mode.\nCan you do better?\n${challengeUrl}`;
}

export function normalizeChallengeId(challengeId: string): string {
  return challengeId.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function hashChallengeId(value: string): number {
  let hash = 0;

  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }

  return hash;
}

function createDeterministicChallengeId(seedValue: string, length = CHALLENGE_ID_LENGTH): string {
  let seed = hashChallengeId(seedValue) || 1;
  let output = "";

  for (let index = 0; index < length; index += 1) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    output += CHALLENGE_ALPHABET[seed % CHALLENGE_ALPHABET.length];
  }

  return output;
}
