export const metadata = {
  title: "Privacy Policy | Guess XI",
  description: "Privacy information for Guess XI: World Cup."
};

export default function PrivacyPage() {
  return (
    <main className="privacy-shell">
      <article className="privacy-card">
        <p className="privacy-eyebrow">Privacy</p>
        <h1>Privacy Policy</h1>

        <p>
          Guess XI uses localStorage and other browser storage to save game progress, guesses, daily limits, and recent-player history on your device.
          This helps the game remember your current daily games without requiring an account.
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
    </main>
  );
}
