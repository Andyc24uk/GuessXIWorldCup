import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/how-to-play", label: "How to Play" },
  { href: "/clue-guide", label: "Clue Guide" },
  { href: "/versus", label: "Versus Mode" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" }
];

export default function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Site footer">
      <nav className="site-footer-links" aria-label="Footer navigation">
        {FOOTER_LINKS.map((link) => (
          <Link key={link.href} href={link.href}>
            {link.label}
          </Link>
        ))}
      </nav>
      <p className="site-footer-disclaimer">
        Guess XI is an independent football trivia game and is not affiliated with FIFA, national football associations, clubs, players, or
        tournament organisers.
      </p>
    </footer>
  );
}
