import { LAUNCH_GAME_MODE } from "./constants";
import { getLocalDateKey } from "./dailyGame";
import { getPlayerByPromoSlug } from "./players";
import type { DailyGameSlot } from "./types";

const PROMO_KEY_PARAM = "promoKey";
const PREVIEW_KEY_PARAM = "previewKey";
const PROMO_PLAYER_PARAM = "promoPlayer";

type PromoSlotOptions = {
  dateKey?: string;
  configuredKey?: string;
  devWarnings?: boolean;
};

export function getPromoSlotFromSearch(search: string, dateKeyOrOptions: string | PromoSlotOptions = getLocalDateKey()): DailyGameSlot | null {
  const options = typeof dateKeyOrOptions === "string" ? { dateKey: dateKeyOrOptions } : dateKeyOrOptions;
  const dateKey = options.dateKey ?? getLocalDateKey();
  const configuredKey = options.configuredKey ?? process.env.NEXT_PUBLIC_PROMO_KEY;
  const devWarnings = options.devWarnings ?? process.env.NODE_ENV !== "production";

  if (!configuredKey) {
    warnPromoFailure("env var missing", devWarnings);
    return null;
  }

  const params = new URLSearchParams(search);
  const providedKey = params.get(PROMO_KEY_PARAM) ?? params.get(PREVIEW_KEY_PARAM);
  if (providedKey !== configuredKey) {
    warnPromoFailure("key mismatch", devWarnings);
    return null;
  }

  const promoPlayer = params.get(PROMO_PLAYER_PARAM);
  if (!promoPlayer) {
    return null;
  }

  const player = getPlayerByPromoSlug(promoPlayer);
  if (!player) {
    warnPromoFailure(`player not found: ${promoPlayer}`, devWarnings);
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

function warnPromoFailure(reason: string, enabled: boolean): void {
  if (!enabled) {
    return;
  }

  console.warn(`[Guess XI promo] ${reason}`);
}
