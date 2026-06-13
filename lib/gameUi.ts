import type { DailyGameSlot } from "./types";

export function shouldShowVersusPlayAgain(slot: DailyGameSlot, completed: boolean): boolean {
  return completed && slot.selectionMode === "versus";
}
