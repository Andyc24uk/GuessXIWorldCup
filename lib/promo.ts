import { LAUNCH_GAME_MODE } from "./constants";
import { getLocalDateKey } from "./dailyGame";
import { getPlayerByPromoSlug } from "./players";
import type { DailyGameSlot } from "./types";

const PROMO_KEY_PARAM = "promoKey";
const PREVIEW_KEY_PARAM = "previewKey";
const PROMO_PLAYER_PARAM = "promoPlayer";

export function getPromoSlotFromSearch(search: string, dateKey = getLocalDateKey()): DailyGameSlot | null {
  const configuredKey = process.env.NEXT_PUBLIC_PROMO_KEY;
  if (!configuredKey) {
    return null;
  }

  const params = new URLSearchParams(search);
  const providedKey = params.get(PROMO_KEY_PARAM) ?? params.get(PREVIEW_KEY_PARAM);
  if (providedKey !== configuredKey) {
    return null;
  }

  const promoPlayer = params.get(PROMO_PLAYER_PARAM);
  if (!promoPlayer) {
    return null;
  }

  const player = getPlayerByPromoSlug(promoPlayer);
  if (!player) {
    return null;
  }

  return {
    slot: 0,
    playerId: player.id,
    mode: LAUNCH_GAME_MODE,
    dateKey: `promo:${dateKey}:${player.id}`,
    isPromo: true,
    selectionMode: "promo",
    seedType: "promo"
  };
}
