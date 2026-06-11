import type { Player } from "./types";

export function getKitAssetPath(player: Player, extension: "svg" | "png" = "svg"): string {
  return `/kits/${player.nationSlug || "default"}.${extension}`;
}

export const DEFAULT_KIT_ASSET_PATH = "/kits/default.svg";
