import type { Metadata } from "next";
import HomeLink from "@/components/HomeLink";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "Guess XI Clue Guide",
  description: "A guide to every clue type in Guess XI: World Cup, from position and club clues to the final kit reveal."
};

export default function ClueGuidePage() {
  return (
    <main className="content-shell">
      <article className="content-card">
        <HomeLink />
        <p className="content-eyebrow">Clue Guide</p>
        <h1>Guess XI Clue Guide</h1>

        <p>
          Guess XI clues are meant to narrow the field in layers. Some clues point to a football role, some point to a country or club path, and
          some only become useful when you combine them with what you already know. Here is what each clue type is trying to tell you.
        </p>

        <section className="content-section">
          <h2>Position</h2>
          <p>
            Position gives you the broadest football identity first. It tells you whether you should be thinking about a goalkeeper, defender,
            midfielder, or forward, which immediately changes the kind of players you are scanning for in your head.
          </p>
        </section>

        <section className="content-section">
          <h2>World Cup appearances</h2>
          <p>
            World Cup appearance history helps split established tournament veterans from debutants. A player on their first World Cup often points
            toward a younger generation, while multiple past tournaments usually signal a longer international career.
          </p>
        </section>

        <section className="content-section">
          <h2>Club country</h2>
          <p>
            Club country is a strong geographic filter. Even before the actual club name appears, knowing whether the player works in England,
            Spain, Germany, Italy, Saudi Arabia, or elsewhere often removes a huge chunk of possible answers.
          </p>
        </section>

        <section className="content-section">
          <h2>Played alongside</h2>
          <p>
            Played alongside is there to trigger recognition through club links rather than repeating the national-team context. A famous
            teammate, former star, or recognisable club-mate can be the clue that makes a player click.
          </p>
        </section>

        <section className="content-section">
          <h2>International caps</h2>
          <p>
            Caps tell you how established a player is for the national team. A total in single figures suggests a newer international, while very
            high cap counts usually point to captains, long-term starters, or long-serving squad figures.
          </p>
        </section>

        <section className="content-section">
          <h2>Club team</h2>
          <p>
            Club team is often the moment the puzzle becomes concrete. Once the exact club arrives, you can combine it with nation, role, and
            experience to narrow in on a much smaller set of plausible answers.
          </p>
        </section>

        <section className="content-section">
          <h2>Career path</h2>
          <p>
            Career path is a compact club journey clue. It is especially useful when two players share a current club country or even the same
            club, because the route they took to get there often gives the answer away.
          </p>
        </section>

        <section className="content-section">
          <h2>International Goals &amp; Clean Sheets</h2>
          <p>
            International goals work differently depending on position. For attackers it can signal star status or finishing pedigree. For
            defenders and midfielders it can help separate players who share clubs or roles but have very different scoring records.
          </p>
          <p>
            For goalkeepers, this clue can switch to international clean sheets instead. That keeps the clue useful for keepers without pretending
            that goal totals tell the same story for every position.
          </p>
        </section>

        <section className="content-section">
          <h2>Notable fact</h2>
          <p>
            Notable fact is a late clue designed to give you something memorable rather than something purely statistical. It might point to a big
            tournament moment, a major honour, a record, or an unusual piece of football background that helps one player stand apart from the
            rest.
          </p>
        </section>

        <section className="content-section">
          <h2>Shirt number</h2>
          <p>
            Shirt number comes late because it can be very revealing for certain players. Some stars are closely associated with one national-team
            number, while others can only be separated from teammates once the squad number is visible.
          </p>
        </section>

        <section className="content-section">
          <h2>Kit reveal</h2>
          <p>
            Kit reveal is the final visual clue. It gives you the strongest national-colour signal without using official crests or tournament
            branding. By the time it appears, it should act as the last nudge rather than the whole solution.
          </p>
        </section>
      </article>
      <SiteFooter />
    </main>
  );
}
