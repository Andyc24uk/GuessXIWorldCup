export type GameMode = "casual" | "ultra";

export const FAME_TIERS = ["Elite", "Global", "Continental", "National"] as const;

export type FameTier = (typeof FAME_TIERS)[number];

export type ClueKey =
  | "position"
  | "worldCupAppearances"
  | "caps"
  | "internationalGoals"
  | "clubCountry"
  | "playedAlongside"
  | "club"
  | "shirtNumber"
  | "careerPath"
  | "fact"
  | "kit";

export type Player = {
  id: string;
  fullName: string;
  displayName: string;
  searchAliases: string[];
  acceptedAnswers: string[];
  nationality: string;
  nation: string;
  nationSlug: string;
  shirtNumber: number;
  position: string;
  club: string;
  clubCountry: string;
  age: number;
  internationalDebut: string;
  caps: number;
  internationalGoals: number;
  nationalTeamDebutYear: number;
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
  selectionMode?: "daily-random" | "promo";
  seedType?: "user-day" | "promo";
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
