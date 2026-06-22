import HomeLink from "@/components/HomeLink";
import SiteFooter from "@/components/SiteFooter";

export const metadata = {
  title: "Privacy Policy | Guess XI",
  description: "Privacy information for Guess XI: World Cup."
};

export default function PrivacyPage() {
  return (
    <main className="content-shell">
      <article className="content-card">
        <HomeLink />
        <p className="content-eyebrow">Privacy</p>
        <h1>Privacy Policy</h1>

        <p>
          Guess XI uses localStorage and other browser storage to save game progress, guesses, daily limits, cooldown/no-repeat history, and game
          state on your device. This helps the game remember your current daily games without requiring an account.
        </p>

        <p>
          Guess XI uses privacy-friendly analytics to understand page views and gameplay events, such as clue reveals, completed games, and copied
          results. Normal gameplay does not require an account, and Guess XI does not collect names or email addresses for normal play.
        </p>

        <p>
          Guess XI may use Google AdSense to display ads. Google and third parties may use cookies, web beacons, IP addresses, or similar
          technologies for ad serving, measurement, and personalization.
        </p>

        <p>
          You can learn more about how Google uses data from sites and apps that use its services at{" "}
          <a href="https://policies.google.com/technologies/partner-sites" rel="noreferrer" target="_blank">
            policies.google.com/technologies/partner-sites
          </a>
          .
        </p>

        <p>
          Guess XI is an independent football guessing game and is not affiliated with FIFA, national teams, clubs, players, leagues, or kit
          manufacturers.
        </p>
      </article>
      <SiteFooter />
    </main>
  );
}
