import type { Metadata } from "next";
import HomeLink from "@/components/HomeLink";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Guess XI FAQ",
  description: "Answers to common questions about Daily Mode, Versus Mode, mobile play, clues, and data updates in Guess XI."
};

export default function FaqPage() {
  return (
    <main className="content-shell">
      <article className="content-card">
        <HomeLink />
        <p className="content-eyebrow">FAQ</p>
        <h1>Guess XI FAQ</h1>

        <section className="content-section">
          <h2>Is Guess XI free?</h2>
          <p>Yes. Guess XI is free to play in the browser.</p>
        </section>

        <section className="content-section">
          <h2>Do I need an account?</h2>
          <p>No. You do not need to create an account, sign in, or hand over an email address to play the core game.</p>
        </section>

        <section className="content-section">
          <h2>How many players can I guess per day?</h2>
          <p>Daily Mode currently gives you three players per day. Versus Mode is separate and can be used as often as you like.</p>
        </section>

        <section className="content-section">
          <h2>Are the daily players the same for everyone?</h2>
          <p>
            No, each user is given three randomly generated players from the database each day. However, Guess XI keeps your progress locally on
            your device so you can return to unfinished daily games or share your completed guesses with friends.
          </p>
        </section>

        <section className="content-section">
          <h2>What is Versus Mode?</h2>
          <p>
            Versus Mode creates a shared challenge link. Anyone who opens that link gets the same player, which makes it easy to compare results in
            group chats, classrooms, offices, pubs, or watch parties.
          </p>
        </section>

        <section className="content-section">
          <h2>Can I play on mobile?</h2>
          <p>Yes. Guess XI is built to work comfortably on phones as well as desktop browsers.</p>
        </section>

        <section className="content-section">
          <h2>Is this affiliated with FIFA, national teams, clubs, or players?</h2>
          <p>
            No. Guess XI is an independent football trivia game and is not affiliated with FIFA, national football associations, clubs, players, or
            tournament organisers.
          </p>
        </section>

        <section className="content-section">
          <h2>How do I report an issue or suggest a player?</h2>
          <p>
            Use the contact page and send details to GuessXI@Proton.me. Corrections, data fixes, missing players, and bug reports are all welcome.
          </p>
        </section>

        <section className="content-section">
          <h2>Why are some clues locked?</h2>
          <p>
            Clues are meant to reveal gradually. Some stay hidden until you make an incorrect guess or choose to reveal the next clue, which keeps
            the round challenging and lets you decide how much help you want.
          </p>
        </section>

        <section className="content-section">
          <h2>Which teams and players are included in the game?</h2>
          <p>
            Guess XI is designed to be inclusive for fans of all teams, while acknowledging that many squad players from less well-known nations
            will be too difficult for all but the most passionate supporters to guess. At least one player from each participating nation is
            included in the game, with full squads for selected countries.
          </p>
        </section>

        <section className="content-section">
          <h2>Will more players and kits be added?</h2>
          <p>
            Yes. The player database, clue quality, and kit coverage are intended to keep improving as the project grows and more football data is
            reviewed.
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
