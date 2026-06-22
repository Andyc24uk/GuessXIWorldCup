import type { Metadata } from "next";
import HomeLink from "@/components/HomeLink";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "How to Play Guess XI",
  description: "Learn the rules for Daily Mode, clue reveals, kit reveals, solving players, and Versus Mode in Guess XI."
};

export default function HowToPlayPage() {
  return (
    <main className="content-shell">
      <article className="content-card">
        <HomeLink />
        <p className="content-eyebrow">How to Play</p>
        <h1>How to Play Guess XI</h1>

        <section className="content-section">
          <h2>Daily Mode</h2>
          <p>
            Daily Mode gives you three footballers to solve each day. Open Game 1, Game 2, or Game 3 and work through them one at a time. There
            is no login needed because your progress is saved in your browser.
          </p>
        </section>

        <section className="content-section">
          <h2>How guessing works</h2>
          <p>
            Every round starts with the first clue already revealed. Type a player name into the guess box and pick from the autocomplete list if
            you want. A correct answer ends the round immediately. An incorrect answer keeps the round alive and reveals the next clue.
          </p>
        </section>

        <section className="content-section">
          <h2>Clue reveal flow</h2>
          <p>
            You can either submit a guess or press the reveal button to unlock the next hint. Early clues are broader. Later clues get more
            specific. The aim is to solve the player before the final clues remove too much of the mystery.
          </p>
        </section>

        <section className="content-section">
          <h2>How the kit reveal helps</h2>
          <p>
            The last clue is the kit reveal. It shows the player&apos;s national-colour shirt image without immediately handing over the answer.
            That final visual check is often enough to separate two similar candidates, especially when you already suspect the nation.
          </p>
        </section>

        <section className="content-section">
          <h2>What happens when the player is solved</h2>
          <p>
            When you solve a player, the full answer view appears with the name, nation, role, and final kit display. If you miss every clue, the
            answer is revealed so the round still ends cleanly and you can review what you missed.
          </p>
        </section>

        <section className="content-section">
          <h2>Spoiler-free sharing and results</h2>
          <p>
            Guess XI lets you share your result without spoiling the answer for someone else. The share output focuses on how many clues you needed
            rather than dumping the clue trail into the message.
          </p>
        </section>

        <section className="content-section">
          <h2>Versus Mode</h2>
          <p>
            Versus Mode creates a shared challenge link so friends can play the same player and compare scores manually. It is separate from your
            daily games, so you can use it for group chats, office bragging rights, or match-night side games without burning through the daily
            limit.
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
