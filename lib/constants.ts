export const APP_TITLE = "Guess XI: World Cup";
export const FREE_DAILY_GAME_LIMIT = 3;
export const PRO_DAILY_GAME_LIMIT = 999;
export const LAUNCH_GAME_MODE = "casual" as const;
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-2518560260230499";
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED !== "false" && Boolean(ADSENSE_CLIENT);
export const DAILY_GAME_LIMIT_OVERRIDES: Record<string, number> = {
  // "2026-06-15": 5,
};

// TODO: Replace this with authenticated entitlement data when Stripe/payments are added.
export const HAS_PRO_PLACEHOLDER = false;

export function getDailyGameLimit(dateKey: string): number {
  return DAILY_GAME_LIMIT_OVERRIDES[dateKey] ?? FREE_DAILY_GAME_LIMIT;
}
