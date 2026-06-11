import type { Player } from "./types";

export type KitPatternType =
  | "plain"
  | "vertical-stripes"
  | "center-stripe"
  | "side-panels"
  | "sleeve-trim"
  | "chest-band"
  | "subtle-gradient";

export type KitCollarType = "crew" | "v-neck" | "foldover";
export type KitTrimStyle = "minimal" | "sleeve-cuffs" | "shoulder-lines" | "collar-and-cuffs";

export type NationKitConfig = {
  nation: string;
  baseColor: string;
  secondaryColor: string;
  accentColor: string;
  patternType: KitPatternType;
  collarType: KitCollarType;
  trimStyle: KitTrimStyle;
};

export const SUPPORTED_KIT_PATTERN_TYPES: KitPatternType[] = [
  "plain",
  "vertical-stripes",
  "center-stripe",
  "side-panels",
  "sleeve-trim",
  "chest-band",
  "subtle-gradient"
];

export const SUPPORTED_KIT_COLLAR_TYPES: KitCollarType[] = ["crew", "v-neck", "foldover"];
export const SUPPORTED_KIT_TRIM_STYLES: KitTrimStyle[] = ["minimal", "sleeve-cuffs", "shoulder-lines", "collar-and-cuffs"];

export const nationKitConfigs: NationKitConfig[] = [
  {
    nation: "Algeria",
    baseColor: "#f8f8f2",
    secondaryColor: "#087b43",
    accentColor: "#c6293e",
    patternType: "sleeve-trim",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Argentina",
    baseColor: "#f8fbff",
    secondaryColor: "#85c9ee",
    accentColor: "#d8a728",
    patternType: "vertical-stripes",
    collarType: "crew",
    trimStyle: "minimal"
  },
  {
    nation: "Australia",
    baseColor: "#f7d117",
    secondaryColor: "#006747",
    accentColor: "#ffffff",
    patternType: "sleeve-trim",
    collarType: "v-neck",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Austria",
    baseColor: "#d92734",
    secondaryColor: "#ffffff",
    accentColor: "#8f1720",
    patternType: "chest-band",
    collarType: "crew",
    trimStyle: "sleeve-cuffs"
  },
  {
    nation: "Belgium",
    baseColor: "#c8172f",
    secondaryColor: "#111111",
    accentColor: "#f2c230",
    patternType: "subtle-gradient",
    collarType: "v-neck",
    trimStyle: "shoulder-lines"
  },
  {
    nation: "Bosnia and Herzegovina",
    baseColor: "#17479e",
    secondaryColor: "#f2c230",
    accentColor: "#ffffff",
    patternType: "side-panels",
    collarType: "crew",
    trimStyle: "shoulder-lines"
  },
  {
    nation: "England",
    baseColor: "#f7f7f2",
    secondaryColor: "#14213d",
    accentColor: "#c83e4d",
    patternType: "sleeve-trim",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Brazil",
    baseColor: "#f4d23c",
    secondaryColor: "#178a4b",
    accentColor: "#1f4aa8",
    patternType: "sleeve-trim",
    collarType: "v-neck",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Canada",
    baseColor: "#d92734",
    secondaryColor: "#ffffff",
    accentColor: "#8b111d",
    patternType: "side-panels",
    collarType: "crew",
    trimStyle: "sleeve-cuffs"
  },
  {
    nation: "Cape Verde",
    baseColor: "#2455a4",
    secondaryColor: "#ffffff",
    accentColor: "#d33f38",
    patternType: "chest-band",
    collarType: "crew",
    trimStyle: "sleeve-cuffs"
  },
  {
    nation: "Colombia",
    baseColor: "#f4cf2f",
    secondaryColor: "#1f4e9d",
    accentColor: "#c92035",
    patternType: "chest-band",
    collarType: "v-neck",
    trimStyle: "sleeve-cuffs"
  },
  {
    nation: "Croatia",
    baseColor: "#ffffff",
    secondaryColor: "#d8202f",
    accentColor: "#1f3f8b",
    patternType: "chest-band",
    collarType: "crew",
    trimStyle: "shoulder-lines"
  },
  {
    nation: "Curacao",
    baseColor: "#1d62b7",
    secondaryColor: "#f2c230",
    accentColor: "#ffffff",
    patternType: "center-stripe",
    collarType: "crew",
    trimStyle: "minimal"
  },
  {
    nation: "Czechia",
    baseColor: "#d92734",
    secondaryColor: "#2455a4",
    accentColor: "#ffffff",
    patternType: "side-panels",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "DR Congo",
    baseColor: "#1d8bd2",
    secondaryColor: "#f2c230",
    accentColor: "#d92734",
    patternType: "center-stripe",
    collarType: "v-neck",
    trimStyle: "minimal"
  },
  {
    nation: "Ecuador",
    baseColor: "#f4cf2f",
    secondaryColor: "#1f4e9d",
    accentColor: "#d92734",
    patternType: "sleeve-trim",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Egypt",
    baseColor: "#c8172f",
    secondaryColor: "#ffffff",
    accentColor: "#111111",
    patternType: "sleeve-trim",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "France",
    baseColor: "#163d8f",
    secondaryColor: "#ffffff",
    accentColor: "#e23b4b",
    patternType: "side-panels",
    collarType: "foldover",
    trimStyle: "sleeve-cuffs"
  },
  {
    nation: "Germany",
    baseColor: "#f8f8f2",
    secondaryColor: "#101010",
    accentColor: "#d7ae34",
    patternType: "center-stripe",
    collarType: "crew",
    trimStyle: "shoulder-lines"
  },
  {
    nation: "Ghana",
    baseColor: "#f8f8f2",
    secondaryColor: "#111111",
    accentColor: "#f2c230",
    patternType: "center-stripe",
    collarType: "crew",
    trimStyle: "minimal"
  },
  {
    nation: "Haiti",
    baseColor: "#1f4e9d",
    secondaryColor: "#d92734",
    accentColor: "#ffffff",
    patternType: "chest-band",
    collarType: "crew",
    trimStyle: "sleeve-cuffs"
  },
  {
    nation: "Iran",
    baseColor: "#f8f8f2",
    secondaryColor: "#0b8f55",
    accentColor: "#c6293e",
    patternType: "side-panels",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Iraq",
    baseColor: "#147a45",
    secondaryColor: "#ffffff",
    accentColor: "#c6293e",
    patternType: "sleeve-trim",
    collarType: "v-neck",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Ivory Coast",
    baseColor: "#ef7d24",
    secondaryColor: "#188a4f",
    accentColor: "#ffffff",
    patternType: "side-panels",
    collarType: "crew",
    trimStyle: "sleeve-cuffs"
  },
  {
    nation: "Japan",
    baseColor: "#2447a8",
    secondaryColor: "#ffffff",
    accentColor: "#dc2f45",
    patternType: "subtle-gradient",
    collarType: "foldover",
    trimStyle: "shoulder-lines"
  },
  {
    nation: "Jordan",
    baseColor: "#f8f8f2",
    secondaryColor: "#d92734",
    accentColor: "#111111",
    patternType: "side-panels",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Mexico",
    baseColor: "#0b7d45",
    secondaryColor: "#ffffff",
    accentColor: "#c7362f",
    patternType: "center-stripe",
    collarType: "v-neck",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Morocco",
    baseColor: "#c8102e",
    secondaryColor: "#006233",
    accentColor: "#ffffff",
    patternType: "sleeve-trim",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Netherlands",
    baseColor: "#f36c21",
    secondaryColor: "#101010",
    accentColor: "#ffffff",
    patternType: "subtle-gradient",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "New Zealand",
    baseColor: "#f8f8f2",
    secondaryColor: "#111111",
    accentColor: "#cfd8dc",
    patternType: "sleeve-trim",
    collarType: "foldover",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Norway",
    baseColor: "#d92734",
    secondaryColor: "#1f3f8b",
    accentColor: "#ffffff",
    patternType: "center-stripe",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Panama",
    baseColor: "#d92734",
    secondaryColor: "#ffffff",
    accentColor: "#1f4e9d",
    patternType: "sleeve-trim",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Paraguay",
    baseColor: "#ffffff",
    secondaryColor: "#d92734",
    accentColor: "#1f4e9d",
    patternType: "vertical-stripes",
    collarType: "crew",
    trimStyle: "minimal"
  },
  {
    nation: "Portugal",
    baseColor: "#b70f2a",
    secondaryColor: "#0c7a43",
    accentColor: "#f0c642",
    patternType: "side-panels",
    collarType: "crew",
    trimStyle: "sleeve-cuffs"
  },
  {
    nation: "Qatar",
    baseColor: "#7a1432",
    secondaryColor: "#ffffff",
    accentColor: "#d7b6c1",
    patternType: "side-panels",
    collarType: "v-neck",
    trimStyle: "minimal"
  },
  {
    nation: "Saudi Arabia",
    baseColor: "#0b7d45",
    secondaryColor: "#ffffff",
    accentColor: "#d8eadf",
    patternType: "plain",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Scotland",
    baseColor: "#193c8f",
    secondaryColor: "#ffffff",
    accentColor: "#6bb6ff",
    patternType: "subtle-gradient",
    collarType: "foldover",
    trimStyle: "sleeve-cuffs"
  },
  {
    nation: "Senegal",
    baseColor: "#f8f8f2",
    secondaryColor: "#0b8f55",
    accentColor: "#f2c230",
    patternType: "center-stripe",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "South Africa",
    baseColor: "#f4d23c",
    secondaryColor: "#0b7d45",
    accentColor: "#111111",
    patternType: "side-panels",
    collarType: "v-neck",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "South Korea",
    baseColor: "#df2438",
    secondaryColor: "#ffffff",
    accentColor: "#111827",
    patternType: "sleeve-trim",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Spain",
    baseColor: "#c81e2b",
    secondaryColor: "#f2c230",
    accentColor: "#233f8f",
    patternType: "sleeve-trim",
    collarType: "v-neck",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Sweden",
    baseColor: "#f2c230",
    secondaryColor: "#1f4e9d",
    accentColor: "#ffffff",
    patternType: "center-stripe",
    collarType: "v-neck",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Switzerland",
    baseColor: "#d92734",
    secondaryColor: "#ffffff",
    accentColor: "#8f1720",
    patternType: "plain",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Tunisia",
    baseColor: "#f8f8f2",
    secondaryColor: "#d92734",
    accentColor: "#cfd8dc",
    patternType: "sleeve-trim",
    collarType: "crew",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "Turkey",
    baseColor: "#d92734",
    secondaryColor: "#ffffff",
    accentColor: "#8f1720",
    patternType: "chest-band",
    collarType: "crew",
    trimStyle: "minimal"
  },
  {
    nation: "Uruguay",
    baseColor: "#79c5eb",
    secondaryColor: "#ffffff",
    accentColor: "#111827",
    patternType: "plain",
    collarType: "foldover",
    trimStyle: "collar-and-cuffs"
  },
  {
    nation: "USA",
    baseColor: "#f8f8f4",
    secondaryColor: "#1f4e8c",
    accentColor: "#c9223a",
    patternType: "chest-band",
    collarType: "crew",
    trimStyle: "sleeve-cuffs"
  },
  {
    nation: "Uzbekistan",
    baseColor: "#f8f8f2",
    secondaryColor: "#1d8bd2",
    accentColor: "#1a9b61",
    patternType: "side-panels",
    collarType: "crew",
    trimStyle: "sleeve-cuffs"
  }
];

export function getKitConfigForPlayer(player: Player): NationKitConfig {
  const normalizedNation = normalizeNationName(player.nation);

  return (
    nationKitConfigs.find((config) => normalizeNationName(config.nation) === normalizedNation) ?? {
      nation: player.nation,
      baseColor: player.kitPrimaryColor,
      secondaryColor: player.kitSecondaryColor,
      accentColor: player.kitAccentColor,
      patternType: "sleeve-trim",
      collarType: "crew",
      trimStyle: "collar-and-cuffs"
    }
  );
}

function normalizeNationName(nation: string): string {
  const normalized = nation
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  const aliases: Record<string, string> = {
    "cote d ivoire": "ivory coast",
    "curacao": "curacao",
    "czech republic": "czechia",
    "democratic republic of congo": "dr congo",
    "drc": "dr congo",
    "turkiye": "turkey",
    "united states": "usa",
    "united states of america": "usa"
  };

  return aliases[normalized] ?? normalized;
}
