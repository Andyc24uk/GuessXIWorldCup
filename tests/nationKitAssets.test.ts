import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { getAnswerKitAssetPaths, getNationKitAssetColoursByNation, nationKitAssetColours } from "@/lib/nationKitAssets";
import { players } from "@/lib/players";

describe("nation kit asset picker", () => {
  it("includes all World Cup nations in the launch player pool", () => {
    const playerNations = new Set(players.map((player) => player.nation));

    for (const nation of playerNations) {
      expect(getNationKitAssetColoursByNation(nation), nation).toBeDefined();
    }
  });

  it("points every configured nation to existing shirt and shorts assets", () => {
    for (const nation of Object.keys(nationKitAssetColours)) {
      const player = players.find((item) => item.nation === nation) ?? players[0];
      const { shirtSrc, shortsSrc } = getAnswerKitAssetPaths({ ...player, nation });

      expect(existsSync(join(process.cwd(), "public", shirtSrc)), shirtSrc).toBe(true);
      expect(existsSync(join(process.cwd(), "public", shortsSrc)), shortsSrc).toBe(true);
    }
  });
});
