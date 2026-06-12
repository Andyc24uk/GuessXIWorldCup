import { players } from "./players";
import { normalizeGuess } from "./gameLogic";
import type { GuessOption, Player } from "./types";

const SUGGESTION_LIMIT = 8;

// Names here can appear in autocomplete without ever becoming answer candidates.
// Keep this list generic and data-only; answer validation still checks only the active player.
export const suggestionOnlyGuessOptions: GuessOption[] = [
  createSuggestionOnlyGuessOption("zinedine-zidane", "Zinedine Zidane", ["Zidane"]),
  createSuggestionOnlyGuessOption("ronaldinho", "Ronaldinho", ["Ronaldo de Assis Moreira"]),
  createSuggestionOnlyGuessOption("andres-iniesta", "Andrés Iniesta", ["Andres Iniesta", "Iniesta"]),
  createSuggestionOnlyGuessOption("xavi", "Xavi", ["Xavi Hernández", "Xavi Hernandez"]),
  createSuggestionOnlyGuessOption("gianluigi-buffon", "Gianluigi Buffon", ["Buffon"]),
  createSuggestionOnlyGuessOption("thierry-henry", "Thierry Henry", ["Henry"]),
  createSuggestionOnlyGuessOption("luis-suarez", "Luis Suárez", ["Luis Suarez", "Suarez"]),
  createSuggestionOnlyGuessOption("eden-hazard", "Eden Hazard", ["Hazard"]),
  createSuggestionOnlyGuessOption("neymar", "Neymar", ["Neymar Jr", "Neymar da Silva Santos Junior"]),
  createSuggestionOnlyGuessOption("karim-benzema", "Karim Benzema", ["Benzema"])
];

export const guessOptions: GuessOption[] = dedupeGuessOptions([...players.map(createGuessOptionFromPlayer), ...suggestionOnlyGuessOptions]);

export function createGuessOptionFromPlayer(player: Player): GuessOption {
  return {
    id: `player:${player.id}`,
    displayName: player.displayName,
    acceptedAnswers: getUniqueNames([player.fullName, player.displayName, ...(player.searchAliases ?? []), ...(player.acceptedAnswers ?? [])]),
    playablePlayerId: player.exclude ? undefined : player.id,
    suggestionOnly: player.exclude === true
  };
}

export function searchGuessOptions(query: string): GuessOption[] {
  const normalized = normalizeGuess(query);
  if (!normalized) {
    return guessOptions.slice(0, SUGGESTION_LIMIT);
  }

  return guessOptions
    .filter((option) => {
      const haystack = [option.displayName, ...option.acceptedAnswers].map(normalizeGuess).join(" ");
      return haystack.includes(normalized);
    })
    .slice(0, SUGGESTION_LIMIT);
}

function createSuggestionOnlyGuessOption(id: string, displayName: string, aliases: string[] = []): GuessOption {
  return {
    id: `suggestion:${id}`,
    displayName,
    acceptedAnswers: getUniqueNames([displayName, ...aliases]),
    suggestionOnly: true
  };
}

function dedupeGuessOptions(options: GuessOption[]): GuessOption[] {
  const seen = new Set<string>();
  return options.filter((option) => {
    const key = normalizeGuess(option.displayName);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function getUniqueNames(values: string[]): string[] {
  const names = new Map<string, string>();
  for (const value of values) {
    const normalized = normalizeGuess(value);
    if (normalized) {
      names.set(normalized, value);
    }
  }
  return [...names.values()];
}
