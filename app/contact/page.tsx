export const metadata = {
  title: "Contact | Guess XI",
  description: "Contact Guess XI: World Cup."
};

export default function ContactPage() {
  return (
    <main className="privacy-shell">
      <article className="privacy-card">
        <p className="privacy-eyebrow">Contact</p>
        <h1>Contact Guess XI</h1>

        <p>
          Send feedback, corrections, player suggestions, bug reports, and business enquiries to{" "}
          <a href="mailto:GuessXI@Proton.me">GuessXI@Proton.me</a>.
        </p>

        <p>
          If you are reporting a data correction, please include the player name, the clue or field that needs attention, and any source that helps
          verify the change.
        </p>
      </article>
    </main>
  );
}
