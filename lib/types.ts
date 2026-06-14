export type GameMode = "casual" | "ultra";

export const FAME_TIERS = ["Elite", "Global", "Continental", "National"] as const;

export type FameTier = (typeof FAME_TIERS)[number];
export type PlayerScalar = string | number;

export type ClueKey =
  | "position"
  | "worldCupAppearances"
  | "clubCountry"
  | "playedAlongside"
  | "caps"
  | "club"
  | "shirtNumber"
  | "careerPath"
  | "internationalGoals"
  | "fact"
  | "kit";

export type Player = {
  id: string;
  slug?: string;
  exclude?: boolean;
  fullName: string;
  displayName: string;
  searchAliases: string[];
  acceptedAnswers: string[];
  nationality: string;
  nation: string;
  nationSlug: string;
  shirtNumber: PlayerScalar;
  position: string;
  club: string;
  clubCountry: string;
  age: PlayerScalar;
  internationalDebut: string;
  caps: PlayerScalar;
  internationalGoals: PlayerScalar;
  internationalCleanSheets?: PlayerScalar;
  nationalTeamDebutYear: PlayerScalar;
  worldCupAppearances: string;
  careerPath?: string;
  careerHint?: string;
  kitPrimaryColor: string;
  kitSecondaryColor: string;
  kitAccentColor: string;
  clueFact: string;
  playedAlongside: string;
  sources: string;
  snapshotDate: string;
  difficultyTier: "easy" | "medium" | "hard";
  fameTier: FameTier;
};

export type GuessOption = {
  id: string;
  displayName: string;
  acceptedAnswers: string[];
  playablePlayerId?: string;
  suggestionOnly?: boolean;
};

export type Clue = {
  key: ClueKey;
  label: string;
  value: string;
};

export type DailyGameSlot = {
  slot: number;
  playerId: string;
  mode: GameMode;
  dateKey: string;
  isPromo?: boolean;
  selectionMode?: "daily-random" | "promo" | "versus";
  seedType?: "user-day" | "promo" | "versus";
};

export type StoredGameResult = {
  dateKey: string;
  mode: GameMode;
  slot: number;
  playerId: string;
  completed: boolean;
  solved: boolean;
  guesses: string[];
  revealedCount: number;
  solvedClueCount?: number;
  completedAt?: string;
};
