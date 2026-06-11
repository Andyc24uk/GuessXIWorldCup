import { afterEach, describe, expect, it, vi } from "vitest";
import { getPromoSlotFromSearch } from "@/lib/promo";

describe("promo preview slots", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("resolves Bernardo Silva from a slug with the correct key", () => {
    vi.stubEnv("NEXT_PUBLIC_PROMO_KEY", "secret-key");

    const slot = getPromoSlotFromSearch("?promoPlayer=bernardo-silva&promoKey=secret-key", {
      dateKey: "2026-06-12",
      devWarnings: false
    });

    expect(slot?.isPromo).toBe(true);
    expect(slot?.playerId).toBe("bernardo-silva");
    expect(slot?.selectionMode).toBe("promo");
  });

  it("resolves Bernardo Silva from a display name with the correct key", () => {
    vi.stubEnv("NEXT_PUBLIC_PROMO_KEY", "secret-key");

    const slot = getPromoSlotFromSearch("?promoPlayer=Bernardo%20Silva&previewKey=secret-key", {
      dateKey: "2026-06-12",
      devWarnings: false
    });

    expect(slot?.playerId).toBe("bernardo-silva");
  });

  it("resolves a player from an accepted-answer alias when possible", () => {
    vi.stubEnv("NEXT_PUBLIC_PROMO_KEY", "secret-key");

    const slot = getPromoSlotFromSearch("?promoPlayer=Bernardo&promoKey=secret-key", {
      dateKey: "2026-06-12",
      devWarnings: false
    });

    expect(slot?.playerId).toBe("bernardo-silva");
  });

  it("ignores promo parameters when the key is wrong", () => {
    vi.stubEnv("NEXT_PUBLIC_PROMO_KEY", "secret-key");

    const slot = getPromoSlotFromSearch("?promoPlayer=bernardo-silva&promoKey=wrong-key", {
      dateKey: "2026-06-12",
      devWarnings: false
    });

    expect(slot).toBeNull();
  });

  it("ignores promo parameters when the env key is missing", () => {
    const slot = getPromoSlotFromSearch("?promoPlayer=bernardo-silva&promoKey=secret-key", {
      dateKey: "2026-06-12",
      configuredKey: undefined,
      devWarnings: false
    });

    expect(slot).toBeNull();
  });

  it("ignores promo parameters when the player is unknown", () => {
    vi.stubEnv("NEXT_PUBLIC_PROMO_KEY", "secret-key");

    const slot = getPromoSlotFromSearch("?promoPlayer=unknown-player&promoKey=secret-key", {
      dateKey: "2026-06-12",
      devWarnings: false
    });

    expect(slot).toBeNull();
  });
});
