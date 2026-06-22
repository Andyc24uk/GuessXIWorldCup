"use client";

import { useEffect } from "react";
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from "@/lib/constants";

type AdSlotProps = {
  placement: "top" | "post-game" | "footer";
  className?: string;
};

const AD_SLOT_IDS: Record<AdSlotProps["placement"], string | undefined> = {
  top: process.env.NEXT_PUBLIC_ADSENSE_TOP_SLOT,
  "post-game": process.env.NEXT_PUBLIC_ADSENSE_POST_GAME_SLOT,
  footer: process.env.NEXT_PUBLIC_ADSENSE_FOOTER_SLOT
};

export default function AdSlot({ placement, className }: AdSlotProps) {
  const slotId = AD_SLOT_IDS[placement];
  const canRenderAdSense = ADSENSE_ENABLED && ADSENSE_CLIENT && slotId;

  useEffect(() => {
    if (!canRenderAdSense) {
      return;
    }

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // Ad blockers, missing approval, or empty inventory should never affect gameplay.
    }
  }, [canRenderAdSense]);

  if (!canRenderAdSense) {
    return null;
  }

  return (
    <aside className={["ad-slot", `ad-slot-${placement}`, className].filter(Boolean).join(" ")} aria-label="Advertisement">
      <span>Advertisement</span>
      <ins
        className="adsbygoogle"
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
        style={{ display: "block" }}
      />
    </aside>
  );
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}
