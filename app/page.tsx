"use client";

import { useEffect, useState } from "react";
import AdSlot from "@/components/AdSlot";
import GameCard from "@/components/GameCard";
import VersusEntryCard from "@/components/VersusEntryCard";
import { trackDailyLimitReached, trackPromoPreviewUsed } from "@/lib/analytics";
import { APP_TITLE, LAUNCH_GAME_MODE, getDailyGameLimit } from "@/lib/constants";
import { getLocalDateKey } from "@/lib/dailyGame";
import { getPlayerById } from "@/lib/players";
import { getPromoSlotFromSearch } from "@/lib/promo";
import { loadOrCreateDailySlots, loadStoredGame } from "@/lib/storage";
import type { DailyGameSlot } from "@/lib/types";

const PUBLIC_PROMO_KEY = process.env.NEXT_PUBLIC_PROMO_KEY;

export default function HomePage() {
  const [activeSlot, setActiveSlot] = useState(0);
  const [slots, setSlots] = useState<DailyGameSlot[]>([]);
  const dateKey = getLocalDateKey();
  const dailyLimit = getDailyGameLimit(dateKey);
  const selectedSlot = slots[activeSlot] ?? slots[0];

  useEffect(() => {
    const promoSlot = getPromoSlotFromSearch(window.location.search, {
      dateKey,
      configuredKey: PUBLIC_PROMO_KEY,
      devWarnings: process.env.NODE_ENV !== "production"
    });
    if (promoSlot) {
      const promoPlayer = getPlayerById(promoSlot.playerId);
      setActiveSlot(0);
      setSlots([promoSlot]);
      if (promoPlayer) {
        trackPromoPreviewUsed({
          gameSlot: promoSlot.slot,
          playerId: promoPlayer.id,
          nation: promoPlayer.nation,
          fameTier: promoPlayer.fameTier,
          isPromo: true,
          selectionMode: "promo",
          seedType: "promo"
        });
      }
      return;
    }

    setSlots(loadOrCreateDailySlots(LAUNCH_GAME_MODE, dateKey, dailyLimit));
  }, [dailyLimit, dateKey]);

  useEffect(() => {
    if (
      slots.length >= dailyLimit &&
      slots.every((slot) => !slot.isPromo && loadStoredGame(slot.dateKey, slot.mode, slot.slot)?.completed)
    ) {
      trackDailyLimitReached({
        selectionMode: "daily-random",
        seedType: "user-day"
      });
    }
  }, [dailyLimit, slots]);

  return (
    <main className="app-shell">
      <section className="home-layout">
        <div className="home-left">
          <div className="hero-copy home-intro">
            <p className="eyebrow">Daily football trivia</p>
            <h1>{APP_TITLE}</h1>
            <p className="subtitle">Guess the World Cup player from the shirt and clues.</p>
          </div>

          <section className="control-panel home-tabs" aria-label="Game options">
            <div className="slot-selector" aria-label="Daily game slots">
              {slots.map((slot) => (
                <button
                  className={slot.slot === activeSlot ? "slot-button active" : "slot-button"}
                  key={slot.slot}
                  onClick={() => setActiveSlot(slot.slot)}
                  type="button"
                >
                  {slot.isPromo ? "Promo" : `Game ${slot.slot + 1}`}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="home-right desktop-only">
          <div className="daily-pill home-daily" aria-label={`${dailyLimit} games today`}>
            <strong>{dailyLimit}</strong>
            <span>games today</span>
          </div>

          <section className="desktop-versus-row" aria-label="Versus Mode">
            <VersusEntryCard />
          </section>
        </div>

        <section className="mobile-versus-row" aria-label="Versus Mode">
          <VersusEntryCard />
        </section>

        <div className="home-ad">
          <AdSlot placement="top" />
        </div>
      </section>

      {selectedSlot ? <GameCard key={`${selectedSlot.playerId}-${activeSlot}-${dateKey}`} slot={selectedSlot} /> : <section className="game-card">Loading today&apos;s games...</section>}
      <footer className="site-footer">
        <a href="/privacy">Privacy Policy</a>
        <a href="/contact">Contact</a>
      </footer>
    </main>
  );
}
