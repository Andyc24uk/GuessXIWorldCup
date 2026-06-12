import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getConfiguredFlagNations, getFlagAssetForNation } from "@/lib/flags";
import { players } from "@/lib/players";

describe("flag assets", () => {
  it("has an SVG flag asset for every player nation", () => {
    const configuredNations = new Set(getConfiguredFlagNations());
    const playerNations = new Set(players.map((player) => player.nation));

    for (const nation of playerNations) {
      expect(configuredNations.has(nation), `${nation} should have a configured flag asset`).toBe(true);
      const assetPath = getFlagAssetForNation(nation);
      expect(assetPath.endsWith(".svg")).toBe(true);
      expect(existsSync(join(process.cwd(), "public", assetPath)), `${assetPath} should exist`).toBe(true);
    }
  });

  it("uses the provided Australia source asset rather than a generated placeholder", () => {
    expect(getFlagAssetForNation("Australia")).toBe("/flags/australia.svg");
    const australiaFlag = join(process.cwd(), "public", "flags", "australia.svg");
    expect(existsSync(australiaFlag)).toBe(true);
  });
});
