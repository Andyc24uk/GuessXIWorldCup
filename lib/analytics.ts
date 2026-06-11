import { track } from "@vercel/analytics";

type AnalyticsValue = string | number | boolean | null | undefined;
type AnalyticsProperties = Record<string, AnalyticsValue>;

function safeTrack(eventName: string, properties: AnalyticsProperties = {}): void {
  try {
    track(eventName, compactProperties(properties));
  } catch {
    // Analytics should never affect gameplay.
  }
}

function compactProperties(properties: AnalyticsProperties): Record<string, string | number | boolean | null> {
  return Object.fromEntries(Object.entries(properties).filter(([, value]) => value !== undefined)) as Record<string, string | number | boolean | null>;
}

export function trackGameStart(properties: AnalyticsProperties): void {
  safeTrack("game_start", properties);
}

export function trackClueRevealed(properties: AnalyticsProperties): void {
  safeTrack("clue_revealed", properties);
}

export function trackGuessSubmitted(properties: AnalyticsProperties): void {
  safeTrack("guess_submitted", properties);
}

export function trackGameSolved(properties: AnalyticsProperties): void {
  safeTrack("game_solved", properties);
}

export function trackGameFailed(properties: AnalyticsProperties): void {
  safeTrack("game_failed", properties);
}

export function trackAnswerRevealed(properties: AnalyticsProperties): void {
  safeTrack("answer_revealed", properties);
}

export function trackCopyResult(properties: AnalyticsProperties): void {
  safeTrack("copy_result", properties);
}

export function trackDailyLimitReached(properties: AnalyticsProperties = {}): void {
  safeTrack("daily_limit_reached", properties);
}

export function trackPromoPreviewUsed(properties: AnalyticsProperties): void {
  safeTrack("promo_preview_used", properties);
}
