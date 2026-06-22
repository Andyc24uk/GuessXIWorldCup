"use client";

import { useEffect, useState } from "react";
import AdSlot from "@/components/AdSlot";
import GameCard from "@/components/GameCard";
import SiteFooter from "@/components/SiteFooter";
import VersusEntryCard from "@/components/VersusEntryCard";
import { trackDailyLimitReached, trackPromoPreviewUsed } from "@/lib/analytics";
import { ADSENSE_ENABLED, APP_TITLE, LAUNCH_GAME_MODE, getDailyGameLimit } from "@/lib/constants";
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

        {ADSENSE_ENABLED ? (
          <div className="home-ad">
            <AdSlot placement="top" />
          </div>
        ) : null}
      </section>

      {selectedSlot ? <GameCard key={`${selectedSlot.playerId}-${activeSlot}-${dateKey}`} slot={selectedSlot} /> : <section className="game-card">Loading today&apos;s games...</section>}

      <section className="home-content-card" aria-labelledby="home-content-title">
        <div className="home-content-grid">
          <article className="content-section">
            <p className="content-eyebrow">About the game</p>
            <h2 id="home-content-title">What is Guess XI?</h2>
            <p>
              Guess XI: World Cup is a free daily football guessing game built for supporters who enjoy testing their memory, football knowledge,
              and feel for tournament squads. Each round asks you to identify a World Cup player from a growing trail of shirt-based visual cues and
              clue cards.
            </p>
          </article>

          <article className="content-section">
            <h2>How the football guessing game works</h2>
            <p>
              Daily Mode gives you three players each day. Start from the mystery shirt, enter a guess, and reveal more clues only when you need
              them. The aim is not just to get the answer, but to solve it before the late clues make the player obvious.
            </p>
          </article>

          <article className="content-section">
            <h2>Why clues and kits matter</h2>
            <p>
              Position, World Cup history, club information, career path, and late-stage hints all narrow the field in different ways. The kit
              reveal gives you one more visual push without relying on official badges, player photos, or tournament branding.
            </p>
          </article>

          <article className="content-section">
            <h2>Play daily or challenge friends</h2>
            <p>
              You can stick to the three daily games or open Versus Mode to create a shared challenge link. That makes Guess XI easy to drop into
              group chats, watch parties, lunch breaks, classroom debates, or pub quizzes without needing accounts or live multiplayer.
            </p>
          </article>

          <article className="content-section">
            <h2>Independent fan-made football trivia game</h2>
            <p>
              Guess XI is an independent, 100% unofficial football trivia project designed for fans around the world who are watching, enjoying,
              and celebrating the World Cup. It is designed for lightweight browser play with simple graphics and publicly available player data
              and does not make use of or purport to represent official tournament assets or player photography.
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
