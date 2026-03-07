import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="lp-footer">
      <div className="lp-footer-inner">
        <p className="lp-footer-copy">
          © {new Date().getFullYear()} NaturGeist Society for People and Planet.
        </p>
        <div className="lp-footer-links">
          <Link href="/our-mission">Our Mission</Link>
          <Link href="/join-us">Join Us</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/team">Team</Link>
        </div>
      </div>
    </footer>
  );
}
