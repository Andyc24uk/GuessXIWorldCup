import { describe, expect, it, vi } from "vitest";
import { getPromoSlotFromSearch } from "@/lib/promo";

describe("promo preview slots", () => {
  it("creates a promo slot only when the key matches and player exists", () => {
    vi.stubEnv("NEXT_PUBLIC_PROMO_KEY", "secret-key");

    const slot = getPromoSlotFromSearch("?promoPlayer=kevin-de-bruyne&promoKey=secret-key", "2026-06-12");

    expect(slot?.isPromo).toBe(true);
    expect(slot?.playerId).toBe("kevin-de-bruyne");
    expect(slot?.selectionMode).toBe("promo");

    vi.unstubAllEnvs();
  });

  it("ignores promo parameters when the key is wrong", () => {
    vi.stubEnv("NEXT_PUBLIC_PROMO_KEY", "secret-key");

    const slot = getPromoSlotFromSearch("?promoPlayer=kevin-de-bruyne&promoKey=wrong-key", "2026-06-12");

    expect(slot).toBeNull();

    vi.unstubAllEnvs();
  });
});
