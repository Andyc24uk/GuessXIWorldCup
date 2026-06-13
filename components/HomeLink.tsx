import Link from "next/link";

type HomeLinkProps = {
  label?: string;
};

export default function HomeLink({ label = "Back to Home" }: HomeLinkProps) {
  return (
    <Link className="subtle-home-link" href="/">
      {label}
    </Link>
  );
}
