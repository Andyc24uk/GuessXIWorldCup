export const APP_TITLE = "Guess XI: World Cup";
export const FREE_DAILY_GAME_LIMIT = 3;
export const PRO_DAILY_GAME_LIMIT = 999;
export const LAUNCH_GAME_MODE = "casual" as const;
export const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === "true";
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

// TODO: Replace this with authenticated entitlement data when Stripe/payments are added.
export const HAS_PRO_PLACEHOLDER = false;
