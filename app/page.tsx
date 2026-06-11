"use client";

import { useEffect, useState } from "react";
import AdSlot from "@/components/AdSlot";
import GameCard from "@/components/GameCard";
import { APP_TITLE, FREE_DAILY_GAME_LIMIT, LAUNCH_GAME_MODE } from "@/lib/constants";
import { getLocalDateKey } from "@/lib/dailyGame";
import { loadOrCreateDailySlots } from "@/lib/storage";
import type { DailyGameSlot } from "@/lib/types";

export default function HomePage() {
  const [activeSlot, setActiveSlot] = useState(0);
  const [slots, setSlots] = useState<DailyGameSlot[]>([]);
  const dateKey = getLocalDateKey();
  const selectedSlot = slots[activeSlot] ?? slots[0];

  useEffect(() => {
    setSlots(loadOrCreateDailySlots(LAUNCH_GAME_MODE, dateKey));
  }, [dateKey]);

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">Daily football trivia</p>
          <h1>{APP_TITLE}</h1>
          <p className="subtitle">Guess the World Cup player from the shirt and clues.</p>
        </div>
        <div className="daily-pill" aria-label={`${FREE_DAILY_GAME_LIMIT} games today`}>
          <strong>{FREE_DAILY_GAME_LIMIT}</strong>
          <span>games today</span>
        </div>
      </section>

      <section className="control-panel" aria-label="Game options">
        <div className="slot-selector" aria-label="Daily game slots">
          {slots.map((slot) => (
            <button
              className={slot.slot === activeSlot ? "slot-button active" : "slot-button"}
              key={slot.slot}
              onClick={() => setActiveSlot(slot.slot)}
              type="button"
            >
              Game {slot.slot + 1}
            </button>
          ))}
        </div>
      </section>

      <AdSlot placement="top" />

      {selectedSlot ? <GameCard key={`${selectedSlot.playerId}-${activeSlot}-${dateKey}`} slot={selectedSlot} /> : <section className="game-card">Loading today&apos;s games...</section>}
      <footer className="site-footer">
        <a href="/privacy">Privacy Policy</a>
      </footer>
    </main>
  );
}
