import { players } from "./players";
import { getCareerPathOverride, getNotableFactOverride } from "./playerClueOverrides";
import type { Clue, ClueKey, GameMode, Player, StoredGameResult } from "./types";

export const CASUAL_CLUE_ORDER: ClueKey[] = [
  "position",
  "worldCupAppearances",
  "caps",
  "internationalGoals",
  "clubCountry",
  "playedAlongside",
  "club",
  "shirtNumber",
  "careerPath",
  "fact",
  "kit"
];

export const ULTRA_CLUE_ORDER: ClueKey[] = [
  "fact",
  "playedAlongside",
  "worldCupAppearances",
  "clubCountry",
  "club",
  "caps",
  "internationalGoals",
  "position",
  "shirtNumber",
  "careerPath",
  "kit"
];

export const LAUNCH_CLUE_ORDER: ClueKey[] = [
  "position",
  "worldCupAppearances",
  "caps",
  "internationalGoals",
  "clubCountry",
  "playedAlongside",
  "club",
  "shirtNumber",
  "careerPath",
  "fact",
  "kit"
];

export function getClueOrder(mode: GameMode, seed?: string, randomizeUltra = false): ClueKey[] {
  const baseOrder = mode === "casual" ? CASUAL_CLUE_ORDER : ULTRA_CLUE_ORDER;
  if (mode !== "ultra" || !randomizeUltra || !seed) {
    return [...baseOrder];
  }

  return enforceClubDependency(seededShuffle(baseOrder, seed));
}

export function getStructuredClueOrder(): ClueKey[] {
  return [...LAUNCH_CLUE_ORDER];
}

export function getRandomizedClueOrder(seed: string): ClueKey[] {
  return enforceClubDependency(seededShuffle(LAUNCH_CLUE_ORDER, seed));
}

export function enforceClubDependency(order: ClueKey[]): ClueKey[] {
  const withoutClub: ClueKey[] = order.filter((key) => key !== "club");
  const countryIndex = withoutClub.indexOf("clubCountry");
  const insertIndex = countryIndex === -1 ? withoutClub.length : countryIndex + 1;
  withoutClub.splice(insertIndex, 0, "club");
  return withoutClub;
}

export function buildClues(player: Player, mode: GameMode, seed?: string, randomizeUltra = false): Clue[] {
  const order = mode === "casual" ? getStructuredClueOrder() : getClueOrder(mode, seed, randomizeUltra);
  return order
    .map((key) => ({
      key,
      label: getClueLabel(key),
      value: getClueValue(player, key)
    }))
    .filter((clue) => Boolean(clue.value));
}

export function getClueLabel(key: ClueKey): string {
  const labels: Record<ClueKey, string> = {
    kit: "Kit reveal",
    shirtNumber: "Shirt number",
    position: "Position",
    clubCountry: "Club country",
    club: "Club team",
    caps: "International caps",
    internationalGoals: "International goals",
    worldCupAppearances: "World Cup appearances",
    playedAlongside: "Played alongside",
    careerPath: "Career Path",
    fact: "Notable fact"
  };
  return labels[key];
}

export function getClueValue(player: Player, key: ClueKey): string {
  switch (key) {
    case "kit":
      return "Kit image revealed";
    case "shirtNumber":
      return `No. ${player.shirtNumber}`;
    case "careerPath":
      return getCareerPath(player);
    case "position":
      return player.position;
    case "clubCountry":
      return player.clubCountry;
    case "club":
      return player.club;
    case "caps":
      return player.caps ? `${player.caps} senior caps` : "";
    case "internationalGoals":
      return `${player.internationalGoals} international goal${player.internationalGoals === 1 ? "" : "s"}`;
    case "worldCupAppearances":
      return player.worldCupAppearances;
    case "playedAlongside":
      return player.playedAlongside;
    case "fact":
      return getNotableFact(player);
  }
}

export function getCareerPath(player: Player): string {
  const override = getCareerPathOverride(player);
  if (override) {
    return formatCareerPath(override);
  }

  if (player.careerPath?.trim()) {
    return formatCareerPath(player.careerPath.trim());
  }

  if (player.careerHint?.trim()) {
    return formatCareerPath(player.careerHint.trim());
  }

  if (player.club) {
    return `Current club: ${player.club}`;
  }

  return "Career path unavailable";
}

export function getNotableFact(player: Player): string {
  return getNotableFactOverride(player) ?? player.clueFact;
}

function formatCareerPath(path: string): string {
  return path.replace(/\s+->\s+/g, " → ");
}

export function normalizeGuess(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function isCorrectGuess(input: string, player: Player): boolean {
  const guess = normalizeGuess(input);
  if (!guess) {
    return false;
  }

  const accepted = getAcceptedGuessValues(player);
  return accepted.some((name) => guess === name);
}

export function getAcceptedGuessValues(player: Player): string[] {
  const sourceNames = [player.fullName, player.displayName, ...(player.searchAliases ?? []), ...(player.acceptedAnswers ?? [])];
  const accepted = new Set<string>();

  for (const sourceName of sourceNames) {
    const normalizedName = normalizeGuess(sourceName);
    if (!normalizedName) {
      continue;
    }

    accepted.add(normalizedName);
    for (const fragment of getGuessFragments(normalizedName)) {
      accepted.add(fragment);
    }
  }

  return [...accepted];
}

export function searchPlayers(query: string): Player[] {
  const normalized = normalizeGuess(query);
  if (!normalized) {
    return players.slice(0, 8);
  }

  return players
    .filter((player) => {
      const haystack = [player.fullName, player.displayName, ...player.searchAliases]
        .map(normalizeGuess)
        .join(" ");
      return haystack.includes(normalized);
    })
    .slice(0, 8);
}

const IGNORED_NAME_PARTS = new Set([
  "al",
  "bin",
  "da",
  "de",
  "del",
  "di",
  "dos",
  "el",
  "ibn",
  "jr",
  "junior",
  "la",
  "le",
  "van",
  "von"
]);

function getGuessFragments(normalizedName: string): string[] {
  return normalizedName
    .split(/[\s-]+/)
    .filter((part) => part.length >= 3 && !IGNORED_NAME_PARTS.has(part));
}

export function createShareText(mode: GameMode, solved: boolean, cluesUsed: number): string {
  const result = solved ? `Guessed in ${cluesUsed} clue${cluesUsed === 1 ? "" : "s"}` : "Stumped today";
  return `Guess XI: World Cup - ${result}`;
}

export function applyGuessToGame(
  current: StoredGameResult,
  guess: string,
  player: Player,
  clueCount: number,
  completedAt = new Date().toISOString()
): StoredGameResult {
  const solved = isCorrectGuess(guess, player);
  const nextGuesses = [...current.guesses, guess];
  const cluesVisibleAtGuess = Math.min(current.revealedCount, clueCount);
  const finalGuessMissed = !solved && current.revealedCount >= clueCount;
  const completed = solved || finalGuessMissed;
  const nextRevealedCount = completed ? clueCount : Math.min(current.revealedCount + 1, clueCount);

  return {
    ...current,
    guesses: nextGuesses,
    revealedCount: nextRevealedCount,
    completed,
    solved,
    solvedClueCount: solved ? cluesVisibleAtGuess : current.solvedClueCount,
    completedAt: completed ? completedAt : current.completedAt
  };
}

function seededShuffle<T>(items: T[], seed: string): T[] {
  const output = [...items];
  let state = hashSeed(seed);
  for (let index = output.length - 1; index > 0; index -= 1) {
    state = mulberry32(state);
    const swapIndex = Math.floor(state * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}

function hashSeed(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): number {
  let next = seed + 0x6d2b79f5;
  next = Math.imul(next ^ (next >>> 15), next | 1);
  next ^= next + Math.imul(next ^ (next >>> 7), next | 61);
  return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
}
