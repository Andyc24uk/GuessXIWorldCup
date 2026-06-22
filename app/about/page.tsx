import type { Metadata } from "next";
import HomeLink from "@/components/HomeLink";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "About Guess XI",
  description: "Learn what Guess XI: World Cup is, how it works, and why it was built for football fans."
};

export default function AboutPage() {
  return (
    <main className="content-shell">
      <article className="content-card">
        <HomeLink />
        <p className="content-eyebrow">About</p>
        <h1>About Guess XI: World Cup</h1>

        <p>
          Guess XI: World Cup is a free daily football guessing game. It is designed for fans who enjoy recognising players from their careers,
          roles, shirts, and clue patterns rather than from face photos or official tournament artwork.
        </p>

        <p>
          The core idea is simple: you get three players per day, each one starts as a mystery, and you try to identify the answer from the shirt
          and clue trail in as few reveals as possible. There is no login requirement, no account setup, and no app install needed to start
          playing.
        </p>

        <p>
          Guess XI was built for football fans during the World Cup, but it is meant to feel lightweight enough for a quick break and deep enough
          to reward real football knowledge. Some players are solved from one early clue. Others make you sweat all the way to the kit reveal.
        </p>

        <p>
          The project uses generic national-colour kit-inspired visuals rather than official badges, sponsorships, or player photography. Guess XI
          is an independent and unofficial football trivia game, and it is not affiliated with FIFA, national teams, clubs, players, or tournament
          organisers.
        </p>
      </article>
      <SiteFooter />
    </main>
  );
}
