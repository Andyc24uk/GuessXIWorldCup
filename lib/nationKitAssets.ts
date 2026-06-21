import type { Player } from "./types";

export type KitAssetColours = {
  shirt: string;
  shorts: string;
};

export const nationKitAssetColours: Record<string, KitAssetColours> = {
  "Algeria": { shirt: "white", shorts: "white" },
  "Argentina": { shirt: "sky-blue-white-vertical-stripes", shorts: "black" },
  "Australia": { shirt: "yellow", shorts: "green" },
  "Austria": { shirt: "red", shorts: "white" },
  "Belgium": { shirt: "red", shorts: "black" },
  "Bosnia and Herzegovina": { shirt: "blue", shorts: "blue" },
  "Brazil": { shirt: "yellow", shorts: "blue" },
  "Canada": { shirt: "red", shorts: "red" },
  "Cape Verde": { shirt: "blue", shorts: "blue" },
  "Colombia": { shirt: "yellow", shorts: "blue" },
  "Croatia": { shirt: "red-white-horizontal-stripes", shorts: "white" },
  "Curacao": { shirt: "blue", shorts: "blue" },
  "Czech Republic": { shirt: "red", shorts: "blue" },
  "DR Congo": { shirt: "sky-blue", shorts: "sky-blue" },
  "Ecuador": { shirt: "yellow", shorts: "navy" },
  "Egypt": { shirt: "red", shorts: "white" },
  "England": { shirt: "white", shorts: "navy" },
  "France": { shirt: "blue", shorts: "white" },
  "Germany": { shirt: "white", shorts: "black" },
  "Ghana": { shirt: "white", shorts: "white" },
  "Haiti": { shirt: "blue", shorts: "blue" },
  "Iran": { shirt: "white", shorts: "white" },
  "Iraq": { shirt: "green", shorts: "white" },
  "Ivory Coast": { shirt: "orange", shorts: "orange" },
  "Japan": { shirt: "blue", shorts: "blue" },
  "Jordan": { shirt: "white", shorts: "white" },
  "Mexico": { shirt: "green", shorts: "white" },
  "Morocco": { shirt: "red", shorts: "green" },
  "Netherlands": { shirt: "orange", shorts: "orange" },
  "New Zealand": { shirt: "black", shorts: "black" },
  "Norway": { shirt: "red", shorts: "navy" },
  "Panama": { shirt: "red", shorts: "red" },
  "Paraguay": { shirt: "red-white-vertical-stripes", shorts: "blue" },
  "Portugal": { shirt: "maroon", shorts: "green" },
  "Qatar": { shirt: "maroon", shorts: "maroon" },
  "Saudi Arabia": { shirt: "green", shorts: "green" },
  "Scotland": { shirt: "navy", shorts: "navy" },
  "Senegal": { shirt: "white", shorts: "white" },
  "South Africa": { shirt: "yellow", shorts: "green" },
  "South Korea": { shirt: "red", shorts: "red" },
  "Spain": { shirt: "red", shorts: "navy" },
  "Sweden": { shirt: "yellow", shorts: "blue" },
  "Switzerland": { shirt: "red", shorts: "red" },
  "Tunisia": { shirt: "white", shorts: "white" },
  "T\u00fcrkiye": { shirt: "red", shorts: "red" },
  "Uruguay": { shirt: "sky-blue", shorts: "black" },
  "United States": { shirt: "red-white-horizontal-stripes", shorts: "navy" },
  "Uzbekistan": { shirt: "white", shorts: "white" },
};

export function getNationKitAssetColours(player: Player): KitAssetColours {
  return getNationKitAssetColoursByNation(player.nation) ?? getNationKitAssetColoursByNation(player.nationality) ?? { shirt: "white", shorts: "white" };
}

export function getNationKitAssetColoursByNation(nation: string): KitAssetColours | undefined {
  const normalized = normalizeNationName(nation);
  const match = Object.entries(nationKitAssetColours).find(([configuredNation]) => normalizeNationName(configuredNation) === normalized);
  return match?.[1];
}

export function getAnswerKitAssetPaths(player: Player): { shirtSrc: string; shortsSrc: string } {
  const colours = getNationKitAssetColours(player);
  return {
    shirtSrc: `/kits/shirt-${colours.shirt}.png`,
    shortsSrc: `/kits/shorts-${colours.shorts}.png`
  };
}

export function getCountrySpecificShirtCandidates(player: Player): string[] {
  const slug = player.nationSlug || normalizeNationName(player.nation).replace(/ /g, "-");
  const compact = slug.replace(/-/g, "");
  const titleCompact = compact ? `${compact.charAt(0).toUpperCase()}${compact.slice(1)}` : "";

  return [...new Set([
    `/kits/${slug}_shirt.png`,
    `/kits/${compact}_shirt.png`,
    titleCompact ? `/kits/${titleCompact}_shirt.png` : ""
  ].filter(Boolean))];
}

function normalizeNationName(nation: string): string {
  return nation
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
