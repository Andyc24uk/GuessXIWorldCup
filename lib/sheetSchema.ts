export const PLAYER_SHEET_COLUMNS = [
  "Exclude",
  "Nation",
  "Player Name",
  "Accepted Answers",
  "Shirt Number",
  "Position",
  "Club",
  "Club Country",
  "Age",
  "International Debut",
  "Caps",
  "Goals",
  "World Cup Appearances",
  "Career Path",
  "Fact",
  "Played Alongside",
  "Sources",
  "Snapshot Date",
  "Fame Tier"
] as const;

export const OPTIONAL_PLAYER_SHEET_COLUMNS = ["Exclude"] as const;

export const PLAYER_SHEET_FIELD_MAP = {
  "Exclude": "exclude",
  "Nation": "nation",
  "Player Name": "displayName",
  "Accepted Answers": "acceptedAnswers",
  "Shirt Number": "shirtNumber",
  "Position": "position",
  "Club": "club",
  "Club Country": "clubCountry",
  "Age": "age",
  "International Debut": "internationalDebut",
  "Caps": "caps",
  "Goals": "internationalGoals",
  "World Cup Appearances": "worldCupAppearances",
  "Career Path": "careerPath",
  "Fact": "clueFact",
  "Played Alongside": "playedAlongside",
  "Sources": "sources",
  "Snapshot Date": "snapshotDate",
  "Fame Tier": "fameTier"
} as const;

export type PlayerSheetColumn = (typeof PLAYER_SHEET_COLUMNS)[number];

export type PlayerSheetField = (typeof PLAYER_SHEET_FIELD_MAP)[PlayerSheetColumn];

export type SheetRow = Record<string, unknown>;

const OPTIONAL_PLAYER_SHEET_COLUMN_SET = new Set<string>(OPTIONAL_PLAYER_SHEET_COLUMNS);

export function getRequiredPlayerSheetColumns(): PlayerSheetColumn[] {
  return PLAYER_SHEET_COLUMNS.filter((column) => !OPTIONAL_PLAYER_SHEET_COLUMN_SET.has(column));
}

export function createPlayerSheetHeaderMap(headers: readonly string[]): Map<PlayerSheetColumn, number> {
  const normalizedHeaders = headers.map((header) => header.trim());
  const headerMap = new Map<PlayerSheetColumn, number>();

  for (const column of PLAYER_SHEET_COLUMNS) {
    const index = normalizedHeaders.indexOf(column);
    if (index !== -1) {
      headerMap.set(column, index);
    }
  }

  return headerMap;
}

export function validatePlayerSheetHeaders(headers: readonly string[]): void {
  const headerMap = createPlayerSheetHeaderMap(headers);
  const missing = getRequiredPlayerSheetColumns().filter((column) => !headerMap.has(column));

  if (missing.length > 0) {
    throw new Error(`Missing required player sheet header${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}`);
  }
}

export function getPlayerSheetCell(row: readonly unknown[], headerMap: Map<PlayerSheetColumn, number>, column: PlayerSheetColumn): string {
  const index = headerMap.get(column);
  if (index === undefined) {
    return "";
  }

  const value = row[index];
  return value == null ? "" : String(value).trim();
}

export function isExcludedSheetValue(value: unknown): boolean {
  return ["x", "true", "yes"].includes(String(value ?? "").trim().toLowerCase());
}

export function mapPlayerSheetRowByHeader(row: readonly unknown[], headers: readonly string[]): SheetRow {
  validatePlayerSheetHeaders(headers);
  const headerMap = createPlayerSheetHeaderMap(headers);
  const output: SheetRow = {};

  for (const [column, field] of Object.entries(PLAYER_SHEET_FIELD_MAP) as [PlayerSheetColumn, PlayerSheetField][]) {
    if (column === "Exclude") {
      output[field] = isExcludedSheetValue(getPlayerSheetCell(row, headerMap, column));
      continue;
    }

    output[field] = getPlayerSheetCell(row, headerMap, column);
  }

  return output;
}
